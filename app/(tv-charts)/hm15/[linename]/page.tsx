import Hmap15Compo from "./_components/hmap-15";

const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename
  return (
    <div className="h-[300px]  ">
      <Hmap15Compo linename={params.linename}/>
    </div>
  )
}
export default Page;