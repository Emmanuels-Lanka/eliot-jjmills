"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

type HourGroup = {
    [key: string]: {
        totalProduction: number;
        target: number;
        seqNo: number;
        xAxis: string;
    };
}

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<number[][] | null>(null);
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
    const [timeList, settimeList] = useState<string>("")
    const [chartWidth, setChartWidth] = useState<number>(3500)

    function processForHeatmap(productionData: ProductionData[]) {
        // Create an array to store hour groups, each as a map of operation IDs to production totals and targets
        const hourlyOperations: HourGroup[] = Array.from({ length: 12 }, () => ({}));
        const xAxisCategories: string[] = [];

        productionData.forEach((item: any) => {
            const date = new Date(item.timestamp);
            const hourIndex = date.getHours() - 7; // Adjust the base hour as needed

            if (hourIndex >= 0 && hourIndex < 12) { // Ensure within the desired time range
                const hourGroup = hourlyOperations[hourIndex];
                const operation = hourGroup[item.obbOperationId] || {
                    totalProduction: 0,
                    target: item.obbOperation.target,
                    seqNo: item.obbOperation.seqNo,
                    xAxis: item.obbOperation.operation.name
                };

                operation.totalProduction += item.productionCount;
                hourGroup[item.obbOperationId] = operation; // Store back to the group
            }
        });

        // Calculate efficiencies for each operation in each hour and store only the data arrays
        const efficiencyData: number[][] = hourlyOperations.map(hourGroup => {
            const operations = Object.values(hourGroup);
            if (operations.length) {
                operations.forEach((op, index) => {
                    // This condition ensures we only add sequence numbers once per unique operation across all hours
                    if (xAxisCategories.length <= index) {
                        xAxisCategories.push(`${op.xAxis}-${op.seqNo}`);
                    }
                });
            }
            return operations.map(op => Number(((op.totalProduction / op.target) * 100).toFixed(1)));
        });

        return { efficiencyData, xAxisCategories };
    }

    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];
            
            const response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
            const heatmapData = processForHeatmap(response.data.data);
            
            setHeatmapData(heatmapData.efficiencyData);
            setHeatmapCategories(heatmapData.xAxisCategories);
            setObbSheet(response.data.obbSheet);

            router.refresh();    
        } catch (error: any) {
            console.error("Error fetching production data:", error);
            toast({
                title: "Something went wrong! Try again",
                variant: "error",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            ERROR: {error.message}
                        </code>
                    </div>
                ),
            });
        }
    }
    
    const totalCount = Object.keys(timeList).reduce((acc, curr) => acc + curr.length, 0);
    const height: string = totalCount < 50 ? '390%' : totalCount < 60 ? '300%' : '500%';
    const width: string = totalCount < 50 ? '350%' : totalCount < 60 ? '300%' : '500%';
 

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchProductions}
                /> 
            </div>
            <div className="mx-auto max-w-[1680px]">
                {heatmapData !== null && heatmapCategories !== null ?
                    <div className="mt-12">
                        <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2>
                        <HeatmapChart
                            xAxisLabel='Operations'
                            height={580}
                            type="60min"
                            efficiencyLow={obbSheet?.efficiencyLevel1}
                            efficiencyHigh={obbSheet?.efficiencyLevel3}
                            heatmapData={heatmapData}
                            heatmapCategories={heatmapCategories}
                        />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                }
            </div>
        </>
    )
}

export default AnalyticsChart