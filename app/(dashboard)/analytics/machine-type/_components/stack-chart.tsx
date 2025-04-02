
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useRef, useState } from "react"
import { getOperatorEfficiency} from "./actions"
import { Button } from "@/components/ui/button"

export const description = "A stacked bar chart with a legend"

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
 
  count: {
    label: "No. of machines",
    color: "hsl(var(--chart-1))",
  }
  
  
} satisfies ChartConfig


type BarChartData = {
  name: string;
  count: number;
  target: number;
  ratio: number;
  seqNo?:string
}
interface BarChartGraphProps {

  date: string
  obbSheetId: string
  timeValue:string
}

type smvData = {
  earnMinutes: number;
count: number;
name: string;
seqNo: string;
smv:number;

}


export function  StackChart({ date, obbSheetId,timeValue }: BarChartGraphProps) {


  const [chartDatas, setChartDatas] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(100);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);
    const[smvData,setSmvData] = useState<any[]>([])
    

    

const Fetchdata = async () => {
  try {
     
      setisSubmitting(true)
      const smvs :any = await getOperatorEfficiency(obbSheetId, date,timeValue)
      console.log(smvs)

    

      
  
   
     
     
      const chartData: any[] = smvs.map((i:any) => 
        
        { 
          return {
            count:Math.min(i.count,12),
            realCount:i.count,
            type:i.type
            
      }}
      
      );
     console.log(chartData)
      setChartDatas(chartData)

  }

  catch (error) {
      console.error("Error fetching data:", error);
  }
  setisSubmitting(false)

};

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
      const logoX = (canvas.width / 2) - (logoWidth + 150); // Adjust to place the logo before the text
      const logoY = 50;

      // Add the logo to the PDF
      pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

      // Set text color to blue
      pdf.setTextColor(0,113,193); // RGB for blue

      // Set larger font size and align text with the logo
      pdf.setFontSize(24);
      pdf.text('Dashboard -Machine Types', logoX + logoWidth + 20, 83, { align: 'left' });

      // Add the chart image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);

      // Save the PDF
      pdf.save('chart.pdf');
    };
  }
};



//create Excel sheet




const saveAsExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(chartDatas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
  XLSX.writeFile(workbook, `chart-data.xlsx`);
};


useEffect(() => {
  Fetchdata()
}, [date, obbSheetId,timeValue])





  return (


    <>
    {chartDatas.length>0 ? (
     <div className=' pt-5 -pl-8 rounded-lg border w-full h-[450px] mb-16 overflow-scroll'>
     <Card className="pr-2 pt-6  border rounded-xl  w-auto" style={{width:(chartWidth)+"%"}}>
      
       <CardContent>
         <ChartContainer
         ref={chartRef}
           config={chartConfig}
           className="  h-[500px] w-full pt-12" 
           style={{width:chartWidth+"%"}} 
         >
           <BarChart
             accessibilityLayer
             data={chartDatas}
             margin={{
              
             
               bottom:50
             }}

           >
             <CartesianGrid vertical={false} />
             <YAxis
               dataKey="count"
               type="number"
               tickLine={true}
               tickMargin={10}
               axisLine={true}
              //  domain={[0, 4000]}
               
             />
             <XAxis
               dataKey="type"
               tickLine={true}
               tickMargin={20}
               axisLine={true}
               angle={-90}
               fontSize={10}
               interval={0}
               textAnchor="end"
               


             />
             <ChartTooltip
               cursor={false}
               content={<ChartTooltipContent indicator="line"
                 />}
             />
             <ChartLegend
               verticalAlign="top"
               content={<ChartLegendContent />}
               className="mt-2 text-sm"
             />
             <Bar dataKey="count" fill="var(--color-count)" radius={5}>
               <LabelList
                //  dataKey="originalTarget"
                dataKey="realCount"
                 position="top"
                 offset={7} // Increase the offset value
                 className="fill-foreground"
                 fontSize={9}
               />
             </Bar>
             {/* <Bar dataKey="count" fill="var(--color-actual)" radius={5}>
               <LabelList
                 position="top"
                 offset={20} // Increase the offset value
                 className="fill-foreground"
                 fontSize={9}
                 
               />
             </Bar> */}
           </BarChart>
         </ChartContainer>
       </CardContent>
     </Card>
     </div>
    ):(
      <div className="mt-12 w-full">
        <p className="text-center text-slate-500">No Data Available...</p>
      </div>)}

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
