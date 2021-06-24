"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionFlags = functionFlags;
exports["default"] = exports.PARAM_MOUNT = exports.PARAM_IN = exports.PARAM_RETURN = exports.PARAM_AWAIT = exports.PARAM_YIELD = exports.PARAM = void 0;

var _types = require("../../tokenizer/types");

var N = _interopRequireWildcard(require("../../types"));

var _error = require("../../parser/error");

var _expressionScope = require("../../util/expression-scope");

var _util = require("../../parser/util");

var _scopeflags = require("../../util/scopeflags");

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

//const liveToken = tt._live = new TokenType("live", { keyword: 'live', beforeExpr: true, startsExpr: true });
//tk.set("live", liveToken);
//const mountToken = tt._mount = new TokenType("mount", { keyword: 'mount', beforeExpr: true, startsExpr: true });
//tk.set("mount", mountToken);
var PARAM = 0,
    // Initial Parameter flags
PARAM_YIELD = 1,
    // track [Yield] production parameter
PARAM_AWAIT = 2,
    // track [Await] production parameter
PARAM_RETURN = 4,
    // track [Return] production parameter
PARAM_IN = 8,
    // track [In] production parameter
PARAM_MOUNT = 16; // track [Mount] production parameter

exports.PARAM_MOUNT = PARAM_MOUNT;
exports.PARAM_IN = PARAM_IN;
exports.PARAM_RETURN = PARAM_RETURN;
exports.PARAM_AWAIT = PARAM_AWAIT;
exports.PARAM_YIELD = PARAM_YIELD;
exports.PARAM = PARAM;

