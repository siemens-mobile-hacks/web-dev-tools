import { Component, createEffect, createMemo, For, on } from "solid-js";
import { TableSortButton } from "@/components/TableSortButton";
import {
	SummarySwilibAnalysis,
	SummarySwilibAnalysisEntry,
	TargetSwilibAnalysis,
	TargetSwilibAnalysisEntry
} from "@/api/swilib";
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import { SwilibTableRow } from "@/pages/SwilibTargetAnalysis/SwilibTableRow";

interface SwilibTableProps {
	file: string;
	analysis: SummarySwilibAnalysis;
	targetAnalysis: TargetSwilibAnalysis;
	onEntrySelect?: (entry: SummarySwilibAnalysisEntry, targetEntry: TargetSwilibAnalysisEntry) => void;
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
		const filterByType = tableOptions.filterByType;

		const filterEntries = (entry: SummarySwilibAnalysisEntry): boolean => {
			if (filterByFile != 'swilib.h' && entry.file != filterByFile)
				return false;
			const targetEntry = props.targetAnalysis.entries[entry.id];
			if (filterByType == 'errors') {
				return !!targetEntry?.error;
			} else if (filterByType == 'errors-plus-missing') {
				return !!targetEntry?.error || !!targetEntry?.missing;
			}
			return true;
		};

		const entries = filterByFile != 'swilib.h' || filterByType != 'all' ?
			props.analysis.entries.filter(filterEntries) :
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
					<th class="text-center" hidden={!tableOptions.showEntryOffset}>
						<small>OFF</small>
					</th>
					<th style={{width: "100%"}}>
						<small>Function</small>
					</th>
					<th class="text-center" hidden={!tableOptions.showOriginalSymbol}>
						<small>
							<span style={{"white-space": "nowrap"}}>Name in VKP</span>
						</small>
					</th>
					<th class="text-center">
						<small>Value</small>
					</th>
					<th class="text-center">
						<small>PTR</small>
					</th>
				</tr>
				</thead>
				<tbody>
				<For each={entries()}>{(row) =>
					<SwilibTableRow
						entry={row}
						targetEntry={props.targetAnalysis.entries[row.id]}
						onSelect={props.onEntrySelect}
						platform={props.targetAnalysis.platform} />
				}</For>
				</tbody>
			</table>
		</div>
	);
};
