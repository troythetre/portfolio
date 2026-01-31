import React, { FC } from "react";
import FileDragDrop from "../components/sectionC/AdminComponent/AdminUpload/FileDragDrop";
import SideBarAdmin from "../components/sectionC/AdminComponent/SideBaAdminComponent/SideBarAdmin";

const DragDropFiles = () => {
  return (
    <div>
      <SideBarAdmin />
      <div className="relative ml-[3%] " style={{ paddingTop: "100px" }}>
        <FileDragDrop />
      </div>
    </div>
  );
};

export default DragDropFiles;
