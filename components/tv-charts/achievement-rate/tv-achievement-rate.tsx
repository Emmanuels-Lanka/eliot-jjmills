"use client"
import { useEffect, useState } from "react";
import { getData } from "./actions";
import BarChartGraph from "@/app/(dashboard)/analytics/achievement-rate/_components/bar-chart-graph";
import { Span } from "next/dist/trace";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Cog } from "lucide-react";


const AchievementRate = ({ linename }: { linename: string }) => {

  const [obbSheetId, setobbSheetId] = useState<string>("")
  const [date, setdate] = useState<string>("")

  const getObbSheetID = async () => {
    const obbSheetId1 = await getData(linename);
    setobbSheetId(obbSheetId1)
   
  }

  useEffect(() => {

    const y = new Date().getFullYear().toString()
    const m = (new Date().getMonth() + 1).toString().padStart(2, "0")
    //const d = new Date().getDate().toString().padStart(2, "0")
    const today = new Date();
    const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  
   const date =  yyyyMMdd.toString()+"%"
    setdate(date)

  }, [])

  useEffect(() => {
    console.log("linename", linename,)
    getObbSheetID()
  }, [linename])
  return (
    <div className="h-[200]">
      <div className='flex justify-center items-center gap-3'>
        <Cog className='w-7 h-7 text-voilet' />
        <h1 className='text-slate-500 m-4 text-3xl'>ELIoT Web Portal - Operator Production Rate for {linename}</h1>
      </div>

      {obbSheetId.length > 0 ? <BarChartGraph
        obbSheetId={obbSheetId}
        date={date}
      /> : <span>No Layout for Line {linename} - {date}</span>}
    </div>
  )
}
export default AchievementRate;