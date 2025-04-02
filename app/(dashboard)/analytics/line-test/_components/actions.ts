"use server";
import { DataRecord, EfficiencyData } from "./barchart";
import { ObbSheet } from "@prisma/client";
import { poolForPortal } from "@/lib/postgres";


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

export type ProdData = {
  operation: string;
  operatorRfid: string;
  seqNo: number;
  smv: number;
  sum: string;
};
export type LogData = {
  eid: string;
  logout: string;
  login: string;
  name: string;
  offstandtime: string;
  operatorRfid: string;
};

export type OperatorRfidData = {

    operatorRfid: string;

    login: string;

    logout: string;

    offstandtime: string;

    name: string;

    sum: number;

    operation: string;

    smv: number;
    eid:string;
    seqNo : string

};

export async function getObb(unit:any) : Promise<{ id: string; name: string }[]>  {
  

   
    try {
  
  
      const query = `
        SELECT os.name AS name, os.id AS id 
        FROM "ObbSheet" os
        INNER JOIN "Unit" u ON u.id = os."unitId"
        WHERE os."unitId" = $1 AND os."isActive"
        ORDER BY os."createdAt" DESC
      `;
      const values = [unit];
  
      const result = await poolForPortal.query(query, values);
  
      console.log("DATAaa: ", result.rows);
      return new Promise((resolve) => resolve(result.rows as { id: string; name: string }[]));
      
      
    } catch (error) {
      console.error("[TEST_ERROR]", error);
      throw error;
    }
    finally{
 
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

    console.log("DATAaa: ", result.rows);
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
    const values = [];

    const result = await poolForPortal.query(query);

    console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows as { id: string; name: string }[]));
    
    
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

    console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows as DataRecord[]));
    
    
  } catch (error) {
    console.error("[TEST_ERROR]", error);
    throw error;
  }
    
}

export async function getLogin(date:string,obbSheet:string) : Promise<LogData[]>  {
    // date:string,obbSheet:string

    console.log(date+"%",obbSheet)
    {
       
      try {
    
    
        const query = `
       select oet."operatorRfid",o.name,o."employeeId" eid,MIN(oet."loginTimestamp") login,
MAX(oet."logoutTimestamp")logout,MAX(oet."offStandTime") offStandTime
from "OperatorEffectiveTime" oet
inner join "Operator" o on o.rfid = oet."operatorRfid"
where oet."loginTimestamp" like $1 and oet."logoutTimestamp" is not null
group by oet."operatorRfid",o.name, eid
        `;
        const values = [date+"%"];
    
        const result = await poolForPortal.query(query,values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as LogData[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
   
      }}



}
export async function getNew(date:string,obbSheet:string) : Promise<ProdData[]>  {
    // date:string,obbSheet:string

    // console.log(date+"%",obbSheet)
    {
       
      try {
    
    
        const query = `
       select pd."operatorRfid",sum(pd."productionCount"),o.name operation,oo.smv,
oo."seqNo" from "ProductionData" pd
inner join "ObbOperation" oo on oo.id = pd."obbOperationId"
inner join "Operation" o on o.id = oo."operationId"
where pd.timestamp like $2 and
oo."obbSheetId" = $1


group by pd."operatorRfid" ,o.name,oo.smv,oo."seqNo"

HAVING 
    SUM(pd."productionCount") > 0
        `;
        const values = [obbSheet,date+"%"];
    
        const result = await poolForPortal.query(query,values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ProdData[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
   
      }}



}



export async function getFinalData(date:string,obbSheet:string) : Promise<OperatorRfidData[]>  {
    // date:string,obbSheet:string

    // console.log(date+"%",obbSheet)
    {
       
      try {
    
    
        const query = `
       select oet."operatorRfid", MIN(oet."loginTimestamp") AS login,
    MAX(oet."logoutTimestamp") AS logout,oet."offStandTime",o.name,
    sum(pd."productionCount"),opn.name operation,oo.smv,o."employeeId" eid,oo."seqNo"
    
    from "OperatorEffectiveTime" oet
inner join "Operator" o on o."rfid" = oet."operatorRfid"
inner join "ProductionData" pd on pd."operatorRfid" = o."rfid"
inner join "ObbOperation" oo on oo."id" = pd."obbOperationId"
inner join "Operation" opn on opn."id" = oo."operationId"



where oet."loginTimestamp" like $2 and pd."timestamp" like $2 
and oo."obbSheetId" = $1 AND oet."logoutTimestamp" IS NOT NULL

group by oet."operatorRfid",oet."offStandTime",o.name,operation,oo.smv,eid,oo."seqNo"
order by eid desc
        `;
        const values = [obbSheet,date+"%"];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as OperatorRfidData[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
   
      }}



}