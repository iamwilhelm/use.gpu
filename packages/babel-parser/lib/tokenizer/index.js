"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Token = void 0;

var N = _interopRequireWildcard(require("../types"));

var charCodes = _interopRequireWildcard(require("charcodes"));

var _identifier = require("../util/identifier");

var _types2 = require("./types");

var _context = require("./context");

var _error = _interopRequireWildcard(require("../parser/error"));

var _location = require("../util/location");

var _whitespace = require("../util/whitespace");

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var VALID_REGEX_FLAGS = new Set([charCodes.lowercaseG, charCodes.lowercaseM, charCodes.lowercaseS, charCodes.lowercaseI, charCodes.lowercaseY, charCodes.lowercaseU, charCodes.lowercaseD]); // The following character codes are forbidden from being
// an immediate sibling of NumericLiteralSeparator _

var forbiddenNumericSeparatorSiblings = {
  decBinOct: [charCodes.dot, charCodes.uppercaseB, charCodes.uppercaseE, charCodes.uppercaseO, charCodes.underscore, // multiple separators are not allowed
  charCodes.lowercaseB, charCodes.lowercaseE, charCodes.lowercaseO],
  hex: [charCodes.dot, charCodes.uppercaseX, charCodes.underscore, // multiple separators are not allowed
  charCodes.lowercaseX]
};
var allowedNumericSeparatorSiblings = {};
allowedNumericSeparatorSiblings.bin = [// 0 - 1
charCodes.digit0, charCodes.digit1];
allowedNumericSeparatorSiblings.oct = [].concat(_toConsumableArray(allowedNumericSeparatorSiblings.bin), [charCodes.digit2, charCodes.digit3, charCodes.digit4, charCodes.digit5, charCodes.digit6, charCodes.digit7]);
allowedNumericSeparatorSiblings.dec = [].concat(_toConsumableArray(allowedNumericSeparatorSiblings.oct), [charCodes.digit8, charCodes.digit9]);
allowedNumericSeparatorSiblings.hex = [].concat(_toConsumableArray(allowedNumericSeparatorSiblings.dec), [charCodes.uppercaseA, charCodes.uppercaseB, charCodes.uppercaseC, charCodes.uppercaseD, charCodes.uppercaseE, charCodes.uppercaseF, charCodes.lowercaseA, charCodes.lowercaseB, charCodes.lowercaseC, charCodes.lowercaseD, charCodes.lowercaseE, charCodes.lowercaseF]); // Object type used to represent tokens. Note that normally, tokens
// simply exist as properties on the parser object. This is only
// used for the onToken callback and the external tokenizer.

var Token = function Token(state) {
  _classCallCheck(this, Token);

  this.type = state.type;
  this.value = state.value;
  this.start = state.start;
  this.end = state.end;
  this.loc = new _location.SourceLocation(state.startLoc, state.endLoc);
}; // ## Tokenizer


exports.Token = Token;

