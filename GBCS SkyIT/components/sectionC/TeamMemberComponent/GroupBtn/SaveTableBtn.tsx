import React, { forwardRef, ButtonHTMLAttributes } from "react";

interface SaveTableBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onSaveTable: () => void;
  buttonText: string;
  backgroundWidth?: string;
  mainWidth?: string;
}

const SaveTableBtn = forwardRef<HTMLButtonElement, SaveTableBtnProps>(
  ({ onSaveTable, buttonText, backgroundWidth = "180px", mainWidth = "180px", ...rest }, ref) => {
    return (
      <div className="mb-9 relative">
        {/* Adjusted the border width to 4px and changed the border color to yellow */}
        <div className="border-yellow-400 border-4 bg-gradient-border w-[183px] h-[52px] rounded-3xl"></div>

        <button
          ref={ref}
          {...rest}
          onClick={onSaveTable}
          className="cursor-pointer border-transparent rounded-3xl text-lg bg-black text-white w-[180px] h-[50px] font-poppins absolute top-[1.1px] left-[1.5px] active:bg-gradient-border"
          type="button"
        >
          <p className="text-transparent bg-clip-text bg-gradient-text active:text-black text-lg">
            {buttonText}
          </p>
        </button>
      </div>
    );
  }
);

SaveTableBtn.displayName = "SaveTableBtn";

export default SaveTableBtn;
