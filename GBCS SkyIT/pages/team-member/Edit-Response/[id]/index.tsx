import React, { useEffect, useState } from "react";
import SideBarAdmin from "../../../../components/sectionC/AdminComponent/SideBaAdminComponent/SideBarAdmin";

import EditingResponse from "../../../../components/sectionC/AdminComponent/EditingResponse/EditingResponse";
import { useRouter } from "next/router";

const EditResponse = () => {
  const router = useRouter();
  const [responseId, setResponseId] = useState<String>(String);
  useEffect(() => {
    const fetchData = () => {
      //check if router is ready to return the parameter value.
      if (!router.isReady) return;
      // get the responseid parameter from url.
      const { id } = router.query;
      console.log("router.query: " + id);
      setResponseId(id as string);
    };
    fetchData();
  }, [router.isReady, router.query]);

  return (
    <div>
      <SideBarAdmin currentContent="responseLibrary" />
      <div className="relative ml-[3%] " style={{ paddingTop: "100px" }}>
        <EditingResponse
          responseid={responseId}
          isSubTopicEditing={true}
          isTopicEditing={true}
        />
      </div>
    </div>
  );
};

export default EditResponse;
