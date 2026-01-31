import React, {useEffect, useState} from "react";
import Image from "next/image";

interface RfpTemplate {
    coverImage: any;
    image: string;
}

interface RfpTemplateProps {
    template: RfpTemplate;
    data: any;
    updateSavedState: (saved: boolean) => void;
}

const RFPTemplate: React.FC<RfpTemplateProps> = ({template, data, updateSavedState}) => {
    const image = template.coverImage.blobUrl;
    const [saved, setSaved] = useState(false);

    const toggle = () => {
        setSaved((prevSaved) => {
            const newSaved = !prevSaved;
            updateSavedState(newSaved);
            return newSaved;
        });
    };

    const width = 240; // smaller width
    const height = (width * 361) / 275; 
    return (
        <div className="pl-16 pr-16 pt-4 pb-14">
            <div className="relative bg-white" style={{width: `${width}px`, height: `${height}px`}}>
                <Image
                    src={image}
                    alt="RFP Image"
                    layout="fill" // This will make the image fill the container while maintaining aspect ratio
                    objectFit="cover" // Change to "contain" if you want to see the whole image without cutting
                />
                {/* clickable icon */}
                <div
                    className={`absolute top-4 right-3 w-[46.10px] h-[44.34px] ${
                        saved ? "bg-gradient-gold-gbcs" : "bg-white"
                    } border-solid border-2 border-neutral-400 rounded-full`}
                    onClick={toggle}
                ></div>
            </div>
        </div>
    );
};

export default RFPTemplate;
