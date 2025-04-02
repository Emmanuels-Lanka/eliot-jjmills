import TVACompo from "./_components/target-vs-actual";

const Page = ({ params }: { params: { linename: string } }) => {
  const name = params.linename
  return (
    <div className="h-[300px]  ">
      <TVACompo linename={params.linename}/>
    </div>
  )
}
export default Page;