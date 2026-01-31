import React, { useEffect, useState } from "react";
import Header from "./Header";
import Milestone from "./Milestone";
import Image from "next/image";
import close from "../../../public/close.svg";
import FileDock from "../../../public/images/File_dock.svg";
import DateRange from "../../../public/images/Date_range.svg";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";

interface MilestoneData {
    name: string;
    date: string;
}

interface MilestonesProps {
    handleClose: () => void;
}

const Milestones: React.FC<MilestonesProps> = ({ handleClose: propHandleClose }) => {
    const router = useRouter();
    const { proposalID } = router.query;
    const [initialData, setInitialData] = useState<MilestoneData[]>([]);
    const [data, setData] = useState<MilestoneData[]>([]);
    const [sortBy, setSortBy] = useState<"name" | "deadline">("name");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (proposalID) {
            getMilestonesData(proposalID as string);
        }
    }, [proposalID]);

    const getMilestonesData = async (proposalID: string) => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/milestones/${proposalID}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const milestones = await response.json();
            setInitialData(milestones.milestones);
            setData(milestones.milestones);
        } catch (error) {
            console.error("Error fetching milestones:", error);
        }
    };

    const handleSortBy = (criteria: "name" | "deadline") => {
        setSortBy(criteria);

        if (criteria === "name") {
            setData((prevData) => [...prevData].sort((a, b) => a.name.localeCompare(b.name)));
        } else if (criteria === "deadline") {
            setData((prevData) =>
                [...prevData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            );
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center">
            <div className="w-[85%] font-poppins h-4/5 overflow-y-auto">
                <Header handleClose={propHandleClose} />
                <section className="h-4/5 overflow-y-auto">
                    {data.length > 0 ? (
                        <section className="bg-primary-gbcs-black rounded-b-3xl">
                            <section
                                className="flex justify-end w-[90%] py-[2%]"
                                style={{ width: "90%", margin: "0 auto" }}
                            >
                                <button
                                    onClick={toggleModal}
                                    className="w-[109px] h-[35px] px-[22px] py-[13px] rounded-lg border-2 border-yellow-500 justify-center items-center gap-2.5 inline-flex bg-transparent text-center text-transparent bg-clip-text bg-gradient-gold-gbcs text-lg font-normal"
                                >
                                    Sort By
                                </button>
                                {isModalOpen && (
                                    <div className="bg-accent-color mt-12 absolute rounded-xl pl-10 py-10 pr-[70px]">
                                        <div
                                            className="list-none flex cursor-pointer pt-3"
                                            onClick={() => handleSortBy("name")}
                                        >
                                            <Image src={FileDock} alt="User_name" />
                                            <p className="text-18 ml-3 text-[#F2F2F2]" style={{ marginBottom: "-12px" }}>
                                                Name
                                            </p>
                                        </div>
                                        <div
                                            className="ml-10 mt-2 mb-2"
                                            style={{ borderBottom: "0.3px solid #ffffff", width: "96%" }}
                                        ></div>
                                        <div
                                            className="mx-auto mb-2 flex cursor-pointer list-none"
                                            onClick={() => handleSortBy("deadline")}
                                        >
                                            <Image src={DateRange} alt="User_name" />
                                            <p className="text-18 ml-3 text-[#F2F2F2]">Deadline</p>
                                        </div>
                                        <div
                                            className="ml-10 mb-2"
                                            style={{ borderBottom: "0.32px solid #ffffff", width: "96%" }}
                                        ></div>
                                    </div>
                                )}
                            </section>
                            <section>
                                {data.map((item, index) => (
                                    <Milestone key={index} milestone={item} />
                                ))}
                            </section>
                        </section>
                    ) : (
                        <section className="bg-primary-gbcs-black text-18 rounded-b-3xl text-center py-20">
                            No Milestones!
                        </section>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Milestones;
