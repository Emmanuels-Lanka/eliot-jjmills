"use server";
import { poolForPortal, poolForRFID } from "@/lib/postgres";


export async function getData()  : Promise<any[]>{

    try {
  
        const query = `
       select os.id,"factoryStartTime" start from "ProductionData" pd
inner join "ObbOperation" oo on oo.id = pd."obbOperationId"
inner join "ObbSheet" os on os.id = oo."obbSheetId"
where pd.timestamp like '2024-12-12%' and  oo."obbSheetId" = 'm3les5hd-0QqhlRye5b56'
group by os.id,start
        `;
        // const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
}

export async function getDataRfid()  : Promise<any[]>{


    try {
  
        const query = `
       select count(pd."productId"),ler."totalSMV","obbManPowers",ler."obbSheetId" obbSheetId from "ProductDefect" pd
inner join "LineEfficiencyResources" ler on ler."obbSheetId" = pd."obbSheetId"

where timestamp  like  '2024-12-12%'  and pd."qcStatus" = 'pass' and pd."obbSheetId" ='m3les5hd-0QqhlRye5b56'
and pd."part" = 'line-end'

group by ler."totalSMV","obbManPowers",ler."obbSheetId"
        `;
        // const values = [obbsheetid,date];
    
        const result = await poolForRFID.query(query);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }



}
