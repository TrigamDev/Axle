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

export interface NumberValue extends RuntimeValue {
    type: "number";
    value: number;
};