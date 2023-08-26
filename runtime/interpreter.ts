import { ValueType, RuntimeValue, NumberValue, NullValue } from "./values.ts";
import { BinaryExpression, NumericLiteral, Statement, Program } from "../frontend/ast.ts";

export function evaluate(astNode: Statement): RuntimeValue {
    switch (astNode.type) {
        case "NumericLiteral": return { value: ((astNode as NumericLiteral).value), type: "number" } as NumberValue;
        case "NullLiteral": return { type: "null", value: "null" } as NullValue;
        case "BinaryExpression": return evaluateBinaryExpression(astNode as BinaryExpression);
        case "Program": return evaluateProgram(astNode as Program);

        default: throw new Error(`Unknown AST node of type ${(astNode as any).type}`);
    };
}

function evaluateProgram(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = { type: "null", value: "null" } as NullValue;
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
    };
    return lastEvaluated;
};

function evaluateBinaryExpression(binaryOperation: BinaryExpression): RuntimeValue {
    const leftHand = evaluate(binaryOperation.left);
    const rightHand = evaluate(binaryOperation.right);
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
}