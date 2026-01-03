import { Component, Show } from 'solid-js';
import { SwilibEntryFlags } from "@/api/swilib";

interface SwilibEntryBadgesProps {
	value: number;
}

export const SwilibEntryBadges: Component<SwilibEntryBadgesProps> = (props) => {
	return (
		<>
			<Show when={props.value & SwilibEntryFlags.FROM_PATCH}>
				<span
					class="badge small rounded-pill bg-danger"
					title="Function from patch. Don't use in the ELF's!"
				>
					PATCH
				</span>
			</Show>

			<Show when={props.value & SwilibEntryFlags.BUILTIN}>
				<span
					class="badge small rounded-pill bg-info"
					title="Built-in function from ELFLoader."
				>
					LOADER
				</span>
			</Show>

			<Show when={props.value & SwilibEntryFlags.DIRTY}>
				<span
					class="badge small rounded-pill bg-danger"
					title="Some phone models define this entry in swilib.vkp."
				>
					DIRTY
				</span>
			</Show>
		</>
	);
};
