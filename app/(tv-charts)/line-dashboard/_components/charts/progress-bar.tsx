"use client"

import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ProgressBarProps {
    percentage: number;
    startColor: string;
    endColor?: string;
}

const ProgressBar = ({
    percentage,
    startColor,
    endColor
}: ProgressBarProps) => {
    const options: ApexOptions = {
        chart: {
            height: 70,
            width: "100%",
            type: 'bar',
            // stacked: true,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '26%',
                borderRadius: 6,
                colors: {
                    backgroundBarColors: ['#e2e8f0'],
                    backgroundBarRadius: 7
                }
            }
        },
        colors: [startColor],
        series: [{
            name: 'Process',
            data: [percentage]
        }],
        fill: {
            type: 'gradient',
            gradient: {
                inverseColors: false,
                gradientToColors: endColor ? [endColor] : undefined,
            },
        },
        xaxis: {
            categories: ['Process']
        },
        yaxis: {
            max: 100
        },
        title: {},
        subtitle: {},
        tooltip: {
            enabled: false
        }
    };

    return (
        <ReactApexChart options={options} series={options.series} type="bar" height={70} width="100%" />
    );
}

export default ProgressBar