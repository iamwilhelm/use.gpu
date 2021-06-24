"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeErrorTemplates = makeErrorTemplates;
Object.defineProperty(exports, "ErrorCodes", {
  enumerable: true,
  get: function get() {
    return _errorCodes.ErrorCodes;
  }
});
Object.defineProperty(exports, "Errors", {
  enumerable: true,
  get: function get() {
    return _errorMessage.ErrorMessages;
  }
});
Object.defineProperty(exports, "SourceTypeModuleErrors", {
  enumerable: true,
  get: function get() {
    return _errorMessage.SourceTypeModuleErrorMessages;
  }
});
exports["default"] = void 0;

var _location = require("../util/location");

var _comments = _interopRequireDefault(require("./comments"));

var _errorCodes = require("./error-codes");

var _errorMessage = require("./error-message");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function makeErrorTemplates(messages, code) {
  var templates = {};
  Object.keys(messages).forEach(function (reasonCode) {
    templates[reasonCode] = Object.freeze({
      code: code,
      reasonCode: reasonCode,
      template: messages[reasonCode]
    });
  });
  return Object.freeze(templates);
}

var ParserError = /*#__PURE__*/function (_CommentsParser) {
  _inherits(ParserError, _CommentsParser);

  var _super = _createSuper(ParserError);

  function ParserError() {
    _classCallCheck(this, ParserError);

    return _super.apply(this, arguments);
  }

  _createClass(ParserError, [{
    key: "getLocationForPosition",
    value: // Forward-declaration: defined in tokenizer/index.js

    /*::
    +isLookahead: boolean;
    */
    function getLocationForPosition(pos) {
      var loc;
      if (pos === this.state.start) loc = this.state.startLoc;else if (pos === this.state.lastTokStart) loc = this.state.lastTokStartLoc;else if (pos === this.state.end) loc = this.state.endLoc;else if (pos === this.state.lastTokEnd) loc = this.state.lastTokEndLoc;else loc = (0, _location.getLineInfo)(this.input, pos);
      return loc;
    }
  }, {
    key: "raise",
    value: function raise(pos, _ref) {
      var code = _ref.code,
          reasonCode = _ref.reasonCode,
          template = _ref.template;

      for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
      }

      return this.raiseWithData.apply(this, [pos, {
        code: code,
        reasonCode: reasonCode
      }, template].concat(params));
    }
    /**
     * Raise a parsing error on given position pos. If errorRecovery is true,
     * it will first search current errors and overwrite the error thrown on the exact
     * position before with the new error message. If errorRecovery is false, it
     * fallbacks to `raise`.
     *
     * @param {number} pos
     * @param {string} errorTemplate
     * @param {...any} params
     * @returns {(Error | empty)}
     * @memberof ParserError
     */

  }, {
    key: "raiseOverwrite",
    value: function raiseOverwrite(pos, _ref2) {
      var code = _ref2.code,
          template = _ref2.template;

      for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        params[_key2 - 2] = arguments[_key2];
      }

      var loc = this.getLocationForPosition(pos);
      var message = template.replace(/%(\d+)/g, function (_, i) {
        return params[i];
      }) + " (".concat(loc.line, ":").concat(loc.column, ")");

      if (this.options.errorRecovery) {
        var errors = this.state.errors;

        for (var i = errors.length - 1; i >= 0; i--) {
          var error = errors[i];

          if (error.pos === pos) {
            return Object.assign(error, {
              message: message
            });
          } else if (error.pos < pos) {
            break;
          }
        }
      }

      return this._raise({
        code: code,
        loc: loc,
        pos: pos
      }, message);
    }
  }, {
    key: "raiseWithData",
    value: function raiseWithData(pos, data, errorTemplate) {
      for (var _len3 = arguments.length, params = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        params[_key3 - 3] = arguments[_key3];
      }

      var loc = this.getLocationForPosition(pos);
      var message = errorTemplate.replace(/%(\d+)/g, function (_, i) {
        return params[i];
      }) + " (".concat(loc.line, ":").concat(loc.column, ")");
      return this._raise(Object.assign({
        loc: loc,
        pos: pos
      }, data), message);
    }
  }, {
    key: "_raise",
    value: function _raise(errorContext, message) {
      // $FlowIgnore
      var err = new SyntaxError(message);
      Object.assign(err, errorContext);

      if (this.options.errorRecovery) {
        if (!this.isLookahead) this.state.errors.push(err);
        return err;
      } else {
        throw err;
      }
    }
  }]);

  return ParserError;
}(_comments["default"]);

