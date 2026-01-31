import React from 'react';

const SectionSelect: React.FC = () => {
    return (
        <select className="border-b-yellow-500 border-2 w-[350.21px] h-[40.31px] rounded-xl bg-[#555555] text-[#B5B5B5] text-xs ml-5 my-5">
            <option value="sectionA">Section A</option>
            <option value="sectionB">Section B</option>
            <option value="sectionC">Section C</option>
        </select>
    );
}

export default SectionSelect;
