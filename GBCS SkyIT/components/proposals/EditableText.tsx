import { Popover, UnstyledButton } from "@mantine/core";
import { updateDoc } from "firebase/firestore";
import { useState } from "react";
import QuillEditor from "./QuillEditor";

interface EditableTextProps {
  className?: string;
  text: string;
  pageRef: FirebaseFirestore.DocumentReference;
  roomName: string;
}

// A popover wrapper for the QuillEditor component
export default function EditableText({
  className,
  text,
  pageRef,
  roomName,
}: EditableTextProps) {
  const [opened, setOpened] = useState(false);

  // Quill text is stored as HTML
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <UnstyledButton
          className="text-sm w-full min-h-[1rem] text-black hover:bg-black/25 hover:ring-4 ring-black/25 rounded-sm transition"
          onClick={() => setOpened(true)}
          dangerouslySetInnerHTML={{ __html: text }}
          sx={{
            p: {
              lineHeight: "1.5",
            },
            ".ql-align-right": {
              textAlign: "right",
            },
            ".ql-align-center": {
              textAlign: "center",
            },
            ".ql-align-left": {
              textAlign: "left",
            },
          }}
        ></UnstyledButton>
      }
      position="bottom"
      withArrow
      className={className}
    >
      <QuillEditor
        roomName={roomName}
        opened={opened}
        initialValue={text}
        setFirestoreDoc={async (body) => {
          await updateDoc(pageRef, {
            body,
          });
        }}
      />
    </Popover>
  );
}
