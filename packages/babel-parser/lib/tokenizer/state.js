"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var N = _interopRequireWildcard(require("../types"));

var _location = require("../util/location");

var _context = require("./context");

var _types2 = require("./types");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var State = /*#__PURE__*/function () {
  function State() {
    _classCallCheck(this, State);

    _defineProperty(this, "strict", void 0);

    _defineProperty(this, "curLine", void 0);

    _defineProperty(this, "startLoc", void 0);

    _defineProperty(this, "endLoc", void 0);

    _defineProperty(this, "errors", []);

    _defineProperty(this, "potentialArrowAt", -1);

    _defineProperty(this, "noArrowAt", []);

    _defineProperty(this, "noArrowParamsConversionAt", []);

    _defineProperty(this, "maybeInArrowParameters", false);

    _defineProperty(this, "inPipeline", false);

    _defineProperty(this, "inType", false);

    _defineProperty(this, "noAnonFunctionType", false);

    _defineProperty(this, "inPropertyName", false);

    _defineProperty(this, "hasFlowComment", false);

    _defineProperty(this, "isAmbientContext", false);

    _defineProperty(this, "inAbstractClass", false);

    _defineProperty(this, "topicContext", {
      maxNumOfResolvableTopics: 0,
      maxTopicIndex: null
    });

    _defineProperty(this, "soloAwait", false);

    _defineProperty(this, "inFSharpPipelineDirectBody", false);

    _defineProperty(this, "labels", []);

    _defineProperty(this, "decoratorStack", [[]]);

    _defineProperty(this, "comments", []);

    _defineProperty(this, "trailingComments", []);

    _defineProperty(this, "leadingComments", []);

    _defineProperty(this, "commentStack", []);

    _defineProperty(this, "commentPreviousNode", null);

    _defineProperty(this, "pos", 0);

    _defineProperty(this, "lineStart", 0);

    _defineProperty(this, "type", _types2.types.eof);

    _defineProperty(this, "value", null);

    _defineProperty(this, "start", 0);

    _defineProperty(this, "end", 0);

    _defineProperty(this, "lastTokEndLoc", null);

    _defineProperty(this, "lastTokStartLoc", null);

    _defineProperty(this, "lastTokStart", 0);

    _defineProperty(this, "lastTokEnd", 0);

    _defineProperty(this, "context", [_context.types.brace]);

    _defineProperty(this, "exprAllowed", true);

    _defineProperty(this, "containsEsc", false);

    _defineProperty(this, "strictErrors", new Map());

    _defineProperty(this, "tokensLength", 0);
  }

  _createClass(State, [{
    key: "init",
    value: function init(options) {
      this.strict = options.strictMode === false ? false : options.sourceType === "module";
      this.curLine = options.startLine;
      this.startLoc = this.endLoc = this.curPosition();
    }
  }, {
    key: "curPosition",
    value: function curPosition() {
      return new _location.Position(this.curLine, this.pos - this.lineStart);
    }
  }, {
    key: "clone",
    value: function clone(skipArrays) {
      var state = new State();
      var keys = Object.keys(this);

      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i]; // $FlowIgnore

        var val = this[key];

        if (!skipArrays && Array.isArray(val)) {
          val = val.slice();
        } // $FlowIgnore


        state[key] = val;
      }

      return state;
    }
  }]);

  return State;
}();

