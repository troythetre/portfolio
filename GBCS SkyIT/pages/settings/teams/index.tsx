import { Button, Title, Group, Stack } from "@mantine/core";
import { collection, query, where } from "firebase/firestore";
import { NextPage } from "next";
import { useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase";
import Link from "next/link";

export const TeamsPage: NextPage = () => {
  const uid = auth.currentUser?.uid;
  const collectionRef = useMemo(
    () =>
      uid
        ? query(
            collection(db, "teams"),
            where(
              "members",
              "array-contains-any",
              Array("viewer", "admin", "editor").map((role) => ({
                role,
                uid,
              }))
            )
          )
        : null,
    [uid]
  );
  const [teams] = useCollection(collectionRef);
  return (
    <>
      <Stack>
        <Group position="apart">
          <Title order={2}>Teams</Title>
          <Link href="/settings/teams/create">
            <Button component="a">Create Team</Button>
          </Link>
        </Group>
        {teams?.docs.map((team) => (
          <Link href={`/settings/teams/${team.id}`} key={team.id}>
            <Button variant="default" component="a">
              {team.data().name}
            </Button>
          </Link>
        ))}
      </Stack>
    </>
  );
};

export default TeamsPage;
