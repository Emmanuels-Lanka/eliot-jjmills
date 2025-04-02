import React from 'react';
import moment from 'moment-timezone';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ObbOperation, ObbSheet, Operation, Operator, ProductionLine, RoamingQC } from "@prisma/client";

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

interface RoamingQcReportTemplateProps {
    data: ReportDataType[];
}

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        // fontFamily: 'Helvetica',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    country: {
        textAlign: 'center',
        color: 'grey',
        fontSize: 10,
        marginBottom: 20,
    },
    logo: {
        width: "100px",
        height: "42px",
        marginBottom: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "extrabold",
        marginBottom: 10,
        alignItems: 'center',
    },
    separator: {
        marginBottom: 20,
    },
    detailContainer: {
        marginBottom: 20,
        width: "50%",
        gap: 6,
    },
    detailRow: {
        display: "flex",
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailLabel: {
        width: 100,
        fontWeight: 'bold',
    },
    detailValue: {
        color: "#767676"
    },
    tableTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        alignItems: 'center',
    },
    body: {
        display: "flex",
        justifyContent: 'center',
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderColor: '#000',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        flex: 1,
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    noCell: {
        width: '45px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    hourCell: {
        width: '70px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    qtyCell: {
        width: '60px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    tableHeader: {
        backgroundColor: '#D3D3D3',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: 'center',
    },
    footerLogo: {
        width: 80,
        height: 30,
        marginTop: 10,
    },
    footerLink: {
        fontSize: 10,
        color: 'gray',
        marginTop: 5,
    },
    footerTime: {
        fontSize: 8,
        marginTop: 10,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 8,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});

const RoamingQcReportTemplate: React.FC<RoamingQcReportTemplateProps> = ({ data }) => {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Roaming Quality Inspection Report</Text>
                </View>

                {/* Report Data */}
                {data.map((report, reportIndex) => {
                    if (report.data.length > 0) {
                        return (
                            <View key={reportIndex} style={{ marginBottom: 20 }}>
                                {/* ObbSheet Details Table */}
                                <View style={styles.table}>
                                    <View style={[styles.tableRow, styles.tableHeader]}>
                                        <Text style={styles.tableCell}>Date</Text>
                                        <Text style={styles.tableCell}>Style</Text>
                                        <Text style={styles.tableCell}>Buyer Name</Text>
                                        <Text style={styles.tableCell}>Color</Text>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{moment(report.date).format("DD MMMM, YYYY")}</Text>
                                        <Text style={styles.tableCell}>{report.obbSheet.name}</Text>
                                        <Text style={styles.tableCell}>{report.obbSheet.buyer}</Text>
                                        <Text style={styles.tableCell}>{report.obbSheet.colour}</Text>
                                    </View>
                                </View>

                                {/* Processed Data Tables */}
                                <View style={{ marginTop: 20 }}>
                                    <View style={styles.table}>
                                        {/* Table Header */}
                                        <View style={[styles.tableRow, styles.tableHeader]}>
                                            <Text style={styles.noCell}>Round</Text>
                                            <Text style={styles.hourCell}>Time</Text>
                                            <Text style={styles.tableCell}>Operation Name</Text>
                                            <Text style={styles.tableCell}>Operator Name</Text>
                                            <Text style={styles.hourCell}>Machine</Text>
                                            <Text style={styles.qtyCell}>Ins. Qty</Text>
                                            <Text style={styles.hourCell}>Status</Text>
                                            <Text style={styles.tableCell}>Defects</Text>
                                            <Text style={styles.tableCell}>RQC</Text>
                                            <Text style={styles.hourCell}>Action</Text>
                                        </View>
                                    </View>
                                    
                                    {/* Table Rows */}
                                    {report.data.map((operationGroup, opIndex) => (
                                        <View key={opIndex} style={[styles.table, { marginTop: 15 }]}>
                                            {operationGroup.records.map((record, recIndex) => {
                                                const defectCounts = record.defects.reduce<{ [key: string]: number }>((acc, defect) => {
                                                    acc[defect] = (acc[defect] || 0) + 1;
                                                    return acc;
                                                }, {});

                                                const formattedDefects = Object.entries(defectCounts)
                                                    .map(([defect, count]) => `${defect} (${count})`)
                                                    .join(", ") || "No defects";

                                                return (
                                                    <View key={recIndex} style={styles.tableRow}>
                                                        <Text style={styles.noCell}>{recIndex + 1}</Text>
                                                        <Text style={styles.hourCell}>{record.timestamp.split(" ")[1]}</Text>
                                                        <Text style={styles.tableCell}>{record.obbOperation.operation.name}</Text>
                                                        <Text style={styles.tableCell}>{record.operator.name}</Text>
                                                        <Text style={styles.hourCell}>{record.machineId}</Text>
                                                        <Text style={styles.qtyCell}>{record.inspectedQty}</Text>
                                                        <Text style={styles.hourCell}>{record.colorStatus}</Text>
                                                        <Text style={styles.tableCell}>{formattedDefects}</Text>
                                                        <Text style={styles.tableCell}>{record.inspectedBy}</Text>
                                                        <Text style={styles.hourCell}>{" "}</Text>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )
                    } else return null;
                })}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerTime}>{moment().tz("Asia/Dhaka").format('YYYY-MM-DD, h:mm:ss a')}</Text>
                    <Text style={styles.footerLink}>https://rfid-tracker.eliot.global/</Text>
                </View>

                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
};

export default RoamingQcReportTemplate;