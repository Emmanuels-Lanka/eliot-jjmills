import EfficiencyAnalyticsChart from "./_components/analytics-chart"


const AchivementRateoperation = async ({ params }: { params: { linename: string } }) => {
    

    return (
        <div>
            <EfficiencyAnalyticsChart linename={params.linename}>

            </EfficiencyAnalyticsChart>
           
        </div>
    )
}

export default AchivementRateoperation