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
// import { getHours, getOperatorEfficiency } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { count } from 'console';
import { newOperationEfficiencyOutputTypes } from './analytics';

const chartConfig = {
    efficiency: {
        label: "Operator Efficiency",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig

type BarChartData = {
    count:number;
earnMinute: number;
efficiency:number;
name:string;
}
interface BarChartGraphProps {

    date: string
    obbSheetId?: string
    heatmapData:newOperationEfficiencyOutputTypes
}

const EfficiencyBarChart = ({heatmapData,date }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [chartWidth, setChartWidth] = useState<number>(250);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);


    const processProductionData = ()=> {

        const data = heatmapData.data[0].operation
        // console.log(data)
        const time = calculateMinutes(date)
        // console.log(time)
        
        const oprs = data.map(d=> {
            const eff = Number(((d.earnMinute/time)*100).toFixed(1));
            return {
                ...d,
                efficiency: eff
            }
            
        })
         
        console.log(oprs)

        const chartData = oprs.sort((a,b)=> b.efficiency-a.efficiency)
        console.log("sd",chartData)
        setChartData(chartData)

        // setChartData(chartData)

    }

    function calculateMinutes(date: string): number {
        const inputDate = new Date(date);
        const today = new Date();
        
        // Set the time for the input date to 8 AM
        const startOfDay = new Date(inputDate);
        startOfDay.setHours(8, 0, 0, 0); // 8 AM
    
        // Set the time for the input date to 5 PM
        const endOfDay = new Date(inputDate);
        endOfDay.setHours(17, 0, 0, 0); // 5 PM
    
        // Check if the input date is today
        if (inputDate.toDateString() !== today.toDateString()) {
            // Not today, return minutes from 8 AM to 5 PM
            return 540; // 9 hours * 60 minutes
        } else {
            // Today, calculate minutes from 8 AM to now
            const now = new Date();
            
            // If current time is before 8 AM, return 0
            if (now < startOfDay) {
                return 0;
            }
            
            // If current time is after 5 PM, return minutes from 8 AM to 5 PM
            if (now > endOfDay) {
                return 540; // 9 hours * 60 minutes
            }
            
            // Calculate minutes from 8 AM to now
            const minutes = Math.floor((now.getTime() - startOfDay.getTime()) / (1000 * 60));
            return minutes;
        }
    }

    useEffect(()=>{
        processProductionData()
    },[date,heatmapData])

    

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
                                    dataKey="efficiency"
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
                  content={<ChartTooltipContent indicator="line" />}
                />

                                <Bar dataKey="efficiency" fill="orange" radius={5}>
                                    <LabelList
                                    dataKey="efficiency"
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

export default EfficiencyBarChart