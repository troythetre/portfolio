import * as React from "react"
import { useState } from 'react'
import { FaRegEdit } from "react-icons/fa"
import CancelIcon from "@mui/icons-material/Cancel"
import { BASEURL } from "../../../constants";
import ErrorModal from "../../modals/errors/errorModal"

export default function Deadlines({ currentQuestion, setCurrentQuestion, questions, RFPID, question }) {
    const [editReviewDeadline, setEditReviewDeadline] = useState(false)
    const [editResponseDeadline, setEditResponseDeadline] = useState(false)
    const [editAnswerDeadline, setEditAnswerDeadline] = useState(false)
    const [newDeadline, setNewDeadline] = useState({})
    const [editWriteDeadline, setEditWriteDeadline] = useState(false)

    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");



    // gets the days remaining
    function getDaysRemaining(date: any) {
        const currentDate = new Date()

        const differenceInTime = date.getTime() - currentDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays === 1) {
            return differenceInDays + " day remaining"
        } else if (differenceInDays < 1) {
            return 0 + " days remaining"
        } else if (isNaN(differenceInDays)) {
            return "No Due Date"
        } else {
            return differenceInDays + " days remaining"
        }
    }
    function extractDate(dateString) {
        return dateString ? dateString.split('T')[0] : null;
    }




    // updates the deadlines
    async function pushNewDeadline(newDeadline: string, questionID: string, deadlineType: string) {


        //----------- answer deadline change -------------------
        if (deadlineType === "answer") {

            // Updates deadline in QuestionCard.tsx
            question.answer_deadline = newDeadline

            try {
                const response = await fetch(`${BASEURL}/api/proposal/question-setDeadline`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposalID: RFPID,
                        questionID: questionID,
                        write_deadline: currentQuestion.write_deadline,
                        response_deadline: currentQuestion.response_deadline,
                        answer_deadline: newDeadline,
                        review_deadline: currentQuestion.review_deadline,
                    })
                })
                const responseBody = await response.json()
                if (response.ok) {
                    console.log("Deadlines updated")
                } else {
                    console.log(responseBody)
                }

                setCurrentQuestion({ ...currentQuestion, answer_deadline: newDeadline })

                questions.find((question) => {
                    if (question.questionID === questionID) {
                        question.answer_deadline = newDeadline
                    }
                })

                setEditAnswerDeadline(false)
                setNewDeadline("")
            } catch (error) {
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
            }

        }

        //----------- write deadline change -------------------
        else if (deadlineType === "write") {

            // Updates deadline in QuestionCard.tsx
            question.write_deadline = newDeadline


            try {
                const response = await fetch(`${BASEURL}/api/proposal/question-setDeadline`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposalID: RFPID,
                        questionID: questionID,
                        write_deadline: newDeadline,
                        review_deadline: currentQuestion.review_deadline,
                    })
                })
                const responseBody = await response.json()
                if (response.ok) {
                    console.log("Deadlines updated")
                } else {
                    console.log(responseBody)
                }

                setCurrentQuestion({ ...currentQuestion, write_deadline: newDeadline })
                console.log("currentQuestion", currentQuestion)

                questions.find((question) => {
                    if (question.questionID === questionID) {
                        question.write_deadline = newDeadline
                    }
                })

                setEditWriteDeadline(false)
                setNewDeadline("")
            } catch (error) {
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
            }
        }

        //----------- review deadline change -------------------
        else if (deadlineType === "review") {

            // Updates deadline in QuestionCard.tsx
            question.review_deadline = newDeadline


            try {
                const response = await fetch(`${BASEURL}/api/proposal/question-setDeadline`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposalID: RFPID,
                        questionID: questionID,
                        write_deadline: currentQuestion.write_deadline,
                        review_deadline: newDeadline,
                    })
                })
                const responseBody = await response.json()
                if (response.ok) {
                    console.log("Deadlines updated")
                } else {
                    console.log(responseBody)
                }

                setCurrentQuestion({ ...currentQuestion, review_deadline: newDeadline })

                questions.find((question) => {
                    if (question.questionID === questionID) {
                        question.review_deadline = newDeadline
                    }
                })

                setEditReviewDeadline(false)
                setNewDeadline("")
            } catch (error) {
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
            }
        }

        //----------- response deadline change -------------------
        else if (deadlineType === "response") {

            // Updates deadline in QuestionCard.tsx
            question.response_deadline = newDeadline

            try {
                const response = await fetch(`${BASEURL}/api/proposal/question-setDeadline`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        proposalID: RFPID,
                        questionID: questionID,
                        write_deadline: currentQuestion.write_deadline,
                        response_deadline: currentQuestion.response_deadline,
                        answer_deadline: newDeadline,
                        review_deadline: currentQuestion.review_deadline,
                    })
                })
                const responseBody = await response.json()
                if (response.ok) {
                    console.log("Deadlines updated")
                } else {
                    console.log(responseBody)
                }

                setCurrentQuestion({ ...currentQuestion, response_deadline: newDeadline })

                questions.find((question) => {
                    if (question.questionID === questionID) {
                        question.response_deadline = newDeadline
                    }
                })

                setEditResponseDeadline(false)
                setNewDeadline("")
            } catch (error) {
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
            }
        }

    }


    return (
        <div>

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

            {/* Answer Deadline */}
            <div className="py-12 text-xs text-white">

                {/* Write Deadline */}
                <div className="flex items-center justify-between py-4 relative">

                    <p className="">Write Deadline:</p>

                    <p>{currentQuestion.write_deadline ? extractDate(currentQuestion.write_deadline)
                        : (extractDate(currentQuestion.writers && currentQuestion.writers[0] && currentQuestion.writers[0].writerDeadline)
                            ? extractDate(currentQuestion.writers[0].writerDeadline) : "No Deadline")}</p>

                    <p className="font-medium border border-solid rounded border-gray-800 bg-zinc-600 p-1 px-8">
                        {currentQuestion.write_deadline ? getDaysRemaining(new Date(currentQuestion.write_deadline)) : (question.writers && question.writers[0]
                            ? getDaysRemaining(new Date(question.writers[0].writerDeadline))
                            : "No Deadline")}
                    </p>

                    <p className="">
                        <FaRegEdit
                            onClick={() => (setEditWriteDeadline(true))}
                            className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                        />
                    </p>

                    {editWriteDeadline &&
                        <div className="absolute z-10 top-8 flex w-full justify-end">
                            <div className="w-full justify-between flex gap-2 p-1 bg-zinc-900 rounded-lg">

                                <div className="flex gap-2 items-center px-4">

                                    {/* <CalendarMonthOutlinedIcon className="text-20 py-2 px-4 rounded-md bg-yellow-300 text-zinc-900 text-zinc-700" />

                        <input 
                            value={newDeadline} 
                            onChange={e => setNewDeadline(e.target.value)} 
                            type="date"  
                            className={`uppercase text-zinc-600 text-lg rounded-md px-1 bg-inherit focus:text-white focus:outline-none focus:ring-none focus:border-none border-none ${styles.noCalendarIcon}`}  
                        />
                    </div> */}


                                    <input
                                        value={newDeadline}
                                        onChange={e => setNewDeadline(e.target.value)}
                                        type="date"
                                        className={`uppercase text-zinc-600 text-lg rounded-md px-1 bg-inherit focus:text-white focus:outline-none focus:ring-none focus:border-none border-none `}
                                        style={{ filter: "invert(75%) sepia(90%) saturate(300%) hue-rotate(10deg)" }}
                                    />
                                </div>

                                <div className="flex gap-2 py-2 items-center">
                                    <button
                                        onClick={() => pushNewDeadline(newDeadline, currentQuestion.questionID, "write")}
                                        className="text-xs py-4 px-20 border border-solid rounded-lg border-yellow-300 text-yellow-300 h-42 bg-inherit hover:border-yellow-600 hover:text-yellow-600">
                                        Submit
                                    </button>

                                    <CancelIcon
                                        className="hover:text-yellow-600 text-yellow-300 text-20" onClick={() => (setEditWriteDeadline(false), setNewDeadline(""))} />
                                </div>
                            </div>
                        </div>}
                </div>

                {/* Review Deadline */}
                <div className="flex items-center justify-between py-4 relative">

                    <p className="">Review Deadline:</p>

                    <p>{currentQuestion.review_deadline ? extractDate(currentQuestion.review_deadline)
                        : (extractDate(currentQuestion.reviewers && currentQuestion.reviewers[0] && currentQuestion.reviewers[0].reviewDeadline)
                            ? extractDate(currentQuestion.reviewers[0].reviewDeadline) : "No Deadline")}</p>

                    <p className="font-medium border border-solid rounded border-gray-800 bg-zinc-600 p-1 px-8">
                        {currentQuestion.review_deadline ? getDaysRemaining(new Date(currentQuestion.review_deadline))
                            : (question.reviewers && question.reviewers[0]
                                ? getDaysRemaining(new Date(question.reviewers[0].reviewDeadline))
                                : "No Deadline")}
                    </p>

                    <p className="">
                        <FaRegEdit
                            onClick={() => (setEditReviewDeadline(true))}
                            className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                        />
                    </p>

                    {editReviewDeadline &&
                        <div className="absolute z-10 top-8 flex w-full justify-end">
                            <div className="w-full justify-between flex gap-2 p-1 bg-zinc-900 rounded-lg">
                                <div className="flex gap-2 items-center px-4">
                                    <input
                                        value={newDeadline}
                                        onChange={e => setNewDeadline(e.target.value)}
                                        type="date"
                                        className={`uppercase text-zinc-600 text-lg rounded-md px-1 bg-inherit focus:text-white focus:outline-none focus:ring-none focus:border-none border-none`}
                                        style={{ filter: "invert(75%) sepia(90%) saturate(300%) hue-rotate(10deg)" }}
                                    />
                                </div>

                                <div className="flex gap-2 py-2 items-center">
                                    <button
                                        onClick={() => pushNewDeadline(newDeadline, currentQuestion.questionID, "review")}
                                        className="text-xs py-4 px-20 border border-solid rounded-lg border-yellow-300 text-yellow-300 h-42 bg-inherit hover:border-yellow-600 hover:text-yellow-600">
                                        Submit
                                    </button>

                                    <CancelIcon
                                        className="hover:text-yellow-600 text-yellow-300 text-20" onClick={() => (setEditReviewDeadline(false), setNewDeadline(""))} />
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    )
}