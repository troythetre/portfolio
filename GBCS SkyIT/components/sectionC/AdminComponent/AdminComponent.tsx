import React from 'react';
import AdminLibraryResponse from './AdminLibraryResponse/AdminLibraryResponse';
import AdminAuth from './AdminAuth/AdminAuth';
import Sidebar from './SideBaAdminComponent/SideBarAdmin';
import SearchBar from '../../searchBarSide/SearchBar';

const AdminComponent = () => {
  return (
    <div className="relative ml-[3%] " style={{ paddingTop: "100px"}}>
<Sidebar></Sidebar>
      {/* <AdminAuth /> */}
      <AdminLibraryResponse />
    </div>
  );

};

export default AdminComponent;
