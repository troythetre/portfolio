
//No need of Software_popup -> index.tsx The file is retained for referance in future, if same component is used.




import React, { useState } from 'react';
import PopupMsg from "../../components/sectionA/PopupMsg/PopupMsg";

function PopupPage() {

  const [popupType, setPopupType] = useState<string | null>(null);


  const openPopup = (type: string) => {
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupType(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      
      <button
        className="bg-blue-500 text-white p-4 mr-4 rounded hover:bg-blue-700"
        onClick={() => openPopup('Lokomotive +')}>
      
        Lokomotive Popup
      </button>

     
      <button
        className="bg-blue-500 text-white p-4 mr-4 rounded hover:bg-blue-700"
        onClick={() => openPopup('Aukai +')} >
        Aukai Popup
      </button>

      <button
        className="bg-blue-500 text-white p-4 mr-4 rounded hover:bg-blue-700"
        onClick={() => openPopup('Orion +')} >
        Orion Popup
      </button>

     
      {popupType && <PopupMsg onClose={closePopup} popupType={popupType} />}
    </div>
  );
}

export default PopupPage;