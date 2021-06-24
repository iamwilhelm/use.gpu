"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _types = require("../../tokenizer/types");

var N = _interopRequireWildcard(require("../../types"));

var _context = require("../../tokenizer/context");

var charCodes = _interopRequireWildcard(require("charcodes"));

var _identifier = require("../../util/identifier");

var _scope = _interopRequireDefault(require("./scope"));

var _scopeflags = require("../../util/scopeflags");

var _error = require("../../parser/error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var reservedTypes = new Set(["_", "any", "bool", "boolean", "empty", "extends", "false", "interface", "mixed", "null", "number", "static", "string", "true", "typeof", "void"]);
/* eslint sort-keys: "error" */
// The Errors key follows https://github.com/facebook/flow/blob/master/src/parser/parse_error.ml unless it does not exist

var FlowErrors = (0, _error.makeErrorTemplates)({
  AmbiguousConditionalArrow: "Ambiguous expression: wrap the arrow functions in parentheses to disambiguate.",
  AmbiguousDeclareModuleKind: "Found both `declare module.exports` and `declare export` in the same module. Modules can only have 1 since they are either an ES module or they are a CommonJS module.",
  AssignReservedType: "Cannot overwrite reserved type %0.",
  DeclareClassElement: "The `declare` modifier can only appear on class fields.",
  DeclareClassFieldInitializer: "Initializers are not allowed in fields with the `declare` modifier.",
  DuplicateDeclareModuleExports: "Duplicate `declare module.exports` statement.",
  EnumBooleanMemberNotInitialized: "Boolean enum members need to be initialized. Use either `%0 = true,` or `%0 = false,` in enum `%1`.",
  EnumDuplicateMemberName: "Enum member names need to be unique, but the name `%0` has already been used before in enum `%1`.",
  EnumInconsistentMemberValues: "Enum `%0` has inconsistent member initializers. Either use no initializers, or consistently use literals (either booleans, numbers, or strings) for all member initializers.",
  EnumInvalidExplicitType: "Enum type `%1` is not valid. Use one of `boolean`, `number`, `string`, or `symbol` in enum `%0`.",
  EnumInvalidExplicitTypeUnknownSupplied: "Supplied enum type is not valid. Use one of `boolean`, `number`, `string`, or `symbol` in enum `%0`.",
  EnumInvalidMemberInitializerPrimaryType: "Enum `%0` has type `%2`, so the initializer of `%1` needs to be a %2 literal.",
  EnumInvalidMemberInitializerSymbolType: "Symbol enum members cannot be initialized. Use `%1,` in enum `%0`.",
  EnumInvalidMemberInitializerUnknownType: "The enum member initializer for `%1` needs to be a literal (either a boolean, number, or string) in enum `%0`.",
  EnumInvalidMemberName: "Enum member names cannot start with lowercase 'a' through 'z'. Instead of using `%0`, consider using `%1`, in enum `%2`.",
  EnumNumberMemberNotInitialized: "Number enum members need to be initialized, e.g. `%1 = 1` in enum `%0`.",
  EnumStringMemberInconsistentlyInitailized: "String enum members need to consistently either all use initializers, or use no initializers, in enum `%0`.",
  GetterMayNotHaveThisParam: "A getter cannot have a `this` parameter.",
  ImportTypeShorthandOnlyInPureImport: "The `type` and `typeof` keywords on named imports can only be used on regular `import` statements. It cannot be used with `import type` or `import typeof` statements.",
  InexactInsideExact: "Explicit inexact syntax cannot appear inside an explicit exact object type.",
  InexactInsideNonObject: "Explicit inexact syntax cannot appear in class or interface definitions.",
  InexactVariance: "Explicit inexact syntax cannot have variance.",
  InvalidNonTypeImportInDeclareModule: "Imports within a `declare module` body must always be `import type` or `import typeof`.",
  MissingTypeParamDefault: "Type parameter declaration needs a default, since a preceding type parameter declaration has a default.",
  NestedDeclareModule: "`declare module` cannot be used inside another `declare module`.",
  NestedFlowComment: "Cannot have a flow comment inside another flow comment.",
  OptionalBindingPattern: "A binding pattern parameter cannot be optional in an implementation signature.",
  SetterMayNotHaveThisParam: "A setter cannot have a `this` parameter.",
  SpreadVariance: "Spread properties cannot have variance.",
  ThisParamAnnotationRequired: "A type annotation is required for the `this` parameter.",
  ThisParamBannedInConstructor: "Constructors cannot have a `this` parameter; constructors don't bind `this` like other functions.",
  ThisParamMayNotBeOptional: "The `this` parameter cannot be optional.",
  ThisParamMustBeFirst: "The `this` parameter must be the first function parameter.",
  ThisParamNoDefault: "The `this` parameter may not have a default value.",
  TypeBeforeInitializer: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeCastInPattern: "The type cast expression is expected to be wrapped with parenthesis.",
  UnexpectedExplicitInexactInObject: "Explicit inexact syntax must appear at the end of an inexact object.",
  UnexpectedReservedType: "Unexpected reserved type %0.",
  UnexpectedReservedUnderscore: "`_` is only allowed as a type argument to call or new.",
  UnexpectedSpaceBetweenModuloChecks: "Spaces between `%` and `checks` are not allowed here.",
  UnexpectedSpreadType: "Spread operator cannot appear in class or interface definitions.",
  UnexpectedSubtractionOperand: 'Unexpected token, expected "number" or "bigint".',
  UnexpectedTokenAfterTypeParameter: "Expected an arrow function after this type parameter declaration.",
  UnexpectedTypeParameterBeforeAsyncArrowFunction: "Type parameters must come after the async keyword, e.g. instead of `<T> async () => {}`, use `async <T>() => {}`.",
  UnsupportedDeclareExportKind: "`declare export %0` is not supported. Use `%1` instead.",
  UnsupportedStatementInDeclareModule: "Only declares and type imports are allowed inside declare module.",
  UnterminatedFlowComment: "Unterminated flow-comment."
},
/* code */
_error.ErrorCodes.SyntaxError);
/* eslint-disable sort-keys */

function isEsModuleType(bodyElement) {
  return bodyElement.type === "DeclareExportAllDeclaration" || bodyElement.type === "DeclareExportDeclaration" && (!bodyElement.declaration || bodyElement.declaration.type !== "TypeAlias" && bodyElement.declaration.type !== "InterfaceDeclaration");
}

function hasTypeImportKind(node) {
  return node.importKind === "type" || node.importKind === "typeof";
}

function isMaybeDefaultImport(state) {
  return (state.type === _types.types.name || !!state.type.keyword) && state.value !== "from";
}

var exportSuggestions = {
  "const": "declare export var",
  "let": "declare export var",
  type: "export type",
  "interface": "export interface"
}; // Like Array#filter, but returns a tuple [ acceptedElements, discardedElements ]

function partition(list, test) {
  var list1 = [];
  var list2 = [];

  for (var i = 0; i < list.length; i++) {
    (test(list[i], i, list) ? list1 : list2).push(list[i]);
  }

  return [list1, list2];
}

var FLOW_PRAGMA_REGEX = /\*?\s*@((?:no)?flow)\b/; // Flow enums types

var _default = function _default(superClass) {
  return /*#__PURE__*/function (_superClass) {
    _inherits(_class2, _superClass);

    var _super = _createSuper(_class2);

    function _class2() {
      var _this2;

      _classCallCheck(this, _class2);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this2 = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this2), "flowPragma", undefined);

      return _this2;
    }

    _createClass(_class2, [{
      key: "getScopeHandler",
      value: function getScopeHandler() {
        return _scope["default"];
      }
    }, {
      key: "shouldParseTypes",
      value: function shouldParseTypes() {
        return this.getPluginOption("flow", "all") || this.flowPragma === "flow";
      }
    }, {
      key: "shouldParseEnums",
      value: function shouldParseEnums() {
        return !!this.getPluginOption("flow", "enums");
      }
    }, {
      key: "finishToken",
      value: function finishToken(type, val) {
        if (type !== _types.types.string && type !== _types.types.semi && type !== _types.types.interpreterDirective) {
          if (this.flowPragma === undefined) {
            this.flowPragma = null;
          }
        }

        return _get(_getPrototypeOf(_class2.prototype), "finishToken", this).call(this, type, val);
      }
    }, {
      key: "addComment",
      value: function addComment(comment) {
        if (this.flowPragma === undefined) {
          // Try to parse a flow pragma.
          var matches = FLOW_PRAGMA_REGEX.exec(comment.value);

          if (!matches) {// do nothing
          } else if (matches[1] === "flow") {
            this.flowPragma = "flow";
          } else if (matches[1] === "noflow") {
            this.flowPragma = "noflow";
          } else {
            throw new Error("Unexpected flow pragma");
          }
        }

        return _get(_getPrototypeOf(_class2.prototype), "addComment", this).call(this, comment);
      }
    }, {
      key: "flowParseTypeInitialiser",
      value: function flowParseTypeInitialiser(tok) {
        var oldInType = this.state.inType;
        this.state.inType = true;
        this.expect(tok || _types.types.colon);
        var type = this.flowParseType();
        this.state.inType = oldInType;
        return type;
      }
    }, {
      key: "flowParsePredicate",
      value: function flowParsePredicate() {
        var node = this.startNode();
        var moduloPos = this.state.start;
        this.next(); // eat `%`

        this.expectContextual("checks"); // Force '%' and 'checks' to be adjacent

        if (this.state.lastTokStart > moduloPos + 1) {
          this.raise(moduloPos, FlowErrors.UnexpectedSpaceBetweenModuloChecks);
        }

        if (this.eat(_types.types.parenL)) {
          node.value = this.parseExpression();
          this.expect(_types.types.parenR);
          return this.finishNode(node, "DeclaredPredicate");
        } else {
          return this.finishNode(node, "InferredPredicate");
        }
      }
    }, {
      key: "flowParseTypeAndPredicateInitialiser",
      value: function flowParseTypeAndPredicateInitialiser() {
        var oldInType = this.state.inType;
        this.state.inType = true;
        this.expect(_types.types.colon);
        var type = null;
        var predicate = null;

        if (this.match(_types.types.modulo)) {
          this.state.inType = oldInType;
          predicate = this.flowParsePredicate();
        } else {
          type = this.flowParseType();
          this.state.inType = oldInType;

          if (this.match(_types.types.modulo)) {
            predicate = this.flowParsePredicate();
          }
        }

        return [type, predicate];
      }
    }, {
      key: "flowParseDeclareClass",
      value: function flowParseDeclareClass(node) {
        this.next();
        this.flowParseInterfaceish(node,
        /*isClass*/
        true);
        return this.finishNode(node, "DeclareClass");
      }
    }, {
      key: "flowParseDeclareFunction",
      value: function flowParseDeclareFunction(node) {
        this.next();
        var id = node.id = this.parseIdentifier();
        var typeNode = this.startNode();
        var typeContainer = this.startNode();

        if (this.isRelational("<")) {
          typeNode.typeParameters = this.flowParseTypeParameterDeclaration();
        } else {
          typeNode.typeParameters = null;
        }

        this.expect(_types.types.parenL);
        var tmp = this.flowParseFunctionTypeParams();
        typeNode.params = tmp.params;
        typeNode.rest = tmp.rest;
        typeNode["this"] = tmp._this;
        this.expect(_types.types.parenR);

        var _this$flowParseTypeAn = this.flowParseTypeAndPredicateInitialiser();

        var _this$flowParseTypeAn2 = _slicedToArray(_this$flowParseTypeAn, 2);

        // $FlowFixMe (destructuring not supported yet)
        typeNode.returnType = _this$flowParseTypeAn2[0];
        // $FlowFixMe (destructuring not supported yet)
        node.predicate = _this$flowParseTypeAn2[1];
        typeContainer.typeAnnotation = this.finishNode(typeNode, "FunctionTypeAnnotation");
        id.typeAnnotation = this.finishNode(typeContainer, "TypeAnnotation");
        this.resetEndLocation(id);
        this.semicolon();
        this.scope.declareName(node.id.name, _scopeflags.BIND_FLOW_DECLARE_FN, node.id.start);
        return this.finishNode(node, "DeclareFunction");
      }
    }, {
      key: "flowParseDeclare",
      value: function flowParseDeclare(node, insideModule) {
        if (this.match(_types.types._class)) {
          return this.flowParseDeclareClass(node);
        } else if (this.match(_types.types._function)) {
          return this.flowParseDeclareFunction(node);
        } else if (this.match(_types.types._var)) {
          return this.flowParseDeclareVariable(node);
        } else if (this.eatContextual("module")) {
          if (this.match(_types.types.dot)) {
            return this.flowParseDeclareModuleExports(node);
          } else {
            if (insideModule) {
              this.raise(this.state.lastTokStart, FlowErrors.NestedDeclareModule);
            }

            return this.flowParseDeclareModule(node);
          }
        } else if (this.isContextual("type")) {
          return this.flowParseDeclareTypeAlias(node);
        } else if (this.isContextual("opaque")) {
          return this.flowParseDeclareOpaqueType(node);
        } else if (this.isContextual("interface")) {
          return this.flowParseDeclareInterface(node);
        } else if (this.match(_types.types._export)) {
          return this.flowParseDeclareExportDeclaration(node, insideModule);
        } else {
          throw this.unexpected();
        }
      }
    }, {
      key: "flowParseDeclareVariable",
      value: function flowParseDeclareVariable(node) {
        this.next();
        node.id = this.flowParseTypeAnnotatableIdentifier(
        /*allowPrimitiveOverride*/
        true);
        this.scope.declareName(node.id.name, _scopeflags.BIND_VAR, node.id.start);
        this.semicolon();
        return this.finishNode(node, "DeclareVariable");
      }
    }, {
      key: "flowParseDeclareModule",
      value: function flowParseDeclareModule(node) {
        var _this3 = this;

        this.scope.enter(_scopeflags.SCOPE_OTHER);

        if (this.match(_types.types.string)) {
          node.id = this.parseExprAtom();
        } else {
          node.id = this.parseIdentifier();
        }

        var bodyNode = node.body = this.startNode();
        var body = bodyNode.body = [];
        this.expect(_types.types.braceL);

        while (!this.match(_types.types.braceR)) {
          var _bodyNode = this.startNode();

          if (this.match(_types.types._import)) {
            this.next();

            if (!this.isContextual("type") && !this.match(_types.types._typeof)) {
              this.raise(this.state.lastTokStart, FlowErrors.InvalidNonTypeImportInDeclareModule);
            }

            this.parseImport(_bodyNode);
          } else {
            this.expectContextual("declare", FlowErrors.UnsupportedStatementInDeclareModule);
            _bodyNode = this.flowParseDeclare(_bodyNode, true);
          }

          body.push(_bodyNode);
        }

        this.scope.exit();
        this.expect(_types.types.braceR);
        this.finishNode(bodyNode, "BlockStatement");
        var kind = null;
        var hasModuleExport = false;
        body.forEach(function (bodyElement) {
          if (isEsModuleType(bodyElement)) {
            if (kind === "CommonJS") {
              _this3.raise(bodyElement.start, FlowErrors.AmbiguousDeclareModuleKind);
            }

            kind = "ES";
          } else if (bodyElement.type === "DeclareModuleExports") {
            if (hasModuleExport) {
              _this3.raise(bodyElement.start, FlowErrors.DuplicateDeclareModuleExports);
            }

            if (kind === "ES") {
              _this3.raise(bodyElement.start, FlowErrors.AmbiguousDeclareModuleKind);
            }

            kind = "CommonJS";
            hasModuleExport = true;
          }
        });
        node.kind = kind || "CommonJS";
        return this.finishNode(node, "DeclareModule");
      }
    }, {
      key: "flowParseDeclareExportDeclaration",
      value: function flowParseDeclareExportDeclaration(node, insideModule) {
        this.expect(_types.types._export);

        if (this.eat(_types.types._default)) {
          if (this.match(_types.types._function) || this.match(_types.types._class)) {
            // declare export default class ...
            // declare export default function ...
            node.declaration = this.flowParseDeclare(this.startNode());
          } else {
            // declare export default [type];
            node.declaration = this.flowParseType();
            this.semicolon();
          }

          node["default"] = true;
          return this.finishNode(node, "DeclareExportDeclaration");
        } else {
          if (this.match(_types.types._const) || this.isLet() || (this.isContextual("type") || this.isContextual("interface")) && !insideModule) {
            var label = this.state.value;
            var suggestion = exportSuggestions[label];
            throw this.raise(this.state.start, FlowErrors.UnsupportedDeclareExportKind, label, suggestion);
          }

          if (this.match(_types.types._var) || // declare export var ...
          this.match(_types.types._function) || // declare export function ...
          this.match(_types.types._class) || // declare export class ...
          this.isContextual("opaque") // declare export opaque ..
          ) {
              node.declaration = this.flowParseDeclare(this.startNode());
              node["default"] = false;
              return this.finishNode(node, "DeclareExportDeclaration");
            } else if (this.match(_types.types.star) || // declare export * from ''
          this.match(_types.types.braceL) || // declare export {} ...
          this.isContextual("interface") || // declare export interface ...
          this.isContextual("type") || // declare export type ...
          this.isContextual("opaque") // declare export opaque type ...
          ) {
              node = this.parseExport(node);

              if (node.type === "ExportNamedDeclaration") {
                // flow does not support the ExportNamedDeclaration
                // $FlowIgnore
                node.type = "ExportDeclaration"; // $FlowFixMe

                node["default"] = false;
                delete node.exportKind;
              } // $FlowIgnore


              node.type = "Declare" + node.type;
              return node;
            }
        }

        throw this.unexpected();
      }
    }, {
      key: "flowParseDeclareModuleExports",
      value: function flowParseDeclareModuleExports(node) {
        this.next();
        this.expectContextual("exports");
        node.typeAnnotation = this.flowParseTypeAnnotation();
        this.semicolon();
        return this.finishNode(node, "DeclareModuleExports");
      }
    }, {
      key: "flowParseDeclareTypeAlias",
      value: function flowParseDeclareTypeAlias(node) {
        this.next();
        this.flowParseTypeAlias(node); // Don't do finishNode as we don't want to process comments twice

        node.type = "DeclareTypeAlias";
        return node;
      }
    }, {
      key: "flowParseDeclareOpaqueType",
      value: function flowParseDeclareOpaqueType(node) {
        this.next();
        this.flowParseOpaqueType(node, true); // Don't do finishNode as we don't want to process comments twice

        node.type = "DeclareOpaqueType";
        return node;
      }
    }, {
      key: "flowParseDeclareInterface",
      value: function flowParseDeclareInterface(node) {
        this.next();
        this.flowParseInterfaceish(node);
        return this.finishNode(node, "DeclareInterface");
      } // Interfaces

    }, {
      key: "flowParseInterfaceish",
      value: function flowParseInterfaceish(node) {
        var isClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        node.id = this.flowParseRestrictedIdentifier(
        /* liberal */
        !isClass,
        /* declaration */
        true);
        this.scope.declareName(node.id.name, isClass ? _scopeflags.BIND_FUNCTION : _scopeflags.BIND_LEXICAL, node.id.start);

        if (this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterDeclaration();
        } else {
          node.typeParameters = null;
        }

        node["extends"] = [];
        node["implements"] = [];
        node.mixins = [];

        if (this.eat(_types.types._extends)) {
          do {
            node["extends"].push(this.flowParseInterfaceExtends());
          } while (!isClass && this.eat(_types.types.comma));
        }

        if (this.isContextual("mixins")) {
          this.next();

          do {
            node.mixins.push(this.flowParseInterfaceExtends());
          } while (this.eat(_types.types.comma));
        }

        if (this.isContextual("implements")) {
          this.next();

          do {
            node["implements"].push(this.flowParseInterfaceExtends());
          } while (this.eat(_types.types.comma));
        }

        node.body = this.flowParseObjectType({
          allowStatic: isClass,
          allowExact: false,
          allowSpread: false,
          allowProto: isClass,
          allowInexact: false
        });
      }
    }, {
      key: "flowParseInterfaceExtends",
      value: function flowParseInterfaceExtends() {
        var node = this.startNode();
        node.id = this.flowParseQualifiedTypeIdentifier();

        if (this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterInstantiation();
        } else {
          node.typeParameters = null;
        }

        return this.finishNode(node, "InterfaceExtends");
      }
    }, {
      key: "flowParseInterface",
      value: function flowParseInterface(node) {
        this.flowParseInterfaceish(node);
        return this.finishNode(node, "InterfaceDeclaration");
      }
    }, {
      key: "checkNotUnderscore",
      value: function checkNotUnderscore(word) {
        if (word === "_") {
          this.raise(this.state.start, FlowErrors.UnexpectedReservedUnderscore);
        }
      }
    }, {
      key: "checkReservedType",
      value: function checkReservedType(word, startLoc, declaration) {
        if (!reservedTypes.has(word)) return;
        this.raise(startLoc, declaration ? FlowErrors.AssignReservedType : FlowErrors.UnexpectedReservedType, word);
      }
    }, {
      key: "flowParseRestrictedIdentifier",
      value: function flowParseRestrictedIdentifier(liberal, declaration) {
        this.checkReservedType(this.state.value, this.state.start, declaration);
        return this.parseIdentifier(liberal);
      } // Type aliases

    }, {
      key: "flowParseTypeAlias",
      value: function flowParseTypeAlias(node) {
        node.id = this.flowParseRestrictedIdentifier(
        /* liberal */
        false,
        /* declaration */
        true);
        this.scope.declareName(node.id.name, _scopeflags.BIND_LEXICAL, node.id.start);

        if (this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterDeclaration();
        } else {
          node.typeParameters = null;
        }

        node.right = this.flowParseTypeInitialiser(_types.types.eq);
        this.semicolon();
        return this.finishNode(node, "TypeAlias");
      }
    }, {
      key: "flowParseOpaqueType",
      value: function flowParseOpaqueType(node, declare) {
        this.expectContextual("type");
        node.id = this.flowParseRestrictedIdentifier(
        /* liberal */
        true,
        /* declaration */
        true);
        this.scope.declareName(node.id.name, _scopeflags.BIND_LEXICAL, node.id.start);

        if (this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterDeclaration();
        } else {
          node.typeParameters = null;
        } // Parse the supertype


        node.supertype = null;

        if (this.match(_types.types.colon)) {
          node.supertype = this.flowParseTypeInitialiser(_types.types.colon);
        }

        node.impltype = null;

        if (!declare) {
          node.impltype = this.flowParseTypeInitialiser(_types.types.eq);
        }

        this.semicolon();
        return this.finishNode(node, "OpaqueType");
      } // Type annotations

    }, {
      key: "flowParseTypeParameter",
      value: function flowParseTypeParameter() {
        var requireDefault = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var nodeStart = this.state.start;
        var node = this.startNode();
        var variance = this.flowParseVariance();
        var ident = this.flowParseTypeAnnotatableIdentifier();
        node.name = ident.name;
        node.variance = variance;
        node.bound = ident.typeAnnotation;

        if (this.match(_types.types.eq)) {
          this.eat(_types.types.eq);
          node["default"] = this.flowParseType();
        } else {
          if (requireDefault) {
            this.raise(nodeStart, FlowErrors.MissingTypeParamDefault);
          }
        }

        return this.finishNode(node, "TypeParameter");
      }
    }, {
      key: "flowParseTypeParameterDeclaration",
      value: function flowParseTypeParameterDeclaration() {
        var oldInType = this.state.inType;
        var node = this.startNode();
        node.params = [];
        this.state.inType = true; // istanbul ignore else: this condition is already checked at all call sites

        if (this.isRelational("<") || this.match(_types.types.jsxTagStart)) {
          this.next();
        } else {
          this.unexpected();
        }

        var defaultRequired = false;

        do {
          var typeParameter = this.flowParseTypeParameter(defaultRequired);
          node.params.push(typeParameter);

          if (typeParameter["default"]) {
            defaultRequired = true;
          }

          if (!this.isRelational(">")) {
            this.expect(_types.types.comma);
          }
        } while (!this.isRelational(">"));

        this.expectRelational(">");
        this.state.inType = oldInType;
        return this.finishNode(node, "TypeParameterDeclaration");
      }
    }, {
      key: "flowParseTypeParameterInstantiation",
      value: function flowParseTypeParameterInstantiation() {
        var node = this.startNode();
        var oldInType = this.state.inType;
        node.params = [];
        this.state.inType = true;
        this.expectRelational("<");
        var oldNoAnonFunctionType = this.state.noAnonFunctionType;
        this.state.noAnonFunctionType = false;

        while (!this.isRelational(">")) {
          node.params.push(this.flowParseType());

          if (!this.isRelational(">")) {
            this.expect(_types.types.comma);
          }
        }

        this.state.noAnonFunctionType = oldNoAnonFunctionType;
        this.expectRelational(">");
        this.state.inType = oldInType;
        return this.finishNode(node, "TypeParameterInstantiation");
      }
    }, {
      key: "flowParseTypeParameterInstantiationCallOrNew",
      value: function flowParseTypeParameterInstantiationCallOrNew() {
        var node = this.startNode();
        var oldInType = this.state.inType;
        node.params = [];
        this.state.inType = true;
        this.expectRelational("<");

        while (!this.isRelational(">")) {
          node.params.push(this.flowParseTypeOrImplicitInstantiation());

          if (!this.isRelational(">")) {
            this.expect(_types.types.comma);
          }
        }

        this.expectRelational(">");
        this.state.inType = oldInType;
        return this.finishNode(node, "TypeParameterInstantiation");
      }
    }, {
      key: "flowParseInterfaceType",
      value: function flowParseInterfaceType() {
        var node = this.startNode();
        this.expectContextual("interface");
        node["extends"] = [];

        if (this.eat(_types.types._extends)) {
          do {
            node["extends"].push(this.flowParseInterfaceExtends());
          } while (this.eat(_types.types.comma));
        }

        node.body = this.flowParseObjectType({
          allowStatic: false,
          allowExact: false,
          allowSpread: false,
          allowProto: false,
          allowInexact: false
        });
        return this.finishNode(node, "InterfaceTypeAnnotation");
      }
    }, {
      key: "flowParseObjectPropertyKey",
      value: function flowParseObjectPropertyKey() {
        return this.match(_types.types.num) || this.match(_types.types.string) ? this.parseExprAtom() : this.parseIdentifier(true);
      }
    }, {
      key: "flowParseObjectTypeIndexer",
      value: function flowParseObjectTypeIndexer(node, isStatic, variance) {
        node["static"] = isStatic; // Note: bracketL has already been consumed

        if (this.lookahead().type === _types.types.colon) {
          node.id = this.flowParseObjectPropertyKey();
          node.key = this.flowParseTypeInitialiser();
        } else {
          node.id = null;
          node.key = this.flowParseType();
        }

        this.expect(_types.types.bracketR);
        node.value = this.flowParseTypeInitialiser();
        node.variance = variance;
        return this.finishNode(node, "ObjectTypeIndexer");
      }
    }, {
      key: "flowParseObjectTypeInternalSlot",
      value: function flowParseObjectTypeInternalSlot(node, isStatic) {
        node["static"] = isStatic; // Note: both bracketL have already been consumed

        node.id = this.flowParseObjectPropertyKey();
        this.expect(_types.types.bracketR);
        this.expect(_types.types.bracketR);

        if (this.isRelational("<") || this.match(_types.types.parenL)) {
          node.method = true;
          node.optional = false;
          node.value = this.flowParseObjectTypeMethodish(this.startNodeAt(node.start, node.loc.start));
        } else {
          node.method = false;

          if (this.eat(_types.types.question)) {
            node.optional = true;
          }

          node.value = this.flowParseTypeInitialiser();
        }

        return this.finishNode(node, "ObjectTypeInternalSlot");
      }
    }, {
      key: "flowParseObjectTypeMethodish",
      value: function flowParseObjectTypeMethodish(node) {
        node.params = [];
        node.rest = null;
        node.typeParameters = null;
        node["this"] = null;

        if (this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterDeclaration();
        }

        this.expect(_types.types.parenL);

        if (this.match(_types.types._this)) {
          node["this"] = this.flowParseFunctionTypeParam(
          /* first */
          true); // match Flow parser behavior

          node["this"].name = null;

          if (!this.match(_types.types.parenR)) {
            this.expect(_types.types.comma);
          }
        }

        while (!this.match(_types.types.parenR) && !this.match(_types.types.ellipsis)) {
          node.params.push(this.flowParseFunctionTypeParam(false));

          if (!this.match(_types.types.parenR)) {
            this.expect(_types.types.comma);
          }
        }

        if (this.eat(_types.types.ellipsis)) {
          node.rest = this.flowParseFunctionTypeParam(false);
        }

        this.expect(_types.types.parenR);
        node.returnType = this.flowParseTypeInitialiser();
        return this.finishNode(node, "FunctionTypeAnnotation");
      }
    }, {
      key: "flowParseObjectTypeCallProperty",
      value: function flowParseObjectTypeCallProperty(node, isStatic) {
        var valueNode = this.startNode();
        node["static"] = isStatic;
        node.value = this.flowParseObjectTypeMethodish(valueNode);
        return this.finishNode(node, "ObjectTypeCallProperty");
      }
    }, {
      key: "flowParseObjectType",
      value: function flowParseObjectType(_ref) {
        var allowStatic = _ref.allowStatic,
            allowExact = _ref.allowExact,
            allowSpread = _ref.allowSpread,
            allowProto = _ref.allowProto,
            allowInexact = _ref.allowInexact;
        var oldInType = this.state.inType;
        this.state.inType = true;
        var nodeStart = this.startNode();
        nodeStart.callProperties = [];
        nodeStart.properties = [];
        nodeStart.indexers = [];
        nodeStart.internalSlots = [];
        var endDelim;
        var exact;
        var inexact = false;

        if (allowExact && this.match(_types.types.braceBarL)) {
          this.expect(_types.types.braceBarL);
          endDelim = _types.types.braceBarR;
          exact = true;
        } else {
          this.expect(_types.types.braceL);
          endDelim = _types.types.braceR;
          exact = false;
        }

        nodeStart.exact = exact;

        while (!this.match(endDelim)) {
          var isStatic = false;
          var protoStart = null;
          var inexactStart = null;
          var node = this.startNode();

          if (allowProto && this.isContextual("proto")) {
            var lookahead = this.lookahead();

            if (lookahead.type !== _types.types.colon && lookahead.type !== _types.types.question) {
              this.next();
              protoStart = this.state.start;
              allowStatic = false;
            }
          }

          if (allowStatic && this.isContextual("static")) {
            var _lookahead = this.lookahead(); // static is a valid identifier name


            if (_lookahead.type !== _types.types.colon && _lookahead.type !== _types.types.question) {
              this.next();
              isStatic = true;
            }
          }

          var variance = this.flowParseVariance();

          if (this.eat(_types.types.bracketL)) {
            if (protoStart != null) {
              this.unexpected(protoStart);
            }

            if (this.eat(_types.types.bracketL)) {
              if (variance) {
                this.unexpected(variance.start);
              }

              nodeStart.internalSlots.push(this.flowParseObjectTypeInternalSlot(node, isStatic));
            } else {
              nodeStart.indexers.push(this.flowParseObjectTypeIndexer(node, isStatic, variance));
            }
          } else if (this.match(_types.types.parenL) || this.isRelational("<")) {
            if (protoStart != null) {
              this.unexpected(protoStart);
            }

            if (variance) {
              this.unexpected(variance.start);
            }

            nodeStart.callProperties.push(this.flowParseObjectTypeCallProperty(node, isStatic));
          } else {
            var kind = "init";

            if (this.isContextual("get") || this.isContextual("set")) {
              var _lookahead2 = this.lookahead();

              if (_lookahead2.type === _types.types.name || _lookahead2.type === _types.types.string || _lookahead2.type === _types.types.num) {
                kind = this.state.value;
                this.next();
              }
            }

            var propOrInexact = this.flowParseObjectTypeProperty(node, isStatic, protoStart, variance, kind, allowSpread, allowInexact !== null && allowInexact !== void 0 ? allowInexact : !exact);

            if (propOrInexact === null) {
              inexact = true;
              inexactStart = this.state.lastTokStart;
            } else {
              nodeStart.properties.push(propOrInexact);
            }
          }

          this.flowObjectTypeSemicolon();

          if (inexactStart && !this.match(_types.types.braceR) && !this.match(_types.types.braceBarR)) {
            this.raise(inexactStart, FlowErrors.UnexpectedExplicitInexactInObject);
          }
        }

        this.expect(endDelim);
        /* The inexact flag should only be added on ObjectTypeAnnotations that
         * are not the body of an interface, declare interface, or declare class.
         * Since spreads are only allowed in object types, checking that is
         * sufficient here.
         */

        if (allowSpread) {
          nodeStart.inexact = inexact;
        }

        var out = this.finishNode(nodeStart, "ObjectTypeAnnotation");
        this.state.inType = oldInType;
        return out;
      }
    }, {
      key: "flowParseObjectTypeProperty",
      value: function flowParseObjectTypeProperty(node, isStatic, protoStart, variance, kind, allowSpread, allowInexact) {
        if (this.eat(_types.types.ellipsis)) {
          var isInexactToken = this.match(_types.types.comma) || this.match(_types.types.semi) || this.match(_types.types.braceR) || this.match(_types.types.braceBarR);

          if (isInexactToken) {
            if (!allowSpread) {
              this.raise(this.state.lastTokStart, FlowErrors.InexactInsideNonObject);
            } else if (!allowInexact) {
              this.raise(this.state.lastTokStart, FlowErrors.InexactInsideExact);
            }

            if (variance) {
              this.raise(variance.start, FlowErrors.InexactVariance);
            }

            return null;
          }

          if (!allowSpread) {
            this.raise(this.state.lastTokStart, FlowErrors.UnexpectedSpreadType);
          }

          if (protoStart != null) {
            this.unexpected(protoStart);
          }

          if (variance) {
            this.raise(variance.start, FlowErrors.SpreadVariance);
          }

          node.argument = this.flowParseType();
          return this.finishNode(node, "ObjectTypeSpreadProperty");
        } else {
          node.key = this.flowParseObjectPropertyKey();
          node["static"] = isStatic;
          node.proto = protoStart != null;
          node.kind = kind;
          var optional = false;

          if (this.isRelational("<") || this.match(_types.types.parenL)) {
            // This is a method property
            node.method = true;

            if (protoStart != null) {
              this.unexpected(protoStart);
            }

            if (variance) {
              this.unexpected(variance.start);
            }

            node.value = this.flowParseObjectTypeMethodish(this.startNodeAt(node.start, node.loc.start));

            if (kind === "get" || kind === "set") {
              this.flowCheckGetterSetterParams(node);
            }
            /** Declared classes/interfaces do not allow spread */


            if (!allowSpread && node.key.name === "constructor" && node.value["this"]) {
              this.raise(node.value["this"].start, FlowErrors.ThisParamBannedInConstructor);
            }
          } else {
            if (kind !== "init") this.unexpected();
            node.method = false;

            if (this.eat(_types.types.question)) {
              optional = true;
            }

            node.value = this.flowParseTypeInitialiser();
            node.variance = variance;
          }

          node.optional = optional;
          return this.finishNode(node, "ObjectTypeProperty");
        }
      } // This is similar to checkGetterSetterParams, but as
      // @babel/parser uses non estree properties we cannot reuse it here

    }, {
      key: "flowCheckGetterSetterParams",
      value: function flowCheckGetterSetterParams(property) {
        var paramCount = property.kind === "get" ? 0 : 1;
        var start = property.start;
        var length = property.value.params.length + (property.value.rest ? 1 : 0);

        if (property.value["this"]) {
          this.raise(property.value["this"].start, property.kind === "get" ? FlowErrors.GetterMayNotHaveThisParam : FlowErrors.SetterMayNotHaveThisParam);
        }

        if (length !== paramCount) {
          if (property.kind === "get") {
            this.raise(start, _error.Errors.BadGetterArity);
          } else {
            this.raise(start, _error.Errors.BadSetterArity);
          }
        }

        if (property.kind === "set" && property.value.rest) {
          this.raise(start, _error.Errors.BadSetterRestParameter);
        }
      }
    }, {
      key: "flowObjectTypeSemicolon",
      value: function flowObjectTypeSemicolon() {
        if (!this.eat(_types.types.semi) && !this.eat(_types.types.comma) && !this.match(_types.types.braceR) && !this.match(_types.types.braceBarR)) {
          this.unexpected();
        }
      }
    }, {
      key: "flowParseQualifiedTypeIdentifier",
      value: function flowParseQualifiedTypeIdentifier(startPos, startLoc, id) {
        startPos = startPos || this.state.start;
        startLoc = startLoc || this.state.startLoc;
        var node = id || this.flowParseRestrictedIdentifier(true);

        while (this.eat(_types.types.dot)) {
          var node2 = this.startNodeAt(startPos, startLoc);
          node2.qualification = node;
          node2.id = this.flowParseRestrictedIdentifier(true);
          node = this.finishNode(node2, "QualifiedTypeIdentifier");
        }

        return node;
      }
    }, {
      key: "flowParseGenericType",
      value: function flowParseGenericType(startPos, startLoc, id) {
        var node = this.startNodeAt(startPos, startLoc);
        node.typeParameters = null;
        node.id = this.flowParseQualifiedTypeIdentifier(startPos, startLoc, id);

        if (this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterInstantiation();
        }

        return this.finishNode(node, "GenericTypeAnnotation");
      }
    }, {
      key: "flowParseTypeofType",
      value: function flowParseTypeofType() {
        var node = this.startNode();
        this.expect(_types.types._typeof);
        node.argument = this.flowParsePrimaryType();
        return this.finishNode(node, "TypeofTypeAnnotation");
      }
    }, {
      key: "flowParseTupleType",
      value: function flowParseTupleType() {
        var node = this.startNode();
        node.types = [];
        this.expect(_types.types.bracketL); // We allow trailing commas

        while (this.state.pos < this.length && !this.match(_types.types.bracketR)) {
          node.types.push(this.flowParseType());
          if (this.match(_types.types.bracketR)) break;
          this.expect(_types.types.comma);
        }

        this.expect(_types.types.bracketR);
        return this.finishNode(node, "TupleTypeAnnotation");
      }
    }, {
      key: "flowParseFunctionTypeParam",
      value: function flowParseFunctionTypeParam(first) {
        var name = null;
        var optional = false;
        var typeAnnotation = null;
        var node = this.startNode();
        var lh = this.lookahead();
        var isThis = this.state.type === _types.types._this;

        if (lh.type === _types.types.colon || lh.type === _types.types.question) {
          if (isThis && !first) {
            this.raise(node.start, FlowErrors.ThisParamMustBeFirst);
          }

          name = this.parseIdentifier(isThis);

          if (this.eat(_types.types.question)) {
            optional = true;

            if (isThis) {
              this.raise(node.start, FlowErrors.ThisParamMayNotBeOptional);
            }
          }

          typeAnnotation = this.flowParseTypeInitialiser();
        } else {
          typeAnnotation = this.flowParseType();
        }

        node.name = name;
        node.optional = optional;
        node.typeAnnotation = typeAnnotation;
        return this.finishNode(node, "FunctionTypeParam");
      }
    }, {
      key: "reinterpretTypeAsFunctionTypeParam",
      value: function reinterpretTypeAsFunctionTypeParam(type) {
        var node = this.startNodeAt(type.start, type.loc.start);
        node.name = null;
        node.optional = false;
        node.typeAnnotation = type;
        return this.finishNode(node, "FunctionTypeParam");
      }
    }, {
      key: "flowParseFunctionTypeParams",
      value: function flowParseFunctionTypeParams() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var rest = null;
        var _this = null;

        if (this.match(_types.types._this)) {
          _this = this.flowParseFunctionTypeParam(
          /* first */
          true); // match Flow parser behavior

          _this.name = null;

          if (!this.match(_types.types.parenR)) {
            this.expect(_types.types.comma);
          }
        }

        while (!this.match(_types.types.parenR) && !this.match(_types.types.ellipsis)) {
          params.push(this.flowParseFunctionTypeParam(false));

          if (!this.match(_types.types.parenR)) {
            this.expect(_types.types.comma);
          }
        }

        if (this.eat(_types.types.ellipsis)) {
          rest = this.flowParseFunctionTypeParam(false);
        }

        return {
          params: params,
          rest: rest,
          _this: _this
        };
      }
    }, {
      key: "flowIdentToTypeAnnotation",
      value: function flowIdentToTypeAnnotation(startPos, startLoc, node, id) {
        switch (id.name) {
          case "any":
            return this.finishNode(node, "AnyTypeAnnotation");

          case "bool":
          case "boolean":
            return this.finishNode(node, "BooleanTypeAnnotation");

          case "mixed":
            return this.finishNode(node, "MixedTypeAnnotation");

          case "empty":
            return this.finishNode(node, "EmptyTypeAnnotation");

          case "number":
            return this.finishNode(node, "NumberTypeAnnotation");

          case "string":
            return this.finishNode(node, "StringTypeAnnotation");

          case "symbol":
            return this.finishNode(node, "SymbolTypeAnnotation");

          default:
            this.checkNotUnderscore(id.name);
            return this.flowParseGenericType(startPos, startLoc, id);
        }
      } // The parsing of types roughly parallels the parsing of expressions, and
      // primary types are kind of like primary expressions...they're the
      // primitives with which other types are constructed.

    }, {
      key: "flowParsePrimaryType",
      value: function flowParsePrimaryType() {
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        var node = this.startNode();
        var tmp;
        var type;
        var isGroupedType = false;
        var oldNoAnonFunctionType = this.state.noAnonFunctionType;

        switch (this.state.type) {
          case _types.types.name:
            if (this.isContextual("interface")) {
              return this.flowParseInterfaceType();
            }

            return this.flowIdentToTypeAnnotation(startPos, startLoc, node, this.parseIdentifier());

          case _types.types.braceL:
            return this.flowParseObjectType({
              allowStatic: false,
              allowExact: false,
              allowSpread: true,
              allowProto: false,
              allowInexact: true
            });

          case _types.types.braceBarL:
            return this.flowParseObjectType({
              allowStatic: false,
              allowExact: true,
              allowSpread: true,
              allowProto: false,
              allowInexact: false
            });

          case _types.types.bracketL:
            this.state.noAnonFunctionType = false;
            type = this.flowParseTupleType();
            this.state.noAnonFunctionType = oldNoAnonFunctionType;
            return type;

          case _types.types.relational:
            if (this.state.value === "<") {
              node.typeParameters = this.flowParseTypeParameterDeclaration();
              this.expect(_types.types.parenL);
              tmp = this.flowParseFunctionTypeParams();
              node.params = tmp.params;
              node.rest = tmp.rest;
              node["this"] = tmp._this;
              this.expect(_types.types.parenR);
              this.expect(_types.types.arrow);
              node.returnType = this.flowParseType();
              return this.finishNode(node, "FunctionTypeAnnotation");
            }

            break;

          case _types.types.parenL:
            this.next(); // Check to see if this is actually a grouped type

            if (!this.match(_types.types.parenR) && !this.match(_types.types.ellipsis)) {
              if (this.match(_types.types.name) || this.match(_types.types._this)) {
                var token = this.lookahead().type;
                isGroupedType = token !== _types.types.question && token !== _types.types.colon;
              } else {
                isGroupedType = true;
              }
            }

            if (isGroupedType) {
              this.state.noAnonFunctionType = false;
              type = this.flowParseType();
              this.state.noAnonFunctionType = oldNoAnonFunctionType; // A `,` or a `) =>` means this is an anonymous function type

              if (this.state.noAnonFunctionType || !(this.match(_types.types.comma) || this.match(_types.types.parenR) && this.lookahead().type === _types.types.arrow)) {
                this.expect(_types.types.parenR);
                return type;
              } else {
                // Eat a comma if there is one
                this.eat(_types.types.comma);
              }
            }

            if (type) {
              tmp = this.flowParseFunctionTypeParams([this.reinterpretTypeAsFunctionTypeParam(type)]);
            } else {
              tmp = this.flowParseFunctionTypeParams();
            }

            node.params = tmp.params;
            node.rest = tmp.rest;
            node["this"] = tmp._this;
            this.expect(_types.types.parenR);
            this.expect(_types.types.arrow);
            node.returnType = this.flowParseType();
            node.typeParameters = null;
            return this.finishNode(node, "FunctionTypeAnnotation");

          case _types.types.string:
            return this.parseLiteral(this.state.value, "StringLiteralTypeAnnotation");

          case _types.types._true:
          case _types.types._false:
            node.value = this.match(_types.types._true);
            this.next();
            return this.finishNode(node, "BooleanLiteralTypeAnnotation");

          case _types.types.plusMin:
            if (this.state.value === "-") {
              this.next();

              if (this.match(_types.types.num)) {
                return this.parseLiteralAtNode(-this.state.value, "NumberLiteralTypeAnnotation", node);
              }

              if (this.match(_types.types.bigint)) {
                return this.parseLiteralAtNode(-this.state.value, "BigIntLiteralTypeAnnotation", node);
              }

              throw this.raise(this.state.start, FlowErrors.UnexpectedSubtractionOperand);
            }

            throw this.unexpected();

          case _types.types.num:
            return this.parseLiteral(this.state.value, "NumberLiteralTypeAnnotation");

          case _types.types.bigint:
            return this.parseLiteral(this.state.value, "BigIntLiteralTypeAnnotation");

          case _types.types._void:
            this.next();
            return this.finishNode(node, "VoidTypeAnnotation");

          case _types.types._null:
            this.next();
            return this.finishNode(node, "NullLiteralTypeAnnotation");

          case _types.types._this:
            this.next();
            return this.finishNode(node, "ThisTypeAnnotation");

          case _types.types.star:
            this.next();
            return this.finishNode(node, "ExistsTypeAnnotation");

          default:
            if (this.state.type.keyword === "typeof") {
              return this.flowParseTypeofType();
            } else if (this.state.type.keyword) {
              var label = this.state.type.label;
              this.next();
              return _get(_getPrototypeOf(_class2.prototype), "createIdentifier", this).call(this, node, label);
            }

        }

        throw this.unexpected();
      }
    }, {
      key: "flowParsePostfixType",
      value: function flowParsePostfixType() {
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        var type = this.flowParsePrimaryType();
        var seenOptionalIndexedAccess = false;

        while ((this.match(_types.types.bracketL) || this.match(_types.types.questionDot)) && !this.canInsertSemicolon()) {
          var node = this.startNodeAt(startPos, startLoc);
          var optional = this.eat(_types.types.questionDot);
          seenOptionalIndexedAccess = seenOptionalIndexedAccess || optional;
          this.expect(_types.types.bracketL);

          if (!optional && this.match(_types.types.bracketR)) {
            node.elementType = type;
            this.next(); // eat `]`

            type = this.finishNode(node, "ArrayTypeAnnotation");
          } else {
            node.objectType = type;
            node.indexType = this.flowParseType();
            this.expect(_types.types.bracketR);

            if (seenOptionalIndexedAccess) {
              node.optional = optional;
              type = this.finishNode(node, "OptionalIndexedAccessType");
            } else {
              type = this.finishNode(node, "IndexedAccessType");
            }
          }
        }

        return type;
      }
    }, {
      key: "flowParsePrefixType",
      value: function flowParsePrefixType() {
        var node = this.startNode();

        if (this.eat(_types.types.question)) {
          node.typeAnnotation = this.flowParsePrefixType();
          return this.finishNode(node, "NullableTypeAnnotation");
        } else {
          return this.flowParsePostfixType();
        }
      }
    }, {
      key: "flowParseAnonFunctionWithoutParens",
      value: function flowParseAnonFunctionWithoutParens() {
        var param = this.flowParsePrefixType();

        if (!this.state.noAnonFunctionType && this.eat(_types.types.arrow)) {
          // TODO: This should be a type error. Passing in a SourceLocation, and it expects a Position.
          var node = this.startNodeAt(param.start, param.loc.start);
          node.params = [this.reinterpretTypeAsFunctionTypeParam(param)];
          node.rest = null;
          node["this"] = null;
          node.returnType = this.flowParseType();
          node.typeParameters = null;
          return this.finishNode(node, "FunctionTypeAnnotation");
        }

        return param;
      }
    }, {
      key: "flowParseIntersectionType",
      value: function flowParseIntersectionType() {
        var node = this.startNode();
        this.eat(_types.types.bitwiseAND);
        var type = this.flowParseAnonFunctionWithoutParens();
        node.types = [type];

        while (this.eat(_types.types.bitwiseAND)) {
          node.types.push(this.flowParseAnonFunctionWithoutParens());
        }

        return node.types.length === 1 ? type : this.finishNode(node, "IntersectionTypeAnnotation");
      }
    }, {
      key: "flowParseUnionType",
      value: function flowParseUnionType() {
        var node = this.startNode();
        this.eat(_types.types.bitwiseOR);
        var type = this.flowParseIntersectionType();
        node.types = [type];

        while (this.eat(_types.types.bitwiseOR)) {
          node.types.push(this.flowParseIntersectionType());
        }

        return node.types.length === 1 ? type : this.finishNode(node, "UnionTypeAnnotation");
      }
    }, {
      key: "flowParseType",
      value: function flowParseType() {
        var oldInType = this.state.inType;
        this.state.inType = true;
        var type = this.flowParseUnionType();
        this.state.inType = oldInType;
        return type;
      }
    }, {
      key: "flowParseTypeOrImplicitInstantiation",
      value: function flowParseTypeOrImplicitInstantiation() {
        if (this.state.type === _types.types.name && this.state.value === "_") {
          var startPos = this.state.start;
          var startLoc = this.state.startLoc;
          var node = this.parseIdentifier();
          return this.flowParseGenericType(startPos, startLoc, node);
        } else {
          return this.flowParseType();
        }
      }
    }, {
      key: "flowParseTypeAnnotation",
      value: function flowParseTypeAnnotation() {
        var node = this.startNode();
        node.typeAnnotation = this.flowParseTypeInitialiser();
        return this.finishNode(node, "TypeAnnotation");
      }
    }, {
      key: "flowParseTypeAnnotatableIdentifier",
      value: function flowParseTypeAnnotatableIdentifier(allowPrimitiveOverride) {
        var ident = allowPrimitiveOverride ? this.parseIdentifier() : this.flowParseRestrictedIdentifier();

        if (this.match(_types.types.colon)) {
          ident.typeAnnotation = this.flowParseTypeAnnotation();
          this.resetEndLocation(ident);
        }

        return ident;
      }
    }, {
      key: "typeCastToParameter",
      value: function typeCastToParameter(node) {
        node.expression.typeAnnotation = node.typeAnnotation;
        this.resetEndLocation(node.expression, node.typeAnnotation.end, node.typeAnnotation.loc.end);
        return node.expression;
      }
    }, {
      key: "flowParseVariance",
      value: function flowParseVariance() {
        var variance = null;

        if (this.match(_types.types.plusMin)) {
          variance = this.startNode();

          if (this.state.value === "+") {
            variance.kind = "plus";
          } else {
            variance.kind = "minus";
          }

          this.next();
          this.finishNode(variance, "Variance");
        }

        return variance;
      } // ==================================
      // Overrides
      // ==================================

    }, {
      key: "parseFunctionBody",
      value: function parseFunctionBody(node, allowExpressionBody) {
        var _this4 = this;

        var isMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (allowExpressionBody) {
          return this.forwardNoArrowParamsConversionAt(node, function () {
            return _get(_getPrototypeOf(_class2.prototype), "parseFunctionBody", _this4).call(_this4, node, true, isMethod);
          });
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseFunctionBody", this).call(this, node, false, isMethod);
      }
    }, {
      key: "parseFunctionBodyAndFinish",
      value: function parseFunctionBodyAndFinish(node, type) {
        var isMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (this.match(_types.types.colon)) {
          var typeNode = this.startNode();

          var _this$flowParseTypeAn3 = this.flowParseTypeAndPredicateInitialiser();

          var _this$flowParseTypeAn4 = _slicedToArray(_this$flowParseTypeAn3, 2);

          // $FlowFixMe (destructuring not supported yet)
          typeNode.typeAnnotation = _this$flowParseTypeAn4[0];
          // $FlowFixMe (destructuring not supported yet)
          node.predicate = _this$flowParseTypeAn4[1];
          node.returnType = typeNode.typeAnnotation ? this.finishNode(typeNode, "TypeAnnotation") : null;
        }

        _get(_getPrototypeOf(_class2.prototype), "parseFunctionBodyAndFinish", this).call(this, node, type, isMethod);
      } // interfaces and enums

    }, {
      key: "parseStatement",
      value: function parseStatement(context, topLevel) {
        // strict mode handling of `interface` since it's a reserved word
        if (this.state.strict && this.match(_types.types.name) && this.state.value === "interface") {
          var lookahead = this.lookahead();

          if (lookahead.type === _types.types.name || (0, _identifier.isKeyword)(lookahead.value)) {
            var node = this.startNode();
            this.next();
            return this.flowParseInterface(node);
          }
        } else if (this.shouldParseEnums() && this.isContextual("enum")) {
          var _node = this.startNode();

          this.next();
          return this.flowParseEnumDeclaration(_node);
        }

        var stmt = _get(_getPrototypeOf(_class2.prototype), "parseStatement", this).call(this, context, topLevel); // We will parse a flow pragma in any comment before the first statement.


        if (this.flowPragma === undefined && !this.isValidDirective(stmt)) {
          this.flowPragma = null;
        }

        return stmt;
      } // declares, interfaces and type aliases

    }, {
      key: "parseExpressionStatement",
      value: function parseExpressionStatement(node, expr) {
        if (expr.type === "Identifier") {
          if (expr.name === "declare") {
            if (this.match(_types.types._class) || this.match(_types.types.name) || this.match(_types.types._function) || this.match(_types.types._var) || this.match(_types.types._export)) {
              return this.flowParseDeclare(node);
            }
          } else if (this.match(_types.types.name)) {
            if (expr.name === "interface") {
              return this.flowParseInterface(node);
            } else if (expr.name === "type") {
              return this.flowParseTypeAlias(node);
            } else if (expr.name === "opaque") {
              return this.flowParseOpaqueType(node, false);
            }
          }
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseExpressionStatement", this).call(this, node, expr);
      } // export type

    }, {
      key: "shouldParseExportDeclaration",
      value: function shouldParseExportDeclaration() {
        return this.isContextual("type") || this.isContextual("interface") || this.isContextual("opaque") || this.shouldParseEnums() && this.isContextual("enum") || _get(_getPrototypeOf(_class2.prototype), "shouldParseExportDeclaration", this).call(this);
      }
    }, {
      key: "isExportDefaultSpecifier",
      value: function isExportDefaultSpecifier() {
        if (this.match(_types.types.name) && (this.state.value === "type" || this.state.value === "interface" || this.state.value === "opaque" || this.shouldParseEnums() && this.state.value === "enum")) {
          return false;
        }

        return _get(_getPrototypeOf(_class2.prototype), "isExportDefaultSpecifier", this).call(this);
      }
    }, {
      key: "parseExportDefaultExpression",
      value: function parseExportDefaultExpression() {
        if (this.shouldParseEnums() && this.isContextual("enum")) {
          var node = this.startNode();
          this.next();
          return this.flowParseEnumDeclaration(node);
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseExportDefaultExpression", this).call(this);
      }
    }, {
      key: "parseConditional",
      value: function parseConditional(expr, startPos, startLoc, refExpressionErrors) {
        var _this5 = this;

        if (!this.match(_types.types.question)) return expr; // only use the expensive "tryParse" method if there is a question mark
        // and if we come from inside parens

        if (this.state.maybeInArrowParameters) {
          var result = this.tryParse(function () {
            return _get(_getPrototypeOf(_class2.prototype), "parseConditional", _this5).call(_this5, expr, startPos, startLoc);
          });

          if (!result.node) {
            if (result.error) {
              /*:: invariant(refExpressionErrors != null) */
              _get(_getPrototypeOf(_class2.prototype), "setOptionalParametersError", this).call(this, refExpressionErrors, result.error);
            }

            return expr;
          }

          if (result.error) this.state = result.failState;
          return result.node;
        }

        this.expect(_types.types.question);
        var state = this.state.clone();
        var originalNoArrowAt = this.state.noArrowAt;
        var node = this.startNodeAt(startPos, startLoc);

        var _this$tryParseConditi = this.tryParseConditionalConsequent(),
            consequent = _this$tryParseConditi.consequent,
            failed = _this$tryParseConditi.failed;

        var _this$getArrowLikeExp = this.getArrowLikeExpressions(consequent),
            _this$getArrowLikeExp2 = _slicedToArray(_this$getArrowLikeExp, 2),
            valid = _this$getArrowLikeExp2[0],
            invalid = _this$getArrowLikeExp2[1];

        if (failed || invalid.length > 0) {
          var noArrowAt = _toConsumableArray(originalNoArrowAt);

          if (invalid.length > 0) {
            this.state = state;
            this.state.noArrowAt = noArrowAt;

            for (var i = 0; i < invalid.length; i++) {
              noArrowAt.push(invalid[i].start);
            }

            var _this$tryParseConditi2 = this.tryParseConditionalConsequent();

            consequent = _this$tryParseConditi2.consequent;
            failed = _this$tryParseConditi2.failed;

            var _this$getArrowLikeExp3 = this.getArrowLikeExpressions(consequent);

            var _this$getArrowLikeExp4 = _slicedToArray(_this$getArrowLikeExp3, 2);

            valid = _this$getArrowLikeExp4[0];
            invalid = _this$getArrowLikeExp4[1];
          }

          if (failed && valid.length > 1) {
            // if there are two or more possible correct ways of parsing, throw an
            // error.
            // e.g.   Source: a ? (b): c => (d): e => f
            //      Result 1: a ? b : (c => ((d): e => f))
            //      Result 2: a ? ((b): c => d) : (e => f)
            this.raise(state.start, FlowErrors.AmbiguousConditionalArrow);
          }

          if (failed && valid.length === 1) {
            this.state = state;
            this.state.noArrowAt = noArrowAt.concat(valid[0].start);

            var _this$tryParseConditi3 = this.tryParseConditionalConsequent();

            consequent = _this$tryParseConditi3.consequent;
            failed = _this$tryParseConditi3.failed;
          }
        }

        this.getArrowLikeExpressions(consequent, true);
        this.state.noArrowAt = originalNoArrowAt;
        this.expect(_types.types.colon);
        node.test = expr;
        node.consequent = consequent;
        node.alternate = this.forwardNoArrowParamsConversionAt(node, function () {
          return _this5.parseMaybeAssign(undefined, undefined);
        });
        return this.finishNode(node, "ConditionalExpression");
      }
    }, {
      key: "tryParseConditionalConsequent",
      value: function tryParseConditionalConsequent() {
        this.state.noArrowParamsConversionAt.push(this.state.start);
        var consequent = this.parseMaybeAssignAllowIn();
        var failed = !this.match(_types.types.colon);
        this.state.noArrowParamsConversionAt.pop();
        return {
          consequent: consequent,
          failed: failed
        };
      } // Given an expression, walks through out its arrow functions whose body is
      // an expression and through out conditional expressions. It returns every
      // function which has been parsed with a return type but could have been
      // parenthesized expressions.
      // These functions are separated into two arrays: one containing the ones
      // whose parameters can be converted to assignable lists, one containing the
      // others.

    }, {
      key: "getArrowLikeExpressions",
      value: function getArrowLikeExpressions(node, disallowInvalid) {
        var _this6 = this;

        var stack = [node];
        var arrows = [];

        while (stack.length !== 0) {
          var _node2 = stack.pop();

          if (_node2.type === "ArrowFunctionExpression") {
            if (_node2.typeParameters || !_node2.returnType) {
              // This is an arrow expression without ambiguity, so check its parameters
              this.finishArrowValidation(_node2);
            } else {
              arrows.push(_node2);
            }

            stack.push(_node2.body);
          } else if (_node2.type === "ConditionalExpression") {
            stack.push(_node2.consequent);
            stack.push(_node2.alternate);
          }
        }

        if (disallowInvalid) {
          arrows.forEach(function (node) {
            return _this6.finishArrowValidation(node);
          });
          return [arrows, []];
        }

        return partition(arrows, function (node) {
          return node.params.every(function (param) {
            return _this6.isAssignable(param, true);
          });
        });
      }
    }, {
      key: "finishArrowValidation",
      value: function finishArrowValidation(node) {
        var _node$extra;

        this.toAssignableList( // node.params is Expression[] instead of $ReadOnlyArray<Pattern> because it
        // has not been converted yet.
        node.params, (_node$extra = node.extra) === null || _node$extra === void 0 ? void 0 : _node$extra.trailingComma,
        /* isLHS */
        false); // Enter scope, as checkParams defines bindings

        this.scope.enter(_scopeflags.SCOPE_FUNCTION | _scopeflags.SCOPE_ARROW); // Use super's method to force the parameters to be checked

        _get(_getPrototypeOf(_class2.prototype), "checkParams", this).call(this, node, false, true);

        this.scope.exit();
      }
    }, {
      key: "forwardNoArrowParamsConversionAt",
      value: function forwardNoArrowParamsConversionAt(node, parse) {
        var result;

        if (this.state.noArrowParamsConversionAt.indexOf(node.start) !== -1) {
          this.state.noArrowParamsConversionAt.push(this.state.start);
          result = parse();
          this.state.noArrowParamsConversionAt.pop();
        } else {
          result = parse();
        }

        return result;
      }
    }, {
      key: "parseParenItem",
      value: function parseParenItem(node, startPos, startLoc) {
        node = _get(_getPrototypeOf(_class2.prototype), "parseParenItem", this).call(this, node, startPos, startLoc);

        if (this.eat(_types.types.question)) {
          node.optional = true; // Include questionmark in location of node
          // Don't use this.finishNode() as otherwise we might process comments twice and
          // include already consumed parens

          this.resetEndLocation(node);
        }

        if (this.match(_types.types.colon)) {
          var typeCastNode = this.startNodeAt(startPos, startLoc);
          typeCastNode.expression = node;
          typeCastNode.typeAnnotation = this.flowParseTypeAnnotation();
          return this.finishNode(typeCastNode, "TypeCastExpression");
        }

        return node;
      }
    }, {
      key: "assertModuleNodeAllowed",
      value: function assertModuleNodeAllowed(node) {
        if (node.type === "ImportDeclaration" && (node.importKind === "type" || node.importKind === "typeof") || node.type === "ExportNamedDeclaration" && node.exportKind === "type" || node.type === "ExportAllDeclaration" && node.exportKind === "type") {
          // Allow Flowtype imports and exports in all conditions because
          // Flow itself does not care about 'sourceType'.
          return;
        }

        _get(_getPrototypeOf(_class2.prototype), "assertModuleNodeAllowed", this).call(this, node);
      }
    }, {
      key: "parseExport",
      value: function parseExport(node) {
        var decl = _get(_getPrototypeOf(_class2.prototype), "parseExport", this).call(this, node);

        if (decl.type === "ExportNamedDeclaration" || decl.type === "ExportAllDeclaration") {
          decl.exportKind = decl.exportKind || "value";
        }

        return decl;
      }
    }, {
      key: "parseExportDeclaration",
      value: function parseExportDeclaration(node) {
        if (this.isContextual("type")) {
          node.exportKind = "type";
          var declarationNode = this.startNode();
          this.next();

          if (this.match(_types.types.braceL)) {
            // export type { foo, bar };
            node.specifiers = this.parseExportSpecifiers();
            this.parseExportFrom(node);
            return null;
          } else {
            // export type Foo = Bar;
            return this.flowParseTypeAlias(declarationNode);
          }
        } else if (this.isContextual("opaque")) {
          node.exportKind = "type";

          var _declarationNode = this.startNode();

          this.next(); // export opaque type Foo = Bar;

          return this.flowParseOpaqueType(_declarationNode, false);
        } else if (this.isContextual("interface")) {
          node.exportKind = "type";

          var _declarationNode2 = this.startNode();

          this.next();
          return this.flowParseInterface(_declarationNode2);
        } else if (this.shouldParseEnums() && this.isContextual("enum")) {
          node.exportKind = "value";

          var _declarationNode3 = this.startNode();

          this.next();
          return this.flowParseEnumDeclaration(_declarationNode3);
        } else {
          return _get(_getPrototypeOf(_class2.prototype), "parseExportDeclaration", this).call(this, node);
        }
      }
    }, {
      key: "eatExportStar",
      value: function eatExportStar(node) {
        if (_get(_getPrototypeOf(_class2.prototype), "eatExportStar", this).apply(this, arguments)) return true;

        if (this.isContextual("type") && this.lookahead().type === _types.types.star) {
          node.exportKind = "type";
          this.next();
          this.next();
          return true;
        }

        return false;
      }
    }, {
      key: "maybeParseExportNamespaceSpecifier",
      value: function maybeParseExportNamespaceSpecifier(node) {
        var pos = this.state.start;

        var hasNamespace = _get(_getPrototypeOf(_class2.prototype), "maybeParseExportNamespaceSpecifier", this).call(this, node);

        if (hasNamespace && node.exportKind === "type") {
          this.unexpected(pos);
        }

        return hasNamespace;
      }
    }, {
      key: "parseClassId",
      value: function parseClassId(node, isStatement, optionalId) {
        _get(_getPrototypeOf(_class2.prototype), "parseClassId", this).call(this, node, isStatement, optionalId);

        if (this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterDeclaration();
        }
      }
    }, {
      key: "parseClassMember",
      value: function parseClassMember(classBody, member, state) {
        var pos = this.state.start;

        if (this.isContextual("declare")) {
          if (this.parseClassMemberFromModifier(classBody, member)) {
            // 'declare' is a class element name
            return;
          }

          member.declare = true;
        }

        _get(_getPrototypeOf(_class2.prototype), "parseClassMember", this).call(this, classBody, member, state);

        if (member.declare) {
          if (member.type !== "ClassProperty" && member.type !== "ClassPrivateProperty" && member.type !== "PropertyDefinition" // Used by estree plugin
          ) {
              this.raise(pos, FlowErrors.DeclareClassElement);
            } else if (member.value) {
            this.raise(member.value.start, FlowErrors.DeclareClassFieldInitializer);
          }
        }
      }
    }, {
      key: "isIterator",
      value: function isIterator(word) {
        return word === "iterator" || word === "asyncIterator";
      }
    }, {
      key: "readIterator",
      value: function readIterator() {
        var word = _get(_getPrototypeOf(_class2.prototype), "readWord1", this).call(this);

        var fullWord = "@@" + word; // Allow @@iterator and @@asyncIterator as a identifier only inside type

        if (!this.isIterator(word) || !this.state.inType) {
          this.raise(this.state.pos, _error.Errors.InvalidIdentifier, fullWord);
        }

        this.finishToken(_types.types.name, fullWord);
      } // ensure that inside flow types, we bypass the jsx parser plugin

    }, {
      key: "getTokenFromCode",
      value: function getTokenFromCode(code) {
        var next = this.input.charCodeAt(this.state.pos + 1);

        if (code === charCodes.leftCurlyBrace && next === charCodes.verticalBar) {
          return this.finishOp(_types.types.braceBarL, 2);
        } else if (this.state.inType && (code === charCodes.greaterThan || code === charCodes.lessThan)) {
          return this.finishOp(_types.types.relational, 1);
        } else if (this.state.inType && code === charCodes.questionMark) {
          if (next === charCodes.dot) {
            return this.finishOp(_types.types.questionDot, 2);
          } // allow double nullable types in Flow: ??string


          return this.finishOp(_types.types.question, 1);
        } else if ((0, _identifier.isIteratorStart)(code, next)) {
          this.state.pos += 2; // eat "@@"

          return this.readIterator();
        } else {
          return _get(_getPrototypeOf(_class2.prototype), "getTokenFromCode", this).call(this, code);
        }
      }
    }, {
      key: "isAssignable",
      value: function isAssignable(node, isBinding) {
        var _this7 = this;

        switch (node.type) {
          case "Identifier":
          case "ObjectPattern":
          case "ArrayPattern":
          case "AssignmentPattern":
            return true;

          case "ObjectExpression":
            {
              var last = node.properties.length - 1;
              return node.properties.every(function (prop, i) {
                return prop.type !== "ObjectMethod" && (i === last || prop.type === "SpreadElement") && _this7.isAssignable(prop);
              });
            }

          case "ObjectProperty":
            return this.isAssignable(node.value);

          case "SpreadElement":
            return this.isAssignable(node.argument);

          case "ArrayExpression":
            return node.elements.every(function (element) {
              return _this7.isAssignable(element);
            });

          case "AssignmentExpression":
            return node.operator === "=";

          case "ParenthesizedExpression":
          case "TypeCastExpression":
            return this.isAssignable(node.expression);

          case "MemberExpression":
          case "OptionalMemberExpression":
            return !isBinding;

          default:
            return false;
        }
      }
    }, {
      key: "toAssignable",
      value: function toAssignable(node) {
        var isLHS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (node.type === "TypeCastExpression") {
          return _get(_getPrototypeOf(_class2.prototype), "toAssignable", this).call(this, this.typeCastToParameter(node), isLHS);
        } else {
          return _get(_getPrototypeOf(_class2.prototype), "toAssignable", this).call(this, node, isLHS);
        }
      } // turn type casts that we found in function parameter head into type annotated params

    }, {
      key: "toAssignableList",
      value: function toAssignableList(exprList, trailingCommaPos, isLHS) {
        for (var i = 0; i < exprList.length; i++) {
          var expr = exprList[i];

          if ((expr === null || expr === void 0 ? void 0 : expr.type) === "TypeCastExpression") {
            exprList[i] = this.typeCastToParameter(expr);
          }
        }

        return _get(_getPrototypeOf(_class2.prototype), "toAssignableList", this).call(this, exprList, trailingCommaPos, isLHS);
      } // this is a list of nodes, from something like a call expression, we need to filter the
      // type casts that we've found that are illegal in this context

    }, {
      key: "toReferencedList",
      value: function toReferencedList(exprList, isParenthesizedExpr) {
        for (var i = 0; i < exprList.length; i++) {
          var _expr$extra;

          var expr = exprList[i];

          if (expr && expr.type === "TypeCastExpression" && !((_expr$extra = expr.extra) !== null && _expr$extra !== void 0 && _expr$extra.parenthesized) && (exprList.length > 1 || !isParenthesizedExpr)) {
            this.raise(expr.typeAnnotation.start, FlowErrors.TypeCastInPattern);
          }
        }

        return exprList;
      }
    }, {
      key: "parseArrayLike",
      value: function parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
        var node = _get(_getPrototypeOf(_class2.prototype), "parseArrayLike", this).call(this, close, canBePattern, isTuple, refExpressionErrors); // This could be an array pattern:
        //   ([a: string, b: string]) => {}
        // In this case, we don't have to call toReferencedList. We will
        // call it, if needed, when we are sure that it is a parenthesized
        // expression by calling toReferencedListDeep.


        if (canBePattern && !this.state.maybeInArrowParameters) {
          this.toReferencedList(node.elements);
        }

        return node;
      }
    }, {
      key: "checkLVal",
      value: function checkLVal(expr) {
        if (expr.type !== "TypeCastExpression") {
          var _get2;

          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          return (_get2 = _get(_getPrototypeOf(_class2.prototype), "checkLVal", this)).call.apply(_get2, [this, expr].concat(args));
        }
      } // parse class property type annotations

    }, {
      key: "parseClassProperty",
      value: function parseClassProperty(node) {
        if (this.match(_types.types.colon)) {
          node.typeAnnotation = this.flowParseTypeAnnotation();
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseClassProperty", this).call(this, node);
      }
    }, {
      key: "parseClassPrivateProperty",
      value: function parseClassPrivateProperty(node) {
        if (this.match(_types.types.colon)) {
          node.typeAnnotation = this.flowParseTypeAnnotation();
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseClassPrivateProperty", this).call(this, node);
      } // determine whether or not we're currently in the position where a class method would appear

    }, {
      key: "isClassMethod",
      value: function isClassMethod() {
        return this.isRelational("<") || _get(_getPrototypeOf(_class2.prototype), "isClassMethod", this).call(this);
      } // determine whether or not we're currently in the position where a class property would appear

    }, {
      key: "isClassProperty",
      value: function isClassProperty() {
        return this.match(_types.types.colon) || _get(_getPrototypeOf(_class2.prototype), "isClassProperty", this).call(this);
      }
    }, {
      key: "isNonstaticConstructor",
      value: function isNonstaticConstructor(method) {
        return !this.match(_types.types.colon) && _get(_getPrototypeOf(_class2.prototype), "isNonstaticConstructor", this).call(this, method);
      } // parse type parameters for class methods

    }, {
      key: "pushClassMethod",
      value: function pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
        if (method.variance) {
          this.unexpected(method.variance.start);
        }

        delete method.variance;

        if (this.isRelational("<")) {
          method.typeParameters = this.flowParseTypeParameterDeclaration();
        }

        _get(_getPrototypeOf(_class2.prototype), "pushClassMethod", this).call(this, classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);

        if (method.params && isConstructor) {
          var params = method.params;

          if (params.length > 0 && this.isThisParam(params[0])) {
            this.raise(method.start, FlowErrors.ThisParamBannedInConstructor);
          } // estree support

        } else if ( // $FlowFixMe flow does not know about the face that estree can replace ClassMethod with MethodDefinition
        method.type === "MethodDefinition" && isConstructor && method.value.params) {
          var _params = method.value.params;

          if (_params.length > 0 && this.isThisParam(_params[0])) {
            this.raise(method.start, FlowErrors.ThisParamBannedInConstructor);
          }
        }
      }
    }, {
      key: "pushClassPrivateMethod",
      value: function pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
        if (method.variance) {
          this.unexpected(method.variance.start);
        }

        delete method.variance;

        if (this.isRelational("<")) {
          method.typeParameters = this.flowParseTypeParameterDeclaration();
        }

        _get(_getPrototypeOf(_class2.prototype), "pushClassPrivateMethod", this).call(this, classBody, method, isGenerator, isAsync);
      } // parse a the super class type parameters and implements

    }, {
      key: "parseClassSuper",
      value: function parseClassSuper(node) {
        _get(_getPrototypeOf(_class2.prototype), "parseClassSuper", this).call(this, node);

        if (node.superClass && this.isRelational("<")) {
          node.superTypeParameters = this.flowParseTypeParameterInstantiation();
        }

        if (this.isContextual("implements")) {
          this.next();
          var implemented = node["implements"] = [];

          do {
            var _node3 = this.startNode();

            _node3.id = this.flowParseRestrictedIdentifier(
            /*liberal*/
            true);

            if (this.isRelational("<")) {
              _node3.typeParameters = this.flowParseTypeParameterInstantiation();
            } else {
              _node3.typeParameters = null;
            }

            implemented.push(this.finishNode(_node3, "ClassImplements"));
          } while (this.eat(_types.types.comma));
        }
      }
    }, {
      key: "checkGetterSetterParams",
      value: function checkGetterSetterParams(method) {
        _get(_getPrototypeOf(_class2.prototype), "checkGetterSetterParams", this).call(this, method);

        var params = this.getObjectOrClassMethodParams(method);

        if (params.length > 0) {
          var param = params[0];

          if (this.isThisParam(param) && method.kind === "get") {
            this.raise(param.start, FlowErrors.GetterMayNotHaveThisParam);
          } else if (this.isThisParam(param)) {
            this.raise(param.start, FlowErrors.SetterMayNotHaveThisParam);
          }
        }
      }
    }, {
      key: "parsePropertyName",
      value: function parsePropertyName(node, isPrivateNameAllowed) {
        var variance = this.flowParseVariance();

        var key = _get(_getPrototypeOf(_class2.prototype), "parsePropertyName", this).call(this, node, isPrivateNameAllowed); // $FlowIgnore ("variance" not defined on TsNamedTypeElementBase)


        node.variance = variance;
        return key;
      } // parse type parameters for object method shorthand

    }, {
      key: "parseObjPropValue",
      value: function parseObjPropValue(prop, startPos, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
        if (prop.variance) {
          this.unexpected(prop.variance.start);
        }

        delete prop.variance;
        var typeParameters; // method shorthand

        if (this.isRelational("<") && !isAccessor) {
          typeParameters = this.flowParseTypeParameterDeclaration();
          if (!this.match(_types.types.parenL)) this.unexpected();
        }

        _get(_getPrototypeOf(_class2.prototype), "parseObjPropValue", this).call(this, prop, startPos, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors); // add typeParameters if we found them


        if (typeParameters) {
          (prop.value || prop).typeParameters = typeParameters;
        }
      }
    }, {
      key: "parseAssignableListItemTypes",
      value: function parseAssignableListItemTypes(param) {
        if (this.eat(_types.types.question)) {
          if (param.type !== "Identifier") {
            this.raise(param.start, FlowErrors.OptionalBindingPattern);
          }

          if (this.isThisParam(param)) {
            this.raise(param.start, FlowErrors.ThisParamMayNotBeOptional);
          }

          param.optional = true;
        }

        if (this.match(_types.types.colon)) {
          param.typeAnnotation = this.flowParseTypeAnnotation();
        } else if (this.isThisParam(param)) {
          this.raise(param.start, FlowErrors.ThisParamAnnotationRequired);
        }

        if (this.match(_types.types.eq) && this.isThisParam(param)) {
          this.raise(param.start, FlowErrors.ThisParamNoDefault);
        }

        this.resetEndLocation(param);
        return param;
      }
    }, {
      key: "parseMaybeDefault",
      value: function parseMaybeDefault(startPos, startLoc, left) {
        var node = _get(_getPrototypeOf(_class2.prototype), "parseMaybeDefault", this).call(this, startPos, startLoc, left);

        if (node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start) {
          this.raise(node.typeAnnotation.start, FlowErrors.TypeBeforeInitializer);
        }

        return node;
      }
    }, {
      key: "shouldParseDefaultImport",
      value: function shouldParseDefaultImport(node) {
        if (!hasTypeImportKind(node)) {
          return _get(_getPrototypeOf(_class2.prototype), "shouldParseDefaultImport", this).call(this, node);
        }

        return isMaybeDefaultImport(this.state);
      }
    }, {
      key: "parseImportSpecifierLocal",
      value: function parseImportSpecifierLocal(node, specifier, type, contextDescription) {
        specifier.local = hasTypeImportKind(node) ? this.flowParseRestrictedIdentifier(
        /* liberal */
        true,
        /* declaration */
        true) : this.parseIdentifier();
        this.checkLVal(specifier.local, contextDescription, _scopeflags.BIND_LEXICAL);
        node.specifiers.push(this.finishNode(specifier, type));
      } // parse typeof and type imports

    }, {
      key: "maybeParseDefaultImportSpecifier",
      value: function maybeParseDefaultImportSpecifier(node) {
        node.importKind = "value";
        var kind = null;

        if (this.match(_types.types._typeof)) {
          kind = "typeof";
        } else if (this.isContextual("type")) {
          kind = "type";
        }

        if (kind) {
          var lh = this.lookahead(); // import type * is not allowed

          if (kind === "type" && lh.type === _types.types.star) {
            this.unexpected(lh.start);
          }

          if (isMaybeDefaultImport(lh) || lh.type === _types.types.braceL || lh.type === _types.types.star) {
            this.next();
            node.importKind = kind;
          }
        }

        return _get(_getPrototypeOf(_class2.prototype), "maybeParseDefaultImportSpecifier", this).call(this, node);
      } // parse import-type/typeof shorthand

    }, {
      key: "parseImportSpecifier",
      value: function parseImportSpecifier(node) {
        var specifier = this.startNode();
        var firstIdentIsString = this.match(_types.types.string);
        var firstIdent = this.parseModuleExportName();
        var specifierTypeKind = null;

        if (firstIdent.type === "Identifier") {
          if (firstIdent.name === "type") {
            specifierTypeKind = "type";
          } else if (firstIdent.name === "typeof") {
            specifierTypeKind = "typeof";
          }
        }

        var isBinding = false;

        if (this.isContextual("as") && !this.isLookaheadContextual("as")) {
          var as_ident = this.parseIdentifier(true);

          if (specifierTypeKind !== null && !this.match(_types.types.name) && !this.state.type.keyword) {
            // `import {type as ,` or `import {type as }`
            specifier.imported = as_ident;
            specifier.importKind = specifierTypeKind;
            specifier.local = as_ident.__clone();
          } else {
            // `import {type as foo`
            specifier.imported = firstIdent;
            specifier.importKind = null;
            specifier.local = this.parseIdentifier();
          }
        } else if (specifierTypeKind !== null && (this.match(_types.types.name) || this.state.type.keyword)) {
          // `import {type foo`
          specifier.imported = this.parseIdentifier(true);
          specifier.importKind = specifierTypeKind;

          if (this.eatContextual("as")) {
            specifier.local = this.parseIdentifier();
          } else {
            isBinding = true;
            specifier.local = specifier.imported.__clone();
          }
        } else {
          if (firstIdentIsString) {
            /*:: invariant(firstIdent instanceof N.StringLiteral) */
            throw this.raise(specifier.start, _error.Errors.ImportBindingIsString, firstIdent.value);
          }
          /*:: invariant(firstIdent instanceof N.Node) */


          isBinding = true;
          specifier.imported = firstIdent;
          specifier.importKind = null;
          specifier.local = specifier.imported.__clone();
        }

        var nodeIsTypeImport = hasTypeImportKind(node);
        var specifierIsTypeImport = hasTypeImportKind(specifier);

        if (nodeIsTypeImport && specifierIsTypeImport) {
          this.raise(specifier.start, FlowErrors.ImportTypeShorthandOnlyInPureImport);
        }

        if (nodeIsTypeImport || specifierIsTypeImport) {
          this.checkReservedType(specifier.local.name, specifier.local.start,
          /* declaration */
          true);
        }

        if (isBinding && !nodeIsTypeImport && !specifierIsTypeImport) {
          this.checkReservedWord(specifier.local.name, specifier.start, true, true);
        }

        this.checkLVal(specifier.local, "import specifier", _scopeflags.BIND_LEXICAL);
        node.specifiers.push(this.finishNode(specifier, "ImportSpecifier"));
      }
    }, {
      key: "parseBindingAtom",
      value: function parseBindingAtom() {
        switch (this.state.type) {
          case _types.types._this:
            // "this" may be the name of a parameter, so allow it.
            return this.parseIdentifier(
            /* liberal */
            true);

          default:
            return _get(_getPrototypeOf(_class2.prototype), "parseBindingAtom", this).call(this);
        }
      } // parse function type parameters - function foo<T>() {}

    }, {
      key: "parseFunctionParams",
      value: function parseFunctionParams(node, allowModifiers) {
        // $FlowFixMe
        var kind = node.kind;

        if (kind !== "get" && kind !== "set" && this.isRelational("<")) {
          node.typeParameters = this.flowParseTypeParameterDeclaration();
        }

        _get(_getPrototypeOf(_class2.prototype), "parseFunctionParams", this).call(this, node, allowModifiers);
      } // parse flow type annotations on variable declarator heads - let foo: string = bar

    }, {
      key: "parseVarId",
      value: function parseVarId(decl, kind) {
        _get(_getPrototypeOf(_class2.prototype), "parseVarId", this).call(this, decl, kind);

        if (this.match(_types.types.colon)) {
          decl.id.typeAnnotation = this.flowParseTypeAnnotation();
          this.resetEndLocation(decl.id); // set end position to end of type
        }
      } // parse the return type of an async arrow function - let foo = (async (): number => {});

    }, {
      key: "parseAsyncArrowFromCallExpression",
      value: function parseAsyncArrowFromCallExpression(node, call) {
        if (this.match(_types.types.colon)) {
          var oldNoAnonFunctionType = this.state.noAnonFunctionType;
          this.state.noAnonFunctionType = true;
          node.returnType = this.flowParseTypeAnnotation();
          this.state.noAnonFunctionType = oldNoAnonFunctionType;
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseAsyncArrowFromCallExpression", this).call(this, node, call);
      } // todo description

    }, {
      key: "shouldParseAsyncArrow",
      value: function shouldParseAsyncArrow() {
        return this.match(_types.types.colon) || _get(_getPrototypeOf(_class2.prototype), "shouldParseAsyncArrow", this).call(this);
      } // We need to support type parameter declarations for arrow functions. This
      // is tricky. There are three situations we need to handle
      //
      // 1. This is either JSX or an arrow function. We'll try JSX first. If that
      //    fails, we'll try an arrow function. If that fails, we'll throw the JSX
      //    error.
      // 2. This is an arrow function. We'll parse the type parameter declaration,
      //    parse the rest, make sure the rest is an arrow function, and go from
      //    there
      // 3. This is neither. Just call the super method

    }, {
      key: "parseMaybeAssign",
      value: function parseMaybeAssign(refExpressionErrors, afterLeftParse) {
        var _this8 = this,
            _jsx;

        var state = null;
        var jsx;

        if (this.hasPlugin("jsx") && (this.match(_types.types.jsxTagStart) || this.isRelational("<"))) {
          state = this.state.clone();
          jsx = this.tryParse(function () {
            return _get(_getPrototypeOf(_class2.prototype), "parseMaybeAssign", _this8).call(_this8, refExpressionErrors, afterLeftParse);
          }, state);
          /*:: invariant(!jsx.aborted) */

          /*:: invariant(jsx.node != null) */

          if (!jsx.error) return jsx.node; // Remove `tc.j_expr` and `tc.j_oTag` from context added
          // by parsing `jsxTagStart` to stop the JSX plugin from
          // messing with the tokens

          var context = this.state.context;
          var curContext = context[context.length - 1];

          if (curContext === _context.types.j_oTag) {
            context.length -= 2;
          } else if (curContext === _context.types.j_expr) {
            context.length -= 1;
          }
        }

        if ((_jsx = jsx) !== null && _jsx !== void 0 && _jsx.error || this.isRelational("<")) {
          var _jsx2, _jsx3;

          state = state || this.state.clone();
          var typeParameters;
          var arrow = this.tryParse(function (abort) {
            var _arrowExpression$extr;

            typeParameters = _this8.flowParseTypeParameterDeclaration();

            var arrowExpression = _this8.forwardNoArrowParamsConversionAt(typeParameters, function () {
              var result = _get(_getPrototypeOf(_class2.prototype), "parseMaybeAssign", _this8).call(_this8, refExpressionErrors, afterLeftParse);

              _this8.resetStartLocationFromNode(result, typeParameters);

              return result;
            }); // <T>(() => {}: any);


            if (arrowExpression.type !== "ArrowFunctionExpression" && (_arrowExpression$extr = arrowExpression.extra) !== null && _arrowExpression$extr !== void 0 && _arrowExpression$extr.parenthesized) {
              abort();
            } // The above can return a TypeCastExpression when the arrow
            // expression is not wrapped in parens. See also `this.parseParenItem`.


            var expr = _this8.maybeUnwrapTypeCastExpression(arrowExpression);

            expr.typeParameters = typeParameters;

            _this8.resetStartLocationFromNode(expr, typeParameters);

            return arrowExpression;
          }, state);
          var arrowExpression = null;

          if (arrow.node && this.maybeUnwrapTypeCastExpression(arrow.node).type === "ArrowFunctionExpression") {
            if (!arrow.error && !arrow.aborted) {
              // <T> async () => {}
              if (arrow.node.async) {
                /*:: invariant(typeParameters) */
                this.raise(typeParameters.start, FlowErrors.UnexpectedTypeParameterBeforeAsyncArrowFunction);
              }

              return arrow.node;
            }

            arrowExpression = arrow.node;
          } // If we are here, both JSX and Flow parsing attempts failed.
          // Give the precedence to the JSX error, except if JSX had an
          // unrecoverable error while Flow didn't.
          // If the error is recoverable, we can only re-report it if there is
          // a node we can return.


          if ((_jsx2 = jsx) !== null && _jsx2 !== void 0 && _jsx2.node) {
            /*:: invariant(jsx.failState) */
            this.state = jsx.failState;
            return jsx.node;
          }

          if (arrowExpression) {
            /*:: invariant(arrow.failState) */
            this.state = arrow.failState;
            return arrowExpression;
          }

          if ((_jsx3 = jsx) !== null && _jsx3 !== void 0 && _jsx3.thrown) throw jsx.error;
          if (arrow.thrown) throw arrow.error;
          /*:: invariant(typeParameters) */

          throw this.raise(typeParameters.start, FlowErrors.UnexpectedTokenAfterTypeParameter);
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseMaybeAssign", this).call(this, refExpressionErrors, afterLeftParse);
      } // handle return types for arrow functions

    }, {
      key: "parseArrow",
      value: function parseArrow(node) {
        var _this9 = this;

        if (this.match(_types.types.colon)) {
          var result = this.tryParse(function () {
            var oldNoAnonFunctionType = _this9.state.noAnonFunctionType;
            _this9.state.noAnonFunctionType = true;

            var typeNode = _this9.startNode();

            var _this9$flowParseTypeA = _this9.flowParseTypeAndPredicateInitialiser();

            var _this9$flowParseTypeA2 = _slicedToArray(_this9$flowParseTypeA, 2);

            // $FlowFixMe (destructuring not supported yet)
            typeNode.typeAnnotation = _this9$flowParseTypeA2[0];
            // $FlowFixMe (destructuring not supported yet)
            node.predicate = _this9$flowParseTypeA2[1];
            _this9.state.noAnonFunctionType = oldNoAnonFunctionType;
            if (_this9.canInsertSemicolon()) _this9.unexpected();
            if (!_this9.match(_types.types.arrow)) _this9.unexpected();
            return typeNode;
          });
          if (result.thrown) return null;
          /*:: invariant(result.node) */

          if (result.error) this.state = result.failState; // assign after it is clear it is an arrow

          node.returnType = result.node.typeAnnotation ? this.finishNode(result.node, "TypeAnnotation") : null;
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseArrow", this).call(this, node);
      }
    }, {
      key: "shouldParseArrow",
      value: function shouldParseArrow() {
        return this.match(_types.types.colon) || _get(_getPrototypeOf(_class2.prototype), "shouldParseArrow", this).call(this);
      }
    }, {
      key: "setArrowFunctionParameters",
      value: function setArrowFunctionParameters(node, params) {
        if (this.state.noArrowParamsConversionAt.indexOf(node.start) !== -1) {
          node.params = params;
        } else {
          _get(_getPrototypeOf(_class2.prototype), "setArrowFunctionParameters", this).call(this, node, params);
        }
      }
    }, {
      key: "checkParams",
      value: function checkParams(node, allowDuplicates, isArrowFunction) {
        if (isArrowFunction && this.state.noArrowParamsConversionAt.indexOf(node.start) !== -1) {
          return;
        } // ensure the `this` param is first, if it exists


        for (var i = 0; i < node.params.length; i++) {
          if (this.isThisParam(node.params[i]) && i > 0) {
            this.raise(node.params[i].start, FlowErrors.ThisParamMustBeFirst);
          }
        }

        return _get(_getPrototypeOf(_class2.prototype), "checkParams", this).apply(this, arguments);
      }
    }, {
      key: "parseParenAndDistinguishExpression",
      value: function parseParenAndDistinguishExpression(canBeArrow) {
        return _get(_getPrototypeOf(_class2.prototype), "parseParenAndDistinguishExpression", this).call(this, canBeArrow && this.state.noArrowAt.indexOf(this.state.start) === -1);
      }
    }, {
      key: "parseSubscripts",
      value: function parseSubscripts(base, startPos, startLoc, noCalls) {
        var _this10 = this;

        if (base.type === "Identifier" && base.name === "async" && this.state.noArrowAt.indexOf(startPos) !== -1) {
          this.next();
          var node = this.startNodeAt(startPos, startLoc);
          node.callee = base;
          node.arguments = this.parseCallExpressionArguments(_types.types.parenR, false);
          base = this.finishNode(node, "CallExpression");
        } else if (base.type === "Identifier" && base.name === "async" && this.isRelational("<")) {
          var state = this.state.clone();
          var arrow = this.tryParse(function (abort) {
            return _this10.parseAsyncArrowWithTypeParameters(startPos, startLoc) || abort();
          }, state);
          /*:: invariant(arrow.node != null) */

          if (!arrow.error && !arrow.aborted) return arrow.node;
          var result = this.tryParse(function () {
            return _get(_getPrototypeOf(_class2.prototype), "parseSubscripts", _this10).call(_this10, base, startPos, startLoc, noCalls);
          }, state);
          if (result.node && !result.error) return result.node;

          if (arrow.node) {
            this.state = arrow.failState;
            return arrow.node;
          }

          if (result.node) {
            this.state = result.failState;
            return result.node;
          }

          throw arrow.error || result.error;
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseSubscripts", this).call(this, base, startPos, startLoc, noCalls);
      }
    }, {
      key: "parseSubscript",
      value: function parseSubscript(base, startPos, startLoc, noCalls, subscriptState) {
        var _this11 = this;

        if (this.match(_types.types.questionDot) && this.isLookaheadToken_lt()) {
          subscriptState.optionalChainMember = true;

          if (noCalls) {
            subscriptState.stop = true;
            return base;
          }

          this.next();
          var node = this.startNodeAt(startPos, startLoc);
          node.callee = base;
          node.typeArguments = this.flowParseTypeParameterInstantiation();
          this.expect(_types.types.parenL); // $FlowFixMe

          node.arguments = this.parseCallExpressionArguments(_types.types.parenR, false);
          node.optional = true;
          return this.finishCallExpression(node,
          /* optional */
          true);
        } else if (!noCalls && this.shouldParseTypes() && this.isRelational("<")) {
          var _node4 = this.startNodeAt(startPos, startLoc);

          _node4.callee = base;
          var result = this.tryParse(function () {
            _node4.typeArguments = _this11.flowParseTypeParameterInstantiationCallOrNew();

            _this11.expect(_types.types.parenL);

            _node4.arguments = _this11.parseCallExpressionArguments(_types.types.parenR, false);
            if (subscriptState.optionalChainMember) _node4.optional = false;
            return _this11.finishCallExpression(_node4, subscriptState.optionalChainMember);
          });

          if (result.node) {
            if (result.error) this.state = result.failState;
            return result.node;
          }
        }

        return _get(_getPrototypeOf(_class2.prototype), "parseSubscript", this).call(this, base, startPos, startLoc, noCalls, subscriptState);
      }
    }, {
      key: "parseNewArguments",
      value: function parseNewArguments(node) {
        var _this12 = this;

        var targs = null;

        if (this.shouldParseTypes() && this.isRelational("<")) {
          targs = this.tryParse(function () {
            return _this12.flowParseTypeParameterInstantiationCallOrNew();
          }).node;
        }

        node.typeArguments = targs;

        _get(_getPrototypeOf(_class2.prototype), "parseNewArguments", this).call(this, node);
      }
    }, {
      key: "parseAsyncArrowWithTypeParameters",
      value: function parseAsyncArrowWithTypeParameters(startPos, startLoc) {
        var node = this.startNodeAt(startPos, startLoc);
        this.parseFunctionParams(node);
        if (!this.parseArrow(node)) return;
        return this.parseArrowExpression(node,
        /* params */
        undefined,
        /* isAsync */
        true);
      }
    }, {
      key: "readToken_mult_modulo",
      value: function readToken_mult_modulo(code) {
        var next = this.input.charCodeAt(this.state.pos + 1);

        if (code === charCodes.asterisk && next === charCodes.slash && this.state.hasFlowComment) {
          this.state.hasFlowComment = false;
          this.state.pos += 2;
          this.nextToken();
          return;
        }

        _get(_getPrototypeOf(_class2.prototype), "readToken_mult_modulo", this).call(this, code);
      }
    }, {
      key: "readToken_pipe_amp",
      value: function readToken_pipe_amp(code) {
        var next = this.input.charCodeAt(this.state.pos + 1);

        if (code === charCodes.verticalBar && next === charCodes.rightCurlyBrace) {
          // '|}'
          this.finishOp(_types.types.braceBarR, 2);
          return;
        }

        _get(_getPrototypeOf(_class2.prototype), "readToken_pipe_amp", this).call(this, code);
      }
    }, {
      key: "parseTopLevel",
      value: function parseTopLevel(file, program) {
        var fileNode = _get(_getPrototypeOf(_class2.prototype), "parseTopLevel", this).call(this, file, program);

        if (this.state.hasFlowComment) {
          this.raise(this.state.pos, FlowErrors.UnterminatedFlowComment);
        }

        return fileNode;
      }
    }, {
      key: "skipBlockComment",
      value: function skipBlockComment() {
        if (this.hasPlugin("flowComments") && this.skipFlowComment()) {
          if (this.state.hasFlowComment) {
            this.unexpected(null, FlowErrors.NestedFlowComment);
          }

          this.hasFlowCommentCompletion();
          this.state.pos += this.skipFlowComment();
          this.state.hasFlowComment = true;
          return;
        }

        if (this.state.hasFlowComment) {
          var end = this.input.indexOf("*-/", this.state.pos += 2);

          if (end === -1) {
            throw this.raise(this.state.pos - 2, _error.Errors.UnterminatedComment);
          }

          this.state.pos = end + 3;
          return;
        }

        _get(_getPrototypeOf(_class2.prototype), "skipBlockComment", this).call(this);
      }
    }, {
      key: "skipFlowComment",
      value: function skipFlowComment() {
        var pos = this.state.pos;
        var shiftToFirstNonWhiteSpace = 2;

        while ([charCodes.space, charCodes.tab].includes(this.input.charCodeAt(pos + shiftToFirstNonWhiteSpace))) {
          shiftToFirstNonWhiteSpace++;
        }

        var ch2 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos);
        var ch3 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos + 1);

        if (ch2 === charCodes.colon && ch3 === charCodes.colon) {
          return shiftToFirstNonWhiteSpace + 2; // check for /*::
        }

        if (this.input.slice(shiftToFirstNonWhiteSpace + pos, shiftToFirstNonWhiteSpace + pos + 12) === "flow-include") {
          return shiftToFirstNonWhiteSpace + 12; // check for /*flow-include
        }

        if (ch2 === charCodes.colon && ch3 !== charCodes.colon) {
          return shiftToFirstNonWhiteSpace; // check for /*:, advance up to :
        }

        return false;
      }
    }, {
      key: "hasFlowCommentCompletion",
      value: function hasFlowCommentCompletion() {
        var end = this.input.indexOf("*/", this.state.pos);

        if (end === -1) {
          throw this.raise(this.state.pos, _error.Errors.UnterminatedComment);
        }
      } // Flow enum parsing

    }, {
      key: "flowEnumErrorBooleanMemberNotInitialized",
      value: function flowEnumErrorBooleanMemberNotInitialized(pos, _ref2) {
        var enumName = _ref2.enumName,
            memberName = _ref2.memberName;
        this.raise(pos, FlowErrors.EnumBooleanMemberNotInitialized, memberName, enumName);
      }
    }, {
      key: "flowEnumErrorInvalidMemberName",
      value: function flowEnumErrorInvalidMemberName(pos, _ref3) {
        var enumName = _ref3.enumName,
            memberName = _ref3.memberName;
        var suggestion = memberName[0].toUpperCase() + memberName.slice(1);
        this.raise(pos, FlowErrors.EnumInvalidMemberName, memberName, suggestion, enumName);
      }
    }, {
      key: "flowEnumErrorDuplicateMemberName",
      value: function flowEnumErrorDuplicateMemberName(pos, _ref4) {
        var enumName = _ref4.enumName,
            memberName = _ref4.memberName;
        this.raise(pos, FlowErrors.EnumDuplicateMemberName, memberName, enumName);
      }
    }, {
      key: "flowEnumErrorInconsistentMemberValues",
      value: function flowEnumErrorInconsistentMemberValues(pos, _ref5) {
        var enumName = _ref5.enumName;
        this.raise(pos, FlowErrors.EnumInconsistentMemberValues, enumName);
      }
    }, {
      key: "flowEnumErrorInvalidExplicitType",
      value: function flowEnumErrorInvalidExplicitType(pos, _ref6) {
        var enumName = _ref6.enumName,
            suppliedType = _ref6.suppliedType;
        return this.raise(pos, suppliedType === null ? FlowErrors.EnumInvalidExplicitTypeUnknownSupplied : FlowErrors.EnumInvalidExplicitType, enumName, suppliedType);
      }
    }, {
      key: "flowEnumErrorInvalidMemberInitializer",
      value: function flowEnumErrorInvalidMemberInitializer(pos, _ref7) {
        var enumName = _ref7.enumName,
            explicitType = _ref7.explicitType,
            memberName = _ref7.memberName;
        var message = null;

        switch (explicitType) {
          case "boolean":
          case "number":
          case "string":
            message = FlowErrors.EnumInvalidMemberInitializerPrimaryType;
            break;

          case "symbol":
            message = FlowErrors.EnumInvalidMemberInitializerSymbolType;
            break;

          default:
            // null
            message = FlowErrors.EnumInvalidMemberInitializerUnknownType;
        }

        return this.raise(pos, message, enumName, memberName, explicitType);
      }
    }, {
      key: "flowEnumErrorNumberMemberNotInitialized",
      value: function flowEnumErrorNumberMemberNotInitialized(pos, _ref8) {
        var enumName = _ref8.enumName,
            memberName = _ref8.memberName;
        this.raise(pos, FlowErrors.EnumNumberMemberNotInitialized, enumName, memberName);
      }
    }, {
      key: "flowEnumErrorStringMemberInconsistentlyInitailized",
      value: function flowEnumErrorStringMemberInconsistentlyInitailized(pos, _ref9) {
        var enumName = _ref9.enumName;
        this.raise(pos, FlowErrors.EnumStringMemberInconsistentlyInitailized, enumName);
      }
    }, {
      key: "flowEnumMemberInit",
      value: function flowEnumMemberInit() {
        var _this13 = this;

        var startPos = this.state.start;

        var endOfInit = function endOfInit() {
          return _this13.match(_types.types.comma) || _this13.match(_types.types.braceR);
        };

        switch (this.state.type) {
          case _types.types.num:
            {
              var literal = this.parseNumericLiteral(this.state.value);

              if (endOfInit()) {
                return {
                  type: "number",
                  pos: literal.start,
                  value: literal
                };
              }

              return {
                type: "invalid",
                pos: startPos
              };
            }

          case _types.types.string:
            {
              var _literal = this.parseStringLiteral(this.state.value);

              if (endOfInit()) {
                return {
                  type: "string",
                  pos: _literal.start,
                  value: _literal
                };
              }

              return {
                type: "invalid",
                pos: startPos
              };
            }

          case _types.types._true:
          case _types.types._false:
            {
              var _literal2 = this.parseBooleanLiteral(this.match(_types.types._true));

              if (endOfInit()) {
                return {
                  type: "boolean",
                  pos: _literal2.start,
                  value: _literal2
                };
              }

              return {
                type: "invalid",
                pos: startPos
              };
            }

          default:
            return {
              type: "invalid",
              pos: startPos
            };
        }
      }
    }, {
      key: "flowEnumMemberRaw",
      value: function flowEnumMemberRaw() {
        var pos = this.state.start;
        var id = this.parseIdentifier(true);
        var init = this.eat(_types.types.eq) ? this.flowEnumMemberInit() : {
          type: "none",
          pos: pos
        };
        return {
          id: id,
          init: init
        };
      }
    }, {
      key: "flowEnumCheckExplicitTypeMismatch",
      value: function flowEnumCheckExplicitTypeMismatch(pos, context, expectedType) {
        var explicitType = context.explicitType;

        if (explicitType === null) {
          return;
        }

        if (explicitType !== expectedType) {
          this.flowEnumErrorInvalidMemberInitializer(pos, context);
        }
      }
    }, {
      key: "flowEnumMembers",
      value: function flowEnumMembers(_ref10) {
        var enumName = _ref10.enumName,
            explicitType = _ref10.explicitType;
        var seenNames = new Set();
        var members = {
          booleanMembers: [],
          numberMembers: [],
          stringMembers: [],
          defaultedMembers: []
        };
        var hasUnknownMembers = false;

        while (!this.match(_types.types.braceR)) {
          if (this.eat(_types.types.ellipsis)) {
            hasUnknownMembers = true;
            break;
          }

          var memberNode = this.startNode();

          var _this$flowEnumMemberR = this.flowEnumMemberRaw(),
              id = _this$flowEnumMemberR.id,
              init = _this$flowEnumMemberR.init;

          var memberName = id.name;

          if (memberName === "") {
            continue;
          }

          if (/^[a-z]/.test(memberName)) {
            this.flowEnumErrorInvalidMemberName(id.start, {
              enumName: enumName,
              memberName: memberName
            });
          }

          if (seenNames.has(memberName)) {
            this.flowEnumErrorDuplicateMemberName(id.start, {
              enumName: enumName,
              memberName: memberName
            });
          }

          seenNames.add(memberName);
          var context = {
            enumName: enumName,
            explicitType: explicitType,
            memberName: memberName
          };
          memberNode.id = id;

          switch (init.type) {
            case "boolean":
              {
                this.flowEnumCheckExplicitTypeMismatch(init.pos, context, "boolean");
                memberNode.init = init.value;
                members.booleanMembers.push(this.finishNode(memberNode, "EnumBooleanMember"));
                break;
              }

            case "number":
              {
                this.flowEnumCheckExplicitTypeMismatch(init.pos, context, "number");
                memberNode.init = init.value;
                members.numberMembers.push(this.finishNode(memberNode, "EnumNumberMember"));
                break;
              }

            case "string":
              {
                this.flowEnumCheckExplicitTypeMismatch(init.pos, context, "string");
                memberNode.init = init.value;
                members.stringMembers.push(this.finishNode(memberNode, "EnumStringMember"));
                break;
              }

            case "invalid":
              {
                throw this.flowEnumErrorInvalidMemberInitializer(init.pos, context);
              }

            case "none":
              {
                switch (explicitType) {
                  case "boolean":
                    this.flowEnumErrorBooleanMemberNotInitialized(init.pos, context);
                    break;

                  case "number":
                    this.flowEnumErrorNumberMemberNotInitialized(init.pos, context);
                    break;

                  default:
                    members.defaultedMembers.push(this.finishNode(memberNode, "EnumDefaultedMember"));
                }
              }
          }

          if (!this.match(_types.types.braceR)) {
            this.expect(_types.types.comma);
          }
        }

        return {
          members: members,
          hasUnknownMembers: hasUnknownMembers
        };
      }
    }, {
      key: "flowEnumStringMembers",
      value: function flowEnumStringMembers(initializedMembers, defaultedMembers, _ref11) {
        var enumName = _ref11.enumName;

        if (initializedMembers.length === 0) {
          return defaultedMembers;
        } else if (defaultedMembers.length === 0) {
          return initializedMembers;
        } else if (defaultedMembers.length > initializedMembers.length) {
          var _iterator = _createForOfIteratorHelper(initializedMembers),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var member = _step.value;
              this.flowEnumErrorStringMemberInconsistentlyInitailized(member.start, {
                enumName: enumName
              });
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return defaultedMembers;
        } else {
          var _iterator2 = _createForOfIteratorHelper(defaultedMembers),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _member = _step2.value;
              this.flowEnumErrorStringMemberInconsistentlyInitailized(_member.start, {
                enumName: enumName
              });
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          return initializedMembers;
        }
      }
    }, {
      key: "flowEnumParseExplicitType",
      value: function flowEnumParseExplicitType(_ref12) {
        var enumName = _ref12.enumName;

        if (this.eatContextual("of")) {
          if (!this.match(_types.types.name)) {
            throw this.flowEnumErrorInvalidExplicitType(this.state.start, {
              enumName: enumName,
              suppliedType: null
            });
          }

          var value = this.state.value;
          this.next();

          if (value !== "boolean" && value !== "number" && value !== "string" && value !== "symbol") {
            this.flowEnumErrorInvalidExplicitType(this.state.start, {
              enumName: enumName,
              suppliedType: value
            });
          }

          return value;
        }

        return null;
      }
    }, {
      key: "flowEnumBody",
      value: function flowEnumBody(node, _ref13) {
        var _this14 = this;

        var enumName = _ref13.enumName,
            nameLoc = _ref13.nameLoc;
        var explicitType = this.flowEnumParseExplicitType({
          enumName: enumName
        });
        this.expect(_types.types.braceL);

        var _this$flowEnumMembers = this.flowEnumMembers({
          enumName: enumName,
          explicitType: explicitType
        }),
            members = _this$flowEnumMembers.members,
            hasUnknownMembers = _this$flowEnumMembers.hasUnknownMembers;

        node.hasUnknownMembers = hasUnknownMembers;

        switch (explicitType) {
          case "boolean":
            node.explicitType = true;
            node.members = members.booleanMembers;
            this.expect(_types.types.braceR);
            return this.finishNode(node, "EnumBooleanBody");

          case "number":
            node.explicitType = true;
            node.members = members.numberMembers;
            this.expect(_types.types.braceR);
            return this.finishNode(node, "EnumNumberBody");

          case "string":
            node.explicitType = true;
            node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, {
              enumName: enumName
            });
            this.expect(_types.types.braceR);
            return this.finishNode(node, "EnumStringBody");

          case "symbol":
            node.members = members.defaultedMembers;
            this.expect(_types.types.braceR);
            return this.finishNode(node, "EnumSymbolBody");

          default:
            {
              // `explicitType` is `null`
              var empty = function empty() {
                node.members = [];

                _this14.expect(_types.types.braceR);

                return _this14.finishNode(node, "EnumStringBody");
              };

              node.explicitType = false;
              var boolsLen = members.booleanMembers.length;
              var numsLen = members.numberMembers.length;
              var strsLen = members.stringMembers.length;
              var defaultedLen = members.defaultedMembers.length;

              if (!boolsLen && !numsLen && !strsLen && !defaultedLen) {
                return empty();
              } else if (!boolsLen && !numsLen) {
                node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, {
                  enumName: enumName
                });
                this.expect(_types.types.braceR);
                return this.finishNode(node, "EnumStringBody");
              } else if (!numsLen && !strsLen && boolsLen >= defaultedLen) {
                var _iterator3 = _createForOfIteratorHelper(members.defaultedMembers),
                    _step3;

                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var member = _step3.value;
                    this.flowEnumErrorBooleanMemberNotInitialized(member.start, {
                      enumName: enumName,
                      memberName: member.id.name
                    });
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }

                node.members = members.booleanMembers;
                this.expect(_types.types.braceR);
                return this.finishNode(node, "EnumBooleanBody");
              } else if (!boolsLen && !strsLen && numsLen >= defaultedLen) {
                var _iterator4 = _createForOfIteratorHelper(members.defaultedMembers),
                    _step4;

                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var _member2 = _step4.value;
                    this.flowEnumErrorNumberMemberNotInitialized(_member2.start, {
                      enumName: enumName,
                      memberName: _member2.id.name
                    });
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }

                node.members = members.numberMembers;
                this.expect(_types.types.braceR);
                return this.finishNode(node, "EnumNumberBody");
              } else {
                this.flowEnumErrorInconsistentMemberValues(nameLoc, {
                  enumName: enumName
                });
                return empty();
              }
            }
        }
      }
    }, {
      key: "flowParseEnumDeclaration",
      value: function flowParseEnumDeclaration(node) {
        var id = this.parseIdentifier();
        node.id = id;
        node.body = this.flowEnumBody(this.startNode(), {
          enumName: id.name,
          nameLoc: id.start
        });
        return this.finishNode(node, "EnumDeclaration");
      } // check if the next token is a tt.relation("<")

    }, {
      key: "isLookaheadToken_lt",
      value: function isLookaheadToken_lt() {
        var next = this.nextTokenStart();

        if (this.input.charCodeAt(next) === charCodes.lessThan) {
          var afterNext = this.input.charCodeAt(next + 1);
          return afterNext !== charCodes.lessThan && afterNext !== charCodes.equalsTo;
        }

        return false;
      }
    }, {
      key: "maybeUnwrapTypeCastExpression",
      value: function maybeUnwrapTypeCastExpression(node) {
        return node.type === "TypeCastExpression" ? node.expression : node;
      }
    }]);

    return _class2;
  }(superClass);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL2Zsb3cvaW5kZXguanMiXSwibmFtZXMiOlsicmVzZXJ2ZWRUeXBlcyIsIlNldCIsIkZsb3dFcnJvcnMiLCJBbWJpZ3VvdXNDb25kaXRpb25hbEFycm93IiwiQW1iaWd1b3VzRGVjbGFyZU1vZHVsZUtpbmQiLCJBc3NpZ25SZXNlcnZlZFR5cGUiLCJEZWNsYXJlQ2xhc3NFbGVtZW50IiwiRGVjbGFyZUNsYXNzRmllbGRJbml0aWFsaXplciIsIkR1cGxpY2F0ZURlY2xhcmVNb2R1bGVFeHBvcnRzIiwiRW51bUJvb2xlYW5NZW1iZXJOb3RJbml0aWFsaXplZCIsIkVudW1EdXBsaWNhdGVNZW1iZXJOYW1lIiwiRW51bUluY29uc2lzdGVudE1lbWJlclZhbHVlcyIsIkVudW1JbnZhbGlkRXhwbGljaXRUeXBlIiwiRW51bUludmFsaWRFeHBsaWNpdFR5cGVVbmtub3duU3VwcGxpZWQiLCJFbnVtSW52YWxpZE1lbWJlckluaXRpYWxpemVyUHJpbWFyeVR5cGUiLCJFbnVtSW52YWxpZE1lbWJlckluaXRpYWxpemVyU3ltYm9sVHlwZSIsIkVudW1JbnZhbGlkTWVtYmVySW5pdGlhbGl6ZXJVbmtub3duVHlwZSIsIkVudW1JbnZhbGlkTWVtYmVyTmFtZSIsIkVudW1OdW1iZXJNZW1iZXJOb3RJbml0aWFsaXplZCIsIkVudW1TdHJpbmdNZW1iZXJJbmNvbnNpc3RlbnRseUluaXRhaWxpemVkIiwiR2V0dGVyTWF5Tm90SGF2ZVRoaXNQYXJhbSIsIkltcG9ydFR5cGVTaG9ydGhhbmRPbmx5SW5QdXJlSW1wb3J0IiwiSW5leGFjdEluc2lkZUV4YWN0IiwiSW5leGFjdEluc2lkZU5vbk9iamVjdCIsIkluZXhhY3RWYXJpYW5jZSIsIkludmFsaWROb25UeXBlSW1wb3J0SW5EZWNsYXJlTW9kdWxlIiwiTWlzc2luZ1R5cGVQYXJhbURlZmF1bHQiLCJOZXN0ZWREZWNsYXJlTW9kdWxlIiwiTmVzdGVkRmxvd0NvbW1lbnQiLCJPcHRpb25hbEJpbmRpbmdQYXR0ZXJuIiwiU2V0dGVyTWF5Tm90SGF2ZVRoaXNQYXJhbSIsIlNwcmVhZFZhcmlhbmNlIiwiVGhpc1BhcmFtQW5ub3RhdGlvblJlcXVpcmVkIiwiVGhpc1BhcmFtQmFubmVkSW5Db25zdHJ1Y3RvciIsIlRoaXNQYXJhbU1heU5vdEJlT3B0aW9uYWwiLCJUaGlzUGFyYW1NdXN0QmVGaXJzdCIsIlRoaXNQYXJhbU5vRGVmYXVsdCIsIlR5cGVCZWZvcmVJbml0aWFsaXplciIsIlR5cGVDYXN0SW5QYXR0ZXJuIiwiVW5leHBlY3RlZEV4cGxpY2l0SW5leGFjdEluT2JqZWN0IiwiVW5leHBlY3RlZFJlc2VydmVkVHlwZSIsIlVuZXhwZWN0ZWRSZXNlcnZlZFVuZGVyc2NvcmUiLCJVbmV4cGVjdGVkU3BhY2VCZXR3ZWVuTW9kdWxvQ2hlY2tzIiwiVW5leHBlY3RlZFNwcmVhZFR5cGUiLCJVbmV4cGVjdGVkU3VidHJhY3Rpb25PcGVyYW5kIiwiVW5leHBlY3RlZFRva2VuQWZ0ZXJUeXBlUGFyYW1ldGVyIiwiVW5leHBlY3RlZFR5cGVQYXJhbWV0ZXJCZWZvcmVBc3luY0Fycm93RnVuY3Rpb24iLCJVbnN1cHBvcnRlZERlY2xhcmVFeHBvcnRLaW5kIiwiVW5zdXBwb3J0ZWRTdGF0ZW1lbnRJbkRlY2xhcmVNb2R1bGUiLCJVbnRlcm1pbmF0ZWRGbG93Q29tbWVudCIsIkVycm9yQ29kZXMiLCJTeW50YXhFcnJvciIsImlzRXNNb2R1bGVUeXBlIiwiYm9keUVsZW1lbnQiLCJ0eXBlIiwiZGVjbGFyYXRpb24iLCJoYXNUeXBlSW1wb3J0S2luZCIsIm5vZGUiLCJpbXBvcnRLaW5kIiwiaXNNYXliZURlZmF1bHRJbXBvcnQiLCJzdGF0ZSIsInR0IiwibmFtZSIsImtleXdvcmQiLCJ2YWx1ZSIsImV4cG9ydFN1Z2dlc3Rpb25zIiwicGFydGl0aW9uIiwibGlzdCIsInRlc3QiLCJsaXN0MSIsImxpc3QyIiwiaSIsImxlbmd0aCIsInB1c2giLCJGTE9XX1BSQUdNQV9SRUdFWCIsInN1cGVyQ2xhc3MiLCJ1bmRlZmluZWQiLCJGbG93U2NvcGVIYW5kbGVyIiwiZ2V0UGx1Z2luT3B0aW9uIiwiZmxvd1ByYWdtYSIsInZhbCIsInN0cmluZyIsInNlbWkiLCJpbnRlcnByZXRlckRpcmVjdGl2ZSIsImNvbW1lbnQiLCJtYXRjaGVzIiwiZXhlYyIsIkVycm9yIiwidG9rIiwib2xkSW5UeXBlIiwiaW5UeXBlIiwiZXhwZWN0IiwiY29sb24iLCJmbG93UGFyc2VUeXBlIiwic3RhcnROb2RlIiwibW9kdWxvUG9zIiwic3RhcnQiLCJuZXh0IiwiZXhwZWN0Q29udGV4dHVhbCIsImxhc3RUb2tTdGFydCIsInJhaXNlIiwiZWF0IiwicGFyZW5MIiwicGFyc2VFeHByZXNzaW9uIiwicGFyZW5SIiwiZmluaXNoTm9kZSIsInByZWRpY2F0ZSIsIm1hdGNoIiwibW9kdWxvIiwiZmxvd1BhcnNlUHJlZGljYXRlIiwiZmxvd1BhcnNlSW50ZXJmYWNlaXNoIiwiaWQiLCJwYXJzZUlkZW50aWZpZXIiLCJ0eXBlTm9kZSIsInR5cGVDb250YWluZXIiLCJpc1JlbGF0aW9uYWwiLCJ0eXBlUGFyYW1ldGVycyIsImZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbiIsInRtcCIsImZsb3dQYXJzZUZ1bmN0aW9uVHlwZVBhcmFtcyIsInBhcmFtcyIsInJlc3QiLCJfdGhpcyIsImZsb3dQYXJzZVR5cGVBbmRQcmVkaWNhdGVJbml0aWFsaXNlciIsInJldHVyblR5cGUiLCJ0eXBlQW5ub3RhdGlvbiIsInJlc2V0RW5kTG9jYXRpb24iLCJzZW1pY29sb24iLCJzY29wZSIsImRlY2xhcmVOYW1lIiwiQklORF9GTE9XX0RFQ0xBUkVfRk4iLCJpbnNpZGVNb2R1bGUiLCJfY2xhc3MiLCJmbG93UGFyc2VEZWNsYXJlQ2xhc3MiLCJfZnVuY3Rpb24iLCJmbG93UGFyc2VEZWNsYXJlRnVuY3Rpb24iLCJfdmFyIiwiZmxvd1BhcnNlRGVjbGFyZVZhcmlhYmxlIiwiZWF0Q29udGV4dHVhbCIsImRvdCIsImZsb3dQYXJzZURlY2xhcmVNb2R1bGVFeHBvcnRzIiwiZmxvd1BhcnNlRGVjbGFyZU1vZHVsZSIsImlzQ29udGV4dHVhbCIsImZsb3dQYXJzZURlY2xhcmVUeXBlQWxpYXMiLCJmbG93UGFyc2VEZWNsYXJlT3BhcXVlVHlwZSIsImZsb3dQYXJzZURlY2xhcmVJbnRlcmZhY2UiLCJfZXhwb3J0IiwiZmxvd1BhcnNlRGVjbGFyZUV4cG9ydERlY2xhcmF0aW9uIiwidW5leHBlY3RlZCIsImZsb3dQYXJzZVR5cGVBbm5vdGF0YWJsZUlkZW50aWZpZXIiLCJCSU5EX1ZBUiIsImVudGVyIiwiU0NPUEVfT1RIRVIiLCJwYXJzZUV4cHJBdG9tIiwiYm9keU5vZGUiLCJib2R5IiwiYnJhY2VMIiwiYnJhY2VSIiwiX2ltcG9ydCIsIl90eXBlb2YiLCJwYXJzZUltcG9ydCIsImZsb3dQYXJzZURlY2xhcmUiLCJleGl0Iiwia2luZCIsImhhc01vZHVsZUV4cG9ydCIsImZvckVhY2giLCJfZGVmYXVsdCIsIl9jb25zdCIsImlzTGV0IiwibGFiZWwiLCJzdWdnZXN0aW9uIiwic3RhciIsInBhcnNlRXhwb3J0IiwiZXhwb3J0S2luZCIsImZsb3dQYXJzZVR5cGVBbm5vdGF0aW9uIiwiZmxvd1BhcnNlVHlwZUFsaWFzIiwiZmxvd1BhcnNlT3BhcXVlVHlwZSIsImlzQ2xhc3MiLCJmbG93UGFyc2VSZXN0cmljdGVkSWRlbnRpZmllciIsIkJJTkRfRlVOQ1RJT04iLCJCSU5EX0xFWElDQUwiLCJtaXhpbnMiLCJfZXh0ZW5kcyIsImZsb3dQYXJzZUludGVyZmFjZUV4dGVuZHMiLCJjb21tYSIsImZsb3dQYXJzZU9iamVjdFR5cGUiLCJhbGxvd1N0YXRpYyIsImFsbG93RXhhY3QiLCJhbGxvd1NwcmVhZCIsImFsbG93UHJvdG8iLCJhbGxvd0luZXhhY3QiLCJmbG93UGFyc2VRdWFsaWZpZWRUeXBlSWRlbnRpZmllciIsImZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJJbnN0YW50aWF0aW9uIiwid29yZCIsInN0YXJ0TG9jIiwiaGFzIiwibGliZXJhbCIsImNoZWNrUmVzZXJ2ZWRUeXBlIiwicmlnaHQiLCJmbG93UGFyc2VUeXBlSW5pdGlhbGlzZXIiLCJlcSIsImRlY2xhcmUiLCJzdXBlcnR5cGUiLCJpbXBsdHlwZSIsInJlcXVpcmVEZWZhdWx0Iiwibm9kZVN0YXJ0IiwidmFyaWFuY2UiLCJmbG93UGFyc2VWYXJpYW5jZSIsImlkZW50IiwiYm91bmQiLCJqc3hUYWdTdGFydCIsImRlZmF1bHRSZXF1aXJlZCIsInR5cGVQYXJhbWV0ZXIiLCJmbG93UGFyc2VUeXBlUGFyYW1ldGVyIiwiZXhwZWN0UmVsYXRpb25hbCIsIm9sZE5vQW5vbkZ1bmN0aW9uVHlwZSIsIm5vQW5vbkZ1bmN0aW9uVHlwZSIsImZsb3dQYXJzZVR5cGVPckltcGxpY2l0SW5zdGFudGlhdGlvbiIsIm51bSIsImlzU3RhdGljIiwibG9va2FoZWFkIiwiZmxvd1BhcnNlT2JqZWN0UHJvcGVydHlLZXkiLCJrZXkiLCJicmFja2V0UiIsIm1ldGhvZCIsIm9wdGlvbmFsIiwiZmxvd1BhcnNlT2JqZWN0VHlwZU1ldGhvZGlzaCIsInN0YXJ0Tm9kZUF0IiwibG9jIiwicXVlc3Rpb24iLCJmbG93UGFyc2VGdW5jdGlvblR5cGVQYXJhbSIsImVsbGlwc2lzIiwidmFsdWVOb2RlIiwiY2FsbFByb3BlcnRpZXMiLCJwcm9wZXJ0aWVzIiwiaW5kZXhlcnMiLCJpbnRlcm5hbFNsb3RzIiwiZW5kRGVsaW0iLCJleGFjdCIsImluZXhhY3QiLCJicmFjZUJhckwiLCJicmFjZUJhclIiLCJwcm90b1N0YXJ0IiwiaW5leGFjdFN0YXJ0IiwiYnJhY2tldEwiLCJmbG93UGFyc2VPYmplY3RUeXBlSW50ZXJuYWxTbG90IiwiZmxvd1BhcnNlT2JqZWN0VHlwZUluZGV4ZXIiLCJmbG93UGFyc2VPYmplY3RUeXBlQ2FsbFByb3BlcnR5IiwicHJvcE9ySW5leGFjdCIsImZsb3dQYXJzZU9iamVjdFR5cGVQcm9wZXJ0eSIsImZsb3dPYmplY3RUeXBlU2VtaWNvbG9uIiwib3V0IiwiaXNJbmV4YWN0VG9rZW4iLCJhcmd1bWVudCIsInByb3RvIiwiZmxvd0NoZWNrR2V0dGVyU2V0dGVyUGFyYW1zIiwicHJvcGVydHkiLCJwYXJhbUNvdW50IiwiRXJyb3JzIiwiQmFkR2V0dGVyQXJpdHkiLCJCYWRTZXR0ZXJBcml0eSIsIkJhZFNldHRlclJlc3RQYXJhbWV0ZXIiLCJzdGFydFBvcyIsIm5vZGUyIiwicXVhbGlmaWNhdGlvbiIsImZsb3dQYXJzZVByaW1hcnlUeXBlIiwidHlwZXMiLCJwb3MiLCJmaXJzdCIsImxoIiwiaXNUaGlzIiwiY2hlY2tOb3RVbmRlcnNjb3JlIiwiZmxvd1BhcnNlR2VuZXJpY1R5cGUiLCJpc0dyb3VwZWRUeXBlIiwiZmxvd1BhcnNlSW50ZXJmYWNlVHlwZSIsImZsb3dJZGVudFRvVHlwZUFubm90YXRpb24iLCJmbG93UGFyc2VUdXBsZVR5cGUiLCJyZWxhdGlvbmFsIiwiYXJyb3ciLCJ0b2tlbiIsInJlaW50ZXJwcmV0VHlwZUFzRnVuY3Rpb25UeXBlUGFyYW0iLCJwYXJzZUxpdGVyYWwiLCJfdHJ1ZSIsIl9mYWxzZSIsInBsdXNNaW4iLCJwYXJzZUxpdGVyYWxBdE5vZGUiLCJiaWdpbnQiLCJfdm9pZCIsIl9udWxsIiwiZmxvd1BhcnNlVHlwZW9mVHlwZSIsInNlZW5PcHRpb25hbEluZGV4ZWRBY2Nlc3MiLCJxdWVzdGlvbkRvdCIsImNhbkluc2VydFNlbWljb2xvbiIsImVsZW1lbnRUeXBlIiwib2JqZWN0VHlwZSIsImluZGV4VHlwZSIsImZsb3dQYXJzZVByZWZpeFR5cGUiLCJmbG93UGFyc2VQb3N0Zml4VHlwZSIsInBhcmFtIiwiYml0d2lzZUFORCIsImZsb3dQYXJzZUFub25GdW5jdGlvbldpdGhvdXRQYXJlbnMiLCJiaXR3aXNlT1IiLCJmbG93UGFyc2VJbnRlcnNlY3Rpb25UeXBlIiwiZmxvd1BhcnNlVW5pb25UeXBlIiwiYWxsb3dQcmltaXRpdmVPdmVycmlkZSIsImV4cHJlc3Npb24iLCJlbmQiLCJhbGxvd0V4cHJlc3Npb25Cb2R5IiwiaXNNZXRob2QiLCJmb3J3YXJkTm9BcnJvd1BhcmFtc0NvbnZlcnNpb25BdCIsImNvbnRleHQiLCJ0b3BMZXZlbCIsInN0cmljdCIsImZsb3dQYXJzZUludGVyZmFjZSIsInNob3VsZFBhcnNlRW51bXMiLCJmbG93UGFyc2VFbnVtRGVjbGFyYXRpb24iLCJzdG10IiwiaXNWYWxpZERpcmVjdGl2ZSIsImV4cHIiLCJyZWZFeHByZXNzaW9uRXJyb3JzIiwibWF5YmVJbkFycm93UGFyYW1ldGVycyIsInJlc3VsdCIsInRyeVBhcnNlIiwiZXJyb3IiLCJmYWlsU3RhdGUiLCJjbG9uZSIsIm9yaWdpbmFsTm9BcnJvd0F0Iiwibm9BcnJvd0F0IiwidHJ5UGFyc2VDb25kaXRpb25hbENvbnNlcXVlbnQiLCJjb25zZXF1ZW50IiwiZmFpbGVkIiwiZ2V0QXJyb3dMaWtlRXhwcmVzc2lvbnMiLCJ2YWxpZCIsImludmFsaWQiLCJjb25jYXQiLCJhbHRlcm5hdGUiLCJwYXJzZU1heWJlQXNzaWduIiwibm9BcnJvd1BhcmFtc0NvbnZlcnNpb25BdCIsInBhcnNlTWF5YmVBc3NpZ25BbGxvd0luIiwicG9wIiwiZGlzYWxsb3dJbnZhbGlkIiwic3RhY2siLCJhcnJvd3MiLCJmaW5pc2hBcnJvd1ZhbGlkYXRpb24iLCJldmVyeSIsImlzQXNzaWduYWJsZSIsInRvQXNzaWduYWJsZUxpc3QiLCJleHRyYSIsInRyYWlsaW5nQ29tbWEiLCJTQ09QRV9GVU5DVElPTiIsIlNDT1BFX0FSUk9XIiwicGFyc2UiLCJpbmRleE9mIiwidHlwZUNhc3ROb2RlIiwiZGVjbCIsImRlY2xhcmF0aW9uTm9kZSIsInNwZWNpZmllcnMiLCJwYXJzZUV4cG9ydFNwZWNpZmllcnMiLCJwYXJzZUV4cG9ydEZyb20iLCJhcmd1bWVudHMiLCJoYXNOYW1lc3BhY2UiLCJpc1N0YXRlbWVudCIsIm9wdGlvbmFsSWQiLCJjbGFzc0JvZHkiLCJtZW1iZXIiLCJwYXJzZUNsYXNzTWVtYmVyRnJvbU1vZGlmaWVyIiwiZnVsbFdvcmQiLCJpc0l0ZXJhdG9yIiwiSW52YWxpZElkZW50aWZpZXIiLCJmaW5pc2hUb2tlbiIsImNvZGUiLCJpbnB1dCIsImNoYXJDb2RlQXQiLCJjaGFyQ29kZXMiLCJsZWZ0Q3VybHlCcmFjZSIsInZlcnRpY2FsQmFyIiwiZmluaXNoT3AiLCJncmVhdGVyVGhhbiIsImxlc3NUaGFuIiwicXVlc3Rpb25NYXJrIiwicmVhZEl0ZXJhdG9yIiwiaXNCaW5kaW5nIiwibGFzdCIsInByb3AiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJvcGVyYXRvciIsImlzTEhTIiwidHlwZUNhc3RUb1BhcmFtZXRlciIsImV4cHJMaXN0IiwidHJhaWxpbmdDb21tYVBvcyIsImlzUGFyZW50aGVzaXplZEV4cHIiLCJwYXJlbnRoZXNpemVkIiwiY2xvc2UiLCJjYW5CZVBhdHRlcm4iLCJpc1R1cGxlIiwidG9SZWZlcmVuY2VkTGlzdCIsImFyZ3MiLCJpc0dlbmVyYXRvciIsImlzQXN5bmMiLCJpc0NvbnN0cnVjdG9yIiwiYWxsb3dzRGlyZWN0U3VwZXIiLCJpc1RoaXNQYXJhbSIsInN1cGVyVHlwZVBhcmFtZXRlcnMiLCJpbXBsZW1lbnRlZCIsImdldE9iamVjdE9yQ2xhc3NNZXRob2RQYXJhbXMiLCJpc1ByaXZhdGVOYW1lQWxsb3dlZCIsImlzUGF0dGVybiIsImlzQWNjZXNzb3IiLCJsZWZ0Iiwic3BlY2lmaWVyIiwiY29udGV4dERlc2NyaXB0aW9uIiwibG9jYWwiLCJjaGVja0xWYWwiLCJmaXJzdElkZW50SXNTdHJpbmciLCJmaXJzdElkZW50IiwicGFyc2VNb2R1bGVFeHBvcnROYW1lIiwic3BlY2lmaWVyVHlwZUtpbmQiLCJpc0xvb2thaGVhZENvbnRleHR1YWwiLCJhc19pZGVudCIsImltcG9ydGVkIiwiX19jbG9uZSIsIkltcG9ydEJpbmRpbmdJc1N0cmluZyIsIm5vZGVJc1R5cGVJbXBvcnQiLCJzcGVjaWZpZXJJc1R5cGVJbXBvcnQiLCJjaGVja1Jlc2VydmVkV29yZCIsImFsbG93TW9kaWZpZXJzIiwiY2FsbCIsImFmdGVyTGVmdFBhcnNlIiwianN4IiwiaGFzUGx1Z2luIiwiY3VyQ29udGV4dCIsInRjIiwial9vVGFnIiwial9leHByIiwiYWJvcnQiLCJhcnJvd0V4cHJlc3Npb24iLCJyZXNldFN0YXJ0TG9jYXRpb25Gcm9tTm9kZSIsIm1heWJlVW53cmFwVHlwZUNhc3RFeHByZXNzaW9uIiwiYWJvcnRlZCIsImFzeW5jIiwidGhyb3duIiwiYWxsb3dEdXBsaWNhdGVzIiwiaXNBcnJvd0Z1bmN0aW9uIiwiY2FuQmVBcnJvdyIsImJhc2UiLCJub0NhbGxzIiwiY2FsbGVlIiwicGFyc2VDYWxsRXhwcmVzc2lvbkFyZ3VtZW50cyIsInBhcnNlQXN5bmNBcnJvd1dpdGhUeXBlUGFyYW1ldGVycyIsInN1YnNjcmlwdFN0YXRlIiwiaXNMb29rYWhlYWRUb2tlbl9sdCIsIm9wdGlvbmFsQ2hhaW5NZW1iZXIiLCJzdG9wIiwidHlwZUFyZ3VtZW50cyIsImZpbmlzaENhbGxFeHByZXNzaW9uIiwic2hvdWxkUGFyc2VUeXBlcyIsImZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJJbnN0YW50aWF0aW9uQ2FsbE9yTmV3IiwidGFyZ3MiLCJwYXJzZUZ1bmN0aW9uUGFyYW1zIiwicGFyc2VBcnJvdyIsInBhcnNlQXJyb3dFeHByZXNzaW9uIiwiYXN0ZXJpc2siLCJzbGFzaCIsImhhc0Zsb3dDb21tZW50IiwibmV4dFRva2VuIiwicmlnaHRDdXJseUJyYWNlIiwiZmlsZSIsInByb2dyYW0iLCJmaWxlTm9kZSIsInNraXBGbG93Q29tbWVudCIsImhhc0Zsb3dDb21tZW50Q29tcGxldGlvbiIsIlVudGVybWluYXRlZENvbW1lbnQiLCJzaGlmdFRvRmlyc3ROb25XaGl0ZVNwYWNlIiwic3BhY2UiLCJ0YWIiLCJpbmNsdWRlcyIsImNoMiIsImNoMyIsInNsaWNlIiwiZW51bU5hbWUiLCJtZW1iZXJOYW1lIiwidG9VcHBlckNhc2UiLCJzdXBwbGllZFR5cGUiLCJleHBsaWNpdFR5cGUiLCJtZXNzYWdlIiwiZW5kT2ZJbml0IiwibGl0ZXJhbCIsInBhcnNlTnVtZXJpY0xpdGVyYWwiLCJwYXJzZVN0cmluZ0xpdGVyYWwiLCJwYXJzZUJvb2xlYW5MaXRlcmFsIiwiaW5pdCIsImZsb3dFbnVtTWVtYmVySW5pdCIsImV4cGVjdGVkVHlwZSIsImZsb3dFbnVtRXJyb3JJbnZhbGlkTWVtYmVySW5pdGlhbGl6ZXIiLCJzZWVuTmFtZXMiLCJtZW1iZXJzIiwiYm9vbGVhbk1lbWJlcnMiLCJudW1iZXJNZW1iZXJzIiwic3RyaW5nTWVtYmVycyIsImRlZmF1bHRlZE1lbWJlcnMiLCJoYXNVbmtub3duTWVtYmVycyIsIm1lbWJlck5vZGUiLCJmbG93RW51bU1lbWJlclJhdyIsImZsb3dFbnVtRXJyb3JJbnZhbGlkTWVtYmVyTmFtZSIsImZsb3dFbnVtRXJyb3JEdXBsaWNhdGVNZW1iZXJOYW1lIiwiYWRkIiwiZmxvd0VudW1DaGVja0V4cGxpY2l0VHlwZU1pc21hdGNoIiwiZmxvd0VudW1FcnJvckJvb2xlYW5NZW1iZXJOb3RJbml0aWFsaXplZCIsImZsb3dFbnVtRXJyb3JOdW1iZXJNZW1iZXJOb3RJbml0aWFsaXplZCIsImluaXRpYWxpemVkTWVtYmVycyIsImZsb3dFbnVtRXJyb3JTdHJpbmdNZW1iZXJJbmNvbnNpc3RlbnRseUluaXRhaWxpemVkIiwiZmxvd0VudW1FcnJvckludmFsaWRFeHBsaWNpdFR5cGUiLCJuYW1lTG9jIiwiZmxvd0VudW1QYXJzZUV4cGxpY2l0VHlwZSIsImZsb3dFbnVtTWVtYmVycyIsImZsb3dFbnVtU3RyaW5nTWVtYmVycyIsImVtcHR5IiwiYm9vbHNMZW4iLCJudW1zTGVuIiwic3Ryc0xlbiIsImRlZmF1bHRlZExlbiIsImZsb3dFbnVtRXJyb3JJbmNvbnNpc3RlbnRNZW1iZXJWYWx1ZXMiLCJmbG93RW51bUJvZHkiLCJuZXh0VG9rZW5TdGFydCIsImFmdGVyTmV4dCIsImVxdWFsc1RvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFRQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFXQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxhQUFh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QUNqRCxJQURpQztBQUU5Q21jLFVBQUFBLE9BQU8sRUFBRWxaLEVBQUUsQ0FBQ2Y7QUFGa0MsU0FBcEMsQ0FBWjtBQUlBLGVBQU8sS0FBS1MsVUFBTCxDQUFnQmhELElBQWhCLEVBQXNCLGlCQUF0QixDQUFQO0FBQ0QsT0E1NkdVLENBODZHWDs7QUE5NkdXO0FBQUE7QUFBQSxhQSs2R1gsK0JBQStCO0FBQzdCLFlBQU13QyxJQUFJLEdBQUcsS0FBSzJhLGNBQUwsRUFBYjs7QUFDQSxZQUFJLEtBQUt6SixLQUFMLENBQVdDLFVBQVgsQ0FBc0JuUixJQUF0QixNQUFnQ29SLFNBQVMsQ0FBQ0ssUUFBOUMsRUFBd0Q7QUFDdEQsY0FBTW1KLFNBQVMsR0FBRyxLQUFLMUosS0FBTCxDQUFXQyxVQUFYLENBQXNCblIsSUFBSSxHQUFHLENBQTdCLENBQWxCO0FBQ0EsaUJBQ0U0YSxTQUFTLEtBQUt4SixTQUFTLENBQUNLLFFBQXhCLElBQW9DbUosU0FBUyxLQUFLeEosU0FBUyxDQUFDeUosUUFEOUQ7QUFHRDs7QUFDRCxlQUFPLEtBQVA7QUFDRDtBQXg3R1U7QUFBQTtBQUFBLGFBMDdHWCx1Q0FBOEJyZCxJQUE5QixFQUE0QztBQUMxQyxlQUFPQSxJQUFJLENBQUNILElBQUwsS0FBYyxvQkFBZCxHQUFxQ0csSUFBSSxDQUFDd1AsVUFBMUMsR0FBdUR4UCxJQUE5RDtBQUNEO0FBNTdHVTs7QUFBQTtBQUFBLElBQ0NrQixVQUREO0FBQUEsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8qOjogZGVjbGFyZSB2YXIgaW52YXJpYW50OyAqL1xuXG4vLyBFcnJvciBtZXNzYWdlcyBhcmUgY29sb2NhdGVkIHdpdGggdGhlIHBsdWdpbi5cbi8qIGVzbGludC1kaXNhYmxlIEBiYWJlbC9kZXZlbG9wbWVudC1pbnRlcm5hbC9kcnktZXJyb3ItbWVzc2FnZXMgKi9cblxuaW1wb3J0IHR5cGUgUGFyc2VyIGZyb20gXCIuLi8uLi9wYXJzZXJcIjtcbmltcG9ydCB7IHR5cGVzIGFzIHR0LCB0eXBlIFRva2VuVHlwZSB9IGZyb20gXCIuLi8uLi90b2tlbml6ZXIvdHlwZXNcIjtcbmltcG9ydCAqIGFzIE4gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uIH0gZnJvbSBcIi4uLy4uL3V0aWwvbG9jYXRpb25cIjtcbmltcG9ydCB7IHR5cGVzIGFzIHRjIH0gZnJvbSBcIi4uLy4uL3Rva2VuaXplci9jb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBjaGFyQ29kZXMgZnJvbSBcImNoYXJjb2Rlc1wiO1xuaW1wb3J0IHsgaXNJdGVyYXRvclN0YXJ0LCBpc0tleXdvcmQgfSBmcm9tIFwiLi4vLi4vdXRpbC9pZGVudGlmaWVyXCI7XG5pbXBvcnQgRmxvd1Njb3BlSGFuZGxlciBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IHtcbiAgdHlwZSBCaW5kaW5nVHlwZXMsXG4gIEJJTkRfTEVYSUNBTCxcbiAgQklORF9WQVIsXG4gIEJJTkRfRlVOQ1RJT04sXG4gIEJJTkRfRkxPV19ERUNMQVJFX0ZOLFxuICBTQ09QRV9BUlJPVyxcbiAgU0NPUEVfRlVOQ1RJT04sXG4gIFNDT1BFX09USEVSLFxufSBmcm9tIFwiLi4vLi4vdXRpbC9zY29wZWZsYWdzXCI7XG5pbXBvcnQgdHlwZSB7IEV4cHJlc3Npb25FcnJvcnMgfSBmcm9tIFwiLi4vLi4vcGFyc2VyL3V0aWxcIjtcbmltcG9ydCB7IEVycm9ycywgbWFrZUVycm9yVGVtcGxhdGVzLCBFcnJvckNvZGVzIH0gZnJvbSBcIi4uLy4uL3BhcnNlci9lcnJvclwiO1xuXG5jb25zdCByZXNlcnZlZFR5cGVzID0gbmV3IFNldChbXG4gIFwiX1wiLFxuICBcImFueVwiLFxuICBcImJvb2xcIixcbiAgXCJib29sZWFuXCIsXG4gIFwiZW1wdHlcIixcbiAgXCJleHRlbmRzXCIsXG4gIFwiZmFsc2VcIixcbiAgXCJpbnRlcmZhY2VcIixcbiAgXCJtaXhlZFwiLFxuICBcIm51bGxcIixcbiAgXCJudW1iZXJcIixcbiAgXCJzdGF0aWNcIixcbiAgXCJzdHJpbmdcIixcbiAgXCJ0cnVlXCIsXG4gIFwidHlwZW9mXCIsXG4gIFwidm9pZFwiLFxuXSk7XG5cbi8qIGVzbGludCBzb3J0LWtleXM6IFwiZXJyb3JcIiAqL1xuLy8gVGhlIEVycm9ycyBrZXkgZm9sbG93cyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svZmxvdy9ibG9iL21hc3Rlci9zcmMvcGFyc2VyL3BhcnNlX2Vycm9yLm1sIHVubGVzcyBpdCBkb2VzIG5vdCBleGlzdFxuY29uc3QgRmxvd0Vycm9ycyA9IG1ha2VFcnJvclRlbXBsYXRlcyhcbiAge1xuICAgIEFtYmlndW91c0NvbmRpdGlvbmFsQXJyb3c6XG4gICAgICBcIkFtYmlndW91cyBleHByZXNzaW9uOiB3cmFwIHRoZSBhcnJvdyBmdW5jdGlvbnMgaW4gcGFyZW50aGVzZXMgdG8gZGlzYW1iaWd1YXRlLlwiLFxuICAgIEFtYmlndW91c0RlY2xhcmVNb2R1bGVLaW5kOlxuICAgICAgXCJGb3VuZCBib3RoIGBkZWNsYXJlIG1vZHVsZS5leHBvcnRzYCBhbmQgYGRlY2xhcmUgZXhwb3J0YCBpbiB0aGUgc2FtZSBtb2R1bGUuIE1vZHVsZXMgY2FuIG9ubHkgaGF2ZSAxIHNpbmNlIHRoZXkgYXJlIGVpdGhlciBhbiBFUyBtb2R1bGUgb3IgdGhleSBhcmUgYSBDb21tb25KUyBtb2R1bGUuXCIsXG4gICAgQXNzaWduUmVzZXJ2ZWRUeXBlOiBcIkNhbm5vdCBvdmVyd3JpdGUgcmVzZXJ2ZWQgdHlwZSAlMC5cIixcbiAgICBEZWNsYXJlQ2xhc3NFbGVtZW50OlxuICAgICAgXCJUaGUgYGRlY2xhcmVgIG1vZGlmaWVyIGNhbiBvbmx5IGFwcGVhciBvbiBjbGFzcyBmaWVsZHMuXCIsXG4gICAgRGVjbGFyZUNsYXNzRmllbGRJbml0aWFsaXplcjpcbiAgICAgIFwiSW5pdGlhbGl6ZXJzIGFyZSBub3QgYWxsb3dlZCBpbiBmaWVsZHMgd2l0aCB0aGUgYGRlY2xhcmVgIG1vZGlmaWVyLlwiLFxuICAgIER1cGxpY2F0ZURlY2xhcmVNb2R1bGVFeHBvcnRzOlxuICAgICAgXCJEdXBsaWNhdGUgYGRlY2xhcmUgbW9kdWxlLmV4cG9ydHNgIHN0YXRlbWVudC5cIixcbiAgICBFbnVtQm9vbGVhbk1lbWJlck5vdEluaXRpYWxpemVkOlxuICAgICAgXCJCb29sZWFuIGVudW0gbWVtYmVycyBuZWVkIHRvIGJlIGluaXRpYWxpemVkLiBVc2UgZWl0aGVyIGAlMCA9IHRydWUsYCBvciBgJTAgPSBmYWxzZSxgIGluIGVudW0gYCUxYC5cIixcbiAgICBFbnVtRHVwbGljYXRlTWVtYmVyTmFtZTpcbiAgICAgIFwiRW51bSBtZW1iZXIgbmFtZXMgbmVlZCB0byBiZSB1bmlxdWUsIGJ1dCB0aGUgbmFtZSBgJTBgIGhhcyBhbHJlYWR5IGJlZW4gdXNlZCBiZWZvcmUgaW4gZW51bSBgJTFgLlwiLFxuICAgIEVudW1JbmNvbnNpc3RlbnRNZW1iZXJWYWx1ZXM6XG4gICAgICBcIkVudW0gYCUwYCBoYXMgaW5jb25zaXN0ZW50IG1lbWJlciBpbml0aWFsaXplcnMuIEVpdGhlciB1c2Ugbm8gaW5pdGlhbGl6ZXJzLCBvciBjb25zaXN0ZW50bHkgdXNlIGxpdGVyYWxzIChlaXRoZXIgYm9vbGVhbnMsIG51bWJlcnMsIG9yIHN0cmluZ3MpIGZvciBhbGwgbWVtYmVyIGluaXRpYWxpemVycy5cIixcbiAgICBFbnVtSW52YWxpZEV4cGxpY2l0VHlwZTpcbiAgICAgIFwiRW51bSB0eXBlIGAlMWAgaXMgbm90IHZhbGlkLiBVc2Ugb25lIG9mIGBib29sZWFuYCwgYG51bWJlcmAsIGBzdHJpbmdgLCBvciBgc3ltYm9sYCBpbiBlbnVtIGAlMGAuXCIsXG4gICAgRW51bUludmFsaWRFeHBsaWNpdFR5cGVVbmtub3duU3VwcGxpZWQ6XG4gICAgICBcIlN1cHBsaWVkIGVudW0gdHlwZSBpcyBub3QgdmFsaWQuIFVzZSBvbmUgb2YgYGJvb2xlYW5gLCBgbnVtYmVyYCwgYHN0cmluZ2AsIG9yIGBzeW1ib2xgIGluIGVudW0gYCUwYC5cIixcbiAgICBFbnVtSW52YWxpZE1lbWJlckluaXRpYWxpemVyUHJpbWFyeVR5cGU6XG4gICAgICBcIkVudW0gYCUwYCBoYXMgdHlwZSBgJTJgLCBzbyB0aGUgaW5pdGlhbGl6ZXIgb2YgYCUxYCBuZWVkcyB0byBiZSBhICUyIGxpdGVyYWwuXCIsXG4gICAgRW51bUludmFsaWRNZW1iZXJJbml0aWFsaXplclN5bWJvbFR5cGU6XG4gICAgICBcIlN5bWJvbCBlbnVtIG1lbWJlcnMgY2Fubm90IGJlIGluaXRpYWxpemVkLiBVc2UgYCUxLGAgaW4gZW51bSBgJTBgLlwiLFxuICAgIEVudW1JbnZhbGlkTWVtYmVySW5pdGlhbGl6ZXJVbmtub3duVHlwZTpcbiAgICAgIFwiVGhlIGVudW0gbWVtYmVyIGluaXRpYWxpemVyIGZvciBgJTFgIG5lZWRzIHRvIGJlIGEgbGl0ZXJhbCAoZWl0aGVyIGEgYm9vbGVhbiwgbnVtYmVyLCBvciBzdHJpbmcpIGluIGVudW0gYCUwYC5cIixcbiAgICBFbnVtSW52YWxpZE1lbWJlck5hbWU6XG4gICAgICBcIkVudW0gbWVtYmVyIG5hbWVzIGNhbm5vdCBzdGFydCB3aXRoIGxvd2VyY2FzZSAnYScgdGhyb3VnaCAneicuIEluc3RlYWQgb2YgdXNpbmcgYCUwYCwgY29uc2lkZXIgdXNpbmcgYCUxYCwgaW4gZW51bSBgJTJgLlwiLFxuICAgIEVudW1OdW1iZXJNZW1iZXJOb3RJbml0aWFsaXplZDpcbiAgICAgIFwiTnVtYmVyIGVudW0gbWVtYmVycyBuZWVkIHRvIGJlIGluaXRpYWxpemVkLCBlLmcuIGAlMSA9IDFgIGluIGVudW0gYCUwYC5cIixcbiAgICBFbnVtU3RyaW5nTWVtYmVySW5jb25zaXN0ZW50bHlJbml0YWlsaXplZDpcbiAgICAgIFwiU3RyaW5nIGVudW0gbWVtYmVycyBuZWVkIHRvIGNvbnNpc3RlbnRseSBlaXRoZXIgYWxsIHVzZSBpbml0aWFsaXplcnMsIG9yIHVzZSBubyBpbml0aWFsaXplcnMsIGluIGVudW0gYCUwYC5cIixcbiAgICBHZXR0ZXJNYXlOb3RIYXZlVGhpc1BhcmFtOiBcIkEgZ2V0dGVyIGNhbm5vdCBoYXZlIGEgYHRoaXNgIHBhcmFtZXRlci5cIixcbiAgICBJbXBvcnRUeXBlU2hvcnRoYW5kT25seUluUHVyZUltcG9ydDpcbiAgICAgIFwiVGhlIGB0eXBlYCBhbmQgYHR5cGVvZmAga2V5d29yZHMgb24gbmFtZWQgaW1wb3J0cyBjYW4gb25seSBiZSB1c2VkIG9uIHJlZ3VsYXIgYGltcG9ydGAgc3RhdGVtZW50cy4gSXQgY2Fubm90IGJlIHVzZWQgd2l0aCBgaW1wb3J0IHR5cGVgIG9yIGBpbXBvcnQgdHlwZW9mYCBzdGF0ZW1lbnRzLlwiLFxuICAgIEluZXhhY3RJbnNpZGVFeGFjdDpcbiAgICAgIFwiRXhwbGljaXQgaW5leGFjdCBzeW50YXggY2Fubm90IGFwcGVhciBpbnNpZGUgYW4gZXhwbGljaXQgZXhhY3Qgb2JqZWN0IHR5cGUuXCIsXG4gICAgSW5leGFjdEluc2lkZU5vbk9iamVjdDpcbiAgICAgIFwiRXhwbGljaXQgaW5leGFjdCBzeW50YXggY2Fubm90IGFwcGVhciBpbiBjbGFzcyBvciBpbnRlcmZhY2UgZGVmaW5pdGlvbnMuXCIsXG4gICAgSW5leGFjdFZhcmlhbmNlOiBcIkV4cGxpY2l0IGluZXhhY3Qgc3ludGF4IGNhbm5vdCBoYXZlIHZhcmlhbmNlLlwiLFxuICAgIEludmFsaWROb25UeXBlSW1wb3J0SW5EZWNsYXJlTW9kdWxlOlxuICAgICAgXCJJbXBvcnRzIHdpdGhpbiBhIGBkZWNsYXJlIG1vZHVsZWAgYm9keSBtdXN0IGFsd2F5cyBiZSBgaW1wb3J0IHR5cGVgIG9yIGBpbXBvcnQgdHlwZW9mYC5cIixcbiAgICBNaXNzaW5nVHlwZVBhcmFtRGVmYXVsdDpcbiAgICAgIFwiVHlwZSBwYXJhbWV0ZXIgZGVjbGFyYXRpb24gbmVlZHMgYSBkZWZhdWx0LCBzaW5jZSBhIHByZWNlZGluZyB0eXBlIHBhcmFtZXRlciBkZWNsYXJhdGlvbiBoYXMgYSBkZWZhdWx0LlwiLFxuICAgIE5lc3RlZERlY2xhcmVNb2R1bGU6XG4gICAgICBcImBkZWNsYXJlIG1vZHVsZWAgY2Fubm90IGJlIHVzZWQgaW5zaWRlIGFub3RoZXIgYGRlY2xhcmUgbW9kdWxlYC5cIixcbiAgICBOZXN0ZWRGbG93Q29tbWVudDpcbiAgICAgIFwiQ2Fubm90IGhhdmUgYSBmbG93IGNvbW1lbnQgaW5zaWRlIGFub3RoZXIgZmxvdyBjb21tZW50LlwiLFxuICAgIE9wdGlvbmFsQmluZGluZ1BhdHRlcm46XG4gICAgICBcIkEgYmluZGluZyBwYXR0ZXJuIHBhcmFtZXRlciBjYW5ub3QgYmUgb3B0aW9uYWwgaW4gYW4gaW1wbGVtZW50YXRpb24gc2lnbmF0dXJlLlwiLFxuICAgIFNldHRlck1heU5vdEhhdmVUaGlzUGFyYW06IFwiQSBzZXR0ZXIgY2Fubm90IGhhdmUgYSBgdGhpc2AgcGFyYW1ldGVyLlwiLFxuICAgIFNwcmVhZFZhcmlhbmNlOiBcIlNwcmVhZCBwcm9wZXJ0aWVzIGNhbm5vdCBoYXZlIHZhcmlhbmNlLlwiLFxuICAgIFRoaXNQYXJhbUFubm90YXRpb25SZXF1aXJlZDpcbiAgICAgIFwiQSB0eXBlIGFubm90YXRpb24gaXMgcmVxdWlyZWQgZm9yIHRoZSBgdGhpc2AgcGFyYW1ldGVyLlwiLFxuICAgIFRoaXNQYXJhbUJhbm5lZEluQ29uc3RydWN0b3I6XG4gICAgICBcIkNvbnN0cnVjdG9ycyBjYW5ub3QgaGF2ZSBhIGB0aGlzYCBwYXJhbWV0ZXI7IGNvbnN0cnVjdG9ycyBkb24ndCBiaW5kIGB0aGlzYCBsaWtlIG90aGVyIGZ1bmN0aW9ucy5cIixcbiAgICBUaGlzUGFyYW1NYXlOb3RCZU9wdGlvbmFsOiBcIlRoZSBgdGhpc2AgcGFyYW1ldGVyIGNhbm5vdCBiZSBvcHRpb25hbC5cIixcbiAgICBUaGlzUGFyYW1NdXN0QmVGaXJzdDpcbiAgICAgIFwiVGhlIGB0aGlzYCBwYXJhbWV0ZXIgbXVzdCBiZSB0aGUgZmlyc3QgZnVuY3Rpb24gcGFyYW1ldGVyLlwiLFxuICAgIFRoaXNQYXJhbU5vRGVmYXVsdDogXCJUaGUgYHRoaXNgIHBhcmFtZXRlciBtYXkgbm90IGhhdmUgYSBkZWZhdWx0IHZhbHVlLlwiLFxuICAgIFR5cGVCZWZvcmVJbml0aWFsaXplcjpcbiAgICAgIFwiVHlwZSBhbm5vdGF0aW9ucyBtdXN0IGNvbWUgYmVmb3JlIGRlZmF1bHQgYXNzaWdubWVudHMsIGUuZy4gaW5zdGVhZCBvZiBgYWdlID0gMjU6IG51bWJlcmAgdXNlIGBhZ2U6IG51bWJlciA9IDI1YC5cIixcbiAgICBUeXBlQ2FzdEluUGF0dGVybjpcbiAgICAgIFwiVGhlIHR5cGUgY2FzdCBleHByZXNzaW9uIGlzIGV4cGVjdGVkIHRvIGJlIHdyYXBwZWQgd2l0aCBwYXJlbnRoZXNpcy5cIixcbiAgICBVbmV4cGVjdGVkRXhwbGljaXRJbmV4YWN0SW5PYmplY3Q6XG4gICAgICBcIkV4cGxpY2l0IGluZXhhY3Qgc3ludGF4IG11c3QgYXBwZWFyIGF0IHRoZSBlbmQgb2YgYW4gaW5leGFjdCBvYmplY3QuXCIsXG4gICAgVW5leHBlY3RlZFJlc2VydmVkVHlwZTogXCJVbmV4cGVjdGVkIHJlc2VydmVkIHR5cGUgJTAuXCIsXG4gICAgVW5leHBlY3RlZFJlc2VydmVkVW5kZXJzY29yZTpcbiAgICAgIFwiYF9gIGlzIG9ubHkgYWxsb3dlZCBhcyBhIHR5cGUgYXJndW1lbnQgdG8gY2FsbCBvciBuZXcuXCIsXG4gICAgVW5leHBlY3RlZFNwYWNlQmV0d2Vlbk1vZHVsb0NoZWNrczpcbiAgICAgIFwiU3BhY2VzIGJldHdlZW4gYCVgIGFuZCBgY2hlY2tzYCBhcmUgbm90IGFsbG93ZWQgaGVyZS5cIixcbiAgICBVbmV4cGVjdGVkU3ByZWFkVHlwZTpcbiAgICAgIFwiU3ByZWFkIG9wZXJhdG9yIGNhbm5vdCBhcHBlYXIgaW4gY2xhc3Mgb3IgaW50ZXJmYWNlIGRlZmluaXRpb25zLlwiLFxuICAgIFVuZXhwZWN0ZWRTdWJ0cmFjdGlvbk9wZXJhbmQ6XG4gICAgICAnVW5leHBlY3RlZCB0b2tlbiwgZXhwZWN0ZWQgXCJudW1iZXJcIiBvciBcImJpZ2ludFwiLicsXG4gICAgVW5leHBlY3RlZFRva2VuQWZ0ZXJUeXBlUGFyYW1ldGVyOlxuICAgICAgXCJFeHBlY3RlZCBhbiBhcnJvdyBmdW5jdGlvbiBhZnRlciB0aGlzIHR5cGUgcGFyYW1ldGVyIGRlY2xhcmF0aW9uLlwiLFxuICAgIFVuZXhwZWN0ZWRUeXBlUGFyYW1ldGVyQmVmb3JlQXN5bmNBcnJvd0Z1bmN0aW9uOlxuICAgICAgXCJUeXBlIHBhcmFtZXRlcnMgbXVzdCBjb21lIGFmdGVyIHRoZSBhc3luYyBrZXl3b3JkLCBlLmcuIGluc3RlYWQgb2YgYDxUPiBhc3luYyAoKSA9PiB7fWAsIHVzZSBgYXN5bmMgPFQ+KCkgPT4ge31gLlwiLFxuICAgIFVuc3VwcG9ydGVkRGVjbGFyZUV4cG9ydEtpbmQ6XG4gICAgICBcImBkZWNsYXJlIGV4cG9ydCAlMGAgaXMgbm90IHN1cHBvcnRlZC4gVXNlIGAlMWAgaW5zdGVhZC5cIixcbiAgICBVbnN1cHBvcnRlZFN0YXRlbWVudEluRGVjbGFyZU1vZHVsZTpcbiAgICAgIFwiT25seSBkZWNsYXJlcyBhbmQgdHlwZSBpbXBvcnRzIGFyZSBhbGxvd2VkIGluc2lkZSBkZWNsYXJlIG1vZHVsZS5cIixcbiAgICBVbnRlcm1pbmF0ZWRGbG93Q29tbWVudDogXCJVbnRlcm1pbmF0ZWQgZmxvdy1jb21tZW50LlwiLFxuICB9LFxuICAvKiBjb2RlICovIEVycm9yQ29kZXMuU3ludGF4RXJyb3IsXG4pO1xuLyogZXNsaW50LWRpc2FibGUgc29ydC1rZXlzICovXG5cbmZ1bmN0aW9uIGlzRXNNb2R1bGVUeXBlKGJvZHlFbGVtZW50OiBOLk5vZGUpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBib2R5RWxlbWVudC50eXBlID09PSBcIkRlY2xhcmVFeHBvcnRBbGxEZWNsYXJhdGlvblwiIHx8XG4gICAgKGJvZHlFbGVtZW50LnR5cGUgPT09IFwiRGVjbGFyZUV4cG9ydERlY2xhcmF0aW9uXCIgJiZcbiAgICAgICghYm9keUVsZW1lbnQuZGVjbGFyYXRpb24gfHxcbiAgICAgICAgKGJvZHlFbGVtZW50LmRlY2xhcmF0aW9uLnR5cGUgIT09IFwiVHlwZUFsaWFzXCIgJiZcbiAgICAgICAgICBib2R5RWxlbWVudC5kZWNsYXJhdGlvbi50eXBlICE9PSBcIkludGVyZmFjZURlY2xhcmF0aW9uXCIpKSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gaGFzVHlwZUltcG9ydEtpbmQobm9kZTogTi5Ob2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiBub2RlLmltcG9ydEtpbmQgPT09IFwidHlwZVwiIHx8IG5vZGUuaW1wb3J0S2luZCA9PT0gXCJ0eXBlb2ZcIjtcbn1cblxuZnVuY3Rpb24gaXNNYXliZURlZmF1bHRJbXBvcnQoc3RhdGU6IHsgdHlwZTogVG9rZW5UeXBlLCB2YWx1ZTogYW55IH0pOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAoc3RhdGUudHlwZSA9PT0gdHQubmFtZSB8fCAhIXN0YXRlLnR5cGUua2V5d29yZCkgJiYgc3RhdGUudmFsdWUgIT09IFwiZnJvbVwiXG4gICk7XG59XG5cbmNvbnN0IGV4cG9ydFN1Z2dlc3Rpb25zID0ge1xuICBjb25zdDogXCJkZWNsYXJlIGV4cG9ydCB2YXJcIixcbiAgbGV0OiBcImRlY2xhcmUgZXhwb3J0IHZhclwiLFxuICB0eXBlOiBcImV4cG9ydCB0eXBlXCIsXG4gIGludGVyZmFjZTogXCJleHBvcnQgaW50ZXJmYWNlXCIsXG59O1xuXG4vLyBMaWtlIEFycmF5I2ZpbHRlciwgYnV0IHJldHVybnMgYSB0dXBsZSBbIGFjY2VwdGVkRWxlbWVudHMsIGRpc2NhcmRlZEVsZW1lbnRzIF1cbmZ1bmN0aW9uIHBhcnRpdGlvbjxUPihcbiAgbGlzdDogVFtdLFxuICB0ZXN0OiAoVCwgbnVtYmVyLCBUW10pID0+ID9ib29sZWFuLFxuKTogW1RbXSwgVFtdXSB7XG4gIGNvbnN0IGxpc3QxID0gW107XG4gIGNvbnN0IGxpc3QyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICh0ZXN0KGxpc3RbaV0sIGksIGxpc3QpID8gbGlzdDEgOiBsaXN0MikucHVzaChsaXN0W2ldKTtcbiAgfVxuICByZXR1cm4gW2xpc3QxLCBsaXN0Ml07XG59XG5cbmNvbnN0IEZMT1dfUFJBR01BX1JFR0VYID0gL1xcKj9cXHMqQCgoPzpubyk/ZmxvdylcXGIvO1xuXG4vLyBGbG93IGVudW1zIHR5cGVzXG50eXBlIEVudW1FeHBsaWNpdFR5cGUgPSBudWxsIHwgXCJib29sZWFuXCIgfCBcIm51bWJlclwiIHwgXCJzdHJpbmdcIiB8IFwic3ltYm9sXCI7XG50eXBlIEVudW1Db250ZXh0ID0ge3xcbiAgZW51bU5hbWU6IHN0cmluZyxcbiAgZXhwbGljaXRUeXBlOiBFbnVtRXhwbGljaXRUeXBlLFxuICBtZW1iZXJOYW1lOiBzdHJpbmcsXG58fTtcbnR5cGUgRW51bU1lbWJlckluaXQgPVxuICB8IHt8IHR5cGU6IFwibnVtYmVyXCIsIHBvczogbnVtYmVyLCB2YWx1ZTogTi5Ob2RlIHx9XG4gIHwge3wgdHlwZTogXCJzdHJpbmdcIiwgcG9zOiBudW1iZXIsIHZhbHVlOiBOLk5vZGUgfH1cbiAgfCB7fCB0eXBlOiBcImJvb2xlYW5cIiwgcG9zOiBudW1iZXIsIHZhbHVlOiBOLk5vZGUgfH1cbiAgfCB7fCB0eXBlOiBcImludmFsaWRcIiwgcG9zOiBudW1iZXIgfH1cbiAgfCB7fCB0eXBlOiBcIm5vbmVcIiwgcG9zOiBudW1iZXIgfH07XG5cbmV4cG9ydCBkZWZhdWx0IChzdXBlckNsYXNzOiBDbGFzczxQYXJzZXI+KTogQ2xhc3M8UGFyc2VyPiA9PlxuICBjbGFzcyBleHRlbmRzIHN1cGVyQ2xhc3Mge1xuICAgIC8vIFRoZSB2YWx1ZSBvZiB0aGUgQGZsb3cvQG5vZmxvdyBwcmFnbWEuIEluaXRpYWxseSB1bmRlZmluZWQsIHRyYW5zaXRpb25zXG4gICAgLy8gdG8gXCJAZmxvd1wiIG9yIFwiQG5vZmxvd1wiIGlmIHdlIHNlZSBhIHByYWdtYS4gVHJhbnNpdGlvbnMgdG8gbnVsbCBpZiB3ZSBhcmVcbiAgICAvLyBwYXN0IHRoZSBpbml0aWFsIGNvbW1lbnQuXG4gICAgZmxvd1ByYWdtYTogdm9pZCB8IG51bGwgfCBcImZsb3dcIiB8IFwibm9mbG93XCIgPSB1bmRlZmluZWQ7XG5cbiAgICBnZXRTY29wZUhhbmRsZXIoKTogQ2xhc3M8Rmxvd1Njb3BlSGFuZGxlcj4ge1xuICAgICAgcmV0dXJuIEZsb3dTY29wZUhhbmRsZXI7XG4gICAgfVxuXG4gICAgc2hvdWxkUGFyc2VUeXBlcygpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFBsdWdpbk9wdGlvbihcImZsb3dcIiwgXCJhbGxcIikgfHwgdGhpcy5mbG93UHJhZ21hID09PSBcImZsb3dcIjtcbiAgICB9XG5cbiAgICBzaG91bGRQYXJzZUVudW1zKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuICEhdGhpcy5nZXRQbHVnaW5PcHRpb24oXCJmbG93XCIsIFwiZW51bXNcIik7XG4gICAgfVxuXG4gICAgZmluaXNoVG9rZW4odHlwZTogVG9rZW5UeXBlLCB2YWw6IGFueSk6IHZvaWQge1xuICAgICAgaWYgKFxuICAgICAgICB0eXBlICE9PSB0dC5zdHJpbmcgJiZcbiAgICAgICAgdHlwZSAhPT0gdHQuc2VtaSAmJlxuICAgICAgICB0eXBlICE9PSB0dC5pbnRlcnByZXRlckRpcmVjdGl2ZVxuICAgICAgKSB7XG4gICAgICAgIGlmICh0aGlzLmZsb3dQcmFnbWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMuZmxvd1ByYWdtYSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5maW5pc2hUb2tlbih0eXBlLCB2YWwpO1xuICAgIH1cblxuICAgIGFkZENvbW1lbnQoY29tbWVudDogTi5Db21tZW50KTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5mbG93UHJhZ21hID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gVHJ5IHRvIHBhcnNlIGEgZmxvdyBwcmFnbWEuXG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBGTE9XX1BSQUdNQV9SRUdFWC5leGVjKGNvbW1lbnQudmFsdWUpO1xuICAgICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlc1sxXSA9PT0gXCJmbG93XCIpIHtcbiAgICAgICAgICB0aGlzLmZsb3dQcmFnbWEgPSBcImZsb3dcIjtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVzWzFdID09PSBcIm5vZmxvd1wiKSB7XG4gICAgICAgICAgdGhpcy5mbG93UHJhZ21hID0gXCJub2Zsb3dcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGZsb3cgcHJhZ21hXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIuYWRkQ29tbWVudChjb21tZW50KTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VUeXBlSW5pdGlhbGlzZXIodG9rPzogVG9rZW5UeXBlKTogTi5GbG93VHlwZSB7XG4gICAgICBjb25zdCBvbGRJblR5cGUgPSB0aGlzLnN0YXRlLmluVHlwZTtcbiAgICAgIHRoaXMuc3RhdGUuaW5UeXBlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZXhwZWN0KHRvayB8fCB0dC5jb2xvbik7XG5cbiAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLmZsb3dQYXJzZVR5cGUoKTtcbiAgICAgIHRoaXMuc3RhdGUuaW5UeXBlID0gb2xkSW5UeXBlO1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlUHJlZGljYXRlKCk6IE4uRmxvd1R5cGUge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBjb25zdCBtb2R1bG9Qb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBgJWBcbiAgICAgIHRoaXMuZXhwZWN0Q29udGV4dHVhbChcImNoZWNrc1wiKTtcbiAgICAgIC8vIEZvcmNlICclJyBhbmQgJ2NoZWNrcycgdG8gYmUgYWRqYWNlbnRcbiAgICAgIGlmICh0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCA+IG1vZHVsb1BvcyArIDEpIHtcbiAgICAgICAgdGhpcy5yYWlzZShtb2R1bG9Qb3MsIEZsb3dFcnJvcnMuVW5leHBlY3RlZFNwYWNlQmV0d2Vlbk1vZHVsb0NoZWNrcyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lYXQodHQucGFyZW5MKSkge1xuICAgICAgICBub2RlLnZhbHVlID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkRlY2xhcmVkUHJlZGljYXRlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkluZmVycmVkUHJlZGljYXRlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZsb3dQYXJzZVR5cGVBbmRQcmVkaWNhdGVJbml0aWFsaXNlcigpOiBbP04uRmxvd1R5cGUsID9OLkZsb3dQcmVkaWNhdGVdIHtcbiAgICAgIGNvbnN0IG9sZEluVHlwZSA9IHRoaXMuc3RhdGUuaW5UeXBlO1xuICAgICAgdGhpcy5zdGF0ZS5pblR5cGUgPSB0cnVlO1xuICAgICAgdGhpcy5leHBlY3QodHQuY29sb24pO1xuICAgICAgbGV0IHR5cGUgPSBudWxsO1xuICAgICAgbGV0IHByZWRpY2F0ZSA9IG51bGw7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5tb2R1bG8pKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuaW5UeXBlID0gb2xkSW5UeXBlO1xuICAgICAgICBwcmVkaWNhdGUgPSB0aGlzLmZsb3dQYXJzZVByZWRpY2F0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZSA9IHRoaXMuZmxvd1BhcnNlVHlwZSgpO1xuICAgICAgICB0aGlzLnN0YXRlLmluVHlwZSA9IG9sZEluVHlwZTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2godHQubW9kdWxvKSkge1xuICAgICAgICAgIHByZWRpY2F0ZSA9IHRoaXMuZmxvd1BhcnNlUHJlZGljYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBbdHlwZSwgcHJlZGljYXRlXTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VEZWNsYXJlQ2xhc3Mobm9kZTogTi5GbG93RGVjbGFyZUNsYXNzKTogTi5GbG93RGVjbGFyZUNsYXNzIHtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgdGhpcy5mbG93UGFyc2VJbnRlcmZhY2Vpc2gobm9kZSwgLyppc0NsYXNzKi8gdHJ1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRGVjbGFyZUNsYXNzXCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZURlY2xhcmVGdW5jdGlvbihcbiAgICAgIG5vZGU6IE4uRmxvd0RlY2xhcmVGdW5jdGlvbixcbiAgICApOiBOLkZsb3dEZWNsYXJlRnVuY3Rpb24ge1xuICAgICAgdGhpcy5uZXh0KCk7XG5cbiAgICAgIGNvbnN0IGlkID0gKG5vZGUuaWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpKTtcblxuICAgICAgY29uc3QgdHlwZU5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgY29uc3QgdHlwZUNvbnRhaW5lciA9IHRoaXMuc3RhcnROb2RlKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgdHlwZU5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZU5vZGUudHlwZVBhcmFtZXRlcnMgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4cGVjdCh0dC5wYXJlbkwpO1xuICAgICAgY29uc3QgdG1wID0gdGhpcy5mbG93UGFyc2VGdW5jdGlvblR5cGVQYXJhbXMoKTtcbiAgICAgIHR5cGVOb2RlLnBhcmFtcyA9IHRtcC5wYXJhbXM7XG4gICAgICB0eXBlTm9kZS5yZXN0ID0gdG1wLnJlc3Q7XG4gICAgICB0eXBlTm9kZS50aGlzID0gdG1wLl90aGlzO1xuICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcblxuICAgICAgW1xuICAgICAgICAvLyAkRmxvd0ZpeE1lIChkZXN0cnVjdHVyaW5nIG5vdCBzdXBwb3J0ZWQgeWV0KVxuICAgICAgICB0eXBlTm9kZS5yZXR1cm5UeXBlLFxuICAgICAgICAvLyAkRmxvd0ZpeE1lIChkZXN0cnVjdHVyaW5nIG5vdCBzdXBwb3J0ZWQgeWV0KVxuICAgICAgICBub2RlLnByZWRpY2F0ZSxcbiAgICAgIF0gPSB0aGlzLmZsb3dQYXJzZVR5cGVBbmRQcmVkaWNhdGVJbml0aWFsaXNlcigpO1xuXG4gICAgICB0eXBlQ29udGFpbmVyLnR5cGVBbm5vdGF0aW9uID0gdGhpcy5maW5pc2hOb2RlKFxuICAgICAgICB0eXBlTm9kZSxcbiAgICAgICAgXCJGdW5jdGlvblR5cGVBbm5vdGF0aW9uXCIsXG4gICAgICApO1xuXG4gICAgICBpZC50eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmluaXNoTm9kZSh0eXBlQ29udGFpbmVyLCBcIlR5cGVBbm5vdGF0aW9uXCIpO1xuXG4gICAgICB0aGlzLnJlc2V0RW5kTG9jYXRpb24oaWQpO1xuICAgICAgdGhpcy5zZW1pY29sb24oKTtcblxuICAgICAgdGhpcy5zY29wZS5kZWNsYXJlTmFtZShub2RlLmlkLm5hbWUsIEJJTkRfRkxPV19ERUNMQVJFX0ZOLCBub2RlLmlkLnN0YXJ0KTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkRlY2xhcmVGdW5jdGlvblwiKTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VEZWNsYXJlKFxuICAgICAgbm9kZTogTi5GbG93RGVjbGFyZSxcbiAgICAgIGluc2lkZU1vZHVsZT86IGJvb2xlYW4sXG4gICAgKTogTi5GbG93RGVjbGFyZSB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5fY2xhc3MpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZsb3dQYXJzZURlY2xhcmVDbGFzcyhub2RlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5fZnVuY3Rpb24pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZsb3dQYXJzZURlY2xhcmVGdW5jdGlvbihub2RlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5fdmFyKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VEZWNsYXJlVmFyaWFibGUobm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWF0Q29udGV4dHVhbChcIm1vZHVsZVwiKSkge1xuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5kb3QpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlRGVjbGFyZU1vZHVsZUV4cG9ydHMobm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGluc2lkZU1vZHVsZSkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCwgRmxvd0Vycm9ycy5OZXN0ZWREZWNsYXJlTW9kdWxlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlRGVjbGFyZU1vZHVsZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29udGV4dHVhbChcInR5cGVcIikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlRGVjbGFyZVR5cGVBbGlhcyhub2RlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbnRleHR1YWwoXCJvcGFxdWVcIikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlRGVjbGFyZU9wYXF1ZVR5cGUobm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwiaW50ZXJmYWNlXCIpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZsb3dQYXJzZURlY2xhcmVJbnRlcmZhY2Uobm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2godHQuX2V4cG9ydCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlRGVjbGFyZUV4cG9ydERlY2xhcmF0aW9uKG5vZGUsIGluc2lkZU1vZHVsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmbG93UGFyc2VEZWNsYXJlVmFyaWFibGUoXG4gICAgICBub2RlOiBOLkZsb3dEZWNsYXJlVmFyaWFibGUsXG4gICAgKTogTi5GbG93RGVjbGFyZVZhcmlhYmxlIHtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgbm9kZS5pZCA9IHRoaXMuZmxvd1BhcnNlVHlwZUFubm90YXRhYmxlSWRlbnRpZmllcihcbiAgICAgICAgLyphbGxvd1ByaW1pdGl2ZU92ZXJyaWRlKi8gdHJ1ZSxcbiAgICAgICk7XG4gICAgICB0aGlzLnNjb3BlLmRlY2xhcmVOYW1lKG5vZGUuaWQubmFtZSwgQklORF9WQVIsIG5vZGUuaWQuc3RhcnQpO1xuICAgICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJEZWNsYXJlVmFyaWFibGVcIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlRGVjbGFyZU1vZHVsZShub2RlOiBOLkZsb3dEZWNsYXJlTW9kdWxlKTogTi5GbG93RGVjbGFyZU1vZHVsZSB7XG4gICAgICB0aGlzLnNjb3BlLmVudGVyKFNDT1BFX09USEVSKTtcblxuICAgICAgaWYgKHRoaXMubWF0Y2godHQuc3RyaW5nKSkge1xuICAgICAgICBub2RlLmlkID0gdGhpcy5wYXJzZUV4cHJBdG9tKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLmlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYm9keU5vZGUgPSAobm9kZS5ib2R5ID0gdGhpcy5zdGFydE5vZGUoKSk7XG4gICAgICBjb25zdCBib2R5ID0gKGJvZHlOb2RlLmJvZHkgPSBbXSk7XG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFjZUwpO1xuICAgICAgd2hpbGUgKCF0aGlzLm1hdGNoKHR0LmJyYWNlUikpIHtcbiAgICAgICAgbGV0IGJvZHlOb2RlID0gdGhpcy5zdGFydE5vZGUoKTtcblxuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5faW1wb3J0KSkge1xuICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgIGlmICghdGhpcy5pc0NvbnRleHR1YWwoXCJ0eXBlXCIpICYmICF0aGlzLm1hdGNoKHR0Ll90eXBlb2YpKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCxcbiAgICAgICAgICAgICAgRmxvd0Vycm9ycy5JbnZhbGlkTm9uVHlwZUltcG9ydEluRGVjbGFyZU1vZHVsZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucGFyc2VJbXBvcnQoYm9keU5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXhwZWN0Q29udGV4dHVhbChcbiAgICAgICAgICAgIFwiZGVjbGFyZVwiLFxuICAgICAgICAgICAgRmxvd0Vycm9ycy5VbnN1cHBvcnRlZFN0YXRlbWVudEluRGVjbGFyZU1vZHVsZSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgYm9keU5vZGUgPSB0aGlzLmZsb3dQYXJzZURlY2xhcmUoYm9keU5vZGUsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9keS5wdXNoKGJvZHlOb2RlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zY29wZS5leGl0KCk7XG5cbiAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlUik7XG5cbiAgICAgIHRoaXMuZmluaXNoTm9kZShib2R5Tm9kZSwgXCJCbG9ja1N0YXRlbWVudFwiKTtcblxuICAgICAgbGV0IGtpbmQgPSBudWxsO1xuICAgICAgbGV0IGhhc01vZHVsZUV4cG9ydCA9IGZhbHNlO1xuICAgICAgYm9keS5mb3JFYWNoKGJvZHlFbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGlzRXNNb2R1bGVUeXBlKGJvZHlFbGVtZW50KSkge1xuICAgICAgICAgIGlmIChraW5kID09PSBcIkNvbW1vbkpTXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgIGJvZHlFbGVtZW50LnN0YXJ0LFxuICAgICAgICAgICAgICBGbG93RXJyb3JzLkFtYmlndW91c0RlY2xhcmVNb2R1bGVLaW5kLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAga2luZCA9IFwiRVNcIjtcbiAgICAgICAgfSBlbHNlIGlmIChib2R5RWxlbWVudC50eXBlID09PSBcIkRlY2xhcmVNb2R1bGVFeHBvcnRzXCIpIHtcbiAgICAgICAgICBpZiAoaGFzTW9kdWxlRXhwb3J0KSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgICBib2R5RWxlbWVudC5zdGFydCxcbiAgICAgICAgICAgICAgRmxvd0Vycm9ycy5EdXBsaWNhdGVEZWNsYXJlTW9kdWxlRXhwb3J0cyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChraW5kID09PSBcIkVTXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgIGJvZHlFbGVtZW50LnN0YXJ0LFxuICAgICAgICAgICAgICBGbG93RXJyb3JzLkFtYmlndW91c0RlY2xhcmVNb2R1bGVLaW5kLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAga2luZCA9IFwiQ29tbW9uSlNcIjtcbiAgICAgICAgICBoYXNNb2R1bGVFeHBvcnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbm9kZS5raW5kID0ga2luZCB8fCBcIkNvbW1vbkpTXCI7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRGVjbGFyZU1vZHVsZVwiKTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VEZWNsYXJlRXhwb3J0RGVjbGFyYXRpb24oXG4gICAgICBub2RlOiBOLkZsb3dEZWNsYXJlRXhwb3J0RGVjbGFyYXRpb24sXG4gICAgICBpbnNpZGVNb2R1bGU6ID9ib29sZWFuLFxuICAgICk6IE4uRmxvd0RlY2xhcmVFeHBvcnREZWNsYXJhdGlvbiB7XG4gICAgICB0aGlzLmV4cGVjdCh0dC5fZXhwb3J0KTtcblxuICAgICAgaWYgKHRoaXMuZWF0KHR0Ll9kZWZhdWx0KSkge1xuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5fZnVuY3Rpb24pIHx8IHRoaXMubWF0Y2godHQuX2NsYXNzKSkge1xuICAgICAgICAgIC8vIGRlY2xhcmUgZXhwb3J0IGRlZmF1bHQgY2xhc3MgLi4uXG4gICAgICAgICAgLy8gZGVjbGFyZSBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAuLi5cbiAgICAgICAgICBub2RlLmRlY2xhcmF0aW9uID0gdGhpcy5mbG93UGFyc2VEZWNsYXJlKHRoaXMuc3RhcnROb2RlKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRlY2xhcmUgZXhwb3J0IGRlZmF1bHQgW3R5cGVdO1xuICAgICAgICAgIG5vZGUuZGVjbGFyYXRpb24gPSB0aGlzLmZsb3dQYXJzZVR5cGUoKTtcbiAgICAgICAgICB0aGlzLnNlbWljb2xvbigpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUuZGVmYXVsdCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkRlY2xhcmVFeHBvcnREZWNsYXJhdGlvblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLm1hdGNoKHR0Ll9jb25zdCkgfHxcbiAgICAgICAgICB0aGlzLmlzTGV0KCkgfHxcbiAgICAgICAgICAoKHRoaXMuaXNDb250ZXh0dWFsKFwidHlwZVwiKSB8fCB0aGlzLmlzQ29udGV4dHVhbChcImludGVyZmFjZVwiKSkgJiZcbiAgICAgICAgICAgICFpbnNpZGVNb2R1bGUpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgICBjb25zdCBzdWdnZXN0aW9uID0gZXhwb3J0U3VnZ2VzdGlvbnNbbGFiZWxdO1xuXG4gICAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RhcnQsXG4gICAgICAgICAgICBGbG93RXJyb3JzLlVuc3VwcG9ydGVkRGVjbGFyZUV4cG9ydEtpbmQsXG4gICAgICAgICAgICBsYWJlbCxcbiAgICAgICAgICAgIHN1Z2dlc3Rpb24sXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLm1hdGNoKHR0Ll92YXIpIHx8IC8vIGRlY2xhcmUgZXhwb3J0IHZhciAuLi5cbiAgICAgICAgICB0aGlzLm1hdGNoKHR0Ll9mdW5jdGlvbikgfHwgLy8gZGVjbGFyZSBleHBvcnQgZnVuY3Rpb24gLi4uXG4gICAgICAgICAgdGhpcy5tYXRjaCh0dC5fY2xhc3MpIHx8IC8vIGRlY2xhcmUgZXhwb3J0IGNsYXNzIC4uLlxuICAgICAgICAgIHRoaXMuaXNDb250ZXh0dWFsKFwib3BhcXVlXCIpIC8vIGRlY2xhcmUgZXhwb3J0IG9wYXF1ZSAuLlxuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLmRlY2xhcmF0aW9uID0gdGhpcy5mbG93UGFyc2VEZWNsYXJlKHRoaXMuc3RhcnROb2RlKCkpO1xuICAgICAgICAgIG5vZGUuZGVmYXVsdCA9IGZhbHNlO1xuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkRlY2xhcmVFeHBvcnREZWNsYXJhdGlvblwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICB0aGlzLm1hdGNoKHR0LnN0YXIpIHx8IC8vIGRlY2xhcmUgZXhwb3J0ICogZnJvbSAnJ1xuICAgICAgICAgIHRoaXMubWF0Y2godHQuYnJhY2VMKSB8fCAvLyBkZWNsYXJlIGV4cG9ydCB7fSAuLi5cbiAgICAgICAgICB0aGlzLmlzQ29udGV4dHVhbChcImludGVyZmFjZVwiKSB8fCAvLyBkZWNsYXJlIGV4cG9ydCBpbnRlcmZhY2UgLi4uXG4gICAgICAgICAgdGhpcy5pc0NvbnRleHR1YWwoXCJ0eXBlXCIpIHx8IC8vIGRlY2xhcmUgZXhwb3J0IHR5cGUgLi4uXG4gICAgICAgICAgdGhpcy5pc0NvbnRleHR1YWwoXCJvcGFxdWVcIikgLy8gZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgLi4uXG4gICAgICAgICkge1xuICAgICAgICAgIG5vZGUgPSB0aGlzLnBhcnNlRXhwb3J0KG5vZGUpO1xuICAgICAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiRXhwb3J0TmFtZWREZWNsYXJhdGlvblwiKSB7XG4gICAgICAgICAgICAvLyBmbG93IGRvZXMgbm90IHN1cHBvcnQgdGhlIEV4cG9ydE5hbWVkRGVjbGFyYXRpb25cbiAgICAgICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgICAgICBub2RlLnR5cGUgPSBcIkV4cG9ydERlY2xhcmF0aW9uXCI7XG4gICAgICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgICAgICBub2RlLmRlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIGRlbGV0ZSBub2RlLmV4cG9ydEtpbmQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgICAgICBub2RlLnR5cGUgPSBcIkRlY2xhcmVcIiArIG5vZGUudHlwZTtcblxuICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRocm93IHRoaXMudW5leHBlY3RlZCgpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZURlY2xhcmVNb2R1bGVFeHBvcnRzKFxuICAgICAgbm9kZTogTi5GbG93RGVjbGFyZU1vZHVsZUV4cG9ydHMsXG4gICAgKTogTi5GbG93RGVjbGFyZU1vZHVsZUV4cG9ydHMge1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICB0aGlzLmV4cGVjdENvbnRleHR1YWwoXCJleHBvcnRzXCIpO1xuICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmxvd1BhcnNlVHlwZUFubm90YXRpb24oKTtcbiAgICAgIHRoaXMuc2VtaWNvbG9uKCk7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJEZWNsYXJlTW9kdWxlRXhwb3J0c1wiKTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VEZWNsYXJlVHlwZUFsaWFzKFxuICAgICAgbm9kZTogTi5GbG93RGVjbGFyZVR5cGVBbGlhcyxcbiAgICApOiBOLkZsb3dEZWNsYXJlVHlwZUFsaWFzIHtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgdGhpcy5mbG93UGFyc2VUeXBlQWxpYXMobm9kZSk7XG4gICAgICAvLyBEb24ndCBkbyBmaW5pc2hOb2RlIGFzIHdlIGRvbid0IHdhbnQgdG8gcHJvY2VzcyBjb21tZW50cyB0d2ljZVxuICAgICAgbm9kZS50eXBlID0gXCJEZWNsYXJlVHlwZUFsaWFzXCI7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VEZWNsYXJlT3BhcXVlVHlwZShcbiAgICAgIG5vZGU6IE4uRmxvd0RlY2xhcmVPcGFxdWVUeXBlLFxuICAgICk6IE4uRmxvd0RlY2xhcmVPcGFxdWVUeXBlIHtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgdGhpcy5mbG93UGFyc2VPcGFxdWVUeXBlKG5vZGUsIHRydWUpO1xuICAgICAgLy8gRG9uJ3QgZG8gZmluaXNoTm9kZSBhcyB3ZSBkb24ndCB3YW50IHRvIHByb2Nlc3MgY29tbWVudHMgdHdpY2VcbiAgICAgIG5vZGUudHlwZSA9IFwiRGVjbGFyZU9wYXF1ZVR5cGVcIjtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZURlY2xhcmVJbnRlcmZhY2UoXG4gICAgICBub2RlOiBOLkZsb3dEZWNsYXJlSW50ZXJmYWNlLFxuICAgICk6IE4uRmxvd0RlY2xhcmVJbnRlcmZhY2Uge1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICB0aGlzLmZsb3dQYXJzZUludGVyZmFjZWlzaChub2RlKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJEZWNsYXJlSW50ZXJmYWNlXCIpO1xuICAgIH1cblxuICAgIC8vIEludGVyZmFjZXNcblxuICAgIGZsb3dQYXJzZUludGVyZmFjZWlzaChcbiAgICAgIG5vZGU6IE4uRmxvd0RlY2xhcmUsXG4gICAgICBpc0NsYXNzPzogYm9vbGVhbiA9IGZhbHNlLFxuICAgICk6IHZvaWQge1xuICAgICAgbm9kZS5pZCA9IHRoaXMuZmxvd1BhcnNlUmVzdHJpY3RlZElkZW50aWZpZXIoXG4gICAgICAgIC8qIGxpYmVyYWwgKi8gIWlzQ2xhc3MsXG4gICAgICAgIC8qIGRlY2xhcmF0aW9uICovIHRydWUsXG4gICAgICApO1xuXG4gICAgICB0aGlzLnNjb3BlLmRlY2xhcmVOYW1lKFxuICAgICAgICBub2RlLmlkLm5hbWUsXG4gICAgICAgIGlzQ2xhc3MgPyBCSU5EX0ZVTkNUSU9OIDogQklORF9MRVhJQ0FMLFxuICAgICAgICBub2RlLmlkLnN0YXJ0LFxuICAgICAgKTtcblxuICAgICAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBub2RlLmV4dGVuZHMgPSBbXTtcbiAgICAgIG5vZGUuaW1wbGVtZW50cyA9IFtdO1xuICAgICAgbm9kZS5taXhpbnMgPSBbXTtcblxuICAgICAgaWYgKHRoaXMuZWF0KHR0Ll9leHRlbmRzKSkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgbm9kZS5leHRlbmRzLnB1c2godGhpcy5mbG93UGFyc2VJbnRlcmZhY2VFeHRlbmRzKCkpO1xuICAgICAgICB9IHdoaWxlICghaXNDbGFzcyAmJiB0aGlzLmVhdCh0dC5jb21tYSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5pc0NvbnRleHR1YWwoXCJtaXhpbnNcIikpIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBub2RlLm1peGlucy5wdXNoKHRoaXMuZmxvd1BhcnNlSW50ZXJmYWNlRXh0ZW5kcygpKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5lYXQodHQuY29tbWEpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwiaW1wbGVtZW50c1wiKSkge1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIG5vZGUuaW1wbGVtZW50cy5wdXNoKHRoaXMuZmxvd1BhcnNlSW50ZXJmYWNlRXh0ZW5kcygpKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5lYXQodHQuY29tbWEpKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5ib2R5ID0gdGhpcy5mbG93UGFyc2VPYmplY3RUeXBlKHtcbiAgICAgICAgYWxsb3dTdGF0aWM6IGlzQ2xhc3MsXG4gICAgICAgIGFsbG93RXhhY3Q6IGZhbHNlLFxuICAgICAgICBhbGxvd1NwcmVhZDogZmFsc2UsXG4gICAgICAgIGFsbG93UHJvdG86IGlzQ2xhc3MsXG4gICAgICAgIGFsbG93SW5leGFjdDogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VJbnRlcmZhY2VFeHRlbmRzKCk6IE4uRmxvd0ludGVyZmFjZUV4dGVuZHMge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG5cbiAgICAgIG5vZGUuaWQgPSB0aGlzLmZsb3dQYXJzZVF1YWxpZmllZFR5cGVJZGVudGlmaWVyKCk7XG4gICAgICBpZiAodGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJJbnN0YW50aWF0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkludGVyZmFjZUV4dGVuZHNcIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlSW50ZXJmYWNlKG5vZGU6IE4uRmxvd0ludGVyZmFjZSk6IE4uRmxvd0ludGVyZmFjZSB7XG4gICAgICB0aGlzLmZsb3dQYXJzZUludGVyZmFjZWlzaChub2RlKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJJbnRlcmZhY2VEZWNsYXJhdGlvblwiKTtcbiAgICB9XG5cbiAgICBjaGVja05vdFVuZGVyc2NvcmUod29yZDogc3RyaW5nKSB7XG4gICAgICBpZiAod29yZCA9PT0gXCJfXCIpIHtcbiAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnN0YXJ0LCBGbG93RXJyb3JzLlVuZXhwZWN0ZWRSZXNlcnZlZFVuZGVyc2NvcmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrUmVzZXJ2ZWRUeXBlKHdvcmQ6IHN0cmluZywgc3RhcnRMb2M6IG51bWJlciwgZGVjbGFyYXRpb24/OiBib29sZWFuKSB7XG4gICAgICBpZiAoIXJlc2VydmVkVHlwZXMuaGFzKHdvcmQpKSByZXR1cm47XG5cbiAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgIHN0YXJ0TG9jLFxuICAgICAgICBkZWNsYXJhdGlvblxuICAgICAgICAgID8gRmxvd0Vycm9ycy5Bc3NpZ25SZXNlcnZlZFR5cGVcbiAgICAgICAgICA6IEZsb3dFcnJvcnMuVW5leHBlY3RlZFJlc2VydmVkVHlwZSxcbiAgICAgICAgd29yZCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlUmVzdHJpY3RlZElkZW50aWZpZXIoXG4gICAgICBsaWJlcmFsPzogYm9vbGVhbixcbiAgICAgIGRlY2xhcmF0aW9uPzogYm9vbGVhbixcbiAgICApOiBOLklkZW50aWZpZXIge1xuICAgICAgdGhpcy5jaGVja1Jlc2VydmVkVHlwZSh0aGlzLnN0YXRlLnZhbHVlLCB0aGlzLnN0YXRlLnN0YXJ0LCBkZWNsYXJhdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZUlkZW50aWZpZXIobGliZXJhbCk7XG4gICAgfVxuXG4gICAgLy8gVHlwZSBhbGlhc2VzXG5cbiAgICBmbG93UGFyc2VUeXBlQWxpYXMobm9kZTogTi5GbG93VHlwZUFsaWFzKTogTi5GbG93VHlwZUFsaWFzIHtcbiAgICAgIG5vZGUuaWQgPSB0aGlzLmZsb3dQYXJzZVJlc3RyaWN0ZWRJZGVudGlmaWVyKFxuICAgICAgICAvKiBsaWJlcmFsICovIGZhbHNlLFxuICAgICAgICAvKiBkZWNsYXJhdGlvbiAqLyB0cnVlLFxuICAgICAgKTtcbiAgICAgIHRoaXMuc2NvcGUuZGVjbGFyZU5hbWUobm9kZS5pZC5uYW1lLCBCSU5EX0xFWElDQUwsIG5vZGUuaWQuc3RhcnQpO1xuXG4gICAgICBpZiAodGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS50eXBlUGFyYW1ldGVycyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIG5vZGUucmlnaHQgPSB0aGlzLmZsb3dQYXJzZVR5cGVJbml0aWFsaXNlcih0dC5lcSk7XG4gICAgICB0aGlzLnNlbWljb2xvbigpO1xuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVHlwZUFsaWFzXCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZU9wYXF1ZVR5cGUoXG4gICAgICBub2RlOiBOLkZsb3dPcGFxdWVUeXBlLFxuICAgICAgZGVjbGFyZTogYm9vbGVhbixcbiAgICApOiBOLkZsb3dPcGFxdWVUeXBlIHtcbiAgICAgIHRoaXMuZXhwZWN0Q29udGV4dHVhbChcInR5cGVcIik7XG4gICAgICBub2RlLmlkID0gdGhpcy5mbG93UGFyc2VSZXN0cmljdGVkSWRlbnRpZmllcihcbiAgICAgICAgLyogbGliZXJhbCAqLyB0cnVlLFxuICAgICAgICAvKiBkZWNsYXJhdGlvbiAqLyB0cnVlLFxuICAgICAgKTtcbiAgICAgIHRoaXMuc2NvcGUuZGVjbGFyZU5hbWUobm9kZS5pZC5uYW1lLCBCSU5EX0xFWElDQUwsIG5vZGUuaWQuc3RhcnQpO1xuXG4gICAgICBpZiAodGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS50eXBlUGFyYW1ldGVycyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIFBhcnNlIHRoZSBzdXBlcnR5cGVcbiAgICAgIG5vZGUuc3VwZXJ0eXBlID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmNvbG9uKSkge1xuICAgICAgICBub2RlLnN1cGVydHlwZSA9IHRoaXMuZmxvd1BhcnNlVHlwZUluaXRpYWxpc2VyKHR0LmNvbG9uKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5pbXBsdHlwZSA9IG51bGw7XG4gICAgICBpZiAoIWRlY2xhcmUpIHtcbiAgICAgICAgbm9kZS5pbXBsdHlwZSA9IHRoaXMuZmxvd1BhcnNlVHlwZUluaXRpYWxpc2VyKHR0LmVxKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VtaWNvbG9uKCk7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJPcGFxdWVUeXBlXCIpO1xuICAgIH1cblxuICAgIC8vIFR5cGUgYW5ub3RhdGlvbnNcblxuICAgIGZsb3dQYXJzZVR5cGVQYXJhbWV0ZXIocmVxdWlyZURlZmF1bHQ/OiBib29sZWFuID0gZmFsc2UpOiBOLlR5cGVQYXJhbWV0ZXIge1xuICAgICAgY29uc3Qgbm9kZVN0YXJ0ID0gdGhpcy5zdGF0ZS5zdGFydDtcblxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG5cbiAgICAgIGNvbnN0IHZhcmlhbmNlID0gdGhpcy5mbG93UGFyc2VWYXJpYW5jZSgpO1xuXG4gICAgICBjb25zdCBpZGVudCA9IHRoaXMuZmxvd1BhcnNlVHlwZUFubm90YXRhYmxlSWRlbnRpZmllcigpO1xuICAgICAgbm9kZS5uYW1lID0gaWRlbnQubmFtZTtcbiAgICAgIG5vZGUudmFyaWFuY2UgPSB2YXJpYW5jZTtcbiAgICAgIG5vZGUuYm91bmQgPSBpZGVudC50eXBlQW5ub3RhdGlvbjtcblxuICAgICAgaWYgKHRoaXMubWF0Y2godHQuZXEpKSB7XG4gICAgICAgIHRoaXMuZWF0KHR0LmVxKTtcbiAgICAgICAgbm9kZS5kZWZhdWx0ID0gdGhpcy5mbG93UGFyc2VUeXBlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocmVxdWlyZURlZmF1bHQpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKG5vZGVTdGFydCwgRmxvd0Vycm9ycy5NaXNzaW5nVHlwZVBhcmFtRGVmYXVsdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlR5cGVQYXJhbWV0ZXJcIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uKCk6IE4uVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uIHtcbiAgICAgIGNvbnN0IG9sZEluVHlwZSA9IHRoaXMuc3RhdGUuaW5UeXBlO1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBub2RlLnBhcmFtcyA9IFtdO1xuXG4gICAgICB0aGlzLnN0YXRlLmluVHlwZSA9IHRydWU7XG5cbiAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBlbHNlOiB0aGlzIGNvbmRpdGlvbiBpcyBhbHJlYWR5IGNoZWNrZWQgYXQgYWxsIGNhbGwgc2l0ZXNcbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikgfHwgdGhpcy5tYXRjaCh0dC5qc3hUYWdTdGFydCkpIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGRlZmF1bHRSZXF1aXJlZCA9IGZhbHNlO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGNvbnN0IHR5cGVQYXJhbWV0ZXIgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXIoZGVmYXVsdFJlcXVpcmVkKTtcblxuICAgICAgICBub2RlLnBhcmFtcy5wdXNoKHR5cGVQYXJhbWV0ZXIpO1xuXG4gICAgICAgIGlmICh0eXBlUGFyYW1ldGVyLmRlZmF1bHQpIHtcbiAgICAgICAgICBkZWZhdWx0UmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzUmVsYXRpb25hbChcIj5cIikpIHtcbiAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5jb21tYSk7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKCF0aGlzLmlzUmVsYXRpb25hbChcIj5cIikpO1xuICAgICAgdGhpcy5leHBlY3RSZWxhdGlvbmFsKFwiPlwiKTtcblxuICAgICAgdGhpcy5zdGF0ZS5pblR5cGUgPSBvbGRJblR5cGU7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb25cIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlVHlwZVBhcmFtZXRlckluc3RhbnRpYXRpb24oKTogTi5UeXBlUGFyYW1ldGVySW5zdGFudGlhdGlvbiB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIGNvbnN0IG9sZEluVHlwZSA9IHRoaXMuc3RhdGUuaW5UeXBlO1xuICAgICAgbm9kZS5wYXJhbXMgPSBbXTtcblxuICAgICAgdGhpcy5zdGF0ZS5pblR5cGUgPSB0cnVlO1xuXG4gICAgICB0aGlzLmV4cGVjdFJlbGF0aW9uYWwoXCI8XCIpO1xuICAgICAgY29uc3Qgb2xkTm9Bbm9uRnVuY3Rpb25UeXBlID0gdGhpcy5zdGF0ZS5ub0Fub25GdW5jdGlvblR5cGU7XG4gICAgICB0aGlzLnN0YXRlLm5vQW5vbkZ1bmN0aW9uVHlwZSA9IGZhbHNlO1xuICAgICAgd2hpbGUgKCF0aGlzLmlzUmVsYXRpb25hbChcIj5cIikpIHtcbiAgICAgICAgbm9kZS5wYXJhbXMucHVzaCh0aGlzLmZsb3dQYXJzZVR5cGUoKSk7XG4gICAgICAgIGlmICghdGhpcy5pc1JlbGF0aW9uYWwoXCI+XCIpKSB7XG4gICAgICAgICAgdGhpcy5leHBlY3QodHQuY29tbWEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXRlLm5vQW5vbkZ1bmN0aW9uVHlwZSA9IG9sZE5vQW5vbkZ1bmN0aW9uVHlwZTtcbiAgICAgIHRoaXMuZXhwZWN0UmVsYXRpb25hbChcIj5cIik7XG5cbiAgICAgIHRoaXMuc3RhdGUuaW5UeXBlID0gb2xkSW5UeXBlO1xuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVHlwZVBhcmFtZXRlckluc3RhbnRpYXRpb25cIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlVHlwZVBhcmFtZXRlckluc3RhbnRpYXRpb25DYWxsT3JOZXcoKTogTi5UeXBlUGFyYW1ldGVySW5zdGFudGlhdGlvbiB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIGNvbnN0IG9sZEluVHlwZSA9IHRoaXMuc3RhdGUuaW5UeXBlO1xuICAgICAgbm9kZS5wYXJhbXMgPSBbXTtcblxuICAgICAgdGhpcy5zdGF0ZS5pblR5cGUgPSB0cnVlO1xuXG4gICAgICB0aGlzLmV4cGVjdFJlbGF0aW9uYWwoXCI8XCIpO1xuICAgICAgd2hpbGUgKCF0aGlzLmlzUmVsYXRpb25hbChcIj5cIikpIHtcbiAgICAgICAgbm9kZS5wYXJhbXMucHVzaCh0aGlzLmZsb3dQYXJzZVR5cGVPckltcGxpY2l0SW5zdGFudGlhdGlvbigpKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzUmVsYXRpb25hbChcIj5cIikpIHtcbiAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5jb21tYSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZXhwZWN0UmVsYXRpb25hbChcIj5cIik7XG5cbiAgICAgIHRoaXMuc3RhdGUuaW5UeXBlID0gb2xkSW5UeXBlO1xuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVHlwZVBhcmFtZXRlckluc3RhbnRpYXRpb25cIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlSW50ZXJmYWNlVHlwZSgpOiBOLkZsb3dJbnRlcmZhY2VUeXBlIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5leHBlY3RDb250ZXh0dWFsKFwiaW50ZXJmYWNlXCIpO1xuXG4gICAgICBub2RlLmV4dGVuZHMgPSBbXTtcbiAgICAgIGlmICh0aGlzLmVhdCh0dC5fZXh0ZW5kcykpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIG5vZGUuZXh0ZW5kcy5wdXNoKHRoaXMuZmxvd1BhcnNlSW50ZXJmYWNlRXh0ZW5kcygpKTtcbiAgICAgICAgfSB3aGlsZSAodGhpcy5lYXQodHQuY29tbWEpKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5ib2R5ID0gdGhpcy5mbG93UGFyc2VPYmplY3RUeXBlKHtcbiAgICAgICAgYWxsb3dTdGF0aWM6IGZhbHNlLFxuICAgICAgICBhbGxvd0V4YWN0OiBmYWxzZSxcbiAgICAgICAgYWxsb3dTcHJlYWQ6IGZhbHNlLFxuICAgICAgICBhbGxvd1Byb3RvOiBmYWxzZSxcbiAgICAgICAgYWxsb3dJbmV4YWN0OiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiSW50ZXJmYWNlVHlwZUFubm90YXRpb25cIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlT2JqZWN0UHJvcGVydHlLZXkoKTogTi5FeHByZXNzaW9uIHtcbiAgICAgIHJldHVybiB0aGlzLm1hdGNoKHR0Lm51bSkgfHwgdGhpcy5tYXRjaCh0dC5zdHJpbmcpXG4gICAgICAgID8gdGhpcy5wYXJzZUV4cHJBdG9tKClcbiAgICAgICAgOiB0aGlzLnBhcnNlSWRlbnRpZmllcih0cnVlKTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VPYmplY3RUeXBlSW5kZXhlcihcbiAgICAgIG5vZGU6IE4uRmxvd09iamVjdFR5cGVJbmRleGVyLFxuICAgICAgaXNTdGF0aWM6IGJvb2xlYW4sXG4gICAgICB2YXJpYW5jZTogP04uRmxvd1ZhcmlhbmNlLFxuICAgICk6IE4uRmxvd09iamVjdFR5cGVJbmRleGVyIHtcbiAgICAgIG5vZGUuc3RhdGljID0gaXNTdGF0aWM7XG5cbiAgICAgIC8vIE5vdGU6IGJyYWNrZXRMIGhhcyBhbHJlYWR5IGJlZW4gY29uc3VtZWRcbiAgICAgIGlmICh0aGlzLmxvb2thaGVhZCgpLnR5cGUgPT09IHR0LmNvbG9uKSB7XG4gICAgICAgIG5vZGUuaWQgPSB0aGlzLmZsb3dQYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XG4gICAgICAgIG5vZGUua2V5ID0gdGhpcy5mbG93UGFyc2VUeXBlSW5pdGlhbGlzZXIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUuaWQgPSBudWxsO1xuICAgICAgICBub2RlLmtleSA9IHRoaXMuZmxvd1BhcnNlVHlwZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2tldFIpO1xuICAgICAgbm9kZS52YWx1ZSA9IHRoaXMuZmxvd1BhcnNlVHlwZUluaXRpYWxpc2VyKCk7XG4gICAgICBub2RlLnZhcmlhbmNlID0gdmFyaWFuY2U7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJPYmplY3RUeXBlSW5kZXhlclwiKTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VPYmplY3RUeXBlSW50ZXJuYWxTbG90KFxuICAgICAgbm9kZTogTi5GbG93T2JqZWN0VHlwZUludGVybmFsU2xvdCxcbiAgICAgIGlzU3RhdGljOiBib29sZWFuLFxuICAgICk6IE4uRmxvd09iamVjdFR5cGVJbnRlcm5hbFNsb3Qge1xuICAgICAgbm9kZS5zdGF0aWMgPSBpc1N0YXRpYztcbiAgICAgIC8vIE5vdGU6IGJvdGggYnJhY2tldEwgaGF2ZSBhbHJlYWR5IGJlZW4gY29uc3VtZWRcbiAgICAgIG5vZGUuaWQgPSB0aGlzLmZsb3dQYXJzZU9iamVjdFByb3BlcnR5S2V5KCk7XG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFja2V0Uik7XG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFja2V0Uik7XG4gICAgICBpZiAodGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpIHx8IHRoaXMubWF0Y2godHQucGFyZW5MKSkge1xuICAgICAgICBub2RlLm1ldGhvZCA9IHRydWU7XG4gICAgICAgIG5vZGUub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgbm9kZS52YWx1ZSA9IHRoaXMuZmxvd1BhcnNlT2JqZWN0VHlwZU1ldGhvZGlzaChcbiAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZUF0KG5vZGUuc3RhcnQsIG5vZGUubG9jLnN0YXJ0KSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUubWV0aG9kID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmVhdCh0dC5xdWVzdGlvbikpIHtcbiAgICAgICAgICBub2RlLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLnZhbHVlID0gdGhpcy5mbG93UGFyc2VUeXBlSW5pdGlhbGlzZXIoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJPYmplY3RUeXBlSW50ZXJuYWxTbG90XCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZU9iamVjdFR5cGVNZXRob2Rpc2goXG4gICAgICBub2RlOiBOLkZsb3dGdW5jdGlvblR5cGVBbm5vdGF0aW9uLFxuICAgICk6IE4uRmxvd0Z1bmN0aW9uVHlwZUFubm90YXRpb24ge1xuICAgICAgbm9kZS5wYXJhbXMgPSBbXTtcbiAgICAgIG5vZGUucmVzdCA9IG51bGw7XG4gICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gbnVsbDtcbiAgICAgIG5vZGUudGhpcyA9IG51bGw7XG5cbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgbm9kZS50eXBlUGFyYW1ldGVycyA9IHRoaXMuZmxvd1BhcnNlVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuTCk7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5fdGhpcykpIHtcbiAgICAgICAgbm9kZS50aGlzID0gdGhpcy5mbG93UGFyc2VGdW5jdGlvblR5cGVQYXJhbSgvKiBmaXJzdCAqLyB0cnVlKTtcbiAgICAgICAgLy8gbWF0Y2ggRmxvdyBwYXJzZXIgYmVoYXZpb3JcbiAgICAgICAgbm9kZS50aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICBpZiAoIXRoaXMubWF0Y2godHQucGFyZW5SKSkge1xuICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbW1hKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd2hpbGUgKCF0aGlzLm1hdGNoKHR0LnBhcmVuUikgJiYgIXRoaXMubWF0Y2godHQuZWxsaXBzaXMpKSB7XG4gICAgICAgIG5vZGUucGFyYW1zLnB1c2godGhpcy5mbG93UGFyc2VGdW5jdGlvblR5cGVQYXJhbShmYWxzZSkpO1xuICAgICAgICBpZiAoIXRoaXMubWF0Y2godHQucGFyZW5SKSkge1xuICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbW1hKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lYXQodHQuZWxsaXBzaXMpKSB7XG4gICAgICAgIG5vZGUucmVzdCA9IHRoaXMuZmxvd1BhcnNlRnVuY3Rpb25UeXBlUGFyYW0oZmFsc2UpO1xuICAgICAgfVxuICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcbiAgICAgIG5vZGUucmV0dXJuVHlwZSA9IHRoaXMuZmxvd1BhcnNlVHlwZUluaXRpYWxpc2VyKCk7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJGdW5jdGlvblR5cGVBbm5vdGF0aW9uXCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZU9iamVjdFR5cGVDYWxsUHJvcGVydHkoXG4gICAgICBub2RlOiBOLkZsb3dPYmplY3RUeXBlQ2FsbFByb3BlcnR5LFxuICAgICAgaXNTdGF0aWM6IGJvb2xlYW4sXG4gICAgKTogTi5GbG93T2JqZWN0VHlwZUNhbGxQcm9wZXJ0eSB7XG4gICAgICBjb25zdCB2YWx1ZU5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgbm9kZS5zdGF0aWMgPSBpc1N0YXRpYztcbiAgICAgIG5vZGUudmFsdWUgPSB0aGlzLmZsb3dQYXJzZU9iamVjdFR5cGVNZXRob2Rpc2godmFsdWVOb2RlKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJPYmplY3RUeXBlQ2FsbFByb3BlcnR5XCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZU9iamVjdFR5cGUoe1xuICAgICAgYWxsb3dTdGF0aWMsXG4gICAgICBhbGxvd0V4YWN0LFxuICAgICAgYWxsb3dTcHJlYWQsXG4gICAgICBhbGxvd1Byb3RvLFxuICAgICAgYWxsb3dJbmV4YWN0LFxuICAgIH06IHtcbiAgICAgIGFsbG93U3RhdGljOiBib29sZWFuLFxuICAgICAgYWxsb3dFeGFjdDogYm9vbGVhbixcbiAgICAgIGFsbG93U3ByZWFkOiBib29sZWFuLFxuICAgICAgYWxsb3dQcm90bzogYm9vbGVhbixcbiAgICAgIGFsbG93SW5leGFjdDogYm9vbGVhbixcbiAgICB9KTogTi5GbG93T2JqZWN0VHlwZUFubm90YXRpb24ge1xuICAgICAgY29uc3Qgb2xkSW5UeXBlID0gdGhpcy5zdGF0ZS5pblR5cGU7XG4gICAgICB0aGlzLnN0YXRlLmluVHlwZSA9IHRydWU7XG5cbiAgICAgIGNvbnN0IG5vZGVTdGFydCA9IHRoaXMuc3RhcnROb2RlKCk7XG5cbiAgICAgIG5vZGVTdGFydC5jYWxsUHJvcGVydGllcyA9IFtdO1xuICAgICAgbm9kZVN0YXJ0LnByb3BlcnRpZXMgPSBbXTtcbiAgICAgIG5vZGVTdGFydC5pbmRleGVycyA9IFtdO1xuICAgICAgbm9kZVN0YXJ0LmludGVybmFsU2xvdHMgPSBbXTtcblxuICAgICAgbGV0IGVuZERlbGltO1xuICAgICAgbGV0IGV4YWN0O1xuICAgICAgbGV0IGluZXhhY3QgPSBmYWxzZTtcbiAgICAgIGlmIChhbGxvd0V4YWN0ICYmIHRoaXMubWF0Y2godHQuYnJhY2VCYXJMKSkge1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5icmFjZUJhckwpO1xuICAgICAgICBlbmREZWxpbSA9IHR0LmJyYWNlQmFyUjtcbiAgICAgICAgZXhhY3QgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcbiAgICAgICAgZW5kRGVsaW0gPSB0dC5icmFjZVI7XG4gICAgICAgIGV4YWN0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIG5vZGVTdGFydC5leGFjdCA9IGV4YWN0O1xuXG4gICAgICB3aGlsZSAoIXRoaXMubWF0Y2goZW5kRGVsaW0pKSB7XG4gICAgICAgIGxldCBpc1N0YXRpYyA9IGZhbHNlO1xuICAgICAgICBsZXQgcHJvdG9TdGFydDogP251bWJlciA9IG51bGw7XG4gICAgICAgIGxldCBpbmV4YWN0U3RhcnQ6ID9udW1iZXIgPSBudWxsO1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcblxuICAgICAgICBpZiAoYWxsb3dQcm90byAmJiB0aGlzLmlzQ29udGV4dHVhbChcInByb3RvXCIpKSB7XG4gICAgICAgICAgY29uc3QgbG9va2FoZWFkID0gdGhpcy5sb29rYWhlYWQoKTtcblxuICAgICAgICAgIGlmIChsb29rYWhlYWQudHlwZSAhPT0gdHQuY29sb24gJiYgbG9va2FoZWFkLnR5cGUgIT09IHR0LnF1ZXN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIHByb3RvU3RhcnQgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgICAgICAgYWxsb3dTdGF0aWMgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWxsb3dTdGF0aWMgJiYgdGhpcy5pc0NvbnRleHR1YWwoXCJzdGF0aWNcIikpIHtcbiAgICAgICAgICBjb25zdCBsb29rYWhlYWQgPSB0aGlzLmxvb2thaGVhZCgpO1xuXG4gICAgICAgICAgLy8gc3RhdGljIGlzIGEgdmFsaWQgaWRlbnRpZmllciBuYW1lXG4gICAgICAgICAgaWYgKGxvb2thaGVhZC50eXBlICE9PSB0dC5jb2xvbiAmJiBsb29rYWhlYWQudHlwZSAhPT0gdHQucXVlc3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgaXNTdGF0aWMgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhcmlhbmNlID0gdGhpcy5mbG93UGFyc2VWYXJpYW5jZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmVhdCh0dC5icmFja2V0TCkpIHtcbiAgICAgICAgICBpZiAocHJvdG9TdGFydCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVuZXhwZWN0ZWQocHJvdG9TdGFydCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmVhdCh0dC5icmFja2V0TCkpIHtcbiAgICAgICAgICAgIGlmICh2YXJpYW5jZSkge1xuICAgICAgICAgICAgICB0aGlzLnVuZXhwZWN0ZWQodmFyaWFuY2Uuc3RhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZVN0YXJ0LmludGVybmFsU2xvdHMucHVzaChcbiAgICAgICAgICAgICAgdGhpcy5mbG93UGFyc2VPYmplY3RUeXBlSW50ZXJuYWxTbG90KG5vZGUsIGlzU3RhdGljKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVTdGFydC5pbmRleGVycy5wdXNoKFxuICAgICAgICAgICAgICB0aGlzLmZsb3dQYXJzZU9iamVjdFR5cGVJbmRleGVyKG5vZGUsIGlzU3RhdGljLCB2YXJpYW5jZSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0LnBhcmVuTCkgfHwgdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgICAgaWYgKHByb3RvU3RhcnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51bmV4cGVjdGVkKHByb3RvU3RhcnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFyaWFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMudW5leHBlY3RlZCh2YXJpYW5jZS5zdGFydCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vZGVTdGFydC5jYWxsUHJvcGVydGllcy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5mbG93UGFyc2VPYmplY3RUeXBlQ2FsbFByb3BlcnR5KG5vZGUsIGlzU3RhdGljKSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBraW5kID0gXCJpbml0XCI7XG5cbiAgICAgICAgICBpZiAodGhpcy5pc0NvbnRleHR1YWwoXCJnZXRcIikgfHwgdGhpcy5pc0NvbnRleHR1YWwoXCJzZXRcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGxvb2thaGVhZCA9IHRoaXMubG9va2FoZWFkKCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGxvb2thaGVhZC50eXBlID09PSB0dC5uYW1lIHx8XG4gICAgICAgICAgICAgIGxvb2thaGVhZC50eXBlID09PSB0dC5zdHJpbmcgfHxcbiAgICAgICAgICAgICAgbG9va2FoZWFkLnR5cGUgPT09IHR0Lm51bVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGtpbmQgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBwcm9wT3JJbmV4YWN0ID0gdGhpcy5mbG93UGFyc2VPYmplY3RUeXBlUHJvcGVydHkoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgaXNTdGF0aWMsXG4gICAgICAgICAgICBwcm90b1N0YXJ0LFxuICAgICAgICAgICAgdmFyaWFuY2UsXG4gICAgICAgICAgICBraW5kLFxuICAgICAgICAgICAgYWxsb3dTcHJlYWQsXG4gICAgICAgICAgICBhbGxvd0luZXhhY3QgPz8gIWV4YWN0LFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAocHJvcE9ySW5leGFjdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgaW5leGFjdCA9IHRydWU7XG4gICAgICAgICAgICBpbmV4YWN0U3RhcnQgPSB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZVN0YXJ0LnByb3BlcnRpZXMucHVzaChwcm9wT3JJbmV4YWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZsb3dPYmplY3RUeXBlU2VtaWNvbG9uKCk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGluZXhhY3RTdGFydCAmJlxuICAgICAgICAgICF0aGlzLm1hdGNoKHR0LmJyYWNlUikgJiZcbiAgICAgICAgICAhdGhpcy5tYXRjaCh0dC5icmFjZUJhclIpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICBpbmV4YWN0U3RhcnQsXG4gICAgICAgICAgICBGbG93RXJyb3JzLlVuZXhwZWN0ZWRFeHBsaWNpdEluZXhhY3RJbk9iamVjdCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXhwZWN0KGVuZERlbGltKTtcblxuICAgICAgLyogVGhlIGluZXhhY3QgZmxhZyBzaG91bGQgb25seSBiZSBhZGRlZCBvbiBPYmplY3RUeXBlQW5ub3RhdGlvbnMgdGhhdFxuICAgICAgICogYXJlIG5vdCB0aGUgYm9keSBvZiBhbiBpbnRlcmZhY2UsIGRlY2xhcmUgaW50ZXJmYWNlLCBvciBkZWNsYXJlIGNsYXNzLlxuICAgICAgICogU2luY2Ugc3ByZWFkcyBhcmUgb25seSBhbGxvd2VkIGluIG9iamVjdCB0eXBlcywgY2hlY2tpbmcgdGhhdCBpc1xuICAgICAgICogc3VmZmljaWVudCBoZXJlLlxuICAgICAgICovXG4gICAgICBpZiAoYWxsb3dTcHJlYWQpIHtcbiAgICAgICAgbm9kZVN0YXJ0LmluZXhhY3QgPSBpbmV4YWN0O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvdXQgPSB0aGlzLmZpbmlzaE5vZGUobm9kZVN0YXJ0LCBcIk9iamVjdFR5cGVBbm5vdGF0aW9uXCIpO1xuXG4gICAgICB0aGlzLnN0YXRlLmluVHlwZSA9IG9sZEluVHlwZTtcblxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VPYmplY3RUeXBlUHJvcGVydHkoXG4gICAgICBub2RlOiBOLkZsb3dPYmplY3RUeXBlUHJvcGVydHkgfCBOLkZsb3dPYmplY3RUeXBlU3ByZWFkUHJvcGVydHksXG4gICAgICBpc1N0YXRpYzogYm9vbGVhbixcbiAgICAgIHByb3RvU3RhcnQ6ID9udW1iZXIsXG4gICAgICB2YXJpYW5jZTogP04uRmxvd1ZhcmlhbmNlLFxuICAgICAga2luZDogc3RyaW5nLFxuICAgICAgYWxsb3dTcHJlYWQ6IGJvb2xlYW4sXG4gICAgICBhbGxvd0luZXhhY3Q6IGJvb2xlYW4sXG4gICAgKTogKE4uRmxvd09iamVjdFR5cGVQcm9wZXJ0eSB8IE4uRmxvd09iamVjdFR5cGVTcHJlYWRQcm9wZXJ0eSkgfCBudWxsIHtcbiAgICAgIGlmICh0aGlzLmVhdCh0dC5lbGxpcHNpcykpIHtcbiAgICAgICAgY29uc3QgaXNJbmV4YWN0VG9rZW4gPVxuICAgICAgICAgIHRoaXMubWF0Y2godHQuY29tbWEpIHx8XG4gICAgICAgICAgdGhpcy5tYXRjaCh0dC5zZW1pKSB8fFxuICAgICAgICAgIHRoaXMubWF0Y2godHQuYnJhY2VSKSB8fFxuICAgICAgICAgIHRoaXMubWF0Y2godHQuYnJhY2VCYXJSKTtcblxuICAgICAgICBpZiAoaXNJbmV4YWN0VG9rZW4pIHtcbiAgICAgICAgICBpZiAoIWFsbG93U3ByZWFkKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCxcbiAgICAgICAgICAgICAgRmxvd0Vycm9ycy5JbmV4YWN0SW5zaWRlTm9uT2JqZWN0LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFhbGxvd0luZXhhY3QpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnQsIEZsb3dFcnJvcnMuSW5leGFjdEluc2lkZUV4YWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhcmlhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKHZhcmlhbmNlLnN0YXJ0LCBGbG93RXJyb3JzLkluZXhhY3RWYXJpYW5jZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWFsbG93U3ByZWFkKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCwgRmxvd0Vycm9ycy5VbmV4cGVjdGVkU3ByZWFkVHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3RvU3RhcnQgIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMudW5leHBlY3RlZChwcm90b1N0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFyaWFuY2UpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHZhcmlhbmNlLnN0YXJ0LCBGbG93RXJyb3JzLlNwcmVhZFZhcmlhbmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuYXJndW1lbnQgPSB0aGlzLmZsb3dQYXJzZVR5cGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIk9iamVjdFR5cGVTcHJlYWRQcm9wZXJ0eVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUua2V5ID0gdGhpcy5mbG93UGFyc2VPYmplY3RQcm9wZXJ0eUtleSgpO1xuICAgICAgICBub2RlLnN0YXRpYyA9IGlzU3RhdGljO1xuICAgICAgICBub2RlLnByb3RvID0gcHJvdG9TdGFydCAhPSBudWxsO1xuICAgICAgICBub2RlLmtpbmQgPSBraW5kO1xuXG4gICAgICAgIGxldCBvcHRpb25hbCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpIHx8IHRoaXMubWF0Y2godHQucGFyZW5MKSkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2QgcHJvcGVydHlcbiAgICAgICAgICBub2RlLm1ldGhvZCA9IHRydWU7XG5cbiAgICAgICAgICBpZiAocHJvdG9TdGFydCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVuZXhwZWN0ZWQocHJvdG9TdGFydCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YXJpYW5jZSkge1xuICAgICAgICAgICAgdGhpcy51bmV4cGVjdGVkKHZhcmlhbmNlLnN0YXJ0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBub2RlLnZhbHVlID0gdGhpcy5mbG93UGFyc2VPYmplY3RUeXBlTWV0aG9kaXNoKFxuICAgICAgICAgICAgdGhpcy5zdGFydE5vZGVBdChub2RlLnN0YXJ0LCBub2RlLmxvYy5zdGFydCksXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoa2luZCA9PT0gXCJnZXRcIiB8fCBraW5kID09PSBcInNldFwiKSB7XG4gICAgICAgICAgICB0aGlzLmZsb3dDaGVja0dldHRlclNldHRlclBhcmFtcyhub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLyoqIERlY2xhcmVkIGNsYXNzZXMvaW50ZXJmYWNlcyBkbyBub3QgYWxsb3cgc3ByZWFkICovXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWFsbG93U3ByZWFkICYmXG4gICAgICAgICAgICBub2RlLmtleS5uYW1lID09PSBcImNvbnN0cnVjdG9yXCIgJiZcbiAgICAgICAgICAgIG5vZGUudmFsdWUudGhpc1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgbm9kZS52YWx1ZS50aGlzLnN0YXJ0LFxuICAgICAgICAgICAgICBGbG93RXJyb3JzLlRoaXNQYXJhbUJhbm5lZEluQ29uc3RydWN0b3IsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoa2luZCAhPT0gXCJpbml0XCIpIHRoaXMudW5leHBlY3RlZCgpO1xuXG4gICAgICAgICAgbm9kZS5tZXRob2QgPSBmYWxzZTtcblxuICAgICAgICAgIGlmICh0aGlzLmVhdCh0dC5xdWVzdGlvbikpIHtcbiAgICAgICAgICAgIG9wdGlvbmFsID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm9kZS52YWx1ZSA9IHRoaXMuZmxvd1BhcnNlVHlwZUluaXRpYWxpc2VyKCk7XG4gICAgICAgICAgbm9kZS52YXJpYW5jZSA9IHZhcmlhbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5vcHRpb25hbCA9IG9wdGlvbmFsO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJPYmplY3RUeXBlUHJvcGVydHlcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhpcyBpcyBzaW1pbGFyIHRvIGNoZWNrR2V0dGVyU2V0dGVyUGFyYW1zLCBidXQgYXNcbiAgICAvLyBAYmFiZWwvcGFyc2VyIHVzZXMgbm9uIGVzdHJlZSBwcm9wZXJ0aWVzIHdlIGNhbm5vdCByZXVzZSBpdCBoZXJlXG4gICAgZmxvd0NoZWNrR2V0dGVyU2V0dGVyUGFyYW1zKFxuICAgICAgcHJvcGVydHk6IE4uRmxvd09iamVjdFR5cGVQcm9wZXJ0eSB8IE4uRmxvd09iamVjdFR5cGVTcHJlYWRQcm9wZXJ0eSxcbiAgICApOiB2b2lkIHtcbiAgICAgIGNvbnN0IHBhcmFtQ291bnQgPSBwcm9wZXJ0eS5raW5kID09PSBcImdldFwiID8gMCA6IDE7XG4gICAgICBjb25zdCBzdGFydCA9IHByb3BlcnR5LnN0YXJ0O1xuICAgICAgY29uc3QgbGVuZ3RoID1cbiAgICAgICAgcHJvcGVydHkudmFsdWUucGFyYW1zLmxlbmd0aCArIChwcm9wZXJ0eS52YWx1ZS5yZXN0ID8gMSA6IDApO1xuXG4gICAgICBpZiAocHJvcGVydHkudmFsdWUudGhpcykge1xuICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgIHByb3BlcnR5LnZhbHVlLnRoaXMuc3RhcnQsXG4gICAgICAgICAgcHJvcGVydHkua2luZCA9PT0gXCJnZXRcIlxuICAgICAgICAgICAgPyBGbG93RXJyb3JzLkdldHRlck1heU5vdEhhdmVUaGlzUGFyYW1cbiAgICAgICAgICAgIDogRmxvd0Vycm9ycy5TZXR0ZXJNYXlOb3RIYXZlVGhpc1BhcmFtLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAobGVuZ3RoICE9PSBwYXJhbUNvdW50KSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eS5raW5kID09PSBcImdldFwiKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShzdGFydCwgRXJyb3JzLkJhZEdldHRlckFyaXR5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHN0YXJ0LCBFcnJvcnMuQmFkU2V0dGVyQXJpdHkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wZXJ0eS5raW5kID09PSBcInNldFwiICYmIHByb3BlcnR5LnZhbHVlLnJlc3QpIHtcbiAgICAgICAgdGhpcy5yYWlzZShzdGFydCwgRXJyb3JzLkJhZFNldHRlclJlc3RQYXJhbWV0ZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZsb3dPYmplY3RUeXBlU2VtaWNvbG9uKCk6IHZvaWQge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5lYXQodHQuc2VtaSkgJiZcbiAgICAgICAgIXRoaXMuZWF0KHR0LmNvbW1hKSAmJlxuICAgICAgICAhdGhpcy5tYXRjaCh0dC5icmFjZVIpICYmXG4gICAgICAgICF0aGlzLm1hdGNoKHR0LmJyYWNlQmFyUilcbiAgICAgICkge1xuICAgICAgICB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmbG93UGFyc2VRdWFsaWZpZWRUeXBlSWRlbnRpZmllcihcbiAgICAgIHN0YXJ0UG9zPzogbnVtYmVyLFxuICAgICAgc3RhcnRMb2M/OiBQb3NpdGlvbixcbiAgICAgIGlkPzogTi5JZGVudGlmaWVyLFxuICAgICk6IE4uRmxvd1F1YWxpZmllZFR5cGVJZGVudGlmaWVyIHtcbiAgICAgIHN0YXJ0UG9zID0gc3RhcnRQb3MgfHwgdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgIHN0YXJ0TG9jID0gc3RhcnRMb2MgfHwgdGhpcy5zdGF0ZS5zdGFydExvYztcbiAgICAgIGxldCBub2RlID0gaWQgfHwgdGhpcy5mbG93UGFyc2VSZXN0cmljdGVkSWRlbnRpZmllcih0cnVlKTtcblxuICAgICAgd2hpbGUgKHRoaXMuZWF0KHR0LmRvdCkpIHtcbiAgICAgICAgY29uc3Qgbm9kZTIgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICAgIG5vZGUyLnF1YWxpZmljYXRpb24gPSBub2RlO1xuICAgICAgICBub2RlMi5pZCA9IHRoaXMuZmxvd1BhcnNlUmVzdHJpY3RlZElkZW50aWZpZXIodHJ1ZSk7XG4gICAgICAgIG5vZGUgPSB0aGlzLmZpbmlzaE5vZGUobm9kZTIsIFwiUXVhbGlmaWVkVHlwZUlkZW50aWZpZXJcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZUdlbmVyaWNUeXBlKFxuICAgICAgc3RhcnRQb3M6IG51bWJlcixcbiAgICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICAgIGlkOiBOLklkZW50aWZpZXIsXG4gICAgKTogTi5GbG93R2VuZXJpY1R5cGVBbm5vdGF0aW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG5cbiAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSBudWxsO1xuICAgICAgbm9kZS5pZCA9IHRoaXMuZmxvd1BhcnNlUXVhbGlmaWVkVHlwZUlkZW50aWZpZXIoc3RhcnRQb3MsIHN0YXJ0TG9jLCBpZCk7XG5cbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgbm9kZS50eXBlUGFyYW1ldGVycyA9IHRoaXMuZmxvd1BhcnNlVHlwZVBhcmFtZXRlckluc3RhbnRpYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkdlbmVyaWNUeXBlQW5ub3RhdGlvblwiKTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VUeXBlb2ZUeXBlKCk6IE4uRmxvd1R5cGVvZlR5cGVBbm5vdGF0aW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5leHBlY3QodHQuX3R5cGVvZik7XG4gICAgICBub2RlLmFyZ3VtZW50ID0gdGhpcy5mbG93UGFyc2VQcmltYXJ5VHlwZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlR5cGVvZlR5cGVBbm5vdGF0aW9uXCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZVR1cGxlVHlwZSgpOiBOLkZsb3dUdXBsZVR5cGVBbm5vdGF0aW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgbm9kZS50eXBlcyA9IFtdO1xuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2tldEwpO1xuICAgICAgLy8gV2UgYWxsb3cgdHJhaWxpbmcgY29tbWFzXG4gICAgICB3aGlsZSAodGhpcy5zdGF0ZS5wb3MgPCB0aGlzLmxlbmd0aCAmJiAhdGhpcy5tYXRjaCh0dC5icmFja2V0UikpIHtcbiAgICAgICAgbm9kZS50eXBlcy5wdXNoKHRoaXMuZmxvd1BhcnNlVHlwZSgpKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2godHQuYnJhY2tldFIpKSBicmVhaztcbiAgICAgICAgdGhpcy5leHBlY3QodHQuY29tbWEpO1xuICAgICAgfVxuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2tldFIpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlR1cGxlVHlwZUFubm90YXRpb25cIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlRnVuY3Rpb25UeXBlUGFyYW0oZmlyc3Q6IGJvb2xlYW4pOiBOLkZsb3dGdW5jdGlvblR5cGVQYXJhbSB7XG4gICAgICBsZXQgbmFtZSA9IG51bGw7XG4gICAgICBsZXQgb3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgIGxldCB0eXBlQW5ub3RhdGlvbiA9IG51bGw7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIGNvbnN0IGxoID0gdGhpcy5sb29rYWhlYWQoKTtcbiAgICAgIGNvbnN0IGlzVGhpcyA9IHRoaXMuc3RhdGUudHlwZSA9PT0gdHQuX3RoaXM7XG5cbiAgICAgIGlmIChsaC50eXBlID09PSB0dC5jb2xvbiB8fCBsaC50eXBlID09PSB0dC5xdWVzdGlvbikge1xuICAgICAgICBpZiAoaXNUaGlzICYmICFmaXJzdCkge1xuICAgICAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgRmxvd0Vycm9ycy5UaGlzUGFyYW1NdXN0QmVGaXJzdCk7XG4gICAgICAgIH1cbiAgICAgICAgbmFtZSA9IHRoaXMucGFyc2VJZGVudGlmaWVyKGlzVGhpcyk7XG4gICAgICAgIGlmICh0aGlzLmVhdCh0dC5xdWVzdGlvbikpIHtcbiAgICAgICAgICBvcHRpb25hbCA9IHRydWU7XG4gICAgICAgICAgaWYgKGlzVGhpcykge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBGbG93RXJyb3JzLlRoaXNQYXJhbU1heU5vdEJlT3B0aW9uYWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmxvd1BhcnNlVHlwZUluaXRpYWxpc2VyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmxvd1BhcnNlVHlwZSgpO1xuICAgICAgfVxuICAgICAgbm9kZS5uYW1lID0gbmFtZTtcbiAgICAgIG5vZGUub3B0aW9uYWwgPSBvcHRpb25hbDtcbiAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0eXBlQW5ub3RhdGlvbjtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJGdW5jdGlvblR5cGVQYXJhbVwiKTtcbiAgICB9XG5cbiAgICByZWludGVycHJldFR5cGVBc0Z1bmN0aW9uVHlwZVBhcmFtKFxuICAgICAgdHlwZTogTi5GbG93VHlwZSxcbiAgICApOiBOLkZsb3dGdW5jdGlvblR5cGVQYXJhbSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdCh0eXBlLnN0YXJ0LCB0eXBlLmxvYy5zdGFydCk7XG4gICAgICBub2RlLm5hbWUgPSBudWxsO1xuICAgICAgbm9kZS5vcHRpb25hbCA9IGZhbHNlO1xuICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiA9IHR5cGU7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRnVuY3Rpb25UeXBlUGFyYW1cIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlRnVuY3Rpb25UeXBlUGFyYW1zKHBhcmFtczogTi5GbG93RnVuY3Rpb25UeXBlUGFyYW1bXSA9IFtdKToge1xuICAgICAgcGFyYW1zOiBOLkZsb3dGdW5jdGlvblR5cGVQYXJhbVtdLFxuICAgICAgcmVzdDogP04uRmxvd0Z1bmN0aW9uVHlwZVBhcmFtLFxuICAgICAgX3RoaXM6ID9OLkZsb3dGdW5jdGlvblR5cGVQYXJhbSxcbiAgICB9IHtcbiAgICAgIGxldCByZXN0OiA/Ti5GbG93RnVuY3Rpb25UeXBlUGFyYW0gPSBudWxsO1xuICAgICAgbGV0IF90aGlzOiA/Ti5GbG93RnVuY3Rpb25UeXBlUGFyYW0gPSBudWxsO1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuX3RoaXMpKSB7XG4gICAgICAgIF90aGlzID0gdGhpcy5mbG93UGFyc2VGdW5jdGlvblR5cGVQYXJhbSgvKiBmaXJzdCAqLyB0cnVlKTtcbiAgICAgICAgLy8gbWF0Y2ggRmxvdyBwYXJzZXIgYmVoYXZpb3JcbiAgICAgICAgX3RoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIGlmICghdGhpcy5tYXRjaCh0dC5wYXJlblIpKSB7XG4gICAgICAgICAgdGhpcy5leHBlY3QodHQuY29tbWEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aGlsZSAoIXRoaXMubWF0Y2godHQucGFyZW5SKSAmJiAhdGhpcy5tYXRjaCh0dC5lbGxpcHNpcykpIHtcbiAgICAgICAgcGFyYW1zLnB1c2godGhpcy5mbG93UGFyc2VGdW5jdGlvblR5cGVQYXJhbShmYWxzZSkpO1xuICAgICAgICBpZiAoIXRoaXMubWF0Y2godHQucGFyZW5SKSkge1xuICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbW1hKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWF0KHR0LmVsbGlwc2lzKSkge1xuICAgICAgICByZXN0ID0gdGhpcy5mbG93UGFyc2VGdW5jdGlvblR5cGVQYXJhbShmYWxzZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4geyBwYXJhbXMsIHJlc3QsIF90aGlzIH07XG4gICAgfVxuXG4gICAgZmxvd0lkZW50VG9UeXBlQW5ub3RhdGlvbihcbiAgICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgICBzdGFydExvYzogUG9zaXRpb24sXG4gICAgICBub2RlOiBOLkZsb3dUeXBlQW5ub3RhdGlvbixcbiAgICAgIGlkOiBOLklkZW50aWZpZXIsXG4gICAgKTogTi5GbG93VHlwZUFubm90YXRpb24ge1xuICAgICAgc3dpdGNoIChpZC5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJhbnlcIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQW55VHlwZUFubm90YXRpb25cIik7XG5cbiAgICAgICAgY2FzZSBcImJvb2xcIjpcbiAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQm9vbGVhblR5cGVBbm5vdGF0aW9uXCIpO1xuXG4gICAgICAgIGNhc2UgXCJtaXhlZFwiOlxuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJNaXhlZFR5cGVBbm5vdGF0aW9uXCIpO1xuXG4gICAgICAgIGNhc2UgXCJlbXB0eVwiOlxuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJFbXB0eVR5cGVBbm5vdGF0aW9uXCIpO1xuXG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiTnVtYmVyVHlwZUFubm90YXRpb25cIik7XG5cbiAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJTdHJpbmdUeXBlQW5ub3RhdGlvblwiKTtcblxuICAgICAgICBjYXNlIFwic3ltYm9sXCI6XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlN5bWJvbFR5cGVBbm5vdGF0aW9uXCIpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5jaGVja05vdFVuZGVyc2NvcmUoaWQubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlR2VuZXJpY1R5cGUoc3RhcnRQb3MsIHN0YXJ0TG9jLCBpZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlIHBhcnNpbmcgb2YgdHlwZXMgcm91Z2hseSBwYXJhbGxlbHMgdGhlIHBhcnNpbmcgb2YgZXhwcmVzc2lvbnMsIGFuZFxuICAgIC8vIHByaW1hcnkgdHlwZXMgYXJlIGtpbmQgb2YgbGlrZSBwcmltYXJ5IGV4cHJlc3Npb25zLi4udGhleSdyZSB0aGVcbiAgICAvLyBwcmltaXRpdmVzIHdpdGggd2hpY2ggb3RoZXIgdHlwZXMgYXJlIGNvbnN0cnVjdGVkLlxuICAgIGZsb3dQYXJzZVByaW1hcnlUeXBlKCk6IE4uRmxvd1R5cGVBbm5vdGF0aW9uIHtcbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgIGNvbnN0IHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5zdGFydExvYztcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgbGV0IHRtcDtcbiAgICAgIGxldCB0eXBlO1xuICAgICAgbGV0IGlzR3JvdXBlZFR5cGUgPSBmYWxzZTtcbiAgICAgIGNvbnN0IG9sZE5vQW5vbkZ1bmN0aW9uVHlwZSA9IHRoaXMuc3RhdGUubm9Bbm9uRnVuY3Rpb25UeXBlO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUudHlwZSkge1xuICAgICAgICBjYXNlIHR0Lm5hbWU6XG4gICAgICAgICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwiaW50ZXJmYWNlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VJbnRlcmZhY2VUeXBlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd0lkZW50VG9UeXBlQW5ub3RhdGlvbihcbiAgICAgICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICAgICAgc3RhcnRMb2MsXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdGhpcy5wYXJzZUlkZW50aWZpZXIoKSxcbiAgICAgICAgICApO1xuXG4gICAgICAgIGNhc2UgdHQuYnJhY2VMOlxuICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dQYXJzZU9iamVjdFR5cGUoe1xuICAgICAgICAgICAgYWxsb3dTdGF0aWM6IGZhbHNlLFxuICAgICAgICAgICAgYWxsb3dFeGFjdDogZmFsc2UsXG4gICAgICAgICAgICBhbGxvd1NwcmVhZDogdHJ1ZSxcbiAgICAgICAgICAgIGFsbG93UHJvdG86IGZhbHNlLFxuICAgICAgICAgICAgYWxsb3dJbmV4YWN0OiB0cnVlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNhc2UgdHQuYnJhY2VCYXJMOlxuICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dQYXJzZU9iamVjdFR5cGUoe1xuICAgICAgICAgICAgYWxsb3dTdGF0aWM6IGZhbHNlLFxuICAgICAgICAgICAgYWxsb3dFeGFjdDogdHJ1ZSxcbiAgICAgICAgICAgIGFsbG93U3ByZWFkOiB0cnVlLFxuICAgICAgICAgICAgYWxsb3dQcm90bzogZmFsc2UsXG4gICAgICAgICAgICBhbGxvd0luZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNhc2UgdHQuYnJhY2tldEw6XG4gICAgICAgICAgdGhpcy5zdGF0ZS5ub0Fub25GdW5jdGlvblR5cGUgPSBmYWxzZTtcbiAgICAgICAgICB0eXBlID0gdGhpcy5mbG93UGFyc2VUdXBsZVR5cGUoKTtcbiAgICAgICAgICB0aGlzLnN0YXRlLm5vQW5vbkZ1bmN0aW9uVHlwZSA9IG9sZE5vQW5vbkZ1bmN0aW9uVHlwZTtcbiAgICAgICAgICByZXR1cm4gdHlwZTtcblxuICAgICAgICBjYXNlIHR0LnJlbGF0aW9uYWw6XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09IFwiPFwiKSB7XG4gICAgICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24oKTtcbiAgICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuTCk7XG4gICAgICAgICAgICB0bXAgPSB0aGlzLmZsb3dQYXJzZUZ1bmN0aW9uVHlwZVBhcmFtcygpO1xuICAgICAgICAgICAgbm9kZS5wYXJhbXMgPSB0bXAucGFyYW1zO1xuICAgICAgICAgICAgbm9kZS5yZXN0ID0gdG1wLnJlc3Q7XG4gICAgICAgICAgICBub2RlLnRoaXMgPSB0bXAuX3RoaXM7XG4gICAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5wYXJlblIpO1xuXG4gICAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5hcnJvdyk7XG5cbiAgICAgICAgICAgIG5vZGUucmV0dXJuVHlwZSA9IHRoaXMuZmxvd1BhcnNlVHlwZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRnVuY3Rpb25UeXBlQW5ub3RhdGlvblwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSB0dC5wYXJlbkw6XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG5cbiAgICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhpcyBpcyBhY3R1YWxseSBhIGdyb3VwZWQgdHlwZVxuICAgICAgICAgIGlmICghdGhpcy5tYXRjaCh0dC5wYXJlblIpICYmICF0aGlzLm1hdGNoKHR0LmVsbGlwc2lzKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubWF0Y2godHQubmFtZSkgfHwgdGhpcy5tYXRjaCh0dC5fdGhpcykpIHtcbiAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLmxvb2thaGVhZCgpLnR5cGU7XG4gICAgICAgICAgICAgIGlzR3JvdXBlZFR5cGUgPSB0b2tlbiAhPT0gdHQucXVlc3Rpb24gJiYgdG9rZW4gIT09IHR0LmNvbG9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaXNHcm91cGVkVHlwZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzR3JvdXBlZFR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUubm9Bbm9uRnVuY3Rpb25UeXBlID0gZmFsc2U7XG4gICAgICAgICAgICB0eXBlID0gdGhpcy5mbG93UGFyc2VUeXBlKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlLm5vQW5vbkZ1bmN0aW9uVHlwZSA9IG9sZE5vQW5vbkZ1bmN0aW9uVHlwZTtcblxuICAgICAgICAgICAgLy8gQSBgLGAgb3IgYSBgKSA9PmAgbWVhbnMgdGhpcyBpcyBhbiBhbm9ueW1vdXMgZnVuY3Rpb24gdHlwZVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLm5vQW5vbkZ1bmN0aW9uVHlwZSB8fFxuICAgICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2godHQuY29tbWEpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMubWF0Y2godHQucGFyZW5SKSAmJiB0aGlzLmxvb2thaGVhZCgpLnR5cGUgPT09IHR0LmFycm93KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBFYXQgYSBjb21tYSBpZiB0aGVyZSBpcyBvbmVcbiAgICAgICAgICAgICAgdGhpcy5lYXQodHQuY29tbWEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgICAgICB0bXAgPSB0aGlzLmZsb3dQYXJzZUZ1bmN0aW9uVHlwZVBhcmFtcyhbXG4gICAgICAgICAgICAgIHRoaXMucmVpbnRlcnByZXRUeXBlQXNGdW5jdGlvblR5cGVQYXJhbSh0eXBlKSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0bXAgPSB0aGlzLmZsb3dQYXJzZUZ1bmN0aW9uVHlwZVBhcmFtcygpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5vZGUucGFyYW1zID0gdG1wLnBhcmFtcztcbiAgICAgICAgICBub2RlLnJlc3QgPSB0bXAucmVzdDtcbiAgICAgICAgICBub2RlLnRoaXMgPSB0bXAuX3RoaXM7XG5cbiAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5wYXJlblIpO1xuXG4gICAgICAgICAgdGhpcy5leHBlY3QodHQuYXJyb3cpO1xuXG4gICAgICAgICAgbm9kZS5yZXR1cm5UeXBlID0gdGhpcy5mbG93UGFyc2VUeXBlKCk7XG5cbiAgICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gbnVsbDtcblxuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJGdW5jdGlvblR5cGVBbm5vdGF0aW9uXCIpO1xuXG4gICAgICAgIGNhc2UgdHQuc3RyaW5nOlxuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbDxOLlN0cmluZ0xpdGVyYWxUeXBlQW5ub3RhdGlvbj4oXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnZhbHVlLFxuICAgICAgICAgICAgXCJTdHJpbmdMaXRlcmFsVHlwZUFubm90YXRpb25cIixcbiAgICAgICAgICApO1xuXG4gICAgICAgIGNhc2UgdHQuX3RydWU6XG4gICAgICAgIGNhc2UgdHQuX2ZhbHNlOlxuICAgICAgICAgIG5vZGUudmFsdWUgPSB0aGlzLm1hdGNoKHR0Ll90cnVlKTtcbiAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlPE4uQm9vbGVhbkxpdGVyYWxUeXBlQW5ub3RhdGlvbj4oXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgXCJCb29sZWFuTGl0ZXJhbFR5cGVBbm5vdGF0aW9uXCIsXG4gICAgICAgICAgKTtcblxuICAgICAgICBjYXNlIHR0LnBsdXNNaW46XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09IFwiLVwiKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKHR0Lm51bSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaXRlcmFsQXROb2RlPE4uTnVtYmVyTGl0ZXJhbFR5cGVBbm5vdGF0aW9uPihcbiAgICAgICAgICAgICAgICAtdGhpcy5zdGF0ZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcIk51bWJlckxpdGVyYWxUeXBlQW5ub3RhdGlvblwiLFxuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmJpZ2ludCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaXRlcmFsQXROb2RlPE4uQmlnSW50TGl0ZXJhbFR5cGVBbm5vdGF0aW9uPihcbiAgICAgICAgICAgICAgICAtdGhpcy5zdGF0ZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcIkJpZ0ludExpdGVyYWxUeXBlQW5ub3RhdGlvblwiLFxuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRocm93IHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RhcnQsXG4gICAgICAgICAgICAgIEZsb3dFcnJvcnMuVW5leHBlY3RlZFN1YnRyYWN0aW9uT3BlcmFuZCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICAgIGNhc2UgdHQubnVtOlxuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbChcbiAgICAgICAgICAgIHRoaXMuc3RhdGUudmFsdWUsXG4gICAgICAgICAgICBcIk51bWJlckxpdGVyYWxUeXBlQW5ub3RhdGlvblwiLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgY2FzZSB0dC5iaWdpbnQ6XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaXRlcmFsKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS52YWx1ZSxcbiAgICAgICAgICAgIFwiQmlnSW50TGl0ZXJhbFR5cGVBbm5vdGF0aW9uXCIsXG4gICAgICAgICAgKTtcblxuICAgICAgICBjYXNlIHR0Ll92b2lkOlxuICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJWb2lkVHlwZUFubm90YXRpb25cIik7XG5cbiAgICAgICAgY2FzZSB0dC5fbnVsbDpcbiAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiTnVsbExpdGVyYWxUeXBlQW5ub3RhdGlvblwiKTtcblxuICAgICAgICBjYXNlIHR0Ll90aGlzOlxuICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUaGlzVHlwZUFubm90YXRpb25cIik7XG5cbiAgICAgICAgY2FzZSB0dC5zdGFyOlxuICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJFeGlzdHNUeXBlQW5ub3RhdGlvblwiKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUua2V5d29yZCA9PT0gXCJ0eXBlb2ZcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlVHlwZW9mVHlwZSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS50eXBlLmtleXdvcmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gdGhpcy5zdGF0ZS50eXBlLmxhYmVsO1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuY3JlYXRlSWRlbnRpZmllcihub2RlLCBsYWJlbCk7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VQb3N0Zml4VHlwZSgpOiBOLkZsb3dUeXBlQW5ub3RhdGlvbiB7XG4gICAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgICBsZXQgdHlwZSA9IHRoaXMuZmxvd1BhcnNlUHJpbWFyeVR5cGUoKTtcbiAgICAgIGxldCBzZWVuT3B0aW9uYWxJbmRleGVkQWNjZXNzID0gZmFsc2U7XG4gICAgICB3aGlsZSAoXG4gICAgICAgICh0aGlzLm1hdGNoKHR0LmJyYWNrZXRMKSB8fCB0aGlzLm1hdGNoKHR0LnF1ZXN0aW9uRG90KSkgJiZcbiAgICAgICAgIXRoaXMuY2FuSW5zZXJ0U2VtaWNvbG9uKClcbiAgICAgICkge1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgICBjb25zdCBvcHRpb25hbCA9IHRoaXMuZWF0KHR0LnF1ZXN0aW9uRG90KTtcbiAgICAgICAgc2Vlbk9wdGlvbmFsSW5kZXhlZEFjY2VzcyA9IHNlZW5PcHRpb25hbEluZGV4ZWRBY2Nlc3MgfHwgb3B0aW9uYWw7XG4gICAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNrZXRMKTtcbiAgICAgICAgaWYgKCFvcHRpb25hbCAmJiB0aGlzLm1hdGNoKHR0LmJyYWNrZXRSKSkge1xuICAgICAgICAgIG5vZGUuZWxlbWVudFR5cGUgPSB0eXBlO1xuICAgICAgICAgIHRoaXMubmV4dCgpOyAvLyBlYXQgYF1gXG4gICAgICAgICAgdHlwZSA9IHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkFycmF5VHlwZUFubm90YXRpb25cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5vYmplY3RUeXBlID0gdHlwZTtcbiAgICAgICAgICBub2RlLmluZGV4VHlwZSA9IHRoaXMuZmxvd1BhcnNlVHlwZSgpO1xuICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNrZXRSKTtcbiAgICAgICAgICBpZiAoc2Vlbk9wdGlvbmFsSW5kZXhlZEFjY2Vzcykge1xuICAgICAgICAgICAgbm9kZS5vcHRpb25hbCA9IG9wdGlvbmFsO1xuICAgICAgICAgICAgdHlwZSA9IHRoaXMuZmluaXNoTm9kZTxOLkZsb3dPcHRpb25hbEluZGV4ZWRBY2Nlc3NUeXBlPihcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgXCJPcHRpb25hbEluZGV4ZWRBY2Nlc3NUeXBlXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0eXBlID0gdGhpcy5maW5pc2hOb2RlPE4uRmxvd0luZGV4ZWRBY2Nlc3NUeXBlPihcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgXCJJbmRleGVkQWNjZXNzVHlwZVwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZVByZWZpeFR5cGUoKTogTi5GbG93VHlwZUFubm90YXRpb24ge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBpZiAodGhpcy5lYXQodHQucXVlc3Rpb24pKSB7XG4gICAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLmZsb3dQYXJzZVByZWZpeFR5cGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIk51bGxhYmxlVHlwZUFubm90YXRpb25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VQb3N0Zml4VHlwZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZsb3dQYXJzZUFub25GdW5jdGlvbldpdGhvdXRQYXJlbnMoKTogTi5GbG93VHlwZUFubm90YXRpb24ge1xuICAgICAgY29uc3QgcGFyYW0gPSB0aGlzLmZsb3dQYXJzZVByZWZpeFR5cGUoKTtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5ub0Fub25GdW5jdGlvblR5cGUgJiYgdGhpcy5lYXQodHQuYXJyb3cpKSB7XG4gICAgICAgIC8vIFRPRE86IFRoaXMgc2hvdWxkIGJlIGEgdHlwZSBlcnJvci4gUGFzc2luZyBpbiBhIFNvdXJjZUxvY2F0aW9uLCBhbmQgaXQgZXhwZWN0cyBhIFBvc2l0aW9uLlxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChwYXJhbS5zdGFydCwgcGFyYW0ubG9jLnN0YXJ0KTtcbiAgICAgICAgbm9kZS5wYXJhbXMgPSBbdGhpcy5yZWludGVycHJldFR5cGVBc0Z1bmN0aW9uVHlwZVBhcmFtKHBhcmFtKV07XG4gICAgICAgIG5vZGUucmVzdCA9IG51bGw7XG4gICAgICAgIG5vZGUudGhpcyA9IG51bGw7XG4gICAgICAgIG5vZGUucmV0dXJuVHlwZSA9IHRoaXMuZmxvd1BhcnNlVHlwZSgpO1xuICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkZ1bmN0aW9uVHlwZUFubm90YXRpb25cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlSW50ZXJzZWN0aW9uVHlwZSgpOiBOLkZsb3dUeXBlQW5ub3RhdGlvbiB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHRoaXMuZWF0KHR0LmJpdHdpc2VBTkQpO1xuICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZmxvd1BhcnNlQW5vbkZ1bmN0aW9uV2l0aG91dFBhcmVucygpO1xuICAgICAgbm9kZS50eXBlcyA9IFt0eXBlXTtcbiAgICAgIHdoaWxlICh0aGlzLmVhdCh0dC5iaXR3aXNlQU5EKSkge1xuICAgICAgICBub2RlLnR5cGVzLnB1c2godGhpcy5mbG93UGFyc2VBbm9uRnVuY3Rpb25XaXRob3V0UGFyZW5zKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGUudHlwZXMubGVuZ3RoID09PSAxXG4gICAgICAgID8gdHlwZVxuICAgICAgICA6IHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkludGVyc2VjdGlvblR5cGVBbm5vdGF0aW9uXCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZVVuaW9uVHlwZSgpOiBOLkZsb3dUeXBlQW5ub3RhdGlvbiB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHRoaXMuZWF0KHR0LmJpdHdpc2VPUik7XG4gICAgICBjb25zdCB0eXBlID0gdGhpcy5mbG93UGFyc2VJbnRlcnNlY3Rpb25UeXBlKCk7XG4gICAgICBub2RlLnR5cGVzID0gW3R5cGVdO1xuICAgICAgd2hpbGUgKHRoaXMuZWF0KHR0LmJpdHdpc2VPUikpIHtcbiAgICAgICAgbm9kZS50eXBlcy5wdXNoKHRoaXMuZmxvd1BhcnNlSW50ZXJzZWN0aW9uVHlwZSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub2RlLnR5cGVzLmxlbmd0aCA9PT0gMVxuICAgICAgICA/IHR5cGVcbiAgICAgICAgOiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJVbmlvblR5cGVBbm5vdGF0aW9uXCIpO1xuICAgIH1cblxuICAgIGZsb3dQYXJzZVR5cGUoKTogTi5GbG93VHlwZUFubm90YXRpb24ge1xuICAgICAgY29uc3Qgb2xkSW5UeXBlID0gdGhpcy5zdGF0ZS5pblR5cGU7XG4gICAgICB0aGlzLnN0YXRlLmluVHlwZSA9IHRydWU7XG4gICAgICBjb25zdCB0eXBlID0gdGhpcy5mbG93UGFyc2VVbmlvblR5cGUoKTtcbiAgICAgIHRoaXMuc3RhdGUuaW5UeXBlID0gb2xkSW5UeXBlO1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlVHlwZU9ySW1wbGljaXRJbnN0YW50aWF0aW9uKCk6IE4uRmxvd1R5cGVBbm5vdGF0aW9uIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnR5cGUgPT09IHR0Lm5hbWUgJiYgdGhpcy5zdGF0ZS52YWx1ZSA9PT0gXCJfXCIpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VHZW5lcmljVHlwZShzdGFydFBvcywgc3RhcnRMb2MsIG5vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlVHlwZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZsb3dQYXJzZVR5cGVBbm5vdGF0aW9uKCk6IE4uRmxvd1R5cGVBbm5vdGF0aW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmxvd1BhcnNlVHlwZUluaXRpYWxpc2VyKCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVHlwZUFubm90YXRpb25cIik7XG4gICAgfVxuXG4gICAgZmxvd1BhcnNlVHlwZUFubm90YXRhYmxlSWRlbnRpZmllcihcbiAgICAgIGFsbG93UHJpbWl0aXZlT3ZlcnJpZGU/OiBib29sZWFuLFxuICAgICk6IE4uSWRlbnRpZmllciB7XG4gICAgICBjb25zdCBpZGVudCA9IGFsbG93UHJpbWl0aXZlT3ZlcnJpZGVcbiAgICAgICAgPyB0aGlzLnBhcnNlSWRlbnRpZmllcigpXG4gICAgICAgIDogdGhpcy5mbG93UGFyc2VSZXN0cmljdGVkSWRlbnRpZmllcigpO1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuY29sb24pKSB7XG4gICAgICAgIGlkZW50LnR5cGVBbm5vdGF0aW9uID0gdGhpcy5mbG93UGFyc2VUeXBlQW5ub3RhdGlvbigpO1xuICAgICAgICB0aGlzLnJlc2V0RW5kTG9jYXRpb24oaWRlbnQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlkZW50O1xuICAgIH1cblxuICAgIHR5cGVDYXN0VG9QYXJhbWV0ZXIobm9kZTogTi5Ob2RlKTogTi5Ob2RlIHtcbiAgICAgIG5vZGUuZXhwcmVzc2lvbi50eXBlQW5ub3RhdGlvbiA9IG5vZGUudHlwZUFubm90YXRpb247XG5cbiAgICAgIHRoaXMucmVzZXRFbmRMb2NhdGlvbihcbiAgICAgICAgbm9kZS5leHByZXNzaW9uLFxuICAgICAgICBub2RlLnR5cGVBbm5vdGF0aW9uLmVuZCxcbiAgICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbi5sb2MuZW5kLFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIG5vZGUuZXhwcmVzc2lvbjtcbiAgICB9XG5cbiAgICBmbG93UGFyc2VWYXJpYW5jZSgpOiA/Ti5GbG93VmFyaWFuY2Uge1xuICAgICAgbGV0IHZhcmlhbmNlID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnBsdXNNaW4pKSB7XG4gICAgICAgIHZhcmlhbmNlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09IFwiK1wiKSB7XG4gICAgICAgICAgdmFyaWFuY2Uua2luZCA9IFwicGx1c1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhcmlhbmNlLmtpbmQgPSBcIm1pbnVzXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMuZmluaXNoTm9kZSh2YXJpYW5jZSwgXCJWYXJpYW5jZVwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YXJpYW5jZTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gT3ZlcnJpZGVzXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgcGFyc2VGdW5jdGlvbkJvZHkoXG4gICAgICBub2RlOiBOLkZ1bmN0aW9uLFxuICAgICAgYWxsb3dFeHByZXNzaW9uQm9keTogP2Jvb2xlYW4sXG4gICAgICBpc01ldGhvZD86IGJvb2xlYW4gPSBmYWxzZSxcbiAgICApOiB2b2lkIHtcbiAgICAgIGlmIChhbGxvd0V4cHJlc3Npb25Cb2R5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcndhcmROb0Fycm93UGFyYW1zQ29udmVyc2lvbkF0KG5vZGUsICgpID0+XG4gICAgICAgICAgc3VwZXIucGFyc2VGdW5jdGlvbkJvZHkobm9kZSwgdHJ1ZSwgaXNNZXRob2QpLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VGdW5jdGlvbkJvZHkobm9kZSwgZmFsc2UsIGlzTWV0aG9kKTtcbiAgICB9XG5cbiAgICBwYXJzZUZ1bmN0aW9uQm9keUFuZEZpbmlzaChcbiAgICAgIG5vZGU6IE4uQm9kaWxlc3NGdW5jdGlvbk9yTWV0aG9kQmFzZSxcbiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICAgIGlzTWV0aG9kPzogYm9vbGVhbiA9IGZhbHNlLFxuICAgICk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuY29sb24pKSB7XG4gICAgICAgIGNvbnN0IHR5cGVOb2RlID0gdGhpcy5zdGFydE5vZGUoKTtcblxuICAgICAgICBbXG4gICAgICAgICAgLy8gJEZsb3dGaXhNZSAoZGVzdHJ1Y3R1cmluZyBub3Qgc3VwcG9ydGVkIHlldClcbiAgICAgICAgICB0eXBlTm9kZS50eXBlQW5ub3RhdGlvbixcbiAgICAgICAgICAvLyAkRmxvd0ZpeE1lIChkZXN0cnVjdHVyaW5nIG5vdCBzdXBwb3J0ZWQgeWV0KVxuICAgICAgICAgIG5vZGUucHJlZGljYXRlLFxuICAgICAgICBdID0gdGhpcy5mbG93UGFyc2VUeXBlQW5kUHJlZGljYXRlSW5pdGlhbGlzZXIoKTtcblxuICAgICAgICBub2RlLnJldHVyblR5cGUgPSB0eXBlTm9kZS50eXBlQW5ub3RhdGlvblxuICAgICAgICAgID8gdGhpcy5maW5pc2hOb2RlKHR5cGVOb2RlLCBcIlR5cGVBbm5vdGF0aW9uXCIpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgfVxuXG4gICAgICBzdXBlci5wYXJzZUZ1bmN0aW9uQm9keUFuZEZpbmlzaChub2RlLCB0eXBlLCBpc01ldGhvZCk7XG4gICAgfVxuXG4gICAgLy8gaW50ZXJmYWNlcyBhbmQgZW51bXNcbiAgICBwYXJzZVN0YXRlbWVudChjb250ZXh0OiA/c3RyaW5nLCB0b3BMZXZlbD86IGJvb2xlYW4pOiBOLlN0YXRlbWVudCB7XG4gICAgICAvLyBzdHJpY3QgbW9kZSBoYW5kbGluZyBvZiBgaW50ZXJmYWNlYCBzaW5jZSBpdCdzIGEgcmVzZXJ2ZWQgd29yZFxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLnN0cmljdCAmJlxuICAgICAgICB0aGlzLm1hdGNoKHR0Lm5hbWUpICYmXG4gICAgICAgIHRoaXMuc3RhdGUudmFsdWUgPT09IFwiaW50ZXJmYWNlXCJcbiAgICAgICkge1xuICAgICAgICBjb25zdCBsb29rYWhlYWQgPSB0aGlzLmxvb2thaGVhZCgpO1xuICAgICAgICBpZiAobG9va2FoZWFkLnR5cGUgPT09IHR0Lm5hbWUgfHwgaXNLZXl3b3JkKGxvb2thaGVhZC52YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VJbnRlcmZhY2Uobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zaG91bGRQYXJzZUVudW1zKCkgJiYgdGhpcy5pc0NvbnRleHR1YWwoXCJlbnVtXCIpKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlRW51bURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3RtdCA9IHN1cGVyLnBhcnNlU3RhdGVtZW50KGNvbnRleHQsIHRvcExldmVsKTtcbiAgICAgIC8vIFdlIHdpbGwgcGFyc2UgYSBmbG93IHByYWdtYSBpbiBhbnkgY29tbWVudCBiZWZvcmUgdGhlIGZpcnN0IHN0YXRlbWVudC5cbiAgICAgIGlmICh0aGlzLmZsb3dQcmFnbWEgPT09IHVuZGVmaW5lZCAmJiAhdGhpcy5pc1ZhbGlkRGlyZWN0aXZlKHN0bXQpKSB7XG4gICAgICAgIHRoaXMuZmxvd1ByYWdtYSA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RtdDtcbiAgICB9XG5cbiAgICAvLyBkZWNsYXJlcywgaW50ZXJmYWNlcyBhbmQgdHlwZSBhbGlhc2VzXG4gICAgcGFyc2VFeHByZXNzaW9uU3RhdGVtZW50KFxuICAgICAgbm9kZTogTi5FeHByZXNzaW9uU3RhdGVtZW50LFxuICAgICAgZXhwcjogTi5FeHByZXNzaW9uLFxuICAgICk6IE4uRXhwcmVzc2lvblN0YXRlbWVudCB7XG4gICAgICBpZiAoZXhwci50eXBlID09PSBcIklkZW50aWZpZXJcIikge1xuICAgICAgICBpZiAoZXhwci5uYW1lID09PSBcImRlY2xhcmVcIikge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMubWF0Y2godHQuX2NsYXNzKSB8fFxuICAgICAgICAgICAgdGhpcy5tYXRjaCh0dC5uYW1lKSB8fFxuICAgICAgICAgICAgdGhpcy5tYXRjaCh0dC5fZnVuY3Rpb24pIHx8XG4gICAgICAgICAgICB0aGlzLm1hdGNoKHR0Ll92YXIpIHx8XG4gICAgICAgICAgICB0aGlzLm1hdGNoKHR0Ll9leHBvcnQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VEZWNsYXJlKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0Lm5hbWUpKSB7XG4gICAgICAgICAgaWYgKGV4cHIubmFtZSA9PT0gXCJpbnRlcmZhY2VcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlSW50ZXJmYWNlKG5vZGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXhwci5uYW1lID09PSBcInR5cGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlVHlwZUFsaWFzKG5vZGUpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXhwci5uYW1lID09PSBcIm9wYXF1ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VPcGFxdWVUeXBlKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlRXhwcmVzc2lvblN0YXRlbWVudChub2RlLCBleHByKTtcbiAgICB9XG5cbiAgICAvLyBleHBvcnQgdHlwZVxuICAgIHNob3VsZFBhcnNlRXhwb3J0RGVjbGFyYXRpb24oKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmlzQ29udGV4dHVhbChcInR5cGVcIikgfHxcbiAgICAgICAgdGhpcy5pc0NvbnRleHR1YWwoXCJpbnRlcmZhY2VcIikgfHxcbiAgICAgICAgdGhpcy5pc0NvbnRleHR1YWwoXCJvcGFxdWVcIikgfHxcbiAgICAgICAgKHRoaXMuc2hvdWxkUGFyc2VFbnVtcygpICYmIHRoaXMuaXNDb250ZXh0dWFsKFwiZW51bVwiKSkgfHxcbiAgICAgICAgc3VwZXIuc2hvdWxkUGFyc2VFeHBvcnREZWNsYXJhdGlvbigpXG4gICAgICApO1xuICAgIH1cblxuICAgIGlzRXhwb3J0RGVmYXVsdFNwZWNpZmllcigpOiBib29sZWFuIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5tYXRjaCh0dC5uYW1lKSAmJlxuICAgICAgICAodGhpcy5zdGF0ZS52YWx1ZSA9PT0gXCJ0eXBlXCIgfHxcbiAgICAgICAgICB0aGlzLnN0YXRlLnZhbHVlID09PSBcImludGVyZmFjZVwiIHx8XG4gICAgICAgICAgdGhpcy5zdGF0ZS52YWx1ZSA9PT0gXCJvcGFxdWVcIiB8fFxuICAgICAgICAgICh0aGlzLnNob3VsZFBhcnNlRW51bXMoKSAmJiB0aGlzLnN0YXRlLnZhbHVlID09PSBcImVudW1cIikpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIuaXNFeHBvcnREZWZhdWx0U3BlY2lmaWVyKCk7XG4gICAgfVxuXG4gICAgcGFyc2VFeHBvcnREZWZhdWx0RXhwcmVzc2lvbigpOiBOLkV4cHJlc3Npb24gfCBOLkRlY2xhcmF0aW9uIHtcbiAgICAgIGlmICh0aGlzLnNob3VsZFBhcnNlRW51bXMoKSAmJiB0aGlzLmlzQ29udGV4dHVhbChcImVudW1cIikpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VFbnVtRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VFeHBvcnREZWZhdWx0RXhwcmVzc2lvbigpO1xuICAgIH1cblxuICAgIHBhcnNlQ29uZGl0aW9uYWwoXG4gICAgICBleHByOiBOLkV4cHJlc3Npb24sXG4gICAgICBzdGFydFBvczogbnVtYmVyLFxuICAgICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycz86ID9FeHByZXNzaW9uRXJyb3JzLFxuICAgICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgICBpZiAoIXRoaXMubWF0Y2godHQucXVlc3Rpb24pKSByZXR1cm4gZXhwcjtcblxuICAgICAgLy8gb25seSB1c2UgdGhlIGV4cGVuc2l2ZSBcInRyeVBhcnNlXCIgbWV0aG9kIGlmIHRoZXJlIGlzIGEgcXVlc3Rpb24gbWFya1xuICAgICAgLy8gYW5kIGlmIHdlIGNvbWUgZnJvbSBpbnNpZGUgcGFyZW5zXG4gICAgICBpZiAodGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJ5UGFyc2UoKCkgPT5cbiAgICAgICAgICBzdXBlci5wYXJzZUNvbmRpdGlvbmFsKGV4cHIsIHN0YXJ0UG9zLCBzdGFydExvYyksXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFyZXN1bHQubm9kZSkge1xuICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgICAgIC8qOjogaW52YXJpYW50KHJlZkV4cHJlc3Npb25FcnJvcnMgIT0gbnVsbCkgKi9cbiAgICAgICAgICAgIHN1cGVyLnNldE9wdGlvbmFsUGFyYW1ldGVyc0Vycm9yKHJlZkV4cHJlc3Npb25FcnJvcnMsIHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0LmVycm9yKSB0aGlzLnN0YXRlID0gcmVzdWx0LmZhaWxTdGF0ZTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5ub2RlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4cGVjdCh0dC5xdWVzdGlvbik7XG4gICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUuY2xvbmUoKTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsTm9BcnJvd0F0ID0gdGhpcy5zdGF0ZS5ub0Fycm93QXQ7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgbGV0IHsgY29uc2VxdWVudCwgZmFpbGVkIH0gPSB0aGlzLnRyeVBhcnNlQ29uZGl0aW9uYWxDb25zZXF1ZW50KCk7XG4gICAgICBsZXQgW3ZhbGlkLCBpbnZhbGlkXSA9IHRoaXMuZ2V0QXJyb3dMaWtlRXhwcmVzc2lvbnMoY29uc2VxdWVudCk7XG5cbiAgICAgIGlmIChmYWlsZWQgfHwgaW52YWxpZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG5vQXJyb3dBdCA9IFsuLi5vcmlnaW5hbE5vQXJyb3dBdF07XG5cbiAgICAgICAgaWYgKGludmFsaWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICB0aGlzLnN0YXRlLm5vQXJyb3dBdCA9IG5vQXJyb3dBdDtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW52YWxpZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbm9BcnJvd0F0LnB1c2goaW52YWxpZFtpXS5zdGFydCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgKHsgY29uc2VxdWVudCwgZmFpbGVkIH0gPSB0aGlzLnRyeVBhcnNlQ29uZGl0aW9uYWxDb25zZXF1ZW50KCkpO1xuICAgICAgICAgIFt2YWxpZCwgaW52YWxpZF0gPSB0aGlzLmdldEFycm93TGlrZUV4cHJlc3Npb25zKGNvbnNlcXVlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZhaWxlZCAmJiB2YWxpZC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIHR3byBvciBtb3JlIHBvc3NpYmxlIGNvcnJlY3Qgd2F5cyBvZiBwYXJzaW5nLCB0aHJvdyBhblxuICAgICAgICAgIC8vIGVycm9yLlxuICAgICAgICAgIC8vIGUuZy4gICBTb3VyY2U6IGEgPyAoYik6IGMgPT4gKGQpOiBlID0+IGZcbiAgICAgICAgICAvLyAgICAgIFJlc3VsdCAxOiBhID8gYiA6IChjID0+ICgoZCk6IGUgPT4gZikpXG4gICAgICAgICAgLy8gICAgICBSZXN1bHQgMjogYSA/ICgoYik6IGMgPT4gZCkgOiAoZSA9PiBmKVxuICAgICAgICAgIHRoaXMucmFpc2Uoc3RhdGUuc3RhcnQsIEZsb3dFcnJvcnMuQW1iaWd1b3VzQ29uZGl0aW9uYWxBcnJvdyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmFpbGVkICYmIHZhbGlkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICB0aGlzLnN0YXRlLm5vQXJyb3dBdCA9IG5vQXJyb3dBdC5jb25jYXQodmFsaWRbMF0uc3RhcnQpO1xuICAgICAgICAgICh7IGNvbnNlcXVlbnQsIGZhaWxlZCB9ID0gdGhpcy50cnlQYXJzZUNvbmRpdGlvbmFsQ29uc2VxdWVudCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmdldEFycm93TGlrZUV4cHJlc3Npb25zKGNvbnNlcXVlbnQsIHRydWUpO1xuXG4gICAgICB0aGlzLnN0YXRlLm5vQXJyb3dBdCA9IG9yaWdpbmFsTm9BcnJvd0F0O1xuICAgICAgdGhpcy5leHBlY3QodHQuY29sb24pO1xuXG4gICAgICBub2RlLnRlc3QgPSBleHByO1xuICAgICAgbm9kZS5jb25zZXF1ZW50ID0gY29uc2VxdWVudDtcbiAgICAgIG5vZGUuYWx0ZXJuYXRlID0gdGhpcy5mb3J3YXJkTm9BcnJvd1BhcmFtc0NvbnZlcnNpb25BdChub2RlLCAoKSA9PlxuICAgICAgICB0aGlzLnBhcnNlTWF5YmVBc3NpZ24odW5kZWZpbmVkLCB1bmRlZmluZWQpLFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkNvbmRpdGlvbmFsRXhwcmVzc2lvblwiKTtcbiAgICB9XG5cbiAgICB0cnlQYXJzZUNvbmRpdGlvbmFsQ29uc2VxdWVudCgpOiB7XG4gICAgICBjb25zZXF1ZW50OiBOLkV4cHJlc3Npb24sXG4gICAgICBmYWlsZWQ6IGJvb2xlYW4sXG4gICAgfSB7XG4gICAgICB0aGlzLnN0YXRlLm5vQXJyb3dQYXJhbXNDb252ZXJzaW9uQXQucHVzaCh0aGlzLnN0YXRlLnN0YXJ0KTtcblxuICAgICAgY29uc3QgY29uc2VxdWVudCA9IHRoaXMucGFyc2VNYXliZUFzc2lnbkFsbG93SW4oKTtcbiAgICAgIGNvbnN0IGZhaWxlZCA9ICF0aGlzLm1hdGNoKHR0LmNvbG9uKTtcblxuICAgICAgdGhpcy5zdGF0ZS5ub0Fycm93UGFyYW1zQ29udmVyc2lvbkF0LnBvcCgpO1xuXG4gICAgICByZXR1cm4geyBjb25zZXF1ZW50LCBmYWlsZWQgfTtcbiAgICB9XG5cbiAgICAvLyBHaXZlbiBhbiBleHByZXNzaW9uLCB3YWxrcyB0aHJvdWdoIG91dCBpdHMgYXJyb3cgZnVuY3Rpb25zIHdob3NlIGJvZHkgaXNcbiAgICAvLyBhbiBleHByZXNzaW9uIGFuZCB0aHJvdWdoIG91dCBjb25kaXRpb25hbCBleHByZXNzaW9ucy4gSXQgcmV0dXJucyBldmVyeVxuICAgIC8vIGZ1bmN0aW9uIHdoaWNoIGhhcyBiZWVuIHBhcnNlZCB3aXRoIGEgcmV0dXJuIHR5cGUgYnV0IGNvdWxkIGhhdmUgYmVlblxuICAgIC8vIHBhcmVudGhlc2l6ZWQgZXhwcmVzc2lvbnMuXG4gICAgLy8gVGhlc2UgZnVuY3Rpb25zIGFyZSBzZXBhcmF0ZWQgaW50byB0d28gYXJyYXlzOiBvbmUgY29udGFpbmluZyB0aGUgb25lc1xuICAgIC8vIHdob3NlIHBhcmFtZXRlcnMgY2FuIGJlIGNvbnZlcnRlZCB0byBhc3NpZ25hYmxlIGxpc3RzLCBvbmUgY29udGFpbmluZyB0aGVcbiAgICAvLyBvdGhlcnMuXG4gICAgZ2V0QXJyb3dMaWtlRXhwcmVzc2lvbnMoXG4gICAgICBub2RlOiBOLkV4cHJlc3Npb24sXG4gICAgICBkaXNhbGxvd0ludmFsaWQ/OiBib29sZWFuLFxuICAgICk6IFtOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uW10sIE4uQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25bXV0ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBbbm9kZV07XG4gICAgICBjb25zdCBhcnJvd3M6IE4uQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25bXSA9IFtdO1xuXG4gICAgICB3aGlsZSAoc3RhY2subGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvblwiKSB7XG4gICAgICAgICAgaWYgKG5vZGUudHlwZVBhcmFtZXRlcnMgfHwgIW5vZGUucmV0dXJuVHlwZSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBhcnJvdyBleHByZXNzaW9uIHdpdGhvdXQgYW1iaWd1aXR5LCBzbyBjaGVjayBpdHMgcGFyYW1ldGVyc1xuICAgICAgICAgICAgdGhpcy5maW5pc2hBcnJvd1ZhbGlkYXRpb24obm9kZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFycm93cy5wdXNoKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGFjay5wdXNoKG5vZGUuYm9keSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSBcIkNvbmRpdGlvbmFsRXhwcmVzc2lvblwiKSB7XG4gICAgICAgICAgc3RhY2sucHVzaChub2RlLmNvbnNlcXVlbnQpO1xuICAgICAgICAgIHN0YWNrLnB1c2gobm9kZS5hbHRlcm5hdGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChkaXNhbGxvd0ludmFsaWQpIHtcbiAgICAgICAgYXJyb3dzLmZvckVhY2gobm9kZSA9PiB0aGlzLmZpbmlzaEFycm93VmFsaWRhdGlvbihub2RlKSk7XG4gICAgICAgIHJldHVybiBbYXJyb3dzLCBbXV07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwYXJ0aXRpb24oYXJyb3dzLCBub2RlID0+XG4gICAgICAgIG5vZGUucGFyYW1zLmV2ZXJ5KHBhcmFtID0+IHRoaXMuaXNBc3NpZ25hYmxlKHBhcmFtLCB0cnVlKSksXG4gICAgICApO1xuICAgIH1cblxuICAgIGZpbmlzaEFycm93VmFsaWRhdGlvbihub2RlOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uKSB7XG4gICAgICB0aGlzLnRvQXNzaWduYWJsZUxpc3QoXG4gICAgICAgIC8vIG5vZGUucGFyYW1zIGlzIEV4cHJlc3Npb25bXSBpbnN0ZWFkIG9mICRSZWFkT25seUFycmF5PFBhdHRlcm4+IGJlY2F1c2UgaXRcbiAgICAgICAgLy8gaGFzIG5vdCBiZWVuIGNvbnZlcnRlZCB5ZXQuXG4gICAgICAgICgobm9kZS5wYXJhbXM6IGFueSk6IE4uRXhwcmVzc2lvbltdKSxcbiAgICAgICAgbm9kZS5leHRyYT8udHJhaWxpbmdDb21tYSxcbiAgICAgICAgLyogaXNMSFMgKi8gZmFsc2UsXG4gICAgICApO1xuICAgICAgLy8gRW50ZXIgc2NvcGUsIGFzIGNoZWNrUGFyYW1zIGRlZmluZXMgYmluZGluZ3NcbiAgICAgIHRoaXMuc2NvcGUuZW50ZXIoU0NPUEVfRlVOQ1RJT04gfCBTQ09QRV9BUlJPVyk7XG4gICAgICAvLyBVc2Ugc3VwZXIncyBtZXRob2QgdG8gZm9yY2UgdGhlIHBhcmFtZXRlcnMgdG8gYmUgY2hlY2tlZFxuICAgICAgc3VwZXIuY2hlY2tQYXJhbXMobm9kZSwgZmFsc2UsIHRydWUpO1xuICAgICAgdGhpcy5zY29wZS5leGl0KCk7XG4gICAgfVxuXG4gICAgZm9yd2FyZE5vQXJyb3dQYXJhbXNDb252ZXJzaW9uQXQ8VD4obm9kZTogTi5Ob2RlLCBwYXJzZTogKCkgPT4gVCk6IFQge1xuICAgICAgbGV0IHJlc3VsdDogVDtcbiAgICAgIGlmICh0aGlzLnN0YXRlLm5vQXJyb3dQYXJhbXNDb252ZXJzaW9uQXQuaW5kZXhPZihub2RlLnN0YXJ0KSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5ub0Fycm93UGFyYW1zQ29udmVyc2lvbkF0LnB1c2godGhpcy5zdGF0ZS5zdGFydCk7XG4gICAgICAgIHJlc3VsdCA9IHBhcnNlKCk7XG4gICAgICAgIHRoaXMuc3RhdGUubm9BcnJvd1BhcmFtc0NvbnZlcnNpb25BdC5wb3AoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHBhcnNlKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcGFyc2VQYXJlbkl0ZW0oXG4gICAgICBub2RlOiBOLkV4cHJlc3Npb24sXG4gICAgICBzdGFydFBvczogbnVtYmVyLFxuICAgICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgICBub2RlID0gc3VwZXIucGFyc2VQYXJlbkl0ZW0obm9kZSwgc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICAgIGlmICh0aGlzLmVhdCh0dC5xdWVzdGlvbikpIHtcbiAgICAgICAgbm9kZS5vcHRpb25hbCA9IHRydWU7XG4gICAgICAgIC8vIEluY2x1ZGUgcXVlc3Rpb25tYXJrIGluIGxvY2F0aW9uIG9mIG5vZGVcbiAgICAgICAgLy8gRG9uJ3QgdXNlIHRoaXMuZmluaXNoTm9kZSgpIGFzIG90aGVyd2lzZSB3ZSBtaWdodCBwcm9jZXNzIGNvbW1lbnRzIHR3aWNlIGFuZFxuICAgICAgICAvLyBpbmNsdWRlIGFscmVhZHkgY29uc3VtZWQgcGFyZW5zXG4gICAgICAgIHRoaXMucmVzZXRFbmRMb2NhdGlvbihub2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubWF0Y2godHQuY29sb24pKSB7XG4gICAgICAgIGNvbnN0IHR5cGVDYXN0Tm9kZSA9IHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICAgICAgdHlwZUNhc3ROb2RlLmV4cHJlc3Npb24gPSBub2RlO1xuICAgICAgICB0eXBlQ2FzdE5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLmZsb3dQYXJzZVR5cGVBbm5vdGF0aW9uKCk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZSh0eXBlQ2FzdE5vZGUsIFwiVHlwZUNhc3RFeHByZXNzaW9uXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBhc3NlcnRNb2R1bGVOb2RlQWxsb3dlZChub2RlOiBOLk5vZGUpIHtcbiAgICAgIGlmIChcbiAgICAgICAgKG5vZGUudHlwZSA9PT0gXCJJbXBvcnREZWNsYXJhdGlvblwiICYmXG4gICAgICAgICAgKG5vZGUuaW1wb3J0S2luZCA9PT0gXCJ0eXBlXCIgfHwgbm9kZS5pbXBvcnRLaW5kID09PSBcInR5cGVvZlwiKSkgfHxcbiAgICAgICAgKG5vZGUudHlwZSA9PT0gXCJFeHBvcnROYW1lZERlY2xhcmF0aW9uXCIgJiZcbiAgICAgICAgICBub2RlLmV4cG9ydEtpbmQgPT09IFwidHlwZVwiKSB8fFxuICAgICAgICAobm9kZS50eXBlID09PSBcIkV4cG9ydEFsbERlY2xhcmF0aW9uXCIgJiYgbm9kZS5leHBvcnRLaW5kID09PSBcInR5cGVcIilcbiAgICAgICkge1xuICAgICAgICAvLyBBbGxvdyBGbG93dHlwZSBpbXBvcnRzIGFuZCBleHBvcnRzIGluIGFsbCBjb25kaXRpb25zIGJlY2F1c2VcbiAgICAgICAgLy8gRmxvdyBpdHNlbGYgZG9lcyBub3QgY2FyZSBhYm91dCAnc291cmNlVHlwZScuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3VwZXIuYXNzZXJ0TW9kdWxlTm9kZUFsbG93ZWQobm9kZSk7XG4gICAgfVxuXG4gICAgcGFyc2VFeHBvcnQobm9kZTogTi5Ob2RlKTogTi5BbnlFeHBvcnQge1xuICAgICAgY29uc3QgZGVjbCA9IHN1cGVyLnBhcnNlRXhwb3J0KG5vZGUpO1xuICAgICAgaWYgKFxuICAgICAgICBkZWNsLnR5cGUgPT09IFwiRXhwb3J0TmFtZWREZWNsYXJhdGlvblwiIHx8XG4gICAgICAgIGRlY2wudHlwZSA9PT0gXCJFeHBvcnRBbGxEZWNsYXJhdGlvblwiXG4gICAgICApIHtcbiAgICAgICAgZGVjbC5leHBvcnRLaW5kID0gZGVjbC5leHBvcnRLaW5kIHx8IFwidmFsdWVcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWNsO1xuICAgIH1cblxuICAgIHBhcnNlRXhwb3J0RGVjbGFyYXRpb24obm9kZTogTi5FeHBvcnROYW1lZERlY2xhcmF0aW9uKTogP04uRGVjbGFyYXRpb24ge1xuICAgICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwidHlwZVwiKSkge1xuICAgICAgICBub2RlLmV4cG9ydEtpbmQgPSBcInR5cGVcIjtcblxuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbk5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcblxuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5icmFjZUwpKSB7XG4gICAgICAgICAgLy8gZXhwb3J0IHR5cGUgeyBmb28sIGJhciB9O1xuICAgICAgICAgIG5vZGUuc3BlY2lmaWVycyA9IHRoaXMucGFyc2VFeHBvcnRTcGVjaWZpZXJzKCk7XG4gICAgICAgICAgdGhpcy5wYXJzZUV4cG9ydEZyb20obm9kZSk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZXhwb3J0IHR5cGUgRm9vID0gQmFyO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dQYXJzZVR5cGVBbGlhcyhkZWNsYXJhdGlvbk5vZGUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwib3BhcXVlXCIpKSB7XG4gICAgICAgIG5vZGUuZXhwb3J0S2luZCA9IFwidHlwZVwiO1xuXG4gICAgICAgIGNvbnN0IGRlY2xhcmF0aW9uTm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAvLyBleHBvcnQgb3BhcXVlIHR5cGUgRm9vID0gQmFyO1xuICAgICAgICByZXR1cm4gdGhpcy5mbG93UGFyc2VPcGFxdWVUeXBlKGRlY2xhcmF0aW9uTm9kZSwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29udGV4dHVhbChcImludGVyZmFjZVwiKSkge1xuICAgICAgICBub2RlLmV4cG9ydEtpbmQgPSBcInR5cGVcIjtcbiAgICAgICAgY29uc3QgZGVjbGFyYXRpb25Ob2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLmZsb3dQYXJzZUludGVyZmFjZShkZWNsYXJhdGlvbk5vZGUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNob3VsZFBhcnNlRW51bXMoKSAmJiB0aGlzLmlzQ29udGV4dHVhbChcImVudW1cIikpIHtcbiAgICAgICAgbm9kZS5leHBvcnRLaW5kID0gXCJ2YWx1ZVwiO1xuICAgICAgICBjb25zdCBkZWNsYXJhdGlvbk5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1BhcnNlRW51bURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uTm9kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VwZXIucGFyc2VFeHBvcnREZWNsYXJhdGlvbihub2RlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlYXRFeHBvcnRTdGFyKG5vZGU6IE4uTm9kZSk6IGJvb2xlYW4ge1xuICAgICAgaWYgKHN1cGVyLmVhdEV4cG9ydFN0YXIoLi4uYXJndW1lbnRzKSkgcmV0dXJuIHRydWU7XG5cbiAgICAgIGlmICh0aGlzLmlzQ29udGV4dHVhbChcInR5cGVcIikgJiYgdGhpcy5sb29rYWhlYWQoKS50eXBlID09PSB0dC5zdGFyKSB7XG4gICAgICAgIG5vZGUuZXhwb3J0S2luZCA9IFwidHlwZVwiO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbWF5YmVQYXJzZUV4cG9ydE5hbWVzcGFjZVNwZWNpZmllcihub2RlOiBOLk5vZGUpOiBib29sZWFuIHtcbiAgICAgIGNvbnN0IHBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBjb25zdCBoYXNOYW1lc3BhY2UgPSBzdXBlci5tYXliZVBhcnNlRXhwb3J0TmFtZXNwYWNlU3BlY2lmaWVyKG5vZGUpO1xuICAgICAgaWYgKGhhc05hbWVzcGFjZSAmJiBub2RlLmV4cG9ydEtpbmQgPT09IFwidHlwZVwiKSB7XG4gICAgICAgIHRoaXMudW5leHBlY3RlZChwb3MpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhhc05hbWVzcGFjZTtcbiAgICB9XG5cbiAgICBwYXJzZUNsYXNzSWQobm9kZTogTi5DbGFzcywgaXNTdGF0ZW1lbnQ6IGJvb2xlYW4sIG9wdGlvbmFsSWQ6ID9ib29sZWFuKSB7XG4gICAgICBzdXBlci5wYXJzZUNsYXNzSWQobm9kZSwgaXNTdGF0ZW1lbnQsIG9wdGlvbmFsSWQpO1xuICAgICAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZUNsYXNzTWVtYmVyKFxuICAgICAgY2xhc3NCb2R5OiBOLkNsYXNzQm9keSxcbiAgICAgIG1lbWJlcjogYW55LFxuICAgICAgc3RhdGU6IE4uUGFyc2VDbGFzc01lbWJlclN0YXRlLFxuICAgICk6IHZvaWQge1xuICAgICAgY29uc3QgcG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgIGlmICh0aGlzLmlzQ29udGV4dHVhbChcImRlY2xhcmVcIikpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyc2VDbGFzc01lbWJlckZyb21Nb2RpZmllcihjbGFzc0JvZHksIG1lbWJlcikpIHtcbiAgICAgICAgICAvLyAnZGVjbGFyZScgaXMgYSBjbGFzcyBlbGVtZW50IG5hbWVcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtZW1iZXIuZGVjbGFyZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHN1cGVyLnBhcnNlQ2xhc3NNZW1iZXIoY2xhc3NCb2R5LCBtZW1iZXIsIHN0YXRlKTtcblxuICAgICAgaWYgKG1lbWJlci5kZWNsYXJlKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBtZW1iZXIudHlwZSAhPT0gXCJDbGFzc1Byb3BlcnR5XCIgJiZcbiAgICAgICAgICBtZW1iZXIudHlwZSAhPT0gXCJDbGFzc1ByaXZhdGVQcm9wZXJ0eVwiICYmXG4gICAgICAgICAgbWVtYmVyLnR5cGUgIT09IFwiUHJvcGVydHlEZWZpbml0aW9uXCIgLy8gVXNlZCBieSBlc3RyZWUgcGx1Z2luXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucmFpc2UocG9zLCBGbG93RXJyb3JzLkRlY2xhcmVDbGFzc0VsZW1lbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKG1lbWJlci52YWx1ZSkge1xuICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICBtZW1iZXIudmFsdWUuc3RhcnQsXG4gICAgICAgICAgICBGbG93RXJyb3JzLkRlY2xhcmVDbGFzc0ZpZWxkSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlzSXRlcmF0b3Iod29yZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gd29yZCA9PT0gXCJpdGVyYXRvclwiIHx8IHdvcmQgPT09IFwiYXN5bmNJdGVyYXRvclwiO1xuICAgIH1cblxuICAgIHJlYWRJdGVyYXRvcigpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHdvcmQgPSBzdXBlci5yZWFkV29yZDEoKTtcbiAgICAgIGNvbnN0IGZ1bGxXb3JkID0gXCJAQFwiICsgd29yZDtcblxuICAgICAgLy8gQWxsb3cgQEBpdGVyYXRvciBhbmQgQEBhc3luY0l0ZXJhdG9yIGFzIGEgaWRlbnRpZmllciBvbmx5IGluc2lkZSB0eXBlXG4gICAgICBpZiAoIXRoaXMuaXNJdGVyYXRvcih3b3JkKSB8fCAhdGhpcy5zdGF0ZS5pblR5cGUpIHtcbiAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRXJyb3JzLkludmFsaWRJZGVudGlmaWVyLCBmdWxsV29yZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQubmFtZSwgZnVsbFdvcmQpO1xuICAgIH1cblxuICAgIC8vIGVuc3VyZSB0aGF0IGluc2lkZSBmbG93IHR5cGVzLCB3ZSBieXBhc3MgdGhlIGpzeCBwYXJzZXIgcGx1Z2luXG4gICAgZ2V0VG9rZW5Gcm9tQ29kZShjb2RlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKTtcbiAgICAgIGlmIChjb2RlID09PSBjaGFyQ29kZXMubGVmdEN1cmx5QnJhY2UgJiYgbmV4dCA9PT0gY2hhckNvZGVzLnZlcnRpY2FsQmFyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE9wKHR0LmJyYWNlQmFyTCwgMik7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLmluVHlwZSAmJlxuICAgICAgICAoY29kZSA9PT0gY2hhckNvZGVzLmdyZWF0ZXJUaGFuIHx8IGNvZGUgPT09IGNoYXJDb2Rlcy5sZXNzVGhhbilcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hPcCh0dC5yZWxhdGlvbmFsLCAxKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5pblR5cGUgJiYgY29kZSA9PT0gY2hhckNvZGVzLnF1ZXN0aW9uTWFyaykge1xuICAgICAgICBpZiAobmV4dCA9PT0gY2hhckNvZGVzLmRvdCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE9wKHR0LnF1ZXN0aW9uRG90LCAyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhbGxvdyBkb3VibGUgbnVsbGFibGUgdHlwZXMgaW4gRmxvdzogPz9zdHJpbmdcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoT3AodHQucXVlc3Rpb24sIDEpO1xuICAgICAgfSBlbHNlIGlmIChpc0l0ZXJhdG9yU3RhcnQoY29kZSwgbmV4dCkpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5wb3MgKz0gMjsgLy8gZWF0IFwiQEBcIlxuICAgICAgICByZXR1cm4gdGhpcy5yZWFkSXRlcmF0b3IoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdXBlci5nZXRUb2tlbkZyb21Db2RlKGNvZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlzQXNzaWduYWJsZShub2RlOiBOLk5vZGUsIGlzQmluZGluZz86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJJZGVudGlmaWVyXCI6XG4gICAgICAgIGNhc2UgXCJPYmplY3RQYXR0ZXJuXCI6XG4gICAgICAgIGNhc2UgXCJBcnJheVBhdHRlcm5cIjpcbiAgICAgICAgY2FzZSBcIkFzc2lnbm1lbnRQYXR0ZXJuXCI6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgY2FzZSBcIk9iamVjdEV4cHJlc3Npb25cIjoge1xuICAgICAgICAgIGNvbnN0IGxhc3QgPSBub2RlLnByb3BlcnRpZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICByZXR1cm4gbm9kZS5wcm9wZXJ0aWVzLmV2ZXJ5KChwcm9wLCBpKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICBwcm9wLnR5cGUgIT09IFwiT2JqZWN0TWV0aG9kXCIgJiZcbiAgICAgICAgICAgICAgKGkgPT09IGxhc3QgfHwgcHJvcC50eXBlID09PSBcIlNwcmVhZEVsZW1lbnRcIikgJiZcbiAgICAgICAgICAgICAgdGhpcy5pc0Fzc2lnbmFibGUocHJvcClcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjYXNlIFwiT2JqZWN0UHJvcGVydHlcIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5pc0Fzc2lnbmFibGUobm9kZS52YWx1ZSk7XG5cbiAgICAgICAgY2FzZSBcIlNwcmVhZEVsZW1lbnRcIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5pc0Fzc2lnbmFibGUobm9kZS5hcmd1bWVudCk7XG5cbiAgICAgICAgY2FzZSBcIkFycmF5RXhwcmVzc2lvblwiOlxuICAgICAgICAgIHJldHVybiBub2RlLmVsZW1lbnRzLmV2ZXJ5KGVsZW1lbnQgPT4gdGhpcy5pc0Fzc2lnbmFibGUoZWxlbWVudCkpO1xuXG4gICAgICAgIGNhc2UgXCJBc3NpZ25tZW50RXhwcmVzc2lvblwiOlxuICAgICAgICAgIHJldHVybiBub2RlLm9wZXJhdG9yID09PSBcIj1cIjtcblxuICAgICAgICBjYXNlIFwiUGFyZW50aGVzaXplZEV4cHJlc3Npb25cIjpcbiAgICAgICAgY2FzZSBcIlR5cGVDYXN0RXhwcmVzc2lvblwiOlxuICAgICAgICAgIHJldHVybiB0aGlzLmlzQXNzaWduYWJsZShub2RlLmV4cHJlc3Npb24pO1xuXG4gICAgICAgIGNhc2UgXCJNZW1iZXJFeHByZXNzaW9uXCI6XG4gICAgICAgIGNhc2UgXCJPcHRpb25hbE1lbWJlckV4cHJlc3Npb25cIjpcbiAgICAgICAgICByZXR1cm4gIWlzQmluZGluZztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b0Fzc2lnbmFibGUobm9kZTogTi5Ob2RlLCBpc0xIUzogYm9vbGVhbiA9IGZhbHNlKTogTi5Ob2RlIHtcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiVHlwZUNhc3RFeHByZXNzaW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnRvQXNzaWduYWJsZSh0aGlzLnR5cGVDYXN0VG9QYXJhbWV0ZXIobm9kZSksIGlzTEhTKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdXBlci50b0Fzc2lnbmFibGUobm9kZSwgaXNMSFMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHR1cm4gdHlwZSBjYXN0cyB0aGF0IHdlIGZvdW5kIGluIGZ1bmN0aW9uIHBhcmFtZXRlciBoZWFkIGludG8gdHlwZSBhbm5vdGF0ZWQgcGFyYW1zXG4gICAgdG9Bc3NpZ25hYmxlTGlzdChcbiAgICAgIGV4cHJMaXN0OiBOLkV4cHJlc3Npb25bXSxcbiAgICAgIHRyYWlsaW5nQ29tbWFQb3M/OiA/bnVtYmVyLFxuICAgICAgaXNMSFM6IGJvb2xlYW4sXG4gICAgKTogJFJlYWRPbmx5QXJyYXk8Ti5QYXR0ZXJuPiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4cHJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGV4cHIgPSBleHByTGlzdFtpXTtcbiAgICAgICAgaWYgKGV4cHI/LnR5cGUgPT09IFwiVHlwZUNhc3RFeHByZXNzaW9uXCIpIHtcbiAgICAgICAgICBleHByTGlzdFtpXSA9IHRoaXMudHlwZUNhc3RUb1BhcmFtZXRlcihleHByKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLnRvQXNzaWduYWJsZUxpc3QoZXhwckxpc3QsIHRyYWlsaW5nQ29tbWFQb3MsIGlzTEhTKTtcbiAgICB9XG5cbiAgICAvLyB0aGlzIGlzIGEgbGlzdCBvZiBub2RlcywgZnJvbSBzb21ldGhpbmcgbGlrZSBhIGNhbGwgZXhwcmVzc2lvbiwgd2UgbmVlZCB0byBmaWx0ZXIgdGhlXG4gICAgLy8gdHlwZSBjYXN0cyB0aGF0IHdlJ3ZlIGZvdW5kIHRoYXQgYXJlIGlsbGVnYWwgaW4gdGhpcyBjb250ZXh0XG4gICAgdG9SZWZlcmVuY2VkTGlzdChcbiAgICAgIGV4cHJMaXN0OiAkUmVhZE9ubHlBcnJheTw/Ti5FeHByZXNzaW9uPixcbiAgICAgIGlzUGFyZW50aGVzaXplZEV4cHI/OiBib29sZWFuLFxuICAgICk6ICRSZWFkT25seUFycmF5PD9OLkV4cHJlc3Npb24+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZXhwciA9IGV4cHJMaXN0W2ldO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgZXhwciAmJlxuICAgICAgICAgIGV4cHIudHlwZSA9PT0gXCJUeXBlQ2FzdEV4cHJlc3Npb25cIiAmJlxuICAgICAgICAgICFleHByLmV4dHJhPy5wYXJlbnRoZXNpemVkICYmXG4gICAgICAgICAgKGV4cHJMaXN0Lmxlbmd0aCA+IDEgfHwgIWlzUGFyZW50aGVzaXplZEV4cHIpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucmFpc2UoZXhwci50eXBlQW5ub3RhdGlvbi5zdGFydCwgRmxvd0Vycm9ycy5UeXBlQ2FzdEluUGF0dGVybik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV4cHJMaXN0O1xuICAgIH1cblxuICAgIHBhcnNlQXJyYXlMaWtlKFxuICAgICAgY2xvc2U6IFRva2VuVHlwZSxcbiAgICAgIGNhbkJlUGF0dGVybjogYm9vbGVhbixcbiAgICAgIGlzVHVwbGU6IGJvb2xlYW4sXG4gICAgICByZWZFeHByZXNzaW9uRXJyb3JzOiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgICApOiBOLkFycmF5RXhwcmVzc2lvbiB8IE4uVHVwbGVFeHByZXNzaW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBzdXBlci5wYXJzZUFycmF5TGlrZShcbiAgICAgICAgY2xvc2UsXG4gICAgICAgIGNhbkJlUGF0dGVybixcbiAgICAgICAgaXNUdXBsZSxcbiAgICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycyxcbiAgICAgICk7XG5cbiAgICAgIC8vIFRoaXMgY291bGQgYmUgYW4gYXJyYXkgcGF0dGVybjpcbiAgICAgIC8vICAgKFthOiBzdHJpbmcsIGI6IHN0cmluZ10pID0+IHt9XG4gICAgICAvLyBJbiB0aGlzIGNhc2UsIHdlIGRvbid0IGhhdmUgdG8gY2FsbCB0b1JlZmVyZW5jZWRMaXN0LiBXZSB3aWxsXG4gICAgICAvLyBjYWxsIGl0LCBpZiBuZWVkZWQsIHdoZW4gd2UgYXJlIHN1cmUgdGhhdCBpdCBpcyBhIHBhcmVudGhlc2l6ZWRcbiAgICAgIC8vIGV4cHJlc3Npb24gYnkgY2FsbGluZyB0b1JlZmVyZW5jZWRMaXN0RGVlcC5cbiAgICAgIGlmIChjYW5CZVBhdHRlcm4gJiYgIXRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycykge1xuICAgICAgICB0aGlzLnRvUmVmZXJlbmNlZExpc3Qobm9kZS5lbGVtZW50cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIGNoZWNrTFZhbChcbiAgICAgIGV4cHI6IE4uRXhwcmVzc2lvbixcbiAgICAgIC4uLmFyZ3M6XG4gICAgICAgIHwgW3N0cmluZywgQmluZGluZ1R5cGVzIHwgdm9pZF1cbiAgICAgICAgfCBbXG4gICAgICAgICAgICBzdHJpbmcsXG4gICAgICAgICAgICBCaW5kaW5nVHlwZXMgfCB2b2lkLFxuICAgICAgICAgICAgP1NldDxzdHJpbmc+LFxuICAgICAgICAgICAgYm9vbGVhbiB8IHZvaWQsXG4gICAgICAgICAgICBib29sZWFuIHwgdm9pZCxcbiAgICAgICAgICBdXG4gICAgKTogdm9pZCB7XG4gICAgICBpZiAoZXhwci50eXBlICE9PSBcIlR5cGVDYXN0RXhwcmVzc2lvblwiKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5jaGVja0xWYWwoZXhwciwgLi4uYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcGFyc2UgY2xhc3MgcHJvcGVydHkgdHlwZSBhbm5vdGF0aW9uc1xuICAgIHBhcnNlQ2xhc3NQcm9wZXJ0eShub2RlOiBOLkNsYXNzUHJvcGVydHkpOiBOLkNsYXNzUHJvcGVydHkge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuY29sb24pKSB7XG4gICAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLmZsb3dQYXJzZVR5cGVBbm5vdGF0aW9uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VDbGFzc1Byb3BlcnR5KG5vZGUpO1xuICAgIH1cblxuICAgIHBhcnNlQ2xhc3NQcml2YXRlUHJvcGVydHkoXG4gICAgICBub2RlOiBOLkNsYXNzUHJpdmF0ZVByb3BlcnR5LFxuICAgICk6IE4uQ2xhc3NQcml2YXRlUHJvcGVydHkge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuY29sb24pKSB7XG4gICAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLmZsb3dQYXJzZVR5cGVBbm5vdGF0aW9uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VDbGFzc1ByaXZhdGVQcm9wZXJ0eShub2RlKTtcbiAgICB9XG5cbiAgICAvLyBkZXRlcm1pbmUgd2hldGhlciBvciBub3Qgd2UncmUgY3VycmVudGx5IGluIHRoZSBwb3NpdGlvbiB3aGVyZSBhIGNsYXNzIG1ldGhvZCB3b3VsZCBhcHBlYXJcbiAgICBpc0NsYXNzTWV0aG9kKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSB8fCBzdXBlci5pc0NsYXNzTWV0aG9kKCk7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHdlJ3JlIGN1cnJlbnRseSBpbiB0aGUgcG9zaXRpb24gd2hlcmUgYSBjbGFzcyBwcm9wZXJ0eSB3b3VsZCBhcHBlYXJcbiAgICBpc0NsYXNzUHJvcGVydHkoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5tYXRjaCh0dC5jb2xvbikgfHwgc3VwZXIuaXNDbGFzc1Byb3BlcnR5KCk7XG4gICAgfVxuXG4gICAgaXNOb25zdGF0aWNDb25zdHJ1Y3RvcihtZXRob2Q6IE4uQ2xhc3NNZXRob2QgfCBOLkNsYXNzUHJvcGVydHkpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhdGhpcy5tYXRjaCh0dC5jb2xvbikgJiYgc3VwZXIuaXNOb25zdGF0aWNDb25zdHJ1Y3RvcihtZXRob2QpO1xuICAgIH1cblxuICAgIC8vIHBhcnNlIHR5cGUgcGFyYW1ldGVycyBmb3IgY2xhc3MgbWV0aG9kc1xuICAgIHB1c2hDbGFzc01ldGhvZChcbiAgICAgIGNsYXNzQm9keTogTi5DbGFzc0JvZHksXG4gICAgICBtZXRob2Q6IE4uQ2xhc3NNZXRob2QsXG4gICAgICBpc0dlbmVyYXRvcjogYm9vbGVhbixcbiAgICAgIGlzQXN5bmM6IGJvb2xlYW4sXG4gICAgICBpc0NvbnN0cnVjdG9yOiBib29sZWFuLFxuICAgICAgYWxsb3dzRGlyZWN0U3VwZXI6IGJvb2xlYW4sXG4gICAgKTogdm9pZCB7XG4gICAgICBpZiAoKG1ldGhvZDogJEZsb3dGaXhNZSkudmFyaWFuY2UpIHtcbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKChtZXRob2Q6ICRGbG93Rml4TWUpLnZhcmlhbmNlLnN0YXJ0KTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSAobWV0aG9kOiAkRmxvd0ZpeE1lKS52YXJpYW5jZTtcbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgbWV0aG9kLnR5cGVQYXJhbWV0ZXJzID0gdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24oKTtcbiAgICAgIH1cblxuICAgICAgc3VwZXIucHVzaENsYXNzTWV0aG9kKFxuICAgICAgICBjbGFzc0JvZHksXG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgaXNHZW5lcmF0b3IsXG4gICAgICAgIGlzQXN5bmMsXG4gICAgICAgIGlzQ29uc3RydWN0b3IsXG4gICAgICAgIGFsbG93c0RpcmVjdFN1cGVyLFxuICAgICAgKTtcblxuICAgICAgaWYgKG1ldGhvZC5wYXJhbXMgJiYgaXNDb25zdHJ1Y3Rvcikge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBtZXRob2QucGFyYW1zO1xuICAgICAgICBpZiAocGFyYW1zLmxlbmd0aCA+IDAgJiYgdGhpcy5pc1RoaXNQYXJhbShwYXJhbXNbMF0pKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShtZXRob2Quc3RhcnQsIEZsb3dFcnJvcnMuVGhpc1BhcmFtQmFubmVkSW5Db25zdHJ1Y3Rvcik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXN0cmVlIHN1cHBvcnRcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIC8vICRGbG93Rml4TWUgZmxvdyBkb2VzIG5vdCBrbm93IGFib3V0IHRoZSBmYWNlIHRoYXQgZXN0cmVlIGNhbiByZXBsYWNlIENsYXNzTWV0aG9kIHdpdGggTWV0aG9kRGVmaW5pdGlvblxuICAgICAgICBtZXRob2QudHlwZSA9PT0gXCJNZXRob2REZWZpbml0aW9uXCIgJiZcbiAgICAgICAgaXNDb25zdHJ1Y3RvciAmJlxuICAgICAgICBtZXRob2QudmFsdWUucGFyYW1zXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbWV0aG9kLnZhbHVlLnBhcmFtcztcbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPiAwICYmIHRoaXMuaXNUaGlzUGFyYW0ocGFyYW1zWzBdKSkge1xuICAgICAgICAgIHRoaXMucmFpc2UobWV0aG9kLnN0YXJ0LCBGbG93RXJyb3JzLlRoaXNQYXJhbUJhbm5lZEluQ29uc3RydWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHVzaENsYXNzUHJpdmF0ZU1ldGhvZChcbiAgICAgIGNsYXNzQm9keTogTi5DbGFzc0JvZHksXG4gICAgICBtZXRob2Q6IE4uQ2xhc3NQcml2YXRlTWV0aG9kLFxuICAgICAgaXNHZW5lcmF0b3I6IGJvb2xlYW4sXG4gICAgICBpc0FzeW5jOiBib29sZWFuLFxuICAgICk6IHZvaWQge1xuICAgICAgaWYgKChtZXRob2Q6ICRGbG93Rml4TWUpLnZhcmlhbmNlKSB7XG4gICAgICAgIHRoaXMudW5leHBlY3RlZCgobWV0aG9kOiAkRmxvd0ZpeE1lKS52YXJpYW5jZS5zdGFydCk7XG4gICAgICB9XG4gICAgICBkZWxldGUgKG1ldGhvZDogJEZsb3dGaXhNZSkudmFyaWFuY2U7XG4gICAgICBpZiAodGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIG1ldGhvZC50eXBlUGFyYW1ldGVycyA9IHRoaXMuZmxvd1BhcnNlVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHN1cGVyLnB1c2hDbGFzc1ByaXZhdGVNZXRob2QoY2xhc3NCb2R5LCBtZXRob2QsIGlzR2VuZXJhdG9yLCBpc0FzeW5jKTtcbiAgICB9XG5cbiAgICAvLyBwYXJzZSBhIHRoZSBzdXBlciBjbGFzcyB0eXBlIHBhcmFtZXRlcnMgYW5kIGltcGxlbWVudHNcbiAgICBwYXJzZUNsYXNzU3VwZXIobm9kZTogTi5DbGFzcyk6IHZvaWQge1xuICAgICAgc3VwZXIucGFyc2VDbGFzc1N1cGVyKG5vZGUpO1xuICAgICAgaWYgKG5vZGUuc3VwZXJDbGFzcyAmJiB0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgbm9kZS5zdXBlclR5cGVQYXJhbWV0ZXJzID0gdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVySW5zdGFudGlhdGlvbigpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwiaW1wbGVtZW50c1wiKSkge1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgY29uc3QgaW1wbGVtZW50ZWQ6IE4uRmxvd0NsYXNzSW1wbGVtZW50c1tdID0gKG5vZGUuaW1wbGVtZW50cyA9IFtdKTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICAgIG5vZGUuaWQgPSB0aGlzLmZsb3dQYXJzZVJlc3RyaWN0ZWRJZGVudGlmaWVyKC8qbGliZXJhbCovIHRydWUpO1xuICAgICAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJJbnN0YW50aWF0aW9uKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbXBsZW1lbnRlZC5wdXNoKHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkNsYXNzSW1wbGVtZW50c1wiKSk7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMuZWF0KHR0LmNvbW1hKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tHZXR0ZXJTZXR0ZXJQYXJhbXMobWV0aG9kOiBOLk9iamVjdE1ldGhvZCB8IE4uQ2xhc3NNZXRob2QpOiB2b2lkIHtcbiAgICAgIHN1cGVyLmNoZWNrR2V0dGVyU2V0dGVyUGFyYW1zKG1ldGhvZCk7XG4gICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmdldE9iamVjdE9yQ2xhc3NNZXRob2RQYXJhbXMobWV0aG9kKTtcbiAgICAgIGlmIChwYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwYXJhbSA9IHBhcmFtc1swXTtcbiAgICAgICAgaWYgKHRoaXMuaXNUaGlzUGFyYW0ocGFyYW0pICYmIG1ldGhvZC5raW5kID09PSBcImdldFwiKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShwYXJhbS5zdGFydCwgRmxvd0Vycm9ycy5HZXR0ZXJNYXlOb3RIYXZlVGhpc1BhcmFtKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzVGhpc1BhcmFtKHBhcmFtKSkge1xuICAgICAgICAgIHRoaXMucmFpc2UocGFyYW0uc3RhcnQsIEZsb3dFcnJvcnMuU2V0dGVyTWF5Tm90SGF2ZVRoaXNQYXJhbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZVByb3BlcnR5TmFtZShcbiAgICAgIG5vZGU6IE4uT2JqZWN0T3JDbGFzc01lbWJlciB8IE4uQ2xhc3NNZW1iZXIgfCBOLlRzTmFtZWRUeXBlRWxlbWVudEJhc2UsXG4gICAgICBpc1ByaXZhdGVOYW1lQWxsb3dlZDogYm9vbGVhbixcbiAgICApOiBOLklkZW50aWZpZXIge1xuICAgICAgY29uc3QgdmFyaWFuY2UgPSB0aGlzLmZsb3dQYXJzZVZhcmlhbmNlKCk7XG4gICAgICBjb25zdCBrZXkgPSBzdXBlci5wYXJzZVByb3BlcnR5TmFtZShub2RlLCBpc1ByaXZhdGVOYW1lQWxsb3dlZCk7XG4gICAgICAvLyAkRmxvd0lnbm9yZSAoXCJ2YXJpYW5jZVwiIG5vdCBkZWZpbmVkIG9uIFRzTmFtZWRUeXBlRWxlbWVudEJhc2UpXG4gICAgICBub2RlLnZhcmlhbmNlID0gdmFyaWFuY2U7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIC8vIHBhcnNlIHR5cGUgcGFyYW1ldGVycyBmb3Igb2JqZWN0IG1ldGhvZCBzaG9ydGhhbmRcbiAgICBwYXJzZU9ialByb3BWYWx1ZShcbiAgICAgIHByb3A6IE4uT2JqZWN0TWVtYmVyLFxuICAgICAgc3RhcnRQb3M6ID9udW1iZXIsXG4gICAgICBzdGFydExvYzogP1Bvc2l0aW9uLFxuICAgICAgaXNHZW5lcmF0b3I6IGJvb2xlYW4sXG4gICAgICBpc0FzeW5jOiBib29sZWFuLFxuICAgICAgaXNQYXR0ZXJuOiBib29sZWFuLFxuICAgICAgaXNBY2Nlc3NvcjogYm9vbGVhbixcbiAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnM6ID9FeHByZXNzaW9uRXJyb3JzLFxuICAgICk6IHZvaWQge1xuICAgICAgaWYgKChwcm9wOiAkRmxvd0ZpeE1lKS52YXJpYW5jZSkge1xuICAgICAgICB0aGlzLnVuZXhwZWN0ZWQoKHByb3A6ICRGbG93Rml4TWUpLnZhcmlhbmNlLnN0YXJ0KTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSAocHJvcDogJEZsb3dGaXhNZSkudmFyaWFuY2U7XG5cbiAgICAgIGxldCB0eXBlUGFyYW1ldGVycztcblxuICAgICAgLy8gbWV0aG9kIHNob3J0aGFuZFxuICAgICAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSAmJiAhaXNBY2Nlc3Nvcikge1xuICAgICAgICB0eXBlUGFyYW1ldGVycyA9IHRoaXMuZmxvd1BhcnNlVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uKCk7XG4gICAgICAgIGlmICghdGhpcy5tYXRjaCh0dC5wYXJlbkwpKSB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgIH1cblxuICAgICAgc3VwZXIucGFyc2VPYmpQcm9wVmFsdWUoXG4gICAgICAgIHByb3AsXG4gICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICBzdGFydExvYyxcbiAgICAgICAgaXNHZW5lcmF0b3IsXG4gICAgICAgIGlzQXN5bmMsXG4gICAgICAgIGlzUGF0dGVybixcbiAgICAgICAgaXNBY2Nlc3NvcixcbiAgICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycyxcbiAgICAgICk7XG5cbiAgICAgIC8vIGFkZCB0eXBlUGFyYW1ldGVycyBpZiB3ZSBmb3VuZCB0aGVtXG4gICAgICBpZiAodHlwZVBhcmFtZXRlcnMpIHtcbiAgICAgICAgKHByb3AudmFsdWUgfHwgcHJvcCkudHlwZVBhcmFtZXRlcnMgPSB0eXBlUGFyYW1ldGVycztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZUFzc2lnbmFibGVMaXN0SXRlbVR5cGVzKHBhcmFtOiBOLlBhdHRlcm4pOiBOLlBhdHRlcm4ge1xuICAgICAgaWYgKHRoaXMuZWF0KHR0LnF1ZXN0aW9uKSkge1xuICAgICAgICBpZiAocGFyYW0udHlwZSAhPT0gXCJJZGVudGlmaWVyXCIpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHBhcmFtLnN0YXJ0LCBGbG93RXJyb3JzLk9wdGlvbmFsQmluZGluZ1BhdHRlcm4pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzVGhpc1BhcmFtKHBhcmFtKSkge1xuICAgICAgICAgIHRoaXMucmFpc2UocGFyYW0uc3RhcnQsIEZsb3dFcnJvcnMuVGhpc1BhcmFtTWF5Tm90QmVPcHRpb25hbCk7XG4gICAgICAgIH1cblxuICAgICAgICAoKHBhcmFtOiBhbnkpOiBOLklkZW50aWZpZXIpLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmNvbG9uKSkge1xuICAgICAgICBwYXJhbS50eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmxvd1BhcnNlVHlwZUFubm90YXRpb24oKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1RoaXNQYXJhbShwYXJhbSkpIHtcbiAgICAgICAgdGhpcy5yYWlzZShwYXJhbS5zdGFydCwgRmxvd0Vycm9ycy5UaGlzUGFyYW1Bbm5vdGF0aW9uUmVxdWlyZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5lcSkgJiYgdGhpcy5pc1RoaXNQYXJhbShwYXJhbSkpIHtcbiAgICAgICAgdGhpcy5yYWlzZShwYXJhbS5zdGFydCwgRmxvd0Vycm9ycy5UaGlzUGFyYW1Ob0RlZmF1bHQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlc2V0RW5kTG9jYXRpb24ocGFyYW0pO1xuICAgICAgcmV0dXJuIHBhcmFtO1xuICAgIH1cblxuICAgIHBhcnNlTWF5YmVEZWZhdWx0KFxuICAgICAgc3RhcnRQb3M/OiA/bnVtYmVyLFxuICAgICAgc3RhcnRMb2M/OiA/UG9zaXRpb24sXG4gICAgICBsZWZ0PzogP04uUGF0dGVybixcbiAgICApOiBOLlBhdHRlcm4ge1xuICAgICAgY29uc3Qgbm9kZSA9IHN1cGVyLnBhcnNlTWF5YmVEZWZhdWx0KHN0YXJ0UG9zLCBzdGFydExvYywgbGVmdCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS50eXBlID09PSBcIkFzc2lnbm1lbnRQYXR0ZXJuXCIgJiZcbiAgICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiAmJlxuICAgICAgICBub2RlLnJpZ2h0LnN0YXJ0IDwgbm9kZS50eXBlQW5ub3RhdGlvbi5zdGFydFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmFpc2Uobm9kZS50eXBlQW5ub3RhdGlvbi5zdGFydCwgRmxvd0Vycm9ycy5UeXBlQmVmb3JlSW5pdGlhbGl6ZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBzaG91bGRQYXJzZURlZmF1bHRJbXBvcnQobm9kZTogTi5JbXBvcnREZWNsYXJhdGlvbik6IGJvb2xlYW4ge1xuICAgICAgaWYgKCFoYXNUeXBlSW1wb3J0S2luZChub2RlKSkge1xuICAgICAgICByZXR1cm4gc3VwZXIuc2hvdWxkUGFyc2VEZWZhdWx0SW1wb3J0KG5vZGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNNYXliZURlZmF1bHRJbXBvcnQodGhpcy5zdGF0ZSk7XG4gICAgfVxuXG4gICAgcGFyc2VJbXBvcnRTcGVjaWZpZXJMb2NhbChcbiAgICAgIG5vZGU6IE4uSW1wb3J0RGVjbGFyYXRpb24sXG4gICAgICBzcGVjaWZpZXI6IE4uTm9kZSxcbiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICAgIGNvbnRleHREZXNjcmlwdGlvbjogc3RyaW5nLFxuICAgICk6IHZvaWQge1xuICAgICAgc3BlY2lmaWVyLmxvY2FsID0gaGFzVHlwZUltcG9ydEtpbmQobm9kZSlcbiAgICAgICAgPyB0aGlzLmZsb3dQYXJzZVJlc3RyaWN0ZWRJZGVudGlmaWVyKFxuICAgICAgICAgICAgLyogbGliZXJhbCAqLyB0cnVlLFxuICAgICAgICAgICAgLyogZGVjbGFyYXRpb24gKi8gdHJ1ZSxcbiAgICAgICAgICApXG4gICAgICAgIDogdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcblxuICAgICAgdGhpcy5jaGVja0xWYWwoc3BlY2lmaWVyLmxvY2FsLCBjb250ZXh0RGVzY3JpcHRpb24sIEJJTkRfTEVYSUNBTCk7XG4gICAgICBub2RlLnNwZWNpZmllcnMucHVzaCh0aGlzLmZpbmlzaE5vZGUoc3BlY2lmaWVyLCB0eXBlKSk7XG4gICAgfVxuXG4gICAgLy8gcGFyc2UgdHlwZW9mIGFuZCB0eXBlIGltcG9ydHNcbiAgICBtYXliZVBhcnNlRGVmYXVsdEltcG9ydFNwZWNpZmllcihub2RlOiBOLkltcG9ydERlY2xhcmF0aW9uKTogYm9vbGVhbiB7XG4gICAgICBub2RlLmltcG9ydEtpbmQgPSBcInZhbHVlXCI7XG5cbiAgICAgIGxldCBraW5kID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0Ll90eXBlb2YpKSB7XG4gICAgICAgIGtpbmQgPSBcInR5cGVvZlwiO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQ29udGV4dHVhbChcInR5cGVcIikpIHtcbiAgICAgICAga2luZCA9IFwidHlwZVwiO1xuICAgICAgfVxuICAgICAgaWYgKGtpbmQpIHtcbiAgICAgICAgY29uc3QgbGggPSB0aGlzLmxvb2thaGVhZCgpO1xuXG4gICAgICAgIC8vIGltcG9ydCB0eXBlICogaXMgbm90IGFsbG93ZWRcbiAgICAgICAgaWYgKGtpbmQgPT09IFwidHlwZVwiICYmIGxoLnR5cGUgPT09IHR0LnN0YXIpIHtcbiAgICAgICAgICB0aGlzLnVuZXhwZWN0ZWQobGguc3RhcnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzTWF5YmVEZWZhdWx0SW1wb3J0KGxoKSB8fFxuICAgICAgICAgIGxoLnR5cGUgPT09IHR0LmJyYWNlTCB8fFxuICAgICAgICAgIGxoLnR5cGUgPT09IHR0LnN0YXJcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgbm9kZS5pbXBvcnRLaW5kID0ga2luZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIubWF5YmVQYXJzZURlZmF1bHRJbXBvcnRTcGVjaWZpZXIobm9kZSk7XG4gICAgfVxuXG4gICAgLy8gcGFyc2UgaW1wb3J0LXR5cGUvdHlwZW9mIHNob3J0aGFuZFxuICAgIHBhcnNlSW1wb3J0U3BlY2lmaWVyKG5vZGU6IE4uSW1wb3J0RGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgIGNvbnN0IHNwZWNpZmllciA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBjb25zdCBmaXJzdElkZW50SXNTdHJpbmcgPSB0aGlzLm1hdGNoKHR0LnN0cmluZyk7XG4gICAgICBjb25zdCBmaXJzdElkZW50ID0gdGhpcy5wYXJzZU1vZHVsZUV4cG9ydE5hbWUoKTtcblxuICAgICAgbGV0IHNwZWNpZmllclR5cGVLaW5kID0gbnVsbDtcbiAgICAgIGlmIChmaXJzdElkZW50LnR5cGUgPT09IFwiSWRlbnRpZmllclwiKSB7XG4gICAgICAgIGlmIChmaXJzdElkZW50Lm5hbWUgPT09IFwidHlwZVwiKSB7XG4gICAgICAgICAgc3BlY2lmaWVyVHlwZUtpbmQgPSBcInR5cGVcIjtcbiAgICAgICAgfSBlbHNlIGlmIChmaXJzdElkZW50Lm5hbWUgPT09IFwidHlwZW9mXCIpIHtcbiAgICAgICAgICBzcGVjaWZpZXJUeXBlS2luZCA9IFwidHlwZW9mXCI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGlzQmluZGluZyA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwiYXNcIikgJiYgIXRoaXMuaXNMb29rYWhlYWRDb250ZXh0dWFsKFwiYXNcIikpIHtcbiAgICAgICAgY29uc3QgYXNfaWRlbnQgPSB0aGlzLnBhcnNlSWRlbnRpZmllcih0cnVlKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHNwZWNpZmllclR5cGVLaW5kICE9PSBudWxsICYmXG4gICAgICAgICAgIXRoaXMubWF0Y2godHQubmFtZSkgJiZcbiAgICAgICAgICAhdGhpcy5zdGF0ZS50eXBlLmtleXdvcmRcbiAgICAgICAgKSB7XG4gICAgICAgICAgLy8gYGltcG9ydCB7dHlwZSBhcyAsYCBvciBgaW1wb3J0IHt0eXBlIGFzIH1gXG4gICAgICAgICAgc3BlY2lmaWVyLmltcG9ydGVkID0gYXNfaWRlbnQ7XG4gICAgICAgICAgc3BlY2lmaWVyLmltcG9ydEtpbmQgPSBzcGVjaWZpZXJUeXBlS2luZDtcbiAgICAgICAgICBzcGVjaWZpZXIubG9jYWwgPSBhc19pZGVudC5fX2Nsb25lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYGltcG9ydCB7dHlwZSBhcyBmb29gXG4gICAgICAgICAgc3BlY2lmaWVyLmltcG9ydGVkID0gZmlyc3RJZGVudDtcbiAgICAgICAgICBzcGVjaWZpZXIuaW1wb3J0S2luZCA9IG51bGw7XG4gICAgICAgICAgc3BlY2lmaWVyLmxvY2FsID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgc3BlY2lmaWVyVHlwZUtpbmQgIT09IG51bGwgJiZcbiAgICAgICAgKHRoaXMubWF0Y2godHQubmFtZSkgfHwgdGhpcy5zdGF0ZS50eXBlLmtleXdvcmQpXG4gICAgICApIHtcbiAgICAgICAgLy8gYGltcG9ydCB7dHlwZSBmb29gXG4gICAgICAgIHNwZWNpZmllci5pbXBvcnRlZCA9IHRoaXMucGFyc2VJZGVudGlmaWVyKHRydWUpO1xuICAgICAgICBzcGVjaWZpZXIuaW1wb3J0S2luZCA9IHNwZWNpZmllclR5cGVLaW5kO1xuICAgICAgICBpZiAodGhpcy5lYXRDb250ZXh0dWFsKFwiYXNcIikpIHtcbiAgICAgICAgICBzcGVjaWZpZXIubG9jYWwgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlzQmluZGluZyA9IHRydWU7XG4gICAgICAgICAgc3BlY2lmaWVyLmxvY2FsID0gc3BlY2lmaWVyLmltcG9ydGVkLl9fY2xvbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZpcnN0SWRlbnRJc1N0cmluZykge1xuICAgICAgICAgIC8qOjogaW52YXJpYW50KGZpcnN0SWRlbnQgaW5zdGFuY2VvZiBOLlN0cmluZ0xpdGVyYWwpICovXG4gICAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShcbiAgICAgICAgICAgIHNwZWNpZmllci5zdGFydCxcbiAgICAgICAgICAgIEVycm9ycy5JbXBvcnRCaW5kaW5nSXNTdHJpbmcsXG4gICAgICAgICAgICBmaXJzdElkZW50LnZhbHVlLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLyo6OiBpbnZhcmlhbnQoZmlyc3RJZGVudCBpbnN0YW5jZW9mIE4uTm9kZSkgKi9cbiAgICAgICAgaXNCaW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgc3BlY2lmaWVyLmltcG9ydGVkID0gZmlyc3RJZGVudDtcbiAgICAgICAgc3BlY2lmaWVyLmltcG9ydEtpbmQgPSBudWxsO1xuICAgICAgICBzcGVjaWZpZXIubG9jYWwgPSBzcGVjaWZpZXIuaW1wb3J0ZWQuX19jbG9uZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub2RlSXNUeXBlSW1wb3J0ID0gaGFzVHlwZUltcG9ydEtpbmQobm9kZSk7XG4gICAgICBjb25zdCBzcGVjaWZpZXJJc1R5cGVJbXBvcnQgPSBoYXNUeXBlSW1wb3J0S2luZChzcGVjaWZpZXIpO1xuXG4gICAgICBpZiAobm9kZUlzVHlwZUltcG9ydCAmJiBzcGVjaWZpZXJJc1R5cGVJbXBvcnQpIHtcbiAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICBzcGVjaWZpZXIuc3RhcnQsXG4gICAgICAgICAgRmxvd0Vycm9ycy5JbXBvcnRUeXBlU2hvcnRoYW5kT25seUluUHVyZUltcG9ydCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGVJc1R5cGVJbXBvcnQgfHwgc3BlY2lmaWVySXNUeXBlSW1wb3J0KSB7XG4gICAgICAgIHRoaXMuY2hlY2tSZXNlcnZlZFR5cGUoXG4gICAgICAgICAgc3BlY2lmaWVyLmxvY2FsLm5hbWUsXG4gICAgICAgICAgc3BlY2lmaWVyLmxvY2FsLnN0YXJ0LFxuICAgICAgICAgIC8qIGRlY2xhcmF0aW9uICovIHRydWUsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0JpbmRpbmcgJiYgIW5vZGVJc1R5cGVJbXBvcnQgJiYgIXNwZWNpZmllcklzVHlwZUltcG9ydCkge1xuICAgICAgICB0aGlzLmNoZWNrUmVzZXJ2ZWRXb3JkKFxuICAgICAgICAgIHNwZWNpZmllci5sb2NhbC5uYW1lLFxuICAgICAgICAgIHNwZWNpZmllci5zdGFydCxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2hlY2tMVmFsKHNwZWNpZmllci5sb2NhbCwgXCJpbXBvcnQgc3BlY2lmaWVyXCIsIEJJTkRfTEVYSUNBTCk7XG4gICAgICBub2RlLnNwZWNpZmllcnMucHVzaCh0aGlzLmZpbmlzaE5vZGUoc3BlY2lmaWVyLCBcIkltcG9ydFNwZWNpZmllclwiKSk7XG4gICAgfVxuXG4gICAgcGFyc2VCaW5kaW5nQXRvbSgpOiBOLlBhdHRlcm4ge1xuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnR5cGUpIHtcbiAgICAgICAgY2FzZSB0dC5fdGhpczpcbiAgICAgICAgICAvLyBcInRoaXNcIiBtYXkgYmUgdGhlIG5hbWUgb2YgYSBwYXJhbWV0ZXIsIHNvIGFsbG93IGl0LlxuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSWRlbnRpZmllcigvKiBsaWJlcmFsICovIHRydWUpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBzdXBlci5wYXJzZUJpbmRpbmdBdG9tKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcGFyc2UgZnVuY3Rpb24gdHlwZSBwYXJhbWV0ZXJzIC0gZnVuY3Rpb24gZm9vPFQ+KCkge31cbiAgICBwYXJzZUZ1bmN0aW9uUGFyYW1zKG5vZGU6IE4uRnVuY3Rpb24sIGFsbG93TW9kaWZpZXJzPzogYm9vbGVhbik6IHZvaWQge1xuICAgICAgLy8gJEZsb3dGaXhNZVxuICAgICAgY29uc3Qga2luZCA9IG5vZGUua2luZDtcbiAgICAgIGlmIChraW5kICE9PSBcImdldFwiICYmIGtpbmQgIT09IFwic2V0XCIgJiYgdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbigpO1xuICAgICAgfVxuICAgICAgc3VwZXIucGFyc2VGdW5jdGlvblBhcmFtcyhub2RlLCBhbGxvd01vZGlmaWVycyk7XG4gICAgfVxuXG4gICAgLy8gcGFyc2UgZmxvdyB0eXBlIGFubm90YXRpb25zIG9uIHZhcmlhYmxlIGRlY2xhcmF0b3IgaGVhZHMgLSBsZXQgZm9vOiBzdHJpbmcgPSBiYXJcbiAgICBwYXJzZVZhcklkKFxuICAgICAgZGVjbDogTi5WYXJpYWJsZURlY2xhcmF0b3IsXG4gICAgICBraW5kOiBcInZhclwiIHwgXCJsZXRcIiB8IFwiY29uc3RcIixcbiAgICApOiB2b2lkIHtcbiAgICAgIHN1cGVyLnBhcnNlVmFySWQoZGVjbCwga2luZCk7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5jb2xvbikpIHtcbiAgICAgICAgZGVjbC5pZC50eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmxvd1BhcnNlVHlwZUFubm90YXRpb24oKTtcbiAgICAgICAgdGhpcy5yZXNldEVuZExvY2F0aW9uKGRlY2wuaWQpOyAvLyBzZXQgZW5kIHBvc2l0aW9uIHRvIGVuZCBvZiB0eXBlXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcGFyc2UgdGhlIHJldHVybiB0eXBlIG9mIGFuIGFzeW5jIGFycm93IGZ1bmN0aW9uIC0gbGV0IGZvbyA9IChhc3luYyAoKTogbnVtYmVyID0+IHt9KTtcbiAgICBwYXJzZUFzeW5jQXJyb3dGcm9tQ2FsbEV4cHJlc3Npb24oXG4gICAgICBub2RlOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uLFxuICAgICAgY2FsbDogTi5DYWxsRXhwcmVzc2lvbixcbiAgICApOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmNvbG9uKSkge1xuICAgICAgICBjb25zdCBvbGROb0Fub25GdW5jdGlvblR5cGUgPSB0aGlzLnN0YXRlLm5vQW5vbkZ1bmN0aW9uVHlwZTtcbiAgICAgICAgdGhpcy5zdGF0ZS5ub0Fub25GdW5jdGlvblR5cGUgPSB0cnVlO1xuICAgICAgICBub2RlLnJldHVyblR5cGUgPSB0aGlzLmZsb3dQYXJzZVR5cGVBbm5vdGF0aW9uKCk7XG4gICAgICAgIHRoaXMuc3RhdGUubm9Bbm9uRnVuY3Rpb25UeXBlID0gb2xkTm9Bbm9uRnVuY3Rpb25UeXBlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VBc3luY0Fycm93RnJvbUNhbGxFeHByZXNzaW9uKG5vZGUsIGNhbGwpO1xuICAgIH1cblxuICAgIC8vIHRvZG8gZGVzY3JpcHRpb25cbiAgICBzaG91bGRQYXJzZUFzeW5jQXJyb3coKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5tYXRjaCh0dC5jb2xvbikgfHwgc3VwZXIuc2hvdWxkUGFyc2VBc3luY0Fycm93KCk7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byBzdXBwb3J0IHR5cGUgcGFyYW1ldGVyIGRlY2xhcmF0aW9ucyBmb3IgYXJyb3cgZnVuY3Rpb25zLiBUaGlzXG4gICAgLy8gaXMgdHJpY2t5LiBUaGVyZSBhcmUgdGhyZWUgc2l0dWF0aW9ucyB3ZSBuZWVkIHRvIGhhbmRsZVxuICAgIC8vXG4gICAgLy8gMS4gVGhpcyBpcyBlaXRoZXIgSlNYIG9yIGFuIGFycm93IGZ1bmN0aW9uLiBXZSdsbCB0cnkgSlNYIGZpcnN0LiBJZiB0aGF0XG4gICAgLy8gICAgZmFpbHMsIHdlJ2xsIHRyeSBhbiBhcnJvdyBmdW5jdGlvbi4gSWYgdGhhdCBmYWlscywgd2UnbGwgdGhyb3cgdGhlIEpTWFxuICAgIC8vICAgIGVycm9yLlxuICAgIC8vIDIuIFRoaXMgaXMgYW4gYXJyb3cgZnVuY3Rpb24uIFdlJ2xsIHBhcnNlIHRoZSB0eXBlIHBhcmFtZXRlciBkZWNsYXJhdGlvbixcbiAgICAvLyAgICBwYXJzZSB0aGUgcmVzdCwgbWFrZSBzdXJlIHRoZSByZXN0IGlzIGFuIGFycm93IGZ1bmN0aW9uLCBhbmQgZ28gZnJvbVxuICAgIC8vICAgIHRoZXJlXG4gICAgLy8gMy4gVGhpcyBpcyBuZWl0aGVyLiBKdXN0IGNhbGwgdGhlIHN1cGVyIG1ldGhvZFxuICAgIHBhcnNlTWF5YmVBc3NpZ24oXG4gICAgICByZWZFeHByZXNzaW9uRXJyb3JzPzogP0V4cHJlc3Npb25FcnJvcnMsXG4gICAgICBhZnRlckxlZnRQYXJzZT86IEZ1bmN0aW9uLFxuICAgICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgICBsZXQgc3RhdGUgPSBudWxsO1xuXG4gICAgICBsZXQganN4O1xuXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuaGFzUGx1Z2luKFwianN4XCIpICYmXG4gICAgICAgICh0aGlzLm1hdGNoKHR0LmpzeFRhZ1N0YXJ0KSB8fCB0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpXG4gICAgICApIHtcbiAgICAgICAgc3RhdGUgPSB0aGlzLnN0YXRlLmNsb25lKCk7XG5cbiAgICAgICAganN4ID0gdGhpcy50cnlQYXJzZShcbiAgICAgICAgICAoKSA9PiBzdXBlci5wYXJzZU1heWJlQXNzaWduKHJlZkV4cHJlc3Npb25FcnJvcnMsIGFmdGVyTGVmdFBhcnNlKSxcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgKTtcblxuICAgICAgICAvKjo6IGludmFyaWFudCghanN4LmFib3J0ZWQpICovXG4gICAgICAgIC8qOjogaW52YXJpYW50KGpzeC5ub2RlICE9IG51bGwpICovXG4gICAgICAgIGlmICghanN4LmVycm9yKSByZXR1cm4ganN4Lm5vZGU7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGB0Yy5qX2V4cHJgIGFuZCBgdGMual9vVGFnYCBmcm9tIGNvbnRleHQgYWRkZWRcbiAgICAgICAgLy8gYnkgcGFyc2luZyBganN4VGFnU3RhcnRgIHRvIHN0b3AgdGhlIEpTWCBwbHVnaW4gZnJvbVxuICAgICAgICAvLyBtZXNzaW5nIHdpdGggdGhlIHRva2Vuc1xuICAgICAgICBjb25zdCB7IGNvbnRleHQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGNvbnN0IGN1ckNvbnRleHQgPSBjb250ZXh0W2NvbnRleHQubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChjdXJDb250ZXh0ID09PSB0Yy5qX29UYWcpIHtcbiAgICAgICAgICBjb250ZXh0Lmxlbmd0aCAtPSAyO1xuICAgICAgICB9IGVsc2UgaWYgKGN1ckNvbnRleHQgPT09IHRjLmpfZXhwcikge1xuICAgICAgICAgIGNvbnRleHQubGVuZ3RoIC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGpzeD8uZXJyb3IgfHwgdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIHN0YXRlID0gc3RhdGUgfHwgdGhpcy5zdGF0ZS5jbG9uZSgpO1xuXG4gICAgICAgIGxldCB0eXBlUGFyYW1ldGVycztcblxuICAgICAgICBjb25zdCBhcnJvdyA9IHRoaXMudHJ5UGFyc2UoYWJvcnQgPT4ge1xuICAgICAgICAgIHR5cGVQYXJhbWV0ZXJzID0gdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb24oKTtcblxuICAgICAgICAgIGNvbnN0IGFycm93RXhwcmVzc2lvbiA9IHRoaXMuZm9yd2FyZE5vQXJyb3dQYXJhbXNDb252ZXJzaW9uQXQoXG4gICAgICAgICAgICB0eXBlUGFyYW1ldGVycyxcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucGFyc2VNYXliZUFzc2lnbihcbiAgICAgICAgICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgICAgICAgICAgIGFmdGVyTGVmdFBhcnNlLFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIHRoaXMucmVzZXRTdGFydExvY2F0aW9uRnJvbU5vZGUocmVzdWx0LCB0eXBlUGFyYW1ldGVycyk7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIDxUPigoKSA9PiB7fTogYW55KTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBhcnJvd0V4cHJlc3Npb24udHlwZSAhPT0gXCJBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvblwiICYmXG4gICAgICAgICAgICBhcnJvd0V4cHJlc3Npb24uZXh0cmE/LnBhcmVudGhlc2l6ZWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGFib3J0KCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVGhlIGFib3ZlIGNhbiByZXR1cm4gYSBUeXBlQ2FzdEV4cHJlc3Npb24gd2hlbiB0aGUgYXJyb3dcbiAgICAgICAgICAvLyBleHByZXNzaW9uIGlzIG5vdCB3cmFwcGVkIGluIHBhcmVucy4gU2VlIGFsc28gYHRoaXMucGFyc2VQYXJlbkl0ZW1gLlxuICAgICAgICAgIGNvbnN0IGV4cHIgPSB0aGlzLm1heWJlVW53cmFwVHlwZUNhc3RFeHByZXNzaW9uKGFycm93RXhwcmVzc2lvbik7XG4gICAgICAgICAgZXhwci50eXBlUGFyYW1ldGVycyA9IHR5cGVQYXJhbWV0ZXJzO1xuICAgICAgICAgIHRoaXMucmVzZXRTdGFydExvY2F0aW9uRnJvbU5vZGUoZXhwciwgdHlwZVBhcmFtZXRlcnMpO1xuXG4gICAgICAgICAgcmV0dXJuIGFycm93RXhwcmVzc2lvbjtcbiAgICAgICAgfSwgc3RhdGUpO1xuXG4gICAgICAgIGxldCBhcnJvd0V4cHJlc3Npb246ID8oXG4gICAgICAgICAgfCBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uXG4gICAgICAgICAgfCBOLlR5cGVDYXN0RXhwcmVzc2lvblxuICAgICAgICApID0gbnVsbDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJyb3cubm9kZSAmJlxuICAgICAgICAgIHRoaXMubWF5YmVVbndyYXBUeXBlQ2FzdEV4cHJlc3Npb24oYXJyb3cubm9kZSkudHlwZSA9PT1cbiAgICAgICAgICAgIFwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25cIlxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoIWFycm93LmVycm9yICYmICFhcnJvdy5hYm9ydGVkKSB7XG4gICAgICAgICAgICAvLyA8VD4gYXN5bmMgKCkgPT4ge31cbiAgICAgICAgICAgIGlmIChhcnJvdy5ub2RlLmFzeW5jKSB7XG4gICAgICAgICAgICAgIC8qOjogaW52YXJpYW50KHR5cGVQYXJhbWV0ZXJzKSAqL1xuICAgICAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgICAgIHR5cGVQYXJhbWV0ZXJzLnN0YXJ0LFxuICAgICAgICAgICAgICAgIEZsb3dFcnJvcnMuVW5leHBlY3RlZFR5cGVQYXJhbWV0ZXJCZWZvcmVBc3luY0Fycm93RnVuY3Rpb24sXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhcnJvdy5ub2RlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFycm93RXhwcmVzc2lvbiA9IGFycm93Lm5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB3ZSBhcmUgaGVyZSwgYm90aCBKU1ggYW5kIEZsb3cgcGFyc2luZyBhdHRlbXB0cyBmYWlsZWQuXG4gICAgICAgIC8vIEdpdmUgdGhlIHByZWNlZGVuY2UgdG8gdGhlIEpTWCBlcnJvciwgZXhjZXB0IGlmIEpTWCBoYWQgYW5cbiAgICAgICAgLy8gdW5yZWNvdmVyYWJsZSBlcnJvciB3aGlsZSBGbG93IGRpZG4ndC5cbiAgICAgICAgLy8gSWYgdGhlIGVycm9yIGlzIHJlY292ZXJhYmxlLCB3ZSBjYW4gb25seSByZS1yZXBvcnQgaXQgaWYgdGhlcmUgaXNcbiAgICAgICAgLy8gYSBub2RlIHdlIGNhbiByZXR1cm4uXG5cbiAgICAgICAgaWYgKGpzeD8ubm9kZSkge1xuICAgICAgICAgIC8qOjogaW52YXJpYW50KGpzeC5mYWlsU3RhdGUpICovXG4gICAgICAgICAgdGhpcy5zdGF0ZSA9IGpzeC5mYWlsU3RhdGU7XG4gICAgICAgICAgcmV0dXJuIGpzeC5ub2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFycm93RXhwcmVzc2lvbikge1xuICAgICAgICAgIC8qOjogaW52YXJpYW50KGFycm93LmZhaWxTdGF0ZSkgKi9cbiAgICAgICAgICB0aGlzLnN0YXRlID0gYXJyb3cuZmFpbFN0YXRlO1xuICAgICAgICAgIHJldHVybiBhcnJvd0V4cHJlc3Npb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoanN4Py50aHJvd24pIHRocm93IGpzeC5lcnJvcjtcbiAgICAgICAgaWYgKGFycm93LnRocm93bikgdGhyb3cgYXJyb3cuZXJyb3I7XG5cbiAgICAgICAgLyo6OiBpbnZhcmlhbnQodHlwZVBhcmFtZXRlcnMpICovXG4gICAgICAgIHRocm93IHRoaXMucmFpc2UoXG4gICAgICAgICAgdHlwZVBhcmFtZXRlcnMuc3RhcnQsXG4gICAgICAgICAgRmxvd0Vycm9ycy5VbmV4cGVjdGVkVG9rZW5BZnRlclR5cGVQYXJhbWV0ZXIsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5wYXJzZU1heWJlQXNzaWduKHJlZkV4cHJlc3Npb25FcnJvcnMsIGFmdGVyTGVmdFBhcnNlKTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgcmV0dXJuIHR5cGVzIGZvciBhcnJvdyBmdW5jdGlvbnNcbiAgICBwYXJzZUFycm93KG5vZGU6IE4uQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24pOiA/Ti5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5jb2xvbikpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy50cnlQYXJzZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2xkTm9Bbm9uRnVuY3Rpb25UeXBlID0gdGhpcy5zdGF0ZS5ub0Fub25GdW5jdGlvblR5cGU7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5ub0Fub25GdW5jdGlvblR5cGUgPSB0cnVlO1xuXG4gICAgICAgICAgY29uc3QgdHlwZU5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuXG4gICAgICAgICAgW1xuICAgICAgICAgICAgLy8gJEZsb3dGaXhNZSAoZGVzdHJ1Y3R1cmluZyBub3Qgc3VwcG9ydGVkIHlldClcbiAgICAgICAgICAgIHR5cGVOb2RlLnR5cGVBbm5vdGF0aW9uLFxuICAgICAgICAgICAgLy8gJEZsb3dGaXhNZSAoZGVzdHJ1Y3R1cmluZyBub3Qgc3VwcG9ydGVkIHlldClcbiAgICAgICAgICAgIG5vZGUucHJlZGljYXRlLFxuICAgICAgICAgIF0gPSB0aGlzLmZsb3dQYXJzZVR5cGVBbmRQcmVkaWNhdGVJbml0aWFsaXNlcigpO1xuXG4gICAgICAgICAgdGhpcy5zdGF0ZS5ub0Fub25GdW5jdGlvblR5cGUgPSBvbGROb0Fub25GdW5jdGlvblR5cGU7XG5cbiAgICAgICAgICBpZiAodGhpcy5jYW5JbnNlcnRTZW1pY29sb24oKSkgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICAgICAgaWYgKCF0aGlzLm1hdGNoKHR0LmFycm93KSkgdGhpcy51bmV4cGVjdGVkKCk7XG5cbiAgICAgICAgICByZXR1cm4gdHlwZU5vZGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQudGhyb3duKSByZXR1cm4gbnVsbDtcbiAgICAgICAgLyo6OiBpbnZhcmlhbnQocmVzdWx0Lm5vZGUpICovXG5cbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikgdGhpcy5zdGF0ZSA9IHJlc3VsdC5mYWlsU3RhdGU7XG5cbiAgICAgICAgLy8gYXNzaWduIGFmdGVyIGl0IGlzIGNsZWFyIGl0IGlzIGFuIGFycm93XG4gICAgICAgIG5vZGUucmV0dXJuVHlwZSA9IHJlc3VsdC5ub2RlLnR5cGVBbm5vdGF0aW9uXG4gICAgICAgICAgPyB0aGlzLmZpbmlzaE5vZGUocmVzdWx0Lm5vZGUsIFwiVHlwZUFubm90YXRpb25cIilcbiAgICAgICAgICA6IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5wYXJzZUFycm93KG5vZGUpO1xuICAgIH1cblxuICAgIHNob3VsZFBhcnNlQXJyb3coKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5tYXRjaCh0dC5jb2xvbikgfHwgc3VwZXIuc2hvdWxkUGFyc2VBcnJvdygpO1xuICAgIH1cblxuICAgIHNldEFycm93RnVuY3Rpb25QYXJhbWV0ZXJzKFxuICAgICAgbm9kZTogTi5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbixcbiAgICAgIHBhcmFtczogTi5FeHByZXNzaW9uW10sXG4gICAgKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5ub0Fycm93UGFyYW1zQ29udmVyc2lvbkF0LmluZGV4T2Yobm9kZS5zdGFydCkgIT09IC0xKSB7XG4gICAgICAgIG5vZGUucGFyYW1zID0gcGFyYW1zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3VwZXIuc2V0QXJyb3dGdW5jdGlvblBhcmFtZXRlcnMobm9kZSwgcGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja1BhcmFtcyhcbiAgICAgIG5vZGU6IE4uRnVuY3Rpb24sXG4gICAgICBhbGxvd0R1cGxpY2F0ZXM6IGJvb2xlYW4sXG4gICAgICBpc0Fycm93RnVuY3Rpb246ID9ib29sZWFuLFxuICAgICk6IHZvaWQge1xuICAgICAgaWYgKFxuICAgICAgICBpc0Fycm93RnVuY3Rpb24gJiZcbiAgICAgICAgdGhpcy5zdGF0ZS5ub0Fycm93UGFyYW1zQ29udmVyc2lvbkF0LmluZGV4T2Yobm9kZS5zdGFydCkgIT09IC0xXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBlbnN1cmUgdGhlIGB0aGlzYCBwYXJhbSBpcyBmaXJzdCwgaWYgaXQgZXhpc3RzXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUucGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVGhpc1BhcmFtKG5vZGUucGFyYW1zW2ldKSAmJiBpID4gMCkge1xuICAgICAgICAgIHRoaXMucmFpc2Uobm9kZS5wYXJhbXNbaV0uc3RhcnQsIEZsb3dFcnJvcnMuVGhpc1BhcmFtTXVzdEJlRmlyc3QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5jaGVja1BhcmFtcyguLi5hcmd1bWVudHMpO1xuICAgIH1cblxuICAgIHBhcnNlUGFyZW5BbmREaXN0aW5ndWlzaEV4cHJlc3Npb24oY2FuQmVBcnJvdzogYm9vbGVhbik6IE4uRXhwcmVzc2lvbiB7XG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VQYXJlbkFuZERpc3Rpbmd1aXNoRXhwcmVzc2lvbihcbiAgICAgICAgY2FuQmVBcnJvdyAmJiB0aGlzLnN0YXRlLm5vQXJyb3dBdC5pbmRleE9mKHRoaXMuc3RhdGUuc3RhcnQpID09PSAtMSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcGFyc2VTdWJzY3JpcHRzKFxuICAgICAgYmFzZTogTi5FeHByZXNzaW9uLFxuICAgICAgc3RhcnRQb3M6IG51bWJlcixcbiAgICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICAgIG5vQ2FsbHM/OiA/Ym9vbGVhbixcbiAgICApOiBOLkV4cHJlc3Npb24ge1xuICAgICAgaWYgKFxuICAgICAgICBiYXNlLnR5cGUgPT09IFwiSWRlbnRpZmllclwiICYmXG4gICAgICAgIGJhc2UubmFtZSA9PT0gXCJhc3luY1wiICYmXG4gICAgICAgIHRoaXMuc3RhdGUubm9BcnJvd0F0LmluZGV4T2Yoc3RhcnRQb3MpICE9PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICAgIG5vZGUuY2FsbGVlID0gYmFzZTtcbiAgICAgICAgbm9kZS5hcmd1bWVudHMgPSB0aGlzLnBhcnNlQ2FsbEV4cHJlc3Npb25Bcmd1bWVudHModHQucGFyZW5SLCBmYWxzZSk7XG4gICAgICAgIGJhc2UgPSB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJDYWxsRXhwcmVzc2lvblwiKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGJhc2UudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIgJiZcbiAgICAgICAgYmFzZS5uYW1lID09PSBcImFzeW5jXCIgJiZcbiAgICAgICAgdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlLmNsb25lKCk7XG4gICAgICAgIGNvbnN0IGFycm93ID0gdGhpcy50cnlQYXJzZShcbiAgICAgICAgICBhYm9ydCA9PlxuICAgICAgICAgICAgdGhpcy5wYXJzZUFzeW5jQXJyb3dXaXRoVHlwZVBhcmFtZXRlcnMoc3RhcnRQb3MsIHN0YXJ0TG9jKSB8fFxuICAgICAgICAgICAgYWJvcnQoKSxcbiAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgKTtcblxuICAgICAgICAvKjo6IGludmFyaWFudChhcnJvdy5ub2RlICE9IG51bGwpICovXG4gICAgICAgIGlmICghYXJyb3cuZXJyb3IgJiYgIWFycm93LmFib3J0ZWQpIHJldHVybiBhcnJvdy5ub2RlO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHJ5UGFyc2UoXG4gICAgICAgICAgKCkgPT4gc3VwZXIucGFyc2VTdWJzY3JpcHRzKGJhc2UsIHN0YXJ0UG9zLCBzdGFydExvYywgbm9DYWxscyksXG4gICAgICAgICAgc3RhdGUsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHJlc3VsdC5ub2RlICYmICFyZXN1bHQuZXJyb3IpIHJldHVybiByZXN1bHQubm9kZTtcblxuICAgICAgICBpZiAoYXJyb3cubm9kZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSBhcnJvdy5mYWlsU3RhdGU7XG4gICAgICAgICAgcmV0dXJuIGFycm93Lm5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzdWx0Lm5vZGUpIHtcbiAgICAgICAgICB0aGlzLnN0YXRlID0gcmVzdWx0LmZhaWxTdGF0ZTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0Lm5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBhcnJvdy5lcnJvciB8fCByZXN1bHQuZXJyb3I7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5wYXJzZVN1YnNjcmlwdHMoYmFzZSwgc3RhcnRQb3MsIHN0YXJ0TG9jLCBub0NhbGxzKTtcbiAgICB9XG5cbiAgICBwYXJzZVN1YnNjcmlwdChcbiAgICAgIGJhc2U6IE4uRXhwcmVzc2lvbixcbiAgICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgICBzdGFydExvYzogUG9zaXRpb24sXG4gICAgICBub0NhbGxzOiA/Ym9vbGVhbixcbiAgICAgIHN1YnNjcmlwdFN0YXRlOiBOLlBhcnNlU3Vic2NyaXB0U3RhdGUsXG4gICAgKTogTi5FeHByZXNzaW9uIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnF1ZXN0aW9uRG90KSAmJiB0aGlzLmlzTG9va2FoZWFkVG9rZW5fbHQoKSkge1xuICAgICAgICBzdWJzY3JpcHRTdGF0ZS5vcHRpb25hbENoYWluTWVtYmVyID0gdHJ1ZTtcbiAgICAgICAgaWYgKG5vQ2FsbHMpIHtcbiAgICAgICAgICBzdWJzY3JpcHRTdGF0ZS5zdG9wID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gYmFzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgY29uc3Qgbm9kZTogTi5PcHRpb25hbENhbGxFeHByZXNzaW9uID0gdGhpcy5zdGFydE5vZGVBdChcbiAgICAgICAgICBzdGFydFBvcyxcbiAgICAgICAgICBzdGFydExvYyxcbiAgICAgICAgKTtcbiAgICAgICAgbm9kZS5jYWxsZWUgPSBiYXNlO1xuICAgICAgICBub2RlLnR5cGVBcmd1bWVudHMgPSB0aGlzLmZsb3dQYXJzZVR5cGVQYXJhbWV0ZXJJbnN0YW50aWF0aW9uKCk7XG4gICAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuTCk7XG4gICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgbm9kZS5hcmd1bWVudHMgPSB0aGlzLnBhcnNlQ2FsbEV4cHJlc3Npb25Bcmd1bWVudHModHQucGFyZW5SLCBmYWxzZSk7XG4gICAgICAgIG5vZGUub3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hDYWxsRXhwcmVzc2lvbihub2RlLCAvKiBvcHRpb25hbCAqLyB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICFub0NhbGxzICYmXG4gICAgICAgIHRoaXMuc2hvdWxkUGFyc2VUeXBlcygpICYmXG4gICAgICAgIHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICAgIG5vZGUuY2FsbGVlID0gYmFzZTtcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRyeVBhcnNlKCgpID0+IHtcbiAgICAgICAgICBub2RlLnR5cGVBcmd1bWVudHMgPVxuICAgICAgICAgICAgdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVySW5zdGFudGlhdGlvbkNhbGxPck5ldygpO1xuICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuTCk7XG4gICAgICAgICAgbm9kZS5hcmd1bWVudHMgPSB0aGlzLnBhcnNlQ2FsbEV4cHJlc3Npb25Bcmd1bWVudHModHQucGFyZW5SLCBmYWxzZSk7XG4gICAgICAgICAgaWYgKHN1YnNjcmlwdFN0YXRlLm9wdGlvbmFsQ2hhaW5NZW1iZXIpIG5vZGUub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hDYWxsRXhwcmVzc2lvbihcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBzdWJzY3JpcHRTdGF0ZS5vcHRpb25hbENoYWluTWVtYmVyLFxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQubm9kZSkge1xuICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHRoaXMuc3RhdGUgPSByZXN1bHQuZmFpbFN0YXRlO1xuICAgICAgICAgIHJldHVybiByZXN1bHQubm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VTdWJzY3JpcHQoXG4gICAgICAgIGJhc2UsXG4gICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICBzdGFydExvYyxcbiAgICAgICAgbm9DYWxscyxcbiAgICAgICAgc3Vic2NyaXB0U3RhdGUsXG4gICAgICApO1xuICAgIH1cblxuICAgIHBhcnNlTmV3QXJndW1lbnRzKG5vZGU6IE4uTmV3RXhwcmVzc2lvbik6IHZvaWQge1xuICAgICAgbGV0IHRhcmdzID0gbnVsbDtcbiAgICAgIGlmICh0aGlzLnNob3VsZFBhcnNlVHlwZXMoKSAmJiB0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgdGFyZ3MgPSB0aGlzLnRyeVBhcnNlKCgpID0+XG4gICAgICAgICAgdGhpcy5mbG93UGFyc2VUeXBlUGFyYW1ldGVySW5zdGFudGlhdGlvbkNhbGxPck5ldygpLFxuICAgICAgICApLm5vZGU7XG4gICAgICB9XG4gICAgICBub2RlLnR5cGVBcmd1bWVudHMgPSB0YXJncztcblxuICAgICAgc3VwZXIucGFyc2VOZXdBcmd1bWVudHMobm9kZSk7XG4gICAgfVxuXG4gICAgcGFyc2VBc3luY0Fycm93V2l0aFR5cGVQYXJhbWV0ZXJzKFxuICAgICAgc3RhcnRQb3M6IG51bWJlcixcbiAgICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICApOiA/Ti5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9uUGFyYW1zKG5vZGUpO1xuICAgICAgaWYgKCF0aGlzLnBhcnNlQXJyb3cobm9kZSkpIHJldHVybjtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlQXJyb3dFeHByZXNzaW9uKFxuICAgICAgICBub2RlLFxuICAgICAgICAvKiBwYXJhbXMgKi8gdW5kZWZpbmVkLFxuICAgICAgICAvKiBpc0FzeW5jICovIHRydWUsXG4gICAgICApO1xuICAgIH1cblxuICAgIHJlYWRUb2tlbl9tdWx0X21vZHVsbyhjb2RlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKTtcbiAgICAgIGlmIChcbiAgICAgICAgY29kZSA9PT0gY2hhckNvZGVzLmFzdGVyaXNrICYmXG4gICAgICAgIG5leHQgPT09IGNoYXJDb2Rlcy5zbGFzaCAmJlxuICAgICAgICB0aGlzLnN0YXRlLmhhc0Zsb3dDb21tZW50XG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5oYXNGbG93Q29tbWVudCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0YXRlLnBvcyArPSAyO1xuICAgICAgICB0aGlzLm5leHRUb2tlbigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHN1cGVyLnJlYWRUb2tlbl9tdWx0X21vZHVsbyhjb2RlKTtcbiAgICB9XG5cbiAgICByZWFkVG9rZW5fcGlwZV9hbXAoY29kZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICBjb25zdCBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSk7XG4gICAgICBpZiAoXG4gICAgICAgIGNvZGUgPT09IGNoYXJDb2Rlcy52ZXJ0aWNhbEJhciAmJlxuICAgICAgICBuZXh0ID09PSBjaGFyQ29kZXMucmlnaHRDdXJseUJyYWNlXG4gICAgICApIHtcbiAgICAgICAgLy8gJ3x9J1xuICAgICAgICB0aGlzLmZpbmlzaE9wKHR0LmJyYWNlQmFyUiwgMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3VwZXIucmVhZFRva2VuX3BpcGVfYW1wKGNvZGUpO1xuICAgIH1cblxuICAgIHBhcnNlVG9wTGV2ZWwoZmlsZTogTi5GaWxlLCBwcm9ncmFtOiBOLlByb2dyYW0pOiBOLkZpbGUge1xuICAgICAgY29uc3QgZmlsZU5vZGUgPSBzdXBlci5wYXJzZVRvcExldmVsKGZpbGUsIHByb2dyYW0pO1xuICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzRmxvd0NvbW1lbnQpIHtcbiAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRmxvd0Vycm9ycy5VbnRlcm1pbmF0ZWRGbG93Q29tbWVudCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmlsZU5vZGU7XG4gICAgfVxuXG4gICAgc2tpcEJsb2NrQ29tbWVudCgpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLmhhc1BsdWdpbihcImZsb3dDb21tZW50c1wiKSAmJiB0aGlzLnNraXBGbG93Q29tbWVudCgpKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhhc0Zsb3dDb21tZW50KSB7XG4gICAgICAgICAgdGhpcy51bmV4cGVjdGVkKG51bGwsIEZsb3dFcnJvcnMuTmVzdGVkRmxvd0NvbW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGFzRmxvd0NvbW1lbnRDb21wbGV0aW9uKCk7XG4gICAgICAgIHRoaXMuc3RhdGUucG9zICs9IHRoaXMuc2tpcEZsb3dDb21tZW50KCk7XG4gICAgICAgIHRoaXMuc3RhdGUuaGFzRmxvd0NvbW1lbnQgPSB0cnVlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc0Zsb3dDb21tZW50KSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMuaW5wdXQuaW5kZXhPZihcIiotL1wiLCAodGhpcy5zdGF0ZS5wb3MgKz0gMikpO1xuICAgICAgICBpZiAoZW5kID09PSAtMSkge1xuICAgICAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5wb3MgLSAyLCBFcnJvcnMuVW50ZXJtaW5hdGVkQ29tbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS5wb3MgPSBlbmQgKyAzO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHN1cGVyLnNraXBCbG9ja0NvbW1lbnQoKTtcbiAgICB9XG5cbiAgICBza2lwRmxvd0NvbW1lbnQoKTogbnVtYmVyIHwgYm9vbGVhbiB7XG4gICAgICBjb25zdCB7IHBvcyB9ID0gdGhpcy5zdGF0ZTtcbiAgICAgIGxldCBzaGlmdFRvRmlyc3ROb25XaGl0ZVNwYWNlID0gMjtcbiAgICAgIHdoaWxlIChcbiAgICAgICAgW2NoYXJDb2Rlcy5zcGFjZSwgY2hhckNvZGVzLnRhYl0uaW5jbHVkZXMoXG4gICAgICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHBvcyArIHNoaWZ0VG9GaXJzdE5vbldoaXRlU3BhY2UpLFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgc2hpZnRUb0ZpcnN0Tm9uV2hpdGVTcGFjZSsrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaDIgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQoc2hpZnRUb0ZpcnN0Tm9uV2hpdGVTcGFjZSArIHBvcyk7XG4gICAgICBjb25zdCBjaDMgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQoc2hpZnRUb0ZpcnN0Tm9uV2hpdGVTcGFjZSArIHBvcyArIDEpO1xuXG4gICAgICBpZiAoY2gyID09PSBjaGFyQ29kZXMuY29sb24gJiYgY2gzID09PSBjaGFyQ29kZXMuY29sb24pIHtcbiAgICAgICAgcmV0dXJuIHNoaWZ0VG9GaXJzdE5vbldoaXRlU3BhY2UgKyAyOyAvLyBjaGVjayBmb3IgLyo6OlxuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmlucHV0LnNsaWNlKFxuICAgICAgICAgIHNoaWZ0VG9GaXJzdE5vbldoaXRlU3BhY2UgKyBwb3MsXG4gICAgICAgICAgc2hpZnRUb0ZpcnN0Tm9uV2hpdGVTcGFjZSArIHBvcyArIDEyLFxuICAgICAgICApID09PSBcImZsb3ctaW5jbHVkZVwiXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHNoaWZ0VG9GaXJzdE5vbldoaXRlU3BhY2UgKyAxMjsgLy8gY2hlY2sgZm9yIC8qZmxvdy1pbmNsdWRlXG4gICAgICB9XG4gICAgICBpZiAoY2gyID09PSBjaGFyQ29kZXMuY29sb24gJiYgY2gzICE9PSBjaGFyQ29kZXMuY29sb24pIHtcbiAgICAgICAgcmV0dXJuIHNoaWZ0VG9GaXJzdE5vbldoaXRlU3BhY2U7IC8vIGNoZWNrIGZvciAvKjosIGFkdmFuY2UgdXAgdG8gOlxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGhhc0Zsb3dDb21tZW50Q29tcGxldGlvbigpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGVuZCA9IHRoaXMuaW5wdXQuaW5kZXhPZihcIiovXCIsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5wb3MsIEVycm9ycy5VbnRlcm1pbmF0ZWRDb21tZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGbG93IGVudW0gcGFyc2luZ1xuXG4gICAgZmxvd0VudW1FcnJvckJvb2xlYW5NZW1iZXJOb3RJbml0aWFsaXplZChcbiAgICAgIHBvczogbnVtYmVyLFxuICAgICAgeyBlbnVtTmFtZSwgbWVtYmVyTmFtZSB9OiB7IGVudW1OYW1lOiBzdHJpbmcsIG1lbWJlck5hbWU6IHN0cmluZyB9LFxuICAgICk6IHZvaWQge1xuICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgcG9zLFxuICAgICAgICBGbG93RXJyb3JzLkVudW1Cb29sZWFuTWVtYmVyTm90SW5pdGlhbGl6ZWQsXG4gICAgICAgIG1lbWJlck5hbWUsXG4gICAgICAgIGVudW1OYW1lLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmbG93RW51bUVycm9ySW52YWxpZE1lbWJlck5hbWUoXG4gICAgICBwb3M6IG51bWJlcixcbiAgICAgIHsgZW51bU5hbWUsIG1lbWJlck5hbWUgfTogeyBlbnVtTmFtZTogc3RyaW5nLCBtZW1iZXJOYW1lOiBzdHJpbmcgfSxcbiAgICApOiB2b2lkIHtcbiAgICAgIGNvbnN0IHN1Z2dlc3Rpb24gPSBtZW1iZXJOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBtZW1iZXJOYW1lLnNsaWNlKDEpO1xuICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgcG9zLFxuICAgICAgICBGbG93RXJyb3JzLkVudW1JbnZhbGlkTWVtYmVyTmFtZSxcbiAgICAgICAgbWVtYmVyTmFtZSxcbiAgICAgICAgc3VnZ2VzdGlvbixcbiAgICAgICAgZW51bU5hbWUsXG4gICAgICApO1xuICAgIH1cblxuICAgIGZsb3dFbnVtRXJyb3JEdXBsaWNhdGVNZW1iZXJOYW1lKFxuICAgICAgcG9zOiBudW1iZXIsXG4gICAgICB7IGVudW1OYW1lLCBtZW1iZXJOYW1lIH06IHsgZW51bU5hbWU6IHN0cmluZywgbWVtYmVyTmFtZTogc3RyaW5nIH0sXG4gICAgKTogdm9pZCB7XG4gICAgICB0aGlzLnJhaXNlKHBvcywgRmxvd0Vycm9ycy5FbnVtRHVwbGljYXRlTWVtYmVyTmFtZSwgbWVtYmVyTmFtZSwgZW51bU5hbWUpO1xuICAgIH1cblxuICAgIGZsb3dFbnVtRXJyb3JJbmNvbnNpc3RlbnRNZW1iZXJWYWx1ZXMoXG4gICAgICBwb3M6IG51bWJlcixcbiAgICAgIHsgZW51bU5hbWUgfTogeyBlbnVtTmFtZTogc3RyaW5nIH0sXG4gICAgKTogdm9pZCB7XG4gICAgICB0aGlzLnJhaXNlKHBvcywgRmxvd0Vycm9ycy5FbnVtSW5jb25zaXN0ZW50TWVtYmVyVmFsdWVzLCBlbnVtTmFtZSk7XG4gICAgfVxuXG4gICAgZmxvd0VudW1FcnJvckludmFsaWRFeHBsaWNpdFR5cGUoXG4gICAgICBwb3M6IG51bWJlcixcbiAgICAgIHtcbiAgICAgICAgZW51bU5hbWUsXG4gICAgICAgIHN1cHBsaWVkVHlwZSxcbiAgICAgIH06IHsgZW51bU5hbWU6IHN0cmluZywgc3VwcGxpZWRUeXBlOiBudWxsIHwgc3RyaW5nIH0sXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5yYWlzZShcbiAgICAgICAgcG9zLFxuICAgICAgICBzdXBwbGllZFR5cGUgPT09IG51bGxcbiAgICAgICAgICA/IEZsb3dFcnJvcnMuRW51bUludmFsaWRFeHBsaWNpdFR5cGVVbmtub3duU3VwcGxpZWRcbiAgICAgICAgICA6IEZsb3dFcnJvcnMuRW51bUludmFsaWRFeHBsaWNpdFR5cGUsXG4gICAgICAgIGVudW1OYW1lLFxuICAgICAgICBzdXBwbGllZFR5cGUsXG4gICAgICApO1xuICAgIH1cblxuICAgIGZsb3dFbnVtRXJyb3JJbnZhbGlkTWVtYmVySW5pdGlhbGl6ZXIoXG4gICAgICBwb3M6IG51bWJlcixcbiAgICAgIHsgZW51bU5hbWUsIGV4cGxpY2l0VHlwZSwgbWVtYmVyTmFtZSB9OiBFbnVtQ29udGV4dCxcbiAgICApIHtcbiAgICAgIGxldCBtZXNzYWdlID0gbnVsbDtcbiAgICAgIHN3aXRjaCAoZXhwbGljaXRUeXBlKSB7XG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgIG1lc3NhZ2UgPSBGbG93RXJyb3JzLkVudW1JbnZhbGlkTWVtYmVySW5pdGlhbGl6ZXJQcmltYXJ5VHlwZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInN5bWJvbFwiOlxuICAgICAgICAgIG1lc3NhZ2UgPSBGbG93RXJyb3JzLkVudW1JbnZhbGlkTWVtYmVySW5pdGlhbGl6ZXJTeW1ib2xUeXBlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIG51bGxcbiAgICAgICAgICBtZXNzYWdlID0gRmxvd0Vycm9ycy5FbnVtSW52YWxpZE1lbWJlckluaXRpYWxpemVyVW5rbm93blR5cGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yYWlzZShwb3MsIG1lc3NhZ2UsIGVudW1OYW1lLCBtZW1iZXJOYW1lLCBleHBsaWNpdFR5cGUpO1xuICAgIH1cblxuICAgIGZsb3dFbnVtRXJyb3JOdW1iZXJNZW1iZXJOb3RJbml0aWFsaXplZChcbiAgICAgIHBvczogbnVtYmVyLFxuICAgICAgeyBlbnVtTmFtZSwgbWVtYmVyTmFtZSB9OiB7IGVudW1OYW1lOiBzdHJpbmcsIG1lbWJlck5hbWU6IHN0cmluZyB9LFxuICAgICk6IHZvaWQge1xuICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgcG9zLFxuICAgICAgICBGbG93RXJyb3JzLkVudW1OdW1iZXJNZW1iZXJOb3RJbml0aWFsaXplZCxcbiAgICAgICAgZW51bU5hbWUsXG4gICAgICAgIG1lbWJlck5hbWUsXG4gICAgICApO1xuICAgIH1cblxuICAgIGZsb3dFbnVtRXJyb3JTdHJpbmdNZW1iZXJJbmNvbnNpc3RlbnRseUluaXRhaWxpemVkKFxuICAgICAgcG9zOiBudW1iZXIsXG4gICAgICB7IGVudW1OYW1lIH06IHsgZW51bU5hbWU6IHN0cmluZyB9LFxuICAgICk6IHZvaWQge1xuICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgcG9zLFxuICAgICAgICBGbG93RXJyb3JzLkVudW1TdHJpbmdNZW1iZXJJbmNvbnNpc3RlbnRseUluaXRhaWxpemVkLFxuICAgICAgICBlbnVtTmFtZSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZmxvd0VudW1NZW1iZXJJbml0KCk6IEVudW1NZW1iZXJJbml0IHtcbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgIGNvbnN0IGVuZE9mSW5pdCA9ICgpID0+IHRoaXMubWF0Y2godHQuY29tbWEpIHx8IHRoaXMubWF0Y2godHQuYnJhY2VSKTtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS50eXBlKSB7XG4gICAgICAgIGNhc2UgdHQubnVtOiB7XG4gICAgICAgICAgY29uc3QgbGl0ZXJhbCA9IHRoaXMucGFyc2VOdW1lcmljTGl0ZXJhbCh0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICAgICAgICBpZiAoZW5kT2ZJbml0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IFwibnVtYmVyXCIsIHBvczogbGl0ZXJhbC5zdGFydCwgdmFsdWU6IGxpdGVyYWwgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJpbnZhbGlkXCIsIHBvczogc3RhcnRQb3MgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlIHR0LnN0cmluZzoge1xuICAgICAgICAgIGNvbnN0IGxpdGVyYWwgPSB0aGlzLnBhcnNlU3RyaW5nTGl0ZXJhbCh0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICAgICAgICBpZiAoZW5kT2ZJbml0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IFwic3RyaW5nXCIsIHBvczogbGl0ZXJhbC5zdGFydCwgdmFsdWU6IGxpdGVyYWwgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJpbnZhbGlkXCIsIHBvczogc3RhcnRQb3MgfTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlIHR0Ll90cnVlOlxuICAgICAgICBjYXNlIHR0Ll9mYWxzZToge1xuICAgICAgICAgIGNvbnN0IGxpdGVyYWwgPSB0aGlzLnBhcnNlQm9vbGVhbkxpdGVyYWwodGhpcy5tYXRjaCh0dC5fdHJ1ZSkpO1xuICAgICAgICAgIGlmIChlbmRPZkluaXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICAgICAgICAgIHBvczogbGl0ZXJhbC5zdGFydCxcbiAgICAgICAgICAgICAgdmFsdWU6IGxpdGVyYWwsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4geyB0eXBlOiBcImludmFsaWRcIiwgcG9zOiBzdGFydFBvcyB9O1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJpbnZhbGlkXCIsIHBvczogc3RhcnRQb3MgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmbG93RW51bU1lbWJlclJhdygpOiB7IGlkOiBOLk5vZGUsIGluaXQ6IEVudW1NZW1iZXJJbml0IH0ge1xuICAgICAgY29uc3QgcG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIodHJ1ZSk7XG4gICAgICBjb25zdCBpbml0ID0gdGhpcy5lYXQodHQuZXEpXG4gICAgICAgID8gdGhpcy5mbG93RW51bU1lbWJlckluaXQoKVxuICAgICAgICA6IHsgdHlwZTogXCJub25lXCIsIHBvcyB9O1xuICAgICAgcmV0dXJuIHsgaWQsIGluaXQgfTtcbiAgICB9XG5cbiAgICBmbG93RW51bUNoZWNrRXhwbGljaXRUeXBlTWlzbWF0Y2goXG4gICAgICBwb3M6IG51bWJlcixcbiAgICAgIGNvbnRleHQ6IEVudW1Db250ZXh0LFxuICAgICAgZXhwZWN0ZWRUeXBlOiBFbnVtRXhwbGljaXRUeXBlLFxuICAgICk6IHZvaWQge1xuICAgICAgY29uc3QgeyBleHBsaWNpdFR5cGUgfSA9IGNvbnRleHQ7XG4gICAgICBpZiAoZXhwbGljaXRUeXBlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChleHBsaWNpdFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgICB0aGlzLmZsb3dFbnVtRXJyb3JJbnZhbGlkTWVtYmVySW5pdGlhbGl6ZXIocG9zLCBjb250ZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmbG93RW51bU1lbWJlcnMoe1xuICAgICAgZW51bU5hbWUsXG4gICAgICBleHBsaWNpdFR5cGUsXG4gICAgfToge1xuICAgICAgZW51bU5hbWU6IHN0cmluZyxcbiAgICAgIGV4cGxpY2l0VHlwZTogRW51bUV4cGxpY2l0VHlwZSxcbiAgICB9KToge3xcbiAgICAgIG1lbWJlcnM6IHt8XG4gICAgICAgIGJvb2xlYW5NZW1iZXJzOiBBcnJheTxOLk5vZGU+LFxuICAgICAgICBudW1iZXJNZW1iZXJzOiBBcnJheTxOLk5vZGU+LFxuICAgICAgICBzdHJpbmdNZW1iZXJzOiBBcnJheTxOLk5vZGU+LFxuICAgICAgICBkZWZhdWx0ZWRNZW1iZXJzOiBBcnJheTxOLk5vZGU+LFxuICAgICAgfH0sXG4gICAgICBoYXNVbmtub3duTWVtYmVyczogYm9vbGVhbixcbiAgICB8fSB7XG4gICAgICBjb25zdCBzZWVuTmFtZXMgPSBuZXcgU2V0KCk7XG4gICAgICBjb25zdCBtZW1iZXJzID0ge1xuICAgICAgICBib29sZWFuTWVtYmVyczogW10sXG4gICAgICAgIG51bWJlck1lbWJlcnM6IFtdLFxuICAgICAgICBzdHJpbmdNZW1iZXJzOiBbXSxcbiAgICAgICAgZGVmYXVsdGVkTWVtYmVyczogW10sXG4gICAgICB9O1xuICAgICAgbGV0IGhhc1Vua25vd25NZW1iZXJzID0gZmFsc2U7XG4gICAgICB3aGlsZSAoIXRoaXMubWF0Y2godHQuYnJhY2VSKSkge1xuICAgICAgICBpZiAodGhpcy5lYXQodHQuZWxsaXBzaXMpKSB7XG4gICAgICAgICAgaGFzVW5rbm93bk1lbWJlcnMgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1lbWJlck5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICBjb25zdCB7IGlkLCBpbml0IH0gPSB0aGlzLmZsb3dFbnVtTWVtYmVyUmF3KCk7XG4gICAgICAgIGNvbnN0IG1lbWJlck5hbWUgPSBpZC5uYW1lO1xuICAgICAgICBpZiAobWVtYmVyTmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXlthLXpdLy50ZXN0KG1lbWJlck5hbWUpKSB7XG4gICAgICAgICAgdGhpcy5mbG93RW51bUVycm9ySW52YWxpZE1lbWJlck5hbWUoaWQuc3RhcnQsIHtcbiAgICAgICAgICAgIGVudW1OYW1lLFxuICAgICAgICAgICAgbWVtYmVyTmFtZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2Vlbk5hbWVzLmhhcyhtZW1iZXJOYW1lKSkge1xuICAgICAgICAgIHRoaXMuZmxvd0VudW1FcnJvckR1cGxpY2F0ZU1lbWJlck5hbWUoaWQuc3RhcnQsIHtcbiAgICAgICAgICAgIGVudW1OYW1lLFxuICAgICAgICAgICAgbWVtYmVyTmFtZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWVuTmFtZXMuYWRkKG1lbWJlck5hbWUpO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0geyBlbnVtTmFtZSwgZXhwbGljaXRUeXBlLCBtZW1iZXJOYW1lIH07XG4gICAgICAgIG1lbWJlck5vZGUuaWQgPSBpZDtcbiAgICAgICAgc3dpdGNoIChpbml0LnR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOiB7XG4gICAgICAgICAgICB0aGlzLmZsb3dFbnVtQ2hlY2tFeHBsaWNpdFR5cGVNaXNtYXRjaChcbiAgICAgICAgICAgICAgaW5pdC5wb3MsXG4gICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICAgIFwiYm9vbGVhblwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIG1lbWJlck5vZGUuaW5pdCA9IGluaXQudmFsdWU7XG4gICAgICAgICAgICBtZW1iZXJzLmJvb2xlYW5NZW1iZXJzLnB1c2goXG4gICAgICAgICAgICAgIHRoaXMuZmluaXNoTm9kZShtZW1iZXJOb2RlLCBcIkVudW1Cb29sZWFuTWVtYmVyXCIpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6IHtcbiAgICAgICAgICAgIHRoaXMuZmxvd0VudW1DaGVja0V4cGxpY2l0VHlwZU1pc21hdGNoKGluaXQucG9zLCBjb250ZXh0LCBcIm51bWJlclwiKTtcbiAgICAgICAgICAgIG1lbWJlck5vZGUuaW5pdCA9IGluaXQudmFsdWU7XG4gICAgICAgICAgICBtZW1iZXJzLm51bWJlck1lbWJlcnMucHVzaChcbiAgICAgICAgICAgICAgdGhpcy5maW5pc2hOb2RlKG1lbWJlck5vZGUsIFwiRW51bU51bWJlck1lbWJlclwiKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSBcInN0cmluZ1wiOiB7XG4gICAgICAgICAgICB0aGlzLmZsb3dFbnVtQ2hlY2tFeHBsaWNpdFR5cGVNaXNtYXRjaChpbml0LnBvcywgY29udGV4dCwgXCJzdHJpbmdcIik7XG4gICAgICAgICAgICBtZW1iZXJOb2RlLmluaXQgPSBpbml0LnZhbHVlO1xuICAgICAgICAgICAgbWVtYmVycy5zdHJpbmdNZW1iZXJzLnB1c2goXG4gICAgICAgICAgICAgIHRoaXMuZmluaXNoTm9kZShtZW1iZXJOb2RlLCBcIkVudW1TdHJpbmdNZW1iZXJcIiksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgXCJpbnZhbGlkXCI6IHtcbiAgICAgICAgICAgIHRocm93IHRoaXMuZmxvd0VudW1FcnJvckludmFsaWRNZW1iZXJJbml0aWFsaXplcihpbml0LnBvcywgY29udGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgXCJub25lXCI6IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXhwbGljaXRUeXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93RW51bUVycm9yQm9vbGVhbk1lbWJlck5vdEluaXRpYWxpemVkKFxuICAgICAgICAgICAgICAgICAgaW5pdC5wb3MsXG4gICAgICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dFbnVtRXJyb3JOdW1iZXJNZW1iZXJOb3RJbml0aWFsaXplZChpbml0LnBvcywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWVtYmVycy5kZWZhdWx0ZWRNZW1iZXJzLnB1c2goXG4gICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaE5vZGUobWVtYmVyTm9kZSwgXCJFbnVtRGVmYXVsdGVkTWVtYmVyXCIpLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm1hdGNoKHR0LmJyYWNlUikpIHtcbiAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5jb21tYSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7IG1lbWJlcnMsIGhhc1Vua25vd25NZW1iZXJzIH07XG4gICAgfVxuXG4gICAgZmxvd0VudW1TdHJpbmdNZW1iZXJzKFxuICAgICAgaW5pdGlhbGl6ZWRNZW1iZXJzOiBBcnJheTxOLk5vZGU+LFxuICAgICAgZGVmYXVsdGVkTWVtYmVyczogQXJyYXk8Ti5Ob2RlPixcbiAgICAgIHsgZW51bU5hbWUgfTogeyBlbnVtTmFtZTogc3RyaW5nIH0sXG4gICAgKTogQXJyYXk8Ti5Ob2RlPiB7XG4gICAgICBpZiAoaW5pdGlhbGl6ZWRNZW1iZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdGVkTWVtYmVycztcbiAgICAgIH0gZWxzZSBpZiAoZGVmYXVsdGVkTWVtYmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkTWVtYmVycztcbiAgICAgIH0gZWxzZSBpZiAoZGVmYXVsdGVkTWVtYmVycy5sZW5ndGggPiBpbml0aWFsaXplZE1lbWJlcnMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGluaXRpYWxpemVkTWVtYmVycykge1xuICAgICAgICAgIHRoaXMuZmxvd0VudW1FcnJvclN0cmluZ01lbWJlckluY29uc2lzdGVudGx5SW5pdGFpbGl6ZWQoXG4gICAgICAgICAgICBtZW1iZXIuc3RhcnQsXG4gICAgICAgICAgICB7IGVudW1OYW1lIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmYXVsdGVkTWVtYmVycztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIGRlZmF1bHRlZE1lbWJlcnMpIHtcbiAgICAgICAgICB0aGlzLmZsb3dFbnVtRXJyb3JTdHJpbmdNZW1iZXJJbmNvbnNpc3RlbnRseUluaXRhaWxpemVkKFxuICAgICAgICAgICAgbWVtYmVyLnN0YXJ0LFxuICAgICAgICAgICAgeyBlbnVtTmFtZSB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVkTWVtYmVycztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmbG93RW51bVBhcnNlRXhwbGljaXRUeXBlKHtcbiAgICAgIGVudW1OYW1lLFxuICAgIH06IHtcbiAgICAgIGVudW1OYW1lOiBzdHJpbmcsXG4gICAgfSk6IEVudW1FeHBsaWNpdFR5cGUge1xuICAgICAgaWYgKHRoaXMuZWF0Q29udGV4dHVhbChcIm9mXCIpKSB7XG4gICAgICAgIGlmICghdGhpcy5tYXRjaCh0dC5uYW1lKSkge1xuICAgICAgICAgIHRocm93IHRoaXMuZmxvd0VudW1FcnJvckludmFsaWRFeHBsaWNpdFR5cGUodGhpcy5zdGF0ZS5zdGFydCwge1xuICAgICAgICAgICAgZW51bU5hbWUsXG4gICAgICAgICAgICBzdXBwbGllZFR5cGU6IG51bGwsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IHZhbHVlIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgICB0aGlzLm5leHQoKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdmFsdWUgIT09IFwiYm9vbGVhblwiICYmXG4gICAgICAgICAgdmFsdWUgIT09IFwibnVtYmVyXCIgJiZcbiAgICAgICAgICB2YWx1ZSAhPT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgIHZhbHVlICE9PSBcInN5bWJvbFwiXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZmxvd0VudW1FcnJvckludmFsaWRFeHBsaWNpdFR5cGUodGhpcy5zdGF0ZS5zdGFydCwge1xuICAgICAgICAgICAgZW51bU5hbWUsXG4gICAgICAgICAgICBzdXBwbGllZFR5cGU6IHZhbHVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZmxvd0VudW1Cb2R5KG5vZGU6IE4uTm9kZSwgeyBlbnVtTmFtZSwgbmFtZUxvYyB9KTogTi5Ob2RlIHtcbiAgICAgIGNvbnN0IGV4cGxpY2l0VHlwZSA9IHRoaXMuZmxvd0VudW1QYXJzZUV4cGxpY2l0VHlwZSh7IGVudW1OYW1lIH0pO1xuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcbiAgICAgIGNvbnN0IHsgbWVtYmVycywgaGFzVW5rbm93bk1lbWJlcnMgfSA9IHRoaXMuZmxvd0VudW1NZW1iZXJzKHtcbiAgICAgICAgZW51bU5hbWUsXG4gICAgICAgIGV4cGxpY2l0VHlwZSxcbiAgICAgIH0pO1xuICAgICAgbm9kZS5oYXNVbmtub3duTWVtYmVycyA9IGhhc1Vua25vd25NZW1iZXJzO1xuXG4gICAgICBzd2l0Y2ggKGV4cGxpY2l0VHlwZSkge1xuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgIG5vZGUuZXhwbGljaXRUeXBlID0gdHJ1ZTtcbiAgICAgICAgICBub2RlLm1lbWJlcnMgPSBtZW1iZXJzLmJvb2xlYW5NZW1iZXJzO1xuICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlUik7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkVudW1Cb29sZWFuQm9keVwiKTtcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgIG5vZGUuZXhwbGljaXRUeXBlID0gdHJ1ZTtcbiAgICAgICAgICBub2RlLm1lbWJlcnMgPSBtZW1iZXJzLm51bWJlck1lbWJlcnM7XG4gICAgICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VSKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRW51bU51bWJlckJvZHlcIik7XG4gICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICBub2RlLmV4cGxpY2l0VHlwZSA9IHRydWU7XG4gICAgICAgICAgbm9kZS5tZW1iZXJzID0gdGhpcy5mbG93RW51bVN0cmluZ01lbWJlcnMoXG4gICAgICAgICAgICBtZW1iZXJzLnN0cmluZ01lbWJlcnMsXG4gICAgICAgICAgICBtZW1iZXJzLmRlZmF1bHRlZE1lbWJlcnMsXG4gICAgICAgICAgICB7IGVudW1OYW1lIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5icmFjZVIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJFbnVtU3RyaW5nQm9keVwiKTtcbiAgICAgICAgY2FzZSBcInN5bWJvbFwiOlxuICAgICAgICAgIG5vZGUubWVtYmVycyA9IG1lbWJlcnMuZGVmYXVsdGVkTWVtYmVycztcbiAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5icmFjZVIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJFbnVtU3ltYm9sQm9keVwiKTtcbiAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgIC8vIGBleHBsaWNpdFR5cGVgIGlzIGBudWxsYFxuICAgICAgICAgIGNvbnN0IGVtcHR5ID0gKCkgPT4ge1xuICAgICAgICAgICAgbm9kZS5tZW1iZXJzID0gW107XG4gICAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5icmFjZVIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkVudW1TdHJpbmdCb2R5XCIpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgbm9kZS5leHBsaWNpdFR5cGUgPSBmYWxzZTtcblxuICAgICAgICAgIGNvbnN0IGJvb2xzTGVuID0gbWVtYmVycy5ib29sZWFuTWVtYmVycy5sZW5ndGg7XG4gICAgICAgICAgY29uc3QgbnVtc0xlbiA9IG1lbWJlcnMubnVtYmVyTWVtYmVycy5sZW5ndGg7XG4gICAgICAgICAgY29uc3Qgc3Ryc0xlbiA9IG1lbWJlcnMuc3RyaW5nTWVtYmVycy5sZW5ndGg7XG4gICAgICAgICAgY29uc3QgZGVmYXVsdGVkTGVuID0gbWVtYmVycy5kZWZhdWx0ZWRNZW1iZXJzLmxlbmd0aDtcblxuICAgICAgICAgIGlmICghYm9vbHNMZW4gJiYgIW51bXNMZW4gJiYgIXN0cnNMZW4gJiYgIWRlZmF1bHRlZExlbikge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5KCk7XG4gICAgICAgICAgfSBlbHNlIGlmICghYm9vbHNMZW4gJiYgIW51bXNMZW4pIHtcbiAgICAgICAgICAgIG5vZGUubWVtYmVycyA9IHRoaXMuZmxvd0VudW1TdHJpbmdNZW1iZXJzKFxuICAgICAgICAgICAgICBtZW1iZXJzLnN0cmluZ01lbWJlcnMsXG4gICAgICAgICAgICAgIG1lbWJlcnMuZGVmYXVsdGVkTWVtYmVycyxcbiAgICAgICAgICAgICAgeyBlbnVtTmFtZSB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlUik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRW51bVN0cmluZ0JvZHlcIik7XG4gICAgICAgICAgfSBlbHNlIGlmICghbnVtc0xlbiAmJiAhc3Ryc0xlbiAmJiBib29sc0xlbiA+PSBkZWZhdWx0ZWRMZW4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIG1lbWJlcnMuZGVmYXVsdGVkTWVtYmVycykge1xuICAgICAgICAgICAgICB0aGlzLmZsb3dFbnVtRXJyb3JCb29sZWFuTWVtYmVyTm90SW5pdGlhbGl6ZWQobWVtYmVyLnN0YXJ0LCB7XG4gICAgICAgICAgICAgICAgZW51bU5hbWUsXG4gICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogbWVtYmVyLmlkLm5hbWUsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5tZW1iZXJzID0gbWVtYmVycy5ib29sZWFuTWVtYmVycztcbiAgICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlUik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRW51bUJvb2xlYW5Cb2R5XCIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWJvb2xzTGVuICYmICFzdHJzTGVuICYmIG51bXNMZW4gPj0gZGVmYXVsdGVkTGVuKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBtZW1iZXJzLmRlZmF1bHRlZE1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgdGhpcy5mbG93RW51bUVycm9yTnVtYmVyTWVtYmVyTm90SW5pdGlhbGl6ZWQobWVtYmVyLnN0YXJ0LCB7XG4gICAgICAgICAgICAgICAgZW51bU5hbWUsXG4gICAgICAgICAgICAgICAgbWVtYmVyTmFtZTogbWVtYmVyLmlkLm5hbWUsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5tZW1iZXJzID0gbWVtYmVycy5udW1iZXJNZW1iZXJzO1xuICAgICAgICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VSKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJFbnVtTnVtYmVyQm9keVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mbG93RW51bUVycm9ySW5jb25zaXN0ZW50TWVtYmVyVmFsdWVzKG5hbWVMb2MsIHsgZW51bU5hbWUgfSk7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmbG93UGFyc2VFbnVtRGVjbGFyYXRpb24obm9kZTogTi5Ob2RlKTogTi5Ob2RlIHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIG5vZGUuaWQgPSBpZDtcbiAgICAgIG5vZGUuYm9keSA9IHRoaXMuZmxvd0VudW1Cb2R5KHRoaXMuc3RhcnROb2RlKCksIHtcbiAgICAgICAgZW51bU5hbWU6IGlkLm5hbWUsXG4gICAgICAgIG5hbWVMb2M6IGlkLnN0YXJ0LFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRW51bURlY2xhcmF0aW9uXCIpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZSBuZXh0IHRva2VuIGlzIGEgdHQucmVsYXRpb24oXCI8XCIpXG4gICAgaXNMb29rYWhlYWRUb2tlbl9sdCgpOiBib29sZWFuIHtcbiAgICAgIGNvbnN0IG5leHQgPSB0aGlzLm5leHRUb2tlblN0YXJ0KCk7XG4gICAgICBpZiAodGhpcy5pbnB1dC5jaGFyQ29kZUF0KG5leHQpID09PSBjaGFyQ29kZXMubGVzc1RoYW4pIHtcbiAgICAgICAgY29uc3QgYWZ0ZXJOZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KG5leHQgKyAxKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBhZnRlck5leHQgIT09IGNoYXJDb2Rlcy5sZXNzVGhhbiAmJiBhZnRlck5leHQgIT09IGNoYXJDb2Rlcy5lcXVhbHNUb1xuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1heWJlVW53cmFwVHlwZUNhc3RFeHByZXNzaW9uKG5vZGU6IE4uTm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gXCJUeXBlQ2FzdEV4cHJlc3Npb25cIiA/IG5vZGUuZXhwcmVzc2lvbiA6IG5vZGU7XG4gICAgfVxuICB9O1xuIl19