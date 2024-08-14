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
import { getData } from "../actions";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const chartConfig = {
    target: {
      label: "Target",
      color: "hsl(var(--chart-1))",
    },
    actual: {
      label: "Actual",
      color: "hsl(var(--chart-2))",
    },
    count:{
        label: "Count",
        color: "hsl(var(--chart-3))",
    }
  } satisfies ChartConfig

type BarchartData = {
    name: string;
    count: number;
    target:number;
}
interface BarChartGraphProps {

    date:string;
    obbSheetId:string
    filterApplied:boolean
};




const BarChartGraph = ({date,obbSheetId,filterApplied}: BarChartGraphProps) => {
    
const router = useRouter()
const {toast} = useToast()
    
    
    const [productionData, setProductionData] =useState<BarchartData[]>([])
    
     const [chartData,setChartData] = useState<BarchartData[]>([])

    

    /////
    const handleFetchProductions = async () => {
        try {

            

            
            const prod = await getData(obbSheetId,date)
            
            console.log("hekkkk",prod)
            
            setProductionData(prod)

            const chartData1:BarchartData[] = prod.map((item) => ({
                name: item.name,
                target: item.target,
                count: item.count,
                
            }));
            setChartData(chartData1)
            

            router.refresh();
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
    ///


    useEffect(()=> {
        
        if(date.length>0 && obbSheetId.length>0){
            
            handleFetchProductions()
        }

    },[date,obbSheetId])
    



    return (
        <>
        {

        chartData.length > 0 ? 

        <Card className='pr-2 pt-6 pb-4 border rounded-xl bg-slate-50'>
            <div className="px-8">
                <CardHeader>
                    <CardTitle>Bar Chart - Target vs Actual</CardTitle>
                    {/* <CardDescription>Number of items came across each scanning points today</CardDescription> */}
                </CardHeader>
            </div>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[576px] w-full">
                    <BarChart 
                        accessibilityLayer 
                        data={chartData}
                        margin={{
                            top: 30,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="target"
                            type="number"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            angle={40}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} className="mt-2 text-sm"/>
                        <Bar dataKey="target" fill="var(--color-target)" radius={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={14}
                            />
                        </Bar>
                        <Bar dataKey="count" fill="var(--color-actual)" radius={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={14}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        :<div className="mt-12 w-full">
        <p className="text-center text-slate-500">No Data Available...</p>
    </div>
}
        </>
    )
}

export default BarChartGraph
