import React, { useState, useEffect } from "react";
import { SearchBar } from "../../searchBarSide/NewSearchBar";
import DashboardComp from "../DashboardComponent/DashboardComp";
import HeaderDash from "../DashboardComponent/HeaderDash";
import axios from "axios";
import ErrorModal from "../../modals/errors/errorModal";
import { BASEURL } from "../../../constants";
import { useUser } from "../NewProposal/FormDataContext";

function AwaitingApproval({ page }) {
    const [results, setResults] = useState("");
    const [proposals, setProposals] = useState(null);
    const { user } = useUser();

    // error states
    const [errorDet, setErrorDet] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);

    const [ProposalDetails, setProposalDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASEURL}/api/proposal/allproposals`, {
                    withCredentials: true,
                });

                setProposals(response.data.proposals || []);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Invalid authentication token or expired token. Please login again.");
                    setErrorDet(true);
                    setFourOhOne(true);
                    setDefError(false);
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
        const processProposals = async () => {
            if (proposals) {
                const processedProposals = await Promise.all(proposals
                    .filter((proposal) => !results || proposal.id.toLowerCase().includes(results.toLowerCase()))
                    .map(async (proposal) => {
                        const rawApproverDeadline = proposal.proposal_deadline;
                        const approverDeadlineDate = new Date(rawApproverDeadline);
                        const approverDeadline = approverDeadlineDate.toLocaleDateString('en-US');
                        const proposalStatus = proposal.proposalStatus;
                        const lastModifyDate = new Date(proposal.last_modified_time || 0);

                        const fallbackImageURL = "https://example.com/proposal";
                        const proposal_image =
                            proposal.mediaFiles && proposal.mediaFiles.fileURL
                                ? proposal.mediaFiles.fileURL
                                : { src: fallbackImageURL, width: 100, height: 100 };

                        const photoURL = user.photoURL;
                        const daysAgo = !isNaN(lastModifyDate.getTime())
                            ? Math.floor((new Date().getTime() - lastModifyDate.getTime()) / (1000 * 60 * 60 * 24)).toString() : "";

                        return {
                            proposalId: proposal.id,
                            deadline: approverDeadline,
                            modifyDate: lastModifyDate,
                            name: proposal.proposalName,
                            daysAgo,
                            status: proposalStatus,
                            image: proposal.clientLogo_file_URL,
                            modifyUser: {
                                name: proposal.last_modified_userName,
                                photoURL: photoURL
                            },
                        };
                    })
                );

                setProposalDetails(processedProposals);
            }
        };

        processProposals();
    }, [results, proposals]);

    const filteredProposals = ProposalDetails?.filter((proposal) => proposal.status !== "INPROGRESS") || [];
    const count = filteredProposals.length;

    return (
        <div className="ml-[25%] text-white w-[70%]" style={{ paddingTop: "100px" }}>
            <div className=" text-white  ">
                <p className=" text-[30px] font-normal font-['Poppins']"> Dashboard </p>
                <SearchBar setResults={setResults} />
                <p className="text-30 mt-2 mb-2">Awaiting Final Approval </p>
                <p className="pb-5 text-18">Total {count} documents</p>
                <HeaderDash />
                {errorDet && (
                    <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center bg-black bg-opacity-50 backdrop-blur">
                        <ErrorModal
                            errorMessage={errorMessage}
                            fourOhOne={fourOhOne}
                            setFourOhOne={setFourOhOne}
                            setErrorDet={setErrorDet}
                            defError={defError}
                            setDefError={setDefError}
                        />
                    </div>
                )}
                <div className="h-[calc(100vh-200px)]"
                style={{
                    overflowY: "auto",
                    scrollbarWidth: "none",  /* Firefox */
                    msOverflowStyle: "none"   /* Internet Explorer and Edge */
                }}>
                {!ProposalDetails ? (
                    <div className="mt-32 w-full flex items-center justify-center">
                        <div className="text-2xl font-bold text-yellow-300">Loading</div>
                        <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">.</span>
                        <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">.</span>
                        <span className="text-2xl font-bold text-yellow-300 animate-[loadingDots_2s_infinite]">.</span>
                    </div>
                ) : filteredProposals.length === 0 ? (
                    <div className="mt-32 w-full flex items-center justify-center">
                        <div className="text-2xl font-bold text-yellow-300">No Current Proposals</div>
                    </div>
                ) : (
                    filteredProposals.map((i) => (
                        <DashboardComp
                            key={i.proposalId}
                            id={i.proposalId}
                            name={i.name}
                            date={i.deadline}
                            status={i.status}
                            edited={i.daysAgo}
                            noImage={i.image}
                            modifyUser={i.modifyUser}
                            ProposalDetails={ProposalDetails}
                            setProposalDetails={setProposalDetails}
                        />
                    ))
                )}
                </div>
            </div>
        </div>
    );
}

export default AwaitingApproval;