exports["default"] = ParserError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvZXJyb3IuanMiXSwibmFtZXMiOlsibWFrZUVycm9yVGVtcGxhdGVzIiwibWVzc2FnZXMiLCJjb2RlIiwidGVtcGxhdGVzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJyZWFzb25Db2RlIiwiZnJlZXplIiwidGVtcGxhdGUiLCJQYXJzZXJFcnJvciIsInBvcyIsImxvYyIsInN0YXRlIiwic3RhcnQiLCJzdGFydExvYyIsImxhc3RUb2tTdGFydCIsImxhc3RUb2tTdGFydExvYyIsImVuZCIsImVuZExvYyIsImxhc3RUb2tFbmQiLCJsYXN0VG9rRW5kTG9jIiwiaW5wdXQiLCJwYXJhbXMiLCJyYWlzZVdpdGhEYXRhIiwiZ2V0TG9jYXRpb25Gb3JQb3NpdGlvbiIsIm1lc3NhZ2UiLCJyZXBsYWNlIiwiXyIsImkiLCJsaW5lIiwiY29sdW1uIiwib3B0aW9ucyIsImVycm9yUmVjb3ZlcnkiLCJlcnJvcnMiLCJsZW5ndGgiLCJlcnJvciIsImFzc2lnbiIsIl9yYWlzZSIsImRhdGEiLCJlcnJvclRlbXBsYXRlIiwiZXJyb3JDb250ZXh0IiwiZXJyIiwiU3ludGF4RXJyb3IiLCJpc0xvb2thaGVhZCIsInB1c2giLCJDb21tZW50c1BhcnNlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQTRDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbEJPLFNBQVNBLGtCQUFULENBQ0xDLFFBREssRUFJTEMsSUFKSyxFQUtXO0FBQ2hCLE1BQU1DLFNBQXlCLEdBQUcsRUFBbEM7QUFDQUMsRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlKLFFBQVosRUFBc0JLLE9BQXRCLENBQThCLFVBQUFDLFVBQVUsRUFBSTtBQUMxQ0osSUFBQUEsU0FBUyxDQUFDSSxVQUFELENBQVQsR0FBd0JILE1BQU0sQ0FBQ0ksTUFBUCxDQUFjO0FBQ3BDTixNQUFBQSxJQUFJLEVBQUpBLElBRG9DO0FBRXBDSyxNQUFBQSxVQUFVLEVBQVZBLFVBRm9DO0FBR3BDRSxNQUFBQSxRQUFRLEVBQUVSLFFBQVEsQ0FBQ00sVUFBRDtBQUhrQixLQUFkLENBQXhCO0FBS0QsR0FORDtBQU9BLFNBQU9ILE1BQU0sQ0FBQ0ksTUFBUCxDQUFjTCxTQUFkLENBQVA7QUFDRDs7SUFVb0JPLFc7Ozs7Ozs7Ozs7Ozs7V0FDbkI7O0FBQ0E7QUFDRjtBQUNBO0FBRUUsb0NBQXVCQyxHQUF2QixFQUE4QztBQUM1QyxVQUFJQyxHQUFKO0FBQ0EsVUFBSUQsR0FBRyxLQUFLLEtBQUtFLEtBQUwsQ0FBV0MsS0FBdkIsRUFBOEJGLEdBQUcsR0FBRyxLQUFLQyxLQUFMLENBQVdFLFFBQWpCLENBQTlCLEtBQ0ssSUFBSUosR0FBRyxLQUFLLEtBQUtFLEtBQUwsQ0FBV0csWUFBdkIsRUFBcUNKLEdBQUcsR0FBRyxLQUFLQyxLQUFMLENBQVdJLGVBQWpCLENBQXJDLEtBQ0EsSUFBSU4sR0FBRyxLQUFLLEtBQUtFLEtBQUwsQ0FBV0ssR0FBdkIsRUFBNEJOLEdBQUcsR0FBRyxLQUFLQyxLQUFMLENBQVdNLE1BQWpCLENBQTVCLEtBQ0EsSUFBSVIsR0FBRyxLQUFLLEtBQUtFLEtBQUwsQ0FBV08sVUFBdkIsRUFBbUNSLEdBQUcsR0FBRyxLQUFLQyxLQUFMLENBQVdRLGFBQWpCLENBQW5DLEtBQ0FULEdBQUcsR0FBRywyQkFBWSxLQUFLVSxLQUFqQixFQUF3QlgsR0FBeEIsQ0FBTjtBQUVMLGFBQU9DLEdBQVA7QUFDRDs7O1dBRUQsZUFDRUQsR0FERixRQUlpQjtBQUFBLFVBRmJULElBRWEsUUFGYkEsSUFFYTtBQUFBLFVBRlBLLFVBRU8sUUFGUEEsVUFFTztBQUFBLFVBRktFLFFBRUwsUUFGS0EsUUFFTDs7QUFBQSx3Q0FEWmMsTUFDWTtBQURaQSxRQUFBQSxNQUNZO0FBQUE7O0FBQ2YsYUFBTyxLQUFLQyxhQUFMLGNBQW1CYixHQUFuQixFQUF3QjtBQUFFVCxRQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUUssUUFBQUEsVUFBVSxFQUFWQTtBQUFSLE9BQXhCLEVBQThDRSxRQUE5QyxTQUEyRGMsTUFBM0QsRUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1dBQ0Usd0JBQ0VaLEdBREYsU0FJaUI7QUFBQSxVQUZiVCxJQUVhLFNBRmJBLElBRWE7QUFBQSxVQUZQTyxRQUVPLFNBRlBBLFFBRU87O0FBQUEseUNBRFpjLE1BQ1k7QUFEWkEsUUFBQUEsTUFDWTtBQUFBOztBQUNmLFVBQU1YLEdBQUcsR0FBRyxLQUFLYSxzQkFBTCxDQUE0QmQsR0FBNUIsQ0FBWjtBQUNBLFVBQU1lLE9BQU8sR0FDWGpCLFFBQVEsQ0FBQ2tCLE9BQVQsQ0FBaUIsU0FBakIsRUFBNEIsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBa0JOLE1BQU0sQ0FBQ00sQ0FBRCxDQUF4QjtBQUFBLE9BQTVCLGdCQUNLakIsR0FBRyxDQUFDa0IsSUFEVCxjQUNpQmxCLEdBQUcsQ0FBQ21CLE1BRHJCLE1BREY7O0FBR0EsVUFBSSxLQUFLQyxPQUFMLENBQWFDLGFBQWpCLEVBQWdDO0FBQzlCLFlBQU1DLE1BQU0sR0FBRyxLQUFLckIsS0FBTCxDQUFXcUIsTUFBMUI7O0FBQ0EsYUFBSyxJQUFJTCxDQUFDLEdBQUdLLE1BQU0sQ0FBQ0MsTUFBUCxHQUFnQixDQUE3QixFQUFnQ04sQ0FBQyxJQUFJLENBQXJDLEVBQXdDQSxDQUFDLEVBQXpDLEVBQTZDO0FBQzNDLGNBQU1PLEtBQUssR0FBR0YsTUFBTSxDQUFDTCxDQUFELENBQXBCOztBQUNBLGNBQUlPLEtBQUssQ0FBQ3pCLEdBQU4sS0FBY0EsR0FBbEIsRUFBdUI7QUFDckIsbUJBQU9QLE1BQU0sQ0FBQ2lDLE1BQVAsQ0FBY0QsS0FBZCxFQUFxQjtBQUFFVixjQUFBQSxPQUFPLEVBQVBBO0FBQUYsYUFBckIsQ0FBUDtBQUNELFdBRkQsTUFFTyxJQUFJVSxLQUFLLENBQUN6QixHQUFOLEdBQVlBLEdBQWhCLEVBQXFCO0FBQzFCO0FBQ0Q7QUFDRjtBQUNGOztBQUNELGFBQU8sS0FBSzJCLE1BQUwsQ0FBWTtBQUFFcEMsUUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFVLFFBQUFBLEdBQUcsRUFBSEEsR0FBUjtBQUFhRCxRQUFBQSxHQUFHLEVBQUhBO0FBQWIsT0FBWixFQUFnQ2UsT0FBaEMsQ0FBUDtBQUNEOzs7V0FFRCx1QkFDRWYsR0FERixFQUVFNEIsSUFGRixFQU1FQyxhQU5GLEVBUWlCO0FBQUEseUNBRFpqQixNQUNZO0FBRFpBLFFBQUFBLE1BQ1k7QUFBQTs7QUFDZixVQUFNWCxHQUFHLEdBQUcsS0FBS2Esc0JBQUwsQ0FBNEJkLEdBQTVCLENBQVo7QUFDQSxVQUFNZSxPQUFPLEdBQ1hjLGFBQWEsQ0FBQ2IsT0FBZCxDQUFzQixTQUF0QixFQUFpQyxVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxlQUFrQk4sTUFBTSxDQUFDTSxDQUFELENBQXhCO0FBQUEsT0FBakMsZ0JBQ0tqQixHQUFHLENBQUNrQixJQURULGNBQ2lCbEIsR0FBRyxDQUFDbUIsTUFEckIsTUFERjtBQUdBLGFBQU8sS0FBS08sTUFBTCxDQUFZbEMsTUFBTSxDQUFDaUMsTUFBUCxDQUFlO0FBQUV6QixRQUFBQSxHQUFHLEVBQUhBLEdBQUY7QUFBT0QsUUFBQUEsR0FBRyxFQUFIQTtBQUFQLE9BQWYsRUFBc0M0QixJQUF0QyxDQUFaLEVBQXlEYixPQUF6RCxDQUFQO0FBQ0Q7OztXQUVELGdCQUFPZSxZQUFQLEVBQW1DZixPQUFuQyxFQUFtRTtBQUNqRTtBQUNBLFVBQU1nQixHQUErQixHQUFHLElBQUlDLFdBQUosQ0FBZ0JqQixPQUFoQixDQUF4QztBQUNBdEIsTUFBQUEsTUFBTSxDQUFDaUMsTUFBUCxDQUFjSyxHQUFkLEVBQW1CRCxZQUFuQjs7QUFDQSxVQUFJLEtBQUtULE9BQUwsQ0FBYUMsYUFBakIsRUFBZ0M7QUFDOUIsWUFBSSxDQUFDLEtBQUtXLFdBQVYsRUFBdUIsS0FBSy9CLEtBQUwsQ0FBV3FCLE1BQVgsQ0FBa0JXLElBQWxCLENBQXVCSCxHQUF2QjtBQUN2QixlQUFPQSxHQUFQO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsY0FBTUEsR0FBTjtBQUNEO0FBQ0Y7Ozs7RUF0RnNDSSxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG4vKiBlc2xpbnQgc29ydC1rZXlzOiBcImVycm9yXCIgKi9cbmltcG9ydCB7IGdldExpbmVJbmZvLCB0eXBlIFBvc2l0aW9uIH0gZnJvbSBcIi4uL3V0aWwvbG9jYXRpb25cIjtcbmltcG9ydCBDb21tZW50c1BhcnNlciBmcm9tIFwiLi9jb21tZW50c1wiO1xuaW1wb3J0IHsgdHlwZSBFcnJvckNvZGUsIEVycm9yQ29kZXMgfSBmcm9tIFwiLi9lcnJvci1jb2Rlc1wiO1xuXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gcmFpc2UgZXhjZXB0aW9ucyBvbiBwYXJzZSBlcnJvcnMuIEl0XG4vLyB0YWtlcyBhbiBvZmZzZXQgaW50ZWdlciAoaW50byB0aGUgY3VycmVudCBgaW5wdXRgKSB0byBpbmRpY2F0ZVxuLy8gdGhlIGxvY2F0aW9uIG9mIHRoZSBlcnJvciwgYXR0YWNoZXMgdGhlIHBvc2l0aW9uIHRvIHRoZSBlbmRcbi8vIG9mIHRoZSBlcnJvciBtZXNzYWdlLCBhbmQgdGhlbiByYWlzZXMgYSBgU3ludGF4RXJyb3JgIHdpdGggdGhhdFxuLy8gbWVzc2FnZS5cblxudHlwZSBFcnJvckNvbnRleHQgPSB7XG4gIHBvczogbnVtYmVyLFxuICBsb2M6IFBvc2l0aW9uLFxuICBtaXNzaW5nUGx1Z2luPzogQXJyYXk8c3RyaW5nPixcbiAgY29kZT86IHN0cmluZyxcbiAgcmVhc29uQ29kZT86IFN0cmluZyxcbn07XG5leHBvcnQgdHlwZSBQYXJzaW5nRXJyb3IgPSBTeW50YXhFcnJvciAmIEVycm9yQ29udGV4dDtcblxuZXhwb3J0IHR5cGUgRXJyb3JUZW1wbGF0ZSA9IHtcbiAgY29kZTogRXJyb3JDb2RlLFxuICB0ZW1wbGF0ZTogc3RyaW5nLFxuICByZWFzb25Db2RlOiBzdHJpbmcsXG59O1xuZXhwb3J0IHR5cGUgRXJyb3JUZW1wbGF0ZXMgPSB7XG4gIFtrZXk6IHN0cmluZ106IEVycm9yVGVtcGxhdGUsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVycm9yVGVtcGxhdGVzKFxuICBtZXNzYWdlczoge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZyxcbiAgfSxcbiAgY29kZTogRXJyb3JDb2RlLFxuKTogRXJyb3JUZW1wbGF0ZXMge1xuICBjb25zdCB0ZW1wbGF0ZXM6IEVycm9yVGVtcGxhdGVzID0ge307XG4gIE9iamVjdC5rZXlzKG1lc3NhZ2VzKS5mb3JFYWNoKHJlYXNvbkNvZGUgPT4ge1xuICAgIHRlbXBsYXRlc1tyZWFzb25Db2RlXSA9IE9iamVjdC5mcmVlemUoe1xuICAgICAgY29kZSxcbiAgICAgIHJlYXNvbkNvZGUsXG4gICAgICB0ZW1wbGF0ZTogbWVzc2FnZXNbcmVhc29uQ29kZV0sXG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gT2JqZWN0LmZyZWV6ZSh0ZW1wbGF0ZXMpO1xufVxuXG5leHBvcnQgeyBFcnJvckNvZGVzIH07XG5leHBvcnQge1xuICBFcnJvck1lc3NhZ2VzIGFzIEVycm9ycyxcbiAgU291cmNlVHlwZU1vZHVsZUVycm9yTWVzc2FnZXMgYXMgU291cmNlVHlwZU1vZHVsZUVycm9ycyxcbn0gZnJvbSBcIi4vZXJyb3ItbWVzc2FnZVwiO1xuXG5leHBvcnQgdHlwZSByYWlzZUZ1bmN0aW9uID0gKG51bWJlciwgRXJyb3JUZW1wbGF0ZSwgLi4uYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzZXJFcnJvciBleHRlbmRzIENvbW1lbnRzUGFyc2VyIHtcbiAgLy8gRm9yd2FyZC1kZWNsYXJhdGlvbjogZGVmaW5lZCBpbiB0b2tlbml6ZXIvaW5kZXguanNcbiAgLyo6OlxuICAraXNMb29rYWhlYWQ6IGJvb2xlYW47XG4gICovXG5cbiAgZ2V0TG9jYXRpb25Gb3JQb3NpdGlvbihwb3M6IG51bWJlcik6IFBvc2l0aW9uIHtcbiAgICBsZXQgbG9jO1xuICAgIGlmIChwb3MgPT09IHRoaXMuc3RhdGUuc3RhcnQpIGxvYyA9IHRoaXMuc3RhdGUuc3RhcnRMb2M7XG4gICAgZWxzZSBpZiAocG9zID09PSB0aGlzLnN0YXRlLmxhc3RUb2tTdGFydCkgbG9jID0gdGhpcy5zdGF0ZS5sYXN0VG9rU3RhcnRMb2M7XG4gICAgZWxzZSBpZiAocG9zID09PSB0aGlzLnN0YXRlLmVuZCkgbG9jID0gdGhpcy5zdGF0ZS5lbmRMb2M7XG4gICAgZWxzZSBpZiAocG9zID09PSB0aGlzLnN0YXRlLmxhc3RUb2tFbmQpIGxvYyA9IHRoaXMuc3RhdGUubGFzdFRva0VuZExvYztcbiAgICBlbHNlIGxvYyA9IGdldExpbmVJbmZvKHRoaXMuaW5wdXQsIHBvcyk7XG5cbiAgICByZXR1cm4gbG9jO1xuICB9XG5cbiAgcmFpc2UoXG4gICAgcG9zOiBudW1iZXIsXG4gICAgeyBjb2RlLCByZWFzb25Db2RlLCB0ZW1wbGF0ZSB9OiBFcnJvclRlbXBsYXRlLFxuICAgIC4uLnBhcmFtczogYW55XG4gICk6IEVycm9yIHwgZW1wdHkge1xuICAgIHJldHVybiB0aGlzLnJhaXNlV2l0aERhdGEocG9zLCB7IGNvZGUsIHJlYXNvbkNvZGUgfSwgdGVtcGxhdGUsIC4uLnBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmFpc2UgYSBwYXJzaW5nIGVycm9yIG9uIGdpdmVuIHBvc2l0aW9uIHBvcy4gSWYgZXJyb3JSZWNvdmVyeSBpcyB0cnVlLFxuICAgKiBpdCB3aWxsIGZpcnN0IHNlYXJjaCBjdXJyZW50IGVycm9ycyBhbmQgb3ZlcndyaXRlIHRoZSBlcnJvciB0aHJvd24gb24gdGhlIGV4YWN0XG4gICAqIHBvc2l0aW9uIGJlZm9yZSB3aXRoIHRoZSBuZXcgZXJyb3IgbWVzc2FnZS4gSWYgZXJyb3JSZWNvdmVyeSBpcyBmYWxzZSwgaXRcbiAgICogZmFsbGJhY2tzIHRvIGByYWlzZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yVGVtcGxhdGVcbiAgICogQHBhcmFtIHsuLi5hbnl9IHBhcmFtc1xuICAgKiBAcmV0dXJucyB7KEVycm9yIHwgZW1wdHkpfVxuICAgKiBAbWVtYmVyb2YgUGFyc2VyRXJyb3JcbiAgICovXG4gIHJhaXNlT3ZlcndyaXRlKFxuICAgIHBvczogbnVtYmVyLFxuICAgIHsgY29kZSwgdGVtcGxhdGUgfTogRXJyb3JUZW1wbGF0ZSxcbiAgICAuLi5wYXJhbXM6IGFueVxuICApOiBFcnJvciB8IGVtcHR5IHtcbiAgICBjb25zdCBsb2MgPSB0aGlzLmdldExvY2F0aW9uRm9yUG9zaXRpb24ocG9zKTtcbiAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgIHRlbXBsYXRlLnJlcGxhY2UoLyUoXFxkKykvZywgKF8sIGk6IG51bWJlcikgPT4gcGFyYW1zW2ldKSArXG4gICAgICBgICgke2xvYy5saW5lfToke2xvYy5jb2x1bW59KWA7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5lcnJvclJlY292ZXJ5KSB7XG4gICAgICBjb25zdCBlcnJvcnMgPSB0aGlzLnN0YXRlLmVycm9ycztcbiAgICAgIGZvciAobGV0IGkgPSBlcnJvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBlcnJvcnNbaV07XG4gICAgICAgIGlmIChlcnJvci5wb3MgPT09IHBvcykge1xuICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGVycm9yLCB7IG1lc3NhZ2UgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3IucG9zIDwgcG9zKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JhaXNlKHsgY29kZSwgbG9jLCBwb3MgfSwgbWVzc2FnZSk7XG4gIH1cblxuICByYWlzZVdpdGhEYXRhKFxuICAgIHBvczogbnVtYmVyLFxuICAgIGRhdGE/OiB7XG4gICAgICBtaXNzaW5nUGx1Z2luPzogQXJyYXk8c3RyaW5nPixcbiAgICAgIGNvZGU/OiBzdHJpbmcsXG4gICAgfSxcbiAgICBlcnJvclRlbXBsYXRlOiBzdHJpbmcsXG4gICAgLi4ucGFyYW1zOiBhbnlcbiAgKTogRXJyb3IgfCBlbXB0eSB7XG4gICAgY29uc3QgbG9jID0gdGhpcy5nZXRMb2NhdGlvbkZvclBvc2l0aW9uKHBvcyk7XG4gICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICBlcnJvclRlbXBsYXRlLnJlcGxhY2UoLyUoXFxkKykvZywgKF8sIGk6IG51bWJlcikgPT4gcGFyYW1zW2ldKSArXG4gICAgICBgICgke2xvYy5saW5lfToke2xvYy5jb2x1bW59KWA7XG4gICAgcmV0dXJuIHRoaXMuX3JhaXNlKE9iamVjdC5hc3NpZ24oKHsgbG9jLCBwb3MgfTogT2JqZWN0KSwgZGF0YSksIG1lc3NhZ2UpO1xuICB9XG5cbiAgX3JhaXNlKGVycm9yQ29udGV4dDogRXJyb3JDb250ZXh0LCBtZXNzYWdlOiBzdHJpbmcpOiBFcnJvciB8IGVtcHR5IHtcbiAgICAvLyAkRmxvd0lnbm9yZVxuICAgIGNvbnN0IGVycjogU3ludGF4RXJyb3IgJiBFcnJvckNvbnRleHQgPSBuZXcgU3ludGF4RXJyb3IobWVzc2FnZSk7XG4gICAgT2JqZWN0LmFzc2lnbihlcnIsIGVycm9yQ29udGV4dCk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5lcnJvclJlY292ZXJ5KSB7XG4gICAgICBpZiAoIXRoaXMuaXNMb29rYWhlYWQpIHRoaXMuc3RhdGUuZXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIHJldHVybiBlcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==