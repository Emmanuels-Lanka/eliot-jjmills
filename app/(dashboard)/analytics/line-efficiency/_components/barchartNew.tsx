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
import { getChecked, getDefects, getEfficiencyData, getObbData, getProducts } from "./actions";
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

function timeDifferenceInMinutes(minTime: string, maxTime: string): number {

    // Convert the datetime strings to Date objects
    const minDate = new Date(minTime);
    const maxDate = new Date(maxTime);
    // Calculate the difference in milliseconds
    const timeDifferenceInMillis = maxDate.getTime() - minDate.getTime();
    // Convert milliseconds to minutes
    const differenceInMinutes = (Number((timeDifferenceInMillis / (1000 * 60*60)).toFixed(1)));
    return differenceInMinutes;

}

function timeStringToMinutes(timeString: string): number {

   

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


    return Number((totalMinutes/60).toFixed(2));

}

const BarChartGraphEfficiencyRate = ({ date,obbSheet }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<TablePropType[]>([])
    const [chartWidth, setChartWidth] = useState<number>(50);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);
    const [obbData,setObbData]= useState<ObbSheet[]>([])

  
    const Fetchdata = async () => {
        try {
            
            setisSubmitting(true)
            

            const time = await getEfficiencyData(date+"%")
            const prod = await getProducts(date+"%",obbSheet)

            console.log("time",time)
            console.log("prod",prod)
            const obbData = await getObbData(obbSheet)
            setObbData(obbData)

    // console.log("obbData",obbData)
           



            const prodTime = time.map((t)=>{
                const found= prod.find((f)=>f.operatorRfid === t.operatorRfid)

                return {
                    ...t,  seqNo: found?.seqNo ?? 0, // Default to 0 if undefined
                    operation: found?.operation ?? "Unknown", // Default to "Unknown" if undefined
                    smv: found?.smv ?? 0, // Default to 0 if undefined
                    count: found?.count ?? 0, // Default to 0 if undefined
                    type: found?.type ?? "Unknown", // Default to "Unknown" if undefined
                }
            })

            const prodTimeEarn = prodTime.map((p)=>{
                const earnMinute = Number((( p.smv*p.count)/60).toFixed(2))
                return {
                    ...p, earnMinute
                }
            })


            const timeProd = prod.map((t)=>
            {
                const found  = time.find((p)=>p.operatorRfid == t.operatorRfid)
                const earnMinute =( Number(((t.smv*t.count)/60).toFixed(2)))
                
                return{
                    ...t,...found,earnMinute
                }
            })
            
            

            console.log("first",timeProd)


            const filtered = prodTimeEarn.map((t)=>{
                const timeDifference = timeDifferenceInMinutes(t.login? t.login: "" ,t.logout?t.logout:"")
                const mech = timeStringToMinutes(t.mechanic ? t.mechanic: "")
                const downTime = timeStringToMinutes(t.downTime ? t.downTime: "")
                const offStand = (timeStringToMinutes(t.offStandTime?t.offStandTime:"")+mech+downTime)
                return{
                    ...t,timeDifference:timeDifference,offStand:offStand
                }
            })

            console.log("asdasdasd",timeProd)


            const newEff = filtered.map((f)=>{
                
                const ovlEff = Math.max(0,Number(((f.earnMinute/f.timeDifference)*100).toFixed(2)))
                const onStndEff = Math.max(0, Number(((f.earnMinute / (f.timeDifference - f.offStand)) * 100).toFixed(2)));
                return{
                    ...f,ovlEff:ovlEff,onStndEff:onStndEff
                }
            })



            const finalMap :TablePropType []= newEff.map((n)=>
            {
                return{
                    operator: n.name,availableHours:n.timeDifference,stdHours:n.earnMinute,offStand:n.offStand
                    ,ovlEff:n.ovlEff,onStndEff:n.onStndEff,seqNo:n.seqNo,count:n.count,smv:n.smv,operation:n.operation
                }
            }).sort((a,b)=> (a.seqNo-b.seqNo)).filter((f)=> f.seqNo>0).filter((f)=>f.availableHours > 0)

            // console.log("filtered",filtered)
            // console.log("newEFF",newEff)
            console.log("finaaaal",finalMap)


            setChartData(finalMap)
        




          

           

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