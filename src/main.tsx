import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SpeedInsights } from "@vercel/speed-insights/next";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<StrictMode>
			<SpeedInsights />
			<App />
		</StrictMode>
	</BrowserRouter>
);
