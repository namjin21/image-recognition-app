import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import App from "./App.tsx";
import "./index.css";
import amplifyConfig from "./aws-exports";
import { components } from "./components/auth/CustomAuthComponents.tsx";


Amplify.configure(amplifyConfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator components={components}>
      <App />
    </Authenticator>
  </StrictMode>
);
