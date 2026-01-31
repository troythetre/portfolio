// import React from "react";

// function HeaderDash(){

//   return(
//     <>
//       <div className="flex justify-end text-white ">
//         <div className="w-80 "></div>
//         <p className="pr-[12rem] ">Due</p>
//         <p className="pr-[17rem]">Status</p>
//         <p className="pr-[21rem] ">Last Edited</p>
//         {/* <div className="w-80 ml-14"></div> */}
//       </div>
//       <hr />
//     </>
//   )
// }

// export default HeaderDash;

import React from "react";

function HeaderDash() {
    return (
        <>
            <div className="flex mt-4 text-white">
                <div className="w-3/12 ml-4 md:ml-4"></div>
                <div className="flex justify-between w-full px-8">
                    <div className=" text-center ml-8 md:ml-14">Due</div>
                    <div className=" text-center ml-0 md:ml-14">Status</div>
                    <div className=" text-center ml-0 md:ml-16">Last Edited</div>
                    <div className=" "></div>
                </div>
            </div>
            <hr />
        </>
    );
}

export default HeaderDash;
