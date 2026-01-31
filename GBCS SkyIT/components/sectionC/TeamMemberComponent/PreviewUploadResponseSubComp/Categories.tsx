import React, { FC, useState, ChangeEvent } from 'react';
// import styles from "../../../sectionC/universal.view.module.css"
import { Button, Collapse, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface CategoriesProps {
  software: string;
  Software?: string
  topic: string;
  Topic?: string;
  SubTopic?: string
  subtopic: string;
}

// Define the functional component
const Categories: FC<CategoriesProps> = ({ software, topic, subtopic, Software, Topic, SubTopic }) => {
  const [opened, { toggle }] = useDisclosure(false);

  if (!software && !topic && !subtopic) {
    return <div>Response not found</div>;
  }

  return (
    <div
      style={{ overflow: 'auto' }}
      className="Group635 relative border-2 border-collapse border-gray-500 border-solid rounded-xl ml-[425px] h-264 px-20 mb-5 mr-8"
    >
      {/* <div className={styles.categories}> */}
      <Group position="apart">
        <h2 className="text-white text-3xl font-normal font-['Poppins'] leading-10 tracking-tight">
          Categories
        </h2>

        <Button
          className="mb-14 mr-0 float-right ml-0 mt-10"
          style={{ backgroundColor: 'transparent' }}
          onClick={toggle}
        >
          {opened ? <ToggleIcon /> : <ToggleIcon />}
        </Button>
      </Group>

      <Collapse in={opened}>
        <p className="mb-0 mt-0 font-normal font-['Poppins'] leading-10 tracking-tight text-2xl tracking-0.36 text-left text-white">
          Software
        </p>
        <div>
          <input
            name="software"
            value={software || Software}
            style={{ borderBottom: '3px solid yellow' }}
            className="flex mt-1 mb-10 bg-card-bg rounded-md pl-2 py-2 w-2/5 h-50 text-3xl font-normal font-['Poppins'] tracking-tight text-white "
          />
        </div>
        <p className="mt-0 mb-0 font-poppins text-22 font-Poppins leading-34 tracking-0.36 text-left text-white">
          Topic
        </p>
        <div>
          <input
            name="topic"
            value={topic || Topic}
            style={{ borderBottom: '3px solid yellow' }}
            className="flex mt-1 mb-10 bg-card-bg rounded-md pl-2 py-2 w-10/12 h-50 text-3xl font-normal font-['Poppins'] tracking-tight text-white "
          />
        </div>

        <p className="mt-8 mb-0 font-poppins text-22 font-Poppins leading-34 tracking-0.36 text-left text-white">
          Sub-topic:
        </p>
        <div>
          <input
            name="subtopic"
            value={subtopic || SubTopic}
            style={{ borderBottom: '3px solid yellow' }}
            className="flex mt-1 mb-14 bg-card-bg rounded-md pl-2 py-2 w-10/12 h-50 text-3xl font-normal font-['Poppins'] tracking-tight text-white "
          />
        </div>
      </Collapse>
    </div>
    // </div>
  );
};
// ToggleIcon component for the toggle icon
const ToggleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="19"
    viewBox="0 0 22 19"
    fill="none"
  >
    <path
      d="M1.48029 0H20.5197C21.8368 0 22.4954 2.34753 21.5631 3.7233L12.0471 17.7757C11.4699 18.6274 10.5301 18.6274 9.95294 17.7757L0.436938 3.7233C-0.495424 2.34753 0.163149 0 1.48029 0Z"
      fill="#F4F4F4"
    />
  </svg>
);


export default Categories;
