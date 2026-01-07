import { Component, Show } from 'solid-js';
import { SwilibEntryFlags } from "@/api/swilib";

interface SwilibEntryWarningsProps {
	value: number;
}

export const SwilibEntryWarnings: Component<SwilibEntryWarningsProps> = (props) => {
	return (
		<>
			<Show when={props.value & SwilibEntryFlags.FROM_PATCH}>
				<span class="text-danger">
					<i class="bi bi-exclamation-triangle"></i> {' '}
					Function from patch. Don't use in ELFs!
				</span>
			</Show>

			<Show when={props.value & SwilibEntryFlags.BUILTIN}>
				<span class="text-info">
					<i class="bi bi-info-circle"></i> {' '}
					Built-in function from ELFLoader.
				</span>
			</Show>

			<Show when={props.value & SwilibEntryFlags.DIRTY}>
				<span class="text-danger">
					<i class="bi bi-exclamation-triangle"></i> {' '}
					Some phone models define this entry in swilib.vkp.
				</span>
			</Show>
		</>
	);
};
