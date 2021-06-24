"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionErrors = exports["default"] = void 0;

var _types = require("../tokenizer/types");

var _tokenizer = _interopRequireDefault(require("../tokenizer"));

var _state = _interopRequireDefault(require("../tokenizer/state"));

var _whitespace = require("../util/whitespace");

var _identifier = require("../util/identifier");

var _classScope = _interopRequireDefault(require("../util/class-scope"));

var _expressionScope = _interopRequireDefault(require("../util/expression-scope"));

var _scopeflags = require("../util/scopeflags");

var _productionParameter = _interopRequireWildcard(require("../util/production-parameter"));

var _error = require("./error");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

// ## Parser utilities
var UtilParser = /*#__PURE__*/function (_Tokenizer) {
  _inherits(UtilParser, _Tokenizer);

  var _super = _createSuper(UtilParser);

  function UtilParser() {
    _classCallCheck(this, UtilParser);

    return _super.apply(this, arguments);
  }

  _createClass(UtilParser, [{
    key: "addExtra",
    value: // Forward-declaration: defined in parser/index.js

    /*::
    +getScopeHandler: () => Class<ScopeHandler<*>>;
    */
    // TODO
    function addExtra(node, key, val) {
      if (!node) return;
      var extra = node.extra = node.extra || {};
      extra[key] = val;
    } // TODO

  }, {
    key: "isRelational",
    value: function isRelational(op) {
      return this.match(_types.types.relational) && this.state.value === op;
    } // TODO

  }, {
    key: "expectRelational",
    value: function expectRelational(op) {
      if (this.isRelational(op)) {
        this.next();
      } else {
        this.unexpected(null, _types.types.relational);
      }
    } // Tests whether parsed token is a contextual keyword.

  }, {
    key: "isContextual",
    value: function isContextual(name) {
      return this.match(_types.types.name) && this.state.value === name && !this.state.containsEsc;
    }
  }, {
    key: "isUnparsedContextual",
    value: function isUnparsedContextual(nameStart, name) {
      var nameEnd = nameStart + name.length;

      if (this.input.slice(nameStart, nameEnd) === name) {
        var nextCh = this.input.charCodeAt(nameEnd);
        return !((0, _identifier.isIdentifierChar)(nextCh) || // check if `nextCh is between 0xd800 - 0xdbff,
        // if `nextCh` is NaN, `NaN & 0xfc00` is 0, the function
        // returns true
        (nextCh & 0xfc00) === 0xd800);
      }

      return false;
    }
  }, {
    key: "isLookaheadContextual",
    value: function isLookaheadContextual(name) {
      var next = this.nextTokenStart();
      return this.isUnparsedContextual(next, name);
    } // Consumes contextual keyword if possible.

  }, {
    key: "eatContextual",
    value: function eatContextual(name) {
      return this.isContextual(name) && this.eat(_types.types.name);
    } // Asserts that following token is given contextual keyword.

  }, {
    key: "expectContextual",
    value: function expectContextual(name, template) {
      if (!this.eatContextual(name)) this.unexpected(null, template);
    } // Test whether a semicolon can be inserted at the current position.

  }, {
    key: "canInsertSemicolon",
    value: function canInsertSemicolon() {
      return this.match(_types.types.eof) || this.match(_types.types.braceR) || this.hasPrecedingLineBreak();
    }
  }, {
    key: "hasPrecedingLineBreak",
    value: function hasPrecedingLineBreak() {
      return _whitespace.lineBreak.test(this.input.slice(this.state.lastTokEnd, this.state.start));
    }
  }, {
    key: "hasFollowingLineBreak",
    value: function hasFollowingLineBreak() {
      return _whitespace.lineBreak.test(this.input.slice(this.state.end, this.nextTokenStart()));
    } // TODO

  }, {
    key: "isLineTerminator",
    value: function isLineTerminator() {
      return this.eat(_types.types.semi) || this.canInsertSemicolon();
    } // Consume a semicolon, or, failing that, see if we are allowed to
    // pretend that there is a semicolon at this position.

  }, {
    key: "semicolon",
    value: function semicolon() {
      var allowAsi = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (allowAsi ? this.isLineTerminator() : this.eat(_types.types.semi)) return;
      this.raise(this.state.lastTokEnd, _error.Errors.MissingSemicolon);
    } // Expect a token of a given type. If found, consume it, otherwise,
    // raise an unexpected token error at given pos.

  }, {
    key: "expect",
    value: function expect(type, pos) {
      this.eat(type) || this.unexpected(pos, type);
    } // Throws if the current token and the prev one are separated by a space.

  }, {
    key: "assertNoSpace",
    value: function assertNoSpace() {
      var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Unexpected space.";

      if (this.state.start > this.state.lastTokEnd) {
        /* eslint-disable @babel/development-internal/dry-error-messages */
        this.raise(this.state.lastTokEnd, {
          code: _error.ErrorCodes.SyntaxError,
          reasonCode: "UnexpectedSpace",
          template: message
        });
        /* eslint-enable @babel/development-internal/dry-error-messages */
      }
    } // Raise an unexpected token error. Can take the expected token type
    // instead of a message string.

  }, {
    key: "unexpected",
    value: function unexpected(pos) {
      var messageOrType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        code: _error.ErrorCodes.SyntaxError,
        reasonCode: "UnexpectedToken",
        template: "Unexpected token"
      };

      if (messageOrType instanceof _types.TokenType) {
        messageOrType = {
          code: _error.ErrorCodes.SyntaxError,
          reasonCode: "UnexpectedToken",
          template: "Unexpected token, expected \"".concat(messageOrType.label, "\"")
        };
      }
      /* eslint-disable @babel/development-internal/dry-error-messages */


      throw this.raise(pos != null ? pos : this.state.start, messageOrType);
      /* eslint-enable @babel/development-internal/dry-error-messages */
    }
  }, {
    key: "expectPlugin",
    value: function expectPlugin(name, pos) {
      if (!this.hasPlugin(name)) {
        throw this.raiseWithData(pos != null ? pos : this.state.start, {
          missingPlugin: [name]
        }, "This experimental syntax requires enabling the parser plugin: '".concat(name, "'"));
      }

      return true;
    }
  }, {
    key: "expectOnePlugin",
    value: function expectOnePlugin(names, pos) {
      var _this = this;

      if (!names.some(function (n) {
        return _this.hasPlugin(n);
      })) {
        throw this.raiseWithData(pos != null ? pos : this.state.start, {
          missingPlugin: names
        }, "This experimental syntax requires enabling one of the following parser plugin(s): '".concat(names.join(", "), "'"));
      }
    } // tryParse will clone parser state.
    // It is expensive and should be used with cautions

  }, {
    key: "tryParse",
    value: function tryParse(fn) {
      var oldState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.clone();
      var abortSignal = {
        node: null
      };

      try {
        var _node = fn(function () {
          var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          abortSignal.node = node;
          throw abortSignal;
        });

        if (this.state.errors.length > oldState.errors.length) {
          var failState = this.state;
          this.state = oldState; // tokensLength should be preserved during error recovery mode
          // since the parser does not halt and will instead parse the
          // remaining tokens

          this.state.tokensLength = failState.tokensLength;
          return {
            node: _node,
            error: failState.errors[oldState.errors.length],
            thrown: false,
            aborted: false,
            failState: failState
          };
        }

        return {
          node: _node,
          error: null,
          thrown: false,
          aborted: false,
          failState: null
        };
      } catch (error) {
        var _failState = this.state;
        this.state = oldState;

        if (error instanceof SyntaxError) {
          return {
            node: null,
            error: error,
            thrown: true,
            aborted: false,
            failState: _failState
          };
        }

        if (error === abortSignal) {
          return {
            node: abortSignal.node,
            error: null,
            thrown: false,
            aborted: true,
            failState: _failState
          };
        }

        throw error;
      }
    }
  }, {
    key: "checkExpressionErrors",
    value: function checkExpressionErrors(refExpressionErrors, andThrow) {
      if (!refExpressionErrors) return false;
      var shorthandAssign = refExpressionErrors.shorthandAssign,
          doubleProto = refExpressionErrors.doubleProto,
          optionalParameters = refExpressionErrors.optionalParameters;

      if (!andThrow) {
        return shorthandAssign >= 0 || doubleProto >= 0 || optionalParameters >= 0;
      }

      if (shorthandAssign >= 0) {
        this.unexpected(shorthandAssign);
      }

      if (doubleProto >= 0) {
        this.raise(doubleProto, _error.Errors.DuplicateProto);
      }

      if (optionalParameters >= 0) {
        this.unexpected(optionalParameters);
      }
    }
    /**
     * Test if current token is a literal property name
     * https://tc39.es/ecma262/#prod-LiteralPropertyName
     * LiteralPropertyName:
     *   IdentifierName
     *   StringLiteral
     *   NumericLiteral
     *   BigIntLiteral
     */

  }, {
    key: "isLiteralPropertyName",
    value: function isLiteralPropertyName() {
      return this.match(_types.types.name) || !!this.state.type.keyword || this.match(_types.types.string) || this.match(_types.types.num) || this.match(_types.types.bigint) || this.match(_types.types.decimal);
    }
    /*
     * Test if given node is a PrivateName
     * will be overridden in ESTree plugin
     */

  }, {
    key: "isPrivateName",
    value: function isPrivateName(node) {
      return node.type === "PrivateName";
    }
    /*
     * Return the string value of a given private name
     * WITHOUT `#`
     * @see {@link https://tc39.es/proposal-class-fields/#sec-private-names-static-semantics-stringvalue}
     */

  }, {
    key: "getPrivateNameSV",
    value: function getPrivateNameSV(node) {
      return node.id.name;
    }
    /*
     * Return whether the given node is a member/optional chain that
     * contains a private name as its property
     * It is overridden in ESTree plugin
     */

  }, {
    key: "hasPropertyAsPrivateName",
    value: function hasPropertyAsPrivateName(node) {
      return (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") && this.isPrivateName(node.property);
    }
  }, {
    key: "isOptionalChain",
    value: function isOptionalChain(node) {
      return node.type === "OptionalMemberExpression" || node.type === "OptionalCallExpression";
    }
  }, {
    key: "isObjectProperty",
    value: function isObjectProperty(node) {
      return node.type === "ObjectProperty";
    }
  }, {
    key: "isObjectMethod",
    value: function isObjectMethod(node) {
      return node.type === "ObjectMethod";
    }
  }, {
    key: "initializeScopes",
    value: function initializeScopes() {
      var _this2 = this;

      var inModule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.sourceType === "module";
      // Initialize state
      var oldLabels = this.state.labels;
      this.state.labels = [];
      var oldExportedIdentifiers = this.exportedIdentifiers;
      this.exportedIdentifiers = new Set(); // initialize scopes

      var oldInModule = this.inModule;
      this.inModule = inModule;
      var oldScope = this.scope;
      var ScopeHandler = this.getScopeHandler();
      this.scope = new ScopeHandler(this.raise.bind(this), this.inModule);
      var oldProdParam = this.prodParam;
      this.prodParam = new _productionParameter["default"]();
      var oldClassScope = this.classScope;
      this.classScope = new _classScope["default"](this.raise.bind(this));
      var oldExpressionScope = this.expressionScope;
      this.expressionScope = new _expressionScope["default"](this.raise.bind(this));
      return function () {
        // Revert state
        _this2.state.labels = oldLabels;
        _this2.exportedIdentifiers = oldExportedIdentifiers; // Revert scopes

        _this2.inModule = oldInModule;
        _this2.scope = oldScope;
        _this2.prodParam = oldProdParam;
        _this2.classScope = oldClassScope;
        _this2.expressionScope = oldExpressionScope;
      };
    }
  }, {
    key: "enterInitialScopes",
    value: function enterInitialScopes() {
      var paramFlags = _productionParameter.PARAM;

      if (this.hasPlugin("topLevelAwait") && this.inModule) {
        paramFlags |= _productionParameter.PARAM_AWAIT;
      }

      this.scope.enter(_scopeflags.SCOPE_PROGRAM);
      this.prodParam.enter(paramFlags);
    }
  }]);

  return UtilParser;
}(_tokenizer["default"]);
/**
 * The ExpressionErrors is a context struct used to track ambiguous patterns
 * When we are sure the parsed pattern is a RHS, which means it is not a pattern,
 * we will throw on this position on invalid assign syntax, otherwise it will be reset to -1
 *
 * Types of ExpressionErrors:
 *
 * - **shorthandAssign**: track initializer `=` position
 * - **doubleProto**: track the duplicate `__proto__` key position
 * - **optionalParameters**: track the optional paramter (`?`).
 * It's only used by typescript and flow plugins
 */


