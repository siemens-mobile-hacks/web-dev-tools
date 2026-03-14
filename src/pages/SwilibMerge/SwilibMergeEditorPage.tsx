import { batch, Component, createMemo, createResource, For, Show } from "solid-js";
import { getSwilibDiff, SwilibDiffAction } from "@/api/swilib";
import { useTemporaryFilesStore } from "@/store/temporaryFiles";
import { formatAddress, formatId } from "@/utils/format";
import { Alert, Button, Form } from "solid-bootstrap";
import { SwilibEntryName } from "@/components/Swilib/SwilibEntryName";
import clsx from "clsx";
import { useSwilibMergeState } from "@/pages/SwilibMerge/store/swilibMergeState";
import { Sticky } from "@/components/Layout/Sticky/Sticky";

export const SwilibMergeEditorPage: Component = () => {;
	const [temporaryFiles] = useTemporaryFilesStore();
	const [mergeState, setMergeState] = useSwilibMergeState();
	const [swilibDiff] = createResource(() => getSwilibDiff(mergeState.platform, temporaryFiles.sourceVkp, temporaryFiles.destinationVkp));

	const conflicts = createMemo(() => {
		return swilibDiff()?.filter((row) => row.action == SwilibDiffAction.ASK || row.left?.error || row.right?.error);
	});

	const newEntries = createMemo(() => {
		return swilibDiff()?.filter((row) => row.action != SwilibDiffAction.ASK && !row.left?.error && !row.right?.error);
	});

	const isDone = createMemo(() => Object.values(mergeState.answers).every((action) => action != SwilibDiffAction.ASK));
	const conflictsCount = createMemo(() => conflicts()?.length ?? 0);
	const unresolvedConflictsCount = createMemo(() => Object.values(mergeState.answers).filter((action) => action == SwilibDiffAction.ASK).length);

	const globalNewEntriesCheckState = createMemo(() => {
		const newEntriesDiff = newEntries();
		if (!newEntriesDiff)
			return true;
		return newEntriesDiff.every((row) => mergeState.answers[row.id] != SwilibDiffAction.DELETE);
	});

	createMemo(() => {
		const diff = swilibDiff()
		if (!diff)
			return;
		const answers: Record<number, SwilibDiffAction> = { ...mergeState.answers };
		for (const row of diff) {
			if (!(row.id in answers))
				answers[row.id] = row.action;
		}
		setMergeState("answers", answers);
	});

	const toggleNewEntry = (id: number, newState?: boolean) => {
		const row = newEntries()?.find((row) => row.id == id);
		if (!row)
			return;

		if (newState === undefined)
			newState = mergeState.answers[id] == SwilibDiffAction.DELETE;

		if (newState) {
			if (row.right) {
				setMergeState("answers", id, SwilibDiffAction.RIGHT);
			} else if (row.left) {
				setMergeState("answers", id, SwilibDiffAction.LEFT);
			}
		} else {
			setMergeState("answers", id, SwilibDiffAction.DELETE);
		}
	};

	const toggleAllNewEntries = (state: boolean) => {
		batch(() => {
			const newEntriesDiff = newEntries();
			if (!newEntriesDiff)
				return;
			for (const row of newEntriesDiff)
				toggleNewEntry(row.id, state);
		});
	};

	return <>
		<Sticky>
			<div class="d-flex gap-2 align-items-center ">
				<Button variant="outline-success" size="sm" disabled={!isDone()}>
					<i class="bi bi-download"></i> Download
				</Button>

				<Show when={conflictsCount() > 0}>
					<div>
						<Show when={isDone()} fallback={
							<i class="bi bi-x-circle text-danger me-1"></i>
						}>
							<i class="bi bi-check-circle text-success me-1"></i>
						</Show>
						Resolved <b>{conflictsCount() - unresolvedConflictsCount()}</b> of <b>{conflictsCount()}</b> conflicts.
					</div>
				</Show>
			</div>
		</Sticky>

		<Show when={conflictsCount() > 0}>
			<h4>Conflicts ({conflictsCount()})</h4>

			<Alert variant="warning">
				Some entries can't be merged automatically. Please resolve conflicts manually.<br />
				First choice is left (source.vkp), second choice is right (destination.vkp).
			</Alert>

			<For each={conflicts()}>{(row) => <>
				<div class="mb-3">
					<h5>{formatId(row.id)}: <SwilibEntryName name={row.name} /></h5>

					<div class="d-flex flex-column gap-1">
						<Form.Check
							inline
							checked={mergeState.answers[row.id] == SwilibDiffAction.LEFT}
							label={
								<span class={clsx(row.left?.error && "text-danger")}>
									<span class="font-monospace">
										{row.left ? formatAddress(row.left.value) : <span class="text-muted">????????</span>}
									</span>
									<Show when={row.left?.error}>
										{' - '} {row.left?.error}
									</Show>
								</span>
							}
							name={`diff_${row.id}`}
							id={`diff_${row.id}_left`}
							type="radio"
							disabled={row.left == null || row.left?.error != null}
						/>
						<Form.Check
							inline
							checked={mergeState.answers[row.id] == SwilibDiffAction.RIGHT}
							label={
								<span class={clsx(row.right?.error && "text-danger")}>
									<span class="font-monospace">
										{row.right ? formatAddress(row.right.value) : <span class="text-muted">????????</span>}
									</span>
									<Show when={row.right?.error}>
										{' - '} {row.right?.error}
									</Show>
								</span>
							}
							name={`diff_${row.id}`}
							id={`diff_${row.id}_right`}
							type="radio"
							disabled={row.right == null || row.right?.error != null}
						/>
						<Form.Check
							inline
							checked={mergeState.answers[row.id] == SwilibDiffAction.DELETE}
							label="Remove from swilib"
							name={`diff_${row.id}`}
							id={`diff_${row.id}_delete`}
							type="radio"
						/>
					</div>
				</div>
				<hr />
			</>}</For>
		</Show>

		<Show when={newEntries()?.length}>
			<h4>New entries ({newEntries()?.length})</h4>
			<table
				class="table table-bordered table-hover table-sticky-header"
				style={{"width": "auto"}}
			>
				<thead class="thead-dark">
				<tr>
					<th>
						<Form.Check
							type="checkbox"
							checked={globalNewEntriesCheckState()}
							onChange={(e) => toggleAllNewEntries(e.currentTarget.checked)}
						/>
					</th>
					<th class="text-center">
						<small>ID</small>
					</th>
					<th>
						<small>Symbol</small>
					</th>
					<th>
						<small>source.vkp</small>
					</th>
					<th>
						<small>destination.vkp</small>
					</th>
				</tr>
				</thead>
				<tbody>
				<For each={newEntries()}>{(row) => <>
					<tr
						class={clsx(
							"cursor-pointer",
							mergeState.answers[row.id] == SwilibDiffAction.DELETE ? "table-danger" : "table-success"
						)}
						onClick={() => toggleNewEntry(row.id)}
					>
						<td>
							<Form.Check
								type="checkbox"
								checked={mergeState.answers[row.id] != SwilibDiffAction.DELETE}
								onChange={(e) => toggleNewEntry(row.id, e.currentTarget.checked)}
							/>
						</td>
						<td>
							{formatId(row.id)}
						</td>
						<td>
							<SwilibEntryName name={row.name} />
						</td>
						<td>
							{row.left ? formatAddress(row.left.value) : ''}
						</td>
						<td>
							{row.right ? formatAddress(row.right.value) : ''}
						</td>
					</tr>
				</>}</For>
				</tbody>
			</table>
		</Show>
	</>;
};

export default SwilibMergeEditorPage;
