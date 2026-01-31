import {
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Pagination,
  UnstyledButton,
} from "@mantine/core";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "../../components/sectionA/NewProposal/FormDataContext";
import { useState } from "react";
import { db } from "../../firebase";
export default function Index() {
  const router = useRouter();
  const { user } = useUser();
  const [quotes] = useCollection(collection(db, "priceQuotes"));
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedQuotes = quotes?.docs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = quotes ? Math.ceil(quotes.docs.length / itemsPerPage) : 1;

  return (
    <>
      <Stack className="px-[12%] py-[2%]">
        <div className="flex justify-between">
          <div>
            <Title className="text-white">Price Quotes</Title>
            <p>View Existing Price Quotes</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#FFD400] to-[#FFAA01] text-black font-bold"
            onClick={async () => {
              const newQuote = await addDoc(collection(db, "priceQuotes"), {
                hiddenColumns: [],
                hiddenRows: [],
                hiddenTables: [],
                createdAt: serverTimestamp(),
                sharedWith: [
                  {
                    email: user.userEmail,
                    role: "editer",
                  },
                ],
                teamId: "",
              });
              router.push(`/price-quotes/${newQuote.id}/edit`);
            }}
          >
            Create Price Quote
          </Button>
        </div>

        {paginatedQuotes?.map((quote) => (
          <Group key={quote.id}>
            <Paper withBorder shadow="md" p="md" className="w-full">
              <Group position="apart" align="center">
                {/* Left side: Quote info (clickable) */}
                <UnstyledButton
                  className="flex-grow text-left"
                  onClick={() => {
                    router.push(`/price-quotes/${quote.id}/edit`);
                  }}
                >
                  <Title order={3} className="mantine-Text-root ">
                    <span className="text-[#DEBF1A]">Quote ID: </span>
                    {quote.id}
                  </Title>
                  <Text>
                    {new Date(
                      quote.data().createdAt?.seconds * 1000
                    ).toLocaleString("en-US", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Text>
                </UnstyledButton>
                <Button
                  color="red"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await deleteDoc(doc(db, `priceQuotes/${quote.id}`));
                  }}
                >
                  Delete
                </Button>
              </Group>
            </Paper>
          </Group>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <Group position="center" mt="md">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              color="yellow"
              mt="sm"
              radius="md"
            />
          </Group>
        )}
      </Stack>
    </>
  );
}
