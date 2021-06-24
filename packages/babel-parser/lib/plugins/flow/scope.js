"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _scope = _interopRequireWildcard(require("../../util/scope"));

var _scopeflags = require("../../util/scopeflags");

var N = _interopRequireWildcard(require("../../types"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Reference implementation: https://github.com/facebook/flow/blob/23aeb2a2ef6eb4241ce178fde5d8f17c5f747fb5/src/typing/env.ml#L536-L584
var FlowScope = /*#__PURE__*/function (_Scope) {
  _inherits(FlowScope, _Scope);

  var _super = _createSuper(FlowScope);

  function FlowScope() {
    var _this;

    _classCallCheck(this, FlowScope);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "declareFunctions", new Set());

    return _this;
  }

  return FlowScope;
}(_scope.Scope);

var FlowScopeHandler = /*#__PURE__*/function (_ScopeHandler) {
  _inherits(FlowScopeHandler, _ScopeHandler);

  var _super2 = _createSuper(FlowScopeHandler);

  function FlowScopeHandler() {
    _classCallCheck(this, FlowScopeHandler);

    return _super2.apply(this, arguments);
  }

  _createClass(FlowScopeHandler, [{
    key: "createScope",
    value: function createScope(flags) {
      return new FlowScope(flags);
    }
  }, {
    key: "declareName",
    value: function declareName(name, bindingType, pos) {
      var scope = this.currentScope();

      if (bindingType & _scopeflags.BIND_FLAGS_FLOW_DECLARE_FN) {
        this.checkRedeclarationInScope(scope, name, bindingType, pos);
        this.maybeExportDefined(scope, name);
        scope.declareFunctions.add(name);
        return;
      }

      _get(_getPrototypeOf(FlowScopeHandler.prototype), "declareName", this).apply(this, arguments);
    }
  }, {
    key: "isRedeclaredInScope",
    value: function isRedeclaredInScope(scope, name, bindingType) {
      if (_get(_getPrototypeOf(FlowScopeHandler.prototype), "isRedeclaredInScope", this).apply(this, arguments)) return true;

      if (bindingType & _scopeflags.BIND_FLAGS_FLOW_DECLARE_FN) {
        return !scope.declareFunctions.has(name) && (scope.lexical.has(name) || scope.functions.has(name));
      }

      return false;
    }
  }, {
    key: "checkLocalExport",
    value: function checkLocalExport(id) {
      if (!this.scopeStack[0].declareFunctions.has(id.name)) {
        _get(_getPrototypeOf(FlowScopeHandler.prototype), "checkLocalExport", this).call(this, id);
      }
    }
  }]);

  return FlowScopeHandler;
}(_scope["default"]);

exports["default"] = FlowScopeHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL2Zsb3cvc2NvcGUuanMiXSwibmFtZXMiOlsiRmxvd1Njb3BlIiwiU2V0IiwiU2NvcGUiLCJGbG93U2NvcGVIYW5kbGVyIiwiZmxhZ3MiLCJuYW1lIiwiYmluZGluZ1R5cGUiLCJwb3MiLCJzY29wZSIsImN1cnJlbnRTY29wZSIsIkJJTkRfRkxBR1NfRkxPV19ERUNMQVJFX0ZOIiwiY2hlY2tSZWRlY2xhcmF0aW9uSW5TY29wZSIsIm1heWJlRXhwb3J0RGVmaW5lZCIsImRlY2xhcmVGdW5jdGlvbnMiLCJhZGQiLCJhcmd1bWVudHMiLCJoYXMiLCJsZXhpY2FsIiwiZnVuY3Rpb25zIiwiaWQiLCJzY29wZVN0YWNrIiwiU2NvcGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNNQSxTOzs7Ozs7Ozs7Ozs7Ozs7O3VFQUU0QixJQUFJQyxHQUFKLEU7Ozs7OztFQUZWQyxZOztJQUtIQyxnQjs7Ozs7Ozs7Ozs7OztXQUNuQixxQkFBWUMsS0FBWixFQUEwQztBQUN4QyxhQUFPLElBQUlKLFNBQUosQ0FBY0ksS0FBZCxDQUFQO0FBQ0Q7OztXQUVELHFCQUFZQyxJQUFaLEVBQTBCQyxXQUExQixFQUFxREMsR0FBckQsRUFBa0U7QUFDaEUsVUFBTUMsS0FBSyxHQUFHLEtBQUtDLFlBQUwsRUFBZDs7QUFDQSxVQUFJSCxXQUFXLEdBQUdJLHNDQUFsQixFQUE4QztBQUM1QyxhQUFLQyx5QkFBTCxDQUErQkgsS0FBL0IsRUFBc0NILElBQXRDLEVBQTRDQyxXQUE1QyxFQUF5REMsR0FBekQ7QUFDQSxhQUFLSyxrQkFBTCxDQUF3QkosS0FBeEIsRUFBK0JILElBQS9CO0FBQ0FHLFFBQUFBLEtBQUssQ0FBQ0ssZ0JBQU4sQ0FBdUJDLEdBQXZCLENBQTJCVCxJQUEzQjtBQUNBO0FBQ0Q7O0FBRUQseUZBQXFCVSxTQUFyQjtBQUNEOzs7V0FFRCw2QkFDRVAsS0FERixFQUVFSCxJQUZGLEVBR0VDLFdBSEYsRUFJVztBQUNULHFHQUFpQ1MsU0FBakMsR0FBNkMsT0FBTyxJQUFQOztBQUU3QyxVQUFJVCxXQUFXLEdBQUdJLHNDQUFsQixFQUE4QztBQUM1QyxlQUNFLENBQUNGLEtBQUssQ0FBQ0ssZ0JBQU4sQ0FBdUJHLEdBQXZCLENBQTJCWCxJQUEzQixDQUFELEtBQ0NHLEtBQUssQ0FBQ1MsT0FBTixDQUFjRCxHQUFkLENBQWtCWCxJQUFsQixLQUEyQkcsS0FBSyxDQUFDVSxTQUFOLENBQWdCRixHQUFoQixDQUFvQlgsSUFBcEIsQ0FENUIsQ0FERjtBQUlEOztBQUVELGFBQU8sS0FBUDtBQUNEOzs7V0FFRCwwQkFBaUJjLEVBQWpCLEVBQW1DO0FBQ2pDLFVBQUksQ0FBQyxLQUFLQyxVQUFMLENBQWdCLENBQWhCLEVBQW1CUCxnQkFBbkIsQ0FBb0NHLEdBQXBDLENBQXdDRyxFQUFFLENBQUNkLElBQTNDLENBQUwsRUFBdUQ7QUFDckQsK0ZBQXVCYyxFQUF2QjtBQUNEO0FBQ0Y7Ozs7RUF0QzJDRSxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBTY29wZUhhbmRsZXIsIHsgU2NvcGUgfSBmcm9tIFwiLi4vLi4vdXRpbC9zY29wZVwiO1xuaW1wb3J0IHtcbiAgQklORF9GTEFHU19GTE9XX0RFQ0xBUkVfRk4sXG4gIHR5cGUgU2NvcGVGbGFncyxcbiAgdHlwZSBCaW5kaW5nVHlwZXMsXG59IGZyb20gXCIuLi8uLi91dGlsL3Njb3BlZmxhZ3NcIjtcbmltcG9ydCAqIGFzIE4gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5cbi8vIFJlZmVyZW5jZSBpbXBsZW1lbnRhdGlvbjogaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvYmxvYi8yM2FlYjJhMmVmNmViNDI0MWNlMTc4ZmRlNWQ4ZjE3YzVmNzQ3ZmI1L3NyYy90eXBpbmcvZW52Lm1sI0w1MzYtTDU4NFxuY2xhc3MgRmxvd1Njb3BlIGV4dGVuZHMgU2NvcGUge1xuICAvLyBkZWNsYXJlIGZ1bmN0aW9uIGZvbygpOiB0eXBlO1xuICBkZWNsYXJlRnVuY3Rpb25zOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvd1Njb3BlSGFuZGxlciBleHRlbmRzIFNjb3BlSGFuZGxlcjxGbG93U2NvcGU+IHtcbiAgY3JlYXRlU2NvcGUoZmxhZ3M6IFNjb3BlRmxhZ3MpOiBGbG93U2NvcGUge1xuICAgIHJldHVybiBuZXcgRmxvd1Njb3BlKGZsYWdzKTtcbiAgfVxuXG4gIGRlY2xhcmVOYW1lKG5hbWU6IHN0cmluZywgYmluZGluZ1R5cGU6IEJpbmRpbmdUeXBlcywgcG9zOiBudW1iZXIpIHtcbiAgICBjb25zdCBzY29wZSA9IHRoaXMuY3VycmVudFNjb3BlKCk7XG4gICAgaWYgKGJpbmRpbmdUeXBlICYgQklORF9GTEFHU19GTE9XX0RFQ0xBUkVfRk4pIHtcbiAgICAgIHRoaXMuY2hlY2tSZWRlY2xhcmF0aW9uSW5TY29wZShzY29wZSwgbmFtZSwgYmluZGluZ1R5cGUsIHBvcyk7XG4gICAgICB0aGlzLm1heWJlRXhwb3J0RGVmaW5lZChzY29wZSwgbmFtZSk7XG4gICAgICBzY29wZS5kZWNsYXJlRnVuY3Rpb25zLmFkZChuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzdXBlci5kZWNsYXJlTmFtZSguLi5hcmd1bWVudHMpO1xuICB9XG5cbiAgaXNSZWRlY2xhcmVkSW5TY29wZShcbiAgICBzY29wZTogRmxvd1Njb3BlLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBiaW5kaW5nVHlwZTogQmluZGluZ1R5cGVzLFxuICApOiBib29sZWFuIHtcbiAgICBpZiAoc3VwZXIuaXNSZWRlY2xhcmVkSW5TY29wZSguLi5hcmd1bWVudHMpKSByZXR1cm4gdHJ1ZTtcblxuICAgIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfRkxBR1NfRkxPV19ERUNMQVJFX0ZOKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhc2NvcGUuZGVjbGFyZUZ1bmN0aW9ucy5oYXMobmFtZSkgJiZcbiAgICAgICAgKHNjb3BlLmxleGljYWwuaGFzKG5hbWUpIHx8IHNjb3BlLmZ1bmN0aW9ucy5oYXMobmFtZSkpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNoZWNrTG9jYWxFeHBvcnQoaWQ6IE4uSWRlbnRpZmllcikge1xuICAgIGlmICghdGhpcy5zY29wZVN0YWNrWzBdLmRlY2xhcmVGdW5jdGlvbnMuaGFzKGlkLm5hbWUpKSB7XG4gICAgICBzdXBlci5jaGVja0xvY2FsRXhwb3J0KGlkKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==