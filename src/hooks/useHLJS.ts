import hljs from 'highlight.js/lib/core';
import hljsLangC from 'highlight.js/lib/languages/c';

hljs.registerLanguage('c', hljsLangC);

export function useHLJS() {
	return hljs;
}
