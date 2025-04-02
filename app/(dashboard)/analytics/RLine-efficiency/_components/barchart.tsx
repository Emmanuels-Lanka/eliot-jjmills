"use client"
// import { FaPlus, FaMinus } from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { use, useEffect, useState } from "react";
import {  getFinalData, getLogin, getNew, getObbData,  OperatorRfidData } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { count } from "console";
import { TableDemo } from "./table-compo";
import { ObbSheet } from "@prisma/client";

const chartConfig = {
    target: {
        label: "No of Target",
        color: "hsl(var(--chart-1))",
    },
    count: {
        label: "Defects Per Hundred Units   ",
        color: "hsl(var(--chart-2))",
    },

} satisfies ChartConfig
type BarChartData = {
    name: string;
    count: number;
    target: number;
    ratio: number;
    seqNo?:string
}
interface BarChartGraphProps {

    date: string
    obbSheet?: any
    unit?:string
}

export type defectData = {
    target:number,
    count: number
}
export type EfficiencyData = {
    operatorRfid: string,
name: string,
login: string;
logout: string;
offStandTime: string;
downTime:string ;
mechanic:string;
}



export interface DataRecord {

    seqNo: number;

    operatorRfid: string;

    operation: string;
    name: string;

    smv: number;

    count: number;

    type: string;

}


export interface TablePropType {
    operation: string;
    smv: number;
    count: number;
    availableHours: number;
    offStand: number;
    onStndEff: number;
    operator: string;
    ovlEff: number;
    stdHours: number;
    seqNo:number;
}

export type ExtendedOperatorRfidData = OperatorRfidData & {
    production: number;
    earnMins: number;
    minutes: number;
    hours: number;
    offStand: number;
    ovlEff: number;
    onStndEff: number;
    earnHours: number;
    offStandHours: number;
  };
export interface tableType {

    earnMinute: number;

    logout: string;

    login: string;

    name: string;

    offStandTime: string;

    operatorRfid: string;

    seqNo: number;

    smv: number;

    count: string;

}

function timeDifferenceInMinutes(minTime: string, maxTime: string): { hours: number, minutes: number } {

    // Convert the datetime strings to Date objects
    const minDate = new Date(minTime);
    const maxDate = new Date(maxTime);
    // Calculate the difference in milliseconds
    const timeDifferenceInMillis = maxDate.getTime() - minDate.getTime();
    // Convert milliseconds to minutes
    let minutes = (Number((timeDifferenceInMillis / (1000 * 60)).toFixed(1)));
    let hours = (Number((timeDifferenceInMillis / (1000 * 60*60)).toFixed(1)));
    
    if (hours >= 1) {
        hours -= 1;
        minutes -= 60; // Subtract 1 hour (60 minutes) from minutes
    }
    minutes = Number(Math.max(minutes, 0.1).toFixed(1));
    hours = Number(Math.max(hours, 0.1).toFixed(1));
    return{ hours,minutes};

}

function timeStringToMinutes(timeString: string | null | undefined): number {

   if(!timeString){
    return 0;
   }

    const timeParts = timeString.split(' ');


    let totalMinutes = 0;

    for (const part of timeParts) {

        const value = parseInt(part); // Get the numeric value

        if (part.includes('h')) {

            totalMinutes += value * 60; // Convert hours to minutes

        } else if (part.includes('m')) {

            totalMinutes += value; // Add minutes

        } else if (part.includes('s')) {

            totalMinutes += Math.floor(value / 60); // Convert seconds to minutes

        }

    }


    return Number((totalMinutes).toFixed(2));

}


const BarChartGraphEfficiencyRate = ({ date,obbSheet }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(50);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);
    const [obbData,setObbData]= useState<ObbSheet[]>([])

  
    const Fetchdata = async () => {
        try {
            
            setisSubmitting(true)
            
            console.log("line",obbSheet)
            // const data = await getFinalData(date,obbSheet)
            const newd = await getNew(date,obbSheet)
            console.log("aaa",newd)
            const login = await getLogin(date,obbSheet)
            // console.log("bbb",login)


            const newMapLast = newd.flatMap((n) => {
                const foundEntries = login.filter((l) => l.operatorRfid === n.operatorRfid);
                if (foundEntries.length > 0) {
                  return foundEntries.map((found) => ({
                    ...n,
                    name: found.name, // Add the name from the second query
                    eid: found.eid, // Add the employee ID from the second query
                    login: found.login, // Add the min login timestamp
                    logout: n.timestamp, // Add the max logout timestamp
                    offStandTime: found.offstandtime, // Add the off-stand time
                  }));
                }
                return []; // Skip entries without matching `login` data
              });

            // console.log("first",newMapLast)
            const obbData = await getObbData(obbSheet)
            setObbData(obbData)

    // console.log("obbData",obbData)
           


            const newMap = newMapLast.map((d)=>{

                const production = Number(d.sum)

                const earnMins = production*d.smv
                const earnHours = Number((earnMins/60).toFixed(2))

                const {hours,minutes} = timeDifferenceInMinutes(d.login,d.logout)

                const offStand = timeStringToMinutes(d.offStandTime)
                const offStandHours = Number((offStand/60).toFixed(2))

                const ovlEff = Math.max(0,Number(((earnMins/minutes)*100).toFixed(2)))
                const onStndEff = Math.max(0, Number(((earnMins / (minutes - offStand)) * 100).toFixed(2)));

                return {
                    ...d,
                    production:production,earnMins,minutes,hours,offStand,ovlEff,onStndEff,earnHours,offStandHours
                }

              


            }
            
        )

        console.log("newwww",newMap)

            setChartData(newMap)
    

        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)

    };



    useEffect(() => {
        Fetchdata()
        const chartWidths = Math.min(250, 110 + (chartData.length * 2));

    setChartWidth(chartWidths)
    }, [date, obbSheet])

    useEffect(() => {
       
            Fetchdata();
       
    }, [date, obbSheet]);



    


    return (
        <>
  <div className="flex justify-center ">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
       </div>
    
    
       

            {chartData.length > 0 ?
                    // <div className='bg-slate-100 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>

                <div className=' mb-16'>
                  <TableDemo date={date} obbData={obbData} tableProp={chartData}></TableDemo>
                </div>
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
           
            
        </>
    )
}

export default BarChartGraphEfficiencyRate