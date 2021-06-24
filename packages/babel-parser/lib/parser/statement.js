"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var N = _interopRequireWildcard(require("../types"));

var _types2 = require("../tokenizer/types");

var _expression = _interopRequireDefault(require("./expression"));

var _error = require("./error");

var _identifier = require("../util/identifier");

var _whitespace = require("../util/whitespace");

var charCodes = _interopRequireWildcard(require("charcodes"));

var _scopeflags = require("../util/scopeflags");

var _util = require("./util");

var _productionParameter = require("../util/production-parameter");

var _expressionScope = require("../util/expression-scope");

var _tokenizer = require("../tokenizer");

var _location = require("../util/location");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var loopLabel = {
  kind: "loop"
},
    switchLabel = {
  kind: "switch"
};
var FUNC_NO_FLAGS = 0,
    FUNC_STATEMENT = 1,
    FUNC_HANGING_STATEMENT = 2,
    FUNC_NULLABLE_ID = 4;
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var keywordRelationalOperator = new RegExp("in(?:stanceof)?", "y");
/**
 * Convert tt.privateName to tt.hash + tt.name for backward Babel 7 compat.
 * For performance reasons this routine mutates `tokens`, it is okay
 * here since we execute `parseTopLevel` once for every file.
 * @param {*} tokens
 * @returns
 */

function babel7CompatTokens(tokens) {
  if (!process.env.BABEL_8_BREAKING) {
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (token.type === _types2.types.privateName) {
        var loc = token.loc,
            start = token.start,
            value = token.value,
            end = token.end;
        var hashEndPos = start + 1;
        var hashEndLoc = new _location.Position(loc.start.line, loc.start.column + 1);
        tokens.splice(i, 1, // $FlowIgnore: hacky way to create token
        new _tokenizer.Token({
          type: _types2.types.hash,
          value: "#",
          start: start,
          end: hashEndPos,
          startLoc: loc.start,
          endLoc: hashEndLoc
        }), // $FlowIgnore: hacky way to create token
        new _tokenizer.Token({
          type: _types2.types.name,
          value: value,
          start: hashEndPos,
          end: end,
          startLoc: hashEndLoc,
          endLoc: loc.end
        }));
      }
    }
  }

  return tokens;
}

