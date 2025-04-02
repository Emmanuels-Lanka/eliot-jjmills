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
import { getLinebyOS, getObbSheetID } from "@/components/tv-charts/achievement-rate-operation/actions";
import LogoImporter from "@/components/dashboard/common/eliot-logo";

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

const AnalyticsChart = ({ linename }: { linename: string }) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypes>();
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

  function processProductionData(productionData: ProductionDataForChartTypes[]): OperationEfficiencyOutputTypes {
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

    // Find the most recent timestamp from the data
    const latestTimestamp = productionData.reduce((latest, current) => {
      return latest > current.timestamp ? latest : current.timestamp;
    }, "");

    // Get the hour group of the most recent data
    const mostRecentHourGroup = getHourGroup(latestTimestamp);

    const operatorsMap: { [key: string]: ProductionDataForChartTypes[] } = {};
    productionData.forEach(data => {
      if (!operatorsMap[data.operatorRfid]) {
        operatorsMap[data.operatorRfid] = [];
      }
      operatorsMap[data.operatorRfid].push(data);
    });

    const operations = Object.values(operatorsMap)
      .map(group => ({
        operator: group[0],
        data: group
      }))
      .sort((a, b) => a.operator.obbOperation.seqNo - b.operator.obbOperation.seqNo);

    const categories = operations.map(op => 
      `${op.operator.operator.name} - (${op.operator.obbOperation.sewingMachine.machineId}) - ${op.operator.obbOperation.seqNo}`
    );
    const machines = operations.map(op => op.operator.obbOperation.sewingMachine.machineId);
    const eliot = operations.map(op => op.data[0].eliotSerialNumber);

    const resultData = hourGroups
      .filter(hourGroup => hourGroup !== mostRecentHourGroup  && hourGroup !== "1:00 PM - 2:00 PM") // Exclude the most recent hour group
      .map(hourGroup => ({
        hourGroup,
        operation: operations.map(op => {
          const filteredData = op.data.filter(data => getHourGroup(data.timestamp) === hourGroup);
          const totalProduction = filteredData.reduce((sum, curr) => sum + curr.productionCount, 0);
          const earnMinutes = op.operator.obbOperation.smv * totalProduction;
          const efficiency = filteredData.length > 0 
            ? (totalProduction === 0 ? 0 : (earnMinutes / 60) * 100) 
            : null;
          return {
            name: `${op.operator.obbOperation.seqNo}-${op.operator.obbOperation.operation.name}`,
            efficiency: efficiency !== null ? Math.round(efficiency+0.0001) : null
          };
        })
      }));

    return { data: resultData, categories, machines, eliot };
  }

  const fetchObbSheetId = async () => {
    try {
      // const id = await getObbSheetID(linename);
      const line = await getLinebyOS(linename);
      console.log("line",line)
      if (line) {
        setObbSheetId(linename);
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
    if (!obbSheetId || !date) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`/api/efficiency/production?obbSheetId=${obbSheetId}&date=${date}`,{timeout: 30000}  );
      const heatmapData = processProductionData(response.data.data);
      setHeatmapData(heatmapData);
      setObbSheet(response.data.obbSheet);
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
  }, [linename]);

  useEffect(() => {
    if (obbSheetId && date) {
      handleFetchProductions();
      const intervalId = setInterval(handleFetchProductions,  10 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [obbSheetId, date]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex items-center gap-3">
          <LogoImporter />
          <h1 className="text-[#0071c1] text-3xl font-semibold">
            Dashboard - Operator Efficiency Hourly - {lineName}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : heatmapData ? (
          <div className="w-full">
            <EffiencyHeatmap
              xAxisLabel="Operations"
              efficiencyLow={obbSheet?.efficiencyLevel1}
              efficiencyHigh={obbSheet?.efficiencyLevel3}
              heatmapData={heatmapData}
            />
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