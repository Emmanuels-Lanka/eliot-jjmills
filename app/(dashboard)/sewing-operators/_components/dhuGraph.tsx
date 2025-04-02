"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
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


import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { getChecked, getDefects } from "./actions";


const chartConfig = {
//   target: {
//     label: "Target",
//     color: "hsl(var(--chart-1))",
//   },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-2))",
  },
  count: {
    label: "DHU%",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type BarchartData = {
  name: string;
  count: number;
  target: number;
};
interface BarChartGraphProps {
  date: string;
  obbSheet: string;
  operatorId: string;
}

const EfficiencyBarChart = ({ date, obbSheet,operatorId }: BarChartGraphProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [productionData, setProductionData] = useState<BarchartData[]>([]);

  const [chartData, setChartData] = useState<any[]>([]);
  const [isSubmitting,setisSubmitting]=useState<boolean>(false)

  const[chartWidth,setChartWidth] = useState<number>(100)

  /////
  const processProductionData = async () => {
    console.log(date, obbSheet);
    date = date + "%";
    setisSubmitting(true);
    const checked = await getChecked(date, obbSheet);
    const defects = await getDefects(date, obbSheet, operatorId);




    let data = defects.sort((b, a) => b.count - a.count);
    const newData = data.map(d => {
        const dhu = Number(((d.count / checked.total) * 100).toFixed(3));
        return { ...d, dhu, checked: checked.total };
    });
    setChartData(newData);
    setisSubmitting(false);
};

  useEffect(() => {
    if (date.length > 0 && obbSheet.length > 0) {
        processProductionData();
    }
    const intervalId = setInterval(() => {

        processProductionData();

    }, 60000);

    return () => {
      clearInterval(intervalId);
    };


  }, [date, obbSheet]);


  

  return (
    <>
      {chartData.length > 0 ? (
        <Card className="pr-2 pt-6 border rounded-xl bg-slate-50 shadow-lg" style={{ width: "100%", height: 850 }}>
          <div className="px-8">
            <CardHeader>
              <CardTitle className="text-center">
                {" "}
                {" "}
                Operator DHU
              </CardTitle>
              {/* <CardDescription>Number of items came across each scanning points today</CardDescription> */}
            </CardHeader>
          </div>
          <CardContent>
          <ChartContainer
  config={chartConfig}
  className=" min-h-[300px] max-h-[800px] w-full"
  style={{ width: "100%", height: 600 }}
>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  bottom: 100,
                }}

              >
                <CartesianGrid vertical={false} />
                <YAxis
                  dataKey="dhu"
                  type="number"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <XAxis 
                
                  dataKey="operator"
                  tickLine={true}
               
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
                {/* <Bar dataKey="target" fill="var(--color-target)" radius={5}>
                  <LabelList
                    position="top"
                    offset={7} // Increase the offset value
                    className="fill-foreground"
                    fontSize={9}
                  />
                </Bar> */}
                <Bar dataKey="dhu" fill="var(--color-actual)" radius={5} barSize={60}>
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
      ) : (
        <div className="mt-12 w-full">
          <p className="text-center text-slate-500">No Data Available for DHU...</p>
        </div>
      )
      }
      
    </>
  );
};

export default EfficiencyBarChart;
