import AnalyticsChart from "./_components/analytics-chart";



const Page = ({ params }: { params: { unit: string } }) => {
  const name = params.unit
  return (
    <div className="h-[300px]  ">
      <AnalyticsChart unit={params.unit}/>
    </div>
  )
}
export default Page;