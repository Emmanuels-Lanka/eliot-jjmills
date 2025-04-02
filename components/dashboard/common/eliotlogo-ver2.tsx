import Image from 'next/image'
import React from 'react'

const LogoImporterHeader = ({label}:{label:any}) => {
  return (
    <div>

<div className='flex flex-row'>
<Image
                src="/eliot-logo.png"
                alt='logo'
                width={110}
                height={20}
                className='py-6 '
            />
            <h1 className='text-[#0071c1] text-xl px-2 py-10'>Dashboard - {label}</h1>
           

    </div>
</div>
  )
}

export default LogoImporterHeader