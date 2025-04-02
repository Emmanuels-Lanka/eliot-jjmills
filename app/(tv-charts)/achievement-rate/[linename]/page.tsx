import AchievementRate from "@/components/tv-charts/achievement-rate/tv-achievement-rate";

const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename
  return (
    <div className="h-[300px]  ">

      <AchievementRate linename={params.linename} />
    </div>
  )
}
export default Page;