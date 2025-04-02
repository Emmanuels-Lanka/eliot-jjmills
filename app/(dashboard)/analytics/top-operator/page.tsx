import { db } from '@/lib/db';
import AnalyticsChart from './analytics';

const OperatorEfficiency60 = async () => {
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
                title='Operator Efficiency Heatmap for 60min'
            />
        </div>
    )
}

export default OperatorEfficiency60