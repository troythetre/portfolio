import React from "react";

// Define a type for the props that the component expects
type ProgressBarProps = {
  accepted: number;
  underReview: number;
  rejected: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  accepted,
  underReview,
  rejected,
}) => {
  const total = accepted + underReview + rejected;
  const acceptedWidth = (accepted / total) * 100 || 1;
  const underReviewWidth = (underReview / total) * 100 || 1 ;
  const roundUp = (num: number) => Math.ceil(num * 100) / 100;
  const rejectedWidth = (rejected / total) * 100 || 1;

  return (
    <div>
      <div className="h-[213.30px] relative">
        <div className="text-white text-2xl font-normal font-['Poppins'] leading-10 tracking-tight">
          Success Rate
        </div>

        <div className="flex flex-row translate-y-1 ">
          <div
            style={{ width: `${acceptedWidth}%` }}
            className="h-6 bg-gradient-to-r from-green-600 z-20  to-green-300 rounded-l-[20px]"
          />
          <div
            style={{ width: `${underReviewWidth}%` }}
            className="h-6 bg-gradient-to-r from-yellow-500 z-10 to-white"
          />
          <div
            style={{ width: `${rejectedWidth}%` }}
            className="h-6 bg-gradient-to-r from-red-500 to-red-200 rounded-r-[20px]"
          />
          <div className="text-white pl-20 text-2xl font-normal font-['Inter'] leading-tight tracking-tight">
            {(roundUp(accepted / total)*100) + "%"}
          </div>
        </div>

        <div className="w-[60px] h-6 left-[226px] top-[102.30px] absolute bg-green-600 rounded-[20px]" />
        <div className="w-[60px] h-6 left-[145px] top-[148.30px] absolute bg-yellow-500 rounded-[20px]" />
        <div className="w-[60px] h-6 left-[211px] top-[189.30px] absolute bg-red-500 rounded-[20px]" />
        <div className="left-[2.08px] top-[104.30px] absolute text-zinc-400 text-xl font-normal font-['Poppins'] leading-tight">
          Accepted Proposals:{" "}
        </div>
        <div className="left-[249px] top-[104.30px] absolute text-black text-xl font-medium font-['Poppins'] leading-tight">
          {accepted}
        </div>
        <div className="left-[172px] top-[150.30px] absolute text-black text-xl font-medium font-['Poppins'] leading-tight">
          {underReview}
        </div>
        <div className="left-[235px] top-[191.30px] absolute text-black text-xl font-medium font-['Poppins'] leading-tight">
          {rejected}
        </div>
        <div className="left-[2px] top-[148.30px] absolute text-zinc-400 text-xl font-normal font-['Poppins'] leading-tight">
          Under review:{" "}
        </div>
        <div className="left-[2px] top-[191.30px] absolute text-zinc-400 text-xl font-normal font-['Poppins'] leading-tight">
          Rejected Proposals:{" "}
        </div>
      </div>
      {/* <div className="text-white text-3xl font-normal font-['Poppins'] leading-10 tracking-tight">
        Success Rate
      </div> */}

      {/* <div style={{ display: "flex", height: "20px" }}>
        <div
          style={{
            width: `${acceptedWidth - 5}%`,
            background: "linear-gradient(90deg, #00B94A 0%, #88FAB6 99.81%)",
            borderRadius: "10px 0 0 10px",
          }}
        />
        <div
          style={{
            width: `${underReviewWidth - 5}%`,
            background: "linear-gradient(90deg, #FFB800 0%, #FFFFFF 99.81%)",
          }}
        />
        <div
          style={{
            width: `${rejectedWidth - 5}%`,
            background: "linear-gradient(90deg, #FF2F2F 0%, #FFC1C1 99.81%)",
            borderRadius: "0 10px 10px 0",
          }}
        />
        <div style={{ position: "absolute", right: 100, fontWeight: "bold" }}>
          {successRate}%
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        <div style={{ marginBottom: "5px" }}>
          <span>Accepted Proposals: </span>
          <span style={{ fontWeight: "bold" }}>
            <svg
              width="60"
              height="24"
              viewBox="0 0 60 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="60" height="24" rx="12" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="0"
                  y1="12"
                  x2="60"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00B94A" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="black"
                fontSize="15"
              >
                {accepted}
              </text>
            </svg>
          </span>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <span>Under review: </span>
          <span style={{ fontWeight: "bold" }}>
            <svg
              width="60"
              height="24"
              viewBox="0 0 60 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="60"
                height="24"
                rx="12"
                fill="url(#paint0_linear_5820_3729)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_5820_3729"
                  x1="0"
                  y1="12"
                  x2="60"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFB801" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="black"
                fontSize="15"
              >
                {underReview}
              </text>
            </svg>
          </span>
        </div>
        <div>
          <span>Rejected Proposals: </span>
          <span style={{ fontWeight: "bold" }}>
            <svg
              width="60"
              height="24"
              viewBox="0 0 60 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="60"
                height="24"
                rx="12"
                fill="url(#paint0_linear_5820_3731)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_5820_3731"
                  x1="0"
                  y1="12"
                  x2="60"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF4949" />
                </linearGradient>
              </defs>
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="black"
                fontSize="15"
              >
                {rejected}
              </text>
            </svg>
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default ProgressBar;
