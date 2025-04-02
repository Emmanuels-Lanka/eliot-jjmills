"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
 

import { getFormattedTime } from "@/lib/utils-time";
import HmapChart15Compo from "./heatmap-15-min";
import { Loader2 } from "lucide-react";


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
    console.log("categories",categories)
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


const AnalyticsChartHmap15Oprtr = ({
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

export default AnalyticsChartHmap15Oprtr;


// const getTimeSlotLabel =(hr:number,qtrIndex:number)=>{
//     let res :string=""
//     hr= hr??0
//     let qtrStartLabel=(qtrIndex*15).toString().padStart(2,"0")
//     let hrStartLabel = hr.toString()
//     let qtrEndLabel=qtrIndex!=3 ? ((qtrIndex+1)*15).toString().padStart(2,"0"): "00"
//     let hrEndLabel =  qtrIndex==3 ?  (hr+1).toString(): hr.toString()
   
//      res= `${hrStartLabel}:${qtrStartLabel}- ${hrEndLabel}:${qtrEndLabel}`

   
// return res


// }


//   const getProcessData = (data: any[],operationList:any[]) => {
//       const fmtDataSeries = []
//       const dataWithQuarter = data.map((d) => (
//           {
//               ...d,  hour: new Date(d.timestamp).getHours(),
//                qtrIndex: Math.floor(new Date(d.timestamp).getMinutes() / 15)
//           }
//       )
//       )
      
//     //   const result = Object.groupBy(dataWithQuarter, (d) => d.hour.toString() + d.qtrIndex.toString());
//       const result = Object.groupBy(dataWithQuarter, (d) => getTimeSlotLabel(d.hour,d.qtrIndex));
      
//       let rc=0
//       for (const [key, value] of Object.entries(result)) {
            

           
//           const dataGBOp = Object.groupBy(value || [], (d) =>  d.name);
//           const dataPoints = []
//           for (const [key, value] of Object.entries(dataGBOp)) {

//               const v = value?.reduce((a, d) => {

//                   return a + (d?.count ?? 0)
//               },0)

//             //   console.log("vqw", v)
           
//               dataPoints.push({ x: key, y: v ?? 0 })
//                rc +=v

//           }

//           //fill unavailble timeslots



//           fmtDataSeries.push({ name: key, data: dataPoints })
//       }

//       console.log("rc",rc )


//       console.log("dataaaaaa", fmtDataSeries)






//       return fmtDataSeries


//   }
 



//  const getProcessData = (data: any[]) => {
//      const fmtDataSeries = [];
//      const dataWithQuarter = data.map((d) => ({
//          ...d,
//          hour: new Date(d.timestamp).getHours(),
//          qtrIndex: Math.floor(new Date(d.timestamp).getMinutes() / 15),
//      }));

//      const result = Object.entries(
//          dataWithQuarter.reduce((acc, current) => {
//              const key = `${current.hour}${current.qtrIndex}`;
//              if (!acc[key]) {
//                  acc[key] = [];
//              }
//              acc[key].push(current);
//              return acc;
//          }, {})
//      );

//      for (const [key, value] of result) {
//          const dataGBOp = Object.entries(
//              value.reduce((acc, current) => {
//                  if (!acc[current.name]) {
//                      acc[current.name] = [];
//                  }
//                  acc[current.name].push(current);
//                  return acc;
//              }, {})
//          );

//          const dataPoints = [];
//          for (const [name, values] of dataGBOp) {
//              const count = values.reduce((a, d) => a + d.count, 0);
//              dataPoints.push({ x: name, y: count });
//          }
//          fmtDataSeries.push({ name: key, data: dataPoints });
//      }

//      console.log("dataaaaaa", fmtDataSeries);

//      return fmtDataSeries;
//  };