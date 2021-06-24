"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _types = require("../tokenizer/types");

var N = _interopRequireWildcard(require("../types"));

var _error = require("../parser/error");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _default = function _default(superClass) {
  return /*#__PURE__*/function (_superClass) {
    _inherits(_class, _superClass);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "parseRegExpLiteral",
      value: function parseRegExpLiteral(_ref) {
        var pattern = _ref.pattern,
            flags = _ref.flags;
        var regex = null;

        try {
          regex = new RegExp(pattern, flags);
        } catch (e) {// In environments that don't support these flags value will
          // be null as the regex can't be represented natively.
        }

        var node = this.estreeParseLiteral(regex);
        node.regex = {
          pattern: pattern,
          flags: flags
        };
        return node;
      }
    }, {
      key: "parseBigIntLiteral",
      value: function parseBigIntLiteral(value) {
        // https://github.com/estree/estree/blob/master/es2020.md#bigintliteral
        var bigInt;

        try {
          // $FlowIgnore
          bigInt = BigInt(value);
        } catch (_unused) {
          bigInt = null;
        }

        var node = this.estreeParseLiteral(bigInt);
        node.bigint = String(node.value || value);
        return node;
      }
    }, {
      key: "parseDecimalLiteral",
      value: function parseDecimalLiteral(value) {
        // https://github.com/estree/estree/blob/master/experimental/decimal.md
        // todo: use BigDecimal when node supports it.
        var decimal = null;
        var node = this.estreeParseLiteral(decimal);
        node.decimal = String(node.value || value);
        return node;
      }
    }, {
      key: "estreeParseLiteral",
      value: function estreeParseLiteral(value) {
        return this.parseLiteral(value, "Literal");
      }
    }, {
      key: "parseStringLiteral",
      value: function parseStringLiteral(value) {
        return this.estreeParseLiteral(value);
      }
    }, {
      key: "parseNumericLiteral",
      value: function parseNumericLiteral(value) {
        return this.estreeParseLiteral(value);
      }
    }, {
      key: "parseNullLiteral",
      value: function parseNullLiteral() {
        return this.estreeParseLiteral(null);
      }
    }, {
      key: "parseBooleanLiteral",
      value: function parseBooleanLiteral(value) {
        return this.estreeParseLiteral(value);
      }
    }, {
      key: "directiveToStmt",
      value: function directiveToStmt(directive) {
        var directiveLiteral = directive.value;
        var stmt = this.startNodeAt(directive.start, directive.loc.start);
        var expression = this.startNodeAt(directiveLiteral.start, directiveLiteral.loc.start);
        expression.value = directiveLiteral.extra.expressionValue;
        expression.raw = directiveLiteral.extra.raw;
        stmt.expression = this.finishNodeAt(expression, "Literal", directiveLiteral.end, directiveLiteral.loc.end);
        stmt.directive = directiveLiteral.extra.raw.slice(1, -1);
        return this.finishNodeAt(stmt, "ExpressionStatement", directive.end, directive.loc.end);
      } // ==================================
      // Overrides
      // ==================================

    }, {
      key: "initFunction",
      value: function initFunction(node, isAsync) {
        _get(_getPrototypeOf(_class.prototype), "initFunction", this).call(this, node, isAsync);

        node.expression = false;
      }
    }, {
      key: "checkDeclaration",
      value: function checkDeclaration(node) {
        if (node != null && this.isObjectProperty(node)) {
          this.checkDeclaration(node.value);
        } else {
          _get(_getPrototypeOf(_class.prototype), "checkDeclaration", this).call(this, node);
        }
      }
    }, {
      key: "getObjectOrClassMethodParams",
      value: function getObjectOrClassMethodParams(method) {
        return method.value.params;
      }
    }, {
      key: "isValidDirective",
      value: function isValidDirective(stmt) {
        var _stmt$expression$extr;

        return stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && typeof stmt.expression.value === "string" && !((_stmt$expression$extr = stmt.expression.extra) !== null && _stmt$expression$extr !== void 0 && _stmt$expression$extr.parenthesized);
      }
    }, {
      key: "stmtToDirective",
      value: function stmtToDirective(stmt) {
        var directive = _get(_getPrototypeOf(_class.prototype), "stmtToDirective", this).call(this, stmt);

        var value = stmt.expression.value; // Record the expression value as in estree mode we want
        // the stmt to have the real value e.g. ("use strict") and
        // not the raw value e.g. ("use\\x20strict")

        this.addExtra(directive.value, "expressionValue", value);
        return directive;
      }
    }, {
      key: "parseBlockBody",
      value: function parseBlockBody(node) {
        var _get2,
            _this = this;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        (_get2 = _get(_getPrototypeOf(_class.prototype), "parseBlockBody", this)).call.apply(_get2, [this, node].concat(args));

        var directiveStatements = node.directives.map(function (d) {
          return _this.directiveToStmt(d);
        });
        node.body = directiveStatements.concat(node.body); // $FlowIgnore - directives isn't optional in the type definition

        delete node.directives;
      }
    }, {
      key: "pushClassMethod",
      value: function pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
        this.parseMethod(method, isGenerator, isAsync, isConstructor, allowsDirectSuper, "ClassMethod", true);

        if (method.typeParameters) {
          // $FlowIgnore
          method.value.typeParameters = method.typeParameters;
          delete method.typeParameters;
        }

        classBody.body.push(method);
      }
    }, {
      key: "parseMaybePrivateName",
      value: function parseMaybePrivateName() {
        var _get3;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var node = (_get3 = _get(_getPrototypeOf(_class.prototype), "parseMaybePrivateName", this)).call.apply(_get3, [this].concat(args));

        if (node.type === "PrivateName" && this.getPluginOption("estree", "classFeatures")) {
          return this.convertPrivateNameToPrivateIdentifier(node);
        }

        return node;
      }
    }, {
      key: "convertPrivateNameToPrivateIdentifier",
      value: function convertPrivateNameToPrivateIdentifier(node) {
        var name = _get(_getPrototypeOf(_class.prototype), "getPrivateNameSV", this).call(this, node);

        node = node;
        delete node.id;
        node.name = name;
        node.type = "PrivateIdentifier";
        return node;
      }
    }, {
      key: "isPrivateName",
      value: function isPrivateName(node) {
        if (!this.getPluginOption("estree", "classFeatures")) {
          return _get(_getPrototypeOf(_class.prototype), "isPrivateName", this).call(this, node);
        }

        return node.type === "PrivateIdentifier";
      }
    }, {
      key: "getPrivateNameSV",
      value: function getPrivateNameSV(node) {
        if (!this.getPluginOption("estree", "classFeatures")) {
          return _get(_getPrototypeOf(_class.prototype), "getPrivateNameSV", this).call(this, node);
        }

        return node.name;
      }
    }, {
      key: "parseLiteral",
      value: function parseLiteral(value, type) {
        var node = _get(_getPrototypeOf(_class.prototype), "parseLiteral", this).call(this, value, type);

        node.raw = node.extra.raw;
        delete node.extra;
        return node;
      }
    }, {
      key: "parseFunctionBody",
      value: function parseFunctionBody(node, allowExpression) {
        var isMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        _get(_getPrototypeOf(_class.prototype), "parseFunctionBody", this).call(this, node, allowExpression, isMethod);

        node.expression = node.body.type !== "BlockStatement";
      }
    }, {
      key: "parseMethod",
      value: function parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type) {
        var inClassScope = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
        var funcNode = this.startNode();
        funcNode.kind = node.kind; // provide kind, so super method correctly sets state

        funcNode = _get(_getPrototypeOf(_class.prototype), "parseMethod", this).call(this, funcNode, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
        funcNode.type = "FunctionExpression";
        delete funcNode.kind; // $FlowIgnore

        node.value = funcNode;

        if (type === "ClassPrivateMethod") {
          // $FlowIgnore
          node.computed = false;
        }

        type = "MethodDefinition";
        return this.finishNode(node, type);
      }
    }, {
      key: "parseClassProperty",
      value: function parseClassProperty() {
        var _get4;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var propertyNode = (_get4 = _get(_getPrototypeOf(_class.prototype), "parseClassProperty", this)).call.apply(_get4, [this].concat(args));

        if (this.getPluginOption("estree", "classFeatures")) {
          propertyNode.type = "PropertyDefinition";
        }

        return propertyNode;
      }
    }, {
      key: "parseClassPrivateProperty",
      value: function parseClassPrivateProperty() {
        var _get5;

        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        var propertyNode = (_get5 = _get(_getPrototypeOf(_class.prototype), "parseClassPrivateProperty", this)).call.apply(_get5, [this].concat(args));

        if (this.getPluginOption("estree", "classFeatures")) {
          propertyNode.type = "PropertyDefinition";
          propertyNode.computed = false;
        }

        return propertyNode;
      }
    }, {
      key: "parseObjectMethod",
      value: function parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
        var node = _get(_getPrototypeOf(_class.prototype), "parseObjectMethod", this).call(this, prop, isGenerator, isAsync, isPattern, isAccessor);

        if (node) {
          node.type = "Property";
          if (node.kind === "method") node.kind = "init";
          node.shorthand = false;
        }

        return node;
      }
    }, {
      key: "parseObjectProperty",
      value: function parseObjectProperty(prop, startPos, startLoc, isPattern, refExpressionErrors) {
        var node = _get(_getPrototypeOf(_class.prototype), "parseObjectProperty", this).call(this, prop, startPos, startLoc, isPattern, refExpressionErrors);

        if (node) {
          node.kind = "init";
          node.type = "Property";
        }

        return node;
      }
    }, {
      key: "toAssignable",
      value: function toAssignable(node) {
        var isLHS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (node != null && this.isObjectProperty(node)) {
          this.toAssignable(node.value, isLHS);
          return node;
        }

        return _get(_getPrototypeOf(_class.prototype), "toAssignable", this).call(this, node, isLHS);
      }
    }, {
      key: "toAssignableObjectExpressionProp",
      value: function toAssignableObjectExpressionProp(prop) {
        if (prop.kind === "get" || prop.kind === "set") {
          this.raise(prop.key.start, _error.Errors.PatternHasAccessor);
        } else if (prop.method) {
          this.raise(prop.key.start, _error.Errors.PatternHasMethod);
        } else {
          var _get6;

          for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            args[_key5 - 1] = arguments[_key5];
          }

          (_get6 = _get(_getPrototypeOf(_class.prototype), "toAssignableObjectExpressionProp", this)).call.apply(_get6, [this, prop].concat(args));
        }
      }
    }, {
      key: "finishCallExpression",
      value: function finishCallExpression(node, optional) {
        _get(_getPrototypeOf(_class.prototype), "finishCallExpression", this).call(this, node, optional);

        if (node.callee.type === "Import") {
          node.type = "ImportExpression";
          node.source = node.arguments[0];

          if (this.hasPlugin("importAssertions")) {
            var _node$arguments$;

            node.attributes = (_node$arguments$ = node.arguments[1]) !== null && _node$arguments$ !== void 0 ? _node$arguments$ : null;
          } // $FlowIgnore - arguments isn't optional in the type definition


          delete node.arguments; // $FlowIgnore - callee isn't optional in the type definition

          delete node.callee;
        }

        return node;
      }
    }, {
      key: "toReferencedArguments",
      value: function toReferencedArguments(node)
      /* isParenthesizedExpr?: boolean, */
      {
        // ImportExpressions do not have an arguments array.
        if (node.type === "ImportExpression") {
          return;
        }

        _get(_getPrototypeOf(_class.prototype), "toReferencedArguments", this).call(this, node);
      }
    }, {
      key: "parseExport",
      value: function parseExport(node) {
        _get(_getPrototypeOf(_class.prototype), "parseExport", this).call(this, node);

        switch (node.type) {
          case "ExportAllDeclaration":
            node.exported = null;
            break;

          case "ExportNamedDeclaration":
            if (node.specifiers.length === 1 && node.specifiers[0].type === "ExportNamespaceSpecifier") {
              node.type = "ExportAllDeclaration";
              node.exported = node.specifiers[0].exported;
              delete node.specifiers;
            }

            break;
        }

        return node;
      }
    }, {
      key: "parseSubscript",
      value: function parseSubscript(base, startPos, startLoc, noCalls, state) {
        var node = _get(_getPrototypeOf(_class.prototype), "parseSubscript", this).call(this, base, startPos, startLoc, noCalls, state);

        if (state.optionalChainMember) {
          // https://github.com/estree/estree/blob/master/es2020.md#chainexpression
          if (node.type === "OptionalMemberExpression" || node.type === "OptionalCallExpression") {
            node.type = node.type.substring(8); // strip Optional prefix
          }

          if (state.stop) {
            var chain = this.startNodeAtNode(node);
            chain.expression = node;
            return this.finishNode(chain, "ChainExpression");
          }
        } else if (node.type === "MemberExpression" || node.type === "CallExpression") {
          node.optional = false;
        }

        return node;
      }
    }, {
      key: "hasPropertyAsPrivateName",
      value: function hasPropertyAsPrivateName(node) {
        if (node.type === "ChainExpression") {
          node = node.expression;
        }

        return _get(_getPrototypeOf(_class.prototype), "hasPropertyAsPrivateName", this).call(this, node);
      }
    }, {
      key: "isOptionalChain",
      value: function isOptionalChain(node) {
        return node.type === "ChainExpression";
      }
    }, {
      key: "isObjectProperty",
      value: function isObjectProperty(node) {
        return node.type === "Property" && node.kind === "init" && !node.method;
      }
    }, {
      key: "isObjectMethod",
      value: function isObjectMethod(node) {
        return node.method || node.kind === "get" || node.kind === "set";
      }
    }]);

    return _class;
  }(superClass);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbHVnaW5zL2VzdHJlZS5qcyJdLCJuYW1lcyI6WyJzdXBlckNsYXNzIiwicGF0dGVybiIsImZsYWdzIiwicmVnZXgiLCJSZWdFeHAiLCJlIiwibm9kZSIsImVzdHJlZVBhcnNlTGl0ZXJhbCIsInZhbHVlIiwiYmlnSW50IiwiQmlnSW50IiwiYmlnaW50IiwiU3RyaW5nIiwiZGVjaW1hbCIsInBhcnNlTGl0ZXJhbCIsImRpcmVjdGl2ZSIsImRpcmVjdGl2ZUxpdGVyYWwiLCJzdG10Iiwic3RhcnROb2RlQXQiLCJzdGFydCIsImxvYyIsImV4cHJlc3Npb24iLCJleHRyYSIsImV4cHJlc3Npb25WYWx1ZSIsInJhdyIsImZpbmlzaE5vZGVBdCIsImVuZCIsInNsaWNlIiwiaXNBc3luYyIsImlzT2JqZWN0UHJvcGVydHkiLCJjaGVja0RlY2xhcmF0aW9uIiwibWV0aG9kIiwicGFyYW1zIiwidHlwZSIsInBhcmVudGhlc2l6ZWQiLCJhZGRFeHRyYSIsImFyZ3MiLCJkaXJlY3RpdmVTdGF0ZW1lbnRzIiwiZGlyZWN0aXZlcyIsIm1hcCIsImQiLCJkaXJlY3RpdmVUb1N0bXQiLCJib2R5IiwiY29uY2F0IiwiY2xhc3NCb2R5IiwiaXNHZW5lcmF0b3IiLCJpc0NvbnN0cnVjdG9yIiwiYWxsb3dzRGlyZWN0U3VwZXIiLCJwYXJzZU1ldGhvZCIsInR5cGVQYXJhbWV0ZXJzIiwicHVzaCIsImdldFBsdWdpbk9wdGlvbiIsImNvbnZlcnRQcml2YXRlTmFtZVRvUHJpdmF0ZUlkZW50aWZpZXIiLCJuYW1lIiwiaWQiLCJhbGxvd0V4cHJlc3Npb24iLCJpc01ldGhvZCIsImFsbG93RGlyZWN0U3VwZXIiLCJpbkNsYXNzU2NvcGUiLCJmdW5jTm9kZSIsInN0YXJ0Tm9kZSIsImtpbmQiLCJjb21wdXRlZCIsImZpbmlzaE5vZGUiLCJwcm9wZXJ0eU5vZGUiLCJwcm9wIiwiaXNQYXR0ZXJuIiwiaXNBY2Nlc3NvciIsInNob3J0aGFuZCIsInN0YXJ0UG9zIiwic3RhcnRMb2MiLCJyZWZFeHByZXNzaW9uRXJyb3JzIiwiaXNMSFMiLCJ0b0Fzc2lnbmFibGUiLCJyYWlzZSIsImtleSIsIkVycm9ycyIsIlBhdHRlcm5IYXNBY2Nlc3NvciIsIlBhdHRlcm5IYXNNZXRob2QiLCJvcHRpb25hbCIsImNhbGxlZSIsInNvdXJjZSIsImFyZ3VtZW50cyIsImhhc1BsdWdpbiIsImF0dHJpYnV0ZXMiLCJleHBvcnRlZCIsInNwZWNpZmllcnMiLCJsZW5ndGgiLCJiYXNlIiwibm9DYWxscyIsInN0YXRlIiwib3B0aW9uYWxDaGFpbk1lbWJlciIsInN1YnN0cmluZyIsInN0b3AiLCJjaGFpbiIsInN0YXJ0Tm9kZUF0Tm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7O0FBR0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQUVlLGtCQUFDQSxVQUFEO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGFBRVgsa0NBQStDO0FBQUEsWUFBMUJDLE9BQTBCLFFBQTFCQSxPQUEwQjtBQUFBLFlBQWpCQyxLQUFpQixRQUFqQkEsS0FBaUI7QUFDN0MsWUFBSUMsS0FBSyxHQUFHLElBQVo7O0FBQ0EsWUFBSTtBQUNGQSxVQUFBQSxLQUFLLEdBQUcsSUFBSUMsTUFBSixDQUFXSCxPQUFYLEVBQW9CQyxLQUFwQixDQUFSO0FBQ0QsU0FGRCxDQUVFLE9BQU9HLENBQVAsRUFBVSxDQUNWO0FBQ0E7QUFDRDs7QUFDRCxZQUFNQyxJQUFJLEdBQUcsS0FBS0Msa0JBQUwsQ0FBK0NKLEtBQS9DLENBQWI7QUFDQUcsUUFBQUEsSUFBSSxDQUFDSCxLQUFMLEdBQWE7QUFBRUYsVUFBQUEsT0FBTyxFQUFQQSxPQUFGO0FBQVdDLFVBQUFBLEtBQUssRUFBTEE7QUFBWCxTQUFiO0FBRUEsZUFBT0ksSUFBUDtBQUNEO0FBZFU7QUFBQTtBQUFBLGFBZ0JYLDRCQUFtQkUsS0FBbkIsRUFBdUM7QUFDckM7QUFDQSxZQUFJQyxNQUFKOztBQUNB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LENBQVA7QUFDRDtBQUNGLFNBYkQsTUFhTyxJQUNMeEYsSUFBSSxDQUFDMkIsSUFBTCxLQUFjLGtCQUFkLElBQ0EzQixJQUFJLENBQUMyQixJQUFMLEtBQWMsZ0JBRlQsRUFHTDtBQUNBM0IsVUFBQUEsSUFBSSxDQUFDeUUsUUFBTCxHQUFnQixLQUFoQjtBQUNEOztBQUVELGVBQU96RSxJQUFQO0FBQ0Q7QUF4YlU7QUFBQTtBQUFBLGFBMGJYLGtDQUF5QkEsSUFBekIsRUFBZ0Q7QUFDOUMsWUFBSUEsSUFBSSxDQUFDMkIsSUFBTCxLQUFjLGlCQUFsQixFQUFxQztBQUNuQzNCLFVBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDZSxVQUFaO0FBQ0Q7O0FBQ0Qsb0dBQXNDZixJQUF0QztBQUNEO0FBL2JVO0FBQUE7QUFBQSxhQWljWCx5QkFBZ0JBLElBQWhCLEVBQXVDO0FBQ3JDLGVBQU9BLElBQUksQ0FBQzJCLElBQUwsS0FBYyxpQkFBckI7QUFDRDtBQW5jVTtBQUFBO0FBQUEsYUFxY1gsMEJBQWlCM0IsSUFBakIsRUFBd0M7QUFDdEMsZUFBT0EsSUFBSSxDQUFDMkIsSUFBTCxLQUFjLFVBQWQsSUFBNEIzQixJQUFJLENBQUN1RCxJQUFMLEtBQWMsTUFBMUMsSUFBb0QsQ0FBQ3ZELElBQUksQ0FBQ3lCLE1BQWpFO0FBQ0Q7QUF2Y1U7QUFBQTtBQUFBLGFBeWNYLHdCQUFlekIsSUFBZixFQUFzQztBQUNwQyxlQUFPQSxJQUFJLENBQUN5QixNQUFMLElBQWV6QixJQUFJLENBQUN1RCxJQUFMLEtBQWMsS0FBN0IsSUFBc0N2RCxJQUFJLENBQUN1RCxJQUFMLEtBQWMsS0FBM0Q7QUFDRDtBQTNjVTs7QUFBQTtBQUFBLElBQ0M3RCxVQUREO0FBQUEsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB7IFRva2VuVHlwZSB9IGZyb20gXCIuLi90b2tlbml6ZXIvdHlwZXNcIjtcbmltcG9ydCB0eXBlIFBhcnNlciBmcm9tIFwiLi4vcGFyc2VyXCI7XG5pbXBvcnQgdHlwZSB7IEV4cHJlc3Npb25FcnJvcnMgfSBmcm9tIFwiLi4vcGFyc2VyL3V0aWxcIjtcbmltcG9ydCAqIGFzIE4gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uIH0gZnJvbSBcIi4uL3V0aWwvbG9jYXRpb25cIjtcbmltcG9ydCB7IEVycm9ycyB9IGZyb20gXCIuLi9wYXJzZXIvZXJyb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgKHN1cGVyQ2xhc3M6IENsYXNzPFBhcnNlcj4pOiBDbGFzczxQYXJzZXI+ID0+XG4gIGNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG4gICAgcGFyc2VSZWdFeHBMaXRlcmFsKHsgcGF0dGVybiwgZmxhZ3MgfSk6IE4uTm9kZSB7XG4gICAgICBsZXQgcmVnZXggPSBudWxsO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKHBhdHRlcm4sIGZsYWdzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gSW4gZW52aXJvbm1lbnRzIHRoYXQgZG9uJ3Qgc3VwcG9ydCB0aGVzZSBmbGFncyB2YWx1ZSB3aWxsXG4gICAgICAgIC8vIGJlIG51bGwgYXMgdGhlIHJlZ2V4IGNhbid0IGJlIHJlcHJlc2VudGVkIG5hdGl2ZWx5LlxuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZXN0cmVlUGFyc2VMaXRlcmFsPE4uRXN0cmVlUmVnRXhwTGl0ZXJhbD4ocmVnZXgpO1xuICAgICAgbm9kZS5yZWdleCA9IHsgcGF0dGVybiwgZmxhZ3MgfTtcblxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcGFyc2VCaWdJbnRMaXRlcmFsKHZhbHVlOiBhbnkpOiBOLk5vZGUge1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWUvYmxvYi9tYXN0ZXIvZXMyMDIwLm1kI2JpZ2ludGxpdGVyYWxcbiAgICAgIGxldCBiaWdJbnQ7XG4gICAgICB0cnkge1xuICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICBiaWdJbnQgPSBCaWdJbnQodmFsdWUpO1xuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIGJpZ0ludCA9IG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5lc3RyZWVQYXJzZUxpdGVyYWw8Ti5Fc3RyZWVCaWdJbnRMaXRlcmFsPihiaWdJbnQpO1xuICAgICAgbm9kZS5iaWdpbnQgPSBTdHJpbmcobm9kZS52YWx1ZSB8fCB2YWx1ZSk7XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHBhcnNlRGVjaW1hbExpdGVyYWwodmFsdWU6IGFueSk6IE4uTm9kZSB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXN0cmVlL2VzdHJlZS9ibG9iL21hc3Rlci9leHBlcmltZW50YWwvZGVjaW1hbC5tZFxuICAgICAgLy8gdG9kbzogdXNlIEJpZ0RlY2ltYWwgd2hlbiBub2RlIHN1cHBvcnRzIGl0LlxuICAgICAgY29uc3QgZGVjaW1hbCA9IG51bGw7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5lc3RyZWVQYXJzZUxpdGVyYWwoZGVjaW1hbCk7XG4gICAgICBub2RlLmRlY2ltYWwgPSBTdHJpbmcobm9kZS52YWx1ZSB8fCB2YWx1ZSk7XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGVzdHJlZVBhcnNlTGl0ZXJhbDxUOiBOLk5vZGU+KHZhbHVlOiBhbnkpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbDxUPih2YWx1ZSwgXCJMaXRlcmFsXCIpO1xuICAgIH1cblxuICAgIHBhcnNlU3RyaW5nTGl0ZXJhbCh2YWx1ZTogYW55KTogTi5Ob2RlIHtcbiAgICAgIHJldHVybiB0aGlzLmVzdHJlZVBhcnNlTGl0ZXJhbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcGFyc2VOdW1lcmljTGl0ZXJhbCh2YWx1ZTogYW55KTogYW55IHtcbiAgICAgIHJldHVybiB0aGlzLmVzdHJlZVBhcnNlTGl0ZXJhbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgcGFyc2VOdWxsTGl0ZXJhbCgpOiBOLk5vZGUge1xuICAgICAgcmV0dXJuIHRoaXMuZXN0cmVlUGFyc2VMaXRlcmFsKG51bGwpO1xuICAgIH1cblxuICAgIHBhcnNlQm9vbGVhbkxpdGVyYWwodmFsdWU6IGJvb2xlYW4pOiBOLkJvb2xlYW5MaXRlcmFsIHtcbiAgICAgIHJldHVybiB0aGlzLmVzdHJlZVBhcnNlTGl0ZXJhbCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZGlyZWN0aXZlVG9TdG10KGRpcmVjdGl2ZTogTi5EaXJlY3RpdmUpOiBOLkV4cHJlc3Npb25TdGF0ZW1lbnQge1xuICAgICAgY29uc3QgZGlyZWN0aXZlTGl0ZXJhbCA9IGRpcmVjdGl2ZS52YWx1ZTtcblxuICAgICAgY29uc3Qgc3RtdCA9IHRoaXMuc3RhcnROb2RlQXQoZGlyZWN0aXZlLnN0YXJ0LCBkaXJlY3RpdmUubG9jLnN0YXJ0KTtcbiAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLnN0YXJ0Tm9kZUF0KFxuICAgICAgICBkaXJlY3RpdmVMaXRlcmFsLnN0YXJ0LFxuICAgICAgICBkaXJlY3RpdmVMaXRlcmFsLmxvYy5zdGFydCxcbiAgICAgICk7XG5cbiAgICAgIGV4cHJlc3Npb24udmFsdWUgPSBkaXJlY3RpdmVMaXRlcmFsLmV4dHJhLmV4cHJlc3Npb25WYWx1ZTtcbiAgICAgIGV4cHJlc3Npb24ucmF3ID0gZGlyZWN0aXZlTGl0ZXJhbC5leHRyYS5yYXc7XG5cbiAgICAgIHN0bXQuZXhwcmVzc2lvbiA9IHRoaXMuZmluaXNoTm9kZUF0KFxuICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICBcIkxpdGVyYWxcIixcbiAgICAgICAgZGlyZWN0aXZlTGl0ZXJhbC5lbmQsXG4gICAgICAgIGRpcmVjdGl2ZUxpdGVyYWwubG9jLmVuZCxcbiAgICAgICk7XG4gICAgICBzdG10LmRpcmVjdGl2ZSA9IGRpcmVjdGl2ZUxpdGVyYWwuZXh0cmEucmF3LnNsaWNlKDEsIC0xKTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZUF0KFxuICAgICAgICBzdG10LFxuICAgICAgICBcIkV4cHJlc3Npb25TdGF0ZW1lbnRcIixcbiAgICAgICAgZGlyZWN0aXZlLmVuZCxcbiAgICAgICAgZGlyZWN0aXZlLmxvYy5lbmQsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBPdmVycmlkZXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBpbml0RnVuY3Rpb24oXG4gICAgICBub2RlOiBOLkJvZGlsZXNzRnVuY3Rpb25Pck1ldGhvZEJhc2UsXG4gICAgICBpc0FzeW5jOiA/Ym9vbGVhbixcbiAgICApOiB2b2lkIHtcbiAgICAgIHN1cGVyLmluaXRGdW5jdGlvbihub2RlLCBpc0FzeW5jKTtcbiAgICAgIG5vZGUuZXhwcmVzc2lvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNoZWNrRGVjbGFyYXRpb24obm9kZTogTi5QYXR0ZXJuIHwgTi5PYmplY3RQcm9wZXJ0eSk6IHZvaWQge1xuICAgICAgaWYgKG5vZGUgIT0gbnVsbCAmJiB0aGlzLmlzT2JqZWN0UHJvcGVydHkobm9kZSkpIHtcbiAgICAgICAgdGhpcy5jaGVja0RlY2xhcmF0aW9uKCgobm9kZTogYW55KTogTi5Fc3RyZWVQcm9wZXJ0eSkudmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3VwZXIuY2hlY2tEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRPYmplY3RPckNsYXNzTWV0aG9kUGFyYW1zKG1ldGhvZDogTi5PYmplY3RNZXRob2QgfCBOLkNsYXNzTWV0aG9kKSB7XG4gICAgICByZXR1cm4gKChtZXRob2Q6IGFueSk6IE4uRXN0cmVlUHJvcGVydHkgfCBOLkVzdHJlZU1ldGhvZERlZmluaXRpb24pLnZhbHVlXG4gICAgICAgIC5wYXJhbXM7XG4gICAgfVxuXG4gICAgaXNWYWxpZERpcmVjdGl2ZShzdG10OiBOLlN0YXRlbWVudCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgc3RtdC50eXBlID09PSBcIkV4cHJlc3Npb25TdGF0ZW1lbnRcIiAmJlxuICAgICAgICBzdG10LmV4cHJlc3Npb24udHlwZSA9PT0gXCJMaXRlcmFsXCIgJiZcbiAgICAgICAgdHlwZW9mIHN0bXQuZXhwcmVzc2lvbi52YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAhc3RtdC5leHByZXNzaW9uLmV4dHJhPy5wYXJlbnRoZXNpemVkXG4gICAgICApO1xuICAgIH1cblxuICAgIHN0bXRUb0RpcmVjdGl2ZShzdG10OiBOLlN0YXRlbWVudCk6IE4uRGlyZWN0aXZlIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IHN1cGVyLnN0bXRUb0RpcmVjdGl2ZShzdG10KTtcbiAgICAgIGNvbnN0IHZhbHVlID0gc3RtdC5leHByZXNzaW9uLnZhbHVlO1xuXG4gICAgICAvLyBSZWNvcmQgdGhlIGV4cHJlc3Npb24gdmFsdWUgYXMgaW4gZXN0cmVlIG1vZGUgd2Ugd2FudFxuICAgICAgLy8gdGhlIHN0bXQgdG8gaGF2ZSB0aGUgcmVhbCB2YWx1ZSBlLmcuIChcInVzZSBzdHJpY3RcIikgYW5kXG4gICAgICAvLyBub3QgdGhlIHJhdyB2YWx1ZSBlLmcuIChcInVzZVxcXFx4MjBzdHJpY3RcIilcbiAgICAgIHRoaXMuYWRkRXh0cmEoZGlyZWN0aXZlLnZhbHVlLCBcImV4cHJlc3Npb25WYWx1ZVwiLCB2YWx1ZSk7XG5cbiAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfVxuXG4gICAgcGFyc2VCbG9ja0JvZHkoXG4gICAgICBub2RlOiBOLkJsb2NrU3RhdGVtZW50TGlrZSxcbiAgICAgIC4uLmFyZ3M6IFs/Ym9vbGVhbiwgYm9vbGVhbiwgVG9rZW5UeXBlLCB2b2lkIHwgKGJvb2xlYW4gPT4gdm9pZCldXG4gICAgKTogdm9pZCB7XG4gICAgICBzdXBlci5wYXJzZUJsb2NrQm9keShub2RlLCAuLi5hcmdzKTtcblxuICAgICAgY29uc3QgZGlyZWN0aXZlU3RhdGVtZW50cyA9IG5vZGUuZGlyZWN0aXZlcy5tYXAoZCA9PlxuICAgICAgICB0aGlzLmRpcmVjdGl2ZVRvU3RtdChkKSxcbiAgICAgICk7XG4gICAgICBub2RlLmJvZHkgPSBkaXJlY3RpdmVTdGF0ZW1lbnRzLmNvbmNhdChub2RlLmJvZHkpO1xuICAgICAgLy8gJEZsb3dJZ25vcmUgLSBkaXJlY3RpdmVzIGlzbid0IG9wdGlvbmFsIGluIHRoZSB0eXBlIGRlZmluaXRpb25cbiAgICAgIGRlbGV0ZSBub2RlLmRpcmVjdGl2ZXM7XG4gICAgfVxuXG4gICAgcHVzaENsYXNzTWV0aG9kKFxuICAgICAgY2xhc3NCb2R5OiBOLkNsYXNzQm9keSxcbiAgICAgIG1ldGhvZDogTi5DbGFzc01ldGhvZCxcbiAgICAgIGlzR2VuZXJhdG9yOiBib29sZWFuLFxuICAgICAgaXNBc3luYzogYm9vbGVhbixcbiAgICAgIGlzQ29uc3RydWN0b3I6IGJvb2xlYW4sXG4gICAgICBhbGxvd3NEaXJlY3RTdXBlcjogYm9vbGVhbixcbiAgICApOiB2b2lkIHtcbiAgICAgIHRoaXMucGFyc2VNZXRob2QoXG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaXNHZW5lcmF0b3IsXG4gICAgICAgIGlzQXN5bmMsXG4gICAgICAgIGlzQ29uc3RydWN0b3IsXG4gICAgICAgIGFsbG93c0RpcmVjdFN1cGVyLFxuICAgICAgICBcIkNsYXNzTWV0aG9kXCIsXG4gICAgICAgIHRydWUsXG4gICAgICApO1xuICAgICAgaWYgKG1ldGhvZC50eXBlUGFyYW1ldGVycykge1xuICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICBtZXRob2QudmFsdWUudHlwZVBhcmFtZXRlcnMgPSBtZXRob2QudHlwZVBhcmFtZXRlcnM7XG4gICAgICAgIGRlbGV0ZSBtZXRob2QudHlwZVBhcmFtZXRlcnM7XG4gICAgICB9XG4gICAgICBjbGFzc0JvZHkuYm9keS5wdXNoKG1ldGhvZCk7XG4gICAgfVxuXG4gICAgcGFyc2VNYXliZVByaXZhdGVOYW1lKC4uLmFyZ3M6IFtib29sZWFuXSk6IGFueSB7XG4gICAgICBjb25zdCBub2RlID0gc3VwZXIucGFyc2VNYXliZVByaXZhdGVOYW1lKC4uLmFyZ3MpO1xuICAgICAgaWYgKFxuICAgICAgICBub2RlLnR5cGUgPT09IFwiUHJpdmF0ZU5hbWVcIiAmJlxuICAgICAgICB0aGlzLmdldFBsdWdpbk9wdGlvbihcImVzdHJlZVwiLCBcImNsYXNzRmVhdHVyZXNcIilcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0UHJpdmF0ZU5hbWVUb1ByaXZhdGVJZGVudGlmaWVyKG5vZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgY29udmVydFByaXZhdGVOYW1lVG9Qcml2YXRlSWRlbnRpZmllcihcbiAgICAgIG5vZGU6IE4uUHJpdmF0ZU5hbWUsXG4gICAgKTogTi5Fc3RyZWVQcml2YXRlSWRlbnRpZmllciB7XG4gICAgICBjb25zdCBuYW1lID0gc3VwZXIuZ2V0UHJpdmF0ZU5hbWVTVihub2RlKTtcbiAgICAgIG5vZGUgPSAobm9kZTogYW55KTtcbiAgICAgIGRlbGV0ZSBub2RlLmlkO1xuICAgICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICAgIG5vZGUudHlwZSA9IFwiUHJpdmF0ZUlkZW50aWZpZXJcIjtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGlzUHJpdmF0ZU5hbWUobm9kZTogTi5Ob2RlKTogYm9vbGVhbiB7XG4gICAgICBpZiAoIXRoaXMuZ2V0UGx1Z2luT3B0aW9uKFwiZXN0cmVlXCIsIFwiY2xhc3NGZWF0dXJlc1wiKSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuaXNQcml2YXRlTmFtZShub2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub2RlLnR5cGUgPT09IFwiUHJpdmF0ZUlkZW50aWZpZXJcIjtcbiAgICB9XG5cbiAgICBnZXRQcml2YXRlTmFtZVNWKG5vZGU6IE4uTm9kZSk6IHN0cmluZyB7XG4gICAgICBpZiAoIXRoaXMuZ2V0UGx1Z2luT3B0aW9uKFwiZXN0cmVlXCIsIFwiY2xhc3NGZWF0dXJlc1wiKSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuZ2V0UHJpdmF0ZU5hbWVTVihub2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub2RlLm5hbWU7XG4gICAgfVxuXG4gICAgcGFyc2VMaXRlcmFsPFQ6IE4uTm9kZT4odmFsdWU6IGFueSwgdHlwZTogJEVsZW1lbnRUeXBlPFQsIFwidHlwZVwiPik6IFQge1xuICAgICAgY29uc3Qgbm9kZSA9IHN1cGVyLnBhcnNlTGl0ZXJhbDxUPih2YWx1ZSwgdHlwZSk7XG4gICAgICBub2RlLnJhdyA9IG5vZGUuZXh0cmEucmF3O1xuICAgICAgZGVsZXRlIG5vZGUuZXh0cmE7XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHBhcnNlRnVuY3Rpb25Cb2R5KFxuICAgICAgbm9kZTogTi5GdW5jdGlvbixcbiAgICAgIGFsbG93RXhwcmVzc2lvbjogP2Jvb2xlYW4sXG4gICAgICBpc01ldGhvZD86IGJvb2xlYW4gPSBmYWxzZSxcbiAgICApOiB2b2lkIHtcbiAgICAgIHN1cGVyLnBhcnNlRnVuY3Rpb25Cb2R5KG5vZGUsIGFsbG93RXhwcmVzc2lvbiwgaXNNZXRob2QpO1xuICAgICAgbm9kZS5leHByZXNzaW9uID0gbm9kZS5ib2R5LnR5cGUgIT09IFwiQmxvY2tTdGF0ZW1lbnRcIjtcbiAgICB9XG5cbiAgICBwYXJzZU1ldGhvZDxUOiBOLk1ldGhvZExpa2U+KFxuICAgICAgbm9kZTogVCxcbiAgICAgIGlzR2VuZXJhdG9yOiBib29sZWFuLFxuICAgICAgaXNBc3luYzogYm9vbGVhbixcbiAgICAgIGlzQ29uc3RydWN0b3I6IGJvb2xlYW4sXG4gICAgICBhbGxvd0RpcmVjdFN1cGVyOiBib29sZWFuLFxuICAgICAgdHlwZTogc3RyaW5nLFxuICAgICAgaW5DbGFzc1Njb3BlOiBib29sZWFuID0gZmFsc2UsXG4gICAgKTogVCB7XG4gICAgICBsZXQgZnVuY05vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgZnVuY05vZGUua2luZCA9IG5vZGUua2luZDsgLy8gcHJvdmlkZSBraW5kLCBzbyBzdXBlciBtZXRob2QgY29ycmVjdGx5IHNldHMgc3RhdGVcbiAgICAgIGZ1bmNOb2RlID0gc3VwZXIucGFyc2VNZXRob2QoXG4gICAgICAgIGZ1bmNOb2RlLFxuICAgICAgICBpc0dlbmVyYXRvcixcbiAgICAgICAgaXNBc3luYyxcbiAgICAgICAgaXNDb25zdHJ1Y3RvcixcbiAgICAgICAgYWxsb3dEaXJlY3RTdXBlcixcbiAgICAgICAgdHlwZSxcbiAgICAgICAgaW5DbGFzc1Njb3BlLFxuICAgICAgKTtcbiAgICAgIGZ1bmNOb2RlLnR5cGUgPSBcIkZ1bmN0aW9uRXhwcmVzc2lvblwiO1xuICAgICAgZGVsZXRlIGZ1bmNOb2RlLmtpbmQ7XG4gICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgbm9kZS52YWx1ZSA9IGZ1bmNOb2RlO1xuICAgICAgaWYgKHR5cGUgPT09IFwiQ2xhc3NQcml2YXRlTWV0aG9kXCIpIHtcbiAgICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgICAgbm9kZS5jb21wdXRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgdHlwZSA9IFwiTWV0aG9kRGVmaW5pdGlvblwiO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCB0eXBlKTtcbiAgICB9XG5cbiAgICBwYXJzZUNsYXNzUHJvcGVydHkoLi4uYXJnczogW04uQ2xhc3NQcm9wZXJ0eV0pOiBhbnkge1xuICAgICAgY29uc3QgcHJvcGVydHlOb2RlID0gKHN1cGVyLnBhcnNlQ2xhc3NQcm9wZXJ0eSguLi5hcmdzKTogYW55KTtcbiAgICAgIGlmICh0aGlzLmdldFBsdWdpbk9wdGlvbihcImVzdHJlZVwiLCBcImNsYXNzRmVhdHVyZXNcIikpIHtcbiAgICAgICAgcHJvcGVydHlOb2RlLnR5cGUgPSBcIlByb3BlcnR5RGVmaW5pdGlvblwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChwcm9wZXJ0eU5vZGU6IE4uRXN0cmVlUHJvcGVydHlEZWZpbml0aW9uKTtcbiAgICB9XG5cbiAgICBwYXJzZUNsYXNzUHJpdmF0ZVByb3BlcnR5KC4uLmFyZ3M6IFtOLkNsYXNzUHJpdmF0ZVByb3BlcnR5XSk6IGFueSB7XG4gICAgICBjb25zdCBwcm9wZXJ0eU5vZGUgPSAoc3VwZXIucGFyc2VDbGFzc1ByaXZhdGVQcm9wZXJ0eSguLi5hcmdzKTogYW55KTtcbiAgICAgIGlmICh0aGlzLmdldFBsdWdpbk9wdGlvbihcImVzdHJlZVwiLCBcImNsYXNzRmVhdHVyZXNcIikpIHtcbiAgICAgICAgcHJvcGVydHlOb2RlLnR5cGUgPSBcIlByb3BlcnR5RGVmaW5pdGlvblwiO1xuICAgICAgICBwcm9wZXJ0eU5vZGUuY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocHJvcGVydHlOb2RlOiBOLkVzdHJlZVByb3BlcnR5RGVmaW5pdGlvbik7XG4gICAgfVxuXG4gICAgcGFyc2VPYmplY3RNZXRob2QoXG4gICAgICBwcm9wOiBOLk9iamVjdE1ldGhvZCxcbiAgICAgIGlzR2VuZXJhdG9yOiBib29sZWFuLFxuICAgICAgaXNBc3luYzogYm9vbGVhbixcbiAgICAgIGlzUGF0dGVybjogYm9vbGVhbixcbiAgICAgIGlzQWNjZXNzb3I6IGJvb2xlYW4sXG4gICAgKTogP04uT2JqZWN0TWV0aG9kIHtcbiAgICAgIGNvbnN0IG5vZGU6IE4uRXN0cmVlUHJvcGVydHkgPSAoc3VwZXIucGFyc2VPYmplY3RNZXRob2QoXG4gICAgICAgIHByb3AsXG4gICAgICAgIGlzR2VuZXJhdG9yLFxuICAgICAgICBpc0FzeW5jLFxuICAgICAgICBpc1BhdHRlcm4sXG4gICAgICAgIGlzQWNjZXNzb3IsXG4gICAgICApOiBhbnkpO1xuXG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICBub2RlLnR5cGUgPSBcIlByb3BlcnR5XCI7XG4gICAgICAgIGlmICgoKG5vZGU6IGFueSk6IE4uQ2xhc3NNZXRob2QpLmtpbmQgPT09IFwibWV0aG9kXCIpIG5vZGUua2luZCA9IFwiaW5pdFwiO1xuICAgICAgICBub2RlLnNob3J0aGFuZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKG5vZGU6IGFueSk7XG4gICAgfVxuXG4gICAgcGFyc2VPYmplY3RQcm9wZXJ0eShcbiAgICAgIHByb3A6IE4uT2JqZWN0UHJvcGVydHksXG4gICAgICBzdGFydFBvczogP251bWJlcixcbiAgICAgIHN0YXJ0TG9jOiA/UG9zaXRpb24sXG4gICAgICBpc1BhdHRlcm46IGJvb2xlYW4sXG4gICAgICByZWZFeHByZXNzaW9uRXJyb3JzOiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgICApOiA/Ti5PYmplY3RQcm9wZXJ0eSB7XG4gICAgICBjb25zdCBub2RlOiBOLkVzdHJlZVByb3BlcnR5ID0gKHN1cGVyLnBhcnNlT2JqZWN0UHJvcGVydHkoXG4gICAgICAgIHByb3AsXG4gICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICBzdGFydExvYyxcbiAgICAgICAgaXNQYXR0ZXJuLFxuICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgKTogYW55KTtcblxuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgbm9kZS5raW5kID0gXCJpbml0XCI7XG4gICAgICAgIG5vZGUudHlwZSA9IFwiUHJvcGVydHlcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChub2RlOiBhbnkpO1xuICAgIH1cblxuICAgIHRvQXNzaWduYWJsZShub2RlOiBOLk5vZGUsIGlzTEhTOiBib29sZWFuID0gZmFsc2UpOiBOLk5vZGUge1xuICAgICAgaWYgKG5vZGUgIT0gbnVsbCAmJiB0aGlzLmlzT2JqZWN0UHJvcGVydHkobm9kZSkpIHtcbiAgICAgICAgdGhpcy50b0Fzc2lnbmFibGUobm9kZS52YWx1ZSwgaXNMSFMpO1xuXG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIudG9Bc3NpZ25hYmxlKG5vZGUsIGlzTEhTKTtcbiAgICB9XG5cbiAgICB0b0Fzc2lnbmFibGVPYmplY3RFeHByZXNzaW9uUHJvcChwcm9wOiBOLk5vZGUsIC4uLmFyZ3MpIHtcbiAgICAgIGlmIChwcm9wLmtpbmQgPT09IFwiZ2V0XCIgfHwgcHJvcC5raW5kID09PSBcInNldFwiKSB7XG4gICAgICAgIHRoaXMucmFpc2UocHJvcC5rZXkuc3RhcnQsIEVycm9ycy5QYXR0ZXJuSGFzQWNjZXNzb3IpO1xuICAgICAgfSBlbHNlIGlmIChwcm9wLm1ldGhvZCkge1xuICAgICAgICB0aGlzLnJhaXNlKHByb3Aua2V5LnN0YXJ0LCBFcnJvcnMuUGF0dGVybkhhc01ldGhvZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdXBlci50b0Fzc2lnbmFibGVPYmplY3RFeHByZXNzaW9uUHJvcChwcm9wLCAuLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5pc2hDYWxsRXhwcmVzc2lvbjxUOiBOLkNhbGxFeHByZXNzaW9uIHwgTi5PcHRpb25hbENhbGxFeHByZXNzaW9uPihcbiAgICAgIG5vZGU6IFQsXG4gICAgICBvcHRpb25hbDogYm9vbGVhbixcbiAgICApOiBOLkV4cHJlc3Npb24ge1xuICAgICAgc3VwZXIuZmluaXNoQ2FsbEV4cHJlc3Npb24obm9kZSwgb3B0aW9uYWwpO1xuXG4gICAgICBpZiAobm9kZS5jYWxsZWUudHlwZSA9PT0gXCJJbXBvcnRcIikge1xuICAgICAgICAoKG5vZGU6IE4uTm9kZSk6IE4uRXN0cmVlSW1wb3J0RXhwcmVzc2lvbikudHlwZSA9IFwiSW1wb3J0RXhwcmVzc2lvblwiO1xuICAgICAgICAoKG5vZGU6IE4uTm9kZSk6IE4uRXN0cmVlSW1wb3J0RXhwcmVzc2lvbikuc291cmNlID0gbm9kZS5hcmd1bWVudHNbMF07XG4gICAgICAgIGlmICh0aGlzLmhhc1BsdWdpbihcImltcG9ydEFzc2VydGlvbnNcIikpIHtcbiAgICAgICAgICAoKG5vZGU6IE4uTm9kZSk6IE4uRXN0cmVlSW1wb3J0RXhwcmVzc2lvbikuYXR0cmlidXRlcyA9XG4gICAgICAgICAgICBub2RlLmFyZ3VtZW50c1sxXSA/PyBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vICRGbG93SWdub3JlIC0gYXJndW1lbnRzIGlzbid0IG9wdGlvbmFsIGluIHRoZSB0eXBlIGRlZmluaXRpb25cbiAgICAgICAgZGVsZXRlIG5vZGUuYXJndW1lbnRzO1xuICAgICAgICAvLyAkRmxvd0lnbm9yZSAtIGNhbGxlZSBpc24ndCBvcHRpb25hbCBpbiB0aGUgdHlwZSBkZWZpbml0aW9uXG4gICAgICAgIGRlbGV0ZSBub2RlLmNhbGxlZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgdG9SZWZlcmVuY2VkQXJndW1lbnRzKFxuICAgICAgbm9kZTpcbiAgICAgICAgfCBOLkNhbGxFeHByZXNzaW9uXG4gICAgICAgIHwgTi5PcHRpb25hbENhbGxFeHByZXNzaW9uXG4gICAgICAgIHwgTi5Fc3RyZWVJbXBvcnRFeHByZXNzaW9uLFxuICAgICAgLyogaXNQYXJlbnRoZXNpemVkRXhwcj86IGJvb2xlYW4sICovXG4gICAgKSB7XG4gICAgICAvLyBJbXBvcnRFeHByZXNzaW9ucyBkbyBub3QgaGF2ZSBhbiBhcmd1bWVudHMgYXJyYXkuXG4gICAgICBpZiAobm9kZS50eXBlID09PSBcIkltcG9ydEV4cHJlc3Npb25cIikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHN1cGVyLnRvUmVmZXJlbmNlZEFyZ3VtZW50cyhub2RlKTtcbiAgICB9XG5cbiAgICBwYXJzZUV4cG9ydChub2RlOiBOLk5vZGUpIHtcbiAgICAgIHN1cGVyLnBhcnNlRXhwb3J0KG5vZGUpO1xuXG4gICAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgICBjYXNlIFwiRXhwb3J0QWxsRGVjbGFyYXRpb25cIjpcbiAgICAgICAgICBub2RlLmV4cG9ydGVkID0gbnVsbDtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwiRXhwb3J0TmFtZWREZWNsYXJhdGlvblwiOlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG5vZGUuc3BlY2lmaWVycy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIG5vZGUuc3BlY2lmaWVyc1swXS50eXBlID09PSBcIkV4cG9ydE5hbWVzcGFjZVNwZWNpZmllclwiXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBub2RlLnR5cGUgPSBcIkV4cG9ydEFsbERlY2xhcmF0aW9uXCI7XG4gICAgICAgICAgICBub2RlLmV4cG9ydGVkID0gbm9kZS5zcGVjaWZpZXJzWzBdLmV4cG9ydGVkO1xuICAgICAgICAgICAgZGVsZXRlIG5vZGUuc3BlY2lmaWVycztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcGFyc2VTdWJzY3JpcHQoXG4gICAgICBiYXNlOiBOLkV4cHJlc3Npb24sXG4gICAgICBzdGFydFBvczogbnVtYmVyLFxuICAgICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgICAgbm9DYWxsczogP2Jvb2xlYW4sXG4gICAgICBzdGF0ZTogTi5QYXJzZVN1YnNjcmlwdFN0YXRlLFxuICAgICkge1xuICAgICAgY29uc3Qgbm9kZSA9IHN1cGVyLnBhcnNlU3Vic2NyaXB0KFxuICAgICAgICBiYXNlLFxuICAgICAgICBzdGFydFBvcyxcbiAgICAgICAgc3RhcnRMb2MsXG4gICAgICAgIG5vQ2FsbHMsXG4gICAgICAgIHN0YXRlLFxuICAgICAgKTtcblxuICAgICAgaWYgKHN0YXRlLm9wdGlvbmFsQ2hhaW5NZW1iZXIpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2VzdHJlZS9lc3RyZWUvYmxvYi9tYXN0ZXIvZXMyMDIwLm1kI2NoYWluZXhwcmVzc2lvblxuICAgICAgICBpZiAoXG4gICAgICAgICAgbm9kZS50eXBlID09PSBcIk9wdGlvbmFsTWVtYmVyRXhwcmVzc2lvblwiIHx8XG4gICAgICAgICAgbm9kZS50eXBlID09PSBcIk9wdGlvbmFsQ2FsbEV4cHJlc3Npb25cIlxuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLnR5cGUgPSBub2RlLnR5cGUuc3Vic3RyaW5nKDgpOyAvLyBzdHJpcCBPcHRpb25hbCBwcmVmaXhcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdGUuc3RvcCkge1xuICAgICAgICAgIGNvbnN0IGNoYWluID0gdGhpcy5zdGFydE5vZGVBdE5vZGUobm9kZSk7XG4gICAgICAgICAgY2hhaW4uZXhwcmVzc2lvbiA9IG5vZGU7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShjaGFpbiwgXCJDaGFpbkV4cHJlc3Npb25cIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIG5vZGUudHlwZSA9PT0gXCJNZW1iZXJFeHByZXNzaW9uXCIgfHxcbiAgICAgICAgbm9kZS50eXBlID09PSBcIkNhbGxFeHByZXNzaW9uXCJcbiAgICAgICkge1xuICAgICAgICBub2RlLm9wdGlvbmFsID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGhhc1Byb3BlcnR5QXNQcml2YXRlTmFtZShub2RlOiBOLk5vZGUpOiBib29sZWFuIHtcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiQ2hhaW5FeHByZXNzaW9uXCIpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZXhwcmVzc2lvbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5oYXNQcm9wZXJ0eUFzUHJpdmF0ZU5hbWUobm9kZSk7XG4gICAgfVxuXG4gICAgaXNPcHRpb25hbENoYWluKG5vZGU6IE4uTm9kZSk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gXCJDaGFpbkV4cHJlc3Npb25cIjtcbiAgICB9XG5cbiAgICBpc09iamVjdFByb3BlcnR5KG5vZGU6IE4uTm9kZSk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gXCJQcm9wZXJ0eVwiICYmIG5vZGUua2luZCA9PT0gXCJpbml0XCIgJiYgIW5vZGUubWV0aG9kO1xuICAgIH1cblxuICAgIGlzT2JqZWN0TWV0aG9kKG5vZGU6IE4uTm9kZSk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIG5vZGUubWV0aG9kIHx8IG5vZGUua2luZCA9PT0gXCJnZXRcIiB8fCBub2RlLmtpbmQgPT09IFwic2V0XCI7XG4gICAgfVxuICB9O1xuIl19