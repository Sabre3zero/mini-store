import ReactDOM from "react-dom/client";
import { Router } from "./router";
import { StoreProvider } from "./stores/storeProvider";
import './global.css';
import './style_variables.css';

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render( <StoreProvider><Router /></StoreProvider>);
}
