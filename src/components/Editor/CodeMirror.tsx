import { Component, onCleanup, onMount } from "solid-js";
import { EditorState } from "@codemirror/state";
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
import {
	bracketMatching,
	defaultHighlightStyle,
	foldGutter,
	foldKeymap,
	indentOnInput,
	syntaxHighlighting
} from "@codemirror/language";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";

export const CodeMirror: Component = () => {
	let view: EditorView;
	let parentRef!: HTMLDivElement;

	onMount(() => {
		view = new EditorView({
			doc: "Start document",
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
				syntaxHighlighting(defaultHighlightStyle),
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
				// codemirrorVkpLanguageExtension(),
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
					...lintKeymap
				]),
				EditorView.theme({ '&': { height: '100%' } })
			]
		});
	});

	onCleanup(() => view.destroy());

	return (
		<div ref={parentRef}></div>
	);
}
