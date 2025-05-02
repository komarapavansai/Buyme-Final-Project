import React, { useEffect, useState } from 'react'
import Header from './components/header'
import { Outlet } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from './components/Loader'
import Navbar from './components/Navbar'

const App = () => {
  const [loading ,setLoading]= useState(false)
  const handleButton = (e)=>{
    setLoading(true);

    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }
  return (
    <>
      {/* <div className='flex fixed top-0 left-0 z-50'> */}
      <Header/>
      {/* </div> */}
      {/* <Navbar /> */}
      <ToastContainer/>
      {/* <div>
        <button onClick={handleButton}>
          testLoading
        </button>
      </div>
      <div>
        {loading && (<Loader/>)}
      </div> */}
      <Outlet />
    </>
    // <div className='grid grid-cols-2 grid-rows-2 grid-flow-col gap-2 h-64'>
    //   <div className='bg-amber-400 flex justify-center order-2 md:order-1 items-center h-full'>
    //     div 1
    //   </div>
    //   <div className='bg-red-400 flex justify-center items-center order-3 md:order-2 h-full'>
    //     div 2
    //   </div>
    //   <div className='bg-blue-400 order-1 md:order-3 col-span-2 md:col-start-2 md:row-span-2 flex justify-center items-center h-full'>
    //     div 3
    //   </div>
    // </div>
  )
}

export default App
