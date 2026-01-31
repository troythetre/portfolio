import React, { FC, useState } from "react";

interface ReadMoreProps {
  text: string;
  maxLength: number;
  checkedRows?: boolean;
}

const ReadMore: FC<ReadMoreProps> = ({ text, maxLength, checkedRows }) => {
  const [isReadMore, setIsReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div>
      {isReadMore ? text : text.slice(0, maxLength)}
      {text.length > maxLength && (
        <button
          onClick={toggleReadMore}
          className={
            checkedRows
              ? "text-yellow-700 border-transparent bg-transparent cursor-pointer"
              : "text-yellow-400 border-transparent bg-transparent cursor-pointer"
          }
        >
          {isReadMore ? "...read less" : "...read more"}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
