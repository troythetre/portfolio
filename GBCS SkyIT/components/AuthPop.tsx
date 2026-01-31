import React, {useState} from 'react';
import { Button } from '@mantine/core';
import eye from "../public/images/authrorization-code-pop/gold_eye_icon.svg"
import Image from "next/image";
import Draggable from "react-draggable";

function AuthPop() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <>
      {/* make the component center */}
      <div className='flex justify-center items-center h-[100vh]'>
        {/* make the dark bg */}
        <div className="fixed top-0 left-0 bg-[#000000] opacity-80 w-[100%] h-[100vh] z-0" />
        <Draggable >
          <div className="bg-black w-[400px] h-[240px] mx-auto rounded-xl">
            <div className="relative h-[80px]">
              <p className="p-0 text-transparent bg-clip-text bg-gradient-text text-2xl text-center px-10 py-4 font-semibold" >
                An authorization code is needed
              </p>
              <button className="absolute right-0 top-0 text-transparent bg-clip-text bg-gradient-text text-2xl bold rounded-lg cursor-pointer border-none">x</button>
            </div>
            <div className=" w-[400px] h-[160px] bg-[#2F2F2F] rounded place-items-center flex flex-col justify-center">
              <div className="relative"></div>
              <div className='bg-gradient-border w-[90%] h-[30%] rounded-lg'>
                <input type={showPassword ? 'text' : 'password'} className="w-[100%] h-[95%] rounded-lg bg-[#555555] border-0  " />            
                <button onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    top: '56%',
                    right: '40px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}>
                  <Image src={eye} alt='eye' />
                </button>
              </div>
              
              <Button color="dark" className="relative text-white mt-5  border-2 h-8 w-16 bg-gradient-border" >
                <span className="text-white absolute inset-0 border-black bg-black flex flex-wrap content-center place-content-center">Next</span>
              </Button>
            </div>
          </div>
        </Draggable>
      </div>
    </>
  );
}

export default AuthPop;