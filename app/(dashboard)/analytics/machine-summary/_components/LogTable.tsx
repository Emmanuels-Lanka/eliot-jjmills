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
// import SelectObbSheetAndDate from '../dashboard/common/select-obbsheet-and-date';
import TableComponent from './TableComponent';
import SelectObbSheetAndDate from '@/components/dashboard/common/select-obbsheet-and-date';

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

export type ProductionDataType = {
  count:number;
  linename:string;
  notassigned: number;
  type: string;

};

const LogTable = ({
  obbSheets,
}: AnalyticsChartProps) => {
  const [date, setDate] = useState<string>("");
  const [obbSheetId, setObbSheetId] = useState<string>("");

  const [data, setData] = useState<any>({});


  

  const handleFetchProductions = async () => {

    

      const details = await getData(obbSheetId, date);
      console.log("details",details)
      const typesObj = Object.groupBy(details, ({ type }) => type);

      console.log("typesObj",typesObj)
      // const result = Object.groupBy(details, ({ type }) => type);
      // console.log("result",result)

      // const res = Object.values(result);
      // console.log("res",res)
      
      // console.log("details",res );
      
      setData(typesObj)

  };



  useEffect(() => {
    handleFetchProductions();
  }, []);

  useEffect(() => {
    




  }, [data]);
  return (

    <div>
      
      <div className="mx-auto max-w-7xl">

      </div>
      <Card x-chunk="dashboard-05-chunk-3" className='my-4 pt-4'>
       


        <CardContent>
          <TableComponent data={data}></TableComponent>

        </CardContent>
      </Card>
    </div>

  )
}

export default LogTable