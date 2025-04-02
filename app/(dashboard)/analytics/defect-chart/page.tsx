import SelectObbSheetDateHour from "@/components/dashboard/common/select-obbsheet-date-hour"
import { db } from "@/lib/db";
import EfficiencyAnalyticsChart from "./_components/analytics-chart";

const AchivementRateoperation = async () => {
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

    const units = await db.unit.findMany({
        select: {
            id: true,
            name: true
        },orderBy: {
            createdAt: "desc",
        }

        
    });



    return (
        <div>
            <EfficiencyAnalyticsChart
                obbSheets={obbSheets}
                units={units}
            />
        </div>
    )
}

export default AchivementRateoperation