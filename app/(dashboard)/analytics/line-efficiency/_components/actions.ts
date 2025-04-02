"use server";
import { DataRecord, EfficiencyData } from "./barchart";
import { ObbSheet } from "@prisma/client";
import { poolForPortal, poolForRFID } from "@/lib/postgres";

type defects= {
    count:number;
    operator:string;
    part:string
}
type defcount= {
    total:number;

}

type obb = ObbSheet &{
    unit:string;
    line:string

}

export async function getChecked(date:string,obbSheet:string) : Promise<defcount>   {
    
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
    
        // console.log("DATAaa: ", result.rows);
        const total = result.rows[0]?.total || 0;
    
return { total } as defcount;
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }


}
export async function getDefects(date:string,obbSheet:string) : Promise<defects []>   {

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
   
}
export async function getData(date:string,obbSheet:string) : Promise<any []>   {



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
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
    
}

export async function getObbData(obbSheet:string) : Promise< obb[]>  {

    try {
  
        const query = `
           select u.name unit, pl."name" line,os.* from "Unit" u
inner join "ProductionLine" pl on pl."unitId" = u.id
inner join "ObbSheet" os on os."productionLineId" = pl.id
where os.id = $1
        `;
        const values = [obbSheet];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as obb[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }

}
export async function getUnit() : Promise<{ id: string; name: string }[]>  {

    try {
  
        const query = `
         select id as id , name as name from "Unit" u 


 order by "createdAt" desc
        `;
        // const values = [obbSheet];
    
        const result = await poolForPortal.query(query);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as obb[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
    

}

export async function getEfficiencyData(date:string) : Promise<EfficiencyData[]>  {

    try {
  
        const query = `
          select "operatorRfid",o.name name,MIN("loginTimestamp") login,max("logoutTimestamp") logout,"offStandTime" from "OperatorEffectiveTime" oet
    inner join "Operator" o on o."rfid" = oet."operatorRfid"
    where "loginTimestamp" like $1 and "logoutTimestamp" IS NOT NULL
    group by "operatorRfid","offStandTime",o.name
    order by "operatorRfid"
        `;
        const values = [date+"%"];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as EfficiencyData[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }

}
export async function getProducts(date:string,obbSheet:string) : Promise<DataRecord[]>  {

    try {
  
        const query = `
        select oo."seqNo",pd."operatorRfid",o.name name,opn."name" operation,oo.smv,sum(pd."productionCount") count,oo."obbSheetId" from "ProductionData" pd 
inner join "Operator" o on o.rfid = pd."operatorRfid"
inner join "ObbOperation" oo on oo.id = pd."obbOperationId"
inner join "Operation" opn on opn.id = oo."operationId"
INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id 
where pd.timestamp like $1 and os.id = $2
group by pd."operatorRfid",o.name,oo.smv,oo."seqNo",opn."name",oo."obbSheetId"
order by oo."seqNo"
        `;
        const values = [date+"%",obbSheet];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as DataRecord[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
    
}