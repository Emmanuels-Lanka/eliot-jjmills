



import { Cog } from 'lucide-react'
import React from 'react'
import LogTable from '../../../../components/log/LogTable'
import { db } from '@/lib/db';
import ReportTable from './_components/daily-report';
import { getEmployee } from './_components/actions';

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


  
}

)

const emp = await getEmployee()


// const operators = await db.operator.findMany({
//   orderBy
//   : {
//     rfid:"asc"
//   },
//   select:{
//     id:true,
//     name:true,
//     employeeId:true,
    
    
//   }
// })
// ;



  return (
    <div>
    
        <div className="container">
        <ReportTable obbSheets={obbSheets} operators={emp}   ></ReportTable>
      </div>
  </div>
  )
}

export default page