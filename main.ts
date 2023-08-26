import * as readline from 'readline-sync';
import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";

axle();

function axle() {
    console.clear();
    const parser = new Parser();
    console.log("Axle v0.1")
    while (true) {
        const input = readline.question("> ");
        if (!input || input.includes("exit")) break;

        const program = parser.produceAST(input);
        const result = evaluate(program);
        
        console.dir(result, { depth: null });
    }
}