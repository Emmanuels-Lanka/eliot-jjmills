"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Button } from "@/components/ui/button";
import { fetchObbDetailsForReport } from "../../_actions/fetch-obb-details-for-report";
import { Loader2 } from "lucide-react";
import ObbReportTemplate from "./obb-report-template";
import * as XLSX from 'xlsx';

const GenerateObbReport = ({ obbSheetId }: { obbSheetId: string }) => {
  const [pdfLink, setPdfLink] = useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
//   const [obb, setObb] = useState<ReportObbDetailsTypes>();

  const handleGenerateObbReport = async () => {
    setIsLoading(true);
    const obbDetails = await fetchObbDetailsForReport(obbSheetId);
    if (obbDetails) {
      console.log("OBB", obbDetails);
    //   setObb(obbDetails);
      const pdfElement = generatePdfReport(obbDetails);
      setPdfLink(pdfElement);
     
    }
    setIsLoading(false);
  };
  

  const generatePdfReport = (data: ReportObbDetailsTypes) => {
    return (
      <PDFDownloadLink
        document={<ObbReportTemplate data={data} />}
        fileName="obb-report.pdf"
      >
        {/* {({ loading }) => (loading ? "Generating PDF..." : "Download PDF Report")} */}
        Download PDF Report
      </PDFDownloadLink>
      
    );
  };

  const generateExcel =async ()=>{
    setIsLoading1(true);
    const obbDetails = await fetchObbDetailsForReport(obbSheetId);
    if (obbDetails) {
    //   console.log("OBB", obbDetails);
        generateExcelReport(obbDetails);
     
        setIsLoading1(false);
    }
    setIsLoading1(false);
  }
  const generateExcelReport = (data: ReportObbDetailsTypes) => {
    const excelData = [
        {
          "Obb Version": data.version,
          "Production Unit": data.unit,
          "Production line": data.line,
          "Style": data.style,
          "Buyer": data.buyer,
          "Item": data.item,
          "Colour": data.colour,
          "Ind Engineer": data.indEngineer,
          "Mechanic": data.mechanic,
          "Quality Ins": data.qualityIns,
          "Acc Input Man": data.accInputMan,
          "Fab Input Man": data.fabInputMan,
          "Line Chief": data.lineChief,
          "Starting Date": data.startingDate,
          "Ending Date": data.endingDate,
          "Factory Start Time": data.factoryStartTime,
          "Factory Stop Time": data.factoryStopTime,
          "Working Hours": data.workingHours,
          "Total SMV": data.totalSMV,
          "Obb Operations No": data.obbOperationsNo,
          "Bundle Time": data.bundleTime,
          "Personal Allowance": data.personalAllowance,
          "Efficiency Level 1": data.efficiencyLevel1,
          "Efficiency Level 3": data.efficiencyLevel3,
          ProductionUnit: data.unit,
        },
        ...data.operations,
      ];
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OBB Report");
    XLSX.writeFile(workbook, "obb-report.xlsx");
  };

  return (
    <div className="flex gap-2">
      {pdfLink ? (
        <Button variant="outline">{pdfLink}</Button>
      ) : (
        <Button
          disabled={isLoading}
          className="w-32"
          onClick={handleGenerateObbReport}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Print OBB"}
        </Button>
      )}
      <Button
      
        variant="outline"
        onClick={generateExcel}>{isLoading1 ? <Loader2 className="animate-spin" /> : "Download Excel"}</Button>
    </div>
  );
};

export default GenerateObbReport;
