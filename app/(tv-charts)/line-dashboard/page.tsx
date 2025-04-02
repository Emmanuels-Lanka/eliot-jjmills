import { db } from '@/lib/db';
import SelectObbSheet from './_components/select-obb-sheet';

const LineTvDashboard = async () => {
    const obbSheets = await db.obbSheet.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className='mx-auto max-w-4xl'>
            <div className='mt-24'>
                <h1 className='text-center text-2xl font-medium text-sky-700 mb-6'>Select Obb Sheet for this Line</h1>
                <SelectObbSheet obbSheets={obbSheets} route="/line-dashboard" />
            </div>
        </div>
    )
}

export default LineTvDashboard