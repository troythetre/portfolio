import React, { ReactNode, useState } from 'react';
import Sidebar from './sideBar/SideBar';

interface Section {
    sectionID: string;
    sectionType: string;
    sectionTitle: string;
    content: string;
};

// Define the props for the Sidebar
export type SidebarProps = {
    selectedItemIndex?: number | null;
    onThumbnailClick?: (index: number) => void;
    setSelectedSectionID: React.Dispatch<React.SetStateAction<string | null>>;
    setSections: React.Dispatch<React.SetStateAction<any[]>>;
    selectedSectionID: string | null;
    sections: Section[];
    sectionUpdated: boolean;
    setSectionUpdated: React.Dispatch<React.SetStateAction<boolean>>;
};

// Define the props for the Layout
export interface LayoutProps {
    children: ReactNode;
    sidebarProps?: SidebarProps; // Define optional sidebarProps
    sectionUpdated: boolean;
    setSectionUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarProps, sectionUpdated, setSectionUpdated }) => {
    return (
        <div className='flex justify-items-end h-[100]'>
            <Sidebar {...sidebarProps} sectionUpdated={sectionUpdated} setSectionUpdated={setSectionUpdated} /> {/* Pass the sidebarProps to Sidebar */}
            <div className="min-h-screen h-[100] w-[72%] p-5 absolute right-0"  style={{ paddingTop: "100px" }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;