"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { EliotDevice } from "@prisma/client";

interface MultiSelectDevicesProps {
    devices: EliotDevice[];
    onSelectionChange: (devices: EliotDevice[]) => void;
}

const MultiSelectDevices = ({ 
    devices,
    onSelectionChange,
}: MultiSelectDevicesProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<EliotDevice[]>([]);
    const [inputValue, setInputValue] = useState("");

    const handleUnselect = useCallback((device: EliotDevice) => {
        setSelected((prev) => prev.filter((s) => s.serialNumber !== device.serialNumber));
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === "Delete" || e.key === "Backspace") {
                    if (input.value === "") {
                        setSelected((prev) => {
                            const newSelected = [...prev];
                            newSelected.pop();
                            return newSelected;
                        });
                    }
                }
                // This is not a default behaviour of the <input /> field
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        [],
    );

    const selectables = devices.filter(
        (device) => !selected.includes(device),
    );

    // console.log(selectables, selected, inputValue);
    useEffect(() => {
        onSelectionChange(selected);
    }, [selected]);

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group bg-white rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:outline-slate-200 focus-visible:bg-background">
                <div className="flex flex-wrap gap-2">
                    {selected.map((device) => {
                        return (
                            <Badge key={device.id} variant="secondary" className="text-sm">
                                {device.serialNumber}
                                <button
                                    className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(device);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(device)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        );
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select eliot devices..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className="absolute top-0 h-96 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((device) => {
                                    return (
                                        <CommandItem
                                            key={device.serialNumber}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onSelect={(value) => {
                                                setInputValue("");
                                                setSelected((prev) => [...prev, device]);
                                            }}
                                            className={"cursor-pointer"}
                                        >
                                            {device.serialNumber}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}

export default MultiSelectDevices