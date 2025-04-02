"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import SelectObbSheetDateOperation from "@/components/dashboard/common/select-obbsheet-date-operation";
import BarChartGraphOpSmv from "./smv-bar-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { getSMV } from "./actions";
import { date } from "zod";
import { getObbSheetID } from "@/app/(tv-charts)/ovef/[linename]/_components/actions";
import { Cog } from "lucide-react";
import LogoImporter from "@/components/dashboard/common/eliot-logo";


interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title:string;
}

 export type SMVChartData = {
    machineId: string;
   
    smv:number;
    name:string;
    avg:number;
};




const AnalyticsChart = ({ linename }: { linename: string }) => {
    const { toast } = useToast();
    const router = useRouter();

    const [barchartData, setBarchartData] = useState<SMVChartData[]>([]);
    // const [obbSheetId, setObbSheetId] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [userMessage,setUserMessage]=useState<string>("Please select style and date")
    const [obbSheetId, setobbSheetId] = useState<string>("")
    // const [date, setdate] = useState<string>("")
  
    const getObbSheetID1 = async () => {
      const obbSheetId1 = await getObbSheetID(linename);
      setobbSheetId(obbSheetId1)
     
    }

    
  useEffect(() => {

    const y = new Date().getFullYear().toString()
    const m = (new Date().getMonth() + 1).toString().padStart(2, "0")
    //const d = new Date().getDate().toString().padStart(2, "0")
    const today = new Date();
    const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  
   const date =  yyyyMMdd.toString()+"%"
    setDate(date)
    console.log("Build done")

  }, [])

  useEffect(() => {
     
    getObbSheetID1()
  }, [linename])

    // const handleFetchSmv = async (data: { obbSheetId: string; date: Date }) => {
    //     try {
            
    //         data.date.setDate(data.date.getDate() + 1);
    //         //const formattedDate = data.date.toISOString().split('T')[0];
    //         const formattedDate = data.date.toISOString().split('T')[0].toString()  ;
    //         setDate(formattedDate);
    //         setObbSheetId(data.obbSheetId);
            
    //         // console.log("obbSheetId",obbSheetId)
    //         // console.log("date",formattedDate)
        
    //         // router.refresh();
    //         // router.refresh();
          
    //     } catch (error: any) {
    //         console.error("Error fetching production data:", error);
    //         toast({
    //             title: "Something went wrong! Try again",
    //             variant: "error"
    //         });
    //     }
    // }

    return (
        <>
          <div className="h-[200]">
      <div className='flex justify-center items-center gap-3 w-screen'>
        {/* <Cog className='w-7 h-7 text-voilet' /> */}
        <LogoImporter/>
        <h1 className='text-[#0071c1] my-4 text-3xl '>Dashboard - SMV vs Cycle Time - {linename}</h1>
      </div>

      {obbSheetId.length > 0 ? 
     <BarChartGraphOpSmv 
     obbSheetId={obbSheetId}
     date={date}/>
      : <span> <p className="text-center text-slate-500">{userMessage}</p></span>}
    </div>
   
           
        </>
    )
}

export default AnalyticsChart