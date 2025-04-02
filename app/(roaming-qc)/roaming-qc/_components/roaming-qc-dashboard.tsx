"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { RoamingQC, Unit } from "@prisma/client";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import SelectUnitLineObbSheet from "@/components/roaming-qc/select-unit-line-obbsheet";
import QrCodeReader from "@/components/roaming-qc/qr-code-reader";
import { fetchDataForRoamingQC } from "@/actions/roaming-qc/fetch-data-for-roaming-qc";
import OperationOperatorDetails from "./operation-operator-details";
import { fetchRoamingQcData } from "@/actions/roaming-qc/fetch-roaming-qc-data";
import { ROAMING_QC_DEFECTS } from "@/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoamingQcDashboardProps {
    units: Unit[];
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}

const RoamingQcDashboard = ({
    units,
    obbSheets,
}: RoamingQcDashboardProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [selectedData, setSelectedData] = useState<{ unit: string, lineId: string, obbSheetId: string }>();
    const [isScanningQr, setIsScanningQr] = useState(false);
    const [obbSheetId, setObbSheetId] = useState<string>('');
    const [qrCode, setQrCode] = useState<string>('');
    const [fetchedData, setFetchedData] = useState<DataTypesForRoamingQC | null>(null);
    const [qtyInspected, setQtyInspected] = useState<string>();
    const [roamingQcData, setRoamingQcData] = useState<RoamingQC[]>([]);
    const [selectedDefects, setSelectedDefects] = useState<string[]>([]);

    const handleSelectedData = async (data: { unit: string, lineId: string, obbSheetId: string }) => {
        setSelectedData(data);
        setIsScanningQr(true);
        setObbSheetId(data.obbSheetId);
    };

    const fetchData = async () => {
        const data = await fetchDataForRoamingQC(obbSheetId, qrCode);
        const roamingQcData = await fetchRoamingQcData(qrCode);
        setRoamingQcData(roamingQcData);
        if (data) {
            setFetchedData(data);
            toast({
                title: "Machine is scanned successfully",
                variant: "success"
            })
        } else {
            toast({
                title: "This machine is not working today",
                description: "Please scan active machine ID",
                variant: "error"
            });
        }
    };

    useEffect(() => {
        if (obbSheetId && qrCode) {
            toast({
                title: `Machine ID: ${qrCode}`,
                variant: "success"
            });
            fetchData();
        }
    }, [qrCode, setQrCode]);

    const handleSelectDefect = (defect: string) => {
        setSelectedDefects(prev => [...prev, defect]);
    };

    const defectCount = selectedDefects.reduce<Record<string, number>>((acc, defect) => {
        acc[defect] = (acc[defect] || 0) + 1;
        return acc;
    }, {});

    const handleSubmitQC = async () => {
        const color = selectedDefects.length === 0 ? "green" : selectedDefects.length === 1 ? "yellow" : selectedDefects.length === 2 ? "red" : "black";

        if (qrCode && selectedData && fetchedData && qtyInspected) {
            setIsLoading(true);
            const data = {
                machineId: qrCode,
                unit: selectedData?.unit,
                lineId: selectedData?.lineId,
                operatorRfid: fetchedData?.operatorRfid,
                obbOperationId: fetchedData?.obbOperationId,
                defects: selectedDefects,
                inspectedQty: qtyInspected,
                colorStatus: color
            };

            try {
                await axios.post('/api/roaming-qc', data);
                toast({
                    title: "Updated roaming QC",
                    variant: "success"
                });
            } catch (error: any) {
                console.error("ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            } finally {
                router.refresh();
                const roamingQcData = await fetchRoamingQcData(qrCode);
                setRoamingQcData(roamingQcData);

                setQrCode('');
                setQtyInspected('');
                setSelectedDefects([]);
                setFetchedData(null);
                setIsLoading(false);
            }
        }
    }

    return (
        <div>
            
            {!selectedData &&
                <SelectUnitLineObbSheet
                    units={units}
                    obbSheets={obbSheets}
                    handleSubmit={handleSelectedData}
                />
            }

            {selectedData && isScanningQr && !fetchedData &&
                <div className="mt-8 mx-auto max-w-xl w-full camera-box">
                    <QrCodeReader setQrCode={setQrCode} />

                    <Button
                        variant="outline"
                        className="mt-8"
                        onClick={() => window.location.reload()}
                    >
                        <ArrowLeft size={20} className="mr-2"/>
                        Go back
                    </Button>
                </div>
            }

            {!selectedData && !isScanningQr &&
                <p className="w-full text-center mt-16">
                    ☝️ Please select Unit, Line, and Obb Sheet
                </p>
            }

            {fetchedData && (
                <>
                    <OperationOperatorDetails
                        data={fetchedData}
                        setQtyInspected={setQtyInspected}
                    />
                    <div className="mt-8 border flex">
                        <div className="w-[280px] border-r p-2">
                            <h2 className="w-full text-center font-medium text-slate-600">Hourly Quality Status</h2>
                            {roamingQcData.length > 0 ?
                                <div className="flex flex-col gap-y-2">
                                    {roamingQcData.map(data => (
                                        <div
                                            key={data.id}
                                            className={cn(
                                                "w-full text-white bg-slate-500 rounded-lg py-2 px-4 flex justify-between",
                                                data.colorStatus === 'green' && "bg-green-600",
                                                data.colorStatus === 'yellow' && "bg-yellow-500",
                                                data.colorStatus === 'red' && "bg-red-600",
                                                data.colorStatus === 'black' && "bg-slate-800",
                                            )}
                                        >
                                            <p>Time</p>
                                            <p>{data.timestamp.split(" ")[1]}</p>
                                        </div>
                                    ))}
                                </div>
                                :
                                <p className="text-center text-slate-500">No RoamingQC data found</p>
                            }
                        </div>
                        <div className="w-full h-fit p-4 grid grid-cols-3 gap-4">
                            {ROAMING_QC_DEFECTS.map(defect => (
                                <div
                                    key={defect}
                                    className={cn(
                                        "py-3 px-4 border rounded-lg cursor-pointer transition-all",
                                        defectCount[defect] > 0
                                            ? "bg-pink-600 text-white border-pink-600"
                                            : "bg-slate-200"
                                    )}
                                    onClick={() => handleSelectDefect(defect)}
                                >
                                    <div className="flex justify-between">
                                        <span>{defect.toUpperCase()}</span>
                                        {defectCount[defect] > 0 && (
                                            <span className="ml-2 text-xs h-fit bg-white text-pink-600 rounded-full px-2 py-1">
                                                {defectCount[defect]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {qtyInspected &&
                        <Button
                            className="mt-8 md:w-48 float-end text-base h-12"
                            variant="default"
                            onClick={handleSubmitQC}
                        >
                            <Loader2 className={cn("animate-spin w-4 h-4 hidden", isLoading && "flex")} />
                            <Zap className={cn("w-4 h-4", isLoading && 'hidden')} />
                            SUBMIT QC
                        </Button>
                    }
                </>
            )}
        </div>
    )
}

export default RoamingQcDashboard