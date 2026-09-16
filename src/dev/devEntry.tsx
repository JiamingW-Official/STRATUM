import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DevDirectory } from "./DevDirectory";

createRoot(document.getElementById("dev")!).render(
  <StrictMode>
    <DevDirectory />
  </StrictMode>,
);
