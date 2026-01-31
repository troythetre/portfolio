import React from 'react';
import Image from 'next/image'

const SidebarLogo: React.FC = () => {
  return (
    <div className="my-4">
      <Image src="/images/voop_logo.png" alt="Logo" width={200} height={148} />
    </div>
  );
};

export default SidebarLogo;
