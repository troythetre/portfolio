import { Divider, SimpleGrid, Title } from "@mantine/core";

export default function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Divider my="md" />
      <Title order={2}>{title}</Title>
      <SimpleGrid cols={4}>{children}</SimpleGrid>
    </>
  );
}
