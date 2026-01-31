import React from 'react';
import Logo from '../../components/create-view-proposal/Logo';
import ButtonBar from '../../components/create-view-proposal/ButtonBar';
import Background from '../../components/create-view-proposal/Background';

const CreateViewProposalPage = () => {
    return (
        <div className="flex items-center m-0">
            <Background>
                <Logo />
                <ButtonBar />
            </Background>

        </div>
    )
}

export default CreateViewProposalPage;