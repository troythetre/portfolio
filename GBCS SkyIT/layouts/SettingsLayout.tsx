import { Button, Divider, Group, Stack } from "@mantine/core";
import Link from "next/link";
import DefaultLayout from "./DefaultLayout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <h1>Settings</h1>
      <Group align="flex-start">
        <Stack>
          <Link href="/settings/teams">
            <Button component="a" variant="outline">
              Teams
            </Button>
          </Link>
        </Stack>
        <div className="grow">{children}</div>
      </Group>
    </DefaultLayout>
  );
}
