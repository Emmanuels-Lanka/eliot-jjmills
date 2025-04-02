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
import { geOperatorList, getOperatorEfficiencyData15M } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";



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


const xAxisLabel = "Operators"
const efficiencyLow = 5
const efficiencyHigh = 50


const ensureAllCategoriesHaveData = (series: any, categories: any, defaultValue = -1) => {
    console.log("categories", categories)
    return series.map((serie: any) => {
        const filledData = categories.map((category: any) => {
            const dataPoint = serie.data.find((d: any) => d.x === category);
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


const HmapChart15Compo = ({
    obbSheetId,
    date
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();


    const [heatmapData, setHeatmapData] = useState<any | null>(null);
    const [heatmapFullData, setHeatmapFullData] = useState<any | null>(null);
    const [operationList, setoperationList] = useState<any[]>([]);
    const [chartWidth, setChartWidth] = useState<number>(1850)
    const [timeList, settimeList] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)




    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        plotOptions: {
            heatmap: {
                distributed: true,
                enableShades: false,
                radius: 50,
                useFillColorAsStroke: true,
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
                            to: 70,
                            name: 'Low(Below 70%)',
                            color: '#ef4444'
                        },
                        {
                            from: 70,
                            to: 80,
                            name: 'Medium(70%-80%)',
                            color: '#FFAA33'
                        },
                        {
                            from: 80,
                            to: 10000,
                            name: 'High(above 80%)',
                            color: '#16a34a'
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff'],
                fontSize: '10px'
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
                    fontSize: '12px',
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
                minHeight: 300,
            },
           categories: operationList.map(o => o.name), // x-axis categories


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
                minheight:300,
            },
        },
        grid: {
            padding: {
                top: 40,
                right: 10,
                bottom: 10,
                left: 10,
            },
        },
    };


    const handleFetchProductions = async () => {
        try {
            setIsSubmitting(true)
            console.log("test111")
            const sqlDate = date + "%";
            const prod = await getOperatorEfficiencyData15M(obbSheetId, sqlDate)

            const opList = await geOperatorList(obbSheetId,sqlDate)
            setoperationList(opList)

            const heatmapData = getProcessData(prod as any[], operationList as any[]);
            const t = heatmapData.time
            settimeList(t as any)

            console.log("heatmapData1", heatmapData)
            setHeatmapData(heatmapData.dataSeries);
            setIsSubmitting(false)



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

    useEffect(() => {
        if (heatmapData?.length > 0) {
            const filledSeries = ensureAllCategoriesHaveData(heatmapData, operationList.map(o => o.name));
            setHeatmapFullData(filledSeries)
            //setHeatmapFullData(heatmapData)
        }
    }, [heatmapData])

    useEffect(() => {
        handleFetchProductions(); // Run immediately when the component mounts
        // let count = 1;
        const intervalId = setInterval(() => {
          handleFetchProductions();
        //   console.log(count++); c
        }, 10 * 60 * 1000);
        return () => clearInterval(intervalId);
      }, [obbSheetId, date]);

    //const height: string = timeList.length < 21 ? '200%' : timeList.length < 30 ? '300%' : '500%';
    const totalCount = Object.keys(timeList).reduce((acc, curr) => acc + curr.length, 0);
    const height: string = totalCount < 50 ? '600%' : totalCount < 60 ? '700%' : '600%';

    return (
        <>





            <div className="mx-auto max-w-[1850px]">
                {<div className=" flex justify-center items-center">
                    <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                </div>}

                {heatmapFullData !== null ?
                    <div className="mt-2   ">
                        <h2 className="text-lg mb-2 font-medium text-slate-700">{" "}</h2>
                        <ReactApexChart options={options} series={heatmapFullData} type="heatmap" height={height} width={chartWidth} />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                }{<div className="flex justify-center gap-2 mt-5 2xl:hidden block">

                    <Button onClick={() => setChartWidth((p) => p + 200)} className="rounded-full bg-gray-300">+</Button>
                    <Button onClick={() => setChartWidth((p) => p - 200)} className="rounded-full bg-gray-300"> -</Button>

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
    // console.log("aaaaa",res)
    return res


}


const getProcessData = (data: any[], operationList: any[]) => {
    // console.log("aaaaasssss",data)
    const fmtDataSeries = []
    const dataWithQuarter = data.map((d) => (
        {
            ...d, hour: new Date(d.timestamp).getHours(),
            qtrIndex: Math.floor(new Date(d.timestamp).getMinutes() / 15),
            smv:d.smv

        }
    )
    )

    //   const result = Object.groupBy(dataWithQuarter, (d) => d.hour.toString() + d.qtrIndex.toString());
    const result = Object.groupBy(dataWithQuarter, (d) => getTimeSlotLabel(d.hour, d.qtrIndex));
    console.log(result)

    let rc = 0
    for (const [key, value] of Object.entries(result)) {

        const dataGBOp = Object.groupBy(value || [], (d) => d.name);
        // console.log("abc",dataGBOp)
        const dataPoints = []
        for (const [key, value] of Object.entries(dataGBOp)) {
            const target = value?.[0].target ?? 1;


            const v = value?.reduce((a, d) => {

                return a + (d?.count ?? 0)
            }, 0)

            const earnMinutes = v*value?.[0].smv
            //   console.log("vqw", v)

            dataPoints.push({ x: key, y: ( (earnMinutes/15) * 100).toFixed(0) ?? 0 })
            rc += v

        }

        //fill unavailble timeslots



        fmtDataSeries.push({ name: key, data: dataPoints })


    }



    return { dataSeries: fmtDataSeries, time: result }


}




 
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