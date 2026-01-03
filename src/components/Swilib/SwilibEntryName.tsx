import { Component, createMemo, Show } from 'solid-js';

interface SwilibEntryNameProps {
	signature: string | null;
}

export const SwilibEntryName: Component<SwilibEntryNameProps> = (props) => {
	const signature = createMemo(() => {
		const matched = props.signature?.trim().match(/^(.*?)\s+([*]+)?(\w+)\s*\((.+?)?\)$/is);
		if (matched) {
			return {
				returnType: `${matched[1]}\xA0${matched[2] || ""}`,
				name: matched[3],
				args: `(${matched[4] != "" && matched[4] != "void" ? "…" : "void"})`
			};
		}
		return undefined;
	});
	return (
		<Show when={signature()} fallback={props.signature ?? <small class="text-muted">Unused.</small>}>
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
