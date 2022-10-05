import Head from "next/head";
import Router from "next/router";
import { Toaster } from "react-hot-toast";
import nProgress from "nprogress";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { createTheme } from "../theme";
import "../styles/global.css";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

const App = (props) => {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>Interview Scheduler</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider
            theme={createTheme({
              direction: "ltr",
              mode: "light",
            })}
          >
            <CssBaseline />
            <Toaster position="top-center" />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </LocalizationProvider>
    </>
  );
};

export default App;
