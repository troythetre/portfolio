import React, { useEffect, useState } from "react";
import ReadMore from "../../sectionC/AdminComponent/AdminLibraryResponse/ReadMore";
import styles from "../../sectionC/AdminComponent/AdminLibraryResponse/styles.module.css";
import SearchBar from "../../sectionC/AdminComponent/SearchBar/SearchBar";
import ErrorModal from "../../modals/errors/errorModal";
import { useRouter } from "next/router";
import { BASEURL } from "../../../constants";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Import the plus icon
import axios from "axios";
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
type ResponseDiv = {
    div: HTMLElement;
    active: boolean;
};

type Props = {
    sectionID: string;
    responsiveDivs: ResponseDiv[];
};

const InsertResponseLibrary = ({ sectionID, responsiveDivs }: Props) => {
    const [selectedRowIndex, setSelectedRowIndex] = useState<number[]>([]);
    const [selectedResponseIds, setSelectedResponseIds] = useState<String[]>([]);
    //Need for a prop to ReadMore Component
    const [checkedRows, setCheckedRows] = useState<{ [key: string]: boolean }>(
        {}
    );
    const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
    const [data, setData] = useState<ResponseItem[]>([]);
    const [filteredData, setFilteredData] = useState<ResponseItem[]>([]); // to hold filtered data state

    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const { proposalID } = router.query;
    console.log(proposalID)
    const fetchData = async () => {
        const response = await axios.get(`${BASEURL}/api/proposal/proposal-responses`, {
            params: { proposalID: proposalID },
            withCredentials: true
        })
            .then((response) => {
                setData(response.data.responses);
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

            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
                    setErrorDet(true)
                    setFourOhOne(true)
                    setDefError(false)
                } else {
                    setErrorMessage("An unknown error occurred. Please try again later.");
                    setErrorDet(true);
                    setDefError(true)
                    setFourOhOne(false)
                }
            });
    };

    //Created axios api handler so can be used in other section also.
    useEffect(() => {
        fetchData();
    }, []);

    // Search function to filter data
    const handleSearch = (filteredData: ResponseItem[]) => {
        setFilteredData(filteredData);
    };
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

    const handleAddMultipleResponses = (): void => {

        let answerString: string = '';

        data.map((el) => {
            if (selectedResponseIds.includes(el.responseID)) {
                answerString = answerString + ' \n\n' + el.answer;
            }
        })

        console.log(answerString);

        const focusedDiv = responsiveDivs.find(el => el.active === true);
        console.log("this is the focused element", focusedDiv);

        if (focusedDiv) {

            const children = focusedDiv.div.children;

            // Loop through the children
            for (let i = 0; i < children.length; i++) {
                const child = children[i];

                // Check if the child is a <p> tag
                if (child.tagName === "P") {
                    // Remove the child
                    focusedDiv.div.removeChild(child);
                }
            }

            let answerDiv = focusedDiv.div.childNodes[0];
            console.log(answerDiv);
            answerDiv.textContent = "";
            answerDiv.textContent = answerString;
            answerDiv.dispatchEvent(new Event('input', { bubbles: true }));

        } else {
            console.log("No valid target found");
        }
    }

    // Total count of responses
    const totalCount = filteredData.length || data.length;

    return (
        <div className="w-full px-5 pb-10">
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

            <div>
                <SearchBar data={data} setFilteredData={setFilteredData} onSearch={handleSearch} />
            </div>

            <div style={{ marginTop: '-25px' }} />
            <div className="flex justify-between items-center gap-0 mr-[50px] mb-0 mt-0 m-0">
                <p className="flex items-center text-lg font-poppins mb-10 mt-10 text-white-color">
                    Total {totalCount} responses
                </p>
                <button
                    className=" w-[200px] h-[42px] flex items-center justify-center rounded-2xl bg-black border-solid border-2 border-gold-gradient-gcbs bg-transparent text-[#FFE34E] text-md font-sans font-bold"
                    onClick={() => handleAddMultipleResponses()}>
                    <span className="text-[20px] text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">Add Responses</span>
                </button>

            </div>

            {data.length === 0 ? (
                // loading element with animated dots when the data is loading
                <div className="mt-32 w-full flex items-center justify-center">
                    <div className="text-2xl font-bold text-yellow-300">Loading </div>
                    <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">.</span>
                    <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">.</span>
                    <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">.</span>
                </div>
            ) : (
                data.length > 0 && (
                    <div
                        style={{ overflow: "auto", maxHeight: 500, marginTop: "-25px" }}
                        className={`border-2 border-collapse border-gray-500 table-auto border-solid rounded-xl tablecontainer ${styles.tableDiv}`}
                    >
                        <table
                            className={`mt-0 ml-0 mr-0 border-2 border-collapse border-gray-500 table-auto border-solid transactionHistory ${styles.transactionHistory}`}
                            style={{ tableLayout: "fixed", width: "100%" }}
                        >
                            <thead className="border-solid border-t border-b">
                                <tr className=" text-22 font-poppins font-semibold  ">

                                    <th style={{ width: '10%' }} className="border-t-0 border-b-0 text-center p-5 bg-clip-text bg-gradient-text text-transparent">
                                        {/* Empty cell */}
                                    </th>

                                    <th style={{ width: '40%' }} className="border-t-2 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent  ">
                                        Question
                                    </th>
                                    <th style={{ width: '50%' }} className="border-t-2 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                                        Answer
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="border-solid border-collapse border-t border-b">
                                {(filteredData.length > 0 ? filteredData : data).map((item, index) => (
                                    <tr key={index} className="border-solid text-white-color">
                                        {
                                            //Checkbox
                                        }
                                        <td className="border-t-0 border-b-2 border-white text-center p-2 font-poppins color-white">
                                            <div className='flex justify-center items-center pr-20'>
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
                                            </div>
                                        </td>
                                        {
                                            //Question
                                        }
                                        <td className="border-t-0 border-b-2 border-white text-center p-5 font-poppins color-white">
                                            {item.question ? ( // Check if item.question is not undefined
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
                                            {item.answer ? ( // Check if item.question is not undefined
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
                                            //Response button
                                        }
                                        <td className="text-center p-2">
                                            <div
                                                className="h-full w-full flex justify-center align-center bg-black text-[#FFE34E] text-md font-sans font-bold"
                                                onClick={() => handleAddResponse(item.answer)}>
                                                <AddCircleOutlineIcon />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};

export default InsertResponseLibrary;
