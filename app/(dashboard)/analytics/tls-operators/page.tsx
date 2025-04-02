import AnalyticsChart from './_components/analytics-chart';
import { db } from '@/lib/db';

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
            <AnalyticsChart
                obbSheets={obbSheets}
                title='Traffic Light System Chart for Production'
            />
        </div>
    )
}

export default TLSOperators