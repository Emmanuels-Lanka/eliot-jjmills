import { fetchGmtDefectsForDHU } from '@/actions/fetch-gmt-defects-for-dhu';
import { fetchProductDefectsForDHU } from '@/actions/fetch-product-defects-for-dhu';
import Image from 'next/image';

const Dashboard = async () => {
    // const gmtDefects = await fetchGmtDefectsForDHU('lzs07i72-ojSke1Ky3mJh');
    // const productDefects = await fetchProductDefectsForDHU('lzs07i72-ojSke1Ky3mJh');

    // console.log("GMT:", gmtDefects);
    // console.log("PRODUCT:", productDefects);

    return (
        <section className='flex flex-col justify-center items-center'>
            <Image
                src="/eliot-logo.png"
                alt='logo'
                width={1000}
                height={1000}
                className='lg:mt-20 w-full lg:w-1/2 p-4'
            />
            <h1 className='text-2xl font-medium text-slate-700'>Welcome to the ELIoT monitoring portal!</h1>
        </section>
    )
}

export default Dashboard
