import React, {useState} from "react";
import Image from "next/image";
import {Collapse} from "@mantine/core";
import ArchiveProposalMenu from "./ArchiveProposalMenu";
//import Menu from "./Menu";

interface RfpItem {
    proposalId: string;
    rfpName: string;
    rfpId: string;
    editorName: string;
    editDate: string;
    imageUrl: string;
    editorImage: string;
}

interface RfpCardProps {
    rfpItem: RfpItem;
    scale?: number; // Add scale prop
}

const ArchiveCard: React.FC<RfpCardProps> = ({rfpItem, scale = 0.9}) => {
    const {proposalId, rfpId, rfpName, editorName, editDate, imageUrl, editorImage} = rfpItem;
    // console.log(proposalId, rfpId, rfpName, editorName, editDate, imageUrl, editorImage);
    const [opened, setOpened] = useState(false);

    const toggle = () => setOpened(!opened);

    // Scale dimensions
    const width = 275 * scale;
    const height = 361 * scale;
    const imageHeight = 276 * scale;
    const iconSize = 44 * scale;
    const editorImageSize = 35 * scale;
    const fontSize = scale < 1 ? "small" : "lg"; // Adjust font size based on scale

    return (
        <div className="flex pr-8 pb-8 pt-8" style={{transform: `scale(${scale})`}}>
            <div
                className="flex flex-col bg-[#555555] rounded-lg shadow-md relative"
                style={{width: `${width}px`, height: `${height}px`}}
            >
                <div className="relative" style={{width: `${width}px`, height: `${imageHeight}px`}}>
                    <Image src={imageUrl} alt="RFP Image" width={width} height={imageHeight} className="rounded" />
                    <div className="cursor-pointer absolute top-1 right-4" style={{width: `${iconSize}px`, height: `${iconSize}px`}}>
                        <Image
                            src="/images/dashboard/expand.svg"
                            alt="Expand Icon"
                            width={iconSize}
                            height={iconSize}
                            onClick={toggle}
                        />
                    </div>
                </div>
                <div className="flex">
                    <p className={`font-poppins pl-3 text-left text-white text-${fontSize}`}>{rfpName ? rfpName : "No Name"}</p>
                </div>
                <div className="pl-3 pb-4 flex items-center mt-4">
                    <Image
                        src={editorImage}
                        alt="Editor Image"
                        width={editorImageSize}
                        height={editorImageSize}
                        objectFit="cover"
                        className="rounded-full"
                    />
                    <div className="flex items-center pl-4">
                        <span className={`text-${fontSize} text-gray-400`}>{editorName}</span>
                        <span className={`text-${fontSize} text-gray-400`}> · {editDate} ago edited</span>
                    </div>
                </div>
            </div>
            <Collapse in={opened} className="self-center">
                <div>
                    <ArchiveProposalMenu RFPName={rfpName} RFPID={proposalId} rfpId={rfpId} />
                </div>
            </Collapse>
        </div>
    );
};

export default ArchiveCard;
