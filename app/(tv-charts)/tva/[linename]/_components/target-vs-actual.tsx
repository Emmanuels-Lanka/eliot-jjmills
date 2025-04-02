"use client"
import { useEffect, useState } from "react";
 
 
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Cog } from "lucide-react";
import { getObbSheetID } from "@/components/tv-charts/achievement-rate-operation/actions";
import BarChartGraphOpSmv from "@/app/(dashboard)/analytics/operation-smv/_components/smv-bar-chart";
import LogoImporter from "@/components/dashboard/common/eliot-logo";


const TVACompo = ({ linename }: { linename: string }) => {

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
      {/* <div className='flex justify-center items-center gap-3'>
        <Cog className='w-7 h-7 text-voilet' />
        <h1 className='text-slate-500 m-4 text-3xl'>ELIoT Web Portal - SMV vs Cycle Time {linename}</h1>
      </div> */}
       <div className='flex justify-center items-center gap-3 w-screen'>
        {/* <Cog className='w-7 h-7 text-voilet' /> */}
        <LogoImporter/>
        <h1 className='text-[#0071c1] my-4 text-3xl '>Dashboard - SMV vs Cycle Time - {linename}</h1>
      </div>

      {obbSheetId.length > 0 ? <BarChartGraphOpSmv
        obbSheetId={obbSheetId}
        date={date}
      /> : <span>No Layout for Line {linename} - {date}</span>}
    </div>
  )
}
export default TVACompo;