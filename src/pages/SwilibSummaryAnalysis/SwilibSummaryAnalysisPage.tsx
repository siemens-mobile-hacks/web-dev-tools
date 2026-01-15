import { Component, createResource, createSignal, For, Show } from "solid-js";
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import { SwilibTargetsTabs } from "@/components/Swilib/SwilibTargetsTabs";
import { Button, Form, Spinner } from "solid-bootstrap";
import { SwilibTable } from "@/pages/SwilibSummaryAnalysis/SwilibTable";
import { getAvailableSwilibDevices, getSummarySwilibAnalysis, SummarySwilibAnalysisEntry } from "@/api/swilib";
import { formatId } from "@/utils/format";
import { SwilibEntryModal } from "@/pages/SwilibSummaryAnalysis/SwilibEntryModal";
import { useResourcesState } from "@/hooks/useResourcesState";

const SwilibSummaryAnalysisPage: Component = () => {
	const [tableOptions, setTableOptions] = useSwilibTableOptionsStore();
	const [devices] = createResource(getAvailableSwilibDevices);
	const [summaryAnalysis] = createResource(getSummarySwilibAnalysis);
	const resourcesState = useResourcesState([devices, summaryAnalysis]);
	const groups = () => tableOptions.groupByFile ? summaryAnalysis()?.files : ['swilib.h'];
	const [selectedEntry, setSelectedEntry] = createSignal<SummarySwilibAnalysisEntry>();

	return <>
		<div class="mb-2">
			<div class="mb-2">
				<SwilibTargetsTabs devices={devices()} />
			</div>

			<div class="d-flex justify-content-start">
				<div class="align-self-center me-3">
					<Form.Check
						type="checkbox"
						id="group-by-c-header"
						label="Group by C header"
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

				<Button
					variant="outline-primary"
					size="sm"
					onClick={() => setTableOptions("globalCollapsed", (prev) => !prev)}
				>
					<Show when={!tableOptions.globalCollapsed}>
						<i class="bi bi-eye-slash"></i> Collapse all
					</Show>
					<Show when={tableOptions.globalCollapsed}>
						<i class="bi bi-eye"></i> Expand all
					</Show>
				</Button>
			</div>
		</div>

		<div class="d-flex flex-row mb-2">
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

		<Show when={resourcesState.isLoading}>
			<Spinner animation="border" role="status">
				<span class="visually-hidden">Loading...</span>
			</Spinner>
		</Show>

		<Show when={resourcesState.isError}>
			<div class="alert alert-danger" role="alert">
				Can't load data from the server. Please reload the page.
			</div>
		</Show>

		<Show when={resourcesState.isReady}>
			<div class="text-secondary mb-2">
				<span class="bi bi-info-circle"></span> {' '}
				Next free ID: <b>{formatId(summaryAnalysis()!.nextId)}</b>
			</div>

			<For each={groups()}>{(file) =>
				<SwilibTable
					file={file}
					analysis={summaryAnalysis()!}
					onEntrySelect={(entry) => setSelectedEntry(entry)}
				/>
			}</For>

			<Show when={selectedEntry()}>{(selectedEntry) =>
				<SwilibEntryModal
					entry={selectedEntry()}
					analysis={summaryAnalysis()!}
					devices={devices()!}
					onHide={() => setSelectedEntry(undefined)}
				/>
			}</Show>
		</Show>
	</>;
};

export default SwilibSummaryAnalysisPage;
