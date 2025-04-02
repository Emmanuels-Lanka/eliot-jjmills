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




               
            </div>
        </>
    )
}

export default AnalyticsChartHmap15;

