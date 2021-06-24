"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var charCodes = _interopRequireWildcard(require("charcodes"));

var _xhtml = _interopRequireDefault(require("./xhtml"));

var _types = require("../../tokenizer/types");

var _context = require("../../tokenizer/context");

var N = _interopRequireWildcard(require("../../types"));

var _identifier = require("../../util/identifier");

var _whitespace = require("../../util/whitespace");

var _error = require("../../parser/error");

var _state = _interopRequireDefault(require("../../tokenizer/state"));

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

var HEX_NUMBER = /^[\da-fA-F]+$/;
var DECIMAL_NUMBER = /^\d+$/;
/* eslint sort-keys: "error" */

var JsxErrors = (0, _error.makeErrorTemplates)({
  AttributeIsEmpty: "JSX attributes must only be assigned a non-empty expression.",
  MissingClosingTagElement: "Expected corresponding JSX closing tag for <%0>.",
  MissingClosingTagFragment: "Expected corresponding JSX closing tag for <>.",
  UnexpectedSequenceExpression: "Sequence expressions cannot be directly nested inside JSX. Did you mean to wrap it in parentheses (...)?",
  UnsupportedJsxValue: "JSX value should be either an expression or a quoted JSX text.",
  UnterminatedJsxContent: "Unterminated JSX contents.",
  UnwrappedAdjacentJSXElements: "Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?"
},
/* code */
_error.ErrorCodes.SyntaxError);
/* eslint-disable sort-keys */
// Be aware that this file is always executed and not only when the plugin is enabled.
// Therefore this contexts and tokens do always exist.

_context.types.j_oTag = new _context.TokContext("<tag");
_context.types.j_cTag = new _context.TokContext("</tag");
_context.types.j_expr = new _context.TokContext("<tag>...</tag>", true);
_types.types.jsxName = new _types.TokenType("jsxName");
_types.types.jsxText = new _types.TokenType("jsxText", {
  beforeExpr: true
});
_types.types.jsxTagStart = new _types.TokenType("jsxTagStart", {
  startsExpr: true
});
_types.types.jsxTagEnd = new _types.TokenType("jsxTagEnd");

_types.types.jsxTagStart.updateContext = function (context) {
  context.push(_context.types.j_expr, // treat as beginning of JSX expression
  _context.types.j_oTag // start opening tag context
  );
};

function isFragment(object) {
  return object ? object.type === "JSXOpeningFragment" || object.type === "JSXClosingFragment" : false;
} // Transforms JSX element name to string.


