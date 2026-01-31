import React, { useState } from "react";
import OverlayComponent from "../../sectionB/sideBar/OverlayComponent";
import SubmitSuccessfully from "../../sectionB/sideBar/SubmitSuccessfully";
import Image from "next/image";
import styles from "../DashboardComponent/RfpCard/MenuStyle.module.css";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";
import ErrorModal from "../../modals/errors/errorModal";

//We will come back to this
//import { Link } from "react-router-dom";

interface MenuItemProps {
    icon: string;
    children: React.ReactNode;
    onClose: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, children, onClose }) => {
    return (
        <div className="flex items-center gap-3 px-4">
            <Image src={icon} alt={`${children} icon`} width={30} height={30} className={styles.icon} />
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
}

const ArchiveProposalMenu: React.FC<MenuProps> = ({
    RFPName,
    RFPID,
    rfpId,
    onClose,
    ProposalDetails,
    setProposalDetails,
    setIsMenuOpen,
    onClick,
}) => {
    const [overlays, setOverlays] = useState<{ showSubmitSuccessfullyCard: boolean }>({
        showSubmitSuccessfullyCard: false,
    });
    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: !prevOverlays[overlayName] }));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: false }));
    };
    const [rfpName, setRFPName] = useState(""); // Initial RFP Name
    const [isInputVisible, setInputVisible] = useState(false);
    const [action, setAction] = useState(false);
    const [actionType, setActionType] = useState("");
    const router = useRouter();

    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const actionMessages = {
        rename: "Proposal Renamed",
        bookmark: "Proposal Bookmarked", //Add more actions
        restore: "Proposal Restored",
    };

    /* Open Proposal link */
    const handleNavigation = () => {
        router.push({
            pathname: "/edit-proposal",
            query: { proposalID: rfpId }, // Passing data as query params
        });
    };

    const handleCancelClick = () => {
        setInputVisible(!isInputVisible);
    };
    /* Update Proposal Name PUT Request */
    const handleSaveClick = async () => {
        try {
            const payload = {
                proposalID: rfpId,
                new_name: rfpName,
            };
            const response = await fetch(`${BASEURL}/api/proposal/update-proposal-name`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setAction(true);
                setActionType("rename");
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
        setInputVisible(!isInputVisible);
        //handleSaveClick();
    };

    /* Restore Request */
    const handleRestore = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/restore`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalID: rfpId,
                }),
            });

            if (response.ok) {
                console.log("Restored");
                setAction(true);
                setActionType("restore");
                toggleOverlay("showSubmitSuccessfullyCard");
            } else {
                console.error("Failed to Restore Proposal");
                setErrorMessage("Failed to Restore Proposal");
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
                    proposalID: rfpId,
                }),
            });

            if (response.ok) {
                setAction(true);
                setActionType("bookmark");
                toggleOverlay("showSubmitSuccessfullyCard");
            } else {
                console.error("Failed to Bookmark Proposal");
                setErrorMessage("Failed to Bookmark Proposal");
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

            <div className="bg-[#555555] text-white w-[230px] rounded-lg p-1 cursor-pointer">
                <div onClick={handleRestore}>
                    <MenuItem icon="/images/dashboard/icon/restore.svg">Restore</MenuItem>
                </div>
                <OverlayComponent
                    show={overlays.showSubmitSuccessfullyCard}
                    onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                >
                    <SubmitSuccessfully
                        onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                        message={action ? actionMessages[actionType] || "" : ""}
                    />
                </OverlayComponent>
            </div>
        </div>
    );
};

export default ArchiveProposalMenu;
