"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _options = require("../options");

var _statement = _interopRequireDefault(require("./statement"));

var _scope = _interopRequireDefault(require("../util/scope"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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

var Parser = /*#__PURE__*/function (_StatementParser) {
  _inherits(Parser, _StatementParser);

  var _super = _createSuper(Parser);

  // Forward-declaration so typescript plugin can override jsx plugin

  /*::
  +jsxParseOpeningElementAfterName: (
    node: JSXOpeningElement,
  ) => JSXOpeningElement;
  */
  function Parser(options, input) {
    var _this;

    _classCallCheck(this, Parser);

    options = (0, _options.getOptions)(options);
    _this = _super.call(this, options, input);
    _this.options = options;

    _this.initializeScopes();

    _this.plugins = pluginsMap(_this.options.plugins);
    _this.filename = options.sourceFilename;
    return _this;
  } // This can be overwritten, for example, by the TypeScript plugin.


  _createClass(Parser, [{
    key: "getScopeHandler",
    value: function getScopeHandler() {
      return _scope["default"];
    }
  }, {
    key: "parse",
    value: function parse() {
      this.enterInitialScopes();
      var file = this.startNode();
      var program = this.startNode();
      this.nextToken();
      file.errors = null;
      this.parseTopLevel(file, program);
      file.errors = this.state.errors;
      return file;
    }
  }]);

  return Parser;
}(_statement["default"]);

exports["default"] = Parser;

function pluginsMap(plugins) {
  var pluginMap = new Map();

  var _iterator = _createForOfIteratorHelper(plugins),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var plugin = _step.value;

      var _ref = Array.isArray(plugin) ? plugin : [plugin, {}],
          _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          options = _ref2[1];

      if (!pluginMap.has(name)) pluginMap.set(name, options || {});
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return pluginMap;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvaW5kZXguanMiXSwibmFtZXMiOlsiUGFyc2VyIiwib3B0aW9ucyIsImlucHV0IiwiaW5pdGlhbGl6ZVNjb3BlcyIsInBsdWdpbnMiLCJwbHVnaW5zTWFwIiwiZmlsZW5hbWUiLCJzb3VyY2VGaWxlbmFtZSIsIlNjb3BlSGFuZGxlciIsImVudGVySW5pdGlhbFNjb3BlcyIsImZpbGUiLCJzdGFydE5vZGUiLCJwcm9ncmFtIiwibmV4dFRva2VuIiwiZXJyb3JzIiwicGFyc2VUb3BMZXZlbCIsInN0YXRlIiwiU3RhdGVtZW50UGFyc2VyIiwicGx1Z2luTWFwIiwiTWFwIiwicGx1Z2luIiwiQXJyYXkiLCJpc0FycmF5IiwibmFtZSIsImhhcyIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBS0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSXFCQSxNOzs7OztBQUNuQjs7QUFDQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBRUUsa0JBQVlDLE9BQVosRUFBK0JDLEtBQS9CLEVBQThDO0FBQUE7O0FBQUE7O0FBQzVDRCxJQUFBQSxPQUFPLEdBQUcseUJBQVdBLE9BQVgsQ0FBVjtBQUNBLDhCQUFNQSxPQUFOLEVBQWVDLEtBQWY7QUFFQSxVQUFLRCxPQUFMLEdBQWVBLE9BQWY7O0FBQ0EsVUFBS0UsZ0JBQUw7O0FBQ0EsVUFBS0MsT0FBTCxHQUFlQyxVQUFVLENBQUMsTUFBS0osT0FBTCxDQUFhRyxPQUFkLENBQXpCO0FBQ0EsVUFBS0UsUUFBTCxHQUFnQkwsT0FBTyxDQUFDTSxjQUF4QjtBQVA0QztBQVE3QyxHLENBRUQ7Ozs7O1dBQ0EsMkJBQTBDO0FBQ3hDLGFBQU9DLGlCQUFQO0FBQ0Q7OztXQUVELGlCQUFjO0FBQ1osV0FBS0Msa0JBQUw7QUFDQSxVQUFNQyxJQUFJLEdBQUcsS0FBS0MsU0FBTCxFQUFiO0FBQ0EsVUFBTUMsT0FBTyxHQUFHLEtBQUtELFNBQUwsRUFBaEI7QUFDQSxXQUFLRSxTQUFMO0FBQ0FILE1BQUFBLElBQUksQ0FBQ0ksTUFBTCxHQUFjLElBQWQ7QUFDQSxXQUFLQyxhQUFMLENBQW1CTCxJQUFuQixFQUF5QkUsT0FBekI7QUFDQUYsTUFBQUEsSUFBSSxDQUFDSSxNQUFMLEdBQWMsS0FBS0UsS0FBTCxDQUFXRixNQUF6QjtBQUNBLGFBQU9KLElBQVA7QUFDRDs7OztFQWhDaUNPLHFCOzs7O0FBbUNwQyxTQUFTWixVQUFULENBQW9CRCxPQUFwQixFQUFxRDtBQUNuRCxNQUFNYyxTQUFxQixHQUFHLElBQUlDLEdBQUosRUFBOUI7O0FBRG1ELDZDQUU5QmYsT0FGOEI7QUFBQTs7QUFBQTtBQUVuRCx3REFBOEI7QUFBQSxVQUFuQmdCLE1BQW1COztBQUM1QixpQkFBd0JDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixNQUFkLElBQXdCQSxNQUF4QixHQUFpQyxDQUFDQSxNQUFELEVBQVMsRUFBVCxDQUF6RDtBQUFBO0FBQUEsVUFBT0csSUFBUDtBQUFBLFVBQWF0QixPQUFiOztBQUNBLFVBQUksQ0FBQ2lCLFNBQVMsQ0FBQ00sR0FBVixDQUFjRCxJQUFkLENBQUwsRUFBMEJMLFNBQVMsQ0FBQ08sR0FBVixDQUFjRixJQUFkLEVBQW9CdEIsT0FBTyxJQUFJLEVBQS9CO0FBQzNCO0FBTGtEO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTW5ELFNBQU9pQixTQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IE9wdGlvbnMgfSBmcm9tIFwiLi4vb3B0aW9uc1wiO1xuaW1wb3J0IHR5cGUgeyBGaWxlIC8qOjosIEpTWE9wZW5pbmdFbGVtZW50ICovIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbkxpc3QgfSBmcm9tIFwiLi4vcGx1Z2luLXV0aWxzXCI7XG5pbXBvcnQgeyBnZXRPcHRpb25zIH0gZnJvbSBcIi4uL29wdGlvbnNcIjtcbmltcG9ydCBTdGF0ZW1lbnRQYXJzZXIgZnJvbSBcIi4vc3RhdGVtZW50XCI7XG5pbXBvcnQgU2NvcGVIYW5kbGVyIGZyb20gXCIuLi91dGlsL3Njb3BlXCI7XG5cbmV4cG9ydCB0eXBlIFBsdWdpbnNNYXAgPSBNYXA8c3RyaW5nLCB7IFtzdHJpbmddOiBhbnkgfT47XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlciBleHRlbmRzIFN0YXRlbWVudFBhcnNlciB7XG4gIC8vIEZvcndhcmQtZGVjbGFyYXRpb24gc28gdHlwZXNjcmlwdCBwbHVnaW4gY2FuIG92ZXJyaWRlIGpzeCBwbHVnaW5cbiAgLyo6OlxuICAranN4UGFyc2VPcGVuaW5nRWxlbWVudEFmdGVyTmFtZTogKFxuICAgIG5vZGU6IEpTWE9wZW5pbmdFbGVtZW50LFxuICApID0+IEpTWE9wZW5pbmdFbGVtZW50O1xuICAqL1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6ID9PcHRpb25zLCBpbnB1dDogc3RyaW5nKSB7XG4gICAgb3B0aW9ucyA9IGdldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgc3VwZXIob3B0aW9ucywgaW5wdXQpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmluaXRpYWxpemVTY29wZXMoKTtcbiAgICB0aGlzLnBsdWdpbnMgPSBwbHVnaW5zTWFwKHRoaXMub3B0aW9ucy5wbHVnaW5zKTtcbiAgICB0aGlzLmZpbGVuYW1lID0gb3B0aW9ucy5zb3VyY2VGaWxlbmFtZTtcbiAgfVxuXG4gIC8vIFRoaXMgY2FuIGJlIG92ZXJ3cml0dGVuLCBmb3IgZXhhbXBsZSwgYnkgdGhlIFR5cGVTY3JpcHQgcGx1Z2luLlxuICBnZXRTY29wZUhhbmRsZXIoKTogQ2xhc3M8U2NvcGVIYW5kbGVyPCo+PiB7XG4gICAgcmV0dXJuIFNjb3BlSGFuZGxlcjtcbiAgfVxuXG4gIHBhcnNlKCk6IEZpbGUge1xuICAgIHRoaXMuZW50ZXJJbml0aWFsU2NvcGVzKCk7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgY29uc3QgcHJvZ3JhbSA9IHRoaXMuc3RhcnROb2RlKCk7XG4gICAgdGhpcy5uZXh0VG9rZW4oKTtcbiAgICBmaWxlLmVycm9ycyA9IG51bGw7XG4gICAgdGhpcy5wYXJzZVRvcExldmVsKGZpbGUsIHByb2dyYW0pO1xuICAgIGZpbGUuZXJyb3JzID0gdGhpcy5zdGF0ZS5lcnJvcnM7XG4gICAgcmV0dXJuIGZpbGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGx1Z2luc01hcChwbHVnaW5zOiBQbHVnaW5MaXN0KTogUGx1Z2luc01hcCB7XG4gIGNvbnN0IHBsdWdpbk1hcDogUGx1Z2luc01hcCA9IG5ldyBNYXAoKTtcbiAgZm9yIChjb25zdCBwbHVnaW4gb2YgcGx1Z2lucykge1xuICAgIGNvbnN0IFtuYW1lLCBvcHRpb25zXSA9IEFycmF5LmlzQXJyYXkocGx1Z2luKSA/IHBsdWdpbiA6IFtwbHVnaW4sIHt9XTtcbiAgICBpZiAoIXBsdWdpbk1hcC5oYXMobmFtZSkpIHBsdWdpbk1hcC5zZXQobmFtZSwgb3B0aW9ucyB8fCB7fSk7XG4gIH1cbiAgcmV0dXJuIHBsdWdpbk1hcDtcbn1cbiJdfQ==