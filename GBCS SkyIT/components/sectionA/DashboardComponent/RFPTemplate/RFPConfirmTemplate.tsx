import React, {useState} from "react";
import Image from "next/image";

interface RfpConfirmTemplate {
    coverImage: any;
    image: string;
}

interface RfpTemplateProps {
    rfpTemplate: RfpConfirmTemplate;
}

const RFPConfirmTemplate: React.FC<RfpTemplateProps> = (rfpTemplate) => {
    const image = rfpTemplate.rfpTemplate.coverImage.blobUrl;

    const [saved, setSaved] = useState(false);

    const toggle = () => setSaved(!saved);

    // Adjust the size here by changing these values
    const width = 240;
    const height = (width * 361) / 275; // height adjusted to maintain the ratio

    return (
        <div className="pl-16 pr-16 pt-4 pb-14">
            <div className="relative" style={{width: `${width}px`, height: `${height}px`}}>
                <Image
                    src={image}
                    alt="RFP Image"
                    layout="fill" // This will make the image fill the container while maintaining aspect ratio
                    objectFit="cover" // Change to "contain" if you want to see the whole image without cutting
                />
            </div>
        </div>
    );
};

export default RFPConfirmTemplate;
