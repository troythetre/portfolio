// BackToTopButton.jsx
import React, { useEffect, useState } from "react";
import styles from "components/sectionC/universal.view.module.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

    

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
  
      if (scrolled > document.body.offsetHeight - window.innerHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    // Cleanup the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`${styles.backToTopButton} cursor-pointer ${
        isVisible ? "block" : "hidden"
      } rounded-full`}
      onClick={scrollToTop}
    >
      <div className="flex gap-1">
        <ArrowUpwardIcon className=" text-yellow-400" 
          sx={{
            fontSize: 15,
          }}
        />
        <p className={`${styles.backToTopButtonText} text-xs text-yellow-400 `}> Back to Top</p>
      </div>
    </button>
  );
};

export default BackToTopButton;
