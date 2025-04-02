"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import React, { useRef, useState } from 'react'
import {  useForm } from 'react-hook-form'
// import { json } from 'stream/consumers'
import * as z from 'zod'
import html2canvas from "html2canvas";


const QRGenerator = () => {

  const [machine, setMachine] = useState("");
  const [mId, setMId] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  

    const formSchema = z.object({
        machineId :z.string().min(6,{
          message:"Machine ID is required"
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            machineId:""
        }

    })

    const handleSubmit = (data:any)=>{
      console.log("first")
      const  machineId = data.machineId
      const dataa = JSON.stringify({ machineId });
      setMId(machineId)
      
      setMachine(machineId)
    }

    const { isSubmitting, isValid } = form.formState;


    const downloadQRCode = () => {
      if (qrRef.current) {
        html2canvas(qrRef.current).then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `qr-code-${machine}.png`;
          link.click();
        });
      }
    };

  return (
    <div>
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
           
           
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>

                <FormField control={form.control} name='machineId' 
                 render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sewing Machine Id</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='SNL290'></Input>
                    </FormControl>
                  </FormItem>
                 )}
                
                >

                </FormField> 
                <Button 
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="flex max-md:w-full w-full mt-5 gap-2 pr-5  items-center "
                    >  Genarate</Button>
              </form>
            </Form>
          </div>

          
        </div>
        {machine && (
          <div className="flex flex-col items-center space-y-4 pt-4">
            <div  ref={qrRef} className="p-4 bg-white rounded-lg shadow-inner">
              <QRCodeSVG
                value={machine}
                size={200}
                level="H"
                // includeMargin={true}
                className="mx-auto"
              />
              <h1 className='  text-center mt-3'>{mId}</h1>
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
    </div>
  )
}

export default QRGenerator