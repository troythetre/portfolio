import React from "react";
import Image from "next/image";
const PopupMsg = ({onClose, popupType}: {onClose: () => void; popupType: string}) => {
    const getPopupContent = () => {
        switch (popupType) {
            case "Lokomotive +":
                return (
                    <>
                        <span>
                            Lokomotive is the world’s only full life-cycle fleet management software that integrates
                            with all aspects of your fleet management operations (Such as GPS Tracking and Maintenance).
                            Small Business or Large, you can take advantage of Lokomotive for:
                            <ul>
                                <br></br>
                                <li>Truck Fleet Management</li>
                                <br></br>
                                <li>Train Fleet Management</li>
                                <br></br>
                                <li>Bus Fleet Management</li>
                                <br></br>
                                <li>Vehicle Fleet Management</li>
                                <br></br>
                                <li>Construction Fleet Management</li>
                                <br></br>
                                <li>Electric Vehicle (EV) Fleet Management</li>
                            </ul>
                        </span>
                    </>
                );

            case "Aukai +":
                return (
                    <>
                        <span>
                            Aukai will empower your marine fleet operations as a full life cycle marine fleet management
                            software. You can utilize the Aukai fleet management platform for:
                            <ul>
                                {" "}
                                <br></br>
                                <li>Marine Fleet Management</li>
                                <br></br>
                                <li>Ship and Vessels Fleet Management</li>
                                <br></br>
                                <li>Port Equipment Fleet Management</li>
                                <br></br>
                            </ul>
                        </span>
                    </>
                );

            case "Orion +":
                return (
                    <>
                        <span>
                            Manage your aircraft&apos;s lifecycle from cradle to grave under the same umbrella. Let us
                            help you achieve your aviation dreams and write the next chapter in your fleet&apos;s story.
                            Orion is best for:
                            <ul>
                                <br></br>
                                <li>Private Jet Management</li>
                                <br></br>
                                <li>Drone Fleet Management</li>
                                <br></br>
                                <li>Aircraft Management</li>
                                <br></br>
                                <li>Aviation Asset Management</li>
                            </ul>
                        </span>
                    </>
                );

            default:
                return <p>Unknown Popup Type</p>;
        }
    };

    return (
        <div
            className="fixed inset-0 flex justify-center  items-center bg-opacity-25 backdrop-blur-2xl"
            onClick={() => onClose()}
        >
            <div className="p-8 bg-primary-gbcs-black max-w-[800px] mx-auto h-[80vh] flex flex-col relative">
                <Image
                    src="/close.svg"
                    alt="close"
                    className=" mt-0 mr-0  place-self-end bg-primary-gbcs-black"
                    onClick={onClose}
                    height={40}
                    width={40}
                />

                {/* Get content        */}
                <div className="font-lg text-2xl text-white items-center text-justify overflow-hidden">
                    {getPopupContent()}
                </div>
            </div>
        </div>
    );
};
export default PopupMsg;
