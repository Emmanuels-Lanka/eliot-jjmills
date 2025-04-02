
"use client"

import { useEffect } from 'react';
import moment from 'moment-timezone';

import { cn } from '@/lib/utils';
import { getData, getDataRfid } from './actions';


const EfficiencyCard = () => {
    const timezone: string = 'Asia/Dhaka';
    
    // const manpower = 110
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

            const Efficiency = Number(((earnMins/availableMinsManpower)*100).toFixed(2))
            const count = Number(d.count)

            console.log("asdasd",startDate)
            console.log("asdasds",start)
            console.log("asdasds",currentTime)
            
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
        })

        console.log("rer",returnMap)

        return returnMap
    }

    const fetchData = async () => {
        const data = await getData()
        console.log("data:", data)
        
        const rfidData = await getDataRfid()
        console.log("rfid:", rfidData)

        const merged = merge(data,rfidData)



        const datas = processData(merged)
        console.log("final",datas)
       
       


    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className='h-full w-full bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl'>
            <img src='/icons/tv/measure.gif' alt="efficiency" className={cn("size-[12vh] pointer-events-none")} />
            <div className='w-full'>
                <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Efficency</p>
                {/* <p className={cn("mt-1 font-semibold text-3xl", color)}>{value.toUpperCase()}</p> */}
            </div>
        </div>
    )
}

export default EfficiencyCard
