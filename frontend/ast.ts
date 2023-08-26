// |------------------------------------------------------------|
// |------------------       AST TYPES       -------------------|
// |---           Defines the structure of the AST           ---|
// |------------------------------------------------------------|

// ! NOTES
/*
    make variable declaration and assignment the same thing
    and make it an expression, not statement
    allows for cool shit like this:
        - var x = if (true) { 45 } else { 55 }
*/

export type NodeType = 
    // Main
    | "Program"
    // Literals
    | "Identifier"
    | "NumericLiteral"
    | "StringLiteral"
    | "NullLiteral"
    // Assignment
    | "VariableAssignment"
    // Expressions
    | "BinaryExpression"
    | "CallExpression"
    | "UnaryExpression"
    // Functions
    | "FunctionDeclaration"
    | "FunctionCall"

export interface Statement {
    type: NodeType;
};

/**
 * Defines a block representing the file, containing many statements
 * - Only one Program may exist per file
 */
export interface Program extends Statement {
    type: "Program";
    body: Statement[];
};

/**
 * A Statement that will return with a value
 */
export interface Expression extends Statement {};

/**
 * An expression representing a binary operation
 */
export interface BinaryExpression extends Expression {
    type: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
};

/**
 * An expression representing an Identifier
 */
export interface Identifier extends Expression {
    type: "Identifier";
    symbol: string;
};

/**
 * An expression representing a Numeric Literal
 */
export interface NumericLiteral extends Expression {
    type: "NumericLiteral";
    value: number;
};

/**
 * An expression representing a Null value
 */
export interface NullLiteral extends Expression {
    type: "NullLiteral";
    value: "null";
};