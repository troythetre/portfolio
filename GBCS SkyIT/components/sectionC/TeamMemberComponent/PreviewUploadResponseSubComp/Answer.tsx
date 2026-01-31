import React, { FC, useState, ChangeEvent } from 'react';
// import styles from "../../../sectionC/universal.view.module.css"
import { Button, Collapse, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface AnswerProp {
  text: string;
}
const Answer: FC<AnswerProp> = ({ text}) =>  {
  const [opened, { toggle }] = useDisclosure(false);

  if (!text) {
    return <div>Response not found</div>;
  }
  return (
    <div
    className="Group635  border-2 border-collapse border-gray-500 border-solid rounded-xl ml-[425px] h-264 px-20 mb-0 mr-8"
  >
  <Group position ="apart">
  <h2 className='inline-block text-white text-3xl font-normal font-poppins leading-10 tracking-tight'>Answer</h2>
  
  <Button className="mb-14 mr-0 mt-10" style={{ backgroundColor: 'transparent'}} 
  onClick={toggle} >{opened ?  <ToggleIcon/> : <ToggleIcon />}</Button>
  
  </Group>

  <Collapse in={opened}>
  <div>
  <input
        name="text"
        value={text}
        style={{ borderBottom: '3px solid yellow' }}
        className="flex mt-0 mb-10 bg-card-bg rounded-md pl-2 py-2 w-11/12 h-50 text-3xl font-normal font-['Poppins'] tracking-tight text-white "
      />
  
  </div>
  </Collapse>
</div>
);
};
// ToggleIcon component for the toggle icon
const ToggleIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 19" fill="none">
<path d="M1.48029 0H20.5197C21.8368 0 22.4954 2.34753 21.5631 3.7233L12.0471 17.7757C11.4699 18.6274 10.5301 18.6274 9.95294 17.7757L0.436938 3.7233C-0.495424 2.34753 0.163149 0 1.48029 0Z" fill="#F4F4F4"/>
</svg>
);

export default Answer;