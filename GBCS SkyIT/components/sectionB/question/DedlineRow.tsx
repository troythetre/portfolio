import React from 'react';
import { Edit } from 'tabler-icons-react';

interface DeadlineRowProps {
    label: string;
    date: string | null;
    onEditClick: (title: string) => void; 
    title: string;
}

function DeadlineRow({ label, date, onEditClick,title }: DeadlineRowProps) {
    const formatDate = (date: string | string[] | null): string => {
        if (date) {
            const options = { day: '2-digit', month: 'long', year: 'numeric' };
            const dateObj = new Date(date.toString());
            const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
            const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
            const year = dateObj.toLocaleDateString('en-US', { year: 'numeric' });
            return `${day} ${month}, ${year}`;
        }
        return '22 June, 2023';
    };

    const formatStatus = (deadline: string | string[] | null): string => {
        if (deadline) {
            const now = new Date();
            const deadlineDate = new Date(deadline.toString());
            const daysRemaining = Math.max(Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)), 0);
            return `${daysRemaining} days remaining`;
        }
        return '3 days remaining';
    };

    return (
        <tr>
            <td className="w-1/2">
                <div className="flex items-center py-2">
                    <p className="mr-2 text-white text-xs">{label}:</p>
                </div>
            </td>
            <td className="w-1/2">
                <div className="flex items-center py-2">
                    <p className="mr-2 text-white text-xs">{formatDate(date)}</p>
                </div>
            </td>
            <td className="w-1/2">
                <div className="flex items-center py-2">
                    <p className="mr-2 text-white bg-[#5F5F5F] p-1 rounded-lg font-bold text-xs">{formatStatus(date)}</p>
                </div>
            </td>
            <td className="w-1/4">
                <div className="flex items-center py-2" onClick={() => onEditClick(title)} >
                    <Edit size={20} strokeWidth={2} color="#FFD700" />
                </div>
            </td>
        </tr>
    );
}

export default DeadlineRow;