function functionFlags(isAsync, isGenerator, isLive) {
  return (isAsync ? PARAM_AWAIT : 0) | (isGenerator ? PARAM_YIELD : 0) | (isLive ? PARAM_MOUNT : 0);
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
      key: "isMountAllowed",
      value: function isMountAllowed() {
        return this.prodParam.hasMount;
      }
      /* ============================================================ *
       * parser/statement.js                                          *
       * ============================================================ */

    }, {
      key: "isAsyncFunction",
      value: function isAsyncFunction() {
        if (!this.isContextual("async") || !this.isContextual("live")) return false;
        var next = this.nextTokenStart();
        return !lineBreak.test(this.input.slice(this.state.pos, next)) && this.isUnparsedContextual(next, "function");
      }
      /* ============================================================ *
       * parser/expression.js                                         *
       * ============================================================ */

    }, {
      key: "initFunction",
      value: function initFunction(node, isAsync, isLive) {
        node.id = null;
        node.generator = false;
        node.async = !!isAsync;
        node.live = !!isLive;
      }
    }, {
      key: "atPossibleLiveArrow",
      value: function atPossibleLiveArrow(base) {
        return base.type === "Identifier" && base.name === "live" && this.state.lastTokEnd === base.end && !this.canInsertSemicolon() && // check there are no escape sequences, such as \u{61}sync
        base.end - base.start === 4 && base.start === this.state.potentialArrowAt;
      }
    }, {
      key: "parseSubscripts",
      value: function parseSubscripts(base, startPos, startLoc, noCalls) {
        var state = {
          optionalChainMember: false,
          maybeAsyncArrow: this.atPossibleAsyncArrow(base),
          maybeLiveArrow: this.atPossibleLiveArrow(base),
          stop: false
        };

        do {
          base = this.parseSubscript(base, startPos, startLoc, noCalls, state);
          state.maybeAsyncArrow = false;
          state.maybeLiveArrow = false;
        } while (!state.stop);

        return base;
      }
    }, {
      key: "parseArrowExpression",
      value: function parseArrowExpression(node, params, isAsync, isLive, trailingCommaPos) {
        this.scope.enter(_scopeflags.SCOPE_FUNCTION | _scopeflags.SCOPE_ARROW);
        var flags = functionFlags(isAsync, false, isLive); // ConciseBody and AsyncConciseBody inherit [In]

        if (!this.match(_types.types.bracketL) && this.prodParam.hasIn) {
          flags |= PARAM_IN;
        }

        this.prodParam.enter(flags);
        this.initFunction(node, isAsync, isLive);
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
      key: "parseLiveArrowFromCallExpression",
      value: function parseLiveArrowFromCallExpression(node, call) {
        var _call$extra;

        this.expect(_types.types.arrow);
        this.parseArrowExpression(node, call.arguments, false, true, (_call$extra = call.extra) === null || _call$extra === void 0 ? void 0 : _call$extra.trailingComma);
        return node;
      }
    }, {
      key: "parseLiveArrowUnaryFunction",
      value: function parseLiveArrowUnaryFunction(id) {
        var node = this.startNodeAtNode(id); // We don't need to push a new ParameterDeclarationScope here since we are sure
        // 1) it is an async arrow, 2) no biding pattern is allowed in params

        this.prodParam.enter(functionFlags(false, false, true));
        var params = [this.parseIdentifier()];
        this.prodParam.exit();

        if (this.hasPrecedingLineBreak()) {
          this.raise(this.state.pos, Errors.LineTerminatorBeforeArrow);
        }

        this.expect(_types.types.arrow); // let foo = live bar => {};

        this.parseArrowExpression(node, params, true);
        return node;
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

        if (state.maybeAsyncArrow || state.maybeLiveArrow) {
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

        if (state.maybeLiveArrow && this.shouldParseAsyncArrow() && !optional) {
          state.stop = true;
          this.expressionScope.validateAsPattern();
          this.expressionScope.exit();
          node = this.parseLiveArrowFromCallExpression(this.startNodeAt(startPos, startLoc), node);
        } else if (state.maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
          state.stop = true;
          this.expressionScope.validateAsPattern();
          this.expressionScope.exit();
          node = this.parseAsyncArrowFromCallExpression(this.startNodeAt(startPos, startLoc), node);
        } else {
          if (state.maybeAsyncArrow || state.maybeLiveArrow) {
            this.checkExpressionErrors(refExpressionErrors, true);
            this.expressionScope.exit();
          }

          this.toReferencedArguments(node);
        }

        this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
        return node;
      }
    }, {
      key: "parseMaybeUnary",
      value: function parseMaybeUnary(refExpressionErrors, sawUnary) {
        var startPos = this.state.start;
        var startLoc = this.state.startLoc;
        var isMount = this.isContextual("mount");

        if (isMount && this.isMountAllowed()) {
          this.next();
          var expr = this.parseMount(startPos, startLoc);
          if (!sawUnary) this.checkExponentialAfterUnary(expr);
          return expr;
        }

        return _get(_getPrototypeOf(_class.prototype), "parseMaybeUnary", this).call(this, refExpressionErrors, sawUnary);
      }
    }, {
      key: "parseMount",
      value: function parseMount(startPos, startLoc) {
        var node = this.parseAwait(startPos, startLoc);
        node.type = 'MountExpression';
        return node;
      }
    }, {
      key: "parseExprAtom",
      value: function parseExprAtom(refExpressionErrors) {
        var node;

        switch (this.state.type) {
          case _types.types.name:
            {
              var canBeArrow = this.state.potentialArrowAt === this.state.start;
              var containsEsc = this.state.containsEsc;
              var id = this.parseIdentifier();

              if (!containsEsc && id.name === "live" && !this.canInsertSemicolon()) {
                if (this.match(_types.types._function)) {
                  this.next();
                  return this.parseFunction(this.startNodeAtNode(id), undefined, false, true);
                } else if (this.match(_types.types.name)) {
                  // If the next token begins with "=", commit to parsing an async
                  // arrow function. (Peeking ahead for "=" lets us avoid a more
                  // expensive full-token lookahead on this common path.)
                  if (this.lookaheadCharCode() === charCodes.equalsTo) {
                    return this.parseLiveArrowUnaryFunction(id);
                  } else {
                    // Otherwise, treat "async" as an identifier and let calling code
                    // deal with the current tt.name token.
                    return id;
                  }
                }
              }

              if (canBeArrow && this.match(_types.types.arrow) && !this.canInsertSemicolon()) {
                this.next();
                return this.parseArrowExpression(this.startNodeAtNode(id), [id], false);
              }

              return id;
            }
          // fall through

          default:
            return _get(_getPrototypeOf(_class.prototype), "parseExprAtom", this).call(this, refExpressionErrors);
        }
      }
    }]);

    return _class;
  }(superClass);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL2xpdmUvaW5kZXguanMiXSwibmFtZXMiOlsiUEFSQU0iLCJQQVJBTV9ZSUVMRCIsIlBBUkFNX0FXQUlUIiwiUEFSQU1fUkVUVVJOIiwiUEFSQU1fSU4iLCJQQVJBTV9NT1VOVCIsImZ1bmN0aW9uRmxhZ3MiLCJpc0FzeW5jIiwiaXNHZW5lcmF0b3IiLCJpc0xpdmUiLCJzdXBlckNsYXNzIiwicHJvZFBhcmFtIiwiaGFzTW91bnQiLCJpc0NvbnRleHR1YWwiLCJuZXh0IiwibmV4dFRva2VuU3RhcnQiLCJsaW5lQnJlYWsiLCJ0ZXN0IiwiaW5wdXQiLCJzbGljZSIsInN0YXRlIiwicG9zIiwiaXNVbnBhcnNlZENvbnRleHR1YWwiLCJub2RlIiwiaWQiLCJnZW5lcmF0b3IiLCJhc3luYyIsImxpdmUiLCJiYXNlIiwidHlwZSIsIm5hbWUiLCJsYXN0VG9rRW5kIiwiZW5kIiwiY2FuSW5zZXJ0U2VtaWNvbG9uIiwic3RhcnQiLCJwb3RlbnRpYWxBcnJvd0F0Iiwic3RhcnRQb3MiLCJzdGFydExvYyIsIm5vQ2FsbHMiLCJvcHRpb25hbENoYWluTWVtYmVyIiwibWF5YmVBc3luY0Fycm93IiwiYXRQb3NzaWJsZUFzeW5jQXJyb3ciLCJtYXliZUxpdmVBcnJvdyIsImF0UG9zc2libGVMaXZlQXJyb3ciLCJzdG9wIiwicGFyc2VTdWJzY3JpcHQiLCJwYXJhbXMiLCJ0cmFpbGluZ0NvbW1hUG9zIiwic2NvcGUiLCJlbnRlciIsIlNDT1BFX0ZVTkNUSU9OIiwiU0NPUEVfQVJST1ciLCJmbGFncyIsIm1hdGNoIiwidHQiLCJicmFja2V0TCIsImhhc0luIiwiaW5pdEZ1bmN0aW9uIiwib2xkTWF5YmVJbkFycm93UGFyYW1ldGVycyIsIm1heWJlSW5BcnJvd1BhcmFtZXRlcnMiLCJzZXRBcnJvd0Z1bmN0aW9uUGFyYW1ldGVycyIsInBhcnNlRnVuY3Rpb25Cb2R5IiwiZXhpdCIsImZpbmlzaE5vZGUiLCJjYWxsIiwiZXhwZWN0IiwiYXJyb3ciLCJwYXJzZUFycm93RXhwcmVzc2lvbiIsImFyZ3VtZW50cyIsImV4dHJhIiwidHJhaWxpbmdDb21tYSIsInN0YXJ0Tm9kZUF0Tm9kZSIsInBhcnNlSWRlbnRpZmllciIsImhhc1ByZWNlZGluZ0xpbmVCcmVhayIsInJhaXNlIiwiRXJyb3JzIiwiTGluZVRlcm1pbmF0b3JCZWZvcmVBcnJvdyIsIm9wdGlvbmFsIiwicmVmRXhwcmVzc2lvbkVycm9ycyIsInN0YXJ0Tm9kZUF0IiwiY2FsbGVlIiwiZXhwcmVzc2lvblNjb3BlIiwiRXhwcmVzc2lvbkVycm9ycyIsInBhcnNlQ2FsbEV4cHJlc3Npb25Bcmd1bWVudHMiLCJwYXJlblIiLCJmaW5pc2hDYWxsRXhwcmVzc2lvbiIsInNob3VsZFBhcnNlQXN5bmNBcnJvdyIsInZhbGlkYXRlQXNQYXR0ZXJuIiwicGFyc2VMaXZlQXJyb3dGcm9tQ2FsbEV4cHJlc3Npb24iLCJwYXJzZUFzeW5jQXJyb3dGcm9tQ2FsbEV4cHJlc3Npb24iLCJjaGVja0V4cHJlc3Npb25FcnJvcnMiLCJ0b1JlZmVyZW5jZWRBcmd1bWVudHMiLCJzYXdVbmFyeSIsImlzTW91bnQiLCJpc01vdW50QWxsb3dlZCIsImV4cHIiLCJwYXJzZU1vdW50IiwiY2hlY2tFeHBvbmVudGlhbEFmdGVyVW5hcnkiLCJwYXJzZUF3YWl0IiwiY2FuQmVBcnJvdyIsImNvbnRhaW5zRXNjIiwiX2Z1bmN0aW9uIiwicGFyc2VGdW5jdGlvbiIsInVuZGVmaW5lZCIsImxvb2thaGVhZENoYXJDb2RlIiwiY2hhckNvZGVzIiwiZXF1YWxzVG8iLCJwYXJzZUxpdmVBcnJvd1VuYXJ5RnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0E7QUFDQTtBQUVBO0FBQ0E7QUFFTyxJQUFNQSxLQUFLLEdBQUcsQ0FBZDtBQUFBLElBQXNCO0FBQzNCQyxXQUFXLEdBQUcsQ0FEVDtBQUFBLElB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QyxTQUFkLENBQUosRUFBOEI7QUFDNUIsdUJBQUt2RixJQUFMO0FBQ0EseUJBQU8sS0FBS3dGLGFBQUwsQ0FDTCxLQUFLL0IsZUFBTCxDQUFxQi9DLEVBQXJCLENBREssRUFFTCtFLFNBRkssRUFHTCxLQUhLLEVBSUwsSUFKSyxDQUFQO0FBTUQsaUJBUkQsTUFRTyxJQUFJLEtBQUtsRCxLQUFMLENBQVdDLGFBQUd4QixJQUFkLENBQUosRUFBeUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0Esc0JBQUksS0FBSzBFLGlCQUFMLE9BQTZCQyxTQUFTLENBQUNDLFFBQTNDLEVBQXFEO0FBQ25ELDJCQUFPLEtBQUtDLDJCQUFMLENBQWlDbkYsRUFBakMsQ0FBUDtBQUNELG1CQUZELE1BRU87QUFDTDtBQUNBO0FBQ0EsMkJBQU9BLEVBQVA7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsa0JBQUkyRSxVQUFVLElBQUksS0FBSzlDLEtBQUwsQ0FBV0MsYUFBR1ksS0FBZCxDQUFkLElBQXNDLENBQUMsS0FBS2pDLGtCQUFMLEVBQTNDLEVBQXNFO0FBQ3BFLHFCQUFLbkIsSUFBTDtBQUNBLHVCQUFPLEtBQUtxRCxvQkFBTCxDQUNMLEtBQUtJLGVBQUwsQ0FBcUIvQyxFQUFyQixDQURLLEVBRUwsQ0FBQ0EsRUFBRCxDQUZLLEVBR0wsS0FISyxDQUFQO0FBS0Q7O0FBRUQscUJBQU9BLEVBQVA7QUFDRDtBQUVEOztBQUNBO0FBQ0UsNkZBQTJCc0QsbUJBQTNCO0FBM0NKO0FBNkNEO0FBN1FVOztBQUFBO0FBQUEsSUFFQ3BFLFVBRkQ7QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgUGFyc2VyIGZyb20gXCIuLi8uLi9wYXJzZXJcIjtcbmltcG9ydCB7IGtleXdvcmRzIGFzIHRrLCB0eXBlcyBhcyB0dCwgVG9rZW5UeXBlIH0gZnJvbSBcIi4uLy4uL3Rva2VuaXplci90eXBlc1wiO1xuaW1wb3J0ICogYXMgTiBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcbmltcG9ydCB7IG1ha2VFcnJvclRlbXBsYXRlcywgRXJyb3JDb2RlcyB9IGZyb20gXCIuLi8uLi9wYXJzZXIvZXJyb3JcIjtcbmltcG9ydCB7IG5ld0FzeW5jQXJyb3dTY29wZSB9IGZyb20gXCIuLi8uLi91dGlsL2V4cHJlc3Npb24tc2NvcGVcIjtcbmltcG9ydCB7IEV4cHJlc3Npb25FcnJvcnMgfSBmcm9tIFwiLi4vLi4vcGFyc2VyL3V0aWxcIjtcblxuaW1wb3J0IHtcbiAgU0NPUEVfRlVOQ1RJT04sXG4gIFNDT1BFX0FSUk9XLFxufSBmcm9tIFwiLi4vLi4vdXRpbC9zY29wZWZsYWdzXCI7XG5cbi8vY29uc3QgbGl2ZVRva2VuID0gdHQuX2xpdmUgPSBuZXcgVG9rZW5UeXBlKFwibGl2ZVwiLCB7IGtleXdvcmQ6ICdsaXZlJywgYmVmb3JlRXhwcjogdHJ1ZSwgc3RhcnRzRXhwcjogdHJ1ZSB9KTtcbi8vdGsuc2V0KFwibGl2ZVwiLCBsaXZlVG9rZW4pO1xuXG4vL2NvbnN0IG1vdW50VG9rZW4gPSB0dC5fbW91bnQgPSBuZXcgVG9rZW5UeXBlKFwibW91bnRcIiwgeyBrZXl3b3JkOiAnbW91bnQnLCBiZWZvcmVFeHByOiB0cnVlLCBzdGFydHNFeHByOiB0cnVlIH0pO1xuLy90ay5zZXQoXCJtb3VudFwiLCBtb3VudFRva2VuKTtcblxuZXhwb3J0IGNvbnN0IFBBUkFNID0gMGIwMDAwLCAvLyBJbml0aWFsIFBhcmFtZXRlciBmbGFnc1xuICBQQVJBTV9ZSUVMRCA9IDBiMDAwMSwgLy8gdHJhY2sgW1lpZWxkXSBwcm9kdWN0aW9uIHBhcmFtZXRlclxuICBQQVJBTV9BV0FJVCA9IDBiMDAxMCwgLy8gdHJhY2sgW0F3YWl0XSBwcm9kdWN0aW9uIHBhcmFtZXRlclxuICBQQVJBTV9SRVRVUk4gPSAwYjAxMDAsIC8vIHRyYWNrIFtSZXR1cm5dIHByb2R1Y3Rpb24gcGFyYW1ldGVyXG4gIFBBUkFNX0lOID0gMGIxMDAwLCAvLyB0cmFjayBbSW5dIHByb2R1Y3Rpb24gcGFyYW1ldGVyXG4gIFBBUkFNX01PVU5UID0gMGIxMDAwMDsgLy8gdHJhY2sgW01vdW50XSBwcm9kdWN0aW9uIHBhcmFtZXRlclxuXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25GbGFncyhcbiAgaXNBc3luYzogYm9vbGVhbixcbiAgaXNHZW5lcmF0b3I6IGJvb2xlYW4sXG4gIGlzTGl2ZTogYm9vbGVhbixcbik6IFBhcmFtS2luZCB7XG4gIHJldHVybiAoaXNBc3luYyA/IFBBUkFNX0FXQUlUIDogMCkgfCAoaXNHZW5lcmF0b3IgPyBQQVJBTV9ZSUVMRCA6IDApIHwgKGlzTGl2ZSA/IFBBUkFNX01PVU5UIDogMCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IChzdXBlckNsYXNzOiBDbGFzczxQYXJzZXI+KTogQ2xhc3M8UGFyc2VyPiA9PlxuXG4gIGNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG5cbiAgICBpc01vdW50QWxsb3dlZCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2RQYXJhbS5oYXNNb3VudDtcbiAgICB9XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKlxuICAgICAqIHBhcnNlci9zdGF0ZW1lbnQuanMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgICBpc0FzeW5jRnVuY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgICBpZiAoIXRoaXMuaXNDb250ZXh0dWFsKFwiYXN5bmNcIikgfHwgIXRoaXMuaXNDb250ZXh0dWFsKFwibGl2ZVwiKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgY29uc3QgbmV4dCA9IHRoaXMubmV4dFRva2VuU3RhcnQoKTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgICFsaW5lQnJlYWsudGVzdCh0aGlzLmlucHV0LnNsaWNlKHRoaXMuc3RhdGUucG9zLCBuZXh0KSkgJiZcbiAgICAgICAgdGhpcy5pc1VucGFyc2VkQ29udGV4dHVhbChuZXh0LCBcImZ1bmN0aW9uXCIpXG4gICAgICApO1xuICAgIH1cbiAgICBcbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKlxuICAgICAqIHBhcnNlci9leHByZXNzaW9uLmpzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqXG4gICAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgICBpbml0RnVuY3Rpb24obm9kZTogTi5Cb2RpbGVzc0Z1bmN0aW9uT3JNZXRob2RCYXNlLCBpc0FzeW5jOiA/Ym9vbGVhbiwgaXNMaXZlOiA/Ym9vbGVhbik6IHZvaWQge1xuICAgICAgbm9kZS5pZCA9IG51bGw7XG4gICAgICBub2RlLmdlbmVyYXRvciA9IGZhbHNlO1xuICAgICAgbm9kZS5hc3luYyA9ICEhaXNBc3luYztcbiAgICAgIG5vZGUubGl2ZSA9ICEhaXNMaXZlO1xuICAgIH1cbiAgICBcbiAgICBhdFBvc3NpYmxlTGl2ZUFycm93KGJhc2U6IE4uRXhwcmVzc2lvbik6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgYmFzZS50eXBlID09PSBcIklkZW50aWZpZXJcIiAmJlxuICAgICAgICAoYmFzZS5uYW1lID09PSBcImxpdmVcIikgJiZcbiAgICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rRW5kID09PSBiYXNlLmVuZCAmJlxuICAgICAgICAhdGhpcy5jYW5JbnNlcnRTZW1pY29sb24oKSAmJlxuICAgICAgICAvLyBjaGVjayB0aGVyZSBhcmUgbm8gZXNjYXBlIHNlcXVlbmNlcywgc3VjaCBhcyBcXHV7NjF9c3luY1xuICAgICAgICAoYmFzZS5lbmQgLSBiYXNlLnN0YXJ0ID09PSA0KSAmJlxuICAgICAgICBiYXNlLnN0YXJ0ID09PSB0aGlzLnN0YXRlLnBvdGVudGlhbEFycm93QXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcGFyc2VTdWJzY3JpcHRzKFxuICAgICAgYmFzZTogTi5FeHByZXNzaW9uLFxuICAgICAgc3RhcnRQb3M6IG51bWJlcixcbiAgICAgIHN0YXJ0TG9jOiBQb3NpdGlvbixcbiAgICAgIG5vQ2FsbHM/OiA/Ym9vbGVhbixcbiAgICApOiBOLkV4cHJlc3Npb24ge1xuICAgICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIG9wdGlvbmFsQ2hhaW5NZW1iZXI6IGZhbHNlLFxuICAgICAgICBtYXliZUFzeW5jQXJyb3c6IHRoaXMuYXRQb3NzaWJsZUFzeW5jQXJyb3coYmFzZSksXG4gICAgICAgIG1heWJlTGl2ZUFycm93OiB0aGlzLmF0UG9zc2libGVMaXZlQXJyb3coYmFzZSksXG4gICAgICAgIHN0b3A6IGZhbHNlLFxuICAgICAgfTtcbiAgICAgIGRvIHtcbiAgICAgICAgYmFzZSA9IHRoaXMucGFyc2VTdWJzY3JpcHQoYmFzZSwgc3RhcnRQb3MsIHN0YXJ0TG9jLCBub0NhbGxzLCBzdGF0ZSk7XG5cbiAgICAgICAgc3RhdGUubWF5YmVBc3luY0Fycm93ID0gZmFsc2U7XG4gICAgICAgIHN0YXRlLm1heWJlTGl2ZUFycm93ID0gZmFsc2U7XG4gICAgICB9IHdoaWxlICghc3RhdGUuc3RvcCk7XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBwYXJzZUFycm93RXhwcmVzc2lvbihcbiAgICAgIG5vZGU6IE4uQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24sXG4gICAgICBwYXJhbXM6ID8oTi5FeHByZXNzaW9uW10pLFxuICAgICAgaXNBc3luYzogYm9vbGVhbixcbiAgICAgIGlzTGl2ZTogYm9vbGVhbixcbiAgICAgIHRyYWlsaW5nQ29tbWFQb3M6ID9udW1iZXIsXG4gICAgKTogTi5BcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbiB7XG4gICAgICB0aGlzLnNjb3BlLmVudGVyKFNDT1BFX0ZVTkNUSU9OIHwgU0NPUEVfQVJST1cpO1xuICAgICAgbGV0IGZsYWdzID0gZnVuY3Rpb25GbGFncyhpc0FzeW5jLCBmYWxzZSwgaXNMaXZlKTtcbiAgICAgIC8vIENvbmNpc2VCb2R5IGFuZCBBc3luY0NvbmNpc2VCb2R5IGluaGVyaXQgW0luXVxuICAgICAgaWYgKCF0aGlzLm1hdGNoKHR0LmJyYWNrZXRMKSAmJiB0aGlzLnByb2RQYXJhbS5oYXNJbikge1xuICAgICAgICBmbGFncyB8PSBQQVJBTV9JTjtcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvZFBhcmFtLmVudGVyKGZsYWdzKTtcbiAgICAgIHRoaXMuaW5pdEZ1bmN0aW9uKG5vZGUsIGlzQXN5bmMsIGlzTGl2ZSk7XG4gICAgICBjb25zdCBvbGRNYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzO1xuXG4gICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgIHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2V0QXJyb3dGdW5jdGlvblBhcmFtZXRlcnMobm9kZSwgcGFyYW1zLCB0cmFpbGluZ0NvbW1hUG9zKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGUubWF5YmVJbkFycm93UGFyYW1ldGVycyA9IGZhbHNlO1xuICAgICAgdGhpcy5wYXJzZUZ1bmN0aW9uQm9keShub2RlLCB0cnVlKTtcblxuICAgICAgdGhpcy5wcm9kUGFyYW0uZXhpdCgpO1xuICAgICAgdGhpcy5zY29wZS5leGl0KCk7XG4gICAgICB0aGlzLnN0YXRlLm1heWJlSW5BcnJvd1BhcmFtZXRlcnMgPSBvbGRNYXliZUluQXJyb3dQYXJhbWV0ZXJzO1xuXG4gICAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25cIik7XG4gICAgfVxuXG4gICAgcGFyc2VMaXZlQXJyb3dGcm9tQ2FsbEV4cHJlc3Npb24oXG4gICAgICBub2RlOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uLFxuICAgICAgY2FsbDogTi5DYWxsRXhwcmVzc2lvbixcbiAgICApOiBOLkFycm93RnVuY3Rpb25FeHByZXNzaW9uIHtcbiAgICAgIHRoaXMuZXhwZWN0KHR0LmFycm93KTtcbiAgICAgIHRoaXMucGFyc2VBcnJvd0V4cHJlc3Npb24oXG4gICAgICAgIG5vZGUsXG4gICAgICAgIGNhbGwuYXJndW1lbnRzLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgY2FsbC5leHRyYT8udHJhaWxpbmdDb21tYSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBwYXJzZUxpdmVBcnJvd1VuYXJ5RnVuY3Rpb24oaWQ6IE4uRXhwcmVzc2lvbik6IE4uQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24ge1xuICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlQXROb2RlKGlkKTtcbiAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gcHVzaCBhIG5ldyBQYXJhbWV0ZXJEZWNsYXJhdGlvblNjb3BlIGhlcmUgc2luY2Ugd2UgYXJlIHN1cmVcbiAgICAgIC8vIDEpIGl0IGlzIGFuIGFzeW5jIGFycm93LCAyKSBubyBiaWRpbmcgcGF0dGVybiBpcyBhbGxvd2VkIGluIHBhcmFtc1xuICAgICAgdGhpcy5wcm9kUGFyYW0uZW50ZXIoZnVuY3Rpb25GbGFncyhmYWxzZSwgZmFsc2UsIHRydWUpKTtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IFt0aGlzLnBhcnNlSWRlbnRpZmllcigpXTtcbiAgICAgIHRoaXMucHJvZFBhcmFtLmV4aXQoKTtcbiAgICAgIGlmICh0aGlzLmhhc1ByZWNlZGluZ0xpbmVCcmVhaygpKSB7XG4gICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5wb3MsIEVycm9ycy5MaW5lVGVybWluYXRvckJlZm9yZUFycm93KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZXhwZWN0KHR0LmFycm93KTtcbiAgICAgIC8vIGxldCBmb28gPSBsaXZlIGJhciA9PiB7fTtcbiAgICAgIHRoaXMucGFyc2VBcnJvd0V4cHJlc3Npb24obm9kZSwgcGFyYW1zLCB0cnVlKTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLUNvdmVyQ2FsbEV4cHJlc3Npb25BbmRBc3luY0Fycm93SGVhZFxuICAgIC8vIENvdmVyQ2FsbEV4cHJlc3Npb25BbmRBc3luY0Fycm93SGVhZFxuICAgIC8vIENhbGxFeHByZXNzaW9uWz9ZaWVsZCwgP0F3YWl0XSBBcmd1bWVudHNbP1lpZWxkLCA/QXdhaXRdXG4gICAgLy8gT3B0aW9uYWxDaGFpbls/WWllbGQsID9Bd2FpdF0gQXJndW1lbnRzWz9ZaWVsZCwgP0F3YWl0XVxuICAgIHBhcnNlQ292ZXJDYWxsQW5kQXN5bmNBcnJvd0hlYWQoXG4gICAgICBiYXNlOiBOLkV4cHJlc3Npb24sXG4gICAgICBzdGFydFBvczogbnVtYmVyLFxuICAgICAgc3RhcnRMb2M6IFBvc2l0aW9uLFxuICAgICAgc3RhdGU6IE4uUGFyc2VTdWJzY3JpcHRTdGF0ZSxcbiAgICAgIG9wdGlvbmFsOiBib29sZWFuLFxuICAgICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgICBjb25zdCBvbGRNYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzO1xuICAgICAgbGV0IHJlZkV4cHJlc3Npb25FcnJvcnMgPSBudWxsO1xuXG4gICAgICB0aGlzLnN0YXRlLm1heWJlSW5BcnJvd1BhcmFtZXRlcnMgPSB0cnVlO1xuICAgICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBgKGBcblxuICAgICAgbGV0IG5vZGUgPSB0aGlzLnN0YXJ0Tm9kZUF0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICBub2RlLmNhbGxlZSA9IGJhc2U7XG5cbiAgICAgIGlmIChzdGF0ZS5tYXliZUFzeW5jQXJyb3cgfHwgc3RhdGUubWF5YmVMaXZlQXJyb3cpIHtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uU2NvcGUuZW50ZXIobmV3QXN5bmNBcnJvd1Njb3BlKCkpO1xuICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzID0gbmV3IEV4cHJlc3Npb25FcnJvcnMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlLm9wdGlvbmFsQ2hhaW5NZW1iZXIpIHtcbiAgICAgICAgbm9kZS5vcHRpb25hbCA9IG9wdGlvbmFsO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9uYWwpIHtcbiAgICAgICAgbm9kZS5hcmd1bWVudHMgPSB0aGlzLnBhcnNlQ2FsbEV4cHJlc3Npb25Bcmd1bWVudHModHQucGFyZW5SKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUuYXJndW1lbnRzID0gdGhpcy5wYXJzZUNhbGxFeHByZXNzaW9uQXJndW1lbnRzKFxuICAgICAgICAgIHR0LnBhcmVuUixcbiAgICAgICAgICBiYXNlLnR5cGUgPT09IFwiSW1wb3J0XCIsXG4gICAgICAgICAgYmFzZS50eXBlICE9PSBcIlN1cGVyXCIsXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5maW5pc2hDYWxsRXhwcmVzc2lvbihub2RlLCBzdGF0ZS5vcHRpb25hbENoYWluTWVtYmVyKTtcblxuICAgICAgaWYgKHN0YXRlLm1heWJlTGl2ZUFycm93ICYmIHRoaXMuc2hvdWxkUGFyc2VBc3luY0Fycm93KCkgJiYgIW9wdGlvbmFsKSB7XG4gICAgICAgIHN0YXRlLnN0b3AgPSB0cnVlO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25TY29wZS52YWxpZGF0ZUFzUGF0dGVybigpO1xuICAgICAgICB0aGlzLmV4cHJlc3Npb25TY29wZS5leGl0KCk7XG4gICAgICAgIG5vZGUgPSB0aGlzLnBhcnNlTGl2ZUFycm93RnJvbUNhbGxFeHByZXNzaW9uKFxuICAgICAgICAgIHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZS5tYXliZUFzeW5jQXJyb3cgJiYgdGhpcy5zaG91bGRQYXJzZUFzeW5jQXJyb3coKSAmJiAhb3B0aW9uYWwpIHtcbiAgICAgICAgc3RhdGUuc3RvcCA9IHRydWU7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblNjb3BlLnZhbGlkYXRlQXNQYXR0ZXJuKCk7XG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblNjb3BlLmV4aXQoKTtcbiAgICAgICAgbm9kZSA9IHRoaXMucGFyc2VBc3luY0Fycm93RnJvbUNhbGxFeHByZXNzaW9uKFxuICAgICAgICAgIHRoaXMuc3RhcnROb2RlQXQoc3RhcnRQb3MsIHN0YXJ0TG9jKSxcbiAgICAgICAgICBub2RlLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHN0YXRlLm1heWJlQXN5bmNBcnJvdyB8fCBzdGF0ZS5tYXliZUxpdmVBcnJvdykge1xuICAgICAgICAgIHRoaXMuY2hlY2tFeHByZXNzaW9uRXJyb3JzKHJlZkV4cHJlc3Npb25FcnJvcnMsIHRydWUpO1xuICAgICAgICAgIHRoaXMuZXhwcmVzc2lvblNjb3BlLmV4aXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRvUmVmZXJlbmNlZEFyZ3VtZW50cyhub2RlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGF0ZS5tYXliZUluQXJyb3dQYXJhbWV0ZXJzID0gb2xkTWF5YmVJbkFycm93UGFyYW1ldGVycztcblxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIFxuICAgIHBhcnNlTWF5YmVVbmFyeShcbiAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnM6ID9FeHByZXNzaW9uRXJyb3JzLFxuICAgICAgc2F3VW5hcnk/OiBib29sZWFuLFxuICAgICk6IE4uRXhwcmVzc2lvbiB7XG4gICAgICBjb25zdCBzdGFydFBvcyA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgICBjb25zdCBzdGFydExvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgICBjb25zdCBpc01vdW50ID0gdGhpcy5pc0NvbnRleHR1YWwoXCJtb3VudFwiKTtcblxuICAgICAgaWYgKGlzTW91bnQgJiYgdGhpcy5pc01vdW50QWxsb3dlZCgpKSB7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBjb25zdCBleHByID0gdGhpcy5wYXJzZU1vdW50KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICAgIGlmICghc2F3VW5hcnkpIHRoaXMuY2hlY2tFeHBvbmVudGlhbEFmdGVyVW5hcnkoZXhwcik7XG4gICAgICAgIHJldHVybiBleHByO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1cGVyLnBhcnNlTWF5YmVVbmFyeShyZWZFeHByZXNzaW9uRXJyb3JzLCBzYXdVbmFyeSk7XG4gICAgfVxuXG4gICAgcGFyc2VNb3VudChzdGFydFBvczogbnVtYmVyLCBzdGFydExvYzogUG9zaXRpb24pOiBOLkF3YWl0RXhwcmVzc2lvbiB7XG4gICAgICBjb25zdCBub2RlID0gdGhpcy5wYXJzZUF3YWl0KHN0YXJ0UG9zLCBzdGFydExvYyk7XG4gICAgICBub2RlLnR5cGUgPSAnTW91bnRFeHByZXNzaW9uJztcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHBhcnNlRXhwckF0b20ocmVmRXhwcmVzc2lvbkVycm9ycz86ID9FeHByZXNzaW9uRXJyb3JzKTogTi5FeHByZXNzaW9uIHtcbiAgICAgIGxldCBub2RlO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUudHlwZSkge1xuICAgICAgICBjYXNlIHR0Lm5hbWU6IHtcbiAgICAgICAgICBjb25zdCBjYW5CZUFycm93ID0gdGhpcy5zdGF0ZS5wb3RlbnRpYWxBcnJvd0F0ID09PSB0aGlzLnN0YXRlLnN0YXJ0O1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5zRXNjID0gdGhpcy5zdGF0ZS5jb250YWluc0VzYztcbiAgICAgICAgICBjb25zdCBpZCA9IHRoaXMucGFyc2VJZGVudGlmaWVyKCk7XG5cbiAgICAgICAgICBpZiAoIWNvbnRhaW5zRXNjICYmIChpZC5uYW1lID09PSBcImxpdmVcIikgJiYgIXRoaXMuY2FuSW5zZXJ0U2VtaWNvbG9uKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoKHR0Ll9mdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydE5vZGVBdE5vZGUoaWQpLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICB0cnVlLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0Lm5hbWUpKSB7XG4gICAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRva2VuIGJlZ2lucyB3aXRoIFwiPVwiLCBjb21taXQgdG8gcGFyc2luZyBhbiBhc3luY1xuICAgICAgICAgICAgICAvLyBhcnJvdyBmdW5jdGlvbi4gKFBlZWtpbmcgYWhlYWQgZm9yIFwiPVwiIGxldHMgdXMgYXZvaWQgYSBtb3JlXG4gICAgICAgICAgICAgIC8vIGV4cGVuc2l2ZSBmdWxsLXRva2VuIGxvb2thaGVhZCBvbiB0aGlzIGNvbW1vbiBwYXRoLilcbiAgICAgICAgICAgICAgaWYgKHRoaXMubG9va2FoZWFkQ2hhckNvZGUoKSA9PT0gY2hhckNvZGVzLmVxdWFsc1RvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VMaXZlQXJyb3dVbmFyeUZ1bmN0aW9uKGlkKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIHRyZWF0IFwiYXN5bmNcIiBhcyBhbiBpZGVudGlmaWVyIGFuZCBsZXQgY2FsbGluZyBjb2RlXG4gICAgICAgICAgICAgICAgLy8gZGVhbCB3aXRoIHRoZSBjdXJyZW50IHR0Lm5hbWUgdG9rZW4uXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbkJlQXJyb3cgJiYgdGhpcy5tYXRjaCh0dC5hcnJvdykgJiYgIXRoaXMuY2FuSW5zZXJ0U2VtaWNvbG9uKCkpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VBcnJvd0V4cHJlc3Npb24oXG4gICAgICAgICAgICAgIHRoaXMuc3RhcnROb2RlQXROb2RlKGlkKSxcbiAgICAgICAgICAgICAgW2lkXSxcbiAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBzdXBlci5wYXJzZUV4cHJBdG9tKHJlZkV4cHJlc3Npb25FcnJvcnMpO1xuICAgICAgfVxuICAgIH1cblxuICB9Il19