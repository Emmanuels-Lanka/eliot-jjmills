import { db } from '@/lib/db';
import AnalyticsChart from './_components/analytics-chart';

const ProductionEfficiency60 = async () => {
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
                title='Production Efficiency - Hourly Heatmap'
            />
        </div>
    )
}

export default ProductionEfficiency60