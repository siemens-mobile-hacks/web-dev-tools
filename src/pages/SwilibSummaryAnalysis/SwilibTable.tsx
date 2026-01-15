import { Component, createEffect, createMemo, For, on } from "solid-js";
import { TableSortButton } from "@/components/TableSortButton";
import { SummarySwilibAnalysis, SummarySwilibAnalysisEntry, SWILIB_PLATFORMS } from "@/api/swilib";
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import { SwilibTableRow } from "@/pages/SwilibSummaryAnalysis/SwilibTableRow";

interface SwilibTableProps {
	file: string;
	analysis: SummarySwilibAnalysis;
	onEntrySelect?: (entry: SummarySwilibAnalysisEntry) => void;
}

export const SwilibTable: Component<SwilibTableProps> = (props) => {
	const [tableOptions, setTableOptions] = useSwilibTableOptionsStore();
	const isCollapsed = () => tableOptions.groupIsCollapsed[props.file] ?? false;
	const setCollapsed = (collapse: boolean) => setTableOptions("groupIsCollapsed", props.file, collapse);
	const primarySortOrder = () => tableOptions.groupPrimarySort[props.file] ?? 'ASC';
	const setPrimarySortOrder = (order: 'ASC' | 'DESC') => setTableOptions("groupPrimarySort", props.file, order);

	const entries = createMemo(() => {
		const sortAsc = primarySortOrder() == 'ASC';
		const filterByFile = props.file;
		const entries = filterByFile != 'swilib.h' ?
			props.analysis.entries.filter((entry) => entry.file == filterByFile) :
			props.analysis.entries;
		return entries.toSorted((a, b) => sortAsc ? a.id - b.id : b.id - a.id);
	});

	createEffect(on(
		() => tableOptions.globalCollapsed,
		setCollapsed,
		{ defer: true }
	));

	return (
		<div>
			<h4 onClick={() => setCollapsed(!isCollapsed())} class="user-select-none cursor-pointer">
				<i class={`bi ${isCollapsed() ? 'bi-plus-square' : 'bi-dash-square'}`}></i> {' '}
				{props.file}
			</h4>
			<table
				class="table table-bordered table-hover table-sticky-header"
				style={{"width": "100%", "max-width": "900px"}}
				hidden={isCollapsed()}
			>
				<thead class="thead-dark">
					<tr>
						<th class="text-center">
							<TableSortButton value={primarySortOrder()} onChange={(sort) => setPrimarySortOrder(sort)}>
								<small>ID</small>
							</TableSortButton>
						</th>
						<th style={{width: "100%"}}>
							<small>Function</small>
						</th>
						<For each={SWILIB_PLATFORMS}>{(platform) =>
							<th class="text-center">
								<small>{platform}</small>
							</th>
						}</For>
					</tr>
				</thead>
				<tbody>
					<For each={entries()}>{(row) =>
						<SwilibTableRow entry={row} onSelect={props.onEntrySelect} />
					}</For>
				</tbody>
			</table>
		</div>
	);
};
