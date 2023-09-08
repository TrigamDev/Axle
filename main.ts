import * as readline from 'readline-sync';
import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";
import Environment from './runtime/environment.ts';
import { NumberValue, RuntimeValue } from './runtime/values.ts';

axle();

function axle() {
    console.clear();
    const parser = new Parser();
    const environment = globalEnvironment();
    console.log("Axle v0.1")
    while (true) {
        const input = readline.question("> ");
        if (!input || input.includes("exit")) break;

        const program = parser.produceAST(input);
        const result = evaluate(program, environment);
        
        console.dir(result, { depth: null });
    }
}

/**
 * Sets up the global environment with some default values
 * @returns The global environment
 */
function globalEnvironment(): Environment {
    const environment = new Environment();
    environment.define("test", { type: "number", value: 5 } as NumberValue);
    return environment;
};