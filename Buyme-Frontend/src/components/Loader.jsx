import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CgSpinner } from 'react-icons/cg';
import { FaSpinner } from 'react-icons/fa';
import { MdOutlineAutorenew } from 'react-icons/md';

const Loader = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        {/* <MdOutlineAutorenew className="animate-spin text-blue-600 text-5xl" /> */}
      </div>
    );
  };  

export default Loader
