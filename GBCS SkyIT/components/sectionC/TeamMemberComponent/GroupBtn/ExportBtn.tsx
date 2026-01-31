import React, { forwardRef, ForwardedRef, ButtonHTMLAttributes } from "react";

interface ExportBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // 
  onClick?: () => void;
}

const ExportBtn = forwardRef(
  (props: ExportBtnProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const { onClick, ...rest } = props;

    return (
      <div className="mb-9 relative">
        <div className="bg-gradient-border w-[135px] h-[52px] rounded-3xl"></div>

        <button
          ref={ref}
          {...rest}
          onClick={onClick}
          className="cursor-pointer border-transparent rounded-3xl text-lg bg-black text-white w-[132px] h-[50px] font-poppins absolute top-[1.1px] left-[1.5px] active:bg-gradient-border"
          type="button"
        >
          <p className="text-transparent bg-clip-text bg-gradient-text active:text-black">
            Export
          </p>
        </button>
      </div>
    );
  }
);

ExportBtn.displayName = "ExportBtn";

export default ExportBtn;