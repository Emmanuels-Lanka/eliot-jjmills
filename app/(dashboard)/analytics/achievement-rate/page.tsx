import SelectObbSheetDateHour from "@/components/dashboard/common/select-obbsheet-date-hour"
import { db } from "@/lib/db";
import AnalyticsChart from "./_components/analytics-chart";

const AchivementRateOperation = async () => {
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
            />
        </div>
    )
}

export default AchivementRateOperation