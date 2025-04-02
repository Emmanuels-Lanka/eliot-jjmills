"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { fetchProductionCount } from '../_actions/fetch-data-for-efficiency';
import { Gauge } from 'lucide-react';

const ProgressBar = dynamic(() => import('./charts/progress-bar'), {
    ssr: false
});

interface PerformanceCardProps {
    obbSheetId: string;
    target: number;
}

const PerformanceCard = ({
    obbSheetId,
    target,
}: PerformanceCardProps) => {
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const count = await fetchProductionCount(obbSheetId);
            // console.log("count:", count);
            const performance = (count / target) * 100;
            setValue(performance);
        })();
    }, []);

    return (
        <div className='h-full w-full bg-slate-900 py-4 pl-2 pr-6 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <div className='w-2/5 '>
            <Gauge color="#DC2626" className='w-16 h-16' />
           
            {/* <img src='/icons/tv/performance.gif' alt="efficiency" className={cn("size-[11vh] p-3 rounded-full pointer-events-none")} /> */}

            </div>
            <div className='mt-4 w-full flex flex-col items-start'>
                <div className='w-full flex justify-between items-end'>
                    <p className='text-2xl font-medium text-slate-300 tracking-[0.01em]'>Performance</p>
                    <p className={cn("mt-1 font-semibold text-4xl text-red-600")}>{value ? `${value.toFixed(1)}%` : "NAN"}</p>
                </div>
                <div className='mt-2 w-full'>
                    <ProgressBar percentage={value} startColor="#ff800d" endColor="#dc2626" />
                </div>
            </div>
        </div>
    )
}

export default PerformanceCard