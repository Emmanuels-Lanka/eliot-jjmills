import Link from 'next/link';
import { ChevronLeft, Goal, PencilRuler, PercentCircle, Settings, UserRoundCog, UsersRound } from 'lucide-react';
import { format } from 'date-fns';

import { db } from '@/lib/db';
import GifAnimatedCard from '../_components/gif-animated-card';
import { fetchAttendance } from '../_actions/fetch-attendance';
import EfficiencyCard from '../_components/efficiency-card';
import RejectionCard from '../_components/rejection-card';
import WipCard from '../_components/wip-card';
import { fetchLineEfficiencyResource } from '../_actions/fetch-line-efficiency-resource';
import PerformanceCard from '../_components/performance-card';
import DhuCard from '../_components/dhu-card';
import AchievedProductionCard from '../_components/achieved-production-card';
import TargetVsAchieveCard from '../_components/target-vs-achieve-card';
import ProductionTrendCard from '../_components/production-trend-card';

const ObbLineTvDashboard = async ({
    params
}: {
    params: { obbSheetId: string }
}) => {
    const date = new Date();
    const formattedDate = format(date, 'dd MMMM, yyyy');

    const obbSheet = await db.obbSheet.findUnique({
        where: {
            id: params.obbSheetId,
        },
        include: {
            productionLine: { select: { name: true } },
            lineChief: { select: { name: true } },
        }
    });

    if (!obbSheet) {
        return <p>Obb Sheet not found</p>;
    }

    const attendance = await fetchAttendance(params.obbSheetId);

    const lineEfficiencyResource = await fetchLineEfficiencyResource(params.obbSheetId);

    if (!lineEfficiencyResource) {
        return <p>Line efficiency resource not found</p>;
    }

    return (
        <div className='w-full overflow-x-hidden bg-gradient-to-tr from-black to-slate-600'>
            {/* Dashboard header */}
            <div className='  px-4 pt-4 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href="/line-dashboard" >
                        <div className='size-8 bg-sky-600 flex justify-center items-center rounded-md hover:bg-sky-700'>
                            <ChevronLeft className='text-white' size={28} />
                        </div>
                    </Link>
                    <h1 className='text-2xl text-white font-semibold'>Sewing Line TV Dashboard</h1>
                </div>
                <div className='text-end'>
                    <p className='text-lg text-white font-semibold'>{obbSheet.productionLine.name}</p>
                    <p className='text-sm  text-white'>{formattedDate}</p>
                </div>
            </div>

            {/* Dashboard content */}
            <div className="h-screen  p-4 grid grid-cols-6 grid-rows-5 gap-6">
                <GifAnimatedCard
                    label='Line Chief'
                    value={obbSheet.lineChief?.name as string}
                    image='/icons/tv/user.gif'
                    color='text-violet-600'
                    long={true}
                    icon={<UserRoundCog color="#7C3AED" className='h-full w-full rounded-full' />} // Pass the component as a prop
                />
                <GifAnimatedCard
                    label='Running Style'
                    value={obbSheet.style}
                    image='/icons/tv/measure.gif'
                    color='text-pink-600 mr-4 my-3'
                    long={true}
                    icon={<PencilRuler color="#DB2777" className='h-full w-full rounded-full' />}
                />
                <GifAnimatedCard
                    label='Attendance'
                    value={
                        `${lineEfficiencyResource.utilizedManPowers}/${lineEfficiencyResource.obbManPowers}`
                    }
                    image='/icons/tv/attendance.gif'
                    color='text-sky-600'
                    imgSize='size-[11vh]'
                    // textSize='large'
                    long={true}
                    icon={<UsersRound color="#0284C7" className='h-full w-full rounded-full' />}

                />
                <GifAnimatedCard
                    label='Planned Working Hrs'
                    value={lineEfficiencyResource.workingHours?.toString() ?? ""}
                    image='/icons/tv/clock.gif'
                    color='text-cyan-600'
                    imgSize='size-[10vh]'
                    textSize='large'
                    long={true}
                    icon={<Settings color="#0891B2" className='h-full w-full rounded-full' />}
                    
                />
                <GifAnimatedCard
                    label='Production Target'
                    value={lineEfficiencyResource.productionTarget?.toString() ?? ""}
                    image='/icons/tv/target.gif'
                    color='text-sky-600'
                    imgSize='size-[11vh]'
                    textSize='medium'
                    long = {true}
                
                    icon={<Goal color="#0284C7" className='h-full w-full rounded-full' />}

                />
                <GifAnimatedCard
                    label='Efficiency Target'
                    value={lineEfficiencyResource.targetEfficiency?.toString() ?? ""}
                    image='/icons/tv/star.gif'
                    color='text-orange-600'
                    imgSize='size-[10vh]'
                    textSize='large'
                    long = {true}
                    
                    icon={<PercentCircle color="#EA580C" className='h-full w-full rounded-full' />}
                    
                />
                <div className="col-span-4 row-span-3">
                    <ProductionTrendCard
                        obbSheetId={obbSheet.id}
                        productionTarget={lineEfficiencyResource.productionTarget}
                        workingHours={lineEfficiencyResource.workingHours}
                        factoryStartTime={obbSheet.factoryStartTime}
                    />
                </div>
                <div className="col-span-2 row-span-2 col-start-5">
                    <TargetVsAchieveCard
                        obbSheetId={obbSheet.id}
                        target={lineEfficiencyResource.productionTarget}
                    />
                </div>
                <div className="col-start-1 row-start-5">
                    <AchievedProductionCard
                        obbSheetId={obbSheet.id}
                    />
                </div>
                <div className="col-start-2 row-start-5">
                    <EfficiencyCard
                        obbSheetId={obbSheet.id}
                    />
                </div>
                <div className="col-start-3 row-start-5">
                    <RejectionCard
                        obbSheetId={obbSheet.id}
                    />
                </div>
                <div className="col-start-4 row-start-5">
                    <WipCard
                        obbSheetId={obbSheet.id}
                    />
                </div>
                <div className="col-span-2 col-start-5 row-start-4">
                    <DhuCard
                        obbSheetId={obbSheet.id}
                    />
                </div>
                <div className="col-span-2 row-start-5">
                    <PerformanceCard
                        obbSheetId={obbSheet.id}
                        target={lineEfficiencyResource.productionTarget}
                    />
                </div>
            </div>
        </div>
    )
}

export default ObbLineTvDashboard