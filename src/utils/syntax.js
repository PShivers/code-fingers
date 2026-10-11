// Syntax Highlighting Tokenizer for Code Typing
const KEYWORDS_BY_LANG = {
	javascript: new Set([
		"function", "return", "const", "let", "var", "if", "else", "for", "while",
		"do", "switch", "case", "break", "continue", "default", "import", "export",
		"from", "default", "new", "this", "class", "extends", "super", "try", "catch",
		"finally", "throw", "typeof", "instanceof", "async", "await", "yield", "of",
		"in", "true", "false", "null", "undefined",
	]),
	typescript: new Set([
		"function", "return", "const", "let", "var", "if", "else", "for", "while",
		"do", "switch", "case", "break", "continue", "default", "import", "export",
		"from", "new", "this", "class", "extends", "super", "try", "catch", "finally",
		"throw", "typeof", "instanceof", "async", "await", "yield", "of", "in",
		"type", "interface", "enum", "implements", "declare", "readonly", "as", "keyof",
		"true", "false", "null", "undefined",
	]),
	python: new Set([
		"def", "return", "if", "elif", "else", "for", "while", "in", "import", "from",
		"as", "class", "try", "except", "finally", "raise", "with", "lambda", "pass",
		"yield", "async", "await", "assert", "and", "or", "not", "is", "None", "True",
		"False", "global", "nonlocal",
	]),
	rust: new Set([
		"fn", "let", "mut", "return", "if", "else", "match", "for", "while", "loop",
		"in", "impl", "struct", "enum", "trait", "pub", "use", "mod", "as", "type",
		"unsafe", "where", "async", "await", "const", "static", "self", "Self",
		"true", "false", "move", "ref", "crate", "super",
	]),
	go: new Set([
		"func", "return", "package", "import", "var", "const", "type", "struct",
		"interface", "if", "else", "for", "range", "switch", "case", "default",
		"go", "chan", "select", "defer", "map", "true", "false", "nil", "fallthrough",
	]),
	c: new Set([
		"int", "char", "float", "double", "void", "short", "long", "signed", "unsigned",
		"const", "static", "struct", "union", "enum", "typedef", "extern", "return",
		"if", "else", "for", "while", "do", "switch", "case", "break", "continue",
		"default", "sizeof", "NULL", "true", "false",
	]),
	cpp: new Set([
		"int", "char", "float", "double", "void", "bool", "auto", "short", "long",
		"unsigned", "signed", "const", "static", "struct", "class", "public", "private",
		"protected", "return", "if", "else", "for", "while", "do", "switch", "case",
		"break", "continue", "default", "namespace", "using", "template", "typename",
		"vector", "string", "new", "delete", "nullptr", "true", "false", "override",
		"virtual", "const_cast", "dynamic_cast", "static_cast",
	]),
	csharp: new Set([
		"int", "string", "bool", "void", "double", "float", "var", "object", "class",
		"struct", "interface", "enum", "public", "private", "protected", "internal",
		"static", "readonly", "return", "if", "else", "for", "foreach", "while", "do",
		"switch", "case", "break", "continue", "default", "using", "namespace", "new",
		"this", "base", "null", "true", "false", "async", "await", "try", "catch", "finally",
	]),
	java: new Set([
		"public", "private", "protected", "class", "interface", "enum", "extends",
		"implements", "static", "final", "void", "int", "boolean", "double", "float",
		"char", "byte", "short", "long", "String", "return", "if", "else", "for",
		"while", "do", "switch", "case", "break", "continue", "default", "new", "this",
		"super", "try", "catch", "finally", "throw", "throws", "import", "package",
		"null", "true", "false",
	]),
	sql: new Set([
		"select", "from", "where", "insert", "into", "values", "update", "set",
		"delete", "create", "table", "join", "inner", "left", "right", "full", "outer",
		"on", "group", "by", "order", "asc", "desc", "having", "limit", "and", "or",
		"not", "in", "is", "null", "as", "distinct", "union", "all", "between", "like",
		"primary", "key", "foreign", "references", "drop", "alter", "add", "index",
	]),
};

const TYPES_COMMON = new Set([
	"string", "number", "boolean", "any", "void", "never", "unknown", "int", "float",
	"double", "char", "bool", "usize", "isize", "i8", "i16", "i32", "i64", "i128",
	"u8", "u16", "u32", "u64", "u128", "f32", "f64", "str", "String", "Vec", "Option",
	"Result", "Some", "None", "Ok", "Err", "Box", "Rc", "Arc", "Vector", "List", "Map",
	"Set", "Dict", "Tuple", "Array", "Promise", "Math", "Console", "console", "Object",
	"Integer", "Double", "Boolean", "Character", "Long", "Float", "ArrayList", "HashMap",
]);

export function tokenizeLine(lineStr, lang = "javascript") {
	const keywords = KEYWORDS_BY_LANG[lang] || KEYWORDS_BY_LANG.javascript;
	const n = lineStr.length;
	const tokens = new Array(n).fill("plain");

	let i = 0;
	while (i < n) {
		const ch = lineStr[i];

		// Check for comments
		if (
			(ch === "/" && lineStr[i + 1] === "/") ||
			(ch === "#" && (lang === "python" || lang === "bash")) ||
			(ch === "-" && lineStr[i + 1] === "-" && lang === "sql")
		) {
			for (let j = i; j < n; j++) tokens[j] = "comment";
			break;
		}

		// Check for string literals
		if (ch === `"` || ch === `'` || ch === "`") {
			const quote = ch;
			const start = i;
			tokens[i] = "string";
			i++;
			while (i < n) {
				tokens[i] = "string";
				if (lineStr[i] === "\\" && i + 1 < n) {
					tokens[i + 1] = "string";
					i += 2;
					continue;
				}
				if (lineStr[i] === quote) {
					i++;
					break;
				}
				i++;
			}
			continue;
		}

		// Check for numbers
		if (/\d/.test(ch) && (i === 0 || /[\s\(\[\{,\+\-\*\/\<\>\=\:\;]/.test(lineStr[i - 1]))) {
			const start = i;
			while (i < n && /[\d\.xXoObBa-fA-F_]/.test(lineStr[i])) {
				tokens[i] = "number";
				i++;
			}
			continue;
		}

		// Check for words (identifiers, keywords, types, functions)
		if (/[a-zA-Z_]/.test(ch)) {
			const start = i;
			let word = "";
			while (i < n && /[a-zA-Z0-9_]/.test(lineStr[i])) {
				word += lineStr[i];
				i++;
			}

			const lowerWord = word.toLowerCase();
			const isKeyword = keywords.has(lang === "sql" ? lowerWord : word);
			const isType = TYPES_COMMON.has(word);
			const isFunc = i < n && lineStr[i] === "(";

			let tokenType = "plain";
			if (isKeyword) {
				tokenType = "keyword";
			} else if (isType) {
				tokenType = "type";
			} else if (isFunc) {
				tokenType = "function";
			}

			for (let j = start; j < i; j++) {
				tokens[j] = tokenType;
			}
			continue;
		}

		// Check for operators
		if (/[\+\-\*\/\%\=\!\<\>\&\|\^\~\?\:]/.test(ch)) {
			tokens[i] = "operator";
			i++;
			continue;
		}

		// Punctuation
		if (/[\{\}\(\)\[\]\,\;\.]/.test(ch)) {
			tokens[i] = "punctuation";
			i++;
			continue;
		}

		i++;
	}

	return tokens;
}
