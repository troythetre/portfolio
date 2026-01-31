import React, { Fragment } from "react";
import MainArea from "../../components/responses/MainArea";
import Sidebar from "../../components/responses/sidebar/Sidebar";

 const Home = () => {
  return (
    <Fragment>
      <div className="grid grid-cols-6 gap-0 h-screen ">
        <aside className=" m-0 col-start-1 col-end-2">
          {/* to be added later userRole for ADMIN -> "admin" and USER -> "user" */}
          <Sidebar userRole={"admin"}/>
        </aside>
         <main className="col-start-2 col-end-7 ">
            <MainArea />
         </main>
       
      </div>
    </Fragment>
  );
}

export default Home;