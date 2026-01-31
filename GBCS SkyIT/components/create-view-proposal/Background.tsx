// components/create-view-proposal/Background.tsx

import React, { ReactNode } from 'react';

interface BackgroundProps {
  children: ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  const pageStyle: React.CSSProperties = {
    backgroundImage: 'url("/images/create-view-proposal/background.svg")',
  };

  return (
    <div style={pageStyle} className="w-screen h-[90vh] bg-cover bg-center  flex items-center justify-center">
      {children}
    </div>
  );
};

export default Background;
