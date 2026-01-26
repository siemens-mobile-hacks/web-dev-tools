import "./CodeMirror.scss";
import { Component, createEffect, createMemo, onCleanup, onMount } from "solid-js";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import {
	crosshairCursor,
	drawSelection,
	dropCursor,
	EditorView,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
	rectangularSelection
} from "@codemirror/view";
import { bracketMatching, foldGutter, foldKeymap, indentOnInput } from "@codemirror/language";
import { defaultKeymap, history, historyKeymap, indentLess, indentMore } from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { useTheme } from "@/context/ThemeProvider";
import { xcodeDark, xcodeLight } from "@uiw/codemirror-theme-xcode";

interface CodeMirrorProps {
	extensions?: Extension[];
	value?: string;
	defaultValue?: string;
	onChange?: (content: string) => void;
}

export const CodeMirror: Component<CodeMirrorProps> = (props) => {
	let view: EditorView;
	let parentRef!: HTMLDivElement;
	let currentValue = "";
	const themeCompartment = new Compartment();
	const extensionsCompartments = new Compartment();

	const { effectiveTheme } = useTheme();

	const editorTheme = createMemo(() => {
		return effectiveTheme() == "dark" ? [xcodeDark] : [xcodeLight];
	});

	const updateListener = EditorView.updateListener.of((update) => {
		if (update.docChanged) {
			currentValue = update.state.doc.toString();
			props.onChange && props.onChange(currentValue);
		}
	});

	onMount(() => {
		currentValue = props.value ?? props.defaultValue ?? "";

		view = new EditorView({
			doc: currentValue,
			parent: parentRef,
			extensions: [
				// A line number gutter
				lineNumbers(),
				// A gutter with code folding markers
				foldGutter(),
				// Replace non-printable characters with placeholders
				highlightSpecialChars(),
				// The undo history
				history(),
				// Replace the native cursor/selection with our own
				drawSelection(),
				// Show a drop cursor when dragging over the editor
				dropCursor(),
				// Allow multiple cursors/selections
				EditorState.allowMultipleSelections.of(true),
				// Re-indent lines when typing specific input
				indentOnInput(),
				// Highlight syntax with a default style
				//syntaxHighlighting(defaultHighlightStyle),
				// Highlight matching brackets near the cursor
				bracketMatching(),
				// Automatically close brackets
				closeBrackets(),
				// Load the autocompletion system
				autocompletion(),
				// Allow alt-drag to select rectangular regions
				rectangularSelection(),
				// Change the cursor to a crosshair when holding alt
				crosshairCursor(),
				// Style the current line specially
				highlightActiveLine(),
				// Style the gutter for the current line specially
				highlightActiveLineGutter(),
				// Highlight text that matches the selected text
				highlightSelectionMatches(),
				keymap.of([
					// Closed-bracket-aware backspace
					...closeBracketsKeymap,
					// A large set of basic bindings
					...defaultKeymap,
					// Search-related keys
					...searchKeymap,
					// Redo/undo keys
					...historyKeymap,
					// Code folding bindings
					...foldKeymap,
					// Autocompletion keys
					...completionKeymap,
					// Keys related to the linter system
					...lintKeymap,
					{
						key: "Tab",
						preventDefault: true,
						run: indentMore,
					},
					{
						key: "Shift-Tab",
						preventDefault: true,
						run: indentLess,
					},
				]),
				EditorView.theme({
					'&': {
						flex: '1 1 auto',
						minHeight: '0',
						minWidth: '0',
						border: '1px solid var(--bs-content-separator)',
						outline: 'none'
					},
					'&.cm-focused': {
						outline: 'none'
					}
				}),
				extensionsCompartments.of(props.extensions ?? []),
				themeCompartment.of(editorTheme()),
				updateListener,
			]
		});
	});

	onCleanup(() => view.destroy());

	createEffect(() => view.dispatch({
		effects: themeCompartment.reconfigure(editorTheme())
	}));

	createEffect(() => view.dispatch({
		effects: extensionsCompartments.reconfigure(props.extensions ?? [])
	}));

	createEffect(() => {
		if (props.value != null && props.value !== currentValue) {
			console.warn("CodeMirror value changed outside of component. Updating...");
			currentValue = props.value ?? "";
			view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: currentValue } });
		}
	});

	return (<div class="cm-wrapper" ref={parentRef}></div>);
}
