"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductionData } from "@prisma/client";

import { useToast } from "@/components/ui/use-toast";
import SelectObbSheetDateHour from "@/components/dashboard/common/select-obbsheet-date-hour";
import LineChartGraph from "./bar-chart-graph";
import { getData } from "./actions";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}

type ProductionDataType = {
    name: string;
    count: number;
    target: number;
}

const AnalyticsChart = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [production, setProduction] = useState<ProductionDataType[]>([]);

    function processForBarchart({ productionData, hourGroup }: { productionData: any[]; hourGroup: string }) {
        const hourRanges: Record<string, [number, number]> = {
            "1": [7, 8],
            "2": [8, 9],
            "3": [9, 10],
            "4": [10, 11],
            "5": [11, 12],
            "6": [12, 13],
            "7": [13, 14],
            "8": [14, 15],
            "9": [15, 16],
            "10": [16, 17],
            "11": [17, 18],
            "12": [18, 19],
        };

        const [startHour, endHour] = hourRanges[hourGroup];

        const filteredData = productionData.filter(data => {
            const productionHour = new Date(data.timestamp).getHours();
            return productionHour >= startHour && productionHour < endHour;
        });

        const productionCountMap: Record<string, { count: number; target: number }> = {};

        filteredData.forEach((data: any) => {
            const operationName = data.name;
            const target = data.target ?? 0;
            if (operationName) {
                if (!productionCountMap[operationName]) {
                    productionCountMap[operationName] = { count: 0, target };
                }
                productionCountMap[operationName].count += data.count;
                productionCountMap[operationName].target = target; // Assuming target is the same for all entries with the same operation
            }
        });

        const barchartData: ProductionDataType[] = Object.keys(productionCountMap).map(operationName => ({
            name: operationName,
            count: productionCountMap[operationName].count,
            target: productionCountMap[operationName].target,
        }));

        return barchartData;
    }

    const handleFetchProductions = async (data: { obbSheetId: string; date: Date; hourGroup: string }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];
            
            const response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
            

            const prod =await  getData(data.obbSheetId,(formattedDate+"%"))
            
            const barchartData = processForBarchart({ productionData: prod, hourGroup:data.hourGroup });
           
            setProduction(barchartData);
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
                <SelectObbSheetDateHour
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchProductions}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {production.length > 0 ?
                    <div className="my-8">
                        <LineChartGraph 
                            data={production}
                        />
                        {/* <BarChartGraph
                            data={production}
                        /> */}
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