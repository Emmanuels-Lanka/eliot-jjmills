"use client"

import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface RadialbarCircleChartProps {
    total: number;
    count: number;
    label: string;
}

const RadialbarCircleChart = ({
    total,
    count,
    label,
}: RadialbarCircleChartProps) => {
    const percentage = (count / total) * 100;

    const options: ApexOptions = {
        chart: {
            height: "100%",
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '60%',
                },
                dataLabels: {
                    value: {
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        color: 'white'
                    },
                    total: {
                        show: true,
                        label: label,
                        color: '#0980D4',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        fontFamily: 'Inter',
                        formatter: function (w) {
                            return `${count}/${total}`;
                        }
                    }
                },
                track: {
                    background: '#e2e8f0',
                    strokeWidth: '95%',
                    margin: 5, // margin is in pixels
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#4caf50'], // Adjust gradient colors here
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: 'round',
        }
    };

    const series = [percentage];

    return (
        <div className="w-full flex flex-col items-center justify-center text-white rounded-lg">
            <div className="w-full">
                <Chart options={options} series={series} type="radialBar" height={380} />
            </div>
        </div>
    );
}

export default RadialbarCircleChart