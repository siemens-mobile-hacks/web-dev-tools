import { LanguageSupport, StreamLanguage, type StreamParser } from "@codemirror/language";

const vkpParser: StreamParser<{}> = {token(stream) {
		if (stream.eatSpace())
			return null;

		if (stream.peek() === ";" || stream.match("//")) {
			stream.skipToEnd();
			return "comment";
		}

		if (stream.match("/*")) {
			if (stream.skipTo("*/")) {
				stream.next();
				stream.next();
				return "comment";
			}
			stream.skipToEnd();
			return "invalid";
		}

		if (stream.sol() && stream.match("#pragma")) {
			while (true) {
				if (!stream.eatSpace())
					break;
				if (!stream.eatWhile(/[\w_]/))
					break;
			}
			return "keyword";
		}

		if (stream.sol() && stream.match(/[+\-][0-9a-fA-Fx]+/))
			return "operatorKeyword";

		if (stream.sol() && stream.match(/[0-9a-fA-F]+:/))
			return "def";

		const ch = stream.next();
		if (ch === ",")
			return "operatorKeyword";
		if (ch === "\\")
			return "operatorKeyword";

		if (ch === '"' || ch === "'") {
			const stringQuote = ch;
			while (!stream.eol()) {
				const c = stream.next();
				if (c === stringQuote)
					break;
				if (c === "\\") {
					if (!stream.eol())
						stream.next();
				}
			}
			return "string";
		}

		if (ch === "0") {
			if (stream.match(/[xX][0-9a-fA-F]+/))
				return "number";
			if (stream.match(/[nN][01]+/))
				return "number";
			if (stream.match(/[iI][+\-]?\d+/))
				return "number";
		}

		if (stream.match(/[0-9a-fA-F]+/))
			return "number";

		return null;
	},

	languageData: {
		commentTokens: {
			line: ";",
			block: {open: "/*", close: "*/"}
		}
	}
};

const vkpStreamLanguage = StreamLanguage.define(vkpParser);

export function codemirrorVkpLanguage() {
	return new LanguageSupport(vkpStreamLanguage);
}
