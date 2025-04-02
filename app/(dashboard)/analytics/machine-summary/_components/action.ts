"use server";
import { ProductionDataType } from "./LogTable";
import { poolForPortal } from "@/lib/postgres";


export async function getData(obbsheetid:string,date:string,unitId:string)  : Promise<ProductionDataType[]>   {
    try {
  
        const query = `
         SELECT 
    COUNT(*) AS count, 
    sm."machineType" AS type, 
    pl.name AS lineName,
    COUNT(CASE WHEN sm."isAssigned" = false THEN 1 END) AS notAssigned, 
    CAST(COUNT(*) + COUNT(CASE WHEN sm."isAssigned" = false THEN 1 END) AS INT) AS total
FROM 
    "SewingMachine" sm
INNER JOIN 
    "ObbOperation" oo ON oo."sewingMachineId" = sm.id
INNER JOIN 
    "ObbSheet" os ON os.id = oo."obbSheetId"
INNER JOIN 
    "ProductionLine" pl ON pl.id = os."productionLineId" 
INNER JOIN 
    "Unit" u ON u.id = pl."unitId"
    where u.name=$1
GROUP BY 
    sm."machineType", pl.name;
        `;
        const values = [unitId];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ProductionDataType[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
   
  
}
export async function getDatas(obbsheetid:string,date:string)  : Promise<ProductionDataType[]>   {
  
    try {
  
        const query = `
         Select count(*),"machineType" as type
from "SewingMachine" sm
inner join "ObbOperation" oo ON oo."sewingMachineId" = sm.id
inner join "ObbSheet" os ON os.id = oo."obbSheetId"
inner join "ProductionLine" pl on pl.id = os."productionLineId" 
group by type
        `;
        // const values = [obbSheet];
    
        const result = await poolForPortal.query(query);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ProductionDataType[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
  

}




