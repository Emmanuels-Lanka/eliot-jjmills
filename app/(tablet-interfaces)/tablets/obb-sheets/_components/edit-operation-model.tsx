"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog-large";
import { Button } from "@/components/ui/button";
import { fetchEliotDeviceForMachine } from "../_actions/fetch-eliot-device-for-machine";
import MachineBinder from "./machine-binder";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { fetchMachineDataByMachineId } from "../_actions/fetch-machine-data-by-machineid";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

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

interface EditOperationModelProps {
    machine: {
        id: string;
        machineId: string;
    } | undefined;
    obbOperationId: string;
};

const EditOperationModel = ({
    machine,
    obbOperationId
}: EditOperationModelProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [machineData, setMachineData] = useState<MachineWithDeviceDataType | null>(null);

    const handleToggleDialog = () => setIsDialogOpen((prev) => !prev);

    const fetchMachineData = async () => {
        if (machine) {
            const machineData = await fetchMachineDataByMachineId(machine.machineId);
            if (machineData) {
                setMachineData(machineData);
            }
        }
    };

    useEffect(() => {
        if (isDialogOpen) {
            fetchMachineData();
        }
    }, [machine, isDialogOpen]);

    return (
        <Dialog open={isDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full flex justify-start gap-2" variant="outline" onClick={() => setIsDialogOpen(true)}>
                    <Edit className="w-4 h-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-md:py-8 md:p-8 w-full">
                <DialogHeader className="mt-2">
                    <DialogTitle>
                        {machine ? `Machine ID : ${machine.machineId}` : "Assign the machine to this operation"}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                {!machine ?
                    <MachineBinder
                        handleDialogOpen={handleToggleDialog}
                        obbOperationId={obbOperationId}
                    />
                    :
                    <MachineBinder
                        handleDialogOpen={handleToggleDialog}
                        obbOperationId={obbOperationId}
                        defaultMachineData={machineData as MachineWithDeviceDataType}
                    />

                }
            </DialogContent>
        </Dialog>
    )
}

export default EditOperationModel