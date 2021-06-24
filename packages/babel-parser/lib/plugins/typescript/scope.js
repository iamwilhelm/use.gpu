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

var TypeScriptScope = /*#__PURE__*/function (_Scope) {
  _inherits(TypeScriptScope, _Scope);

  var _super = _createSuper(TypeScriptScope);

  function TypeScriptScope() {
    var _this;

    _classCallCheck(this, TypeScriptScope);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "types", new Set());

    _defineProperty(_assertThisInitialized(_this), "enums", new Set());

    _defineProperty(_assertThisInitialized(_this), "constEnums", new Set());

    _defineProperty(_assertThisInitialized(_this), "classes", new Set());

    _defineProperty(_assertThisInitialized(_this), "exportOnlyBindings", new Set());

    return _this;
  }

  return TypeScriptScope;
}(_scope.Scope); // See https://github.com/babel/babel/pull/9766#discussion_r268920730 for an
// explanation of how typescript handles scope.


var TypeScriptScopeHandler = /*#__PURE__*/function (_ScopeHandler) {
  _inherits(TypeScriptScopeHandler, _ScopeHandler);

  var _super2 = _createSuper(TypeScriptScopeHandler);

  function TypeScriptScopeHandler() {
    _classCallCheck(this, TypeScriptScopeHandler);

    return _super2.apply(this, arguments);
  }

  _createClass(TypeScriptScopeHandler, [{
    key: "createScope",
    value: function createScope(flags) {
      return new TypeScriptScope(flags);
    }
  }, {
    key: "declareName",
    value: function declareName(name, bindingType, pos) {
      var scope = this.currentScope();

      if (bindingType & _scopeflags.BIND_FLAGS_TS_EXPORT_ONLY) {
        this.maybeExportDefined(scope, name);
        scope.exportOnlyBindings.add(name);
        return;
      }

      _get(_getPrototypeOf(TypeScriptScopeHandler.prototype), "declareName", this).apply(this, arguments);

      if (bindingType & _scopeflags.BIND_KIND_TYPE) {
        if (!(bindingType & _scopeflags.BIND_KIND_VALUE)) {
          // "Value" bindings have already been registered by the superclass.
          this.checkRedeclarationInScope(scope, name, bindingType, pos);
          this.maybeExportDefined(scope, name);
        }

        scope.types.add(name);
      }

      if (bindingType & _scopeflags.BIND_FLAGS_TS_ENUM) scope.enums.add(name);
      if (bindingType & _scopeflags.BIND_FLAGS_TS_CONST_ENUM) scope.constEnums.add(name);
      if (bindingType & _scopeflags.BIND_FLAGS_CLASS) scope.classes.add(name);
    }
  }, {
    key: "isRedeclaredInScope",
    value: function isRedeclaredInScope(scope, name, bindingType) {
      if (scope.enums.has(name)) {
        if (bindingType & _scopeflags.BIND_FLAGS_TS_ENUM) {
          // Enums can be merged with other enums if they are both
          //  const or both non-const.
          var isConst = !!(bindingType & _scopeflags.BIND_FLAGS_TS_CONST_ENUM);
          var wasConst = scope.constEnums.has(name);
          return isConst !== wasConst;
        }

        return true;
      }

      if (bindingType & _scopeflags.BIND_FLAGS_CLASS && scope.classes.has(name)) {
        if (scope.lexical.has(name)) {
          // Classes can be merged with interfaces
          return !!(bindingType & _scopeflags.BIND_KIND_VALUE);
        } else {
          // Interface can be merged with other classes or interfaces
          return false;
        }
      }

      if (bindingType & _scopeflags.BIND_KIND_TYPE && scope.types.has(name)) {
        return true;
      }

      return _get(_getPrototypeOf(TypeScriptScopeHandler.prototype), "isRedeclaredInScope", this).apply(this, arguments);
    }
  }, {
    key: "checkLocalExport",
    value: function checkLocalExport(id) {
      var topLevelScope = this.scopeStack[0];
      var name = id.name;

      if (!topLevelScope.types.has(name) && !topLevelScope.exportOnlyBindings.has(name)) {
        _get(_getPrototypeOf(TypeScriptScopeHandler.prototype), "checkLocalExport", this).call(this, id);
      }
    }
  }]);

  return TypeScriptScopeHandler;
}(_scope["default"]);

