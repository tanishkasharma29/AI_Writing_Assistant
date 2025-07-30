import { Buffer } from "buffer";
window.Buffer = Buffer;
import React from "react";
import ReactDOM from "react-dom/client";
import img from "./images/ai.png"; // your custom logo
import "./index.css";

import { PrivyProvider } from "@privy-io/react-auth";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmdpxfmzy01ntla0jji21axzu" // Your actual appId here
      // clientId can be included if necessary
      config={{
        // Login methods you want
        loginMethods: ["email", "wallet", "google", "twitter", "github"],

        // Appearance settings (theme, logo, colors)
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: img,
        },

        // Embedded wallets configuration
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
