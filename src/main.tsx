import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { MobileProvider } from "./context/MobileContext";
import { UserProvider } from "./context/UserContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <MobileProvider>
        <App />
      </MobileProvider>
    </UserProvider>
  </StrictMode>
);
