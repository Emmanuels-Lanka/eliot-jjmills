import AnalyticsChartHmap15 from "./_components/analytics";





const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename
  return (
    <div className="h-[300px]  ">
      <AnalyticsChartHmap15 linename={params.linename}/>
    </div>
  )
}
export default Page;