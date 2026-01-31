import React from "react";
import AdminComponent from '../../../../components/sectionC/AdminComponent/AdminComponent';
import SideBarAdmin from '../../../../components/sectionC/AdminComponent/SideBaAdminComponent/SideBarAdmin';
import styles from '../../../../components/sectionC/TeamMemberComponent/LibraryResponse/styles.module.css';
// 
const index = () => {

  return (
    <div className={styles.mainArea}>

       <SideBarAdmin /> 
       <AdminComponent />  
      

    </div>
  );

};

export default index;
