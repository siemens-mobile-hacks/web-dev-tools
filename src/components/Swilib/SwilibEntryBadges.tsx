import { Component, Show } from 'solid-js';
import { SwilibEntryFlags } from "@/api/swilib";
import { Badge } from "solid-bootstrap";

interface SwilibEntryBadgesProps {
	value: number;
}

export const SwilibEntryBadges: Component<SwilibEntryBadgesProps> = (props) => {
	return (
		<>
			<Show when={props.value & SwilibEntryFlags.FROM_PATCH}>
				<Badge
					class="rounded-pill bg-danger"
					title="Function from patch. Don't use in ELFs!"
				>
					PATCH
				</Badge>
			</Show>

			<Show when={props.value & SwilibEntryFlags.BUILTIN}>
				<Badge
					class="rounded-pill bg-info"
					title="Built-in function from ELFLoader."
				>
					LOADER
				</Badge>
			</Show>

			<Show when={props.value & SwilibEntryFlags.DIRTY}>
				<Badge
					class="rounded-pill bg-danger"
					title="Some phone models define this entry in swilib.vkp."
				>
					DIRTY
				</Badge>
			</Show>
		</>
	);
};
