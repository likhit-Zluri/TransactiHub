import Dashboard from "./pages/Dashboard";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
	return (
		<div>
			<SpeedInsights />
			<Dashboard />
		</div>
	);
}