exports["default"] = TypeScriptScopeHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL3R5cGVzY3JpcHQvc2NvcGUuanMiXSwibmFtZXMiOlsiVHlwZVNjcmlwdFNjb3BlIiwiU2V0IiwiU2NvcGUiLCJUeXBlU2NyaXB0U2NvcGVIYW5kbGVyIiwiZmxhZ3MiLCJuYW1lIiwiYmluZGluZ1R5cGUiLCJwb3MiLCJzY29wZSIsImN1cnJlbnRTY29wZSIsIkJJTkRfRkxBR1NfVFNfRVhQT1JUX09OTFkiLCJtYXliZUV4cG9ydERlZmluZWQiLCJleHBvcnRPbmx5QmluZGluZ3MiLCJhZGQiLCJhcmd1bWVudHMiLCJCSU5EX0tJTkRfVFlQRSIsIkJJTkRfS0lORF9WQUxVRSIsImNoZWNrUmVkZWNsYXJhdGlvbkluU2NvcGUiLCJ0eXBlcyIsIkJJTkRfRkxBR1NfVFNfRU5VTSIsImVudW1zIiwiQklORF9GTEFHU19UU19DT05TVF9FTlVNIiwiY29uc3RFbnVtcyIsIkJJTkRfRkxBR1NfQ0xBU1MiLCJjbGFzc2VzIiwiaGFzIiwiaXNDb25zdCIsIndhc0NvbnN0IiwibGV4aWNhbCIsImlkIiwidG9wTGV2ZWxTY29wZSIsInNjb3BlU3RhY2siLCJTY29wZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBOztBQUNBOztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVNQSxlOzs7Ozs7Ozs7Ozs7Ozs7OzREQUNpQixJQUFJQyxHQUFKLEU7OzREQUdBLElBQUlBLEdBQUosRTs7aUVBR0ssSUFBSUEsR0FBSixFOzs4REFHSCxJQUFJQSxHQUFKLEU7O3lFQU1XLElBQUlBLEdBQUosRTs7Ozs7O0VBaEJOQyxZLEdBbUI5QjtBQUNBOzs7SUFFcUJDLHNCOzs7Ozs7Ozs7Ozs7O1dBQ25CLHFCQUFZQyxLQUFaLEVBQWdEO0FBQzlDLGFBQU8sSUFBSUosZUFBSixDQUFvQkksS0FBcEIsQ0FBUDtBQUNEOzs7V0FFRCxxQkFBWUMsSUFBWixFQUEwQkMsV0FBMUIsRUFBcURDLEdBQXJELEVBQWtFO0FB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IFwiLi4vLi4vdXRpbC9zY29wZVwiO1xuaW1wb3J0IHtcbiAgQklORF9LSU5EX1RZUEUsXG4gIEJJTkRfRkxBR1NfVFNfRU5VTSxcbiAgQklORF9GTEFHU19UU19DT05TVF9FTlVNLFxuICBCSU5EX0ZMQUdTX1RTX0VYUE9SVF9PTkxZLFxuICBCSU5EX0tJTkRfVkFMVUUsXG4gIEJJTkRfRkxBR1NfQ0xBU1MsXG4gIHR5cGUgU2NvcGVGbGFncyxcbiAgdHlwZSBCaW5kaW5nVHlwZXMsXG59IGZyb20gXCIuLi8uLi91dGlsL3Njb3BlZmxhZ3NcIjtcbmltcG9ydCAqIGFzIE4gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5cbmNsYXNzIFR5cGVTY3JpcHRTY29wZSBleHRlbmRzIFNjb3BlIHtcbiAgdHlwZXM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4gIC8vIGVudW1zICh3aGljaCBhcmUgYWxzbyBpbiAudHlwZXMpXG4gIGVudW1zOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICAvLyBjb25zdCBlbnVtcyAod2hpY2ggYXJlIGFsc28gaW4gLmVudW1zIGFuZCAudHlwZXMpXG4gIGNvbnN0RW51bXM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4gIC8vIGNsYXNzZXMgKHdoaWNoIGFyZSBhbHNvIGluIC5sZXhpY2FsKSBhbmQgaW50ZXJmYWNlICh3aGljaCBhcmUgYWxzbyBpbiAudHlwZXMpXG4gIGNsYXNzZXM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4gIC8vIG5hbWVzcGFjZXMgYW5kIGFtYmllbnQgZnVuY3Rpb25zIChvciBjbGFzc2VzKSBhcmUgdG9vIGRpZmZpY3VsdCB0byB0cmFjayxcbiAgLy8gZXNwZWNpYWxseSB3aXRob3V0IHR5cGUgYW5hbHlzaXMuXG4gIC8vIFdlIG5lZWQgdG8gdHJhY2sgdGhlbSBhbnl3YXksIHRvIGF2b2lkIFwiWCBpcyBub3QgZGVmaW5lZFwiIGVycm9yc1xuICAvLyB3aGVuIGV4cG9ydGluZyB0aGVtLlxuICBleHBvcnRPbmx5QmluZGluZ3M6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xufVxuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2JhYmVsL2JhYmVsL3B1bGwvOTc2NiNkaXNjdXNzaW9uX3IyNjg5MjA3MzAgZm9yIGFuXG4vLyBleHBsYW5hdGlvbiBvZiBob3cgdHlwZXNjcmlwdCBoYW5kbGVzIHNjb3BlLlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUeXBlU2NyaXB0U2NvcGVIYW5kbGVyIGV4dGVuZHMgU2NvcGVIYW5kbGVyPFR5cGVTY3JpcHRTY29wZT4ge1xuICBjcmVhdGVTY29wZShmbGFnczogU2NvcGVGbGFncyk6IFR5cGVTY3JpcHRTY29wZSB7XG4gICAgcmV0dXJuIG5ldyBUeXBlU2NyaXB0U2NvcGUoZmxhZ3MpO1xuICB9XG5cbiAgZGVjbGFyZU5hbWUobmFtZTogc3RyaW5nLCBiaW5kaW5nVHlwZTogQmluZGluZ1R5cGVzLCBwb3M6IG51bWJlcikge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcy5jdXJyZW50U2NvcGUoKTtcbiAgICBpZiAoYmluZGluZ1R5cGUgJiBCSU5EX0ZMQUdTX1RTX0VYUE9SVF9PTkxZKSB7XG4gICAgICB0aGlzLm1heWJlRXhwb3J0RGVmaW5lZChzY29wZSwgbmFtZSk7XG4gICAgICBzY29wZS5leHBvcnRPbmx5QmluZGluZ3MuYWRkKG5hbWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN1cGVyLmRlY2xhcmVOYW1lKC4uLmFyZ3VtZW50cyk7XG5cbiAgICBpZiAoYmluZGluZ1R5cGUgJiBCSU5EX0tJTkRfVFlQRSkge1xuICAgICAgaWYgKCEoYmluZGluZ1R5cGUgJiBCSU5EX0tJTkRfVkFMVUUpKSB7XG4gICAgICAgIC8vIFwiVmFsdWVcIiBiaW5kaW5ncyBoYXZlIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIGJ5IHRoZSBzdXBlcmNsYXNzLlxuICAgICAgICB0aGlzLmNoZWNrUmVkZWNsYXJhdGlvbkluU2NvcGUoc2NvcGUsIG5hbWUsIGJpbmRpbmdUeXBlLCBwb3MpO1xuICAgICAgICB0aGlzLm1heWJlRXhwb3J0RGVmaW5lZChzY29wZSwgbmFtZSk7XG4gICAgICB9XG4gICAgICBzY29wZS50eXBlcy5hZGQobmFtZSk7XG4gICAgfVxuICAgIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfRkxBR1NfVFNfRU5VTSkgc2NvcGUuZW51bXMuYWRkKG5hbWUpO1xuICAgIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfRkxBR1NfVFNfQ09OU1RfRU5VTSkgc2NvcGUuY29uc3RFbnVtcy5hZGQobmFtZSk7XG4gICAgaWYgKGJpbmRpbmdUeXBlICYgQklORF9GTEFHU19DTEFTUykgc2NvcGUuY2xhc3Nlcy5hZGQobmFtZSk7XG4gIH1cblxuICBpc1JlZGVjbGFyZWRJblNjb3BlKFxuICAgIHNjb3BlOiBUeXBlU2NyaXB0U2NvcGUsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGJpbmRpbmdUeXBlOiBCaW5kaW5nVHlwZXMsXG4gICk6IGJvb2xlYW4ge1xuICAgIGlmIChzY29wZS5lbnVtcy5oYXMobmFtZSkpIHtcbiAgICAgIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfRkxBR1NfVFNfRU5VTSkge1xuICAgICAgICAvLyBFbnVtcyBjYW4gYmUgbWVyZ2VkIHdpdGggb3RoZXIgZW51bXMgaWYgdGhleSBhcmUgYm90aFxuICAgICAgICAvLyAgY29uc3Qgb3IgYm90aCBub24tY29uc3QuXG4gICAgICAgIGNvbnN0IGlzQ29uc3QgPSAhIShiaW5kaW5nVHlwZSAmIEJJTkRfRkxBR1NfVFNfQ09OU1RfRU5VTSk7XG4gICAgICAgIGNvbnN0IHdhc0NvbnN0ID0gc2NvcGUuY29uc3RFbnVtcy5oYXMobmFtZSk7XG4gICAgICAgIHJldHVybiBpc0NvbnN0ICE9PSB3YXNDb25zdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoYmluZGluZ1R5cGUgJiBCSU5EX0ZMQUdTX0NMQVNTICYmIHNjb3BlLmNsYXNzZXMuaGFzKG5hbWUpKSB7XG4gICAgICBpZiAoc2NvcGUubGV4aWNhbC5oYXMobmFtZSkpIHtcbiAgICAgICAgLy8gQ2xhc3NlcyBjYW4gYmUgbWVyZ2VkIHdpdGggaW50ZXJmYWNlc1xuICAgICAgICByZXR1cm4gISEoYmluZGluZ1R5cGUgJiBCSU5EX0tJTkRfVkFMVUUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW50ZXJmYWNlIGNhbiBiZSBtZXJnZWQgd2l0aCBvdGhlciBjbGFzc2VzIG9yIGludGVyZmFjZXNcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYmluZGluZ1R5cGUgJiBCSU5EX0tJTkRfVFlQRSAmJiBzY29wZS50eXBlcy5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5pc1JlZGVjbGFyZWRJblNjb3BlKC4uLmFyZ3VtZW50cyk7XG4gIH1cblxuICBjaGVja0xvY2FsRXhwb3J0KGlkOiBOLklkZW50aWZpZXIpIHtcbiAgICBjb25zdCB0b3BMZXZlbFNjb3BlID0gdGhpcy5zY29wZVN0YWNrWzBdO1xuICAgIGNvbnN0IHsgbmFtZSB9ID0gaWQ7XG4gICAgaWYgKFxuICAgICAgIXRvcExldmVsU2NvcGUudHlwZXMuaGFzKG5hbWUpICYmXG4gICAgICAhdG9wTGV2ZWxTY29wZS5leHBvcnRPbmx5QmluZGluZ3MuaGFzKG5hbWUpXG4gICAgKSB7XG4gICAgICBzdXBlci5jaGVja0xvY2FsRXhwb3J0KGlkKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==