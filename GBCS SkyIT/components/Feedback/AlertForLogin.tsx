import { Alert, Button, Group } from "@mantine/core";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AlertForLogin() {
  const router = useRouter();
  return (
    <div className="container">
      
      <Group position="center">
        <Alert title="Alert!" color="red">
          Please login in to see feedback!
        </Alert>
        <Link href="/login">
          <Button
            size="xl"
            variant={router.pathname === "/login" ? "filled" : "subtle"}
          >
            Login
          </Button>
        </Link>
      </Group>
    </div>
  );
}
