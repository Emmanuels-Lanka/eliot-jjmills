"use client"

import HeatmapChart from '@/components/dashboard/charts/heatmap-chart'
import Image from 'next/image'

const Dashboard = () => {
    return (
        <section className='flex flex-col justify-center items-center'>
            <Image 
                src="/eliot-logo.png"
                alt='logo'
                width={1000}
                height={1000}
                className='lg:mt-20 w-full lg:w-1/2 p-4'
            />
            {/* <h1 className='text-2xl font-medium text-slate-700'>Welcome to the ELIoT web portal!</h1> */}
            <HeatmapChart 
                title='HeatMap Chart with Color Range!'
                xAxisLabel='X Axis Label'
                yAxisLabel='Y Axis Label'
                height={500} 
            />
        </section>
    )
}

export default Dashboard
