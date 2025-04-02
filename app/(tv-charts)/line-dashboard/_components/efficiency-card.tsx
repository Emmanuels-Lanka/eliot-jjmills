"use client"

import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

import { cn } from '@/lib/utils';
import { fetchFactoryStartTime, fetchProductionCount, fetchProductionData } from '../_actions/fetch-data-for-efficiency';
import GifAnimatedCard from './gif-animated-card';
import { Puzzle } from 'lucide-react';

interface EfficiencyCardProps {
    obbSheetId: string;
}

const EfficiencyCard = ({
    obbSheetId
}:EfficiencyCardProps) => {
    const [value, setValue] = useState<number>();
    const timezone: string = 'Asia/Dhaka';
    
    const processData = (data: any[]) => {
        const dataMap = data.map((d) => {
            const currentTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");
            const end = new Date(currentTime);

            const start = d.start
            const [hours, minutes] = start.split(":").map(Number); 

            const startDate = new Date()
            startDate.setHours(hours, minutes, 0, 0);

            const manPower = d.obbManPowers

            const availableMinsManpower = ((end.getTime() - startDate.getTime()) / (1000 * 60))*manPower;
            const availableMins = ((end.getTime() - startDate.getTime()) / (1000 * 60));

            const smv = d.totalSMV

            const earnMins = Number(d.count) * Number(smv)

            const Efficiency = Number(((earnMins/availableMinsManpower)*100).toFixed(1))
            const count = Number(d.count)

            return {
                Efficiency,earnMins,availableMins,count,smv,manPower,availableMinsManpower
            }
        })
        return dataMap
    }

    const merge = (data:any [],rfid:any[])=> {
        const returnMap = data.map((d)=>{
            const found = rfid.find((r)=>r.obbSheetId === d.obbSheetId)
            return {
                ...d,...found
            }
        });
        // console.log("rer",returnMap)

        return returnMap
    }

    const fetchData = async () => {
        const startTimeData = await fetchFactoryStartTime(obbSheetId);
        // console.log("startTimeData:", startTimeData)
        
        const productionData = await fetchProductionData(obbSheetId);
        console.log("productionData:", productionData);

        // const count = await fetchProductionCount(obbSheetId);
        // console.log("count:", count)

        const merged = merge(startTimeData, productionData)

        const datas = processData(merged)
        setValue(datas[0].Efficiency)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        // <div className='h-full w-full bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
        //     <img src='/icons/tv/efficiency.gif' alt="efficiency" className={cn("size-[11vh] p-2 pointer-events-none")} />
        //     <div className='w-full'>
        //         <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Efficiency</p>
        //         <p className={cn("mt-1 font-semibold text-4xl text-green-600")}>{value ? `${value}%`: "NAN"}</p>
        //     </div>
        // </div>
            <GifAnimatedCard
                label='Efficiency (%)'
                value={value ? `${value}`: "NAN"}
                image='/icons/tv/efficiency.gif'
                color='text-green-600'
                imgSize='size-[11vh]'
                textSize='large'
                long={true}
                icon={<Puzzle color="#16A34A"  className='h-full w-full rounded-full' />}
          
            />
    )
}

export default EfficiencyCard