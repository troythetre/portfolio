import {
  Button,
  Group,
  Popover,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { updateDoc } from "firebase/firestore";
import { useState } from "react";

// Editing a single plain text field such as a header
export default function HeaderEdit({
  heading,
  pageDocRef,
  ...paragraphProps
}: any) {
  const [opened, setOpened] = useState(false);
  const form = useForm<any>({
    initialValues: {
      heading,
    },
  });

  return (
    <Popover
      opened={opened}
      onClose={() => {
        setOpened(false);
        form.reset();
      }}
      target={
        <UnstyledButton
          onClick={() => setOpened(true)}
          style={{
            fontSize: "inherit",
            fontWeight: "inherit",
            color: "inherit",
          }}
          className="hover:bg-black/25 hover:ring-8 ring-black/25 rounded-md transition"
        >
          <p {...paragraphProps}>{form.values.heading}</p>
        </UnstyledButton>
      }
      position="bottom"
      withArrow
    >
      <form
        onSubmit={form.onSubmit(async ({ heading }) => {
          await updateDoc(pageDocRef, {
            heading,
          });
          setOpened(false);
        })}
      >
        <Group>
          <TextInput
            placeholder="Header"
            required
            {...form.getInputProps("heading")}
          />
          <Button type="submit">Save</Button>
        </Group>
      </form>
    </Popover>
  );
}
