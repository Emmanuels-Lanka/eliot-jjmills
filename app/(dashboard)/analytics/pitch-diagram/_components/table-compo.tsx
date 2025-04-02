import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";


  export interface TableProps {
    tableProp: any[];
    date:string;
    chartRef: React.RefObject<any>;
    flag:boolean;
    setFlag: (value: boolean) => void;
    
}
export const TableDemo = ({ tableProp, date, chartRef ,flag,setFlag}: TableProps) => {

  const reportRef = useRef<HTMLDivElement | null>(null);
  // const reportRef2 = useRef<HTMLDivElement | null>(null);



  const handlePrint = () => {
    
    console.log("ad",tableProp)
    const baseUrl = window.location.origin;
    const printContent = reportRef.current?.innerHTML;
    const footer = chartRef.current?.innerHTML;
    // let selectedDate = new Date(date);
  
    // Subtract one day from the selected date
    // selectedDate.setDate(selectedDate.getDate());
  
    // Format the adjusted date back to a string
    // const formattedDate = selectedDate.toISOString().split('T')[0];
    const formattedDate = date
    
    const htmlContent = `
      <html>
        <head>
          <title>Pitch Diagram</title>
          <style>
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
          </style>
        </head>
        <body>
          <div class="logo-div">
            <img src="${baseUrl}/ha-meem.png" alt="Ha-Meem Logo" style="margin-top:10px;"/>
            <h5 style="margin-top:10px;">~ Bangladesh ~</h5>
          </div>
          <h1 class="text-center">Pitch Diagram</h1>
          <hr />
          <div>
            <h5>Factory Name: Apparel Gallery LTD</h5>
            <h5>Title: Pitch Diagram</h5>
            <h5>Style: ${tableProp[0].obb}</h5>
          
          </div>
          ${printContent}
          ${footer}

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
        URL.revokeObjectURL(url);
      };
    } else {
      console.error("Failed to open print window");
    }
  };



    console.log("td",tableProp)



    useEffect(() => {
     if(flag)
      setTimeout(() => {
        handlePrint();
        setFlag(false); // Reset the flag if needed
      }, 100);
     

    }, [flag])
    




    return (

    <div>
      <div>
      {/* {true && (
        <Button className="" onClick={handlePrint}>
          Download as PDF
        </Button>
      )} */}
      </div>
      
      <div ref={reportRef} className="mt-5 mb-10">
      <Table>
       
        {/* <TableCaption>LINE EFFICIENCY.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">SeqNo</TableHead>
            <TableHead className="text-center" >Operation</TableHead>
            <TableHead className="text-right">Target </TableHead>
            <TableHead className="text-right">Standard Minute Value </TableHead>
            {/* <TableHead className="text-right">Personal Allowance </TableHead>
            <TableHead className="text-right">Capacity Target</TableHead>
            <TableHead className="text-right">Actual Capacity </TableHead> */}
            {/* <TableHead>On Stand Efficiency </TableHead> */}
            {/* <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableProp.map((invoice,index) => (
            <TableRow key={index}>
              
              <TableCell className="text-right">{invoice.seqNo}</TableCell>
              <TableCell className="font-medium">{invoice.nameOnly}</TableCell>

              <TableCell className="text-right">{invoice.target}</TableCell>
              <TableCell className="text-right">{invoice.smv}</TableCell>
              {/* <TableCell className="text-right">{invoice.personalAllowance}</TableCell>
              <TableCell className="text-right">{invoice.target}</TableCell>
              <TableCell className="text-right">{invoice.capacity}</TableCell> */}
              {/* <TableCell className="text-right">{invoice.onStndEff}</TableCell> */}
              {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
      </div>
    
    </div>
    )
  }
  