"use client"

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'; 

interface QrCodeReaderProps {
    setQrCode: (code: string) => void;
}

const QrCodeReader = ({ setQrCode }: QrCodeReaderProps) => {

    const handleScan = (data: IDetectedBarcode[]) => {
        if (data.length > 0 && data[0].rawValue) {
            console.log('Scanned QR Code:', data);
            setQrCode(data[0].rawValue)
        }
    }

    return <Scanner onScan={(result) => handleScan(result)} />
}

export default QrCodeReader