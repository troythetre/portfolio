import React, { useState, ChangeEvent } from 'react';

interface TextAreaProps {
  onTextChange: (text: string) => void;
  initialText?: string;
}

function TextArea({ onTextChange, initialText = '' }: TextAreaProps) {
  const [text, setText] = useState<string>(initialText);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };

  return (
    <div>
      <textarea
        rows={4}
        cols={50}
        value={text}
        onChange={handleTextareaChange}
        placeholder="Question description, click to edit"
        className="bg-[#555555] rounded-xl border-b-2 border-b-yellow-400 rounded-5 text-white relative p-5 w-[475px] h-[186px] text-sm placeholder-color-[#B5B5B5]"
      ></textarea>
    </div>
  );
}

export default TextArea;
