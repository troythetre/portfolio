import Image from "next/image";
import React, { useState } from "react";
import logo from "../../public/images/login/logo_login.svg";
import styles from "./login.module.css";
import { LoginForm } from "../LoginForm/LoginForm";
import { LoaderOne } from "../Loader/LoaderOne";

export const LoginComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);  

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-background-login bg-no-repeat bg-cover">
      <div className="flex flex-row justify-between gap-10 items-center">
        <div className={`${styles.fade_in_left} flex flex-col items-center`}>
          <Image src={logo} alt="Voop Logo" height={350} />
          <h1 className={`text-lg -translate-y-6 font-normal text-white text-cente ${styles.text_font}`}>
            Your Automated Proposal Crafting Partner
          </h1>
        </div>

        <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />

        {isLoading && <LoaderOne />}
      </div>
    </div>
  );
};
