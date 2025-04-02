import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { custom } from 'zod';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RoamingQcHeatmapProps {
    heatmapData: RoamingQcChartFunctionOutputTypes;
}

const RoamingQcHeatmap = ({
    heatmapData
}: RoamingQcHeatmapProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    const colorMapping = {
        'null': -1,
        'green': 0, // For green
        'yellow': 1, // For yellow
        'red': 2,    // For red
        'black': 3, // For black
    };

    const colorScaleRanges = [
        {
            from: -1.9,
            to: -0.5,
            name: 'Not inspected',
            color: '#e2e8f0'
        },
        {
            from: -0.5,
            to: 0.5,
            name: 'No Defects',      // green
            color: '#008000'
        },
        {
            from: 0.5,
            to: 1.5,
            name: '1 Defect',     // yellow
            color: '#ffbf00'
        },
        {
            from: 1.5,
            to: 2.5,
            name: '2 Defects',        // red
            color: '#FF0000'
        },
        {
            from: 2.5,
            to: 3.5,
            name: '3 Defects',      // black
            color: '#000000'
        },
    ];


    const formatHeatmapData = (heatmapData: RoamingQcChartFunctionOutputTypes) => {
        const { data, categories } = heatmapData;

        return data.map(hourData => ({
            name: hourData.hourGroup,
            data: categories.map(category => {
                const operation = hourData.operation.find(op => op.name === category);
                const colorValue = operation && colorMapping.hasOwnProperty(operation.color) ? colorMapping[operation.color as keyof typeof colorMapping] : -1;
                return {
                    x: category,
                    y: colorValue ?? -1 // Fallback to 0 if `colorValue` is undefined
                };
            })
        }));
    };

    const series = formatHeatmapData(heatmapData);

    const options = {
        chart: {
            type: 'heatmap' as const,
            toolbar: {
                show: true,
                tools: {
                    download: true
                }
            }
        },
        tooltip: {
            custom: function(){
                return null;
            }
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: 24,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: colorScaleRanges,
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['transparent']
            }
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            title: {
                text: "Operations",
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
                rotate: -45,
                rotateAlways: true,
                minHeight: 350,
            },
            categories: heatmapData.categories,
        },
        yaxis: {
            show: true,
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
        },
        grid: {
            padding: {
                right: 20
            }
        }
    };

    const width: string = heatmapData.categories.length < 15 ? '100%' : heatmapData.categories.length < 21 ? '100%' : heatmapData.categories.length < 30 ? '100%' : '500%';

    let nwidth = heatmapData && heatmapData?.categories.length > 15 ? 3000 : 100 + "%";
    let nheight = heatmapData && heatmapData?.categories.length < 15 ? 900 : 900

    return (
        <div className='bg-slate-100 pt-5 pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>
            <div id="chart" ref={chartRef}>
                <ReactApexChart options={options} series={series} type="heatmap" height={nheight} width={nwidth} />
            </div>
            <div id="html-dist"></div>
        </div>

    )
}

export default RoamingQcHeatmap