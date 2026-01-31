import React  from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./sidebar.module.css";
import goldenInfo from "../../../public/images/gemInfoGolden.svg";
import teamGold from "../../../public/images/teamIconGolden.svg";
import iconDefault from "../../../public/images/icondefault.svg";
import defaultIcon from "../../../public/images/Icon-default.svg";
import { useRouter } from "next/router";
import { useUser } from "../NewProposal/FormDataContext";

export default function SideBar() {
    const { pathname } = useRouter();
    const { user } = useUser();
    const isActive = (route: string): boolean => pathname === route;

    return (
        <>
            <section className="bg-[#000000] w-1/5 h-screen fixed top-0 left-0 flex-none flex-col item-center mt-0 ">
                <img
                    src="../images/voop_logo.png"
                    className="block mx-auto w-[200px] h-[148px] mt-10 rounded-20"
                    alt="Voop Logo"
                />
                <div className={`flex ${styles.hover_effect_container} w-4/5 my-10 ml-4  mt-[10rem]`}>
                    <div>
                        <Image src={isActive("/UserSettings") ? goldenInfo : defaultIcon} alt="info-icon"></Image>
                    </div>
                    <Link href="/UserSettings">
                        <p
                            className={`ml-4 text-16 font-poppins font-bold text-left cursor-pointer ${isActive("/UserSettings")
                                    ? "bg-clip-text text-transparent bg-white hover:bg-gradient-text bg-gradient-text"
                                    : "bg-clip-text text-transparent bg-white"
                                }`}
                        >
                            General Information
                        </p>
                    </Link>
                </div>
                {user.role === "ADMIN" && (
                    <div className={`flex ${styles.hover_effect_container} w-4/5 ml-4`}>
                        <div>
                            <Image src={isActive("/Setting-teamManagement") ? teamGold : iconDefault} alt="team-icon" />
                        </div>
                        <Link href="/Setting-teamManagement">
                            <p
                                className={`ml-4 text-16 font-poppins font-bold text-left cursor-pointer ${isActive("/Setting-teamManagement")
                                        ? "bg-clip-text text-transparent bg-white hover:bg-gradient-text bg-gradient-text"
                                        : "bg-clip-text text-transparent bg-white"
                                    }`}
                            >
                                Team Management
                            </p>
                        </Link>
                    </div>
                )}
            </section>
        </>
    );
}
