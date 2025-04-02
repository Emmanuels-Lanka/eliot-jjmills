import { db } from '@/lib/db';
import RoamingQcDashboard from './_components/roaming-qc-dashboard';

const RoamingQcPage = async () => {
    const units = await db.unit.findMany();

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
            <RoamingQcDashboard
                units={units}
                obbSheets={obbSheets}
            />
        </div>
    )
}

export default RoamingQcPage