import React, {useState} from "react";
import {Collapse} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import Link from "next/link";
import styles from "./proposalsidebar.module.css";
import {useRouter} from "next/router";
import Image from "next/image";

/**
 * Credits:
 * Revised From Code From Camila
 *
 */
export default function ProposalSideBar() {
    const {pathname} = useRouter();
    const isActive = (route) => pathname === route;
    const [hover, setHover] = useState(false);

    const imageSrc = () => {
        if (isActive("/my_task/BookmarkedProposals") || hover) {
            return "/images/dashboard/bookmarked_gold.svg";
        } else {
            return "/images/dashboard/bookmarked.svg";
        }
    };

    const defaultHover = () => {
        if (hover) {
            return styles.default_image;
        } else {
            return styles.hover_image;
        }
    };

    // onMouseLeave and onMouseOver the image and text will change color ONLY
    const [bookhovered, setBookHovered] = useState(false);
    const [archivehovered, setArchiveHovered] = useState(false);
    const [submittedHovered, setSubmittedHovered] = useState(false);

    return (
        <section className="bg-[#000000] w-1/5 fixed top-0 left-0 h-screen flex flex-col overflow-hidden"
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
            <img
                src="../images/voop_logo.png"
                className="block mx-auto w-[68%] h-[148px] mt-10 rounded-20"
                alt="Voop Logo"
            />

            <Link href="/new-proposal">
                <img
                    src="../images/dashboard/new_proposalBtn.svg"
                    className="block m-auto mt-16 mb-8 w-[90%] cursor-pointer"
                    alt="New Proposal Button"
                />
            </Link>

            <DashboardDropdown />
            {/* submitted proposals */}
            <div
                onMouseOver={() => {
                    setSubmittedHovered(true);
                }}
                onMouseLeave={() => {
                    setSubmittedHovered(false);
                }}
                className={`flex ${styles.hover_effect_container} w-4/5 m-auto my-15 mb-0 mt-2`}
            >
                <div className={`absolute ${styles.image_container}`}>
                    {isActive("/my_task/submittedProposals") ? (
                        <img src="../images/dashboard/submitted_check_gold.svg" alt="Gold Submitted Checkmark" />
                    ) : (
                        <>
                            <img
                                src="../images/dashboard/submitted_check.svg"
                                className={styles.default_image}
                                alt="Submitted Checkmark"
                            />
                            <img
                                src="../images/dashboard/submitted_check_gold.svg"
                                className={styles.hover_image}
                                alt="Gold Submitted Checkmark"
                            />
                        </>
                    )}
                </div>

                <Link href="/my_task/submittedProposals">
                    <p
                        className={`
                        cursor-pointer ml-10 font-poppins font-extrabold text-left bg-clip-text text-transparent mb-3
                        ${submittedHovered ? "bg-gradient-text" : "bg-white"}
                        ${isActive("/my_task/submittedProposals") ? "bg-gradient-text" : "bg-white"}
                        `}
                    >
                        Submitted Proposals
                    </p>
                </Link>
            </div>

            {/* bookmarked proposals */}
            <div
                onMouseOver={() => {
                    setBookHovered(true);
                }}
                onMouseLeave={() => {
                    setBookHovered(false);
                }}
                className={`flex ${styles.hover_effect_container} w-4/5 m-auto my-15 mb-0 mt-2`}
            >
                <div className={`absolute ${styles.image_container} `}>
                    {isActive("/my_task/BookmarkedProposals") ? (
                        <img src="../images/dashboard/bookmarked_gold.svg" alt="Gold Bookmark" />
                    ) : (
                        <>
                            <img
                                src="../images/dashboard/bookmarked.svg"
                                className={styles.default_image}
                                alt="Bookmark"
                            />
                            <img
                                src="../images/dashboard/bookmarked_gold.svg"
                                className={styles.hover_image}
                                alt="Gold Bookmark"
                            />
                        </>
                    )}
                </div>
                <Link href="/my_task/BookmarkedProposals">
                    <p
                        className={`
                            cursor-pointer ml-10 font-poppins font-extrabold text-left bg-clip-text text-transparent mb-1
                            ${bookhovered ? "bg-gradient-text" : "bg-white"}
                            ${isActive("/my_task/BookmarkedProposals") ? "bg-gradient-text" : "bg-white"}
                        `}
                    >
                        Bookmarked Proposals
                    </p>
                </Link>
            </div>

            {/* archived proposals */}
            <div
                onMouseOver={() => {
                    setArchiveHovered(true);
                }}
                onMouseLeave={() => {
                    setArchiveHovered(false);
                }}
                className={`flex  ${styles.hover_effect_container} w-4/5 m-auto mt-2`}
            >
                <div className={`absolute ${styles.image_container} `}>
                    {isActive("/my_task/archivePage") ? (
                        <img src="../images/dashboard/archive_gold.svg" alt="Gold Archive Logo" />
                    ) : (
                        <>
                            <img
                                src="../images/dashboard/archive_white.svg"
                                className={styles.default_image}
                                alt="Archive Logo"
                            />
                            <img
                                src="../images/dashboard/archive_gold.svg"
                                className={styles.hover_image}
                                alt="Gold Archive Logo"
                            />
                        </>
                    )}
                </div>

                <Link href="/my_task/archivePage">
                    <p
                        className={`
                        cursor-pointer ml-10 font-poppins font-extrabold text-left bg-clip-text text-transparent 
                        ${archivehovered ? "bg-gradient-text" : "bg-white"}
                        ${isActive("/my_task/archivePage") ? "bg-gradient-text" : "bg-white"}
                        `}
                    >
                        Archive
                    </p>
                </Link>
            </div>
        </section>
    );
}

