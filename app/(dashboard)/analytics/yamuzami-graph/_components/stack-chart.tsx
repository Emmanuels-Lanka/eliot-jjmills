
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { getOperatorEfficiency, getSMV } from "./actions"
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
 
  nnva: {
    label: "Necessary Non Value Added",
    color: "hsl(var(--chart-4))",
  },
  nva: {
    label: "Non Value Added",
    color: "hsl(var(--chart-1))",
  },
  
  earnMinutes: {
    label: "Earn Minutes",
    color: "hsl(var(--chart-2))",
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
    

    const calculateWorkingMinutes = (dateStr: string): number => {
      const today = new Date();
      const targetDate = new Date(dateStr);
      
      // Reset hours to compare just the dates
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const compareDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      
      const isToday = todayDate.getTime() === compareDate.getTime();
      
      if (isToday) {
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        
        // If current time is before 8 AM
        if (currentHour < 8) {
          return 0;
        }
        
        // If current time is after 5 PM
        if (currentHour >= 17) {
          return 9 * 60; // 9 hours in minutes
        }
        
        // Calculate minutes from 8 AM to current time
        const minutesSince8AM = (currentHour - 8) * 60 + currentMinute;
        return minutesSince8AM;
      }
      
      // For past dates, return 9 hours in minutes
      return 9 * 60;
    };
  
  

const Fetchdata = async () => {
  try {
     
      setisSubmitting(true)
      const smvs :any = await getSMV(obbSheetId, date,timeValue)
      const prods:any = await getOperatorEfficiency(obbSheetId,date,timeValue)

     console.log("test",date,obbSheetId,timeValue)
      console.log(smvs)
      console.log(prods)
      const joined = [] 

      for (const smv of smvs) {
        for (const prod of prods){
          if(smv.name === prod.name)
            joined.push({...smv,...prod})
        }
      }

      console.log("j",joined)
      setSmvData(joined)


      // const totalMinutes = calculateWorkingMinutes(date);
      const totalMinutes = calculateWorkingMinutes(date);

   
     

      
      const convertToMinutes = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(' ').map(time => parseInt(time.replace(/\D/g, ''), 10) || 0);
        return hours * 60 + minutes + seconds / 60;
      };
     
      const chartData: smvData[] = joined.map((item) => 
        
        { 
          const em = item.total*item.avg;
          const nm = 60-em; 

         
          //  console.log(item)         


        
           const nonEff = item.net ? convertToMinutes(item.net):0;

        
           const tt=totalMinutes;

           const nnva= nonEff;
           const nva = (tt-nnva-em);

          return {
          
          
            name:item.name+"-"+item.oprtname,
            seqNo:item.seqNo,
            count:item.total,
            earnMinutes:em,
            nva:nva,
            nnva:nnva,
            smv:item.avg,
            total:tt
            
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
      pdf.text('Dashboard -Yamuzami Graph', logoX + logoWidth + 20, 83, { align: 'left' });

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
      <div className='  -pl-8 rounded-lg border w-full h-[450px]  overflow-scroll'>

<Card style={{width:(chartWidth*2)+"%"}}>
  
  <CardContent >
    <ChartContainer config={chartConfig} style={{width:(chartWidth*2)+"%", height:600}} ref={chartRef} >
      <BarChart accessibilityLayer data={chartDatas}
      margin={{
        
        bottom: 300
    }}
    barGap={50}>
        <CartesianGrid vertical={false} />
        <XAxis
                                dataKey="name"
                                tickLine={true}
                                tickMargin={10}
                                axisLine={true}
                                angle={90}
                                interval={0}
                                textAnchor='start'
                            />
                            <YAxis
                                dataKey={(entry) => entry.earnMinutes + entry.nva + entry.nnva}
                                type="number"
                                tickLine={true} 
                                tickMargin={10}
                                axisLine={true}

                            />
        <ChartTooltip content={<ChartTooltipContent  />} />
        <ChartLegend content={<ChartLegendContent />} 
              verticalAlign="top"
        
        />
        <Bar
          dataKey="earnMinutes"
          stackId="a"
          fill="var(--color-earnMinutes)"
          radius={[0, 0, 4, 4]}
          barSize={15}
        />
        <Bar
          dataKey="nva"
          stackId="a"
          fill="var(--color-nva)"
          radius={[0, 0, 0, 0]}
          barSize={15}
        />
        <Bar
          dataKey="nnva"
          stackId="a"
          fill="var(--color-nnva)"
          radius={[4, 4, 0, 0]}
          barSize={15}
        />
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
