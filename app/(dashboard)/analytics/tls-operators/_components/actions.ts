"use server";
import { poolForRFID } from "@/lib/postgres";


export async function   getDHUData(obbsheetid:string,date:string) :Promise<any[]>   {
 

    //console.log("dara",obbsheetid,"",date)
    // const dataGmts = await sql`select count(*) as count ,"qcStatus" qc, "operatorName" as name from "GmtDefect"
    // WHERE "qcStatus" <> 'pass' AND "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}
    // group by "operatorName","qcStatus";`;
    // console.log("data fetched1",dataGmts)

    const datag = `select count(*) as count ,"qcStatus" qc, "operatorName" as name from "GmtDefect"
    WHERE "qcStatus" <> 'pass' AND "obbSheetId"= $1 AND timestamp LIKE $2
    group by "operatorName","qcStatus";
            `;
    const values = [obbsheetid,date];
    const result = await poolForRFID.query(datag,values);
const dataGmts = result.rows
    

    // const dataProducts = await sql`select count(*) as count ,"qcStatus" qc, "operatorName" as name 
    // from "ProductDefect"
    // WHERE "qcStatus" <> 'pass' AND "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}
    // group by "operatorName","qcStatus";`;

    const datap = `select count(*) as count ,"qcStatus" qc, "operatorName" as name 
    from "ProductDefect"
    WHERE "qcStatus" <> 'pass' AND "obbSheetId"= $1 AND timestamp LIKE $2
    group by "operatorName","qcStatus";`

    const values2 = [obbsheetid,date];
    const result2 = await poolForRFID.query(datap,values2);
const dataProducts = result2.rows

    console.log("data fetched2",dataProducts)
    console.log("length1",dataProducts.length)



    // const tc = await sql`select count(*) as count from "GmtDefect"
    // WHERE "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}`;

    const datatc = `select count(*) as count from "GmtDefect"
    WHERE "obbSheetId"= $1 AND timestamp LIKE $2`

    const values3 = [obbsheetid,date];
    const result3 = await poolForRFID.query(datap,values3);
const tc = result2.rows

    // const tcProducts = await sql`select count(*) as count from "ProductDefect"
    // WHERE "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}`;

    const tcp = `select count(*) as count from "ProductDefect"
    WHERE "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}`

    const values4 = [obbsheetid,date];
    const result4 = await poolForRFID.query(datap,values4);
const tcProducts = result2.rows

    // console.log("data fetched",data)
    console.log("Row Count",tc)
    const count  : number = Number(tc?.[0]?.count) ?? 1
    const countP  : number = Number(tcProducts?.[0]?.count) ?? 1

    //make 2 arrays in to one
    
    const updatedGmtDfcts :any[] = []
    
    for(const gmtdfct of dataGmts){
        const tmpIndex = dataProducts.findIndex(p=> p.name == gmtdfct.name)
      
        if(tmpIndex !=-1){
            const tmp = dataProducts[tmpIndex]
            console.log("tmp",tmp)
            updatedGmtDfcts.push({...gmtdfct,count:tmp.count + gmtdfct.count,})
            dataProducts.splice(tmpIndex,1)
        }else{
            updatedGmtDfcts.push( gmtdfct )
        }



    }
   
    console.log("length2",dataProducts.length)

    for(const prdDfct of dataProducts){
        updatedGmtDfcts.push(prdDfct)
    }



    const res= updatedGmtDfcts.map((d)=>(
        {
            ...d,count:(d.count/(count + countP))*100
        }
    ))



 
    return new Promise((resolve) => resolve(res  ))
}