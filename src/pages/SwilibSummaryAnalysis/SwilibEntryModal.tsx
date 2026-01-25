import { Component, createMemo, createSignal, For, Match, Show, Switch } from "solid-js";
import { Badge, Modal } from "solid-bootstrap";
import { SwilibEntryBadges } from "@/components/Swilib/SwilibEntryBadges";
import { SwilibEntryWarnings } from "@/components/Swilib/SwilibEntryWarnings";
import {
	getCoverageValue,
	SummarySwilibAnalysis,
	SummarySwilibAnalysisEntry,
	SWILIB_PLATFORMS,
	SwilibDevice
} from "@/api/swilib";
import { formatAddress, formatId } from "@/utils/format";
import { HighlightCode } from "@/components/Utils/HighlightCode";
import clsx from "clsx";

interface SwilibEntryModalProps {
	entry: SummarySwilibAnalysisEntry;
	analysis: SummarySwilibAnalysis;
	devices: SwilibDevice[];
	target?: string;
	onHide: () => void;
}

export const SwilibEntryModal: Component<SwilibEntryModalProps> = (props) => {
	const coverageMatrix = createMemo(() => {
		const matrix: Record<string, Array<{ target: string, coverage: number, value?: number }>> = {};
		for (const device of props.devices) {
			const platformCoverage = props.entry.coverage[device.platform];
			const value = props.entry.values[device.target];
			const coverage = getCoverageValue(platformCoverage, props.entry.targets.includes(device.target));
			matrix[device.platform] = matrix[device.platform] ?? [];
			matrix[device.platform].push({
				target: device.target,
				coverage,
				value
			});
		}
		return matrix;
	});
	const value = () => props.target ? props.entry.values[props.target] : undefined;
	const coverageMatrixWidth = () => Math.max(...Object.values(coverageMatrix()).map((row) => row.length));
	const [showModal, setShowModal] = createSignal(true);
	const unusedLabel = () => props.entry.file == 'swilib/unused.h' ? 'Unused' : 'Reserved by ELFLoader';

	const getClassByCoverage = (coverage: number) => {
		const coverageToClass: Record<number, string> = {
			[-200]: 'text-secondary',
			[0]: 'text-danger',
			[100]: 'text-success',
			[200]: 'text-info'
		};
		return coverageToClass[coverage] ?? '';
	};

	return (
		<Modal size="lg" centered show={showModal()} onHide={() => setShowModal(false)} onExited={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title class="d-flex align-items-center gap-3">
					<span>
						<b>ID:</b> {formatId(props.entry.id)} / +{formatId(props.entry.id * 4)}{' '}
					</span>
					<Show when={value()}>{(value) =>
						<Badge class="bg-secondary">{formatAddress(value())}</Badge>
					}</Show>
					<SwilibEntryBadges value={props.entry.flags}/>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<HighlightCode language="c" code={props.entry.name ?? `/* ${unusedLabel()} */`} />

				<div class="my-3">
					<SwilibEntryWarnings value={props.entry.flags}/>
				</div>

				<Show when={props.entry.aliases.length > 0}>
					<div class="my-3">
						<span class="text-muted">
							<i class="bi bi-info-square"></i> Old names:
						</span>
						{' '} {props.entry.aliases.join(', ')}
					</div>
				</Show>

				<div class="mt-3">
					<table class="table table-bordered table-hover" style={{width: "auto"}}>
						<tbody>
						<For each={SWILIB_PLATFORMS}>{(platform) =>
							<tr>
								<th>{platform}</th>
								<For each={coverageMatrix()[platform]}>{(row) =>
									<td class={clsx('text-center', getClassByCoverage(row.coverage))}>
										<b>{row.target}</b><br />
										<Switch fallback={
											<small>{row.value != null ? formatAddress(row.value) : '-'}</small>
										}>
											<Match when={row.coverage == 200}>
												<small>built-in</small>
											</Match>
											<Match when={row.coverage == -200}>
												<small>not avail</small>
											</Match>
										</Switch>
									</td>
								}</For>
								<Show when={coverageMatrix()[platform].length < coverageMatrixWidth()}>
									<td colspan="10"></td>
								</Show>
							</tr>
						}</For>
						</tbody>
					</table>
				</div>

				<table class="mt-3 table table-bordered table-hover" style={{width: "auto"}}>
					<tbody>
					<For each={SWILIB_PLATFORMS}>{(platform) =>
						<tr>
							<th class="align-middle">{platform}</th>
							<td>
								<code style={{"word-break": "break-all"}}>
									{props.entry.patterns[platform] ?? <span class="text-muted">/* no pattern */</span>}
								</code>
							</td>
						</tr>
					}</For>
					</tbody>
				</table>
			</Modal.Body>
		</Modal>
	);
};
