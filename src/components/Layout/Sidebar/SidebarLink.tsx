import { Component } from "solid-js";
import { useMatch } from "@solidjs/router";
import { resolveURL } from "@/utils";
import clsx from "clsx";

export interface SidebarLinkProps {
	label: string;
	href: string;
	icon: string;
}

export const SidebarLink: Component<SidebarLinkProps> = (props) => {
	const match = useMatch(() => resolveURL(props.href));
	return (
		<a
			class={clsx("sidebar__link", match() && "sidebar__link--active")}
			href={props.href}
		>
			<i class={`bi ${props.icon} sidebar__icon`}/>
			<span class="sidebar__label">{props.label}</span>
		</a>
	);
};
