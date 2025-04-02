"use client"
import { useEffect, useState } from "react";
import { getObbSheetID } from "./actions";
import { Span } from "next/dist/trace";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Cog } from "lucide-react";
import BarChartGraph from "./bar-chart-graph";
import LogoImporter from "@/components/dashboard/common/eliot-logo";


const AchievementRateOperation = ({ linename }: { linename: string }) => {

  const [obbSheetId, setobbSheetId] = useState<string>("")
  const [date, setdate] = useState<string>("")

  const getObbSheetID1 = async () => {
    const obbSheetId1 = await getObbSheetID(linename);
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
    getObbSheetID1()
  }, [linename])
  return (
    <div className="h-[200]">
      <div className='flex justify-center items-center gap-3'>
        {/* <Cog className='w-7 h-7 text-voilet' /> */}
        <LogoImporter/> 
        <h1 className='text-[#0071c1] mx-4 text-3xl'>Dashboard - Overall Operation  Achievement - {linename}</h1>
      </div>

      {obbSheetId.length > 0 ? <BarChartGraph
        obbSheetId={obbSheetId}
        date={date}
      /> : <span>No Layout for Line {linename} - {date}</span>}
    </div>
  )
}
export default AchievementRateOperation;