import React, { useEffect, useState, useRef } from "react";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";
import Image from "next/image";
import arrow from "../../../public/images/edit-proposal/arrow_btn.svg";

interface Version {
    versionID: string;
    timestamp: string;
    sectionContent: string; // Added to align with the updated API response
}

interface SectionHistory {
    sectionID: string;
    versionHistory: Version[];
}

interface RestoreVersionProps {
    selectedSectionID: string | null;
    setSelectedItemIndex?: React.Dispatch<React.SetStateAction<number | null>>;
}

const RestoreVersion: React.FC<RestoreVersionProps> = ({ selectedSectionID, setSelectedItemIndex }) => {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { proposalID } = router.query;
    const [sectionHistories, setSectionHistories] = useState<SectionHistory[]>([]);
    const [htmlContent, setHtmlContent] = useState<string>("");

    // Get section version history
    useEffect(() => {
        const fetchData = async () => {
            if (!proposalID) return; // Prevent fetching if proposalID is not defined

            try {
                const response = await fetch(
                    `${BASEURL}/api/proposal/all-previous-versions/${proposalID}/`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const jsonData = await response.json();
                console.log(jsonData);

                if (typeof jsonData.sections === 'string') {
                    setSectionHistories(JSON.parse(jsonData.sections));
                }
                else {
                    // Set section histories from the updated API response
                    setSectionHistories(jsonData.sections);
                }
                // Set content for the first version of the first section (current version)
                if (jsonData.sections.length > 0) {
                    setHtmlContent(jsonData.sections[0].versionHistory[0]?.sectionContent || "");
                }
            } catch (error) {
                console.error("Fetch error", error);
            }
        };

        fetchData(); // Fetch data after checking proposalID
    }, [proposalID]);

    useEffect(() => {
        if (contentEditableRef.current) {
            // Set the content inside the editable div
            contentEditableRef.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);

    const handleContentClick = (sectionID: string, versionID: string) => {
        const section = sectionHistories.find((s) => s.sectionID === sectionID);
        const version = section?.versionHistory.find((v) => v.versionID === versionID);
        if (version) {
            // Set content to the clicked version's content
            setHtmlContent(version.sectionContent || "");
        }
    };
    const handleGoBackClick = () => {
        router.push({
            pathname: "/edit-proposal",
            query: { proposalID: proposalID },
        });
    }
    // Restore section version
    const handleRestoreClick = async (sectionID: string, versionID: string) => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/restore-section-version`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalID: proposalID,
                    sectionID: sectionID,
                    versionID: versionID,
                }),
            });

            if (response.ok) {
                console.log("Section restored successfully");
            } else {
                console.error("Failed to restore section");
            }
        } catch (error) {
            console.error("Request error", error);
        }

        // Redirect to the proposal edit page after restoration
        router.push({
            pathname: "/edit-proposal",
            query: { proposalID: proposalID },
        });

        // Clear the selected item index if provided
        if (setSelectedItemIndex) {
            setSelectedItemIndex(null);
        }
    };

    return (

        <div className="flex flex-row justify-between">

            <div
                style={{
                    width: "550px",
                    height: "770px",
                    marginLeft: "20px",
                    maxWidth: "750px",
                    maxHeight: "900px",
                    fontSize: "20px",
                    position: "relative",
                    backgroundColor: "#FFFFFF",
                    marginTop: "45px",
                }}
            >
                <div style={{ pointerEvents: "none" }} ref={contentEditableRef} contentEditable={false} />
            </div>
            <div className="self-start mx-10 cursor-pointer"><Image src={arrow} alt="arrow icon" onClick={() =>
                router.push({
                    pathname: "/edit-proposal",
                    query: { proposalID: proposalID },
                })} /></div>

            <div
                className="w-[calc(100% - 550px)] relative overflow-auto ml-10"
                style={{ maxHeight: "calc(100vh - 45px)" }}
            >
                {sectionHistories.length === 0 ? (
                    <p className="text-center text-gray-500">No versions available.</p>
                ) : (
                    sectionHistories.map((section, sectionIndex) =>
                        section.versionHistory.map((version, index) => (
                            <div key={`${section.sectionID}-${version.versionID}`}>
                                <div className="flex flex-row justify-between items-center my-10">
                                    <div className="flex flex-col text-white font-poppins">
                                        <div
                                            onClick={() => handleContentClick(section.sectionID, version.versionID)}
                                            className="text-[24px] font-semibold cursor-pointer hover:text-gray-500"
                                        >
                                            <p>{new Date(version.timestamp).toLocaleString()}</p>
                                        </div>
                                        <p className="text-[20px] font-medium italic pt-4">User: {version.user}</p>
                                        <p className="text-[20px] font-medium italic">Change: Not available</p>
                                    </div>
                                    <div className="flex justify-center relative bg-gradient-border w-[174px] h-[58px] rounded-[40px] p-[2px]">
                                        <div className="bg-[#1A1B1E] w-[172px] h-[55px] rounded-[40px]"></div>
                                        {sectionHistories.length !== 0 && (
                                            <button
                                                onClick={() => handleRestoreClick(section.sectionID, version.versionID)}
                                                className="h-[55px] cursor-pointer border-transparent rounded-lg bg-accent-color w-full font-poppins absolute top-[0px] right-[0px] text-center text-transparent bg-gradient-border bg-clip-text text-[24px] font-normal"
                                            >
                                                Restore
                                            </button>)}

                                    </div>
                                </div>
                                <hr className="w-[100%] h-[0px] border border-zinc-400"></hr>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default RestoreVersion;
