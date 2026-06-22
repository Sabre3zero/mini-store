import ReactDOM from "react-dom/client";
import { Router } from "./router";
import { StoreProvider } from "./stores/storeProvider";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render( <StoreProvider><Router /></StoreProvider>);
}
