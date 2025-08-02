import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
        <main className='min-h-screen'>
          <Header />
          <Outlet />
            {/* <Body /> */}
        </main>
        <div className='p-10 text-center bg-gray-800 mt-20'>
          Made with ❤️ by Lipika
        </div>
    </div>
  )
}

export default AppLayout