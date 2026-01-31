import React from "react";
import SideBarAdmin from '../../../../components/sectionC/AdminComponent/SideBaAdminComponent/SideBarAdmin';
import AdminArchive from "../../../../components/sectionC/AdminComponent/AdminArchive/AdminArchive";
// import styles from '../../../../components/sectionC/AdminComponent/AdminEditResponse/styles.module.css';

const ArchiveAdmin = () => {
  return (
    <div className="relative ml-[3%] " style={{ paddingTop: "100px"}} >
      <SideBarAdmin/>
      <AdminArchive/>
    </div>
  );
};

export default ArchiveAdmin;
