import React, { useState } from 'react';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import SetButton from './SetButton';
import { SetDeadlineTitle } from './SetDeadlineTitle';
import CalendarPicker from './CalendarPicker'; 

interface SetDeadlineProps {
    onCancel: () => void;
    onSave: (selectedDate: Date | null) => void; // Updated onSave function to include selectedDate
    title: string;
}

function SetDeadline({ onCancel, onSave ,title}: SetDeadlineProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };
    const handleSaveClick = () => {
        onSave(selectedDate); // Pass the selectedDate to onSave
    };
    return (
        <div className="bg-card-bg p-4 rounded-xl shadow-md flex flex-col items-center justify-center w-[400px] h-[500px]">
            <div onClick={onCancel} className=" self-start">
                <ArrowCircleLeftIcon style={{ fill: 'gold' }} sx={{ fontSize: 40 }} />
            </div>
            <div className='mb-2'>
                 <SetDeadlineTitle title={title}/>
            </div>
            <CalendarPicker onSelectDate={handleDateSelect} />
           <SetButton label="Set" onClick={handleSaveClick}/>
        </div>
    );
}

export default SetDeadline;

