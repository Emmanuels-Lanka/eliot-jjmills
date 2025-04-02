import { db } from '@/lib/db';
import SelectObbSheet from '../line-dashboard/_components/select-obb-sheet';
import SelectUnit from '../line-dashboard/_components/select-unit';

const ProductionHourly = async () => {
    const obbSheets = await db.obbSheet.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
    });
    const units = await db.unit.findMany({
        orderBy: { name: "asc" },

    })

    return (
        <div className='mx-auto max-w-4xl'>
            <div className='mt-24'>
                <h1 className='text-center text-2xl font-medium text-sky-700 mb-6'>Select Unit for Production Board</h1>
                <SelectUnit obbSheets={obbSheets} units={units} route="/production-board" />
            </div>
        </div>
    )
}

export default ProductionHourly