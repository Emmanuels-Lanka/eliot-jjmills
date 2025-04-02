"use client";
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getData } from './action';
import SelectObbSheetAndDate from '../dashboard/common/select-obbsheet-and-date';
import TableComponent from './TableComponent';

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

export type ProductionDataType = {
  name: string;
  count: number;
  target: number;
  employeeId: string;
  machineId: string;
  eliotSerialNumber: string;
  code: string;
  operationname: string;
  totprod: number;
  LoginTimestamp: string;
  LogoutTimestamp: string;

};

const LogTable = ({
  obbSheets,
}: AnalyticsChartProps) => {
  const [date, setDate] = useState<string>("");
  const [obbSheetId, setObbSheetId] = useState<string>("");

  const [data, setData] = useState<ProductionDataType[]>([]);


  

  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {


    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";


    setObbSheetId(data.obbSheetId);
    setDate(formattedDate);


    console.log("obb", obbSheetId);


  };

  const getDetails = async () => {

    const details = await getData(obbSheetId, date);
    console.log("details", details);
    setData(details)

  };

  useEffect(() => {
    console.log("obb", obbSheetId);
    console.log("date", date);
    getDetails();
  }, [date, obbSheetId]);

  return (

    <div>
      
      <div className="mx-auto max-w-7xl">

      </div>
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7">
          <CardTitle> </CardTitle>
          <CardDescription>

          </CardDescription>
          <SelectObbSheetAndDate
            obbSheets={obbSheets}
            handleSubmit={handleFetchProductions}
          />

        </CardHeader>


        <CardContent>
          <TableComponent data={data}></TableComponent>

        </CardContent>
      </Card>
    </div>

  )
}

export default LogTable