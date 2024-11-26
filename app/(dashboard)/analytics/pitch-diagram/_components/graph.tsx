"use client"
import React, { useEffect, useRef, useState } from 'react'
import { AnalyticsChartProps } from './analytics'

import { Loader2, TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
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
import { getOperationSmv, getTargetValues } from './action'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { TableDemo } from './table-compo'
export const description = "A line chart with a label"

const GraphCompo  = ({date,obbSheet}:any) => {

    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(170);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const [flag,setFlag]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);

    
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
      


      const Fetchdata = async () => {
        try {          
            
            
            // setisSubmitting(true)
            setisSubmitting(true)

            const ops = await getOperationSmv(obbSheet, date)
            const vls = await getTargetValues(obbSheet)
        
           console.log(ops)
           console.log("QQ",vls)

            const newProd = ops.map((o) => ({
                ...o, // Spread the current operation
                ...vls // Spread the values from vls
            }));
            

           
            console.log("nnn",newProd)
           
            const chartData: any[] = newProd.map((item: any) => {

                const man = Number(item.operations)
                const tsmv = item[0].tsmv

                const obb = item[0].obb
                const target= Number((tsmv/man).toFixed(3))
                console.log("na",target)

              
                return(
                  
                
                {
                name:item.seqNo+"-"+item.name,
               
                smv:item.smv,
                target:target,
                seqNo:item.seqNo,
                nameOnly:item.name,
                obb:obb
        

          

            })}
            
            );
           
            setChartData(chartData)
            console.log("chart",chartData)
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

    const settingFlag = () => {
      setFlag(true);
   }

  return (
   <div>
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
        <div>
      <Button className="" onClick={settingFlag}>
          Download Report
        </Button>
      <div className='hidden'>
      <TableDemo tableProp={chartData} date={date} chartRef={chartRef} flag={flag} setFlag={setFlag} ></TableDemo>
      </div>
      </div>
  
        {chartData.length > 0 ? (
    <div className='bg-slate-50 w-full mb-16 overflow-scroll'>

    <Card className='bg-slate-50 pt-4' style={{width:(chartWidth)+"%"}}>
      
      <CardContent>
        <ChartContainer 
        config={chartConfig} className={`min-h-[300px] max-h-[600px] `} style={{ width: chartWidth + "%", height: 600 + "%" }}
        ref={chartRef}>
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
              dataKey="name"
              tickLine={true}
                                    tickMargin={15}
                                    axisLine={true}
                                    angle={90}
                                    interval={0}
                                    textAnchor='start'
            />
            <YAxis
              dataKey="smv"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend verticalAlign='top'></ChartLegend>
            <Line
              dataKey="smv"
              type="natural"
              stroke="darkOrange"
              strokeWidth={2}
              dot={{
                fill: "darkOrange",
              }}
              
            >
              
                
              <LabelList
                position="top"
                offset={17}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <Line
                                dataKey="target"
                                type="linear" // Use linear type for a straight line
                                stroke="green" // Change the color as needed
                                strokeWidth={2}
                                dot={false} // No dots on the target line
                                // strokeDasharray="5 5" // Optional: make it dashed
                            />

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