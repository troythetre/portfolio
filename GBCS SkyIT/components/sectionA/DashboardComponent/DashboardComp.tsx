import React, { useState, useEffect } from "react";
import DetailRfpComp from "./DetailRFPComp";
import CardDash from "./CardDash";
import { setGlobal, getGlobal } from "./CardDash";

const DashboardComp = ({ id, name, date, status, edited, noImage, handleArchiveClick, modifyUser, modifyTime, ProposalDetails, setProposalDetails }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    //const prevOpenMenuId = useState(null); // Initialize with null

    const handleMenuToggle = (menuId) => {
        setOpenMenuId(prevMenuId => {
            if (prevMenuId === menuId) {
                setGlobal(null)
                return null;
            } else {
                var obj = getGlobal()
                if (!!obj) {
                    obj.setOpenMenuId(null)
                }
                setGlobal({ setOpenMenuId })
                return menuId;
            }
        });
    };

    useEffect(() => {
        // console.log("Previous menu ID:", getGlobal());
        // console.log("Open menu updated:", openMenuId);
        //console.log("propsal-details", ProposalDetails);
    }, [openMenuId]);

    return (
        <div>
            <div className="mt-2.5 mb-2.5">
                {isClicked ? (
                    <DetailRfpComp
                        onClick={() => setIsClicked(false)}
                        id={id}
                        name={name}
                        date={date}
                        percent={status}
                        edit={edited}
                        noImage={noImage}
                        modifyUser={modifyUser}
                        ProposalDetails={ProposalDetails}
                        setProposalDetails={setProposalDetails}
                        openMenuId={openMenuId}
                        handleMenuToggle={handleMenuToggle}
                    />
                ) : (
                    <CardDash
                        id={id}
                        onClick={() => setIsClicked(true)}
                        name={name}
                        date={date}
                        percent={status}
                        edit={edited}
                        noImage={noImage}
                        ProposalDetails={ProposalDetails}
                        modifyTime={modifyTime}
                        setProposalDetails={setProposalDetails}
                        isMenuOpen={openMenuId === id}
                        handleMenuToggle={handleMenuToggle}
                    />
                )}
            </div>
            <hr />
        </div>
    );
};

export default DashboardComp;
