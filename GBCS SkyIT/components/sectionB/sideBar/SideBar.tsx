import React, { useState } from "react";
import DeadlineStatus from "./DeadlineStatus";
import GoldBorderButton from "./GoldBorderButton";
import GreyBorderButton from "./GreyBorderButton";
import IconsAndTexts from "./IconsAndTexts";
import TableOfContents from "./TableOfContents";
import SidebarLogo from "./SideBarLogo";
import ArrowIcon from "./ArrowIcon";
import HorizontalLine from "./HorizontalLine";
import RFPHeading from "./RFPHeading";
import ContentsSection from "./ContentsSection";
import OverlayComponent from "./OverlayComponent";
import Milestones from "../ProposalComponent/Milestones";
import Submit from "./Submit";
import CreateSection from "./CreateSection";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";
// import { Section } from '@mantine/core/lib/components/AppShell/HorizontalSection/Section/Section';

interface Section {
    sectionID: string;
    sectionType: string;
    sectionTitle: string;
    content: string;
    order: number;
}
interface SidebarProps {
    selectedItemIndex?: number | null;
    onThumbnailClick?: (index: number) => void;
    setSelectedSectionID: React.Dispatch<React.SetStateAction<string | null>>;
    setSections: React.Dispatch<React.SetStateAction<any[]>>;
    selectedSectionID: string | null;
    sections: Section[];
    sectionUpdated: boolean;
    setSectionUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}



const Sidebar: React.FC<SidebarProps> = ({
    selectedItemIndex,
    onThumbnailClick,
    setSelectedSectionID,
    selectedSectionID,
    sections,
    setSections,
    sectionUpdated,
    setSectionUpdated,
}) => {
    const [section, setSection] = useState<Section[]>([]);
    const [showTableOfContents, setShowTableOfContents] = useState(true);
    const [editSectionLabel, setEditSectionLabel] = useState(false);
    const [overlays, setOverlays] = useState<{
        showMilestones: boolean;
        showSubmitCard: boolean;
        showCreateSection: boolean;
    }>({
        showMilestones: false,
        showSubmitCard: false,
        showCreateSection: false,
    });
    const router = useRouter();

    const { proposalID } = router.query;
    const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "downloaded" | "error">("idle");


    // error modal states

    const toggleTableOfContents = () => {
        setShowTableOfContents(!showTableOfContents);
    };
    const toggleEditSectionLabel = () => {
        setEditSectionLabel(!editSectionLabel);
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
        setSection((prevSections) => [...prevSections, newSection]);
        closeOverlay("showCreateSection"); // Close the overlay after adding
        toggleEditSectionLabel();
    };

    const handleViewMilestones = () => {
        toggleOverlay("showMilestones");
    };
    const handleSubmit = () => {
        toggleOverlay("showSubmitCard");
    };

    const handleDownloadClick = async () => {
        try {
            setDownloadStatus("downloading");  // Start download prompt

            const response = await fetch(`${BASEURL}/api/proposal/download-template/${proposalID}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Failed to download proposal: ", response.statusText);
                setDownloadStatus("error");  // Set error prompt
                return;
            }

            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/pdf")) {
                console.error("Invalid file format received");
                setDownloadStatus("error");  // Set error prompt
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${proposalID}.pdf`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setDownloadStatus("downloaded");  // Set success prompt

        } catch (error) {
            console.error("An error occurred during file download:", error);
            setDownloadStatus("error");  // Set error prompt
        }
    };
    const renderGoldButton = (label: string, width: string, onClickHandler: () => void) => (
        <div className="my-2">
            <GoldBorderButton label={label} width={width} height="h-[40px]" onClick={onClickHandler} />
        </div>
    );

    return (
        <div className="flex flex-col absolute top-0 left-0 items-center w-[28%] bg-[#000000] p-2 mr-2 font-poppins pt-[35px] pb-4"
            style={{
                position: "fixed",  // ensures the sidebar stays fixed on the screen
                top: 0,  // sticks to the top
                left: 0,  // sticks to the left
                height: "100vh",  // spans the full height of the viewport
                zIndex: 1000,  // high z-index to ensure it stays on top
                overflowY: "auto",  // makes it scrollable
                scrollbarWidth: "none",  /* Firefox */
                msOverflowStyle: "none"   /* Internet Explorer and Edge */
            }}>
            <SidebarLogo />
            <ArrowIcon />
            <HorizontalLine />
            <DeadlineStatus />
            <HorizontalLine />
            {renderGoldButton("View Milestones", "w-[251px]", handleViewMilestones)}
            {renderOverlay("showMilestones", <Milestones handleClose={() => closeOverlay("showMilestones")} />)}
            {renderGoldButton("Submit for Approval", "w-[350px]", handleSubmit)}
            {renderOverlay("showSubmitCard", <Submit onClose={() => closeOverlay("showSubmitCard")} />)}
            {renderGoldButton("Export as PDF", "w-[350px]", handleDownloadClick)}


            {/* Download status prompt */}
            <div className="mt-2 text-yellow-300 text-sm">
                {downloadStatus === "downloading" && "Downloading..."}
                {downloadStatus === "downloaded" && "Downloaded successfully!"}
                {downloadStatus === "error" && "An error occurred during download."}
            </div>

            <RFPHeading />
            <HorizontalLine />
            <ContentsSection toggleTableOfContents={toggleTableOfContents} />
            {showTableOfContents ? (
                <TableOfContents
                    editSectionLabel={editSectionLabel}
                    setSelectedSectionID={setSelectedSectionID}
                    sections={sections}
                    setSections={setSections}
                    sectionUpdated={sectionUpdated}
                    setSectionUpdated={setSectionUpdated}
                />
            ) : null}
            {editSectionLabel ? (
                <GreyBorderButton
                    label="Exit Edit View"
                    width="w-[200px]"
                    height="h-[40px]"
                    onClick={toggleEditSectionLabel}
                />
            ) : (
                <GreyBorderButton
                    label="Edit Section"
                    width="w-[200px]"
                    height="h-[40px]"
                    onClick={toggleEditSectionLabel}
                    dataBool={`${editSectionLabel}`}
                />
            )}
            {renderOverlay(
                "showCreateSection",
                <CreateSection
                    onCancelCreateSection={() => closeOverlay("showCreateSection")}
                    onCreateSection={handleCreateSection} // Pass the create handler
                    updateSection={setSection}
                    sectionUpdated={sectionUpdated}
                    setSectionUpdated={setSectionUpdated}
                />
            )}
            <HorizontalLine />
            <div className="self-start mx-5 mb-3">
                <IconsAndTexts
                    selectedItemIndex={selectedItemIndex}
                    onThumbnailClick={onThumbnailClick}
                    selectedSectionID={selectedSectionID}
                    setSelectedSectionID={setSelectedSectionID}
                />
            </div>
        </div>
    );
};

export default Sidebar;
