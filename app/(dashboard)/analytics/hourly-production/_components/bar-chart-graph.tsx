"use client"

import { TrendingUp } from "lucide-react";
import { Line, LineChart,} from "recharts";
import { Button } from "@/components/ui/button";
import { FaPlus, FaMinus } from 'react-icons/fa';
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
import { useState } from "react";
import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const chartConfig = {
    target: {
        label: "target",
        color: "hsl(var(--chart-1))",
    },
    actual: {
        label: "actual",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig
interface LineChartGraphProps {
    data: {
        name: string;
        count: number;
        target: number;
    }[]
}

const LineChartGraph = ({ data }: LineChartGraphProps) => {
    const [chartWidth, setChartWidth] = useState<number>(100);
    const chartRef = useRef<HTMLDivElement>(null);
    const chartData = data.map((item,index) => ({
        name: (item.name),
        target: item.target,
        actual: item.count,
    }));

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

    return (
        <>
         <div className='mb-3'>
            <Button type="button" className='mr-3' onClick={saveAsPDF}>Save as PDF</Button>
        </div>
        <Card className="bg-slate-50">
            <CardHeader>
                <CardTitle>Hourly Production - Target vs Actual</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer ref={chartRef} config={chartConfig}  style={{ width: chartWidth + "%" , height: chartWidth + "%" }}>
                    {/* <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 24,
                            left: 14,
                            right: 14,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                            dataKey="target"
                            type="natural"
                            stroke="var(--color-target)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-target)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground font-medium"
                                fontSize={14}
                            />
                        </Line>
                        
                        <Line
                            dataKey="actual"
                            type="natural"
                            stroke="var(--color-actual)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-actual)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground font-medium"
                                fontSize={14}
                            />
                        </Line>
                    </LineChart> */}



         <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  bottom:200
                }}

              >
                <CartesianGrid vertical={false} />
                <YAxis
                  dataKey="target"
                  type="number"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <XAxis
                  dataKey="name"
                  tickLine={true}
                  tickMargin={120}
                  axisLine={true}
                  angle={-90}
                  fontSize={8}
                  interval={0}


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
                <Bar dataKey="target" fill="var(--color-target)" radius={5}>
                  <LabelList
                    position="top"
                    offset={7} // Increase the offset value
                    className="fill-foreground"
                    fontSize={9}
                  />
                </Bar>
                <Bar dataKey="actual" fill="var(--color-actual)" radius={5}>
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
        
        <div className="flex justify-center gap-2 mt-5 ">

            <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300"><FaPlus size={12} color="#007bff" /></Button>
            <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300"> <FaMinus size={12} color="#007bff" /></Button>

        </div>
        </>
    )
}

export default LineChartGraph