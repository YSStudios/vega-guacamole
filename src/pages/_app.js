import "../styles/globals.css";
import { store } from "../../store";
import { Provider } from "react-redux";
import localFont from "@next/font/local";
import { ThemeProvider } from "next-themes";
import Head from "next/head";

const bodyFont = localFont({
  src: "../../public/fonts/OCRAStd.otf",
  variable: "--bodyFont",
});

const bodyFont2 = localFont({
  src: "../../public/fonts/HelveticaNeueThin.otf",
  variable: "--bodyFont2",
});

const bodyFont3 = localFont({
	src: "../../public/fonts/HelveticaNeueMedium.otf",
	variable: "--bodyFont3",
});

const headingFont = localFont({
  src: "../../public/fonts/BytePoliceSuperItalic.otf",
  variable: "--headingFont",
});

const headingFont2 = localFont({
  src: "../../public/fonts/DrukWide-Medium.otf",
  variable: "--headingFont2",
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem="true">
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider store={store}>
        <main
          className={`${headingFont.variable} ${bodyFont.variable} ${headingFont2.variable} ${bodyFont2.variable} ${bodyFont3.variable}`}
        >
          <Component {...pageProps} />
        </main>
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
