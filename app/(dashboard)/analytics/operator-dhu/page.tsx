
import { db } from '@/lib/db';
import DhuReport from './_components/dhu-report';

const TLSOperators = async () => {
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
            <DhuReport
                obbSheets={obbSheets}
            />
        </div>
    )
}

export default TLSOperators