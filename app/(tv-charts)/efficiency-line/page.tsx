import { db } from '@/lib/db';
import SelectObbSheet from '../line-dashboard/_components/select-obb-sheet';
import SelectLine from '../line-dashboard/_components/select-line';

const Efficiency = async () => {
    
    const lines = await db.productionLine.findMany({
        orderBy:{
            name:"asc"
        }
    })

    console.log(lines)

    return (
        <div className='mx-auto max-w-4xl'>
            <div className='mt-24'>
                <h1 className='text-center text-2xl font-medium text-sky-700 mb-6'>Select Obb Sheet for this Line</h1>
                <SelectLine  lines={lines}  route="/efficiency-line" />
            </div>
        </div>
    )
}

export default Efficiency