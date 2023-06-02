import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CssBaseline, IconButton, ThemeProvider } from "@mui/material";
import {
  Hydrate as RQHydrate,
  QueryClient as RQQueryClient,
  QueryClientProvider as RQQueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools as RQReactQueryDevtools } from "@tanstack/react-query-devtools";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { closeSnackbar, SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import theme from "../adapters/styling/cssInJs/theme";
import { AppContextWrapper } from "../components/AppContext";
import Layout from "../components/layout/Layout";

// debugger;
config.autoAddCss = false;

function MyApp(props) {
  const [queryClient] = useState(
    () =>
      new RQQueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: false,
            retry: false,
          },
        },
      })
  );
  const { Component, pageProps } = props;
  const router = useRouter();

  useEffect(() => {
    const emitRouteChangeCompleted = () => {
      const event = new CustomEvent("routeChangeComplete", {});
      window.dispatchEvent(event);
    };

    router.events.on("routeChangeComplete", emitRouteChangeCompleted);
    return () => {
      router.events.off("routeChangeComplete", emitRouteChangeCompleted);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Project title placeholder</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />

      <ThemeProvider theme={theme}>
        <RQQueryClientProvider client={queryClient}>
          <RQHydrate state={pageProps.dehydratedState}>
            <SnackbarProvider
              variant="info"
              maxSnack={10}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              action={(snackbarId) => (
                <IconButton onClick={() => closeSnackbar(snackbarId)}>
                  <FontAwesomeIcon title="Zavřít" icon={faClose} fixedWidth />
                </IconButton>
              )}
            >
              <AppContextWrapper>
                <NextNProgress options={{ showSpinner: false }} />
                <Layout>
                  {/*
            - key prop is there to force nextjs reMount components when dynamic
              part of url changes. Eg. [page] 1->2
            - that solves issue useListJobs when filter value from SSR
              is given as initial filter state, however as there is no remount,
              initial state keeps stale with it's first value from page 1
            https://github.com/vercel/next.js/issues/9992#issuecomment-873225898
            https://nextjs.org/docs/api-reference/next/router#resetting-state-after-navigation
             */}
                  {/* <Component {...pageProps} key={router.asPath} /> */}
                  <Component {...pageProps} />
                </Layout>
              </AppContextWrapper>
            </SnackbarProvider>
          </RQHydrate>
          <RQReactQueryDevtools initialIsOpen={false} />
        </RQQueryClientProvider>
      </ThemeProvider>
    </>
  );
}

// interface MyAppProps extends AppProps {
//   emotionCache?: EmotionCache;
// }

export default MyApp;
