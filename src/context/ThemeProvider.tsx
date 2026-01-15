import {
	Accessor,
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	onMount,
	ParentComponent,
	useContext
} from "solid-js";
import { makePersistedSignal } from "@/utils/makePersistedSignal";

type ThemeType = "light" | "dark" | "system";

interface ThemeContext {
	theme: Accessor<ThemeType>;
	effectiveTheme: Accessor<ThemeType>;
	switchTheme: () => void;
}

export const ThemeContext = createContext<ThemeContext>();

export const ThemeProvider: ParentComponent = (props) => {
	const [effectiveTheme, setEffectiveTheme] = createSignal<ThemeType>("light");
	const [theme, setTheme] = makePersistedSignal(
		createSignal<ThemeType>("system"),
		{ name: "bootstrapTheme" }
	);
	const [count, setCount] = createSignal(0);

	onMount(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const handleThemeChange = () => {
			if (theme() == "system") {
				setEffectiveTheme(media.matches ? 'dark' : 'light');
			} else {
				setEffectiveTheme(theme());
			}
		};
		media.addEventListener('change', handleThemeChange);
		handleThemeChange();
		createEffect(handleThemeChange);
		onCleanup(() => media.removeEventListener('change', handleThemeChange));
	});

	createEffect(() => document.documentElement.dataset.bsTheme = effectiveTheme());

	return (
		<ThemeContext.Provider value={{
			theme,
			effectiveTheme,
			switchTheme: () => {
				if (theme() == "system") {
					setCount(0);
					setTheme(effectiveTheme() == "dark" ? "light" : "dark");
				} else {
					if (count() == 2) {
						setTheme("system");
					} else {
						setTheme(effectiveTheme() == "dark" ? "light" : "dark");
					}
				}
				setCount((prev) => prev + 1);
			}
		}}>
			{props.children}
		</ThemeContext.Provider>
	);
};

export function useTheme() {
	const value = useContext(ThemeContext);
	if (!value)
		throw new Error("useTheme must be used within a <ThemeProvider>");
	return value;
}
