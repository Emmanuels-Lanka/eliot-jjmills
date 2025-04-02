"use client"

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDailyData, getDefects, getDHUData, inspaetfetch } from "./actions";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

type ReportData = {
  name: string;
  count: number;
  target: number;
  operatorid: string;
}

export type ReportData1 = {
  id: string;
  operatorid: string;
  operatorname: string;
  operationname: string;
  smv: number;
  target: number;
  efficiency: number;
  achievements: string;
  unitname: string;
  style: string;
  machineid: string;
  linename: string;
  buyer: string;
  seqNo: number;
  inspect: number;
  employeeId: string;
};
type combinedData = {
  count: number;
  id: string;
  linename: string;
  machineid: string;
  name: string;
  operationname: string;
  operatorid: string;
  operatorname: string;
  qc: string;
  style: string;
  target: number;
  unitname: string;
  defectcount: number;
  seqNo: number;
  inspectcount: number;
  employeeId: string;


}
type ReportData2 = {
  defectcount: number;
  operatorid: string;
}
type ReportData3 = {
  inspectcount: number;
  operatorid: string;
}
const DhuReport = ({ obbSheets }: AnalyticsChartProps) => {

  const [date, setDate] = useState<string>("");
  const [dates, setDates] = useState<string>("");
  const [data, setData] = useState<ReportData[]>([]);
  const [data1, setData1] = useState<ReportData1[]>([]);
  const [data2, setData2] = useState<ReportData2[]>([]);
  const [data3, setData3] = useState<ReportData3[]>([]);
  const [combined, setcombined] = useState<combinedData[]>([]);
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<any>(null);


  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
    console.log("date", data.date)
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    const fDate = data.date.toISOString().split('T')[0].toString();
    setDate(formattedDate);
    setDates(fDate);
    setObbSheetId(data.obbSheetId);
  };



  const getDetails = async () => {
    const details = await getDHUData(obbSheetId, date);
    const details1 = await getDailyData(obbSheetId, date);
    const details2 = await getDefects(obbSheetId, date);
    const details3 = await inspaetfetch(obbSheetId, date);


    setData(details);
    setData1(details1);
    setData2(details2);
    setData3(details3);
    console.log("details 3333333333333333", details3)
    const combinedMap = new Map<string, combinedData>();

    for (const detail of details) {
      for (const detail1 of details1) {
        for (const detail2 of details2) {
          for (const detail3 of details3) {
            if (detail.operatorid === detail1.operatorid && detail.operatorid === detail2.operatorid && detail3.inspectcount > 0) {
              const key = detail.operatorid;
              const existing = combinedMap.get(key);

              if (existing) {
                // If a record for this operator already exists, sum the defectcount as numbers
                existing.defectcount += Number(detail2.defectcount);
                // Add an instance number if needed

              } else {
                // Add new record to the map
                combinedMap.set(key, {
                  ...detail,
                  ...detail1,
                  ...detail2,
                  ...detail3,
                  defectcount: Number(detail2.defectcount),  // Ensure defectcount is treated as a number
                  name: `${detail.name}`,    // Include seqNo in the name
                });
              }
            }
          }
        }
      }
    }

    // Convert Map back to array for rendering
    setcombined(Array.from(combinedMap.values()));
  };


  // const getDetails = async () => {
  //   const details = await getDHUData(obbSheetId, date);
  //   const details1 = await getDailyData(obbSheetId, date);
  //   const details2 = await getDefects(obbSheetId, date);

  //   setData(details);
  //   setData1(details1);
  //   setData2(details2);

  //   const combinedMap = new Map<string, combinedData>();
  //   const nameCountMap = new Map<string, number>();  // Track how many times a name appears

  //   for (const detail of details) {
  //     for (const detail1 of details1) {
  //       for (const detail2 of details2) {
  //         if (detail.operatorid === detail1.operatorid && detail.operatorid === detail2.operatorid) {
  //           const key = detail.operatorid;
  //           const existing = combinedMap.get(key);

  //           if (existing) {
  //             // Combine defect counts
  //             existing.defectcount += Number(detail2.defectcount);

  //             // Get the current count for this operator name and increment it
  //             let nameCount = nameCountMap.get(detail.name) || 1;
  //             nameCountMap.set(detail.name, nameCount + 1);

  //             // Append instance number if not already appended
  //             if (nameCount === 2) {
  //               existing.name = `${existing.name} 1&2`;
  //             } else if (nameCount > 2) {
  //               existing.name = `${existing.name.split(" ")[0]} 1&${nameCount}`;
  //             }
  //           } else {
  //             // Initialize new record
  //             combinedMap.set(key, {
  //               ...detail,
  //               ...detail1,
  //               ...detail2,
  //               defectcount: Number(detail2.defectcount),
  //               name: detail.name,  // Just use the name, no seqNo
  //             });

  //             // Initialize count for this name
  //             nameCountMap.set(detail.name, 1);
  //           }
  //         }
  //       }
  //     }
  //   }

  //   // Convert Map back to array for rendering
  //   setcombined(Array.from(combinedMap.values()));
  // };








  useEffect(() => {
    console.log("Combined Data:", combined); // Log combined data
  }, [combined]);


  useEffect(() => {
    getDetails();
  }, [obbSheetId, date]);


  const handlePrint = () => {
    const baseUrl = window.location.origin;
    const printContent = reportRef.current?.innerHTML;
    let selectedDate = new Date(dates);

    // Subtract one day from the selected date
    selectedDate.setDate(selectedDate.getDate());
    const formattedDate = selectedDate.toISOString().split('T')[0];

    const htmlContent = `
      <html>
        <head>
          <title>Operator DHU Report</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
            }
            
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .container {
              width: 100%;
              margin: 0 auto;
              padding: 20px;
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              text-align: center;
              background-color: gray;
            }
            td {
              text-align: left;
            }
            .logo-div {
              text-align: center;
            }
            .logo-div img {
              width: 170px;
              height: auto;
            }
            .text-center {
              text-align: center;
            }
            .footer-logo img {
              width: 120px;
              height: auto;
            }
        
            /* Existing styles here */
          </style>
        </head>
        <body>
           <div class="logo-div">
            <img src="${baseUrl}/ha-meem.png" alt="Ha-Meem Logo" style="margin-top:10px;"/>
            <h5 style="margin-top:10px;">~ Bangladesh ~</h5>
          </div>
          <h1 class="text-center">Operator DHU Report</h1>
          <hr />
          <div>
            <h5>Factory Name: Apparel Gallery LTD</h5>
            <h5>Title: Operator DHU Report</h5>
            <h5>Date: ${formattedDate}</h5>
            <h5>Unit: ${data1[0]?.unitname || ''}</h5>
            <h5>Style Name: ${data1[0]?.style || ''}</h5>
            <h5>Line Name: ${data1[0]?.linename || ''}</h5>
          </div>
          ${printContent}
             <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px;">
            <div>
              <p><a href="https://rfid-tracker.eliot.global/">https://rfid-tracker.eliot.global/</a></p>
            </div>
            <div class="footer-logo">
              <img src="${baseUrl}/logo.png" alt="Company Footer Logo" />
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '', 'width=800,height=600');

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          printWindow.close();
        }, 100);
      };
    } else {
      console.error("Failed to open print window");
    }
  };
  
    
  const handleDownloadPDF = async () => {
    if (!reportRef.current || !data1.length) return;
  
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const canvas = await html2canvas(reportRef.current, {
        scale: 1,
        logging: false,
        useCORS: true,
      } as any);
  
      const imgWidth = 190; // Adjust for margins (A4 width is 210mm, minus 10mm margins on both sides)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let position = 0;
  
      // Split content into multiple pages if necessary
      while (position < canvas.height) {
        const canvasSlice = document.createElement('canvas');
        canvasSlice.width = canvas.width;
        canvasSlice.height = Math.min(canvas.height - position, (pageHeight * canvas.width) / imgWidth);
  
        const ctx = canvasSlice.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            position,
            canvas.width,
            canvasSlice.height,
            0,
            0,
            canvas.width,
            canvasSlice.height
          );
        }
  
        const imgData = canvasSlice.toDataURL('image/png', 0.5);
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, (canvasSlice.height * imgWidth) / canvas.width);
  
        position += canvasSlice.height;
  
        if (position < canvas.height) {
          pdf.addPage(); // Add new page
        }
      }
  
      const fileName = `Operator DHU Report_${data1[0]?.linename}_${dates}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };


    return(
   <>
   <SelectObbSheetAndDate
        obbSheets={obbSheets}
        handleSubmit={handleFetchProductions}
      />
       {data.length>0?(
 <Button className="mt-5" onClick={handleDownloadPDF}>Print</Button>
      ):(
        <></>
      )
    }




      { (obbSheetId && date) &&
      
      <div ref={reportRef} className="container mt-5 mb-10">

        <div className="text-center">
    <img src="/ha-meem.png" alt="Ha-Meem Logo" className="mx-auto w-[120px] h-auto mt-[10px]" />
    <h5 className="mt-[10px]">~ Bangladesh ~</h5>
    <h1 className="text-center">Operator DHU Report</h1>
    <hr className="my-4" />
  </div>


  {/* <h5>Date: ${formattedDate}</h5>
            <h5>Unit: ${data1[0]?.unitname || ''}</h5>
            <h5>Style Name: ${data1[0]?.style || ''}</h5>
            <h5>Line Name: ${data1[0]?.linename || ''}</h5>
          </div> */}

  <div className="flex justify-around mt-5 text-sm mb-5">
    <div className="flex-1 mr-[10px] leading-[1.5]">
      <h5 className="m-0 font-semibold">Factory Name: Apparel Gallery LTD</h5>

      <h5 className="m-0 font-semibold">Unit: {data1[0]?.unitname}</h5>

      <h5 className="font-semibold">Line Name: {data1[0]?.linename}</h5>
    </div>
    <div className="flex-1 justify-around ml-[10px] leading-[1.5]">
      {/* <h5 className="m-0 font-semibold">Buyer: {obbData[0]?.buyer}</h5> */}
      <h5 className="m-0 font-semibold">Style Name: {data1[0]?.style}</h5>
      <h5 className="m-0 font-semibold"> Date: {dates}</h5>
    </div>
  </div>




        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emp ID:</TableHead>
              <TableHead>Operator Name</TableHead>
              <TableHead>Operation Name</TableHead>
              <TableHead>Operated Machine</TableHead>
              <TableHead>No. Of Gmt inspect</TableHead>
              <TableHead>No. Of defects</TableHead>
              <TableHead>DHU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combined.map((d, rid) => (
              <TableRow key={rid}>
                <TableCell className="px-2 py-2">{d.employeeId}</TableCell>
                <TableCell className="px-2 py-2">{d.name}</TableCell>
                <TableCell className="px-2 py-2">{d.operationname}</TableCell>
                <TableCell className="px-2 py-2">{d.machineid}</TableCell>
                <TableCell className="px-2 py-2">{d.inspectcount}</TableCell>
                <TableCell className="px-2 py-2">{d.defectcount}</TableCell>
                <TableCell className="px-2 py-2">{d.count.toFixed(2)}</TableCell>
                              
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-12">
  <div>
    <p>
      <a href="https://www.portal.eliot.global/" className="text-blue-500 hover:underline">
        https://www.portal.eliot.global/
      </a>
    </p>
  </div>
  <div className="footer-logo">
    <img src="/eliot-logo.png" alt="Company Footer Logo" className="w-[120px] h-auto" />
  </div>
</div>
      </div>}
   </>
    )
}

export default DhuReport