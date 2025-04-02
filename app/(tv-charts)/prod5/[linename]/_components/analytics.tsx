"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
// import { geOperationList, getData } from "./actions";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
 

import { getFormattedTime } from "@/lib/utils-time";
import Hmap15 from "./heatmap";
import { getLinebyOS, getObbSheetID } from "@/components/tv-charts/achievement-rate-operation/actions";
import LogoImporter from "@/components/dashboard/common/eliot-logo";


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


const AnalyticsChartHmap15 = ({ linename }: { linename: string }) => {
    const { toast } = useToast();
    const router = useRouter();

    
    const [heatmapData, setHeatmapData] = useState<any| null>(null);
    const [heatmapFullData, setHeatmapFullData] = useState<any| null>(null);
    const [operationList, setoperationList] = useState<any[]>([]);
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);
    const [newDate, setNewDate] = useState<any>();
  const [obbSheetId, setobbSheetId] = useState<string>("")
  const [lineName, setLineName] = useState<string>("")


  
     
    const handleFetchProductions = async () => {
        try {
            const obbSheetId1 = linename;
            const line =await getLinebyOS(linename);
            setLineName(line);
            setobbSheetId(obbSheetId1)
            const y = new Date().getFullYear().toString()
            const m = (new Date().getMonth() + 1).toString().padStart(2, "0")
            //const d = new Date().getDate().toString().padStart(2, "0")
            const today = new Date();
            const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
          
           const date =  yyyyMMdd.toString()+"%"
          

            setNewDate(date);
            
         
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

    useEffect(() => {
     
        handleFetchProductions()
      }, [linename])
    
      useEffect(() => {
    
        const fetchProductions = () => {
            handleFetchProductions();
        };
    

        fetchProductions();
    
  
        const intervalId = setInterval(fetchProductions, 300000);
    
        
        return () => clearInterval(intervalId);
    }, [linename]);
   

    return (
        <>


        <div>
        
        <div>
        <div className="h-[200]">
      <div className='flex justify-center items-center gap-3 w-screen'>
        {/* <Cog className='w-7 h-7 text-voilet' /> */}
        <LogoImporter/>
        <h1 className='text-[#0071c1] my-4 text-3xl '>Dashboard - 5 Minutes Production - {lineName} </h1>
      </div>

      {obbSheetId ?
        <Hmap15 obbSheetId={obbSheetId} date={newDate}></Hmap15> : <span>No Layout for Line {lineName} - {newDate}</span>}
    </div>
        </div>
        </div>
            
          
        </>
    )
}

export default AnalyticsChartHmap15;

