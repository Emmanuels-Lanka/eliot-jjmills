import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface HeatmapChartProps {
    xAxisLabel: string;
    height: number;
    type: string;
    efficiencyLow?: number;
    efficiencyHigh?: number;
    heatmapData: number[][];
    heatmapCategories: string[];
}

const HeatmapChart = ({
    xAxisLabel,
    height,
    type,
    efficiencyLow,
    efficiencyHigh,
    heatmapData,
    heatmapCategories
}: HeatmapChartProps) => {
    let series: { name: string; data: number[] }[] = [];

    if (type === '60min') {
        series = [
            { name: '7:00 AM - 8:00 AM', data: heatmapData[0] },
            { name: '8:00 AM - 9:00 AM', data: heatmapData[1] },
            { name: '9:00 AM - 10:00 AM', data: heatmapData[2] },
            { name: '10:00 AM - 11:00 AM', data: heatmapData[3] },
            { name: '11:00 AM - 12:00 PM', data: heatmapData[4] },
            { name: '12:00 PM - 1:00 PM', data: heatmapData[5] },
            { name: '1:00 PM - 2:00 PM', data: heatmapData[6] },
            { name: '2:00 PM - 3:00 PM', data: heatmapData[7] },
            { name: '3:00 PM - 4:00 PM', data: heatmapData[8] },
            { name: '4:00 PM - 5:00 PM', data: heatmapData[9] },
            { name: '5:00 PM - 6:00 PM', data: heatmapData[10] },
            { name: '6:00 PM - 7:00 PM', data: heatmapData[11] }
        ];
    } else if (type === '15min') {
        series = [
            { name: '7:00AM - 7:15AM', data: heatmapData[0] },
            { name: '7:15AM - 7:30AM', data: heatmapData[1] },
            { name: '7:30AM - 7:45AM', data: heatmapData[2] },
            { name: '7:45AM - 8:00AM', data: heatmapData[3] },
            { name: '8:00AM - 8:15AM', data: heatmapData[4] },
            { name: '8:15AM - 8:30AM', data: heatmapData[5] },
            { name: '8:30AM - 8:45AM', data: heatmapData[6] },
            { name: '8:45AM - 9:00AM', data: heatmapData[7] },
            { name: '9:00AM - 9:15AM', data: heatmapData[8] },
            { name: '9:15AM - 9:30AM', data: heatmapData[9] },
            { name: '9:30AM - 9:45AM', data: heatmapData[10] },
            { name: '9:45AM - 10:00AM', data: heatmapData[11] },
            { name: '10:00AM - 10:15AM', data: heatmapData[12] },
            { name: '10:15AM - 10:30AM', data: heatmapData[13] },
            { name: '10:30AM - 10:45AM', data: heatmapData[14] },
            { name: '10:45AM - 11:00AM', data: heatmapData[15] },
            { name: '11:00AM - 11:15AM', data: heatmapData[16] },
            { name: '11:15AM - 11:30AM', data: heatmapData[17] },
            { name: '11:30AM - 11:45AM', data: heatmapData[18] },
            { name: '11:45AM - 12:00PM', data: heatmapData[19] },
            { name: '12:00PM - 12:15PM', data: heatmapData[20] },
            { name: '12:15PM - 12:30PM', data: heatmapData[21] },
            { name: '12:30PM - 12:45PM', data: heatmapData[22] },
            { name: '12:45PM - 1:00PM', data: heatmapData[23] },
            { name: '1:00PM - 1:15PM', data: heatmapData[24] },
            { name: '1:15PM - 1:30PM', data: heatmapData[25] },
            { name: '1:30PM - 1:45PM', data: heatmapData[26] },
            { name: '1:45PM - 2:00PM', data: heatmapData[27] },
            { name: '2:00PM - 2:15PM', data: heatmapData[28] },
            { name: '2:15PM - 2:30PM', data: heatmapData[29] },
            { name: '2:30PM - 2:45PM', data: heatmapData[30] },
            { name: '2:45PM - 3:00PM', data: heatmapData[31] },
            { name: '3:00PM - 3:15PM', data: heatmapData[32] },
            { name: '3:15PM - 3:30PM', data: heatmapData[33] },
            { name: '3:30PM - 3:45PM', data: heatmapData[34] },
            { name: '3:45PM - 4:00PM', data: heatmapData[35] },
            { name: '4:00PM - 4:15PM', data: heatmapData[36] },
            { name: '4:15PM - 4:30PM', data: heatmapData[37] },
            { name: '4:30PM - 4:45PM', data: heatmapData[38] },
            { name: '4:45PM - 5:00PM', data: heatmapData[39] },
            { name: '5:00PM - 5:15PM', data: heatmapData[40] },
            { name: '5:15PM - 5:30PM', data: heatmapData[41] },
            { name: '5:30PM - 5:45PM', data: heatmapData[42] },
            { name: '5:45PM - 6:00PM', data: heatmapData[43] },
            { name: '6:00PM - 6:15PM', data: heatmapData[44] },
            { name: '6:15PM - 6:30PM', data: heatmapData[45] },
            { name: '6:30PM - 6:45PM', data: heatmapData[46] },
            { name: '6:45PM - 7:00PM', data: heatmapData[47] }
        ];        
    } else if (type === 'tls') {
        series = [
            { name: 'Round 1', data: heatmapData[0] },
            { name: 'Round 2', data: heatmapData[1] },
            { name: 'Round 3', data: heatmapData[2] },
            { name: 'Round 4', data: heatmapData[3] },
            { name: 'Round 5', data: heatmapData[4] },
            { name: 'Round 6', data: heatmapData[5] },
            { name: 'Round 7', data: heatmapData[6] },
            { name: 'Round 8', data: heatmapData[7] },
            { name: 'Round 9', data: heatmapData[8] },
            { name: 'Round 10', data: heatmapData[9] },
            { name: 'Round 11', data: heatmapData[10] },
            { name: 'Round 12', data: heatmapData[11] }
        ];
    }

    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: type === 'tls' ? 10 : 30,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        { 
                            from: 0, 
                            to: efficiencyLow || 44, 
                            name: type === 'tls' ? 'Red' : 'Low', 
                            color: '#ef4444' 
                        },
                        { 
                            from: efficiencyLow || 45, 
                            to: efficiencyHigh || 74, 
                            name: type === 'tls' ? 'Orange' :  'Medium', 
                            color: '#f97316' 
                        },
                        { 
                            from: efficiencyHigh || 75, 
                            to: 1000, 
                            name: type === 'tls' ? 'Green' :  'High', 
                            color: '#16a34a' 
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: type !== 'tls',
            style: {
                colors: ['#fff']
            }
        },
        stroke: {
            width: type === 'tls' ? 5 : 1,
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
                    colors: type === 'tls' ? '#334155' : '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
            categories: heatmapCategories,
        },
        yaxis: {
            labels: {
                style: {
                    colors: type === 'tls' ? '#334155' : '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
            // reversed: true,
        },
    };

    let width: string = '100%';
    switch (true) {
        case heatmapCategories.length < 20:
            width = '50%';
            break;
        case heatmapCategories.length >= 20 && heatmapCategories.length < 28:
            width = '10%';
            break;
        case heatmapCategories.length >= 28:
            width = '20%';     
            break;
        default:
            width = '10%';
    }

    return (
        <div className='bg-slate-100 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="heatmap" height={height} width={width} />
            </div>
            <div id="html-dist"></div>
        </div>
    )
}

export default HeatmapChart