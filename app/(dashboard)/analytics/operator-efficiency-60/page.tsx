import AnalyticsChart from '@/app/(dashboard)/analytics/production-efficiency-60/_components/analytics-chart';
import { db } from '@/lib/db';

const OperatorEfficiency60 = async () => {
    const obbSheets = await db.obbSheet.findMany({
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