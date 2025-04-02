import DashboardHeader from '@/components/dashboard/dashboard-header'
import { db } from '@/lib/db';
import React from 'react'

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
    
  return (
    <div>
        <div className='shadow-sm mb-4'>
        <DashboardHeader></DashboardHeader>
        </div>
        <div className='container'>
            
        
        </div>
    </div>
  )
}

export default page