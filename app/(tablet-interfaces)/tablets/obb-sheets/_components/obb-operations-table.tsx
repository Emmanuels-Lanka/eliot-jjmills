import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import EditOperationModel from "./edit-operation-model";

interface ObbOperationsTableProps {
    obbOperations: {
        id: string;
        seqNo: number;
        smv: number;
        target: number;
        part: string | null;
        operation: {
            name: string;
            code: string | null;
        };
        sewingMachine: {
            id: string;
            machineId: string;
        } | null;
        supervisor: {
            name: string;
        } | null;
    }[];
}

const ObbOperationsTable = ({
    obbOperations
}: ObbOperationsTableProps) => {
    return (
        <div className="mt-8">
            {obbOperations.length > 0 ? (
                <Table className="p-4 bg-slate-100 border">
                    <TableCaption>A list of operations for this OBB sheet.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">SeqNo</TableHead>
                            <TableHead>Operation</TableHead>
                            <TableHead>Op.Code</TableHead>
                            <TableHead>Supervisor</TableHead>
                            <TableHead>SMV</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Part</TableHead>
                            <TableHead>Machine</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {obbOperations.map(operation => {
                            const machine = operation.sewingMachine ? {
                                id: operation.sewingMachine.id,
                                machineId: operation.sewingMachine.machineId,
                            } : undefined

                            return (
                                <TableRow key={operation.id}>
                                    <TableCell className="font-medium">{operation.seqNo}</TableCell>
                                    <TableCell>{operation.operation.name}</TableCell>
                                    <TableCell>{operation.operation.code}</TableCell>
                                    <TableCell>{operation.supervisor?.name}</TableCell>
                                    <TableCell>{operation.smv}</TableCell>
                                    <TableCell>{operation.target}</TableCell>
                                    <TableCell>{operation.part?.toUpperCase()}</TableCell>
                                    <TableCell>
                                        {operation.sewingMachine ? operation.sewingMachine.machineId : <Badge className="font-normal bg-orange-600">Not assigned</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <EditOperationModel machine={machine} obbOperationId={operation.id} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center">No Operations found for this OBB</div>
            )}
        </div>
    )
}

export default ObbOperationsTable