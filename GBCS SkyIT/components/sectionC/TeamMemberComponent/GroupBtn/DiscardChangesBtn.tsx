import React, { forwardRef, ButtonHTMLAttributes } from "react";

interface DiscardChangesBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onDiscardChanges: () => void;
  buttonText: string;
  backgroundWidth?: string;
  mainWidth?: string;
}

const DiscardChangesBtn = forwardRef<HTMLButtonElement, DiscardChangesBtnProps>(
  ({ onDiscardChanges, buttonText, backgroundWidth = "180px", mainWidth = "180px", ...rest }, ref) => {
    return (
      <div className="mb-9 relative">
        {/* Adjusted the border width to 4px and changed the border color to yellow */}
        <div className="border-yellow-400 border-4 bg-gradient-border w-[183px] h-[52px] rounded-3xl"></div>

        <button
          ref={ref}
          {...rest}
          onClick={onDiscardChanges}
          className="cursor-pointer border-transparent rounded-3xl text-lg bg-black text-white w-[180px] h-[50px] font-poppins absolute top-[1.1px] left-[1.5px] active:bg-gradient-border"
          type="button"
        >
          <p className="text-transparent bg-clip-text bg-gradient-text active:text-black text-md">
            {buttonText}
          </p>
        </button>
      </div>
    );
  }
);

DiscardChangesBtn.displayName = "DiscardChangesBtn";

export default DiscardChangesBtn;


