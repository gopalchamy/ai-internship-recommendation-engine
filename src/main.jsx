import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { VoiceProvider } from "./context/VoiceContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <VoiceProvider>
          <App />
        </VoiceProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
