import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BookBench } from "./BookBench";

createRoot(document.getElementById("book")!).render(
  <StrictMode>
    <BookBench />
  </StrictMode>,
);
