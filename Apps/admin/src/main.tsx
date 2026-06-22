import ReactDOM from "react-dom/client";
import { Router } from "./router";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(<Router />);
}
