"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;
exports.parseExpression = parseExpression;
Object.defineProperty(exports, "tokTypes", {
  enumerable: true,
  get: function get() {
    return _types.types;
  }
});

var _pluginUtils = require("./plugin-utils");

var _parser = _interopRequireDefault(require("./parser"));

var _types = require("./tokenizer/types");

require("./tokenizer/context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parse(input, options) {
  var _options;

  if (((_options = options) === null || _options === void 0 ? void 0 : _options.sourceType) === "unambiguous") {
    options = _objectSpread({}, options);

    try {
      options.sourceType = "module";
      var parser = getParser(options, input);
      var ast = parser.parse();

      if (parser.sawUnambiguousESM) {
        return ast;
      }

      if (parser.ambiguousScriptDifferentAst) {
        // Top level await introduces code which can be both a valid script and
        // a valid module, but which produces different ASTs:
        //    await
        //    0
        // can be parsed either as an AwaitExpression, or as two ExpressionStatements.
        try {
          options.sourceType = "script";
          return getParser(options, input).parse();
        } catch (_unused) {}
      } else {
        // This is both a valid module and a valid script, but
        // we parse it as a script by default
        ast.program.sourceType = "script";
      }

      return ast;
    } catch (moduleError) {
      try {
        options.sourceType = "script";
        return getParser(options, input).parse();
      } catch (_unused2) {}

      throw moduleError;
    }
  } else {
    return getParser(options, input).parse();
  }
}

function parseExpression(input, options) {
  var parser = getParser(options, input);

  if (parser.options.strictMode) {
    parser.state.strict = true;
  }

  return parser.getExpression();
}

function getParser(options, input) {
  var cls = _parser["default"];

  if (options !== null && options !== void 0 && options.plugins) {
    (0, _pluginUtils.validatePlugins)(options.plugins);
    cls = getParserClass(options.plugins);
  }

  return new cls(options, input);
}

var parserClassCache = {};
/** Get a Parser class with plugins applied. */

function getParserClass(pluginsFromOptions) {
  var pluginList = _pluginUtils.mixinPluginNames.filter(function (name) {
    return (0, _pluginUtils.hasPlugin)(pluginsFromOptions, name);
  });

  var key = pluginList.join("/");
  var cls = parserClassCache[key];

  if (!cls) {
    cls = _parser["default"];
    /*
    probeClass(cls.prototype, 'parser');
    probeClass(cls.prototype.__proto__, 'statement');
    probeClass(cls.prototype.__proto__.__proto__, 'expression');
    probeClass(cls.prototype.__proto__.__proto__.__proto__, 'lval');
    //*/

    var _iterator = _createForOfIteratorHelper(pluginList),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var plugin = _step.value;
        cls = _pluginUtils.mixinPlugins[plugin](cls); //probeClass(cls.prototype, plugin);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    parserClassCache[key] = cls;
  }

  return cls;
}

var d = 0;

