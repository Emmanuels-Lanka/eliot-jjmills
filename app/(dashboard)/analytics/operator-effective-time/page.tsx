import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import Container from "./_components/container";

const OperatorEffectiveTime = async () => {
    const effetiveTime = await db.operatorEffectiveTime.findMany({
        include: {
            operator: true
        }
    });

    return (
        <div className='mt-12'>
            <Container  columns={columns} data={effetiveTime}  ></Container>
            {/* <DataTable columns={columns} data={effetiveTime} /> */}
        </div>
    )
}

export default OperatorEffectiveTime