import React, { useState } from 'react';

interface CalendarPickerProps {
  onSelectDate: (date: Date) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  const handleDateChange = (day: number) => {
    const currentDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(currentDate);
    onSelectDate(currentDate);
  };

  const handleMonthChange = (increment: number) => {
    const newMonth = currentMonth + increment;
    if (newMonth >= 0 && newMonth <= 11) {
      setCurrentMonth(newMonth);
    } else if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  };

  const renderDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`cursor-pointer p-1 text-center text-white text-md border border-gray-300 rounded-full ${
            selectedDate && selectedDate.getDate() === day ? 'bg-[#FFD700] text-black' : ''
          }`}
          onClick={() => handleDateChange(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderWeekDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekDays.map((day) => (
      <div key={day} className="text-center text-md font-bold text-white">
        {day}
      </div>
    ));
  };

  return (
    <div className=" bg-transparent border-solid  border-white shadow-md p-4 rounded-xl m-3 w-[350px] h-[300px]">
      <div className="flex justify-between mb-2">
        <button className="rounded-full border-none bg-[#555555] text-white"  onClick={() => handleMonthChange(-1)}>&lt;</button>
        <div className='font-bold text-white text-sm m-1'>{new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
        <button className="rounded-full border-none bg-[#555555] text-white" onClick={() => handleMonthChange(1)}>
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderWeekDays()}
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarPicker;
