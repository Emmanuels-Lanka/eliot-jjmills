"use client"

import React, { useEffect, useState } from 'react'
import {  getObbID,  } from './actions'
import ObbSheetId from '@/app/(dashboard)/obb-sheets/[obbSheetId]/page'
// import BarChartGraph from '@/app/(dashboard)/analytics/daily-achivement/components/BarChartGraph'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import BarChartGraph from './BarChartGraph'





 
const TvDailyAchivements = ({linename}:{linename:string}) => {


  const searchParams = useSearchParams()
 
  const dParam = searchParams.get('d')



  const [obbSheet,setObbSheet]=useState<string>("")
  const [date,setDate] = useState<string>("")




 


  const getObb = async () => {
    const obbSheetId = await getObbID(linename);
    setObbSheet(obbSheetId);
  }

  useEffect(()=>{

    if (!dParam)
    {
      const today = new Date();
      const yyyyMMdd =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getDate().toString().padStart(2, "0");
  
      const date = yyyyMMdd.toString() + "%";
      setDate(date);

    } else{
      setDate(dParam+"%")
      console.log("Date",dParam)
    }
    getObb();

  },[linename])
 
  
  


  
  return (
    <div>

      <BarChartGraph
       obbSheetId={obbSheet}
       date={date}
      ></BarChartGraph>

    </div>
  )
}

export default TvDailyAchivements