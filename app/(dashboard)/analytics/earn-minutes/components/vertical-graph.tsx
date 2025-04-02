"use client"

import { Loader2, TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getProduction, getSMV } from "../actions"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export const description = "A horizontal bar chart"

// const chartData = [
//     { month: "January", desktop: 186, mobile: 80 },
//     { month: "February", desktop: 305, mobile: 200 },
//     { month: "March", desktop: 237, mobile: 120 },
//     { month: "April", desktop: 73, mobile: 190 },
//     { month: "May", desktop: 209, mobile: 130 },
//     { month: "June", desktop: 214, mobile: 140 },
//   ]
const chartConfig = {
  earnMinutes: {
    label: "Earn Minutes",
    color: "hsl(var(--chart-1))",
  },
  nonStandardTime: {
    label: "Non Standard Time",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type BarChartData = {
  earnMinutes: number;
  count: number;
  name: string;
  seqNo: string;
  nonStandardTime: number;
};

type smvData = {
  earnMinutes: number;
count: number;
name: string;
seqNo: string;
nonStandardTime: number;
}

export type propItems = {
  obbSheet:string;
  date:string;
  timeslot:string;
}

export function VerticalGraph({obbSheet,date,timeslot}:propItems) {


    const [chartData, setChartData] = useState<BarChartData[]>([])
    const[isSubmitting,setisSubmitting]=useState<boolean>(false)
    // const[chartWidth,setChartWidth] = useState<number>(120)
    const[chartWidth,setChartWidth] = useState<number>(50)
    const[smvData,setSmvData] = useState<smvData[]>([])



    
    console.log("data", obbSheet,timeslot,date)


    const Fetchdata = async () => {
        
    try {
        // setisSubmitting(true)
    const smv :any = await getSMV({obbSheet,timeslot,date})

    const pCount : any = await getProduction({obbSheet,timeslot,date});
    const joined =[];
    

      for (const nsmv of smv) {
         
          for(const npCount of pCount)
          {
            if(nsmv.name === npCount.name)
            joined.push({...nsmv,...npCount})
          }
          
      }
        console.log("comb",joined)
        setSmvData(joined)



    console.log("count",pCount)



    // setsmvuctionData(smv)

    
          
  
        // const chartData1: BarChartData[] =  smv.map((item:any) =>
        //      {
        //         const workedTime = item.avg * 60; // Convert avg to minutes per hour
        //         const neutralTime = 60 - workedTime;
        //         ({

        //             workedTime: workedTime.toFixed(2),
        //             neutralTime: neutralTime.toFixed(2),


        //    name:item.name+"-"+"( "+item.machineId+" )",
           
        // //    avg:Number(item.avg.toFixed(2))
        //  avg:Number(parseFloat(item.avg.toString()).toFixed(2)),


        // })});


        console.log("smv,",smv)


        const chartData : smvData[] = smvData.map((item:any) => {

          const workedTime =item.avg*item.count;
          const neutralTime = Math.max(60 - workedTime);

          
          return{
            earnMinutes:item.avg*item.count,
            count: item.count,
            name: item.name,
            seqNo: item.seqNo,
            nonStandardTime: neutralTime

          }
    })

       
         setChartData(chartData)
         const longestLabel = Math.max(...chartData.map(item => item.name.length));
    setChartWidth(longestLabel * 8); 
        console.log("chart data",chartData)
        
        
        } 
        catch (error) {
        console.error("Error fetching data:", error);
    }
    // setisSubmitting(false)
    
};



useEffect(() => {

        
   
    Fetchdata()
    


}, [])


useEffect(() => {

        
   
  Fetchdata()



}, [obbSheet,date,timeslot,chartData])



// useEffect(() => {
//     if (chartData.length > 0) {
//       const longestLabel = Math.max(...chartData.map(item => item.name.length));
//       setChartWidth(longestLabel * 10);  
//     }
//   }, [chartData]);



  return (
    <>
    <div className="justify-center">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
        </div>

       






        <div className=' pt-5 -pl-8 rounded-lg border w-screen h-[1000px] mb-16 overflow-x-auto'>
        <Card className="pr-2 pt-6  border rounded-xl  w-screen h-[1000px]" >
      {/* <CardHeader>
        <CardTitle>Bar Chart - Horizontal</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent>
        <ChartContainer config={chartConfig}
        style={{height:chartWidth+"%"}}
        
         >
          <BarChart

            
            accessibilityLayer
            data={chartData}
            
            layout="vertical"
            margin={{
              left: 120,    
            }}
          >
            <XAxis type="number"  hide />
            <YAxis

              
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={150}
              axisLine={false}
             
               tickFormatter={(value) => value.slice(0, 20)}
               interval={0}
               tick={{
                
                textAnchor: 'start', // Ensure the text remains on a single line
                    width: 200, // Optional: Set a max width for the label area
                    overflow: 'hidden', // Hide any overflow if the label is too long
                    // whiteSpace: 'nowrap',
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  />}
            />
            <Bar
              dataKey="earnMinutes"
              stackId="a"
              fill="var(--color-earnMinutes)"
              radius={[12, 0, 0, 12]}
              barSize={25}
            />
            <Bar
              dataKey="nonStandardTime"
              stackId="a"
              fill="var(--color-nonStandardTime)"
              radius={[0, 12, 12, 0]}
              barSize={25}

            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
    </div>
    
    
    </>
  )
}
