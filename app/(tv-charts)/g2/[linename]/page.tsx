import AchievementRateOperation from "./_components/tv-achievement-rate-operation";

const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename
  return (
    <div className="h-[300px]  ">
      <AchievementRateOperation linename={params.linename}/>
    </div>
  )
}
export default Page;