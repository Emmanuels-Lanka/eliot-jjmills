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
import { fetchDirectProductionData } from "@/actions/efficiency-direct-action";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

type ProductionDataForChartTypes = {
    id: string;
    operatorRfid: string;
    eliotSerialNumber: string;
    obbOperationId: string;
    productionCount: number;
    efficiency: number;
    timestamp: string;
    createdAt: Date;
    operator: {
        name: string;
        employeeId: string;
        rfid: string;
    };
   
    obbOperation: {
        id: string;
        seqNo: number;
        target: number;
        smv: number;
        part:string;
        operation: {
            name: string;
        };
        sewingMachine: {
            
                machineId:string
            
        }
        
    };
    data: {

    }
   
};

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);

    function processProductionData(productionData: ProductionDataForChartTypes[],state:boolean): OperationEfficiencyOutputTypes {
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

                let prod :number;
                let efficiency :number | null;
                if(!state){
                     prod = filteredData.reduce((sum, curr) => sum + curr.productionCount, 0)
                     const earnmins = op.operator.obbOperation.smv * prod
                     efficiency = filteredData.length > 0 ? (prod === 0 ? 0 : Math.min((earnmins / 60) * 100, 100))  : null;
                }
                else{
                    if (filteredData.length === 0) return { name: op.operator.operator.name, efficiency: null };
                  efficiency = filteredData[0].efficiency
                }






                
                return { name: `${op.operator.obbOperation.seqNo}-${op.operator.operator.name}`, efficiency: efficiency !== null ? Math.round(efficiency+0.0001) : null };
            })
        }));

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

            let response 
            let state = true
           
             response  = await fetchDirectProductionData(data.obbSheetId, formattedDate);
            
                        if(response.data.length === 0){
                            state = false
                           response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
                        }
            
                        const heatmapData = processProductionData(response.data,state);
                        
                        setHeatmapData(heatmapData);
                        setObbSheet(response.data.obbSheet);
            console.log("HEATMAP:", heatmapData.data);
            console.log("CATEGORIES:", heatmapData.categories);

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
                       <div className="items-center text-lg font-semibold flex justify-center mb-4">
                        <h1>Live Efficiency </h1>
                       </div>
                        {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
                        <EffiencyHeatmap
                            xAxisLabel='Operations'
                            height={800}
                            efficiencyLow={obbSheet?.efficiencyLevel1}
                            efficiencyHigh={obbSheet?.efficiencyLevel3}
                            heatmapData={heatmapData}
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