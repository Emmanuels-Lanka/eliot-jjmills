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
import { getOperatorEfficiency } from "./actions";

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
}
interface BarChartGraphProps {

    date: string
    obbSheetId: string
}

const BarChartGraph = ({ date, obbSheetId }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])



    const Fetchdata = async () => {
        try {
        //     const getShortName = (name: any) => {
        //         const afterDot = name.split('.')[1]?.trim();
        //         return afterDot ? afterDot.split(' ')[0] : null;
        //   }
            const prod = await getOperatorEfficiency(obbSheetId, date)
            
            let workingHrs=(new Date().getHours()-8)+new Date().getMinutes()/60;
            workingHrs > 10? 10 :  workingHrs
              
           
            const chartData: BarChartData[] = prod.map((item) => ({
                name:item.name,
                count: item.count,
                target: item.target*workingHrs,
                ratio: parseFloat((item.count / (item.target*workingHrs)).toFixed(2)),

            }));
            setChartData(chartData)
            } 
            catch (error) {
            console.error("Error fetching data:", error);
        }

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




    return (
        <>
            {chartData.length > 0 ?
                <Card className='pr-2 pt-1 pb-2 border rounded-xl bg-slate-50 '>
                    <div className="px-8">
                        <CardHeader>
                            <CardTitle>Average Rate</CardTitle>
                        </CardHeader>
                    </div>
                    <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[600px] w-full">
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 0,
                                    bottom:10
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
                                    axisLine={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={45}
                                    axisLine={false}
                                    angle={80}
                                    

                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <ChartLegend content={<ChartLegendContent />} className="mt-2 text-sm" />
                                <Bar dataKey="ratio" fill="blue" radius={5}>
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
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
        </>
    )
}

export default BarChartGraph