import { useMemo, useRef } from "react";
import { useGlobalFilter, useRowSelect, useTable } from "react-table";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db, functions } from "../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import Table from "./Table";
import GlobalFilter from "./GlobalFilter";
import { CSVLink } from "react-csv";
import { Button, Checkbox, Group } from "@mantine/core";
import { useRouter } from "next/router";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";

// Response Section that houses the Response Table
export default function ResponseSection() {
  const router = useRouter();
  const [importCSV, executing] = useHttpsCallable(
    functions,
    "importResponseCSV"
  );

  // Get all responses where the user is the owner
  const uid = auth.currentUser?.uid;
  const responsesQS = useMemo(
    () =>
      uid
        ? query(collection(db, "responses"), where("owner", "==", uid))
        : null,
    [uid]
  );
  const [responses] = useCollection(responsesQS);

  // Dropzone for uploading CSV (without drag and drop)
  const dropzoneRef = useRef<() => void>();

  // Table Data for responses
  const data = useMemo(
    () =>
      responses
        ? responses.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        : [],
    [responses]
  );

  const columns = useMemo(
    () => [
      { Header: "Question", accessor: "question" },
      { Header: "Answer", accessor: "answer" },
      { Header: "Software", accessor: "softwareName" },
      { Header: "Topic", accessor: "topic" },
      { Header: "Sub-Topic", accessor: "subTopic" },
    ],
    []
  );

  // React table instance that allows row selection and global search/filtering
  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <Checkbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  // Props to be passed down to child components
  const { state, setGlobalFilter, selectedFlatRows } = tableInstance;

  return (
    <>
      <Group mt="xl" mb="md">
        {/* Search Box */}
        <GlobalFilter
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {/* CSV Export */}
        <CSVLink
          data={data}
          headers={columns.map(({ Header: label, accessor: key }) => ({
            label,
            key,
          }))}
        >
          <Button>Export CSV</Button>
        </CSVLink>
        {/* CSV Import */}
        <Dropzone
          onDrop={(files) => {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
              importCSV({ csvText: e.target.result });
            };
            reader.readAsText(file);
          }}
          accept={[MIME_TYPES.csv]}
          openRef={dropzoneRef}
          className="hidden"
        >
          {() => null}
        </Dropzone>
        <Button onClick={() => dropzoneRef.current()}>
          {executing ? "Loading..." : "Import CSV"}
        </Button>
        <Button>Create Response</Button>
        {/* Allow users to delete responses if responses are selected */}
        {/* Allow users to create a proposal if responses are selected */}
        {selectedFlatRows.length > 0 && (
          <>
            <Button
              onClick={() => {
                selectedFlatRows.forEach(
                  async ({ original }) =>
                    await deleteDoc(doc(db, "responses", original.id))
                );
              }}
            >
              Delete Response{selectedFlatRows.length > 1 && "s"}
            </Button>
            <Button
              onClick={async () => {
                const newDraft = await addDoc(collection(db, "proposals"), {
                  createdAt: serverTimestamp(),
                  status: "draft",
                  name: "Untitled Proposal",
                  sharedWith: [
                    {
                      uid,
                      role: "owner",
                    },
                  ],
                });
                selectedFlatRows.forEach(
                  async ({ original }: any, index: number) =>
                    await addDoc(
                      collection(db, "proposals", newDraft.id, "pages"),
                      {
                        index,
                        responseID: original.id,
                        pageID: 1,
                        photos: [],
                        heading: "Insert Text",
                        body: "",
                      }
                    )
                );
                router.push(`/proposals/${newDraft.id}/edit`);
              }}
            >
              Create Proposal
            </Button>
          </>
        )}
      </Group>
      <Table tableInstance={tableInstance} />
    </>
  );
}
