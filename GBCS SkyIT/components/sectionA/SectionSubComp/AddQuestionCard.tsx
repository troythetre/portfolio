import React, {useState, useEffect} from "react";
import Typography from "@mui/material/Typography";
import styles from "./subComp.module.css";
import Deadlines from "./deadlines";
import WritersReviewers from "./writersReviewers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {BASEURL} from "../../../constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {FaRegEdit} from "react-icons/fa";
import {useRouter} from "next/router";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

import Link from "next/link";
import GoldBorderButton from "../../sectionB/sideBar/GoldBorderButton";
import {format, parseISO} from "date-fns";
import { handleAddQuestion } from "../utils";

interface AddQuestionCardProps {
    setOpen: (open: boolean) => void;
    setRefresh: any;
    secID: string | null;
    setOpenDropdowns: (state: {}) => void;
}
interface User {
    userEmail: string;
    displayName: string;
    role: any;
    permissions: string[];
}

export default function AddQuestionCard({setOpen, setRefresh, secID, setOpenDropdowns}: AddQuestionCardProps) {
    const [teamMember, setTeamMember] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

    const [newAnswer, setNewAnswer] = useState();
    const [writers, setWriters] = useState([]);
    const [reviewers, setReviewers] = useState([]);
    const [newQuestion, setNewQuestion] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [editWriteDeadline, setEditWriteDeadline] = useState(false);
    const [editReviewerDeadline, setEditReviewerDeadline] = useState(false);
    const [reviewerDeadline, setReviewerDeadline] = useState();
    const [writerDeadline, setWriterDeadline] = useState<Date | null>(null);
    const [sections, setSections] = useState([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const router = useRouter();
    const data = router.query;
    let RFPID;
    let sectionID;

    if(data.RFPID == null || data.RFPID == undefined ) {
         RFPID = data.proposalID;
         console.log("Inside if proposal");
    }
    else {
        RFPID = data.RFPID;
        console.log("Inside else proposal");
    }

    if (secID == null || secID == undefined) {
         sectionID = data.sectionID;
         console.log("Inside if section");
    }
    else {
        sectionID = secID;
        console.log("inside else section");
    }

    const setIsOpen = () => {
        setOpen(false);
    };
    const addQuestion = async () => {

        await handleAddQuestion(RFPID, sectionID, newQuestion, newAnswer, writers, reviewers, writerDeadline, reviewerDeadline);
        setShowSuccessPopup(true); // Show success popup
        
        setIsOpen(); // Close the modal
   
        setRefresh(prev => !prev); // Ensures re-render
        // setOpenDropdowns({}); // Close any open dropdowns
    } 
    const fetchData = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/team-members/${RFPID}`, {
                method: "GET",
                credentials: "include",
            });
            const resp = await response.json();
            setTeamMember(resp.teamMembers);
            setTeamMembers(resp.teamMembers);
        } catch (error) {
            console.error("Fetch error", error);
        }
    };
    const getTeamMember = async () => {
        setModalOpen(!modalOpen);
        console.log("here");
        fetchData();
    };
    const getTeamMembers = async () => {
        setIsModalOpen(!isModalOpen);
        console.log("writer");
        fetchData();
    };

    const handleOnChangeReviewer = async (userEmail: string, displayName: string, role: any, permissions: string[]) => {
        console.log("gaga");
        setReviewers((prevTeamMembers) => {
            const isSelected = prevTeamMembers.some((user) => user.userEmail === userEmail);
            if (isSelected) {
                const updatedUsers = prevTeamMembers.filter((user) => user.userEmail !== userEmail);
                return updatedUsers;
            } else {
                // If not selected, add the user to the list
                const updatedUsers = [...prevTeamMembers, {userEmail, displayName, role, permissions}];
                return updatedUsers;
            }
        });
    };
    const handleOnChange = async (userEmail: string, displayName: string, role: any, permissions: string[]) => {
        setWriters((prevTeamMembers) => {
            const isSelected = prevTeamMembers.some((user) => user.userEmail === userEmail);
            if (isSelected) {
                // If selected, remove the user from the list
                const updatedUsers = prevTeamMembers.filter((user) => user.userEmail !== userEmail);
                // console.log("updatedUsers", updatedUsers);
                return updatedUsers;
            } else {
                // If not selected, add the user to the list
                const updatedUsers = [...prevTeamMembers, {userEmail, displayName, role, permissions}];
                // console.log(updatedUsers);
                return updatedUsers;
            }
        });
    };
    const handleDeadlineChange = (date: Date | null, user) => {
        if (!date) {
            return;
        }
        date?.setUTCHours(12, 0, 0, 0);
        const formattedDate = format(parseISO(date?.toISOString()), "yyyy-MM-dd");
        if (user === "writer") {
            setWriterDeadline(formattedDate);
        } else if (user === "reviewer") {
            setReviewerDeadline(formattedDate);
        } else {
            return;
        }
    };
    const handleOnReviewerChange = async (userEmail: string, displayName: string, role: any, permissions: string[]) => {
        setReviewers((prevTeamMembers) => {
            const isSelected = prevTeamMembers.some((user) => user.userEmail === userEmail);
            if (isSelected) {
                // If selected, remove the user from the list
                const updatedUsers = prevTeamMembers.filter((user) => user.userEmail !== userEmail);
                console.log("updatedUsers", updatedUsers);
                return updatedUsers;
            } else {
                // If not selected, add the user to the list
                const updatedUsers = [...prevTeamMembers, {userEmail, displayName, role, permissions}];
                console.log(updatedUsers);
                return updatedUsers;
            }
        });
    };

    const addWriterDeadline = () => {
        setEditWriteDeadline(!editWriteDeadline);
    };
    const addReviewerDeadline = () => {
        setEditReviewerDeadline(!editReviewerDeadline);
    };
    return (
        <div className="p-12 bg-zinc-800 rounded-md py-8 w-full max-w-lg">
            
            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-black p-4 rounded shadow-lg">
                        <p>Question added successfully!</p>
                    </div>
                </div>
            )}
            <ArrowBackIcon
                sx={{
                    height: "30px",
                    width: "30px",
                }}
                className="bg-gold text-black rounded-full p-4 cursor-pointer"
                onClick={() => setIsOpen()}
            />

            <div className="pt-4 pb-20 mb-4">
                <label htmlFor="questionInput" className="text-white">
                    Question
                </label>
                <input
                    onChange={(e) => setNewQuestion(e.target.value)}
                    value={newQuestion}
                    required
                    className="border-solid rounded-lg border-r-0 border-t-0 border-l-0 border-yellow-300 w-full bg-zinc-600 text-white p-8 text-md text-xs"
                />
            </div>

            <div className="flex items-center justify-between py-4 relative">
                <p className="">Write Deadline:</p>
                <p>{writerDeadline}</p>
                <p className="">
                    <FaRegEdit
                        onClick={() => setEditWriteDeadline(true)}
                        className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                    />
                </p>
                {editWriteDeadline && (
                    <div className="absolute z-10 top-8 flex w-full justify-end">
                        <div className="w-full justify-between flex gap-2 p-1 bg-zinc-900 rounded-lg">
                            <div className="flex gap-2 items-center px-4">
                                <DatePicker
                                    className={`${styles.customDatepicker} placeholder:text-gray-400 bg-card-bg border-0 text-gray-400  ml-3`}
                                    selected={writerDeadline}
                                    onChange={(date: Date | null) => handleDeadlineChange(date, "writer")}
                                    dateFormat="dd MMMM yyyy"
                                    placeholderText="DD/MM/YYYY"
                                    required
                                    minDate={new Date()}
                                />
                            </div>

                            <div className="flex gap-2 py-2 items-center">
                                <button
                                    onClick={() => addWriterDeadline()}
                                    className="text-xs py-4 px-20 border border-solid rounded-lg border-yellow-300 text-yellow-300 h-42 bg-inherit hover:border-yellow-600 hover:text-yellow-600"
                                >
                                    Submit
                                </button>

                                <CancelIcon
                                    className="hover:text-yellow-600 text-yellow-300 text-20"
                                    onClick={() => setEditWriteDeadline(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between py-4 relative">
                <p className="">Review Deadline:</p>
                <p>{reviewerDeadline}</p>
                <p className="">
                    <FaRegEdit
                        onClick={() => setEditReviewerDeadline(true)}
                        className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                    />
                </p>
                {editReviewerDeadline && (
                    <div className="absolute z-10 top-8 flex w-full justify-end">
                        <div className="w-full justify-between flex gap-2 p-1 bg-zinc-900 rounded-lg">
                            <div className="flex gap-2 items-center px-4">
                                <DatePicker
                                    className={`${styles.customDatepicker} placeholder:text-gray-400 bg-card-bg border-0 text-gray-400  ml-3`}
                                    selected={reviewerDeadline}
                                    onChange={(date: Date | null) => handleDeadlineChange(date, "reviewer")}
                                    dateFormat="dd MMMM yyyy"
                                    placeholderText="DD/MM/YYYY"
                                    required
                                />
                            </div>

                            <div className="flex gap-2 py-2 items-center">
                                <button
                                    onClick={() => addReviewerDeadline()}
                                    className="text-xs py-4 px-20 border border-solid rounded-lg border-yellow-300 text-yellow-300 h-42 bg-inherit hover:border-yellow-600 hover:text-yellow-600"
                                >
                                    Submit
                                </button>

                                <CancelIcon
                                    className="hover:text-yellow-600 text-yellow-300 text-20"
                                    onClick={() => setEditReviewerDeadline(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className=" basis-6/12 border-solid  border-t-10 border-l-0 border-b-0 border-r-0 pr-4 pb-8 mt-8 relative">
                <div className="flex justify-between items-center">
                    <p>Writers:</p>
                    <FaRegEdit
                        className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                        onClick={() => {
                            getTeamMembers();
                            // handleClick("writers");
                        }}
                    />
                </div>
                {isModalOpen && (
                    <div
                        className="modal bg-zinc-600 absolute rounded p-5"
                        style={{maxHeight: "200px", overflowY: "auto", top: "30px", right: "30px"}}
                    >
                        <div className="flex border-accent-color mb-0">
                            <span className="text-20 text-[#F2F2F2] ml-2">Add Writers</span>
                        </div>
                        <div className="mx-auto mb-2" style={{borderBottom: "2px solid #2f2f2f", width: "95%"}}></div>

                        <div className="custom-scrollbar pr-10" style={{maxHeight: "200px", overflowY: "auto"}}>
                            {teamMember.map((user, index) => (
                                <li key={index} className="list-none">
                                    <div className="toppings-list-item">
                                        <div className="left-section flex mb-4 ml-2">
                                            <label className={`${styles.container} cursor-pointer mt-3`}>
                                                <input
                                                    type="checkbox"
                                                    id="index"
                                                    onChange={() =>
                                                        handleOnChange(
                                                            user.userEmail,
                                                            user.displayName,
                                                            user.role,
                                                            user.permissions
                                                        )
                                                    }
                                                />
                                                <span className={`${styles.checkmark}`}></span>
                                            </label>
                                            <div className="ml-4">
                                                {" "}
                                                <label
                                                    htmlFor={`custom-checkbox-${index}`}
                                                    className="text-14  text-[#F2F2F2]"
                                                >
                                                    {user.displayName}
                                                </label>
                                                <p className="text-14">{user.userEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                        <div className="flex justify-center gap-x-4">
                            <GoldBorderButton
                                label="Close"
                                onClick={() => setIsModalOpen(!isModalOpen)}
                                width="w-[100px]"
                                height="h-[30px]"
                            />
                        </div>
                    </div>
                )}
                {/* current list of writers */}
                <div className={`overflow-y-scroll h-[85px] mt-4 ${styles.inputOverflow} `}>
                    {writers.map(
                        (
                            writer: {
                                writerEmail:
                                    | string
                                    | number
                                    | boolean
                                    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined;
                            },
                            index: React.Key | null | undefined
                        ) => {
                            return (
                                <div key={index} className="bg-white rounded-lg p-2 flex items-end gap-1 mb-1">
                                    <img
                                        src={writer.photoURL || "https://via.placeholder.com/30"}
                                        alt={writer.writerEmail}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm font-medium text-black">{writer.displayName}</p>
                                        <p className="text-xs text-black">{writer.userEmail}</p>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
                <div className="h-125 basis-6/12 pl-8 pb-4 mt-4 border-t-2 border-solid border-l-0 border-b-0 border-r-0">
                    <div className="flex justify-between items-center">
                        <p>Reviewers:</p>
                        <FaRegEdit
                            className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                            onClick={() => {
                                getTeamMember();
                                // handleClick("reviewers");
                                // setIsModalOpen(!isModalOpen)
                            }}
                        />
                    </div>

                    {modalOpen && (
                        <div
                            className="modal bg-zinc-600 absolute rounded p-5"
                            style={{maxHeight: "200px", overflowY: "auto", top: "30px", right: "30px"}}
                        >
                            <div className="flex border-accent-color mb-0">
                                <span className="text-20 text-[#F2F2F2] ml-2">Add Reviewers</span>
                            </div>
                            <div
                                className="mx-auto mb-2"
                                style={{borderBottom: "2px solid #2f2f2f", width: "95%"}}
                            ></div>

                            <div className="custom-scrollbar pr-10" style={{maxHeight: "200px", overflowY: "auto"}}>
                                {teamMembers.map((user, index) => (
                                    <li key={index} className="list-none">
                                        <div className="toppings-list-item">
                                            <div className="left-section flex mb-4 ml-2">
                                                <label className={`${styles.container} cursor-pointer mt-3`}>
                                                    <input
                                                        type="checkbox"
                                                        id="index"
                                                        onChange={() =>
                                                            handleOnChangeReviewer(
                                                                user.userEmail,
                                                                user.displayName,
                                                                user.role,
                                                                user.permissions
                                                            )
                                                        }
                                                    />
                                                    <span className={`${styles.checkmark}`}></span>
                                                </label>
                                                <div className="ml-4">
                                                    {" "}
                                                    <label
                                                        htmlFor={`custom-checkbox-${index}`}
                                                        className="text-14  text-[#F2F2F2]"
                                                    >
                                                        {user.displayName}
                                                    </label>
                                                    <p className="text-14">{user.userEmail}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </div>
                            <div className="flex justify-center gap-x-4">
                                {/* <GoldBorderButton
                                    label="Add"
                                    // onClick={() => addTeamMembers()}
                                    width="w-[100px]"
                                    height="h-[30px]"
                                /> */}
                                <GoldBorderButton
                                    label="Close"
                                    onClick={() => setModalOpen(!modalOpen)}
                                    width="w-[100px]"
                                    height="h-[30px]"
                                />
                            </div>
                        </div>
                    )}
                    {/* Current list of reviewers */}
                    <div className={`overflow-y-scroll h-[85px] mt-4 ${styles.inputOverflow} `}>
                        {reviewers.map(
                            (
                                reviewers: {
                                    reviewersEmail:
                                        | string
                                        | number
                                        | boolean
                                        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                        | Iterable<React.ReactNode>
                                        | null
                                        | undefined;
                                },
                                index: React.Key | null | undefined
                            ) => {
                                return (
                                    <div key={index} className="bg-white rounded-lg p-2 flex items-end gap-1 mb-1">
                                        <img
                                            src={reviewers.photoURL || "https://via.placeholder.com/30"}
                                            alt={reviewers.writerEmail}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex flex-col justify-center">
                                            <p className="text-sm font-medium text-black">{reviewers.displayName}</p>
                                            <p className="text-xs text-black">{reviewers.userEmail}</p>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>

            <button
                className="cursor-pointer border-solid border border-yellow-400 bg-inherit text-yellow-400 px-[25px] py-5 rounded-lg ml-4 hover:bg-gradient-text hover:text-black transition-all duration-300"
                style={{marginTop: "15px"}}
                onClick={addQuestion}
            >
                Add
            </button>
        </div>
    );
}
