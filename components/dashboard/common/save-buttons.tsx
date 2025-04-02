import { Button } from '@/components/ui/button';
import React from 'react'


type buttons = {
    saveAsPDF:()=>void;
    saveAsExcel:()=>void;
}

const ButtonSaveCompo = ({saveAsExcel,saveAsPDF}:buttons) => {
  return (
    <div>
        <div className="mb-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={saveAsExcel}>
            Save as Excel
          </Button>
        </div>
    </div>
  )
}

export default ButtonSaveCompo