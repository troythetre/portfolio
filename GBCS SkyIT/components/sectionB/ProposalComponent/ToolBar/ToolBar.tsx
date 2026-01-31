import React, { useState, useRef, useEffect, useReducer } from "react";
import { ReactSVG } from "react-svg";
import Image from "next/image";
import visibility_on from "../../../../public/images/edit-proposal/visibility_on.svg";
import visibility_off from "../../../../public/images/edit-proposal/visibility_off.svg";
import QuillToolbar from "./Text";
import ColorPicker from "./ColorPicker";
import MediaCard from "../../MediaAi/MediaCard";
import MediaLibrary from "../../MediaLibrary/MediaLibrary";
import InsertQuestionModal from "../../InsertQuestion/InsertQuestionModal";
import InsertResponseModal from "../../InsertResponse/InsertResponseModal";
import { dividerClasses } from "@mui/material";
import { getEventListeners } from "events";
import { BASEURL } from "../../../../constants";

interface ToolBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onInteract: () => void;
  contentEditableRef: React.RefObject<HTMLDivElement>;
  sectionID: string;
  htmlContent: string;
  setHtmlContent: React.Dispatch<React.SetStateAction<string>>;
}

type ResponseDiv = {
  div: HTMLElement;
  active: boolean;
};

const ToolBar: React.FC<ToolBarProps> = ({
  onUndo,
  onRedo,
  contentEditableRef,
  sectionID,
  onInteract,
  htmlContent,
  setHtmlContent,
}) => {
  // console.log(contentEditableRef, htmlContent, onInteract)
  const [visible, setVisible] = useState(true);
  const [activeToolbar, setActiveToolbar] = useState(false);
  const [defaultButton, setDefaultButton] = useState(false);
  const [activeButton, setActiveButton] = useState<string>("");
  const [tool, setTool] = useState("");
  const [undoBar, setUndoBar] = useState(false);
  const [redoBar, setRedoBar] = useState(false);
  const [selectionBar, setSelectionBar] = useState(false);
  const [textBar, setTextBar] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState(false);
  const [comment, setComment] = useState(false);
  const [mediaAI, setMediaAI] = useState(false);
  const [insertResponse, setInsertResponse] = useState(false);
  const [displayStyle, setDisplayStyle] = useState(false);
  const [responseDivs, setResponseDivs] = useState<ResponseDiv[]>([]);

  const handleToolBarVisible = () => {
    setDefaultButton(!defaultButton);
    setVisible((visible) => !visible);
    setActiveToolbar((activeToolbar) => !activeToolbar);
    setDisplayStyle((displayStyle) => !displayStyle);
    onInteract();
  };
  useEffect(() => {
    setActiveButton(defaultButton ? "selection" : "");
  }, [defaultButton]);

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
    // Handle button-specific logic here
    switch (button) {
      case "undo":
        break;
      case "redo":
        break;
      case "selection":
        break;
      case "colorPicker":
        break;
      case "textChanger":
        break;
      case "media":
        break;
      case "comment":
        break;
      case "ai":
        break;
      case "iResponse":
        break;
      default:
        break;
    }
  };

  // handle toolbar buttons visability and style
  const handleUndoBarVisible = () => {
    onUndo();
    setUndoBar(!undoBar);
    setRedoBar(false);
    setSelectionBar(false);
    setColorChange(false);
    setTextBar(true);
    setMediaLibrary(false);
    setComment(false);
    setMediaAI(false);
    setInsertResponse(false);
    setActiveButton("undo");
  };
  const handleRedoBarVisible = () => {
    onRedo();
    setRedoBar(!redoBar);
    setUndoBar(false);
    setSelectionBar(false);
    setColorChange(false);
    setTextBar(false);
    setMediaLibrary(false);
    setComment(false);
    setMediaAI(false);
    setInsertResponse(false);
    setActiveButton("redo");
  };
  const handleSelectionBarVisible = () => {
    setSelectionBar(!selectionBar);
    setRedoBar(false);
    setUndoBar(false);
    setColorChange(false);
    setTextBar(false);
    setMediaLibrary(false);
    setComment(false);
    setMediaAI(false);
    setInsertResponse(false);
    setActiveButton("selection");
  };
  const handleColorBarVisible = () => {
    setColorChange(!colorChange);
    setRedoBar(false);
    setUndoBar(false);
    setSelectionBar(false);
    setTextBar(false);
    setMediaLibrary(false);
    setComment(false);
    setMediaAI(false);
    setInsertResponse(false);
    setActiveButton("colorPicker");
  };
  const handleTextBarVisible = () => {
    setTextBar(!textBar);
    setRedoBar(false);
    setUndoBar(false);
    setSelectionBar(false);
    setColorChange(false);
    setMediaLibrary(false);
    setComment(false);
    setMediaAI(false);
    setInsertResponse(false);
    setActiveButton("textChanger");
  };
  const handleMediaLibraryVisible = () => {
    setMediaLibrary(!mediaLibrary);
    setRedoBar(false);
    setUndoBar(false);
    setSelectionBar(false);
    setColorChange(false);
    setTextBar(false);
    setComment(false);
    setMediaAI(false);
    setInsertResponse(false);
    setActiveButton("media");
  };
  const handleCommentVisible = () => {
    setComment(!comment);
    setRedoBar(false);
    setUndoBar(false);
    setSelectionBar(false);
    setColorChange(false);
    setTextBar(false);
    setMediaLibrary(false);
    setMediaAI(false);
    setInsertResponse(false);
    setActiveButton("comment");
  };
  const handleMediaAIVisible = () => {
    setMediaAI(!mediaAI);
    setMediaLibrary(false);
    setRedoBar(false);
    setUndoBar(false);
    setSelectionBar(false);
    setColorChange(false);
    setTextBar(false);
    setComment(false);
    setInsertResponse(false);
    setActiveButton("ai");
  };
  const handleInsertResponseVisible = () => {
    setInsertResponse(!insertResponse);
    setMediaLibrary(false);
    setRedoBar(false);
    setUndoBar(false);
    setSelectionBar(false);
    setColorChange(false);
    setTextBar(false);
    setComment(false);
    setMediaAI(false);
    setActiveButton("iResponse");
  };

  const getResponseDivs = () => {
    const responses = document.getElementsByClassName("answer");
    console.log(
      "these are the responses, and this is the length",
      responses,
      responses.length
    );

    const responseArray: ResponseDiv[] = [];

    for (let i = 0; i < responses.length; i++) {
      let newResponse = { div: responses[i], active: false };
      responseArray.push(newResponse);
    }

    setResponseDivs(responseArray);
    console.log(responseArray); // You should log `responseArray` instead of `responseDivs` here
  };

  const handleResponseModalClick = () => {
    if (responseDivs.length === 0) {
      getResponseDivs();
    }
  };

  useEffect(() => {
    console.log("adding an event listener");

    const handleClick = (e: Event) => handleResponseInputClick(e);

    // Add event listeners
    responseDivs.forEach((el) => {
      el.div.addEventListener("click", handleClick);
    });

    // Cleanup event listeners when component unmounts or `responseDivs` changes
    return () => {
      console.log("removing EventListeners");
      responseDivs.forEach((el) => {
        el.div.removeEventListener("click", handleClick);
      });
    };
  }, [responseDivs]);

  const handleResponseInputClick = async (e: Event) => {
    console.log("setting this div as active", e.currentTarget);

    const target = e.currentTarget as HTMLDivElement;

    const questionContainer = target.closest(".answer");
    // console.log("Question container:", questionContainer);

    if (questionContainer) {
      const questionID = questionContainer.getAttribute("data-question-id");
      console.log("Found question container with ID:", questionID);

      const maxHeight = 650; // Max allowed height for each question
      const totalHeight = questionContainer.scrollHeight; // Total content height of this question

      console.log("Total height of question container:", totalHeight);

      // Check if this specific question's total height exceeds the maximum allowed height
      if (totalHeight > maxHeight) {
        console.log(
          `Overflow detected for question ${questionID}! Question container exceeds 650px.`
        );

        // Call the /section-overflow API with dynamic questionID
        try {
          const response = await fetch(`${BASEURL}/api/section-overflow`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sectionID: sectionID,
              proposalID: proposalID,
              questionID: questionID, // Include the dynamic questionID in the API body
            }),
          });

          if (response.ok) {
            console.log(
              `Overflow handled for question ${questionID}, new section created.`
            );
            // setDataChanged(true); // Trigger re-render
          } else {
            console.error(
              `Failed to handle overflow for question ${questionID}.`
            );
          }
        } catch (error) {
          console.error(
            `Error handling overflow for question ${questionID}:`,
            error
          );
        }
      }
    }
    // Update the state to reflect which div is active
    setResponseDivs((prevResponseDivs) =>
      prevResponseDivs.map((el) => {
        if (el.div === e.currentTarget) {
          return { ...el, active: true };
        } else {
          return { ...el, active: false };
        }
      })
    );
  };

  return (
    <div className="">
      <div className={`p-2 mb-4 rounded-lg right-2 fixed `} style={{ backgroundColor: "#19191A" }}>
        {/* <div className="pt-1 p-2"> */}
        <div
          className={`flex rounded-md mb-2 cursor-pointer items-center gap-x-1 shadow-inner`}
        >
          {visible ? (
            <Image
              src={visibility_on}
              width="30px"
              height="30px"
              onClick={handleToolBarVisible}
              alt="Icon visible"
            />
          ) : (
            <Image
              src={visibility_off}
              width="30px"
              height="30px"
              onClick={handleToolBarVisible}
              alt="Icon not visible"
            />
          )}
        </div>
        {/* <div className="w-[35px] h-[1px] bg-accent-color mb-4"></div> */}
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 shadow-inner
                        ${activeToolbar ? "hover:bg-accent-color" : ""}`}
          style={{
            backgroundColor: activeButton === "undo" ? "#555555" : "",
          }}
        // onClick={() => handleButtonClick('undo')}
        >
          <ReactSVG
            src="/images/edit-proposal/undo.svg"
            onClick={handleUndoBarVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 shadow-inner
                        ${activeToolbar ? "hover:bg-accent-color" : ""} `}
          style={{
            backgroundColor: activeButton === "redo" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/redo.svg"
            onClick={handleRedoBarVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div className="w-[35px] h-[1px] bg-accent-color mb-4"></div>
        <div
          id="selection"
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 ${activeToolbar ? "hover:bg-accent-color" : ""
            } shadow-inner`}
          onChange={() => setTool("selection")}
          style={{
            backgroundColor: activeButton === "selection" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/selection.svg"
            onClick={handleSelectionBarVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 ${activeToolbar ? "hover:bg-accent-color" : ""
            } shadow-inner`}
          style={{
            backgroundColor: activeButton === "textChanger" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/type-tool.svg"
            onClick={handleTextBarVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              stroke: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 ${activeToolbar ? "hover:bg-accent-color" : ""
            } shadow-inner`}
          style={{
            backgroundColor: activeButton === "colorPicker" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/color.svg"
            onClick={handleColorBarVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 ${activeToolbar ? "hover:bg-accent-color" : ""
            } shadow-inner`}
          style={{
            backgroundColor: activeButton === "media" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/media.svg"
            onClick={handleMediaLibraryVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 ${activeToolbar ? "hover:bg-accent-color" : ""
            } shadow-inner`}
          style={{
            backgroundColor: activeButton === "comment" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/comment.svg"
            onClick={handleCommentVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 ${activeToolbar ? "hover:bg-accent-color" : ""
            } shadow-inner`}
          style={{
            backgroundColor: activeButton === "ai" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/ai.svg"
            onClick={handleMediaAIVisible}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
        <div
          className={`flex rounded-md p-1 mb-2 cursor-pointer items-center gap-x-1 ${activeToolbar ? "hover:bg-accent-color" : ""
            } shadow-inner`}
          style={{
            backgroundColor: activeButton === "iResponse" ? "#555555" : "",
          }}
        >
          <ReactSVG
            src="/images/edit-proposal/Insert_response.svg"
            onClick={() => {
              handleInsertResponseVisible();
              handleResponseModalClick();
            }}
            style={{
              pointerEvents: activeToolbar ? "auto" : "none",
              fill: activeToolbar ? "#FFFFFF" : "#555555",
            }}
          />
        </div>
      </div>

      <div className="h-fit p-2 mt-10 rounded-lg absolute right-14 top-80">
        {colorChange && (
          <ColorPicker
            style={displayStyle}
            htmlContent={htmlContent}
            setHtmlContent={setHtmlContent}
          />
        )}
      </div>
      <div className="p-2 rounded-lg right-14 top-80">
        {textBar && (
          <QuillToolbar
            contentEditableRef={contentEditableRef}
            style={displayStyle}
          />
        )}
      </div>
      <div className="p-2 mt-10 mb-2 rounded-lg absolute right-14 top-10">
        {mediaLibrary && (
          <MediaLibrary
            onClose={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
      </div>
      <div className="h-fit p-2 mt-10 mb-2 rounded-lg absolute right-14 top-10">
        {mediaAI && <MediaCard />}
      </div>

      <div className="h-fit p-2 mt-10 mb-2 rounded-lg fixed right-20 top-36">
        {insertResponse && (
          <InsertResponseModal
            sectionID={sectionID}
            responsiveDivs={responseDivs}
          />
        )}
      </div>
    </div>
  );
};

export default ToolBar;
