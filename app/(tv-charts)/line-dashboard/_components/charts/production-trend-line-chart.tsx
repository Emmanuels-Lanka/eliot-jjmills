"use client";

import { Area, AreaChart, CartesianGrid, LabelList, ReferenceLine, XAxis, YAxis } from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    target: {
        label: "Target",
        color: "hsl(var(--chart-1))",
    },
    production: {
        label: "Production",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface ProductionTrendLineChartProps {
    data: {
        hour: string;
        target: number;
        production: number;
    }[];
}

export function ProductionTrendLineChart({ data }: ProductionTrendLineChartProps) {
    return (
        <ChartContainer
            config={chartConfig}
            className="pb-6 w-full h-full"
        >
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    top: 24,
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <ReferenceLine
                    x="13:00"
                    stroke="#f87171"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    label={{
                        value: "Lunch Break",
                        position: "top",
                        fill: "#f87171",
                        fontSize: 14,
                        letterSpacing: 0.4
                    }}
                />
                <defs>
                    <linearGradient id="fillTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-target)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-target)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                    <linearGradient id="fillProduction" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-production)"
                            stopOpacity={0.8}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-production)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="production"
                    type="monotone"
                    fill="url(#fillProduction)"
                    fillOpacity={0.4}
                    stroke="var(--color-production)"
                    dot={{
                        fill: "var(--color-production)",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                >
                    <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={14}
                    />
                </Area>
                <Area
                    dataKey="target"
                    type="monotone"
                    fill="url(#fillTarget)"
                    fillOpacity={0.4}
                    stroke="var(--color-target)"
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
                        className="fill-foreground"
                        fontSize={12}
                    />
                </Area>
                <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
        </ChartContainer>
    );
}
