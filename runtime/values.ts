export type ValueType = 
    | "number"
    | "null"

export interface RuntimeValue {
    type: ValueType;
};

export interface NullValue extends RuntimeValue {
    type: "null";
    value: "null";
};

export function createNullValue(): NullValue {
    return { type: "null", value: "null" } as NullValue;
}

export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
};

export function createNumberValue(value: number): NumberValue {
    return { type: "number", value: value } as NumberValue;
}