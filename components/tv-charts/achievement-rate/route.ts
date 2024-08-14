"use server";
import { neon } from "@neondatabase/serverless";

export async function getData(linename:string){
  const sql = neon(process.env.DATABASE_URL || "");

  const data = await sql`
  SELECT oo.id
  FROM "ProductionLine" pl 
  INNER JOIN "ObbSheet" oo 
  ON pl.id = oo."productionLineId"
  WHERE oo."isActive"=true and pl.id=${linename}
  order by oo."updatedAt" asc
`;

  console.log("data",data.length)
  
  if(data.length>0){
    return new Promise((resolve) => resolve(data[0].id))

  }
  else{
  return new Promise((resolve) => resolve("0"))
   
  }
}