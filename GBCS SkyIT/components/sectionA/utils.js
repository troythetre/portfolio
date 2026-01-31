import axios from "axios";
import { BASEURL } from "../../constants/index";
import { format } from "date-fns";

export const fetchSectionData = async (RFPID, sectionID) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/proposal/section/get-section-content/${RFPID}/${sectionID}`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching section data:", error);
    return null;
  }
};

export const handleAddQuestion = async (RFPID, sectionID, newQuestion, newAnswer,
  writers = [],
  reviewers = [],
  writerDeadline,
  reviewerDeadline
) => {
  try {
    const obj = {
      proposalID: RFPID,
      sectionID: sectionID,

      question: newQuestion,
      answer: newAnswer || " ",
      templateRefID: "",
      comment: "This is a key question regarding the project.",
      writers: writers.map((writer) => ({
        writerName: writer.displayName,
        writerEmail: writer.userEmail,
        writerDeadline: format(writerDeadline, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),

      })),
      reviewers: reviewers.map((reviewer) => ({

        reviewerName: reviewer.displayName,
        reviewerEmail: reviewer.userEmail,
        reviewDeadline: format(reviewerDeadline, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),

      })),
    };
    
    const response = await fetch(`${BASEURL}/api/proposal/add-question`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to add question: ${response.status} - ${errorMessage}`);
    }

    return;

  } catch (error) {
    console.error("Error adding question:", error);
  }
};
