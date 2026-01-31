import React, { useState, useEffect } from "react";
import { BASEURL } from "../../../constants/index";
import { json } from "stream/consumers";
import RfpCard from "../../../components/sectionA/DashboardComponent/RfpCard/RfpCard";

const HomePage = () => {
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState(null);
  const [transformedData, settransformedData] = useState([]);
  const formatDate = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString("en-US");
    }
    return "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/proposal/archive`, {
          method: "GET",
          credentials: "include",
        });

        let jsonData = await response.json();
        const filteredItems = jsonData.trashItems.filter(
          (item: { itemType: string }) => item.itemType === "proposal"
        );
        const proposalIDs = filteredItems.map(
          (item: { restorationInfo: { proposalID: any } }) =>
            item.restorationInfo ? item.restorationInfo.proposalID : null
        );

        setData(proposalIDs); // Assuming jsonData contains your data
      } catch (error) {
        console.error("Fetch error", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/proposal/allproposals`, {
          method: "GET",
          credentials: "include",
        });

        let jsonData = await response.json();
        const filteredItems = jsonData.proposals.filter(
          (proposal: { proposalID: any }) => data.includes(proposal.proposalID)
        );
        setAllData(filteredItems); // Assuming jsonData contains your data
      } catch (error) {
        console.error("Fetch error", error);
      }
    };

    fetchData();
  }, [data]);

  useEffect(() => {
    const transformedData =
      allData && Array.isArray(allData)
        ? allData.map((item) => ({
          rfpName: item.name,
          editorName: item.modifiedBy,
          editDate: formatDate(item.lastModified),
          imageUrl: item.clientLogo
            ? item.clientLogo.fileURL
            : "/bigNoimage.svg",
          editorImage: item.userLogoURL,
        }))
        : [];

    settransformedData(transformedData);
  }, [allData]);

  return (
    <div className="flex">
      <p>data: {JSON.stringify(data)}</p>

      <p>AllData: {JSON.stringify(allData)}</p>

      {transformedData.map((rfpItem, index) => (
        <RfpCard key={index} rfpItem={rfpItem} />
      ))}

    </div>
  );
};

export default HomePage;