var StatementParser = /*#__PURE__*/function (_ExpressionParser) {
  _inherits(StatementParser, _ExpressionParser);

  var _super = _createSuper(StatementParser);

  function StatementParser() {
    _classCallCheck(this, StatementParser);

    return _super.apply(this, arguments);
  }

  _createClass(StatementParser, [{
    key: "parseTopLevel",
    value: // ### Statement parsing
    // Parse a program. Initializes the parser, reads any number of
    // statements, and wraps them in a Program node.  Optionally takes a
    // `program` argument.  If present, the statements will be appended
    // to its body instead of creating a new node.
    function parseTopLevel(file, program) {
      file.program = this.parseProgram(program);
      file.comments = this.state.comments;
      if (this.options.tokens) file.tokens = babel7CompatTokens(this.tokens);
      return this.finishNode(file, "File");
    }
  }, {
    key: "parseProgram",
    value: function parseProgram(program) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _types2.types.eof;
      var sourceType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.options.sourceType;
      program.sourceType = sourceType;
      program.interpreter = this.parseInterpreterDirective();
      this.parseBlockBody(program, true, true, end);

      if (this.inModule && !this.options.allowUndeclaredExports && this.scope.undefinedExports.size > 0) {
        for (var _i = 0, _Array$from = Array.from(this.scope.undefinedExports); _i < _Array$from.length; _i++) {
          var _Array$from$_i = _slicedToArray(_Array$from[_i], 1),
              name = _Array$from$_i[0];

          var pos = this.scope.undefinedExports.get(name); // $FlowIssue

          this.raise(pos, _error.Errors.ModuleExportUndefined, name);
        }
      }

      return this.finishNode(program, "Program");
    } // TODO

  }, {
    key: "stmtToDirective",
    value: function stmtToDirective(stmt) {
      var expr = stmt.expression;
      var directiveLiteral = this.startNodeAt(expr.start, expr.loc.start);
      var directive = this.startNodeAt(stmt.start, stmt.loc.start);
      var raw = this.input.slice(expr.start, expr.end);
      var val = directiveLiteral.value = raw.slice(1, -1); // remove quotes

      this.addExtra(directiveLiteral, "raw", raw);
      this.addExtra(directiveLiteral, "rawValue", val);
      directive.value = this.finishNodeAt(directiveLiteral, "DirectiveLiteral", expr.end, expr.loc.end);
      return this.finishNodeAt(directive, "Directive", stmt.end, stmt.loc.end);
    }
  }, {
    key: "parseInterpreterDirective",
    value: function parseInterpreterDirective() {
      if (!this.match(_types2.types.interpreterDirective)) {
        return null;
      }

      var node = this.startNode();
      node.value = this.state.value;
      this.next();
      return this.finishNode(node, "InterpreterDirective");
    }
  }, {
    key: "isLet",
    value: function isLet(context) {
      if (!this.isContextual("let")) {
        return false;
      }

      return this.isLetKeyword(context);
    }
    /**
     * Assuming we have seen a contextual `let`, check if it starts a variable declaration
     so that `left` should be interpreted as a `let` keyword.
     *
     * @param {?string} context When `context` is non nullish, it will return early and _skip_ checking
                                if the next token after `let` is `{` or a keyword relational operator
     * @returns {boolean}
     * @memberof StatementParser
     */

  }, {
    key: "isLetKeyword",
    value: function isLetKeyword(context) {
      var next = this.nextTokenStart();
      var nextCh = this.codePointAtPos(next); // For ambiguous cases, determine if a LexicalDeclaration (or only a
      // Statement) is allowed here. If context is not empty then only a Statement
      // is allowed. However, `let [` is an explicit negative lookahead for
      // ExpressionStatement, so special-case it first.
      // Also, `let \` is never valid as an expression so this must be a keyword.

      if (nextCh === charCodes.backslash || nextCh === charCodes.leftSquareBracket) {
        return true;
      }

      if (context) return false;
      if (nextCh === charCodes.leftCurlyBrace) return true;

      if ((0, _identifier.isIdentifierStart)(nextCh)) {
        keywordRelationalOperator.lastIndex = next;
        var matched = keywordRelationalOperator.exec(this.input);

        if (matched !== null) {
          // We have seen `in` or `instanceof` so far, now check if the identfier
          // ends here
          var endCh = this.codePointAtPos(next + matched[0].length);

          if (!(0, _identifier.isIdentifierChar)(endCh) && endCh !== charCodes.backslash) {
            return false;
          }
        }

        return true;
      }

      return false;
    } // Parse a single statement.
    //
    // If expecting a statement and finding a slash operator, parse a
    // regular expression literal. This is to handle cases like
    // `if (foo) /blah/.exec(foo)`, where looking at the previous token
    // does not help.
    // https://tc39.es/ecma262/#prod-Statement
    // ImportDeclaration and ExportDeclaration are also handled here so we can throw recoverable errors
    // when they are not at the top level

  }, {
    key: "parseStatement",
    value: function parseStatement(context, topLevel) {
      if (this.match(_types2.types.at)) {
        this.parseDecorators(true);
      }

      return this.parseStatementContent(context, topLevel);
    }
  }, {
    key: "parseStatementContent",
    value: function parseStatementContent(context, topLevel) {
      var starttype = this.state.type;
      var node = this.startNode();
      var kind;

      if (this.isLet(context)) {
        starttype = _types2.types._var;
        kind = "let";
      } // Most types of statements are recognized by the keyword they
      // start with. Many are trivial to parse, some require a bit of
      // complexity.


      switch (starttype) {
        case _types2.types._break:
        case _types2.types._continue:
          // $FlowFixMe
          return this.parseBreakContinueStatement(node, starttype.keyword);

        case _types2.types._debugger:
          return this.parseDebuggerStatement(node);

        case _types2.types._do:
          return this.parseDoStatement(node);

        case _types2.types._for:
          return this.parseForStatement(node);

        case _types2.types._function:
          if (this.lookaheadCharCode() === charCodes.dot) break;

          if (context) {
            if (this.state.strict) {
              this.raise(this.state.start, _error.Errors.StrictFunction);
            } else if (context !== "if" && context !== "label") {
              this.raise(this.state.start, _error.Errors.SloppyFunction);
            }
          }

          return this.parseFunctionStatement(node, false, !context);

        case _types2.types._class:
          if (context) this.unexpected();
          return this.parseClass(node, true);

        case _types2.types._if:
          return this.parseIfStatement(node);

        case _types2.types._return:
          return this.parseReturnStatement(node);

        case _types2.types._switch:
          return this.parseSwitchStatement(node);

        case _types2.types._throw:
          return this.parseThrowStatement(node);

        case _types2.types._try:
          return this.parseTryStatement(node);

        case _types2.types._const:
        case _types2.types._var:
          kind = kind || this.state.value;

          if (context && kind !== "var") {
            this.raise(this.state.start, _error.Errors.UnexpectedLexicalDeclaration);
          }

          return this.parseVarStatement(node, kind);

        case _types2.types._while:
          return this.parseWhileStatement(node);

        case _types2.types._with:
          return this.parseWithStatement(node);

        case _types2.types.braceL:
          return this.parseBlock();

        case _types2.types.semi:
          return this.parseEmptyStatement(node);

        case _types2.types._import:
          {
            var nextTokenCharCode = this.lookaheadCharCode();

            if (nextTokenCharCode === charCodes.leftParenthesis || // import()
            nextTokenCharCode === charCodes.dot // import.meta
            ) {
                break;
              }
          }
        // fall through

        case _types2.types._export:
          {
            if (!this.options.allowImportExportEverywhere && !topLevel) {
              this.raise(this.state.start, _error.Errors.UnexpectedImportExport);
            }

            this.next(); // eat `import`/`export`

            var result;

            if (starttype === _types2.types._import) {
              result = this.parseImport(node);

              if (result.type === "ImportDeclaration" && (!result.importKind || result.importKind === "value")) {
                this.sawUnambiguousESM = true;
              }
            } else {
              result = this.parseExport(node);

              if (result.type === "ExportNamedDeclaration" && (!result.exportKind || result.exportKind === "value") || result.type === "ExportAllDeclaration" && (!result.exportKind || result.exportKind === "value") || result.type === "ExportDefaultDeclaration") {
                this.sawUnambiguousESM = true;
              }
            }

            this.assertModuleNodeAllowed(node);
            return result;
          }

        default:
          {
            if (this.isAsyncFunction()) {
              if (context) {
                this.raise(this.state.start, _error.Errors.AsyncFunctionInSingleStatementContext);
              }

              this.next();
              return this.parseFunctionStatement(node, true, !context);
            }
          }
      } // If the statement does not start with a statement keyword or a
      // brace, it's an ExpressionStatement or LabeledStatement. We
      // simply start parsing an expression, and afterwards, if the
      // next token is a colon and the expression was a simple
      // Identifier node, we switch to interpreting it as a label.


      var maybeName = this.state.value;
      var expr = this.parseExpression();

      if (starttype === _types2.types.name && expr.type === "Identifier" && this.eat(_types2.types.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
    }
  }, {
    key: "assertModuleNodeAllowed",
    value: function assertModuleNodeAllowed(node) {
      if (!this.options.allowImportExportEverywhere && !this.inModule) {
        this.raise(node.start, _error.SourceTypeModuleErrors.ImportOutsideModule);
      }
    }
  }, {
    key: "takeDecorators",
    value: function takeDecorators(node) {
      var decorators = this.state.decoratorStack[this.state.decoratorStack.length - 1];

      if (decorators.length) {
        node.decorators = decorators;
        this.resetStartLocationFromNode(node, decorators[0]);
        this.state.decoratorStack[this.state.decoratorStack.length - 1] = [];
      }
    }
  }, {
    key: "canHaveLeadingDecorator",
    value: function canHaveLeadingDecorator() {
      return this.match(_types2.types._class);
    }
  }, {
    key: "parseDecorators",
    value: function parseDecorators(allowExport) {
      var currentContextDecorators = this.state.decoratorStack[this.state.decoratorStack.length - 1];

      while (this.match(_types2.types.at)) {
        var decorator = this.parseDecorator();
        currentContextDecorators.push(decorator);
      }

      if (this.match(_types2.types._export)) {
        if (!allowExport) {
          this.unexpected();
        }

        if (this.hasPlugin("decorators") && !this.getPluginOption("decorators", "decoratorsBeforeExport")) {
          this.raise(this.state.start, _error.Errors.DecoratorExportClass);
        }
      } else if (!this.canHaveLeadingDecorator()) {
        throw this.raise(this.state.start, _error.Errors.UnexpectedLeadingDecorator);
      }
    }
  }, {
    key: "parseDecorator",
    value: function parseDecorator() {
      this.expectOnePlugin(["decorators-legacy", "decorators"]);
      var node = this.startNode();
      this.next();

      if (this.hasPlugin("decorators")) {
        // Every time a decorator class expression is evaluated, a new empty array is pushed onto the stack
        // So that the decorators of any nested class expressions will be dealt with separately
        this.state.decoratorStack.push([]);
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        var expr;

        if (this.eat(_types2.types.parenL)) {
          expr = this.parseExpression();
          this.expect(_types2.types.parenR);
        } else {
          expr = this.parseIdentifier(false);

          while (this.eat(_types2.types.dot)) {
            var _node = this.startNodeAt(startPos, startLoc);

            _node.object = expr;
            _node.property = this.parseIdentifier(true);
            _node.computed = false;
            expr = this.finishNode(_node, "MemberExpression");
          }
        }

        node.expression = this.parseMaybeDecoratorArguments(expr);
        this.state.decoratorStack.pop();
      } else {
        node.expression = this.parseExprSubscripts();
      }

      return this.finishNode(node, "Decorator");
    }
  }, {
    key: "parseMaybeDecoratorArguments",
    value: function parseMaybeDecoratorArguments(expr) {
      if (this.eat(_types2.types.parenL)) {
        var node = this.startNodeAtNode(expr);
        node.callee = expr;
        node.arguments = this.parseCallExpressionArguments(_types2.types.parenR, false);
        this.toReferencedList(node.arguments);
        return this.finishNode(node, "CallExpression");
      }

      return expr;
    }
  }, {
    key: "parseBreakContinueStatement",
    value: function parseBreakContinueStatement(node, keyword) {
      var isBreak = keyword === "break";
      this.next();

      if (this.isLineTerminator()) {
        node.label = null;
      } else {
        node.label = this.parseIdentifier();
        this.semicolon();
      }

      this.verifyBreakContinue(node, keyword);
      return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
    }
  }, {
    key: "verifyBreakContinue",
    value: function verifyBreakContinue(node, keyword) {
      var isBreak = keyword === "break";
      var i;

      for (i = 0; i < this.state.labels.length; ++i) {
        var lab = this.state.labels[i];

        if (node.label == null || lab.name === node.label.name) {
          if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
          if (node.label && isBreak) break;
        }
      }

      if (i === this.state.labels.length) {
        this.raise(node.start, _error.Errors.IllegalBreakContinue, keyword);
      }
    }
  }, {
    key: "parseDebuggerStatement",
    value: function parseDebuggerStatement(node) {
      this.next();
      this.semicolon();
      return this.finishNode(node, "DebuggerStatement");
    }
  }, {
    key: "parseHeaderExpression",
    value: function parseHeaderExpression() {
      this.expect(_types2.types.parenL);
      var val = this.parseExpression();
      this.expect(_types2.types.parenR);
      return val;
    }
  }, {
    key: "parseDoStatement",
    value: function parseDoStatement(node) {
      var _this = this;

      this.next();
      this.state.labels.push(loopLabel);
      node.body = // For the smartPipelines plugin: Disable topic references from outer
      // contexts within the loop body. They are permitted in test expressions,
      // outside of the loop body.
      this.withTopicForbiddingContext(function () {
        return (// Parse the loop body's body.
          _this.parseStatement("do")
        );
      });
      this.state.labels.pop();
      this.expect(_types2.types._while);
      node.test = this.parseHeaderExpression();
      this.eat(_types2.types.semi);
      return this.finishNode(node, "DoWhileStatement");
    } // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
    // loop is non-trivial. Basically, we have to parse the init `var`
    // statement or expression, disallowing the `in` operator (see
    // the second parameter to `parseExpression`), and then check
    // whether the next token is `in` or `of`. When there is no init
    // part (semicolon immediately after the opening parenthesis), it
    // is a regular `for` loop.

  }, {
    key: "parseForStatement",
    value: function parseForStatement(node) {
      this.next();
      this.state.labels.push(loopLabel);
      var awaitAt = -1;

      if (this.isAwaitAllowed() && this.eatContextual("await")) {
        awaitAt = this.state.lastTokStart;
      }

      this.scope.enter(_scopeflags.SCOPE_OTHER);
      this.expect(_types2.types.parenL);

      if (this.match(_types2.types.semi)) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }

        return this.parseFor(node, null);
      }

      var startsWithLet = this.isContextual("let");
      var isLet = startsWithLet && this.isLetKeyword();

      if (this.match(_types2.types._var) || this.match(_types2.types._const) || isLet) {
        var _init = this.startNode();

        var kind = isLet ? "let" : this.state.value;
        this.next();
        this.parseVar(_init, true, kind);
        this.finishNode(_init, "VariableDeclaration");

        if ((this.match(_types2.types._in) || this.isContextual("of")) && _init.declarations.length === 1) {
          return this.parseForIn(node, _init, awaitAt);
        }

        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }

        return this.parseFor(node, _init);
      } // Check whether the first token is possibly a contextual keyword, so that
      // we can forbid `for (async of` if this turns out to be a for-of loop.


      var startsWithUnescapedName = this.match(_types2.types.name) && !this.state.containsEsc;
      var refExpressionErrors = new _util.ExpressionErrors();
      var init = this.parseExpression(true, refExpressionErrors);
      var isForOf = this.isContextual("of");

      if (isForOf) {
        // Check for leading tokens that are forbidden in for-of loops:
        if (startsWithLet) {
          this.raise(init.start, _error.Errors.ForOfLet);
        } else if ( // `for await (async of []);` is allowed.
        awaitAt === -1 && startsWithUnescapedName && init.type === "Identifier" && init.name === "async") {
          // This catches the case where the `async` in `for (async of` was
          // parsed as an identifier. If it was parsed as the start of an async
          // arrow function (e.g. `for (async of => {} of []);`), the LVal check
          // further down will raise a more appropriate error.
          this.raise(init.start, _error.Errors.ForOfAsync);
        }
      }

      if (isForOf || this.match(_types2.types._in)) {
        this.toAssignable(init,
        /* isLHS */
        true);
        var description = isForOf ? "for-of statement" : "for-in statement";
        this.checkLVal(init, description);
        return this.parseForIn(node, init, awaitAt);
      } else {
        this.checkExpressionErrors(refExpressionErrors, true);
      }

      if (awaitAt > -1) {
        this.unexpected(awaitAt);
      }

      return this.parseFor(node, init);
    }
  }, {
    key: "parseFunctionStatement",
    value: function parseFunctionStatement(node, isAsync, declarationPosition) {
      this.next();
      return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), isAsync);
    }
  }, {
    key: "parseIfStatement",
    value: function parseIfStatement(node) {
      this.next();
      node.test = this.parseHeaderExpression();
      node.consequent = this.parseStatement("if");
      node.alternate = this.eat(_types2.types._else) ? this.parseStatement("if") : null;
      return this.finishNode(node, "IfStatement");
    }
  }, {
    key: "parseReturnStatement",
    value: function parseReturnStatement(node) {
      if (!this.prodParam.hasReturn && !this.options.allowReturnOutsideFunction) {
        this.raise(this.state.start, _error.Errors.IllegalReturn);
      }

      this.next(); // In `return` (and `break`/`continue`), the keywords with
      // optional arguments, we eagerly look for a semicolon or the
      // possibility to insert one.

      if (this.isLineTerminator()) {
        node.argument = null;
      } else {
        node.argument = this.parseExpression();
        this.semicolon();
      }

      return this.finishNode(node, "ReturnStatement");
    }
  }, {
    key: "parseSwitchStatement",
    value: function parseSwitchStatement(node) {
      this.next();
      node.discriminant = this.parseHeaderExpression();
      var cases = node.cases = [];
      this.expect(_types2.types.braceL);
      this.state.labels.push(switchLabel);
      this.scope.enter(_scopeflags.SCOPE_OTHER); // Statements under must be grouped (by label) in SwitchCase
      // nodes. `cur` is used to keep the node that we are currently
      // adding statements to.

      var cur;

      for (var sawDefault; !this.match(_types2.types.braceR);) {
        if (this.match(_types2.types._case) || this.match(_types2.types._default)) {
          var isCase = this.match(_types2.types._case);
          if (cur) this.finishNode(cur, "SwitchCase");
          cases.push(cur = this.startNode());
          cur.consequent = [];
          this.next();

          if (isCase) {
            cur.test = this.parseExpression();
          } else {
            if (sawDefault) {
              this.raise(this.state.lastTokStart, _error.Errors.MultipleDefaultsInSwitch);
            }

            sawDefault = true;
            cur.test = null;
          }

          this.expect(_types2.types.colon);
        } else {
          if (cur) {
            cur.consequent.push(this.parseStatement(null));
          } else {
            this.unexpected();
          }
        }
      }

      this.scope.exit();
      if (cur) this.finishNode(cur, "SwitchCase");
      this.next(); // Closing brace

      this.state.labels.pop();
      return this.finishNode(node, "SwitchStatement");
    }
  }, {
    key: "parseThrowStatement",
    value: function parseThrowStatement(node) {
      this.next();

      if (this.hasPrecedingLineBreak()) {
        this.raise(this.state.lastTokEnd, _error.Errors.NewlineAfterThrow);
      }

      node.argument = this.parseExpression();
      this.semicolon();
      return this.finishNode(node, "ThrowStatement");
    }
  }, {
    key: "parseCatchClauseParam",
    value: function parseCatchClauseParam() {
      var param = this.parseBindingAtom();
      var simple = param.type === "Identifier";
      this.scope.enter(simple ? _scopeflags.SCOPE_SIMPLE_CATCH : 0);
      this.checkLVal(param, "catch clause", _scopeflags.BIND_LEXICAL);
      return param;
    }
  }, {
    key: "parseTryStatement",
    value: function parseTryStatement(node) {
      var _this2 = this;

      this.next();
      node.block = this.parseBlock();
      node.handler = null;

      if (this.match(_types2.types._catch)) {
        var clause = this.startNode();
        this.next();

        if (this.match(_types2.types.parenL)) {
          this.expect(_types2.types.parenL);
          clause.param = this.parseCatchClauseParam();
          this.expect(_types2.types.parenR);
        } else {
          clause.param = null;
          this.scope.enter(_scopeflags.SCOPE_OTHER);
        }

        clause.body = // For the smartPipelines plugin: Disable topic references from outer
        // contexts within the catch clause's body.
        this.withTopicForbiddingContext(function () {
          return (// Parse the catch clause's body.
            _this2.parseBlock(false, false)
          );
        });
        this.scope.exit();
        node.handler = this.finishNode(clause, "CatchClause");
      }

      node.finalizer = this.eat(_types2.types._finally) ? this.parseBlock() : null;

      if (!node.handler && !node.finalizer) {
        this.raise(node.start, _error.Errors.NoCatchOrFinally);
      }

      return this.finishNode(node, "TryStatement");
    }
  }, {
    key: "parseVarStatement",
    value: function parseVarStatement(node, kind) {
      this.next();
      this.parseVar(node, false, kind);
      this.semicolon();
      return this.finishNode(node, "VariableDeclaration");
    }
  }, {
    key: "parseWhileStatement",
    value: function parseWhileStatement(node) {
      var _this3 = this;

      this.next();
      node.test = this.parseHeaderExpression();
      this.state.labels.push(loopLabel);
      node.body = // For the smartPipelines plugin:
      // Disable topic references from outer contexts within the loop body.
      // They are permitted in test expressions, outside of the loop body.
      this.withTopicForbiddingContext(function () {
        return (// Parse loop body.
          _this3.parseStatement("while")
        );
      });
      this.state.labels.pop();
      return this.finishNode(node, "WhileStatement");
    }
  }, {
    key: "parseWithStatement",
    value: function parseWithStatement(node) {
      var _this4 = this;

      if (this.state.strict) {
        this.raise(this.state.start, _error.Errors.StrictWith);
      }

      this.next();
      node.object = this.parseHeaderExpression();
      node.body = // For the smartPipelines plugin:
      // Disable topic references from outer contexts within the with statement's body.
      // They are permitted in function default-parameter expressions, which are
      // part of the outer context, outside of the with statement's body.
      this.withTopicForbiddingContext(function () {
        return (// Parse the statement body.
          _this4.parseStatement("with")
        );
      });
      return this.finishNode(node, "WithStatement");
    }
  }, {
    key: "parseEmptyStatement",
    value: function parseEmptyStatement(node) {
      this.next();
      return this.finishNode(node, "EmptyStatement");
    }
  }, {
    key: "parseLabeledStatement",
    value: function parseLabeledStatement(node, maybeName, expr, context) {
      var _iterator = _createForOfIteratorHelper(this.state.labels),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _label = _step.value;

          if (_label.name === maybeName) {
            this.raise(expr.start, _error.Errors.LabelRedeclaration, maybeName);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var kind = this.state.type.isLoop ? "loop" : this.match(_types2.types._switch) ? "switch" : null;

      for (var i = this.state.labels.length - 1; i >= 0; i--) {
        var label = this.state.labels[i];

        if (label.statementStart === node.start) {
          label.statementStart = this.state.start;
          label.kind = kind;
        } else {
          break;
        }
      }

      this.state.labels.push({
        name: maybeName,
        kind: kind,
        statementStart: this.state.start
      });
      node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
      this.state.labels.pop();
      node.label = expr;
      return this.finishNode(node, "LabeledStatement");
    }
  }, {
    key: "parseExpressionStatement",
    value: function parseExpressionStatement(node, expr) {
      node.expression = expr;
      this.semicolon();
      return this.finishNode(node, "ExpressionStatement");
    } // Parse a semicolon-enclosed block of statements, handling `"use
    // strict"` declarations when `allowDirectives` is true (used for
    // function bodies).

  }, {
    key: "parseBlock",
    value: function parseBlock() {
      var allowDirectives = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var createNewLexicalScope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var afterBlockParse = arguments.length > 2 ? arguments[2] : undefined;
      var node = this.startNode();

      if (allowDirectives) {
        this.state.strictErrors.clear();
      }

      this.expect(_types2.types.braceL);

      if (createNewLexicalScope) {
        this.scope.enter(_scopeflags.SCOPE_OTHER);
      }

      this.parseBlockBody(node, allowDirectives, false, _types2.types.braceR, afterBlockParse);

      if (createNewLexicalScope) {
        this.scope.exit();
      }

      return this.finishNode(node, "BlockStatement");
    }
  }, {
    key: "isValidDirective",
    value: function isValidDirective(stmt) {
      return stmt.type === "ExpressionStatement" && stmt.expression.type === "StringLiteral" && !stmt.expression.extra.parenthesized;
    }
  }, {
    key: "parseBlockBody",
    value: function parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
      var body = node.body = [];
      var directives = node.directives = [];
      this.parseBlockOrModuleBlockBody(body, allowDirectives ? directives : undefined, topLevel, end, afterBlockParse);
    } // Undefined directives means that directives are not allowed.
    // https://tc39.es/ecma262/#prod-Block
    // https://tc39.es/ecma262/#prod-ModuleBody

  }, {
    key: "parseBlockOrModuleBlockBody",
    value: function parseBlockOrModuleBlockBody(body, directives, topLevel, end, afterBlockParse) {
      var oldStrict = this.state.strict;
      var hasStrictModeDirective = false;
      var parsedNonDirective = false;

      while (!this.match(end)) {
        var stmt = this.parseStatement(null, topLevel);

        if (directives && !parsedNonDirective) {
          if (this.isValidDirective(stmt)) {
            var directive = this.stmtToDirective(stmt);
            directives.push(directive);

            if (!hasStrictModeDirective && directive.value.value === "use strict") {
              hasStrictModeDirective = true;
              this.setStrict(true);
            }

            continue;
          }

          parsedNonDirective = true; // clear strict errors since the strict mode will not change within the block

          this.state.strictErrors.clear();
        }

        body.push(stmt);
      }

      if (afterBlockParse) {
        afterBlockParse.call(this, hasStrictModeDirective);
      }

      if (!oldStrict) {
        this.setStrict(false);
      }

      this.next();
    } // Parse a regular `for` loop. The disambiguation code in
    // `parseStatement` will already have parsed the init statement or
    // expression.

  }, {
    key: "parseFor",
    value: function parseFor(node, init) {
      var _this5 = this;

      node.init = init;
      this.semicolon(
      /* allowAsi */
      false);
      node.test = this.match(_types2.types.semi) ? null : this.parseExpression();
      this.semicolon(
      /* allowAsi */
      false);
      node.update = this.match(_types2.types.parenR) ? null : this.parseExpression();
      this.expect(_types2.types.parenR);
      node.body = // For the smartPipelines plugin: Disable topic references from outer
      // contexts within the loop body. They are permitted in test expressions,
      // outside of the loop body.
      this.withTopicForbiddingContext(function () {
        return (// Parse the loop body.
          _this5.parseStatement("for")
        );
      });
      this.scope.exit();
      this.state.labels.pop();
      return this.finishNode(node, "ForStatement");
    } // Parse a `for`/`in` and `for`/`of` loop, which are almost
    // same from parser's perspective.

  }, {
    key: "parseForIn",
    value: function parseForIn(node, init, awaitAt) {
      var _this6 = this;

      var isForIn = this.match(_types2.types._in);
      this.next();

      if (isForIn) {
        if (awaitAt > -1) this.unexpected(awaitAt);
      } else {
        node["await"] = awaitAt > -1;
      }

      if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.state.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
        this.raise(init.start, _error.Errors.ForInOfLoopInitializer, isForIn ? "for-in" : "for-of");
      } else if (init.type === "AssignmentPattern") {
        this.raise(init.start, _error.Errors.InvalidLhs, "for-loop");
      }

      node.left = init;
      node.right = isForIn ? this.parseExpression() : this.parseMaybeAssignAllowIn();
      this.expect(_types2.types.parenR);
      node.body = // For the smartPipelines plugin:
      // Disable topic references from outer contexts within the loop body.
      // They are permitted in test expressions, outside of the loop body.
      this.withTopicForbiddingContext(function () {
        return (// Parse loop body.
          _this6.parseStatement("for")
        );
      });
      this.scope.exit();
      this.state.labels.pop();
      return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
    } // Parse a list of variable declarations.

  }, {
    key: "parseVar",
    value: function parseVar(node, isFor, kind) {
      var declarations = node.declarations = [];
      var isTypescript = this.hasPlugin("typescript");
      node.kind = kind;

      for (;;) {
        var decl = this.startNode();
        this.parseVarId(decl, kind);

        if (this.eat(_types2.types.eq)) {
          decl.init = isFor ? this.parseMaybeAssignDisallowIn() : this.parseMaybeAssignAllowIn();
        } else {
          if (kind === "const" && !(this.match(_types2.types._in) || this.isContextual("of"))) {
            // `const` with no initializer is allowed in TypeScript.
            // It could be a declaration like `const x: number;`.
            if (!isTypescript) {
              this.raise(this.state.lastTokEnd, _error.Errors.DeclarationMissingInitializer, "Const declarations");
            }
          } else if (decl.id.type !== "Identifier" && !(isFor && (this.match(_types2.types._in) || this.isContextual("of")))) {
            this.raise(this.state.lastTokEnd, _error.Errors.DeclarationMissingInitializer, "Complex binding patterns");
          }

          decl.init = null;
        }

        declarations.push(this.finishNode(decl, "VariableDeclarator"));
        if (!this.eat(_types2.types.comma)) break;
      }

      return node;
    }
  }, {
    key: "parseVarId",
    value: function parseVarId(decl, kind) {
      decl.id = this.parseBindingAtom();
      this.checkLVal(decl.id, "variable declaration", kind === "var" ? _scopeflags.BIND_VAR : _scopeflags.BIND_LEXICAL, undefined, kind !== "var");
    } // Parse a function declaration or literal (depending on the
    // `isStatement` parameter).

  }, {
    key: "parseFunction",
    value: function parseFunction(node) {
      var _this7 = this;

      var statement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FUNC_NO_FLAGS;
      var isAsync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var isLive = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var isStatement = statement & FUNC_STATEMENT;
      var isHangingStatement = statement & FUNC_HANGING_STATEMENT;
      var requireId = !!isStatement && !(statement & FUNC_NULLABLE_ID);
      this.initFunction(node, isAsync);

      if (this.match(_types2.types.star) && isHangingStatement) {
        this.raise(this.state.start, _error.Errors.GeneratorInSingleStatementContext);
      }

      node.generator = this.eat(_types2.types.star);

      if (isStatement) {
        node.id = this.parseFunctionId(requireId);
      }

      var oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
      this.state.maybeInArrowParameters = false;
      this.scope.enter(_scopeflags.SCOPE_FUNCTION);
      this.prodParam.enter((0, _productionParameter.functionFlags)(isAsync, node.generator, isLive));

      if (!isStatement) {
        node.id = this.parseFunctionId();
      }

      this.parseFunctionParams(node,
      /* allowModifiers */
      false); // For the smartPipelines plugin: Disable topic references from outer
      // contexts within the function body. They are permitted in function
      // default-parameter expressions, outside of the function body.

      this.withTopicForbiddingContext(function () {
        // Parse the function body.
        _this7.parseFunctionBodyAndFinish(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
      });
      this.prodParam.exit();
      this.scope.exit();

      if (isStatement && !isHangingStatement) {
        // We need to register this _after_ parsing the function body
        // because of TypeScript body-less function declarations,
        // which shouldn't be added to the scope.
        this.registerFunctionStatementId(node);
      }

      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
      return node;
    }
  }, {
    key: "parseFunctionId",
    value: function parseFunctionId(requireId) {
      return requireId || this.match(_types2.types.name) ? this.parseIdentifier() : null;
    }
  }, {
    key: "parseFunctionParams",
    value: function parseFunctionParams(node, allowModifiers) {
      this.expect(_types2.types.parenL);
      this.expressionScope.enter((0, _expressionScope.newParameterDeclarationScope)());
      node.params = this.parseBindingList(_types2.types.parenR, charCodes.rightParenthesis,
      /* allowEmpty */
      false, allowModifiers);
      this.expressionScope.exit();
    }
  }, {
    key: "registerFunctionStatementId",
    value: function registerFunctionStatementId(node) {
      if (!node.id) return; // If it is a regular function declaration in sloppy mode, then it is
      // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
      // mode depends on properties of the current scope (see
      // treatFunctionsAsVar).

      this.scope.declareName(node.id.name, this.state.strict || node.generator || node.async ? this.scope.treatFunctionsAsVar ? _scopeflags.BIND_VAR : _scopeflags.BIND_LEXICAL : _scopeflags.BIND_FUNCTION, node.id.start);
    } // Parse a class declaration or literal (depending on the
    // `isStatement` parameter).

  }, {
    key: "parseClass",
    value: function parseClass(node, isStatement, optionalId) {
      this.next();
      this.takeDecorators(node); // A class definition is always strict mode code.

      var oldStrict = this.state.strict;
      this.state.strict = true;
      this.parseClassId(node, isStatement, optionalId);
      this.parseClassSuper(node); // this.state.strict is restored in parseClassBody

      node.body = this.parseClassBody(!!node.superClass, oldStrict);
      return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
    }
  }, {
    key: "isClassProperty",
    value: function isClassProperty() {
      return this.match(_types2.types.eq) || this.match(_types2.types.semi) || this.match(_types2.types.braceR);
    }
  }, {
    key: "isClassMethod",
    value: function isClassMethod() {
      return this.match(_types2.types.parenL);
    }
  }, {
    key: "isNonstaticConstructor",
    value: function isNonstaticConstructor(method) {
      return !method.computed && !method["static"] && (method.key.name === "constructor" || // Identifier
      method.key.value === "constructor") // String literal
      ;
    } // https://tc39.es/ecma262/#prod-ClassBody

  }, {
    key: "parseClassBody",
    value: function parseClassBody(hadSuperClass, oldStrict) {
      var _this8 = this;

      this.classScope.enter();
      var state = {
        hadConstructor: false,
        hadSuperClass: hadSuperClass
      };
      var decorators = [];
      var classBody = this.startNode();
      classBody.body = [];
      this.expect(_types2.types.braceL); // For the smartPipelines plugin: Disable topic references from outer
      // contexts within the class body.

      this.withTopicForbiddingContext(function () {
        while (!_this8.match(_types2.types.braceR)) {
          if (_this8.eat(_types2.types.semi)) {
            if (decorators.length > 0) {
              throw _this8.raise(_this8.state.lastTokEnd, _error.Errors.DecoratorSemicolon);
            }

            continue;
          }

          if (_this8.match(_types2.types.at)) {
            decorators.push(_this8.parseDecorator());
            continue;
          }

          var member = _this8.startNode(); // steal the decorators if there are any


          if (decorators.length) {
            member.decorators = decorators;

            _this8.resetStartLocationFromNode(member, decorators[0]);

            decorators = [];
          }

          _this8.parseClassMember(classBody, member, state);

          if (member.kind === "constructor" && member.decorators && member.decorators.length > 0) {
            _this8.raise(member.start, _error.Errors.DecoratorConstructor);
          }
        }
      });
      this.state.strict = oldStrict;
      this.next(); // eat `}`

      if (decorators.length) {
        throw this.raise(this.state.start, _error.Errors.TrailingDecorator);
      }

      this.classScope.exit();
      return this.finishNode(classBody, "ClassBody");
    } // returns true if the current identifier is a method/field name,
    // false if it is a modifier

  }, {
    key: "parseClassMemberFromModifier",
    value: function parseClassMemberFromModifier(classBody, member) {
      var key = this.parseIdentifier(true); // eats the modifier

      if (this.isClassMethod()) {
        var method = member; // a method named like the modifier

        method.kind = "method";
        method.computed = false;
        method.key = key;
        method["static"] = false;
        this.pushClassMethod(classBody, method, false, false,
        /* isConstructor */
        false, false);
        return true;
      } else if (this.isClassProperty()) {
        var prop = member; // a property named like the modifier

        prop.computed = false;
        prop.key = key;
        prop["static"] = false;
        classBody.body.push(this.parseClassProperty(prop));
        return true;
      }

      return false;
    }
  }, {
    key: "parseClassMember",
    value: function parseClassMember(classBody, member, state) {
      var isStatic = this.isContextual("static");

      if (isStatic) {
        if (this.parseClassMemberFromModifier(classBody, member)) {
          // a class element named 'static'
          return;
        }

        if (this.eat(_types2.types.braceL)) {
          this.parseClassStaticBlock(classBody, member);
          return;
        }
      }

      this.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
    }
  }, {
    key: "parseClassMemberWithIsStatic",
    value: function parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
      var publicMethod = member;
      var privateMethod = member;
      var publicProp = member;
      var privateProp = member;
      var method = publicMethod;
      var publicMember = publicMethod;
      member["static"] = isStatic;

      if (this.eat(_types2.types.star)) {
        // a generator
        method.kind = "method";
        var isPrivateName = this.match(_types2.types.privateName);
        this.parseClassElementName(method);

        if (isPrivateName) {
          // Private generator method
          this.pushClassPrivateMethod(classBody, privateMethod, true, false);
          return;
        }

        if (this.isNonstaticConstructor(publicMethod)) {
          this.raise(publicMethod.key.start, _error.Errors.ConstructorIsGenerator);
        }

        this.pushClassMethod(classBody, publicMethod, true, false,
        /* isConstructor */
        false, false);
        return;
      }

      var containsEsc = this.state.containsEsc;
      var isPrivate = this.match(_types2.types.privateName);
      var key = this.parseClassElementName(member); // Check the key is not a computed expression or string literal.

      var isSimple = key.type === "Identifier";
      var maybeQuestionTokenStart = this.state.start;
      this.parsePostMemberNameModifiers(publicMember);

      if (this.isClassMethod()) {
        method.kind = "method";

        if (isPrivate) {
          this.pushClassPrivateMethod(classBody, privateMethod, false, false);
          return;
        } // a normal method


        var isConstructor = this.isNonstaticConstructor(publicMethod);
        var allowsDirectSuper = false;

        if (isConstructor) {
          publicMethod.kind = "constructor"; // TypeScript allows multiple overloaded constructor declarations.

          if (state.hadConstructor && !this.hasPlugin("typescript")) {
            this.raise(key.start, _error.Errors.DuplicateConstructor);
          }

          if (isConstructor && this.hasPlugin("typescript") && member.override) {
            this.raise(key.start, _error.Errors.OverrideOnConstructor);
          }

          state.hadConstructor = true;
          allowsDirectSuper = state.hadSuperClass;
        }

        this.pushClassMethod(classBody, publicMethod, false, false, isConstructor, allowsDirectSuper);
      } else if (this.isClassProperty()) {
        if (isPrivate) {
          this.pushClassPrivateProperty(classBody, privateProp);
        } else {
          this.pushClassProperty(classBody, publicProp);
        }
      } else if (isSimple && key.name === "async" && !containsEsc && !this.isLineTerminator()) {
        // an async method
        var isGenerator = this.eat(_types2.types.star);

        if (publicMember.optional) {
          this.unexpected(maybeQuestionTokenStart);
        }

        method.kind = "method"; // The so-called parsed name would have been "async": get the real name.

        var _isPrivate = this.match(_types2.types.privateName);

        this.parseClassElementName(method);
        this.parsePostMemberNameModifiers(publicMember);

        if (_isPrivate) {
          // private async method
          this.pushClassPrivateMethod(classBody, privateMethod, isGenerator, true);
        } else {
          if (this.isNonstaticConstructor(publicMethod)) {
            this.raise(publicMethod.key.start, _error.Errors.ConstructorIsAsync);
          }

          this.pushClassMethod(classBody, publicMethod, isGenerator, true,
          /* isConstructor */
          false, false);
        }
      } else if (isSimple && (key.name === "get" || key.name === "set") && !containsEsc && !(this.match(_types2.types.star) && this.isLineTerminator())) {
        // `get\n*` is an uninitialized property named 'get' followed by a generator.
        // a getter or setter
        method.kind = key.name; // The so-called parsed name would have been "get/set": get the real name.

        var _isPrivate2 = this.match(_types2.types.privateName);

        this.parseClassElementName(publicMethod);

        if (_isPrivate2) {
          // private getter/setter
          this.pushClassPrivateMethod(classBody, privateMethod, false, false);
        } else {
          if (this.isNonstaticConstructor(publicMethod)) {
            this.raise(publicMethod.key.start, _error.Errors.ConstructorIsAccessor);
          }

          this.pushClassMethod(classBody, publicMethod, false, false,
          /* isConstructor */
          false, false);
        }

        this.checkGetterSetterParams(publicMethod);
      } else if (this.isLineTerminator()) {
        // an uninitialized class property (due to ASI, since we don't otherwise recognize the next token)
        if (isPrivate) {
          this.pushClassPrivateProperty(classBody, privateProp);
        } else {
          this.pushClassProperty(classBody, publicProp);
        }
      } else {
        this.unexpected();
      }
    } // https://tc39.es/proposal-class-fields/#prod-ClassElementName

  }, {
    key: "parseClassElementName",
    value: function parseClassElementName(member) {
      var _this$state = this.state,
          type = _this$state.type,
          value = _this$state.value,
          start = _this$state.start;

      if ((type === _types2.types.name || type === _types2.types.string) && member["static"] && value === "prototype") {
        this.raise(start, _error.Errors.StaticPrototype);
      }

      if (type === _types2.types.privateName && value === "constructor") {
        this.raise(start, _error.Errors.ConstructorClassPrivateField);
      }

      return this.parsePropertyName(member,
      /* isPrivateNameAllowed */
      true);
    }
  }, {
    key: "parseClassStaticBlock",
    value: function parseClassStaticBlock(classBody, member) {
      var _member$decorators;

      this.expectPlugin("classStaticBlock", member.start); // Start a new lexical scope

      this.scope.enter(_scopeflags.SCOPE_CLASS | _scopeflags.SCOPE_STATIC_BLOCK | _scopeflags.SCOPE_SUPER); // Start a new scope with regard to loop labels

      var oldLabels = this.state.labels;
      this.state.labels = []; // ClassStaticBlockStatementList:
      //   StatementList[~Yield, ~Await, ~Return] opt

      this.prodParam.enter(_productionParameter.PARAM);
      var body = member.body = [];
      this.parseBlockOrModuleBlockBody(body, undefined, false, _types2.types.braceR);
      this.prodParam.exit();
      this.scope.exit();
      this.state.labels = oldLabels;
      classBody.body.push(this.finishNode(member, "StaticBlock"));

      if ((_member$decorators = member.decorators) !== null && _member$decorators !== void 0 && _member$decorators.length) {
        this.raise(member.start, _error.Errors.DecoratorStaticBlock);
      }
    }
  }, {
    key: "pushClassProperty",
    value: function pushClassProperty(classBody, prop) {
      if (!prop.computed && (prop.key.name === "constructor" || prop.key.value === "constructor")) {
        // Non-computed field, which is either an identifier named "constructor"
        // or a string literal named "constructor"
        this.raise(prop.key.start, _error.Errors.ConstructorClassField);
      }

      classBody.body.push(this.parseClassProperty(prop));
    }
  }, {
    key: "pushClassPrivateProperty",
    value: function pushClassPrivateProperty(classBody, prop) {
      var node = this.parseClassPrivateProperty(prop);
      classBody.body.push(node);
      this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), _scopeflags.CLASS_ELEMENT_OTHER, node.key.start);
    }
  }, {
    key: "pushClassMethod",
    value: function pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
      classBody.body.push(this.parseMethod(method, isGenerator, isAsync, isConstructor, allowsDirectSuper, "ClassMethod", true));
    }
  }, {
    key: "pushClassPrivateMethod",
    value: function pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
      var node = this.parseMethod(method, isGenerator, isAsync,
      /* isConstructor */
      false, false, "ClassPrivateMethod", true);
      classBody.body.push(node);
      var kind = node.kind === "get" ? node["static"] ? _scopeflags.CLASS_ELEMENT_STATIC_GETTER : _scopeflags.CLASS_ELEMENT_INSTANCE_GETTER : node.kind === "set" ? node["static"] ? _scopeflags.CLASS_ELEMENT_STATIC_SETTER : _scopeflags.CLASS_ELEMENT_INSTANCE_SETTER : _scopeflags.CLASS_ELEMENT_OTHER;
      this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), kind, node.key.start);
    } // Overridden in typescript.js

  }, {
    key: "parsePostMemberNameModifiers",
    value: function parsePostMemberNameModifiers( // eslint-disable-next-line no-unused-vars
    methodOrProp) {} // https://tc39.es/proposal-class-fields/#prod-FieldDefinition

  }, {
    key: "parseClassPrivateProperty",
    value: function parseClassPrivateProperty(node) {
      this.parseInitializer(node);
      this.semicolon();
      return this.finishNode(node, "ClassPrivateProperty");
    } // https://tc39.es/proposal-class-fields/#prod-FieldDefinition

  }, {
    key: "parseClassProperty",
    value: function parseClassProperty(node) {
      this.parseInitializer(node);
      this.semicolon();
      return this.finishNode(node, "ClassProperty");
    } // https://tc39.es/proposal-class-fields/#prod-Initializer

  }, {
    key: "parseInitializer",
    value: function parseInitializer(node) {
      this.scope.enter(_scopeflags.SCOPE_CLASS | _scopeflags.SCOPE_SUPER);
      this.expressionScope.enter((0, _expressionScope.newExpressionScope)());
      this.prodParam.enter(_productionParameter.PARAM);
      node.value = this.eat(_types2.types.eq) ? this.parseMaybeAssignAllowIn() : null;
      this.expressionScope.exit();
      this.prodParam.exit();
      this.scope.exit();
    }
  }, {
    key: "parseClassId",
    value: function parseClassId(node, isStatement, optionalId) {
      var bindingType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _scopeflags.BIND_CLASS;

      if (this.match(_types2.types.name)) {
        node.id = this.parseIdentifier();

        if (isStatement) {
          this.checkLVal(node.id, "class name", bindingType);
        }
      } else {
        if (optionalId || !isStatement) {
          node.id = null;
        } else {
          this.unexpected(null, _error.Errors.MissingClassName);
        }
      }
    } // https://tc39.es/ecma262/#prod-ClassHeritage

  }, {
    key: "parseClassSuper",
    value: function parseClassSuper(node) {
      node.superClass = this.eat(_types2.types._extends) ? this.parseExprSubscripts() : null;
    } // Parses module export declaration.
    // https://tc39.es/ecma262/#prod-ExportDeclaration

  }, {
    key: "parseExport",
    value: function parseExport(node) {
      var hasDefault = this.maybeParseExportDefaultSpecifier(node);
      var parseAfterDefault = !hasDefault || this.eat(_types2.types.comma);
      var hasStar = parseAfterDefault && this.eatExportStar(node);
      var hasNamespace = hasStar && this.maybeParseExportNamespaceSpecifier(node);
      var parseAfterNamespace = parseAfterDefault && (!hasNamespace || this.eat(_types2.types.comma));
      var isFromRequired = hasDefault || hasStar;

      if (hasStar && !hasNamespace) {
        if (hasDefault) this.unexpected();
        this.parseExportFrom(node, true);
        return this.finishNode(node, "ExportAllDeclaration");
      }

      var hasSpecifiers = this.maybeParseExportNamedSpecifiers(node);

      if (hasDefault && parseAfterDefault && !hasStar && !hasSpecifiers || hasNamespace && parseAfterNamespace && !hasSpecifiers) {
        throw this.unexpected(null, _types2.types.braceL);
      }

      var hasDeclaration;

      if (isFromRequired || hasSpecifiers) {
        hasDeclaration = false;
        this.parseExportFrom(node, isFromRequired);
      } else {
        hasDeclaration = this.maybeParseExportDeclaration(node);
      }

      if (isFromRequired || hasSpecifiers || hasDeclaration) {
        this.checkExport(node, true, false, !!node.source);
        return this.finishNode(node, "ExportNamedDeclaration");
      }

      if (this.eat(_types2.types._default)) {
        // export default ...
        node.declaration = this.parseExportDefaultExpression();
        this.checkExport(node, true, true);
        return this.finishNode(node, "ExportDefaultDeclaration");
      }

      throw this.unexpected(null, _types2.types.braceL);
    } // eslint-disable-next-line no-unused-vars

  }, {
    key: "eatExportStar",
    value: function eatExportStar(node) {
      return this.eat(_types2.types.star);
    }
  }, {
    key: "maybeParseExportDefaultSpecifier",
    value: function maybeParseExportDefaultSpecifier(node) {
      if (this.isExportDefaultSpecifier()) {
        // export defaultObj ...
        this.expectPlugin("exportDefaultFrom");
        var specifier = this.startNode();
        specifier.exported = this.parseIdentifier(true);
        node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
        return true;
      }

      return false;
    }
  }, {
    key: "maybeParseExportNamespaceSpecifier",
    value: function maybeParseExportNamespaceSpecifier(node) {
      if (this.isContextual("as")) {
        if (!node.specifiers) node.specifiers = [];
        var specifier = this.startNodeAt(this.state.lastTokStart, this.state.lastTokStartLoc);
        this.next();
        specifier.exported = this.parseModuleExportName();
        node.specifiers.push(this.finishNode(specifier, "ExportNamespaceSpecifier"));
        return true;
      }

      return false;
    }
  }, {
    key: "maybeParseExportNamedSpecifiers",
    value: function maybeParseExportNamedSpecifiers(node) {
      if (this.match(_types2.types.braceL)) {
        var _node$specifiers;

        if (!node.specifiers) node.specifiers = [];

        (_node$specifiers = node.specifiers).push.apply(_node$specifiers, _toConsumableArray(this.parseExportSpecifiers()));

        node.source = null;
        node.declaration = null;
        return true;
      }

      return false;
    }
  }, {
    key: "maybeParseExportDeclaration",
    value: function maybeParseExportDeclaration(node) {
      if (this.shouldParseExportDeclaration()) {
        node.specifiers = [];
        node.source = null;
        node.declaration = this.parseExportDeclaration(node);
        return true;
      }

      return false;
    }
  }, {
    key: "isAsyncFunction",
    value: function isAsyncFunction() {
      if (!this.isContextual("async")) return false;
      var next = this.nextTokenStart();
      return !_whitespace.lineBreak.test(this.input.slice(this.state.pos, next)) && this.isUnparsedContextual(next, "function");
    }
  }, {
    key: "parseExportDefaultExpression",
    value: function parseExportDefaultExpression() {
      var expr = this.startNode();
      var isAsync = this.isAsyncFunction();

      if (this.match(_types2.types._function) || isAsync) {
        this.next();

        if (isAsync) {
          this.next();
        }

        return this.parseFunction(expr, FUNC_STATEMENT | FUNC_NULLABLE_ID, isAsync);
      } else if (this.match(_types2.types._class)) {
        return this.parseClass(expr, true, true);
      } else if (this.match(_types2.types.at)) {
        if (this.hasPlugin("decorators") && this.getPluginOption("decorators", "decoratorsBeforeExport")) {
          this.raise(this.state.start, _error.Errors.DecoratorBeforeExport);
        }

        this.parseDecorators(false);
        return this.parseClass(expr, true, true);
      } else if (this.match(_types2.types._const) || this.match(_types2.types._var) || this.isLet()) {
        throw this.raise(this.state.start, _error.Errors.UnsupportedDefaultExport);
      } else {
        var res = this.parseMaybeAssignAllowIn();
        this.semicolon();
        return res;
      }
    } // eslint-disable-next-line no-unused-vars

  }, {
    key: "parseExportDeclaration",
    value: function parseExportDeclaration(node) {
      return this.parseStatement(null);
    }
  }, {
    key: "isExportDefaultSpecifier",
    value: function isExportDefaultSpecifier() {
      if (this.match(_types2.types.name)) {
        var value = this.state.value;

        if (value === "async" && !this.state.containsEsc || value === "let") {
          return false;
        }

        if ((value === "type" || value === "interface") && !this.state.containsEsc) {
          var l = this.lookahead(); // If we see any variable name other than `from` after `type` keyword,
          // we consider it as flow/typescript type exports
          // note that this approach may fail on some pedantic cases
          // export type from = number

          if (l.type === _types2.types.name && l.value !== "from" || l.type === _types2.types.braceL) {
            this.expectOnePlugin(["flow", "typescript"]);
            return false;
          }
        }
      } else if (!this.match(_types2.types._default)) {
        return false;
      }

      var next = this.nextTokenStart();
      var hasFrom = this.isUnparsedContextual(next, "from");

      if (this.input.charCodeAt(next) === charCodes.comma || this.match(_types2.types.name) && hasFrom) {
        return true;
      } // lookahead again when `export default from` is seen


      if (this.match(_types2.types._default) && hasFrom) {
        var nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
        return nextAfterFrom === charCodes.quotationMark || nextAfterFrom === charCodes.apostrophe;
      }

      return false;
    }
  }, {
    key: "parseExportFrom",
    value: function parseExportFrom(node, expect) {
      if (this.eatContextual("from")) {
        node.source = this.parseImportSource();
        this.checkExport(node);
        var assertions = this.maybeParseImportAssertions();

        if (assertions) {
          node.assertions = assertions;
        }
      } else {
        if (expect) {
          this.unexpected();
        } else {
          node.source = null;
        }
      }

      this.semicolon();
    }
  }, {
    key: "shouldParseExportDeclaration",
    value: function shouldParseExportDeclaration() {
      if (this.match(_types2.types.at)) {
        this.expectOnePlugin(["decorators", "decorators-legacy"]);

        if (this.hasPlugin("decorators")) {
          if (this.getPluginOption("decorators", "decoratorsBeforeExport")) {
            this.unexpected(this.state.start, _error.Errors.DecoratorBeforeExport);
          } else {
            return true;
          }
        }
      }

      return this.state.type.keyword === "var" || this.state.type.keyword === "const" || this.state.type.keyword === "function" || this.state.type.keyword === "class" || this.isLet() || this.isAsyncFunction();
    }
  }, {
    key: "checkExport",
    value: function checkExport(node, checkNames, isDefault, isFrom) {
      if (checkNames) {
        // Check for duplicate exports
        if (isDefault) {
          // Default exports
          this.checkDuplicateExports(node, "default");

          if (this.hasPlugin("exportDefaultFrom")) {
            var _declaration$extra;

            var declaration = node.declaration;

            if (declaration.type === "Identifier" && declaration.name === "from" && declaration.end - declaration.start === 4 && // does not contain escape
            !((_declaration$extra = declaration.extra) !== null && _declaration$extra !== void 0 && _declaration$extra.parenthesized)) {
              this.raise(declaration.start, _error.Errors.ExportDefaultFromAsIdentifier);
            }
          }
        } else if (node.specifiers && node.specifiers.length) {
          // Named exports
          var _iterator2 = _createForOfIteratorHelper(node.specifiers),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var specifier = _step2.value;
              var exported = specifier.exported;
              var exportedName = exported.type === "Identifier" ? exported.name : exported.value;
              this.checkDuplicateExports(specifier, exportedName); // $FlowIgnore

              if (!isFrom && specifier.local) {
                var local = specifier.local;

                if (local.type !== "Identifier") {
                  this.raise(specifier.start, _error.Errors.ExportBindingIsString, local.value, exportedName);
                } else {
                  // check for keywords used as local names
                  this.checkReservedWord(local.name, local.start, true, false); // check if export is defined

                  this.scope.checkLocalExport(local);
                }
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        } else if (node.declaration) {
          // Exported declarations
          if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
            var id = node.declaration.id;
            if (!id) throw new Error("Assertion failure");
            this.checkDuplicateExports(node, id.name);
          } else if (node.declaration.type === "VariableDeclaration") {
            var _iterator3 = _createForOfIteratorHelper(node.declaration.declarations),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _declaration = _step3.value;
                this.checkDeclaration(_declaration.id);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
        }
      }

      var currentContextDecorators = this.state.decoratorStack[this.state.decoratorStack.length - 1]; // If node.declaration is a class, it will take all decorators in the current context.
      // Thus we should throw if we see non-empty decorators here.

      if (currentContextDecorators.length) {
        throw this.raise(node.start, _error.Errors.UnsupportedDecoratorExport);
      }
    }
  }, {
    key: "checkDeclaration",
    value: function checkDeclaration(node) {
      if (node.type === "Identifier") {
        this.checkDuplicateExports(node, node.name);
      } else if (node.type === "ObjectPattern") {
        var _iterator4 = _createForOfIteratorHelper(node.properties),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var prop = _step4.value;
            this.checkDeclaration(prop);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      } else if (node.type === "ArrayPattern") {
        var _iterator5 = _createForOfIteratorHelper(node.elements),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var elem = _step5.value;

            if (elem) {
              this.checkDeclaration(elem);
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      } else if (node.type === "ObjectProperty") {
        this.checkDeclaration(node.value);
      } else if (node.type === "RestElement") {
        this.checkDeclaration(node.argument);
      } else if (node.type === "AssignmentPattern") {
        this.checkDeclaration(node.left);
      }
    }
  }, {
    key: "checkDuplicateExports",
    value: function checkDuplicateExports(node, name) {
      if (this.exportedIdentifiers.has(name)) {
        this.raise(node.start, name === "default" ? _error.Errors.DuplicateDefaultExport : _error.Errors.DuplicateExport, name);
      }

      this.exportedIdentifiers.add(name);
    } // Parses a comma-separated list of module exports.

  }, {
    key: "parseExportSpecifiers",
    value: function parseExportSpecifiers() {
      var nodes = [];
      var first = true; // export { x, y as z } [from '...']

      this.expect(_types2.types.braceL);

      while (!this.eat(_types2.types.braceR)) {
        if (first) {
          first = false;
        } else {
          this.expect(_types2.types.comma);
          if (this.eat(_types2.types.braceR)) break;
        }

        var node = this.startNode();
        node.local = this.parseModuleExportName();
        node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local.__clone();
        nodes.push(this.finishNode(node, "ExportSpecifier"));
      }

      return nodes;
    } // https://tc39.es/ecma262/#prod-ModuleExportName

  }, {
    key: "parseModuleExportName",
    value: function parseModuleExportName() {
      if (this.match(_types2.types.string)) {
        var result = this.parseStringLiteral(this.state.value);
        var surrogate = result.value.match(loneSurrogate);

        if (surrogate) {
          this.raise(result.start, _error.Errors.ModuleExportNameHasLoneSurrogate, surrogate[0].charCodeAt(0).toString(16));
        }

        return result;
      }

      return this.parseIdentifier(true);
    } // Parses import declaration.
    // https://tc39.es/ecma262/#prod-ImportDeclaration

  }, {
    key: "parseImport",
    value: function parseImport(node) {
      // import '...'
      node.specifiers = [];

      if (!this.match(_types2.types.string)) {
        // check if we have a default import like
        // import React from "react";
        var hasDefault = this.maybeParseDefaultImportSpecifier(node);
        /* we are checking if we do not have a default import, then it is obvious that we need named imports
         * import { get } from "axios";
         * but if we do have a default import
         * we need to check if we have a comma after that and
         * that is where this `|| this.eat` condition comes into play
         */

        var parseNext = !hasDefault || this.eat(_types2.types.comma); // if we do have to parse the next set of specifiers, we first check for star imports
        // import React, * from "react";

        var hasStar = parseNext && this.maybeParseStarImportSpecifier(node); // now we check if we need to parse the next imports
        // but only if they are not importing * (everything)

        if (parseNext && !hasStar) this.parseNamedImportSpecifiers(node);
        this.expectContextual("from");
      }

      node.source = this.parseImportSource(); // https://github.com/tc39/proposal-import-assertions
      // parse module import assertions if the next token is `assert` or ignore
      // and finish the ImportDeclaration node.

      var assertions = this.maybeParseImportAssertions();

      if (assertions) {
        node.assertions = assertions;
      } else if (!process.env.BABEL_8_BREAKING) {
        var attributes = this.maybeParseModuleAttributes();

        if (attributes) {
          node.attributes = attributes;
        }
      }

      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
    }
  }, {
    key: "parseImportSource",
    value: function parseImportSource() {
      if (!this.match(_types2.types.string)) this.unexpected();
      return this.parseExprAtom();
    } // eslint-disable-next-line no-unused-vars

  }, {
    key: "shouldParseDefaultImport",
    value: function shouldParseDefaultImport(node) {
      return this.match(_types2.types.name);
    }
  }, {
    key: "parseImportSpecifierLocal",
    value: function parseImportSpecifierLocal(node, specifier, type, contextDescription) {
      specifier.local = this.parseIdentifier();
      this.checkLVal(specifier.local, contextDescription, _scopeflags.BIND_LEXICAL);
      node.specifiers.push(this.finishNode(specifier, type));
    }
    /**
     * parse assert entries
     *
     * @see {@link https://tc39.es/proposal-import-assertions/#prod-AssertEntries |AssertEntries}
     * @returns {N.ImportAttribute[]}
     * @memberof StatementParser
     */

  }, {
    key: "parseAssertEntries",
    value: function parseAssertEntries() {
      var attrs = [];
      var attrNames = new Set();

      do {
        if (this.match(_types2.types.braceR)) {
          break;
        }

        var node = this.startNode(); // parse AssertionKey : IdentifierName, StringLiteral

        var keyName = this.state.value; // check if we already have an entry for an attribute
        // if a duplicate entry is found, throw an error
        // for now this logic will come into play only when someone declares `type` twice

        if (attrNames.has(keyName)) {
          this.raise(this.state.start, _error.Errors.ModuleAttributesWithDuplicateKeys, keyName);
        }

        attrNames.add(keyName);

        if (this.match(_types2.types.string)) {
          node.key = this.parseStringLiteral(keyName);
        } else {
          node.key = this.parseIdentifier(true);
        }

        this.expect(_types2.types.colon);

        if (!this.match(_types2.types.string)) {
          throw this.unexpected(this.state.start, _error.Errors.ModuleAttributeInvalidValue);
        }

        node.value = this.parseStringLiteral(this.state.value);
        this.finishNode(node, "ImportAttribute");
        attrs.push(node);
      } while (this.eat(_types2.types.comma));

      return attrs;
    }
    /**
     * parse module attributes
     * @deprecated It will be removed in Babel 8
     * @returns
     * @memberof StatementParser
     */

  }, {
    key: "maybeParseModuleAttributes",
    value: function maybeParseModuleAttributes() {
      if (this.match(_types2.types._with) && !this.hasPrecedingLineBreak()) {
        this.expectPlugin("moduleAttributes");
        this.next();
      } else {
        if (this.hasPlugin("moduleAttributes")) return [];
        return null;
      }

      var attrs = [];
      var attributes = new Set();

      do {
        var node = this.startNode();
        node.key = this.parseIdentifier(true);

        if (node.key.name !== "type") {
          this.raise(node.key.start, _error.Errors.ModuleAttributeDifferentFromType, node.key.name);
        }

        if (attributes.has(node.key.name)) {
          this.raise(node.key.start, _error.Errors.ModuleAttributesWithDuplicateKeys, node.key.name);
        }

        attributes.add(node.key.name);
        this.expect(_types2.types.colon);

        if (!this.match(_types2.types.string)) {
          throw this.unexpected(this.state.start, _error.Errors.ModuleAttributeInvalidValue);
        }

        node.value = this.parseStringLiteral(this.state.value);
        this.finishNode(node, "ImportAttribute");
        attrs.push(node);
      } while (this.eat(_types2.types.comma));

      return attrs;
    }
  }, {
    key: "maybeParseImportAssertions",
    value: function maybeParseImportAssertions() {
      // [no LineTerminator here] AssertClause
      if (this.isContextual("assert") && !this.hasPrecedingLineBreak()) {
        this.expectPlugin("importAssertions");
        this.next(); // eat `assert`
      } else {
        if (this.hasPlugin("importAssertions")) return [];
        return null;
      } // https://tc39.es/proposal-import-assertions/#prod-AssertClause


      this.eat(_types2.types.braceL);
      var attrs = this.parseAssertEntries();
      this.eat(_types2.types.braceR);
      return attrs;
    }
  }, {
    key: "maybeParseDefaultImportSpecifier",
    value: function maybeParseDefaultImportSpecifier(node) {
      if (this.shouldParseDefaultImport(node)) {
        // import defaultObj, { x, y as z } from '...'
        this.parseImportSpecifierLocal(node, this.startNode(), "ImportDefaultSpecifier", "default import specifier");
        return true;
      }

      return false;
    }
  }, {
    key: "maybeParseStarImportSpecifier",
    value: function maybeParseStarImportSpecifier(node) {
      if (this.match(_types2.types.star)) {
        var specifier = this.startNode();
        this.next();
        this.expectContextual("as");
        this.parseImportSpecifierLocal(node, specifier, "ImportNamespaceSpecifier", "import namespace specifier");
        return true;
      }

      return false;
    }
  }, {
    key: "parseNamedImportSpecifiers",
    value: function parseNamedImportSpecifiers(node) {
      var first = true;
      this.expect(_types2.types.braceL);

      while (!this.eat(_types2.types.braceR)) {
        if (first) {
          first = false;
        } else {
          // Detect an attempt to deep destructure
          if (this.eat(_types2.types.colon)) {
            throw this.raise(this.state.start, _error.Errors.DestructureNamedImport);
          }

          this.expect(_types2.types.comma);
          if (this.eat(_types2.types.braceR)) break;
        }

        this.parseImportSpecifier(node);
      }
    } // https://tc39.es/ecma262/#prod-ImportSpecifier

  }, {
    key: "parseImportSpecifier",
    value: function parseImportSpecifier(node) {
      var specifier = this.startNode();
      var importedIsString = this.match(_types2.types.string);
      specifier.imported = this.parseModuleExportName();

      if (this.eatContextual("as")) {
        specifier.local = this.parseIdentifier();
      } else {
        var imported = specifier.imported;

        if (importedIsString) {
          throw this.raise(specifier.start, _error.Errors.ImportBindingIsString, imported.value);
        }

        this.checkReservedWord(imported.name, specifier.start, true, true);
        specifier.local = imported.__clone();
      }

      this.checkLVal(specifier.local, "import specifier", _scopeflags.BIND_LEXICAL);
      node.specifiers.push(this.finishNode(specifier, "ImportSpecifier"));
    } // This is used in flow and typescript plugin
    // Determine whether a parameter is a this param

  }, {
    key: "isThisParam",
    value: function isThisParam(param) {
      return param.type === "Identifier" && param.name === "this";
    }
  }]);

  return StatementParser;
}(_expression["default"]);

