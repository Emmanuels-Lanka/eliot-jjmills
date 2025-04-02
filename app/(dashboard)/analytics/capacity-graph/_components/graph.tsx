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
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getCapacity } from './action'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
export const description = "A line chart with a label"
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { TableDemo } from './table-compo'



const GraphCompo  = ({date,obbSheet}:any) => {

    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(170);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const [flag,setFlag]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);

      const chartConfig = {
        target: {
          label: "Target",
          color: "hsl(var(--chart-1))",
        },
        capacity: {
          label: "Capacity",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig
      


      const Fetchdata = async () => {
        try {          
            
          
            
            // setisSubmitting(true)
            setisSubmitting(true)
            const cap = await getCapacity(obbSheet,date)
            console.log("first",cap)
        
      
            
           
           
           
            const chartData: any[] = cap.map((item: any) => {

                const smv = Number((item.avg));
                const bundle =Number(item.bundleTime);
                const pers = Number(item.personalAllowance);
                const cap = Number(Math.round((60 / (smv + bundle + ((pers / 100) * smv)))));
                

      

          


              
                return(
                  

                
                {
                  smv:Number(smv.toFixed(2)),
                  bundle:bundle,
                  personalAllowance:(pers / 100),
                  capacity:cap,
                  name:item.name+" ("+item.machineId+" ) - "+item.seqNo  ,
                  target:item.target,
                  seqNo:item.seqNo,
                  justName:item.name,
                  obb:item.obb

                  // capacity:capacity
                // name:item.seqNo+"-"+item.name,
               
                // smv:item.smv,
                // target:target
                
        

          

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

    const saveAsExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(chartData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
      XLSX.writeFile(workbook, `chart-data.xlsx`);
  };
    
  
  
  const saveAsPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 }as any); // Increase scale for better quality
      const imgData = canvas.toDataURL('image/jpeg', 0.5); // Use JPEG and reduce quality to 50%
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height + 150],
      });
  
      const baseUrl = window.location.origin;
      const logoUrl = `${baseUrl}/logo.png`;
  
      const logo = new Image();
      logo.src = logoUrl;
      logo.onload = () => {
        const logoWidth = 110;
        const logoHeight = 50;
        const logoX = (canvas.width / 2) - (logoWidth + 150); // Adjust to place the logo before the text
        const logoY = 50;
  
        // Add the logo to the PDF
        pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
  
        // Set text color to blue
        pdf.setTextColor(0, 113, 193); // RGB for blue
  
        // Set larger font size and align text with the logo
        pdf.setFontSize(24);
        pdf.text('Dashboard -Target vs Actual - Production', logoX + logoWidth + 20, 83, { align: 'left' });
  
        // Add the chart image to the PDF
        pdf.addImage(imgData, 'JPEG', 0, 150, canvas.width, canvas.height);
  
        // Save the PDF
        pdf.save('chart.pdf');
      };
    }
  };


    const settingFlag = () => {
       setFlag(true);
    }


  return (
    <div>
      <Loader2
        className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")}
      />
      <div>
      <Button className="" onClick={settingFlag}>
          Download Report
        </Button>
      <div className='hidden'>
      <TableDemo tableProp={chartData} date={date} chartRef={chartRef} flag={flag} setFlag={setFlag} ></TableDemo>
      </div>
      </div>

      {chartData.length > 0 ? (
        <div> 
        <div className="bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-max-[600px] mb-16 overflow-scroll">
          <Card
            className="bg-slate-50 pt-4"
            style={{ width: chartWidth + "%" }}
          >
            <CardContent>
              <ChartContainer
               ref={chartRef}
                config={chartConfig}
                className={`min-h-[200px] max-h-[600px] `}
                style={{ width: chartWidth + "%" }}
              >
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    left: 12,
                    right: 25,
                    bottom: 260,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={true}
                    angle={-90}
                    interval={0}
                    textAnchor="end"
                  />
                  <YAxis
                    dataKey="capacity"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    // label="Target"
                    //   tickFormatter={(value) => value.slice(0, 3)}
                  />
                 <ChartLegend
                  verticalAlign="top"
                  content={<ChartLegendContent />}
                  className="mb-10  text-sm"
                />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="capacity"
                    type="natural"
                    stroke="darkOrange"
                    strokeWidth={2}
                    dot={{
                      fill: "darkOrange",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      position="bottom"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                      color='orange'
                      style={{ fill: "orange", fontSize: 12 }}
                    />
                  </Line>
                  <Line
                    dataKey="target"
                    type="natural" // Use linear type for a straight line
                    stroke="green" // Change the color as needed
                    strokeWidth={2}
                    dot={{
                      fill: "green",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                    // dot={false} // No dots on the target line
                    // strokeDasharray="5 5" // Optional: make it dashed
                  >
                    <LabelList
                      position="top"
                      offset={15}
                      className="fill-foreground"
                      fontSize={12}
                      style={{ fill: "green", fontSize: 12 }}
                    />
                    </Line>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
       
        </div>
        <div className="flex gap-3 mt-3 justify-center" >
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={saveAsExcel}>
            Save as Excel
          </Button>
          {/* <Button type="button" onClick={saveAsCsv}>
            Export  to CSV

          </Button> */}
        </div>
        </div>
        
        
      ) : (
        <div className="mt-12 w-full">
          <p className="text-center text-slate-500">No Data Available....</p>
        </div>
      )}
    </div>
  );
}

export default GraphCompo 