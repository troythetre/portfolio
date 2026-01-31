import React from "react";
import AddNewUser from "../../components/sectionA/Account/AddNewUser";
import EditPermission from "../../components/sectionA/Account/EditPermission";
// This is the temporary home page of Voop
export default function Home() {
  return (
    <>
    <div>
    <AddNewUser/>
    </div>

    <div>
    <EditPermission/>
    </div>   
    </>
  );
}
