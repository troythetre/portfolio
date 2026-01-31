import React from "react";
import Image from "next/image";
import styles from "./dropdown.module.css"; // Update the path to your styles module
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BASEURL } from "../../../../../../constants";
import axios from "axios";
import { fetchSectionData } from "../../../../../sectionA/utils";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HistoryIcon from "@mui/icons-material/History";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Due soon icon
import ErrorIcon from "@mui/icons-material/Error";
interface SectionProps {
    RFPID: string;
    link: string;
    iconChecked: string;
    sectionID: string;
    label: string;
}

const Section: React.FC<SectionProps> = ({ RFPID, link, iconChecked, sectionID, label }) => {
    const router = useRouter();
    const [sectionName, setSectionName] = useState("");
    const [sectionStatus, setSectionStatus] = useState("");

    const navigate = () => {
        router.push({
            pathname: link,
            query: { RFPID: RFPID, sectionID: sectionID },
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionData = await fetchSectionData(RFPID, sectionID);
                if (sectionData) {
                    setSectionName(sectionData.name);
                }
                const response = await axios.get(`${BASEURL}/api/proposal/get-section-status/${RFPID}/${sectionID}`, {
                    withCredentials: true,
                });
                setSectionStatus(response.data.status);
            } catch (error) {
                console.error("Fetch error", error);
                setSectionStatus("No data available");
            }
        };
        fetchData();
    }, [RFPID, sectionID]);
    const renderStatusIcon = (status: string) => {
        switch (status) {
            case "confirmed":
                return (
                    <>
                        <CheckCircleRoundedIcon
                            sx={{ height: 30, width: 30 }}
                            className="text-green-300 text-30 mr-4 bg-green-700 rounded-full"
                        />
                        <div className="text-md md:text-xl text-white">{status}</div>
                    </>
                );
            case "due soon":
                return (
                    <>
                        <ErrorIcon
                            sx={{ height: 30, width: 30 }}
                            className="bg-yellow-300 rounded-full text-yellow-900 text-30 mr-4"
                        />
                        <div className="text-md md:text-xl text-white">{status}</div>
                    </>
                );
            case "under review":
            case "in progress":
                return (
                    <>
                        <HistoryIcon
                            sx={{ height: 30, width: 30 }}
                            className="bg-gray-300 rounded-full text-gray-900 p-1 text-30 mr-4"
                        />
                        <div className="text-md md:text-xl text-white">{status}</div>
                    </>
                );
            case "changes requested":
                return (
                    <>
                        <BuildCircleIcon
                            sx={{ height: 30, width: 30 }}
                            className="bg-blue-300 rounded-full text-blue-900 text-30 mr-4"
                        />
                        <div className="text-md md:text-xl text-white">{status}</div>
                    </>
                );
            case "due past":
                return (
                    <>
                        <BuildCircleIcon
                            sx={{ height: 30, width: 30 }}
                            className="bg-red-300 rounded-full text-red-900 text-30 mr-4"
                        />
                        <div className="text-md md:text-xl text-white">{status}</div>
                    </>
                );
            case "No data available":
                return (
                    <>
                        <BuildCircleIcon
                            sx={{ height: 30, width: 30 }}
                            className="bg-gray-300 rounded-full text-gray-900 text-30 mr-4"
                        />
                        <div className="text-md md:text-xl text-white">{status}</div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <ul className="bg-[#2F2F2F] list-none pt-8 p-0 m-0 rounded-lg cursor-pointer" onClick={navigate}>
            <li className="flex items-center justify-between pb-8">
                <h3 className={`m-0 ${styles.text_font} text-whitetext-md md:text-xl font-normal pl-[30px] `}>
                    {sectionName}
                </h3>
                <div className="flex pr-[40px] items-center">
                    {!sectionStatus ? <p className="text-lg">Loading...</p> : renderStatusIcon(sectionStatus)}
                </div>
            </li>
        </ul>
    );
};

export default Section;
