import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import  { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface EffiencyHeatmapProps {
    xAxisLabel: string;
    height: number;
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
    const [chartWidth, setChartWidth] = useState<number>(2000)

    let series: { name: string; data: (number | null)[] }[] = heatmapData.data.map(hourGroup => ({
        name: hourGroup.hourGroup,
        data: hourGroup.operation.map(op => op.efficiency === null ? -1 : op.efficiency)
    }));

    const chartRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<any>([]);
    

    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex ,w }:{series:any, seriesIndex:any, dataPointIndex:any,w:any}) {

              const value = series[seriesIndex][dataPointIndex];
              const category = w.globals.categoryLabels[dataPointIndex];
              const eliotDevice = value.eliotid;
              return `<div style="padding: 10px; color: #000;">
                       
                      
                        <strong>Machine Id: </strong> ${heatmapData.machines && heatmapData.machines[dataPointIndex]} <br/>
                        <strong>Sewing Id: </strong> ${heatmapData.eliot && heatmapData.eliot[dataPointIndex]} <br/>
                
                         
                      </div>`;
            },
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: 24,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: -10,
                            to: 0,
                            name: 'No Data',
                            color: '#FFFFFF'
                        },
                        {
                            from: 1,
                            to: 50000,
                            name: 'Nuber of Products',
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
                }, rotate: -90,
                minHeight: 400,
            },
            categories: categories,
        
           
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
        },
    };

   

  





    // const chartWidth = heatmapData && heatmapData.categories.length > 0 ? heatmapData.categories.length * 100 : 1000;
    const width = heatmapData && heatmapData.categories.length > 0 ?heatmapData.categories.length * 60 : 600;
    return (
        // <div className='bg-slate-100 pt-5 pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>
                    <div>
                    <div className=' '>

            <div id="chart"  ref={chartRef}>
                <ReactApexChart options={options} series={series} type="heatmap" height={550+"%"} width={chartWidth} />
            </div>
            <div id="html-dist"></div>
 

        </div>
        {/* Button Section */}
 {true && (
      <div className="flex flex-col items-center mt-5">
        {/* <div className="flex gap-2">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div> */}

        {/* <div className="flex gap-3 mt-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={saveAsExcel}>
            Save as Excel
          </Button>
        </div> */}
      </div>
    )}
                    </div>
        
        
    )
}

export default EffiencyHeatmap