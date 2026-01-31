import { useEffect } from "react";
import { useQuill } from "react-quilljs";
import { auth } from "../../firebase";
import "quill/dist/quill.snow.css";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { WebsocketProvider } from "y-websocket";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMantineTheme } from "@mantine/core";

export default function QuillEditor({
  roomName,
  opened,
  initialValue,
  setFirestoreDoc,
}: {
  roomName: string;
  opened: boolean;
  initialValue: string;
  setFirestoreDoc: (newValue: string) => void;
}) {
  const [user] = useAuthState(auth);
  const theme = useMantineTheme();
  const { quill, quillRef, Quill } = useQuill({
    modules: {
      cursors: true,
      toolbar: [
        // adding some basic Quill content features
        ["bold", "italic", "underline"],
        [
          {
            align: [],
          },
        ],
      ],
      history: {
        // Local undo shouldn't undo changes
        // from remote users
        userOnly: true,
      },
    },
    placeholder: "Insert body text here...",
  });

  if (Quill && !quill) {
    const QuillCursors = require("quill-cursors");
    Quill.register("modules/cursors", QuillCursors);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (quill && initialValue !== quill.root.innerHTML)
        setFirestoreDoc(quill.root.innerHTML);
    }, 3000);
    return () => clearInterval(timer);
  });

  useEffect(() => {
    if (quill && opened) {
      // A Yjs document holds the shared data
      const ydoc = new Y.Doc();
      // const provider = new WebrtcProvider(roomName, ydoc);
      const provider = new WebsocketProvider(
        "ws://localhost:1234",
        roomName,
        ydoc
      );
      // Define a shared text type on the document
      const ytext = ydoc.getText("quill");
      // "Bind" the quill editor to a Yjs text type.
      new QuillBinding(ytext, quill, provider.awareness);

      const setDefaultVal = () => {
        quill.root.innerHTML = initialValue;
      };

      if (provider.synced) {
        setDefaultVal();
      } else {
        provider.once("synced", setDefaultVal);
      }

      provider.awareness.setLocalStateField("user", {
        name: user?.displayName,
        color: Object.values(theme.colors).map((colorArray) => colorArray[5])[
          Math.floor(Math.random() * Object.keys(theme.colors).length)
        ],
      });
    }
  }, [quill]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-white text-black">
      <div ref={quillRef} />
    </div>
  );
}
