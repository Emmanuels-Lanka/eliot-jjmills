import SelectObbSheetDateHour from "@/components/dashboard/common/select-obbsheet-date-hour"
import { db } from "@/lib/db";
import EfficiencyAnalyticsChart from "./_components/analytics-chart";
// import EfficiencyAnalyticsChart from "./_components/analytics-chart";

const MachineTypeCompo = async () => {
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
            <EfficiencyAnalyticsChart
                obbSheets={obbSheets}
            />
        </div>
    )
}

export default MachineTypeCompo