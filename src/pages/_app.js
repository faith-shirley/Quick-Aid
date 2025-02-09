import "bootstrap/dist/css/bootstrap.css";
import "@/styles/globals.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require("bootstrap-icons/font/bootstrap-icons.css");
  }, []);
  return <Component {...pageProps} />;
}
