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
    totalPcs:number;
    efficiency: number;
    timestamp: string;
    createdAt: Date;
    operator: {
        name: string;
        employeeId: string;
        rfid: string;
        operatorSessions?:any[]

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

const OperatorCumilative = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);

    function processProductionData(productionData: ProductionDataForChartTypes[]): OperationEfficiencyOutputTypes {
           const hourGroups = ["8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"];
   
           const getHourGroup = (timestamp: string): string => {
               const date = new Date(timestamp);
       const hour = date.getHours();
       const minutes = date.getMinutes();
       if (minutes >= 5) {
           return hourGroups[Math.max(0, Math.min(10, hour - 8))];
       } else {
           // If minutes are less than 5, group it to the previous hour group
           return hourGroups[Math.max(0, Math.min(10, hour - 9))];
       }
               // const hour = new Date(timestamp).getHours();
               // return hourGroups[Math.max(0, Math.min(11, hour - 7))];
           };
   
           const latestTimestamp = productionData.reduce((latest, current) => {
               return latest > current.timestamp ? latest : current.timestamp;
             }, "");
             const mostRecentHourGroup = getHourGroup(latestTimestamp);

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

           // const categories = operations.map(op => `${op.obbOperation.operation.name}-${op.obbOperation.seqNo}`);
           
         const categories = operations.map(op => `${op.operator.operator.name} - ( ${op.operator.obbOperation.sewingMachine.machineId} ) - ${op.operator.obbOperation.seqNo}`);
        const machines = operations.map(op => ` ${op.operator.obbOperation.sewingMachine.machineId}`);
        const eliot = operations.map(op => ` ${op.data[0].eliotSerialNumber}`);

    const resultData = hourGroups
   //  hourGroup !== mostRecentHourGroup  &&  removed from
    // Exclude the most recent hour group
         .map(hourGroup => ({
               hourGroup,
               operation: operations.map(op => {
                 
                
                 
                   const filteredData = op.data.filter(data => getHourGroup(data.timestamp) === hourGroup);

                    if (filteredData.length === 0) return { name: op.operator.operator.name, efficiency: null };

                   
                  
                  const log = filteredData[0].operator.operatorSessions?.find((s)=>s.obbOperationId === op.operator.obbOperation.id || s.operatorRfid === op.operator.operatorRfid)?.LoginTimestamp
                   
                   // const loginTimestamp = filteredData[0]?.operator?.operatorSessions?.[0]?.LoginTimestamp;
                   const loginTime = new Date(log); // Convert to Date object
   
                   
                   const  lastProduction = filteredData[0].totalPcs;
                   const  lastProductionTime = filteredData[0].timestamp;
                   const  firstProduction= filteredData[filteredData.length - 1].totalPcs;
                   const currentHourIndex = hourGroups.indexOf(hourGroup);
                   let previousHourData: number = 0;
   
                   if (currentHourIndex > 0) {
                     // Iterate backward to find the nearest previous hour with data
                     for (let i = currentHourIndex - 1; i >= 0; i--) {
                       const previousHourGroup = hourGroups[i];
                   
                       // Filter data for the previous valid hour group
                       const filteredPreviousData = op.data.filter(
                         (data) => getHourGroup(data.timestamp) === previousHourGroup
                       );
                   
                       if (filteredPreviousData.length > 0) {
                         previousHourData = filteredPreviousData[0].totalPcs; 
                         break; // Stop looping once a valid previous hour is found
                       }
                     }
                   }
                   const productionCount = lastProduction - previousHourData;
                   const earnMins = productionCount * op.operator.obbOperation.smv;
                   const liveEarnMins = lastProduction*op.operator.obbOperation.smv
   
                   let efficiency: number | null = null;
   
                     // const firstTime = new Date(filteredData[0].timestamp);
                     const lastTime = new Date(lastProductionTime)
                     // const currentTime = new Date(); no need cuz of time zone issues  
                     let timeDiffMinutes = (lastTime.getTime() - loginTime.getTime()) / (1000 * 60);
                     
                     let is2Passed :boolean = false
                     let isLoggedBfr2 :boolean =false
   
                     if (
                         lastTime.getHours() > 14 || (lastTime.getHours() === 14 && lastTime.getMinutes() >= 5)
                       ) {
                         if (loginTime.getHours() < 14 || (loginTime.getHours() === 14 && loginTime.getMinutes() < 5)) {
                           timeDiffMinutes -= 60;
                           isLoggedBfr2 = true
                         }
                         is2Passed = true;
                       }
                       
                  
                 
                    //    efficiency = timeDiffMinutes > 0 ? Math.min((liveEarnMins * 100) / timeDiffMinutes, 100) : 0;
                    efficiency = timeDiffMinutes > 0  ? Math.max(Math.min((liveEarnMins * 100) / timeDiffMinutes, 100), 0)  : 0;
                 
   ``
   
                   const timeDiff = timeDiffMinutes
                
                   
                   
                   return { name: `${op.operator.obbOperation.seqNo}-${op.operator.operator.name}`, efficiency: productionCount !== null ? Math.round(efficiency ) : null 
                   ,timeDiffMinutes:timeDiffMinutes,previousHourData,
                   totalProduction:productionCount,firstProduction,lastProduction,
                   smv:op.operator.obbOperation.smv,opLogin:loginTime,is2Passed,lastProductionTime,operator:op.operator.operatorRfid,
                   isLoggedBfr2};
               })
           }));
           console.log("first", resultData)
           return {
               data: resultData,
               categories,
               machines,
               eliot,
   
   
           };
       }
    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];

           
           
            // const response = await axios.get(`/api/efficiency-direct?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
            // console.log("re",response.data.data)
            // const heatmapData = processProductionData(response.data.data);

             const response : any = await fetchDirectProductionData(data.obbSheetId, formattedDate);
            
            
                        const heatmapData  = processProductionData(response.data);
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
                        {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
                        <div className="items-center text-lg font-semibold flex justify-center mb-4">
                        <h1>Cumilative Efficiency </h1>
                       </div>
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

export default OperatorCumilative