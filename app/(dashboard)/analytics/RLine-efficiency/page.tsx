import SelectObbSheetDateHour from "@/components/dashboard/common/select-obbsheet-date-hour"
import { db } from "@/lib/db";
import AnalyticsChart from "./_components/analytics";
import { getUnit } from "./_components/actions";



const HourlyProduction = async () => {
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

    const unit = await getUnit() ;

    return (
        <div>
            <AnalyticsChart
                obbSheets={obbSheets}
                units={unit}
            />
        </div>
    )
}

export default HourlyProduction