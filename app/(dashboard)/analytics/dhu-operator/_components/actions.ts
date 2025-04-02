"use server";

import { poolForRFID } from "@/lib/postgres";


type defects= {
    count:number;
    operator:string;
    part:string
}
type defcount= {
    total:number;

}

export async function getChecked(date:string,obbSheet:string) : Promise<defcount>   {
    {
       
      try {
    
  
        const query = `
     WITH counts AS (
    SELECT COUNT(*) AS gmt_count FROM "GmtDefect" gd WHERE gd.timestamp LIKE $2 
    and "obbSheetId" = $1
    UNION ALL
    SELECT COUNT(*) AS product_count FROM "ProductDefect" pd WHERE pd.timestamp LIKE $2
    and "obbSheetId" = $1
)
SELECT SUM(gmt_count) AS total FROM counts;
        `;
        const values = [obbSheet,date];
    
        const result = await poolForRFID.query(query, values);

        const total = result.rows[0]?.total || 0;
    
        // console.log("DATAaa: ", result.rows);
        return { total } as defcount;
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{

      }}



}
export async function getDefects(date:string,obbSheet:string) : Promise<defects []>   {

    {
       
      try {
    

        const query = `
          select count(*),"operatorName" as operator,part from "GmtDefect" 
where timestamp like $2 and "obbSheetId" = $1
and "qcStatus" <> 'pass'
group by operator,part
union
select count(*),"operatorName" as operator,part  from "ProductDefect"
where "qcStatus" <> 'pass' and  timestamp like $2 and "obbSheetId" = $1
group by operator,part
        `;
        const values = [obbSheet,date];
    
        const result = await poolForRFID.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as defects[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
       
      }}




}
