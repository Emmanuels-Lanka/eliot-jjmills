"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
// import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import { getObbSheetID } from "@/components/tv-charts/achievement-rate-operation/actions";
import LogoImporter from "@/components/dashboard/common/eliot-logo";
import EffiencyHeatmap from "./effheat";
// import EffiencyHeatmap from "./effheatmap";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

type EfficiencyResult = {
    data: {
        hourGroup: string,
        operation: {
            name: string,
            efficiency: number | null
        }[];
    }[];
    categories: string[];
};

const AnalyticsChart = ({ linename }: { linename: string }) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);

    
  const [obbSheetId, setobbSheetId] = useState<string>("")
  const [date, setdate] = useState<string>("");

  const getObbSheetID1 = async () => {
    const obbSheetId1 = await getObbSheetID(linename);
    setobbSheetId(obbSheetId1)
   
  }
    
    
   function processProductionData(productionData: ProductionDataForChartTypes[]): OperationEfficiencyOutputTypes {
        const hourGroups = ["7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM","7:00 PM - 8:00 PM"];

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

      
        const operationsMap: { [key: string]: ProductionDataForChartTypes[] } = {};
        productionData.forEach(data => {
            if (!operationsMap[data.obbOperationId]) {
                operationsMap[data.obbOperationId] = [];
            }
            operationsMap[data.obbOperationId].push(data);
        });

        console.log("seco",operationsMap)

        const operations = Object.values(operationsMap).map(group => ({
            obbOperation: group[0].obbOperation,
            data: group
        })).sort((a, b) => a.obbOperation.seqNo - b.obbOperation.seqNo);

        console.log("op",operations)

        // const categories = operations.map(op => `${op.obbOperation.operation.name}-${op.obbOperation.seqNo}`);
        const categories = operations.map(op => `${op.obbOperation.operation.name} - ( ${op.obbOperation.sewingMachine.machineId} ) - ${op.obbOperation.seqNo}`);
        const machines = operations.map(op => ` ${op.obbOperation.sewingMachine.machineId}`);
        const eliot = operations.map(op => ` ${op.data[0].eliotSerialNumber}`);
        const resultData = hourGroups.map(hourGroup => ({
            hourGroup,
            operation: operations.map(op => {
                const filteredData = op.data.filter(data => getHourGroup(data.timestamp) === hourGroup);
                const totalProduction = filteredData.reduce((sum, curr) => sum + curr.productionCount, 0);
                const earnmins = op.obbOperation.smv * totalProduction
                const efficiency = filteredData.length > 0 ? (totalProduction === 0 ? 0 : (earnmins / 60) * 100) : null;
                
                return { name: `${op.obbOperation.seqNo}-${op.obbOperation.operation.name}`, efficiency: totalProduction !== null ? parseFloat(totalProduction.toFixed(1)) : null };
            })
        }));

        return {
            data: resultData,
            categories,
            machines,
            eliot
        };
    }

    const handleFetchProductions = async () => {
        try {
            
            const y = new Date().getFullYear().toString()
            const m = (new Date().getMonth() + 1).toString().padStart(2, "0")
            //const d = new Date().getDate().toString().padStart(2, "0")
            const today = new Date();
            const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
          
           const date =  yyyyMMdd.toString()
            setdate(date)

            const response = await axios.get(`/api/efficiency/production?obbSheetId=${obbSheetId}&date=${date}`);
            const heatmapData = processProductionData(response.data.data);
            
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

    
  useEffect(() => {
     
    getObbSheetID1()
  }, [linename])

  

  useEffect(() => {
    handleFetchProductions(); 
  
    const intervalId = setInterval(() => {
      handleFetchProductions();
 
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [obbSheetId, date]);

    return (
        <>

        <div>
        <div className="h-[200]">
      <div className='flex justify-center items-center gap-3 w-screen'>
        {/* <Cog className='w-7 h-7 text-voilet' /> */}
        <LogoImporter/>
        <h1 className='text-[#0071c1] my-4 text-3xl '>Dashboard -  Hourly Production - {linename} </h1>
      </div>

      {heatmapData ?
       <EffiencyHeatmap
       xAxisLabel='Operations'
       height={900}
       efficiencyLow={obbSheet?.efficiencyLevel1}
       efficiencyHigh={obbSheet?.efficiencyLevel3}
       heatmapData={heatmapData}
   />: <span>No Layout for Line {linename} - {date}</span>}
    </div>
        </div>
            
         
        </>
    )
}

export default AnalyticsChart