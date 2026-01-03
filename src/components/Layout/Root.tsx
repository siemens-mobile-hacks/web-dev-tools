import { type Component, ErrorBoundary, lazy } from "solid-js";
import { App } from "@/components/Layout/App";
import { Navigate, Route, Router } from "@solidjs/router";

const SwilibSummaryPage = lazy(() => import("@/pages/SwilibSummary/SwilibSummaryPage"));
const SwilibPage = lazy(() => import("@/pages/Swilib/SwilibPage"));
const ReFilesPage = lazy(() => import("@/pages/ReFiles/ReFilesPage"));

export const Root: Component = () => {
	const showAppError = (err: any) => {
		console.log(err);
		return <div>FATAL ERROR: {err.toString()}</div>;
	};

	return (
		<ErrorBoundary fallback={showAppError}>
			<Router root={App} base={import.meta.env.BASE_URL}>
				<Route path="/" component={() => <Navigate href={() => "/swilib"} />} />
				<Route path="/swilib" component={SwilibSummaryPage} />
				<Route path="/swilib/phone" component={SwilibPage} />
				<Route path="/re" component={ReFilesPage} />
			</Router>
		</ErrorBoundary>
	);
};
