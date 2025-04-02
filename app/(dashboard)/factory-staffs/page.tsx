import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";


const FactoryStaff = async () => {
  const staffs = await db.staff.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className='mx-auto max-w-7xl mt-2'>
      <DataTable columns={columns} data={staffs} />
    </div>
  )
}

export default FactoryStaff