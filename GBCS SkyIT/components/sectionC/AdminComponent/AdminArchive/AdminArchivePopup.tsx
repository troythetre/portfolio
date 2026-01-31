import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { BASEURL } from '../../../../constants';
import axios from 'axios';

interface AdminArchivePopupProps {
  responseIDs: String[];
  handleClose: () => void;
  totalCount: number; // Add totalCount prop
}

const AdminArchivePopup: React.FC<AdminArchivePopupProps> = ({
  responseIDs,
  handleClose,
  totalCount,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDeleteButtonClick = async () => {
    if (!responseIDs || responseIDs.length === 0) {
      console.error('No response IDs provided for deletion.');
      return;
    }

    const payload = { responseID: responseIDs[0] };
    console.log('Payload being sent:', payload);

    try {
      const response = await axios.delete(
        `${BASEURL}/api/proposal/delete-response/`,
        { data: payload, withCredentials: true }
      );
      console.log('Response deleted successfully:', response.data);
      handleClose();
    } catch (error) {
      console.error('Error while deleting data:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div
        className="max-w-screen-sm bg-zinc-900 text-white p-0 border border-solid border-yellow-300 rounded-lg  flex flex-col items-center justify-center mx-auto h-full relative"
        style={{ width: '600px', height: '250px' }}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-yellow-300 font-bold cursor-pointer bg-transparent border-none"
        >
          X
        </button>
        <div className="inner-container flex flex-col items-center justify-center text-center ">
          <h2 className="text-white-300 text-1xl mb-0 font-normal font-poppins">
            Archive Response pop up
          </h2>
          <p></p>
          <p className="text-white-300 text-xl mb-4 mt-8">
            Do you want to archive your responses?
          </p>
        </div>
        <div style={{ height: '18px' }}></div>
        <div className="flex justify-between mt-2">
          <button
            onClick={handleDeleteButtonClick}
            className="bg-transparent border-2 border-yellow-300 rounded-lg p-2 ml-2 text-center text-yellow-300 font-poppins text-base cursor-pointer"
            style={{ width: '100px', height: '40px' }}
          >
            Yes
          </button>
          <div style={{ width: '300px' }}></div>
          <button
            onClick={handleClose}
            className="bg-transparent border-2 border-yellow-300 rounded-lg p-2 mr-2 text-center text-yellow-300 font-poppins text-base cursor-pointer"
            style={{ width: '100px', height: '40px' }}
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminArchivePopup;
