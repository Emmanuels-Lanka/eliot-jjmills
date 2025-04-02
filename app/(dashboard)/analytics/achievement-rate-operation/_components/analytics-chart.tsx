
// const AnalyticsChart=()=>{
//   return(
//     <div>
//       Analytic Chart
//     </div>
//   )
// }

// export default AnalyticsChart;


"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductionData } from "@prisma/client";

import { useToast } from "@/components/ui/use-toast";
import SelectObbSheetAndDate  from "@/components/dashboard/common/select-obbsheet-and-date";
import BarChartGraph from "./bar-chart-graph";
import { getOperatorEfficiency } from "./actions";
// import LineChartGraph from "./line-chart-graph";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}

export type ProductionDataType = {
    seqno?: string;
    name: string;
    count: number;
    target: number;
   
}

const AnalyticsChartOperation = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [production, setProduction] = useState<ProductionDataType[]>([]);
    const [userMessage,setUserMessage]=useState<string>("Please select style and date")
    const [filterApplied,setFilterApplied]=useState<boolean>(false)
    const [obbSheetId,setObbSheetId]=useState<string>("")
    const[date,setDate]=useState<string>("")
    

    function processForBarchart({ productionData, hourGroup }: { productionData: ProductionData[]; hourGroup: string }) {
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
            const operationName = data.obbOperation?.operation?.name;
            const target = data.obbOperation?.target ?? 0;
            if (operationName) {
                if (!productionCountMap[operationName]) {
                    productionCountMap[operationName] = { count: 0, target };
                }
                productionCountMap[operationName].count += data.productionCount;
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

    // const handleFetchProductions = async (data: { obbSheetId: string; date: Date; hourGroup: string }) => {
    //     try {
    //         data.date.setDate(data.date.getDate() + 1);
    //         const formattedDate = data.date.toISOString().split('T')[0];
            
    //         const response = await axios.get(`/api/getobb-date?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
    //         console.log("DATA:", response.data.data);
            
    //         const barchartData = processForBarchart({ productionData: response.data.data, hourGroup:data.hourGroup });
    //         console.log("DATA:", barchartData);
    //         setProduction(barchartData);
    //         router.refresh();
    //     } catch (error: any) {
    //         console.error("Error fetching production data:", error);
    //         toast({
    //             title: "Something went wrong! Try again",
    //             variant: "error",
    //             description: (
    //                 <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
    //                     <code className="text-slate-800">
    //                         ERROR: {error.message}
    //                     </code>
    //                 </div>
    //             ),
    //         });
    //         console.error(error)
    //     }
    // }
    
    const Fetchdata = async (data: { obbSheetId: string; date: Date }) => {
        try {
            const y=data.date.getFullYear().toString()
            const m=(data.date.getMonth() + 1).toString().padStart(2,"0")
            const d=data.date.getDate().toString().padStart(2,"0")
            setObbSheetId(data.obbSheetId)
            setDate(`${y}-${m}-${d}%`)
       
            setFilterApplied(true)
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(()=>{
        if(filterApplied){
            setUserMessage("No data available.")
        }
        
      },[filterApplied])
    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate 
                    obbSheets={obbSheets}
                    handleSubmit={Fetchdata}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {obbSheetId.length > 0 ?
                    <div className="my-8">
                        {/* <LineChartGraph 
                            data={production}
                        />  */}
                        <BarChartGraph
                            obbSheetId={obbSheetId}
                            date={date}
                           
                            
                        />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">{userMessage}</p>
                    </div>
                }
            </div>
        </>
    )
}

export default AnalyticsChartOperation