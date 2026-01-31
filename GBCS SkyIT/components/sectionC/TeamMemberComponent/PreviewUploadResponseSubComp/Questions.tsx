import React, { FC, useState, ChangeEvent } from 'react';
// import styles from '../../universal.view.module.css';
import { useRouter } from 'next/router';
// import data from '../../../sectionC/TeamMemberComponent/LibraryResponse/data.json';
import BackBtn from '../../BackBtn/BackBtn';

interface QuestionProps {
  question: string;
  Question?: string;
}

const Question: React.FC<QuestionProps> = ({ question, Question }) => {
  if (!question) {
    return (
      <div className="flex items-center ml-[425px] ">
        <p>Response not found</p>
      </div>
    );
  }
  return (
     <div className="mt-0">
     <div className=" inline-flex flex-row mt-8 mb-0 ml-[420px] "> 
        <BackBtn />

        <p className="text-4xl font-normal font-poppins mb-5 text-white-color px-15">
          Previewing Response
        </p>
      </div>
      <div
        // style={{ overflow:'hidden'}}
        className=" Group635 border-2 border-collapse border-gray-500 border-solid rounded-xl ml-[425px]  h-264 px-20 mb-5 mr-8"
      >
        <div className="">
          <h2 className="inline-block text-white text-3xl font-normal font-['Poppins'] leading-10 tracking-tight">
            Question
          </h2>

          <input
            name="question "
            value={question || Question}
            style={{ borderBottom: '3px solid yellow' }}
            className="flex mt-1 mb-14 bg-card-bg rounded-md pl-2 py-2 w-10/12 h-50 text-3xl font-normal font-['Poppins'] tracking-tight text-white "
          />
        </div>
      </div>
      </div>
  );
};

export default Question;
