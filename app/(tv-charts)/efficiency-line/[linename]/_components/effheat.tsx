"use client"

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface EffiencyHeatmapProps {
    xAxisLabel: string;
    efficiencyLow?: number;
    efficiencyHigh?: number;
    heatmapData: OperationEfficiencyOutputTypes;
}



const EffiencyHeatmap = ({
    xAxisLabel,
    efficiencyLow = 70,
    efficiencyHigh = 80,
    heatmapData
}: EffiencyHeatmapProps) => {
    const categories = heatmapData.categories || [];
    const [chartWidth, setChartWidth] = useState<number>(1850);
    const chartRef = useRef<HTMLDivElement>(null);


const PART_COLORS = {
    front: { bg: '#7dd3fc', text: '#082f49' },
    back: { bg: '#075985', text: '#bae6fd' },
    assembly: { bg: '#4f46e5', text: '#e0e7ff' },
    'line-end': { bg: '#334155', text: '#f1f5f9' }
};

console.log(heatmapData.part)
    let series: { name: string; data: (number | null)[] }[] = heatmapData.data.map(hourGroup => ({
        name: hourGroup.hourGroup,
        data: hourGroup.operation.map(op => op.efficiency === null ? -1 : op.efficiency)
    }));

    const totalCount = series.length;
    const height = totalCount < 50 ? '600%' : totalCount < 60 ? '700%' : '600%';

    const parts=heatmapData.part

    const partChangeIndices: number[] = [];
let lastPart = parts && parts[0];

parts?.map((op, index) => {
    if (op !== lastPart) {
        partChangeIndices.push(index); // Store index where part changes
    }
    lastPart = op
});

const partChangeCategories = partChangeIndices.map(index => categories[index],);
console.log("las",lastPart)
console.log("last",partChangeIndices)

    console.log("parts",heatmapData.part)
    const options = {
        chart: {
            type: 'heatmap' as const,
            // background: '#1e1e1e', // Explicit dark background
            foreColor: '#fff', // Default text color
        },
        
        tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex, w }: { series: any, seriesIndex: any, dataPointIndex: any, w: any }) {
                return `<div style="padding: 10px; color: #000;">
                    <strong>Machine Id: </strong> ${heatmapData.machines && heatmapData.machines[dataPointIndex]} <br/>
                    <strong>Sewing Id: </strong> ${heatmapData.eliot && heatmapData.eliot[dataPointIndex]} <br/>
                </div>`;
            },
        },legend: {

            labels: {
            
            colors: '#d4d4d4'
            
            }
            
            },
            annotations: {
                xaxis: partChangeCategories.map((index) => ({
                    x: index,
                    strokeDashArray: 0,
                    borderColor: '#0096FF',
                    borderWidth: 2,
                    label: {
                        text: '',
                        style: {
                            color: 'black',
                            background: 'transparent',
                        },
                    },
                })),
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
                            to: -0.9,
                            name: 'No Data',
                            color: '#f1f5f9'
                        },
                        {
                            from: 0,
                            to: efficiencyLow,
                            name: 'Low(Below 70%)',
                            color: '#ef4444'
                        },
                        {
                            from: efficiencyLow,
                            to: efficiencyHigh,
                            name: 'Medium(70% - 80%)',
                            color: '#fcd303'
                        },
                        {
                            from: efficiencyHigh,
                            to: 10000,
                            name: 'High(above 80%)',
                            color: '#16a34a'
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff'],
                fontSize: '10px',
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
                    colors: '#d4d4d4',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
                rotate: -90,
                minHeight: 420,
            },
            categories: categories,
        },
        yaxis: {
            tickHeight: 50,
            title: {
                text: "Time",
                style: {
                    color: '#d4d4d4',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                }
            },
            labels: {
                style: {
                    colors: '#d4d4d4',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    height: 50
                },
                offsetY: 10,
            },
        },
    };

    return (
        <div className="mx-auto h-auto w-full">
            <div id="chart" ref={chartRef} >
               <div className='w-full'>
                <ReactApexChart 
                    options={options} 
                    series={series} 
                    type="heatmap" 
                    
                    
                />
               </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-5 2xl:hidden ">
                <Button 
                    onClick={() => setChartWidth((p) => p + 200)} 
                    className="rounded-full bg-gray-300"
                >
                    +
                </Button>
                <Button 
                    onClick={() => setChartWidth((p) => p - 200)} 
                    className="rounded-full bg-gray-300"
                >
                    -
                </Button>
            </div>
        </div>
    );
}

export default EffiencyHeatmap;