"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _types = require("../tokenizer/types");

var N = _interopRequireWildcard(require("../types"));

var _lval = _interopRequireDefault(require("./lval"));

var _identifier = require("../util/identifier");

var _location = require("../util/location");

var charCodes = _interopRequireWildcard(require("charcodes"));

var _scopeflags = require("../util/scopeflags");

var _util = require("./util");

var _productionParameter = require("../util/production-parameter");

var _expressionScope = require("../util/expression-scope");

var _error = require("./error");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

/*::
import type { SourceType } from "../options";
*/
var ExpressionParser = /*#__PURE__*/function (_LValParser) {
  _inherits(ExpressionParser, _LValParser);

  var _super = _createSuper(ExpressionParser);

  function ExpressionParser() {
    _classCallCheck(this, ExpressionParser);

    return _super.apply(this, arguments);
  }

  _createClass(ExpressionParser, [{
    key: "checkProto",
    value: // Forward-declaration: defined in statement.js

    /*::
    +parseBlock: (
      allowDirectives?: boolean,
      createNewLexicalScope?: boolean,
      afterBlockParse?: (hasStrictModeDirective: boolean) => void,
    ) => N.BlockStatement;
    +parseClass: (
      node: N.Class,
      isStatement: boolean,
      optionalId?: boolean,
    ) => N.Class;
    +parseDecorators: (allowExport?: boolean) => void;
    +parseFunction: <T: N.NormalFunction>(
      node: T,
      statement?: number,
      allowExpressionBody?: boolean,
      isAsync?: boolean,
    ) => T;
    +parseFunctionParams: (node: N.Function, allowModifiers?: boolean) => void;
    +takeDecorators: (node: N.HasDecorators) => void;
    +parseBlockOrModuleBlockBody: (
      body: N.Statement[],
      directives: ?(N.Directive[]),
      topLevel: boolean,
      end: TokenType,
      afterBlockParse?: (hasStrictModeDirective: boolean) => void
    ) => void
    +parseProgram: (
      program: N.Program, end: TokenType, sourceType?: SourceType
    ) => N.Program
    */
    // For object literal, check if property __proto__ has been used more than once.
    // If the expression is a destructuring assignment, then __proto__ may appear
    // multiple times. Otherwise, __proto__ is a duplicated key.
    // For record expression, check if property __proto__ exists
    function checkProto(prop, isRecord, protoRef, refExpressionErrors) {
      if (prop.type === "SpreadElement" || this.isObjectMethod(prop) || prop.computed || // $FlowIgnore
      prop.shorthand) {
        return;
      }

      var key = prop.key; // It is either an Identifier or a String/NumericLiteral

      var name = key.type === "Identifier" ? key.name : key.value;

      if (name === "__proto__") {
        if (isRecord) {
          this.raise(key.start, _error.Errors.RecordNoProto);
          return;
        }

        if (protoRef.used) {
          if (refExpressionErrors) {
            // Store the first redefinition's position, otherwise ignore because
            // we are parsing ambiguous pattern
            if (refExpressionErrors.doubleProto === -1) {
              refExpressionErrors.doubleProto = key.start;
            }
          } else {
            this.raise(key.start, _error.Errors.DuplicateProto);
          }
        }

        protoRef.used = true;
      }
    }
  }, {
    key: "shouldExitDescending",
    value: function shouldExitDescending(expr, potentialArrowAt) {
      return expr.type === "ArrowFunctionExpression" && expr.start === potentialArrowAt;
    } // Convenience method to parse an Expression only

  }, {
    key: "getExpression",
    value: function getExpression() {
      var paramFlags = _productionParameter.PARAM;

      if (this.hasPlugin("topLevelAwait") && this.inModule) {
        paramFlags |= _productionParameter.PARAM_AWAIT;
      }

      this.scope.enter(_scopeflags.SCOPE_PROGRAM);
      this.prodParam.enter(paramFlags);
      this.nextToken();
      var expr = this.parseExpression();

      if (!this.match(_types.types.eof)) {
        this.unexpected();
      }

      expr.comments = this.state.comments;
      expr.errors = this.state.errors;

      if (this.options.tokens) {
        expr.tokens = this.tokens;
      }

      return expr;
    } // ### Expression parsing
    // These nest, from the most general expression type at the top to
    // 'atomic', nondivisible expression types at the bottom. Most of
    // the functions will simply let the function (s) below them parse,
    // and, *if* the syntactic construct they handle is present, wrap
    // the AST node that the inner parser gave them in another node.
    // Parse a full expression.
    // - `disallowIn`
    //   is used to forbid the `in` operator (in for loops initialization expressions)
    //   When `disallowIn` is true, the production parameter [In] is not present.
    // - `refExpressionErrors `
    //   provides reference for storing '=' operator inside shorthand
    //   property assignment in contexts where both object expression
    //   and object pattern might appear (so it's possible to raise
    //   delayed syntax error at correct position).

  }, {
    key: "parseExpression",
    value: function parseExpression(disallowIn, refExpressionErrors) {
      var _this = this;

      if (disallowIn) {
        return this.disallowInAnd(function () {
          return _this.parseExpressionBase(refExpressionErrors);
        });
      }

      return this.allowInAnd(function () {
        return _this.parseExpressionBase(refExpressionErrors);
      });
    } // https://tc39.es/ecma262/#prod-Expression

  }, {
    key: "parseExpressionBase",
    value: function parseExpressionBase(refExpressionErrors) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      var expr = this.parseMaybeAssign(refExpressionErrors);

      if (this.match(_types.types.comma)) {
        var node = this.startNodeAt(startPos, startLoc);
        node.expressions = [expr];

        while (this.eat(_types.types.comma)) {
          node.expressions.push(this.parseMaybeAssign(refExpressionErrors));
        }

        this.toReferencedList(node.expressions);
        return this.finishNode(node, "SequenceExpression");
      }

      return expr;
    } // Set [~In] parameter for assignment expression

  }, {
    key: "parseMaybeAssignDisallowIn",
    value: function parseMaybeAssignDisallowIn(refExpressionErrors, afterLeftParse) {
      var _this2 = this;

      return this.disallowInAnd(function () {
        return _this2.parseMaybeAssign(refExpressionErrors, afterLeftParse);
      });
    } // Set [+In] parameter for assignment expression

  }, {
    key: "parseMaybeAssignAllowIn",
    value: function parseMaybeAssignAllowIn(refExpressionErrors, afterLeftParse) {
      var _this3 = this;

      return this.allowInAnd(function () {
        return _this3.parseMaybeAssign(refExpressionErrors, afterLeftParse);
      });
    } // This method is only used by
    // the typescript and flow plugins.

  }, {
    key: "setOptionalParametersError",
    value: function setOptionalParametersError(refExpressionErrors, resultError) {
      var _resultError$pos;

      refExpressionErrors.optionalParameters = (_resultError$pos = resultError === null || resultError === void 0 ? void 0 : resultError.pos) !== null && _resultError$pos !== void 0 ? _resultError$pos : this.state.start;
    } // Parse an assignment expression. This includes applications of
    // operators like `+=`.
    // https://tc39.es/ecma262/#prod-AssignmentExpression

  }, {
    key: "parseMaybeAssign",
    value: function parseMaybeAssign(refExpressionErrors, afterLeftParse) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;

      if (this.isContextual("yield")) {
        if (this.prodParam.hasYield) {
          var _left = this.parseYield();

          if (afterLeftParse) {
            _left = afterLeftParse.call(this, _left, startPos, startLoc);
          }

          return _left;
        }
      }

      var ownExpressionErrors;

      if (refExpressionErrors) {
        ownExpressionErrors = false;
      } else {
        refExpressionErrors = new _util.ExpressionErrors();
        ownExpressionErrors = true;
      }

      if (this.match(_types.types.parenL) || this.match(_types.types.name)) {
        this.state.potentialArrowAt = this.state.start;
      }

      var left = this.parseMaybeConditional(refExpressionErrors);

      if (afterLeftParse) {
        left = afterLeftParse.call(this, left, startPos, startLoc);
      }

      if (this.state.type.isAssign) {
        var node = this.startNodeAt(startPos, startLoc);
        var operator = this.state.value;
        node.operator = operator;

        if (this.match(_types.types.eq)) {
          node.left = this.toAssignable(left,
          /* isLHS */
          true);
          refExpressionErrors.doubleProto = -1; // reset because double __proto__ is valid in assignment expression
        } else {
          node.left = left;
        }

        if (refExpressionErrors.shorthandAssign >= node.left.start) {
          refExpressionErrors.shorthandAssign = -1; // reset because shorthand default was used correctly
        }

        this.checkLVal(left, "assignment expression");
        this.next();
        node.right = this.parseMaybeAssign();
        return this.finishNode(node, "AssignmentExpression");
      } else if (ownExpressionErrors) {
        this.checkExpressionErrors(refExpressionErrors, true);
      }

      return left;
    } // Parse a ternary conditional (`?:`) operator.
    // https://tc39.es/ecma262/#prod-ConditionalExpression

  }, {
    key: "parseMaybeConditional",
    value: function parseMaybeConditional(refExpressionErrors) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      var potentialArrowAt = this.state.potentialArrowAt;
      var expr = this.parseExprOps(refExpressionErrors);

      if (this.shouldExitDescending(expr, potentialArrowAt)) {
        return expr;
      }

      return this.parseConditional(expr, startPos, startLoc, refExpressionErrors);
    }
  }, {
    key: "parseConditional",
    value: function parseConditional(expr, startPos, startLoc, // eslint-disable-next-line no-unused-vars
    refExpressionErrors) {
      if (this.eat(_types.types.question)) {
        var node = this.startNodeAt(startPos, startLoc);
        node.test = expr;
        node.consequent = this.parseMaybeAssignAllowIn();
        this.expect(_types.types.colon);
        node.alternate = this.parseMaybeAssign();
        return this.finishNode(node, "ConditionalExpression");
      }

      return expr;
    } // Start the precedence parser.
    // https://tc39.es/ecma262/#prod-ShortCircuitExpression

  }, {
    key: "parseExprOps",
    value: function parseExprOps(refExpressionErrors) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      var potentialArrowAt = this.state.potentialArrowAt;
      var expr = this.parseMaybeUnary(refExpressionErrors);

      if (this.shouldExitDescending(expr, potentialArrowAt)) {
        return expr;
      }

      return this.parseExprOp(expr, startPos, startLoc, -1);
    } // Parse binary operators with the operator precedence parsing
    // algorithm. `left` is the left-hand side of the operator.
    // `minPrec` provides context that allows the function to stop and
    // defer further parser to one of its callers when it encounters an
    // operator that has a lower precedence than the set it is parsing.

  }, {
    key: "parseExprOp",
    value: function parseExprOp(left, leftStartPos, leftStartLoc, minPrec) {
      var prec = this.state.type.binop;

      if (prec != null && (this.prodParam.hasIn || !this.match(_types.types._in))) {
        if (prec > minPrec) {
          var op = this.state.type;

          if (op === _types.types.pipeline) {
            this.expectPlugin("pipelineOperator");

            if (this.state.inFSharpPipelineDirectBody) {
              return left;
            }

            this.state.inPipeline = true;
            this.checkPipelineAtInfixOperator(left, leftStartPos);
          }

          var node = this.startNodeAt(leftStartPos, leftStartLoc);
          node.left = left;
          node.operator = this.state.value;
          var logical = op === _types.types.logicalOR || op === _types.types.logicalAND;
          var coalesce = op === _types.types.nullishCoalescing;

          if (coalesce) {
            // Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
            // In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
            prec = _types.types.logicalAND.binop;
          }

          this.next();

          if (op === _types.types.pipeline && this.getPluginOption("pipelineOperator", "proposal") === "minimal") {
            if (this.match(_types.types.name) && this.state.value === "await" && this.prodParam.hasAwait) {
              throw this.raise(this.state.start, _error.Errors.UnexpectedAwaitAfterPipelineBody);
            }
          }

          node.right = this.parseExprOpRightExpr(op, prec);
          this.finishNode(node, logical || coalesce ? "LogicalExpression" : "BinaryExpression");
          /* this check is for all ?? operators
           * a ?? b && c for this example
           * when op is coalesce and nextOp is logical (&&), throw at the pos of nextOp that it can not be mixed.
           * Symmetrically it also throws when op is logical and nextOp is coalesce
           */

          var nextOp = this.state.type;

          if (coalesce && (nextOp === _types.types.logicalOR || nextOp === _types.types.logicalAND) || logical && nextOp === _types.types.nullishCoalescing) {
            throw this.raise(this.state.start, _error.Errors.MixingCoalesceWithLogical);
          }

          return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec);
        }
      }

      return left;
    } // Helper function for `parseExprOp`. Parse the right-hand side of binary-
    // operator expressions, then apply any operator-specific functions.

  }, {
    key: "parseExprOpRightExpr",
    value: function parseExprOpRightExpr(op, prec) {
      var _this4 = this;

      var startPos = this.state.start;
      var startLoc = this.state.startLoc;

      switch (op) {
        case _types.types.pipeline:
          switch (this.getPluginOption("pipelineOperator", "proposal")) {
            case "smart":
              return this.withTopicPermittingContext(function () {
                return _this4.parseSmartPipelineBody(_this4.parseExprOpBaseRightExpr(op, prec), startPos, startLoc);
              });

            case "fsharp":
              return this.withSoloAwaitPermittingContext(function () {
                return _this4.parseFSharpPipelineBody(prec);
              });
          }

        // falls through

        default:
          return this.parseExprOpBaseRightExpr(op, prec);
      }
    } // Helper function for `parseExprOpRightExpr`. Parse the right-hand side of
    // binary-operator expressions without applying any operator-specific functions.

  }, {
    key: "parseExprOpBaseRightExpr",
    value: function parseExprOpBaseRightExpr(op, prec) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      return this.parseExprOp(this.parseMaybeUnary(), startPos, startLoc, op.rightAssociative ? prec - 1 : prec);
    }
  }, {
    key: "checkExponentialAfterUnary",
    value: function checkExponentialAfterUnary(node) {
      if (this.match(_types.types.exponent)) {
        this.raise(node.argument.start, _error.Errors.UnexpectedTokenUnaryExponentiation);
      }
    } // Parse unary operators, both prefix and postfix.
    // https://tc39.es/ecma262/#prod-UnaryExpression

  }, {
    key: "parseMaybeUnary",
    value: function parseMaybeUnary(refExpressionErrors, sawUnary) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      var isAwait = this.isContextual("await");

      if (isAwait && this.isAwaitAllowed()) {
        this.next();

        var _expr = this.parseAwait(startPos, startLoc);

        if (!sawUnary) this.checkExponentialAfterUnary(_expr);
        return _expr;
      }

      if (this.isContextual("module") && this.lookaheadCharCode() === charCodes.leftCurlyBrace && !this.hasFollowingLineBreak()) {
        return this.parseModuleExpression();
      }

      var update = this.match(_types.types.incDec);
      var node = this.startNode();

      if (this.state.type.prefix) {
        node.operator = this.state.value;
        node.prefix = true;

        if (this.match(_types.types._throw)) {
          this.expectPlugin("throwExpressions");
        }

        var isDelete = this.match(_types.types._delete);
        this.next();
        node.argument = this.parseMaybeUnary(null, true);
        this.checkExpressionErrors(refExpressionErrors, true);

        if (this.state.strict && isDelete) {
          var arg = node.argument;

          if (arg.type === "Identifier") {
            this.raise(node.start, _error.Errors.StrictDelete);
          } else if (this.hasPropertyAsPrivateName(arg)) {
            this.raise(node.start, _error.Errors.DeletePrivateField);
          }
        }

        if (!update) {
          if (!sawUnary) this.checkExponentialAfterUnary(node);
          return this.finishNode(node, "UnaryExpression");
        }
      }

      var expr = this.parseUpdate(node, update, refExpressionErrors);

      if (isAwait) {
        var startsExpr = this.hasPlugin("v8intrinsic") ? this.state.type.startsExpr : this.state.type.startsExpr && !this.match(_types.types.modulo);

        if (startsExpr && !this.isAmbiguousAwait()) {
          this.raiseOverwrite(startPos, this.hasPlugin("topLevelAwait") ? _error.Errors.AwaitNotInAsyncContext : _error.Errors.AwaitNotInAsyncFunction);
          return this.parseAwait(startPos, startLoc);
        }
      }

      return expr;
    } // https://tc39.es/ecma262/#prod-UpdateExpression

  }, {
    key: "parseUpdate",
    value: function parseUpdate(node, update, refExpressionErrors) {
      if (update) {
        this.checkLVal(node.argument, "prefix operation");
        return this.finishNode(node, "UpdateExpression");
      }

      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      var expr = this.parseExprSubscripts(refExpressionErrors);
      if (this.checkExpressionErrors(refExpressionErrors, false)) return expr;

      while (this.state.type.postfix && !this.canInsertSemicolon()) {
        var _node = this.startNodeAt(startPos, startLoc);

        _node.operator = this.state.value;
        _node.prefix = false;
        _node.argument = expr;
        this.checkLVal(expr, "postfix operation");
        this.next();
        expr = this.finishNode(_node, "UpdateExpression");
      }

      return expr;
    } // Parse call, dot, and `[]`-subscript expressions.
    // https://tc39.es/ecma262/#prod-LeftHandSideExpression

  }, {
    key: "parseExprSubscripts",
    value: function parseExprSubscripts(refExpressionErrors) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      var potentialArrowAt = this.state.potentialArrowAt;
      var expr = this.parseExprAtom(refExpressionErrors);

      if (this.shouldExitDescending(expr, potentialArrowAt)) {
        return expr;
      }

      return this.parseSubscripts(expr, startPos, startLoc);
    }
  }, {
    key: "parseSubscripts",
    value: function parseSubscripts(base, startPos, startLoc, noCalls) {
      var state = {
        optionalChainMember: false,
        maybeAsyncArrow: this.atPossibleAsyncArrow(base),
        stop: false
      };

      do {
        base = this.parseSubscript(base, startPos, startLoc, noCalls, state); // After parsing a subscript, this isn't "async" for sure.

        state.maybeAsyncArrow = false;
      } while (!state.stop);

      return base;
    }
    /**
     * @param state Set 'state.stop = true' to indicate that we should stop parsing subscripts.
     *   state.optionalChainMember to indicate that the member is currently in OptionalChain
     */

  }, {
    key: "parseSubscript",
    value: function parseSubscript(base, startPos, startLoc, noCalls, state) {
      if (!noCalls && this.eat(_types.types.doubleColon)) {
        return this.parseBind(base, startPos, startLoc, noCalls, state);
      } else if (this.match(_types.types.backQuote)) {
        return this.parseTaggedTemplateExpression(base, startPos, startLoc, state);
      }

      var optional = false;

      if (this.match(_types.types.questionDot)) {
        if (noCalls && this.lookaheadCharCode() === charCodes.leftParenthesis) {
          // stop at `?.` when parsing `new a?.()`
          state.stop = true;
          return base;
        }

        state.optionalChainMember = optional = true;
        this.next();
      }

      if (!noCalls && this.match(_types.types.parenL)) {
        return this.parseCoverCallAndAsyncArrowHead(base, startPos, startLoc, state, optional);
      } else if (optional || this.match(_types.types.bracketL) || this.eat(_types.types.dot)) {
        return this.parseMember(base, startPos, startLoc, state, optional);
      } else {
        state.stop = true;
        return base;
      }
    } // base[?Yield, ?Await] [ Expression[+In, ?Yield, ?Await] ]
    // base[?Yield, ?Await] . IdentifierName
    // base[?Yield, ?Await] . PrivateIdentifier
    //   where `base` is one of CallExpression, MemberExpression and OptionalChain

  }, {
    key: "parseMember",
    value: function parseMember(base, startPos, startLoc, state, optional) {
      var node = this.startNodeAt(startPos, startLoc);
      var computed = this.eat(_types.types.bracketL);
      node.object = base;
      node.computed = computed;
      var privateName = !computed && this.match(_types.types.privateName) && this.state.value;
      var property = computed ? this.parseExpression() : privateName ? this.parsePrivateName() : this.parseIdentifier(true);

      if (privateName !== false) {
        if (node.object.type === "Super") {
          this.raise(startPos, _error.Errors.SuperPrivateField);
        }

        this.classScope.usePrivateName(privateName, property.start);
      }

      node.property = property;

      if (computed) {
        this.expect(_types.types.bracketR);
      }

      if (state.optionalChainMember) {
        node.optional = optional;
        return this.finishNode(node, "OptionalMemberExpression");
      } else {
        return this.finishNode(node, "MemberExpression");
      }
    } // https://github.com/tc39/proposal-bind-operator#syntax

  }, {
    key: "parseBind",
    value: function parseBind(base, startPos, startLoc, noCalls, state) {
      var node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      node.callee = this.parseNoCallExpr();
      state.stop = true;
      return this.parseSubscripts(this.finishNode(node, "BindExpression"), startPos, startLoc, noCalls);
    } // https://tc39.es/ecma262/#prod-CoverCallExpressionAndAsyncArrowHead
    // CoverCallExpressionAndAsyncArrowHead
    // CallExpression[?Yield, ?Await] Arguments[?Yield, ?Await]
    // OptionalChain[?Yield, ?Await] Arguments[?Yield, ?Await]

  }, {
    key: "parseCoverCallAndAsyncArrowHead",
    value: function parseCoverCallAndAsyncArrowHead(base, startPos, startLoc, state, optional) {
      var oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
      var refExpressionErrors = null;
      this.state.maybeInArrowParameters = true;
      this.next(); // eat `(`

      var node = this.startNodeAt(startPos, startLoc);
      node.callee = base;

      if (state.maybeAsyncArrow) {
        this.expressionScope.enter((0, _expressionScope.newAsyncArrowScope)());
        refExpressionErrors = new _util.ExpressionErrors();
      }

      if (state.optionalChainMember) {
        node.optional = optional;
      }

      if (optional) {
        node.arguments = this.parseCallExpressionArguments(_types.types.parenR);
      } else {
        node.arguments = this.parseCallExpressionArguments(_types.types.parenR, base.type === "Import", base.type !== "Super", node, refExpressionErrors);
      }

      this.finishCallExpression(node, state.optionalChainMember);

      if (state.maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
        state.stop = true;
        this.expressionScope.validateAsPattern();
        this.expressionScope.exit();
        node = this.parseAsyncArrowFromCallExpression(this.startNodeAt(startPos, startLoc), node);
      } else {
        if (state.maybeAsyncArrow) {
          this.checkExpressionErrors(refExpressionErrors, true);
          this.expressionScope.exit();
        }

        this.toReferencedArguments(node);
      }

      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
      return node;
    }
  }, {
    key: "toReferencedArguments",
    value: function toReferencedArguments(node, isParenthesizedExpr) {
      this.toReferencedListDeep(node.arguments, isParenthesizedExpr);
    } // MemberExpression [?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
    // CallExpression [?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]

  }, {
    key: "parseTaggedTemplateExpression",
    value: function parseTaggedTemplateExpression(base, startPos, startLoc, state) {
      var node = this.startNodeAt(startPos, startLoc);
      node.tag = base;
      node.quasi = this.parseTemplate(true);

      if (state.optionalChainMember) {
        this.raise(startPos, _error.Errors.OptionalChainingNoTemplate);
      }

      return this.finishNode(node, "TaggedTemplateExpression");
    }
  }, {
    key: "atPossibleAsyncArrow",
    value: function atPossibleAsyncArrow(base) {
      return base.type === "Identifier" && base.name === "async" && this.state.lastTokEnd === base.end && !this.canInsertSemicolon() && // check there are no escape sequences, such as \u{61}sync
      base.end - base.start === 5 && base.start === this.state.potentialArrowAt;
    }
  }, {
    key: "finishCallExpression",
    value: function finishCallExpression(node, optional) {
      if (node.callee.type === "Import") {
        if (node.arguments.length === 2) {
          if (process.env.BABEL_8_BREAKING) {
            this.expectPlugin("importAssertions");
          } else {
            if (!this.hasPlugin("moduleAttributes")) {
              this.expectPlugin("importAssertions");
            }
          }
        }

        if (node.arguments.length === 0 || node.arguments.length > 2) {
          this.raise(node.start, _error.Errors.ImportCallArity, this.hasPlugin("importAssertions") || this.hasPlugin("moduleAttributes") ? "one or two arguments" : "one argument");
        } else {
          var _iterator = _createForOfIteratorHelper(node.arguments),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var arg = _step.value;

              if (arg.type === "SpreadElement") {
                this.raise(arg.start, _error.Errors.ImportCallSpreadArgument);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }

      return this.finishNode(node, optional ? "OptionalCallExpression" : "CallExpression");
    }
  }, {
    key: "parseCallExpressionArguments",
    value: function parseCallExpressionArguments(close, dynamicImport, allowPlaceholder, nodeForExtra, refExpressionErrors) {
      var elts = [];
      var first = true;
      var oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
      this.state.inFSharpPipelineDirectBody = false;

      while (!this.eat(close)) {
        if (first) {
          first = false;
        } else {
          this.expect(_types.types.comma);

          if (this.match(close)) {
            if (dynamicImport && !this.hasPlugin("importAssertions") && !this.hasPlugin("moduleAttributes")) {
              this.raise(this.state.lastTokStart, _error.Errors.ImportCallArgumentTrailingComma);
            }

            if (nodeForExtra) {
              this.addExtra(nodeForExtra, "trailingComma", this.state.lastTokStart);
            }

            this.next();
            break;
          }
        }

        elts.push(this.parseExprListItem(false, refExpressionErrors, allowPlaceholder));
      }

      this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
      return elts;
    }
  }, {
    key: "shouldParseAsyncArrow",
    value: function shouldParseAsyncArrow() {
      return this.match(_types.types.arrow) && !this.canInsertSemicolon();
    }
  }, {
    key: "parseAsyncArrowFromCallExpression",
    value: function parseAsyncArrowFromCallExpression(node, call) {
      var _call$extra;

      this.expect(_types.types.arrow);
      this.parseArrowExpression(node, call.arguments, true, false, (_call$extra = call.extra) === null || _call$extra === void 0 ? void 0 : _call$extra.trailingComma);
      return node;
    } // Parse a no-call expression (like argument of `new` or `::` operators).
    // https://tc39.es/ecma262/#prod-MemberExpression

  }, {
    key: "parseNoCallExpr",
    value: function parseNoCallExpr() {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      return this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
    } // Parse an atomic expression — either a single token that is an
    // expression, an expression started by a keyword like `function` or
    // `new`, or an expression wrapped in punctuation like `()`, `[]`,
    // or `{}`.
    // https://tc39.es/ecma262/#prod-PrimaryExpression
    // https://tc39.es/ecma262/#prod-AsyncArrowFunction
    // PrimaryExpression
    // Super
    // Import
    // AsyncArrowFunction

  }, {
    key: "parseExprAtom",
    value: function parseExprAtom(refExpressionErrors) {
      var node;

      switch (this.state.type) {
        case _types.types._super:
          return this.parseSuper();

        case _types.types._import:
          node = this.startNode();
          this.next();

          if (this.match(_types.types.dot)) {
            return this.parseImportMetaProperty(node);
          }

          if (!this.match(_types.types.parenL)) {
            this.raise(this.state.lastTokStart, _error.Errors.UnsupportedImport);
          }

          return this.finishNode(node, "Import");

        case _types.types._this:
          node = this.startNode();
          this.next();
          return this.finishNode(node, "ThisExpression");

        case _types.types.name:
          {
            var canBeArrow = this.state.potentialArrowAt === this.state.start;
            var containsEsc = this.state.containsEsc;
            var id = this.parseIdentifier();

            if (!containsEsc && id.name === "async" && !this.canInsertSemicolon()) {
              if (this.match(_types.types._function)) {
                this.next();
                return this.parseFunction(this.startNodeAtNode(id), undefined, true);
              } else if (this.match(_types.types.name)) {
                // If the next token begins with "=", commit to parsing an async
                // arrow function. (Peeking ahead for "=" lets us avoid a more
                // expensive full-token lookahead on this common path.)
                if (this.lookaheadCharCode() === charCodes.equalsTo) {
                  return this.parseAsyncArrowUnaryFunction(id);
                } else {
                  // Otherwise, treat "async" as an identifier and let calling code
                  // deal with the current tt.name token.
                  return id;
                }
              } else if (this.match(_types.types._do)) {
                return this.parseDo(true);
              }
            }

            if (canBeArrow && this.match(_types.types.arrow) && !this.canInsertSemicolon()) {
              this.next();
              return this.parseArrowExpression(this.startNodeAtNode(id), [id], false);
            }

            return id;
          }

        case _types.types._do:
          {
            return this.parseDo(false);
          }

        case _types.types.slash:
        case _types.types.slashAssign:
          {
            this.readRegexp();
            return this.parseRegExpLiteral(this.state.value);
          }

        case _types.types.num:
          return this.parseNumericLiteral(this.state.value);

        case _types.types.bigint:
          return this.parseBigIntLiteral(this.state.value);

        case _types.types.decimal:
          return this.parseDecimalLiteral(this.state.value);

        case _types.types.string:
          return this.parseStringLiteral(this.state.value);

        case _types.types._null:
          return this.parseNullLiteral();

        case _types.types._true:
          return this.parseBooleanLiteral(true);

        case _types.types._false:
          return this.parseBooleanLiteral(false);

        case _types.types.parenL:
          {
            var _canBeArrow = this.state.potentialArrowAt === this.state.start;

            return this.parseParenAndDistinguishExpression(_canBeArrow);
          }

        case _types.types.bracketBarL:
        case _types.types.bracketHashL:
          {
            return this.parseArrayLike(this.state.type === _types.types.bracketBarL ? _types.types.bracketBarR : _types.types.bracketR,
            /* canBePattern */
            false,
            /* isTuple */
            true, refExpressionErrors);
          }

        case _types.types.bracketL:
          {
            return this.parseArrayLike(_types.types.bracketR,
            /* canBePattern */
            true,
            /* isTuple */
            false, refExpressionErrors);
          }

        case _types.types.braceBarL:
        case _types.types.braceHashL:
          {
            return this.parseObjectLike(this.state.type === _types.types.braceBarL ? _types.types.braceBarR : _types.types.braceR,
            /* isPattern */
            false,
            /* isRecord */
            true, refExpressionErrors);
          }

        case _types.types.braceL:
          {
            return this.parseObjectLike(_types.types.braceR,
            /* isPattern */
            false,
            /* isRecord */
            false, refExpressionErrors);
          }

        case _types.types._function:
          return this.parseFunctionOrFunctionSent();

        case _types.types.at:
          this.parseDecorators();
        // fall through

        case _types.types._class:
          node = this.startNode();
          this.takeDecorators(node);
          return this.parseClass(node, false);

        case _types.types._new:
          return this.parseNewOrNewTarget();

        case _types.types.backQuote:
          return this.parseTemplate(false);
        // BindExpression[Yield]
        //   :: MemberExpression[?Yield]

        case _types.types.doubleColon:
          {
            node = this.startNode();
            this.next();
            node.object = null;
            var callee = node.callee = this.parseNoCallExpr();

            if (callee.type === "MemberExpression") {
              return this.finishNode(node, "BindExpression");
            } else {
              throw this.raise(callee.start, _error.Errors.UnsupportedBind);
            }
          }

        case _types.types.privateName:
          {
            // https://tc39.es/proposal-private-fields-in-in
            // RelationalExpression [In, Yield, Await]
            //   [+In] PrivateIdentifier in ShiftExpression[?Yield, ?Await]
            var start = this.state.start;
            var value = this.state.value;
            node = this.parsePrivateName();

            if (this.match(_types.types._in)) {
              this.expectPlugin("privateIn");
              this.classScope.usePrivateName(value, node.start);
            } else if (this.hasPlugin("privateIn")) {
              this.raise(this.state.start, _error.Errors.PrivateInExpectedIn, value);
            } else {
              throw this.unexpected(start);
            }

            return node;
          }

        case _types.types.hash:
          {
            if (this.state.inPipeline) {
              node = this.startNode();

              if (this.getPluginOption("pipelineOperator", "proposal") !== "smart") {
                this.raise(node.start, _error.Errors.PrimaryTopicRequiresSmartPipeline);
              }

              this.next();

              if (!this.primaryTopicReferenceIsAllowedInCurrentTopicContext()) {
                this.raise(node.start, _error.Errors.PrimaryTopicNotAllowed);
              }

              this.registerTopicReference();
              return this.finishNode(node, "PipelinePrimaryTopicReference");
            }
          }
        // fall through

        case _types.types.relational:
          {
            if (this.state.value === "<") {
              var lookaheadCh = this.input.codePointAt(this.nextTokenStart());

              if ((0, _identifier.isIdentifierStart)(lookaheadCh) || // Element/Type Parameter <foo>
              lookaheadCh === charCodes.greaterThan // Fragment <>
              ) {
                  this.expectOnePlugin(["jsx", "flow", "typescript"]);
                }
            }
          }
        // fall through

        default:
          throw this.unexpected();
      }
    } // async [no LineTerminator here] AsyncArrowBindingIdentifier[?Yield] [no LineTerminator here] => AsyncConciseBody[?In]

  }, {
    key: "parseAsyncArrowUnaryFunction",
    value: function parseAsyncArrowUnaryFunction(id) {
      var node = this.startNodeAtNode(id); // We don't need to push a new ParameterDeclarationScope here since we are sure
      // 1) it is an async arrow, 2) no biding pattern is allowed in params

      this.prodParam.enter((0, _productionParameter.functionFlags)(true, this.prodParam.hasYield));
      var params = [this.parseIdentifier()];
      this.prodParam.exit();

      if (this.hasPrecedingLineBreak()) {
        this.raise(this.state.pos, _error.Errors.LineTerminatorBeforeArrow);
      }

      this.expect(_types.types.arrow); // let foo = async bar => {};

      this.parseArrowExpression(node, params, true);
      return node;
    } // https://github.com/tc39/proposal-do-expressions
    // https://github.com/tc39/proposal-async-do-expressions

  }, {
    key: "parseDo",
    value: function parseDo(isAsync) {
      this.expectPlugin("doExpressions");

      if (isAsync) {
        this.expectPlugin("asyncDoExpressions");
      }

      var node = this.startNode();
      node.async = isAsync;
      this.next(); // eat `do`

      var oldLabels = this.state.labels;
      this.state.labels = [];

      if (isAsync) {
        // AsyncDoExpression :
        // async [no LineTerminator here] do Block[~Yield, +Await, ~Return]
        this.prodParam.enter(_productionParameter.PARAM_AWAIT);
        node.body = this.parseBlock();
        this.prodParam.exit();
      } else {
        node.body = this.parseBlock();
      }

      this.state.labels = oldLabels;
      return this.finishNode(node, "DoExpression");
    } // Parse the `super` keyword

  }, {
    key: "parseSuper",
    value: function parseSuper() {
      var node = this.startNode();
      this.next(); // eat `super`

      if (this.match(_types.types.parenL) && !this.scope.allowDirectSuper && !this.options.allowSuperOutsideMethod) {
        this.raise(node.start, _error.Errors.SuperNotAllowed);
      } else if (!this.scope.allowSuper && !this.options.allowSuperOutsideMethod) {
        this.raise(node.start, _error.Errors.UnexpectedSuper);
      }

      if (!this.match(_types.types.parenL) && !this.match(_types.types.bracketL) && !this.match(_types.types.dot)) {
        this.raise(node.start, _error.Errors.UnsupportedSuper);
      }

      return this.finishNode(node, "Super");
    }
  }, {
    key: "parseMaybePrivateName",
    value: function parseMaybePrivateName(isPrivateNameAllowed) {
      var isPrivate = this.match(_types.types.privateName);

      if (isPrivate) {
        if (!isPrivateNameAllowed) {
          this.raise(this.state.start + 1, _error.Errors.UnexpectedPrivateField);
        }

        return this.parsePrivateName();
      } else {
        return this.parseIdentifier(true);
      }
    }
  }, {
    key: "parsePrivateName",
    value: function parsePrivateName() {
      var node = this.startNode();
      var id = this.startNodeAt(this.state.start + 1, // The position is hardcoded because we merge `#` and name into a single
      // tt.privateName token
      new _location.Position(this.state.curLine, this.state.start + 1 - this.state.lineStart));
      var name = this.state.value;
      this.next(); // eat #name;

      node.id = this.createIdentifier(id, name);
      return this.finishNode(node, "PrivateName");
    }
  }, {
    key: "parseFunctionOrFunctionSent",
    value: function parseFunctionOrFunctionSent() {
      var node = this.startNode(); // We do not do parseIdentifier here because when parseFunctionOrFunctionSent
      // is called we already know that the current token is a "name" with the value "function"
      // This will improve perf a tiny little bit as we do not do validation but more importantly
      // here is that parseIdentifier will remove an item from the expression stack
      // if "function" or "class" is parsed as identifier (in objects e.g.), which should not happen here.

      this.next(); // eat `function`

      if (this.prodParam.hasYield && this.match(_types.types.dot)) {
        var meta = this.createIdentifier(this.startNodeAtNode(node), "function");
        this.next(); // eat `.`

        return this.parseMetaProperty(node, meta, "sent");
      }

      return this.parseFunction(node);
    }
  }, {
    key: "parseMetaProperty",
    value: function parseMetaProperty(node, meta, propertyName) {
      node.meta = meta;

      if (meta.name === "function" && propertyName === "sent") {
        // https://github.com/tc39/proposal-function.sent#syntax-1
        if (this.isContextual(propertyName)) {
          this.expectPlugin("functionSent");
        } else if (!this.hasPlugin("functionSent")) {
          // The code wasn't `function.sent` but just `function.`, so a simple error is less confusing.
          this.unexpected();
        }
      }

      var containsEsc = this.state.containsEsc;
      node.property = this.parseIdentifier(true);

      if (node.property.name !== propertyName || containsEsc) {
        this.raise(node.property.start, _error.Errors.UnsupportedMetaProperty, meta.name, propertyName);
      }

      return this.finishNode(node, "MetaProperty");
    } // https://tc39.es/ecma262/#prod-ImportMeta

  }, {
    key: "parseImportMetaProperty",
    value: function parseImportMetaProperty(node) {
      var id = this.createIdentifier(this.startNodeAtNode(node), "import");
      this.next(); // eat `.`

      if (this.isContextual("meta")) {
        if (!this.inModule) {
          this.raise(id.start, _error.SourceTypeModuleErrors.ImportMetaOutsideModule);
        }

        this.sawUnambiguousESM = true;
      }

      return this.parseMetaProperty(node, id, "meta");
    }
  }, {
    key: "parseLiteralAtNode",
    value: function parseLiteralAtNode(value, type, node) {
      this.addExtra(node, "rawValue", value);
      this.addExtra(node, "raw", this.input.slice(node.start, this.state.end));
      node.value = value;
      this.next();
      return this.finishNode(node, type);
    }
  }, {
    key: "parseLiteral",
    value: function parseLiteral(value, type) {
      var node = this.startNode();
      return this.parseLiteralAtNode(value, type, node);
    }
  }, {
    key: "parseStringLiteral",
    value: function parseStringLiteral(value) {
      return this.parseLiteral(value, "StringLiteral");
    }
  }, {
    key: "parseNumericLiteral",
    value: function parseNumericLiteral(value) {
      return this.parseLiteral(value, "NumericLiteral");
    }
  }, {
    key: "parseBigIntLiteral",
    value: function parseBigIntLiteral(value) {
      return this.parseLiteral(value, "BigIntLiteral");
    }
  }, {
    key: "parseDecimalLiteral",
    value: function parseDecimalLiteral(value) {
      return this.parseLiteral(value, "DecimalLiteral");
    }
  }, {
    key: "parseRegExpLiteral",
    value: function parseRegExpLiteral(value) {
      var node = this.parseLiteral(value.value, "RegExpLiteral");
      node.pattern = value.pattern;
      node.flags = value.flags;
      return node;
    }
  }, {
    key: "parseBooleanLiteral",
    value: function parseBooleanLiteral(value) {
      var node = this.startNode();
      node.value = value;
      this.next();
      return this.finishNode(node, "BooleanLiteral");
    }
  }, {
    key: "parseNullLiteral",
    value: function parseNullLiteral() {
      var node = this.startNode();
      this.next();
      return this.finishNode(node, "NullLiteral");
    } // https://tc39.es/ecma262/#prod-CoverParenthesizedExpressionAndArrowParameterList

  }, {
    key: "parseParenAndDistinguishExpression",
    value: function parseParenAndDistinguishExpression(canBeArrow) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      var val;
      this.next(); // eat `(`

      this.expressionScope.enter((0, _expressionScope.newArrowHeadScope)());
      var oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
      var oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
      this.state.maybeInArrowParameters = true;
      this.state.inFSharpPipelineDirectBody = false;
      var innerStartPos = this.state.start;
      var innerStartLoc = this.state.startLoc;
      var exprList = [];
      var refExpressionErrors = new _util.ExpressionErrors();
      var first = true;
      var spreadStart;
      var optionalCommaStart;

      while (!this.match(_types.types.parenR)) {
        if (first) {
          first = false;
        } else {
          this.expect(_types.types.comma, refExpressionErrors.optionalParameters === -1 ? null : refExpressionErrors.optionalParameters);

          if (this.match(_types.types.parenR)) {
            optionalCommaStart = this.state.start;
            break;
          }
        }

        if (this.match(_types.types.ellipsis)) {
          var spreadNodeStartPos = this.state.start;
          var spreadNodeStartLoc = this.state.startLoc;
          spreadStart = this.state.start;
          exprList.push(this.parseParenItem(this.parseRestBinding(), spreadNodeStartPos, spreadNodeStartLoc));
          this.checkCommaAfterRest(charCodes.rightParenthesis);
          break;
        } else {
          exprList.push(this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem));
        }
      }

      var innerEndPos = this.state.lastTokEnd;
      var innerEndLoc = this.state.lastTokEndLoc;
      this.expect(_types.types.parenR);
      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
      this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
      var arrowNode = this.startNodeAt(startPos, startLoc);

      if (canBeArrow && this.shouldParseArrow() && (arrowNode = this.parseArrow(arrowNode))) {
        this.expressionScope.validateAsPattern();
        this.expressionScope.exit();
        this.parseArrowExpression(arrowNode, exprList, false);
        return arrowNode;
      }

      this.expressionScope.exit();

      if (!exprList.length) {
        this.unexpected(this.state.lastTokStart);
      }

      if (optionalCommaStart) this.unexpected(optionalCommaStart);
      if (spreadStart) this.unexpected(spreadStart);
      this.checkExpressionErrors(refExpressionErrors, true);
      this.toReferencedListDeep(exprList,
      /* isParenthesizedExpr */
      true);

      if (exprList.length > 1) {
        val = this.startNodeAt(innerStartPos, innerStartLoc);
        val.expressions = exprList;
        this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
      } else {
        val = exprList[0];
      }

      if (!this.options.createParenthesizedExpressions) {
        this.addExtra(val, "parenthesized", true);
        this.addExtra(val, "parenStart", startPos);
        return val;
      }

      var parenExpression = this.startNodeAt(startPos, startLoc);
      parenExpression.expression = val;
      this.finishNode(parenExpression, "ParenthesizedExpression");
      return parenExpression;
    }
  }, {
    key: "shouldParseArrow",
    value: function shouldParseArrow() {
      return !this.canInsertSemicolon();
    }
  }, {
    key: "parseArrow",
    value: function parseArrow(node) {
      if (this.eat(_types.types.arrow)) {
        return node;
      }
    }
  }, {
    key: "parseParenItem",
    value: function parseParenItem(node, startPos, // eslint-disable-line no-unused-vars
    startLoc) {
      return node;
    }
  }, {
    key: "parseNewOrNewTarget",
    value: function parseNewOrNewTarget() {
      var node = this.startNode();
      this.next();

      if (this.match(_types.types.dot)) {
        // https://tc39.es/ecma262/#prod-NewTarget
        var meta = this.createIdentifier(this.startNodeAtNode(node), "new");
        this.next();
        var metaProp = this.parseMetaProperty(node, meta, "target");

        if (!this.scope.inNonArrowFunction && !this.scope.inClass) {
          this.raise(metaProp.start, _error.Errors.UnexpectedNewTarget);
        }

        return metaProp;
      }

      return this.parseNew(node);
    } // New's precedence is slightly tricky. It must allow its argument to
    // be a `[]` or dot subscript expression, but not a call — at least,
    // not without wrapping it in parentheses. Thus, it uses the noCalls
    // argument to parseSubscripts to prevent it from consuming the
    // argument list.
    // https://tc39.es/ecma262/#prod-NewExpression

  }, {
    key: "parseNew",
    value: function parseNew(node) {
      node.callee = this.parseNoCallExpr();

      if (node.callee.type === "Import") {
        this.raise(node.callee.start, _error.Errors.ImportCallNotNewExpression);
      } else if (this.isOptionalChain(node.callee)) {
        this.raise(this.state.lastTokEnd, _error.Errors.OptionalChainingNoNew);
      } else if (this.eat(_types.types.questionDot)) {
        this.raise(this.state.start, _error.Errors.OptionalChainingNoNew);
      }

      this.parseNewArguments(node);
      return this.finishNode(node, "NewExpression");
    }
  }, {
    key: "parseNewArguments",
    value: function parseNewArguments(node) {
      if (this.eat(_types.types.parenL)) {
        var args = this.parseExprList(_types.types.parenR);
        this.toReferencedList(args); // $FlowFixMe (parseExprList should be all non-null in this case)

        node.arguments = args;
      } else {
        node.arguments = [];
      }
    } // Parse template expression.

  }, {
    key: "parseTemplateElement",
    value: function parseTemplateElement(isTagged) {
      var elem = this.startNode();

      if (this.state.value === null) {
        if (!isTagged) {
          this.raise(this.state.start + 1, _error.Errors.InvalidEscapeSequenceTemplate);
        }
      }

      elem.value = {
        raw: this.input.slice(this.state.start, this.state.end).replace(/\r\n?/g, "\n"),
        cooked: this.state.value
      };
      this.next();
      elem.tail = this.match(_types.types.backQuote);
      return this.finishNode(elem, "TemplateElement");
    } // https://tc39.es/ecma262/#prod-TemplateLiteral

  }, {
    key: "parseTemplate",
    value: function parseTemplate(isTagged) {
      var node = this.startNode();
      this.next();
      node.expressions = [];
      var curElt = this.parseTemplateElement(isTagged);
      node.quasis = [curElt];

      while (!curElt.tail) {
        this.expect(_types.types.dollarBraceL);
        node.expressions.push(this.parseTemplateSubstitution());
        this.expect(_types.types.braceR);
        node.quasis.push(curElt = this.parseTemplateElement(isTagged));
      }

      this.next();
      return this.finishNode(node, "TemplateLiteral");
    } // This is overwritten by the TypeScript plugin to parse template types

  }, {
    key: "parseTemplateSubstitution",
    value: function parseTemplateSubstitution() {
      return this.parseExpression();
    } // Parse an object literal, binding pattern, or record.

  }, {
    key: "parseObjectLike",
    value: function parseObjectLike(close, isPattern, isRecord, refExpressionErrors) {
      if (isRecord) {
        this.expectPlugin("recordAndTuple");
      }

      var oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
      this.state.inFSharpPipelineDirectBody = false;
      var propHash = Object.create(null);
      var first = true;
      var node = this.startNode();
      node.properties = [];
      this.next();

      while (!this.match(close)) {
        if (first) {
          first = false;
        } else {
          this.expect(_types.types.comma);

          if (this.match(close)) {
            this.addExtra(node, "trailingComma", this.state.lastTokStart);
            break;
          }
        }

        var prop = this.parsePropertyDefinition(isPattern, refExpressionErrors);

        if (!isPattern) {
          // $FlowIgnore RestElement will never be returned if !isPattern
          this.checkProto(prop, isRecord, propHash, refExpressionErrors);
        }

        if (isRecord && !this.isObjectProperty(prop) && prop.type !== "SpreadElement") {
          this.raise(prop.start, _error.Errors.InvalidRecordProperty);
        } // $FlowIgnore


        if (prop.shorthand) {
          this.addExtra(prop, "shorthand", true);
        }

        node.properties.push(prop);
      }

      this.next();
      this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
      var type = "ObjectExpression";

      if (isPattern) {
        type = "ObjectPattern";
      } else if (isRecord) {
        type = "RecordExpression";
      }

      return this.finishNode(node, type);
    } // Check grammar production:
    //   IdentifierName *_opt PropertyName
    // It is used in `parsePropertyDefinition` to detect AsyncMethod and Accessors

  }, {
    key: "maybeAsyncOrAccessorProp",
    value: function maybeAsyncOrAccessorProp(prop) {
      return !prop.computed && prop.key.type === "Identifier" && (this.isLiteralPropertyName() || this.match(_types.types.bracketL) || this.match(_types.types.star));
    } // https://tc39.es/ecma262/#prod-PropertyDefinition

  }, {
    key: "parsePropertyDefinition",
    value: function parsePropertyDefinition(isPattern, refExpressionErrors) {
      var decorators = [];

      if (this.match(_types.types.at)) {
        if (this.hasPlugin("decorators")) {
          this.raise(this.state.start, _error.Errors.UnsupportedPropertyDecorator);
        } // we needn't check if decorators (stage 0) plugin is enabled since it's checked by
        // the call to this.parseDecorator


        while (this.match(_types.types.at)) {
          decorators.push(this.parseDecorator());
        }
      }

      var prop = this.startNode();
      var isGenerator = false;
      var isAsync = false;
      var isAccessor = false;
      var startPos;
      var startLoc;

      if (this.match(_types.types.ellipsis)) {
        if (decorators.length) this.unexpected();

        if (isPattern) {
          this.next(); // Don't use parseRestBinding() as we only allow Identifier here.

          prop.argument = this.parseIdentifier();
          this.checkCommaAfterRest(charCodes.rightCurlyBrace);
          return this.finishNode(prop, "RestElement");
        }

        return this.parseSpread();
      }

      if (decorators.length) {
        prop.decorators = decorators;
        decorators = [];
      }

      prop.method = false;

      if (isPattern || refExpressionErrors) {
        startPos = this.state.start;
        startLoc = this.state.startLoc;
      }

      if (!isPattern) {
        isGenerator = this.eat(_types.types.star);
      }

      var containsEsc = this.state.containsEsc;
      var key = this.parsePropertyName(prop,
      /* isPrivateNameAllowed */
      false);

      if (!isPattern && !isGenerator && !containsEsc && this.maybeAsyncOrAccessorProp(prop)) {
        var keyName = key.name; // https://tc39.es/ecma262/#prod-AsyncMethod
        // https://tc39.es/ecma262/#prod-AsyncGeneratorMethod

        if (keyName === "async" && !this.hasPrecedingLineBreak()) {
          isAsync = true;
          isGenerator = this.eat(_types.types.star);
          this.parsePropertyName(prop,
          /* isPrivateNameAllowed */
          false);
        } // get PropertyName[?Yield, ?Await] () { FunctionBody[~Yield, ~Await] }
        // set PropertyName[?Yield, ?Await] ( PropertySetParameterList ) { FunctionBody[~Yield, ~Await] }


        if (keyName === "get" || keyName === "set") {
          isAccessor = true;
          prop.kind = keyName;

          if (this.match(_types.types.star)) {
            isGenerator = true;
            this.raise(this.state.pos, _error.Errors.AccessorIsGenerator, keyName);
            this.next();
          }

          this.parsePropertyName(prop,
          /* isPrivateNameAllowed */
          false);
        }
      }

      this.parseObjPropValue(prop, startPos, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors);
      return prop;
    }
  }, {
    key: "getGetterSetterExpectedParamCount",
    value: function getGetterSetterExpectedParamCount(method) {
      return method.kind === "get" ? 0 : 1;
    } // This exists so we can override within the ESTree plugin

  }, {
    key: "getObjectOrClassMethodParams",
    value: function getObjectOrClassMethodParams(method) {
      return method.params;
    } // get methods aren't allowed to have any parameters
    // set methods must have exactly 1 parameter which is not a rest parameter

  }, {
    key: "checkGetterSetterParams",
    value: function checkGetterSetterParams(method) {
      var _params;

      var paramCount = this.getGetterSetterExpectedParamCount(method);
      var params = this.getObjectOrClassMethodParams(method);
      var start = method.start;

      if (params.length !== paramCount) {
        if (method.kind === "get") {
          this.raise(start, _error.Errors.BadGetterArity);
        } else {
          this.raise(start, _error.Errors.BadSetterArity);
        }
      }

      if (method.kind === "set" && ((_params = params[params.length - 1]) === null || _params === void 0 ? void 0 : _params.type) === "RestElement") {
        this.raise(start, _error.Errors.BadSetterRestParameter);
      }
    } // https://tc39.es/ecma262/#prod-MethodDefinition

  }, {
    key: "parseObjectMethod",
    value: function parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
      if (isAccessor) {
        // isAccessor implies isAsync: false, isPattern: false, isGenerator: false
        this.parseMethod(prop, // This _should_ be false, but with error recovery, we allow it to be
        // set for informational purposes
        isGenerator,
        /* isAsync */
        false,
        /* isConstructor */
        false, false, "ObjectMethod");
        this.checkGetterSetterParams(prop);
        return prop;
      }

      if (isAsync || isGenerator || this.match(_types.types.parenL)) {
        if (isPattern) this.unexpected();
        prop.kind = "method";
        prop.method = true;
        return this.parseMethod(prop, isGenerator, isAsync,
        /* isConstructor */
        false, false, "ObjectMethod");
      }
    } // if `isPattern` is true, parse https://tc39.es/ecma262/#prod-BindingProperty
    // else https://tc39.es/ecma262/#prod-PropertyDefinition

  }, {
    key: "parseObjectProperty",
    value: function parseObjectProperty(prop, startPos, startLoc, isPattern, refExpressionErrors) {
      prop.shorthand = false;

      if (this.eat(_types.types.colon)) {
        prop.value = isPattern ? this.parseMaybeDefault(this.state.start, this.state.startLoc) : this.parseMaybeAssignAllowIn(refExpressionErrors);
        return this.finishNode(prop, "ObjectProperty");
      }

      if (!prop.computed && prop.key.type === "Identifier") {
        // PropertyDefinition:
        //   IdentifierReference
        //   CoveredInitializedName
        // Note: `{ eval } = {}` will be checked in `checkLVal` later.
        this.checkReservedWord(prop.key.name, prop.key.start, true, false);

        if (isPattern) {
          prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key.__clone());
        } else if (this.match(_types.types.eq) && refExpressionErrors) {
          if (refExpressionErrors.shorthandAssign === -1) {
            refExpressionErrors.shorthandAssign = this.state.start;
          }

          prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key.__clone());
        } else {
          prop.value = prop.key.__clone();
        }

        prop.shorthand = true;
        return this.finishNode(prop, "ObjectProperty");
      }
    }
  }, {
    key: "parseObjPropValue",
    value: function parseObjPropValue(prop, startPos, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
      var node = this.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) || this.parseObjectProperty(prop, startPos, startLoc, isPattern, refExpressionErrors);
      if (!node) this.unexpected(); // $FlowFixMe

      return node;
    }
  }, {
    key: "parsePropertyName",
    value: function parsePropertyName(prop, isPrivateNameAllowed) {
      if (this.eat(_types.types.bracketL)) {
        prop.computed = true;
        prop.key = this.parseMaybeAssignAllowIn();
        this.expect(_types.types.bracketR);
      } else {
        var oldInPropertyName = this.state.inPropertyName;
        this.state.inPropertyName = true; // We check if it's valid for it to be a private name when we push it.

        var type = this.state.type;
        prop.key = type === _types.types.num || type === _types.types.string || type === _types.types.bigint || type === _types.types.decimal ? this.parseExprAtom() : this.parseMaybePrivateName(isPrivateNameAllowed);

        if (type !== _types.types.privateName) {
          // ClassPrivateProperty is never computed, so we don't assign in that case.
          prop.computed = false;
        }

        this.state.inPropertyName = oldInPropertyName;
      }

      return prop.key;
    } // Initialize empty function node.

  }, {
    key: "initFunction",
    value: function initFunction(node, isAsync) {
      node.id = null;
      node.generator = false;
      node.async = !!isAsync;
    } // Parse object or class method.

  }, {
    key: "parseMethod",
    value: function parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type) {
      var inClassScope = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
      this.initFunction(node, isAsync);
      node.generator = !!isGenerator;
      var allowModifiers = isConstructor; // For TypeScript parameter properties

      this.scope.enter(_scopeflags.SCOPE_FUNCTION | _scopeflags.SCOPE_SUPER | (inClassScope ? _scopeflags.SCOPE_CLASS : 0) | (allowDirectSuper ? _scopeflags.SCOPE_DIRECT_SUPER : 0));
      this.prodParam.enter((0, _productionParameter.functionFlags)(isAsync, node.generator));
      this.parseFunctionParams(node, allowModifiers);
      this.parseFunctionBodyAndFinish(node, type, true);
      this.prodParam.exit();
      this.scope.exit();
      return node;
    } // parse an array literal or tuple literal
    // https://tc39.es/ecma262/#prod-ArrayLiteral
    // https://tc39.es/proposal-record-tuple/#prod-TupleLiteral

  }, {
    key: "parseArrayLike",
    value: function parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
      if (isTuple) {
        this.expectPlugin("recordAndTuple");
      }

      var oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
      this.state.inFSharpPipelineDirectBody = false;
      var node = this.startNode();
      this.next();
      node.elements = this.parseExprList(close,
      /* allowEmpty */
      !isTuple, refExpressionErrors, node);
      this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
      return this.finishNode(node, isTuple ? "TupleExpression" : "ArrayExpression");
    } // Parse arrow function expression.
    // If the parameters are provided, they will be converted to an
    // assignable list.

  }, {
    key: "parseArrowExpression",
    value: function parseArrowExpression(node, params, isAsync, trailingCommaPos) {
      this.scope.enter(_scopeflags.SCOPE_FUNCTION | _scopeflags.SCOPE_ARROW);
      var flags = (0, _productionParameter.functionFlags)(isAsync, false); // ConciseBody and AsyncConciseBody inherit [In]

      if (!this.match(_types.types.bracketL) && this.prodParam.hasIn) {
        flags |= _productionParameter.PARAM_IN;
      }

      this.prodParam.enter(flags);
      this.initFunction(node, isAsync);
      var oldMaybeInArrowParameters = this.state.maybeInArrowParameters;

      if (params) {
        this.state.maybeInArrowParameters = true;
        this.setArrowFunctionParameters(node, params, trailingCommaPos);
      }

      this.state.maybeInArrowParameters = false;
      this.parseFunctionBody(node, true);
      this.prodParam.exit();
      this.scope.exit();
      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
      return this.finishNode(node, "ArrowFunctionExpression");
    }
  }, {
    key: "setArrowFunctionParameters",
    value: function setArrowFunctionParameters(node, params, trailingCommaPos) {
      node.params = this.toAssignableList(params, trailingCommaPos, false);
    }
  }, {
    key: "parseFunctionBodyAndFinish",
    value: function parseFunctionBodyAndFinish(node, type) {
      var isMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // $FlowIgnore (node is not bodiless if we get here)
      this.parseFunctionBody(node, false, isMethod);
      this.finishNode(node, type);
    } // Parse function body and check parameters.

  }, {
    key: "parseFunctionBody",
    value: function parseFunctionBody(node, allowExpression) {
      var _this5 = this;

      var isMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var isExpression = allowExpression && !this.match(_types.types.braceL);
      this.expressionScope.enter((0, _expressionScope.newExpressionScope)());

      if (isExpression) {
        // https://tc39.es/ecma262/#prod-ExpressionBody
        node.body = this.parseMaybeAssign();
        this.checkParams(node, false, allowExpression, false);
      } else {
        var oldStrict = this.state.strict; // Start a new scope with regard to labels
        // flag (restore them to their old value afterwards).

        var oldLabels = this.state.labels;
        this.state.labels = []; // FunctionBody[Yield, Await]:
        //   StatementList[?Yield, ?Await, +Return] opt

        this.prodParam.enter(this.prodParam.currentFlags() | _productionParameter.PARAM_RETURN);
        node.body = this.parseBlock(true, false, // Strict mode function checks after we parse the statements in the function body.
        function (hasStrictModeDirective) {
          var nonSimple = !_this5.isSimpleParamList(node.params);

          if (hasStrictModeDirective && nonSimple) {
            // This logic is here to align the error location with the ESTree plugin.
            var errorPos = // $FlowIgnore
            (node.kind === "method" || node.kind === "constructor") && // $FlowIgnore
            !!node.key ? node.key.end : node.start;

            _this5.raise(errorPos, _error.Errors.IllegalLanguageModeDirective);
          }

          var strictModeChanged = !oldStrict && _this5.state.strict; // Add the params to varDeclaredNames to ensure that an error is thrown
          // if a let/const declaration in the function clashes with one of the params.

          _this5.checkParams(node, !_this5.state.strict && !allowExpression && !isMethod && !nonSimple, allowExpression, strictModeChanged); // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'


          if (_this5.state.strict && node.id) {
            _this5.checkLVal(node.id, "function name", _scopeflags.BIND_OUTSIDE, undefined, undefined, strictModeChanged);
          }
        });
        this.prodParam.exit();
        this.expressionScope.exit();
        this.state.labels = oldLabels;
      }
    }
  }, {
    key: "isSimpleParamList",
    value: function isSimpleParamList(params) {
      for (var i = 0, len = params.length; i < len; i++) {
        if (params[i].type !== "Identifier") return false;
      }

      return true;
    }
  }, {
    key: "checkParams",
    value: function checkParams(node, allowDuplicates, // eslint-disable-next-line no-unused-vars
    isArrowFunction) {
      var strictModeChanged = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var checkClashes = new Set();

      var _iterator2 = _createForOfIteratorHelper(node.params),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var param = _step2.value;
          this.checkLVal(param, "function parameter list", _scopeflags.BIND_VAR, allowDuplicates ? null : checkClashes, undefined, strictModeChanged);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } // Parses a comma-separated list of expressions, and returns them as
    // an array. `close` is the token type that ends the list, and
    // `allowEmpty` can be turned on to allow subsequent commas with
    // nothing in between them to be parsed as `null` (which is needed
    // for array literals).

  }, {
    key: "parseExprList",
    value: function parseExprList(close, allowEmpty, refExpressionErrors, nodeForExtra) {
      var elts = [];
      var first = true;

      while (!this.eat(close)) {
        if (first) {
          first = false;
        } else {
          this.expect(_types.types.comma);

          if (this.match(close)) {
            if (nodeForExtra) {
              this.addExtra(nodeForExtra, "trailingComma", this.state.lastTokStart);
            }

            this.next();
            break;
          }
        }

        elts.push(this.parseExprListItem(allowEmpty, refExpressionErrors));
      }

      return elts;
    }
  }, {
    key: "parseExprListItem",
    value: function parseExprListItem(allowEmpty, refExpressionErrors, allowPlaceholder) {
      var elt;

      if (this.match(_types.types.comma)) {
        if (!allowEmpty) {
          this.raise(this.state.pos, _error.Errors.UnexpectedToken, ",");
        }

        elt = null;
      } else if (this.match(_types.types.ellipsis)) {
        var spreadNodeStartPos = this.state.start;
        var spreadNodeStartLoc = this.state.startLoc;
        elt = this.parseParenItem(this.parseSpread(refExpressionErrors), spreadNodeStartPos, spreadNodeStartLoc);
      } else if (this.match(_types.types.question)) {
        this.expectPlugin("partialApplication");

        if (!allowPlaceholder) {
          this.raise(this.state.start, _error.Errors.UnexpectedArgumentPlaceholder);
        }

        var node = this.startNode();
        this.next();
        elt = this.finishNode(node, "ArgumentPlaceholder");
      } else {
        elt = this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem);
      }

      return elt;
    } // Parse the next token as an identifier. If `liberal` is true (used
    // when parsing properties), it will also convert keywords into
    // identifiers.
    // This shouldn't be used to parse the keywords of meta properties, since they
    // are not identifiers and cannot contain escape sequences.

  }, {
    key: "parseIdentifier",
    value: function parseIdentifier(liberal) {
      var node = this.startNode();
      var name = this.parseIdentifierName(node.start, liberal);
      return this.createIdentifier(node, name);
    }
  }, {
    key: "createIdentifier",
    value: function createIdentifier(node, name) {
      node.name = name;
      node.loc.identifierName = name;
      return this.finishNode(node, "Identifier");
    }
  }, {
    key: "parseIdentifierName",
    value: function parseIdentifierName(pos, liberal) {
      var name;
      var _this$state = this.state,
          start = _this$state.start,
          type = _this$state.type;

      if (type === _types.types.name) {
        name = this.state.value;
      } else if (type.keyword) {
        name = type.keyword;
      } else {
        throw this.unexpected();
      }

      if (liberal) {
        // If the current token is not used as a keyword, set its type to "tt.name".
        // This will prevent this.next() from throwing about unexpected escapes.
        this.state.type = _types.types.name;
      } else {
        this.checkReservedWord(name, start, !!type.keyword, false);
      }

      this.next();
      return name;
    }
  }, {
    key: "checkReservedWord",
    value: function checkReservedWord(word, startLoc, checkKeywords, isBinding) {
      // Every JavaScript reserved word is 10 characters or less.
      if (word.length > 10) {
        return;
      } // Most identifiers are not reservedWord-like, they don't need special
      // treatments afterward, which very likely ends up throwing errors


      if (!(0, _identifier.canBeReservedWord)(word)) {
        return;
      }

      if (word === "yield") {
        if (this.prodParam.hasYield) {
          this.raise(startLoc, _error.Errors.YieldBindingIdentifier);
          return;
        }
      } else if (word === "await") {
        if (this.prodParam.hasAwait) {
          this.raise(startLoc, _error.Errors.AwaitBindingIdentifier);
          return;
        } else if (this.scope.inStaticBlock && !this.scope.inNonArrowFunction) {
          this.raise(startLoc, _error.Errors.AwaitBindingIdentifierInStaticBlock);
          return;
        } else {
          this.expressionScope.recordAsyncArrowParametersError(startLoc, _error.Errors.AwaitBindingIdentifier);
        }
      } else if (word === "arguments") {
        if (this.scope.inClassAndNotInNonArrowFunction) {
          this.raise(startLoc, _error.Errors.ArgumentsInClass);
          return;
        }
      }

      if (checkKeywords && (0, _identifier.isKeyword)(word)) {
        this.raise(startLoc, _error.Errors.UnexpectedKeyword, word);
        return;
      }

      var reservedTest = !this.state.strict ? _identifier.isReservedWord : isBinding ? _identifier.isStrictBindReservedWord : _identifier.isStrictReservedWord;

      if (reservedTest(word, this.inModule)) {
        this.raise(startLoc, _error.Errors.UnexpectedReservedWord, word);
      }
    }
  }, {
    key: "isAwaitAllowed",
    value: function isAwaitAllowed() {
      if (this.prodParam.hasAwait) return true;

      if (this.options.allowAwaitOutsideFunction && !this.scope.inFunction) {
        return true;
      }

      return false;
    } // Parses await expression inside async function.

  }, {
    key: "parseAwait",
    value: function parseAwait(startPos, startLoc) {
      var node = this.startNodeAt(startPos, startLoc);
      this.expressionScope.recordParameterInitializerError(node.start, _error.Errors.AwaitExpressionFormalParameter);

      if (this.eat(_types.types.star)) {
        this.raise(node.start, _error.Errors.ObsoleteAwaitStar);
      }

      if (!this.scope.inFunction && !this.options.allowAwaitOutsideFunction) {
        if (this.isAmbiguousAwait()) {
          this.ambiguousScriptDifferentAst = true;
        } else {
          this.sawUnambiguousESM = true;
        }
      }

      if (!this.state.soloAwait) {
        node.argument = this.parseMaybeUnary(null, true);
      }

      return this.finishNode(node, "AwaitExpression");
    }
  }, {
    key: "isAmbiguousAwait",
    value: function isAmbiguousAwait() {
      return this.hasPrecedingLineBreak() || // All the following expressions are ambiguous:
      //   await + 0, await - 0, await ( 0 ), await [ 0 ], await / 0 /u, await ``
      this.match(_types.types.plusMin) || this.match(_types.types.parenL) || this.match(_types.types.bracketL) || this.match(_types.types.backQuote) || // Sometimes the tokenizer generates tt.slash for regexps, and this is
      // handler by parseExprAtom
      this.match(_types.types.regexp) || this.match(_types.types.slash) || // This code could be parsed both as a modulo operator or as an intrinsic:
      //   await %x(0)
      this.hasPlugin("v8intrinsic") && this.match(_types.types.modulo);
    } // Parses yield expression inside generator.

  }, {
    key: "parseYield",
    value: function parseYield() {
      var node = this.startNode();
      this.expressionScope.recordParameterInitializerError(node.start, _error.Errors.YieldInParameter);
      this.next();
      var delegating = false;
      var argument = null;

      if (!this.hasPrecedingLineBreak()) {
        delegating = this.eat(_types.types.star);

        switch (this.state.type) {
          case _types.types.semi:
          case _types.types.eof:
          case _types.types.braceR:
          case _types.types.parenR:
          case _types.types.bracketR:
          case _types.types.braceBarR:
          case _types.types.colon:
          case _types.types.comma:
            // The above is the complete set of tokens that can
            // follow an AssignmentExpression, and none of them
            // can start an AssignmentExpression
            if (!delegating) break;

          /* fallthrough */

          default:
            argument = this.parseMaybeAssign();
        }
      }

      node.delegate = delegating;
      node.argument = argument;
      return this.finishNode(node, "YieldExpression");
    } // Validates a pipeline (for any of the pipeline Babylon plugins) at the point
    // of the infix operator `|>`.

  }, {
    key: "checkPipelineAtInfixOperator",
    value: function checkPipelineAtInfixOperator(left, leftStartPos) {
      if (this.getPluginOption("pipelineOperator", "proposal") === "smart") {
        if (left.type === "SequenceExpression") {
          // Ensure that the pipeline head is not a comma-delimited
          // sequence expression.
          this.raise(leftStartPos, _error.Errors.PipelineHeadSequenceExpression);
        }
      }
    }
  }, {
    key: "parseSmartPipelineBody",
    value: function parseSmartPipelineBody(childExpression, startPos, startLoc) {
      this.checkSmartPipelineBodyEarlyErrors(childExpression, startPos);
      return this.parseSmartPipelineBodyInStyle(childExpression, startPos, startLoc);
    }
  }, {
    key: "checkSmartPipelineBodyEarlyErrors",
    value: function checkSmartPipelineBodyEarlyErrors(childExpression, startPos) {
      if (this.match(_types.types.arrow)) {
        // If the following token is invalidly `=>`, then throw a human-friendly error
        // instead of something like 'Unexpected token, expected ";"'.
        throw this.raise(this.state.start, _error.Errors.PipelineBodyNoArrow);
      } else if (childExpression.type === "SequenceExpression") {
        this.raise(startPos, _error.Errors.PipelineBodySequenceExpression);
      }
    }
  }, {
    key: "parseSmartPipelineBodyInStyle",
    value: function parseSmartPipelineBodyInStyle(childExpression, startPos, startLoc) {
      var bodyNode = this.startNodeAt(startPos, startLoc);
      var isSimpleReference = this.isSimpleReference(childExpression);

      if (isSimpleReference) {
        bodyNode.callee = childExpression;
      } else {
        if (!this.topicReferenceWasUsedInCurrentTopicContext()) {
          this.raise(startPos, _error.Errors.PipelineTopicUnused);
        }

        bodyNode.expression = childExpression;
      }

      return this.finishNode(bodyNode, isSimpleReference ? "PipelineBareFunction" : "PipelineTopicExpression");
    }
  }, {
    key: "isSimpleReference",
    value: function isSimpleReference(expression) {
      switch (expression.type) {
        case "MemberExpression":
          return !expression.computed && this.isSimpleReference(expression.object);

        case "Identifier":
          return true;

        default:
          return false;
      }
    } // Enable topic references from outer contexts within smart pipeline bodies.
    // The function modifies the parser's topic-context state to enable or disable
    // the use of topic references with the smartPipelines plugin. They then run a
    // callback, then they reset the parser to the old topic-context state that it
    // had before the function was called.

  }, {
    key: "withTopicPermittingContext",
    value: function withTopicPermittingContext(callback) {
      var outerContextTopicState = this.state.topicContext;
      this.state.topicContext = {
        // Enable the use of the primary topic reference.
        maxNumOfResolvableTopics: 1,
        // Hide the use of any topic references from outer contexts.
        maxTopicIndex: null
      };

      try {
        return callback();
      } finally {
        this.state.topicContext = outerContextTopicState;
      }
    } // Disable topic references from outer contexts within syntax constructs
    // such as the bodies of iteration statements.
    // The function modifies the parser's topic-context state to enable or disable
    // the use of topic references with the smartPipelines plugin. They then run a
    // callback, then they reset the parser to the old topic-context state that it
    // had before the function was called.

  }, {
    key: "withTopicForbiddingContext",
    value: function withTopicForbiddingContext(callback) {
      var outerContextTopicState = this.state.topicContext;
      this.state.topicContext = {
        // Disable the use of the primary topic reference.
        maxNumOfResolvableTopics: 0,
        // Hide the use of any topic references from outer contexts.
        maxTopicIndex: null
      };

      try {
        return callback();
      } finally {
        this.state.topicContext = outerContextTopicState;
      }
    }
  }, {
    key: "withSoloAwaitPermittingContext",
    value: function withSoloAwaitPermittingContext(callback) {
      var outerContextSoloAwaitState = this.state.soloAwait;
      this.state.soloAwait = true;

      try {
        return callback();
      } finally {
        this.state.soloAwait = outerContextSoloAwaitState;
      }
    }
  }, {
    key: "allowInAnd",
    value: function allowInAnd(callback) {
      var flags = this.prodParam.currentFlags();
      var prodParamToSet = _productionParameter.PARAM_IN & ~flags;

      if (prodParamToSet) {
        this.prodParam.enter(flags | _productionParameter.PARAM_IN);

        try {
          return callback();
        } finally {
          this.prodParam.exit();
        }
      }

      return callback();
    }
  }, {
    key: "disallowInAnd",
    value: function disallowInAnd(callback) {
      var flags = this.prodParam.currentFlags();
      var prodParamToClear = _productionParameter.PARAM_IN & flags;

      if (prodParamToClear) {
        this.prodParam.enter(flags & ~_productionParameter.PARAM_IN);

        try {
          return callback();
        } finally {
          this.prodParam.exit();
        }
      }

      return callback();
    } // Register the use of a primary topic reference (`#`) within the current
    // topic context.

  }, {
    key: "registerTopicReference",
    value: function registerTopicReference() {
      this.state.topicContext.maxTopicIndex = 0;
    }
  }, {
    key: "primaryTopicReferenceIsAllowedInCurrentTopicContext",
    value: function primaryTopicReferenceIsAllowedInCurrentTopicContext() {
      return this.state.topicContext.maxNumOfResolvableTopics >= 1;
    }
  }, {
    key: "topicReferenceWasUsedInCurrentTopicContext",
    value: function topicReferenceWasUsedInCurrentTopicContext() {
      return this.state.topicContext.maxTopicIndex != null && this.state.topicContext.maxTopicIndex >= 0;
    }
  }, {
    key: "parseFSharpPipelineBody",
    value: function parseFSharpPipelineBody(prec) {
      var startPos = this.state.start;
      var startLoc = this.state.startLoc;
      this.state.potentialArrowAt = this.state.start;
      var oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
      this.state.inFSharpPipelineDirectBody = true;
      var ret = this.parseExprOp(this.parseMaybeUnary(), startPos, startLoc, prec);
      this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
      return ret;
    } // https://github.com/tc39/proposal-js-module-blocks

  }, {
    key: "parseModuleExpression",
    value: function parseModuleExpression() {
      this.expectPlugin("moduleBlocks");
      var node = this.startNode();
      this.next(); // eat "module"

      this.eat(_types.types.braceL);
      var revertScopes = this.initializeScopes(
      /** inModule */
      true);
      this.enterInitialScopes();
      var program = this.startNode();

      try {
        node.body = this.parseProgram(program, _types.types.braceR, "module");
      } finally {
        revertScopes();
      }

      this.eat(_types.types.braceR);
      return this.finishNode(node, "ModuleExpression");
    }
  }]);

  return ExpressionParser;
}(_lval["default"]);

