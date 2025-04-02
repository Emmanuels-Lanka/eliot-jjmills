import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import  { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface EffiencyHeatmapProps {
    xAxisLabel: string;
    height: number;
    efficiencyLow?: number;
    efficiencyHigh?: number;
    heatmapData: OperationEfficiencyOutputTypes;
}

const EffiencyHeatmap = ({
    xAxisLabel,
    efficiencyLow = 70,
    efficiencyHigh = 80,
    heatmapData
}: EffiencyHeatmapProps) => {
    const categories = heatmapData.categories || [];
    const machines= heatmapData.machines|| [];
    const eliot = heatmapData.eliot || [];

    let series: { name: string; data: (number | null)[] }[] = heatmapData.data.map(hourGroup => ({
        name: hourGroup.hourGroup,
        data: hourGroup.operation.map(op => op.efficiency === null ? -1 : op.efficiency)
    }));

    const chartRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<any>([]);

    const exportToCSV = () => {
      // Create an object where each key is a category (row) and contains an object with hour groups as columns
      const transposedData = categories.reduce((acc, category, categoryIndex) => {
        acc[category] = {
            Category: category,
            'Machine ID': machines[categoryIndex] || '',  // Add Machine ID column
            'Eliot ID': eliot[categoryIndex] || '',  // Add Machine ID column
            ...series.reduce((hourAcc, serie) => {
                hourAcc[serie.name] = serie.data[categoryIndex];
                return hourAcc;
            }, {} as Record<string, number | null>)
        };
        return acc;
    }, {} as Record<string, any>); 

      // Convert the object to an array for XLSX
      const csvData = Object.values(transposedData);

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "HeatmapData");
      
      // Save file
      XLSX.writeFile(wb, "heatmap-data.csv");
  };
    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex ,w }:{series:any, seriesIndex:any, dataPointIndex:any,w:any}) {

              const value = series[seriesIndex][dataPointIndex];
              const category = w.globals.categoryLabels[dataPointIndex];
              const eliotDevice = value.eliotid;
              return `<div style="padding: 10px; color: #000;">
                       
                      
                        <strong>Machine Id: </strong> ${heatmapData.machines && heatmapData.machines[dataPointIndex]} <br/>
                        <strong>Sewing Id: </strong> ${heatmapData.eliot && heatmapData.eliot[dataPointIndex]} <br/>
                
                         
                      </div>`;
            },
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: 24,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: -10,
                            to: 0,
                            name: 'No Data',
                            color: '#FFFFFF'
                        },
                        {
                            from: 1,
                            to: 50000,
                            name: 'Nuber of Products',
                            color: '#0171c1'
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            }
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            title: {
                text: xAxisLabel,
                style: {
                    color: '#0070c0',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                }
            },
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                }, rotate: -90,
                minHeight: 250,
            },
            categories: categories,
        
           
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
        },
    };

   

    const saveAsPDF = async () => {
        if (chartRef.current) {
          // Get the SVG from the ApexChart
          const svg = chartRef.current.querySelector("svg");
          
          if (!svg) {
            console.error("SVG not found");
            return;
          }
      
          // Create a canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
      
          // Set the canvas dimensions
          const svgRect = svg.getBoundingClientRect();
          canvas.width = svgRect.width;
          canvas.height = svgRect.height;
      
          // Create an image from the SVG data
          const svgData = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          img.src = "data:image/svg+xml;base64," + window.btoa(svgData);
      
          img.onload = () => {
            context?.drawImage(img, 0, 0);
      
            // Convert the canvas to an image
            const imgData = canvas.toDataURL("image/png");
      
            // Initialize jsPDF
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [canvas.width, canvas.height + 150],
            });
      
            // Add the image to the PDF
            pdf.addImage(imgData, "PNG", 0, 150, canvas.width, canvas.height);

             const baseUrl = window.location.origin;
          const logoUrl = `${baseUrl}/logo.png`;
      
         const logo = new Image();
      logo.src = logoUrl;
    // //       logo.onload = () => {
             const logoWidth = 110; 
             const logoHeight = 50;
             const logoX = (canvas.width / 2) - (logoWidth + 250); // Adjust to place the logo before the text
             const logoY = 50;
      
    // //         // Add the logo to the PDF
          pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      
    // //         // Set text color to blue
         pdf.setTextColor(0, 113 ,193); // RGB for blue
      
    // //         // Set larger font size and align text with the logo
            pdf.setFontSize(30);
            pdf.text('Dashboard - Operation Efficiency (60) ', logoX + logoWidth + 10, 83, { align: 'left' });
      
    // //         // Add the chart image to the PDF
             pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);
      
            // Add your title or logo here, as you did before
      
            // Save the PDF
            pdf.save("chart.pdf");
          };
        }
      };
      const saveAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(chartData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
        XLSX.writeFile(workbook, `chart-data.xlsx`);
    };





 // const width: string = heatmapData.categories.length < 15 ? '100%' :heatmapData.categories.length < 21 ? '100%' : heatmapData.categories.length < 30 ? '100%' : '500%';

    // let nwidth = heatmapData && heatmapData?.categories.length > 15  ? 3000 : 100+"%"; 
    // let nheight = heatmapData && heatmapData?.categories.length < 15  ? 900 : 900



    let height = 800
    const chartWidth = heatmapData && heatmapData.categories.length > 0 ? heatmapData.categories.length * 100 : 1000;
    const width = heatmapData && heatmapData.categories.length > 0 ?heatmapData.categories.length * 60 : 600;
    return (
        // <div className='bg-slate-100 pt-5 pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>
                    <div>
                    <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-[500px] mb-16 overflow-scroll'>

            <div id="chart"  ref={chartRef}>
                <ReactApexChart options={options} series={series} type="heatmap" height={height} width={width} />
            </div>
            <div id="html-dist"></div>
 

        </div>
        {/* Button Section */}
 {true && (
      <div className="flex flex-col items-center mt-5">
        {/* <div className="flex gap-2">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div> */}

        <div className="flex gap-3 mt-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={exportToCSV}>
            Save as Excel
          </Button>
        </div>
      </div>
    )}
                    </div>
        
        
    )
}

export default EffiencyHeatmap