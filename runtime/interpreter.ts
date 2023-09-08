import { ValueType, RuntimeValue, NumberValue, NullValue } from "./values.ts";
import { BinaryExpression, NumericLiteral, Statement, Program, Identifier } from "../frontend/ast.ts";
import Environment from "./environment.ts";

export function evaluate(astNode: Statement, environment: Environment): RuntimeValue {
    switch (astNode.type) {
        case "NumericLiteral": return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberValue;
        case "NullLiteral": return { type: "null", value: "null" } as NullValue;
        case "Identifier": return evaluateIdentifier(astNode as Identifier, environment);
        case "BinaryExpression": return evaluateBinaryExpression(astNode as BinaryExpression, environment);
        case "Program": return evaluateProgram(astNode as Program, environment);

        default: throw new Error(`Unknown AST node of type ${(astNode as any).type}`);
    };
}

function evaluateProgram(program: Program, environment: Environment): RuntimeValue {
    let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue;
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, environment);
    };
    return lastEvaluated;
};

function evaluateBinaryExpression(binaryOperation: BinaryExpression, environment: Environment): RuntimeValue {
    const leftHand = evaluate(binaryOperation.left, environment);
    const rightHand = evaluate(binaryOperation.right, environment);
    if (leftHand.type == "number" && rightHand.type == "number") {
        return evaluateNumericBinaryExpression(leftHand as NumberValue, rightHand as NumberValue, binaryOperation.operator);
    } else return { type: "null", value: "null" } as NullValue;
}

function evaluateNumericBinaryExpression(left: NumberValue, right: NumberValue, operator: string): RuntimeValue {
    let result: number = 0;
    if (operator == "+") result = left.value + right.value;
    else if (operator == "-") result = left.value - right.value;
    else if (operator == "*") result = left.value * right.value;
    else if (operator == "/") result = left.value / right.value; // DO DIVIDE BY ZERO CHECK
    else if (operator == "%") result = left.value % right.value;
    return { type: "number", value: result } as RuntimeValue;
};

function evaluateIdentifier(identifier: Identifier, environment: Environment): RuntimeValue {
    const value = environment.get(identifier.symbol);
    if (!value) throw new Error(`Undefined variable ${identifier.symbol}`);
    return value;
}