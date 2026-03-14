import "./Sticky.scss";
import { createSignal, onCleanup, onMount, ParentComponent } from "solid-js";
import clsx from "clsx";

export const Sticky: ParentComponent = (props) => {
	let ref!: HTMLDivElement;
	const [isSticky, setIsSticky] = createSignal(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const e = entries[0];
				setIsSticky(e.intersectionRatio < 1);
			}, {
				threshold: [1],
			}
		);
		observer.observe(ref);
		onCleanup(() => observer.disconnect());
	});

	return (
		<>
			<div ref={ref}></div>
			<div class={clsx("sticky", isSticky() && "sticky--is-sticky")}>
				{props.children}
			</div>
		</>
	);
};
