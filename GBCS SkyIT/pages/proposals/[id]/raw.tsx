import { collection, doc, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { cloneElement } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { TEMPLATES } from "../../../constants/proposals";
import { db } from "../../../firebase";

// This is the raw PDF page: only to be accessed by puppeteer from Cloud Functions
// Users should not be able to reach this page. Currently, they can
export default function RawPDF() {
  const router = useRouter();

  const docRef = doc(db, `proposals/${router.query.id}`);
  const pagesRef = query(
    collection(db, `proposals/${router.query.id}/pages`),
    orderBy("index")
  );
  const [pages] = useCollection(pagesRef);
  const [proposalData] = useDocument(docRef);

  if (!proposalData || !pages) return <></>;

  return (
    <>
      {pages.docs.map((page: any) => (
        <div
          key={page.data().index}
          className="bg-white w-[612pt] h-[792pt] font-['Inter'] relative text-black mx-auto p-0"
        >
          {cloneElement(TEMPLATES[page.data().pageID - 1], {
            proposalData: proposalData.data(),
            pageData: page.data(),
            pageDocRef: doc(
              db,
              `proposals/${router.query.id}/pages/${page.id}`
            ),
          })}
        </div>
      ))}
    </>
  );
}

// Can't have the header showing in the final exported PDF ;)
// Check out this implementation from /pages/_app.tsx
RawPDF.getLayout = (page: any) => <div>{page}</div>;
