import { RuntimeValue } from "./values";

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;

    constructor(parentEnvironment?: Environment) {
        this.parent = parentEnvironment;
        this.variables = new Map();
    };

    /**
     * Defines a new variable in the current scope
     * @param name The name of the variable
     * @param value The value of the variable
     * @returns The value of the variable
     */
    public define(name: string, value: RuntimeValue): RuntimeValue {
        if (this.variables.has(name)) {
            throw new Error(`Variable ${name} already defined in this scope`);
        }
        this.variables.set(name, value);
        return value;
    };

    /**
     * Assigns a value to a variable
     * @param name The name of the variable
     * @param value The value of the variable
     * @returns The value of the variable
     */
    public assign(name: string, value: RuntimeValue): RuntimeValue {
        const environment = this.resolve(name);
        environment.variables.set(name, value);
        return value;
    }

    /**
     * Gets the value of a variable
     * @param name The name of the variable
     * @returns The value of the variable
     */ 
    public get(name: string): RuntimeValue {
        const environment = this.resolve(name);
        return environment.variables.get(name) as RuntimeValue;
    };

    /**
     * Gets the environment that contains the given variable
     * @param name The name of the variable
     * @returns The environment that contains the variable
     */ 
    public resolve(name: string): Environment {
        if (this.variables.has(name)) return this;
        if (this.parent) return this.parent.resolve(name);
        throw new Error(`Variable ${name} not defined`);
    }
}