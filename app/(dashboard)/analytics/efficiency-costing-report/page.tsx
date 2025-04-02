import CostingReport from "./_components/report-table"
import React from 'react'
import { db } from '@/lib/db';

const page= async()=>{
    
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
    return(
        <div>
            <CostingReport obbSheets={obbSheets}/>
        </div>
    )
}
export  default page;
