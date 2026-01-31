import { IoSearchSharp, IoClose } from "react-icons/io5";
import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import styles from "./teamSelection.module.css";
import { BASEURL } from "../../../../constants";
import { TeamMember } from "../FormDataContext";

interface SearchBarProps {
    setResults: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    userName: string;
}

interface User {
    userEmail: any;
    displayName: any;
    name: string;
    email: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ setResults, userName }) => {
    const [input, setInput] = useState("");
    const [enteredVal, setEnteredVal] = useState("");

    useEffect(() => {
        // Update enteredVal when userName changes
        setEnteredVal(userName);
    }, [userName]);

    const [loading, setLoading] = useState(false);
    let debounceTimeout: NodeJS.Timeout;

    const fetchData = async (value: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASEURL}/api/proposal/all-users`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();

            if (Array.isArray(jsonData)) {
                const lowerCaseValue = value.toLowerCase();
                const results = jsonData.filter(
                    (user: User) =>
                        user.displayName.toLowerCase().includes(lowerCaseValue) ||
                        user.userEmail.toLowerCase().includes(lowerCaseValue)
                );

                const limitedResults = results.slice(0, 10);
                setResults(limitedResults);
            } else {
                console.error("Invalid data format", jsonData);
                setResults([]);
            }
        } catch (error) {
            console.error("Fetch data error", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (value: string) => {
        setEnteredVal(value);
        clearTimeout(debounceTimeout);
        if (value === "") {
            setInput("");
        } else {
            setInput(value);
            debounceTimeout = setTimeout(() => fetchData(value), 200);
        }
    };

    const clearInput = () => {
        setInput("");
        setEnteredVal("");
        setResults([]);
    };

    return (
        <div className="relative">
            <Input
                size="medium"
                className={`${styles.input} text-gray-400 placeholder:text-gray-400 text-25 mt-5 rounded-lg w-4/5 border-solid border-2 border-yellow-400 border-t-0 border-r-0 border-l-0 bg-zinc-800`}
                placeholder="Search members by name or email"
                id="input-with-icon-adornment"
                value={enteredVal}
                type="text"
                fontSize="25px"
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Backspace" && !input) {
                        clearInput();
                    }
                }}
                startAdornment={
                    <InputAdornment position="start" id="search-icon">
                        <IoSearchSharp
                            className="pl-4"
                            style={{
                                color: "white",
                                height: "30px",
                                width: "25px",
                            }}
                        />
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        {input && (
                            <IconButton onClick={clearInput} className="text-white" size="small">
                                <IoClose />
                            </IconButton>
                        )}
                    </InputAdornment>
                }
            />{" "}
        </div>
    );
};
