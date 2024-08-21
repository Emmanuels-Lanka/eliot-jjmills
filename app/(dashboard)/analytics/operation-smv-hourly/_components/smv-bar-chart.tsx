"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    ReferenceLine,
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
import { getSMV } from "../../operation-smv/_components/actions";

interface SmvBarChartProps {
  obbSheetId:string
  date:Date
}

type BarChartData={
  obbSheetId:string
  date:Date
}
const chartConfig = {
    smv: {
        label: "Actual Cycle Time",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig

const SmvBarChart = ({
   obbSheetId,date
}: SmvBarChartProps)=>{
  const[chartData,setChartData]=useState<BarChartData[]>([])


  const FetchData=async()=>{
    const result = await getSMV(obbSheetId, date);
             
    const chartData:BarChartData[]=result.map((item)=>({
        obbSheetId:item.obbSheetId,
        date:item.date
    }))
    setChartData(chartData)
  }

useEffect(() => {
    FetchData()
}, [date, obbSheetId])

    return (
        <Card className='pr-2 pt-6 pb-4 border rounded-xl bg-slate-50'>
            <div className="px-8">
                <CardHeader>
                    <CardTitle>Actual Cycle Time - Hourly</CardTitle>
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
                            left: 30
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="smv"
                            type="number"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={true}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={true}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} className="mt-2 text-sm" />
                        <ReferenceLine alwaysShow ifOverflow="extendDomain" position={'start'} y={tsmv} isFront={true} strokeWidth={10} stroke="red" strokeDasharray="3 3"
                            label={{
                                value: tsmv,
                                position: 'left',
                                offset: 40,
                                angle: 0,
                                color: 'red',
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}

                        />
                        <Bar dataKey="smv" fill="var(--color-smv)" radius={5}>
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
    )
}

export default SmvBarChart