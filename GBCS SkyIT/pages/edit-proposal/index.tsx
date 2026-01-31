import React, { useState, createContext, useContext, useMemo } from "react";
import Main from "../../components/sectionB/Main";
import Layout, { LayoutProps } from "../../components/sectionB/Layout";

interface EditProposalProps { }
interface Section {
    sectionID: string;
    sectionType: string;
    sectionTitle: string;
    content: string;
}

// Context
export const SectionsContext = createContext<Section[]>([]);
export const SelectedSectionContext = createContext<string | null>(null);

// Custom hook to use the context
export const useSections = () => useContext(SectionsContext);
export const useSelectedSectionID = () => useContext(SelectedSectionContext);
// console.log(SelectedSectionContext);
// Context
export const SidebarContext = createContext<LayoutProps["sidebarProps"]>({
    selectedItemIndex: null,
    onThumbnailClick: () => { },
    setSelectedSectionID: () => { },
    setSections: () => [],
    selectedSectionID: "",
    sections: [],
    sectionUpdated: false,
    setSectionUpdated: () => { },
});
const EditProposal: React.FC<EditProposalProps> = () => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [sections, setSections] = useState<Section[]>([]);
    const [selectedSectionID, setSelectedSectionID] = useState<string | null>(null);
    const [sectionUpdated, setSectionUpdated] = useState(false);

    // Function to handle thumbnail click
    const handleThumbnailClick = (index: number) => {
        setSelectedItemIndex(index);
        setIsVisible(true);
    };

    // Memoize the sections value to prevent unnecessary re-renders
    const sectionsValue = useMemo(() => sections, [sections]);

    // Utility function to generate default sidebar props
    const getDefaultSidebarProps = (): LayoutProps["sidebarProps"] => ({
        selectedItemIndex,
        onThumbnailClick: handleThumbnailClick,
        setSelectedSectionID,
        setSections,
        selectedSectionID,
        sections,
        sectionUpdated,
        setSectionUpdated,
    });

    return (
        <SidebarContext.Provider value={getDefaultSidebarProps()}>
            <div className="flex flex-row">
                <Layout sidebarProps={getDefaultSidebarProps()} sectionUpdated={sectionUpdated} setSectionUpdated={setSectionUpdated}>
                    <Main
                        selectedSectionID={selectedSectionID}
                        setSections={setSections}
                        isVisible={isVisible}
                        index={selectedItemIndex}
                        setSelectedItemIndex={setSelectedItemIndex}
                        setIsVisible={setIsVisible}
                        sectionUpdated={sectionUpdated}
                    />
                </Layout>
            </div>
        </SidebarContext.Provider>
    );
};

export default EditProposal;
