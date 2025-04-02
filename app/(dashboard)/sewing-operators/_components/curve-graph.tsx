"use client"
import React, { useEffect, useState } from 'react'
// import { AnalyticsChartProps } from './analytics'

import { Loader2, TrendingUp } from "lucide-react"
import { CartesianGrid, Label, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
// import { getOperationSmv, getTargetValues } from './action'
import { cn } from '@/lib/utils'
import { getEfficiency } from './actions'
import { getFormattedTime } from '@/lib/utils-time'
export const description = "A line chart with a label"


export type learnCurveData = {
  day:any
  seqNo:string,
  count:number,
  name:string,
  operation:string,
  smv:number,
  first:any,
  last:any
};

export type learnCurveDatanew = {
  seqNo:string,
  count:number,
  name:string,
  operation:string,
  smv:number,
  first:any,
  last:any,
  diffInMinutes:any,
  datePoint:any
};


const GraphCompo  = ({date,obbSheet,operatorId}:any) => {


    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(170);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)

      const chartConfig = {
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))",
        },
        mobile: {
          label: "Mobile",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig
      

      const processData = (data: learnCurveDatanew[]) => {
        return data.map((d) => {
          const earnmins = d.smv * d.count;
      
          // Check if diffInMinutes is zero to prevent division by zero
          const efficiency = d.diffInMinutes > 0 ? Number(Math.round((earnmins / d.diffInMinutes) * 100)) : 0;
      
          return {
            ...d,
            efficiency,
          };
        });
      };

      function getMinutesDifference(data: learnCurveData[]): learnCurveDatanew[] {
        return data.map(d => {
            const start = new Date(d.first);
            const end = new Date(d.last);
    
            // Ensure start is before end
            const [earlier, later] = start < end ? [start, end] : [end, start];
    
            const diffInMs = later.getTime() - earlier.getTime();
            let diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
            // Subtract 60 minutes for the break if applicable, ensuring no negative values
            diffInMinutes = Math.max(diffInMinutes - 60, 0);
    
            const datePoint = getFormattedTime(d.day);
    
            return {
                ...d,
                diffInMinutes,
                datePoint
            };
        });
    }
    
      const Fetchdata = async () => {
        try {          
            
          console.log("qweqeew",operatorId)
            
            // setisSubmitting(true)
            setisSubmitting(true)

            const eff= await getEfficiency(obbSheet, date+"%",operatorId)
            console.log("afdf",eff)
            const timegap= getMinutesDifference(eff)
            console.log(timegap)
            const realData = processData(timegap)
            console.log("aaa",realData)

          
           
            setChartData(realData)
            // console.log("chart",chartData)
        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)

        // setisSubmitting(false)

    };

    useEffect(() => {
        Fetchdata()
        
    }, [date, obbSheet])



  return (
   <div>
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />

  
        {chartData.length > 0 ? (
    <div className='bg-slate-50 w-screen mb-16 overflow-scroll'>

    <Card className='bg-slate-50 pt-4  max-w-[600px]'>
      
      <CardContent>
        <ChartContainer 
        config={chartConfig} className={`min-h-[300px] max-h-[600px] `} style={{ width: chartWidth + "%", height: 600 + "%" }}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 200
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey="datePoint"
              tickLine={true}
                                    tickMargin={15}
                                    axisLine={true}
                                    angle={90}
                                    interval={0}
                                    textAnchor='start'
            >
              <Label value="Date" offset={150} position="bottom" /> {/* X-Axis Label */}
            </XAxis>
            <YAxis
              dataKey="efficiency"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            //   tickFormatter={(value) => value.slice(0, 3)}
            > 
            <Label value="Efficiency" offset={-150} position="bottom" angle={90} /> {/* X-Axis Label */}</YAxis>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend verticalAlign='top'></ChartLegend>
            <Line
              dataKey="efficiency"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              
                
              <LabelList
                position="top"
                offset={17}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            
          </LineChart>
        </ChartContainer>
      </CardContent>
 
    </Card>
    </div>
    ) : (<div className="mt-12 w-full">
     <p className="text-center text-slate-500">No Data Available....</p>
 </div>)
  }
    
   
   </div>
  )
}

export default GraphCompo 