import React, { useState } from 'react';
import Image from "next/image";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import urgencyIcon from '../../../public/urgency.svg';
import checkIcon from '../../../public/check.svg';
import dateIcon from '../../../public/date_range.svg';

interface SortByFilterProps {
  setFilter: (filter: string) => void;
  setDateFilter: (date: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}

interface MenuItemProps {
  icon: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, children, onClose }) => {
  return (
    <div className="flex items-center gap-3 px-4">
      <Image src={icon} alt={`${children} icon`} width={40} height={30} />
      <div className="w-full">
        <span className="font-poppins text-left text-white text-lg border border-solid border-zinc-500 border-l-0 border-r-0 border-t-0 block pb-4 my-1">
          {children}
        </span>
      </div>
    </div>
  );
};

const SortByFeedback: React.FC<SortByFilterProps> = ({
  setFilter,
  setDateFilter,
  dropdownOpen,
  setDropdownOpen
}) => {

  const [showUrgency, setShowUrgency] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const handleUrgencyClick = () => {
    setFilter("Urgency");
    setShowUrgency(prevState => !prevState);
    setShowStatus(false);
    setShowDate(false);
  };

  const handleStatusClick = () => {
    setFilter("Status");
    setShowUrgency(false);
    setShowStatus(prevState => !prevState);
    setShowDate(false);
  };

  const handleDateClick = () => {
    setShowUrgency(false);
    setShowStatus(false);
    setShowDate(prevState => !prevState);
  };

  const handleFilterSelect = (date: string) => {
    setDateFilter(date);
    setShowDate(false);
    setShowStatus(false);
    setShowUrgency(false);
  };

  return (
    <div className="relative inline-block text-left cursor-pointer" style={{
      background: 'none',
      left: '85%',
      paddingTop: '2.5%'
    }}>
      {dropdownOpen && (
        <div
          className="absolute top-full mt-2 w-56"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          style={{
            width: '170px',
          }}>
          <div className="bg-[#2F2F2F] text-white text-[23px] w-[180px] rounded-lg p-2" >Filters:
            <div onClick={handleDateClick} className='hover:bg-[#191919] transition-all'>
              <MenuItem icon={dateIcon}>Date</MenuItem>
            </div>
            <div onClick={handleUrgencyClick} className='hover:bg-[#191919] transition-all'>
              <MenuItem icon={urgencyIcon}>Urgency</MenuItem>
            </div>
            <div onClick={handleStatusClick} className='hover:bg-[#191919] transition-all'>
              <MenuItem icon={checkIcon}>Status</MenuItem>
            </div>
          </div>

          {showDate && (
            <div
              className="absolute left-full top-0 - p-0 rounded shadow"
              style={{
                top: '0px', minWidth: '280px', backgroundColor: '#2c2c2c', opacity: 1, zIndex: 10
              }}
              onClick={e => e.stopPropagation()}
            >

              <DatePicker
                inline
                selected={date}
                onChange={d => {
                  setDate(d);
                  if (d) setDateFilter(d.toISOString().split('T')[0]);
                  setShowDate(false);
                  setDropdownOpen(false);
                }}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth
                }) => (
                  <div className="flex justify-between items-center px-2 pb-2">
                    <button onClick={decreaseMonth}>&lt;</button>
                    <span className="font-medium">
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={increaseMonth}>&gt;</button>
                  </div>
                )}
              />
              <div className="text-left">
                <button
                  className="mt-2 px-6 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-300 transition duration-200 font-poppins text-sm"
                  onClick={() => {
                    setDate(null)
                    setDateFilter('')
                    setShowDate(false)
                    setDropdownOpen(false);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {showUrgency && (
            <div className="bg-accent-color text-[#F2F2F2] text-19 z-100 mt-12 absolute top-0 left-full rounded-xl"
              style={{ top: '-30px', height: '120px', paddingTop: '10px' }}>
            </div>
          )}

          {showStatus && (
            <div className="bg-accent-color text-[#F2F2F2] text-19 z-100 mt-12 absolute top-0 left-full rounded-xl"
              style={{ top: '-30px', height: '95px', paddingTop: '10px' }}>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortByFeedback;