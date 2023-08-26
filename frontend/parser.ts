// |------------------------------------------------------------|
// |------------------         PARSER         ------------------|
// |---         Parses a list of tokens into an AST          ---|
// |------------------------------------------------------------|

import { Program, Statement } from "./ast.ts";
import { Expression, BinaryExpression } from "./ast.ts";
import { Identifier, NumericLiteral, NullLiteral } from "./ast.ts";

import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private notEOF(): boolean { return this.tokens[0].type !== TokenType.EOF };
    private at(): Token { return this.tokens[0] as Token };
    private eat(): Token { return this.tokens.shift() as Token }
    private expect(type: TokenType, message: string) {
        const prev = this.eat();
        if (!prev || prev.type !== type) throw new Error(message);
        else return prev;
    };

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            type: "Program",
            body: []
        };
        // Parse until EOF
        while (this.notEOF()) {
            program.body.push(this.parseStatement());
        }
        return program;
    };

    private parseStatement(): Statement {
        // Skip to parse expression for now
        return this.parseExpression();
    };

    private parseExpression(): Expression {
        return this.parseAdditiveExpression();
    };

    // Order of operations (higher gets parsed last)
    // 1. PrimaryExpression
    // 2. UnaryExpression
    // 3. MultiplicativeExpression
    // 4. AdditiveExpression

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression();
        while (["+","-"].includes(this.at().value)) {
            const operator = this.eat().value;
            const right = this.parseMultiplicativeExpression();
            left = { type: "BinaryExpression", left, right, operator } as BinaryExpression;
        };
        return left;
    };

    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression();
        while (['*','/','%'].includes(this.at().value)) {
            const operator = this.eat().value;
            const right = this.parsePrimaryExpression();
            left = { type: "BinaryExpression", left, right, operator } as BinaryExpression;
        };
        return left;
    };

    private parsePrimaryExpression(): Expression {
        const token = this.at().type;
        switch (token) {
            case TokenType.Indentifier: return { type: "Identifier", symbol: this.eat().value } as Identifier;
            case TokenType.Null: this.eat(); return { type: "NullLiteral", value: "null" } as NullLiteral;
            case TokenType.Number: return { type: "NumericLiteral", value: Number(this.eat().value) } as NumericLiteral;

            case TokenType.OpenParenthesis: {
                this.eat(); // Skip the open parenthesis
                const value = this.parseExpression();
                this.expect(
                    TokenType.CloseParenthesis,
                    "Unexpected token found inside parenthised expression. Expected ')'."
                ); // Skip the close parenthesis
                return value;
            }
            default: throw new Error(`Unexpected token ${this.at().value} of type ${TokenType[this.at().type]}`);
        }
    };
};