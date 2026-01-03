import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { Modal } from "solid-bootstrap";
import { SwilibEntryBadges } from "@/components/Swilib/SwilibEntryBadges";
import { SwilibEntryWarnings } from "@/components/Swilib/SwilibEntryWarnings";
import { SummarySwilibAnalysis, SummarySwilibAnalysisEntry, SWILIB_PLATFORMS, SwilibDevice } from "@/api/swilib";
import { formatId } from "@/utils/format";
import { HighlightCode } from "@/components/Utils/HighlightCode";

interface SwilibEntryModalProps {
	entry: SummarySwilibAnalysisEntry;
	analysis: SummarySwilibAnalysis;
	devices: SwilibDevice[];
	onHide: () => void;
}

export const SwilibEntryModal: Component<SwilibEntryModalProps> = (props) => {
	const coverageMatrix = createMemo(() => {
		const coverage: Record<string, Array<{ target: string, isSupported: boolean }>> = {};
		for (const device of props.devices) {
			coverage[device.platform] = coverage[device.platform] ?? [];
			coverage[device.platform].push({
				target: device.target,
				isSupported: props.entry.targets.includes(device.target)
			});
		}
		return coverage;
	});
	const coverageMatrixWidth = () => Math.max(...Object.values(coverageMatrix()).map((row) => row.length));
	const [showModal, setShowModal] = createSignal(true);

	return (
		<Modal size="lg" centered show={showModal()} onHide={() => setShowModal(false)} onExited={props.onHide}>
			<Modal.Header closeButton>
				<Modal.Title>
					<b>ID:</b> {formatId(props.entry.id)}, <b>offset:</b> {formatId(props.entry.id * 4)}
					&nbsp;&nbsp;
					<SwilibEntryBadges value={props.entry.flags}/>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<HighlightCode language="c" code={props.entry.name ?? "/* Unused */"} />

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
									<td>
										<Show when={row.isSupported} fallback={
											<div class="text-danger">
												<i class="bi bi-x-circle-fill"></i> {row.target}
											</div>
										}>
											<div class="text-success">
												<i class="bi bi-check-circle-fill"></i> {row.target}
											</div>
										</Show>
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
