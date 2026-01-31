import React, { FC, useEffect, useState } from 'react';
import ReadMore from './ReadMore';
import styles from '../AdminLibraryResponse/styles.module.css';
import saveIcon from '../../../../public/images/responses/mainarea/save-icon.svg';
import editIconGrey from '../../../../public/images/dashboard/icon-edit-grey.svg';
import Image from 'next/image';
import SearchBar from '../SearchBar/SearchBar';
import RestoreBtn from '../../TeamMemberComponent/GroupBtn/RestoreBtn';
import ExportBtn from '../../TeamMemberComponent/GroupBtn/ExportBtn';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { BASEURL } from '../../../../constants';
import axios from 'axios';

interface Option {
  [key: string]: string;
}

interface RowState {
  isEditing: boolean;
  editedQuestion: string;
  editedAnswer: string;
  editedSoftware: string;
  editedTopic: string;
  editedSubTopic: string;
  editedIcon: string;
}

interface ResponseItem {
  responseID: string;
  answer: string;
  question: string;
  software: string;
  topic: string;
  subtopic: string;
}

const AdminArchive: FC = () => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number[]>([]);
  const [checkedRows, setCheckedRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedResponseIds, setSelectedResponseIds] = useState<String[]>([]);
  const [selectedResponseId, setSelectedResponseId] = useState<String | null>(
    null
  );
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [data, setData] = useState<ResponseItem[]>([]);
  const [filteredData, setFilteredData] = useState<ResponseItem[]>([]); // to hold filtered data state
  const [rowStates, setRowStates] = useState<RowState[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const fetchData = async () => {
    const response = await axios.get(`${BASEURL}/api/proposal/get-archived-responses`, {
      withCredentials: true
    })
      .then((response) => {
        setData(response.data.archivedResponses);
        setData(
          response.data.archivedResponses.map((item) => ({
            isEditing: false,
            responseID: item.responseID,
            question: item.question || item.Question,
            answer: item.answer || item.Answer,
            software: item.software || item.Software,
            topic: item.topic || item.Topic,
            subtopic: item.subtopic || item.subTopic,
          }))
        );
        console.log(
          'response.data size' + response.data.archivedResponses.length
        );

        setRowStates(
          response.data.archivedResponses.map((item) => ({
            isEditing: false,
            responseID: item.responseID,
            editedQuestion: item.question || item.Question,
            editedAnswer: item.answer || item.Answer,
            editedSoftware: item.software || item.Software,
            editedTopic: item.topic || item.Topic,
            editedSubTopic: item.subtopic,
            editedIcon: editIconGrey,
          }))
        );
        console.log(rowStates);
      })
      .catch((error) => {
        console.log('Error while fetching data: ', error);
      });
  };
  // Created axios api handler so can be used in other section also.
  useEffect(() => {
    fetchData();
  }, []);

  // handle selected response id list.
  const handleSelectedResponseId = (responseid: String) => {
    const isPresent = selectedResponseIds.indexOf(responseid);
    const newSelectedResponseId = [...selectedResponseIds];
    if (isPresent === -1) {
      newSelectedResponseId.push(responseid);
    } else {
      newSelectedResponseId.splice(isPresent, 1);
    }
    setSelectedResponseIds(newSelectedResponseId);
  };

  //  handle restore responses
  const handleRestoreClick = async () => {
    // const responseID = responseID;
    try {
      const json = JSON.stringify({ responseID: selectedResponseIds[0] });
      console.log('Start restore: responseid: ' + selectedResponseIds[0]);
      await axios.put(
        `${BASEURL}/api/proposal/restore-response`,
        json,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      alert('Restore successfully. responseid: ' + selectedResponseIds[0]);
      //  setTotalCount((prevCount) => prevCount - 1);
      setIsModalOpen(false);
      fetchData();
      //console.log('responseID:', responseIDs);
      // handleClose(); // Close the modal after successful deletion
    } catch (error) {
      console.error('Error while deleting data: ', error);
      alert('Error while deleting data: ' + error);
    }
  };

  // handle checkbox change
  const handleCheckboxChange = (index: number, responseid: String) => {
    const selectedIndex = selectedRowIndex.indexOf(index);
    const newSelectedRows = [...selectedRowIndex];

    if (selectedIndex === -1) {
      newSelectedRows.push(index);
    } else {
      newSelectedRows.splice(selectedIndex, 1);
    }
    // Update selected responseid list.
    handleSelectedResponseId(responseid);
    setSelectedRowIndex(newSelectedRows);
    setIsCheckboxSelected(newSelectedRows.length > 0);
  };

  const handleEditButtonClick = (index: number) => {
    setRowStates((prevRowStates) => {
      const newState = [...prevRowStates];
      // Toggle the isEditing state
      newState[index] = {
        ...newState[index],
        isEditing: !newState[index].isEditing,
        // Toggle the editedIcon state based on the current value
        editedIcon:
          newState[index].editedIcon === editIconGrey ? saveIcon : editIconGrey,
      };

      return newState;
    });
  };

  // handle open button
  const handleOpenClick = () => {
    if (!isCheckboxSelected) {
      alert('Please select a checkbox before open.');
    }
  };

  // handle ExportBtn
  const handleExportClick = (event) => {
    event.preventDefault(); // To prevent the page from going to a 404 error page after download

    if (!isCheckboxSelected) {
      alert('Please select a response by clicking the checkbox before proceeding with the export');
      return;
    }

    // Fetch selected responses based on their IDs
    const selectedResponses = data.filter(item =>
      selectedResponseIds.includes(item.responseID)
    );

    console.log("Selected Responses:", selectedResponses); // Debugging: Check selected responses

    // Ensure selected responses contain data
    if (selectedResponses.length === 0) {
      alert('No responses selected for export');
      return;
    }

    // Define column headers
    const headers = ['Question', 'Answer', 'Software', 'Topic', 'Sub-Topic'];

    // Convert selected responses to CSV format
    const csvContent = [
      headers.join(',') // Add column headers as the first row
    ];

    selectedResponses.forEach(response => {
      const rowData = [
        response.question || '', // Add Question
        response.answer || '', // Add Answer
        response.software || '', // Add Software
        response.topic || '', // Add Topic
        response.subtopic || '' // Add Sub-Topic
      ];
      csvContent.push(rowData.join(',')); // Add row to CSV content
    });

    // Check if csvContent contains only headers
    if (csvContent.length === 1) {
      alert('No data available for export');
      return;
    }

    console.log(csvContent.join('\n')); // Debugging: Check the generated CSV content

    // Download the CSV file
    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Archived_Responses.csv';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleSaveButtonClick = async (index: number, responseID: string) => {
    const rowState = rowStates[index];

    const updatedData = {
      question: rowState.editedQuestion || data[index]?.question,
      answer: rowState.editedAnswer || data[index]?.answer,
      software: rowState.editedSoftware || data[index]?.software,
      topic: rowState.editedTopic || data[index]?.topic,
      subTopic: rowState.editedSubTopic || data[index]?.subtopic,
    };
    try {
      await axios.put(
        `${BASEURL}/api/proposal/edit-response/:${responseID}`,
        updatedData, {
        withCredentials: true
      }
      );
      setRowStates((prevRowStates) => {
        const newState = [...prevRowStates];
        newState[index] = {
          ...newState[index],
          isEditing: false,
          editedIcon: editIconGrey,
        };
        return newState;
      });
    } catch (error) {
      console.error('Error while updating data: ', error);
    }
  };
  // handle search
  const handleSearch = (filteredData: ResponseItem[]) => {
    setFilteredData(filteredData);
  };

  const handleTextChange = (
    index: number,
    field: 'question' | 'answer' | 'software' | 'topic' | 'subTopic',
    value: string
  ) => {
    setRowStates((prevRowStates) => {
      const newState = [...prevRowStates];
      const editedField = `edited${field.charAt(0).toUpperCase() + field.slice(1)
        }` as keyof RowState;

      newState[index] = {
        ...newState[index],
        [editedField]: value,
      };

      return newState;
    });
  };

  const totalCount = data?.length;
  return (
    <div className="ml-[420px] mr-[40px] mb-[20px] 3xl:ml-[756px] 3xl:mr-[72px] 3xl:mb-[36px]">
      {isModalOpen && (
        <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
          <div className="w-[750px] rounded-[5px] bg-[#2F2F2F] shadow-lg relative">
            <div className="flex flex-col text-white justify-center">
              <div className="flex flex-row-reverse text-yellow-400 my-3 mx-[20px]">
                <CloseIcon onClick={toggleModal} />
              </div>
              <Typography
                display={'flex'}
                paddingLeft={5}
                color={'F4F2F2'}
                font-family="Poppins"
                fontSize={20}
                font-style="normal"
                fontWeight={400}
                lineHeight={'0px'}
                letterSpacing={0.375}
                width="100%"
              >
                <h3>Do you want to restore response?</h3>
              </Typography>

              <div className="flex gap-[135px] py-[40px]">
                <button
                  type="button"
                  className="px-6 py-3 mx-10 my-[-20px] w-55 h-10 w-40 rounded-2xl text-sm bg-transparent border-yellow-400 text-yellow-400"
                  onClick={toggleModal}
                >
                  No
                </button>

                <button
                  type="button"
                  className=" px-6 py-3 mx-80 my-[-20px] w-55 h-10 w-40 rounded-2xl text-sm bg-transparent border-yellow-400 text-yellow-400"
                  onClick={handleRestoreClick}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

      <h1 className="font-poppins font-normal text-3xl text-white-color m-0 pl-0 mb-3">
        Archived Responses
        <div className='relative bg-gradient-border w-[100%] h-[40px] rounded mt-5'>
          <SearchBar data={data} setFilteredData={setFilteredData} onSearch={handleSearch} />
        </div>
      </h1>


      <div className="grid grid-cols-6 mt-2 m-2 ">
        {/* <Link
          href={isCheckboxSelected ? `team-member/${selectedResponseId}` : ''}
        >
          <OpenBtn onClick={handleOpenClick} />
        </Link> */}

        {/* <RestoreBtn  onClick={handleRestoreClick}  */}
        <RestoreBtn onClick={toggleModal} />

        <Link
          href={isCheckboxSelected ? `team-member/${selectedResponseId}` : ''}
        >
          <ExportBtn onClick={handleExportClick} />
        </Link>
      </div>
      <div style={{ marginTop: '-35px' }} />
      <p className="text-lg font-poppins mb-5 text-white-color">
        Total {totalCount} responses
      </p>

      <div
        style={{ overflow: 'auto', maxHeight: 500, marginTop: '-22px', width: '100%' }}
        className={`border-2 border-collapse border-gray-500 table-auto border-solid rounded-xl ${styles.tableDiv}`}
      >
        <table
          className={`mt-0 ml-0 mr-0 border-2 border-collapse border-gray-500 table-auto border-solid ${styles.transactionHistory}`}
          style={{ width: '100%' }} // Set table width to 100%
        >
          <thead className="border-solid border-t border-b">
            <tr className=" text-22 font-poppins font-semibold  ">
              <th className="border-t-2 border-b-0 text-left p-4 bg-clip-text bg-gradient-text text-transparent">
                <label className={`${styles.container} cursor-pointer`}>
                  <input
                    type="checkbox"
                    id={`checkbox`}
                    checked={false}

                  />
                  <span className={`${styles.checkmark} ${styles.checkmarkhead}`}></span>
                </label>
              </th>
              <th className="border-t-2 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                Question
              </th>
              <th className="border-t-2 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                Answer
              </th>
              <th className="border-t-0 border-b-0 text-center p-5 bg-clip-text bg-gradient-text text-transparent">
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

          <tbody className="border-solid border-collapse border-t border-b">
            {(filteredData.length > 0 ? filteredData : data).map((item, index) => (
              <tr key={index} className="border-solid text-white-color">
                <td className="border-t-0 border-b-0 text-left p-4 relative ">
                  <div className="flex items-center">
                    <label className={`${styles.container} cursor-pointer`}>
                      <input
                        type="checkbox"
                        id="check"
                        // checked={index === selectedRowIndex}
                        value={item.responseID}
                        checked={selectedRowIndex.includes(index)}
                        onChange={() =>
                          handleCheckboxChange(index, item.responseID)
                        }
                      />
                      <span className={`${styles.checkmark}`}></span>
                    </label>
                    {rowStates[index].isEditing ? (
                      <button
                        className="w-10 h-10 bg-transparent p-0 m-0 border-none ml-5 cursor-pointer"
                        onClick={() =>
                          handleSaveButtonClick(index, item.responseID)
                        }
                      >
                        <Image
                          src={saveIcon}
                          alt="save icon"
                          width={47}
                          height={47}
                        />
                      </button>
                    ) : (
                      <button
                        className="w-10 h-10 bg-transparent p-0 m-0 border-none ml-5 cursor-pointer"
                        onClick={() => handleEditButtonClick(index)}
                      >
                        <Image
                          src={editIconGrey}
                          alt="edit icon"
                          width={47}
                          height={47}
                        />
                      </button>
                    )}
                  </div>
                </td>
                {
                  //questions
                }
                <td className="border-t-0 border-b-0 text-center p-4">
                  {rowStates[index].isEditing ? (
                    <textarea
                      rows={5}
                      value={rowStates[index].editedQuestion || item.question}
                      onChange={(e) =>
                        handleTextChange(index, 'question', e.target.value)
                      }
                      className="w-[296px] border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
                    />
                  ) : item.question ? ( // Check if item.question is not undefined
                    <ReadMore
                      text={item.question}
                      maxLength={100}
                      checkedRows={checkedRows[index]}
                    />
                  ) : (
                    <p>null</p> // Some default text or handling when question is not available
                  )}
                </td>
                {
                  //answer
                }
                <td className="border-t-0 border-b-0 text-center p-4">
                  {rowStates[index].isEditing ? (
                    <textarea
                      rows={5}
                      value={rowStates[index].editedAnswer || item.answer}
                      onChange={(e) =>
                        handleTextChange(index, 'answer', e.target.value)
                      }
                      className="w-[426px] border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
                    />
                  ) : item.answer ? ( // Check if item.question is not undefined
                    <ReadMore
                      text={item.answer}
                      maxLength={100}
                      checkedRows={checkedRows[index]}
                    />
                  ) : (
                    <p>null</p> // Some default text or handling when question is not available
                  )}
                </td>
                {
                  //software
                }
                <td className="border-t-0 border-b-0 text-center p-4">
                  {rowStates[index].isEditing ? (
                    <select
                      value={rowStates[index].editedSoftware || item.software}
                      onChange={(e) =>
                        handleTextChange(index, 'software', e.target.value)
                      }
                      className="border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value={item.software}>{item.software}</option>
                    </select>
                  ) : (
                    <p>{item.software}</p>
                  )}
                </td>
                {
                  //topic
                }
                <td className="border-t-0 border-b-0 text-center p-4">
                  {rowStates[index].isEditing ? (
                    <select
                      value={rowStates[index].editedTopic || item.topic}
                      onChange={(e) =>
                        handleTextChange(index, 'topic', e.target.value)
                      }
                      className="border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value={item.topic}>{item.topic}</option>
                    </select>
                  ) : (
                    <p>{item.topic}</p>
                  )}
                </td>
                {
                  //subtopic
                }
                <td className="border-t-0 border-b-0 text-center p-4 w-[200px]">
                  {rowStates[index].isEditing ? (
                    <select
                      value={rowStates[index].editedSubTopic || item.subtopic}
                      onChange={(e) =>
                        handleTextChange(index, 'subTopic', e.target.value)
                      }
                      className="border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value={item.subtopic}>{item.subtopic}</option>
                    </select>
                  ) : (
                    <p>{item.subtopic}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArchive;

