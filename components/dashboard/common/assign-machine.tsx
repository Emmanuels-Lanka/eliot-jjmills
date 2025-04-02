"use client";

import { useState } from "react";
import { SewingMachine } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface AssignMachineProps {
    assignedMachines: SewingMachine[] | null;
    unassignedMachines: SewingMachine[] | null;
    lineId: string | null;
}

const AssignMachine = ({
    assignedMachines,
    unassignedMachines,
    lineId,
}: AssignMachineProps) => {
    const { toast } = useToast();
    const router = useRouter();
    
    // State to hold the search query
    const [searchQuery, setSearchQuery] = useState("");

    // Handle machine assignment
    const handleAssign = async (id: string) => {
        if (lineId) {
            try {
                const res = await axios.put(`/api/production-line/assign-machine/${lineId}`, { machineId: id });
                toast({
                    title: "Assigned the machine",
                    variant: "success",
                });
                router.refresh();
            } catch (error: any) {
                toast({
                    title: "Something went wrong! Try again",
                    variant: "error",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                ERROR: {error.message}
                            </code>
                        </div>
                    ),
                });
            }
        }
    };

    // Handle machine unassignment
    const handleUnassign = async (id: string) => {
        if (lineId) {
            try {
                const res = await axios.put(`/api/production-line/unassign-machine/${lineId}`, { machineId: id });
                toast({
                    title: "Unassigned the machine",
                    variant: "success",
                });
                router.refresh();
            } catch (error: any) {
                toast({
                    title: "Something went wrong! Try again",
                    variant: "error",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                ERROR: {error.message}
                            </code>
                        </div>
                    ),
                });
            }
        }
    };

    // Filter machines based on search query
    const filteredAssignedMachines = assignedMachines?.filter(
        (machine) =>
            machine.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            machine.machineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            machine.machineId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUnassignedMachines = unassignedMachines?.filter(
        (machine) =>
            machine.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            machine.machineType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            machine.machineId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="border px-8 pt-7 py-8 rounded-lg bg-slate-100">
            {lineId ? (
                <>
                    {/* Search input */}
                    <input
                        type="text"
                        placeholder="Search machines"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full p-2 mb-6 border border-gray-300 rounded-md"
                    />

                    <div className="flex flex-col">
                        <h3 className="font-medium text-slate-900">Assigned machines</h3>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
                            {filteredAssignedMachines && filteredAssignedMachines.map((machine) => (
                                <Badge
                                    key={machine.id}
                                    className="bg-green-600 cursor-pointer text-sm px-4 py-1 uppercase font-medium tracking-wide"
                                    onClick={() => handleUnassign(machine.id)}
                                >
                                    {machine.brandName}-{machine.machineType}-{machine.machineId}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator className="h-0.5 bg-slate-300 my-6" />

                    <div className="flex flex-col">
                        <h3 className="font-medium text-slate-900">Unassigned machines</h3>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
                            {filteredUnassignedMachines && filteredUnassignedMachines.map((machine) => (
                                <Badge
                                    key={machine.id}
                                    className="bg-orange-600 cursor-pointer text-sm px-4 py-1 uppercase font-medium tracking-wide"
                                    onClick={() => handleAssign(machine.id)}
                                >
                                    {machine.brandName}-{machine.machineType}-{machine.machineId}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-slate-600">🥺 Select the production line to assign the machine...</p>
            )}
        </div>
    );
};

export default AssignMachine;
