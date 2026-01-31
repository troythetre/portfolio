import React from 'react';
import Image from 'next/image';

const Logo = () => {
    return (
        <div className="text-center relative">
            <Image src="/images/create-view-proposal/logo.svg" alt="Logo" width={500} height={500} />
        </div>
    );
};

export default Logo;
