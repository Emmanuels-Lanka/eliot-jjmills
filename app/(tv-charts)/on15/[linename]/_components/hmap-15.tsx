"use client"
import { useEffect, useState } from "react";
 
 
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Cog } from "lucide-react";
import { getObbSheetID } from "@/components/tv-charts/achievement-rate-operation/actions";
import LogoImporter from "@/components/dashboard/common/eliot-logo";
import HmapChart15Compo from "./heatmap-15-min";
//import HmapChart15Compo from "@/app/(dashboard)/analytics/operation-efficiency-15/_components/heatmap-15-min";
//import HmapChart15Compo from "@/app/(dashboard)/analytics/operation-efficiency-15/_components/heatmap-15-min";
// import HmapChart15Compo from "@/app/(dashboard)/analytics/operator-efficiency-15/_components/heatmap-15-min";


const Hmap15CompoOperation = ({ linename }: { linename: string }) => {

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
   console.log(date)
    setdate(date)

  }, [])

  useEffect(() => {
     
    getObbSheetID1()
  }, [linename])
  return (
    <div className="h-[200]">
    <div className='flex justify-center items-center gap-3 w-screen'>
      {/* <Cog className='w-7 h-7 text-voilet' /> */}
      <LogoImporter/>
      <h1 className='text-[#0071c1] my-4 text-3xl '>Dashboard - Operation Efficiency(15min) {linename}</h1>
    </div>

      {obbSheetId.length > 0 ? 
      <HmapChart15Compo
        obbSheetId={obbSheetId}
        date={date}
      /> : <span>No Layout for Line {linename} - {date}</span>}
    </div>
  )
}
export default Hmap15CompoOperation;