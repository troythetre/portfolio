import React from "react";
import ArchiveResponseSubComp from "../../../components/sectionC/TeamMemberComponent/ArchiveResponseSubComp/ArchiveResponseSubComp";
import SideBar from "../../../components/sectionC/TeamMemberComponent/SideBarComponent/SideBar";
import styles from '../../../components/sectionC/universal.view.module.css';

const ArchiveResponse = () => {
  return (
    <div className={styles.mainArea}>
      <SideBar />
      <ArchiveResponseSubComp />
    </div>
  );
};

export default ArchiveResponse;
