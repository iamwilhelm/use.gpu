"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _types = require("../../tokenizer/types");

var _context = require("../../tokenizer/context");

var N = _interopRequireWildcard(require("../../types"));

var _scopeflags = require("../../util/scopeflags");

var _scope = _interopRequireDefault(require("./scope"));

var charCodes = _interopRequireWildcard(require("charcodes"));

var _productionParameter = require("../../util/production-parameter");

var _error = require("../../parser/error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function nonNull(x) {
  if (x == null) {
    // $FlowIgnore
    throw new Error("Unexpected ".concat(x, " value."));
  }

  return x;
}

function assert(x) {
  if (!x) {
    throw new Error("Assert fail");
  }
}

/* eslint sort-keys: "error" */
var TSErrors = (0, _error.makeErrorTemplates)({
  AbstractMethodHasImplementation: "Method '%0' cannot have an implementation because it is marked abstract.",
  AccesorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.",
  AccesorCannotHaveTypeParameters: "An accessor cannot have type parameters.",
  ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.",
  ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.",
  ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.",
  DeclareAccessor: "'declare' is not allowed in %0ters.",
  DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.",
  DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.",
  DuplicateAccessibilityModifier: "Accessibility modifier already seen.",
  DuplicateModifier: "Duplicate modifier: '%0'.",
  EmptyHeritageClauseType: "'%0' list cannot be empty.",
  EmptyTypeArguments: "Type argument list cannot be empty.",
  EmptyTypeParameters: "Type parameter list cannot be empty.",
  ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.",
  ImportAliasHasImportType: "An import alias can not use 'import type'.",
  IncompatibleModifiers: "'%0' modifier cannot be used with '%1' modifier.",
  IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.",
  IndexSignatureHasAccessibility: "Index signatures cannot have an accessibility modifier ('%0').",
  IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.",
  IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.",
  IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.",
  InvalidModifierOnTypeMember: "'%0' modifier cannot appear on a type member.",
  InvalidModifiersOrder: "'%0' modifier must precede '%1' modifier.",
  InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.",
  MixedLabeledAndUnlabeledElements: "Tuple members must all have names or all not have names.",
  NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.",
  NonClassMethodPropertyHasAbstractModifer: "'abstract' modifier can only appear on a class, method, or property declaration.",
  OptionalTypeBeforeRequired: "A required element cannot follow an optional element.",
  OverrideNotInSubClass: "This member cannot have an 'override' modifier because its containing class does not extend another class.",
  PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.",
  PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.",
  PrivateElementHasAccessibility: "Private elements cannot have an accessibility modifier ('%0').",
  ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.",
  SetAccesorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.",
  SetAccesorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.",
  SetAccesorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.",
  StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.",
  TypeAnnotationAfterAssign: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeImportCannotSpecifyDefaultAndNamed: "A type-only import can specify a default import or named bindings, but not both.",
  UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.",
  UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.",
  UnexpectedTypeAnnotation: "Did not expect a type annotation here.",
  UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.",
  UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.",
  UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.",
  UnsupportedSignatureParameterKind: "Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got %0."
},
/* code */
_error.ErrorCodes.SyntaxError);
/* eslint-disable sort-keys */
// Doesn't handle "void" or "null" because those are keywords, not identifiers.
// It also doesn't handle "intrinsic", since usually it's not a keyword.

function keywordTypeFromName(value) {
  switch (value) {
    case "any":
      return "TSAnyKeyword";

    case "boolean":
      return "TSBooleanKeyword";

    case "bigint":
      return "TSBigIntKeyword";

    case "never":
      return "TSNeverKeyword";

    case "number":
      return "TSNumberKeyword";

    case "object":
      return "TSObjectKeyword";

    case "string":
      return "TSStringKeyword";

    case "symbol":
      return "TSSymbolKeyword";

    case "undefined":
      return "TSUndefinedKeyword";

    case "unknown":
      return "TSUnknownKeyword";

    default:
      return undefined;
  }
}

function tsIsAccessModifier(modifier) {
  return modifier === "private" || modifier === "public" || modifier === "protected";
}

var _default = function _default(superClass) {
  return /*#__PURE__*/function (_superClass) {
    _inherits(_class, _superClass);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "getScopeHandler",
      value: function getScopeHandler() {
        return _scope["default"];
      }
    }, {
      key: "tsIsIdentifier",
      value: function tsIsIdentifier() {
        // TODO: actually a bit more complex in TypeScript, but shouldn't matter.
        // See https://github.com/Microsoft/TypeScript/issues/15008
        return this.match(_types.types.name);
      }
    }, {
      key: "tsTokenCanFollowModifier",
      value: function tsTokenCanFollowModifier() {
        return (this.match(_types.types.bracketL) || this.match(_types.types.braceL) || this.match(_types.types.star) || this.match(_types.types.ellipsis) || this.match(_types.types.privateName) || this.isLiteralPropertyName()) && !this.hasPrecedingLineBreak();
      }
    }, {
      key: "tsNextTokenCanFollowModifier",
      value: function tsNextTokenCanFollowModifier() {
        // Note: TypeScript's implementation is much more complicated because
        // more things are considered modifiers there.
        // This implementation only handles modifiers not handled by @babel/parser itself. And "static".
        // TODO: Would be nice to avoid lookahead. Want a hasLineBreakUpNext() method...
        this.next();
        return this.tsTokenCanFollowModifier();
      }
      /** Parses a modifier matching one the given modifier names. */

    }, {
      key: "tsParseModifier",
      value: function tsParseModifier(allowedModifiers) {
        if (!this.match(_types.types.name)) {
          return undefined;
        }

        var modifier = this.state.value;

        if (allowedModifiers.indexOf(modifier) !== -1 && this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) {
          return modifier;
        }

        return undefined;
      }
      /** Parses a list of modifiers, in any order.
       *  If you need a specific order, you must call this function multiple times:
       *    this.tsParseModifiers(node, ["public"]);
       *    this.tsParseModifiers(node, ["abstract", "readonly"]);
       */

    }, {
      key: "tsParseModifiers",
      value: function tsParseModifiers(modified, allowedModifiers, disallowedModifiers, errorTemplate) {
        var _this = this;

        var enforceOrder = function enforceOrder(pos, modifier, before, after) {
          if (modifier === before && modified[after]) {
            _this.raise(pos, TSErrors.InvalidModifiersOrder, before, after);
          }
        };

        var incompatible = function incompatible(pos, modifier, mod1, mod2) {
          if (modified[mod1] && modifier === mod2 || modified[mod2] && modifier === mod1) {
            _this.raise(pos, TSErrors.IncompatibleModifiers, mod1, mod2);
          }
        };

        for (;;) {
          var startPos = this.state.start;
          var modifier = this.tsParseModifier(allowedModifiers.concat(disallowedModifiers !== null && disallowedModifiers !== void 0 ? disallowedModifiers : []));
          if (!modifier) break;

          if (tsIsAccessModifier(modifier)) {
            if (modified.accessibility) {
              this.raise(startPos, TSErrors.DuplicateAccessibilityModifier);
            } else {
              enforceOrder(startPos, modifier, modifier, "override");
              enforceOrder(startPos, modifier, modifier, "static");
              enforceOrder(startPos, modifier, modifier, "readonly");
              modified.accessibility = modifier;
            }
          } else {
            if (Object.hasOwnProperty.call(modified, modifier)) {
              this.raise(startPos, TSErrors.DuplicateModifier, modifier);
            } else {
              enforceOrder(startPos, modifier, "static", "readonly");
              enforceOrder(startPos, modifier, "static", "override");
              enforceOrder(startPos, modifier, "override", "readonly");
              enforceOrder(startPos, modifier, "abstract", "override");
              incompatible(startPos, modifier, "declare", "override");
              incompatible(startPos, modifier, "static", "abstract");
            }

            modified[modifier] = true;
          }

          if (disallowedModifiers !== null && disallowedModifiers !== void 0 && disallowedModifiers.includes(modifier)) {
            this.raise(startPos, // $FlowIgnore
            errorTemplate, modifier);
          }
        }
      }
    }, {
      key: "tsIsListTerminator",
      value: function tsIsListTerminator(kind) {
        switch (kind) {
          case "EnumMembers":
          case "TypeMembers":
            return this.match(_types.types.braceR);

          case "HeritageClauseElement":
            return this.match(_types.types.braceL);

          case "TupleElementTypes":
            return this.match(_types.types.bracketR);

          case "TypeParametersOrArguments":
            return this.isRelational(">");
        }

        throw new Error("Unreachable");
      }
    }, {
      key: "tsParseList",
      value: function tsParseList(kind, parseElement) {
        var result = [];

        while (!this.tsIsListTerminator(kind)) {
          // Skipping "parseListElement" from the TS source since that's just for error handling.
          result.push(parseElement());
        }

        return result;
      }
    }, {
      key: "tsParseDelimitedList",
      value: function tsParseDelimitedList(kind, parseElement) {
        return nonNull(this.tsParseDelimitedListWorker(kind, parseElement,
        /* expectSuccess */
        true));
      }
      /**
       * If !expectSuccess, returns undefined instead of failing to parse.
       * If expectSuccess, parseElement should always return a defined value.
       */

    }, {
      key: "tsParseDelimitedListWorker",
      value: function tsParseDelimitedListWorker(kind, parseElement, expectSuccess) {
        var result = [];

        for (;;) {
          if (this.tsIsListTerminator(kind)) {
            break;
          }

          var element = parseElement();

          if (element == null) {
            return undefined;
          }

          result.push(element);

          if (this.eat(_types.types.comma)) {
            continue;
          }

          if (this.tsIsListTerminator(kind)) {
            break;
          }

          if (expectSuccess) {
            // This will fail with an error about a missing comma
            this.expect(_types.types.comma);
          }

          return undefined;
        }

        return result;
      }
    }, {
      key: "tsParseBracketedList",
      value: function tsParseBracketedList(kind, parseElement, bracket, skipFirstToken) {
        if (!skipFirstToken) {
          if (bracket) {
            this.expect(_types.types.bracketL);
          } else {
            this.expectRelational("<");
          }
        }

        var result = this.tsParseDelimitedList(kind, parseElement);

        if (bracket) {
          this.expect(_types.types.bracketR);
        } else {
          this.expectRelational(">");
        }

        return result;
      }
    }, {
      key: "tsParseImportType",
      value: function tsParseImportType() {
        var node = this.startNode();
        this.expect(_types.types._import);
        this.expect(_types.types.parenL);

        if (!this.match(_types.types.string)) {
          this.raise(this.state.start, TSErrors.UnsupportedImportTypeArgument);
        } // For compatibility to estree we cannot call parseLiteral directly here


        node.argument = this.parseExprAtom();
        this.expect(_types.types.parenR);

        if (this.eat(_types.types.dot)) {
          node.qualifier = this.tsParseEntityName(
          /* allowReservedWords */
          true);
        }

        if (this.isRelational("<")) {
          node.typeParameters = this.tsParseTypeArguments();
        }

        return this.finishNode(node, "TSImportType");
      }
    }, {
      key: "tsParseEntityName",
      value: function tsParseEntityName(allowReservedWords) {
        var entity = this.parseIdentifier();

        while (this.eat(_types.types.dot)) {
          var node = this.startNodeAtNode(entity);
          node.left = entity;
          node.right = this.parseIdentifier(allowReservedWords);
          entity = this.finishNode(node, "TSQualifiedName");
        }

        return entity;
      }
    }, {
      key: "tsParseTypeReference",
      value: function tsParseTypeReference() {
        var node = this.startNode();
        node.typeName = this.tsParseEntityName(
        /* allowReservedWords */
        false);

        if (!this.hasPrecedingLineBreak() && this.isRelational("<")) {
          node.typeParameters = this.tsParseTypeArguments();
        }

        return this.finishNode(node, "TSTypeReference");
      }
    }, {
      key: "tsParseThisTypePredicate",
      value: function tsParseThisTypePredicate(lhs) {
        this.next();
        var node = this.startNodeAtNode(lhs);
        node.parameterName = lhs;
        node.typeAnnotation = this.tsParseTypeAnnotation(
        /* eatColon */
        false);
        node.asserts = false;
        return this.finishNode(node, "TSTypePredicate");
      }
    }, {
      key: "tsParseThisTypeNode",
      value: function tsParseThisTypeNode() {
        var node = this.startNode();
        this.next();
        return this.finishNode(node, "TSThisType");
      }
    }, {
      key: "tsParseTypeQuery",
      value: function tsParseTypeQuery() {
        var node = this.startNode();
        this.expect(_types.types._typeof);

        if (this.match(_types.types._import)) {
          node.exprName = this.tsParseImportType();
        } else {
          node.exprName = this.tsParseEntityName(
          /* allowReservedWords */
          true);
        }

        return this.finishNode(node, "TSTypeQuery");
      }
    }, {
      key: "tsParseTypeParameter",
      value: function tsParseTypeParameter() {
        var node = this.startNode();
        node.name = this.parseIdentifierName(node.start);
        node.constraint = this.tsEatThenParseType(_types.types._extends);
        node["default"] = this.tsEatThenParseType(_types.types.eq);
        return this.finishNode(node, "TSTypeParameter");
      }
    }, {
      key: "tsTryParseTypeParameters",
      value: function tsTryParseTypeParameters() {
        if (this.isRelational("<")) {
          return this.tsParseTypeParameters();
        }
      }
    }, {
      key: "tsParseTypeParameters",
      value: function tsParseTypeParameters() {
        var node = this.startNode();

        if (this.isRelational("<") || this.match(_types.types.jsxTagStart)) {
          this.next();
        } else {
          this.unexpected();
        }

        node.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this),
        /* bracket */
        false,
        /* skipFirstToken */
        true);

        if (node.params.length === 0) {
          this.raise(node.start, TSErrors.EmptyTypeParameters);
        }

        return this.finishNode(node, "TSTypeParameterDeclaration");
      }
    }, {
      key: "tsTryNextParseConstantContext",
      value: function tsTryNextParseConstantContext() {
        if (this.lookahead().type === _types.types._const) {
          this.next();
          return this.tsParseTypeReference();
        }

        return null;
      } // Note: In TypeScript implementation we must provide `yieldContext` and `awaitContext`,
      // but here it's always false, because this is only used for types.

    }, {
      key: "tsFillSignature",
      value: function tsFillSignature(returnToken, signature) {
        // Arrow fns *must* have return token (`=>`). Normal functions can omit it.
        var returnTokenRequired = returnToken === _types.types.arrow;
        signature.typeParameters = this.tsTryParseTypeParameters();
        this.expect(_types.types.parenL);
        signature.parameters = this.tsParseBindingListForSignature();

        if (returnTokenRequired) {
          signature.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
        } else if (this.match(returnToken)) {
          signature.typeAnnotation = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
        }
      }
    }, {
      key: "tsParseBindingListForSignature",
      value: function tsParseBindingListForSignature() {
        var _this2 = this;

        return this.parseBindingList(_types.types.parenR, charCodes.rightParenthesis).map(function (pattern) {
          if (pattern.type !== "Identifier" && pattern.type !== "RestElement" && pattern.type !== "ObjectPattern" && pattern.type !== "ArrayPattern") {
            _this2.raise(pattern.start, TSErrors.UnsupportedSignatureParameterKind, pattern.type);
          }

          return pattern;
        });
      }
    }, {
      key: "tsParseTypeMemberSemicolon",
      value: function tsParseTypeMemberSemicolon() {
        if (!this.eat(_types.types.comma) && !this.isLineTerminator()) {
          this.expect(_types.types.semi);
        }
      }
    }, {
      key: "tsParseSignatureMember",
      value: function tsParseSignatureMember(kind, node) {
        this.tsFillSignature(_types.types.colon, node);
        this.tsParseTypeMemberSemicolon();
        return this.finishNode(node, kind);
      }
    }, {
      key: "tsIsUnambiguouslyIndexSignature",
      value: function tsIsUnambiguouslyIndexSignature() {
        this.next(); // Skip '{'

        return this.eat(_types.types.name) && this.match(_types.types.colon);
      }
    }, {
      key: "tsTryParseIndexSignature",
      value: function tsTryParseIndexSignature(node) {
        if (!(this.match(_types.types.bracketL) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this)))) {
          return undefined;
        }

        this.expect(_types.types.bracketL);
        var id = this.parseIdentifier();
        id.typeAnnotation = this.tsParseTypeAnnotation();
        this.resetEndLocation(id); // set end position to end of type

        this.expect(_types.types.bracketR);
        node.parameters = [id];
        var type = this.tsTryParseTypeAnnotation();
        if (type) node.typeAnnotation = type;
        this.tsParseTypeMemberSemicolon();
        return this.finishNode(node, "TSIndexSignature");
      }
    }, {
      key: "tsParsePropertyOrMethodSignature",
      value: function tsParsePropertyOrMethodSignature(node, readonly) {
        if (this.eat(_types.types.question)) node.optional = true;
        var nodeAny = node;

        if (this.match(_types.types.parenL) || this.isRelational("<")) {
          if (readonly) {
            this.raise(node.start, TSErrors.ReadonlyForMethodSignature);
          }

          var method = nodeAny;

          if (method.kind && this.isRelational("<")) {
            this.raise(this.state.pos, TSErrors.AccesorCannotHaveTypeParameters);
          }

          this.tsFillSignature(_types.types.colon, method);
          this.tsParseTypeMemberSemicolon();

          if (method.kind === "get") {
            if (method.parameters.length > 0) {
              this.raise(this.state.pos, _error.Errors.BadGetterArity);

              if (this.isThisParam(method.parameters[0])) {
                this.raise(this.state.pos, TSErrors.AccesorCannotDeclareThisParameter);
              }
            }
          } else if (method.kind === "set") {
            if (method.parameters.length !== 1) {
              this.raise(this.state.pos, _error.Errors.BadSetterArity);
            } else {
              var firstParameter = method.parameters[0];

              if (this.isThisParam(firstParameter)) {
                this.raise(this.state.pos, TSErrors.AccesorCannotDeclareThisParameter);
              }

              if (firstParameter.type === "Identifier" && firstParameter.optional) {
                this.raise(this.state.pos, TSErrors.SetAccesorCannotHaveOptionalParameter);
              }

              if (firstParameter.type === "RestElement") {
                this.raise(this.state.pos, TSErrors.SetAccesorCannotHaveRestParameter);
              }
            }

            if (method.typeAnnotation) {
              this.raise(method.typeAnnotation.start, TSErrors.SetAccesorCannotHaveReturnType);
            }
          } else {
            method.kind = "method";
          }

          return this.finishNode(method, "TSMethodSignature");
        } else {
          var property = nodeAny;
          if (readonly) property.readonly = true;
          var type = this.tsTryParseTypeAnnotation();
          if (type) property.typeAnnotation = type;
          this.tsParseTypeMemberSemicolon();
          return this.finishNode(property, "TSPropertySignature");
        }
      }
    }, {
      key: "tsParseTypeMember",
      value: function tsParseTypeMember() {
        var node = this.startNode();

        if (this.match(_types.types.parenL) || this.isRelational("<")) {
          return this.tsParseSignatureMember("TSCallSignatureDeclaration", node);
        }

        if (this.match(_types.types._new)) {
          var id = this.startNode();
          this.next();

          if (this.match(_types.types.parenL) || this.isRelational("<")) {
            return this.tsParseSignatureMember("TSConstructSignatureDeclaration", node);
          } else {
            node.key = this.createIdentifier(id, "new");
            return this.tsParsePropertyOrMethodSignature(node, false);
          }
        }

        this.tsParseModifiers(node, ["readonly"], ["declare", "abstract", "private", "protected", "public", "static", "override"], TSErrors.InvalidModifierOnTypeMember);
        var idx = this.tsTryParseIndexSignature(node);

        if (idx) {
          return idx;
        }

        this.parsePropertyName(node,
        /* isPrivateNameAllowed */
        false);

        if (!node.computed && node.key.type === "Identifier" && (node.key.name === "get" || node.key.name === "set") && this.tsTokenCanFollowModifier()) {
          node.kind = node.key.name;
          this.parsePropertyName(node,
          /* isPrivateNameAllowed */
          false);
        }

        return this.tsParsePropertyOrMethodSignature(node, !!node.readonly);
      }
    }, {
      key: "tsParseTypeLiteral",
      value: function tsParseTypeLiteral() {
        var node = this.startNode();
        node.members = this.tsParseObjectTypeMembers();
        return this.finishNode(node, "TSTypeLiteral");
      }
    }, {
      key: "tsParseObjectTypeMembers",
      value: function tsParseObjectTypeMembers() {
        this.expect(_types.types.braceL);
        var members = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
        this.expect(_types.types.braceR);
        return members;
      }
    }, {
      key: "tsIsStartOfMappedType",
      value: function tsIsStartOfMappedType() {
        this.next();

        if (this.eat(_types.types.plusMin)) {
          return this.isContextual("readonly");
        }

        if (this.isContextual("readonly")) {
          this.next();
        }

        if (!this.match(_types.types.bracketL)) {
          return false;
        }

        this.next();

        if (!this.tsIsIdentifier()) {
          return false;
        }

        this.next();
        return this.match(_types.types._in);
      }
    }, {
      key: "tsParseMappedTypeParameter",
      value: function tsParseMappedTypeParameter() {
        var node = this.startNode();
        node.name = this.parseIdentifierName(node.start);
        node.constraint = this.tsExpectThenParseType(_types.types._in);
        return this.finishNode(node, "TSTypeParameter");
      }
    }, {
      key: "tsParseMappedType",
      value: function tsParseMappedType() {
        var node = this.startNode();
        this.expect(_types.types.braceL);

        if (this.match(_types.types.plusMin)) {
          node.readonly = this.state.value;
          this.next();
          this.expectContextual("readonly");
        } else if (this.eatContextual("readonly")) {
          node.readonly = true;
        }

        this.expect(_types.types.bracketL);
        node.typeParameter = this.tsParseMappedTypeParameter();
        node.nameType = this.eatContextual("as") ? this.tsParseType() : null;
        this.expect(_types.types.bracketR);

        if (this.match(_types.types.plusMin)) {
          node.optional = this.state.value;
          this.next();
          this.expect(_types.types.question);
        } else if (this.eat(_types.types.question)) {
          node.optional = true;
        }

        node.typeAnnotation = this.tsTryParseType();
        this.semicolon();
        this.expect(_types.types.braceR);
        return this.finishNode(node, "TSMappedType");
      }
    }, {
      key: "tsParseTupleType",
      value: function tsParseTupleType() {
        var _this3 = this;

        var node = this.startNode();
        node.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseTupleElementType.bind(this),
        /* bracket */
        true,
        /* skipFirstToken */
        false); // Validate the elementTypes to ensure that no mandatory elements
        // follow optional elements

        var seenOptionalElement = false;
        var labeledElements = null;
        node.elementTypes.forEach(function (elementNode) {
          var _labeledElements;

          var _elementNode = elementNode,
              type = _elementNode.type;

          if (seenOptionalElement && type !== "TSRestType" && type !== "TSOptionalType" && !(type === "TSNamedTupleMember" && elementNode.optional)) {
            _this3.raise(elementNode.start, TSErrors.OptionalTypeBeforeRequired);
          } // Flow doesn't support ||=


          seenOptionalElement = seenOptionalElement || type === "TSNamedTupleMember" && elementNode.optional || type === "TSOptionalType"; // When checking labels, check the argument of the spread operator

          if (type === "TSRestType") {
            elementNode = elementNode.typeAnnotation;
            type = elementNode.type;
          }

          var isLabeled = type === "TSNamedTupleMember"; // Flow doesn't support ??=

          labeledElements = (_labeledElements = labeledElements) !== null && _labeledElements !== void 0 ? _labeledElements : isLabeled;

          if (labeledElements !== isLabeled) {
            _this3.raise(elementNode.start, TSErrors.MixedLabeledAndUnlabeledElements);
          }
        });
        return this.finishNode(node, "TSTupleType");
      }
    }, {
      key: "tsParseTupleElementType",
      value: function tsParseTupleElementType() {
        // parses `...TsType[]`
        var _this$state = this.state,
            startPos = _this$state.start,
            startLoc = _this$state.startLoc;
        var rest = this.eat(_types.types.ellipsis);
        var type = this.tsParseType();
        var optional = this.eat(_types.types.question);
        var labeled = this.eat(_types.types.colon);

        if (labeled) {
          var labeledNode = this.startNodeAtNode(type);
          labeledNode.optional = optional;

          if (type.type === "TSTypeReference" && !type.typeParameters && type.typeName.type === "Identifier") {
            labeledNode.label = type.typeName;
          } else {
            this.raise(type.start, TSErrors.InvalidTupleMemberLabel); // This produces an invalid AST, but at least we don't drop
            // nodes representing the invalid source.
            // $FlowIgnore

            labeledNode.label = type;
          }

          labeledNode.elementType = this.tsParseType();
          type = this.finishNode(labeledNode, "TSNamedTupleMember");
        } else if (optional) {
          var optionalTypeNode = this.startNodeAtNode(type);
          optionalTypeNode.typeAnnotation = type;
          type = this.finishNode(optionalTypeNode, "TSOptionalType");
        }

        if (rest) {
          var restNode = this.startNodeAt(startPos, startLoc);
          restNode.typeAnnotation = type;
          type = this.finishNode(restNode, "TSRestType");
        }

        return type;
      }
    }, {
      key: "tsParseParenthesizedType",
      value: function tsParseParenthesizedType() {
        var node = this.startNode();
        this.expect(_types.types.parenL);
        node.typeAnnotation = this.tsParseType();
        this.expect(_types.types.parenR);
        return this.finishNode(node, "TSParenthesizedType");
      }
    }, {
      key: "tsParseFunctionOrConstructorType",
      value: function tsParseFunctionOrConstructorType(type, _abstract) {
        var node = this.startNode();

        if (type === "TSConstructorType") {
          // $FlowIgnore
          node["abstract"] = !!_abstract;
          if (_abstract) this.next();
          this.next(); // eat `new`
        }

        this.tsFillSignature(_types.types.arrow, node);
        return this.finishNode(node, type);
      }
    }, {
      key: "tsParseLiteralTypeNode",
      value: function tsParseLiteralTypeNode() {
        var _this4 = this;

        var node = this.startNode();

        node.literal = function () {
          switch (_this4.state.type) {
            case _types.types.num:
            case _types.types.bigint:
            case _types.types.string:
            case _types.types._true:
            case _types.types._false:
              // For compatibility to estree we cannot call parseLiteral directly here
              return _this4.parseExprAtom();

            default:
              throw _this4.unexpected();
          }
        }();

        return this.finishNode(node, "TSLiteralType");
      }
    }, {
      key: "tsParseTemplateLiteralType",
      value: function tsParseTemplateLiteralType() {
        var node = this.startNode();
        node.literal = this.parseTemplate(false);
        return this.finishNode(node, "TSLiteralType");
      }
    }, {
      key: "parseTemplateSubstitution",
      value: function parseTemplateSubstitution() {
        if (this.state.inType) return this.tsParseType();
        return _get(_getPrototypeOf(_class.prototype), "parseTemplateSubstitution", this).call(this);
      }
    }, {
      key: "tsParseThisTypeOrThisTypePredicate",
      value: function tsParseThisTypeOrThisTypePredicate() {
        var thisKeyword = this.tsParseThisTypeNode();

        if (this.isContextual("is") && !this.hasPrecedingLineBreak()) {
          return this.tsParseThisTypePredicate(thisKeyword);
        } else {
          return thisKeyword;
        }
      }
    }, {
      key: "tsParseNonArrayType",
      value: function tsParseNonArrayType() {
        switch (this.state.type) {
          case _types.types.name:
          case _types.types._void:
          case _types.types._null:
            {
              var type = this.match(_types.types._void) ? "TSVoidKeyword" : this.match(_types.types._null) ? "TSNullKeyword" : keywordTypeFromName(this.state.value);

              if (type !== undefined && this.lookaheadCharCode() !== charCodes.dot) {
                var node = this.startNode();
                this.next();
                return this.finishNode(node, type);
              }

              return this.tsParseTypeReference();
            }

          case _types.types.string:
          case _types.types.num:
          case _types.types.bigint:
          case _types.types._true:
          case _types.types._false:
            return this.tsParseLiteralTypeNode();

          case _types.types.plusMin:
            if (this.state.value === "-") {
              var _node = this.startNode();

              var nextToken = this.lookahead();

              if (nextToken.type !== _types.types.num && nextToken.type !== _types.types.bigint) {
                throw this.unexpected();
              }

              _node.literal = this.parseMaybeUnary();
              return this.finishNode(_node, "TSLiteralType");
            }

            break;

          case _types.types._this:
            return this.tsParseThisTypeOrThisTypePredicate();

          case _types.types._typeof:
            return this.tsParseTypeQuery();

          case _types.types._import:
            return this.tsParseImportType();

          case _types.types.braceL:
            return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();

          case _types.types.bracketL:
            return this.tsParseTupleType();

          case _types.types.parenL:
            if (process.env.BABEL_8_BREAKING) {
              if (!this.options.createParenthesizedExpressions) {
                var startPos = this.state.start;
                this.next();

                var _type = this.tsParseType();

                this.expect(_types.types.parenR);
                this.addExtra(_type, "parenthesized", true);
                this.addExtra(_type, "parenStart", startPos);
                return _type;
              }
            }

            return this.tsParseParenthesizedType();

          case _types.types.backQuote:
            return this.tsParseTemplateLiteralType();
        }

        throw this.unexpected();
      }
    }, {
      key: "tsParseArrayTypeOrHigher",
      value: function tsParseArrayTypeOrHigher() {
        var type = this.tsParseNonArrayType();

        while (!this.hasPrecedingLineBreak() && this.eat(_types.types.bracketL)) {
          if (this.match(_types.types.bracketR)) {
            var node = this.startNodeAtNode(type);
            node.elementType = type;
            this.expect(_types.types.bracketR);
            type = this.finishNode(node, "TSArrayType");
          } else {
            var _node2 = this.startNodeAtNode(type);

            _node2.objectType = type;
            _node2.indexType = this.tsParseType();
            this.expect(_types.types.bracketR);
            type = this.finishNode(_node2, "TSIndexedAccessType");
          }
        }

        return type;
      }
    }, {
      key: "tsParseTypeOperator",
      value: function tsParseTypeOperator(operator) {
        var node = this.startNode();
        this.expectContextual(operator);
        node.operator = operator;
        node.typeAnnotation = this.tsParseTypeOperatorOrHigher();

        if (operator === "readonly") {
          this.tsCheckTypeAnnotationForReadOnly(node);
        }

        return this.finishNode(node, "TSTypeOperator");
      }
    }, {
      key: "tsCheckTypeAnnotationForReadOnly",
      value: function tsCheckTypeAnnotationForReadOnly(node) {
        switch (node.typeAnnotation.type) {
          case "TSTupleType":
          case "TSArrayType":
            return;

          default:
            this.raise(node.start, TSErrors.UnexpectedReadonly);
        }
      }
    }, {
      key: "tsParseInferType",
      value: function tsParseInferType() {
        var node = this.startNode();
        this.expectContextual("infer");
        var typeParameter = this.startNode();
        typeParameter.name = this.parseIdentifierName(typeParameter.start);
        node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter");
        return this.finishNode(node, "TSInferType");
      }
    }, {
      key: "tsParseTypeOperatorOrHigher",
      value: function tsParseTypeOperatorOrHigher() {
        var _this5 = this;

        var operator = ["keyof", "unique", "readonly"].find(function (kw) {
          return _this5.isContextual(kw);
        });
        return operator ? this.tsParseTypeOperator(operator) : this.isContextual("infer") ? this.tsParseInferType() : this.tsParseArrayTypeOrHigher();
      }
    }, {
      key: "tsParseUnionOrIntersectionType",
      value: function tsParseUnionOrIntersectionType(kind, parseConstituentType, operator) {
        var node = this.startNode();
        var hasLeadingOperator = this.eat(operator);
        var types = [];

        do {
          types.push(parseConstituentType());
        } while (this.eat(operator));

        if (types.length === 1 && !hasLeadingOperator) {
          return types[0];
        }

        node.types = types;
        return this.finishNode(node, kind);
      }
    }, {
      key: "tsParseIntersectionTypeOrHigher",
      value: function tsParseIntersectionTypeOrHigher() {
        return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), _types.types.bitwiseAND);
      }
    }, {
      key: "tsParseUnionTypeOrHigher",
      value: function tsParseUnionTypeOrHigher() {
        return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), _types.types.bitwiseOR);
      }
    }, {
      key: "tsIsStartOfFunctionType",
      value: function tsIsStartOfFunctionType() {
        if (this.isRelational("<")) {
          return true;
        }

        return this.match(_types.types.parenL) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
      }
    }, {
      key: "tsSkipParameterStart",
      value: function tsSkipParameterStart() {
        if (this.match(_types.types.name) || this.match(_types.types._this)) {
          this.next();
          return true;
        }

        if (this.match(_types.types.braceL)) {
          var braceStackCounter = 1;
          this.next();

          while (braceStackCounter > 0) {
            if (this.match(_types.types.braceL)) {
              ++braceStackCounter;
            } else if (this.match(_types.types.braceR)) {
              --braceStackCounter;
            }

            this.next();
          }

          return true;
        }

        if (this.match(_types.types.bracketL)) {
          var _braceStackCounter = 1;
          this.next();

          while (_braceStackCounter > 0) {
            if (this.match(_types.types.bracketL)) {
              ++_braceStackCounter;
            } else if (this.match(_types.types.bracketR)) {
              --_braceStackCounter;
            }

            this.next();
          }

          return true;
        }

        return false;
      }
    }, {
      key: "tsIsUnambiguouslyStartOfFunctionType",
      value: function tsIsUnambiguouslyStartOfFunctionType() {
        this.next();

        if (this.match(_types.types.parenR) || this.match(_types.types.ellipsis)) {
          // ( )
          // ( ...
          return true;
        }

        if (this.tsSkipParameterStart()) {
          if (this.match(_types.types.colon) || this.match(_types.types.comma) || this.match(_types.types.question) || this.match(_types.types.eq)) {
            // ( xxx :
            // ( xxx ,
            // ( xxx ?
            // ( xxx =
            return true;
          }

          if (this.match(_types.types.parenR)) {
            this.next();

            if (this.match(_types.types.arrow)) {
              // ( xxx ) =>
              return true;
            }
          }
        }

        return false;
      }
    }, {
      key: "tsParseTypeOrTypePredicateAnnotation",
      value: function tsParseTypeOrTypePredicateAnnotation(returnToken) {
        var _this6 = this;

        return this.tsInType(function () {
          var t = _this6.startNode();

          _this6.expect(returnToken);

          var node = _this6.startNode();

          var asserts = !!_this6.tsTryParse(_this6.tsParseTypePredicateAsserts.bind(_this6));

          if (asserts && _this6.match(_types.types._this)) {
            // When asserts is false, thisKeyword is handled by tsParseNonArrayType
            // : asserts this is type
            var thisTypePredicate = _this6.tsParseThisTypeOrThisTypePredicate(); // if it turns out to be a `TSThisType`, wrap it with `TSTypePredicate`
            // : asserts this


            if (thisTypePredicate.type === "TSThisType") {
              node.parameterName = thisTypePredicate;
              node.asserts = true;
              node.typeAnnotation = null;
              thisTypePredicate = _this6.finishNode(node, "TSTypePredicate");
            } else {
              _this6.resetStartLocationFromNode(thisTypePredicate, node);

              thisTypePredicate.asserts = true;
            }

            t.typeAnnotation = thisTypePredicate;
            return _this6.finishNode(t, "TSTypeAnnotation");
          }

          var typePredicateVariable = _this6.tsIsIdentifier() && _this6.tsTryParse(_this6.tsParseTypePredicatePrefix.bind(_this6));

          if (!typePredicateVariable) {
            if (!asserts) {
              // : type
              return _this6.tsParseTypeAnnotation(
              /* eatColon */
              false, t);
            } // : asserts foo


            node.parameterName = _this6.parseIdentifier();
            node.asserts = asserts;
            node.typeAnnotation = null;
            t.typeAnnotation = _this6.finishNode(node, "TSTypePredicate");
            return _this6.finishNode(t, "TSTypeAnnotation");
          } // : asserts foo is type


          var type = _this6.tsParseTypeAnnotation(
          /* eatColon */
          false);

          node.parameterName = typePredicateVariable;
          node.typeAnnotation = type;
          node.asserts = asserts;
          t.typeAnnotation = _this6.finishNode(node, "TSTypePredicate");
          return _this6.finishNode(t, "TSTypeAnnotation");
        });
      }
    }, {
      key: "tsTryParseTypeOrTypePredicateAnnotation",
      value: function tsTryParseTypeOrTypePredicateAnnotation() {
        return this.match(_types.types.colon) ? this.tsParseTypeOrTypePredicateAnnotation(_types.types.colon) : undefined;
      }
    }, {
      key: "tsTryParseTypeAnnotation",
      value: function tsTryParseTypeAnnotation() {
        return this.match(_types.types.colon) ? this.tsParseTypeAnnotation() : undefined;
      }
    }, {
      key: "tsTryParseType",
      value: function tsTryParseType() {
        return this.tsEatThenParseType(_types.types.colon);
      }
    }, {
      key: "tsParseTypePredicatePrefix",
      value: function tsParseTypePredicatePrefix() {
        var id = this.parseIdentifier();

        if (this.isContextual("is") && !this.hasPrecedingLineBreak()) {
          this.next();
          return id;
        }
      }
    }, {
      key: "tsParseTypePredicateAsserts",
      value: function tsParseTypePredicateAsserts() {
        if (!this.match(_types.types.name) || this.state.value !== "asserts" || this.hasPrecedingLineBreak()) {
          return false;
        }

        var containsEsc = this.state.containsEsc;
        this.next();

        if (!this.match(_types.types.name) && !this.match(_types.types._this)) {
          return false;
        }

        if (containsEsc) {
          this.raise(this.state.lastTokStart, _error.Errors.InvalidEscapedReservedWord, "asserts");
        }

        return true;
      }
    }, {
      key: "tsParseTypeAnnotation",
      value: function tsParseTypeAnnotation() {
        var _this7 = this;

        var eatColon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.startNode();
        this.tsInType(function () {
          if (eatColon) _this7.expect(_types.types.colon);
          t.typeAnnotation = _this7.tsParseType();
        });
        return this.finishNode(t, "TSTypeAnnotation");
      }
      /** Be sure to be in a type context before calling this, using `tsInType`. */

    }, {
      key: "tsParseType",
      value: function tsParseType() {
        // Need to set `state.inType` so that we don't parse JSX in a type context.
        assert(this.state.inType);
        var type = this.tsParseNonConditionalType();

        if (this.hasPrecedingLineBreak() || !this.eat(_types.types._extends)) {
          return type;
        }

        var node = this.startNodeAtNode(type);
        node.checkType = type;
        node.extendsType = this.tsParseNonConditionalType();
        this.expect(_types.types.question);
        node.trueType = this.tsParseType();
        this.expect(_types.types.colon);
        node.falseType = this.tsParseType();
        return this.finishNode(node, "TSConditionalType");
      }
    }, {
      key: "isAbstractConstructorSignature",
      value: function isAbstractConstructorSignature() {
        return this.isContextual("abstract") && this.lookahead().type === _types.types._new;
      }
    }, {
      key: "tsParseNonConditionalType",
      value: function tsParseNonConditionalType() {
        if (this.tsIsStartOfFunctionType()) {
          return this.tsParseFunctionOrConstructorType("TSFunctionType");
        }

        if (this.match(_types.types._new)) {
          // As in `new () => Date`
          return this.tsParseFunctionOrConstructorType("TSConstructorType");
        } else if (this.isAbstractConstructorSignature()) {
          // As in `abstract new () => Date`
          return this.tsParseFunctionOrConstructorType("TSConstructorType",
          /* abstract */
          true);
        }

        return this.tsParseUnionTypeOrHigher();
      }
    }, {
      key: "tsParseTypeAssertion",
      value: function tsParseTypeAssertion() {
        var node = this.startNode();

        var _const = this.tsTryNextParseConstantContext();

        node.typeAnnotation = _const || this.tsNextThenParseType();
        this.expectRelational(">");
        node.expression = this.parseMaybeUnary();
        return this.finishNode(node, "TSTypeAssertion");
      }
    }, {
      key: "tsParseHeritageClause",
      value: function tsParseHeritageClause(descriptor) {
        var originalStart = this.state.start;
        var delimitedList = this.tsParseDelimitedList("HeritageClauseElement", this.tsParseExpressionWithTypeArguments.bind(this));

        if (!delimitedList.length) {
          this.raise(originalStart, TSErrors.EmptyHeritageClauseType, descriptor);
        }

        return delimitedList;
      }
    }, {
      key: "tsParseExpressionWithTypeArguments",
      value: function tsParseExpressionWithTypeArguments() {
        var node = this.startNode(); // Note: TS uses parseLeftHandSideExpressionOrHigher,
        // then has grammar errors later if it's not an EntityName.

        node.expression = this.tsParseEntityName(
        /* allowReservedWords */
        false);

        if (this.isRelational("<")) {
          node.typeParameters = this.tsParseTypeArguments();
        }

        return this.finishNode(node, "TSExpressionWithTypeArguments");
      }
    }, {
      key: "tsParseInterfaceDeclaration",
      value: function tsParseInterfaceDeclaration(node) {
        node.id = this.parseIdentifier();
        this.checkLVal(node.id, "typescript interface declaration", _scopeflags.BIND_TS_INTERFACE);
        node.typeParameters = this.tsTryParseTypeParameters();

        if (this.eat(_types.types._extends)) {
          node["extends"] = this.tsParseHeritageClause("extends");
        }

        var body = this.startNode();
        body.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this));
        node.body = this.finishNode(body, "TSInterfaceBody");
        return this.finishNode(node, "TSInterfaceDeclaration");
      }
    }, {
      key: "tsParseTypeAliasDeclaration",
      value: function tsParseTypeAliasDeclaration(node) {
        var _this8 = this;

        node.id = this.parseIdentifier();
        this.checkLVal(node.id, "typescript type alias", _scopeflags.BIND_TS_TYPE);
        node.typeParameters = this.tsTryParseTypeParameters();
        node.typeAnnotation = this.tsInType(function () {
          _this8.expect(_types.types.eq);

          if (_this8.isContextual("intrinsic") && _this8.lookahead().type !== _types.types.dot) {
            var _node3 = _this8.startNode();

            _this8.next();

            return _this8.finishNode(_node3, "TSIntrinsicKeyword");
          }

          return _this8.tsParseType();
        });
        this.semicolon();
        return this.finishNode(node, "TSTypeAliasDeclaration");
      }
    }, {
      key: "tsInNoContext",
      value: function tsInNoContext(cb) {
        var oldContext = this.state.context;
        this.state.context = [oldContext[0]];

        try {
          return cb();
        } finally {
          this.state.context = oldContext;
        }
      }
      /**
       * Runs `cb` in a type context.
       * This should be called one token *before* the first type token,
       * so that the call to `next()` is run in type context.
       */

    }, {
      key: "tsInType",
      value: function tsInType(cb) {
        var oldInType = this.state.inType;
        this.state.inType = true;

        try {
          return cb();
        } finally {
          this.state.inType = oldInType;
        }
      }
    }, {
      key: "tsEatThenParseType",
      value: function tsEatThenParseType(token) {
        return !this.match(token) ? undefined : this.tsNextThenParseType();
      }
    }, {
      key: "tsExpectThenParseType",
      value: function tsExpectThenParseType(token) {
        var _this9 = this;

        return this.tsDoThenParseType(function () {
          return _this9.expect(token);
        });
      }
    }, {
      key: "tsNextThenParseType",
      value: function tsNextThenParseType() {
        var _this10 = this;

        return this.tsDoThenParseType(function () {
          return _this10.next();
        });
      }
    }, {
      key: "tsDoThenParseType",
      value: function tsDoThenParseType(cb) {
        var _this11 = this;

        return this.tsInType(function () {
          cb();
          return _this11.tsParseType();
        });
      }
    }, {
      key: "tsParseEnumMember",
      value: function tsParseEnumMember() {
        var node = this.startNode(); // Computed property names are grammar errors in an enum, so accept just string literal or identifier.

        node.id = this.match(_types.types.string) ? this.parseExprAtom() : this.parseIdentifier(
        /* liberal */
        true);

        if (this.eat(_types.types.eq)) {
          node.initializer = this.parseMaybeAssignAllowIn();
        }

        return this.finishNode(node, "TSEnumMember");
      }
    }, {
      key: "tsParseEnumDeclaration",
      value: function tsParseEnumDeclaration(node, isConst) {
        if (isConst) node["const"] = true;
        node.id = this.parseIdentifier();
        this.checkLVal(node.id, "typescript enum declaration", isConst ? _scopeflags.BIND_TS_CONST_ENUM : _scopeflags.BIND_TS_ENUM);
        this.expect(_types.types.braceL);
        node.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this));
        this.expect(_types.types.braceR);
        return this.finishNode(node, "TSEnumDeclaration");
      }
    }, {
      key: "tsParseModuleBlock",
      value: function tsParseModuleBlock() {
        var node = this.startNode();
        this.scope.enter(_scopeflags.SCOPE_OTHER);
        this.expect(_types.types.braceL); // Inside of a module block is considered "top-level", meaning it can have imports and exports.

        this.parseBlockOrModuleBlockBody(node.body = [],
        /* directives */
        undefined,
        /* topLevel */
        true,
        /* end */
        _types.types.braceR);
        this.scope.exit();
        return this.finishNode(node, "TSModuleBlock");
      }
    }, {
      key: "tsParseModuleOrNamespaceDeclaration",
      value: function tsParseModuleOrNamespaceDeclaration(node) {
        var nested = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        node.id = this.parseIdentifier();

        if (!nested) {
          this.checkLVal(node.id, "module or namespace declaration", _scopeflags.BIND_TS_NAMESPACE);
        }

        if (this.eat(_types.types.dot)) {
          var inner = this.startNode();
          this.tsParseModuleOrNamespaceDeclaration(inner, true);
          node.body = inner;
        } else {
          this.scope.enter(_scopeflags.SCOPE_TS_MODULE);
          this.prodParam.enter(_productionParameter.PARAM);
          node.body = this.tsParseModuleBlock();
          this.prodParam.exit();
          this.scope.exit();
        }

        return this.finishNode(node, "TSModuleDeclaration");
      }
    }, {
      key: "tsParseAmbientExternalModuleDeclaration",
      value: function tsParseAmbientExternalModuleDeclaration(node) {
        if (this.isContextual("global")) {
          node.global = true;
          node.id = this.parseIdentifier();
        } else if (this.match(_types.types.string)) {
          node.id = this.parseExprAtom();
        } else {
          this.unexpected();
        }

        if (this.match(_types.types.braceL)) {
          this.scope.enter(_scopeflags.SCOPE_TS_MODULE);
          this.prodParam.enter(_productionParameter.PARAM);
          node.body = this.tsParseModuleBlock();
          this.prodParam.exit();
          this.scope.exit();
        } else {
          this.semicolon();
        }

        return this.finishNode(node, "TSModuleDeclaration");
      }
    }, {
      key: "tsParseImportEqualsDeclaration",
      value: function tsParseImportEqualsDeclaration(node, isExport) {
        node.isExport = isExport || false;
        node.id = this.parseIdentifier();
        this.checkLVal(node.id, "import equals declaration", _scopeflags.BIND_LEXICAL);
        this.expect(_types.types.eq);
        var moduleReference = this.tsParseModuleReference();

        if (node.importKind === "type" && moduleReference.type !== "TSExternalModuleReference") {
          this.raise(moduleReference.start, TSErrors.ImportAliasHasImportType);
        }

        node.moduleReference = moduleReference;
        this.semicolon();
        return this.finishNode(node, "TSImportEqualsDeclaration");
      }
    }, {
      key: "tsIsExternalModuleReference",
      value: function tsIsExternalModuleReference() {
        return this.isContextual("require") && this.lookaheadCharCode() === charCodes.leftParenthesis;
      }
    }, {
      key: "tsParseModuleReference",
      value: function tsParseModuleReference() {
        return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(
        /* allowReservedWords */
        false);
      }
    }, {
      key: "tsParseExternalModuleReference",
      value: function tsParseExternalModuleReference() {
        var node = this.startNode();
        this.expectContextual("require");
        this.expect(_types.types.parenL);

        if (!this.match(_types.types.string)) {
          throw this.unexpected();
        } // For compatibility to estree we cannot call parseLiteral directly here


        node.expression = this.parseExprAtom();
        this.expect(_types.types.parenR);
        return this.finishNode(node, "TSExternalModuleReference");
      } // Utilities

    }, {
      key: "tsLookAhead",
      value: function tsLookAhead(f) {
        var state = this.state.clone();
        var res = f();
        this.state = state;
        return res;
      }
    }, {
      key: "tsTryParseAndCatch",
      value: function tsTryParseAndCatch(f) {
        var result = this.tryParse(function (abort) {
          return f() || abort();
        });
        if (result.aborted || !result.node) return undefined;
        if (result.error) this.state = result.failState;
        return result.node;
      }
    }, {
      key: "tsTryParse",
      value: function tsTryParse(f) {
        var state = this.state.clone();
        var result = f();

        if (result !== undefined && result !== false) {
          return result;
        } else {
          this.state = state;
          return undefined;
        }
      }
    }, {
      key: "tsTryParseDeclare",
      value: function tsTryParseDeclare(nany) {
        var _this12 = this;

        if (this.isLineTerminator()) {
          return;
        }

        var starttype = this.state.type;
        var kind;

        if (this.isContextual("let")) {
          starttype = _types.types._var;
          kind = "let";
        }

        return this.tsInAmbientContext(function () {
          switch (starttype) {
            case _types.types._function:
              nany.declare = true;
              return _this12.parseFunctionStatement(nany,
              /* async */
              false,
              /* declarationPosition */
              true);

            case _types.types._class:
              // While this is also set by tsParseExpressionStatement, we need to set it
              // before parsing the class declaration to now how to register it in the scope.
              nany.declare = true;
              return _this12.parseClass(nany,
              /* isStatement */
              true,
              /* optionalId */
              false);

            case _types.types._const:
              if (_this12.match(_types.types._const) && _this12.isLookaheadContextual("enum")) {
                // `const enum = 0;` not allowed because "enum" is a strict mode reserved word.
                _this12.expect(_types.types._const);

                _this12.expectContextual("enum");

                return _this12.tsParseEnumDeclaration(nany,
                /* isConst */
                true);
              }

            // falls through

            case _types.types._var:
              kind = kind || _this12.state.value;
              return _this12.parseVarStatement(nany, kind);

            case _types.types.name:
              {
                var value = _this12.state.value;

                if (value === "global") {
                  return _this12.tsParseAmbientExternalModuleDeclaration(nany);
                } else {
                  return _this12.tsParseDeclaration(nany, value,
                  /* next */
                  true);
                }
              }
          }
        });
      } // Note this won't be called unless the keyword is allowed in `shouldParseExportDeclaration`.

    }, {
      key: "tsTryParseExportDeclaration",
      value: function tsTryParseExportDeclaration() {
        return this.tsParseDeclaration(this.startNode(), this.state.value,
        /* next */
        true);
      }
    }, {
      key: "tsParseExpressionStatement",
      value: function tsParseExpressionStatement(node, expr) {
        switch (expr.name) {
          case "declare":
            {
              var declaration = this.tsTryParseDeclare(node);

              if (declaration) {
                declaration.declare = true;
                return declaration;
              }

              break;
            }

          case "global":
            // `global { }` (with no `declare`) may appear inside an ambient module declaration.
            // Would like to use tsParseAmbientExternalModuleDeclaration here, but already ran past "global".
            if (this.match(_types.types.braceL)) {
              this.scope.enter(_scopeflags.SCOPE_TS_MODULE);
              this.prodParam.enter(_productionParameter.PARAM);
              var mod = node;
              mod.global = true;
              mod.id = expr;
              mod.body = this.tsParseModuleBlock();
              this.scope.exit();
              this.prodParam.exit();
              return this.finishNode(mod, "TSModuleDeclaration");
            }

            break;

          default:
            return this.tsParseDeclaration(node, expr.name,
            /* next */
            false);
        }
      } // Common to tsTryParseDeclare, tsTryParseExportDeclaration, and tsParseExpressionStatement.

    }, {
      key: "tsParseDeclaration",
      value: function tsParseDeclaration(node, value, next) {
        // no declaration apart from enum can be followed by a line break.
        switch (value) {
          case "abstract":
            if (this.tsCheckLineTerminator(next) && (this.match(_types.types._class) || this.match(_types.types.name))) {
              return this.tsParseAbstractDeclaration(node);
            }

            break;

          case "enum":
            if (next || this.match(_types.types.name)) {
              if (next) this.next();
              return this.tsParseEnumDeclaration(node,
              /* isConst */
              false);
            }

            break;

          case "interface":
            if (this.tsCheckLineTerminator(next) && this.match(_types.types.name)) {
              return this.tsParseInterfaceDeclaration(node);
            }

            break;

          case "module":
            if (this.tsCheckLineTerminator(next)) {
              if (this.match(_types.types.string)) {
                return this.tsParseAmbientExternalModuleDeclaration(node);
              } else if (this.match(_types.types.name)) {
                return this.tsParseModuleOrNamespaceDeclaration(node);
              }
            }

            break;

          case "namespace":
            if (this.tsCheckLineTerminator(next) && this.match(_types.types.name)) {
              return this.tsParseModuleOrNamespaceDeclaration(node);
            }

            break;

          case "type":
            if (this.tsCheckLineTerminator(next) && this.match(_types.types.name)) {
              return this.tsParseTypeAliasDeclaration(node);
            }

            break;
        }
      }
    }, {
      key: "tsCheckLineTerminator",
      value: function tsCheckLineTerminator(next) {
        if (next) {
          if (this.hasFollowingLineBreak()) return false;
          this.next();
          return true;
        }

        return !this.isLineTerminator();
      }
    }, {
      key: "tsTryParseGenericAsyncArrowFunction",
      value: function tsTryParseGenericAsyncArrowFunction(startPos, startLoc) {
        var _this13 = this;

        if (!this.isRelational("<")) {
          return undefined;
        }

        var oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
        this.state.maybeInArrowParameters = true;
        var res = this.tsTryParseAndCatch(function () {
          var node = _this13.startNodeAt(startPos, startLoc);

          node.typeParameters = _this13.tsParseTypeParameters(); // Don't use overloaded parseFunctionParams which would look for "<" again.

          _get(_getPrototypeOf(_class.prototype), "parseFunctionParams", _this13).call(_this13, node);

          node.returnType = _this13.tsTryParseTypeOrTypePredicateAnnotation();

          _this13.expect(_types.types.arrow);

          return node;
        });
        this.state.maybeInArrowParameters = oldMaybeInArrowParameters;

        if (!res) {
          return undefined;
        }

        return this.parseArrowExpression(res,
        /* params are already set */
        null,
        /* async */
        true);
      }
    }, {
      key: "tsParseTypeArguments",
      value: function tsParseTypeArguments() {
        var _this14 = this;

        var node = this.startNode();
        node.params = this.tsInType(function () {
          return (// Temporarily remove a JSX parsing context, which makes us scan different tokens.
            _this14.tsInNoContext(function () {
              _this14.expectRelational("<");

              return _this14.tsParseDelimitedList("TypeParametersOrArguments", _this14.tsParseType.bind(_this14));
            })
          );
        });

        if (node.params.length === 0) {
          this.raise(node.start, TSErrors.EmptyTypeArguments);
        }

        this.expectRelational(">");
        return this.finishNode(node, "TSTypeParameterInstantiation");
      }
    }, {
      key: "tsIsDeclarationStart",
      value: function tsIsDeclarationStart() {
        if (this.match(_types.types.name)) {
          switch (this.state.value) {
            case "abstract":
            case "declare":
            case "enum":
            case "interface":
            case "module":
            case "namespace":
            case "type":
              return true;
          }
        }

        return false;
      } // ======================================================
      // OVERRIDES
      // ======================================================

    }, {
      key: "isExportDefaultSpecifier",
      value: function isExportDefaultSpecifier() {
        if (this.tsIsDeclarationStart()) return false;
        return _get(_getPrototypeOf(_class.prototype), "isExportDefaultSpecifier", this).call(this);
      }
    }, {
      key: "parseAssignableListItem",
      value: function parseAssignableListItem(allowModifiers, decorators) {
        // Store original location/position to include modifiers in range
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        var accessibility;
        var readonly = false;
        var override = false;

        if (allowModifiers !== undefined) {
          var modified = {};
          this.tsParseModifiers(modified, ["public", "private", "protected", "override", "readonly"]);
          accessibility = modified.accessibility;
          override = modified.override;
          readonly = modified.readonly;

          if (allowModifiers === false && (accessibility || readonly || override)) {
            this.raise(startPos, TSErrors.UnexpectedParameterModifier);
          }
        }

        var left = this.parseMaybeDefault();
        this.parseAssignableListItemTypes(left);
        var elt = this.parseMaybeDefault(left.start, left.loc.start, left);

        if (accessibility || readonly || override) {
          var pp = this.startNodeAt(startPos, startLoc);

          if (decorators.length) {
            pp.decorators = decorators;
          }

          if (accessibility) pp.accessibility = accessibility;
          if (readonly) pp.readonly = readonly;
          if (override) pp.override = override;

          if (elt.type !== "Identifier" && elt.type !== "AssignmentPattern") {
            this.raise(pp.start, TSErrors.UnsupportedParameterPropertyKind);
          }

          pp.parameter = elt;
          return this.finishNode(pp, "TSParameterProperty");
        }

        if (decorators.length) {
          left.decorators = decorators;
        }

        return elt;
      }
    }, {
      key: "parseFunctionBodyAndFinish",
      value: function parseFunctionBodyAndFinish(node, type) {
        var isMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (this.match(_types.types.colon)) {
          node.returnType = this.tsParseTypeOrTypePredicateAnnotation(_types.types.colon);
        }

        var bodilessType = type === "FunctionDeclaration" ? "TSDeclareFunction" : type === "ClassMethod" ? "TSDeclareMethod" : undefined;

        if (bodilessType && !this.match(_types.types.braceL) && this.isLineTerminator()) {
          this.finishNode(node, bodilessType);
          return;
        }

        if (bodilessType === "TSDeclareFunction" && this.state.isAmbientContext) {
          this.raise(node.start, TSErrors.DeclareFunctionHasImplementation);

          if ( // $FlowIgnore
          node.declare) {
            _get(_getPrototypeOf(_class.prototype), "parseFunctionBodyAndFinish", this).call(this, node, bodilessType, isMethod);

            return;
          }
        }

        _get(_getPrototypeOf(_class.prototype), "parseFunctionBodyAndFinish", this).call(this, node, type, isMethod);
      }
    }, {
      key: "registerFunctionStatementId",
      value: function registerFunctionStatementId(node) {
        if (!node.body && node.id) {
          // Function ids are validated after parsing their body.
          // For bodyless function, we need to do it here.
          this.checkLVal(node.id, "function name", _scopeflags.BIND_TS_AMBIENT);
        } else {
          _get(_getPrototypeOf(_class.prototype), "registerFunctionStatementId", this).apply(this, arguments);
        }
      }
    }, {
      key: "tsCheckForInvalidTypeCasts",
      value: function tsCheckForInvalidTypeCasts(items) {
        var _this15 = this;

        items.forEach(function (node) {
          if ((node === null || node === void 0 ? void 0 : node.type) === "TSTypeCastExpression") {
            _this15.raise(node.typeAnnotation.start, TSErrors.UnexpectedTypeAnnotation);
          }
        });
      }
    }, {
      key: "toReferencedList",
      value: function toReferencedList(exprList, isInParens) {
        // Handles invalid scenarios like: `f(a:b)`, `(a:b);`, and `(a:b,c:d)`.
        //
        // Note that `f<T>(a:b)` goes through a different path and is handled
        // in `parseSubscript` directly.
        this.tsCheckForInvalidTypeCasts(exprList);
        return exprList;
      }
    }, {
      key: "parseArrayLike",
      value: function parseArrayLike() {
        var _get2;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var node = (_get2 = _get(_getPrototypeOf(_class.prototype), "parseArrayLike", this)).call.apply(_get2, [this].concat(args));

        if (node.type === "ArrayExpression") {
          this.tsCheckForInvalidTypeCasts(node.elements);
        }

        return node;
      }
    }, {
      key: "parseSubscript",
      value: function parseSubscript(base, startPos, startLoc, noCalls, state) {
        var _this16 = this;

        if (!this.hasPrecedingLineBreak() && this.match(_types.types.bang)) {
          // When ! is consumed as a postfix operator (non-null assertion),
          // disallow JSX tag forming after. e.g. When parsing `p! < n.p!`
          // `<n.p` can not be a start of JSX tag
          this.state.exprAllowed = false;
          this.next();
          var nonNullExpression = this.startNodeAt(startPos, startLoc);
          nonNullExpression.expression = base;
          return this.finishNode(nonNullExpression, "TSNonNullExpression");
        }

        if (this.isRelational("<")) {
          // tsTryParseAndCatch is expensive, so avoid if not necessary.
          // There are number of things we are going to "maybe" parse, like type arguments on
          // tagged template expressions. If any of them fail, walk it back and continue.
          var result = this.tsTryParseAndCatch(function () {
            if (!noCalls && _this16.atPossibleAsyncArrow(base)) {
              // Almost certainly this is a generic async function `async <T>() => ...
              // But it might be a call with a type argument `async<T>();`
              var asyncArrowFn = _this16.tsTryParseGenericAsyncArrowFunction(startPos, startLoc);

              if (asyncArrowFn) {
                return asyncArrowFn;
              }
            }

            var node = _this16.startNodeAt(startPos, startLoc);

            node.callee = base;

            var typeArguments = _this16.tsParseTypeArguments();

            if (typeArguments) {
              if (!noCalls && _this16.eat(_types.types.parenL)) {
                // possibleAsync always false here, because we would have handled it above.
                // $FlowIgnore (won't be any undefined arguments)
                node.arguments = _this16.parseCallExpressionArguments(_types.types.parenR,
                /* possibleAsync */
                false); // Handles invalid case: `f<T>(a:b)`

                _this16.tsCheckForInvalidTypeCasts(node.arguments);

                node.typeParameters = typeArguments;

                if (state.optionalChainMember) {
                  // $FlowIgnore
                  node.optional = false;
                }

                return _this16.finishCallExpression(node, state.optionalChainMember);
              } else if (_this16.match(_types.types.backQuote)) {
                var _result = _this16.parseTaggedTemplateExpression(base, startPos, startLoc, state);

                _result.typeParameters = typeArguments;
                return _result;
              }
            }

            _this16.unexpected();
          });
          if (result) return result;
        }

        return _get(_getPrototypeOf(_class.prototype), "parseSubscript", this).call(this, base, startPos, startLoc, noCalls, state);
      }
    }, {
      key: "parseNewArguments",
      value: function parseNewArguments(node) {
        var _this17 = this;

        if (this.isRelational("<")) {
          // tsTryParseAndCatch is expensive, so avoid if not necessary.
          // 99% certain this is `new C<T>();`. But may be `new C < T;`, which is also legal.
          var typeParameters = this.tsTryParseAndCatch(function () {
            var args = _this17.tsParseTypeArguments();

            if (!_this17.match(_types.types.parenL)) _this17.unexpected();
            return args;
          });

          if (typeParameters) {
            node.typeParameters = typeParameters;
          }
        }

        _get(_getPrototypeOf(_class.prototype), "parseNewArguments", this).call(this, node);
      }
    }, {
      key: "parseExprOp",
      value: function parseExprOp(left, leftStartPos, leftStartLoc, minPrec) {
        if (nonNull(_types.types._in.binop) > minPrec && !this.hasPrecedingLineBreak() && this.isContextual("as")) {
          var node = this.startNodeAt(leftStartPos, leftStartLoc);
          node.expression = left;

          var _const = this.tsTryNextParseConstantContext();

          if (_const) {
            node.typeAnnotation = _const;
          } else {
            node.typeAnnotation = this.tsNextThenParseType();
          }

          this.finishNode(node, "TSAsExpression"); // rescan `<`, `>` because they were scanned when this.state.inType was true

          this.reScan_lt_gt();
          return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec);
        }

        return _get(_getPrototypeOf(_class.prototype), "parseExprOp", this).call(this, left, leftStartPos, leftStartLoc, minPrec);
      }
    }, {
      key: "checkReservedWord",
      value: function checkReservedWord(word, // eslint-disable-line no-unused-vars
      startLoc, // eslint-disable-line no-unused-vars
      checkKeywords, // eslint-disable-line no-unused-vars
      // eslint-disable-next-line no-unused-vars
      isBinding) {// Don't bother checking for TypeScript code.
        // Strict mode words may be allowed as in `declare namespace N { const static: number; }`.
        // And we have a type checker anyway, so don't bother having the parser do it.
      }
      /*
      Don't bother doing this check in TypeScript code because:
      1. We may have a nested export statement with the same name:
        export const x = 0;
        export namespace N {
          export const x = 1;
        }
      2. We have a type checker to warn us about this sort of thing.
      */

    }, {
      key: "checkDuplicateExports",
      value: function checkDuplicateExports() {}
    }, {
      key: "parseImport",
      value: function parseImport(node) {
        node.importKind = "value";

        if (this.match(_types.types.name) || this.match(_types.types.star) || this.match(_types.types.braceL)) {
          var ahead = this.lookahead();

          if (this.isContextual("type") && // import type, { a } from "b";
          ahead.type !== _types.types.comma && // import type from "a";
          !(ahead.type === _types.types.name && ahead.value === "from") && // import type = require("a");
          ahead.type !== _types.types.eq) {
            node.importKind = "type";
            this.next();
            ahead = this.lookahead();
          }

          if (this.match(_types.types.name) && ahead.type === _types.types.eq) {
            return this.tsParseImportEqualsDeclaration(node);
          }
        }

        var importNode = _get(_getPrototypeOf(_class.prototype), "parseImport", this).call(this, node);
        /*:: invariant(importNode.type !== "TSImportEqualsDeclaration") */
        // `import type` can only be used on imports with named imports or with a
        // default import - but not both


        if (importNode.importKind === "type" && importNode.specifiers.length > 1 && importNode.specifiers[0].type === "ImportDefaultSpecifier") {
          this.raise(importNode.start, TSErrors.TypeImportCannotSpecifyDefaultAndNamed);
        }

        return importNode;
      }
    }, {
      key: "parseExport",
      value: function parseExport(node) {
        if (this.match(_types.types._import)) {
          // `export import A = B;`
          this.next(); // eat `tt._import`

          if (this.isContextual("type") && this.lookaheadCharCode() !== charCodes.equalsTo) {
            node.importKind = "type";
            this.next(); // eat "type"
          } else {
            node.importKind = "value";
          }

          return this.tsParseImportEqualsDeclaration(node,
          /* isExport */
          true);
        } else if (this.eat(_types.types.eq)) {
          // `export = x;`
          var assign = node;
          assign.expression = this.parseExpression();
          this.semicolon();
          return this.finishNode(assign, "TSExportAssignment");
        } else if (this.eatContextual("as")) {
          // `export as namespace A;`
          var decl = node; // See `parseNamespaceExportDeclaration` in TypeScript's own parser

          this.expectContextual("namespace");
          decl.id = this.parseIdentifier();
          this.semicolon();
          return this.finishNode(decl, "TSNamespaceExportDeclaration");
        } else {
          if (this.isContextual("type") && this.lookahead().type === _types.types.braceL) {
            this.next();
            node.exportKind = "type";
          } else {
            node.exportKind = "value";
          }

          return _get(_getPrototypeOf(_class.prototype), "parseExport", this).call(this, node);
        }
      }
    }, {
      key: "isAbstractClass",
      value: function isAbstractClass() {
        return this.isContextual("abstract") && this.lookahead().type === _types.types._class;
      }
    }, {
      key: "parseExportDefaultExpression",
      value: function parseExportDefaultExpression() {
        if (this.isAbstractClass()) {
          var cls = this.startNode();
          this.next(); // Skip "abstract"

          cls["abstract"] = true;
          this.parseClass(cls, true, true);
          return cls;
        } // export default interface allowed in:
        // https://github.com/Microsoft/TypeScript/pull/16040


        if (this.state.value === "interface") {
          var result = this.tsParseDeclaration(this.startNode(), this.state.value, true);
          if (result) return result;
        }

        return _get(_getPrototypeOf(_class.prototype), "parseExportDefaultExpression", this).call(this);
      }
    }, {
      key: "parseStatementContent",
      value: function parseStatementContent(context, topLevel) {
        if (this.state.type === _types.types._const) {
          var ahead = this.lookahead();

          if (ahead.type === _types.types.name && ahead.value === "enum") {
            var node = this.startNode();
            this.expect(_types.types._const);
            this.expectContextual("enum");
            return this.tsParseEnumDeclaration(node,
            /* isConst */
            true);
          }
        }

        return _get(_getPrototypeOf(_class.prototype), "parseStatementContent", this).call(this, context, topLevel);
      }
    }, {
      key: "parseAccessModifier",
      value: function parseAccessModifier() {
        return this.tsParseModifier(["public", "protected", "private"]);
      }
    }, {
      key: "tsHasSomeModifiers",
      value: function tsHasSomeModifiers(member, modifiers) {
        return modifiers.some(function (modifier) {
          if (tsIsAccessModifier(modifier)) {
            return member.accessibility === modifier;
          }

          return !!member[modifier];
        });
      }
    }, {
      key: "parseClassMember",
      value: function parseClassMember(classBody, member, state) {
        var _this18 = this;

        var invalidModifersForStaticBlocks = ["declare", "private", "public", "protected", "override", "abstract", "readonly"];
        this.tsParseModifiers(member, invalidModifersForStaticBlocks.concat(["static"]));

        var callParseClassMemberWithIsStatic = function callParseClassMemberWithIsStatic() {
          var isStatic = !!member["static"];

          if (isStatic && _this18.eat(_types.types.braceL)) {
            if (_this18.tsHasSomeModifiers(member, invalidModifersForStaticBlocks)) {
              _this18.raise(_this18.state.pos, TSErrors.StaticBlockCannotHaveModifier);
            }

            _this18.parseClassStaticBlock(classBody, member);
          } else {
            _this18.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
          }
        };

        if (member.declare) {
          this.tsInAmbientContext(callParseClassMemberWithIsStatic);
        } else {
          callParseClassMemberWithIsStatic();
        }
      }
    }, {
      key: "parseClassMemberWithIsStatic",
      value: function parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
        var idx = this.tsTryParseIndexSignature(member);

        if (idx) {
          classBody.body.push(idx);

          if (member["abstract"]) {
            this.raise(member.start, TSErrors.IndexSignatureHasAbstract);
          }

          if (member.accessibility) {
            this.raise(member.start, TSErrors.IndexSignatureHasAccessibility, member.accessibility);
          }

          if (member.declare) {
            this.raise(member.start, TSErrors.IndexSignatureHasDeclare);
          }

          if (member.override) {
            this.raise(member.start, TSErrors.IndexSignatureHasOverride);
          }

          return;
        }

        if (!this.state.inAbstractClass && member["abstract"]) {
          this.raise(member.start, TSErrors.NonAbstractClassHasAbstractMethod);
        }

        if (member.override) {
          if (!state.hadSuperClass) {
            this.raise(member.start, TSErrors.OverrideNotInSubClass);
          }
        }
        /*:: invariant(member.type !== "TSIndexSignature") */


        _get(_getPrototypeOf(_class.prototype), "parseClassMemberWithIsStatic", this).call(this, classBody, member, state, isStatic);
      }
    }, {
      key: "parsePostMemberNameModifiers",
      value: function parsePostMemberNameModifiers(methodOrProp) {
        var optional = this.eat(_types.types.question);
        if (optional) methodOrProp.optional = true;

        if (methodOrProp.readonly && this.match(_types.types.parenL)) {
          this.raise(methodOrProp.start, TSErrors.ClassMethodHasReadonly);
        }

        if (methodOrProp.declare && this.match(_types.types.parenL)) {
          this.raise(methodOrProp.start, TSErrors.ClassMethodHasDeclare);
        }
      } // Note: The reason we do this in `parseExpressionStatement` and not `parseStatement`
      // is that e.g. `type()` is valid JS, so we must try parsing that first.
      // If it's really a type, we will parse `type` as the statement, and can correct it here
      // by parsing the rest.

    }, {
      key: "parseExpressionStatement",
      value: function parseExpressionStatement(node, expr) {
        var decl = expr.type === "Identifier" ? this.tsParseExpressionStatement(node, expr) : undefined;
        return decl || _get(_getPrototypeOf(_class.prototype), "parseExpressionStatement", this).call(this, node, expr);
      } // export type
      // Should be true for anything parsed by `tsTryParseExportDeclaration`.

    }, {
      key: "shouldParseExportDeclaration",
      value: function shouldParseExportDeclaration() {
        if (this.tsIsDeclarationStart()) return true;
        return _get(_getPrototypeOf(_class.prototype), "shouldParseExportDeclaration", this).call(this);
      } // An apparent conditional expression could actually be an optional parameter in an arrow function.

    }, {
      key: "parseConditional",
      value: function parseConditional(expr, startPos, startLoc, refExpressionErrors) {
        var _this19 = this;

        // only do the expensive clone if there is a question mark
        // and if we come from inside parens
        if (!this.state.maybeInArrowParameters || !this.match(_types.types.question)) {
          return _get(_getPrototypeOf(_class.prototype), "parseConditional", this).call(this, expr, startPos, startLoc, refExpressionErrors);
        }

        var result = this.tryParse(function () {
          return _get(_getPrototypeOf(_class.prototype), "parseConditional", _this19).call(_this19, expr, startPos, startLoc);
        });

        if (!result.node) {
          if (result.error) {
            /*:: invariant(refExpressionErrors != null) */
            _get(_getPrototypeOf(_class.prototype), "setOptionalParametersError", this).call(this, refExpressionErrors, result.error);
          }

          return expr;
        }

        if (result.error) this.state = result.failState;
        return result.node;
      } // Note: These "type casts" are *not* valid TS expressions.
      // But we parse them here and change them when completing the arrow function.

    }, {
      key: "parseParenItem",
      value: function parseParenItem(node, startPos, startLoc) {
        node = _get(_getPrototypeOf(_class.prototype), "parseParenItem", this).call(this, node, startPos, startLoc);

        if (this.eat(_types.types.question)) {
          node.optional = true; // Include questionmark in location of node
          // Don't use this.finishNode() as otherwise we might process comments twice and
          // include already consumed parens

          this.resetEndLocation(node);
        }

        if (this.match(_types.types.colon)) {
          var typeCastNode = this.startNodeAt(startPos, startLoc);
          typeCastNode.expression = node;
          typeCastNode.typeAnnotation = this.tsParseTypeAnnotation();
          return this.finishNode(typeCastNode, "TSTypeCastExpression");
        }

        return node;
      }
    }, {
      key: "parseExportDeclaration",
      value: function parseExportDeclaration(node) {
        // Store original location/position
        var startPos = this.state.start;
        var startLoc = this.state.startLoc; // "export declare" is equivalent to just "export".

        var isDeclare = this.eatContextual("declare");

        if (isDeclare && (this.isContextual("declare") || !this.shouldParseExportDeclaration())) {
          throw this.raise(this.state.start, TSErrors.ExpectedAmbientAfterExportDeclare);
        }

        var declaration;

        if (this.match(_types.types.name)) {
          declaration = this.tsTryParseExportDeclaration();
        }

        if (!declaration) {
          declaration = _get(_getPrototypeOf(_class.prototype), "parseExportDeclaration", this).call(this, node);
        }

        if (declaration && (declaration.type === "TSInterfaceDeclaration" || declaration.type === "TSTypeAliasDeclaration" || isDeclare)) {
          node.exportKind = "type";
        }

        if (declaration && isDeclare) {
          // Reset location to include `declare` in range
          this.resetStartLocation(declaration, startPos, startLoc);
          declaration.declare = true;
        }

        return declaration;
      }
    }, {
      key: "parseClassId",
      value: function parseClassId(node, isStatement, optionalId) {
        if ((!isStatement || optionalId) && this.isContextual("implements")) {
          return;
        }

        _get(_getPrototypeOf(_class.prototype), "parseClassId", this).call(this, node, isStatement, optionalId, node.declare ? _scopeflags.BIND_TS_AMBIENT : _scopeflags.BIND_CLASS);

        var typeParameters = this.tsTryParseTypeParameters();
        if (typeParameters) node.typeParameters = typeParameters;
      }
    }, {
      key: "parseClassPropertyAnnotation",
      value: function parseClassPropertyAnnotation(node) {
        if (!node.optional && this.eat(_types.types.bang)) {
          node.definite = true;
        }

        var type = this.tsTryParseTypeAnnotation();
        if (type) node.typeAnnotation = type;
      }
    }, {
      key: "parseClassProperty",
      value: function parseClassProperty(node) {
        this.parseClassPropertyAnnotation(node);

        if (this.state.isAmbientContext && this.match(_types.types.eq)) {
          this.raise(this.state.start, TSErrors.DeclareClassFieldHasInitializer);
        }

        return _get(_getPrototypeOf(_class.prototype), "parseClassProperty", this).call(this, node);
      }
    }, {
      key: "parseClassPrivateProperty",
      value: function parseClassPrivateProperty(node) {
        // $FlowIgnore
        if (node["abstract"]) {
          this.raise(node.start, TSErrors.PrivateElementHasAbstract);
        } // $FlowIgnore


        if (node.accessibility) {
          this.raise(node.start, TSErrors.PrivateElementHasAccessibility, node.accessibility);
        }

        this.parseClassPropertyAnnotation(node);
        return _get(_getPrototypeOf(_class.prototype), "parseClassPrivateProperty", this).call(this, node);
      }
    }, {
      key: "pushClassMethod",
      value: function pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
        var typeParameters = this.tsTryParseTypeParameters();

        if (typeParameters && isConstructor) {
          this.raise(typeParameters.start, TSErrors.ConstructorHasTypeParameters);
        } // $FlowIgnore


        if (method.declare && (method.kind === "get" || method.kind === "set")) {
          this.raise(method.start, TSErrors.DeclareAccessor, method.kind);
        }

        if (typeParameters) method.typeParameters = typeParameters;

        _get(_getPrototypeOf(_class.prototype), "pushClassMethod", this).call(this, classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);
      }
    }, {
      key: "pushClassPrivateMethod",
      value: function pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
        var typeParameters = this.tsTryParseTypeParameters();
        if (typeParameters) method.typeParameters = typeParameters;

        _get(_getPrototypeOf(_class.prototype), "pushClassPrivateMethod", this).call(this, classBody, method, isGenerator, isAsync);
      }
    }, {
      key: "parseClassSuper",
      value: function parseClassSuper(node) {
        _get(_getPrototypeOf(_class.prototype), "parseClassSuper", this).call(this, node);

        if (node.superClass && this.isRelational("<")) {
          node.superTypeParameters = this.tsParseTypeArguments();
        }

        if (this.eatContextual("implements")) {
          node["implements"] = this.tsParseHeritageClause("implements");
        }
      }
    }, {
      key: "parseObjPropValue",
      value: function parseObjPropValue(prop) {
        var _get3;

        var typeParameters = this.tsTryParseTypeParameters();
        if (typeParameters) prop.typeParameters = typeParameters;

        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        (_get3 = _get(_getPrototypeOf(_class.prototype), "parseObjPropValue", this)).call.apply(_get3, [this, prop].concat(args));
      }
    }, {
      key: "parseFunctionParams",
      value: function parseFunctionParams(node, allowModifiers) {
        var typeParameters = this.tsTryParseTypeParameters();
        if (typeParameters) node.typeParameters = typeParameters;

        _get(_getPrototypeOf(_class.prototype), "parseFunctionParams", this).call(this, node, allowModifiers);
      } // `let x: number;`

    }, {
      key: "parseVarId",
      value: function parseVarId(decl, kind) {
        _get(_getPrototypeOf(_class.prototype), "parseVarId", this).call(this, decl, kind);

        if (decl.id.type === "Identifier" && this.eat(_types.types.bang)) {
          decl.definite = true;
        }

        var type = this.tsTryParseTypeAnnotation();

        if (type) {
          decl.id.typeAnnotation = type;
          this.resetEndLocation(decl.id); // set end position to end of type
        }
      } // parse the return type of an async arrow function - let foo = (async (): number => {});

    }, {
      key: "parseAsyncArrowFromCallExpression",
      value: function parseAsyncArrowFromCallExpression(node, call) {
        if (this.match(_types.types.colon)) {
          node.returnType = this.tsParseTypeAnnotation();
        }

        return _get(_getPrototypeOf(_class.prototype), "parseAsyncArrowFromCallExpression", this).call(this, node, call);
      }
    }, {
      key: "parseMaybeAssign",
      value: function parseMaybeAssign() {
        var _this20 = this,
            _jsx,
            _jsx2,
            _typeCast,
            _jsx3,
            _typeCast2,
            _jsx4,
            _typeCast3;

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid syntax.
        var state;
        var jsx;
        var typeCast;

        if (this.hasPlugin("jsx") && (this.match(_types.types.jsxTagStart) || this.isRelational("<"))) {
          // Prefer to parse JSX if possible. But may be an arrow fn.
          state = this.state.clone();
          jsx = this.tryParse(function () {
            var _get4;

            return (_get4 = _get(_getPrototypeOf(_class.prototype), "parseMaybeAssign", _this20)).call.apply(_get4, [_this20].concat(args));
          }, state);
          /*:: invariant(!jsx.aborted) */

          /*:: invariant(jsx.node != null) */

          if (!jsx.error) return jsx.node; // Remove `tc.j_expr` and `tc.j_oTag` from context added
          // by parsing `jsxTagStart` to stop the JSX plugin from
          // messing with the tokens

          var context = this.state.context;

          if (context[context.length - 1] === _context.types.j_oTag) {
            context.length -= 2;
          } else if (context[context.length - 1] === _context.types.j_expr) {
            context.length -= 1;
          }
        }

        if (!((_jsx = jsx) !== null && _jsx !== void 0 && _jsx.error) && !this.isRelational("<")) {
          var _get5;

          return (_get5 = _get(_getPrototypeOf(_class.prototype), "parseMaybeAssign", this)).call.apply(_get5, [this].concat(args));
        } // Either way, we're looking at a '<': tt.jsxTagStart or relational.


        var typeParameters;
        state = state || this.state.clone();
        var arrow = this.tryParse(function (abort) {
          var _get6, _expr$extra, _typeParameters;

          // This is similar to TypeScript's `tryParseParenthesizedArrowFunctionExpression`.
          typeParameters = _this20.tsParseTypeParameters();

          var expr = (_get6 = _get(_getPrototypeOf(_class.prototype), "parseMaybeAssign", _this20)).call.apply(_get6, [_this20].concat(args));

          if (expr.type !== "ArrowFunctionExpression" || (_expr$extra = expr.extra) !== null && _expr$extra !== void 0 && _expr$extra.parenthesized) {
            abort();
          } // Correct TypeScript code should have at least 1 type parameter, but don't crash on bad code.


          if (((_typeParameters = typeParameters) === null || _typeParameters === void 0 ? void 0 : _typeParameters.params.length) !== 0) {
            _this20.resetStartLocationFromNode(expr, typeParameters);
          }

          expr.typeParameters = typeParameters;
          return expr;
        }, state);
        /*:: invariant(arrow.node != null) */

        if (!arrow.error && !arrow.aborted) return arrow.node;

        if (!jsx) {
          // Try parsing a type cast instead of an arrow function.
          // This will never happen outside of JSX.
          // (Because in JSX the '<' should be a jsxTagStart and not a relational.
          assert(!this.hasPlugin("jsx")); // This will start with a type assertion (via parseMaybeUnary).
          // But don't directly call `this.tsParseTypeAssertion` because we want to handle any binary after it.

          typeCast = this.tryParse(function () {
            var _get7;

            return (_get7 = _get(_getPrototypeOf(_class.prototype), "parseMaybeAssign", _this20)).call.apply(_get7, [_this20].concat(args));
          }, state);
          /*:: invariant(!typeCast.aborted) */

          /*:: invariant(typeCast.node != null) */

          if (!typeCast.error) return typeCast.node;
        }

        if ((_jsx2 = jsx) !== null && _jsx2 !== void 0 && _jsx2.node) {
          /*:: invariant(jsx.failState) */
          this.state = jsx.failState;
          return jsx.node;
        }

        if (arrow.node) {
          /*:: invariant(arrow.failState) */
          this.state = arrow.failState;
          return arrow.node;
        }

        if ((_typeCast = typeCast) !== null && _typeCast !== void 0 && _typeCast.node) {
          /*:: invariant(typeCast.failState) */
          this.state = typeCast.failState;
          return typeCast.node;
        }

        if ((_jsx3 = jsx) !== null && _jsx3 !== void 0 && _jsx3.thrown) throw jsx.error;
        if (arrow.thrown) throw arrow.error;
        if ((_typeCast2 = typeCast) !== null && _typeCast2 !== void 0 && _typeCast2.thrown) throw typeCast.error;
        throw ((_jsx4 = jsx) === null || _jsx4 === void 0 ? void 0 : _jsx4.error) || arrow.error || ((_typeCast3 = typeCast) === null || _typeCast3 === void 0 ? void 0 : _typeCast3.error);
      } // Handle type assertions

    }, {
      key: "parseMaybeUnary",
      value: function parseMaybeUnary(refExpressionErrors) {
        if (!this.hasPlugin("jsx") && this.isRelational("<")) {
          return this.tsParseTypeAssertion();
        } else {
          return _get(_getPrototypeOf(_class.prototype), "parseMaybeUnary", this).call(this, refExpressionErrors);
        }
      }
    }, {
      key: "parseArrow",
      value: function parseArrow(node) {
        var _this21 = this;

        if (this.match(_types.types.colon)) {
          // This is different from how the TS parser does it.
          // TS uses lookahead. The Babel Parser parses it as a parenthesized expression and converts.
          var result = this.tryParse(function (abort) {
            var returnType = _this21.tsParseTypeOrTypePredicateAnnotation(_types.types.colon);

            if (_this21.canInsertSemicolon() || !_this21.match(_types.types.arrow)) abort();
            return returnType;
          });
          if (result.aborted) return;

          if (!result.thrown) {
            if (result.error) this.state = result.failState;
            node.returnType = result.node;
          }
        }

        return _get(_getPrototypeOf(_class.prototype), "parseArrow", this).call(this, node);
      } // Allow type annotations inside of a parameter list.

    }, {
      key: "parseAssignableListItemTypes",
      value: function parseAssignableListItemTypes(param) {
        if (this.eat(_types.types.question)) {
          if (param.type !== "Identifier" && !this.state.isAmbientContext && !this.state.inType) {
            this.raise(param.start, TSErrors.PatternIsOptional);
          }

          param.optional = true;
        }

        var type = this.tsTryParseTypeAnnotation();
        if (type) param.typeAnnotation = type;
        this.resetEndLocation(param);
        return param;
      }
    }, {
      key: "toAssignable",
      value: function toAssignable(node) {
        var isLHS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        switch (node.type) {
          case "TSTypeCastExpression":
            return _get(_getPrototypeOf(_class.prototype), "toAssignable", this).call(this, this.typeCastToParameter(node), isLHS);

          case "TSParameterProperty":
            return _get(_getPrototypeOf(_class.prototype), "toAssignable", this).call(this, node, isLHS);

          case "ParenthesizedExpression":
            return this.toAssignableParenthesizedExpression(node, isLHS);

          case "TSAsExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
            node.expression = this.toAssignable(node.expression, isLHS);
            return node;

          default:
            return _get(_getPrototypeOf(_class.prototype), "toAssignable", this).call(this, node, isLHS);
        }
      }
    }, {
      key: "toAssignableParenthesizedExpression",
      value: function toAssignableParenthesizedExpression(node, isLHS) {
        switch (node.expression.type) {
          case "TSAsExpression":
          case "TSNonNullExpression":
          case "TSTypeAssertion":
          case "ParenthesizedExpression":
            node.expression = this.toAssignable(node.expression, isLHS);
            return node;

          default:
            return _get(_getPrototypeOf(_class.prototype), "toAssignable", this).call(this, node, isLHS);
        }
      }
    }, {
      key: "checkLVal",
      value: function checkLVal(expr, contextDescription) {
        var _expr$extra2, _get8;

        for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
          args[_key4 - 2] = arguments[_key4];
        }

        switch (expr.type) {
          case "TSTypeCastExpression":
            // Allow "typecasts" to appear on the left of assignment expressions,
            // because it may be in an arrow function.
            // e.g. `const f = (foo: number = 0) => foo;`
            return;

          case "TSParameterProperty":
            this.checkLVal.apply(this, [expr.parameter, "parameter property"].concat(args));
            return;

          case "TSAsExpression":
          case "TSTypeAssertion":
            if (
            /*bindingType*/
            !args[0] && contextDescription !== "parenthesized expression" && !((_expr$extra2 = expr.extra) !== null && _expr$extra2 !== void 0 && _expr$extra2.parenthesized)) {
              this.raise(expr.start, _error.Errors.InvalidLhs, contextDescription);
              break;
            }

            this.checkLVal.apply(this, [expr.expression, "parenthesized expression"].concat(args));
            return;

          case "TSNonNullExpression":
            this.checkLVal.apply(this, [expr.expression, contextDescription].concat(args));
            return;

          default:
            (_get8 = _get(_getPrototypeOf(_class.prototype), "checkLVal", this)).call.apply(_get8, [this, expr, contextDescription].concat(args));

            return;
        }
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
            return _get(_getPrototypeOf(_class.prototype), "parseBindingAtom", this).call(this);
        }
      }
    }, {
      key: "parseMaybeDecoratorArguments",
      value: function parseMaybeDecoratorArguments(expr) {
        if (this.isRelational("<")) {
          var typeArguments = this.tsParseTypeArguments();

          if (this.match(_types.types.parenL)) {
            var call = _get(_getPrototypeOf(_class.prototype), "parseMaybeDecoratorArguments", this).call(this, expr);

            call.typeParameters = typeArguments;
            return call;
          }

          this.unexpected(this.state.start, _types.types.parenL);
        }

        return _get(_getPrototypeOf(_class.prototype), "parseMaybeDecoratorArguments", this).call(this, expr);
      }
    }, {
      key: "checkCommaAfterRest",
      value: function checkCommaAfterRest(close) {
        if (this.state.isAmbientContext && this.match(_types.types.comma) && this.lookaheadCharCode() === close) {
          this.next();
        } else {
          _get(_getPrototypeOf(_class.prototype), "checkCommaAfterRest", this).call(this, close);
        }
      } // === === === === === === === === === === === === === === === ===
      // Note: All below methods are duplicates of something in flow.js.
      // Not sure what the best way to combine these is.
      // === === === === === === === === === === === === === === === ===

    }, {
      key: "isClassMethod",
      value: function isClassMethod() {
        return this.isRelational("<") || _get(_getPrototypeOf(_class.prototype), "isClassMethod", this).call(this);
      }
    }, {
      key: "isClassProperty",
      value: function isClassProperty() {
        return this.match(_types.types.bang) || this.match(_types.types.colon) || _get(_getPrototypeOf(_class.prototype), "isClassProperty", this).call(this);
      }
    }, {
      key: "parseMaybeDefault",
      value: function parseMaybeDefault() {
        var _get9;

        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        var node = (_get9 = _get(_getPrototypeOf(_class.prototype), "parseMaybeDefault", this)).call.apply(_get9, [this].concat(args));

        if (node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start) {
          this.raise(node.typeAnnotation.start, TSErrors.TypeAnnotationAfterAssign);
        }

        return node;
      } // ensure that inside types, we bypass the jsx parser plugin

    }, {
      key: "getTokenFromCode",
      value: function getTokenFromCode(code) {
        if (this.state.inType && (code === charCodes.greaterThan || code === charCodes.lessThan)) {
          return this.finishOp(_types.types.relational, 1);
        } else {
          return _get(_getPrototypeOf(_class.prototype), "getTokenFromCode", this).call(this, code);
        }
      } // used after we have finished parsing types

    }, {
      key: "reScan_lt_gt",
      value: function reScan_lt_gt() {
        if (this.match(_types.types.relational)) {
          var code = this.input.charCodeAt(this.state.start);

          if (code === charCodes.lessThan || code === charCodes.greaterThan) {
            this.state.pos -= 1;
            this.readToken_lt_gt(code);
          }
        }
      }
    }, {
      key: "toAssignableList",
      value: function toAssignableList(exprList) {
        for (var i = 0; i < exprList.length; i++) {
          var expr = exprList[i];
          if (!expr) continue;

          switch (expr.type) {
            case "TSTypeCastExpression":
              exprList[i] = this.typeCastToParameter(expr);
              break;

            case "TSAsExpression":
            case "TSTypeAssertion":
              if (!this.state.maybeInArrowParameters) {
                exprList[i] = this.typeCastToParameter(expr);
              } else {
                this.raise(expr.start, TSErrors.UnexpectedTypeCastInParameter);
              }

              break;
          }
        }

        return _get(_getPrototypeOf(_class.prototype), "toAssignableList", this).apply(this, arguments);
      }
    }, {
      key: "typeCastToParameter",
      value: function typeCastToParameter(node) {
        node.expression.typeAnnotation = node.typeAnnotation;
        this.resetEndLocation(node.expression, node.typeAnnotation.end, node.typeAnnotation.loc.end);
        return node.expression;
      }
    }, {
      key: "shouldParseArrow",
      value: function shouldParseArrow() {
        return this.match(_types.types.colon) || _get(_getPrototypeOf(_class.prototype), "shouldParseArrow", this).call(this);
      }
    }, {
      key: "shouldParseAsyncArrow",
      value: function shouldParseAsyncArrow() {
        return this.match(_types.types.colon) || _get(_getPrototypeOf(_class.prototype), "shouldParseAsyncArrow", this).call(this);
      }
    }, {
      key: "canHaveLeadingDecorator",
      value: function canHaveLeadingDecorator() {
        // Avoid unnecessary lookahead in checking for abstract class unless needed!
        return _get(_getPrototypeOf(_class.prototype), "canHaveLeadingDecorator", this).call(this) || this.isAbstractClass();
      }
    }, {
      key: "jsxParseOpeningElementAfterName",
      value: function jsxParseOpeningElementAfterName(node) {
        var _this22 = this;

        if (this.isRelational("<")) {
          var typeArguments = this.tsTryParseAndCatch(function () {
            return _this22.tsParseTypeArguments();
          });
          if (typeArguments) node.typeParameters = typeArguments;
        }

        return _get(_getPrototypeOf(_class.prototype), "jsxParseOpeningElementAfterName", this).call(this, node);
      }
    }, {
      key: "getGetterSetterExpectedParamCount",
      value: function getGetterSetterExpectedParamCount(method) {
        var baseCount = _get(_getPrototypeOf(_class.prototype), "getGetterSetterExpectedParamCount", this).call(this, method);

        var params = this.getObjectOrClassMethodParams(method);
        var firstParam = params[0];
        var hasContextParam = firstParam && this.isThisParam(firstParam);
        return hasContextParam ? baseCount + 1 : baseCount;
      }
    }, {
      key: "parseCatchClauseParam",
      value: function parseCatchClauseParam() {
        var param = _get(_getPrototypeOf(_class.prototype), "parseCatchClauseParam", this).call(this);

        var type = this.tsTryParseTypeAnnotation();

        if (type) {
          param.typeAnnotation = type;
          this.resetEndLocation(param);
        }

        return param;
      }
    }, {
      key: "tsInAmbientContext",
      value: function tsInAmbientContext(cb) {
        var oldIsAmbientContext = this.state.isAmbientContext;
        this.state.isAmbientContext = true;

        try {
          return cb();
        } finally {
          this.state.isAmbientContext = oldIsAmbientContext;
        }
      }
    }, {
      key: "parseClass",
      value: function parseClass(node) {
        var oldInAbstractClass = this.state.inAbstractClass;
        this.state.inAbstractClass = !!node["abstract"];

        try {
          var _get10;

          for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            args[_key6 - 1] = arguments[_key6];
          }

          return (_get10 = _get(_getPrototypeOf(_class.prototype), "parseClass", this)).call.apply(_get10, [this, node].concat(args));
        } finally {
          this.state.inAbstractClass = oldInAbstractClass;
        }
      }
    }, {
      key: "tsParseAbstractDeclaration",
      value: function tsParseAbstractDeclaration(node) {
        if (this.match(_types.types._class)) {
          node["abstract"] = true;
          return this.parseClass(node,
          /* isStatement */
          true,
          /* optionalId */
          false);
        } else if (this.isContextual("interface")) {
          // for invalid abstract interface
          // To avoid
          //   abstract interface
          //   Foo {}
          if (!this.hasFollowingLineBreak()) {
            node["abstract"] = true;
            this.raise(node.start, TSErrors.NonClassMethodPropertyHasAbstractModifer);
            this.next();
            return this.tsParseInterfaceDeclaration(node);
          }
        } else {
          this.unexpected(null, _types.types._class);
        }
      }
    }, {
      key: "parseMethod",
      value: function parseMethod() {
        var _get11;

        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        var method = (_get11 = _get(_getPrototypeOf(_class.prototype), "parseMethod", this)).call.apply(_get11, [this].concat(args));

        if (method["abstract"]) {
          var hasBody = this.hasPlugin("estree") ? !!method.value.body : !!method.body;

          if (hasBody) {
            var _key8 = method.key;
            this.raise(method.start, TSErrors.AbstractMethodHasImplementation, _key8.type === "Identifier" ? _key8.name : "[".concat(this.input.slice(_key8.start, _key8.end), "]"));
          }
        }

        return method;
      }
    }, {
      key: "shouldParseAsAmbientContext",
      value: function shouldParseAsAmbientContext() {
        return !!this.getPluginOption("typescript", "dts");
      }
    }, {
      key: "parse",
      value: function parse() {
        if (this.shouldParseAsAmbientContext()) {
          this.state.isAmbientContext = true;
        }

        return _get(_getPrototypeOf(_class.prototype), "parse", this).call(this);
      }
    }, {
      key: "getExpression",
      value: function getExpression() {
        if (this.shouldParseAsAmbientContext()) {
          this.state.isAmbientContext = true;
        }

        return _get(_getPrototypeOf(_class.prototype), "getExpression", this).call(this);
      }
    }]);

    return _class;
  }(superClass);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL3R5cGVzY3JpcHQvaW5kZXguanMiXSwibmFtZXMiOlsibm9uTnVsbCIsIngiLCJFcnJvciIsImFzc2VydCIsIlRTRXJyb3JzIiwiQWJzdHJhY3RNZXRob2RIYXNJbXBsZW1lbnRhdGlvbiIsIkFjY2Vzb3JDYW5ub3REZWNsYXJlVGhpc1BhcmFtZXRlciIsIkFjY2Vzb3JDYW5ub3RIYXZlVHlwZVBhcmFtZXRlcnMiLCJDbGFzc01ldGhvZEhhc0RlY2xhcmUiLCJDbGFzc01ldGhvZEhhc1JlYWRvbmx5IiwiQ29uc3RydWN0b3JIYXNUeXBlUGFyYW1ldGVycyIsIkRlY2xhcmVBY2Nlc3NvciIsIkRlY2xhcmVDbGFzc0ZpZWxkSGFzSW5pdGlhbGl6ZXIiLCJEZWNsYXJlRnVuY3Rpb25IYXNJbXBsZW1lbnRhdGlvbiIsIkR1cGxpY2F0ZUFjY2Vzc2liaWxpdHlNb2RpZmllciIsIkR1cGxpY2F0ZU1vZGlmaWVyIiwiRW1wdHlIZXJpdGFnZUNsYXVzZVR5cGUiLCJFbXB0eVR5cGVBcmd1bWVudHMiLCJFbXB0eVR5cGVQYXJhbWV0ZXJzIiwiRXhwZWN0ZWRBbWJpZW50QWZ0ZXJFeHBvcnREZWNsYXJlIiwiSW1wb3J0QWxpYXNIYXNJbXBvcnRUeXBlIiwiSW5jb21wYXRpYmxlTW9kaWZpZXJzIiwiSW5kZXhTaWduYXR1cmVIYXNBYnN0cmFjdCIsIkluZGV4U2lnbmF0dXJlSGFzQWNjZXNzaWJpbGl0eSIsIkluZGV4U2lnbmF0dXJlSGFzRGVjbGFyZSIsIkluZGV4U2lnbmF0dXJlSGFzT3ZlcnJpZGUiLCJJbmRleFNpZ25hdHVyZUhhc1N0YXRpYyIsIkludmFsaWRNb2RpZmllck9uVHlwZU1lbWJlciIsIkludmFsaWRNb2RpZmllcnNPcmRlciIsIkludmFsaWRUdXBsZU1lbWJlckxhYmVsIiwiTWl4ZWRMYWJlbGVkQW5kVW5sYWJlbGVkRWxlbWVudHMiLCJOb25BYnN0cmFjdENsYXNzSGFzQWJzdHJhY3RNZXRob2QiLCJOb25DbGFzc01ldGhvZFByb3BlcnR5SGFzQWJzdHJhY3RNb2RpZmVyIiwiT3B0aW9uYWxUeXBlQmVmb3JlUmVxdWlyZWQiLCJPdmVycmlkZU5vdEluU3ViQ2xhc3MiLCJQYXR0ZXJuSXNPcHRpb25hbCIsIlByaXZhdGVFbGVtZW50SGFzQWJzdHJhY3QiLCJQcml2YXRlRWxlbWVudEhhc0FjY2Vzc2liaWxpdHkiLCJSZWFkb25seUZvck1ldGhvZFNpZ25hdHVyZSIsIlNldEFjY2Vzb3JDYW5ub3RIYXZlT3B0aW9uYWxQYXJhbWV0ZXIiLCJTZXRBY2Nlc29yQ2Fubm90SGF2ZVJlc3RQYXJhbWV0ZXIiLCJTZXRBY2Nlc29yQ2Fubm90SGF2ZVJldHVyblR5cGUiLCJTdGF0aWNCbG9ja0Nhbm5vdEhhdmVNb2RpZmllciIsIlR5cGVBbm5vdGF0aW9uQWZ0ZXJBc3NpZ24iLCJUeXBlSW1wb3J0Q2Fubm90U3BlY2lmeURlZmF1bHRBbmROYW1lZCIsIlVuZXhwZWN0ZWRQYXJhbWV0ZXJNb2RpZmllciIsIlVuZXhwZWN0ZWRSZWFkb25seSIsIlVuZXhwZWN0ZWRUeXBlQW5ub3RhdGlvbiIsIlVuZXhwZWN0ZWRUeXBlQ2FzdEluUGFyYW1ldGVyIiwiVW5zdXBwb3J0ZWRJbXBvcnRUeXBlQXJndW1lbnQiLCJVbnN1cHBvcnRlZFBhcmFtZXRlclByb3BlcnR5S2luZCIsIlVuc3VwcG9ydGVkU2lnbmF0dXJlUGFyYW1ldGVyS2luZCIsIkVycm9yQ29kZXMiLCJTeW50YXhFcnJvciIsImtleXdvcmRUeXBlRnJvbU5hbWUiLCJ2YWx1ZSIsInVuZGVmaW5lZCIsInRzSXNBY2Nlc3NNb2RpZmllciIsIm1vZGlmaWVyIiwic3VwZXJDbGFzcyIsIlR5cGVTY3JpcHRTY29wZUhhbmRsZXIiLCJtYXRjaCIsInR0IiwibmFtZSIsImJyYWNrZXRMIiwiYnJhY2VMIiwic3RhciIsImVsbGlwc2lzIiwicHJpdmF0ZU5hbWUiLCJpc0xpdGVyYWxQcm9wZXJ0eU5hbWUiLCJoYXNQcmVjZWRpbmdMaW5lQnJlYWsiLCJuZXh0IiwidHNUb2tlbkNhbkZvbGxvd01vZGlmaWVyIiwiYWxsb3dlZE1vZGlmaWVycyIsInN0YXRlIiwiaW5kZXhPZiIsInRzVHJ5UGFyc2UiLCJ0c05leHRUb2tlbkNhbkZvbGxvd01vZGlmaWVyIiwiYmluZCIsIm1vZGlmaWVkIiwiZGlzYWxsb3dlZE1vZGlmaWVycyIsImVycm9yVGVtcGxhdGUiLCJlbmZvcmNlT3JkZXIiLCJwb3MiLCJiZWZvcmUiLCJhZnRlciIsInJhaXNlIiwiaW5jb21wYXRpYmxlIiwibW9kMSIsIm1vZDIiLCJzdGFydFBvcyIsInN0YXJ0IiwidHNQYXJzZU1vZGlmaWVyIiwiY29uY2F0IiwiYWNjZXNzaWJpbGl0eSIsIk9iamVjdCIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImluY2x1ZGVzIiwia2luZCIsImJyYWNlUiIsImJyYWNrZXRSIiwiaXNSZWxhdGlvbmFsIiwicGFyc2VFbGVtZW50IiwicmVzdWx0IiwidHNJc0xpc3RUZXJtaW5hdG9yIiwicHVzaCIsInRzUGFyc2VEZWxpbWl0ZWRMaXN0V29ya2VyIiwiZXhwZWN0U3VjY2VzcyIsImVsZW1lbnQiLCJlYXQiLCJjb21tYSIsImV4cGVjdCIsImJyYWNrZXQiLCJza2lwRmlyc3RUb2tlbiIsImV4cGVjdFJlbGF0aW9uYWwiLCJ0c1BhcnNlRGVsaW1pdGVkTGlzdCIsIm5vZGUiLCJzdGFydE5vZGUiLCJfaW1wb3J0IiwicGFyZW5MIiwic3RyaW5nIiwiYXJndW1lbnQiLCJwYXJzZUV4cHJBdG9tIiwicGFyZW5SIiwiZG90IiwicXVhbGlmaWVyIiwidHNQYXJzZUVudGl0eU5hbWUiLCJ0eXBlUGFyYW1ldGVycyIsInRzUGFyc2VUeXBlQXJndW1lbnRzIiwiZmluaXNoTm9kZSIsImFsbG93UmVzZXJ2ZWRXb3JkcyIsImVudGl0eSIsInBhcnNlSWRlbnRpZmllciIsInN0YXJ0Tm9kZUF0Tm9kZSIsImxlZnQiLCJyaWdodCIsInR5cGVOYW1lIiwibGhzIiwicGFyYW1ldGVyTmFtZSIsInR5cGVBbm5vdGF0aW9uIiwidHNQYXJzZVR5cGVBbm5vdGF0aW9uIiwiYXNzZXJ0cyIsIl90eXBlb2YiLCJleHByTmFtZSIsInRzUGFyc2VJbXBvcnRUeXBlIiwicGFyc2VJZGVudGlmaWVyTmFtZSIsImNvbnN0cmFpbnQiLCJ0c0VhdFRoZW5QYXJzZVR5cGUiLCJfZXh0ZW5kcyIsImVxIiwidHNQYXJzZVR5cGVQYXJhbWV0ZXJzIiwianN4VGFnU3RhcnQiLCJ1bmV4cGVjdGVkIiwicGFyYW1zIiwidHNQYXJzZUJyYWNrZXRlZExpc3QiLCJ0c1BhcnNlVHlwZVBhcmFtZXRlciIsImxlbmd0aCIsImxvb2thaGVhZCIsInR5cGUiLCJfY29uc3QiLCJ0c1BhcnNlVHlwZVJlZmVyZW5jZSIsInJldHVyblRva2VuIiwic2lnbmF0dXJlIiwicmV0dXJuVG9rZW5SZXF1aXJlZCIsImFycm93IiwidHNUcnlQYXJzZVR5cGVQYXJhbWV0ZXJzIiwicGFyYW1ldGVycyIsInRzUGFyc2VCaW5kaW5nTGlzdEZvclNpZ25hdHVyZSIsInRzUGFyc2VUeXBlT3JUeXBlUHJlZGljYXRlQW5ub3RhdGlvbiIsInBhcnNlQmluZGluZ0xpc3QiLCJjaGFyQ29kZXMiLCJyaWdodFBhcmVudGhlc2lzIiwibWFwIiwicGF0dGVybiIsImlzTGluZVRlcm1pbmF0b3IiLCJzZW1pIiwidHNGaWxsU2lnbmF0dXJlIiwiY29sb24iLCJ0c1BhcnNlVHlwZU1lbWJlclNlbWljb2xvbiIsInRzTG9va0FoZWFkIiwidHNJc1VuYW1iaWd1b3VzbHlJbmRleFNpZ25hdHVyZSIsImlkIiwicmVzZXRFbmRMb2NhdGlvbiIsInRzVHJ5UGFyc2VUeXBlQW5ub3RhdGlvbiIsInJlYWRvbmx5IiwicXVlc3Rpb24iLCJvcHRpb25hbCIsIm5vZGVBbnkiLCJtZXRob2QiLCJFcnJvcnMiLCJCYWRHZXR0ZXJBcml0eSIsImlzVGhpc1BhcmFtIiwiQmFkU2V0dGVyQXJpdHkiLCJmaXJzdFBhcmFtZXRlciIsInByb3BlcnR5IiwidHNQYXJzZVNpZ25hdHVyZU1lbWJlciIsIl9uZXciLCJrZXkiLCJjcmVhdGVJZGVudGlmaWVyIiwidHNQYXJzZVByb3BlcnR5T3JNZXRob2RTaWduYXR1cmUiLCJ0c1BhcnNlTW9kaWZpZXJzIiwiaWR4IiwidHNUcnlQYXJzZUluZGV4U2lnbmF0dXJlIiwicGFyc2VQcm9wZXJ0eU5hbWUiLCJjb21wdXRlZCIsIm1lbWJlcnMiLCJ0c1BhcnNlT2JqZWN0VHlwZU1lbWJlcnMiLCJ0c1BhcnNlTGlzdCIsInRzUGFyc2VUeXBlTWVtYmVyIiwicGx1c01pbiIsImlzQ29udGV4dHVhbCIsInRzSXNJZGVudGlmaWVyIiwiX2luIiwidHNFeHBlY3RUaGVuUGFyc2VUeXBlIiwiZXhwZWN0Q29udGV4dHVhbCIsImVhdENvbnRleHR1YWwiLCJ0eXBlUGFyYW1ldGVyIiwidHNQYXJzZU1hcHBlZFR5cGVQYXJhbWV0ZXIiLCJuYW1lVHlwZSIsInRzUGFyc2VUeXBlIiwidHNUcnlQYXJzZVR5cGUiLCJzZW1pY29sb24iLCJlbGVtZW50VHlwZXMiLCJ0c1BhcnNlVHVwbGVFbGVtZW50VHlwZSIsInNlZW5PcHRpb25hbEVsZW1lbnQiLCJsYWJlbGVkRWxlbWVudHMiLCJmb3JFYWNoIiwiZWxlbWVudE5vZGUiLCJpc0xhYmVsZWQiLCJzdGFydExvYyIsInJlc3QiLCJsYWJlbGVkIiwibGFiZWxlZE5vZGUiLCJsYWJlbCIsImVsZW1lbnRUeXBlIiwib3B0aW9uYWxUeXBlTm9kZSIsInJlc3ROb2RlIiwic3RhcnROb2RlQXQiLCJhYnN0cmFjdCIsImxpdGVyYWwiLCJudW0iLCJiaWdpbnQiLCJfdHJ1ZSIsIl9mYWxzZSIsInBhcnNlVGVtcGxhdGUiLCJpblR5cGUiLCJ0aGlzS2V5d29yZCIsInRzUGFyc2VUaGlzVHlwZU5vZGUiLCJ0c1BhcnNlVGhpc1R5cGVQcmVkaWNhdGUiLCJfdm9pZCIsIl9udWxsIiwibG9va2FoZWFkQ2hhckNvZGUiLCJ0c1BhcnNlTGl0ZXJhbFR5cGVOb2RlIiwibmV4dFRva2VuIiwicGFyc2VNYXliZVVuYXJ5IiwiX3RoaXMiLCJ0c1BhcnNlVGhpc1R5cGVPclRoaXNUeXBlUHJlZGljYXRlIiwidHNQYXJzZVR5cGVRdWVyeSIsInRzSXNTdGFydE9mTWFwcGVkVHlwZSIsInRzUGFyc2VNYXBwZWRUeXBlIiwidHNQYXJzZVR5cGVMaXRlcmFsIiwidHNQYXJzZVR1cGxlVHlwZSIsInByb2Nlc3MiLCJlbnYiLCJCQUJFTF84X0JSRUFLSU5HIiwib3B0aW9ucyIsImNyZWF0ZVBhcmVudGhlc2l6ZWRFeHByZXNzaW9ucyIsImFkZEV4dHJhIiwidHNQYXJzZVBhcmVudGhlc2l6ZWRUeXBlIiwiYmFja1F1b3RlIiwidHNQYXJzZVRlbXBsYXRlTGl0ZXJhbFR5cGUiLCJ0c1BhcnNlTm9uQXJyYXlUeXBlIiwib2JqZWN0VHlwZSIsImluZGV4VHlwZSIsIm9wZXJhdG9yIiwidHNQYXJzZVR5cGVPcGVyYXRvck9ySGlnaGVyIiwidHNDaGVja1R5cGVBbm5vdGF0aW9uRm9yUmVhZE9ubHkiLCJmaW5kIiwia3ciLCJ0c1BhcnNlVHlwZU9wZXJhdG9yIiwidHNQYXJzZUluZmVyVHlwZSIsInRzUGFyc2VBcnJheVR5cGVPckhpZ2hlciIsInBhcnNlQ29uc3RpdHVlbnRUeXBlIiwiaGFzTGVhZGluZ09wZXJhdG9yIiwidHlwZXMiLCJ0c1BhcnNlVW5pb25PckludGVyc2VjdGlvblR5cGUiLCJiaXR3aXNlQU5EIiwidHNQYXJzZUludGVyc2VjdGlvblR5cGVPckhpZ2hlciIsImJpdHdpc2VPUiIsInRzSXNVbmFtYmlndW91c2x5U3RhcnRPZkZ1bmN0aW9uVHlwZSIsImJyYWNlU3RhY2tDb3VudGVyIiwidHNTa2lwUGFyYW1ldGVyU3RhcnQiLCJ0c0luVHlwZSIsInQiLCJ0c1BhcnNlVHlwZVByZWRpY2F0ZUFzc2VydHMiLCJ0aGlzVHlwZVByZWRpY2F0ZSIsInJlc2V0U3RhcnRMb2NhdGlvbkZyb21Ob2RlIiwidHlwZVByZWRpY2F0ZVZhcmlhYmxlIiwidHNQYXJzZVR5cGVQcmVkaWNhdGVQcmVmaXgiLCJjb250YWluc0VzYyIsImxhc3RUb2tTdGFydCIsIkludmFsaWRFc2NhcGVkUmVzZXJ2ZWRXb3JkIiwiZWF0Q29sb24iLCJ0c1BhcnNlTm9uQ29uZGl0aW9uYWxUeXBlIiwiY2hlY2tUeXBlIiwiZXh0ZW5kc1R5cGUiLCJ0cnVlVHlwZSIsImZhbHNlVHlwZSIsInRzSXNTdGFydE9mRnVuY3Rpb25UeXBlIiwidHNQYXJzZUZ1bmN0aW9uT3JDb25zdHJ1Y3RvclR5cGUiLCJpc0Fic3RyYWN0Q29uc3RydWN0b3JTaWduYXR1cmUiLCJ0c1BhcnNlVW5pb25UeXBlT3JIaWdoZXIiLCJ0c1RyeU5leHRQYXJzZUNvbnN0YW50Q29udGV4dCIsInRzTmV4dFRoZW5QYXJzZVR5cGUiLCJleHByZXNzaW9uIiwiZGVzY3JpcHRvciIsIm9yaWdpbmFsU3RhcnQiLCJkZWxpbWl0ZWRMaXN0IiwidHNQYXJzZUV4cHJlc3Npb25XaXRoVHlwZUFyZ3VtZW50cyIsImNoZWNrTFZhbCIsIkJJTkRfVFNfSU5URVJGQUNFIiwidHNQYXJzZUhlcml0YWdlQ2xhdXNlIiwiYm9keSIsIkJJTkRfVFNfVFlQRSIsImNiIiwib2xkQ29udGV4dCIsImNvbnRleHQiLCJvbGRJblR5cGUiLCJ0b2tlbiIsInRzRG9UaGVuUGFyc2VUeXBlIiwiaW5pdGlhbGl6ZXIiLCJwYXJzZU1heWJlQXNzaWduQWxsb3dJbiIsImlzQ29uc3QiLCJCSU5EX1RTX0NPTlNUX0VOVU0iLCJCSU5EX1RTX0VOVU0iLCJ0c1BhcnNlRW51bU1lbWJlciIsInNjb3BlIiwiZW50ZXIiLCJTQ09QRV9PVEhFUiIsInBhcnNlQmxvY2tPck1vZHVsZUJsb2NrQm9keSIsImV4aXQiLCJuZXN0ZWQiLCJCSU5EX1RTX05BTUVTUEFDRSIsImlubmVyIiwidHNQYXJzZU1vZHVsZU9yTmFtZXNwYWNlRGVjbGFyYXRpb24iLCJTQ09QRV9UU19NT0RVTEUiLCJwcm9kUGFyYW0iLCJQQVJBTSIsInRzUGFyc2VNb2R1bGVCbG9jayIsImdsb2JhbCIsImlzRXhwb3J0IiwiQklORF9MRVhJQ0FMIiwibW9kdWxlUmVmZXJlbmNlIiwidHNQYXJzZU1vZHVsZVJlZmVyZW5jZSIsImltcG9ydEtpbmQiLCJsZWZ0UGFyZW50aGVzaXMiLCJ0c0lzRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UiLCJ0c1BhcnNlRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UiLCJmIiwiY2xvbmUiLCJyZXMiLCJ0cnlQYXJzZSIsImFib3J0IiwiYWJvcnRlZCIsImVycm9yIiwiZmFpbFN0YXRlIiwibmFueSIsInN0YXJ0dHlwZSIsIl92YXIiLCJ0c0luQW1iaWVudENvbnRleHQiLCJfZnVuY3Rpb24iLCJkZWNsYXJlIiwicGFyc2VGdW5jdGlvblN0YXRlbWVudCIsIl9jbGFzcyIsInBhcnNlQ2xhc3MiLCJpc0xvb2thaGVhZENvbnRleHR1YWwiLCJ0c1BhcnNlRW51bURlY2xhcmF0aW9uIiwicGFyc2VWYXJTdGF0ZW1lbnQiLCJ0c1BhcnNlQW1iaWVudEV4dGVybmFsTW9kdWxlRGVjbGFyYXRpb24iLCJ0c1BhcnNlRGVjbGFyYXRpb24iLCJleHByIiwiZGVjbGFyYXRpb24iLCJ0c1RyeVBhcnNlRGVjbGFyZSIsIm1vZCIsInRzQ2hlY2tMaW5lVGVybWluYXRvciIsInRzUGFyc2VBYnN0cmFjdERlY2xhcmF0aW9uIiwidHNQYXJzZUludGVyZmFjZURlY2xhcmF0aW9uIiwidHNQYXJzZVR5cGVBbGlhc0RlY2xhcmF0aW9uIiwiaGFzRm9sbG93aW5nTGluZUJyZWFrIiwib2xkTWF5YmVJbkFycm93UGFyYW1ldGVycyIsIm1heWJlSW5BcnJvd1BhcmFtZXRlcnMiLCJ0c1RyeVBhcnNlQW5kQ2F0Y2giLCJyZXR1cm5UeXBlIiwidHNUcnlQYXJzZVR5cGVPclR5cGVQcmVkaWNhdGVBbm5vdGF0aW9uIiwicGFyc2VBcnJvd0V4cHJlc3Npb24iLCJ0c0luTm9Db250ZXh0IiwidHNJc0RlY2xhcmF0aW9uU3RhcnQiLCJhbGxvd01vZGlmaWVycyIsImRlY29yYXRvcnMiLCJvdmVycmlkZSIsInBhcnNlTWF5YmVEZWZhdWx0IiwicGFyc2VBc3NpZ25hYmxlTGlzdEl0ZW1UeXBlcyIsImVsdCIsImxvYyIsInBwIiwicGFyYW1ldGVyIiwiaXNNZXRob2QiLCJib2RpbGVzc1R5cGUiLCJpc0FtYmllbnRDb250ZXh0IiwiQklORF9UU19BTUJJRU5UIiwiYXJndW1lbnRzIiwiaXRlbXMiLCJleHByTGlzdCIsImlzSW5QYXJlbnMiLCJ0c0NoZWNrRm9ySW52YWxpZFR5cGVDYXN0cyIsImFyZ3MiLCJlbGVtZW50cyIsImJhc2UiLCJub0NhbGxzIiwiYmFuZyIsImV4cHJBbGxvd2VkIiwibm9uTnVsbEV4cHJlc3Npb24iLCJhdFBvc3NpYmxlQXN5bmNBcnJvdyIsImFzeW5jQXJyb3dGbiIsInRzVHJ5UGFyc2VHZW5lcmljQXN5bmNBcnJvd0Z1bmN0aW9uIiwiY2FsbGVlIiwidHlwZUFyZ3VtZW50cyIsInBhcnNlQ2FsbEV4cHJlc3Npb25Bcmd1bWVudHMiLCJvcHRpb25hbENoYWluTWVtYmVyIiwiZmluaXNoQ2FsbEV4cHJlc3Npb24iLCJwYXJzZVRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbiIsImxlZnRTdGFydFBvcyIsImxlZnRTdGFydExvYyIsIm1pblByZWMiLCJiaW5vcCIsInJlU2Nhbl9sdF9ndCIsInBhcnNlRXhwck9wIiwid29yZCIsImNoZWNrS2V5d29yZHMiLCJpc0JpbmRpbmciLCJhaGVhZCIsInRzUGFyc2VJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbiIsImltcG9ydE5vZGUiLCJzcGVjaWZpZXJzIiwiZXF1YWxzVG8iLCJhc3NpZ24iLCJwYXJzZUV4cHJlc3Npb24iLCJkZWNsIiwiZXhwb3J0S2luZCIsImlzQWJzdHJhY3RDbGFzcyIsImNscyIsInRvcExldmVsIiwibWVtYmVyIiwibW9kaWZpZXJzIiwic29tZSIsImNsYXNzQm9keSIsImludmFsaWRNb2RpZmVyc0ZvclN0YXRpY0Jsb2NrcyIsImNhbGxQYXJzZUNsYXNzTWVtYmVyV2l0aElzU3RhdGljIiwiaXNTdGF0aWMiLCJ0c0hhc1NvbWVNb2RpZmllcnMiLCJwYXJzZUNsYXNzU3RhdGljQmxvY2siLCJwYXJzZUNsYXNzTWVtYmVyV2l0aElzU3RhdGljIiwiaW5BYnN0cmFjdENsYXNzIiwiaGFkU3VwZXJDbGFzcyIsIm1ldGhvZE9yUHJvcCIsInRzUGFyc2VFeHByZXNzaW9uU3RhdGVtZW50IiwicmVmRXhwcmVzc2lvbkVycm9ycyIsInR5cGVDYXN0Tm9kZSIsImlzRGVjbGFyZSIsInNob3VsZFBhcnNlRXhwb3J0RGVjbGFyYXRpb24iLCJ0c1RyeVBhcnNlRXhwb3J0RGVjbGFyYXRpb24iLCJyZXNldFN0YXJ0TG9jYXRpb24iLCJpc1N0YXRlbWVudCIsIm9wdGlvbmFsSWQiLCJCSU5EX0NMQVNTIiwiZGVmaW5pdGUiLCJwYXJzZUNsYXNzUHJvcGVydHlBbm5vdGF0aW9uIiwiaXNHZW5lcmF0b3IiLCJpc0FzeW5jIiwiaXNDb25zdHJ1Y3RvciIsImFsbG93c0RpcmVjdFN1cGVyIiwic3VwZXJUeXBlUGFyYW1ldGVycyIsInByb3AiLCJqc3giLCJ0eXBlQ2FzdCIsImhhc1BsdWdpbiIsImN0Iiwial9vVGFnIiwial9leHByIiwiZXh0cmEiLCJwYXJlbnRoZXNpemVkIiwidGhyb3duIiwidHNQYXJzZVR5cGVBc3NlcnRpb24iLCJjYW5JbnNlcnRTZW1pY29sb24iLCJwYXJhbSIsImlzTEhTIiwidHlwZUNhc3RUb1BhcmFtZXRlciIsInRvQXNzaWduYWJsZVBhcmVudGhlc2l6ZWRFeHByZXNzaW9uIiwidG9Bc3NpZ25hYmxlIiwiY29udGV4dERlc2NyaXB0aW9uIiwiSW52YWxpZExocyIsImNsb3NlIiwiY29kZSIsImdyZWF0ZXJUaGFuIiwibGVzc1RoYW4iLCJmaW5pc2hPcCIsInJlbGF0aW9uYWwiLCJpbnB1dCIsImNoYXJDb2RlQXQiLCJyZWFkVG9rZW5fbHRfZ3QiLCJpIiwiZW5kIiwiYmFzZUNvdW50IiwiZ2V0T2JqZWN0T3JDbGFzc01ldGhvZFBhcmFtcyIsImZpcnN0UGFyYW0iLCJoYXNDb250ZXh0UGFyYW0iLCJvbGRJc0FtYmllbnRDb250ZXh0Iiwib2xkSW5BYnN0cmFjdENsYXNzIiwiaGFzQm9keSIsInNsaWNlIiwiZ2V0UGx1Z2luT3B0aW9uIiwic2hvdWxkUGFyc2VBc0FtYmllbnRDb250ZXh0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R0FBRyxLQUFLakMsU0FBTCxDQUFlLFFBQWYsSUFDWixDQUFDLENBQUN6UyxNQUFNLENBQUN0SSxLQUFQLENBQWE0USxJQURILEdBRVosQ0FBQyxDQUFDdEksTUFBTSxDQUFDc0ksSUFGYjs7QUFHQSxjQUFJb00sT0FBSixFQUFhO0FBQ1gsZ0JBQVFqVSxLQUFSLEdBQWdCVCxNQUFoQixDQUFRUyxHQUFSO0FBQ0EsaUJBQUtoSCxLQUFMLENBQ0V1RyxNQUFNLENBQUNsRyxLQURULEVBRUV2RixRQUFRLENBQUNDLCtCQUZYLEVBR0VpTSxLQUFHLENBQUN2QyxJQUFKLEtBQWEsWUFBYixHQUNJdUMsS0FBRyxDQUFDdkksSUFEUixjQUVRLEtBQUs2YixLQUFMLENBQVdZLEtBQVgsQ0FBaUJsVSxLQUFHLENBQUMzRyxLQUFyQixFQUE0QjJHLEtBQUcsQ0FBQzBULEdBQWhDLENBRlIsTUFIRjtBQU9EO0FBQ0Y7O0FBQ0QsZUFBT25VLE1BQVA7QUFDRDtBQXI3RlU7QUFBQTtBQUFBLGFBdTdGWCx1Q0FBdUM7QUFDckMsZUFBTyxDQUFDLENBQUMsS0FBSzRVLGVBQUwsQ0FBcUIsWUFBckIsRUFBbUMsS0FBbkMsQ0FBVDtBQUNEO0FBejdGVTtBQUFBO0FBQUEsYUEyN0ZYLGlCQUFRO0FBQ04sWUFBSSxLQUFLQywyQkFBTCxFQUFKLEVBQXdDO0FBQ3RDLGVBQUtoYyxLQUFMLENBQVcrVSxnQkFBWCxHQUE4QixJQUE5QjtBQUNEOztBQUNEO0FBQ0Q7QUFoOEZVO0FBQUE7QUFBQSxhQWs4RlgseUJBQWdCO0FBQ2QsWUFBSSxLQUFLaUgsMkJBQUwsRUFBSixFQUF3QztBQUN0QyxlQUFLaGMsS0FBTCxDQUFXK1UsZ0JBQVgsR0FBOEIsSUFBOUI7QUFDRDs7QUFDRDtBQUNEO0FBdjhGVTs7QUFBQTtBQUFBLElBQ0M5VixVQUREO0FBQUEsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8qOjogZGVjbGFyZSB2YXIgaW52YXJpYW50OyAqL1xuXG4vLyBFcnJvciBtZXNzYWdlcyBhcmUgY29sb2NhdGVkIHdpdGggdGhlIHBsdWdpbi5cbi8qIGVzbGludC1kaXNhYmxlIEBiYWJlbC9kZXZlbG9wbWVudC1pbnRlcm5hbC9kcnktZXJyb3ItbWVzc2FnZXMgKi9cblxuaW1wb3J0IHR5cGUgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vLi4vdG9rZW5pemVyL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSBTdGF0ZSBmcm9tIFwiLi4vLi4vdG9rZW5pemVyL3N0YXRlXCI7XG5pbXBvcnQgeyB0eXBlcyBhcyB0dCB9IGZyb20gXCIuLi8uLi90b2tlbml6ZXIvdHlwZXNcIjtcbmltcG9ydCB7IHR5cGVzIGFzIGN0IH0gZnJvbSBcIi4uLy4uL3Rva2VuaXplci9jb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBOIGZyb20gXCIuLi8uLi90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiB9IGZyb20gXCIuLi8uLi91dGlsL2xvY2F0aW9uXCI7XG5pbXBvcnQgdHlwZSBQYXJzZXIgZnJvbSBcIi4uLy4uL3BhcnNlclwiO1xuaW1wb3J0IHtcbiAgdHlwZSBCaW5kaW5nVHlwZXMsXG4gIFNDT1BFX1RTX01PRFVMRSxcbiAgU0NPUEVfT1RIRVIsXG4gIEJJTkRfVFNfRU5VTSxcbiAgQklORF9UU19DT05TVF9FTlVNLFxuICBCSU5EX1RTX1RZUEUsXG4gIEJJTkRfVFNfSU5URVJGQUNFLFxuICBCSU5EX1RTX0FNQklFTlQsXG4gIEJJTkRfVFNfTkFNRVNQQUNFLFxuICBCSU5EX0NMQVNTLFxuICBCSU5EX0xFWElDQUwsXG59IGZyb20gXCIuLi8uLi91dGlsL3Njb3BlZmxhZ3NcIjtcbmltcG9ydCBUeXBlU2NyaXB0U2NvcGVIYW5kbGVyIGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgKiBhcyBjaGFyQ29kZXMgZnJvbSBcImNoYXJjb2Rlc1wiO1xuaW1wb3J0IHR5cGUgeyBFeHByZXNzaW9uRXJyb3JzIH0gZnJvbSBcIi4uLy4uL3BhcnNlci91dGlsXCI7XG5pbXBvcnQgeyBQQVJBTSB9IGZyb20gXCIuLi8uLi91dGlsL3Byb2R1Y3Rpb24tcGFyYW1ldGVyXCI7XG5pbXBvcnQge1xuICBFcnJvcnMsXG4gIG1ha2VFcnJvclRlbXBsYXRlcyxcbiAgdHlwZSBFcnJvclRlbXBsYXRlLFxuICBFcnJvckNvZGVzLFxufSBmcm9tIFwiLi4vLi4vcGFyc2VyL2Vycm9yXCI7XG5cbnR5cGUgVHNNb2RpZmllciA9XG4gIHwgXCJyZWFkb25seVwiXG4gIHwgXCJhYnN0cmFjdFwiXG4gIHwgXCJkZWNsYXJlXCJcbiAgfCBcInN0YXRpY1wiXG4gIHwgXCJvdmVycmlkZVwiXG4gIHwgTi5BY2Nlc3NpYmlsaXR5O1xuXG5mdW5jdGlvbiBub25OdWxsPFQ+KHg6ID9UKTogVCB7XG4gIGlmICh4ID09IG51bGwpIHtcbiAgICAvLyAkRmxvd0lnbm9yZVxuICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCAke3h9IHZhbHVlLmApO1xuICB9XG4gIHJldHVybiB4O1xufVxuXG5mdW5jdGlvbiBhc3NlcnQoeDogYm9vbGVhbik6IHZvaWQge1xuICBpZiAoIXgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBc3NlcnQgZmFpbFwiKTtcbiAgfVxufVxuXG50eXBlIFBhcnNpbmdDb250ZXh0ID1cbiAgfCBcIkVudW1NZW1iZXJzXCJcbiAgfCBcIkhlcml0YWdlQ2xhdXNlRWxlbWVudFwiXG4gIHwgXCJUdXBsZUVsZW1lbnRUeXBlc1wiXG4gIHwgXCJUeXBlTWVtYmVyc1wiXG4gIHwgXCJUeXBlUGFyYW1ldGVyc09yQXJndW1lbnRzXCI7XG5cbi8qIGVzbGludCBzb3J0LWtleXM6IFwiZXJyb3JcIiAqL1xuY29uc3QgVFNFcnJvcnMgPSBtYWtlRXJyb3JUZW1wbGF0ZXMoXG4gIHtcbiAgICBBYnN0cmFjdE1ldGhvZEhhc0ltcGxlbWVudGF0aW9uOlxuICAgICAgXCJNZXRob2QgJyUwJyBjYW5ub3QgaGF2ZSBhbiBpbXBsZW1lbnRhdGlvbiBiZWNhdXNlIGl0IGlzIG1hcmtlZCBhYnN0cmFjdC5cIixcbiAgICBBY2Nlc29yQ2Fubm90RGVjbGFyZVRoaXNQYXJhbWV0ZXI6XG4gICAgICBcIidnZXQnIGFuZCAnc2V0JyBhY2Nlc3NvcnMgY2Fubm90IGRlY2xhcmUgJ3RoaXMnIHBhcmFtZXRlcnMuXCIsXG4gICAgQWNjZXNvckNhbm5vdEhhdmVUeXBlUGFyYW1ldGVyczogXCJBbiBhY2Nlc3NvciBjYW5ub3QgaGF2ZSB0eXBlIHBhcmFtZXRlcnMuXCIsXG4gICAgQ2xhc3NNZXRob2RIYXNEZWNsYXJlOiBcIkNsYXNzIG1ldGhvZHMgY2Fubm90IGhhdmUgdGhlICdkZWNsYXJlJyBtb2RpZmllci5cIixcbiAgICBDbGFzc01ldGhvZEhhc1JlYWRvbmx5OlxuICAgICAgXCJDbGFzcyBtZXRob2RzIGNhbm5vdCBoYXZlIHRoZSAncmVhZG9ubHknIG1vZGlmaWVyLlwiLFxuICAgIENvbnN0cnVjdG9ySGFzVHlwZVBhcmFtZXRlcnM6XG4gICAgICBcIlR5cGUgcGFyYW1ldGVycyBjYW5ub3QgYXBwZWFyIG9uIGEgY29uc3RydWN0b3IgZGVjbGFyYXRpb24uXCIsXG4gICAgRGVjbGFyZUFjY2Vzc29yOiBcIidkZWNsYXJlJyBpcyBub3QgYWxsb3dlZCBpbiAlMHRlcnMuXCIsXG4gICAgRGVjbGFyZUNsYXNzRmllbGRIYXNJbml0aWFsaXplcjpcbiAgICAgIFwiSW5pdGlhbGl6ZXJzIGFyZSBub3QgYWxsb3dlZCBpbiBhbWJpZW50IGNvbnRleHRzLlwiLFxuICAgIERlY2xhcmVGdW5jdGlvbkhhc0ltcGxlbWVudGF0aW9uOlxuICAgICAgXCJBbiBpbXBsZW1lbnRhdGlvbiBjYW5ub3QgYmUgZGVjbGFyZWQgaW4gYW1iaWVudCBjb250ZXh0cy5cIixcbiAgICBEdXBsaWNhdGVBY2Nlc3NpYmlsaXR5TW9kaWZpZXI6IFwiQWNjZXNzaWJpbGl0eSBtb2RpZmllciBhbHJlYWR5IHNlZW4uXCIsXG4gICAgRHVwbGljYXRlTW9kaWZpZXI6IFwiRHVwbGljYXRlIG1vZGlmaWVyOiAnJTAnLlwiLFxuICAgIEVtcHR5SGVyaXRhZ2VDbGF1c2VUeXBlOiBcIiclMCcgbGlzdCBjYW5ub3QgYmUgZW1wdHkuXCIsXG4gICAgRW1wdHlUeXBlQXJndW1lbnRzOiBcIlR5cGUgYXJndW1lbnQgbGlzdCBjYW5ub3QgYmUgZW1wdHkuXCIsXG4gICAgRW1wdHlUeXBlUGFyYW1ldGVyczogXCJUeXBlIHBhcmFtZXRlciBsaXN0IGNhbm5vdCBiZSBlbXB0eS5cIixcbiAgICBFeHBlY3RlZEFtYmllbnRBZnRlckV4cG9ydERlY2xhcmU6XG4gICAgICBcIidleHBvcnQgZGVjbGFyZScgbXVzdCBiZSBmb2xsb3dlZCBieSBhbiBhbWJpZW50IGRlY2xhcmF0aW9uLlwiLFxuICAgIEltcG9ydEFsaWFzSGFzSW1wb3J0VHlwZTogXCJBbiBpbXBvcnQgYWxpYXMgY2FuIG5vdCB1c2UgJ2ltcG9ydCB0eXBlJy5cIixcbiAgICBJbmNvbXBhdGlibGVNb2RpZmllcnM6IFwiJyUwJyBtb2RpZmllciBjYW5ub3QgYmUgdXNlZCB3aXRoICclMScgbW9kaWZpZXIuXCIsXG4gICAgSW5kZXhTaWduYXR1cmVIYXNBYnN0cmFjdDpcbiAgICAgIFwiSW5kZXggc2lnbmF0dXJlcyBjYW5ub3QgaGF2ZSB0aGUgJ2Fic3RyYWN0JyBtb2RpZmllci5cIixcbiAgICBJbmRleFNpZ25hdHVyZUhhc0FjY2Vzc2liaWxpdHk6XG4gICAgICBcIkluZGV4IHNpZ25hdHVyZXMgY2Fubm90IGhhdmUgYW4gYWNjZXNzaWJpbGl0eSBtb2RpZmllciAoJyUwJykuXCIsXG4gICAgSW5kZXhTaWduYXR1cmVIYXNEZWNsYXJlOlxuICAgICAgXCJJbmRleCBzaWduYXR1cmVzIGNhbm5vdCBoYXZlIHRoZSAnZGVjbGFyZScgbW9kaWZpZXIuXCIsXG4gICAgSW5kZXhTaWduYXR1cmVIYXNPdmVycmlkZTpcbiAgICAgIFwiJ292ZXJyaWRlJyBtb2RpZmllciBjYW5ub3QgYXBwZWFyIG9uIGFuIGluZGV4IHNpZ25hdHVyZS5cIixcbiAgICBJbmRleFNpZ25hdHVyZUhhc1N0YXRpYzpcbiAgICAgIFwiSW5kZXggc2lnbmF0dXJlcyBjYW5ub3QgaGF2ZSB0aGUgJ3N0YXRpYycgbW9kaWZpZXIuXCIsXG4gICAgSW52YWxpZE1vZGlmaWVyT25UeXBlTWVtYmVyOlxuICAgICAgXCInJTAnIG1vZGlmaWVyIGNhbm5vdCBhcHBlYXIgb24gYSB0eXBlIG1lbWJlci5cIixcbiAgICBJbnZhbGlkTW9kaWZpZXJzT3JkZXI6IFwiJyUwJyBtb2RpZmllciBtdXN0IHByZWNlZGUgJyUxJyBtb2RpZmllci5cIixcbiAgICBJbnZhbGlkVHVwbGVNZW1iZXJMYWJlbDpcbiAgICAgIFwiVHVwbGUgbWVtYmVycyBtdXN0IGJlIGxhYmVsZWQgd2l0aCBhIHNpbXBsZSBpZGVudGlmaWVyLlwiLFxuICAgIE1peGVkTGFiZWxlZEFuZFVubGFiZWxlZEVsZW1lbnRzOlxuICAgICAgXCJUdXBsZSBtZW1iZXJzIG11c3QgYWxsIGhhdmUgbmFtZXMgb3IgYWxsIG5vdCBoYXZlIG5hbWVzLlwiLFxuICAgIE5vbkFic3RyYWN0Q2xhc3NIYXNBYnN0cmFjdE1ldGhvZDpcbiAgICAgIFwiQWJzdHJhY3QgbWV0aG9kcyBjYW4gb25seSBhcHBlYXIgd2l0aGluIGFuIGFic3RyYWN0IGNsYXNzLlwiLFxuICAgIE5vbkNsYXNzTWV0aG9kUHJvcGVydHlIYXNBYnN0cmFjdE1vZGlmZXI6XG4gICAgICBcIidhYnN0cmFjdCcgbW9kaWZpZXIgY2FuIG9ubHkgYXBwZWFyIG9uIGEgY2xhc3MsIG1ldGhvZCwgb3IgcHJvcGVydHkgZGVjbGFyYXRpb24uXCIsXG4gICAgT3B0aW9uYWxUeXBlQmVmb3JlUmVxdWlyZWQ6XG4gICAgICBcIkEgcmVxdWlyZWQgZWxlbWVudCBjYW5ub3QgZm9sbG93IGFuIG9wdGlvbmFsIGVsZW1lbnQuXCIsXG4gICAgT3ZlcnJpZGVOb3RJblN1YkNsYXNzOlxuICAgICAgXCJUaGlzIG1lbWJlciBjYW5ub3QgaGF2ZSBhbiAnb3ZlcnJpZGUnIG1vZGlmaWVyIGJlY2F1c2UgaXRzIGNvbnRhaW5pbmcgY2xhc3MgZG9lcyBub3QgZXh0ZW5kIGFub3RoZXIgY2xhc3MuXCIsXG4gICAgUGF0dGVybklzT3B0aW9uYWw6XG4gICAgICBcIkEgYmluZGluZyBwYXR0ZXJuIHBhcmFtZXRlciBjYW5ub3QgYmUgb3B0aW9uYWwgaW4gYW4gaW1wbGVtZW50YXRpb24gc2lnbmF0dXJlLlwiLFxuICAgIFByaXZhdGVFbGVtZW50SGFzQWJzdHJhY3Q6XG4gICAgICBcIlByaXZhdGUgZWxlbWVudHMgY2Fubm90IGhhdmUgdGhlICdhYnN0cmFjdCcgbW9kaWZpZXIuXCIsXG4gICAgUHJpdmF0ZUVsZW1lbnRIYXNBY2Nlc3NpYmlsaXR5OlxuICAgICAgXCJQcml2YXRlIGVsZW1lbnRzIGNhbm5vdCBoYXZlIGFuIGFjY2Vzc2liaWxpdHkgbW9kaWZpZXIgKCclMCcpLlwiLFxuICAgIFJlYWRvbmx5Rm9yTWV0aG9kU2lnbmF0dXJlOlxuICAgICAgXCIncmVhZG9ubHknIG1vZGlmaWVyIGNhbiBvbmx5IGFwcGVhciBvbiBhIHByb3BlcnR5IGRlY2xhcmF0aW9uIG9yIGluZGV4IHNpZ25hdHVyZS5cIixcbiAgICBTZXRBY2Nlc29yQ2Fubm90SGF2ZU9wdGlvbmFsUGFyYW1ldGVyOlxuICAgICAgXCJBICdzZXQnIGFjY2Vzc29yIGNhbm5vdCBoYXZlIGFuIG9wdGlvbmFsIHBhcmFtZXRlci5cIixcbiAgICBTZXRBY2Nlc29yQ2Fubm90SGF2ZVJlc3RQYXJhbWV0ZXI6XG4gICAgICBcIkEgJ3NldCcgYWNjZXNzb3IgY2Fubm90IGhhdmUgcmVzdCBwYXJhbWV0ZXIuXCIsXG4gICAgU2V0QWNjZXNvckNhbm5vdEhhdmVSZXR1cm5UeXBlOlxuICAgICAgXCJBICdzZXQnIGFjY2Vzc29yIGNhbm5vdCBoYXZlIGEgcmV0dXJuIHR5cGUgYW5ub3RhdGlvbi5cIixcbiAgICBTdGF0aWNCbG9ja0Nhbm5vdEhhdmVNb2RpZmllcjpcbiAgICAgIFwiU3RhdGljIGNsYXNzIGJsb2NrcyBjYW5ub3QgaGF2ZSBhbnkgbW9kaWZpZXIuXCIsXG4gICAgVHlwZUFubm90YXRpb25BZnRlckFzc2lnbjpcbiAgICAgIFwiVHlwZSBhbm5vdGF0aW9ucyBtdXN0IGNvbWUgYmVmb3JlIGRlZmF1bHQgYXNzaWdubWVudHMsIGUuZy4gaW5zdGVhZCBvZiBgYWdlID0gMjU6IG51bWJlcmAgdXNlIGBhZ2U6IG51bWJlciA9IDI1YC5cIixcbiAgICBUeXBlSW1wb3J0Q2Fubm90U3BlY2lmeURlZmF1bHRBbmROYW1lZDpcbiAgICAgIFwiQSB0eXBlLW9ubHkgaW1wb3J0IGNhbiBzcGVjaWZ5IGEgZGVmYXVsdCBpbXBvcnQgb3IgbmFtZWQgYmluZGluZ3MsIGJ1dCBub3QgYm90aC5cIixcbiAgICBVbmV4cGVjdGVkUGFyYW1ldGVyTW9kaWZpZXI6XG4gICAgICBcIkEgcGFyYW1ldGVyIHByb3BlcnR5IGlzIG9ubHkgYWxsb3dlZCBpbiBhIGNvbnN0cnVjdG9yIGltcGxlbWVudGF0aW9uLlwiLFxuICAgIFVuZXhwZWN0ZWRSZWFkb25seTpcbiAgICAgIFwiJ3JlYWRvbmx5JyB0eXBlIG1vZGlmaWVyIGlzIG9ubHkgcGVybWl0dGVkIG9uIGFycmF5IGFuZCB0dXBsZSBsaXRlcmFsIHR5cGVzLlwiLFxuICAgIFVuZXhwZWN0ZWRUeXBlQW5ub3RhdGlvbjogXCJEaWQgbm90IGV4cGVjdCBhIHR5cGUgYW5ub3RhdGlvbiBoZXJlLlwiLFxuICAgIFVuZXhwZWN0ZWRUeXBlQ2FzdEluUGFyYW1ldGVyOlxuICAgICAgXCJVbmV4cGVjdGVkIHR5cGUgY2FzdCBpbiBwYXJhbWV0ZXIgcG9zaXRpb24uXCIsXG4gICAgVW5zdXBwb3J0ZWRJbXBvcnRUeXBlQXJndW1lbnQ6XG4gICAgICBcIkFyZ3VtZW50IGluIGEgdHlwZSBpbXBvcnQgbXVzdCBiZSBhIHN0cmluZyBsaXRlcmFsLlwiLFxuICAgIFVuc3VwcG9ydGVkUGFyYW1ldGVyUHJvcGVydHlLaW5kOlxuICAgICAgXCJBIHBhcmFtZXRlciBwcm9wZXJ0eSBtYXkgbm90IGJlIGRlY2xhcmVkIHVzaW5nIGEgYmluZGluZyBwYXR0ZXJuLlwiLFxuICAgIFVuc3VwcG9ydGVkU2lnbmF0dXJlUGFyYW1ldGVyS2luZDpcbiAgICAgIFwiTmFtZSBpbiBhIHNpZ25hdHVyZSBtdXN0IGJlIGFuIElkZW50aWZpZXIsIE9iamVjdFBhdHRlcm4gb3IgQXJyYXlQYXR0ZXJuLCBpbnN0ZWFkIGdvdCAlMC5cIixcbiAgfSxcbiAgLyogY29kZSAqLyBFcnJvckNvZGVzLlN5bnRheEVycm9yLFxuKTtcbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG4vLyBEb2Vzbid0IGhhbmRsZSBcInZvaWRcIiBvciBcIm51bGxcIiBiZWNhdXNlIHRob3NlIGFyZSBrZXl3b3Jkcywgbm90IGlkZW50aWZpZXJzLlxuLy8gSXQgYWxzbyBkb2Vzbid0IGhhbmRsZSBcImludHJpbnNpY1wiLCBzaW5jZSB1c3VhbGx5IGl0J3Mgbm90IGEga2V5d29yZC5cbmZ1bmN0aW9uIGtleXdvcmRUeXBlRnJvbU5hbWUoXG4gIHZhbHVlOiBzdHJpbmcsXG4pOiBOLlRzS2V5d29yZFR5cGVUeXBlIHwgdHlwZW9mIHVuZGVmaW5lZCB7XG4gIHN3aXRjaCAodmFsdWUpIHtcbiAgICBjYXNlIFwiYW55XCI6XG4gICAgICByZXR1cm4gXCJUU0FueUtleXdvcmRcIjtcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgcmV0dXJuIFwiVFNCb29sZWFuS2V5d29yZFwiO1xuICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICAgIHJldHVybiBcIlRTQmlnSW50S2V5d29yZFwiO1xuICAgIGNhc2UgXCJuZXZlclwiOlxuICAgICAgcmV0dXJuIFwiVFNOZXZlcktleXdvcmRcIjtcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gXCJUU051bWJlcktleXdvcmRcIjtcbiAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICByZXR1cm4gXCJUU09iamVjdEtleXdvcmRcIjtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gXCJUU1N0cmluZ0tleXdvcmRcIjtcbiAgICBjYXNlIFwic3ltYm9sXCI6XG4gICAgICByZXR1cm4gXCJUU1N5bWJvbEtleXdvcmRcIjtcbiAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgICByZXR1cm4gXCJUU1VuZGVmaW5lZEtleXdvcmRcIjtcbiAgICBjYXNlIFwidW5rbm93blwiOlxuICAgICAgcmV0dXJuIFwiVFNVbmtub3duS2V5d29yZFwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRzSXNBY2Nlc3NNb2RpZmllcihtb2RpZmllcjogc3RyaW5nKTogYm9vbGVhbiAlY2hlY2tzIHtcbiAgcmV0dXJuIChcbiAgICBtb2RpZmllciA9PT0gXCJwcml2YXRlXCIgfHwgbW9kaWZpZXIgPT09IFwicHVibGljXCIgfHwgbW9kaWZpZXIgPT09IFwicHJvdGVjdGVkXCJcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgKHN1cGVyQ2xhc3M6IENsYXNzPFBhcnNlcj4pOiBDbGFzczxQYXJzZXI+ID0+XG4gIGNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG4gICAgZ2V0U2NvcGVIYW5kbGVyKCk6IENsYXNzPFR5cGVTY3JpcHRTY29wZUhhbmRsZXI+IHtcbiAgICAgIHJldHVybiBUeXBlU2NyaXB0U2NvcGVIYW5kbGVyO1xuICAgIH1cblxuICAgIHRzSXNJZGVudGlmaWVyKCk6IGJvb2xlYW4ge1xuICAgICAgLy8gVE9ETzogYWN0dWFsbHkgYSBiaXQgbW9yZSBjb21wbGV4IGluIFR5cGVTY3JpcHQsIGJ1dCBzaG91bGRuJ3QgbWF0dGVyLlxuICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMTUwMDhcbiAgICAgIHJldHVybiB0aGlzLm1hdGNoKHR0Lm5hbWUpO1xuICAgIH1cblxuICAgIHRzVG9rZW5DYW5Gb2xsb3dNb2RpZmllcigpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICh0aGlzLm1hdGNoKHR0LmJyYWNrZXRMKSB8fFxuICAgICAgICAgIHRoaXMubWF0Y2godHQuYnJhY2VMKSB8fFxuICAgICAgICAgIHRoaXMubWF0Y2godHQuc3RhcikgfHxcbiAgICAgICAgICB0aGlzLm1hdGNoKHR0LmVsbGlwc2lzKSB8fFxuICAgICAgICAgIHRoaXMubWF0Y2godHQucHJpdmF0ZU5hbWUpIHx8XG4gICAgICAgICAgdGhpcy5pc0xpdGVyYWxQcm9wZXJ0eU5hbWUoKSkgJiZcbiAgICAgICAgIXRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHNOZXh0VG9rZW5DYW5Gb2xsb3dNb2RpZmllcigpIHtcbiAgICAgIC8vIE5vdGU6IFR5cGVTY3JpcHQncyBpbXBsZW1lbnRhdGlvbiBpcyBtdWNoIG1vcmUgY29tcGxpY2F0ZWQgYmVjYXVzZVxuICAgICAgLy8gbW9yZSB0aGluZ3MgYXJlIGNvbnNpZGVyZWQgbW9kaWZpZXJzIHRoZXJlLlxuICAgICAgLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBvbmx5IGhhbmRsZXMgbW9kaWZpZXJzIG5vdCBoYW5kbGVkIGJ5IEBiYWJlbC9wYXJzZXIgaXRzZWxmLiBBbmQgXCJzdGF0aWNcIi5cbiAgICAgIC8vIFRPRE86IFdvdWxkIGJlIG5pY2UgdG8gYXZvaWQgbG9va2FoZWFkLiBXYW50IGEgaGFzTGluZUJyZWFrVXBOZXh0KCkgbWV0aG9kLi4uXG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIHJldHVybiB0aGlzLnRzVG9rZW5DYW5Gb2xsb3dNb2RpZmllcigpO1xuICAgIH1cblxuICAgIC8qKiBQYXJzZXMgYSBtb2RpZmllciBtYXRjaGluZyBvbmUgdGhlIGdpdmVuIG1vZGlmaWVyIG5hbWVzLiAqL1xuICAgIHRzUGFyc2VNb2RpZmllcjxUOiBUc01vZGlmaWVyPihhbGxvd2VkTW9kaWZpZXJzOiBUW10pOiA/VCB7XG4gICAgICBpZiAoIXRoaXMubWF0Y2godHQubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9kaWZpZXIgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBhbGxvd2VkTW9kaWZpZXJzLmluZGV4T2YobW9kaWZpZXIpICE9PSAtMSAmJlxuICAgICAgICB0aGlzLnRzVHJ5UGFyc2UodGhpcy50c05leHRUb2tlbkNhbkZvbGxvd01vZGlmaWVyLmJpbmQodGhpcykpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKiogUGFyc2VzIGEgbGlzdCBvZiBtb2RpZmllcnMsIGluIGFueSBvcmRlci5cbiAgICAgKiAgSWYgeW91IG5lZWQgYSBzcGVjaWZpYyBvcmRlciwgeW91IG11c3QgY2FsbCB0aGlzIGZ1bmN0aW9uIG11bHRpcGxlIHRpbWVzOlxuICAgICAqICAgIHRoaXMudHNQYXJzZU1vZGlmaWVycyhub2RlLCBbXCJwdWJsaWNcIl0pO1xuICAgICAqICAgIHRoaXMudHNQYXJzZU1vZGlmaWVycyhub2RlLCBbXCJhYnN0cmFjdFwiLCBcInJlYWRvbmx5XCJdKTtcbiAgICAgKi9cbiAgICB0c1BhcnNlTW9kaWZpZXJzKFxuICAgICAgbW9kaWZpZWQ6IHtcbiAgICAgICAgW2tleTogVHNNb2RpZmllcl06ID90cnVlLFxuICAgICAgICBhY2Nlc3NpYmlsaXR5PzogTi5BY2Nlc3NpYmlsaXR5LFxuICAgICAgfSxcbiAgICAgIGFsbG93ZWRNb2RpZmllcnM6IFRzTW9kaWZpZXJbXSxcbiAgICAgIGRpc2FsbG93ZWRNb2RpZmllcnM/OiBUc01vZGlmaWVyW10sXG4gICAgICBlcnJvclRlbXBsYXRlPzogRXJyb3JUZW1wbGF0ZSxcbiAgICApOiB2b2lkIHtcbiAgICAgIGNvbnN0IGVuZm9yY2VPcmRlciA9IChwb3MsIG1vZGlmaWVyLCBiZWZvcmUsIGFmdGVyKSA9PiB7XG4gICAgICAgIGlmIChtb2RpZmllciA9PT0gYmVmb3JlICYmIG1vZGlmaWVkW2FmdGVyXSkge1xuICAgICAgICAgIHRoaXMucmFpc2UocG9zLCBUU0Vycm9ycy5JbnZhbGlkTW9kaWZpZXJzT3JkZXIsIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgaW5jb21wYXRpYmxlID0gKHBvcywgbW9kaWZpZXIsIG1vZDEsIG1vZDIpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChtb2RpZmllZFttb2QxXSAmJiBtb2RpZmllciA9PT0gbW9kMikgfHxcbiAgICAgICAgICAobW9kaWZpZWRbbW9kMl0gJiYgbW9kaWZpZXIgPT09IG1vZDEpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucmFpc2UocG9zLCBUU0Vycm9ycy5JbmNvbXBhdGlibGVNb2RpZmllcnMsIG1vZDEsIG1vZDIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb3IgKDs7KSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgICAgY29uc3QgbW9kaWZpZXI6ID9Uc01vZGlmaWVyID0gdGhpcy50c1BhcnNlTW9kaWZpZXIoXG4gICAgICAgICAgYWxsb3dlZE1vZGlmaWVycy5jb25jYXQoZGlzYWxsb3dlZE1vZGlmaWVycyA/PyBbXSksXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFtb2RpZmllcikgYnJlYWs7XG5cbiAgICAgICAgaWYgKHRzSXNBY2Nlc3NNb2RpZmllcihtb2RpZmllcikpIHtcbiAgICAgICAgICBpZiAobW9kaWZpZWQuYWNjZXNzaWJpbGl0eSkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShzdGFydFBvcywgVFNFcnJvcnMuRHVwbGljYXRlQWNjZXNzaWJpbGl0eU1vZGlmaWVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5mb3JjZU9yZGVyKHN0YXJ0UG9zLCBtb2RpZmllciwgbW9kaWZpZXIsIFwib3ZlcnJpZGVcIik7XG4gICAgICAgICAgICBlbmZvcmNlT3JkZXIoc3RhcnRQb3MsIG1vZGlmaWVyLCBtb2RpZmllciwgXCJzdGF0aWNcIik7XG4gICAgICAgICAgICBlbmZvcmNlT3JkZXIoc3RhcnRQb3MsIG1vZGlmaWVyLCBtb2RpZmllciwgXCJyZWFkb25seVwiKTtcblxuICAgICAgICAgICAgbW9kaWZpZWQuYWNjZXNzaWJpbGl0eSA9IG1vZGlmaWVyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kaWZpZWQsIG1vZGlmaWVyKSkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShzdGFydFBvcywgVFNFcnJvcnMuRHVwbGljYXRlTW9kaWZpZXIsIG1vZGlmaWVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZW5mb3JjZU9yZGVyKHN0YXJ0UG9zLCBtb2RpZmllciwgXCJzdGF0aWNcIiwgXCJyZWFkb25seVwiKTtcbiAgICAgICAgICAgIGVuZm9yY2VPcmRlcihzdGFydFBvcywgbW9kaWZpZXIsIFwic3RhdGljXCIsIFwib3ZlcnJpZGVcIik7XG4gICAgICAgICAgICBlbmZvcmNlT3JkZXIoc3RhcnRQb3MsIG1vZGlmaWVyLCBcIm92ZXJyaWRlXCIsIFwicmVhZG9ubHlcIik7XG4gICAgICAgICAgICBlbmZvcmNlT3JkZXIoc3RhcnRQb3MsIG1vZGlmaWVyLCBcImFic3RyYWN0XCIsIFwib3ZlcnJpZGVcIik7XG5cbiAgICAgICAgICAgIGluY29tcGF0aWJsZShzdGFydFBvcywgbW9kaWZpZXIsIFwiZGVjbGFyZVwiLCBcIm92ZXJyaWRlXCIpO1xuICAgICAgICAgICAgaW5jb21wYXRpYmxlKHN0YXJ0UG9zLCBtb2RpZmllciwgXCJzdGF0aWNcIiwgXCJhYnN0cmFjdFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbW9kaWZpZWRbbW9kaWZpZXJdID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkaXNhbGxvd2VkTW9kaWZpZXJzPy5pbmNsdWRlcyhtb2RpZmllcikpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgc3RhcnRQb3MsXG4gICAgICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICAgICAgZXJyb3JUZW1wbGF0ZSxcbiAgICAgICAgICAgIG1vZGlmaWVyLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0c0lzTGlzdFRlcm1pbmF0b3Ioa2luZDogUGFyc2luZ0NvbnRleHQpOiBib29sZWFuIHtcbiAgICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgICBjYXNlIFwiRW51bU1lbWJlcnNcIjpcbiAgICAgICAgY2FzZSBcIlR5cGVNZW1iZXJzXCI6XG4gICAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2godHQuYnJhY2VSKTtcbiAgICAgICAgY2FzZSBcIkhlcml0YWdlQ2xhdXNlRWxlbWVudFwiOlxuICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoKHR0LmJyYWNlTCk7XG4gICAgICAgIGNhc2UgXCJUdXBsZUVsZW1lbnRUeXBlc1wiOlxuICAgICAgICAgIHJldHVybiB0aGlzLm1hdGNoKHR0LmJyYWNrZXRSKTtcbiAgICAgICAgY2FzZSBcIlR5cGVQYXJhbWV0ZXJzT3JBcmd1bWVudHNcIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy5pc1JlbGF0aW9uYWwoXCI+XCIpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnJlYWNoYWJsZVwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlTGlzdDxUOiBOLk5vZGU+KGtpbmQ6IFBhcnNpbmdDb250ZXh0LCBwYXJzZUVsZW1lbnQ6ICgpID0+IFQpOiBUW10ge1xuICAgICAgY29uc3QgcmVzdWx0OiBUW10gPSBbXTtcbiAgICAgIHdoaWxlICghdGhpcy50c0lzTGlzdFRlcm1pbmF0b3Ioa2luZCkpIHtcbiAgICAgICAgLy8gU2tpcHBpbmcgXCJwYXJzZUxpc3RFbGVtZW50XCIgZnJvbSB0aGUgVFMgc291cmNlIHNpbmNlIHRoYXQncyBqdXN0IGZvciBlcnJvciBoYW5kbGluZy5cbiAgICAgICAgcmVzdWx0LnB1c2gocGFyc2VFbGVtZW50KCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICB0c1BhcnNlRGVsaW1pdGVkTGlzdDxUOiBOLk5vZGU+KFxuICAgICAga2luZDogUGFyc2luZ0NvbnRleHQsXG4gICAgICBwYXJzZUVsZW1lbnQ6ICgpID0+IFQsXG4gICAgKTogVFtdIHtcbiAgICAgIHJldHVybiBub25OdWxsKFxuICAgICAgICB0aGlzLnRzUGFyc2VEZWxpbWl0ZWRMaXN0V29ya2VyKFxuICAgICAgICAgIGtpbmQsXG4gICAgICAgICAgcGFyc2VFbGVtZW50LFxuICAgICAgICAgIC8qIGV4cGVjdFN1Y2Nlc3MgKi8gdHJ1ZSxcbiAgICAgICAgKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgIWV4cGVjdFN1Y2Nlc3MsIHJldHVybnMgdW5kZWZpbmVkIGluc3RlYWQgb2YgZmFpbGluZyB0byBwYXJzZS5cbiAgICAgKiBJZiBleHBlY3RTdWNjZXNzLCBwYXJzZUVsZW1lbnQgc2hvdWxkIGFsd2F5cyByZXR1cm4gYSBkZWZpbmVkIHZhbHVlLlxuICAgICAqL1xuICAgIHRzUGFyc2VEZWxpbWl0ZWRMaXN0V29ya2VyPFQ6IE4uTm9kZT4oXG4gICAgICBraW5kOiBQYXJzaW5nQ29udGV4dCxcbiAgICAgIHBhcnNlRWxlbWVudDogKCkgPT4gP1QsXG4gICAgICBleHBlY3RTdWNjZXNzOiBib29sZWFuLFxuICAgICk6ID8oVFtdKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgICAgZm9yICg7Oykge1xuICAgICAgICBpZiAodGhpcy50c0lzTGlzdFRlcm1pbmF0b3Ioa2luZCkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBwYXJzZUVsZW1lbnQoKTtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0LnB1c2goZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZWF0KHR0LmNvbW1hKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudHNJc0xpc3RUZXJtaW5hdG9yKGtpbmQpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXhwZWN0U3VjY2Vzcykge1xuICAgICAgICAgIC8vIFRoaXMgd2lsbCBmYWlsIHdpdGggYW4gZXJyb3IgYWJvdXQgYSBtaXNzaW5nIGNvbW1hXG4gICAgICAgICAgdGhpcy5leHBlY3QodHQuY29tbWEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdHNQYXJzZUJyYWNrZXRlZExpc3Q8VDogTi5Ob2RlPihcbiAgICAgIGtpbmQ6IFBhcnNpbmdDb250ZXh0LFxuICAgICAgcGFyc2VFbGVtZW50OiAoKSA9PiBULFxuICAgICAgYnJhY2tldDogYm9vbGVhbixcbiAgICAgIHNraXBGaXJzdFRva2VuOiBib29sZWFuLFxuICAgICk6IFRbXSB7XG4gICAgICBpZiAoIXNraXBGaXJzdFRva2VuKSB7XG4gICAgICAgIGlmIChicmFja2V0KSB7XG4gICAgICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2tldEwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXhwZWN0UmVsYXRpb25hbChcIjxcIik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy50c1BhcnNlRGVsaW1pdGVkTGlzdChraW5kLCBwYXJzZUVsZW1lbnQpO1xuXG4gICAgICBpZiAoYnJhY2tldCkge1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5icmFja2V0Uik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV4cGVjdFJlbGF0aW9uYWwoXCI+XCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHRzUGFyc2VJbXBvcnRUeXBlKCk6IE4uVHNJbXBvcnRUeXBlIHtcbiAgICAgIGNvbnN0IG5vZGU6IE4uVHNJbXBvcnRUeXBlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0Ll9pbXBvcnQpO1xuICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5MKTtcbiAgICAgIGlmICghdGhpcy5tYXRjaCh0dC5zdHJpbmcpKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgVFNFcnJvcnMuVW5zdXBwb3J0ZWRJbXBvcnRUeXBlQXJndW1lbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBGb3IgY29tcGF0aWJpbGl0eSB0byBlc3RyZWUgd2UgY2Fubm90IGNhbGwgcGFyc2VMaXRlcmFsIGRpcmVjdGx5IGhlcmVcbiAgICAgIG5vZGUuYXJndW1lbnQgPSB0aGlzLnBhcnNlRXhwckF0b20oKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuUik7XG5cbiAgICAgIGlmICh0aGlzLmVhdCh0dC5kb3QpKSB7XG4gICAgICAgIG5vZGUucXVhbGlmaWVyID0gdGhpcy50c1BhcnNlRW50aXR5TmFtZSgvKiBhbGxvd1Jlc2VydmVkV29yZHMgKi8gdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLnRzUGFyc2VUeXBlQXJndW1lbnRzKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNJbXBvcnRUeXBlXCIpO1xuICAgIH1cblxuICAgIHRzUGFyc2VFbnRpdHlOYW1lKGFsbG93UmVzZXJ2ZWRXb3JkczogYm9vbGVhbik6IE4uVHNFbnRpdHlOYW1lIHtcbiAgICAgIGxldCBlbnRpdHk6IE4uVHNFbnRpdHlOYW1lID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIHdoaWxlICh0aGlzLmVhdCh0dC5kb3QpKSB7XG4gICAgICAgIGNvbnN0IG5vZGU6IE4uVHNRdWFsaWZpZWROYW1lID0gdGhpcy5zdGFydE5vZGVBdE5vZGUoZW50aXR5KTtcbiAgICAgICAgbm9kZS5sZWZ0ID0gZW50aXR5O1xuICAgICAgICBub2RlLnJpZ2h0ID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoYWxsb3dSZXNlcnZlZFdvcmRzKTtcbiAgICAgICAgZW50aXR5ID0gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNRdWFsaWZpZWROYW1lXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICB9XG5cbiAgICB0c1BhcnNlVHlwZVJlZmVyZW5jZSgpOiBOLlRzVHlwZVJlZmVyZW5jZSB7XG4gICAgICBjb25zdCBub2RlOiBOLlRzVHlwZVJlZmVyZW5jZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBub2RlLnR5cGVOYW1lID0gdGhpcy50c1BhcnNlRW50aXR5TmFtZSgvKiBhbGxvd1Jlc2VydmVkV29yZHMgKi8gZmFsc2UpO1xuICAgICAgaWYgKCF0aGlzLmhhc1ByZWNlZGluZ0xpbmVCcmVhaygpICYmIHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdGhpcy50c1BhcnNlVHlwZUFyZ3VtZW50cygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZVJlZmVyZW5jZVwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlVGhpc1R5cGVQcmVkaWNhdGUobGhzOiBOLlRzVGhpc1R5cGUpOiBOLlRzVHlwZVByZWRpY2F0ZSB7XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIGNvbnN0IG5vZGU6IE4uVHNUeXBlUHJlZGljYXRlID0gdGhpcy5zdGFydE5vZGVBdE5vZGUobGhzKTtcbiAgICAgIG5vZGUucGFyYW1ldGVyTmFtZSA9IGxocztcbiAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLnRzUGFyc2VUeXBlQW5ub3RhdGlvbigvKiBlYXRDb2xvbiAqLyBmYWxzZSk7XG4gICAgICBub2RlLmFzc2VydHMgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUU1R5cGVQcmVkaWNhdGVcIik7XG4gICAgfVxuXG4gICAgdHNQYXJzZVRoaXNUeXBlTm9kZSgpOiBOLlRzVGhpc1R5cGUge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc1RoaXNUeXBlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVGhpc1R5cGVcIik7XG4gICAgfVxuXG4gICAgdHNQYXJzZVR5cGVRdWVyeSgpOiBOLlRzVHlwZVF1ZXJ5IHtcbiAgICAgIGNvbnN0IG5vZGU6IE4uVHNUeXBlUXVlcnkgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5leHBlY3QodHQuX3R5cGVvZik7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5faW1wb3J0KSkge1xuICAgICAgICBub2RlLmV4cHJOYW1lID0gdGhpcy50c1BhcnNlSW1wb3J0VHlwZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5leHByTmFtZSA9IHRoaXMudHNQYXJzZUVudGl0eU5hbWUoLyogYWxsb3dSZXNlcnZlZFdvcmRzICovIHRydWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZVF1ZXJ5XCIpO1xuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlUGFyYW1ldGVyKCk6IE4uVHNUeXBlUGFyYW1ldGVyIHtcbiAgICAgIGNvbnN0IG5vZGU6IE4uVHNUeXBlUGFyYW1ldGVyID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIG5vZGUubmFtZSA9IHRoaXMucGFyc2VJZGVudGlmaWVyTmFtZShub2RlLnN0YXJ0KTtcbiAgICAgIG5vZGUuY29uc3RyYWludCA9IHRoaXMudHNFYXRUaGVuUGFyc2VUeXBlKHR0Ll9leHRlbmRzKTtcbiAgICAgIG5vZGUuZGVmYXVsdCA9IHRoaXMudHNFYXRUaGVuUGFyc2VUeXBlKHR0LmVxKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUU1R5cGVQYXJhbWV0ZXJcIik7XG4gICAgfVxuXG4gICAgdHNUcnlQYXJzZVR5cGVQYXJhbWV0ZXJzKCk6ID9OLlRzVHlwZVBhcmFtZXRlckRlY2xhcmF0aW9uIHtcbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZVR5cGVQYXJhbWV0ZXJzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHNQYXJzZVR5cGVQYXJhbWV0ZXJzKCkge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc1R5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvbiA9IHRoaXMuc3RhcnROb2RlKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikgfHwgdGhpcy5tYXRjaCh0dC5qc3hUYWdTdGFydCkpIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5wYXJhbXMgPSB0aGlzLnRzUGFyc2VCcmFja2V0ZWRMaXN0KFxuICAgICAgICBcIlR5cGVQYXJhbWV0ZXJzT3JBcmd1bWVudHNcIixcbiAgICAgICAgdGhpcy50c1BhcnNlVHlwZVBhcmFtZXRlci5iaW5kKHRoaXMpLFxuICAgICAgICAvKiBicmFja2V0ICovIGZhbHNlLFxuICAgICAgICAvKiBza2lwRmlyc3RUb2tlbiAqLyB0cnVlLFxuICAgICAgKTtcbiAgICAgIGlmIChub2RlLnBhcmFtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBUU0Vycm9ycy5FbXB0eVR5cGVQYXJhbWV0ZXJzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUU1R5cGVQYXJhbWV0ZXJEZWNsYXJhdGlvblwiKTtcbiAgICB9XG5cbiAgICB0c1RyeU5leHRQYXJzZUNvbnN0YW50Q29udGV4dCgpOiA/Ti5Uc1R5cGVSZWZlcmVuY2Uge1xuICAgICAgaWYgKHRoaXMubG9va2FoZWFkKCkudHlwZSA9PT0gdHQuX2NvbnN0KSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlVHlwZVJlZmVyZW5jZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogSW4gVHlwZVNjcmlwdCBpbXBsZW1lbnRhdGlvbiB3ZSBtdXN0IHByb3ZpZGUgYHlpZWxkQ29udGV4dGAgYW5kIGBhd2FpdENvbnRleHRgLFxuICAgIC8vIGJ1dCBoZXJlIGl0J3MgYWx3YXlzIGZhbHNlLCBiZWNhdXNlIHRoaXMgaXMgb25seSB1c2VkIGZvciB0eXBlcy5cbiAgICB0c0ZpbGxTaWduYXR1cmUoXG4gICAgICByZXR1cm5Ub2tlbjogVG9rZW5UeXBlLFxuICAgICAgc2lnbmF0dXJlOiBOLlRzU2lnbmF0dXJlRGVjbGFyYXRpb24sXG4gICAgKTogdm9pZCB7XG4gICAgICAvLyBBcnJvdyBmbnMgKm11c3QqIGhhdmUgcmV0dXJuIHRva2VuIChgPT5gKS4gTm9ybWFsIGZ1bmN0aW9ucyBjYW4gb21pdCBpdC5cbiAgICAgIGNvbnN0IHJldHVyblRva2VuUmVxdWlyZWQgPSByZXR1cm5Ub2tlbiA9PT0gdHQuYXJyb3c7XG4gICAgICBzaWduYXR1cmUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLnRzVHJ5UGFyc2VUeXBlUGFyYW1ldGVycygpO1xuICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5MKTtcbiAgICAgIHNpZ25hdHVyZS5wYXJhbWV0ZXJzID0gdGhpcy50c1BhcnNlQmluZGluZ0xpc3RGb3JTaWduYXR1cmUoKTtcbiAgICAgIGlmIChyZXR1cm5Ub2tlblJlcXVpcmVkKSB7XG4gICAgICAgIHNpZ25hdHVyZS50eXBlQW5ub3RhdGlvbiA9XG4gICAgICAgICAgdGhpcy50c1BhcnNlVHlwZU9yVHlwZVByZWRpY2F0ZUFubm90YXRpb24ocmV0dXJuVG9rZW4pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHJldHVyblRva2VuKSkge1xuICAgICAgICBzaWduYXR1cmUudHlwZUFubm90YXRpb24gPVxuICAgICAgICAgIHRoaXMudHNQYXJzZVR5cGVPclR5cGVQcmVkaWNhdGVBbm5vdGF0aW9uKHJldHVyblRva2VuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0c1BhcnNlQmluZGluZ0xpc3RGb3JTaWduYXR1cmUoKTogJFJlYWRPbmx5QXJyYXk8XG4gICAgICBOLklkZW50aWZpZXIgfCBOLlJlc3RFbGVtZW50IHwgTi5PYmplY3RQYXR0ZXJuIHwgTi5BcnJheVBhdHRlcm4sXG4gICAgPiB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZUJpbmRpbmdMaXN0KHR0LnBhcmVuUiwgY2hhckNvZGVzLnJpZ2h0UGFyZW50aGVzaXMpLm1hcChcbiAgICAgICAgcGF0dGVybiA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgcGF0dGVybi50eXBlICE9PSBcIklkZW50aWZpZXJcIiAmJlxuICAgICAgICAgICAgcGF0dGVybi50eXBlICE9PSBcIlJlc3RFbGVtZW50XCIgJiZcbiAgICAgICAgICAgIHBhdHRlcm4udHlwZSAhPT0gXCJPYmplY3RQYXR0ZXJuXCIgJiZcbiAgICAgICAgICAgIHBhdHRlcm4udHlwZSAhPT0gXCJBcnJheVBhdHRlcm5cIlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgcGF0dGVybi5zdGFydCxcbiAgICAgICAgICAgICAgVFNFcnJvcnMuVW5zdXBwb3J0ZWRTaWduYXR1cmVQYXJhbWV0ZXJLaW5kLFxuICAgICAgICAgICAgICBwYXR0ZXJuLnR5cGUsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHBhdHRlcm46IGFueSk7XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlTWVtYmVyU2VtaWNvbG9uKCk6IHZvaWQge1xuICAgICAgaWYgKCF0aGlzLmVhdCh0dC5jb21tYSkgJiYgIXRoaXMuaXNMaW5lVGVybWluYXRvcigpKSB7XG4gICAgICAgIHRoaXMuZXhwZWN0KHR0LnNlbWkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRzUGFyc2VTaWduYXR1cmVNZW1iZXIoXG4gICAgICBraW5kOiBcIlRTQ2FsbFNpZ25hdHVyZURlY2xhcmF0aW9uXCIgfCBcIlRTQ29uc3RydWN0U2lnbmF0dXJlRGVjbGFyYXRpb25cIixcbiAgICAgIG5vZGU6IE4uVHNDYWxsU2lnbmF0dXJlRGVjbGFyYXRpb24gfCBOLlRzQ29uc3RydWN0U2lnbmF0dXJlRGVjbGFyYXRpb24sXG4gICAgKTogTi5Uc0NhbGxTaWduYXR1cmVEZWNsYXJhdGlvbiB8IE4uVHNDb25zdHJ1Y3RTaWduYXR1cmVEZWNsYXJhdGlvbiB7XG4gICAgICB0aGlzLnRzRmlsbFNpZ25hdHVyZSh0dC5jb2xvbiwgbm9kZSk7XG4gICAgICB0aGlzLnRzUGFyc2VUeXBlTWVtYmVyU2VtaWNvbG9uKCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIGtpbmQpO1xuICAgIH1cblxuICAgIHRzSXNVbmFtYmlndW91c2x5SW5kZXhTaWduYXR1cmUoKSB7XG4gICAgICB0aGlzLm5leHQoKTsgLy8gU2tpcCAneydcbiAgICAgIHJldHVybiB0aGlzLmVhdCh0dC5uYW1lKSAmJiB0aGlzLm1hdGNoKHR0LmNvbG9uKTtcbiAgICB9XG5cbiAgICB0c1RyeVBhcnNlSW5kZXhTaWduYXR1cmUobm9kZTogTi5Ob2RlKTogP04uVHNJbmRleFNpZ25hdHVyZSB7XG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgdGhpcy5tYXRjaCh0dC5icmFja2V0TCkgJiZcbiAgICAgICAgICB0aGlzLnRzTG9va0FoZWFkKHRoaXMudHNJc1VuYW1iaWd1b3VzbHlJbmRleFNpZ25hdHVyZS5iaW5kKHRoaXMpKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2tldEwpO1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgaWQudHlwZUFubm90YXRpb24gPSB0aGlzLnRzUGFyc2VUeXBlQW5ub3RhdGlvbigpO1xuICAgICAgdGhpcy5yZXNldEVuZExvY2F0aW9uKGlkKTsgLy8gc2V0IGVuZCBwb3NpdGlvbiB0byBlbmQgb2YgdHlwZVxuXG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFja2V0Uik7XG4gICAgICBub2RlLnBhcmFtZXRlcnMgPSBbaWRdO1xuXG4gICAgICBjb25zdCB0eXBlID0gdGhpcy50c1RyeVBhcnNlVHlwZUFubm90YXRpb24oKTtcbiAgICAgIGlmICh0eXBlKSBub2RlLnR5cGVBbm5vdGF0aW9uID0gdHlwZTtcbiAgICAgIHRoaXMudHNQYXJzZVR5cGVNZW1iZXJTZW1pY29sb24oKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUU0luZGV4U2lnbmF0dXJlXCIpO1xuICAgIH1cblxuICAgIHRzUGFyc2VQcm9wZXJ0eU9yTWV0aG9kU2lnbmF0dXJlKFxuICAgICAgbm9kZTogTi5Uc1Byb3BlcnR5U2lnbmF0dXJlIHwgTi5Uc01ldGhvZFNpZ25hdHVyZSxcbiAgICAgIHJlYWRvbmx5OiBib29sZWFuLFxuICAgICk6IE4uVHNQcm9wZXJ0eVNpZ25hdHVyZSB8IE4uVHNNZXRob2RTaWduYXR1cmUge1xuICAgICAgaWYgKHRoaXMuZWF0KHR0LnF1ZXN0aW9uKSkgbm9kZS5vcHRpb25hbCA9IHRydWU7XG4gICAgICBjb25zdCBub2RlQW55OiBhbnkgPSBub2RlO1xuXG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5wYXJlbkwpIHx8IHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICBpZiAocmVhZG9ubHkpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKG5vZGUuc3RhcnQsIFRTRXJyb3JzLlJlYWRvbmx5Rm9yTWV0aG9kU2lnbmF0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXRob2Q6IE4uVHNNZXRob2RTaWduYXR1cmUgPSBub2RlQW55O1xuICAgICAgICBpZiAobWV0aG9kLmtpbmQgJiYgdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgVFNFcnJvcnMuQWNjZXNvckNhbm5vdEhhdmVUeXBlUGFyYW1ldGVycyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50c0ZpbGxTaWduYXR1cmUodHQuY29sb24sIG1ldGhvZCk7XG4gICAgICAgIHRoaXMudHNQYXJzZVR5cGVNZW1iZXJTZW1pY29sb24oKTtcbiAgICAgICAgaWYgKG1ldGhvZC5raW5kID09PSBcImdldFwiKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5wb3MsIEVycm9ycy5CYWRHZXR0ZXJBcml0eSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1RoaXNQYXJhbShtZXRob2QucGFyYW1ldGVyc1swXSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnBvcyxcbiAgICAgICAgICAgICAgICBUU0Vycm9ycy5BY2Nlc29yQ2Fubm90RGVjbGFyZVRoaXNQYXJhbWV0ZXIsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZC5raW5kID09PSBcInNldFwiKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZC5wYXJhbWV0ZXJzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRXJyb3JzLkJhZFNldHRlckFyaXR5KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZmlyc3RQYXJhbWV0ZXIgPSBtZXRob2QucGFyYW1ldGVyc1swXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVGhpc1BhcmFtKGZpcnN0UGFyYW1ldGVyKSkge1xuICAgICAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zLFxuICAgICAgICAgICAgICAgIFRTRXJyb3JzLkFjY2Vzb3JDYW5ub3REZWNsYXJlVGhpc1BhcmFtZXRlcixcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgZmlyc3RQYXJhbWV0ZXIudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIgJiZcbiAgICAgICAgICAgICAgZmlyc3RQYXJhbWV0ZXIub3B0aW9uYWxcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zLFxuICAgICAgICAgICAgICAgIFRTRXJyb3JzLlNldEFjY2Vzb3JDYW5ub3RIYXZlT3B0aW9uYWxQYXJhbWV0ZXIsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlyc3RQYXJhbWV0ZXIudHlwZSA9PT0gXCJSZXN0RWxlbWVudFwiKSB7XG4gICAgICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MsXG4gICAgICAgICAgICAgICAgVFNFcnJvcnMuU2V0QWNjZXNvckNhbm5vdEhhdmVSZXN0UGFyYW1ldGVyLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWV0aG9kLnR5cGVBbm5vdGF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgICBtZXRob2QudHlwZUFubm90YXRpb24uc3RhcnQsXG4gICAgICAgICAgICAgIFRTRXJyb3JzLlNldEFjY2Vzb3JDYW5ub3RIYXZlUmV0dXJuVHlwZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ldGhvZC5raW5kID0gXCJtZXRob2RcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG1ldGhvZCwgXCJUU01ldGhvZFNpZ25hdHVyZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5OiBOLlRzUHJvcGVydHlTaWduYXR1cmUgPSBub2RlQW55O1xuICAgICAgICBpZiAocmVhZG9ubHkpIHByb3BlcnR5LnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHNUcnlQYXJzZVR5cGVBbm5vdGF0aW9uKCk7XG4gICAgICAgIGlmICh0eXBlKSBwcm9wZXJ0eS50eXBlQW5ub3RhdGlvbiA9IHR5cGU7XG4gICAgICAgIHRoaXMudHNQYXJzZVR5cGVNZW1iZXJTZW1pY29sb24oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShwcm9wZXJ0eSwgXCJUU1Byb3BlcnR5U2lnbmF0dXJlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlTWVtYmVyKCk6IE4uVHNUeXBlRWxlbWVudCB7XG4gICAgICBjb25zdCBub2RlOiBhbnkgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuXG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5wYXJlbkwpIHx8IHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlU2lnbmF0dXJlTWVtYmVyKFwiVFNDYWxsU2lnbmF0dXJlRGVjbGFyYXRpb25cIiwgbm9kZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0Ll9uZXcpKSB7XG4gICAgICAgIGNvbnN0IGlkOiBOLklkZW50aWZpZXIgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2godHQucGFyZW5MKSB8fCB0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlU2lnbmF0dXJlTWVtYmVyKFxuICAgICAgICAgICAgXCJUU0NvbnN0cnVjdFNpZ25hdHVyZURlY2xhcmF0aW9uXCIsXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5rZXkgPSB0aGlzLmNyZWF0ZUlkZW50aWZpZXIoaWQsIFwibmV3XCIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VQcm9wZXJ0eU9yTWV0aG9kU2lnbmF0dXJlKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRzUGFyc2VNb2RpZmllcnMoXG4gICAgICAgIG5vZGUsXG4gICAgICAgIFtcInJlYWRvbmx5XCJdLFxuICAgICAgICBbXG4gICAgICAgICAgXCJkZWNsYXJlXCIsXG4gICAgICAgICAgXCJhYnN0cmFjdFwiLFxuICAgICAgICAgIFwicHJpdmF0ZVwiLFxuICAgICAgICAgIFwicHJvdGVjdGVkXCIsXG4gICAgICAgICAgXCJwdWJsaWNcIixcbiAgICAgICAgICBcInN0YXRpY1wiLFxuICAgICAgICAgIFwib3ZlcnJpZGVcIixcbiAgICAgICAgXSxcbiAgICAgICAgVFNFcnJvcnMuSW52YWxpZE1vZGlmaWVyT25UeXBlTWVtYmVyLFxuICAgICAgKTtcblxuICAgICAgY29uc3QgaWR4ID0gdGhpcy50c1RyeVBhcnNlSW5kZXhTaWduYXR1cmUobm9kZSk7XG4gICAgICBpZiAoaWR4KSB7XG4gICAgICAgIHJldHVybiBpZHg7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyc2VQcm9wZXJ0eU5hbWUobm9kZSwgLyogaXNQcml2YXRlTmFtZUFsbG93ZWQgKi8gZmFsc2UpO1xuICAgICAgaWYgKFxuICAgICAgICAhbm9kZS5jb21wdXRlZCAmJlxuICAgICAgICBub2RlLmtleS50eXBlID09PSBcIklkZW50aWZpZXJcIiAmJlxuICAgICAgICAobm9kZS5rZXkubmFtZSA9PT0gXCJnZXRcIiB8fCBub2RlLmtleS5uYW1lID09PSBcInNldFwiKSAmJlxuICAgICAgICB0aGlzLnRzVG9rZW5DYW5Gb2xsb3dNb2RpZmllcigpXG4gICAgICApIHtcbiAgICAgICAgbm9kZS5raW5kID0gbm9kZS5rZXkubmFtZTtcbiAgICAgICAgdGhpcy5wYXJzZVByb3BlcnR5TmFtZShub2RlLCAvKiBpc1ByaXZhdGVOYW1lQWxsb3dlZCAqLyBmYWxzZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy50c1BhcnNlUHJvcGVydHlPck1ldGhvZFNpZ25hdHVyZShub2RlLCAhIW5vZGUucmVhZG9ubHkpO1xuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlTGl0ZXJhbCgpOiBOLlRzVHlwZUxpdGVyYWwge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc1R5cGVMaXRlcmFsID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIG5vZGUubWVtYmVycyA9IHRoaXMudHNQYXJzZU9iamVjdFR5cGVNZW1iZXJzKCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNUeXBlTGl0ZXJhbFwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlT2JqZWN0VHlwZU1lbWJlcnMoKTogJFJlYWRPbmx5QXJyYXk8Ti5Uc1R5cGVFbGVtZW50PiB7XG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFjZUwpO1xuICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMudHNQYXJzZUxpc3QoXG4gICAgICAgIFwiVHlwZU1lbWJlcnNcIixcbiAgICAgICAgdGhpcy50c1BhcnNlVHlwZU1lbWJlci5iaW5kKHRoaXMpLFxuICAgICAgKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlUik7XG4gICAgICByZXR1cm4gbWVtYmVycztcbiAgICB9XG5cbiAgICB0c0lzU3RhcnRPZk1hcHBlZFR5cGUoKTogYm9vbGVhbiB7XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIGlmICh0aGlzLmVhdCh0dC5wbHVzTWluKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0NvbnRleHR1YWwoXCJyZWFkb25seVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmlzQ29udGV4dHVhbChcInJlYWRvbmx5XCIpKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLm1hdGNoKHR0LmJyYWNrZXRMKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIGlmICghdGhpcy50c0lzSWRlbnRpZmllcigpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgcmV0dXJuIHRoaXMubWF0Y2godHQuX2luKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlTWFwcGVkVHlwZVBhcmFtZXRlcigpOiBOLlRzVHlwZVBhcmFtZXRlciB7XG4gICAgICBjb25zdCBub2RlOiBOLlRzVHlwZVBhcmFtZXRlciA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBub2RlLm5hbWUgPSB0aGlzLnBhcnNlSWRlbnRpZmllck5hbWUobm9kZS5zdGFydCk7XG4gICAgICBub2RlLmNvbnN0cmFpbnQgPSB0aGlzLnRzRXhwZWN0VGhlblBhcnNlVHlwZSh0dC5faW4pO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZVBhcmFtZXRlclwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlTWFwcGVkVHlwZSgpOiBOLlRzTWFwcGVkVHlwZSB7XG4gICAgICBjb25zdCBub2RlOiBOLlRzTWFwcGVkVHlwZSA9IHRoaXMuc3RhcnROb2RlKCk7XG5cbiAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlTCk7XG5cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnBsdXNNaW4pKSB7XG4gICAgICAgIG5vZGUucmVhZG9ubHkgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5leHBlY3RDb250ZXh0dWFsKFwicmVhZG9ubHlcIik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWF0Q29udGV4dHVhbChcInJlYWRvbmx5XCIpKSB7XG4gICAgICAgIG5vZGUucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFja2V0TCk7XG4gICAgICBub2RlLnR5cGVQYXJhbWV0ZXIgPSB0aGlzLnRzUGFyc2VNYXBwZWRUeXBlUGFyYW1ldGVyKCk7XG4gICAgICBub2RlLm5hbWVUeXBlID0gdGhpcy5lYXRDb250ZXh0dWFsKFwiYXNcIikgPyB0aGlzLnRzUGFyc2VUeXBlKCkgOiBudWxsO1xuXG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFja2V0Uik7XG5cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnBsdXNNaW4pKSB7XG4gICAgICAgIG5vZGUub3B0aW9uYWwgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5leHBlY3QodHQucXVlc3Rpb24pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmVhdCh0dC5xdWVzdGlvbikpIHtcbiAgICAgICAgbm9kZS5vcHRpb25hbCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLnRzVHJ5UGFyc2VUeXBlKCk7XG4gICAgICB0aGlzLnNlbWljb2xvbigpO1xuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VSKTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTTWFwcGVkVHlwZVwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlVHVwbGVUeXBlKCk6IE4uVHNUdXBsZVR5cGUge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc1R1cGxlVHlwZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBub2RlLmVsZW1lbnRUeXBlcyA9IHRoaXMudHNQYXJzZUJyYWNrZXRlZExpc3QoXG4gICAgICAgIFwiVHVwbGVFbGVtZW50VHlwZXNcIixcbiAgICAgICAgdGhpcy50c1BhcnNlVHVwbGVFbGVtZW50VHlwZS5iaW5kKHRoaXMpLFxuICAgICAgICAvKiBicmFja2V0ICovIHRydWUsXG4gICAgICAgIC8qIHNraXBGaXJzdFRva2VuICovIGZhbHNlLFxuICAgICAgKTtcblxuICAgICAgLy8gVmFsaWRhdGUgdGhlIGVsZW1lbnRUeXBlcyB0byBlbnN1cmUgdGhhdCBubyBtYW5kYXRvcnkgZWxlbWVudHNcbiAgICAgIC8vIGZvbGxvdyBvcHRpb25hbCBlbGVtZW50c1xuICAgICAgbGV0IHNlZW5PcHRpb25hbEVsZW1lbnQgPSBmYWxzZTtcbiAgICAgIGxldCBsYWJlbGVkRWxlbWVudHMgPSBudWxsO1xuICAgICAgbm9kZS5lbGVtZW50VHlwZXMuZm9yRWFjaChlbGVtZW50Tm9kZSA9PiB7XG4gICAgICAgIGxldCB7IHR5cGUgfSA9IGVsZW1lbnROb2RlO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBzZWVuT3B0aW9uYWxFbGVtZW50ICYmXG4gICAgICAgICAgdHlwZSAhPT0gXCJUU1Jlc3RUeXBlXCIgJiZcbiAgICAgICAgICB0eXBlICE9PSBcIlRTT3B0aW9uYWxUeXBlXCIgJiZcbiAgICAgICAgICAhKHR5cGUgPT09IFwiVFNOYW1lZFR1cGxlTWVtYmVyXCIgJiYgZWxlbWVudE5vZGUub3B0aW9uYWwpXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucmFpc2UoZWxlbWVudE5vZGUuc3RhcnQsIFRTRXJyb3JzLk9wdGlvbmFsVHlwZUJlZm9yZVJlcXVpcmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZsb3cgZG9lc24ndCBzdXBwb3J0IHx8PVxuICAgICAgICBzZWVuT3B0aW9uYWxFbGVtZW50ID1cbiAgICAgICAgICBzZWVuT3B0aW9uYWxFbGVtZW50IHx8XG4gICAgICAgICAgKHR5cGUgPT09IFwiVFNOYW1lZFR1cGxlTWVtYmVyXCIgJiYgZWxlbWVudE5vZGUub3B0aW9uYWwpIHx8XG4gICAgICAgICAgdHlwZSA9PT0gXCJUU09wdGlvbmFsVHlwZVwiO1xuXG4gICAgICAgIC8vIFdoZW4gY2hlY2tpbmcgbGFiZWxzLCBjaGVjayB0aGUgYXJndW1lbnQgb2YgdGhlIHNwcmVhZCBvcGVyYXRvclxuICAgICAgICBpZiAodHlwZSA9PT0gXCJUU1Jlc3RUeXBlXCIpIHtcbiAgICAgICAgICBlbGVtZW50Tm9kZSA9IGVsZW1lbnROb2RlLnR5cGVBbm5vdGF0aW9uO1xuICAgICAgICAgIHR5cGUgPSBlbGVtZW50Tm9kZS50eXBlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNMYWJlbGVkID0gdHlwZSA9PT0gXCJUU05hbWVkVHVwbGVNZW1iZXJcIjtcbiAgICAgICAgLy8gRmxvdyBkb2Vzbid0IHN1cHBvcnQgPz89XG4gICAgICAgIGxhYmVsZWRFbGVtZW50cyA9IGxhYmVsZWRFbGVtZW50cyA/PyBpc0xhYmVsZWQ7XG4gICAgICAgIGlmIChsYWJlbGVkRWxlbWVudHMgIT09IGlzTGFiZWxlZCkge1xuICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICBlbGVtZW50Tm9kZS5zdGFydCxcbiAgICAgICAgICAgIFRTRXJyb3JzLk1peGVkTGFiZWxlZEFuZFVubGFiZWxlZEVsZW1lbnRzLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNUdXBsZVR5cGVcIik7XG4gICAgfVxuXG4gICAgdHNQYXJzZVR1cGxlRWxlbWVudFR5cGUoKTogTi5Uc1R5cGUgfCBOLlRzTmFtZWRUdXBsZU1lbWJlciB7XG4gICAgICAvLyBwYXJzZXMgYC4uLlRzVHlwZVtdYFxuXG4gICAgICBjb25zdCB7IHN0YXJ0OiBzdGFydFBvcywgc3RhcnRMb2MgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgIGNvbnN0IHJlc3QgPSB0aGlzLmVhdCh0dC5lbGxpcHNpcyk7XG4gICAgICBsZXQgdHlwZSA9IHRoaXMudHNQYXJzZVR5cGUoKTtcbiAgICAgIGNvbnN0IG9wdGlvbmFsID0gdGhpcy5lYXQodHQucXVlc3Rpb24pO1xuICAgICAgY29uc3QgbGFiZWxlZCA9IHRoaXMuZWF0KHR0LmNvbG9uKTtcblxuICAgICAgaWYgKGxhYmVsZWQpIHtcbiAgICAgICAgY29uc3QgbGFiZWxlZE5vZGU6IE4uVHNOYW1lZFR1cGxlTWVtYmVyID0gdGhpcy5zdGFydE5vZGVBdE5vZGUodHlwZSk7XG4gICAgICAgIGxhYmVsZWROb2RlLm9wdGlvbmFsID0gb3B0aW9uYWw7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGUudHlwZSA9PT0gXCJUU1R5cGVSZWZlcmVuY2VcIiAmJlxuICAgICAgICAgICF0eXBlLnR5cGVQYXJhbWV0ZXJzICYmXG4gICAgICAgICAgdHlwZS50eXBlTmFtZS50eXBlID09PSBcIklkZW50aWZpZXJcIlxuICAgICAgICApIHtcbiAgICAgICAgICBsYWJlbGVkTm9kZS5sYWJlbCA9ICh0eXBlLnR5cGVOYW1lOiBOLklkZW50aWZpZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmFpc2UodHlwZS5zdGFydCwgVFNFcnJvcnMuSW52YWxpZFR1cGxlTWVtYmVyTGFiZWwpO1xuICAgICAgICAgIC8vIFRoaXMgcHJvZHVjZXMgYW4gaW52YWxpZCBBU1QsIGJ1dCBhdCBsZWFzdCB3ZSBkb24ndCBkcm9wXG4gICAgICAgICAgLy8gbm9kZXMgcmVwcmVzZW50aW5nIHRoZSBpbnZhbGlkIHNvdXJjZS5cbiAgICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICAgIGxhYmVsZWROb2RlLmxhYmVsID0gdHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhYmVsZWROb2RlLmVsZW1lbnRUeXBlID0gdGhpcy50c1BhcnNlVHlwZSgpO1xuICAgICAgICB0eXBlID0gdGhpcy5maW5pc2hOb2RlKGxhYmVsZWROb2RlLCBcIlRTTmFtZWRUdXBsZU1lbWJlclwiKTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uYWwpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uYWxUeXBlTm9kZTogTi5Uc09wdGlvbmFsVHlwZSA9IHRoaXMuc3RhcnROb2RlQXROb2RlKHR5cGUpO1xuICAgICAgICBvcHRpb25hbFR5cGVOb2RlLnR5cGVBbm5vdGF0aW9uID0gdHlwZTtcbiAgICAgICAgdHlwZSA9IHRoaXMuZmluaXNoTm9kZShvcHRpb25hbFR5cGVOb2RlLCBcIlRTT3B0aW9uYWxUeXBlXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdCkge1xuICAgICAgICBjb25zdCByZXN0Tm9kZTogTi5Uc1Jlc3RUeXBlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgICByZXN0Tm9kZS50eXBlQW5ub3RhdGlvbiA9IHR5cGU7XG4gICAgICAgIHR5cGUgPSB0aGlzLmZpbmlzaE5vZGUocmVzdE5vZGUsIFwiVFNSZXN0VHlwZVwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuXG4gICAgdHNQYXJzZVBhcmVudGhlc2l6ZWRUeXBlKCk6IE4uVHNQYXJlbnRoZXNpemVkVHlwZSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuTCk7XG4gICAgICBub2RlLnR5cGVBbm5vdGF0aW9uID0gdGhpcy50c1BhcnNlVHlwZSgpO1xuICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUU1BhcmVudGhlc2l6ZWRUeXBlXCIpO1xuICAgIH1cblxuICAgIHRzUGFyc2VGdW5jdGlvbk9yQ29uc3RydWN0b3JUeXBlKFxuICAgICAgdHlwZTogXCJUU0Z1bmN0aW9uVHlwZVwiIHwgXCJUU0NvbnN0cnVjdG9yVHlwZVwiLFxuICAgICAgYWJzdHJhY3Q/OiBib29sZWFuLFxuICAgICk6IE4uVHNGdW5jdGlvbk9yQ29uc3RydWN0b3JUeXBlIHtcbiAgICAgIGNvbnN0IG5vZGU6IE4uVHNGdW5jdGlvbk9yQ29uc3RydWN0b3JUeXBlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIGlmICh0eXBlID09PSBcIlRTQ29uc3RydWN0b3JUeXBlXCIpIHtcbiAgICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgICAgbm9kZS5hYnN0cmFjdCA9ICEhYWJzdHJhY3Q7XG4gICAgICAgIGlmIChhYnN0cmFjdCkgdGhpcy5uZXh0KCk7XG4gICAgICAgIHRoaXMubmV4dCgpOyAvLyBlYXQgYG5ld2BcbiAgICAgIH1cbiAgICAgIHRoaXMudHNGaWxsU2lnbmF0dXJlKHR0LmFycm93LCBub2RlKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgdHlwZSk7XG4gICAgfVxuXG4gICAgdHNQYXJzZUxpdGVyYWxUeXBlTm9kZSgpOiBOLlRzTGl0ZXJhbFR5cGUge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc0xpdGVyYWxUeXBlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIG5vZGUubGl0ZXJhbCA9ICgoKSA9PiB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS50eXBlKSB7XG4gICAgICAgICAgY2FzZSB0dC5udW06XG4gICAgICAgICAgY2FzZSB0dC5iaWdpbnQ6XG4gICAgICAgICAgY2FzZSB0dC5zdHJpbmc6XG4gICAgICAgICAgY2FzZSB0dC5fdHJ1ZTpcbiAgICAgICAgICBjYXNlIHR0Ll9mYWxzZTpcbiAgICAgICAgICAgIC8vIEZvciBjb21wYXRpYmlsaXR5IHRvIGVzdHJlZSB3ZSBjYW5ub3QgY2FsbCBwYXJzZUxpdGVyYWwgZGlyZWN0bHkgaGVyZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFeHByQXRvbSgpO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUU0xpdGVyYWxUeXBlXCIpO1xuICAgIH1cblxuICAgIHRzUGFyc2VUZW1wbGF0ZUxpdGVyYWxUeXBlKCk6IE4uVHNUeXBlIHtcbiAgICAgIGNvbnN0IG5vZGU6IE4uVHNMaXRlcmFsVHlwZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBub2RlLmxpdGVyYWwgPSB0aGlzLnBhcnNlVGVtcGxhdGUoZmFsc2UpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTTGl0ZXJhbFR5cGVcIik7XG4gICAgfVxuXG4gICAgcGFyc2VUZW1wbGF0ZVN1YnN0aXR1dGlvbigpOiBOLlRzVHlwZSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pblR5cGUpIHJldHVybiB0aGlzLnRzUGFyc2VUeXBlKCk7XG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VUZW1wbGF0ZVN1YnN0aXR1dGlvbigpO1xuICAgIH1cblxuICAgIHRzUGFyc2VUaGlzVHlwZU9yVGhpc1R5cGVQcmVkaWNhdGUoKTogTi5Uc1RoaXNUeXBlIHwgTi5Uc1R5cGVQcmVkaWNhdGUge1xuICAgICAgY29uc3QgdGhpc0tleXdvcmQgPSB0aGlzLnRzUGFyc2VUaGlzVHlwZU5vZGUoKTtcbiAgICAgIGlmICh0aGlzLmlzQ29udGV4dHVhbChcImlzXCIpICYmICF0aGlzLmhhc1ByZWNlZGluZ0xpbmVCcmVhaygpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VUaGlzVHlwZVByZWRpY2F0ZSh0aGlzS2V5d29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpc0tleXdvcmQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHNQYXJzZU5vbkFycmF5VHlwZSgpOiBOLlRzVHlwZSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUudHlwZSkge1xuICAgICAgICBjYXNlIHR0Lm5hbWU6XG4gICAgICAgIGNhc2UgdHQuX3ZvaWQ6XG4gICAgICAgIGNhc2UgdHQuX251bGw6IHtcbiAgICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5tYXRjaCh0dC5fdm9pZClcbiAgICAgICAgICAgID8gXCJUU1ZvaWRLZXl3b3JkXCJcbiAgICAgICAgICAgIDogdGhpcy5tYXRjaCh0dC5fbnVsbClcbiAgICAgICAgICAgID8gXCJUU051bGxLZXl3b3JkXCJcbiAgICAgICAgICAgIDoga2V5d29yZFR5cGVGcm9tTmFtZSh0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHRoaXMubG9va2FoZWFkQ2hhckNvZGUoKSAhPT0gY2hhckNvZGVzLmRvdFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZTogTi5Uc0tleXdvcmRUeXBlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCB0eXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZVR5cGVSZWZlcmVuY2UoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXNlIHR0LnN0cmluZzpcbiAgICAgICAgY2FzZSB0dC5udW06XG4gICAgICAgIGNhc2UgdHQuYmlnaW50OlxuICAgICAgICBjYXNlIHR0Ll90cnVlOlxuICAgICAgICBjYXNlIHR0Ll9mYWxzZTpcbiAgICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlTGl0ZXJhbFR5cGVOb2RlKCk7XG4gICAgICAgIGNhc2UgdHQucGx1c01pbjpcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS52YWx1ZSA9PT0gXCItXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGU6IE4uVHNMaXRlcmFsVHlwZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0VG9rZW4gPSB0aGlzLmxvb2thaGVhZCgpO1xuICAgICAgICAgICAgaWYgKG5leHRUb2tlbi50eXBlICE9PSB0dC5udW0gJiYgbmV4dFRva2VuLnR5cGUgIT09IHR0LmJpZ2ludCkge1xuICAgICAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUubGl0ZXJhbCA9IHRoaXMucGFyc2VNYXliZVVuYXJ5KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNMaXRlcmFsVHlwZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdHQuX3RoaXM6XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZVRoaXNUeXBlT3JUaGlzVHlwZVByZWRpY2F0ZSgpO1xuICAgICAgICBjYXNlIHR0Ll90eXBlb2Y6XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZVR5cGVRdWVyeSgpO1xuICAgICAgICBjYXNlIHR0Ll9pbXBvcnQ6XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUltcG9ydFR5cGUoKTtcbiAgICAgICAgY2FzZSB0dC5icmFjZUw6XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHNMb29rQWhlYWQodGhpcy50c0lzU3RhcnRPZk1hcHBlZFR5cGUuYmluZCh0aGlzKSlcbiAgICAgICAgICAgID8gdGhpcy50c1BhcnNlTWFwcGVkVHlwZSgpXG4gICAgICAgICAgICA6IHRoaXMudHNQYXJzZVR5cGVMaXRlcmFsKCk7XG4gICAgICAgIGNhc2UgdHQuYnJhY2tldEw6XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZVR1cGxlVHlwZSgpO1xuICAgICAgICBjYXNlIHR0LnBhcmVuTDpcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuQkFCRUxfOF9CUkVBS0lORykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuY3JlYXRlUGFyZW50aGVzaXplZEV4cHJlc3Npb25zKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLnRzUGFyc2VUeXBlKCk7XG4gICAgICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuUik7XG4gICAgICAgICAgICAgIHRoaXMuYWRkRXh0cmEodHlwZSwgXCJwYXJlbnRoZXNpemVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICB0aGlzLmFkZEV4dHJhKHR5cGUsIFwicGFyZW5TdGFydFwiLCBzdGFydFBvcyk7XG4gICAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VQYXJlbnRoZXNpemVkVHlwZSgpO1xuICAgICAgICBjYXNlIHR0LmJhY2tRdW90ZTpcbiAgICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlVGVtcGxhdGVMaXRlcmFsVHlwZSgpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlQXJyYXlUeXBlT3JIaWdoZXIoKTogTi5Uc1R5cGUge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLnRzUGFyc2VOb25BcnJheVR5cGUoKTtcbiAgICAgIHdoaWxlICghdGhpcy5oYXNQcmVjZWRpbmdMaW5lQnJlYWsoKSAmJiB0aGlzLmVhdCh0dC5icmFja2V0TCkpIHtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2godHQuYnJhY2tldFIpKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZTogTi5Uc0FycmF5VHlwZSA9IHRoaXMuc3RhcnROb2RlQXROb2RlKHR5cGUpO1xuICAgICAgICAgIG5vZGUuZWxlbWVudFR5cGUgPSB0eXBlO1xuICAgICAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNrZXRSKTtcbiAgICAgICAgICB0eXBlID0gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNBcnJheVR5cGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgbm9kZTogTi5Uc0luZGV4ZWRBY2Nlc3NUeXBlID0gdGhpcy5zdGFydE5vZGVBdE5vZGUodHlwZSk7XG4gICAgICAgICAgbm9kZS5vYmplY3RUeXBlID0gdHlwZTtcbiAgICAgICAgICBub2RlLmluZGV4VHlwZSA9IHRoaXMudHNQYXJzZVR5cGUoKTtcbiAgICAgICAgICB0aGlzLmV4cGVjdCh0dC5icmFja2V0Uik7XG4gICAgICAgICAgdHlwZSA9IHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTSW5kZXhlZEFjY2Vzc1R5cGVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlT3BlcmF0b3IoXG4gICAgICBvcGVyYXRvcjogXCJrZXlvZlwiIHwgXCJ1bmlxdWVcIiB8IFwicmVhZG9ubHlcIixcbiAgICApOiBOLlRzVHlwZU9wZXJhdG9yIHtcbiAgICAgIGNvbnN0IG5vZGU6IE4uVHNUeXBlT3BlcmF0b3IgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5leHBlY3RDb250ZXh0dWFsKG9wZXJhdG9yKTtcbiAgICAgIG5vZGUub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLnRzUGFyc2VUeXBlT3BlcmF0b3JPckhpZ2hlcigpO1xuXG4gICAgICBpZiAob3BlcmF0b3IgPT09IFwicmVhZG9ubHlcIikge1xuICAgICAgICB0aGlzLnRzQ2hlY2tUeXBlQW5ub3RhdGlvbkZvclJlYWRPbmx5KG5vZGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNUeXBlT3BlcmF0b3JcIik7XG4gICAgfVxuXG4gICAgdHNDaGVja1R5cGVBbm5vdGF0aW9uRm9yUmVhZE9ubHkobm9kZTogTi5Ob2RlKSB7XG4gICAgICBzd2l0Y2ggKG5vZGUudHlwZUFubm90YXRpb24udHlwZSkge1xuICAgICAgICBjYXNlIFwiVFNUdXBsZVR5cGVcIjpcbiAgICAgICAgY2FzZSBcIlRTQXJyYXlUeXBlXCI6XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgVFNFcnJvcnMuVW5leHBlY3RlZFJlYWRvbmx5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0c1BhcnNlSW5mZXJUeXBlKCk6IE4uVHNJbmZlclR5cGUge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICB0aGlzLmV4cGVjdENvbnRleHR1YWwoXCJpbmZlclwiKTtcbiAgICAgIGNvbnN0IHR5cGVQYXJhbWV0ZXIgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdHlwZVBhcmFtZXRlci5uYW1lID0gdGhpcy5wYXJzZUlkZW50aWZpZXJOYW1lKHR5cGVQYXJhbWV0ZXIuc3RhcnQpO1xuICAgICAgbm9kZS50eXBlUGFyYW1ldGVyID0gdGhpcy5maW5pc2hOb2RlKHR5cGVQYXJhbWV0ZXIsIFwiVFNUeXBlUGFyYW1ldGVyXCIpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTSW5mZXJUeXBlXCIpO1xuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlT3BlcmF0b3JPckhpZ2hlcigpOiBOLlRzVHlwZSB7XG4gICAgICBjb25zdCBvcGVyYXRvciA9IFtcImtleW9mXCIsIFwidW5pcXVlXCIsIFwicmVhZG9ubHlcIl0uZmluZChrdyA9PlxuICAgICAgICB0aGlzLmlzQ29udGV4dHVhbChrdyksXG4gICAgICApO1xuICAgICAgcmV0dXJuIG9wZXJhdG9yXG4gICAgICAgID8gdGhpcy50c1BhcnNlVHlwZU9wZXJhdG9yKG9wZXJhdG9yKVxuICAgICAgICA6IHRoaXMuaXNDb250ZXh0dWFsKFwiaW5mZXJcIilcbiAgICAgICAgPyB0aGlzLnRzUGFyc2VJbmZlclR5cGUoKVxuICAgICAgICA6IHRoaXMudHNQYXJzZUFycmF5VHlwZU9ySGlnaGVyKCk7XG4gICAgfVxuXG4gICAgdHNQYXJzZVVuaW9uT3JJbnRlcnNlY3Rpb25UeXBlKFxuICAgICAga2luZDogXCJUU1VuaW9uVHlwZVwiIHwgXCJUU0ludGVyc2VjdGlvblR5cGVcIixcbiAgICAgIHBhcnNlQ29uc3RpdHVlbnRUeXBlOiAoKSA9PiBOLlRzVHlwZSxcbiAgICAgIG9wZXJhdG9yOiBUb2tlblR5cGUsXG4gICAgKTogTi5Uc1R5cGUge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc1VuaW9uVHlwZSB8IE4uVHNJbnRlcnNlY3Rpb25UeXBlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIGNvbnN0IGhhc0xlYWRpbmdPcGVyYXRvciA9IHRoaXMuZWF0KG9wZXJhdG9yKTtcbiAgICAgIGNvbnN0IHR5cGVzID0gW107XG4gICAgICBkbyB7XG4gICAgICAgIHR5cGVzLnB1c2gocGFyc2VDb25zdGl0dWVudFR5cGUoKSk7XG4gICAgICB9IHdoaWxlICh0aGlzLmVhdChvcGVyYXRvcikpO1xuICAgICAgaWYgKHR5cGVzLmxlbmd0aCA9PT0gMSAmJiAhaGFzTGVhZGluZ09wZXJhdG9yKSB7XG4gICAgICAgIHJldHVybiB0eXBlc1swXTtcbiAgICAgIH1cbiAgICAgIG5vZGUudHlwZXMgPSB0eXBlcztcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwga2luZCk7XG4gICAgfVxuXG4gICAgdHNQYXJzZUludGVyc2VjdGlvblR5cGVPckhpZ2hlcigpOiBOLlRzVHlwZSB7XG4gICAgICByZXR1cm4gdGhpcy50c1BhcnNlVW5pb25PckludGVyc2VjdGlvblR5cGUoXG4gICAgICAgIFwiVFNJbnRlcnNlY3Rpb25UeXBlXCIsXG4gICAgICAgIHRoaXMudHNQYXJzZVR5cGVPcGVyYXRvck9ySGlnaGVyLmJpbmQodGhpcyksXG4gICAgICAgIHR0LmJpdHdpc2VBTkQsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRzUGFyc2VVbmlvblR5cGVPckhpZ2hlcigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VVbmlvbk9ySW50ZXJzZWN0aW9uVHlwZShcbiAgICAgICAgXCJUU1VuaW9uVHlwZVwiLFxuICAgICAgICB0aGlzLnRzUGFyc2VJbnRlcnNlY3Rpb25UeXBlT3JIaWdoZXIuYmluZCh0aGlzKSxcbiAgICAgICAgdHQuYml0d2lzZU9SLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0c0lzU3RhcnRPZkZ1bmN0aW9uVHlwZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLm1hdGNoKHR0LnBhcmVuTCkgJiZcbiAgICAgICAgdGhpcy50c0xvb2tBaGVhZCh0aGlzLnRzSXNVbmFtYmlndW91c2x5U3RhcnRPZkZ1bmN0aW9uVHlwZS5iaW5kKHRoaXMpKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0c1NraXBQYXJhbWV0ZXJTdGFydCgpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0Lm5hbWUpIHx8IHRoaXMubWF0Y2godHQuX3RoaXMpKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubWF0Y2godHQuYnJhY2VMKSkge1xuICAgICAgICBsZXQgYnJhY2VTdGFja0NvdW50ZXIgPSAxO1xuICAgICAgICB0aGlzLm5leHQoKTtcblxuICAgICAgICB3aGlsZSAoYnJhY2VTdGFja0NvdW50ZXIgPiAwKSB7XG4gICAgICAgICAgaWYgKHRoaXMubWF0Y2godHQuYnJhY2VMKSkge1xuICAgICAgICAgICAgKyticmFjZVN0YWNrQ291bnRlcjtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2godHQuYnJhY2VSKSkge1xuICAgICAgICAgICAgLS1icmFjZVN0YWNrQ291bnRlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmJyYWNrZXRMKSkge1xuICAgICAgICBsZXQgYnJhY2VTdGFja0NvdW50ZXIgPSAxO1xuICAgICAgICB0aGlzLm5leHQoKTtcblxuICAgICAgICB3aGlsZSAoYnJhY2VTdGFja0NvdW50ZXIgPiAwKSB7XG4gICAgICAgICAgaWYgKHRoaXMubWF0Y2godHQuYnJhY2tldEwpKSB7XG4gICAgICAgICAgICArK2JyYWNlU3RhY2tDb3VudGVyO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5icmFja2V0UikpIHtcbiAgICAgICAgICAgIC0tYnJhY2VTdGFja0NvdW50ZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdHNJc1VuYW1iaWd1b3VzbHlTdGFydE9mRnVuY3Rpb25UeXBlKCk6IGJvb2xlYW4ge1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5wYXJlblIpIHx8IHRoaXMubWF0Y2godHQuZWxsaXBzaXMpKSB7XG4gICAgICAgIC8vICggKVxuICAgICAgICAvLyAoIC4uLlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnRzU2tpcFBhcmFtZXRlclN0YXJ0KCkpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMubWF0Y2godHQuY29sb24pIHx8XG4gICAgICAgICAgdGhpcy5tYXRjaCh0dC5jb21tYSkgfHxcbiAgICAgICAgICB0aGlzLm1hdGNoKHR0LnF1ZXN0aW9uKSB8fFxuICAgICAgICAgIHRoaXMubWF0Y2godHQuZXEpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vICggeHh4IDpcbiAgICAgICAgICAvLyAoIHh4eCAsXG4gICAgICAgICAgLy8gKCB4eHggP1xuICAgICAgICAgIC8vICggeHh4ID1cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5wYXJlblIpKSB7XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgaWYgKHRoaXMubWF0Y2godHQuYXJyb3cpKSB7XG4gICAgICAgICAgICAvLyAoIHh4eCApID0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0c1BhcnNlVHlwZU9yVHlwZVByZWRpY2F0ZUFubm90YXRpb24oXG4gICAgICByZXR1cm5Ub2tlbjogVG9rZW5UeXBlLFxuICAgICk6IE4uVHNUeXBlQW5ub3RhdGlvbiB7XG4gICAgICByZXR1cm4gdGhpcy50c0luVHlwZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHQ6IE4uVHNUeXBlQW5ub3RhdGlvbiA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgIHRoaXMuZXhwZWN0KHJldHVyblRva2VuKTtcblxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGU8Ti5Uc1R5cGVQcmVkaWNhdGU+KCk7XG5cbiAgICAgICAgY29uc3QgYXNzZXJ0cyA9ICEhdGhpcy50c1RyeVBhcnNlKFxuICAgICAgICAgIHRoaXMudHNQYXJzZVR5cGVQcmVkaWNhdGVBc3NlcnRzLmJpbmQodGhpcyksXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGFzc2VydHMgJiYgdGhpcy5tYXRjaCh0dC5fdGhpcykpIHtcbiAgICAgICAgICAvLyBXaGVuIGFzc2VydHMgaXMgZmFsc2UsIHRoaXNLZXl3b3JkIGlzIGhhbmRsZWQgYnkgdHNQYXJzZU5vbkFycmF5VHlwZVxuICAgICAgICAgIC8vIDogYXNzZXJ0cyB0aGlzIGlzIHR5cGVcbiAgICAgICAgICBsZXQgdGhpc1R5cGVQcmVkaWNhdGUgPSB0aGlzLnRzUGFyc2VUaGlzVHlwZU9yVGhpc1R5cGVQcmVkaWNhdGUoKTtcbiAgICAgICAgICAvLyBpZiBpdCB0dXJucyBvdXQgdG8gYmUgYSBgVFNUaGlzVHlwZWAsIHdyYXAgaXQgd2l0aCBgVFNUeXBlUHJlZGljYXRlYFxuICAgICAgICAgIC8vIDogYXNzZXJ0cyB0aGlzXG4gICAgICAgICAgaWYgKHRoaXNUeXBlUHJlZGljYXRlLnR5cGUgPT09IFwiVFNUaGlzVHlwZVwiKSB7XG4gICAgICAgICAgICBub2RlLnBhcmFtZXRlck5hbWUgPSAodGhpc1R5cGVQcmVkaWNhdGU6IE4uVHNUaGlzVHlwZSk7XG4gICAgICAgICAgICBub2RlLmFzc2VydHMgPSB0cnVlO1xuICAgICAgICAgICAgKG5vZGU6IE4uVHNUeXBlUHJlZGljYXRlKS50eXBlQW5ub3RhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICB0aGlzVHlwZVByZWRpY2F0ZSA9IHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZVByZWRpY2F0ZVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXNldFN0YXJ0TG9jYXRpb25Gcm9tTm9kZSh0aGlzVHlwZVByZWRpY2F0ZSwgbm9kZSk7XG4gICAgICAgICAgICAodGhpc1R5cGVQcmVkaWNhdGU6IE4uVHNUeXBlUHJlZGljYXRlKS5hc3NlcnRzID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdC50eXBlQW5ub3RhdGlvbiA9IHRoaXNUeXBlUHJlZGljYXRlO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUodCwgXCJUU1R5cGVBbm5vdGF0aW9uXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZVByZWRpY2F0ZVZhcmlhYmxlID1cbiAgICAgICAgICB0aGlzLnRzSXNJZGVudGlmaWVyKCkgJiZcbiAgICAgICAgICB0aGlzLnRzVHJ5UGFyc2UodGhpcy50c1BhcnNlVHlwZVByZWRpY2F0ZVByZWZpeC5iaW5kKHRoaXMpKTtcblxuICAgICAgICBpZiAoIXR5cGVQcmVkaWNhdGVWYXJpYWJsZSkge1xuICAgICAgICAgIGlmICghYXNzZXJ0cykge1xuICAgICAgICAgICAgLy8gOiB0eXBlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlVHlwZUFubm90YXRpb24oLyogZWF0Q29sb24gKi8gZmFsc2UsIHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIDogYXNzZXJ0cyBmb29cbiAgICAgICAgICBub2RlLnBhcmFtZXRlck5hbWUgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgICAgIG5vZGUuYXNzZXJ0cyA9IGFzc2VydHM7XG4gICAgICAgICAgKG5vZGU6IE4uVHNUeXBlUHJlZGljYXRlKS50eXBlQW5ub3RhdGlvbiA9IG51bGw7XG4gICAgICAgICAgdC50eXBlQW5ub3RhdGlvbiA9IHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZVByZWRpY2F0ZVwiKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKHQsIFwiVFNUeXBlQW5ub3RhdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDogYXNzZXJ0cyBmb28gaXMgdHlwZVxuICAgICAgICBjb25zdCB0eXBlID0gdGhpcy50c1BhcnNlVHlwZUFubm90YXRpb24oLyogZWF0Q29sb24gKi8gZmFsc2UpO1xuICAgICAgICBub2RlLnBhcmFtZXRlck5hbWUgPSB0eXBlUHJlZGljYXRlVmFyaWFibGU7XG4gICAgICAgIG5vZGUudHlwZUFubm90YXRpb24gPSB0eXBlO1xuICAgICAgICBub2RlLmFzc2VydHMgPSBhc3NlcnRzO1xuICAgICAgICB0LnR5cGVBbm5vdGF0aW9uID0gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNUeXBlUHJlZGljYXRlXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKHQsIFwiVFNUeXBlQW5ub3RhdGlvblwiKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRzVHJ5UGFyc2VUeXBlT3JUeXBlUHJlZGljYXRlQW5ub3RhdGlvbigpOiA/Ti5Uc1R5cGVBbm5vdGF0aW9uIHtcbiAgICAgIHJldHVybiB0aGlzLm1hdGNoKHR0LmNvbG9uKVxuICAgICAgICA/IHRoaXMudHNQYXJzZVR5cGVPclR5cGVQcmVkaWNhdGVBbm5vdGF0aW9uKHR0LmNvbG9uKVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0c1RyeVBhcnNlVHlwZUFubm90YXRpb24oKTogP04uVHNUeXBlQW5ub3RhdGlvbiB7XG4gICAgICByZXR1cm4gdGhpcy5tYXRjaCh0dC5jb2xvbikgPyB0aGlzLnRzUGFyc2VUeXBlQW5ub3RhdGlvbigpIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRzVHJ5UGFyc2VUeXBlKCk6ID9OLlRzVHlwZSB7XG4gICAgICByZXR1cm4gdGhpcy50c0VhdFRoZW5QYXJzZVR5cGUodHQuY29sb24pO1xuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlUHJlZGljYXRlUHJlZml4KCk6ID9OLklkZW50aWZpZXIge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwiaXNcIikgJiYgIXRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKCkpIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0c1BhcnNlVHlwZVByZWRpY2F0ZUFzc2VydHMoKTogYm9vbGVhbiB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLm1hdGNoKHR0Lm5hbWUpIHx8XG4gICAgICAgIHRoaXMuc3RhdGUudmFsdWUgIT09IFwiYXNzZXJ0c1wiIHx8XG4gICAgICAgIHRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKClcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjb25zdCBjb250YWluc0VzYyA9IHRoaXMuc3RhdGUuY29udGFpbnNFc2M7XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIGlmICghdGhpcy5tYXRjaCh0dC5uYW1lKSAmJiAhdGhpcy5tYXRjaCh0dC5fdGhpcykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGFpbnNFc2MpIHtcbiAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCxcbiAgICAgICAgICBFcnJvcnMuSW52YWxpZEVzY2FwZWRSZXNlcnZlZFdvcmQsXG4gICAgICAgICAgXCJhc3NlcnRzXCIsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRzUGFyc2VUeXBlQW5ub3RhdGlvbihcbiAgICAgIGVhdENvbG9uID0gdHJ1ZSxcbiAgICAgIHQ6IE4uVHNUeXBlQW5ub3RhdGlvbiA9IHRoaXMuc3RhcnROb2RlKCksXG4gICAgKTogTi5Uc1R5cGVBbm5vdGF0aW9uIHtcbiAgICAgIHRoaXMudHNJblR5cGUoKCkgPT4ge1xuICAgICAgICBpZiAoZWF0Q29sb24pIHRoaXMuZXhwZWN0KHR0LmNvbG9uKTtcbiAgICAgICAgdC50eXBlQW5ub3RhdGlvbiA9IHRoaXMudHNQYXJzZVR5cGUoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZSh0LCBcIlRTVHlwZUFubm90YXRpb25cIik7XG4gICAgfVxuXG4gICAgLyoqIEJlIHN1cmUgdG8gYmUgaW4gYSB0eXBlIGNvbnRleHQgYmVmb3JlIGNhbGxpbmcgdGhpcywgdXNpbmcgYHRzSW5UeXBlYC4gKi9cbiAgICB0c1BhcnNlVHlwZSgpOiBOLlRzVHlwZSB7XG4gICAgICAvLyBOZWVkIHRvIHNldCBgc3RhdGUuaW5UeXBlYCBzbyB0aGF0IHdlIGRvbid0IHBhcnNlIEpTWCBpbiBhIHR5cGUgY29udGV4dC5cbiAgICAgIGFzc2VydCh0aGlzLnN0YXRlLmluVHlwZSk7XG4gICAgICBjb25zdCB0eXBlID0gdGhpcy50c1BhcnNlTm9uQ29uZGl0aW9uYWxUeXBlKCk7XG4gICAgICBpZiAodGhpcy5oYXNQcmVjZWRpbmdMaW5lQnJlYWsoKSB8fCAhdGhpcy5lYXQodHQuX2V4dGVuZHMpKSB7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgICAgY29uc3Qgbm9kZTogTi5Uc0NvbmRpdGlvbmFsVHlwZSA9IHRoaXMuc3RhcnROb2RlQXROb2RlKHR5cGUpO1xuICAgICAgbm9kZS5jaGVja1R5cGUgPSB0eXBlO1xuICAgICAgbm9kZS5leHRlbmRzVHlwZSA9IHRoaXMudHNQYXJzZU5vbkNvbmRpdGlvbmFsVHlwZSgpO1xuICAgICAgdGhpcy5leHBlY3QodHQucXVlc3Rpb24pO1xuICAgICAgbm9kZS50cnVlVHlwZSA9IHRoaXMudHNQYXJzZVR5cGUoKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbG9uKTtcbiAgICAgIG5vZGUuZmFsc2VUeXBlID0gdGhpcy50c1BhcnNlVHlwZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTQ29uZGl0aW9uYWxUeXBlXCIpO1xuICAgIH1cblxuICAgIGlzQWJzdHJhY3RDb25zdHJ1Y3RvclNpZ25hdHVyZSgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmlzQ29udGV4dHVhbChcImFic3RyYWN0XCIpICYmIHRoaXMubG9va2FoZWFkKCkudHlwZSA9PT0gdHQuX25ldztcbiAgICB9XG5cbiAgICB0c1BhcnNlTm9uQ29uZGl0aW9uYWxUeXBlKCk6IE4uVHNUeXBlIHtcbiAgICAgIGlmICh0aGlzLnRzSXNTdGFydE9mRnVuY3Rpb25UeXBlKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUZ1bmN0aW9uT3JDb25zdHJ1Y3RvclR5cGUoXCJUU0Z1bmN0aW9uVHlwZVwiKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0Ll9uZXcpKSB7XG4gICAgICAgIC8vIEFzIGluIGBuZXcgKCkgPT4gRGF0ZWBcbiAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUZ1bmN0aW9uT3JDb25zdHJ1Y3RvclR5cGUoXCJUU0NvbnN0cnVjdG9yVHlwZVwiKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0Fic3RyYWN0Q29uc3RydWN0b3JTaWduYXR1cmUoKSkge1xuICAgICAgICAvLyBBcyBpbiBgYWJzdHJhY3QgbmV3ICgpID0+IERhdGVgXG4gICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VGdW5jdGlvbk9yQ29uc3RydWN0b3JUeXBlKFxuICAgICAgICAgIFwiVFNDb25zdHJ1Y3RvclR5cGVcIixcbiAgICAgICAgICAvKiBhYnN0cmFjdCAqLyB0cnVlLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZVVuaW9uVHlwZU9ySGlnaGVyKCk7XG4gICAgfVxuXG4gICAgdHNQYXJzZVR5cGVBc3NlcnRpb24oKTogTi5Uc1R5cGVBc3NlcnRpb24ge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc1R5cGVBc3NlcnRpb24gPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgY29uc3QgX2NvbnN0ID0gdGhpcy50c1RyeU5leHRQYXJzZUNvbnN0YW50Q29udGV4dCgpO1xuICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiA9IF9jb25zdCB8fCB0aGlzLnRzTmV4dFRoZW5QYXJzZVR5cGUoKTtcbiAgICAgIHRoaXMuZXhwZWN0UmVsYXRpb25hbChcIj5cIik7XG4gICAgICBub2RlLmV4cHJlc3Npb24gPSB0aGlzLnBhcnNlTWF5YmVVbmFyeSgpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZUFzc2VydGlvblwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlSGVyaXRhZ2VDbGF1c2UoXG4gICAgICBkZXNjcmlwdG9yOiBzdHJpbmcsXG4gICAgKTogJFJlYWRPbmx5QXJyYXk8Ti5Uc0V4cHJlc3Npb25XaXRoVHlwZUFyZ3VtZW50cz4ge1xuICAgICAgY29uc3Qgb3JpZ2luYWxTdGFydCA9IHRoaXMuc3RhdGUuc3RhcnQ7XG5cbiAgICAgIGNvbnN0IGRlbGltaXRlZExpc3QgPSB0aGlzLnRzUGFyc2VEZWxpbWl0ZWRMaXN0KFxuICAgICAgICBcIkhlcml0YWdlQ2xhdXNlRWxlbWVudFwiLFxuICAgICAgICB0aGlzLnRzUGFyc2VFeHByZXNzaW9uV2l0aFR5cGVBcmd1bWVudHMuYmluZCh0aGlzKSxcbiAgICAgICk7XG5cbiAgICAgIGlmICghZGVsaW1pdGVkTGlzdC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yYWlzZShvcmlnaW5hbFN0YXJ0LCBUU0Vycm9ycy5FbXB0eUhlcml0YWdlQ2xhdXNlVHlwZSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWxpbWl0ZWRMaXN0O1xuICAgIH1cblxuICAgIHRzUGFyc2VFeHByZXNzaW9uV2l0aFR5cGVBcmd1bWVudHMoKTogTi5Uc0V4cHJlc3Npb25XaXRoVHlwZUFyZ3VtZW50cyB7XG4gICAgICBjb25zdCBub2RlOiBOLlRzRXhwcmVzc2lvbldpdGhUeXBlQXJndW1lbnRzID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIC8vIE5vdGU6IFRTIHVzZXMgcGFyc2VMZWZ0SGFuZFNpZGVFeHByZXNzaW9uT3JIaWdoZXIsXG4gICAgICAvLyB0aGVuIGhhcyBncmFtbWFyIGVycm9ycyBsYXRlciBpZiBpdCdzIG5vdCBhbiBFbnRpdHlOYW1lLlxuICAgICAgbm9kZS5leHByZXNzaW9uID0gdGhpcy50c1BhcnNlRW50aXR5TmFtZSgvKiBhbGxvd1Jlc2VydmVkV29yZHMgKi8gZmFsc2UpO1xuICAgICAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdGhpcy50c1BhcnNlVHlwZUFyZ3VtZW50cygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNFeHByZXNzaW9uV2l0aFR5cGVBcmd1bWVudHNcIik7XG4gICAgfVxuXG4gICAgdHNQYXJzZUludGVyZmFjZURlY2xhcmF0aW9uKFxuICAgICAgbm9kZTogTi5Uc0ludGVyZmFjZURlY2xhcmF0aW9uLFxuICAgICk6IE4uVHNJbnRlcmZhY2VEZWNsYXJhdGlvbiB7XG4gICAgICBub2RlLmlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIHRoaXMuY2hlY2tMVmFsKFxuICAgICAgICBub2RlLmlkLFxuICAgICAgICBcInR5cGVzY3JpcHQgaW50ZXJmYWNlIGRlY2xhcmF0aW9uXCIsXG4gICAgICAgIEJJTkRfVFNfSU5URVJGQUNFLFxuICAgICAgKTtcbiAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLnRzVHJ5UGFyc2VUeXBlUGFyYW1ldGVycygpO1xuICAgICAgaWYgKHRoaXMuZWF0KHR0Ll9leHRlbmRzKSkge1xuICAgICAgICBub2RlLmV4dGVuZHMgPSB0aGlzLnRzUGFyc2VIZXJpdGFnZUNsYXVzZShcImV4dGVuZHNcIik7XG4gICAgICB9XG4gICAgICBjb25zdCBib2R5OiBOLlRTSW50ZXJmYWNlQm9keSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBib2R5LmJvZHkgPSB0aGlzLnRzSW5UeXBlKHRoaXMudHNQYXJzZU9iamVjdFR5cGVNZW1iZXJzLmJpbmQodGhpcykpO1xuICAgICAgbm9kZS5ib2R5ID0gdGhpcy5maW5pc2hOb2RlKGJvZHksIFwiVFNJbnRlcmZhY2VCb2R5XCIpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTSW50ZXJmYWNlRGVjbGFyYXRpb25cIik7XG4gICAgfVxuXG4gICAgdHNQYXJzZVR5cGVBbGlhc0RlY2xhcmF0aW9uKFxuICAgICAgbm9kZTogTi5Uc1R5cGVBbGlhc0RlY2xhcmF0aW9uLFxuICAgICk6IE4uVHNUeXBlQWxpYXNEZWNsYXJhdGlvbiB7XG4gICAgICBub2RlLmlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIHRoaXMuY2hlY2tMVmFsKG5vZGUuaWQsIFwidHlwZXNjcmlwdCB0eXBlIGFsaWFzXCIsIEJJTkRfVFNfVFlQRSk7XG5cbiAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLnRzVHJ5UGFyc2VUeXBlUGFyYW1ldGVycygpO1xuICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiA9IHRoaXMudHNJblR5cGUoKCkgPT4ge1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5lcSk7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuaXNDb250ZXh0dWFsKFwiaW50cmluc2ljXCIpICYmXG4gICAgICAgICAgdGhpcy5sb29rYWhlYWQoKS50eXBlICE9PSB0dC5kb3RcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZTogTi5Uc0tleXdvcmRUeXBlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNJbnRyaW5zaWNLZXl3b3JkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZVR5cGUoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNlbWljb2xvbigpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZUFsaWFzRGVjbGFyYXRpb25cIik7XG4gICAgfVxuXG4gICAgdHNJbk5vQ29udGV4dDxUPihjYjogKCkgPT4gVCk6IFQge1xuICAgICAgY29uc3Qgb2xkQ29udGV4dCA9IHRoaXMuc3RhdGUuY29udGV4dDtcbiAgICAgIHRoaXMuc3RhdGUuY29udGV4dCA9IFtvbGRDb250ZXh0WzBdXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjYigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0ID0gb2xkQ29udGV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIGBjYmAgaW4gYSB0eXBlIGNvbnRleHQuXG4gICAgICogVGhpcyBzaG91bGQgYmUgY2FsbGVkIG9uZSB0b2tlbiAqYmVmb3JlKiB0aGUgZmlyc3QgdHlwZSB0b2tlbixcbiAgICAgKiBzbyB0aGF0IHRoZSBjYWxsIHRvIGBuZXh0KClgIGlzIHJ1biBpbiB0eXBlIGNvbnRleHQuXG4gICAgICovXG4gICAgdHNJblR5cGU8VD4oY2I6ICgpID0+IFQpOiBUIHtcbiAgICAgIGNvbnN0IG9sZEluVHlwZSA9IHRoaXMuc3RhdGUuaW5UeXBlO1xuICAgICAgdGhpcy5zdGF0ZS5pblR5cGUgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnN0YXRlLmluVHlwZSA9IG9sZEluVHlwZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0c0VhdFRoZW5QYXJzZVR5cGUodG9rZW46IFRva2VuVHlwZSk6IE4uVHNUeXBlIHwgdHlwZW9mIHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gIXRoaXMubWF0Y2godG9rZW4pID8gdW5kZWZpbmVkIDogdGhpcy50c05leHRUaGVuUGFyc2VUeXBlKCk7XG4gICAgfVxuXG4gICAgdHNFeHBlY3RUaGVuUGFyc2VUeXBlKHRva2VuOiBUb2tlblR5cGUpOiBOLlRzVHlwZSB7XG4gICAgICByZXR1cm4gdGhpcy50c0RvVGhlblBhcnNlVHlwZSgoKSA9PiB0aGlzLmV4cGVjdCh0b2tlbikpO1xuICAgIH1cblxuICAgIHRzTmV4dFRoZW5QYXJzZVR5cGUoKTogTi5Uc1R5cGUge1xuICAgICAgcmV0dXJuIHRoaXMudHNEb1RoZW5QYXJzZVR5cGUoKCkgPT4gdGhpcy5uZXh0KCkpO1xuICAgIH1cblxuICAgIHRzRG9UaGVuUGFyc2VUeXBlKGNiOiAoKSA9PiB2b2lkKTogTi5Uc1R5cGUge1xuICAgICAgcmV0dXJuIHRoaXMudHNJblR5cGUoKCkgPT4ge1xuICAgICAgICBjYigpO1xuICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlVHlwZSgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdHNQYXJzZUVudW1NZW1iZXIoKTogTi5Uc0VudW1NZW1iZXIge1xuICAgICAgY29uc3Qgbm9kZTogTi5Uc0VudW1NZW1iZXIgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgLy8gQ29tcHV0ZWQgcHJvcGVydHkgbmFtZXMgYXJlIGdyYW1tYXIgZXJyb3JzIGluIGFuIGVudW0sIHNvIGFjY2VwdCBqdXN0IHN0cmluZyBsaXRlcmFsIG9yIGlkZW50aWZpZXIuXG4gICAgICBub2RlLmlkID0gdGhpcy5tYXRjaCh0dC5zdHJpbmcpXG4gICAgICAgID8gdGhpcy5wYXJzZUV4cHJBdG9tKClcbiAgICAgICAgOiB0aGlzLnBhcnNlSWRlbnRpZmllcigvKiBsaWJlcmFsICovIHRydWUpO1xuICAgICAgaWYgKHRoaXMuZWF0KHR0LmVxKSkge1xuICAgICAgICBub2RlLmluaXRpYWxpemVyID0gdGhpcy5wYXJzZU1heWJlQXNzaWduQWxsb3dJbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTRW51bU1lbWJlclwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlRW51bURlY2xhcmF0aW9uKFxuICAgICAgbm9kZTogTi5Uc0VudW1EZWNsYXJhdGlvbixcbiAgICAgIGlzQ29uc3Q6IGJvb2xlYW4sXG4gICAgKTogTi5Uc0VudW1EZWNsYXJhdGlvbiB7XG4gICAgICBpZiAoaXNDb25zdCkgbm9kZS5jb25zdCA9IHRydWU7XG4gICAgICBub2RlLmlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIHRoaXMuY2hlY2tMVmFsKFxuICAgICAgICBub2RlLmlkLFxuICAgICAgICBcInR5cGVzY3JpcHQgZW51bSBkZWNsYXJhdGlvblwiLFxuICAgICAgICBpc0NvbnN0ID8gQklORF9UU19DT05TVF9FTlVNIDogQklORF9UU19FTlVNLFxuICAgICAgKTtcblxuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcbiAgICAgIG5vZGUubWVtYmVycyA9IHRoaXMudHNQYXJzZURlbGltaXRlZExpc3QoXG4gICAgICAgIFwiRW51bU1lbWJlcnNcIixcbiAgICAgICAgdGhpcy50c1BhcnNlRW51bU1lbWJlci5iaW5kKHRoaXMpLFxuICAgICAgKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlUik7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNFbnVtRGVjbGFyYXRpb25cIik7XG4gICAgfVxuXG4gICAgdHNQYXJzZU1vZHVsZUJsb2NrKCk6IE4uVHNNb2R1bGVCbG9jayB7XG4gICAgICBjb25zdCBub2RlOiBOLlRzTW9kdWxlQmxvY2sgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5zY29wZS5lbnRlcihTQ09QRV9PVEhFUik7XG5cbiAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlTCk7XG4gICAgICAvLyBJbnNpZGUgb2YgYSBtb2R1bGUgYmxvY2sgaXMgY29uc2lkZXJlZCBcInRvcC1sZXZlbFwiLCBtZWFuaW5nIGl0IGNhbiBoYXZlIGltcG9ydHMgYW5kIGV4cG9ydHMuXG4gICAgICB0aGlzLnBhcnNlQmxvY2tPck1vZHVsZUJsb2NrQm9keShcbiAgICAgICAgKG5vZGUuYm9keSA9IFtdKSxcbiAgICAgICAgLyogZGlyZWN0aXZlcyAqLyB1bmRlZmluZWQsXG4gICAgICAgIC8qIHRvcExldmVsICovIHRydWUsXG4gICAgICAgIC8qIGVuZCAqLyB0dC5icmFjZVIsXG4gICAgICApO1xuICAgICAgdGhpcy5zY29wZS5leGl0KCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNNb2R1bGVCbG9ja1wiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlTW9kdWxlT3JOYW1lc3BhY2VEZWNsYXJhdGlvbihcbiAgICAgIG5vZGU6IE4uVHNNb2R1bGVEZWNsYXJhdGlvbixcbiAgICAgIG5lc3RlZD86IGJvb2xlYW4gPSBmYWxzZSxcbiAgICApOiBOLlRzTW9kdWxlRGVjbGFyYXRpb24ge1xuICAgICAgbm9kZS5pZCA9IHRoaXMucGFyc2VJZGVudGlmaWVyKCk7XG5cbiAgICAgIGlmICghbmVzdGVkKSB7XG4gICAgICAgIHRoaXMuY2hlY2tMVmFsKFxuICAgICAgICAgIG5vZGUuaWQsXG4gICAgICAgICAgXCJtb2R1bGUgb3IgbmFtZXNwYWNlIGRlY2xhcmF0aW9uXCIsXG4gICAgICAgICAgQklORF9UU19OQU1FU1BBQ0UsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmVhdCh0dC5kb3QpKSB7XG4gICAgICAgIGNvbnN0IGlubmVyID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgICAgdGhpcy50c1BhcnNlTW9kdWxlT3JOYW1lc3BhY2VEZWNsYXJhdGlvbihpbm5lciwgdHJ1ZSk7XG4gICAgICAgIG5vZGUuYm9keSA9IGlubmVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zY29wZS5lbnRlcihTQ09QRV9UU19NT0RVTEUpO1xuICAgICAgICB0aGlzLnByb2RQYXJhbS5lbnRlcihQQVJBTSk7XG4gICAgICAgIG5vZGUuYm9keSA9IHRoaXMudHNQYXJzZU1vZHVsZUJsb2NrKCk7XG4gICAgICAgIHRoaXMucHJvZFBhcmFtLmV4aXQoKTtcbiAgICAgICAgdGhpcy5zY29wZS5leGl0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNNb2R1bGVEZWNsYXJhdGlvblwiKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlQW1iaWVudEV4dGVybmFsTW9kdWxlRGVjbGFyYXRpb24oXG4gICAgICBub2RlOiBOLlRzTW9kdWxlRGVjbGFyYXRpb24sXG4gICAgKTogTi5Uc01vZHVsZURlY2xhcmF0aW9uIHtcbiAgICAgIGlmICh0aGlzLmlzQ29udGV4dHVhbChcImdsb2JhbFwiKSkge1xuICAgICAgICBub2RlLmdsb2JhbCA9IHRydWU7XG4gICAgICAgIG5vZGUuaWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0LnN0cmluZykpIHtcbiAgICAgICAgbm9kZS5pZCA9IHRoaXMucGFyc2VFeHByQXRvbSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5icmFjZUwpKSB7XG4gICAgICAgIHRoaXMuc2NvcGUuZW50ZXIoU0NPUEVfVFNfTU9EVUxFKTtcbiAgICAgICAgdGhpcy5wcm9kUGFyYW0uZW50ZXIoUEFSQU0pO1xuICAgICAgICBub2RlLmJvZHkgPSB0aGlzLnRzUGFyc2VNb2R1bGVCbG9jaygpO1xuICAgICAgICB0aGlzLnByb2RQYXJhbS5leGl0KCk7XG4gICAgICAgIHRoaXMuc2NvcGUuZXhpdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTTW9kdWxlRGVjbGFyYXRpb25cIik7XG4gICAgfVxuXG4gICAgdHNQYXJzZUltcG9ydEVxdWFsc0RlY2xhcmF0aW9uKFxuICAgICAgbm9kZTogTi5Uc0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uLFxuICAgICAgaXNFeHBvcnQ/OiBib29sZWFuLFxuICAgICk6IE4uVHNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbiB7XG4gICAgICBub2RlLmlzRXhwb3J0ID0gaXNFeHBvcnQgfHwgZmFsc2U7XG4gICAgICBub2RlLmlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIHRoaXMuY2hlY2tMVmFsKG5vZGUuaWQsIFwiaW1wb3J0IGVxdWFscyBkZWNsYXJhdGlvblwiLCBCSU5EX0xFWElDQUwpO1xuICAgICAgdGhpcy5leHBlY3QodHQuZXEpO1xuICAgICAgY29uc3QgbW9kdWxlUmVmZXJlbmNlID0gdGhpcy50c1BhcnNlTW9kdWxlUmVmZXJlbmNlKCk7XG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUuaW1wb3J0S2luZCA9PT0gXCJ0eXBlXCIgJiZcbiAgICAgICAgbW9kdWxlUmVmZXJlbmNlLnR5cGUgIT09IFwiVFNFeHRlcm5hbE1vZHVsZVJlZmVyZW5jZVwiXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yYWlzZShtb2R1bGVSZWZlcmVuY2Uuc3RhcnQsIFRTRXJyb3JzLkltcG9ydEFsaWFzSGFzSW1wb3J0VHlwZSk7XG4gICAgICB9XG4gICAgICBub2RlLm1vZHVsZVJlZmVyZW5jZSA9IG1vZHVsZVJlZmVyZW5jZTtcbiAgICAgIHRoaXMuc2VtaWNvbG9uKCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvblwiKTtcbiAgICB9XG5cbiAgICB0c0lzRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLmlzQ29udGV4dHVhbChcInJlcXVpcmVcIikgJiZcbiAgICAgICAgdGhpcy5sb29rYWhlYWRDaGFyQ29kZSgpID09PSBjaGFyQ29kZXMubGVmdFBhcmVudGhlc2lzXG4gICAgICApO1xuICAgIH1cblxuICAgIHRzUGFyc2VNb2R1bGVSZWZlcmVuY2UoKTogTi5Uc01vZHVsZVJlZmVyZW5jZSB7XG4gICAgICByZXR1cm4gdGhpcy50c0lzRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UoKVxuICAgICAgICA/IHRoaXMudHNQYXJzZUV4dGVybmFsTW9kdWxlUmVmZXJlbmNlKClcbiAgICAgICAgOiB0aGlzLnRzUGFyc2VFbnRpdHlOYW1lKC8qIGFsbG93UmVzZXJ2ZWRXb3JkcyAqLyBmYWxzZSk7XG4gICAgfVxuXG4gICAgdHNQYXJzZUV4dGVybmFsTW9kdWxlUmVmZXJlbmNlKCk6IE4uVHNFeHRlcm5hbE1vZHVsZVJlZmVyZW5jZSB7XG4gICAgICBjb25zdCBub2RlOiBOLlRzRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5leHBlY3RDb250ZXh0dWFsKFwicmVxdWlyZVwiKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuTCk7XG4gICAgICBpZiAoIXRoaXMubWF0Y2godHQuc3RyaW5nKSkge1xuICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgIH1cbiAgICAgIC8vIEZvciBjb21wYXRpYmlsaXR5IHRvIGVzdHJlZSB3ZSBjYW5ub3QgY2FsbCBwYXJzZUxpdGVyYWwgZGlyZWN0bHkgaGVyZVxuICAgICAgbm9kZS5leHByZXNzaW9uID0gdGhpcy5wYXJzZUV4cHJBdG9tKCk7XG4gICAgICB0aGlzLmV4cGVjdCh0dC5wYXJlblIpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2VcIik7XG4gICAgfVxuXG4gICAgLy8gVXRpbGl0aWVzXG5cbiAgICB0c0xvb2tBaGVhZDxUPihmOiAoKSA9PiBUKTogVCB7XG4gICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUuY2xvbmUoKTtcbiAgICAgIGNvbnN0IHJlcyA9IGYoKTtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgdHNUcnlQYXJzZUFuZENhdGNoPFQ6ID9OLk5vZGVCYXNlPihmOiAoKSA9PiBUKTogP1Qge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy50cnlQYXJzZShhYm9ydCA9PiBmKCkgfHwgYWJvcnQoKSk7XG5cbiAgICAgIGlmIChyZXN1bHQuYWJvcnRlZCB8fCAhcmVzdWx0Lm5vZGUpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB0aGlzLnN0YXRlID0gcmVzdWx0LmZhaWxTdGF0ZTtcbiAgICAgIHJldHVybiByZXN1bHQubm9kZTtcbiAgICB9XG5cbiAgICB0c1RyeVBhcnNlPFQ+KGY6ICgpID0+ID9UKTogP1Qge1xuICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLnN0YXRlLmNsb25lKCk7XG4gICAgICBjb25zdCByZXN1bHQgPSBmKCk7XG4gICAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQgJiYgcmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRzVHJ5UGFyc2VEZWNsYXJlKG5hbnk6IGFueSk6ID9OLkRlY2xhcmF0aW9uIHtcbiAgICAgIGlmICh0aGlzLmlzTGluZVRlcm1pbmF0b3IoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgc3RhcnR0eXBlID0gdGhpcy5zdGF0ZS50eXBlO1xuICAgICAgbGV0IGtpbmQ7XG5cbiAgICAgIGlmICh0aGlzLmlzQ29udGV4dHVhbChcImxldFwiKSkge1xuICAgICAgICBzdGFydHR5cGUgPSB0dC5fdmFyO1xuICAgICAgICBraW5kID0gXCJsZXRcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMudHNJbkFtYmllbnRDb250ZXh0KCgpID0+IHtcbiAgICAgICAgc3dpdGNoIChzdGFydHR5cGUpIHtcbiAgICAgICAgICBjYXNlIHR0Ll9mdW5jdGlvbjpcbiAgICAgICAgICAgIG5hbnkuZGVjbGFyZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZ1bmN0aW9uU3RhdGVtZW50KFxuICAgICAgICAgICAgICBuYW55LFxuICAgICAgICAgICAgICAvKiBhc3luYyAqLyBmYWxzZSxcbiAgICAgICAgICAgICAgLyogZGVjbGFyYXRpb25Qb3NpdGlvbiAqLyB0cnVlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICBjYXNlIHR0Ll9jbGFzczpcbiAgICAgICAgICAgIC8vIFdoaWxlIHRoaXMgaXMgYWxzbyBzZXQgYnkgdHNQYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQsIHdlIG5lZWQgdG8gc2V0IGl0XG4gICAgICAgICAgICAvLyBiZWZvcmUgcGFyc2luZyB0aGUgY2xhc3MgZGVjbGFyYXRpb24gdG8gbm93IGhvdyB0byByZWdpc3RlciBpdCBpbiB0aGUgc2NvcGUuXG4gICAgICAgICAgICBuYW55LmRlY2xhcmUgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDbGFzcyhcbiAgICAgICAgICAgICAgbmFueSxcbiAgICAgICAgICAgICAgLyogaXNTdGF0ZW1lbnQgKi8gdHJ1ZSxcbiAgICAgICAgICAgICAgLyogb3B0aW9uYWxJZCAqLyBmYWxzZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgY2FzZSB0dC5fY29uc3Q6XG4gICAgICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5fY29uc3QpICYmIHRoaXMuaXNMb29rYWhlYWRDb250ZXh0dWFsKFwiZW51bVwiKSkge1xuICAgICAgICAgICAgICAvLyBgY29uc3QgZW51bSA9IDA7YCBub3QgYWxsb3dlZCBiZWNhdXNlIFwiZW51bVwiIGlzIGEgc3RyaWN0IG1vZGUgcmVzZXJ2ZWQgd29yZC5cbiAgICAgICAgICAgICAgdGhpcy5leHBlY3QodHQuX2NvbnN0KTtcbiAgICAgICAgICAgICAgdGhpcy5leHBlY3RDb250ZXh0dWFsKFwiZW51bVwiKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUVudW1EZWNsYXJhdGlvbihuYW55LCAvKiBpc0NvbnN0ICovIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIC8vIGZhbGxzIHRocm91Z2hcbiAgICAgICAgICBjYXNlIHR0Ll92YXI6XG4gICAgICAgICAgICBraW5kID0ga2luZCB8fCB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VWYXJTdGF0ZW1lbnQobmFueSwga2luZCk7XG4gICAgICAgICAgY2FzZSB0dC5uYW1lOiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiZ2xvYmFsXCIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUFtYmllbnRFeHRlcm5hbE1vZHVsZURlY2xhcmF0aW9uKG5hbnkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZURlY2xhcmF0aW9uKG5hbnksIHZhbHVlLCAvKiBuZXh0ICovIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGlzIHdvbid0IGJlIGNhbGxlZCB1bmxlc3MgdGhlIGtleXdvcmQgaXMgYWxsb3dlZCBpbiBgc2hvdWxkUGFyc2VFeHBvcnREZWNsYXJhdGlvbmAuXG4gICAgdHNUcnlQYXJzZUV4cG9ydERlY2xhcmF0aW9uKCk6ID9OLkRlY2xhcmF0aW9uIHtcbiAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VEZWNsYXJhdGlvbihcbiAgICAgICAgdGhpcy5zdGFydE5vZGUoKSxcbiAgICAgICAgdGhpcy5zdGF0ZS52YWx1ZSxcbiAgICAgICAgLyogbmV4dCAqLyB0cnVlLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0c1BhcnNlRXhwcmVzc2lvblN0YXRlbWVudChub2RlOiBhbnksIGV4cHI6IE4uSWRlbnRpZmllcik6ID9OLkRlY2xhcmF0aW9uIHtcbiAgICAgIHN3aXRjaCAoZXhwci5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJkZWNsYXJlXCI6IHtcbiAgICAgICAgICBjb25zdCBkZWNsYXJhdGlvbiA9IHRoaXMudHNUcnlQYXJzZURlY2xhcmUobm9kZSk7XG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICBkZWNsYXJhdGlvbi5kZWNsYXJlID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWNsYXJhdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcImdsb2JhbFwiOlxuICAgICAgICAgIC8vIGBnbG9iYWwgeyB9YCAod2l0aCBubyBgZGVjbGFyZWApIG1heSBhcHBlYXIgaW5zaWRlIGFuIGFtYmllbnQgbW9kdWxlIGRlY2xhcmF0aW9uLlxuICAgICAgICAgIC8vIFdvdWxkIGxpa2UgdG8gdXNlIHRzUGFyc2VBbWJpZW50RXh0ZXJuYWxNb2R1bGVEZWNsYXJhdGlvbiBoZXJlLCBidXQgYWxyZWFkeSByYW4gcGFzdCBcImdsb2JhbFwiLlxuICAgICAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmJyYWNlTCkpIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcGUuZW50ZXIoU0NPUEVfVFNfTU9EVUxFKTtcbiAgICAgICAgICAgIHRoaXMucHJvZFBhcmFtLmVudGVyKFBBUkFNKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZDogTi5Uc01vZHVsZURlY2xhcmF0aW9uID0gbm9kZTtcbiAgICAgICAgICAgIG1vZC5nbG9iYWwgPSB0cnVlO1xuICAgICAgICAgICAgbW9kLmlkID0gZXhwcjtcbiAgICAgICAgICAgIG1vZC5ib2R5ID0gdGhpcy50c1BhcnNlTW9kdWxlQmxvY2soKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcGUuZXhpdCgpO1xuICAgICAgICAgICAgdGhpcy5wcm9kUGFyYW0uZXhpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShtb2QsIFwiVFNNb2R1bGVEZWNsYXJhdGlvblwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlRGVjbGFyYXRpb24obm9kZSwgZXhwci5uYW1lLCAvKiBuZXh0ICovIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb21tb24gdG8gdHNUcnlQYXJzZURlY2xhcmUsIHRzVHJ5UGFyc2VFeHBvcnREZWNsYXJhdGlvbiwgYW5kIHRzUGFyc2VFeHByZXNzaW9uU3RhdGVtZW50LlxuICAgIHRzUGFyc2VEZWNsYXJhdGlvbihcbiAgICAgIG5vZGU6IGFueSxcbiAgICAgIHZhbHVlOiBzdHJpbmcsXG4gICAgICBuZXh0OiBib29sZWFuLFxuICAgICk6ID9OLkRlY2xhcmF0aW9uIHtcbiAgICAgIC8vIG5vIGRlY2xhcmF0aW9uIGFwYXJ0IGZyb20gZW51bSBjYW4gYmUgZm9sbG93ZWQgYnkgYSBsaW5lIGJyZWFrLlxuICAgICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgICBjYXNlIFwiYWJzdHJhY3RcIjpcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLnRzQ2hlY2tMaW5lVGVybWluYXRvcihuZXh0KSAmJlxuICAgICAgICAgICAgKHRoaXMubWF0Y2godHQuX2NsYXNzKSB8fCB0aGlzLm1hdGNoKHR0Lm5hbWUpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUFic3RyYWN0RGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJlbnVtXCI6XG4gICAgICAgICAgaWYgKG5leHQgfHwgdGhpcy5tYXRjaCh0dC5uYW1lKSkge1xuICAgICAgICAgICAgaWYgKG5leHQpIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUVudW1EZWNsYXJhdGlvbihub2RlLCAvKiBpc0NvbnN0ICovIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImludGVyZmFjZVwiOlxuICAgICAgICAgIGlmICh0aGlzLnRzQ2hlY2tMaW5lVGVybWluYXRvcihuZXh0KSAmJiB0aGlzLm1hdGNoKHR0Lm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlSW50ZXJmYWNlRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJtb2R1bGVcIjpcbiAgICAgICAgICBpZiAodGhpcy50c0NoZWNrTGluZVRlcm1pbmF0b3IobmV4dCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnN0cmluZykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUFtYmllbnRFeHRlcm5hbE1vZHVsZURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0Lm5hbWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VNb2R1bGVPck5hbWVzcGFjZURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwibmFtZXNwYWNlXCI6XG4gICAgICAgICAgaWYgKHRoaXMudHNDaGVja0xpbmVUZXJtaW5hdG9yKG5leHQpICYmIHRoaXMubWF0Y2godHQubmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VNb2R1bGVPck5hbWVzcGFjZURlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFwidHlwZVwiOlxuICAgICAgICAgIGlmICh0aGlzLnRzQ2hlY2tMaW5lVGVybWluYXRvcihuZXh0KSAmJiB0aGlzLm1hdGNoKHR0Lm5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlVHlwZUFsaWFzRGVjbGFyYXRpb24obm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRzQ2hlY2tMaW5lVGVybWluYXRvcihuZXh0OiBib29sZWFuKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBpZiAodGhpcy5oYXNGb2xsb3dpbmdMaW5lQnJlYWsoKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gIXRoaXMuaXNMaW5lVGVybWluYXRvcigpO1xuICAgIH1cblxuICAgIHRzVHJ5UGFyc2VHZW5lcmljQXN5bmNBcnJvd0Z1bmN0aW9uKFxuICAgICAgc3RhcnRQb3M6IG51bWJlcixcbiAgICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICApOiA/Ti5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgICBpZiAoIXRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbGRNYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzO1xuICAgICAgdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gdHJ1ZTtcblxuICAgICAgY29uc3QgcmVzOiA/Ti5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiA9IHRoaXMudHNUcnlQYXJzZUFuZENhdGNoKCgpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZTogTi5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiA9IHRoaXMuc3RhcnROb2RlQXQoXG4gICAgICAgICAgc3RhcnRQb3MsXG4gICAgICAgICAgc3RhcnRMb2MsXG4gICAgICAgICk7XG4gICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0aGlzLnRzUGFyc2VUeXBlUGFyYW1ldGVycygpO1xuICAgICAgICAvLyBEb24ndCB1c2Ugb3ZlcmxvYWRlZCBwYXJzZUZ1bmN0aW9uUGFyYW1zIHdoaWNoIHdvdWxkIGxvb2sgZm9yIFwiPFwiIGFnYWluLlxuICAgICAgICBzdXBlci5wYXJzZUZ1bmN0aW9uUGFyYW1zKG5vZGUpO1xuICAgICAgICBub2RlLnJldHVyblR5cGUgPSB0aGlzLnRzVHJ5UGFyc2VUeXBlT3JUeXBlUHJlZGljYXRlQW5ub3RhdGlvbigpO1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5hcnJvdyk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyA9IG9sZE1heWJlSW5BcnJvd1BhcmFtZXRlcnM7XG5cbiAgICAgIGlmICghcmVzKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnBhcnNlQXJyb3dFeHByZXNzaW9uKFxuICAgICAgICByZXMsXG4gICAgICAgIC8qIHBhcmFtcyBhcmUgYWxyZWFkeSBzZXQgKi8gbnVsbCxcbiAgICAgICAgLyogYXN5bmMgKi8gdHJ1ZSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHNQYXJzZVR5cGVBcmd1bWVudHMoKTogTi5Uc1R5cGVQYXJhbWV0ZXJJbnN0YW50aWF0aW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgbm9kZS5wYXJhbXMgPSB0aGlzLnRzSW5UeXBlKCgpID0+XG4gICAgICAgIC8vIFRlbXBvcmFyaWx5IHJlbW92ZSBhIEpTWCBwYXJzaW5nIGNvbnRleHQsIHdoaWNoIG1ha2VzIHVzIHNjYW4gZGlmZmVyZW50IHRva2Vucy5cbiAgICAgICAgdGhpcy50c0luTm9Db250ZXh0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmV4cGVjdFJlbGF0aW9uYWwoXCI8XCIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VEZWxpbWl0ZWRMaXN0KFxuICAgICAgICAgICAgXCJUeXBlUGFyYW1ldGVyc09yQXJndW1lbnRzXCIsXG4gICAgICAgICAgICB0aGlzLnRzUGFyc2VUeXBlLmJpbmQodGhpcyksXG4gICAgICAgICAgKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgICAgaWYgKG5vZGUucGFyYW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnJhaXNlKG5vZGUuc3RhcnQsIFRTRXJyb3JzLkVtcHR5VHlwZUFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICB0aGlzLmV4cGVjdFJlbGF0aW9uYWwoXCI+XCIpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRTVHlwZVBhcmFtZXRlckluc3RhbnRpYXRpb25cIik7XG4gICAgfVxuXG4gICAgdHNJc0RlY2xhcmF0aW9uU3RhcnQoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5uYW1lKSkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUudmFsdWUpIHtcbiAgICAgICAgICBjYXNlIFwiYWJzdHJhY3RcIjpcbiAgICAgICAgICBjYXNlIFwiZGVjbGFyZVwiOlxuICAgICAgICAgIGNhc2UgXCJlbnVtXCI6XG4gICAgICAgICAgY2FzZSBcImludGVyZmFjZVwiOlxuICAgICAgICAgIGNhc2UgXCJtb2R1bGVcIjpcbiAgICAgICAgICBjYXNlIFwibmFtZXNwYWNlXCI6XG4gICAgICAgICAgY2FzZSBcInR5cGVcIjpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBPVkVSUklERVNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIGlzRXhwb3J0RGVmYXVsdFNwZWNpZmllcigpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLnRzSXNEZWNsYXJhdGlvblN0YXJ0KCkpIHJldHVybiBmYWxzZTtcbiAgICAgIHJldHVybiBzdXBlci5pc0V4cG9ydERlZmF1bHRTcGVjaWZpZXIoKTtcbiAgICB9XG5cbiAgICBwYXJzZUFzc2lnbmFibGVMaXN0SXRlbShcbiAgICAgIGFsbG93TW9kaWZpZXJzOiA/Ym9vbGVhbixcbiAgICAgIGRlY29yYXRvcnM6IE4uRGVjb3JhdG9yW10sXG4gICAgKTogTi5QYXR0ZXJuIHwgTi5UU1BhcmFtZXRlclByb3BlcnR5IHtcbiAgICAgIC8vIFN0b3JlIG9yaWdpbmFsIGxvY2F0aW9uL3Bvc2l0aW9uIHRvIGluY2x1ZGUgbW9kaWZpZXJzIGluIHJhbmdlXG4gICAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG5cbiAgICAgIGxldCBhY2Nlc3NpYmlsaXR5OiA/Ti5BY2Nlc3NpYmlsaXR5O1xuICAgICAgbGV0IHJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICBsZXQgb3ZlcnJpZGUgPSBmYWxzZTtcbiAgICAgIGlmIChhbGxvd01vZGlmaWVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IG1vZGlmaWVkID0ge307XG4gICAgICAgIHRoaXMudHNQYXJzZU1vZGlmaWVycyhtb2RpZmllZCwgW1xuICAgICAgICAgIFwicHVibGljXCIsXG4gICAgICAgICAgXCJwcml2YXRlXCIsXG4gICAgICAgICAgXCJwcm90ZWN0ZWRcIixcbiAgICAgICAgICBcIm92ZXJyaWRlXCIsXG4gICAgICAgICAgXCJyZWFkb25seVwiLFxuICAgICAgICBdKTtcbiAgICAgICAgYWNjZXNzaWJpbGl0eSA9IG1vZGlmaWVkLmFjY2Vzc2liaWxpdHk7XG4gICAgICAgIG92ZXJyaWRlID0gbW9kaWZpZWQub3ZlcnJpZGU7XG4gICAgICAgIHJlYWRvbmx5ID0gbW9kaWZpZWQucmVhZG9ubHk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhbGxvd01vZGlmaWVycyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAoYWNjZXNzaWJpbGl0eSB8fCByZWFkb25seSB8fCBvdmVycmlkZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShzdGFydFBvcywgVFNFcnJvcnMuVW5leHBlY3RlZFBhcmFtZXRlck1vZGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsZWZ0ID0gdGhpcy5wYXJzZU1heWJlRGVmYXVsdCgpO1xuICAgICAgdGhpcy5wYXJzZUFzc2lnbmFibGVMaXN0SXRlbVR5cGVzKGxlZnQpO1xuICAgICAgY29uc3QgZWx0ID0gdGhpcy5wYXJzZU1heWJlRGVmYXVsdChsZWZ0LnN0YXJ0LCBsZWZ0LmxvYy5zdGFydCwgbGVmdCk7XG4gICAgICBpZiAoYWNjZXNzaWJpbGl0eSB8fCByZWFkb25seSB8fCBvdmVycmlkZSkge1xuICAgICAgICBjb25zdCBwcDogTi5UU1BhcmFtZXRlclByb3BlcnR5ID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgICBpZiAoZGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBwcC5kZWNvcmF0b3JzID0gZGVjb3JhdG9ycztcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWNjZXNzaWJpbGl0eSkgcHAuYWNjZXNzaWJpbGl0eSA9IGFjY2Vzc2liaWxpdHk7XG4gICAgICAgIGlmIChyZWFkb25seSkgcHAucmVhZG9ubHkgPSByZWFkb25seTtcbiAgICAgICAgaWYgKG92ZXJyaWRlKSBwcC5vdmVycmlkZSA9IG92ZXJyaWRlO1xuICAgICAgICBpZiAoZWx0LnR5cGUgIT09IFwiSWRlbnRpZmllclwiICYmIGVsdC50eXBlICE9PSBcIkFzc2lnbm1lbnRQYXR0ZXJuXCIpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHBwLnN0YXJ0LCBUU0Vycm9ycy5VbnN1cHBvcnRlZFBhcmFtZXRlclByb3BlcnR5S2luZCk7XG4gICAgICAgIH1cbiAgICAgICAgcHAucGFyYW1ldGVyID0gKChlbHQ6IGFueSk6IE4uSWRlbnRpZmllciB8IE4uQXNzaWdubWVudFBhdHRlcm4pO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKHBwLCBcIlRTUGFyYW1ldGVyUHJvcGVydHlcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWNvcmF0b3JzLmxlbmd0aCkge1xuICAgICAgICBsZWZ0LmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWx0O1xuICAgIH1cblxuICAgIHBhcnNlRnVuY3Rpb25Cb2R5QW5kRmluaXNoKFxuICAgICAgbm9kZTogTi5Cb2RpbGVzc0Z1bmN0aW9uT3JNZXRob2RCYXNlLFxuICAgICAgdHlwZTogc3RyaW5nLFxuICAgICAgaXNNZXRob2Q/OiBib29sZWFuID0gZmFsc2UsXG4gICAgKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5jb2xvbikpIHtcbiAgICAgICAgbm9kZS5yZXR1cm5UeXBlID0gdGhpcy50c1BhcnNlVHlwZU9yVHlwZVByZWRpY2F0ZUFubm90YXRpb24odHQuY29sb24pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBib2RpbGVzc1R5cGUgPVxuICAgICAgICB0eXBlID09PSBcIkZ1bmN0aW9uRGVjbGFyYXRpb25cIlxuICAgICAgICAgID8gXCJUU0RlY2xhcmVGdW5jdGlvblwiXG4gICAgICAgICAgOiB0eXBlID09PSBcIkNsYXNzTWV0aG9kXCJcbiAgICAgICAgICA/IFwiVFNEZWNsYXJlTWV0aG9kXCJcbiAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChib2RpbGVzc1R5cGUgJiYgIXRoaXMubWF0Y2godHQuYnJhY2VMKSAmJiB0aGlzLmlzTGluZVRlcm1pbmF0b3IoKSkge1xuICAgICAgICB0aGlzLmZpbmlzaE5vZGUobm9kZSwgYm9kaWxlc3NUeXBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGJvZGlsZXNzVHlwZSA9PT0gXCJUU0RlY2xhcmVGdW5jdGlvblwiICYmIHRoaXMuc3RhdGUuaXNBbWJpZW50Q29udGV4dCkge1xuICAgICAgICB0aGlzLnJhaXNlKG5vZGUuc3RhcnQsIFRTRXJyb3JzLkRlY2xhcmVGdW5jdGlvbkhhc0ltcGxlbWVudGF0aW9uKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgICAgbm9kZS5kZWNsYXJlXG4gICAgICAgICkge1xuICAgICAgICAgIHN1cGVyLnBhcnNlRnVuY3Rpb25Cb2R5QW5kRmluaXNoKG5vZGUsIGJvZGlsZXNzVHlwZSwgaXNNZXRob2QpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdXBlci5wYXJzZUZ1bmN0aW9uQm9keUFuZEZpbmlzaChub2RlLCB0eXBlLCBpc01ldGhvZCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJGdW5jdGlvblN0YXRlbWVudElkKG5vZGU6IE4uRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgIGlmICghbm9kZS5ib2R5ICYmIG5vZGUuaWQpIHtcbiAgICAgICAgLy8gRnVuY3Rpb24gaWRzIGFyZSB2YWxpZGF0ZWQgYWZ0ZXIgcGFyc2luZyB0aGVpciBib2R5LlxuICAgICAgICAvLyBGb3IgYm9keWxlc3MgZnVuY3Rpb24sIHdlIG5lZWQgdG8gZG8gaXQgaGVyZS5cbiAgICAgICAgdGhpcy5jaGVja0xWYWwobm9kZS5pZCwgXCJmdW5jdGlvbiBuYW1lXCIsIEJJTkRfVFNfQU1CSUVOVCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdXBlci5yZWdpc3RlckZ1bmN0aW9uU3RhdGVtZW50SWQoLi4uYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0c0NoZWNrRm9ySW52YWxpZFR5cGVDYXN0cyhpdGVtczogJFJlYWRPbmx5QXJyYXk8P04uRXhwcmVzc2lvbj4pIHtcbiAgICAgIGl0ZW1zLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlPy50eXBlID09PSBcIlRTVHlwZUNhc3RFeHByZXNzaW9uXCIpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbi5zdGFydCxcbiAgICAgICAgICAgIFRTRXJyb3JzLlVuZXhwZWN0ZWRUeXBlQW5ub3RhdGlvbixcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0b1JlZmVyZW5jZWRMaXN0KFxuICAgICAgZXhwckxpc3Q6ICRSZWFkT25seUFycmF5PD9OLkV4cHJlc3Npb24+LFxuICAgICAgaXNJblBhcmVucz86IGJvb2xlYW4sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICApOiAkUmVhZE9ubHlBcnJheTw/Ti5FeHByZXNzaW9uPiB7XG4gICAgICAvLyBIYW5kbGVzIGludmFsaWQgc2NlbmFyaW9zIGxpa2U6IGBmKGE6YilgLCBgKGE6Yik7YCwgYW5kIGAoYTpiLGM6ZClgLlxuICAgICAgLy9cbiAgICAgIC8vIE5vdGUgdGhhdCBgZjxUPihhOmIpYCBnb2VzIHRocm91Z2ggYSBkaWZmZXJlbnQgcGF0aCBhbmQgaXMgaGFuZGxlZFxuICAgICAgLy8gaW4gYHBhcnNlU3Vic2NyaXB0YCBkaXJlY3RseS5cbiAgICAgIHRoaXMudHNDaGVja0ZvckludmFsaWRUeXBlQ2FzdHMoZXhwckxpc3QpO1xuICAgICAgcmV0dXJuIGV4cHJMaXN0O1xuICAgIH1cblxuICAgIHBhcnNlQXJyYXlMaWtlKC4uLmFyZ3MpOiBOLkFycmF5RXhwcmVzc2lvbiB8IE4uVHVwbGVFeHByZXNzaW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBzdXBlci5wYXJzZUFycmF5TGlrZSguLi5hcmdzKTtcblxuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJBcnJheUV4cHJlc3Npb25cIikge1xuICAgICAgICB0aGlzLnRzQ2hlY2tGb3JJbnZhbGlkVHlwZUNhc3RzKG5vZGUuZWxlbWVudHMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBwYXJzZVN1YnNjcmlwdChcbiAgICAgIGJhc2U6IE4uRXhwcmVzc2lvbixcbiAgICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgICBzdGFydExvYzogUG9zaXRpb24sXG4gICAgICBub0NhbGxzOiA/Ym9vbGVhbixcbiAgICAgIHN0YXRlOiBOLlBhcnNlU3Vic2NyaXB0U3RhdGUsXG4gICAgKTogTi5FeHByZXNzaW9uIHtcbiAgICAgIGlmICghdGhpcy5oYXNQcmVjZWRpbmdMaW5lQnJlYWsoKSAmJiB0aGlzLm1hdGNoKHR0LmJhbmcpKSB7XG4gICAgICAgIC8vIFdoZW4gISBpcyBjb25zdW1lZCBhcyBhIHBvc3RmaXggb3BlcmF0b3IgKG5vbi1udWxsIGFzc2VydGlvbiksXG4gICAgICAgIC8vIGRpc2FsbG93IEpTWCB0YWcgZm9ybWluZyBhZnRlci4gZS5nLiBXaGVuIHBhcnNpbmcgYHAhIDwgbi5wIWBcbiAgICAgICAgLy8gYDxuLnBgIGNhbiBub3QgYmUgYSBzdGFydCBvZiBKU1ggdGFnXG4gICAgICAgIHRoaXMuc3RhdGUuZXhwckFsbG93ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG5cbiAgICAgICAgY29uc3Qgbm9uTnVsbEV4cHJlc3Npb246IE4uVHNOb25OdWxsRXhwcmVzc2lvbiA9IHRoaXMuc3RhcnROb2RlQXQoXG4gICAgICAgICAgc3RhcnRQb3MsXG4gICAgICAgICAgc3RhcnRMb2MsXG4gICAgICAgICk7XG4gICAgICAgIG5vbk51bGxFeHByZXNzaW9uLmV4cHJlc3Npb24gPSBiYXNlO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vbk51bGxFeHByZXNzaW9uLCBcIlRTTm9uTnVsbEV4cHJlc3Npb25cIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgLy8gdHNUcnlQYXJzZUFuZENhdGNoIGlzIGV4cGVuc2l2ZSwgc28gYXZvaWQgaWYgbm90IG5lY2Vzc2FyeS5cbiAgICAgICAgLy8gVGhlcmUgYXJlIG51bWJlciBvZiB0aGluZ3Mgd2UgYXJlIGdvaW5nIHRvIFwibWF5YmVcIiBwYXJzZSwgbGlrZSB0eXBlIGFyZ3VtZW50cyBvblxuICAgICAgICAvLyB0YWdnZWQgdGVtcGxhdGUgZXhwcmVzc2lvbnMuIElmIGFueSBvZiB0aGVtIGZhaWwsIHdhbGsgaXQgYmFjayBhbmQgY29udGludWUuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudHNUcnlQYXJzZUFuZENhdGNoKCgpID0+IHtcbiAgICAgICAgICBpZiAoIW5vQ2FsbHMgJiYgdGhpcy5hdFBvc3NpYmxlQXN5bmNBcnJvdyhiYXNlKSkge1xuICAgICAgICAgICAgLy8gQWxtb3N0IGNlcnRhaW5seSB0aGlzIGlzIGEgZ2VuZXJpYyBhc3luYyBmdW5jdGlvbiBgYXN5bmMgPFQ+KCkgPT4gLi4uXG4gICAgICAgICAgICAvLyBCdXQgaXQgbWlnaHQgYmUgYSBjYWxsIHdpdGggYSB0eXBlIGFyZ3VtZW50IGBhc3luYzxUPigpO2BcbiAgICAgICAgICAgIGNvbnN0IGFzeW5jQXJyb3dGbiA9IHRoaXMudHNUcnlQYXJzZUdlbmVyaWNBc3luY0Fycm93RnVuY3Rpb24oXG4gICAgICAgICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICAgICAgICBzdGFydExvYyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoYXN5bmNBcnJvd0ZuKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhc3luY0Fycm93Rm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3Qgbm9kZTogTi5DYWxsRXhwcmVzc2lvbiA9IHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICAgICAgICBub2RlLmNhbGxlZSA9IGJhc2U7XG5cbiAgICAgICAgICBjb25zdCB0eXBlQXJndW1lbnRzID0gdGhpcy50c1BhcnNlVHlwZUFyZ3VtZW50cygpO1xuXG4gICAgICAgICAgaWYgKHR5cGVBcmd1bWVudHMpIHtcbiAgICAgICAgICAgIGlmICghbm9DYWxscyAmJiB0aGlzLmVhdCh0dC5wYXJlbkwpKSB7XG4gICAgICAgICAgICAgIC8vIHBvc3NpYmxlQXN5bmMgYWx3YXlzIGZhbHNlIGhlcmUsIGJlY2F1c2Ugd2Ugd291bGQgaGF2ZSBoYW5kbGVkIGl0IGFib3ZlLlxuICAgICAgICAgICAgICAvLyAkRmxvd0lnbm9yZSAod29uJ3QgYmUgYW55IHVuZGVmaW5lZCBhcmd1bWVudHMpXG4gICAgICAgICAgICAgIG5vZGUuYXJndW1lbnRzID0gdGhpcy5wYXJzZUNhbGxFeHByZXNzaW9uQXJndW1lbnRzKFxuICAgICAgICAgICAgICAgIHR0LnBhcmVuUixcbiAgICAgICAgICAgICAgICAvKiBwb3NzaWJsZUFzeW5jICovIGZhbHNlLFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIC8vIEhhbmRsZXMgaW52YWxpZCBjYXNlOiBgZjxUPihhOmIpYFxuICAgICAgICAgICAgICB0aGlzLnRzQ2hlY2tGb3JJbnZhbGlkVHlwZUNhc3RzKG5vZGUuYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdHlwZUFyZ3VtZW50cztcbiAgICAgICAgICAgICAgaWYgKHN0YXRlLm9wdGlvbmFsQ2hhaW5NZW1iZXIpIHtcbiAgICAgICAgICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICAgICAgICAgIG5vZGUub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hDYWxsRXhwcmVzc2lvbihub2RlLCBzdGF0ZS5vcHRpb25hbENoYWluTWVtYmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5iYWNrUXVvdGUpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucGFyc2VUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24oXG4gICAgICAgICAgICAgICAgYmFzZSxcbiAgICAgICAgICAgICAgICBzdGFydFBvcyxcbiAgICAgICAgICAgICAgICBzdGFydExvYyxcbiAgICAgICAgICAgICAgICBzdGF0ZSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgcmVzdWx0LnR5cGVQYXJhbWV0ZXJzID0gdHlwZUFyZ3VtZW50cztcbiAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlU3Vic2NyaXB0KGJhc2UsIHN0YXJ0UG9zLCBzdGFydExvYywgbm9DYWxscywgc3RhdGUpO1xuICAgIH1cblxuICAgIHBhcnNlTmV3QXJndW1lbnRzKG5vZGU6IE4uTmV3RXhwcmVzc2lvbik6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICAvLyB0c1RyeVBhcnNlQW5kQ2F0Y2ggaXMgZXhwZW5zaXZlLCBzbyBhdm9pZCBpZiBub3QgbmVjZXNzYXJ5LlxuICAgICAgICAvLyA5OSUgY2VydGFpbiB0aGlzIGlzIGBuZXcgQzxUPigpO2AuIEJ1dCBtYXkgYmUgYG5ldyBDIDwgVDtgLCB3aGljaCBpcyBhbHNvIGxlZ2FsLlxuICAgICAgICBjb25zdCB0eXBlUGFyYW1ldGVycyA9IHRoaXMudHNUcnlQYXJzZUFuZENhdGNoKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBhcmdzID0gdGhpcy50c1BhcnNlVHlwZUFyZ3VtZW50cygpO1xuICAgICAgICAgIGlmICghdGhpcy5tYXRjaCh0dC5wYXJlbkwpKSB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgICAgICByZXR1cm4gYXJncztcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0eXBlUGFyYW1ldGVycykge1xuICAgICAgICAgIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0eXBlUGFyYW1ldGVycztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzdXBlci5wYXJzZU5ld0FyZ3VtZW50cyhub2RlKTtcbiAgICB9XG5cbiAgICBwYXJzZUV4cHJPcChcbiAgICAgIGxlZnQ6IE4uRXhwcmVzc2lvbixcbiAgICAgIGxlZnRTdGFydFBvczogbnVtYmVyLFxuICAgICAgbGVmdFN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICAgIG1pblByZWM6IG51bWJlcixcbiAgICApIHtcbiAgICAgIGlmIChcbiAgICAgICAgbm9uTnVsbCh0dC5faW4uYmlub3ApID4gbWluUHJlYyAmJlxuICAgICAgICAhdGhpcy5oYXNQcmVjZWRpbmdMaW5lQnJlYWsoKSAmJlxuICAgICAgICB0aGlzLmlzQ29udGV4dHVhbChcImFzXCIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qgbm9kZTogTi5Uc0FzRXhwcmVzc2lvbiA9IHRoaXMuc3RhcnROb2RlQXQoXG4gICAgICAgICAgbGVmdFN0YXJ0UG9zLFxuICAgICAgICAgIGxlZnRTdGFydExvYyxcbiAgICAgICAgKTtcbiAgICAgICAgbm9kZS5leHByZXNzaW9uID0gbGVmdDtcbiAgICAgICAgY29uc3QgX2NvbnN0ID0gdGhpcy50c1RyeU5leHRQYXJzZUNvbnN0YW50Q29udGV4dCgpO1xuICAgICAgICBpZiAoX2NvbnN0KSB7XG4gICAgICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiA9IF9jb25zdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlLnR5cGVBbm5vdGF0aW9uID0gdGhpcy50c05leHRUaGVuUGFyc2VUeXBlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVFNBc0V4cHJlc3Npb25cIik7XG4gICAgICAgIC8vIHJlc2NhbiBgPGAsIGA+YCBiZWNhdXNlIHRoZXkgd2VyZSBzY2FubmVkIHdoZW4gdGhpcy5zdGF0ZS5pblR5cGUgd2FzIHRydWVcbiAgICAgICAgdGhpcy5yZVNjYW5fbHRfZ3QoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFeHByT3Aobm9kZSwgbGVmdFN0YXJ0UG9zLCBsZWZ0U3RhcnRMb2MsIG1pblByZWMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VFeHByT3AobGVmdCwgbGVmdFN0YXJ0UG9zLCBsZWZ0U3RhcnRMb2MsIG1pblByZWMpO1xuICAgIH1cblxuICAgIGNoZWNrUmVzZXJ2ZWRXb3JkKFxuICAgICAgd29yZDogc3RyaW5nLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBzdGFydExvYzogbnVtYmVyLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBjaGVja0tleXdvcmRzOiBib29sZWFuLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGlzQmluZGluZzogYm9vbGVhbixcbiAgICApOiB2b2lkIHtcbiAgICAgIC8vIERvbid0IGJvdGhlciBjaGVja2luZyBmb3IgVHlwZVNjcmlwdCBjb2RlLlxuICAgICAgLy8gU3RyaWN0IG1vZGUgd29yZHMgbWF5IGJlIGFsbG93ZWQgYXMgaW4gYGRlY2xhcmUgbmFtZXNwYWNlIE4geyBjb25zdCBzdGF0aWM6IG51bWJlcjsgfWAuXG4gICAgICAvLyBBbmQgd2UgaGF2ZSBhIHR5cGUgY2hlY2tlciBhbnl3YXksIHNvIGRvbid0IGJvdGhlciBoYXZpbmcgdGhlIHBhcnNlciBkbyBpdC5cbiAgICB9XG5cbiAgICAvKlxuICAgIERvbid0IGJvdGhlciBkb2luZyB0aGlzIGNoZWNrIGluIFR5cGVTY3JpcHQgY29kZSBiZWNhdXNlOlxuICAgIDEuIFdlIG1heSBoYXZlIGEgbmVzdGVkIGV4cG9ydCBzdGF0ZW1lbnQgd2l0aCB0aGUgc2FtZSBuYW1lOlxuICAgICAgZXhwb3J0IGNvbnN0IHggPSAwO1xuICAgICAgZXhwb3J0IG5hbWVzcGFjZSBOIHtcbiAgICAgICAgZXhwb3J0IGNvbnN0IHggPSAxO1xuICAgICAgfVxuICAgIDIuIFdlIGhhdmUgYSB0eXBlIGNoZWNrZXIgdG8gd2FybiB1cyBhYm91dCB0aGlzIHNvcnQgb2YgdGhpbmcuXG4gICAgKi9cbiAgICBjaGVja0R1cGxpY2F0ZUV4cG9ydHMoKSB7fVxuXG4gICAgcGFyc2VJbXBvcnQobm9kZTogTi5Ob2RlKTogTi5BbnlJbXBvcnQge1xuICAgICAgbm9kZS5pbXBvcnRLaW5kID0gXCJ2YWx1ZVwiO1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQubmFtZSkgfHwgdGhpcy5tYXRjaCh0dC5zdGFyKSB8fCB0aGlzLm1hdGNoKHR0LmJyYWNlTCkpIHtcbiAgICAgICAgbGV0IGFoZWFkID0gdGhpcy5sb29rYWhlYWQoKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5pc0NvbnRleHR1YWwoXCJ0eXBlXCIpICYmXG4gICAgICAgICAgLy8gaW1wb3J0IHR5cGUsIHsgYSB9IGZyb20gXCJiXCI7XG4gICAgICAgICAgYWhlYWQudHlwZSAhPT0gdHQuY29tbWEgJiZcbiAgICAgICAgICAvLyBpbXBvcnQgdHlwZSBmcm9tIFwiYVwiO1xuICAgICAgICAgICEoYWhlYWQudHlwZSA9PT0gdHQubmFtZSAmJiBhaGVhZC52YWx1ZSA9PT0gXCJmcm9tXCIpICYmXG4gICAgICAgICAgLy8gaW1wb3J0IHR5cGUgPSByZXF1aXJlKFwiYVwiKTtcbiAgICAgICAgICBhaGVhZC50eXBlICE9PSB0dC5lcVxuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLmltcG9ydEtpbmQgPSBcInR5cGVcIjtcbiAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICBhaGVhZCA9IHRoaXMubG9va2FoZWFkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5uYW1lKSAmJiBhaGVhZC50eXBlID09PSB0dC5lcSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbihub2RlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpbXBvcnROb2RlID0gc3VwZXIucGFyc2VJbXBvcnQobm9kZSk7XG4gICAgICAvKjo6IGludmFyaWFudChpbXBvcnROb2RlLnR5cGUgIT09IFwiVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvblwiKSAqL1xuXG4gICAgICAvLyBgaW1wb3J0IHR5cGVgIGNhbiBvbmx5IGJlIHVzZWQgb24gaW1wb3J0cyB3aXRoIG5hbWVkIGltcG9ydHMgb3Igd2l0aCBhXG4gICAgICAvLyBkZWZhdWx0IGltcG9ydCAtIGJ1dCBub3QgYm90aFxuICAgICAgaWYgKFxuICAgICAgICBpbXBvcnROb2RlLmltcG9ydEtpbmQgPT09IFwidHlwZVwiICYmXG4gICAgICAgIGltcG9ydE5vZGUuc3BlY2lmaWVycy5sZW5ndGggPiAxICYmXG4gICAgICAgIGltcG9ydE5vZGUuc3BlY2lmaWVyc1swXS50eXBlID09PSBcIkltcG9ydERlZmF1bHRTcGVjaWZpZXJcIlxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgaW1wb3J0Tm9kZS5zdGFydCxcbiAgICAgICAgICBUU0Vycm9ycy5UeXBlSW1wb3J0Q2Fubm90U3BlY2lmeURlZmF1bHRBbmROYW1lZCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGltcG9ydE5vZGU7XG4gICAgfVxuXG4gICAgcGFyc2VFeHBvcnQobm9kZTogTi5Ob2RlKTogTi5BbnlFeHBvcnQge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuX2ltcG9ydCkpIHtcbiAgICAgICAgLy8gYGV4cG9ydCBpbXBvcnQgQSA9IEI7YFxuICAgICAgICB0aGlzLm5leHQoKTsgLy8gZWF0IGB0dC5faW1wb3J0YFxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5pc0NvbnRleHR1YWwoXCJ0eXBlXCIpICYmXG4gICAgICAgICAgdGhpcy5sb29rYWhlYWRDaGFyQ29kZSgpICE9PSBjaGFyQ29kZXMuZXF1YWxzVG9cbiAgICAgICAgKSB7XG4gICAgICAgICAgbm9kZS5pbXBvcnRLaW5kID0gXCJ0eXBlXCI7XG4gICAgICAgICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBcInR5cGVcIlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUuaW1wb3J0S2luZCA9IFwidmFsdWVcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy50c1BhcnNlSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24obm9kZSwgLyogaXNFeHBvcnQgKi8gdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWF0KHR0LmVxKSkge1xuICAgICAgICAvLyBgZXhwb3J0ID0geDtgXG4gICAgICAgIGNvbnN0IGFzc2lnbjogTi5Uc0V4cG9ydEFzc2lnbm1lbnQgPSBub2RlO1xuICAgICAgICBhc3NpZ24uZXhwcmVzc2lvbiA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuc2VtaWNvbG9uKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUoYXNzaWduLCBcIlRTRXhwb3J0QXNzaWdubWVudFwiKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5lYXRDb250ZXh0dWFsKFwiYXNcIikpIHtcbiAgICAgICAgLy8gYGV4cG9ydCBhcyBuYW1lc3BhY2UgQTtgXG4gICAgICAgIGNvbnN0IGRlY2w6IE4uVHNOYW1lc3BhY2VFeHBvcnREZWNsYXJhdGlvbiA9IG5vZGU7XG4gICAgICAgIC8vIFNlZSBgcGFyc2VOYW1lc3BhY2VFeHBvcnREZWNsYXJhdGlvbmAgaW4gVHlwZVNjcmlwdCdzIG93biBwYXJzZXJcbiAgICAgICAgdGhpcy5leHBlY3RDb250ZXh0dWFsKFwibmFtZXNwYWNlXCIpO1xuICAgICAgICBkZWNsLmlkID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShkZWNsLCBcIlRTTmFtZXNwYWNlRXhwb3J0RGVjbGFyYXRpb25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5pc0NvbnRleHR1YWwoXCJ0eXBlXCIpICYmIHRoaXMubG9va2FoZWFkKCkudHlwZSA9PT0gdHQuYnJhY2VMKSB7XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgbm9kZS5leHBvcnRLaW5kID0gXCJ0eXBlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZS5leHBvcnRLaW5kID0gXCJ2YWx1ZVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlRXhwb3J0KG5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlzQWJzdHJhY3RDbGFzcygpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuaXNDb250ZXh0dWFsKFwiYWJzdHJhY3RcIikgJiYgdGhpcy5sb29rYWhlYWQoKS50eXBlID09PSB0dC5fY2xhc3NcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcGFyc2VFeHBvcnREZWZhdWx0RXhwcmVzc2lvbigpOiBOLkV4cHJlc3Npb24gfCBOLkRlY2xhcmF0aW9uIHtcbiAgICAgIGlmICh0aGlzLmlzQWJzdHJhY3RDbGFzcygpKSB7XG4gICAgICAgIGNvbnN0IGNscyA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgIHRoaXMubmV4dCgpOyAvLyBTa2lwIFwiYWJzdHJhY3RcIlxuICAgICAgICBjbHMuYWJzdHJhY3QgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhcnNlQ2xhc3MoY2xzLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGNscztcbiAgICAgIH1cblxuICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIGFsbG93ZWQgaW46XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvcHVsbC8xNjA0MFxuICAgICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09IFwiaW50ZXJmYWNlXCIpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy50c1BhcnNlRGVjbGFyYXRpb24oXG4gICAgICAgICAgdGhpcy5zdGFydE5vZGUoKSxcbiAgICAgICAgICB0aGlzLnN0YXRlLnZhbHVlLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlRXhwb3J0RGVmYXVsdEV4cHJlc3Npb24oKTtcbiAgICB9XG5cbiAgICBwYXJzZVN0YXRlbWVudENvbnRlbnQoY29udGV4dDogP3N0cmluZywgdG9wTGV2ZWw6ID9ib29sZWFuKTogTi5TdGF0ZW1lbnQge1xuICAgICAgaWYgKHRoaXMuc3RhdGUudHlwZSA9PT0gdHQuX2NvbnN0KSB7XG4gICAgICAgIGNvbnN0IGFoZWFkID0gdGhpcy5sb29rYWhlYWQoKTtcbiAgICAgICAgaWYgKGFoZWFkLnR5cGUgPT09IHR0Lm5hbWUgJiYgYWhlYWQudmFsdWUgPT09IFwiZW51bVwiKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZTogTi5Uc0VudW1EZWNsYXJhdGlvbiA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgICAgdGhpcy5leHBlY3QodHQuX2NvbnN0KTtcbiAgICAgICAgICB0aGlzLmV4cGVjdENvbnRleHR1YWwoXCJlbnVtXCIpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VFbnVtRGVjbGFyYXRpb24obm9kZSwgLyogaXNDb25zdCAqLyB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlU3RhdGVtZW50Q29udGVudChjb250ZXh0LCB0b3BMZXZlbCk7XG4gICAgfVxuXG4gICAgcGFyc2VBY2Nlc3NNb2RpZmllcigpOiA/Ti5BY2Nlc3NpYmlsaXR5IHtcbiAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VNb2RpZmllcihbXCJwdWJsaWNcIiwgXCJwcm90ZWN0ZWRcIiwgXCJwcml2YXRlXCJdKTtcbiAgICB9XG5cbiAgICB0c0hhc1NvbWVNb2RpZmllcnMobWVtYmVyOiBhbnksIG1vZGlmaWVyczogVHNNb2RpZmllcltdKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gbW9kaWZpZXJzLnNvbWUobW9kaWZpZXIgPT4ge1xuICAgICAgICBpZiAodHNJc0FjY2Vzc01vZGlmaWVyKG1vZGlmaWVyKSkge1xuICAgICAgICAgIHJldHVybiBtZW1iZXIuYWNjZXNzaWJpbGl0eSA9PT0gbW9kaWZpZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICEhbWVtYmVyW21vZGlmaWVyXTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcnNlQ2xhc3NNZW1iZXIoXG4gICAgICBjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5LFxuICAgICAgbWVtYmVyOiBhbnksXG4gICAgICBzdGF0ZTogTi5QYXJzZUNsYXNzTWVtYmVyU3RhdGUsXG4gICAgKTogdm9pZCB7XG4gICAgICBjb25zdCBpbnZhbGlkTW9kaWZlcnNGb3JTdGF0aWNCbG9ja3MgPSBbXG4gICAgICAgIFwiZGVjbGFyZVwiLFxuICAgICAgICBcInByaXZhdGVcIixcbiAgICAgICAgXCJwdWJsaWNcIixcbiAgICAgICAgXCJwcm90ZWN0ZWRcIixcbiAgICAgICAgXCJvdmVycmlkZVwiLFxuICAgICAgICBcImFic3RyYWN0XCIsXG4gICAgICAgIFwicmVhZG9ubHlcIixcbiAgICAgIF07XG4gICAgICB0aGlzLnRzUGFyc2VNb2RpZmllcnMoXG4gICAgICAgIG1lbWJlcixcbiAgICAgICAgaW52YWxpZE1vZGlmZXJzRm9yU3RhdGljQmxvY2tzLmNvbmNhdChbXCJzdGF0aWNcIl0pLFxuICAgICAgKTtcblxuICAgICAgY29uc3QgY2FsbFBhcnNlQ2xhc3NNZW1iZXJXaXRoSXNTdGF0aWMgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzU3RhdGljID0gISFtZW1iZXIuc3RhdGljO1xuICAgICAgICBpZiAoaXNTdGF0aWMgJiYgdGhpcy5lYXQodHQuYnJhY2VMKSkge1xuICAgICAgICAgIGlmICh0aGlzLnRzSGFzU29tZU1vZGlmaWVycyhtZW1iZXIsIGludmFsaWRNb2RpZmVyc0ZvclN0YXRpY0Jsb2NrcykpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5wb3MsIFRTRXJyb3JzLlN0YXRpY0Jsb2NrQ2Fubm90SGF2ZU1vZGlmaWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5wYXJzZUNsYXNzU3RhdGljQmxvY2soY2xhc3NCb2R5LCAoKG1lbWJlcjogYW55KTogTi5TdGF0aWNCbG9jaykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucGFyc2VDbGFzc01lbWJlcldpdGhJc1N0YXRpYyhjbGFzc0JvZHksIG1lbWJlciwgc3RhdGUsIGlzU3RhdGljKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChtZW1iZXIuZGVjbGFyZSkge1xuICAgICAgICB0aGlzLnRzSW5BbWJpZW50Q29udGV4dChjYWxsUGFyc2VDbGFzc01lbWJlcldpdGhJc1N0YXRpYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsUGFyc2VDbGFzc01lbWJlcldpdGhJc1N0YXRpYygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlQ2xhc3NNZW1iZXJXaXRoSXNTdGF0aWMoXG4gICAgICBjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5LFxuICAgICAgbWVtYmVyOiBOLkNsYXNzTWVtYmVyIHwgTi5Uc0luZGV4U2lnbmF0dXJlLFxuICAgICAgc3RhdGU6IE4uUGFyc2VDbGFzc01lbWJlclN0YXRlLFxuICAgICAgaXNTdGF0aWM6IGJvb2xlYW4sXG4gICAgKTogdm9pZCB7XG4gICAgICBjb25zdCBpZHggPSB0aGlzLnRzVHJ5UGFyc2VJbmRleFNpZ25hdHVyZShtZW1iZXIpO1xuICAgICAgaWYgKGlkeCkge1xuICAgICAgICBjbGFzc0JvZHkuYm9keS5wdXNoKGlkeCk7XG5cbiAgICAgICAgaWYgKChtZW1iZXI6IGFueSkuYWJzdHJhY3QpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKG1lbWJlci5zdGFydCwgVFNFcnJvcnMuSW5kZXhTaWduYXR1cmVIYXNBYnN0cmFjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChtZW1iZXI6IGFueSkuYWNjZXNzaWJpbGl0eSkge1xuICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICBtZW1iZXIuc3RhcnQsXG4gICAgICAgICAgICBUU0Vycm9ycy5JbmRleFNpZ25hdHVyZUhhc0FjY2Vzc2liaWxpdHksXG4gICAgICAgICAgICAobWVtYmVyOiBhbnkpLmFjY2Vzc2liaWxpdHksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKG1lbWJlcjogYW55KS5kZWNsYXJlKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShtZW1iZXIuc3RhcnQsIFRTRXJyb3JzLkluZGV4U2lnbmF0dXJlSGFzRGVjbGFyZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChtZW1iZXI6IGFueSkub3ZlcnJpZGUpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKG1lbWJlci5zdGFydCwgVFNFcnJvcnMuSW5kZXhTaWduYXR1cmVIYXNPdmVycmlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5pbkFic3RyYWN0Q2xhc3MgJiYgKG1lbWJlcjogYW55KS5hYnN0cmFjdCkge1xuICAgICAgICB0aGlzLnJhaXNlKG1lbWJlci5zdGFydCwgVFNFcnJvcnMuTm9uQWJzdHJhY3RDbGFzc0hhc0Fic3RyYWN0TWV0aG9kKTtcbiAgICAgIH1cblxuICAgICAgaWYgKChtZW1iZXI6IGFueSkub3ZlcnJpZGUpIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5oYWRTdXBlckNsYXNzKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShtZW1iZXIuc3RhcnQsIFRTRXJyb3JzLk92ZXJyaWRlTm90SW5TdWJDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyo6OiBpbnZhcmlhbnQobWVtYmVyLnR5cGUgIT09IFwiVFNJbmRleFNpZ25hdHVyZVwiKSAqL1xuXG4gICAgICBzdXBlci5wYXJzZUNsYXNzTWVtYmVyV2l0aElzU3RhdGljKGNsYXNzQm9keSwgbWVtYmVyLCBzdGF0ZSwgaXNTdGF0aWMpO1xuICAgIH1cblxuICAgIHBhcnNlUG9zdE1lbWJlck5hbWVNb2RpZmllcnMoXG4gICAgICBtZXRob2RPclByb3A6IE4uQ2xhc3NNZXRob2QgfCBOLkNsYXNzUHJvcGVydHkgfCBOLkNsYXNzUHJpdmF0ZVByb3BlcnR5LFxuICAgICk6IHZvaWQge1xuICAgICAgY29uc3Qgb3B0aW9uYWwgPSB0aGlzLmVhdCh0dC5xdWVzdGlvbik7XG4gICAgICBpZiAob3B0aW9uYWwpIG1ldGhvZE9yUHJvcC5vcHRpb25hbCA9IHRydWU7XG5cbiAgICAgIGlmICgobWV0aG9kT3JQcm9wOiBhbnkpLnJlYWRvbmx5ICYmIHRoaXMubWF0Y2godHQucGFyZW5MKSkge1xuICAgICAgICB0aGlzLnJhaXNlKG1ldGhvZE9yUHJvcC5zdGFydCwgVFNFcnJvcnMuQ2xhc3NNZXRob2RIYXNSZWFkb25seSk7XG4gICAgICB9XG5cbiAgICAgIGlmICgobWV0aG9kT3JQcm9wOiBhbnkpLmRlY2xhcmUgJiYgdGhpcy5tYXRjaCh0dC5wYXJlbkwpKSB7XG4gICAgICAgIHRoaXMucmFpc2UobWV0aG9kT3JQcm9wLnN0YXJ0LCBUU0Vycm9ycy5DbGFzc01ldGhvZEhhc0RlY2xhcmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdGU6IFRoZSByZWFzb24gd2UgZG8gdGhpcyBpbiBgcGFyc2VFeHByZXNzaW9uU3RhdGVtZW50YCBhbmQgbm90IGBwYXJzZVN0YXRlbWVudGBcbiAgICAvLyBpcyB0aGF0IGUuZy4gYHR5cGUoKWAgaXMgdmFsaWQgSlMsIHNvIHdlIG11c3QgdHJ5IHBhcnNpbmcgdGhhdCBmaXJzdC5cbiAgICAvLyBJZiBpdCdzIHJlYWxseSBhIHR5cGUsIHdlIHdpbGwgcGFyc2UgYHR5cGVgIGFzIHRoZSBzdGF0ZW1lbnQsIGFuZCBjYW4gY29ycmVjdCBpdCBoZXJlXG4gICAgLy8gYnkgcGFyc2luZyB0aGUgcmVzdC5cbiAgICBwYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoXG4gICAgICBub2RlOiBOLkV4cHJlc3Npb25TdGF0ZW1lbnQsXG4gICAgICBleHByOiBOLkV4cHJlc3Npb24sXG4gICAgKTogTi5TdGF0ZW1lbnQge1xuICAgICAgY29uc3QgZGVjbCA9XG4gICAgICAgIGV4cHIudHlwZSA9PT0gXCJJZGVudGlmaWVyXCJcbiAgICAgICAgICA/IHRoaXMudHNQYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQobm9kZSwgZXhwcilcbiAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBkZWNsIHx8IHN1cGVyLnBhcnNlRXhwcmVzc2lvblN0YXRlbWVudChub2RlLCBleHByKTtcbiAgICB9XG5cbiAgICAvLyBleHBvcnQgdHlwZVxuICAgIC8vIFNob3VsZCBiZSB0cnVlIGZvciBhbnl0aGluZyBwYXJzZWQgYnkgYHRzVHJ5UGFyc2VFeHBvcnREZWNsYXJhdGlvbmAuXG4gICAgc2hvdWxkUGFyc2VFeHBvcnREZWNsYXJhdGlvbigpOiBib29sZWFuIHtcbiAgICAgIGlmICh0aGlzLnRzSXNEZWNsYXJhdGlvblN0YXJ0KCkpIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIHN1cGVyLnNob3VsZFBhcnNlRXhwb3J0RGVjbGFyYXRpb24oKTtcbiAgICB9XG5cbiAgICAvLyBBbiBhcHBhcmVudCBjb25kaXRpb25hbCBleHByZXNzaW9uIGNvdWxkIGFjdHVhbGx5IGJlIGFuIG9wdGlvbmFsIHBhcmFtZXRlciBpbiBhbiBhcnJvdyBmdW5jdGlvbi5cbiAgICBwYXJzZUNvbmRpdGlvbmFsKFxuICAgICAgZXhwcjogTi5FeHByZXNzaW9uLFxuICAgICAgc3RhcnRQb3M6IG51bWJlcixcbiAgICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnM/OiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgICApOiBOLkV4cHJlc3Npb24ge1xuICAgICAgLy8gb25seSBkbyB0aGUgZXhwZW5zaXZlIGNsb25lIGlmIHRoZXJlIGlzIGEgcXVlc3Rpb24gbWFya1xuICAgICAgLy8gYW5kIGlmIHdlIGNvbWUgZnJvbSBpbnNpZGUgcGFyZW5zXG4gICAgICBpZiAoIXRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyB8fCAhdGhpcy5tYXRjaCh0dC5xdWVzdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlQ29uZGl0aW9uYWwoXG4gICAgICAgICAgZXhwcixcbiAgICAgICAgICBzdGFydFBvcyxcbiAgICAgICAgICBzdGFydExvYyxcbiAgICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRyeVBhcnNlKCgpID0+XG4gICAgICAgIHN1cGVyLnBhcnNlQ29uZGl0aW9uYWwoZXhwciwgc3RhcnRQb3MsIHN0YXJ0TG9jKSxcbiAgICAgICk7XG5cbiAgICAgIGlmICghcmVzdWx0Lm5vZGUpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICAgIC8qOjogaW52YXJpYW50KHJlZkV4cHJlc3Npb25FcnJvcnMgIT0gbnVsbCkgKi9cbiAgICAgICAgICBzdXBlci5zZXRPcHRpb25hbFBhcmFtZXRlcnNFcnJvcihyZWZFeHByZXNzaW9uRXJyb3JzLCByZXN1bHQuZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB0aGlzLnN0YXRlID0gcmVzdWx0LmZhaWxTdGF0ZTtcbiAgICAgIHJldHVybiByZXN1bHQubm9kZTtcbiAgICB9XG5cbiAgICAvLyBOb3RlOiBUaGVzZSBcInR5cGUgY2FzdHNcIiBhcmUgKm5vdCogdmFsaWQgVFMgZXhwcmVzc2lvbnMuXG4gICAgLy8gQnV0IHdlIHBhcnNlIHRoZW0gaGVyZSBhbmQgY2hhbmdlIHRoZW0gd2hlbiBjb21wbGV0aW5nIHRoZSBhcnJvdyBmdW5jdGlvbi5cbiAgICBwYXJzZVBhcmVuSXRlbShcbiAgICAgIG5vZGU6IE4uRXhwcmVzc2lvbixcbiAgICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgICBzdGFydExvYzogUG9zaXRpb24sXG4gICAgKTogTi5FeHByZXNzaW9uIHtcbiAgICAgIG5vZGUgPSBzdXBlci5wYXJzZVBhcmVuSXRlbShub2RlLCBzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgaWYgKHRoaXMuZWF0KHR0LnF1ZXN0aW9uKSkge1xuICAgICAgICBub2RlLm9wdGlvbmFsID0gdHJ1ZTtcbiAgICAgICAgLy8gSW5jbHVkZSBxdWVzdGlvbm1hcmsgaW4gbG9jYXRpb24gb2Ygbm9kZVxuICAgICAgICAvLyBEb24ndCB1c2UgdGhpcy5maW5pc2hOb2RlKCkgYXMgb3RoZXJ3aXNlIHdlIG1pZ2h0IHByb2Nlc3MgY29tbWVudHMgdHdpY2UgYW5kXG4gICAgICAgIC8vIGluY2x1ZGUgYWxyZWFkeSBjb25zdW1lZCBwYXJlbnNcbiAgICAgICAgdGhpcy5yZXNldEVuZExvY2F0aW9uKG5vZGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5jb2xvbikpIHtcbiAgICAgICAgY29uc3QgdHlwZUNhc3ROb2RlOiBOLlRzVHlwZUNhc3RFeHByZXNzaW9uID0gdGhpcy5zdGFydE5vZGVBdChcbiAgICAgICAgICBzdGFydFBvcyxcbiAgICAgICAgICBzdGFydExvYyxcbiAgICAgICAgKTtcbiAgICAgICAgdHlwZUNhc3ROb2RlLmV4cHJlc3Npb24gPSBub2RlO1xuICAgICAgICB0eXBlQ2FzdE5vZGUudHlwZUFubm90YXRpb24gPSB0aGlzLnRzUGFyc2VUeXBlQW5ub3RhdGlvbigpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUodHlwZUNhc3ROb2RlLCBcIlRTVHlwZUNhc3RFeHByZXNzaW9uXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBwYXJzZUV4cG9ydERlY2xhcmF0aW9uKG5vZGU6IE4uRXhwb3J0TmFtZWREZWNsYXJhdGlvbik6ID9OLkRlY2xhcmF0aW9uIHtcbiAgICAgIC8vIFN0b3JlIG9yaWdpbmFsIGxvY2F0aW9uL3Bvc2l0aW9uXG4gICAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG5cbiAgICAgIC8vIFwiZXhwb3J0IGRlY2xhcmVcIiBpcyBlcXVpdmFsZW50IHRvIGp1c3QgXCJleHBvcnRcIi5cbiAgICAgIGNvbnN0IGlzRGVjbGFyZSA9IHRoaXMuZWF0Q29udGV4dHVhbChcImRlY2xhcmVcIik7XG5cbiAgICAgIGlmIChcbiAgICAgICAgaXNEZWNsYXJlICYmXG4gICAgICAgICh0aGlzLmlzQ29udGV4dHVhbChcImRlY2xhcmVcIikgfHwgIXRoaXMuc2hvdWxkUGFyc2VFeHBvcnREZWNsYXJhdGlvbigpKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IHRoaXMucmFpc2UoXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zdGFydCxcbiAgICAgICAgICBUU0Vycm9ycy5FeHBlY3RlZEFtYmllbnRBZnRlckV4cG9ydERlY2xhcmUsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGxldCBkZWNsYXJhdGlvbjogP04uRGVjbGFyYXRpb247XG5cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0Lm5hbWUpKSB7XG4gICAgICAgIGRlY2xhcmF0aW9uID0gdGhpcy50c1RyeVBhcnNlRXhwb3J0RGVjbGFyYXRpb24oKTtcbiAgICAgIH1cbiAgICAgIGlmICghZGVjbGFyYXRpb24pIHtcbiAgICAgICAgZGVjbGFyYXRpb24gPSBzdXBlci5wYXJzZUV4cG9ydERlY2xhcmF0aW9uKG5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICBkZWNsYXJhdGlvbiAmJlxuICAgICAgICAoZGVjbGFyYXRpb24udHlwZSA9PT0gXCJUU0ludGVyZmFjZURlY2xhcmF0aW9uXCIgfHxcbiAgICAgICAgICBkZWNsYXJhdGlvbi50eXBlID09PSBcIlRTVHlwZUFsaWFzRGVjbGFyYXRpb25cIiB8fFxuICAgICAgICAgIGlzRGVjbGFyZSlcbiAgICAgICkge1xuICAgICAgICBub2RlLmV4cG9ydEtpbmQgPSBcInR5cGVcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRlY2xhcmF0aW9uICYmIGlzRGVjbGFyZSkge1xuICAgICAgICAvLyBSZXNldCBsb2NhdGlvbiB0byBpbmNsdWRlIGBkZWNsYXJlYCBpbiByYW5nZVxuICAgICAgICB0aGlzLnJlc2V0U3RhcnRMb2NhdGlvbihkZWNsYXJhdGlvbiwgc3RhcnRQb3MsIHN0YXJ0TG9jKTtcblxuICAgICAgICBkZWNsYXJhdGlvbi5kZWNsYXJlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlY2xhcmF0aW9uO1xuICAgIH1cblxuICAgIHBhcnNlQ2xhc3NJZChcbiAgICAgIG5vZGU6IE4uQ2xhc3MsXG4gICAgICBpc1N0YXRlbWVudDogYm9vbGVhbixcbiAgICAgIG9wdGlvbmFsSWQ6ID9ib29sZWFuLFxuICAgICk6IHZvaWQge1xuICAgICAgaWYgKCghaXNTdGF0ZW1lbnQgfHwgb3B0aW9uYWxJZCkgJiYgdGhpcy5pc0NvbnRleHR1YWwoXCJpbXBsZW1lbnRzXCIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3VwZXIucGFyc2VDbGFzc0lkKFxuICAgICAgICBub2RlLFxuICAgICAgICBpc1N0YXRlbWVudCxcbiAgICAgICAgb3B0aW9uYWxJZCxcbiAgICAgICAgKG5vZGU6IGFueSkuZGVjbGFyZSA/IEJJTkRfVFNfQU1CSUVOVCA6IEJJTkRfQ0xBU1MsXG4gICAgICApO1xuICAgICAgY29uc3QgdHlwZVBhcmFtZXRlcnMgPSB0aGlzLnRzVHJ5UGFyc2VUeXBlUGFyYW1ldGVycygpO1xuICAgICAgaWYgKHR5cGVQYXJhbWV0ZXJzKSBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdHlwZVBhcmFtZXRlcnM7XG4gICAgfVxuXG4gICAgcGFyc2VDbGFzc1Byb3BlcnR5QW5ub3RhdGlvbihcbiAgICAgIG5vZGU6IE4uQ2xhc3NQcm9wZXJ0eSB8IE4uQ2xhc3NQcml2YXRlUHJvcGVydHksXG4gICAgKTogdm9pZCB7XG4gICAgICBpZiAoIW5vZGUub3B0aW9uYWwgJiYgdGhpcy5lYXQodHQuYmFuZykpIHtcbiAgICAgICAgbm9kZS5kZWZpbml0ZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLnRzVHJ5UGFyc2VUeXBlQW5ub3RhdGlvbigpO1xuICAgICAgaWYgKHR5cGUpIG5vZGUudHlwZUFubm90YXRpb24gPSB0eXBlO1xuICAgIH1cblxuICAgIHBhcnNlQ2xhc3NQcm9wZXJ0eShub2RlOiBOLkNsYXNzUHJvcGVydHkpOiBOLkNsYXNzUHJvcGVydHkge1xuICAgICAgdGhpcy5wYXJzZUNsYXNzUHJvcGVydHlBbm5vdGF0aW9uKG5vZGUpO1xuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc0FtYmllbnRDb250ZXh0ICYmIHRoaXMubWF0Y2godHQuZXEpKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgVFNFcnJvcnMuRGVjbGFyZUNsYXNzRmllbGRIYXNJbml0aWFsaXplcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5wYXJzZUNsYXNzUHJvcGVydHkobm9kZSk7XG4gICAgfVxuXG4gICAgcGFyc2VDbGFzc1ByaXZhdGVQcm9wZXJ0eShcbiAgICAgIG5vZGU6IE4uQ2xhc3NQcml2YXRlUHJvcGVydHksXG4gICAgKTogTi5DbGFzc1ByaXZhdGVQcm9wZXJ0eSB7XG4gICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgaWYgKG5vZGUuYWJzdHJhY3QpIHtcbiAgICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBUU0Vycm9ycy5Qcml2YXRlRWxlbWVudEhhc0Fic3RyYWN0KTtcbiAgICAgIH1cblxuICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgIGlmIChub2RlLmFjY2Vzc2liaWxpdHkpIHtcbiAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICBub2RlLnN0YXJ0LFxuICAgICAgICAgIFRTRXJyb3JzLlByaXZhdGVFbGVtZW50SGFzQWNjZXNzaWJpbGl0eSxcbiAgICAgICAgICBub2RlLmFjY2Vzc2liaWxpdHksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyc2VDbGFzc1Byb3BlcnR5QW5ub3RhdGlvbihub2RlKTtcbiAgICAgIHJldHVybiBzdXBlci5wYXJzZUNsYXNzUHJpdmF0ZVByb3BlcnR5KG5vZGUpO1xuICAgIH1cblxuICAgIHB1c2hDbGFzc01ldGhvZChcbiAgICAgIGNsYXNzQm9keTogTi5DbGFzc0JvZHksXG4gICAgICBtZXRob2Q6IE4uQ2xhc3NNZXRob2QsXG4gICAgICBpc0dlbmVyYXRvcjogYm9vbGVhbixcbiAgICAgIGlzQXN5bmM6IGJvb2xlYW4sXG4gICAgICBpc0NvbnN0cnVjdG9yOiBib29sZWFuLFxuICAgICAgYWxsb3dzRGlyZWN0U3VwZXI6IGJvb2xlYW4sXG4gICAgKTogdm9pZCB7XG4gICAgICBjb25zdCB0eXBlUGFyYW1ldGVycyA9IHRoaXMudHNUcnlQYXJzZVR5cGVQYXJhbWV0ZXJzKCk7XG4gICAgICBpZiAodHlwZVBhcmFtZXRlcnMgJiYgaXNDb25zdHJ1Y3Rvcikge1xuICAgICAgICB0aGlzLnJhaXNlKHR5cGVQYXJhbWV0ZXJzLnN0YXJ0LCBUU0Vycm9ycy5Db25zdHJ1Y3Rvckhhc1R5cGVQYXJhbWV0ZXJzKTtcbiAgICAgIH1cblxuICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgIGlmIChtZXRob2QuZGVjbGFyZSAmJiAobWV0aG9kLmtpbmQgPT09IFwiZ2V0XCIgfHwgbWV0aG9kLmtpbmQgPT09IFwic2V0XCIpKSB7XG4gICAgICAgIHRoaXMucmFpc2UobWV0aG9kLnN0YXJ0LCBUU0Vycm9ycy5EZWNsYXJlQWNjZXNzb3IsIG1ldGhvZC5raW5kKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlUGFyYW1ldGVycykgbWV0aG9kLnR5cGVQYXJhbWV0ZXJzID0gdHlwZVBhcmFtZXRlcnM7XG4gICAgICBzdXBlci5wdXNoQ2xhc3NNZXRob2QoXG4gICAgICAgIGNsYXNzQm9keSxcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBpc0dlbmVyYXRvcixcbiAgICAgICAgaXNBc3luYyxcbiAgICAgICAgaXNDb25zdHJ1Y3RvcixcbiAgICAgICAgYWxsb3dzRGlyZWN0U3VwZXIsXG4gICAgICApO1xuICAgIH1cblxuICAgIHB1c2hDbGFzc1ByaXZhdGVNZXRob2QoXG4gICAgICBjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5LFxuICAgICAgbWV0aG9kOiBOLkNsYXNzUHJpdmF0ZU1ldGhvZCxcbiAgICAgIGlzR2VuZXJhdG9yOiBib29sZWFuLFxuICAgICAgaXNBc3luYzogYm9vbGVhbixcbiAgICApOiB2b2lkIHtcbiAgICAgIGNvbnN0IHR5cGVQYXJhbWV0ZXJzID0gdGhpcy50c1RyeVBhcnNlVHlwZVBhcmFtZXRlcnMoKTtcbiAgICAgIGlmICh0eXBlUGFyYW1ldGVycykgbWV0aG9kLnR5cGVQYXJhbWV0ZXJzID0gdHlwZVBhcmFtZXRlcnM7XG4gICAgICBzdXBlci5wdXNoQ2xhc3NQcml2YXRlTWV0aG9kKGNsYXNzQm9keSwgbWV0aG9kLCBpc0dlbmVyYXRvciwgaXNBc3luYyk7XG4gICAgfVxuXG4gICAgcGFyc2VDbGFzc1N1cGVyKG5vZGU6IE4uQ2xhc3MpOiB2b2lkIHtcbiAgICAgIHN1cGVyLnBhcnNlQ2xhc3NTdXBlcihub2RlKTtcbiAgICAgIGlmIChub2RlLnN1cGVyQ2xhc3MgJiYgdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIG5vZGUuc3VwZXJUeXBlUGFyYW1ldGVycyA9IHRoaXMudHNQYXJzZVR5cGVBcmd1bWVudHMoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVhdENvbnRleHR1YWwoXCJpbXBsZW1lbnRzXCIpKSB7XG4gICAgICAgIG5vZGUuaW1wbGVtZW50cyA9IHRoaXMudHNQYXJzZUhlcml0YWdlQ2xhdXNlKFwiaW1wbGVtZW50c1wiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZU9ialByb3BWYWx1ZShwcm9wOiBOLk9iamVjdE1lbWJlciwgLi4uYXJncyk6IHZvaWQge1xuICAgICAgY29uc3QgdHlwZVBhcmFtZXRlcnMgPSB0aGlzLnRzVHJ5UGFyc2VUeXBlUGFyYW1ldGVycygpO1xuICAgICAgaWYgKHR5cGVQYXJhbWV0ZXJzKSBwcm9wLnR5cGVQYXJhbWV0ZXJzID0gdHlwZVBhcmFtZXRlcnM7XG5cbiAgICAgIHN1cGVyLnBhcnNlT2JqUHJvcFZhbHVlKHByb3AsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHBhcnNlRnVuY3Rpb25QYXJhbXMobm9kZTogTi5GdW5jdGlvbiwgYWxsb3dNb2RpZmllcnM/OiBib29sZWFuKTogdm9pZCB7XG4gICAgICBjb25zdCB0eXBlUGFyYW1ldGVycyA9IHRoaXMudHNUcnlQYXJzZVR5cGVQYXJhbWV0ZXJzKCk7XG4gICAgICBpZiAodHlwZVBhcmFtZXRlcnMpIG5vZGUudHlwZVBhcmFtZXRlcnMgPSB0eXBlUGFyYW1ldGVycztcbiAgICAgIHN1cGVyLnBhcnNlRnVuY3Rpb25QYXJhbXMobm9kZSwgYWxsb3dNb2RpZmllcnMpO1xuICAgIH1cblxuICAgIC8vIGBsZXQgeDogbnVtYmVyO2BcbiAgICBwYXJzZVZhcklkKFxuICAgICAgZGVjbDogTi5WYXJpYWJsZURlY2xhcmF0b3IsXG4gICAgICBraW5kOiBcInZhclwiIHwgXCJsZXRcIiB8IFwiY29uc3RcIixcbiAgICApOiB2b2lkIHtcbiAgICAgIHN1cGVyLnBhcnNlVmFySWQoZGVjbCwga2luZCk7XG4gICAgICBpZiAoZGVjbC5pZC50eXBlID09PSBcIklkZW50aWZpZXJcIiAmJiB0aGlzLmVhdCh0dC5iYW5nKSkge1xuICAgICAgICBkZWNsLmRlZmluaXRlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHNUcnlQYXJzZVR5cGVBbm5vdGF0aW9uKCk7XG4gICAgICBpZiAodHlwZSkge1xuICAgICAgICBkZWNsLmlkLnR5cGVBbm5vdGF0aW9uID0gdHlwZTtcbiAgICAgICAgdGhpcy5yZXNldEVuZExvY2F0aW9uKGRlY2wuaWQpOyAvLyBzZXQgZW5kIHBvc2l0aW9uIHRvIGVuZCBvZiB0eXBlXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcGFyc2UgdGhlIHJldHVybiB0eXBlIG9mIGFuIGFzeW5jIGFycm93IGZ1bmN0aW9uIC0gbGV0IGZvbyA9IChhc3luYyAoKTogbnVtYmVyID0+IHt9KTtcbiAgICBwYXJzZUFzeW5jQXJyb3dGcm9tQ2FsbEV4cHJlc3Npb24oXG4gICAgICBub2RlOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uLFxuICAgICAgY2FsbDogTi5DYWxsRXhwcmVzc2lvbixcbiAgICApOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmNvbG9uKSkge1xuICAgICAgICBub2RlLnJldHVyblR5cGUgPSB0aGlzLnRzUGFyc2VUeXBlQW5ub3RhdGlvbigpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlQXN5bmNBcnJvd0Zyb21DYWxsRXhwcmVzc2lvbihub2RlLCBjYWxsKTtcbiAgICB9XG5cbiAgICBwYXJzZU1heWJlQXNzaWduKC4uLmFyZ3MpOiBOLkV4cHJlc3Npb24ge1xuICAgICAgLy8gTm90ZTogV2hlbiB0aGUgSlNYIHBsdWdpbiBpcyBvbiwgdHlwZSBhc3NlcnRpb25zIChgPFQ+IHhgKSBhcmVuJ3QgdmFsaWQgc3ludGF4LlxuXG4gICAgICBsZXQgc3RhdGU6ID9TdGF0ZTtcbiAgICAgIGxldCBqc3g7XG4gICAgICBsZXQgdHlwZUNhc3Q7XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5oYXNQbHVnaW4oXCJqc3hcIikgJiZcbiAgICAgICAgKHRoaXMubWF0Y2godHQuanN4VGFnU3RhcnQpIHx8IHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSlcbiAgICAgICkge1xuICAgICAgICAvLyBQcmVmZXIgdG8gcGFyc2UgSlNYIGlmIHBvc3NpYmxlLiBCdXQgbWF5IGJlIGFuIGFycm93IGZuLlxuICAgICAgICBzdGF0ZSA9IHRoaXMuc3RhdGUuY2xvbmUoKTtcblxuICAgICAgICBqc3ggPSB0aGlzLnRyeVBhcnNlKCgpID0+IHN1cGVyLnBhcnNlTWF5YmVBc3NpZ24oLi4uYXJncyksIHN0YXRlKTtcblxuICAgICAgICAvKjo6IGludmFyaWFudCghanN4LmFib3J0ZWQpICovXG4gICAgICAgIC8qOjogaW52YXJpYW50KGpzeC5ub2RlICE9IG51bGwpICovXG4gICAgICAgIGlmICghanN4LmVycm9yKSByZXR1cm4ganN4Lm5vZGU7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGB0Yy5qX2V4cHJgIGFuZCBgdGMual9vVGFnYCBmcm9tIGNvbnRleHQgYWRkZWRcbiAgICAgICAgLy8gYnkgcGFyc2luZyBganN4VGFnU3RhcnRgIHRvIHN0b3AgdGhlIEpTWCBwbHVnaW4gZnJvbVxuICAgICAgICAvLyBtZXNzaW5nIHdpdGggdGhlIHRva2Vuc1xuICAgICAgICBjb25zdCB7IGNvbnRleHQgfSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIGlmIChjb250ZXh0W2NvbnRleHQubGVuZ3RoIC0gMV0gPT09IGN0Lmpfb1RhZykge1xuICAgICAgICAgIGNvbnRleHQubGVuZ3RoIC09IDI7XG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdID09PSBjdC5qX2V4cHIpIHtcbiAgICAgICAgICBjb250ZXh0Lmxlbmd0aCAtPSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghanN4Py5lcnJvciAmJiAhdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5wYXJzZU1heWJlQXNzaWduKC4uLmFyZ3MpO1xuICAgICAgfVxuXG4gICAgICAvLyBFaXRoZXIgd2F5LCB3ZSdyZSBsb29raW5nIGF0IGEgJzwnOiB0dC5qc3hUYWdTdGFydCBvciByZWxhdGlvbmFsLlxuXG4gICAgICBsZXQgdHlwZVBhcmFtZXRlcnM6IE4uVHNUeXBlUGFyYW1ldGVyRGVjbGFyYXRpb247XG4gICAgICBzdGF0ZSA9IHN0YXRlIHx8IHRoaXMuc3RhdGUuY2xvbmUoKTtcblxuICAgICAgY29uc3QgYXJyb3cgPSB0aGlzLnRyeVBhcnNlKGFib3J0ID0+IHtcbiAgICAgICAgLy8gVGhpcyBpcyBzaW1pbGFyIHRvIFR5cGVTY3JpcHQncyBgdHJ5UGFyc2VQYXJlbnRoZXNpemVkQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25gLlxuICAgICAgICB0eXBlUGFyYW1ldGVycyA9IHRoaXMudHNQYXJzZVR5cGVQYXJhbWV0ZXJzKCk7XG4gICAgICAgIGNvbnN0IGV4cHIgPSBzdXBlci5wYXJzZU1heWJlQXNzaWduKC4uLmFyZ3MpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBleHByLnR5cGUgIT09IFwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25cIiB8fFxuICAgICAgICAgIGV4cHIuZXh0cmE/LnBhcmVudGhlc2l6ZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgYWJvcnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvcnJlY3QgVHlwZVNjcmlwdCBjb2RlIHNob3VsZCBoYXZlIGF0IGxlYXN0IDEgdHlwZSBwYXJhbWV0ZXIsIGJ1dCBkb24ndCBjcmFzaCBvbiBiYWQgY29kZS5cbiAgICAgICAgaWYgKHR5cGVQYXJhbWV0ZXJzPy5wYXJhbXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgdGhpcy5yZXNldFN0YXJ0TG9jYXRpb25Gcm9tTm9kZShleHByLCB0eXBlUGFyYW1ldGVycyk7XG4gICAgICAgIH1cbiAgICAgICAgZXhwci50eXBlUGFyYW1ldGVycyA9IHR5cGVQYXJhbWV0ZXJzO1xuICAgICAgICByZXR1cm4gZXhwcjtcbiAgICAgIH0sIHN0YXRlKTtcblxuICAgICAgLyo6OiBpbnZhcmlhbnQoYXJyb3cubm9kZSAhPSBudWxsKSAqL1xuICAgICAgaWYgKCFhcnJvdy5lcnJvciAmJiAhYXJyb3cuYWJvcnRlZCkgcmV0dXJuIGFycm93Lm5vZGU7XG5cbiAgICAgIGlmICghanN4KSB7XG4gICAgICAgIC8vIFRyeSBwYXJzaW5nIGEgdHlwZSBjYXN0IGluc3RlYWQgb2YgYW4gYXJyb3cgZnVuY3Rpb24uXG4gICAgICAgIC8vIFRoaXMgd2lsbCBuZXZlciBoYXBwZW4gb3V0c2lkZSBvZiBKU1guXG4gICAgICAgIC8vIChCZWNhdXNlIGluIEpTWCB0aGUgJzwnIHNob3VsZCBiZSBhIGpzeFRhZ1N0YXJ0IGFuZCBub3QgYSByZWxhdGlvbmFsLlxuICAgICAgICBhc3NlcnQoIXRoaXMuaGFzUGx1Z2luKFwianN4XCIpKTtcblxuICAgICAgICAvLyBUaGlzIHdpbGwgc3RhcnQgd2l0aCBhIHR5cGUgYXNzZXJ0aW9uICh2aWEgcGFyc2VNYXliZVVuYXJ5KS5cbiAgICAgICAgLy8gQnV0IGRvbid0IGRpcmVjdGx5IGNhbGwgYHRoaXMudHNQYXJzZVR5cGVBc3NlcnRpb25gIGJlY2F1c2Ugd2Ugd2FudCB0byBoYW5kbGUgYW55IGJpbmFyeSBhZnRlciBpdC5cbiAgICAgICAgdHlwZUNhc3QgPSB0aGlzLnRyeVBhcnNlKCgpID0+IHN1cGVyLnBhcnNlTWF5YmVBc3NpZ24oLi4uYXJncyksIHN0YXRlKTtcbiAgICAgICAgLyo6OiBpbnZhcmlhbnQoIXR5cGVDYXN0LmFib3J0ZWQpICovXG4gICAgICAgIC8qOjogaW52YXJpYW50KHR5cGVDYXN0Lm5vZGUgIT0gbnVsbCkgKi9cbiAgICAgICAgaWYgKCF0eXBlQ2FzdC5lcnJvcikgcmV0dXJuIHR5cGVDYXN0Lm5vZGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChqc3g/Lm5vZGUpIHtcbiAgICAgICAgLyo6OiBpbnZhcmlhbnQoanN4LmZhaWxTdGF0ZSkgKi9cbiAgICAgICAgdGhpcy5zdGF0ZSA9IGpzeC5mYWlsU3RhdGU7XG4gICAgICAgIHJldHVybiBqc3gubm9kZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFycm93Lm5vZGUpIHtcbiAgICAgICAgLyo6OiBpbnZhcmlhbnQoYXJyb3cuZmFpbFN0YXRlKSAqL1xuICAgICAgICB0aGlzLnN0YXRlID0gYXJyb3cuZmFpbFN0YXRlO1xuICAgICAgICByZXR1cm4gYXJyb3cubm9kZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVDYXN0Py5ub2RlKSB7XG4gICAgICAgIC8qOjogaW52YXJpYW50KHR5cGVDYXN0LmZhaWxTdGF0ZSkgKi9cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHR5cGVDYXN0LmZhaWxTdGF0ZTtcbiAgICAgICAgcmV0dXJuIHR5cGVDYXN0Lm5vZGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChqc3g/LnRocm93bikgdGhyb3cganN4LmVycm9yO1xuICAgICAgaWYgKGFycm93LnRocm93bikgdGhyb3cgYXJyb3cuZXJyb3I7XG4gICAgICBpZiAodHlwZUNhc3Q/LnRocm93bikgdGhyb3cgdHlwZUNhc3QuZXJyb3I7XG5cbiAgICAgIHRocm93IGpzeD8uZXJyb3IgfHwgYXJyb3cuZXJyb3IgfHwgdHlwZUNhc3Q/LmVycm9yO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSB0eXBlIGFzc2VydGlvbnNcbiAgICBwYXJzZU1heWJlVW5hcnkocmVmRXhwcmVzc2lvbkVycm9ycz86ID9FeHByZXNzaW9uRXJyb3JzKTogTi5FeHByZXNzaW9uIHtcbiAgICAgIGlmICghdGhpcy5oYXNQbHVnaW4oXCJqc3hcIikgJiYgdGhpcy5pc1JlbGF0aW9uYWwoXCI8XCIpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRzUGFyc2VUeXBlQXNzZXJ0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VwZXIucGFyc2VNYXliZVVuYXJ5KHJlZkV4cHJlc3Npb25FcnJvcnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlQXJyb3cobm9kZTogTi5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbik6ID9OLkFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmNvbG9uKSkge1xuICAgICAgICAvLyBUaGlzIGlzIGRpZmZlcmVudCBmcm9tIGhvdyB0aGUgVFMgcGFyc2VyIGRvZXMgaXQuXG4gICAgICAgIC8vIFRTIHVzZXMgbG9va2FoZWFkLiBUaGUgQmFiZWwgUGFyc2VyIHBhcnNlcyBpdCBhcyBhIHBhcmVudGhlc2l6ZWQgZXhwcmVzc2lvbiBhbmQgY29udmVydHMuXG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy50cnlQYXJzZShhYm9ydCA9PiB7XG4gICAgICAgICAgY29uc3QgcmV0dXJuVHlwZSA9IHRoaXMudHNQYXJzZVR5cGVPclR5cGVQcmVkaWNhdGVBbm5vdGF0aW9uKFxuICAgICAgICAgICAgdHQuY29sb24sXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy5jYW5JbnNlcnRTZW1pY29sb24oKSB8fCAhdGhpcy5tYXRjaCh0dC5hcnJvdykpIGFib3J0KCk7XG4gICAgICAgICAgcmV0dXJuIHJldHVyblR5cGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQuYWJvcnRlZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghcmVzdWx0LnRocm93bikge1xuICAgICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHRoaXMuc3RhdGUgPSByZXN1bHQuZmFpbFN0YXRlO1xuICAgICAgICAgIG5vZGUucmV0dXJuVHlwZSA9IHJlc3VsdC5ub2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5wYXJzZUFycm93KG5vZGUpO1xuICAgIH1cblxuICAgIC8vIEFsbG93IHR5cGUgYW5ub3RhdGlvbnMgaW5zaWRlIG9mIGEgcGFyYW1ldGVyIGxpc3QuXG4gICAgcGFyc2VBc3NpZ25hYmxlTGlzdEl0ZW1UeXBlcyhwYXJhbTogTi5QYXR0ZXJuKSB7XG4gICAgICBpZiAodGhpcy5lYXQodHQucXVlc3Rpb24pKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXJhbS50eXBlICE9PSBcIklkZW50aWZpZXJcIiAmJlxuICAgICAgICAgICF0aGlzLnN0YXRlLmlzQW1iaWVudENvbnRleHQgJiZcbiAgICAgICAgICAhdGhpcy5zdGF0ZS5pblR5cGVcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShwYXJhbS5zdGFydCwgVFNFcnJvcnMuUGF0dGVybklzT3B0aW9uYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgKChwYXJhbTogYW55KTogTi5JZGVudGlmaWVyKS5vcHRpb25hbCA9IHRydWU7XG4gICAgICB9XG4gICAgICBjb25zdCB0eXBlID0gdGhpcy50c1RyeVBhcnNlVHlwZUFubm90YXRpb24oKTtcbiAgICAgIGlmICh0eXBlKSBwYXJhbS50eXBlQW5ub3RhdGlvbiA9IHR5cGU7XG4gICAgICB0aGlzLnJlc2V0RW5kTG9jYXRpb24ocGFyYW0pO1xuXG4gICAgICByZXR1cm4gcGFyYW07XG4gICAgfVxuXG4gICAgdG9Bc3NpZ25hYmxlKG5vZGU6IE4uTm9kZSwgaXNMSFM6IGJvb2xlYW4gPSBmYWxzZSk6IE4uTm9kZSB7XG4gICAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgICBjYXNlIFwiVFNUeXBlQ2FzdEV4cHJlc3Npb25cIjpcbiAgICAgICAgICByZXR1cm4gc3VwZXIudG9Bc3NpZ25hYmxlKHRoaXMudHlwZUNhc3RUb1BhcmFtZXRlcihub2RlKSwgaXNMSFMpO1xuICAgICAgICBjYXNlIFwiVFNQYXJhbWV0ZXJQcm9wZXJ0eVwiOlxuICAgICAgICAgIHJldHVybiBzdXBlci50b0Fzc2lnbmFibGUobm9kZSwgaXNMSFMpO1xuICAgICAgICBjYXNlIFwiUGFyZW50aGVzaXplZEV4cHJlc3Npb25cIjpcbiAgICAgICAgICByZXR1cm4gdGhpcy50b0Fzc2lnbmFibGVQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihub2RlLCBpc0xIUyk7XG4gICAgICAgIGNhc2UgXCJUU0FzRXhwcmVzc2lvblwiOlxuICAgICAgICBjYXNlIFwiVFNOb25OdWxsRXhwcmVzc2lvblwiOlxuICAgICAgICBjYXNlIFwiVFNUeXBlQXNzZXJ0aW9uXCI6XG4gICAgICAgICAgbm9kZS5leHByZXNzaW9uID0gdGhpcy50b0Fzc2lnbmFibGUobm9kZS5leHByZXNzaW9uLCBpc0xIUyk7XG4gICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIHN1cGVyLnRvQXNzaWduYWJsZShub2RlLCBpc0xIUyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9Bc3NpZ25hYmxlUGFyZW50aGVzaXplZEV4cHJlc3Npb24obm9kZTogTi5Ob2RlLCBpc0xIUzogYm9vbGVhbikge1xuICAgICAgc3dpdGNoIChub2RlLmV4cHJlc3Npb24udHlwZSkge1xuICAgICAgICBjYXNlIFwiVFNBc0V4cHJlc3Npb25cIjpcbiAgICAgICAgY2FzZSBcIlRTTm9uTnVsbEV4cHJlc3Npb25cIjpcbiAgICAgICAgY2FzZSBcIlRTVHlwZUFzc2VydGlvblwiOlxuICAgICAgICBjYXNlIFwiUGFyZW50aGVzaXplZEV4cHJlc3Npb25cIjpcbiAgICAgICAgICBub2RlLmV4cHJlc3Npb24gPSB0aGlzLnRvQXNzaWduYWJsZShub2RlLmV4cHJlc3Npb24sIGlzTEhTKTtcbiAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gc3VwZXIudG9Bc3NpZ25hYmxlKG5vZGUsIGlzTEhTKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjaGVja0xWYWwoXG4gICAgICBleHByOiBOLkV4cHJlc3Npb24sXG4gICAgICBjb250ZXh0RGVzY3JpcHRpb246IHN0cmluZyxcbiAgICAgIC4uLmFyZ3M6XG4gICAgICAgIHwgW0JpbmRpbmdUeXBlcyB8IHZvaWRdXG4gICAgICAgIHwgW0JpbmRpbmdUeXBlcyB8IHZvaWQsID9TZXQ8c3RyaW5nPiwgYm9vbGVhbiB8IHZvaWQsIGJvb2xlYW4gfCB2b2lkXVxuICAgICk6IHZvaWQge1xuICAgICAgc3dpdGNoIChleHByLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcIlRTVHlwZUNhc3RFeHByZXNzaW9uXCI6XG4gICAgICAgICAgLy8gQWxsb3cgXCJ0eXBlY2FzdHNcIiB0byBhcHBlYXIgb24gdGhlIGxlZnQgb2YgYXNzaWdubWVudCBleHByZXNzaW9ucyxcbiAgICAgICAgICAvLyBiZWNhdXNlIGl0IG1heSBiZSBpbiBhbiBhcnJvdyBmdW5jdGlvbi5cbiAgICAgICAgICAvLyBlLmcuIGBjb25zdCBmID0gKGZvbzogbnVtYmVyID0gMCkgPT4gZm9vO2BcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgXCJUU1BhcmFtZXRlclByb3BlcnR5XCI6XG4gICAgICAgICAgdGhpcy5jaGVja0xWYWwoZXhwci5wYXJhbWV0ZXIsIFwicGFyYW1ldGVyIHByb3BlcnR5XCIsIC4uLmFyZ3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY2FzZSBcIlRTQXNFeHByZXNzaW9uXCI6XG4gICAgICAgIGNhc2UgXCJUU1R5cGVBc3NlcnRpb25cIjpcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAvKmJpbmRpbmdUeXBlKi8gIWFyZ3NbMF0gJiZcbiAgICAgICAgICAgIGNvbnRleHREZXNjcmlwdGlvbiAhPT0gXCJwYXJlbnRoZXNpemVkIGV4cHJlc3Npb25cIiAmJlxuICAgICAgICAgICAgIWV4cHIuZXh0cmE/LnBhcmVudGhlc2l6ZWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoZXhwci5zdGFydCwgRXJyb3JzLkludmFsaWRMaHMsIGNvbnRleHREZXNjcmlwdGlvbik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jaGVja0xWYWwoZXhwci5leHByZXNzaW9uLCBcInBhcmVudGhlc2l6ZWQgZXhwcmVzc2lvblwiLCAuLi5hcmdzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNhc2UgXCJUU05vbk51bGxFeHByZXNzaW9uXCI6XG4gICAgICAgICAgdGhpcy5jaGVja0xWYWwoZXhwci5leHByZXNzaW9uLCBjb250ZXh0RGVzY3JpcHRpb24sIC4uLmFyZ3MpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBzdXBlci5jaGVja0xWYWwoZXhwciwgY29udGV4dERlc2NyaXB0aW9uLCAuLi5hcmdzKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VCaW5kaW5nQXRvbSgpOiBOLlBhdHRlcm4ge1xuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnR5cGUpIHtcbiAgICAgICAgY2FzZSB0dC5fdGhpczpcbiAgICAgICAgICAvLyBcInRoaXNcIiBtYXkgYmUgdGhlIG5hbWUgb2YgYSBwYXJhbWV0ZXIsIHNvIGFsbG93IGl0LlxuICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlSWRlbnRpZmllcigvKiBsaWJlcmFsICovIHRydWUpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBzdXBlci5wYXJzZUJpbmRpbmdBdG9tKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VNYXliZURlY29yYXRvckFyZ3VtZW50cyhleHByOiBOLkV4cHJlc3Npb24pOiBOLkV4cHJlc3Npb24ge1xuICAgICAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICBjb25zdCB0eXBlQXJndW1lbnRzID0gdGhpcy50c1BhcnNlVHlwZUFyZ3VtZW50cygpO1xuXG4gICAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnBhcmVuTCkpIHtcbiAgICAgICAgICBjb25zdCBjYWxsID0gc3VwZXIucGFyc2VNYXliZURlY29yYXRvckFyZ3VtZW50cyhleHByKTtcbiAgICAgICAgICBjYWxsLnR5cGVQYXJhbWV0ZXJzID0gdHlwZUFyZ3VtZW50cztcbiAgICAgICAgICByZXR1cm4gY2FsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5leHBlY3RlZCh0aGlzLnN0YXRlLnN0YXJ0LCB0dC5wYXJlbkwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VwZXIucGFyc2VNYXliZURlY29yYXRvckFyZ3VtZW50cyhleHByKTtcbiAgICB9XG5cbiAgICBjaGVja0NvbW1hQWZ0ZXJSZXN0KGNsb3NlKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMuc3RhdGUuaXNBbWJpZW50Q29udGV4dCAmJlxuICAgICAgICB0aGlzLm1hdGNoKHR0LmNvbW1hKSAmJlxuICAgICAgICB0aGlzLmxvb2thaGVhZENoYXJDb2RlKCkgPT09IGNsb3NlXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdXBlci5jaGVja0NvbW1hQWZ0ZXJSZXN0KGNsb3NlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA9PT0gPT09ID09PSA9PT0gPT09ID09PSA9PT0gPT09ID09PSA9PT0gPT09ID09PSA9PT0gPT09ID09PSA9PT1cbiAgICAvLyBOb3RlOiBBbGwgYmVsb3cgbWV0aG9kcyBhcmUgZHVwbGljYXRlcyBvZiBzb21ldGhpbmcgaW4gZmxvdy5qcy5cbiAgICAvLyBOb3Qgc3VyZSB3aGF0IHRoZSBiZXN0IHdheSB0byBjb21iaW5lIHRoZXNlIGlzLlxuICAgIC8vID09PSA9PT0gPT09ID09PSA9PT0gPT09ID09PSA9PT0gPT09ID09PSA9PT0gPT09ID09PSA9PT0gPT09ID09PVxuXG4gICAgaXNDbGFzc01ldGhvZCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLmlzUmVsYXRpb25hbChcIjxcIikgfHwgc3VwZXIuaXNDbGFzc01ldGhvZCgpO1xuICAgIH1cblxuICAgIGlzQ2xhc3NQcm9wZXJ0eSgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMubWF0Y2godHQuYmFuZykgfHwgdGhpcy5tYXRjaCh0dC5jb2xvbikgfHwgc3VwZXIuaXNDbGFzc1Byb3BlcnR5KClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcGFyc2VNYXliZURlZmF1bHQoLi4uYXJncyk6IE4uUGF0dGVybiB7XG4gICAgICBjb25zdCBub2RlID0gc3VwZXIucGFyc2VNYXliZURlZmF1bHQoLi4uYXJncyk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgbm9kZS50eXBlID09PSBcIkFzc2lnbm1lbnRQYXR0ZXJuXCIgJiZcbiAgICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbiAmJlxuICAgICAgICBub2RlLnJpZ2h0LnN0YXJ0IDwgbm9kZS50eXBlQW5ub3RhdGlvbi5zdGFydFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbi5zdGFydCxcbiAgICAgICAgICBUU0Vycm9ycy5UeXBlQW5ub3RhdGlvbkFmdGVyQXNzaWduLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICAvLyBlbnN1cmUgdGhhdCBpbnNpZGUgdHlwZXMsIHdlIGJ5cGFzcyB0aGUganN4IHBhcnNlciBwbHVnaW5cbiAgICBnZXRUb2tlbkZyb21Db2RlKGNvZGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLmluVHlwZSAmJlxuICAgICAgICAoY29kZSA9PT0gY2hhckNvZGVzLmdyZWF0ZXJUaGFuIHx8IGNvZGUgPT09IGNoYXJDb2Rlcy5sZXNzVGhhbilcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hPcCh0dC5yZWxhdGlvbmFsLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdXBlci5nZXRUb2tlbkZyb21Db2RlKGNvZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVzZWQgYWZ0ZXIgd2UgaGF2ZSBmaW5pc2hlZCBwYXJzaW5nIHR5cGVzXG4gICAgcmVTY2FuX2x0X2d0KCkge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQucmVsYXRpb25hbCkpIHtcbiAgICAgICAgY29uc3QgY29kZSA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnN0YXJ0KTtcbiAgICAgICAgaWYgKGNvZGUgPT09IGNoYXJDb2Rlcy5sZXNzVGhhbiB8fCBjb2RlID09PSBjaGFyQ29kZXMuZ3JlYXRlclRoYW4pIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnBvcyAtPSAxO1xuICAgICAgICAgIHRoaXMucmVhZFRva2VuX2x0X2d0KGNvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9Bc3NpZ25hYmxlTGlzdChleHByTGlzdDogTi5FeHByZXNzaW9uW10pOiAkUmVhZE9ubHlBcnJheTxOLlBhdHRlcm4+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhwckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZXhwciA9IGV4cHJMaXN0W2ldO1xuICAgICAgICBpZiAoIWV4cHIpIGNvbnRpbnVlO1xuICAgICAgICBzd2l0Y2ggKGV4cHIudHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJUU1R5cGVDYXN0RXhwcmVzc2lvblwiOlxuICAgICAgICAgICAgZXhwckxpc3RbaV0gPSB0aGlzLnR5cGVDYXN0VG9QYXJhbWV0ZXIoZXhwcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiVFNBc0V4cHJlc3Npb25cIjpcbiAgICAgICAgICBjYXNlIFwiVFNUeXBlQXNzZXJ0aW9uXCI6XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycykge1xuICAgICAgICAgICAgICBleHByTGlzdFtpXSA9IHRoaXMudHlwZUNhc3RUb1BhcmFtZXRlcihleHByKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMucmFpc2UoZXhwci5zdGFydCwgVFNFcnJvcnMuVW5leHBlY3RlZFR5cGVDYXN0SW5QYXJhbWV0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci50b0Fzc2lnbmFibGVMaXN0KC4uLmFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgdHlwZUNhc3RUb1BhcmFtZXRlcihub2RlOiBOLlRzVHlwZUNhc3RFeHByZXNzaW9uKTogTi5Ob2RlIHtcbiAgICAgIG5vZGUuZXhwcmVzc2lvbi50eXBlQW5ub3RhdGlvbiA9IG5vZGUudHlwZUFubm90YXRpb247XG5cbiAgICAgIHRoaXMucmVzZXRFbmRMb2NhdGlvbihcbiAgICAgICAgbm9kZS5leHByZXNzaW9uLFxuICAgICAgICBub2RlLnR5cGVBbm5vdGF0aW9uLmVuZCxcbiAgICAgICAgbm9kZS50eXBlQW5ub3RhdGlvbi5sb2MuZW5kLFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIG5vZGUuZXhwcmVzc2lvbjtcbiAgICB9XG5cbiAgICBzaG91bGRQYXJzZUFycm93KCkge1xuICAgICAgcmV0dXJuIHRoaXMubWF0Y2godHQuY29sb24pIHx8IHN1cGVyLnNob3VsZFBhcnNlQXJyb3coKTtcbiAgICB9XG5cbiAgICBzaG91bGRQYXJzZUFzeW5jQXJyb3coKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5tYXRjaCh0dC5jb2xvbikgfHwgc3VwZXIuc2hvdWxkUGFyc2VBc3luY0Fycm93KCk7XG4gICAgfVxuXG4gICAgY2FuSGF2ZUxlYWRpbmdEZWNvcmF0b3IoKSB7XG4gICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBsb29rYWhlYWQgaW4gY2hlY2tpbmcgZm9yIGFic3RyYWN0IGNsYXNzIHVubGVzcyBuZWVkZWQhXG4gICAgICByZXR1cm4gc3VwZXIuY2FuSGF2ZUxlYWRpbmdEZWNvcmF0b3IoKSB8fCB0aGlzLmlzQWJzdHJhY3RDbGFzcygpO1xuICAgIH1cblxuICAgIGpzeFBhcnNlT3BlbmluZ0VsZW1lbnRBZnRlck5hbWUoXG4gICAgICBub2RlOiBOLkpTWE9wZW5pbmdFbGVtZW50LFxuICAgICk6IE4uSlNYT3BlbmluZ0VsZW1lbnQge1xuICAgICAgaWYgKHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSkge1xuICAgICAgICBjb25zdCB0eXBlQXJndW1lbnRzID0gdGhpcy50c1RyeVBhcnNlQW5kQ2F0Y2goKCkgPT5cbiAgICAgICAgICB0aGlzLnRzUGFyc2VUeXBlQXJndW1lbnRzKCksXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0eXBlQXJndW1lbnRzKSBub2RlLnR5cGVQYXJhbWV0ZXJzID0gdHlwZUFyZ3VtZW50cztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5qc3hQYXJzZU9wZW5pbmdFbGVtZW50QWZ0ZXJOYW1lKG5vZGUpO1xuICAgIH1cblxuICAgIGdldEdldHRlclNldHRlckV4cGVjdGVkUGFyYW1Db3VudChcbiAgICAgIG1ldGhvZDogTi5PYmplY3RNZXRob2QgfCBOLkNsYXNzTWV0aG9kLFxuICAgICk6IG51bWJlciB7XG4gICAgICBjb25zdCBiYXNlQ291bnQgPSBzdXBlci5nZXRHZXR0ZXJTZXR0ZXJFeHBlY3RlZFBhcmFtQ291bnQobWV0aG9kKTtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuZ2V0T2JqZWN0T3JDbGFzc01ldGhvZFBhcmFtcyhtZXRob2QpO1xuICAgICAgY29uc3QgZmlyc3RQYXJhbSA9IHBhcmFtc1swXTtcbiAgICAgIGNvbnN0IGhhc0NvbnRleHRQYXJhbSA9IGZpcnN0UGFyYW0gJiYgdGhpcy5pc1RoaXNQYXJhbShmaXJzdFBhcmFtKTtcblxuICAgICAgcmV0dXJuIGhhc0NvbnRleHRQYXJhbSA/IGJhc2VDb3VudCArIDEgOiBiYXNlQ291bnQ7XG4gICAgfVxuXG4gICAgcGFyc2VDYXRjaENsYXVzZVBhcmFtKCk6IE4uUGF0dGVybiB7XG4gICAgICBjb25zdCBwYXJhbSA9IHN1cGVyLnBhcnNlQ2F0Y2hDbGF1c2VQYXJhbSgpO1xuICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHNUcnlQYXJzZVR5cGVBbm5vdGF0aW9uKCk7XG5cbiAgICAgIGlmICh0eXBlKSB7XG4gICAgICAgIHBhcmFtLnR5cGVBbm5vdGF0aW9uID0gdHlwZTtcbiAgICAgICAgdGhpcy5yZXNldEVuZExvY2F0aW9uKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhcmFtO1xuICAgIH1cblxuICAgIHRzSW5BbWJpZW50Q29udGV4dDxUPihjYjogKCkgPT4gVCk6IFQge1xuICAgICAgY29uc3Qgb2xkSXNBbWJpZW50Q29udGV4dCA9IHRoaXMuc3RhdGUuaXNBbWJpZW50Q29udGV4dDtcbiAgICAgIHRoaXMuc3RhdGUuaXNBbWJpZW50Q29udGV4dCA9IHRydWU7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuc3RhdGUuaXNBbWJpZW50Q29udGV4dCA9IG9sZElzQW1iaWVudENvbnRleHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VDbGFzczxUOiBOLkNsYXNzPihub2RlOiBULCAuLi5hcmdzOiBhbnlbXSk6IFQge1xuICAgICAgY29uc3Qgb2xkSW5BYnN0cmFjdENsYXNzID0gdGhpcy5zdGF0ZS5pbkFic3RyYWN0Q2xhc3M7XG4gICAgICB0aGlzLnN0YXRlLmluQWJzdHJhY3RDbGFzcyA9ICEhKG5vZGU6IGFueSkuYWJzdHJhY3Q7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gc3VwZXIucGFyc2VDbGFzcyhub2RlLCAuLi5hcmdzKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMuc3RhdGUuaW5BYnN0cmFjdENsYXNzID0gb2xkSW5BYnN0cmFjdENsYXNzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRzUGFyc2VBYnN0cmFjdERlY2xhcmF0aW9uKFxuICAgICAgbm9kZTogYW55LFxuICAgICk6IE4uQ2xhc3NEZWNsYXJhdGlvbiB8IE4uVHNJbnRlcmZhY2VEZWNsYXJhdGlvbiB8IHR5cGVvZiB1bmRlZmluZWQge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuX2NsYXNzKSkge1xuICAgICAgICBub2RlLmFic3RyYWN0ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDbGFzczxOLkNsYXNzRGVjbGFyYXRpb24+KFxuICAgICAgICAgIChub2RlOiBOLkNsYXNzRGVjbGFyYXRpb24pLFxuICAgICAgICAgIC8qIGlzU3RhdGVtZW50ICovIHRydWUsXG4gICAgICAgICAgLyogb3B0aW9uYWxJZCAqLyBmYWxzZSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0NvbnRleHR1YWwoXCJpbnRlcmZhY2VcIikpIHtcbiAgICAgICAgLy8gZm9yIGludmFsaWQgYWJzdHJhY3QgaW50ZXJmYWNlXG5cbiAgICAgICAgLy8gVG8gYXZvaWRcbiAgICAgICAgLy8gICBhYnN0cmFjdCBpbnRlcmZhY2VcbiAgICAgICAgLy8gICBGb28ge31cbiAgICAgICAgaWYgKCF0aGlzLmhhc0ZvbGxvd2luZ0xpbmVCcmVhaygpKSB7XG4gICAgICAgICAgbm9kZS5hYnN0cmFjdCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgIG5vZGUuc3RhcnQsXG4gICAgICAgICAgICBUU0Vycm9ycy5Ob25DbGFzc01ldGhvZFByb3BlcnR5SGFzQWJzdHJhY3RNb2RpZmVyLFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudHNQYXJzZUludGVyZmFjZURlY2xhcmF0aW9uKFxuICAgICAgICAgICAgKG5vZGU6IE4uVHNJbnRlcmZhY2VEZWNsYXJhdGlvbiksXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKG51bGwsIHR0Ll9jbGFzcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcGFyc2VNZXRob2QoLi4uYXJnczogYW55W10pIHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHN1cGVyLnBhcnNlTWV0aG9kKC4uLmFyZ3MpO1xuICAgICAgaWYgKG1ldGhvZC5hYnN0cmFjdCkge1xuICAgICAgICBjb25zdCBoYXNCb2R5ID0gdGhpcy5oYXNQbHVnaW4oXCJlc3RyZWVcIilcbiAgICAgICAgICA/ICEhbWV0aG9kLnZhbHVlLmJvZHlcbiAgICAgICAgICA6ICEhbWV0aG9kLmJvZHk7XG4gICAgICAgIGlmIChoYXNCb2R5KSB7XG4gICAgICAgICAgY29uc3QgeyBrZXkgfSA9IG1ldGhvZDtcbiAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgbWV0aG9kLnN0YXJ0LFxuICAgICAgICAgICAgVFNFcnJvcnMuQWJzdHJhY3RNZXRob2RIYXNJbXBsZW1lbnRhdGlvbixcbiAgICAgICAgICAgIGtleS50eXBlID09PSBcIklkZW50aWZpZXJcIlxuICAgICAgICAgICAgICA/IGtleS5uYW1lXG4gICAgICAgICAgICAgIDogYFske3RoaXMuaW5wdXQuc2xpY2Uoa2V5LnN0YXJ0LCBrZXkuZW5kKX1dYCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbWV0aG9kO1xuICAgIH1cblxuICAgIHNob3VsZFBhcnNlQXNBbWJpZW50Q29udGV4dCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiAhIXRoaXMuZ2V0UGx1Z2luT3B0aW9uKFwidHlwZXNjcmlwdFwiLCBcImR0c1wiKTtcbiAgICB9XG5cbiAgICBwYXJzZSgpIHtcbiAgICAgIGlmICh0aGlzLnNob3VsZFBhcnNlQXNBbWJpZW50Q29udGV4dCgpKSB7XG4gICAgICAgIHRoaXMuc3RhdGUuaXNBbWJpZW50Q29udGV4dCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIucGFyc2UoKTtcbiAgICB9XG5cbiAgICBnZXRFeHByZXNzaW9uKCkge1xuICAgICAgaWYgKHRoaXMuc2hvdWxkUGFyc2VBc0FtYmllbnRDb250ZXh0KCkpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5pc0FtYmllbnRDb250ZXh0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci5nZXRFeHByZXNzaW9uKCk7XG4gICAgfVxuICB9O1xuIl19