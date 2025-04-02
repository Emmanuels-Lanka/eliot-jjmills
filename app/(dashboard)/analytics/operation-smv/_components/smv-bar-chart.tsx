"use client"

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
import { useEffect, useState } from "react";
import { getSMV } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const chartConfig = {
    smv: {
        label: "SMV",
        color: "hsl(var(--chart-1))",
    },
    avg: {
        label: "Cycle Time",
        color: "hsl(var(--chart-2))",
    },
    realavg: {
        label: "Average",
        color: "hsl(var(--chart-3))",
    }
} satisfies ChartConfig

type BarChartData = {
    smv:number;
    name:string;
    avg: number;
    machineId?:string;
    realavg?:any;
};

interface BarChartGraphProps {
    date: string
    obbSheetId: string
}



const BarChartGraphOpSmv = ({ date, obbSheetId }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [productionData, setProductionData] = useState<BarChartData[]>([]);

    const[chartWidth,setChartWidth] = useState<number>(120)
    const[isSubmitting,setisSubmitting]=useState<boolean>(false)

    const chartRef = useRef<HTMLDivElement>(null);

    const Fetchdata = async () => {
        
        try {


            setisSubmitting(true)
        const prod = await getSMV(obbSheetId, date)
        console.log("first",prod)
        // setProductionData(prod)
        
              
      
            const chartData1: BarChartData[] = prod.map((item) => ({
               name:item.name+"-"+"( "+item.machineId+" )",
               smv:item.smv,
            //    avg:Number(item.avg.toFixed(2))
             avg:Number(parseFloat(item.avg.toString()).toFixed(3)),
             realavg:Math.floor(((((Number(parseFloat(item.avg.toString()).toFixed(2)))/item.smv)))*100)+"%",

            }));
            console.log("AVG values:", chartData1.map(item => item.avg));
            setProductionData(chartData1)
            setChartData(chartData1)
            console.log("chart data",chartData1)
            
            
            } 
            catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)
        
    };

    useEffect(() => {

        
        if(obbSheetId){
        Fetchdata()
        
        }
    }, [obbSheetId,date])


    useEffect(() => {
        const chartWidths = Math.min(250, 100 + (chartData.length * 2));
        setChartWidth(chartWidths);
      }, [chartData]); 

    // useEffect(()=>{
    //     console.log("1firstq")
    // },[])
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         Fetchdata();
    //     }, 60000); 
    
    //     return () => clearInterval(interval);
    // }, [date, obbSheetId]);
   

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
        pdf.setFontSize(30);
        pdf.text('Dashboard -  SMV vs Cycle Time', logoX + logoWidth + 20, 83, { align: 'left' });
  
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



const renderCustomLabel = ({ x, y, width, value, index }: any) => {
    const realAvgValue = chartData[index]?.realavg || 0;
    return (
        <text x={x + width -15} y={y - 5} fill="black" fontSize={11} fontFamily="Inter">
            {`${value} (${realAvgValue})`}
        </text>
    );
};


    return (
        <>
        <div className="justify-center">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
        </div>

       




        {chartData.length > 0 && (

        <div className='bg-slate-50  -pl-8 rounded-lg border w-full h-[450px]  overflow-scroll'>
        <Card className='bg-slate-50' style={{width:(chartWidth)+"%"}}>
           
            <CardContent  >
            <ChartContainer config={chartConfig} style={{width:chartWidth+"%", height:600}} ref={chartRef} >
                    <BarChart 
                        accessibilityLayer 
                        data={chartData}
                        margin={{
                            top:50,
                            bottom: 250
                        }}
                        startAngle={10}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="smv"
                            type="number"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            // tickMargin={70}
                            axisLine={false}
                            angle={90}
                            fontSize={11}
                            // fontFamily="Inter"
                            // fontWeight={600}
                            // className="z-[999]"
                            interval={0}
                            textAnchor="start"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        
                        <ChartLegend content={<ChartLegendContent />} 
              verticalAlign="top"
              margin={{bottom:50}}
        
        />
                        <Bar dataKey="smv" fill="var(--color-avg)" radius={5} barSize={25}>
                            <LabelList
                                position="top"
                                // content={renderCustomLabel}
                                offset={12}
                                className="fill-foreground"
                                fontSize={11}
                                fontFamily="Inter"
                            />
                        </Bar>
                         <Bar dataKey="avg" fill="orange" radius={5} barSize={25}>
                            <LabelList
                                position="top"
                                offset={12}
                                content={renderCustomLabel}
                                className="fill-foreground"
                                fontSize={11}
                                fontFamily="Inter"
                            />
                        </Bar>
                         {/* <Bar dataKey="realavg" fill="brown" radius={5} barSize={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={11}
                                fontFamily="Inter"
                            />
                        </Bar> */}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        </div>
        )}
        
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

export default BarChartGraphOpSmv