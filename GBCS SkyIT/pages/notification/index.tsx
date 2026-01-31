import {
  UnstyledButton,
  Text,
  Button,
  Group,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db, storage } from "../../firebase";
import {
  getStorage,
  ref,
  listAll,
  list,
  getDownloadURL,
} from "firebase/storage";

export default function Notification() {
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, "priceQuotes"));
      const quotesArray:
        | ((prevState: never[]) => never[])
        | { id: string; status: any; createdAt: any }[] = [];
      querySnapshot.forEach((doc) => {
        if (
          doc?._document.data.value.mapValue.fields.status &&
          (doc._document.data.value.mapValue.fields.status?.stringValue ===
            "pending approval") |
            (doc._document.data.value.mapValue.fields.status?.stringValue ===
              "edit request")
        ) {
          quotesArray.push({
            id: doc.id,
            status: doc._document.data.value.mapValue.fields.status,
            createdAt:
              doc._document.data.value.mapValue.fields.createdAt.timestampValue,
          });
        }
      });
      setQuotes(quotesArray);

      const messageRef = doc(db, "priceQuotes/2E8SUYi0LuJ0uvkb9MMg");
      console.log(messageRef);

      console.log(querySnapshot);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [loading]);

  async function approvalHandler(quoteId: string) {
    setLoading(true);
    try {
      const priceQuoteRef = doc(db, "priceQuotes", quoteId);
      const res = await setDoc(
        priceQuoteRef,
        { status: "approved" },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function declineHandler(quoteId: string) {
    setLoading(true);
    try {
      const priceQuoteRef = doc(db, "priceQuotes", quoteId);
      const res = await setDoc(
        priceQuoteRef,
        { status: "decline" },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  async function editHandler(quoteId: string) {
    setLoading(true);
    try {
      const priceQuoteRef = doc(db, "priceQuotes", quoteId);
      const res = await setDoc(
        priceQuoteRef,
        { status: "edit request" },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  async function approvalAndDownloadPDF(quotedId: string) {
    const authUid = auth.lastNotifiedUid;
    const listRef = ref(storage, `${authUid}/priceQuotes/${quotedId}`);
    const allFiles = [];
    await listAll(listRef).then((res) => {
      res.prefixes.forEach((folderRef) => {});
      res.items.forEach((itemRef) => {
        allFiles.push(itemRef);
      });
    });
    const filePath = allFiles[0]._location.path_;

    getDownloadURL(ref(storage, `${filePath}`)).then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open("GET", url);
      xhr.send();
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = url.substr(url.lastIndexOf("/") + 1);
      link.click();
    });

    approvalHandler(quotedId);
  }

  if (!quotes) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>Current Pending Price Quotes</h1>
      <Stack>
        {quotes.map((quote) => (
          <Group key={quote.id}>
            <UnstyledButton
              className="grow"
              onClick={() => {
                router.push(`/price-quotes/${quote.id}/edit`);
              }}
            >
              <Paper withBorder shadow="md" p="md">
                <Title order={3}>Quote ID: {quote.id}</Title>

                <Text>
                  {quote.createdAt} | Status: {"  "}
                  <strong>{quote.status.stringValue}</strong>
                </Text>
              </Paper>
            </UnstyledButton>
            <Group position="right">
              <Button
                color="green"
                onClick={() => approvalAndDownloadPDF(quote.id)}
              >
                Approve and Download
              </Button>
              <Button color="red" onClick={() => declineHandler(quote.id)}>
                Decline
              </Button>
              <Button color="gray" onClick={() => editHandler(quote.id)}>
                Edit Request
              </Button>
            </Group>
          </Group>
        ))}
      </Stack>
      <br />
      <h1>Edit Request Price Quotes</h1>
      <Stack></Stack>
    </div>
  );
}
