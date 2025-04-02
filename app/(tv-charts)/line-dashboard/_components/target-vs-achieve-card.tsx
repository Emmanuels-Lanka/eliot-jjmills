"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { fetchLineEndPassCount } from '../_actions/dhu/fetch-line-end-pass-count';
import { FaChartLine } from 'react-icons/fa';
import { LineChart } from 'lucide-react';

const RadialbarCircleChart = dynamic(() => import('./charts/radialbar-circle-chart'), {
    ssr: false
});

interface TargetVsAchieveCardProps {
    obbSheetId: string;
    target: number;
}

const TargetVsAchieveCard = ({
    obbSheetId,
    target
}: TargetVsAchieveCardProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        (async () => {
            const res = await fetchLineEndPassCount(obbSheetId);
            setCount(res);
        })();
    }, []);

    return (
        <div className='h-full w-full bg-slate-900 flex items-center border-slate-600 rounded-xl drop-shadow-sm border'>
            <div className='w-1/2 flex flex-col items-end pr-6 -mt-6'>
<div className=''>
                {/* <img src='/icons/tv/achieve.gif' alt="efficiency" className={cn("size-[12vh] p-2 rounded-full pointer-events-none")} /> */}
                <div className='w-2/5 '>
                <LineChart color="#059669" className='w-16 h-16' />
                
             
            {/* <img src='/icons/tv/dhu.gif' alt="efficiency" className={cn("size-[11vh] p-3 rounded-full pointer-events-none")} /> */}
            </div>
</div>                <div className='text-end'>
                    <p className='text-lg font-medium text-slate-300 tracking-[0.01em]'>Target vs Achieve in pcs</p>
                    <p className={cn("mt-6 font-semibold text-3xl")}><span className='text-emerald-600'>{count}</span> <span className='text-sky-600'>/ {target}</span></p>
                </div>
            </div>
            <div className='w-2/3 absolute -right-10 '>
                <RadialbarCircleChart total={target} count={count} label="Achievement" />
            </div>
        </div>
    )
}

export default TargetVsAchieveCard