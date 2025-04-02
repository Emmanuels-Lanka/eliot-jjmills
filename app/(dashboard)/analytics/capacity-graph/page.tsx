import React from 'react'
import { db } from '@/lib/db';
import AnalyticsCompo from './_components/analytics';
const page = async () => {

    const obbSheets = await db.obbSheet.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true
        }
    });
    // console.log(obbSheets)
    const units = await db.unit.findMany({
        select:{
            id:true,
            name:true
        }
    })

    // console.log(units)

  return (
    <div>
        <AnalyticsCompo obbSheets={obbSheets} units={units}></AnalyticsCompo>
    </div>
  )
}

export default page