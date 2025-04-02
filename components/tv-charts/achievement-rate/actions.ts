"use server";
import { poolForPortal } from "@/lib/postgres";

export async function getData(linename:string) :Promise<string>{


  try {
  
    const query = `
   SELECT oo.id
  FROM "ProductionLine" pl 
  INNER JOIN "ObbSheet" oo 
  ON pl.id = oo."productionLineId"
  WHERE oo."isActive"=true and pl.name=$1
  order by oo."updatedAt" asc
    `;
    const values = [linename];

    const result = await poolForPortal.query(query,values);

    // console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows[0].id));
    
    
  } catch (error) {
    console.error("[TEST_ERROR]", error);
    throw error;
  }



  
}