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


const AnalyticsChartHmap15x = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [obbSheetId, setObbSheetId] = useState<any>();
    const [heatmapData, setHeatmapData] = useState<any| null>(null);
    const [heatmapFullData, setHeatmapFullData] = useState<any| null>(null);
    const [operationList, setoperationList] = useState<any[]>([]);
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);
    const [newDate, setNewDate] = useState<any>();

    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: 50,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: -10,
                            to: 0,
                            name: 'No Data',
                            color: '#f1f5f9'
                        },
                        {
                            from: 0,
                            to: 44,
                           name: 'Low',
                            color: '#ef4444'
                        },
                        {
                            from: 44,
                            to: 74,
                            name: 'Medium',
                            color: '#f97316'
                        },
                        {
                            from: 74,
                            to: 1000,
                            name: 'High',
                            color: '#16a34a'
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            }
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            title: {
                text: xAxisLabel,
                style: {
                    color: '#0070c0',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                }
            },
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },rotate: -90,
                minHeight:400,
            },
            categories: operationList.map(o=> o.name  ), // x-axis categories
            
           
        },
     
        yaxis: {
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom:'100px',
                    Height: 30,
                },
                offsetY: 50,
            },
        },
    };

    // Process production data to prepare it for the heatmap
    // const processForHeatmap = (productionData: ProductionData[]) => {
    //     const intervalOperations: HourGroup[] = Array.from({ length: 48 }, () => ({})); // 4 intervals per hour * 12 hours = 48
    //     const xAxisCategories: string[] = [];

    //     // Aggregate production data
    //     productionData.forEach((item: any) => {
    //         const date = new Date(item.timestamp);
    //         const baseHour = 7;
    //         const intervalsPerHour = 4; // Four 15-minute intervals per hour
    //         const hourIndex = date.getHours() - baseHour;
    //         const minuteIndex = Math.floor(date.getMinutes() / 15); // 0-14 -> 0, 15-29 -> 1, etc.
    //         const intervalIndex = hourIndex * intervalsPerHour + minuteIndex;

    //         if (intervalIndex >= 0 && intervalIndex < 48) { // Ensure within the 7:00 AM to 6:59 PM range
    //             const intervalGroup = intervalOperations[intervalIndex];
    //             const operation = intervalGroup[item.obbOperationId] || {
    //                 totalProduction: 0,
    //                 target: item.obbOperation.target / 4,
    //                 xAxis: item.obbOperation.operation.name,
    //                 count: 0
    //             };

    //             operation.totalProduction += item.productionCount;
    //             operation.count += item.productionCount;
    //             intervalGroup[item.obbOperationId] = operation;
    //         }
    //     });

    //     // Format heatmap data
    //     const heatmapData = intervalOperations.map(intervalGroup => {
    //         const operations = Object.values(intervalGroup);
    //         operations.forEach(op => {
    //             if (!xAxisCategories.includes(op.xAxis)) {
    //                 xAxisCategories.push(op.xAxis);
    //             }
    //         });
    //         return operations.map(op => op.count);
    //     });

    //     return { heatmapData, xAxisCategories };
    // };



    // Fetch production data and product counts, then process and set them
    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
           
            data.date.setDate(data.date.getDate()+1 );

            const formattedDate = data.date.toISOString().split('T')[0];

            setNewDate(formattedDate);
           
            setObbSheetId(data.obbSheetId);
              
            const sqlDate = formattedDate + "%";
            //const response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);


            const prod:any []  = await getData(data.obbSheetId, sqlDate)
            const opList = await geOperationList(data.obbSheetId,sqlDate )
            setoperationList(opList)
            //console.log("FOrmatted", getProcessData(prod))
            //console.log("daraaaaaaa", prod)

            //const heatmapData = processForHeatmap(response.data.data);
            const heatmapData = getProcessData(prod,operationList as any[]);
            
            setHeatmapData(heatmapData );


            //setHeatmapCategories(heatmapData.xAxisCategories);
            //setObbSheet(response.data.obbSheet);

           
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

    useEffect(()=>{
        if(heatmapData?.length>0){
        const filledSeries = ensureAllCategoriesHaveData(heatmapData, operationList.map(o=>o.name));
        setHeatmapFullData(filledSeries)
        }
    },[heatmapData])
    
    // useEffect(() => {

    //     const interval = setInterval(() => {
    //         if (obbSheetId && newDate) {
    //             handleFetchProductions({ obbSheetId, date: new Date(newDate) });
    //             console.log("hola")
    //         }
    //     }, 60000); 

    //     return () => clearInterval(interval); 
    // }, [obbSheetId, newDate]);

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchProductions}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
            
                {heatmapFullData !== null ?
                    <div className="mt-12 ">
                        <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2>
                        <ReactApexChart  options={ options} series={heatmapFullData} type="heatmap" height={1000} width={1500} /> 
                       {/* <HeatMapChartNew></HeatMapChartNew> */}
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

export default AnalyticsChartHmap15x;


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


  const getProcessData = (data: any[],operationList:any[]) => {
      const fmtDataSeries = []
      const dataWithQuarter = data.map((d) => (
          {
              ...d,  hour: new Date(d.timestamp).getHours(),
               qtrIndex: Math.floor(new Date(d.timestamp).getMinutes() / 15)
          }
      )
      )
      
    //   const result = Object.groupBy(dataWithQuarter, (d) => d.hour.toString() + d.qtrIndex.toString());
      const result = Object.groupBy(dataWithQuarter, (d) => getTimeSlotLabel(d.hour,d.qtrIndex));
      
      let rc=0
      for (const [key, value] of Object.entries(result)) {
            

           
          const dataGBOp = Object.groupBy(value || [], (d) =>  d.name);
          const dataPoints = []
          for (const [key, value] of Object.entries(dataGBOp)) {

              const v = value?.reduce((a, d) => {

                  return a + (d?.count ?? 0)
              },0)

            //   console.log("vqw", v)
           
              dataPoints.push({ x: key, y: v ?? 0 })
               rc +=v

          }

          //fill unavailble timeslots



          fmtDataSeries.push({ name: key, data: dataPoints })
      }
 




      return fmtDataSeries


  }

//////////////////////////////////////////////////////////////////////////////////////////////////



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