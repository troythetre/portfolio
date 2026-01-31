import { Button, CloseButton, Group, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { CheckMark } from '../../CheckMark/CheckMark';
import { showNotification } from '@mantine/notifications';

interface FeedbackItem {
  id: string;
  userEmail: string;
  currentURL: string;
  createdAt: string;
  feedback: string;
  types: 'BUG' | 'GENERAL' | 'SUGGESTION' | 'COMPLAINT';
  status: 0 | 1 | 2;
  urgency: 1 | 2 | 3 | 4 | 5;
}

interface FeedbackCardProps {
  feedback: FeedbackItem;
  onClose: () => void;
  updateFeedbackStatus: (id: string, newStatus: number) => Promise<void>;
}

export default function FeedbackCard({ feedback, onClose, updateFeedbackStatus }: FeedbackCardProps) {
  const [status, setStatus] = useState<number>(feedback.status);
  const [showCheckIcon, setShowCheckIcon] = useState<boolean>(false);

  useEffect(() => {
    feedback.status === 2 ? setShowCheckIcon(true) : setShowCheckIcon(false);
  }, [feedback.status, setShowCheckIcon])

  const handleMarkUnviewed = () => {
    const newStatus = 0;
    updateFeedbackStatus(feedback.id, newStatus);
    setStatus(newStatus);
  };

  const handleMarkViewed = () => {
    const newStatus = 1;
    updateFeedbackStatus(feedback.id, newStatus);
    setStatus(newStatus);
  };

  const handleResolveClick = () => {
    const userConfirmation: boolean = confirm(
      "Are you sure you want to mark this feedback as resolved?"
    );
    if (userConfirmation) {
      showNotification({
        title: "Feedback review",
        message: "Marked as resolved",
        color: "green",
      });
      const newStatus = 2;
      updateFeedbackStatus(feedback.id, newStatus);
      setStatus(newStatus);
      setShowCheckIcon(true);
    } else {
      showNotification({
        title: "Feedback review",
        message: "Canceled",
        color: "red",
      });
    }
  };

  const getUrgency = (id: number): string => {
    switch (id) {
      case 1:
        return "Low";
      case 2:
        return "Medium"
      case 3:
        return "High"
      case 4:
        return "Urgent"
      case 5:
        return "Critical"
      default:
        return "-"
    }
  }

  return (
    <div className="relative bg-zinc-900 p-6 rounded-xl w-5/12 flex flex-row gap-10 items-center max-h-[500px]">
      <CloseButton
        aria-label="Close Feedback Modal"
        title="Close"
        size="sm"
        onClick={onClose}
        className="absolute top-2 right-2 z-10 text-neutral-500 hover:bg-transparent hover:text-white hover:font-bold"
      />
      <div>
        {showCheckIcon ? (
          <CheckMark />
        ) : (
          <span className='text-6xl text-neutral-700'>?</span>
        )}
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className='felx flex-col gap-2'>
          <Text className="text-lg text-white font-bold">
            Feedback By: {feedback.userEmail}
          </Text>
          <div className='flex fkex-row gap-5'>
            <Text className="text-base text-neutral-500">
              Urgency: {getUrgency(feedback.urgency)}
            </Text>
            <Text className="text-base text-neutral-500">
              Type: {feedback.types}
            </Text>
          </div>
        </div>
        <Text className="text-base text-white max-h-[300px] overflow-y-auto">{feedback.feedback}</Text>
        <Group className="mt-2 flex flex-row justify-between">
          <Button
            disabled={status === 2 ? true : false}
            variant="light"
            size="xs"
            onClick={status === 0 ? handleMarkViewed : handleMarkUnviewed}
            color={status === 0 ? 'blue' : 'yellow'}
          >
            {status === 0 ? 'Mark as Viewed' : 'Mark as Unviewed'}
          </Button>
          <Button
            disabled={status === 2 ? true : false}
            variant="light"
            size="xs"
            onClick={handleResolveClick}
            color="green"
          >
            Mark as Resolved
          </Button>
        </Group>
      </div>
    </div>
  );
}
