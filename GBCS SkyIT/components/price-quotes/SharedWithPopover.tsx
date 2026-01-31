import {
  Popover,
  Stack,
  Select,
  Group,
  Text,
  Button,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { useForm, formList } from "@mantine/form";
import { collection, doc, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Trash } from "tabler-icons-react";
import { auth, db } from "../../firebase";

export const SharedWithPopover = ({
  teamId,
  sharedWith,
  onSubmit,
}: {
  teamId: string;
  sharedWith: { email: string; role: string }[];
  onSubmit: (values: any) => void;
}) => {
  const uid = auth.currentUser?.uid;
  const [opened, setOpened] = useState(false);
  const userTeamsQuery = useMemo(
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
  const [userTeams, loading] = useCollection(userTeamsQuery);
  const form = useForm({
    initialValues: {
      teamId: "",
      sharedWith: formList([]),
    },
  });

  useEffect(() => {
    if (teamId) {
      form.setFieldValue("teamId", teamId);
    }
    if (sharedWith) {
      form.setFieldValue("sharedWith", formList(sharedWith));
    }
  }, [teamId, sharedWith]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Popover
        opened={opened}
        onClose={() => setOpened(false)}
        target={<Button onClick={() => setOpened(true)}>Share</Button>}
        position="bottom"
        withArrow
      >
        {loading ? (
          "Loading..."
        ) : (
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Group align="flex-start">
              <Select
                clearable
                label="Team:"
                placeholder="No Team Selected"
                data={
                  userTeams?.docs.map((doc) => ({
                    value: doc.id,
                    label: doc.data()?.name,
                  })) || []
                }
                {...form.getInputProps("teamId")}
              />
              <Stack className="border-solid border-0 border-l border-gray-600/50 pl-4">
                <Text weight={500} size="sm">
                  Individuals
                </Text>
                {form.values.sharedWith.map((_, index) => (
                  <Group key={index}>
                    <TextInput
                      placeholder="Enter email"
                      type="email"
                      {...form.getListInputProps("sharedWith", index, "email")}
                    />
                    <Select
                      placeholder="Select role"
                      data={[
                        { value: "viewer", label: "Viewer" },
                        { value: "editor", label: "Editor" },
                        { value: "admin", label: "Admin" },
                      ]}
                      {...form.getListInputProps("sharedWith", index, "role")}
                    />
                    <ActionIcon
                      color="red"
                      variant="hover"
                      onClick={() => form.removeListItem("sharedWith", index)}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  color="green"
                  onClick={() =>
                    form.addListItem("sharedWith", {
                      email: "",
                      role: "viewer",
                    })
                  }
                >
                  Add Invite
                </Button>
              </Stack>
            </Group>
            <Button mt="lg" onClick={() => onSubmit(form.values)} fullWidth>
              Submit
            </Button>
          </form>
        )}
      </Popover>
    </>
  );
};

export default SharedWithPopover;
