"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSchemaFederation = void 0;
var utils_1 = require("@graphql-tools/utils");
var graphql_1 = require("graphql");
var transform_sdl_1 = require("./transform-sdl");
var types_1 = require("@apollo/subgraph/dist/types");
function transformSchemaFederation(schema, federationConfig) {
    var _a, _b, _c;
    var schemaWithFederationDirectives = (0, transform_sdl_1.addFederationAnnotations)((0, graphql_1.printSchema)(schema), federationConfig);
    var schemaWithQueryType = !schema.getQueryType()
        ? new graphql_1.GraphQLSchema(__assign(__assign({}, schema.toConfig()), { query: new graphql_1.GraphQLObjectType({
                name: 'Query',
                fields: {},
            }) }))
        : schema;
    var entityTypes = Object.fromEntries(Object.entries(federationConfig)
        .filter(function (_a) {
        var keyFields = _a[1].keyFields;
        return keyFields && keyFields.length;
    })
        .map(function (_a) {
        var objectName = _a[0];
        var type = schemaWithQueryType.getType(objectName);
        if (!(0, graphql_1.isObjectType)(type)) {
            throw new Error("Type \"".concat(objectName, "\" is not an object type and can't have a key directive"));
        }
        return [objectName, type];
    }));
    var hasEntities = !!Object.keys(entityTypes).length;
    var schemaWithFederationQueryType = (0, utils_1.mapSchema)(schemaWithQueryType, (_a = {},
        _a[utils_1.MapperKind.ROOT_OBJECT] = function (type) {
            var _a;
            if ((0, graphql_1.isObjectType)(type) &&
                type.name === ((_a = schemaWithQueryType.getQueryType()) === null || _a === void 0 ? void 0 : _a.name)) {
                var config = type.toConfig();
                return new graphql_1.GraphQLObjectType(__assign(__assign({}, config), { fields: __assign(__assign(__assign({}, config.fields), (hasEntities && { _entities: types_1.entitiesField })), { _service: __assign(__assign({}, types_1.serviceField), { resolve: function () { return ({ sdl: schemaWithFederationDirectives }); } }) }) }));
            }
            return undefined;
        },
        _a));
    var schemaWithUnionType = (0, utils_1.mapSchema)(schemaWithFederationQueryType, (_b = {},
        _b[utils_1.MapperKind.UNION_TYPE] = function (type) {
            if ((0, graphql_1.isUnionType)(type) && type.name === types_1.EntityType.name) {
                return new graphql_1.GraphQLUnionType(__assign(__assign({}, types_1.EntityType.toConfig()), { types: Object.values(entityTypes) }));
            }
            return undefined;
        },
        _b));
    var referenceResolvers = Object.entries(federationConfig)
        .filter(function (_a) {
        var config = _a[1];
        return !!config.resolveReference;
    })
        .reduce(function (result, _a) {
        var _b;
        var key = _a[0], resolveReference = _a[1].resolveReference;
        return (__assign(__assign({}, result), (_b = {}, _b[key] = resolveReference, _b)));
    }, {});
    var schemaWithResolveReference = (0, utils_1.mapSchema)(schemaWithUnionType, (_c = {},
        _c[utils_1.MapperKind.OBJECT_TYPE] = function (type) {
            var _a;
            var typeName = type.name;
            if (referenceResolvers[typeName]) {
                return new graphql_1.GraphQLObjectType(__assign(__assign({}, type.toConfig()), { extensions: __assign(__assign({}, type.extensions), { apollo: __assign(__assign({}, (((_a = type.extensions) === null || _a === void 0 ? void 0 : _a.apollo) || {})), { subgraph: {
                                resolveReference: referenceResolvers[typeName],
                            } }) }) }));
            }
            return type;
        },
        _c));
    return schemaWithResolveReference;
}
exports.transformSchemaFederation = transformSchemaFederation;
//# sourceMappingURL=transform-federation.js.map