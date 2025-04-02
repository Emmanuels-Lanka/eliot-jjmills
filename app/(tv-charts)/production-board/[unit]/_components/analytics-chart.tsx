"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { Loader2 } from "lucide-react";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "./effheat";
import { getLinebyOS, getObbSheetID, getUnitID } from "@/components/tv-charts/achievement-rate-operation/actions";
import LogoImporter from "@/components/dashboard/common/eliot-logo";
import TableCompo from "./Table-compo";
import Image from "next/image";


type HourGroupDataType = {
  buyer: string;
  count: number;
  data: ProductionBoardDataType[] // Replace `any` with a more specific type if you know the structure of the items in this array
  hourGroup: string;
  production: number;
  smv: number;
  style: string;
  target: number;
};
export type MainDataType = {
  buyer: string;
    hourGroups: HourGroupDataType[];
    line: string;
    smv: number;
    style: string;
    target: number;
};

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
  title: string;
}

type EfficiencyResult = {
  data: {
    hourGroup: string;
    operation: {
      name: string;
      efficiency: number | null;
    }[];
  }[];
  categories: string[];
};

const AnalyticsChart = ({ unit }: { unit: string }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypes>();
  const [data, setData] = useState<MainDataType[]>();
  const [tableData, setTableData] = useState<any>();
  const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const [lineName, setLineName] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const getFormattedDate = () => {
    const today = new Date();
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0');
  };


  const processData = (prodData: ProductionBoardDataType[]) => {
    const hourGroups = [
      "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM",
     "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM",
     "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM",
     "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"
   ];

   const getHourGroup = (timestamp: string): string => {
     const date = new Date(timestamp);
     const hour = date.getHours();
     const minutes = date.getMinutes();
     if (minutes >= 5) {
       return hourGroups[Math.max(0, Math.min(10, hour - 8))];
     }
     return hourGroups[Math.max(0, Math.min(10, hour - 9))];
   };
   
    console.log("first data",prodData)

    const lineMap: { [key: string]: { [key: string]: ProductionBoardDataType[] } } = {};
    prodData.forEach((data) => {

        const lineName = data.obbOperation.obbSheet.name;
        const hourGroup = getHourGroup(data.timestamp);

        if (!lineMap[lineName]) {
            lineMap[lineName] = {};
        }
        if (!lineMap[lineName][hourGroup]) {
            lineMap[lineName][hourGroup] = [];
        }
        lineMap[lineName][hourGroup].push(data);
    });

    console.table(lineMap);

    const lines = Object.keys(lineMap).map(lineName => {
      const hourGroupsData = Object.keys(lineMap[lineName]).map(hourGroup => {
          const groupData = lineMap[lineName][hourGroup];
          return {
              hourGroup,
              count: groupData ? groupData.length : 0,
              production: groupData ? groupData.reduce((sum, curr) => sum + curr.productionCount, 0) : 0,
              buyer: groupData ? groupData[0].obbOperation.obbSheet.buyer : '',
              style: groupData ? groupData[0].obbOperation.obbSheet.style : '',
              smv: groupData ? Number(groupData[0].obbOperation.obbSheet.totalSMV) : 0,
              target: groupData ? groupData[0].obbOperation.obbSheet.target100 : 0,
              data: groupData || []
          };
      });
  
      return {
          line: lineName,
          buyer: hourGroupsData[0].buyer,
          style: hourGroupsData[0].style,
          smv: Number(hourGroupsData[0].smv),
          target: hourGroupsData[0].target,
          hourGroups: hourGroupsData
      };
  }).sort((a, b) => a.line.localeCompare(b.line));
  
  console.log("operations", lines);
  console.table(lines);
  return lines;

    
  }



  const fetchObbSheetId = async () => {
    try {
      // const id = await getObbSheetID(linename);
      const line = await getUnitID(unit);
      console.log("line",line)
      if (line) {
        setObbSheetId(unit);
        setLineName(line);
        setDate(getFormattedDate());
      }
    } catch (error) {
      console.error("Error fetching OBB Sheet ID:", error);
      toast({
        title: "Error fetching OBB Sheet ID",
        variant: "destructive"
      });
    }
  };

  const handleFetchProductions = async () => {
    if (!unit || !date) return;

    try {
      setIsLoading(true);
      // const response = await axios.get(`/api/efficiency/production?obbSheetId=${obbSheetId}&date=${'2025-01-23'}`);
      const responses = await axios.get(`/api/production?date=${'2025-01-23'}`);
      const newData = processData(responses.data.data);
      console.log("first")
      setData(newData);

      // console.log("Production Data:", responses.data.data);
      // console.log("resp Data:", response.data.data);
      // return response.data.data;
      // const heatmapData = processProductionData(response.data.data);
      setHeatmapData(heatmapData);
      // setObbSheet(response.data.obbSheet);
      router.refresh();
    } catch (error: any) {
      console.error("Error fetching production data:", error);
      toast({
        title: "Error fetching production data",
        variant: "destructive",
        description: error.response?.data || error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchObbSheetId();
  }, [unit]);

  useEffect(() => {
    if (unit && date) {
      handleFetchProductions();
      const intervalId = setInterval(handleFetchProductions,  10 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [unit, date]);

  return (
    <div className="container mx-auto px-4 bg-gradient-to-tr from-black to-slate-600 h-screen">
      <div className="flex flex-col items-center gap-2 ">
      <div className="flex items-center w-full gap-3 p-4 justify-center  bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
  
  <h1 className="text-white text-3xl flex-grow text-center font-semibold">
    ELIoT - Line Wise Production Dashboard<br />  {date} - {lineName} 
  </h1>
</div>
        

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px] ">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : data ? (
          <div className="w-full ">
            <TableCompo data={data}></TableCompo>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">
              No Layout for Line {lineName} - {date}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;