import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BackBtn from '../../BackBtn/BackBtn';
import Vector from '../../../../public/images/Vector.png';
import Image from 'next/image';
import DropdownMenuEdit from './DropdownMenu/DropdownEdit';
import DropdownMenuInfo from './DropdownMenu/DropdownInfo';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close'
import { BASEURL } from '../../../../constants';
import BackToTop from '../../BacktoTop/backtoTop';
import axios from 'axios';

interface EditResponseProps {
  responseid: string;
  isEditing: boolean;
  isTopicEditing: boolean;
  isSubTopicEditing: boolean;
  editedQuestion: string;
  editedAnswer: string;
  editedSoftware: string;
  editedTopic: string;
  editedSubTopic: string;
}
interface DropdownValues {
  softwareOptions?: String[];
  topicOptions?: String[];
  subtopicOptions?: String[];
}

const EditingResponse: React.FC<EditResponseProps> = ({
  responseid,
  isEditing,
  isTopicEditing,
  isSubTopicEditing,
}) => {
  const [rowState, setRowState] = useState<EditResponseProps | null>(null);
  const [options, setOptions] = useState<DropdownValues>();
  // Array(data.length).fill({
  //const [data, setData] = useState<[]>([]);
  // fetch API to get single response on editing response
  useEffect(() => {
    const fetchData = async () => {
      console.log('EditingResponse : responseid' + responseid);
      const response = await axios.get(
        `${BASEURL}/api/proposal/single-response/` +
        responseid,
        {
          params: {
            responseID: responseid,
          },
          withCredentials: true
        }
      )
        .then((response) => {
          console.log(
            'EditingResponse value retrieved: ' + JSON.stringify(response.data)
          );
          setRowState((prevRowState) => {
            const newState = prevRowState;
            newState = {
              ...newState,
              responseid: responseid,
              editedQuestion:
                response.data.response.question ||
                response.data.response.Question,
              editedAnswer:
                response.data.response.answer ||
                response.data.response.Answer,
              editedSoftware:
                response.data.response.software ||
                response.data.response.Software,
              editedTopic:
                response.data.response.topic ||
                response.data.response.Topic,
              editedSubTopic:
                response.data.response.subtopic ||
                response.data.response.subTopic ||
                response.data.response.SubTopic,
            };
            return newState;
          });
        })
        .catch((error) => {
          console.log('Error while fetching data: ', error);
        });
    };
    fetchData();
    fetchDropdownOptions();
  }, [responseid]);

  // get software and topics list in dropdown in categories part
  const fetchDropdownOptions = async () => {
    try {
      const fetchedOptions: DropdownValues = {};
      // Fetch software options
      const softwareresponse = await axios.get(`${BASEURL}/api/proposal/get-response-software-dropdown`, { withCredentials: true });
      fetchedOptions.softwareOptions = softwareresponse.data.message;

      // Fetch topic options
      const topicOptionsResponse = await axios.get(
        `${BASEURL}/api/proposal/get-topic-dropdown`,
        {
          params: {
            includeDeleted: false,
            includeNotDeleted: true,
          },
          withCredentials: true
        }
      );
      fetchedOptions.topicOptions = topicOptionsResponse.data.topics;

      // Fetch subtopic options for the first topic
      if (
        fetchedOptions.topicOptions &&
        fetchedOptions.topicOptions.length > 0
      ) {
        await fetchSubTopicOptions(fetchedOptions.topicOptions[0]);
        console.log(fetchSubTopicOptions);
      }

      setOptions(fetchedOptions);
      console.log('Dropdown options:', fetchedOptions);
    } catch (error) {
      console.log('Error while fetching dropdown options:', error);
    }
  };

  // get subtopics list in dropdown
  const fetchSubTopicOptions = async (selectedTopic: String) => {
    // fetch get all subtopics
    try {
      //console.log('fetchSubTopicOptions for : ' + selectedTopic);
      const subTopicOptionsResponse = await axios.get(`${BASEURL}/api/proposal/get-subtopic-dropdown`,
        {
          params: {
            topic: selectedTopic,
            includeDeleted: false,
            includeNotDeleted: true,
          },
          withCredentials: true
        }
      );
      console.log(
        'subTopicOptionsResponse : ' +
        JSON.stringify(subTopicOptionsResponse.data)
      );
      console.log(
        'first value of subtopic: ' + subTopicOptionsResponse.data.subtopics[0]
      );
      const subTopicOptions = subTopicOptionsResponse.data.subtopics;
      setOptions((prevOptions) => ({
        ...prevOptions,
        subtopicOptions: subTopicOptions,
      }));
      // manually trigger handle text change for subtopic. this was not getting trigger on initialization.
      if (subTopicOptionsResponse.data.subtopics) {
        handleTextChange(
          'editedSubTopic',
          subTopicOptionsResponse.data.subtopics[0]
        );
      }
      // .then((subTopicOptions) => {
      //   options.subtopicOptions = subTopicOptions.data.subtopics;
      console.log(subTopicOptions);
    } catch (error) {
      console.log('Error while fetching sub topic list : ', error);
    }
  };

  // const router = useRouter();
  //  edit question
  // const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  // popup for create topic

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newSubTopic, setNewSubTopic] = useState("");
  const [data, setData] = useState(null);
  const handleEditTopic = (value: string) => {
    setRowState({ ...rowState, isTopicEditing: true, editedTopic: value });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }
  const toggleModal2 = () => {
    setIsModalOpen2(!isModalOpen2);
  }





  const handleEditSubTopic = (value: string) => {
    setRowState({
      ...rowState,
      isSubTopicEditing: true,
      editedSubTopic: value,
    });
  };
  const handleQuestionChange = (value: string) => {
    handleTextChange('editedQuestion', value);
  };
  const handleAnswerChange = (value: string) => {
    handleTextChange('editedAnswer', value);
  };
  const handleSoftwareChange = (value: string) => {
    //setRowState({ ...rowState, 'editedSoftware': value });
    handleTextChange('editedSoftware', value);
  };
  const handleTopicTextChange = (value: string) => {
    handleTextChange('editedTopic', value);
    fetchSubTopicOptions(value);
  };
  const handleSubTopicTextChange = (value: string) => {
    handleTextChange('editedSubTopic', value);
  };

  const handleTextChange = (editedField: string, value: string) => {
    //alert(editedField + ':' + value);
    setRowState((prevRowState) => {
      const newState = prevRowState;
      newState = {
        ...newState,
        [editedField]: value,
      };
      return newState;
    });
  };

  const handleCreate = (text: string) => { };

  const handleSelectionAnswer = () => {
    const answerTextId = document.getElementById('answertextid');
    answerTextId?.classList.toggle('hidden');
  };

  const handleSelectionCategories = () => {
    const categoriesTextId = document.getElementById('categoriesTextId');
    categoriesTextId?.classList.toggle('hidden');
  };

  // called when form is submmitted.
  // const handleSubmit = (e: { preventDefault: () => void }) => {
  //   // const handleSubmit = () => {
  //   e.preventDefault();
  //   console.log(rowState);
  //   //  onSubmit(formData);
  // };
  const router = useRouter();
  const handleSubmit = async () => {
    const updatedData = {
      responseID: responseid,
      question: rowState?.editedQuestion,
      answer: rowState?.editedAnswer,
      software: rowState?.editedSoftware,
      topic: rowState?.editedTopic,
      subtopic: rowState?.editedSubTopic,
    };
    console.log('Before save: updatedData: ' + JSON.stringify(updatedData));
    try {
      await axios.put(
        `${BASEURL}/api/proposal/edit-response/`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      console.log('Response Saved Successfully');

      // Navigate to the desired URL after saving the response
      router.push('/team-member/admin/proposals-admin');
    } catch (err) {
      // Narrow the error type for proper logging
      if (err instanceof Error) {
        console.error('Error while updating data: ', err.message);
      } else {
        console.error('An unknown error occurred');
      }
    }
  };

  return (
    <div id="editresponsedivid" className="grid ml-[420px] mr-[40px] font-poppins">
      {isModalOpen && (
        <dialog
          className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
          <div className="w-[750px] rounded-[5px] bg-[#2F2F2F] shadow-lg relative">
            <div className="flex flex-col text-white justify-center">
              <div className="flex flex-row-reverse text-yellow-400 my-3 mx-[20px]">
                <CloseIcon onClick={toggleModal} />
              </div>
              <Typography
                display={'flex'}
                paddingLeft={5}

                color={'F4F2F2'}
                font-family="Poppins"
                fontSize={20}
                font-style="normal"
                fontWeight={400}
                lineHeight={'0px'}
                letterSpacing={0.375}
                width="100%"
              >
                <h3>Create New Sub Topic</h3>
              </Typography>
              <div>
                <Typography
                  display={'flex'}
                  paddingLeft={5}
                  paddingTop={5}
                  color={'FFFFFF'}
                  font-family="Poppins"
                  fontSize={20}
                  font-style="normal"
                  fontWeight={400}
                  lineHeight={'21px'}
                  letterSpacing={-0}
                  width="100%"
                >
                  New sub-topic name:
                </Typography>
              </div>
              <div className="relative bg-gradient-border w-[90%] h-[40px] rounded my-8 mx-10">
                <input
                  type="text"
                  name="newSubTopic.newSubTopic"
                  defaultValue={rowState?.editedSubTopic}
                  onChange={(e) => setNewSubTopic(e.target.value)}
                  className="relative bottom-[2px] bg-[#555555] w-[100%] h-[38px] rounded border-0 px-2 py-1 text-[#919191]"
                />
              </div>

              <div className="flex gap-[135px] py-[40px]">
                <button type="button" className="px-6 py-3 mx-10 my-[-20px] w-55 h-10 w-40 rounded-2xl text-sm bg-transparent border-yellow-400 text-yellow-400" onClick={toggleModal}>Cancel</button>

                <button type="button" className=" px-6 py-3 mx-80 my-[-20px] w-55 h-10 w-40 rounded-2xl text-sm bg-transparent border-yellow-400 text-yellow-400">Create</button>
              </div>
            </div>

          </div>
        </dialog>
      )}
      {isModalOpen2 && (
        <dialog
          className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
          <div className="w-[750px] rounded-[5px] bg-[#2F2F2F] shadow-lg relative">
            <div className="flex flex-col text-white justify-center">
              <div className="flex flex-row-reverse text-yellow-400 my-3 mx-[20px]">
                <CloseIcon onClick={toggleModal2} />
              </div>
              <Typography
                display={'flex'}
                paddingLeft={5}

                color={'F4F2F2'}
                font-family="Poppins"
                fontSize={20}
                font-style="normal"
                fontWeight={400}
                lineHeight={'0px'}
                letterSpacing={0.375}
                width="100%"
              >
                <h3>Create New Topic</h3>
              </Typography>
              <div>
                <Typography
                  display={'flex'}
                  paddingLeft={5}
                  paddingTop={5}
                  color={'FFFFFF'}
                  font-family="Poppins"
                  fontSize={20}
                  font-style="normal"
                  fontWeight={400}
                  lineHeight={'21px'}
                  letterSpacing={-0}
                  width="100%"
                >
                  New topic name:
                </Typography>
              </div>
              <div className="relative bg-gradient-border w-[90%] h-[40px] rounded my-8 mx-10">
                <input
                  type="text"
                  name="newTopic.newTopic"
                  defaultValue={rowState?.editedTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="relative bottom-[2px] bg-[#555555] w-[100%] h-[38px] rounded border-0 px-2 py-1 text-[#919191]"
                />
              </div>

              <div className="flex gap-[135px] py-[40px]">
                <button type="button" className="px-6 py-3 mx-10 my-[-20px] w-55 h-10 w-40 rounded-2xl text-sm bg-transparent border-yellow-400 text-yellow-400" onClick={toggleModal2}>Cancel</button>

                <button type="button" className=" px-6 py-3 mx-80 my-[-20px] w-55 h-10 w-40 rounded-2xl text-sm bg-transparent border-yellow-400 text-yellow-400">Create</button>
              </div>
            </div>

          </div>
        </dialog>
      )}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="flex items-center mt-0">
          <BackBtn />

          <p className=" flex text-4xl font-normal font-poppins mb-5 text-white-color ">
            Editing Response 1
          </p>
        </div>
      </div>

      <div
        style={{ overflow: 'auto' }}
        className=" border-2 border-collapse border-[#555555] border-solid rounded-xl w-1431 h-264 px-20 mb-5"
      >
        <div className="">
          <h2 className="inline-block text-white text-30 font-poppins font-normal">Questions</h2>
          <h3 className="inline-block float-right text-yellow-400 text-22 font-poppins font-normal">
            *Required
          </h3>
        </div>

        <input
          type="text"
          onChange={(e) => handleQuestionChange(e.target.value)}
          name="rowState.editedQuestion"
          defaultValue={rowState?.editedQuestion}
          style={{ borderBottom: '2px solid yellow' }}
          className="flex mt-1 mb-14 bg-card-bg rounded-md pl-2 py-2 w-10/12 h-50 text-3xl font-normal font-['Poppins'] tracking-tight text-white "
        />
      </div>

      <div
        style={{ overflow: 'auto' }}
        className="border-2 mb-5 border-collapse border-[#555555] border-solid rounded-xl w-1431 h-364 px-20 "
      >
        {/** Try with diff code START */}
        <div>
          <div>
            <h2 className="inline-block  text-white text-30 font-poppins font-normal">Categories</h2>
            <h3 className="inline-block float-right text-yellow-400 text-22 font-poppins font-normal">
              *Required&nbsp;
              <Image
                src={Vector}
                alt="Vector"
                height="13px"
                width="13px"
                onClick={handleSelectionCategories}
              />
            </h3>
          </div>
        </div>

        {/** Try with diff code END */}

        {/** Create New topic code here
         * openpop, is created to call handleopen at child component.
         */}

        <div id="categoriesTextId">
          <div className="text-white-color">
            <DropdownMenuInfo
              label="Software"
              selectedDefalutValue="Select Option"
              isDisplayImage={true}
              onDropdownChange={handleSoftwareChange}
              selectedValue={rowState?.editedSoftware}
              options={options?.softwareOptions}
              name="Select Software"
            />
          </div>
          <div className="text-22 font-normal text-white-color py-5 ">
            {rowState?.isTopicEditing ? (
              <div
                className="text-22 font-normal text-white-color py-1 relative"
                style={{ width: '35vw' }}
              >
                <label className="text-22" style={{ paddingBottom: '5px' }}>Topic</label>
                <input
                  onChange={(e) => handleTopicTextChange(e.target.value)}
                  name="rowState.editedTopic"
                  style={{ borderBottom: '2px solid yellow' }}
                  className="flex mt-1 mb-2 bg-card-bg rounded-md pl-2 py-2 w-full  text-white"
                />
              </div>
            ) : (
              <DropdownMenuEdit
                label="Topic"
                selectedDefalutValue="Select Topic"
                onDropdownChange={handleTopicTextChange}
                onDropdownEdit={handleEditTopic}
                selectedValue={rowState?.editedTopic}
                options={options?.topicOptions}
                name="rowStates.editedTopic"
                createNewValueLabel="Create New Topic"
                createNewValueFunction={() =>
                  toggleModal2()
                }
              />
            )}
          </div>
          <div className="text-22 font-normal text-white-color py-5">
            {rowState?.isSubTopicEditing ? (
              <div
                className="text-22 font-normal text-white-color py-1 relative"
                style={{ width: '35vw' }}
              >
                <label className="text-22" style={{ paddingBottom: '5px' }}>Sub-Topic</label>
                <input
                  onChange={(e) => handleSubTopicTextChange(e.target.value)}
                  name="rowState.editedSubTopic"
                  style={{ borderBottom: '2px solid yellow' }}
                  className="flex mt-1 mb-15 bg-card-bg rounded-md pl-2 py-2 w-full  text-white"
                />
              </div>
            ) : (
              <DropdownMenuEdit
                label="Sub-Topic"
                selectedDefalutValue="Select Sub-Topic"
                onDropdownChange={handleSubTopicTextChange}
                selectedValue={rowState?.editedSubTopic}
                options={options?.subtopicOptions}
                onDropdownEdit={handleEditSubTopic}
                name="rowState.editedSubTopic"
                createNewValueLabel="Create New Sub-Topic"
                createNewValueFunction={() =>
                  toggleModal()
                }
              />
            )}
          </div>
        </div>
      </div>

      <div
        id="answertextdiv"
        style={{ overflow: 'auto' }}
        className="border-2 border-collapse border-[#555555] border-solid rounded-xl w-1431 h-1552 px-20 mb-5"
      >
        <h2 className="inline-block text-white text-30 font-poppins font-normal">Answer</h2>
        <h3 className="inline-block float-right text-yellow-400 text-22 font-poppins font-normal">
          *Required&nbsp;
          <Image
            id="answerTextmgid"
            src={Vector}
            alt="Vector"
            height="13px"
            width="13px"
            onClick={handleSelectionAnswer}
          />
        </h3>
        <div
          id="answertextid"
          style={{ borderBottom: '2px solid yellow' }}
          className="hidden mb-8 bg-card-bg rounded-md pl-2 py-2 w-5/6 text-white"
        >
          <textarea
            rows={30}
            name="rowState.editedAnswer"
            defaultValue={rowState?.editedAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="bg-card-bg rounded-md pl-2 py-2 w-full text-white resize-none"
            style={{ border: 'none' }}
          />
        </div>
      </div>
      <div className="flex mb-4 justify-end">
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="py-2 p-[10px] rounded-3xl w-52 text-22 font-poppins bg-transparent border-yellow-400 text-yellow-400"
          >
            Save Response
          </button>

          <BackToTop />
        </div>
      </div>
    </div>
  );
};
export default EditingResponse;
