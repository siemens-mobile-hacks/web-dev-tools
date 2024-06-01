import hljs from 'highlight.js/lib/core';
import hljsLangC from 'highlight.js/lib/languages/c';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('c', hljsLangC);

export default hljs;
