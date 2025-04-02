"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import SelectObbSheetDateOperation from "@/components/dashboard/common/select-obbsheet-date-operation";
import SmvBarChart from "./smv-bar-chart";
import { getFormattedTime } from "@/lib/utils-time";
import ObbSheetId from "@/app/(dashboard)/obb-sheets/[obbSheetId]/page";
// import { getHrSmv } from "./actions";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}


// export type ProductionSMVDataTypes = {
//     id: number;
//     obbOperationId: string;
//     operatorRfid: string;
//     obbOperation: {
//         smv: string;
//         operation: {
//             name: string;
//             code: string;
//         }
//     }
//     smv: string;
//     timestamp: string;
// }


const AnalyticsChart = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const [data1,setdata1]=useState<any[]>()

    const [barchartData, setBarchartData] = useState<{ hourGroup: string; smv: number | null; operationName: string }[]>([]);
    const [tsmv, settsmv] = useState< number>(0);
    const [operationName, setOperationName] = useState< string>("");

    
    const groupSMVByHour = (data: ProductionSMVDataTypes[]): { hourGroup: string; smv: number | null; operationName: string }[] => {
        const hourGroups = [
            "7 AM - 8 AM", "8 AM - 9 AM", "9 AM - 10 AM",
            "10 AM - 11 AM", "11 AM - 12 PM", "12 PM - 1 PM",
            "1 PM - 2 PM", "2 PM - 3 PM", "3 PM - 4 PM",
            "4 PM - 5 PM", "5 PM - 6 PM", "6 PM - 7 PM", "8 PM - 9 PM"
        ];
    
        const getHourGroup = (timestamp: string): string => {
            const hour = new Date(timestamp).getHours();
            return hourGroups[Math.max(0, Math.min(12, hour - 7)) - 1];
        };
    
        const smvByHour: { [key: string]: { smvs: number[]; operationName: string } } = {};
    
        // Group SMV values by hour groups
        data.forEach(entry => {
            const hourGroup = getHourGroup(entry.timestamp);
            const smvValue = parseFloat(entry.smv);
            const operationName = entry.obbOperation.operation.name;
    
            if (!smvByHour[hourGroup]) {
                smvByHour[hourGroup] = { smvs: [], operationName };
            }
    
            smvByHour[hourGroup].smvs.push(smvValue);
        });
    
        // Distribute excess SMVs to the next hour group
        for (let i = 0; i < hourGroups.length - 1; i++) {
            const currentGroup = hourGroups[i];
            const nextGroup = hourGroups[i + 1];
    
            if (smvByHour[currentGroup]?.smvs.length > 1) {
                const excessSMVs = smvByHour[currentGroup].smvs.slice(1); // Remove all except the first SMV
                smvByHour[currentGroup].smvs = smvByHour[currentGroup].smvs.slice(0, 1); // Retain only the first SMV
    
                if (!smvByHour[nextGroup]) {
                    smvByHour[nextGroup] = { smvs: [], operationName: smvByHour[currentGroup].operationName };
                }
    
                smvByHour[nextGroup].smvs.push(...excessSMVs); // Push excess SMVs to the next group
            }
        }
    
        // Prepare the final output
        return hourGroups.map(hourGroup => ({
            hourGroup,
            smv: smvByHour[hourGroup]?.smvs.length ? smvByHour[hourGroup].smvs[0] : null, // Get the first SMV in the group or null
            operationName: smvByHour[hourGroup]?.operationName || "N/A"
        }));
    };
    
    

    

    const handleFetchSmv = async (data: { obbSheetId: string; obbOperationId: string; date: Date; operationName:string}) => {
        try {
            // console.log("dateqq1",data.date)
           // data.date.setDate(data.date.getDate() +1);

           console.log("data",data)
            const formattedDate = getFormattedTime(data.date.toString())
             
            const response = await axios.get(`/api/smv/fetch-by-operation?obbOperationId=${data.obbOperationId}&date=${formattedDate}`);
            console.log("",response)
            const result = groupSMVByHour(response.data.data);
           
            console.log("results",result)

            response.data.data.forEach((entry: any) => {
                console.log("Operation Name:", entry.obbOperation.operation.name);
                setdata1( entry.obbOperation.operation.name)
            });

            const tsmv = response.data.tsmv.smv
            console.log("tsmv",tsmv)
            settsmv(tsmv)
            
            setBarchartData(result);
     


            router.refresh();
        } catch (error: any) {
            console.error("Error fetching production data:", error);
            toast({
                title: "Something went wrong! Try again",
                variant: "error"
            });
        }
    }

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetDateOperation
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchSmv}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {barchartData.length > 0 ?
                    <div className="mt-12">
                        <SmvBarChart tsmv={tsmv} data={barchartData} operationName={operationName} />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet, operation, and date ☝️</p>
                    </div>
                }
            </div>
        </>
    )
}

export default AnalyticsChart