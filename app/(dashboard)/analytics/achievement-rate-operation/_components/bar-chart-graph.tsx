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
import { getOperatorEfficiency } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { formatDate } from 'date-fns';
import ButtonSaveCompo from '@/components/dashboard/common/save-buttons';

const chartConfig = {
    target: {
        label: "",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig
type BarChartData = {
    name: string;
    count: number;
    target: number;
    ratio: number;
    seqno?:string
}
interface BarChartGraphProps {

    date: string
    obbSheetId: string
}

const BarChartGraph = ({ date, obbSheetId }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [chartWidth, setChartWidth] = useState<number>(220);
    const[isSubmitting,setisSubmitting]=useState<boolean>(false)

    const chartRef = useRef<HTMLDivElement>(null);

    const Fetchdata = async () => {
        try {
            //     const getShortName = (name: any) => {
            //         const afterDot = name.split('.')[1]?.trim();
            //         return afterDot ? afterDot.split(' ')[0] : null;

            //   }
           
            setisSubmitting(true)
            const prod = await getOperatorEfficiency(obbSheetId, date)
          
            let workingHrs = (new Date().getHours() - 8) + new Date().getMinutes() / 60;
            workingHrs > 10 ? 10 : workingHrs

           
            const chartData: BarChartData[] = prod.map((item,index) => ({
                name:item.seqno+" - "+item.name,
                

                
                count: item.count,
                target: item.target * workingHrs,
                ratio: parseFloat((item.count / (item.target * workingHrs)).toFixed(2)),

            })
            );
            
            setChartData(chartData)

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


    
//create pdf
    const saveAsPDF = async () => {
        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('chart.pdf');
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
          <Loader2
            className={cn(
              "animate-spin w-7 h-7 hidden",
              isSubmitting && "flex"
            )}
          />
        </div>

        {/* <div className="mb-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={saveAsExcel}>
            Save as Excel
          </Button>
        </div> */}




            {chartData.length > 0 ?
            <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>
               <div className='bg-slate-50'>
                <Card   className='pr-2 pt-1 pb-2 border rounded-xl bg-slate-50'>
                    {/* <div className="px-8">
                        <CardHeader>
                            <CardTitle>Overall Achievement(Live Data)</CardTitle>
                        </CardHeader>
                    </div> */}
                    <CardContent>
                        {/* <ChartContainer config={chartConfig} className={`min-h-[300px] max-h-[600px] w-[${chartWidth.toString()}%]`}> */}
                        <ChartContainer ref={chartRef}   config={chartConfig} className={`min-h-[300px] max-h-[600px] `} style={{ width: chartWidth + "%", height: chartWidth + "%" }}>

                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                
                                margin={{
                                    top: 0,
                                    bottom: 300
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
                                    content={<ChartTooltipContent indicator="line" />}
                                />

                                <Bar dataKey="ratio" fill="orange" radius={5}>
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={14}
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
               </div></div>
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
            <div className="flex justify-center gap-2 mt-5 ">

                <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300"><FaPlus size={12} color="#007bff" /></Button>
                <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300"> <FaMinus size={12} color="#007bff" /></Button>
                
            <ButtonSaveCompo 
            saveAsPDF={saveAsPDF}
            saveAsExcel={saveAsExcel} />

            </div>
            
        </>
    )
}

export default BarChartGraph