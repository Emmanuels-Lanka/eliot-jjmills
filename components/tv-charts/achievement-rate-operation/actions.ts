"use server";
import { createPostgresClient } from "@/lib/postgres";

export async function getObbSheetID(linename: string): Promise<string> {

  
  {
    const client = createPostgresClient();
try {

  await client.connect();
  const query = `
     SELECT oo.id
  FROM "ProductionLine" pl 
  INNER JOIN "ObbSheet" oo 
  ON pl.id = oo."productionLineId"
  WHERE oo."isActive"=true and pl.name=$1
  order by oo."createdAt" desc
  `;
  const values = [linename];

  const result = await client.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows[0].id));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  await client.end()
}
}

}


export async function getUnitID(unit: string): Promise<string> {

  
  {
    const client = createPostgresClient();
try {

  await client.connect();
  const query = `
     SELECT name from "Unit" where id=$1
  `;
  const values = [unit];

  const result = await client.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows[0].name));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  await client.end()
}
}

}


export async function getLinebyOS(linename: string): Promise<string > {

  
  {
    const client = createPostgresClient();
try {

  await client.connect();
  const query = `
    select concat(pl.name , ' - ',"os"."style") as name from "ProductionLine" pl
    inner join "ObbSheet" os on os."productionLineId" = pl.id
    where os.id=$1
  `;
  const values = [linename];

  const result = await client.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows[0].name as string));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  await client.end()
}
}

}
export async function getLine(linename: string): Promise<string > {

  
  {
    const client = createPostgresClient();
try {

  await client.connect();
  const query = `
    select pl.name from "ProductionLine" pl
where pl.id =$1
  `;
  const values = [linename];

  const result = await client.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows[0].name as string));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  await client.end()
}
}

}
