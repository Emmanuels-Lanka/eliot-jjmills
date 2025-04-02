"use client"
import { FaPlus, FaMinus } from 'react-icons/fa';
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
import { getHours, getOperatorEfficiency } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { count } from 'console';

const chartConfig = {
    realratio: {
        label: "Operation Efficiency",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig
type BarChartData = {
    name: string;
    count: number;
    target: number;
    ratio: number;
    seqNo?:string
    realratio?:number;
}
interface BarChartGraphProps {

    date: string
    obbSheetId: string
}

const BarChartGraphEfficiencyRate = ({ date, obbSheetId }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [chartWidth, setChartWidth] = useState<number>(250);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);

    const Fetchdata = async () => {
        try {          
            const getShortName = (name: any) => {
                return name.substring(1, 10) + "..."

            }
            setisSubmitting(true)
            const prod = await getOperatorEfficiency(obbSheetId, date)
            const hrs = await getHours(obbSheetId,date)
            // console.log("prd",prod)
            // console.log("hrs",hrs)
        
            const mergedArray :any= [];

           const aaa = prod.map((p)=> {
            const hre = hrs.find((h)=> h.namee === p.name)
            return {...p,login:hre?.login,logout:hre?.logout}
           })
            // console.log("aaa",aaa)
           

            const updatedData = aaa.map(item => {
              // Convert login, logout, and times to Date objects

              const firstProd = new Date(item.first)
              const lastProd = new Date(item.last)

              let loginTime = item.login ? new Date(item.login) : null;
              const logoutTime = item.logout ? new Date(item.logout) : null;
            
              // If login is null, set it to 8 AM on the same date as timesTime
              if (!loginTime) {
                loginTime = new Date(firstProd);
                
              }
            
              // Calculate time gap in milliseconds
              const timeGap = logoutTime
                ? logoutTime.getTime() - loginTime.getTime()  // If logout exists, use it
                : lastProd.getTime() - loginTime.getTime();  // Otherwise, use times
            
              // console.log("first", timeGap, item.name, item.seqNo);

              
              
              // Convert time gap from milliseconds to hours
              const timeGapHours = timeGap / (1000 * 60 * 60); // Convert ms to hours
            
              // Return a new object with the calculated time gap
              return {
                ...item,
                timeGapHours: timeGapHours.toFixed(2) // Round to 2 decimal places
              };
            });
            // console.log("aa",updatedData);





            // const updatedHrs = hrs.map((hour) => {
            //     const matchingProd = prod.find((p) => p.seqNo === hour.seqNo && p.name === hour.name);
              
            //     if (hour.logout === null && matchingProd) {
            //       return {
            //         ...hour,
            //         logout: matchingProd.times, // Assign the `times` value from `prod` if `logout` is null
            //       };
            //     }
              
            //     return hour; // Return the original object if no changes are made
            //   });
              
            //   // console.log(updatedHrs);



         
           
            // // console.log(asd)
            
            // const mergedData:any = updatedHrs.map((hour) => {
            //     const matchingProd = prod.find((p) => p.seqNo === hour.seqNo && p.name === hour.name);
              
            //     if (matchingProd) {
            //       return {
            //         seqNo: hour.seqNo,
            //         name: hour.name,
            //         avg: matchingProd.avg, // from prod
            //         count: matchingProd.count, // from prod
            //         login: hour.login, // from updatedHrs
            //         logout: hour.logout, // from updatedHrs (includes the updated logout time)
            //       };
            //     }
              
            //     // Handle case where there's no matching prod data (optional)
            //     return {
            //       seqNo: hour.seqNo,
            //       name: hour.name,
            //       avg: '', // Default value if no matching prod
            //       count: '', // Default value if no matching prod
            //       login: hour.login,
            //       logout: hour.logout,
            //     };
            //   });
              
            //   console.log("mm",mergedData);
           

            let workingHrs = (new Date().getHours() - 8) + new Date().getMinutes() / 60;
            workingHrs > 10 ? 10 : workingHrs

           
            const chartData: BarChartData[] = updatedData.map((item: any) => {

                const earnmins = item.count *item.avg
                const hours = item.timeGapHours 
              
                // Calculate the difference in milliseconds and convert it to hours
                
                // console.log("Working Hours:", workingHrs);
                return(
                  
                
                {
                name:item.seqNo+"-"+item.name,
               
                count: item.count,
                target: item.target * hours,
                ratio: Math.min(parseFloat(((earnmins / hours)).toFixed(2)), 200),
                realratio: parseFloat(((earnmins / hours)).toFixed(2))
                // ratio: (item.count / (item.target * workingHrs)) * 100,
                // ratio: parseFloat((item.count / (item.target * workingHrs)).toFixed(2))*100,
                

            })}
            
            );
           
            setChartData(chartData)
            // console.log("chart",chartData)
        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)

    };



    useEffect(() => {
        Fetchdata()
        
    }, [date, obbSheetId])

    useEffect(() => {
        const interval = setInterval(() => {
            Fetchdata();
        }, 60000);

        return () => clearInterval(interval);
    }, [date, obbSheetId]);

    
    useEffect(() => {
        const chartWidths = Math.min(250, 100 + (chartData.length * 2));
        setChartWidth(chartWidths);
      }, [chartData]); 



    //create pdf
    const saveAsPDF = async () => {
        if (chartRef.current) {
          const canvas = await html2canvas(chartRef.current);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height + 150],
          });
      
          const baseUrl = window.location.origin;
          const logoUrl = `${baseUrl}/logo.png`;
      
          const logo = new Image();
          logo.src = logoUrl;
          logo.onload = () => {
            const logoWidth = 110;
            const logoHeight = 50;
            const logoX = (canvas.width / 2) - (logoWidth + 100); // Adjust to place the logo before the text
            const logoY = 50;
      
            // Add the logo to the PDF
            pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      
            // Set text color to blue
            pdf.setTextColor(0,113,193); // RGB for blue
      
            // Set larger font size and align text with the logo
            pdf.setFontSize(24);
            pdf.text('Dashboard - Overall Operation Efficiency', logoX + logoWidth + 20, 83, { align: 'left' });
      
            // Add the chart image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);
      
            // Save the PDF
            pdf.save('chart.pdf');
          };
        }
      };

    
