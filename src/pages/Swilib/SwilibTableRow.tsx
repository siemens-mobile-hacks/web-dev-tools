import { Component, createMemo, Show } from "solid-js";
import { formatId } from "@/utils/format";
import { SwilibEntryTypeBadge } from "@/components/Swilib/SwilibEntryTypeBadge";
import { SwilibEntryName } from "@/components/Swilib/SwilibEntryName";
import { SwilibEntryBadges } from "@/components/Swilib/SwilibEntryBadges";
import { SwilibCoverageValue } from "@/components/Swilib/SwilibCoverageValue";
import { getPatternsCoverage, SummarySwilibAnalysisEntry, TargetSwilibAnalysisEntry } from "@/api/swilib";
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import clsx from "clsx";

interface SwilibTableRowProps {
	entry: SummarySwilibAnalysisEntry;
	targetEntry: TargetSwilibAnalysisEntry;
	onSelect?: (entry: SummarySwilibAnalysisEntry, targetEntry: TargetSwilibAnalysisEntry) => void;
	platform: string;
}

export const SwilibTableRow: Component<SwilibTableRowProps> = (props) => {
	const [tableOptions] = useSwilibTableOptionsStore();
	const coverage = createMemo(() => {
		if (tableOptions.coverageType == 'PTR')
			return getPatternsCoverage(props.entry.patterns, props.entry.coverage);
		return props.entry.coverage;
	});
	const rowColor = createMemo(() => {
		// Has error
		if (props.targetEntry.error)
			return 'table-danger';

		// Unused
		if (props.entry.name == null)
			return '';

		// Color by coverage
		const coverage = props.entry.coverage[props.platform];
		if (coverage === 200) {
			return 'table-info'; // built-in
		} else if (coverage === -200) {
			return 'text-decoration-line-through'; // not supported
		}

		// Missing function
		if (props.targetEntry?.value == null)
			return 'table-warning';

		return '';
	});

	return (
		<tr class={rowColor()} onClick={() => props.onSelect?.(props.entry, props.targetEntry)}>
			<td class={clsx(!props.entry.name && 'text-muted')}>
				{formatId(props.entry.id)}
			</td>
			<td class={clsx(!props.entry.name && 'text-muted')} hidden={!tableOptions.showEntryOffset}>
				{formatId(props.entry.id * 4)}
			</td>
			<td class={clsx(!props.entry.name && 'text-muted')}>
				<div class="d-flex justify-content-between align-items-center">
					<div>
						<SwilibEntryTypeBadge value={props.entry.type}/>
						&nbsp;&nbsp;
						<SwilibEntryName signature={props.entry.name}/>
					</div>
					<SwilibEntryBadges value={props.entry.flags}/>
				</div>
				<Show when={tableOptions.showOldNames}>
					{props.entry.aliases.map((aliasName) =>
						<div>
							<i class="bi bi-info-square"></i>
							&nbsp;&nbsp;
							<small class="text-muted">Old name:</small>
							&nbsp;
							<small>{aliasName}</small>
						</div>
					)}
				</Show>
				<Show when={props.targetEntry?.error}>
					<div class="text-danger">
						<i class="bi bi-exclamation-triangle"></i> {props.targetEntry.error}
					</div>
				</Show>
			</td>
			<td classList={{'text-muted': props.entry.name == null}} hidden={!tableOptions.showOriginalSymbol}>
				<Show when={props.targetEntry?.symbol}>
					{props.targetEntry.symbol}
				</Show>
			</td>
			<td classList={{'text-muted': props.entry.name == null}}>
				<Show when={props.targetEntry?.value != null}>
					{props.targetEntry.value!.toString(16).padStart(8, '0').toUpperCase()}
				</Show>
			</td>
			<SwilibCoverageValue platform={props.platform} value={coverage()[props.platform]} />
		</tr>
	);
};
