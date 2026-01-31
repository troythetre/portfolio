// components/ArrowIcon.tsx
import React from "react";
import Image from "next/image";
import arrow from "../../../public/images/edit-proposal/arrow_btn.svg";
import { useRouter } from 'next/router';

const ArrowIcon: React.FC = () => {
    const router = useRouter();
    return (
        <div className="self-start mx-10 cursor-pointer">
            <Image src={arrow} alt="arrow icon" onClick={() => router.push('/my_task/in-progress')} />
        </div>
    );
};

export default ArrowIcon;
