import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";

import App from "./App.jsx";
import amplifyConfig from "./amplifyConfig.js";

import "./index.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-south-1_uDfL65aJf",
      userPoolClientId: "4sb1q16bm23tdlp3b1naoi08s6",
    },
  },

  API: {
    GraphQL: {
      endpoint:
        "https://oqjf2oe72nedtpg3nuomr4655e.appsync-api.ap-south-1.amazonaws.com/graphql",
      region: "ap-south-1",

      defaultAuthMode: "userPool", // IMPORTANT FIX

      apiKey: "da2-pyivlzc6dfgg7bdu4wdjnld32i", // fallback (keep this)
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);