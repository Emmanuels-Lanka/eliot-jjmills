import { db } from '@/lib/db';
import FirmwareUpdateForm from '../_components/firmware-update-form';
import { DataTable } from '../_components/data-table';
import { columns } from '../_components/columns';
import { Separator } from '@/components/ui/separator';

const FirmwareUpdatePage = async () => {
    const devices = await db.eliotDevice.findMany();

    const firmwares = await db.eliotFirmwareUpdate.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
    });
    // console.log("Firmware update", firmwares);

    return (
        <div className='mx-auto max-w-7xl mt-12'>
            <FirmwareUpdateForm devices={devices} />

            <Separator className='mt-12 mb-6'/>

            <div>
                <DataTable columns={columns} data={firmwares} />
            </div>
        </div>
    )
}

export default FirmwareUpdatePage