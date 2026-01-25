import { Component, createMemo, Show } from 'solid-js';
import { SummarySwilibAnalysisEntry } from "@/api/swilib";

interface SwilibEntryNameProps {
	entry: SummarySwilibAnalysisEntry;
}

export const SwilibEntryName: Component<SwilibEntryNameProps> = (props) => {
	const signature = createMemo(() => {
		const matched = props.entry.name?.trim().match(/^(.*?)\s+([*]+)?(\w+)\s*\((.+?)?\)$/is);
		if (matched) {
			return {
				returnType: `${matched[1]}\xA0${matched[2] || ""}`,
				name: matched[3],
				args: `(${matched[4] != "" && matched[4] != "void" ? "…" : "void"})`
			};
		}
		return undefined;
	});
	const unusedLabel = () => props.entry.file == 'swilib/unused.h' ? 'Unused' : 'Reserved by ELFLoader';

	return (
		<Show when={signature()} fallback={props.entry.name ?? <small class="text-muted">{unusedLabel()}</small>}>
			<small class="text-muted">
				{signature()?.returnType}
			</small>
			<span class="text-primary">
				{signature()?.name}
			</span>
			<span class="text-muted">
				{signature()?.args}
			</span>
		</Show>
	);
};
