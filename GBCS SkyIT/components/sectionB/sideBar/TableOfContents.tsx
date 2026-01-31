import React, { useState, useEffect, ReactEventHandler } from "react";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import OverlayComponent from "./OverlayComponent";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import DeleteCard from "./DeleteCard";
import SectionQuestionList from "./SectionQuestionList";
import DropIndicator from "./DropIndicator";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Import the plus icon
import CreateSection from "./CreateSection";
import AddQuestionCard from "../../sectionA/SectionSubComp/AddQuestionCard";


interface Section {
    sectionID: string;
    sectionType: string;
    sectionTitle: string;
    content: string;
}
interface TableOfContentsProps {
    editSectionLabel: boolean;
    setSelectedSectionID: React.Dispatch<React.SetStateAction<string | null>>;
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<any[]>>;
}

type SectionQuestions = {
    forSection: string
    questions: string[];
    toggled: boolean;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
    editSectionLabel,
    setSelectedSectionID,
    sections,
    setSections,
}) => {
    const router = useRouter();
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | undefined>();
    const [overlays, setOverlays] = useState<{ showDeleteCard: boolean, showCreateSection: boolean; showAddQuestionModal: boolean; }>({
        showDeleteCard: false,
        showCreateSection: false,
        showAddQuestionModal: false
    });
    const [proposalIDSections, setProposalIDSections] = useState<string[]>([]);
    const [allSections, setAllSections] = useState<Section[]>([]);
    // const proposalID = "RFP175";
    const { proposalID, openedFromSectionID } = router.query;
    const [sectionName, setSectionName] = useState(""); // Initial RFP Name
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [sectionQuestions, setSectionQuestions] = useState<SectionQuestions[]>([]);

    const [dragData, setDragData] = useState({ sectionPlacement: "", sectionID: "" });
    const [section, setSection] = useState<Section[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [currentSectionID, setCurrentSectionID] = useState<string | null>(null);
    const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);



    //fetch proposalID and sectionID's
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/single-proposal/${proposalID}`, {
                    method: "GET",
                    credentials: "include",
                });

                const jsonData = await response.json();
                setProposalIDSections(jsonData);

            } catch (error) {
                console.error("Fetch error", error);
            }
        };

        fetchData();


    }, []);

    useEffect(() => {
        const fetchAllQuestionData = async () => {
            try {
                //fetch all questions

                const allQuestionData = await axios.get(`${BASEURL}/api/proposal/questions/${proposalID}`, {
                    method: "GET",
                    withCredentials: true,
                });

                let loadArray: SectionQuestions[] = [];
                let questionArray = await allQuestionData.data.questions;

                //make a section Object for every unique sectionID
                sections.forEach(s => {

                    let filteredQuestions = questionArray.filter((q: any) => q.sectionID === s.sectionID); //filter any questions that belong to section
                    let qAsStringArray: string[] = [];
                    let initialToggle = false;

                    if (openedFromSectionID && s.sectionID === openedFromSectionID) {
                        initialToggle = true;
                    }

                    filteredQuestions.forEach((q2: any) => qAsStringArray = [...qAsStringArray, q2.question]); //add those questions to question array for corresponding section

                    loadArray = [...loadArray, { forSection: s.sectionID, questions: qAsStringArray, toggled: initialToggle }];

                })
                setSectionQuestions(loadArray);

            } catch (error) {
                console.error("No Questions available", error);
            }
        };
        fetchAllQuestionData();
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!event.target.closest('.dropdown-menu') && !event.target.closest('.icon-container')) {
                setOpenDropdowns({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
        // console.log(proposalIDSections);
    }, [proposalIDSections]);

    const handleEditClick = (sectionID: string) => {
        setEditMode((prevState) => ({
            ...prevState,
            [sectionID]: true,
        }));
    };

    // Inside your handleInputChange function
    const handleInputChange = (sectionID: string, value: string) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.sectionID === sectionID ? { ...section, sectionTitle: value } : section
            )
        );
        setSectionName(value); // Update sectionName state
    };

    // Function to handle showing the success message
    const handleShowSuccessMessage = () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000); // Hide after 3 seconds
    };

    // const closeAddQuestionModal = () => {
    //     setShowAddQuestionModal(false);
    // };

    const handleSaveClick = async (sectionID: string) => {
        try {
            const payload = {
                proposalID: proposalID,
                sectionID: sectionID,
                newSectionName: sectionName,
            };
            const response = await fetch(`${BASEURL}/api/proposal/update-section-name`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log("Name updated successfully", response);
                setEditMode((prevState) => ({
                    ...prevState,
                    [sectionID]: false,
                }));
            } else {
                console.error("Failed to update name");
            }
        } catch (error) {
            console.error("Request error", error);
        }
    };

    const handleCancelClick = (sectionID: string) => {
        // Handle cancel logic here
        setEditMode((prevState) => ({
            ...prevState,
            [sectionID]: false,
        }));
    };

    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: !prevOverlays[overlayName] }));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: false }));
    };

    const handleItemClick = (id: string) => {
        const pageElement = document.getElementById(`page-${id}`);
        console.log(pageElement);
        if (pageElement) {
            pageElement.scrollIntoView({ behavior: "auto" });
        }
        setActiveItem(id);
        setSelectedSectionID(id);
    };


    const handleDeleteClick = (id: string) => {
        // Check if the id exists in the proposalIDSections array
        //const idExists = proposalIDSections.singleProposal.sections.some((item) => item.sectionID === id);
        const idExists =
            proposalIDSections.singleProposal &&
            Array.isArray(proposalIDSections.singleProposal.sections) &&
            proposalIDSections.singleProposal.sections.some((item) => item.sectionID === id);

        if (idExists) {
            // Set the deleteId state to the id
            setDeleteId(id);
            toggleOverlay("showDeleteCard");
        } else {
            console.error("Section ID does not exist in proposalIDSections array");
        }
    };

    // const handleAddSection = (id: string) => {
    //     setSection(id),
    //         toggleOverlay("showCreateSection");
    // }

    const handleAddSection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();  // Stops the click event from propagating
        e.preventDefault();   // Prevents default behavior like scrolling
        setOpenDropdowns((prev) => {
            // Close all other dropdowns if any are open
            const newDropdownState = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {} as { [key: string]: boolean });

            // Toggle the current dropdown
            newDropdownState[id] = !prev[id];
            return newDropdownState;
        });
    };

    const handleAddQuestionClick = (e: React.MouseEvent, sectionID: string) => {
        e.stopPropagation();  // Stops the click event from propagating
        e.preventDefault();
        setCurrentSectionID(sectionID);
        console.log("In Table of contents section id", sectionID)
        toggleOverlay("showAddQuestionModal"); // Open Add Question Modal
    };

    const handleChooseTemplateClick = () => {
        toggleOverlay("showCreateSection"); // Open Choose Template Modal (already implemented)
    };


    const handleCreateSection = (newSection: Section) => {
        setSection((prevSections) => [...prevSections, newSection]);
        closeOverlay("showCreateSection"); // Close the overlay after adding
    };
    const handleConfirmDelete = async () => {
        if (deleteId !== undefined) {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/delete-section`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposalID: proposalID,
                        sectionID: deleteId, // Use the deleteId variable directly
                    }),
                });

                if (response.ok) {
                    console.log("Section deleted successfully");
                    setSections((prevSections) =>
                        prevSections.filter((section) => section.sectionID !== deleteId)
                    );
                    // Reload the web page after deleting the selected target
                    window.location.reload();
                } else {
                    console.error("Failed to delete section");
                }
            } catch (error) {
                console.error("Request error", error);
            }
        }
        toggleOverlay("showDeleteCard");
    };

    const renderOverlayComponent = (
        <>
            {overlays.showDeleteCard && (
                <OverlayComponent show={overlays.showDeleteCard} onClose={() => closeOverlay("showDeleteCard")}>
                    <DeleteCard
                        onCancelDeleteCard={() => closeOverlay("showDeleteCard")}
                        onConfirmDeleteClick={handleConfirmDelete}
                    />
                </OverlayComponent>
            )}

            {overlays.showCreateSection && (
                <OverlayComponent show={overlays.showCreateSection} onClose={() => closeOverlay("showCreateSection")}>
                    <CreateSection
                        onCancelCreateSection={() => closeOverlay("showCreateSection")}
                        updateSection={setSection}
                        onCreateSection={handleCreateSection} // Pass the create handler
                        sectionID={section} // Pass the sectionID here
                    />
                </OverlayComponent>
            )}

            {overlays.showAddQuestionModal && (
                <OverlayComponent show={overlays.showAddQuestionModal} onClose={() => closeOverlay("showAddQuestionModal")}>
                    <AddQuestionCard setOpen={() => { closeOverlay("showAddQuestionModal"); handleShowSuccessMessage() }} setRefresh={setRefresh} secID={currentSectionID} setOpenDropdowns={setOpenDropdowns} />
                </OverlayComponent>
            )}
        </>
    );
    //Drag and drop handlers
    const handleDropdownClick = (currentSectionID: string) => {
        //find the selected section in our array and swap the toggle
        const newDropdownToggles = sectionQuestions.map((el) => {

            if (el.forSection === currentSectionID) {
                return { ...el, toggled: !el.toggled };
            } else {
                return el;
            }
        });
        setSectionQuestions(newDropdownToggles); //set new toggles
    };
    const handleDragStart = (e: React.DragEvent, sectionID: string, index: string) => {
        let newDragData = { sectionPlacement: index, sectionID: sectionID };
        setDragData(newDragData);
    }
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        highLightIndicator(e);
    }

    const highLightIndicator = (e: React.DragEvent) => {

        const indicators: HTMLDivElement[] = getIndicators();
        clearHighlights(indicators);
        const el = getNearestIndicator(e, indicators);
        el.element.style.opacity = "1"
        el.element.style.height = "25px"
    }

    const getIndicators = (): HTMLDivElement[] => {
        return Array.from(document.querySelectorAll('div.indicator'))
    }

    const getNearestIndicator = (e: React.DragEvent, indicatorList: HTMLDivElement[]) => {
        const distanceOffset = 25;
        const nearest = indicatorList.reduce(
            (closest: { offset: number, element: HTMLElement }, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - (box.top + distanceOffset);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicatorList[indicatorList.length - 1]
            }
        )

        return nearest;
    }

    const clearHighlights = (els?: HTMLDivElement[]) => {
        const indicators = els || getIndicators();
        indicators.forEach((i) => {
            i.style.opacity = "0";
            i.style.height = "2px"
        })
    }

    const handleDragEnd = (e: React.DragEvent) => {
        clearHighlights();

        const currentSectionPlacement = dragData.sectionPlacement;
        const currentSectionID = dragData.sectionID;
        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || "-l";

        if ((before !== currentSectionPlacement) && (parseInt(before) - parseInt(currentSectionPlacement) !== 1)) {

            let copy = [...sections];
            let sectionToMove = copy.find((s) => s.sectionID === currentSectionID);
            if (!sectionToMove) return;

            copy = copy.filter((s) => s.sectionID !== currentSectionID);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(sectionToMove);
            } else {

                const insertAtIndex = copy.findIndex((el) => sections.indexOf(el).toString() === before)
                copy.splice(insertAtIndex, 0, sectionToMove);

            }

            setSections(copy);

        }

    }

    const handleDragOverIcon = (e: React.DragEvent) => { //function to maintain icon over entire contents div
        e.preventDefault();
    }

    return (
        <div className="text-white mx-6 my-1 self-start w-[80%]"
            onDragOver={(e) => handleDragOverIcon(e)}
            onDragEnter={(e) => handleDragOverIcon(e)}
            onDragLeave={(e) => handleDragOverIcon(e)}>
            {sections && Array.isArray(sections) && sections.map((section, indx) => (
                <div key={`table-indx-${indx}`}>
                    <DropIndicator beforeId={indx.toString()} key={`Drop-indx-${indx}`} />
                    <div key={`section-${section.sectionID}-${indx}`}
                        draggable={editSectionLabel ? 'true' : 'false'}
                        onDragStart={(e) => handleDragStart(e, section.sectionID, indx.toString())}
                        onDragOver={(e) => handleDragOver(e)}
                        onDragEnd={(e) => handleDragEnd(e)}
                        className="">
                        <div className="flex justify-between">
                            {editSectionLabel && (
                                <div className="flex flex-row items-center mr-2 cursor-grab active:cursor-grabbing">
                                    <DragIndicatorOutlinedIcon />
                                </div>
                            )}
                            <div
                                //sections.map((section) =>  
                                key={section.sectionID}
                                className={`font-poppins w-full text-sm my-2 cursor-pointer ${activeItem === section.sectionID
                                    ? "border-b-2 border-yellow-400 text-yellow-400 underline"
                                    : "text-white"
                                    }`}
                                onClick={() => handleItemClick(section.sectionID)}
                            >

                                <div className="flex flex-row justify-between">

                                    {editMode[section.sectionID] ? (
                                        <div className="flex flex-row w-[75%]">
                                            <div className="w-[75%]">
                                                <input
                                                    type="text"
                                                    value={section.sectionTitle}
                                                    className="absolute -mt-0.5 -ml-0.5 z-10 w-[180px] h-8 px-5 text-gray-color text-lg font-medium  leading-10 tracking-tight bg-accent-color rounded-lg  border-none justify-start items-center gap-2.5 inline-flex"
                                                    onChange={(e) => handleInputChange(section.sectionID, e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-row mr-2 w-[25%]">
                                                <div className="mr-2">
                                                    <BookmarkBorderIcon onClick={() => handleSaveClick(section.sectionID)} />
                                                </div>
                                                <CloseIcon onClick={() => handleCancelClick(section.sectionID)} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>{section.sectionTitle}</div>
                                    )}

                                    {editSectionLabel && (
                                        <div className="flex flex-row items-center icon-container">
                                            <EditOutlinedIcon onClick={() => handleEditClick(section.sectionID)} />
                                            <DeleteOutlineOutlinedIcon onClick={() => handleDeleteClick(section.sectionID)} />
                                            <AddCircleOutlineIcon onClick={(e) => handleAddSection(section.sectionID, e)} />

                                            {/* Dropdown to appear when the + icon is clicked */}
                                            {openDropdowns[section.sectionID] && (
                                                <div className="dropdown-menu absolute bg-gray-800 rounded shadow-lg py-2 mt-1 w-48">
                                                    <ul className="text-white text-sm">
                                                        <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={(e) => handleAddQuestionClick(e, section.sectionID)}>Add Question</li>
                                                        <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer" onClick={handleChooseTemplateClick}>Choose a Template</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </div>
                            {!editSectionLabel && (sectionQuestions.length > 0) && <div className="" onClick={() => handleDropdownClick(section.sectionID)}>
                                {sectionQuestions[sectionQuestions.findIndex((q) => q.forSection === section.sectionID)].toggled ? <KeyboardArrowUpIcon /> : <KeyboardArrowDown />}
                            </div>}
                        </div>

                        {!editSectionLabel && (sectionQuestions.length > 0) && sectionQuestions[sectionQuestions.findIndex((ql) => ql.forSection === section.sectionID)].toggled && (
                            <SectionQuestionList sectionID={section.sectionID} questionList={sectionQuestions[sectionQuestions.findIndex((ql) => ql.forSection === section.sectionID)].questions} />
                        )}
                    </div>
                </div>
            ))}

            {showSuccessMessage && (
                <div className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded shadow-lg">
                    Question added successfully!
                </div>
            )}
            {renderOverlayComponent} {/* Keep the overlays for deletion */}
            <DropIndicator beforeId={"-1"} />
        </div>



    );
};

export default TableOfContents;
