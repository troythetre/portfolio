import React, { useState, useEffect, useRef } from "react";
import noImage from "../../../../../public/images/dashboard/no_image.svg";
import goldTriBtn from "../../../../../public/images/dashboard/gold_triangle_icon.svg";
import verticalDots from "../../../../../public/images/dashboard/vertical_dots.svg";
import Image from "next/image";
import Menu from "../../RfpCard/Menu";
import { BASEURL } from "../../../../../constants";
import ProgressBar from "./progressBar";

function Info({ id, name, onClick, percent, edit, date, ProposalDetails, setProposalDetails, isMenuOpen, handleMenuToggle }) {

    const handleVerticalDotsClick = () => {
        console.log("Card ID passed to handleMenuToggle:", id);
        handleMenuToggle(id);
    };

    // Convert date to mm/dd/yyyy format
    function convertDate(date: any) {
        const formattedDate = new Date(date);
        const mm = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const dd = String(formattedDate.getDate()).padStart(2, '0');
        const yyyy = formattedDate.getFullYear();
        return date = mm + '/' + dd + '/' + yyyy;
    }

    // Convert date to mm/dd format
    function convertDateSm(date: any) {
        const formattedDate = new Date(date);
        const mm = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
        const dd = String(formattedDate.getDate()).padStart(2, '0');
        return date = mm + '/' + dd;
    }

    let timeStringLg = '';
    let timeStringSm = '';
    if (edit < 7) {
        timeStringLg = `${edit} days`;
        timeStringSm = `${edit}dys`;
    } else if (edit < 30) {
        const weeks = Math.floor(edit / 7);
        timeStringLg = `${weeks} weeks`;
        timeStringSm = `${weeks}wks`;
    } else if (edit < 365) {
        const months = Math.floor(edit / 30.44); // Average number of days in a month
        timeStringLg = `${months} months`;
        timeStringSm = `${months}mths`;
    } else {
        const years = Math.floor(edit / 365.25); // Average number of days in a year
        timeStringLg = `${years} years`;
        timeStringSm = `${years}yrs`;
    }

    return (
        <div>
            <div className="flex items-center justify-between ml-12 relative">
                {/* due date small*/}
                <div className="rounded-md font-bold hidden md:block">{convertDate(date)}</div>

                {/* due date large*/}
                <div className="rounded-md font-bold md:hidden">{convertDateSm(date)}</div>

                <div>
                    <ProgressBar deadlineDate={date} />
                </div>

                {/* last edited small */}
                <p className="md:hidden">{timeStringSm} ago</p>

                {/* last edited large */}
                <p className="hidden md:block">{timeStringLg} ago</p>

                <div className="flex items-center gap-4">
                    <div className="w-full" onClick={onClick}>
                        <Image src={goldTriBtn} alt="tiangleBtn" />
                    </div>
                    <div onClick={handleVerticalDotsClick} className="w-full">
                        <Image src={verticalDots} alt="verticalDotsBtn" />
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="absolute top-12 right-0 z-50 ">
                        <Menu
                            RFPName={name}
                            RFPID={id}
                            setIsMenuOpen={() => handleMenuToggle(id)}
                            onClick={onClick}
                            ProposalDetails={ProposalDetails}
                            setProposalDetails={setProposalDetails} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Info;