import React, { forwardRef, ForwardedRef, ButtonHTMLAttributes } from "react";

interface OpenBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Добавляем onClick как часть свойств компонента
  // onClick?: () => void;
  buttonText: string;
  backgroundWidth?: string;
  mainWidth?: string;
}

const ReuseBtn = forwardRef(
  (
    {
      buttonText,
      backgroundWidth = "125px", // Default background width
      mainWidth = "122px", // Default main width
      ...rest
    }: OpenBtnProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <div className="mb-4 relative">
        <div
        style={{ width: backgroundWidth, height: '50px' }}
          className={`bg-gradient-border  rounded-3xl`}
        ></div>

      <button
          ref={ref}
          {...rest}
          className={`cursor-pointer border-transparent rounded-3xl text-lg bg-primary-gbcs-black text-white w-[${mainWidth}] h-[45px] font-poppins absolute top-[1.1px] left-[1.5px] active:bg-gradient-border`}
          type="button"
        >
          <p className="text-transparent bg-clip-text bg-gradient-text active:text-black">
            {buttonText}
          </p>
        </button>
      </div>
    );
  }
);

ReuseBtn.displayName = "OpenBtn";

export default ReuseBtn;
