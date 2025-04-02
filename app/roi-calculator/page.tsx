import React from 'react'
import CalculatorForm from './_components/calculatorForm-compo'
import Image from 'next/image'

const page = () => {
  return (
    <>
    <div>
    <div className='mx-4 flex items-center justify-center gap-4'>
        <Image src={"/eliot-logo.png"} alt=' ' height={150} width={150} />
        <h1 className='text-[#0071c1] my-4 text-2xl'>Return of Investment Calculator</h1>
      </div>
      <CalculatorForm/>
    </div>
    </>
  )
}

export default page