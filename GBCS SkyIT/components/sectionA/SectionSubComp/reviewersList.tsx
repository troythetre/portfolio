import * as React from 'react'
import { BASEURL } from "../../../constants"
import { useState, useEffect } from 'react'
import styles from './subComp.module.css'
import CancelIcon from "@mui/icons-material/Cancel"
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ErrorModal from "../../modals/errors/errorModal"
import axios from "axios"

export default function ReviewersList({ currentQuestion, setCurrentQuestion, setEditReviewers, addingReviewers, setAddingReviewers, teamMembers, questions, RFPID, onReviewerUpdate }) {
    const [newReviewer, setNewReviewer] = useState("")
    const [addDate, setAddDate] = useState(false)
    const [date, setDate] = useState(null)
    const [currentReviewers, setCurrentReviewers] = useState(currentQuestion.members.map(reviewer => reviewer.email))
    const [allUsers, setAllUsers] = useState([])

    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch all users to get their names
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/proposal/all-users`, {
                    withCredentials: true
                });
                setAllUsers(response.data);
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
    }, []);

    const getName = (email) => {
        const user = allUsers.find(user => user.userEmail === email);
        return user ? user.displayName : null;
    }

    // Handle checkbox change
    const handleCheckboxChange = (userEmail, isChecked) => {
        if (isChecked) {
            setNewReviewer(userEmail); // Only add the selected email
        } else {
            setNewReviewer(''); // If unchecked, clear the selection
        }
    };

    const handleSubmit = async () => {
        if (!date) {
            alert('Please select a date');
            return;
        } else {
            try {
                const displayName = getName(newReviewer)
                let reviewer = { deadline: date, email: newReviewer }
                let secReivewer = { reviewerName: displayName, reviewerEmail: newReviewer, reviewerDeadline: date }

                const response = await fetch(`${BASEURL}/api/proposal/question-addReviewer`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposalID: RFPID,
                        questionID: currentQuestion.questionID,
                        reviewerEmail: newReviewer,
                        reviewerDeadline: date
                    })
                });
                const responseBody = await response.json();
                if (response.ok) {

                    currentQuestion.members = [...currentQuestion.members, reviewer];
                    questions.find((question) => {
                        if (question.questionID === currentQuestion.questionID) {
                            question.members = currentQuestion.members;
                        }
                    });
                    const updatedReviewers = [...currentQuestion.reviewers, secReivewer];
                    if (onReviewerUpdate) {
                        onReviewerUpdate(updatedReviewers);
                    }
                    setAddDate(false);
                    setEditReviewers(false);
                    console.log("Successfully added reviewer");
                } else {
                    console.log(responseBody);
                }
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
        }
    }

    return (
        <div className="absolute w-full top-7 flex justify-center">
            {errorDet &&
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
            }

            <div className="w-full bg-zinc-700 rounded-lg p-8">
                {/* Header of modal */}
                <div className="border border-solid border-r-0 border-l-0 border-t-0 border-zinc-900 flex justify-between pb-8">
                    <div className="flex gap-1">
                        <AccountBoxOutlinedIcon className="text-yellow-300" />
                        <p className="text-white">Add Reviewers</p>
                    </div>

                    <div className="flex gap-1">
                        <CancelIcon
                            className="hover:text-yellow-600 text-yellow-300 text-20"
                            onClick={() => setEditReviewers(false)}
                        />
                    </div>
                </div>

                {/* List of users */}
                {addingReviewers &&
                    <div className={`h-[75px] overflow-y-scroll ${styles.inputOverflow}`}>
                        {teamMembers && teamMembers.length > 0
                            ?
                            teamMembers.map((teamMember, index) => (
                                <div key={index} className="flex items-center">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            className="mr-2"
                                            type="checkbox"
                                            checked={newReviewer === teamMember.teamMember_email}
                                            onChange={(e) => handleCheckboxChange(teamMember.teamMember_email, e.target.checked)}
                                        />
                                        <div className={`custom-checkbox ${newReviewer === teamMember.teamMember_email ? 'checked' : ''}`}></div>
                                        <div>
                                            <p className="text-white">{getName(teamMember.teamMember_email) || "Unknown Name"}</p>
                                            <p className="text-xs">{teamMember.teamMember_email}</p>
                                        </div>
                                    </label>
                                </div>
                            ))
                            :
                            <div className="flex items-center justify-center h-full">
                                <p className="text-white">No Team Members Assigned to Proposal</p>
                            </div>
                        }
                    </div>
                }

                {/* Adding date to user */}
                {addDate &&
                    <div className={`h-[75px] overflow-y-scroll ${styles.inputOverflow}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white">{newReviewer}</p>
                            </div>

                            <label>
                                <input
                                    type="date"
                                    className={`uppercase text-zinc-600 text-lg rounded-md bg-inherit focus:text-white focus:outline-none focus:ring-none focus:border-none border-none ${styles.noCalendarIcon}`}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                }

                {addingReviewers &&
                    <div className="flex justify-center pt-8">
                        <button
                            className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg"
                            onClick={() => {
                                setAddDate(true)
                                setAddingReviewers(false)
                            }}
                            disabled={!(teamMembers && teamMembers.length > 0) || (teamMembers.every(user => currentReviewers.includes(user.teamMember_email)))}
                        >
                            Next
                        </button>
                    </div>
                }

                {addDate &&
                    <div className="flex justify-center pt-8">
                        <button
                            className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}
