"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newParameterDeclarationScope = newParameterDeclarationScope;
exports.newArrowHeadScope = newArrowHeadScope;
exports.newAsyncArrowScope = newAsyncArrowScope;
exports.newExpressionScope = newExpressionScope;
exports["default"] = void 0;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*:: declare var invariant; */

/**
 * @module util/expression-scope

ExpressionScope is used to track declaration errors in these ambiguous patterns:

- CoverParenthesizedExpressionAndArrowParameterList
  e.g. we don't know if `({ x })` is an parenthesized expression or an
  arrow function parameters until we see an `=>` after `)`.

- CoverCallExpressionAndAsyncArrowHead
   e.g. we don't know if `async({ x })` is a call expression or an async arrow
   function parameters until we see an `=>` after `)`

The following declaration errors (@see parser/error-message) will be recorded in
some expression scopes and thrown later when we know what the ambigous pattern is

- AwaitBindingIdentifier
- AwaitExpressionFormalParameter
- YieldInParameter
- InvalidParenthesizedAssignment when parenthesized is an identifier

There are four different expression scope
- Expression
  A general scope that represents program / function body / static block. No errors
  will be recorded nor thrown in this scope.

- MaybeArrowParameterDeclaration
  A scope that represents ambiguous arrow head e.g. `(x)`. Errors will be recorded
  alongside parent scopes and thrown when `ExpressionScopeHandler#validateAsPattern`
  is called.

- MaybeAsyncArrowParameterDeclaration
  A scope that represents ambiguous async arrow head e.g. `async(x)`. Errors will
  be recorded alongside parent scopes and thrown when
  `ExpressionScopeHandler#validateAsPattern` is called.

- ParameterDeclaration
  A scope that represents unambiguous function parameters `function(x)`. Errors
  recorded in this scope will be thrown immediately. No errors will be recorded in
  this scope.

// @see {@link https://docs.google.com/document/d/1FAvEp9EUK-G8kHfDIEo_385Hs2SUBCYbJ5H-NnLvq8M|V8 Expression Scope design docs}
 */
var kExpression = 0,
    kMaybeArrowParameterDeclaration = 1,
    kMaybeAsyncArrowParameterDeclaration = 2,
    kParameterDeclaration = 3;

var ExpressionScope = /*#__PURE__*/function () {
  function ExpressionScope() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : kExpression;

    _classCallCheck(this, ExpressionScope);

    _defineProperty(this, "type", void 0);

    this.type = type;
  }

  _createClass(ExpressionScope, [{
    key: "canBeArrowParameterDeclaration",
    value: function canBeArrowParameterDeclaration() {
      return this.type === kMaybeAsyncArrowParameterDeclaration || this.type === kMaybeArrowParameterDeclaration;
    }
  }, {
    key: "isCertainlyParameterDeclaration",
    value: function isCertainlyParameterDeclaration() {
      return this.type === kParameterDeclaration;
    }
  }]);

  return ExpressionScope;
}();

var ArrowHeadParsingScope = /*#__PURE__*/function (_ExpressionScope) {
  _inherits(ArrowHeadParsingScope, _ExpressionScope);

  var _super = _createSuper(ArrowHeadParsingScope);

  function ArrowHeadParsingScope(type) {
    var _this;

    _classCallCheck(this, ArrowHeadParsingScope);

    _this = _super.call(this, type);

    _defineProperty(_assertThisInitialized(_this), "errors", new Map());

    return _this;
  }

  _createClass(ArrowHeadParsingScope, [{
    key: "recordDeclarationError",
    value: function recordDeclarationError(pos, template) {
      this.errors.set(pos, template);
    }
  }, {
    key: "clearDeclarationError",
    value: function clearDeclarationError(pos) {
      this.errors["delete"](pos);
    }
  }, {
    key: "iterateErrors",
    value: function iterateErrors(iterator) {
      this.errors.forEach(iterator);
    }
  }]);

  return ArrowHeadParsingScope;
}(ExpressionScope);

