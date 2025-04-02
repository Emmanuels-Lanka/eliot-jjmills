"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { fetchGmtDefectsForDHU } from '../_actions/dhu/fetch-gmt-defects-for-dhu';
import { fetchProductDefectsForDHU } from '../_actions/dhu/fetch-product-defects-for-dhu';
import { fetchLineEndInspectCount } from '../_actions/dhu/fetch-line-end-inspect-count';
import { Radar, Waypoints } from 'lucide-react';

const ProgressBar = dynamic(() => import('./charts/progress-bar'), {
    ssr: false
});

interface DhuCardProps {
    obbSheetId: string;
}

const DhuCard = ({
    obbSheetId
}: DhuCardProps) => {
    const [count, setCount] = useState<number>(0);

    function countDefects(data: DHUDefectsDataTypes): number {
        return data.reduce((totalDefects, item) => {
            if (item.qcStatus !== "pass") {
                return totalDefects + item.defects.length;
            }
            return totalDefects;
        }, 0);
    }

    useEffect(() => {
        (async () => {
            const gmtDefects = await fetchGmtDefectsForDHU(obbSheetId);
            const productDefects = await fetchProductDefectsForDHU(obbSheetId);
            const defectsArray = gmtDefects.concat(productDefects);

            const InspectCount = await fetchLineEndInspectCount(obbSheetId);
            const defectsCount = countDefects(defectsArray);

            const dhu = ((defectsCount / InspectCount) * 100).toFixed(2)
            setCount(parseFloat(dhu));
        })();
    }, []);

    return (
        <div className='h-full w-full bg-slate-900 py-4 pl-2 pr-6 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <div className='w-2/5 '>
            <Radar color="#EA580C"  className='w-16 h-16' />
            {/* <img src='/icons/tv/dhu.gif' alt="efficiency" className={cn("size-[11vh] p-3 rounded-full pointer-events-none")} /> */}
            </div>
            <div className='mt-4 w-full flex flex-col items-start'>
                <div className='w-full flex justify-between items-end'>
                    <p className='text-2xl font-medium text-slate-300 tracking-[0.01em]'>Line DHU</p>
                    <p className={cn("mt-1 font-semibold text-4xl text-orange-600")}>{count}%</p>
                </div>
                <div className='w-full mt-2'>
                    <ProgressBar percentage={count} startColor="#ff800d" endColor="#dc2626" />
                </div>
            </div>
        </div>
    )
}

export default DhuCard