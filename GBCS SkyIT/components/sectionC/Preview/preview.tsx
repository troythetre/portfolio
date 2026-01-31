import React, { useEffect, useState } from "react";
import Grid from "../Preview/Grid";
import SearchBar from "../AdminComponent/SearchBar/SearchBar";
import ReuseBtn from '../TeamMemberComponent/GroupBtn/ReuseBtn';
import Image from "next/image";
import SideBarAdmin from "../AdminComponent/SideBaAdminComponent/SideBarAdmin";
import back from "../../../public/images/backIcon.svg";
import { useRouter } from "next/router";

const Preview = () => {
  const router = useRouter();
  const { fileContents } = router.query;
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]); // New state to track selections
  
  useEffect(() => {
    if (!fileContents) return;
  
    try {
      const parsedContents = JSON.parse(fileContents);
      console.log("Parsed Contents (Raw):", parsedContents);
  
      // Flatten the nested array
      const flatData = parsedContents.flat();
      console.log("Flattened Data:", flatData);
  
      setOriginalData(flatData);
      setFilteredResponses(flatData);
    } catch (error) {
      console.error("Error parsing file contents:", error);
    }
  }, [fileContents]);
  
  const handleSearch = (filteredData) => {
    setFilteredResponses(filteredData);
  };

  // Handle the removed data
  const handleRemoveSelected = () => {
    if (selectedRows.length === 0){
      alert('No response selected to remove');
      return;
    }
    
    const updatedOriginalData = originalData.filter((_,index) =>
      !selectedRows.includes(index + 1)
    );
    
    const updatedFilteredData = filteredResponses.filter((_,index) =>
      !selectedRows.includes(index + 1)
    );

    setOriginalData(updatedOriginalData);
    setFilteredResponses(updatedFilteredData);
    setSelectedRows([]);
  };

  const handleSelectionChange = (selectedIndicies: number[]) => {
    setSelectedRows(selectedIndicies);
  }
  
  return (
    <div className="flex mt-0 ml-20 mt-20"> 
      <SideBarAdmin />
      <div className="flex flex-col w-full ml-[400px] mt-0">
        <div className="mt-5 text-18 flex mb-0 text-white-color font-normal">
          <Image src={back} alt="back-icon" height="10vw" width="40vw" />
          <p className="font-poppins text-22 pl-4 text-white ">Preview Your Uploaded Responses</p> 
        </div>
        <p className="font-poppins text-18 text-white mt-1">Please confirm the responses you want to upload.</p>
        <div className="mt-2">
          <SearchBar data={originalData} setFilteredData={setFilteredResponses} onSearch={handleSearch} />
          <div className="mt-2 flex space-x-4">
            <ReuseBtn  buttonText="Open" backgroundWidth="145px" mainWidth="142px" />
            <ReuseBtn  buttonText="Remove" backgroundWidth="145px" mainWidth="142px" onClick={handleRemoveSelected}/>
          </div> 
        </div>
        <div className="-mt-8">
          <Grid 
          data={filteredResponses}
          onSelectionChange = {handleSelectionChange}
          selectedRows = {selectedRows} />
        </div>
      </div>
    </div>
  );
};

export default Preview;