import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import sidebarLogo from "../../../../public/images/create-view-proposal/logo.svg";
import editIconYellow from "../../../../public/images/button/edit_icon_yellow.svg";
import editIconWhite from "../../../../public/images/button/edit_icon_white.svg";
import archiveIconYellow from "../../../../public/images/button/archive-icon-yellow.svg";
import archiveIconWhite from "../../../../public/images/button/archive_icon_white.svg";
import Link from "next/link";
import { useRouter } from "next/router";

const SideBar: FC = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");

  const handleEditClick = () => {
    if (activeLink !== "edit") {
      setActiveLink("edit");
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

  useEffect(() => {
    // Update active link based on the current path
    if (router.pathname === "/team-member") {
      setActiveLink("edit");
    } else if (router.pathname === "/team-member/archive-response") {
      setActiveLink("archive");
    }
  }, [router.pathname]);

  return (
    <div
      id="sidebar"

      className="float-left flex flex-col absolute w-[336px] h-full bg-black mr-24"

    >
      <div id="sidebar-img-container" className="ml-auto mr-auto mt-4 mb-6">
        {/* <Image src={sidebarLogo} alt="Voop Logo" width={139} height={257} /> */}
        <Image src="/images/voop_logo.png" alt="Logo" width={130} height={140} />
      </div>
      <div className="mr-auto ml-auto mt-10">
        <div className="ml-[-6px]">
          <Link href={"../team-member"}>
            <div className="relative mb-16">
              <div
                className={`flex items-center pb-4 cursor-pointer ${
                  activeLink === "edit" ? "active-link" : ""
                }`}
                onClick={handleEditClick}
              >
                <Image
                  src={activeLink === "edit" ? editIconYellow : editIconWhite}
                  alt="edit icon"
                  width={40}
                  height={40}
                />
                <p
                  className={`ml-6 font-semibold ${
                    activeLink === "edit"
                      ? "bg-clip-text bg-gradient-text text-transparent"
                      : "text-white-color"
                  }`}
                >
                  Response Library
                </p>
              </div>
              <div
                className={`h-0.5 w-full ${
                  activeLink === "edit"
                    ? "bg-clip-content bg-gradient-text text-transparent"
                    : "bg-clip-content bg-white-color text-transparent"
                } absolute`}
              ></div>
            </div>
          </Link>
        </div>
        <Link href={"../team-member/archive-response"}>
          <div className="relative mb-16">
            <div
              className={`flex items-center pb-4 cursor-pointer ${
                activeLink === "archive" ? "active-link" : ""
              }`}
              onClick={handleArchiveClick}
            >
              <Image
                src={
                  activeLink === "archive"
                    ? archiveIconYellow
                    : archiveIconWhite
                }
                alt="archive icon"
                width={30}
                height={30}
              />
              <p
                className={`ml-6 font-semibold ${
                  activeLink === "archive"
                    ? "bg-clip-text bg-gradient-text text-transparent"
                    : "text-white-color"
                }`}
              >
                Archived Responses
              </p>
            </div>
            <div
              className={`h-0.5 w-full ${
                activeLink === "archive"
                  ? "bg-clip-content bg-gradient-text text-transparent"
                  : "bg-clip-content bg-white-color text-transparent"
              } absolute`}
            ></div>
          </div>
        </Link>
        {/* <Link href={"team-member/archive-response"}>
          {content === "archivedResponses" ? (
            <div className="relative mb-16">
              <div className="flex items-center pb-4 cursor-pointer">
                <Image
                  src={archiveIconYellow}
                  alt="edit icon"
                  width={30}
                  height={30}
                />
                <p className="ml-6 font-semibold bg-clip-text bg-gradient-text text-transparent">
                  Archived Responses
                </p>
              </div>
              <div className="h-0.5 w-full bg-clip-content bg-gradient-text text-transparent absolute"></div>
            </div>
          ) : (
            <div className="flex items-center cursor-pointer">
              <Image
                src={archiveIconWhite}
                alt="edit icon"
                width={30}
                height={30}
              />
              <p className="ml-6 font-semibold">Archived Responses</p>
            </div>
          )}
        </Link> */}
      </div>
    </div>
  );
};

export default SideBar;
