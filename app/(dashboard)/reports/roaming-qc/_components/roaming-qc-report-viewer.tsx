import { PDFViewer } from '@react-pdf/renderer';

import RoamingQcReportTemplate from './roaming-qc-report-template';

interface RoamingQcReportViewerProps {
    data: any[];
}

const RoamingQcReportViewer = ({ data }: RoamingQcReportViewerProps) => {
    return (
        <div style={{ height: '100vh' }}>
            <PDFViewer width="100%" height="100%">
                <RoamingQcReportTemplate
                    data={data}
                />
            </PDFViewer>
        </div>
    );
}

export default RoamingQcReportViewer;
