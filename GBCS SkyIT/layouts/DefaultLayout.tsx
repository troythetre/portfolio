import MediaManagerProvider from "../contexts/MediaManagerProvider";
import Header from "../components/Header";
import {AppShell} from "@mantine/core";
import {useRouter} from "next/router";

export default function DefaultLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    
    return router.pathname !== "/login" ? (
        <MediaManagerProvider>
            <AppShell header={<Header />}>
                <div className="">{children}</div>
            </AppShell>
        </MediaManagerProvider>
    ) : (
        <MediaManagerProvider>
            <AppShell padding={0}>
                <div className="">{children}</div>
            </AppShell>
        </MediaManagerProvider>
    );
}
