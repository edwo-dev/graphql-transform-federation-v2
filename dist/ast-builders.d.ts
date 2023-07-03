import { NameNode, StringValueNode, BooleanValueNode, ConstDirectiveNode, ConstValueNode } from 'graphql/language';
export declare function createNameNode(value: string): NameNode;
export declare function createStringValueNode(value: string, block?: boolean): StringValueNode;
export declare function createBooleanValueNode(value: boolean): BooleanValueNode;
export declare function createDirectiveNode(name: string, directiveArguments?: {
    [argumentName: string]: ConstValueNode;
}): ConstDirectiveNode;
