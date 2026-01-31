import React from "react";
import Image from "next/image"

//Styles added
const cardStyle = {
  backgroundColor: "#fff",
  width: "275px",
  height: "361px",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  position: "relative",
  borderRadius: "10px 10px 15px 15px",
};

const insideCard = {
  height: "85px",
  width: "275px",
  backgroundColor: "#555",
  position: "absolute",
  bottom: "0px",
  borderRadius: "0px 0px 10px 10px",
};

const dotsIcon = {
  position: "absolute",
  color: "#555555",
  top: "16.8px",
  right: "18px",
};

const alarmIcon = {
  maskType: "alpha",
  height: "21px",
  width: "21px",
  position: "absolute",
  left: "14px",
  top: "14px",
};

const ellipseAlarm = {
  position: "absolute",
  top: "10px",
  left: "10px",
};

const mask = {
  maskType: "alpha",
};

const rfpName = {
  fontSize: "20px",
  color: "#fff",
  marginTop: "4px",
};

const cardInfoContainer = {
  padding: "0px 14px",
  textAlign: "left",
  position: "relative",
};

const avatar = {
  width: "35px",
  height: "35px",
};

const userInfo = {
  fontSize: "18px",
  color: "#B9B7BD",
  marginTop: "8px",
};

const userInfoContainer = {
  display: "flex",
  gap: "9px",
};

const bookmarkIcon = {
  width: "29px",
  height: "29px",
  position: "absolute",
  top: "45px",
  right: "15px",
  backgroundColor: "#2F2F2F",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
};

const placeholderImg = {
  position: "absolute",
  top: "100px",
  left: "110px",
};

const cardsData = [
  {
    name: "1",
    color: "#FF3838",
    ellipseFill: "#FFC2C2",
  },
  {
    name: "2",
    color: "#95700D",
    ellipseFill: "#F9EFBE",
  },
  {
    name: "3",
    color: "#95700D",
    ellipseFill: "#F9EFBE",
  },
  {
    name: "4",
    color: "#95700D",
    ellipseFill: "#F9EFBE",
  },
];

export default function InProgressProposals() {
  const cardSection = {
    paddingTop: "30px",
    height: "500px",
    display: "flex",
    justifyContent: "center",
    gap: "40px",
  };
  return (
    <div style={cardSection} className="App">
      {cardsData.map((card) => (
        <Proposal cardObj={card} key=""/>
      ))}
      ,
    </div>
  );
}

