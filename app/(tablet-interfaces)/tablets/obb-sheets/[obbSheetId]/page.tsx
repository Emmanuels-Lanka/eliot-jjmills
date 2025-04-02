import { db } from '@/lib/db'
import ObbOperationsTable from '../_components/obb-operations-table';

const TabletUIObbSheetIdPage = async ({
    params
}: {
    params: { obbSheetId: string }
}) => {
    const obbSheet = await db.obbSheet.findUnique({
        where: {
            id: params.obbSheetId,
        },
        select: {
            style: true,
            colour: true,
            buyer: true,
        }
    });

    const obbOperations = await db.obbOperation.findMany({
        where: {
            obbSheetId: params.obbSheetId,
        },
        select: {
            id: true,
            seqNo: true,
            smv: true,
            target: true,
            part: true,
            operation: {
                select: {
                    name: true,
                    code: true
                }
            },
            sewingMachine: {
                select: {
                    id: true,
                    machineId: true,
                }
            },
            supervisor: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            seqNo: "asc",
        }
    });
    // console.log(obbOperations);

    return (
        <div className='mt-4'>
            {obbSheet ?
                <div className='py-4 px-4 md:px-8 bg-green-100 border border-green-300 flex justify-between'>
                    <p className='font-medium'>Style : <span className='font-normal'>{obbSheet.style}</span></p>
                    <p className='font-medium'>Colour : <span className='font-normal'>{obbSheet.colour || "undefined"}</span></p>
                    <p className='font-medium'>Buyer : <span className='font-normal'>{obbSheet.buyer}</span></p>
                </div>
                :
                <p className='my-4'>ObbSheet not found.</p>
            }

            <ObbOperationsTable obbOperations={obbOperations}/>
        </div>
    )
}

export default TabletUIObbSheetIdPage