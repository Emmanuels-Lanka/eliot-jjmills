"use client"

import React, { useEffect, useState } from 'react';
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



    
    let series: { name: string; data: (number | null)[] }[] = heatmapData.data.map(hourGroup => ({
        name: hourGroup.hourGroup,
        data: hourGroup.operation.map(op => op.efficiency === null ? -1 : op.efficiency)
    }));

    const totalCount = series.length;
    const height = totalCount < 50 ? '600%' : totalCount < 60 ? '700%' : '600%';
    

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
                            to: -1,
                            name: 'No Data',
                            color: '#FFFFFF'
                        },
                        {
                            from: 0,
                            to: 50000,
                            name: 'Nubmer of Products',
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
                minHeight: 550,
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


    return (
       <div className="mx-auto max-w-full h-full w-full">
                   <div id="chart" ref={chartRef} className='w-full'>
                       <ReactApexChart 
                           options={options} 
                           series={series} 
                           type="heatmap" 
                           height={height}
                           width={chartWidth}
                       />
                   </div>
                   
                   <div className="flex justify-center gap-2 mt-5 2xl:hidden">
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