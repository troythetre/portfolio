import React, { FC, useEffect, useState } from 'react';
import ReadMore from './ReadMore copy';
import styles from '../../AdminComponent/AdminLibraryResponse/styles.module.css';
import saveIcon from '../../../../public/images/responses/mainarea/save-icon.svg';
import editIconGrey from '../../../../public/images/dashboard/icon-edit-grey.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SearchBar from '../../AdminComponent/SearchBar/SearchBar';
import PreviewBtn from '../GroupBtn/PreviewBtn';
import Link from 'next/link';
import AdminAuth from '../../AdminComponent/AdminAuth/AdminAuth';
import { BASEURL } from '../../../../constants';
import axios from 'axios';

interface RowState {
  isEditing: boolean;
  editedQuestion: string;
  editedAnswer: string;
  editedSoftware: string;
  editedTopic: string;
  editedSubTopic: string;
  editedIcon: string;
}

interface DropdownValues {
  softwareOptions?: String[];
  topicOptions?: String[];
  subtopicOptions?: String[];
}
//interface to get all responses
interface ResponseItem {
  isEditing: boolean;
  responseID: string;
  question: string;
  answer: string;
  software: string;
  topic: string;
  subtopic: string;
}

const LibraryResponse: FC = () => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number[]>([]);
  const [selectedResponseIds, setSelectedResponseIds] = useState<String[]>([]);
  const [checkedRows, setCheckedRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedResponseId, setSelectedResponseId] = useState<String | null>(
    null
  );
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [data, setData] = useState<ResponseItem[]>([]);
  const [options, setOptions] = useState<DropdownValues>();
  const [rowStates, setRowStates] = useState<RowState[]>([]);
  const [filteredData, setFilteredData] = useState<ResponseItem[]>([]); // to hold filtered data state
  const [authorizationCode, setAuthorizationCode] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();

  const fetchSubTopicOptions = async (index: number, selectedTopic: String) => {
    // fetch get all subtopics
    try {
      //console.log('fetchSubTopicOptions for : ' + selectedTopic);
      const subTopicOptionsResponse = await axios.get(
        `${BASEURL}/api/proposal/get-subtopic-dropdown`,
        {
          params: {
            topic: selectedTopic,
            includeDeleted: false,
            includeNotDeleted: true,
          },
          withCredentials: true
        }
      );
      console.log(
        'subTopicOptionsResponse : ' +
        JSON.stringify(subTopicOptionsResponse.data)
      );
      console.log(
        'first value of subtopic: ' + subTopicOptionsResponse.data.subtopics[0]
      );
      const subTopicOptions = subTopicOptionsResponse.data.subtopics;
      setOptions((prevOptions) => ({
        ...prevOptions,
        subtopicOptions: subTopicOptions,
      }));
      // manually trigger handle text change for subtopic. this was not getting trigger on initialization.
      if (subTopicOptionsResponse.data.subtopics) {
        handleTextChange(
          index,
          'subTopic',
          subTopicOptionsResponse.data.subtopics[0]
        );
      }
      // .then((subTopicOptions) => {
      //   options.subtopicOptions = subTopicOptions.data.subtopics;
      console.log(subTopicOptions);
    } catch (error) {
      console.log('Error while fetching sub topic list : ', error);
    }
  };
  // dropdown option fetch data
  const fetchDropdownOptions = async () => {
    try {
      const fetchedOptions: DropdownValues = {};
      // Fetch software options
      const softwareresponse = await axios.get(`${BASEURL}/api/proposal/get-response-software-dropdown`, { withCredentials: true });
      fetchedOptions.softwareOptions = softwareresponse.data.message;

      // Fetch topic options
      const topicOptionsResponse = await axios.get(
        `${BASEURL}/api/proposal/get-topic-dropdown`,
        {
          params: {
            includeDeleted: false,
            includeNotDeleted: true,
          },
          withCredentials: true
        }
      );
      fetchedOptions.topicOptions = topicOptionsResponse.data.topics;

      // Fetch subtopic options for the first topic
      if (
        fetchedOptions.topicOptions &&
        fetchedOptions.topicOptions.length > 0
      ) {
        await fetchSubTopicOptions(fetchedOptions.topicOptions[0]);
        console.log(fetchSubTopicOptions);
      }

      setOptions(fetchedOptions);
      console.log('Dropdown options:', fetchedOptions);
    } catch (error) {
      console.log('Error while fetching dropdown options:', error);
    }
  };

  //  handle preview button to fetch data and show the results in preview responses

  const handlePreviewClick = (index: number, responseid: String) => {
    if (!isCheckboxSelected) {
      alert('Please select a checkbox before previewing.');
    }
  };

  // to show archive popup
  const [openAdminArchivePopup, handleAdminArchivePopupOpen] = useState(false);

  const fetchData = async () => {
    const response = await axios
      .get(`${BASEURL}/api/proposal/responses`, { withCredentials: true })
      .then((response) => {
        console.log('response.data size' + response.data.responses.length);
        setData(
          response.data.responses.map(
            (item: {
              responseID: any;
              question: any;
              Question: any;
              answer: any;
              Answer: any;
              software: any;
              Software: any;
              topic: any;
              Topic: any;
              subtopic: any;
              subTopic: any;
              SubTopic: any;
            }) => ({
              isEditing: false,
              responseID: item.responseID,
              question: item.question || item.Question,
              answer: item.answer || item.Answer,
              software: item.software || item.Software,
              topic: item.topic || item.Topic,
              subtopic: item.subtopic || item.subTopic || item.SubTopic,
            })
          )
        );
        setRowStates(
          response.data.responses.map(
            (item: {
              responseID: any;
              question: any;
              Question: any;
              answer: any;
              Answer: any;
              software: any;
              Software: any;
              topic: any;
              Topic: any;
              subtopic: any;
              subTopic: any;
              SubTopic: any;
            }) => ({
              isEditing: false,
              responseID: item.responseID,
              question: item.question || item.Question,
              answer: item.answer || item.Answer,
              software: item.software || item.Software,
              topic: item.topic || item.Topic,
              subtopic: item.subtopic || item.subTopic || item.SubTopic,
            })
          )
        );
        console.log('response.data ' + JSON.stringify(data));
      })
      .catch((error) => {
        console.log('Error while fetching data: ', error);
      });
  };

  //Created axios api handler so can be used in other section also.
  useEffect(() => {
    fetchData();
    fetchDropdownOptions();
    // fetchSubTopicOptions();
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
  // Handle check box selection. update the list
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
  // handle editing response

  const handleEditButtonClick = (index: number, responseID: string) => {
    //  const rowState = rowStates[index];
    //if more than one selected then dont edit.
    if (selectedRowIndex.length > 1) return;
    if (!authorizationCode) {
      console.log(
        'authorization code is null. authorizationCode : ' + authorizationCode
      );
      return;
    } else {
      console.log(
        'authorization code is present. authorizationCode : ' +
        authorizationCode
      );
    }
    const rowState = data[index]?.answer;
    // const answerLines = rowState.editedAnswer.length;
    // const answerLines = rowState.length;
    // console.log(answerLines);
    if (isCheckboxSelected) {
      setRowStates((prevRowStates) => {
        const newState = [...prevRowStates];
        // Toggle the isEditing state
        newState[index] = {
          ...newState[index],
          isEditing: !newState[index].isEditing,
          // Toggle the editedIcon state based on the current value
          editedIcon:
            newState[index].editedIcon === editIconGrey
              ? saveIcon
              : editIconGrey,
        };

        return newState;
      });
    }
  };

  // handle save button overall updated response
  const handleSaveButtonClick = async (index: number, responseID: string) => {
    const rowState = rowStates[index];
    const rowData = data[index];

    const updatedData = {
      authCode: authorizationCode,
      responseID: responseID,
      question: rowState.editedQuestion,
      answer: rowState.editedAnswer,
      software: rowState.editedSoftware || rowData.software,
      topic: rowState.editedTopic,
      subtopic: rowState.editedSubTopic,
    };
    console.log('updatedData=>' + JSON.stringify(updatedData));
    console.log('subtopic=>' + JSON.stringify(fetchSubTopicOptions));

    await axios
      .put(
        `${BASEURL}/api/proposal/edit-response/`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      )
      .then((resp) => {
        console.log(resp);
        fetchData();
        fetchDropdownOptions();

        setSelectedRowIndex([]);
        setIsCheckboxSelected(false);
        console.log(responseID);
      })
      .catch((error) => {
        console.error('Error while updating data: ', error.response.data);
      });
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
      console.log('editedField: ' + editedField);
      newState[index] = {
        ...newState[index],
        [editedField]: value,
      };

      return newState;
    });
  };

  // Search function to filter data
  const handleSearch = (filteredData: ResponseItem[]) => {
    setFilteredData(filteredData);
  };
  //  update total count

  //const totalCount = data?.length;

  // Total count of responses
  const totalCount = filteredData.length || data.length;

  return (
    <div className="ml-[420px] mr-[40px] mb-[20px] 3xl:ml-[756px] 3xl:mr-[72px] 3xl:mb-[36px]">
      <h1 className=" font-poppins font-normal text-5xl text-white-color m-0 pl-2 mb-5">
        Response Library
        <SearchBar
          data={data}
          setFilteredData={setFilteredData}
          onSearch={handleSearch}
        />
      </h1>
      {/* <div className="grid gap-0 grid-cols-6  "> */}
      {/* Show archive popup
          <div>
          {showPopup && <AdminAuth handleAuthCode={setAuthorizationCode} />}
        </div> */}

      <div className="mb-5 relative">
        <Link
          href={isCheckboxSelected ? `team-member/${selectedResponseIds}` : '#'}
        >
          <PreviewBtn onClick={handlePreviewClick} />
        </Link>
      </div>
      {/* show auth pop-up */}
      <div>
        {showPopup && (
          <AdminAuth
            showpopup={showPopup}
            setShowPopup={setShowPopup}
            handleAuthCode={setAuthorizationCode}
          />
        )}
      </div>

      <p className="text-lg font-poppins mb-5 text-white-color">
        Total {totalCount} responses
      </p>
      <div
        style={{ overflow: 'auto', maxHeight: 400 }}
        className={`border-2 border-collapse border-gray-500 table-auto border-solid rounded-xl ${styles.tableDiv}`}
      >
        <table
          className={`border-2 border-collapse border-gray-500 table-auto border-solid ${styles.transactionHistory} `}
        >
          <thead className="border-solid border-t border-b">
            <tr className=" text-30 font-poppins font-semibold">
              <th className="border-t-2 border-b-2 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                {/* <label className={`${styles.container} cursor-pointer`}>
                      <input
                        type="checkbox"
                        id={`checkbox`}
                        checked={false}
                      />
                      <span className={`${styles.checkmark} ${styles.checkmarkhead}`}></span>
                  </label> */}
              </th>

              <th className="border-t-2 border-b-2 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
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
          <tbody className="border-solid border-collapse border-t border-b">
            {(filteredData.length > 0 ? filteredData : data).map(
              (item, index) => (
                <tr key={index} className="border-solid text-white-color">
                  <td className="border-t-0 border-b-0 text-left p-4 relative ">
                    <div className="flex items-center">
                      <label className={`${styles.container} cursor-pointer`}>
                        <input
                          type="checkbox"
                          id={`${index}_checkbox`}
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
                          className={`w-10 h-10 bg-transparent p-0 m-0 border-none ml-5 cursor-pointer ${styles.savebtn}`}
                          onClick={() =>
                            handleSaveButtonClick(index, item.responseID)
                          }
                        // onChange={() => handleCheckboxChange(index, item.responseID)}
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
                          className={`w-10 h-10 bg-transparent p-0 m-0 border-none ml-5 cursor-pointer ${styles.editbtn}`}
                          onClick={() => {
                            setShowPopup(true);
                            handleEditButtonClick(index, item.responseID);
                          }}
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

                  <td className="border-t-0 border-b-0 text-left p-4">
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
                  <td className="border-t-0 border-b-0 text-left p-4">
                    {rowStates[index].isEditing ? (
                      <textarea
                        rows={3}
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
                        //options={rowStates[index].softwareOptions}
                        value={rowStates[index].editedSoftware || item.software}
                        onChange={(e) =>
                          handleTextChange(index, 'software', e.target.value)
                        }
                        className="border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
                      >
                        {options?.softwareOptions?.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
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
                        onChange={(e) => {
                          handleTextChange(index, 'topic', e.target.value);
                          fetchSubTopicOptions(index, e.target.value);
                          console.log(
                            'fetchSubTopicOptions for topic: ' + e.target.value
                          );
                        }}
                        className="border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
                      >
                        {options?.topicOptions?.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
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
                        {options?.subtopicOptions?.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    ) : (
                      <p>{item.subtopic}</p>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibraryResponse;
