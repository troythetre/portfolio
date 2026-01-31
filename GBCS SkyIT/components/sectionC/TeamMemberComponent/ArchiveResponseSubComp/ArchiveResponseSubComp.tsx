import React, { FC, useEffect, useState } from 'react';
import ReadMore from './ReadMore';
import styles from '../../AdminComponent/AdminLibraryResponse/styles.module.css';
import Link from 'next/link';
import PreviewBtn from '../GroupBtn/PreviewBtn';
import SearchBar from '../../AdminComponent/SearchBar/SearchBar';
import { BASEURL } from '../../../../constants';
import axios from 'axios';

interface ArchivedResponse {
  responseID: string;
  question: string;
  Question?: string;
  answer: string;
  Answer?: string;
  software: string;
  Software?: string;
  topic: string;
  Topic?: string;
  subtopic: string;
  SubTopic?: string;
}

const ArchiveResponseSubComp: FC = () => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectedResponseId, setSelectedResponseId] = useState<String | null>(
    null
  );
  const [checkedRows, setCheckedRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(false);
  const [filteredData, setFilteredData] = useState<ArchivedResponse[]>([]); // to hold filtered data state
  const [data, setData] = useState<ArchivedResponse[]>([]);

  //Created axios api handler so can be used in other section also.
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${BASEURL}/api/proposal/get-archived-responses`, { withCredentials: true })
        .then((response) => {
          setData(response.data.archivedResponses);
        })
        .catch((error) => {
          console.log('Error while fetching data: ', error);
        });
    };
    fetchData();
  }, []);

  //  handle preview button to fetch data and show the results in preview responses

  const handlePreviewClick = () => {
    if (!isCheckboxSelected) {
      alert('Please select a checkbox before previewing.');
    }
  };

  //searchbar implementation
  // const [filteredData, setFilteredData] = useState<ResponseItem[]>([]);
  // const [searchInput, setSearchInput] = useState<string>('');
  // Search function to filter data
  const handleSearch = (filteredData: ArchivedResponse[]) => {
    setFilteredData(filteredData);
  };

  const handleCheckboxChange = (index: number, responseid: String) => {
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
    setSelectedResponseId(selectedRowIndex === index ? null : responseid);
    setIsCheckboxSelected(true);
  };

  const handleChange = (index: string) => {
    // Toggle the checkbox state for a specific row
    setCheckedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
    setIsCheckboxSelected(true);
  };

  // const handleRowClick = (responseID: String) => {
  //   // Navigate to the detailed page for the clicked response
  //   console.log(responseID)
  //   router.push({
  //     pathname:`/team-member/archive-response/${responseID}`,
  // });
  // };

  const totalCount = data?.length;
  return (
    <div className="ml-[420px] mr-[40px] mb-[20px] 3xl:ml-[756px] 3xl:mr-[72px] 3xl:mb-[36px]">
      <h1 className=" font-poppins font-normal text-44 text-white-color m-0 p-0 mb-11">
        Archived Responses
        <SearchBar
          data={data}
          setFilteredData={setFilteredData}
          onSearch={handleSearch}
        />
      </h1>

      <div className="mb-9 relative">
        <Link
          href={
            isCheckboxSelected ? `archive-response/${selectedResponseId}` : '#'
          }
        >
          <PreviewBtn onClick={handlePreviewClick} />
        </Link>
      </div>

      <div className="">
        <p className="text-lg font-inter mb-6 text-white-color">
          Total {totalCount} responses
        </p>
        <div
          style={{ overflow: 'auto', maxHeight: 400 }}
          className="border-2 border-collapse border-gray-500 table-auto border-solid rounded-xl"
        >
          <table
            className={`w-[100%] h-[50px] border-2 border-collapse border-gray-500 table-auto border-solid ${styles.transactionHistory}`}
          >
            <thead className="border-solid border-t border-b ">
              <tr className=" text-30 font-poppins font-semibold">
                <th className="border-t-2 border-b-2 text-center p-4 bg-clip-text bg-gradient-text text-transparent"></th>
                <th className="border-t-2 border-b-2 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                  Question
                </th>
                <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                  Answer
                </th>
                <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                  Software
                </th>
                <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                  Topic
                </th>
                <th className="border-t-0 border-b-0 text-center p-4 bg-clip-text bg-gradient-text text-transparent">
                  Sub-Topic
                </th>
              </tr>
            </thead>
            <tbody className="border-solid border-collapse border-t border-b">
              {(filteredData.length > 0 ? filteredData : data).map((item, index) => (
                <tr key={index} className="border-solid text-white-color">
                  <td className="border-t-0 border-b-0 text-left p-4 relative">
                    <div className="flex items-center">
                      <label
                        className={`${styles.container}  cursor-pointer `}
                      >
                        <input
                          type="checkbox"
                          id="check"
                          checked={index === selectedRowIndex}
                          onChange={() =>
                            handleCheckboxChange(index, item.responseID)
                          }
                          disabled={
                            selectedRowIndex !== null &&
                            selectedRowIndex !== index
                          }
                        />
                        <span className={`${styles.checkmark}`}></span>
                      </label>
                    </div>
                  </td>
                  <td className="border-t-0 border-b-0 text-left p-4">
                    <ReadMore
                      text={item.question || item.Question || ''}
                      maxLength={100}
                      checkedRows={checkedRows[index]}
                    />
                  </td>
                  <td className="border-t-0 border-b-0 text-left p-4">
                    {/* Use the ReadMore component for the item.answer */}
                    <ReadMore
                      text={item.answer || item.Answer || ''}
                      maxLength={100}
                      checkedRows={checkedRows[index]}
                    />
                  </td>
                  <td className="border-t-0 border-b-0 text-center p-4">
                    {item.software || item.Software || ''}
                  </td>
                  <td className="border-t-0 border-b-0 text-center p-4">
                    {item.topic || item.Topic || ''}
                  </td>
                  <td className="border-t-0 border-b-0 text-center p-4 w-[264px]">
                    {item.subtopic || item.SubTopic || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ArchiveResponseSubComp;
