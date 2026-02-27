import { Component, createMemo, Show } from 'solid-js';

interface SwilibEntryNameProps {
	name?: string;
	file?: string;
}

export const SwilibEntryName: Component<SwilibEntryNameProps> = (props) => {
	const signature = createMemo(() => {
		const matched = props.name?.trim().match(/^(.*?)\s+([*]+)?(\w+)\s*\((.+?)?\)$/is);
		if (matched) {
			return {
				returnType: `${matched[1]}\xA0${matched[2] || ""}`,
				name: matched[3],
				args: `(${matched[4] != "" && matched[4] != "void" ? "…" : "void"})`
			};
		}
		return undefined;
	});
	const unusedLabel = () => props?.file == 'swilib/unused.h' ? 'Unused' : 'Reserved by ELFLoader';

	return (
		<Show when={signature()} fallback={props?.name ?? <small class="text-muted">{unusedLabel()}</small>}>
			<span class="text-muted">
				{signature()?.returnType}
			</span>
			<span class="text-primary">
				{signature()?.name}
			</span>
			<span class="text-muted">
				{signature()?.args}
			</span>
		</Show>
	);
};
