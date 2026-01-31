import React, { useEffect, useState } from 'react';
import styles from '../../../../components/sectionC/TeamMemberComponent/ArchiveResponseSubComp/styles.module.css';
import SideBar from '../../../../components/sectionC/TeamMemberComponent/SideBarComponent/SideBar'
import Answer from '../../../../components/sectionC/TeamMemberComponent/ArchiveResponseSubComp/PreviewArchiveResponseSubComp/Answer';
import Categories from '../../../../components/sectionC/TeamMemberComponent/ArchiveResponseSubComp/PreviewArchiveResponseSubComp/Categories';
import Question from '../../../../components/sectionC/TeamMemberComponent/ArchiveResponseSubComp/PreviewArchiveResponseSubComp/Questions';
import BackToTopButton from '../../../../components/sectionC/BacktoTop/backtoTop';
import { useRouter } from 'next/router';
import { BASEURL } from '../../../../constants';
import axios from 'axios';

const RfpItem = () => {
  const [data, setData] = useState([]);
  const router = useRouter();

  //Created axios api handler so can be used in other section also.
  useEffect(() => {
    const fetchData = async () => {
      //check if router is ready to return the parameter value.
      if (!router.isReady) return;
      // get the responseid parameter from url.
      const { id } = router.query;
      console.log('router.query: ' + id);

      try {
        const response = await axios.get(`${BASEURL}/api/proposal/single-response/${id}`,
          {
            params: {
              responseID: id,

            },
            withCredentials: true
          }
        )
        // .then((response) => {
        console.log('value retrieved: ' + JSON.stringify(response.data));
        setData(response.data);
        // })
      } catch (error) {
        console.log('Error while fetching data: ', error);
      };
    };
    fetchData();
  }, [router.isReady]);

  return (
    <div className={styles.mainArea}>
      <SideBar />
      <Question question={data.response?.question} />
      <Categories
        software={data.response?.software}
        topic={data.response?.topic}
        subtopic={data.response?.subtopic}
      />
      <Answer text={data.response?.answer} />
      <div className='relative float-right mt-8 px-4'>
        <BackToTopButton />
      </div>

    </div>
  );
};

export default RfpItem;