function getQualifiedJSXName(object) {
  if (object.type === "JSXIdentifier") {
    return object.name;
  }

  if (object.type === "JSXNamespacedName") {
    return object.namespace.name + ":" + object.name.name;
  }

  if (object.type === "JSXMemberExpression") {
    return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
  } // istanbul ignore next


  throw new Error("Node had unexpected type: " + object.type);
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
      key: "jsxReadToken",
      value: // Reads inline JSX contents token.
      function jsxReadToken() {
        var out = "";
        var chunkStart = this.state.pos;

        for (;;) {
          if (this.state.pos >= this.length) {
            throw this.raise(this.state.start, JsxErrors.UnterminatedJsxContent);
          }

          var ch = this.input.charCodeAt(this.state.pos);

          switch (ch) {
            case charCodes.lessThan:
            case charCodes.leftCurlyBrace:
              if (this.state.pos === this.state.start) {
                if (ch === charCodes.lessThan && this.state.exprAllowed) {
                  ++this.state.pos;
                  return this.finishToken(_types.types.jsxTagStart);
                }

                return _get(_getPrototypeOf(_class.prototype), "getTokenFromCode", this).call(this, ch);
              }

              out += this.input.slice(chunkStart, this.state.pos);
              return this.finishToken(_types.types.jsxText, out);

            case charCodes.ampersand:
              out += this.input.slice(chunkStart, this.state.pos);
              out += this.jsxReadEntity();
              chunkStart = this.state.pos;
              break;

            case charCodes.greaterThan:
            case charCodes.rightCurlyBrace:
              if (process.env.BABEL_8_BREAKING) {
                var htmlEntity = ch === charCodes.rightCurlyBrace ? "&rbrace;" : "&gt;";
                var _char = this.input[this.state.pos];
                this.raise(this.state.pos, {
                  code: _error.ErrorCodes.SyntaxError,
                  reasonCode: "UnexpectedToken",
                  template: "Unexpected token `".concat(_char, "`. Did you mean `").concat(htmlEntity, "` or `{'").concat(_char, "'}`?")
                });
              }

            /* falls through */

            default:
              if ((0, _whitespace.isNewLine)(ch)) {
                out += this.input.slice(chunkStart, this.state.pos);
                out += this.jsxReadNewLine(true);
                chunkStart = this.state.pos;
              } else {
                ++this.state.pos;
              }

          }
        }
      }
    }, {
      key: "jsxReadNewLine",
      value: function jsxReadNewLine(normalizeCRLF) {
        var ch = this.input.charCodeAt(this.state.pos);
        var out;
        ++this.state.pos;

        if (ch === charCodes.carriageReturn && this.input.charCodeAt(this.state.pos) === charCodes.lineFeed) {
          ++this.state.pos;
          out = normalizeCRLF ? "\n" : "\r\n";
        } else {
          out = String.fromCharCode(ch);
        }

        ++this.state.curLine;
        this.state.lineStart = this.state.pos;
        return out;
      }
    }, {
      key: "jsxReadString",
      value: function jsxReadString(quote) {
        var out = "";
        var chunkStart = ++this.state.pos;

        for (;;) {
          if (this.state.pos >= this.length) {
            throw this.raise(this.state.start, _error.Errors.UnterminatedString);
          }

          var ch = this.input.charCodeAt(this.state.pos);
          if (ch === quote) break;

          if (ch === charCodes.ampersand) {
            out += this.input.slice(chunkStart, this.state.pos);
            out += this.jsxReadEntity();
            chunkStart = this.state.pos;
          } else if ((0, _whitespace.isNewLine)(ch)) {
            out += this.input.slice(chunkStart, this.state.pos);
            out += this.jsxReadNewLine(false);
            chunkStart = this.state.pos;
          } else {
            ++this.state.pos;
          }
        }

        out += this.input.slice(chunkStart, this.state.pos++);
        return this.finishToken(_types.types.string, out);
      }
    }, {
      key: "jsxReadEntity",
      value: function jsxReadEntity() {
        var str = "";
        var count = 0;
        var entity;
        var ch = this.input[this.state.pos];
        var startPos = ++this.state.pos;

        while (this.state.pos < this.length && count++ < 10) {
          ch = this.input[this.state.pos++];

          if (ch === ";") {
            if (str[0] === "#") {
              if (str[1] === "x") {
                str = str.substr(2);

                if (HEX_NUMBER.test(str)) {
                  entity = String.fromCodePoint(parseInt(str, 16));
                }
              } else {
                str = str.substr(1);

                if (DECIMAL_NUMBER.test(str)) {
                  entity = String.fromCodePoint(parseInt(str, 10));
                }
              }
            } else {
              entity = _xhtml["default"][str];
            }

            break;
          }

          str += ch;
        }

        if (!entity) {
          this.state.pos = startPos;
          return "&";
        }

        return entity;
      } // Read a JSX identifier (valid tag or attribute name).
      //
      // Optimized version since JSX identifiers can"t contain
      // escape characters and so can be read as single slice.
      // Also assumes that first character was already checked
      // by isIdentifierStart in readToken.

    }, {
      key: "jsxReadWord",
      value: function jsxReadWord() {
        var ch;
        var start = this.state.pos;

        do {
          ch = this.input.charCodeAt(++this.state.pos);
        } while ((0, _identifier.isIdentifierChar)(ch) || ch === charCodes.dash);

        return this.finishToken(_types.types.jsxName, this.input.slice(start, this.state.pos));
      } // Parse next token as JSX identifier

    }, {
      key: "jsxParseIdentifier",
      value: function jsxParseIdentifier() {
        var node = this.startNode();

        if (this.match(_types.types.jsxName)) {
          node.name = this.state.value;
        } else if (this.state.type.keyword) {
          node.name = this.state.type.keyword;
        } else {
          this.unexpected();
        }

        this.next();
        return this.finishNode(node, "JSXIdentifier");
      } // Parse namespaced identifier.

    }, {
      key: "jsxParseNamespacedName",
      value: function jsxParseNamespacedName() {
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        var name = this.jsxParseIdentifier();
        if (!this.eat(_types.types.colon)) return name;
        var node = this.startNodeAt(startPos, startLoc);
        node.namespace = name;
        node.name = this.jsxParseIdentifier();
        return this.finishNode(node, "JSXNamespacedName");
      } // Parses element name in any form - namespaced, member
      // or single identifier.

    }, {
      key: "jsxParseElementName",
      value: function jsxParseElementName() {
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        var node = this.jsxParseNamespacedName();

        if (node.type === "JSXNamespacedName") {
          return node;
        }

        while (this.eat(_types.types.dot)) {
          var newNode = this.startNodeAt(startPos, startLoc);
          newNode.object = node;
          newNode.property = this.jsxParseIdentifier();
          node = this.finishNode(newNode, "JSXMemberExpression");
        }

        return node;
      } // Parses any type of JSX attribute value.

    }, {
      key: "jsxParseAttributeValue",
      value: function jsxParseAttributeValue() {
        var node;

        switch (this.state.type) {
          case _types.types.braceL:
            node = this.startNode();
            this.next();
            node = this.jsxParseExpressionContainer(node);

            if (node.expression.type === "JSXEmptyExpression") {
              this.raise(node.start, JsxErrors.AttributeIsEmpty);
            }

            return node;

          case _types.types.jsxTagStart:
          case _types.types.string:
            return this.parseExprAtom();

          default:
            throw this.raise(this.state.start, JsxErrors.UnsupportedJsxValue);
        }
      } // JSXEmptyExpression is unique type since it doesn't actually parse anything,
      // and so it should start at the end of last read token (left brace) and finish
      // at the beginning of the next one (right brace).

    }, {
      key: "jsxParseEmptyExpression",
      value: function jsxParseEmptyExpression() {
        var node = this.startNodeAt(this.state.lastTokEnd, this.state.lastTokEndLoc);
        return this.finishNodeAt(node, "JSXEmptyExpression", this.state.start, this.state.startLoc);
      } // Parse JSX spread child

    }, {
      key: "jsxParseSpreadChild",
      value: function jsxParseSpreadChild(node) {
        this.next(); // ellipsis

        node.expression = this.parseExpression();
        this.expect(_types.types.braceR);
        return this.finishNode(node, "JSXSpreadChild");
      } // Parses JSX expression enclosed into curly brackets.

    }, {
      key: "jsxParseExpressionContainer",
      value: function jsxParseExpressionContainer(node) {
        if (this.match(_types.types.braceR)) {
          node.expression = this.jsxParseEmptyExpression();
        } else {
          var expression = this.parseExpression();

          if (process.env.BABEL_8_BREAKING) {
            var _expression$extra;

            if (expression.type === "SequenceExpression" && !((_expression$extra = expression.extra) !== null && _expression$extra !== void 0 && _expression$extra.parenthesized)) {
              this.raise(expression.expressions[1].start, JsxErrors.UnexpectedSequenceExpression);
            }
          }

          node.expression = expression;
        }

        this.expect(_types.types.braceR);
        return this.finishNode(node, "JSXExpressionContainer");
      } // Parses following JSX attribute name-value pair.

    }, {
      key: "jsxParseAttribute",
      value: function jsxParseAttribute() {
        var node = this.startNode();

        if (this.eat(_types.types.braceL)) {
          this.expect(_types.types.ellipsis);
          node.argument = this.parseMaybeAssignAllowIn();
          this.expect(_types.types.braceR);
          return this.finishNode(node, "JSXSpreadAttribute");
        }

        node.name = this.jsxParseNamespacedName();
        node.value = this.eat(_types.types.eq) ? this.jsxParseAttributeValue() : null;
        return this.finishNode(node, "JSXAttribute");
      } // Parses JSX opening tag starting after "<".

    }, {
      key: "jsxParseOpeningElementAt",
      value: function jsxParseOpeningElementAt(startPos, startLoc) {
        var node = this.startNodeAt(startPos, startLoc);

        if (this.match(_types.types.jsxTagEnd)) {
          this.expect(_types.types.jsxTagEnd);
          return this.finishNode(node, "JSXOpeningFragment");
        }

        node.name = this.jsxParseElementName();
        return this.jsxParseOpeningElementAfterName(node);
      }
    }, {
      key: "jsxParseOpeningElementAfterName",
      value: function jsxParseOpeningElementAfterName(node) {
        var attributes = [];

        while (!this.match(_types.types.slash) && !this.match(_types.types.jsxTagEnd)) {
          attributes.push(this.jsxParseAttribute());
        }

        node.attributes = attributes;
        node.selfClosing = this.eat(_types.types.slash);
        this.expect(_types.types.jsxTagEnd);
        return this.finishNode(node, "JSXOpeningElement");
      } // Parses JSX closing tag starting after "</".

    }, {
      key: "jsxParseClosingElementAt",
      value: function jsxParseClosingElementAt(startPos, startLoc) {
        var node = this.startNodeAt(startPos, startLoc);

        if (this.match(_types.types.jsxTagEnd)) {
          this.expect(_types.types.jsxTagEnd);
          return this.finishNode(node, "JSXClosingFragment");
        }

        node.name = this.jsxParseElementName();
        this.expect(_types.types.jsxTagEnd);
        return this.finishNode(node, "JSXClosingElement");
      } // Parses entire JSX element, including it"s opening tag
      // (starting after "<"), attributes, contents and closing tag.

    }, {
      key: "jsxParseElementAt",
      value: function jsxParseElementAt(startPos, startLoc) {
        var node = this.startNodeAt(startPos, startLoc);
        var children = [];
        var openingElement = this.jsxParseOpeningElementAt(startPos, startLoc);
        var closingElement = null;

        if (!openingElement.selfClosing) {
          contents: for (;;) {
            switch (this.state.type) {
              case _types.types.jsxTagStart:
                startPos = this.state.start;
                startLoc = this.state.startLoc;
                this.next();

                if (this.eat(_types.types.slash)) {
                  closingElement = this.jsxParseClosingElementAt(startPos, startLoc);
                  break contents;
                }

                children.push(this.jsxParseElementAt(startPos, startLoc));
                break;

              case _types.types.jsxText:
                children.push(this.parseExprAtom());
                break;

              case _types.types.braceL:
                {
                  var _node = this.startNode();

                  this.next();

                  if (this.match(_types.types.ellipsis)) {
                    children.push(this.jsxParseSpreadChild(_node));
                  } else {
                    children.push(this.jsxParseExpressionContainer(_node));
                  }

                  break;
                }
              // istanbul ignore next - should never happen

              default:
                throw this.unexpected();
            }
          }

          if (isFragment(openingElement) && !isFragment(closingElement)) {
            this.raise( // $FlowIgnore
            closingElement.start, JsxErrors.MissingClosingTagFragment);
          } else if (!isFragment(openingElement) && isFragment(closingElement)) {
            this.raise( // $FlowIgnore
            closingElement.start, JsxErrors.MissingClosingTagElement, getQualifiedJSXName(openingElement.name));
          } else if (!isFragment(openingElement) && !isFragment(closingElement)) {
            if ( // $FlowIgnore
            getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
              this.raise( // $FlowIgnore
              closingElement.start, JsxErrors.MissingClosingTagElement, getQualifiedJSXName(openingElement.name));
            }
          }
        }

        if (isFragment(openingElement)) {
          node.openingFragment = openingElement;
          node.closingFragment = closingElement;
        } else {
          node.openingElement = openingElement;
          node.closingElement = closingElement;
        }

        node.children = children;

        if (this.isRelational("<")) {
          throw this.raise(this.state.start, JsxErrors.UnwrappedAdjacentJSXElements);
        }

        return isFragment(openingElement) ? this.finishNode(node, "JSXFragment") : this.finishNode(node, "JSXElement");
      } // Parses entire JSX element from current position.

    }, {
      key: "jsxParseElement",
      value: function jsxParseElement() {
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        this.next();
        return this.jsxParseElementAt(startPos, startLoc);
      } // ==================================
      // Overrides
      // ==================================

    }, {
      key: "parseExprAtom",
      value: function parseExprAtom(refExpressionErrors) {
        if (this.match(_types.types.jsxText)) {
          return this.parseLiteral(this.state.value, "JSXText");
        } else if (this.match(_types.types.jsxTagStart)) {
          return this.jsxParseElement();
        } else if (this.isRelational("<") && this.input.charCodeAt(this.state.pos) !== charCodes.exclamationMark) {
          // In case we encounter an lt token here it will always be the start of
          // jsx as the lt sign is not allowed in places that expect an expression
          this.finishToken(_types.types.jsxTagStart);
          return this.jsxParseElement();
        } else {
          return _get(_getPrototypeOf(_class.prototype), "parseExprAtom", this).call(this, refExpressionErrors);
        }
      }
    }, {
      key: "createLookaheadState",
      value: function createLookaheadState(state) {
        var lookaheadState = _get(_getPrototypeOf(_class.prototype), "createLookaheadState", this).call(this, state);

        lookaheadState.inPropertyName = state.inPropertyName;
        return lookaheadState;
      }
    }, {
      key: "getTokenFromCode",
      value: function getTokenFromCode(code) {
        if (this.state.inPropertyName) return _get(_getPrototypeOf(_class.prototype), "getTokenFromCode", this).call(this, code);
        var context = this.curContext();

        if (context === _context.types.j_expr) {
          return this.jsxReadToken();
        }

        if (context === _context.types.j_oTag || context === _context.types.j_cTag) {
          if ((0, _identifier.isIdentifierStart)(code)) {
            return this.jsxReadWord();
          }

          if (code === charCodes.greaterThan) {
            ++this.state.pos;
            return this.finishToken(_types.types.jsxTagEnd);
          }

          if ((code === charCodes.quotationMark || code === charCodes.apostrophe) && context === _context.types.j_oTag) {
            return this.jsxReadString(code);
          }
        }

        if (code === charCodes.lessThan && this.state.exprAllowed && this.input.charCodeAt(this.state.pos + 1) !== charCodes.exclamationMark) {
          ++this.state.pos;
          return this.finishToken(_types.types.jsxTagStart);
        }

        return _get(_getPrototypeOf(_class.prototype), "getTokenFromCode", this).call(this, code);
      }
    }, {
      key: "updateContext",
      value: function updateContext(prevType) {
        _get(_getPrototypeOf(_class.prototype), "updateContext", this).call(this, prevType);

        var _this$state = this.state,
            context = _this$state.context,
            type = _this$state.type;

        if (type === _types.types.slash && prevType === _types.types.jsxTagStart) {
          // do not consider JSX expr -> JSX open tag -> ... anymore
          // reconsider as closing tag context
          context.splice(-2, 2, _context.types.j_cTag);
          this.state.exprAllowed = false;
        } else if (type === _types.types.jsxTagEnd) {
          var out = context.pop();

          if (out === _context.types.j_oTag && prevType === _types.types.slash || out === _context.types.j_cTag) {
            context.pop();
            this.state.exprAllowed = context[context.length - 1] === _context.types.j_expr;
          } else {
            this.state.exprAllowed = true;
          }
        } else if (type.keyword && (prevType === _types.types.dot || prevType === _types.types.questionDot)) {
          this.state.exprAllowed = false;
        } else {
          this.state.exprAllowed = type.beforeExpr;
        }
      }
    }]);

    return _class;
  }(superClass);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL2pzeC9pbmRleC5qcyJdLCJuYW1lcyI6WyJIRVhfTlVNQkVSIiwiREVDSU1BTF9OVU1CRVIiLCJKc3hFcnJvcnMiLCJBdHRyaWJ1dGVJc0VtcHR5IiwiTWlzc2luZ0Nsb3NpbmdUYWdFbGVtZW50IiwiTWlzc2luZ0Nsb3NpbmdUYWdGcmFnbWVudCIsIlVuZXhwZWN0ZWRTZXF1ZW5jZUV4cHJlc3Npb24iLCJVbnN1cHBvcnRlZEpzeFZhbHVlIiwiVW50ZXJtaW5hdGVkSnN4Q29udGVudCIsIlVud3JhcHBlZEFkamFjZW50SlNYRWxlbWVudHMiLCJFcnJvckNvZGVzIiwiU3ludGF4RXJyb3IiLCJ0YyIsImpfb1RhZyIsIlRva0NvbnRleHQiLCJqX2NUYWciLCJqX2V4cHIiLCJ0dCIsImpzeE5hbWUiLCJUb2tlblR5cGUiLCJqc3hUZXh0IiwiYmVmb3JlRXhwciIsImpzeFRhZ1N0YXJ0Iiwic3RhcnRzRXhwciIsImpzeFRhZ0VuZCIsInVwZGF0ZUNvbnRleHQiLCJjb250ZXh0IiwicHVzaCIsImlzRnJhZ21lbnQiLCJvYmplY3QiLCJ0eXBlIiwiZ2V0UXVhbGlmaWVkSlNYTmFtZSIsIm5hbWUiLCJuYW1lc3BhY2UiLCJwcm9wZXJ0eSIsIkVycm9yIiwic3VwZXJDbGFzcyIsIm91dCIsImNodW5rU3RhcnQiLCJzdGF0ZSIsInBvcyIsImxlbmd0aCIsInJhaXNlIiwic3RhcnQiLCJjaCIsImlucHV0IiwiY2hhckNvZGVBdCIsImNoYXJDb2RlcyIsImxlc3NUaGFuIiwibGVmdEN1cmx5QnJhY2UiLCJleHByQWxsb3dlZCIsImZpbmlzaFRva2VuIiwic2xpY2UiLCJhbXBlcnNhbmQiLCJqc3hSZWFkRW50aXR5IiwiZ3JlYXRlclRoYW4iLCJyaWdodEN1cmx5QnJhY2UiLCJwcm9jZXNzIiwiZW52IiwiQkFCRUxfOF9CUkVBS0lORyIsImh0bWxFbnRpdHkiLCJjaGFyIiwiY29kZSIsInJlYXNvbkNvZGUiLCJ0ZW1wbGF0ZSIsImpzeFJlYWROZXdMaW5lIiwibm9ybWFsaXplQ1JMRiIsImNhcnJpYWdlUmV0dXJuIiwibGluZUZlZWQiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjdXJMaW5lIiwibGluZVN0YXJ0IiwicXVvdGUiLCJFcnJvcnMiLCJVbnRlcm1pbmF0ZWRTdHJpbmciLCJzdHJpbmciLCJzdHIiLCJjb3VudCIsImVudGl0eSIsInN0YXJ0UG9zIiwic3Vic3RyIiwidGVzdCIsImZyb21Db2RlUG9pbnQiLCJwYXJzZUludCIsIlhIVE1MRW50aXRpZXMiLCJkYXNoIiwibm9kZSIsInN0YXJ0Tm9kZSIsIm1hdGNoIiwidmFsdWUiLCJrZXl3b3JkIiwidW5leHBlY3RlZCIsIm5leHQiLCJmaW5pc2hOb2RlIiwic3RhcnRMb2MiLCJqc3hQYXJzZUlkZW50aWZpZXIiLCJlYXQiLCJjb2xvbiIsInN0YXJ0Tm9kZUF0IiwianN4UGFyc2VOYW1lc3BhY2VkTmFtZSIsImRvdCIsIm5ld05vZGUiLCJicmFjZUwiLCJqc3hQYXJzZUV4cHJlc3Npb25Db250YWluZXIiLCJleHByZXNzaW9uIiwicGFyc2VFeHByQXRvbSIsImxhc3RUb2tFbmQiLCJsYXN0VG9rRW5kTG9jIiwiZmluaXNoTm9kZUF0IiwicGFyc2VFeHByZXNzaW9uIiwiZXhwZWN0IiwiYnJhY2VSIiwianN4UGFyc2VFbXB0eUV4cHJlc3Npb24iLCJleHRyYSIsInBhcmVudGhlc2l6ZWQiLCJleHByZXNzaW9ucyIsImVsbGlwc2lzIiwiYXJndW1lbnQiLCJwYXJzZU1heWJlQXNzaWduQWxsb3dJbiIsImVxIiwianN4UGFyc2VBdHRyaWJ1dGVWYWx1ZSIsImpzeFBhcnNlRWxlbWVudE5hbWUiLCJqc3hQYXJzZU9wZW5pbmdFbGVtZW50QWZ0ZXJOYW1lIiwiYXR0cmlidXRlcyIsInNsYXNoIiwianN4UGFyc2VBdHRyaWJ1dGUiLCJzZWxmQ2xvc2luZyIsImNoaWxkcmVuIiwib3BlbmluZ0VsZW1lbnQiLCJqc3hQYXJzZU9wZW5pbmdFbGVtZW50QXQiLCJjbG9zaW5nRWxlbWVudCIsImNvbnRlbnRzIiwianN4UGFyc2VDbG9zaW5nRWxlbWVudEF0IiwianN4UGFyc2VFbGVtZW50QXQiLCJqc3hQYXJzZVNwcmVhZENoaWxkIiwib3BlbmluZ0ZyYWdtZW50IiwiY2xvc2luZ0ZyYWdtZW50IiwiaXNSZWxhdGlvbmFsIiwicmVmRXhwcmVzc2lvbkVycm9ycyIsInBhcnNlTGl0ZXJhbCIsImpzeFBhcnNlRWxlbWVudCIsImV4Y2xhbWF0aW9uTWFyayIsImxvb2thaGVhZFN0YXRlIiwiaW5Qcm9wZXJ0eU5hbWUiLCJjdXJDb250ZXh0IiwianN4UmVhZFRva2VuIiwianN4UmVhZFdvcmQiLCJxdW90YXRpb25NYXJrIiwiYXBvc3Ryb3BoZSIsImpzeFJlYWRTdHJpbmciLCJwcmV2VHlwZSIsInNwbGljZSIsInBvcCIsInF1ZXN0aW9uRG90Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFLQTs7QUFFQTs7QUFHQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQSxJQUFNQSxVQUFVLEdBQUcsZUFBbkI7QUFDQSxJQUFNQyxjQUFjLEdBQUcsT0FBdkI7QUFFQTs7QUFDQSxJQUFNQyxTQUFTLEdBQUcsK0JBQ2hCO0FBQ0VDLEVBQUFBLGdCQUFnQixFQUNkLDhEQUZKO0FBR0VDLEVBQUFBLHdCQUF3QixFQUN0QixrREFKSjtBQUtFQyxFQUFBQSx5QkFBeUIsRUFBRSxnREFMN0I7QUFNRUMsRUFBQUEsNEJBQTRCLEVBQzFCLDBHQVBKO0FBUUVDLEVBQUFBLG1CQUFtQixFQUNqQixnRUFUSjtBQVVFQyxFQUFBQSxzQkFBc0IsRUFBRSw0QkFWMUI7QUFXRUMsRUFBQUEsNEJBQTRCLEVBQzFCO0FBWkosQ0FEZ0I7QUFlaEI7QUFBV0Msa0JBQVdDLFdBZk4sQ0FBbEI7QUFpQkE7QUFFQTtBQUNBOztBQUNBQyxlQUFHQyxNQUFILEdBQVksSUFBSUMsbUJBQUosQ0FBZSxNQUFmLENBQVo7QUFDQUYsZUFBR0csTUFBSCxHQUFZ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Q0wsZUFBS1gsS0FBTCxDQUFXVyxXQUFYLEdBQXlCcEIsSUFBSSxDQUFDVCxVQUE5QjtBQUNEO0FBQ0Y7QUFsaUJVOztBQUFBO0FBQUEsSUFDQ2UsVUFERDtBQUFBLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4vLyBFcnJvciBtZXNzYWdlcyBhcmUgY29sb2NhdGVkIHdpdGggdGhlIHBsdWdpbi5cbi8qIGVzbGludC1kaXNhYmxlIEBiYWJlbC9kZXZlbG9wbWVudC1pbnRlcm5hbC9kcnktZXJyb3ItbWVzc2FnZXMgKi9cblxuaW1wb3J0ICogYXMgY2hhckNvZGVzIGZyb20gXCJjaGFyY29kZXNcIjtcblxuaW1wb3J0IFhIVE1MRW50aXRpZXMgZnJvbSBcIi4veGh0bWxcIjtcbmltcG9ydCB0eXBlIFBhcnNlciBmcm9tIFwiLi4vLi4vcGFyc2VyXCI7XG5pbXBvcnQgdHlwZSB7IEV4cHJlc3Npb25FcnJvcnMgfSBmcm9tIFwiLi4vLi4vcGFyc2VyL3V0aWxcIjtcbmltcG9ydCB7IFRva2VuVHlwZSwgdHlwZXMgYXMgdHQgfSBmcm9tIFwiLi4vLi4vdG9rZW5pemVyL3R5cGVzXCI7XG5pbXBvcnQgeyBUb2tDb250ZXh0LCB0eXBlcyBhcyB0YyB9IGZyb20gXCIuLi8uLi90b2tlbml6ZXIvY29udGV4dFwiO1xuaW1wb3J0ICogYXMgTiBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcbmltcG9ydCB7IGlzSWRlbnRpZmllckNoYXIsIGlzSWRlbnRpZmllclN0YXJ0IH0gZnJvbSBcIi4uLy4uL3V0aWwvaWRlbnRpZmllclwiO1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiB9IGZyb20gXCIuLi8uLi91dGlsL2xvY2F0aW9uXCI7XG5pbXBvcnQgeyBpc05ld0xpbmUgfSBmcm9tIFwiLi4vLi4vdXRpbC93aGl0ZXNwYWNlXCI7XG5pbXBvcnQgeyBFcnJvcnMsIG1ha2VFcnJvclRlbXBsYXRlcywgRXJyb3JDb2RlcyB9IGZyb20gXCIuLi8uLi9wYXJzZXIvZXJyb3JcIjtcbmltcG9ydCB0eXBlIHsgTG9va2FoZWFkU3RhdGUgfSBmcm9tIFwiLi4vLi4vdG9rZW5pemVyL3N0YXRlXCI7XG5pbXBvcnQgU3RhdGUgZnJvbSBcIi4uLy4uL3Rva2VuaXplci9zdGF0ZVwiO1xuXG50eXBlIEpTWExvb2thaGVhZFN0YXRlID0gTG9va2FoZWFkU3RhdGUgJiB7IGluUHJvcGVydHlOYW1lOiBib29sZWFuIH07XG5cbmNvbnN0IEhFWF9OVU1CRVIgPSAvXltcXGRhLWZBLUZdKyQvO1xuY29uc3QgREVDSU1BTF9OVU1CRVIgPSAvXlxcZCskLztcblxuLyogZXNsaW50IHNvcnQta2V5czogXCJlcnJvclwiICovXG5jb25zdCBKc3hFcnJvcnMgPSBtYWtlRXJyb3JUZW1wbGF0ZXMoXG4gIHtcbiAgICBBdHRyaWJ1dGVJc0VtcHR5OlxuICAgICAgXCJKU1ggYXR0cmlidXRlcyBtdXN0IG9ubHkgYmUgYXNzaWduZWQgYSBub24tZW1wdHkgZXhwcmVzc2lvbi5cIixcbiAgICBNaXNzaW5nQ2xvc2luZ1RhZ0VsZW1lbnQ6XG4gICAgICBcIkV4cGVjdGVkIGNvcnJlc3BvbmRpbmcgSlNYIGNsb3NpbmcgdGFnIGZvciA8JTA+LlwiLFxuICAgIE1pc3NpbmdDbG9zaW5nVGFnRnJhZ21lbnQ6IFwiRXhwZWN0ZWQgY29ycmVzcG9uZGluZyBKU1ggY2xvc2luZyB0YWcgZm9yIDw+LlwiLFxuICAgIFVuZXhwZWN0ZWRTZXF1ZW5jZUV4cHJlc3Npb246XG4gICAgICBcIlNlcXVlbmNlIGV4cHJlc3Npb25zIGNhbm5vdCBiZSBkaXJlY3RseSBuZXN0ZWQgaW5zaWRlIEpTWC4gRGlkIHlvdSBtZWFuIHRvIHdyYXAgaXQgaW4gcGFyZW50aGVzZXMgKC4uLik/XCIsXG4gICAgVW5zdXBwb3J0ZWRKc3hWYWx1ZTpcbiAgICAgIFwiSlNYIHZhbHVlIHNob3VsZCBiZSBlaXRoZXIgYW4gZXhwcmVzc2lvbiBvciBhIHF1b3RlZCBKU1ggdGV4dC5cIixcbiAgICBVbnRlcm1pbmF0ZWRKc3hDb250ZW50OiBcIlVudGVybWluYXRlZCBKU1ggY29udGVudHMuXCIsXG4gICAgVW53cmFwcGVkQWRqYWNlbnRKU1hFbGVtZW50czpcbiAgICAgIFwiQWRqYWNlbnQgSlNYIGVsZW1lbnRzIG11c3QgYmUgd3JhcHBlZCBpbiBhbiBlbmNsb3NpbmcgdGFnLiBEaWQgeW91IHdhbnQgYSBKU1ggZnJhZ21lbnQgPD4uLi48Lz4/XCIsXG4gIH0sXG4gIC8qIGNvZGUgKi8gRXJyb3JDb2Rlcy5TeW50YXhFcnJvcixcbik7XG4vKiBlc2xpbnQtZGlzYWJsZSBzb3J0LWtleXMgKi9cblxuLy8gQmUgYXdhcmUgdGhhdCB0aGlzIGZpbGUgaXMgYWx3YXlzIGV4ZWN1dGVkIGFuZCBub3Qgb25seSB3aGVuIHRoZSBwbHVnaW4gaXMgZW5hYmxlZC5cbi8vIFRoZXJlZm9yZSB0aGlzIGNvbnRleHRzIGFuZCB0b2tlbnMgZG8gYWx3YXlzIGV4aXN0LlxudGMual9vVGFnID0gbmV3IFRva0NvbnRleHQoXCI8dGFnXCIpO1xudGMual9jVGFnID0gbmV3IFRva0NvbnRleHQoXCI8L3RhZ1wiKTtcbnRjLmpfZXhwciA9IG5ldyBUb2tDb250ZXh0KFwiPHRhZz4uLi48L3RhZz5cIiwgdHJ1ZSk7XG5cbnR0LmpzeE5hbWUgPSBuZXcgVG9rZW5UeXBlKFwianN4TmFtZVwiKTtcbnR0LmpzeFRleHQgPSBuZXcgVG9rZW5UeXBlKFwianN4VGV4dFwiLCB7IGJlZm9yZUV4cHI6IHRydWUgfSk7XG50dC5qc3hUYWdTdGFydCA9IG5ldyBUb2tlblR5cGUoXCJqc3hUYWdTdGFydFwiLCB7IHN0YXJ0c0V4cHI6IHRydWUgfSk7XG50dC5qc3hUYWdFbmQgPSBuZXcgVG9rZW5UeXBlKFwianN4VGFnRW5kXCIpO1xuXG50dC5qc3hUYWdTdGFydC51cGRhdGVDb250ZXh0ID0gY29udGV4dCA9PiB7XG4gIGNvbnRleHQucHVzaChcbiAgICB0Yy5qX2V4cHIsIC8vIHRyZWF0IGFzIGJlZ2lubmluZyBvZiBKU1ggZXhwcmVzc2lvblxuICAgIHRjLmpfb1RhZywgLy8gc3RhcnQgb3BlbmluZyB0YWcgY29udGV4dFxuICApO1xufTtcblxuZnVuY3Rpb24gaXNGcmFnbWVudChvYmplY3Q6ID9OLkpTWEVsZW1lbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIG9iamVjdFxuICAgID8gb2JqZWN0LnR5cGUgPT09IFwiSlNYT3BlbmluZ0ZyYWdtZW50XCIgfHxcbiAgICAgICAgb2JqZWN0LnR5cGUgPT09IFwiSlNYQ2xvc2luZ0ZyYWdtZW50XCJcbiAgICA6IGZhbHNlO1xufVxuXG4vLyBUcmFuc2Zvcm1zIEpTWCBlbGVtZW50IG5hbWUgdG8gc3RyaW5nLlxuXG5mdW5jdGlvbiBnZXRRdWFsaWZpZWRKU1hOYW1lKFxuICBvYmplY3Q6IE4uSlNYSWRlbnRpZmllciB8IE4uSlNYTmFtZXNwYWNlZE5hbWUgfCBOLkpTWE1lbWJlckV4cHJlc3Npb24sXG4pOiBzdHJpbmcge1xuICBpZiAob2JqZWN0LnR5cGUgPT09IFwiSlNYSWRlbnRpZmllclwiKSB7XG4gICAgcmV0dXJuIG9iamVjdC5uYW1lO1xuICB9XG5cbiAgaWYgKG9iamVjdC50eXBlID09PSBcIkpTWE5hbWVzcGFjZWROYW1lXCIpIHtcbiAgICByZXR1cm4gb2JqZWN0Lm5hbWVzcGFjZS5uYW1lICsgXCI6XCIgKyBvYmplY3QubmFtZS5uYW1lO1xuICB9XG5cbiAgaWYgKG9iamVjdC50eXBlID09PSBcIkpTWE1lbWJlckV4cHJlc3Npb25cIikge1xuICAgIHJldHVybiAoXG4gICAgICBnZXRRdWFsaWZpZWRKU1hOYW1lKG9iamVjdC5vYmplY3QpICtcbiAgICAgIFwiLlwiICtcbiAgICAgIGdldFF1YWxpZmllZEpTWE5hbWUob2JqZWN0LnByb3BlcnR5KVxuICAgICk7XG4gIH1cblxuICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICB0aHJvdyBuZXcgRXJyb3IoXCJOb2RlIGhhZCB1bmV4cGVjdGVkIHR5cGU6IFwiICsgb2JqZWN0LnR5cGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCAoc3VwZXJDbGFzczogQ2xhc3M8UGFyc2VyPik6IENsYXNzPFBhcnNlcj4gPT5cbiAgY2xhc3MgZXh0ZW5kcyBzdXBlckNsYXNzIHtcbiAgICAvLyBSZWFkcyBpbmxpbmUgSlNYIGNvbnRlbnRzIHRva2VuLlxuXG4gICAganN4UmVhZFRva2VuKCk6IHZvaWQge1xuICAgICAgbGV0IG91dCA9IFwiXCI7XG4gICAgICBsZXQgY2h1bmtTdGFydCA9IHRoaXMuc3RhdGUucG9zO1xuICAgICAgZm9yICg7Oykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5wb3MgPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQsIEpzeEVycm9ycy5VbnRlcm1pbmF0ZWRKc3hDb250ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zKTtcblxuICAgICAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgICAgY2FzZSBjaGFyQ29kZXMubGVzc1RoYW46XG4gICAgICAgICAgY2FzZSBjaGFyQ29kZXMubGVmdEN1cmx5QnJhY2U6XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5wb3MgPT09IHRoaXMuc3RhdGUuc3RhcnQpIHtcbiAgICAgICAgICAgICAgaWYgKGNoID09PSBjaGFyQ29kZXMubGVzc1RoYW4gJiYgdGhpcy5zdGF0ZS5leHByQWxsb3dlZCkge1xuICAgICAgICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoVG9rZW4odHQuanN4VGFnU3RhcnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBzdXBlci5nZXRUb2tlbkZyb21Db2RlKGNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG91dCArPSB0aGlzLmlucHV0LnNsaWNlKGNodW5rU3RhcnQsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaFRva2VuKHR0LmpzeFRleHQsIG91dCk7XG5cbiAgICAgICAgICBjYXNlIGNoYXJDb2Rlcy5hbXBlcnNhbmQ6XG4gICAgICAgICAgICBvdXQgKz0gdGhpcy5pbnB1dC5zbGljZShjaHVua1N0YXJ0LCB0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgICAgICBvdXQgKz0gdGhpcy5qc3hSZWFkRW50aXR5KCk7XG4gICAgICAgICAgICBjaHVua1N0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgY2hhckNvZGVzLmdyZWF0ZXJUaGFuOlxuICAgICAgICAgIGNhc2UgY2hhckNvZGVzLnJpZ2h0Q3VybHlCcmFjZTpcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5CQUJFTF84X0JSRUFLSU5HKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGh0bWxFbnRpdHkgPVxuICAgICAgICAgICAgICAgIGNoID09PSBjaGFyQ29kZXMucmlnaHRDdXJseUJyYWNlID8gXCImcmJyYWNlO1wiIDogXCImZ3Q7XCI7XG4gICAgICAgICAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLmlucHV0W3RoaXMuc3RhdGUucG9zXTtcbiAgICAgICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywge1xuICAgICAgICAgICAgICAgIGNvZGU6IEVycm9yQ29kZXMuU3ludGF4RXJyb3IsXG4gICAgICAgICAgICAgICAgcmVhc29uQ29kZTogXCJVbmV4cGVjdGVkVG9rZW5cIixcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogYFVuZXhwZWN0ZWQgdG9rZW4gXFxgJHtjaGFyfVxcYC4gRGlkIHlvdSBtZWFuIFxcYCR7aHRtbEVudGl0eX1cXGAgb3IgXFxgeycke2NoYXJ9J31cXGA/YCxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGlmIChpc05ld0xpbmUoY2gpKSB7XG4gICAgICAgICAgICAgIG91dCArPSB0aGlzLmlucHV0LnNsaWNlKGNodW5rU3RhcnQsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICAgICAgb3V0ICs9IHRoaXMuanN4UmVhZE5ld0xpbmUodHJ1ZSk7XG4gICAgICAgICAgICAgIGNodW5rU3RhcnQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBqc3hSZWFkTmV3TGluZShub3JtYWxpemVDUkxGOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IGNoID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zKTtcbiAgICAgIGxldCBvdXQ7XG4gICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgaWYgKFxuICAgICAgICBjaCA9PT0gY2hhckNvZGVzLmNhcnJpYWdlUmV0dXJuICYmXG4gICAgICAgIHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcykgPT09IGNoYXJDb2Rlcy5saW5lRmVlZFxuICAgICAgKSB7XG4gICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIG91dCA9IG5vcm1hbGl6ZUNSTEYgPyBcIlxcblwiIDogXCJcXHJcXG5cIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpO1xuICAgICAgfVxuICAgICAgKyt0aGlzLnN0YXRlLmN1ckxpbmU7XG4gICAgICB0aGlzLnN0YXRlLmxpbmVTdGFydCA9IHRoaXMuc3RhdGUucG9zO1xuXG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGpzeFJlYWRTdHJpbmcocXVvdGU6IG51bWJlcik6IHZvaWQge1xuICAgICAgbGV0IG91dCA9IFwiXCI7XG4gICAgICBsZXQgY2h1bmtTdGFydCA9ICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICBmb3IgKDs7KSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnBvcyA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlVudGVybWluYXRlZFN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgIGlmIChjaCA9PT0gcXVvdGUpIGJyZWFrO1xuICAgICAgICBpZiAoY2ggPT09IGNoYXJDb2Rlcy5hbXBlcnNhbmQpIHtcbiAgICAgICAgICBvdXQgKz0gdGhpcy5pbnB1dC5zbGljZShjaHVua1N0YXJ0LCB0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgICAgb3V0ICs9IHRoaXMuanN4UmVhZEVudGl0eSgpO1xuICAgICAgICAgIGNodW5rU3RhcnQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgfSBlbHNlIGlmIChpc05ld0xpbmUoY2gpKSB7XG4gICAgICAgICAgb3V0ICs9IHRoaXMuaW5wdXQuc2xpY2UoY2h1bmtTdGFydCwgdGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgICAgIG91dCArPSB0aGlzLmpzeFJlYWROZXdMaW5lKGZhbHNlKTtcbiAgICAgICAgICBjaHVua1N0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3V0ICs9IHRoaXMuaW5wdXQuc2xpY2UoY2h1bmtTdGFydCwgdGhpcy5zdGF0ZS5wb3MrKyk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hUb2tlbih0dC5zdHJpbmcsIG91dCk7XG4gICAgfVxuXG4gICAganN4UmVhZEVudGl0eSgpOiBzdHJpbmcge1xuICAgICAgbGV0IHN0ciA9IFwiXCI7XG4gICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgbGV0IGVudGl0eTtcbiAgICAgIGxldCBjaCA9IHRoaXMuaW5wdXRbdGhpcy5zdGF0ZS5wb3NdO1xuXG4gICAgICBjb25zdCBzdGFydFBvcyA9ICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICB3aGlsZSAodGhpcy5zdGF0ZS5wb3MgPCB0aGlzLmxlbmd0aCAmJiBjb3VudCsrIDwgMTApIHtcbiAgICAgICAgY2ggPSB0aGlzLmlucHV0W3RoaXMuc3RhdGUucG9zKytdO1xuICAgICAgICBpZiAoY2ggPT09IFwiO1wiKSB7XG4gICAgICAgICAgaWYgKHN0clswXSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgIGlmIChzdHJbMV0gPT09IFwieFwiKSB7XG4gICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMik7XG4gICAgICAgICAgICAgIGlmIChIRVhfTlVNQkVSLnRlc3Qoc3RyKSkge1xuICAgICAgICAgICAgICAgIGVudGl0eSA9IFN0cmluZy5mcm9tQ29kZVBvaW50KHBhcnNlSW50KHN0ciwgMTYpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgaWYgKERFQ0lNQUxfTlVNQkVSLnRlc3Qoc3RyKSkge1xuICAgICAgICAgICAgICAgIGVudGl0eSA9IFN0cmluZy5mcm9tQ29kZVBvaW50KHBhcnNlSW50KHN0ciwgMTApKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbnRpdHkgPSBYSFRNTEVudGl0aWVzW3N0cl07XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHN0ciArPSBjaDtcbiAgICAgIH1cbiAgICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHRoaXMuc3RhdGUucG9zID0gc3RhcnRQb3M7XG4gICAgICAgIHJldHVybiBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbnRpdHk7XG4gICAgfVxuXG4gICAgLy8gUmVhZCBhIEpTWCBpZGVudGlmaWVyICh2YWxpZCB0YWcgb3IgYXR0cmlidXRlIG5hbWUpLlxuICAgIC8vXG4gICAgLy8gT3B0aW1pemVkIHZlcnNpb24gc2luY2UgSlNYIGlkZW50aWZpZXJzIGNhblwidCBjb250YWluXG4gICAgLy8gZXNjYXBlIGNoYXJhY3RlcnMgYW5kIHNvIGNhbiBiZSByZWFkIGFzIHNpbmdsZSBzbGljZS5cbiAgICAvLyBBbHNvIGFzc3VtZXMgdGhhdCBmaXJzdCBjaGFyYWN0ZXIgd2FzIGFscmVhZHkgY2hlY2tlZFxuICAgIC8vIGJ5IGlzSWRlbnRpZmllclN0YXJ0IGluIHJlYWRUb2tlbi5cblxuICAgIGpzeFJlYWRXb3JkKCk6IHZvaWQge1xuICAgICAgbGV0IGNoO1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICAgIGRvIHtcbiAgICAgICAgY2ggPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQoKyt0aGlzLnN0YXRlLnBvcyk7XG4gICAgICB9IHdoaWxlIChpc0lkZW50aWZpZXJDaGFyKGNoKSB8fCBjaCA9PT0gY2hhckNvZGVzLmRhc2gpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoVG9rZW4oXG4gICAgICAgIHR0LmpzeE5hbWUsXG4gICAgICAgIHRoaXMuaW5wdXQuc2xpY2Uoc3RhcnQsIHRoaXMuc3RhdGUucG9zKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgbmV4dCB0b2tlbiBhcyBKU1ggaWRlbnRpZmllclxuXG4gICAganN4UGFyc2VJZGVudGlmaWVyKCk6IE4uSlNYSWRlbnRpZmllciB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmpzeE5hbWUpKSB7XG4gICAgICAgIG5vZGUubmFtZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudHlwZS5rZXl3b3JkKSB7XG4gICAgICAgIG5vZGUubmFtZSA9IHRoaXMuc3RhdGUudHlwZS5rZXl3b3JkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICB9XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJKU1hJZGVudGlmaWVyXCIpO1xuICAgIH1cblxuICAgIC8vIFBhcnNlIG5hbWVzcGFjZWQgaWRlbnRpZmllci5cblxuICAgIGpzeFBhcnNlTmFtZXNwYWNlZE5hbWUoKTogTi5KU1hOYW1lc3BhY2VkTmFtZSB7XG4gICAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgICBjb25zdCBuYW1lID0gdGhpcy5qc3hQYXJzZUlkZW50aWZpZXIoKTtcbiAgICAgIGlmICghdGhpcy5lYXQodHQuY29sb24pKSByZXR1cm4gbmFtZTtcblxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICAgIG5vZGUubmFtZXNwYWNlID0gbmFtZTtcbiAgICAgIG5vZGUubmFtZSA9IHRoaXMuanN4UGFyc2VJZGVudGlmaWVyKCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiSlNYTmFtZXNwYWNlZE5hbWVcIik7XG4gICAgfVxuXG4gICAgLy8gUGFyc2VzIGVsZW1lbnQgbmFtZSBpbiBhbnkgZm9ybSAtIG5hbWVzcGFjZWQsIG1lbWJlclxuICAgIC8vIG9yIHNpbmdsZSBpZGVudGlmaWVyLlxuXG4gICAganN4UGFyc2VFbGVtZW50TmFtZSgpOlxuICAgICAgfCBOLkpTWElkZW50aWZpZXJcbiAgICAgIHwgTi5KU1hOYW1lc3BhY2VkTmFtZVxuICAgICAgfCBOLkpTWE1lbWJlckV4cHJlc3Npb24ge1xuICAgICAgY29uc3Qgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgY29uc3Qgc3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgICAgbGV0IG5vZGUgPSB0aGlzLmpzeFBhcnNlTmFtZXNwYWNlZE5hbWUoKTtcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiSlNYTmFtZXNwYWNlZE5hbWVcIikge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICh0aGlzLmVhdCh0dC5kb3QpKSB7XG4gICAgICAgIGNvbnN0IG5ld05vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICAgIG5ld05vZGUub2JqZWN0ID0gbm9kZTtcbiAgICAgICAgbmV3Tm9kZS5wcm9wZXJ0eSA9IHRoaXMuanN4UGFyc2VJZGVudGlmaWVyKCk7XG4gICAgICAgIG5vZGUgPSB0aGlzLmZpbmlzaE5vZGUobmV3Tm9kZSwgXCJKU1hNZW1iZXJFeHByZXNzaW9uXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgLy8gUGFyc2VzIGFueSB0eXBlIG9mIEpTWCBhdHRyaWJ1dGUgdmFsdWUuXG5cbiAgICBqc3hQYXJzZUF0dHJpYnV0ZVZhbHVlKCk6IE4uRXhwcmVzc2lvbiB7XG4gICAgICBsZXQgbm9kZTtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS50eXBlKSB7XG4gICAgICAgIGNhc2UgdHQuYnJhY2VMOlxuICAgICAgICAgIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgIG5vZGUgPSB0aGlzLmpzeFBhcnNlRXhwcmVzc2lvbkNvbnRhaW5lcihub2RlKTtcbiAgICAgICAgICBpZiAobm9kZS5leHByZXNzaW9uLnR5cGUgPT09IFwiSlNYRW1wdHlFeHByZXNzaW9uXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgSnN4RXJyb3JzLkF0dHJpYnV0ZUlzRW1wdHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbm9kZTtcblxuICAgICAgICBjYXNlIHR0LmpzeFRhZ1N0YXJ0OlxuICAgICAgICBjYXNlIHR0LnN0cmluZzpcbiAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUV4cHJBdG9tKCk7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQsIEpzeEVycm9ycy5VbnN1cHBvcnRlZEpzeFZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBKU1hFbXB0eUV4cHJlc3Npb24gaXMgdW5pcXVlIHR5cGUgc2luY2UgaXQgZG9lc24ndCBhY3R1YWxseSBwYXJzZSBhbnl0aGluZyxcbiAgICAvLyBhbmQgc28gaXQgc2hvdWxkIHN0YXJ0IGF0IHRoZSBlbmQgb2YgbGFzdCByZWFkIHRva2VuIChsZWZ0IGJyYWNlKSBhbmQgZmluaXNoXG4gICAgLy8gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbmV4dCBvbmUgKHJpZ2h0IGJyYWNlKS5cblxuICAgIGpzeFBhcnNlRW1wdHlFeHByZXNzaW9uKCk6IE4uSlNYRW1wdHlFeHByZXNzaW9uIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KFxuICAgICAgICB0aGlzLnN0YXRlLmxhc3RUb2tFbmQsXG4gICAgICAgIHRoaXMuc3RhdGUubGFzdFRva0VuZExvYyxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlQXQoXG4gICAgICAgIG5vZGUsXG4gICAgICAgIFwiSlNYRW1wdHlFeHByZXNzaW9uXCIsXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQsXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnRMb2MsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFBhcnNlIEpTWCBzcHJlYWQgY2hpbGRcblxuICAgIGpzeFBhcnNlU3ByZWFkQ2hpbGQobm9kZTogTi5KU1hTcHJlYWRDaGlsZCk6IE4uSlNYU3ByZWFkQ2hpbGQge1xuICAgICAgdGhpcy5uZXh0KCk7IC8vIGVsbGlwc2lzXG4gICAgICBub2RlLmV4cHJlc3Npb24gPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VSKTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkpTWFNwcmVhZENoaWxkXCIpO1xuICAgIH1cblxuICAgIC8vIFBhcnNlcyBKU1ggZXhwcmVzc2lvbiBlbmNsb3NlZCBpbnRvIGN1cmx5IGJyYWNrZXRzLlxuXG4gICAganN4UGFyc2VFeHByZXNzaW9uQ29udGFpbmVyKFxuICAgICAgbm9kZTogTi5KU1hFeHByZXNzaW9uQ29udGFpbmVyLFxuICAgICk6IE4uSlNYRXhwcmVzc2lvbkNvbnRhaW5lciB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5icmFjZVIpKSB7XG4gICAgICAgIG5vZGUuZXhwcmVzc2lvbiA9IHRoaXMuanN4UGFyc2VFbXB0eUV4cHJlc3Npb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5CQUJFTF84X0JSRUFLSU5HKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZXhwcmVzc2lvbi50eXBlID09PSBcIlNlcXVlbmNlRXhwcmVzc2lvblwiICYmXG4gICAgICAgICAgICAhZXhwcmVzc2lvbi5leHRyYT8ucGFyZW50aGVzaXplZFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbi5leHByZXNzaW9uc1sxXS5zdGFydCxcbiAgICAgICAgICAgICAgSnN4RXJyb3JzLlVuZXhwZWN0ZWRTZXF1ZW5jZUV4cHJlc3Npb24sXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XG4gICAgICB9XG4gICAgICB0aGlzLmV4cGVjdCh0dC5icmFjZVIpO1xuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiSlNYRXhwcmVzc2lvbkNvbnRhaW5lclwiKTtcbiAgICB9XG5cbiAgICAvLyBQYXJzZXMgZm9sbG93aW5nIEpTWCBhdHRyaWJ1dGUgbmFtZS12YWx1ZSBwYWlyLlxuXG4gICAganN4UGFyc2VBdHRyaWJ1dGUoKTogTi5KU1hBdHRyaWJ1dGUge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBpZiAodGhpcy5lYXQodHQuYnJhY2VMKSkge1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5lbGxpcHNpcyk7XG4gICAgICAgIG5vZGUuYXJndW1lbnQgPSB0aGlzLnBhcnNlTWF5YmVBc3NpZ25BbGxvd0luKCk7XG4gICAgICAgIHRoaXMuZXhwZWN0KHR0LmJyYWNlUik7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJKU1hTcHJlYWRBdHRyaWJ1dGVcIik7XG4gICAgICB9XG4gICAgICBub2RlLm5hbWUgPSB0aGlzLmpzeFBhcnNlTmFtZXNwYWNlZE5hbWUoKTtcbiAgICAgIG5vZGUudmFsdWUgPSB0aGlzLmVhdCh0dC5lcSkgPyB0aGlzLmpzeFBhcnNlQXR0cmlidXRlVmFsdWUoKSA6IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiSlNYQXR0cmlidXRlXCIpO1xuICAgIH1cblxuICAgIC8vIFBhcnNlcyBKU1ggb3BlbmluZyB0YWcgc3RhcnRpbmcgYWZ0ZXIgXCI8XCIuXG5cbiAgICBqc3hQYXJzZU9wZW5pbmdFbGVtZW50QXQoXG4gICAgICBzdGFydFBvczogbnVtYmVyLFxuICAgICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgICk6IE4uSlNYT3BlbmluZ0VsZW1lbnQge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmpzeFRhZ0VuZCkpIHtcbiAgICAgICAgdGhpcy5leHBlY3QodHQuanN4VGFnRW5kKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkpTWE9wZW5pbmdGcmFnbWVudFwiKTtcbiAgICAgIH1cbiAgICAgIG5vZGUubmFtZSA9IHRoaXMuanN4UGFyc2VFbGVtZW50TmFtZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuanN4UGFyc2VPcGVuaW5nRWxlbWVudEFmdGVyTmFtZShub2RlKTtcbiAgICB9XG5cbiAgICBqc3hQYXJzZU9wZW5pbmdFbGVtZW50QWZ0ZXJOYW1lKFxuICAgICAgbm9kZTogTi5KU1hPcGVuaW5nRWxlbWVudCxcbiAgICApOiBOLkpTWE9wZW5pbmdFbGVtZW50IHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXM6IE4uSlNYQXR0cmlidXRlW10gPSBbXTtcbiAgICAgIHdoaWxlICghdGhpcy5tYXRjaCh0dC5zbGFzaCkgJiYgIXRoaXMubWF0Y2godHQuanN4VGFnRW5kKSkge1xuICAgICAgICBhdHRyaWJ1dGVzLnB1c2godGhpcy5qc3hQYXJzZUF0dHJpYnV0ZSgpKTtcbiAgICAgIH1cbiAgICAgIG5vZGUuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICBub2RlLnNlbGZDbG9zaW5nID0gdGhpcy5lYXQodHQuc2xhc2gpO1xuICAgICAgdGhpcy5leHBlY3QodHQuanN4VGFnRW5kKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJKU1hPcGVuaW5nRWxlbWVudFwiKTtcbiAgICB9XG5cbiAgICAvLyBQYXJzZXMgSlNYIGNsb3NpbmcgdGFnIHN0YXJ0aW5nIGFmdGVyIFwiPC9cIi5cblxuICAgIGpzeFBhcnNlQ2xvc2luZ0VsZW1lbnRBdChcbiAgICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgICBzdGFydExvYzogUG9zaXRpb24sXG4gICAgKTogTi5KU1hDbG9zaW5nRWxlbWVudCB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuanN4VGFnRW5kKSkge1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5qc3hUYWdFbmQpO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiSlNYQ2xvc2luZ0ZyYWdtZW50XCIpO1xuICAgICAgfVxuICAgICAgbm9kZS5uYW1lID0gdGhpcy5qc3hQYXJzZUVsZW1lbnROYW1lKCk7XG4gICAgICB0aGlzLmV4cGVjdCh0dC5qc3hUYWdFbmQpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkpTWENsb3NpbmdFbGVtZW50XCIpO1xuICAgIH1cblxuICAgIC8vIFBhcnNlcyBlbnRpcmUgSlNYIGVsZW1lbnQsIGluY2x1ZGluZyBpdFwicyBvcGVuaW5nIHRhZ1xuICAgIC8vIChzdGFydGluZyBhZnRlciBcIjxcIiksIGF0dHJpYnV0ZXMsIGNvbnRlbnRzIGFuZCBjbG9zaW5nIHRhZy5cblxuICAgIGpzeFBhcnNlRWxlbWVudEF0KHN0YXJ0UG9zOiBudW1iZXIsIHN0YXJ0TG9jOiBQb3NpdGlvbik6IE4uSlNYRWxlbWVudCB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICAgIGNvbnN0IG9wZW5pbmdFbGVtZW50ID0gdGhpcy5qc3hQYXJzZU9wZW5pbmdFbGVtZW50QXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICAgIGxldCBjbG9zaW5nRWxlbWVudCA9IG51bGw7XG5cbiAgICAgIGlmICghb3BlbmluZ0VsZW1lbnQuc2VsZkNsb3NpbmcpIHtcbiAgICAgICAgY29udGVudHM6IGZvciAoOzspIHtcbiAgICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUudHlwZSkge1xuICAgICAgICAgICAgY2FzZSB0dC5qc3hUYWdTdGFydDpcbiAgICAgICAgICAgICAgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgICAgICAgICBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICBpZiAodGhpcy5lYXQodHQuc2xhc2gpKSB7XG4gICAgICAgICAgICAgICAgY2xvc2luZ0VsZW1lbnQgPSB0aGlzLmpzeFBhcnNlQ2xvc2luZ0VsZW1lbnRBdChcbiAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICAgICAgICAgICAgc3RhcnRMb2MsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBicmVhayBjb250ZW50cztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuanN4UGFyc2VFbGVtZW50QXQoc3RhcnRQb3MsIHN0YXJ0TG9jKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIHR0LmpzeFRleHQ6XG4gICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5wYXJzZUV4cHJBdG9tKCkpO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSB0dC5icmFjZUw6IHtcbiAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5lbGxpcHNpcykpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuanN4UGFyc2VTcHJlYWRDaGlsZChub2RlKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmpzeFBhcnNlRXhwcmVzc2lvbkNvbnRhaW5lcihub2RlKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0IC0gc2hvdWxkIG5ldmVyIGhhcHBlblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRnJhZ21lbnQob3BlbmluZ0VsZW1lbnQpICYmICFpc0ZyYWdtZW50KGNsb3NpbmdFbGVtZW50KSkge1xuICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICAgICAgY2xvc2luZ0VsZW1lbnQuc3RhcnQsXG4gICAgICAgICAgICBKc3hFcnJvcnMuTWlzc2luZ0Nsb3NpbmdUYWdGcmFnbWVudCxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0ZyYWdtZW50KG9wZW5pbmdFbGVtZW50KSAmJiBpc0ZyYWdtZW50KGNsb3NpbmdFbGVtZW50KSkge1xuICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICAgICAgY2xvc2luZ0VsZW1lbnQuc3RhcnQsXG4gICAgICAgICAgICBKc3hFcnJvcnMuTWlzc2luZ0Nsb3NpbmdUYWdFbGVtZW50LFxuICAgICAgICAgICAgZ2V0UXVhbGlmaWVkSlNYTmFtZShvcGVuaW5nRWxlbWVudC5uYW1lKSxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0ZyYWdtZW50KG9wZW5pbmdFbGVtZW50KSAmJiAhaXNGcmFnbWVudChjbG9zaW5nRWxlbWVudCkpIHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgICAgICAgZ2V0UXVhbGlmaWVkSlNYTmFtZShjbG9zaW5nRWxlbWVudC5uYW1lKSAhPT1cbiAgICAgICAgICAgIGdldFF1YWxpZmllZEpTWE5hbWUob3BlbmluZ0VsZW1lbnQubmFtZSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgICAgICAgIGNsb3NpbmdFbGVtZW50LnN0YXJ0LFxuICAgICAgICAgICAgICBKc3hFcnJvcnMuTWlzc2luZ0Nsb3NpbmdUYWdFbGVtZW50LFxuICAgICAgICAgICAgICBnZXRRdWFsaWZpZWRKU1hOYW1lKG9wZW5pbmdFbGVtZW50Lm5hbWUpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzRnJhZ21lbnQob3BlbmluZ0VsZW1lbnQpKSB7XG4gICAgICAgIG5vZGUub3BlbmluZ0ZyYWdtZW50ID0gb3BlbmluZ0VsZW1lbnQ7XG4gICAgICAgIG5vZGUuY2xvc2luZ0ZyYWdtZW50ID0gY2xvc2luZ0VsZW1lbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLm9wZW5pbmdFbGVtZW50ID0gb3BlbmluZ0VsZW1lbnQ7XG4gICAgICAgIG5vZGUuY2xvc2luZ0VsZW1lbnQgPSBjbG9zaW5nRWxlbWVudDtcbiAgICAgIH1cbiAgICAgIG5vZGUuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChcIjxcIikpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShcbiAgICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0LFxuICAgICAgICAgIEpzeEVycm9ycy5VbndyYXBwZWRBZGphY2VudEpTWEVsZW1lbnRzLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNGcmFnbWVudChvcGVuaW5nRWxlbWVudClcbiAgICAgICAgPyB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJKU1hGcmFnbWVudFwiKVxuICAgICAgICA6IHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkpTWEVsZW1lbnRcIik7XG4gICAgfVxuXG4gICAgLy8gUGFyc2VzIGVudGlyZSBKU1ggZWxlbWVudCBmcm9tIGN1cnJlbnQgcG9zaXRpb24uXG5cbiAgICBqc3hQYXJzZUVsZW1lbnQoKTogTi5KU1hFbGVtZW50IHtcbiAgICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgIGNvbnN0IHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5zdGFydExvYztcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgcmV0dXJuIHRoaXMuanN4UGFyc2VFbGVtZW50QXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gT3ZlcnJpZGVzXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgcGFyc2VFeHByQXRvbShyZWZFeHByZXNzaW9uRXJyb3JzOiA/RXhwcmVzc2lvbkVycm9ycyk6IE4uRXhwcmVzc2lvbiB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5qc3hUZXh0KSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxpdGVyYWwodGhpcy5zdGF0ZS52YWx1ZSwgXCJKU1hUZXh0XCIpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0LmpzeFRhZ1N0YXJ0KSkge1xuICAgICAgICByZXR1cm4gdGhpcy5qc3hQYXJzZUVsZW1lbnQoKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHRoaXMuaXNSZWxhdGlvbmFsKFwiPFwiKSAmJlxuICAgICAgICB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MpICE9PSBjaGFyQ29kZXMuZXhjbGFtYXRpb25NYXJrXG4gICAgICApIHtcbiAgICAgICAgLy8gSW4gY2FzZSB3ZSBlbmNvdW50ZXIgYW4gbHQgdG9rZW4gaGVyZSBpdCB3aWxsIGFsd2F5cyBiZSB0aGUgc3RhcnQgb2ZcbiAgICAgICAgLy8ganN4IGFzIHRoZSBsdCBzaWduIGlzIG5vdCBhbGxvd2VkIGluIHBsYWNlcyB0aGF0IGV4cGVjdCBhbiBleHByZXNzaW9uXG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuanN4VGFnU3RhcnQpO1xuICAgICAgICByZXR1cm4gdGhpcy5qc3hQYXJzZUVsZW1lbnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdXBlci5wYXJzZUV4cHJBdG9tKHJlZkV4cHJlc3Npb25FcnJvcnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUxvb2thaGVhZFN0YXRlKHN0YXRlOiBTdGF0ZSk6IEpTWExvb2thaGVhZFN0YXRlIHtcbiAgICAgIGNvbnN0IGxvb2thaGVhZFN0YXRlID0gKChzdXBlci5jcmVhdGVMb29rYWhlYWRTdGF0ZShcbiAgICAgICAgc3RhdGUsXG4gICAgICApOiBhbnkpOiBKU1hMb29rYWhlYWRTdGF0ZSk7XG4gICAgICBsb29rYWhlYWRTdGF0ZS5pblByb3BlcnR5TmFtZSA9IHN0YXRlLmluUHJvcGVydHlOYW1lO1xuICAgICAgcmV0dXJuIGxvb2thaGVhZFN0YXRlO1xuICAgIH1cblxuICAgIGdldFRva2VuRnJvbUNvZGUoY29kZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pblByb3BlcnR5TmFtZSkgcmV0dXJuIHN1cGVyLmdldFRva2VuRnJvbUNvZGUoY29kZSk7XG5cbiAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmN1ckNvbnRleHQoKTtcblxuICAgICAgaWYgKGNvbnRleHQgPT09IHRjLmpfZXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5qc3hSZWFkVG9rZW4oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnRleHQgPT09IHRjLmpfb1RhZyB8fCBjb250ZXh0ID09PSB0Yy5qX2NUYWcpIHtcbiAgICAgICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KGNvZGUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuanN4UmVhZFdvcmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2RlID09PSBjaGFyQ29kZXMuZ3JlYXRlclRoYW4pIHtcbiAgICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaFRva2VuKHR0LmpzeFRhZ0VuZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgKGNvZGUgPT09IGNoYXJDb2Rlcy5xdW90YXRpb25NYXJrIHx8IGNvZGUgPT09IGNoYXJDb2Rlcy5hcG9zdHJvcGhlKSAmJlxuICAgICAgICAgIGNvbnRleHQgPT09IHRjLmpfb1RhZ1xuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5qc3hSZWFkU3RyaW5nKGNvZGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgY29kZSA9PT0gY2hhckNvZGVzLmxlc3NUaGFuICYmXG4gICAgICAgIHRoaXMuc3RhdGUuZXhwckFsbG93ZWQgJiZcbiAgICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSkgIT09IGNoYXJDb2Rlcy5leGNsYW1hdGlvbk1hcmtcbiAgICAgICkge1xuICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hUb2tlbih0dC5qc3hUYWdTdGFydCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdXBlci5nZXRUb2tlbkZyb21Db2RlKGNvZGUpO1xuICAgIH1cblxuICAgIHVwZGF0ZUNvbnRleHQocHJldlR5cGU6IFRva2VuVHlwZSk6IHZvaWQge1xuICAgICAgc3VwZXIudXBkYXRlQ29udGV4dChwcmV2VHlwZSk7XG4gICAgICBjb25zdCB7IGNvbnRleHQsIHR5cGUgfSA9IHRoaXMuc3RhdGU7XG4gICAgICBpZiAodHlwZSA9PT0gdHQuc2xhc2ggJiYgcHJldlR5cGUgPT09IHR0LmpzeFRhZ1N0YXJ0KSB7XG4gICAgICAgIC8vIGRvIG5vdCBjb25zaWRlciBKU1ggZXhwciAtPiBKU1ggb3BlbiB0YWcgLT4gLi4uIGFueW1vcmVcbiAgICAgICAgLy8gcmVjb25zaWRlciBhcyBjbG9zaW5nIHRhZyBjb250ZXh0XG4gICAgICAgIGNvbnRleHQuc3BsaWNlKC0yLCAyLCB0Yy5qX2NUYWcpO1xuICAgICAgICB0aGlzLnN0YXRlLmV4cHJBbGxvd2VkID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IHR0LmpzeFRhZ0VuZCkge1xuICAgICAgICBjb25zdCBvdXQgPSBjb250ZXh0LnBvcCgpO1xuICAgICAgICBpZiAoKG91dCA9PT0gdGMual9vVGFnICYmIHByZXZUeXBlID09PSB0dC5zbGFzaCkgfHwgb3V0ID09PSB0Yy5qX2NUYWcpIHtcbiAgICAgICAgICBjb250ZXh0LnBvcCgpO1xuICAgICAgICAgIHRoaXMuc3RhdGUuZXhwckFsbG93ZWQgPSBjb250ZXh0W2NvbnRleHQubGVuZ3RoIC0gMV0gPT09IHRjLmpfZXhwcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLmV4cHJBbGxvd2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZS5rZXl3b3JkICYmXG4gICAgICAgIChwcmV2VHlwZSA9PT0gdHQuZG90IHx8IHByZXZUeXBlID09PSB0dC5xdWVzdGlvbkRvdClcbiAgICAgICkge1xuICAgICAgICB0aGlzLnN0YXRlLmV4cHJBbGxvd2VkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlLmV4cHJBbGxvd2VkID0gdHlwZS5iZWZvcmVFeHByO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiJdfQ==