import React from 'react';
import moment from 'moment-timezone';
import { Page, Text, View, Document, StyleSheet, Image, Svg, Line } from '@react-pdf/renderer';

// import { hameemLogoInBase64, logoInBase64 } from '@/constants';

interface ObbReportTemplateProps {
    data: ReportObbDetailsTypes
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
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 6,
    },
    detailColumn: {
        width: "50%",
        gap: 6,
    },
    detailRow: {
        display: "flex",
        flexDirection: 'row',
        marginBottom: 5,
    },
    detailLabel: {
        width: 120,
        fontWeight: 'bold',
    },
    detailValue: {
        color: "#767676"
    },
    tableTitle: {
        fontSize: 14,
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
        width: '30px',
        padding: 5,
        borderStyle: 'solid',
        borderColor: '#000',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    hourCell: {
        width: '150px',
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

const ObbReportTemplate: React.FC<ObbReportTemplateProps> = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                {/* <Image src={hameemLogoInBase64} style={styles.logo} fixed/> */}
                {/* <Text style={styles.country} fixed>~ Bangladesh ~</Text> */}
                <Text style={styles.title}>Operation Bulletin</Text>
            </View>

            <Svg height="2" width="100%" style={styles.separator}>
                <Line
                    x1="0"
                    y1="0"
                    x2="600"
                    y2="0"
                    strokeWidth={1}
                    stroke="rgb(128,128,128)"
                />
            </Svg>

            <View style={styles.detailContainer}>
                <View style={styles.detailColumn}>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>OBB (Style)</Text>
                        <Text style={styles.detailValue}>{data.style} - v{data.version}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Line</Text>
                        <Text style={styles.detailValue}>{data.line} ({data.unit})</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Buyer</Text>
                        <Text style={styles.detailValue}>{data.buyer}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Colour</Text>
                        <Text style={styles.detailValue}>{data.colour}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Item</Text>
                        <Text style={styles.detailValue}>{data.item}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Total SMV</Text>
                        <Text style={styles.detailValue}>{data.totalSMV}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Obb Operations</Text>
                        <Text style={styles.detailValue}>{data.obbOperationsNo}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Efficiency Lv 1</Text>
                        <Text style={styles.detailValue}>{data.efficiencyLevel1}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Efficiency Lv 3</Text>
                        <Text style={styles.detailValue}>{data.efficiencyLevel3}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Bundle Time</Text>
                        <Text style={styles.detailValue}>{data.bundleTime}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Personal Allowance</Text>
                        <Text style={styles.detailValue}>{data.personalAllowance}</Text>
                    </View>
                </View>
                <View style={styles.detailColumn}>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Line Chief</Text>
                        <Text style={styles.detailValue}>{data.lineChief}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Ind. Engineer</Text>
                        <Text style={styles.detailValue}>{data.indEngineer}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Mechanic</Text>
                        <Text style={styles.detailValue}>{data.mechanic}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Quality Ins.</Text>
                        <Text style={styles.detailValue}>{data.qualityIns}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Acc. Input Man</Text>
                        <Text style={styles.detailValue}>{data.accInputMan}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Fab. Input Man</Text>
                        <Text style={styles.detailValue}>{data.fabInputMan}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Starting Date</Text>
                        <Text style={styles.detailValue}>{data.startingDate.split("T")[0]}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Ending Date</Text>
                        <Text style={styles.detailValue}>{data.endingDate.split("T")[0]}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Factory Starting</Text>
                        <Text style={styles.detailValue}>{data.factoryStartTime}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Factory Stoping</Text>
                        <Text style={styles.detailValue}>{data.factoryStopTime}</Text>
                    </View>
                    <View style={styles.detailRow}> 
                        <Text style={styles.detailLabel}>Working Hours</Text>
                        <Text style={styles.detailValue}>{data.workingHours}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.tableTitle}>
                    ---------------------------------------- OBB Operations List ----------------------------------------
                </Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.noCell}>Seq No</Text>
                        <Text style={styles.hourCell}>Operation</Text>
                        <Text style={styles.tableCell}>Op. Code</Text>
                        <Text style={styles.tableCell}>Machine</Text>
                        <Text style={styles.tableCell}>Part</Text>
                        <Text style={styles.tableCell}>SMV</Text>
                        <Text style={styles.tableCell}>Target</Text>
                    </View>
                    {data.operations.map((row, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.noCell}>{row.seqNo}</Text>
                            <Text style={styles.hourCell}>{row.operationName}</Text>
                            <Text style={styles.tableCell}>{row.operationCode}</Text>
                            <Text style={styles.tableCell}>{row.machineId}</Text>
                            <Text style={styles.tableCell}>{row.part}</Text>
                            <Text style={styles.tableCell}>{row.smv}</Text>
                            <Text style={styles.tableCell}>{row.target}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerTime}>{moment().tz("Asia/Dhaka").format('YYYY-MM-DD, h:mm:ss a')}</Text>
                    <Text style={styles.footerLink}>https://rfid-tracker.eliot.global/</Text>
                </View>
                {/* <Image src={logoInBase64} style={styles.footerLogo} /> */}
            </View>

            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
    </Document>
);

export default ObbReportTemplate;