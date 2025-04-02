import { db } from '@/lib/db';
import AnalyticsChart from './components/analytics-chart';
import { VerticalGraph } from './components/vertical-graph';
import { StackedComponent } from './components/stacked-graph';
import SelectObbSheetDateOperation from './components/select-obbsheet-date-operation';
// import VerticalGraph from './components/vertical-graph';


  

const page = async() => {
    const obbSheets = await db.obbSheet.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true
        }
    });
    

    return (
        <div>
            <AnalyticsChart
                obbSheets={obbSheets}
                title='Daily Efficiency Chart'
            />
           
            {/* <StackedComponent></StackedComponent> */}
        </div>
    )
}

export default page;