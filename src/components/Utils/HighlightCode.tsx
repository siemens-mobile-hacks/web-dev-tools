import { Component, ComponentProps, createMemo, splitProps } from "solid-js";
import hljs from 'highlight.js/lib/core';
import hljsLangC from 'highlight.js/lib/languages/c';

hljs.registerLanguage('c', hljsLangC);

interface HighlightCodeProps extends ComponentProps<"div"> {
	code: string;
	language: string;
}

export const HighlightCode: Component<HighlightCodeProps> = (props) => {
	const [local, other] = splitProps(props, ["code", "language"]);
	const highligtedCode = createMemo(() => hljs.highlight(local.code, { language: local.language }).value);
	return <div innerHTML={highligtedCode()} {...other}></div>;
}