exports["default"] = StatementParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvc3RhdGVtZW50LmpzIl0sIm5hbWVzIjpbImxvb3BMYWJlbCIsImtpbmQiLCJzd2l0Y2hMYWJlbCIsIkZVTkNfTk9fRkxBR1MiLCJGVU5DX1NUQVRFTUVOVCIsIkZVTkNfSEFOR0lOR19TVEFURU1FTlQiLCJGVU5DX05VTExBQkxFX0lEIiwibG9uZVN1cnJvZ2F0ZSIsImtleXdvcmRSZWxhdGlvbmFsT3BlcmF0b3IiLCJiYWJlbDdDb21wYXRUb2tlbnMiLCJ0b2tlbnMiLCJwcm9jZXNzIiwiZW52IiwiQkFCRUxfOF9CUkVBS0lORyIsImkiLCJsZW5ndGgiLCJ0b2tlbiIsInR5cGUiLCJ0dCIsInByaXZhdGVOYW1lIiwibG9jIiwic3RhcnQiLCJ2YWx1ZSIsImVuZCIsImhhc2hFbmRQb3MiLCJoYXNoRW5kTG9jIiwiUG9zaXRpb24iLCJsaW5lIiwiY29sdW1uIiwic3BsaWNlIiwiVG9rZW4iLCJoYXNoIiwic3RhcnRMb2MiLCJlbmRMb2MiLCJuYW1lIiwiU3RhdGVtZW50UGFyc2VyIiwiZmlsZSIsInByb2dyYW0iLCJwYXJzZVByb2dyYW0iLCJjb21tZW50cyIsInN0YXRlIiwib3B0aW9ucyIsImZpbmlzaE5vZGUiLCJlb2YiLCJzb3VyY2VUeXBlIiwiaW50ZXJwcmV0ZXIiLCJwYXJzZUludGVycHJldGVyRGlyZWN0aXZlIiwicGFyc2VCbG9ja0JvZHkiLCJpbk1vZHVsZSIsImFsbG93VW5kZWNsYXJlZEV4cG9ydHMiLCJzY29wZSIsInVuZGVmaW5lZEV4cG9ydHMiLCJzaXplIiwiQXJyYXkiLCJmcm9tIiwicG9zIiwiZ2V0IiwicmFpc2UiLCJFcnJvcnMiLCJNb2R1bGVFeHBvcnRVbmRlZmluZWQiLCJzdG10IiwiZXhwciIsImV4cHJlc3Npb24iLCJkaXJlY3RpdmVMaXRlcmFsIiwic3RhcnROb2RlQXQiLCJkaXJlY3RpdmUiLCJyYXciLCJpbnB1dCIsInNsaWNlIiwidmFsIiwiYWRkRXh0cmEiLCJmaW5pc2hOb2RlQXQiLCJtYXRjaCIsImludGVycHJldGVyRGlyZWN0aXZlIiwibm9kZSIsInN0YXJ0Tm9kZSIsIm5leHQiLCJjb250ZXh0IiwiaXNDb250ZXh0dWFsIiwiaXNMZXRLZXl3b3JkIiwibmV4dFRva2VuU3RhcnQiLCJuZXh0Q2giLCJjb2RlUG9pbnRBdFBvcyIsImNoYXJDb2RlcyIsImJhY2tzbGFzaCIsImxlZnRTcXVhcmVCcmFja2V0IiwibGVmdEN1cmx5QnJhY2UiLCJsYXN0SW5kZXgiLCJtYXRjaGVkIiwiZXhlYyIsImVuZENoIiwidG9wTGV2ZWwiLCJhdCIsInBhcnNlRGVjb3JhdG9ycyIsInBhcnNlU3RhdGVtZW50Q29udGVudCIsInN0YXJ0dHlwZSIsImlzTGV0IiwiX3ZhciIsIl9icmVhayIsIl9jb250aW51ZSIsInBhcnNlQnJlYWtDb250aW51ZVN0YXRlbWVudCIsImtleXdvcmQiLCJfZGVidWdnZXIiLCJwYXJzZURlYnVnZ2VyU3RhdGVtZW50IiwiX2RvIiwicGFyc2VEb1N0YXRlbWVudCIsIl9mb3IiLCJwYXJzZUZvclN0YXRlbWVudCIsIl9mdW5jdGlvbiIsImxvb2thaGVhZENoYXJDb2RlIiwiZG90Iiwic3RyaWN0IiwiU3RyaWN0RnVuY3Rpb24iLCJTbG9wcHlGdW5jdGlvbiIsInBhcnNlRnVuY3Rpb25TdGF0ZW1lbnQiLCJfY2xhc3MiLCJ1bmV4cGVjdGVkIiwicGFyc2VDbGFzcyIsIl9pZiIsInBhcnNlSWZTdGF0ZW1lbnQiLCJfcmV0dXJuIiwicGFyc2VSZXR1cm5TdGF0ZW1lbnQiLCJfc3dpdGNoIiwicGFyc2VTd2l0Y2hTdGF0ZW1lbnQiLCJfdGhyb3ciLCJwYXJzZVRocm93U3RhdGVtZW50IiwiX3RyeSIsInBhcnNlVHJ5U3RhdGVtZW50IiwiX2NvbnN0IiwiVW5leHBlY3RlZExleGljYWxEZWNsYXJhdGlvbiIsInBhcnNlVmFyU3RhdGVtZW50IiwiX3doaWxlIiwicGFyc2VXaGlsZVN0YXRlbWVudCIsIl93aXRoIiwicGFyc2VXaXRoU3RhdGVtZW50IiwiYnJhY2VMIiwicGFyc2VCbG9jayIsInNlbWkiLCJwYXJzZUVtcHR5U3RhdGVtZW50IiwiX2ltcG9ydCIsIm5leHRUb2tlbkNoYXJDb2RlIiwibGVmdFBhcmVudGhlc2lzIiwiX2V4cG9ydCIsImFsbG93SW1wb3J0RXhwb3J0RXZlcnl3aGVyZSIsIlVuZXhwZWN0ZWRJbXBvcnRFeHBvcnQiLCJyZXN1bHQiLCJwYXJzZUltcG9ydCIsImltcG9ydEtpbmQiLCJzYXdVbmFtYmlndW91c0VTTSIsInBhcnNlRXhwb3J0IiwiZXhwb3J0S2luZCIsImFzc2VydE1vZHVsZU5vZGVBbGxvd2VkIiwiaXNBc3luY0Z1bmN0aW9uIiwiQXN5bmNGdW5jdGlvbkluU2luZ2xlU3RhdGVtZW50Q29udGV4dCIsIm1heWJlTmFtZSIsInBhcnNlRXhwcmVzc2lvbiIsImVhdCIsImNvbG9uIiwicGFyc2VMYWJlbGVkU3RhdGVtZW50IiwicGFyc2VFeHByZXNzaW9uU3RhdGVtZW50IiwiU291cmNlVHlwZU1vZHVsZUVycm9ycyIsIkltcG9ydE91dHNpZGVNb2R1bGUiLCJkZWNvcmF0b3JzIiwiZGVjb3JhdG9yU3RhY2siLCJyZXNldFN0YXJ0TG9jYXRpb25Gcm9tTm9kZSIsImFsbG93RXhwb3J0IiwiY3VycmVudENvbnRleHREZWNvcmF0b3JzIiwiZGVjb3JhdG9yIiwicGFyc2VEZWNvcmF0b3IiLCJwdXNoIiwiaGFzUGx1Z2luIiwiZ2V0UGx1Z2luT3B0aW9uIiwiRGVjb3JhdG9yRXhwb3J0Q2xhc3MiLCJjYW5IYXZlTGVhZGluZ0RlY29yYXRvciIsIlVuZXhwZWN0ZWRMZWFkaW5nRGVjb3JhdG9yIiwiZXhwZWN0T25lUGx1Z2luIiwic3RhcnRQb3MiLCJwYXJlbkwiLCJleHBlY3QiLCJwYXJlblIiLCJwYXJzZUlkZW50aWZpZXIiLCJvYmplY3QiLCJwcm9wZXJ0eSIsImNvbXB1dGVkIiwicGFyc2VNYXliZURlY29yYXRvckFyZ3VtZW50cyIsInBvcCIsInBhcnNlRXhwclN1YnNjcmlwdHMiLCJzdGFydE5vZGVBdE5vZGUiLCJjYWxsZWUiLCJhcmd1bWVudHMiLCJwYXJzZUNhbGxFeHByZXNzaW9uQXJndW1lbnRzIiwidG9SZWZlcmVuY2VkTGlzdCIsImlzQnJlYWsiLCJpc0xpbmVUZXJtaW5hdG9yIiwibGFiZWwiLCJzZW1pY29sb24iLCJ2ZXJpZnlCcmVha0NvbnRpbnVlIiwibGFiZWxzIiwibGFiIiwiSWxsZWdhbEJyZWFrQ29udGludWUiLCJib2R5Iiwid2l0aFRvcGljRm9yYmlkZGluZ0NvbnRleHQiLCJwYXJzZVN0YXRlbWVudCIsInRlc3QiLCJwYXJzZUhlYWRlckV4cHJlc3Npb24iLCJhd2FpdEF0IiwiaXNBd2FpdEFsbG93ZWQiLCJlYXRDb250ZXh0dWFsIiwibGFzdFRva1N0YXJ0IiwiZW50ZXIiLCJTQ09QRV9PVEhFUiIsInBhcnNlRm9yIiwic3RhcnRzV2l0aExldCIsImluaXQiLCJwYXJzZVZhciIsIl9pbiIsImRlY2xhcmF0aW9ucyIsInBhcnNlRm9ySW4iLCJzdGFydHNXaXRoVW5lc2NhcGVkTmFtZSIsImNvbnRhaW5zRXNjIiwicmVmRXhwcmVzc2lvbkVycm9ycyIsIkV4cHJlc3Npb25FcnJvcnMiLCJpc0Zvck9mIiwiRm9yT2ZMZXQiLCJGb3JPZkFzeW5jIiwidG9Bc3NpZ25hYmxlIiwiZGVzY3JpcHRpb24iLCJjaGVja0xWYWwiLCJjaGVja0V4cHJlc3Npb25FcnJvcnMiLCJpc0FzeW5jIiwiZGVjbGFyYXRpb25Qb3NpdGlvbiIsInBhcnNlRnVuY3Rpb24iLCJjb25zZXF1ZW50IiwiYWx0ZXJuYXRlIiwiX2Vsc2UiLCJwcm9kUGFyYW0iLCJoYXNSZXR1cm4iLCJhbGxvd1JldHVybk91dHNpZGVGdW5jdGlvbiIsIklsbGVnYWxSZXR1cm4iLCJhcmd1bWVudCIsImRpc2NyaW1pbmFudCIsImNhc2VzIiwiY3VyIiwic2F3RGVmYXVsdCIsImJyYWNlUiIsIl9jYXNlIiwiX2RlZmF1bHQiLCJpc0Nhc2UiLCJNdWx0aXBsZURlZmF1bHRzSW5Td2l0Y2giLCJleGl0IiwiaGFzUHJlY2VkaW5nTGluZUJyZWFrIiwibGFzdFRva0VuZCIsIk5ld2xpbmVBZnRlclRocm93IiwicGFyYW0iLCJwYXJzZUJpbmRpbmdBdG9tIiwic2ltcGxlIiwiU0NPUEVfU0lNUExFX0NBVENIIiwiQklORF9MRVhJQ0FMIiwiYmxvY2siLCJoYW5kbGVyIiwiX2NhdGNoIiwiY2xhdXNlIiwicGFyc2VDYXRjaENsYXVzZVBhcmFtIiwiZmluYWxpemVyIiwiX2ZpbmFsbHkiLCJOb0NhdGNoT3JGaW5hbGx5IiwiU3RyaWN0V2l0aCIsIkxhYmVsUmVkZWNsYXJhdGlvbiIsImlzTG9vcCIsInN0YXRlbWVudFN0YXJ0IiwiaW5kZXhPZiIsImFsbG93RGlyZWN0aXZlcyIsImNyZWF0ZU5ld0xleGljYWxTY29wZSIsImFmdGVyQmxvY2tQYXJzZSIsInN0cmljdEVycm9ycyIsImNsZWFyIiwiZXh0cmEiLCJwYXJlbnRoZXNpemVkIiwiZGlyZWN0aXZlcyIsInBhcnNlQmxvY2tPck1vZHVsZUJsb2NrQm9keSIsInVuZGVmaW5lZCIsIm9sZFN0cmljdCIsImhhc1N0cmljdE1vZGVEaXJlY3RpdmUiLCJwYXJzZWROb25EaXJlY3RpdmUiLCJpc1ZhbGlkRGlyZWN0aXZlIiwic3RtdFRvRGlyZWN0aXZlIiwic2V0U3RyaWN0IiwiY2FsbCIsInVwZGF0ZSIsImlzRm9ySW4iLCJpZCIsIkZvckluT2ZMb29wSW5pdGlhbGl6ZXIiLCJJbnZhbGlkTGhzIiwibGVmdCIsInJpZ2h0IiwicGFyc2VNYXliZUFzc2lnbkFsbG93SW4iLCJpc0ZvciIsImlzVHlwZXNjcmlwdCIsImRlY2wiLCJwYXJzZVZhcklkIiwiZXEiLCJwYXJzZU1heWJlQXNzaWduRGlzYWxsb3dJbiIsIkRlY2xhcmF0aW9uTWlzc2luZ0luaXRpYWxpemVyIiwiY29tbWEiLCJCSU5EX1ZBUiIsInN0YXRlbWVudCIsImlzTGl2ZSIsImlzU3RhdGVtZW50IiwiaXNIYW5naW5nU3RhdGVtZW50IiwicmVxdWlyZUlkIiwiaW5pdEZ1bmN0aW9uIiwic3RhciIsIkdlbmVyYXRvckluU2luZ2xlU3RhdGVtZW50Q29udGV4dCIsImdlbmVyYXRvciIsInBhcnNlRnVuY3Rpb25JZCIsIm9sZE1heWJlSW5BcnJvd1BhcmFtZXRlcnMiLCJtYXliZUluQXJyb3dQYXJhbWV0ZXJzIiwiU0NPUEVfRlVOQ1RJT04iLCJwYXJzZUZ1bmN0aW9uUGFyYW1zIiwicGFyc2VGdW5jdGlvbkJvZHlBbmRGaW5pc2giLCJyZWdpc3RlckZ1bmN0aW9uU3RhdGVtZW50SWQiLCJhbGxvd01vZGlmaWVycyIsImV4cHJlc3Npb25TY29wZSIsInBhcmFtcyIsInBhcnNlQmluZGluZ0xpc3QiLCJyaWdodFBhcmVudGhlc2lzIiwiZGVjbGFyZU5hbWUiLCJhc3luYyIsInRyZWF0RnVuY3Rpb25zQXNWYXIiLCJCSU5EX0ZVTkNUSU9OIiwib3B0aW9uYWxJZCIsInRha2VEZWNvcmF0b3JzIiwicGFyc2VDbGFzc0lkIiwicGFyc2VDbGFzc1N1cGVyIiwicGFyc2VDbGFzc0JvZHkiLCJzdXBlckNsYXNzIiwibWV0aG9kIiwia2V5IiwiaGFkU3VwZXJDbGFzcyIsImNsYXNzU2NvcGUiLCJoYWRDb25zdHJ1Y3RvciIsImNsYXNzQm9keSIsIkRlY29yYXRvclNlbWljb2xvbiIsIm1lbWJlciIsInBhcnNlQ2xhc3NNZW1iZXIiLCJEZWNvcmF0b3JDb25zdHJ1Y3RvciIsIlRyYWlsaW5nRGVjb3JhdG9yIiwiaXNDbGFzc01ldGhvZCIsInB1c2hDbGFzc01ldGhvZCIsImlzQ2xhc3NQcm9wZXJ0eSIsInByb3AiLCJwYXJzZUNsYXNzUHJvcGVydHkiLCJpc1N0YXRpYyIsInBhcnNlQ2xhc3NNZW1iZXJGcm9tTW9kaWZpZXIiLCJwYXJzZUNsYXNzU3RhdGljQmxvY2siLCJwYXJzZUNsYXNzTWVtYmVyV2l0aElzU3RhdGljIiwicHVibGljTWV0aG9kIiwicHJpdmF0ZU1ldGhvZCIsInB1YmxpY1Byb3AiLCJwcml2YXRlUHJvcCIsInB1YmxpY01lbWJlciIsImlzUHJpdmF0ZU5hbWUiLCJwYXJzZUNsYXNzRWxlbWVudE5hbWUiLCJwdXNoQ2xhc3NQcml2YXRlTWV0aG9kIiwiaXNOb25zdGF0aWNDb25zdHJ1Y3RvciIsIkNvbnN0cnVjdG9ySXNHZW5lcmF0b3IiLCJpc1ByaXZhdGUiLCJpc1NpbXBsZSIsIm1heWJlUXVlc3Rpb25Ub2tlblN0YXJ0IiwicGFyc2VQb3N0TWVtYmVyTmFtZU1vZGlmaWVycyIsImlzQ29uc3RydWN0b3IiLCJhbGxvd3NEaXJlY3RTdXBlciIsIkR1cGxpY2F0ZUNvbnN0cnVjdG9yIiwib3ZlcnJpZGUiLCJPdmVycmlkZU9uQ29uc3RydWN0b3IiLCJwdXNoQ2xhc3NQcml2YXRlUHJvcGVydHkiLCJwdXNoQ2xhc3NQcm9wZXJ0eSIsImlzR2VuZXJhdG9yIiwib3B0aW9uYWwiLCJDb25zdHJ1Y3RvcklzQXN5bmMiLCJDb25zdHJ1Y3RvcklzQWNjZXNzb3IiLCJjaGVja0dldHRlclNldHRlclBhcmFtcyIsInN0cmluZyIsIlN0YXRpY1Byb3RvdHlwZSIsIkNvbnN0cnVjdG9yQ2xhc3NQcml2YXRlRmllbGQiLCJwYXJzZVByb3BlcnR5TmFtZSIsImV4cGVjdFBsdWdpbiIsIlNDT1BFX0NMQVNTIiwiU0NPUEVfU1RBVElDX0JMT0NLIiwiU0NPUEVfU1VQRVIiLCJvbGRMYWJlbHMiLCJQQVJBTSIsIkRlY29yYXRvclN0YXRpY0Jsb2NrIiwiQ29uc3RydWN0b3JDbGFzc0ZpZWxkIiwicGFyc2VDbGFzc1ByaXZhdGVQcm9wZXJ0eSIsImRlY2xhcmVQcml2YXRlTmFtZSIsImdldFByaXZhdGVOYW1lU1YiLCJDTEFTU19FTEVNRU5UX09USEVSIiwicGFyc2VNZXRob2QiLCJDTEFTU19FTEVNRU5UX1NUQVRJQ19HRVRURVIiLCJDTEFTU19FTEVNRU5UX0lOU1RBTkNFX0dFVFRFUiIsIkNMQVNTX0VMRU1FTlRfU1RBVElDX1NFVFRFUiIsIkNMQVNTX0VMRU1FTlRfSU5TVEFOQ0VfU0VUVEVSIiwibWV0aG9kT3JQcm9wIiwicGFyc2VJbml0aWFsaXplciIsImJpbmRpbmdUeXBlIiwiQklORF9DTEFTUyIsIk1pc3NpbmdDbGFzc05hbWUiLCJfZXh0ZW5kcyIsImhhc0RlZmF1bHQiLCJtYXliZVBhcnNlRXhwb3J0RGVmYXVsdFNwZWNpZmllciIsInBhcnNlQWZ0ZXJEZWZhdWx0IiwiaGFzU3RhciIsImVhdEV4cG9ydFN0YXIiLCJoYXNOYW1lc3BhY2UiLCJtYXliZVBhcnNlRXhwb3J0TmFtZXNwYWNlU3BlY2lmaWVyIiwicGFyc2VBZnRlck5hbWVzcGFjZSIsImlzRnJvbVJlcXVpcmVkIiwicGFyc2VFeHBvcnRGcm9tIiwiaGFzU3BlY2lmaWVycyIsIm1heWJlUGFyc2VFeHBvcnROYW1lZFNwZWNpZmllcnMiLCJoYXNEZWNsYXJhdGlvbiIsIm1heWJlUGFyc2VFeHBvcnREZWNsYXJhdGlvbiIsImNoZWNrRXhwb3J0Iiwic291cmNlIiwiZGVjbGFyYXRpb24iLCJwYXJzZUV4cG9ydERlZmF1bHRFeHByZXNzaW9uIiwiaXNFeHBvcnREZWZhdWx0U3BlY2lmaWVyIiwic3BlY2lmaWVyIiwiZXhwb3J0ZWQiLCJzcGVjaWZpZXJzIiwibGFzdFRva1N0YXJ0TG9jIiwicGFyc2VNb2R1bGVFeHBvcnROYW1lIiwicGFyc2VFeHBvcnRTcGVjaWZpZXJzIiwic2hvdWxkUGFyc2VFeHBvcnREZWNsYXJhdGlvbiIsInBhcnNlRXhwb3J0RGVjbGFyYXRpb24iLCJsaW5lQnJlYWsiLCJpc1VucGFyc2VkQ29udGV4dHVhbCIsIkRlY29yYXRvckJlZm9yZUV4cG9ydCIsIlVuc3VwcG9ydGVkRGVmYXVsdEV4cG9ydCIsInJlcyIsImwiLCJsb29rYWhlYWQiLCJoYXNGcm9tIiwiY2hhckNvZGVBdCIsIm5leHRBZnRlckZyb20iLCJuZXh0VG9rZW5TdGFydFNpbmNlIiwicXVvdGF0aW9uTWFyayIsImFwb3N0cm9waGUiLCJwYXJzZUltcG9ydFNvdXJjZSIsImFzc2VydGlvbnMiLCJtYXliZVBhcnNlSW1wb3J0QXNzZXJ0aW9ucyIsImNoZWNrTmFtZXMiLCJpc0RlZmF1bHQiLCJpc0Zyb20iLCJjaGVja0R1cGxpY2F0ZUV4cG9ydHMiLCJFeHBvcnREZWZhdWx0RnJvbUFzSWRlbnRpZmllciIsImV4cG9ydGVkTmFtZSIsImxvY2FsIiwiRXhwb3J0QmluZGluZ0lzU3RyaW5nIiwiY2hlY2tSZXNlcnZlZFdvcmQiLCJjaGVja0xvY2FsRXhwb3J0IiwiRXJyb3IiLCJjaGVja0RlY2xhcmF0aW9uIiwiVW5zdXBwb3J0ZWREZWNvcmF0b3JFeHBvcnQiLCJwcm9wZXJ0aWVzIiwiZWxlbWVudHMiLCJlbGVtIiwiZXhwb3J0ZWRJZGVudGlmaWVycyIsImhhcyIsIkR1cGxpY2F0ZURlZmF1bHRFeHBvcnQiLCJEdXBsaWNhdGVFeHBvcnQiLCJhZGQiLCJub2RlcyIsImZpcnN0IiwiX19jbG9uZSIsInBhcnNlU3RyaW5nTGl0ZXJhbCIsInN1cnJvZ2F0ZSIsIk1vZHVsZUV4cG9ydE5hbWVIYXNMb25lU3Vycm9nYXRlIiwidG9TdHJpbmciLCJtYXliZVBhcnNlRGVmYXVsdEltcG9ydFNwZWNpZmllciIsInBhcnNlTmV4dCIsIm1heWJlUGFyc2VTdGFySW1wb3J0U3BlY2lmaWVyIiwicGFyc2VOYW1lZEltcG9ydFNwZWNpZmllcnMiLCJleHBlY3RDb250ZXh0dWFsIiwiYXR0cmlidXRlcyIsIm1heWJlUGFyc2VNb2R1bGVBdHRyaWJ1dGVzIiwicGFyc2VFeHByQXRvbSIsImNvbnRleHREZXNjcmlwdGlvbiIsImF0dHJzIiwiYXR0ck5hbWVzIiwiU2V0Iiwia2V5TmFtZSIsIk1vZHVsZUF0dHJpYnV0ZXNXaXRoRHVwbGljYXRlS2V5cyIsIk1vZHVsZUF0dHJpYnV0ZUludmFsaWRWYWx1ZSIsIk1vZHVsZUF0dHJpYnV0ZURpZmZlcmVudEZyb21UeXBlIiwicGFyc2VBc3NlcnRFbnRyaWVzIiwic2hvdWxkUGFyc2VEZWZhdWx0SW1wb3J0IiwicGFyc2VJbXBvcnRTcGVjaWZpZXJMb2NhbCIsIkRlc3RydWN0dXJlTmFtZWRJbXBvcnQiLCJwYXJzZUltcG9ydFNwZWNpZmllciIsImltcG9ydGVkSXNTdHJpbmciLCJpbXBvcnRlZCIsIkltcG9ydEJpbmRpbmdJc1N0cmluZyIsIkV4cHJlc3Npb25QYXJzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7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cnQgKiBhcyBOIGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgdHlwZXMgYXMgdHQsIHR5cGUgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL3Rva2VuaXplci90eXBlc1wiO1xuaW1wb3J0IEV4cHJlc3Npb25QYXJzZXIgZnJvbSBcIi4vZXhwcmVzc2lvblwiO1xuaW1wb3J0IHsgRXJyb3JzLCBTb3VyY2VUeXBlTW9kdWxlRXJyb3JzIH0gZnJvbSBcIi4vZXJyb3JcIjtcbmltcG9ydCB7IGlzSWRlbnRpZmllckNoYXIsIGlzSWRlbnRpZmllclN0YXJ0IH0gZnJvbSBcIi4uL3V0aWwvaWRlbnRpZmllclwiO1xuaW1wb3J0IHsgbGluZUJyZWFrIH0gZnJvbSBcIi4uL3V0aWwvd2hpdGVzcGFjZVwiO1xuaW1wb3J0ICogYXMgY2hhckNvZGVzIGZyb20gXCJjaGFyY29kZXNcIjtcbmltcG9ydCB7XG4gIEJJTkRfQ0xBU1MsXG4gIEJJTkRfTEVYSUNBTCxcbiAgQklORF9WQVIsXG4gIEJJTkRfRlVOQ1RJT04sXG4gIFNDT1BFX0NMQVNTLFxuICBTQ09QRV9GVU5DVElPTixcbiAgU0NPUEVfT1RIRVIsXG4gIFNDT1BFX1NJTVBMRV9DQVRDSCxcbiAgU0NPUEVfU1RBVElDX0JMT0NLLFxuICBTQ09QRV9TVVBFUixcbiAgQ0xBU1NfRUxFTUVOVF9PVEhFUixcbiAgQ0xBU1NfRUxFTUVOVF9JTlNUQU5DRV9HRVRURVIsXG4gIENMQVNTX0VMRU1FTlRfSU5TVEFOQ0VfU0VUVEVSLFxuICBDTEFTU19FTEVNRU5UX1NUQVRJQ19HRVRURVIsXG4gIENMQVNTX0VMRU1FTlRfU1RBVElDX1NFVFRFUixcbiAgdHlwZSBCaW5kaW5nVHlwZXMsXG59IGZyb20gXCIuLi91dGlsL3Njb3BlZmxhZ3NcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25FcnJvcnMgfSBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgeyBQQVJBTSwgZnVuY3Rpb25GbGFncyB9IGZyb20gXCIuLi91dGlsL3Byb2R1Y3Rpb24tcGFyYW1ldGVyXCI7XG5pbXBvcnQge1xuICBuZXdFeHByZXNzaW9uU2NvcGUsXG4gIG5ld1BhcmFtZXRlckRlY2xhcmF0aW9uU2NvcGUsXG59IGZyb20gXCIuLi91dGlsL2V4cHJlc3Npb24tc2NvcGVcIjtcbmltcG9ydCB0eXBlIHsgU291cmNlVHlwZSB9IGZyb20gXCIuLi9vcHRpb25zXCI7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gXCIuLi90b2tlbml6ZXJcIjtcbmltcG9ydCB7IFBvc2l0aW9uIH0gZnJvbSBcIi4uL3V0aWwvbG9jYXRpb25cIjtcblxuY29uc3QgbG9vcExhYmVsID0geyBraW5kOiBcImxvb3BcIiB9LFxuICBzd2l0Y2hMYWJlbCA9IHsga2luZDogXCJzd2l0Y2hcIiB9O1xuXG5jb25zdCBGVU5DX05PX0ZMQUdTID0gMGIwMDAsXG4gIEZVTkNfU1RBVEVNRU5UID0gMGIwMDEsXG4gIEZVTkNfSEFOR0lOR19TVEFURU1FTlQgPSAwYjAxMCxcbiAgRlVOQ19OVUxMQUJMRV9JRCA9IDBiMTAwO1xuXG5jb25zdCBsb25lU3Vycm9nYXRlID0gL1tcXHVEODAwLVxcdURGRkZdL3U7XG5cbmNvbnN0IGtleXdvcmRSZWxhdGlvbmFsT3BlcmF0b3IgPSAvaW4oPzpzdGFuY2VvZik/L3k7XG5cbi8qKlxuICogQ29udmVydCB0dC5wcml2YXRlTmFtZSB0byB0dC5oYXNoICsgdHQubmFtZSBmb3IgYmFja3dhcmQgQmFiZWwgNyBjb21wYXQuXG4gKiBGb3IgcGVyZm9ybWFuY2UgcmVhc29ucyB0aGlzIHJvdXRpbmUgbXV0YXRlcyBgdG9rZW5zYCwgaXQgaXMgb2theVxuICogaGVyZSBzaW5jZSB3ZSBleGVjdXRlIGBwYXJzZVRvcExldmVsYCBvbmNlIGZvciBldmVyeSBmaWxlLlxuICogQHBhcmFtIHsqfSB0b2tlbnNcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGJhYmVsN0NvbXBhdFRva2Vucyh0b2tlbnMpIHtcbiAgaWYgKCFwcm9jZXNzLmVudi5CQUJFTF84X0JSRUFLSU5HKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgaWYgKHRva2VuLnR5cGUgPT09IHR0LnByaXZhdGVOYW1lKSB7XG4gICAgICAgIGNvbnN0IHsgbG9jLCBzdGFydCwgdmFsdWUsIGVuZCB9ID0gdG9rZW47XG4gICAgICAgIGNvbnN0IGhhc2hFbmRQb3MgPSBzdGFydCArIDE7XG4gICAgICAgIGNvbnN0IGhhc2hFbmRMb2MgPSBuZXcgUG9zaXRpb24obG9jLnN0YXJ0LmxpbmUsIGxvYy5zdGFydC5jb2x1bW4gKyAxKTtcbiAgICAgICAgdG9rZW5zLnNwbGljZShcbiAgICAgICAgICBpLFxuICAgICAgICAgIDEsXG4gICAgICAgICAgLy8gJEZsb3dJZ25vcmU6IGhhY2t5IHdheSB0byBjcmVhdGUgdG9rZW5cbiAgICAgICAgICBuZXcgVG9rZW4oe1xuICAgICAgICAgICAgdHlwZTogdHQuaGFzaCxcbiAgICAgICAgICAgIHZhbHVlOiBcIiNcIixcbiAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgIGVuZDogaGFzaEVuZFBvcyxcbiAgICAgICAgICAgIHN0YXJ0TG9jOiBsb2Muc3RhcnQsXG4gICAgICAgICAgICBlbmRMb2M6IGhhc2hFbmRMb2MsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgLy8gJEZsb3dJZ25vcmU6IGhhY2t5IHdheSB0byBjcmVhdGUgdG9rZW5cbiAgICAgICAgICBuZXcgVG9rZW4oe1xuICAgICAgICAgICAgdHlwZTogdHQubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHN0YXJ0OiBoYXNoRW5kUG9zLFxuICAgICAgICAgICAgZW5kOiBlbmQsXG4gICAgICAgICAgICBzdGFydExvYzogaGFzaEVuZExvYyxcbiAgICAgICAgICAgIGVuZExvYzogbG9jLmVuZCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRva2Vucztcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRlbWVudFBhcnNlciBleHRlbmRzIEV4cHJlc3Npb25QYXJzZXIge1xuICAvLyAjIyMgU3RhdGVtZW50IHBhcnNpbmdcblxuICAvLyBQYXJzZSBhIHByb2dyYW0uIEluaXRpYWxpemVzIHRoZSBwYXJzZXIsIHJlYWRzIGFueSBudW1iZXIgb2ZcbiAgLy8gc3RhdGVtZW50cywgYW5kIHdyYXBzIHRoZW0gaW4gYSBQcm9ncmFtIG5vZGUuICBPcHRpb25hbGx5IHRha2VzIGFcbiAgLy8gYHByb2dyYW1gIGFyZ3VtZW50LiAgSWYgcHJlc2VudCwgdGhlIHN0YXRlbWVudHMgd2lsbCBiZSBhcHBlbmRlZFxuICAvLyB0byBpdHMgYm9keSBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IG5vZGUuXG5cbiAgcGFyc2VUb3BMZXZlbChmaWxlOiBOLkZpbGUsIHByb2dyYW06IE4uUHJvZ3JhbSk6IE4uRmlsZSB7XG4gICAgZmlsZS5wcm9ncmFtID0gdGhpcy5wYXJzZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgZmlsZS5jb21tZW50cyA9IHRoaXMuc3RhdGUuY29tbWVudHM7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnRva2VucykgZmlsZS50b2tlbnMgPSBiYWJlbDdDb21wYXRUb2tlbnModGhpcy50b2tlbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShmaWxlLCBcIkZpbGVcIik7XG4gIH1cblxuICBwYXJzZVByb2dyYW0oXG4gICAgcHJvZ3JhbTogTi5Qcm9ncmFtLFxuICAgIGVuZDogVG9rZW5UeXBlID0gdHQuZW9mLFxuICAgIHNvdXJjZVR5cGU6IFNvdXJjZVR5cGUgPSB0aGlzLm9wdGlvbnMuc291cmNlVHlwZSxcbiAgKTogTi5Qcm9ncmFtIHtcbiAgICBwcm9ncmFtLnNvdXJjZVR5cGUgPSBzb3VyY2VUeXBlO1xuICAgIHByb2dyYW0uaW50ZXJwcmV0ZXIgPSB0aGlzLnBhcnNlSW50ZXJwcmV0ZXJEaXJlY3RpdmUoKTtcbiAgICB0aGlzLnBhcnNlQmxvY2tCb2R5KHByb2dyYW0sIHRydWUsIHRydWUsIGVuZCk7XG4gICAgaWYgKFxuICAgICAgdGhpcy5pbk1vZHVsZSAmJlxuICAgICAgIXRoaXMub3B0aW9ucy5hbGxvd1VuZGVjbGFyZWRFeHBvcnRzICYmXG4gICAgICB0aGlzLnNjb3BlLnVuZGVmaW5lZEV4cG9ydHMuc2l6ZSA+IDBcbiAgICApIHtcbiAgICAgIGZvciAoY29uc3QgW25hbWVdIG9mIEFycmF5LmZyb20odGhpcy5zY29wZS51bmRlZmluZWRFeHBvcnRzKSkge1xuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLnNjb3BlLnVuZGVmaW5lZEV4cG9ydHMuZ2V0KG5hbWUpO1xuICAgICAgICAvLyAkRmxvd0lzc3VlXG4gICAgICAgIHRoaXMucmFpc2UocG9zLCBFcnJvcnMuTW9kdWxlRXhwb3J0VW5kZWZpbmVkLCBuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZTxOLlByb2dyYW0+KHByb2dyYW0sIFwiUHJvZ3JhbVwiKTtcbiAgfVxuXG4gIC8vIFRPRE9cblxuICBzdG10VG9EaXJlY3RpdmUoc3RtdDogTi5TdGF0ZW1lbnQpOiBOLkRpcmVjdGl2ZSB7XG4gICAgY29uc3QgZXhwciA9IHN0bXQuZXhwcmVzc2lvbjtcblxuICAgIGNvbnN0IGRpcmVjdGl2ZUxpdGVyYWwgPSB0aGlzLnN0YXJ0Tm9kZUF0KGV4cHIuc3RhcnQsIGV4cHIubG9jLnN0YXJ0KTtcbiAgICBjb25zdCBkaXJlY3RpdmUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0bXQuc3RhcnQsIHN0bXQubG9jLnN0YXJ0KTtcblxuICAgIGNvbnN0IHJhdyA9IHRoaXMuaW5wdXQuc2xpY2UoZXhwci5zdGFydCwgZXhwci5lbmQpO1xuICAgIGNvbnN0IHZhbCA9IChkaXJlY3RpdmVMaXRlcmFsLnZhbHVlID0gcmF3LnNsaWNlKDEsIC0xKSk7IC8vIHJlbW92ZSBxdW90ZXNcblxuICAgIHRoaXMuYWRkRXh0cmEoZGlyZWN0aXZlTGl0ZXJhbCwgXCJyYXdcIiwgcmF3KTtcbiAgICB0aGlzLmFkZEV4dHJhKGRpcmVjdGl2ZUxpdGVyYWwsIFwicmF3VmFsdWVcIiwgdmFsKTtcblxuICAgIGRpcmVjdGl2ZS52YWx1ZSA9IHRoaXMuZmluaXNoTm9kZUF0KFxuICAgICAgZGlyZWN0aXZlTGl0ZXJhbCxcbiAgICAgIFwiRGlyZWN0aXZlTGl0ZXJhbFwiLFxuICAgICAgZXhwci5lbmQsXG4gICAgICBleHByLmxvYy5lbmQsXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGVBdChkaXJlY3RpdmUsIFwiRGlyZWN0aXZlXCIsIHN0bXQuZW5kLCBzdG10LmxvYy5lbmQpO1xuICB9XG5cbiAgcGFyc2VJbnRlcnByZXRlckRpcmVjdGl2ZSgpOiBOLkludGVycHJldGVyRGlyZWN0aXZlIHwgbnVsbCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKHR0LmludGVycHJldGVyRGlyZWN0aXZlKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgbm9kZS52YWx1ZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkludGVycHJldGVyRGlyZWN0aXZlXCIpO1xuICB9XG5cbiAgaXNMZXQoY29udGV4dDogP3N0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5pc0NvbnRleHR1YWwoXCJsZXRcIikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXNMZXRLZXl3b3JkKGNvbnRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc3VtaW5nIHdlIGhhdmUgc2VlbiBhIGNvbnRleHR1YWwgYGxldGAsIGNoZWNrIGlmIGl0IHN0YXJ0cyBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uXG4gICBzbyB0aGF0IGBsZWZ0YCBzaG91bGQgYmUgaW50ZXJwcmV0ZWQgYXMgYSBgbGV0YCBrZXl3b3JkLlxuICAgKlxuICAgKiBAcGFyYW0gez9zdHJpbmd9IGNvbnRleHQgV2hlbiBgY29udGV4dGAgaXMgbm9uIG51bGxpc2gsIGl0IHdpbGwgcmV0dXJuIGVhcmx5IGFuZCBfc2tpcF8gY2hlY2tpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIHRoZSBuZXh0IHRva2VuIGFmdGVyIGBsZXRgIGlzIGB7YCBvciBhIGtleXdvcmQgcmVsYXRpb25hbCBvcGVyYXRvclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQG1lbWJlcm9mIFN0YXRlbWVudFBhcnNlclxuICAgKi9cbiAgaXNMZXRLZXl3b3JkKGNvbnRleHQ6ID9zdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBuZXh0ID0gdGhpcy5uZXh0VG9rZW5TdGFydCgpO1xuICAgIGNvbnN0IG5leHRDaCA9IHRoaXMuY29kZVBvaW50QXRQb3MobmV4dCk7XG4gICAgLy8gRm9yIGFtYmlndW91cyBjYXNlcywgZGV0ZXJtaW5lIGlmIGEgTGV4aWNhbERlY2xhcmF0aW9uIChvciBvbmx5IGFcbiAgICAvLyBTdGF0ZW1lbnQpIGlzIGFsbG93ZWQgaGVyZS4gSWYgY29udGV4dCBpcyBub3QgZW1wdHkgdGhlbiBvbmx5IGEgU3RhdGVtZW50XG4gICAgLy8gaXMgYWxsb3dlZC4gSG93ZXZlciwgYGxldCBbYCBpcyBhbiBleHBsaWNpdCBuZWdhdGl2ZSBsb29rYWhlYWQgZm9yXG4gICAgLy8gRXhwcmVzc2lvblN0YXRlbWVudCwgc28gc3BlY2lhbC1jYXNlIGl0IGZpcnN0LlxuICAgIC8vIEFsc28sIGBsZXQgXFxgIGlzIG5ldmVyIHZhbGlkIGFzIGFuIGV4cHJlc3Npb24gc28gdGhpcyBtdXN0IGJlIGEga2V5d29yZC5cbiAgICBpZiAoXG4gICAgICBuZXh0Q2ggPT09IGNoYXJDb2Rlcy5iYWNrc2xhc2ggfHxcbiAgICAgIG5leHRDaCA9PT0gY2hhckNvZGVzLmxlZnRTcXVhcmVCcmFja2V0XG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGNvbnRleHQpIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChuZXh0Q2ggPT09IGNoYXJDb2Rlcy5sZWZ0Q3VybHlCcmFjZSkgcmV0dXJuIHRydWU7XG5cbiAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQobmV4dENoKSkge1xuICAgICAga2V5d29yZFJlbGF0aW9uYWxPcGVyYXRvci5sYXN0SW5kZXggPSBuZXh0O1xuICAgICAgY29uc3QgbWF0Y2hlZCA9IGtleXdvcmRSZWxhdGlvbmFsT3BlcmF0b3IuZXhlYyh0aGlzLmlucHV0KTtcbiAgICAgIGlmIChtYXRjaGVkICE9PSBudWxsKSB7XG4gICAgICAgIC8vIFdlIGhhdmUgc2VlbiBgaW5gIG9yIGBpbnN0YW5jZW9mYCBzbyBmYXIsIG5vdyBjaGVjayBpZiB0aGUgaWRlbnRmaWVyXG4gICAgICAgIC8vIGVuZHMgaGVyZVxuICAgICAgICBjb25zdCBlbmRDaCA9IHRoaXMuY29kZVBvaW50QXRQb3MobmV4dCArIG1hdGNoZWRbMF0ubGVuZ3RoKTtcbiAgICAgICAgaWYgKCFpc0lkZW50aWZpZXJDaGFyKGVuZENoKSAmJiBlbmRDaCAhPT0gY2hhckNvZGVzLmJhY2tzbGFzaCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgc2luZ2xlIHN0YXRlbWVudC5cbiAgLy9cbiAgLy8gSWYgZXhwZWN0aW5nIGEgc3RhdGVtZW50IGFuZCBmaW5kaW5nIGEgc2xhc2ggb3BlcmF0b3IsIHBhcnNlIGFcbiAgLy8gcmVndWxhciBleHByZXNzaW9uIGxpdGVyYWwuIFRoaXMgaXMgdG8gaGFuZGxlIGNhc2VzIGxpa2VcbiAgLy8gYGlmIChmb28pIC9ibGFoLy5leGVjKGZvbylgLCB3aGVyZSBsb29raW5nIGF0IHRoZSBwcmV2aW91cyB0b2tlblxuICAvLyBkb2VzIG5vdCBoZWxwLlxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1TdGF0ZW1lbnRcbiAgLy8gSW1wb3J0RGVjbGFyYXRpb24gYW5kIEV4cG9ydERlY2xhcmF0aW9uIGFyZSBhbHNvIGhhbmRsZWQgaGVyZSBzbyB3ZSBjYW4gdGhyb3cgcmVjb3ZlcmFibGUgZXJyb3JzXG4gIC8vIHdoZW4gdGhleSBhcmUgbm90IGF0IHRoZSB0b3AgbGV2ZWxcbiAgcGFyc2VTdGF0ZW1lbnQoY29udGV4dDogP3N0cmluZywgdG9wTGV2ZWw/OiBib29sZWFuKTogTi5TdGF0ZW1lbnQge1xuICAgIGlmICh0aGlzLm1hdGNoKHR0LmF0KSkge1xuICAgICAgdGhpcy5wYXJzZURlY29yYXRvcnModHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhcnNlU3RhdGVtZW50Q29udGVudChjb250ZXh0LCB0b3BMZXZlbCk7XG4gIH1cblxuICBwYXJzZVN0YXRlbWVudENvbnRlbnQoY29udGV4dDogP3N0cmluZywgdG9wTGV2ZWw6ID9ib29sZWFuKTogTi5TdGF0ZW1lbnQge1xuICAgIGxldCBzdGFydHR5cGUgPSB0aGlzLnN0YXRlLnR5cGU7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgbGV0IGtpbmQ7XG5cbiAgICBpZiAodGhpcy5pc0xldChjb250ZXh0KSkge1xuICAgICAgc3RhcnR0eXBlID0gdHQuX3ZhcjtcbiAgICAgIGtpbmQgPSBcImxldFwiO1xuICAgIH1cblxuICAgIC8vIE1vc3QgdHlwZXMgb2Ygc3RhdGVtZW50cyBhcmUgcmVjb2duaXplZCBieSB0aGUga2V5d29yZCB0aGV5XG4gICAgLy8gc3RhcnQgd2l0aC4gTWFueSBhcmUgdHJpdmlhbCB0byBwYXJzZSwgc29tZSByZXF1aXJlIGEgYml0IG9mXG4gICAgLy8gY29tcGxleGl0eS5cblxuICAgIHN3aXRjaCAoc3RhcnR0eXBlKSB7XG4gICAgICBjYXNlIHR0Ll9icmVhazpcbiAgICAgIGNhc2UgdHQuX2NvbnRpbnVlOlxuICAgICAgICAvLyAkRmxvd0ZpeE1lXG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlQnJlYWtDb250aW51ZVN0YXRlbWVudChub2RlLCBzdGFydHR5cGUua2V5d29yZCk7XG4gICAgICBjYXNlIHR0Ll9kZWJ1Z2dlcjpcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEZWJ1Z2dlclN0YXRlbWVudChub2RlKTtcbiAgICAgIGNhc2UgdHQuX2RvOlxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURvU3RhdGVtZW50KG5vZGUpO1xuICAgICAgY2FzZSB0dC5fZm9yOlxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZvclN0YXRlbWVudChub2RlKTtcbiAgICAgIGNhc2UgdHQuX2Z1bmN0aW9uOlxuICAgICAgICBpZiAodGhpcy5sb29rYWhlYWRDaGFyQ29kZSgpID09PSBjaGFyQ29kZXMuZG90KSBicmVhaztcbiAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zdHJpY3QpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlN0cmljdEZ1bmN0aW9uKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQgIT09IFwiaWZcIiAmJiBjb250ZXh0ICE9PSBcImxhYmVsXCIpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlNsb3BweUZ1bmN0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGdW5jdGlvblN0YXRlbWVudChub2RlLCBmYWxzZSwgIWNvbnRleHQpO1xuXG4gICAgICBjYXNlIHR0Ll9jbGFzczpcbiAgICAgICAgaWYgKGNvbnRleHQpIHRoaXMudW5leHBlY3RlZCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUNsYXNzKG5vZGUsIHRydWUpO1xuXG4gICAgICBjYXNlIHR0Ll9pZjpcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VJZlN0YXRlbWVudChub2RlKTtcbiAgICAgIGNhc2UgdHQuX3JldHVybjpcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VSZXR1cm5TdGF0ZW1lbnQobm9kZSk7XG4gICAgICBjYXNlIHR0Ll9zd2l0Y2g6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlU3dpdGNoU3RhdGVtZW50KG5vZGUpO1xuICAgICAgY2FzZSB0dC5fdGhyb3c6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlVGhyb3dTdGF0ZW1lbnQobm9kZSk7XG4gICAgICBjYXNlIHR0Ll90cnk6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlVHJ5U3RhdGVtZW50KG5vZGUpO1xuXG4gICAgICBjYXNlIHR0Ll9jb25zdDpcbiAgICAgIGNhc2UgdHQuX3ZhcjpcbiAgICAgICAga2luZCA9IGtpbmQgfHwgdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgaWYgKGNvbnRleHQgJiYga2luZCAhPT0gXCJ2YXJcIikge1xuICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlVuZXhwZWN0ZWRMZXhpY2FsRGVjbGFyYXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlVmFyU3RhdGVtZW50KG5vZGUsIGtpbmQpO1xuXG4gICAgICBjYXNlIHR0Ll93aGlsZTpcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VXaGlsZVN0YXRlbWVudChub2RlKTtcbiAgICAgIGNhc2UgdHQuX3dpdGg6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlV2l0aFN0YXRlbWVudChub2RlKTtcbiAgICAgIGNhc2UgdHQuYnJhY2VMOlxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUJsb2NrKCk7XG4gICAgICBjYXNlIHR0LnNlbWk6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRW1wdHlTdGF0ZW1lbnQobm9kZSk7XG4gICAgICBjYXNlIHR0Ll9pbXBvcnQ6IHtcbiAgICAgICAgY29uc3QgbmV4dFRva2VuQ2hhckNvZGUgPSB0aGlzLmxvb2thaGVhZENoYXJDb2RlKCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBuZXh0VG9rZW5DaGFyQ29kZSA9PT0gY2hhckNvZGVzLmxlZnRQYXJlbnRoZXNpcyB8fCAvLyBpbXBvcnQoKVxuICAgICAgICAgIG5leHRUb2tlbkNoYXJDb2RlID09PSBjaGFyQ29kZXMuZG90IC8vIGltcG9ydC5tZXRhXG4gICAgICAgICkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICAgIGNhc2UgdHQuX2V4cG9ydDoge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5hbGxvd0ltcG9ydEV4cG9ydEV2ZXJ5d2hlcmUgJiYgIXRvcExldmVsKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnN0YXJ0LCBFcnJvcnMuVW5leHBlY3RlZEltcG9ydEV4cG9ydCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5leHQoKTsgLy8gZWF0IGBpbXBvcnRgL2BleHBvcnRgXG5cbiAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgaWYgKHN0YXJ0dHlwZSA9PT0gdHQuX2ltcG9ydCkge1xuICAgICAgICAgIHJlc3VsdCA9IHRoaXMucGFyc2VJbXBvcnQobm9kZSk7XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICByZXN1bHQudHlwZSA9PT0gXCJJbXBvcnREZWNsYXJhdGlvblwiICYmXG4gICAgICAgICAgICAoIXJlc3VsdC5pbXBvcnRLaW5kIHx8IHJlc3VsdC5pbXBvcnRLaW5kID09PSBcInZhbHVlXCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnNhd1VuYW1iaWd1b3VzRVNNID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gdGhpcy5wYXJzZUV4cG9ydChub2RlKTtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIChyZXN1bHQudHlwZSA9PT0gXCJFeHBvcnROYW1lZERlY2xhcmF0aW9uXCIgJiZcbiAgICAgICAgICAgICAgKCFyZXN1bHQuZXhwb3J0S2luZCB8fCByZXN1bHQuZXhwb3J0S2luZCA9PT0gXCJ2YWx1ZVwiKSkgfHxcbiAgICAgICAgICAgIChyZXN1bHQudHlwZSA9PT0gXCJFeHBvcnRBbGxEZWNsYXJhdGlvblwiICYmXG4gICAgICAgICAgICAgICghcmVzdWx0LmV4cG9ydEtpbmQgfHwgcmVzdWx0LmV4cG9ydEtpbmQgPT09IFwidmFsdWVcIikpIHx8XG4gICAgICAgICAgICByZXN1bHQudHlwZSA9PT0gXCJFeHBvcnREZWZhdWx0RGVjbGFyYXRpb25cIlxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5zYXdVbmFtYmlndW91c0VTTSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hc3NlcnRNb2R1bGVOb2RlQWxsb3dlZChub2RlKTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmICh0aGlzLmlzQXN5bmNGdW5jdGlvbigpKSB7XG4gICAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuc3RhcnQsXG4gICAgICAgICAgICAgIEVycm9ycy5Bc3luY0Z1bmN0aW9uSW5TaW5nbGVTdGF0ZW1lbnRDb250ZXh0LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGdW5jdGlvblN0YXRlbWVudChub2RlLCB0cnVlLCAhY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgc3RhdGVtZW50IGRvZXMgbm90IHN0YXJ0IHdpdGggYSBzdGF0ZW1lbnQga2V5d29yZCBvciBhXG4gICAgLy8gYnJhY2UsIGl0J3MgYW4gRXhwcmVzc2lvblN0YXRlbWVudCBvciBMYWJlbGVkU3RhdGVtZW50LiBXZVxuICAgIC8vIHNpbXBseSBzdGFydCBwYXJzaW5nIGFuIGV4cHJlc3Npb24sIGFuZCBhZnRlcndhcmRzLCBpZiB0aGVcbiAgICAvLyBuZXh0IHRva2VuIGlzIGEgY29sb24gYW5kIHRoZSBleHByZXNzaW9uIHdhcyBhIHNpbXBsZVxuICAgIC8vIElkZW50aWZpZXIgbm9kZSwgd2Ugc3dpdGNoIHRvIGludGVycHJldGluZyBpdCBhcyBhIGxhYmVsLlxuICAgIGNvbnN0IG1heWJlTmFtZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgY29uc3QgZXhwciA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG5cbiAgICBpZiAoXG4gICAgICBzdGFydHR5cGUgPT09IHR0Lm5hbWUgJiZcbiAgICAgIGV4cHIudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIgJiZcbiAgICAgIHRoaXMuZWF0KHR0LmNvbG9uKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VMYWJlbGVkU3RhdGVtZW50KG5vZGUsIG1heWJlTmFtZSwgZXhwciwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlRXhwcmVzc2lvblN0YXRlbWVudChub2RlLCBleHByKTtcbiAgICB9XG4gIH1cblxuICBhc3NlcnRNb2R1bGVOb2RlQWxsb3dlZChub2RlOiBOLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5hbGxvd0ltcG9ydEV4cG9ydEV2ZXJ5d2hlcmUgJiYgIXRoaXMuaW5Nb2R1bGUpIHtcbiAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgU291cmNlVHlwZU1vZHVsZUVycm9ycy5JbXBvcnRPdXRzaWRlTW9kdWxlKTtcbiAgICB9XG4gIH1cblxuICB0YWtlRGVjb3JhdG9ycyhub2RlOiBOLkhhc0RlY29yYXRvcnMpOiB2b2lkIHtcbiAgICBjb25zdCBkZWNvcmF0b3JzID1cbiAgICAgIHRoaXMuc3RhdGUuZGVjb3JhdG9yU3RhY2tbdGhpcy5zdGF0ZS5kZWNvcmF0b3JTdGFjay5sZW5ndGggLSAxXTtcbiAgICBpZiAoZGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgIG5vZGUuZGVjb3JhdG9ycyA9IGRlY29yYXRvcnM7XG4gICAgICB0aGlzLnJlc2V0U3RhcnRMb2NhdGlvbkZyb21Ob2RlKG5vZGUsIGRlY29yYXRvcnNbMF0pO1xuICAgICAgdGhpcy5zdGF0ZS5kZWNvcmF0b3JTdGFja1t0aGlzLnN0YXRlLmRlY29yYXRvclN0YWNrLmxlbmd0aCAtIDFdID0gW107XG4gICAgfVxuICB9XG5cbiAgY2FuSGF2ZUxlYWRpbmdEZWNvcmF0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2godHQuX2NsYXNzKTtcbiAgfVxuXG4gIHBhcnNlRGVjb3JhdG9ycyhhbGxvd0V4cG9ydD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50Q29udGV4dERlY29yYXRvcnMgPVxuICAgICAgdGhpcy5zdGF0ZS5kZWNvcmF0b3JTdGFja1t0aGlzLnN0YXRlLmRlY29yYXRvclN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIHdoaWxlICh0aGlzLm1hdGNoKHR0LmF0KSkge1xuICAgICAgY29uc3QgZGVjb3JhdG9yID0gdGhpcy5wYXJzZURlY29yYXRvcigpO1xuICAgICAgY3VycmVudENvbnRleHREZWNvcmF0b3JzLnB1c2goZGVjb3JhdG9yKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXRjaCh0dC5fZXhwb3J0KSkge1xuICAgICAgaWYgKCFhbGxvd0V4cG9ydCkge1xuICAgICAgICB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmhhc1BsdWdpbihcImRlY29yYXRvcnNcIikgJiZcbiAgICAgICAgIXRoaXMuZ2V0UGx1Z2luT3B0aW9uKFwiZGVjb3JhdG9yc1wiLCBcImRlY29yYXRvcnNCZWZvcmVFeHBvcnRcIilcbiAgICAgICkge1xuICAgICAgICB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQsIEVycm9ycy5EZWNvcmF0b3JFeHBvcnRDbGFzcyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghdGhpcy5jYW5IYXZlTGVhZGluZ0RlY29yYXRvcigpKSB7XG4gICAgICB0aHJvdyB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQsIEVycm9ycy5VbmV4cGVjdGVkTGVhZGluZ0RlY29yYXRvcik7XG4gICAgfVxuICB9XG5cbiAgcGFyc2VEZWNvcmF0b3IoKTogTi5EZWNvcmF0b3Ige1xuICAgIHRoaXMuZXhwZWN0T25lUGx1Z2luKFtcImRlY29yYXRvcnMtbGVnYWN5XCIsIFwiZGVjb3JhdG9yc1wiXSk7XG5cbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICB0aGlzLm5leHQoKTtcblxuICAgIGlmICh0aGlzLmhhc1BsdWdpbihcImRlY29yYXRvcnNcIikpIHtcbiAgICAgIC8vIEV2ZXJ5IHRpbWUgYSBkZWNvcmF0b3IgY2xhc3MgZXhwcmVzc2lvbiBpcyBldmFsdWF0ZWQsIGEgbmV3IGVtcHR5IGFycmF5IGlzIHB1c2hlZCBvbnRvIHRoZSBzdGFja1xuICAgICAgLy8gU28gdGhhdCB0aGUgZGVjb3JhdG9ycyBvZiBhbnkgbmVzdGVkIGNsYXNzIGV4cHJlc3Npb25zIHdpbGwgYmUgZGVhbHQgd2l0aCBzZXBhcmF0ZWx5XG4gICAgICB0aGlzLnN0YXRlLmRlY29yYXRvclN0YWNrLnB1c2goW10pO1xuXG4gICAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgICBsZXQgZXhwcjogTi5FeHByZXNzaW9uO1xuXG4gICAgICBpZiAodGhpcy5lYXQodHQucGFyZW5MKSkge1xuICAgICAgICBleHByID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4cHIgPSB0aGlzLnBhcnNlSWRlbnRpZmllcihmYWxzZSk7XG5cbiAgICAgICAgd2hpbGUgKHRoaXMuZWF0KHR0LmRvdCkpIHtcbiAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgICAgIG5vZGUub2JqZWN0ID0gZXhwcjtcbiAgICAgICAgICBub2RlLnByb3BlcnR5ID0gdGhpcy5wYXJzZUlkZW50aWZpZXIodHJ1ZSk7XG4gICAgICAgICAgbm9kZS5jb21wdXRlZCA9IGZhbHNlO1xuICAgICAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJNZW1iZXJFeHByZXNzaW9uXCIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5vZGUuZXhwcmVzc2lvbiA9IHRoaXMucGFyc2VNYXliZURlY29yYXRvckFyZ3VtZW50cyhleHByKTtcbiAgICAgIHRoaXMuc3RhdGUuZGVjb3JhdG9yU3RhY2sucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuZXhwcmVzc2lvbiA9IHRoaXMucGFyc2VFeHByU3Vic2NyaXB0cygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRGVjb3JhdG9yXCIpO1xuICB9XG5cbiAgcGFyc2VNYXliZURlY29yYXRvckFyZ3VtZW50cyhleHByOiBOLkV4cHJlc3Npb24pOiBOLkV4cHJlc3Npb24ge1xuICAgIGlmICh0aGlzLmVhdCh0dC5wYXJlbkwpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdE5vZGUoZXhwcik7XG4gICAgICBub2RlLmNhbGxlZSA9IGV4cHI7XG4gICAgICBub2RlLmFyZ3VtZW50cyA9IHRoaXMucGFyc2VDYWxsRXhwcmVzc2lvbkFyZ3VtZW50cyh0dC5wYXJlblIsIGZhbHNlKTtcbiAgICAgIHRoaXMudG9SZWZlcmVuY2VkTGlzdChub2RlLmFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQ2FsbEV4cHJlc3Npb25cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICBwYXJzZUJyZWFrQ29udGludWVTdGF0ZW1lbnQoXG4gICAgbm9kZTogTi5CcmVha1N0YXRlbWVudCB8IE4uQ29udGludWVTdGF0ZW1lbnQsXG4gICAga2V5d29yZDogc3RyaW5nLFxuICApOiBOLkJyZWFrU3RhdGVtZW50IHwgTi5Db250aW51ZVN0YXRlbWVudCB7XG4gICAgY29uc3QgaXNCcmVhayA9IGtleXdvcmQgPT09IFwiYnJlYWtcIjtcbiAgICB0aGlzLm5leHQoKTtcblxuICAgIGlmICh0aGlzLmlzTGluZVRlcm1pbmF0b3IoKSkge1xuICAgICAgbm9kZS5sYWJlbCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUubGFiZWwgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLnZlcmlmeUJyZWFrQ29udGludWUobm9kZSwga2V5d29yZCk7XG5cbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKFxuICAgICAgbm9kZSxcbiAgICAgIGlzQnJlYWsgPyBcIkJyZWFrU3RhdGVtZW50XCIgOiBcIkNvbnRpbnVlU3RhdGVtZW50XCIsXG4gICAgKTtcbiAgfVxuXG4gIHZlcmlmeUJyZWFrQ29udGludWUoXG4gICAgbm9kZTogTi5CcmVha1N0YXRlbWVudCB8IE4uQ29udGludWVTdGF0ZW1lbnQsXG4gICAga2V5d29yZDogc3RyaW5nLFxuICApIHtcbiAgICBjb25zdCBpc0JyZWFrID0ga2V5d29yZCA9PT0gXCJicmVha1wiO1xuICAgIGxldCBpO1xuICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnN0YXRlLmxhYmVscy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3QgbGFiID0gdGhpcy5zdGF0ZS5sYWJlbHNbaV07XG4gICAgICBpZiAobm9kZS5sYWJlbCA9PSBudWxsIHx8IGxhYi5uYW1lID09PSBub2RlLmxhYmVsLm5hbWUpIHtcbiAgICAgICAgaWYgKGxhYi5raW5kICE9IG51bGwgJiYgKGlzQnJlYWsgfHwgbGFiLmtpbmQgPT09IFwibG9vcFwiKSkgYnJlYWs7XG4gICAgICAgIGlmIChub2RlLmxhYmVsICYmIGlzQnJlYWspIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaSA9PT0gdGhpcy5zdGF0ZS5sYWJlbHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJhaXNlKG5vZGUuc3RhcnQsIEVycm9ycy5JbGxlZ2FsQnJlYWtDb250aW51ZSwga2V5d29yZCk7XG4gICAgfVxuICB9XG5cbiAgcGFyc2VEZWJ1Z2dlclN0YXRlbWVudChub2RlOiBOLkRlYnVnZ2VyU3RhdGVtZW50KTogTi5EZWJ1Z2dlclN0YXRlbWVudCB7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRGVidWdnZXJTdGF0ZW1lbnRcIik7XG4gIH1cblxuICBwYXJzZUhlYWRlckV4cHJlc3Npb24oKTogTi5FeHByZXNzaW9uIHtcbiAgICB0aGlzLmV4cGVjdCh0dC5wYXJlbkwpO1xuICAgIGNvbnN0IHZhbCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG4gICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgcGFyc2VEb1N0YXRlbWVudChub2RlOiBOLkRvV2hpbGVTdGF0ZW1lbnQpOiBOLkRvV2hpbGVTdGF0ZW1lbnQge1xuICAgIHRoaXMubmV4dCgpO1xuICAgIHRoaXMuc3RhdGUubGFiZWxzLnB1c2gobG9vcExhYmVsKTtcblxuICAgIG5vZGUuYm9keSA9XG4gICAgICAvLyBGb3IgdGhlIHNtYXJ0UGlwZWxpbmVzIHBsdWdpbjogRGlzYWJsZSB0b3BpYyByZWZlcmVuY2VzIGZyb20gb3V0ZXJcbiAgICAgIC8vIGNvbnRleHRzIHdpdGhpbiB0aGUgbG9vcCBib2R5LiBUaGV5IGFyZSBwZXJtaXR0ZWQgaW4gdGVzdCBleHByZXNzaW9ucyxcbiAgICAgIC8vIG91dHNpZGUgb2YgdGhlIGxvb3AgYm9keS5cbiAgICAgIHRoaXMud2l0aFRvcGljRm9yYmlkZGluZ0NvbnRleHQoKCkgPT5cbiAgICAgICAgLy8gUGFyc2UgdGhlIGxvb3AgYm9keSdzIGJvZHkuXG4gICAgICAgIHRoaXMucGFyc2VTdGF0ZW1lbnQoXCJkb1wiKSxcbiAgICAgICk7XG5cbiAgICB0aGlzLnN0YXRlLmxhYmVscy5wb3AoKTtcblxuICAgIHRoaXMuZXhwZWN0KHR0Ll93aGlsZSk7XG4gICAgbm9kZS50ZXN0ID0gdGhpcy5wYXJzZUhlYWRlckV4cHJlc3Npb24oKTtcbiAgICB0aGlzLmVhdCh0dC5zZW1pKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRG9XaGlsZVN0YXRlbWVudFwiKTtcbiAgfVxuXG4gIC8vIERpc2FtYmlndWF0aW5nIGJldHdlZW4gYSBgZm9yYCBhbmQgYSBgZm9yYC9gaW5gIG9yIGBmb3JgL2BvZmBcbiAgLy8gbG9vcCBpcyBub24tdHJpdmlhbC4gQmFzaWNhbGx5LCB3ZSBoYXZlIHRvIHBhcnNlIHRoZSBpbml0IGB2YXJgXG4gIC8vIHN0YXRlbWVudCBvciBleHByZXNzaW9uLCBkaXNhbGxvd2luZyB0aGUgYGluYCBvcGVyYXRvciAoc2VlXG4gIC8vIHRoZSBzZWNvbmQgcGFyYW1ldGVyIHRvIGBwYXJzZUV4cHJlc3Npb25gKSwgYW5kIHRoZW4gY2hlY2tcbiAgLy8gd2hldGhlciB0aGUgbmV4dCB0b2tlbiBpcyBgaW5gIG9yIGBvZmAuIFdoZW4gdGhlcmUgaXMgbm8gaW5pdFxuICAvLyBwYXJ0IChzZW1pY29sb24gaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIG9wZW5pbmcgcGFyZW50aGVzaXMpLCBpdFxuICAvLyBpcyBhIHJlZ3VsYXIgYGZvcmAgbG9vcC5cblxuICBwYXJzZUZvclN0YXRlbWVudChub2RlOiBOLk5vZGUpOiBOLkZvckxpa2Uge1xuICAgIHRoaXMubmV4dCgpO1xuICAgIHRoaXMuc3RhdGUubGFiZWxzLnB1c2gobG9vcExhYmVsKTtcblxuICAgIGxldCBhd2FpdEF0ID0gLTE7XG4gICAgaWYgKHRoaXMuaXNBd2FpdEFsbG93ZWQoKSAmJiB0aGlzLmVhdENvbnRleHR1YWwoXCJhd2FpdFwiKSkge1xuICAgICAgYXdhaXRBdCA9IHRoaXMuc3RhdGUubGFzdFRva1N0YXJ0O1xuICAgIH1cbiAgICB0aGlzLnNjb3BlLmVudGVyKFNDT1BFX09USEVSKTtcbiAgICB0aGlzLmV4cGVjdCh0dC5wYXJlbkwpO1xuXG4gICAgaWYgKHRoaXMubWF0Y2godHQuc2VtaSkpIHtcbiAgICAgIGlmIChhd2FpdEF0ID4gLTEpIHtcbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKGF3YWl0QXQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucGFyc2VGb3Iobm9kZSwgbnVsbCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnRzV2l0aExldCA9IHRoaXMuaXNDb250ZXh0dWFsKFwibGV0XCIpO1xuICAgIGNvbnN0IGlzTGV0ID0gc3RhcnRzV2l0aExldCAmJiB0aGlzLmlzTGV0S2V5d29yZCgpO1xuICAgIGlmICh0aGlzLm1hdGNoKHR0Ll92YXIpIHx8IHRoaXMubWF0Y2godHQuX2NvbnN0KSB8fCBpc0xldCkge1xuICAgICAgY29uc3QgaW5pdCA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBjb25zdCBraW5kID0gaXNMZXQgPyBcImxldFwiIDogdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgdGhpcy5wYXJzZVZhcihpbml0LCB0cnVlLCBraW5kKTtcbiAgICAgIHRoaXMuZmluaXNoTm9kZShpbml0LCBcIlZhcmlhYmxlRGVjbGFyYXRpb25cIik7XG5cbiAgICAgIGlmIChcbiAgICAgICAgKHRoaXMubWF0Y2godHQuX2luKSB8fCB0aGlzLmlzQ29udGV4dHVhbChcIm9mXCIpKSAmJlxuICAgICAgICBpbml0LmRlY2xhcmF0aW9ucy5sZW5ndGggPT09IDFcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZvckluKG5vZGUsIGluaXQsIGF3YWl0QXQpO1xuICAgICAgfVxuICAgICAgaWYgKGF3YWl0QXQgPiAtMSkge1xuICAgICAgICB0aGlzLnVuZXhwZWN0ZWQoYXdhaXRBdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZUZvcihub2RlLCBpbml0KTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBmaXJzdCB0b2tlbiBpcyBwb3NzaWJseSBhIGNvbnRleHR1YWwga2V5d29yZCwgc28gdGhhdFxuICAgIC8vIHdlIGNhbiBmb3JiaWQgYGZvciAoYXN5bmMgb2ZgIGlmIHRoaXMgdHVybnMgb3V0IHRvIGJlIGEgZm9yLW9mIGxvb3AuXG4gICAgY29uc3Qgc3RhcnRzV2l0aFVuZXNjYXBlZE5hbWUgPVxuICAgICAgdGhpcy5tYXRjaCh0dC5uYW1lKSAmJiAhdGhpcy5zdGF0ZS5jb250YWluc0VzYztcblxuICAgIGNvbnN0IHJlZkV4cHJlc3Npb25FcnJvcnMgPSBuZXcgRXhwcmVzc2lvbkVycm9ycygpO1xuICAgIGNvbnN0IGluaXQgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbih0cnVlLCByZWZFeHByZXNzaW9uRXJyb3JzKTtcbiAgICBjb25zdCBpc0Zvck9mID0gdGhpcy5pc0NvbnRleHR1YWwoXCJvZlwiKTtcbiAgICBpZiAoaXNGb3JPZikge1xuICAgICAgLy8gQ2hlY2sgZm9yIGxlYWRpbmcgdG9rZW5zIHRoYXQgYXJlIGZvcmJpZGRlbiBpbiBmb3Itb2YgbG9vcHM6XG4gICAgICBpZiAoc3RhcnRzV2l0aExldCkge1xuICAgICAgICB0aGlzLnJhaXNlKGluaXQuc3RhcnQsIEVycm9ycy5Gb3JPZkxldCk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAvLyBgZm9yIGF3YWl0IChhc3luYyBvZiBbXSk7YCBpcyBhbGxvd2VkLlxuICAgICAgICBhd2FpdEF0ID09PSAtMSAmJlxuICAgICAgICBzdGFydHNXaXRoVW5lc2NhcGVkTmFtZSAmJlxuICAgICAgICBpbml0LnR5cGUgPT09IFwiSWRlbnRpZmllclwiICYmXG4gICAgICAgIGluaXQubmFtZSA9PT0gXCJhc3luY1wiXG4gICAgICApIHtcbiAgICAgICAgLy8gVGhpcyBjYXRjaGVzIHRoZSBjYXNlIHdoZXJlIHRoZSBgYXN5bmNgIGluIGBmb3IgKGFzeW5jIG9mYCB3YXNcbiAgICAgICAgLy8gcGFyc2VkIGFzIGFuIGlkZW50aWZpZXIuIElmIGl0IHdhcyBwYXJzZWQgYXMgdGhlIHN0YXJ0IG9mIGFuIGFzeW5jXG4gICAgICAgIC8vIGFycm93IGZ1bmN0aW9uIChlLmcuIGBmb3IgKGFzeW5jIG9mID0+IHt9IG9mIFtdKTtgKSwgdGhlIExWYWwgY2hlY2tcbiAgICAgICAgLy8gZnVydGhlciBkb3duIHdpbGwgcmFpc2UgYSBtb3JlIGFwcHJvcHJpYXRlIGVycm9yLlxuICAgICAgICB0aGlzLnJhaXNlKGluaXQuc3RhcnQsIEVycm9ycy5Gb3JPZkFzeW5jKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzRm9yT2YgfHwgdGhpcy5tYXRjaCh0dC5faW4pKSB7XG4gICAgICB0aGlzLnRvQXNzaWduYWJsZShpbml0LCAvKiBpc0xIUyAqLyB0cnVlKTtcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gaXNGb3JPZiA/IFwiZm9yLW9mIHN0YXRlbWVudFwiIDogXCJmb3ItaW4gc3RhdGVtZW50XCI7XG4gICAgICB0aGlzLmNoZWNrTFZhbChpbml0LCBkZXNjcmlwdGlvbik7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZUZvckluKG5vZGUsIGluaXQsIGF3YWl0QXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoZWNrRXhwcmVzc2lvbkVycm9ycyhyZWZFeHByZXNzaW9uRXJyb3JzLCB0cnVlKTtcbiAgICB9XG4gICAgaWYgKGF3YWl0QXQgPiAtMSkge1xuICAgICAgdGhpcy51bmV4cGVjdGVkKGF3YWl0QXQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wYXJzZUZvcihub2RlLCBpbml0KTtcbiAgfVxuXG4gIHBhcnNlRnVuY3Rpb25TdGF0ZW1lbnQoXG4gICAgbm9kZTogTi5GdW5jdGlvbkRlY2xhcmF0aW9uLFxuICAgIGlzQXN5bmM/OiBib29sZWFuLFxuICAgIGRlY2xhcmF0aW9uUG9zaXRpb24/OiBib29sZWFuLFxuICApOiBOLkZ1bmN0aW9uRGVjbGFyYXRpb24ge1xuICAgIHRoaXMubmV4dCgpO1xuICAgIHJldHVybiB0aGlzLnBhcnNlRnVuY3Rpb24oXG4gICAgICBub2RlLFxuICAgICAgRlVOQ19TVEFURU1FTlQgfCAoZGVjbGFyYXRpb25Qb3NpdGlvbiA/IDAgOiBGVU5DX0hBTkdJTkdfU1RBVEVNRU5UKSxcbiAgICAgIGlzQXN5bmMsXG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlSWZTdGF0ZW1lbnQobm9kZTogTi5JZlN0YXRlbWVudCk6IE4uSWZTdGF0ZW1lbnQge1xuICAgIHRoaXMubmV4dCgpO1xuICAgIG5vZGUudGVzdCA9IHRoaXMucGFyc2VIZWFkZXJFeHByZXNzaW9uKCk7XG4gICAgbm9kZS5jb25zZXF1ZW50ID0gdGhpcy5wYXJzZVN0YXRlbWVudChcImlmXCIpO1xuICAgIG5vZGUuYWx0ZXJuYXRlID0gdGhpcy5lYXQodHQuX2Vsc2UpID8gdGhpcy5wYXJzZVN0YXRlbWVudChcImlmXCIpIDogbnVsbDtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiSWZTdGF0ZW1lbnRcIik7XG4gIH1cblxuICBwYXJzZVJldHVyblN0YXRlbWVudChub2RlOiBOLlJldHVyblN0YXRlbWVudCk6IE4uUmV0dXJuU3RhdGVtZW50IHtcbiAgICBpZiAoIXRoaXMucHJvZFBhcmFtLmhhc1JldHVybiAmJiAhdGhpcy5vcHRpb25zLmFsbG93UmV0dXJuT3V0c2lkZUZ1bmN0aW9uKSB7XG4gICAgICB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQsIEVycm9ycy5JbGxlZ2FsUmV0dXJuKTtcbiAgICB9XG5cbiAgICB0aGlzLm5leHQoKTtcblxuICAgIC8vIEluIGByZXR1cm5gIChhbmQgYGJyZWFrYC9gY29udGludWVgKSwgdGhlIGtleXdvcmRzIHdpdGhcbiAgICAvLyBvcHRpb25hbCBhcmd1bWVudHMsIHdlIGVhZ2VybHkgbG9vayBmb3IgYSBzZW1pY29sb24gb3IgdGhlXG4gICAgLy8gcG9zc2liaWxpdHkgdG8gaW5zZXJ0IG9uZS5cblxuICAgIGlmICh0aGlzLmlzTGluZVRlcm1pbmF0b3IoKSkge1xuICAgICAgbm9kZS5hcmd1bWVudCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuYXJndW1lbnQgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuICAgICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiUmV0dXJuU3RhdGVtZW50XCIpO1xuICB9XG5cbiAgcGFyc2VTd2l0Y2hTdGF0ZW1lbnQobm9kZTogTi5Td2l0Y2hTdGF0ZW1lbnQpOiBOLlN3aXRjaFN0YXRlbWVudCB7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgbm9kZS5kaXNjcmltaW5hbnQgPSB0aGlzLnBhcnNlSGVhZGVyRXhwcmVzc2lvbigpO1xuICAgIGNvbnN0IGNhc2VzID0gKG5vZGUuY2FzZXMgPSBbXSk7XG4gICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcbiAgICB0aGlzLnN0YXRlLmxhYmVscy5wdXNoKHN3aXRjaExhYmVsKTtcbiAgICB0aGlzLnNjb3BlLmVudGVyKFNDT1BFX09USEVSKTtcblxuICAgIC8vIFN0YXRlbWVudHMgdW5kZXIgbXVzdCBiZSBncm91cGVkIChieSBsYWJlbCkgaW4gU3dpdGNoQ2FzZVxuICAgIC8vIG5vZGVzLiBgY3VyYCBpcyB1c2VkIHRvIGtlZXAgdGhlIG5vZGUgdGhhdCB3ZSBhcmUgY3VycmVudGx5XG4gICAgLy8gYWRkaW5nIHN0YXRlbWVudHMgdG8uXG5cbiAgICBsZXQgY3VyO1xuICAgIGZvciAobGV0IHNhd0RlZmF1bHQ7ICF0aGlzLm1hdGNoKHR0LmJyYWNlUik7ICkge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQuX2Nhc2UpIHx8IHRoaXMubWF0Y2godHQuX2RlZmF1bHQpKSB7XG4gICAgICAgIGNvbnN0IGlzQ2FzZSA9IHRoaXMubWF0Y2godHQuX2Nhc2UpO1xuICAgICAgICBpZiAoY3VyKSB0aGlzLmZpbmlzaE5vZGUoY3VyLCBcIlN3aXRjaENhc2VcIik7XG4gICAgICAgIGNhc2VzLnB1c2goKGN1ciA9IHRoaXMuc3RhcnROb2RlKCkpKTtcbiAgICAgICAgY3VyLmNvbnNlcXVlbnQgPSBbXTtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIGlmIChpc0Nhc2UpIHtcbiAgICAgICAgICBjdXIudGVzdCA9IHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHNhd0RlZmF1bHQpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUubGFzdFRva1N0YXJ0LFxuICAgICAgICAgICAgICBFcnJvcnMuTXVsdGlwbGVEZWZhdWx0c0luU3dpdGNoLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2F3RGVmYXVsdCA9IHRydWU7XG4gICAgICAgICAgY3VyLnRlc3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbG9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjdXIpIHtcbiAgICAgICAgICBjdXIuY29uc2VxdWVudC5wdXNoKHRoaXMucGFyc2VTdGF0ZW1lbnQobnVsbCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudW5leHBlY3RlZCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2NvcGUuZXhpdCgpO1xuICAgIGlmIChjdXIpIHRoaXMuZmluaXNoTm9kZShjdXIsIFwiU3dpdGNoQ2FzZVwiKTtcbiAgICB0aGlzLm5leHQoKTsgLy8gQ2xvc2luZyBicmFjZVxuICAgIHRoaXMuc3RhdGUubGFiZWxzLnBvcCgpO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJTd2l0Y2hTdGF0ZW1lbnRcIik7XG4gIH1cblxuICBwYXJzZVRocm93U3RhdGVtZW50KG5vZGU6IE4uVGhyb3dTdGF0ZW1lbnQpOiBOLlRocm93U3RhdGVtZW50IHtcbiAgICB0aGlzLm5leHQoKTtcbiAgICBpZiAodGhpcy5oYXNQcmVjZWRpbmdMaW5lQnJlYWsoKSkge1xuICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLmxhc3RUb2tFbmQsIEVycm9ycy5OZXdsaW5lQWZ0ZXJUaHJvdyk7XG4gICAgfVxuICAgIG5vZGUuYXJndW1lbnQgPSB0aGlzLnBhcnNlRXhwcmVzc2lvbigpO1xuICAgIHRoaXMuc2VtaWNvbG9uKCk7XG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRocm93U3RhdGVtZW50XCIpO1xuICB9XG5cbiAgcGFyc2VDYXRjaENsYXVzZVBhcmFtKCk6IE4uUGF0dGVybiB7XG4gICAgY29uc3QgcGFyYW0gPSB0aGlzLnBhcnNlQmluZGluZ0F0b20oKTtcblxuICAgIGNvbnN0IHNpbXBsZSA9IHBhcmFtLnR5cGUgPT09IFwiSWRlbnRpZmllclwiO1xuICAgIHRoaXMuc2NvcGUuZW50ZXIoc2ltcGxlID8gU0NPUEVfU0lNUExFX0NBVENIIDogMCk7XG4gICAgdGhpcy5jaGVja0xWYWwocGFyYW0sIFwiY2F0Y2ggY2xhdXNlXCIsIEJJTkRfTEVYSUNBTCk7XG5cbiAgICByZXR1cm4gcGFyYW07XG4gIH1cblxuICBwYXJzZVRyeVN0YXRlbWVudChub2RlOiBOLlRyeVN0YXRlbWVudCk6IE4uVHJ5U3RhdGVtZW50IHtcbiAgICB0aGlzLm5leHQoKTtcblxuICAgIG5vZGUuYmxvY2sgPSB0aGlzLnBhcnNlQmxvY2soKTtcbiAgICBub2RlLmhhbmRsZXIgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMubWF0Y2godHQuX2NhdGNoKSkge1xuICAgICAgY29uc3QgY2xhdXNlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQucGFyZW5MKSkge1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5wYXJlbkwpO1xuICAgICAgICBjbGF1c2UucGFyYW0gPSB0aGlzLnBhcnNlQ2F0Y2hDbGF1c2VQYXJhbSgpO1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5wYXJlblIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xhdXNlLnBhcmFtID0gbnVsbDtcbiAgICAgICAgdGhpcy5zY29wZS5lbnRlcihTQ09QRV9PVEhFUik7XG4gICAgICB9XG5cbiAgICAgIGNsYXVzZS5ib2R5ID1cbiAgICAgICAgLy8gRm9yIHRoZSBzbWFydFBpcGVsaW5lcyBwbHVnaW46IERpc2FibGUgdG9waWMgcmVmZXJlbmNlcyBmcm9tIG91dGVyXG4gICAgICAgIC8vIGNvbnRleHRzIHdpdGhpbiB0aGUgY2F0Y2ggY2xhdXNlJ3MgYm9keS5cbiAgICAgICAgdGhpcy53aXRoVG9waWNGb3JiaWRkaW5nQ29udGV4dCgoKSA9PlxuICAgICAgICAgIC8vIFBhcnNlIHRoZSBjYXRjaCBjbGF1c2UncyBib2R5LlxuICAgICAgICAgIHRoaXMucGFyc2VCbG9jayhmYWxzZSwgZmFsc2UpLFxuICAgICAgICApO1xuICAgICAgdGhpcy5zY29wZS5leGl0KCk7XG5cbiAgICAgIG5vZGUuaGFuZGxlciA9IHRoaXMuZmluaXNoTm9kZShjbGF1c2UsIFwiQ2F0Y2hDbGF1c2VcIik7XG4gICAgfVxuXG4gICAgbm9kZS5maW5hbGl6ZXIgPSB0aGlzLmVhdCh0dC5fZmluYWxseSkgPyB0aGlzLnBhcnNlQmxvY2soKSA6IG51bGw7XG5cbiAgICBpZiAoIW5vZGUuaGFuZGxlciAmJiAhbm9kZS5maW5hbGl6ZXIpIHtcbiAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgRXJyb3JzLk5vQ2F0Y2hPckZpbmFsbHkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUcnlTdGF0ZW1lbnRcIik7XG4gIH1cblxuICBwYXJzZVZhclN0YXRlbWVudChcbiAgICBub2RlOiBOLlZhcmlhYmxlRGVjbGFyYXRpb24sXG4gICAga2luZDogXCJ2YXJcIiB8IFwibGV0XCIgfCBcImNvbnN0XCIsXG4gICk6IE4uVmFyaWFibGVEZWNsYXJhdGlvbiB7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgdGhpcy5wYXJzZVZhcihub2RlLCBmYWxzZSwga2luZCk7XG4gICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVmFyaWFibGVEZWNsYXJhdGlvblwiKTtcbiAgfVxuXG4gIHBhcnNlV2hpbGVTdGF0ZW1lbnQobm9kZTogTi5XaGlsZVN0YXRlbWVudCk6IE4uV2hpbGVTdGF0ZW1lbnQge1xuICAgIHRoaXMubmV4dCgpO1xuICAgIG5vZGUudGVzdCA9IHRoaXMucGFyc2VIZWFkZXJFeHByZXNzaW9uKCk7XG4gICAgdGhpcy5zdGF0ZS5sYWJlbHMucHVzaChsb29wTGFiZWwpO1xuXG4gICAgbm9kZS5ib2R5ID1cbiAgICAgIC8vIEZvciB0aGUgc21hcnRQaXBlbGluZXMgcGx1Z2luOlxuICAgICAgLy8gRGlzYWJsZSB0b3BpYyByZWZlcmVuY2VzIGZyb20gb3V0ZXIgY29udGV4dHMgd2l0aGluIHRoZSBsb29wIGJvZHkuXG4gICAgICAvLyBUaGV5IGFyZSBwZXJtaXR0ZWQgaW4gdGVzdCBleHByZXNzaW9ucywgb3V0c2lkZSBvZiB0aGUgbG9vcCBib2R5LlxuICAgICAgdGhpcy53aXRoVG9waWNGb3JiaWRkaW5nQ29udGV4dCgoKSA9PlxuICAgICAgICAvLyBQYXJzZSBsb29wIGJvZHkuXG4gICAgICAgIHRoaXMucGFyc2VTdGF0ZW1lbnQoXCJ3aGlsZVwiKSxcbiAgICAgICk7XG5cbiAgICB0aGlzLnN0YXRlLmxhYmVscy5wb3AoKTtcblxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJXaGlsZVN0YXRlbWVudFwiKTtcbiAgfVxuXG4gIHBhcnNlV2l0aFN0YXRlbWVudChub2RlOiBOLldpdGhTdGF0ZW1lbnQpOiBOLldpdGhTdGF0ZW1lbnQge1xuICAgIGlmICh0aGlzLnN0YXRlLnN0cmljdCkge1xuICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnN0YXJ0LCBFcnJvcnMuU3RyaWN0V2l0aCk7XG4gICAgfVxuICAgIHRoaXMubmV4dCgpO1xuICAgIG5vZGUub2JqZWN0ID0gdGhpcy5wYXJzZUhlYWRlckV4cHJlc3Npb24oKTtcblxuICAgIG5vZGUuYm9keSA9XG4gICAgICAvLyBGb3IgdGhlIHNtYXJ0UGlwZWxpbmVzIHBsdWdpbjpcbiAgICAgIC8vIERpc2FibGUgdG9waWMgcmVmZXJlbmNlcyBmcm9tIG91dGVyIGNvbnRleHRzIHdpdGhpbiB0aGUgd2l0aCBzdGF0ZW1lbnQncyBib2R5LlxuICAgICAgLy8gVGhleSBhcmUgcGVybWl0dGVkIGluIGZ1bmN0aW9uIGRlZmF1bHQtcGFyYW1ldGVyIGV4cHJlc3Npb25zLCB3aGljaCBhcmVcbiAgICAgIC8vIHBhcnQgb2YgdGhlIG91dGVyIGNvbnRleHQsIG91dHNpZGUgb2YgdGhlIHdpdGggc3RhdGVtZW50J3MgYm9keS5cbiAgICAgIHRoaXMud2l0aFRvcGljRm9yYmlkZGluZ0NvbnRleHQoKCkgPT5cbiAgICAgICAgLy8gUGFyc2UgdGhlIHN0YXRlbWVudCBib2R5LlxuICAgICAgICB0aGlzLnBhcnNlU3RhdGVtZW50KFwid2l0aFwiKSxcbiAgICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiV2l0aFN0YXRlbWVudFwiKTtcbiAgfVxuXG4gIHBhcnNlRW1wdHlTdGF0ZW1lbnQobm9kZTogTi5FbXB0eVN0YXRlbWVudCk6IE4uRW1wdHlTdGF0ZW1lbnQge1xuICAgIHRoaXMubmV4dCgpO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJFbXB0eVN0YXRlbWVudFwiKTtcbiAgfVxuXG4gIHBhcnNlTGFiZWxlZFN0YXRlbWVudChcbiAgICBub2RlOiBOLkxhYmVsZWRTdGF0ZW1lbnQsXG4gICAgbWF5YmVOYW1lOiBzdHJpbmcsXG4gICAgZXhwcjogTi5JZGVudGlmaWVyLFxuICAgIGNvbnRleHQ6ID9zdHJpbmcsXG4gICk6IE4uTGFiZWxlZFN0YXRlbWVudCB7XG4gICAgZm9yIChjb25zdCBsYWJlbCBvZiB0aGlzLnN0YXRlLmxhYmVscykge1xuICAgICAgaWYgKGxhYmVsLm5hbWUgPT09IG1heWJlTmFtZSkge1xuICAgICAgICB0aGlzLnJhaXNlKGV4cHIuc3RhcnQsIEVycm9ycy5MYWJlbFJlZGVjbGFyYXRpb24sIG1heWJlTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qga2luZCA9IHRoaXMuc3RhdGUudHlwZS5pc0xvb3BcbiAgICAgID8gXCJsb29wXCJcbiAgICAgIDogdGhpcy5tYXRjaCh0dC5fc3dpdGNoKVxuICAgICAgPyBcInN3aXRjaFwiXG4gICAgICA6IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuc3RhdGUubGFiZWxzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IHRoaXMuc3RhdGUubGFiZWxzW2ldO1xuICAgICAgaWYgKGxhYmVsLnN0YXRlbWVudFN0YXJ0ID09PSBub2RlLnN0YXJ0KSB7XG4gICAgICAgIGxhYmVsLnN0YXRlbWVudFN0YXJ0ID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgICAgbGFiZWwua2luZCA9IGtpbmQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlLmxhYmVscy5wdXNoKHtcbiAgICAgIG5hbWU6IG1heWJlTmFtZSxcbiAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICBzdGF0ZW1lbnRTdGFydDogdGhpcy5zdGF0ZS5zdGFydCxcbiAgICB9KTtcbiAgICBub2RlLmJvZHkgPSB0aGlzLnBhcnNlU3RhdGVtZW50KFxuICAgICAgY29udGV4dFxuICAgICAgICA/IGNvbnRleHQuaW5kZXhPZihcImxhYmVsXCIpID09PSAtMVxuICAgICAgICAgID8gY29udGV4dCArIFwibGFiZWxcIlxuICAgICAgICAgIDogY29udGV4dFxuICAgICAgICA6IFwibGFiZWxcIixcbiAgICApO1xuXG4gICAgdGhpcy5zdGF0ZS5sYWJlbHMucG9wKCk7XG4gICAgbm9kZS5sYWJlbCA9IGV4cHI7XG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkxhYmVsZWRTdGF0ZW1lbnRcIik7XG4gIH1cblxuICBwYXJzZUV4cHJlc3Npb25TdGF0ZW1lbnQoXG4gICAgbm9kZTogTi5FeHByZXNzaW9uU3RhdGVtZW50LFxuICAgIGV4cHI6IE4uRXhwcmVzc2lvbixcbiAgKTogTi5TdGF0ZW1lbnQge1xuICAgIG5vZGUuZXhwcmVzc2lvbiA9IGV4cHI7XG4gICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRXhwcmVzc2lvblN0YXRlbWVudFwiKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgc2VtaWNvbG9uLWVuY2xvc2VkIGJsb2NrIG9mIHN0YXRlbWVudHMsIGhhbmRsaW5nIGBcInVzZVxuICAvLyBzdHJpY3RcImAgZGVjbGFyYXRpb25zIHdoZW4gYGFsbG93RGlyZWN0aXZlc2AgaXMgdHJ1ZSAodXNlZCBmb3JcbiAgLy8gZnVuY3Rpb24gYm9kaWVzKS5cblxuICBwYXJzZUJsb2NrKFxuICAgIGFsbG93RGlyZWN0aXZlcz86IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBjcmVhdGVOZXdMZXhpY2FsU2NvcGU/OiBib29sZWFuID0gdHJ1ZSxcbiAgICBhZnRlckJsb2NrUGFyc2U/OiAoaGFzU3RyaWN0TW9kZURpcmVjdGl2ZTogYm9vbGVhbikgPT4gdm9pZCxcbiAgKTogTi5CbG9ja1N0YXRlbWVudCB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgaWYgKGFsbG93RGlyZWN0aXZlcykge1xuICAgICAgdGhpcy5zdGF0ZS5zdHJpY3RFcnJvcnMuY2xlYXIoKTtcbiAgICB9XG4gICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcbiAgICBpZiAoY3JlYXRlTmV3TGV4aWNhbFNjb3BlKSB7XG4gICAgICB0aGlzLnNjb3BlLmVudGVyKFNDT1BFX09USEVSKTtcbiAgICB9XG4gICAgdGhpcy5wYXJzZUJsb2NrQm9keShcbiAgICAgIG5vZGUsXG4gICAgICBhbGxvd0RpcmVjdGl2ZXMsXG4gICAgICBmYWxzZSxcbiAgICAgIHR0LmJyYWNlUixcbiAgICAgIGFmdGVyQmxvY2tQYXJzZSxcbiAgICApO1xuICAgIGlmIChjcmVhdGVOZXdMZXhpY2FsU2NvcGUpIHtcbiAgICAgIHRoaXMuc2NvcGUuZXhpdCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQmxvY2tTdGF0ZW1lbnRcIik7XG4gIH1cblxuICBpc1ZhbGlkRGlyZWN0aXZlKHN0bXQ6IE4uU3RhdGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHN0bXQudHlwZSA9PT0gXCJFeHByZXNzaW9uU3RhdGVtZW50XCIgJiZcbiAgICAgIHN0bXQuZXhwcmVzc2lvbi50eXBlID09PSBcIlN0cmluZ0xpdGVyYWxcIiAmJlxuICAgICAgIXN0bXQuZXhwcmVzc2lvbi5leHRyYS5wYXJlbnRoZXNpemVkXG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlQmxvY2tCb2R5KFxuICAgIG5vZGU6IE4uQmxvY2tTdGF0ZW1lbnRMaWtlLFxuICAgIGFsbG93RGlyZWN0aXZlczogP2Jvb2xlYW4sXG4gICAgdG9wTGV2ZWw6IGJvb2xlYW4sXG4gICAgZW5kOiBUb2tlblR5cGUsXG4gICAgYWZ0ZXJCbG9ja1BhcnNlPzogKGhhc1N0cmljdE1vZGVEaXJlY3RpdmU6IGJvb2xlYW4pID0+IHZvaWQsXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGJvZHkgPSAobm9kZS5ib2R5ID0gW10pO1xuICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSAobm9kZS5kaXJlY3RpdmVzID0gW10pO1xuICAgIHRoaXMucGFyc2VCbG9ja09yTW9kdWxlQmxvY2tCb2R5KFxuICAgICAgYm9keSxcbiAgICAgIGFsbG93RGlyZWN0aXZlcyA/IGRpcmVjdGl2ZXMgOiB1bmRlZmluZWQsXG4gICAgICB0b3BMZXZlbCxcbiAgICAgIGVuZCxcbiAgICAgIGFmdGVyQmxvY2tQYXJzZSxcbiAgICApO1xuICB9XG5cbiAgLy8gVW5kZWZpbmVkIGRpcmVjdGl2ZXMgbWVhbnMgdGhhdCBkaXJlY3RpdmVzIGFyZSBub3QgYWxsb3dlZC5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtQmxvY2tcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtTW9kdWxlQm9keVxuICBwYXJzZUJsb2NrT3JNb2R1bGVCbG9ja0JvZHkoXG4gICAgYm9keTogTi5TdGF0ZW1lbnRbXSxcbiAgICBkaXJlY3RpdmVzOiA/KE4uRGlyZWN0aXZlW10pLFxuICAgIHRvcExldmVsOiBib29sZWFuLFxuICAgIGVuZDogVG9rZW5UeXBlLFxuICAgIGFmdGVyQmxvY2tQYXJzZT86IChoYXNTdHJpY3RNb2RlRGlyZWN0aXZlOiBib29sZWFuKSA9PiB2b2lkLFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBvbGRTdHJpY3QgPSB0aGlzLnN0YXRlLnN0cmljdDtcbiAgICBsZXQgaGFzU3RyaWN0TW9kZURpcmVjdGl2ZSA9IGZhbHNlO1xuICAgIGxldCBwYXJzZWROb25EaXJlY3RpdmUgPSBmYWxzZTtcblxuICAgIHdoaWxlICghdGhpcy5tYXRjaChlbmQpKSB7XG4gICAgICBjb25zdCBzdG10ID0gdGhpcy5wYXJzZVN0YXRlbWVudChudWxsLCB0b3BMZXZlbCk7XG5cbiAgICAgIGlmIChkaXJlY3RpdmVzICYmICFwYXJzZWROb25EaXJlY3RpdmUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZERpcmVjdGl2ZShzdG10KSkge1xuICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IHRoaXMuc3RtdFRvRGlyZWN0aXZlKHN0bXQpO1xuICAgICAgICAgIGRpcmVjdGl2ZXMucHVzaChkaXJlY3RpdmUpO1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWhhc1N0cmljdE1vZGVEaXJlY3RpdmUgJiZcbiAgICAgICAgICAgIGRpcmVjdGl2ZS52YWx1ZS52YWx1ZSA9PT0gXCJ1c2Ugc3RyaWN0XCJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGhhc1N0cmljdE1vZGVEaXJlY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRTdHJpY3QodHJ1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgcGFyc2VkTm9uRGlyZWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgLy8gY2xlYXIgc3RyaWN0IGVycm9ycyBzaW5jZSB0aGUgc3RyaWN0IG1vZGUgd2lsbCBub3QgY2hhbmdlIHdpdGhpbiB0aGUgYmxvY2tcbiAgICAgICAgdGhpcy5zdGF0ZS5zdHJpY3RFcnJvcnMuY2xlYXIoKTtcbiAgICAgIH1cbiAgICAgIGJvZHkucHVzaChzdG10KTtcbiAgICB9XG5cbiAgICBpZiAoYWZ0ZXJCbG9ja1BhcnNlKSB7XG4gICAgICBhZnRlckJsb2NrUGFyc2UuY2FsbCh0aGlzLCBoYXNTdHJpY3RNb2RlRGlyZWN0aXZlKTtcbiAgICB9XG5cbiAgICBpZiAoIW9sZFN0cmljdCkge1xuICAgICAgdGhpcy5zZXRTdHJpY3QoZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMubmV4dCgpO1xuICB9XG5cbiAgLy8gUGFyc2UgYSByZWd1bGFyIGBmb3JgIGxvb3AuIFRoZSBkaXNhbWJpZ3VhdGlvbiBjb2RlIGluXG4gIC8vIGBwYXJzZVN0YXRlbWVudGAgd2lsbCBhbHJlYWR5IGhhdmUgcGFyc2VkIHRoZSBpbml0IHN0YXRlbWVudCBvclxuICAvLyBleHByZXNzaW9uLlxuXG4gIHBhcnNlRm9yKFxuICAgIG5vZGU6IE4uRm9yU3RhdGVtZW50LFxuICAgIGluaXQ6ID8oTi5WYXJpYWJsZURlY2xhcmF0aW9uIHwgTi5FeHByZXNzaW9uKSxcbiAgKTogTi5Gb3JTdGF0ZW1lbnQge1xuICAgIG5vZGUuaW5pdCA9IGluaXQ7XG4gICAgdGhpcy5zZW1pY29sb24oLyogYWxsb3dBc2kgKi8gZmFsc2UpO1xuICAgIG5vZGUudGVzdCA9IHRoaXMubWF0Y2godHQuc2VtaSkgPyBudWxsIDogdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcbiAgICB0aGlzLnNlbWljb2xvbigvKiBhbGxvd0FzaSAqLyBmYWxzZSk7XG4gICAgbm9kZS51cGRhdGUgPSB0aGlzLm1hdGNoKHR0LnBhcmVuUikgPyBudWxsIDogdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcbiAgICB0aGlzLmV4cGVjdCh0dC5wYXJlblIpO1xuXG4gICAgbm9kZS5ib2R5ID1cbiAgICAgIC8vIEZvciB0aGUgc21hcnRQaXBlbGluZXMgcGx1Z2luOiBEaXNhYmxlIHRvcGljIHJlZmVyZW5jZXMgZnJvbSBvdXRlclxuICAgICAgLy8gY29udGV4dHMgd2l0aGluIHRoZSBsb29wIGJvZHkuIFRoZXkgYXJlIHBlcm1pdHRlZCBpbiB0ZXN0IGV4cHJlc3Npb25zLFxuICAgICAgLy8gb3V0c2lkZSBvZiB0aGUgbG9vcCBib2R5LlxuICAgICAgdGhpcy53aXRoVG9waWNGb3JiaWRkaW5nQ29udGV4dCgoKSA9PlxuICAgICAgICAvLyBQYXJzZSB0aGUgbG9vcCBib2R5LlxuICAgICAgICB0aGlzLnBhcnNlU3RhdGVtZW50KFwiZm9yXCIpLFxuICAgICAgKTtcblxuICAgIHRoaXMuc2NvcGUuZXhpdCgpO1xuICAgIHRoaXMuc3RhdGUubGFiZWxzLnBvcCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkZvclN0YXRlbWVudFwiKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgYGZvcmAvYGluYCBhbmQgYGZvcmAvYG9mYCBsb29wLCB3aGljaCBhcmUgYWxtb3N0XG4gIC8vIHNhbWUgZnJvbSBwYXJzZXIncyBwZXJzcGVjdGl2ZS5cblxuICBwYXJzZUZvckluKFxuICAgIG5vZGU6IE4uRm9ySW5PZixcbiAgICBpbml0OiBOLlZhcmlhYmxlRGVjbGFyYXRpb24gfCBOLkFzc2lnbm1lbnRQYXR0ZXJuLFxuICAgIGF3YWl0QXQ6IG51bWJlcixcbiAgKTogTi5Gb3JJbk9mIHtcbiAgICBjb25zdCBpc0ZvckluID0gdGhpcy5tYXRjaCh0dC5faW4pO1xuICAgIHRoaXMubmV4dCgpO1xuXG4gICAgaWYgKGlzRm9ySW4pIHtcbiAgICAgIGlmIChhd2FpdEF0ID4gLTEpIHRoaXMudW5leHBlY3RlZChhd2FpdEF0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5hd2FpdCA9IGF3YWl0QXQgPiAtMTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBpbml0LnR5cGUgPT09IFwiVmFyaWFibGVEZWNsYXJhdGlvblwiICYmXG4gICAgICBpbml0LmRlY2xhcmF0aW9uc1swXS5pbml0ICE9IG51bGwgJiZcbiAgICAgICghaXNGb3JJbiB8fFxuICAgICAgICB0aGlzLnN0YXRlLnN0cmljdCB8fFxuICAgICAgICBpbml0LmtpbmQgIT09IFwidmFyXCIgfHxcbiAgICAgICAgaW5pdC5kZWNsYXJhdGlvbnNbMF0uaWQudHlwZSAhPT0gXCJJZGVudGlmaWVyXCIpXG4gICAgKSB7XG4gICAgICB0aGlzLnJhaXNlKFxuICAgICAgICBpbml0LnN0YXJ0LFxuICAgICAgICBFcnJvcnMuRm9ySW5PZkxvb3BJbml0aWFsaXplcixcbiAgICAgICAgaXNGb3JJbiA/IFwiZm9yLWluXCIgOiBcImZvci1vZlwiLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGluaXQudHlwZSA9PT0gXCJBc3NpZ25tZW50UGF0dGVyblwiKSB7XG4gICAgICB0aGlzLnJhaXNlKGluaXQuc3RhcnQsIEVycm9ycy5JbnZhbGlkTGhzLCBcImZvci1sb29wXCIpO1xuICAgIH1cblxuICAgIG5vZGUubGVmdCA9IGluaXQ7XG4gICAgbm9kZS5yaWdodCA9IGlzRm9ySW5cbiAgICAgID8gdGhpcy5wYXJzZUV4cHJlc3Npb24oKVxuICAgICAgOiB0aGlzLnBhcnNlTWF5YmVBc3NpZ25BbGxvd0luKCk7XG4gICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcblxuICAgIG5vZGUuYm9keSA9XG4gICAgICAvLyBGb3IgdGhlIHNtYXJ0UGlwZWxpbmVzIHBsdWdpbjpcbiAgICAgIC8vIERpc2FibGUgdG9waWMgcmVmZXJlbmNlcyBmcm9tIG91dGVyIGNvbnRleHRzIHdpdGhpbiB0aGUgbG9vcCBib2R5LlxuICAgICAgLy8gVGhleSBhcmUgcGVybWl0dGVkIGluIHRlc3QgZXhwcmVzc2lvbnMsIG91dHNpZGUgb2YgdGhlIGxvb3AgYm9keS5cbiAgICAgIHRoaXMud2l0aFRvcGljRm9yYmlkZGluZ0NvbnRleHQoKCkgPT5cbiAgICAgICAgLy8gUGFyc2UgbG9vcCBib2R5LlxuICAgICAgICB0aGlzLnBhcnNlU3RhdGVtZW50KFwiZm9yXCIpLFxuICAgICAgKTtcblxuICAgIHRoaXMuc2NvcGUuZXhpdCgpO1xuICAgIHRoaXMuc3RhdGUubGFiZWxzLnBvcCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBpc0ZvckluID8gXCJGb3JJblN0YXRlbWVudFwiIDogXCJGb3JPZlN0YXRlbWVudFwiKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgbGlzdCBvZiB2YXJpYWJsZSBkZWNsYXJhdGlvbnMuXG5cbiAgcGFyc2VWYXIoXG4gICAgbm9kZTogTi5WYXJpYWJsZURlY2xhcmF0aW9uLFxuICAgIGlzRm9yOiBib29sZWFuLFxuICAgIGtpbmQ6IFwidmFyXCIgfCBcImxldFwiIHwgXCJjb25zdFwiLFxuICApOiBOLlZhcmlhYmxlRGVjbGFyYXRpb24ge1xuICAgIGNvbnN0IGRlY2xhcmF0aW9ucyA9IChub2RlLmRlY2xhcmF0aW9ucyA9IFtdKTtcbiAgICBjb25zdCBpc1R5cGVzY3JpcHQgPSB0aGlzLmhhc1BsdWdpbihcInR5cGVzY3JpcHRcIik7XG4gICAgbm9kZS5raW5kID0ga2luZDtcbiAgICBmb3IgKDs7KSB7XG4gICAgICBjb25zdCBkZWNsID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHRoaXMucGFyc2VWYXJJZChkZWNsLCBraW5kKTtcbiAgICAgIGlmICh0aGlzLmVhdCh0dC5lcSkpIHtcbiAgICAgICAgZGVjbC5pbml0ID0gaXNGb3JcbiAgICAgICAgICA/IHRoaXMucGFyc2VNYXliZUFzc2lnbkRpc2FsbG93SW4oKVxuICAgICAgICAgIDogdGhpcy5wYXJzZU1heWJlQXNzaWduQWxsb3dJbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGtpbmQgPT09IFwiY29uc3RcIiAmJlxuICAgICAgICAgICEodGhpcy5tYXRjaCh0dC5faW4pIHx8IHRoaXMuaXNDb250ZXh0dWFsKFwib2ZcIikpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIGBjb25zdGAgd2l0aCBubyBpbml0aWFsaXplciBpcyBhbGxvd2VkIGluIFR5cGVTY3JpcHQuXG4gICAgICAgICAgLy8gSXQgY291bGQgYmUgYSBkZWNsYXJhdGlvbiBsaWtlIGBjb25zdCB4OiBudW1iZXI7YC5cbiAgICAgICAgICBpZiAoIWlzVHlwZXNjcmlwdCkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rRW5kLFxuICAgICAgICAgICAgICBFcnJvcnMuRGVjbGFyYXRpb25NaXNzaW5nSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgICAgIFwiQ29uc3QgZGVjbGFyYXRpb25zXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBkZWNsLmlkLnR5cGUgIT09IFwiSWRlbnRpZmllclwiICYmXG4gICAgICAgICAgIShpc0ZvciAmJiAodGhpcy5tYXRjaCh0dC5faW4pIHx8IHRoaXMuaXNDb250ZXh0dWFsKFwib2ZcIikpKVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rRW5kLFxuICAgICAgICAgICAgRXJyb3JzLkRlY2xhcmF0aW9uTWlzc2luZ0luaXRpYWxpemVyLFxuICAgICAgICAgICAgXCJDb21wbGV4IGJpbmRpbmcgcGF0dGVybnNcIixcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGRlY2wuaW5pdCA9IG51bGw7XG4gICAgICB9XG4gICAgICBkZWNsYXJhdGlvbnMucHVzaCh0aGlzLmZpbmlzaE5vZGUoZGVjbCwgXCJWYXJpYWJsZURlY2xhcmF0b3JcIikpO1xuICAgICAgaWYgKCF0aGlzLmVhdCh0dC5jb21tYSkpIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHBhcnNlVmFySWQoZGVjbDogTi5WYXJpYWJsZURlY2xhcmF0b3IsIGtpbmQ6IFwidmFyXCIgfCBcImxldFwiIHwgXCJjb25zdFwiKTogdm9pZCB7XG4gICAgZGVjbC5pZCA9IHRoaXMucGFyc2VCaW5kaW5nQXRvbSgpO1xuICAgIHRoaXMuY2hlY2tMVmFsKFxuICAgICAgZGVjbC5pZCxcbiAgICAgIFwidmFyaWFibGUgZGVjbGFyYXRpb25cIixcbiAgICAgIGtpbmQgPT09IFwidmFyXCIgPyBCSU5EX1ZBUiA6IEJJTkRfTEVYSUNBTCxcbiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIGtpbmQgIT09IFwidmFyXCIsXG4gICAgKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgZnVuY3Rpb24gZGVjbGFyYXRpb24gb3IgbGl0ZXJhbCAoZGVwZW5kaW5nIG9uIHRoZVxuICAvLyBgaXNTdGF0ZW1lbnRgIHBhcmFtZXRlcikuXG5cbiAgcGFyc2VGdW5jdGlvbjxUOiBOLk5vcm1hbEZ1bmN0aW9uPihcbiAgICBub2RlOiBULFxuICAgIHN0YXRlbWVudD86IG51bWJlciA9IEZVTkNfTk9fRkxBR1MsXG4gICAgaXNBc3luYz86IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBpc0xpdmU/OiBib29sZWFuID0gZmFsc2UsXG4gICk6IFQge1xuICAgIGNvbnN0IGlzU3RhdGVtZW50ID0gc3RhdGVtZW50ICYgRlVOQ19TVEFURU1FTlQ7XG4gICAgY29uc3QgaXNIYW5naW5nU3RhdGVtZW50ID0gc3RhdGVtZW50ICYgRlVOQ19IQU5HSU5HX1NUQVRFTUVOVDtcbiAgICBjb25zdCByZXF1aXJlSWQgPSAhIWlzU3RhdGVtZW50ICYmICEoc3RhdGVtZW50ICYgRlVOQ19OVUxMQUJMRV9JRCk7XG5cbiAgICB0aGlzLmluaXRGdW5jdGlvbihub2RlLCBpc0FzeW5jKTtcblxuICAgIGlmICh0aGlzLm1hdGNoKHR0LnN0YXIpICYmIGlzSGFuZ2luZ1N0YXRlbWVudCkge1xuICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnN0YXJ0LCBFcnJvcnMuR2VuZXJhdG9ySW5TaW5nbGVTdGF0ZW1lbnRDb250ZXh0KTtcbiAgICB9XG4gICAgbm9kZS5nZW5lcmF0b3IgPSB0aGlzLmVhdCh0dC5zdGFyKTtcblxuICAgIGlmIChpc1N0YXRlbWVudCkge1xuICAgICAgbm9kZS5pZCA9IHRoaXMucGFyc2VGdW5jdGlvbklkKHJlcXVpcmVJZCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb2xkTWF5YmVJbkFycm93UGFyYW1ldGVycyA9IHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycztcbiAgICB0aGlzLnN0YXRlLm1heWJlSW5BcnJvd1BhcmFtZXRlcnMgPSBmYWxzZTtcbiAgICB0aGlzLnNjb3BlLmVudGVyKFNDT1BFX0ZVTkNUSU9OKTtcbiAgICB0aGlzLnByb2RQYXJhbS5lbnRlcihmdW5jdGlvbkZsYWdzKGlzQXN5bmMsIG5vZGUuZ2VuZXJhdG9yLCBpc0xpdmUpKTtcblxuICAgIGlmICghaXNTdGF0ZW1lbnQpIHtcbiAgICAgIG5vZGUuaWQgPSB0aGlzLnBhcnNlRnVuY3Rpb25JZCgpO1xuICAgIH1cblxuICAgIHRoaXMucGFyc2VGdW5jdGlvblBhcmFtcyhub2RlLCAvKiBhbGxvd01vZGlmaWVycyAqLyBmYWxzZSk7XG5cbiAgICAvLyBGb3IgdGhlIHNtYXJ0UGlwZWxpbmVzIHBsdWdpbjogRGlzYWJsZSB0b3BpYyByZWZlcmVuY2VzIGZyb20gb3V0ZXJcbiAgICAvLyBjb250ZXh0cyB3aXRoaW4gdGhlIGZ1bmN0aW9uIGJvZHkuIFRoZXkgYXJlIHBlcm1pdHRlZCBpbiBmdW5jdGlvblxuICAgIC8vIGRlZmF1bHQtcGFyYW1ldGVyIGV4cHJlc3Npb25zLCBvdXRzaWRlIG9mIHRoZSBmdW5jdGlvbiBib2R5LlxuICAgIHRoaXMud2l0aFRvcGljRm9yYmlkZGluZ0NvbnRleHQoKCkgPT4ge1xuICAgICAgLy8gUGFyc2UgdGhlIGZ1bmN0aW9uIGJvZHkuXG4gICAgICB0aGlzLnBhcnNlRnVuY3Rpb25Cb2R5QW5kRmluaXNoKFxuICAgICAgICBub2RlLFxuICAgICAgICBpc1N0YXRlbWVudCA/IFwiRnVuY3Rpb25EZWNsYXJhdGlvblwiIDogXCJGdW5jdGlvbkV4cHJlc3Npb25cIixcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnByb2RQYXJhbS5leGl0KCk7XG4gICAgdGhpcy5zY29wZS5leGl0KCk7XG5cbiAgICBpZiAoaXNTdGF0ZW1lbnQgJiYgIWlzSGFuZ2luZ1N0YXRlbWVudCkge1xuICAgICAgLy8gV2UgbmVlZCB0byByZWdpc3RlciB0aGlzIF9hZnRlcl8gcGFyc2luZyB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgLy8gYmVjYXVzZSBvZiBUeXBlU2NyaXB0IGJvZHktbGVzcyBmdW5jdGlvbiBkZWNsYXJhdGlvbnMsXG4gICAgICAvLyB3aGljaCBzaG91bGRuJ3QgYmUgYWRkZWQgdG8gdGhlIHNjb3BlLlxuICAgICAgdGhpcy5yZWdpc3RlckZ1bmN0aW9uU3RhdGVtZW50SWQobm9kZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gb2xkTWF5YmVJbkFycm93UGFyYW1ldGVycztcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHBhcnNlRnVuY3Rpb25JZChyZXF1aXJlSWQ/OiBib29sZWFuKTogP04uSWRlbnRpZmllciB7XG4gICAgcmV0dXJuIHJlcXVpcmVJZCB8fCB0aGlzLm1hdGNoKHR0Lm5hbWUpID8gdGhpcy5wYXJzZUlkZW50aWZpZXIoKSA6IG51bGw7XG4gIH1cblxuICBwYXJzZUZ1bmN0aW9uUGFyYW1zKG5vZGU6IE4uRnVuY3Rpb24sIGFsbG93TW9kaWZpZXJzPzogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZXhwZWN0KHR0LnBhcmVuTCk7XG4gICAgdGhpcy5leHByZXNzaW9uU2NvcGUuZW50ZXIobmV3UGFyYW1ldGVyRGVjbGFyYXRpb25TY29wZSgpKTtcbiAgICBub2RlLnBhcmFtcyA9IHRoaXMucGFyc2VCaW5kaW5nTGlzdChcbiAgICAgIHR0LnBhcmVuUixcbiAgICAgIGNoYXJDb2Rlcy5yaWdodFBhcmVudGhlc2lzLFxuICAgICAgLyogYWxsb3dFbXB0eSAqLyBmYWxzZSxcbiAgICAgIGFsbG93TW9kaWZpZXJzLFxuICAgICk7XG5cbiAgICB0aGlzLmV4cHJlc3Npb25TY29wZS5leGl0KCk7XG4gIH1cblxuICByZWdpc3RlckZ1bmN0aW9uU3RhdGVtZW50SWQobm9kZTogTi5GdW5jdGlvbik6IHZvaWQge1xuICAgIGlmICghbm9kZS5pZCkgcmV0dXJuO1xuXG4gICAgLy8gSWYgaXQgaXMgYSByZWd1bGFyIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGluIHNsb3BweSBtb2RlLCB0aGVuIGl0IGlzXG4gICAgLy8gc3ViamVjdCB0byBBbm5leCBCIHNlbWFudGljcyAoQklORF9GVU5DVElPTikuIE90aGVyd2lzZSwgdGhlIGJpbmRpbmdcbiAgICAvLyBtb2RlIGRlcGVuZHMgb24gcHJvcGVydGllcyBvZiB0aGUgY3VycmVudCBzY29wZSAoc2VlXG4gICAgLy8gdHJlYXRGdW5jdGlvbnNBc1ZhcikuXG4gICAgdGhpcy5zY29wZS5kZWNsYXJlTmFtZShcbiAgICAgIG5vZGUuaWQubmFtZSxcbiAgICAgIHRoaXMuc3RhdGUuc3RyaWN0IHx8IG5vZGUuZ2VuZXJhdG9yIHx8IG5vZGUuYXN5bmNcbiAgICAgICAgPyB0aGlzLnNjb3BlLnRyZWF0RnVuY3Rpb25zQXNWYXJcbiAgICAgICAgICA/IEJJTkRfVkFSXG4gICAgICAgICAgOiBCSU5EX0xFWElDQUxcbiAgICAgICAgOiBCSU5EX0ZVTkNUSU9OLFxuICAgICAgbm9kZS5pZC5zdGFydCxcbiAgICApO1xuICB9XG5cbiAgLy8gUGFyc2UgYSBjbGFzcyBkZWNsYXJhdGlvbiBvciBsaXRlcmFsIChkZXBlbmRpbmcgb24gdGhlXG4gIC8vIGBpc1N0YXRlbWVudGAgcGFyYW1ldGVyKS5cblxuICBwYXJzZUNsYXNzPFQ6IE4uQ2xhc3M+KFxuICAgIG5vZGU6IFQsXG4gICAgaXNTdGF0ZW1lbnQ6IC8qIFQgPT09IENsYXNzRGVjbGFyYXRpb24gKi8gYm9vbGVhbixcbiAgICBvcHRpb25hbElkPzogYm9vbGVhbixcbiAgKTogVCB7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgdGhpcy50YWtlRGVjb3JhdG9ycyhub2RlKTtcblxuICAgIC8vIEEgY2xhc3MgZGVmaW5pdGlvbiBpcyBhbHdheXMgc3RyaWN0IG1vZGUgY29kZS5cbiAgICBjb25zdCBvbGRTdHJpY3QgPSB0aGlzLnN0YXRlLnN0cmljdDtcbiAgICB0aGlzLnN0YXRlLnN0cmljdCA9IHRydWU7XG5cbiAgICB0aGlzLnBhcnNlQ2xhc3NJZChub2RlLCBpc1N0YXRlbWVudCwgb3B0aW9uYWxJZCk7XG4gICAgdGhpcy5wYXJzZUNsYXNzU3VwZXIobm9kZSk7XG4gICAgLy8gdGhpcy5zdGF0ZS5zdHJpY3QgaXMgcmVzdG9yZWQgaW4gcGFyc2VDbGFzc0JvZHlcbiAgICBub2RlLmJvZHkgPSB0aGlzLnBhcnNlQ2xhc3NCb2R5KCEhbm9kZS5zdXBlckNsYXNzLCBvbGRTdHJpY3QpO1xuXG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShcbiAgICAgIG5vZGUsXG4gICAgICBpc1N0YXRlbWVudCA/IFwiQ2xhc3NEZWNsYXJhdGlvblwiIDogXCJDbGFzc0V4cHJlc3Npb25cIixcbiAgICApO1xuICB9XG5cbiAgaXNDbGFzc1Byb3BlcnR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1hdGNoKHR0LmVxKSB8fCB0aGlzLm1hdGNoKHR0LnNlbWkpIHx8IHRoaXMubWF0Y2godHQuYnJhY2VSKTtcbiAgfVxuXG4gIGlzQ2xhc3NNZXRob2QoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2godHQucGFyZW5MKTtcbiAgfVxuXG4gIGlzTm9uc3RhdGljQ29uc3RydWN0b3IobWV0aG9kOiBOLkNsYXNzTWV0aG9kIHwgTi5DbGFzc1Byb3BlcnR5KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgICFtZXRob2QuY29tcHV0ZWQgJiZcbiAgICAgICFtZXRob2Quc3RhdGljICYmXG4gICAgICAobWV0aG9kLmtleS5uYW1lID09PSBcImNvbnN0cnVjdG9yXCIgfHwgLy8gSWRlbnRpZmllclxuICAgICAgICBtZXRob2Qua2V5LnZhbHVlID09PSBcImNvbnN0cnVjdG9yXCIpIC8vIFN0cmluZyBsaXRlcmFsXG4gICAgKTtcbiAgfVxuXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLUNsYXNzQm9keVxuICBwYXJzZUNsYXNzQm9keShoYWRTdXBlckNsYXNzOiBib29sZWFuLCBvbGRTdHJpY3Q6IGJvb2xlYW4pOiBOLkNsYXNzQm9keSB7XG4gICAgdGhpcy5jbGFzc1Njb3BlLmVudGVyKCk7XG5cbiAgICBjb25zdCBzdGF0ZTogTi5QYXJzZUNsYXNzTWVtYmVyU3RhdGUgPSB7XG4gICAgICBoYWRDb25zdHJ1Y3RvcjogZmFsc2UsXG4gICAgICBoYWRTdXBlckNsYXNzLFxuICAgIH07XG4gICAgbGV0IGRlY29yYXRvcnM6IE4uRGVjb3JhdG9yW10gPSBbXTtcbiAgICBjb25zdCBjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5ID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICBjbGFzc0JvZHkuYm9keSA9IFtdO1xuXG4gICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcblxuICAgIC8vIEZvciB0aGUgc21hcnRQaXBlbGluZXMgcGx1Z2luOiBEaXNhYmxlIHRvcGljIHJlZmVyZW5jZXMgZnJvbSBvdXRlclxuICAgIC8vIGNvbnRleHRzIHdpdGhpbiB0aGUgY2xhc3MgYm9keS5cbiAgICB0aGlzLndpdGhUb3BpY0ZvcmJpZGRpbmdDb250ZXh0KCgpID0+IHtcbiAgICAgIHdoaWxlICghdGhpcy5tYXRjaCh0dC5icmFjZVIpKSB7XG4gICAgICAgIGlmICh0aGlzLmVhdCh0dC5zZW1pKSkge1xuICAgICAgICAgIGlmIChkZWNvcmF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5sYXN0VG9rRW5kLCBFcnJvcnMuRGVjb3JhdG9yU2VtaWNvbG9uKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5hdCkpIHtcbiAgICAgICAgICBkZWNvcmF0b3JzLnB1c2godGhpcy5wYXJzZURlY29yYXRvcigpKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1lbWJlciA9IHRoaXMuc3RhcnROb2RlKCk7XG5cbiAgICAgICAgLy8gc3RlYWwgdGhlIGRlY29yYXRvcnMgaWYgdGhlcmUgYXJlIGFueVxuICAgICAgICBpZiAoZGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBtZW1iZXIuZGVjb3JhdG9ycyA9IGRlY29yYXRvcnM7XG4gICAgICAgICAgdGhpcy5yZXNldFN0YXJ0TG9jYXRpb25Gcm9tTm9kZShtZW1iZXIsIGRlY29yYXRvcnNbMF0pO1xuICAgICAgICAgIGRlY29yYXRvcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGFyc2VDbGFzc01lbWJlcihjbGFzc0JvZHksIG1lbWJlciwgc3RhdGUpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBtZW1iZXIua2luZCA9PT0gXCJjb25zdHJ1Y3RvclwiICYmXG4gICAgICAgICAgbWVtYmVyLmRlY29yYXRvcnMgJiZcbiAgICAgICAgICBtZW1iZXIuZGVjb3JhdG9ycy5sZW5ndGggPiAwXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucmFpc2UobWVtYmVyLnN0YXJ0LCBFcnJvcnMuRGVjb3JhdG9yQ29uc3RydWN0b3IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnN0YXRlLnN0cmljdCA9IG9sZFN0cmljdDtcblxuICAgIHRoaXMubmV4dCgpOyAvLyBlYXQgYH1gXG5cbiAgICBpZiAoZGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlRyYWlsaW5nRGVjb3JhdG9yKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsYXNzU2NvcGUuZXhpdCgpO1xuXG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShjbGFzc0JvZHksIFwiQ2xhc3NCb2R5XCIpO1xuICB9XG5cbiAgLy8gcmV0dXJucyB0cnVlIGlmIHRoZSBjdXJyZW50IGlkZW50aWZpZXIgaXMgYSBtZXRob2QvZmllbGQgbmFtZSxcbiAgLy8gZmFsc2UgaWYgaXQgaXMgYSBtb2RpZmllclxuICBwYXJzZUNsYXNzTWVtYmVyRnJvbU1vZGlmaWVyKFxuICAgIGNsYXNzQm9keTogTi5DbGFzc0JvZHksXG4gICAgbWVtYmVyOiBOLkNsYXNzTWVtYmVyLFxuICApOiBib29sZWFuIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLnBhcnNlSWRlbnRpZmllcih0cnVlKTsgLy8gZWF0cyB0aGUgbW9kaWZpZXJcblxuICAgIGlmICh0aGlzLmlzQ2xhc3NNZXRob2QoKSkge1xuICAgICAgY29uc3QgbWV0aG9kOiBOLkNsYXNzTWV0aG9kID0gKG1lbWJlcjogYW55KTtcblxuICAgICAgLy8gYSBtZXRob2QgbmFtZWQgbGlrZSB0aGUgbW9kaWZpZXJcbiAgICAgIG1ldGhvZC5raW5kID0gXCJtZXRob2RcIjtcbiAgICAgIG1ldGhvZC5jb21wdXRlZCA9IGZhbHNlO1xuICAgICAgbWV0aG9kLmtleSA9IGtleTtcbiAgICAgIG1ldGhvZC5zdGF0aWMgPSBmYWxzZTtcbiAgICAgIHRoaXMucHVzaENsYXNzTWV0aG9kKFxuICAgICAgICBjbGFzc0JvZHksXG4gICAgICAgIG1ldGhvZCxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIGZhbHNlLFxuICAgICAgICAvKiBpc0NvbnN0cnVjdG9yICovIGZhbHNlLFxuICAgICAgICBmYWxzZSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNDbGFzc1Byb3BlcnR5KCkpIHtcbiAgICAgIGNvbnN0IHByb3A6IE4uQ2xhc3NQcm9wZXJ0eSA9IChtZW1iZXI6IGFueSk7XG5cbiAgICAgIC8vIGEgcHJvcGVydHkgbmFtZWQgbGlrZSB0aGUgbW9kaWZpZXJcbiAgICAgIHByb3AuY29tcHV0ZWQgPSBmYWxzZTtcbiAgICAgIHByb3Aua2V5ID0ga2V5O1xuICAgICAgcHJvcC5zdGF0aWMgPSBmYWxzZTtcbiAgICAgIGNsYXNzQm9keS5ib2R5LnB1c2godGhpcy5wYXJzZUNsYXNzUHJvcGVydHkocHJvcCkpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHBhcnNlQ2xhc3NNZW1iZXIoXG4gICAgY2xhc3NCb2R5OiBOLkNsYXNzQm9keSxcbiAgICBtZW1iZXI6IE4uQ2xhc3NNZW1iZXIsXG4gICAgc3RhdGU6IE4uUGFyc2VDbGFzc01lbWJlclN0YXRlLFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBpc1N0YXRpYyA9IHRoaXMuaXNDb250ZXh0dWFsKFwic3RhdGljXCIpO1xuXG4gICAgaWYgKGlzU3RhdGljKSB7XG4gICAgICBpZiAodGhpcy5wYXJzZUNsYXNzTWVtYmVyRnJvbU1vZGlmaWVyKGNsYXNzQm9keSwgbWVtYmVyKSkge1xuICAgICAgICAvLyBhIGNsYXNzIGVsZW1lbnQgbmFtZWQgJ3N0YXRpYydcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZWF0KHR0LmJyYWNlTCkpIHtcbiAgICAgICAgdGhpcy5wYXJzZUNsYXNzU3RhdGljQmxvY2soY2xhc3NCb2R5LCAoKG1lbWJlcjogYW55KTogTi5TdGF0aWNCbG9jaykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wYXJzZUNsYXNzTWVtYmVyV2l0aElzU3RhdGljKGNsYXNzQm9keSwgbWVtYmVyLCBzdGF0ZSwgaXNTdGF0aWMpO1xuICB9XG5cbiAgcGFyc2VDbGFzc01lbWJlcldpdGhJc1N0YXRpYyhcbiAgICBjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5LFxuICAgIG1lbWJlcjogTi5DbGFzc01lbWJlcixcbiAgICBzdGF0ZTogTi5QYXJzZUNsYXNzTWVtYmVyU3RhdGUsXG4gICAgaXNTdGF0aWM6IGJvb2xlYW4sXG4gICkge1xuICAgIGNvbnN0IHB1YmxpY01ldGhvZDogJEZsb3dTdWJ0eXBlPE4uQ2xhc3NNZXRob2Q+ID0gbWVtYmVyO1xuICAgIGNvbnN0IHByaXZhdGVNZXRob2Q6ICRGbG93U3VidHlwZTxOLkNsYXNzUHJpdmF0ZU1ldGhvZD4gPSBtZW1iZXI7XG4gICAgY29uc3QgcHVibGljUHJvcDogJEZsb3dTdWJ0eXBlPE4uQ2xhc3NNZXRob2Q+ID0gbWVtYmVyO1xuICAgIGNvbnN0IHByaXZhdGVQcm9wOiAkRmxvd1N1YnR5cGU8Ti5DbGFzc1ByaXZhdGVNZXRob2Q+ID0gbWVtYmVyO1xuXG4gICAgY29uc3QgbWV0aG9kOiB0eXBlb2YgcHVibGljTWV0aG9kIHwgdHlwZW9mIHByaXZhdGVNZXRob2QgPSBwdWJsaWNNZXRob2Q7XG4gICAgY29uc3QgcHVibGljTWVtYmVyOiB0eXBlb2YgcHVibGljTWV0aG9kIHwgdHlwZW9mIHB1YmxpY1Byb3AgPSBwdWJsaWNNZXRob2Q7XG5cbiAgICBtZW1iZXIuc3RhdGljID0gaXNTdGF0aWM7XG5cbiAgICBpZiAodGhpcy5lYXQodHQuc3RhcikpIHtcbiAgICAgIC8vIGEgZ2VuZXJhdG9yXG4gICAgICBtZXRob2Qua2luZCA9IFwibWV0aG9kXCI7XG4gICAgICBjb25zdCBpc1ByaXZhdGVOYW1lID0gdGhpcy5tYXRjaCh0dC5wcml2YXRlTmFtZSk7XG4gICAgICB0aGlzLnBhcnNlQ2xhc3NFbGVtZW50TmFtZShtZXRob2QpO1xuXG4gICAgICBpZiAoaXNQcml2YXRlTmFtZSkge1xuICAgICAgICAvLyBQcml2YXRlIGdlbmVyYXRvciBtZXRob2RcbiAgICAgICAgdGhpcy5wdXNoQ2xhc3NQcml2YXRlTWV0aG9kKGNsYXNzQm9keSwgcHJpdmF0ZU1ldGhvZCwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmlzTm9uc3RhdGljQ29uc3RydWN0b3IocHVibGljTWV0aG9kKSkge1xuICAgICAgICB0aGlzLnJhaXNlKHB1YmxpY01ldGhvZC5rZXkuc3RhcnQsIEVycm9ycy5Db25zdHJ1Y3RvcklzR2VuZXJhdG9yKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wdXNoQ2xhc3NNZXRob2QoXG4gICAgICAgIGNsYXNzQm9keSxcbiAgICAgICAgcHVibGljTWV0aG9kLFxuICAgICAgICB0cnVlLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgLyogaXNDb25zdHJ1Y3RvciAqLyBmYWxzZSxcbiAgICAgICAgZmFsc2UsXG4gICAgICApO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbnNFc2MgPSB0aGlzLnN0YXRlLmNvbnRhaW5zRXNjO1xuICAgIGNvbnN0IGlzUHJpdmF0ZSA9IHRoaXMubWF0Y2godHQucHJpdmF0ZU5hbWUpO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGFyc2VDbGFzc0VsZW1lbnROYW1lKG1lbWJlcik7XG4gICAgLy8gQ2hlY2sgdGhlIGtleSBpcyBub3QgYSBjb21wdXRlZCBleHByZXNzaW9uIG9yIHN0cmluZyBsaXRlcmFsLlxuICAgIGNvbnN0IGlzU2ltcGxlID0ga2V5LnR5cGUgPT09IFwiSWRlbnRpZmllclwiO1xuICAgIGNvbnN0IG1heWJlUXVlc3Rpb25Ub2tlblN0YXJ0ID0gdGhpcy5zdGF0ZS5zdGFydDtcblxuICAgIHRoaXMucGFyc2VQb3N0TWVtYmVyTmFtZU1vZGlmaWVycyhwdWJsaWNNZW1iZXIpO1xuXG4gICAgaWYgKHRoaXMuaXNDbGFzc01ldGhvZCgpKSB7XG4gICAgICBtZXRob2Qua2luZCA9IFwibWV0aG9kXCI7XG5cbiAgICAgIGlmIChpc1ByaXZhdGUpIHtcbiAgICAgICAgdGhpcy5wdXNoQ2xhc3NQcml2YXRlTWV0aG9kKGNsYXNzQm9keSwgcHJpdmF0ZU1ldGhvZCwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBhIG5vcm1hbCBtZXRob2RcbiAgICAgIGNvbnN0IGlzQ29uc3RydWN0b3IgPSB0aGlzLmlzTm9uc3RhdGljQ29uc3RydWN0b3IocHVibGljTWV0aG9kKTtcbiAgICAgIGxldCBhbGxvd3NEaXJlY3RTdXBlciA9IGZhbHNlO1xuICAgICAgaWYgKGlzQ29uc3RydWN0b3IpIHtcbiAgICAgICAgcHVibGljTWV0aG9kLmtpbmQgPSBcImNvbnN0cnVjdG9yXCI7XG5cbiAgICAgICAgLy8gVHlwZVNjcmlwdCBhbGxvd3MgbXVsdGlwbGUgb3ZlcmxvYWRlZCBjb25zdHJ1Y3RvciBkZWNsYXJhdGlvbnMuXG4gICAgICAgIGlmIChzdGF0ZS5oYWRDb25zdHJ1Y3RvciAmJiAhdGhpcy5oYXNQbHVnaW4oXCJ0eXBlc2NyaXB0XCIpKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShrZXkuc3RhcnQsIEVycm9ycy5EdXBsaWNhdGVDb25zdHJ1Y3Rvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29uc3RydWN0b3IgJiYgdGhpcy5oYXNQbHVnaW4oXCJ0eXBlc2NyaXB0XCIpICYmIG1lbWJlci5vdmVycmlkZSkge1xuICAgICAgICAgIHRoaXMucmFpc2Uoa2V5LnN0YXJ0LCBFcnJvcnMuT3ZlcnJpZGVPbkNvbnN0cnVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS5oYWRDb25zdHJ1Y3RvciA9IHRydWU7XG4gICAgICAgIGFsbG93c0RpcmVjdFN1cGVyID0gc3RhdGUuaGFkU3VwZXJDbGFzcztcbiAgICAgIH1cblxuICAgICAgdGhpcy5wdXNoQ2xhc3NNZXRob2QoXG4gICAgICAgIGNsYXNzQm9keSxcbiAgICAgICAgcHVibGljTWV0aG9kLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIGlzQ29uc3RydWN0b3IsXG4gICAgICAgIGFsbG93c0RpcmVjdFN1cGVyLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNDbGFzc1Byb3BlcnR5KCkpIHtcbiAgICAgIGlmIChpc1ByaXZhdGUpIHtcbiAgICAgICAgdGhpcy5wdXNoQ2xhc3NQcml2YXRlUHJvcGVydHkoY2xhc3NCb2R5LCBwcml2YXRlUHJvcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnB1c2hDbGFzc1Byb3BlcnR5KGNsYXNzQm9keSwgcHVibGljUHJvcCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGlzU2ltcGxlICYmXG4gICAgICBrZXkubmFtZSA9PT0gXCJhc3luY1wiICYmXG4gICAgICAhY29udGFpbnNFc2MgJiZcbiAgICAgICF0aGlzLmlzTGluZVRlcm1pbmF0b3IoKVxuICAgICkge1xuICAgICAgLy8gYW4gYXN5bmMgbWV0aG9kXG4gICAgICBjb25zdCBpc0dlbmVyYXRvciA9IHRoaXMuZWF0KHR0LnN0YXIpO1xuXG4gICAgICBpZiAocHVibGljTWVtYmVyLm9wdGlvbmFsKSB7XG4gICAgICAgIHRoaXMudW5leHBlY3RlZChtYXliZVF1ZXN0aW9uVG9rZW5TdGFydCk7XG4gICAgICB9XG5cbiAgICAgIG1ldGhvZC5raW5kID0gXCJtZXRob2RcIjtcbiAgICAgIC8vIFRoZSBzby1jYWxsZWQgcGFyc2VkIG5hbWUgd291bGQgaGF2ZSBiZWVuIFwiYXN5bmNcIjogZ2V0IHRoZSByZWFsIG5hbWUuXG4gICAgICBjb25zdCBpc1ByaXZhdGUgPSB0aGlzLm1hdGNoKHR0LnByaXZhdGVOYW1lKTtcbiAgICAgIHRoaXMucGFyc2VDbGFzc0VsZW1lbnROYW1lKG1ldGhvZCk7XG4gICAgICB0aGlzLnBhcnNlUG9zdE1lbWJlck5hbWVNb2RpZmllcnMocHVibGljTWVtYmVyKTtcblxuICAgICAgaWYgKGlzUHJpdmF0ZSkge1xuICAgICAgICAvLyBwcml2YXRlIGFzeW5jIG1ldGhvZFxuICAgICAgICB0aGlzLnB1c2hDbGFzc1ByaXZhdGVNZXRob2QoXG4gICAgICAgICAgY2xhc3NCb2R5LFxuICAgICAgICAgIHByaXZhdGVNZXRob2QsXG4gICAgICAgICAgaXNHZW5lcmF0b3IsXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmlzTm9uc3RhdGljQ29uc3RydWN0b3IocHVibGljTWV0aG9kKSkge1xuICAgICAgICAgIHRoaXMucmFpc2UocHVibGljTWV0aG9kLmtleS5zdGFydCwgRXJyb3JzLkNvbnN0cnVjdG9ySXNBc3luYyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnB1c2hDbGFzc01ldGhvZChcbiAgICAgICAgICBjbGFzc0JvZHksXG4gICAgICAgICAgcHVibGljTWV0aG9kLFxuICAgICAgICAgIGlzR2VuZXJhdG9yLFxuICAgICAgICAgIHRydWUsXG4gICAgICAgICAgLyogaXNDb25zdHJ1Y3RvciAqLyBmYWxzZSxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgaXNTaW1wbGUgJiZcbiAgICAgIChrZXkubmFtZSA9PT0gXCJnZXRcIiB8fCBrZXkubmFtZSA9PT0gXCJzZXRcIikgJiZcbiAgICAgICFjb250YWluc0VzYyAmJlxuICAgICAgISh0aGlzLm1hdGNoKHR0LnN0YXIpICYmIHRoaXMuaXNMaW5lVGVybWluYXRvcigpKVxuICAgICkge1xuICAgICAgLy8gYGdldFxcbipgIGlzIGFuIHVuaW5pdGlhbGl6ZWQgcHJvcGVydHkgbmFtZWQgJ2dldCcgZm9sbG93ZWQgYnkgYSBnZW5lcmF0b3IuXG4gICAgICAvLyBhIGdldHRlciBvciBzZXR0ZXJcbiAgICAgIG1ldGhvZC5raW5kID0ga2V5Lm5hbWU7XG4gICAgICAvLyBUaGUgc28tY2FsbGVkIHBhcnNlZCBuYW1lIHdvdWxkIGhhdmUgYmVlbiBcImdldC9zZXRcIjogZ2V0IHRoZSByZWFsIG5hbWUuXG4gICAgICBjb25zdCBpc1ByaXZhdGUgPSB0aGlzLm1hdGNoKHR0LnByaXZhdGVOYW1lKTtcbiAgICAgIHRoaXMucGFyc2VDbGFzc0VsZW1lbnROYW1lKHB1YmxpY01ldGhvZCk7XG5cbiAgICAgIGlmIChpc1ByaXZhdGUpIHtcbiAgICAgICAgLy8gcHJpdmF0ZSBnZXR0ZXIvc2V0dGVyXG4gICAgICAgIHRoaXMucHVzaENsYXNzUHJpdmF0ZU1ldGhvZChjbGFzc0JvZHksIHByaXZhdGVNZXRob2QsIGZhbHNlLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5pc05vbnN0YXRpY0NvbnN0cnVjdG9yKHB1YmxpY01ldGhvZCkpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHB1YmxpY01ldGhvZC5rZXkuc3RhcnQsIEVycm9ycy5Db25zdHJ1Y3RvcklzQWNjZXNzb3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHVzaENsYXNzTWV0aG9kKFxuICAgICAgICAgIGNsYXNzQm9keSxcbiAgICAgICAgICBwdWJsaWNNZXRob2QsXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgLyogaXNDb25zdHJ1Y3RvciAqLyBmYWxzZSxcbiAgICAgICAgICBmYWxzZSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jaGVja0dldHRlclNldHRlclBhcmFtcyhwdWJsaWNNZXRob2QpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0xpbmVUZXJtaW5hdG9yKCkpIHtcbiAgICAgIC8vIGFuIHVuaW5pdGlhbGl6ZWQgY2xhc3MgcHJvcGVydHkgKGR1ZSB0byBBU0ksIHNpbmNlIHdlIGRvbid0IG90aGVyd2lzZSByZWNvZ25pemUgdGhlIG5leHQgdG9rZW4pXG4gICAgICBpZiAoaXNQcml2YXRlKSB7XG4gICAgICAgIHRoaXMucHVzaENsYXNzUHJpdmF0ZVByb3BlcnR5KGNsYXNzQm9keSwgcHJpdmF0ZVByb3ApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wdXNoQ2xhc3NQcm9wZXJ0eShjbGFzc0JvZHksIHB1YmxpY1Byb3ApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVuZXhwZWN0ZWQoKTtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2xhc3MtZmllbGRzLyNwcm9kLUNsYXNzRWxlbWVudE5hbWVcbiAgcGFyc2VDbGFzc0VsZW1lbnROYW1lKG1lbWJlcjogTi5DbGFzc01lbWJlcik6IE4uRXhwcmVzc2lvbiB8IE4uSWRlbnRpZmllciB7XG4gICAgY29uc3QgeyB0eXBlLCB2YWx1ZSwgc3RhcnQgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKFxuICAgICAgKHR5cGUgPT09IHR0Lm5hbWUgfHwgdHlwZSA9PT0gdHQuc3RyaW5nKSAmJlxuICAgICAgbWVtYmVyLnN0YXRpYyAmJlxuICAgICAgdmFsdWUgPT09IFwicHJvdG90eXBlXCJcbiAgICApIHtcbiAgICAgIHRoaXMucmFpc2Uoc3RhcnQsIEVycm9ycy5TdGF0aWNQcm90b3R5cGUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlID09PSB0dC5wcml2YXRlTmFtZSAmJiB2YWx1ZSA9PT0gXCJjb25zdHJ1Y3RvclwiKSB7XG4gICAgICB0aGlzLnJhaXNlKHN0YXJ0LCBFcnJvcnMuQ29uc3RydWN0b3JDbGFzc1ByaXZhdGVGaWVsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyc2VQcm9wZXJ0eU5hbWUobWVtYmVyLCAvKiBpc1ByaXZhdGVOYW1lQWxsb3dlZCAqLyB0cnVlKTtcbiAgfVxuXG4gIHBhcnNlQ2xhc3NTdGF0aWNCbG9jayhcbiAgICBjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5LFxuICAgIG1lbWJlcjogTi5TdGF0aWNCbG9jayAmIHsgZGVjb3JhdG9ycz86IEFycmF5PE4uRGVjb3JhdG9yPiB9LFxuICApIHtcbiAgICB0aGlzLmV4cGVjdFBsdWdpbihcImNsYXNzU3RhdGljQmxvY2tcIiwgbWVtYmVyLnN0YXJ0KTtcbiAgICAvLyBTdGFydCBhIG5ldyBsZXhpY2FsIHNjb3BlXG4gICAgdGhpcy5zY29wZS5lbnRlcihTQ09QRV9DTEFTUyB8IFNDT1BFX1NUQVRJQ19CTE9DSyB8IFNDT1BFX1NVUEVSKTtcbiAgICAvLyBTdGFydCBhIG5ldyBzY29wZSB3aXRoIHJlZ2FyZCB0byBsb29wIGxhYmVsc1xuICAgIGNvbnN0IG9sZExhYmVscyA9IHRoaXMuc3RhdGUubGFiZWxzO1xuICAgIHRoaXMuc3RhdGUubGFiZWxzID0gW107XG4gICAgLy8gQ2xhc3NTdGF0aWNCbG9ja1N0YXRlbWVudExpc3Q6XG4gICAgLy8gICBTdGF0ZW1lbnRMaXN0W35ZaWVsZCwgfkF3YWl0LCB+UmV0dXJuXSBvcHRcbiAgICB0aGlzLnByb2RQYXJhbS5lbnRlcihQQVJBTSk7XG4gICAgY29uc3QgYm9keSA9IChtZW1iZXIuYm9keSA9IFtdKTtcbiAgICB0aGlzLnBhcnNlQmxvY2tPck1vZHVsZUJsb2NrQm9keShib2R5LCB1bmRlZmluZWQsIGZhbHNlLCB0dC5icmFjZVIpO1xuICAgIHRoaXMucHJvZFBhcmFtLmV4aXQoKTtcbiAgICB0aGlzLnNjb3BlLmV4aXQoKTtcbiAgICB0aGlzLnN0YXRlLmxhYmVscyA9IG9sZExhYmVscztcbiAgICBjbGFzc0JvZHkuYm9keS5wdXNoKHRoaXMuZmluaXNoTm9kZTxOLlN0YXRpY0Jsb2NrPihtZW1iZXIsIFwiU3RhdGljQmxvY2tcIikpO1xuICAgIGlmIChtZW1iZXIuZGVjb3JhdG9ycz8ubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJhaXNlKG1lbWJlci5zdGFydCwgRXJyb3JzLkRlY29yYXRvclN0YXRpY0Jsb2NrKTtcbiAgICB9XG4gIH1cblxuICBwdXNoQ2xhc3NQcm9wZXJ0eShjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5LCBwcm9wOiBOLkNsYXNzUHJvcGVydHkpIHtcbiAgICBpZiAoXG4gICAgICAhcHJvcC5jb21wdXRlZCAmJlxuICAgICAgKHByb3Aua2V5Lm5hbWUgPT09IFwiY29uc3RydWN0b3JcIiB8fCBwcm9wLmtleS52YWx1ZSA9PT0gXCJjb25zdHJ1Y3RvclwiKVxuICAgICkge1xuICAgICAgLy8gTm9uLWNvbXB1dGVkIGZpZWxkLCB3aGljaCBpcyBlaXRoZXIgYW4gaWRlbnRpZmllciBuYW1lZCBcImNvbnN0cnVjdG9yXCJcbiAgICAgIC8vIG9yIGEgc3RyaW5nIGxpdGVyYWwgbmFtZWQgXCJjb25zdHJ1Y3RvclwiXG4gICAgICB0aGlzLnJhaXNlKHByb3Aua2V5LnN0YXJ0LCBFcnJvcnMuQ29uc3RydWN0b3JDbGFzc0ZpZWxkKTtcbiAgICB9XG5cbiAgICBjbGFzc0JvZHkuYm9keS5wdXNoKHRoaXMucGFyc2VDbGFzc1Byb3BlcnR5KHByb3ApKTtcbiAgfVxuXG4gIHB1c2hDbGFzc1ByaXZhdGVQcm9wZXJ0eShcbiAgICBjbGFzc0JvZHk6IE4uQ2xhc3NCb2R5LFxuICAgIHByb3A6IE4uQ2xhc3NQcml2YXRlUHJvcGVydHksXG4gICkge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhcnNlQ2xhc3NQcml2YXRlUHJvcGVydHkocHJvcCk7XG4gICAgY2xhc3NCb2R5LmJvZHkucHVzaChub2RlKTtcblxuICAgIHRoaXMuY2xhc3NTY29wZS5kZWNsYXJlUHJpdmF0ZU5hbWUoXG4gICAgICB0aGlzLmdldFByaXZhdGVOYW1lU1Yobm9kZS5rZXkpLFxuICAgICAgQ0xBU1NfRUxFTUVOVF9PVEhFUixcbiAgICAgIG5vZGUua2V5LnN0YXJ0LFxuICAgICk7XG4gIH1cblxuICBwdXNoQ2xhc3NNZXRob2QoXG4gICAgY2xhc3NCb2R5OiBOLkNsYXNzQm9keSxcbiAgICBtZXRob2Q6IE4uQ2xhc3NNZXRob2QsXG4gICAgaXNHZW5lcmF0b3I6IGJvb2xlYW4sXG4gICAgaXNBc3luYzogYm9vbGVhbixcbiAgICBpc0NvbnN0cnVjdG9yOiBib29sZWFuLFxuICAgIGFsbG93c0RpcmVjdFN1cGVyOiBib29sZWFuLFxuICApOiB2b2lkIHtcbiAgICBjbGFzc0JvZHkuYm9keS5wdXNoKFxuICAgICAgdGhpcy5wYXJzZU1ldGhvZChcbiAgICAgICAgbWV0aG9kLFxuICAgICAgICBpc0dlbmVyYXRvcixcbiAgICAgICAgaXNBc3luYyxcbiAgICAgICAgaXNDb25zdHJ1Y3RvcixcbiAgICAgICAgYWxsb3dzRGlyZWN0U3VwZXIsXG4gICAgICAgIFwiQ2xhc3NNZXRob2RcIixcbiAgICAgICAgdHJ1ZSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuXG4gIHB1c2hDbGFzc1ByaXZhdGVNZXRob2QoXG4gICAgY2xhc3NCb2R5OiBOLkNsYXNzQm9keSxcbiAgICBtZXRob2Q6IE4uQ2xhc3NQcml2YXRlTWV0aG9kLFxuICAgIGlzR2VuZXJhdG9yOiBib29sZWFuLFxuICAgIGlzQXN5bmM6IGJvb2xlYW4sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhcnNlTWV0aG9kKFxuICAgICAgbWV0aG9kLFxuICAgICAgaXNHZW5lcmF0b3IsXG4gICAgICBpc0FzeW5jLFxuICAgICAgLyogaXNDb25zdHJ1Y3RvciAqLyBmYWxzZSxcbiAgICAgIGZhbHNlLFxuICAgICAgXCJDbGFzc1ByaXZhdGVNZXRob2RcIixcbiAgICAgIHRydWUsXG4gICAgKTtcbiAgICBjbGFzc0JvZHkuYm9keS5wdXNoKG5vZGUpO1xuXG4gICAgY29uc3Qga2luZCA9XG4gICAgICBub2RlLmtpbmQgPT09IFwiZ2V0XCJcbiAgICAgICAgPyBub2RlLnN0YXRpY1xuICAgICAgICAgID8gQ0xBU1NfRUxFTUVOVF9TVEFUSUNfR0VUVEVSXG4gICAgICAgICAgOiBDTEFTU19FTEVNRU5UX0lOU1RBTkNFX0dFVFRFUlxuICAgICAgICA6IG5vZGUua2luZCA9PT0gXCJzZXRcIlxuICAgICAgICA/IG5vZGUuc3RhdGljXG4gICAgICAgICAgPyBDTEFTU19FTEVNRU5UX1NUQVRJQ19TRVRURVJcbiAgICAgICAgICA6IENMQVNTX0VMRU1FTlRfSU5TVEFOQ0VfU0VUVEVSXG4gICAgICAgIDogQ0xBU1NfRUxFTUVOVF9PVEhFUjtcbiAgICB0aGlzLmNsYXNzU2NvcGUuZGVjbGFyZVByaXZhdGVOYW1lKFxuICAgICAgdGhpcy5nZXRQcml2YXRlTmFtZVNWKG5vZGUua2V5KSxcbiAgICAgIGtpbmQsXG4gICAgICBub2RlLmtleS5zdGFydCxcbiAgICApO1xuICB9XG5cbiAgLy8gT3ZlcnJpZGRlbiBpbiB0eXBlc2NyaXB0LmpzXG4gIHBhcnNlUG9zdE1lbWJlck5hbWVNb2RpZmllcnMoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgbWV0aG9kT3JQcm9wOiBOLkNsYXNzTWV0aG9kIHwgTi5DbGFzc1Byb3BlcnR5LFxuICApOiB2b2lkIHt9XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWNsYXNzLWZpZWxkcy8jcHJvZC1GaWVsZERlZmluaXRpb25cbiAgcGFyc2VDbGFzc1ByaXZhdGVQcm9wZXJ0eShcbiAgICBub2RlOiBOLkNsYXNzUHJpdmF0ZVByb3BlcnR5LFxuICApOiBOLkNsYXNzUHJpdmF0ZVByb3BlcnR5IHtcbiAgICB0aGlzLnBhcnNlSW5pdGlhbGl6ZXIobm9kZSk7XG4gICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQ2xhc3NQcml2YXRlUHJvcGVydHlcIik7XG4gIH1cblxuICAvLyBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtY2xhc3MtZmllbGRzLyNwcm9kLUZpZWxkRGVmaW5pdGlvblxuICBwYXJzZUNsYXNzUHJvcGVydHkobm9kZTogTi5DbGFzc1Byb3BlcnR5KTogTi5DbGFzc1Byb3BlcnR5IHtcbiAgICB0aGlzLnBhcnNlSW5pdGlhbGl6ZXIobm9kZSk7XG4gICAgdGhpcy5zZW1pY29sb24oKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQ2xhc3NQcm9wZXJ0eVwiKTtcbiAgfVxuXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1jbGFzcy1maWVsZHMvI3Byb2QtSW5pdGlhbGl6ZXJcbiAgcGFyc2VJbml0aWFsaXplcihub2RlOiBOLkNsYXNzUHJvcGVydHkgfCBOLkNsYXNzUHJpdmF0ZVByb3BlcnR5KTogdm9pZCB7XG4gICAgdGhpcy5zY29wZS5lbnRlcihTQ09QRV9DTEFTUyB8IFNDT1BFX1NVUEVSKTtcbiAgICB0aGlzLmV4cHJlc3Npb25TY29wZS5lbnRlcihuZXdFeHByZXNzaW9uU2NvcGUoKSk7XG4gICAgdGhpcy5wcm9kUGFyYW0uZW50ZXIoUEFSQU0pO1xuICAgIG5vZGUudmFsdWUgPSB0aGlzLmVhdCh0dC5lcSkgPyB0aGlzLnBhcnNlTWF5YmVBc3NpZ25BbGxvd0luKCkgOiBudWxsO1xuICAgIHRoaXMuZXhwcmVzc2lvblNjb3BlLmV4aXQoKTtcbiAgICB0aGlzLnByb2RQYXJhbS5leGl0KCk7XG4gICAgdGhpcy5zY29wZS5leGl0KCk7XG4gIH1cblxuICBwYXJzZUNsYXNzSWQoXG4gICAgbm9kZTogTi5DbGFzcyxcbiAgICBpc1N0YXRlbWVudDogYm9vbGVhbixcbiAgICBvcHRpb25hbElkOiA/Ym9vbGVhbixcbiAgICBiaW5kaW5nVHlwZTogQmluZGluZ1R5cGVzID0gQklORF9DTEFTUyxcbiAgKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWF0Y2godHQubmFtZSkpIHtcbiAgICAgIG5vZGUuaWQgPSB0aGlzLnBhcnNlSWRlbnRpZmllcigpO1xuICAgICAgaWYgKGlzU3RhdGVtZW50KSB7XG4gICAgICAgIHRoaXMuY2hlY2tMVmFsKG5vZGUuaWQsIFwiY2xhc3MgbmFtZVwiLCBiaW5kaW5nVHlwZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvcHRpb25hbElkIHx8ICFpc1N0YXRlbWVudCkge1xuICAgICAgICBub2RlLmlkID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudW5leHBlY3RlZChudWxsLCBFcnJvcnMuTWlzc2luZ0NsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtQ2xhc3NIZXJpdGFnZVxuICBwYXJzZUNsYXNzU3VwZXIobm9kZTogTi5DbGFzcyk6IHZvaWQge1xuICAgIG5vZGUuc3VwZXJDbGFzcyA9IHRoaXMuZWF0KHR0Ll9leHRlbmRzKSA/IHRoaXMucGFyc2VFeHByU3Vic2NyaXB0cygpIDogbnVsbDtcbiAgfVxuXG4gIC8vIFBhcnNlcyBtb2R1bGUgZXhwb3J0IGRlY2xhcmF0aW9uLlxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1FeHBvcnREZWNsYXJhdGlvblxuXG4gIHBhcnNlRXhwb3J0KG5vZGU6IE4uTm9kZSk6IE4uQW55RXhwb3J0IHtcbiAgICBjb25zdCBoYXNEZWZhdWx0ID0gdGhpcy5tYXliZVBhcnNlRXhwb3J0RGVmYXVsdFNwZWNpZmllcihub2RlKTtcbiAgICBjb25zdCBwYXJzZUFmdGVyRGVmYXVsdCA9ICFoYXNEZWZhdWx0IHx8IHRoaXMuZWF0KHR0LmNvbW1hKTtcbiAgICBjb25zdCBoYXNTdGFyID0gcGFyc2VBZnRlckRlZmF1bHQgJiYgdGhpcy5lYXRFeHBvcnRTdGFyKG5vZGUpO1xuICAgIGNvbnN0IGhhc05hbWVzcGFjZSA9XG4gICAgICBoYXNTdGFyICYmIHRoaXMubWF5YmVQYXJzZUV4cG9ydE5hbWVzcGFjZVNwZWNpZmllcihub2RlKTtcbiAgICBjb25zdCBwYXJzZUFmdGVyTmFtZXNwYWNlID1cbiAgICAgIHBhcnNlQWZ0ZXJEZWZhdWx0ICYmICghaGFzTmFtZXNwYWNlIHx8IHRoaXMuZWF0KHR0LmNvbW1hKSk7XG4gICAgY29uc3QgaXNGcm9tUmVxdWlyZWQgPSBoYXNEZWZhdWx0IHx8IGhhc1N0YXI7XG5cbiAgICBpZiAoaGFzU3RhciAmJiAhaGFzTmFtZXNwYWNlKSB7XG4gICAgICBpZiAoaGFzRGVmYXVsdCkgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICB0aGlzLnBhcnNlRXhwb3J0RnJvbShub2RlLCB0cnVlKTtcblxuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkV4cG9ydEFsbERlY2xhcmF0aW9uXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGhhc1NwZWNpZmllcnMgPSB0aGlzLm1heWJlUGFyc2VFeHBvcnROYW1lZFNwZWNpZmllcnMobm9kZSk7XG5cbiAgICBpZiAoXG4gICAgICAoaGFzRGVmYXVsdCAmJiBwYXJzZUFmdGVyRGVmYXVsdCAmJiAhaGFzU3RhciAmJiAhaGFzU3BlY2lmaWVycykgfHxcbiAgICAgIChoYXNOYW1lc3BhY2UgJiYgcGFyc2VBZnRlck5hbWVzcGFjZSAmJiAhaGFzU3BlY2lmaWVycylcbiAgICApIHtcbiAgICAgIHRocm93IHRoaXMudW5leHBlY3RlZChudWxsLCB0dC5icmFjZUwpO1xuICAgIH1cblxuICAgIGxldCBoYXNEZWNsYXJhdGlvbjtcbiAgICBpZiAoaXNGcm9tUmVxdWlyZWQgfHwgaGFzU3BlY2lmaWVycykge1xuICAgICAgaGFzRGVjbGFyYXRpb24gPSBmYWxzZTtcbiAgICAgIHRoaXMucGFyc2VFeHBvcnRGcm9tKG5vZGUsIGlzRnJvbVJlcXVpcmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFzRGVjbGFyYXRpb24gPSB0aGlzLm1heWJlUGFyc2VFeHBvcnREZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG5cbiAgICBpZiAoaXNGcm9tUmVxdWlyZWQgfHwgaGFzU3BlY2lmaWVycyB8fCBoYXNEZWNsYXJhdGlvbikge1xuICAgICAgdGhpcy5jaGVja0V4cG9ydChub2RlLCB0cnVlLCBmYWxzZSwgISFub2RlLnNvdXJjZSk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRXhwb3J0TmFtZWREZWNsYXJhdGlvblwiKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lYXQodHQuX2RlZmF1bHQpKSB7XG4gICAgICAvLyBleHBvcnQgZGVmYXVsdCAuLi5cbiAgICAgIG5vZGUuZGVjbGFyYXRpb24gPSB0aGlzLnBhcnNlRXhwb3J0RGVmYXVsdEV4cHJlc3Npb24oKTtcbiAgICAgIHRoaXMuY2hlY2tFeHBvcnQobm9kZSwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJFeHBvcnREZWZhdWx0RGVjbGFyYXRpb25cIik7XG4gICAgfVxuXG4gICAgdGhyb3cgdGhpcy51bmV4cGVjdGVkKG51bGwsIHR0LmJyYWNlTCk7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgZWF0RXhwb3J0U3Rhcihub2RlOiBOLk5vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lYXQodHQuc3Rhcik7XG4gIH1cblxuICBtYXliZVBhcnNlRXhwb3J0RGVmYXVsdFNwZWNpZmllcihub2RlOiBOLk5vZGUpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5pc0V4cG9ydERlZmF1bHRTcGVjaWZpZXIoKSkge1xuICAgICAgLy8gZXhwb3J0IGRlZmF1bHRPYmogLi4uXG4gICAgICB0aGlzLmV4cGVjdFBsdWdpbihcImV4cG9ydERlZmF1bHRGcm9tXCIpO1xuICAgICAgY29uc3Qgc3BlY2lmaWVyID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgIHNwZWNpZmllci5leHBvcnRlZCA9IHRoaXMucGFyc2VJZGVudGlmaWVyKHRydWUpO1xuICAgICAgbm9kZS5zcGVjaWZpZXJzID0gW3RoaXMuZmluaXNoTm9kZShzcGVjaWZpZXIsIFwiRXhwb3J0RGVmYXVsdFNwZWNpZmllclwiKV07XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbWF5YmVQYXJzZUV4cG9ydE5hbWVzcGFjZVNwZWNpZmllcihub2RlOiBOLk5vZGUpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5pc0NvbnRleHR1YWwoXCJhc1wiKSkge1xuICAgICAgaWYgKCFub2RlLnNwZWNpZmllcnMpIG5vZGUuc3BlY2lmaWVycyA9IFtdO1xuXG4gICAgICBjb25zdCBzcGVjaWZpZXIgPSB0aGlzLnN0YXJ0Tm9kZUF0KFxuICAgICAgICB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCxcbiAgICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnRMb2MsXG4gICAgICApO1xuXG4gICAgICB0aGlzLm5leHQoKTtcblxuICAgICAgc3BlY2lmaWVyLmV4cG9ydGVkID0gdGhpcy5wYXJzZU1vZHVsZUV4cG9ydE5hbWUoKTtcbiAgICAgIG5vZGUuc3BlY2lmaWVycy5wdXNoKFxuICAgICAgICB0aGlzLmZpbmlzaE5vZGUoc3BlY2lmaWVyLCBcIkV4cG9ydE5hbWVzcGFjZVNwZWNpZmllclwiKSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbWF5YmVQYXJzZUV4cG9ydE5hbWVkU3BlY2lmaWVycyhub2RlOiBOLk5vZGUpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5tYXRjaCh0dC5icmFjZUwpKSB7XG4gICAgICBpZiAoIW5vZGUuc3BlY2lmaWVycykgbm9kZS5zcGVjaWZpZXJzID0gW107XG4gICAgICBub2RlLnNwZWNpZmllcnMucHVzaCguLi50aGlzLnBhcnNlRXhwb3J0U3BlY2lmaWVycygpKTtcblxuICAgICAgbm9kZS5zb3VyY2UgPSBudWxsO1xuICAgICAgbm9kZS5kZWNsYXJhdGlvbiA9IG51bGw7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBtYXliZVBhcnNlRXhwb3J0RGVjbGFyYXRpb24obm9kZTogTi5Ob2RlKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuc2hvdWxkUGFyc2VFeHBvcnREZWNsYXJhdGlvbigpKSB7XG4gICAgICBub2RlLnNwZWNpZmllcnMgPSBbXTtcbiAgICAgIG5vZGUuc291cmNlID0gbnVsbDtcbiAgICAgIG5vZGUuZGVjbGFyYXRpb24gPSB0aGlzLnBhcnNlRXhwb3J0RGVjbGFyYXRpb24obm9kZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaXNBc3luY0Z1bmN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5pc0NvbnRleHR1YWwoXCJhc3luY1wiKSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IG5leHQgPSB0aGlzLm5leHRUb2tlblN0YXJ0KCk7XG4gICAgcmV0dXJuIChcbiAgICAgICFsaW5lQnJlYWsudGVzdCh0aGlzLmlucHV0LnNsaWNlKHRoaXMuc3RhdGUucG9zLCBuZXh0KSkgJiZcbiAgICAgIHRoaXMuaXNVbnBhcnNlZENvbnRleHR1YWwobmV4dCwgXCJmdW5jdGlvblwiKVxuICAgICk7XG4gIH1cblxuICBwYXJzZUV4cG9ydERlZmF1bHRFeHByZXNzaW9uKCk6IE4uRXhwcmVzc2lvbiB8IE4uRGVjbGFyYXRpb24ge1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuXG4gICAgY29uc3QgaXNBc3luYyA9IHRoaXMuaXNBc3luY0Z1bmN0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5tYXRjaCh0dC5fZnVuY3Rpb24pIHx8IGlzQXN5bmMpIHtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgaWYgKGlzQXN5bmMpIHtcbiAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnBhcnNlRnVuY3Rpb24oXG4gICAgICAgIGV4cHIsXG4gICAgICAgIEZVTkNfU1RBVEVNRU5UIHwgRlVOQ19OVUxMQUJMRV9JRCxcbiAgICAgICAgaXNBc3luYyxcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0Ll9jbGFzcykpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlQ2xhc3MoZXhwciwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0LmF0KSkge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmhhc1BsdWdpbihcImRlY29yYXRvcnNcIikgJiZcbiAgICAgICAgdGhpcy5nZXRQbHVnaW5PcHRpb24oXCJkZWNvcmF0b3JzXCIsIFwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydFwiKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLkRlY29yYXRvckJlZm9yZUV4cG9ydCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhcnNlRGVjb3JhdG9ycyhmYWxzZSk7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZUNsYXNzKGV4cHIsIHRydWUsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5fY29uc3QpIHx8IHRoaXMubWF0Y2godHQuX3ZhcikgfHwgdGhpcy5pc0xldCgpKSB7XG4gICAgICB0aHJvdyB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQsIEVycm9ycy5VbnN1cHBvcnRlZERlZmF1bHRFeHBvcnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZXMgPSB0aGlzLnBhcnNlTWF5YmVBc3NpZ25BbGxvd0luKCk7XG4gICAgICB0aGlzLnNlbWljb2xvbigpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcGFyc2VFeHBvcnREZWNsYXJhdGlvbihub2RlOiBOLkV4cG9ydE5hbWVkRGVjbGFyYXRpb24pOiA/Ti5EZWNsYXJhdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VTdGF0ZW1lbnQobnVsbCk7XG4gIH1cblxuICBpc0V4cG9ydERlZmF1bHRTcGVjaWZpZXIoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubWF0Y2godHQubmFtZSkpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgIGlmICgodmFsdWUgPT09IFwiYXN5bmNcIiAmJiAhdGhpcy5zdGF0ZS5jb250YWluc0VzYykgfHwgdmFsdWUgPT09IFwibGV0XCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICAodmFsdWUgPT09IFwidHlwZVwiIHx8IHZhbHVlID09PSBcImludGVyZmFjZVwiKSAmJlxuICAgICAgICAhdGhpcy5zdGF0ZS5jb250YWluc0VzY1xuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGwgPSB0aGlzLmxvb2thaGVhZCgpO1xuICAgICAgICAvLyBJZiB3ZSBzZWUgYW55IHZhcmlhYmxlIG5hbWUgb3RoZXIgdGhhbiBgZnJvbWAgYWZ0ZXIgYHR5cGVgIGtleXdvcmQsXG4gICAgICAgIC8vIHdlIGNvbnNpZGVyIGl0IGFzIGZsb3cvdHlwZXNjcmlwdCB0eXBlIGV4cG9ydHNcbiAgICAgICAgLy8gbm90ZSB0aGF0IHRoaXMgYXBwcm9hY2ggbWF5IGZhaWwgb24gc29tZSBwZWRhbnRpYyBjYXNlc1xuICAgICAgICAvLyBleHBvcnQgdHlwZSBmcm9tID0gbnVtYmVyXG4gICAgICAgIGlmIChcbiAgICAgICAgICAobC50eXBlID09PSB0dC5uYW1lICYmIGwudmFsdWUgIT09IFwiZnJvbVwiKSB8fFxuICAgICAgICAgIGwudHlwZSA9PT0gdHQuYnJhY2VMXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZXhwZWN0T25lUGx1Z2luKFtcImZsb3dcIiwgXCJ0eXBlc2NyaXB0XCJdKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCF0aGlzLm1hdGNoKHR0Ll9kZWZhdWx0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHQgPSB0aGlzLm5leHRUb2tlblN0YXJ0KCk7XG4gICAgY29uc3QgaGFzRnJvbSA9IHRoaXMuaXNVbnBhcnNlZENvbnRleHR1YWwobmV4dCwgXCJmcm9tXCIpO1xuICAgIGlmIChcbiAgICAgIHRoaXMuaW5wdXQuY2hhckNvZGVBdChuZXh0KSA9PT0gY2hhckNvZGVzLmNvbW1hIHx8XG4gICAgICAodGhpcy5tYXRjaCh0dC5uYW1lKSAmJiBoYXNGcm9tKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIGxvb2thaGVhZCBhZ2FpbiB3aGVuIGBleHBvcnQgZGVmYXVsdCBmcm9tYCBpcyBzZWVuXG4gICAgaWYgKHRoaXMubWF0Y2godHQuX2RlZmF1bHQpICYmIGhhc0Zyb20pIHtcbiAgICAgIGNvbnN0IG5leHRBZnRlckZyb20gPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQoXG4gICAgICAgIHRoaXMubmV4dFRva2VuU3RhcnRTaW5jZShuZXh0ICsgNCksXG4gICAgICApO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgbmV4dEFmdGVyRnJvbSA9PT0gY2hhckNvZGVzLnF1b3RhdGlvbk1hcmsgfHxcbiAgICAgICAgbmV4dEFmdGVyRnJvbSA9PT0gY2hhckNvZGVzLmFwb3N0cm9waGVcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHBhcnNlRXhwb3J0RnJvbShub2RlOiBOLkV4cG9ydE5hbWVkRGVjbGFyYXRpb24sIGV4cGVjdD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lYXRDb250ZXh0dWFsKFwiZnJvbVwiKSkge1xuICAgICAgbm9kZS5zb3VyY2UgPSB0aGlzLnBhcnNlSW1wb3J0U291cmNlKCk7XG4gICAgICB0aGlzLmNoZWNrRXhwb3J0KG5vZGUpO1xuICAgICAgY29uc3QgYXNzZXJ0aW9ucyA9IHRoaXMubWF5YmVQYXJzZUltcG9ydEFzc2VydGlvbnMoKTtcbiAgICAgIGlmIChhc3NlcnRpb25zKSB7XG4gICAgICAgIG5vZGUuYXNzZXJ0aW9ucyA9IGFzc2VydGlvbnM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChleHBlY3QpIHtcbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLnNvdXJjZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZW1pY29sb24oKTtcbiAgfVxuXG4gIHNob3VsZFBhcnNlRXhwb3J0RGVjbGFyYXRpb24oKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMubWF0Y2godHQuYXQpKSB7XG4gICAgICB0aGlzLmV4cGVjdE9uZVBsdWdpbihbXCJkZWNvcmF0b3JzXCIsIFwiZGVjb3JhdG9ycy1sZWdhY3lcIl0pO1xuICAgICAgaWYgKHRoaXMuaGFzUGx1Z2luKFwiZGVjb3JhdG9yc1wiKSkge1xuICAgICAgICBpZiAodGhpcy5nZXRQbHVnaW5PcHRpb24oXCJkZWNvcmF0b3JzXCIsIFwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydFwiKSkge1xuICAgICAgICAgIHRoaXMudW5leHBlY3RlZCh0aGlzLnN0YXRlLnN0YXJ0LCBFcnJvcnMuRGVjb3JhdG9yQmVmb3JlRXhwb3J0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnN0YXRlLnR5cGUua2V5d29yZCA9PT0gXCJ2YXJcIiB8fFxuICAgICAgdGhpcy5zdGF0ZS50eXBlLmtleXdvcmQgPT09IFwiY29uc3RcIiB8fFxuICAgICAgdGhpcy5zdGF0ZS50eXBlLmtleXdvcmQgPT09IFwiZnVuY3Rpb25cIiB8fFxuICAgICAgdGhpcy5zdGF0ZS50eXBlLmtleXdvcmQgPT09IFwiY2xhc3NcIiB8fFxuICAgICAgdGhpcy5pc0xldCgpIHx8XG4gICAgICB0aGlzLmlzQXN5bmNGdW5jdGlvbigpXG4gICAgKTtcbiAgfVxuXG4gIGNoZWNrRXhwb3J0KFxuICAgIG5vZGU6IE4uRXhwb3J0TmFtZWREZWNsYXJhdGlvbixcbiAgICBjaGVja05hbWVzPzogYm9vbGVhbixcbiAgICBpc0RlZmF1bHQ/OiBib29sZWFuLFxuICAgIGlzRnJvbT86IGJvb2xlYW4sXG4gICk6IHZvaWQge1xuICAgIGlmIChjaGVja05hbWVzKSB7XG4gICAgICAvLyBDaGVjayBmb3IgZHVwbGljYXRlIGV4cG9ydHNcbiAgICAgIGlmIChpc0RlZmF1bHQpIHtcbiAgICAgICAgLy8gRGVmYXVsdCBleHBvcnRzXG4gICAgICAgIHRoaXMuY2hlY2tEdXBsaWNhdGVFeHBvcnRzKG5vZGUsIFwiZGVmYXVsdFwiKTtcbiAgICAgICAgaWYgKHRoaXMuaGFzUGx1Z2luKFwiZXhwb3J0RGVmYXVsdEZyb21cIikpIHtcbiAgICAgICAgICBjb25zdCBkZWNsYXJhdGlvbiA9ICgobm9kZTogYW55KTogTi5FeHBvcnREZWZhdWx0RGVjbGFyYXRpb24pXG4gICAgICAgICAgICAuZGVjbGFyYXRpb247XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGVjbGFyYXRpb24udHlwZSA9PT0gXCJJZGVudGlmaWVyXCIgJiZcbiAgICAgICAgICAgIGRlY2xhcmF0aW9uLm5hbWUgPT09IFwiZnJvbVwiICYmXG4gICAgICAgICAgICBkZWNsYXJhdGlvbi5lbmQgLSBkZWNsYXJhdGlvbi5zdGFydCA9PT0gNCAmJiAvLyBkb2VzIG5vdCBjb250YWluIGVzY2FwZVxuICAgICAgICAgICAgIWRlY2xhcmF0aW9uLmV4dHJhPy5wYXJlbnRoZXNpemVkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKGRlY2xhcmF0aW9uLnN0YXJ0LCBFcnJvcnMuRXhwb3J0RGVmYXVsdEZyb21Bc0lkZW50aWZpZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChub2RlLnNwZWNpZmllcnMgJiYgbm9kZS5zcGVjaWZpZXJzLmxlbmd0aCkge1xuICAgICAgICAvLyBOYW1lZCBleHBvcnRzXG4gICAgICAgIGZvciAoY29uc3Qgc3BlY2lmaWVyIG9mIG5vZGUuc3BlY2lmaWVycykge1xuICAgICAgICAgIGNvbnN0IHsgZXhwb3J0ZWQgfSA9IHNwZWNpZmllcjtcbiAgICAgICAgICBjb25zdCBleHBvcnRlZE5hbWUgPVxuICAgICAgICAgICAgZXhwb3J0ZWQudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIgPyBleHBvcnRlZC5uYW1lIDogZXhwb3J0ZWQudmFsdWU7XG4gICAgICAgICAgdGhpcy5jaGVja0R1cGxpY2F0ZUV4cG9ydHMoc3BlY2lmaWVyLCBleHBvcnRlZE5hbWUpO1xuICAgICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgICAgaWYgKCFpc0Zyb20gJiYgc3BlY2lmaWVyLmxvY2FsKSB7XG4gICAgICAgICAgICBjb25zdCB7IGxvY2FsIH0gPSBzcGVjaWZpZXI7XG4gICAgICAgICAgICBpZiAobG9jYWwudHlwZSAhPT0gXCJJZGVudGlmaWVyXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgICBzcGVjaWZpZXIuc3RhcnQsXG4gICAgICAgICAgICAgICAgRXJyb3JzLkV4cG9ydEJpbmRpbmdJc1N0cmluZyxcbiAgICAgICAgICAgICAgICBsb2NhbC52YWx1ZSxcbiAgICAgICAgICAgICAgICBleHBvcnRlZE5hbWUsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBjaGVjayBmb3Iga2V5d29yZHMgdXNlZCBhcyBsb2NhbCBuYW1lc1xuICAgICAgICAgICAgICB0aGlzLmNoZWNrUmVzZXJ2ZWRXb3JkKGxvY2FsLm5hbWUsIGxvY2FsLnN0YXJ0LCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGV4cG9ydCBpcyBkZWZpbmVkXG4gICAgICAgICAgICAgIHRoaXMuc2NvcGUuY2hlY2tMb2NhbEV4cG9ydChsb2NhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuZGVjbGFyYXRpb24pIHtcbiAgICAgICAgLy8gRXhwb3J0ZWQgZGVjbGFyYXRpb25zXG4gICAgICAgIGlmIChcbiAgICAgICAgICBub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09IFwiRnVuY3Rpb25EZWNsYXJhdGlvblwiIHx8XG4gICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSBcIkNsYXNzRGVjbGFyYXRpb25cIlxuICAgICAgICApIHtcbiAgICAgICAgICBjb25zdCBpZCA9IG5vZGUuZGVjbGFyYXRpb24uaWQ7XG4gICAgICAgICAgaWYgKCFpZCkgdGhyb3cgbmV3IEVycm9yKFwiQXNzZXJ0aW9uIGZhaWx1cmVcIik7XG5cbiAgICAgICAgICB0aGlzLmNoZWNrRHVwbGljYXRlRXhwb3J0cyhub2RlLCBpZC5uYW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09IFwiVmFyaWFibGVEZWNsYXJhdGlvblwiKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBkZWNsYXJhdGlvbiBvZiBub2RlLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5jaGVja0RlY2xhcmF0aW9uKGRlY2xhcmF0aW9uLmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50Q29udGV4dERlY29yYXRvcnMgPVxuICAgICAgdGhpcy5zdGF0ZS5kZWNvcmF0b3JTdGFja1t0aGlzLnN0YXRlLmRlY29yYXRvclN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIC8vIElmIG5vZGUuZGVjbGFyYXRpb24gaXMgYSBjbGFzcywgaXQgd2lsbCB0YWtlIGFsbCBkZWNvcmF0b3JzIGluIHRoZSBjdXJyZW50IGNvbnRleHQuXG4gICAgLy8gVGh1cyB3ZSBzaG91bGQgdGhyb3cgaWYgd2Ugc2VlIG5vbi1lbXB0eSBkZWNvcmF0b3JzIGhlcmUuXG4gICAgaWYgKGN1cnJlbnRDb250ZXh0RGVjb3JhdG9ycy5sZW5ndGgpIHtcbiAgICAgIHRocm93IHRoaXMucmFpc2Uobm9kZS5zdGFydCwgRXJyb3JzLlVuc3VwcG9ydGVkRGVjb3JhdG9yRXhwb3J0KTtcbiAgICB9XG4gIH1cblxuICBjaGVja0RlY2xhcmF0aW9uKG5vZGU6IE4uUGF0dGVybiB8IE4uT2JqZWN0UHJvcGVydHkpOiB2b2lkIHtcbiAgICBpZiAobm9kZS50eXBlID09PSBcIklkZW50aWZpZXJcIikge1xuICAgICAgdGhpcy5jaGVja0R1cGxpY2F0ZUV4cG9ydHMobm9kZSwgbm9kZS5uYW1lKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gXCJPYmplY3RQYXR0ZXJuXCIpIHtcbiAgICAgIGZvciAoY29uc3QgcHJvcCBvZiBub2RlLnByb3BlcnRpZXMpIHtcbiAgICAgICAgdGhpcy5jaGVja0RlY2xhcmF0aW9uKHByb3ApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSBcIkFycmF5UGF0dGVyblwiKSB7XG4gICAgICBmb3IgKGNvbnN0IGVsZW0gb2Ygbm9kZS5lbGVtZW50cykge1xuICAgICAgICBpZiAoZWxlbSkge1xuICAgICAgICAgIHRoaXMuY2hlY2tEZWNsYXJhdGlvbihlbGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSBcIk9iamVjdFByb3BlcnR5XCIpIHtcbiAgICAgIHRoaXMuY2hlY2tEZWNsYXJhdGlvbihub2RlLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gXCJSZXN0RWxlbWVudFwiKSB7XG4gICAgICB0aGlzLmNoZWNrRGVjbGFyYXRpb24obm9kZS5hcmd1bWVudCk7XG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT09IFwiQXNzaWdubWVudFBhdHRlcm5cIikge1xuICAgICAgdGhpcy5jaGVja0RlY2xhcmF0aW9uKG5vZGUubGVmdCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tEdXBsaWNhdGVFeHBvcnRzKFxuICAgIG5vZGU6XG4gICAgICB8IE4uSWRlbnRpZmllclxuICAgICAgfCBOLlN0cmluZ0xpdGVyYWxcbiAgICAgIHwgTi5FeHBvcnROYW1lZERlY2xhcmF0aW9uXG4gICAgICB8IE4uRXhwb3J0U3BlY2lmaWVyXG4gICAgICB8IE4uRXhwb3J0RGVmYXVsdFNwZWNpZmllcixcbiAgICBuYW1lOiBzdHJpbmcsXG4gICk6IHZvaWQge1xuICAgIGlmICh0aGlzLmV4cG9ydGVkSWRlbnRpZmllcnMuaGFzKG5hbWUpKSB7XG4gICAgICB0aGlzLnJhaXNlKFxuICAgICAgICBub2RlLnN0YXJ0LFxuICAgICAgICBuYW1lID09PSBcImRlZmF1bHRcIlxuICAgICAgICAgID8gRXJyb3JzLkR1cGxpY2F0ZURlZmF1bHRFeHBvcnRcbiAgICAgICAgICA6IEVycm9ycy5EdXBsaWNhdGVFeHBvcnQsXG4gICAgICAgIG5hbWUsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmV4cG9ydGVkSWRlbnRpZmllcnMuYWRkKG5hbWUpO1xuICB9XG5cbiAgLy8gUGFyc2VzIGEgY29tbWEtc2VwYXJhdGVkIGxpc3Qgb2YgbW9kdWxlIGV4cG9ydHMuXG5cbiAgcGFyc2VFeHBvcnRTcGVjaWZpZXJzKCk6IEFycmF5PE4uRXhwb3J0U3BlY2lmaWVyPiB7XG4gICAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgICBsZXQgZmlyc3QgPSB0cnVlO1xuXG4gICAgLy8gZXhwb3J0IHsgeCwgeSBhcyB6IH0gW2Zyb20gJy4uLiddXG4gICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcblxuICAgIHdoaWxlICghdGhpcy5lYXQodHQuYnJhY2VSKSkge1xuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV4cGVjdCh0dC5jb21tYSk7XG4gICAgICAgIGlmICh0aGlzLmVhdCh0dC5icmFjZVIpKSBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICBub2RlLmxvY2FsID0gdGhpcy5wYXJzZU1vZHVsZUV4cG9ydE5hbWUoKTtcbiAgICAgIG5vZGUuZXhwb3J0ZWQgPSB0aGlzLmVhdENvbnRleHR1YWwoXCJhc1wiKVxuICAgICAgICA/IHRoaXMucGFyc2VNb2R1bGVFeHBvcnROYW1lKClcbiAgICAgICAgOiBub2RlLmxvY2FsLl9fY2xvbmUoKTtcbiAgICAgIG5vZGVzLnB1c2godGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRXhwb3J0U3BlY2lmaWVyXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZXM7XG4gIH1cblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1Nb2R1bGVFeHBvcnROYW1lXG4gIHBhcnNlTW9kdWxlRXhwb3J0TmFtZSgpOiBOLlN0cmluZ0xpdGVyYWwgfCBOLklkZW50aWZpZXIge1xuICAgIGlmICh0aGlzLm1hdGNoKHR0LnN0cmluZykpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucGFyc2VTdHJpbmdMaXRlcmFsKHRoaXMuc3RhdGUudmFsdWUpO1xuICAgICAgY29uc3Qgc3Vycm9nYXRlID0gcmVzdWx0LnZhbHVlLm1hdGNoKGxvbmVTdXJyb2dhdGUpO1xuICAgICAgaWYgKHN1cnJvZ2F0ZSkge1xuICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgIHJlc3VsdC5zdGFydCxcbiAgICAgICAgICBFcnJvcnMuTW9kdWxlRXhwb3J0TmFtZUhhc0xvbmVTdXJyb2dhdGUsXG4gICAgICAgICAgc3Vycm9nYXRlWzBdLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFyc2VJZGVudGlmaWVyKHRydWUpO1xuICB9XG5cbiAgLy8gUGFyc2VzIGltcG9ydCBkZWNsYXJhdGlvbi5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtSW1wb3J0RGVjbGFyYXRpb25cblxuICBwYXJzZUltcG9ydChub2RlOiBOLk5vZGUpOiBOLkFueUltcG9ydCB7XG4gICAgLy8gaW1wb3J0ICcuLi4nXG4gICAgbm9kZS5zcGVjaWZpZXJzID0gW107XG4gICAgaWYgKCF0aGlzLm1hdGNoKHR0LnN0cmluZykpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHdlIGhhdmUgYSBkZWZhdWx0IGltcG9ydCBsaWtlXG4gICAgICAvLyBpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XG4gICAgICBjb25zdCBoYXNEZWZhdWx0ID0gdGhpcy5tYXliZVBhcnNlRGVmYXVsdEltcG9ydFNwZWNpZmllcihub2RlKTtcbiAgICAgIC8qIHdlIGFyZSBjaGVja2luZyBpZiB3ZSBkbyBub3QgaGF2ZSBhIGRlZmF1bHQgaW1wb3J0LCB0aGVuIGl0IGlzIG9idmlvdXMgdGhhdCB3ZSBuZWVkIG5hbWVkIGltcG9ydHNcbiAgICAgICAqIGltcG9ydCB7IGdldCB9IGZyb20gXCJheGlvc1wiO1xuICAgICAgICogYnV0IGlmIHdlIGRvIGhhdmUgYSBkZWZhdWx0IGltcG9ydFxuICAgICAgICogd2UgbmVlZCB0byBjaGVjayBpZiB3ZSBoYXZlIGEgY29tbWEgYWZ0ZXIgdGhhdCBhbmRcbiAgICAgICAqIHRoYXQgaXMgd2hlcmUgdGhpcyBgfHwgdGhpcy5lYXRgIGNvbmRpdGlvbiBjb21lcyBpbnRvIHBsYXlcbiAgICAgICAqL1xuICAgICAgY29uc3QgcGFyc2VOZXh0ID0gIWhhc0RlZmF1bHQgfHwgdGhpcy5lYXQodHQuY29tbWEpO1xuICAgICAgLy8gaWYgd2UgZG8gaGF2ZSB0byBwYXJzZSB0aGUgbmV4dCBzZXQgb2Ygc3BlY2lmaWVycywgd2UgZmlyc3QgY2hlY2sgZm9yIHN0YXIgaW1wb3J0c1xuICAgICAgLy8gaW1wb3J0IFJlYWN0LCAqIGZyb20gXCJyZWFjdFwiO1xuICAgICAgY29uc3QgaGFzU3RhciA9IHBhcnNlTmV4dCAmJiB0aGlzLm1heWJlUGFyc2VTdGFySW1wb3J0U3BlY2lmaWVyKG5vZGUpO1xuICAgICAgLy8gbm93IHdlIGNoZWNrIGlmIHdlIG5lZWQgdG8gcGFyc2UgdGhlIG5leHQgaW1wb3J0c1xuICAgICAgLy8gYnV0IG9ubHkgaWYgdGhleSBhcmUgbm90IGltcG9ydGluZyAqIChldmVyeXRoaW5nKVxuICAgICAgaWYgKHBhcnNlTmV4dCAmJiAhaGFzU3RhcikgdGhpcy5wYXJzZU5hbWVkSW1wb3J0U3BlY2lmaWVycyhub2RlKTtcbiAgICAgIHRoaXMuZXhwZWN0Q29udGV4dHVhbChcImZyb21cIik7XG4gICAgfVxuICAgIG5vZGUuc291cmNlID0gdGhpcy5wYXJzZUltcG9ydFNvdXJjZSgpO1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWltcG9ydC1hc3NlcnRpb25zXG4gICAgLy8gcGFyc2UgbW9kdWxlIGltcG9ydCBhc3NlcnRpb25zIGlmIHRoZSBuZXh0IHRva2VuIGlzIGBhc3NlcnRgIG9yIGlnbm9yZVxuICAgIC8vIGFuZCBmaW5pc2ggdGhlIEltcG9ydERlY2xhcmF0aW9uIG5vZGUuXG4gICAgY29uc3QgYXNzZXJ0aW9ucyA9IHRoaXMubWF5YmVQYXJzZUltcG9ydEFzc2VydGlvbnMoKTtcbiAgICBpZiAoYXNzZXJ0aW9ucykge1xuICAgICAgbm9kZS5hc3NlcnRpb25zID0gYXNzZXJ0aW9ucztcbiAgICB9IGVsc2UgaWYgKCFwcm9jZXNzLmVudi5CQUJFTF84X0JSRUFLSU5HKSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5tYXliZVBhcnNlTW9kdWxlQXR0cmlidXRlcygpO1xuICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgbm9kZS5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNlbWljb2xvbigpO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJJbXBvcnREZWNsYXJhdGlvblwiKTtcbiAgfVxuXG4gIHBhcnNlSW1wb3J0U291cmNlKCk6IE4uU3RyaW5nTGl0ZXJhbCB7XG4gICAgaWYgKCF0aGlzLm1hdGNoKHR0LnN0cmluZykpIHRoaXMudW5leHBlY3RlZCgpO1xuICAgIHJldHVybiB0aGlzLnBhcnNlRXhwckF0b20oKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBzaG91bGRQYXJzZURlZmF1bHRJbXBvcnQobm9kZTogTi5JbXBvcnREZWNsYXJhdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1hdGNoKHR0Lm5hbWUpO1xuICB9XG5cbiAgcGFyc2VJbXBvcnRTcGVjaWZpZXJMb2NhbChcbiAgICBub2RlOiBOLkltcG9ydERlY2xhcmF0aW9uLFxuICAgIHNwZWNpZmllcjogTi5Ob2RlLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBjb250ZXh0RGVzY3JpcHRpb246IHN0cmluZyxcbiAgKTogdm9pZCB7XG4gICAgc3BlY2lmaWVyLmxvY2FsID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICB0aGlzLmNoZWNrTFZhbChzcGVjaWZpZXIubG9jYWwsIGNvbnRleHREZXNjcmlwdGlvbiwgQklORF9MRVhJQ0FMKTtcbiAgICBub2RlLnNwZWNpZmllcnMucHVzaCh0aGlzLmZpbmlzaE5vZGUoc3BlY2lmaWVyLCB0eXBlKSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyc2UgYXNzZXJ0IGVudHJpZXNcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLWltcG9ydC1hc3NlcnRpb25zLyNwcm9kLUFzc2VydEVudHJpZXMgfEFzc2VydEVudHJpZXN9XG4gICAqIEByZXR1cm5zIHtOLkltcG9ydEF0dHJpYnV0ZVtdfVxuICAgKiBAbWVtYmVyb2YgU3RhdGVtZW50UGFyc2VyXG4gICAqL1xuICBwYXJzZUFzc2VydEVudHJpZXMoKTogTi5JbXBvcnRBdHRyaWJ1dGVbXSB7XG4gICAgY29uc3QgYXR0cnMgPSBbXTtcbiAgICBjb25zdCBhdHRyTmFtZXMgPSBuZXcgU2V0KCk7XG5cbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5icmFjZVIpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGU8Ti5JbXBvcnRBdHRyaWJ1dGU+KCk7XG5cbiAgICAgIC8vIHBhcnNlIEFzc2VydGlvbktleSA6IElkZW50aWZpZXJOYW1lLCBTdHJpbmdMaXRlcmFsXG4gICAgICBjb25zdCBrZXlOYW1lID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgIC8vIGNoZWNrIGlmIHdlIGFscmVhZHkgaGF2ZSBhbiBlbnRyeSBmb3IgYW4gYXR0cmlidXRlXG4gICAgICAvLyBpZiBhIGR1cGxpY2F0ZSBlbnRyeSBpcyBmb3VuZCwgdGhyb3cgYW4gZXJyb3JcbiAgICAgIC8vIGZvciBub3cgdGhpcyBsb2dpYyB3aWxsIGNvbWUgaW50byBwbGF5IG9ubHkgd2hlbiBzb21lb25lIGRlY2xhcmVzIGB0eXBlYCB0d2ljZVxuICAgICAgaWYgKGF0dHJOYW1lcy5oYXMoa2V5TmFtZSkpIHtcbiAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0LFxuICAgICAgICAgIEVycm9ycy5Nb2R1bGVBdHRyaWJ1dGVzV2l0aER1cGxpY2F0ZUtleXMsXG4gICAgICAgICAga2V5TmFtZSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGF0dHJOYW1lcy5hZGQoa2V5TmFtZSk7XG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5zdHJpbmcpKSB7XG4gICAgICAgIG5vZGUua2V5ID0gdGhpcy5wYXJzZVN0cmluZ0xpdGVyYWwoa2V5TmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLmtleSA9IHRoaXMucGFyc2VJZGVudGlmaWVyKHRydWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5leHBlY3QodHQuY29sb24pO1xuXG4gICAgICBpZiAoIXRoaXMubWF0Y2godHQuc3RyaW5nKSkge1xuICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zdGFydCxcbiAgICAgICAgICBFcnJvcnMuTW9kdWxlQXR0cmlidXRlSW52YWxpZFZhbHVlLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgbm9kZS52YWx1ZSA9IHRoaXMucGFyc2VTdHJpbmdMaXRlcmFsKHRoaXMuc3RhdGUudmFsdWUpO1xuICAgICAgdGhpcy5maW5pc2hOb2RlPE4uSW1wb3J0QXR0cmlidXRlPihub2RlLCBcIkltcG9ydEF0dHJpYnV0ZVwiKTtcbiAgICAgIGF0dHJzLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAodGhpcy5lYXQodHQuY29tbWEpKTtcblxuICAgIHJldHVybiBhdHRycztcbiAgfVxuXG4gIC8qKlxuICAgKiBwYXJzZSBtb2R1bGUgYXR0cmlidXRlc1xuICAgKiBAZGVwcmVjYXRlZCBJdCB3aWxsIGJlIHJlbW92ZWQgaW4gQmFiZWwgOFxuICAgKiBAcmV0dXJuc1xuICAgKiBAbWVtYmVyb2YgU3RhdGVtZW50UGFyc2VyXG4gICAqL1xuICBtYXliZVBhcnNlTW9kdWxlQXR0cmlidXRlcygpIHtcbiAgICBpZiAodGhpcy5tYXRjaCh0dC5fd2l0aCkgJiYgIXRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKCkpIHtcbiAgICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwibW9kdWxlQXR0cmlidXRlc1wiKTtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5oYXNQbHVnaW4oXCJtb2R1bGVBdHRyaWJ1dGVzXCIpKSByZXR1cm4gW107XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgYXR0cnMgPSBbXTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbmV3IFNldCgpO1xuICAgIGRvIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgbm9kZS5rZXkgPSB0aGlzLnBhcnNlSWRlbnRpZmllcih0cnVlKTtcblxuICAgICAgaWYgKG5vZGUua2V5Lm5hbWUgIT09IFwidHlwZVwiKSB7XG4gICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgbm9kZS5rZXkuc3RhcnQsXG4gICAgICAgICAgRXJyb3JzLk1vZHVsZUF0dHJpYnV0ZURpZmZlcmVudEZyb21UeXBlLFxuICAgICAgICAgIG5vZGUua2V5Lm5hbWUsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzLmhhcyhub2RlLmtleS5uYW1lKSkge1xuICAgICAgICB0aGlzLnJhaXNlKFxuICAgICAgICAgIG5vZGUua2V5LnN0YXJ0LFxuICAgICAgICAgIEVycm9ycy5Nb2R1bGVBdHRyaWJ1dGVzV2l0aER1cGxpY2F0ZUtleXMsXG4gICAgICAgICAgbm9kZS5rZXkubmFtZSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGF0dHJpYnV0ZXMuYWRkKG5vZGUua2V5Lm5hbWUpO1xuICAgICAgdGhpcy5leHBlY3QodHQuY29sb24pO1xuICAgICAgaWYgKCF0aGlzLm1hdGNoKHR0LnN0cmluZykpIHtcbiAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdGVkKFxuICAgICAgICAgIHRoaXMuc3RhdGUuc3RhcnQsXG4gICAgICAgICAgRXJyb3JzLk1vZHVsZUF0dHJpYnV0ZUludmFsaWRWYWx1ZSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIG5vZGUudmFsdWUgPSB0aGlzLnBhcnNlU3RyaW5nTGl0ZXJhbCh0aGlzLnN0YXRlLnZhbHVlKTtcbiAgICAgIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkltcG9ydEF0dHJpYnV0ZVwiKTtcbiAgICAgIGF0dHJzLnB1c2gobm9kZSk7XG4gICAgfSB3aGlsZSAodGhpcy5lYXQodHQuY29tbWEpKTtcblxuICAgIHJldHVybiBhdHRycztcbiAgfVxuXG4gIG1heWJlUGFyc2VJbXBvcnRBc3NlcnRpb25zKCkge1xuICAgIC8vIFtubyBMaW5lVGVybWluYXRvciBoZXJlXSBBc3NlcnRDbGF1c2VcbiAgICBpZiAodGhpcy5pc0NvbnRleHR1YWwoXCJhc3NlcnRcIikgJiYgIXRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKCkpIHtcbiAgICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwiaW1wb3J0QXNzZXJ0aW9uc1wiKTtcbiAgICAgIHRoaXMubmV4dCgpOyAvLyBlYXQgYGFzc2VydGBcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaGFzUGx1Z2luKFwiaW1wb3J0QXNzZXJ0aW9uc1wiKSkgcmV0dXJuIFtdO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1pbXBvcnQtYXNzZXJ0aW9ucy8jcHJvZC1Bc3NlcnRDbGF1c2VcbiAgICB0aGlzLmVhdCh0dC5icmFjZUwpO1xuICAgIGNvbnN0IGF0dHJzID0gdGhpcy5wYXJzZUFzc2VydEVudHJpZXMoKTtcbiAgICB0aGlzLmVhdCh0dC5icmFjZVIpO1xuXG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG5cbiAgbWF5YmVQYXJzZURlZmF1bHRJbXBvcnRTcGVjaWZpZXIobm9kZTogTi5JbXBvcnREZWNsYXJhdGlvbik6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnNob3VsZFBhcnNlRGVmYXVsdEltcG9ydChub2RlKSkge1xuICAgICAgLy8gaW1wb3J0IGRlZmF1bHRPYmosIHsgeCwgeSBhcyB6IH0gZnJvbSAnLi4uJ1xuICAgICAgdGhpcy5wYXJzZUltcG9ydFNwZWNpZmllckxvY2FsKFxuICAgICAgICBub2RlLFxuICAgICAgICB0aGlzLnN0YXJ0Tm9kZSgpLFxuICAgICAgICBcIkltcG9ydERlZmF1bHRTcGVjaWZpZXJcIixcbiAgICAgICAgXCJkZWZhdWx0IGltcG9ydCBzcGVjaWZpZXJcIixcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgbWF5YmVQYXJzZVN0YXJJbXBvcnRTcGVjaWZpZXIobm9kZTogTi5JbXBvcnREZWNsYXJhdGlvbik6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLm1hdGNoKHR0LnN0YXIpKSB7XG4gICAgICBjb25zdCBzcGVjaWZpZXIgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICB0aGlzLmV4cGVjdENvbnRleHR1YWwoXCJhc1wiKTtcblxuICAgICAgdGhpcy5wYXJzZUltcG9ydFNwZWNpZmllckxvY2FsKFxuICAgICAgICBub2RlLFxuICAgICAgICBzcGVjaWZpZXIsXG4gICAgICAgIFwiSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyXCIsXG4gICAgICAgIFwiaW1wb3J0IG5hbWVzcGFjZSBzcGVjaWZpZXJcIixcbiAgICAgICk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcGFyc2VOYW1lZEltcG9ydFNwZWNpZmllcnMobm9kZTogTi5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgIGxldCBmaXJzdCA9IHRydWU7XG4gICAgdGhpcy5leHBlY3QodHQuYnJhY2VMKTtcbiAgICB3aGlsZSAoIXRoaXMuZWF0KHR0LmJyYWNlUikpIHtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRGV0ZWN0IGFuIGF0dGVtcHQgdG8gZGVlcCBkZXN0cnVjdHVyZVxuICAgICAgICBpZiAodGhpcy5lYXQodHQuY29sb24pKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnN0YXJ0LCBFcnJvcnMuRGVzdHJ1Y3R1cmVOYW1lZEltcG9ydCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV4cGVjdCh0dC5jb21tYSk7XG4gICAgICAgIGlmICh0aGlzLmVhdCh0dC5icmFjZVIpKSBicmVhaztcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJzZUltcG9ydFNwZWNpZmllcihub2RlKTtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1JbXBvcnRTcGVjaWZpZXJcbiAgcGFyc2VJbXBvcnRTcGVjaWZpZXIobm9kZTogTi5JbXBvcnREZWNsYXJhdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHNwZWNpZmllciA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgY29uc3QgaW1wb3J0ZWRJc1N0cmluZyA9IHRoaXMubWF0Y2godHQuc3RyaW5nKTtcbiAgICBzcGVjaWZpZXIuaW1wb3J0ZWQgPSB0aGlzLnBhcnNlTW9kdWxlRXhwb3J0TmFtZSgpO1xuICAgIGlmICh0aGlzLmVhdENvbnRleHR1YWwoXCJhc1wiKSkge1xuICAgICAgc3BlY2lmaWVyLmxvY2FsID0gdGhpcy5wYXJzZUlkZW50aWZpZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgeyBpbXBvcnRlZCB9ID0gc3BlY2lmaWVyO1xuICAgICAgaWYgKGltcG9ydGVkSXNTdHJpbmcpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShcbiAgICAgICAgICBzcGVjaWZpZXIuc3RhcnQsXG4gICAgICAgICAgRXJyb3JzLkltcG9ydEJpbmRpbmdJc1N0cmluZyxcbiAgICAgICAgICBpbXBvcnRlZC52YWx1ZSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2hlY2tSZXNlcnZlZFdvcmQoaW1wb3J0ZWQubmFtZSwgc3BlY2lmaWVyLnN0YXJ0LCB0cnVlLCB0cnVlKTtcbiAgICAgIHNwZWNpZmllci5sb2NhbCA9IGltcG9ydGVkLl9fY2xvbmUoKTtcbiAgICB9XG4gICAgdGhpcy5jaGVja0xWYWwoc3BlY2lmaWVyLmxvY2FsLCBcImltcG9ydCBzcGVjaWZpZXJcIiwgQklORF9MRVhJQ0FMKTtcbiAgICBub2RlLnNwZWNpZmllcnMucHVzaCh0aGlzLmZpbmlzaE5vZGUoc3BlY2lmaWVyLCBcIkltcG9ydFNwZWNpZmllclwiKSk7XG4gIH1cblxuICAvLyBUaGlzIGlzIHVzZWQgaW4gZmxvdyBhbmQgdHlwZXNjcmlwdCBwbHVnaW5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYSBwYXJhbWV0ZXIgaXMgYSB0aGlzIHBhcmFtXG4gIGlzVGhpc1BhcmFtKFxuICAgIHBhcmFtOiBOLlBhdHRlcm4gfCBOLklkZW50aWZpZXIgfCBOLlRTUGFyYW1ldGVyUHJvcGVydHksXG4gICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwYXJhbS50eXBlID09PSBcIklkZW50aWZpZXJcIiAmJiBwYXJhbS5uYW1lID09PSBcInRoaXNcIjtcbiAgfVxufVxuIl19