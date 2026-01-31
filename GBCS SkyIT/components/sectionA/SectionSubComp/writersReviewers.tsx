import * as React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import {BASEURL} from "../../../constants";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {FaRegEdit} from "react-icons/fa";
import styles from "./subComp.module.css";
import WritersList from "./writersList";
import ReviewersList from "./reviewersList";

export default function WritersReviewers({
    currentQuestion,
    setCurrentQuestion,
    RFPID,
    questions,
    proposal,
    teamMembers,
    onWriterUpdate,
    
}) {
    //console.log( setCurrentQuestion, RFPID, questions, proposal)
    const [members, setTeamMembers] = useState([]);
    const [editWriters, setEditWriters] = useState(false);
    const [addingWriters, setAddingWriters] = useState(false);
    const [editReviewers, setEditReviewers] = useState(false);
    const [addingReviewers, setAddingReviewers] = useState(false);

    //Convert teamMembers object to array of values
    const teamMembersArray = Object.values(teamMembers);
    console.log(teamMembers)
    // grabs the team members for our writers and reviewers list
    const handleWriterUpdate = (updatedWriters) => {
        console.log("Updated Writers:", updatedWriters);
        const updatedQuestion = {
          ...currentQuestion,
          writers: updatedWriters, 
        };
        setCurrentQuestion(updatedQuestion); 
      };
      
      const handleReviewerUpdate = (updatedReviewers) => {
        console.log("Updated Reviewers:", updatedReviewers);
        const updatedQuestion = {
          ...currentQuestion,
          reviewers: updatedReviewers, 
        };
        setCurrentQuestion(updatedQuestion); 
      };
    useEffect(() => {
        if (questions && questions.length > 0) {
            const members = questions[0].members;
            setTeamMembers(members || []);
            //console.log("questions.members", members);
        }
    }, [questions]);
    return (
        <div>
            {/*----------- writers and reviewers -------------*/}
            <div className="flex w-full justify-center relative">
                {/* ----------writers--------- */}
                <div className=" basis-6/12 border-solid  border-t-0 border-l-0 border-b-0 pr-4 pb-8 relative">
                    <div className="flex justify-between items-center">
                        <p>Writers:</p>
                        <FaRegEdit
                            className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                            onClick={() => {
                                setEditWriters(true);
                                setAddingWriters(true);
                            }}
                        />
                    </div>

                    {/* current list of writers */}
                    <div className={`overflow-y-scroll h-[85px] mt-4 ${styles.inputOverflow} `}>
                        {currentQuestion.writers.map((writer, index) => {
                            // Find the member in the teamMembersArray
                            const member = teamMembersArray.find(member => member.userEmail === writer.writerEmail);
                            if (!member || !member.displayName) {
                                return null; 
                            }
                            
                            return (
                                <div key={index} className="bg-white rounded-lg p-2 flex items-end gap-1 mb-1">
                                    <img
                                        src={member.photoURL || "https://via.placeholder.com/30"}
                                        alt={writer.writerEmail}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm font-medium text-black">
                                            {member.displayName}
                                        </p>
                                        <p className="text-xs text-black">{writer.writerEmail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --------reviewers-------- */}
                <div className="h-125 basis-6/12 pl-8 pb-4">
                    <div className="flex justify-between items-center">
                        <p>Reviewers:</p>
                        <FaRegEdit
                            className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20"
                            onClick={() => {
                                setEditReviewers(true);
                                setAddingReviewers(true);
                            }}
                        />
                    </div>

                    {/* Current list of reviewers */}
                    <div className={`overflow-y-scroll h-[85px] mt-4 ${styles.inputOverflow}`}>
                        {currentQuestion.reviewers.map((reviewer, index) => {
                            // Find the corresponding team member
                            const member = teamMembersArray.find(member => member.userEmail === reviewer.reviewerEmail);

                            // Check if the member exists and has a displayName
                            if (!member || !member.displayName) {
                                return null; // Skip rendering this element if displayName is not available
                            }

                            return (
                                <div key={index} className="bg-white rounded-lg p-2 flex items-start gap-1 mb-1">
                                    <img
                                        src={member.photoURL || "https://via.placeholder.com/30"}
                                        alt={reviewer.reviewerEmail}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm font-medium text-black">{member.displayName}</p>
                                        <p className="text-xs text-black">{reviewer.reviewerEmail}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* -----------change writers list modal----------- */}
                {editWriters && (
                    <WritersList
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        setEditWriters={setEditWriters}
                        addingWriters={addingWriters}
                        setAddingWriters={setAddingWriters}
                        teamMembers={members}
                        questions={questions}
                        RFPID={RFPID}
                        onWriterUpdate={handleWriterUpdate}
                    />
                )}
                {/* -----------change reviewers list modal----------- */}
                {editReviewers && (
                    <ReviewersList
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        setEditReviewers={setEditReviewers}
                        addingReviewers={addingReviewers}
                        setAddingReviewers={setAddingReviewers}
                        teamMembers={members}
                        questions={questions}
                        RFPID={RFPID}
                        onReviewerUpdate={handleReviewerUpdate}
                    />
                )}
            </div>
        </div>
    );
}
