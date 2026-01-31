import React, {useState} from "react";
import Thumbnail from "./Thumbnail";
import Image from "next/image";
import plus from "../../../public/images/edit-proposal/plus.svg";
import single_page from "../../../public/images/edit-proposal/single_page.svg";
import Link from "next/link";
import {useRouter} from "next/router";

interface ThumbnailViewProps {
    totalPages: number;
    setSelectedItemIndex?: React.Dispatch<React.SetStateAction<number | null>>;
}

const ThumbnailView: React.FC<ThumbnailViewProps> = ({totalPages, setSelectedItemIndex}) => {
    console.log(totalPages);
    const [currentPage, setCurrentPage] = useState<number>(0); // State to track the current page
    const router = useRouter();
    const {proposalID} = router.query;
    const handleClick = () => {
        router.push("/edit-proposal/addPage");
    };
    const handleSinglePage = () => {
        router.push({
            pathname: "/edit-proposal",
            query: {proposalID: proposalID},
        });
        if (setSelectedItemIndex) {
            setSelectedItemIndex(null);
        }

        setCurrentPage(0); // Set the current page to the first page
    };

    return (
        <div className="relative w-full">
            <div className="flex flex-col relative w-full ">
                {/* <Link href={`/edit-proposal/${proposalID}`}> */}
                <button
                    onClick={handleSinglePage}
                    //className="absolute top-3 right-14 w-[243px] h-[42px] px-[37.90px] py-[9px] rounded-[15px] border-2 border-[#B5B5B5] flex-row justify-center items-center gap-[15px] inline-flex bg-[#1A1B1E] cursor-pointer no-underline"
                    className="absolute top-3 right-14 w-[243px] h-[42px] px-[37.90px] py-[9px] rounded-[15px] border-2 border-[#B5B5B5] flex items-center gap-[15px] bg-[#1A1B1E] cursor-pointer no-underline z-10"

                >
                    <Image src={single_page} alt="icon" />
                    <p className="text-grey text-xl font-normal font-['Poppins'] leading-normal tracking-tight">
                        Single Page{" "}
                    </p>
                </button>
                {/* </Link> */}
                <div className="flex flex-wrap justify-start mt-[10%] w-full gap-5 relative z-0">
          {[...Array(totalPages)].map((_, index) => (
            <Thumbnail
              key={index}
              isActive={index === currentPage}
              onClick={() => setCurrentPage(index)}
              className="w-[165px] h-[211px] flex-shrink-0"
            />
          ))}
                {/* <div className="absolute flex flex-wrap justify-start w-full mt-[8%]">
                    {[...Array(totalPages)].map((_, index) => (
                        <Thumbnail key={index} isActive={index === currentPage} onClick={() => setCurrentPage(index)} />
                    ))} */}
                    {/* <div
                        className="flex items-center justify-center w-[165px] h-[211px] bg-gray-200 mr-7 my-5 cursor-pointer"
                        style={{
                            backgroundImage:
                                "linear-gradient(143.88deg, #EBEAEA -0.37%, #BFBFBF 38.34%, #E0E0E0 67.45%, #C3C3C3 96.8%)",
                        }}
                        onClick={handleClick}
                    >
                        <Image src={plus} alt="add page" />
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default ThumbnailView;
