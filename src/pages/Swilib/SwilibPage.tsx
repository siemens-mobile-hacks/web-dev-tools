import { Component, createResource, createSignal, For, Show } from 'solid-js';
import { A, useSearchParams } from '@solidjs/router';
import { Button, Form, Spinner } from 'solid-bootstrap';
import { SwilibTargetsTabs } from '@/components/Swilib/SwilibTargetsTabs';
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import {
	getAvailableSwilibDevices,
	getSummarySwilibAnalysis,
	getTargetSwilibAnalysis,
	SummarySwilibAnalysisEntry,
} from "@/api/swilib";
import { SwilibStatistic } from "@/pages/Swilib/SwilibStatistic";
import { BACKEND_URL } from "@/utils/env";
import { SwilibTable } from "@/pages/Swilib/SwilibTable";
import { SwilibEntryModal } from "@/pages/SwilibSummary/SwilibEntryModal";

const SwilibPage: Component = () => {
	const [searchParams] = useSearchParams<{ model: string; target: string }>();
	const [tableOptions, setTableOptions] = useSwilibTableOptionsStore();
	const target = () => searchParams.target ?? searchParams.model ?? '';
	const [response] = createResource(async () => {
		const [analysis, devices, targetAnalysis] = await Promise.all([
			getSummarySwilibAnalysis(),
			getAvailableSwilibDevices(),
			getTargetSwilibAnalysis(target()),
		]);
		return { analysis, devices, targetAnalysis };
	});

	const groups = () => tableOptions.groupByFile ? response()?.analysis?.files : ['swilib.h'];
	const [selectedEntry, setSelectedEntry] = createSignal<SummarySwilibAnalysisEntry>();

	const handleFilterByType = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (e.currentTarget.checked)
			setTableOptions("filterByType", e.currentTarget.value);
	};

	return <>
		<div class="mb-2">
			<SwilibTargetsTabs selected={target()} devices={response()?.devices} />
		</div>

		<div class="d-flex justify-content-start mb-3">
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

			<div class="align-self-center me-3">
				<Form.Check
					type="checkbox"
					id="show-offsets"
					label="Show offsets"
					checked={tableOptions.showEntryOffset}
					onChange={(e) => setTableOptions("showEntryOffset", e.currentTarget.checked)}
				/>
			</div>

			<div class="align-self-center me-3">
				<Form.Check
					type="checkbox"
					id="show-original-sym"
					label="Show names in .VKP"
					checked={tableOptions.showOriginalSymbol}
					onChange={(e) => setTableOptions("showOriginalSymbol", e.currentTarget.checked)}
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

		<div class="d-flex flex-row mb-3">
			<span class="me-3"><i class="bi bi-funnel"></i> Show functions:</span>
			<Form.Check
				inline
				type="radio"
				id="filter-type-all"
				name="filter-type"
				label="All"
				value="all"
				checked={tableOptions.filterByType == 'all'}
				onChange={handleFilterByType}
			/>
			<Form.Check
				inline
				type="radio"
				class="text-danger"
				id="filter-type-errors"
				name="filter-type"
				label="With errors"
				value="errors"
				checked={tableOptions.filterByType == 'errors'}
				onChange={handleFilterByType}
			/>
			<Form.Check
				inline
				type="radio"
				class="text-danger"
				id="filter-type-errors-missing"
				name="filter-type"
				label="With errors + missing"
				value="errors-plus-missing"
				checked={tableOptions.filterByType == 'errors-plus-missing'}
				onChange={handleFilterByType}
			/>
		</div>

		<div class="d-flex flex-row mb-3">
			<Button
				class="me-3" as={A as any} variant="outline-success" size="sm"
				href={`${BACKEND_URL}/api/swilib/download/${target()}/swilib_${target()}.vkp`}
			>
				<i class="bi bi-download"></i> Normalized <b>.vkp</b>
			</Button>

			<Button
				class="me-3" as={A as any} variant="outline-success" size="sm"
				href={`${BACKEND_URL}/api/swilib/download/${target()}/swilib_${target()}.blib`}
			>
				<i class="bi bi-download"></i> Library as <b>swi.blib</b>
			</Button>

			<Button
				class="me-3" as={A as any} variant="outline-primary" size="sm" target="_blank" rel="noopener"
				href={`https://patches.kibab.com/patches/details.php5?id=${response()?.targetAnalysis.patchId}`}
			>
				<i class="bi bi-browser-chrome"></i> Open on Kibab
			</Button>
		</div>

		<Show when={response.loading}>
			<Spinner animation="border" role="status">
				<span class="visually-hidden">Loading...</span>
			</Spinner>
		</Show>

		<Show when={response.error}>
			<div class="alert alert-danger" role="alert">
				Can't load data from the server. Please reload the page.
			</div>
		</Show>

		<Show when={response()}>{(response) => <>
			<Show when={response().targetAnalysis.statistic.bad > 0}>
				<div class="alert alert-danger" role="alert">
					Swilib has <b>{response().targetAnalysis.statistic.bad}</b> fatal errors!!!
					<Button
						variant="outline-danger ms-3"
						size="sm"
						onClick={() => setTableOptions("filterByType", "errors")}
						hidden={tableOptions.filterByType == 'errors'}
					>
						Show bad functions
					</Button>
				</div>
			</Show>

			<SwilibStatistic statistic={response().targetAnalysis.statistic} />

			<For each={groups()}>{(file) =>
				<SwilibTable
					file={file}
					analysis={response().analysis}
					targetAnalysis={response().targetAnalysis}
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

export default SwilibPage;
