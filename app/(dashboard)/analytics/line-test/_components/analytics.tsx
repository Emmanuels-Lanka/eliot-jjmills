"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";

import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import SelectObbSheetAndDate from "./unit-obb";
import BarChartGraphEfficiencyRate from "./barchart";



interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title?: string;
    units:any;
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
    obbSheets,units
    
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<newOperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<any>();
    const [date, setDate] = useState<string>("");
    const [filterApplied,setFilterApplied]=useState<boolean>(false)
    const[unit,setUnit]=useState<string>("")
    const [newDate,setNewDate] = useState<any>()
    const [obbSheetId,setObbSheetId] = useState<any>()


  
    const handleFetchProductions = async (data: { obbSheetId: string; date: Date  }) => {
        try {
            console.log("hello")
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0].toString();
            const obb = data.obbSheetId


            setNewDate(formattedDate);
            
            setObbSheetId(obb);
            setFilterApplied(true)
            console.log("first",data.date,formattedDate)
            console.log(data)
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
                units={units}

                ></SelectObbSheetAndDate>
            </div>
            <div className="mx-auto max-w-[1680px]">
                {(newDate  && obbSheetId) ?
                    <div className="mt-12">
                        
                        <BarChartGraphEfficiencyRate date={newDate} obbSheet={obbSheetId}></BarChartGraphEfficiencyRate>
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