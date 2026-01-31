import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import RfpCard from "../../../components/sectionA/DashboardComponent/RfpCard/RfpCard";
import { SearchBar } from "../../../components/searchBarSide/NewSearchBar";
import { BASEURL } from "../../../constants/index";
import { useUser } from "../NewProposal/FormDataContext";

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [allProposals, setAllProposals] = useState<any[]>([]);
  const [results, setResults] = useState("");
  const { user } = useUser();

  // 1) Fetch both in parallel
  useEffect(() => {
    Promise.all([
      axios.get(`${BASEURL}/api/proposal/bookmarkedproposals`, { withCredentials: true }),
      axios.get(`${BASEURL}/api/proposal/allproposalsinclusive`, { withCredentials: true }),
    ]).then(([bRes, aRes]) => {
      setBookmarks(bRes.data.proposals);
      setAllProposals(aRes.data.proposalList);
    });
  }, []);

  // 2) Build a set for O(1) lookups
  const bookmarkIdSet = useMemo(
    () => new Set(bookmarks.map((b) => b.id)),
    [bookmarks]
  );

  // 3) Filter & memoize
  const filtered = useMemo(
    () => allProposals.filter((p) => bookmarkIdSet.has(p.id)),
    [allProposals, bookmarkIdSet]
  );

  // 4) Transform & memoize
  const transformed = useMemo(() => {
    const now = Date.now();
    const fmt = (ts: string) => {
      const diff = Math.floor((now - new Date(ts).getTime()) / 1000);
      if (diff < 60) return `${diff} seconds`;
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours`;
      return `${Math.floor(diff / 86400)} days`;
    };
    return filtered.map((item) => ({
      rfpName: item.proposalName!,
      editorName: item.last_modified_userName!,
      rfpStatus: item.proposalStatus!,
      editDate: fmt(item.last_modified_time),
      editorImage: user.photoURL,
      proposalId: item.id!,
      imageUrl:
        item.proposalStatus === "APPROVED"
          ? "/images/proposal/AcceptedSVG.svg"
          : item.proposalStatus === "REJECTED"
          ? "/images/proposal/RejectedSVG.svg"
          : "/images/proposal/UnderReviewSVG.svg",
      backgroundColorClass:
        item.proposalStatus === "APPROVED"
          ? "bg-emerald-200"
          : item.proposalStatus === "REJECTED"
          ? "bg-red-500"
          : "bg-yellow-500",
      proposalStatusText:
        item.proposalStatus === "APPROVED"
          ? "Accepted"
          : item.proposalStatus === "REJECTED"
          ? "Rejected"
          : "Under Review",
    }));
  }, [filtered, user.photoURL]);

  // 5) Search filter
  const displayed = useMemo(() => {
    if (!results) return transformed;
    const q = results.toLowerCase();
    return transformed.filter((i) => i.rfpName.toLowerCase().includes(q));
  }, [results, transformed]);

  return (
    <div className="...">
      <div className="text-[32px]">Bookmarked Proposal</div>
      <SearchBar setResults={setResults} />
      <div className="container flex flex-wrap">
        {displayed.map((i) => (
          <RfpCard key={i.proposalId} rfpItem={i} />
        ))}
      </div>
    </div>
  );
}