var ExpressionScopeHandler = /*#__PURE__*/function () {
  function ExpressionScopeHandler(raise) {
    _classCallCheck(this, ExpressionScopeHandler);

    _defineProperty(this, "stack", [new ExpressionScope()]);

    this.raise = raise;
  }

  _createClass(ExpressionScopeHandler, [{
    key: "enter",
    value: function enter(scope) {
      this.stack.push(scope);
    }
  }, {
    key: "exit",
    value: function exit() {
      this.stack.pop();
    }
    /**
     * Record likely parameter initializer errors
     *
     * When current scope is a ParameterDeclaration, the error will be thrown immediately,
     * otherwise it will be recorded to any ancestry MaybeArrowParameterDeclaration and
     * MaybeAsyncArrowParameterDeclaration scope until an Expression scope is seen.
     * @param {number} pos Error position
     * @param {ErrorTemplate} template Error template
     * @memberof ExpressionScopeHandler
     */

  }, {
    key: "recordParameterInitializerError",
    value: function recordParameterInitializerError(pos, template) {
      var stack = this.stack;
      var i = stack.length - 1;
      var scope = stack[i];

      while (!scope.isCertainlyParameterDeclaration()) {
        if (scope.canBeArrowParameterDeclaration()) {
          /*:: invariant(scope instanceof ArrowHeadParsingScope) */
          scope.recordDeclarationError(pos, template);
        } else {
          /*:: invariant(scope.type == kExpression) */
          // Type-Expression is the boundary where initializer error can populate to
          return;
        }

        scope = stack[--i];
      }
      /* eslint-disable @babel/development-internal/dry-error-messages */


      this.raise(pos, template);
    }
    /**
     * Record parenthesized identifier errors
     *
     * A parenthesized identifier in LHS can be ambiguous because the assignment
     * can be transformed to an assignable later, but not vice versa:
     * For example, in `([(a) = []] = []) => {}`, we think `(a) = []` is an LHS in `[(a) = []]`,
     * an LHS within `[(a) = []] = []`. However the LHS chain is then transformed by toAssignable,
     * and we should throw assignment `(a)`, which is only valid in LHS. Hence we record the
     * location of parenthesized `(a)` to current scope if it is one of MaybeArrowParameterDeclaration
     * and MaybeAsyncArrowParameterDeclaration
     *
     * Unlike `recordParameterInitializerError`, we don't record to ancestry scope because we
     * validate arrow head parsing scope before exit, and then the LHS will be unambiguous:
     * For example, in `( x = ( [(a) = []] = [] ) ) => {}`, we should not record `(a)` in `( x = ... ) =>`
     * arrow scope because when we finish parsing `( [(a) = []] = [] )`, it is an unambiguous assignment
     * expression and can not be cast to pattern
     * @param {number} pos
     * @param {ErrorTemplate} template
     * @returns {void}
     * @memberof ExpressionScopeHandler
     */

  }, {
    key: "recordParenthesizedIdentifierError",
    value: function recordParenthesizedIdentifierError(pos, template) {
      var stack = this.stack;
      var scope = stack[stack.length - 1];

      if (scope.isCertainlyParameterDeclaration()) {
        this.raise(pos, template);
      } else if (scope.canBeArrowParameterDeclaration()) {
        /*:: invariant(scope instanceof ArrowHeadParsingScope) */
        scope.recordDeclarationError(pos, template);
      } else {
        return;
      }
    }
    /**
     * Record likely async arrow parameter errors
     *
     * Errors will be recorded to any ancestry MaybeAsyncArrowParameterDeclaration
     * scope until an Expression scope is seen.
     * @param {number} pos
     * @param {ErrorTemplate} template
     * @memberof ExpressionScopeHandler
     */

  }, {
    key: "recordAsyncArrowParametersError",
    value: function recordAsyncArrowParametersError(pos, template) {
      var stack = this.stack;
      var i = stack.length - 1;
      var scope = stack[i];

      while (scope.canBeArrowParameterDeclaration()) {
        if (scope.type === kMaybeAsyncArrowParameterDeclaration) {
          /*:: invariant(scope instanceof ArrowHeadParsingScope) */
          scope.recordDeclarationError(pos, template);
        }

        scope = stack[--i];
      }
    }
  }, {
    key: "validateAsPattern",
    value: function validateAsPattern() {
      var _this2 = this;

      var stack = this.stack;
      var currentScope = stack[stack.length - 1];
      if (!currentScope.canBeArrowParameterDeclaration()) return;
      /*:: invariant(currentScope instanceof ArrowHeadParsingScope) */

      currentScope.iterateErrors(function (template, pos) {
        /* eslint-disable @babel/development-internal/dry-error-messages */
        _this2.raise(pos, template); // iterate from parent scope


        var i = stack.length - 2;
        var scope = stack[i];

        while (scope.canBeArrowParameterDeclaration()) {
          /*:: invariant(scope instanceof ArrowHeadParsingScope) */
          scope.clearDeclarationError(pos);
          scope = stack[--i];
        }
      });
    }
  }]);

  return ExpressionScopeHandler;
}();

