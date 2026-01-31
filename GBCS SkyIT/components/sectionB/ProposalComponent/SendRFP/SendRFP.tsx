import React, { useState } from "react";

interface SendRPFProps {
    onClose: () => void;
    onSubmit: () => void;
}

const SendRFP: React.FC<SendRPFProps> = ({ onClose, onSubmit }) => {
    const initialFormData = {
        email: "",
        note: "Hello <name>, I have created this proposal for <topic>. Please reach out for further detail. Thank you."
    };
    const [formData, setFormData] = useState(initialFormData);

    //handel input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    //send form
    const handelSend = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormData(initialFormData);
        onSubmit();
    }

    return (
        <>
         <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col justify-center mx-auto rounded box-border  p-5 bg-[#555555] w-597 font-poppins">
                <h4 className="text-zinc-100 font-normal text-25 my-5 pl-[10px]">Send RFP Name</h4>
                <form className="flex flex-col w-[95%] self-center m-3" onSubmit={handelSend} action="submit">
                    <div className="relative z-0 w-full h-10 rounded-lg shadow-xl bg-gradient-gold-gbcs">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="absolute -mt-0.5 z-10 w-full h-10 pl-5 text-gray-color text-lg font-medium leading-10 tracking-tight bg-accent-color rounded-lg  border-none justify-start items-center gap-2.5 inline-flex focus:outline-none "
                            required
                            placeholder="Add email address" />
                    </div>
                    <div className="relative z-0 w-full h-10 rounded-lg shadow-xl bg-gradient-gold-gbcs mt-4">
                        <input
                            type="text"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            className="absolute -mt-0.5 z-10 w-full h-10 pl-5 text-gray-color text-lg font-medium  leading-10 tracking-tight bg-accent-color rounded-lg  border-none justify-start items-center gap-2.5 inline-flex"
                            placeholder="Note" />
                    </div>
                    <div className="mt-20 flex flex-row justify-between">
                        <div className="relative bg-gradient-border rounded-lg p-0.5">
                            <div className="bg-accent-color w-[106px] h-[33px] rounded-lg"></div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer border-transparent rounded-lg bg-accent-color w-full font-poppins absolute top-[1px] right-[1px] text-center text-transparent bg-gradient-border bg-clip-text text-lg font-normal"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="relative bg-gradient-border rounded-lg p-0.5">
                            <div className="bg-accent-color w-[106px] h-[33px] rounded-lg"></div>
                            <button
                                type="submit"

                                className="cursor-pointer border-transparent rounded-lg bg-accent-color w-full font-poppins absolute top-[1px] right-[1px] text-center text-transparent bg-gradient-border bg-clip-text text-lg font-normal"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </form>
            </div >
            </div>
        </>
    )
};

export default SendRFP;