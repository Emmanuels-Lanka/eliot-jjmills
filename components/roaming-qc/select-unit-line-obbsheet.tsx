"use client"

import { ProductionLine, Unit } from "@prisma/client";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";

interface SelectUnitLineObbSheetProps {
    units: Unit[];
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    handleSubmit: (data: { unit: string, lineId: string, obbSheetId: string }) => void;
};

const SelectUnitLineObbSheet = ({
    units,
    obbSheets,
    handleSubmit
}: SelectUnitLineObbSheetProps) => {
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [lines, setLines] = useState<ProductionLine[]>([]);
    const [selectedUnit, setSelectedUnit] = useState({ id: '', name: '' });
    const [selectedLine, setSelectedLine] = useState<string>('');
    const [selectedObbSheet, setSelectedObbSheet] = useState<string>('');

    const handleSelectUnit = async (unitId: string) => {
        setSelectedUnit({ id: unitId, name: units.find(u => u.id === unitId)?.name as string});
        try {
            const response = await axios.get(`/api/production-line?unitId=${unitId}`);
            setLines(response.data.data);
        } catch (error: any) {
            console.error("Error fetching lines:", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        }
    };

    const handleSelectObbSheet = (obbSheetId: string) => {
        setSelectedObbSheet(obbSheetId);
        setOpen(false);
        if (selectedUnit.name && selectedLine) {
            handleSubmit({
                unit: selectedUnit.name,
                lineId: selectedLine,
                obbSheetId: obbSheetId
            });
        }
    }

    return (
        <div className="mt-2 md:mt-8 mx-auto max-w-7xl border px-6 pt-6 pb-8 md:px-12 md:pt-8 md:pb-10 rounded-lg bg-slate-100">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">Select a unit</h3>
                    <Select onValueChange={handleSelectUnit} defaultValue={selectedUnit.id as string}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {units && units.map(unit => (
                                <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">Select production line</h3>
                    <Select onValueChange={setSelectedLine} defaultValue={selectedLine as string}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select production line" />
                        </SelectTrigger>
                        <SelectContent>
                            {lines.map(line => (
                                <SelectItem key={line.id} value={line.id}>{line.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">Select OBB Sheet</h3>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between font-normal"
                            >
                                {obbSheets ?
                                    <>
                                        {selectedObbSheet
                                            ? obbSheets.find((sheet) => sheet.id === selectedObbSheet)?.name
                                            : "Select OBB Sheets..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </>
                                    :
                                    "No OBB sheets available!"
                                }
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command>
                                <CommandInput placeholder="Search OBB sheet..." />
                                <CommandList>
                                    <CommandEmpty>No OBB sheet found!</CommandEmpty>
                                    <CommandGroup>
                                        {obbSheets && obbSheets.map((sheet) => (
                                            <CommandItem
                                                key={sheet.id}
                                                value={sheet.name}
                                                onSelect={() => {
                                                    handleSelectObbSheet(sheet.id);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedObbSheet === sheet.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {sheet.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default SelectUnitLineObbSheet