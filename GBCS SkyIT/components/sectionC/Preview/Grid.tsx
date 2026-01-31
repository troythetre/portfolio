import React, { useEffect, useState } from 'react';
import EditBtn from '../TeamMemberComponent/GroupBtn/EditBtn';
import styles from './Grid.module.css';
import ReuseBtn from '../TeamMemberComponent/GroupBtn/ReuseBtn';
import DuplicateResponseDialog from './DuplicateResponseDialoge';
import { BASEURL } from '../../../constants';
import axios from 'axios';

interface GridDataInerface {
  data: { Q: string; A: string; S: string; T: string; ST: string }[][];
  onSelectionChange?: (selectedIndices: number[]) => void;
  selectedRows?: number[];
}

interface FileResponse {
  index: number;
  selected: boolean;
  question: string;
  answer: string;
  software: string;
  topic: string;
  subtopic: string;
}

const GridTable: React.FC<GridDataInerface> = ({ data, onSelectionChange, selectedRows = [] }) => {
  const [fileResponseData, setFileResponseData] = useState<FileResponse[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [saveDuplication, setSaveDuplication] = useState(false);



  // Handle check box selection. update the list
  const handleCheckboxChange = (index: number) => {
    const selectedIndex = selectedRows.indexOf(index);
    const newSelectedRows = [...selectedRows];
    if (selectedIndex === -1) {
      newSelectedRows.push(index);
    } else {
      newSelectedRows.splice(selectedIndex, 1);
    }

    // Handle selection changes (remove)
    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    }

    // Log the details of the selected response
    const selectedResponse = fileResponseData.find(response => response.index === index);
    if (selectedResponse) {
      console.log("Selected response details:", selectedResponse);
    }

  };

  //   const handleMasterCheckboxChange = () => {
  //     const allChecked = selectedRows.length !== data.length - 1;
  //     const updatedSelectedRows = allChecked
  //       ? data.slice(1).map((_, index) => index)
  //       : [];
  //     setSelectedRows(updatedSelectedRows);
  //   };

  useEffect(() => {
    console.log("Grid Data:", data);

    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return;
    }

    const initialTableData: FileResponse[] = data.map((rowdata, index) => ({
      index: index + 1,
      selected: false,
      question: rowdata.Q || "",
      answer: rowdata.A || "",
      software: rowdata.S || "",
      topic: rowdata.T || "",
      subtopic: rowdata.ST || "",
    }));

    console.log("Initial Table Data for Grid:", initialTableData);
    setFileResponseData(initialTableData);
  }, [data]);


  // call the parse API
  const addToResponseLibrary = async (saveDuplicationValue: boolean) => {
    try {
      // Filter out selected responses
      const selectedRowsToSave = fileResponseData
        .filter((response) => selectedRows.includes(response.index))
        .map((item) => ({
          question: item.question,
          answer: item.answer,
          software: item.software,
          topic: item.topic,
          subtopic: item.subtopic,
        }));
      console.log('selectedRowsToSave : '
        + JSON.stringify(selectedRowsToSave));
      // Make API call to send selected responses to the server
      const response = await axios.post(
        `${BASEURL}/api/proposal/save-parsed-data`,
        {
          data: selectedRowsToSave,
          saveDuplication: saveDuplicationValue,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      console.log("Server Response:");
      console.log(response);
      console.log(response.data);

      // Check the message in the response
      if (response.data && response.data.message === 'New unique records saved successfully.') {
        console.log("New unique records saved successfully.");
        setSaveDuplication(true); // Update saveDuplication state
        setShowSuccessMessage(true); // Inform the user about successful save
      } else if (response.data && response.data.message === 'Data saved successfully with duplication.') {
        console.log("Records saved successfully with duplication.");
        setSaveDuplication(false); // Update saveDuplication state
        setShowDuplicateDialog(true); // Inform the user about duplication
      } else {
        console.log("Unknown response from the server:", response.data.message);
      }

      // setSelectedRows([]);
    } catch (error) {
      console.error('Error while adding responses to library:', error);
    }
  };

  return (
    <div className="table-container">
      <div className="mt-2 flex space-x-4"></div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-inter mb-0 text-white-color">
          Total {data.length} responses
        </p>
        <div className="mr-[8rem]">
          <EditBtn />
        </div>
      </div>
      <table
        className={`${styles['red-grid-table']} mt-0 ml-0 mb-[12rem]`}
        style={{ zIndex: 1000 }}
      >
        <thead className="border-solid border-t border-b">
          <tr className=" text-18 font-poppins font-semibold">
            <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent"></th>

            <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
              Question
            </th>
            <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
              Answer
            </th>
            <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
              Software
            </th>
            <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
              Topic
            </th>
            <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
              Sub-Topic
            </th>
          </tr>
        </thead>
        {data.length > 0 && (
          <tbody className="text-GBCS-yellow">
            {/* Render data rows */}
            {fileResponseData?.map((rowDataArray, rowIndex) => (
              <tr key={rowIndex}>
                {/* Checkbox column */}
                <td
                  className={`${styles.border} ${styles.px4} ${styles.py2} text-center`}
                >
                  <input
                    type="checkbox"
                    value={rowDataArray.index}
                    id={'checkbox_' + rowDataArray.index}
                    className="w-6 h-6"
                    checked={selectedRows.includes(rowDataArray.index)}
                    onChange={() => handleCheckboxChange(rowDataArray.index)}
                  />
                </td>
                <td className="${styles.border} ${styles.px2} ${styles.py1} text-center ">
                  {rowDataArray.question}
                </td>
                <td className="${styles.border} ${styles.px2} ${styles.py1} text-center ">
                  {rowDataArray?.answer}
                </td>
                <td className="${styles.border} ${styles.px2} ${styles.py1} text-center ">
                  {rowDataArray?.software}
                </td>
                <td className="${styles.border} ${styles.px2} ${styles.py1} text-center ${styles.smallerColumn}">
                  {rowDataArray?.topic}
                </td>
                <td className="${styles.border} ${styles.px2} ${styles.py1} text-center ${styles.smallerColumn}">
                  {rowDataArray?.subtopic}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <div className=" mr-[5rem] flex justify-end mt-[-5rem]">
        <ReuseBtn
          buttonText="Add to Response Library"
          backgroundWidth="250px"
          mainWidth="250px"
          onClick={() => setShowDuplicateDialog(true)}
        />
      </div>
      {showDuplicateDialog && (
        <DuplicateResponseDialog
          show={showDuplicateDialog}
          onKeep={() => {
            addToResponseLibrary(true);
            setShowDuplicateDialog(false);
          }}
          onReplace={() => {
            addToResponseLibrary(false);
            setShowDuplicateDialog(false);
          }}
        />

      )}
    </div>
  );
};

export default GridTable;

