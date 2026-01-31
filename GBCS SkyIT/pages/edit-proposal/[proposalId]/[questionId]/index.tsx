import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import SetDeadline from '../../../../components/sectionB/question/set-deadline/SetDeadline';
import Question from './Question';
import AssignCard from '../../../../components/sectionB/question/assign-writers-reviewers/AssignCard';


interface ProposalState {
    proposalId: String,
    isEditing: boolean;
    dateTitle: string | null;
    selectedDate: Date | null;
    editType: string | null;
    isAssignEditing: boolean;
}

function Proposal() {

    const router = useRouter();
    const { proposalId } = router.query;


    const [state, setState] = useState<ProposalState>({
        proposalId: proposalId as string, // Initialize proposalId with the value from the route
        isEditing: false,
        dateTitle: null,
        selectedDate: null,
        editType: null,
        isAssignEditing: false,
    })
    useEffect(() => {
        if (proposalId) {
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
    }, [proposalId]);

    const handleEditClick = (title: string) => {
        setState((prevState) => ({ ...prevState, isEditing: true, dateTitle: title, selectedDate: null }));
    };

    const handleCancel = () => {
        setState((prevState) => ({ ...prevState, isEditing: false, dateTitle: null, selectedDate: null }));
    };
    const handleAssignCancel = () => {
        setState((prevState) => ({ ...prevState, isAssignEditing: false }));
    };


    const handleSave = (selectedDate: Date | null, dateTitle: string | null) => {
        setState((prevState) => ({ ...prevState, isEditing: false, dateTitle, selectedDate }));
    };

    const handleEditTypeSelect = (editType: string) => {
        setState((prevState) => ({ ...prevState, editType, isAssignEditing: true }));
      };

    return (
        <div className="flex space-x-8">
            <div>

                {/* show Question Conditionally in future */}
                <Question onEditClick={handleEditClick} selectedDate={state.selectedDate} dateTitle={state.dateTitle} onEditTypeSelect={handleEditTypeSelect}/>
            </div>
            {/* Conditionally render EditComponent */}
            {state.isEditing && state.dateTitle && (
                <div>
                    <SetDeadline onCancel={handleCancel} onSave={(selectedDate) => handleSave(selectedDate, state.dateTitle)} title={state.dateTitle} />
                </div>
            )}
            <div>
            {state.isAssignEditing && state.editType && <AssignCard editType={state.editType} onCancel={handleAssignCancel}/>}
            </div>
        </div>

    );
}


export default Proposal;
