import React, { useState, useEffect, useRef, useCallback } from "react";
import { BASEURL } from "../../../constants";
import { toPng } from "html-to-image";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";

interface ThumbnailProps {
    onClick: () => void;
    isActive: boolean;
}
interface Section {
    sectionTitle: string;
    content: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ onClick, isActive }) => {
    const router = useRouter();
    const { proposalID } = router.query;
    const [loading, setLoading] = useState(true); // Add loading state
    const [sections, setSections] = useState<Section[]>([]);
    const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Function to fetch sections data
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/get-all-sections/${proposalID}`, {
                method: "GET",
                credentials: "include",
            });
            const jsonData = await response.json();
            setSections(jsonData.sections);
            console.log(jsonData);
        } catch (error) {
            console.error("Fetch error", error);
        }
    }, [proposalID]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        // Update refs when sections change
        thumbnailRefs.current = Array(sections.length)
            .fill(null)
            .map((_, index) => thumbnailRefs.current[index]);
    }, [sections]);

    // Generate thumbnails with debounced function
    const generateThumbnails = useCallback(async () => {
        for (let i = 0; i < sections.length; i++) {
            const { content } = sections[i]; // Destructure content from each section
            const ref = thumbnailRefs.current[i];
            if (!ref) continue;

            ref.innerHTML = "";

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content; // Use content from each section

            tempDiv.querySelectorAll('[contenteditable="true"]').forEach((element) => {
                element.removeAttribute("contenteditable");
            });

            while (tempDiv.firstChild) {
                ref.appendChild(tempDiv.firstChild);
            }

            try {
                const dataUrl = await toPng(ref);
                console.log(dataUrl);
                if (dataUrl) {
                    const img = new Image();
                    img.src = dataUrl;
                    img.width = 165;
                    img.height = 211;
                    ref.innerHTML = "";
                    ref.appendChild(img);
                } else {
                    console.log("Data URL is empty");
                }
            } catch (error) {
                console.error("Error generating PNG:", error);
            }
        }
    }, [sections]);

    const debouncedGenerateThumbnails = useCallback(debounce(generateThumbnails, 500), [generateThumbnails]);

    useEffect(() => {
        debouncedGenerateThumbnails();
        return () => {
            debouncedGenerateThumbnails.cancel(); // Cancel debounced function on unmount
        };
    }, [sections, debouncedGenerateThumbnails]);

    return (
        <div className="flex flex-row items-center justify-center my-5 cursor-pointer">
            {sections.map((section, index) => (
                <div className="flex flex-col justify-center" key={index}>
                    <div key={index} ref={(el) => (thumbnailRefs.current[index] = el)} className="relative mr-7" />
                    <div className="text-white font-poppins text-xs pt-3 ml-4">
                        {index + 1} - {section.sectionTitle}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Thumbnail;
