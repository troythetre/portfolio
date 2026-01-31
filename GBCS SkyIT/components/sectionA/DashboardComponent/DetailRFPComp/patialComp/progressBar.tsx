import React, {useEffect, useState} from "react";
import {BASEURL} from "../../../../../constants";
import {getDate} from "date-fns";

interface ProgressBarProps {
    deadlineDate: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({deadlineDate}) => {
    const [percentage, setPercentage] = useState(0);
    const [color, setColor] = useState("green");
    const [showOverdue, setShowOverdue] = useState(false);
    const [daysLeft, setDaysLeft] = useState(0);

    const calculatePercentage = (deadlineDate: string) => {
        if (deadlineDate) {
            const currentDate = new Date();
            const deadline = new Date(deadlineDate);
            const totalMilliseconds = deadline.getTime() - currentDate.getTime();
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const daysRemaining = Math.ceil(totalMilliseconds / millisecondsPerDay);
            const percent = Math.max(0, Math.min(100, (daysRemaining / 30) * 100)); // Cap percentage between 0 and 100
            setPercentage(percent);
            setColor(daysRemaining <= 4 ? "red" : "green");
            setShowOverdue(daysRemaining <= 2);
            setDaysLeft(daysRemaining);
        }
    };

    useEffect(() => {
        calculatePercentage(deadlineDate);
    }, [deadlineDate]);

    return (
        <>
            <div className="flex gap-2 items-center">
                <div className="w-20 md:w-52 h-4 rounded-full relative bg-white">
                    {showOverdue && (
                        <span className="text-sm absolute font-semibold -mt-[3px] z-10 top-0 left-1/2 transform -translate-x-1/2 uppercase">
                            overdue
                        </span>
                    )}
                    <div
                        className={`relative h-full rounded-full ${
                            color === "green"
                                ? "bg-gradient-to-r from-green-600 via-green-600 to-green-100"
                                : "bg-gradient-status-red"
                        }`}
                        // className="h-full rounded-full bg-gradient-to-r from-green-600 via-green-600 to-green-100"
                        style={{width: color === "red" ? "100%" : `${percentage}%`}}
                        // style={{width: color === "red" ? (daysLeft <= 4 ? `${percentage}%` : "100%") : `${percentage}%`}}
                    ></div>
                </div>
                <p>
                    {color === "red" ? (daysLeft <= 4 ? `${percentage.toFixed(0)}%` : "100%") : `${percentage.toFixed(0)}%`}
                </p>
            </div>
        </>
    );
};

export default ProgressBar;
