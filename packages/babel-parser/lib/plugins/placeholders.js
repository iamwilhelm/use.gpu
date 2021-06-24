"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var charCodes = _interopRequireWildcard(require("charcodes"));

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

_types.types.placeholder = new _types.TokenType("%%", {
  startsExpr: true
});
// | Placeholder<T>
var PlaceHolderErrors = (0, _error.makeErrorTemplates)({
  ClassNameIsRequired: "A class name is required."
},
/* code */
_error.ErrorCodes.SyntaxError);

var _default = function _default(superClass) {
  return /*#__PURE__*/function (_superClass) {
    _inherits(_class, _superClass);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "parsePlaceholder",
      value: function parsePlaceholder(expectedNode) {
        if (this.match(_types.types.placeholder)) {
          var node = this.startNode();
          this.next();
          this.assertNoSpace("Unexpected space in placeholder."); // We can't use this.parseIdentifier because
          // we don't want nested placeholders.

          node.name = _get(_getPrototypeOf(_class.prototype), "parseIdentifier", this).call(this,
          /* liberal */
          true);
          this.assertNoSpace("Unexpected space in placeholder.");
          this.expect(_types.types.placeholder);
          return this.finishPlaceholder(node, expectedNode);
        }
      }
    }, {
      key: "finishPlaceholder",
      value: function finishPlaceholder(node, expectedNode) {
        var isFinished = !!(node.expectedNode && node.type === "Placeholder");
        node.expectedNode = expectedNode;
        return isFinished ? node : this.finishNode(node, "Placeholder");
      }
      /* ============================================================ *
       * tokenizer/index.js                                           *
       * ============================================================ */

    }, {
      key: "getTokenFromCode",
      value: function getTokenFromCode(code) {
        if (code === charCodes.percentSign && this.input.charCodeAt(this.state.pos + 1) === charCodes.percentSign) {
          return this.finishOp(_types.types.placeholder, 2);
        }

        return _get(_getPrototypeOf(_class.prototype), "getTokenFromCode", this).apply(this, arguments);
      }
      /* ============================================================ *
       * parser/expression.js                                         *
       * ============================================================ */

    }, {
      key: "parseExprAtom",
      value: function parseExprAtom() {
        return this.parsePlaceholder("Expression") || _get(_getPrototypeOf(_class.prototype), "parseExprAtom", this).apply(this, arguments);
      }
    }, {
      key: "parseIdentifier",
      value: function parseIdentifier() {
        // NOTE: This function only handles identifiers outside of
        // expressions and binding patterns, since they are already
        // handled by the parseExprAtom and parseBindingAtom functions.
        // This is needed, for example, to parse "class %%NAME%% {}".
        return this.parsePlaceholder("Identifier") || _get(_getPrototypeOf(_class.prototype), "parseIdentifier", this).apply(this, arguments);
      }
    }, {
      key: "checkReservedWord",
      value: function checkReservedWord(word) {
        // Sometimes we call #checkReservedWord(node.name), expecting
        // that node is an Identifier. If it is a Placeholder, name
        // will be undefined.
        if (word !== undefined) _get(_getPrototypeOf(_class.prototype), "checkReservedWord", this).apply(this, arguments);
      }
      /* ============================================================ *
       * parser/lval.js                                               *
       * ============================================================ */

    }, {
      key: "parseBindingAtom",
      value: function parseBindingAtom() {
        return this.parsePlaceholder("Pattern") || _get(_getPrototypeOf(_class.prototype), "parseBindingAtom", this).apply(this, arguments);
      }
    }, {
      key: "checkLVal",
      value: function checkLVal(expr) {
        if (expr.type !== "Placeholder") _get(_getPrototypeOf(_class.prototype), "checkLVal", this).apply(this, arguments);
      }
    }, {
      key: "toAssignable",
      value: function toAssignable(node) {
        if (node && node.type === "Placeholder" && node.expectedNode === "Expression") {
          node.expectedNode = "Pattern";
          return node;
        }

        return _get(_getPrototypeOf(_class.prototype), "toAssignable", this).apply(this, arguments);
      }
      /* ============================================================ *
       * parser/statement.js                                          *
       * ============================================================ */

    }, {
      key: "isLet",
      value: function isLet(context) {
        if (_get(_getPrototypeOf(_class.prototype), "isLet", this).call(this, context)) {
          return true;
        } // Replicate the original checks that lead to looking ahead for an
        // identifier.


        if (!this.isContextual("let")) {
          return false;
        }

        if (context) return false; // Accept "let %%" as the start of "let %%placeholder%%", as though the
        // placeholder were an identifier.

        var nextToken = this.lookahead();

        if (nextToken.type === _types.types.placeholder) {
          return true;
        }

        return false;
      }
    }, {
      key: "verifyBreakContinue",
      value: function verifyBreakContinue(node) {
        if (node.label && node.label.type === "Placeholder") return;

        _get(_getPrototypeOf(_class.prototype), "verifyBreakContinue", this).apply(this, arguments);
      }
    }, {
      key: "parseExpressionStatement",
      value: function parseExpressionStatement(node, expr) {
        if (expr.type !== "Placeholder" || expr.extra && expr.extra.parenthesized) {
          return _get(_getPrototypeOf(_class.prototype), "parseExpressionStatement", this).apply(this, arguments);
        }

        if (this.match(_types.types.colon)) {
          var stmt = node;
          stmt.label = this.finishPlaceholder(expr, "Identifier");
          this.next();
          stmt.body = this.parseStatement("label");
          return this.finishNode(stmt, "LabeledStatement");
        }

        this.semicolon();
        node.name = expr.name;
        return this.finishPlaceholder(node, "Statement");
      }
    }, {
      key: "parseBlock",
      value: function parseBlock() {
        return this.parsePlaceholder("BlockStatement") || _get(_getPrototypeOf(_class.prototype), "parseBlock", this).apply(this, arguments);
      }
    }, {
      key: "parseFunctionId",
      value: function parseFunctionId() {
        return this.parsePlaceholder("Identifier") || _get(_getPrototypeOf(_class.prototype), "parseFunctionId", this).apply(this, arguments);
      }
    }, {
      key: "parseClass",
      value: function parseClass(node, isStatement, optionalId) {
        var type = isStatement ? "ClassDeclaration" : "ClassExpression";
        this.next();
        this.takeDecorators(node);
        var oldStrict = this.state.strict;
        var placeholder = this.parsePlaceholder("Identifier");

        if (placeholder) {
          if (this.match(_types.types._extends) || this.match(_types.types.placeholder) || this.match(_types.types.braceL)) {
            node.id = placeholder;
          } else if (optionalId || !isStatement) {
            node.id = null;
            node.body = this.finishPlaceholder(placeholder, "ClassBody");
            return this.finishNode(node, type);
          } else {
            this.unexpected(null, PlaceHolderErrors.ClassNameIsRequired);
          }
        } else {
          this.parseClassId(node, isStatement, optionalId);
        }

        this.parseClassSuper(node);
        node.body = this.parsePlaceholder("ClassBody") || this.parseClassBody(!!node.superClass, oldStrict);
        return this.finishNode(node, type);
      }
    }, {
      key: "parseExport",
      value: function parseExport(node) {
        var placeholder = this.parsePlaceholder("Identifier");
        if (!placeholder) return _get(_getPrototypeOf(_class.prototype), "parseExport", this).apply(this, arguments);

        if (!this.isContextual("from") && !this.match(_types.types.comma)) {
          // export %%DECL%%;
          node.specifiers = [];
          node.source = null;
          node.declaration = this.finishPlaceholder(placeholder, "Declaration");
          return this.finishNode(node, "ExportNamedDeclaration");
        } // export %%NAME%% from "foo";


        this.expectPlugin("exportDefaultFrom");
        var specifier = this.startNode();
        specifier.exported = placeholder;
        node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
        return _get(_getPrototypeOf(_class.prototype), "parseExport", this).call(this, node);
      }
    }, {
      key: "isExportDefaultSpecifier",
      value: function isExportDefaultSpecifier() {
        if (this.match(_types.types._default)) {
          var next = this.nextTokenStart();

          if (this.isUnparsedContextual(next, "from")) {
            if (this.input.startsWith(_types.types.placeholder.label, this.nextTokenStartSince(next + 4))) {
              return true;
            }
          }
        }

        return _get(_getPrototypeOf(_class.prototype), "isExportDefaultSpecifier", this).call(this);
      }
    }, {
      key: "maybeParseExportDefaultSpecifier",
      value: function maybeParseExportDefaultSpecifier(node) {
        if (node.specifiers && node.specifiers.length > 0) {
          // "export %%NAME%%" has already been parsed by #parseExport.
          return true;
        }

        return _get(_getPrototypeOf(_class.prototype), "maybeParseExportDefaultSpecifier", this).apply(this, arguments);
      }
    }, {
      key: "checkExport",
      value: function checkExport(node) {
        var specifiers = node.specifiers;

        if (specifiers !== null && specifiers !== void 0 && specifiers.length) {
          node.specifiers = specifiers.filter(function (node) {
            return node.exported.type === "Placeholder";
          });
        }

        _get(_getPrototypeOf(_class.prototype), "checkExport", this).call(this, node);

        node.specifiers = specifiers;
      }
    }, {
      key: "parseImport",
      value: function parseImport(node) {
        var placeholder = this.parsePlaceholder("Identifier");
        if (!placeholder) return _get(_getPrototypeOf(_class.prototype), "parseImport", this).apply(this, arguments);
        node.specifiers = [];

        if (!this.isContextual("from") && !this.match(_types.types.comma)) {
          // import %%STRING%%;
          node.source = this.finishPlaceholder(placeholder, "StringLiteral");
          this.semicolon();
          return this.finishNode(node, "ImportDeclaration");
        } // import %%DEFAULT%% ...


        var specifier = this.startNodeAtNode(placeholder);
        specifier.local = placeholder;
        this.finishNode(specifier, "ImportDefaultSpecifier");
        node.specifiers.push(specifier);

        if (this.eat(_types.types.comma)) {
          // import %%DEFAULT%%, * as ...
          var hasStarImport = this.maybeParseStarImportSpecifier(node); // import %%DEFAULT%%, { ...

          if (!hasStarImport) this.parseNamedImportSpecifiers(node);
        }

        this.expectContextual("from");
        node.source = this.parseImportSource();
        this.semicolon();
        return this.finishNode(node, "ImportDeclaration");
      }
    }, {
      key: "parseImportSource",
      value: function parseImportSource() {
        // import ... from %%STRING%%;
        return this.parsePlaceholder("StringLiteral") || _get(_getPrototypeOf(_class.prototype), "parseImportSource", this).apply(this, arguments);
      }
    }]);

    return _class;
  }(superClass);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbHVnaW5zL3BsYWNlaG9sZGVycy5qcyJdLCJuYW1lcyI6WyJ0dCIsInBsYWNlaG9sZGVyIiwiVG9rZW5UeXBlIiwic3RhcnRzRXhwciIsIlBsYWNlSG9sZGVyRXJyb3JzIiwiQ2xhc3NOYW1lSXNSZXF1aXJlZCIsIkVycm9yQ29kZXMiLCJTeW50YXhFcnJvciIsInN1cGVyQ2xhc3MiLCJleHBlY3RlZE5vZGUiLCJtYXRjaCIsIm5vZGUiLCJzdGFydE5vZGUiLCJuZXh0IiwiYXNzZXJ0Tm9TcGFjZSIsIm5hbWUiLCJleHBlY3QiLCJmaW5pc2hQbGFjZWhvbGRlciIsImlzRmluaXNoZWQiLCJ0eXBlIiwiZmluaXNoTm9kZSIsImNvZGUiLCJjaGFyQ29kZXMiLCJwZXJjZW50U2lnbiIsImlucHV0IiwiY2hhckNvZGVBdCIsInN0YXRlIiwicG9zIiwiZmluaXNoT3AiLCJhcmd1bWVudHMiLCJwYXJzZVBsYWNlaG9sZGVyIiwid29yZCIsInVuZGVmaW5lZCIsImV4cHIiLCJjb250ZXh0IiwiaXNDb250ZXh0dWFsIiwibmV4dFRva2VuIiwibG9va2FoZWFkIiwibGFiZWwiLCJleHRyYSIsInBhcmVudGhlc2l6ZWQiLCJjb2xvbiIsInN0bXQiLCJib2R5IiwicGFyc2VTdGF0ZW1lbnQiLCJzZW1pY29sb24iLCJpc1N0YXRlbWVudCIsIm9wdGlvbmFsSWQiLCJ0YWtlRGVjb3JhdG9ycyIsIm9sZFN0cmljdCIsInN0cmljdCIsIl9leHRlbmRzIiwiYnJhY2VMIiwiaWQiLCJ1bmV4cGVjdGVkIiwicGFyc2VDbGFzc0lkIiwicGFyc2VDbGFzc1N1cGVyIiwicGFyc2VDbGFzc0JvZHkiLCJjb21tYSIsInNwZWNpZmllcnMiLCJzb3VyY2UiLCJkZWNsYXJhdGlvbiIsImV4cGVjdFBsdWdpbiIsInNwZWNpZmllciIsImV4cG9ydGVkIiwiX2RlZmF1bHQiLCJuZXh0VG9rZW5TdGFydCIsImlzVW5wYXJzZWRDb250ZXh0dWFsIiwic3RhcnRzV2l0aCIsIm5leHRUb2tlblN0YXJ0U2luY2UiLCJsZW5ndGgiLCJmaWx0ZXIiLCJzdGFydE5vZGVBdE5vZGUiLCJsb2NhbCIsInB1c2giLCJlYXQiLCJoYXNTdGFySW1wb3J0IiwibWF5YmVQYXJzZVN0YXJJbXBvcnRTcGVjaWZpZXIiLCJwYXJzZU5hbWVkSW1wb3J0U3BlY2lmaWVycyIsImV4cGVjdENvbnRleHR1YWwiLCJwYXJzZUltcG9ydFNvdXJjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUE7O0FBRUE7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBQSxhQUFHQyxXQUFILEdBQWlCLElBQUlDLGdCQUFKLENBQWMsSUFBZCxFQUFvQjtBQUFFQyxFQUFBQSxVQUFVLEVBQUU7QUFBZCxDQUFwQixDQUFqQjtBQXVDd0Q7QUFFeEQsSUFBTUMsaUJBQWlCLEdBQUcsK0JBQ3hCO0FBQ0VDLEVBQUFBLG1CQUFtQixFQUFFO0FBRHZCLENBRHdCO0FBSXhCO0FBQVdDLGtCQUFXQyxXQUpFLENBQTFCOztlQU9lLGtCQUFDQyxVQUFEO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGFBRVgsMEJBQ0VDLFlBREYsRUFFOEM7QUFDNUMsWUFBSSxLQUFLQyxLQUFMLENBQVdWLGFBQUdDLFdBQWQsQ0FBSixFQUFnQztBQUM5QixjQUFNVSxJQUFJLEdBQUcsS0FBS0MsU0FBTCxFQUFiO0FBQ0EsZUFBS0MsSUFBTDtBQUNBLGVBQUtDLGFBQUwsQ0FBbUIsa0NBQW5CLEVBSDhCLENBSzlCO0FBQ0E7O0FBQ0FILFVBQUFBLElBQUksQ0FBQ0ksSUFBTDtBQUFrQztBQUFjLGNBQWhEO0FBRUEsZUFBS0QsYUFBTCxDQUFtQixrQ0FBbkI7QUFDQSxlQUFLRSxNQUFMLENBQVloQixhQUFHQyxXQUFmO0FBQ0EsaUJBQU8sS0FBS2dCLGlCQUFMLENBQXVCTixJQUF2QixFQUE2QkYsWUFBN0IsQ0FBUDtBQUNEO0FBQ0Y7QUFsQlU7QUFBQTtBQUFBLGFBb0JY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QUlEO0FBalRVOztBQUFBO0FBQUEsSUFDQ3JCLFVBREQ7QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0ICogYXMgY2hhckNvZGVzIGZyb20gXCJjaGFyY29kZXNcIjtcblxuaW1wb3J0IHsgdHlwZXMgYXMgdHQsIFRva2VuVHlwZSB9IGZyb20gXCIuLi90b2tlbml6ZXIvdHlwZXNcIjtcbmltcG9ydCB0eXBlIFBhcnNlciBmcm9tIFwiLi4vcGFyc2VyXCI7XG5pbXBvcnQgKiBhcyBOIGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgbWFrZUVycm9yVGVtcGxhdGVzLCBFcnJvckNvZGVzIH0gZnJvbSBcIi4uL3BhcnNlci9lcnJvclwiO1xuXG50dC5wbGFjZWhvbGRlciA9IG5ldyBUb2tlblR5cGUoXCIlJVwiLCB7IHN0YXJ0c0V4cHI6IHRydWUgfSk7XG5cbmV4cG9ydCB0eXBlIFBsYWNlaG9sZGVyVHlwZXMgPVxuICB8IFwiSWRlbnRpZmllclwiXG4gIHwgXCJTdHJpbmdMaXRlcmFsXCJcbiAgfCBcIkV4cHJlc3Npb25cIlxuICB8IFwiU3RhdGVtZW50XCJcbiAgfCBcIkRlY2xhcmF0aW9uXCJcbiAgfCBcIkJsb2NrU3RhdGVtZW50XCJcbiAgfCBcIkNsYXNzQm9keVwiXG4gIHwgXCJQYXR0ZXJuXCI7XG5cbi8vICRQcm9wZXJ0eVR5cGUgZG9lc24ndCBzdXBwb3J0IGVudW1zLiBVc2UgYSBmYWtlIFwic3dpdGNoXCIgKEdldFBsYWNlaG9sZGVyTm9kZSlcbi8vdHlwZSBNYXliZVBsYWNlaG9sZGVyPFQ6IFBsYWNlaG9sZGVyVHlwZXM+ID0gJFByb3BlcnR5VHlwZTxOLCBUPiB8IE4uUGxhY2Vob2xkZXI8VD47XG5cbnR5cGUgX1N3aXRjaDxWYWx1ZSwgQ2FzZXMsIEluZGV4PiA9ICRDYWxsPFxuICAoXG4gICAgJEVsZW1lbnRUeXBlPCRFbGVtZW50VHlwZTxDYXNlcywgSW5kZXg+LCAwPixcbiAgKSA9PiAkRWxlbWVudFR5cGU8JEVsZW1lbnRUeXBlPENhc2VzLCBJbmRleD4sIDE+LFxuICBWYWx1ZSxcbj47XG50eXBlICRTd2l0Y2g8VmFsdWUsIENhc2VzPiA9IF9Td2l0Y2g8VmFsdWUsIENhc2VzLCAqPjtcblxudHlwZSBOb2RlT2Y8VDogUGxhY2Vob2xkZXJUeXBlcz4gPSAkU3dpdGNoPFxuICBULFxuICBbXG4gICAgW1wiSWRlbnRpZmllclwiLCBOLklkZW50aWZpZXJdLFxuICAgIFtcIlN0cmluZ0xpdGVyYWxcIiwgTi5TdHJpbmdMaXRlcmFsXSxcbiAgICBbXCJFeHByZXNzaW9uXCIsIE4uRXhwcmVzc2lvbl0sXG4gICAgW1wiU3RhdGVtZW50XCIsIE4uU3RhdGVtZW50XSxcbiAgICBbXCJEZWNsYXJhdGlvblwiLCBOLkRlY2xhcmF0aW9uXSxcbiAgICBbXCJCbG9ja1N0YXRlbWVudFwiLCBOLkJsb2NrU3RhdGVtZW50XSxcbiAgICBbXCJDbGFzc0JvZHlcIiwgTi5DbGFzc0JvZHldLFxuICAgIFtcIlBhdHRlcm5cIiwgTi5QYXR0ZXJuXSxcbiAgXSxcbj47XG5cbi8vIFBsYWNlaG9sZGVyPFQ+IGJyZWFrcyBldmVyeXRoaW5nLCBiZWNhdXNlIGl0cyB0eXBlIGlzIGluY29tcGF0aWJsZSB3aXRoXG4vLyB0aGUgc3Vic3RpdHV0ZWQgbm9kZXMuXG50eXBlIE1heWJlUGxhY2Vob2xkZXI8VDogUGxhY2Vob2xkZXJUeXBlcz4gPSBOb2RlT2Y8VD47IC8vIHwgUGxhY2Vob2xkZXI8VD5cblxuY29uc3QgUGxhY2VIb2xkZXJFcnJvcnMgPSBtYWtlRXJyb3JUZW1wbGF0ZXMoXG4gIHtcbiAgICBDbGFzc05hbWVJc1JlcXVpcmVkOiBcIkEgY2xhc3MgbmFtZSBpcyByZXF1aXJlZC5cIixcbiAgfSxcbiAgLyogY29kZSAqLyBFcnJvckNvZGVzLlN5bnRheEVycm9yLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgKHN1cGVyQ2xhc3M6IENsYXNzPFBhcnNlcj4pOiBDbGFzczxQYXJzZXI+ID0+XG4gIGNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG4gICAgcGFyc2VQbGFjZWhvbGRlcjxUOiBQbGFjZWhvbGRlclR5cGVzPihcbiAgICAgIGV4cGVjdGVkTm9kZTogVCxcbiAgICApOiAvKj9OLlBsYWNlaG9sZGVyPFQ+Ki8gP01heWJlUGxhY2Vob2xkZXI8VD4ge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQucGxhY2Vob2xkZXIpKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgdGhpcy5hc3NlcnROb1NwYWNlKFwiVW5leHBlY3RlZCBzcGFjZSBpbiBwbGFjZWhvbGRlci5cIik7XG5cbiAgICAgICAgLy8gV2UgY2FuJ3QgdXNlIHRoaXMucGFyc2VJZGVudGlmaWVyIGJlY2F1c2VcbiAgICAgICAgLy8gd2UgZG9uJ3Qgd2FudCBuZXN0ZWQgcGxhY2Vob2xkZXJzLlxuICAgICAgICBub2RlLm5hbWUgPSBzdXBlci5wYXJzZUlkZW50aWZpZXIoLyogbGliZXJhbCAqLyB0cnVlKTtcblxuICAgICAgICB0aGlzLmFzc2VydE5vU3BhY2UoXCJVbmV4cGVjdGVkIHNwYWNlIGluIHBsYWNlaG9sZGVyLlwiKTtcbiAgICAgICAgdGhpcy5leHBlY3QodHQucGxhY2Vob2xkZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hQbGFjZWhvbGRlcihub2RlLCBleHBlY3RlZE5vZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZpbmlzaFBsYWNlaG9sZGVyPFQ6IFBsYWNlaG9sZGVyVHlwZXM+KFxuICAgICAgbm9kZTogTi5Ob2RlLFxuICAgICAgZXhwZWN0ZWROb2RlOiBULFxuICAgICk6IC8qTi5QbGFjZWhvbGRlcjxUPiovIE1heWJlUGxhY2Vob2xkZXI8VD4ge1xuICAgICAgY29uc3QgaXNGaW5pc2hlZCA9ICEhKG5vZGUuZXhwZWN0ZWROb2RlICYmIG5vZGUudHlwZSA9PT0gXCJQbGFjZWhvbGRlclwiKTtcbiAgICAgIG5vZGUuZXhwZWN0ZWROb2RlID0gZXhwZWN0ZWROb2RlO1xuXG4gICAgICByZXR1cm4gaXNGaW5pc2hlZCA/IG5vZGUgOiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJQbGFjZWhvbGRlclwiKTtcbiAgICB9XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKlxuICAgICAqIHRva2VuaXplci9pbmRleC5qcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgICBnZXRUb2tlbkZyb21Db2RlKGNvZGU6IG51bWJlcikge1xuICAgICAgaWYgKFxuICAgICAgICBjb2RlID09PSBjaGFyQ29kZXMucGVyY2VudFNpZ24gJiZcbiAgICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSkgPT09IGNoYXJDb2Rlcy5wZXJjZW50U2lnblxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE9wKHR0LnBsYWNlaG9sZGVyLCAyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1cGVyLmdldFRva2VuRnJvbUNvZGUoLi4uYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKlxuICAgICAqIHBhcnNlci9leHByZXNzaW9uLmpzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgICBwYXJzZUV4cHJBdG9tKCk6IE1heWJlUGxhY2Vob2xkZXI8XCJFeHByZXNzaW9uXCI+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMucGFyc2VQbGFjZWhvbGRlcihcIkV4cHJlc3Npb25cIikgfHwgc3VwZXIucGFyc2VFeHByQXRvbSguLi5hcmd1bWVudHMpXG4gICAgICApO1xuICAgIH1cblxuICAgIHBhcnNlSWRlbnRpZmllcigpOiBNYXliZVBsYWNlaG9sZGVyPFwiSWRlbnRpZmllclwiPiB7XG4gICAgICAvLyBOT1RFOiBUaGlzIGZ1bmN0aW9uIG9ubHkgaGFuZGxlcyBpZGVudGlmaWVycyBvdXRzaWRlIG9mXG4gICAgICAvLyBleHByZXNzaW9ucyBhbmQgYmluZGluZyBwYXR0ZXJucywgc2luY2UgdGhleSBhcmUgYWxyZWFkeVxuICAgICAgLy8gaGFuZGxlZCBieSB0aGUgcGFyc2VFeHByQXRvbSBhbmQgcGFyc2VCaW5kaW5nQXRvbSBmdW5jdGlvbnMuXG4gICAgICAvLyBUaGlzIGlzIG5lZWRlZCwgZm9yIGV4YW1wbGUsIHRvIHBhcnNlIFwiY2xhc3MgJSVOQU1FJSUge31cIi5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMucGFyc2VQbGFjZWhvbGRlcihcIklkZW50aWZpZXJcIikgfHxcbiAgICAgICAgc3VwZXIucGFyc2VJZGVudGlmaWVyKC4uLmFyZ3VtZW50cylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY2hlY2tSZXNlcnZlZFdvcmQod29yZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAvLyBTb21ldGltZXMgd2UgY2FsbCAjY2hlY2tSZXNlcnZlZFdvcmQobm9kZS5uYW1lKSwgZXhwZWN0aW5nXG4gICAgICAvLyB0aGF0IG5vZGUgaXMgYW4gSWRlbnRpZmllci4gSWYgaXQgaXMgYSBQbGFjZWhvbGRlciwgbmFtZVxuICAgICAgLy8gd2lsbCBiZSB1bmRlZmluZWQuXG4gICAgICBpZiAod29yZCAhPT0gdW5kZWZpbmVkKSBzdXBlci5jaGVja1Jlc2VydmVkV29yZCguLi5hcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqXG4gICAgICogcGFyc2VyL2x2YWwuanMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICAgIHBhcnNlQmluZGluZ0F0b20oKTogTWF5YmVQbGFjZWhvbGRlcjxcIlBhdHRlcm5cIj4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5wYXJzZVBsYWNlaG9sZGVyKFwiUGF0dGVyblwiKSB8fCBzdXBlci5wYXJzZUJpbmRpbmdBdG9tKC4uLmFyZ3VtZW50cylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY2hlY2tMVmFsKGV4cHI6IE4uRXhwcmVzc2lvbik6IHZvaWQge1xuICAgICAgaWYgKGV4cHIudHlwZSAhPT0gXCJQbGFjZWhvbGRlclwiKSBzdXBlci5jaGVja0xWYWwoLi4uYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICB0b0Fzc2lnbmFibGUobm9kZTogTi5Ob2RlKTogTi5Ob2RlIHtcbiAgICAgIGlmIChcbiAgICAgICAgbm9kZSAmJlxuICAgICAgICBub2RlLnR5cGUgPT09IFwiUGxhY2Vob2xkZXJcIiAmJlxuICAgICAgICBub2RlLmV4cGVjdGVkTm9kZSA9PT0gXCJFeHByZXNzaW9uXCJcbiAgICAgICkge1xuICAgICAgICBub2RlLmV4cGVjdGVkTm9kZSA9IFwiUGF0dGVyblwiO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdXBlci50b0Fzc2lnbmFibGUoLi4uYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKlxuICAgICAqIHBhcnNlci9zdGF0ZW1lbnQuanMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgICBpc0xldChjb250ZXh0OiA/c3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICBpZiAoc3VwZXIuaXNMZXQoY29udGV4dCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlcGxpY2F0ZSB0aGUgb3JpZ2luYWwgY2hlY2tzIHRoYXQgbGVhZCB0byBsb29raW5nIGFoZWFkIGZvciBhblxuICAgICAgLy8gaWRlbnRpZmllci5cbiAgICAgIGlmICghdGhpcy5pc0NvbnRleHR1YWwoXCJsZXRcIikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRleHQpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gQWNjZXB0IFwibGV0ICUlXCIgYXMgdGhlIHN0YXJ0IG9mIFwibGV0ICUlcGxhY2Vob2xkZXIlJVwiLCBhcyB0aG91Z2ggdGhlXG4gICAgICAvLyBwbGFjZWhvbGRlciB3ZXJlIGFuIGlkZW50aWZpZXIuXG4gICAgICBjb25zdCBuZXh0VG9rZW4gPSB0aGlzLmxvb2thaGVhZCgpO1xuICAgICAgaWYgKG5leHRUb2tlbi50eXBlID09PSB0dC5wbGFjZWhvbGRlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZlcmlmeUJyZWFrQ29udGludWUobm9kZTogTi5CcmVha1N0YXRlbWVudCB8IE4uQ29udGludWVTdGF0ZW1lbnQpIHtcbiAgICAgIGlmIChub2RlLmxhYmVsICYmIG5vZGUubGFiZWwudHlwZSA9PT0gXCJQbGFjZWhvbGRlclwiKSByZXR1cm47XG4gICAgICBzdXBlci52ZXJpZnlCcmVha0NvbnRpbnVlKC4uLmFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgcGFyc2VFeHByZXNzaW9uU3RhdGVtZW50KFxuICAgICAgbm9kZTogTWF5YmVQbGFjZWhvbGRlcjxcIlN0YXRlbWVudFwiPixcbiAgICAgIGV4cHI6IE4uRXhwcmVzc2lvbixcbiAgICApOiBNYXliZVBsYWNlaG9sZGVyPFwiU3RhdGVtZW50XCI+IHtcbiAgICAgIGlmIChcbiAgICAgICAgZXhwci50eXBlICE9PSBcIlBsYWNlaG9sZGVyXCIgfHxcbiAgICAgICAgKGV4cHIuZXh0cmEgJiYgZXhwci5leHRyYS5wYXJlbnRoZXNpemVkKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5wYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoLi4uYXJndW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubWF0Y2godHQuY29sb24pKSB7XG4gICAgICAgIGNvbnN0IHN0bXQ6IE4uTGFiZWxlZFN0YXRlbWVudCA9IG5vZGU7XG4gICAgICAgIHN0bXQubGFiZWwgPSB0aGlzLmZpbmlzaFBsYWNlaG9sZGVyKGV4cHIsIFwiSWRlbnRpZmllclwiKTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIHN0bXQuYm9keSA9IHRoaXMucGFyc2VTdGF0ZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShzdG10LCBcIkxhYmVsZWRTdGF0ZW1lbnRcIik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VtaWNvbG9uKCk7XG5cbiAgICAgIG5vZGUubmFtZSA9IGV4cHIubmFtZTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaFBsYWNlaG9sZGVyKG5vZGUsIFwiU3RhdGVtZW50XCIpO1xuICAgIH1cblxuICAgIHBhcnNlQmxvY2soKTogTWF5YmVQbGFjZWhvbGRlcjxcIkJsb2NrU3RhdGVtZW50XCI+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMucGFyc2VQbGFjZWhvbGRlcihcIkJsb2NrU3RhdGVtZW50XCIpIHx8XG4gICAgICAgIHN1cGVyLnBhcnNlQmxvY2soLi4uYXJndW1lbnRzKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBwYXJzZUZ1bmN0aW9uSWQoKTogP01heWJlUGxhY2Vob2xkZXI8XCJJZGVudGlmaWVyXCI+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMucGFyc2VQbGFjZWhvbGRlcihcIklkZW50aWZpZXJcIikgfHxcbiAgICAgICAgc3VwZXIucGFyc2VGdW5jdGlvbklkKC4uLmFyZ3VtZW50cylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcGFyc2VDbGFzczxUOiBOLkNsYXNzPihcbiAgICAgIG5vZGU6IFQsXG4gICAgICBpc1N0YXRlbWVudDogLyogVCA9PT0gQ2xhc3NEZWNsYXJhdGlvbiAqLyBib29sZWFuLFxuICAgICAgb3B0aW9uYWxJZD86IGJvb2xlYW4sXG4gICAgKTogVCB7XG4gICAgICBjb25zdCB0eXBlID0gaXNTdGF0ZW1lbnQgPyBcIkNsYXNzRGVjbGFyYXRpb25cIiA6IFwiQ2xhc3NFeHByZXNzaW9uXCI7XG5cbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgdGhpcy50YWtlRGVjb3JhdG9ycyhub2RlKTtcbiAgICAgIGNvbnN0IG9sZFN0cmljdCA9IHRoaXMuc3RhdGUuc3RyaWN0O1xuXG4gICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMucGFyc2VQbGFjZWhvbGRlcihcIklkZW50aWZpZXJcIik7XG4gICAgICBpZiAocGxhY2Vob2xkZXIpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMubWF0Y2godHQuX2V4dGVuZHMpIHx8XG4gICAgICAgICAgdGhpcy5tYXRjaCh0dC5wbGFjZWhvbGRlcikgfHxcbiAgICAgICAgICB0aGlzLm1hdGNoKHR0LmJyYWNlTClcbiAgICAgICAgKSB7XG4gICAgICAgICAgbm9kZS5pZCA9IHBsYWNlaG9sZGVyO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbmFsSWQgfHwgIWlzU3RhdGVtZW50KSB7XG4gICAgICAgICAgbm9kZS5pZCA9IG51bGw7XG4gICAgICAgICAgbm9kZS5ib2R5ID0gdGhpcy5maW5pc2hQbGFjZWhvbGRlcihwbGFjZWhvbGRlciwgXCJDbGFzc0JvZHlcIik7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCB0eXBlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVuZXhwZWN0ZWQobnVsbCwgUGxhY2VIb2xkZXJFcnJvcnMuQ2xhc3NOYW1lSXNSZXF1aXJlZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFyc2VDbGFzc0lkKG5vZGUsIGlzU3RhdGVtZW50LCBvcHRpb25hbElkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJzZUNsYXNzU3VwZXIobm9kZSk7XG4gICAgICBub2RlLmJvZHkgPVxuICAgICAgICB0aGlzLnBhcnNlUGxhY2Vob2xkZXIoXCJDbGFzc0JvZHlcIikgfHxcbiAgICAgICAgdGhpcy5wYXJzZUNsYXNzQm9keSghIW5vZGUuc3VwZXJDbGFzcywgb2xkU3RyaWN0KTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgdHlwZSk7XG4gICAgfVxuXG4gICAgcGFyc2VFeHBvcnQobm9kZTogTi5Ob2RlKTogTi5Ob2RlIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5wYXJzZVBsYWNlaG9sZGVyKFwiSWRlbnRpZmllclwiKTtcbiAgICAgIGlmICghcGxhY2Vob2xkZXIpIHJldHVybiBzdXBlci5wYXJzZUV4cG9ydCguLi5hcmd1bWVudHMpO1xuXG4gICAgICBpZiAoIXRoaXMuaXNDb250ZXh0dWFsKFwiZnJvbVwiKSAmJiAhdGhpcy5tYXRjaCh0dC5jb21tYSkpIHtcbiAgICAgICAgLy8gZXhwb3J0ICUlREVDTCUlO1xuICAgICAgICBub2RlLnNwZWNpZmllcnMgPSBbXTtcbiAgICAgICAgbm9kZS5zb3VyY2UgPSBudWxsO1xuICAgICAgICBub2RlLmRlY2xhcmF0aW9uID0gdGhpcy5maW5pc2hQbGFjZWhvbGRlcihwbGFjZWhvbGRlciwgXCJEZWNsYXJhdGlvblwiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkV4cG9ydE5hbWVkRGVjbGFyYXRpb25cIik7XG4gICAgICB9XG5cbiAgICAgIC8vIGV4cG9ydCAlJU5BTUUlJSBmcm9tIFwiZm9vXCI7XG4gICAgICB0aGlzLmV4cGVjdFBsdWdpbihcImV4cG9ydERlZmF1bHRGcm9tXCIpO1xuICAgICAgY29uc3Qgc3BlY2lmaWVyID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHNwZWNpZmllci5leHBvcnRlZCA9IHBsYWNlaG9sZGVyO1xuICAgICAgbm9kZS5zcGVjaWZpZXJzID0gW3RoaXMuZmluaXNoTm9kZShzcGVjaWZpZXIsIFwiRXhwb3J0RGVmYXVsdFNwZWNpZmllclwiKV07XG5cbiAgICAgIHJldHVybiBzdXBlci5wYXJzZUV4cG9ydChub2RlKTtcbiAgICB9XG5cbiAgICBpc0V4cG9ydERlZmF1bHRTcGVjaWZpZXIoKTogYm9vbGVhbiB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5fZGVmYXVsdCkpIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMubmV4dFRva2VuU3RhcnQoKTtcbiAgICAgICAgaWYgKHRoaXMuaXNVbnBhcnNlZENvbnRleHR1YWwobmV4dCwgXCJmcm9tXCIpKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5pbnB1dC5zdGFydHNXaXRoKFxuICAgICAgICAgICAgICB0dC5wbGFjZWhvbGRlci5sYWJlbCxcbiAgICAgICAgICAgICAgdGhpcy5uZXh0VG9rZW5TdGFydFNpbmNlKG5leHQgKyA0KSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLmlzRXhwb3J0RGVmYXVsdFNwZWNpZmllcigpO1xuICAgIH1cblxuICAgIG1heWJlUGFyc2VFeHBvcnREZWZhdWx0U3BlY2lmaWVyKG5vZGU6IE4uTm9kZSk6IGJvb2xlYW4ge1xuICAgICAgaWYgKG5vZGUuc3BlY2lmaWVycyAmJiBub2RlLnNwZWNpZmllcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBcImV4cG9ydCAlJU5BTUUlJVwiIGhhcyBhbHJlYWR5IGJlZW4gcGFyc2VkIGJ5ICNwYXJzZUV4cG9ydC5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VwZXIubWF5YmVQYXJzZUV4cG9ydERlZmF1bHRTcGVjaWZpZXIoLi4uYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBjaGVja0V4cG9ydChub2RlOiBOLkV4cG9ydE5hbWVkRGVjbGFyYXRpb24pOiB2b2lkIHtcbiAgICAgIGNvbnN0IHsgc3BlY2lmaWVycyB9ID0gbm9kZTtcbiAgICAgIGlmIChzcGVjaWZpZXJzPy5sZW5ndGgpIHtcbiAgICAgICAgbm9kZS5zcGVjaWZpZXJzID0gc3BlY2lmaWVycy5maWx0ZXIoXG4gICAgICAgICAgbm9kZSA9PiBub2RlLmV4cG9ydGVkLnR5cGUgPT09IFwiUGxhY2Vob2xkZXJcIixcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHN1cGVyLmNoZWNrRXhwb3J0KG5vZGUpO1xuICAgICAgbm9kZS5zcGVjaWZpZXJzID0gc3BlY2lmaWVycztcbiAgICB9XG5cbiAgICBwYXJzZUltcG9ydChcbiAgICAgIG5vZGU6IE4uTm9kZSxcbiAgICApOiBOLkltcG9ydERlY2xhcmF0aW9uIHwgTi5Uc0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uIHtcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5wYXJzZVBsYWNlaG9sZGVyKFwiSWRlbnRpZmllclwiKTtcbiAgICAgIGlmICghcGxhY2Vob2xkZXIpIHJldHVybiBzdXBlci5wYXJzZUltcG9ydCguLi5hcmd1bWVudHMpO1xuXG4gICAgICBub2RlLnNwZWNpZmllcnMgPSBbXTtcblxuICAgICAgaWYgKCF0aGlzLmlzQ29udGV4dHVhbChcImZyb21cIikgJiYgIXRoaXMubWF0Y2godHQuY29tbWEpKSB7XG4gICAgICAgIC8vIGltcG9ydCAlJVNUUklORyUlO1xuICAgICAgICBub2RlLnNvdXJjZSA9IHRoaXMuZmluaXNoUGxhY2Vob2xkZXIocGxhY2Vob2xkZXIsIFwiU3RyaW5nTGl0ZXJhbFwiKTtcbiAgICAgICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkltcG9ydERlY2xhcmF0aW9uXCIpO1xuICAgICAgfVxuXG4gICAgICAvLyBpbXBvcnQgJSVERUZBVUxUJSUgLi4uXG4gICAgICBjb25zdCBzcGVjaWZpZXIgPSB0aGlzLnN0YXJ0Tm9kZUF0Tm9kZShwbGFjZWhvbGRlcik7XG4gICAgICBzcGVjaWZpZXIubG9jYWwgPSBwbGFjZWhvbGRlcjtcbiAgICAgIHRoaXMuZmluaXNoTm9kZShzcGVjaWZpZXIsIFwiSW1wb3J0RGVmYXVsdFNwZWNpZmllclwiKTtcbiAgICAgIG5vZGUuc3BlY2lmaWVycy5wdXNoKHNwZWNpZmllcik7XG5cbiAgICAgIGlmICh0aGlzLmVhdCh0dC5jb21tYSkpIHtcbiAgICAgICAgLy8gaW1wb3J0ICUlREVGQVVMVCUlLCAqIGFzIC4uLlxuICAgICAgICBjb25zdCBoYXNTdGFySW1wb3J0ID0gdGhpcy5tYXliZVBhcnNlU3RhckltcG9ydFNwZWNpZmllcihub2RlKTtcblxuICAgICAgICAvLyBpbXBvcnQgJSVERUZBVUxUJSUsIHsgLi4uXG4gICAgICAgIGlmICghaGFzU3RhckltcG9ydCkgdGhpcy5wYXJzZU5hbWVkSW1wb3J0U3BlY2lmaWVycyhub2RlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5leHBlY3RDb250ZXh0dWFsKFwiZnJvbVwiKTtcbiAgICAgIG5vZGUuc291cmNlID0gdGhpcy5wYXJzZUltcG9ydFNvdXJjZSgpO1xuICAgICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJJbXBvcnREZWNsYXJhdGlvblwiKTtcbiAgICB9XG5cbiAgICBwYXJzZUltcG9ydFNvdXJjZSgpOiBNYXliZVBsYWNlaG9sZGVyPFwiU3RyaW5nTGl0ZXJhbFwiPiB7XG4gICAgICAvLyBpbXBvcnQgLi4uIGZyb20gJSVTVFJJTkclJTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5wYXJzZVBsYWNlaG9sZGVyKFwiU3RyaW5nTGl0ZXJhbFwiKSB8fFxuICAgICAgICBzdXBlci5wYXJzZUltcG9ydFNvdXJjZSguLi5hcmd1bWVudHMpXG4gICAgICApO1xuICAgIH1cbiAgfTtcbiJdfQ==