function Proposal({ cardObj }) {
  return (
    <div>
      <div style={cardStyle}>
        <svg
          style={placeholderImg}
          xmlns="http://www.w3.org/2000/svg"
          width="54"
          height="69"
          viewBox="0 0 16 16"
        >
          <path
            fill="#2F2F2F"
            d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71l-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0z"
          />
        </svg>
        <svg
          style={ellipseAlarm}
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            d="M29 15.0312C29 22.4554 22.7642 28.5312 15 28.5312C7.23579 28.5312 1 22.4554 1 15.0312C1 7.60709 7.23579 1.53125 15 1.53125C22.7642 1.53125 29 7.60709 29 15.0312Z"
            fill={cardObj.ellipseFill}
            stroke={cardObj.color}
            strokeWidth="2"
          />
        </svg>
        <svg
          style={alarmIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="22"
          viewBox="0 0 21 22"
          fill="none"
        >
          <mask
            style={mask}
            id="mask0_4218_18287"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="21"
            height="22"
          >
            <rect y="0.53125" width="21" height="21" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_4218_18287)">
            <path
              d="M10.5023 19.7836C9.40859 19.7836 8.38412 19.5758 7.42891 19.1602C6.4737 18.7445 5.64245 18.1831 4.93516 17.4758C4.22786 16.7685 3.66641 15.9372 3.25078 14.982C2.83516 14.0268 2.62734 13.0023 2.62734 11.9086C2.62734 10.8148 2.83516 9.79037 3.25078 8.83516C3.66641 7.87995 4.22786 7.0487 4.93516 6.34141C5.64245 5.63411 6.4737 5.07266 7.42891 4.65703C8.38412 4.24141 9.40859 4.03359 10.5023 4.03359C11.5961 4.03359 12.6206 4.24141 13.5758 4.65703C14.531 5.07266 15.3622 5.63411 16.0695 6.34141C16.7768 7.0487 17.3383 7.87995 17.7539 8.83516C18.1695 9.79037 18.3773 10.8148 18.3773 11.9086C18.3773 13.0023 18.1695 14.0268 17.7539 14.982C17.3383 15.9372 16.7768 16.7685 16.0695 17.4758C15.3622 18.1831 14.531 18.7445 13.5758 19.1602C12.6206 19.5758 11.5961 19.7836 10.5023 19.7836ZM12.9523 15.5836L14.1773 14.3586L11.3773 11.5586V7.53359H9.62734V12.2586L12.9523 15.5836ZM4.90234 2.58984L6.12734 3.81484L2.40859 7.53359L1.18359 6.30859L4.90234 2.58984ZM16.1023 2.58984L19.8211 6.30859L18.5961 7.53359L14.8773 3.81484L16.1023 2.58984Z"
              fill="#FF3838"
            />
            <path
              d="M10.5023 19.7797C9.40859 19.7797 8.38412 19.5719 7.42891 19.1563C6.4737 18.7406 5.64245 18.1792 4.93516 17.4719C4.22786 16.7646 3.66641 15.9333 3.25078 14.9781C2.83516 14.0229 2.62734 12.9984 2.62734 11.9047C2.62734 10.8109 2.83516 9.78646 3.25078 8.83125C3.66641 7.87604 4.22786 7.04479 4.93516 6.3375C5.64245 5.63021 6.4737 5.06875 7.42891 4.65313C8.38412 4.2375 9.40859 4.02969 10.5023 4.02969C11.5961 4.02969 12.6206 4.2375 13.5758 4.65313C14.531 5.06875 15.3622 5.63021 16.0695 6.3375C16.7768 7.04479 17.3383 7.87604 17.7539 8.83125C18.1695 9.78646 18.3773 10.8109 18.3773 11.9047C18.3773 12.9984 18.1695 14.0229 17.7539 14.9781C17.3383 15.9333 16.7768 16.7646 16.0695 17.4719C15.3622 18.1792 14.531 18.7406 13.5758 19.1563C12.6206 19.5719 11.5961 19.7797 10.5023 19.7797ZM12.9523 15.5797L14.1773 14.3547L11.3773 11.5547V7.52969H9.62734V12.2547L12.9523 15.5797ZM4.90234 2.58594L6.12734 3.81094L2.40859 7.52969L1.18359 6.30469L4.90234 2.58594ZM16.1023 2.58594L19.8211 6.30469L18.5961 7.52969L14.8773 3.81094L16.1023 2.58594Z"
              fill={cardObj.color}
            />
          </g>
        </svg>
        <svg
          style={dotsIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="9"
          viewBox="0 0 44 9"
          fill="none"
        >
          <circle cx="4" cy="4.29688" r="4" fill="#555555" />
          <circle cx="22" cy="4.29688" r="4" fill="#555555" />
          <circle cx="40" cy="4.29688" r="4" fill="#555555" />
        </svg>
        <CardBottom name={cardObj.name} />
      </div>
    </div>
  );
}

function CardBottom(props) {
  return (
    <div style={insideCard}>
      <div style={cardInfoContainer}>
        <p style={rfpName}>RFP name{props.name}</p>
        <div style={userInfoContainer}>
          <Image style={avatar} src="./Avatar.png" alt="img" />
          <p style={userInfo}>Tom &#183; 3d ago</p>
        </div>
        <button style={bookmarkIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="20"
            viewBox="0 0 512 512"
          >
            <path
              fill="#FFB509"
              stroke="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
              d="M352 48H160a48 48 0 0 0-48 48v368l144-128l144 128V96a48 48 0 0 0-48-48Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
