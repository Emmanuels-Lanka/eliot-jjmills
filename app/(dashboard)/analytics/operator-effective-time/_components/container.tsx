"use client"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { DataTable } from './data-table';

const Container = ({ columns, data }: any) => {
  // const tableRef = useRef<HTMLDivElement>(null);

  // const generatePDF = async () => {
  //   const doc = new jsPDF('p', 'mm', 'a4');
  //   const pageHeight = doc.internal.pageSize.height;
  //   const pageWidth = doc.internal.pageSize.width;
  //   let currentHeight = 0;
  
  //   if (tableRef.current) {
  //     // Temporarily increase the width of the table to capture all columns
  //     tableRef.current.style.width = '2000px'; // Adjust this width based on your table size
  
  //     const canvas = await html2canvas(tableRef.current, {
  //       useCORS: true, // If necessary for cross-origin images
  //     });
  
  //     // Reset the width back after capturing the canvas
  //     tableRef.current.style.width = '';
  
  //     const imgData = canvas.toDataURL('image/png');
  //     const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
  //     // Add image to PDF, handling large content by splitting it across pages
  //     while (currentHeight < canvas.height) {
  //       const pageCanvas = document.createElement('canvas');
  //       const pageContext = pageCanvas.getContext('2d');
  
  //       pageCanvas.width = canvas.width;
  //       pageCanvas.height = pageHeight * (canvas.width / pageWidth);
  
  //       if (pageContext) {
  //         pageContext.drawImage(
  //           canvas,
  //           0, // Source X
  //           currentHeight, // Source Y
  //           canvas.width, // Source Width
  //           pageHeight * (canvas.width / pageWidth), // Source Height
  //           0, // Destination X
  //           0, // Destination Y
  //           pageCanvas.width, // Destination Width
  //           pageCanvas.height // Destination Height
  //         );
  //       }
  
  //       const pageImgData = pageCanvas.toDataURL('image/png');
  //       doc.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight);
  
  //       currentHeight += pageHeight * (canvas.width / pageWidth);
  
  //       if (currentHeight < canvas.height) {
  //         doc.addPage();
  //       }
  //     }
  
  //     doc.save('table.pdf');
  //   }
  // };
  const tableRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    let currentHeight = 0;
  
    if (tableRef.current) {
      // Select the columns to hide
      const hideColumns = tableRef.current.querySelectorAll(
        'th:nth-child(n+5), td:nth-child(n+5)' // Change `n+5` if more columns should be hidden
      );
  
      
      // Hide the unwanted columns
      hideColumns.forEach((col) => {
        (col as HTMLElement).style.display = 'none';
      });

      const inputs = tableRef.current.querySelectorAll('input');
      inputs.forEach((input) => {
        const span = document.createElement('span');
        input.textContent = (input as HTMLInputElement).value;
        input.style.padding = '4px'; // You can style it to make it look like the input field
        input.replaceWith(input);
      });
  

   
      // Temporarily increase the width of the table to capture all visible columns
      const tableElement = tableRef.current as HTMLElement;
      tableElement.style.width = 'auto'; // or a specific width that fits the columns
  
      const canvas = await html2canvas(tableElement, {
        useCORS: true, // If necessary for cross-origin images
      });
  
      // Reset the column visibility after capturing the canvas
      hideColumns.forEach((col) => {
        (col as HTMLElement).style.display = '';
      });
  
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
      // Add image to PDF, handling large content by splitting it across pages
      while (currentHeight < canvas.height) {
        const pageCanvas = document.createElement('canvas');
        const pageContext = pageCanvas.getContext('2d');
  
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeight * (canvas.width / pageWidth);
  
        if (pageContext) {
          pageContext.drawImage(
            canvas,
            0, // Source X
            currentHeight, // Source Y
            canvas.width, // Source Width
            pageHeight * (canvas.width / pageWidth), // Source Height
            0, // Destination X
            0, // Destination Y
            pageCanvas.width, // Destination Width
            pageCanvas.height // Destination Height
          );
        }
  
        const pageImgData = pageCanvas.toDataURL('image/png');
        doc.addImage(pageImgData, 'PNG', 0, 0, pageWidth, pageHeight);
  
        currentHeight += pageHeight * (canvas.width / pageWidth);
  
        if (currentHeight < canvas.height) {
          doc.addPage();
        }
      }
  
      doc.save('table.pdf');
    }
  };
  
  return (
    <div>
      
      <div ref={tableRef}>
        <DataTable columns={columns} data={data} generatePDF={generatePDF}/>
      </div>
    </div>
  );
};

export default Container;
