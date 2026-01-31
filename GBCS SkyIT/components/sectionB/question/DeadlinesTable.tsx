import React from 'react';
import { Edit } from 'tabler-icons-react';
import DeadlineRow from './DedlineRow';

interface DeadlinesTableProps {
    questionDeadline: string | null;
    writingDeadline: string | null;
    reviewingDeadline: string | null;
    onEditClick: (title: string) => void;  // Define onEditClick as a prop
}

function DeadlinesTable({ questionDeadline, writingDeadline, reviewingDeadline,onEditClick }: DeadlinesTableProps) {
    return (
        <div className="p-2">
            <table className="table-fixed border-collapse border-transparent w-full">
                <tbody>
                    <DeadlineRow label="Answer Deadline" date={questionDeadline} onEditClick={onEditClick} title="Answer"/>
                    <DeadlineRow label="Review Deadline" date={writingDeadline} onEditClick={onEditClick} title="Review"/>
                    <DeadlineRow label="Response Deadline" date={reviewingDeadline} onEditClick={onEditClick} title="Response"/>
                </tbody>
            </table>
        </div>
    );
}

export default DeadlinesTable;