var probeClass = function probeClass(proto, name) {
  var _iterator2 = _createForOfIteratorHelper(Object.getOwnPropertyNames(proto)),
      _step2;

  try {
    var _loop = function _loop() {
      var k = _step2.value;
      if (k === 'constructor') return "continue";
      var f = proto[k];

      if (typeof f === 'function') {
        proto[k] = function () {
          var prefix = d ? " ".repeat(d) : '';

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          console.log(prefix, name, k, args);
          d++;
          var v = f.apply(this, args);
          d--;
          console.log(prefix, '=>', name, k, v);
          return v;
        };
      }
    };

    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJwYXJzZSIsImlucHV0Iiwib3B0aW9ucyIsInNvdXJjZVR5cGUiLCJwYXJzZXIiLCJnZXRQYXJzZXIiLCJhc3QiLCJzYXdVbmFtYmlndW91c0VTTSIsImFtYmlndW91c1NjcmlwdERpZmZlcmVudEFzdCIsInByb2dyYW0iLCJtb2R1bGVFcnJvciIsInBhcnNlRXhwcmVzc2lvbiIsInN0cmljdE1vZGUiLCJzdGF0ZSIsInN0cmljdCIsImdldEV4cHJlc3Npb24iLCJjbHMiLCJQYXJzZXIiLCJwbHVnaW5zIiwiZ2V0UGFyc2VyQ2xhc3MiLCJwYXJzZXJDbGFzc0NhY2hlIiwicGx1Z2luc0Zyb21PcHRpb25zIiwicGx1Z2luTGlzdCIsIm1peGluUGx1Z2luTmFtZXMiLCJmaWx0ZXIiLCJuYW1lIiwia2V5Iiwiam9pbiIsInBsdWdpbiIsIm1peGluUGx1Z2lucyIsImQiLCJwcm9iZUNsYXNzIiwicHJvdG8iLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiayIsImYiLCJwcmVmaXgiLCJyZXBlYXQiLCJhcmdzIiwiY29uc29sZSIsImxvZyIsInYiLCJhcHBseSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFHQTs7QUFPQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQUlPLFNBQVNBLEtBQVQsQ0FBZUMsS0FBZixFQUE4QkMsT0FBOUIsRUFBdUQ7QUFBQTs7QUFDNUQsTUFBSSxhQUFBQSxPQUFPLFVBQVAsNENBQVNDLFVBQVQsTUFBd0IsYUFBNUIsRUFBMkM7QUFDekNELElBQUFBLE9BQU8scUJBQ0ZBLE9BREUsQ0FBUDs7QUFHQSxRQUFJO0FBQ0ZBLE1BQUFBLE9BQU8sQ0FBQ0MsVUFBUixHQUFxQixRQUFyQjtBQUNBLFVBQU1DLE1BQU0sR0FBR0MsU0FBUyxDQUFDSCxPQUFELEVBQVVELEtBQVYsQ0FBeEI7QUFDQSxVQUFNSyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0osS0FBUCxFQUFaOztB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OztBQUNBLElBQU1DLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQUNDLEtBQUQsRUFBYVAsSUFBYixFQUE4QjtBQUFBLDhDQUNqQ1EsTUFBTSxDQUFDQyxtQkFBUCxDQUEyQkYsS0FBM0IsQ0FEaUM7QUFBQTs7QUFBQTtBQUFBO0FBQUEsVUFDdENHLENBRHNDO0FBRTdDLFVBQUlBLENBQUMsS0FBSyxhQUFWLEVBQXlCO0FBQ3pCLFVBQU1DLENBQUMsR0FBR0osS0FBSyxDQUFDRyxDQUFELENBQWY7O0FBQ0EsVUFBSSxPQUFPQyxDQUFQLEtBQWEsVUFBakIsRUFBNkI7QUFDM0JKLFFBQUFBLEtBQUssQ0FBQ0csQ0FBRCxDQUFMLEdBQVcsWUFBMEI7QUFDbkMsY0FBTUUsTUFBTSxHQUFHUCxDQUFDLEdBQUcsSUFBSVEsTUFBSixDQUFXUixDQUFYLENBQUgsR0FBbUIsRUFBbkM7O0FBRG1DLDRDQUFiUyxJQUFhO0FBQWJBLFlBQUFBLElBQWE7QUFBQTs7QUFFbkNDLFVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZSixNQUFaLEVBQW9CWixJQUFwQixFQUEwQlUsQ0FBMUIsRUFBNkJJLElBQTdCO0FBQ0FULFVBQUFBLENBQUM7QUFDRCxjQUFNWSxDQUFDLEdBQUdOLENBQUMsQ0FBQ08sS0FBRixDQUFRLElBQVIsRUFBY0osSUFBZCxDQUFWO0FBQ0FULFVBQUFBLENBQUM7QUFDRFUsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlKLE1BQVosRUFBb0IsSUFBcEIsRUFBMEJaLElBQTFCLEVBQWdDVSxDQUFoQyxFQUFtQ08sQ0FBbkM7QUFDQSxpQkFBT0EsQ0FBUDtBQUNELFNBUkQ7QUFTRDtBQWQ0Qzs7QUFDL0MsMkRBQWlEO0FBQUE7O0FBQUEsK0JBQ3RCO0FBYTFCO0FBZjhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFnQmhELENBaEJEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgdHlwZSBPcHRpb25zIH0gZnJvbSBcIi4vb3B0aW9uc1wiO1xuaW1wb3J0IHtcbiAgaGFzUGx1Z2luLFxuICB2YWxpZGF0ZVBsdWdpbnMsXG4gIG1peGluUGx1Z2luTmFtZXMsXG4gIG1peGluUGx1Z2lucyxcbiAgdHlwZSBQbHVnaW5MaXN0LFxufSBmcm9tIFwiLi9wbHVnaW4tdXRpbHNcIjtcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vcGFyc2VyXCI7XG5cbmltcG9ydCB7IHR5cGVzIGFzIHRva1R5cGVzIH0gZnJvbSBcIi4vdG9rZW5pemVyL3R5cGVzXCI7XG5pbXBvcnQgXCIuL3Rva2VuaXplci9jb250ZXh0XCI7XG5cbmltcG9ydCB0eXBlIHsgRXhwcmVzc2lvbiwgRmlsZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShpbnB1dDogc3RyaW5nLCBvcHRpb25zPzogT3B0aW9ucyk6IEZpbGUge1xuICBpZiAob3B0aW9ucz8uc291cmNlVHlwZSA9PT0gXCJ1bmFtYmlndW91c1wiKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgb3B0aW9ucy5zb3VyY2VUeXBlID0gXCJtb2R1bGVcIjtcbiAgICAgIGNvbnN0IHBhcnNlciA9IGdldFBhcnNlcihvcHRpb25zLCBpbnB1dCk7XG4gICAgICBjb25zdCBhc3QgPSBwYXJzZXIucGFyc2UoKTtcblxuICAgICAgaWYgKHBhcnNlci5zYXdVbmFtYmlndW91c0VTTSkge1xuICAgICAgICByZXR1cm4gYXN0O1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VyLmFtYmlndW91c1NjcmlwdERpZmZlcmVudEFzdCkge1xuICAgICAgICAvLyBUb3AgbGV2ZWwgYXdhaXQgaW50cm9kdWNlcyBjb2RlIHdoaWNoIGNhbiBiZSBib3RoIGEgdmFsaWQgc2NyaXB0IGFuZFxuICAgICAgICAvLyBhIHZhbGlkIG1vZHVsZSwgYnV0IHdoaWNoIHByb2R1Y2VzIGRpZmZlcmVudCBBU1RzOlxuICAgICAgICAvLyAgICBhd2FpdFxuICAgICAgICAvLyAgICAwXG4gICAgICAgIC8vIGNhbiBiZSBwYXJzZWQgZWl0aGVyIGFzIGFuIEF3YWl0RXhwcmVzc2lvbiwgb3IgYXMgdHdvIEV4cHJlc3Npb25TdGF0ZW1lbnRzLlxuICAgICAgICB0cnkge1xuICAgICAgICAgIG9wdGlvbnMuc291cmNlVHlwZSA9IFwic2NyaXB0XCI7XG4gICAgICAgICAgcmV0dXJuIGdldFBhcnNlcihvcHRpb25zLCBpbnB1dCkucGFyc2UoKTtcbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyBpcyBib3RoIGEgdmFsaWQgbW9kdWxlIGFuZCBhIHZhbGlkIHNjcmlwdCwgYnV0XG4gICAgICAgIC8vIHdlIHBhcnNlIGl0IGFzIGEgc2NyaXB0IGJ5IGRlZmF1bHRcbiAgICAgICAgYXN0LnByb2dyYW0uc291cmNlVHlwZSA9IFwic2NyaXB0XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhc3Q7XG4gICAgfSBjYXRjaCAobW9kdWxlRXJyb3IpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIG9wdGlvbnMuc291cmNlVHlwZSA9IFwic2NyaXB0XCI7XG4gICAgICAgIHJldHVybiBnZXRQYXJzZXIob3B0aW9ucywgaW5wdXQpLnBhcnNlKCk7XG4gICAgICB9IGNhdGNoIHt9XG5cbiAgICAgIHRocm93IG1vZHVsZUVycm9yO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2V0UGFyc2VyKG9wdGlvbnMsIGlucHV0KS5wYXJzZSgpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oaW5wdXQ6IHN0cmluZywgb3B0aW9ucz86IE9wdGlvbnMpOiBFeHByZXNzaW9uIHtcbiAgY29uc3QgcGFyc2VyID0gZ2V0UGFyc2VyKG9wdGlvbnMsIGlucHV0KTtcbiAgaWYgKHBhcnNlci5vcHRpb25zLnN0cmljdE1vZGUpIHtcbiAgICBwYXJzZXIuc3RhdGUuc3RyaWN0ID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcGFyc2VyLmdldEV4cHJlc3Npb24oKTtcbn1cblxuZXhwb3J0IHsgdG9rVHlwZXMgfTtcblxuZnVuY3Rpb24gZ2V0UGFyc2VyKG9wdGlvbnM6ID9PcHRpb25zLCBpbnB1dDogc3RyaW5nKTogUGFyc2VyIHtcbiAgbGV0IGNscyA9IFBhcnNlcjtcbiAgaWYgKG9wdGlvbnM/LnBsdWdpbnMpIHtcbiAgICB2YWxpZGF0ZVBsdWdpbnMob3B0aW9ucy5wbHVnaW5zKTtcbiAgICBjbHMgPSBnZXRQYXJzZXJDbGFzcyhvcHRpb25zLnBsdWdpbnMpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBjbHMob3B0aW9ucywgaW5wdXQpO1xufVxuXG5jb25zdCBwYXJzZXJDbGFzc0NhY2hlOiB7IFtrZXk6IHN0cmluZ106IENsYXNzPFBhcnNlcj4gfSA9IHt9O1xuXG4vKiogR2V0IGEgUGFyc2VyIGNsYXNzIHdpdGggcGx1Z2lucyBhcHBsaWVkLiAqL1xuZnVuY3Rpb24gZ2V0UGFyc2VyQ2xhc3MocGx1Z2luc0Zyb21PcHRpb25zOiBQbHVnaW5MaXN0KTogQ2xhc3M8UGFyc2VyPiB7XG4gIGNvbnN0IHBsdWdpbkxpc3QgPSBtaXhpblBsdWdpbk5hbWVzLmZpbHRlcihuYW1lID0+XG4gICAgaGFzUGx1Z2luKHBsdWdpbnNGcm9tT3B0aW9ucywgbmFtZSksXG4gICk7XG5cbiAgY29uc3Qga2V5ID0gcGx1Z2luTGlzdC5qb2luKFwiL1wiKTtcbiAgbGV0IGNscyA9IHBhcnNlckNsYXNzQ2FjaGVba2V5XTtcbiAgaWYgKCFjbHMpIHtcbiAgICBjbHMgPSBQYXJzZXI7XG5cbiAgICAvKlxuICAgIHByb2JlQ2xhc3MoY2xzLnByb3RvdHlwZSwgJ3BhcnNlcicpO1xuICAgIHByb2JlQ2xhc3MoY2xzLnByb3RvdHlwZS5fX3Byb3RvX18sICdzdGF0ZW1lbnQnKTtcbiAgICBwcm9iZUNsYXNzKGNscy5wcm90b3R5cGUuX19wcm90b19fLl9fcHJvdG9fXywgJ2V4cHJlc3Npb24nKTtcbiAgICBwcm9iZUNsYXNzKGNscy5wcm90b3R5cGUuX19wcm90b19fLl9fcHJvdG9fXy5fX3Byb3RvX18sICdsdmFsJyk7XG4gICAgLy8qL1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgcGx1Z2luTGlzdCkge1xuICAgICAgY2xzID0gbWl4aW5QbHVnaW5zW3BsdWdpbl0oY2xzKTtcbiAgICAgIC8vcHJvYmVDbGFzcyhjbHMucHJvdG90eXBlLCBwbHVnaW4pO1xuICAgIH1cbiAgICBwYXJzZXJDbGFzc0NhY2hlW2tleV0gPSBjbHM7XG4gIH1cbiAgXG4gIHJldHVybiBjbHM7XG59XG5cbmxldCBkID0gMDtcbmNvbnN0IHByb2JlQ2xhc3MgPSAocHJvdG86IGFueSwgbmFtZTogc3RyaW5nKSA9PiB7XG4gIGZvciAobGV0IGsgb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pKSB7XG4gICAgaWYgKGsgPT09ICdjb25zdHJ1Y3RvcicpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGYgPSBwcm90b1trXTtcbiAgICBpZiAodHlwZW9mIGYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByb3RvW2tdID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IGQgPyBcIiBcIi5yZXBlYXQoZCkgOiAnJzsgXG4gICAgICAgIGNvbnNvbGUubG9nKHByZWZpeCwgbmFtZSwgaywgYXJncyk7XG4gICAgICAgIGQrKztcbiAgICAgICAgY29uc3QgdiA9IGYuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIGQtLTtcbiAgICAgICAgY29uc29sZS5sb2cocHJlZml4LCAnPT4nLCBuYW1lLCBrLCB2KTtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=