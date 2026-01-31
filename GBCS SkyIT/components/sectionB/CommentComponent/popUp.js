import { Button } from "@mantine/core";
import React from "react";
import { useState } from "react";
import Jerry from "../../../public/images/commentsPopUp/jerry.png";
import Tom from "../../../public/images/commentsPopUp/Tom.png";
import Arrow from "../../../public/images/commentsPopUp/icon_arrow_back_circle_sharp.png";
import Image from "next/image";

const PopUp = () => {
  const [comment, setComment] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);

  const isOpen = () => {
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    alert("do you want to go back?");
    return;
  };

  const handleSubmit = (reset) => {
    if (comment.trim() === "") {
      alert("Please Enter Your Comment and We will Process your Request.");
    } else {
      alert(
        "Thank you for your Submission! Someone will reach out to you shortly."
      );
    }

    // Close the modal and Reset it
    // onAddComment(comment);
    // onClose(comment);
    reset.preventDefault();
    setComment("");
  };

  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  const onAddComment = (newComment) => {
    // Perform the logic to add comment
    setComments([...comments, newComment]);
  };

  return (
    <>
      {/*Button that opens the Comment Modal */}

      {/* <Button onClick= {isOpen} class="btn-success"> Open Modal</Button> */}
      {isModalOpen && (
        <div
          className={`modal ${isOpen ? "open" : "closed"}`}
          style={{ width: 520, height: 637, position: "relative" }}
        >
          <div
            className="modal-content"
            style={{
              width: 520,
              height: 637,
              left: 0,
              top: 0,
              position: "absolute",
            }}
          >
            <div
              style={{
                width: 520,
                height: 637,
                left: 0,
                top: 0,
                position: "absolute",
                background: "#2F2F2F",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.50)",
                borderRadius: 8,
              }}
            ></div>
            <p
              style={{
                width: 438,
                height: 79,
                left: 49,
                top: 90,
                position: "absolute",
                textAlign: "center",
                color: "white",
                fontSize: 30,
                fontFamily: "Poppins",
                fontWeight: "400",
                lineHeight: 1.5,
                letterSpacing: 0.03,
                wordWrap: "break-word",
              }}
            >
              Are you sure you want to <br />
              submit for approval ?{" "}
            </p>
            <label
              style={{
                width: 123,
                height: 33,
                left: 61,
                top: 150,
                position: "absolute",
                color: "white",
                fontSize: 15,
                fontFamily: "Poppins",
                fontWeight: "400",
                lineHeight: 7.5,
                letterSpacing: 0.02,
                wordWrap: "break-word",
              }}
            >
              Comments:
            </label>

            <div
              style={{
                width: 177,
                height: 33,
                left: 61,
                top: 380,
                position: "absolute",
                color: "white",
                fontSize: 13,
                fontFamily: "Poppins",
                fontWeight: "400",
                lineHeight: 4,
                letterSpacing: 0.02,
                wordWrap: "break-word",
              }}
            >
              Who will be notified:
            </div>
            <div
              style={{
                width: 174,
                height: 55,
                left: 61,
                top: 543,
                position: "absolute",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 174,
                  height: 55,
                  left: 0,
                  top: 0,
                  position: "absolute",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: 15,
                  border: "2px #DEBF1A solid",
                }}
              />
              <Button
                onClick={onClose}
                style={{
                  width: 149,
                  height: 34,
                  left: 9,
                  top: 10,
                  position: "absolute",
                  textAlign: "center",
                  color: "#DEBF1A",
                  fontSize: 30,
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  lineHeight: 1,
                  letterSpacing: 0.03,
                  wordWrap: "break-word",
                  background: "#2F2F2F",
                }}
              >
                No
              </Button>
            </div>
            <div
              style={{
                width: 55,
                height: 55,
                left: 214,
                top: 427,
                position: "absolute",
              }}
            >
              <div
                style={{
                  width: 55,
                  height: 55,
                  left: 0,
                  top: 0,
                  position: "absolute",
                  borderRadius: 40,
                }}
              >
                <div
                  style={{
                    width: 55,
                    height: 55,
                    left: 0,
                    top: 0,
                    position: "absolute",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: 40,
                    border: "2px #DEBF1A solid",
                  }}
                />
                <div
                  style={{
                    width: 47.1,
                    height: 34,
                    left: 2.84,
                    top: 10,
                    position: "absolute",
                    textAlign: "center",
                  }}
                ></div>
              </div>
              <div
                style={{
                  left: 19,
                  top: 13,
                  position: "absolute",
                  textAlign: "center",
                  color: "#DEBF1A",
                  fontSize: 30,
                  fontFamily: "Poppins",
                  fontWeight: "400",
                  lineHeight: 1,
                  letterSpacing: 0.02,
                  wordWrap: "break-word",
                }}
              >
                +
              </div>
            </div>
            <div
              style={{
                width: 174,
                height: 55,
                left: 285,
                top: 544,
                position: "absolute",
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  width: 174,
                  height: 55,
                  left: 0,
                  top: 0,
                  position: "absolute",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  borderRadius: 15,
                  border: "2px #DEBF1A solid",
                }}
              />
              <Button
                onClick={handleSubmit}
                style={{
                  width: 149,
                  height: 34,
                  left: 9,
                  top: 10,
                  position: "absolute",
                  textAlign: "center",
                  color: "#DEBF1A",
                  fontSize: 30,
                  fontFamily: "Poppins",
                  fontWeight: "500",
                  lineHeight: 1,
                  letterSpacing: 0.03,
                  wordWrap: "break-word",
                  background: "#2F2F2F",
                }}
              >
                Submit
              </Button>
            </div>
            <div className="ArrowM">
              <Image src={Arrow} onClick={onClose} alt="close button" />
            </div>
          </div>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            placeholder="Write your comment..."
            onChange={(e) => setComment(e.target.value)}
            required
            style={{
              width: 398,
              height: 141,
              left: 61,
              top: 232,
              position: "absolute",
              background: "#555555",
              borderRadius: 8,
              borderBottom: "3px #DEBF1A solid",
            }}
          />
          <div className="Image">
            <Image
              src={Jerry}
              width={55}
              height={55}
              onClick={handleSubmit}
              alt="Jerry Image"
            />
          </div>
          <div className="Image-Tom">
            <Image
              src={Tom}
              width={55}
              height={55}
              onClick={handleSubmit}
              alt="Tom Image"
            />
          </div>

          <div
            style={{
              width: 100,
              height: 100,
              left: 462,
              top: 111,
              position: "absolute",
            }}
          />
        </div>
      )}
    </>
  );
};

export default PopUp;
