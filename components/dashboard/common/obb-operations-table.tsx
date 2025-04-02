import { Edit, Loader2, Trash2 } from "lucide-react";
import { ObbOperation } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import ConfirmModel from "@/components/model/confirm-model";
import { cn } from "@/lib/utils";

interface ObbOperationsTableProps {
    tableData: ObbOperationData[] | null;
    handleEdit: (data: ObbOperation) => void;
}

const ObbOperationsTable = ({
    tableData,
    handleEdit
}: ObbOperationsTableProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async (obbOperationId: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/obb-operation/${obbOperationId}`);
            router.refresh();
            toast({
                title: "Successfully removed OBB operation!",
                variant: 'success',
            });
        } catch (error: any) {
            console.error("ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
        {!isLoading ? 
            <Table className="mt-4">
                <TableCaption className="text-slate-400">If you wanna create new OBB operation, please click &apos;Create new&apos;</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">Seq&nbsp;No</TableHead>
                        <TableHead className="w-4/12">Operation</TableHead>
                        <TableHead className="w-2/12">Mechine</TableHead>
                        <TableHead className="w-2/12">Supervisor</TableHead>
                        <TableHead className="w-16 text-center">SMV</TableHead>
                        <TableHead className="w-16 text-center">Target</TableHead>
                        <TableHead className="w-16 text-center">spi</TableHead>
                        <TableHead className="w-16 text-center">Length</TableHead>
                        <TableHead className="text-center">Stitches</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData && tableData.map((data) => (
                        <TableRow key={data.id}>
                            <TableCell className="">{data.seqNo}</TableCell>
                            <TableCell>{data.operation.name}</TableCell>
                            <TableCell className="uppercase">{data.sewingMachine?.brandName}-{data.sewingMachine?.machineType}- {data.sewingMachine?.machineId}</TableCell>
                            <TableCell>{data.supervisor?.name}</TableCell>
                            <TableCell className="text-center">{data.smv}</TableCell>
                            <TableCell className="text-center">{data.target}</TableCell>
                            <TableCell className="text-center">{data.spi}</TableCell>
                            <TableCell className="text-center">{data.length}</TableCell>
                            <TableCell className="text-center">{data.totalStitches}</TableCell>
                            <TableCell className="flex justify-end items-center gap-2">
                                <div
                                    className="flex justify-center items-center w-8 h-7 rounded-md bg-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
                                    // onClick={() => handleEdit(data)}
                                >
                                    <Edit className="w-4 h-4" />
                                </div>
                                <ConfirmModel onConfirm={() => onDelete(data.id)}>
                                    <button
                                        disabled={isLoading}
                                        className="flex justify-center items-center w-8 h-7 rounded-md bg-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
                                    >
                                        <Trash2 className={cn("w-4 h-4 text-destructive")} />
                                    </button>
                                </ConfirmModel>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        :
            <div className="w-full mt-8 min-h-96 bg-slate-200 rounded-md flex items-center justify-center">
                <Loader2 className="animate-spin w-7 h-7" />
            </div>
        }
        </>
    )
}

export default ObbOperationsTable