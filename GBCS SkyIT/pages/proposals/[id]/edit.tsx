import React, { useEffect, useMemo, cloneElement } from "react";
import {
  Select,
  TextInput,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  ColorInput,
  Spoiler,
  Divider,
} from "@mantine/core";
import {
  doc,
  deleteDoc,
  collection,
  updateDoc,
  query,
  orderBy,
  where,
  documentId,
} from "firebase/firestore";
import { db, functions } from "../../../firebase";
import { useRouter } from "next/router";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useForm } from "@mantine/form";
import { TEMPLATES } from "../../../constants/proposals";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { nanoid } from "nanoid";

interface FormValues {
  softwareName: string;
  companyName: string;
  industryType: string;
}

export default function EditDraft() {
  const router = useRouter();

  // Callable Cloud Functions
  const [savePDF] = useHttpsCallable(functions, "saveProposalPDF");

  // References + Data Queries
  const docRef = doc(db, `proposals/${router.query.id}`);
  const pagesRef = query(
    collection(db, `proposals/${router.query.id}/pages`),
    orderBy("index")
  );
  const [pages] = useCollection(pagesRef);
  const [proposalData] = useDocument(docRef);
  const responsesRef = useMemo(
    () =>
      proposalData?.id && pages?.docs.length
        ? query(
            collection(db, "responses"),
            where(
              documentId(),
              "in",
              pages.docs.map((doc) => doc.data().responseID)
            )
          )
        : null,
    [proposalData, pages]
  );
  const [responses] = useCollection(responsesRef);

  // State
  const proposalName = useMemo(
    () => (proposalData ? proposalData.data().name : "Fetching Proposal Name"),
    [proposalData]
  );
  const form = useForm<FormValues>({
    initialValues: {
      softwareName: "",
      companyName: "",
      industryType: "",
    },
  });

  // Effects
  useEffect(() => {
    form.setValues(proposalData?.data()?.placeholders || {});
  }, [proposalData]); // eslint-disable-line

  return (
    <>
      {/* Top Section: PDF Configuration */}
      <Group position="apart">
        <TextInput
          placeholder="Proposal Name"
          size="lg"
          defaultValue={proposalData?.data().name}
          value={proposalName}
          onChange={async (e) => {
            await updateDoc(docRef, { name: e.target.value });
          }}
        />
        <Button
          color="red"
          onClick={() => {
            deleteDoc(doc(db, "proposals", router.query.id));
            router.push("/");
          }}
        >
          Delete Draft
        </Button>
      </Group>

      {/* Placeholders to replace response answer strings */}
      <Group grow noWrap align="flex-start" my="xl">
        <Stack>
          <div>
            <Title order={2}>Configure Variables</Title>
            <Text color="dimmed">
              Replacing variable names surrounded by ‘$’
            </Text>
          </div>
          <form
            onSubmit={form.onSubmit(async (values) => {
              await updateDoc(docRef, {
                placeholders: values,
              });
            })}
          >
            <Stack spacing="md">
              <TextInput
                label="Software Name"
                required
                {...form.getInputProps("softwareName")}
              />
              <TextInput
                label="Company Name"
                required
                {...form.getInputProps("companyName")}
              />
              <TextInput
                label="Industry Type"
                required
                {...form.getInputProps("industryType")}
              />
              <Button type="submit" className="self-end">
                Submit
              </Button>
            </Stack>
          </form>
        </Stack>

        {/* Responses selected that determine page order. Pages can be added, reordered, or hidden here */}
        <Stack>
          <div>
            <Title order={2}>Selected Responses</Title>
            <Text color="dimmed">Tip: Rearrange to determine page order</Text>
          </div>
          {pages?.docs.map((page: any, index: number) => {
            const response = responses?.docs.find(
              (response) => response.id === page.data().responseID
            );
            if (response)
              return (
                <Paper withBorder p="md" key={index} shadow="sm">
                  <Group noWrap mb="xs">
                    <Title order={4}>
                      {response.data().question || "No Question"}
                    </Title>
                    <Select
                      defaultValue={"1"}
                      data={[
                        { value: "1", label: "Template 1" },
                        { value: "2", label: "Template 2" },
                        { value: "3", label: "Template 3" },
                        { value: "4", label: "Template 4" },
                        { value: "5", label: "Template 5" },
                      ]}
                    />
                  </Group>
                  <Spoiler maxHeight={18} showLabel="Show" hideLabel="Hide">
                    <Text size="sm">
                      {response
                        .data()
                        .answer.toString()
                        .replace(
                          /\$software_name\$/g,
                          proposalData.data().placeholders?.softwareName
                        )
                        .replace(
                          /\$company_name\$/g,
                          proposalData.data().placeholders?.companyName
                        )
                        .replace(
                          /\$industry_type\$/g,
                          proposalData.data().placeholders?.industryType
                        )}
                    </Text>
                  </Spoiler>
                </Paper>
              );
          })}
        </Stack>
      </Group>

      <Divider my="lg" />

      {/* Bottom Section: Interactive PDF */}
      {pages && proposalData && (
        <Stack align="center" spacing="lg" py="xl">
          <Title order={1}>Output PDF</Title>
          <ColorInput
            label="Primary Color"
            value={proposalData.data()?.primaryColor}
            onChange={async (color: string) => {
              await updateDoc(docRef, {
                globalColor: color,
              });
            }}
            placeholder="Pick color"
            disallowInput
            withPicker={false} // The colors should always be a good background for white text (AAA contrast ratio)
            defaultValue="#123D60"
            swatches={["#123D60", "#30543D"]} // Add new colors here dependant on client brand
          />
          {/* This button saves to Cloud Storage for now, we ideally need it to mark the PDF status as "published" and allow users to download it */}
          <Button
            onClick={() =>
              savePDF({
                id: router.query.id,
                name:
                  proposalData.data()?.name || `${nanoid()}_${router.query.id}`,
              })
            }
          >
            Export PDF
          </Button>
          {pages.docs.map((page: any) => (
            // Page identifiers start at 1, so the index is +1
            // Page index is used to determine the order of the pages
            <div
              key={page.data().index}
              className="bg-white w-[612pt] h-[792pt] rounded-md shadow-lg font-['Inter'] relative text-black"
            >
              {cloneElement(TEMPLATES[page.data().pageID - 1], {
                proposalData: { ...proposalData.data(), id: router.query.id },
                pageData: { ...page.data(), id: page.id },
                pageDocRef: doc(
                  db,
                  `proposals/${router.query.id}/pages/${page.id}`
                ),
              })}
            </div>
          ))}
        </Stack>
      )}
    </>
  );
}
