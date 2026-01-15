import './Header.scss';
import { Component, Match, Show, Switch } from "solid-js";
import { A } from "@solidjs/router";
import MenuIcon from '@/assets/icons/menu.svg';
import BrightnessIcon from '@material-design-icons/svg/outlined/brightness_medium.svg';
import BedtimeIcon from '@material-design-icons/svg/outlined/bedtime.svg';
import LightModeIcon from '@material-design-icons/svg/outlined/light_mode.svg';
import { useTheme } from "@/context/ThemeProvider";

interface HeaderProps {
	showSidebarToggleButton: boolean;
	onSidebarToggle?: () => void;
}

export const Header: Component<HeaderProps> = (props) => {
	const { theme, switchTheme } = useTheme();

	return (
		<div class="header">
			<Show when={props.showSidebarToggleButton}>
				<button class="header__button" onClick={() => props.onSidebarToggle?.()}>
					<MenuIcon class="fs-4" />
				</button>
			</Show>

			<A href={"/"} class="header__title">
				Dev Tools
			</A>

			<button class="header__button" onClick={() => switchTheme()}>
				<Switch>
					<Match when={theme() == 'light'}>
						<LightModeIcon class="fs-4" />
					</Match>

					<Match when={theme() == 'dark'}>
						<BedtimeIcon class="fs-4" />
					</Match>

					<Match when={theme() == 'system'}>
						<BrightnessIcon class="fs-4" />
					</Match>
				</Switch>
			</button>
		</div>
	);
};