exports["default"] = UtilParser;

var ExpressionErrors = function ExpressionErrors() {
  _classCallCheck(this, ExpressionErrors);

  _defineProperty(this, "shorthandAssign", -1);

  _defineProperty(this, "doubleProto", -1);

  _defineProperty(this, "optionalParameters", -1);
};

exports.ExpressionErrors = ExpressionErrors;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvdXRpbC5qcyJdLCJuYW1lcyI6WyJVdGlsUGFyc2VyIiwibm9kZSIsImtleSIsInZhbCIsImV4dHJhIiwib3AiLCJtYXRjaCIsInR0IiwicmVsYXRpb25hbCIsInN0YXRlIiwidmFsdWUiLCJpc1JlbGF0aW9uYWwiLCJuZXh0IiwidW5leHBlY3RlZCIsIm5hbWUiLCJjb250YWluc0VzYyIsIm5hbWVTdGFydCIsIm5hbWVFbmQiLCJsZW5ndGgiLCJpbnB1dCIsInNsaWNlIiwibmV4dENoIiwiY2hhckNvZGVBdCIsIm5leHRUb2tlblN0YXJ0IiwiaXNVbnBhcnNlZENvbnRleHR1YWwiLCJpc0NvbnRleHR1YWwiLCJlYXQiLCJ0ZW1wbGF0ZSIsImVhdENvbnRleHR1YWwiLCJlb2YiLCJicmFjZVIiLCJoYXNQcmVjZWRpbmdMaW5lQnJlYWsiLCJsaW5lQnJlYWsiLCJ0ZXN0IiwibGFzdFRva0VuZCIsInN0YXJ0IiwiZW5kIiwic2VtaSIsImNhbkluc2VydFNlbWljb2xvbiIsImFsbG93QXNpIiwiaXNMaW5lVGVybWluYXRvciIsInJhaXNlIiwiRXJyb3JzIiwiTWlzc2luZ1NlbWljb2xvbiIsInR5cGUiLCJwb3MiLCJtZXNzYWdlIiwiY29kZSIsIkVycm9yQ29kZXMiLCJTeW50YXhFcnJvciIsInJlYXNvbkNvZGUiLCJtZXNzYWdlT3JUeXBlIiwiVG9rZW5UeXBlIiwibGFiZWwiLCJoYXNQbHVnaW4iLCJyYWlzZVdpdGhEYXRhIiwibWlzc2luZ1BsdWdpbiIsIm5hbWVzIiwic29tZSIsIm4iLCJqb2luIiwiZm4iLCJvbGRTdGF0ZSIsImNsb25lIiwiYWJvcnRTaWduYWwiLCJlcnJvcnMiLCJmYWlsU3RhdGUiLCJ0b2tlbnNMZW5ndGgiLCJlcnJvciIsInRocm93biIsImFib3J0ZWQiLCJyZWZFeHByZXNzaW9uRXJyb3JzIiwiYW5kVGhyb3ciLCJzaG9ydGhhbmRBc3NpZ24iLCJkb3VibGVQcm90byIsIm9wdGlvbmFsUGFyYW1ldGVycyIsIkR1cGxpY2F0ZVByb3RvIiwia2V5d29yZCIsInN0cmluZyIsIm51bSIsImJpZ2ludCIsImRlY2ltYWwiLCJpZCIsImlzUHJpdmF0ZU5hbWUiLCJwcm9wZXJ0eSIsImluTW9kdWxlIiwib3B0aW9ucyIsInNvdXJjZVR5cGUiLCJvbGRMYWJlbHMiLCJsYWJlbHMiLCJvbGRFeHBvcnRlZElkZW50aWZpZXJzIiwiZXhwb3J0ZWRJZGVudGlmaWVycyIsIlNldCIsIm9sZEluTW9kdWxlIiwib2xkU2NvcGUiLCJzY29wZSIsIlNjb3BlSGFuZGxlciIsImdldFNjb3BlSGFuZGxlciIsImJpbmQiLCJvbGRQcm9kUGFyYW0iLCJwcm9kUGFyYW0iLCJQcm9kdWN0aW9uUGFyYW1ldGVySGFuZGxlciIsIm9sZENsYXNzU2NvcGUiLCJjbGFzc1Njb3BlIiwiQ2xhc3NTY29wZUhhbmRsZXIiLCJvbGRFeHByZXNzaW9uU2NvcGUiLCJleHByZXNzaW9uU2NvcGUiLCJFeHByZXNzaW9uU2NvcGVIYW5kbGVyIiwicGFyYW1GbGFncyIsIlBBUkFNIiwiUEFSQU1fQVdBSVQiLCJlbnRlciIsIlNDT1BFX1BST0dSQU0iLCJUb2tlbml6ZXIiLCJFeHByZXNzaW9uRXJyb3JzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0E7SUFFcUJBLFU7Ozs7Ozs7Ozs7Ozs7V0FDbkI7O0FBQ0E7QUFDRjtBQUNBO0FBRUU7QUFFQSxzQkFBU0MsSUFBVCxFQUFxQkMsR0FBckIsRUFBa0NDLEdBQWxDLEVBQWtEO0FBQ2hELFVBQUksQ0FBQ0YsSUFBTCxFQUFXO0FBRVgsVUFBTUcsS0FBSyxHQUFJSCxJQUFJLENBQUNHLEtBQUwsR0FBYUgsSUFBSSxDQUFDRyxLQUFMLElBQWMsRUFBMUM7QUFDQUEsTUFBQUEsS0FBSyxDQUFDRixHQUFELENBQUwsR0FBYUMsR0FBYjtBQUNELEssQ0FF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U0FBcEI7QUFDQSxRQUFBLE1BQUksQ0FBQ0csbUJBQUwsR0FBMkJELHNCQUEzQixDQUhXLENBS1g7O0FBQ0EsUUFBQSxNQUFJLENBQUNMLFFBQUwsR0FBZ0JRLFdBQWhCO0FBQ0EsUUFBQSxNQUFJLENBQUNFLEtBQUwsR0FBYUQsUUFBYjtBQUNBLFFBQUEsTUFBSSxDQUFDTSxTQUFMLEdBQWlCRCxZQUFqQjtBQUNBLFFBQUEsTUFBSSxDQUFDSSxVQUFMLEdBQWtCRCxhQUFsQjtBQUNBLFFBQUEsTUFBSSxDQUFDSSxlQUFMLEdBQXVCRCxrQkFBdkI7QUFDRCxPQVhEO0FBWUQ7OztXQUVELDhCQUFxQjtBQUNuQixVQUFJRyxVQUFVLEdBQUdDLDBCQUFqQjs7QUFDQSxVQUFJLEtBQUt2RCxTQUFMLENBQWUsZUFBZixLQUFtQyxLQUFLK0IsUUFBNUMsRUFBc0Q7QUFDcER1QixRQUFBQSxVQUFVLElBQUlFLGdDQUFkO0FBQ0Q7O0FBQ0QsV0FBS2YsS0FBTCxDQUFXZ0IsS0FBWCxDQUFpQkMseUJBQWpCO0FBQ0EsV0FBS1osU0FBTCxDQUFlVyxLQUFmLENBQXFCSCxVQUFyQjtBQUNEOzs7O0VBblhxQ0sscUI7QUFzWHhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7SUFDYUMsZ0I7OzsyQ0FDTyxDQUFDLEM7O3VDQUNMLENBQUMsQzs7OENBQ00sQ0FBQyxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgdHlwZXMgYXMgdHQsIFRva2VuVHlwZSB9IGZyb20gXCIuLi90b2tlbml6ZXIvdHlwZXNcIjtcbmltcG9ydCBUb2tlbml6ZXIgZnJvbSBcIi4uL3Rva2VuaXplclwiO1xuaW1wb3J0IFN0YXRlIGZyb20gXCIuLi90b2tlbml6ZXIvc3RhdGVcIjtcbmltcG9ydCB0eXBlIHsgTm9kZSB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgbGluZUJyZWFrIH0gZnJvbSBcIi4uL3V0aWwvd2hpdGVzcGFjZVwiO1xuaW1wb3J0IHsgaXNJZGVudGlmaWVyQ2hhciB9IGZyb20gXCIuLi91dGlsL2lkZW50aWZpZXJcIjtcbmltcG9ydCBDbGFzc1Njb3BlSGFuZGxlciBmcm9tIFwiLi4vdXRpbC9jbGFzcy1zY29wZVwiO1xuaW1wb3J0IEV4cHJlc3Npb25TY29wZUhhbmRsZXIgZnJvbSBcIi4uL3V0aWwvZXhwcmVzc2lvbi1zY29wZVwiO1xuaW1wb3J0IHsgU0NPUEVfUFJPR1JBTSB9IGZyb20gXCIuLi91dGlsL3Njb3BlZmxhZ3NcIjtcbmltcG9ydCBQcm9kdWN0aW9uUGFyYW1ldGVySGFuZGxlciwge1xuICBQQVJBTV9BV0FJVCxcbiAgUEFSQU0sXG59IGZyb20gXCIuLi91dGlsL3Byb2R1Y3Rpb24tcGFyYW1ldGVyXCI7XG5pbXBvcnQgeyBFcnJvcnMsIHR5cGUgRXJyb3JUZW1wbGF0ZSwgRXJyb3JDb2RlcyB9IGZyb20gXCIuL2Vycm9yXCI7XG5pbXBvcnQgdHlwZSB7IFBhcnNpbmdFcnJvciB9IGZyb20gXCIuL2Vycm9yXCI7XG4vKjo6XG5pbXBvcnQgdHlwZSBTY29wZUhhbmRsZXIgZnJvbSBcIi4uL3V0aWwvc2NvcGVcIjtcbiovXG5cbnR5cGUgVHJ5UGFyc2U8Tm9kZSwgRXJyb3IsIFRocm93biwgQWJvcnRlZCwgRmFpbFN0YXRlPiA9IHtcbiAgbm9kZTogTm9kZSxcbiAgZXJyb3I6IEVycm9yLFxuICB0aHJvd246IFRocm93bixcbiAgYWJvcnRlZDogQWJvcnRlZCxcbiAgZmFpbFN0YXRlOiBGYWlsU3RhdGUsXG59O1xuXG4vLyAjIyBQYXJzZXIgdXRpbGl0aWVzXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxQYXJzZXIgZXh0ZW5kcyBUb2tlbml6ZXIge1xuICAvLyBGb3J3YXJkLWRlY2xhcmF0aW9uOiBkZWZpbmVkIGluIHBhcnNlci9pbmRleC5qc1xuICAvKjo6XG4gICtnZXRTY29wZUhhbmRsZXI6ICgpID0+IENsYXNzPFNjb3BlSGFuZGxlcjwqPj47XG4gICovXG5cbiAgLy8gVE9ET1xuXG4gIGFkZEV4dHJhKG5vZGU6IE5vZGUsIGtleTogc3RyaW5nLCB2YWw6IGFueSk6IHZvaWQge1xuICAgIGlmICghbm9kZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZXh0cmEgPSAobm9kZS5leHRyYSA9IG5vZGUuZXh0cmEgfHwge30pO1xuICAgIGV4dHJhW2tleV0gPSB2YWw7XG4gIH1cblxuICAvLyBUT0RPXG5cbiAgaXNSZWxhdGlvbmFsKG9wOiBcIjxcIiB8IFwiPlwiKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2godHQucmVsYXRpb25hbCkgJiYgdGhpcy5zdGF0ZS52YWx1ZSA9PT0gb3A7XG4gIH1cblxuICAvLyBUT0RPXG5cbiAgZXhwZWN0UmVsYXRpb25hbChvcDogXCI8XCIgfCBcIj5cIik6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmVsYXRpb25hbChvcCkpIHtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVuZXhwZWN0ZWQobnVsbCwgdHQucmVsYXRpb25hbCk7XG4gICAgfVxuICB9XG5cbiAgLy8gVGVzdHMgd2hldGhlciBwYXJzZWQgdG9rZW4gaXMgYSBjb250ZXh0dWFsIGtleXdvcmQuXG5cbiAgaXNDb250ZXh0dWFsKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLm1hdGNoKHR0Lm5hbWUpICYmXG4gICAgICB0aGlzLnN0YXRlLnZhbHVlID09PSBuYW1lICYmXG4gICAgICAhdGhpcy5zdGF0ZS5jb250YWluc0VzY1xuICAgICk7XG4gIH1cblxuICBpc1VucGFyc2VkQ29udGV4dHVhbChuYW1lU3RhcnQ6IG51bWJlciwgbmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmFtZUVuZCA9IG5hbWVTdGFydCArIG5hbWUubGVuZ3RoO1xuICAgIGlmICh0aGlzLmlucHV0LnNsaWNlKG5hbWVTdGFydCwgbmFtZUVuZCkgPT09IG5hbWUpIHtcbiAgICAgIGNvbnN0IG5leHRDaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdChuYW1lRW5kKTtcbiAgICAgIHJldHVybiAhKFxuICAgICAgICBpc0lkZW50aWZpZXJDaGFyKG5leHRDaCkgfHxcbiAgICAgICAgLy8gY2hlY2sgaWYgYG5leHRDaCBpcyBiZXR3ZWVuIDB4ZDgwMCAtIDB4ZGJmZixcbiAgICAgICAgLy8gaWYgYG5leHRDaGAgaXMgTmFOLCBgTmFOICYgMHhmYzAwYCBpcyAwLCB0aGUgZnVuY3Rpb25cbiAgICAgICAgLy8gcmV0dXJucyB0cnVlXG4gICAgICAgIChuZXh0Q2ggJiAweGZjMDApID09PSAweGQ4MDBcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzTG9va2FoZWFkQ29udGV4dHVhbChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBuZXh0ID0gdGhpcy5uZXh0VG9rZW5TdGFydCgpO1xuICAgIHJldHVybiB0aGlzLmlzVW5wYXJzZWRDb250ZXh0dWFsKG5leHQsIG5hbWUpO1xuICB9XG5cbiAgLy8gQ29uc3VtZXMgY29udGV4dHVhbCBrZXl3b3JkIGlmIHBvc3NpYmxlLlxuXG4gIGVhdENvbnRleHR1YWwobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNDb250ZXh0dWFsKG5hbWUpICYmIHRoaXMuZWF0KHR0Lm5hbWUpO1xuICB9XG5cbiAgLy8gQXNzZXJ0cyB0aGF0IGZvbGxvd2luZyB0b2tlbiBpcyBnaXZlbiBjb250ZXh0dWFsIGtleXdvcmQuXG5cbiAgZXhwZWN0Q29udGV4dHVhbChuYW1lOiBzdHJpbmcsIHRlbXBsYXRlPzogRXJyb3JUZW1wbGF0ZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5lYXRDb250ZXh0dWFsKG5hbWUpKSB0aGlzLnVuZXhwZWN0ZWQobnVsbCwgdGVtcGxhdGUpO1xuICB9XG5cbiAgLy8gVGVzdCB3aGV0aGVyIGEgc2VtaWNvbG9uIGNhbiBiZSBpbnNlcnRlZCBhdCB0aGUgY3VycmVudCBwb3NpdGlvbi5cblxuICBjYW5JbnNlcnRTZW1pY29sb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMubWF0Y2godHQuZW9mKSB8fFxuICAgICAgdGhpcy5tYXRjaCh0dC5icmFjZVIpIHx8XG4gICAgICB0aGlzLmhhc1ByZWNlZGluZ0xpbmVCcmVhaygpXG4gICAgKTtcbiAgfVxuXG4gIGhhc1ByZWNlZGluZ0xpbmVCcmVhaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbGluZUJyZWFrLnRlc3QoXG4gICAgICB0aGlzLmlucHV0LnNsaWNlKHRoaXMuc3RhdGUubGFzdFRva0VuZCwgdGhpcy5zdGF0ZS5zdGFydCksXG4gICAgKTtcbiAgfVxuXG4gIGhhc0ZvbGxvd2luZ0xpbmVCcmVhaygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbGluZUJyZWFrLnRlc3QoXG4gICAgICB0aGlzLmlucHV0LnNsaWNlKHRoaXMuc3RhdGUuZW5kLCB0aGlzLm5leHRUb2tlblN0YXJ0KCkpLFxuICAgICk7XG4gIH1cblxuICAvLyBUT0RPXG5cbiAgaXNMaW5lVGVybWluYXRvcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lYXQodHQuc2VtaSkgfHwgdGhpcy5jYW5JbnNlcnRTZW1pY29sb24oKTtcbiAgfVxuXG4gIC8vIENvbnN1bWUgYSBzZW1pY29sb24sIG9yLCBmYWlsaW5nIHRoYXQsIHNlZSBpZiB3ZSBhcmUgYWxsb3dlZCB0b1xuICAvLyBwcmV0ZW5kIHRoYXQgdGhlcmUgaXMgYSBzZW1pY29sb24gYXQgdGhpcyBwb3NpdGlvbi5cblxuICBzZW1pY29sb24oYWxsb3dBc2k6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKGFsbG93QXNpID8gdGhpcy5pc0xpbmVUZXJtaW5hdG9yKCkgOiB0aGlzLmVhdCh0dC5zZW1pKSkgcmV0dXJuO1xuICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5sYXN0VG9rRW5kLCBFcnJvcnMuTWlzc2luZ1NlbWljb2xvbik7XG4gIH1cblxuICAvLyBFeHBlY3QgYSB0b2tlbiBvZiBhIGdpdmVuIHR5cGUuIElmIGZvdW5kLCBjb25zdW1lIGl0LCBvdGhlcndpc2UsXG4gIC8vIHJhaXNlIGFuIHVuZXhwZWN0ZWQgdG9rZW4gZXJyb3IgYXQgZ2l2ZW4gcG9zLlxuXG4gIGV4cGVjdCh0eXBlOiBUb2tlblR5cGUsIHBvcz86ID9udW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmVhdCh0eXBlKSB8fCB0aGlzLnVuZXhwZWN0ZWQocG9zLCB0eXBlKTtcbiAgfVxuXG4gIC8vIFRocm93cyBpZiB0aGUgY3VycmVudCB0b2tlbiBhbmQgdGhlIHByZXYgb25lIGFyZSBzZXBhcmF0ZWQgYnkgYSBzcGFjZS5cbiAgYXNzZXJ0Tm9TcGFjZShtZXNzYWdlOiBzdHJpbmcgPSBcIlVuZXhwZWN0ZWQgc3BhY2UuXCIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zdGFydCA+IHRoaXMuc3RhdGUubGFzdFRva0VuZCkge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgQGJhYmVsL2RldmVsb3BtZW50LWludGVybmFsL2RyeS1lcnJvci1tZXNzYWdlcyAqL1xuICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLmxhc3RUb2tFbmQsIHtcbiAgICAgICAgY29kZTogRXJyb3JDb2Rlcy5TeW50YXhFcnJvcixcbiAgICAgICAgcmVhc29uQ29kZTogXCJVbmV4cGVjdGVkU3BhY2VcIixcbiAgICAgICAgdGVtcGxhdGU6IG1lc3NhZ2UsXG4gICAgICB9KTtcbiAgICAgIC8qIGVzbGludC1lbmFibGUgQGJhYmVsL2RldmVsb3BtZW50LWludGVybmFsL2RyeS1lcnJvci1tZXNzYWdlcyAqL1xuICAgIH1cbiAgfVxuXG4gIC8vIFJhaXNlIGFuIHVuZXhwZWN0ZWQgdG9rZW4gZXJyb3IuIENhbiB0YWtlIHRoZSBleHBlY3RlZCB0b2tlbiB0eXBlXG4gIC8vIGluc3RlYWQgb2YgYSBtZXNzYWdlIHN0cmluZy5cblxuICB1bmV4cGVjdGVkKFxuICAgIHBvczogP251bWJlcixcbiAgICBtZXNzYWdlT3JUeXBlOiBFcnJvclRlbXBsYXRlIHwgVG9rZW5UeXBlID0ge1xuICAgICAgY29kZTogRXJyb3JDb2Rlcy5TeW50YXhFcnJvcixcbiAgICAgIHJlYXNvbkNvZGU6IFwiVW5leHBlY3RlZFRva2VuXCIsXG4gICAgICB0ZW1wbGF0ZTogXCJVbmV4cGVjdGVkIHRva2VuXCIsXG4gICAgfSxcbiAgKTogZW1wdHkge1xuICAgIGlmIChtZXNzYWdlT3JUeXBlIGluc3RhbmNlb2YgVG9rZW5UeXBlKSB7XG4gICAgICBtZXNzYWdlT3JUeXBlID0ge1xuICAgICAgICBjb2RlOiBFcnJvckNvZGVzLlN5bnRheEVycm9yLFxuICAgICAgICByZWFzb25Db2RlOiBcIlVuZXhwZWN0ZWRUb2tlblwiLFxuICAgICAgICB0ZW1wbGF0ZTogYFVuZXhwZWN0ZWQgdG9rZW4sIGV4cGVjdGVkIFwiJHttZXNzYWdlT3JUeXBlLmxhYmVsfVwiYCxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyogZXNsaW50LWRpc2FibGUgQGJhYmVsL2RldmVsb3BtZW50LWludGVybmFsL2RyeS1lcnJvci1tZXNzYWdlcyAqL1xuICAgIHRocm93IHRoaXMucmFpc2UocG9zICE9IG51bGwgPyBwb3MgOiB0aGlzLnN0YXRlLnN0YXJ0LCBtZXNzYWdlT3JUeXBlKTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIEBiYWJlbC9kZXZlbG9wbWVudC1pbnRlcm5hbC9kcnktZXJyb3ItbWVzc2FnZXMgKi9cbiAgfVxuXG4gIGV4cGVjdFBsdWdpbihuYW1lOiBzdHJpbmcsIHBvcz86ID9udW1iZXIpOiB0cnVlIHtcbiAgICBpZiAoIXRoaXMuaGFzUGx1Z2luKG5hbWUpKSB7XG4gICAgICB0aHJvdyB0aGlzLnJhaXNlV2l0aERhdGEoXG4gICAgICAgIHBvcyAhPSBudWxsID8gcG9zIDogdGhpcy5zdGF0ZS5zdGFydCxcbiAgICAgICAgeyBtaXNzaW5nUGx1Z2luOiBbbmFtZV0gfSxcbiAgICAgICAgYFRoaXMgZXhwZXJpbWVudGFsIHN5bnRheCByZXF1aXJlcyBlbmFibGluZyB0aGUgcGFyc2VyIHBsdWdpbjogJyR7bmFtZX0nYCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBleHBlY3RPbmVQbHVnaW4obmFtZXM6IEFycmF5PHN0cmluZz4sIHBvcz86ID9udW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoIW5hbWVzLnNvbWUobiA9PiB0aGlzLmhhc1BsdWdpbihuKSkpIHtcbiAgICAgIHRocm93IHRoaXMucmFpc2VXaXRoRGF0YShcbiAgICAgICAgcG9zICE9IG51bGwgPyBwb3MgOiB0aGlzLnN0YXRlLnN0YXJ0LFxuICAgICAgICB7IG1pc3NpbmdQbHVnaW46IG5hbWVzIH0sXG4gICAgICAgIGBUaGlzIGV4cGVyaW1lbnRhbCBzeW50YXggcmVxdWlyZXMgZW5hYmxpbmcgb25lIG9mIHRoZSBmb2xsb3dpbmcgcGFyc2VyIHBsdWdpbihzKTogJyR7bmFtZXMuam9pbihcbiAgICAgICAgICBcIiwgXCIsXG4gICAgICAgICl9J2AsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8vIHRyeVBhcnNlIHdpbGwgY2xvbmUgcGFyc2VyIHN0YXRlLlxuICAvLyBJdCBpcyBleHBlbnNpdmUgYW5kIHNob3VsZCBiZSB1c2VkIHdpdGggY2F1dGlvbnNcbiAgdHJ5UGFyc2U8VDogTm9kZSB8ICRSZWFkT25seUFycmF5PE5vZGU+PihcbiAgICBmbjogKGFib3J0OiAobm9kZT86IFQpID0+IGVtcHR5KSA9PiBULFxuICAgIG9sZFN0YXRlOiBTdGF0ZSA9IHRoaXMuc3RhdGUuY2xvbmUoKSxcbiAgKTpcbiAgICB8IFRyeVBhcnNlPFQsIG51bGwsIGZhbHNlLCBmYWxzZSwgbnVsbD5cbiAgICB8IFRyeVBhcnNlPFQgfCBudWxsLCBQYXJzaW5nRXJyb3IsIGJvb2xlYW4sIGZhbHNlLCBTdGF0ZT5cbiAgICB8IFRyeVBhcnNlPFQgfCBudWxsLCBudWxsLCBmYWxzZSwgdHJ1ZSwgU3RhdGU+IHtcbiAgICBjb25zdCBhYm9ydFNpZ25hbDogeyBub2RlOiBUIHwgbnVsbCB9ID0geyBub2RlOiBudWxsIH07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG5vZGUgPSBmbigobm9kZSA9IG51bGwpID0+IHtcbiAgICAgICAgYWJvcnRTaWduYWwubm9kZSA9IG5vZGU7XG4gICAgICAgIHRocm93IGFib3J0U2lnbmFsO1xuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5lcnJvcnMubGVuZ3RoID4gb2xkU3RhdGUuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBmYWlsU3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICB0aGlzLnN0YXRlID0gb2xkU3RhdGU7XG4gICAgICAgIC8vIHRva2Vuc0xlbmd0aCBzaG91bGQgYmUgcHJlc2VydmVkIGR1cmluZyBlcnJvciByZWNvdmVyeSBtb2RlXG4gICAgICAgIC8vIHNpbmNlIHRoZSBwYXJzZXIgZG9lcyBub3QgaGFsdCBhbmQgd2lsbCBpbnN0ZWFkIHBhcnNlIHRoZVxuICAgICAgICAvLyByZW1haW5pbmcgdG9rZW5zXG4gICAgICAgIHRoaXMuc3RhdGUudG9rZW5zTGVuZ3RoID0gZmFpbFN0YXRlLnRva2Vuc0xlbmd0aDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGVycm9yOiAoZmFpbFN0YXRlLmVycm9yc1tvbGRTdGF0ZS5lcnJvcnMubGVuZ3RoXTogUGFyc2luZ0Vycm9yKSxcbiAgICAgICAgICB0aHJvd246IGZhbHNlLFxuICAgICAgICAgIGFib3J0ZWQ6IGZhbHNlLFxuICAgICAgICAgIGZhaWxTdGF0ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgIHRocm93bjogZmFsc2UsXG4gICAgICAgIGFib3J0ZWQ6IGZhbHNlLFxuICAgICAgICBmYWlsU3RhdGU6IG51bGwsXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zdCBmYWlsU3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgdGhpcy5zdGF0ZSA9IG9sZFN0YXRlO1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgbm9kZTogbnVsbCwgZXJyb3IsIHRocm93bjogdHJ1ZSwgYWJvcnRlZDogZmFsc2UsIGZhaWxTdGF0ZSB9O1xuICAgICAgfVxuICAgICAgaWYgKGVycm9yID09PSBhYm9ydFNpZ25hbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5vZGU6IGFib3J0U2lnbmFsLm5vZGUsXG4gICAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgICAgdGhyb3duOiBmYWxzZSxcbiAgICAgICAgICBhYm9ydGVkOiB0cnVlLFxuICAgICAgICAgIGZhaWxTdGF0ZSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tFeHByZXNzaW9uRXJyb3JzKFxuICAgIHJlZkV4cHJlc3Npb25FcnJvcnM6ID9FeHByZXNzaW9uRXJyb3JzLFxuICAgIGFuZFRocm93OiBib29sZWFuLFxuICApIHtcbiAgICBpZiAoIXJlZkV4cHJlc3Npb25FcnJvcnMpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCB7IHNob3J0aGFuZEFzc2lnbiwgZG91YmxlUHJvdG8sIG9wdGlvbmFsUGFyYW1ldGVycyB9ID1cbiAgICAgIHJlZkV4cHJlc3Npb25FcnJvcnM7XG4gICAgaWYgKCFhbmRUaHJvdykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgc2hvcnRoYW5kQXNzaWduID49IDAgfHwgZG91YmxlUHJvdG8gPj0gMCB8fCBvcHRpb25hbFBhcmFtZXRlcnMgPj0gMFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHNob3J0aGFuZEFzc2lnbiA+PSAwKSB7XG4gICAgICB0aGlzLnVuZXhwZWN0ZWQoc2hvcnRoYW5kQXNzaWduKTtcbiAgICB9XG4gICAgaWYgKGRvdWJsZVByb3RvID49IDApIHtcbiAgICAgIHRoaXMucmFpc2UoZG91YmxlUHJvdG8sIEVycm9ycy5EdXBsaWNhdGVQcm90byk7XG4gICAgfVxuICAgIGlmIChvcHRpb25hbFBhcmFtZXRlcnMgPj0gMCkge1xuICAgICAgdGhpcy51bmV4cGVjdGVkKG9wdGlvbmFsUGFyYW1ldGVycyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRlc3QgaWYgY3VycmVudCB0b2tlbiBpcyBhIGxpdGVyYWwgcHJvcGVydHkgbmFtZVxuICAgKiBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1MaXRlcmFsUHJvcGVydHlOYW1lXG4gICAqIExpdGVyYWxQcm9wZXJ0eU5hbWU6XG4gICAqICAgSWRlbnRpZmllck5hbWVcbiAgICogICBTdHJpbmdMaXRlcmFsXG4gICAqICAgTnVtZXJpY0xpdGVyYWxcbiAgICogICBCaWdJbnRMaXRlcmFsXG4gICAqL1xuICBpc0xpdGVyYWxQcm9wZXJ0eU5hbWUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMubWF0Y2godHQubmFtZSkgfHxcbiAgICAgICEhdGhpcy5zdGF0ZS50eXBlLmtleXdvcmQgfHxcbiAgICAgIHRoaXMubWF0Y2godHQuc3RyaW5nKSB8fFxuICAgICAgdGhpcy5tYXRjaCh0dC5udW0pIHx8XG4gICAgICB0aGlzLm1hdGNoKHR0LmJpZ2ludCkgfHxcbiAgICAgIHRoaXMubWF0Y2godHQuZGVjaW1hbClcbiAgICApO1xuICB9XG5cbiAgLypcbiAgICogVGVzdCBpZiBnaXZlbiBub2RlIGlzIGEgUHJpdmF0ZU5hbWVcbiAgICogd2lsbCBiZSBvdmVycmlkZGVuIGluIEVTVHJlZSBwbHVnaW5cbiAgICovXG4gIGlzUHJpdmF0ZU5hbWUobm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBub2RlLnR5cGUgPT09IFwiUHJpdmF0ZU5hbWVcIjtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybiB0aGUgc3RyaW5nIHZhbHVlIG9mIGEgZ2l2ZW4gcHJpdmF0ZSBuYW1lXG4gICAqIFdJVEhPVVQgYCNgXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vdGMzOS5lcy9wcm9wb3NhbC1jbGFzcy1maWVsZHMvI3NlYy1wcml2YXRlLW5hbWVzLXN0YXRpYy1zZW1hbnRpY3Mtc3RyaW5ndmFsdWV9XG4gICAqL1xuICBnZXRQcml2YXRlTmFtZVNWKG5vZGU6IE5vZGUpOiBzdHJpbmcge1xuICAgIHJldHVybiBub2RlLmlkLm5hbWU7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm4gd2hldGhlciB0aGUgZ2l2ZW4gbm9kZSBpcyBhIG1lbWJlci9vcHRpb25hbCBjaGFpbiB0aGF0XG4gICAqIGNvbnRhaW5zIGEgcHJpdmF0ZSBuYW1lIGFzIGl0cyBwcm9wZXJ0eVxuICAgKiBJdCBpcyBvdmVycmlkZGVuIGluIEVTVHJlZSBwbHVnaW5cbiAgICovXG4gIGhhc1Byb3BlcnR5QXNQcml2YXRlTmFtZShub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIChub2RlLnR5cGUgPT09IFwiTWVtYmVyRXhwcmVzc2lvblwiIHx8XG4gICAgICAgIG5vZGUudHlwZSA9PT0gXCJPcHRpb25hbE1lbWJlckV4cHJlc3Npb25cIikgJiZcbiAgICAgIHRoaXMuaXNQcml2YXRlTmFtZShub2RlLnByb3BlcnR5KVxuICAgICk7XG4gIH1cblxuICBpc09wdGlvbmFsQ2hhaW4obm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBub2RlLnR5cGUgPT09IFwiT3B0aW9uYWxNZW1iZXJFeHByZXNzaW9uXCIgfHxcbiAgICAgIG5vZGUudHlwZSA9PT0gXCJPcHRpb25hbENhbGxFeHByZXNzaW9uXCJcbiAgICApO1xuICB9XG5cbiAgaXNPYmplY3RQcm9wZXJ0eShub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gXCJPYmplY3RQcm9wZXJ0eVwiO1xuICB9XG5cbiAgaXNPYmplY3RNZXRob2Qobm9kZTogTm9kZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBub2RlLnR5cGUgPT09IFwiT2JqZWN0TWV0aG9kXCI7XG4gIH1cblxuICBpbml0aWFsaXplU2NvcGVzKFxuICAgIGluTW9kdWxlOiBib29sZWFuID0gdGhpcy5vcHRpb25zLnNvdXJjZVR5cGUgPT09IFwibW9kdWxlXCIsXG4gICk6ICgpID0+IHZvaWQge1xuICAgIC8vIEluaXRpYWxpemUgc3RhdGVcbiAgICBjb25zdCBvbGRMYWJlbHMgPSB0aGlzLnN0YXRlLmxhYmVscztcbiAgICB0aGlzLnN0YXRlLmxhYmVscyA9IFtdO1xuXG4gICAgY29uc3Qgb2xkRXhwb3J0ZWRJZGVudGlmaWVycyA9IHRoaXMuZXhwb3J0ZWRJZGVudGlmaWVycztcbiAgICB0aGlzLmV4cG9ydGVkSWRlbnRpZmllcnMgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBpbml0aWFsaXplIHNjb3Blc1xuICAgIGNvbnN0IG9sZEluTW9kdWxlID0gdGhpcy5pbk1vZHVsZTtcbiAgICB0aGlzLmluTW9kdWxlID0gaW5Nb2R1bGU7XG5cbiAgICBjb25zdCBvbGRTY29wZSA9IHRoaXMuc2NvcGU7XG4gICAgY29uc3QgU2NvcGVIYW5kbGVyID0gdGhpcy5nZXRTY29wZUhhbmRsZXIoKTtcbiAgICB0aGlzLnNjb3BlID0gbmV3IFNjb3BlSGFuZGxlcih0aGlzLnJhaXNlLmJpbmQodGhpcyksIHRoaXMuaW5Nb2R1bGUpO1xuXG4gICAgY29uc3Qgb2xkUHJvZFBhcmFtID0gdGhpcy5wcm9kUGFyYW07XG4gICAgdGhpcy5wcm9kUGFyYW0gPSBuZXcgUHJvZHVjdGlvblBhcmFtZXRlckhhbmRsZXIoKTtcblxuICAgIGNvbnN0IG9sZENsYXNzU2NvcGUgPSB0aGlzLmNsYXNzU2NvcGU7XG4gICAgdGhpcy5jbGFzc1Njb3BlID0gbmV3IENsYXNzU2NvcGVIYW5kbGVyKHRoaXMucmFpc2UuYmluZCh0aGlzKSk7XG5cbiAgICBjb25zdCBvbGRFeHByZXNzaW9uU2NvcGUgPSB0aGlzLmV4cHJlc3Npb25TY29wZTtcbiAgICB0aGlzLmV4cHJlc3Npb25TY29wZSA9IG5ldyBFeHByZXNzaW9uU2NvcGVIYW5kbGVyKHRoaXMucmFpc2UuYmluZCh0aGlzKSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgLy8gUmV2ZXJ0IHN0YXRlXG4gICAgICB0aGlzLnN0YXRlLmxhYmVscyA9IG9sZExhYmVscztcbiAgICAgIHRoaXMuZXhwb3J0ZWRJZGVudGlmaWVycyA9IG9sZEV4cG9ydGVkSWRlbnRpZmllcnM7XG5cbiAgICAgIC8vIFJldmVydCBzY29wZXNcbiAgICAgIHRoaXMuaW5Nb2R1bGUgPSBvbGRJbk1vZHVsZTtcbiAgICAgIHRoaXMuc2NvcGUgPSBvbGRTY29wZTtcbiAgICAgIHRoaXMucHJvZFBhcmFtID0gb2xkUHJvZFBhcmFtO1xuICAgICAgdGhpcy5jbGFzc1Njb3BlID0gb2xkQ2xhc3NTY29wZTtcbiAgICAgIHRoaXMuZXhwcmVzc2lvblNjb3BlID0gb2xkRXhwcmVzc2lvblNjb3BlO1xuICAgIH07XG4gIH1cblxuICBlbnRlckluaXRpYWxTY29wZXMoKSB7XG4gICAgbGV0IHBhcmFtRmxhZ3MgPSBQQVJBTTtcbiAgICBpZiAodGhpcy5oYXNQbHVnaW4oXCJ0b3BMZXZlbEF3YWl0XCIpICYmIHRoaXMuaW5Nb2R1bGUpIHtcbiAgICAgIHBhcmFtRmxhZ3MgfD0gUEFSQU1fQVdBSVQ7XG4gICAgfVxuICAgIHRoaXMuc2NvcGUuZW50ZXIoU0NPUEVfUFJPR1JBTSk7XG4gICAgdGhpcy5wcm9kUGFyYW0uZW50ZXIocGFyYW1GbGFncyk7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgRXhwcmVzc2lvbkVycm9ycyBpcyBhIGNvbnRleHQgc3RydWN0IHVzZWQgdG8gdHJhY2sgYW1iaWd1b3VzIHBhdHRlcm5zXG4gKiBXaGVuIHdlIGFyZSBzdXJlIHRoZSBwYXJzZWQgcGF0dGVybiBpcyBhIFJIUywgd2hpY2ggbWVhbnMgaXQgaXMgbm90IGEgcGF0dGVybixcbiAqIHdlIHdpbGwgdGhyb3cgb24gdGhpcyBwb3NpdGlvbiBvbiBpbnZhbGlkIGFzc2lnbiBzeW50YXgsIG90aGVyd2lzZSBpdCB3aWxsIGJlIHJlc2V0IHRvIC0xXG4gKlxuICogVHlwZXMgb2YgRXhwcmVzc2lvbkVycm9yczpcbiAqXG4gKiAtICoqc2hvcnRoYW5kQXNzaWduKio6IHRyYWNrIGluaXRpYWxpemVyIGA9YCBwb3NpdGlvblxuICogLSAqKmRvdWJsZVByb3RvKio6IHRyYWNrIHRoZSBkdXBsaWNhdGUgYF9fcHJvdG9fX2Aga2V5IHBvc2l0aW9uXG4gKiAtICoqb3B0aW9uYWxQYXJhbWV0ZXJzKio6IHRyYWNrIHRoZSBvcHRpb25hbCBwYXJhbXRlciAoYD9gKS5cbiAqIEl0J3Mgb25seSB1c2VkIGJ5IHR5cGVzY3JpcHQgYW5kIGZsb3cgcGx1Z2luc1xuICovXG5leHBvcnQgY2xhc3MgRXhwcmVzc2lvbkVycm9ycyB7XG4gIHNob3J0aGFuZEFzc2lnbiA9IC0xO1xuICBkb3VibGVQcm90byA9IC0xO1xuICBvcHRpb25hbFBhcmFtZXRlcnMgPSAtMTtcbn1cbiJdfQ==