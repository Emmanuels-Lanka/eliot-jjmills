"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { geOperationList, getData, getEliotMachineList } from "./actions";

interface AnalyticsChartProps {
    obbSheetId: string;
    date: string;
}

const xAxisLabel = "Operations";

const ensureAllCategoriesHaveData = (series: any, categories: any, defaultValue = -1) => {
    return series.map((serie: any) => {
        const filledData = categories.map((category: any) => {
            const dataPoint = serie.data.find((d: any) => d.x === category);
            return {
                x: category,
                y: dataPoint ? dataPoint.y : defaultValue,
                eliotid: serie.eliotid
            };
        });
        return {
            ...serie,
            data: filledData,
        };
    });
};

const HmapChart5MinCompo = ({
    obbSheetId,
    date
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const [heatmapData, setHeatmapData] = useState<any[] | null>([]);
    const [heatmapFullData, setHeatmapFullData] = useState<any | null>(null);
    const [operationList, setoperationList] = useState<any[]>([]);
    const [EliotDeviceList, setEliotDeviceList] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [eliotIdList, seteliotIdList] = useState<any[]>([]);
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<any>([]);

    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) {
                const value = series[seriesIndex][dataPointIndex];
                return `<div style="padding: 10px; color: #000;">
                    <strong>Eliot Device Id: </strong> ${eliotIdList[dataPointIndex]?.serialNumber} <br/>
                    <strong>Machine Id: </strong> ${eliotIdList[dataPointIndex]?.machineId} <br/>
                    <strong>Operation: </strong> ${operationList[dataPointIndex]?.name} <br/>
                </div>`;
            },
        },
        plotOptions: {
            heatmap: {
                distributed: true,
                enableShades: false,
                radius: 50,
                useFillColorAsStroke: true,
                colorScale: {
                    ranges: [
                        {
                            from: -10,
                            to: 0,
                            name: 'No Data',
                            color: '#FFFFFF'
                        },
                        {
                            from: 0,
                            to: 50000,
                            name: 'Data',
                            color: '#0171c1'
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            }
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            title: {
                text: xAxisLabel,
                style: {
                    color: '#0070c0',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                }
            },
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
                rotate: -90,
                minHeight: 400,
            },
            categories: operationList.map(o => o.name),
        },
        yaxis: {
            title: {
                text: "Time",
                style: {
                    color: '#0070c0',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                }
            },
            labels: {
                rotate: 0,
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
                offsetY: 10,
            },
        },
    };

    const handleFetchProductions = async () => {
        try {
            setIsSubmitting(true);
            const sqlDate = date + "%";
            const prod: any[] = await getData(obbSheetId, sqlDate);
            const eliot = prod.map((m) => (m.eliotid));
            
            const opList = await geOperationList(obbSheetId, sqlDate);
            setoperationList(opList);

            const s = await getEliotMachineList(obbSheetId, sqlDate);
            seteliotIdList(s);

            const heatmapDatas = getProcessData(prod as any[], operationList as any[]);
            setHeatmapData(heatmapDatas);
            
            setIsSubmitting(false);
        } catch (error: any) {
            console.error("Error fetching production data:", error);
            toast({
                title: "Something went wrong! Try again",
                variant: "error",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            ERROR: {error.message}
                        </code>
                    </div>
                ),
            });
        }
    };

    useEffect(() => {
        if (heatmapData?.length ?? 0 > 0) {
            const filledSeries = ensureAllCategoriesHaveData(heatmapData, operationList.map(o => o.name));
            setHeatmapFullData(filledSeries);
        }
    }, [heatmapData]);

    useEffect(() => {
        handleFetchProductions();
    }, [obbSheetId, date]);

    const saveAsPDF = async () => {
        if (chartRef.current) {
            const svg = chartRef.current.querySelector("svg");
            
            if (!svg) {
                console.error("SVG not found");
                return;
            }
        
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
        
            const svgRect = svg.getBoundingClientRect();
            canvas.width = svgRect.width;
            canvas.height = svgRect.height;
        
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            img.src = "data:image/svg+xml;base64," + window.btoa(svgData);
        
            img.onload = () => {
                context?.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL("image/png");
        
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [canvas.width, canvas.height + 150],
                });
        
                pdf.addImage(imgData, "PNG", 0, 150, canvas.width, canvas.height);

                const baseUrl = window.location.origin;
                const logoUrl = `${baseUrl}/logo.png`;
        
                const logo = new Image();
                logo.src = logoUrl;
                const logoWidth = 110;
                const logoHeight = 50;
                const logoX = (canvas.width / 2) - (logoWidth + 250);
                const logoY = 50;
        
                pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
                pdf.setTextColor(0, 113, 193);
                pdf.setFontSize(30);
                pdf.text('Dashboard - Production HeatMap (5)', logoX + logoWidth + 10, 83, { align: 'left' });
                pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);
                pdf.save("chart.pdf");
            };
        }
    };

    const saveAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(chartData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
        XLSX.writeFile(workbook, `chart-data.xlsx`);
    };

    let height;
    if (heatmapData) {
        if (heatmapData.length > 30) {
            height = heatmapData.length * 40;
        } else {
            if (heatmapData.length > 20) {
                height = heatmapData.length * 50;
            } else if (heatmapData.length < 10) {
                height = heatmapData.length * 90;
            } else {
                height = heatmapData.length * 80;
            }
        }
    }
    const width = operationList && operationList.length > 0 ? operationList.length * 40 : 600;

    return (
        <>
            <div className="mx-auto max-w-[1680px]">
                {<div className="flex justify-center items-center">
                    <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                </div>}
                {heatmapFullData !== null ? (
                    <div className='bg-slate-50 pt-5 rounded-lg border w-full h-[500px] mb-16 overflow-scroll'>
                        <div ref={chartRef}>
                            <h2 className="text-lg mb-2 font-medium text-slate-700">{" "}</h2>
                            <ReactApexChart options={options} series={heatmapFullData} type="heatmap" height={height} width={width} />
                        </div>
                    </div>
                ) : (
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                )}
            </div>
            {true && (
                <div className="flex flex-col items-center mt-5">
                    <div className="flex gap-3 mt-3">
                        <Button type="button" className="mr-3" onClick={saveAsPDF}>
                            Save as PDF
                        </Button>
                        <Button type="button" onClick={saveAsExcel}>
                            Save as Excel
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HmapChart5MinCompo;

export const getTimeSlotLabel = (hr: number, minIndex: number): string => {
    const minutes = minIndex * 5;
    const nextMinutes = (minIndex + 1) * 5;
    const nextHour = nextMinutes === 60 ? hr + 1 : hr;
    const endMinutes = nextMinutes === 60 ? 0 : nextMinutes;
    
    return `${hr.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}-${nextHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

export const getAdjustedTimeSlot = (timestamp: string): { hour: number; minIndex: number } => {
    const date = new Date(timestamp);
    const minutes = date.getMinutes();
    const hours = date.getHours();
    
    // Calculate 5-minute index (0-11 for each hour)
    const minIndex = Math.floor(minutes / 5);
    
    return {
        hour: hours,
        minIndex: minIndex
    };
};

export const getProcessData = (data: any[], operationList: any[]): any[] => {
    const fmtDataSeries = [];
    
    const dataWithMinutes = data.map((d) => {
        const { hour, minIndex } = getAdjustedTimeSlot(d.timestamp);
        return {
            ...d,
            hour,
            minIndex,
        };
    });
    
    const result = Object.groupBy(dataWithMinutes, (d) => 
        getTimeSlotLabel(d.hour, d.minIndex)
    );

    for (const [key, value] of Object.entries(result)) {
        const dataGBOp = Object.groupBy(value || [], (d) => d.name);
        const dataPoints = [];
        
        for (const [opKey, opValue] of Object.entries(dataGBOp)) {
            const v = opValue?.reduce((a, d) => a + (d?.count ?? 0), 0);
            dataPoints.push({ 
                x: opKey, 
                y: v ?? 0,
                eliotid: opValue?.[0].eliotid ?? 0 
            });
        }

        fmtDataSeries.push({ name: key, data: dataPoints });
    }

    return fmtDataSeries;
};