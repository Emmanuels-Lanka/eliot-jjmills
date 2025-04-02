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
import { getChecked, getDefects } from './actions';

const chartConfig = {
    dhu: {
        label: "Defects per Hundred Units",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig

type BarChartData = {
    checked: number
count: number
dhu: number
operator:string
part: string
}
interface BarChartGraphProps {

    date: string
    obbSheet: string
  
}

const EfficiencyBarChart = ({date,obbSheet }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [chartWidth, setChartWidth] = useState<number>(250);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);


    const processProductionData = async ()=> {

        setisSubmitting(true)
        const checked = await getChecked(date,obbSheet)
        const defects = await getDefects(date,obbSheet)

        console.log(defects)
        // console.log("che",checked)

        let data = defects.sort((b,a)=> b.count-a.count)
        // console.log("sorted",data)

       const newData= data.map(d=> {
        const dhu =Number((( d.count/ checked.total)*100).toFixed(3))
        return {
            ...d,
            dhu:dhu,
            checked:checked.total

        }
       })

    //    console.log("newww",newData)

       setChartData(newData)
        
       setisSubmitting(false)

    }

   

    useEffect(()=>{
        processProductionData()
    },[date,obbSheet])

    

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
                 <Card className='bg-slate-50 pt-4' >
               
                    <CardContent>
                        {/* <ChartContainer config={chartConfig} className={`min-h-[300px] max-h-[600px] w-[${chartWidth.toString()}%]`}> */}
                        <ChartContainer 
                        ref={chartRef}
                        config={chartConfig} className={`min-h-[300px] max-h-[600px] `}>

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
                                    dataKey="dhu"
                                    type="number"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}
                                />
                                
                                <XAxis
                                    dataKey="operator"
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

                                <Bar dataKey="dhu" fill="green" radius={5} barSize={25}>
                                    <LabelList
                                    dataKey="dhu"
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