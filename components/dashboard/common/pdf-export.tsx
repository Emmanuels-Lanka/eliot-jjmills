import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFExportProps {
  chartRef: React.RefObject<HTMLDivElement>;
  title: string;
}

const PDFExport: React.FC<PDFExportProps> = ({ chartRef, title }) => {
  const saveAsPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height + 150],
      });

      const baseUrl = window.location.origin;
      const logoUrl = `${baseUrl}/logo.png`;

      const logo = new Image();
      logo.src = logoUrl;
      logo.onload = () => {
        const logoWidth = 110;
        const logoHeight = 50;
        const logoX = (canvas.width / 2) - (logoWidth + 250); // Adjust to place the logo before the text
        const logoY = 50;

        // Add the logo to the PDF
        pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

        // Set text color to blue
        pdf.setTextColor(0, 113, 193); // RGB for blue

        // Set larger font size and align text with the logo
        pdf.setFontSize(30);
        pdf.text(title, logoX + logoWidth + 10, 83, { align: 'left' });

        // Add the chart image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);

        // Save the PDF
        pdf.save(`${title}.pdf`);
      };
    }
  };

  return (
    <button type="button" className="mr-3" onClick={saveAsPDF}>
      Save as PDF
    </button>
  );
};

export default PDFExport;
