"use client"

import { useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ObbOperation, ObbSheet, Operation, Operator, ProductionLine, RoamingQC } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { fetchRoamingQcData } from "./_actions/fetch-roaming-qc-data";
import { fetchObbSheetsForUnit } from "./_actions/fetch-details";
import RoamingQcReportTemplate from "./_components/roaming-qc-report-template";
import RoamingQcReportViewer from "./_components/roaming-qc-report-viewer";
import SelectUnitLineAndDate from "@/components/dashboard/common/select-unit-line-and-date";

type RawDataType = RoamingQC & {
    obbOperation: ObbOperation & {
        obbSheet: ObbSheet & {
            productionLine: ProductionLine;
        };
        operation: Operation
    };
    operator: Operator
}

type ProcessedDataType = {
    date: string;
    data: {
        obbOperationId: string;
        records: RawDataType[];
    }[];
};

type ReportDataType = {
    obbSheet: ObbSheet;
    date: ProcessedDataType["date"];
    data: ProcessedDataType["data"];
};

const RoamingQcReportPage = () => {
    const [pdfLink, setPdfLink] = useState<JSX.Element | null>(null);
    const [reportData, setReportData] = useState<ReportDataType[]>([]);

    const processData = (rawData: RawDataType[]): ProcessedDataType => {
        const groupedByOperation = rawData.reduce<Record<string, RawDataType[]>>((acc, item) => {
            if (!acc[item.obbOperationId]) acc[item.obbOperationId] = [];
            acc[item.obbOperationId].push(item);
            return acc;
        }, {});

        return {
            date: rawData[0]?.timestamp.split(' ')[0] ?? "", // Use the first item's date
            data: Object.entries(groupedByOperation).map(([obbOperationId, records]) => ({
                obbOperationId,
                records,
            })),
        };
    };

    const handleProcessReportData = async (data: { unit: string; lineId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0].toString();     // 2024-12-24
            const obbSheets = await fetchObbSheetsForUnit(data.lineId);

            const formattedData: ReportDataType[] = [];

            for (const obbSheet of obbSheets) {
                const rawData: RawDataType[] = await fetchRoamingQcData(obbSheet.id, formattedDate);
                const processedData = processData(rawData);

                formattedData.push({
                    obbSheet,
                    date: processedData.date,
                    data: processedData.data,
                });
            }

            setReportData(formattedData);
            console.log("formattedData", formattedData);

            setPdfLink(generatePdfReport(formattedData));
        } catch (error) {
            console.error("Error processing report data:", error);
        }
    }

    const generatePdfReport = (reportData: ReportDataType[]) => {
        return (
            <PDFDownloadLink
                document={
                    <RoamingQcReportTemplate
                        data={reportData}
                    />
                }
                fileName="roaming-qc-report.pdf"
            >
                Download PDF Report
            </PDFDownloadLink>
        );
    };

    return (
        <div className="mx-auto max-w-7xl">
            <h1 className="mt-4 text-2xl font-semibold">Roaming QC Report</h1>

            <SelectUnitLineAndDate
                handleSubmit={handleProcessReportData}
            />

            {reportData.length > 0 &&
                <div className='mt-8 p-8 bg-slate-100 rounded-lg border flex flex-col items-end gap-4'>
                    <div className='space-x-4'>
                        {pdfLink ? (
                            <Button variant="default">{pdfLink}</Button>
                        ) : (
                            <Button variant="default" disabled>
                                Generating PDF...
                            </Button>
                        )}
                    </div>
                    <div className='w-full pdf-viewer'>
                        <RoamingQcReportViewer
                            data={reportData}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default RoamingQcReportPage