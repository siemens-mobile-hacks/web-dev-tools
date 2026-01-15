import { Component, Match, Switch } from 'solid-js';
import { SwilibEntryType } from "@/api/swilib";

interface SwilibEntryTypeBadgeProps {
	value: number;
}

export const SwilibEntryTypeBadge: Component<SwilibEntryTypeBadgeProps> = (props) => {
	return (
		<Switch fallback={<i class="bi bi-x-circle me-2"></i>}>
			<Match when={props.value == SwilibEntryType.FUNCTION}>
				<i class="bi bi-c-circle-fill text-muted me-2"></i>
			</Match>
			<Match when={props.value == SwilibEntryType.POINTER}>
				<i class="bi bi-arrow-up-right-circle text-muted me-2"></i>
			</Match>
			<Match when={props.value == SwilibEntryType.VALUE}>
				<i class="bi bi-hash text-muted me-2"></i>
			</Match>
		</Switch>
	);
};
