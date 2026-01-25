import { Component, createMemo, For, Show } from "solid-js";
import { SwilibEntryTypeBadge } from "@/components/Swilib/SwilibEntryTypeBadge";
import { SwilibEntryName } from "@/components/Swilib/SwilibEntryName";
import { SwilibEntryBadges } from "@/components/Swilib/SwilibEntryBadges";
import { SwilibCoverageValue } from "@/components/Swilib/SwilibCoverageValue";
import { getPatternsCoverage, SummarySwilibAnalysisEntry, SWILIB_PLATFORMS } from "@/api/swilib";
import { useSwilibTableOptionsStore } from "@/store/swilibTableOptionsStore";
import { formatId } from "@/utils/format";

interface SwilibTableRowProps {
	entry: SummarySwilibAnalysisEntry;
	onSelect?: (entry: SummarySwilibAnalysisEntry) => void;
}

export const SwilibTableRow: Component<SwilibTableRowProps> = (props) => {
	const [tableOptions] = useSwilibTableOptionsStore();
	const coverage = createMemo(() => {
		if (tableOptions.coverageType == 'PTR')
			return getPatternsCoverage(props.entry.patterns, props.entry.coverage);
		return props.entry.coverage;
	});

	const handleClick = () => props.onSelect?.(props.entry);
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ')
			handleClick();
	};

	return (
		<tr
			class="cursor-pointer"
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabindex="0"
			role="button"
		>
			<td classList={{'text-muted': props.entry.name == null}}>
				{formatId(props.entry.id)}
			</td>

			<td classList={{'text-muted': props.entry.name == null}}>
				<div class="d-flex justify-content-between align-items-center">
					<div>
						<SwilibEntryTypeBadge value={props.entry.type} />
						<SwilibEntryName entry={props.entry} />
					</div>
					<SwilibEntryBadges value={props.entry.flags}/>
				</div>
				<Show when={tableOptions.showOldNames}>{props.entry.aliases.map((aliasName) =>
					<div>
						<i class="bi bi-info-square me-2"></i>
						<small class="text-muted">Old name:</small>{' '}
						<small>{aliasName}</small>
					</div>
				)}</Show>
			</td>

			<For each={SWILIB_PLATFORMS}>{(platform) =>
				<SwilibCoverageValue platform={platform} value={coverage()[platform]} />
			}</For>
		</tr>
	);
};
