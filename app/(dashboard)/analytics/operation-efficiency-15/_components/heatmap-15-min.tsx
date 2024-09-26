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

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
 


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
    const chartRef = useRef<HTMLDivElement>(null);
    
  const [chartData, setChartData] = useState<any>([]);


    const options = {
        chart: {
            type: 'heatmap' as const,
          },
          tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex ,w }:{series:any, seriesIndex:any, dataPointIndex:any,w:any}) {
 
                const value = series[seriesIndex][dataPointIndex];
                const category = w.globals.categoryLabels[dataPointIndex];
                const eliotDevice = value.eliotid;
                return `<div style="padding: 10px; color: #000;">
                         
                          <strong>Eliot Device Id: </strong> ${eliotIdList[dataPointIndex].serialNumber} <br/>
                          <strong>Machine Id: </strong> ${eliotIdList[dataPointIndex].machineId} <br/>
                           
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
                            to: 50000,
                            name: 'Data',
                            color: '#0171c1'
                        },
                        // {
                        //     from: efficiencyLow,
                        //     to: efficiencyHigh,
                        //     name: 'Medium',
                        //     color: '#006400'
                        // },
                        // {
                        //     from: efficiencyHigh,
                        //     to: 1000,
                        //     name: 'High',
                        //     color: '#006400'
                        // },
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
                minHeight: 400,
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
                    marginBottom: '200px',
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
            
            const opList = await geOperationList(obbSheetId,sqlDate)
            setoperationList(opList)
            const heatmapDatas = getProcessData(prod as any[], operationList as any[]);
            setHeatmapData(heatmapDatas);
            
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
        const s =  await getEliotMachineList(obbSheetId,date)

        seteliotIdList(s)
        }
        e()

    }, [obbSheetId,date])

    // const saveAsPDF = async () => {
    //     if (chartRef.current) {
    //       const canvas = await html2canvas(chartRef.current);
    //       const imgData = canvas.toDataURL('image/png');
    //       const pdf = new jsPDF({
    //         orientation: 'landscape',
    //         unit: 'px',
    //         format: [canvas.width, canvas.height + 150],
    //       });
      
    //       const baseUrl = window.location.origin;
    //       const logoUrl = `${baseUrl}/logo.png`;
      
    //       const logo = new Image();
    //       logo.src = logoUrl;
    //       logo.onload = () => {
    //         const logoWidth = 110; 
    //         const logoHeight = 50;
    //         const logoX = (canvas.width / 2) - (logoWidth + 250); // Adjust to place the logo before the text
    //         const logoY = 50;
      
    //         // Add the logo to the PDF
    //         pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      
    //         // Set text color to blue
    //         pdf.setTextColor(0, 113 ,193); // RGB for blue
      
    //         // Set larger font size and align text with the logo
    //         pdf.setFontSize(30);
    //         pdf.text('Dashboard - Target vs Actual (Instance) ', logoX + logoWidth + 10, 83, { align: 'left' });
      
    //         // Add the chart image to the PDF
    //         pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);
      
    //         // Save the PDF
    //         pdf.save('chart.pdf');
    //       };
    //     }
    //   };
    
    
    //create Excel sheet
    
    const saveAsPDF = async () => {
        if (chartRef.current) {
          // Get the SVG from the ApexChart
          const svg = chartRef.current.querySelector("svg");
          
          if (!svg) {
            console.error("SVG not found");
            return;
          }
      
          // Create a canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
      
          // Set the canvas dimensions
          const svgRect = svg.getBoundingClientRect();
          canvas.width = svgRect.width;
          canvas.height = svgRect.height;
      
          // Create an image from the SVG data
          const svgData = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          img.src = "data:image/svg+xml;base64," + window.btoa(svgData);
      
          img.onload = () => {
            context?.drawImage(img, 0, 0);
      
            // Convert the canvas to an image
            const imgData = canvas.toDataURL("image/png");
      
            // Initialize jsPDF
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [canvas.width, canvas.height + 150],
            });
      
            // Add the image to the PDF
            pdf.addImage(imgData, "PNG", 0, 150, canvas.width, canvas.height);

             const baseUrl = window.location.origin;
          const logoUrl = `${baseUrl}/logo.png`;
      
         const logo = new Image();
      logo.src = logoUrl;
    // //       logo.onload = () => {
             const logoWidth = 110; 
             const logoHeight = 50;
             const logoX = (canvas.width / 2) - (logoWidth + 250); // Adjust to place the logo before the text
             const logoY = 50;
      
    // //         // Add the logo to the PDF
          pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      
    // //         // Set text color to blue
         pdf.setTextColor(0, 113 ,193); // RGB for blue
      
    // //         // Set larger font size and align text with the logo
            pdf.setFontSize(30);
            pdf.text('Dashboard - Production HeatMap (15) ', logoX + logoWidth + 10, 83, { align: 'left' });
      
    // //         // Add the chart image to the PDF
             pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);
      
            // Add your title or logo here, as you did before
      
            // Save the PDF
            pdf.save("chart.pdf");
          };
        }
      };
      
    
      let width = heatmapData && heatmapData?.length > 15  ? 3000 : 3000; 
      let height = heatmapData && heatmapData?.length < 15  ? 600 : 1500
    
    
    
    const saveAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(chartData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
        XLSX.writeFile(workbook, `chart-data.xlsx`);
    };
 

    return (
        <>





            <div className="mx-auto max-w-[1680px]">
            {<div className=" flex justify-center items-center">
            <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
            </div>}
                {heatmapFullData !== null ?
                    // <div className="mt-12 bg-slate-100 pt-5 pl-8 rounded-lg border w-full mb-16 overflow-x-auto overflow-y-scroll "   ref={chartRef}>
                    <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-[500px] mb-16 overflow-scroll'>
                    <h2 className="text-lg mb-2 font-medium text-slate-700">{" "}</h2>
                        <ReactApexChart options={options} series={heatmapFullData} type="heatmap" height={height} width={2000} />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                }
                
            </div>
            {/* Button Section */}
    {true && (
      <div className="flex flex-col items-center mt-5">
        {/* <div className="flex gap-2">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div> */}

        <div className="flex gap-3 mt-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={saveAsExcel}>
            Save as Excel
          </Button>
        </div>
      </div>
    )}
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
    

    let rc = 0
    for (const [key, value] of Object.entries(result)) {



        const dataGBOp = Object.groupBy(value || [], (d) => d.name);
        const dataPoints = []
        for (const [key, value] of Object.entries(dataGBOp)) {
            
            const v = value?.reduce((a, d) => {

                return a + (d?.count ?? 0)
            }, 0)

            //   console.log("vqw", v)

            dataPoints.push({ x: key, y: v ?? 0,eliotid: value?.[0].eliotid??0  })
            rc += v

        }

        //fill unavailble timeslots



        fmtDataSeries.push({ name: key, data: dataPoints })
    }

 






    return fmtDataSeries


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