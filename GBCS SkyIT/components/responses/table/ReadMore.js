import React, { useState } from 'react';

const ReadMore = ({ text, maxLength ,checkedRows}) => {
  const [isReadMore, setIsReadMore] = useState(false);
  
  // Toggle the read more/less state
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <div>
      {isReadMore ? text : text.slice(0, maxLength)}
      {text.length > maxLength && (
        <button onClick={toggleReadMore} className={checkedRows?"text-yellow-700 border-transparent bg-transparent cursor-pointer":"text-yellow-400 border-transparent bg-transparent cursor-pointer" }>
          {isReadMore ? '...read less' : '...read more'}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
