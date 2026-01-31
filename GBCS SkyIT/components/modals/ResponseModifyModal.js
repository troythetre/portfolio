import {
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

// THIS COMPONENT IS NOT YET IMPLEMENTED
export default function ResponseModifyModal(
  setModalOpened,
  editing,
  setEditing,
  ...modalProps
) {
  const [formLoading, setFormLoading] = useState(false);
  const form = useForm({
    initialValues: {
      question: "",
      answer: "",
      type: "",
      software_name: "",
      topic: "",
      sub_topic: "",
    },
    validate: {
      question: (value) =>
        value.length < 3
          ? "Question must be at least 3 characters long"
          : value === editing?.question
          ? "Question cannot be the same as the existing question"
          : undefined,
      answer: (value) =>
        value.length < 3
          ? "Answer must be at least 3 characters long"
          : value === editing?.answer
          ? "Answer cannot be the same as the existing question"
          : undefined,
      topic: (value) => (value.length ? undefined : "Topic must be selected"),
      sub_topic: (value) =>
        value.length ? undefined : "Sub-topic must be selected",
      software_name: (value) =>
        value.length ? undefined : "Software name must be selected",
      type: (value) => (value.length ? undefined : "Type must be selected"),
    },
  });

  return (
    <Modal {...modalProps}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          setFormLoading(true);
          if (editing)
            await updateDoc(doc(db, "responses", editing?.id), values);
          else await addDoc(collection(db, "responses"), values);
          showNotification({
            title: `Successfully ${editing ? "updated" : "added"} response`,
            color: "green",
          });
          setModalOpened(false);
          setFormLoading(false);
          setEditing(null);
          form.reset();
        })}
      >
        <Group className="gap-y-4" direction="column" align="stretch">
          <TextInput
            label="Question"
            required
            {...form.getInputProps("question")}
          />
          <Textarea label="Answer" required {...form.getInputProps("answer")} />
          <SimpleGrid cols={2}>
            <Select
              label="Type"
              required
              data={[
                { value: "RFP", label: "RFP" },
                { value: "Application", label: "Application" },
              ]}
              {...form.getInputProps("type")}
            />
            <Select
              label="Software"
              required
              data={[
                { value: "Orion", label: "Orion" },
                { value: "Aukai", label: "Aukai" },
                { value: "Lokomotive", label: "Lokomotive" },
              ]}
              {...form.getInputProps("software_name")}
            />
            <Select
              label="Topic"
              required
              data={[
                {
                  value: "Company Information",
                  label: "Company Information",
                },
              ]}
              {...form.getInputProps("topic")}
            />
            <Select
              label="Sub-Topic"
              required
              data={[{ value: "CRA", label: "CRA" }]}
              {...form.getInputProps("sub_topic")}
            />
          </SimpleGrid>
          <Button
            fullWidth
            type="submit"
            className="mt-3"
            loading={formLoading}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