exports["default"] = State;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbml6ZXIvc3RhdGUuanMiXSwibmFtZXMiOlsiU3RhdGUiLCJtYXhOdW1PZlJlc29sdmFibGVUb3BpY3MiLCJtYXhUb3BpY0luZGV4IiwidHQiLCJlb2YiLCJjdCIsImJyYWNlIiwiTWFwIiwib3B0aW9ucyIsInN0cmljdCIsInN0cmljdE1vZGUiLCJzb3VyY2VUeXBlIiwiY3VyTGluZSIsInN0YXJ0TGluZSIsInN0YXJ0TG9jIiwiZW5kTG9jIiwiY3VyUG9zaXRpb24iLCJQb3NpdGlvbiIsInBvcyIsImxpbmVTdGFydCIsInNraXBBcnJheXMiLCJzdGF0ZSIsImtleXMiLCJPYmplY3QiLCJpIiwibGVuZ3RoIiwia2V5IiwidmFsIiwiQXJyYXkiLCJpc0FycmF5Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7OztJQWdCcUJBLEs7Ozs7Ozs7Ozs7OztvQ0FpQk0sRTs7OENBR0UsQ0FBQyxDOzt1Q0FNTixFOzt1REFRZ0IsRTs7b0RBR0osSzs7d0NBQ1osSzs7b0NBQ0osSzs7Z0RBQ1ksSzs7NENBQ0osSzs7NENBQ0EsSzs7OENBQ0UsSzs7NkNBQ0QsSzs7MENBR087QUFDaENDLE1BQUFBLHdCQUF3QixFQUFFLENBRE07QUFFaENDLE1BQUFBLGFBQWEsRUFBRTtBQUZpQixLOzt1Q0FNYixLOzt3REFDaUIsSzs7b0NBT2pDLEU7OzRDQUt1QyxDQUFDLEVBQUQsQzs7c0NBR2YsRTs7OENBR1EsRTs7NkNBQ0QsRTs7MENBTS9CLEU7O2lEQUV5QixJOztpQ0FHaEIsQzs7dUNBQ00sQzs7a0NBSUZDLGNBQUdDLEc7O21DQUdSLEk7O21DQUdHLEM7O2lDQUNGLEM7OzJDQUlZLEk7OzZDQUVFLEk7OzBDQUNMLEM7O3dDQUNGLEM7O3FDQUlRLENBQUNDLGVBQUdDLEtBQUosQzs7eUNBRU4sSTs7eUNBS0EsSzs7MENBVW9CLElBQUlDLEdBQUosRTs7MENBR3BCLEM7Ozs7O1dBdkh2QixjQUFLQyxPQUFMLEVBQTZCO0FBQzNCLFdBQUtDLE1BQUwsR0FDRUQsT0FBTyxDQUFDRSxVQUFSLEtBQXVCLEtBQXZCLEdBQStCLEtBQS9CLEdBQXVDRixPQUFPLENBQUNHLFVBQVIsS0FBdUIsUUFEaEU7QUFHQSxXQUFLQyxPQUFMLEdBQWVKLE9BQU8sQ0FBQ0ssU0FBdkI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLEtBQUtDLE1BQUwsR0FBYyxLQUFLQyxXQUFMLEVBQTlCO0FBQ0Q7OztXQW1IRCx1QkFBd0I7QUFDdEIsYUFBTyxJQUFJQyxrQkFBSixDQUFhLEtBQUtMLE9BQWxCLEVBQTJCLEtBQUtNLEdBQUwsR0FBVyxLQUFLQyxTQUEzQyxDQUFQO0FBQ0Q7OztXQUVELGVBQU1DLFVBQU4sRUFBbUM7QUFDakMsVUFBTUMsS0FBSyxHQUFHLElBQUlyQixLQUFKLEVBQWQ7QUFDQSxVQUFNc0IsSUFBSSxHQUFHQyxNQUFNLENBQUNELElBQVAsQ0FBWSxJQUFaLENBQWI7O0FBQ0EsV0FBSyxJQUFJRSxDQUFDLEdBQUcsQ0FBUixFQUFXQyxNQUFNLEdBQUdILElBQUksQ0FBQ0csTUFBOUIsRUFBc0NELENBQUMsR0FBR0MsTUFBMUMsRUFBa0RELENBQUMsRUFBbkQsRUFBdUQ7QUFDckQsWUFBTUUsR0FBRyxHQUFHSixJQUFJLENBQUNFLENBQUQsQ0FBaEIsQ0FEcUQsQ0FFckQ7O0FBQ0EsWUFBSUcsR0FBRyxHQUFHLEtBQUtELEdBQUwsQ0FBVjs7QUFFQSxZQUFJLENBQUNOLFVBQUQsSUFBZVEsS0FBSyxDQUFDQyxPQUFOLENBQWNGLEdBQWQsQ0FBbkIsRUFBdUM7QUFDckNBLFVBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDRyxLQUFKLEVBQU47QUFDRCxTQVBvRCxDQVNyRDs7O0FBQ0FULFFBQUFBLEtBQUssQ0FBQ0ssR0FBRCxDQUFMLEdBQWFDLEdBQWI7QUFDRDs7QUFFRCxhQUFPTixLQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IE9wdGlvbnMgfSBmcm9tIFwiLi4vb3B0aW9uc1wiO1xuaW1wb3J0ICogYXMgTiBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IFBvc2l0aW9uIH0gZnJvbSBcIi4uL3V0aWwvbG9jYXRpb25cIjtcblxuaW1wb3J0IHsgdHlwZXMgYXMgY3QsIHR5cGUgVG9rQ29udGV4dCB9IGZyb20gXCIuL2NvbnRleHRcIjtcbmltcG9ydCB7IHR5cGVzIGFzIHR0LCB0eXBlIFRva2VuVHlwZSB9IGZyb20gXCIuL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFBhcnNpbmdFcnJvciwgRXJyb3JUZW1wbGF0ZSB9IGZyb20gXCIuLi9wYXJzZXIvZXJyb3JcIjtcblxudHlwZSBUb3BpY0NvbnRleHRTdGF0ZSA9IHtcbiAgLy8gV2hlbiBhIHRvcGljIGJpbmRpbmcgaGFzIGJlZW4gY3VycmVudGx5IGVzdGFibGlzaGVkLFxuICAvLyB0aGVuIHRoaXMgaXMgMS4gT3RoZXJ3aXNlLCBpdCBpcyAwLiBUaGlzIGlzIGZvcndhcmRzIGNvbXBhdGlibGVcbiAgLy8gd2l0aCBhIGZ1dHVyZSBwbHVnaW4gZm9yIG11bHRpcGxlIGxleGljYWwgdG9waWNzLlxuICBtYXhOdW1PZlJlc29sdmFibGVUb3BpY3M6IG51bWJlcixcblxuICAvLyBXaGVuIGEgdG9waWMgYmluZGluZyBoYXMgYmVlbiBjdXJyZW50bHkgZXN0YWJsaXNoZWQsIGFuZCBpZiB0aGF0IGJpbmRpbmdcbiAgLy8gaGFzIGJlZW4gdXNlZCBhcyBhIHRvcGljIHJlZmVyZW5jZSBgI2AsIHRoZW4gdGhpcyBpcyAwLiBPdGhlcndpc2UsIGl0IGlzXG4gIC8vIGBudWxsYC4gVGhpcyBpcyBmb3J3YXJkcyBjb21wYXRpYmxlIHdpdGggYSBmdXR1cmUgcGx1Z2luIGZvciBtdWx0aXBsZVxuICAvLyBsZXhpY2FsIHRvcGljcy5cbiAgbWF4VG9waWNJbmRleDogbnVsbCB8IDAsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZSB7XG4gIHN0cmljdDogYm9vbGVhbjtcbiAgY3VyTGluZTogbnVtYmVyO1xuXG4gIC8vIEFuZCwgaWYgbG9jYXRpb25zIGFyZSB1c2VkLCB0aGUge2xpbmUsIGNvbHVtbn0gb2JqZWN0XG4gIC8vIGNvcnJlc3BvbmRpbmcgdG8gdGhvc2Ugb2Zmc2V0c1xuICBzdGFydExvYzogUG9zaXRpb247XG4gIGVuZExvYzogUG9zaXRpb247XG5cbiAgaW5pdChvcHRpb25zOiBPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5zdHJpY3QgPVxuICAgICAgb3B0aW9ucy5zdHJpY3RNb2RlID09PSBmYWxzZSA/IGZhbHNlIDogb3B0aW9ucy5zb3VyY2VUeXBlID09PSBcIm1vZHVsZVwiO1xuXG4gICAgdGhpcy5jdXJMaW5lID0gb3B0aW9ucy5zdGFydExpbmU7XG4gICAgdGhpcy5zdGFydExvYyA9IHRoaXMuZW5kTG9jID0gdGhpcy5jdXJQb3NpdGlvbigpO1xuICB9XG5cbiAgZXJyb3JzOiBQYXJzaW5nRXJyb3JbXSA9IFtdO1xuXG4gIC8vIFVzZWQgdG8gc2lnbmlmeSB0aGUgc3RhcnQgb2YgYSBwb3RlbnRpYWwgYXJyb3cgZnVuY3Rpb25cbiAgcG90ZW50aWFsQXJyb3dBdDogbnVtYmVyID0gLTE7XG5cbiAgLy8gVXNlZCB0byBzaWduaWZ5IHRoZSBzdGFydCBvZiBhbiBleHByZXNzaW9uIHdoaWNoIGxvb2tzIGxpa2UgYVxuICAvLyB0eXBlZCBhcnJvdyBmdW5jdGlvbiwgYnV0IGl0IGlzbid0XG4gIC8vIGUuZy4gYSA/IChiKSA6IGMgPT4gZFxuICAvLyAgICAgICAgICBeXG4gIG5vQXJyb3dBdDogbnVtYmVyW10gPSBbXTtcblxuICAvLyBVc2VkIHRvIHNpZ25pZnkgdGhlIHN0YXJ0IG9mIGFuIGV4cHJlc3Npb24gd2hvc2UgcGFyYW1zLCBpZiBpdCBsb29rcyBsaWtlXG4gIC8vIGFuIGFycm93IGZ1bmN0aW9uLCBzaG91bGRuJ3QgYmUgY29udmVydGVkIHRvIGFzc2lnbmFibGUgbm9kZXMuXG4gIC8vIFRoaXMgaXMgdXNlZCB0byBkZWZlciB0aGUgdmFsaWRhdGlvbiBvZiB0eXBlZCBhcnJvdyBmdW5jdGlvbnMgaW5zaWRlXG4gIC8vIGNvbmRpdGlvbmFsIGV4cHJlc3Npb25zLlxuICAvLyBlLmcuIGEgPyAoYikgOiBjID0+IGRcbiAgLy8gICAgICAgICAgXlxuICBub0Fycm93UGFyYW1zQ29udmVyc2lvbkF0OiBudW1iZXJbXSA9IFtdO1xuXG4gIC8vIEZsYWdzIHRvIHRyYWNrXG4gIG1heWJlSW5BcnJvd1BhcmFtZXRlcnM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaW5QaXBlbGluZTogYm9vbGVhbiA9IGZhbHNlO1xuICBpblR5cGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgbm9Bbm9uRnVuY3Rpb25UeXBlOiBib29sZWFuID0gZmFsc2U7XG4gIGluUHJvcGVydHlOYW1lOiBib29sZWFuID0gZmFsc2U7XG4gIGhhc0Zsb3dDb21tZW50OiBib29sZWFuID0gZmFsc2U7XG4gIGlzQW1iaWVudENvbnRleHQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaW5BYnN0cmFjdENsYXNzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gRm9yIHRoZSBzbWFydFBpcGVsaW5lcyBwbHVnaW46XG4gIHRvcGljQ29udGV4dDogVG9waWNDb250ZXh0U3RhdGUgPSB7XG4gICAgbWF4TnVtT2ZSZXNvbHZhYmxlVG9waWNzOiAwLFxuICAgIG1heFRvcGljSW5kZXg6IG51bGwsXG4gIH07XG5cbiAgLy8gRm9yIHRoZSBGIyBwbHVnaW5cbiAgc29sb0F3YWl0OiBib29sZWFuID0gZmFsc2U7XG4gIGluRlNoYXJwUGlwZWxpbmVEaXJlY3RCb2R5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gTGFiZWxzIGluIHNjb3BlLlxuICBsYWJlbHM6IEFycmF5PHtcbiAgICBraW5kOiA/KFwibG9vcFwiIHwgXCJzd2l0Y2hcIiksXG4gICAgbmFtZT86ID9zdHJpbmcsXG4gICAgc3RhdGVtZW50U3RhcnQ/OiBudW1iZXIsXG4gIH0+ID0gW107XG5cbiAgLy8gTGVhZGluZyBkZWNvcmF0b3JzLiBMYXN0IGVsZW1lbnQgb2YgdGhlIHN0YWNrIHJlcHJlc2VudHMgdGhlIGRlY29yYXRvcnMgaW4gY3VycmVudCBjb250ZXh0LlxuICAvLyBTdXBwb3J0cyBuZXN0aW5nIG9mIGRlY29yYXRvcnMsIGUuZy4gQGZvbyhAYmFyIGNsYXNzIGlubmVyIHt9KSBjbGFzcyBvdXRlciB7fVxuICAvLyB3aGVyZSBAZm9vIGJlbG9uZ3MgdG8gdGhlIG91dGVyIGNsYXNzIGFuZCBAYmFyIHRvIHRoZSBpbm5lclxuICBkZWNvcmF0b3JTdGFjazogQXJyYXk8QXJyYXk8Ti5EZWNvcmF0b3I+PiA9IFtbXV07XG5cbiAgLy8gQ29tbWVudCBzdG9yZS5cbiAgY29tbWVudHM6IEFycmF5PE4uQ29tbWVudD4gPSBbXTtcblxuICAvLyBDb21tZW50IGF0dGFjaG1lbnQgc3RvcmVcbiAgdHJhaWxpbmdDb21tZW50czogQXJyYXk8Ti5Db21tZW50PiA9IFtdO1xuICBsZWFkaW5nQ29tbWVudHM6IEFycmF5PE4uQ29tbWVudD4gPSBbXTtcbiAgY29tbWVudFN0YWNrOiBBcnJheTx7XG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBsZWFkaW5nQ29tbWVudHM6ID9BcnJheTxOLkNvbW1lbnQ+LFxuICAgIHRyYWlsaW5nQ29tbWVudHM6ID9BcnJheTxOLkNvbW1lbnQ+LFxuICAgIHR5cGU6IHN0cmluZyxcbiAgfT4gPSBbXTtcbiAgLy8gJEZsb3dJZ25vcmUgdGhpcyBpcyBpbml0aWFsaXplZCB3aGVuIHRoZSBwYXJzZXIgc3RhcnRzLlxuICBjb21tZW50UHJldmlvdXNOb2RlOiBOLk5vZGUgPSBudWxsO1xuXG4gIC8vIFRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSB0b2tlbml6ZXIgaW4gdGhlIGlucHV0LlxuICBwb3M6IG51bWJlciA9IDA7XG4gIGxpbmVTdGFydDogbnVtYmVyID0gMDtcblxuICAvLyBQcm9wZXJ0aWVzIG9mIHRoZSBjdXJyZW50IHRva2VuOlxuICAvLyBJdHMgdHlwZVxuICB0eXBlOiBUb2tlblR5cGUgPSB0dC5lb2Y7XG5cbiAgLy8gRm9yIHRva2VucyB0aGF0IGluY2x1ZGUgbW9yZSBpbmZvcm1hdGlvbiB0aGFuIHRoZWlyIHR5cGUsIHRoZSB2YWx1ZVxuICB2YWx1ZTogYW55ID0gbnVsbDtcblxuICAvLyBJdHMgc3RhcnQgYW5kIGVuZCBvZmZzZXRcbiAgc3RhcnQ6IG51bWJlciA9IDA7XG4gIGVuZDogbnVtYmVyID0gMDtcblxuICAvLyBQb3NpdGlvbiBpbmZvcm1hdGlvbiBmb3IgdGhlIHByZXZpb3VzIHRva2VuXG4gIC8vICRGbG93SWdub3JlIHRoaXMgaXMgaW5pdGlhbGl6ZWQgd2hlbiBnZW5lcmF0aW5nIHRoZSBzZWNvbmQgdG9rZW4uXG4gIGxhc3RUb2tFbmRMb2M6IFBvc2l0aW9uID0gbnVsbDtcbiAgLy8gJEZsb3dJZ25vcmUgdGhpcyBpcyBpbml0aWFsaXplZCB3aGVuIGdlbmVyYXRpbmcgdGhlIHNlY29uZCB0b2tlbi5cbiAgbGFzdFRva1N0YXJ0TG9jOiBQb3NpdGlvbiA9IG51bGw7XG4gIGxhc3RUb2tTdGFydDogbnVtYmVyID0gMDtcbiAgbGFzdFRva0VuZDogbnVtYmVyID0gMDtcblxuICAvLyBUaGUgY29udGV4dCBzdGFjayBpcyB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgdGhlIGFwb3N0cm9waGUgXCJgXCIgc3RhcnRzXG4gIC8vIG9yIGVuZHMgYSBzdHJpbmcgdGVtcGxhdGVcbiAgY29udGV4dDogQXJyYXk8VG9rQ29udGV4dD4gPSBbY3QuYnJhY2VdO1xuICAvLyBVc2VkIHRvIHRyYWNrIHdoZXRoZXIgYSBKU1ggZWxlbWVudCBpcyBhbGxvd2VkIHRvIGZvcm1cbiAgZXhwckFsbG93ZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8vIFVzZWQgdG8gc2lnbmFsIHRvIGNhbGxlcnMgb2YgYHJlYWRXb3JkMWAgd2hldGhlciB0aGUgd29yZFxuICAvLyBjb250YWluZWQgYW55IGVzY2FwZSBzZXF1ZW5jZXMuIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2Ugd29yZHMgd2l0aFxuICAvLyBlc2NhcGUgc2VxdWVuY2VzIG11c3Qgbm90IGJlIGludGVycHJldGVkIGFzIGtleXdvcmRzLlxuICBjb250YWluc0VzYzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIFRoaXMgcHJvcGVydHkgaXMgdXNlZCB0byB0cmFjayB0aGUgZm9sbG93aW5nIGVycm9yc1xuICAvLyAtIFN0cmljdE51bWVyaWNFc2NhcGVcbiAgLy8gLSBTdHJpY3RPY3RhbExpdGVyYWxcbiAgLy9cbiAgLy8gaW4gYSBsaXRlcmFsIHRoYXQgb2NjdXJzIHByaW9yIHRvL2ltbWVkaWF0ZWx5IGFmdGVyIGEgXCJ1c2Ugc3RyaWN0XCIgZGlyZWN0aXZlLlxuXG4gIC8vIHRvZG8oSkxId3VuZyk6IHNldCBzdHJpY3RFcnJvcnMgdG8gbnVsbCBhbmQgYXZvaWQgcmVjb3JkaW5nIHN0cmluZyBlcnJvcnNcbiAgLy8gYWZ0ZXIgYSBub24tZGlyZWN0aXZlIGlzIHBhcnNlZFxuICBzdHJpY3RFcnJvcnM6IE1hcDxudW1iZXIsIEVycm9yVGVtcGxhdGU+ID0gbmV3IE1hcCgpO1xuXG4gIC8vIFRva2VucyBsZW5ndGggaW4gdG9rZW4gc3RvcmVcbiAgdG9rZW5zTGVuZ3RoOiBudW1iZXIgPSAwO1xuXG4gIGN1clBvc2l0aW9uKCk6IFBvc2l0aW9uIHtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uKHRoaXMuY3VyTGluZSwgdGhpcy5wb3MgLSB0aGlzLmxpbmVTdGFydCk7XG4gIH1cblxuICBjbG9uZShza2lwQXJyYXlzPzogYm9vbGVhbik6IFN0YXRlIHtcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBTdGF0ZSgpO1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzKTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICBsZXQgdmFsID0gdGhpc1trZXldO1xuXG4gICAgICBpZiAoIXNraXBBcnJheXMgJiYgQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIHZhbCA9IHZhbC5zbGljZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyAkRmxvd0lnbm9yZVxuICAgICAgc3RhdGVba2V5XSA9IHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgTG9va2FoZWFkU3RhdGUgPSB7XG4gIHBvczogbnVtYmVyLFxuICB2YWx1ZTogYW55LFxuICB0eXBlOiBUb2tlblR5cGUsXG4gIHN0YXJ0OiBudW1iZXIsXG4gIGVuZDogbnVtYmVyLFxuICAvKiBVc2VkIG9ubHkgaW4gcmVhZFRva2VuX211bHRfbW9kdWxvICovXG4gIGluVHlwZTogYm9vbGVhbixcbn07XG4iXX0=