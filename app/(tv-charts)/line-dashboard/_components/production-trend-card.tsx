"use client"

import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { addHours, format, parse } from "date-fns";

import { cn } from '@/lib/utils';
import { fetchPassProductionData } from '../_actions/fetch-pass-production-data';
import { ProductionTrendLineChart } from './charts/production-trend-line-chart';

interface ProductionTrendCardProps {
    obbSheetId: string;
    productionTarget: number;
    workingHours: number;
    factoryStartTime: string | null;
}

type ProductionDataType = {
    id: string;
    obbSheetId: string | null;
    createdAt: Date;
    timestamp: string;
    productId: string;
    qcStatus: string;
    qcPointId: string;
    obbOperationId: string | null;
    operatorId: string | null;
    operatorName: string | null;
    part: string;
}[];

type ChartDataType = {
    hour: string;
    target: number;
    production: number;
}[];

const ProductionTrendCard = ({
    obbSheetId,
    productionTarget,
    workingHours,
    factoryStartTime
}: ProductionTrendCardProps) => {

    const [chartData, setChartData] = useState<ChartDataType>([]);

    useEffect(() => {
        (async () => {
            const productionData = await fetchPassProductionData(obbSheetId);
            // console.log("RESSSS", productionData);

            const trendData = processProductionChartData(productionData, workStartTime, workingHours, productionTarget);
            // console.log(trendData);
            setChartData(trendData);
        })();
    }, []);

    if (!factoryStartTime) {
        return (
            <div className='bg-white h-full border drop-shadow-sm rounded-xl flex justify-center items-center'>
                <p className='text-xl text-red-600'>Please update the Factory Start time for this OBB</p>
            </div>
        )
    }

    const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
    const workStartTime = `${today} ${factoryStartTime}:00`;


    // Generate hourly targets
    function processProductionChartData(
        productionData: ProductionDataType,
        workStartTime: string,
        workingHours: number,
        dayTarget: number
    ): ChartDataType {
        const hourlyTarget = dayTarget / workingHours; // Target per hour
        const startTime = parse(workStartTime, "yyyy-MM-dd HH:mm:ss", new Date());
    
        let cumulativeTarget = 0;
        let cumulativeProduction = 0;
        const chartData: ChartDataType = [];
    
        for (let i = 0; i < workingHours + 1; i++) {
            const currentHour = addHours(startTime, i);
            const nextHour = addHours(currentHour, 1);
            const hourLabel = format(nextHour, "HH:mm");
    
            // Calculate production for the current hour group
            const productionCount = productionData.filter((data) => {
                const productionTime = parse(data.timestamp, "yyyy-MM-dd HH:mm:ss", new Date());
                return productionTime >= currentHour && productionTime < nextHour;
            }).length;
    
            cumulativeProduction += productionCount;
    
            // Handle lunch hour logic
            if (format(currentHour, "HH:mm") === "13:00") {
                chartData.push({
                    hour: hourLabel,
                    target: cumulativeTarget, // No target increment during lunch hour
                    production: cumulativeProduction,
                });
                continue;
            }
    
            // Accumulate target for other hours
            cumulativeTarget = Math.min(cumulativeTarget + hourlyTarget, dayTarget);
    
            chartData.push({
                hour: hourLabel,
                target: Math.round(cumulativeTarget),
                production: cumulativeProduction,
            });
        }
    
        return chartData;
    }

    

    return (
        <div className='h-full w-full bg-white p-4 flex flex-col items-start gap-x-2 rounded-xl drop-shadow-sm border'>
            <p className='text-xl font-medium text-slate-500 tracking-[0.01em]'>Production Trend</p>
            {chartData.length > 0 &&
                <ProductionTrendLineChart data={chartData} />
            }
        </div>
    )
}

export default ProductionTrendCard