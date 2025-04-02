
import { Cog } from 'lucide-react'
import React from 'react'
// import LogTable from '../../../../components/log/LogTable'
import { db } from '@/lib/db';
import LogTable from './_components/LogTable';
// import SearchComponent from '@/components/log/SearchCompo';

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
const units = await db.unit.findMany({
    
    orderBy: {
        createdAt: "asc",
    },
    select: {
        id: true,
        name: true
    }
});

// console.log(units)

return (
    <div>
    
        <div className="container">
          
        <LogTable obbSheets={obbSheets} units={units} ></LogTable>
      </div>
  </div>
  )


}



export default page