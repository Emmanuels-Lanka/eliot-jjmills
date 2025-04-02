"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import html2canvas from "html2canvas";


export function QRGenerator() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [qrData, setQrData] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);
  const [emails, setEmails] = useState("");

  const generateQRCode = () => {
    if (email && password) {
      const data = JSON.stringify({ email, password });
    // const data = `${email} ${password}`
      setQrData(data);
      setEmails(email)
    }
  };


  const downloadQRCode = () => {
    if (qrRef.current) {
      html2canvas(qrRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `qr-code-${email}.png`;
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100  flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-xl rounded-xl">
        <div className="flex items-center space-x-2">
          <QrCode className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 ">
            {" "}
            Create QR Code{" "}
          </h1>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">email</Label>
            <Input
              id="email"
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={generateQRCode}
            className="w-full"
            disabled={!email || !password}
          >
            Generate QR Code
          </Button>
        </div>

        {qrData && (
          <div className="flex flex-col items-center space-y-4 pt-4">
            <div  ref={qrRef} className="p-4 bg-white rounded-lg shadow-inner">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="H"
                // includeMargin={true}
                className="mx-auto"
              />
              <h1 className='  text-center mt-3'>{emails}</h1>

            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={downloadQRCode}
                variant="outline"
                className="flex items-center gap-2"
              >
                {/* <Download className="w-4 h-4" /> */}
                Download QR Code
              </Button>
              <p className="text-sm text-muted-foreground">
                Click Download to download the QR to your device
              </p>
            </div>
           
          </div>
        )}
      </Card>
    </div>
  );
}