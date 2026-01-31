import React, {useState} from "react";
import SideBar from "../../components/sectionA/SectionA-sidebar/Sidebar";
import RedGridTable from "../setting-grid";
import GenerateCode from "../../components/sectionA/CodeGen/CodeGen";
import TeamMember from "../../components/sectionA/Account/TeamMemberProfile";
export default function Home() {
    return (
        <div className="flex">
            <div className="w-[22%] relative z-[9999]">
                <SideBar />
            </div>

            <div className="w-[78%] mt-20 ml-10">
                <div className="flex flex-col relative">
                    <div className="flex justify-between text-white font-poppins">
                        <div>
                            <h1 className="font-poppins font-normal mb-0">Settings</h1>
                            <h3 className="font-poppins font-normal mt-0">Team Management</h3>
                            <TeamMember />
                        </div>

                        <div className="mt-8 mr-8"><GenerateCode /></div>
                    </div>
                    <div>
                        <RedGridTable />
                    </div>
                </div>
            </div>
        </div>
    );
}
