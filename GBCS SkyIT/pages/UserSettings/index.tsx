

import UserSettings from "../../components/sectionA/Settings/UserSettings"
import SideBar from "../../components/sectionA/SectionA-sidebar/Sidebar";

export default function Home() {

return (
       
          <div  className="flex flex-row justify-between w-full ">
               <div className="relative z-[9999]">
                <SideBar/>
                </div> 
               
                <UserSettings />
               
          </div>
    )
}

