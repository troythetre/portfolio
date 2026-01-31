import React, { useEffect, useState } from "react";
import { SearchBar } from "../../../components/searchBarSide/NewSearchBar";
import SortByFilter from "./SortByFilter";
import { BASEURL } from "../../../constants";
import ArchiveCard from "./ArchiveCard";
import { useUser } from "../NewProposal/FormDataContext";

const HomePage = () => {
    const [results, setResults] = useState("");
    const [filter, setFilter] = useState("All");
    const [data, setData] = useState([]); // Archived proposal IDs
    const [allData, setAllData] = useState([]); // Inclusive proposal list
    const [transformedData, setTransformedData] = useState([]); // Transformed and merged data
    const [filteredData, setFilteredData] = useState([]); // Filtered proposals for display
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = useUser();

    const formatDate = (timestamp) => {
        if (timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
            else if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            else if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            else return `${Math.floor(diffInSeconds / 86400)} days ago`;
        }
        return "";
    };

    const handleFilter = () => {
        setDropdownOpen((prev) => !prev);

    };

    useEffect(() => {
        const fetchArchivedProposals = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/archive`, {
                    method: "GET",
                    credentials: "include",
                });
                const jsonData = await response.json();
                console.log("Fetched data:", jsonData);

                const filteredItems = jsonData;
                const proposalIDs = filteredItems.map(item => item.id);

                setData(proposalIDs);
            } catch (error) {
                console.error("Error fetching archived proposals:", error);
                setAllData([]);
            }
        };
        fetchArchivedProposals();
    }, []);

    useEffect(() => {
        const transformData = async () => {
            if (data && Array.isArray(data)) {
                console.log("data Transformed:", data);

                const transformed = await Promise.all(
                    data.map(async (id) => {
                        if (!id) return null;  // Skip null IDs

                        try {
                            // Fetch proposal details for each ID
                            const response = await fetch(`${BASEURL}/api/proposal/single-proposal/${id}`, {
                                credentials: "include",
                            });

                            if (!response.ok) {
                                console.error(`Failed to fetch details for ID: ${id}`);
                                return null;
                            }

                            const result = await response.json();

                            const item = result.singleProposal || {};

                            return {
                                rfpId: item.proposal_id || "",
                                rfpName: item.proposalName || "",
                                editorName: item.last_modified_userName || "",
                                editDate: formatDate(item.last_modified_time) || "",
                                companyName: item.SoftwareCompanyName || "",
                                softwareName: item.softwareTypes || "",
                                imageUrl: item.clientLogo_file_URL || "/bigImage",
                                editorImage: user.photoURL || "/default-avatar.svg",
                            };

                        } catch (error) {
                            console.error(`Error fetching details for ID: ${id}`, error);
                            return null;
                        }

                    })
                );

                // Filter out null results
                setTransformedData(transformed.filter((item) => item !== null));
            }
        };

        transformData();
    }, [data]);

    // Filter data based on search input
    useEffect(() => {
        const filterData = () => {
            if (!results) {
                setFilteredData(transformedData);
            } else {
                const filtered = transformedData.filter((item) =>
                    item.rfpName.toLowerCase().includes(results.toLowerCase())
                );
                setFilteredData(filtered);
            }
        };

        filterData();
    }, [results, transformedData]);

    const count = filteredData.length;


    // Sorting data by company and software

    useEffect(() => {
        console.log("Current filter:", filter);
        sortData();
    }, [filter, transformedData]);  // Trigger sorting when either the filter or the data changes

    const sortData = () => {
        console.log("Starting sort with filter:", filter);
        console.log("Original transformed data:", transformedData);

        if (!transformedData) return;

        let sortedData = [...transformedData];  // Create a copy to avoid mutating the state

        switch (filter) {
            case "GBCS":
                sortedData = sortedData.filter((item) => item.companyName === "GBCS");
                break;
            case "Skyit":
                sortedData = sortedData.filter((item) => item.companyName === "SkyIT");
                break;
            case "Orion":
                sortedData = sortedData.filter((item) => item.softwareName === "ORION");
                break;
            case "Aukai":
                sortedData = sortedData.filter((item) => item.softwareName === "AUKAI");
                break;
            case "Lokomotive":
                sortedData = sortedData.filter((item) => item.softwareName === "LOKOMOTIVE");
                break;
            default:
                sortedData = [...transformedData];  // Reset to all data when no filter is applied
        }

        console.log("Final filtered data:", sortedData);
        setFilteredData(sortedData);
    };



    return (
        <div className="ml-[25%] text-white mt-1 w-[70%]" style={{ paddingTop: "100px" }}>
            <div className="text-[32px] font-normal font-['Poppins']">Archived Files</div>
            <p className="font-['Poppins']">
                Here are all the previous archived files. You may restore them when you want to.
            </p>
            <SearchBar setResults={setResults} />
            <p className="font-['Poppins']">{count} document(s) found</p>
            <div className="flex items-center">
                <button
                    className="inline-flex justify-center items-center w-[174.51px] h-[33.07px] border-2 border-yellow-300 bg-transparent text-yellow-300 rounded-full text-[18px] font-normal font-['Poppins'] px-4 py-2 hover:bg-yellow-300 hover:bg-fuchsia-600 cursor-pointer"
                    id="options-menu"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    onClick={handleFilter}
                    style={{
                        background: "none",
                        position: "absolute",
                        right: "6%",
                    }}
                >
                    Sort By
                </button>
                <SortByFilter setFilter={setFilter} dropdownOpen={dropdownOpen} />

            </div>

            <div className="flex flex-wrap relative">
                {filteredData.map((rfpItem, index) => (
                    <ArchiveCard key={index} rfpItem={rfpItem} />
                ))}


            </div>
        </div>
    );
};

export default HomePage;