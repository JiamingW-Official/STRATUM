import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IFEBench } from "./IFEBench";

createRoot(document.getElementById("bench")!).render(
  <StrictMode>
    <IFEBench />
  </StrictMode>,
);
