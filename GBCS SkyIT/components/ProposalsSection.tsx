import {
  ActionIcon,
  AspectRatio,
  BackgroundImage,
  Group,
  Paper,
  ScrollArea,
  Text,
  Badge,
  Title,
} from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { LETTER_ASPECT_RATIO } from "../constants/proposals";
import { Trash } from "tabler-icons-react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase.js";

// Section used in index.tsx to display user's published and drafted proposals
export default function ProposalsSection() {
  // Get proposals that are ownedb by/shared with user
  // Memoized because uid must be fetched from session before fetching data
  const uid = auth.currentUser?.uid;
  const proposalsQS = useMemo(
    () =>
      uid
        ? query(
          collection(db, "proposals"),
          orderBy("createdAt", "desc"),
          where(
            "sharedWith",
            "array-contains-any",
            Array("viewer", "owner", "editor").map((role) => ({
              uid,
              role,
            }))
          )
        )
        : null,
    [uid]
  );
  const [proposals] = useCollection(proposalsQS);

  // Proposal covers
  const [covers, setCovers] = useState({});
  useEffect(() => {
    async function generateCovers(proposals) {
      const newCovers = await Promise.all(
        proposals.docs.map(async (doc) => {
          const ownerUid = doc
            .data()
            .sharedWith.find(
              ({ role }: { role: string }) => role === "owner"
            )?.uid;
          try {
            const url = await getDownloadURL(
              ref(storage, `${ownerUid}/proposals/${doc.id}/cover`)
            );
            return {
              id: doc.id,
              url,
            };
          } catch (e) {
            if (e.code === "storage/object-not-found") {
              console.error("File not found");
            } else console.error(e);
          }
        })
      );
      // Set the covers based on key-value pairs of proposal id and cover url
      setCovers(
        newCovers.reduce((acc, curr) => {
          if (curr) {
            acc[curr.id] = curr.url;
          }
          return acc;
        }, {})
      );
    }
    if (proposals) generateCovers(proposals);
  }, [proposals]);

  return (
    <>
      <Title order={3} className="mb-4">
        Proposals
      </Title>
      <Paper className="rounded-lg" withBorder>
        <ScrollArea>
          {proposals?.docs.length > 0 ? (
            <Group noWrap className="p-10">
              {proposals?.docs.map((proposal: any) => (
                <AspectRatio
                  ratio={LETTER_ASPECT_RATIO}
                  key={proposal.id}
                  className="bg-gray-300 w-48 z-0 relative group overflow-hidden rounded-md ring-1 ring-gray-300 shadow-md hover:shadow-xl transition-all hover:scale-105 duration-300 ease-in-out"
                >
                  <Badge
                    className="absolute !top-3 !left-3 !bottom-auto !right-auto !w-auto !h-auto z-10 shadow-md"
                    variant="filled"
                    color={
                      proposal.data().status === "published" ? "green" : "blue"
                    }
                  >
                    {proposal.data().status}
                  </Badge>
                  <ActionIcon
                    variant="filled"
                    color="red"
                    onClick={async () => {
                      const pages = await getDocs(
                        collection(db, `proposals/${proposal.id}/pages`)
                      );
                      pages.docs.forEach(async (page) => {
                        await deleteDoc(
                          doc(db, `proposals/${proposal.id}/pages/${page.id}`)
                        );
                      });
                      await deleteDoc(doc(db, `proposals/${proposal.id}`));
                    }}
                    className="!right-3 !top-3 !w-auto !h-auto !left-auto !bottom-auto z-10 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash />
                  </ActionIcon>
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.id}/edit`}
                  >
                    <BackgroundImage
                      src={
                        covers[proposal.id] ||
                        "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png"
                      }
                      className="w-full h-full cursor-pointer relative"
                    >
                      <div className="absolute bottom-0 right-0 left-0 bg-black/50 p-2 bg-gradient-to-t from-black text-white">
                        <Text>{proposal.data().name}</Text>
                        <Text color="dimmed" size="sm">
                          Created{" "}
                          {new Date(
                            proposal.data().createdAt?.seconds * 1000
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Text>
                      </div>
                    </BackgroundImage>
                  </Link>
                </AspectRatio>
              ))}
            </Group>
          ) : (
            <Title align="center" order={4}>
              No Proposals
            </Title>
          )}
        </ScrollArea>
      </Paper>
    </>
  );
}
