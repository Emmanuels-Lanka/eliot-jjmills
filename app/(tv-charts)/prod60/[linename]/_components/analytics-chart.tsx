"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getLinebyOS, getObbSheetID } from "@/components/tv-charts/achievement-rate-operation/actions";
import LogoImporter from "@/components/dashboard/common/eliot-logo";
import EffiencyHeatmap from "./effheat";

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
  const [lineName, setLineName] = useState<string>("")
  const [date, setDate] = useState<string>("");

  const getFormattedDate = () => {
    const today = new Date();
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0');
  };

  function processProductionData(productionData: ProductionDataForChartTypes[]): OperationEfficiencyOutputTypes {
    const hourGroups = [
      "7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM",
      "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM",
      "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM",
      "7:00 PM - 8:00 PM"
    ];

    const getHourGroup = (timestamp: string): string => {
      const date = new Date(timestamp);
      const hour = date.getHours();
      const minutes = date.getMinutes();
      if (minutes >= 5) {
        return hourGroups[Math.max(0, Math.min(11, hour - 7))];
      }
      return hourGroups[Math.max(0, Math.min(11, hour - 8))];
    };

    const operationsMap: { [key: string]: ProductionDataForChartTypes[] } = {};
    productionData.forEach(data => {
      if (!operationsMap[data.obbOperationId]) {
        operationsMap[data.obbOperationId] = [];
      }
      operationsMap[data.obbOperationId].push(data);
    });

    const operations = Object.values(operationsMap)
      .map(group => ({
        obbOperation: group[0].obbOperation,
        data: group
      }))
      .sort((a, b) => a.obbOperation.seqNo - b.obbOperation.seqNo);

    const categories = operations.map(op => 
      `${op.obbOperation.operation.name} - (${op.obbOperation?.sewingMachine?.machineId || 'Unknown Machine ID'}) - ${op.obbOperation.seqNo}`
    );
    const machines = operations.map(op => op.obbOperation?.sewingMachine?.machineId || 'Unknown Machine ID');
    const eliot = operations.map(op => op.data[0].eliotSerialNumber);

    const resultData = hourGroups.map(hourGroup => ({
      hourGroup,
      operation: operations.map(op => {
        const filteredData = op.data.filter(data => getHourGroup(data.timestamp) === hourGroup);
        const totalProduction = filteredData.reduce((sum, curr) => sum + curr.productionCount, 0);
        const earnMins = op.obbOperation.smv * totalProduction;
        const efficiency = filteredData.length > 0 
          ? (totalProduction === 0 ? 0 : (earnMins / 60) * 100) 
          : null;
        
        return {
          name: `${op.obbOperation.seqNo}-${op.obbOperation.operation.name}`,
          efficiency: totalProduction !== null ? parseFloat(totalProduction.toFixed(1)) : null
        };
      })
    }));

    return { data: resultData, categories, machines, eliot };
  }

  const fetchObbSheetId = async () => {
    try {
      // const id = await getObbSheetID(linename);
      const line =await getLinebyOS(linename);
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
      const response = await axios.get(`/api/efficiency/production?obbSheetId=${obbSheetId}&date=${date}`);
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
      const intervalId = setInterval(handleFetchProductions, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [obbSheetId, date]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex items-center gap-3">
          <LogoImporter />
          <h1 className="text-[#0071c1] text-3xl font-semibold">
            Dashboard - Hourly Production - {lineName}
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
              height={900}
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