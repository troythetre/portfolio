import React, { useEffect, useState } from "react";
import EditableContent from "./ProposalComponent/Template";
import ThumbnailView from "./ThumbnailView/ThumbnailView";
import RestoreVersion from "./RestoreVersion/RestoreVersion";
import AddTemplate from "./ProposalComponent/AddTemplate";

interface Section {
    sectionID: string;
    sectionType: string;
    sectionTitle: string;
    content: string;
}
interface MainProposalProps {
    selectedSectionID: string | null;
    setSections: React.Dispatch<React.SetStateAction<any[]>>;
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    index: number | null;
    setSelectedItemIndex?: React.Dispatch<React.SetStateAction<number | null>>;
    sectionUpdated: boolean;
}

const Main: React.FC<MainProposalProps> = ({
    selectedSectionID,
    setSections,
    isVisible,
    index,
    setSelectedItemIndex,
    setIsVisible,
    sectionUpdated,
}) => {
    const [selectedComponent, setSelectedComponent] = useState<React.ReactNode>(
        <EditableContent
            selectedSectionID={selectedSectionID}
            setSections={setSections}
            setSelectedItemIndex={setSelectedItemIndex}
            setIsVisible={setIsVisible}
            sectionUpdated={sectionUpdated}
        />
    );

    //Update selected component based on new page order
    React.useEffect(() => {
        setSelectedComponent(
            <EditableContent
                selectedSectionID={selectedSectionID}
                setSections={setSections}
                setSelectedItemIndex={setSelectedItemIndex}
                setIsVisible={setIsVisible}
                sectionUpdated={sectionUpdated}
            />
        );
    }, [sectionUpdated])

    // Update the selected component based on the index
    React.useEffect(() => {
        if (isVisible) {
            switch (index) {
                case 0:
                    console.log("this case is selected");
                    setSelectedComponent(<ThumbnailView totalPages={1} setSelectedItemIndex={setSelectedItemIndex} />);
                    break;
                case 3:
                    setSelectedComponent(
                        <>
                            <RestoreVersion
                                selectedSectionID={selectedSectionID}
                                setSelectedItemIndex={setSelectedItemIndex}
                            />
                        </>
                    );
                    break;
                case 5:
                    setSelectedComponent(
                        <>
                            <AddTemplate setSelectedItemIndex={setSelectedItemIndex} />
                        </>
                    );
                    break;

                default:

                    setSelectedComponent(
                        <EditableContent
                            selectedSectionID={selectedSectionID}
                            setSections={setSections}
                            setSelectedItemIndex={setSelectedItemIndex}
                            setIsVisible={setIsVisible}
                            sectionUpdated={sectionUpdated}
                        />
                    );
            }
        }
    }, [isVisible, index]);
    return <div className="min-h-screen flex w-full p-5 relative">{selectedComponent}</div>;
};

export default Main;
