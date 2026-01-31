import IDCard from "./IDCard";
import {useRouter} from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {SearchBar} from "../../searchBarSide/NewSearchBar";
import {BASEURL} from "../../../constants";
import React, {useState, useEffect} from "react";
import Link from "next/link";
import axios from "axios";
import AddQuestionCard from "./AddQuestionCard";
import {fetchSectionData} from "../utils";

export default function App() {
    const router = useRouter();
    const {sectionID, RFPID} = router.query;

    const [results, setResults] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [open, setOpen] = useState(false);
    const handleAddQuestion = () => setOpen(true);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const sectionData = await fetchSectionData(RFPID, sectionID);
                if (sectionData) {
                    setSectionName(sectionData.name);
                }
            } catch (error) {
                console.error("Fetch error", error);
            }
        };
        fetchData();
    }, [sectionID, RFPID]);

    return (
        <div>
            <div className="mx-8"  style={{ paddingTop: "100px" }}>
                <div className="flex gap-4 justify-between items-center my-8">
                    <div className="flex gap-4">
                        <Link href="/my_task/in-progress">
                            <ArrowBackIcon
                                sx={{
                                    height: "30px",
                                    width: "30px",
                                }}
                                className="bg-gold text-black rounded-full p-4 cursor-pointer"
                            />
                        </Link>
                        <div className="text-xl">{sectionName}</div>
                    </div>

                    <div>
                        <button
                            className="cursor-pointer  border-solid border border-yellow-400 bg-inherit text-yellow-400 px-[25px] py-5 rounded-lg ml-4 hover:bg-gradient-text hover:text-black transition-all duration-300"
                            style={{marginTop: "15px"}}
                            onClick={handleAddQuestion}
                        >
                            Add Question
                        </button>
                    </div>
                </div>
                {open && (
                    <div
                        onClick={() => setOpen(false)}
                        className={`fixed z-20 h-screen w-full top-0 bg-zinc-600 bg-opacity-40 flex justify-center items-center overflow-y-scroll`}
                    >
                        <div onClick={(e) => e.stopPropagation()} className={`w-[400px] max-h-screen overflow-y-auto`}>
                            <AddQuestionCard setOpen={setOpen} setRefresh={setRefresh} />
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <SearchBar setResults={setResults} />
                </div>

                <IDCard refresh={refresh}></IDCard>
            </div>
        </div>
    );
}
