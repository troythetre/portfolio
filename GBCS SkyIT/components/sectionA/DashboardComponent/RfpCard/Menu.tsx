import React, { useState, useEffect } from "react";
import Link from "next/link";
import OverlayComponent from "../../../sectionB/sideBar/OverlayComponent";
import SubmitSuccessfully from "../../../sectionB/sideBar/SubmitSuccessfully";
import Image from "next/image";
import styles from "./MenuStyle.module.css";
import { BASEURL } from "../../../../constants";
import GoldBorderButton from "../../../sectionB/sideBar/GoldBorderButton";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import teamGold from "../../../../public/images/teamIconGolden.svg";
import iconDefault from "../../../../public/images/icondefault.svg";
import ErrorModal from "../../../modals/errors/errorModal";
import ManageTeam from "../../setting-grid/ManageTeam";
import { showNotification } from "@mantine/notifications";

//We will come back to this
//import { Link } froms "react-router-dom";

interface MenuItemProps {
    icon: string;
    children: React.ReactNode;
    onClose: () => void;
    onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, children, onClick }) => {
    return (
        <div className="flex items-center gap-3 px-4 cursor-pointer" onClick={onClick}>
            <Image src={icon} alt={`${children} icon`} width={30} height={30} />
            <div className="w-full">
                <span className="font-poppins text-left text-white text-lg border border-solid border-zinc-500 border-l-0 border-r-0 border-t-0 block pb-4 my-1">
                    {children}
                </span>
            </div>
        </div>
    );
};

interface MenuProps {
    RFPName: string;
    RFPID: string;
    rfpId: string;
    onClose: () => void;
    ProposalDetails: any[]; // Replace 'any' with the actual type if available
    setProposalDetails: (proposals: any[]) => void; // Replace 'any' with the actual type if available
    setIsMenuOpen: (isOpen: boolean) => void;
    onClick?: () => void;
}

