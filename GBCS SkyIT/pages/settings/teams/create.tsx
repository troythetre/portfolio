import { useForm, formList } from "@mantine/form";
import { NextPage } from "next";
import {
  Select,
  TextInput,
  Group,
  ActionIcon,
  Text,
  Button,
} from "@mantine/core";
import { Trash } from "tabler-icons-react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useRouter } from "next/router";
import { EmailAuthCredential } from "firebase/auth";

export const CreateNewTeam: NextPage = () => {
  const uid = auth.currentUser?.uid;
  const router = useRouter();
  const form = useForm({
    initialValues: {
      name: "",
      invitees: formList([{ email: "", role: "viewer" }]),
      picture: "",
    },
  });

  const fields = form.values.invitees.map((_, index) => (
    <Group key={index} mt="xs">
      <TextInput
        placeholder="Email"
        type="email"
        required
        sx={{ flex: 1 }}
        {...form.getListInputProps("invitees", index, "email")}
      />
      <Select
        placeholder="Role"
        data={[
          { value: "viewer", label: "Viewer" },
          { value: "editor", label: "Editor" },
          { value: "admin", label: "Admin" },
        ]}
        {...form.getListInputProps("invitees", index, "role")}
      />
      <ActionIcon
        color="red"
        variant="hover"
        onClick={() => form.removeListItem("invitees", index)}
      >
        <Trash size={16} />
      </ActionIcon>
    </Group>
  ));

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        await addDoc(collection(db, "teams"), {
          ...values,
          members: [{ uid, role:"admin" }],
        });
        router.push("/settings/teams");
      })}
    >
      {fields.length === 0 && (
        <Text color="dimmed" align="center">
          Add some invitees!
        </Text>
      )}

      <TextInput
        placeholder="Team Name"
        required
        {...form.getInputProps("name")}
      />
      {fields}


      <Group position="center" mt="md">
        <Button
          onClick={() =>
            form.addListItem("invitees", { email:"", role: "viewer" })
            
          }
          variant="default"
        >
          Add member
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default CreateNewTeam;
