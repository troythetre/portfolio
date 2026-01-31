import { useEffect, useRef, useState } from "react";
import { Button } from "@mantine/core";
import FeedbackPopup from "./FeedbackForm";

const FeedbackButton = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showArrow, setShowArrow] = useState<boolean>(true);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedDropdown = target instanceof HTMLElement && target.closest(".mantine-Select-dropdown");
      const clickedButton = buttonRef.current?.contains(target);
      const clickedPopup = popupRef.current?.contains(target);

      if (!clickedPopup && !clickedDropdown && !clickedButton) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setShowPopup(prev => !prev)}
        onMouseOver={() => setShowArrow(false)}
        onMouseLeave={() => setShowArrow(true)}
        style={{
          position: "fixed",
          bottom: 40,
          right: 0,
          transformOrigin: "right center",
          zIndex: 1000,
          borderRadius: 0,
          overflow: "hidden",
          transition: "width 0.3s ease, background-color 0.3s ease",
          width: showArrow === true ? 40 : 120,
          padding: "8px",
        }}
        color="green"
        size="md"
        variant="filled"
        aria-label="Open feedback form"
      >
        <span
          style={{
            display: "inline-block",
            transition: "opacity 0.3s ease",
            opacity: showArrow === true ? 0 : 1,
            width: showArrow === true ? 0 : "auto",
          }}
        >
          {showArrow === true ? "" : "Feedback"}
        </span>
        {showArrow === true && (
          <span
            style={{
              fontSize: "1.2rem",
              transition: "opacity 0.3s ease",
              opacity: 1,
            }}
          >
            ⮜
          </span>
        )}
      </Button>

      {showPopup && (
          <div ref={popupRef}>
            <FeedbackPopup onClose={() => setShowPopup(false)} />
          </div>
      )}
    </>
  );
};

export default FeedbackButton;
