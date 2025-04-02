"use client"

import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface OperationOperatorDetailsProps {
    data: DataTypesForRoamingQC;
    setQtyInspected: (value: string) => void;
}

const OperationOperatorDetails = ({
    data,
    setQtyInspected,
}: OperationOperatorDetailsProps) => {
    const [qty, setQty] = useState<string>();

    const handleSelectQty = (value: string) => {
        setQtyInspected(value);
        setQty(value);
    }

    return (
        <div className="mt-8 p-4 border bg-slate-100 flex gap-4">
            <div className="md:w-1/5 space-y-2">
                <h2 className="text-slate-600 font-medium">Inspected Qty</h2>
                <Select onValueChange={handleSelectQty} defaultValue={qty as string}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Inspected Qty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Qty: 1</SelectItem>
                        <SelectItem value="2">Qty: 2</SelectItem>
                        <SelectItem value="3">Qty: 3</SelectItem>
                        <SelectItem value="4">Qty: 4</SelectItem>
                        <SelectItem value="5">Qty: 5</SelectItem>
                        <SelectItem value="6">Qty: 6</SelectItem>
                        <SelectItem value="7">Qty: 7</SelectItem>
                        <SelectItem value="8">Qty: 8</SelectItem>
                        <SelectItem value="9">Qty: 9</SelectItem>
                        <SelectItem value="10">Qty: 10</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='grid grid-cols-4 w-full border bg-white'>
                <div className="border-r flex flex-col justify-center items-center gap-y-2 py-3">
                    <h2 className="text-slate-600 font-medium text-lg">STYLE</h2>
                    <Separator />
                    {data.style}
                </div>
                <div className="border-r flex flex-col justify-center items-center gap-y-2 py-3">
                    <h2 className="text-slate-600 font-medium text-lg">BUYER</h2>
                    <Separator />
                    {data.buyerName}
                </div>
                <div className="border-r flex flex-col justify-center items-center gap-y-2 py-3">
                    <h2 className="text-slate-600 font-medium text-lg">OPERATION</h2>
                    <Separator />
                    {data.operationName}
                </div>
                <div className="flex flex-col justify-center items-center gap-y-2 py-3">
                    <h2 className="text-slate-600 font-medium text-lg">OPERATOR</h2>
                    <Separator />
                    {data.operatorName}
                </div>
            </div>
        </div>
    )
}

export default OperationOperatorDetails