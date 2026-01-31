/* eslint-disable @next/next/no-img-element */
import React from "react";
import {useState, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {Card} from "react-bootstrap";
import {Button, Modal} from "@mantine/core";
import Image from "next/image";
import {BASEURL} from "../../../constants";
// import media from "./JSon.json";
import close from "../../../public/close.svg";
import upload from "../../../public/images/edit-proposal/upload.svg";
import dots from "../../../public/images/edit-proposal/dots.svg";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FileUpload from "../../FileUploadPop/FileUpload";
import GoldBorderButton from "../sideBar/GoldBorderButton";
import {useRouter} from "next/router";
import OverlayComponent from "../sideBar/OverlayComponent";
import SubmitSuccessfully from "../sideBar/SubmitSuccessfully";
import style from "./style.module.css";
import ErrorModal from "../../modals/errors/errorModal";

interface SuccessProps {
    onClose: () => void;
}

const MediaLibrary: React.FC<SuccessProps> = ({onClose}) => {
    const [isClose, setIsClose] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // error states
    const [errorDet, setErrorDet] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fourOhOne, setFourOhOne] = useState(false);
    const [defError, setDefError] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaImages, setMediaImages] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [uploadPopUp, setUploadPopUp] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(Array(mediaImages.length).fill(false));
    const [sortBy, setSortBy] = useState<"file name desc" | "file name asc" | "upload date desc" | "upload date asc" | "file format">(
        " "
    );
    const [selectedFormat, setSelectedFormat] = useState<string>(""); 
    const [isFileFormatDropdownOpen, setFileFormatDropdownOpen] = useState(false); 
    
    interface mediaImages {
        date: string;
       fileName: string;
       format: string;
    }
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(mediaImages);
    const handleClick = () => {
        setIsClicked(true);
    };

    useEffect(() => {
        getMediaList();
    }, []);

    useEffect(() => {
        applySearchAndSort();
    }, [searchQuery, sortBy, selectedFormat, mediaImages]);

    const applySearchAndSort = () => {
        let sortedData = [...mediaImages];
    
        // Apply sorting
        if (sortBy === "file name desc") {
            sortedData.sort((a, b) => b.fileName.localeCompare(a.fileName));
        } else if (sortBy === "file name asc") {
            sortedData.sort((a, b) => a.fileName.localeCompare(b.fileName));
        } else if (sortBy === "upload date desc") {
            sortedData.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        } else if (sortBy === "upload date asc") {
            sortedData.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        }
    
        // Apply format filter if selected
        if (selectedFormat.length > 0) {
            console.log("Selected Format Extensions:", selectedFormat);
            sortedData = sortedData.filter((item) => {
                const itemFormat = item.fileType?.toLowerCase();
                console.log("Item Object:", item);
                console.log("Item Format:", itemFormat);
                return selectedFormat.some(format => itemFormat.includes(format));
            });
        }
    
        // Apply search filter
        const filtered = sortedData.filter((val) => {
            if (searchQuery === "") {
                return val;
            } else if (val.fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
                return val;
            }
        });
    
        console.log("Filtered Data:", filtered);
        setFilteredData(filtered);
    };
    
    
    const handleSortByFormat = (format) => {
        let formatExtensions: string[];
        switch (format.toLowerCase()) {
            case "image":
                formatExtensions = ["image", "image/jpeg", "image/png", "image/gif"];
                break;
            case "video":
                formatExtensions = ["video/mp4", "video/mkv", "video/avi"];
                break;
            case "3d model":
                formatExtensions = ["model/obj", "model/fbx", "model/stl"];
                break;
            case "others":
                formatExtensions = ["application/pdf", "application/msword", "text/plain"];
                break;
            default:
                formatExtensions = [];
        }
        setSelectedFormat(formatExtensions);
        setFileFormatDropdownOpen(false);
    };
    


    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };
 
    
    const saveText = (event: {target: {innerText: React.SetStateAction<string>}}) => {
        setSearchText(event.target.innerText);
    };

    const handleFileChange = (cardId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event && event.target) {
            const selectedImage = event.target.files[0];

            switch (cardId) {
                case 1:
                    setCard1Image(selectedImage);
                    break;
                case 2:
                    setCard2Image(selectedImage);
                    break;
                case 3:
                    setCard3Image(selectedImage);
                    break;
                case 4:
                    setCard4Image(selectedImage);
                    break;
                default:
                    break;
            }
        }
    };

    // Function to format  in MB
    const formatFileSize = (sizeInBytes: number) => {
        const sizeInMB = sizeInBytes / (1024 * 1024);
        return sizeInMB.toFixed(2) + " MB";
    };

    const closeModal = () => {
        setIsClose(true);
    };

    const handleSortClick = () => {
        setIsModalOpen(!isModalOpen);
    };
    const getDate = (data: {_seconds?: number; _nanoseconds?: number}) => {
        if (data._seconds !== undefined) {
            const milliseconds = data._seconds * 1000;
            const date = new Date(milliseconds);
            const month = date.toLocaleString("default", {month: "short"});
            const day = date.getDate(); // Get the day of the month
            const formattedDate = `${month} ${day}`;
            return formattedDate;
        } else {
            return "Unknown Date";
        }
    };

    const handleSortBy = (criteria: "file name desc" | "file name asc" | "upload date desc" | "upload date asc" | "file format") => {
        if (criteria === "file format") {
            setFileFormatDropdownOpen(!isFileFormatDropdownOpen); // Toggle file format dropdown visibility
        } else {
            setSortBy(criteria);
        }
    };


    const handleUplodaPopUp = () => {
        setUploadPopUp(!uploadPopUp);
    };
    const getMediaList = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/get-main-gallery-media-list`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const jsonData = await response.json();
            console.log("GET request successful:", jsonData);

            const updatedMediaImages = jsonData.map((item) => {
                const timestampSeconds = item.dateAdded._seconds;
                const timestampMilliseconds = timestampSeconds * 1000;
                const dateObject = new Date(timestampMilliseconds);
                const month = dateObject.toLocaleString("en-us", {month: "long"});
                const date = dateObject.getDate();
                return {
                    ...item,
                    month,
                    date,
                    fileType: item.fileType ? item.fileType.toLowerCase() : "",
                };
            });

            setMediaImages(updatedMediaImages);
            setFilteredData(updatedMediaImages); // Initialize filteredData with all media images
            
            //console.log("media", mediaImages);
        } catch (error) {
            console.error("Error making PUT request:", error);
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
    const [isInputVisible, setInputVisible] = useState(false);
    const handleDelete = async (index: number) => {
       
        const updatedMedia = [...mediaImages];

        // Remove the item at the specified index
        updatedMedia.splice(index, 1);

        // Update the media state with the modified array
        setMediaImages(updatedMedia);
    };
    const [renamingIndex, setRenamingIndex] = useState(null);
    const [editModeIndex, setEditModeIndex] = useState("");
    const {proposalID} = router.query;
    const toggleEditMode = (index) => {
        setEditModes((prevEditModes) => {
            const newEditModes = [...prevEditModes];
            newEditModes[index] = !newEditModes[index]; // Toggle edit mode for the specific card
            return newEditModes;
        });
    };
    const handleRename = async (index: number) => {
        toggleEditMode(index);
        setRenamingIndex(index); // Set the index of the file being renamed
        setEditModeIndex(index);
    };
    const changeName = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = e.target.value;
        setInputValues(newInputValues);
    };
    const handleSave = async (index:number) => {
        const obj = {
            proposalID: proposalID,
            oldFileName: mediaImages[index].fileName,
            newFileName: inputValues[index],
        };
        mediaImages[index].fileName = inputValues[index];
        try {
            const response = await fetch(`${BASEURL}/api/proposal/update-proposal-mediafile-name`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj),
            });

            if (response.ok) {
                console.log("Name updated successfully");
            } else {
                console.error("Failed to update name");
            }
        } catch (error) {
            console.error("Request error", error);
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
    
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const [inputValues, setInputValues] = useState(Array(mediaImages.length).fill(""));
    const [editModes, setEditModes] = useState(Array(mediaImages.length).fill("")); // Array to track edit mode for each input

    const handleToggleSelection = (index: number, val: MediaItem) => {
        const updatedSelectedImages = [...selectedImages];
        if (updatedSelectedImages.includes(index)) {
            updatedSelectedImages.splice(updatedSelectedImages.indexOf(index), 1);
        } else {
            updatedSelectedImages.push(index); // Pushing index instead of val
        }
        setSelectedImages(updatedSelectedImages);
    };

    // const handleClose = () => {
    //     setIsModalOpen(!isModalOpen);
    // };

    const [overlays, setOverlays] = useState<{showSubmitSuccessfullyCard: boolean}>({
        showSubmitSuccessfullyCard: false,
    });
    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({...prevOverlays, [overlayName]: !prevOverlays[overlayName]}));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({...prevOverlays, [overlayName]: false}));
    };
    const handleSendSelectedImages = async () => {
        setIsClicked(true);

        const selectedMedia = selectedImages.map((index) => index);
        console.log("Selected Images:", selectedMedia);
        // const fetchData = async (data: string | Blob | File[] | null | undefined) => {
        // console.log(data);
        const formData = new FormData();
        const item = selectedMedia.map((item) => item);
        formData.append("images", item);
        const fileSize = selectedMedia.map((item) => item);
        const fileSizeInKB = fileSize ? Math.floor(fileSize / 1024) : 0;
        // setSize(fileSizeInKB);
        console.log("formSize", fileSize);
        console.log("formData", formData);

        try {
            const response = await fetch(`${BASEURL}/api/proposal/upload-image-to-proposal?proposalID=${proposalID}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            } else {
                const jsonData = await response.json();
                console.log("PUT request successful:", jsonData);
            }

            if (response.status === 200) {
                // toggleOverlay("showSubmitSuccessfullyCard");
            }
        } catch (error) {
            console.error("Error making PUT request:", error);
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

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div className={`${isClose ? "hidden" : ""}`} style={{width: 770, height: 800, position: "relative"}}>
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
            <div
                className="modal-content absolute w-[770px] pb-20 h-[730px] top-0 overflow-y-scroll rounded-lg"
                style={{
                    background: "#222222",
                }}
            >
                <div className="absolute left-[51px] top-5 text-transparent bg-clip-text bg-gradient-gold-gbcs text-3xl font-poppins font-bold tracking-wider">
                    Media Library
                </div>
                <div className="absolute top-2 right-1 m-2 cursor-pointer">
                    <Image src={close} alt="close" width={18} height={29} onClick={closeModal} />
                </div>
                <div className="mt-28 ml-24"></div>

                <div
                    className="active bg-card-bg absolute w-[558px] h-[67px] left-28 top-112 rounded-lg"
                    onInput={saveText}
                    style={{
                        borderBottom: "3px #DEBF1A solid",
                    }}
                >
                    <div className="absolute top-3 left-1 h-[45px] w-[450px]">
                        <FontAwesomeIcon
                            // onClick={handleSearch}
                            icon={faMagnifyingGlass}
                            className="absolute left-0 w-[50px] h-[30px] top-1.5 text-grey"
                        />
                        <input
                            className="absolute top-0 left-12 bottom-[3px] bg-[#2F2F2F] text-2xl font-poppins w-full h-full rounded border-0 px-4 py-1 text-grey focus:outline-none"
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearchInputChange}
                            value={searchQuery}
                        />
                    </div>
                    <FontAwesomeIcon icon={faFilter} size="lg" className="absolute w-24 h-25 right-1 top-5" />
                </div>
                <div
                    className={`w-[200px] h-[42px] top-[240px] left-[288px] absolute flex flex-col justify-center items-center gap-15 overflow-hidden border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-lg font-sans font-bold`}
                >
                    <div className="align-items-center justify-start flex gap-x-7">
                        <Image src={upload} className="absolute text-yellow-color" alt="upload-button" />
                        <div onClick={handleUplodaPopUp}>
                            <input
                                id="fileButton"
                                type="file"
                                hidden
                                onChange={(event) => handleFileChange(1, event)}
                            />
                            <Button className="bg-222222 p-0 text-transparent bg-clip-text bg-gradient-gold-gbcs text-20 font-poppins font-normal tracking-0.38 break-words">
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>
                <div
                    className={`w-[162px] h-[42px] top-[240px] left-[510px] absolute flex flex-col justify-center items-center gap-15 overflow-hidden border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3 text-[#FFE34E] text-lg font-sans font-bold`}
                >
                    <div>
                        <div>
                            <Button
                                onClick={handleSortClick}
                                className="bg-222222 text-center text-transparent bg-clip-text bg-gradient-gold-gbcs text-20 font-poppins font-normal tracking-0.38 break-words"
                            >
                                Sort By
                            </Button>
                        </div>
                    </div>
                </div>
                {isModalOpen && (
                    <div className="bg-accent-color z-10 mt-12 absolute top-60 right-20 rounded-xl  py-10 px-[10px]">
                        <div className="list-none flex cursor-pointer" onClick={() => handleSortBy("file name desc")}>
                            <p className="text-18 text-[#F2F2F2] -mb-3">
                                File Name <span>&#x2193;</span>
                            </p>
                        </div>
                        <div
                            className=" mt-2 mb-2 border-2 border-white-color"
                            style={{
                                borderBottom: "0.3px solid #ffffff",
                                width: "100%",
                            }}
                        ></div>
                        <div
                            className="mx-auto flex cursor-pointer list-none"
                            onClick={() => handleSortBy("file name asc")}
                        >
                            <p className="text-18 text-[#F2F2F2]">File Name</p>
                        </div>
                        <div
                            className=" mb-2"
                            style={{
                                borderBottom: "0.32px solid #ffffff",
                                width: "100%",
                            }}
                        ></div>
                        <div
                            className="mx-auto flex cursor-pointer list-none"
                            onClick={() => handleSortBy("file format")}
                        >
                            <p className="text-18 text-[#F2F2F2]">File Format</p>
                        </div>
                        <div
                            className="mb-2"
                            style={{
                                borderBottom: "0.32px solid #ffffff",
                                width: "100%",
                            }}
                        ></div>
                         {isFileFormatDropdownOpen && (
            <div className="bg-accent-color text-[#F2F2F2] text-18  z-10 mt-12 absolute top-0 left-full ml-2 rounded-xl w-[125px] h-[148px]" style={{ top: '-50px' }}>
                <div className="mx-3 p-2 cursor-pointer w-[105px] h-[24px]"onClick={() => handleSortByFormat("Image")}>Image</div>
                <div className="mx-auto my-1.5 w-[91.15px] border-2 border-white-color" style={{ borderBottom: "0.3px solid #ffffff", width: "91.15px" , height: "0px"}}></div>
                <div className="mx-3 p-2 cursor-pointer w-[105px] h-[24px]" onClick={() => handleSortByFormat("Video")}>Video</div>
                <div className="mx-auto my-1.5 w-[91.15px] border-2 border-white-color" style={{ borderBottom: "0.3px solid #ffffff", width: "91.15px" ,height: "0px"}}></div>
                <div className="mx-3 p-2 cursor-pointer w-[105px] h-[24px]"onClick={() => handleSortByFormat("3D Model")}>3D Model</div>
                <div className="mx-auto my-1.5 w-[91.15px] border-2 border-white-color" style={{ borderBottom: "0.3px solid #ffffff", width: "91.15px",height: "0px" }}></div>
                <div className="mx-3 p-2 cursor-pointer  w-[105px] h-[24px]" onClick={() => handleSortByFormat("Others")}>Others</div>
                <div className="mx-auto my-1.5 w-[91.15px] border-2 border-white-color border-center" style={{ borderBottom: "0.3px solid #ffffff", width: "91.15px" ,height: "0px"}}></div>
            </div>
        )}

                        <div
                            className="mx-auto flex cursor-pointer list-none"
                            onClick={() => handleSortBy("upload date desc")}
                        >
                            <p className="text-18 text-[#F2F2F2]">
                                Upload Date <span>&#x2193;</span>
                            </p>
                        </div>
                        <div
                            className=" mb-2"
                            style={{
                                borderBottom: "0.32px solid #ffffff",
                                width: "100%",
                            }}
                        ></div>
                        <div
                            className="mx-auto flex cursor-pointer list-none"
                            onClick={() => handleSortBy("upload date asc")}
                        >
                            <p className="text-18 text-[#F2F2F2]">
                                Upload Date <span className="ml-4">&#x2191;</span>
                            </p>
                        </div>
                        <div
                            className=" mb-2"
                            style={{
                                borderBottom: "0.32px solid #ffffff",
                                width: "100%",
                            }}
                        ></div>
                        {/* <div className="absolute right-3 top-1">
              <Image
                style={{ cursor: "pointer" }}
                width={12}
                height={20}
                src={close}
                onClick={handleClose}
                alt="Close Icon"
              />
            </div> */}
                    </div>
                )}
                <div
                    onDragOver={handleDragOver}
                    className="flex flex-wrap absolute top-80 mb-20 pb-20 left-28 h-[600px] w-[600px]"
                >
                    {filteredData.map((val, index) => {
                        return (
                            <>
                                <Card
                                    key={index}
                                    className={`w-264 h-72 absolute shadow-md rounded-lg border-gray-300 ${
                                        selectedImages.includes(index)
                                            ? `${style.glow} bg-accent-color`
                                            : "bg-accent-color"
                                    }`}
                                    style={{
                                        left: 10 + (index % 2) * 300,
                                        top: 10 + Math.floor(index / 2) * 300,
                                    }}
                                    onClick={() => handleToggleSelection(index, val)}
                                >
                                    <Card.Body
                                        style={{background: "#F0F0F0"}}
                                        className="flex flex-col h-192 w-247 overflow-hidden items-center rounded-lg absolute justify-center left-2 top-2"
                                    >
                                        <img src={val.fileUrl} alt="Selected" className="w-full h-auto rounded-lg" />
                                    </Card.Body>
                                    <Card.Footer className="absolute bottom-0 left-1 flex flex-col">
                                        {editModes[index] ? (
                                            <div className="flex">
                                                <input
                                                    style={{height: "25px", width: "76%"}}
                                                    key={index}
                                                    value={inputValues[index]}
                                                    onChange={(e) => changeName(e, index)}
                                                />
                                                <div className="justify-center items-center h-[25px] overflow-hidden border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-1 text-[#FFE34E] text-sm font-sans font-bold">
                                                    <Button
                                                        onClick={() => {
                                                            setDropdownOpen((prevState) => {
                                                                const newState = [...prevState];
                                                                newState[index] = false;
                                                                return newState;
                                                            });
                                                            toggleEditMode(index);
                                                            handleSave(index);
                                                        }}
                                                        className="bg-222222 text-center text-transparent bg-clip-text bg-gradient-gold-gbcs text-15 font-poppins font-normal tracking-0.38 break-words -mt-10"
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="text-white">{val.fileName}</span>
                                            </div>
                                        )}
                                        <span>
                                            <span key={index}>
                                                {val.addedBy && val.addedBy.userName
                                                    ? `${getDate(val.dateAdded)} by ${val.addedBy.userName}`
                                                    : "Unknown User"}
                                            </span>
                                        </span>
                                        <span>{val.fileSize}</span>
                                    </Card.Footer>
                                    <div
                                        className="absolute cursor-pointer h-2 w-11 top-4 left-48"
                                        onClick={() => {
                                            setDropdownOpen((prevState) => {
                                                const newState = [...prevState];
                                                newState[index] = !newState[index];
                                                return newState;
                                            });
                                        }}
                                    >
                                        <Image src={dots} className="absolute" alt="options-dot" />
                                        {isDropdownOpen[index] && (
                                            <div
                                                className="absolute right-1 top-5 rounded-lg  p-5 bg-accent-color"
                                                style={{boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)"}}
                                            >
                                                <div
                                                    className="flex text-white font-poppins text-18"
                                                    onClick={() => {
                                                        setDropdownOpen((prevState) => {
                                                            const newState = [...prevState];
                                                            newState[index] = false;
                                                            return newState;
                                                        });
                                                    }}
                                                >
                                                    <div className="mx-1">
                                                        <EditOutlinedIcon style={{fill: "gold", fontSize: 30}} />
                                                    </div>
                                                    <div onClick={() => handleRename(index)}>
                                                        <div>Rename</div>
                                                        <hr className="my-1 w-80 border-slate-400" />
                                                    </div>
                                                </div>
                                                <div
                                                    className="flex text-white font-poppins text-18"
                                                    onClick={() => {
                                                        setDropdownOpen((prevState) => {
                                                            const newState = [...prevState];
                                                            newState[index] = false;
                                                            return newState;
                                                        });
                                                    }}
                                                >
                                                    <div className="mx-1">
                                                        <DeleteOutlinedIcon style={{fill: "gold", fontSize: 30}} />
                                                    </div>
                                                    <div>
                                                        <div onClick={() => handleDelete(index)}>Delete</div>
                                                        <hr className="my-1 w-80 border-slate-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </>
                        );
                    })}
                </div>

                <OverlayComponent
                    show={overlays.showSubmitSuccessfullyCard}
                    onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                >
                    <SubmitSuccessfully
                        onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                        message={"File(s)Uploaded!"}
                    />
                </OverlayComponent>
            </div>
            <div className="justify-center mt-12 w-1/6 mx-auto absolute bottom-0 left-0 right-0 text-center h-[38px] overflow-hidden border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-1 text-[#FFE34E] text-sm font-sans font-bold">
                <Button
                    onClick={handleSendSelectedImages}
                    className="bg-222222 text-transparent bg-clip-text bg-gradient-gold-gbcs text-15 font-poppins font-normal tracking-0.38 break-words "
                >
                    Upload
                </Button>
            </div>
            <div>{uploadPopUp === true && <FileUpload onClose={closeModal} />}</div>
        </div>
    );
};

export default MediaLibrary;