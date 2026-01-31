import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import styles from "./dropdown.module.css";
import iconChecked from "../../../../../../public/images/dashboard/icon-checked.svg";
import iconReview from "../../../../../../public/images/dashboard/icon-checked.svg";
import iconAlert from "../../../../../../public/images/dashboard/icon-checked.svg";
import Link from "next/link";
import Section from "./SectionCard";
import { BASEURL } from "../../../../../../constants";
import ErrorModal from "../../../../../modals/errors/errorModal";
import CreateSection from "../../../../../sectionB/sideBar/CreateSection";
import OverlayComponent from "../../../../../sectionB/sideBar/OverlayComponent";

interface DropDownMenuProps {
    id: string;
    date: string | Date;
}

interface Section {
    sectionID: string;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
    id,
    date,
}) => {
    const [data, setData] = useState<{ sections: Section[] } | null>(null);
    // error modal states
    const [errorDet, setErrorDet] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [overlays, setOverlays] = useState<{
        showCreateSection: boolean;
    }>({
        showCreateSection: false,
    });
    // Fetch sections data
    const fetchSections = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/get-all-sections/${id}`, {
                method: "GET",
                credentials: "include",
            });

            let jsonData = await response.json();
            setData(jsonData); // Assuming jsonData contains your data
            console.log(jsonData);
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
    // Fetch sections on component mount
    useEffect(() => {
        fetchSections();
    }, [sections]);

    function getDaysRemaining(date: any) {
        const currentDate = new Date();

        const differenceInTime = date.getTime() - currentDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays === 0) {
            return 0;
        } else if (differenceInDays < 0) {
            return 0;
        } else if (isNaN(differenceInDays)) {
            return 0;
        } else {
            return differenceInDays;
        }
    }

    const getSectionLabel = (index: number) => {
        return `Section ${String.fromCharCode(65 + index)}`;
    };

    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: !prevOverlays[overlayName] }));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: false }));
    };
    const renderOverlay = (overlayName: keyof typeof overlays, component: React.ReactNode) => (
        <OverlayComponent show={overlays[overlayName]} onClose={() => closeOverlay(overlayName)}>
            {component}
        </OverlayComponent>
    );
    const handleCreateSection = (newSection: Section) => {
        setSections((prevSections) => [...prevSections, newSection]);
        closeOverlay("showCreateSection"); // Close the overlay after adding
    };
    return (
        <div className="ml-12 my-8">
            {errorDet && (
                <div className="fixed z-20 top-0 left-0 w-full h-full flex items-center bg-black bg-opacity-50 backdrop-blur">
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

            <div className="flex items-center justify-between">
                <h2
                    className={`mb-0 ${styles.text_font} text-xl font-bold bg-clip-text text-transparent bg-gradient-text py-6`}
                >
                    {getDaysRemaining(new Date(date))} Days Remaining
                </h2>
                <button
                    // Add question is not available yet
                    className="cursor-pointer border-solid border border-yellow-400 bg-inherit text-yellow-400 px-[25px] py-5 rounded-lg ml-4 hover:bg-gradient-text hover:text-black transition-all duration-300"
                    style={{ marginTop: "15px" }}
                    onClick={() => toggleOverlay("showCreateSection")}
                >
                    Add Section
                </button>
                {renderOverlay(
                    "showCreateSection",
                    <CreateSection
                        errorMessage={(msg: any) => setErrorMessage(msg)}
                        errorDet={(data: any) => setErrorDet(data)}
                        defError={(data: any) => setDefError(data)}
                        onCloseCreateSection={() => closeOverlay("showCreateSection")}
                        onCreateSection={handleCreateSection} // Pass the create handler
                        proposalID={id}
                    />
                )}
            </div>
            <div
                className={
                    !data
                        ? ""
                        : data && data.sections?.length === 0
                            ? ""
                            : " bg-[#2F2F2F] list-none px-0 py-8 m-0 rounded-l-lg rounded-lg w-full"
                }
            >
                {!data ? (
                    <p>Loading...</p>
                ) : data.sections?.length === 0 ? (
                    <p>No sections available</p>
                ) : (
                    data.sections?.map((section, index) => (
                        <React.Fragment key={section.sectionID}>
                            <Section
                                RFPID={id}
                                link="/SectionSubComp" // Update these props as necessary
                                iconChecked={iconChecked} // This should be the path to your icon
                                sectionID={section?.sectionID}
                                label={getSectionLabel(index)} // Pass the custom label
                            />
                            {index !== data.sections.length - 1 && <hr className="mx-6" />}
                        </React.Fragment>
                    ))
                )}
            </div>
        </div>
    );
};

export default DropDownMenu;
