import AnalyticsChart from "./_components/analytics-chart";



const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename
  return (
    <div className="h-full w-full bg-gradient-to-tr from-black to-slate-600  ">
      <AnalyticsChart linename={params.linename}/>
    </div>
  )
}
export default Page;