import React from 'react';
import dynamic from 'next/dynamic';
import { CardHeader, CardTitle } from '@/components/ui/card';

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
 
    efficiencyLow = 44,
    efficiencyHigh = 74,
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
                            name: 'Low',
                            color: '#ef4444'
                        },
                        {
                            from: efficiencyLow,
                            to: efficiencyHigh,
                            name: 'Medium',
                            color: '#f97316'
                        },
                        {
                            from: efficiencyHigh,
                            to: 1000,
                            name: 'High',
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
                },rotate: -90,
                minHeight: 250,
            },
            categories: categories
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

    let height = 800

    const width = 100+"%"
    return (
        <div className='bg-slate-100 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto shadow-lg'>
            <div id="chart">
            <div className="px-8">
            <CardHeader>
              <CardTitle className="text-center">
                {" "}
                {" "}
                Hourly Efficiency
              </CardTitle>
              {/* <CardDescription>Number of items came across each scanning points today</CardDescription> */}
            </CardHeader>
          </div>
                <ReactApexChart options={options} series={series} type="heatmap" height={(height)} width={width} />
            </div>
            <div id="html-dist"></div>
        </div>
    )
}

export default EffiencyHeatmap