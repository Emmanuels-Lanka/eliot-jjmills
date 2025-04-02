"use client"

import React, { useState } from "react";
import Link from "next/link";
import { ChevronsUpDown, Check } from "lucide-react";
import { ObbSheet, ProductionLine, Unit } from "@prisma/client";

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

const SelectLine = ({
    
    route,
    
    lines
}: {  route: string; lines:ProductionLine[]}) => {
    const [open1, setOpen1] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedObbSheetId, setSelectedObbSheetId] = useState<string>('');
    const [selectedUnitId, setSelectedUnitId] = useState<string>('');
    const [selectedLineId, setSelectedLineId] = useState<string>('');

    const handleSelectSheet = (id: string) => {
        setSelectedObbSheetId(id);
        setOpen1(false);
    };
    const handleSelectUnit = (id: string) => {
        setSelectedUnitId(id);
        setOpen(false);
    };
    const handleSelectLine = (id: string) => {
        setSelectedLineId(id);
        setOpen(false);
    };

    

    const getLineNameById = (id: string) => {
        return lines.find(sheet => sheet.id === id)?.name || " Lines...";
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
                            {getLineNameById(selectedLineId)}
                            <ChevronsUpDown className="ml-2 size-5 shrink-0 opacity-50" />
                        </>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 md:w-[590px]">
                    <Command>
                        <CommandInput placeholder="Search Unit..." />
                        <CommandList>
                            {lines && lines.length > 0 ? (
                                <CommandGroup>
                                    {lines.map((sheet) => (
                                        <Link 
                                            key={sheet.id}
                                            // href={isAssemblyQc ? `/points/product-assembly-qc/${sheet.id}` : `/points/gmt-production-${part}-qc/${sheet.id}`}
                                            href={`${route}/${sheet.id}`}
                                        >
                                            <CommandItem
                                                value={sheet.name}
                                                className="cursor-pointer py-4 text-xl font-medium"
                                                onSelect={() => handleSelectLine(sheet.id)}
                                            >
                                                <Check
                                                    className={`mr-2 h-4 w-4 ${selectedLineId === sheet.id ? "opacity-100" : "opacity-0"}`}
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

export default SelectLine;
