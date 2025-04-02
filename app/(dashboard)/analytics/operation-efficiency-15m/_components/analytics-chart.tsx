"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import { geOperationList, getData } from "./actions";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
 
import HmapChart15Compo from "./heatmap-15-min";
import { getFormattedTime } from "@/lib/utils-time";


interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

type HourGroup = {
    [key: string]: {
        totalProduction: number;
        target: number;
        xAxis: string;
        count: number; // Count of productions
    };
}

// const options :ApexOptions =  {
//     chart: {
//       height: 350,
//       type: 'heatmap',
//     },
//     dataLabels: {
//       enabled: false
//     },
//     colors: ["#008FFB"],
//     title: {
//       text: 'HeatMap Chart (Single color)'
//     },
//   }


const xAxisLabel = "Productions"
const efficiencyLow = 5
const efficiencyHigh = 50
const width = 580

const ensureAllCategoriesHaveData = (series:any, categories:any, defaultValue = -1) => {
    
  return series.map((serie:any) => {
    const filledData = categories.map((category:any) => {
      const dataPoint = serie.data.find((d:any) => d.x === category);
      return {
        x: category,
        y: dataPoint ? dataPoint.y : defaultValue,
      };
    });
    return {
      ...serie,
      data: filledData,
    };
  });
};


const AnalyticsChartHmap15 = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [obbSheetId, setObbSheetId] = useState<string>("");
    const [heatmapData, setHeatmapData] = useState<any| null>(null);
    const [heatmapFullData, setHeatmapFullData] = useState<any| null>(null);
    const [operationList, setoperationList] = useState<any[]>([]);
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);
    const [newDate, setNewDate] = useState<any>();

    
     
    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
             
            const formattedDate =  getFormattedTime(data.date.toString())

            setNewDate(formattedDate);
            
            setObbSheetId(data.obbSheetId);
           router.refresh()

           
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

              { 
                obbSheetId &&
                
                <div className="mt-12">
                <HmapChart15Compo  obbSheetId={obbSheetId} date={newDate}></HmapChart15Compo>
                </div>}




                {/* {heatmapFullData !== null ?
                    <div className="mt-12 ">
                        <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2>
                        <ReactApexChart  options={ options} series={heatmapFullData} type="heatmap" height={1000} width={1500} /> 
                      
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                } */}
            </div>
        </>
    )
}

export default AnalyticsChartHmap15;


const getTimeSlotLabel =(hr:number,qtrIndex:number)=>{
    let res :string=""
    hr= hr??0
    let qtrStartLabel=(qtrIndex*15).toString().padStart(2,"0")
    let hrStartLabel = hr.toString()
    let qtrEndLabel=qtrIndex!=3 ? ((qtrIndex+1)*15).toString().padStart(2,"0"): "00"
    let hrEndLabel =  qtrIndex==3 ?  (hr+1).toString(): hr.toString()
   
     res= `${hrStartLabel}:${qtrStartLabel}- ${hrEndLabel}:${qtrEndLabel}`

return res


}


  
 
