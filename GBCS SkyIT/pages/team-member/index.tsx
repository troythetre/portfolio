import React from 'react';
import TeamMemberComp from '../../components/sectionC/TeamMemberComponent/TeamMemberComponent';
import SideBar from '../../components/sectionC/TeamMemberComponent/SideBarComponent/SideBar';
import styles from '../../components/sectionC/universal.view.module.css';

const TeamMember = () => {
  return (
    <div className={styles.mainArea}>
      <SideBar />
      <TeamMemberComp />
    </div>
  );
};

export default TeamMember;
