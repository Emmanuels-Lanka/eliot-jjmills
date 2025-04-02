import { db } from '@/lib/db'
import SelectObbSheet from './_components/select-obb-sheet';

const TabletUIObbSheetPage = async () => {
    const obbSheets = await db.obbSheet.findMany({
        where: {
            isActive: true,
        },
        select: {
            id: true,
            style: true,
            colour: true,
            buyer: true,
        }
    });

    return (
        <div className='mt-8 p-4'>
            <h1 className='mb-4 text-xl font-medium'>Select the OBB sheet</h1>
            <SelectObbSheet obbSheets={obbSheets}/>
        </div>
    )
}

export default TabletUIObbSheetPage