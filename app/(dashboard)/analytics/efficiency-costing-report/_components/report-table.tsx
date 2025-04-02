"use client"

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useState } from "react";

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

type ReportData={

}

const CostingReport = ({ obbSheets }: AnalyticsChartProps) => {
 const [date,setDate]=useState<string>("");
 const [obbSheetId,setObbSheetId]=useState<string>("")
 const [data,setData]=useState<ReportData[]>([])

 const handleFetchData=async(data:{obbSheetId:string,date:Date})=>{
  data.date.setDate(data.date.getDate() + 1);
  const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
  setDate(formattedDate);
  setObbSheetId(data.obbSheetId);
 };

  return (
    <div>
       <SelectObbSheetAndDate
        obbSheets={obbSheets}
        handleSubmit={handleFetchData}
      />
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead className="border" rowSpan={2}>Line No</TableHead>
          <TableHead className="border" rowSpan={2}>Buyer</TableHead>
          <TableHead className="border"rowSpan={2}>Style#</TableHead>
          <TableHead className="border"rowSpan={2}>Item</TableHead>
          <TableHead className="border"rowSpan={2}>Input Date</TableHead>
            <TableHead className="border"rowSpan={2}>SMV</TableHead>
            <TableHead className="border"rowSpan={2}>Produce Min</TableHead>
            <TableHead className="border"rowSpan={2}>Utilized M/C</TableHead>
            <TableHead className="border" colSpan={3}>Utilized Man Power</TableHead>
            <TableHead  className="border" colSpan={3}>OBB Man Power</TableHead>
            <TableHead  className="border"colSpan={2}>Target Working</TableHead>
            <TableHead className="border" colSpan={2}>Working</TableHead>
            <TableHead className="border" colSpan={2}>Loss Working</TableHead>
          </TableRow>
          <TableRow>
            
            <TableHead className="border">Sewing Machine Operators</TableHead>
            <TableHead className="border">Helpers</TableHead>
            <TableHead className="border">Iron Machine Operators</TableHead>
            <TableHead className="border">Sewing Machine Operators</TableHead>
            <TableHead className="border">Helpers</TableHead>
            <TableHead className="border">Iron Machine Operators</TableHead>
           
            <TableHead className="border">Hour</TableHead>
            <TableHead className="border">Min</TableHead>
            <TableHead className="border">Hour</TableHead>
            <TableHead className="border">Min</TableHead>
            <TableHead className="border">Hour</TableHead>
            <TableHead className="border">Min</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          <TableRow>
            <TableCell></TableCell>
           
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CostingReport;
