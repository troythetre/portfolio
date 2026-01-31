import React, { FC, useEffect, useState } from "react";
import ReadMore from "./ReadMore";
import styles from "../AdminLibraryResponse/styles.module.css";
import saveIcon from "../../../../public/images/responses/mainarea/save-icon.svg";
import editIconGrey from "../../../../public/images/dashboard/icon-edit-grey.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import SearchBar from "../SearchBar/SearchBar";
import ArchiveBtn from "../../TeamMemberComponent/GroupBtn/ArchiveBtn";
import ExportBtn from "../../TeamMemberComponent/GroupBtn/ExportBtn";
import Link from "next/link";
import AdminArchivePopup from "../../AdminComponent/AdminArchive/AdminArchivePopup";
import DiscardChangesBtn from "../../TeamMemberComponent/GroupBtn/DiscardChangesBtn";
import SaveTableBtn from "../../TeamMemberComponent/GroupBtn/SaveTableBtn";
import ErrorModal from "../../../modals/errors/errorModal";
import { BASEURL } from "../../../../constants";
import axios from "axios";

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

const AdminLibraryResponse: FC = () => {
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
  const router = useRouter();

  const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox

  // error modal states
  const [errorDet, setErrorDet] = useState(false);
  const [fourOhOne, setFourOhOne] = useState(false);
  const [defError, setDefError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSubTopicOptions = async (index: number, selectedTopic: String) => {
    // fetch get all subtopics
    try {
      const subTopicOptionsResponse = await axios.get(
        `${BASEURL}/api/proposal/get-subtopic-dropdown`,
        {
          params: {
            topic: selectedTopic,
            includeDeleted: false,
            includeNotDeleted: true,
          },
          withCredentials: true,
        }
      );
      console.log(
        "subTopicOptionsResponse : " +
        JSON.stringify(subTopicOptionsResponse.data)
      );
      console.log(
        "first value of subtopic: " + subTopicOptionsResponse.data.subtopics[0]
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
          "subTopic",
          subTopicOptionsResponse.data.subtopics[0]
        );
      }
      // .then((subTopicOptions) => {
      //   options.subtopicOptions = subTopicOptions.data.subtopics;
      console.log(subTopicOptions);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("Bad request.");
      } else if (error.response && error.response.status === 401) {
        setErrorMessage(
          "Invalid authentication token or expired token. Please login again."
        );
        setErrorDet(true);
        setFourOhOne(true);
        setDefError(false);
      } else {
        setErrorMessage("An unknown error occurred. Please try again later.");
        setErrorDet(true);
        setDefError(true);
        setFourOhOne(false);
      }
    }
  };

  // dropdown option fetch data
  const fetchDropdownOptions = async () => {
    try {
      const fetchedOptions: DropdownValues = {};
      // Fetch software options
      const softwareresponse = await axios.get(`${BASEURL}/api/proposal/get-response-software-dropdown`,
        {
          withCredentials: true
        }
      );
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
      console.log("Dropdown options:", fetchedOptions);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage(
          "Invalid authentication token or expired token. Please login again."
        );
        setErrorDet(true);
        setFourOhOne(true);
        setDefError(false);
      } else {
        setErrorMessage("An unknown error occurred. Please try again later.");
        setErrorDet(true);
        setDefError(true);
        setFourOhOne(false);
      }
    }
  };

  // to show archive popup
  const [openAdminArchivePopup, handleAdminArchivePopupOpen] = useState(false);

  const fetchData = async () => {
    const response = await axios.get(`${BASEURL}/api/proposal/responses`, { withCredentials: true })
      .then((response) => {
        setData(response.data.responses);
        console.log("response.data size" + response.data.responses.length);
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
        console.log("response.data " + JSON.stringify(data));
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMessage(
            "Invalid authentication token or expired token. Please login again."
          );
          setErrorDet(true);
          setFourOhOne(true);
          setDefError(false);
        } else {
          setErrorMessage("An unknown error occurred. Please try again later.");
          setErrorDet(true);
          setDefError(true);
          setFourOhOne(false);
        }
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
    setSelectedRowIndex(newSelectedRows);
    setIsCheckboxSelected(newSelectedRows.length > 0);

    // Update selected response IDs and row indices
    handleSelectedResponseId(responseid);
    setSelectedRowIndex(newSelectedRows);
    setCheckedRows((prevCheckedRows) => ({
      ...prevCheckedRows,
      [index]: !prevCheckedRows[index],
    }));

    // Update "Select All" checkbox state
    setSelectAll(newSelectedRows.length === data.length);
  };
  const handleSelectAll = () => {
    const newSelectAll = !selectAll; // Toggle the "Select All" state
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      // Select all rows
      setSelectedRowIndex(data.map((_, index) => index)); // Select all row indices
      setSelectedResponseIds(data.map((item) => item.responseID)); // Select all response IDs
      setCheckedRows(
        data.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
      );
    } else {
      // Deselect all rows
      setSelectedRowIndex([]);
      setSelectedResponseIds([]);
      setCheckedRows({});
    }
  };

  // handle editing response

  const handleEditButtonClick = (index: number, responseID: string) => {
    //  const rowState = rowStates[index];
    //if more than one selected then dont edit.
    if (selectedRowIndex.length > 1) return;
    const rowState = data[index]?.answer;
    // const answerLines = rowState.editedAnswer.length;
    const answerLines = rowState.length;
    console.log(answerLines);
    if (answerLines > 100 && selectedRowIndex.includes(index)) {
      console.log(answerLines);
      // Navigate to another page
      router.push({
        pathname: `/team-member/Edit-Response/${responseID}`,
      });
    } else if (selectedRowIndex.includes(index)) {
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
      responseID: responseID,
      question: rowState.editedQuestion,
      answer: rowState.editedAnswer,
      software: rowState.editedSoftware || rowData.software,
      topic: rowState.editedTopic,
      subtopic: rowState.editedSubTopic,
    };
    console.log("updatedData=>" + JSON.stringify(updatedData));
    console.log("subtopic=>" + JSON.stringify(fetchSubTopicOptions));

    await axios.put(
      `${BASEURL}/api/proposal/edit-response/${responseID}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    )
      .then((resp) => {
        console.log(resp);
        fetchData();
        fetchDropdownOptions();
        setSelectedRowIndex([]);
        setIsCheckboxSelected(false);
        alert("Data has been updated successfully");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setErrorMessage(
            "Invalid authentication token or expired token. Please login again."
          );
          setErrorDet(true);
          setFourOhOne(true);
          setDefError(false);
        } else {
          setErrorMessage("An unknown error occurred. Please try again later.");
          setErrorDet(true);
          setDefError(true);
          setFourOhOne(false);
        }
      });
  };

  //Handle Discard Changes

  const handleDiscardChanges = () => {
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard the changes?"
    );
    if (confirmDiscard) {
      setRowStates((prevRowStates) => {
        return prevRowStates.map((rowState) => ({
          ...rowState,
          isEditing: false, // Reset editing state
          editedQuestion: "", // Reset edited question
          editedAnswer: "", // Reset edited answer
          editedSoftware: "", // Reset edited software
          editedTopic: "", // Reset edited topic
          editedSubTopic: "", // Reset edited subtopic
        }));
      });
    }
  };

  // handle open button
  const handleOpenClick = () => {
    if (!isCheckboxSelected) {
      alert("Please select a checkbox before open.");
    }
  };
  // handle ArchiveBtn
  const handleArchiveClick = () => {
    if (isCheckboxSelected) {
      handleAdminArchivePopupOpen(true);
    } else {
      alert("Please select a checkbox before open.");
    }
  };
  // handle ExportBtn
  const handleExportClick = (event) => {
    event.preventDefault(); // To prevent the page from going to a 404 error page after download

    if (!isCheckboxSelected) {
      alert(
        "Please select a response by clicking the checkbox before proceeding with the export"
      );
      return;
    }

    // Fetch selected responses based on their IDs
    const selectedResponses = data.filter((item) =>
      selectedResponseIds.includes(item.responseID)
    );

    console.log("Selected Responses:", selectedResponses); // Debugging: Check selected responses

    // Ensure selected responses contain data
    if (selectedResponses.length === 0) {
      alert("No responses selected for export");
      return;
    }

    // Define column headers
    const headers = ["Question", "Answer", "Software", "Topic", "Sub-Topic"];

    // Convert selected responses to CSV format
    const csvContent = [
      headers.join(","), // Add column headers as the first row
    ];

    selectedResponses.forEach((response) => {
      const rowData = [
        response.question || "",
        response.answer || "",
        response.software || "",
        response.topic || "",
        response.subtopic || "",
      ].map((value) => `"${value.replace(/"/g, '""')}"`);
      csvContent.push(rowData.join(",")); // Add row to CSV content
    });

    // Check if csvContent contains only headers
    if (csvContent.length === 1) {
      alert("No data available for export");
      return;
    }

    console.log(csvContent.join("\n")); // Debugging: Check the generated CSV content

    // Download the CSV file
    const blob = new Blob([csvContent.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Responses.csv";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTextChange = (
    index: number,
    field: "question" | "answer" | "software" | "topic" | "subTopic",
    value: string
  ) => {
    setRowStates((prevRowStates) => {
      const newState = [...prevRowStates];
      const editedField = `edited${field.charAt(0).toUpperCase() + field.slice(1)
        }` as keyof RowState;
      console.log("editedField: " + editedField);
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
      {errorDet && (
        <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center bg-black bg-opacity-50 backdrop-blur">
          <ErrorModal
            errorMessage={errorMessage}
            fourOhOne={fourOhOne}
            setFourOhOne={setFourOhOne}
            setErrorDet={setErrorDet}
            defError={defError}
            setDefError={setDefError}
          />
        </div>
      )}

      <h1 className="font-poppins font-normal text-3xl text-white-color m-0 pl-0 mb-3">
        Response Library
        <div style={{ marginTop: "17px" }} /> {/* spacing above search bar */}
        <div>
          <SearchBar
            data={data}
            setFilteredData={setFilteredData}
            onSearch={handleSearch}
          />
        </div>
        <div style={{ marginBottom: "20px" }} /> {/* spacing below search bar */}
      </h1>

      {openAdminArchivePopup && (
        <AdminArchivePopup
          handleClose={() => {
            handleAdminArchivePopupOpen(false);
            fetchData();
            fetchDropdownOptions();
            setCheckedRows({});
            setSelectedRowIndex([]);
            setIsCheckboxSelected(false);
            setSelectedResponseIds([]);
          }}
          responseIDs={selectedResponseIds}
          totalCount={totalCount}
        />
      )}

      {/* contains all 4 buttons in one row */}
      <div className="flex justify-between items-center mx-4 mt-4">
        <div className="flex items-center gap-6">
          {/* all buttons left justified */}
          <ArchiveBtn onClick={handleArchiveClick} />
          <Link href={isCheckboxSelected ? `team-member/${selectedResponseId}` : ""}>
            <ExportBtn onClick={handleExportClick} />
          </Link>
          <DiscardChangesBtn
            onDiscardChanges={handleDiscardChanges}
            buttonText="Discard Changes"
          />
          <SaveTableBtn buttonText="Save Table" />
        </div>
      </div>

      <div style={{ marginTop: "-60px" }} />
      <div style={{ marginBottom: "45px" }} />

      {data.length === 0 ? (
        // loading element with animated dots when the data is loading
        <div className="mt-32 w-full flex items-center justify-center">
          <div className="text-2xl font-bold text-yellow-300">Loading </div>
          <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">
            .
          </span>
          <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">
            .
          </span>
          <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">
            .
          </span>
        </div>
      ) : (
        data.length > 0 && (
          <div
            style={{ overflow: "auto", maxHeight: 500, marginTop: "-25px" }}
            className={`border-2 border-collapse border-gray-500 table-auto border-solid rounded-xl tablecontainer whitespace-normal break-words overflow-wrap-anywhere ${styles.tableDiv}`}
          >
            <table
              className={`mt-0 ml-0 mr-0 border-2 border-collapse border-gray-500 table-auto border-solid transactionHistory ${styles.transactionHistory}`}
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead className="border-solid border-t border-b">
                <tr className="text-22 font-poppins font-semibold">
                  <th className="border-t-2 border-b-0 text-left p-4 bg-clip-text bg-gradient-text text-transparent">
                    <label className={`${styles.container} cursor-pointer`}>
                      <input
                        type="checkbox"
                        id="checkbox"
                        checked={selectAll} // Bind to "Select All" state
                        onChange={handleSelectAll} // Trigger "Select All" handler
                      />
                      <span
                        className={`${styles.checkmark} ${styles.checkmarkhead}`}
                      ></span>
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
                {(filteredData.length > 0 ? filteredData : data).map(
                  (item, index) => (
                    <tr key={index} className="border-solid text-white-color">
                      <td className="border-t-0 border-b-2 text-centre p-4 relative ">
                        <div className="flex items-center">
                          <label
                            className={`${styles.container} cursor-pointer`}
                          >
                            <input
                              type="checkbox"
                              id={`${index}_checkbox`}
                              value={item.responseID}
                              checked={checkedRows[index] || false} // Bind to individual checkbox state
                              onChange={() =>
                                handleCheckboxChange(index, item.responseID)
                              } // Trigger row handler
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
                              onClick={() =>
                                handleEditButtonClick(index, item.responseID)
                              }
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

                      <td className="border-t-0 border-b-2 border-white text-center p-5 font-poppins color-white">
                        {rowStates[index].isEditing ? (
                          <textarea
                            rows={5}
                            value={
                              rowStates[index].editedQuestion !== undefined
                                ? rowStates[index].editedQuestion
                                : item.question
                            }
                            //value={rowStates[index].editedQuestion || item.question}
                            onChange={(e) =>
                              handleTextChange(
                                index,
                                "question",
                                e.target.value
                              )
                            }
                            className="w-[100%] max-w-[300px] h-[95px] border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color text-center rounded-lg px-2 py-1 focus:outline-none text-white-color"
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
                      <td className="border-t-0 border-b-2 border-white text-center p-5 font-poppins color-white">
                        {rowStates[index].isEditing ? (
                          <textarea
                            rows={3}
                            value={
                              rowStates[index].editedAnswer !== undefined
                                ? rowStates[index].editedAnswer
                                : item.answer
                            }
                            //value={rowStates[index].editedAnswer || item.answer}
                            onChange={(e) =>
                              handleTextChange(index, "answer", e.target.value)
                            }
                            className="w-[100%] max-w-[300px] h-[95px] border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color text-center rounded-lg px-1 py-1 focus:outline-none"
                          />
                        ) : item.answer ? ( // Check if item.question is not undefined
                          <ReadMore
                            text={item.answer}
                            maxLength={120}
                            checkedRows={checkedRows[index]}
                          />
                        ) : (
                          <p>null</p> // Some default text or handling when question is not available
                        )}
                      </td>
                      {
                        //software
                      }
                      <td className="border-t-0 border-b-0 text-center p-2">
                        {rowStates[index].isEditing ? (
                          <select
                            //options={rowStates[index].softwareOptions}
                            value={
                              rowStates[index].editedSoftware || item.software
                            }
                            onChange={(e) =>
                              handleTextChange(
                                index,
                                "software",
                                e.target.value
                              )
                            }
                            className="w-[90%] border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
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
                      <td className="border-t-0 border-b-0 text-center p-2">
                        {rowStates[index].isEditing ? (
                          <select
                            value={rowStates[index].editedTopic || item.topic}
                            onChange={(e) => {
                              handleTextChange(index, "topic", e.target.value);
                              fetchSubTopicOptions(index, e.target.value);
                              console.log(
                                "fetchSubTopicOptions for topic: " +
                                e.target.value
                              );
                            }}
                            className="w-[90%] border-2 border-b-yellow-color bg-primary-gbcs-black text-white-color rounded-lg px-2 py-1 focus:outline-none"
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
                      <td className="border-t-0 border-b-0 text-center p-2 w-[200px]">
                        {rowStates[index].isEditing ? (
                          <select
                            value={
                              rowStates[index].editedSubTopic || item.subtopic
                            }
                            onChange={(e) =>
                              handleTextChange(
                                index,
                                "subTopic",
                                e.target.value
                              )
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
        )
      )}
    </div>
  );
};

export default AdminLibraryResponse;
