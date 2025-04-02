import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

const AlertLogs = async () => {
  const alertLogs = await db.alertLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <div className='mx-auto max-w-7xl mt-6'>
      <DataTable columns={columns} data={alertLogs} />
    </div>
  )
}

export default AlertLogs