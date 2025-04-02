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
import { getDHUData } from "./actions";


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
  obbSheetId: string;
}

const BarChartGraph = ({ date, obbSheetId }: BarChartGraphProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [productionData, setProductionData] = useState<BarchartData[]>([]);

  const [chartData, setChartData] = useState<BarchartData[]>([]);

  const[chartWidth,setChartWidth] = useState<number>(100)

  /////
  const handleFetchProductions = async () => {
    try {
      const prod = await getDHUData(obbSheetId, date);
        console.log("prod",prod)
    //   setProductionData(prod);
    
      const chartData1: any[] = prod.map((item) => ({
        
        name: item.name ,
        //target: item.qc,
        count: item.count.toFixed(2),
        
      }));
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
  };
 

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


  

  return (
    <>
      {chartData.length > 0 ? (
        <Card className="pr-2 pt-6  border rounded-xl bg-slate-50 w-auto" style={{width:(chartWidth)+"%", height:chartWidth+"%"}}>
          <div className="px-8">
            <CardHeader>
              <CardTitle className="text-center">
                {" "}
                {" "}
                Operator Wise DHU%
              </CardTitle>
              {/* <CardDescription>Number of items came across each scanning points today</CardDescription> */}
            </CardHeader>
          </div>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className=" max-h-screen  min-h-[300px] w-full " 
              style={{width:chartWidth+"%", height:chartWidth+"%"}} 
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
                  dataKey="count"
                  type="number"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <XAxis 
                
                  dataKey="name"
                  tickLine={true}
                  tickMargin={40}
                  axisLine={true}
                  angle={90}
                  fontSize={10}
                  interval={0}
                  textAnchor="start"
                  label={<Label value="Operators" offset={-10} position="outside" />}


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
                <Bar dataKey="count" fill="var(--color-actual)" radius={5} barSize={60}>
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
          <p className="text-center text-slate-500">No Data Available...</p>
        </div>
      )
      }
      {<div className="flex justify-center gap-2 mt-5 2xl:hidden block">

<Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">+</Button>
<Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300"> -</Button>

</div>
}
    </>
  );
};

export default BarChartGraph;