exports["default"] = ExpressionScopeHandler;

function newParameterDeclarationScope() {
  return new ExpressionScope(kParameterDeclaration);
}

function newArrowHeadScope() {
  return new ArrowHeadParsingScope(kMaybeArrowParameterDeclaration);
}

function newAsyncArrowScope() {
  return new ArrowHeadParsingScope(kMaybeAsyncArrowParameterDeclaration);
}

function newExpressionScope() {
  return new ExpressionScope();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2V4cHJlc3Npb24tc2NvcGUuanMiXSwibmFtZXMiOlsia0V4cHJlc3Npb24iLCJrTWF5YmVBcnJvd1BhcmFtZXRlckRlY2xhcmF0aW9uIiwia01heWJlQXN5bmNBcnJvd1BhcmFtZXRlckRlY2xhcmF0aW9uIiwia1BhcmFtZXRlckRlY2xhcmF0aW9uIiwiRXhwcmVzc2lvblNjb3BlIiwidHlwZSIsIkFycm93SGVhZFBhcnNpbmdTY29wZSIsIk1hcCIsInBvcyIsInRlbXBsYXRlIiwiZXJyb3JzIiwic2V0IiwiaXRlcmF0b3IiLCJmb3JFYWNoIiwiRXhwcmVzc2lvblNjb3BlSGFuZGxlciIsInJhaXNlIiwic2NvcGUiLCJzdGFjayIsInB1c2giLCJwb3AiLCJpIiwibGVuZ3RoIiwiaXNDZXJ0YWlubHlQYXJhbWV0ZXJEZWNsYXJhdGlvbiIsImNhbkJlQXJyb3dQYXJhbWV0ZXJEZWNsYXJhdGlvbiIsInJlY29yZERlY2xhcmF0aW9uRXJyb3IiLCJjdXJyZW50U2NvcGUiLCJpdGVyYXRlRXJyb3JzIiwiY2xlYXJEZWNsYXJhdGlvbkVycm9yIiwibmV3UGFyYW1ldGVyRGVjbGFyYXRpb25TY29wZSIsIm5ld0Fycm93SGVhZFNjb3BlIiwibmV3QXN5bmNBcnJvd1Njb3BlIiwibmV3RXhwcmVzc2lvblNjb3BlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsV0FBVyxHQUFHLENBQXBC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LEdBQUdDLEtBQUssQ0FBQ0csQ0FBRCxDQUFqQjs7QUFDQSxlQUFPSixLQUFLLENBQUNPLDhCQUFOLEVBQVAsRUFBK0M7QUFDN0M7QUFDQVAsVUFBQUEsS0FBSyxDQUFDVyxxQkFBTixDQUE0Qm5CLEdBQTVCO0FBQ0FRLFVBQUFBLEtBQUssR0FBR0MsS0FBSyxDQUFDLEVBQUVHLENBQUgsQ0FBYjtBQUNEO0FBQ0YsT0FYRDtBQVlEOzs7Ozs7OztBQUdJLFNBQVNRLDRCQUFULEdBQXdDO0FBQzdDLFNBQU8sSUFBSXhCLGVBQUosQ0FBb0JELHFCQUFwQixDQUFQO0FBQ0Q7O0FBRU0sU0FBUzBCLGlCQUFULEdBQTZCO0FBQ2xDLFNBQU8sSUFBSXZCLHFCQUFKLENBQTBCTCwrQkFBMUIsQ0FBUDtBQUNEOztBQUVNLFNBQVM2QixrQkFBVCxHQUE4QjtBQUNuQyxTQUFPLElBQUl4QixxQkFBSixDQUEwQkosb0NBQTFCLENBQVA7QUFDRDs7QUFFTSxTQUFTNkIsa0JBQVQsR0FBOEI7QUFDbkMsU0FBTyxJQUFJM0IsZUFBSixFQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IEVycm9yVGVtcGxhdGUsIHJhaXNlRnVuY3Rpb24gfSBmcm9tIFwiLi4vcGFyc2VyL2Vycm9yXCI7XG5cbi8qOjogZGVjbGFyZSB2YXIgaW52YXJpYW50OyAqL1xuLyoqXG4gKiBAbW9kdWxlIHV0aWwvZXhwcmVzc2lvbi1zY29wZVxuXG5FeHByZXNzaW9uU2NvcGUgaXMgdXNlZCB0byB0cmFjayBkZWNsYXJhdGlvbiBlcnJvcnMgaW4gdGhlc2UgYW1iaWd1b3VzIHBhdHRlcm5zOlxuXG4tIENvdmVyUGFyZW50aGVzaXplZEV4cHJlc3Npb25BbmRBcnJvd1BhcmFtZXRlckxpc3RcbiAgZS5nLiB3ZSBkb24ndCBrbm93IGlmIGAoeyB4IH0pYCBpcyBhbiBwYXJlbnRoZXNpemVkIGV4cHJlc3Npb24gb3IgYW5cbiAgYXJyb3cgZnVuY3Rpb24gcGFyYW1ldGVycyB1bnRpbCB3ZSBzZWUgYW4gYD0+YCBhZnRlciBgKWAuXG5cbi0gQ292ZXJDYWxsRXhwcmVzc2lvbkFuZEFzeW5jQXJyb3dIZWFkXG4gICBlLmcuIHdlIGRvbid0IGtub3cgaWYgYGFzeW5jKHsgeCB9KWAgaXMgYSBjYWxsIGV4cHJlc3Npb24gb3IgYW4gYXN5bmMgYXJyb3dcbiAgIGZ1bmN0aW9uIHBhcmFtZXRlcnMgdW50aWwgd2Ugc2VlIGFuIGA9PmAgYWZ0ZXIgYClgXG5cblRoZSBmb2xsb3dpbmcgZGVjbGFyYXRpb24gZXJyb3JzIChAc2VlIHBhcnNlci9lcnJvci1tZXNzYWdlKSB3aWxsIGJlIHJlY29yZGVkIGluXG5zb21lIGV4cHJlc3Npb24gc2NvcGVzIGFuZCB0aHJvd24gbGF0ZXIgd2hlbiB3ZSBrbm93IHdoYXQgdGhlIGFtYmlnb3VzIHBhdHRlcm4gaXNcblxuLSBBd2FpdEJpbmRpbmdJZGVudGlmaWVyXG4tIEF3YWl0RXhwcmVzc2lvbkZvcm1hbFBhcmFtZXRlclxuLSBZaWVsZEluUGFyYW1ldGVyXG4tIEludmFsaWRQYXJlbnRoZXNpemVkQXNzaWdubWVudCB3aGVuIHBhcmVudGhlc2l6ZWQgaXMgYW4gaWRlbnRpZmllclxuXG5UaGVyZSBhcmUgZm91ciBkaWZmZXJlbnQgZXhwcmVzc2lvbiBzY29wZVxuLSBFeHByZXNzaW9uXG4gIEEgZ2VuZXJhbCBzY29wZSB0aGF0IHJlcHJlc2VudHMgcHJvZ3JhbSAvIGZ1bmN0aW9uIGJvZHkgLyBzdGF0aWMgYmxvY2suIE5vIGVycm9yc1xuICB3aWxsIGJlIHJlY29yZGVkIG5vciB0aHJvd24gaW4gdGhpcyBzY29wZS5cblxuLSBNYXliZUFycm93UGFyYW1ldGVyRGVjbGFyYXRpb25cbiAgQSBzY29wZSB0aGF0IHJlcHJlc2VudHMgYW1iaWd1b3VzIGFycm93IGhlYWQgZS5nLiBgKHgpYC4gRXJyb3JzIHdpbGwgYmUgcmVjb3JkZWRcbiAgYWxvbmdzaWRlIHBhcmVudCBzY29wZXMgYW5kIHRocm93biB3aGVuIGBFeHByZXNzaW9uU2NvcGVIYW5kbGVyI3ZhbGlkYXRlQXNQYXR0ZXJuYFxuICBpcyBjYWxsZWQuXG5cbi0gTWF5YmVBc3luY0Fycm93UGFyYW1ldGVyRGVjbGFyYXRpb25cbiAgQSBzY29wZSB0aGF0IHJlcHJlc2VudHMgYW1iaWd1b3VzIGFzeW5jIGFycm93IGhlYWQgZS5nLiBgYXN5bmMoeClgLiBFcnJvcnMgd2lsbFxuICBiZSByZWNvcmRlZCBhbG9uZ3NpZGUgcGFyZW50IHNjb3BlcyBhbmQgdGhyb3duIHdoZW5cbiAgYEV4cHJlc3Npb25TY29wZUhhbmRsZXIjdmFsaWRhdGVBc1BhdHRlcm5gIGlzIGNhbGxlZC5cblxuLSBQYXJhbWV0ZXJEZWNsYXJhdGlvblxuICBBIHNjb3BlIHRoYXQgcmVwcmVzZW50cyB1bmFtYmlndW91cyBmdW5jdGlvbiBwYXJhbWV0ZXJzIGBmdW5jdGlvbih4KWAuIEVycm9yc1xuICByZWNvcmRlZCBpbiB0aGlzIHNjb3BlIHdpbGwgYmUgdGhyb3duIGltbWVkaWF0ZWx5LiBObyBlcnJvcnMgd2lsbCBiZSByZWNvcmRlZCBpblxuICB0aGlzIHNjb3BlLlxuXG4vLyBAc2VlIHtAbGluayBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9kb2N1bWVudC9kLzFGQXZFcDlFVUstRzhrSGZESUVvXzM4NUhzMlNVQkNZYko1SC1Obkx2cThNfFY4IEV4cHJlc3Npb24gU2NvcGUgZGVzaWduIGRvY3N9XG4gKi9cblxuY29uc3Qga0V4cHJlc3Npb24gPSAwLFxuICBrTWF5YmVBcnJvd1BhcmFtZXRlckRlY2xhcmF0aW9uID0gMSxcbiAga01heWJlQXN5bmNBcnJvd1BhcmFtZXRlckRlY2xhcmF0aW9uID0gMixcbiAga1BhcmFtZXRlckRlY2xhcmF0aW9uID0gMztcblxudHlwZSBFeHByZXNzaW9uU2NvcGVUeXBlID0gMCB8IDEgfCAyIHwgMztcblxuY2xhc3MgRXhwcmVzc2lvblNjb3BlIHtcbiAgdHlwZTogRXhwcmVzc2lvblNjb3BlVHlwZTtcblxuICBjb25zdHJ1Y3Rvcih0eXBlOiBFeHByZXNzaW9uU2NvcGVUeXBlID0ga0V4cHJlc3Npb24pIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICB9XG5cbiAgY2FuQmVBcnJvd1BhcmFtZXRlckRlY2xhcmF0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnR5cGUgPT09IGtNYXliZUFzeW5jQXJyb3dQYXJhbWV0ZXJEZWNsYXJhdGlvbiB8fFxuICAgICAgdGhpcy50eXBlID09PSBrTWF5YmVBcnJvd1BhcmFtZXRlckRlY2xhcmF0aW9uXG4gICAgKTtcbiAgfVxuXG4gIGlzQ2VydGFpbmx5UGFyYW1ldGVyRGVjbGFyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0ga1BhcmFtZXRlckRlY2xhcmF0aW9uO1xuICB9XG59XG5cbmNsYXNzIEFycm93SGVhZFBhcnNpbmdTY29wZSBleHRlbmRzIEV4cHJlc3Npb25TY29wZSB7XG4gIGVycm9yczogTWFwPC8qIHBvcyAqLyBudW1iZXIsIC8qIG1lc3NhZ2UgKi8gRXJyb3JUZW1wbGF0ZT4gPSBuZXcgTWFwKCk7XG4gIGNvbnN0cnVjdG9yKHR5cGU6IDEgfCAyKSB7XG4gICAgc3VwZXIodHlwZSk7XG4gIH1cbiAgcmVjb3JkRGVjbGFyYXRpb25FcnJvcihwb3M6IG51bWJlciwgdGVtcGxhdGU6IEVycm9yVGVtcGxhdGUpIHtcbiAgICB0aGlzLmVycm9ycy5zZXQocG9zLCB0ZW1wbGF0ZSk7XG4gIH1cbiAgY2xlYXJEZWNsYXJhdGlvbkVycm9yKHBvczogbnVtYmVyKSB7XG4gICAgdGhpcy5lcnJvcnMuZGVsZXRlKHBvcyk7XG4gIH1cbiAgaXRlcmF0ZUVycm9ycyhpdGVyYXRvcjogKHRlbXBsYXRlOiBFcnJvclRlbXBsYXRlLCBwb3M6IG51bWJlcikgPT4gdm9pZCkge1xuICAgIHRoaXMuZXJyb3JzLmZvckVhY2goaXRlcmF0b3IpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cHJlc3Npb25TY29wZUhhbmRsZXIge1xuICBzdGFjazogQXJyYXk8RXhwcmVzc2lvblNjb3BlPiA9IFtuZXcgRXhwcmVzc2lvblNjb3BlKCldO1xuICBkZWNsYXJlIHJhaXNlOiByYWlzZUZ1bmN0aW9uO1xuICBjb25zdHJ1Y3RvcihyYWlzZTogcmFpc2VGdW5jdGlvbikge1xuICAgIHRoaXMucmFpc2UgPSByYWlzZTtcbiAgfVxuICBlbnRlcihzY29wZTogRXhwcmVzc2lvblNjb3BlKSB7XG4gICAgdGhpcy5zdGFjay5wdXNoKHNjb3BlKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgdGhpcy5zdGFjay5wb3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmQgbGlrZWx5IHBhcmFtZXRlciBpbml0aWFsaXplciBlcnJvcnNcbiAgICpcbiAgICogV2hlbiBjdXJyZW50IHNjb3BlIGlzIGEgUGFyYW1ldGVyRGVjbGFyYXRpb24sIHRoZSBlcnJvciB3aWxsIGJlIHRocm93biBpbW1lZGlhdGVseSxcbiAgICogb3RoZXJ3aXNlIGl0IHdpbGwgYmUgcmVjb3JkZWQgdG8gYW55IGFuY2VzdHJ5IE1heWJlQXJyb3dQYXJhbWV0ZXJEZWNsYXJhdGlvbiBhbmRcbiAgICogTWF5YmVBc3luY0Fycm93UGFyYW1ldGVyRGVjbGFyYXRpb24gc2NvcGUgdW50aWwgYW4gRXhwcmVzc2lvbiBzY29wZSBpcyBzZWVuLlxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9zIEVycm9yIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7RXJyb3JUZW1wbGF0ZX0gdGVtcGxhdGUgRXJyb3IgdGVtcGxhdGVcbiAgICogQG1lbWJlcm9mIEV4cHJlc3Npb25TY29wZUhhbmRsZXJcbiAgICovXG4gIHJlY29yZFBhcmFtZXRlckluaXRpYWxpemVyRXJyb3IocG9zOiBudW1iZXIsIHRlbXBsYXRlOiBFcnJvclRlbXBsYXRlKTogdm9pZCB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGhpcztcbiAgICBsZXQgaSA9IHN0YWNrLmxlbmd0aCAtIDE7XG4gICAgbGV0IHNjb3BlOiBFeHByZXNzaW9uU2NvcGUgPSBzdGFja1tpXTtcbiAgICB3aGlsZSAoIXNjb3BlLmlzQ2VydGFpbmx5UGFyYW1ldGVyRGVjbGFyYXRpb24oKSkge1xuICAgICAgaWYgKHNjb3BlLmNhbkJlQXJyb3dQYXJhbWV0ZXJEZWNsYXJhdGlvbigpKSB7XG4gICAgICAgIC8qOjogaW52YXJpYW50KHNjb3BlIGluc3RhbmNlb2YgQXJyb3dIZWFkUGFyc2luZ1Njb3BlKSAqL1xuICAgICAgICBzY29wZS5yZWNvcmREZWNsYXJhdGlvbkVycm9yKHBvcywgdGVtcGxhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyo6OiBpbnZhcmlhbnQoc2NvcGUudHlwZSA9PSBrRXhwcmVzc2lvbikgKi9cbiAgICAgICAgLy8gVHlwZS1FeHByZXNzaW9uIGlzIHRoZSBib3VuZGFyeSB3aGVyZSBpbml0aWFsaXplciBlcnJvciBjYW4gcG9wdWxhdGUgdG9cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc2NvcGUgPSBzdGFja1stLWldO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBAYmFiZWwvZGV2ZWxvcG1lbnQtaW50ZXJuYWwvZHJ5LWVycm9yLW1lc3NhZ2VzICovXG4gICAgdGhpcy5yYWlzZShwb3MsIHRlbXBsYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmQgcGFyZW50aGVzaXplZCBpZGVudGlmaWVyIGVycm9yc1xuICAgKlxuICAgKiBBIHBhcmVudGhlc2l6ZWQgaWRlbnRpZmllciBpbiBMSFMgY2FuIGJlIGFtYmlndW91cyBiZWNhdXNlIHRoZSBhc3NpZ25tZW50XG4gICAqIGNhbiBiZSB0cmFuc2Zvcm1lZCB0byBhbiBhc3NpZ25hYmxlIGxhdGVyLCBidXQgbm90IHZpY2UgdmVyc2E6XG4gICAqIEZvciBleGFtcGxlLCBpbiBgKFsoYSkgPSBbXV0gPSBbXSkgPT4ge31gLCB3ZSB0aGluayBgKGEpID0gW11gIGlzIGFuIExIUyBpbiBgWyhhKSA9IFtdXWAsXG4gICAqIGFuIExIUyB3aXRoaW4gYFsoYSkgPSBbXV0gPSBbXWAuIEhvd2V2ZXIgdGhlIExIUyBjaGFpbiBpcyB0aGVuIHRyYW5zZm9ybWVkIGJ5IHRvQXNzaWduYWJsZSxcbiAgICogYW5kIHdlIHNob3VsZCB0aHJvdyBhc3NpZ25tZW50IGAoYSlgLCB3aGljaCBpcyBvbmx5IHZhbGlkIGluIExIUy4gSGVuY2Ugd2UgcmVjb3JkIHRoZVxuICAgKiBsb2NhdGlvbiBvZiBwYXJlbnRoZXNpemVkIGAoYSlgIHRvIGN1cnJlbnQgc2NvcGUgaWYgaXQgaXMgb25lIG9mIE1heWJlQXJyb3dQYXJhbWV0ZXJEZWNsYXJhdGlvblxuICAgKiBhbmQgTWF5YmVBc3luY0Fycm93UGFyYW1ldGVyRGVjbGFyYXRpb25cbiAgICpcbiAgICogVW5saWtlIGByZWNvcmRQYXJhbWV0ZXJJbml0aWFsaXplckVycm9yYCwgd2UgZG9uJ3QgcmVjb3JkIHRvIGFuY2VzdHJ5IHNjb3BlIGJlY2F1c2Ugd2VcbiAgICogdmFsaWRhdGUgYXJyb3cgaGVhZCBwYXJzaW5nIHNjb3BlIGJlZm9yZSBleGl0LCBhbmQgdGhlbiB0aGUgTEhTIHdpbGwgYmUgdW5hbWJpZ3VvdXM6XG4gICAqIEZvciBleGFtcGxlLCBpbiBgKCB4ID0gKCBbKGEpID0gW11dID0gW10gKSApID0+IHt9YCwgd2Ugc2hvdWxkIG5vdCByZWNvcmQgYChhKWAgaW4gYCggeCA9IC4uLiApID0+YFxuICAgKiBhcnJvdyBzY29wZSBiZWNhdXNlIHdoZW4gd2UgZmluaXNoIHBhcnNpbmcgYCggWyhhKSA9IFtdXSA9IFtdIClgLCBpdCBpcyBhbiB1bmFtYmlndW91cyBhc3NpZ25tZW50XG4gICAqIGV4cHJlc3Npb24gYW5kIGNhbiBub3QgYmUgY2FzdCB0byBwYXR0ZXJuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NcbiAgICogQHBhcmFtIHtFcnJvclRlbXBsYXRlfSB0ZW1wbGF0ZVxuICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICogQG1lbWJlcm9mIEV4cHJlc3Npb25TY29wZUhhbmRsZXJcbiAgICovXG4gIHJlY29yZFBhcmVudGhlc2l6ZWRJZGVudGlmaWVyRXJyb3IoXG4gICAgcG9zOiBudW1iZXIsXG4gICAgdGVtcGxhdGU6IEVycm9yVGVtcGxhdGUsXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRoaXM7XG4gICAgY29uc3Qgc2NvcGU6IEV4cHJlc3Npb25TY29wZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIGlmIChzY29wZS5pc0NlcnRhaW5seVBhcmFtZXRlckRlY2xhcmF0aW9uKCkpIHtcbiAgICAgIHRoaXMucmFpc2UocG9zLCB0ZW1wbGF0ZSk7XG4gICAgfSBlbHNlIGlmIChzY29wZS5jYW5CZUFycm93UGFyYW1ldGVyRGVjbGFyYXRpb24oKSkge1xuICAgICAgLyo6OiBpbnZhcmlhbnQoc2NvcGUgaW5zdGFuY2VvZiBBcnJvd0hlYWRQYXJzaW5nU2NvcGUpICovXG4gICAgICBzY29wZS5yZWNvcmREZWNsYXJhdGlvbkVycm9yKHBvcywgdGVtcGxhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY29yZCBsaWtlbHkgYXN5bmMgYXJyb3cgcGFyYW1ldGVyIGVycm9yc1xuICAgKlxuICAgKiBFcnJvcnMgd2lsbCBiZSByZWNvcmRlZCB0byBhbnkgYW5jZXN0cnkgTWF5YmVBc3luY0Fycm93UGFyYW1ldGVyRGVjbGFyYXRpb25cbiAgICogc2NvcGUgdW50aWwgYW4gRXhwcmVzc2lvbiBzY29wZSBpcyBzZWVuLlxuICAgKiBAcGFyYW0ge251bWJlcn0gcG9zXG4gICAqIEBwYXJhbSB7RXJyb3JUZW1wbGF0ZX0gdGVtcGxhdGVcbiAgICogQG1lbWJlcm9mIEV4cHJlc3Npb25TY29wZUhhbmRsZXJcbiAgICovXG4gIHJlY29yZEFzeW5jQXJyb3dQYXJhbWV0ZXJzRXJyb3IocG9zOiBudW1iZXIsIHRlbXBsYXRlOiBFcnJvclRlbXBsYXRlKTogdm9pZCB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGhpcztcbiAgICBsZXQgaSA9IHN0YWNrLmxlbmd0aCAtIDE7XG4gICAgbGV0IHNjb3BlOiBFeHByZXNzaW9uU2NvcGUgPSBzdGFja1tpXTtcbiAgICB3aGlsZSAoc2NvcGUuY2FuQmVBcnJvd1BhcmFtZXRlckRlY2xhcmF0aW9uKCkpIHtcbiAgICAgIGlmIChzY29wZS50eXBlID09PSBrTWF5YmVBc3luY0Fycm93UGFyYW1ldGVyRGVjbGFyYXRpb24pIHtcbiAgICAgICAgLyo6OiBpbnZhcmlhbnQoc2NvcGUgaW5zdGFuY2VvZiBBcnJvd0hlYWRQYXJzaW5nU2NvcGUpICovXG4gICAgICAgIHNjb3BlLnJlY29yZERlY2xhcmF0aW9uRXJyb3IocG9zLCB0ZW1wbGF0ZSk7XG4gICAgICB9XG4gICAgICBzY29wZSA9IHN0YWNrWy0taV07XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGVBc1BhdHRlcm4oKTogdm9pZCB7XG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGhpcztcbiAgICBjb25zdCBjdXJyZW50U2NvcGUgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICBpZiAoIWN1cnJlbnRTY29wZS5jYW5CZUFycm93UGFyYW1ldGVyRGVjbGFyYXRpb24oKSkgcmV0dXJuO1xuICAgIC8qOjogaW52YXJpYW50KGN1cnJlbnRTY29wZSBpbnN0YW5jZW9mIEFycm93SGVhZFBhcnNpbmdTY29wZSkgKi9cbiAgICBjdXJyZW50U2NvcGUuaXRlcmF0ZUVycm9ycygodGVtcGxhdGUsIHBvcykgPT4ge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgQGJhYmVsL2RldmVsb3BtZW50LWludGVybmFsL2RyeS1lcnJvci1tZXNzYWdlcyAqL1xuICAgICAgdGhpcy5yYWlzZShwb3MsIHRlbXBsYXRlKTtcbiAgICAgIC8vIGl0ZXJhdGUgZnJvbSBwYXJlbnQgc2NvcGVcbiAgICAgIGxldCBpID0gc3RhY2subGVuZ3RoIC0gMjtcbiAgICAgIGxldCBzY29wZSA9IHN0YWNrW2ldO1xuICAgICAgd2hpbGUgKHNjb3BlLmNhbkJlQXJyb3dQYXJhbWV0ZXJEZWNsYXJhdGlvbigpKSB7XG4gICAgICAgIC8qOjogaW52YXJpYW50KHNjb3BlIGluc3RhbmNlb2YgQXJyb3dIZWFkUGFyc2luZ1Njb3BlKSAqL1xuICAgICAgICBzY29wZS5jbGVhckRlY2xhcmF0aW9uRXJyb3IocG9zKTtcbiAgICAgICAgc2NvcGUgPSBzdGFja1stLWldO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdQYXJhbWV0ZXJEZWNsYXJhdGlvblNjb3BlKCkge1xuICByZXR1cm4gbmV3IEV4cHJlc3Npb25TY29wZShrUGFyYW1ldGVyRGVjbGFyYXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV3QXJyb3dIZWFkU2NvcGUoKSB7XG4gIHJldHVybiBuZXcgQXJyb3dIZWFkUGFyc2luZ1Njb3BlKGtNYXliZUFycm93UGFyYW1ldGVyRGVjbGFyYXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV3QXN5bmNBcnJvd1Njb3BlKCkge1xuICByZXR1cm4gbmV3IEFycm93SGVhZFBhcnNpbmdTY29wZShrTWF5YmVBc3luY0Fycm93UGFyYW1ldGVyRGVjbGFyYXRpb24pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV3RXhwcmVzc2lvblNjb3BlKCkge1xuICByZXR1cm4gbmV3IEV4cHJlc3Npb25TY29wZSgpO1xufVxuIl19