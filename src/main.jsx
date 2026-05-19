import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";

import App from "./App.jsx";
import "./index.css";

/* AppSync Config */
Amplify.configure({
  API: {
    GraphQL: {
      endpoint:
        "https://oqjf2oe72nedtpg3nuomr4655e.appsync-api.ap-south-1.amazonaws.com/graphql",
      region: "ap-south-1",
      defaultAuthMode: "apiKey",
      apiKey: "da2-pyivlzc6dfgg7bdu4wdjnld32i",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);