function DashboardDropdown() {
    const [opened, {toggle}] = useDisclosure(true);
    const {pathname} = useRouter();
    const isActive = (route) => pathname === route;
    const [dashboardHovered, setDashboardHovered] = useState(false);

    return (
        <section className="w-4/5 m-auto mb-0 mt-2">
            <div
                onMouseOver={() => {
                    setDashboardHovered(true);
                }}
                onMouseLeave={() => {
                    setDashboardHovered(false);
                }}
                className={`flex ${styles.hover_effect_container} `}
                onClick={toggle}
            >
                <div className={`absolute ${styles.image_container}`}>
                    <img src="../images/dashboard/dashboard_white.svg" className={styles.default_image} />
                    <img src="../images/dashboard/dashboard_icon.svg" className={styles.hover_image} />
                </div>
                <p
                    className={`
                ${dashboardHovered ? "bg-gradient-text" : "bg-white"}
                cursor-pointer pl-[20%] pr-[35%] mb-3 font-poppins font-extrabold text-left bg-clip-text text-transparent bg-white hover:bg-gradient-text
                `}
                >
                    Dashboard
                </p>
                <div className={`relative ${styles.image_container}`} style={{top: "4px", right: "15px"}}>
                    <img
                        src="../images/dashboard/white_down_triangle.svg"
                        className={`${styles.default_image} ${opened ? "rotate-180" : ""}`}
                    />
                    <img
                        src="../images/dashboard/collapse_vector.svg"
                        className={`${styles.hover_image} ${opened ? "rotate-180" : ""}`}
                    />
                </div>
            </div>
            <Collapse in={opened}>
                <div className="pl-[20%] font-poppins font-extrabold text-left ">
                    <Link href="/my_task/in-progress">
                        <p
                            className={`cursor-pointer mb-3 bg-clip-text text-transparent bg-white hover:bg-gradient-text ${
                                isActive("/my_task/in-progress") ? "bg-gradient-text" : "bg-white"
                            }`}
                        >
                            In-Progress
                        </p>
                    </Link>
                    <Link href="/my_task/Awaiting-Final-Approval">
                        <p
                            className={`cursor-pointer bg-clip-text text-transparent ${
                                isActive("/my_task/Awaiting-Final-Approval") ? "bg-gradient-text" : "bg-white"
                            } hover:bg-gradient-text`}
                        >
                            Awaiting Final Approval
                        </p>
                    </Link>
                </div>
            </Collapse>
        </section>
    );
}
