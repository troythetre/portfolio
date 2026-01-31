// "use client";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {Menu, Transition} from "@headlessui/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Image from "next/image";
import {Button} from "@mantine/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../Datepicker.module.css";
import {BASEURL} from "../../../../constants/index";
import {
    useFormData,
    useFormDropdown,
    useFormDates,
    useFormDeadline,
    useClientColor,
    useCompanyColor,
    useTeamData,
    useProposalID,
    useImageFile,
} from "../FormDataContext";
import back from "../../../../public/images/backIcon.svg";
import pdfIcon from "../../../../public/images/pdfIcon.svg";
import Avatar from "../../../../public/images/Avatar.svg";
import editIcon from "../../../../public/images/editIcon.svg";
import DropdownMenu from "../DropdownMenu";
import "react-datepicker/dist/react-datepicker.css";
import ColorSwatches from "../ColorSwatches";
import {useRouter} from "next/router";
import PopupMsg from "../../PopupMsg/PopupMsg";
import {format, parseISO} from "date-fns";
import OverlayComponent from "../../../sectionB/sideBar/OverlayComponent";
import SubmitSuccessfully from "../../../sectionB/sideBar/SubmitSuccessfully";
import Header from "../../Header";

interface ColorPreviewProps {
    selectedColors: string[];
    onClose: () => void;
    onBack: () => void;
}
const ReviewForm: React.FC<ColorPreviewProps> = ({onClose, onBack}) => {
    const {formData1, setFormData1} = useFormData();
    const {imageFile, setImageFile} = useImageFile();
    console.log(imageFile);
    const handleImageUpload = (file: File) => {
        setImageFile(file);
    };
    const {dates, setDates} = useFormDates();
    const {dropdownValues, setDropdownValues} = useFormDropdown();
    const {proposalDeadline, setDeadline} = useFormDeadline();
    const {selectedResult} = useTeamData();
    const {proposalID, setProposalID} = useProposalID();
    const {clientColor, setClientColor} = useClientColor();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProposalName, setEditedProposalName] = useState("");
    const [editedProposalMedium, setEditedProposalMedium] = useState("");
    const {companyColor} = useCompanyColor();
    type SoftwareOptions = {
        [key: string]: {description: string; value: string}[];
    };
    interface User {
        userEmail: string;
        role: string;
        displayName: string;
    }
    const [overlays, setOverlays] = useState<{showAssignCard: boolean}>({
        showAssignCard: false,
    });
    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({...prevOverlays, [overlayName]: !prevOverlays[overlayName]}));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({...prevOverlays, [overlayName]: false}));
    };
    const [RFPTypeOptions, setRFPTypeOptions] = useState([]);
    const [companyColorOptions, setCompanyColorOptions] = useState([]);
    const [proposalMediumoptions, setProposalMediumOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [softwareOptions, setSoftwareOptions] = useState({
        GBCS: ["Lokomotive", "Aukai"],
        SkyIT: ["Orion"],
    });
    const payloadProposalMedium = {
        dropdown_type: "proposal_medium",
        option: "",
    };

    const payloadProposalColor = {
        dropdown_type: "proposal_colors",
        option: "gbcs",
    };

    const payloadProposalSoftware = {
        dropdown_type: "proposal_software",
        option: "gbcs",
    };

    const payloadProposalSoftwareOrion = {
        dropdown_type: "proposal_software",
        option: "skyit",
    };

    const payloadProposalConsulting = {
        dropdown_type: "proposal_consulting",
        option: "",
    };
    const payloadRfpCompanyName = {
        dropdown_type: "proposal_rfp_company",
        option: "",
    };

    const dropdownPayloads = [
        payloadProposalMedium,
        payloadProposalColor,
        payloadProposalSoftware,
        payloadProposalSoftwareOrion,
        payloadProposalConsulting,
        payloadRfpCompanyName,
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async (payload: string | string[][] | Record<string, string> | URLSearchParams | undefined) => {
        try {
            const queryParams = new URLSearchParams(payload).toString();
            const response = await fetch(`${BASEURL}/api/proposal/get-dropdown-options?${queryParams}`, {
                method: "GET",
                credentials: "include",
            });

            const dropdownData = await response.json();
            switch (payload?.dropdown_type) {
                case "proposal_medium":
                    setProposalMediumOptions(dropdownData.message);
                    break;
                case "proposal_colors":
                    setCompanyColorOptions(dropdownData.message);
                    break;
                case "proposal_consulting":
                    setRFPTypeOptions(dropdownData.message);
                    break;
                case "proposal_software":
                    const updatedSoftwareOptions = {
                        ...softwareOptions,
                        [payload?.option]: dropdownData.message,
                    };
                    setSoftwareOptions(updatedSoftwareOptions);

                    break;
                case "proposal_software_orion":
                    const updatedOrionSoftwareOptions = {
                        ...softwareOptions,
                        [payload?.option]: dropdownData.message,
                    };
                    setSoftwareOptions(updatedOrionSoftwareOptions);
                    break;
                case "proposal_rfp_company":
                    setCompanyOptions(dropdownData.message);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        dropdownPayloads.forEach((payload) => fetchData(payload));
    }, []);

    const [selectedChangedColors, setSelectedChangedColors] = useState<string[]>([]);
    const [showSwatches, setShowSwatches] = useState(true);

    const handleColorSelection = (colors: string[]) => {
        setSelectedChangedColors(colors);
        setShowSwatches(false);
    };
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("");
    const onClosePopup = () => {
        setShowPopup(false);
        setPopupType("");
    };
    const router = useRouter();

    const {colors} = router.query;
    const componentToHex = (c: number) => {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };
    const selectedColors = colors ? JSON.parse(colors as string) : [];
    // const swatches = selectedColors.map((color: any[]) => {
    //     const hexColor = rgbToHex(color[0], color[1], color[2]);
    //     return hexColor;
    // });

    const [editedClientName1, setEditedClientName1] = useState("");
    const [editedClientName2, setEditedClientName2] = useState("");
    const [editedCompanyName, setEditedCompanyName] = useState("");
    const [editedSoftwareName, setEditedSoftwareName] = useState("");
    const [editedColorName, setEditedColorName] = useState("");
    const [isEditingRfpType, setIsEditingRfpType] = useState(false);
    const [isEditingColor, setIsEditingColor] = useState(false);
    const [isEditingClientColor, setIsEditingClientColor] = useState(false);

    const [isEditingClientName1, setIsEditingClientName1] = useState(false);
    const [editedDeadline, setEditedDeadline] = useState<string | null>(null);
    const [editedCompanyType, setEditedCompanyType] = useState("");
    const [editedCompanyColor, setEditedCompanyColor] = useState("");

    const [editedDates, setEditedDates] = useState([
        {identifier: "research", date: null},
        {identifier: "review", date: null},
        {identifier: "plan", date: null},
        {identifier: "teamOpt", date: null},
        {identifier: "ansDraft", date: null},
        {identifier: "submission", date: null},
        {identifier: "finalisation", date: null},
        {identifier: "teamReview", date: null},
    ]);
    const [isEditingDate, setIsEditingDate] = useState(false);

    const handleEdit = (field: string) => {
        setIsEditing(true);
        if (field === "basicInformation") {
            setEditedProposalName(formData1.proposalName || ""); // Initialize with current proposalName
            setEditedProposalMedium(dropdownValues.proposalMedium || "");
        } else if (field === "deadline") {
            setIsEditing(true);
            setEditedCompanyName(dropdownValues.companyName);
            setEditedSoftwareName(dropdownValues.softwareName);
        }
    };

    const handleEditDates = (field: string) => {
        setIsEditingDate(true);
        setEditedDates(dates);
    };
    const handleEditedDeadlineChange = (date: Date | null) => {
        if (!date) {
            return;
        }
        date?.setUTCHours(12, 0, 0, 0);
        const formattedDate = format(parseISO(date?.toISOString()), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        setEditedDeadline(formattedDate);
    };
    const handleEditRfpTypes = () => {
        setIsEditingRfpType(true);
        setEditedCompanyType(dropdownValues.companyType);
        setEditedSoftwareName(dropdownValues.softwareName);
        setEditedCompanyName(dropdownValues.companyName);
    };
    const handleClientNameEdit = () => {
        setIsEditingClientName1(true);
    };

    const handleChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;

        switch (fieldName) {
            case "proposalName":
                setEditedProposalName(value);
                break;
            case "clientName1":
                setEditedClientName1(value);
                break;
            case "clientName2":
                setEditedClientName2(value);
                break;
            default:
                break;
        }
        setFormData1((prevData) => ({
            ...prevData,
            fieldName: value,
        }));
    };

    const handleDropdownSelection = (fieldName: string, option: string) => {
        switch (fieldName) {
            case "proposalMedium":
                setEditedProposalMedium(option);
                break;
            case "companyName":
                setEditedCompanyName(option);
                break;
            case "companyType":
                setEditedCompanyType(option);
                break;
            case "softwareName":
                setEditedSoftwareName(option);
                break;
            case "companyColor":
                setEditedCompanyColor(option);
                break;
            default:
                break;
        }
        setDropdownValues((prevValues) => ({
            ...prevValues,
            [fieldName]: option,
        }));
    };
    const tasks = [
        {identifier: "research", description: "Research into Company"},
        {identifier: "plan", description: "Prepare Project Plan"},
        {identifier: "ansDraft", description: "First Draft of Team Answers"},
        {identifier: "teamReview", description: "Team Review + Optimization"},
        {identifier: "review", description: "Management Review"},
        {identifier: "teamOpt", description: "Team Optimization"},
        {identifier: "finalisation", description: "Finalization"},
        {identifier: "submission", description: "Submission of Proposal"},
    ];

    const handleDateChange = (identifier: string, date: Date | null, description: string) => {
        if (!date) {
            return;
        }
        date.setUTCHours(12, 0, 0, 0);

        const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        const updatedDates = editedDates.map((dateObj) =>
            dateObj.identifier === identifier ? {...dateObj, date: formattedDate, description} : dateObj
        );
        setEditedDates(updatedDates);
    };

    let dateRef = useRef<DatePicker>(null);

    const handleDeadlineImageClick = (ref: any) => {
        if (dateRef.current) {
            dateRef.current.setOpen(true);
        }
    };
    const datePickerRefs = tasks.reduce((refs: any, task) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        refs[task.identifier] = useRef(null);
        return refs;
    }, {});

    const handleImageClick = (taskIdentifier: string) => {
        datePickerRefs[taskIdentifier].current.setOpen(true);
    };
    const [selectedItems, setSelectedItems] = useState<User[]>(selectedResult);
    // const toggleSelectedItem = (index: number) => {
    //     setSelectedItems((prevSelectedResult) => {
    //         return prevSelectedResult.map((item, i) => {
    //             if (i === index) {
    //                 return {...item, role: "lead"};
    //             }
    //             return item;
    //         });
    //     });
    //     toggleOverlay("showAssignCard");
    // };

    const toggleSelectedItem = (index: number) => {
        setSelectedItems((prevSelectedItems) => {
            return prevSelectedItems.map((item, i) => {
                if (i === index) {
                    const updatedItem = { ...item, role: "lead" };
                    console.log("Updated item:", updatedItem);
                    return updatedItem;
                }
                return item;
            });
        });
        toggleOverlay("showAssignCard");
    };
    


    const removeTeamLead = async (index) => {
        const updatedMedia = [...selectedItems];

        updatedMedia.splice(index, 1);

        setSelectedItems(updatedMedia);
    };
    const extractedData = selectedItems.map(({userEmail, role}) => ({userEmail, role}));

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
    
        const proposalData = {
            name: isEditing ? editedProposalName : formData1.proposalName,
            members: extractedData.map(user => ({
                email: user.userEmail,
                isLead: user.role === "lead",
            })),
            proposalType: isEditing ? editedProposalMedium : dropdownValues.proposalMedium,
            milestones: tasks.map(task => {
                const editedDateObj = editedDates.find(dateObj => dateObj.identifier === task.identifier);
                const dateObj = dates.find(dateObj => dateObj.identifier === task.identifier);
                return {
                    date: isEditingDate
                        ? editedDateObj?.date || new Date().toISOString()
                        : dateObj?.date || new Date().toISOString(),
                    name: task.description,
                };
            }),
            SoftwareCompanyName: isEditingRfpType ? editedCompanyName : dropdownValues.companyName,
            proposal_deadline: isEditingDate ? editedDeadline : proposalDeadline.proposalDeadline,
            colors: {
                ourColors: ["#FFFFFF", "#000000"],
                clientColors: clientColor,
            },
            isConsulting: (isEditingRfpType ? editedCompanyType : dropdownValues.companyType) === "Consulting",
            softwareType: isEditingRfpType ? editedSoftwareName : dropdownValues.softwareName,
            companyNames: [
                isEditingClientName1 ? editedClientName1 : formData1.clientName1,
                isEditingClientName1 ? editedClientName2 : formData1.clientName2,
            ],
            templateID: [],
        };
    
        try {
            const formData = new FormData();
            if (imageFile) formData.append("image", imageFile); 
            formData.append("proposal", JSON.stringify(proposalData));
    
            const response = await fetch(`${BASEURL}/api/proposal/create`, {
                method: "POST",
                credentials: "include",
                body: formData, 
            });
    
            const resp = await response.json();
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                console.error("Error message from server:", resp);
            } else {
                setProposalID(resp.proposalID);
                router.push({ pathname: "/my_task/pick-a-template" });
            }
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };
    
    
    const handleBack = () => {
        router.push("/TeamSelection");
    };
    return (
        <div className="mx-4 xl-container">
            <Header label={" Review your proposal information"} onBack={handleBack} number={3} />
            <svg
                className="w-[97%] pl-12"
                width="90vw"
                height="85"
                viewBox="0 0 1759 85"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M42 21H583" stroke="#FFE34E" strokeWidth="6" />
                <path d="M1143 21H1701" stroke="url(#paint0_linear_5247_20030)" strokeWidth="6" />
                <path d="M602 21H1143" stroke="#FFE34E" strokeWidth="6" />
                <circle cx="1142" cy="21" r="19" fill="#FFE34E" />
                <circle cx="602" cy="21" r="19" fill="#FFE34E" />
                <circle cx="62" cy="21" r="19" fill="#FFD600" />
                <path
                    d="M16.192 67.14C16.192 68.3 15.792 69.2667 14.992 70.04C14.2054 70.8 12.9987 71.18 11.372 71.18H8.69203V77H6.87203V63.06H11.372C12.9454 63.06 14.1387 63.44 14.952 64.2C15.7787 64.96 16.192 65.94 16.192 67.14ZM11.372 69.68C12.3854 69.68 13.132 69.46 13.612 69.02C14.092 68.58 14.332 67.9533 14.332 67.14C14.332 65.42 13.3454 64.56 11.372 64.56H8.69203V69.68H11.372ZM20.2741 67.82C20.5941 67.1933 21.0474 66.7067 21.6341 66.36C22.2341 66.0133 22.9607 65.84 23.8141 65.84V67.72H23.3341C21.2941 67.72 20.2741 68.8267 20.2741 71.04V77H18.4541V66.04H20.2741V67.82ZM30.695 77.18C29.6683 77.18 28.735 76.9467 27.895 76.48C27.0683 76.0133 26.415 75.3533 25.935 74.5C25.4683 73.6333 25.235 72.6333 25.235 71.5C25.235 70.38 25.475 69.3933 25.955 68.54C26.4483 67.6733 27.115 67.0133 27.955 66.56C28.795 66.0933 29.735 65.86 30.775 65.86C31.815 65.86 32.755 66.0933 33.595 66.56C34.435 67.0133 35.095 67.6667 35.575 68.52C36.0683 69.3733 36.315 70.3667 36.315 71.5C36.315 72.6333 36.0617 73.6333 35.555 74.5C35.0617 75.3533 34.3883 76.0133 33.535 76.48C32.6817 76.9467 31.735 77.18 30.695 77.18ZM30.695 75.58C31.3483 75.58 31.9617 75.4267 32.535 75.12C33.1083 74.8133 33.5683 74.3533 33.915 73.74C34.275 73.1267 34.455 72.38 34.455 71.5C34.455 70.62 34.2817 69.8733 33.935 69.26C33.5883 68.6467 33.135 68.1933 32.575 67.9C32.015 67.5933 31.4083 67.44 30.755 67.44C30.0883 67.44 29.475 67.5933 28.915 67.9C28.3683 68.1933 27.9283 68.6467 27.595 69.26C27.2617 69.8733 27.095 70.62 27.095 71.5C27.095 72.3933 27.255 73.1467 27.575 73.76C27.9083 74.3733 28.3483 74.8333 28.895 75.14C29.4417 75.4333 30.0417 75.58 30.695 75.58ZM39.688 64.26C39.3413 64.26 39.048 64.14 38.808 63.9C38.5813 63.66 38.468 63.3667 38.468 63.02C38.468 62.6733 38.5813 62.38 38.808 62.14C39.048 61.9 39.3413 61.78 39.688 61.78C40.0346 61.78 40.3213 61.9 40.548 62.14C40.788 62.38 40.908 62.6733 40.908 63.02C40.908 63.3667 40.788 63.66 40.548 63.9C40.3213 64.14 40.0346 64.26 39.688 64.26ZM40.588 79.38C40.588 80.3533 40.3413 81.0667 39.848 81.52C39.3546 81.9733 38.6346 82.2 37.688 82.2H36.628V80.66H37.388C37.8946 80.66 38.248 80.56 38.448 80.36C38.6613 80.16 38.768 79.82 38.768 79.34V66.04H40.588V79.38ZM53.6689 71.1C53.6689 71.4467 53.6489 71.8133 53.6089 72.2H44.8489C44.9156 73.28 45.2822 74.1267 45.9489 74.74C46.6289 75.34 47.4489 75.64 48.4089 75.64C49.1956 75.64 49.8489 75.46 50.3689 75.1C50.9022 74.7267 51.2756 74.2333 51.4889 73.62H53.4489C53.1556 74.6733 52.5689 75.5333 51.6889 76.2C50.8089 76.8533 49.7156 77.18 48.4089 77.18C47.3689 77.18 46.4356 76.9467 45.6089 76.48C44.7956 76.0133 44.1556 75.3533 43.6889 74.5C43.2222 73.6333 42.9889 72.6333 42.9889 71.5C42.9889 70.3667 43.2156 69.3733 43.6689 68.52C44.1222 67.6667 44.7556 67.0133 45.5689 66.56C46.3956 66.0933 47.3422 65.86 48.4089 65.86C49.4489 65.86 50.3689 66.0867 51.1689 66.54C51.9689 66.9933 52.5822 67.62 53.0089 68.42C53.4489 69.2067 53.6689 70.1 53.6689 71.1ZM51.7889 70.72C51.7889 70.0267 51.6356 69.4333 51.3289 68.94C51.0222 68.4333 50.6022 68.0533 50.0689 67.8C49.5489 67.5333 48.9689 67.4 48.3289 67.4C47.4089 67.4 46.6222 67.6933 45.9689 68.28C45.3289 68.8667 44.9622 69.68 44.8689 70.72H51.7889ZM55.3913 71.5C55.3913 70.3667 55.6179 69.38 56.0713 68.54C56.5246 67.6867 57.1513 67.0267 57.9513 66.56C58.7646 66.0933 59.6913 65.86 60.7313 65.86C62.0779 65.86 63.1846 66.1867 64.0513 66.84C64.9313 67.4933 65.5113 68.4 65.7913 69.56H63.8313C63.6446 68.8933 63.2779 68.3667 62.7313 67.98C62.1979 67.5933 61.5313 67.4 60.7313 67.4C59.6913 67.4 58.8513 67.76 58.2113 68.48C57.5713 69.1867 57.2513 70.1933 57.2513 71.5C57.2513 72.82 57.5713 73.84 58.2113 74.56C58.8513 75.28 59.6913 75.64 60.7313 75.64C61.5313 75.64 62.1979 75.4533 62.7313 75.08C63.2646 74.7067 63.6313 74.1733 63.8313 73.48H65.7913C65.4979 74.6 64.9113 75.5 64.0313 76.18C63.1513 76.8467 62.0513 77.18 60.7313 77.18C59.6913 77.18 58.7646 76.9467 57.9513 76.48C57.1513 76.0133 56.5246 75.3533 56.0713 74.5C55.6179 73.6467 55.3913 72.6467 55.3913 71.5ZM70.4397 67.54V74C70.4397 74.5333 70.553 74.9133 70.7797 75.14C71.0064 75.3533 71.3997 75.46 71.9597 75.46H73.2997V77H71.6597C70.6464 77 69.8864 76.7667 69.3797 76.3C68.873 75.8333 68.6197 75.0667 68.6197 74V67.54H67.1997V66.04H68.6197V63.28H70.4397V66.04H73.2997V67.54H70.4397ZM85.2569 77.14C84.3369 77.14 83.5102 76.98 82.7769 76.66C82.0569 76.3267 81.4902 75.8733 81.0769 75.3C80.6635 74.7133 80.4502 74.04 80.4369 73.28H82.3769C82.4435 73.9333 82.7102 74.4867 83.1769 74.94C83.6569 75.38 84.3502 75.6 85.2569 75.6C86.1235 75.6 86.8035 75.3867 87.2969 74.96C87.8035 74.52 88.0569 73.96 88.0569 73.28C88.0569 72.7467 87.9102 72.3133 87.6169 71.98C87.3235 71.6467 86.9569 71.3933 86.5169 71.22C86.0769 71.0467 85.4835 70.86 84.7369 70.66C83.8169 70.42 83.0769 70.18 82.5169 69.94C81.9702 69.7 81.4969 69.3267 81.0969 68.82C80.7102 68.3 80.5169 67.6067 80.5169 66.74C80.5169 65.98 80.7102 65.3067 81.0969 64.72C81.4835 64.1333 82.0235 63.68 82.7169 63.36C83.4235 63.04 84.2302 62.88 85.1369 62.88C86.4435 62.88 87.5102 63.2067 88.3369 63.86C89.1769 64.5133 89.6502 65.38 89.7569 66.46H87.7569C87.6902 65.9267 87.4102 65.46 86.9169 65.06C86.4235 64.6467 85.7702 64.44 84.9569 64.44C84.1969 64.44 83.5769 64.64 83.0969 65.04C82.6169 65.4267 82.3769 65.9733 82.3769 66.68C82.3769 67.1867 82.5169 67.6 82.7969 67.92C83.0902 68.24 83.4435 68.4867 83.8569 68.66C84.2835 68.82 84.8769 69.0067 85.6369 69.22C86.5569 69.4733 87.2969 69.7267 87.8569 69.98C88.4169 70.22 88.8969 70.6 89.2969 71.12C89.6969 71.6267 89.8969 72.32 89.8969 73.2C89.8969 73.88 89.7169 74.52 89.3569 75.12C88.9969 75.72 88.4635 76.2067 87.7569 76.58C87.0502 76.9533 86.2169 77.14 85.2569 77.14ZM102.575 71.1C102.575 71.4467 102.555 71.8133 102.515 72.2H93.7552C93.8218 73.28 94.1885 74.1267 94.8552 74.74C95.5352 75.34 96.3552 75.64 97.3152 75.64C98.1018 75.64 98.7552 75.46 99.2752 75.1C99.8085 74.7267 100.182 74.2333 100.395 73.62H102.355C102.062 74.6733 101.475 75.5333 100.595 76.2C99.7152 76.8533 98.6218 77.18 97.3152 77.18C96.2752 77.18 95.3418 76.9467 94.5152 76.48C93.7018 76.0133 93.0618 75.3533 92.5952 74.5C92.1285 73.6333 91.8952 72.6333 91.8952 71.5C91.8952 70.3667 92.1218 69.3733 92.5752 68.52C93.0285 67.6667 93.6618 67.0133 94.4752 66.56C95.3018 66.0933 96.2485 65.86 97.3152 65.86C98.3552 65.86 99.2752 66.0867 100.075 66.54C100.875 66.9933 101.488 67.62 101.915 68.42C102.355 69.2067 102.575 70.1 102.575 71.1ZM100.695 70.72C100.695 70.0267 100.542 69.4333 100.235 68.94C99.9285 68.4333 99.5085 68.0533 98.9752 67.8C98.4552 67.5333 97.8752 67.4 97.2352 67.4C96.3152 67.4 95.5285 67.6933 94.8752 68.28C94.2352 68.8667 93.8685 69.68 93.7752 70.72H100.695ZM107.198 67.54V74C107.198 74.5333 107.311 74.9133 107.538 75.14C107.764 75.3533 108.158 75.46 108.717 75.46H110.058V77H108.418C107.404 77 106.644 76.7667 106.138 76.3C105.631 75.8333 105.378 75.0667 105.378 74V67.54H103.958V66.04H105.378V63.28H107.198V66.04H110.058V67.54H107.198ZM121.983 66.04V77H120.163V75.38C119.816 75.94 119.329 76.38 118.703 76.7C118.089 77.0067 117.409 77.16 116.663 77.16C115.809 77.16 115.043 76.9867 114.363 76.64C113.683 76.28 113.143 75.7467 112.743 75.04C112.356 74.3333 112.163 73.4733 112.163 72.46V66.04H113.963V72.22C113.963 73.3 114.236 74.1333 114.783 74.72C115.329 75.2933 116.076 75.58 117.023 75.58C117.996 75.58 118.763 75.28 119.323 74.68C119.883 74.08 120.163 73.2067 120.163 72.06V66.04H121.983ZM126.876 68.06C127.236 67.4333 127.769 66.9133 128.476 66.5C129.196 66.0733 130.029 65.86 130.976 65.86C131.949 65.86 132.829 66.0933 133.616 66.56C134.416 67.0267 135.042 67.6867 135.496 68.54C135.949 69.38 136.176 70.36 136.176 71.48C136.176 72.5867 135.949 73.5733 135.496 74.44C135.042 75.3067 134.416 75.98 133.616 76.46C132.829 76.94 131.949 77.18 130.976 77.18C130.042 77.18 129.216 76.9733 128.496 76.56C127.789 76.1333 127.249 75.6067 126.876 74.98V82.2H125.056V66.04H126.876V68.06ZM134.316 71.48C134.316 70.6533 134.149 69.9333 133.816 69.32C133.482 68.7067 133.029 68.24 132.456 67.92C131.896 67.6 131.276 67.44 130.596 67.44C129.929 67.44 129.309 67.6067 128.736 67.94C128.176 68.26 127.722 68.7333 127.376 69.36C127.042 69.9733 126.876 70.6867 126.876 71.5C126.876 72.3267 127.042 73.0533 127.376 73.68C127.722 74.2933 128.176 74.7667 128.736 75.1C129.309 75.42 129.929 75.58 130.596 75.58C131.276 75.58 131.896 75.42 132.456 75.1C133.029 74.7667 133.482 74.2933 133.816 73.68C134.149 73.0533 134.316 72.32 134.316 71.48Z"
                    fill="white"
                />
                <path
                    d="M548.78 73.9H542.7L541.58 77H539.66L544.7 63.14H546.8L551.82 77H549.9L548.78 73.9ZM548.26 72.42L545.74 65.38L543.22 72.42H548.26ZM553.337 71.48C553.337 70.36 553.563 69.38 554.017 68.54C554.47 67.6867 555.09 67.0267 555.877 66.56C556.677 66.0933 557.57 65.86 558.557 65.86C559.41 65.86 560.203 66.06 560.937 66.46C561.67 66.8467 562.23 67.36 562.617 68V62.2H564.457V77H562.617V74.94C562.257 75.5933 561.723 76.1333 561.017 76.56C560.31 76.9733 559.483 77.18 558.537 77.18C557.563 77.18 556.677 76.94 555.877 76.46C555.09 75.98 554.47 75.3067 554.017 74.44C553.563 73.5733 553.337 72.5867 553.337 71.48ZM562.617 71.5C562.617 70.6733 562.45 69.9533 562.117 69.34C561.783 68.7267 561.33 68.26 560.757 67.94C560.197 67.6067 559.577 67.44 558.897 67.44C558.217 67.44 557.597 67.6 557.037 67.92C556.477 68.24 556.03 68.7067 555.697 69.32C555.363 69.9333 555.197 70.6533 555.197 71.48C555.197 72.32 555.363 73.0533 555.697 73.68C556.03 74.2933 556.477 74.7667 557.037 75.1C557.597 75.42 558.217 75.58 558.897 75.58C559.577 75.58 560.197 75.42 560.757 75.1C561.33 74.7667 561.783 74.2933 562.117 73.68C562.45 73.0533 562.617 72.3267 562.617 71.5ZM566.852 71.48C566.852 70.36 567.079 69.38 567.532 68.54C567.986 67.6867 568.606 67.0267 569.392 66.56C570.192 66.0933 571.086 65.86 572.072 65.86C572.926 65.86 573.719 66.06 574.452 66.46C575.186 66.8467 575.746 67.36 576.132 68V62.2H577.972V77H576.132V74.94C575.772 75.5933 575.239 76.1333 574.532 76.56C573.826 76.9733 572.999 77.18 572.052 77.18C571.079 77.18 570.192 76.94 569.392 76.46C568.606 75.98 567.986 75.3067 567.532 74.44C567.079 73.5733 566.852 72.5867 566.852 71.48ZM576.132 71.5C576.132 70.6733 575.966 69.9533 575.632 69.34C575.299 68.7267 574.846 68.26 574.272 67.94C573.712 67.6067 573.092 67.44 572.412 67.44C571.732 67.44 571.112 67.6 570.552 67.92C569.992 68.24 569.546 68.7067 569.212 69.32C568.879 69.9333 568.712 70.6533 568.712 71.48C568.712 72.32 568.879 73.0533 569.212 73.68C569.546 74.2933 569.992 74.7667 570.552 75.1C571.112 75.42 571.732 75.58 572.412 75.58C573.092 75.58 573.712 75.42 574.272 75.1C574.846 74.7667 575.299 74.2933 575.632 73.68C575.966 73.0533 576.132 72.3267 576.132 71.5ZM600.52 63.16V77H598.7V66.68L594.1 77H592.82L588.2 66.66V77H586.38V63.16H588.34L593.46 74.6L598.58 63.16H600.52ZM613.606 71.1C613.606 71.4467 613.586 71.8133 613.546 72.2H604.786C604.853 73.28 605.22 74.1267 605.886 74.74C606.566 75.34 607.386 75.64 608.346 75.64C609.133 75.64 609.786 75.46 610.306 75.1C610.84 74.7267 611.213 74.2333 611.426 73.62H613.386C613.093 74.6733 612.506 75.5333 611.626 76.2C610.746 76.8533 609.653 77.18 608.346 77.18C607.306 77.18 606.373 76.9467 605.546 76.48C604.733 76.0133 604.093 75.3533 603.626 74.5C603.16 73.6333 602.926 72.6333 602.926 71.5C602.926 70.3667 603.153 69.3733 603.606 68.52C604.06 67.6667 604.693 67.0133 605.506 66.56C606.333 66.0933 607.28 65.86 608.346 65.86C609.386 65.86 610.306 66.0867 611.106 66.54C611.906 66.9933 612.52 67.62 612.946 68.42C613.386 69.2067 613.606 70.1 613.606 71.1ZM611.726 70.72C611.726 70.0267 611.573 69.4333 611.266 68.94C610.96 68.4333 610.54 68.0533 610.006 67.8C609.486 67.5333 608.906 67.4 608.266 67.4C607.346 67.4 606.56 67.6933 605.906 68.28C605.266 68.8667 604.9 69.68 604.806 70.72H611.726ZM629.189 65.84C630.042 65.84 630.802 66.02 631.469 66.38C632.135 66.7267 632.662 67.2533 633.049 67.96C633.435 68.6667 633.629 69.5267 633.629 70.54V77H631.829V70.8C631.829 69.7067 631.555 68.8733 631.009 68.3C630.475 67.7133 629.749 67.42 628.829 67.42C627.882 67.42 627.129 67.7267 626.569 68.34C626.009 68.94 625.729 69.8133 625.729 70.96V77H623.929V70.8C623.929 69.7067 623.655 68.8733 623.109 68.3C622.575 67.7133 621.849 67.42 620.929 67.42C619.982 67.42 619.229 67.7267 618.669 68.34C618.109 68.94 617.829 69.8133 617.829 70.96V77H616.009V66.04H617.829V67.62C618.189 67.0467 618.669 66.6067 619.269 66.3C619.882 65.9933 620.555 65.84 621.289 65.84C622.209 65.84 623.022 66.0467 623.729 66.46C624.435 66.8733 624.962 67.48 625.309 68.28C625.615 67.5067 626.122 66.9067 626.829 66.48C627.535 66.0533 628.322 65.84 629.189 65.84ZM638.434 68.08C638.808 67.4267 639.354 66.8933 640.074 66.48C640.794 66.0667 641.614 65.86 642.534 65.86C643.521 65.86 644.408 66.0933 645.194 66.56C645.981 67.0267 646.601 67.6867 647.054 68.54C647.508 69.38 647.734 70.36 647.734 71.48C647.734 72.5867 647.508 73.5733 647.054 74.44C646.601 75.3067 645.974 75.98 645.174 76.46C644.388 76.94 643.508 77.18 642.534 77.18C641.588 77.18 640.754 76.9733 640.034 76.56C639.328 76.1467 638.794 75.62 638.434 74.98V77H636.614V62.2H638.434V68.08ZM645.874 71.48C645.874 70.6533 645.708 69.9333 645.374 69.32C645.041 68.7067 644.588 68.24 644.014 67.92C643.454 67.6 642.834 67.44 642.154 67.44C641.488 67.44 640.868 67.6067 640.294 67.94C639.734 68.26 639.281 68.7333 638.934 69.36C638.601 69.9733 638.434 70.6867 638.434 71.5C638.434 72.3267 638.601 73.0533 638.934 73.68C639.281 74.2933 639.734 74.7667 640.294 75.1C640.868 75.42 641.488 75.58 642.154 75.58C642.834 75.58 643.454 75.42 644.014 75.1C644.588 74.7667 645.041 74.2933 645.374 73.68C645.708 73.0533 645.874 72.32 645.874 71.48ZM660.13 71.1C660.13 71.4467 660.11 71.8133 660.07 72.2H651.31C651.377 73.28 651.743 74.1267 652.41 74.74C653.09 75.34 653.91 75.64 654.87 75.64C655.657 75.64 656.31 75.46 656.83 75.1C657.363 74.7267 657.737 74.2333 657.95 73.62H659.91C659.617 74.6733 659.03 75.5333 658.15 76.2C657.27 76.8533 656.177 77.18 654.87 77.18C653.83 77.18 652.897 76.9467 652.07 76.48C651.257 76.0133 650.617 75.3533 650.15 74.5C649.683 73.6333 649.45 72.6333 649.45 71.5C649.45 70.3667 649.677 69.3733 650.13 68.52C650.583 67.6667 651.217 67.0133 652.03 66.56C652.857 66.0933 653.803 65.86 654.87 65.86C655.91 65.86 656.83 66.0867 657.63 66.54C658.43 66.9933 659.043 67.62 659.47 68.42C659.91 69.2067 660.13 70.1 660.13 71.1ZM658.25 70.72C658.25 70.0267 658.097 69.4333 657.79 68.94C657.483 68.4333 657.063 68.0533 656.53 67.8C656.01 67.5333 655.43 67.4 654.79 67.4C653.87 67.4 653.083 67.6933 652.43 68.28C651.79 68.8667 651.423 69.68 651.33 70.72H658.25ZM664.352 67.82C664.672 67.1933 665.126 66.7067 665.712 66.36C666.312 66.0133 667.039 65.84 667.892 65.84V67.72H667.412C665.372 67.72 664.352 68.8267 664.352 71.04V77H662.532V66.04H664.352V67.82ZM673.873 77.18C673.033 77.18 672.28 77.04 671.613 76.76C670.946 76.4667 670.42 76.0667 670.033 75.56C669.646 75.04 669.433 74.4467 669.393 73.78H671.273C671.326 74.3267 671.58 74.7733 672.033 75.12C672.5 75.4667 673.106 75.64 673.853 75.64C674.546 75.64 675.093 75.4867 675.493 75.18C675.893 74.8733 676.093 74.4867 676.093 74.02C676.093 73.54 675.88 73.1867 675.453 72.96C675.026 72.72 674.366 72.4867 673.473 72.26C672.66 72.0467 671.993 71.8333 671.473 71.62C670.966 71.3933 670.526 71.0667 670.153 70.64C669.793 70.2 669.613 69.6267 669.613 68.92C669.613 68.36 669.78 67.8467 670.113 67.38C670.446 66.9133 670.92 66.5467 671.533 66.28C672.146 66 672.846 65.86 673.633 65.86C674.846 65.86 675.826 66.1667 676.573 66.78C677.32 67.3933 677.72 68.2333 677.773 69.3H675.953C675.913 68.7267 675.68 68.2667 675.253 67.92C674.84 67.5733 674.28 67.4 673.573 67.4C672.92 67.4 672.4 67.54 672.013 67.82C671.626 68.1 671.433 68.4667 671.433 68.92C671.433 69.28 671.546 69.58 671.773 69.82C672.013 70.0467 672.306 70.2333 672.653 70.38C673.013 70.5133 673.506 70.6667 674.133 70.84C674.92 71.0533 675.56 71.2667 676.053 71.48C676.546 71.68 676.966 71.9867 677.313 72.4C677.673 72.8133 677.86 73.3533 677.873 74.02C677.873 74.62 677.706 75.16 677.373 75.64C677.04 76.12 676.566 76.5 675.953 76.78C675.353 77.0467 674.66 77.18 673.873 77.18Z"
                    fill="white"
                />
                <path
                    d="M1114.86 70.02C1114.86 68.66 1115.17 67.44 1115.78 66.36C1116.39 65.2667 1117.23 64.4133 1118.28 63.8C1119.35 63.1867 1120.53 62.88 1121.82 62.88C1123.34 62.88 1124.67 63.2467 1125.8 63.98C1126.93 64.7133 1127.76 65.7533 1128.28 67.1H1126.1C1125.71 66.26 1125.15 65.6133 1124.42 65.16C1123.7 64.7067 1122.83 64.48 1121.82 64.48C1120.85 64.48 1119.97 64.7067 1119.2 65.16C1118.43 65.6133 1117.82 66.26 1117.38 67.1C1116.94 67.9267 1116.72 68.9 1116.72 70.02C1116.72 71.1267 1116.94 72.1 1117.38 72.94C1117.82 73.7667 1118.43 74.4067 1119.2 74.86C1119.97 75.3133 1120.85 75.54 1121.82 75.54C1122.83 75.54 1123.7 75.32 1124.42 74.88C1125.15 74.4267 1125.71 73.78 1126.1 72.94H1128.28C1127.76 74.2733 1126.93 75.3067 1125.8 76.04C1124.67 76.76 1123.34 77.12 1121.82 77.12C1120.53 77.12 1119.35 76.82 1118.28 76.22C1117.23 75.6067 1116.39 74.76 1115.78 73.68C1115.17 72.6 1114.86 71.38 1114.86 70.02ZM1136.43 65.84C1137.26 65.84 1138 66.02 1138.67 66.38C1139.34 66.7267 1139.86 67.2533 1140.23 67.96C1140.62 68.6667 1140.81 69.5267 1140.81 70.54V77H1139.01V70.8C1139.01 69.7067 1138.74 68.8733 1138.19 68.3C1137.64 67.7133 1136.9 67.42 1135.95 67.42C1134.99 67.42 1134.22 67.72 1133.65 68.32C1133.09 68.92 1132.81 69.7933 1132.81 70.94V77H1130.99V62.2H1132.81V67.6C1133.17 67.04 1133.66 66.6067 1134.29 66.3C1134.93 65.9933 1135.64 65.84 1136.43 65.84ZM1153.78 71.1C1153.78 71.4467 1153.76 71.8133 1153.72 72.2H1144.96C1145.03 73.28 1145.4 74.1267 1146.06 74.74C1146.74 75.34 1147.56 75.64 1148.52 75.64C1149.31 75.64 1149.96 75.46 1150.48 75.1C1151.02 74.7267 1151.39 74.2333 1151.6 73.62H1153.56C1153.27 74.6733 1152.68 75.5333 1151.8 76.2C1150.92 76.8533 1149.83 77.18 1148.52 77.18C1147.48 77.18 1146.55 76.9467 1145.72 76.48C1144.91 76.0133 1144.27 75.3533 1143.8 74.5C1143.34 73.6333 1143.1 72.6333 1143.1 71.5C1143.1 70.3667 1143.33 69.3733 1143.78 68.52C1144.24 67.6667 1144.87 67.0133 1145.68 66.56C1146.51 66.0933 1147.46 65.86 1148.52 65.86C1149.56 65.86 1150.48 66.0867 1151.28 66.54C1152.08 66.9933 1152.7 67.62 1153.12 68.42C1153.56 69.2067 1153.78 70.1 1153.78 71.1ZM1151.9 70.72C1151.9 70.0267 1151.75 69.4333 1151.44 68.94C1151.14 68.4333 1150.72 68.0533 1150.18 67.8C1149.66 67.5333 1149.08 67.4 1148.44 67.4C1147.52 67.4 1146.74 67.6933 1146.08 68.28C1145.44 68.8667 1145.08 69.68 1144.98 70.72H1151.9ZM1155.5 71.5C1155.5 70.3667 1155.73 69.38 1156.18 68.54C1156.64 67.6867 1157.26 67.0267 1158.06 66.56C1158.88 66.0933 1159.8 65.86 1160.84 65.86C1162.19 65.86 1163.3 66.1867 1164.16 66.84C1165.04 67.4933 1165.62 68.4 1165.9 69.56H1163.94C1163.76 68.8933 1163.39 68.3667 1162.84 67.98C1162.31 67.5933 1161.64 67.4 1160.84 67.4C1159.8 67.4 1158.96 67.76 1158.32 68.48C1157.68 69.1867 1157.36 70.1933 1157.36 71.5C1157.36 72.82 1157.68 73.84 1158.32 74.56C1158.96 75.28 1159.8 75.64 1160.84 75.64C1161.64 75.64 1162.31 75.4533 1162.84 75.08C1163.38 74.7067 1163.74 74.1733 1163.94 73.48H1165.9C1165.61 74.6 1165.02 75.5 1164.14 76.18C1163.26 76.8467 1162.16 77.18 1160.84 77.18C1159.8 77.18 1158.88 76.9467 1158.06 76.48C1157.26 76.0133 1156.64 75.3533 1156.18 74.5C1155.73 73.6467 1155.5 72.6467 1155.5 71.5ZM1174.45 77L1170.15 72.16V77H1168.33V62.2H1170.15V70.9L1174.37 66.04H1176.91L1171.75 71.5L1176.93 77H1174.45Z"
                    fill="white"
                />
                <circle cx="1682" cy="21" r="21" fill="#555555" />
                <path
                    d="M1629.86 67.14C1629.86 68.3 1629.46 69.2667 1628.66 70.04C1627.87 70.8 1626.67 71.18 1625.04 71.18H1622.36V77H1620.54V63.06H1625.04C1626.61 63.06 1627.81 63.44 1628.62 64.2C1629.45 64.96 1629.86 65.94 1629.86 67.14ZM1625.04 69.68C1626.05 69.68 1626.8 69.46 1627.28 69.02C1627.76 68.58 1628 67.9533 1628 67.14C1628 65.42 1627.01 64.56 1625.04 64.56H1622.36V69.68H1625.04ZM1633.06 64.26C1632.72 64.26 1632.42 64.14 1632.18 63.9C1631.94 63.66 1631.82 63.3667 1631.82 63.02C1631.82 62.6733 1631.94 62.38 1632.18 62.14C1632.42 61.9 1632.72 61.78 1633.06 61.78C1633.4 61.78 1633.68 61.9 1633.9 62.14C1634.14 62.38 1634.26 62.6733 1634.26 63.02C1634.26 63.3667 1634.14 63.66 1633.9 63.9C1633.68 64.14 1633.4 64.26 1633.06 64.26ZM1633.94 66.04V77H1632.12V66.04H1633.94ZM1636.36 71.5C1636.36 70.3667 1636.59 69.38 1637.04 68.54C1637.5 67.6867 1638.12 67.0267 1638.92 66.56C1639.74 66.0933 1640.66 65.86 1641.7 65.86C1643.05 65.86 1644.16 66.1867 1645.02 66.84C1645.9 67.4933 1646.48 68.4 1646.76 69.56H1644.8C1644.62 68.8933 1644.25 68.3667 1643.7 67.98C1643.17 67.5933 1642.5 67.4 1641.7 67.4C1640.66 67.4 1639.82 67.76 1639.18 68.48C1638.54 69.1867 1638.22 70.1933 1638.22 71.5C1638.22 72.82 1638.54 73.84 1639.18 74.56C1639.82 75.28 1640.66 75.64 1641.7 75.64C1642.5 75.64 1643.17 75.4533 1643.7 75.08C1644.24 74.7067 1644.6 74.1733 1644.8 73.48H1646.76C1646.47 74.6 1645.88 75.5 1645 76.18C1644.12 76.8467 1643.02 77.18 1641.7 77.18C1640.66 77.18 1639.74 76.9467 1638.92 76.48C1638.12 76.0133 1637.5 75.3533 1637.04 74.5C1636.59 73.6467 1636.36 72.6467 1636.36 71.5ZM1655.31 77L1651.01 72.16V77H1649.19V62.2H1651.01V70.9L1655.23 66.04H1657.77L1652.61 71.5L1657.79 77H1655.31ZM1673.4 63.06V64.54H1669.6V77H1667.78V64.54H1663.96V63.06H1673.4ZM1685.64 71.1C1685.64 71.4467 1685.62 71.8133 1685.58 72.2H1676.82C1676.88 73.28 1677.25 74.1267 1677.92 74.74C1678.6 75.34 1679.42 75.64 1680.38 75.64C1681.16 75.64 1681.82 75.46 1682.34 75.1C1682.87 74.7267 1683.24 74.2333 1683.46 73.62H1685.42C1685.12 74.6733 1684.54 75.5333 1683.66 76.2C1682.78 76.8533 1681.68 77.18 1680.38 77.18C1679.34 77.18 1678.4 76.9467 1677.58 76.48C1676.76 76.0133 1676.12 75.3533 1675.66 74.5C1675.19 73.6333 1674.96 72.6333 1674.96 71.5C1674.96 70.3667 1675.18 69.3733 1675.64 68.52C1676.09 67.6667 1676.72 67.0133 1677.54 66.56C1678.36 66.0933 1679.31 65.86 1680.38 65.86C1681.42 65.86 1682.34 66.0867 1683.14 66.54C1683.94 66.9933 1684.55 67.62 1684.98 68.42C1685.42 69.2067 1685.64 70.1 1685.64 71.1ZM1683.76 70.72C1683.76 70.0267 1683.6 69.4333 1683.3 68.94C1682.99 68.4333 1682.57 68.0533 1682.04 67.8C1681.52 67.5333 1680.94 67.4 1680.3 67.4C1679.38 67.4 1678.59 67.6933 1677.94 68.28C1677.3 68.8667 1676.93 69.68 1676.84 70.72H1683.76ZM1701.22 65.84C1702.07 65.84 1702.83 66.02 1703.5 66.38C1704.17 66.7267 1704.69 67.2533 1705.08 67.96C1705.47 68.6667 1705.66 69.5267 1705.66 70.54V77H1703.86V70.8C1703.86 69.7067 1703.59 68.8733 1703.04 68.3C1702.51 67.7133 1701.78 67.42 1700.86 67.42C1699.91 67.42 1699.16 67.7267 1698.6 68.34C1698.04 68.94 1697.76 69.8133 1697.76 70.96V77H1695.96V70.8C1695.96 69.7067 1695.69 68.8733 1695.14 68.3C1694.61 67.7133 1693.88 67.42 1692.96 67.42C1692.01 67.42 1691.26 67.7267 1690.7 68.34C1690.14 68.94 1689.86 69.8133 1689.86 70.96V77H1688.04V66.04H1689.86V67.62C1690.22 67.0467 1690.7 66.6067 1691.3 66.3C1691.91 65.9933 1692.59 65.84 1693.32 65.84C1694.24 65.84 1695.05 66.0467 1695.76 66.46C1696.47 66.8733 1696.99 67.48 1697.34 68.28C1697.65 67.5067 1698.15 66.9067 1698.86 66.48C1699.57 66.0533 1700.35 65.84 1701.22 65.84ZM1710.47 68.06C1710.83 67.4333 1711.36 66.9133 1712.07 66.5C1712.79 66.0733 1713.62 65.86 1714.57 65.86C1715.54 65.86 1716.42 66.0933 1717.21 66.56C1718.01 67.0267 1718.63 67.6867 1719.09 68.54C1719.54 69.38 1719.77 70.36 1719.77 71.48C1719.77 72.5867 1719.54 73.5733 1719.09 74.44C1718.63 75.3067 1718.01 75.98 1717.21 76.46C1716.42 76.94 1715.54 77.18 1714.57 77.18C1713.63 77.18 1712.81 76.9733 1712.09 76.56C1711.38 76.1333 1710.84 75.6067 1710.47 74.98V82.2H1708.65V66.04H1710.47V68.06ZM1717.91 71.48C1717.91 70.6533 1717.74 69.9333 1717.41 69.32C1717.07 68.7067 1716.62 68.24 1716.05 67.92C1715.49 67.6 1714.87 67.44 1714.19 67.44C1713.52 67.44 1712.9 67.6067 1712.33 67.94C1711.77 68.26 1711.31 68.7333 1710.97 69.36C1710.63 69.9733 1710.47 70.6867 1710.47 71.5C1710.47 72.3267 1710.63 73.0533 1710.97 73.68C1711.31 74.2933 1711.77 74.7667 1712.33 75.1C1712.9 75.42 1713.52 75.58 1714.19 75.58C1714.87 75.58 1715.49 75.42 1716.05 75.1C1716.62 74.7667 1717.07 74.2933 1717.41 73.68C1717.74 73.0533 1717.91 72.32 1717.91 71.48ZM1723.98 62.2V77H1722.16V62.2H1723.98ZM1726.4 71.48C1726.4 70.36 1726.63 69.38 1727.08 68.54C1727.54 67.6867 1728.16 67.0267 1728.94 66.56C1729.74 66.0933 1730.63 65.86 1731.6 65.86C1732.56 65.86 1733.4 66.0667 1734.1 66.48C1734.81 66.8933 1735.34 67.4133 1735.68 68.04V66.04H1737.52V77H1735.68V74.96C1735.32 75.6 1734.78 76.1333 1734.06 76.56C1733.36 76.9733 1732.53 77.18 1731.58 77.18C1730.61 77.18 1729.73 76.94 1728.94 76.46C1728.16 75.98 1727.54 75.3067 1727.08 74.44C1726.63 73.5733 1726.4 72.5867 1726.4 71.48ZM1735.68 71.5C1735.68 70.6733 1735.52 69.9533 1735.18 69.34C1734.85 68.7267 1734.4 68.26 1733.82 67.94C1733.26 67.6067 1732.64 67.44 1731.96 67.44C1731.28 67.44 1730.66 67.6 1730.1 67.92C1729.54 68.24 1729.1 68.7067 1728.76 69.32C1728.43 69.9333 1728.26 70.6533 1728.26 71.48C1728.26 72.32 1728.43 73.0533 1728.76 73.68C1729.1 74.2933 1729.54 74.7667 1730.1 75.1C1730.66 75.42 1731.28 75.58 1731.96 75.58C1732.64 75.58 1733.26 75.42 1733.82 75.1C1734.4 74.7667 1734.85 74.2933 1735.18 73.68C1735.52 73.0533 1735.68 72.3267 1735.68 71.5ZM1742.82 67.54V74C1742.82 74.5333 1742.93 74.9133 1743.16 75.14C1743.39 75.3533 1743.78 75.46 1744.34 75.46H1745.68V77H1744.04C1743.03 77 1742.27 76.7667 1741.76 76.3C1741.25 75.8333 1741 75.0667 1741 74V67.54H1739.58V66.04H1741V63.28H1742.82V66.04H1745.68V67.54H1742.82ZM1757.88 71.1C1757.88 71.4467 1757.86 71.8133 1757.82 72.2H1749.06C1749.13 73.28 1749.5 74.1267 1750.16 74.74C1750.84 75.34 1751.66 75.64 1752.62 75.64C1753.41 75.64 1754.06 75.46 1754.58 75.1C1755.12 74.7267 1755.49 74.2333 1755.7 73.62H1757.66C1757.37 74.6733 1756.78 75.5333 1755.9 76.2C1755.02 76.8533 1753.93 77.18 1752.62 77.18C1751.58 77.18 1750.65 76.9467 1749.82 76.48C1749.01 76.0133 1748.37 75.3533 1747.9 74.5C1747.44 73.6333 1747.2 72.6333 1747.2 71.5C1747.2 70.3667 1747.43 69.3733 1747.88 68.52C1748.34 67.6667 1748.97 67.0133 1749.78 66.56C1750.61 66.0933 1751.56 65.86 1752.62 65.86C1753.66 65.86 1754.58 66.0867 1755.38 66.54C1756.18 66.9933 1756.8 67.62 1757.22 68.42C1757.66 69.2067 1757.88 70.1 1757.88 71.1ZM1756 70.72C1756 70.0267 1755.85 69.4333 1755.54 68.94C1755.24 68.4333 1754.82 68.0533 1754.28 67.8C1753.76 67.5333 1753.18 67.4 1752.54 67.4C1751.62 67.4 1750.84 67.6933 1750.18 68.28C1749.54 68.8667 1749.18 69.68 1749.08 70.72H1756Z"
                    fill="white"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_5247_20030"
                        x1="1948.81"
                        y1="23.8334"
                        x2="1178.36"
                        y2="23.8334"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#555555" />
                    </linearGradient>
                </defs>
            </svg>
            <p className="text-yellow-400 text-20 mt-5">
                * Check if all the information is correct and edit any changes
            </p>
            <form className="font-poppins">
                <div className="rounded-xl pt-15 px-13 pb-24 mt-5 border-solid border-accent-color">
                    <div className="flex justify-between text-30 text-white-color">
                        <p>Basic Information</p>
                        {isEditing ? (
                            ""
                        ) : (
                            <div className="border-lg p-1">
                                <Image
                                    src={editIcon}
                                    alt="edit_icon"
                                    width="25"
                                    height="25"
                                    onClick={() => handleEdit("basicInformation")}
                                ></Image>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <div className="text-25 mt-5 text-white-color">
                            <label>What would you like to name this proposal?</label>
                            <input
                                required
                                type="text"
                                onChange={(e) => handleChange("proposalName", e)}
                                value={isEditing ? editedProposalName : formData1.proposalName || ""}
                                className="block mt-1 bg-card-bg rounded-md pl-10  placeholder:text-gray-400"
                                style={{
                                    width: "45vw",
                                    height: "2.2rem",
                                    borderBottom: "1.7px solid yellow",
                                    color: "#b5b5b5",
                                    borderLeft: "none",
                                    borderRight: "none",
                                    borderTop: "none",
                                }}
                                placeholder="Enter proposal name"
                            />
                        </div>
                        <div className="text-25 text-white-color pt-20 relative">
                            <label>What is the proposals medium?</label>
                            <Menu as="div" className="block mt-1 bg-card-bg rounded-md w-full">
                                <Menu.Button
                                    className="w-full flex items-center justify-between pl-10 text-gray-400 bg-card-bg rounded-md"
                                    style={{
                                        border: "1.7px solid yellow",
                                        borderTop: "none",
                                        borderLeft: "none",
                                        borderRight: "none",
                                        height: "2.2rem",
                                    }}
                                >
                                    {isEditing ? editedProposalMedium : dropdownValues.proposalMedium || ""}
                                    {/* {dropdownValues.proposalMedium || "Choose Medium"} */}
                                    <ArrowDropDownIcon className="text-white absolute right-4" />
                                </Menu.Button>
                                {isEditing ? (
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items
                                            className="w-full bg-card-bg rounded-b-md absolute z-10"
                                            style={{borderBottom: "1.7px solid yellow", marginTop: "-6px"}}
                                        >
                                            {proposalMediumoptions.map((option, index) => (
                                                <div
                                                    className="py-1"
                                                    key={option}
                                                    style={{
                                                        borderBottom:
                                                            index !== proposalMediumoptions.length - 1
                                                                ? "1px solid grey"
                                                                : "none",
                                                        margin: "0 9px",
                                                    }}
                                                >
                                                    <Menu.Item key={option}>
                                                        <ul className="pl-0">
                                                            <li
                                                                value={dropdownValues.proposalMedium}
                                                                onClick={() =>
                                                                    handleDropdownSelection("proposalMedium", option)
                                                                }
                                                                data-value={option} // Set the value using a data attribute
                                                                className="block px-1 font-poppins py-1 text-sm border-b-2 no-underline"
                                                            >
                                                                {option}
                                                            </li>
                                                        </ul>
                                                    </Menu.Item>
                                                </div>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                ) : (
                                    ""
                                )}
                            </Menu>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl pt-15 px-13 pb-24 mt-10 border-solid border-accent-color  text-white-color">
                    <div className="flex justify-between mb-4 text-30 text-white-color">
                        <div>Set Deadline</div>
                        <div className="border-lg p-1">
                            {isEditingDate ? (
                                ""
                            ) : (
                                <Image
                                    src={editIcon}
                                    alt="edit_icon"
                                    width="25"
                                    height="25"
                                    onClick={() => handleEditDates("deadlines")}
                                ></Image>
                            )}
                        </div>{" "}
                    </div>

                    <div
                        style={{
                            borderBottom: "1.7px solid yellow",
                        }}
                        className="flex pl-10 text-25 bg-card-bg rounded-md w-2/5 mb-20 text-gray-400"
                    >
                        <Image
                            src="/images/cal_Img.svg"
                            alt="calendar-icon"
                            height="33"
                            width="35"
                            className="mx-3 mt-2"
                            onClick={handleDeadlineImageClick}
                        ></Image>
                        <div className="customDatePickerWidth">
                            <DatePicker
                                className={`${styles.customDatepicker} placeholder:text-gray-400 bg-card-bg border-0 text-gray-400 ml-3`}
                                selected={isEditingDate ? editedDeadline : proposalDeadline.proposalDeadline} //  selected={isEditingDate ? editedDates[task.identifier] : dates[task.identifier]}
                                onChange={(date: Date | null) => handleEditedDeadlineChange(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                ref={dateRef}
                            />
                        </div>
                    </div>
                    <span className="text-30"> Milestone</span>

                    <div className="grid grid-cols-2 mt-10 gap-x-40 gap-y-20">
                        {tasks.map((task) => (
                            <div key={task.identifier} className="text-25 flex-1">
                                <label>{task.description}</label>
                                <div
                                    style={{
                                        borderBottom: "1.7px solid yellow",
                                    }}
                                    className="flex pl-10 text-25 bg-card-bg rounded-md w-full text-gray-400"
                                >
                                    <Image
                                        src="/images/cal_Img.svg"
                                        alt="calendar-icon"
                                        height="33"
                                        width="35"
                                        className="mt-2"
                                        onClick={() => handleImageClick(task.identifier)}
                                    />

                                    <DatePicker
                                        className={`${styles.customDatepicker} placeholder:text-gray-400 bg-card-bg border-0 ml-3 text-gray-400 `}
                                        selected={
                                            isEditingDate
                                                ? (
                                                      editedDates.find(
                                                          (dateObj) => dateObj.identifier === task.identifier
                                                      ) || {}
                                                  ).date ?? null
                                                : (
                                                      dates.find((dateObj) => dateObj.identifier === task.identifier) ||
                                                      {}
                                                  ).date ?? null
                                        }
                                        onChange={(date: Date | null) =>
                                            handleDateChange(task.identifier, date, task.description)
                                        }
                                        dateFormat="dd MMMM yyyy"
                                        placeholderText="DD/MM/YYYY"
                                        ref={datePickerRefs[task.identifier]}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl pt-15 px-13 pb-24 mt-10 border-solid border-accent-color text-white-color">
                    <div className="flex text-30 justify-between mb-4  text-white-color">
                        <div>RFP Type</div>
                        <div className="border-lg p-1">
                            {isEditingRfpType ? (
                                ""
                            ) : (
                                <Image
                                    src={editIcon}
                                    alt="edit_icon"
                                    width="25"
                                    height="25"
                                    onClick={() => handleEditRfpTypes()}
                                ></Image>
                            )}
                        </div>
                    </div>

                    <div
                        className="text-25 text-white-color py-20 relative"
                        style={{
                            width: "35vw",
                        }}
                    >
                        <label>Select the company producing the RFP</label>

                        <Menu as="div" className="block mt-1 bg-card-bg rounded-md">
                            <Menu.Button
                                className="w-full h-10 flex items-center justify-between text-gray-400 bg-card-bg rounded-md pl-10"
                                style={{
                                    border: "1.7px solid yellow",
                                    borderTop: "none",
                                    borderLeft: "none",
                                    borderRight: "none",
                                }}
                            >
                                {(isEditingRfpType ? editedCompanyName : dropdownValues.companyName || "") ||
                                    "Select Option"}
                                <ArrowDropDownIcon className="text-white absolute right-1" />
                            </Menu.Button>
                            {isEditingRfpType ? (
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        className="w-76 origin-top-right bg-card-bg rounded-b-md absolute w-full z-10"
                                        style={{borderBottom: "1.7px solid yellow", marginTop: "-6px"}}
                                    >
                                        {companyOptions.map((option, index) => (
                                            <div
                                                className="py-1"
                                                key={option}
                                                style={{
                                                    borderBottom:
                                                        index !== companyOptions.length - 1 ? "1px solid grey" : "none",
                                                    margin: "0 9px",
                                                }}
                                            >
                                                <Menu.Item key={option}>
                                                    <ul className="pl-0">
                                                        <li
                                                            value={dropdownValues.companyName}
                                                            onClick={() =>
                                                                handleDropdownSelection("companyName", option)
                                                            }
                                                            data-value={option} // Set the value using a data attribute
                                                            className="block font-poppins px-1 py-1 text-sm border-b-2 no-underline"
                                                        >
                                                            {option}
                                                        </li>
                                                    </ul>
                                                </Menu.Item>
                                            </div>
                                        ))}
                                    </Menu.Items>
                                </Transition>
                            ) : (
                                ""
                            )}
                        </Menu>
                    </div>

                    <DropdownMenu
                        label="Is it a consulting or non-consulting RFP?"
                        onDropdownChange={(option) => {
                            handleDropdownSelection("companyType", option);
                        }}
                        selectedValue={isEditingRfpType ? editedCompanyType : dropdownValues.companyType || ""}
                        name="companyType"
                        options={RFPTypeOptions}
                        readOnly={false}
                    />

                    <div
                        className="text-25 text-white-color py-20    relative"
                        style={{
                            width: "35vw",
                        }}
                    >
                        <label>What software are we offering?</label>
                        <Menu as="div" className="block mt-1 bg-card-bg rounded-md">
                            <Menu.Button
                                className="w-full h-10 flex items-center justify-between text-gray-400 bg-card-bg rounded-md pl-10"
                                style={{
                                    border: "1.7px solid yellow",
                                    borderTop: "none",
                                    borderLeft: "none",
                                    borderRight: "none",
                                }}
                            >
                                {(isEditingRfpType ? editedSoftwareName : dropdownValues.softwareName || "") ||
                                    "Select Option"}
                                <ArrowDropDownIcon className="text-white absolute right-1" />
                            </Menu.Button>
                            {isEditingRfpType ? (
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        className="w-76 origin-top-right bg-card-bg rounded-b-md absolute w-full z-10"
                                        style={{borderBottom: "1.7px solid yellow", marginTop: "-6px"}}
                                    >
                                        {editedCompanyName &&
                                            softwareOptions[editedCompanyName].map((option, index) => (
                                                <div
                                                    className="py-1"
                                                    key={option}
                                                    style={{
                                                        borderBottom:
                                                            index !== companyOptions.length - 1
                                                                ? "1px solid grey"
                                                                : "none",
                                                        margin: "0 9px",
                                                    }}
                                                >
                                                    <Menu.Item key={option}>
                                                        <ul className="pl-0">
                                                            <li
                                                                value={dropdownValues.softwareName}
                                                                onClick={() => {
                                                                    handleDropdownSelection("softwareName", option);
                                                                }}
                                                                data-value={option} // Set the value using a data attribute
                                                                className="flex font-poppins justify-between px-1 py-1 text-sm border-b-2 no-underline"
                                                            >
                                                                {option}
                                                                <Image
                                                                    src="/images/help.png"
                                                                    alt="cal"
                                                                    height={18}
                                                                    width={20}
                                                                    onClick={
                                                                        () => {
                                                                            setShowPopup(true); // Show popup window
                                                                            setPopupType(option);
                                                                        } // Show popup content for specific item
                                                                    }
                                                                />
                                                            </li>
                                                        </ul>
                                                    </Menu.Item>
                                                </div>
                                            ))}
                                    </Menu.Items>
                                </Transition>
                            ) : (
                                " "
                            )}
                        </Menu>
                    </div>
                    {/* Popup component */}
                    {showPopup && <PopupMsg onClose={onClosePopup} popupType={popupType} />}
                </div>

                <div className="rounded-xl pt-15 px-13 pb-24 mt-10 border-solid border-accent-color">
                    <div className="text-25  text-white-color">
                        <div className="flex justify-between">
                            <label>Please enter two options for the client’s name </label>
                            {isEditingClientName1 ? (
                                ""
                            ) : (
                                // <div className="border-lg p-1">
                                //     <button onClick={handleSave}>Save</button>
                                // </div>
                                <div className="border-lg p-1">
                                    <Image
                                        src={editIcon}
                                        alt="edit_icon"
                                        width="25"
                                        height="25"
                                        onClick={() => handleClientNameEdit()}
                                    ></Image>
                                </div>
                            )}
                        </div>

                        <input
                            required
                            onChange={(e) => handleChange("clientName1", e)}
                            value={isEditingClientName1 ? editedClientName1 : formData1.clientName1 || ""}
                            name="clientName1"
                            className="block mt-5 bg-card-bg rounded-md pl-10 text-gray-400"
                            style={{
                                width: "35vw",
                                height: "2rem",
                                borderBottom: "1.7px solid yellow", // Keep the borderBottom style
                                borderLeft: "none", // Set other border sides to none
                                borderRight: "none",
                                borderTop: "none",
                            }}
                            placeholder="Client's name option 1"
                        />
                        <input
                            required
                            onChange={(e) => handleChange("clientName2", e)}
                            value={isEditingClientName1 ? editedClientName2 : formData1.clientName2 || ""}
                            name="clientName2"
                            className="block mt-5 bg-card-bg rounded-md pl-10 text-gray-400"
                            style={{
                                width: "35vw",
                                height: "2rem",
                                borderBottom: "1.7px solid yellow", // Keep the borderBottom style
                                borderLeft: "none", // Set other border sides to none
                                borderRight: "none",
                                borderTop: "none",
                            }}
                            placeholder="Client's name option 2"
                        />
                    </div>
                </div>

                <div className="flex justify-between  rounded-xl">
                    <div className="rounded-xl w-5/12 mt-10 pt-15 px-13 pb-10 border-solid border-accent-color">
                        <div className="flex justify-between mb-4  text-white-color">
                            <p className="mt-5 text-25">Select the client’s colors for the RFP</p>
                            <div className="border-lg p-1 font-poppins">
                                {isEditingColor ? (
                                    ""
                                ) : (
                                    <Image
                                        src={editIcon}
                                        alt="edit_icon"
                                        width="25"
                                        height="25"
                                        onClick={() => handleEdit("companyColor")}
                                    ></Image>
                                )}
                            </div>
                        </div>
                        <DropdownMenu
                            label=""
                            options={companyColorOptions}
                            name={""}
                            selectedValue={
                                (isEditingColor ? editedCompanyColor : dropdownValues.companyColor || "") ||
                                "Select Option"
                            }
                            onDropdownChange={(option) => handleDropdownSelection("companyColor", option)}
                            // handleCompanyColorSelection("companyColor", value)}
                            readOnly={false}
                        ></DropdownMenu>

                        <div className="flex w-full gap-3 mt-10 mx-auto">
                            <div className="bg-gold rounded w-14 "></div>
                            <div className="bg-black rounded w-14"></div>
                            <div className="bg-card-bg rounded w-14"></div>
                            <div className="bg-white rounded w-14"></div>
                            <div className="bg-gradient-gold rounded w-14"></div>
                            <div className="bg-gradient-silver-border w-14 rounded p-25"></div>
                        </div>
                    </div>
                    <div className="rounded-xl w-5/12  mt-10 pt-15 px-13 pb-10 border-solid border-accent-color">
                        <div className="text-25 content-center text-white-color py-0">
                            <div className="flex justify-between mb-4  text-white-color">
                                <p className="mt-5">Select the client’s colors for the RFP</p>
                                <div className="border-lg  pt-2.5 pr-2.5">
                                    {isEditingClientColor ? (
                                        ""
                                    ) : (
                                        <Image
                                            src={editIcon}
                                            alt="edit_icon"
                                            width="25"
                                            height="25"
                                            onClick={() => handleEdit("clientColor")}
                                        ></Image>
                                    )}
                                </div>{" "}
                            </div>
                            <div className="text-10 w-300 mx-auto pt-4 text-center">
                                {
                                    <ColorSwatches
                                        onColorSelected={handleColorSelection}
                                        setImageFile={handleImageUpload}
                                    />
                                }

                                {showSwatches && clientColor && clientColor.length > 0 ? (
                                    <div className="flex justify-center mt-6">
                                        {clientColor.map((color: any, index: React.Key | null | undefined) => (
                                            <div
                                                key={index}
                                                className="rounded-lg"
                                                style={{
                                                    backgroundColor: color,
                                                    width: "50px",
                                                    height: "50px",
                                                    margin: "5px",
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl py-3 pl-12 mt-10 pb-24 border-solid border-accent-color">
                    <div className="flex text-30 justify-between mb-4  text-white-color">
                        <p>Assigned Team Members</p>
                        <div className="border-lg p-1 pr-2.5">
                            <Image src={editIcon} alt="edit_icon" width="25" height="25"></Image>
                        </div>{" "}
                    </div>
                    <div className="flex flex-wrap gap-x-5">
                        {" "}
                        {selectedItems.map((user, index) => (
                            <div key={index} className="flex flex-row justify-evenly text-xs flex-wrap mt-5">
                                <div className="px-8 py-7 bg-accent-color rounded-lg">
                                    <div className="flex flex-row px-12">
                                        <img
                                            src={user.photoURL}
                                            alt="user_icon"
                                            width="54"
                                            height="54"
                                            className="rounded-full"
                                        />
                                        <div className="block  ml-2 pt-10">
                                            <p className="text-20 text-white">{user.displayName}</p>
                                            <p className="text-15 text-gray-400 mt-1">{user.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex mt-3 text-12 justify-between">
                                        <Button
                                            style={{height: "20px"}}
                                            className="text-black border-none font-normal px-12 rounded-full bg-gradient-border"
                                            onClick={() => toggleSelectedItem(index)}
                                        >
                                            Assign Lead
                                        </Button>
                                        <Button
                                            style={{height: "20px"}}
                                            className=" border border-gray-400 text-gray-400  font-normal bg-accent-color px-12 rounded-full"
                                            onClick={() => removeTeamLead(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <OverlayComponent show={overlays.showAssignCard} onClose={() => closeOverlay("showAssignCard")}>
                        <SubmitSuccessfully message="Lead Assigned" onClose={() => closeOverlay("showAssignCard")} />
                    </OverlayComponent>
                </div>

                {/* <div className="rounded-xl py-3 px-4 mt-10 pb-12 border-solid border-accent-color">
                    <div className="flex text-30 justify-between mb-4  text-white-color">
                        <p>Attached Price Quote</p>
                        <div className="border-lg p-1">
                            <Image src={editIcon} alt="edit_icon" width="25" height="25"></Image>
                        </div>{" "}
                    </div>
                    <Button
                        className="relative px-44 py-25 flex text-white mt-16 rounded-xl border-2 bg-gradient-border"
                        type="submit"
                    >
                        <span className="text-GBCS-yellow font-normal text-20 absolute inset-0 bg-[#1a191a] flex flex-wrap content-center rounded-xl place-content-center">
                            <Image src={pdfIcon} alt="pdf_file_img" width="13" height="15"></Image>
                            <span className="pl-3">Price quote for Place holder.pdf</span>
                        </span>
                    </Button>
                </div> */}
                <div className="flex justify-end mb-10">
                    <Button
                        className="relative text-white rounded-xl border-2 mt-10 px-14 bg-gradient-border"
                        // type="submit"
                        onClick={handleSubmit}
                    >
                        <span className="text-GBCS-yellow font-normal text-15 absolute inset-0 bg-[#1a191a] flex flex-wrap content-center rounded-xl place-content-center">
                            Create
                        </span>
                    </Button>
                </div>
            </form>
        </div>
    );
};
export default ReviewForm;
