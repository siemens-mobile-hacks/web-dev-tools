import { onCleanup } from "solid-js";

export function usePreventClickAfterSelection() {
	let cursorIsMoved = false;

	const handleMouseDown = () => {
		cursorIsMoved = false;
	};
	const handleMouseMove = () => {
		cursorIsMoved = true;
	};
	const handleClick = (e: MouseEvent) => {
		const selection = document.getSelection();
		if (selection && selection.type === 'Range' && cursorIsMoved) {
			if ((e.target as Node)?.contains(selection.focusNode)) {
				e.stopPropagation();
				e.preventDefault();
			}
		}
	};

	document.body.addEventListener('mousedown', handleMouseDown, { passive: true });
	document.body.addEventListener('mousemove', handleMouseMove, { passive: true });
	document.body.addEventListener('click', handleClick);

	onCleanup(() => {
		document.body.removeEventListener('mousedown', handleMouseDown);
		document.body.removeEventListener('mousemove', handleMouseMove);
		document.body.removeEventListener('click', handleClick);
	});
}
