import { type Component, ErrorBoundary, lazy } from "solid-js";
import { App } from "@/components/Layout/App";
import { Navigate, Route, Router } from "@solidjs/router";

const SwilibSummaryAnalysisPage = lazy(() => import("@/pages/SwilibSummaryAnalysis/SwilibSummaryAnalysisPage"));
const SwilibTargetAnalysisPage = lazy(() => import("@/pages/SwilibTargetAnalysis/SwilibTargetAnalysisPage"));
const SwilibCheckPage = lazy(() => import("@/pages/SwilibCheck/SwilibCheckPage"));
const ReFilesPage = lazy(() => import("@/pages/ReFiles/ReFilesPage"));

export const Root: Component = () => {
	const showAppError = (err: any) => {
		console.log(err);
		return <div>FATAL ERROR: {err.toString()}</div>;
	};

	return (
		<ErrorBoundary fallback={showAppError}>
			<Router root={App} base={import.meta.env.BASE_URL}>
				<Route path="/" component={() => <Navigate href={() => "/swilib/analysis/summary"} />} />
				<Route path="/swilib/analysis/summary" component={SwilibSummaryAnalysisPage} />
				<Route path="/swilib/analysis/target" component={SwilibTargetAnalysisPage} />
				<Route path="/swilib/check" component={SwilibCheckPage} />
				<Route path="/re/symbols" component={ReFilesPage} />

				{/* Legacy routes */}
				<Route path="/swilib" component={() => <Navigate href={() => "/swilib/analysis/summary"} />} />
				<Route path="/swilib/analysis" component={() => <Navigate href={() => "/swilib/analysis/summary"} />} />
				<Route path="/swilib/phone" component={() => <Navigate href={() => "/swilib/analysis/target"} />} />
				<Route path="/re" component={() => <Navigate href={() => "/re/symbols"} />} />
			</Router>
		</ErrorBoundary>
	);
};