//create Excel sheet
    const saveAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(chartData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
        XLSX.writeFile(workbook, `chart-data.xlsx`);
    };

    


    return (
        <>
  <div className="flex justify-center ">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
       </div>
    
    
       

            {chartData.length > 0 ?
                    // <div className='bg-slate-100 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>

                <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-[450px] mb-16 overflow-scroll'>
                 <Card className='bg-slate-50 pt-4' style={{width:(chartWidth)+"%"}}>
               
                    <CardContent>
                        {/* <ChartContainer config={chartConfig} className={`min-h-[300px] max-h-[600px] w-[${chartWidth.toString()}%]`}> */}
                        <ChartContainer 
                        ref={chartRef}
                        config={chartConfig} className={`min-h-[300px] max-h-[600px] `} style={{ width: chartWidth + "%", height: 600 + "%" }}>

                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 20,
                                    bottom: 250
                                }}
                                barGap={10}
                                className="h-[300px] "
                            >
                                <CartesianGrid vertical={false} />
                                <YAxis
                                    dataKey="ratio"
                                    type="number"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}
                                />
                                <XAxis
                                    dataKey="name"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}
                                    angle={90}
                                    interval={0}
                                    textAnchor='start'
                                />
                                <ChartTooltip
                                
                                    cursor={false}
                                    content={<ChartTooltipContent  indicator="line"
                                      nameKey="realratio"
                                      
                                      />}
                                    
                                />

                                <Bar dataKey="ratio" fill="orange" radius={5}>
                                    <LabelList
                                    dataKey="realratio"
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                    />
                                </Bar>
                                {/* <Bar dataKey="count" fill="var(--color-actual)" radius={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={14}
                            />
                        </Bar> */}
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                </div>
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
           {chartData.length > 0 && (
      <div className="flex flex-col items-center mt-5">
        <div className="flex gap-2">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div>

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

export default BarChartGraphEfficiencyRate