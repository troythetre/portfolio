import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SectionSelect from '../../../../components/sectionB/question/SectionSelect';
import DeadlinesTable from '../../../../components/sectionB/question/DeadlinesTable';
import TextArea from '../../../../components/sectionB/question/TextArea';
import { Edit } from 'tabler-icons-react';
import Writers from '../../../../components/sectionB/question/Writers';
import Reviewers from '../../../../components/sectionB/question/Reviewers';
import ApprovalButton from '../../../../components/sectionB/question/ApprovalButton';
import WritersReviewers from '../../../../components/sectionB/question/WritersReviewers';


interface QuestionState {
    answerDeadline: string | null;
    reviewDeadline: string | null;
    responseDeadline: string | null;
    questionDescription: string | null;
    isApproved: boolean; // State variable to track approval status
    isRequestingApproval: boolean;
    proposalId: string; // Add the proposalId to the state
    questionId: string;
  


}
interface QuestionProps {
    // Add onEditClick as a prop
    onEditClick: (title: string) => void;
    selectedDate: Date | null;
    dateTitle: string | null;
    onEditTypeSelect: (editType: string) => void; // Add this line
}


function Question({ onEditClick, selectedDate, dateTitle,onEditTypeSelect }: QuestionProps): JSX.Element {
console.log(selectedDate, dateTitle)
    const router = useRouter();
    const { proposalId, questionId } = router.query;


    const exampleAnswerDeadline = '31 Oct, 2023';
    const exampleReviewDeadline = '1 Sept, 2023';
    const exampleResponseDeadline = '2 Sept, 2023';



    const [state, setState] = useState<QuestionState>({
        answerDeadline: exampleAnswerDeadline,
        reviewDeadline: exampleReviewDeadline,
        responseDeadline: exampleResponseDeadline,
        questionDescription: null,
        isApproved: false,
        isRequestingApproval: true, // New state variable to track the request approval button state
        proposalId: proposalId as string, // Initialize proposalId with the value from the route
        questionId: questionId as string,

    });

    useEffect(() => {
        if (proposalId && questionId) {
            // Replace this with your actual API endpoint for fetching deadlines
            //   fetch(`/api/deadlines/${questionId}`)
            //     .then((response) => response.json())
            //     .then((data) => {
            //       setState(data);
            //     })
            //     .catch((error) => {
            //       console.error('Error fetching deadlines:', error);
            //     });
        }
    }, [proposalId, questionId]);


    useEffect(() => {


        if (proposalId && questionId && dateTitle && selectedDate) {


            setState((prevState) => {
                const updatedState = { ...prevState };
                switch (dateTitle) {
                    case 'Answer':
                        updatedState.answerDeadline = selectedDate.toString();
                        break;
                    case 'Review':
                        updatedState.reviewDeadline = selectedDate.toString();
                        break;
                    case 'Response':
                        updatedState.responseDeadline = selectedDate.toString();
                        break;
                    // Add more cases if needed for other deadlines
                }
                return updatedState;
            });
        }
    }, [proposalId, questionId, dateTitle, selectedDate]);

    const handleSaveDescription = (description: string) => {
        setState((prevState) => ({
            ...prevState,
            questionDescription: description,
        }));
        // Send an API request to save the description to your backend here
    };

    const handleApprovalRequest = () => {
        setState((prevState) => ({
            ...prevState,
            isRequestingApproval: false,
        }));
    };

    const handleApprovalRemind = () => {
        setState((prevState) => ({
            ...prevState,
            // Set isApproved status from BACKEND in future ------------->
            isApproved: true,
            isRequestingApproval: false,
        }));
    };

    return (
        <div className="bg-card-bg p-5 rounded-lg w-[520px] h-[921px] relative">
            <div className="flex justify-between items-center p-4">
                <h1 className="text-sm font-normal text-white my-2">Question ID: {questionId || 'Loading...'}</h1>
                {state.isRequestingApproval ? (
                    <div className="w-1/4"></div>

                ) : state.isApproved ? ( // Display the "Under Approval" button
                    <button className='bg-gradient-gold-gbcs text-xs p-2 rounded-lg w-1/4'>
                        <p>Approved</p>
                    </button>

                ) : (
                    <button className='bg-gradient-gold-gbcs text-xs p-2 rounded-lg w-1/4'>
                        <p>Under Approval</p>
                    </button>
                    // No status button when not approved and not requesting approval

                )}

            </div>

            <hr className="border-t-2 border-white" />
            <div className="flex items-center">
                <p className="text-white text-xs">Under Section:</p>
                <SectionSelect />
            </div>
            <hr className="border-t-2 border-white" />
            <div className='my-5'>
                <DeadlinesTable
                    questionDeadline={state.answerDeadline}
                    writingDeadline={state.reviewDeadline}
                    reviewingDeadline={state.responseDeadline}
                    onEditClick={(title) => onEditClick(title)}
                />
            </div>
            <div className='my-5'>
                <TextArea onTextChange={handleSaveDescription} />
            </div>
            <hr className="border-t-2 border-white" />
            <WritersReviewers onEditTypeSelect={onEditTypeSelect} />
            {state.isRequestingApproval ? (
                <div className='absolute bottom-2 right-10 my-5'>
                    <ApprovalButton label="Request Approval" onClick={handleApprovalRequest} />
                </div>
            ) : state.isApproved ? (
                <div className='absolute bottom-2 right-10 my-5'>

                </div>
            ) : (
                <div className='absolute bottom-2 right-10 my-5'>
                    <ApprovalButton label="Remind Approval" onClick={handleApprovalRemind} />
                </div>
            )}
        </div>
    );
}

export default Question;