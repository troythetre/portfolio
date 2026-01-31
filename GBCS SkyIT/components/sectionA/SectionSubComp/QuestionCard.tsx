import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Deadlines from "./deadlines";
import WritersReviewers from "./writersReviewers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BASEURL } from "../../../constants";

export default function QuestionCard({ question, questions, RFPID, sectionID, setOpen, proposal, teamMembers }) {
    console.log("question", question, questions, RFPID, sectionID, setOpen, proposal, "teamMembersffhgf", teamMembers);
    const [currentQuestion, setCurrentQuestion] = useState(question);
    const [newAnswer, setNewAnswer] = useState(false);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(sectionID);

    // Fetch sections from the API
    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/get-all-sections/${RFPID}`, {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setSections(data.sections);
                if (data.sections.length > 0) {
                    const defaultSection = data.sections.find((section) => section.sectionID === sectionID);
                    setSelectedSection(defaultSection ? defaultSection.sectionID : data.sections[0].sectionID);
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
            }
        };

        fetchSections();
    }, [RFPID, sectionID]);

    // Function to handle section change
    const handleSectionChange = async (e) => {

        const newSectionID = e.target.value;
        setSelectedSection(newSectionID); // Update the selected section

        // Make the API call to update the question's section
        try {
            const response = await fetch(`${BASEURL}/api/proposal/question-updateSection`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    proposalID: RFPID,
                    sectionID: sectionID,
                    questionID: currentQuestion.questionID,
                    newSectionID: newSectionID,
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const jsonData = await response.json();
            console.log("PUT request successful:", jsonData);

            window.location.href = `/my_task/in-progress`;

        } catch (error) {
            console.error("Error making PUT request:", error);
        }
    };

    // Swap what question and its corresponding data is being displayed
    function changeCurrentQuestion(e) {
        const selectedQuestion = questions.filter((question) => question.questionID === e.target.value);
        setCurrentQuestion(selectedQuestion[0]);
    }

    function handleclick() {
        //alert("");
        console.log(`RFPID:${RFPID}`);
        const sectionURL = `/edit-proposal?proposalID=${RFPID}`;
        window.location.href = sectionURL;
    }

    return (
        <div className="p-12 bg-zinc-800 rounded-md py-8">
            <Typography>
                <div className="bg-zinc-800 rounded-md py-8">
                    <ArrowBackIcon
                        className="hover:bg-yellow-600 bg-yellow-300 p-4 rounded-full text-black"
                        onClick={() => setOpen(false)}
                    />
                </div>

                <div className="text-md p-2 text-white border-1 border-solid border-zinc-400 border-r-0 border-t-0 border-l-0 flex justify-between pt-8 pb-12">
                    <div className="">{currentQuestion.questionID}</div>
                    <div className="rounded-lg text-xs text-semi-bold w-24 font-bold border-yellow-300 bg-gold p-0.8 text-zinc-600 flex flex-column justify-center items-center">
                        {currentQuestion.status}
                    </div>
                </div>
            </Typography>

            <Typography id="modal-modal-description">
                <div className="pt-12 pb-[24px] border-2 border-solid border-r-0 border-t-0 border-l-0 flex justify-between items-center px-4 mt-2">
                    <div className="basis-3/12 p-3 text-xs text-white">Under Section :</div>
                    <div className="basis-9/12 text-white">
                        <select
                            value={selectedSection}
                            onChange={handleSectionChange}
                            className="w-full p-8 text-gray-200 text-xs rounded-md border-gray-500 bg-zinc-600 border-solid rounded-md border-r-0 border-t-0 border-l-0 border-b-2 border-yellow-300"
                        >
                            {sections.map((section, index) => (
                                <option key={index} value={section.sectionID}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="py-8">
                    <Deadlines
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        questions={questions}
                        RFPID={RFPID}
                        question={question}


                    />

                </div>


            </Typography>

            <div className="pt-4 pb-20 mb-4 border-solid border-r-0 border-t-0 border-l-0 ">
                <div
                    onClick={() => setNewAnswer(true)}
                    className="border-solid rounded-lg border-r-0 border-t-0 border-l-0 border-yellow-300 rounded-lg w-full bg-zinc-600 border-gray-500 text-white p-8 text-md cursor-pointer text-xs"
                >
                    {currentQuestion.question}
                </div>



                {/* {newAnswer && (
                    <button
                        onClick={() => setNewAnswer(false)}
                        className="absolute z-10 top-0 left-0 w-full h-full flex justify-center items-center bg-zinc-700 bg-opacity-70"
                    >
                        <div className="w-[300px] h-56 border-solid border-2 border-yellow-500 rounded-[50px] bg-zinc-900 shadow-lg relative">
                            <div className="flex justify-center translate-y-[-12px]">
                                <div className="rounded-full px-6 py-1 bg-white font-medium text-red-400 border border-yellow-500 border-solid">
                                    {currentQuestion.status}
                                </div>
                            </div>
                            <div
                                className={`text-left px-6 h-120 w-full overflow-y-scroll text-white ${styles.inputOverflow}`}
                            >
                                Answer: {currentQuestion.answer}
                            </div>
                            <div className="w-full flex justify-center absolute bottom-4">
                                <button
                                    className="bg-inherit border-solid border-2 border-yellow-500 text-yellow-500 px-6 py-4 rounded-xl"
                                    onClick={() => setNewAnswer(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </button>
                )} */}
            </div>

            <WritersReviewers
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                RFPID={RFPID}
                questions={questions}
                proposal={proposal}
                teamMembers={teamMembers}
            />

            {/* <div className="flex flex-column justify-start mt-8 mb-2">
          <button
            onClick={handleclick}
            className="hover:border-yellow-600 hover:text-yellow-600 text-sm border-1 border-solid  p-1 border-yellow-400 rounded-lg bg-transparent text-yellow-400 w-165"
          >
            Go to Question
          </button>
        </div>

      {currentQuestion.status === "approved" ? (
        <div></div>
      ) : (
         <div className="flex flex-column justify-end mt-8 mb-2">
          <button
            onClick={handleclick}
            className="hover:border-yellow-600 hover:text-yellow-600 text-sm border-1 border-solid  p-1 border-yellow-400 rounded-lg bg-transparent text-yellow-400 w-165"
          >
            {currentQuestion.status === "rejected"
              ? "Resubmit"
              : currentQuestion.status === "under approval" || "in progress"
              ? "Remind Approval"
              : "Submit"}
          </button>
        </div>
      )} */}
            <div className="flex justify-start mt-8 mb-2 space-x-12">
                {/* <button
    onClick={handleclick}
    className="hover:border-yellow-600 hover:text-yellow-600 text-sm border-1 border-solid p-1 border-yellow-400 rounded-lg bg-transparent text-yellow-400 w-165"
  >
    Go to Question
  </button> */}

                {currentQuestion.status !== "approved" && (
                    <button
                        onClick={handleclick}
                        className="hover:border-yellow-600 hover:text-yellow-600 text-sm border-1 border-solid p-1 border-yellow-400 rounded-lg bg-transparent text-yellow-400 w-165"
                    >
                        {currentQuestion.status === "rejected"
                            ? "Resubmit"
                            : currentQuestion.status === "under approval" || "in progress"
                                ? "Remind Approval"
                                : "Submit"}
                    </button>
                )}
            </div>
        </div>
    );
}