var Tokenizer = /*#__PURE__*/function (_ParserErrors) {
  _inherits(Tokenizer, _ParserErrors);

  var _super = _createSuper(Tokenizer);

  // Forward-declarations
  // parser/util.js

  /*::
  +hasPrecedingLineBreak: () => boolean;
  +unexpected: (pos?: ?number, messageOrType?: ErrorTemplate | TokenType) => empty;
  +expectPlugin: (name: string, pos?: ?number) => true;
  */
  // Token store.
  function Tokenizer(options, input) {
    var _this;

    _classCallCheck(this, Tokenizer);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "isLookahead", void 0);

    _defineProperty(_assertThisInitialized(_this), "tokens", []);

    _this.state = new _state["default"]();

    _this.state.init(options);

    _this.input = input;
    _this.length = input.length;
    _this.isLookahead = false;
    return _this;
  }

  _createClass(Tokenizer, [{
    key: "pushToken",
    value: function pushToken(token) {
      // Pop out invalid tokens trapped by try-catch parsing.
      // Those parsing branches are mainly created by typescript and flow plugins.
      this.tokens.length = this.state.tokensLength;
      this.tokens.push(token);
      ++this.state.tokensLength;
    } // Move to the next token

  }, {
    key: "next",
    value: function next() {
      this.checkKeywordEscapes();

      if (this.options.tokens) {
        this.pushToken(new Token(this.state));
      }

      this.state.lastTokEnd = this.state.end;
      this.state.lastTokStart = this.state.start;
      this.state.lastTokEndLoc = this.state.endLoc;
      this.state.lastTokStartLoc = this.state.startLoc;
      this.nextToken();
    } // TODO

  }, {
    key: "eat",
    value: function eat(type) {
      if (this.match(type)) {
        this.next();
        return true;
      } else {
        return false;
      }
    } // TODO

  }, {
    key: "match",
    value: function match(type) {
      return this.state.type === type;
    }
    /**
     * Create a LookaheadState from current parser state
     *
     * @param {State} state
     * @returns {LookaheadState}
     * @memberof Tokenizer
     */

  }, {
    key: "createLookaheadState",
    value: function createLookaheadState(state) {
      return {
        pos: state.pos,
        value: null,
        type: state.type,
        start: state.start,
        end: state.end,
        lastTokEnd: state.end,
        context: [this.curContext()],
        inType: state.inType
      };
    }
    /**
     * lookahead peeks the next token, skipping changes to token context and
     * comment stack. For performance it returns a limited LookaheadState
     * instead of full parser state.
     *
     * The { column, line } Loc info is not included in lookahead since such usage
     * is rare. Although it may return other location properties e.g. `curLine` and
     * `lineStart`, these properties are not listed in the LookaheadState interface
     * and thus the returned value is _NOT_ reliable.
     *
     * The tokenizer should make best efforts to avoid using any parser state
     * other than those defined in LookaheadState
     *
     * @returns {LookaheadState}
     * @memberof Tokenizer
     */

  }, {
    key: "lookahead",
    value: function lookahead() {
      var old = this.state; // For performance we use a simpified tokenizer state structure
      // $FlowIgnore

      this.state = this.createLookaheadState(old);
      this.isLookahead = true;
      this.nextToken();
      this.isLookahead = false;
      var curr = this.state;
      this.state = old;
      return curr;
    }
  }, {
    key: "nextTokenStart",
    value: function nextTokenStart() {
      return this.nextTokenStartSince(this.state.pos);
    }
  }, {
    key: "nextTokenStartSince",
    value: function nextTokenStartSince(pos) {
      _whitespace.skipWhiteSpace.lastIndex = pos;

      var skip = _whitespace.skipWhiteSpace.exec(this.input); // $FlowIgnore: The skipWhiteSpace ensures to match any string


      return pos + skip[0].length;
    }
  }, {
    key: "lookaheadCharCode",
    value: function lookaheadCharCode() {
      return this.input.charCodeAt(this.nextTokenStart());
    }
  }, {
    key: "codePointAtPos",
    value: function codePointAtPos(pos) {
      // The implementation is based on
      // https://source.chromium.org/chromium/chromium/src/+/master:v8/src/builtins/builtins-string-gen.cc;l=1455;drc=221e331b49dfefadbc6fa40b0c68e6f97606d0b3;bpv=0;bpt=1
      // We reimplement `codePointAt` because `codePointAt` is a V8 builtin which is not inlined by TurboFan (as of M91)
      // since `input` is mostly ASCII, an inlined `charCodeAt` wins here
      var cp = this.input.charCodeAt(pos);

      if ((cp & 0xfc00) === 0xd800 && ++pos < this.input.length) {
        var trail = this.input.charCodeAt(pos);

        if ((trail & 0xfc00) === 0xdc00) {
          cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
        }
      }

      return cp;
    } // Toggle strict mode. Re-reads the next number or string to please
    // pedantic tests (`"use strict"; 010;` should fail).

  }, {
    key: "setStrict",
    value: function setStrict(strict) {
      var _this2 = this;

      this.state.strict = strict;

      if (strict) {
        // Throw an error for any string decimal escape found before/immediately
        // after a "use strict" directive. Strict mode will be set at parse
        // time for any literals that occur after the next node of the strict
        // directive.
        this.state.strictErrors.forEach(function (message, pos) {
          return (
            /* eslint-disable @babel/development-internal/dry-error-messages */
            _this2.raise(pos, message)
          );
        });
        this.state.strictErrors.clear();
      }
    }
  }, {
    key: "curContext",
    value: function curContext() {
      return this.state.context[this.state.context.length - 1];
    } // Read a single token, updating the parser object's token-related
    // properties.

  }, {
    key: "nextToken",
    value: function nextToken() {
      var curContext = this.curContext();
      if (!curContext.preserveSpace) this.skipSpace();
      this.state.start = this.state.pos;
      if (!this.isLookahead) this.state.startLoc = this.state.curPosition();

      if (this.state.pos >= this.length) {
        this.finishToken(_types2.types.eof);
        return;
      }

      if (curContext === _context.types.template) {
        this.readTmplToken();
      } else {
        this.getTokenFromCode(this.codePointAtPos(this.state.pos));
      }
    }
  }, {
    key: "pushComment",
    value: function pushComment(block, text, start, end, startLoc, endLoc) {
      var comment = {
        type: block ? "CommentBlock" : "CommentLine",
        value: text,
        start: start,
        end: end,
        loc: new _location.SourceLocation(startLoc, endLoc)
      };
      if (this.options.tokens) this.pushToken(comment);
      this.state.comments.push(comment);
      this.addComment(comment);
    }
  }, {
    key: "skipBlockComment",
    value: function skipBlockComment() {
      var startLoc;
      if (!this.isLookahead) startLoc = this.state.curPosition();
      var start = this.state.pos;
      var end = this.input.indexOf("*/", this.state.pos + 2);
      if (end === -1) throw this.raise(start, _error.Errors.UnterminatedComment);
      this.state.pos = end + 2;
      _whitespace.lineBreakG.lastIndex = start;
      var match;

      while ((match = _whitespace.lineBreakG.exec(this.input)) && match.index < this.state.pos) {
        ++this.state.curLine;
        this.state.lineStart = match.index + match[0].length;
      } // If we are doing a lookahead right now we need to advance the position (above code)
      // but we do not want to push the comment to the state.


      if (this.isLookahead) return;
      /*:: invariant(startLoc) */

      this.pushComment(true, this.input.slice(start + 2, end), start, this.state.pos, startLoc, this.state.curPosition());
    }
  }, {
    key: "skipLineComment",
    value: function skipLineComment(startSkip) {
      var start = this.state.pos;
      var startLoc;
      if (!this.isLookahead) startLoc = this.state.curPosition();
      var ch = this.input.charCodeAt(this.state.pos += startSkip);

      if (this.state.pos < this.length) {
        while (!(0, _whitespace.isNewLine)(ch) && ++this.state.pos < this.length) {
          ch = this.input.charCodeAt(this.state.pos);
        }
      } // If we are doing a lookahead right now we need to advance the position (above code)
      // but we do not want to push the comment to the state.


      if (this.isLookahead) return;
      /*:: invariant(startLoc) */

      this.pushComment(false, this.input.slice(start + startSkip, this.state.pos), start, this.state.pos, startLoc, this.state.curPosition());
    } // Called at the start of the parse and after every token. Skips
    // whitespace and comments, and.

  }, {
    key: "skipSpace",
    value: function skipSpace() {
      loop: while (this.state.pos < this.length) {
        var ch = this.input.charCodeAt(this.state.pos);

        switch (ch) {
          case charCodes.space:
          case charCodes.nonBreakingSpace:
          case charCodes.tab:
            ++this.state.pos;
            break;

          case charCodes.carriageReturn:
            if (this.input.charCodeAt(this.state.pos + 1) === charCodes.lineFeed) {
              ++this.state.pos;
            }

          // fall through

          case charCodes.lineFeed:
          case charCodes.lineSeparator:
          case charCodes.paragraphSeparator:
            ++this.state.pos;
            ++this.state.curLine;
            this.state.lineStart = this.state.pos;
            break;

          case charCodes.slash:
            switch (this.input.charCodeAt(this.state.pos + 1)) {
              case charCodes.asterisk:
                this.skipBlockComment();
                break;

              case charCodes.slash:
                this.skipLineComment(2);
                break;

              default:
                break loop;
            }

            break;

          default:
            if ((0, _whitespace.isWhitespace)(ch)) {
              ++this.state.pos;
            } else {
              break loop;
            }

        }
      }
    } // Called at the end of every token. Sets `end`, `val`, and
    // maintains `context` and `exprAllowed`, and skips the space after
    // the token, so that the next one's `start` will point at the
    // right position.

  }, {
    key: "finishToken",
    value: function finishToken(type, val) {
      this.state.end = this.state.pos;
      var prevType = this.state.type;
      this.state.type = type;
      this.state.value = val;

      if (!this.isLookahead) {
        this.state.endLoc = this.state.curPosition();
        this.updateContext(prevType);
      }
    } // ### Token reading
    // This is the function that is called to fetch the next token. It
    // is somewhat obscure, because it works in character codes rather
    // than characters, and because operator parsing has been inlined
    // into it.
    //
    // All in the name of speed.
    // number sign is "#"

  }, {
    key: "readToken_numberSign",
    value: function readToken_numberSign() {
      if (this.state.pos === 0 && this.readToken_interpreter()) {
        return;
      }

      var nextPos = this.state.pos + 1;
      var next = this.codePointAtPos(nextPos);

      if (next >= charCodes.digit0 && next <= charCodes.digit9) {
        throw this.raise(this.state.pos, _error.Errors.UnexpectedDigitAfterHash);
      }

      if (next === charCodes.leftCurlyBrace || next === charCodes.leftSquareBracket && this.hasPlugin("recordAndTuple")) {
        // When we see `#{`, it is likely to be a hash record.
        // However we don't yell at `#[` since users may intend to use "computed private fields",
        // which is not allowed in the spec. Throwing expecting recordAndTuple is
        // misleading
        this.expectPlugin("recordAndTuple");

        if (this.getPluginOption("recordAndTuple", "syntaxType") !== "hash") {
          throw this.raise(this.state.pos, next === charCodes.leftCurlyBrace ? _error.Errors.RecordExpressionHashIncorrectStartSyntaxType : _error.Errors.TupleExpressionHashIncorrectStartSyntaxType);
        }

        this.state.pos += 2;

        if (next === charCodes.leftCurlyBrace) {
          // #{
          this.finishToken(_types2.types.braceHashL);
        } else {
          // #[
          this.finishToken(_types2.types.bracketHashL);
        }
      } else if ((0, _identifier.isIdentifierStart)(next)) {
        ++this.state.pos;
        this.finishToken(_types2.types.privateName, this.readWord1(next));
      } else if (next === charCodes.backslash) {
        ++this.state.pos;
        this.finishToken(_types2.types.privateName, this.readWord1());
      } else {
        this.finishOp(_types2.types.hash, 1);
      }
    }
  }, {
    key: "readToken_dot",
    value: function readToken_dot() {
      var next = this.input.charCodeAt(this.state.pos + 1);

      if (next >= charCodes.digit0 && next <= charCodes.digit9) {
        this.readNumber(true);
        return;
      }

      if (next === charCodes.dot && this.input.charCodeAt(this.state.pos + 2) === charCodes.dot) {
        this.state.pos += 3;
        this.finishToken(_types2.types.ellipsis);
      } else {
        ++this.state.pos;
        this.finishToken(_types2.types.dot);
      }
    }
  }, {
    key: "readToken_slash",
    value: function readToken_slash() {
      var next = this.input.charCodeAt(this.state.pos + 1);

      if (next === charCodes.equalsTo) {
        this.finishOp(_types2.types.slashAssign, 2);
      } else {
        this.finishOp(_types2.types.slash, 1);
      }
    }
  }, {
    key: "readToken_interpreter",
    value: function readToken_interpreter() {
      if (this.state.pos !== 0 || this.length < 2) return false;
      var ch = this.input.charCodeAt(this.state.pos + 1);
      if (ch !== charCodes.exclamationMark) return false;
      var start = this.state.pos;
      this.state.pos += 1;

      while (!(0, _whitespace.isNewLine)(ch) && ++this.state.pos < this.length) {
        ch = this.input.charCodeAt(this.state.pos);
      }

      var value = this.input.slice(start + 2, this.state.pos);
      this.finishToken(_types2.types.interpreterDirective, value);
      return true;
    }
  }, {
    key: "readToken_mult_modulo",
    value: function readToken_mult_modulo(code) {
      // '%*'
      var type = code === charCodes.asterisk ? _types2.types.star : _types2.types.modulo;
      var width = 1;
      var next = this.input.charCodeAt(this.state.pos + 1); // Exponentiation operator **

      if (code === charCodes.asterisk && next === charCodes.asterisk) {
        width++;
        next = this.input.charCodeAt(this.state.pos + 2);
        type = _types2.types.exponent;
      }

      if (next === charCodes.equalsTo && !this.state.inType) {
        width++;
        type = _types2.types.assign;
      }

      this.finishOp(type, width);
    }
  }, {
    key: "readToken_pipe_amp",
    value: function readToken_pipe_amp(code) {
      // '||' '&&' '||=' '&&='
      var next = this.input.charCodeAt(this.state.pos + 1);

      if (next === code) {
        if (this.input.charCodeAt(this.state.pos + 2) === charCodes.equalsTo) {
          this.finishOp(_types2.types.assign, 3);
        } else {
          this.finishOp(code === charCodes.verticalBar ? _types2.types.logicalOR : _types2.types.logicalAND, 2);
        }

        return;
      }

      if (code === charCodes.verticalBar) {
        // '|>'
        if (next === charCodes.greaterThan) {
          this.finishOp(_types2.types.pipeline, 2);
          return;
        } // '|}'


        if (this.hasPlugin("recordAndTuple") && next === charCodes.rightCurlyBrace) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
            throw this.raise(this.state.pos, _error.Errors.RecordExpressionBarIncorrectEndSyntaxType);
          }

          this.state.pos += 2;
          this.finishToken(_types2.types.braceBarR);
          return;
        } // '|]'


        if (this.hasPlugin("recordAndTuple") && next === charCodes.rightSquareBracket) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
            throw this.raise(this.state.pos, _error.Errors.TupleExpressionBarIncorrectEndSyntaxType);
          }

          this.state.pos += 2;
          this.finishToken(_types2.types.bracketBarR);
          return;
        }
      }

      if (next === charCodes.equalsTo) {
        this.finishOp(_types2.types.assign, 2);
        return;
      }

      this.finishOp(code === charCodes.verticalBar ? _types2.types.bitwiseOR : _types2.types.bitwiseAND, 1);
    }
  }, {
    key: "readToken_caret",
    value: function readToken_caret() {
      // '^'
      var next = this.input.charCodeAt(this.state.pos + 1);

      if (next === charCodes.equalsTo) {
        this.finishOp(_types2.types.assign, 2);
      } else {
        this.finishOp(_types2.types.bitwiseXOR, 1);
      }
    }
  }, {
    key: "readToken_plus_min",
    value: function readToken_plus_min(code) {
      // '+-'
      var next = this.input.charCodeAt(this.state.pos + 1);

      if (next === code) {
        if (next === charCodes.dash && !this.inModule && this.input.charCodeAt(this.state.pos + 2) === charCodes.greaterThan && (this.state.lastTokEnd === 0 || this.hasPrecedingLineBreak())) {
          // A `-->` line comment
          this.skipLineComment(3);
          this.skipSpace();
          this.nextToken();
          return;
        }

        this.finishOp(_types2.types.incDec, 2);
        return;
      }

      if (next === charCodes.equalsTo) {
        this.finishOp(_types2.types.assign, 2);
      } else {
        this.finishOp(_types2.types.plusMin, 1);
      }
    }
  }, {
    key: "readToken_lt_gt",
    value: function readToken_lt_gt(code) {
      // '<>'
      var next = this.input.charCodeAt(this.state.pos + 1);
      var size = 1;

      if (next === code) {
        size = code === charCodes.greaterThan && this.input.charCodeAt(this.state.pos + 2) === charCodes.greaterThan ? 3 : 2;

        if (this.input.charCodeAt(this.state.pos + size) === charCodes.equalsTo) {
          this.finishOp(_types2.types.assign, size + 1);
          return;
        }

        this.finishOp(_types2.types.bitShift, size);
        return;
      }

      if (next === charCodes.exclamationMark && code === charCodes.lessThan && !this.inModule && this.input.charCodeAt(this.state.pos + 2) === charCodes.dash && this.input.charCodeAt(this.state.pos + 3) === charCodes.dash) {
        // `<!--`, an XML-style comment that should be interpreted as a line comment
        this.skipLineComment(4);
        this.skipSpace();
        this.nextToken();
        return;
      }

      if (next === charCodes.equalsTo) {
        // <= | >=
        size = 2;
      }

      this.finishOp(_types2.types.relational, size);
    }
  }, {
    key: "readToken_eq_excl",
    value: function readToken_eq_excl(code) {
      // '=!'
      var next = this.input.charCodeAt(this.state.pos + 1);

      if (next === charCodes.equalsTo) {
        this.finishOp(_types2.types.equality, this.input.charCodeAt(this.state.pos + 2) === charCodes.equalsTo ? 3 : 2);
        return;
      }

      if (code === charCodes.equalsTo && next === charCodes.greaterThan) {
        // '=>'
        this.state.pos += 2;
        this.finishToken(_types2.types.arrow);
        return;
      }

      this.finishOp(code === charCodes.equalsTo ? _types2.types.eq : _types2.types.bang, 1);
    }
  }, {
    key: "readToken_question",
    value: function readToken_question() {
      // '?'
      var next = this.input.charCodeAt(this.state.pos + 1);
      var next2 = this.input.charCodeAt(this.state.pos + 2);

      if (next === charCodes.questionMark) {
        if (next2 === charCodes.equalsTo) {
          // '??='
          this.finishOp(_types2.types.assign, 3);
        } else {
          // '??'
          this.finishOp(_types2.types.nullishCoalescing, 2);
        }
      } else if (next === charCodes.dot && !(next2 >= charCodes.digit0 && next2 <= charCodes.digit9)) {
        // '.' not followed by a number
        this.state.pos += 2;
        this.finishToken(_types2.types.questionDot);
      } else {
        ++this.state.pos;
        this.finishToken(_types2.types.question);
      }
    }
  }, {
    key: "getTokenFromCode",
    value: function getTokenFromCode(code) {
      switch (code) {
        // The interpretation of a dot depends on whether it is followed
        // by a digit or another two dots.
        case charCodes.dot:
          this.readToken_dot();
          return;
        // Punctuation tokens.

        case charCodes.leftParenthesis:
          ++this.state.pos;
          this.finishToken(_types2.types.parenL);
          return;

        case charCodes.rightParenthesis:
          ++this.state.pos;
          this.finishToken(_types2.types.parenR);
          return;

        case charCodes.semicolon:
          ++this.state.pos;
          this.finishToken(_types2.types.semi);
          return;

        case charCodes.comma:
          ++this.state.pos;
          this.finishToken(_types2.types.comma);
          return;

        case charCodes.leftSquareBracket:
          if (this.hasPlugin("recordAndTuple") && this.input.charCodeAt(this.state.pos + 1) === charCodes.verticalBar) {
            if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
              throw this.raise(this.state.pos, _error.Errors.TupleExpressionBarIncorrectStartSyntaxType);
            } // [|


            this.state.pos += 2;
            this.finishToken(_types2.types.bracketBarL);
          } else {
            ++this.state.pos;
            this.finishToken(_types2.types.bracketL);
          }

          return;

        case charCodes.rightSquareBracket:
          ++this.state.pos;
          this.finishToken(_types2.types.bracketR);
          return;

        case charCodes.leftCurlyBrace:
          if (this.hasPlugin("recordAndTuple") && this.input.charCodeAt(this.state.pos + 1) === charCodes.verticalBar) {
            if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
              throw this.raise(this.state.pos, _error.Errors.RecordExpressionBarIncorrectStartSyntaxType);
            } // {|


            this.state.pos += 2;
            this.finishToken(_types2.types.braceBarL);
          } else {
            ++this.state.pos;
            this.finishToken(_types2.types.braceL);
          }

          return;

        case charCodes.rightCurlyBrace:
          ++this.state.pos;
          this.finishToken(_types2.types.braceR);
          return;

        case charCodes.colon:
          if (this.hasPlugin("functionBind") && this.input.charCodeAt(this.state.pos + 1) === charCodes.colon) {
            this.finishOp(_types2.types.doubleColon, 2);
          } else {
            ++this.state.pos;
            this.finishToken(_types2.types.colon);
          }

          return;

        case charCodes.questionMark:
          this.readToken_question();
          return;

        case charCodes.graveAccent:
          ++this.state.pos;
          this.finishToken(_types2.types.backQuote);
          return;

        case charCodes.digit0:
          {
            var next = this.input.charCodeAt(this.state.pos + 1); // '0x', '0X' - hex number

            if (next === charCodes.lowercaseX || next === charCodes.uppercaseX) {
              this.readRadixNumber(16);
              return;
            } // '0o', '0O' - octal number


            if (next === charCodes.lowercaseO || next === charCodes.uppercaseO) {
              this.readRadixNumber(8);
              return;
            } // '0b', '0B' - binary number


            if (next === charCodes.lowercaseB || next === charCodes.uppercaseB) {
              this.readRadixNumber(2);
              return;
            }
          }
        // Anything else beginning with a digit is an integer, octal
        // number, or float. (fall through)

        case charCodes.digit1:
        case charCodes.digit2:
        case charCodes.digit3:
        case charCodes.digit4:
        case charCodes.digit5:
        case charCodes.digit6:
        case charCodes.digit7:
        case charCodes.digit8:
        case charCodes.digit9:
          this.readNumber(false);
          return;
        // Quotes produce strings.

        case charCodes.quotationMark:
        case charCodes.apostrophe:
          this.readString(code);
          return;
        // Operators are parsed inline in tiny state machines. '=' (charCodes.equalsTo) is
        // often referred to. `finishOp` simply skips the amount of
        // characters it is given as second argument, and returns a token
        // of the type given by its first argument.

        case charCodes.slash:
          this.readToken_slash();
          return;

        case charCodes.percentSign:
        case charCodes.asterisk:
          this.readToken_mult_modulo(code);
          return;

        case charCodes.verticalBar:
        case charCodes.ampersand:
          this.readToken_pipe_amp(code);
          return;

        case charCodes.caret:
          this.readToken_caret();
          return;

        case charCodes.plusSign:
        case charCodes.dash:
          this.readToken_plus_min(code);
          return;

        case charCodes.lessThan:
        case charCodes.greaterThan:
          this.readToken_lt_gt(code);
          return;

        case charCodes.equalsTo:
        case charCodes.exclamationMark:
          this.readToken_eq_excl(code);
          return;

        case charCodes.tilde:
          this.finishOp(_types2.types.tilde, 1);
          return;

        case charCodes.atSign:
          ++this.state.pos;
          this.finishToken(_types2.types.at);
          return;

        case charCodes.numberSign:
          this.readToken_numberSign();
          return;

        case charCodes.backslash:
          this.readWord();
          return;

        default:
          if ((0, _identifier.isIdentifierStart)(code)) {
            this.readWord(code);
            return;
          }

      }

      throw this.raise(this.state.pos, _error.Errors.InvalidOrUnexpectedToken, String.fromCodePoint(code));
    }
  }, {
    key: "finishOp",
    value: function finishOp(type, size) {
      var str = this.input.slice(this.state.pos, this.state.pos + size);
      this.state.pos += size;
      this.finishToken(type, str);
    }
  }, {
    key: "readRegexp",
    value: function readRegexp() {
      var start = this.state.start + 1;
      var escaped, inClass;
      var pos = this.state.pos;

      for (;; ++pos) {
        if (pos >= this.length) {
          throw this.raise(start, _error.Errors.UnterminatedRegExp);
        }

        var ch = this.input.charCodeAt(pos);

        if ((0, _whitespace.isNewLine)(ch)) {
          throw this.raise(start, _error.Errors.UnterminatedRegExp);
        }

        if (escaped) {
          escaped = false;
        } else {
          if (ch === charCodes.leftSquareBracket) {
            inClass = true;
          } else if (ch === charCodes.rightSquareBracket && inClass) {
            inClass = false;
          } else if (ch === charCodes.slash && !inClass) {
            break;
          }

          escaped = ch === charCodes.backslash;
        }
      }

      var content = this.input.slice(start, pos);
      ++pos;
      var mods = "";

      while (pos < this.length) {
        var cp = this.codePointAtPos(pos); // It doesn't matter if cp > 0xffff, the loop will either throw or break because we check on cp

        var _char = String.fromCharCode(cp);

        if (VALID_REGEX_FLAGS.has(cp)) {
          if (mods.includes(_char)) {
            this.raise(pos + 1, _error.Errors.DuplicateRegExpFlags);
          }
        } else if ((0, _identifier.isIdentifierChar)(cp) || cp === charCodes.backslash) {
          this.raise(pos + 1, _error.Errors.MalformedRegExpFlags);
        } else {
          break;
        }

        ++pos;
        mods += _char;
      }

      this.state.pos = pos;
      this.finishToken(_types2.types.regexp, {
        pattern: content,
        flags: mods
      });
    } // Read an integer in the given radix. Return null if zero digits
    // were read, the integer value otherwise. When `len` is given, this
    // will return `null` unless the integer has exactly `len` digits.
    // When `forceLen` is `true`, it means that we already know that in case
    // of a malformed number we have to skip `len` characters anyway, instead
    // of bailing out early. For example, in "\u{123Z}" we want to read up to }
    // anyway, while in "\u00Z" we will stop at Z instead of consuming four
    // characters (and thus the closing quote).

  }, {
    key: "readInt",
    value: function readInt(radix, len, forceLen) {
      var allowNumSeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var start = this.state.pos;
      var forbiddenSiblings = radix === 16 ? forbiddenNumericSeparatorSiblings.hex : forbiddenNumericSeparatorSiblings.decBinOct;
      var allowedSiblings = radix === 16 ? allowedNumericSeparatorSiblings.hex : radix === 10 ? allowedNumericSeparatorSiblings.dec : radix === 8 ? allowedNumericSeparatorSiblings.oct : allowedNumericSeparatorSiblings.bin;
      var invalid = false;
      var total = 0;

      for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
        var code = this.input.charCodeAt(this.state.pos);
        var val = void 0;

        if (code === charCodes.underscore) {
          var prev = this.input.charCodeAt(this.state.pos - 1);
          var next = this.input.charCodeAt(this.state.pos + 1);

          if (allowedSiblings.indexOf(next) === -1) {
            this.raise(this.state.pos, _error.Errors.UnexpectedNumericSeparator);
          } else if (forbiddenSiblings.indexOf(prev) > -1 || forbiddenSiblings.indexOf(next) > -1 || Number.isNaN(next)) {
            this.raise(this.state.pos, _error.Errors.UnexpectedNumericSeparator);
          }

          if (!allowNumSeparator) {
            this.raise(this.state.pos, _error.Errors.NumericSeparatorInEscapeSequence);
          } // Ignore this _ character


          ++this.state.pos;
          continue;
        }

        if (code >= charCodes.lowercaseA) {
          val = code - charCodes.lowercaseA + charCodes.lineFeed;
        } else if (code >= charCodes.uppercaseA) {
          val = code - charCodes.uppercaseA + charCodes.lineFeed;
        } else if (charCodes.isDigit(code)) {
          val = code - charCodes.digit0; // 0-9
        } else {
          val = Infinity;
        }

        if (val >= radix) {
          // If we are in "errorRecovery" mode and we found a digit which is too big,
          // don't break the loop.
          if (this.options.errorRecovery && val <= 9) {
            val = 0;
            this.raise(this.state.start + i + 2, _error.Errors.InvalidDigit, radix);
          } else if (forceLen) {
            val = 0;
            invalid = true;
          } else {
            break;
          }
        }

        ++this.state.pos;
        total = total * radix + val;
      }

      if (this.state.pos === start || len != null && this.state.pos - start !== len || invalid) {
        return null;
      }

      return total;
    }
  }, {
    key: "readRadixNumber",
    value: function readRadixNumber(radix) {
      var start = this.state.pos;
      var isBigInt = false;
      this.state.pos += 2; // 0x

      var val = this.readInt(radix);

      if (val == null) {
        this.raise(this.state.start + 2, _error.Errors.InvalidDigit, radix);
      }

      var next = this.input.charCodeAt(this.state.pos);

      if (next === charCodes.lowercaseN) {
        ++this.state.pos;
        isBigInt = true;
      } else if (next === charCodes.lowercaseM) {
        throw this.raise(start, _error.Errors.InvalidDecimal);
      }

      if ((0, _identifier.isIdentifierStart)(this.codePointAtPos(this.state.pos))) {
        throw this.raise(this.state.pos, _error.Errors.NumberIdentifier);
      }

      if (isBigInt) {
        var str = this.input.slice(start, this.state.pos).replace(/[_n]/g, "");
        this.finishToken(_types2.types.bigint, str);
        return;
      }

      this.finishToken(_types2.types.num, val);
    } // Read an integer, octal integer, or floating-point number.

  }, {
    key: "readNumber",
    value: function readNumber(startsWithDot) {
      var start = this.state.pos;
      var isFloat = false;
      var isBigInt = false;
      var isDecimal = false;
      var hasExponent = false;
      var isOctal = false;

      if (!startsWithDot && this.readInt(10) === null) {
        this.raise(start, _error.Errors.InvalidNumber);
      }

      var hasLeadingZero = this.state.pos - start >= 2 && this.input.charCodeAt(start) === charCodes.digit0;

      if (hasLeadingZero) {
        var integer = this.input.slice(start, this.state.pos);
        this.recordStrictModeErrors(start, _error.Errors.StrictOctalLiteral);

        if (!this.state.strict) {
          // disallow numeric separators in non octal decimals and legacy octal likes
          var underscorePos = integer.indexOf("_");

          if (underscorePos > 0) {
            this.raise(underscorePos + start, _error.Errors.ZeroDigitNumericSeparator);
          }
        }

        isOctal = hasLeadingZero && !/[89]/.test(integer);
      }

      var next = this.input.charCodeAt(this.state.pos);

      if (next === charCodes.dot && !isOctal) {
        ++this.state.pos;
        this.readInt(10);
        isFloat = true;
        next = this.input.charCodeAt(this.state.pos);
      }

      if ((next === charCodes.uppercaseE || next === charCodes.lowercaseE) && !isOctal) {
        next = this.input.charCodeAt(++this.state.pos);

        if (next === charCodes.plusSign || next === charCodes.dash) {
          ++this.state.pos;
        }

        if (this.readInt(10) === null) {
          this.raise(start, _error.Errors.InvalidOrMissingExponent);
        }

        isFloat = true;
        hasExponent = true;
        next = this.input.charCodeAt(this.state.pos);
      }

      if (next === charCodes.lowercaseN) {
        // disallow floats, legacy octal syntax and non octal decimals
        // new style octal ("0o") is handled in this.readRadixNumber
        if (isFloat || hasLeadingZero) {
          this.raise(start, _error.Errors.InvalidBigIntLiteral);
        }

        ++this.state.pos;
        isBigInt = true;
      }

      if (next === charCodes.lowercaseM) {
        this.expectPlugin("decimal", this.state.pos);

        if (hasExponent || hasLeadingZero) {
          this.raise(start, _error.Errors.InvalidDecimal);
        }

        ++this.state.pos;
        isDecimal = true;
      }

      if ((0, _identifier.isIdentifierStart)(this.codePointAtPos(this.state.pos))) {
        throw this.raise(this.state.pos, _error.Errors.NumberIdentifier);
      } // remove "_" for numeric literal separator, and trailing `m` or `n`


      var str = this.input.slice(start, this.state.pos).replace(/[_mn]/g, "");

      if (isBigInt) {
        this.finishToken(_types2.types.bigint, str);
        return;
      }

      if (isDecimal) {
        this.finishToken(_types2.types.decimal, str);
        return;
      }

      var val = isOctal ? parseInt(str, 8) : parseFloat(str);
      this.finishToken(_types2.types.num, val);
    } // Read a string value, interpreting backslash-escapes.

  }, {
    key: "readCodePoint",
    value: function readCodePoint(throwOnInvalid) {
      var ch = this.input.charCodeAt(this.state.pos);
      var code;

      if (ch === charCodes.leftCurlyBrace) {
        var codePos = ++this.state.pos;
        code = this.readHexChar(this.input.indexOf("}", this.state.pos) - this.state.pos, true, throwOnInvalid);
        ++this.state.pos;

        if (code !== null && code > 0x10ffff) {
          if (throwOnInvalid) {
            this.raise(codePos, _error.Errors.InvalidCodePoint);
          } else {
            return null;
          }
        }
      } else {
        code = this.readHexChar(4, false, throwOnInvalid);
      }

      return code;
    }
  }, {
    key: "readString",
    value: function readString(quote) {
      var out = "",
          chunkStart = ++this.state.pos;

      for (;;) {
        if (this.state.pos >= this.length) {
          throw this.raise(this.state.start, _error.Errors.UnterminatedString);
        }

        var ch = this.input.charCodeAt(this.state.pos);
        if (ch === quote) break;

        if (ch === charCodes.backslash) {
          out += this.input.slice(chunkStart, this.state.pos); // $FlowFixMe

          out += this.readEscapedChar(false);
          chunkStart = this.state.pos;
        } else if (ch === charCodes.lineSeparator || ch === charCodes.paragraphSeparator) {
          ++this.state.pos;
          ++this.state.curLine;
          this.state.lineStart = this.state.pos;
        } else if ((0, _whitespace.isNewLine)(ch)) {
          throw this.raise(this.state.start, _error.Errors.UnterminatedString);
        } else {
          ++this.state.pos;
        }
      }

      out += this.input.slice(chunkStart, this.state.pos++);
      this.finishToken(_types2.types.string, out);
    } // Reads template string tokens.

  }, {
    key: "readTmplToken",
    value: function readTmplToken() {
      var out = "",
          chunkStart = this.state.pos,
          containsInvalid = false;

      for (;;) {
        if (this.state.pos >= this.length) {
          throw this.raise(this.state.start, _error.Errors.UnterminatedTemplate);
        }

        var ch = this.input.charCodeAt(this.state.pos);

        if (ch === charCodes.graveAccent || ch === charCodes.dollarSign && this.input.charCodeAt(this.state.pos + 1) === charCodes.leftCurlyBrace) {
          if (this.state.pos === this.state.start && this.match(_types2.types.template)) {
            if (ch === charCodes.dollarSign) {
              this.state.pos += 2;
              this.finishToken(_types2.types.dollarBraceL);
              return;
            } else {
              ++this.state.pos;
              this.finishToken(_types2.types.backQuote);
              return;
            }
          }

          out += this.input.slice(chunkStart, this.state.pos);
          this.finishToken(_types2.types.template, containsInvalid ? null : out);
          return;
        }

        if (ch === charCodes.backslash) {
          out += this.input.slice(chunkStart, this.state.pos);
          var escaped = this.readEscapedChar(true);

          if (escaped === null) {
            containsInvalid = true;
          } else {
            out += escaped;
          }

          chunkStart = this.state.pos;
        } else if ((0, _whitespace.isNewLine)(ch)) {
          out += this.input.slice(chunkStart, this.state.pos);
          ++this.state.pos;

          switch (ch) {
            case charCodes.carriageReturn:
              if (this.input.charCodeAt(this.state.pos) === charCodes.lineFeed) {
                ++this.state.pos;
              }

            // fall through

            case charCodes.lineFeed:
              out += "\n";
              break;

            default:
              out += String.fromCharCode(ch);
              break;
          }

          ++this.state.curLine;
          this.state.lineStart = this.state.pos;
          chunkStart = this.state.pos;
        } else {
          ++this.state.pos;
        }
      }
    }
  }, {
    key: "recordStrictModeErrors",
    value: function recordStrictModeErrors(pos, message) {
      if (this.state.strict && !this.state.strictErrors.has(pos)) {
        this.raise(pos, message);
      } else {
        this.state.strictErrors.set(pos, message);
      }
    } // Used to read escaped characters

  }, {
    key: "readEscapedChar",
    value: function readEscapedChar(inTemplate) {
      var throwOnInvalid = !inTemplate;
      var ch = this.input.charCodeAt(++this.state.pos);
      ++this.state.pos;

      switch (ch) {
        case charCodes.lowercaseN:
          return "\n";

        case charCodes.lowercaseR:
          return "\r";

        case charCodes.lowercaseX:
          {
            var code = this.readHexChar(2, false, throwOnInvalid);
            return code === null ? null : String.fromCharCode(code);
          }

        case charCodes.lowercaseU:
          {
            var _code = this.readCodePoint(throwOnInvalid);

            return _code === null ? null : String.fromCodePoint(_code);
          }

        case charCodes.lowercaseT:
          return "\t";

        case charCodes.lowercaseB:
          return "\b";

        case charCodes.lowercaseV:
          return "\x0B";

        case charCodes.lowercaseF:
          return "\f";

        case charCodes.carriageReturn:
          if (this.input.charCodeAt(this.state.pos) === charCodes.lineFeed) {
            ++this.state.pos;
          }

        // fall through

        case charCodes.lineFeed:
          this.state.lineStart = this.state.pos;
          ++this.state.curLine;
        // fall through

        case charCodes.lineSeparator:
        case charCodes.paragraphSeparator:
          return "";

        case charCodes.digit8:
        case charCodes.digit9:
          if (inTemplate) {
            return null;
          } else {
            this.recordStrictModeErrors(this.state.pos - 1, _error.Errors.StrictNumericEscape);
          }

        // fall through

        default:
          if (ch >= charCodes.digit0 && ch <= charCodes.digit7) {
            var codePos = this.state.pos - 1;
            var match = this.input.substr(this.state.pos - 1, 3).match(/^[0-7]+/); // This is never null, because of the if condition above.

            /*:: invariant(match !== null) */

            var octalStr = match[0];
            var octal = parseInt(octalStr, 8);

            if (octal > 255) {
              octalStr = octalStr.slice(0, -1);
              octal = parseInt(octalStr, 8);
            }

            this.state.pos += octalStr.length - 1;
            var next = this.input.charCodeAt(this.state.pos);

            if (octalStr !== "0" || next === charCodes.digit8 || next === charCodes.digit9) {
              if (inTemplate) {
                return null;
              } else {
                this.recordStrictModeErrors(codePos, _error.Errors.StrictNumericEscape);
              }
            }

            return String.fromCharCode(octal);
          }

          return String.fromCharCode(ch);
      }
    } // Used to read character escape sequences ('\x', '\u').

  }, {
    key: "readHexChar",
    value: function readHexChar(len, forceLen, throwOnInvalid) {
      var codePos = this.state.pos;
      var n = this.readInt(16, len, forceLen, false);

      if (n === null) {
        if (throwOnInvalid) {
          this.raise(codePos, _error.Errors.InvalidEscapeSequence);
        } else {
          this.state.pos = codePos - 1;
        }
      }

      return n;
    } // Read an identifier, and return it as a string. Sets `this.state.containsEsc`
    // to whether the word contained a '\u' escape.
    //
    // Incrementally adds only escaped chars, adding other chunks as-is
    // as a micro-optimization.
    //
    // When `firstCode` is given, it assumes it is always an identifier start and
    // will skip reading start position again

  }, {
    key: "readWord1",
    value: function readWord1(firstCode) {
      this.state.containsEsc = false;
      var word = "";
      var start = this.state.pos;
      var chunkStart = this.state.pos;

      if (firstCode !== undefined) {
        this.state.pos += firstCode <= 0xffff ? 1 : 2;
      }

      while (this.state.pos < this.length) {
        var ch = this.codePointAtPos(this.state.pos);

        if ((0, _identifier.isIdentifierChar)(ch)) {
          this.state.pos += ch <= 0xffff ? 1 : 2;
        } else if (ch === charCodes.backslash) {
          this.state.containsEsc = true;
          word += this.input.slice(chunkStart, this.state.pos);
          var escStart = this.state.pos;
          var identifierCheck = this.state.pos === start ? _identifier.isIdentifierStart : _identifier.isIdentifierChar;

          if (this.input.charCodeAt(++this.state.pos) !== charCodes.lowercaseU) {
            this.raise(this.state.pos, _error.Errors.MissingUnicodeEscape);
            chunkStart = this.state.pos - 1;
            continue;
          }

          ++this.state.pos;
          var esc = this.readCodePoint(true);

          if (esc !== null) {
            if (!identifierCheck(esc)) {
              this.raise(escStart, _error.Errors.EscapedCharNotAnIdentifier);
            }

            word += String.fromCodePoint(esc);
          }

          chunkStart = this.state.pos;
        } else {
          break;
        }
      }

      return word + this.input.slice(chunkStart, this.state.pos);
    } // Read an identifier or keyword token. Will check for reserved
    // words when necessary.

  }, {
    key: "readWord",
    value: function readWord(firstCode) {
      var word = this.readWord1(firstCode);

      var type = _types2.keywords.get(word) || _types2.types.name;

      this.finishToken(type, word);
    }
  }, {
    key: "checkKeywordEscapes",
    value: function checkKeywordEscapes() {
      var kw = this.state.type.keyword;

      if (kw && this.state.containsEsc) {
        this.raise(this.state.start, _error.Errors.InvalidEscapedReservedWord, kw);
      }
    } // the prevType is required by the jsx plugin
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "updateContext",
    value: function updateContext(prevType) {
      var _this$state$type$upda, _this$state$type;

      (_this$state$type$upda = (_this$state$type = this.state.type).updateContext) === null || _this$state$type$upda === void 0 ? void 0 : _this$state$type$upda.call(_this$state$type, this.state.context);
    }
  }]);

  return Tokenizer;
}(_error["default"]);

