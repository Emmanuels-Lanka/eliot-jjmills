import React from 'react';
import dynamic from 'next/dynamic';

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
    height,
    efficiencyLow = 70,
    efficiencyHigh = 80,
    heatmapData
}: EffiencyHeatmapProps) => {
    const categories = heatmapData.categories || [];

    let series: { name: string; data: (number | null)[] }[] = heatmapData.data.map(hourGroup => ({
        name: hourGroup.hourGroup,
        data: hourGroup.operation.map(op => op.efficiency === null ? -1 : op.efficiency)
    }));

    const options = {
        chart: {
            type: 'heatmap' as const,
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
                            color: '#f97316'
                        },
                        {
                            from: efficiencyHigh,
                            to: 1000,
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
                minHeight: 200,
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

    const width: string = heatmapData.categories.length < 21 ? '100%' : heatmapData.categories.length < 30 ? '150%' : '350%';

    return (
        <div className='bg-slate-100 pt-5 pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="heatmap" height={height} width={width} />
            </div>
            <div id="html-dist"></div>
        </div>
    )
}

export default EffiencyHeatmap