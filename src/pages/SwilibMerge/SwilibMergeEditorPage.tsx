import { Component, createMemo, createResource, createSignal, For, Show } from "solid-js";
import { getSwilibDiff, SwilibDiffAction } from "@/api/swilib";
import { useTemporaryFilesStore } from "@/store/temporaryFiles";
import { useSearchParams } from "@solidjs/router";
import { formatAddress, formatId } from "@/utils/format";
import { Alert, Form } from "solid-bootstrap";
import { SwilibEntryName } from "@/components/Swilib/SwilibEntryName";
import clsx from "clsx";

export const SwilibMergeEditorPage: Component = () => {
	const [searchParams] = useSearchParams<{ platform: string }>();
	const platform = () => searchParams.platform ?? '';
	const [temporaryFiles] = useTemporaryFilesStore();
	const [swilibDiff] = createResource(() => getSwilibDiff(platform(), temporaryFiles.sourceVkp, temporaryFiles.destinationVkp));
	const [skipEntries, setSkipEntries] = createSignal<Set<number>>(new Set<number>());

	const conflicts = createMemo(() => {
		return swilibDiff()?.filter((row) => row.action == SwilibDiffAction.ASK || row.left?.error || row.right?.error);
	});

	const newEntries = createMemo(() => {
		return swilibDiff()?.filter((row) => row.action != SwilibDiffAction.ASK && !row.left?.error && !row.right?.error);
	})

	createMemo(() => {
		console.log(swilibDiff());
	});

	const handleRowClick = (e: MouseEvent) => {
		console.log('Row clicked', e);
	};

	const markEntryAsSkip = (id: number, skip: boolean) => {
		setSkipEntries((prev) => {
			const newSet = new Set(prev);
			if (skip) {
				newSet.add(id);
			} else {
				newSet.delete(id);
			}
			return newSet;
		})
	}

	return <>
		<Show when={newEntries()?.length}>
			<h4>New entries ({newEntries()?.length})</h4>
			<table
				class="table table-bordered table-hover table-sticky-header"
				style={{"width": "auto"}}
			>
				<thead class="thead-dark">
					<tr>
						<th>
							<Form.Check type="checkbox" />
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
							class={clsx("cursor-pointer", skipEntries().has(row.id) ? "table-danger" : "table-success")}
							onClick={() => markEntryAsSkip(row.id, !skipEntries().has(row.id))}
						>
							<td>
								<Form.Check
									type="checkbox"
									checked={!skipEntries().has(row.id)}
									onChange={(e) => markEntryAsSkip(row.id, !e.currentTarget.checked)}
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

		<Show when={conflicts()?.length}>
			<h4>Conflicts ({conflicts()?.length})</h4>

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
							checked={row.action == SwilibDiffAction.LEFT}
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
							checked={row.action == SwilibDiffAction.RIGHT}
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
							checked={row.action == SwilibDiffAction.DELETE}
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
	</>;
	/*
	return (
		<div>
			<table
				class="table table-bordered table-hover table-sticky-header"
				style={{"width": "auto"}}
			>
				<thead class="thead-dark">
				<tr>
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
					<th>
						<small>Symbol</small>
					</th>
				</tr>
				</thead>
				<tbody>
				<For each={swilibDiff()}>{(row) =>
					<tr>
						<td>{row.id}</td>
						<td>
							{row.symbol}
							<Show when={row.left?.error}>
								<div class="text-danger">
									{row.left?.error}
								</div>
							</Show>
						</td>
						<td>
							<Show when={row.left}>
								{formatAddress(row.left!.value)}
								<input type="radio"/>
							</Show>
						</td>
						<td>
							<Show when={row.right}>
								<input type="radio"/>
								{formatAddress(row.right!.value)}
							</Show>
						</td>
						<td>
							{row.symbol}
							<Show when={row.right?.error}>
								<div class="text-danger">
									{row.right?.error}
								</div>
							</Show>
						</td>
					</tr>
				}</For>
				</tbody>
			</table>
		</div>
	);*/
};

export default SwilibMergeEditorPage;
