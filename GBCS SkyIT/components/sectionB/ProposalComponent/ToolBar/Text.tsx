import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './styles.module.css';
import Bold from './Formats/Bold';
import Italic from './Formats/Italic';
import Underline from './Formats/Underline';
import FontSize from './Formats/Size';
import FontStyle from './Formats/Font';
import LineSpacing from './Formats/LineSpacing';
import BulletedList from './Formats/List';
import Align from './Formats/Align';
import TextColor from './Formats/TextColor';

interface QuillToolbarProps {
    style: boolean;
    contentEditableRef: React.RefObject<HTMLDivElement>;
}

const QuillToolbar: React.FC<QuillToolbarProps> = ({ contentEditableRef, style }) => {
    return (
        <div className={`${style ? 'block' : 'hidden'} `}>
            <div className={`${styles.text} flex flex-col justify-center bg-[#555555] w-[55px] border-none rounded-md fixed right-14`}>
                <FontStyle />
                <FontSize />
                <div className="w-[35px] h-[1px] bg-[#d5d5d5] my-4 pb-2 self-center"></div>
                <TextColor />
                <Bold />
                <Italic />
                <Underline />
                <LineSpacing contentEditableRef={contentEditableRef} />
                <BulletedList />
                <Align contentEditableRef={contentEditableRef}/>
            </div>
        </div>
    );
};

export default QuillToolbar;