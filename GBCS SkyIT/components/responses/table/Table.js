import React, { useState, useEffect } from "react";
import { DotsVertical } from "tabler-icons-react";
import ReadMore from "./ReadMore";

const Table = () => {
  const [data, setData] = useState([]);
  const [checkedRows, setCheckedRows] = useState({}); // Keep track of checked rows

  const handleChange = (index) => {
    // Toggle the checkbox state for a specific row
    setCheckedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleClick = () => {
    //functionality code to be added here for menu
  };

  useEffect(() => {
    // Fetch data from your backend API here (replace with your actual API endpoint)
    fetch("/api/getTableData")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div
      style={{ overflowY: "auto", maxHeight: 600 }}
      className="border-2 border-collapse border-gray-500 table-auto border-solid rounded-xl"
    >
      <table className=" border-2 border-collapse border-gray-500 table-auto border-solid">
        <thead className="border-solid border-t border-b sticky top-0 bg-black text-yellow-400">
          <tr>
            <th className="border-t-0 border-b-0 bg-black text-left p-4 "></th>
            <th className="border-t-0 border-b-0 bg-black text-left p-4">
              Question
            </th>
            <th className="border-t-0 border-b-0 bg-black text-left p-4">
              Answer
            </th>
            <th className="border-t-0 border-b-0 bg-black text-left p-4">
              Software
            </th>
            <th className="border-t-0 border-b-0 bg-black text-left p-4">
              Topic
            </th>
            <th className="border-t-0 border-b-0 bg-black text-left p-4">
              Sub-Topic
            </th>
            <th className="border-t-0 border-b-0 bg-black text-left p-4"></th>
          </tr>
        </thead>
        <tbody className="border-solid border-t border-b">
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                checkedRows[index]
                  ? "bg-yellow-100 text-black border-solid"
                  : "text-white border-solid"
              }
            >
              <td className="border-t-0 border-b-0 text-left p-4">
                <input
                  type="checkbox"
                  checked={checkedRows[index] || false}
                  onChange={() => handleChange(index)}
                />
              </td>
              <td className="border-t-0 border-b-0 text-left p-4">
                <ReadMore
                  text={item.question}
                  maxLength={100}
                  checkedRows={checkedRows[index]}
                />
              </td>
              <td className="border-t-0 border-b-0 text-left p-4">
                {/* Use the ReadMore component for the item.answer */}
                <ReadMore
                  text={item.answer}
                  maxLength={100}
                  checkedRows={checkedRows[index]}
                />
              </td>
              <td className="border-t-0 border-b-0 text-left p-4">
                {item.software}
              </td>
              <td className="border-t-0 border-b-0 text-left p-4">
                {item.topic}
              </td>
              <td className="border-t-0 border-b-0 text-left p-4">
                {item.subTopic}
              </td>
              <td className="border-t-0 border-b-0 text-left p-4">
                <DotsVertical
                  size={24}
                  strokeWidth={4}
                  color={"#CDB016"}
                  onClick={handleClick}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
