import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import QuestionCard from "./QuestionCard";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";
import axios from "axios";
import HistoryIcon from "@mui/icons-material/History";
import styles from "./subComp.module.css";
import ErrorModal from "../../modals/errors/errorModal";

interface Proposal {
    id: string;
    proposalStatus: string;
    // Add other properties based on your data structure
    // ...
}

interface User {
    userEmail: string;
    photoURL: string;
    displayName: string;
}

interface Question {
    questionID: string;
    members: { teamMember_email: string }[];
    writers: { writerDeadline: string }[];
    reviewers: { reviewDeadline: string }[];
}

interface QuestionID {
    questionID: string;
}

const IDCard: React.FC = ({ refresh }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const { RFPID, sectionID } = router.query;
    const [questionIDs, setQuestionIDs] = useState<QuestionID[]>([]);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [users, setUsers] = useState<Record<string, User>>({}); // Map of email to user data
    const [filteredUsers, setFilteredUsers] = useState<Record<string, User>>({});
    const [filteredWriters, setFilteredWriters] = useState<Record<string, User>>({});
    const [filteredReviewers, setFilteredReviewers] = useState<Record<string, User>>({});
    const [showName, setShowName] = useState<string | null>(null); // State to manage which name is shown

    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    function getDaysRemaining(date: Date) {
        const currentDate = new Date();
        const differenceInTime = date.getTime() - currentDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        if (differenceInDays === 1) {
            return differenceInDays + " day remaining";
        } else if (differenceInDays < 1) {
            return "0 days remaining";
        } else if (isNaN(differenceInDays)) {
            return "No Due Date";
        } else {
            return differenceInDays + " days remaining";
        }
    }

    function extractDate(dateString: string | null) {
        return dateString ? dateString.split("T")[0] : null;
    }

    async function fetchAllUsers() {
        try {
            const response = await axios.get(`${BASEURL}/api/proposal/all-users`, {
                withCredentials: true,
            });
            const allUsers = response.data; // Assuming the response contains an array of users
            const usersMap = allUsers.reduce((acc: Record<string, User>, user: User) => {
                acc[user.userEmail] = user;
                return acc;
            }, {});
            setUsers(usersMap);
        } catch (error) {
            console.error("Error fetching all users", error.response ? error.response.data : error.message);
        }
    }

    function launchQuestionInEditView(): void {
        router.push({
            pathname: "/edit-proposal",
            query: { proposalID: RFPID, openedFromSectionID: sectionID }, // Passing sectionID data as query params
        });
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    // grabs all questionIDs in the section
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getIDs = await axios.get(
                    `${BASEURL}/api/proposal/section/get-section-questions/${RFPID}/${sectionID}`,
                    { withCredentials: true }
                );
                setQuestionIDs(getIDs.data.questions || []);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
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
        fetchData();
    }, [RFPID, sectionID, refresh]);

    // grabs current proposal
    useEffect(() => {
        const fetchData = async () => {
            try {
                const getProposal = await axios.get(`${BASEURL}/api/proposal/single-proposal/${RFPID}`, {
                    withCredentials: true,
                });
                setProposal(getProposal.data.singleProposal || null);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
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
        fetchData();
    }, [RFPID]);

    // grabs all questions in that proposal
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/proposal/questions/${RFPID}`, {
                    withCredentials: true,
                });
                setAllQuestions(response.data.questions || []);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No Current Questions");
                } else if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
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
        fetchData();
    }, [open, RFPID, refresh]);

    // filters all questions to only show the questions in the section
    useEffect(() => {
        if (allQuestions) {
            const filteredQuestions = allQuestions.filter((question) =>
                questionIDs.some((e) => e.questionID === question.questionID)
            );
            setQuestions(filteredQuestions);
        }
    }, [allQuestions, questionIDs, open, refresh]);

    useEffect(() => {
        // Filter users based on the team members in questions
        const teamEmails = new Set<string>();
        questions.forEach((question) => {
            question.members.forEach((member) => {
                teamEmails.add(member.teamMember_email);
            });
        });

        const filtered = Object.fromEntries(Object.entries(users).filter(([email]) => teamEmails.has(email)));

        setFilteredUsers(filtered);
    }, [users, questions]);

    useEffect(() => {
        const teamWriters = new Set<string>();
        questions.forEach((question) => {
            question.writers.forEach((writer) => {
                teamWriters.add(writer.writerEmail);
            });
        });
        const filtered = Object.fromEntries(Object.entries(users).filter(([email]) => teamWriters.has(email)));
        //console.log("Writer- filtered",teamWriters)
        setFilteredWriters(filtered);
    }, [users, questions]);

    useEffect(() => {
        const teamReviewer = new Set<string>();
        questions.forEach((question) => {
            question.reviewers.forEach((reviewer) => {
                teamReviewer.add(reviewer.reviewerEmail);
            });
        });
        const filtered = Object.fromEntries(Object.entries(users).filter(([email]) => teamReviewer.has(email)));
        setFilteredReviewers(filtered);
    }, [users, questions]);

    const handleIconClick = (email: string) => {
        setShowName((prev) => (prev === email ? null : email));
    };

    return (
        <div>
            <div className="mb-8">
                {questions && proposal ? (
                    questions.length === 0 ? (
                        <div className="text-center">No Current Questions</div>
                    ) : (
                        questions.map((question: any, index: number) => (
                            <div key={index}>
                                <Accordion
                                    sx={{
                                        backgroundColor: "inherit",
                                        color: "white",
                                    }}
                                    className="border-2 p-2 border-solid border-zinc-700 mb-8"
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ArrowDropDownIcon className="text-yellow-400 font-size-12 inline-block " />
                                        }
                                    >
                                        <Typography className="w-full text-lg ">
                                            <div className="w-full flex justify-between">
                                                <div>Question: {question.question}</div>

                                                {/* proposal status */}
                                                <div className="text-sm flex items-end gap-1 mr-4">
                                                    {proposal.proposalStatus === "APPROVED" ? (
                                                        <>
                                                            <CheckCircleRoundedIcon className="text-green-300 text-30" />
                                                            <div className="text-sm text-white ">
                                                                {proposal.proposalStatus}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HistoryIcon className="text-30 text-red-600" />
                                                            <div className="text-sm text-white">
                                                                {proposal.proposalStatus}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </Typography>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        <Typography>
                                            {/* grabs writers and reviewers, filters duplicates and shows an icon for everyone */}
                                            <div className="flex gap-4 mb-8">
                                                <Typography className="mr-2" style={{ marginTop: "revert" }}>
                                                    Assigned Writers:
                                                </Typography>
                                                <div className="flex space-x-2">
                                                    {Object.keys(filteredWriters).length > 0 ? (
                                                        Object.entries(filteredWriters).map(([email, user]) => (
                                                            <div key={email} onClick={() => handleIconClick(email)}>
                                                                {user.photoURL ? (
                                                                    <img
                                                                        src={user.photoURL}
                                                                        alt={user.displayName}
                                                                        className="w-12 h-12 rounded-full cursor-pointer"
                                                                    />
                                                                ) : (
                                                                    <AccountCircleIcon className="text-3xl cursor-pointer" />
                                                                )}
                                                                {showName === email && (
                                                                    <Typography
                                                                        className="mt-1 text-center"
                                                                        style={{
                                                                            whiteSpace: "nowrap",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            width: "50px",
                                                                        }}
                                                                    >
                                                                        {user.displayName}
                                                                    </Typography>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <Typography>No writers</Typography>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mb-8">
                                                <Typography className="mr-2" style={{ marginTop: "revert" }}>
                                                    Assigned Writers:
                                                </Typography>
                                                <div className="flex space-x-2">
                                                    {Object.keys(filteredReviewers).length > 0 ? (
                                                        Object.entries(filteredReviewers).map(([email, user]) => (
                                                            <div key={email} onClick={() => handleIconClick(email)}>
                                                                {user.photoURL ? (
                                                                    <img
                                                                        src={user.photoURL}
                                                                        alt={user.displayName}
                                                                        className="w-12 h-12 rounded-full cursor-pointer"
                                                                    />
                                                                ) : (
                                                                    <AccountCircleIcon className="text-3xl cursor-pointer" />
                                                                )}
                                                                {showName === email && (
                                                                    <Typography
                                                                        className="mt-1 text-center"
                                                                        style={{
                                                                            whiteSpace: "nowrap",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            width: "50px",
                                                                        }}
                                                                    >
                                                                        {user.displayName}
                                                                    </Typography>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <Typography>No reviewers</Typography>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mb-8">
                                                <div className="">Write Deadline:</div>
                                                <div className="">
                                                    {question.writers &&
                                                        question.writers[0] &&
                                                        extractDate(question.writers[0].writerDeadline)
                                                        ? extractDate(question.writers[0].writerDeadline)?.toString()
                                                        : "No Deadline"}
                                                </div>
                                                <div className="bg-zinc-700 rounded p-1 px-8">
                                                    {question.writers && question.writers[0]
                                                        ? getDaysRemaining(new Date(question.writers[0].writerDeadline))
                                                        : "No Deadline"}
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mb-8">
                                                <div className="">Review Deadline:</div>
                                                <div className="">
                                                    {question.reviewers &&
                                                        question.reviewers[0] &&
                                                        extractDate(question.reviewers[0].reviewDeadline)
                                                        ? extractDate(question.reviewers[0].reviewDeadline).toString()
                                                        : "No Deadline"}
                                                </div>
                                                <div className="bg-zinc-700 rounded p-1 px-8">
                                                    {question.reviewers && question.reviewers[0]
                                                        ? getDaysRemaining(
                                                            new Date(question.reviewers[0].reviewDeadline)
                                                        )
                                                        : "No Deadline"}
                                                </div>
                                            </div>
                                        </Typography>
                                    </AccordionDetails>

                                    <div className="flex flex-col items-center p-4 mb-4">
                                        <div className="w-full flex justify-center items-center">
                                            <button
                                                onClick={() => setOpen(true)}
                                                className="p-8 m-4 rounded-lg text-sm bg-transparent border-yellow-400 text-yellow-400"
                                            >
                                                Manage Question
                                            </button>

                                            <button
                                                onClick={() => launchQuestionInEditView()}
                                                className="p-8 m-4 rounded-lg text-sm bg-transparent border-yellow-400 text-yellow-400"
                                            >
                                                Go to Question
                                            </button>
                                        </div>

                                        {open && (
                                            <div
                                                onClick={() => setOpen(false)}
                                                className={`fixed z-20 h-screen w-full top-0 bg-zinc-600 bg-opacity-40 flex justify-center items-center overflow-y-scroll ${styles.inputOverflow}`}
                                            >
                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={`w-[400px] max-h-screen overflow-y-auto ${styles.inputOverflow}`}
                                                >
                                                    <QuestionCard
                                                        question={question}
                                                        questions={questions}
                                                        RFPID={RFPID}
                                                        setOpen={setOpen}
                                                        proposal={proposal}
                                                        sectionID={sectionID}
                                                        teamMembers={filteredUsers}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Accordion>
                            </div>
                        ))
                    )
                ) : null}
            </div>
        </div>
    );
};

export default IDCard;
