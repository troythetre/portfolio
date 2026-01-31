import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import cloud from "../../public/images/File_Upload/cloud_upload_outline.svg";
import check from "../../public/images/File_Upload/check_icon.svg";
import loading from "../../public/images/File_Upload/loading_icon.svg";
import alert from "../../public/images/File_Upload/alert_icon.svg";
import closeOutline from "../../public/images/File_Upload/close_outline.svg";
import refresh from "../../public/images/File_Upload/refresh_icon.svg";
import close from "../../public/close.svg";
import Image from "next/image";
import { BASEURL } from "../../constants";
import { useProposalID } from "../sectionA/NewProposal/FormDataContext";
import OverlayComponent from "../sectionB/sideBar/OverlayComponent";
import SubmitSuccessfully from "../sectionB/sideBar/SubmitSuccessfully";

interface SuccessProps {
    onClose: () => void;
}

function FileUpload({ onClose }) {
    const [size, setSize] = useState("");
    const maxLimit = 1048576;
    let uploadProgressBar = 100;
    const cancel = () => { };
    const [isClose, setIsClose] = useState(false);
    const [file, setFile] = useState("");

    const handleClose = () => {
        setIsClose(true);
        // setMedia(file);
    };
    const { proposalID } = useProposalID();
    // const proposalID = "RFP144";
    useEffect(() => {
        if (file) {
            fetchData(file);
        }
    }, [file]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]; // Get the first selected file
        console.log(selectedFile);

        setFile(selectedFile);
        console.log(file);
        fetchData(file);
        // setMedia(file);
    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files || []);

        if (droppedFiles.length > 0) {
            const firstFile = droppedFiles[0];
            setFile(firstFile);
            console.log(file);
            fetchData(file);
            // setMedia(file);
        }
    };
    const handleDeleteFile = () => {
        const updatedFiles = [...file];
        updatedFiles.splice(0, 1);
        setFile(updatedFiles);
    };
    const [overlays, setOverlays] = useState<{ showSubmitSuccessfullyCard: boolean }>({
        showSubmitSuccessfullyCard: false,
    });
    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: !prevOverlays[overlayName] }));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: false }));
    };
    const fetchData = async (data: string | Blob | File[] | null | undefined) => {
        console.log(data);
        const formData = new FormData();
        formData.append("image", data);
        const fileSize = data?.size;
        const fileSizeInKB = fileSize ? Math.floor(fileSize / 1024) : 0;
        setSize(fileSizeInKB);
        console.log(file);

        try {
            const response = await fetch(`${BASEURL}/api/proposal/upload-image-to-proposal?proposalID=${proposalID}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const jsonData = await response.json();
            console.log("PUT request successful:", jsonData);
            toggleOverlay("showSubmitSuccessfullyCard");
        } catch (error) {
            console.error("Error making PUT request:", error);
        }
    };

    return (
        <div
            style={isClose ? { display: "none" } : {}}
            className="fixed z-10 inset-0  bg-black bg-opacity-60 flex justify-center items-center"
        >
            <div className="w-[850px] h-[500px] rounded-[40px] shadow bg-neutral-800">
                <div className="relative h-[120px] flex bg-[#000] rounded-t-xl">
                    <h1 className="text-[#FFFFFF] pl-[45px] font-poppins text-[44px] font-normal">Upload</h1>
                    <div className="absolute right-3 top-3">
                        <Image
                            style={{ cursor: "pointer" }}
                            width={20}
                            height={20}
                            src={close}
                            onClick={handleClose}
                            alt="Close Icon"
                        />
                    </div>
                </div>
                <div className="flex p-8" onDragOver={handleDragOver} onDrop={handleDrop}>
                    <div className="w-[386px] h-[300px] grid place-items-center border-dashed border-3 rounded-lg border-yellow-400 p-4 ml-3">
                        <div className="flex justify-center flex-col">
                            <div className="m-4"></div>
                            <Image src={cloud} alt="drag"></Image>
                            <p className="text-[#FFF] text-2xl text-center m-2 font-poppins">Drag files to upload</p>
                            <p className="text-[#FFF] text-center m-2">or</p>
                            <div className="w-[150px] h-8 rounded-xl bg-gradient-text m-auto flex justify-center items-center">
                                <label
                                    htmlFor="file-input"
                                    className="w-[147px] h-7 rounded-xl bg-neutral-800 border-none text-center text-white font-normal font-poppins text-[15px] m-0"
                                >
                                    Browse Files
                                </label>
                                <input
                                    id="file-input"
                                    type="file"
                                    name="file"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                            </div>
                            <p className="text-xs text-[#B5B5B5] text-center mt-4 font-poppins">
                                Max file size: <strong className="text-[#FFF]">1 MB</strong>
                            </p>
                            <p className="text-xs text-[#B5B5B5] text-center font-poppins">
                                Supported file types: <strong className="text-[#FFF]">JPG, PNG, PDF, MPO, MPV</strong>
                            </p>
                        </div>
                    </div>
                    <div className="w-[24rem] m-auto">
                        {file && parseInt(size) <= maxLimit && uploadProgressBar === 100 && (
                            <>
                                <div className="flex justify-center">
                                    <Image src={check} alt="check" className="" />

                                    <div className="w-[18rem] h-2 rounded-full mr-[1rem] ml-2">
                                        <p className="text-[#FFF] text-sm">
                                            {file.name} {size} KB
                                        </p>
                                        <div
                                            className="bg-[#28A8EA] h-full mt-1 rounded-full"
                                            style={{ width: `${uploadProgressBar}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* {file && parseInt(size) <= maxLimit && uploadProgressBar < 100 && (
                            <>
                                <div className="flex justify-center mr-12">
                                    <Image src={loading} alt="loading" />
                                    <p className="ml-2 text-[#FFF] text-sm">
                                        {file.name} {size} bytes
                                    </p>
                                </div>
                                <div className="  relative">
                                    <div className="w-[14rem] h-2 bg-gray-300 rounded-full mr-[1rem] ml-28">
                                        <div
                                            className="bg-[#28D3EA] h-full rounded-full"
                                            style={{width: `${uploadProgressBar}%`}}
                                        ></div>
                                    </div>
                                    <div className="absolute top-[-8px] right-7 cursor-pointer" onClick={cancel}>
                                        <Image src={closeOutline} alt="close" />
                                    </div>
                                </div>
                            </>
                        )} */}

                        {file && parseInt(size) > maxLimit && (
                            <>
                                <div className="flex justify-center mr-12">
                                    <Image src={alert} alt="alert" />
                                    <p className="ml-2 text-[#FFF] text-sm">
                                        {file.name} {size} KB
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="w-[18rem] h-2 bg-gray-300 rounded-full mr-[1rem] ml-12">
                                        <div className="bg-[#FF6464] h-full rounded-full" style={{ width: `100%` }}></div>
                                    </div>
                                    <div className="absolute top-[-8px] right-7 cursor-pointer">
                                        <Image src={refresh} onClick={handleDeleteFile} alt="refresh" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <OverlayComponent
                    show={overlays.showSubmitSuccessfullyCard}
                    onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                >
                    <SubmitSuccessfully onClose={handleClose} message={"File Uploaded!"} />
                </OverlayComponent>
            </div>
        </div>
    );
}

export default FileUpload;
