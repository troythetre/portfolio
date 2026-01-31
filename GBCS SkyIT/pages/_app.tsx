import { ColorSchemeProvider, ColorScheme, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from '@mantine/notifications';
import { NextComponentType, NextPageContext } from "next";
import "../styles/globals.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { useColorScheme } from "@mantine/hooks";
import { AppProps } from "next/app";
import SettingsLayout from "../layouts/SettingsLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import { FormDataProvider } from "../components/sectionA/NewProposal/FormDataContext";
import FeedbackButton from '../components/Feedback/FeedbackButton';

// Define a custom type for Next.js component with getLayout property
type NextComponentWithLayout = NextComponentType<NextPageContext, any, any> & {
    getLayout?: (page: JSX.Element) => JSX.Element;
};

export default function MyApp({ Component, pageProps }: AppProps) {
    const darkScheme: ColorScheme = "dark";
    const preferredColorScheme = useColorScheme(darkScheme);
    const [colorScheme, setColorScheme] = useState(preferredColorScheme);
    const router = useRouter();

    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    const noLayoutRoutes = ["/", "/login", "/error", "/style-guide"]; //remove navbar 
    const noFeedbackButtonRoutes = ["/", "/login", "/error", "/style-guide"]; //remove feedback button

    const getLayout =
        (Component as NextComponentWithLayout).getLayout ||
        ((page: JSX.Element) =>
            noLayoutRoutes.includes(router.pathname) ? (
                page
            ) : router.pathname.startsWith("/settings") ? (
                <SettingsLayout>{page}</SettingsLayout>
            ) : (
                <DefaultLayout>{page}</DefaultLayout>
            ));

    return (
        <>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        colorScheme,
                    }}
                >
                    <NotificationsProvider position="top-right" zIndex={2077}>
                        <FormDataProvider>
                            {getLayout(<Component {...pageProps} />)}
                            {!noFeedbackButtonRoutes.includes(router.pathname) && <FeedbackButton />}
                        </FormDataProvider>
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
        
    );
}
