import { Component, createMemo, createResource, createSignal, For, Show } from 'solid-js';
import { useSearchParams } from '@solidjs/router';
import { Button, Dropdown, Form, Spinner } from 'solid-bootstrap';
import { SwilibTargetsTabs } from '@/components/Swilib/SwilibTargetsTabs';
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import {
	getAvailableSwilibDevices,
	getSummarySwilibAnalysis,
	getTargetSwilibAnalysis,
	SummarySwilibAnalysisEntry,
} from "@/api/swilib";
import { SwilibStatistic } from "@/pages/SwilibTargetAnalysis/SwilibStatistic";
import { BACKEND_URL } from "@/utils/env";
import { SwilibTable } from "@/pages/SwilibTargetAnalysis/SwilibTable";
import { SwilibEntryModal } from "@/pages/SwilibSummaryAnalysis/SwilibEntryModal";
import { useResourcesState } from "@/hooks/useResourcesState";

const SwilibTargetAnalysisPage: Component = () => {
	const [searchParams] = useSearchParams<{ model: string; target: string }>();
	const [tableOptions, setTableOptions] = useSwilibTableOptionsStore();
	const target = () => searchParams.target ?? searchParams.model ?? '';
	const [devices] = createResource(getAvailableSwilibDevices);
	const [summaryAnalysis] = createResource(getSummarySwilibAnalysis);
	const [targetAnalysis] = createResource(target, (target) => getTargetSwilibAnalysis(target));

	const resourcesState = useResourcesState([devices, summaryAnalysis, targetAnalysis]);

	const groups = () => tableOptions.groupByFile ? summaryAnalysis()?.files : ['swilib.h'];
	const [selectedEntry, setSelectedEntry] = createSignal<SummarySwilibAnalysisEntry>();

	const handleFilterByType = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (e.currentTarget.checked)
			setTableOptions("filterByType", e.currentTarget.value);
	};

	const downloadLinks = createMemo(() => ([
		{
			label: <>V-Klay patch <b>.vkp</b></>,
			href: `${BACKEND_URL}/api/swilib/download/${target()}/swilib_${target()}.vkp`
		},
		{
			label: <>Binary library <b>.blib</b></>,
			href: `${BACKEND_URL}/api/swilib/download/${target()}/swilib_${target()}.blib`
		},
		{
			label: <>Ghidra symbols <b>.txt</b></>,
			href: `${BACKEND_URL}/api/swilib/download/${target()}/symbols-${target()}.txt`
		},
		{
			label: <>IDA Pro symbols <b>.idc</b></>,
			href: `${BACKEND_URL}/api/swilib/download/${target()}/symbols-${target()}.idc`
		},
	]));

	return <>
		<div class="mb-2">
			<SwilibTargetsTabs selected={target()} devices={devices()} />
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

			<Button
				size="sm"
				variant="outline-primary"
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

		<div class="d-flex flex-row mb-3 gap-2">
			<Dropdown>
				<Dropdown.Toggle variant="outline-success" size="sm">
					<i class="bi bi-download"></i> Download as …
				</Dropdown.Toggle>
				<Dropdown.Menu>
					<For each={downloadLinks()}>{(link) => <>
						<Dropdown.Item href={link.href}>
							<i class="bi bi-download"></i> {link.label}
						</Dropdown.Item>
					</>}</For>
				</Dropdown.Menu>
			</Dropdown>

			<Button
				as={"a"} variant="outline-primary" size="sm" target="_blank" rel="noopener"
				href={`https://patches.kibab.com/patches/details.php5?id=${targetAnalysis()?.patchId}`}
			>
				<i class="bi bi-browser-chrome"></i> Open on Kibab
			</Button>
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
			<SwilibStatistic statistic={targetAnalysis()!.statistic} />

			<For each={groups()}>{(file) =>
				<SwilibTable
					file={file}
					analysis={summaryAnalysis()!}
					targetAnalysis={targetAnalysis()!}
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

export default SwilibTargetAnalysisPage;
