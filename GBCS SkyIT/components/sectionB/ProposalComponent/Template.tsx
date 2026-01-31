import React, { useEffect, useState, useRef, useReducer } from "react";
import ToolBar from "./ToolBar/ToolBar";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";
import ErrorModal from "../../modals/errors/errorModal";
import { dividerClasses } from "@mui/material";

interface Section {
    sectionID: string;
    sectionType: string;
    sectionTitle: string;
    content: string;
    order: number;
}
interface Version {
    versionID: string;
    sectionContent: string;
    timestamp: {
        _seconds: number;
        _nanoseconds: number;
    };
}
interface TemplateProps {
    selectedSectionID: string | null;
    setSections: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedItemIndex?: React.Dispatch<React.SetStateAction<number | null>>;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    sectionUpdated: boolean;
}

const EditableContent: React.FC<TemplateProps> = ({
    selectedSectionID,
    setSections,
    setSelectedItemIndex,
    setIsVisible,
    sectionUpdated,
}) => {
    // error states
    console.log(sectionUpdated);
    const [errorDet, setErrorDet] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);

    const router = useRouter();
    const [isInteractive, setIsInteractive] = useState(false);
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const contentEditableRefs = useRef<HTMLDivElement[]>([]);
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [sectionID, setSectionID] = useState<string>("");
    const [versionId, setVersionId] = useState<string>("");
    const [classNameKey, setClassNameKey] = useState<string>("");
    const { proposalID } = router.query; // Access the proposal ID from the query parameters
    const [sectionsData, setSectionsData] = useState<Section[]>([]);
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const [sectionVersionHistory, setSectionVersionHistory] = useState<Version[]>([]);
    const [currentVersionIndex, setCurrentVersionIndex] = useState<number>(0);
    const socketRef = useRef<WebSocket | null>(null);
    const [negotiateData, setNegotiateData] = useState<{
        webPubSubUrl: string | null;
        userID: string | null;
    }>({
        webPubSubUrl: null,
        userID: null,
    });
    const PAGE_HEIGHT = 850; // Height of each page
    const [dataChanged, setDataChanged] = useState(false); // Flag state to trigger re-render when server data changes
    const htmlContentRef = useRef<string>("");
    type QuestionType = {
        questionID: string;
        question: string;
    };

    const [questionData, setQuestionData] = useState<QuestionType[]>([]);

    useEffect(() => {
        fetchQuestions(proposalID);
    }, [proposalID]);

    const fetchQuestions = async (currentProposalID: any) => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/questions/${currentProposalID}`, {
                method: "GET",
                credentials: "include",
            });
            const jsonData = await response.json();
            setQuestionData(jsonData.questions);

            console.log(jsonData.questions);
        } catch (error) {
            console.error("Fetch error", error);
        }
    };
    const fetchData = async (currentProposalID: string | string[] | undefined) => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/get-all-sections/${currentProposalID}`, {
                method: "GET",
                credentials: 'include',
            });

            const jsonData = await response.json();
            setSectionsData(jsonData.sections);
            setSections(jsonData.sections);

            const questionData = jsonData.sections;
            // setQuestionData(questionData);
            // console.log("sections changed", questionData);
            setDataChanged(false); // Reset the flag after data is fetched
        } catch (error) {
            console.error("Fetch error", error);
            // if (error.response && error.response.status === 401) {
            //     setErrorMessage("Invalid authentication token or expired token. Please login again.");
            //     setErrorDet(true);
            //     setFourOhOne(true);
            //     setDefError(false);
            // } else {
            //     setErrorMessage("An unknown error occurred. Please try again later.");
            //     setErrorDet(true);
            //     setDefError(true);
            //     setFourOhOne(false);
            // }
        }
    };

    useEffect(() => {
        fetchData(proposalID); // Fetch data initially
    }, [proposalID, dataChanged]);

    useEffect(() => {
        fetchData(proposalID); // When page order is triggered
    }, [sectionUpdated]);

    const handleSelectedSection = (id: string) => {
        setSectionID(id);
    };

    //fetch section version for undo/redo logic
    const fetchVestionData = async (id: string, type: string) => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/section-version-history/${proposalID}/${id}/`, {
                method: "GET",
                credentials: "include",
            });

            const jsonData = await response.json();
            setSectionVersionHistory(jsonData.sectionVersionHistory);

            if (type === "UNDO") {
                if (currentVersionIndex >= 0) {
                    const previousVersionIndex = currentVersionIndex + 1;
                    setCurrentVersionIndex(previousVersionIndex);
                    setVersionId(jsonData.sectionVersionHistory[previousVersionIndex].versionID);
                }
            }

            if (type === "REDO") {
                if (currentVersionIndex > 0) {
                    const nextVersionIndex = currentVersionIndex - 1;
                    setCurrentVersionIndex(nextVersionIndex);
                    setVersionId(jsonData.sectionVersionHistory[nextVersionIndex].versionID);
                }
            }
        } catch (error) {
            console.error("Fetch error", error);
            //   if (error.response && error.response.status === 401) {
            //     setErrorMessage("Invalid authentication token or expired token. Please login again.");
            //     setErrorDet(true)
            //     setFourOhOne(true)
            //     setDefError(false)
            //     // Handle token refresh or reauthentication logic here
            //     // default error modal
            // } else {
            //     setErrorMessage("An unknown error occurred. Please try again later.");
            //     setErrorDet(true);
            //     setDefError(true)
            //     setFourOhOne(false)
            // }
        }
    };

    //Web socket
    useEffect(() => {
        const fetchNegotiate = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/negotiate`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                setNegotiateData({
                    webPubSubUrl: data.url,
                    userID: data.userId,
                });
            } catch (error) {
                console.error("Error fetching negotiation data:", error);
            }
        };

        fetchNegotiate();
    }, []);

    // set up socket
    useEffect(() => {
        if (negotiateData.webPubSubUrl) {
            const pubsubClient = new WebSocket(negotiateData.webPubSubUrl);

            pubsubClient.onopen = () => {
                console.log("Connected to the server.");
            };

            // Apply changes
            pubsubClient.onmessage = (event) => {
                const eventData = JSON.parse(event.data);
                const key = eventData.key;
                const update = eventData.htmlContent;
                const messageSectionID = eventData.sectionID;
                const messageProposalID = eventData.proposalID;
                const cursorPosition = eventData.cursorPosition;

                // Find the index of the corresponding sectionID in the sectionsData array
                //const index = sectionsData.findIndex((section) => section.sectionID === messageSectionID);
                const index = Array.isArray(sectionsData)
                    ? sectionsData.findIndex((section) => section.sectionID === messageSectionID)
                    : -1;

                // Update the contentEditableRef if the sectionID is found in sectionsData
                if (index !== -1) {
                    const contentEditableElement = contentEditableRefs.current[index];

                    if (contentEditableElement.innerHTML !== update) {
                        contentEditableElement.innerHTML = update;

                        // Only restore cursor position if the update is from the server
                        if (key !== classNameKey) {
                            // Restore cursor position
                            const selection = window.getSelection();
                            const range = new Range();
                            range.setStart(contentEditableElement.childNodes[0], cursorPosition);
                            selection?.removeAllRanges();
                            selection?.addRange(range);
                        }
                    }
                }
            };

            pubsubClient.onclose = (event) => {
                console.log("Disconnected from server. ");
            };

            // Cleanup function
            return () => {
                console.log("Closing WebSocket connection...");
                pubsubClient.close();
            };
        }
    }, [negotiateData.webPubSubUrl, sectionsData, classNameKey]);

    const handleActionFromChild = () => {
        setIsInteractive(true);
    };

    const handleAddTemplateClick = () => {
        if (setSelectedItemIndex) {
            const indexAdd = 5;
            setSelectedItemIndex(indexAdd);
            setIsVisible(true);
        }
    };

    const forceEditMode = () => {
        let editButton = document.getElementById("Edit-Mode-Toggle");
        if (editButton?.dataset.bool === "false") {
            editButton.click();
        }
    };

    const handleUpdateTemplate = async (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML;
        setHtmlContent(newContent);

        const responseSection = document.getElementById("responseSection");
        if (!responseSection) {
            console.log("Response section not found");
            return;
        }

        const maxHeight = 650;
        let totalHeight = 0;
        let overflowQuestions: { questionID: string; question: string; answer: string }[] = [];

        const questionElements = responseSection.querySelectorAll(".question");
        const answerElements = responseSection.querySelectorAll(".answer");

        for (let index = 0; index < answerElements.length; index++) {
            const answerElement = answerElements[index] as HTMLDivElement;
            const questionElement = questionElements[index] as HTMLDivElement;
            totalHeight += (questionElement?.scrollHeight || 0) + (answerElement?.scrollHeight || 0);

            if (totalHeight > maxHeight) {
                const questionText = questionElement?.innerText;
                const matchingQuestion = questionData?.find((q) => q.question === questionText);
                const questionID = matchingQuestion ? matchingQuestion.questionID : null;

                if (questionID) {
                    overflowQuestions.push({
                        questionID,
                        question: questionText,
                        answer: answerElement.innerText,
                    });

                    const updatedSectionsData = sectionsData.map((section) => {
                        if (section.sectionID === sectionID) {
                            const tempDiv = document.createElement("div");
                            tempDiv.innerHTML = section.content;

                            const questionElementInTemp = Array.from(tempDiv.querySelectorAll(".question")).find(
                                (el) => el.innerText === questionElement.innerText
                            );
                            const answerElementInTemp = Array.from(tempDiv.querySelectorAll(".answer")).find(
                                (el) => el.innerText === answerElement.innerText
                            );

                            if (questionElementInTemp && answerElementInTemp) {
                                questionElementInTemp.remove();
                                answerElementInTemp.remove();
                            }

                            const newContent = tempDiv.innerHTML;
                            return {
                                ...section,
                                content: newContent,
                            };
                        }
                        return section;
                    });

                    setSectionsData([...updatedSectionsData]);

                    questionElement.remove();
                    answerElement.remove();
                }
            }
        }

        if (overflowQuestions.length > 0) {
            forceEditMode();
            console.log("Overflow detected! Sending overflow data:", overflowQuestions);
            const obj = {
                overflowQuestions,
                proposalID,
                sectionID,
            };
            try {
                const response = await fetch(`${BASEURL}/api/proposal/section-overflow`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(obj),
                });

                if (response.ok) {
                    console.log("Overflow handled, new section created.");
                    setDataChanged(true);
                } else {
                    console.error("Failed to handle overflow.");
                }
            } catch (error) {
                console.error("Error handling overflow:", error);
            }
        } else {
            console.log("No overflow detected.");
        }
    };

    const handleAddQuestion = async () => {
        try {
            const obj = {
                proposalID: proposalID,
                sectionID: sectionID,

                question: "",
                answer: "",
                templateRefID: "",
                comment: "This is a key question regarding the project.",
                writers: "",
                reviewers: "",
            };
            console.log(obj);
        } catch (error) {
            console.error("Error adding question:", error);
        }
    };
    //POST updated content

    const fetchCheckConflicts = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/check-conflicts`, {
                method: "GET",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch conflict data");

            const { result, message } = await response.json();
            return result || false;
        } catch (error) {
            console.error("Error checking conflicts:", error);
            return false;
        }
    };

    const sendUpdateToServer = async () => {
        const checkAccept = await fetchCheckConflicts();
        if (checkAccept) {
            const messageObject = {
                key: classNameKey,
                userID: negotiateData.userID,
                cursorPosition: cursorPosition,
                proposalID: proposalID,
                sectionID: sectionID,
                htmlContent: htmlContent,
            };

            console.log("Ready to send to the server: ");

            try {
                const response = await fetch(`${BASEURL}/api/proposal/send-message`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(messageObject),
                });

                if (response.ok) {
                    console.log("Message sent to server successfully");
                } else {
                    console.error("Failed to send message to server");
                }
            } catch (error) {
                console.error("Error sending message to server:", error);
            }
        }
    };

    useEffect(() => {
        const debounceTimeout = setTimeout(async () => {
            const checkAccept = await fetchCheckConflicts();
            if (checkAccept) {
                await sendUpdateToServer();
            }
        }, 1000); // delay for debounce

        return () => clearTimeout(debounceTimeout);
    }, [negotiateData, htmlContent]);

    //Restore section version

    useEffect(() => {
        const handleRestoreClick = async () => {
            // Check if versionID is not empty
            if (versionId) {
                try {
                    const response = await fetch(`${BASEURL}/api/proposal/restore-section-version`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            proposalID: proposalID,
                            sectionID: sectionID,
                            versionID: versionId,
                        }),
                    });

                    if (response.ok) {
                        console.log("Section restored successfully");
                        setDataChanged(true); // Trigger re-render when section is successfully restored
                    } else {
                        console.error("Failed to restore section");
                    }
                } catch (error) {
                    console.error("Request error", error);
                }
            }
        };

        handleRestoreClick();
    }, [versionId]);

    // Function to handle undo/redo action
    const handleUndo = async () => {
        await fetchVestionData(sectionID, "UNDO");
        fetchData(proposalID);
    };

    const handleRedo = async () => {
        await fetchVestionData(sectionID, "REDO");
        fetchData(proposalID);
    };

    return (
        <>
            <div className="flex flex-row justify-around mt-4">
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
                <div className="ml-[8%]">
                    <div
                        style={{
                            // width: "650px",
                            // height: "870px",
                            margin: "0 auto",
                            // maxWidth: "750px",
                            // maxHeight: "900px",
                            fontSize: "20px",
                            position: "relative",
                            marginBottom: "15px",
                            display: "flex",
                            flexDirection: "column",
                            overflowX: "auto",
                        }}
                    >
                        {Array.isArray(sectionsData) &&
                            sectionsData.map((section, index) => (
                                <div
                                    //sectionsData.map((section, index)
                                    id={`page-${section.sectionID}`}
                                    key={section.sectionID}
                                    style={{
                                        flex: "0 0 auto",
                                        overflowY: "auto",
                                        marginBottom: "20px",
                                        position: "relative",
                                        height: PAGE_HEIGHT,
                                    }}
                                >
                                    <div
                                        ref={(element) => {
                                            if (element) contentEditableRefs.current[index] = element;

                                            // Assign the ref to the corresponding index in the array
                                            contentEditableRefs.current[index] = element as HTMLDivElement;
                                        }}
                                        data-question-id="q1"
                                        onInput={handleUpdateTemplate}
                                        onClick={() => handleSelectedSection(section.sectionID)}
                                        className="bg-[#FFFFFF]"
                                        contentEditable="true"
                                        style={{ pointerEvents: isInteractive ? "auto" : "none" }}
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                    <div>
                                        {/* import DOMPurify from 'dompurify'; */}

                                        {/* const sanitizedContent = DOMPurify.sanitize(e.currentTarget.innerHTML);
setHtmlContent(sanitizedContent); */}
                                    </div>
                                </div>
                            ))}
                    </div>
                    {/* Fixed button at the bottom */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md"
                        style={{
                            marginTop: "15px",
                            maxWidth: "775px",
                            marginLeft: "auto",
                            marginRight: "auto"
                        }} // Center the button
                    >
                        <button
                            className="w-full h-[59px] border-none text-[#686868] font-poppins text-22 bg-[#E6E6E6]"
                            onClick={handleAddTemplateClick}
                        >
                            + Add Page from Templates
                        </button>
                    </div>
                </div>
                <ToolBar
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onInteract={handleActionFromChild}
                    contentEditableRef={contentEditableRef}
                    sectionID={sectionID}
                    htmlContent={htmlContent}
                    setHtmlContent={setHtmlContent}
                />
            </div>
        </>
    );
};

export default EditableContent;
