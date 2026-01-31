import React, { useEffect, useState } from "react";
import FeedbackList from "./feedbackList"
import { BASEURL } from "../../../constants";
import { LoaderOne } from "../../Loader/LoaderOne";
import styles from './FeedbackList.module.css'
import ErrorPage from "../../Error/Error";
import NoFeedbacks from "../../NoFeedbacks/NoFeedbacks";
import { SearchBar } from "../../../components/searchBarSide/NewSearchBar";
import SortByFeedback from "./SortByFeedback";
import { showNotification } from "@mantine/notifications";
import FeedbackCard from "./feedbackCard";

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

const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASEURL}/api/feedback/getAllFeedback`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const isUnauthorized = response.status === 401;
        const errorData = await response.json();

        showNotification({
          title: isUnauthorized ? "Session Expired" : "Failed to Fetch Feedbacks",
          message: isUnauthorized
            ? "Your session has expired. Please log in again."
            : errorData.message || "Unable to retrieve feedbacks. Please try again later.",
          color: "red",
        });

        throw new Error(
          isUnauthorized
            ? "Session expired. Please login again."
            : errorData.message || "Failed to fetch feedbacks"
        );
      }

      const data: FeedbackItem[] = await response.json();
      console.log("Feedbacks: ", data);
      setFeedbacks(data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch feedbacks";
      setError(errorMessage);
      console.error("Error while fetching feedbacks:", err);

      if (errorMessage === "Session expired. Please login again.") {
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return { feedbacks, loading, error, refetch: fetchFeedbacks };
};

function FeedbackListHeader() {
  const { feedbacks, loading, error, refetch } = useFeedback();
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const statusLabels: string[] = ["unviewed", "viewed", "resolved"];
  const urgencyLabels: string[] = ["low", "medium", "high", "urgent", "critical"];

  //API Request to update the feedback
  const updateFeedbackStatus = async (id: string, newStatus: number) => {
    try {
      const response = await fetch(`${BASEURL}/api/feedback/updateStatus`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);

      showNotification({
        title: "Unable to Update Feedback Status",
        message:
          "An error occurred while updating the feedback status. Please try again or refresh the page.",
        color: "red",
      });
    } finally {
      setSelectedFeedback(null);
    }
  };

  // Filter feedbacks based on search query
  const filteredFeedbacks = feedbacks.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.feedback.toLowerCase().includes(q) ||
      item.userEmail.toLowerCase().includes(q) ||
      item.currentURL.toLowerCase().includes(q) ||
      item.types.toLowerCase().includes(q) ||
      statusLabels[item.status]?.includes(q) ||
      item.createdAt.toLowerCase().includes(q) ||
      urgencyLabels[item.urgency - 1]?.includes(q);

    const matchesDate = selectedDate
      ? new Date(item.createdAt).toISOString().split('T')[0] === selectedDate
      : true;

    return matchesSearch && matchesDate;
  });

  // Sort filtered feedbacks
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    if (sortCriteria === "Urgency") return b.urgency - a.urgency;
    if (sortCriteria === "Status") return a.status - b.status;
    return 0;
  });

  const handleFilterChange = (filter: string) => {
    setSortCriteria(filter);
    setDropdownOpen(false);
  };

  if (loading) return <LoaderOne />;
  if (error) return <ErrorPage error={error} refetch={refetch} />;
  if (feedbacks.length === 0) return <NoFeedbacks />;

  return (
    <div>
      <div className="w-3/5 flex flex-row gap-5 items-center my-[50px] ml-3">
        <SearchBar setResults={setSearchQuery} />
        <div
          className="relative"
          onMouseOver={() => setDropdownOpen(true)}
          onMouseOut={() => setDropdownOpen(false)}
        >
          <button
            className="inline-flex justify-center items-center w-[180px] h-[40px] border-2 border-yellow-300 bg-transparent transition-all text-yellow-300 rounded-full text-[18px] font-normal font-['Poppins'] px-4 py-2 hover:bg-yellow-300 hover:text-black cursor-pointer"
          >
            Sort By
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-full top-[40%] left-[-85%] w-full z-50">
              <SortByFeedback
                setFilter={handleFilterChange}
                setDateFilter={setSelectedDate}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
              />
            </div>
          )}
        </div>
      </div>

      <table className={`w-full mt-6 ${styles.tableBorder}`}>
        <thead>
          <tr className={`${styles.tableBorder} ${styles.tableBorderHead} mb-3`}>
            <th className={`${styles.textGold} text-xl text-center mb-3`}>User Email</th>
            <th className={`${styles.textGold} text-xl text-center mb-3`}>URL</th>
            <th className={`${styles.textGold} text-xl text-center mb-3`}>Date</th>
            <th className={`${styles.textGold} text-xl text-center mb-3`}>Urgency</th>
            <th className={`${styles.textGold} text-xl text-center mb-3`}>Type</th>
            <th className={`${styles.textGold} text-xl text-center mb-3`}>Status</th>
            <th className={`${styles.textGold} text-xl text-center mb-3`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <FeedbackList
            styles={styles}
            feedbacks={sortedFeedbacks}
            setSelectedFeedback={setSelectedFeedback}
          />
        </tbody>
      </table>

      {selectedFeedback && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '30px'
        }}>
          <FeedbackCard
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
            updateFeedbackStatus={updateFeedbackStatus}
          />
        </div>
      )}
    </div>
  );
}

export default FeedbackListHeader;
