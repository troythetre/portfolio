import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import noImage from "../../../public/images/dashboard/no_image.svg";
import whiteTriBtn from "../../../public/images/dashboard/white_triangle_icon.svg";
import verticalDots from "../../../public/images/dashboard/vertical_dots.svg";
import Menu from "./RfpCard/Menu";
import ProgressBar from "./DetailRFPComp/patialComp/progressBar";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

let _obj = null

export const setGlobal = (obj) => {
    _obj = obj
}
export const getGlobal = () => {
    if (_obj !== undefined) {
        return _obj
    }
    else {
        return null
    }
}

function CardDash({ id, name, date, percent, edit, onClick, isMenuOpen, handleMenuToggle, noImage, ProposalDetails, modifyTime, setProposalDetails }) {

    const [updatedName, setUpdatedName] = useState("");

    const modifyDate = new Date(modifyTime);
    // console.log("proposal_modifyDate", modifyDate);


    // Convert date to mm/dd/yyyy format
    function convertDate(date: any) {
        const formattedDate = new Date(date);
        const mm = String(formattedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
        const dd = String(formattedDate.getDate()).padStart(2, "0");
        const yyyy = formattedDate.getFullYear();
        return (date = mm + "/" + dd + "/" + yyyy);
    }

    // Convert date to mm/dd format
    function convertDateSm(date: any) {
        const formattedDate = new Date(date);
        const mm = String(formattedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
        const dd = String(formattedDate.getDate()).padStart(2, "0");
        return (date = mm + "/" + dd);
    }


    const formatDate = (date) => {
        if (date instanceof Date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            const diffInHours = Math.floor(diffInMinutes / 60);
            const diffInDays = Math.floor(diffInHours / 24);
            const diffInWeeks = Math.floor(diffInDays / 7);
            const diffInMonths = Math.floor(diffInDays / 30); // Approximate
            const diffInYears = Math.floor(diffInMonths / 12); // Approximate

            if (diffInYears > 0) {
                return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
            } else if (diffInMonths > 0) {
                return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
            } else if (diffInWeeks > 0) {
                return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
            } else if (diffInDays > 0) {
                return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
            } else if (diffInHours > 0) {
                return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
            } else if (diffInMinutes > 0) {
                return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
            } else {
                return `just now`;
            }
        }
        return "";
    };



    return (
        <div className="flex gap-4 px-8">
            <div className="flex gap-4 w-2/12 md:w-3/12">
                <div className="w-16 h-16 bg-white rounded-md flex justify-center items-center">
                    {noImage &&
                        // if the image is the default image we will use the icon instead so it doesn't look broken
                        noImage.src === "https://example.com/proposal" ? (
                        <InsertPhotoIcon sx={{ height: 50, width: 50 }} className="text-[#2F2F2F]" />
                    ) : (
                        <Image src={noImage} alt="noImage" width="50" height="50" />
                    )}
                </div>

                <div className="h-16 flex items-center">
                    <p className="">{name}</p>
                </div>
            </div>

            <div className="flex items-center relative justify-between w-full ml-10">
                {/* due date small*/}
                <div className="rounded-md font-bold hidden md:block">{convertDate(date)}</div>

                {/* due date large*/}
                <div className="rounded-md font-bold md:hidden">{convertDateSm(date)}</div>

                <div>
                    <ProgressBar deadlineDate={date} />
                </div>

                {/* last edited small */}
                <p className="md:hidden">{formatDate(modifyDate)} </p>

                {/* last edited large */}
                <p className="hidden md:block">{formatDate(modifyDate)} </p>

                <div className="flex gap-4 items-center cursor-pointer">
                    <div className="w-full" onClick={onClick}>
                        {whiteTriBtn && <Image src={whiteTriBtn} alt="whiteTriangle" />}
                    </div>
                    <div className="w-full relative cursor-pointer"
                        onClick={() => {
                            console.log("Card ID passed to handleMenuToggle:", id);
                            handleMenuToggle(id);
                        }}>
                        {verticalDots && <Image src={verticalDots} alt="verticalDots" />}
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="absolute top-full right-0 z-50 ">
                        <Menu
                            RFPName={name}
                            RFPID={id}
                            setUpdatedName={setUpdatedName}
                            ProposalDetails={ProposalDetails}
                            setProposalDetails={setProposalDetails}
                            setIsMenuOpen={() => handleMenuToggle(id)} // Handle menu toggle
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
export default CardDash;