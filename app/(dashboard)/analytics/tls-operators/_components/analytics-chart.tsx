"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrafficLightSystem } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
// import { getData } from "./actions";
import BarChartGraph from "./barchart";


interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

interface ProductionItem {
    roundNo: number;
    operatorRfid: string;
    colour: string;
    operator: {
        name: string;
        rfid: string;
    };
}

// Color mapping
const colorValues: { [key: string]: number } = {
    red: 25,
    orange: 50,
    green: 80
};

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<number[][] | null>(null);
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);
    const [filterApplied,setFilterApplied] = useState<boolean>(false)
    
    const [obbSheetId,setObbSheetId] = useState<string>("")
    const [date,setDate] = useState<string>("")

    function processForHeatmap(productionData: ProductionItem[]) {
        const heatmapData: number[][] = Array.from({ length: 12 }, () => []);
        const xAxisCategories = new Set<string>();
        const operatorMappings: { [key: string]: number } = {};

        productionData.forEach(item => {
            if (item.roundNo >= 1 && item.roundNo <= 12) {
                const roundIndex = item.roundNo - 1;
                const value = colorValues[item.colour] || 0; // Default to 0 if color not defined

                // Map operators to consistent indexes in the xAxisCategories and heatmapData
                if (!(item.operatorRfid in operatorMappings)) {
                    operatorMappings[item.operatorRfid] = Object.keys(operatorMappings).length;
                    xAxisCategories.add(item.operator.name);
                }

                const operatorIndex = operatorMappings[item.operatorRfid];

                // Add the value to the correct position
                heatmapData[roundIndex][operatorIndex] = value;
            }
        });

        // Ensure each round contains entries for all operators, even if they are zero
        heatmapData.forEach((round, index) => {
            for (let i = 0; i < Object.keys(operatorMappings).length; i++) {
                if (round[i] === undefined) {
                    heatmapData[index][i];
                }
            }
        });

        return {
            heatmapData,
            xAxisCategories: Array.from(xAxisCategories)
        };
    }

    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];
            // const response = await axios.get(`/api/tls/fetch-tls-by-obb?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
               
            
            // const prod = await getData(data.obbSheetId,formattedDate)
            
            // const { heatmapData, xAxisCategories } = processForHeatmap(response.data.data);
            // setHeatmapData(heatmapData);
            // setHeatmapCategories(xAxisCategories);
            // console.log('Heatmap Data:', JSON.stringify(heatmapData[8]));
            // console.log('X-Axis Categories:', xAxisCategories);

            setObbSheetId(data.obbSheetId);
            setDate(formattedDate+"%");
            setFilterApplied(true);
            // const prod = await getData(data.obbSheetId,formattedDate)
            // console.log(prod)

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
        <div className="mx-auto max-w-7xl">
            <SelectObbSheetAndDate
                obbSheets={obbSheets}
                handleSubmit={handleFetchProductions}
            />
            {obbSheetId.length > 0 ?
                <div className="mt-12">
                    <h2 className="text-lg mb-2 font-medium text-slate-700"></h2>
                    {/* <HeatmapChart
                        xAxisLabel='Operators for TLS'
                        height={720}
                        type="tls"
                        heatmapData={heatmapData}
                        heatmapCategories={heatmapCategories}
                    /> */}
                    <BarChartGraph
                    obbSheetId={obbSheetId}
                    date={date}
                    />
                </div>
                :
                <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                </div>
            }
        </div>
    )
}

export default AnalyticsChart