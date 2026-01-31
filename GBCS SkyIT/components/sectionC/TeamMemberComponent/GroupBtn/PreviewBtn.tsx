import React, { forwardRef, ForwardedRef, ButtonHTMLAttributes } from "react";

interface PreviewBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Добавляем onClick как часть свойств компонента
  onClick?: () => void;
}

const PreviewBtn = forwardRef(
  (props: PreviewBtnProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const { onClick, ...rest } = props;

    return (
      <div className="mb-9 relative">
        <div className="bg-gradient-border w-[135px] h-[59px] rounded-3xl"></div>

        <button
          ref={ref}
          {...rest}
          onClick={onClick}
          className="cursor-pointer border-transparent rounded-3xl text-lg bg-black text-white w-[132px] h-[57px] font-poppins absolute top-[1.1px] left-[1.5px] active:bg-gradient-border"
          type="button"
        >
          <p className="text-transparent bg-clip-text bg-gradient-text active:text-black">
            Preview
          </p>
        </button>
      </div>
    );
  }
);

PreviewBtn.displayName = "PreviewBtn";

export default PreviewBtn;
