import React, {useState} from "react";
import Image from "next/image";
import {Collapse} from "@mantine/core";
import Menu from "./Menu";

interface RfpItem {
    proposalId: string;
    rfpName: string;
    rfpId: string;
    editorName: string;
    editDate: string;
    imageUrl: string;
    editorImage: string;
    backgroundColorClass: string;
    proposalStatusText: string;
}

interface RfpCardProps {
    rfpItem: RfpItem;
    scale?: number; // Add scale prop
}

const RfpCard: React.FC<RfpCardProps> = ({rfpItem, scale = 0.9}) => {
    const {
        proposalId,
        rfpId,
        rfpName,
        editorName,
        editDate,
        imageUrl,
        editorImage,
        backgroundColorClass,
        proposalStatusText,
    } = rfpItem;
    console.log(proposalId, editorImage);
    const [opened, setOpened] = useState(false);

    const toggle = () => setOpened(!opened);

    // Scale dimensions
    const width = 275 * scale;
    const newWidth = 195 * scale;
    const height = 361 * scale;
    const imageHeight = 276 * scale;
    const newImageHeight = 160 * scale;
    const iconSize = 44 * scale;
    const editorImageSize = 35 * scale;
    const fontSize = scale < 1 ? "small" : "lg"; // Adjust font size based on scale

    return (
        <div className="flex pr-8 pb-8 pt-8" style={{transform: `scale(${scale})`}}>
            <div
                className="flex flex-col bg-[#555555] rounded-lg shadow-md relative"
                style={{width: `${width}px`, height: `${height}px`}}
            >
                <div className={`grid grid-row-3 ${backgroundColorClass}`} style={{width: `${width}px`, height: `80%`}}>
                    <div className="flex justify-end cursor-pointer" style={{height: `${iconSize}px`, paddingRight: 20}}>
                        <Image
                            src="/images/dashboard/expand.svg"
                            alt="Expand Icon"
                            width={iconSize}
                            height={iconSize}
                            onClick={toggle}
                        />
                    </div>
                    <div className="justify-center items-center flex">
                        <Image
                            src={imageUrl}
                            alt="RFP Image"
                            width={newWidth}
                            height={newImageHeight}
                            className="rounded"
                        />
                    </div>
                    <div className="justify-center items-center flex ">
                        <p
                            className={` border-none drop-shadow-lg rounded-xl w-3/4 bg-white text-black font-bold text-center text-${fontSize}`}
                        >
                            {proposalStatusText}
                        </p>
                    </div>
                </div>
                <div className="grid grid-row-2" style={{width: `${width}px`, height: `20%`}}>
                    <div className="justify-start flex " style={{paddingLeft: 10}}>
                        <p className={`font-poppins text-left text-white text-${fontSize}`}>
                            {rfpName ? rfpName : "No Name"}
                        </p>
                    </div>
                    <div className="justify-start flex" style={{paddingLeft: 10}}>
                        <Image
                            src={editorImage}
                            alt="Editor Image"
                            width={editorImageSize}
                            height={editorImageSize}
                            objectFit="cover"
                            className="rounded-full"
                        />
                        <div className="fjustify-center items-center flex">
                            <span className={`text-${fontSize} text-gray-400`}>{editorName}</span>
                            <span className={`text-${fontSize} text-gray-400`}>·{editDate} ago edited </span>
                        </div>
                    </div>
                </div>
            </div>
            <Collapse in={opened} className="self-center">
                <div>
                    <Menu RFPName={rfpName} RFPID={proposalId} rfpId={rfpId} />
                </div>
            </Collapse>
        </div>
    );
};

export default RfpCard;
