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

interface SmvBarChartProps {
    data: {
        groupName: string;
        actualSMV: number;
        calculatedSMV: number;
    }[]
}

const chartConfig = {
    actualSMV: {
        label: "Target SMV",
        color: "hsl(var(--chart-1))",
    },
    calculatedSMV: {
        label: "Actual Cycle Time",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig

const SmvBarChart = ({ 
    data
}: SmvBarChartProps) => {
    const chartData = data.map((item) => ({
        name: item.groupName,
        actualSMV: item.actualSMV,
        calculatedSMV: item.calculatedSMV.toFixed(2),
    }));

    return (
        <Card className='pr-2 pt-6 pb-4 border rounded-xl bg-slate-50'>
            <div className="px-8">
                <CardHeader>
                    <CardTitle>Target SMV vs Actual Cycle Time</CardTitle>
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
                            bottom: 200
                        }}
                        startAngle={10}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="actualSMV"
                            type="number"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={100}
                            axisLine={false}
                            angle={-45}
                            fontSize={11}
                            fontFamily="Inter"
                            fontWeight={600}
                            className="z-[999]"
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <ChartLegend 
                            content={<ChartLegendContent />} 
                            className="-mb-10 text-xs text-blue-500 font-bold" 
                            margin={{top:10}}
                        />
                        <Bar dataKey="actualSMV" fill="var(--color-actualSMV)" radius={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={11}
                                fontFamily="Inter"
                            />
                        </Bar>
                        <Bar dataKey="calculatedSMV" fill="var(--color-calculatedSMV)" radius={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={11}
                                fontFamily="Inter"
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default SmvBarChart