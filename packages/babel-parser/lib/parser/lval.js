"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var charCodes = _interopRequireWildcard(require("charcodes"));

var _types = require("../tokenizer/types");

var _identifier = require("../util/identifier");

var _node = require("./node");

var _scopeflags = require("../util/scopeflags");

var _util = require("./util");

var _error = require("./error");

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

var unwrapParenthesizedExpression = function unwrapParenthesizedExpression(node) {
  return node.type === "ParenthesizedExpression" ? unwrapParenthesizedExpression(node.expression) : node;
};

var LValParser = /*#__PURE__*/function (_NodeUtils) {
  _inherits(LValParser, _NodeUtils);

  var _super = _createSuper(LValParser);

  function LValParser() {
    _classCallCheck(this, LValParser);

    return _super.apply(this, arguments);
  }

  _createClass(LValParser, [{
    key: "toAssignable",
    value: // Forward-declaration: defined in expression.js

    /*::
    +parseIdentifier: (liberal?: boolean) => Identifier;
    +parseMaybeAssignAllowIn: (
      refExpressionErrors?: ?ExpressionErrors,
      afterLeftParse?: Function,
      refNeedsArrowPos?: ?Pos,
    ) => Expression;
    +parseObjectLike: <T: ObjectPattern | ObjectExpression>(
      close: TokenType,
      isPattern: boolean,
      isRecord?: ?boolean,
      refExpressionErrors?: ?ExpressionErrors,
    ) => T;
    */
    // Forward-declaration: defined in statement.js

    /*::
    +parseDecorator: () => Decorator;
    */

    /**
     * Convert existing expression atom to assignable pattern
     * if possible. Also checks invalid destructuring targets:
      - Parenthesized Destructuring patterns
     - RestElement is not the last element
     - Missing `=` in assignment pattern
      NOTE: There is a corresponding "isAssignable" method in flow.js.
     When this one is updated, please check if also that one needs to be updated.
      * @param {Node} node The expression atom
     * @param {boolean} [isLHS=false] Whether we are parsing a LeftHandSideExpression. If isLHS is `true`, the following cases are allowed:
                                      `[(a)] = [0]`, `[(a.b)] = [0]`
      * @returns {Node} The converted assignable pattern
     * @memberof LValParser
     */
    function toAssignable(node) {
      var _node$extra, _node$extra3;

      var isLHS = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var parenthesized = undefined;

      if (node.type === "ParenthesizedExpression" || (_node$extra = node.extra) !== null && _node$extra !== void 0 && _node$extra.parenthesized) {
        parenthesized = unwrapParenthesizedExpression(node);

        if (isLHS) {
          // an LHS can be reinterpreted to a binding pattern but not vice versa.
          // therefore a parenthesized identifier is ambiguous until we are sure it is an assignment expression
          // i.e. `([(a) = []] = []) => {}`
          // see also `recordParenthesizedIdentifierError` signature in packages/babel-parser/src/util/expression-scope.js
          if (parenthesized.type === "Identifier") {
            this.expressionScope.recordParenthesizedIdentifierError(node.start, _error.Errors.InvalidParenthesizedAssignment);
          } else if (parenthesized.type !== "MemberExpression") {
            // A parenthesized member expression can be in LHS but not in pattern.
            // If the LHS is later interpreted as a pattern, `checkLVal` will throw for member expression binding
            // i.e. `([(a.b) = []] = []) => {}`
            this.raise(node.start, _error.Errors.InvalidParenthesizedAssignment);
          }
        } else {
          this.raise(node.start, _error.Errors.InvalidParenthesizedAssignment);
        }
      }

      switch (node.type) {
        case "Identifier":
        case "ObjectPattern":
        case "ArrayPattern":
        case "AssignmentPattern":
          break;

        case "ObjectExpression":
          node.type = "ObjectPattern";

          for (var i = 0, length = node.properties.length, last = length - 1; i < length; i++) {
            var _node$extra2;

            var prop = node.properties[i];
            var isLast = i === last;
            this.toAssignableObjectExpressionProp(prop, isLast, isLHS);

            if (isLast && prop.type === "RestElement" && (_node$extra2 = node.extra) !== null && _node$extra2 !== void 0 && _node$extra2.trailingComma) {
              this.raiseRestNotLast(node.extra.trailingComma);
            }
          }

          break;

        case "ObjectProperty":
          this.toAssignable(node.value, isLHS);
          break;

        case "SpreadElement":
          {
            this.checkToRestConversion(node);
            node.type = "RestElement";
            var arg = node.argument;
            this.toAssignable(arg, isLHS);
            break;
          }

        case "ArrayExpression":
          node.type = "ArrayPattern";
          this.toAssignableList(node.elements, (_node$extra3 = node.extra) === null || _node$extra3 === void 0 ? void 0 : _node$extra3.trailingComma, isLHS);
          break;

        case "AssignmentExpression":
          if (node.operator !== "=") {
            this.raise(node.left.end, _error.Errors.MissingEqInAssignment);
          }

          node.type = "AssignmentPattern";
          delete node.operator;
          this.toAssignable(node.left, isLHS);
          break;

        case "ParenthesizedExpression":
          /*::invariant (parenthesized !== undefined) */
          this.toAssignable(parenthesized, isLHS);
          break;

        default: // We don't know how to deal with this node. It will
        // be reported by a later call to checkLVal

      }

      return node;
    }
  }, {
    key: "toAssignableObjectExpressionProp",
    value: function toAssignableObjectExpressionProp(prop, isLast, isLHS) {
      if (prop.type === "ObjectMethod") {
        var error = prop.kind === "get" || prop.kind === "set" ? _error.Errors.PatternHasAccessor : _error.Errors.PatternHasMethod;
        /* eslint-disable @babel/development-internal/dry-error-messages */

        this.raise(prop.key.start, error);
        /* eslint-enable @babel/development-internal/dry-error-messages */
      } else if (prop.type === "SpreadElement" && !isLast) {
        this.raiseRestNotLast(prop.start);
      } else {
        this.toAssignable(prop, isLHS);
      }
    } // Convert list of expression atoms to binding list.

  }, {
    key: "toAssignableList",
    value: function toAssignableList(exprList, trailingCommaPos, isLHS) {
      var end = exprList.length;

      if (end) {
        var last = exprList[end - 1];

        if ((last === null || last === void 0 ? void 0 : last.type) === "RestElement") {
          --end;
        } else if ((last === null || last === void 0 ? void 0 : last.type) === "SpreadElement") {
          last.type = "RestElement";
          var arg = last.argument;
          this.toAssignable(arg, isLHS);
          arg = unwrapParenthesizedExpression(arg);

          if (arg.type !== "Identifier" && arg.type !== "MemberExpression" && arg.type !== "ArrayPattern" && arg.type !== "ObjectPattern") {
            this.unexpected(arg.start);
          }

          if (trailingCommaPos) {
            this.raiseTrailingCommaAfterRest(trailingCommaPos);
          }

          --end;
        }
      }

      for (var i = 0; i < end; i++) {
        var elt = exprList[i];

        if (elt) {
          this.toAssignable(elt, isLHS);

          if (elt.type === "RestElement") {
            this.raiseRestNotLast(elt.start);
          }
        }
      }

      return exprList;
    } // Convert list of expression atoms to a list of

  }, {
    key: "toReferencedList",
    value: function toReferencedList(exprList, isParenthesizedExpr) {
      return exprList;
    }
  }, {
    key: "toReferencedListDeep",
    value: function toReferencedListDeep(exprList, isParenthesizedExpr) {
      this.toReferencedList(exprList, isParenthesizedExpr);

      var _iterator = _createForOfIteratorHelper(exprList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var expr = _step.value;

          if ((expr === null || expr === void 0 ? void 0 : expr.type) === "ArrayExpression") {
            this.toReferencedListDeep(expr.elements);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } // Parses spread element.

  }, {
    key: "parseSpread",
    value: function parseSpread(refExpressionErrors, refNeedsArrowPos) {
      var node = this.startNode();
      this.next();
      node.argument = this.parseMaybeAssignAllowIn(refExpressionErrors, undefined, refNeedsArrowPos);
      return this.finishNode(node, "SpreadElement");
    } // https://tc39.es/ecma262/#prod-BindingRestProperty
    // https://tc39.es/ecma262/#prod-BindingRestElement

  }, {
    key: "parseRestBinding",
    value: function parseRestBinding() {
      var node = this.startNode();
      this.next(); // eat `...`

      node.argument = this.parseBindingAtom();
      return this.finishNode(node, "RestElement");
    } // Parses lvalue (assignable) atom.

  }, {
    key: "parseBindingAtom",
    value: function parseBindingAtom() {
      // https://tc39.es/ecma262/#prod-BindingPattern
      switch (this.state.type) {
        case _types.types.bracketL:
          {
            var node = this.startNode();
            this.next();
            node.elements = this.parseBindingList(_types.types.bracketR, charCodes.rightSquareBracket, true);
            return this.finishNode(node, "ArrayPattern");
          }

        case _types.types.braceL:
          return this.parseObjectLike(_types.types.braceR, true);
      } // https://tc39.es/ecma262/#prod-BindingIdentifier


      return this.parseIdentifier();
    } // https://tc39.es/ecma262/#prod-BindingElementList

  }, {
    key: "parseBindingList",
    value: function parseBindingList(close, closeCharCode, allowEmpty, allowModifiers) {
      var elts = [];
      var first = true;

      while (!this.eat(close)) {
        if (first) {
          first = false;
        } else {
          this.expect(_types.types.comma);
        }

        if (allowEmpty && this.match(_types.types.comma)) {
          // $FlowFixMe This method returns `$ReadOnlyArray<?Pattern>` if `allowEmpty` is set.
          elts.push(null);
        } else if (this.eat(close)) {
          break;
        } else if (this.match(_types.types.ellipsis)) {
          elts.push(this.parseAssignableListItemTypes(this.parseRestBinding()));
          this.checkCommaAfterRest(closeCharCode);
          this.expect(close);
          break;
        } else {
          var decorators = [];

          if (this.match(_types.types.at) && this.hasPlugin("decorators")) {
            this.raise(this.state.start, _error.Errors.UnsupportedParameterDecorator);
          } // invariant: hasPlugin("decorators-legacy")


          while (this.match(_types.types.at)) {
            decorators.push(this.parseDecorator());
          }

          elts.push(this.parseAssignableListItem(allowModifiers, decorators));
        }
      }

      return elts;
    }
  }, {
    key: "parseAssignableListItem",
    value: function parseAssignableListItem(allowModifiers, decorators) {
      var left = this.parseMaybeDefault();
      this.parseAssignableListItemTypes(left);
      var elt = this.parseMaybeDefault(left.start, left.loc.start, left);

      if (decorators.length) {
        left.decorators = decorators;
      }

      return elt;
    } // Used by flow/typescript plugin to add type annotations to binding elements

  }, {
    key: "parseAssignableListItemTypes",
    value: function parseAssignableListItemTypes(param) {
      return param;
    } // Parses assignment pattern around given atom if possible.
    // https://tc39.es/ecma262/#prod-BindingElement

  }, {
    key: "parseMaybeDefault",
    value: function parseMaybeDefault(startPos, startLoc, left) {
      var _startLoc, _startPos, _left;

      startLoc = (_startLoc = startLoc) !== null && _startLoc !== void 0 ? _startLoc : this.state.startLoc;
      startPos = (_startPos = startPos) !== null && _startPos !== void 0 ? _startPos : this.state.start; // $FlowIgnore

      left = (_left = left) !== null && _left !== void 0 ? _left : this.parseBindingAtom();
      if (!this.eat(_types.types.eq)) return left;
      var node = this.startNodeAt(startPos, startLoc);
      node.left = left;
      node.right = this.parseMaybeAssignAllowIn();
      return this.finishNode(node, "AssignmentPattern");
    }
    /**
     * Verify that if a node is an lval - something that can be assigned to.
     *
     * @param {Expression} expr The given node
     * @param {string} contextDescription The auxiliary context information printed when error is thrown
     * @param {BindingTypes} [bindingType=BIND_NONE] The desired binding type. If the given node is an identifier and `bindingType` is not
                                                     BIND_NONE, `checkLVal` will register binding to the parser scope
                                                     See also src/util/scopeflags.js
     * @param {?Set<string>} checkClashes An optional string set to check if an identifier name is included. `checkLVal` will add checked
                                          identifier name to `checkClashes` It is used in tracking duplicates in function parameter lists. If
                                          it is nullish, `checkLVal` will skip duplicate checks
     * @param {boolean} [disallowLetBinding] Whether an identifier named "let" should be disallowed
     * @param {boolean} [strictModeChanged=false] Whether an identifier has been parsed in a sloppy context but should be reinterpreted as
                                                  strict-mode. e.g. `(arguments) => { "use strict "}`
     * @memberof LValParser
     */

  }, {
    key: "checkLVal",
    value: function checkLVal(expr, contextDescription) {
      var bindingType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _scopeflags.BIND_NONE;
      var checkClashes = arguments.length > 3 ? arguments[3] : undefined;
      var disallowLetBinding = arguments.length > 4 ? arguments[4] : undefined;
      var strictModeChanged = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

      switch (expr.type) {
        case "Identifier":
          {
            var name = expr.name;

            if (this.state.strict && ( // "Global" reserved words have already been checked by parseIdentifier,
            // unless they have been found in the id or parameters of a strict-mode
            // function in a sloppy context.
            strictModeChanged ? (0, _identifier.isStrictBindReservedWord)(name, this.inModule) : (0, _identifier.isStrictBindOnlyReservedWord)(name))) {
              this.raise(expr.start, bindingType === _scopeflags.BIND_NONE ? _error.Errors.StrictEvalArguments : _error.Errors.StrictEvalArgumentsBinding, name);
            }

            if (checkClashes) {
              if (checkClashes.has(name)) {
                this.raise(expr.start, _error.Errors.ParamDupe);
              } else {
                checkClashes.add(name);
              }
            }

            if (disallowLetBinding && name === "let") {
              this.raise(expr.start, _error.Errors.LetInLexicalBinding);
            }

            if (!(bindingType & _scopeflags.BIND_NONE)) {
              this.scope.declareName(name, bindingType, expr.start);
            }

            break;
          }

        case "MemberExpression":
          if (bindingType !== _scopeflags.BIND_NONE) {
            this.raise(expr.start, _error.Errors.InvalidPropertyBindingPattern);
          }

          break;

        case "ObjectPattern":
          var _iterator2 = _createForOfIteratorHelper(expr.properties),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var prop = _step2.value;
              if (this.isObjectProperty(prop)) prop = prop.value; // If we find here an ObjectMethod, it's because this was originally
              // an ObjectExpression which has then been converted.
              // toAssignable already reported this error with a nicer message.
              else if (this.isObjectMethod(prop)) continue;
              this.checkLVal(prop, "object destructuring pattern", bindingType, checkClashes, disallowLetBinding);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          break;

        case "ArrayPattern":
          var _iterator3 = _createForOfIteratorHelper(expr.elements),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var elem = _step3.value;

              if (elem) {
                this.checkLVal(elem, "array destructuring pattern", bindingType, checkClashes, disallowLetBinding);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          break;

        case "AssignmentPattern":
          this.checkLVal(expr.left, "assignment pattern", bindingType, checkClashes);
          break;

        case "RestElement":
          this.checkLVal(expr.argument, "rest element", bindingType, checkClashes);
          break;

        case "ParenthesizedExpression":
          this.checkLVal(expr.expression, "parenthesized expression", bindingType, checkClashes);
          break;

        default:
          {
            this.raise(expr.start, bindingType === _scopeflags.BIND_NONE ? _error.Errors.InvalidLhs : _error.Errors.InvalidLhsBinding, contextDescription);
          }
      }
    }
  }, {
    key: "checkToRestConversion",
    value: function checkToRestConversion(node) {
      if (node.argument.type !== "Identifier" && node.argument.type !== "MemberExpression") {
        this.raise(node.argument.start, _error.Errors.InvalidRestAssignmentPattern);
      }
    }
  }, {
    key: "checkCommaAfterRest",
    value: function checkCommaAfterRest(close) {
      if (this.match(_types.types.comma)) {
        if (this.lookaheadCharCode() === close) {
          this.raiseTrailingCommaAfterRest(this.state.start);
        } else {
          this.raiseRestNotLast(this.state.start);
        }
      }
    }
  }, {
    key: "raiseRestNotLast",
    value: function raiseRestNotLast(pos) {
      throw this.raise(pos, _error.Errors.ElementAfterRest);
    }
  }, {
    key: "raiseTrailingCommaAfterRest",
    value: function raiseTrailingCommaAfterRest(pos) {
      this.raise(pos, _error.Errors.RestTrailingComma);
    }
  }]);

  return LValParser;
}(_node.NodeUtils);

exports["default"] = LValParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvbHZhbC5qcyJdLCJuYW1lcyI6WyJ1bndyYXBQYXJlbnRoZXNpemVkRXhwcmVzc2lvbiIsIm5vZGUiLCJ0eXBlIiwiZXhwcmVzc2lvbiIsIkxWYWxQYXJzZXIiLCJpc0xIUyIsInBhcmVudGhlc2l6ZWQiLCJ1bmRlZmluZWQiLCJleHRyYSIsImV4cHJlc3Npb25TY29wZSIsInJlY29yZFBhcmVudGhlc2l6ZWRJZGVudGlmaWVyRXJyb3IiLCJzdGFydCIsIkVycm9ycyIsIkludmFsaWRQYXJlbnRoZXNpemVkQXNzaWdubWVudCIsInJhaXNlIiwiaSIsImxlbmd0aCIsInByb3BlcnRpZXMiLCJsYXN0IiwicHJvcCIsImlzTGFzdCIsInRvQXNzaWduYWJsZU9iamVjdEV4cHJlc3Npb25Qcm9wIiwidHJhaWxpbmdDb21tYSIsInJhaXNlUmVzdE5vdExhc3QiLCJ0b0Fzc2lnbmFibGUiLCJ2YWx1ZSIsImNoZWNrVG9SZXN0Q29udmVyc2lvbiIsImFyZyIsImFyZ3VtZW50IiwidG9Bc3NpZ25hYmxlTGlzdCIsImVsZW1lbnRzIiwib3BlcmF0b3IiLCJsZWZ0IiwiZW5kIiwiTWlzc2luZ0VxSW5Bc3NpZ25tZW50IiwiZXJyb3IiLCJraW5kIiwiUGF0dGVybkhhc0FjY2Vzc29yIiwiUGF0dGVybkhhc01ldGhvZCIsImtleSIsImV4cHJMaXN0IiwidHJhaWxpbmdDb21tYVBvcyIsInVuZXhwZWN0ZWQiLCJyYWlzZVRyYWlsaW5nQ29tbWFBZnRlclJlc3QiLCJlbHQiLCJpc1BhcmVudGhlc2l6ZWRFeHByIiwidG9SZWZlcmVuY2VkTGlzdCIsImV4cHIiLCJ0b1JlZmVyZW5jZWRMaXN0RGVlcCIsInJlZkV4cHJlc3Npb25FcnJvcnMiLCJyZWZOZWVkc0Fycm93UG9zIiwic3RhcnROb2RlIiwibmV4dCIsInBhcnNlTWF5YmVBc3NpZ25BbGxvd0luIiwiZmluaXNoTm9kZSIsInBhcnNlQmluZGluZ0F0b20iLCJzdGF0ZSIsInR0IiwiYnJhY2tldEwiLCJwYXJzZUJpbmRpbmdMaXN0IiwiYnJhY2tldFIiLCJjaGFyQ29kZXMiLCJyaWdodFNxdWFyZUJyYWNrZXQiLCJicmFjZUwiLCJwYXJzZU9iamVjdExpa2UiLCJicmFjZVIiLCJwYXJzZUlkZW50aWZpZXIiLCJjbG9zZSIsImNsb3NlQ2hhckNvZGUiLCJhbGxvd0VtcHR5IiwiYWxsb3dNb2RpZmllcnMiLCJlbHRzIiwiZmlyc3QiLCJlYXQiLCJleHBlY3QiLCJjb21tYSIsIm1hdGNoIiwicHVzaCIsImVsbGlwc2lzIiwicGFyc2VBc3NpZ25hYmxlTGlzdEl0ZW1UeXBlcyIsInBhcnNlUmVzdEJpbmRpbmciLCJjaGVja0NvbW1hQWZ0ZXJSZXN0IiwiZGVjb3JhdG9ycyIsImF0IiwiaGFzUGx1Z2luIiwiVW5zdXBwb3J0ZWRQYXJhbWV0ZXJEZWNvcmF0b3IiLCJwYXJzZURlY29yYXRvciIsInBhcnNlQXNzaWduYWJsZUxpc3RJdGVtIiwicGFyc2VNYXliZURlZmF1bHQiLCJsb2MiLCJwYXJhbSIsInN0YXJ0UG9zIiwic3RhcnRMb2MiLCJlcSIsInN0YXJ0Tm9kZUF0IiwicmlnaHQiLCJjb250ZXh0RGVzY3JpcHRpb24iLCJiaW5kaW5nVHlwZSIsIkJJTkRfTk9ORSIsImNoZWNrQ2xhc2hlcyIsImRpc2FsbG93TGV0QmluZGluZyIsInN0cmljdE1vZGVDaGFuZ2VkIiwibmFtZSIsInN0cmljdCIsImluTW9kdWxlIiwiU3RyaWN0RXZhbEFyZ3VtZW50cyIsIlN0cmljdEV2YWxBcmd1bWVudHNCaW5kaW5nIiwiaGFzIiwiUGFyYW1EdXBlIiwiYWRkIiwiTGV0SW5MZXhpY2FsQmluZGluZyIsInNjb3BlIiwiZGVjbGFyZU5hbWUiLCJJbnZhbGlkUHJvcGVydHlCaW5kaW5nUGF0dGVybiIsImlzT2JqZWN0UHJvcGVydHkiLCJpc09iamVjdE1ldGhvZCIsImNoZWNrTFZhbCIsImVsZW0iLCJJbnZhbGlkTGhzIiwiSW52YWxpZExoc0JpbmRpbmciLCJJbnZhbGlkUmVzdEFzc2lnbm1lbnRQYXR0ZXJuIiwibG9va2FoZWFkQ2hhckNvZGUiLCJwb3MiLCJFbGVtZW50QWZ0ZXJSZXN0IiwiUmVzdFRyYWlsaW5nQ29tbWEiLCJOb2RlVXRpbHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdBOztBQUNBOztBQWNBOztBQUlBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLDZCQUE2QixHQUFHLFNBQWhDQSw2QkFBZ0MsQ0FBQ0MsSUFBRCxFQUFzQjtBQUMxRCxTQUFPQSxJQUFJLENBQUNDLElBQUwsS0FBYyx5QkFBZCxHQUNIRiw2QkFBNkIsQ0FBQ0MsSUFBSSxDQUFDRSxVQUFOLENBRDFCLEdBRUhGLElBRko7QUFHRCxDQUpEOztJQU1xQkcsVTs7Ozs7Ozs7Ozs7OztXQUNuQjs7QUFDQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0U7O0FBQ0E7QUFDRjtBQUNBOztBQUVFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLRSwwQkFBYUgsSUFBYixFQUF1RDtBQUFBOztBQUFBLFVBQTlCSSxLQUE4Qix1RUFBYixLQUFhO0FBQ3JELFVBQUlDLGFBQWEsR0FBR0MsU0FBcEI7O0FBQ0EsVUFBSU4sSUFBSSxDQUFDQyxJQUFMLEtBQWMseUJBQWQsbUJBQTJDRCxJQUFJLENBQUNPLEtBQWhELHdDQUEyQyxZQUFZRixhQUEzRCxFQUEwRTtBQUN4RUEsUUFBQUEsYUFBYSxHQUFHTiw2QkFBNkIsQ0FBQ0MsSUFBRCxDQUE3Qzs7QUFDQSxZQUFJSSxLQUFKLEVBQVc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQUlDLGFBQWEsQ0FBQ0osSUFBZCxLQUF1QixZQUEzQixFQUF5QztBQUN2QyxpQkFBS08sZUFBTCxDQUFxQkMsa0NBQXJCLENBQ0VULElBQUksQ0FBQ1UsS0FEUCxFQUVFQyxjQUFPQyw4QkFGVDtB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NEJBQXZDO0FBQ0Q7QUFDRjs7O1dBRUQsNkJBQW9CckQsS0FBcEIsRUFBNEQ7QUFDMUQsVUFBSSxLQUFLUyxLQUFMLENBQVduQixhQUFHa0IsS0FBZCxDQUFKLEVBQTBCO0FBQ3hCLFlBQUksS0FBSzhDLGlCQUFMLE9BQTZCdEQsS0FBakMsRUFBd0M7QUFDdEMsZUFBS3hCLDJCQUFMLENBQWlDLEtBQUthLEtBQUwsQ0FBVzdDLEtBQTVDO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBS1ksZ0JBQUwsQ0FBc0IsS0FBS2lDLEtBQUwsQ0FBVzdDLEtBQWpDO0FBQ0Q7QUFDRjtBQUNGOzs7V0FFRCwwQkFBaUIrRyxHQUFqQixFQUE4QjtBQUM1QixZQUFNLEtBQUs1RyxLQUFMLENBQVc0RyxHQUFYLEVBQWdCOUcsY0FBTytHLGdCQUF2QixDQUFOO0FBQ0Q7OztXQUVELHFDQUE0QkQsR0FBNUIsRUFBeUM7QUFDdkMsV0FBSzVHLEtBQUwsQ0FBVzRHLEdBQVgsRUFBZ0I5RyxjQUFPZ0gsaUJBQXZCO0FBQ0Q7Ozs7RUE1ZnFDQyxlIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuLyo6OiBkZWNsYXJlIHZhciBpbnZhcmlhbnQ7ICovXG5pbXBvcnQgKiBhcyBjaGFyQ29kZXMgZnJvbSBcImNoYXJjb2Rlc1wiO1xuaW1wb3J0IHsgdHlwZXMgYXMgdHQsIHR5cGUgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL3Rva2VuaXplci90eXBlc1wiO1xuaW1wb3J0IHR5cGUge1xuICBUU1BhcmFtZXRlclByb3BlcnR5LFxuICBEZWNvcmF0b3IsXG4gIEV4cHJlc3Npb24sXG4gIE5vZGUsXG4gIFBhdHRlcm4sXG4gIFJlc3RFbGVtZW50LFxuICBTcHJlYWRFbGVtZW50LFxuICAvKjo6IElkZW50aWZpZXIsICovXG4gIC8qOjogT2JqZWN0RXhwcmVzc2lvbiwgKi9cbiAgLyo6OiBPYmplY3RQYXR0ZXJuLCAqL1xufSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgUG9zLCBQb3NpdGlvbiB9IGZyb20gXCIuLi91dGlsL2xvY2F0aW9uXCI7XG5pbXBvcnQge1xuICBpc1N0cmljdEJpbmRPbmx5UmVzZXJ2ZWRXb3JkLFxuICBpc1N0cmljdEJpbmRSZXNlcnZlZFdvcmQsXG59IGZyb20gXCIuLi91dGlsL2lkZW50aWZpZXJcIjtcbmltcG9ydCB7IE5vZGVVdGlscyB9IGZyb20gXCIuL25vZGVcIjtcbmltcG9ydCB7IHR5cGUgQmluZGluZ1R5cGVzLCBCSU5EX05PTkUgfSBmcm9tIFwiLi4vdXRpbC9zY29wZWZsYWdzXCI7XG5pbXBvcnQgeyBFeHByZXNzaW9uRXJyb3JzIH0gZnJvbSBcIi4vdXRpbFwiO1xuaW1wb3J0IHsgRXJyb3JzIH0gZnJvbSBcIi4vZXJyb3JcIjtcblxuY29uc3QgdW53cmFwUGFyZW50aGVzaXplZEV4cHJlc3Npb24gPSAobm9kZTogTm9kZSk6IE5vZGUgPT4ge1xuICByZXR1cm4gbm9kZS50eXBlID09PSBcIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uXCJcbiAgICA/IHVud3JhcFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbilcbiAgICA6IG5vZGU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMVmFsUGFyc2VyIGV4dGVuZHMgTm9kZVV0aWxzIHtcbiAgLy8gRm9yd2FyZC1kZWNsYXJhdGlvbjogZGVmaW5lZCBpbiBleHByZXNzaW9uLmpzXG4gIC8qOjpcbiAgK3BhcnNlSWRlbnRpZmllcjogKGxpYmVyYWw/OiBib29sZWFuKSA9PiBJZGVudGlmaWVyO1xuICArcGFyc2VNYXliZUFzc2lnbkFsbG93SW46IChcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzPzogP0V4cHJlc3Npb25FcnJvcnMsXG4gICAgYWZ0ZXJMZWZ0UGFyc2U/OiBGdW5jdGlvbixcbiAgICByZWZOZWVkc0Fycm93UG9zPzogP1BvcyxcbiAgKSA9PiBFeHByZXNzaW9uO1xuICArcGFyc2VPYmplY3RMaWtlOiA8VDogT2JqZWN0UGF0dGVybiB8IE9iamVjdEV4cHJlc3Npb24+KFxuICAgIGNsb3NlOiBUb2tlblR5cGUsXG4gICAgaXNQYXR0ZXJuOiBib29sZWFuLFxuICAgIGlzUmVjb3JkPzogP2Jvb2xlYW4sXG4gICAgcmVmRXhwcmVzc2lvbkVycm9ycz86ID9FeHByZXNzaW9uRXJyb3JzLFxuICApID0+IFQ7XG4gICovXG4gIC8vIEZvcndhcmQtZGVjbGFyYXRpb246IGRlZmluZWQgaW4gc3RhdGVtZW50LmpzXG4gIC8qOjpcbiAgK3BhcnNlRGVjb3JhdG9yOiAoKSA9PiBEZWNvcmF0b3I7XG4gICovXG5cbiAgLyoqXG4gICAqIENvbnZlcnQgZXhpc3RpbmcgZXhwcmVzc2lvbiBhdG9tIHRvIGFzc2lnbmFibGUgcGF0dGVyblxuICAgKiBpZiBwb3NzaWJsZS4gQWxzbyBjaGVja3MgaW52YWxpZCBkZXN0cnVjdHVyaW5nIHRhcmdldHM6XG5cbiAgIC0gUGFyZW50aGVzaXplZCBEZXN0cnVjdHVyaW5nIHBhdHRlcm5zXG4gICAtIFJlc3RFbGVtZW50IGlzIG5vdCB0aGUgbGFzdCBlbGVtZW50XG4gICAtIE1pc3NpbmcgYD1gIGluIGFzc2lnbm1lbnQgcGF0dGVyblxuXG4gICBOT1RFOiBUaGVyZSBpcyBhIGNvcnJlc3BvbmRpbmcgXCJpc0Fzc2lnbmFibGVcIiBtZXRob2QgaW4gZmxvdy5qcy5cbiAgIFdoZW4gdGhpcyBvbmUgaXMgdXBkYXRlZCwgcGxlYXNlIGNoZWNrIGlmIGFsc28gdGhhdCBvbmUgbmVlZHMgdG8gYmUgdXBkYXRlZC5cblxuICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgVGhlIGV4cHJlc3Npb24gYXRvbVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0xIUz1mYWxzZV0gV2hldGhlciB3ZSBhcmUgcGFyc2luZyBhIExlZnRIYW5kU2lkZUV4cHJlc3Npb24uIElmIGlzTEhTIGlzIGB0cnVlYCwgdGhlIGZvbGxvd2luZyBjYXNlcyBhcmUgYWxsb3dlZDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBbKGEpXSA9IFswXWAsIGBbKGEuYildID0gWzBdYFxuXG4gICAqIEByZXR1cm5zIHtOb2RlfSBUaGUgY29udmVydGVkIGFzc2lnbmFibGUgcGF0dGVyblxuICAgKiBAbWVtYmVyb2YgTFZhbFBhcnNlclxuICAgKi9cbiAgdG9Bc3NpZ25hYmxlKG5vZGU6IE5vZGUsIGlzTEhTOiBib29sZWFuID0gZmFsc2UpOiBOb2RlIHtcbiAgICBsZXQgcGFyZW50aGVzaXplZCA9IHVuZGVmaW5lZDtcbiAgICBpZiAobm9kZS50eXBlID09PSBcIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uXCIgfHwgbm9kZS5leHRyYT8ucGFyZW50aGVzaXplZCkge1xuICAgICAgcGFyZW50aGVzaXplZCA9IHVud3JhcFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uKG5vZGUpO1xuICAgICAgaWYgKGlzTEhTKSB7XG4gICAgICAgIC8vIGFuIExIUyBjYW4gYmUgcmVpbnRlcnByZXRlZCB0byBhIGJpbmRpbmcgcGF0dGVybiBidXQgbm90IHZpY2UgdmVyc2EuXG4gICAgICAgIC8vIHRoZXJlZm9yZSBhIHBhcmVudGhlc2l6ZWQgaWRlbnRpZmllciBpcyBhbWJpZ3VvdXMgdW50aWwgd2UgYXJlIHN1cmUgaXQgaXMgYW4gYXNzaWdubWVudCBleHByZXNzaW9uXG4gICAgICAgIC8vIGkuZS4gYChbKGEpID0gW11dID0gW10pID0+IHt9YFxuICAgICAgICAvLyBzZWUgYWxzbyBgcmVjb3JkUGFyZW50aGVzaXplZElkZW50aWZpZXJFcnJvcmAgc2lnbmF0dXJlIGluIHBhY2thZ2VzL2JhYmVsLXBhcnNlci9zcmMvdXRpbC9leHByZXNzaW9uLXNjb3BlLmpzXG4gICAgICAgIGlmIChwYXJlbnRoZXNpemVkLnR5cGUgPT09IFwiSWRlbnRpZmllclwiKSB7XG4gICAgICAgICAgdGhpcy5leHByZXNzaW9uU2NvcGUucmVjb3JkUGFyZW50aGVzaXplZElkZW50aWZpZXJFcnJvcihcbiAgICAgICAgICAgIG5vZGUuc3RhcnQsXG4gICAgICAgICAgICBFcnJvcnMuSW52YWxpZFBhcmVudGhlc2l6ZWRBc3NpZ25tZW50LFxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAocGFyZW50aGVzaXplZC50eXBlICE9PSBcIk1lbWJlckV4cHJlc3Npb25cIikge1xuICAgICAgICAgIC8vIEEgcGFyZW50aGVzaXplZCBtZW1iZXIgZXhwcmVzc2lvbiBjYW4gYmUgaW4gTEhTIGJ1dCBub3QgaW4gcGF0dGVybi5cbiAgICAgICAgICAvLyBJZiB0aGUgTEhTIGlzIGxhdGVyIGludGVycHJldGVkIGFzIGEgcGF0dGVybiwgYGNoZWNrTFZhbGAgd2lsbCB0aHJvdyBmb3IgbWVtYmVyIGV4cHJlc3Npb24gYmluZGluZ1xuICAgICAgICAgIC8vIGkuZS4gYChbKGEuYikgPSBbXV0gPSBbXSkgPT4ge31gXG4gICAgICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBFcnJvcnMuSW52YWxpZFBhcmVudGhlc2l6ZWRBc3NpZ25tZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yYWlzZShub2RlLnN0YXJ0LCBFcnJvcnMuSW52YWxpZFBhcmVudGhlc2l6ZWRBc3NpZ25tZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5vZGUudHlwZSkge1xuICAgICAgY2FzZSBcIklkZW50aWZpZXJcIjpcbiAgICAgIGNhc2UgXCJPYmplY3RQYXR0ZXJuXCI6XG4gICAgICBjYXNlIFwiQXJyYXlQYXR0ZXJuXCI6XG4gICAgICBjYXNlIFwiQXNzaWdubWVudFBhdHRlcm5cIjpcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJPYmplY3RFeHByZXNzaW9uXCI6XG4gICAgICAgIG5vZGUudHlwZSA9IFwiT2JqZWN0UGF0dGVyblwiO1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIGxldCBpID0gMCwgbGVuZ3RoID0gbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCwgbGFzdCA9IGxlbmd0aCAtIDE7XG4gICAgICAgICAgaSA8IGxlbmd0aDtcbiAgICAgICAgICBpKytcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29uc3QgcHJvcCA9IG5vZGUucHJvcGVydGllc1tpXTtcbiAgICAgICAgICBjb25zdCBpc0xhc3QgPSBpID09PSBsYXN0O1xuICAgICAgICAgIHRoaXMudG9Bc3NpZ25hYmxlT2JqZWN0RXhwcmVzc2lvblByb3AocHJvcCwgaXNMYXN0LCBpc0xIUyk7XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBpc0xhc3QgJiZcbiAgICAgICAgICAgIHByb3AudHlwZSA9PT0gXCJSZXN0RWxlbWVudFwiICYmXG4gICAgICAgICAgICBub2RlLmV4dHJhPy50cmFpbGluZ0NvbW1hXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlUmVzdE5vdExhc3Qobm9kZS5leHRyYS50cmFpbGluZ0NvbW1hKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJPYmplY3RQcm9wZXJ0eVwiOlxuICAgICAgICB0aGlzLnRvQXNzaWduYWJsZShub2RlLnZhbHVlLCBpc0xIUyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiU3ByZWFkRWxlbWVudFwiOiB7XG4gICAgICAgIHRoaXMuY2hlY2tUb1Jlc3RDb252ZXJzaW9uKG5vZGUpO1xuXG4gICAgICAgIG5vZGUudHlwZSA9IFwiUmVzdEVsZW1lbnRcIjtcbiAgICAgICAgY29uc3QgYXJnID0gbm9kZS5hcmd1bWVudDtcbiAgICAgICAgdGhpcy50b0Fzc2lnbmFibGUoYXJnLCBpc0xIUyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwiQXJyYXlFeHByZXNzaW9uXCI6XG4gICAgICAgIG5vZGUudHlwZSA9IFwiQXJyYXlQYXR0ZXJuXCI7XG4gICAgICAgIHRoaXMudG9Bc3NpZ25hYmxlTGlzdChub2RlLmVsZW1lbnRzLCBub2RlLmV4dHJhPy50cmFpbGluZ0NvbW1hLCBpc0xIUyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiQXNzaWdubWVudEV4cHJlc3Npb25cIjpcbiAgICAgICAgaWYgKG5vZGUub3BlcmF0b3IgIT09IFwiPVwiKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShub2RlLmxlZnQuZW5kLCBFcnJvcnMuTWlzc2luZ0VxSW5Bc3NpZ25tZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUudHlwZSA9IFwiQXNzaWdubWVudFBhdHRlcm5cIjtcbiAgICAgICAgZGVsZXRlIG5vZGUub3BlcmF0b3I7XG4gICAgICAgIHRoaXMudG9Bc3NpZ25hYmxlKG5vZGUubGVmdCwgaXNMSFMpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uXCI6XG4gICAgICAgIC8qOjppbnZhcmlhbnQgKHBhcmVudGhlc2l6ZWQgIT09IHVuZGVmaW5lZCkgKi9cbiAgICAgICAgdGhpcy50b0Fzc2lnbmFibGUocGFyZW50aGVzaXplZCwgaXNMSFMpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgIC8vIFdlIGRvbid0IGtub3cgaG93IHRvIGRlYWwgd2l0aCB0aGlzIG5vZGUuIEl0IHdpbGxcbiAgICAgIC8vIGJlIHJlcG9ydGVkIGJ5IGEgbGF0ZXIgY2FsbCB0byBjaGVja0xWYWxcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB0b0Fzc2lnbmFibGVPYmplY3RFeHByZXNzaW9uUHJvcChcbiAgICBwcm9wOiBOb2RlLFxuICAgIGlzTGFzdDogYm9vbGVhbixcbiAgICBpc0xIUzogYm9vbGVhbixcbiAgKSB7XG4gICAgaWYgKHByb3AudHlwZSA9PT0gXCJPYmplY3RNZXRob2RcIikge1xuICAgICAgY29uc3QgZXJyb3IgPVxuICAgICAgICBwcm9wLmtpbmQgPT09IFwiZ2V0XCIgfHwgcHJvcC5raW5kID09PSBcInNldFwiXG4gICAgICAgICAgPyBFcnJvcnMuUGF0dGVybkhhc0FjY2Vzc29yXG4gICAgICAgICAgOiBFcnJvcnMuUGF0dGVybkhhc01ldGhvZDtcblxuICAgICAgLyogZXNsaW50LWRpc2FibGUgQGJhYmVsL2RldmVsb3BtZW50LWludGVybmFsL2RyeS1lcnJvci1tZXNzYWdlcyAqL1xuICAgICAgdGhpcy5yYWlzZShwcm9wLmtleS5zdGFydCwgZXJyb3IpO1xuICAgICAgLyogZXNsaW50LWVuYWJsZSBAYmFiZWwvZGV2ZWxvcG1lbnQtaW50ZXJuYWwvZHJ5LWVycm9yLW1lc3NhZ2VzICovXG4gICAgfSBlbHNlIGlmIChwcm9wLnR5cGUgPT09IFwiU3ByZWFkRWxlbWVudFwiICYmICFpc0xhc3QpIHtcbiAgICAgIHRoaXMucmFpc2VSZXN0Tm90TGFzdChwcm9wLnN0YXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b0Fzc2lnbmFibGUocHJvcCwgaXNMSFMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENvbnZlcnQgbGlzdCBvZiBleHByZXNzaW9uIGF0b21zIHRvIGJpbmRpbmcgbGlzdC5cblxuICB0b0Fzc2lnbmFibGVMaXN0KFxuICAgIGV4cHJMaXN0OiBFeHByZXNzaW9uW10sXG4gICAgdHJhaWxpbmdDb21tYVBvcz86ID9udW1iZXIsXG4gICAgaXNMSFM6IGJvb2xlYW4sXG4gICk6ICRSZWFkT25seUFycmF5PFBhdHRlcm4+IHtcbiAgICBsZXQgZW5kID0gZXhwckxpc3QubGVuZ3RoO1xuICAgIGlmIChlbmQpIHtcbiAgICAgIGNvbnN0IGxhc3QgPSBleHByTGlzdFtlbmQgLSAxXTtcbiAgICAgIGlmIChsYXN0Py50eXBlID09PSBcIlJlc3RFbGVtZW50XCIpIHtcbiAgICAgICAgLS1lbmQ7XG4gICAgICB9IGVsc2UgaWYgKGxhc3Q/LnR5cGUgPT09IFwiU3ByZWFkRWxlbWVudFwiKSB7XG4gICAgICAgIGxhc3QudHlwZSA9IFwiUmVzdEVsZW1lbnRcIjtcbiAgICAgICAgbGV0IGFyZyA9IGxhc3QuYXJndW1lbnQ7XG4gICAgICAgIHRoaXMudG9Bc3NpZ25hYmxlKGFyZywgaXNMSFMpO1xuICAgICAgICBhcmcgPSB1bndyYXBQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihhcmcpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnLnR5cGUgIT09IFwiSWRlbnRpZmllclwiICYmXG4gICAgICAgICAgYXJnLnR5cGUgIT09IFwiTWVtYmVyRXhwcmVzc2lvblwiICYmXG4gICAgICAgICAgYXJnLnR5cGUgIT09IFwiQXJyYXlQYXR0ZXJuXCIgJiZcbiAgICAgICAgICBhcmcudHlwZSAhPT0gXCJPYmplY3RQYXR0ZXJuXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy51bmV4cGVjdGVkKGFyZy5zdGFydCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHJhaWxpbmdDb21tYVBvcykge1xuICAgICAgICAgIHRoaXMucmFpc2VUcmFpbGluZ0NvbW1hQWZ0ZXJSZXN0KHRyYWlsaW5nQ29tbWFQb3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLS1lbmQ7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIGNvbnN0IGVsdCA9IGV4cHJMaXN0W2ldO1xuICAgICAgaWYgKGVsdCkge1xuICAgICAgICB0aGlzLnRvQXNzaWduYWJsZShlbHQsIGlzTEhTKTtcbiAgICAgICAgaWYgKGVsdC50eXBlID09PSBcIlJlc3RFbGVtZW50XCIpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlUmVzdE5vdExhc3QoZWx0LnN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXhwckxpc3Q7XG4gIH1cblxuICAvLyBDb252ZXJ0IGxpc3Qgb2YgZXhwcmVzc2lvbiBhdG9tcyB0byBhIGxpc3Qgb2ZcblxuICB0b1JlZmVyZW5jZWRMaXN0KFxuICAgIGV4cHJMaXN0OiAkUmVhZE9ubHlBcnJheTw/RXhwcmVzc2lvbj4sXG4gICAgaXNQYXJlbnRoZXNpemVkRXhwcj86IGJvb2xlYW4sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgKTogJFJlYWRPbmx5QXJyYXk8P0V4cHJlc3Npb24+IHtcbiAgICByZXR1cm4gZXhwckxpc3Q7XG4gIH1cblxuICB0b1JlZmVyZW5jZWRMaXN0RGVlcChcbiAgICBleHByTGlzdDogJFJlYWRPbmx5QXJyYXk8P0V4cHJlc3Npb24+LFxuICAgIGlzUGFyZW50aGVzaXplZEV4cHI/OiBib29sZWFuLFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnRvUmVmZXJlbmNlZExpc3QoZXhwckxpc3QsIGlzUGFyZW50aGVzaXplZEV4cHIpO1xuXG4gICAgZm9yIChjb25zdCBleHByIG9mIGV4cHJMaXN0KSB7XG4gICAgICBpZiAoZXhwcj8udHlwZSA9PT0gXCJBcnJheUV4cHJlc3Npb25cIikge1xuICAgICAgICB0aGlzLnRvUmVmZXJlbmNlZExpc3REZWVwKGV4cHIuZWxlbWVudHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFBhcnNlcyBzcHJlYWQgZWxlbWVudC5cblxuICBwYXJzZVNwcmVhZChcbiAgICByZWZFeHByZXNzaW9uRXJyb3JzOiA/RXhwcmVzc2lvbkVycm9ycyxcbiAgICByZWZOZWVkc0Fycm93UG9zPzogP1BvcyxcbiAgKTogU3ByZWFkRWxlbWVudCB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgdGhpcy5uZXh0KCk7XG4gICAgbm9kZS5hcmd1bWVudCA9IHRoaXMucGFyc2VNYXliZUFzc2lnbkFsbG93SW4oXG4gICAgICByZWZFeHByZXNzaW9uRXJyb3JzLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgcmVmTmVlZHNBcnJvd1BvcyxcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGUobm9kZSwgXCJTcHJlYWRFbGVtZW50XCIpO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3Byb2QtQmluZGluZ1Jlc3RQcm9wZXJ0eVxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1CaW5kaW5nUmVzdEVsZW1lbnRcbiAgcGFyc2VSZXN0QmluZGluZygpOiBSZXN0RWxlbWVudCB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgdGhpcy5uZXh0KCk7IC8vIGVhdCBgLi4uYFxuICAgIG5vZGUuYXJndW1lbnQgPSB0aGlzLnBhcnNlQmluZGluZ0F0b20oKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiUmVzdEVsZW1lbnRcIik7XG4gIH1cblxuICAvLyBQYXJzZXMgbHZhbHVlIChhc3NpZ25hYmxlKSBhdG9tLlxuICBwYXJzZUJpbmRpbmdBdG9tKCk6IFBhdHRlcm4ge1xuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLUJpbmRpbmdQYXR0ZXJuXG4gICAgc3dpdGNoICh0aGlzLnN0YXRlLnR5cGUpIHtcbiAgICAgIGNhc2UgdHQuYnJhY2tldEw6IHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICBub2RlLmVsZW1lbnRzID0gdGhpcy5wYXJzZUJpbmRpbmdMaXN0KFxuICAgICAgICAgIHR0LmJyYWNrZXRSLFxuICAgICAgICAgIGNoYXJDb2Rlcy5yaWdodFNxdWFyZUJyYWNrZXQsXG4gICAgICAgICAgdHJ1ZSxcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoTm9kZShub2RlLCBcIkFycmF5UGF0dGVyblwiKTtcbiAgICAgIH1cblxuICAgICAgY2FzZSB0dC5icmFjZUw6XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlT2JqZWN0TGlrZSh0dC5icmFjZVIsIHRydWUpO1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLUJpbmRpbmdJZGVudGlmaWVyXG4gICAgcmV0dXJuIHRoaXMucGFyc2VJZGVudGlmaWVyKCk7XG4gIH1cblxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jcHJvZC1CaW5kaW5nRWxlbWVudExpc3RcbiAgcGFyc2VCaW5kaW5nTGlzdChcbiAgICBjbG9zZTogVG9rZW5UeXBlLFxuICAgIGNsb3NlQ2hhckNvZGU6ICRWYWx1ZXM8dHlwZW9mIGNoYXJDb2Rlcz4sXG4gICAgYWxsb3dFbXB0eT86IGJvb2xlYW4sXG4gICAgYWxsb3dNb2RpZmllcnM/OiBib29sZWFuLFxuICApOiAkUmVhZE9ubHlBcnJheTxQYXR0ZXJuIHwgVFNQYXJhbWV0ZXJQcm9wZXJ0eT4ge1xuICAgIGNvbnN0IGVsdHM6IEFycmF5PFBhdHRlcm4gfCBUU1BhcmFtZXRlclByb3BlcnR5PiA9IFtdO1xuICAgIGxldCBmaXJzdCA9IHRydWU7XG4gICAgd2hpbGUgKCF0aGlzLmVhdChjbG9zZSkpIHtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5leHBlY3QodHQuY29tbWEpO1xuICAgICAgfVxuICAgICAgaWYgKGFsbG93RW1wdHkgJiYgdGhpcy5tYXRjaCh0dC5jb21tYSkpIHtcbiAgICAgICAgLy8gJEZsb3dGaXhNZSBUaGlzIG1ldGhvZCByZXR1cm5zIGAkUmVhZE9ubHlBcnJheTw/UGF0dGVybj5gIGlmIGBhbGxvd0VtcHR5YCBpcyBzZXQuXG4gICAgICAgIGVsdHMucHVzaChudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5lYXQoY2xvc2UpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoKHR0LmVsbGlwc2lzKSkge1xuICAgICAgICBlbHRzLnB1c2godGhpcy5wYXJzZUFzc2lnbmFibGVMaXN0SXRlbVR5cGVzKHRoaXMucGFyc2VSZXN0QmluZGluZygpKSk7XG4gICAgICAgIHRoaXMuY2hlY2tDb21tYUFmdGVyUmVzdChjbG9zZUNoYXJDb2RlKTtcbiAgICAgICAgdGhpcy5leHBlY3QoY2xvc2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRlY29yYXRvcnMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2godHQuYXQpICYmIHRoaXMuaGFzUGx1Z2luKFwiZGVjb3JhdG9yc1wiKSkge1xuICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlVuc3VwcG9ydGVkUGFyYW1ldGVyRGVjb3JhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbnZhcmlhbnQ6IGhhc1BsdWdpbihcImRlY29yYXRvcnMtbGVnYWN5XCIpXG4gICAgICAgIHdoaWxlICh0aGlzLm1hdGNoKHR0LmF0KSkge1xuICAgICAgICAgIGRlY29yYXRvcnMucHVzaCh0aGlzLnBhcnNlRGVjb3JhdG9yKCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsdHMucHVzaCh0aGlzLnBhcnNlQXNzaWduYWJsZUxpc3RJdGVtKGFsbG93TW9kaWZpZXJzLCBkZWNvcmF0b3JzKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbHRzO1xuICB9XG5cbiAgcGFyc2VBc3NpZ25hYmxlTGlzdEl0ZW0oXG4gICAgYWxsb3dNb2RpZmllcnM6ID9ib29sZWFuLFxuICAgIGRlY29yYXRvcnM6IERlY29yYXRvcltdLFxuICApOiBQYXR0ZXJuIHwgVFNQYXJhbWV0ZXJQcm9wZXJ0eSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMucGFyc2VNYXliZURlZmF1bHQoKTtcbiAgICB0aGlzLnBhcnNlQXNzaWduYWJsZUxpc3RJdGVtVHlwZXMobGVmdCk7XG4gICAgY29uc3QgZWx0ID0gdGhpcy5wYXJzZU1heWJlRGVmYXVsdChsZWZ0LnN0YXJ0LCBsZWZ0LmxvYy5zdGFydCwgbGVmdCk7XG4gICAgaWYgKGRlY29yYXRvcnMubGVuZ3RoKSB7XG4gICAgICBsZWZ0LmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzO1xuICAgIH1cbiAgICByZXR1cm4gZWx0O1xuICB9XG5cbiAgLy8gVXNlZCBieSBmbG93L3R5cGVzY3JpcHQgcGx1Z2luIHRvIGFkZCB0eXBlIGFubm90YXRpb25zIHRvIGJpbmRpbmcgZWxlbWVudHNcbiAgcGFyc2VBc3NpZ25hYmxlTGlzdEl0ZW1UeXBlcyhwYXJhbTogUGF0dGVybik6IFBhdHRlcm4ge1xuICAgIHJldHVybiBwYXJhbTtcbiAgfVxuXG4gIC8vIFBhcnNlcyBhc3NpZ25tZW50IHBhdHRlcm4gYXJvdW5kIGdpdmVuIGF0b20gaWYgcG9zc2libGUuXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNwcm9kLUJpbmRpbmdFbGVtZW50XG4gIHBhcnNlTWF5YmVEZWZhdWx0KFxuICAgIHN0YXJ0UG9zPzogP251bWJlcixcbiAgICBzdGFydExvYz86ID9Qb3NpdGlvbixcbiAgICBsZWZ0PzogP1BhdHRlcm4sXG4gICk6IFBhdHRlcm4ge1xuICAgIHN0YXJ0TG9jID0gc3RhcnRMb2MgPz8gdGhpcy5zdGF0ZS5zdGFydExvYztcbiAgICBzdGFydFBvcyA9IHN0YXJ0UG9zID8/IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgLy8gJEZsb3dJZ25vcmVcbiAgICBsZWZ0ID0gbGVmdCA/PyB0aGlzLnBhcnNlQmluZGluZ0F0b20oKTtcbiAgICBpZiAoIXRoaXMuZWF0KHR0LmVxKSkgcmV0dXJuIGxlZnQ7XG5cbiAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGVBdChzdGFydFBvcywgc3RhcnRMb2MpO1xuICAgIG5vZGUubGVmdCA9IGxlZnQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMucGFyc2VNYXliZUFzc2lnbkFsbG93SW4oKTtcbiAgICByZXR1cm4gdGhpcy5maW5pc2hOb2RlKG5vZGUsIFwiQXNzaWdubWVudFBhdHRlcm5cIik7XG4gIH1cblxuICAvKipcbiAgICogVmVyaWZ5IHRoYXQgaWYgYSBub2RlIGlzIGFuIGx2YWwgLSBzb21ldGhpbmcgdGhhdCBjYW4gYmUgYXNzaWduZWQgdG8uXG4gICAqXG4gICAqIEBwYXJhbSB7RXhwcmVzc2lvbn0gZXhwciBUaGUgZ2l2ZW4gbm9kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGV4dERlc2NyaXB0aW9uIFRoZSBhdXhpbGlhcnkgY29udGV4dCBpbmZvcm1hdGlvbiBwcmludGVkIHdoZW4gZXJyb3IgaXMgdGhyb3duXG4gICAqIEBwYXJhbSB7QmluZGluZ1R5cGVzfSBbYmluZGluZ1R5cGU9QklORF9OT05FXSBUaGUgZGVzaXJlZCBiaW5kaW5nIHR5cGUuIElmIHRoZSBnaXZlbiBub2RlIGlzIGFuIGlkZW50aWZpZXIgYW5kIGBiaW5kaW5nVHlwZWAgaXMgbm90XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCSU5EX05PTkUsIGBjaGVja0xWYWxgIHdpbGwgcmVnaXN0ZXIgYmluZGluZyB0byB0aGUgcGFyc2VyIHNjb3BlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTZWUgYWxzbyBzcmMvdXRpbC9zY29wZWZsYWdzLmpzXG4gICAqIEBwYXJhbSB7P1NldDxzdHJpbmc+fSBjaGVja0NsYXNoZXMgQW4gb3B0aW9uYWwgc3RyaW5nIHNldCB0byBjaGVjayBpZiBhbiBpZGVudGlmaWVyIG5hbWUgaXMgaW5jbHVkZWQuIGBjaGVja0xWYWxgIHdpbGwgYWRkIGNoZWNrZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyIG5hbWUgdG8gYGNoZWNrQ2xhc2hlc2AgSXQgaXMgdXNlZCBpbiB0cmFja2luZyBkdXBsaWNhdGVzIGluIGZ1bmN0aW9uIHBhcmFtZXRlciBsaXN0cy4gSWZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdCBpcyBudWxsaXNoLCBgY2hlY2tMVmFsYCB3aWxsIHNraXAgZHVwbGljYXRlIGNoZWNrc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtkaXNhbGxvd0xldEJpbmRpbmddIFdoZXRoZXIgYW4gaWRlbnRpZmllciBuYW1lZCBcImxldFwiIHNob3VsZCBiZSBkaXNhbGxvd2VkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3N0cmljdE1vZGVDaGFuZ2VkPWZhbHNlXSBXaGV0aGVyIGFuIGlkZW50aWZpZXIgaGFzIGJlZW4gcGFyc2VkIGluIGEgc2xvcHB5IGNvbnRleHQgYnV0IHNob3VsZCBiZSByZWludGVycHJldGVkIGFzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpY3QtbW9kZS4gZS5nLiBgKGFyZ3VtZW50cykgPT4geyBcInVzZSBzdHJpY3QgXCJ9YFxuICAgKiBAbWVtYmVyb2YgTFZhbFBhcnNlclxuICAgKi9cbiAgY2hlY2tMVmFsKFxuICAgIGV4cHI6IEV4cHJlc3Npb24sXG4gICAgY29udGV4dERlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAgYmluZGluZ1R5cGU6IEJpbmRpbmdUeXBlcyA9IEJJTkRfTk9ORSxcbiAgICBjaGVja0NsYXNoZXM6ID9TZXQ8c3RyaW5nPixcbiAgICBkaXNhbGxvd0xldEJpbmRpbmc/OiBib29sZWFuLFxuICAgIHN0cmljdE1vZGVDaGFuZ2VkPzogYm9vbGVhbiA9IGZhbHNlLFxuICApOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGV4cHIudHlwZSkge1xuICAgICAgY2FzZSBcIklkZW50aWZpZXJcIjoge1xuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IGV4cHI7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLnN0YXRlLnN0cmljdCAmJlxuICAgICAgICAgIC8vIFwiR2xvYmFsXCIgcmVzZXJ2ZWQgd29yZHMgaGF2ZSBhbHJlYWR5IGJlZW4gY2hlY2tlZCBieSBwYXJzZUlkZW50aWZpZXIsXG4gICAgICAgICAgLy8gdW5sZXNzIHRoZXkgaGF2ZSBiZWVuIGZvdW5kIGluIHRoZSBpZCBvciBwYXJhbWV0ZXJzIG9mIGEgc3RyaWN0LW1vZGVcbiAgICAgICAgICAvLyBmdW5jdGlvbiBpbiBhIHNsb3BweSBjb250ZXh0LlxuICAgICAgICAgIChzdHJpY3RNb2RlQ2hhbmdlZFxuICAgICAgICAgICAgPyBpc1N0cmljdEJpbmRSZXNlcnZlZFdvcmQobmFtZSwgdGhpcy5pbk1vZHVsZSlcbiAgICAgICAgICAgIDogaXNTdHJpY3RCaW5kT25seVJlc2VydmVkV29yZChuYW1lKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZShcbiAgICAgICAgICAgIGV4cHIuc3RhcnQsXG4gICAgICAgICAgICBiaW5kaW5nVHlwZSA9PT0gQklORF9OT05FXG4gICAgICAgICAgICAgID8gRXJyb3JzLlN0cmljdEV2YWxBcmd1bWVudHNcbiAgICAgICAgICAgICAgOiBFcnJvcnMuU3RyaWN0RXZhbEFyZ3VtZW50c0JpbmRpbmcsXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hlY2tDbGFzaGVzKSB7XG4gICAgICAgICAgaWYgKGNoZWNrQ2xhc2hlcy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMucmFpc2UoZXhwci5zdGFydCwgRXJyb3JzLlBhcmFtRHVwZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrQ2xhc2hlcy5hZGQobmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkaXNhbGxvd0xldEJpbmRpbmcgJiYgbmFtZSA9PT0gXCJsZXRcIikge1xuICAgICAgICAgIHRoaXMucmFpc2UoZXhwci5zdGFydCwgRXJyb3JzLkxldEluTGV4aWNhbEJpbmRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKGJpbmRpbmdUeXBlICYgQklORF9OT05FKSkge1xuICAgICAgICAgIHRoaXMuc2NvcGUuZGVjbGFyZU5hbWUobmFtZSwgYmluZGluZ1R5cGUsIGV4cHIuc3RhcnQpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjYXNlIFwiTWVtYmVyRXhwcmVzc2lvblwiOlxuICAgICAgICBpZiAoYmluZGluZ1R5cGUgIT09IEJJTkRfTk9ORSkge1xuICAgICAgICAgIHRoaXMucmFpc2UoZXhwci5zdGFydCwgRXJyb3JzLkludmFsaWRQcm9wZXJ0eUJpbmRpbmdQYXR0ZXJuKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIk9iamVjdFBhdHRlcm5cIjpcbiAgICAgICAgZm9yIChsZXQgcHJvcCBvZiBleHByLnByb3BlcnRpZXMpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc09iamVjdFByb3BlcnR5KHByb3ApKSBwcm9wID0gcHJvcC52YWx1ZTtcbiAgICAgICAgICAvLyBJZiB3ZSBmaW5kIGhlcmUgYW4gT2JqZWN0TWV0aG9kLCBpdCdzIGJlY2F1c2UgdGhpcyB3YXMgb3JpZ2luYWxseVxuICAgICAgICAgIC8vIGFuIE9iamVjdEV4cHJlc3Npb24gd2hpY2ggaGFzIHRoZW4gYmVlbiBjb252ZXJ0ZWQuXG4gICAgICAgICAgLy8gdG9Bc3NpZ25hYmxlIGFscmVhZHkgcmVwb3J0ZWQgdGhpcyBlcnJvciB3aXRoIGEgbmljZXIgbWVzc2FnZS5cbiAgICAgICAgICBlbHNlIGlmICh0aGlzLmlzT2JqZWN0TWV0aG9kKHByb3ApKSBjb250aW51ZTtcblxuICAgICAgICAgIHRoaXMuY2hlY2tMVmFsKFxuICAgICAgICAgICAgcHJvcCxcbiAgICAgICAgICAgIFwib2JqZWN0IGRlc3RydWN0dXJpbmcgcGF0dGVyblwiLFxuICAgICAgICAgICAgYmluZGluZ1R5cGUsXG4gICAgICAgICAgICBjaGVja0NsYXNoZXMsXG4gICAgICAgICAgICBkaXNhbGxvd0xldEJpbmRpbmcsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcIkFycmF5UGF0dGVyblwiOlxuICAgICAgICBmb3IgKGNvbnN0IGVsZW0gb2YgZXhwci5lbGVtZW50cykge1xuICAgICAgICAgIGlmIChlbGVtKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrTFZhbChcbiAgICAgICAgICAgICAgZWxlbSxcbiAgICAgICAgICAgICAgXCJhcnJheSBkZXN0cnVjdHVyaW5nIHBhdHRlcm5cIixcbiAgICAgICAgICAgICAgYmluZGluZ1R5cGUsXG4gICAgICAgICAgICAgIGNoZWNrQ2xhc2hlcyxcbiAgICAgICAgICAgICAgZGlzYWxsb3dMZXRCaW5kaW5nLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJBc3NpZ25tZW50UGF0dGVyblwiOlxuICAgICAgICB0aGlzLmNoZWNrTFZhbChcbiAgICAgICAgICBleHByLmxlZnQsXG4gICAgICAgICAgXCJhc3NpZ25tZW50IHBhdHRlcm5cIixcbiAgICAgICAgICBiaW5kaW5nVHlwZSxcbiAgICAgICAgICBjaGVja0NsYXNoZXMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiUmVzdEVsZW1lbnRcIjpcbiAgICAgICAgdGhpcy5jaGVja0xWYWwoXG4gICAgICAgICAgZXhwci5hcmd1bWVudCxcbiAgICAgICAgICBcInJlc3QgZWxlbWVudFwiLFxuICAgICAgICAgIGJpbmRpbmdUeXBlLFxuICAgICAgICAgIGNoZWNrQ2xhc2hlcyxcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJQYXJlbnRoZXNpemVkRXhwcmVzc2lvblwiOlxuICAgICAgICB0aGlzLmNoZWNrTFZhbChcbiAgICAgICAgICBleHByLmV4cHJlc3Npb24sXG4gICAgICAgICAgXCJwYXJlbnRoZXNpemVkIGV4cHJlc3Npb25cIixcbiAgICAgICAgICBiaW5kaW5nVHlwZSxcbiAgICAgICAgICBjaGVja0NsYXNoZXMsXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHRoaXMucmFpc2UoXG4gICAgICAgICAgZXhwci5zdGFydCxcbiAgICAgICAgICBiaW5kaW5nVHlwZSA9PT0gQklORF9OT05FXG4gICAgICAgICAgICA/IEVycm9ycy5JbnZhbGlkTGhzXG4gICAgICAgICAgICA6IEVycm9ycy5JbnZhbGlkTGhzQmluZGluZyxcbiAgICAgICAgICBjb250ZXh0RGVzY3JpcHRpb24sXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2hlY2tUb1Jlc3RDb252ZXJzaW9uKG5vZGU6IFNwcmVhZEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBub2RlLmFyZ3VtZW50LnR5cGUgIT09IFwiSWRlbnRpZmllclwiICYmXG4gICAgICBub2RlLmFyZ3VtZW50LnR5cGUgIT09IFwiTWVtYmVyRXhwcmVzc2lvblwiXG4gICAgKSB7XG4gICAgICB0aGlzLnJhaXNlKG5vZGUuYXJndW1lbnQuc3RhcnQsIEVycm9ycy5JbnZhbGlkUmVzdEFzc2lnbm1lbnRQYXR0ZXJuKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0NvbW1hQWZ0ZXJSZXN0KGNsb3NlOiAkVmFsdWVzPHR5cGVvZiBjaGFyQ29kZXM+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWF0Y2godHQuY29tbWEpKSB7XG4gICAgICBpZiAodGhpcy5sb29rYWhlYWRDaGFyQ29kZSgpID09PSBjbG9zZSkge1xuICAgICAgICB0aGlzLnJhaXNlVHJhaWxpbmdDb21tYUFmdGVyUmVzdCh0aGlzLnN0YXRlLnN0YXJ0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmFpc2VSZXN0Tm90TGFzdCh0aGlzLnN0YXRlLnN0YXJ0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByYWlzZVJlc3ROb3RMYXN0KHBvczogbnVtYmVyKSB7XG4gICAgdGhyb3cgdGhpcy5yYWlzZShwb3MsIEVycm9ycy5FbGVtZW50QWZ0ZXJSZXN0KTtcbiAgfVxuXG4gIHJhaXNlVHJhaWxpbmdDb21tYUFmdGVyUmVzdChwb3M6IG51bWJlcikge1xuICAgIHRoaXMucmFpc2UocG9zLCBFcnJvcnMuUmVzdFRyYWlsaW5nQ29tbWEpO1xuICB9XG59XG4iXX0=