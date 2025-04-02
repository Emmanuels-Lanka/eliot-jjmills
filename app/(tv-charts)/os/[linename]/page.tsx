import Hmap15CompoOperation from "../../overall-eff/[linename]/_components/hmap-15";
import AnalyticsChart from "./_components/analytics-chart";

const Page = ({ params }: { params: { linename: string } }) => {
    const name = params.linename
    return (
      <div className="h-[300px]  ">
         <AnalyticsChart
                linename={params.linename}
            />
      </div>
    )
  }
  export default Page;


  