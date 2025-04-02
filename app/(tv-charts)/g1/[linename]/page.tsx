import React from 'react'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import { db } from '@/lib/db';
import TvDailyAchivements from '@/components/tv-charts/daily-achivements/tv-daily-achivements';
import { Cog } from 'lucide-react';
import LogoImporter from '@/components/dashboard/common/eliot-logo';


const page = async ({ params }: { params: { linename: string}}) => {
   
  const lineid = params.linename
    

  return (
    <div>
      <div className="shadow-sm mb-4">
        {/* <div className="h-[200]">
          <div className="flex justify-center items-center gap-3">
            <Cog className="w-16 h-16 text-voilet" />
            <h1 className="text-slate-500 m-4 text-3xl">
              ELIoT Web Portal - Target vs Actual Production for {lineid}
            </h1>
          </div>
        </div> */}
         <div className='flex justify-center items-center gap-3 w-screen'>
        {/* <Cog className='w-7 h-7 text-voilet' /> */}
        <LogoImporter/>
        <h1 className='text-[#0071c1] my-4 text-3xl '>Target vs Actual Production - {lineid}</h1>
      </div>


        <div className="container">
          <TvDailyAchivements linename={lineid}></TvDailyAchivements>
        </div>
      </div>
    </div>
  );
}

export default page