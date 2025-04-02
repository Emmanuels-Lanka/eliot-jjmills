"use client"

import React, { useState } from "react";
import Link from "next/link";
import { ChevronsUpDown, Check } from "lucide-react";
import { ObbSheet, Unit } from "@prisma/client";

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
import { Button } from "@/components/ui/button";

const SelectUnit = ({
    obbSheets,
    route,
    units
}: { obbSheets: ObbSheet[]; route: string;units:Unit[] }) => {
    const [open1, setOpen1] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedObbSheetId, setSelectedObbSheetId] = useState<string>('');
    const [selectedUnitId, setSelectedUnitId] = useState<string>('');

    const handleSelectSheet = (id: string) => {
        setSelectedObbSheetId(id);
        setOpen1(false);
    };
    const handleSelectUnit = (id: string) => {
        setSelectedUnitId(id);
        setOpen(false);
    };

    
    const getUnitNameById = (id: string) => {
        return units.find(sheet => sheet.id === id)?.name || " Units...";
    };

    return (
        <div>
      

        {/*  */}

        <div className='border px-10 pt-8 p-10 rounded-lg bg-slate-100 space-y-2'>
            <h1 className="text-slate-600 font-medium">Select Unit</h1>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full py-6 justify-between text-lg font-medium"
                    >
                        <>
                            {getUnitNameById(selectedObbSheetId)}
                            <ChevronsUpDown className="ml-2 size-5 shrink-0 opacity-50" />
                        </>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 md:w-[590px]">
                    <Command>
                        <CommandInput placeholder="Search Unit..." />
                        <CommandList>
                            {units && units.length > 0 ? (
                                <CommandGroup>
                                    {units.map((sheet) => (
                                        <Link 
                                            key={sheet.id}
                                            // href={isAssemblyQc ? `/points/product-assembly-qc/${sheet.id}` : `/points/gmt-production-${part}-qc/${sheet.id}`}
                                            href={`${route}/${sheet.id}`}
                                        >
                                            <CommandItem
                                                value={sheet.name}
                                                className="cursor-pointer py-4 text-xl font-medium"
                                                onSelect={() => handleSelectUnit(sheet.id)}
                                            >
                                                <Check
                                                    className={`mr-2 h-4 w-4 ${selectedObbSheetId === sheet.id ? "opacity-100" : "opacity-0"}`}
                                                />
                                                {sheet.name}
                                            </CommandItem>
                                        </Link>
                                    ))}
                                </CommandGroup>
                            ) : (
                                <CommandEmpty>No Unit found!</CommandEmpty>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
        </div>
    );
};

export default SelectUnit;
