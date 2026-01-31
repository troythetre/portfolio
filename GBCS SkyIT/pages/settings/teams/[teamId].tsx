import { Stack, Button, Title } from "@mantine/core";
import { create } from "domain";
import { doc } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../../../firebase";

export const TeamPage: NextPage = () => {
  const router = useRouter();
  const [team, loading] = useDocument(doc(db, `teams/${router.query.teamId}`));

  if (loading) return <div>Loading...</div>;
  if (team?.data())
    return (
      <>
        <Title order={3} mb="lg">
          {team.data()?.name}
        </Title>
        <Stack align="flex-start">
          <Title order={4}>Members</Title>
          <ul>
            {team.data()?.members.map(({ uid, role }) => (
              <li key={uid}>
                {uid === auth.currentUser?.uid ? "You" : uid} ({role})
              </li>
            ))}
          </ul>

          <ul>
            {team.data()?.invitees.map(({ email, role }) => (
              <li key={email}>
                {email} ({role})
              </li>
            ))}
          </ul>

       
          <Button>Invite</Button>
        </Stack>
        
      </>
    );
};

export default TeamPage;
