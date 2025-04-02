"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

// import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "./heatmap";
import ProdHeatMap from "./prodHeatmap";
import EfficiencyBarChart from "./dhuGraph";
import GraphCompo from "./curve-graph";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
    operatorId: string;
}

type HourGroup = {
    [key: string]: {
        totalProduction: number;
        target: number;
        xAxis: number;
    };
}

type OperationEfficiencyOutputTypesNew = {
    data: {
        hourGroup: string,
        operation: {
            name: string,
            efficiency: number | null
            totalProduction:number | null

        }[];

    }[];
    categories: string[];
    machines?: string[];
    eliot?:string[];
    
};

const AnalyticsChart = ({
    obbSheets,
    title,
    operatorId
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypesNew>();
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
    const [obbSheetId, setObbSheetId] = useState<any>();
    const [operatorID, setOperatorID] = useState<any>();
    const [date, setDate] = useState<string>("");

    function processProductionData(productionData: ProductionDataForChartTypes[]): OperationEfficiencyOutputTypesNew {
        const hourGroups = ["7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"];

        // const getHourGroup = (timestamp: string): string => {
        //     const hour = new Date(timestamp).getHours();
        //     return hourGroups[Math.max(0, Math.min(11, hour - 7))];
        // };
        
        const getHourGroup = (timestamp: string): string => {
            const date = new Date(timestamp);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    if (minutes >= 5) {
        return hourGroups[Math.max(0, Math.min(11, hour - 7))];
    } else {
        // If minutes are less than 5, group it to the previous hour group
        return hourGroups[Math.max(0, Math.min(11, hour - 8))];
    }
            // const hour = new Date(timestamp).getHours();
            // return hourGroups[Math.max(0, Math.min(11, hour - 7))];
        };


        const operatorsMap: { [key: string]: ProductionDataForChartTypes[] } = {};
        productionData.forEach(data => {
            if (!operatorsMap[data.operatorRfid]) {
                operatorsMap[data.operatorRfid] = [];
            }
            operatorsMap[data.operatorRfid].push(data);
        });
             
        const operations = Object.values(operatorsMap).map(group => ({
            operator: group[0],
            data: group
        })).sort((a, b) => a.operator.obbOperation.seqNo - b.operator.obbOperation.seqNo);


        const categories = operations.map(op => `${op.operator.operator.name} - ( ${op.operator.obbOperation.sewingMachine.machineId} ) - ${op.operator.obbOperation.seqNo}`);
        const machines = operations.map(op => ` ${op.operator.obbOperation.sewingMachine.machineId}`);
        const eliot = operations.map(op => ` ${op.data[0].eliotSerialNumber}`);
        const resultData = hourGroups.map(hourGroup => ({
            hourGroup,
            operation: operations.map(op => {
                const filteredData = op.data.filter(data => getHourGroup(data.timestamp) === hourGroup);
                const totalProduction = filteredData.reduce((sum, curr) => sum + curr.productionCount, 0);
                const earnMinutes = op.operator.obbOperation.smv * totalProduction
                const efficiency = filteredData.length > 0 ? (totalProduction === 0 ? 0 : (earnMinutes / 60) * 100) : null;
                return { name: `${op.operator.obbOperation.seqNo}-${op.operator.operator.name}`, efficiency: efficiency !== null ? Math.round(efficiency+0.0001) : null,totalProduction:totalProduction };
            })
        }));

        return {
            data: resultData,
            categories,
            machines,
            eliot
        };
    }

    const handleFetchProductions = async (data: {obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate =  data.date.toISOString().split('T')[0];
            const response = await axios.get(`/api/efficiency/production-by-operator?obbSheetId=${data.obbSheetId}&date=${formattedDate}&operatorId=${operatorId}`);
            console.log("ooooooo",operatorId)
            const heatmapData = processProductionData(response.data.data);
            setHeatmapData(heatmapData);
            setObbSheet(response.data.obbSheet);
            setDate(formattedDate)
            setObbSheetId(data.obbSheetId)
            setOperatorID(operatorId)
            
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
        <div className="mx-auto max-w-7xl">
            <SelectObbSheetAndDate 
                obbSheets={obbSheets}
                handleSubmit={handleFetchProductions}
            />
            {heatmapData  ? 
               <div className="flex flex-col">
               {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
               <div className="grid grid-cols-3 space-x-4 mt-12">
                
                 <div className="">
                    
                   <EffiencyHeatmap
                     xAxisLabel="Operations"
                     height={800}
                     efficiencyLow={obbSheet?.efficiencyLevel1}
                     efficiencyHigh={obbSheet?.efficiencyLevel3}
                     heatmapData={heatmapData}
                   />
                 </div>
                 <div className="">
                   <ProdHeatMap
                     xAxisLabel="Operations"
                     height={800}
                     efficiencyLow={obbSheet?.efficiencyLevel1}
                     efficiencyHigh={obbSheet?.efficiencyLevel3}
                     heatmapData={heatmapData}
                   />
                 </div>
                 <div className="">
                 <EfficiencyBarChart
                     date={date}
                     obbSheet={obbSheetId}
                     operatorId={operatorId}
                   />
                 </div>
                 {/* <div className="flex flex-col flex-1">
                   <EfficiencyBarChart
                     date={date}
                     obbSheet={obbSheetId}
                     operatorId={operatorId}
                   />
                 </div> */}
               </div>
               <div className="w-auto">
                
               <GraphCompo date={date} obbSheet={obbSheetId} operatorId={operatorID}></GraphCompo>
               </div>
             </div>
             
             
            :
                <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                </div>
            }
        </div>
    )
}

export default AnalyticsChart