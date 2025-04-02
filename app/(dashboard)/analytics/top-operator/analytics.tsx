"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import EfficiencyBarChart from "./bargraph";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

export type newOperationEfficiencyOutputTypes = {
    data: {
        
        operation: {
            name: string,
            count: number | 0
            earnMinute:number | 0
        }[];
    }[];
    categories: string[];
    machines?: string[];
    eliot?:string[];
    
};

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<newOperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
    const [date, setDate] = useState<string>("");

    function processProductionData(productionData: ProductionDataForChartTypes[]): newOperationEfficiencyOutputTypes {
        const operatorsMap: { [key: string]: ProductionDataForChartTypes[] } = {};
        
        // Group data by operator
        productionData.forEach(data => {
            if (!operatorsMap[data.operatorRfid]) {
                operatorsMap[data.operatorRfid] = [];
            }
            operatorsMap[data.operatorRfid].push(data);
        });
        
        // Prepare operations data
        const operations = Object.values(operatorsMap).map(group => ({
            operator: group[0],
            data: group
        })).sort((a, b) => a.operator.obbOperation.seqNo - b.operator.obbOperation.seqNo);
    
        const categories = operations.map(op => `${op.operator.operator.name} - ( ${op.operator.obbOperation.sewingMachine.machineId} ) - ${op.operator.obbOperation.seqNo}`);
        const machines = operations.map(op => ` ${op.operator.obbOperation.sewingMachine.machineId}`);
        const eliot = operations.map(op => ` ${op.data[0].eliotSerialNumber}`);
    
        // Calculate total production for each operator
        const resultData = [{
            operation: operations.map(op => {
                const totalProduction = op.data.reduce((sum, curr) => sum + curr.productionCount, 0);
                const earnMinutes = op.operator.obbOperation.smv * totalProduction
                return { name: `${op.operator.obbOperation.seqNo}-${op.operator.obbOperation.sewingMachine.machineId}-${op.operator.operator.name}`, count: totalProduction,earnMinute:earnMinutes };
            })
        }];
    
        return {
            data: resultData,
            categories,
            machines,
            eliot
        };
    }
    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];

            const response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
            const heatmapData = processProductionData(response.data.data);
            console.log("HEATMAP:", heatmapData.data);
            console.log("CATEGORIES:", heatmapData.categories);
            setDate(formattedDate)

            setHeatmapData(heatmapData);
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

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchProductions}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {heatmapData ?
                    <div className="mt-12">
                        {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
                        {/* <EffiencyHeatmap
                            xAxisLabel='Operations'
                            height={800}
                            efficiencyLow={obbSheet?.efficiencyLevel1}
                            efficiencyHigh={obbSheet?.efficiencyLevel3}
                            heatmapData={heatmapData}
                        /> */}
                        <EfficiencyBarChart heatmapData={heatmapData} date={date} ></EfficiencyBarChart>
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