import React, { useState, useEffect, useRef } from "react";
import { SearchBar } from "../searchBarSide/NewSearchBar";
import DashboardComp from "./DashboardComponent/DashboardComp";
import HeaderDash from "./DashboardComponent/HeaderDash";
import { BASEURL } from "../../constants/index";
import axios from "axios";
import ErrorModal from "../modals/errors/errorModal";

function DashboardPage({ page }: any) {
    const [results, setResults] = useState("");
    const [proposals, setProposals] = useState(null);

    // error states
    const [errorDet, setErrorDet] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);

    const [ProposalDetails, setProposalDetails] = useState(null);
    // const {ProposalDetails} = useProposalContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/proposal/allproposals`, {
                    withCredentials: true,
                });

                setProposals(response.data.proposals || []);
                // Update state with data from all proposals
            } catch (error) {
                // invalid token error modal
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
                    setErrorDet(true);
                    setFourOhOne(true);
                    setDefError(false);
                    // Handle token refresh or reauthentication logic here
                    // default error modal
                } else {
                    setErrorMessage("An unknown error occurred. Please try again later.");
                    setErrorDet(true);
                    setDefError(true);
                    setFourOhOne(false);
                }
            }
        };
        fetchData();
    }, [page]);

    useEffect(() => {
        const fetchUserPhotoURL = async (email: string) => {
            try {
                const response = await axios.get(`${BASEURL}/api/proposal/user/${email}`, {
                    withCredentials: true,
                });

                return response.data.user.photoURL;
            } catch (error) {
                console.error("Error fetching user photo URL:", error);
                return null;
            }
        };

        const processProposals = async () => {
            if (proposals) {
                const processedProposals = await Promise.all(proposals.map(async (proposal) => {
                    const rawApproverDeadline = proposal.proposal_deadline;
                    const approverDeadlineDate = new Date(rawApproverDeadline);
                    const approverDeadline = approverDeadlineDate.toLocaleDateString('en-US');
                    const proposalStatus = proposal.proposalStatus;
                    const lastModifyDate = new Date(proposal.last_modified_time || 0);
                    const photoURL = await fetchUserPhotoURL(proposal.last_modified_email);
                    const daysAgo = !isNaN(lastModifyDate.getTime())
                        ? Math.floor((new Date().getTime() - lastModifyDate.getTime()) / (1000 * 60 * 60 * 24)).toString()
                        : "";

                    return {
                        id: proposal.id,
                        proposalId: proposal.id,
                        deadline: approverDeadline,
                        name: proposal.proposalName,
                        modifyDate: lastModifyDate,
                        daysAgo,
                        status: proposalStatus,
                        image: proposal.clientLogo_file_URL,
                        modifyUser: {
                            name: proposal.last_modified_userName,
                            photoURL: photoURL
                        },
                    };
                }));

                setProposalDetails(processedProposals);
            }
        };

        processProposals();
    }, [results, proposals]);

    // Filter proposals based on search input (results)
    const filteredProposals = ProposalDetails?.filter((proposal: any) =>
        proposal.status === "INPROGRESS" &&
        proposal.name.toLowerCase().includes(results.toLowerCase()) // Filter by name
    ) || [];

    const count = filteredProposals.length;

    return (
        <div className="relative ml-[25%] w-[70%]" style={{ paddingTop: "100px" }}>
            {/* Static header section */}
            <p className="text-[30px] font-normal font-['Poppins']">Dashboard</p>
            <SearchBar setResults={setResults} />
            <p className="text-30 mt-2 mb-2">{page}</p>
            <p className="pb-5 text-18">Total {count} documents</p>
            <HeaderDash />


            {/* Scrollable proposal list */}
            <div className="h-[calc(100vh-200px)]"
                style={{
                    overflowY: "auto",
                    scrollbarWidth: "none",  /* Firefox */
                    msOverflowStyle: "none"   /* Internet Explorer and Edge */
                }}>
                {ProposalDetails === null && errorDet ? (
                    <ErrorModal errorMessage={errorMessage} />
                ) : ProposalDetails === null ? (
                    <div className="mt-32 w-full flex items-center justify-center">
                        <div className="text-2xl font-bold text-yellow-300">Loading...</div>
                    </div>
                ) : ProposalDetails.length === 0 ? (
                    <div className="mt-32 w-full flex items-center justify-center">
                        <div className="text-2xl font-bold text-yellow-300">No Current Proposals</div>
                    </div>
                ) : (
                    filteredProposals.map((i) => (
                        <DashboardComp
                            key={i.id}
                            id={i.id}
                            name={i.name}
                            date={i.deadline.toLocaleString()}
                            status={i.status}
                            edited={i.daysAgo}
                            noImage={i.image}
                            modifyUser={i.modifyUser}
                            modifyTime={i.modifyDate}
                            ProposalDetails={ProposalDetails}
                            setProposalDetails={setProposalDetails}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default DashboardPage;