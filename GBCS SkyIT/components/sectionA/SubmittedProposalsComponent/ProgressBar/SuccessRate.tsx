import { FC } from "react";
import styles from "./styles.module.css";
const SuccessRate: FC = () => {
  const sections = [
    {
      label: "Accepted Proposals",
      value: 0,
      gradient: "linear-gradient(90deg, #00B94A 0%, #88FAB6 99.81%)",
    },
    {
      label: "Under review",
      value: 1,
      gradient: "linear-gradient(90deg, #FFB800 99.8%, #FFF 99.81%)",
    },
    {
      label: "Rejected Proposals",
      value: 0,
      gradient: "linear-gradient(0deg, #FF4949 0%, #FF4949 100%)",
    },
  ];
  // Calculate the total amount value
  const totalValue = sections.reduce((acc, section) => acc + section.value, 0);
  // Calculate the percentage
  const percentage = (sections[0].value / totalValue) * 100;
  return (
    <div className="pt-4 pb-7">
      <h2 className={`p-0 m-0 pb-6 text-3xl ${styles.text_font}`}>
        Success Rate
      </h2>
      <div className="flex items-center pb-5">
        <div className="w-full h-6 relative overflow-hidden rounded-full">
          {sections.map((section, index) => (
            <div
              key={index}
              className="h-full absolute first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${(section.value / totalValue) * 100}%`,
                background: section.gradient,
                left: `${sections
                  .slice(0, index)
                  .reduce(
                    (acc, sec) => acc + (sec.value / totalValue) * 100,
                    0
                  )}%`,
              }}
            ></div>
          ))}
        </div>
        <div
          className={`ml-9 font-normal text-2xl text-[#FFFFFF] ${styles.percent_font}`}
        >{`${percentage.toFixed()}%`}</div>
      </div>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex items-center text-xl mb-6 last:mb-0 ${styles.text_font}`}
        >
          <p className=" text-[#B5B5B5] mr-5">{section.label}:</p>
          <p
            className=" rounded-full px-6 text-[#FFFFFF]"
            style={{ background: section.gradient }}
          >
            {section.value}
          </p>
        </div>
      ))}
    </div>
  );
};
export default SuccessRate;