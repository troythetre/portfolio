import React, { useEffect, useState, useMemo } from "react";
import { SearchBar } from "../../../components/searchBarSide/NewSearchBar";
import ProgressBar from "./ProgressBar/ProgressBar";
import RfpCard from "../../../components/sectionA/DashboardComponent/RfpCard/RfpCard";
import { BASEURL } from "../../../constants";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [counts, setCounts] = useState({ approved: 0, review: 0, rejected: 0 });
  const [results, setResults] = useState("");
   
  // 1) Load all three statuses in parallel
  useEffect(() => {
    const statuses = ["approved", "review", "rejected"] as const;
    Promise.all(
      statuses.map((status) =>
        axios
          .get(`${BASEURL}/api/proposal/get-status-proposal-list/${status}`, {
            withCredentials: true,
          })
          .then((r) => ({ status, items: r.data }))
      )
    ).then((buckets) => {
      // flatten data & build counts
      const all = buckets.flatMap((b) => b.items);
      const newCounts = buckets.reduce((acc, { status, items }) => {
        acc[status] = items.length;
        return acc;
      }, {} as Record<typeof statuses[number], number>);

      setData(all);
      setCounts({ approved: newCounts.approved, review: newCounts.review, rejected: newCounts.rejected });
    });
  }, []);

  // 2) Batch-fetch each editor’s photoURL once
  const emailToPhoto = useMemo(() => {
    const emails = Array.from(new Set(data.map((d) => d.last_modified_email)));
    const map: Record<string, string> = {};
    emails.forEach((e) => (map[e] = "")); // initialize
    // kick off requests
    Promise.all(
      emails.map((email) =>
        axios
          .get(`${BASEURL}/api/proposal/user/${email}`, { withCredentials: true })
          .then((r) => {
            map[email] = r.data.user.photoURL;
          })
          .catch(() => {
            map[email] = "";
          })
      )
    );
    return map;
  }, [data]);

  // 3) Transform & memoize
  const transformedData = useMemo(() => {
    const now = Date.now();
    const fmt = (ts: string) => {
      const d = new Date(ts);
      const diff = Math.floor((now - d.getTime()) / 1000);
      if (diff < 60) return `${diff} seconds`;
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
      return `${Math.floor(diff / 86400)} days`;
    };
    return data.map((item) => ({
      rfpName: item.proposalName,
      editorName: item.last_modified_userName,
      rfpStatus: item.proposalStatus,
      editDate: fmt(item.last_modified_time),
      editorImage: emailToPhoto[item.last_modified_email] || "",
      proposalId: item.id,
      imageUrl:
        item.proposalStatus === "APPROVED"
          ? "/images/proposal/AcceptedSVG.svg"
          : "/images/proposal/UnderReviewSVG.svg",
      backgroundColorClass:
        item.proposalStatus === "APPROVED" ? "bg-emerald-200" : "bg-yellow-500",
      proposalStatusText:
        item.proposalStatus === "APPROVED"
          ? "Accepted"
          : item.proposalStatus === "REVIEW"
          ? "Review"
          : "Rejected",
    }));
  }, [data, emailToPhoto]);

  // 4) Filter & memoize
  const filteredData = useMemo(() => {
    if (!results) return transformedData;
    const q = results.toLowerCase();
    return transformedData.filter(
      (i) =>
        i.proposalStatusText.toLowerCase().includes(q) ||
        i.rfpStatus.toLowerCase().includes(q)
    );
  }, [results, transformedData]);

  return (
    <div className="...">
      <div className="text-[32px]">Submitted Proposals</div>
      <SearchBar setResults={setResults} />
      <ProgressBar
        accepted={counts.approved}
        underReview={counts.review}
        rejected={counts.rejected}
      />
      <div className="container flex flex-wrap">
        {filteredData.map((i) => (
          <RfpCard key={i.proposalId} rfpItem={i} />
        ))}
      </div>
    </div>
  );
}
