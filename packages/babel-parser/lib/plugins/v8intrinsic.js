"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _types = require("../tokenizer/types");

var N = _interopRequireWildcard(require("../types"));

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

var _default = function _default(superClass) {
  return /*#__PURE__*/function (_superClass) {
    _inherits(_class, _superClass);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "parseV8Intrinsic",
      value: function parseV8Intrinsic() {
        if (this.match(_types.types.modulo)) {
          var v8IntrinsicStart = this.state.start; // let the `loc` of Identifier starts from `%`

          var node = this.startNode();
          this.eat(_types.types.modulo);

          if (this.match(_types.types.name)) {
            var name = this.parseIdentifierName(this.state.start);
            var identifier = this.createIdentifier(node, name);
            identifier.type = "V8IntrinsicIdentifier";

            if (this.match(_types.types.parenL)) {
              return identifier;
            }
          }

          this.unexpected(v8IntrinsicStart);
        }
      }
      /* ============================================================ *
       * parser/expression.js                                         *
       * ============================================================ */

    }, {
      key: "parseExprAtom",
      value: function parseExprAtom() {
        return this.parseV8Intrinsic() || _get(_getPrototypeOf(_class.prototype), "parseExprAtom", this).apply(this, arguments);
      }
    }]);

    return _class;
  }(superClass);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wbHVnaW5zL3Y4aW50cmluc2ljLmpzIl0sIm5hbWVzIjpbInN1cGVyQ2xhc3MiLCJtYXRjaCIsInR0IiwibW9kdWxvIiwidjhJbnRyaW5zaWNTdGFydCIsInN0YXRlIiwic3RhcnQiLCJub2RlIiwic3RhcnROb2RlIiwiZWF0IiwibmFtZSIsInBhcnNlSWRlbnRpZmllck5hbWUiLCJpZGVudGlmaWVyIiwiY3JlYXRlSWRlbnRpZmllciIsInR5cGUiLCJwYXJlbkwiLCJ1bmV4cGVjdGVkIiwicGFyc2VWOEludHJpbnNpYyIsImFyZ3VtZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQUVlLGtCQUFDQSxVQUFEO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLGFBRVgsNEJBQWlDO0FBQy9CLFlBQUksS0FBS0MsS0FBTCxDQUFXQyxhQUFHQyxNQUFkLENBQUosRUFBMkI7QUFDekIsY0FBTUMsZ0JBQWdCLEdBQUcsS0FBS0MsS0FBTCxDQUFXQyxLQUFwQyxDQUR5QixDQUV6Qjs7QUFDQSxjQUFNQyxJQUFJLEdBQUcsS0FBS0MsU0FBTCxFQUFiO0FBQ0EsZUFBS0MsR0FBTCxDQUFTUCxhQUFHQyxNQUFaOztBQUNBLGNBQUksS0FBS0YsS0FBTCxDQUFXQyxhQUFHUSxJQUFkLENBQUosRUFBeUI7QUFDdkIsZ0JBQU1BLElBQUksR0FBRyxLQUFLQyxtQkFBTCxDQUF5QixLQUFLTixLQUFMLENBQVdDLEtBQXBDLENBQWI7QUFDQSxnQkFBTU0sVUFBVSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCTixJQUF0QixFQUE0QkcsSUFBNUIsQ0FBbkI7QUFDQUUsWUFBQUEsVUFBVSxDQUFDRSxJQUFYLEdBQWtCLHVCQUFsQjs7QUFDQSxnQkFBSSxLQUFLYixLQUFMLENBQVdDLGFBQUdhLE1BQWQsQ0FBSixFQUEyQjtBQUN6QixxQkFBT0gsVUFBUDtBQUNEO0FBQ0Y7O0FBQ0QsZUFBS0ksVUFBTCxDQUFnQlosZ0JBQWhCO0FBQ0Q7QUFDRjtBQUVEO0FBQ0o7QUFDQTs7QUF0QmU7QUFBQTtBQUFBLGFBd0JYLHlCQUE4QjtBQUM1QixlQUFPLEtBQUthLGdCQUFMLGlGQUFrREMsU0FBbEQsQ0FBUDtBQUNEO0FBMUJVOztBQUFBO0FBQUEsSUFDQ2xCLFVBREQ7QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgUGFyc2VyIGZyb20gXCIuLi9wYXJzZXJcIjtcbmltcG9ydCB7IHR5cGVzIGFzIHR0IH0gZnJvbSBcIi4uL3Rva2VuaXplci90eXBlc1wiO1xuaW1wb3J0ICogYXMgTiBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgKHN1cGVyQ2xhc3M6IENsYXNzPFBhcnNlcj4pOiBDbGFzczxQYXJzZXI+ID0+XG4gIGNsYXNzIGV4dGVuZHMgc3VwZXJDbGFzcyB7XG4gICAgcGFyc2VWOEludHJpbnNpYygpOiBOLkV4cHJlc3Npb24ge1xuICAgICAgaWYgKHRoaXMubWF0Y2godHQubW9kdWxvKSkge1xuICAgICAgICBjb25zdCB2OEludHJpbnNpY1N0YXJ0ID0gdGhpcy5zdGF0ZS5zdGFydDtcbiAgICAgICAgLy8gbGV0IHRoZSBgbG9jYCBvZiBJZGVudGlmaWVyIHN0YXJ0cyBmcm9tIGAlYFxuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5zdGFydE5vZGUoKTtcbiAgICAgICAgdGhpcy5lYXQodHQubW9kdWxvKTtcbiAgICAgICAgaWYgKHRoaXMubWF0Y2godHQubmFtZSkpIHtcbiAgICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5wYXJzZUlkZW50aWZpZXJOYW1lKHRoaXMuc3RhdGUuc3RhcnQpO1xuICAgICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSB0aGlzLmNyZWF0ZUlkZW50aWZpZXIobm9kZSwgbmFtZSk7XG4gICAgICAgICAgaWRlbnRpZmllci50eXBlID0gXCJWOEludHJpbnNpY0lkZW50aWZpZXJcIjtcbiAgICAgICAgICBpZiAodGhpcy5tYXRjaCh0dC5wYXJlbkwpKSB7XG4gICAgICAgICAgICByZXR1cm4gaWRlbnRpZmllcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51bmV4cGVjdGVkKHY4SW50cmluc2ljU3RhcnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqXG4gICAgICogcGFyc2VyL2V4cHJlc3Npb24uanMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICpcbiAgICAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICAgIHBhcnNlRXhwckF0b20oKTogTi5FeHByZXNzaW9uIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlVjhJbnRyaW5zaWMoKSB8fCBzdXBlci5wYXJzZUV4cHJBdG9tKC4uLmFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xuIl19