exports["default"] = ExpressionParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvZXhwcmVzc2lvbi5qcyJdLCJuYW1lcyI6WyJFeHByZXNzaW9uUGFyc2VyIiwicHJvcCIsImlzUmVjb3JkIiwicHJvdG9SZWYiLCJyZWZFeHByZXNzaW9uRXJyb3JzIiwidHlwZSIsImlzT2JqZWN0TWV0aG9kIiwiY29tcHV0ZWQiLCJzaG9ydGhhbmQiLCJrZXkiLCJuYW1lIiwidmFsdWUiLCJyYWlzZSIsInN0YXJ0IiwiRXJyb3JzIiwiUmVjb3JkTm9Qcm90byIsInVzZWQiLCJkb3VibGVQcm90byIsIkR1cGxpY2F0ZVByb3RvIiwiZXhwciIsInBvdGVudGlhbEFycm93QXQiLCJwYXJhbUZsYWdzIiwiUEFSQU0iLCJoYXNQbHVnaW4iLCJpbk1vZHVsZSIsIlBBUkFNX0FXQUlUIiwic2NvcGUiLCJlbnRlciIsIlNDT1BFX1BST0dSQU0iLCJwcm9kUGFyYW0iLCJuZXh0VG9rZW4iLCJwYXJzZUV4cHJlc3Npb24iLCJtYXRjaCIsInR0IiwiZW9mIiwidW5leHBlY3RlZCIsImNvbW1lbnRzIiwic3RhdGUiLCJlcnJvcnMiLCJvcHRpb25zIiwidG9rZW5zIiwiZGlzYWxsb3dJbiIsImRpc2FsbG93SW5BbmQiLCJwYXJzZUV4cHJlc3Npb25CYXNlIiwiYWxsb3dJbkFuZCIsInN0YXJ0UG9zIiwic3RhcnRMb2MiLCJwYXJzZU1heWJlQXNzaWduIiwiY29tbWEiLCJub2RlIiwic3RhcnROb2RlQXQiLCJleHByZXNzaW9ucyIsImVhdCIsInB1c2giLCJ0b1JlZmVyZW5jZWRMaXN0IiwiZmluaXNoTm9kZSIsImFmdGVyTGVmdFBhcnNlIiwicmVzdWx0RXJyb3IiLCJvcHRpb25hbFBhcmFtZXRlcnMiLCJwb3MiLCJpc0NvbnRleHR1YWwiLCJoYXNZaWVsZCIsImxlZnQiLCJwYXJzZVlpZWxkIiwiY2FsbCIsIm93bkV4cHJlc3Npb25FcnJvcnMiLCJFeHByZXNzaW9uRXJyb3JzIiwicGFyZW5MIiwicGFyc2VNYXliZUNvbmRpdGlvbmFsIiwiaXNBc3NpZ24iLCJvcGVyYXRvciIsImVxIiwidG9Bc3NpZ25hYmxlIiwic2hvcnRoYW5kQXNzaWduIiwiY2hlY2tMVmFsIiwibmV4dCIsInJpZ2h0IiwiY2hlY2tFeHByZXNzaW9uRXJyb3JzIiwicGFyc2VFeHByT3BzIiwic2hvdWxkRXhpdERlc2NlbmRpbmciLCJwYXJzZUNvbmRpdGlvbmFsIiwicXVlc3Rpb24iLCJ0ZXN0IiwiY29uc2VxdWVudCIsInBhcnNlTWF5YmVBc3NpZ25BbGxvd0luIiwiZXhwZWN0IiwiY29sb24iLCJhbHRlcm5hdGUiLCJwYXJzZU1heWJlVW5hcnkiLCJwYXJzZUV4cHJPcCIsImxlZnRTdGFydFBvcyIsImxlZnRTdGFydExvYyIsIm1pblByZWMiLCJwcmVjIiwiYmlub3AiLCJoYXNJbiIsIl9pbiIsIm9wIiwicGlwZWxpbmUiLCJleHBlY3RQbHVnaW4iLCJpbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keSIsImluUGlwZWxpbmUiLCJjaGVja1BpcGVsaW5lQXRJbmZpeE9wZXJhdG9yIiwibG9naWNhbCIsImxvZ2ljYWxPUiIsImxvZ2ljYWxBTkQiLCJjb2FsZXNjZSIsIm51bGxpc2hDb2FsZXNjaW5nIiwiZ2V0UGx1Z2luT3B0aW9uIiwiaGFzQXdhaXQiLCJVbmV4cGVjdGVkQXdhaXRBZnRlclBpcGVsaW5lQm9keSIsInBhcnNlRXhwck9wUmlnaHRFeHByIiwibmV4dE9wIiwiTWl4aW5nQ29hbGVzY2VXaXRoTG9naWNhbCIsIndpdGhUb3BpY1Blcm1pdHRpbmdDb250ZXh0IiwicGFyc2VTbWFydFBpcGVsaW5lQm9keSIsInBhcnNlRXhwck9wQmFzZVJpZ2h0RXhwciIsIndpdGhTb2xvQXdhaXRQZXJtaXR0aW5nQ29udGV4dCIsInBhcnNlRlNoYXJwUGlwZWxpbmVCb2R5IiwicmlnaHRBc3NvY2lhdGl2ZSIsImV4cG9uZW50IiwiYXJndW1lbnQiLCJVbmV4cGVjdGVkVG9rZW5VbmFyeUV4cG9uZW50aWF0aW9uIiwic2F3VW5hcnkiLCJpc0F3YWl0IiwiaXNBd2FpdEFsbG93ZWQiLCJwYXJzZUF3YWl0IiwiY2hlY2tFeHBvbmVudGlhbEFmdGVyVW5hcnkiLCJsb29rYWhlYWRDaGFyQ29kZSIsImNoYXJDb2RlcyIsImxlZnRDdXJseUJyYWNlIiwiaGFzRm9sbG93aW5nTGluZUJyZWFrIiwicGFyc2VNb2R1bGVFeHByZXNzaW9uIiwidXBkYXRlIiwiaW5jRGVjIiwic3RhcnROb2RlIiwicHJlZml4IiwiX3Rocm93IiwiaXNEZWxldGUiLCJfZGVsZXRlIiwic3RyaWN0IiwiYXJnIiwiU3RyaWN0RGVsZXRlIiwiaGFzUHJvcGVydHlBc1ByaXZhdGVOYW1lIiwiRGVsZXRlUHJpdmF0ZUZpZWxkIiwicGFyc2VVcGRhdGUiLCJzdGFydHNFeHByIiwibW9kdWxvIiwiaXNBbWJpZ3VvdXNBd2FpdCIsInJhaXNlT3ZlcndyaXRlIiwiQXdhaXROb3RJbkFzeW5jQ29udGV4dCIsIkF3YWl0Tm90SW5Bc3luY0Z1bmN0aW9uIiwicGFyc2VFeHByU3Vic2NyaXB0cyIsInBvc3RmaXgiLCJjYW5JbnNlcnRTZW1pY29sb24iLCJwYXJzZUV4cHJBdG9tIiwicGFyc2VTdWJzY3JpcHRzIiwiYmFzZSIsIm5vQ2FsbHMiLCJvcHRpb25hbENoYWluTWVtYmVyIiwibWF5YmVBc3luY0Fycm93IiwiYXRQb3NzaWJsZUFzeW5jQXJyb3ciLCJzdG9wIiwicGFyc2VTdWJzY3JpcHQiLCJkb3VibGVDb2xvbiIsInBhcnNlQmluZCIsImJhY2tRdW90ZSIsInBhcnNlVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uIiwib3B0aW9uYWwiLCJxdWVzdGlvbkRvdCIsImxlZnRQYXJlbnRoZXNpcyIsInBhcnNlQ292ZXJDYWxsQW5kQXN5bmNBcnJvd0hlYWQiLCJicmFja2V0TCIsImRvdCIsInBhcnNlTWVtYmVyIiwib2JqZWN0IiwicHJpdmF0ZU5hbWUiLCJwcm9wZXJ0eSIsInBhcnNlUHJpdmF0ZU5hbWUiLCJwYXJzZUlkZW50aWZpZXIiLCJTdXBlclByaXZhdGVGaWVsZCIsImNsYXNzU2NvcGUiLCJ1c2VQcml2YXRlTmFtZSIsImJyYWNrZXRSIiwiY2FsbGVlIiwicGFyc2VOb0NhbGxFeHByIiwib2xkTWF5YmVJbkFycm93UGFyYW1ldGVycyIsIm1heWJlSW5BcnJvd1BhcmFtZXRlcnMiLCJleHByZXNzaW9uU2NvcGUiLCJhcmd1bWVudHMiLCJwYXJzZUNhbGxFeHByZXNzaW9uQXJndW1lbnRzIiwicGFyZW5SIiwiZmluaXNoQ2FsbEV4cHJlc3Npb24iLCJzaG91bGRQYXJzZUFzeW5jQXJyb3ciLCJ2YWxpZGF0ZUFzUGF0dGVybiIsImV4aXQiLCJwYXJzZUFzeW5jQXJyb3dGcm9tQ2FsbEV4cHJlc3Npb24iLCJ0b1JlZmVyZW5jZWRBcmd1bWVudHMiLCJpc1BhcmVudGhlc2l6ZWRFeHByIiwidG9SZWZlcmVuY2VkTGlzdERlZXAiLCJ0YWciLCJxdWFzaSIsInBhcnNlVGVtcGxhdGUiLCJPcHRpb25hbENoYWluaW5nTm9UZW1wbGF0ZSIsImxhc3RUb2tFbmQiLCJlbmQiLCJsZW5ndGgiLCJwcm9jZXNzIiwiZW52IiwiQkFCRUxfOF9CUkVBS0lORyIsIkltcG9ydENhbGxBcml0eSIsIkltcG9ydENhbGxTcHJlYWRBcmd1bWVudCIsImNsb3NlIiwiZHluYW1pY0ltcG9ydCIsImFsbG93UGxhY2Vob2xkZXIiLCJub2RlRm9yRXh0cmEiLCJlbHRzIiwiZmlyc3QiLCJvbGRJbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keSIsImxhc3RUb2tTdGFydCIsIkltcG9ydENhbGxBcmd1bWVudFRyYWlsaW5nQ29tbWEiLCJhZGRFeHRyYSIsInBhcnNlRXhwckxpc3RJdGVtIiwiYXJyb3ciLCJwYXJzZUFycm93RXhwcmVzc2lvbiIsImV4dHJhIiwidHJhaWxpbmdDb21tYSIsIl9zdXBlciIsInBhcnNlU3VwZXIiLCJfaW1wb3J0IiwicGFyc2VJbXBvcnRNZXRhUHJvcGVydHkiLCJVbnN1cHBvcnRlZEltcG9ydCIsIl90aGlzIiwiY2FuQmVBcnJvdyIsImNvbnRhaW5zRXNjIiwiaWQiLCJfZnVuY3Rpb24iLCJwYXJzZUZ1bmN0aW9uIiwic3RhcnROb2RlQXROb2RlIiwidW5kZWZpbmVkIiwiZXF1YWxzVG8iLCJwYXJzZUFzeW5jQXJyb3dVbmFyeUZ1bmN0aW9uIiwiX2RvIiwicGFyc2VEbyIsInNsYXNoIiwic2xhc2hBc3NpZ24iLCJyZWFkUmVnZXhwIiwicGFyc2VSZWdFeHBMaXRlcmFsIiwibnVtIiwicGFyc2VOdW1lcmljTGl0ZXJhbCIsImJpZ2ludCIsInBhcnNlQmlnSW50TGl0ZXJhbCIsImRlY2ltYWwiLCJwYXJzZURlY2ltYWxMaXRlcmFsIiwic3RyaW5nIiwicGFyc2VTdHJpbmdMaXRlcmFsIiwiX251bGwiLCJwYXJzZU51bGxMaXRlcmFsIiwiX3RydWUiLCJwYXJzZUJvb2xlYW5MaXRlcmFsIiwiX2ZhbHNlIiwicGFyc2VQYXJlbkFuZERpc3Rpbmd1aXNoRXhwcmVzc2lvbiIsImJyYWNrZXRCYXJMIiwiYnJhY2tldEhhc2hMIiwicGFyc2VBcnJheUxpa2UiLCJicmFja2V0QmFyUiIsImJyYWNlQmFyTCIsImJyYWNlSGFzaEwiLCJwYXJzZU9iamVjdExpa2UiLCJicmFjZUJhclIiLCJicmFjZVIiLCJicmFjZUwiLCJwYXJzZUZ1bmN0aW9uT3JGdW5jdGlvblNlbnQiLCJhdCIsInBhcnNlRGVjb3JhdG9ycyIsIl9jbGFzcyIsInRha2VEZWNvcmF0b3JzIiwicGFyc2VDbGFzcyIsIl9uZXciLCJwYXJzZU5ld09yTmV3VGFyZ2V0IiwiVW5zdXBwb3J0ZWRCaW5kIiwiUHJpdmF0ZUluRXhwZWN0ZWRJbiIsImhhc2giLCJQcmltYXJ5VG9waWNSZXF1aXJlc1NtYXJ0UGlwZWxpbmUiLCJwcmltYXJ5VG9waWNSZWZlcmVuY2VJc0FsbG93ZWRJbkN1cnJlbnRUb3BpY0NvbnRleHQiLCJQcmltYXJ5VG9waWNOb3RBbGxvd2VkIiwicmVnaXN0ZXJUb3BpY1JlZmVyZW5jZSIsInJlbGF0aW9uYWwiLCJsb29rYWhlYWRDaCIsImlucHV0IiwiY29kZVBvaW50QXQiLCJuZXh0VG9rZW5TdGFydCIsImdyZWF0ZXJUaGFuIiwiZXhwZWN0T25lUGx1Z2luIiwicGFyYW1zIiwiaGFzUHJlY2VkaW5nTGluZUJyZWFrIiwiTGluZVRlcm1pbmF0b3JCZWZvcmVBcnJvdyIsImlzQXN5bmMiLCJhc3luYyIsIm9sZExhYmVscyIsImxhYmVscyIsImJvZHkiLCJwYXJzZUJsb2NrIiwiYWxsb3dEaXJlY3RTdXBlciIsImFsbG93U3VwZXJPdXRzaWRlTWV0aG9kIiwiU3VwZXJOb3RBbGxvd2VkIiwiYWxsb3dTdXBlciIsIlVuZXhwZWN0ZWRTdXBlciIsIlVuc3VwcG9ydGVkU3VwZXIiLCJpc1ByaXZhdGVOYW1lQWxsb3dlZCIsImlzUHJpdmF0ZSIsIlVuZXhwZWN0ZWRQcml2YXRlRmllbGQiLCJQb3NpdGlvbiIsImN1ckxpbmUiLCJsaW5lU3RhcnQiLCJjcmVhdGVJZGVudGlmaWVyIiwibWV0YSIsInBhcnNlTWV0YVByb3BlcnR5IiwicHJvcGVydHlOYW1lIiwiVW5zdXBwb3J0ZWRNZXRhUHJvcGVydHkiLCJTb3VyY2VUeXBlTW9kdWxlRXJyb3JzIiwiSW1wb3J0TWV0YU91dHNpZGVNb2R1bGUiLCJzYXdVbmFtYmlndW91c0VTTSIsInNsaWNlIiwicGFyc2VMaXRlcmFsQXROb2RlIiwicGFyc2VMaXRlcmFsIiwicGF0dGVybiIsImZsYWdzIiwidmFsIiwiaW5uZXJTdGFydFBvcyIsImlubmVyU3RhcnRMb2MiLCJleHByTGlzdCIsInNwcmVhZFN0YXJ0Iiwib3B0aW9uYWxDb21tYVN0YXJ0IiwiZWxsaXBzaXMiLCJzcHJlYWROb2RlU3RhcnRQb3MiLCJzcHJlYWROb2RlU3RhcnRMb2MiLCJwYXJzZVBhcmVuSXRlbSIsInBhcnNlUmVzdEJpbmRpbmciLCJjaGVja0NvbW1hQWZ0ZXJSZXN0IiwicmlnaHRQYXJlbnRoZXNpcyIsImlubmVyRW5kUG9zIiwiaW5uZXJFbmRMb2MiLCJsYXN0VG9rRW5kTG9jIiwiYXJyb3dOb2RlIiwic2hvdWxkUGFyc2VBcnJvdyIsInBhcnNlQXJyb3ciLCJmaW5pc2hOb2RlQXQiLCJjcmVhdGVQYXJlbnRoZXNpemVkRXhwcmVzc2lvbnMiLCJwYXJlbkV4cHJlc3Npb24iLCJleHByZXNzaW9uIiwibWV0YVByb3AiLCJpbk5vbkFycm93RnVuY3Rpb24iLCJpbkNsYXNzIiwiVW5leHBlY3RlZE5ld1RhcmdldCIsInBhcnNlTmV3IiwiSW1wb3J0Q2FsbE5vdE5ld0V4cHJlc3Npb24iLCJpc09wdGlvbmFsQ2hhaW4iLCJPcHRpb25hbENoYWluaW5nTm9OZXciLCJwYXJzZU5ld0FyZ3VtZW50cyIsImFyZ3MiLCJwYXJzZUV4cHJMaXN0IiwiaXNUYWdnZWQiLCJlbGVtIiwiSW52YWxpZEVzY2FwZVNlcXVlbmNlVGVtcGxhdGUiLCJyYXciLCJyZXBsYWNlIiwiY29va2VkIiwidGFpbCIsImN1ckVsdCIsInBhcnNlVGVtcGxhdGVFbGVtZW50IiwicXVhc2lzIiwiZG9sbGFyQnJhY2VMIiwicGFyc2VUZW1wbGF0ZVN1YnN0aXR1dGlvbiIsImlzUGF0dGVybiIsInByb3BIYXNoIiwiT2JqZWN0IiwiY3JlYXRlIiwicHJvcGVydGllcyIsInBhcnNlUHJvcGVydHlEZWZpbml0aW9uIiwiY2hlY2tQcm90byIsImlzT2JqZWN0UHJvcGVydHkiLCJJbnZhbGlkUmVjb3JkUHJvcGVydHkiLCJpc0xpdGVyYWxQcm9wZXJ0eU5hbWUiLCJzdGFyIiwiZGVjb3JhdG9ycyIsIlVuc3VwcG9ydGVkUHJvcGVydHlEZWNvcmF0b3IiLCJwYXJzZURlY29yYXRvciIsImlzR2VuZXJhdG9yIiwiaXNBY2Nlc3NvciIsInJpZ2h0Q3VybHlCcmFjZSIsInBhcnNlU3ByZWFkIiwibWV0aG9kIiwicGFyc2VQcm9wZXJ0eU5hbWUiLCJtYXliZUFzeW5jT3JBY2Nlc3NvclByb3AiLCJrZXlOYW1lIiwia2luZCIsIkFjY2Vzc29ySXNHZW5lcmF0b3IiLCJwYXJzZU9ialByb3BWYWx1ZSIsInBhcmFtQ291bnQiLCJnZXRHZXR0ZXJTZXR0ZXJFeHBlY3RlZFBhcmFtQ291bnQiLCJnZXRPYmplY3RPckNsYXNzTWV0aG9kUGFyYW1zIiwiQmFkR2V0dGVyQXJpdHkiLCJCYWRTZXR0ZXJBcml0eSIsIkJhZFNldHRlclJlc3RQYXJhbWV0ZXIiLCJwYXJzZU1ldGhvZCIsImNoZWNrR2V0dGVyU2V0dGVyUGFyYW1zIiwicGFyc2VNYXliZURlZmF1bHQiLCJjaGVja1Jlc2VydmVkV29yZCIsIl9fY2xvbmUiLCJwYXJzZU9iamVjdE1ldGhvZCIsInBhcnNlT2JqZWN0UHJvcGVydHkiLCJvbGRJblByb3BlcnR5TmFtZSIsImluUHJvcGVydHlOYW1lIiwicGFyc2VNYXliZVByaXZhdGVOYW1lIiwiZ2VuZXJhdG9yIiwiaXNDb25zdHJ1Y3RvciIsImluQ2xhc3NTY29wZSIsImluaXRGdW5jdGlvbiIsImFsbG93TW9kaWZpZXJzIiwiU0NPUEVfRlVOQ1RJT04iLCJTQ09QRV9TVVBFUiIsIlNDT1BFX0NMQVNTIiwiU0NPUEVfRElSRUNUX1NVUEVSIiwicGFyc2VGdW5jdGlvblBhcmFtcyIsInBhcnNlRnVuY3Rpb25Cb2R5QW5kRmluaXNoIiwiY2FuQmVQYXR0ZXJuIiwiaXNUdXBsZSIsImVsZW1lbnRzIiwidHJhaWxpbmdDb21tYVBvcyIsIlNDT1BFX0FSUk9XIiwiUEFSQU1fSU4iLCJzZXRBcnJvd0Z1bmN0aW9uUGFyYW1ldGVycyIsInBhcnNlRnVuY3Rpb25Cb2R5IiwidG9Bc3NpZ25hYmxlTGlzdCIsImlzTWV0aG9kIiwiYWxsb3dFeHByZXNzaW9uIiwiaXNFeHByZXNzaW9uIiwiY2hlY2tQYXJhbXMiLCJvbGRTdHJpY3QiLCJjdXJyZW50RmxhZ3MiLCJQQVJBTV9SRVRVUk4iLCJoYXNTdHJpY3RNb2RlRGlyZWN0aXZlIiwibm9uU2ltcGxlIiwiaXNTaW1wbGVQYXJhbUxpc3QiLCJlcnJvclBvcyIsIklsbGVnYWxMYW5ndWFnZU1vZGVEaXJlY3RpdmUiLCJzdHJpY3RNb2RlQ2hhbmdlZCIsIkJJTkRfT1VUU0lERSIsImkiLCJsZW4iLCJhbGxvd0R1cGxpY2F0ZXMiLCJpc0Fycm93RnVuY3Rpb24iLCJjaGVja0NsYXNoZXMiLCJTZXQiLCJwYXJhbSIsIkJJTkRfVkFSIiwiYWxsb3dFbXB0eSIsImVsdCIsIlVuZXhwZWN0ZWRUb2tlbiIsIlVuZXhwZWN0ZWRBcmd1bWVudFBsYWNlaG9sZGVyIiwibGliZXJhbCIsInBhcnNlSWRlbnRpZmllck5hbWUiLCJsb2MiLCJpZGVudGlmaWVyTmFtZSIsImtleXdvcmQiLCJ3b3JkIiwiY2hlY2tLZXl3b3JkcyIsImlzQmluZGluZyIsIllpZWxkQmluZGluZ0lkZW50aWZpZXIiLCJBd2FpdEJpbmRpbmdJZGVudGlmaWVyIiwiaW5TdGF0aWNCbG9jayIsIkF3YWl0QmluZGluZ0lkZW50aWZpZXJJblN0YXRpY0Jsb2NrIiwicmVjb3JkQXN5bmNBcnJvd1BhcmFtZXRlcnNFcnJvciIsImluQ2xhc3NBbmROb3RJbk5vbkFycm93RnVuY3Rpb24iLCJBcmd1bWVudHNJbkNsYXNzIiwiVW5leHBlY3RlZEtleXdvcmQiLCJyZXNlcnZlZFRlc3QiLCJpc1Jlc2VydmVkV29yZCIsImlzU3RyaWN0QmluZFJlc2VydmVkV29yZCIsImlzU3RyaWN0UmVzZXJ2ZWRXb3JkIiwiVW5leHBlY3RlZFJlc2VydmVkV29yZCIsImFsbG93QXdhaXRPdXRzaWRlRnVuY3Rpb24iLCJpbkZ1bmN0aW9uIiwicmVjb3JkUGFyYW1ldGVySW5pdGlhbGl6ZXJFcnJvciIsIkF3YWl0RXhwcmVzc2lvbkZvcm1hbFBhcmFtZXRlciIsIk9ic29sZXRlQXdhaXRTdGFyIiwiYW1iaWd1b3VzU2NyaXB0RGlmZmVyZW50QXN0Iiwic29sb0F3YWl0IiwicGx1c01pbiIsInJlZ2V4cCIsIllpZWxkSW5QYXJhbWV0ZXIiLCJkZWxlZ2F0aW5nIiwic2VtaSIsImRlbGVnYXRlIiwiUGlwZWxpbmVIZWFkU2VxdWVuY2VFeHByZXNzaW9uIiwiY2hpbGRFeHByZXNzaW9uIiwiY2hlY2tTbWFydFBpcGVsaW5lQm9keUVhcmx5RXJyb3JzIiwicGFyc2VTbWFydFBpcGVsaW5lQm9keUluU3R5bGUiLCJQaXBlbGluZUJvZHlOb0Fycm93IiwiUGlwZWxpbmVCb2R5U2VxdWVuY2VFeHByZXNzaW9uIiwiYm9keU5vZGUiLCJpc1NpbXBsZVJlZmVyZW5jZSIsInRvcGljUmVmZXJlbmNlV2FzVXNlZEluQ3VycmVudFRvcGljQ29udGV4dCIsIlBpcGVsaW5lVG9waWNVbnVzZWQiLCJjYWxsYmFjayIsIm91dGVyQ29udGV4dFRvcGljU3RhdGUiLCJ0b3BpY0NvbnRleHQiLCJtYXhOdW1PZlJlc29sdmFibGVUb3BpY3MiLCJtYXhUb3BpY0luZGV4Iiwib3V0ZXJDb250ZXh0U29sb0F3YWl0U3RhdGUiLCJwcm9kUGFyYW1Ub1NldCIsInByb2RQYXJhbVRvQ2xlYXIiLCJyZXQiLCJyZXZlcnRTY29wZXMiLCJpbml0aWFsaXplU2NvcGVzIiwiZW50ZXJJbml0aWFsU2NvcGVzIiwicHJvZ3JhbSIsInBhcnNlUHJvZ3JhbSIsIkxWYWxQYXJzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFRQTs7QUFDQTs7QUFDQTs7QUFVQTs7QUFDQTs7QUFPQTs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBO0FBQ0E7QUFDQTtJQUVxQkEsZ0I7Ozs7Ozs7Ozs7Ozs7V0FDbkI7O0FBQ0E7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFRTtBQUNBO0FBQ0E7QUFFQTtBQUVBLHdCQUNFQyxJQURGLEVBRUVDLFFBRkYsRUFHRUMsUUFIRixFQUlFQyxtQkFKRixFQUtRO0FBQ04sVUFDRUgsSUFBSSxDQUFDSSxJQUFMLEtBQWMsZUFBZCxJQUNBLEtBQUtDLGNBQUwsQ0FBb0JMLElBQXBCLENBREEsSUFFQUEsSUFBSSxDQUFDTSxRQUZMLElBR0E7QUFDQU4sTUFBQUEsSUFBSSxDQUFDTyxTQUxQLEVBTUU7QUFDQTtBQUNEOztBQUVELFVBQU1DLEdBQUcsR0FBR1IsSUFBSSxD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RCxJQUFJLEdBQUcsS0FBS3NGLFNBQUwsRUFBYjtBQUNBLFdBQUs1RCxJQUFMLEdBSDBDLENBRzdCOztBQUNiLFdBQUt2QixHQUFMLENBQVNuQixhQUFHOE8sTUFBWjtBQUVBLFVBQU1tUCxZQUFZLEdBQUcsS0FBS0MsZ0JBQUw7QUFBc0I7QUFBZ0IsVUFBdEMsQ0FBckI7QUFDQSxXQUFLQyxrQkFBTDtBQUVBLFVBQU1DLE9BQU8sR0FBRyxLQUFLOVgsU0FBTCxFQUFoQjs7QUFDQSxVQUFJO0FBQ0Z0RixRQUFBQSxJQUFJLENBQUM0UCxJQUFMLEdBQVksS0FBS3lOLFlBQUwsQ0FBa0JELE9BQWxCLEVBQTJCcGUsYUFBRzZPLE1BQTlCLEVBQXNDLFFBQXRDLENBQVo7QUFDRCxPQUZELFNBRVU7QUFDUm9QLFFBQUFBLFlBQVk7QUFDYjs7QUFDRCxXQUFLOWMsR0FBTCxDQUFTbkIsYUFBRzZPLE1BQVo7QUFDQSxhQUFPLEtBQUt2TixVQUFMLENBQW9DTixJQUFwQyxFQUEwQyxrQkFBMUMsQ0FBUDtBQUNEOzs7O0VBcmxGMkNzZCxnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8vIEEgcmVjdXJzaXZlIGRlc2NlbnQgcGFyc2VyIG9wZXJhdGVzIGJ5IGRlZmluaW5nIGZ1bmN0aW9ucyBmb3IgYWxsXG4vLyBzeW50YWN0aWMgZWxlbWVudHMsIGFuZCByZWN1cnNpdmVseSBjYWxsaW5nIHRob3NlLCBlYWNoIGZ1bmN0aW9uXG4vLyBhZHZhbmNpbmcgdGhlIGlucHV0IHN0cmVhbSBhbmQgcmV0dXJuaW5nIGFuIEFTVCBub2RlLiBQcmVjZWRlbmNlXG4vLyBvZiBjb25zdHJ1Y3RzIChmb3IgZXhhbXBsZSwgdGhlIGZhY3QgdGhhdCBgIXhbMV1gIG1lYW5zIGAhKHhbMV0pYFxuLy8gaW5zdGVhZCBvZiBgKCF4KVsxXWAgaXMgaGFuZGxlZCBieSB0aGUgZmFjdCB0aGF0IHRoZSBwYXJzZXJcbi8vIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIHVuYXJ5IHByZWZpeCBvcGVyYXRvcnMgaXMgY2FsbGVkIGZpcnN0LCBhbmRcbi8vIGluIHR1cm4gY2FsbHMgdGhlIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIGBbXWAgc3Vic2NyaXB0cyDigJQgdGhhdFxuLy8gd2F5LCBpdCdsbCByZWNlaXZlIHRoZSBub2RlIGZvciBgeFsxXWAgYWxyZWFkeSBwYXJzZWQsIGFuZCB3cmFwc1xuLy8gKnRoYXQqIGluIHRoZSB1bmFyeSBvcGVyYXRvciBub2RlLlxuLy9cbi8vIEFjb3JuIHVzZXMgYW4gW29wZXJhdG9yIHByZWNlZGVuY2UgcGFyc2VyXVtvcHBdIHRvIGhhbmRsZSBiaW5hcnlcbi8vIG9wZXJhdG9yIHByZWNlZGVuY2UsIGJlY2F1c2UgaXQgaXMgbXVjaCBtb3JlIGNvbXBhY3QgdGhhbiB1c2luZ1xuLy8gdGhlIHRlY2huaXF1ZSBvdXRsaW5lZCBhYm92ZSwgd2hpY2ggdXNlcyBkaWZmZXJlbnQsIG5lc3Rpbmdcbi8vIGZ1bmN0aW9ucyB0byBzcGVjaWZ5IHByZWNlZGVuY2UsIGZvciBhbGwgb2YgdGhlIHRlbiBiaW5hcnlcbi8vIHByZWNlZGVuY2UgbGV2ZWxzIHRoYXQgSmF2YVNjcmlwdCBkZWZpbmVzLlxuLy9cbi8vIFtvcHBdOiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL09wZXJhdG9yLXByZWNlZGVuY2VfcGFyc2VyXG5cbmltcG9ydCB7IHR5cGVzIGFzIHR0LCB0eXBlIFRva2VuVHlwZSB9IGZyb20gXCIuLi90b2tlbml6ZXIvdHlwZXNcIjtcbmltcG9ydCAqIGFzIE4gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgTFZhbFBhcnNlciBmcm9tIFwiLi9sdmFsXCI7XG5pbXBvcnQge1xuICBpc0tleXdvcmQsXG4gIGlzUmVzZXJ2ZWRXb3JkLFxuICBpc1N0cmljdFJlc2VydmVkV29yZCxcbiAgaXNTdHJpY3RCaW5kUmVzZXJ2ZWRXb3JkLFxuICBpc0lkZW50aWZpZXJTdGFydCxcbiAgY2FuQmVSZXNlcnZlZFdvcmQsXG59IGZyb20gXCIuLi91dGlsL2lkZW50aWZpZXJcIjtcbmltcG9ydCB7IFBvc2l0aW9uIH0gZnJvbSBcIi4uL3V0aWwvbG9jYXRpb25cIjtcbmltcG9ydCAqIGFzIGNoYXJDb2RlcyBmcm9tIFwiY2hhcmNvZGVzXCI7XG5pbXBvcnQge1xuICBCSU5EX09VVFNJREUsXG4gIEJJTkRfVkFSLFxuICBTQ09QRV9BUlJPVyxcbiAgU0NPUEVfQ0xBU1MsXG4gIFNDT1BFX0RJUkVDVF9TVVBFUixcbiAgU0NPUEVfRlVOQ1RJT04sXG4gIFNDT1BFX1NVUEVSLFxuICBTQ09QRV9QUk9HUkFNLFxufSBmcm9tIFwiLi4vdXRpbC9zY29wZWZsYWdzXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uRXJyb3JzIH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHtcbiAgUEFSQU1fQVdBSVQsXG4gIFBBUkFNX0lOLFxuICBQQVJBTV9SRVRVUk4sXG4gIFBBUkFNLFxuICBmdW5jdGlvbkZsYWdzLFxufSBmcm9tIFwiLi4vdXRpbC9wcm9kdWN0aW9uLXBhcmFtZXRlclwiO1xuaW1wb3J0IHtcbiAgbmV3QXJyb3dIZWFkU2NvcGUsXG4gIG5ld0FzeW5jQXJyb3dTY29wZSxcbiAgbmV3RXhwcmVzc2lvblNjb3BlLFxufSBmcm9tIFwiLi4vdXRpbC9leHByZXNzaW9uLXNjb3BlXCI7XG5pbXBvcnQgeyBFcnJvcnMsIFNvdXJjZVR5cGVNb2R1bGVFcnJvcnMgfSBmcm9tIFwiLi9lcnJvclwiO1xuaW1wb3J0IHR5cGUgeyBQYXJzaW5nRXJyb3IgfSBmcm9tIFwiLi9lcnJvclwiO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFNvdXJjZVR5cGUgfSBmcm9tIFwiLi4vb3B0aW9uc1wiO1xuKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwcmVzc2lvblBhcnNlciBleHRlbmRzIExWYWxQYXJzZXIge1xuICAvLyBGb3J3YXJkLWRlY2xhcmF0aW9uOiBkZWZpbmVkIGluIHN0YXRlbWVudC5qc1xuICAvKjo6XG4gICtwYXJzZUJsb2NrOiAoXG4gICAgYWxsb3dEaXJlY3RpdmVzPzogYm9vbGVhbixcbiAgICBjcmVhdGVOZXdMZXhpY2FsU2NvcGU/OiBib29sZWFuLFxuICAgIGFmdGVyQmxvY2tQYXJzZT86IChoYXNTdHJpY3RNb2RlRGlyZWN0aXZlOiBib29sZWFuKSA9PiB2b2lkLFxuICApID0+IE4uQmxvY2tTdGF0ZW1lbnQ7XG4gICtwYXJzZUNsYXNzOiAoXG4gICAgbm9kZTogTi5DbGFzcyxcbiAgICBpc1N0YXRlbWVudDogYm9vbGVhbixcbiAgICBvcHRpb25hbElkPzogYm9vbGVhbixcbiAgKSA9PiBOLkNsYXNzO1xuICArcGFyc2VEZWNvcmF0b3JzOiAoYWxsb3dFeHBvcnQ/OiBib29sZWFuKSA9PiB2b2lkO1xuICArcGFyc2VGdW5jdGlvbjogPFQ6IE4uTm9ybWFsRnVuY3Rpb24+KFxuICAgIG5vZGU6IFQsXG4gICAgc3RhdGVtZW50PzogbnVtYmVyLFxuICAgIGFsbG93RXhwcmVzc2lvbkJvZHk/OiBib29sZWFuLFxuICAgIGlzQXN5bmM/OiBib29sZWFuLFxuICApID0+IFQ7XG4gICtwYXJzZUZ1bmN0aW9uUGFyYW1zOiAobm9kZTogTi5GdW5jdGlvbiwgYWxsb3dNb2RpZmllcnM/OiBib29sZWFuKSA9PiB2b2lkO1xuICArdGFrZURlY29yYXRvcnM6IChub2RlOiBOLkhhc0RlY29yYXRvcnMpID0+IHZvaWQ7XG4gICtwYXJzZUJsb2NrT3JNb2R1bGVCbG9ja0JvZHk6IChcbiAgICBib2R5OiBOLlN0YXRlbWVudFtdLFxuICAgIGRpcmVjdGl2ZXM6ID8oTi5EaXJlY3RpdmVbXSksXG4gICAgdG9wTGV2ZWw6IGJvb2xlYW4sXG4gICAgZW5kOiBUb2tlblR5cGUsXG4gICAgYWZ0ZXJCbG9ja1BhcnNlPzogKGhhc1N0cmljdE1vZGVEaXJlY3RpdmU6IGJvb2xlYW4pID0+IHZvaWRcbiAgKSA9PiB2b2lkXG4gICtwYXJzZVByb2dyYW06IChcbiAgICBwcm9ncmFtOiBOLlByb2dyYW0sIGVuZDogVG9rZW5UeXBlLCBzb3VyY2VUeXBlPzogU291cmNlVHlwZVxuICApID0+IE4uUHJvZ3JhbVxuICAqL1xuXG4gIC8vIEZvciBvYmplY3QgbGl0ZXJhbCwgY2hlY2sgaWYgcHJvcGVydHkgX19wcm90b19fIGhhcyBiZWVuIHVzZWQgbW9yZSB0aGFuIG9uY2UuXG4gIC8vIElmIHRoZSBleHByZXNzaW9uIGlzIGEgZGVzdHJ1Y3R1cmluZyBhc3NpZ25tZW50LCB0aGVuIF9fcHJvdG9fXyBtYXkgYXBwZWFyXG4gIC8vIG11bHRpcGxlIHRpbWVzLiBPdGhlcndpc2UsIF9fcHJvdG9fXyBpcyBhIGR1cGxpY2F0ZWQga2V5LlxuXG4gIC8vIEZvciByZWNvcmQgZXhwcmVzc2lvbiwgY2hlY2sgaWYgcHJvcGVydHkgX19wcm90b19fIGV4aXN0c1xuXG4gIGNoZWNrUHJvdG8oXG4gICAgcHJvcDogTi5PYmplY3RNZW1iZXIgfCBOLlNwcmVhZEVsZW1lbnQsXG4gICAgaXNSZWNvcmQ6IGJvb2xlYW4sXG4gICAgcHJvdG9SZWY6IHsgdXNlZDogYm9vbGVhbiB9LFxuICAgIHJlZkV4cHJlc3Npb25FcnJvcnM6ID9FeHByZXNzaW9uRXJyb3JzLFxuICApOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBwcm9wLnR5cGUgPT09IFwiU3ByZWFkRWxlbWVudFwiIHx8XG4gICAgICB0aGlzLmlzT2JqZWN0TWV0aG9kKHByb3ApIHx8XG4gICAgICBwcm9wLmNvbXB1dGVkIHx8XG4gICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgcHJvcC5zaG9ydGhhbmRcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBwcm9wLmtleTtcbiAgICAvLyBJdCBpcyBlaXRoZXIgYW4gSWRlbnRpZmllciBvciBhIFN0cmluZy9OdW1lcmljTGl0ZXJhbFxuICAgIGNvbnN0IG5hbWUgPSBrZXkudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIgPyBrZXkubmFtZSA6IGtleS52YWx1ZTtcblxuICAgIGlmIChuYW1lID09PSBcIl9fcHJvdG9fX1wiKSB7XG4gICAgICBpZiAoaXNSZWNvcmQpIHtcbiAgICAgICAgdGhpcy5yYWlzZShrZXkuc3RhcnQsIEVycm9ycy5SZWNvcmROb1Byb3RvKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHByb3RvUmVmLnVzZWQpIHtcbiAgICAgICAgaWYgKHJlZkV4cHJlc3Npb25FcnJvcnMpIHtcbiAgICAgICAgICAvLyBTdG9yZSB0aGUgZmlyc3QgcmVkZWZpbml0aW9uJ3MgcG9zaXRpb24sIG90aGVyd2lzZSBpZ25vcmUgYmVjYXVzZVxuICAgICAgICAgIC8vIHdlIGFyZSBwYXJzaW5nIGFtYmlndW91cyBwYXR0ZXJuXG4gICAgICAgICAgaWYgKHJlZkV4cHJlc3Npb25FcnJvcnMuZG91YmxlUHJvdG8gPT09IC0xKSB7XG4gICAgICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLmRvdWJsZVByb3RvID0ga2V5LnN0YXJ0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKGtleS5zdGFydCwgRXJyb3JzLkR1cGxpY2F0ZVByb3RvKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwcm90b1JlZi51c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBzaG91bGRFeGl0RGVzY2VuZGluZyhleHByOiBOLkV4cHJlc3Npb24sIHBvdGVudGlhbEFycm93QXQ6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBleHByLnR5cGUgPT09IFwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25cIiAmJiBleHByLnN0YXJ0ID09PSBwb3RlbnRpYWxBcnJvd0F0XG4gICAgKTtcbiAgfVxuXG4gIC8vIENvbnZlbmllbmNlIG1ldGhvZCB0byBwYXJzZSBhbiBFeHByZXNzaW9uIG9ubHlcbiAgZ2V0RXhwcmVzc2lvbigpOiBOLkV4cHJlc3Npb24gJiBOLlBhcnNlck91dHB1dCB7XG4gICAgbGV0IHBhcmFtRmxhZ3MgPSBQQVJBTTtcbiAgICBpZiAodGhpcy5oYXNQbHVnaW4oXCJ0b3BMZXZlbEF3YWl0XCIpICYmIHRoaXMuaW5Nb2R1bGUpIHtcbiAgICAgIHBhcmFtRmxhZ3MgfD0gUEFSQU1fQVdBSVQ7XG4gICAgfVxuICAgIHRoaXMuc2NvcGUuZW50ZXIoU0NPUEVfUFJPR1JBTSk7XG4gICAgdGhpcy5wcm9kUGFyYW0uZW50ZXIocGFyYW1GbGFncyk7XG4gICAgdGhpcy5uZXh0VG9rZW4oKTtcbiAgICBjb25zdCBleHByID0gdGhpcy5wYXJzZUV4cHJlc3Npb24oKTtcbiAgICBpZiAoIXRoaXMubWF0Y2godHQuZW9mKSkge1xuICAgICAgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgfVxuICAgIGV4cHIuY29tbWVudHMgPSB0aGlzLnN0YXRlLmNvbW1lbnRzO1xuICAgIGV4cHIuZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnM7XG4gICAgaWYgKHRoaXMub3B0aW9ucy50b2tlbnMpIHtcbiAgICAgIGV4cHIudG9rZW5zID0gdGhpcy50b2tlbnM7XG4gICAgfVxuICAgIHJldHVybiBleHByO1xuICB9XG5cbiAgLy8gIyMjIEV4cHJlc3Npb24gcGFyc2luZ1xuXG4gIC8vIFRoZXNlIG5lc3QsIGZyb20gdGhlIG1vc3QgZ2VuZXJhbCBleHByZXNzaW9uIHR5cGUgYXQgdGhlIHRvcCB0b1xuICAvLyAnYXRvbWljJywgbm9uZGl2aXNpYmxlIGV4cHJlc3Npb24gdHlwZXMgYXQgdGhlIGJvdHRvbS4gTW9zdCBvZlxuICAvLyB0aGUgZnVuY3Rpb25zIHdpbGwgc2ltcGx5IGxldCB0aGUgZnVuY3Rpb24gKHMpIGJlbG93IHRoZW0gcGFyc2UsXG4gIC8vIGFuZCwgKmlmKiB0aGUgc3ludGFjdGljIGNvbnN0cnVjdCB0aGV5IGhhbmRsZSBpcyBwcmVzZW50LCB3cmFwXG4gIC8vIHRoZSBBU1Qgbm9kZSB0aGF0IHRoZSBpbm5lciBwYXJzZXIgZ2F2ZSB0aGVtIGluIGFub3RoZXIgbm9kZS5cblxuICAvLyBQYXJzZSBhIGZ1bGwgZXhwcmVzc2lvbi5cbiAgLy8gLSBgZGlzYWxsb3dJbmBcbiAgLy8gICBpcyB1c2VkIHRvIGZvcmJpZCB0aGUgYGluYCBvcGVyYXRvciAoaW4gZm9yIGxvb3BzIGluaXRpYWxpemF0aW9uIGV4cHJlc3Npb25zKVxuICAvLyAgIFdoZW4gYGRpc2FsbG93SW5gIGlzIHRydWUsIHRoZSBwcm9kdWN0aW9uIHBhcmFtZXRlciBbSW5dIGlzIG5vdCBwcmVzZW50LlxuXG4gIC8vIC0gYHJlZkV4cHJlc3Npb25FcnJvcnMgYFxuICAvLyAgIHByb3ZpZGVzIHJlZmVyZW5jZSBmb3Igc3RvcmluZyAnPScgb3BlcmF0b3IgaW5zaWRlIHNob3J0aGFuZFxuICAvLyAgIHByb3BlcnR5IGFzc2lnbm1lbnQgaW4gY29udGV4dHMgd2hlcmUgYm90aCBvYmplY3QgZXhwcmVzc2lvblxuICAvLyAgIGFuZCBvYmplY3QgcGF0dGVybiBtaWdodCBhcHBlYXIgKHNvIGl0J3MgcG9zc2libGUgdG8gcmFpc2VcbiAgLy8gICBkZWxheWVkIHN5bnRheCBlcnJvciBhdCBjb3JyZWN0IHBvc2l0aW9uKS5cblxuICBwYXJzZUV4cHJlc3Npb24oXG4gICAgZGlzYWxsb3dJbj86IGJvb2xlYW4sXG4gICAgcmVmRXhwcmVzc2lvbkVycm9ycz86IEV4cHJlc3Npb25FcnJvcnMsXG4gICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgaWYgKGRpc2FsbG93SW4pIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc2FsbG93SW5BbmQoKCkgPT5cbiAgICAgICAgdGhpcy5wYXJzZUV4cHJlc3Npb25CYXNlKHJlZkV4cHJlc3Npb25FcnJvcnMpLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYWxsb3dJbkFuZCgoKSA9PiB0aGlzLnBhcnNlRXhwcmVzc2lvbkJhc2UocmVmRXhwcmVzc2lvbkVycm9ycykpO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtRXhwcmVzc2lvblxuICBwYXJzZUV4cHJlc3Npb25CYXNlKHJlZkV4cHJlc3Npb25FcnJvcnM/OiBFeHByZXNzaW9uRXJyb3JzKTogTi5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgY29uc3Qgc3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgIGNvbnN0IGV4cHIgPSB0aGlzLnBhcnNlTWF5YmVBc3NpZ24ocmVmRXhwcmVzc2lvbkVycm9ycyk7XG4gICAgaWYgKHRoaXMubWF0Y2godHQuY29tbWEpKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgbm9kZS5leHByZXNzaW9ucyA9IFtleHByXTtcbiAgICAgIHdoaWxlICh0aGlzLmVhdCh0dC5jb21tYSkpIHtcbiAgICAgICAgbm9kZS5leHByZXNzaW9ucy5wdXNoKHRoaXMucGFyc2VNYXliZUFzc2lnbihyZWZFeHByZXNzaW9uRXJyb3JzKSk7XG4gICAgICB9XG4gICAgICB0aGlzLnRvUmVmZXJlbmNlZExpc3Qobm9kZS5leHByZXNzaW9ucyk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiU2VxdWVuY2VFeHByZXNzaW9uXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIC8vIFNldCBbfkluXSBwYXJhbWV0ZXIgZm9yIGFzc2lnbm1lbnQgZXhwcmVzc2lvblxuICBwYXJzZU1heWJlQXNzaWduRGlzYWxsb3dJbihcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzPzogP0V4cHJlc3Npb25FcnJvcnMsXG4gICAgYWZ0ZXJMZWZ0UGFyc2U/OiBGdW5jdGlvbixcbiAgKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWxsb3dJbkFuZCgoKSA9PlxuICAgICAgdGhpcy5wYXJzZU1heWJlQXNzaWduKHJlZkV4cHJlc3Npb25FcnJvcnMsIGFmdGVyTGVmdFBhcnNlKSxcbiAgICApO1xuICB9XG5cbiAgLy8gU2V0IFsrSW5dIHBhcmFtZXRlciBmb3IgYXNzaWdubWVudCBleHByZXNzaW9uXG4gIHBhcnNlTWF5YmVBc3NpZ25BbGxvd0luKFxuICAgIHJlZkV4cHJlc3Npb25FcnJvcnM/OiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgICBhZnRlckxlZnRQYXJzZT86IEZ1bmN0aW9uLFxuICApIHtcbiAgICByZXR1cm4gdGhpcy5hbGxvd0luQW5kKCgpID0+XG4gICAgICB0aGlzLnBhcnNlTWF5YmVBc3NpZ24ocmVmRXhwcmVzc2lvbkVycm9ycywgYWZ0ZXJMZWZ0UGFyc2UpLFxuICAgICk7XG4gIH1cblxuICAvLyBUaGlzIG1ldGhvZCBpcyBvbmx5IHVzZWQgYnlcbiAgLy8gdGhlIHR5cGVzY3JpcHQgYW5kIGZsb3cgcGx1Z2lucy5cbiAgc2V0T3B0aW9uYWxQYXJhbWV0ZXJzRXJyb3IoXG4gICAgcmVmRXhwcmVzc2lvbkVycm9yczogRXhwcmVzc2lvbkVycm9ycyxcbiAgICByZXN1bHRFcnJvcj86IFBhcnNpbmdFcnJvcixcbiAgKSB7XG4gICAgcmVmRXhwcmVzc2lvbkVycm9ycy5vcHRpb25hbFBhcmFtZXRlcnMgPVxuICAgICAgcmVzdWx0RXJyb3I/LnBvcyA/PyB0aGlzLnN0YXRlLnN0YXJ0O1xuICB9XG5cbiAgLy8gUGFyc2UgYW4gYXNzaWdubWVudCBleHByZXNzaW9uLiBUaGlzIGluY2x1ZGVzIGFwcGxpY2F0aW9ucyBvZlxuICAvLyBvcGVyYXRvcnMgbGlrZSBgKz1gLlxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1Bc3NpZ25tZW50RXhwcmVzc2lvblxuICBwYXJzZU1heWJlQXNzaWduKFxuICAgIHJlZkV4cHJlc3Npb25FcnJvcnM/OiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgICBhZnRlckxlZnRQYXJzZT86IEZ1bmN0aW9uLFxuICApOiBOLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKFwieWllbGRcIikpIHtcbiAgICAgIGlmICh0aGlzLnByb2RQYXJhbS5oYXNZaWVsZCkge1xuICAgICAgICBsZXQgbGVmdCA9IHRoaXMucGFyc2VZaWVsZCgpO1xuICAgICAgICBpZiAoYWZ0ZXJMZWZ0UGFyc2UpIHtcbiAgICAgICAgICBsZWZ0ID0gYWZ0ZXJMZWZ0UGFyc2UuY2FsbCh0aGlzLCBsZWZ0LCBzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsZWZ0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBvd25FeHByZXNzaW9uRXJyb3JzO1xuICAgIGlmIChyZWZFeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICBvd25FeHByZXNzaW9uRXJyb3JzID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnMgPSBuZXcgRXhwcmVzc2lvbkVycm9ycygpO1xuICAgICAgb3duRXhwcmVzc2lvbkVycm9ycyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF0Y2godHQucGFyZW5MKSB8fCB0aGlzLm1hdGNoKHR0Lm5hbWUpKSB7XG4gICAgICB0aGlzLnN0YXRlLnBvdGVudGlhbEFycm93QXQgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgIH1cblxuICAgIGxldCBsZWZ0ID0gdGhpcy5wYXJzZU1heWJlQ29uZGl0aW9uYWwocmVmRXhwcmVzc2lvbkVycm9ycyk7XG4gICAgaWYgKGFmdGVyTGVmdFBhcnNlKSB7XG4gICAgICBsZWZ0ID0gYWZ0ZXJMZWZ0UGFyc2UuY2FsbCh0aGlzLCBsZWZ0LCBzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS50eXBlLmlzQXNzaWduKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgY29uc3Qgb3BlcmF0b3IgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgbm9kZS5vcGVyYXRvciA9IG9wZXJhdG9yO1xuXG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5lcSkpIHtcbiAgICAgICAgbm9kZS5sZWZ0ID0gdGhpcy50b0Fzc2lnbmFibGUobGVmdCwgLyogaXNMSFMgKi8gdHJ1ZSk7XG4gICAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnMuZG91YmxlUHJvdG8gPSAtMTsgLy8gcmVzZXQgYmVjYXVzZSBkb3VibGUgX19wcm90b19fIGlzIHZhbGlkIGluIGFzc2lnbm1lbnQgZXhwcmVzc2lvblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5sZWZ0ID0gbGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZkV4cHJlc3Npb25FcnJvcnMuc2hvcnRoYW5kQXNzaWduID49IG5vZGUubGVmdC5zdGFydCkge1xuICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLnNob3J0aGFuZEFzc2lnbiA9IC0xOyAvLyByZXNldCBiZWNhdXNlIHNob3J0aGFuZCBkZWZhdWx0IHdhcyB1c2VkIGNvcnJlY3RseVxuICAgICAgfVxuXG4gICAgICB0aGlzLmNoZWNrTFZhbChsZWZ0LCBcImFzc2lnbm1lbnQgZXhwcmVzc2lvblwiKTtcblxuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICBub2RlLnJpZ2h0ID0gdGhpcy5wYXJzZU1heWJlQXNzaWduKCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQXNzaWdubWVudEV4cHJlc3Npb25cIik7XG4gICAgfSBlbHNlIGlmIChvd25FeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICB0aGlzLmNoZWNrRXhwcmVzc2lvbkVycm9ycyhyZWZFeHByZXNzaW9uRXJyb3JzLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgdGVybmFyeSBjb25kaXRpb25hbCAoYD86YCkgb3BlcmF0b3IuXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLUNvbmRpdGlvbmFsRXhwcmVzc2lvblxuXG4gIHBhcnNlTWF5YmVDb25kaXRpb25hbChyZWZFeHByZXNzaW9uRXJyb3JzOiBFeHByZXNzaW9uRXJyb3JzKTogTi5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgY29uc3Qgc3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgIGNvbnN0IHBvdGVudGlhbEFycm93QXQgPSB0aGlzLnN0YXRlLnBvdGVudGlhbEFycm93QXQ7XG4gICAgY29uc3QgZXhwciA9IHRoaXMucGFyc2VFeHByT3BzKHJlZkV4cHJlc3Npb25FcnJvcnMpO1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkRXhpdERlc2NlbmRpbmcoZXhwciwgcG90ZW50aWFsQXJyb3dBdCkpIHtcbiAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcnNlQ29uZGl0aW9uYWwoZXhwciwgc3RhcnRQb3MsIHN0YXJ0TG9jLCByZWZFeHByZXNzaW9uRXJyb3JzKTtcbiAgfVxuXG4gIHBhcnNlQ29uZGl0aW9uYWwoXG4gICAgZXhwcjogTi5FeHByZXNzaW9uLFxuICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHJlZkV4cHJlc3Npb25FcnJvcnM/OiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgKTogTi5FeHByZXNzaW9uIHtcbiAgICBpZiAodGhpcy5lYXQodHQucXVlc3Rpb24pKSB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgICAgbm9kZS50ZXN0ID0gZXhwcjtcbiAgICAgIG5vZGUuY29uc2VxdWVudCA9IHRoaXMucGFyc2VNYXliZUFzc2lnbkFsbG93SW4oKTtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbG9uKTtcbiAgICAgIG5vZGUuYWx0ZXJuYXRlID0gdGhpcy5wYXJzZU1heWJlQXNzaWduKCk7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQ29uZGl0aW9uYWxFeHByZXNzaW9uXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIC8vIFN0YXJ0IHRoZSBwcmVjZWRlbmNlIHBhcnNlci5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtU2hvcnRDaXJjdWl0RXhwcmVzc2lvblxuXG4gIHBhcnNlRXhwck9wcyhyZWZFeHByZXNzaW9uRXJyb3JzOiBFeHByZXNzaW9uRXJyb3JzKTogTi5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgY29uc3Qgc3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgIGNvbnN0IHBvdGVudGlhbEFycm93QXQgPSB0aGlzLnN0YXRlLnBvdGVudGlhbEFycm93QXQ7XG4gICAgY29uc3QgZXhwciA9IHRoaXMucGFyc2VNYXliZVVuYXJ5KHJlZkV4cHJlc3Npb25FcnJvcnMpO1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkRXhpdERlc2NlbmRpbmcoZXhwciwgcG90ZW50aWFsQXJyb3dBdCkpIHtcbiAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcnNlRXhwck9wKGV4cHIsIHN0YXJ0UG9zLCBzdGFydExvYywgLTEpO1xuICB9XG5cbiAgLy8gUGFyc2UgYmluYXJ5IG9wZXJhdG9ycyB3aXRoIHRoZSBvcGVyYXRvciBwcmVjZWRlbmNlIHBhcnNpbmdcbiAgLy8gYWxnb3JpdGhtLiBgbGVmdGAgaXMgdGhlIGxlZnQtaGFuZCBzaWRlIG9mIHRoZSBvcGVyYXRvci5cbiAgLy8gYG1pblByZWNgIHByb3ZpZGVzIGNvbnRleHQgdGhhdCBhbGxvd3MgdGhlIGZ1bmN0aW9uIHRvIHN0b3AgYW5kXG4gIC8vIGRlZmVyIGZ1cnRoZXIgcGFyc2VyIHRvIG9uZSBvZiBpdHMgY2FsbGVycyB3aGVuIGl0IGVuY291bnRlcnMgYW5cbiAgLy8gb3BlcmF0b3IgdGhhdCBoYXMgYSBsb3dlciBwcmVjZWRlbmNlIHRoYW4gdGhlIHNldCBpdCBpcyBwYXJzaW5nLlxuXG4gIHBhcnNlRXhwck9wKFxuICAgIGxlZnQ6IE4uRXhwcmVzc2lvbixcbiAgICBsZWZ0U3RhcnRQb3M6IG51bWJlcixcbiAgICBsZWZ0U3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgIG1pblByZWM6IG51bWJlcixcbiAgKTogTi5FeHByZXNzaW9uIHtcbiAgICBsZXQgcHJlYyA9IHRoaXMuc3RhdGUudHlwZS5iaW5vcDtcbiAgICBpZiAocHJlYyAhPSBudWxsICYmICh0aGlzLnByb2RQYXJhbS5oYXNJbiB8fCAhdGhpcy5tYXRjaCh0dC5faW4pKSkge1xuICAgICAgaWYgKHByZWMgPiBtaW5QcmVjKSB7XG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5zdGF0ZS50eXBlO1xuICAgICAgICBpZiAob3AgPT09IHR0LnBpcGVsaW5lKSB7XG4gICAgICAgICAgdGhpcy5leHBlY3RQbHVnaW4oXCJwaXBlbGluZU9wZXJhdG9yXCIpO1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5KSB7XG4gICAgICAgICAgICByZXR1cm4gbGVmdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zdGF0ZS5pblBpcGVsaW5lID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmNoZWNrUGlwZWxpbmVBdEluZml4T3BlcmF0b3IobGVmdCwgbGVmdFN0YXJ0UG9zKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChsZWZ0U3RhcnRQb3MsIGxlZnRTdGFydExvYyk7XG4gICAgICAgIG5vZGUubGVmdCA9IGxlZnQ7XG4gICAgICAgIG5vZGUub3BlcmF0b3IgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGxvZ2ljYWwgPSBvcCA9PT0gdHQubG9naWNhbE9SIHx8IG9wID09PSB0dC5sb2dpY2FsQU5EO1xuICAgICAgICBjb25zdCBjb2FsZXNjZSA9IG9wID09PSB0dC5udWxsaXNoQ29hbGVzY2luZztcblxuICAgICAgICBpZiAoY29hbGVzY2UpIHtcbiAgICAgICAgICAvLyBIYW5kbGUgdGhlIHByZWNlZGVuY2Ugb2YgYHR0LmNvYWxlc2NlYCBhcyBlcXVhbCB0byB0aGUgcmFuZ2Ugb2YgbG9naWNhbCBleHByZXNzaW9ucy5cbiAgICAgICAgICAvLyBJbiBvdGhlciB3b3JkcywgYG5vZGUucmlnaHRgIHNob3VsZG4ndCBjb250YWluIGxvZ2ljYWwgZXhwcmVzc2lvbnMgaW4gb3JkZXIgdG8gY2hlY2sgdGhlIG1peGVkIGVycm9yLlxuICAgICAgICAgIHByZWMgPSAoKHR0LmxvZ2ljYWxBTkQ6IGFueSk6IHsgYmlub3A6IG51bWJlciB9KS5iaW5vcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmV4dCgpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBvcCA9PT0gdHQucGlwZWxpbmUgJiZcbiAgICAgICAgICB0aGlzLmdldFBsdWdpbk9wdGlvbihcInBpcGVsaW5lT3BlcmF0b3JcIiwgXCJwcm9wb3NhbFwiKSA9PT0gXCJtaW5pbWFsXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5tYXRjaCh0dC5uYW1lKSAmJlxuICAgICAgICAgICAgdGhpcy5zdGF0ZS52YWx1ZSA9PT0gXCJhd2FpdFwiICYmXG4gICAgICAgICAgICB0aGlzLnByb2RQYXJhbS5oYXNBd2FpdFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zdGFydCxcbiAgICAgICAgICAgICAgRXJyb3JzLlVuZXhwZWN0ZWRBd2FpdEFmdGVyUGlwZWxpbmVCb2R5LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLnJpZ2h0ID0gdGhpcy5wYXJzZUV4cHJPcFJpZ2h0RXhwcihvcCwgcHJlYyk7XG4gICAgICAgIHRoaXMuZmluaXNoTm9kZShcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGxvZ2ljYWwgfHwgY29hbGVzY2UgPyBcIkxvZ2ljYWxFeHByZXNzaW9uXCIgOiBcIkJpbmFyeUV4cHJlc3Npb25cIixcbiAgICAgICAgKTtcbiAgICAgICAgLyogdGhpcyBjaGVjayBpcyBmb3IgYWxsID8/IG9wZXJhdG9yc1xuICAgICAgICAgKiBhID8/IGIgJiYgYyBmb3IgdGhpcyBleGFtcGxlXG4gICAgICAgICAqIHdoZW4gb3AgaXMgY29hbGVzY2UgYW5kIG5leHRPcCBpcyBsb2dpY2FsICgmJiksIHRocm93IGF0IHRoZSBwb3Mgb2YgbmV4dE9wIHRoYXQgaXQgY2FuIG5vdCBiZSBtaXhlZC5cbiAgICAgICAgICogU3ltbWV0cmljYWxseSBpdCBhbHNvIHRocm93cyB3aGVuIG9wIGlzIGxvZ2ljYWwgYW5kIG5leHRPcCBpcyBjb2FsZXNjZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbmV4dE9wID0gdGhpcy5zdGF0ZS50eXBlO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgKGNvYWxlc2NlICYmIChuZXh0T3AgPT09IHR0LmxvZ2ljYWxPUiB8fCBuZXh0T3AgPT09IHR0LmxvZ2ljYWxBTkQpKSB8fFxuICAgICAgICAgIChsb2dpY2FsICYmIG5leHRPcCA9PT0gdHQubnVsbGlzaENvYWxlc2NpbmcpXG4gICAgICAgICkge1xuICAgICAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLk1peGluZ0NvYWxlc2NlV2l0aExvZ2ljYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFeHByT3Aobm9kZSwgbGVmdFN0YXJ0UG9zLCBsZWZ0U3RhcnRMb2MsIG1pblByZWMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVmdDtcbiAgfVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiBmb3IgYHBhcnNlRXhwck9wYC4gUGFyc2UgdGhlIHJpZ2h0LWhhbmQgc2lkZSBvZiBiaW5hcnktXG4gIC8vIG9wZXJhdG9yIGV4cHJlc3Npb25zLCB0aGVuIGFwcGx5IGFueSBvcGVyYXRvci1zcGVjaWZpYyBmdW5jdGlvbnMuXG5cbiAgcGFyc2VFeHByT3BSaWdodEV4cHIob3A6IFRva2VuVHlwZSwgcHJlYzogbnVtYmVyKTogTi5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgY29uc3Qgc3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgIHN3aXRjaCAob3ApIHtcbiAgICAgIGNhc2UgdHQucGlwZWxpbmU6XG4gICAgICAgIHN3aXRjaCAodGhpcy5nZXRQbHVnaW5PcHRpb24oXCJwaXBlbGluZU9wZXJhdG9yXCIsIFwicHJvcG9zYWxcIikpIHtcbiAgICAgICAgICBjYXNlIFwic21hcnRcIjpcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndpdGhUb3BpY1Blcm1pdHRpbmdDb250ZXh0KCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTbWFydFBpcGVsaW5lQm9keShcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRXhwck9wQmFzZVJpZ2h0RXhwcihvcCwgcHJlYyksXG4gICAgICAgICAgICAgICAgc3RhcnRQb3MsXG4gICAgICAgICAgICAgICAgc3RhcnRMb2MsXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICBjYXNlIFwiZnNoYXJwXCI6XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53aXRoU29sb0F3YWl0UGVybWl0dGluZ0NvbnRleHQoKCkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZTaGFycFBpcGVsaW5lQm9keShwcmVjKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAvLyBmYWxscyB0aHJvdWdoXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRXhwck9wQmFzZVJpZ2h0RXhwcihvcCwgcHJlYyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIGZvciBgcGFyc2VFeHByT3BSaWdodEV4cHJgLiBQYXJzZSB0aGUgcmlnaHQtaGFuZCBzaWRlIG9mXG4gIC8vIGJpbmFyeS1vcGVyYXRvciBleHByZXNzaW9ucyB3aXRob3V0IGFwcGx5aW5nIGFueSBvcGVyYXRvci1zcGVjaWZpYyBmdW5jdGlvbnMuXG5cbiAgcGFyc2VFeHByT3BCYXNlUmlnaHRFeHByKG9wOiBUb2tlblR5cGUsIHByZWM6IG51bWJlcik6IE4uRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgIGNvbnN0IHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5zdGFydExvYztcblxuICAgIHJldHVybiB0aGlzLnBhcnNlRXhwck9wKFxuICAgICAgdGhpcy5wYXJzZU1heWJlVW5hcnkoKSxcbiAgICAgIHN0YXJ0UG9zLFxuICAgICAgc3RhcnRMb2MsXG4gICAgICBvcC5yaWdodEFzc29jaWF0aXZlID8gcHJlYyAtIDEgOiBwcmVjLFxuICAgICk7XG4gIH1cblxuICBjaGVja0V4cG9uZW50aWFsQWZ0ZXJVbmFyeShub2RlOiBOLkF3YWl0RXhwcmVzc2lvbiB8IE4uVW5hcnlFeHByZXNzaW9uKSB7XG4gICAgaWYgKHRoaXMubWF0Y2godHQuZXhwb25lbnQpKSB7XG4gICAgICB0aGlzLnJhaXNlKFxuICAgICAgICBub2RlLmFyZ3VtZW50LnN0YXJ0LFxuICAgICAgICBFcnJvcnMuVW5leHBlY3RlZFRva2VuVW5hcnlFeHBvbmVudGlhdGlvbixcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gUGFyc2UgdW5hcnkgb3BlcmF0b3JzLCBib3RoIHByZWZpeCBhbmQgcG9zdGZpeC5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtVW5hcnlFeHByZXNzaW9uXG4gIHBhcnNlTWF5YmVVbmFyeShcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzOiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgICBzYXdVbmFyeT86IGJvb2xlYW4sXG4gICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgIGNvbnN0IHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5zdGFydExvYztcbiAgICBjb25zdCBpc0F3YWl0ID0gdGhpcy5pc0NvbnRleHR1YWwoXCJhd2FpdFwiKTtcblxuICAgIGlmIChpc0F3YWl0ICYmIHRoaXMuaXNBd2FpdEFsbG93ZWQoKSkge1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICBjb25zdCBleHByID0gdGhpcy5wYXJzZUF3YWl0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICBpZiAoIXNhd1VuYXJ5KSB0aGlzLmNoZWNrRXhwb25lbnRpYWxBZnRlclVuYXJ5KGV4cHIpO1xuICAgICAgcmV0dXJuIGV4cHI7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRoaXMuaXNDb250ZXh0dWFsKFwibW9kdWxlXCIpICYmXG4gICAgICB0aGlzLmxvb2thaGVhZENoYXJDb2RlKCkgPT09IGNoYXJDb2Rlcy5sZWZ0Q3VybHlCcmFjZSAmJlxuICAgICAgIXRoaXMuaGFzRm9sbG93aW5nTGluZUJyZWFrKClcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlTW9kdWxlRXhwcmVzc2lvbigpO1xuICAgIH1cbiAgICBjb25zdCB1cGRhdGUgPSB0aGlzLm1hdGNoKHR0LmluY0RlYyk7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUudHlwZS5wcmVmaXgpIHtcbiAgICAgIG5vZGUub3BlcmF0b3IgPSB0aGlzLnN0YXRlLnZhbHVlO1xuICAgICAgbm9kZS5wcmVmaXggPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy5tYXRjaCh0dC5fdGhyb3cpKSB7XG4gICAgICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwidGhyb3dFeHByZXNzaW9uc1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGlzRGVsZXRlID0gdGhpcy5tYXRjaCh0dC5fZGVsZXRlKTtcbiAgICAgIHRoaXMubmV4dCgpO1xuXG4gICAgICBub2RlLmFyZ3VtZW50ID0gdGhpcy5wYXJzZU1heWJlVW5hcnkobnVsbCwgdHJ1ZSk7XG5cbiAgICAgIHRoaXMuY2hlY2tFeHByZXNzaW9uRXJyb3JzKHJlZkV4cHJlc3Npb25FcnJvcnMsIHRydWUpO1xuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5zdHJpY3QgJiYgaXNEZWxldGUpIHtcbiAgICAgICAgY29uc3QgYXJnID0gbm9kZS5hcmd1bWVudDtcblxuICAgICAgICBpZiAoYXJnLnR5cGUgPT09IFwiSWRlbnRpZmllclwiKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBFcnJvcnMuU3RyaWN0RGVsZXRlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc1Byb3BlcnR5QXNQcml2YXRlTmFtZShhcmcpKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBFcnJvcnMuRGVsZXRlUHJpdmF0ZUZpZWxkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXVwZGF0ZSkge1xuICAgICAgICBpZiAoIXNhd1VuYXJ5KSB0aGlzLmNoZWNrRXhwb25lbnRpYWxBZnRlclVuYXJ5KG5vZGUpO1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiVW5hcnlFeHByZXNzaW9uXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGV4cHIgPSB0aGlzLnBhcnNlVXBkYXRlKG5vZGUsIHVwZGF0ZSwgcmVmRXhwcmVzc2lvbkVycm9ycyk7XG5cbiAgICBpZiAoaXNBd2FpdCkge1xuICAgICAgY29uc3Qgc3RhcnRzRXhwciA9IHRoaXMuaGFzUGx1Z2luKFwidjhpbnRyaW5zaWNcIilcbiAgICAgICAgPyB0aGlzLnN0YXRlLnR5cGUuc3RhcnRzRXhwclxuICAgICAgICA6IHRoaXMuc3RhdGUudHlwZS5zdGFydHNFeHByICYmICF0aGlzLm1hdGNoKHR0Lm1vZHVsbyk7XG4gICAgICBpZiAoc3RhcnRzRXhwciAmJiAhdGhpcy5pc0FtYmlndW91c0F3YWl0KCkpIHtcbiAgICAgICAgdGhpcy5yYWlzZU92ZXJ3cml0ZShcbiAgICAgICAgICBzdGFydFBvcyxcbiAgICAgICAgICB0aGlzLmhhc1BsdWdpbihcInRvcExldmVsQXdhaXRcIilcbiAgICAgICAgICAgID8gRXJyb3JzLkF3YWl0Tm90SW5Bc3luY0NvbnRleHRcbiAgICAgICAgICAgIDogRXJyb3JzLkF3YWl0Tm90SW5Bc3luY0Z1bmN0aW9uLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUF3YWl0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4cHI7XG4gIH1cblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1VcGRhdGVFeHByZXNzaW9uXG4gIHBhcnNlVXBkYXRlKFxuICAgIG5vZGU6IE4uRXhwcmVzc2lvbixcbiAgICB1cGRhdGU6IGJvb2xlYW4sXG4gICAgcmVmRXhwcmVzc2lvbkVycm9yczogP0V4cHJlc3Npb25FcnJvcnMsXG4gICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgdGhpcy5jaGVja0xWYWwobm9kZS5hcmd1bWVudCwgXCJwcmVmaXggb3BlcmF0aW9uXCIpO1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlVwZGF0ZUV4cHJlc3Npb25cIik7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgIGNvbnN0IHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5zdGFydExvYztcbiAgICBsZXQgZXhwciA9IHRoaXMucGFyc2VFeHByU3Vic2NyaXB0cyhyZWZFeHByZXNzaW9uRXJyb3JzKTtcbiAgICBpZiAodGhpcy5jaGVja0V4cHJlc3Npb25FcnJvcnMocmVmRXhwcmVzc2lvbkVycm9ycywgZmFsc2UpKSByZXR1cm4gZXhwcjtcbiAgICB3aGlsZSAodGhpcy5zdGF0ZS50eXBlLnBvc3RmaXggJiYgIXRoaXMuY2FuSW5zZXJ0U2VtaWNvbG9uKCkpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICBub2RlLm9wZXJhdG9yID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgIG5vZGUucHJlZml4ID0gZmFsc2U7XG4gICAgICBub2RlLmFyZ3VtZW50ID0gZXhwcjtcbiAgICAgIHRoaXMuY2hlY2tMVmFsKGV4cHIsIFwicG9zdGZpeCBvcGVyYXRpb25cIik7XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIGV4cHIgPSB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJVcGRhdGVFeHByZXNzaW9uXCIpO1xuICAgIH1cbiAgICByZXR1cm4gZXhwcjtcbiAgfVxuXG4gIC8vIFBhcnNlIGNhbGwsIGRvdCwgYW5kIGBbXWAtc3Vic2NyaXB0IGV4cHJlc3Npb25zLlxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1MZWZ0SGFuZFNpZGVFeHByZXNzaW9uXG4gIHBhcnNlRXhwclN1YnNjcmlwdHMocmVmRXhwcmVzc2lvbkVycm9yczogP0V4cHJlc3Npb25FcnJvcnMpOiBOLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgY29uc3QgcG90ZW50aWFsQXJyb3dBdCA9IHRoaXMuc3RhdGUucG90ZW50aWFsQXJyb3dBdDtcbiAgICBjb25zdCBleHByID0gdGhpcy5wYXJzZUV4cHJBdG9tKHJlZkV4cHJlc3Npb25FcnJvcnMpO1xuXG4gICAgaWYgKHRoaXMuc2hvdWxkRXhpdERlc2NlbmRpbmcoZXhwciwgcG90ZW50aWFsQXJyb3dBdCkpIHtcbiAgICAgIHJldHVybiBleHByO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcnNlU3Vic2NyaXB0cyhleHByLCBzdGFydFBvcywgc3RhcnRMb2MpO1xuICB9XG5cbiAgcGFyc2VTdWJzY3JpcHRzKFxuICAgIGJhc2U6IE4uRXhwcmVzc2lvbixcbiAgICBzdGFydFBvczogbnVtYmVyLFxuICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICBub0NhbGxzPzogP2Jvb2xlYW4sXG4gICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICBvcHRpb25hbENoYWluTWVtYmVyOiBmYWxzZSxcbiAgICAgIG1heWJlQXN5bmNBcnJvdzogdGhpcy5hdFBvc3NpYmxlQXN5bmNBcnJvdyhiYXNlKSxcbiAgICAgIHN0b3A6IGZhbHNlLFxuICAgIH07XG4gICAgZG8ge1xuICAgICAgYmFzZSA9IHRoaXMucGFyc2VTdWJzY3JpcHQoYmFzZSwgc3RhcnRQb3MsIHN0YXJ0TG9jLCBub0NhbGxzLCBzdGF0ZSk7XG5cbiAgICAgIC8vIEFmdGVyIHBhcnNpbmcgYSBzdWJzY3JpcHQsIHRoaXMgaXNuJ3QgXCJhc3luY1wiIGZvciBzdXJlLlxuICAgICAgc3RhdGUubWF5YmVBc3luY0Fycm93ID0gZmFsc2U7XG4gICAgfSB3aGlsZSAoIXN0YXRlLnN0b3ApO1xuICAgIHJldHVybiBiYXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBzdGF0ZSBTZXQgJ3N0YXRlLnN0b3AgPSB0cnVlJyB0byBpbmRpY2F0ZSB0aGF0IHdlIHNob3VsZCBzdG9wIHBhcnNpbmcgc3Vic2NyaXB0cy5cbiAgICogICBzdGF0ZS5vcHRpb25hbENoYWluTWVtYmVyIHRvIGluZGljYXRlIHRoYXQgdGhlIG1lbWJlciBpcyBjdXJyZW50bHkgaW4gT3B0aW9uYWxDaGFpblxuICAgKi9cbiAgcGFyc2VTdWJzY3JpcHQoXG4gICAgYmFzZTogTi5FeHByZXNzaW9uLFxuICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgIG5vQ2FsbHM6ID9ib29sZWFuLFxuICAgIHN0YXRlOiBOLlBhcnNlU3Vic2NyaXB0U3RhdGUsXG4gICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgaWYgKCFub0NhbGxzICYmIHRoaXMuZWF0KHR0LmRvdWJsZUNvbG9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VCaW5kKGJhc2UsIHN0YXJ0UG9zLCBzdGFydExvYywgbm9DYWxscywgc3RhdGUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5iYWNrUXVvdGUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJzZVRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbihcbiAgICAgICAgYmFzZSxcbiAgICAgICAgc3RhcnRQb3MsXG4gICAgICAgIHN0YXJ0TG9jLFxuICAgICAgICBzdGF0ZSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IG9wdGlvbmFsID0gZmFsc2U7XG4gICAgaWYgKHRoaXMubWF0Y2godHQucXVlc3Rpb25Eb3QpKSB7XG4gICAgICBpZiAobm9DYWxscyAmJiB0aGlzLmxvb2thaGVhZENoYXJDb2RlKCkgPT09IGNoYXJDb2Rlcy5sZWZ0UGFyZW50aGVzaXMpIHtcbiAgICAgICAgLy8gc3RvcCBhdCBgPy5gIHdoZW4gcGFyc2luZyBgbmV3IGE/LigpYFxuICAgICAgICBzdGF0ZS5zdG9wID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGJhc2U7XG4gICAgICB9XG4gICAgICBzdGF0ZS5vcHRpb25hbENoYWluTWVtYmVyID0gb3B0aW9uYWwgPSB0cnVlO1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgfVxuXG4gICAgaWYgKCFub0NhbGxzICYmIHRoaXMubWF0Y2godHQucGFyZW5MKSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb3ZlckNhbGxBbmRBc3luY0Fycm93SGVhZChcbiAgICAgICAgYmFzZSxcbiAgICAgICAgc3RhcnRQb3MsXG4gICAgICAgIHN0YXJ0TG9jLFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgb3B0aW9uYWwsXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAob3B0aW9uYWwgfHwgdGhpcy5tYXRjaCh0dC5icmFja2V0TCkgfHwgdGhpcy5lYXQodHQuZG90KSkge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VNZW1iZXIoYmFzZSwgc3RhcnRQb3MsIHN0YXJ0TG9jLCBzdGF0ZSwgb3B0aW9uYWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5zdG9wID0gdHJ1ZTtcbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGJhc2VbP1lpZWxkLCA/QXdhaXRdIFsgRXhwcmVzc2lvblsrSW4sID9ZaWVsZCwgP0F3YWl0XSBdXG4gIC8vIGJhc2VbP1lpZWxkLCA/QXdhaXRdIC4gSWRlbnRpZmllck5hbWVcbiAgLy8gYmFzZVs/WWllbGQsID9Bd2FpdF0gLiBQcml2YXRlSWRlbnRpZmllclxuICAvLyAgIHdoZXJlIGBiYXNlYCBpcyBvbmUgb2YgQ2FsbEV4cHJlc3Npb24sIE1lbWJlckV4cHJlc3Npb24gYW5kIE9wdGlvbmFsQ2hhaW5cbiAgcGFyc2VNZW1iZXIoXG4gICAgYmFzZTogTi5FeHByZXNzaW9uLFxuICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgIHN0YXRlOiBOLlBhcnNlU3Vic2NyaXB0U3RhdGUsXG4gICAgb3B0aW9uYWw6IGJvb2xlYW4sXG4gICk6IE4uT3B0aW9uYWxNZW1iZXJFeHByZXNzaW9uIHwgTi5NZW1iZXJFeHByZXNzaW9uIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5lYXQodHQuYnJhY2tldEwpO1xuICAgIG5vZGUub2JqZWN0ID0gYmFzZTtcbiAgICBub2RlLmNvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgY29uc3QgcHJpdmF0ZU5hbWUgPVxuICAgICAgIWNvbXB1dGVkICYmIHRoaXMubWF0Y2godHQucHJpdmF0ZU5hbWUpICYmIHRoaXMuc3RhdGUudmFsdWU7XG4gICAgY29uc3QgcHJvcGVydHkgPSBjb21wdXRlZFxuICAgICAgPyB0aGlzLnBhcnNlRXhwcmVzc2lvbigpXG4gICAgICA6IHByaXZhdGVOYW1lXG4gICAgICA/IHRoaXMucGFyc2VQcml2YXRlTmFtZSgpXG4gICAgICA6IHRoaXMucGFyc2VJZGVudGlmaWVyKHRydWUpO1xuXG4gICAgaWYgKHByaXZhdGVOYW1lICE9PSBmYWxzZSkge1xuICAgICAgaWYgKG5vZGUub2JqZWN0LnR5cGUgPT09IFwiU3VwZXJcIikge1xuICAgICAgICB0aGlzLnJhaXNlKHN0YXJ0UG9zLCBFcnJvcnMuU3VwZXJQcml2YXRlRmllbGQpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGFzc1Njb3BlLnVzZVByaXZhdGVOYW1lKHByaXZhdGVOYW1lLCBwcm9wZXJ0eS5zdGFydCk7XG4gICAgfVxuICAgIG5vZGUucHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2tldFIpO1xuICAgIH1cblxuICAgIGlmIChzdGF0ZS5vcHRpb25hbENoYWluTWVtYmVyKSB7XG4gICAgICBub2RlLm9wdGlvbmFsID0gb3B0aW9uYWw7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiT3B0aW9uYWxNZW1iZXJFeHByZXNzaW9uXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiTWVtYmVyRXhwcmVzc2lvblwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1iaW5kLW9wZXJhdG9yI3N5bnRheFxuICBwYXJzZUJpbmQoXG4gICAgYmFzZTogTi5FeHByZXNzaW9uLFxuICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgIG5vQ2FsbHM6ID9ib29sZWFuLFxuICAgIHN0YXRlOiBOLlBhcnNlU3Vic2NyaXB0U3RhdGUsXG4gICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICBub2RlLm9iamVjdCA9IGJhc2U7XG4gICAgbm9kZS5jYWxsZWUgPSB0aGlzLnBhcnNlTm9DYWxsRXhwcigpO1xuICAgIHN0YXRlLnN0b3AgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLnBhcnNlU3Vic2NyaXB0cyhcbiAgICAgIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkJpbmRFeHByZXNzaW9uXCIpLFxuICAgICAgc3RhcnRQb3MsXG4gICAgICBzdGFydExvYyxcbiAgICAgIG5vQ2FsbHMsXG4gICAgKTtcbiAgfVxuXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLUNvdmVyQ2FsbEV4cHJlc3Npb25BbmRBc3luY0Fycm93SGVhZFxuICAvLyBDb3ZlckNhbGxFeHByZXNzaW9uQW5kQXN5bmNBcnJvd0hlYWRcbiAgLy8gQ2FsbEV4cHJlc3Npb25bP1lpZWxkLCA/QXdhaXRdIEFyZ3VtZW50c1s/WWllbGQsID9Bd2FpdF1cbiAgLy8gT3B0aW9uYWxDaGFpbls/WWllbGQsID9Bd2FpdF0gQXJndW1lbnRzWz9ZaWVsZCwgP0F3YWl0XVxuICBwYXJzZUNvdmVyQ2FsbEFuZEFzeW5jQXJyb3dIZWFkKFxuICAgIGJhc2U6IE4uRXhwcmVzc2lvbixcbiAgICBzdGFydFBvczogbnVtYmVyLFxuICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICBzdGF0ZTogTi5QYXJzZVN1YnNjcmlwdFN0YXRlLFxuICAgIG9wdGlvbmFsOiBib29sZWFuLFxuICApOiBOLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IG9sZE1heWJlSW5BcnJvd1BhcmFtZXRlcnMgPSB0aGlzLnN0YXRlLm1heWJlSW5BcnJvd1BhcmFtZXRlcnM7XG4gICAgbGV0IHJlZkV4cHJlc3Npb25FcnJvcnMgPSBudWxsO1xuXG4gICAgdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gdHJ1ZTtcbiAgICB0aGlzLm5leHQoKTsgLy8gZWF0IGAoYFxuXG4gICAgbGV0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgbm9kZS5jYWxsZWUgPSBiYXNlO1xuXG4gICAgaWYgKHN0YXRlLm1heWJlQXN5bmNBcnJvdykge1xuICAgICAgdGhpcy5leHByZXNzaW9uU2NvcGUuZW50ZXIobmV3QXN5bmNBcnJvd1Njb3BlKCkpO1xuICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycyA9IG5ldyBFeHByZXNzaW9uRXJyb3JzKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlLm9wdGlvbmFsQ2hhaW5NZW1iZXIpIHtcbiAgICAgIG5vZGUub3B0aW9uYWwgPSBvcHRpb25hbDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9uYWwpIHtcbiAgICAgIG5vZGUuYXJndW1lbnRzID0gdGhpcy5wYXJzZUNhbGxFeHByZXNzaW9uQXJndW1lbnRzKHR0LnBhcmVuUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUuYXJndW1lbnRzID0gdGhpcy5wYXJzZUNhbGxFeHByZXNzaW9uQXJndW1lbnRzKFxuICAgICAgICB0dC5wYXJlblIsXG4gICAgICAgIGJhc2UudHlwZSA9PT0gXCJJbXBvcnRcIixcbiAgICAgICAgYmFzZS50eXBlICE9PSBcIlN1cGVyXCIsXG4gICAgICAgIG5vZGUsXG4gICAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnMsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmZpbmlzaENhbGxFeHByZXNzaW9uKG5vZGUsIHN0YXRlLm9wdGlvbmFsQ2hhaW5NZW1iZXIpO1xuXG4gICAgaWYgKHN0YXRlLm1heWJlQXN5bmNBcnJvdyAmJiB0aGlzLnNob3VsZFBhcnNlQXN5bmNBcnJvdygpICYmICFvcHRpb25hbCkge1xuICAgICAgc3RhdGUuc3RvcCA9IHRydWU7XG4gICAgICB0aGlzLmV4cHJlc3Npb25TY29wZS52YWxpZGF0ZUFzUGF0dGVybigpO1xuICAgICAgdGhpcy5leHByZXNzaW9uU2NvcGUuZXhpdCgpO1xuICAgICAgbm9kZSA9IHRoaXMucGFyc2VBc3luY0Fycm93RnJvbUNhbGxFeHByZXNzaW9uKFxuICAgICAgICB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyksXG4gICAgICAgIG5vZGUsXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhdGUubWF5YmVBc3luY0Fycm93KSB7XG4gICAgICAgIHRoaXMuY2hlY2tFeHByZXNzaW9uRXJyb3JzKHJlZkV4cHJlc3Npb25FcnJvcnMsIHRydWUpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25TY29wZS5leGl0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLnRvUmVmZXJlbmNlZEFyZ3VtZW50cyhub2RlKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlLm1heWJlSW5BcnJvd1BhcmFtZXRlcnMgPSBvbGRNYXliZUluQXJyb3dQYXJhbWV0ZXJzO1xuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB0b1JlZmVyZW5jZWRBcmd1bWVudHMoXG4gICAgbm9kZTogTi5DYWxsRXhwcmVzc2lvbiB8IE4uT3B0aW9uYWxDYWxsRXhwcmVzc2lvbixcbiAgICBpc1BhcmVudGhlc2l6ZWRFeHByPzogYm9vbGVhbixcbiAgKSB7XG4gICAgdGhpcy50b1JlZmVyZW5jZWRMaXN0RGVlcChub2RlLmFyZ3VtZW50cywgaXNQYXJlbnRoZXNpemVkRXhwcik7XG4gIH1cblxuICAvLyBNZW1iZXJFeHByZXNzaW9uIFs/WWllbGQsID9Bd2FpdF0gVGVtcGxhdGVMaXRlcmFsWz9ZaWVsZCwgP0F3YWl0LCArVGFnZ2VkXVxuICAvLyBDYWxsRXhwcmVzc2lvbiBbP1lpZWxkLCA/QXdhaXRdIFRlbXBsYXRlTGl0ZXJhbFs/WWllbGQsID9Bd2FpdCwgK1RhZ2dlZF1cbiAgcGFyc2VUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb24oXG4gICAgYmFzZTogTi5FeHByZXNzaW9uLFxuICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgIHN0YXRlOiBOLlBhcnNlU3Vic2NyaXB0U3RhdGUsXG4gICk6IE4uVGFnZ2VkVGVtcGxhdGVFeHByZXNzaW9uIHtcbiAgICBjb25zdCBub2RlOiBOLlRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbiA9IHRoaXMuc3RhcnROb2RlQXQoXG4gICAgICBzdGFydFBvcyxcbiAgICAgIHN0YXJ0TG9jLFxuICAgICk7XG4gICAgbm9kZS50YWcgPSBiYXNlO1xuICAgIG5vZGUucXVhc2kgPSB0aGlzLnBhcnNlVGVtcGxhdGUodHJ1ZSk7XG4gICAgaWYgKHN0YXRlLm9wdGlvbmFsQ2hhaW5NZW1iZXIpIHtcbiAgICAgIHRoaXMucmFpc2Uoc3RhcnRQb3MsIEVycm9ycy5PcHRpb25hbENoYWluaW5nTm9UZW1wbGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUYWdnZWRUZW1wbGF0ZUV4cHJlc3Npb25cIik7XG4gIH1cblxuICBhdFBvc3NpYmxlQXN5bmNBcnJvdyhiYXNlOiBOLkV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgYmFzZS50eXBlID09PSBcIklkZW50aWZpZXJcIiAmJlxuICAgICAgYmFzZS5uYW1lID09PSBcImFzeW5jXCIgJiZcbiAgICAgIHRoaXMuc3RhdGUubGFzdFRva0VuZCA9PT0gYmFzZS5lbmQgJiZcbiAgICAgICF0aGlzLmNhbkluc2VydFNlbWljb2xvbigpICYmXG4gICAgICAvLyBjaGVjayB0aGVyZSBhcmUgbm8gZXNjYXBlIHNlcXVlbmNlcywgc3VjaCBhcyBcXHV7NjF9c3luY1xuICAgICAgYmFzZS5lbmQgLSBiYXNlLnN0YXJ0ID09PSA1ICYmXG4gICAgICBiYXNlLnN0YXJ0ID09PSB0aGlzLnN0YXRlLnBvdGVudGlhbEFycm93QXRcbiAgICApO1xuICB9XG5cbiAgZmluaXNoQ2FsbEV4cHJlc3Npb248VDogTi5DYWxsRXhwcmVzc2lvbiB8IE4uT3B0aW9uYWxDYWxsRXhwcmVzc2lvbj4oXG4gICAgbm9kZTogVCxcbiAgICBvcHRpb25hbDogYm9vbGVhbixcbiAgKTogTi5FeHByZXNzaW9uIHtcbiAgICBpZiAobm9kZS5jYWxsZWUudHlwZSA9PT0gXCJJbXBvcnRcIikge1xuICAgICAgaWYgKG5vZGUuYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuQkFCRUxfOF9CUkVBS0lORykge1xuICAgICAgICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwiaW1wb3J0QXNzZXJ0aW9uc1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXRoaXMuaGFzUGx1Z2luKFwibW9kdWxlQXR0cmlidXRlc1wiKSkge1xuICAgICAgICAgICAgdGhpcy5leHBlY3RQbHVnaW4oXCJpbXBvcnRBc3NlcnRpb25zXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG5vZGUuYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBub2RlLmFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgbm9kZS5zdGFydCxcbiAgICAgICAgICBFcnJvcnMuSW1wb3J0Q2FsbEFyaXR5LFxuICAgICAgICAgIHRoaXMuaGFzUGx1Z2luKFwiaW1wb3J0QXNzZXJ0aW9uc1wiKSB8fFxuICAgICAgICAgICAgdGhpcy5oYXNQbHVnaW4oXCJtb2R1bGVBdHRyaWJ1dGVzXCIpXG4gICAgICAgICAgICA/IFwib25lIG9yIHR3byBhcmd1bWVudHNcIlxuICAgICAgICAgICAgOiBcIm9uZSBhcmd1bWVudFwiLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBhcmcgb2Ygbm9kZS5hcmd1bWVudHMpIHtcbiAgICAgICAgICBpZiAoYXJnLnR5cGUgPT09IFwiU3ByZWFkRWxlbWVudFwiKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKGFyZy5zdGFydCwgRXJyb3JzLkltcG9ydENhbGxTcHJlYWRBcmd1bWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUoXG4gICAgICBub2RlLFxuICAgICAgb3B0aW9uYWwgPyBcIk9wdGlvbmFsQ2FsbEV4cHJlc3Npb25cIiA6IFwiQ2FsbEV4cHJlc3Npb25cIixcbiAgICApO1xuICB9XG5cbiAgcGFyc2VDYWxsRXhwcmVzc2lvbkFyZ3VtZW50cyhcbiAgICBjbG9zZTogVG9rZW5UeXBlLFxuICAgIGR5bmFtaWNJbXBvcnQ/OiBib29sZWFuLFxuICAgIGFsbG93UGxhY2Vob2xkZXI/OiBib29sZWFuLFxuICAgIG5vZGVGb3JFeHRyYT86ID9OLk5vZGUsXG4gICAgcmVmRXhwcmVzc2lvbkVycm9ycz86ID9FeHByZXNzaW9uRXJyb3JzLFxuICApOiAkUmVhZE9ubHlBcnJheTw/Ti5FeHByZXNzaW9uPiB7XG4gICAgY29uc3QgZWx0cyA9IFtdO1xuICAgIGxldCBmaXJzdCA9IHRydWU7XG4gICAgY29uc3Qgb2xkSW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHkgPSB0aGlzLnN0YXRlLmluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5O1xuICAgIHRoaXMuc3RhdGUuaW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHkgPSBmYWxzZTtcblxuICAgIHdoaWxlICghdGhpcy5lYXQoY2xvc2UpKSB7XG4gICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbW1hKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goY2xvc2UpKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZHluYW1pY0ltcG9ydCAmJlxuICAgICAgICAgICAgIXRoaXMuaGFzUGx1Z2luKFwiaW1wb3J0QXNzZXJ0aW9uc1wiKSAmJlxuICAgICAgICAgICAgIXRoaXMuaGFzUGx1Z2luKFwibW9kdWxlQXR0cmlidXRlc1wiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnQsXG4gICAgICAgICAgICAgIEVycm9ycy5JbXBvcnRDYWxsQXJndW1lbnRUcmFpbGluZ0NvbW1hLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG5vZGVGb3JFeHRyYSkge1xuICAgICAgICAgICAgdGhpcy5hZGRFeHRyYShcbiAgICAgICAgICAgICAgbm9kZUZvckV4dHJhLFxuICAgICAgICAgICAgICBcInRyYWlsaW5nQ29tbWFcIixcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnQsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHRzLnB1c2goXG4gICAgICAgIHRoaXMucGFyc2VFeHByTGlzdEl0ZW0oZmFsc2UsIHJlZkV4cHJlc3Npb25FcnJvcnMsIGFsbG93UGxhY2Vob2xkZXIpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlLmluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5ID0gb2xkSW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHk7XG5cbiAgICByZXR1cm4gZWx0cztcbiAgfVxuXG4gIHNob3VsZFBhcnNlQXN5bmNBcnJvdygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaCh0dC5hcnJvdykgJiYgIXRoaXMuY2FuSW5zZXJ0U2VtaWNvbG9uKCk7XG4gIH1cblxuICBwYXJzZUFzeW5jQXJyb3dGcm9tQ2FsbEV4cHJlc3Npb24oXG4gICAgbm9kZTogTi5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbixcbiAgICBjYWxsOiBOLkNhbGxFeHByZXNzaW9uLFxuICApOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICB0aGlzLmV4cGVjdCh0dC5hcnJvdyk7XG4gICAgdGhpcy5wYXJzZUFycm93RXhwcmVzc2lvbihcbiAgICAgIG5vZGUsXG4gICAgICBjYWxsLmFyZ3VtZW50cyxcbiAgICAgIHRydWUsXG4gICAgICBmYWxzZSxcbiAgICAgIGNhbGwuZXh0cmE/LnRyYWlsaW5nQ29tbWEsXG4gICAgKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIC8vIFBhcnNlIGEgbm8tY2FsbCBleHByZXNzaW9uIChsaWtlIGFyZ3VtZW50IG9mIGBuZXdgIG9yIGA6OmAgb3BlcmF0b3JzKS5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtTWVtYmVyRXhwcmVzc2lvblxuICBwYXJzZU5vQ2FsbEV4cHIoKTogTi5FeHByZXNzaW9uIHtcbiAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgY29uc3Qgc3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgIHJldHVybiB0aGlzLnBhcnNlU3Vic2NyaXB0cyh0aGlzLnBhcnNlRXhwckF0b20oKSwgc3RhcnRQb3MsIHN0YXJ0TG9jLCB0cnVlKTtcbiAgfVxuXG4gIC8vIFBhcnNlIGFuIGF0b21pYyBleHByZXNzaW9uIOKAlCBlaXRoZXIgYSBzaW5nbGUgdG9rZW4gdGhhdCBpcyBhblxuICAvLyBleHByZXNzaW9uLCBhbiBleHByZXNzaW9uIHN0YXJ0ZWQgYnkgYSBrZXl3b3JkIGxpa2UgYGZ1bmN0aW9uYCBvclxuICAvLyBgbmV3YCwgb3IgYW4gZXhwcmVzc2lvbiB3cmFwcGVkIGluIHB1bmN0dWF0aW9uIGxpa2UgYCgpYCwgYFtdYCxcbiAgLy8gb3IgYHt9YC5cblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1QcmltYXJ5RXhwcmVzc2lvblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1Bc3luY0Fycm93RnVuY3Rpb25cbiAgLy8gUHJpbWFyeUV4cHJlc3Npb25cbiAgLy8gU3VwZXJcbiAgLy8gSW1wb3J0XG4gIC8vIEFzeW5jQXJyb3dGdW5jdGlvblxuXG4gIHBhcnNlRXhwckF0b20ocmVmRXhwcmVzc2lvbkVycm9ycz86ID9FeHByZXNzaW9uRXJyb3JzKTogTi5FeHByZXNzaW9uIHtcbiAgICBsZXQgbm9kZTtcblxuICAgIHN3aXRjaCAodGhpcy5zdGF0ZS50eXBlKSB7XG4gICAgICBjYXNlIHR0Ll9zdXBlcjpcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VTdXBlcigpO1xuXG4gICAgICBjYXNlIHR0Ll9pbXBvcnQ6XG4gICAgICAgIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcblxuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5kb3QpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VJbXBvcnRNZXRhUHJvcGVydHkobm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMubWF0Y2godHQucGFyZW5MKSkge1xuICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnQsIEVycm9ycy5VbnN1cHBvcnRlZEltcG9ydCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkltcG9ydFwiKTtcbiAgICAgIGNhc2UgdHQuX3RoaXM6XG4gICAgICAgIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIlRoaXNFeHByZXNzaW9uXCIpO1xuXG4gICAgICBjYXNlIHR0Lm5hbWU6IHtcbiAgICAgICAgY29uc3QgY2FuQmVBcnJvdyA9IHRoaXMuc3RhdGUucG90ZW50aWFsQXJyb3dBdCA9PT0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgICAgY29uc3QgY29udGFpbnNFc2MgPSB0aGlzLnN0YXRlLmNvbnRhaW5zRXNjO1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMucGFyc2VJZGVudGlmaWVyKCk7XG5cbiAgICAgICAgaWYgKCFjb250YWluc0VzYyAmJiBpZC5uYW1lID09PSBcImFzeW5jXCIgJiYgIXRoaXMuY2FuSW5zZXJ0U2VtaWNvbG9uKCkpIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5fZnVuY3Rpb24pKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRnVuY3Rpb24oXG4gICAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlQXROb2RlKGlkKSxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2godHQubmFtZSkpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRva2VuIGJlZ2lucyB3aXRoIFwiPVwiLCBjb21taXQgdG8gcGFyc2luZyBhbiBhc3luY1xuICAgICAgICAgICAgLy8gYXJyb3cgZnVuY3Rpb24uIChQZWVraW5nIGFoZWFkIGZvciBcIj1cIiBsZXRzIHVzIGF2b2lkIGEgbW9yZVxuICAgICAgICAgICAgLy8gZXhwZW5zaXZlIGZ1bGwtdG9rZW4gbG9va2FoZWFkIG9uIHRoaXMgY29tbW9uIHBhdGguKVxuICAgICAgICAgICAgaWYgKHRoaXMubG9va2FoZWFkQ2hhckNvZGUoKSA9PT0gY2hhckNvZGVzLmVxdWFsc1RvKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQXN5bmNBcnJvd1VuYXJ5RnVuY3Rpb24oaWQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB0cmVhdCBcImFzeW5jXCIgYXMgYW4gaWRlbnRpZmllciBhbmQgbGV0IGNhbGxpbmcgY29kZVxuICAgICAgICAgICAgICAvLyBkZWFsIHdpdGggdGhlIGN1cnJlbnQgdHQubmFtZSB0b2tlbi5cbiAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5fZG8pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZURvKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjYW5CZUFycm93ICYmIHRoaXMubWF0Y2godHQuYXJyb3cpICYmICF0aGlzLmNhbkluc2VydFNlbWljb2xvbigpKSB7XG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VBcnJvd0V4cHJlc3Npb24oXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Tm9kZUF0Tm9kZShpZCksXG4gICAgICAgICAgICBbaWRdLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH1cblxuICAgICAgY2FzZSB0dC5fZG86IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VEbyhmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgdHQuc2xhc2g6XG4gICAgICBjYXNlIHR0LnNsYXNoQXNzaWduOiB7XG4gICAgICAgIHRoaXMucmVhZFJlZ2V4cCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVJlZ0V4cExpdGVyYWwodGhpcy5zdGF0ZS52YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgdHQubnVtOlxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU51bWVyaWNMaXRlcmFsKHRoaXMuc3RhdGUudmFsdWUpO1xuXG4gICAgICBjYXNlIHR0LmJpZ2ludDpcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VCaWdJbnRMaXRlcmFsKHRoaXMuc3RhdGUudmFsdWUpO1xuXG4gICAgICBjYXNlIHR0LmRlY2ltYWw6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRGVjaW1hbExpdGVyYWwodGhpcy5zdGF0ZS52YWx1ZSk7XG5cbiAgICAgIGNhc2UgdHQuc3RyaW5nOlxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVN0cmluZ0xpdGVyYWwodGhpcy5zdGF0ZS52YWx1ZSk7XG5cbiAgICAgIGNhc2UgdHQuX251bGw6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlTnVsbExpdGVyYWwoKTtcblxuICAgICAgY2FzZSB0dC5fdHJ1ZTpcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VCb29sZWFuTGl0ZXJhbCh0cnVlKTtcbiAgICAgIGNhc2UgdHQuX2ZhbHNlOlxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUJvb2xlYW5MaXRlcmFsKGZhbHNlKTtcblxuICAgICAgY2FzZSB0dC5wYXJlbkw6IHtcbiAgICAgICAgY29uc3QgY2FuQmVBcnJvdyA9IHRoaXMuc3RhdGUucG90ZW50aWFsQXJyb3dBdCA9PT0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VQYXJlbkFuZERpc3Rpbmd1aXNoRXhwcmVzc2lvbihjYW5CZUFycm93KTtcbiAgICAgIH1cblxuICAgICAgY2FzZSB0dC5icmFja2V0QmFyTDpcbiAgICAgIGNhc2UgdHQuYnJhY2tldEhhc2hMOiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlQXJyYXlMaWtlKFxuICAgICAgICAgIHRoaXMuc3RhdGUudHlwZSA9PT0gdHQuYnJhY2tldEJhckwgPyB0dC5icmFja2V0QmFyUiA6IHR0LmJyYWNrZXRSLFxuICAgICAgICAgIC8qIGNhbkJlUGF0dGVybiAqLyBmYWxzZSxcbiAgICAgICAgICAvKiBpc1R1cGxlICovIHRydWUsXG4gICAgICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNhc2UgdHQuYnJhY2tldEw6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VBcnJheUxpa2UoXG4gICAgICAgICAgdHQuYnJhY2tldFIsXG4gICAgICAgICAgLyogY2FuQmVQYXR0ZXJuICovIHRydWUsXG4gICAgICAgICAgLyogaXNUdXBsZSAqLyBmYWxzZSxcbiAgICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY2FzZSB0dC5icmFjZUJhckw6XG4gICAgICBjYXNlIHR0LmJyYWNlSGFzaEw6IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPYmplY3RMaWtlKFxuICAgICAgICAgIHRoaXMuc3RhdGUudHlwZSA9PT0gdHQuYnJhY2VCYXJMID8gdHQuYnJhY2VCYXJSIDogdHQuYnJhY2VSLFxuICAgICAgICAgIC8qIGlzUGF0dGVybiAqLyBmYWxzZSxcbiAgICAgICAgICAvKiBpc1JlY29yZCAqLyB0cnVlLFxuICAgICAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnMsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBjYXNlIHR0LmJyYWNlTDoge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9iamVjdExpa2UoXG4gICAgICAgICAgdHQuYnJhY2VSLFxuICAgICAgICAgIC8qIGlzUGF0dGVybiAqLyBmYWxzZSxcbiAgICAgICAgICAvKiBpc1JlY29yZCAqLyBmYWxzZSxcbiAgICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY2FzZSB0dC5fZnVuY3Rpb246XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlRnVuY3Rpb25PckZ1bmN0aW9uU2VudCgpO1xuXG4gICAgICBjYXNlIHR0LmF0OlxuICAgICAgICB0aGlzLnBhcnNlRGVjb3JhdG9ycygpO1xuICAgICAgLy8gZmFsbCB0aHJvdWdoXG4gICAgICBjYXNlIHR0Ll9jbGFzczpcbiAgICAgICAgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgIHRoaXMudGFrZURlY29yYXRvcnMobm9kZSk7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ2xhc3Mobm9kZSwgZmFsc2UpO1xuXG4gICAgICBjYXNlIHR0Ll9uZXc6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlTmV3T3JOZXdUYXJnZXQoKTtcblxuICAgICAgY2FzZSB0dC5iYWNrUXVvdGU6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlVGVtcGxhdGUoZmFsc2UpO1xuXG4gICAgICAvLyBCaW5kRXhwcmVzc2lvbltZaWVsZF1cbiAgICAgIC8vICAgOjogTWVtYmVyRXhwcmVzc2lvbls/WWllbGRdXG4gICAgICBjYXNlIHR0LmRvdWJsZUNvbG9uOiB7XG4gICAgICAgIG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgbm9kZS5vYmplY3QgPSBudWxsO1xuICAgICAgICBjb25zdCBjYWxsZWUgPSAobm9kZS5jYWxsZWUgPSB0aGlzLnBhcnNlTm9DYWxsRXhwcigpKTtcbiAgICAgICAgaWYgKGNhbGxlZS50eXBlID09PSBcIk1lbWJlckV4cHJlc3Npb25cIikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJCaW5kRXhwcmVzc2lvblwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLnJhaXNlKGNhbGxlZS5zdGFydCwgRXJyb3JzLlVuc3VwcG9ydGVkQmluZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FzZSB0dC5wcml2YXRlTmFtZToge1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZXMvcHJvcG9zYWwtcHJpdmF0ZS1maWVsZHMtaW4taW5cbiAgICAgICAgLy8gUmVsYXRpb25hbEV4cHJlc3Npb24gW0luLCBZaWVsZCwgQXdhaXRdXG4gICAgICAgIC8vICAgWytJbl0gUHJpdmF0ZUlkZW50aWZpZXIgaW4gU2hpZnRFeHByZXNzaW9uWz9ZaWVsZCwgP0F3YWl0XVxuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICAgICAgbm9kZSA9IHRoaXMucGFyc2VQcml2YXRlTmFtZSgpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5faW4pKSB7XG4gICAgICAgICAgdGhpcy5leHBlY3RQbHVnaW4oXCJwcml2YXRlSW5cIik7XG4gICAgICAgICAgdGhpcy5jbGFzc1Njb3BlLnVzZVByaXZhdGVOYW1lKHZhbHVlLCBub2RlLnN0YXJ0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhhc1BsdWdpbihcInByaXZhdGVJblwiKSkge1xuICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlByaXZhdGVJbkV4cGVjdGVkSW4sIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLnVuZXhwZWN0ZWQoc3RhcnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgICAgY2FzZSB0dC5oYXNoOiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmluUGlwZWxpbmUpIHtcbiAgICAgICAgICBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuZ2V0UGx1Z2luT3B0aW9uKFwicGlwZWxpbmVPcGVyYXRvclwiLCBcInByb3Bvc2FsXCIpICE9PSBcInNtYXJ0XCJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgRXJyb3JzLlByaW1hcnlUb3BpY1JlcXVpcmVzU21hcnRQaXBlbGluZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XG5cbiAgICAgICAgICBpZiAoIXRoaXMucHJpbWFyeVRvcGljUmVmZXJlbmNlSXNBbGxvd2VkSW5DdXJyZW50VG9waWNDb250ZXh0KCkpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgRXJyb3JzLlByaW1hcnlUb3BpY05vdEFsbG93ZWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMucmVnaXN0ZXJUb3BpY1JlZmVyZW5jZSgpO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJQaXBlbGluZVByaW1hcnlUb3BpY1JlZmVyZW5jZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZmFsbCB0aHJvdWdoXG4gICAgICBjYXNlIHR0LnJlbGF0aW9uYWw6IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUudmFsdWUgPT09IFwiPFwiKSB7XG4gICAgICAgICAgY29uc3QgbG9va2FoZWFkQ2ggPSB0aGlzLmlucHV0LmNvZGVQb2ludEF0KHRoaXMubmV4dFRva2VuU3RhcnQoKSk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaXNJZGVudGlmaWVyU3RhcnQobG9va2FoZWFkQ2gpIHx8IC8vIEVsZW1lbnQvVHlwZSBQYXJhbWV0ZXIgPGZvbz5cbiAgICAgICAgICAgIGxvb2thaGVhZENoID09PSBjaGFyQ29kZXMuZ3JlYXRlclRoYW4gLy8gRnJhZ21lbnQgPD5cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZXhwZWN0T25lUGx1Z2luKFtcImpzeFwiLCBcImZsb3dcIiwgXCJ0eXBlc2NyaXB0XCJdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gYXN5bmMgW25vIExpbmVUZXJtaW5hdG9yIGhlcmVdIEFzeW5jQXJyb3dCaW5kaW5nSWRlbnRpZmllcls/WWllbGRdIFtubyBMaW5lVGVybWluYXRvciBoZXJlXSA9PiBBc3luY0NvbmNpc2VCb2R5Wz9Jbl1cbiAgcGFyc2VBc3luY0Fycm93VW5hcnlGdW5jdGlvbihpZDogTi5FeHByZXNzaW9uKTogTi5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlQXROb2RlKGlkKTtcbiAgICAvLyBXZSBkb24ndCBuZWVkIHRvIHB1c2ggYSBuZXcgUGFyYW1ldGVyRGVjbGFyYXRpb25TY29wZSBoZXJlIHNpbmNlIHdlIGFyZSBzdXJlXG4gICAgLy8gMSkgaXQgaXMgYW4gYXN5bmMgYXJyb3csIDIpIG5vIGJpZGluZyBwYXR0ZXJuIGlzIGFsbG93ZWQgaW4gcGFyYW1zXG4gICAgdGhpcy5wcm9kUGFyYW0uZW50ZXIoZnVuY3Rpb25GbGFncyh0cnVlLCB0aGlzLnByb2RQYXJhbS5oYXNZaWVsZCkpO1xuICAgIGNvbnN0IHBhcmFtcyA9IFt0aGlzLnBhcnNlSWRlbnRpZmllcigpXTtcbiAgICB0aGlzLnByb2RQYXJhbS5leGl0KCk7XG4gICAgaWYgKHRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKCkpIHtcbiAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5wb3MsIEVycm9ycy5MaW5lVGVybWluYXRvckJlZm9yZUFycm93KTtcbiAgICB9XG4gICAgdGhpcy5leHBlY3QodHQuYXJyb3cpO1xuICAgIC8vIGxldCBmb28gPSBhc3luYyBiYXIgPT4ge307XG4gICAgdGhpcy5wYXJzZUFycm93RXhwcmVzc2lvbihub2RlLCBwYXJhbXMsIHRydWUpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZG8tZXhwcmVzc2lvbnNcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtYXN5bmMtZG8tZXhwcmVzc2lvbnNcbiAgcGFyc2VEbyhpc0FzeW5jOiBib29sZWFuKTogTi5Eb0V4cHJlc3Npb24ge1xuICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwiZG9FeHByZXNzaW9uc1wiKTtcbiAgICBpZiAoaXNBc3luYykge1xuICAgICAgdGhpcy5leHBlY3RQbHVnaW4oXCJhc3luY0RvRXhwcmVzc2lvbnNcIik7XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgIG5vZGUuYXN5bmMgPSBpc0FzeW5jO1xuICAgIHRoaXMubmV4dCgpOyAvLyBlYXQgYGRvYFxuICAgIGNvbnN0IG9sZExhYmVscyA9IHRoaXMuc3RhdGUubGFiZWxzO1xuICAgIHRoaXMuc3RhdGUubGFiZWxzID0gW107XG4gICAgaWYgKGlzQXN5bmMpIHtcbiAgICAgIC8vIEFzeW5jRG9FeHByZXNzaW9uIDpcbiAgICAgIC8vIGFzeW5jIFtubyBMaW5lVGVybWluYXRvciBoZXJlXSBkbyBCbG9ja1t+WWllbGQsICtBd2FpdCwgflJldHVybl1cbiAgICAgIHRoaXMucHJvZFBhcmFtLmVudGVyKFBBUkFNX0FXQUlUKTtcbiAgICAgIG5vZGUuYm9keSA9IHRoaXMucGFyc2VCbG9jaygpO1xuICAgICAgdGhpcy5wcm9kUGFyYW0uZXhpdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLmJvZHkgPSB0aGlzLnBhcnNlQmxvY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlLmxhYmVscyA9IG9sZExhYmVscztcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiRG9FeHByZXNzaW9uXCIpO1xuICB9XG5cbiAgLy8gUGFyc2UgdGhlIGBzdXBlcmAga2V5d29yZFxuICBwYXJzZVN1cGVyKCk6IE4uU3VwZXIge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgIHRoaXMubmV4dCgpOyAvLyBlYXQgYHN1cGVyYFxuICAgIGlmIChcbiAgICAgIHRoaXMubWF0Y2godHQucGFyZW5MKSAmJlxuICAgICAgIXRoaXMuc2NvcGUuYWxsb3dEaXJlY3RTdXBlciAmJlxuICAgICAgIXRoaXMub3B0aW9ucy5hbGxvd1N1cGVyT3V0c2lkZU1ldGhvZFxuICAgICkge1xuICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBFcnJvcnMuU3VwZXJOb3RBbGxvd2VkKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgIXRoaXMuc2NvcGUuYWxsb3dTdXBlciAmJlxuICAgICAgIXRoaXMub3B0aW9ucy5hbGxvd1N1cGVyT3V0c2lkZU1ldGhvZFxuICAgICkge1xuICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBFcnJvcnMuVW5leHBlY3RlZFN1cGVyKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy5tYXRjaCh0dC5wYXJlbkwpICYmXG4gICAgICAhdGhpcy5tYXRjaCh0dC5icmFja2V0TCkgJiZcbiAgICAgICF0aGlzLm1hdGNoKHR0LmRvdClcbiAgICApIHtcbiAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgRXJyb3JzLlVuc3VwcG9ydGVkU3VwZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJTdXBlclwiKTtcbiAgfVxuXG4gIHBhcnNlTWF5YmVQcml2YXRlTmFtZShcbiAgICBpc1ByaXZhdGVOYW1lQWxsb3dlZDogYm9vbGVhbixcbiAgKTogTi5Qcml2YXRlTmFtZSB8IE4uSWRlbnRpZmllciB7XG4gICAgY29uc3QgaXNQcml2YXRlID0gdGhpcy5tYXRjaCh0dC5wcml2YXRlTmFtZSk7XG5cbiAgICBpZiAoaXNQcml2YXRlKSB7XG4gICAgICBpZiAoIWlzUHJpdmF0ZU5hbWVBbGxvd2VkKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCArIDEsIEVycm9ycy5VbmV4cGVjdGVkUHJpdmF0ZUZpZWxkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnBhcnNlUHJpdmF0ZU5hbWUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VJZGVudGlmaWVyKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlUHJpdmF0ZU5hbWUoKTogTi5Qcml2YXRlTmFtZSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgY29uc3QgaWQgPSB0aGlzLnN0YXJ0Tm9kZUF0KFxuICAgICAgdGhpcy5zdGF0ZS5zdGFydCArIDEsXG4gICAgICAvLyBUaGUgcG9zaXRpb24gaXMgaGFyZGNvZGVkIGJlY2F1c2Ugd2UgbWVyZ2UgYCNgIGFuZCBuYW1lIGludG8gYSBzaW5nbGVcbiAgICAgIC8vIHR0LnByaXZhdGVOYW1lIHRva2VuXG4gICAgICBuZXcgUG9zaXRpb24oXG4gICAgICAgIHRoaXMuc3RhdGUuY3VyTGluZSxcbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydCArIDEgLSB0aGlzLnN0YXRlLmxpbmVTdGFydCxcbiAgICAgICksXG4gICAgKTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5zdGF0ZS52YWx1ZTtcbiAgICB0aGlzLm5leHQoKTsgLy8gZWF0ICNuYW1lO1xuICAgIG5vZGUuaWQgPSB0aGlzLmNyZWF0ZUlkZW50aWZpZXIoaWQsIG5hbWUpO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJQcml2YXRlTmFtZVwiKTtcbiAgfVxuXG4gIHBhcnNlRnVuY3Rpb25PckZ1bmN0aW9uU2VudCgpOiBOLkZ1bmN0aW9uRXhwcmVzc2lvbiB8IE4uTWV0YVByb3BlcnR5IHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcblxuICAgIC8vIFdlIGRvIG5vdCBkbyBwYXJzZUlkZW50aWZpZXIgaGVyZSBiZWNhdXNlIHdoZW4gcGFyc2VGdW5jdGlvbk9yRnVuY3Rpb25TZW50XG4gICAgLy8gaXMgY2FsbGVkIHdlIGFscmVhZHkga25vdyB0aGF0IHRoZSBjdXJyZW50IHRva2VuIGlzIGEgXCJuYW1lXCIgd2l0aCB0aGUgdmFsdWUgXCJmdW5jdGlvblwiXG4gICAgLy8gVGhpcyB3aWxsIGltcHJvdmUgcGVyZiBhIHRpbnkgbGl0dGxlIGJpdCBhcyB3ZSBkbyBub3QgZG8gdmFsaWRhdGlvbiBidXQgbW9yZSBpbXBvcnRhbnRseVxuICAgIC8vIGhlcmUgaXMgdGhhdCBwYXJzZUlkZW50aWZpZXIgd2lsbCByZW1vdmUgYW4gaXRlbSBmcm9tIHRoZSBleHByZXNzaW9uIHN0YWNrXG4gICAgLy8gaWYgXCJmdW5jdGlvblwiIG9yIFwiY2xhc3NcIiBpcyBwYXJzZWQgYXMgaWRlbnRpZmllciAoaW4gb2JqZWN0cyBlLmcuKSwgd2hpY2ggc2hvdWxkIG5vdCBoYXBwZW4gaGVyZS5cbiAgICB0aGlzLm5leHQoKTsgLy8gZWF0IGBmdW5jdGlvbmBcblxuICAgIGlmICh0aGlzLnByb2RQYXJhbS5oYXNZaWVsZCAmJiB0aGlzLm1hdGNoKHR0LmRvdCkpIHtcbiAgICAgIGNvbnN0IG1ldGEgPSB0aGlzLmNyZWF0ZUlkZW50aWZpZXIoXG4gICAgICAgIHRoaXMuc3RhcnROb2RlQXROb2RlKG5vZGUpLFxuICAgICAgICBcImZ1bmN0aW9uXCIsXG4gICAgICApO1xuICAgICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBgLmBcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlTWV0YVByb3BlcnR5KG5vZGUsIG1ldGEsIFwic2VudFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGFyc2VGdW5jdGlvbihub2RlKTtcbiAgfVxuXG4gIHBhcnNlTWV0YVByb3BlcnR5KFxuICAgIG5vZGU6IE4uTWV0YVByb3BlcnR5LFxuICAgIG1ldGE6IE4uSWRlbnRpZmllcixcbiAgICBwcm9wZXJ0eU5hbWU6IHN0cmluZyxcbiAgKTogTi5NZXRhUHJvcGVydHkge1xuICAgIG5vZGUubWV0YSA9IG1ldGE7XG5cbiAgICBpZiAobWV0YS5uYW1lID09PSBcImZ1bmN0aW9uXCIgJiYgcHJvcGVydHlOYW1lID09PSBcInNlbnRcIikge1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZnVuY3Rpb24uc2VudCNzeW50YXgtMVxuICAgICAgaWYgKHRoaXMuaXNDb250ZXh0dWFsKHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgdGhpcy5leHBlY3RQbHVnaW4oXCJmdW5jdGlvblNlbnRcIik7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc1BsdWdpbihcImZ1bmN0aW9uU2VudFwiKSkge1xuICAgICAgICAvLyBUaGUgY29kZSB3YXNuJ3QgYGZ1bmN0aW9uLnNlbnRgIGJ1dCBqdXN0IGBmdW5jdGlvbi5gLCBzbyBhIHNpbXBsZSBlcnJvciBpcyBsZXNzIGNvbmZ1c2luZy5cbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbnNFc2MgPSB0aGlzLnN0YXRlLmNvbnRhaW5zRXNjO1xuXG4gICAgbm9kZS5wcm9wZXJ0eSA9IHRoaXMucGFyc2VJZGVudGlmaWVyKHRydWUpO1xuXG4gICAgaWYgKG5vZGUucHJvcGVydHkubmFtZSAhPT0gcHJvcGVydHlOYW1lIHx8IGNvbnRhaW5zRXNjKSB7XG4gICAgICB0aGlzLnJhaXNlKFxuICAgICAgICBub2RlLnByb3BlcnR5LnN0YXJ0LFxuICAgICAgICBFcnJvcnMuVW5zdXBwb3J0ZWRNZXRhUHJvcGVydHksXG4gICAgICAgIG1ldGEubmFtZSxcbiAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiTWV0YVByb3BlcnR5XCIpO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtSW1wb3J0TWV0YVxuICBwYXJzZUltcG9ydE1ldGFQcm9wZXJ0eShub2RlOiBOLk1ldGFQcm9wZXJ0eSk6IE4uTWV0YVByb3BlcnR5IHtcbiAgICBjb25zdCBpZCA9IHRoaXMuY3JlYXRlSWRlbnRpZmllcih0aGlzLnN0YXJ0Tm9kZUF0Tm9kZShub2RlKSwgXCJpbXBvcnRcIik7XG4gICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBgLmBcblxuICAgIGlmICh0aGlzLmlzQ29udGV4dHVhbChcIm1ldGFcIikpIHtcbiAgICAgIGlmICghdGhpcy5pbk1vZHVsZSkge1xuICAgICAgICB0aGlzLnJhaXNlKGlkLnN0YXJ0LCBTb3VyY2VUeXBlTW9kdWxlRXJyb3JzLkltcG9ydE1ldGFPdXRzaWRlTW9kdWxlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2F3VW5hbWJpZ3VvdXNFU00gPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcnNlTWV0YVByb3BlcnR5KG5vZGUsIGlkLCBcIm1ldGFcIik7XG4gIH1cblxuICBwYXJzZUxpdGVyYWxBdE5vZGU8VDogTi5Ob2RlPihcbiAgICB2YWx1ZTogYW55LFxuICAgIHR5cGU6ICRFbGVtZW50VHlwZTxULCBcInR5cGVcIj4sXG4gICAgbm9kZTogYW55LFxuICApOiBUIHtcbiAgICB0aGlzLmFkZEV4dHJhKG5vZGUsIFwicmF3VmFsdWVcIiwgdmFsdWUpO1xuICAgIHRoaXMuYWRkRXh0cmEobm9kZSwgXCJyYXdcIiwgdGhpcy5pbnB1dC5zbGljZShub2RlLnN0YXJ0LCB0aGlzLnN0YXRlLmVuZCkpO1xuICAgIG5vZGUudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLm5leHQoKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlPFQ+KG5vZGUsIHR5cGUpO1xuICB9XG5cbiAgcGFyc2VMaXRlcmFsPFQ6IE4uTm9kZT4odmFsdWU6IGFueSwgdHlwZTogJEVsZW1lbnRUeXBlPFQsIFwidHlwZVwiPik6IFQge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbEF0Tm9kZSh2YWx1ZSwgdHlwZSwgbm9kZSk7XG4gIH1cblxuICBwYXJzZVN0cmluZ0xpdGVyYWwodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbDxOLlN0cmluZ0xpdGVyYWw+KHZhbHVlLCBcIlN0cmluZ0xpdGVyYWxcIik7XG4gIH1cblxuICBwYXJzZU51bWVyaWNMaXRlcmFsKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZUxpdGVyYWw8Ti5OdW1lcmljTGl0ZXJhbD4odmFsdWUsIFwiTnVtZXJpY0xpdGVyYWxcIik7XG4gIH1cblxuICBwYXJzZUJpZ0ludExpdGVyYWwodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlTGl0ZXJhbDxOLkJpZ0ludExpdGVyYWw+KHZhbHVlLCBcIkJpZ0ludExpdGVyYWxcIik7XG4gIH1cblxuICBwYXJzZURlY2ltYWxMaXRlcmFsKHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZUxpdGVyYWw8Ti5EZWNpbWFsTGl0ZXJhbD4odmFsdWUsIFwiRGVjaW1hbExpdGVyYWxcIik7XG4gIH1cblxuICBwYXJzZVJlZ0V4cExpdGVyYWwodmFsdWU6IHsgdmFsdWU6IGFueSwgcGF0dGVybjogc3RyaW5nLCBmbGFnczogc3RyaW5nIH0pIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5wYXJzZUxpdGVyYWw8Ti5SZWdFeHBMaXRlcmFsPihcbiAgICAgIHZhbHVlLnZhbHVlLFxuICAgICAgXCJSZWdFeHBMaXRlcmFsXCIsXG4gICAgKTtcbiAgICBub2RlLnBhdHRlcm4gPSB2YWx1ZS5wYXR0ZXJuO1xuICAgIG5vZGUuZmxhZ3MgPSB2YWx1ZS5mbGFncztcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHBhcnNlQm9vbGVhbkxpdGVyYWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICBub2RlLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZTxOLkJvb2xlYW5MaXRlcmFsPihub2RlLCBcIkJvb2xlYW5MaXRlcmFsXCIpO1xuICB9XG5cbiAgcGFyc2VOdWxsTGl0ZXJhbCgpIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICB0aGlzLm5leHQoKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlPE4uTnVsbExpdGVyYWw+KG5vZGUsIFwiTnVsbExpdGVyYWxcIik7XG4gIH1cblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1Db3ZlclBhcmVudGhlc2l6ZWRFeHByZXNzaW9uQW5kQXJyb3dQYXJhbWV0ZXJMaXN0XG4gIHBhcnNlUGFyZW5BbmREaXN0aW5ndWlzaEV4cHJlc3Npb24oY2FuQmVBcnJvdzogYm9vbGVhbik6IE4uRXhwcmVzc2lvbiB7XG4gICAgY29uc3Qgc3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgIGNvbnN0IHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5zdGFydExvYztcblxuICAgIGxldCB2YWw7XG4gICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBgKGBcbiAgICB0aGlzLmV4cHJlc3Npb25TY29wZS5lbnRlcihuZXdBcnJvd0hlYWRTY29wZSgpKTtcblxuICAgIGNvbnN0IG9sZE1heWJlSW5BcnJvd1BhcmFtZXRlcnMgPSB0aGlzLnN0YXRlLm1heWJlSW5BcnJvd1BhcmFtZXRlcnM7XG4gICAgY29uc3Qgb2xkSW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHkgPSB0aGlzLnN0YXRlLmluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5O1xuICAgIHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyA9IHRydWU7XG4gICAgdGhpcy5zdGF0ZS5pbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keSA9IGZhbHNlO1xuXG4gICAgY29uc3QgaW5uZXJTdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgY29uc3QgaW5uZXJTdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgY29uc3QgZXhwckxpc3QgPSBbXTtcbiAgICBjb25zdCByZWZFeHByZXNzaW9uRXJyb3JzID0gbmV3IEV4cHJlc3Npb25FcnJvcnMoKTtcbiAgICBsZXQgZmlyc3QgPSB0cnVlO1xuICAgIGxldCBzcHJlYWRTdGFydDtcbiAgICBsZXQgb3B0aW9uYWxDb21tYVN0YXJ0O1xuXG4gICAgd2hpbGUgKCF0aGlzLm1hdGNoKHR0LnBhcmVuUikpIHtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5leHBlY3QoXG4gICAgICAgICAgdHQuY29tbWEsXG4gICAgICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycy5vcHRpb25hbFBhcmFtZXRlcnMgPT09IC0xXG4gICAgICAgICAgICA/IG51bGxcbiAgICAgICAgICAgIDogcmVmRXhwcmVzc2lvbkVycm9ycy5vcHRpb25hbFBhcmFtZXRlcnMsXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnBhcmVuUikpIHtcbiAgICAgICAgICBvcHRpb25hbENvbW1hU3RhcnQgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm1hdGNoKHR0LmVsbGlwc2lzKSkge1xuICAgICAgICBjb25zdCBzcHJlYWROb2RlU3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgICBjb25zdCBzcHJlYWROb2RlU3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgICAgICBzcHJlYWRTdGFydCA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICAgIGV4cHJMaXN0LnB1c2goXG4gICAgICAgICAgdGhpcy5wYXJzZVBhcmVuSXRlbShcbiAgICAgICAgICAgIHRoaXMucGFyc2VSZXN0QmluZGluZygpLFxuICAgICAgICAgICAgc3ByZWFkTm9kZVN0YXJ0UG9zLFxuICAgICAgICAgICAgc3ByZWFkTm9kZVN0YXJ0TG9jLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jaGVja0NvbW1hQWZ0ZXJSZXN0KGNoYXJDb2Rlcy5yaWdodFBhcmVudGhlc2lzKTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4cHJMaXN0LnB1c2goXG4gICAgICAgICAgdGhpcy5wYXJzZU1heWJlQXNzaWduQWxsb3dJbihcbiAgICAgICAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnMsXG4gICAgICAgICAgICB0aGlzLnBhcnNlUGFyZW5JdGVtLFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJFbmRQb3MgPSB0aGlzLnN0YXRlLmxhc3RUb2tFbmQ7XG4gICAgY29uc3QgaW5uZXJFbmRMb2MgPSB0aGlzLnN0YXRlLmxhc3RUb2tFbmRMb2M7XG4gICAgdGhpcy5leHBlY3QodHQucGFyZW5SKTtcblxuICAgIHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyA9IG9sZE1heWJlSW5BcnJvd1BhcmFtZXRlcnM7XG4gICAgdGhpcy5zdGF0ZS5pbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keSA9IG9sZEluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5O1xuXG4gICAgbGV0IGFycm93Tm9kZSA9IHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICBpZiAoXG4gICAgICBjYW5CZUFycm93ICYmXG4gICAgICB0aGlzLnNob3VsZFBhcnNlQXJyb3coKSAmJlxuICAgICAgKGFycm93Tm9kZSA9IHRoaXMucGFyc2VBcnJvdyhhcnJvd05vZGUpKVxuICAgICkge1xuICAgICAgdGhpcy5leHByZXNzaW9uU2NvcGUudmFsaWRhdGVBc1BhdHRlcm4oKTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvblNjb3BlLmV4aXQoKTtcbiAgICAgIHRoaXMucGFyc2VBcnJvd0V4cHJlc3Npb24oYXJyb3dOb2RlLCBleHByTGlzdCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGFycm93Tm9kZTtcbiAgICB9XG4gICAgdGhpcy5leHByZXNzaW9uU2NvcGUuZXhpdCgpO1xuXG4gICAgaWYgKCFleHByTGlzdC5sZW5ndGgpIHtcbiAgICAgIHRoaXMudW5leHBlY3RlZCh0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCk7XG4gICAgfVxuICAgIGlmIChvcHRpb25hbENvbW1hU3RhcnQpIHRoaXMudW5leHBlY3RlZChvcHRpb25hbENvbW1hU3RhcnQpO1xuICAgIGlmIChzcHJlYWRTdGFydCkgdGhpcy51bmV4cGVjdGVkKHNwcmVhZFN0YXJ0KTtcbiAgICB0aGlzLmNoZWNrRXhwcmVzc2lvbkVycm9ycyhyZWZFeHByZXNzaW9uRXJyb3JzLCB0cnVlKTtcblxuICAgIHRoaXMudG9SZWZlcmVuY2VkTGlzdERlZXAoZXhwckxpc3QsIC8qIGlzUGFyZW50aGVzaXplZEV4cHIgKi8gdHJ1ZSk7XG4gICAgaWYgKGV4cHJMaXN0Lmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhbCA9IHRoaXMuc3RhcnROb2RlQXQoaW5uZXJTdGFydFBvcywgaW5uZXJTdGFydExvYyk7XG4gICAgICB2YWwuZXhwcmVzc2lvbnMgPSBleHByTGlzdDtcbiAgICAgIHRoaXMuZmluaXNoTm9kZUF0KHZhbCwgXCJTZXF1ZW5jZUV4cHJlc3Npb25cIiwgaW5uZXJFbmRQb3MsIGlubmVyRW5kTG9jKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsID0gZXhwckxpc3RbMF07XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuY3JlYXRlUGFyZW50aGVzaXplZEV4cHJlc3Npb25zKSB7XG4gICAgICB0aGlzLmFkZEV4dHJhKHZhbCwgXCJwYXJlbnRoZXNpemVkXCIsIHRydWUpO1xuICAgICAgdGhpcy5hZGRFeHRyYSh2YWwsIFwicGFyZW5TdGFydFwiLCBzdGFydFBvcyk7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVuRXhwcmVzc2lvbiA9IHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKTtcbiAgICBwYXJlbkV4cHJlc3Npb24uZXhwcmVzc2lvbiA9IHZhbDtcbiAgICB0aGlzLmZpbmlzaE5vZGUocGFyZW5FeHByZXNzaW9uLCBcIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uXCIpO1xuICAgIHJldHVybiBwYXJlbkV4cHJlc3Npb247XG4gIH1cblxuICBzaG91bGRQYXJzZUFycm93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5jYW5JbnNlcnRTZW1pY29sb24oKTtcbiAgfVxuXG4gIHBhcnNlQXJyb3cobm9kZTogTi5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbik6ID9OLkFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICBpZiAodGhpcy5lYXQodHQuYXJyb3cpKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH1cblxuICBwYXJzZVBhcmVuSXRlbShcbiAgICBub2RlOiBOLkV4cHJlc3Npb24sXG4gICAgc3RhcnRQb3M6IG51bWJlciwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgIHN0YXJ0TG9jOiBQb3NpdGlvbiwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICApOiBOLkV4cHJlc3Npb24ge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcGFyc2VOZXdPck5ld1RhcmdldCgpOiBOLk5ld0V4cHJlc3Npb24gfCBOLk1ldGFQcm9wZXJ0eSB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgaWYgKHRoaXMubWF0Y2godHQuZG90KSkge1xuICAgICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtTmV3VGFyZ2V0XG4gICAgICBjb25zdCBtZXRhID0gdGhpcy5jcmVhdGVJZGVudGlmaWVyKHRoaXMuc3RhcnROb2RlQXROb2RlKG5vZGUpLCBcIm5ld1wiKTtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgY29uc3QgbWV0YVByb3AgPSB0aGlzLnBhcnNlTWV0YVByb3BlcnR5KG5vZGUsIG1ldGEsIFwidGFyZ2V0XCIpO1xuXG4gICAgICBpZiAoIXRoaXMuc2NvcGUuaW5Ob25BcnJvd0Z1bmN0aW9uICYmICF0aGlzLnNjb3BlLmluQ2xhc3MpIHtcbiAgICAgICAgdGhpcy5yYWlzZShtZXRhUHJvcC5zdGFydCwgRXJyb3JzLlVuZXhwZWN0ZWROZXdUYXJnZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWV0YVByb3A7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGFyc2VOZXcobm9kZSk7XG4gIH1cblxuICAvLyBOZXcncyBwcmVjZWRlbmNlIGlzIHNsaWdodGx5IHRyaWNreS4gSXQgbXVzdCBhbGxvdyBpdHMgYXJndW1lbnQgdG9cbiAgLy8gYmUgYSBgW11gIG9yIGRvdCBzdWJzY3JpcHQgZXhwcmVzc2lvbiwgYnV0IG5vdCBhIGNhbGwg4oCUIGF0IGxlYXN0LFxuICAvLyBub3Qgd2l0aG91dCB3cmFwcGluZyBpdCBpbiBwYXJlbnRoZXNlcy4gVGh1cywgaXQgdXNlcyB0aGUgbm9DYWxsc1xuICAvLyBhcmd1bWVudCB0byBwYXJzZVN1YnNjcmlwdHMgdG8gcHJldmVudCBpdCBmcm9tIGNvbnN1bWluZyB0aGVcbiAgLy8gYXJndW1lbnQgbGlzdC5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtTmV3RXhwcmVzc2lvblxuICBwYXJzZU5ldyhub2RlOiBOLkV4cHJlc3Npb24pOiBOLk5ld0V4cHJlc3Npb24ge1xuICAgIG5vZGUuY2FsbGVlID0gdGhpcy5wYXJzZU5vQ2FsbEV4cHIoKTtcbiAgICBpZiAobm9kZS5jYWxsZWUudHlwZSA9PT0gXCJJbXBvcnRcIikge1xuICAgICAgdGhpcy5yYWlzZShub2RlLmNhbGxlZS5zdGFydCwgRXJyb3JzLkltcG9ydENhbGxOb3ROZXdFeHByZXNzaW9uKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNPcHRpb25hbENoYWluKG5vZGUuY2FsbGVlKSkge1xuICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLmxhc3RUb2tFbmQsIEVycm9ycy5PcHRpb25hbENoYWluaW5nTm9OZXcpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5lYXQodHQucXVlc3Rpb25Eb3QpKSB7XG4gICAgICB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQsIEVycm9ycy5PcHRpb25hbENoYWluaW5nTm9OZXcpO1xuICAgIH1cblxuICAgIHRoaXMucGFyc2VOZXdBcmd1bWVudHMobm9kZSk7XG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIk5ld0V4cHJlc3Npb25cIik7XG4gIH1cblxuICBwYXJzZU5ld0FyZ3VtZW50cyhub2RlOiBOLk5ld0V4cHJlc3Npb24pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lYXQodHQucGFyZW5MKSkge1xuICAgICAgY29uc3QgYXJncyA9IHRoaXMucGFyc2VFeHByTGlzdCh0dC5wYXJlblIpO1xuICAgICAgdGhpcy50b1JlZmVyZW5jZWRMaXN0KGFyZ3MpO1xuICAgICAgLy8gJEZsb3dGaXhNZSAocGFyc2VFeHByTGlzdCBzaG91bGQgYmUgYWxsIG5vbi1udWxsIGluIHRoaXMgY2FzZSlcbiAgICAgIG5vZGUuYXJndW1lbnRzID0gYXJncztcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5hcmd1bWVudHMgPSBbXTtcbiAgICB9XG4gIH1cblxuICAvLyBQYXJzZSB0ZW1wbGF0ZSBleHByZXNzaW9uLlxuXG4gIHBhcnNlVGVtcGxhdGVFbGVtZW50KGlzVGFnZ2VkOiBib29sZWFuKTogTi5UZW1wbGF0ZUVsZW1lbnQge1xuICAgIGNvbnN0IGVsZW0gPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgIGlmICh0aGlzLnN0YXRlLnZhbHVlID09PSBudWxsKSB7XG4gICAgICBpZiAoIWlzVGFnZ2VkKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCArIDEsIEVycm9ycy5JbnZhbGlkRXNjYXBlU2VxdWVuY2VUZW1wbGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsZW0udmFsdWUgPSB7XG4gICAgICByYXc6IHRoaXMuaW5wdXRcbiAgICAgICAgLnNsaWNlKHRoaXMuc3RhdGUuc3RhcnQsIHRoaXMuc3RhdGUuZW5kKVxuICAgICAgICAucmVwbGFjZSgvXFxyXFxuPy9nLCBcIlxcblwiKSxcbiAgICAgIGNvb2tlZDogdGhpcy5zdGF0ZS52YWx1ZSxcbiAgICB9O1xuICAgIHRoaXMubmV4dCgpO1xuICAgIGVsZW0udGFpbCA9IHRoaXMubWF0Y2godHQuYmFja1F1b3RlKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKGVsZW0sIFwiVGVtcGxhdGVFbGVtZW50XCIpO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtVGVtcGxhdGVMaXRlcmFsXG4gIHBhcnNlVGVtcGxhdGUoaXNUYWdnZWQ6IGJvb2xlYW4pOiBOLlRlbXBsYXRlTGl0ZXJhbCB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgbm9kZS5leHByZXNzaW9ucyA9IFtdO1xuICAgIGxldCBjdXJFbHQgPSB0aGlzLnBhcnNlVGVtcGxhdGVFbGVtZW50KGlzVGFnZ2VkKTtcbiAgICBub2RlLnF1YXNpcyA9IFtjdXJFbHRdO1xuICAgIHdoaWxlICghY3VyRWx0LnRhaWwpIHtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LmRvbGxhckJyYWNlTCk7XG4gICAgICBub2RlLmV4cHJlc3Npb25zLnB1c2godGhpcy5wYXJzZVRlbXBsYXRlU3Vic3RpdHV0aW9uKCkpO1xuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2VSKTtcbiAgICAgIG5vZGUucXVhc2lzLnB1c2goKGN1ckVsdCA9IHRoaXMucGFyc2VUZW1wbGF0ZUVsZW1lbnQoaXNUYWdnZWQpKSk7XG4gICAgfVxuICAgIHRoaXMubmV4dCgpO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJUZW1wbGF0ZUxpdGVyYWxcIik7XG4gIH1cblxuICAvLyBUaGlzIGlzIG92ZXJ3cml0dGVuIGJ5IHRoZSBUeXBlU2NyaXB0IHBsdWdpbiB0byBwYXJzZSB0ZW1wbGF0ZSB0eXBlc1xuICBwYXJzZVRlbXBsYXRlU3Vic3RpdHV0aW9uKCk6IE4uRXhwcmVzc2lvbiB7XG4gICAgcmV0dXJuIHRoaXMucGFyc2VFeHByZXNzaW9uKCk7XG4gIH1cblxuICAvLyBQYXJzZSBhbiBvYmplY3QgbGl0ZXJhbCwgYmluZGluZyBwYXR0ZXJuLCBvciByZWNvcmQuXG5cbiAgcGFyc2VPYmplY3RMaWtlPFQ6IE4uT2JqZWN0UGF0dGVybiB8IE4uT2JqZWN0RXhwcmVzc2lvbj4oXG4gICAgY2xvc2U6IFRva2VuVHlwZSxcbiAgICBpc1BhdHRlcm46IGJvb2xlYW4sXG4gICAgaXNSZWNvcmQ/OiA/Ym9vbGVhbixcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzPzogP0V4cHJlc3Npb25FcnJvcnMsXG4gICk6IFQge1xuICAgIGlmIChpc1JlY29yZCkge1xuICAgICAgdGhpcy5leHBlY3RQbHVnaW4oXCJyZWNvcmRBbmRUdXBsZVwiKTtcbiAgICB9XG4gICAgY29uc3Qgb2xkSW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHkgPSB0aGlzLnN0YXRlLmluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5O1xuICAgIHRoaXMuc3RhdGUuaW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHkgPSBmYWxzZTtcbiAgICBjb25zdCBwcm9wSGFzaDogYW55ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBsZXQgZmlyc3QgPSB0cnVlO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuXG4gICAgbm9kZS5wcm9wZXJ0aWVzID0gW107XG4gICAgdGhpcy5uZXh0KCk7XG5cbiAgICB3aGlsZSAoIXRoaXMubWF0Y2goY2xvc2UpKSB7XG4gICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXhwZWN0KHR0LmNvbW1hKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2goY2xvc2UpKSB7XG4gICAgICAgICAgdGhpcy5hZGRFeHRyYShub2RlLCBcInRyYWlsaW5nQ29tbWFcIiwgdGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByb3AgPSB0aGlzLnBhcnNlUHJvcGVydHlEZWZpbml0aW9uKGlzUGF0dGVybiwgcmVmRXhwcmVzc2lvbkVycm9ycyk7XG4gICAgICBpZiAoIWlzUGF0dGVybikge1xuICAgICAgICAvLyAkRmxvd0lnbm9yZSBSZXN0RWxlbWVudCB3aWxsIG5ldmVyIGJlIHJldHVybmVkIGlmICFpc1BhdHRlcm5cbiAgICAgICAgdGhpcy5jaGVja1Byb3RvKHByb3AsIGlzUmVjb3JkLCBwcm9wSGFzaCwgcmVmRXhwcmVzc2lvbkVycm9ycyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgaXNSZWNvcmQgJiZcbiAgICAgICAgIXRoaXMuaXNPYmplY3RQcm9wZXJ0eShwcm9wKSAmJlxuICAgICAgICBwcm9wLnR5cGUgIT09IFwiU3ByZWFkRWxlbWVudFwiXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yYWlzZShwcm9wLnN0YXJ0LCBFcnJvcnMuSW52YWxpZFJlY29yZFByb3BlcnR5KTtcbiAgICAgIH1cblxuICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgIGlmIChwcm9wLnNob3J0aGFuZCkge1xuICAgICAgICB0aGlzLmFkZEV4dHJhKHByb3AsIFwic2hvcnRoYW5kXCIsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBub2RlLnByb3BlcnRpZXMucHVzaChwcm9wKTtcbiAgICB9XG5cbiAgICB0aGlzLm5leHQoKTtcblxuICAgIHRoaXMuc3RhdGUuaW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHkgPSBvbGRJbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keTtcbiAgICBsZXQgdHlwZSA9IFwiT2JqZWN0RXhwcmVzc2lvblwiO1xuICAgIGlmIChpc1BhdHRlcm4pIHtcbiAgICAgIHR5cGUgPSBcIk9iamVjdFBhdHRlcm5cIjtcbiAgICB9IGVsc2UgaWYgKGlzUmVjb3JkKSB7XG4gICAgICB0eXBlID0gXCJSZWNvcmRFeHByZXNzaW9uXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgdHlwZSk7XG4gIH1cblxuICAvLyBDaGVjayBncmFtbWFyIHByb2R1Y3Rpb246XG4gIC8vICAgSWRlbnRpZmllck5hbWUgKl9vcHQgUHJvcGVydHlOYW1lXG4gIC8vIEl0IGlzIHVzZWQgaW4gYHBhcnNlUHJvcGVydHlEZWZpbml0aW9uYCB0byBkZXRlY3QgQXN5bmNNZXRob2QgYW5kIEFjY2Vzc29yc1xuICBtYXliZUFzeW5jT3JBY2Nlc3NvclByb3AocHJvcDogTi5PYmplY3RQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAhcHJvcC5jb21wdXRlZCAmJlxuICAgICAgcHJvcC5rZXkudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIgJiZcbiAgICAgICh0aGlzLmlzTGl0ZXJhbFByb3BlcnR5TmFtZSgpIHx8XG4gICAgICAgIHRoaXMubWF0Y2godHQuYnJhY2tldEwpIHx8XG4gICAgICAgIHRoaXMubWF0Y2godHQuc3RhcikpXG4gICAgKTtcbiAgfVxuXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLVByb3BlcnR5RGVmaW5pdGlvblxuICBwYXJzZVByb3BlcnR5RGVmaW5pdGlvbihcbiAgICBpc1BhdHRlcm46IGJvb2xlYW4sXG4gICAgcmVmRXhwcmVzc2lvbkVycm9ycz86ID9FeHByZXNzaW9uRXJyb3JzLFxuICApOiBOLk9iamVjdE1lbWJlciB8IE4uU3ByZWFkRWxlbWVudCB8IE4uUmVzdEVsZW1lbnQge1xuICAgIGxldCBkZWNvcmF0b3JzID0gW107XG4gICAgaWYgKHRoaXMubWF0Y2godHQuYXQpKSB7XG4gICAgICBpZiAodGhpcy5oYXNQbHVnaW4oXCJkZWNvcmF0b3JzXCIpKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlVuc3VwcG9ydGVkUHJvcGVydHlEZWNvcmF0b3IpO1xuICAgICAgfVxuXG4gICAgICAvLyB3ZSBuZWVkbid0IGNoZWNrIGlmIGRlY29yYXRvcnMgKHN0YWdlIDApIHBsdWdpbiBpcyBlbmFibGVkIHNpbmNlIGl0J3MgY2hlY2tlZCBieVxuICAgICAgLy8gdGhlIGNhbGwgdG8gdGhpcy5wYXJzZURlY29yYXRvclxuICAgICAgd2hpbGUgKHRoaXMubWF0Y2godHQuYXQpKSB7XG4gICAgICAgIGRlY29yYXRvcnMucHVzaCh0aGlzLnBhcnNlRGVjb3JhdG9yKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHByb3AgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgIGxldCBpc0dlbmVyYXRvciA9IGZhbHNlO1xuICAgIGxldCBpc0FzeW5jID0gZmFsc2U7XG4gICAgbGV0IGlzQWNjZXNzb3IgPSBmYWxzZTtcbiAgICBsZXQgc3RhcnRQb3M7XG4gICAgbGV0IHN0YXJ0TG9jO1xuXG4gICAgaWYgKHRoaXMubWF0Y2godHQuZWxsaXBzaXMpKSB7XG4gICAgICBpZiAoZGVjb3JhdG9ycy5sZW5ndGgpIHRoaXMudW5leHBlY3RlZCgpO1xuICAgICAgaWYgKGlzUGF0dGVybikge1xuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgLy8gRG9uJ3QgdXNlIHBhcnNlUmVzdEJpbmRpbmcoKSBhcyB3ZSBvbmx5IGFsbG93IElkZW50aWZpZXIgaGVyZS5cbiAgICAgICAgcHJvcC5hcmd1bWVudCA9IHRoaXMucGFyc2VJZGVudGlmaWVyKCk7XG4gICAgICAgIHRoaXMuY2hlY2tDb21tYUFmdGVyUmVzdChjaGFyQ29kZXMucmlnaHRDdXJseUJyYWNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShwcm9wLCBcIlJlc3RFbGVtZW50XCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5wYXJzZVNwcmVhZCgpO1xuICAgIH1cblxuICAgIGlmIChkZWNvcmF0b3JzLmxlbmd0aCkge1xuICAgICAgcHJvcC5kZWNvcmF0b3JzID0gZGVjb3JhdG9ycztcbiAgICAgIGRlY29yYXRvcnMgPSBbXTtcbiAgICB9XG5cbiAgICBwcm9wLm1ldGhvZCA9IGZhbHNlO1xuXG4gICAgaWYgKGlzUGF0dGVybiB8fCByZWZFeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgfVxuXG4gICAgaWYgKCFpc1BhdHRlcm4pIHtcbiAgICAgIGlzR2VuZXJhdG9yID0gdGhpcy5lYXQodHQuc3Rhcik7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbnNFc2MgPSB0aGlzLnN0YXRlLmNvbnRhaW5zRXNjO1xuICAgIGNvbnN0IGtleSA9IHRoaXMucGFyc2VQcm9wZXJ0eU5hbWUocHJvcCwgLyogaXNQcml2YXRlTmFtZUFsbG93ZWQgKi8gZmFsc2UpO1xuXG4gICAgaWYgKFxuICAgICAgIWlzUGF0dGVybiAmJlxuICAgICAgIWlzR2VuZXJhdG9yICYmXG4gICAgICAhY29udGFpbnNFc2MgJiZcbiAgICAgIHRoaXMubWF5YmVBc3luY09yQWNjZXNzb3JQcm9wKHByb3ApXG4gICAgKSB7XG4gICAgICBjb25zdCBrZXlOYW1lID0ga2V5Lm5hbWU7XG4gICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1Bc3luY01ldGhvZFxuICAgICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtQXN5bmNHZW5lcmF0b3JNZXRob2RcbiAgICAgIGlmIChrZXlOYW1lID09PSBcImFzeW5jXCIgJiYgIXRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKCkpIHtcbiAgICAgICAgaXNBc3luYyA9IHRydWU7XG4gICAgICAgIGlzR2VuZXJhdG9yID0gdGhpcy5lYXQodHQuc3Rhcik7XG4gICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0eU5hbWUocHJvcCwgLyogaXNQcml2YXRlTmFtZUFsbG93ZWQgKi8gZmFsc2UpO1xuICAgICAgfVxuICAgICAgLy8gZ2V0IFByb3BlcnR5TmFtZVs/WWllbGQsID9Bd2FpdF0gKCkgeyBGdW5jdGlvbkJvZHlbfllpZWxkLCB+QXdhaXRdIH1cbiAgICAgIC8vIHNldCBQcm9wZXJ0eU5hbWVbP1lpZWxkLCA/QXdhaXRdICggUHJvcGVydHlTZXRQYXJhbWV0ZXJMaXN0ICkgeyBGdW5jdGlvbkJvZHlbfllpZWxkLCB+QXdhaXRdIH1cbiAgICAgIGlmIChrZXlOYW1lID09PSBcImdldFwiIHx8IGtleU5hbWUgPT09IFwic2V0XCIpIHtcbiAgICAgICAgaXNBY2Nlc3NvciA9IHRydWU7XG4gICAgICAgIHByb3Aua2luZCA9IGtleU5hbWU7XG4gICAgICAgIGlmICh0aGlzLm1hdGNoKHR0LnN0YXIpKSB7XG4gICAgICAgICAgaXNHZW5lcmF0b3IgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5wb3MsIEVycm9ycy5BY2Nlc3NvcklzR2VuZXJhdG9yLCBrZXlOYW1lKTtcbiAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcnNlUHJvcGVydHlOYW1lKHByb3AsIC8qIGlzUHJpdmF0ZU5hbWVBbGxvd2VkICovIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhcnNlT2JqUHJvcFZhbHVlKFxuICAgICAgcHJvcCxcbiAgICAgIHN0YXJ0UG9zLFxuICAgICAgc3RhcnRMb2MsXG4gICAgICBpc0dlbmVyYXRvcixcbiAgICAgIGlzQXN5bmMsXG4gICAgICBpc1BhdHRlcm4sXG4gICAgICBpc0FjY2Vzc29yLFxuICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycyxcbiAgICApO1xuXG4gICAgcmV0dXJuIHByb3A7XG4gIH1cblxuICBnZXRHZXR0ZXJTZXR0ZXJFeHBlY3RlZFBhcmFtQ291bnQoXG4gICAgbWV0aG9kOiBOLk9iamVjdE1ldGhvZCB8IE4uQ2xhc3NNZXRob2QsXG4gICk6IG51bWJlciB7XG4gICAgcmV0dXJuIG1ldGhvZC5raW5kID09PSBcImdldFwiID8gMCA6IDE7XG4gIH1cblxuICAvLyBUaGlzIGV4aXN0cyBzbyB3ZSBjYW4gb3ZlcnJpZGUgd2l0aGluIHRoZSBFU1RyZWUgcGx1Z2luXG4gIGdldE9iamVjdE9yQ2xhc3NNZXRob2RQYXJhbXMobWV0aG9kOiBOLk9iamVjdE1ldGhvZCB8IE4uQ2xhc3NNZXRob2QpIHtcbiAgICByZXR1cm4gbWV0aG9kLnBhcmFtcztcbiAgfVxuXG4gIC8vIGdldCBtZXRob2RzIGFyZW4ndCBhbGxvd2VkIHRvIGhhdmUgYW55IHBhcmFtZXRlcnNcbiAgLy8gc2V0IG1ldGhvZHMgbXVzdCBoYXZlIGV4YWN0bHkgMSBwYXJhbWV0ZXIgd2hpY2ggaXMgbm90IGEgcmVzdCBwYXJhbWV0ZXJcbiAgY2hlY2tHZXR0ZXJTZXR0ZXJQYXJhbXMobWV0aG9kOiBOLk9iamVjdE1ldGhvZCB8IE4uQ2xhc3NNZXRob2QpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJhbUNvdW50ID0gdGhpcy5nZXRHZXR0ZXJTZXR0ZXJFeHBlY3RlZFBhcmFtQ291bnQobWV0aG9kKTtcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmdldE9iamVjdE9yQ2xhc3NNZXRob2RQYXJhbXMobWV0aG9kKTtcblxuICAgIGNvbnN0IHN0YXJ0ID0gbWV0aG9kLnN0YXJ0O1xuXG4gICAgaWYgKHBhcmFtcy5sZW5ndGggIT09IHBhcmFtQ291bnQpIHtcbiAgICAgIGlmIChtZXRob2Qua2luZCA9PT0gXCJnZXRcIikge1xuICAgICAgICB0aGlzLnJhaXNlKHN0YXJ0LCBFcnJvcnMuQmFkR2V0dGVyQXJpdHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yYWlzZShzdGFydCwgRXJyb3JzLkJhZFNldHRlckFyaXR5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBtZXRob2Qua2luZCA9PT0gXCJzZXRcIiAmJlxuICAgICAgcGFyYW1zW3BhcmFtcy5sZW5ndGggLSAxXT8udHlwZSA9PT0gXCJSZXN0RWxlbWVudFwiXG4gICAgKSB7XG4gICAgICB0aGlzLnJhaXNlKHN0YXJ0LCBFcnJvcnMuQmFkU2V0dGVyUmVzdFBhcmFtZXRlcik7XG4gICAgfVxuICB9XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtTWV0aG9kRGVmaW5pdGlvblxuICBwYXJzZU9iamVjdE1ldGhvZChcbiAgICBwcm9wOiBOLk9iamVjdE1ldGhvZCxcbiAgICBpc0dlbmVyYXRvcjogYm9vbGVhbixcbiAgICBpc0FzeW5jOiBib29sZWFuLFxuICAgIGlzUGF0dGVybjogYm9vbGVhbixcbiAgICBpc0FjY2Vzc29yOiBib29sZWFuLFxuICApOiA/Ti5PYmplY3RNZXRob2Qge1xuICAgIGlmIChpc0FjY2Vzc29yKSB7XG4gICAgICAvLyBpc0FjY2Vzc29yIGltcGxpZXMgaXNBc3luYzogZmFsc2UsIGlzUGF0dGVybjogZmFsc2UsIGlzR2VuZXJhdG9yOiBmYWxzZVxuICAgICAgdGhpcy5wYXJzZU1ldGhvZChcbiAgICAgICAgcHJvcCxcbiAgICAgICAgLy8gVGhpcyBfc2hvdWxkXyBiZSBmYWxzZSwgYnV0IHdpdGggZXJyb3IgcmVjb3ZlcnksIHdlIGFsbG93IGl0IHRvIGJlXG4gICAgICAgIC8vIHNldCBmb3IgaW5mb3JtYXRpb25hbCBwdXJwb3Nlc1xuICAgICAgICBpc0dlbmVyYXRvcixcbiAgICAgICAgLyogaXNBc3luYyAqLyBmYWxzZSxcbiAgICAgICAgLyogaXNDb25zdHJ1Y3RvciAqLyBmYWxzZSxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIFwiT2JqZWN0TWV0aG9kXCIsXG4gICAgICApO1xuICAgICAgdGhpcy5jaGVja0dldHRlclNldHRlclBhcmFtcyhwcm9wKTtcbiAgICAgIHJldHVybiBwcm9wO1xuICAgIH1cblxuICAgIGlmIChpc0FzeW5jIHx8IGlzR2VuZXJhdG9yIHx8IHRoaXMubWF0Y2godHQucGFyZW5MKSkge1xuICAgICAgaWYgKGlzUGF0dGVybikgdGhpcy51bmV4cGVjdGVkKCk7XG4gICAgICBwcm9wLmtpbmQgPSBcIm1ldGhvZFwiO1xuICAgICAgcHJvcC5tZXRob2QgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXMucGFyc2VNZXRob2QoXG4gICAgICAgIHByb3AsXG4gICAgICAgIGlzR2VuZXJhdG9yLFxuICAgICAgICBpc0FzeW5jLFxuICAgICAgICAvKiBpc0NvbnN0cnVjdG9yICovIGZhbHNlLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgXCJPYmplY3RNZXRob2RcIixcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgYGlzUGF0dGVybmAgaXMgdHJ1ZSwgcGFyc2UgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtQmluZGluZ1Byb3BlcnR5XG4gIC8vIGVsc2UgaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtUHJvcGVydHlEZWZpbml0aW9uXG4gIHBhcnNlT2JqZWN0UHJvcGVydHkoXG4gICAgcHJvcDogTi5PYmplY3RQcm9wZXJ0eSxcbiAgICBzdGFydFBvczogP251bWJlcixcbiAgICBzdGFydExvYzogP1Bvc2l0aW9uLFxuICAgIGlzUGF0dGVybjogYm9vbGVhbixcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzOiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgKTogP04uT2JqZWN0UHJvcGVydHkge1xuICAgIHByb3Auc2hvcnRoYW5kID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5lYXQodHQuY29sb24pKSB7XG4gICAgICBwcm9wLnZhbHVlID0gaXNQYXR0ZXJuXG4gICAgICAgID8gdGhpcy5wYXJzZU1heWJlRGVmYXVsdCh0aGlzLnN0YXRlLnN0YXJ0LCB0aGlzLnN0YXRlLnN0YXJ0TG9jKVxuICAgICAgICA6IHRoaXMucGFyc2VNYXliZUFzc2lnbkFsbG93SW4ocmVmRXhwcmVzc2lvbkVycm9ycyk7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUocHJvcCwgXCJPYmplY3RQcm9wZXJ0eVwiKTtcbiAgICB9XG5cbiAgICBpZiAoIXByb3AuY29tcHV0ZWQgJiYgcHJvcC5rZXkudHlwZSA9PT0gXCJJZGVudGlmaWVyXCIpIHtcbiAgICAgIC8vIFByb3BlcnR5RGVmaW5pdGlvbjpcbiAgICAgIC8vICAgSWRlbnRpZmllclJlZmVyZW5jZVxuICAgICAgLy8gICBDb3ZlcmVkSW5pdGlhbGl6ZWROYW1lXG4gICAgICAvLyBOb3RlOiBgeyBldmFsIH0gPSB7fWAgd2lsbCBiZSBjaGVja2VkIGluIGBjaGVja0xWYWxgIGxhdGVyLlxuICAgICAgdGhpcy5jaGVja1Jlc2VydmVkV29yZChwcm9wLmtleS5uYW1lLCBwcm9wLmtleS5zdGFydCwgdHJ1ZSwgZmFsc2UpO1xuXG4gICAgICBpZiAoaXNQYXR0ZXJuKSB7XG4gICAgICAgIHByb3AudmFsdWUgPSB0aGlzLnBhcnNlTWF5YmVEZWZhdWx0KFxuICAgICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICAgIHN0YXJ0TG9jLFxuICAgICAgICAgIHByb3Aua2V5Ll9fY2xvbmUoKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5lcSkgJiYgcmVmRXhwcmVzc2lvbkVycm9ycykge1xuICAgICAgICBpZiAocmVmRXhwcmVzc2lvbkVycm9ycy5zaG9ydGhhbmRBc3NpZ24gPT09IC0xKSB7XG4gICAgICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycy5zaG9ydGhhbmRBc3NpZ24gPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHByb3AudmFsdWUgPSB0aGlzLnBhcnNlTWF5YmVEZWZhdWx0KFxuICAgICAgICAgIHN0YXJ0UG9zLFxuICAgICAgICAgIHN0YXJ0TG9jLFxuICAgICAgICAgIHByb3Aua2V5Ll9fY2xvbmUoKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3AudmFsdWUgPSBwcm9wLmtleS5fX2Nsb25lKCk7XG4gICAgICB9XG4gICAgICBwcm9wLnNob3J0aGFuZCA9IHRydWU7XG5cbiAgICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUocHJvcCwgXCJPYmplY3RQcm9wZXJ0eVwiKTtcbiAgICB9XG4gIH1cblxuICBwYXJzZU9ialByb3BWYWx1ZShcbiAgICBwcm9wOiBhbnksXG4gICAgc3RhcnRQb3M6ID9udW1iZXIsXG4gICAgc3RhcnRMb2M6ID9Qb3NpdGlvbixcbiAgICBpc0dlbmVyYXRvcjogYm9vbGVhbixcbiAgICBpc0FzeW5jOiBib29sZWFuLFxuICAgIGlzUGF0dGVybjogYm9vbGVhbixcbiAgICBpc0FjY2Vzc29yOiBib29sZWFuLFxuICAgIHJlZkV4cHJlc3Npb25FcnJvcnM/OiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgKTogdm9pZCB7XG4gICAgY29uc3Qgbm9kZSA9XG4gICAgICB0aGlzLnBhcnNlT2JqZWN0TWV0aG9kKFxuICAgICAgICBwcm9wLFxuICAgICAgICBpc0dlbmVyYXRvcixcbiAgICAgICAgaXNBc3luYyxcbiAgICAgICAgaXNQYXR0ZXJuLFxuICAgICAgICBpc0FjY2Vzc29yLFxuICAgICAgKSB8fFxuICAgICAgdGhpcy5wYXJzZU9iamVjdFByb3BlcnR5KFxuICAgICAgICBwcm9wLFxuICAgICAgICBzdGFydFBvcyxcbiAgICAgICAgc3RhcnRMb2MsXG4gICAgICAgIGlzUGF0dGVybixcbiAgICAgICAgcmVmRXhwcmVzc2lvbkVycm9ycyxcbiAgICAgICk7XG5cbiAgICBpZiAoIW5vZGUpIHRoaXMudW5leHBlY3RlZCgpO1xuXG4gICAgLy8gJEZsb3dGaXhNZVxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgcGFyc2VQcm9wZXJ0eU5hbWUoXG4gICAgcHJvcDogTi5PYmplY3RPckNsYXNzTWVtYmVyIHwgTi5DbGFzc01lbWJlciB8IE4uVHNOYW1lZFR5cGVFbGVtZW50QmFzZSxcbiAgICBpc1ByaXZhdGVOYW1lQWxsb3dlZDogYm9vbGVhbixcbiAgKTogTi5FeHByZXNzaW9uIHwgTi5JZGVudGlmaWVyIHtcbiAgICBpZiAodGhpcy5lYXQodHQuYnJhY2tldEwpKSB7XG4gICAgICAocHJvcDogJEZsb3dTdWJ0eXBlPE4uT2JqZWN0T3JDbGFzc01lbWJlcj4pLmNvbXB1dGVkID0gdHJ1ZTtcbiAgICAgIHByb3Aua2V5ID0gdGhpcy5wYXJzZU1heWJlQXNzaWduQWxsb3dJbigpO1xuICAgICAgdGhpcy5leHBlY3QodHQuYnJhY2tldFIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvbGRJblByb3BlcnR5TmFtZSA9IHRoaXMuc3RhdGUuaW5Qcm9wZXJ0eU5hbWU7XG4gICAgICB0aGlzLnN0YXRlLmluUHJvcGVydHlOYW1lID0gdHJ1ZTtcbiAgICAgIC8vIFdlIGNoZWNrIGlmIGl0J3MgdmFsaWQgZm9yIGl0IHRvIGJlIGEgcHJpdmF0ZSBuYW1lIHdoZW4gd2UgcHVzaCBpdC5cbiAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLnN0YXRlLnR5cGU7XG4gICAgICAocHJvcDogJEZsb3dGaXhNZSkua2V5ID1cbiAgICAgICAgdHlwZSA9PT0gdHQubnVtIHx8XG4gICAgICAgIHR5cGUgPT09IHR0LnN0cmluZyB8fFxuICAgICAgICB0eXBlID09PSB0dC5iaWdpbnQgfHxcbiAgICAgICAgdHlwZSA9PT0gdHQuZGVjaW1hbFxuICAgICAgICAgID8gdGhpcy5wYXJzZUV4cHJBdG9tKClcbiAgICAgICAgICA6IHRoaXMucGFyc2VNYXliZVByaXZhdGVOYW1lKGlzUHJpdmF0ZU5hbWVBbGxvd2VkKTtcblxuICAgICAgaWYgKHR5cGUgIT09IHR0LnByaXZhdGVOYW1lKSB7XG4gICAgICAgIC8vIENsYXNzUHJpdmF0ZVByb3BlcnR5IGlzIG5ldmVyIGNvbXB1dGVkLCBzbyB3ZSBkb24ndCBhc3NpZ24gaW4gdGhhdCBjYXNlLlxuICAgICAgICBwcm9wLmNvbXB1dGVkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhdGUuaW5Qcm9wZXJ0eU5hbWUgPSBvbGRJblByb3BlcnR5TmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvcC5rZXk7XG4gIH1cblxuICAvLyBJbml0aWFsaXplIGVtcHR5IGZ1bmN0aW9uIG5vZGUuXG5cbiAgaW5pdEZ1bmN0aW9uKG5vZGU6IE4uQm9kaWxlc3NGdW5jdGlvbk9yTWV0aG9kQmFzZSwgaXNBc3luYzogP2Jvb2xlYW4pOiB2b2lkIHtcbiAgICBub2RlLmlkID0gbnVsbDtcbiAgICBub2RlLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgIG5vZGUuYXN5bmMgPSAhIWlzQXN5bmM7XG4gIH1cblxuICAvLyBQYXJzZSBvYmplY3Qgb3IgY2xhc3MgbWV0aG9kLlxuXG4gIHBhcnNlTWV0aG9kPFQ6IE4uTWV0aG9kTGlrZT4oXG4gICAgbm9kZTogVCxcbiAgICBpc0dlbmVyYXRvcjogYm9vbGVhbixcbiAgICBpc0FzeW5jOiBib29sZWFuLFxuICAgIGlzQ29uc3RydWN0b3I6IGJvb2xlYW4sXG4gICAgYWxsb3dEaXJlY3RTdXBlcjogYm9vbGVhbixcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgaW5DbGFzc1Njb3BlOiBib29sZWFuID0gZmFsc2UsXG4gICk6IFQge1xuICAgIHRoaXMuaW5pdEZ1bmN0aW9uKG5vZGUsIGlzQXN5bmMpO1xuICAgIG5vZGUuZ2VuZXJhdG9yID0gISFpc0dlbmVyYXRvcjtcbiAgICBjb25zdCBhbGxvd01vZGlmaWVycyA9IGlzQ29uc3RydWN0b3I7IC8vIEZvciBUeXBlU2NyaXB0IHBhcmFtZXRlciBwcm9wZXJ0aWVzXG4gICAgdGhpcy5zY29wZS5lbnRlcihcbiAgICAgIFNDT1BFX0ZVTkNUSU9OIHxcbiAgICAgICAgU0NPUEVfU1VQRVIgfFxuICAgICAgICAoaW5DbGFzc1Njb3BlID8gU0NPUEVfQ0xBU1MgOiAwKSB8XG4gICAgICAgIChhbGxvd0RpcmVjdFN1cGVyID8gU0NPUEVfRElSRUNUX1NVUEVSIDogMCksXG4gICAgKTtcbiAgICB0aGlzLnByb2RQYXJhbS5lbnRlcihmdW5jdGlvbkZsYWdzKGlzQXN5bmMsIG5vZGUuZ2VuZXJhdG9yKSk7XG4gICAgdGhpcy5wYXJzZUZ1bmN0aW9uUGFyYW1zKChub2RlOiBhbnkpLCBhbGxvd01vZGlmaWVycyk7XG4gICAgdGhpcy5wYXJzZUZ1bmN0aW9uQm9keUFuZEZpbmlzaChub2RlLCB0eXBlLCB0cnVlKTtcbiAgICB0aGlzLnByb2RQYXJhbS5leGl0KCk7XG4gICAgdGhpcy5zY29wZS5leGl0KCk7XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIC8vIHBhcnNlIGFuIGFycmF5IGxpdGVyYWwgb3IgdHVwbGUgbGl0ZXJhbFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1BcnJheUxpdGVyYWxcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL3Byb3Bvc2FsLXJlY29yZC10dXBsZS8jcHJvZC1UdXBsZUxpdGVyYWxcbiAgcGFyc2VBcnJheUxpa2UoXG4gICAgY2xvc2U6IFRva2VuVHlwZSxcbiAgICBjYW5CZVBhdHRlcm46IGJvb2xlYW4sXG4gICAgaXNUdXBsZTogYm9vbGVhbixcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzOiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgKTogTi5BcnJheUV4cHJlc3Npb24gfCBOLlR1cGxlRXhwcmVzc2lvbiB7XG4gICAgaWYgKGlzVHVwbGUpIHtcbiAgICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwicmVjb3JkQW5kVHVwbGVcIik7XG4gICAgfVxuICAgIGNvbnN0IG9sZEluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5ID0gdGhpcy5zdGF0ZS5pbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keTtcbiAgICB0aGlzLnN0YXRlLmluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5ID0gZmFsc2U7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgbm9kZS5lbGVtZW50cyA9IHRoaXMucGFyc2VFeHByTGlzdChcbiAgICAgIGNsb3NlLFxuICAgICAgLyogYWxsb3dFbXB0eSAqLyAhaXNUdXBsZSxcbiAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnMsXG4gICAgICBub2RlLFxuICAgICk7XG4gICAgdGhpcy5zdGF0ZS5pbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keSA9IG9sZEluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5O1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUoXG4gICAgICBub2RlLFxuICAgICAgaXNUdXBsZSA/IFwiVHVwbGVFeHByZXNzaW9uXCIgOiBcIkFycmF5RXhwcmVzc2lvblwiLFxuICAgICk7XG4gIH1cblxuICAvLyBQYXJzZSBhcnJvdyBmdW5jdGlvbiBleHByZXNzaW9uLlxuICAvLyBJZiB0aGUgcGFyYW1ldGVycyBhcmUgcHJvdmlkZWQsIHRoZXkgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gYW5cbiAgLy8gYXNzaWduYWJsZSBsaXN0LlxuICBwYXJzZUFycm93RXhwcmVzc2lvbihcbiAgICBub2RlOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uLFxuICAgIHBhcmFtczogPyhOLkV4cHJlc3Npb25bXSksXG4gICAgaXNBc3luYzogYm9vbGVhbixcbiAgICB0cmFpbGluZ0NvbW1hUG9zOiA/bnVtYmVyLFxuICApOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICB0aGlzLnNjb3BlLmVudGVyKFNDT1BFX0ZVTkNUSU9OIHwgU0NPUEVfQVJST1cpO1xuICAgIGxldCBmbGFncyA9IGZ1bmN0aW9uRmxhZ3MoaXNBc3luYywgZmFsc2UpO1xuICAgIC8vIENvbmNpc2VCb2R5IGFuZCBBc3luY0NvbmNpc2VCb2R5IGluaGVyaXQgW0luXVxuICAgIGlmICghdGhpcy5tYXRjaCh0dC5icmFja2V0TCkgJiYgdGhpcy5wcm9kUGFyYW0uaGFzSW4pIHtcbiAgICAgIGZsYWdzIHw9IFBBUkFNX0lOO1xuICAgIH1cbiAgICB0aGlzLnByb2RQYXJhbS5lbnRlcihmbGFncyk7XG4gICAgdGhpcy5pbml0RnVuY3Rpb24obm9kZSwgaXNBc3luYyk7XG4gICAgY29uc3Qgb2xkTWF5YmVJbkFycm93UGFyYW1ldGVycyA9IHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycztcblxuICAgIGlmIChwYXJhbXMpIHtcbiAgICAgIHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyA9IHRydWU7XG4gICAgICB0aGlzLnNldEFycm93RnVuY3Rpb25QYXJhbWV0ZXJzKG5vZGUsIHBhcmFtcywgdHJhaWxpbmdDb21tYVBvcyk7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyA9IGZhbHNlO1xuICAgIHRoaXMucGFyc2VGdW5jdGlvbkJvZHkobm9kZSwgdHJ1ZSk7XG5cbiAgICB0aGlzLnByb2RQYXJhbS5leGl0KCk7XG4gICAgdGhpcy5zY29wZS5leGl0KCk7XG4gICAgdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gb2xkTWF5YmVJbkFycm93UGFyYW1ldGVycztcblxuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvblwiKTtcbiAgfVxuXG4gIHNldEFycm93RnVuY3Rpb25QYXJhbWV0ZXJzKFxuICAgIG5vZGU6IE4uQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24sXG4gICAgcGFyYW1zOiBOLkV4cHJlc3Npb25bXSxcbiAgICB0cmFpbGluZ0NvbW1hUG9zOiA/bnVtYmVyLFxuICApOiB2b2lkIHtcbiAgICBub2RlLnBhcmFtcyA9IHRoaXMudG9Bc3NpZ25hYmxlTGlzdChwYXJhbXMsIHRyYWlsaW5nQ29tbWFQb3MsIGZhbHNlKTtcbiAgfVxuXG4gIHBhcnNlRnVuY3Rpb25Cb2R5QW5kRmluaXNoKFxuICAgIG5vZGU6IE4uQm9kaWxlc3NGdW5jdGlvbk9yTWV0aG9kQmFzZSxcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgaXNNZXRob2Q/OiBib29sZWFuID0gZmFsc2UsXG4gICk6IHZvaWQge1xuICAgIC8vICRGbG93SWdub3JlIChub2RlIGlzIG5vdCBib2RpbGVzcyBpZiB3ZSBnZXQgaGVyZSlcbiAgICB0aGlzLnBhcnNlRnVuY3Rpb25Cb2R5KG5vZGUsIGZhbHNlLCBpc01ldGhvZCk7XG4gICAgdGhpcy5maW5pc2hOb2RlKG5vZGUsIHR5cGUpO1xuICB9XG5cbiAgLy8gUGFyc2UgZnVuY3Rpb24gYm9keSBhbmQgY2hlY2sgcGFyYW1ldGVycy5cbiAgcGFyc2VGdW5jdGlvbkJvZHkoXG4gICAgbm9kZTogTi5GdW5jdGlvbixcbiAgICBhbGxvd0V4cHJlc3Npb246ID9ib29sZWFuLFxuICAgIGlzTWV0aG9kPzogYm9vbGVhbiA9IGZhbHNlLFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBpc0V4cHJlc3Npb24gPSBhbGxvd0V4cHJlc3Npb24gJiYgIXRoaXMubWF0Y2godHQuYnJhY2VMKTtcbiAgICB0aGlzLmV4cHJlc3Npb25TY29wZS5lbnRlcihuZXdFeHByZXNzaW9uU2NvcGUoKSk7XG5cbiAgICBpZiAoaXNFeHByZXNzaW9uKSB7XG4gICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1FeHByZXNzaW9uQm9keVxuICAgICAgbm9kZS5ib2R5ID0gdGhpcy5wYXJzZU1heWJlQXNzaWduKCk7XG4gICAgICB0aGlzLmNoZWNrUGFyYW1zKG5vZGUsIGZhbHNlLCBhbGxvd0V4cHJlc3Npb24sIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb2xkU3RyaWN0ID0gdGhpcy5zdGF0ZS5zdHJpY3Q7XG4gICAgICAvLyBTdGFydCBhIG5ldyBzY29wZSB3aXRoIHJlZ2FyZCB0byBsYWJlbHNcbiAgICAgIC8vIGZsYWcgKHJlc3RvcmUgdGhlbSB0byB0aGVpciBvbGQgdmFsdWUgYWZ0ZXJ3YXJkcykuXG4gICAgICBjb25zdCBvbGRMYWJlbHMgPSB0aGlzLnN0YXRlLmxhYmVscztcbiAgICAgIHRoaXMuc3RhdGUubGFiZWxzID0gW107XG5cbiAgICAgIC8vIEZ1bmN0aW9uQm9keVtZaWVsZCwgQXdhaXRdOlxuICAgICAgLy8gICBTdGF0ZW1lbnRMaXN0Wz9ZaWVsZCwgP0F3YWl0LCArUmV0dXJuXSBvcHRcbiAgICAgIHRoaXMucHJvZFBhcmFtLmVudGVyKHRoaXMucHJvZFBhcmFtLmN1cnJlbnRGbGFncygpIHwgUEFSQU1fUkVUVVJOKTtcbiAgICAgIG5vZGUuYm9keSA9IHRoaXMucGFyc2VCbG9jayhcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIC8vIFN0cmljdCBtb2RlIGZ1bmN0aW9uIGNoZWNrcyBhZnRlciB3ZSBwYXJzZSB0aGUgc3RhdGVtZW50cyBpbiB0aGUgZnVuY3Rpb24gYm9keS5cbiAgICAgICAgKGhhc1N0cmljdE1vZGVEaXJlY3RpdmU6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICBjb25zdCBub25TaW1wbGUgPSAhdGhpcy5pc1NpbXBsZVBhcmFtTGlzdChub2RlLnBhcmFtcyk7XG5cbiAgICAgICAgICBpZiAoaGFzU3RyaWN0TW9kZURpcmVjdGl2ZSAmJiBub25TaW1wbGUpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgbG9naWMgaXMgaGVyZSB0byBhbGlnbiB0aGUgZXJyb3IgbG9jYXRpb24gd2l0aCB0aGUgRVNUcmVlIHBsdWdpbi5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yUG9zID1cbiAgICAgICAgICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgICAgICAgICAgKG5vZGUua2luZCA9PT0gXCJtZXRob2RcIiB8fCBub2RlLmtpbmQgPT09IFwiY29uc3RydWN0b3JcIikgJiZcbiAgICAgICAgICAgICAgLy8gJEZsb3dJZ25vcmVcbiAgICAgICAgICAgICAgISFub2RlLmtleVxuICAgICAgICAgICAgICAgID8gbm9kZS5rZXkuZW5kXG4gICAgICAgICAgICAgICAgOiBub2RlLnN0YXJ0O1xuICAgICAgICAgICAgdGhpcy5yYWlzZShlcnJvclBvcywgRXJyb3JzLklsbGVnYWxMYW5ndWFnZU1vZGVEaXJlY3RpdmUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHN0cmljdE1vZGVDaGFuZ2VkID0gIW9sZFN0cmljdCAmJiB0aGlzLnN0YXRlLnN0cmljdDtcblxuICAgICAgICAgIC8vIEFkZCB0aGUgcGFyYW1zIHRvIHZhckRlY2xhcmVkTmFtZXMgdG8gZW5zdXJlIHRoYXQgYW4gZXJyb3IgaXMgdGhyb3duXG4gICAgICAgICAgLy8gaWYgYSBsZXQvY29uc3QgZGVjbGFyYXRpb24gaW4gdGhlIGZ1bmN0aW9uIGNsYXNoZXMgd2l0aCBvbmUgb2YgdGhlIHBhcmFtcy5cbiAgICAgICAgICB0aGlzLmNoZWNrUGFyYW1zKFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICF0aGlzLnN0YXRlLnN0cmljdCAmJiAhYWxsb3dFeHByZXNzaW9uICYmICFpc01ldGhvZCAmJiAhbm9uU2ltcGxlLFxuICAgICAgICAgICAgYWxsb3dFeHByZXNzaW9uLFxuICAgICAgICAgICAgc3RyaWN0TW9kZUNoYW5nZWQsXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vIEVuc3VyZSB0aGUgZnVuY3Rpb24gbmFtZSBpc24ndCBhIGZvcmJpZGRlbiBpZGVudGlmaWVyIGluIHN0cmljdCBtb2RlLCBlLmcuICdldmFsJ1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnN0cmljdCAmJiBub2RlLmlkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrTFZhbChcbiAgICAgICAgICAgICAgbm9kZS5pZCxcbiAgICAgICAgICAgICAgXCJmdW5jdGlvbiBuYW1lXCIsXG4gICAgICAgICAgICAgIEJJTkRfT1VUU0lERSxcbiAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIHN0cmljdE1vZGVDaGFuZ2VkLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgICAgdGhpcy5wcm9kUGFyYW0uZXhpdCgpO1xuICAgICAgdGhpcy5leHByZXNzaW9uU2NvcGUuZXhpdCgpO1xuICAgICAgdGhpcy5zdGF0ZS5sYWJlbHMgPSBvbGRMYWJlbHM7XG4gICAgfVxuICB9XG5cbiAgaXNTaW1wbGVQYXJhbUxpc3QoXG4gICAgcGFyYW1zOiAkUmVhZE9ubHlBcnJheTxOLlBhdHRlcm4gfCBOLlRTUGFyYW1ldGVyUHJvcGVydHk+LFxuICApOiBib29sZWFuIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcGFyYW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAocGFyYW1zW2ldLnR5cGUgIT09IFwiSWRlbnRpZmllclwiKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2hlY2tQYXJhbXMoXG4gICAgbm9kZTogTi5GdW5jdGlvbixcbiAgICBhbGxvd0R1cGxpY2F0ZXM6IGJvb2xlYW4sXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgaXNBcnJvd0Z1bmN0aW9uOiA/Ym9vbGVhbixcbiAgICBzdHJpY3RNb2RlQ2hhbmdlZD86IGJvb2xlYW4gPSB0cnVlLFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBjaGVja0NsYXNoZXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChjb25zdCBwYXJhbSBvZiBub2RlLnBhcmFtcykge1xuICAgICAgdGhpcy5jaGVja0xWYWwoXG4gICAgICAgIHBhcmFtLFxuICAgICAgICBcImZ1bmN0aW9uIHBhcmFtZXRlciBsaXN0XCIsXG4gICAgICAgIEJJTkRfVkFSLFxuICAgICAgICBhbGxvd0R1cGxpY2F0ZXMgPyBudWxsIDogY2hlY2tDbGFzaGVzLFxuICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgIHN0cmljdE1vZGVDaGFuZ2VkLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvLyBQYXJzZXMgYSBjb21tYS1zZXBhcmF0ZWQgbGlzdCBvZiBleHByZXNzaW9ucywgYW5kIHJldHVybnMgdGhlbSBhc1xuICAvLyBhbiBhcnJheS4gYGNsb3NlYCBpcyB0aGUgdG9rZW4gdHlwZSB0aGF0IGVuZHMgdGhlIGxpc3QsIGFuZFxuICAvLyBgYWxsb3dFbXB0eWAgY2FuIGJlIHR1cm5lZCBvbiB0byBhbGxvdyBzdWJzZXF1ZW50IGNvbW1hcyB3aXRoXG4gIC8vIG5vdGhpbmcgaW4gYmV0d2VlbiB0aGVtIHRvIGJlIHBhcnNlZCBhcyBgbnVsbGAgKHdoaWNoIGlzIG5lZWRlZFxuICAvLyBmb3IgYXJyYXkgbGl0ZXJhbHMpLlxuXG4gIHBhcnNlRXhwckxpc3QoXG4gICAgY2xvc2U6IFRva2VuVHlwZSxcbiAgICBhbGxvd0VtcHR5PzogYm9vbGVhbixcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzPzogP0V4cHJlc3Npb25FcnJvcnMsXG4gICAgbm9kZUZvckV4dHJhPzogP04uTm9kZSxcbiAgKTogJFJlYWRPbmx5QXJyYXk8P04uRXhwcmVzc2lvbj4ge1xuICAgIGNvbnN0IGVsdHMgPSBbXTtcbiAgICBsZXQgZmlyc3QgPSB0cnVlO1xuXG4gICAgd2hpbGUgKCF0aGlzLmVhdChjbG9zZSkpIHtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5leHBlY3QodHQuY29tbWEpO1xuICAgICAgICBpZiAodGhpcy5tYXRjaChjbG9zZSkpIHtcbiAgICAgICAgICBpZiAobm9kZUZvckV4dHJhKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEV4dHJhKFxuICAgICAgICAgICAgICBub2RlRm9yRXh0cmEsXG4gICAgICAgICAgICAgIFwidHJhaWxpbmdDb21tYVwiLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsdHMucHVzaCh0aGlzLnBhcnNlRXhwckxpc3RJdGVtKGFsbG93RW1wdHksIHJlZkV4cHJlc3Npb25FcnJvcnMpKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsdHM7XG4gIH1cblxuICBwYXJzZUV4cHJMaXN0SXRlbShcbiAgICBhbGxvd0VtcHR5OiA/Ym9vbGVhbixcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzPzogP0V4cHJlc3Npb25FcnJvcnMsXG4gICAgYWxsb3dQbGFjZWhvbGRlcjogP2Jvb2xlYW4sXG4gICk6ID9OLkV4cHJlc3Npb24ge1xuICAgIGxldCBlbHQ7XG4gICAgaWYgKHRoaXMubWF0Y2godHQuY29tbWEpKSB7XG4gICAgICBpZiAoIWFsbG93RW1wdHkpIHtcbiAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRXJyb3JzLlVuZXhwZWN0ZWRUb2tlbiwgXCIsXCIpO1xuICAgICAgfVxuICAgICAgZWx0ID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2godHQuZWxsaXBzaXMpKSB7XG4gICAgICBjb25zdCBzcHJlYWROb2RlU3RhcnRQb3MgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgY29uc3Qgc3ByZWFkTm9kZVN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5zdGFydExvYztcblxuICAgICAgZWx0ID0gdGhpcy5wYXJzZVBhcmVuSXRlbShcbiAgICAgICAgdGhpcy5wYXJzZVNwcmVhZChyZWZFeHByZXNzaW9uRXJyb3JzKSxcbiAgICAgICAgc3ByZWFkTm9kZVN0YXJ0UG9zLFxuICAgICAgICBzcHJlYWROb2RlU3RhcnRMb2MsXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaCh0dC5xdWVzdGlvbikpIHtcbiAgICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwicGFydGlhbEFwcGxpY2F0aW9uXCIpO1xuICAgICAgaWYgKCFhbGxvd1BsYWNlaG9sZGVyKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlVuZXhwZWN0ZWRBcmd1bWVudFBsYWNlaG9sZGVyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICBlbHQgPSB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJBcmd1bWVudFBsYWNlaG9sZGVyXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbHQgPSB0aGlzLnBhcnNlTWF5YmVBc3NpZ25BbGxvd0luKFxuICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgICB0aGlzLnBhcnNlUGFyZW5JdGVtLFxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsdDtcbiAgfVxuXG4gIC8vIFBhcnNlIHRoZSBuZXh0IHRva2VuIGFzIGFuIGlkZW50aWZpZXIuIElmIGBsaWJlcmFsYCBpcyB0cnVlICh1c2VkXG4gIC8vIHdoZW4gcGFyc2luZyBwcm9wZXJ0aWVzKSwgaXQgd2lsbCBhbHNvIGNvbnZlcnQga2V5d29yZHMgaW50b1xuICAvLyBpZGVudGlmaWVycy5cbiAgLy8gVGhpcyBzaG91bGRuJ3QgYmUgdXNlZCB0byBwYXJzZSB0aGUga2V5d29yZHMgb2YgbWV0YSBwcm9wZXJ0aWVzLCBzaW5jZSB0aGV5XG4gIC8vIGFyZSBub3QgaWRlbnRpZmllcnMgYW5kIGNhbm5vdCBjb250YWluIGVzY2FwZSBzZXF1ZW5jZXMuXG5cbiAgcGFyc2VJZGVudGlmaWVyKGxpYmVyYWw/OiBib29sZWFuKTogTi5JZGVudGlmaWVyIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5wYXJzZUlkZW50aWZpZXJOYW1lKG5vZGUuc3RhcnQsIGxpYmVyYWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlSWRlbnRpZmllcihub2RlLCBuYW1lKTtcbiAgfVxuXG4gIGNyZWF0ZUlkZW50aWZpZXIobm9kZTogTi5JZGVudGlmaWVyLCBuYW1lOiBzdHJpbmcpOiBOLklkZW50aWZpZXIge1xuICAgIG5vZGUubmFtZSA9IG5hbWU7XG4gICAgbm9kZS5sb2MuaWRlbnRpZmllck5hbWUgPSBuYW1lO1xuXG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIklkZW50aWZpZXJcIik7XG4gIH1cblxuICBwYXJzZUlkZW50aWZpZXJOYW1lKHBvczogbnVtYmVyLCBsaWJlcmFsPzogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgbGV0IG5hbWU6IHN0cmluZztcblxuICAgIGNvbnN0IHsgc3RhcnQsIHR5cGUgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAodHlwZSA9PT0gdHQubmFtZSkge1xuICAgICAgbmFtZSA9IHRoaXMuc3RhdGUudmFsdWU7XG4gICAgfSBlbHNlIGlmICh0eXBlLmtleXdvcmQpIHtcbiAgICAgIG5hbWUgPSB0eXBlLmtleXdvcmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IHRoaXMudW5leHBlY3RlZCgpO1xuICAgIH1cblxuICAgIGlmIChsaWJlcmFsKSB7XG4gICAgICAvLyBJZiB0aGUgY3VycmVudCB0b2tlbiBpcyBub3QgdXNlZCBhcyBhIGtleXdvcmQsIHNldCBpdHMgdHlwZSB0byBcInR0Lm5hbWVcIi5cbiAgICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IHRoaXMubmV4dCgpIGZyb20gdGhyb3dpbmcgYWJvdXQgdW5leHBlY3RlZCBlc2NhcGVzLlxuICAgICAgdGhpcy5zdGF0ZS50eXBlID0gdHQubmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGVja1Jlc2VydmVkV29yZChuYW1lLCBzdGFydCwgISF0eXBlLmtleXdvcmQsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB0aGlzLm5leHQoKTtcblxuICAgIHJldHVybiBuYW1lO1xuICB9XG5cbiAgY2hlY2tSZXNlcnZlZFdvcmQoXG4gICAgd29yZDogc3RyaW5nLFxuICAgIHN0YXJ0TG9jOiBudW1iZXIsXG4gICAgY2hlY2tLZXl3b3JkczogYm9vbGVhbixcbiAgICBpc0JpbmRpbmc6IGJvb2xlYW4sXG4gICk6IHZvaWQge1xuICAgIC8vIEV2ZXJ5IEphdmFTY3JpcHQgcmVzZXJ2ZWQgd29yZCBpcyAxMCBjaGFyYWN0ZXJzIG9yIGxlc3MuXG4gICAgaWYgKHdvcmQubGVuZ3RoID4gMTApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gTW9zdCBpZGVudGlmaWVycyBhcmUgbm90IHJlc2VydmVkV29yZC1saWtlLCB0aGV5IGRvbid0IG5lZWQgc3BlY2lhbFxuICAgIC8vIHRyZWF0bWVudHMgYWZ0ZXJ3YXJkLCB3aGljaCB2ZXJ5IGxpa2VseSBlbmRzIHVwIHRocm93aW5nIGVycm9yc1xuICAgIGlmICghY2FuQmVSZXNlcnZlZFdvcmQod29yZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAod29yZCA9PT0gXCJ5aWVsZFwiKSB7XG4gICAgICBpZiAodGhpcy5wcm9kUGFyYW0uaGFzWWllbGQpIHtcbiAgICAgICAgdGhpcy5yYWlzZShzdGFydExvYywgRXJyb3JzLllpZWxkQmluZGluZ0lkZW50aWZpZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh3b3JkID09PSBcImF3YWl0XCIpIHtcbiAgICAgIGlmICh0aGlzLnByb2RQYXJhbS5oYXNBd2FpdCkge1xuICAgICAgICB0aGlzLnJhaXNlKHN0YXJ0TG9jLCBFcnJvcnMuQXdhaXRCaW5kaW5nSWRlbnRpZmllcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zY29wZS5pblN0YXRpY0Jsb2NrICYmICF0aGlzLnNjb3BlLmluTm9uQXJyb3dGdW5jdGlvbikge1xuICAgICAgICB0aGlzLnJhaXNlKHN0YXJ0TG9jLCBFcnJvcnMuQXdhaXRCaW5kaW5nSWRlbnRpZmllckluU3RhdGljQmxvY2spO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25TY29wZS5yZWNvcmRBc3luY0Fycm93UGFyYW1ldGVyc0Vycm9yKFxuICAgICAgICAgIHN0YXJ0TG9jLFxuICAgICAgICAgIEVycm9ycy5Bd2FpdEJpbmRpbmdJZGVudGlmaWVyLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAod29yZCA9PT0gXCJhcmd1bWVudHNcIikge1xuICAgICAgaWYgKHRoaXMuc2NvcGUuaW5DbGFzc0FuZE5vdEluTm9uQXJyb3dGdW5jdGlvbikge1xuICAgICAgICB0aGlzLnJhaXNlKHN0YXJ0TG9jLCBFcnJvcnMuQXJndW1lbnRzSW5DbGFzcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hlY2tLZXl3b3JkcyAmJiBpc0tleXdvcmQod29yZCkpIHtcbiAgICAgIHRoaXMucmFpc2Uoc3RhcnRMb2MsIEVycm9ycy5VbmV4cGVjdGVkS2V5d29yZCwgd29yZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVzZXJ2ZWRUZXN0ID0gIXRoaXMuc3RhdGUuc3RyaWN0XG4gICAgICA/IGlzUmVzZXJ2ZWRXb3JkXG4gICAgICA6IGlzQmluZGluZ1xuICAgICAgPyBpc1N0cmljdEJpbmRSZXNlcnZlZFdvcmRcbiAgICAgIDogaXNTdHJpY3RSZXNlcnZlZFdvcmQ7XG5cbiAgICBpZiAocmVzZXJ2ZWRUZXN0KHdvcmQsIHRoaXMuaW5Nb2R1bGUpKSB7XG4gICAgICB0aGlzLnJhaXNlKHN0YXJ0TG9jLCBFcnJvcnMuVW5leHBlY3RlZFJlc2VydmVkV29yZCwgd29yZCk7XG4gICAgfVxuICB9XG5cbiAgaXNBd2FpdEFsbG93ZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMucHJvZFBhcmFtLmhhc0F3YWl0KSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAodGhpcy5vcHRpb25zLmFsbG93QXdhaXRPdXRzaWRlRnVuY3Rpb24gJiYgIXRoaXMuc2NvcGUuaW5GdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFBhcnNlcyBhd2FpdCBleHByZXNzaW9uIGluc2lkZSBhc3luYyBmdW5jdGlvbi5cblxuICBwYXJzZUF3YWl0KHN0YXJ0UG9zOiBudW1iZXIsIHN0YXJ0TG9jOiBQb3NpdGlvbik6IE4uQXdhaXRFeHByZXNzaW9uIHtcbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuXG4gICAgdGhpcy5leHByZXNzaW9uU2NvcGUucmVjb3JkUGFyYW1ldGVySW5pdGlhbGl6ZXJFcnJvcihcbiAgICAgIG5vZGUuc3RhcnQsXG4gICAgICBFcnJvcnMuQXdhaXRFeHByZXNzaW9uRm9ybWFsUGFyYW1ldGVyLFxuICAgICk7XG5cbiAgICBpZiAodGhpcy5lYXQodHQuc3RhcikpIHtcbiAgICAgIHRoaXMucmFpc2Uobm9kZS5zdGFydCwgRXJyb3JzLk9ic29sZXRlQXdhaXRTdGFyKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc2NvcGUuaW5GdW5jdGlvbiAmJiAhdGhpcy5vcHRpb25zLmFsbG93QXdhaXRPdXRzaWRlRnVuY3Rpb24pIHtcbiAgICAgIGlmICh0aGlzLmlzQW1iaWd1b3VzQXdhaXQoKSkge1xuICAgICAgICB0aGlzLmFtYmlndW91c1NjcmlwdERpZmZlcmVudEFzdCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNhd1VuYW1iaWd1b3VzRVNNID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuc29sb0F3YWl0KSB7XG4gICAgICBub2RlLmFyZ3VtZW50ID0gdGhpcy5wYXJzZU1heWJlVW5hcnkobnVsbCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkF3YWl0RXhwcmVzc2lvblwiKTtcbiAgfVxuXG4gIGlzQW1iaWd1b3VzQXdhaXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuaGFzUHJlY2VkaW5nTGluZUJyZWFrKCkgfHxcbiAgICAgIC8vIEFsbCB0aGUgZm9sbG93aW5nIGV4cHJlc3Npb25zIGFyZSBhbWJpZ3VvdXM6XG4gICAgICAvLyAgIGF3YWl0ICsgMCwgYXdhaXQgLSAwLCBhd2FpdCAoIDAgKSwgYXdhaXQgWyAwIF0sIGF3YWl0IC8gMCAvdSwgYXdhaXQgYGBcbiAgICAgIHRoaXMubWF0Y2godHQucGx1c01pbikgfHxcbiAgICAgIHRoaXMubWF0Y2godHQucGFyZW5MKSB8fFxuICAgICAgdGhpcy5tYXRjaCh0dC5icmFja2V0TCkgfHxcbiAgICAgIHRoaXMubWF0Y2godHQuYmFja1F1b3RlKSB8fFxuICAgICAgLy8gU29tZXRpbWVzIHRoZSB0b2tlbml6ZXIgZ2VuZXJhdGVzIHR0LnNsYXNoIGZvciByZWdleHBzLCBhbmQgdGhpcyBpc1xuICAgICAgLy8gaGFuZGxlciBieSBwYXJzZUV4cHJBdG9tXG4gICAgICB0aGlzLm1hdGNoKHR0LnJlZ2V4cCkgfHxcbiAgICAgIHRoaXMubWF0Y2godHQuc2xhc2gpIHx8XG4gICAgICAvLyBUaGlzIGNvZGUgY291bGQgYmUgcGFyc2VkIGJvdGggYXMgYSBtb2R1bG8gb3BlcmF0b3Igb3IgYXMgYW4gaW50cmluc2ljOlxuICAgICAgLy8gICBhd2FpdCAleCgwKVxuICAgICAgKHRoaXMuaGFzUGx1Z2luKFwidjhpbnRyaW5zaWNcIikgJiYgdGhpcy5tYXRjaCh0dC5tb2R1bG8pKVxuICAgICk7XG4gIH1cblxuICAvLyBQYXJzZXMgeWllbGQgZXhwcmVzc2lvbiBpbnNpZGUgZ2VuZXJhdG9yLlxuXG4gIHBhcnNlWWllbGQoKTogTi5ZaWVsZEV4cHJlc3Npb24ge1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZSgpO1xuXG4gICAgdGhpcy5leHByZXNzaW9uU2NvcGUucmVjb3JkUGFyYW1ldGVySW5pdGlhbGl6ZXJFcnJvcihcbiAgICAgIG5vZGUuc3RhcnQsXG4gICAgICBFcnJvcnMuWWllbGRJblBhcmFtZXRlcixcbiAgICApO1xuXG4gICAgdGhpcy5uZXh0KCk7XG4gICAgbGV0IGRlbGVnYXRpbmcgPSBmYWxzZTtcbiAgICBsZXQgYXJndW1lbnQgPSBudWxsO1xuICAgIGlmICghdGhpcy5oYXNQcmVjZWRpbmdMaW5lQnJlYWsoKSkge1xuICAgICAgZGVsZWdhdGluZyA9IHRoaXMuZWF0KHR0LnN0YXIpO1xuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnR5cGUpIHtcbiAgICAgICAgY2FzZSB0dC5zZW1pOlxuICAgICAgICBjYXNlIHR0LmVvZjpcbiAgICAgICAgY2FzZSB0dC5icmFjZVI6XG4gICAgICAgIGNhc2UgdHQucGFyZW5SOlxuICAgICAgICBjYXNlIHR0LmJyYWNrZXRSOlxuICAgICAgICBjYXNlIHR0LmJyYWNlQmFyUjpcbiAgICAgICAgY2FzZSB0dC5jb2xvbjpcbiAgICAgICAgY2FzZSB0dC5jb21tYTpcbiAgICAgICAgICAvLyBUaGUgYWJvdmUgaXMgdGhlIGNvbXBsZXRlIHNldCBvZiB0b2tlbnMgdGhhdCBjYW5cbiAgICAgICAgICAvLyBmb2xsb3cgYW4gQXNzaWdubWVudEV4cHJlc3Npb24sIGFuZCBub25lIG9mIHRoZW1cbiAgICAgICAgICAvLyBjYW4gc3RhcnQgYW4gQXNzaWdubWVudEV4cHJlc3Npb25cbiAgICAgICAgICBpZiAoIWRlbGVnYXRpbmcpIGJyZWFrO1xuICAgICAgICAvKiBmYWxsdGhyb3VnaCAqL1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGFyZ3VtZW50ID0gdGhpcy5wYXJzZU1heWJlQXNzaWduKCk7XG4gICAgICB9XG4gICAgfVxuICAgIG5vZGUuZGVsZWdhdGUgPSBkZWxlZ2F0aW5nO1xuICAgIG5vZGUuYXJndW1lbnQgPSBhcmd1bWVudDtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiWWllbGRFeHByZXNzaW9uXCIpO1xuICB9XG5cbiAgLy8gVmFsaWRhdGVzIGEgcGlwZWxpbmUgKGZvciBhbnkgb2YgdGhlIHBpcGVsaW5lIEJhYnlsb24gcGx1Z2lucykgYXQgdGhlIHBvaW50XG4gIC8vIG9mIHRoZSBpbmZpeCBvcGVyYXRvciBgfD5gLlxuXG4gIGNoZWNrUGlwZWxpbmVBdEluZml4T3BlcmF0b3IobGVmdDogTi5FeHByZXNzaW9uLCBsZWZ0U3RhcnRQb3M6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmdldFBsdWdpbk9wdGlvbihcInBpcGVsaW5lT3BlcmF0b3JcIiwgXCJwcm9wb3NhbFwiKSA9PT0gXCJzbWFydFwiKSB7XG4gICAgICBpZiAobGVmdC50eXBlID09PSBcIlNlcXVlbmNlRXhwcmVzc2lvblwiKSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBwaXBlbGluZSBoZWFkIGlzIG5vdCBhIGNvbW1hLWRlbGltaXRlZFxuICAgICAgICAvLyBzZXF1ZW5jZSBleHByZXNzaW9uLlxuICAgICAgICB0aGlzLnJhaXNlKGxlZnRTdGFydFBvcywgRXJyb3JzLlBpcGVsaW5lSGVhZFNlcXVlbmNlRXhwcmVzc2lvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcGFyc2VTbWFydFBpcGVsaW5lQm9keShcbiAgICBjaGlsZEV4cHJlc3Npb246IE4uRXhwcmVzc2lvbixcbiAgICBzdGFydFBvczogbnVtYmVyLFxuICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgKTogTi5QaXBlbGluZUJvZHkge1xuICAgIHRoaXMuY2hlY2tTbWFydFBpcGVsaW5lQm9keUVhcmx5RXJyb3JzKGNoaWxkRXhwcmVzc2lvbiwgc3RhcnRQb3MpO1xuXG4gICAgcmV0dXJuIHRoaXMucGFyc2VTbWFydFBpcGVsaW5lQm9keUluU3R5bGUoXG4gICAgICBjaGlsZEV4cHJlc3Npb24sXG4gICAgICBzdGFydFBvcyxcbiAgICAgIHN0YXJ0TG9jLFxuICAgICk7XG4gIH1cblxuICBjaGVja1NtYXJ0UGlwZWxpbmVCb2R5RWFybHlFcnJvcnMoXG4gICAgY2hpbGRFeHByZXNzaW9uOiBOLkV4cHJlc3Npb24sXG4gICAgc3RhcnRQb3M6IG51bWJlcixcbiAgKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWF0Y2godHQuYXJyb3cpKSB7XG4gICAgICAvLyBJZiB0aGUgZm9sbG93aW5nIHRva2VuIGlzIGludmFsaWRseSBgPT5gLCB0aGVuIHRocm93IGEgaHVtYW4tZnJpZW5kbHkgZXJyb3JcbiAgICAgIC8vIGluc3RlYWQgb2Ygc29tZXRoaW5nIGxpa2UgJ1VuZXhwZWN0ZWQgdG9rZW4sIGV4cGVjdGVkIFwiO1wiJy5cbiAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlBpcGVsaW5lQm9keU5vQXJyb3cpO1xuICAgIH0gZWxzZSBpZiAoY2hpbGRFeHByZXNzaW9uLnR5cGUgPT09IFwiU2VxdWVuY2VFeHByZXNzaW9uXCIpIHtcbiAgICAgIHRoaXMucmFpc2Uoc3RhcnRQb3MsIEVycm9ycy5QaXBlbGluZUJvZHlTZXF1ZW5jZUV4cHJlc3Npb24pO1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlU21hcnRQaXBlbGluZUJvZHlJblN0eWxlKFxuICAgIGNoaWxkRXhwcmVzc2lvbjogTi5FeHByZXNzaW9uLFxuICAgIHN0YXJ0UG9zOiBudW1iZXIsXG4gICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICApOiBOLlBpcGVsaW5lQm9keSB7XG4gICAgY29uc3QgYm9keU5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgY29uc3QgaXNTaW1wbGVSZWZlcmVuY2UgPSB0aGlzLmlzU2ltcGxlUmVmZXJlbmNlKGNoaWxkRXhwcmVzc2lvbik7XG4gICAgaWYgKGlzU2ltcGxlUmVmZXJlbmNlKSB7XG4gICAgICBib2R5Tm9kZS5jYWxsZWUgPSBjaGlsZEV4cHJlc3Npb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdGhpcy50b3BpY1JlZmVyZW5jZVdhc1VzZWRJbkN1cnJlbnRUb3BpY0NvbnRleHQoKSkge1xuICAgICAgICB0aGlzLnJhaXNlKHN0YXJ0UG9zLCBFcnJvcnMuUGlwZWxpbmVUb3BpY1VudXNlZCk7XG4gICAgICB9XG4gICAgICBib2R5Tm9kZS5leHByZXNzaW9uID0gY2hpbGRFeHByZXNzaW9uO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKFxuICAgICAgYm9keU5vZGUsXG4gICAgICBpc1NpbXBsZVJlZmVyZW5jZSA/IFwiUGlwZWxpbmVCYXJlRnVuY3Rpb25cIiA6IFwiUGlwZWxpbmVUb3BpY0V4cHJlc3Npb25cIixcbiAgICApO1xuICB9XG5cbiAgaXNTaW1wbGVSZWZlcmVuY2UoZXhwcmVzc2lvbjogTi5FeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gICAgc3dpdGNoIChleHByZXNzaW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJNZW1iZXJFeHByZXNzaW9uXCI6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgIWV4cHJlc3Npb24uY29tcHV0ZWQgJiYgdGhpcy5pc1NpbXBsZVJlZmVyZW5jZShleHByZXNzaW9uLm9iamVjdClcbiAgICAgICAgKTtcbiAgICAgIGNhc2UgXCJJZGVudGlmaWVyXCI6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEVuYWJsZSB0b3BpYyByZWZlcmVuY2VzIGZyb20gb3V0ZXIgY29udGV4dHMgd2l0aGluIHNtYXJ0IHBpcGVsaW5lIGJvZGllcy5cbiAgLy8gVGhlIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBwYXJzZXIncyB0b3BpYy1jb250ZXh0IHN0YXRlIHRvIGVuYWJsZSBvciBkaXNhYmxlXG4gIC8vIHRoZSB1c2Ugb2YgdG9waWMgcmVmZXJlbmNlcyB3aXRoIHRoZSBzbWFydFBpcGVsaW5lcyBwbHVnaW4uIFRoZXkgdGhlbiBydW4gYVxuICAvLyBjYWxsYmFjaywgdGhlbiB0aGV5IHJlc2V0IHRoZSBwYXJzZXIgdG8gdGhlIG9sZCB0b3BpYy1jb250ZXh0IHN0YXRlIHRoYXQgaXRcbiAgLy8gaGFkIGJlZm9yZSB0aGUgZnVuY3Rpb24gd2FzIGNhbGxlZC5cblxuICB3aXRoVG9waWNQZXJtaXR0aW5nQ29udGV4dDxUPihjYWxsYmFjazogKCkgPT4gVCk6IFQge1xuICAgIGNvbnN0IG91dGVyQ29udGV4dFRvcGljU3RhdGUgPSB0aGlzLnN0YXRlLnRvcGljQ29udGV4dDtcbiAgICB0aGlzLnN0YXRlLnRvcGljQ29udGV4dCA9IHtcbiAgICAgIC8vIEVuYWJsZSB0aGUgdXNlIG9mIHRoZSBwcmltYXJ5IHRvcGljIHJlZmVyZW5jZS5cbiAgICAgIG1heE51bU9mUmVzb2x2YWJsZVRvcGljczogMSxcbiAgICAgIC8vIEhpZGUgdGhlIHVzZSBvZiBhbnkgdG9waWMgcmVmZXJlbmNlcyBmcm9tIG91dGVyIGNvbnRleHRzLlxuICAgICAgbWF4VG9waWNJbmRleDogbnVsbCxcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnN0YXRlLnRvcGljQ29udGV4dCA9IG91dGVyQ29udGV4dFRvcGljU3RhdGU7XG4gICAgfVxuICB9XG5cbiAgLy8gRGlzYWJsZSB0b3BpYyByZWZlcmVuY2VzIGZyb20gb3V0ZXIgY29udGV4dHMgd2l0aGluIHN5bnRheCBjb25zdHJ1Y3RzXG4gIC8vIHN1Y2ggYXMgdGhlIGJvZGllcyBvZiBpdGVyYXRpb24gc3RhdGVtZW50cy5cbiAgLy8gVGhlIGZ1bmN0aW9uIG1vZGlmaWVzIHRoZSBwYXJzZXIncyB0b3BpYy1jb250ZXh0IHN0YXRlIHRvIGVuYWJsZSBvciBkaXNhYmxlXG4gIC8vIHRoZSB1c2Ugb2YgdG9waWMgcmVmZXJlbmNlcyB3aXRoIHRoZSBzbWFydFBpcGVsaW5lcyBwbHVnaW4uIFRoZXkgdGhlbiBydW4gYVxuICAvLyBjYWxsYmFjaywgdGhlbiB0aGV5IHJlc2V0IHRoZSBwYXJzZXIgdG8gdGhlIG9sZCB0b3BpYy1jb250ZXh0IHN0YXRlIHRoYXQgaXRcbiAgLy8gaGFkIGJlZm9yZSB0aGUgZnVuY3Rpb24gd2FzIGNhbGxlZC5cblxuICB3aXRoVG9waWNGb3JiaWRkaW5nQ29udGV4dDxUPihjYWxsYmFjazogKCkgPT4gVCk6IFQge1xuICAgIGNvbnN0IG91dGVyQ29udGV4dFRvcGljU3RhdGUgPSB0aGlzLnN0YXRlLnRvcGljQ29udGV4dDtcbiAgICB0aGlzLnN0YXRlLnRvcGljQ29udGV4dCA9IHtcbiAgICAgIC8vIERpc2FibGUgdGhlIHVzZSBvZiB0aGUgcHJpbWFyeSB0b3BpYyByZWZlcmVuY2UuXG4gICAgICBtYXhOdW1PZlJlc29sdmFibGVUb3BpY3M6IDAsXG4gICAgICAvLyBIaWRlIHRoZSB1c2Ugb2YgYW55IHRvcGljIHJlZmVyZW5jZXMgZnJvbSBvdXRlciBjb250ZXh0cy5cbiAgICAgIG1heFRvcGljSW5kZXg6IG51bGwsXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5zdGF0ZS50b3BpY0NvbnRleHQgPSBvdXRlckNvbnRleHRUb3BpY1N0YXRlO1xuICAgIH1cbiAgfVxuXG4gIHdpdGhTb2xvQXdhaXRQZXJtaXR0aW5nQ29udGV4dDxUPihjYWxsYmFjazogKCkgPT4gVCk6IFQge1xuICAgIGNvbnN0IG91dGVyQ29udGV4dFNvbG9Bd2FpdFN0YXRlID0gdGhpcy5zdGF0ZS5zb2xvQXdhaXQ7XG4gICAgdGhpcy5zdGF0ZS5zb2xvQXdhaXQgPSB0cnVlO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnN0YXRlLnNvbG9Bd2FpdCA9IG91dGVyQ29udGV4dFNvbG9Bd2FpdFN0YXRlO1xuICAgIH1cbiAgfVxuXG4gIGFsbG93SW5BbmQ8VD4oY2FsbGJhY2s6ICgpID0+IFQpOiBUIHtcbiAgICBjb25zdCBmbGFncyA9IHRoaXMucHJvZFBhcmFtLmN1cnJlbnRGbGFncygpO1xuICAgIGNvbnN0IHByb2RQYXJhbVRvU2V0ID0gUEFSQU1fSU4gJiB+ZmxhZ3M7XG4gICAgaWYgKHByb2RQYXJhbVRvU2V0KSB7XG4gICAgICB0aGlzLnByb2RQYXJhbS5lbnRlcihmbGFncyB8IFBBUkFNX0lOKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5wcm9kUGFyYW0uZXhpdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgfVxuXG4gIGRpc2FsbG93SW5BbmQ8VD4oY2FsbGJhY2s6ICgpID0+IFQpOiBUIHtcbiAgICBjb25zdCBmbGFncyA9IHRoaXMucHJvZFBhcmFtLmN1cnJlbnRGbGFncygpO1xuICAgIGNvbnN0IHByb2RQYXJhbVRvQ2xlYXIgPSBQQVJBTV9JTiAmIGZsYWdzO1xuICAgIGlmIChwcm9kUGFyYW1Ub0NsZWFyKSB7XG4gICAgICB0aGlzLnByb2RQYXJhbS5lbnRlcihmbGFncyAmIH5QQVJBTV9JTik7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMucHJvZFBhcmFtLmV4aXQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICAvLyBSZWdpc3RlciB0aGUgdXNlIG9mIGEgcHJpbWFyeSB0b3BpYyByZWZlcmVuY2UgKGAjYCkgd2l0aGluIHRoZSBjdXJyZW50XG4gIC8vIHRvcGljIGNvbnRleHQuXG4gIHJlZ2lzdGVyVG9waWNSZWZlcmVuY2UoKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZS50b3BpY0NvbnRleHQubWF4VG9waWNJbmRleCA9IDA7XG4gIH1cblxuICBwcmltYXJ5VG9waWNSZWZlcmVuY2VJc0FsbG93ZWRJbkN1cnJlbnRUb3BpY0NvbnRleHQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUudG9waWNDb250ZXh0Lm1heE51bU9mUmVzb2x2YWJsZVRvcGljcyA+PSAxO1xuICB9XG5cbiAgdG9waWNSZWZlcmVuY2VXYXNVc2VkSW5DdXJyZW50VG9waWNDb250ZXh0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnN0YXRlLnRvcGljQ29udGV4dC5tYXhUb3BpY0luZGV4ICE9IG51bGwgJiZcbiAgICAgIHRoaXMuc3RhdGUudG9waWNDb250ZXh0Lm1heFRvcGljSW5kZXggPj0gMFxuICAgICk7XG4gIH1cblxuICBwYXJzZUZTaGFycFBpcGVsaW5lQm9keShwcmVjOiBudW1iZXIpOiBOLkV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHN0YXJ0UG9zID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG5cbiAgICB0aGlzLnN0YXRlLnBvdGVudGlhbEFycm93QXQgPSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgIGNvbnN0IG9sZEluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5ID0gdGhpcy5zdGF0ZS5pbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keTtcbiAgICB0aGlzLnN0YXRlLmluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5ID0gdHJ1ZTtcblxuICAgIGNvbnN0IHJldCA9IHRoaXMucGFyc2VFeHByT3AoXG4gICAgICB0aGlzLnBhcnNlTWF5YmVVbmFyeSgpLFxuICAgICAgc3RhcnRQb3MsXG4gICAgICBzdGFydExvYyxcbiAgICAgIHByZWMsXG4gICAgKTtcblxuICAgIHRoaXMuc3RhdGUuaW5GU2hhcnBQaXBlbGluZURpcmVjdEJvZHkgPSBvbGRJbkZTaGFycFBpcGVsaW5lRGlyZWN0Qm9keTtcblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1qcy1tb2R1bGUtYmxvY2tzXG4gIHBhcnNlTW9kdWxlRXhwcmVzc2lvbigpOiBOLk1vZHVsZUV4cHJlc3Npb24ge1xuICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwibW9kdWxlQmxvY2tzXCIpO1xuICAgIGNvbnN0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZTxOLk1vZHVsZUV4cHJlc3Npb24+KCk7XG4gICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBcIm1vZHVsZVwiXG4gICAgdGhpcy5lYXQodHQuYnJhY2VMKTtcblxuICAgIGNvbnN0IHJldmVydFNjb3BlcyA9IHRoaXMuaW5pdGlhbGl6ZVNjb3BlcygvKiogaW5Nb2R1bGUgKi8gdHJ1ZSk7XG4gICAgdGhpcy5lbnRlckluaXRpYWxTY29wZXMoKTtcblxuICAgIGNvbnN0IHByb2dyYW0gPSB0aGlzLnN0YXJ0Tm9kZTxOLlByb2dyYW0+KCk7XG4gICAgdHJ5IHtcbiAgICAgIG5vZGUuYm9keSA9IHRoaXMucGFyc2VQcm9ncmFtKHByb2dyYW0sIHR0LmJyYWNlUiwgXCJtb2R1bGVcIik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJldmVydFNjb3BlcygpO1xuICAgIH1cbiAgICB0aGlzLmVhdCh0dC5icmFjZVIpO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGU8Ti5Nb2R1bGVFeHByZXNzaW9uPihub2RlLCBcIk1vZHVsZUV4cHJlc3Npb25cIik7XG4gIH1cbn1cbiJdfQ==