import { Button } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface FeedbackListProps {
  feedbacks: FeedbackItem[];
  styles: { [key: string]: string }
  setSelectedFeedback: (feedback: FeedbackItem | null) => void;
}

interface FeedbackItem {
  id: string;
  userEmail: string;
  currentURL: string;
  createdAt: string;
  feedback: string;
  types: 'BUG' | 'GENERAL' | 'SUGGESTION' | 'COMPLAINT';
  status: 0 | 1 | 2;
  urgency: 1 | 2 | 3 | 4 | 5;
};

type UrgencyLevel = {
  label: string;
  bg: string;
  text: string;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Invalid date:', dateString);
    return 'N/A';
  }
};

const getTypeBadge = (status: 0 | 1 | 2, type: FeedbackItem['types']) => {
  const typeConfig: Record<FeedbackItem['types'], { bg: string, text: string }> = {
    BUG: { bg: 'bg-red-100', text: 'text-red-800' },
    COMPLAINT: { bg: 'bg-orange-100', text: 'text-orange-800' },
    SUGGESTION: { bg: 'bg-blue-100', text: 'text-blue-800' },
    GENERAL: { bg: 'bg-gray-100', text: 'text-gray-800' },
  };

  const bgClass = status === 2 ? 'bg-transparent' : typeConfig[type].bg;
  const textClass = status === 2 ? 'text-slate-500' : typeConfig[type].text;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs w-[100px] truncate ${bgClass} ${textClass}`}
    >
      {type}
    </span>
  );
};

const getStatusBadge = (status: 0 | 1 | 2) => {
  const statusConfig: Record<0 | 1 | 2, { label: string; style: string }> = {
    0: { label: 'Unviewed', style: 'bg-yellow-100 text-yellow-800' },
    1: { label: 'Viewed', style: 'bg-blue-100 text-blue-800' },
    2: { label: 'Resolved', style: 'bg-green-100 text-green-800' },
  };

  const config = statusConfig[status] ?? statusConfig[0]; // default: Unviewed 

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium w-[70px] ${config.style}`}
    >
      {config.label}
    </span>
  );
};

const getUrgencyBadge = (status: 0 | 1 | 2, urgency: 1 | 2 | 3 | 4 | 5) => {
  const urgencyLevels: Record<1 | 2 | 3 | 4 | 5, UrgencyLevel> = {
    1: { label: 'Low', bg: 'bg-green-100', text: 'text-green-800' },
    2: { label: 'Medium', bg: 'bg-blue-100', text: 'text-blue-800' },
    3: { label: 'High', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    4: { label: 'Urgent', bg: 'bg-orange-100', text: 'text-orange-800' },
    5: { label: 'Critical', bg: 'bg-red-100', text: 'text-red-800' },
  };

  const config = urgencyLevels[urgency] ?? urgencyLevels[3]; // default: High

  const bgClass = status === 2 ? 'bg-transparent' : config.bg;
  const textClass = status === 2 ? 'text-slate-500' : config.text;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium w-[70px] ${bgClass} ${textClass}`}
    >
      {config.label}
    </span>
  );
};

export default function FeedbackList({
  feedbacks,
  styles,
  setSelectedFeedback
}: FeedbackListProps) {

  const rowsRef = useRef<(HTMLTableRowElement | null)[]>([]);

  // useEffect for animation 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    rowsRef.current.forEach((row) => {
      if (row) observer.observe(row);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {feedbacks.map((item, index) => (
        <tr key={item.id} ref={(el) => (rowsRef.current[index] = el)} className={styles.fade_in_left}>
          <td className={`
                          ${styles.tableBorder} 
                          ${styles.tableBorderBody} 
                          ${item.status === 2 ? 'text-slate-500' : 'text-white'}
                        `}
          >
            {item.userEmail}
          </td>
          <td className={`${styles.tableBorder} ${styles.tableBorderBody}`}>
            <Link
              href={item.currentURL}
              target="_blank"
            >
              <span className={`
                ${item.status === 2 ? 'text-slate-500' : 'text-white'}
                cursor-pointer
                hover:text-blue-700
                hover:underline
                transition-all
                ${item.status === 2 ? 'visited:text-slate-500' : 'visited:text-white'}
                `}>
                {new URL(item.currentURL).pathname}
              </span>
            </Link>
          </td>
          <td className={`${styles.tableBorder} ${styles.tableBorderBody} ${item.status === 2 ? 'text-slate-500' : 'text-white'}`}>{formatDate(item.createdAt)}</td>

          <td className={`${styles.tableBorder} ${styles.tableBorderBody}`}>{getUrgencyBadge(item.status, item.urgency)}</td>

          <td className={`${styles.tableBorder} ${styles.tableBorderBody}`}>{getTypeBadge(item.status, item.types)}</td>

          <td className={`${styles.tableBorder} ${styles.tableBorderBody}`}>{getStatusBadge(item.status)}</td>

          <td className={`${styles.tableBorder} ${styles.tableBorderBody}`}>
            <Button
              color={`${item.status === 2 ? "gray" : "blue"}`}
              size="xs"
              onClick={() => setSelectedFeedback(item)}
            >
              Open
            </Button>
          </td>
        </tr>
      ))}
    </>
  );
}
