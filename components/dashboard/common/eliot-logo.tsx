import Image from 'next/image'
import React from 'react'

const LogoImporter = () => {
  return (
    <div>

<Image
                src="/eliot-logo.png"
                alt='logo'
                width={200}
                height={200}
                className='py-4'
            />

    </div>
  )
}

export default LogoImporter