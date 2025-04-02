"use client"

import { useEffect, useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchBundleStyles } from "@/actions/fetch-bundle-styles";

const SelectBundleStyles = ({ defaultValue, onChange }: { defaultValue?: string; onChange: (value: string) => void} ) => {
    const [styles, setStyles] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetchBundleStyles();
            // console.log("Response:", response);
            setStyles(response);
        })();
    }, []);

    return (
        <Select onValueChange={onChange} defaultValue={defaultValue}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
                {styles.length > 0 ?
                    styles.map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))
                    :
                    <p className="px-2 py-1 text-sm text-slate-500">No styles found</p>
                }
                {/* <SelectItem value="light">Light</SelectItem> */}
            </SelectContent>
        </Select>
    )
}

export default SelectBundleStyles