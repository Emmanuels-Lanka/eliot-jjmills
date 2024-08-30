"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import { geOperationList, getData, getEliotMachineList } from "./actions";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
 


interface AnalyticsChartProps {
    obbSheetId: string
    date: string;
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


const xAxisLabel = "Operations"
const efficiencyLow = 5
const efficiencyHigh = 50


const ensureAllCategoriesHaveData = (series: any, categories: any, defaultValue = -1) => {
    console.log("series", series) // eliot id is inside of series
    
    return series.map((serie: any) => {
        const filledData = categories.map((category: any) => {
            const dataPoint = serie.data.find((d: any) => d.x === category);
            return {
                x: category,
                y: dataPoint ? dataPoint.y : defaultValue,
                eliotid:serie.eliotid
            };
        });
        return {
            ...serie,
            data: filledData,
        };
    });
};


const   HmapChart15Compo = ({
    obbSheetId,
    date
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();


    const [heatmapData, setHeatmapData] = useState<any[] | null>([]);
    const [heatmapFullData, setHeatmapFullData] = useState<any | null>(null);
    const [operationList, setoperationList] = useState<any[]>([]);
    const [EliotDeviceList, setEliotDeviceList] = useState<any[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)
    const [ eliotIdList, seteliotIdList ] = useState<any[]>([])


    const options = {
        chart: {
            type: 'heatmap' as const,
          },
          tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex ,w }:{series:any, seriesIndex:any, dataPointIndex:any,w:any}) {
                console.log("wwwww");
                console.log("series11q",series);
                console.log("seriesIndex11q",seriesIndex);
                console.log("dataPointIndex11q",eliotIdList[dataPointIndex].machineId);
                const value = series[seriesIndex][dataPointIndex];
                const category = w.globals.categoryLabels[dataPointIndex];
                const eliotDevice = value.eliotid;
                return `<div style="padding: 10px; color: #000;">
                         
                          <strong>Eliot Device Id: </strong> ${eliotIdList[dataPointIndex].serialNumber} <br/>
                          <strong>MAchine Id: </strong> ${eliotIdList[dataPointIndex].machineId} <br/>
                           
                        </div>`;
              },
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
                            color: '#FFFFFF'
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
                }, rotate: -90,
                minHeight: 200,
            },
            // categories: operationList.map(o => o.name), // x-axis categories
            categories: operationList.map(o => `${o.name} `)

        },

        yaxis: {
            title: {
                text: "Time",
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
                    marginBottom: '100px',
                },
                offsetY: 10,
            },
            
        },
        
    };


    const handleFetchProductions = async () => {
        try {
            
            setIsSubmitting(true)
            const sqlDate = date + "%";
            const prod: any[] = await getData(obbSheetId, sqlDate)
            const eliot = prod.map((m)=>(m.eliotid))
            console.log("eliot",eliot)
            const opList = await geOperationList(obbSheetId)
            setoperationList(opList)
            const heatmapDatas = getProcessData(prod as any[], operationList as any[]);
            //rem 0 ops
            console.log("heatmap data00000000",heatmapDatas)

            setHeatmapData(heatmapDatas);
            //console.log("heatmapData1", heatmapData)
            setIsSubmitting(false)

            


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
        if (heatmapData?.length ?? 0 > 0) {
            const filledSeries = ensureAllCategoriesHaveData(heatmapData, operationList.map(o => o.name));
            console.log("filled ",filledSeries)
            setHeatmapFullData(filledSeries)
        }
    }, [heatmapData])

    useEffect(() => {
        handleFetchProductions()

    }, [obbSheetId,date])

    useEffect(() => {
     
        const e= async ()=>{
        const s =  await getEliotMachineList(obbSheetId)
        console.log("machine data",s)
        seteliotIdList(s)
        }
        e()

    }, [obbSheetId,date])

 

    return (
        <>

            <div className="mx-auto max-w-[1680px]">
            {<div className=" flex justify-center items-center">
            <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
            </div>}
                {heatmapFullData !== null ?
                <Card className="mt-5 bg-slate-100 pt-5 pl-8 rounded-lg border w-full mb-16 overflow-x-auto ">
                    <div>
                    <div>
                        <CardHeader>
                            <CardTitle>Operation Efficiency-15</CardTitle>
                        </CardHeader>
                    </div>
                        <h2 className="text-lg mb-2 font-medium text-slate-700">{" "}</h2>
                        <ReactApexChart options={options} series={heatmapFullData} type="heatmap" height={1000} width={2000} />
                    </div>
                    </Card>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                }
                
            </div>
           
        </>
    )
}

export default HmapChart15Compo;


const getTimeSlotLabel = (hr: number, qtrIndex: number) => {
    let res: string = ""
    hr = hr ?? 0
    let qtrStartLabel = (qtrIndex * 15).toString().padStart(2, "0")
    let hrStartLabel = hr.toString()
    let qtrEndLabel = qtrIndex != 3 ? ((qtrIndex + 1) * 15).toString().padStart(2, "0") : "00"
    let hrEndLabel = qtrIndex == 3 ? (hr + 1).toString() : hr.toString()

    res = `${hrStartLabel}:${qtrStartLabel}- ${hrEndLabel}:${qtrEndLabel}`

    return res


}


const getProcessData = (data: any[], operationList: any[]) :any[]=> {
    const fmtDataSeries = []
    
    const dataWithQuarter = data.map((d) => (
        {
            ...d, hour: new Date(d.timestamp).getHours(),
            qtrIndex: Math.floor(new Date(d.timestamp).getMinutes() / 15),
            // eliotid:d.eliotid
          
        }
        
    )

    )
    
    
    //   const result = Object.groupBy(dataWithQuarter, (d) => d.hour.toString() + d.qtrIndex.toString());
    const result = Object.groupBy(dataWithQuarter, (d) => getTimeSlotLabel(d.hour, d.qtrIndex));
    console.log("dadadada",result)

    let rc = 0
    for (const [key, value] of Object.entries(result)) {



        const dataGBOp = Object.groupBy(value || [], (d) => d.name);
        const dataPoints = []
        for (const [key, value] of Object.entries(dataGBOp)) {
            const target = value?.[0].target ?? 1;
            const v = value?.reduce((a, d) => {

                return a + (d?.count ?? 0)
            }, 0)

            //   console.log("vqw", v)

            // dataPoints.push({ x: key, y: v ?? 0,eliotid: value?.[0].eliotid??0  })
            // rc += v
            dataPoints.push({ x: key, y: ((v /(target/4))*100).toFixed(1) ?? 0 })
            rc += v

        }

        //fill unavailble timeslots



        fmtDataSeries.push({ name: key, data: dataPoints })
    }

    return fmtDataSeries
}





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