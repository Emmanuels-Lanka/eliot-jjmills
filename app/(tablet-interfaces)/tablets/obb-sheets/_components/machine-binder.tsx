"use client"

import axios from "axios";
import Image from 'next/image';
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { fetchMachineDataByMachineId } from '../_actions/fetch-machine-data-by-machineid';
import { fetchDeviceBySerialNo } from '../_actions/fetch-device-by-serial-no';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QrCodeReader from '@/components/roaming-qc/qr-code-reader';
import { useToast } from "@/components/ui/use-toast";

interface MachineBinderProps {
    handleDialogOpen: () => void;
    obbOperationId: string;
    defaultMachineData?: MachineWithDeviceDataType
}

type MachineWithDeviceDataType = {
    id: string;
    machineId: string;
    modelNumber: string;
    brandName: string;
    eliotDevice: {
        id: string;
        serialNumber: string;
        modelNumber: string;
    } | null;
};

const MachineBinder = ({
    handleDialogOpen,
    obbOperationId,
    defaultMachineData
}: MachineBinderProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [machineId, setMachineId] = useState<string>('');
    const [eliotSerialNo, setEliotSerialNo] = useState<string>('');
    const [machineData, setMachineData] = useState<MachineWithDeviceDataType | null>(null);
    
    useEffect(() => {
        if (defaultMachineData) {
            setMachineData(defaultMachineData)
        }
    }, [defaultMachineData]);
    

    const fetchMachineData = async () => {
        if (machineId) {
            const machineData = await fetchMachineDataByMachineId(machineId);
            if (machineData) {
                setMachineData(machineData);
            } else {
                setMachineId('');
                toast({
                    title: "Machine not found",
                    variant: "error",
                });
            }
        }
    };

    useEffect(() => {
        fetchMachineData();
    }, [machineId]);

    const fetchDeviceData = async () => {
        if (eliotSerialNo) {
            const deviceDetails = await fetchDeviceBySerialNo(eliotSerialNo);
            if (deviceDetails) {
                setMachineData((prev) => ({
                    id: prev?.id ?? '',
                    machineId: prev?.machineId ?? '',
                    modelNumber: prev?.modelNumber ?? '',
                    brandName: prev?.brandName ?? '',
                    eliotDevice: deviceDetails,
                }))
            } else {
                setEliotSerialNo('');
                toast({
                    title: "ELIoT device not found",
                    variant: "error",
                });
            }
        }
    };

    useEffect(() => {
        fetchDeviceData();
    }, [eliotSerialNo]);

    const handleUnassignDevice = async () => {
        if (machineData && machineData.eliotDevice) {
            try {
                await axios.post(`/api/sewing-machine/${machineId}/unassign?deviceId=${machineData.eliotDevice.id}`);
                toast({
                    title: "Unassigned the device successfully",
                    variant: "success",
                });
            } catch (error: any) {
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error",
                });
            } finally {
                setEliotSerialNo("");
                setMachineData((prev) => ({
                    id: prev?.id ?? '',
                    machineId: prev?.machineId ?? '',
                    modelNumber: prev?.modelNumber ?? '',
                    brandName: prev?.brandName ?? '',
                    eliotDevice: null,
                }));
            }
        }
    }

    const handleUnassignMachine = async () => {
        if (machineData) {
            try {
                await axios.put(`/api/obb-operation/${obbOperationId}/unassign-machine?machineId=${machineData.id}`);
                toast({
                    title: "Successfully unassigned machine",
                    variant: "success",
                });
            } catch (error: any) {
                toast({
                    title: error.response?.data || "Something went wrong! Try again",
                    variant: "error"
                });
            } finally {
                router.refresh();
                setMachineData(null);
                handleDialogOpen();
            }
        }
    };

    const handleSave = async () => {
        if (machineId && eliotSerialNo) {
            setIsLoading(true);
            try {
                await axios.put(`/api/obb-operation/${obbOperationId}/assign-machine-with-device?machineId=${machineId}&eliotSerialNo=${eliotSerialNo}`);
                toast({
                    title: "Assigned the machine and device successfully",
                    variant: "success",
                });
            } catch (error: any) {
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error",
                });
            } finally {
                router.refresh();
                setIsLoading(false);
                setEliotSerialNo("");
                setMachineId("");
                setMachineData(null);
            }
        }
        handleDialogOpen();
    }

    return (
        <div>
            <div className='mt-2 w-full p-4 bg-slate-100 rounded-lg border'>
                <h1 className='mt-2 text-center font-medium text-xl'>{machineId ? "Machine Details" : "Scan the machine"}</h1>
                {!defaultMachineData && !machineId ? (
                    <div className="mt-6 mx-auto max-w-xl w-full camera-box">
                        <QrCodeReader setQrCode={setMachineId} />
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col-reverse md:grid md:grid-cols-2 gap-4">
                        <div>
                            {machineData?.eliotDevice ? (
                                <div className='h-full px-4 py-6 border bg-slate-50 rounded-lg flex flex-col items-center justify-between'>
                                    <h1 className='text-center font-semibold text-xl'>ELIoT Device</h1>
                                    <div className='flex justify-start items-center'>
                                        <Image
                                            src="/eliot-device.svg"
                                            alt='sewing machine'
                                            width={152}
                                            height={152}
                                            className='mr-4'
                                        />
                                        <div className='ml-4 w-full flex flex-col gap-2 items-center'>
                                            <p className='font-semibold'>Serial No: {machineData?.eliotDevice.serialNumber}</p>
                                            <p className=''>{machineData?.eliotDevice.modelNumber}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className='rounded-full'
                                        onClick={handleUnassignDevice}
                                    >
                                        Unassign Device
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <h2 className='mb-2 text-center text-lg font-medium'>Scan ELIoT device</h2>
                                    <div className="mx-auto max-w-xl w-full camera-box">
                                        <QrCodeReader setQrCode={setEliotSerialNo} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='px-4 py-6 border bg-slate-50 rounded-lg flex flex-col items-center'>
                            <h1 className='text-center font-semibold text-xl'>Sewing Machine</h1>
                            <div className='-mt-4 flex justify-start items-center'>
                                <Image
                                    src="/sewing-machine.svg"
                                    alt='sewing machine'
                                    width={240}
                                    height={240}
                                    className='ml-2'
                                />
                                <div className='w-full flex flex-col gap-2 items-center'>
                                    <Badge className='text-lg px-8 tracking-wide bg-gray-600'>{machineData?.brandName.toUpperCase()}</Badge>
                                    <p className='mt-2 font-medium'>Machine ID: {machineData?.machineId}</p>
                                    <p className='text-sm'>{machineData?.modelNumber}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className='rounded-full -mt-4'
                                onClick={handleUnassignMachine}
                                disabled={machineId ? true : false}
                            >
                                Unassign Machine
                            </Button>
                        </div>
                    </div>
                )
                }
            </div>

            <div className="mt-8 flex justify-end gap-6">
                <Button
                    variant='outline'
                    className="flex gap-2 pr-5 text-red-600"
                    onClick={handleDialogOpen}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isLoading || !machineId}
                    className="flex gap-2 pr-5 w-40"
                    onClick={handleSave}
                >
                    <Check className={cn("w-5 h-5", isLoading && "hidden")} />
                    <Loader2 className={cn("animate-spin w-5 h-5 hidden", isLoading && "flex")} />
                    Save
                </Button>
            </div>
        </div>
    )
}

export default MachineBinder