exports["default"] = Tokenizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbml6ZXIvaW5kZXguanMiXSwibmFtZXMiOlsiVkFMSURfUkVHRVhfRkxBR1MiLCJTZXQiLCJjaGFyQ29kZXMiLCJsb3dlcmNhc2VHIiwibG93ZXJjYXNlTSIsImxvd2VyY2FzZVMiLCJsb3dlcmNhc2VJIiwibG93ZXJjYXNlWSIsImxvd2VyY2FzZVUiLCJsb3dlcmNhc2VEIiwiZm9yYmlkZGVuTnVtZXJpY1NlcGFyYXRvclNpYmxpbmdzIiwiZGVjQmluT2N0IiwiZG90IiwidXBwZXJjYXNlQiIsInVwcGVyY2FzZUUiLCJ1cHBlcmNhc2VPIiwidW5kZXJzY29yZSIsImxvd2VyY2FzZUIiLCJsb3dlcmNhc2VFIiwibG93ZXJjYXNlTyIsImhleCIsInVwcGVyY2FzZVgiLCJsb3dlcmNhc2VYIiwiYWxsb3dlZE51bWVyaWNTZXBhcmF0b3JTaWJsaW5ncyIsImJpbiIsImRpZ2l0MCIsImRpZ2l0MSIsIm9jdCIsImRpZ2l0MiIsImRpZ2l0MyIsImRpZ2l0NCIsImRpZ2l0NSIsImRpZ2l0NiIsImRpZ2l0NyIsImRlYyIsImRpZ2l0OCIsImRpZ2l0OSIsInVwcGVyY2FzZUEiLCJ1cHBlcmNhc2VDIiwidXBwZXJjYXNlRCIsInVwcGVyY2FzZUYiLCJsb3dlcmNhc2VBIiwibG93ZXJjYXNlQyIsImxvd2VyY2FzZUYiLCJUb2tlbiIsInN0YXRlIiwidHlwZSIsInZhbHVlIiwic3RhcnQiLCJlbmQiLCJsb2MiLCJTb3VyY2VMb2NhdGlvbiIsInN0YXJ0TG9jIiwiZW5kTG9jIiwiVG9rZW5pemVyIiwib3B0aW9ucyIsImlucHV0IiwiU3RhdGUiLCJpbml0IiwibGVuZ3RoIiwiaXNMb29rYWhlYWQiLCJ0b2tlbiIsInRva2VucyIsInRva2Vuc0xlbmd0aCIsInB1c2giLCJjaGVja0tleXdvcmRFc2NhcGVzIiwicHVzaFRva2VuIiwibGFzdFRva0VuZCIsImxhc3RUb2tTdGFydCIsImxhc3RUb2tFbmRMb2MiLCJsYXN0VG9rU3RhcnRMb2MiLCJuZXh0VG9rZW4iLCJtYXRjaCIsIm5leHQiLCJwb3MiLCJjb250ZXh0IiwiY3VyQ29udGV4dCIsImluVHlwZSIsIm9sZCIsImNyZWF0ZUxvb2thaGVhZFN0YXRlIiwiY3VyciIsIm5leHRUb2tlblN0YXJ0U2luY2UiLCJza2lwV2hpdGVTcGFjZSIsImxhc3RJbmRleCIsInNraXAiLCJleGVjIiwiY2hhckNvZGVBdCIsIm5leHRUb2tlblN0YXJ0IiwiY3AiLCJ0cmFpbCIsInN0cmljdCIsInN0cmljdEVycm9ycyIsImZvckVhY2giLCJtZXNzYWdlIiwicmFpc2UiLCJjbGVhciIsInByZXNlcnZlU3BhY2UiLCJza2lwU3BhY2UiLCJjdXJQb3NpdGlvbiIsImZpbmlzaFRva2VuIiwidHQiLCJlb2YiLCJjdCIsInRlbXBsYXRlIiwicmVhZFRtcGxUb2tlbiIsImdldFRva2VuRnJvbUNvZGUiLCJjb2RlUG9pbnRBdFBvcyIsImJsb2NrIiwidGV4dCIsImNvbW1lbnQiLCJjb21tZW50cyIsImFkZENvbW1lbnQiLCJpbmRleE9mIiwiRXJyb3JzIiwiVW50ZXJtaW5hdGVkQ29tbWVudCIsImxpbmVCcmVha0ciLCJpbmRleCIsImN1ckxpbmUiLCJsaW5lU3RhcnQiLCJwdXNoQ29tbWVudCIsInNsaWNlIiwic3RhcnRTa2lwIiwiY2giLCJsb29wIiwic3BhY2UiLCJub25CcmVha2luZ1NwYWNlIiwidGFiIiwiY2FycmlhZ2VSZXR1cm4iLCJsaW5lRmVlZCIsImxpbmVTZXBhcmF0b3IiLCJwYXJhZ3JhcGhTZXBhcmF0b3IiLCJzbGFzaCIsImFzdGVyaXNrIiwic2tpcEJsb2NrQ29tbWVudCIsInNraXBMaW5lQ29tbWVudCIsInZhbCIsInByZXZUeXBlIiwidXBkYXRlQ29udGV4dCIsInJlYWRUb2tlbl9pbnRlcnByZXRlciIsIm5leHRQb3MiLCJVbmV4cGVjdGVkRGlnaXRBZnRlckhhc2giLCJsZWZ0Q3VybHlCcmFjZSIsImxlZnRTcXVhcmVCcmFja2V0IiwiaGFzUGx1Z2luIiwiZXhwZWN0UGx1Z2luIiwiZ2V0UGx1Z2luT3B0aW9uIiwiUmVjb3JkRXhwcmVzc2lvbkhhc2hJbmNvcnJlY3RTdGFydFN5bnRheFR5cGUiLCJUdXBsZUV4cHJlc3Npb25IYXNoSW5jb3JyZWN0U3RhcnRTeW50YXhUeXBlIiwiYnJhY2VIYXNoTCIsImJyYWNrZXRIYXNoTCIsInByaXZhdGVOYW1lIiwicmVhZFdvcmQxIiwiYmFja3NsYXNoIiwiZmluaXNoT3AiLCJoYXNoIiwicmVhZE51bWJlciIsImVsbGlwc2lzIiwiZXF1YWxzVG8iLCJzbGFzaEFzc2lnbiIsImV4Y2xhbWF0aW9uTWFyayIsImludGVycHJldGVyRGlyZWN0aXZlIiwiY29kZSIsInN0YXIiLCJtb2R1bG8iLCJ3aWR0aCIsImV4cG9uZW50IiwiYXNzaWduIiwidmVydGljYWxCYXIiLCJsb2dpY2FsT1IiLCJsb2dpY2FsQU5EIiwiZ3JlYXRlclRoYW4iLCJwaXBlbGluZSIsInJpZ2h0Q3VybHlCcmFjZSIsIlJlY29yZEV4cHJlc3Npb25CYXJJbmNvcnJlY3RFbmRTeW50YXhUeXBlIiwiYnJhY2VCYXJSIiwicmlnaHRTcXVhcmVCcmFja2V0IiwiVHVwbGVFeHByZXNzaW9uQmFySW5jb3JyZWN0RW5kU3ludGF4VHlwZSIsImJyYWNrZXRCYXJSIiwiYml0d2lzZU9SIiwiYml0d2lzZUFORCIsImJpdHdpc2VYT1IiLCJkYXNoIiwiaW5Nb2R1bGUiLCJoYXNQcmVjZWRpbmdMaW5lQnJlYWsiLCJpbmNEZWMiLCJwbHVzTWluIiwic2l6ZSIsImJpdFNoaWZ0IiwibGVzc1RoYW4iLCJyZWxhdGlvbmFsIiwiZXF1YWxpdHkiLCJhcnJvdyIsImVxIiwiYmFuZyIsIm5leHQyIiwicXVlc3Rpb25NYXJrIiwibnVsbGlzaENvYWxlc2NpbmciLCJxdWVzdGlvbkRvdCIsInF1ZXN0aW9uIiwicmVhZFRva2VuX2RvdCIsImxlZnRQYXJlbnRoZXNpcyIsInBhcmVuTCIsInJpZ2h0UGFyZW50aGVzaXMiLCJwYXJlblIiLCJzZW1pY29sb24iLCJzZW1pIiwiY29tbWEiLCJUdXBsZUV4cHJlc3Npb25CYXJJbmNvcnJlY3RTdGFydFN5bnRheFR5cGUiLCJicmFja2V0QmFyTCIsImJyYWNrZXRMIiwiYnJhY2tldFIiLCJSZWNvcmRFeHByZXNzaW9uQmFySW5jb3JyZWN0U3RhcnRTeW50YXhUeXBlIiwiYnJhY2VCYXJMIiwiYnJhY2VMIiwiYnJhY2VSIiwiY29sb24iLCJkb3VibGVDb2xvbiIsInJlYWRUb2tlbl9xdWVzdGlvbiIsImdyYXZlQWNjZW50IiwiYmFja1F1b3RlIiwicmVhZFJhZGl4TnVtYmVyIiwicXVvdGF0aW9uTWFyayIsImFwb3N0cm9waGUiLCJyZWFkU3RyaW5nIiwicmVhZFRva2VuX3NsYXNoIiwicGVyY2VudFNpZ24iLCJyZWFkVG9rZW5fbXVsdF9tb2R1bG8iLCJhbXBlcnNhbmQiLCJyZWFkVG9rZW5fcGlwZV9hbXAiLCJjYXJldCIsInJlYWRUb2tlbl9jYXJldCIsInBsdXNTaWduIiwicmVhZFRva2VuX3BsdXNfbWluIiwicmVhZFRva2VuX2x0X2d0IiwicmVhZFRva2VuX2VxX2V4Y2wiLCJ0aWxkZSIsImF0U2lnbiIsImF0IiwibnVtYmVyU2lnbiIsInJlYWRUb2tlbl9udW1iZXJTaWduIiwicmVhZFdvcmQiLCJJbnZhbGlkT3JVbmV4cGVjdGVkVG9rZW4iLCJTdHJpbmciLCJmcm9tQ29kZVBvaW50Iiwic3RyIiwiZXNjYXBlZCIsImluQ2xhc3MiLCJVbnRlcm1pbmF0ZWRSZWdFeHAiLCJjb250ZW50IiwibW9kcyIsImNoYXIiLCJmcm9tQ2hhckNvZGUiLCJoYXMiLCJpbmNsdWRlcyIsIkR1cGxpY2F0ZVJlZ0V4cEZsYWdzIiwiTWFsZm9ybWVkUmVnRXhwRmxhZ3MiLCJyZWdleHAiLCJwYXR0ZXJuIiwiZmxhZ3MiLCJyYWRpeCIsImxlbiIsImZvcmNlTGVuIiwiYWxsb3dOdW1TZXBhcmF0b3IiLCJmb3JiaWRkZW5TaWJsaW5ncyIsImFsbG93ZWRTaWJsaW5ncyIsImludmFsaWQiLCJ0b3RhbCIsImkiLCJlIiwiSW5maW5pdHkiLCJwcmV2IiwiVW5leHBlY3RlZE51bWVyaWNTZXBhcmF0b3IiLCJOdW1iZXIiLCJpc05hTiIsIk51bWVyaWNTZXBhcmF0b3JJbkVzY2FwZVNlcXVlbmNlIiwiaXNEaWdpdCIsImVycm9yUmVjb3ZlcnkiLCJJbnZhbGlkRGlnaXQiLCJpc0JpZ0ludCIsInJlYWRJbnQiLCJsb3dlcmNhc2VOIiwiSW52YWxpZERlY2ltYWwiLCJOdW1iZXJJZGVudGlmaWVyIiwicmVwbGFjZSIsImJpZ2ludCIsIm51bSIsInN0YXJ0c1dpdGhEb3QiLCJpc0Zsb2F0IiwiaXNEZWNpbWFsIiwiaGFzRXhwb25lbnQiLCJpc09jdGFsIiwiSW52YWxpZE51bWJlciIsImhhc0xlYWRpbmdaZXJvIiwiaW50ZWdlciIsInJlY29yZFN0cmljdE1vZGVFcnJvcnMiLCJTdHJpY3RPY3RhbExpdGVyYWwiLCJ1bmRlcnNjb3JlUG9zIiwiWmVyb0RpZ2l0TnVtZXJpY1NlcGFyYXRvciIsInRlc3QiLCJJbnZhbGlkT3JNaXNzaW5nRXhwb25lbnQiLCJJbnZhbGlkQmlnSW50TGl0ZXJhbCIsImRlY2ltYWwiLCJwYXJzZUludCIsInBhcnNlRmxvYXQiLCJ0aHJvd09uSW52YWxpZCIsImNvZGVQb3MiLCJyZWFkSGV4Q2hhciIsIkludmFsaWRDb2RlUG9pbnQiLCJxdW90ZSIsIm91dCIsImNodW5rU3RhcnQiLCJVbnRlcm1pbmF0ZWRTdHJpbmciLCJyZWFkRXNjYXBlZENoYXIiLCJzdHJpbmciLCJjb250YWluc0ludmFsaWQiLCJVbnRlcm1pbmF0ZWRUZW1wbGF0ZSIsImRvbGxhclNpZ24iLCJkb2xsYXJCcmFjZUwiLCJzZXQiLCJpblRlbXBsYXRlIiwibG93ZXJjYXNlUiIsInJlYWRDb2RlUG9pbnQiLCJsb3dlcmNhc2VUIiwibG93ZXJjYXNlViIsIlN0cmljdE51bWVyaWNFc2NhcGUiLCJzdWJzdHIiLCJvY3RhbFN0ciIsIm9jdGFsIiwibiIsIkludmFsaWRFc2NhcGVTZXF1ZW5jZSIsImZpcnN0Q29kZSIsImNvbnRhaW5zRXNjIiwid29yZCIsInVuZGVmaW5lZCIsImVzY1N0YXJ0IiwiaWRlbnRpZmllckNoZWNrIiwiaXNJZGVudGlmaWVyU3RhcnQiLCJpc0lkZW50aWZpZXJDaGFyIiwiTWlzc2luZ1VuaWNvZGVFc2NhcGUiLCJlc2MiLCJFc2NhcGVkQ2hhck5vdEFuSWRlbnRpZmllciIsImtleXdvcmRUeXBlcyIsImdldCIsIm5hbWUiLCJrdyIsImtleXdvcmQiLCJJbnZhbGlkRXNjYXBlZFJlc2VydmVkV29yZCIsIlBhcnNlckVycm9ycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBTUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLGlCQUFpQixHQUFHLElBQUlDLEdBQUosQ0FBUSxDQUNoQ0MsU0FBUyxDQUFDQyxVQURzQixFQUVoQ0QsU0FBUyxDQUFDRSxVQUZzQixFQUdoQ0YsU0FBUyxDQUFDRyxVQUhzQixFQUloQ0gsU0FBUyxDQUFDSSxVQUpzQixFQUtoQ0osU0FBUyxDQUFDSyxVQUxzQixFQU1oQ0wsU0FBUyxDQUFDTSxVQU5zQixFQU9oQ04sU0FBUyxDQUFDTyxVQVBzQixDQUFSLENBQTFCLEMsQ0FVQTtBQUNBOztBQUVBLElBQU1DLGlDQUFpQyxHQUFHO0FBQ3hDQyxFQUFBQSxTQUFTLEVBQUUsQ0FDVFQsU0FBUyxDQUFDVSxHQURELEVBRVRWLFNBQVMsQ0FBQ1csVUFGRCxFQUdUWCxTQUFTLENBQUNZLFVBSEQsRUFJVFosU0FBUyxDQUFDYSxVQUpELEVBS1RiLFNBQVMsQ0FBQ2MsVUFMRCxFQUthO0FBQ3RCZCxFQUFBQSxTQUFTLENBQUNlLFVBTkQsRUFPVGYsU0FBUyxDQUFDZ0IsVUFQRCxFQVFUaEIsU0FBUyxDQUFDaUIsVUFSRCxDQUQ2QjtBQVd4Q0MsRUFBQUEsR0FBRyxFQUFFLENBQ0hsQixTQUFTLENBQUNVLEdBRFAsRUFFSFYsU0FBUyxDQUFDbUIsVUFGUCxFQUdIbkIsU0FBUyxDQUFDYyxVQUhQLEVBR21CO0FBQ3RCZCxFQUFBQSxTQUFTLENB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QSxVQUFVLEdBQUcsS0FBS3pRLEtBQUwsQ0FBVzZCLEdBQXhCO0FBQ0QsU0F4Qk0sTUF3QkE7QUFDTDtBQUNEO0FBQ0Y7O0FBQ0QsYUFBT2tRLElBQUksR0FBRyxLQUFLcFIsS0FBTCxDQUFXZ0UsS0FBWCxDQUFpQjhMLFVBQWpCLEVBQTZCLEtBQUt6USxLQUFMLENBQVc2QixHQUF4QyxDQUFkO0FBQ0QsSyxDQUVEO0FBQ0E7Ozs7V0FFQSxrQkFBU2dRLFNBQVQsRUFBeUM7QUFDdkMsVUFBTUUsSUFBSSxHQUFHLEtBQUtyTCxTQUFMLENBQWVtTCxTQUFmLENBQWI7O0FBQ0EsVUFBTTVSLElBQUksR0FBR3VTLGlCQUFhQyxHQUFiLENBQWlCVixJQUFqQixLQUEwQnhPLGNBQUdtUCxJQUExQzs7QUFDQSxXQUFLcFAsV0FBTCxDQUFpQnJELElBQWpCLEVBQXVCOFIsSUFBdkI7QUFDRDs7O1dBRUQsK0JBQTRCO0FBQzFCLFVBQU1ZLEVBQUUsR0FBRyxLQUFLM1MsS0FBTCxDQUFXQyxJQUFYLENBQWdCMlMsT0FBM0I7O0FBQ0EsVUFBSUQsRUFBRSxJQUFJLEtBQUszUyxLQUFMLENBQVc4UixXQUFyQixFQUFrQztBQUNoQyxhQUFLN08sS0FBTCxDQUFXLEtBQUtqRCxLQUFMLENBQVdHLEtBQXRCLEVBQTZCaUUsY0FBT3lPLDBCQUFwQyxFQUFnRUYsRUFBaEU7QUFDRDtBQUNGLEssQ0FFRDtBQUNBOzs7O1dBQ0EsdUJBQWNoTixRQUFkLEVBQXlDO0FBQUE7O0FBQ3ZDLHdEQUFLM0YsS0FBTCxDQUFXQyxJQUFYLEVBQWdCMkYsYUFBaEIsdUdBQWdDLEtBQUs1RixLQUFMLENBQVc4QixPQUEzQztBQUNEOzs7O0VBeDZDb0NnUixpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8qOjogZGVjbGFyZSB2YXIgaW52YXJpYW50OyAqL1xuXG5pbXBvcnQgdHlwZSB7IE9wdGlvbnMgfSBmcm9tIFwiLi4vb3B0aW9uc1wiO1xuaW1wb3J0ICogYXMgTiBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgUG9zaXRpb24gfSBmcm9tIFwiLi4vdXRpbC9sb2NhdGlvblwiO1xuaW1wb3J0ICogYXMgY2hhckNvZGVzIGZyb20gXCJjaGFyY29kZXNcIjtcbmltcG9ydCB7IGlzSWRlbnRpZmllclN0YXJ0LCBpc0lkZW50aWZpZXJDaGFyIH0gZnJvbSBcIi4uL3V0aWwvaWRlbnRpZmllclwiO1xuaW1wb3J0IHsgdHlwZXMgYXMgdHQsIGtleXdvcmRzIGFzIGtleXdvcmRUeXBlcywgdHlwZSBUb2tlblR5cGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgdHlwZSBUb2tDb250ZXh0LCB0eXBlcyBhcyBjdCB9IGZyb20gXCIuL2NvbnRleHRcIjtcbmltcG9ydCBQYXJzZXJFcnJvcnMsIHsgRXJyb3JzLCB0eXBlIEVycm9yVGVtcGxhdGUgfSBmcm9tIFwiLi4vcGFyc2VyL2Vycm9yXCI7XG5pbXBvcnQgeyBTb3VyY2VMb2NhdGlvbiB9IGZyb20gXCIuLi91dGlsL2xvY2F0aW9uXCI7XG5pbXBvcnQge1xuICBsaW5lQnJlYWtHLFxuICBpc05ld0xpbmUsXG4gIGlzV2hpdGVzcGFjZSxcbiAgc2tpcFdoaXRlU3BhY2UsXG59IGZyb20gXCIuLi91dGlsL3doaXRlc3BhY2VcIjtcbmltcG9ydCBTdGF0ZSBmcm9tIFwiLi9zdGF0ZVwiO1xuaW1wb3J0IHR5cGUgeyBMb29rYWhlYWRTdGF0ZSB9IGZyb20gXCIuL3N0YXRlXCI7XG5cbmNvbnN0IFZBTElEX1JFR0VYX0ZMQUdTID0gbmV3IFNldChbXG4gIGNoYXJDb2Rlcy5sb3dlcmNhc2VHLFxuICBjaGFyQ29kZXMubG93ZXJjYXNlTSxcbiAgY2hhckNvZGVzLmxvd2VyY2FzZVMsXG4gIGNoYXJDb2Rlcy5sb3dlcmNhc2VJLFxuICBjaGFyQ29kZXMubG93ZXJjYXNlWSxcbiAgY2hhckNvZGVzLmxvd2VyY2FzZVUsXG4gIGNoYXJDb2Rlcy5sb3dlcmNhc2VELFxuXSk7XG5cbi8vIFRoZSBmb2xsb3dpbmcgY2hhcmFjdGVyIGNvZGVzIGFyZSBmb3JiaWRkZW4gZnJvbSBiZWluZ1xuLy8gYW4gaW1tZWRpYXRlIHNpYmxpbmcgb2YgTnVtZXJpY0xpdGVyYWxTZXBhcmF0b3IgX1xuXG5jb25zdCBmb3JiaWRkZW5OdW1lcmljU2VwYXJhdG9yU2libGluZ3MgPSB7XG4gIGRlY0Jpbk9jdDogW1xuICAgIGNoYXJDb2Rlcy5kb3QsXG4gICAgY2hhckNvZGVzLnVwcGVyY2FzZUIsXG4gICAgY2hhckNvZGVzLnVwcGVyY2FzZUUsXG4gICAgY2hhckNvZGVzLnVwcGVyY2FzZU8sXG4gICAgY2hhckNvZGVzLnVuZGVyc2NvcmUsIC8vIG11bHRpcGxlIHNlcGFyYXRvcnMgYXJlIG5vdCBhbGxvd2VkXG4gICAgY2hhckNvZGVzLmxvd2VyY2FzZUIsXG4gICAgY2hhckNvZGVzLmxvd2VyY2FzZUUsXG4gICAgY2hhckNvZGVzLmxvd2VyY2FzZU8sXG4gIF0sXG4gIGhleDogW1xuICAgIGNoYXJDb2Rlcy5kb3QsXG4gICAgY2hhckNvZGVzLnVwcGVyY2FzZVgsXG4gICAgY2hhckNvZGVzLnVuZGVyc2NvcmUsIC8vIG11bHRpcGxlIHNlcGFyYXRvcnMgYXJlIG5vdCBhbGxvd2VkXG4gICAgY2hhckNvZGVzLmxvd2VyY2FzZVgsXG4gIF0sXG59O1xuXG5jb25zdCBhbGxvd2VkTnVtZXJpY1NlcGFyYXRvclNpYmxpbmdzID0ge307XG5hbGxvd2VkTnVtZXJpY1NlcGFyYXRvclNpYmxpbmdzLmJpbiA9IFtcbiAgLy8gMCAtIDFcbiAgY2hhckNvZGVzLmRpZ2l0MCxcbiAgY2hhckNvZGVzLmRpZ2l0MSxcbl07XG5hbGxvd2VkTnVtZXJpY1NlcGFyYXRvclNpYmxpbmdzLm9jdCA9IFtcbiAgLy8gMCAtIDdcbiAgLi4uYWxsb3dlZE51bWVyaWNTZXBhcmF0b3JTaWJsaW5ncy5iaW4sXG5cbiAgY2hhckNvZGVzLmRpZ2l0MixcbiAgY2hhckNvZGVzLmRpZ2l0MyxcbiAgY2hhckNvZGVzLmRpZ2l0NCxcbiAgY2hhckNvZGVzLmRpZ2l0NSxcbiAgY2hhckNvZGVzLmRpZ2l0NixcbiAgY2hhckNvZGVzLmRpZ2l0Nyxcbl07XG5hbGxvd2VkTnVtZXJpY1NlcGFyYXRvclNpYmxpbmdzLmRlYyA9IFtcbiAgLy8gMCAtIDlcbiAgLi4uYWxsb3dlZE51bWVyaWNTZXBhcmF0b3JTaWJsaW5ncy5vY3QsXG5cbiAgY2hhckNvZGVzLmRpZ2l0OCxcbiAgY2hhckNvZGVzLmRpZ2l0OSxcbl07XG5cbmFsbG93ZWROdW1lcmljU2VwYXJhdG9yU2libGluZ3MuaGV4ID0gW1xuICAvLyAwIC0gOSwgQSAtIEYsIGEgLSBmLFxuICAuLi5hbGxvd2VkTnVtZXJpY1NlcGFyYXRvclNpYmxpbmdzLmRlYyxcblxuICBjaGFyQ29kZXMudXBwZXJjYXNlQSxcbiAgY2hhckNvZGVzLnVwcGVyY2FzZUIsXG4gIGNoYXJDb2Rlcy51cHBlcmNhc2VDLFxuICBjaGFyQ29kZXMudXBwZXJjYXNlRCxcbiAgY2hhckNvZGVzLnVwcGVyY2FzZUUsXG4gIGNoYXJDb2Rlcy51cHBlcmNhc2VGLFxuXG4gIGNoYXJDb2Rlcy5sb3dlcmNhc2VBLFxuICBjaGFyQ29kZXMubG93ZXJjYXNlQixcbiAgY2hhckNvZGVzLmxvd2VyY2FzZUMsXG4gIGNoYXJDb2Rlcy5sb3dlcmNhc2VELFxuICBjaGFyQ29kZXMubG93ZXJjYXNlRSxcbiAgY2hhckNvZGVzLmxvd2VyY2FzZUYsXG5dO1xuXG4vLyBPYmplY3QgdHlwZSB1c2VkIHRvIHJlcHJlc2VudCB0b2tlbnMuIE5vdGUgdGhhdCBub3JtYWxseSwgdG9rZW5zXG4vLyBzaW1wbHkgZXhpc3QgYXMgcHJvcGVydGllcyBvbiB0aGUgcGFyc2VyIG9iamVjdC4gVGhpcyBpcyBvbmx5XG4vLyB1c2VkIGZvciB0aGUgb25Ub2tlbiBjYWxsYmFjayBhbmQgdGhlIGV4dGVybmFsIHRva2VuaXplci5cblxuZXhwb3J0IGNsYXNzIFRva2VuIHtcbiAgY29uc3RydWN0b3Ioc3RhdGU6IFN0YXRlKSB7XG4gICAgdGhpcy50eXBlID0gc3RhdGUudHlwZTtcbiAgICB0aGlzLnZhbHVlID0gc3RhdGUudmFsdWU7XG4gICAgdGhpcy5zdGFydCA9IHN0YXRlLnN0YXJ0O1xuICAgIHRoaXMuZW5kID0gc3RhdGUuZW5kO1xuICAgIHRoaXMubG9jID0gbmV3IFNvdXJjZUxvY2F0aW9uKHN0YXRlLnN0YXJ0TG9jLCBzdGF0ZS5lbmRMb2MpO1xuICB9XG5cbiAgZGVjbGFyZSB0eXBlOiBUb2tlblR5cGU7XG4gIGRlY2xhcmUgdmFsdWU6IGFueTtcbiAgZGVjbGFyZSBzdGFydDogbnVtYmVyO1xuICBkZWNsYXJlIGVuZDogbnVtYmVyO1xuICBkZWNsYXJlIGxvYzogU291cmNlTG9jYXRpb247XG59XG5cbi8vICMjIFRva2VuaXplclxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb2tlbml6ZXIgZXh0ZW5kcyBQYXJzZXJFcnJvcnMge1xuICAvLyBGb3J3YXJkLWRlY2xhcmF0aW9uc1xuICAvLyBwYXJzZXIvdXRpbC5qc1xuICAvKjo6XG4gICtoYXNQcmVjZWRpbmdMaW5lQnJlYWs6ICgpID0+IGJvb2xlYW47XG4gICt1bmV4cGVjdGVkOiAocG9zPzogP251bWJlciwgbWVzc2FnZU9yVHlwZT86IEVycm9yVGVtcGxhdGUgfCBUb2tlblR5cGUpID0+IGVtcHR5O1xuICArZXhwZWN0UGx1Z2luOiAobmFtZTogc3RyaW5nLCBwb3M/OiA/bnVtYmVyKSA9PiB0cnVlO1xuICAqL1xuXG4gIGlzTG9va2FoZWFkOiBib29sZWFuO1xuXG4gIC8vIFRva2VuIHN0b3JlLlxuICB0b2tlbnM6IEFycmF5PFRva2VuIHwgTi5Db21tZW50PiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IE9wdGlvbnMsIGlucHV0OiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhdGUgPSBuZXcgU3RhdGUoKTtcbiAgICB0aGlzLnN0YXRlLmluaXQob3B0aW9ucyk7XG4gICAgdGhpcy5pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMubGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuICAgIHRoaXMuaXNMb29rYWhlYWQgPSBmYWxzZTtcbiAgfVxuXG4gIHB1c2hUb2tlbih0b2tlbjogVG9rZW4gfCBOLkNvbW1lbnQpIHtcbiAgICAvLyBQb3Agb3V0IGludmFsaWQgdG9rZW5zIHRyYXBwZWQgYnkgdHJ5LWNhdGNoIHBhcnNpbmcuXG4gICAgLy8gVGhvc2UgcGFyc2luZyBicmFuY2hlcyBhcmUgbWFpbmx5IGNyZWF0ZWQgYnkgdHlwZXNjcmlwdCBhbmQgZmxvdyBwbHVnaW5zLlxuICAgIHRoaXMudG9rZW5zLmxlbmd0aCA9IHRoaXMuc3RhdGUudG9rZW5zTGVuZ3RoO1xuICAgIHRoaXMudG9rZW5zLnB1c2godG9rZW4pO1xuICAgICsrdGhpcy5zdGF0ZS50b2tlbnNMZW5ndGg7XG4gIH1cblxuICAvLyBNb3ZlIHRvIHRoZSBuZXh0IHRva2VuXG5cbiAgbmV4dCgpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrS2V5d29yZEVzY2FwZXMoKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnRva2Vucykge1xuICAgICAgdGhpcy5wdXNoVG9rZW4obmV3IFRva2VuKHRoaXMuc3RhdGUpKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlLmxhc3RUb2tFbmQgPSB0aGlzLnN0YXRlLmVuZDtcbiAgICB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCA9IHRoaXMuc3RhdGUuc3RhcnQ7XG4gICAgdGhpcy5zdGF0ZS5sYXN0VG9rRW5kTG9jID0gdGhpcy5zdGF0ZS5lbmRMb2M7XG4gICAgdGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnRMb2MgPSB0aGlzLnN0YXRlLnN0YXJ0TG9jO1xuICAgIHRoaXMubmV4dFRva2VuKCk7XG4gIH1cblxuICAvLyBUT0RPXG5cbiAgZWF0KHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLm1hdGNoKHR5cGUpKSB7XG4gICAgICB0aGlzLm5leHQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ET1xuXG4gIG1hdGNoKHR5cGU6IFRva2VuVHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnR5cGUgPT09IHR5cGU7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgTG9va2FoZWFkU3RhdGUgZnJvbSBjdXJyZW50IHBhcnNlciBzdGF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0YXRlfSBzdGF0ZVxuICAgKiBAcmV0dXJucyB7TG9va2FoZWFkU3RhdGV9XG4gICAqIEBtZW1iZXJvZiBUb2tlbml6ZXJcbiAgICovXG4gIGNyZWF0ZUxvb2thaGVhZFN0YXRlKHN0YXRlOiBTdGF0ZSk6IExvb2thaGVhZFN0YXRlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zOiBzdGF0ZS5wb3MsXG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIHR5cGU6IHN0YXRlLnR5cGUsXG4gICAgICBzdGFydDogc3RhdGUuc3RhcnQsXG4gICAgICBlbmQ6IHN0YXRlLmVuZCxcbiAgICAgIGxhc3RUb2tFbmQ6IHN0YXRlLmVuZCxcbiAgICAgIGNvbnRleHQ6IFt0aGlzLmN1ckNvbnRleHQoKV0sXG4gICAgICBpblR5cGU6IHN0YXRlLmluVHlwZSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIGxvb2thaGVhZCBwZWVrcyB0aGUgbmV4dCB0b2tlbiwgc2tpcHBpbmcgY2hhbmdlcyB0byB0b2tlbiBjb250ZXh0IGFuZFxuICAgKiBjb21tZW50IHN0YWNrLiBGb3IgcGVyZm9ybWFuY2UgaXQgcmV0dXJucyBhIGxpbWl0ZWQgTG9va2FoZWFkU3RhdGVcbiAgICogaW5zdGVhZCBvZiBmdWxsIHBhcnNlciBzdGF0ZS5cbiAgICpcbiAgICogVGhlIHsgY29sdW1uLCBsaW5lIH0gTG9jIGluZm8gaXMgbm90IGluY2x1ZGVkIGluIGxvb2thaGVhZCBzaW5jZSBzdWNoIHVzYWdlXG4gICAqIGlzIHJhcmUuIEFsdGhvdWdoIGl0IG1heSByZXR1cm4gb3RoZXIgbG9jYXRpb24gcHJvcGVydGllcyBlLmcuIGBjdXJMaW5lYCBhbmRcbiAgICogYGxpbmVTdGFydGAsIHRoZXNlIHByb3BlcnRpZXMgYXJlIG5vdCBsaXN0ZWQgaW4gdGhlIExvb2thaGVhZFN0YXRlIGludGVyZmFjZVxuICAgKiBhbmQgdGh1cyB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgX05PVF8gcmVsaWFibGUuXG4gICAqXG4gICAqIFRoZSB0b2tlbml6ZXIgc2hvdWxkIG1ha2UgYmVzdCBlZmZvcnRzIHRvIGF2b2lkIHVzaW5nIGFueSBwYXJzZXIgc3RhdGVcbiAgICogb3RoZXIgdGhhbiB0aG9zZSBkZWZpbmVkIGluIExvb2thaGVhZFN0YXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtMb29rYWhlYWRTdGF0ZX1cbiAgICogQG1lbWJlcm9mIFRva2VuaXplclxuICAgKi9cbiAgbG9va2FoZWFkKCk6IExvb2thaGVhZFN0YXRlIHtcbiAgICBjb25zdCBvbGQgPSB0aGlzLnN0YXRlO1xuICAgIC8vIEZvciBwZXJmb3JtYW5jZSB3ZSB1c2UgYSBzaW1waWZpZWQgdG9rZW5pemVyIHN0YXRlIHN0cnVjdHVyZVxuICAgIC8vICRGbG93SWdub3JlXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuY3JlYXRlTG9va2FoZWFkU3RhdGUob2xkKTtcblxuICAgIHRoaXMuaXNMb29rYWhlYWQgPSB0cnVlO1xuICAgIHRoaXMubmV4dFRva2VuKCk7XG4gICAgdGhpcy5pc0xvb2thaGVhZCA9IGZhbHNlO1xuXG4gICAgY29uc3QgY3VyciA9IHRoaXMuc3RhdGU7XG4gICAgdGhpcy5zdGF0ZSA9IG9sZDtcbiAgICByZXR1cm4gY3VycjtcbiAgfVxuXG4gIG5leHRUb2tlblN0YXJ0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubmV4dFRva2VuU3RhcnRTaW5jZSh0aGlzLnN0YXRlLnBvcyk7XG4gIH1cblxuICBuZXh0VG9rZW5TdGFydFNpbmNlKHBvczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBza2lwV2hpdGVTcGFjZS5sYXN0SW5kZXggPSBwb3M7XG4gICAgY29uc3Qgc2tpcCA9IHNraXBXaGl0ZVNwYWNlLmV4ZWModGhpcy5pbnB1dCk7XG4gICAgLy8gJEZsb3dJZ25vcmU6IFRoZSBza2lwV2hpdGVTcGFjZSBlbnN1cmVzIHRvIG1hdGNoIGFueSBzdHJpbmdcbiAgICByZXR1cm4gcG9zICsgc2tpcFswXS5sZW5ndGg7XG4gIH1cblxuICBsb29rYWhlYWRDaGFyQ29kZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5uZXh0VG9rZW5TdGFydCgpKTtcbiAgfVxuXG4gIGNvZGVQb2ludEF0UG9zKHBvczogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAvLyBUaGUgaW1wbGVtZW50YXRpb24gaXMgYmFzZWQgb25cbiAgICAvLyBodHRwczovL3NvdXJjZS5jaHJvbWl1bS5vcmcvY2hyb21pdW0vY2hyb21pdW0vc3JjLysvbWFzdGVyOnY4L3NyYy9idWlsdGlucy9idWlsdGlucy1zdHJpbmctZ2VuLmNjO2w9MTQ1NTtkcmM9MjIxZTMzMWI0OWRmZWZhZGJjNmZhNDBiMGM2OGU2Zjk3NjA2ZDBiMzticHY9MDticHQ9MVxuICAgIC8vIFdlIHJlaW1wbGVtZW50IGBjb2RlUG9pbnRBdGAgYmVjYXVzZSBgY29kZVBvaW50QXRgIGlzIGEgVjggYnVpbHRpbiB3aGljaCBpcyBub3QgaW5saW5lZCBieSBUdXJib0ZhbiAoYXMgb2YgTTkxKVxuICAgIC8vIHNpbmNlIGBpbnB1dGAgaXMgbW9zdGx5IEFTQ0lJLCBhbiBpbmxpbmVkIGBjaGFyQ29kZUF0YCB3aW5zIGhlcmVcbiAgICBsZXQgY3AgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQocG9zKTtcbiAgICBpZiAoKGNwICYgMHhmYzAwKSA9PT0gMHhkODAwICYmICsrcG9zIDwgdGhpcy5pbnB1dC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHRyYWlsID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHBvcyk7XG4gICAgICBpZiAoKHRyYWlsICYgMHhmYzAwKSA9PT0gMHhkYzAwKSB7XG4gICAgICAgIGNwID0gMHgxMDAwMCArICgoY3AgJiAweDNmZikgPDwgMTApICsgKHRyYWlsICYgMHgzZmYpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3A7XG4gIH1cblxuICAvLyBUb2dnbGUgc3RyaWN0IG1vZGUuIFJlLXJlYWRzIHRoZSBuZXh0IG51bWJlciBvciBzdHJpbmcgdG8gcGxlYXNlXG4gIC8vIHBlZGFudGljIHRlc3RzIChgXCJ1c2Ugc3RyaWN0XCI7IDAxMDtgIHNob3VsZCBmYWlsKS5cblxuICBzZXRTdHJpY3Qoc3RyaWN0OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZS5zdHJpY3QgPSBzdHJpY3Q7XG4gICAgaWYgKHN0cmljdCkge1xuICAgICAgLy8gVGhyb3cgYW4gZXJyb3IgZm9yIGFueSBzdHJpbmcgZGVjaW1hbCBlc2NhcGUgZm91bmQgYmVmb3JlL2ltbWVkaWF0ZWx5XG4gICAgICAvLyBhZnRlciBhIFwidXNlIHN0cmljdFwiIGRpcmVjdGl2ZS4gU3RyaWN0IG1vZGUgd2lsbCBiZSBzZXQgYXQgcGFyc2VcbiAgICAgIC8vIHRpbWUgZm9yIGFueSBsaXRlcmFscyB0aGF0IG9jY3VyIGFmdGVyIHRoZSBuZXh0IG5vZGUgb2YgdGhlIHN0cmljdFxuICAgICAgLy8gZGlyZWN0aXZlLlxuICAgICAgdGhpcy5zdGF0ZS5zdHJpY3RFcnJvcnMuZm9yRWFjaCgobWVzc2FnZSwgcG9zKSA9PlxuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAYmFiZWwvZGV2ZWxvcG1lbnQtaW50ZXJuYWwvZHJ5LWVycm9yLW1lc3NhZ2VzICovXG4gICAgICAgIHRoaXMucmFpc2UocG9zLCBtZXNzYWdlKSxcbiAgICAgICk7XG4gICAgICB0aGlzLnN0YXRlLnN0cmljdEVycm9ycy5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIGN1ckNvbnRleHQoKTogVG9rQ29udGV4dCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY29udGV4dFt0aGlzLnN0YXRlLmNvbnRleHQubGVuZ3RoIC0gMV07XG4gIH1cblxuICAvLyBSZWFkIGEgc2luZ2xlIHRva2VuLCB1cGRhdGluZyB0aGUgcGFyc2VyIG9iamVjdCdzIHRva2VuLXJlbGF0ZWRcbiAgLy8gcHJvcGVydGllcy5cblxuICBuZXh0VG9rZW4oKTogdm9pZCB7XG4gICAgY29uc3QgY3VyQ29udGV4dCA9IHRoaXMuY3VyQ29udGV4dCgpO1xuICAgIGlmICghY3VyQ29udGV4dC5wcmVzZXJ2ZVNwYWNlKSB0aGlzLnNraXBTcGFjZSgpO1xuICAgIHRoaXMuc3RhdGUuc3RhcnQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICBpZiAoIXRoaXMuaXNMb29rYWhlYWQpIHRoaXMuc3RhdGUuc3RhcnRMb2MgPSB0aGlzLnN0YXRlLmN1clBvc2l0aW9uKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUucG9zID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LmVvZik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGN1ckNvbnRleHQgPT09IGN0LnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnJlYWRUbXBsVG9rZW4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nZXRUb2tlbkZyb21Db2RlKHRoaXMuY29kZVBvaW50QXRQb3ModGhpcy5zdGF0ZS5wb3MpKTtcbiAgICB9XG4gIH1cblxuICBwdXNoQ29tbWVudChcbiAgICBibG9jazogYm9vbGVhbixcbiAgICB0ZXh0OiBzdHJpbmcsXG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBlbmQ6IG51bWJlcixcbiAgICBzdGFydExvYzogUG9zaXRpb24sXG4gICAgZW5kTG9jOiBQb3NpdGlvbixcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY29tbWVudCA9IHtcbiAgICAgIHR5cGU6IGJsb2NrID8gXCJDb21tZW50QmxvY2tcIiA6IFwiQ29tbWVudExpbmVcIixcbiAgICAgIHZhbHVlOiB0ZXh0LFxuICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgZW5kOiBlbmQsXG4gICAgICBsb2M6IG5ldyBTb3VyY2VMb2NhdGlvbihzdGFydExvYywgZW5kTG9jKSxcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy50b2tlbnMpIHRoaXMucHVzaFRva2VuKGNvbW1lbnQpO1xuICAgIHRoaXMuc3RhdGUuY29tbWVudHMucHVzaChjb21tZW50KTtcbiAgICB0aGlzLmFkZENvbW1lbnQoY29tbWVudCk7XG4gIH1cblxuICBza2lwQmxvY2tDb21tZW50KCk6IHZvaWQge1xuICAgIGxldCBzdGFydExvYztcbiAgICBpZiAoIXRoaXMuaXNMb29rYWhlYWQpIHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5jdXJQb3NpdGlvbigpO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgY29uc3QgZW5kID0gdGhpcy5pbnB1dC5pbmRleE9mKFwiKi9cIiwgdGhpcy5zdGF0ZS5wb3MgKyAyKTtcbiAgICBpZiAoZW5kID09PSAtMSkgdGhyb3cgdGhpcy5yYWlzZShzdGFydCwgRXJyb3JzLlVudGVybWluYXRlZENvbW1lbnQpO1xuXG4gICAgdGhpcy5zdGF0ZS5wb3MgPSBlbmQgKyAyO1xuICAgIGxpbmVCcmVha0cubGFzdEluZGV4ID0gc3RhcnQ7XG4gICAgbGV0IG1hdGNoO1xuICAgIHdoaWxlIChcbiAgICAgIChtYXRjaCA9IGxpbmVCcmVha0cuZXhlYyh0aGlzLmlucHV0KSkgJiZcbiAgICAgIG1hdGNoLmluZGV4IDwgdGhpcy5zdGF0ZS5wb3NcbiAgICApIHtcbiAgICAgICsrdGhpcy5zdGF0ZS5jdXJMaW5lO1xuICAgICAgdGhpcy5zdGF0ZS5saW5lU3RhcnQgPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBhcmUgZG9pbmcgYSBsb29rYWhlYWQgcmlnaHQgbm93IHdlIG5lZWQgdG8gYWR2YW5jZSB0aGUgcG9zaXRpb24gKGFib3ZlIGNvZGUpXG4gICAgLy8gYnV0IHdlIGRvIG5vdCB3YW50IHRvIHB1c2ggdGhlIGNvbW1lbnQgdG8gdGhlIHN0YXRlLlxuICAgIGlmICh0aGlzLmlzTG9va2FoZWFkKSByZXR1cm47XG4gICAgLyo6OiBpbnZhcmlhbnQoc3RhcnRMb2MpICovXG5cbiAgICB0aGlzLnB1c2hDb21tZW50KFxuICAgICAgdHJ1ZSxcbiAgICAgIHRoaXMuaW5wdXQuc2xpY2Uoc3RhcnQgKyAyLCBlbmQpLFxuICAgICAgc3RhcnQsXG4gICAgICB0aGlzLnN0YXRlLnBvcyxcbiAgICAgIHN0YXJ0TG9jLFxuICAgICAgdGhpcy5zdGF0ZS5jdXJQb3NpdGlvbigpLFxuICAgICk7XG4gIH1cblxuICBza2lwTGluZUNvbW1lbnQoc3RhcnRTa2lwOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhdGUucG9zO1xuICAgIGxldCBzdGFydExvYztcbiAgICBpZiAoIXRoaXMuaXNMb29rYWhlYWQpIHN0YXJ0TG9jID0gdGhpcy5zdGF0ZS5jdXJQb3NpdGlvbigpO1xuICAgIGxldCBjaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCgodGhpcy5zdGF0ZS5wb3MgKz0gc3RhcnRTa2lwKSk7XG4gICAgaWYgKHRoaXMuc3RhdGUucG9zIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgIHdoaWxlICghaXNOZXdMaW5lKGNoKSAmJiArK3RoaXMuc3RhdGUucG9zIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgY2ggPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHdlIGFyZSBkb2luZyBhIGxvb2thaGVhZCByaWdodCBub3cgd2UgbmVlZCB0byBhZHZhbmNlIHRoZSBwb3NpdGlvbiAoYWJvdmUgY29kZSlcbiAgICAvLyBidXQgd2UgZG8gbm90IHdhbnQgdG8gcHVzaCB0aGUgY29tbWVudCB0byB0aGUgc3RhdGUuXG4gICAgaWYgKHRoaXMuaXNMb29rYWhlYWQpIHJldHVybjtcbiAgICAvKjo6IGludmFyaWFudChzdGFydExvYykgKi9cblxuICAgIHRoaXMucHVzaENvbW1lbnQoXG4gICAgICBmYWxzZSxcbiAgICAgIHRoaXMuaW5wdXQuc2xpY2Uoc3RhcnQgKyBzdGFydFNraXAsIHRoaXMuc3RhdGUucG9zKSxcbiAgICAgIHN0YXJ0LFxuICAgICAgdGhpcy5zdGF0ZS5wb3MsXG4gICAgICBzdGFydExvYyxcbiAgICAgIHRoaXMuc3RhdGUuY3VyUG9zaXRpb24oKSxcbiAgICApO1xuICB9XG5cbiAgLy8gQ2FsbGVkIGF0IHRoZSBzdGFydCBvZiB0aGUgcGFyc2UgYW5kIGFmdGVyIGV2ZXJ5IHRva2VuLiBTa2lwc1xuICAvLyB3aGl0ZXNwYWNlIGFuZCBjb21tZW50cywgYW5kLlxuXG4gIHNraXBTcGFjZSgpOiB2b2lkIHtcbiAgICBsb29wOiB3aGlsZSAodGhpcy5zdGF0ZS5wb3MgPCB0aGlzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2ggPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgc3dpdGNoIChjaCkge1xuICAgICAgICBjYXNlIGNoYXJDb2Rlcy5zcGFjZTpcbiAgICAgICAgY2FzZSBjaGFyQ29kZXMubm9uQnJlYWtpbmdTcGFjZTpcbiAgICAgICAgY2FzZSBjaGFyQ29kZXMudGFiOlxuICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgY2hhckNvZGVzLmNhcnJpYWdlUmV0dXJuOlxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpID09PSBjaGFyQ29kZXMubGluZUZlZWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgfVxuICAgICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICAgICAgY2FzZSBjaGFyQ29kZXMubGluZUZlZWQ6XG4gICAgICAgIGNhc2UgY2hhckNvZGVzLmxpbmVTZXBhcmF0b3I6XG4gICAgICAgIGNhc2UgY2hhckNvZGVzLnBhcmFncmFwaFNlcGFyYXRvcjpcbiAgICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICAgICsrdGhpcy5zdGF0ZS5jdXJMaW5lO1xuICAgICAgICAgIHRoaXMuc3RhdGUubGluZVN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBjaGFyQ29kZXMuc2xhc2g6XG4gICAgICAgICAgc3dpdGNoICh0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKSkge1xuICAgICAgICAgICAgY2FzZSBjaGFyQ29kZXMuYXN0ZXJpc2s6XG4gICAgICAgICAgICAgIHRoaXMuc2tpcEJsb2NrQ29tbWVudCgpO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBjaGFyQ29kZXMuc2xhc2g6XG4gICAgICAgICAgICAgIHRoaXMuc2tpcExpbmVDb21tZW50KDIpO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGNoKSkge1xuICAgICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2FsbGVkIGF0IHRoZSBlbmQgb2YgZXZlcnkgdG9rZW4uIFNldHMgYGVuZGAsIGB2YWxgLCBhbmRcbiAgLy8gbWFpbnRhaW5zIGBjb250ZXh0YCBhbmQgYGV4cHJBbGxvd2VkYCwgYW5kIHNraXBzIHRoZSBzcGFjZSBhZnRlclxuICAvLyB0aGUgdG9rZW4sIHNvIHRoYXQgdGhlIG5leHQgb25lJ3MgYHN0YXJ0YCB3aWxsIHBvaW50IGF0IHRoZVxuICAvLyByaWdodCBwb3NpdGlvbi5cblxuICBmaW5pc2hUb2tlbih0eXBlOiBUb2tlblR5cGUsIHZhbDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZS5lbmQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICBjb25zdCBwcmV2VHlwZSA9IHRoaXMuc3RhdGUudHlwZTtcbiAgICB0aGlzLnN0YXRlLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuc3RhdGUudmFsdWUgPSB2YWw7XG5cbiAgICBpZiAoIXRoaXMuaXNMb29rYWhlYWQpIHtcbiAgICAgIHRoaXMuc3RhdGUuZW5kTG9jID0gdGhpcy5zdGF0ZS5jdXJQb3NpdGlvbigpO1xuICAgICAgdGhpcy51cGRhdGVDb250ZXh0KHByZXZUeXBlKTtcbiAgICB9XG4gIH1cblxuICAvLyAjIyMgVG9rZW4gcmVhZGluZ1xuXG4gIC8vIFRoaXMgaXMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHRvIGZldGNoIHRoZSBuZXh0IHRva2VuLiBJdFxuICAvLyBpcyBzb21ld2hhdCBvYnNjdXJlLCBiZWNhdXNlIGl0IHdvcmtzIGluIGNoYXJhY3RlciBjb2RlcyByYXRoZXJcbiAgLy8gdGhhbiBjaGFyYWN0ZXJzLCBhbmQgYmVjYXVzZSBvcGVyYXRvciBwYXJzaW5nIGhhcyBiZWVuIGlubGluZWRcbiAgLy8gaW50byBpdC5cbiAgLy9cbiAgLy8gQWxsIGluIHRoZSBuYW1lIG9mIHNwZWVkLlxuXG4gIC8vIG51bWJlciBzaWduIGlzIFwiI1wiXG4gIHJlYWRUb2tlbl9udW1iZXJTaWduKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0YXRlLnBvcyA9PT0gMCAmJiB0aGlzLnJlYWRUb2tlbl9pbnRlcnByZXRlcigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dFBvcyA9IHRoaXMuc3RhdGUucG9zICsgMTtcbiAgICBjb25zdCBuZXh0ID0gdGhpcy5jb2RlUG9pbnRBdFBvcyhuZXh0UG9zKTtcbiAgICBpZiAobmV4dCA+PSBjaGFyQ29kZXMuZGlnaXQwICYmIG5leHQgPD0gY2hhckNvZGVzLmRpZ2l0OSkge1xuICAgICAgdGhyb3cgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRXJyb3JzLlVuZXhwZWN0ZWREaWdpdEFmdGVySGFzaCk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgbmV4dCA9PT0gY2hhckNvZGVzLmxlZnRDdXJseUJyYWNlIHx8XG4gICAgICAobmV4dCA9PT0gY2hhckNvZGVzLmxlZnRTcXVhcmVCcmFja2V0ICYmIHRoaXMuaGFzUGx1Z2luKFwicmVjb3JkQW5kVHVwbGVcIikpXG4gICAgKSB7XG4gICAgICAvLyBXaGVuIHdlIHNlZSBgI3tgLCBpdCBpcyBsaWtlbHkgdG8gYmUgYSBoYXNoIHJlY29yZC5cbiAgICAgIC8vIEhvd2V2ZXIgd2UgZG9uJ3QgeWVsbCBhdCBgI1tgIHNpbmNlIHVzZXJzIG1heSBpbnRlbmQgdG8gdXNlIFwiY29tcHV0ZWQgcHJpdmF0ZSBmaWVsZHNcIixcbiAgICAgIC8vIHdoaWNoIGlzIG5vdCBhbGxvd2VkIGluIHRoZSBzcGVjLiBUaHJvd2luZyBleHBlY3RpbmcgcmVjb3JkQW5kVHVwbGUgaXNcbiAgICAgIC8vIG1pc2xlYWRpbmdcbiAgICAgIHRoaXMuZXhwZWN0UGx1Z2luKFwicmVjb3JkQW5kVHVwbGVcIik7XG4gICAgICBpZiAodGhpcy5nZXRQbHVnaW5PcHRpb24oXCJyZWNvcmRBbmRUdXBsZVwiLCBcInN5bnRheFR5cGVcIikgIT09IFwiaGFzaFwiKSB7XG4gICAgICAgIHRocm93IHRoaXMucmFpc2UoXG4gICAgICAgICAgdGhpcy5zdGF0ZS5wb3MsXG4gICAgICAgICAgbmV4dCA9PT0gY2hhckNvZGVzLmxlZnRDdXJseUJyYWNlXG4gICAgICAgICAgICA/IEVycm9ycy5SZWNvcmRFeHByZXNzaW9uSGFzaEluY29ycmVjdFN0YXJ0U3ludGF4VHlwZVxuICAgICAgICAgICAgOiBFcnJvcnMuVHVwbGVFeHByZXNzaW9uSGFzaEluY29ycmVjdFN0YXJ0U3ludGF4VHlwZSxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGF0ZS5wb3MgKz0gMjtcbiAgICAgIGlmIChuZXh0ID09PSBjaGFyQ29kZXMubGVmdEN1cmx5QnJhY2UpIHtcbiAgICAgICAgLy8gI3tcbiAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5icmFjZUhhc2hMKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICNbXG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuYnJhY2tldEhhc2hMKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzSWRlbnRpZmllclN0YXJ0KG5leHQpKSB7XG4gICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5wcml2YXRlTmFtZSwgdGhpcy5yZWFkV29yZDEobmV4dCkpO1xuICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gY2hhckNvZGVzLmJhY2tzbGFzaCkge1xuICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQucHJpdmF0ZU5hbWUsIHRoaXMucmVhZFdvcmQxKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbmlzaE9wKHR0Lmhhc2gsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHJlYWRUb2tlbl9kb3QoKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpO1xuICAgIGlmIChuZXh0ID49IGNoYXJDb2Rlcy5kaWdpdDAgJiYgbmV4dCA8PSBjaGFyQ29kZXMuZGlnaXQ5KSB7XG4gICAgICB0aGlzLnJlYWROdW1iZXIodHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgbmV4dCA9PT0gY2hhckNvZGVzLmRvdCAmJlxuICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMikgPT09IGNoYXJDb2Rlcy5kb3RcbiAgICApIHtcbiAgICAgIHRoaXMuc3RhdGUucG9zICs9IDM7XG4gICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LmVsbGlwc2lzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuZG90KTtcbiAgICB9XG4gIH1cblxuICByZWFkVG9rZW5fc2xhc2goKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpO1xuICAgIGlmIChuZXh0ID09PSBjaGFyQ29kZXMuZXF1YWxzVG8pIHtcbiAgICAgIHRoaXMuZmluaXNoT3AodHQuc2xhc2hBc3NpZ24sIDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbmlzaE9wKHR0LnNsYXNoLCAxKTtcbiAgICB9XG4gIH1cblxuICByZWFkVG9rZW5faW50ZXJwcmV0ZXIoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuc3RhdGUucG9zICE9PSAwIHx8IHRoaXMubGVuZ3RoIDwgMikgcmV0dXJuIGZhbHNlO1xuXG4gICAgbGV0IGNoID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSk7XG4gICAgaWYgKGNoICE9PSBjaGFyQ29kZXMuZXhjbGFtYXRpb25NYXJrKSByZXR1cm4gZmFsc2U7XG5cbiAgICBjb25zdCBzdGFydCA9IHRoaXMuc3RhdGUucG9zO1xuICAgIHRoaXMuc3RhdGUucG9zICs9IDE7XG5cbiAgICB3aGlsZSAoIWlzTmV3TGluZShjaCkgJiYgKyt0aGlzLnN0YXRlLnBvcyA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICBjaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmlucHV0LnNsaWNlKHN0YXJ0ICsgMiwgdGhpcy5zdGF0ZS5wb3MpO1xuXG4gICAgdGhpcy5maW5pc2hUb2tlbih0dC5pbnRlcnByZXRlckRpcmVjdGl2ZSwgdmFsdWUpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZWFkVG9rZW5fbXVsdF9tb2R1bG8oY29kZTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gJyUqJ1xuICAgIGxldCB0eXBlID0gY29kZSA9PT0gY2hhckNvZGVzLmFzdGVyaXNrID8gdHQuc3RhciA6IHR0Lm1vZHVsbztcbiAgICBsZXQgd2lkdGggPSAxO1xuICAgIGxldCBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSk7XG5cbiAgICAvLyBFeHBvbmVudGlhdGlvbiBvcGVyYXRvciAqKlxuICAgIGlmIChjb2RlID09PSBjaGFyQ29kZXMuYXN0ZXJpc2sgJiYgbmV4dCA9PT0gY2hhckNvZGVzLmFzdGVyaXNrKSB7XG4gICAgICB3aWR0aCsrO1xuICAgICAgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDIpO1xuICAgICAgdHlwZSA9IHR0LmV4cG9uZW50O1xuICAgIH1cblxuICAgIGlmIChuZXh0ID09PSBjaGFyQ29kZXMuZXF1YWxzVG8gJiYgIXRoaXMuc3RhdGUuaW5UeXBlKSB7XG4gICAgICB3aWR0aCsrO1xuICAgICAgdHlwZSA9IHR0LmFzc2lnbjtcbiAgICB9XG5cbiAgICB0aGlzLmZpbmlzaE9wKHR5cGUsIHdpZHRoKTtcbiAgfVxuXG4gIHJlYWRUb2tlbl9waXBlX2FtcChjb2RlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyAnfHwnICcmJicgJ3x8PScgJyYmPSdcbiAgICBjb25zdCBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSk7XG5cbiAgICBpZiAobmV4dCA9PT0gY29kZSkge1xuICAgICAgaWYgKHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDIpID09PSBjaGFyQ29kZXMuZXF1YWxzVG8pIHtcbiAgICAgICAgdGhpcy5maW5pc2hPcCh0dC5hc3NpZ24sIDMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maW5pc2hPcChcbiAgICAgICAgICBjb2RlID09PSBjaGFyQ29kZXMudmVydGljYWxCYXIgPyB0dC5sb2dpY2FsT1IgOiB0dC5sb2dpY2FsQU5ELFxuICAgICAgICAgIDIsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvZGUgPT09IGNoYXJDb2Rlcy52ZXJ0aWNhbEJhcikge1xuICAgICAgLy8gJ3w+J1xuICAgICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5ncmVhdGVyVGhhbikge1xuICAgICAgICB0aGlzLmZpbmlzaE9wKHR0LnBpcGVsaW5lLCAyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gJ3x9J1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmhhc1BsdWdpbihcInJlY29yZEFuZFR1cGxlXCIpICYmXG4gICAgICAgIG5leHQgPT09IGNoYXJDb2Rlcy5yaWdodEN1cmx5QnJhY2VcbiAgICAgICkge1xuICAgICAgICBpZiAodGhpcy5nZXRQbHVnaW5PcHRpb24oXCJyZWNvcmRBbmRUdXBsZVwiLCBcInN5bnRheFR5cGVcIikgIT09IFwiYmFyXCIpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MsXG4gICAgICAgICAgICBFcnJvcnMuUmVjb3JkRXhwcmVzc2lvbkJhckluY29ycmVjdEVuZFN5bnRheFR5cGUsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlLnBvcyArPSAyO1xuICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LmJyYWNlQmFyUik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gJ3xdJ1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLmhhc1BsdWdpbihcInJlY29yZEFuZFR1cGxlXCIpICYmXG4gICAgICAgIG5leHQgPT09IGNoYXJDb2Rlcy5yaWdodFNxdWFyZUJyYWNrZXRcbiAgICAgICkge1xuICAgICAgICBpZiAodGhpcy5nZXRQbHVnaW5PcHRpb24oXCJyZWNvcmRBbmRUdXBsZVwiLCBcInN5bnRheFR5cGVcIikgIT09IFwiYmFyXCIpIHtcbiAgICAgICAgICB0aHJvdyB0aGlzLnJhaXNlKFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MsXG4gICAgICAgICAgICBFcnJvcnMuVHVwbGVFeHByZXNzaW9uQmFySW5jb3JyZWN0RW5kU3ludGF4VHlwZSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUucG9zICs9IDI7XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuYnJhY2tldEJhclIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5lcXVhbHNUbykge1xuICAgICAgdGhpcy5maW5pc2hPcCh0dC5hc3NpZ24sIDIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZmluaXNoT3AoXG4gICAgICBjb2RlID09PSBjaGFyQ29kZXMudmVydGljYWxCYXIgPyB0dC5iaXR3aXNlT1IgOiB0dC5iaXR3aXNlQU5ELFxuICAgICAgMSxcbiAgICApO1xuICB9XG5cbiAgcmVhZFRva2VuX2NhcmV0KCk6IHZvaWQge1xuICAgIC8vICdeJ1xuICAgIGNvbnN0IG5leHQgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKTtcbiAgICBpZiAobmV4dCA9PT0gY2hhckNvZGVzLmVxdWFsc1RvKSB7XG4gICAgICB0aGlzLmZpbmlzaE9wKHR0LmFzc2lnbiwgMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmluaXNoT3AodHQuYml0d2lzZVhPUiwgMSk7XG4gICAgfVxuICB9XG5cbiAgcmVhZFRva2VuX3BsdXNfbWluKGNvZGU6IG51bWJlcik6IHZvaWQge1xuICAgIC8vICcrLSdcbiAgICBjb25zdCBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSk7XG5cbiAgICBpZiAobmV4dCA9PT0gY29kZSkge1xuICAgICAgaWYgKFxuICAgICAgICBuZXh0ID09PSBjaGFyQ29kZXMuZGFzaCAmJlxuICAgICAgICAhdGhpcy5pbk1vZHVsZSAmJlxuICAgICAgICB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAyKSA9PT0gY2hhckNvZGVzLmdyZWF0ZXJUaGFuICYmXG4gICAgICAgICh0aGlzLnN0YXRlLmxhc3RUb2tFbmQgPT09IDAgfHwgdGhpcy5oYXNQcmVjZWRpbmdMaW5lQnJlYWsoKSlcbiAgICAgICkge1xuICAgICAgICAvLyBBIGAtLT5gIGxpbmUgY29tbWVudFxuICAgICAgICB0aGlzLnNraXBMaW5lQ29tbWVudCgzKTtcbiAgICAgICAgdGhpcy5za2lwU3BhY2UoKTtcbiAgICAgICAgdGhpcy5uZXh0VG9rZW4oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5maW5pc2hPcCh0dC5pbmNEZWMsIDIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZXh0ID09PSBjaGFyQ29kZXMuZXF1YWxzVG8pIHtcbiAgICAgIHRoaXMuZmluaXNoT3AodHQuYXNzaWduLCAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maW5pc2hPcCh0dC5wbHVzTWluLCAxKTtcbiAgICB9XG4gIH1cblxuICByZWFkVG9rZW5fbHRfZ3QoY29kZTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gJzw+J1xuICAgIGNvbnN0IG5leHQgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKTtcbiAgICBsZXQgc2l6ZSA9IDE7XG5cbiAgICBpZiAobmV4dCA9PT0gY29kZSkge1xuICAgICAgc2l6ZSA9XG4gICAgICAgIGNvZGUgPT09IGNoYXJDb2Rlcy5ncmVhdGVyVGhhbiAmJlxuICAgICAgICB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAyKSA9PT0gY2hhckNvZGVzLmdyZWF0ZXJUaGFuXG4gICAgICAgICAgPyAzXG4gICAgICAgICAgOiAyO1xuICAgICAgaWYgKHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIHNpemUpID09PSBjaGFyQ29kZXMuZXF1YWxzVG8pIHtcbiAgICAgICAgdGhpcy5maW5pc2hPcCh0dC5hc3NpZ24sIHNpemUgKyAxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5maW5pc2hPcCh0dC5iaXRTaGlmdCwgc2l6ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgbmV4dCA9PT0gY2hhckNvZGVzLmV4Y2xhbWF0aW9uTWFyayAmJlxuICAgICAgY29kZSA9PT0gY2hhckNvZGVzLmxlc3NUaGFuICYmXG4gICAgICAhdGhpcy5pbk1vZHVsZSAmJlxuICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMikgPT09IGNoYXJDb2Rlcy5kYXNoICYmXG4gICAgICB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAzKSA9PT0gY2hhckNvZGVzLmRhc2hcbiAgICApIHtcbiAgICAgIC8vIGA8IS0tYCwgYW4gWE1MLXN0eWxlIGNvbW1lbnQgdGhhdCBzaG91bGQgYmUgaW50ZXJwcmV0ZWQgYXMgYSBsaW5lIGNvbW1lbnRcbiAgICAgIHRoaXMuc2tpcExpbmVDb21tZW50KDQpO1xuICAgICAgdGhpcy5za2lwU3BhY2UoKTtcbiAgICAgIHRoaXMubmV4dFRva2VuKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5lcXVhbHNUbykge1xuICAgICAgLy8gPD0gfCA+PVxuICAgICAgc2l6ZSA9IDI7XG4gICAgfVxuXG4gICAgdGhpcy5maW5pc2hPcCh0dC5yZWxhdGlvbmFsLCBzaXplKTtcbiAgfVxuXG4gIHJlYWRUb2tlbl9lcV9leGNsKGNvZGU6IG51bWJlcik6IHZvaWQge1xuICAgIC8vICc9ISdcbiAgICBjb25zdCBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSk7XG4gICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5lcXVhbHNUbykge1xuICAgICAgdGhpcy5maW5pc2hPcChcbiAgICAgICAgdHQuZXF1YWxpdHksXG4gICAgICAgIHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDIpID09PSBjaGFyQ29kZXMuZXF1YWxzVG9cbiAgICAgICAgICA/IDNcbiAgICAgICAgICA6IDIsXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29kZSA9PT0gY2hhckNvZGVzLmVxdWFsc1RvICYmIG5leHQgPT09IGNoYXJDb2Rlcy5ncmVhdGVyVGhhbikge1xuICAgICAgLy8gJz0+J1xuICAgICAgdGhpcy5zdGF0ZS5wb3MgKz0gMjtcbiAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuYXJyb3cpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmZpbmlzaE9wKGNvZGUgPT09IGNoYXJDb2Rlcy5lcXVhbHNUbyA/IHR0LmVxIDogdHQuYmFuZywgMSk7XG4gIH1cblxuICByZWFkVG9rZW5fcXVlc3Rpb24oKTogdm9pZCB7XG4gICAgLy8gJz8nXG4gICAgY29uc3QgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpO1xuICAgIGNvbnN0IG5leHQyID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMik7XG4gICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5xdWVzdGlvbk1hcmspIHtcbiAgICAgIGlmIChuZXh0MiA9PT0gY2hhckNvZGVzLmVxdWFsc1RvKSB7XG4gICAgICAgIC8vICc/Pz0nXG4gICAgICAgIHRoaXMuZmluaXNoT3AodHQuYXNzaWduLCAzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICc/PydcbiAgICAgICAgdGhpcy5maW5pc2hPcCh0dC5udWxsaXNoQ29hbGVzY2luZywgMik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG5leHQgPT09IGNoYXJDb2Rlcy5kb3QgJiZcbiAgICAgICEobmV4dDIgPj0gY2hhckNvZGVzLmRpZ2l0MCAmJiBuZXh0MiA8PSBjaGFyQ29kZXMuZGlnaXQ5KVxuICAgICkge1xuICAgICAgLy8gJy4nIG5vdCBmb2xsb3dlZCBieSBhIG51bWJlclxuICAgICAgdGhpcy5zdGF0ZS5wb3MgKz0gMjtcbiAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQucXVlc3Rpb25Eb3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5xdWVzdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZ2V0VG9rZW5Gcm9tQ29kZShjb2RlOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKGNvZGUpIHtcbiAgICAgIC8vIFRoZSBpbnRlcnByZXRhdGlvbiBvZiBhIGRvdCBkZXBlbmRzIG9uIHdoZXRoZXIgaXQgaXMgZm9sbG93ZWRcbiAgICAgIC8vIGJ5IGEgZGlnaXQgb3IgYW5vdGhlciB0d28gZG90cy5cblxuICAgICAgY2FzZSBjaGFyQ29kZXMuZG90OlxuICAgICAgICB0aGlzLnJlYWRUb2tlbl9kb3QoKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyBQdW5jdHVhdGlvbiB0b2tlbnMuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5sZWZ0UGFyZW50aGVzaXM6XG4gICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQucGFyZW5MKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBjaGFyQ29kZXMucmlnaHRQYXJlbnRoZXNpczpcbiAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5wYXJlblIpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIGNoYXJDb2Rlcy5zZW1pY29sb246XG4gICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuc2VtaSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgY2hhckNvZGVzLmNvbW1hOlxuICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LmNvbW1hKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBjaGFyQ29kZXMubGVmdFNxdWFyZUJyYWNrZXQ6XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmhhc1BsdWdpbihcInJlY29yZEFuZFR1cGxlXCIpICYmXG4gICAgICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSkgPT09IGNoYXJDb2Rlcy52ZXJ0aWNhbEJhclxuICAgICAgICApIHtcbiAgICAgICAgICBpZiAodGhpcy5nZXRQbHVnaW5PcHRpb24oXCJyZWNvcmRBbmRUdXBsZVwiLCBcInN5bnRheFR5cGVcIikgIT09IFwiYmFyXCIpIHtcbiAgICAgICAgICAgIHRocm93IHRoaXMucmFpc2UoXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUucG9zLFxuICAgICAgICAgICAgICBFcnJvcnMuVHVwbGVFeHByZXNzaW9uQmFySW5jb3JyZWN0U3RhcnRTeW50YXhUeXBlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBbfFxuICAgICAgICAgIHRoaXMuc3RhdGUucG9zICs9IDI7XG4gICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5icmFja2V0QmFyTCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LmJyYWNrZXRMKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIGNoYXJDb2Rlcy5yaWdodFNxdWFyZUJyYWNrZXQ6XG4gICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuYnJhY2tldFIpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIGNoYXJDb2Rlcy5sZWZ0Q3VybHlCcmFjZTpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuaGFzUGx1Z2luKFwicmVjb3JkQW5kVHVwbGVcIikgJiZcbiAgICAgICAgICB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKSA9PT0gY2hhckNvZGVzLnZlcnRpY2FsQmFyXG4gICAgICAgICkge1xuICAgICAgICAgIGlmICh0aGlzLmdldFBsdWdpbk9wdGlvbihcInJlY29yZEFuZFR1cGxlXCIsIFwic3ludGF4VHlwZVwiKSAhPT0gXCJiYXJcIikge1xuICAgICAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MsXG4gICAgICAgICAgICAgIEVycm9ycy5SZWNvcmRFeHByZXNzaW9uQmFySW5jb3JyZWN0U3RhcnRTeW50YXhUeXBlLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyB7fFxuICAgICAgICAgIHRoaXMuc3RhdGUucG9zICs9IDI7XG4gICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5icmFjZUJhckwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5icmFjZUwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgY2hhckNvZGVzLnJpZ2h0Q3VybHlCcmFjZTpcbiAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5icmFjZVIpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNhc2UgY2hhckNvZGVzLmNvbG9uOlxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5oYXNQbHVnaW4oXCJmdW5jdGlvbkJpbmRcIikgJiZcbiAgICAgICAgICB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgKyAxKSA9PT0gY2hhckNvZGVzLmNvbG9uXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuZmluaXNoT3AodHQuZG91YmxlQ29sb24sIDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5jb2xvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5xdWVzdGlvbk1hcms6XG4gICAgICAgIHRoaXMucmVhZFRva2VuX3F1ZXN0aW9uKCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSBjaGFyQ29kZXMuZ3JhdmVBY2NlbnQ6XG4gICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuYmFja1F1b3RlKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5kaWdpdDA6IHtcbiAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpO1xuICAgICAgICAvLyAnMHgnLCAnMFgnIC0gaGV4IG51bWJlclxuICAgICAgICBpZiAobmV4dCA9PT0gY2hhckNvZGVzLmxvd2VyY2FzZVggfHwgbmV4dCA9PT0gY2hhckNvZGVzLnVwcGVyY2FzZVgpIHtcbiAgICAgICAgICB0aGlzLnJlYWRSYWRpeE51bWJlcigxNik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vICcwbycsICcwTycgLSBvY3RhbCBudW1iZXJcbiAgICAgICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5sb3dlcmNhc2VPIHx8IG5leHQgPT09IGNoYXJDb2Rlcy51cHBlcmNhc2VPKSB7XG4gICAgICAgICAgdGhpcy5yZWFkUmFkaXhOdW1iZXIoOCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vICcwYicsICcwQicgLSBiaW5hcnkgbnVtYmVyXG4gICAgICAgIGlmIChuZXh0ID09PSBjaGFyQ29kZXMubG93ZXJjYXNlQiB8fCBuZXh0ID09PSBjaGFyQ29kZXMudXBwZXJjYXNlQikge1xuICAgICAgICAgIHRoaXMucmVhZFJhZGl4TnVtYmVyKDIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQW55dGhpbmcgZWxzZSBiZWdpbm5pbmcgd2l0aCBhIGRpZ2l0IGlzIGFuIGludGVnZXIsIG9jdGFsXG4gICAgICAvLyBudW1iZXIsIG9yIGZsb2F0LiAoZmFsbCB0aHJvdWdoKVxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQxOlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQyOlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQzOlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQ0OlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQ1OlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQ2OlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQ3OlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQ4OlxuICAgICAgY2FzZSBjaGFyQ29kZXMuZGlnaXQ5OlxuICAgICAgICB0aGlzLnJlYWROdW1iZXIoZmFsc2UpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIFF1b3RlcyBwcm9kdWNlIHN0cmluZ3MuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5xdW90YXRpb25NYXJrOlxuICAgICAgY2FzZSBjaGFyQ29kZXMuYXBvc3Ryb3BoZTpcbiAgICAgICAgdGhpcy5yZWFkU3RyaW5nKGNvZGUpO1xuICAgICAgICByZXR1cm47XG5cbiAgICAgIC8vIE9wZXJhdG9ycyBhcmUgcGFyc2VkIGlubGluZSBpbiB0aW55IHN0YXRlIG1hY2hpbmVzLiAnPScgKGNoYXJDb2Rlcy5lcXVhbHNUbykgaXNcbiAgICAgIC8vIG9mdGVuIHJlZmVycmVkIHRvLiBgZmluaXNoT3BgIHNpbXBseSBza2lwcyB0aGUgYW1vdW50IG9mXG4gICAgICAvLyBjaGFyYWN0ZXJzIGl0IGlzIGdpdmVuIGFzIHNlY29uZCBhcmd1bWVudCwgYW5kIHJldHVybnMgYSB0b2tlblxuICAgICAgLy8gb2YgdGhlIHR5cGUgZ2l2ZW4gYnkgaXRzIGZpcnN0IGFyZ3VtZW50LlxuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5zbGFzaDpcbiAgICAgICAgdGhpcy5yZWFkVG9rZW5fc2xhc2goKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5wZXJjZW50U2lnbjpcbiAgICAgIGNhc2UgY2hhckNvZGVzLmFzdGVyaXNrOlxuICAgICAgICB0aGlzLnJlYWRUb2tlbl9tdWx0X21vZHVsbyhjb2RlKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy52ZXJ0aWNhbEJhcjpcbiAgICAgIGNhc2UgY2hhckNvZGVzLmFtcGVyc2FuZDpcbiAgICAgICAgdGhpcy5yZWFkVG9rZW5fcGlwZV9hbXAoY29kZSk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSBjaGFyQ29kZXMuY2FyZXQ6XG4gICAgICAgIHRoaXMucmVhZFRva2VuX2NhcmV0KCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSBjaGFyQ29kZXMucGx1c1NpZ246XG4gICAgICBjYXNlIGNoYXJDb2Rlcy5kYXNoOlxuICAgICAgICB0aGlzLnJlYWRUb2tlbl9wbHVzX21pbihjb2RlKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5sZXNzVGhhbjpcbiAgICAgIGNhc2UgY2hhckNvZGVzLmdyZWF0ZXJUaGFuOlxuICAgICAgICB0aGlzLnJlYWRUb2tlbl9sdF9ndChjb2RlKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5lcXVhbHNUbzpcbiAgICAgIGNhc2UgY2hhckNvZGVzLmV4Y2xhbWF0aW9uTWFyazpcbiAgICAgICAgdGhpcy5yZWFkVG9rZW5fZXFfZXhjbChjb2RlKTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy50aWxkZTpcbiAgICAgICAgdGhpcy5maW5pc2hPcCh0dC50aWxkZSwgMSk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSBjaGFyQ29kZXMuYXRTaWduOlxuICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LmF0KTtcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5udW1iZXJTaWduOlxuICAgICAgICB0aGlzLnJlYWRUb2tlbl9udW1iZXJTaWduKCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgY2FzZSBjaGFyQ29kZXMuYmFja3NsYXNoOlxuICAgICAgICB0aGlzLnJlYWRXb3JkKCk7XG4gICAgICAgIHJldHVybjtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KGNvZGUpKSB7XG4gICAgICAgICAgdGhpcy5yZWFkV29yZChjb2RlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyB0aGlzLnJhaXNlKFxuICAgICAgdGhpcy5zdGF0ZS5wb3MsXG4gICAgICBFcnJvcnMuSW52YWxpZE9yVW5leHBlY3RlZFRva2VuLFxuICAgICAgU3RyaW5nLmZyb21Db2RlUG9pbnQoY29kZSksXG4gICAgKTtcbiAgfVxuXG4gIGZpbmlzaE9wKHR5cGU6IFRva2VuVHlwZSwgc2l6ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qgc3RyID0gdGhpcy5pbnB1dC5zbGljZSh0aGlzLnN0YXRlLnBvcywgdGhpcy5zdGF0ZS5wb3MgKyBzaXplKTtcbiAgICB0aGlzLnN0YXRlLnBvcyArPSBzaXplO1xuICAgIHRoaXMuZmluaXNoVG9rZW4odHlwZSwgc3RyKTtcbiAgfVxuXG4gIHJlYWRSZWdleHAoKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXRlLnN0YXJ0ICsgMTtcbiAgICBsZXQgZXNjYXBlZCwgaW5DbGFzcztcbiAgICBsZXQgeyBwb3MgfSA9IHRoaXMuc3RhdGU7XG4gICAgZm9yICg7IDsgKytwb3MpIHtcbiAgICAgIGlmIChwb3MgPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShzdGFydCwgRXJyb3JzLlVudGVybWluYXRlZFJlZ0V4cCk7XG4gICAgICB9XG4gICAgICBjb25zdCBjaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdChwb3MpO1xuICAgICAgaWYgKGlzTmV3TGluZShjaCkpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5yYWlzZShzdGFydCwgRXJyb3JzLlVudGVybWluYXRlZFJlZ0V4cCk7XG4gICAgICB9XG4gICAgICBpZiAoZXNjYXBlZCkge1xuICAgICAgICBlc2NhcGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY2ggPT09IGNoYXJDb2Rlcy5sZWZ0U3F1YXJlQnJhY2tldCkge1xuICAgICAgICAgIGluQ2xhc3MgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGNoID09PSBjaGFyQ29kZXMucmlnaHRTcXVhcmVCcmFja2V0ICYmIGluQ2xhc3MpIHtcbiAgICAgICAgICBpbkNsYXNzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IGNoYXJDb2Rlcy5zbGFzaCAmJiAhaW5DbGFzcykge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVzY2FwZWQgPSBjaCA9PT0gY2hhckNvZGVzLmJhY2tzbGFzaDtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuaW5wdXQuc2xpY2Uoc3RhcnQsIHBvcyk7XG4gICAgKytwb3M7XG5cbiAgICBsZXQgbW9kcyA9IFwiXCI7XG5cbiAgICB3aGlsZSAocG9zIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNwID0gdGhpcy5jb2RlUG9pbnRBdFBvcyhwb3MpO1xuICAgICAgLy8gSXQgZG9lc24ndCBtYXR0ZXIgaWYgY3AgPiAweGZmZmYsIHRoZSBsb29wIHdpbGwgZWl0aGVyIHRocm93IG9yIGJyZWFrIGJlY2F1c2Ugd2UgY2hlY2sgb24gY3BcbiAgICAgIGNvbnN0IGNoYXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNwKTtcblxuICAgICAgaWYgKFZBTElEX1JFR0VYX0ZMQUdTLmhhcyhjcCkpIHtcbiAgICAgICAgaWYgKG1vZHMuaW5jbHVkZXMoY2hhcikpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHBvcyArIDEsIEVycm9ycy5EdXBsaWNhdGVSZWdFeHBGbGFncyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNJZGVudGlmaWVyQ2hhcihjcCkgfHwgY3AgPT09IGNoYXJDb2Rlcy5iYWNrc2xhc2gpIHtcbiAgICAgICAgdGhpcy5yYWlzZShwb3MgKyAxLCBFcnJvcnMuTWFsZm9ybWVkUmVnRXhwRmxhZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgICsrcG9zO1xuICAgICAgbW9kcyArPSBjaGFyO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlLnBvcyA9IHBvcztcblxuICAgIHRoaXMuZmluaXNoVG9rZW4odHQucmVnZXhwLCB7XG4gICAgICBwYXR0ZXJuOiBjb250ZW50LFxuICAgICAgZmxhZ3M6IG1vZHMsXG4gICAgfSk7XG4gIH1cblxuICAvLyBSZWFkIGFuIGludGVnZXIgaW4gdGhlIGdpdmVuIHJhZGl4LiBSZXR1cm4gbnVsbCBpZiB6ZXJvIGRpZ2l0c1xuICAvLyB3ZXJlIHJlYWQsIHRoZSBpbnRlZ2VyIHZhbHVlIG90aGVyd2lzZS4gV2hlbiBgbGVuYCBpcyBnaXZlbiwgdGhpc1xuICAvLyB3aWxsIHJldHVybiBgbnVsbGAgdW5sZXNzIHRoZSBpbnRlZ2VyIGhhcyBleGFjdGx5IGBsZW5gIGRpZ2l0cy5cbiAgLy8gV2hlbiBgZm9yY2VMZW5gIGlzIGB0cnVlYCwgaXQgbWVhbnMgdGhhdCB3ZSBhbHJlYWR5IGtub3cgdGhhdCBpbiBjYXNlXG4gIC8vIG9mIGEgbWFsZm9ybWVkIG51bWJlciB3ZSBoYXZlIHRvIHNraXAgYGxlbmAgY2hhcmFjdGVycyBhbnl3YXksIGluc3RlYWRcbiAgLy8gb2YgYmFpbGluZyBvdXQgZWFybHkuIEZvciBleGFtcGxlLCBpbiBcIlxcdXsxMjNafVwiIHdlIHdhbnQgdG8gcmVhZCB1cCB0byB9XG4gIC8vIGFueXdheSwgd2hpbGUgaW4gXCJcXHUwMFpcIiB3ZSB3aWxsIHN0b3AgYXQgWiBpbnN0ZWFkIG9mIGNvbnN1bWluZyBmb3VyXG4gIC8vIGNoYXJhY3RlcnMgKGFuZCB0aHVzIHRoZSBjbG9zaW5nIHF1b3RlKS5cblxuICByZWFkSW50KFxuICAgIHJhZGl4OiBudW1iZXIsXG4gICAgbGVuPzogbnVtYmVyLFxuICAgIGZvcmNlTGVuPzogYm9vbGVhbixcbiAgICBhbGxvd051bVNlcGFyYXRvcjogYm9vbGVhbiA9IHRydWUsXG4gICk6IG51bWJlciB8IG51bGwge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgY29uc3QgZm9yYmlkZGVuU2libGluZ3MgPVxuICAgICAgcmFkaXggPT09IDE2XG4gICAgICAgID8gZm9yYmlkZGVuTnVtZXJpY1NlcGFyYXRvclNpYmxpbmdzLmhleFxuICAgICAgICA6IGZvcmJpZGRlbk51bWVyaWNTZXBhcmF0b3JTaWJsaW5ncy5kZWNCaW5PY3Q7XG4gICAgY29uc3QgYWxsb3dlZFNpYmxpbmdzID1cbiAgICAgIHJhZGl4ID09PSAxNlxuICAgICAgICA/IGFsbG93ZWROdW1lcmljU2VwYXJhdG9yU2libGluZ3MuaGV4XG4gICAgICAgIDogcmFkaXggPT09IDEwXG4gICAgICAgID8gYWxsb3dlZE51bWVyaWNTZXBhcmF0b3JTaWJsaW5ncy5kZWNcbiAgICAgICAgOiByYWRpeCA9PT0gOFxuICAgICAgICA/IGFsbG93ZWROdW1lcmljU2VwYXJhdG9yU2libGluZ3Mub2N0XG4gICAgICAgIDogYWxsb3dlZE51bWVyaWNTZXBhcmF0b3JTaWJsaW5ncy5iaW47XG5cbiAgICBsZXQgaW52YWxpZCA9IGZhbHNlO1xuICAgIGxldCB0b3RhbCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgZSA9IGxlbiA9PSBudWxsID8gSW5maW5pdHkgOiBsZW47IGkgPCBlOyArK2kpIHtcbiAgICAgIGNvbnN0IGNvZGUgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgbGV0IHZhbDtcblxuICAgICAgaWYgKGNvZGUgPT09IGNoYXJDb2Rlcy51bmRlcnNjb3JlKSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MgLSAxKTtcbiAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyArIDEpO1xuICAgICAgICBpZiAoYWxsb3dlZFNpYmxpbmdzLmluZGV4T2YobmV4dCkgPT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRXJyb3JzLlVuZXhwZWN0ZWROdW1lcmljU2VwYXJhdG9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBmb3JiaWRkZW5TaWJsaW5ncy5pbmRleE9mKHByZXYpID4gLTEgfHxcbiAgICAgICAgICBmb3JiaWRkZW5TaWJsaW5ncy5pbmRleE9mKG5leHQpID4gLTEgfHxcbiAgICAgICAgICBOdW1iZXIuaXNOYU4obmV4dClcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRXJyb3JzLlVuZXhwZWN0ZWROdW1lcmljU2VwYXJhdG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYWxsb3dOdW1TZXBhcmF0b3IpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHRoaXMuc3RhdGUucG9zLCBFcnJvcnMuTnVtZXJpY1NlcGFyYXRvckluRXNjYXBlU2VxdWVuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWdub3JlIHRoaXMgXyBjaGFyYWN0ZXJcbiAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb2RlID49IGNoYXJDb2Rlcy5sb3dlcmNhc2VBKSB7XG4gICAgICAgIHZhbCA9IGNvZGUgLSBjaGFyQ29kZXMubG93ZXJjYXNlQSArIGNoYXJDb2Rlcy5saW5lRmVlZDtcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA+PSBjaGFyQ29kZXMudXBwZXJjYXNlQSkge1xuICAgICAgICB2YWwgPSBjb2RlIC0gY2hhckNvZGVzLnVwcGVyY2FzZUEgKyBjaGFyQ29kZXMubGluZUZlZWQ7XG4gICAgICB9IGVsc2UgaWYgKGNoYXJDb2Rlcy5pc0RpZ2l0KGNvZGUpKSB7XG4gICAgICAgIHZhbCA9IGNvZGUgLSBjaGFyQ29kZXMuZGlnaXQwOyAvLyAwLTlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IEluZmluaXR5O1xuICAgICAgfVxuICAgICAgaWYgKHZhbCA+PSByYWRpeCkge1xuICAgICAgICAvLyBJZiB3ZSBhcmUgaW4gXCJlcnJvclJlY292ZXJ5XCIgbW9kZSBhbmQgd2UgZm91bmQgYSBkaWdpdCB3aGljaCBpcyB0b28gYmlnLFxuICAgICAgICAvLyBkb24ndCBicmVhayB0aGUgbG9vcC5cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmVycm9yUmVjb3ZlcnkgJiYgdmFsIDw9IDkpIHtcbiAgICAgICAgICB2YWwgPSAwO1xuICAgICAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCArIGkgKyAyLCBFcnJvcnMuSW52YWxpZERpZ2l0LCByYWRpeCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9yY2VMZW4pIHtcbiAgICAgICAgICB2YWwgPSAwO1xuICAgICAgICAgIGludmFsaWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgdG90YWwgPSB0b3RhbCAqIHJhZGl4ICsgdmFsO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICB0aGlzLnN0YXRlLnBvcyA9PT0gc3RhcnQgfHxcbiAgICAgIChsZW4gIT0gbnVsbCAmJiB0aGlzLnN0YXRlLnBvcyAtIHN0YXJ0ICE9PSBsZW4pIHx8XG4gICAgICBpbnZhbGlkXG4gICAgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdG90YWw7XG4gIH1cblxuICByZWFkUmFkaXhOdW1iZXIocmFkaXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgbGV0IGlzQmlnSW50ID0gZmFsc2U7XG5cbiAgICB0aGlzLnN0YXRlLnBvcyArPSAyOyAvLyAweFxuICAgIGNvbnN0IHZhbCA9IHRoaXMucmVhZEludChyYWRpeCk7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnJhaXNlKHRoaXMuc3RhdGUuc3RhcnQgKyAyLCBFcnJvcnMuSW52YWxpZERpZ2l0LCByYWRpeCk7XG4gICAgfVxuICAgIGNvbnN0IG5leHQgPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQodGhpcy5zdGF0ZS5wb3MpO1xuXG4gICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5sb3dlcmNhc2VOKSB7XG4gICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgaXNCaWdJbnQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAobmV4dCA9PT0gY2hhckNvZGVzLmxvd2VyY2FzZU0pIHtcbiAgICAgIHRocm93IHRoaXMucmFpc2Uoc3RhcnQsIEVycm9ycy5JbnZhbGlkRGVjaW1hbCk7XG4gICAgfVxuXG4gICAgaWYgKGlzSWRlbnRpZmllclN0YXJ0KHRoaXMuY29kZVBvaW50QXRQb3ModGhpcy5zdGF0ZS5wb3MpKSkge1xuICAgICAgdGhyb3cgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnBvcywgRXJyb3JzLk51bWJlcklkZW50aWZpZXIpO1xuICAgIH1cblxuICAgIGlmIChpc0JpZ0ludCkge1xuICAgICAgY29uc3Qgc3RyID0gdGhpcy5pbnB1dC5zbGljZShzdGFydCwgdGhpcy5zdGF0ZS5wb3MpLnJlcGxhY2UoL1tfbl0vZywgXCJcIik7XG4gICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LmJpZ2ludCwgc3RyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmZpbmlzaFRva2VuKHR0Lm51bSwgdmFsKTtcbiAgfVxuXG4gIC8vIFJlYWQgYW4gaW50ZWdlciwgb2N0YWwgaW50ZWdlciwgb3IgZmxvYXRpbmctcG9pbnQgbnVtYmVyLlxuXG4gIHJlYWROdW1iZXIoc3RhcnRzV2l0aERvdDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgbGV0IGlzRmxvYXQgPSBmYWxzZTtcbiAgICBsZXQgaXNCaWdJbnQgPSBmYWxzZTtcbiAgICBsZXQgaXNEZWNpbWFsID0gZmFsc2U7XG4gICAgbGV0IGhhc0V4cG9uZW50ID0gZmFsc2U7XG4gICAgbGV0IGlzT2N0YWwgPSBmYWxzZTtcblxuICAgIGlmICghc3RhcnRzV2l0aERvdCAmJiB0aGlzLnJlYWRJbnQoMTApID09PSBudWxsKSB7XG4gICAgICB0aGlzLnJhaXNlKHN0YXJ0LCBFcnJvcnMuSW52YWxpZE51bWJlcik7XG4gICAgfVxuICAgIGNvbnN0IGhhc0xlYWRpbmdaZXJvID1cbiAgICAgIHRoaXMuc3RhdGUucG9zIC0gc3RhcnQgPj0gMiAmJlxuICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHN0YXJ0KSA9PT0gY2hhckNvZGVzLmRpZ2l0MDtcblxuICAgIGlmIChoYXNMZWFkaW5nWmVybykge1xuICAgICAgY29uc3QgaW50ZWdlciA9IHRoaXMuaW5wdXQuc2xpY2Uoc3RhcnQsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgIHRoaXMucmVjb3JkU3RyaWN0TW9kZUVycm9ycyhzdGFydCwgRXJyb3JzLlN0cmljdE9jdGFsTGl0ZXJhbCk7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc3RyaWN0KSB7XG4gICAgICAgIC8vIGRpc2FsbG93IG51bWVyaWMgc2VwYXJhdG9ycyBpbiBub24gb2N0YWwgZGVjaW1hbHMgYW5kIGxlZ2FjeSBvY3RhbCBsaWtlc1xuICAgICAgICBjb25zdCB1bmRlcnNjb3JlUG9zID0gaW50ZWdlci5pbmRleE9mKFwiX1wiKTtcbiAgICAgICAgaWYgKHVuZGVyc2NvcmVQb3MgPiAwKSB7XG4gICAgICAgICAgdGhpcy5yYWlzZSh1bmRlcnNjb3JlUG9zICsgc3RhcnQsIEVycm9ycy5aZXJvRGlnaXROdW1lcmljU2VwYXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXNPY3RhbCA9IGhhc0xlYWRpbmdaZXJvICYmICEvWzg5XS8udGVzdChpbnRlZ2VyKTtcbiAgICB9XG5cbiAgICBsZXQgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyk7XG4gICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5kb3QgJiYgIWlzT2N0YWwpIHtcbiAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICB0aGlzLnJlYWRJbnQoMTApO1xuICAgICAgaXNGbG9hdCA9IHRydWU7XG4gICAgICBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAobmV4dCA9PT0gY2hhckNvZGVzLnVwcGVyY2FzZUUgfHwgbmV4dCA9PT0gY2hhckNvZGVzLmxvd2VyY2FzZUUpICYmXG4gICAgICAhaXNPY3RhbFxuICAgICkge1xuICAgICAgbmV4dCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCgrK3RoaXMuc3RhdGUucG9zKTtcbiAgICAgIGlmIChuZXh0ID09PSBjaGFyQ29kZXMucGx1c1NpZ24gfHwgbmV4dCA9PT0gY2hhckNvZGVzLmRhc2gpIHtcbiAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlYWRJbnQoMTApID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmFpc2Uoc3RhcnQsIEVycm9ycy5JbnZhbGlkT3JNaXNzaW5nRXhwb25lbnQpO1xuICAgICAgfVxuICAgICAgaXNGbG9hdCA9IHRydWU7XG4gICAgICBoYXNFeHBvbmVudCA9IHRydWU7XG4gICAgICBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zKTtcbiAgICB9XG5cbiAgICBpZiAobmV4dCA9PT0gY2hhckNvZGVzLmxvd2VyY2FzZU4pIHtcbiAgICAgIC8vIGRpc2FsbG93IGZsb2F0cywgbGVnYWN5IG9jdGFsIHN5bnRheCBhbmQgbm9uIG9jdGFsIGRlY2ltYWxzXG4gICAgICAvLyBuZXcgc3R5bGUgb2N0YWwgKFwiMG9cIikgaXMgaGFuZGxlZCBpbiB0aGlzLnJlYWRSYWRpeE51bWJlclxuICAgICAgaWYgKGlzRmxvYXQgfHwgaGFzTGVhZGluZ1plcm8pIHtcbiAgICAgICAgdGhpcy5yYWlzZShzdGFydCwgRXJyb3JzLkludmFsaWRCaWdJbnRMaXRlcmFsKTtcbiAgICAgIH1cbiAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICBpc0JpZ0ludCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKG5leHQgPT09IGNoYXJDb2Rlcy5sb3dlcmNhc2VNKSB7XG4gICAgICB0aGlzLmV4cGVjdFBsdWdpbihcImRlY2ltYWxcIiwgdGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgaWYgKGhhc0V4cG9uZW50IHx8IGhhc0xlYWRpbmdaZXJvKSB7XG4gICAgICAgIHRoaXMucmFpc2Uoc3RhcnQsIEVycm9ycy5JbnZhbGlkRGVjaW1hbCk7XG4gICAgICB9XG4gICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgaXNEZWNpbWFsID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQodGhpcy5jb2RlUG9pbnRBdFBvcyh0aGlzLnN0YXRlLnBvcykpKSB7XG4gICAgICB0aHJvdyB0aGlzLnJhaXNlKHRoaXMuc3RhdGUucG9zLCBFcnJvcnMuTnVtYmVySWRlbnRpZmllcik7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIFwiX1wiIGZvciBudW1lcmljIGxpdGVyYWwgc2VwYXJhdG9yLCBhbmQgdHJhaWxpbmcgYG1gIG9yIGBuYFxuICAgIGNvbnN0IHN0ciA9IHRoaXMuaW5wdXQuc2xpY2Uoc3RhcnQsIHRoaXMuc3RhdGUucG9zKS5yZXBsYWNlKC9bX21uXS9nLCBcIlwiKTtcblxuICAgIGlmIChpc0JpZ0ludCkge1xuICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5iaWdpbnQsIHN0cik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzRGVjaW1hbCkge1xuICAgICAgdGhpcy5maW5pc2hUb2tlbih0dC5kZWNpbWFsLCBzdHIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbCA9IGlzT2N0YWwgPyBwYXJzZUludChzdHIsIDgpIDogcGFyc2VGbG9hdChzdHIpO1xuICAgIHRoaXMuZmluaXNoVG9rZW4odHQubnVtLCB2YWwpO1xuICB9XG5cbiAgLy8gUmVhZCBhIHN0cmluZyB2YWx1ZSwgaW50ZXJwcmV0aW5nIGJhY2tzbGFzaC1lc2NhcGVzLlxuXG4gIHJlYWRDb2RlUG9pbnQodGhyb3dPbkludmFsaWQ6IGJvb2xlYW4pOiBudW1iZXIgfCBudWxsIHtcbiAgICBjb25zdCBjaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyk7XG4gICAgbGV0IGNvZGU7XG5cbiAgICBpZiAoY2ggPT09IGNoYXJDb2Rlcy5sZWZ0Q3VybHlCcmFjZSkge1xuICAgICAgY29uc3QgY29kZVBvcyA9ICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICBjb2RlID0gdGhpcy5yZWFkSGV4Q2hhcihcbiAgICAgICAgdGhpcy5pbnB1dC5pbmRleE9mKFwifVwiLCB0aGlzLnN0YXRlLnBvcykgLSB0aGlzLnN0YXRlLnBvcyxcbiAgICAgICAgdHJ1ZSxcbiAgICAgICAgdGhyb3dPbkludmFsaWQsXG4gICAgICApO1xuICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgIGlmIChjb2RlICE9PSBudWxsICYmIGNvZGUgPiAweDEwZmZmZikge1xuICAgICAgICBpZiAodGhyb3dPbkludmFsaWQpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKGNvZGVQb3MsIEVycm9ycy5JbnZhbGlkQ29kZVBvaW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb2RlID0gdGhpcy5yZWFkSGV4Q2hhcig0LCBmYWxzZSwgdGhyb3dPbkludmFsaWQpO1xuICAgIH1cbiAgICByZXR1cm4gY29kZTtcbiAgfVxuXG4gIHJlYWRTdHJpbmcocXVvdGU6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBvdXQgPSBcIlwiLFxuICAgICAgY2h1bmtTdGFydCA9ICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgZm9yICg7Oykge1xuICAgICAgaWYgKHRoaXMuc3RhdGUucG9zID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlVudGVybWluYXRlZFN0cmluZyk7XG4gICAgICB9XG4gICAgICBjb25zdCBjaCA9IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcyk7XG4gICAgICBpZiAoY2ggPT09IHF1b3RlKSBicmVhaztcbiAgICAgIGlmIChjaCA9PT0gY2hhckNvZGVzLmJhY2tzbGFzaCkge1xuICAgICAgICBvdXQgKz0gdGhpcy5pbnB1dC5zbGljZShjaHVua1N0YXJ0LCB0aGlzLnN0YXRlLnBvcyk7XG4gICAgICAgIC8vICRGbG93Rml4TWVcbiAgICAgICAgb3V0ICs9IHRoaXMucmVhZEVzY2FwZWRDaGFyKGZhbHNlKTtcbiAgICAgICAgY2h1bmtTdGFydCA9IHRoaXMuc3RhdGUucG9zO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgY2ggPT09IGNoYXJDb2Rlcy5saW5lU2VwYXJhdG9yIHx8XG4gICAgICAgIGNoID09PSBjaGFyQ29kZXMucGFyYWdyYXBoU2VwYXJhdG9yXG4gICAgICApIHtcbiAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgKyt0aGlzLnN0YXRlLmN1ckxpbmU7XG4gICAgICAgIHRoaXMuc3RhdGUubGluZVN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICB9IGVsc2UgaWYgKGlzTmV3TGluZShjaCkpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5yYWlzZSh0aGlzLnN0YXRlLnN0YXJ0LCBFcnJvcnMuVW50ZXJtaW5hdGVkU3RyaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICB9XG4gICAgfVxuICAgIG91dCArPSB0aGlzLmlucHV0LnNsaWNlKGNodW5rU3RhcnQsIHRoaXMuc3RhdGUucG9zKyspO1xuICAgIHRoaXMuZmluaXNoVG9rZW4odHQuc3RyaW5nLCBvdXQpO1xuICB9XG5cbiAgLy8gUmVhZHMgdGVtcGxhdGUgc3RyaW5nIHRva2Vucy5cblxuICByZWFkVG1wbFRva2VuKCk6IHZvaWQge1xuICAgIGxldCBvdXQgPSBcIlwiLFxuICAgICAgY2h1bmtTdGFydCA9IHRoaXMuc3RhdGUucG9zLFxuICAgICAgY29udGFpbnNJbnZhbGlkID0gZmFsc2U7XG4gICAgZm9yICg7Oykge1xuICAgICAgaWYgKHRoaXMuc3RhdGUucG9zID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLlVudGVybWluYXRlZFRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNoID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zKTtcbiAgICAgIGlmIChcbiAgICAgICAgY2ggPT09IGNoYXJDb2Rlcy5ncmF2ZUFjY2VudCB8fFxuICAgICAgICAoY2ggPT09IGNoYXJDb2Rlcy5kb2xsYXJTaWduICYmXG4gICAgICAgICAgdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zICsgMSkgPT09XG4gICAgICAgICAgICBjaGFyQ29kZXMubGVmdEN1cmx5QnJhY2UpXG4gICAgICApIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucG9zID09PSB0aGlzLnN0YXRlLnN0YXJ0ICYmIHRoaXMubWF0Y2godHQudGVtcGxhdGUpKSB7XG4gICAgICAgICAgaWYgKGNoID09PSBjaGFyQ29kZXMuZG9sbGFyU2lnbikge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZS5wb3MgKz0gMjtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuZG9sbGFyQnJhY2VMKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgICAgIHRoaXMuZmluaXNoVG9rZW4odHQuYmFja1F1b3RlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9IHRoaXMuaW5wdXQuc2xpY2UoY2h1bmtTdGFydCwgdGhpcy5zdGF0ZS5wb3MpO1xuICAgICAgICB0aGlzLmZpbmlzaFRva2VuKHR0LnRlbXBsYXRlLCBjb250YWluc0ludmFsaWQgPyBudWxsIDogb3V0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGNoID09PSBjaGFyQ29kZXMuYmFja3NsYXNoKSB7XG4gICAgICAgIG91dCArPSB0aGlzLmlucHV0LnNsaWNlKGNodW5rU3RhcnQsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgY29uc3QgZXNjYXBlZCA9IHRoaXMucmVhZEVzY2FwZWRDaGFyKHRydWUpO1xuICAgICAgICBpZiAoZXNjYXBlZCA9PT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRhaW5zSW52YWxpZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0ICs9IGVzY2FwZWQ7XG4gICAgICAgIH1cbiAgICAgICAgY2h1bmtTdGFydCA9IHRoaXMuc3RhdGUucG9zO1xuICAgICAgfSBlbHNlIGlmIChpc05ld0xpbmUoY2gpKSB7XG4gICAgICAgIG91dCArPSB0aGlzLmlucHV0LnNsaWNlKGNodW5rU3RhcnQsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgc3dpdGNoIChjaCkge1xuICAgICAgICAgIGNhc2UgY2hhckNvZGVzLmNhcnJpYWdlUmV0dXJuOlxuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcykgPT09IGNoYXJDb2Rlcy5saW5lRmVlZCkge1xuICAgICAgICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgICAgIGNhc2UgY2hhckNvZGVzLmxpbmVGZWVkOlxuICAgICAgICAgICAgb3V0ICs9IFwiXFxuXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2gpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgKyt0aGlzLnN0YXRlLmN1ckxpbmU7XG4gICAgICAgIHRoaXMuc3RhdGUubGluZVN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIGNodW5rU3RhcnQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjb3JkU3RyaWN0TW9kZUVycm9ycyhwb3M6IG51bWJlciwgbWVzc2FnZTogRXJyb3JUZW1wbGF0ZSkge1xuICAgIGlmICh0aGlzLnN0YXRlLnN0cmljdCAmJiAhdGhpcy5zdGF0ZS5zdHJpY3RFcnJvcnMuaGFzKHBvcykpIHtcbiAgICAgIHRoaXMucmFpc2UocG9zLCBtZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5zdHJpY3RFcnJvcnMuc2V0KHBvcywgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVXNlZCB0byByZWFkIGVzY2FwZWQgY2hhcmFjdGVyc1xuICByZWFkRXNjYXBlZENoYXIoaW5UZW1wbGF0ZTogYm9vbGVhbik6IHN0cmluZyB8IG51bGwge1xuICAgIGNvbnN0IHRocm93T25JbnZhbGlkID0gIWluVGVtcGxhdGU7XG4gICAgY29uc3QgY2ggPSB0aGlzLmlucHV0LmNoYXJDb2RlQXQoKyt0aGlzLnN0YXRlLnBvcyk7XG4gICAgKyt0aGlzLnN0YXRlLnBvcztcbiAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICBjYXNlIGNoYXJDb2Rlcy5sb3dlcmNhc2VOOlxuICAgICAgICByZXR1cm4gXCJcXG5cIjtcbiAgICAgIGNhc2UgY2hhckNvZGVzLmxvd2VyY2FzZVI6XG4gICAgICAgIHJldHVybiBcIlxcclwiO1xuICAgICAgY2FzZSBjaGFyQ29kZXMubG93ZXJjYXNlWDoge1xuICAgICAgICBjb25zdCBjb2RlID0gdGhpcy5yZWFkSGV4Q2hhcigyLCBmYWxzZSwgdGhyb3dPbkludmFsaWQpO1xuICAgICAgICByZXR1cm4gY29kZSA9PT0gbnVsbCA/IG51bGwgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpO1xuICAgICAgfVxuICAgICAgY2FzZSBjaGFyQ29kZXMubG93ZXJjYXNlVToge1xuICAgICAgICBjb25zdCBjb2RlID0gdGhpcy5yZWFkQ29kZVBvaW50KHRocm93T25JbnZhbGlkKTtcbiAgICAgICAgcmV0dXJuIGNvZGUgPT09IG51bGwgPyBudWxsIDogU3RyaW5nLmZyb21Db2RlUG9pbnQoY29kZSk7XG4gICAgICB9XG4gICAgICBjYXNlIGNoYXJDb2Rlcy5sb3dlcmNhc2VUOlxuICAgICAgICByZXR1cm4gXCJcXHRcIjtcbiAgICAgIGNhc2UgY2hhckNvZGVzLmxvd2VyY2FzZUI6XG4gICAgICAgIHJldHVybiBcIlxcYlwiO1xuICAgICAgY2FzZSBjaGFyQ29kZXMubG93ZXJjYXNlVjpcbiAgICAgICAgcmV0dXJuIFwiXFx1MDAwYlwiO1xuICAgICAgY2FzZSBjaGFyQ29kZXMubG93ZXJjYXNlRjpcbiAgICAgICAgcmV0dXJuIFwiXFxmXCI7XG4gICAgICBjYXNlIGNoYXJDb2Rlcy5jYXJyaWFnZVJldHVybjpcbiAgICAgICAgaWYgKHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLnN0YXRlLnBvcykgPT09IGNoYXJDb2Rlcy5saW5lRmVlZCkge1xuICAgICAgICAgICsrdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgIH1cbiAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgY2FzZSBjaGFyQ29kZXMubGluZUZlZWQ6XG4gICAgICAgIHRoaXMuc3RhdGUubGluZVN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICAgICsrdGhpcy5zdGF0ZS5jdXJMaW5lO1xuICAgICAgLy8gZmFsbCB0aHJvdWdoXG4gICAgICBjYXNlIGNoYXJDb2Rlcy5saW5lU2VwYXJhdG9yOlxuICAgICAgY2FzZSBjaGFyQ29kZXMucGFyYWdyYXBoU2VwYXJhdG9yOlxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIGNhc2UgY2hhckNvZGVzLmRpZ2l0ODpcbiAgICAgIGNhc2UgY2hhckNvZGVzLmRpZ2l0OTpcbiAgICAgICAgaWYgKGluVGVtcGxhdGUpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlY29yZFN0cmljdE1vZGVFcnJvcnMoXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnBvcyAtIDEsXG4gICAgICAgICAgICBFcnJvcnMuU3RyaWN0TnVtZXJpY0VzY2FwZSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAvLyBmYWxsIHRocm91Z2hcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChjaCA+PSBjaGFyQ29kZXMuZGlnaXQwICYmIGNoIDw9IGNoYXJDb2Rlcy5kaWdpdDcpIHtcbiAgICAgICAgICBjb25zdCBjb2RlUG9zID0gdGhpcy5zdGF0ZS5wb3MgLSAxO1xuICAgICAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5pbnB1dFxuICAgICAgICAgICAgLnN1YnN0cih0aGlzLnN0YXRlLnBvcyAtIDEsIDMpXG4gICAgICAgICAgICAubWF0Y2goL15bMC03XSsvKTtcblxuICAgICAgICAgIC8vIFRoaXMgaXMgbmV2ZXIgbnVsbCwgYmVjYXVzZSBvZiB0aGUgaWYgY29uZGl0aW9uIGFib3ZlLlxuICAgICAgICAgIC8qOjogaW52YXJpYW50KG1hdGNoICE9PSBudWxsKSAqL1xuICAgICAgICAgIGxldCBvY3RhbFN0ciA9IG1hdGNoWzBdO1xuXG4gICAgICAgICAgbGV0IG9jdGFsID0gcGFyc2VJbnQob2N0YWxTdHIsIDgpO1xuICAgICAgICAgIGlmIChvY3RhbCA+IDI1NSkge1xuICAgICAgICAgICAgb2N0YWxTdHIgPSBvY3RhbFN0ci5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICBvY3RhbCA9IHBhcnNlSW50KG9jdGFsU3RyLCA4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zdGF0ZS5wb3MgKz0gb2N0YWxTdHIubGVuZ3RoIC0gMTtcbiAgICAgICAgICBjb25zdCBuZXh0ID0gdGhpcy5pbnB1dC5jaGFyQ29kZUF0KHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBvY3RhbFN0ciAhPT0gXCIwXCIgfHxcbiAgICAgICAgICAgIG5leHQgPT09IGNoYXJDb2Rlcy5kaWdpdDggfHxcbiAgICAgICAgICAgIG5leHQgPT09IGNoYXJDb2Rlcy5kaWdpdDlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChpblRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5yZWNvcmRTdHJpY3RNb2RlRXJyb3JzKGNvZGVQb3MsIEVycm9ycy5TdHJpY3ROdW1lcmljRXNjYXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShvY3RhbCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjaCk7XG4gICAgfVxuICB9XG5cbiAgLy8gVXNlZCB0byByZWFkIGNoYXJhY3RlciBlc2NhcGUgc2VxdWVuY2VzICgnXFx4JywgJ1xcdScpLlxuXG4gIHJlYWRIZXhDaGFyKFxuICAgIGxlbjogbnVtYmVyLFxuICAgIGZvcmNlTGVuOiBib29sZWFuLFxuICAgIHRocm93T25JbnZhbGlkOiBib29sZWFuLFxuICApOiBudW1iZXIgfCBudWxsIHtcbiAgICBjb25zdCBjb2RlUG9zID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgY29uc3QgbiA9IHRoaXMucmVhZEludCgxNiwgbGVuLCBmb3JjZUxlbiwgZmFsc2UpO1xuICAgIGlmIChuID09PSBudWxsKSB7XG4gICAgICBpZiAodGhyb3dPbkludmFsaWQpIHtcbiAgICAgICAgdGhpcy5yYWlzZShjb2RlUG9zLCBFcnJvcnMuSW52YWxpZEVzY2FwZVNlcXVlbmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUucG9zID0gY29kZVBvcyAtIDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuO1xuICB9XG5cbiAgLy8gUmVhZCBhbiBpZGVudGlmaWVyLCBhbmQgcmV0dXJuIGl0IGFzIGEgc3RyaW5nLiBTZXRzIGB0aGlzLnN0YXRlLmNvbnRhaW5zRXNjYFxuICAvLyB0byB3aGV0aGVyIHRoZSB3b3JkIGNvbnRhaW5lZCBhICdcXHUnIGVzY2FwZS5cbiAgLy9cbiAgLy8gSW5jcmVtZW50YWxseSBhZGRzIG9ubHkgZXNjYXBlZCBjaGFycywgYWRkaW5nIG90aGVyIGNodW5rcyBhcy1pc1xuICAvLyBhcyBhIG1pY3JvLW9wdGltaXphdGlvbi5cbiAgLy9cbiAgLy8gV2hlbiBgZmlyc3RDb2RlYCBpcyBnaXZlbiwgaXQgYXNzdW1lcyBpdCBpcyBhbHdheXMgYW4gaWRlbnRpZmllciBzdGFydCBhbmRcbiAgLy8gd2lsbCBza2lwIHJlYWRpbmcgc3RhcnQgcG9zaXRpb24gYWdhaW5cblxuICByZWFkV29yZDEoZmlyc3RDb2RlOiBudW1iZXIgfCB2b2lkKTogc3RyaW5nIHtcbiAgICB0aGlzLnN0YXRlLmNvbnRhaW5zRXNjID0gZmFsc2U7XG4gICAgbGV0IHdvcmQgPSBcIlwiO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgbGV0IGNodW5rU3RhcnQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICBpZiAoZmlyc3RDb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc3RhdGUucG9zICs9IGZpcnN0Q29kZSA8PSAweGZmZmYgPyAxIDogMjtcbiAgICB9XG5cbiAgICB3aGlsZSAodGhpcy5zdGF0ZS5wb3MgPCB0aGlzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2ggPSB0aGlzLmNvZGVQb2ludEF0UG9zKHRoaXMuc3RhdGUucG9zKTtcbiAgICAgIGlmIChpc0lkZW50aWZpZXJDaGFyKGNoKSkge1xuICAgICAgICB0aGlzLnN0YXRlLnBvcyArPSBjaCA8PSAweGZmZmYgPyAxIDogMjtcbiAgICAgIH0gZWxzZSBpZiAoY2ggPT09IGNoYXJDb2Rlcy5iYWNrc2xhc2gpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250YWluc0VzYyA9IHRydWU7XG5cbiAgICAgICAgd29yZCArPSB0aGlzLmlucHV0LnNsaWNlKGNodW5rU3RhcnQsIHRoaXMuc3RhdGUucG9zKTtcbiAgICAgICAgY29uc3QgZXNjU3RhcnQgPSB0aGlzLnN0YXRlLnBvcztcbiAgICAgICAgY29uc3QgaWRlbnRpZmllckNoZWNrID1cbiAgICAgICAgICB0aGlzLnN0YXRlLnBvcyA9PT0gc3RhcnQgPyBpc0lkZW50aWZpZXJTdGFydCA6IGlzSWRlbnRpZmllckNoYXI7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5wdXQuY2hhckNvZGVBdCgrK3RoaXMuc3RhdGUucG9zKSAhPT0gY2hhckNvZGVzLmxvd2VyY2FzZVUpIHtcbiAgICAgICAgICB0aGlzLnJhaXNlKHRoaXMuc3RhdGUucG9zLCBFcnJvcnMuTWlzc2luZ1VuaWNvZGVFc2NhcGUpO1xuICAgICAgICAgIGNodW5rU3RhcnQgPSB0aGlzLnN0YXRlLnBvcyAtIDE7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICArK3RoaXMuc3RhdGUucG9zO1xuICAgICAgICBjb25zdCBlc2MgPSB0aGlzLnJlYWRDb2RlUG9pbnQodHJ1ZSk7XG4gICAgICAgIGlmIChlc2MgIT09IG51bGwpIHtcbiAgICAgICAgICBpZiAoIWlkZW50aWZpZXJDaGVjayhlc2MpKSB7XG4gICAgICAgICAgICB0aGlzLnJhaXNlKGVzY1N0YXJ0LCBFcnJvcnMuRXNjYXBlZENoYXJOb3RBbklkZW50aWZpZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHdvcmQgKz0gU3RyaW5nLmZyb21Db2RlUG9pbnQoZXNjKTtcbiAgICAgICAgfVxuICAgICAgICBjaHVua1N0YXJ0ID0gdGhpcy5zdGF0ZS5wb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHdvcmQgKyB0aGlzLmlucHV0LnNsaWNlKGNodW5rU3RhcnQsIHRoaXMuc3RhdGUucG9zKTtcbiAgfVxuXG4gIC8vIFJlYWQgYW4gaWRlbnRpZmllciBvciBrZXl3b3JkIHRva2VuLiBXaWxsIGNoZWNrIGZvciByZXNlcnZlZFxuICAvLyB3b3JkcyB3aGVuIG5lY2Vzc2FyeS5cblxuICByZWFkV29yZChmaXJzdENvZGU6IG51bWJlciB8IHZvaWQpOiB2b2lkIHtcbiAgICBjb25zdCB3b3JkID0gdGhpcy5yZWFkV29yZDEoZmlyc3RDb2RlKTtcbiAgICBjb25zdCB0eXBlID0ga2V5d29yZFR5cGVzLmdldCh3b3JkKSB8fCB0dC5uYW1lO1xuICAgIHRoaXMuZmluaXNoVG9rZW4odHlwZSwgd29yZCk7XG4gIH1cblxuICBjaGVja0tleXdvcmRFc2NhcGVzKCk6IHZvaWQge1xuICAgIGNvbnN0IGt3ID0gdGhpcy5zdGF0ZS50eXBlLmtleXdvcmQ7XG4gICAgaWYgKGt3ICYmIHRoaXMuc3RhdGUuY29udGFpbnNFc2MpIHtcbiAgICAgIHRoaXMucmFpc2UodGhpcy5zdGF0ZS5zdGFydCwgRXJyb3JzLkludmFsaWRFc2NhcGVkUmVzZXJ2ZWRXb3JkLCBrdyk7XG4gICAgfVxuICB9XG5cbiAgLy8gdGhlIHByZXZUeXBlIGlzIHJlcXVpcmVkIGJ5IHRoZSBqc3ggcGx1Z2luXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICB1cGRhdGVDb250ZXh0KHByZXZUeXBlOiBUb2tlblR5cGUpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlLnR5cGUudXBkYXRlQ29udGV4dD8uKHRoaXMuc3RhdGUuY29udGV4dCk7XG4gIH1cbn1cbiJdfQ==