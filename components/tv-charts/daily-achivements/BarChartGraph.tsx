"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
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
import { useEffect, useState } from "react";
import { getData } from "./actions";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";


import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';

const chartConfig = {
  target: {
    label: "Daily Target",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-2))",
  },
  count: {
    label: "Actual Production",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type BarchartData = {
  name: string;
  count: number;
  target: any;
};
interface BarChartGraphProps {
  date: string;
  obbSheetId: string;
}

const BarChartGraph = ({ date, obbSheetId }: BarChartGraphProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [productionData, setProductionData] = useState<BarchartData[]>([]);

  const [chartData, setChartData] = useState<BarchartData[]>([]);

  const[chartWidth,setChartWidth] = useState<number>(220)

  const chartRef = useRef<HTMLDivElement>(null);

  const[isSubmitting,setisSubmitting]=useState<boolean>(false)

  /////
  const handleFetchProductions = async () => {
    try {
      setisSubmitting(true)
      const prod = await getData(obbSheetId, date);

      setProductionData(prod);
      const seq=1;
      // const chartData1: BarchartData[] = prod.map((item) => ({
        
      //   name: item.name,
      //   target: (item.target/60),// need to add the time until now
      //   count: item.count,
      // }));

      const chartData1: BarchartData[] = prod.map((item) => {
        const now = new Date(); 
        const currentHour = now.getHours(); 
        const currentMinutes = now.getMinutes(); 
        
        const startHour = 8; 
        const endHour = startHour+10; 
        
     
        const elapsedHours = currentHour > startHour ? Math.min(currentHour - startHour, endHour - startHour) : 0;
        

        const elapsedMinutes = currentHour >= endHour 
            ? (endHour - startHour) * 60 
            : (elapsedHours * 60 + currentMinutes); 
    
        const targetPerMinute = Math.round(item.target / 60)  ; 
        
        const adjustedTarget = (targetPerMinute * elapsedMinutes);
    
        return {
            // name: item.name,
            // target: item.target*10, // Use the calculated target
            // count: item.count,

            name: item.name,
  target: Math.min(item.target*10, 4000),
  count: Math.min(item.count, 4000),   
  originalTarget: item.target*10,         
  originalCount: item.count    
        };
    });
      setChartData(chartData1);

      router.refresh();
    } catch (error: any) {
      console.error("Error fetching production data:", error);
      toast({
        title: "Something went wrong! Try again",
        variant: "error",
        description: (
          <div className="mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md">
            <code className="text-slate-800">ERROR: {error.message}</code>

          </div>
        ),
      });
    }
    setisSubmitting(false)
  };
  ///

  useEffect(() => {
    if (date.length > 0 && obbSheetId.length > 0) {
      handleFetchProductions();
    }
    const intervalId = setInterval(() => {

      handleFetchProductions();

    }, 60000);

    return () => {
      clearInterval(intervalId);
    };


  }, [date, obbSheetId]);



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
        pdf.text('Dashboard -Target vs Actual - Production', logoX + logoWidth + 20, 83, { align: 'left' });
  
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
    
    
       


      {chartData.length > 0 ? (
        
        <div className=' pt-5 -pl-8 rounded-lg border w-full'>
        <Card className="pr-2 pt-6  border rounded-xl  w-auto" style={{width:(chartWidth*1.5)+"%"}}>
         
          <CardContent>
            {/* <ChartContainer
            ref={chartRef}
              config={chartConfig}
              className="  max-h-screen min-h-[300px] w-full " 
              style={{width:chartWidth+"%"}} 
            > */}
                        <ChartContainer ref={chartRef}   config={chartConfig} className={`min-h-[300px]  `} style={{ width: chartWidth + "%", height: 800 + "%" }}>

              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                
                  bottom: 300,
                }}

              >
                <CartesianGrid vertical={false} />
                <YAxis
                  dataKey="target"
                  type="number"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                  domain={[0, 4000]}
                  
                />
                <XAxis
                  dataKey="name"
                  tickLine={true}
                  tickMargin={15}
                  axisLine={true}
                  angle={90}
                  fontSize={10}
                  interval={0}
                  textAnchor="start"
                  


                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend
                  verticalAlign="top"
                  content={<ChartLegendContent />}
                  className="mt-2 text-sm"
                />
                <Bar dataKey="target" fill="var(--color-actual)" radius={5}>
                  <LabelList
                    dataKey="originalTarget"
                    position="top"
                    offset={7} // Increase the offset value
                    className="fill-foreground"
                    fontSize={9}
                  />
                </Bar>
                <Bar dataKey="count" fill="orange" radius={5}>
                  <LabelList
                    position="top"
                    offset={20} // Increase the offset value
                    className="fill-foreground"
                    fontSize={9}
                    
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        </div>
      ) : (
        <div className="mt-12 w-full">
          <p className="text-center text-slate-500">No Data Available...</p>
        </div>
      )
      }
     {/* Button Section */}
    {/* {chartData.length > 0 && (
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
    )} */}
    </>
  );
};

export default BarChartGraph;