const Menu: React.FC<MenuProps> = ({
    RFPName,
    RFPID,
    rfpId,
    onClose,
    ProposalDetails,
    setProposalDetails,
    setIsMenuOpen,
    onClick,
}) => {
    const [overlays, setOverlays] = useState<{ showSubmitSuccessfullyCard: boolean; showNotesOverlay: boolean }>({
        showSubmitSuccessfullyCard: false,
        showNotesOverlay: false,  
    });

    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: !prevOverlays[overlayName] }));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: false }));
    };

    const [open, setOpen] = useState(false);
    const [isDropdownEditorOpen, setIsDropdownEditorOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [rfpName, setRFPName] = useState(""); // Initial RFP Name
    const [isInputVisible, setInputVisible] = useState(false);
    const [action, setAction] = useState(false);
    const [isNotesEditing, setIsNotesEditing] = useState(false);
    const [actionType, setActionType] = useState("");
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const router = useRouter();
    const { pathname } = useRouter();
    const [notes, setNotes] = useState("");  
    const [isBookmarked, setIsBookmarked] = useState(false);

    const isActive = (route: string): boolean => pathname === route;

    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const actionMessages = {
        rename: "Proposal Renamed",
        bookmark: "Proposal Bookmarked", //Add more actions
        StatusChange: "Changed the status successfully",
    };

    // Fetching bookmarked proposals
    useEffect(() => {
        const fetchBookmarkedProposals = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/bookmarkedproposals`, {
                    credentials: "include",
                });
                const jsonData = await response.json();
                // Check if the current proposal is bookmarked
                const isBookmarkedProposal = jsonData.proposals.some((proposal: { id: string }) => proposal.id === RFPID);
                setIsBookmarked(isBookmarkedProposal);
            } catch (error) {
                console.error("Fetch error", error);
            }
        };

        fetchBookmarkedProposals();
    }, [RFPID]); // Re-run the effect when RFPID changes

    /* Open Proposal link */
    const handleNavigation = () => {
        router.push({
            pathname: "/edit-proposal",
            query: { proposalID: RFPID }, // Passing data as query params
        });
    };

    const handleTeamManagement = (RFPID: string) => {
        toggleOverlay("showSubmitSuccessfullyCard");
    };

    const handleCancelClick = () => {
        setRFPName(RFPName); // Reset to original name
        setInputVisible(false);
    };

    const handleSaveClick = async () => {
        try {
            const payload = {
                proposalID: RFPID,
                new_name: rfpName,
            };
            const response = await fetch(`${BASEURL}/api/proposal/update-proposal-name`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setAction(true);
                setActionType("rename");
                setInputVisible(false); // Hide the input field after successful save
                console.log("Proposal name updated successfully");
                // toggleOverlay("showSubmitSuccessfullyCard"); // This will only run if response.ok is true
            } else {
                console.error("Failed to update name");
                setErrorMessage("Failed to update name");
                setErrorDet(true);
                setDefError(true);
                setFourOhOne(false);
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
    };

    const goToSave = () => {
        setInputVisible(true);
    };

    /* Archive Delete Request */
    const handleArchiveClick = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/delete`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalID: RFPID,
                }),
            });

            if (response.ok) {
                console.log("Deleted");
                // toggleOverlay("showSubmitSuccessfullyCard");
            } else {
                console.error("Failed to Delete Proposal");
                setErrorMessage("Failed to Delete Proposal");
                setErrorDet(true);
                setDefError(true);
                setFourOhOne(false);
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

        // finds the proposal with the proposalID and removes it from the ProposalDetails array
        let newProposals = ProposalDetails.filter((proposal) => {
            return proposal.proposalId !== RFPID;
        });
        // updates the proposal list from the DashboardPage
        setProposalDetails(newProposals);
        // we then close the modal
        setIsMenuOpen(false);
        // closes the detailRFPComp to show the cardDash
        // onClick();
    };

    /* bookmark PUT request */
    const handleBookMarkClick = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/bookmark`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalID: RFPID,
                }),
            });

            if (response.ok) {
                setAction(true);
                setActionType("bookmark");
                setIsBookmarked(!isBookmarked); // Toggle bookmark status
                // toggleOverlay("showSubmitSuccessfullyCard");
            } else {
                console.error("Failed to Bookmark Proposal");
                setErrorMessage("Proposal already Bookmarked");
                setErrorDet(true);
                setDefError(true);
                setFourOhOne(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid authentication token or expired token. Please login again.");
                setErrorDet(true);
                setFourOhOne(true);
                setDefError(false);
            } else if (error.response && error.response.status === 400) {
                setErrorMessage("Proposal already Bookmarked.");
                setErrorDet(true);
                setDefError(true);
                setFourOhOne(false);
            }
        }
    };

    // unBookmark
    const handleUnBookMarkClick = async () => {
        try {
            const endpoint = `${BASEURL}/api/proposal/unbookmark`; // Adjust this if your API endpoint is different
            const method = isBookmarked ? "PUT" : "PUT"; // Both cases should use PUT for unbookmarking

            const response = await fetch(endpoint, {
                method: method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ proposalID: RFPID }), // Ensure the proposal ID is passed correctly
            });

            if (response.ok) {
                setIsBookmarked(!isBookmarked); // Toggle bookmark status
                const actionType = isBookmarked ? "unbookmark" : "bookmark";
                // toggleOverlay("showSubmitSuccessfullyCard"); // Show success message
            } else {
                const errorResponse = await response.json();
                const errorMsg = isBookmarked
                    ? errorResponse.message || "Failed to unbookmark the proposal."
                    : errorResponse.message || "Failed to bookmark the proposal.";

                setErrorMessage(errorMsg);
                setErrorDet(true);
            }
        } catch (error) {
            setErrorMessage("An error occurred while processing your request. Please try again.");
            setErrorDet(true);
        }
    };

    /* Change Status */
    const handleStatusChangeClick = (status: string) => {
        setSelectedStatus(status);
        handleStatusSaveClick(status);
    };

    const handleStatusSaveClick = async (status: string) => {
        try {
            const payload = {
                proposalID: RFPID,
                status: status,
                note: "change again",
            };
            // console.log("Payload for status change:", payload); // Debugging log
            const response = await fetch(`${BASEURL}/api/proposal/update-status`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setAction(true);
                setActionType("StatusChange");
                toggleOverlay("showSubmitSuccessfullyCard");
            } else {
                console.error("Failed to update status");
                setErrorMessage("Failed to update status");
                setErrorDet(true);
                setDefError(true);
                setFourOhOne(false);
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
        setIsStatusMenuOpen(false);
    };

    // Function to handle opening the notes overlay
    const handleNotesClick = () => {
        toggleOverlay("showNotesOverlay");
    };

    //Handle saving notes to each RFP document
    const handleSaveNotes = () => {
        localStorage.setItem(`notes-${RFPID}`, notes);  
        showNotification({
            title: 'Notes Saved',
            message: 'Your notes have been saved successfully!',
            color: 'green',
        });
        setIsNotesEditing(false); 
        closeOverlay("showNotesOverlay");
    };

    useEffect(() => {
        const storedNotes = localStorage.getItem(`notes-${RFPID}`);
        if (storedNotes) {
            setNotes(storedNotes);
        }
    }, [RFPID]);

    return (
        <div>
            {errorDet && (
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
            )}

            <div className="bg-[#555555] text-white w-[230px] rounded-lg p-12 cursor-pointer">
                <div onClick={handleNavigation}>
                    <MenuItem icon="/images/dashboard/icon/open.svg">Open</MenuItem>
                </div>

                <div onClick={goToSave}>
                    <MenuItem icon="/images/dashboard/icon/rename.svg">Rename</MenuItem>
                </div>

                <div>
                    {isInputVisible && (
                        <div className="flex flex-col">
                            <input
                                type="text"
                                value={rfpName}
                                onChange={(e) => setRFPName(e.target.value)} // Track input changes
                                placeholder="Enter new name"
                                className="w-44 h-10 px-5 rounded-lg border"
                            />
                            <div className="flex gap-2 mt-2">
                                <GoldBorderButton label="Save" onClick={handleSaveClick} />
                                <GoldBorderButton label="Cancel" onClick={handleCancelClick} />
                            </div>
                        </div>
                    )}
                </div>

                <MenuItem icon="/images/dashboard/icon/copy.svg">Copy</MenuItem>
                <MenuItem icon="/images/dashboard/icon/notes.svg" onClick={() => {
                    setOverlays({ ...overlays, showNotesOverlay: true });
                }}>Notes</MenuItem>
                <div onClick={handleArchiveClick}>
                    <MenuItem icon="/images/dashboard/archive_gold.svg">Archive</MenuItem>
                </div>
                <MenuItem icon="/images/dashboard/icon/send.svg">Send</MenuItem>
                <div onClick={isBookmarked ? handleUnBookMarkClick : handleBookMarkClick}>
                    <MenuItem icon={isBookmarked ? "/images/dashboard/bookmarked_gold.svg" : "/images/dashboard/icon/bookmark.svg"}>
                        {isBookmarked ? "Unbookmark" : "Bookmark"}
                    </MenuItem>
                </div>
                {router.pathname === "/my_task/submittedProposals" && (
  <div className="relative">
    <div onClick={() => setIsStatusMenuOpen((prev) => !prev)}>
      <MenuItem icon="/images/dashboard/icon/fact_check.svg" onClose={onClose}>
        Change Status
      </MenuItem>
    </div>

    {isStatusMenuOpen && (
      <div className="absolute top-full mt-2 left-0 w-[160px] bg-accent-color rounded-md shadow-lg z-[9999]">
        {["Approved", "Review", "Rejected"].map((status) => (
          <div
            key={status}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700"
            onClick={() => handleStatusChangeClick(status)}
          >
            <input
              type="radio"
              id={status}
              name="status"
              value={status}
              checked={selectedStatus === status}
              onChange={() => handleStatusChangeClick(status)}
              className="mr-2"
            />
            <label htmlFor={status}>{status}</label>
          </div>
        ))}
      </div>
    )}
  </div>
)}

                <div onClick={() => { handleTeamManagement(RFPID) }}>
                    <MenuItem icon="/images/teamIconGolden.svg">Manage Team</MenuItem>
                    {/* </Link> */}
                </div>

                <OverlayComponent
                    show={overlays.showSubmitSuccessfullyCard}
                    onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                >
                    <ManageTeam
                        proposalID={RFPID}
                        onClose={() => closeOverlay("showSubmitSuccessfullyCard")} />
                    {/* <SubmitSuccessfully
                        onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                        message={action ? actionMessages[actionType] || "" : ""}
                    /> */}
                </OverlayComponent>

        {/* Notes  */}
        <OverlayComponent show={overlays.showNotesOverlay} onClose={() => closeOverlay("showNotesOverlay")}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
             <div className="bg-[#2E2E2E] text-white p-6 rounded-xl shadow-2xl w-[600px] max-w-full relative">
              <button
                 className="absolute top-3 right-4 bg-transparent text-gray-400 text-xl font-bold hover:text-gray-200 
                 transition-colors z-10 outline-none focus:outline-none focus:ring-0 
                 focus:border-transparent active:outline-none px-3 py-2 rounded"
                 onClick={() => closeOverlay("showNotesOverlay")}
                 aria-label="Close notes popup"
                >
            &times;
        </button>

      <h2 className="text-xl font-semibold text-center border-b border-gray-600 pb-2 mb-4">
        {RFPName || "Untitled Proposal"}
      </h2>
      {!isNotesEditing ? (
        <>
          <div className="bg-[#3C3C3C] text-white p-4 rounded min-h-[150px] whitespace-pre-wrap mb-4 border border-gray-700">
            {notes || <em className="text-gray-400">No notes yet.</em>}
          </div>
          <div className="flex justify-center">
            <GoldBorderButton label="Edit Notes" onClick={() => setIsNotesEditing(true)} />
          </div>
        </>
      ) : (
        <>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-48 p-3 rounded border border-gray-600 text-white bg-[#3C3C3C] resize-none"
            placeholder="Write your notes here..."
          />
          <div className="flex justify-end gap-3 mt-4">
            <GoldBorderButton label="Save" onClick={handleSaveNotes} />
            <GoldBorderButton label="Cancel" onClick={() => {
            setIsNotesEditing(false);
            setNotes(localStorage.getItem(`notes-${RFPID}`) || "");
            }} />
            </div>
            </>
          )}
        </div>
      </div>
    </OverlayComponent>
  </div>
 </div>
    );
};

export default Menu;