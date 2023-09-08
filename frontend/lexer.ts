// |------------------------------------------------------------|
// |------------------         LEXER         -------------------|
// |---     Converts source code into an array of tokens     ---|
// |------------------------------------------------------------|

export enum TokenType {
    // Literal types
    Indentifier,
    Null,
    Number,
    String,
    // Variable assignment
    Var,
    Assignent,
    // Operation
    Operator,
    // Brackets/braces
    OpenParenthesis,
    CloseParenthesis,
    // Util
    EOF,
    // Other
};

/**
 * Constant lookup for keywords and known identifiers and symbols
 */
const keywords: Record<string, TokenType> = {
    "var": TokenType.Var,
    "null": TokenType.Null,
}

/**
 * Represents a single token from the source code
 * - Used by the parser to build the AST
 */ 
export interface Token {
    value: string;
    type: TokenType;
};

/**
 * Converts the source code into an array of tokens
 * @param input The source code to convert
 * @returns An array of generated tokens
 */
export function tokenize(input: string): Token[] {
    const tokens = new Array<Token>();
    let src = input.split("");
    while (src.length > 0) {
        //! Single character tokens
        // Brackets/braces
        if (src[0] === "(") tokens.push(token(src.shift(), TokenType.OpenParenthesis))
        else if (src[0] === ")") tokens.push(token(src.shift(), TokenType.CloseParenthesis))
        // Operators
        else if (['+','-','*','/','%'].includes(src[0])) tokens.push(token(src.shift(), TokenType.Operator))
        else if (src[0] === "=") tokens.push(token(src.shift(), TokenType.Assignent))
        //! Multi character tokens
        else {
            if (isInt(src[0])) {
                //! Numerical tokens
                let num = "";
                while (src.length > 0 && isInt(src[0])) num += src.shift();
                tokens.push(token(num, TokenType.Number));
            } else if (isAlphabetic(src[0])) {
                //! Alphabetical tokens
                let indentifier = "";
                while (src.length > 0 && isAlphabetic(src[0])) indentifier += src.shift();
                // Check for reserved keywords
                const keyword = keywords[indentifier];
                if (typeof keyword === "number") tokens.push(token(indentifier, keyword));
                // Otherwise it's an indentifier
                else tokens.push(token(indentifier, TokenType.Indentifier));
            } else if (isSkippable(src[0])) src.shift(); // Skip whitespace
            else throw new Error(`Unexpected token ${src[0]}`);
        };
    };
    tokens.push(token("EndOfFile", TokenType.EOF));
    return tokens;
};

/**
 * Generates a token from the given data
 * @param value A string value of the token
 * @param type The TokenType
 * @returns A generated token
 */
function token(value = '', type: TokenType): Token { return { value, type } };

/**
 * Evaluates whether a string is text
 * @param src The string to evaluate
 * @returns A boolean indicating whether the string is text
 */
function isAlphabetic(src: string) { return src.match(/[a-z]/i) !== null };

/**
 * Evaluates whether a string is an integer
 * @param src The string to evaluate
 * @returns A boolean indicating whether the string is an integer
 */
function isInt(src: string) { return !isNaN(parseInt(src)) };

/**
 * Evaluates whether a string is a skippable character
 * @param src The string to evaluate
 * @returns A boolean indicating whether the string is skippable
 */
function isSkippable(src: string) { return ['', ' ', '\n', '\t'].includes(src) };