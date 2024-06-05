import hljs from 'highlight.js/lib/core';
import hljsLangC from 'highlight.js/lib/languages/c';
import './hljs.scss';

hljs.registerLanguage('c', hljsLangC);

export default hljs;
