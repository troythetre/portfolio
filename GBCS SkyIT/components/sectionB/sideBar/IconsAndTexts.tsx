import React, {useState} from "react";
import IconAndText from "./IconAndText";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import RestorePageOutlinedIcon from "@mui/icons-material/RestorePageOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import OverlayComponent from "./OverlayComponent";
import SaveCard from "./SaveCard";
import SendRFP from "../ProposalComponent/SendRFP/SendRFP";
import SendSuccessfully from "../ProposalComponent/SendRFP/SendSuccessfully";
import {useRouter} from "next/router";

interface IconsAndTextsProps {
    selectedItemIndex?: number | null;
    onThumbnailClick?: (index: number) => void;
    selectedSectionID?: string | null;
    setSelectedSectionID: React.Dispatch<React.SetStateAction<string | null>>;
}

const IconsAndTexts: React.FC<IconsAndTextsProps> = ({
    selectedItemIndex,
    onThumbnailClick,
    selectedSectionID,
    setSelectedSectionID,
}) => {
    const [activeOverlay, setActiveOverlay] = useState<number | null>(null);
    const router = useRouter();
    const {proposalID} = router.query;
    const [overlays, setOverlays] = useState<{
        showSaveCard: boolean;
        showSendCard: boolean;
        showSendSuccessCard: boolean;
    }>({
        showSaveCard: false,
        showSendCard: false,
        showSendSuccessCard: false,
    });
    const handleIconClick = (index: number) => {
        setActiveOverlay(index);
        onThumbnailClick && onThumbnailClick(index);
    };
    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({...prevOverlays, [overlayName]: !prevOverlays[overlayName]}));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({...prevOverlays, [overlayName]: false}));
    };
    const renderOverlay = (overlayName: keyof typeof overlays, component: React.ReactNode) => (
        <OverlayComponent show={overlays[overlayName]} onClose={() => closeOverlay(overlayName)}>
            {component}
        </OverlayComponent>
    );

    const handleSave = () => {
        toggleOverlay("showSaveCard");
    };

    const handleSend = () => {
        toggleOverlay("showSendCard");
    };

    const handleSubmitSendSuccess = () => {
        toggleOverlay("showSendCard");
        toggleOverlay("showSendSuccessCard");
    };

    const iconTextData = [
        {
            icon: (
                <GridViewOutlinedIcon
                    style={{fill: selectedItemIndex === 0 ? "#DEBF1A" : "#FFFFFF", fontSize: 30, strokeWidth: 1}}
                />
            ),
            text: "Thumbnail View",
            index: 0,
        },
        {
            icon: (
                <EmailOutlinedIcon
                    style={{fill: selectedItemIndex === 1 ? "#DEBF1A" : "#FFFFFF", fontSize: 30, strokeWidth: 1}}
                />
            ),
            text: "Send",
            index: 1,
            onClick: handleSend,
        },
        {
            icon: (
                <BookOutlinedIcon
                    style={{fill: selectedItemIndex === 2 ? "#DEBF1A" : "#FFFFFF", fontSize: 30, strokeWidth: 1}}
                />
            ),
            text: "Save as Template",
            index: 2,
            onClick: handleSave,
        },
        /*{
            icon: (
                <RestorePageOutlinedIcon
                    style={{fill: selectedItemIndex === 3 ? "#DEBF1A" : "#FFFFFF", fontSize: 30, strokeWidth: 1}}
                />
            ),
            text: "Restore Version",
            index: 3,
        },*/
        {
            icon: (
                <CommentOutlinedIcon
                    style={{fill: selectedItemIndex === 4 ? "#DEBF1A" : "#FFFFFF", fontSize: 30, strokeWidth: 1}}
                />
            ),
            text: "Document History",
            index: 4,
        },
        // Add more items as needed
    ];

    return (
        <>
            {iconTextData.map((item) => (
                <div
                    key={item.index}
                    className="flex items-center space-x-2"
                    onClick={() => {
                        handleIconClick(item.index);
                        item.onClick?.();
                    }}
                >
                    <IconAndText
                        icon={item.icon}
                        text={item.text}
                        color={selectedItemIndex === item.index ? "text-[#DEBF1A]" : "text-white"}
                    />
                </div>
            ))}

            {renderOverlay("showSaveCard", <SaveCard onCloseSaveCard={() => closeOverlay("showSaveCard")} />)}
            {renderOverlay(
                "showSendCard",
                <SendRFP onClose={() => closeOverlay("showSendCard")} onSubmit={handleSubmitSendSuccess} />
            )}
            {renderOverlay(
                "showSendSuccessCard",
                <SendSuccessfully onClose={() => closeOverlay("showSendSuccessCard")} />
            )}
        </>
    );
};

export default IconsAndTexts;
