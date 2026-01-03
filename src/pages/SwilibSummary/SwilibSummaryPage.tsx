import { Component, createResource, createSignal, For, Show } from "solid-js";
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import { SwilibTargetsTabs } from "@/components/Swilib/SwilibTargetsTabs";
import { Button, Form, Spinner } from "solid-bootstrap";
import { SwilibTable } from "@/pages/SwilibSummary/SwilibTable";
import { getAvailableSwilibDevices, getSummarySwilibAnalysis, SummarySwilibAnalysisEntry } from "@/api/swilib";
import { formatId } from "@/utils/format";
import { SwilibEntryModal } from "@/pages/SwilibSummary/SwilibEntryModal";

const SwilibSummaryPage: Component = () => {
	const [tableOptions, setTableOptions] = useSwilibTableOptionsStore();
	const [response] = createResource(async () => {
		const [analysis, devices] = await Promise.all([
			getSummarySwilibAnalysis(),
			getAvailableSwilibDevices(),
		]);
		return { analysis, devices };
	});
	const groups = () => tableOptions.groupByFile ? response()?.analysis?.files : ['swilib.h'];
	const [selectedEntry, setSelectedEntry] = createSignal<SummarySwilibAnalysisEntry>();

	return <>
		<div class="mb-3">
			<div class="mb-2">
				<SwilibTargetsTabs devices={response()?.devices} />
			</div>

			<div class="d-flex justify-content-start">
				<div class="align-self-center me-3">
					<Form.Check
						type="checkbox"
						id="group-by-c-header"
						label="Group by C-header"
						checked={tableOptions.groupByFile}
						onChange={(e) => setTableOptions("groupByFile", e.currentTarget.checked)}
					/>
				</div>

				<div class="align-self-center me-3">
					<Form.Check
						type="checkbox"
						id="show-old-names"
						label="Show old names"
						checked={tableOptions.showOldNames}
						onChange={(e) => setTableOptions("showOldNames", e.currentTarget.checked)}
					/>
				</div>

				<Button variant="outline-primary" onClick={() => setTableOptions("globalCollapsed", (prev) => !prev)}>
					<Show when={!tableOptions.globalCollapsed}>
						<i class="bi bi-eye-slash"></i> Collapse all
					</Show>
					<Show when={tableOptions.globalCollapsed}>
						<i class="bi bi-eye"></i> Expand all
					</Show>
				</Button>
			</div>
		</div>

		<div class="d-flex flex-row mb-3">
			<span class="me-3"><i class="bi bi-globe"></i> Show coverage:</span>
			<Form.Check
				inline
				type="radio"
				id="coverage-type-swi"
				name="coverage-type"
				label="For swilib"
				value="SWI"
				checked={tableOptions.coverageType == 'SWI'}
				onChange={(e) => e.currentTarget.checked && setTableOptions("coverageType", e.currentTarget.value)}
			/>
			<Form.Check
				inline
				type="radio"
				id="coverage-type-ptr"
				name="coverage-type"
				label="For patterns"
				value="PTR"
				checked={tableOptions.coverageType == 'PTR'}
				onChange={(e) => e.currentTarget.checked && setTableOptions("coverageType", e.currentTarget.value)}
			/>
		</div>

		<Show when={response.loading}>
			<Spinner animation="border" role="status">
				<span class="visually-hidden">Loading...</span>
			</Spinner>
		</Show>

		<Show when={response.error}>
			<div class="alert alert-danger" role="alert">
				Can't load data from the server. Please, reload the page.
			</div>
		</Show>

		<Show when={response()}>{(response) => <>
			<div class="alert alert-info" role="alert">
				Next free ID: <b>{formatId(response().analysis.nextId)}</b>
			</div>

			<For each={groups()}>{(file) =>
				<SwilibTable
					file={file}
					analysis={response().analysis}
					onEntrySelect={(entry) => setSelectedEntry(entry)}
				/>
			}</For>

			<Show when={selectedEntry()}>{(selectedEntry) =>
				<SwilibEntryModal
					entry={selectedEntry()}
					analysis={response().analysis}
					devices={response().devices}
					onHide={() => setSelectedEntry(undefined)}
				/>
			}</Show>
		</>}</Show>
	</>;
};

export default SwilibSummaryPage;
