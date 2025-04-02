"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import RoamingQcHeatmap from "./roaming-qc-heatmap";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}

const AnalyticsChart = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<RoamingQcChartFunctionOutputTypes | null>(null);

    function processRoamingQcData(productionData: RoamingQcDataTypes[]): RoamingQcChartFunctionOutputTypes {
        const hourGroups = [
            "7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM",
            "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM",
            "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"
        ];
    
        const getHourGroup = (timestamp: string): string => {
            const hour = getHours(parseISO(timestamp));
            return hourGroups[Math.max(0, Math.min(11, hour - 7))];
        };
    
        const operationsMap: { [key: string]: RoamingQcDataTypes[] } = {};
        productionData.forEach(data => {
            const hourGroup = getHourGroup(data.timestamp);
            const operationKey = `${data.obbOperationId}-${hourGroup}`;
            operationsMap[operationKey] = operationsMap[operationKey] || [];
            operationsMap[operationKey].push(data);
        });
    
        const resultData = hourGroups.map(hourGroup => ({
            hourGroup,
            operation: Object.values(operationsMap).filter(data => getHourGroup(data[0].timestamp) === hourGroup)
            .map(group => {
                // Safeguard against potentially undefined properties
                const operationName = group[0]?.obbOperation?.operation?.name;
                const operationSeqNo = group[0]?.obbOperation?.seqNo;
                const colorStatus = group[0]?.colorStatus || "";
    
                return {
                    name: operationName ? `${operationName} - ${operationSeqNo}` : 'Unknown Operation',
                    color: colorStatus
                };
            })
        }));
    
        // Get unique categories from the operations
        const categories = Array.from(new Set(resultData.flatMap(hg => hg.operation.map(op => op.name))));
    
        return {
            data: resultData,
            categories
        };
    }

    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        setHeatmapData(null);

        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];

            const response = await axios.get(`/api/roaming-qc?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
            const processedData = processRoamingQcData(response.data.data);
            
            setHeatmapData(processedData);
            console.log("processedData", processedData);

            router.refresh();
        } catch (error: any) {
            console.error("Error fetching production data:", error);
            toast({
                title: "Something went wrong! Try again",
                variant: "error",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            ERROR: {error.message}
                        </code>
                    </div>
                ),
            });
        }
    }

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchProductions}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {heatmapData ?
                    <div className="mt-12">
                        {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
                        <RoamingQcHeatmap
                            heatmapData={heatmapData}
                        />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                }
            </div>
        </>
    )
}

export default AnalyticsChart