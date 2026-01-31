// WritersReviewers.tsx

import React from "react";
import {Edit} from "tabler-icons-react";
import Writers from "./Writers"; // Make sure to import the actual Writers component
import Reviewers from "./Reviewers"; // Make sure to import the actual Reviewers component

interface WritersReviewersProps {
    onEditTypeSelect: (editType: string) => void;
}

const WritersReviewers: React.FC<WritersReviewersProps> = ({onEditTypeSelect}) => {
    return (
        <div className="flex grid-cols-2 gap-4 my-5 h-200 relative">
            <div className="col-span-2 h-[40px]">
                <div className="flex justify-between items-center p-4">
                    <span className="text-sm text-white">Writers:</span>
                    <Edit size={20} strokeWidth={2} color="#FFD700" onClick={() => onEditTypeSelect("Writers")} />
                </div>
                <Writers />
            </div>
            <div className="absolute h-[200px] w-1 bg-white left-60"></div>
            <div className="ml-4 col-span-2 h-[40px]">
                <div className="flex justify-between items-center p-4">
                    <span className="text-sm text-white">Reviewers:</span>
                    <Edit size={20} strokeWidth={2} color="#FFD700" onClick={() => onEditTypeSelect("Reviewers")} />
                </div>
                <Reviewers />
            </div>
        </div>
    );
};

export default WritersReviewers;
