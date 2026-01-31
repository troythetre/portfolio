import React from 'react';

const UploadButton = ({ onChange }) => {
  return (
    <div className="mb-4">
      <input
        id="upload"
        type="file"
        name="img"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor="upload"
        className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        Upload Image
      </label>
    </div>
  );
};

export default UploadButton;
