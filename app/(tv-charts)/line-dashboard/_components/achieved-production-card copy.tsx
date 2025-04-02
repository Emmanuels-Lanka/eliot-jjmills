"use client"

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { fetchLineEndPassCount } from '../_actions/dhu/fetch-line-end-pass-count';

interface AchievedProductionCardProps {
    obbSheetId: string;
}

const AchievedProductionCard = ({
    obbSheetId
}:AchievedProductionCardProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        (async () => {
            const res = await fetchLineEndPassCount(obbSheetId);
            setCount(res);
        })();
    }, []);

    return (
        <div className='h-full w-full bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <img src='/icons/tv/door.gif' alt="efficiency" className={cn("size-[12vh] p-5 pointer-events-none")} />
            <div className='w-full'>
                <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Achieved Production</p>
                <p className={cn("mt-1 font-semibold text-4xl text-orange-600")}>{count}</p>
            </div>
        </div>
    )
}

export default AchievedProductionCard