import { A } from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { SwilibDevice } from "@/api/swilib";

interface SwilibTargetsTabsProps {
	selected?: string;
	devices?: SwilibDevice[];
}

export const SwilibTargetsTabs: Component<SwilibTargetsTabsProps> = (props) => {
	return (
		<Show when={props.devices} fallback={<div style="min-height: 48px"></div>}>
			<div class="d-flex justify-content-between">
				<For each={props.devices}>{(device) =>
					<A
						class="text-center text-decoration-none"
						classList={{
							'fw-bold': props.selected === device.target
						}}
						href={`/swilib/phone/?target=${device.target}`}
						title={`Swilib info for ${device.model}`}
					>
						<small>{device.model}</small><br />
						<sup class="text-muted">
							v{device.sw}
						</sup>
					</A>
				}</For>
			</div>
		</Show>
	);
};
