"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirectiveNode = exports.createBooleanValueNode = exports.createStringValueNode = exports.createNameNode = void 0;
var language_1 = require("graphql/language");
function createNameNode(value) {
    return {
        kind: language_1.Kind.NAME,
        value: value,
    };
}
exports.createNameNode = createNameNode;
function createStringValueNode(value, block) {
    if (block === void 0) { block = false; }
    return {
        kind: language_1.Kind.STRING,
        value: value,
        block: block,
    };
}
exports.createStringValueNode = createStringValueNode;
function createBooleanValueNode(value) {
    return {
        kind: language_1.Kind.BOOLEAN,
        value: value,
    };
}
exports.createBooleanValueNode = createBooleanValueNode;
function createDirectiveNode(name, directiveArguments) {
    if (directiveArguments === void 0) { directiveArguments = {}; }
    return {
        kind: language_1.Kind.DIRECTIVE,
        name: createNameNode(name),
        arguments: Object.entries(directiveArguments).map(function (_a) {
            var argumentName = _a[0], value = _a[1];
            return ({
                kind: language_1.Kind.ARGUMENT,
                name: createNameNode(argumentName),
                value: value,
            });
        }),
    };
}
exports.createDirectiveNode = createDirectiveNode;
//# sourceMappingURL=ast-builders.js.map