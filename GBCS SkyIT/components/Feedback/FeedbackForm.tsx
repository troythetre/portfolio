import { Button, Select, Textarea, Text } from "@mantine/core";
import React, { useState, useEffect, useRef } from "react";
import { BASEURL } from "../../constants";
import { showNotification } from "@mantine/notifications";
import { useUser } from "../sectionA/NewProposal/FormDataContext";

interface FeedbackFormProps {
  onClose: () => void;
}

const FeedbackForm = ({ onClose }: FeedbackFormProps) => {
  const [feedbackType, setFeedbackType] = useState<string>("General");
  const [message, setMessage] = useState<string>("");
  const [urgency, setUrgency] = useState<number | null>(null);
  const [btnColor, setBtnColor] = useState<string>("gray")
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [wordWarning, setWordWarning] = useState<string>("");
  const textArea = useRef<HTMLTextAreaElement>(null);
  const { user } = useUser();
  const maxWords = 200;

  // Types of feedback and their corresponding values in the database
  const feedbackTypeMap: Record<string, string> = {
    General: "GENERAL",
    Bug: "BUG",
    Suggestion: "SUGGESTION",
    Complaint: "COMPLAINT",
  };

  function handleBtnClick(level: number) {
    setUrgency(level);

    // Button colors based on the level
    switch (level) {
      case 1:
        setBtnColor("#FFD966");
        break;
      case 2:
        setBtnColor("#FFB84D");
        break;
      case 3:
        setBtnColor("#FF944D");
        break;
      case 4:
        setBtnColor("#FF5E57");
        break;
      case 5:
        setBtnColor("#FF1E1E");
        break;
      default:
        setBtnColor("gray");
    }
  }

  // Handle textarea changes (max 200 words)
  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = event.currentTarget.value;
    const words = input.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;

    if (count > maxWords) {
      setWordWarning("You have exceeded the 200-word limit.");
      return;
    }
      setWordWarning("");
      setMessage(input);
      setWordCount(count);
  }

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // avoid page reload

    if (!message.trim()) {
      setError("Please enter your feedback message before submitting.");
      return;
    }

    setError(null);

    const feedbackPayload = {
      userEmail: user.userEmail,
      currentURL: window.location.href,
      feedback: message,
      types: feedbackTypeMap[feedbackType] || "GENERAL",
      urgency: urgency,
    };

    try {
      const response = await fetch(`${BASEURL}/api/feedback/addFeedback`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(feedbackPayload),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      showNotification({
        title: 'Feedback sent',
        message: 'Thanks for your feedback!',
        color: 'green',
      });

      onClose();
    } catch (error) {
      console.error("Failed to submit feedback:", error);

      showNotification({
        title: 'Submission failed',
        message: 'Something went wrong. Please try again.',
        color: 'red',
      });
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2000,
        backgroundColor: "#000",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15)",
        width: 500,
        maxHeight: "90vh",
        height: "auto",
        overflowY: "auto",
        overflow: "visible",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: 18,
          cursor: 'pointer',
        }}
        aria-label="Close"
      >
        &times;
      </button>

      <h4 style={{ marginBottom: 10 }}>Share Your Feedback</h4>

      <Select
        data={['General', 'Bug', 'Suggestion', 'Complaint']}
        value={feedbackType}
        onChange={(value) => setFeedbackType(value || 'General')}
        label="Type:"
        placeholder="Select type"
        withinPortal={false}
        styles={{
          input: {
            backgroundColor: "#2f2f2f",
            color: "white",
          },
          dropdown: {
            backgroundColor: "#2f2f2f",
            color: "white",
          },
          item: {
            '&[data-hovered]': {
              backgroundColor: "#3f3f3f",
            },
          },
          label: {
            color: "white",
            marginBottom: 4,
            paddingBottom: 6,
          },
        }}
        style={{ marginBottom: 15 }}
      />
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: "white", display: "block", marginBottom: 3 }}>
          Urgency:
        </label>
        <label style={{ color: "gray", display: "block", marginBottom: 6 }}>
          From 1 (Low) to 5 (High):
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {[1, 2, 3, 4, 5].map((level) => (
            <Button
              key={level}
              variant={urgency === level ? "filled" : "outline"}
              color="gray"
              onClick={() => handleBtnClick(level)}
              style={{
                width: 32,
                height: 32,
                padding: 0,
                textAlign: "center",
                backgroundColor: urgency === level ? btnColor : "transparent",
                color: urgency === level ? "white" : "gray",
                borderColor: urgency === level ? btnColor : "gray",
              }}
              aria-label={`Urgency level ${level}`}
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      <Textarea
        ref={textArea}
        value={message}
        onChange={handleTextareaChange}
        error={error}
        placeholder="Write your feedback here..."
        autosize
        minRows={3}
        maxRows={5}
        styles={{
          input: {
            backgroundColor: "#2f2f2f",
            color: "white",
            resize: "none",
            '::placeholder': {
              color: '#bfbfbf',
              opacity: 1,
            },
          },
        }}
        style={{ marginBottom: 10 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
        <Text size="sm" color="red">{wordWarning}</Text>
        <Text size="sm" color="gray">{wordCount}/200</Text>
      </div>

      <Button
        fullWidth
        type="submit"
        styles={{
          root: {
            backgroundColor: "#FFD700",
            color: "#000",
            "&:hover": { backgroundColor: "#e6c200" },
          },
        }}
      >
        Submit
      </Button>
    </form>
  );
};

export default FeedbackForm;