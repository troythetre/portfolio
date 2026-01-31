import React from 'react';

interface OverlayComponentProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const OverlayComponent: React.FC<OverlayComponentProps> = ({ show, onClose, children }) => {
  return (
    <>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex-grow flex justify-center" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayComponent;
