import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import sidebarLogo from "../../../../public/images/create-view-proposal/logo.svg";
import editIconYellow from "../../../../public/images/button/edit_icon_yellow.svg";
import editIconWhite from "../../../../public/images/button/edit_icon_white.svg";
import archiveIconYellow from "../../../../public/images/button/archive-icon-yellow.svg";
import archiveIconWhite from "../../../../public/images/button/archive_icon_white.svg";

import uploadIconWhite from "../../../../public/images/button/upload icon white.svg";
import uploadIconYellow from '../../../../public/images/button/Upload_Icon_Yellow.svg';
import Link from "next/link";
import { useRouter } from "next/router";

const SideBarAdmin: FC = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("proposal");

  const handleProposalClick = () => {
    if (activeLink !== "proposal") {
      setActiveLink("proposal");
    } else {
      // If already active, do nothing
      return;
    }
  };

  const handleArchiveClick = () => {
    if (activeLink !== "archive") {
      setActiveLink("archive");
    } else {
      // If already active, do nothing
      return;
    }
  };
  // handle upload response library
  const handleUploadResponseClick = () => {
    if (activeLink !== "uploadResponse") {
      setActiveLink("uploadResponse");
    } else {
      // If already active, do nothing
      return;
    }
  };

  

  useEffect(() => {
    // Update active link based on the current path
    if (router.pathname === "/team-member/admin") {
      setActiveLink("proposal");
    } else if (router.pathname === "/team-member/admin/proposals-admin") {
      setActiveLink("proposals-admin");
    } else if(router.pathname === "/team-member/admin/archive-admin") {
      setActiveLink("archive-admin")
    } else if(router.pathname === "/DragDropFiles") {
      setActiveLink("DragDropFiles")
    }
  }, [router.pathname]);

  

  return (
    <div className="fixed top-0 left-0 w-[20%] h-screen bg-black flex flex-col items-center"
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
      <div className="mt-10">
        <Image src="/images/voop_logo.png" alt="Logo" width={210} height={148} />
      </div>


      <div className="mr-auto ml-6 mt-10 font-poppins font-semibold">
        <div className="ml-[-2px]">
          <Link href={"/team-member/admin/proposals-admin"}>
            <div
              className={`relative mb-2 cursor-pointer ${
                activeLink === "proposal" ? "active-link" : ""
              }`}
              onClick={() => setActiveLink("proposal")}
            >
              <div className="flex items-center pb-4">
                <Image
                  src={activeLink === "proposal" ? editIconYellow : editIconWhite}
                  alt="edit icon"
                  width={40}
                  height={40}
                />
                <p
                  className={`ml-6 font-semibold ${
                    activeLink === "proposal" ? "text-yellow-color" : "text-white-color"
                  }`}
                >
                  Response Library
                </p>
              </div>
            </div>
          </Link>
        </div>

        <Link href={"/DragDropFiles"}>
          <div
            className={`relative mb-2 cursor-pointer ${
              activeLink === "uploadResponse" ? "active-link" : ""
            }`}
            onClick={() => setActiveLink("uploadResponse")}
          >
            <div className="flex items-center pb-4">
              <Image
                src={activeLink === "uploadResponse" ? uploadIconYellow : uploadIconWhite}
                alt="Upload icon"
                width={40}
                height={40}
              />
              <p
                className={`ml-5 font-semibold ${
                  activeLink === "uploadResponse" ? "text-yellow-color" : "text-white-color"
                }`}
              >
                Upload Response Library
              </p>
            </div>
          </div>
        </Link>

        <Link href={"/team-member/admin/archive-admin"}>
          <div
            className={`relative mb-4 cursor-pointer ${
              activeLink === "archive" ? "active-link" : ""
            }`}
            onClick={() => setActiveLink("archive")}
          >
            <div className="flex items-center pb-4">
              <Image
                src={activeLink === "archive" ? archiveIconYellow : archiveIconWhite}
                alt="archive icon"
                width={40}
                height={40}
              />
              <p
                className={`ml-5 font-semibold ${
                  activeLink === "archive" ? "text-yellow-color" : "text-white-color"
                }`}
              >
                Archived Responses
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideBarAdmin;