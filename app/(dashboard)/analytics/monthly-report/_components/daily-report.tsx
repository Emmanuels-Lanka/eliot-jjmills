"use client"
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SelectObbSheetAndDate from "./select-style-and-date";
import { getCount, getTimeslot } from './actions';
import { getFormattedTime } from '@/lib/utils-time';

interface ProcessedData {
  total?: number;
  operator: string;
  data: {
    diff: number;
    eff: number;
    production_date: string;
    operatorRfid: string;
    daily_total: number;
    name: string;
    LoginDate: string;
    smv: number;
    LoginTimestamp: Date;
    LogoutTimestamp: Date;
    date: string;
  }[];
}

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

const ReportTable = ({ obbSheets }: AnalyticsChartProps) => {
  const [date, setDate] = useState<string>("");
  const [startdate, setStartDate] = useState<string>("");
  const [enddate, setendDate] = useState<string>("");
  const [data, setData] = useState<ProcessedData[]>([]);
  const [obb, setObb] = useState<any>();
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handleFetchProductions = async (data: { obbSheetId: string; date: Date; endDate: Date }) => {
    const start = getFormattedTime(data.date.toString());
    const end = getFormattedTime(data.endDate.toString());
    
    setStartDate(start);
    setendDate(end);

    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split("T")[0];
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
  };

  const mergeArr = (time: any[], count: any[]): any[] => {
    const newArre = time.map((c) => {
      const found = count.find((t) => t.operatorRfid === c.operatorRfid && t.LoginDate == c.LoginDate);
      return {
        ...found,
        ...c,
      };
    });
    return newArre;
  };

  const processData = (data: any[]) => {
    const operationsMap: { [key: string]: any[] } = {};
    data.forEach(data => {
      if (!operationsMap[data.operatorRfid]) {
        operationsMap[data.operatorRfid] = [];
      }
      operationsMap[data.operatorRfid].push(data);
    });
    
    const operations = Object.values(operationsMap).map(group => ({
      operator: group[0].operatorRfid,
      data: group.map((g) => {
        const login = new Date(g.LoginTimestamp);
        const logout = new Date(g.LogoutTimestamp);
        const diff = (logout.getTime() - login.getTime()) / 60000;
        const earnMins = (g.daily_total * g.smv);
        const eff = Number(((earnMins / diff) * 100).toFixed(2));

        return {
          ...g,
          diff,
          eff
        };
      })
    })).sort();

    return operations;
  };

  const processDatas = (data: ProcessedData[]) => {
    return data.map((d) => ({
      ...d,
      total: d.data.reduce((a, b) => a + Number(b.daily_total), 0)
    }));
  };

  const getDetails = async () => {
    const time = await getTimeslot(" ", " ", "");
    const count = await getCount(" ", " ", "");
    const merged = mergeArr(time, count);
    const processed = processData(merged);
    const processeds = processDatas(processed);
    setData(processed);
  };

  useEffect(() => {
    if (obbSheetId && date) {
      getDetails();
    }
  }, [obbSheetId, startdate, enddate]);

  const handlePrint = () => {
    const baseUrl = window.location.origin;
    const printContent = reportRef.current?.innerHTML;
    let selectedDate = new Date(date);
    selectedDate.setDate(selectedDate.getDate());
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    const htmlContent = `
      <html>
        <head>
          <title>Operator Daily Efficiency Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; font-size: 12px; }
            .container { width: 90%; margin: 0 auto; padding: 10px; box-sizing: border-box; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 4px; font-size: 12px; }
            th { text-align: center; background-color: gray; }
            td { text-align: center; }
            .logo-div { text-align: center; }
            .logo-div img { width: 120px; height: auto; }
            .text-center { text-align: center; }
            .footer-logo img { width: 100px; height: auto; }
          </style>
        </head>
        <body>
          <div class="logo-div">
            <img src="${baseUrl}/ha-meem.png" alt="Ha-Meem Logo" style="margin-top:10px;"/>
            <h5 style="margin-top:10px;">~ Bangladesh ~</h5>
          </div>
          <h1 class="text-center">Operator Daily Efficiency Report</h1>
          <hr />
          <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px;">
            <div style="flex: 1; margin-right: 10px; line-height: 1.5;">
              <h5 style="margin: 0;">Factory Name: Apparel Gallery LTD</h5>
              <h5 style="margin: 0;">Title: Operator Daily Efficiency Report</h5>
              <h5 style="margin: 0;">Starting Date: ${startdate}</h5>
              <h5 style="margin: 0;">Ending Date: ${enddate}</h5>
            </div>
            <div style="flex: 1; margin-left: 10px; line-height: 1.5;">
              <h5 style="margin: 0;">Unit: ${obb?.[0]?.unit}</h5>
              <h5 style="margin: 0;">Buyer: ${obb?.[0]?.buyer}</h5>
              <h5 style="margin: 0;">Style Name: ${obb?.[0]?.style}</h5>
              <h5 style="margin: 0;">Line Name: ${obb?.[0]?.line}</h5>
            </div>
          </div>
          ${printContent}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px;">
            <div>
              <p><a href="https://rfid-tracker.eliot.global/">https://rfid-tracker.eliot.global/</a></p>
            </div>
            <div class="footer-logo">
              <img src="${baseUrl}/logo.png" alt="Company Footer Logo" />
            </div>
          </div>
        </body>
      </html>
    `;
  
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '', 'width=800,height=600');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    }
  };

  const uniqueDates = Array.from(
    new Set(data.flatMap((d) => d.data.map((o) => o.LoginDate)))
  );

  return (
    <div>
      <SelectObbSheetAndDate obbSheets={obbSheets} handleSubmit={handleFetchProductions} />
      {data.length > 0 && (
        <Button className="mt-5" onClick={handlePrint}>
          Download as PDF
        </Button>
      )}
      <div ref={reportRef} className="mt-5 mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emp ID</TableHead>
              <TableHead>Operator Name</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Total EM</TableHead>
              <TableHead>Total Ef</TableHead>
              <TableHead>SMV</TableHead>
              <TableHead>SMV/Hour</TableHead>
              {uniqueDates.map((date, index) => (
                <TableHead key={index}>{date}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => {
              // Take first data entry for consistent operator info
              const operatorInfo = d.data[0];
              return (
                <TableRow key={d.operator}>
                  <TableCell>{operatorInfo.operatorRfid}</TableCell>
                  <TableCell>{operatorInfo.name}</TableCell>
                  <TableCell>{d.data.reduce((a,b)=>a+Number(b.daily_total),0)}</TableCell>
                  <TableCell>{(d.data.reduce((a, b) => a + Number(b.diff), 0)).toFixed(2)}</TableCell>  
                  <TableCell>{(((d.data.reduce((a,b)=>a+Number(b.daily_total),0)*operatorInfo.smv)/(d.data.reduce((a, b) => a + Number(b.diff), 0))*100).toFixed(2)) }</TableCell>  
                  <TableCell>{operatorInfo.smv}</TableCell>
                  <TableCell>{operatorInfo.smv ? (60 / operatorInfo.smv).toFixed(2) : 0}</TableCell>
                  {uniqueDates.map((date, dateIndex) => {
                    const operatorForDate = d.data.find(
                      (o) => o.LoginDate === date
                    );
                    return (
                      <TableCell key={dateIndex}>
                        {operatorForDate ? operatorForDate.eff : "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable