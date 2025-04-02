"use client"

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { getDailyData } from "./actions";
import { Button } from "@/components/ui/button";



interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

export type ReportData={
designation:string,  
employeeId:string,
name:string,
target:number,
machine:string,
operation:string,
productionCount:number,
hour:number
}

const PmsEfficiencyReport=({obbSheets,}:AnalyticsChartProps)=>{
  const[date,setDate]=useState<string>("")
  const[data,setData]=useState<ReportData[]>([])
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const [minh, setMinh] = useState<number>(0);
  const [maxh, setMaxh] = useState<number>(0);
  const reportRef = useRef<any>(null);

  const handleFetchData=async(data:{ obbSheetId: string; date: Date })=>{
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);

  }

  const getData=async()=>{
    const details=await getDailyData(obbSheetId,date)
    const maxh=Math.max(...details.map(o => o.hour))
    const minh=Math.min(...details.map(o => o.hour))
    setMaxh(maxh);
    setMinh(minh);
    console.log("max hour",maxh)
    console.log("max hour",minh)
 console.log("details",details)
    setData(details)
  }

  useEffect(()=>{
    getData()
  },[obbSheetId,date])



  const handlePrint = () => {
    const printContent: any = reportRef.current;
    const windowToPrint = window.open("", "", "width=800,height=600");
    windowToPrint?.document.write(`
      <html>
        <head>
        <title></title>
        <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .container {
              width: 100%;
              margin: 0 auto;
              padding: 20px;
              box-sizing: border-box;
            }
            .printable {
              padding: 8px;
              background-color: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            table {
              width: 90%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            TableHead, TableCell {
              border: 1px solid #ddd;
              padding: 6px;
              text-align: center;
            }
            TableHead {
              background-color: #f5f5f5;
            }
            TableCell{
            text-align:center;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
          </style>
        </head>
        <body>
                                  
          ${printContent?.innerHTML}
        

        </body>
      </html>
    `);
    windowToPrint?.document.close();
    windowToPrint?.focus();
    windowToPrint?.print();
  };


  const calculateHourTotals = (data: ReportData[], minHour: number, maxHour: number) => {
    const hourTotals: Record<number, number> = {};
    for (let hour = minHour; hour <= maxHour; hour++) {
      hourTotals[hour] = data
        .filter(d => d.hour === hour)
        .reduce((sum, d) => sum + d.productionCount, 0);
    }
    return hourTotals;
  };

  const hourTotals = calculateHourTotals(data, minh, maxh);


  return(
    <>
       <SelectObbSheetAndDate
            obbSheets={obbSheets}
            handleSubmit={handleFetchData}
          />
           <Button className="mt-5" onClick={handlePrint}>Print</Button>
          <div ref={reportRef} className="container mt-5 " >
           <Table className="mt-5">
  <TableCaption>PMS | EmployeeEfficecySave</TableCaption>
   <TableHeader>
      <TableRow>
      <TableHead >SL NO:</TableHead>
      <TableHead>Employee Id</TableHead>
      <TableHead>Employee Name</TableHead>
      <TableHead>Employee Designation</TableHead>
      <TableHead>Machine Name</TableHead>
      <TableHead className="w-[200px]">Obb Operation</TableHead>
      <TableHead >Hourly Tgt</TableHead>
        {(() => {
          const headers = [];
          for (let hour = minh; hour <= maxh; hour++) {
            headers.push(<TableHead key={hour}>Hour-{hour-6}</TableHead>);
          }
          return headers;
        })()}
      <TableHead >D:Tgt</TableHead>
      <TableHead >D:Prod</TableHead>
      <TableHead >Prod/Hr</TableHead>
      <TableHead >Achievement%</TableHead>
      </TableRow>
  </TableHeader>
  <TableBody>
  {
  data.map((d: any, index: number) => {
   
    const hoursWithData = data.filter(
      (h) => h.name === d.name && h.hour >= minh && h.hour <= maxh
    ).length;
  
  
    const targetTotal = hoursWithData * d.target;
   
    const productionCounts = [];

    let totalProductionCount = 0;

            for (let hour = minh; hour <= maxh; hour++) {
              const hourData = data.find(
                (h) => Number(h.hour) === hour && h.name === d.name
              );
              if (hourData) {
                
                totalProductionCount += Number(hourData.productionCount);
              }
            }


            const averageProductionCount = hoursWithData > 0 ? (totalProductionCount / hoursWithData) : 0;
    
            //calculate Achievement%
            const achievementPercentage = (totalProductionCount / targetTotal) * 100;

            

    return (
      <TableRow key={index}>
        <TableCell>
          <div className="font-medium align-center">{index + 1}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{d.employeeId}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{d.name}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{d.designation}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{d.machine}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center w-[200px]">{d.operation}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{d.target}</div>
        </TableCell>
        {(() => {
          const cells = [];
          for (let hour = minh; hour <= maxh; hour++) {
            const hourData = data.find(
              (h) => Number(h.hour) === hour && h.name === d.name
            );
        
            cells.push(
               <TableCell>
                <div className="font-medium align-center">
                  {hourData ? hourData.productionCount : 0}
                </div>
              </TableCell>
                                       
            );
          }
          return cells;
        })()}
          <TableCell>
          <div className="font-medium align-center">{targetTotal}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{totalProductionCount}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{averageProductionCount.toFixed(2)}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium align-center">{achievementPercentage.toFixed(2)}</div>
        </TableCell>
      </TableRow>
    );
    
  })
 
}
</TableBody>
</Table>
</div>
</>
  );
}


export default PmsEfficiencyReport;