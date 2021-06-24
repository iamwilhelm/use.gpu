"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ClassScope = void 0;

var _scopeflags = require("./scopeflags");

var _error = require("../parser/error");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ClassScope = function ClassScope() {
  _classCallCheck(this, ClassScope);

  _defineProperty(this, "privateNames", new Set());

  _defineProperty(this, "loneAccessors", new Map());

  _defineProperty(this, "undefinedPrivateNames", new Map());
};

exports.ClassScope = ClassScope;

var ClassScopeHandler = /*#__PURE__*/function () {
  function ClassScopeHandler(raise) {
    _classCallCheck(this, ClassScopeHandler);

    _defineProperty(this, "stack", []);

    _defineProperty(this, "undefinedPrivateNames", new Map());

    this.raise = raise;
  }

  _createClass(ClassScopeHandler, [{
    key: "current",
    value: function current() {
      return this.stack[this.stack.length - 1];
    }
  }, {
    key: "enter",
    value: function enter() {
      this.stack.push(new ClassScope());
    }
  }, {
    key: "exit",
    value: function exit() {
      var oldClassScope = this.stack.pop(); // Migrate the usage of not yet defined private names to the outer
      // class scope, or raise an error if we reached the top-level scope.

      var current = this.current(); // Array.from is needed because this is compiled to an array-like for loop

      for (var _i = 0, _Array$from = Array.from(oldClassScope.undefinedPrivateNames); _i < _Array$from.length; _i++) {
        var _Array$from$_i = _slicedToArray(_Array$from[_i], 2),
            name = _Array$from$_i[0],
            pos = _Array$from$_i[1];

        if (current) {
          if (!current.undefinedPrivateNames.has(name)) {
            current.undefinedPrivateNames.set(name, pos);
          }
        } else {
          this.raise(pos, _error.Errors.InvalidPrivateFieldResolution, name);
        }
      }
    }
  }, {
    key: "declarePrivateName",
    value: function declarePrivateName(name, elementType, pos) {
      var classScope = this.current();
      var redefined = classScope.privateNames.has(name);

      if (elementType & _scopeflags.CLASS_ELEMENT_KIND_ACCESSOR) {
        var accessor = redefined && classScope.loneAccessors.get(name);

        if (accessor) {
          var oldStatic = accessor & _scopeflags.CLASS_ELEMENT_FLAG_STATIC;
          var newStatic = elementType & _scopeflags.CLASS_ELEMENT_FLAG_STATIC;
          var oldKind = accessor & _scopeflags.CLASS_ELEMENT_KIND_ACCESSOR;
          var newKind = elementType & _scopeflags.CLASS_ELEMENT_KIND_ACCESSOR; // The private name can be duplicated only if it is used by
          // two accessors with different kind (get and set), and if
          // they have the same placement (static or not).

          redefined = oldKind === newKind || oldStatic !== newStatic;
          if (!redefined) classScope.loneAccessors["delete"](name);
        } else if (!redefined) {
          classScope.loneAccessors.set(name, elementType);
        }
      }

      if (redefined) {
        this.raise(pos, _error.Errors.PrivateNameRedeclaration, name);
      }

      classScope.privateNames.add(name);
      classScope.undefinedPrivateNames["delete"](name);
    }
  }, {
    key: "usePrivateName",
    value: function usePrivateName(name, pos) {
      var classScope;

      var _iterator = _createForOfIteratorHelper(this.stack),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          classScope = _step.value;
          if (classScope.privateNames.has(name)) return;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (classScope) {
        classScope.undefinedPrivateNames.set(name, pos);
      } else {
        // top-level
        this.raise(pos, _error.Errors.InvalidPrivateFieldResolution, name);
      }
    }
  }]);

  return ClassScopeHandler;
}();

exports["default"] = ClassScopeHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2NsYXNzLXNjb3BlLmpzIl0sIm5hbWVzIjpbIkNsYXNzU2NvcGUiLCJTZXQiLCJNYXAiLCJDbGFzc1Njb3BlSGFuZGxlciIsInJhaXNlIiwic3RhY2siLCJsZW5ndGgiLCJwdXNoIiwib2xkQ2xhc3NTY29wZSIsInBvcCIsImN1cnJlbnQiLCJBcnJheSIsImZyb20iLCJ1bmRlZmluZWRQcml2YXRlTmFtZXMiLCJuYW1lIiwicG9zIiwiaGFzIiwic2V0IiwiRXJyb3JzIiwiSW52YWxpZFByaXZhdGVGaWVsZFJlc29sdXRpb24iLCJlbGVtZW50VHlwZSIsImNsYXNzU2NvcGUiLCJyZWRlZmluZWQiLCJwcml2YXRlTmFtZXMiLCJDTEFTU19FTEVNRU5UX0tJTkRfQUNDRVNTT1IiLCJhY2Nlc3NvciIsImxvbmVBY2Nlc3NvcnMiLCJnZXQiLCJvbGRTdGF0aWMiLCJDTEFTU19FTEVNRU5UX0ZMQUdfU1RBVElDIiwibmV3U3RhdGljIiwib2xkS2luZCIsIm5ld0tpbmQiLCJQcml2YXRlTmFtZVJlZGVjbGFyYXRpb24iLCJhZGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFU7Ozt3Q0FFaUIsSUFBSUMsR0FBSixFOzt5Q0FHb0IsSUFBSUMsR0FBSixFOztpREFJSCxJQUFJQSxHQUFKLEU7Ozs7O0lBRzFCQyxpQjtBQUtuQiw2QkFBWUMsS0FBWixFQUFrQztBQUFBOztBQUFBLG1DQUpQLEVBSU87O0FBQUEsbURBRlcsSUFBSUYsR0FBSixFQUVYOztBQUNoQyxTQUFLRSxLQUFMLEdBQWFBLEtBQWI7QUFDRDs7OztXQUVELG1CQUFzQjtBQUNwQixhQUFPLEtBQUtDLEtBQUwsQ0FBVyxLQUFLQSxLQUFMLENBQVdDLE1BQVgsR0FBb0IsQ0FBL0IsQ0FBUDtBQUNEOzs7V0FFRCxpQkFBUTtBQUNOLFdBQUtELEtBQUwsQ0FBV0UsSUFBWCxDQUFnQixJQUFJUCxVQUFKLEVBQWhCO0FB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c291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHtcbiAgQ0xBU1NfRUxFTUVOVF9LSU5EX0FDQ0VTU09SLFxuICBDTEFTU19FTEVNRU5UX0ZMQUdfU1RBVElDLFxuICB0eXBlIENsYXNzRWxlbWVudFR5cGVzLFxufSBmcm9tIFwiLi9zY29wZWZsYWdzXCI7XG5pbXBvcnQgeyBFcnJvcnMsIHR5cGUgcmFpc2VGdW5jdGlvbiB9IGZyb20gXCIuLi9wYXJzZXIvZXJyb3JcIjtcblxuZXhwb3J0IGNsYXNzIENsYXNzU2NvcGUge1xuICAvLyBBIGxpc3Qgb2YgcHJpdmF0ZSBuYW1lZCBkZWNsYXJlZCBpbiB0aGUgY3VycmVudCBjbGFzc1xuICBwcml2YXRlTmFtZXM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4gIC8vIEEgbGlzdCBvZiBwcml2YXRlIGdldHRlcnMgb2Ygc2V0dGVycyB3aXRob3V0IHRoZWlyIGNvdW50ZXJwYXJ0XG4gIGxvbmVBY2Nlc3NvcnM6IE1hcDxzdHJpbmcsIENsYXNzRWxlbWVudFR5cGVzPiA9IG5ldyBNYXAoKTtcblxuICAvLyBBIGxpc3Qgb2YgcHJpdmF0ZSBuYW1lcyB1c2VkIGJlZm9yZSBiZWluZyBkZWZpbmVkLCBtYXBwaW5nIHRvXG4gIC8vIHRoZWlyIHBvc2l0aW9uLlxuICB1bmRlZmluZWRQcml2YXRlTmFtZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsYXNzU2NvcGVIYW5kbGVyIHtcbiAgc3RhY2s6IEFycmF5PENsYXNzU2NvcGU+ID0gW107XG4gIGRlY2xhcmUgcmFpc2U6IHJhaXNlRnVuY3Rpb247XG4gIHVuZGVmaW5lZFByaXZhdGVOYW1lczogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKTtcblxuICBjb25zdHJ1Y3RvcihyYWlzZTogcmFpc2VGdW5jdGlvbikge1xuICAgIHRoaXMucmFpc2UgPSByYWlzZTtcbiAgfVxuXG4gIGN1cnJlbnQoKTogQ2xhc3NTY29wZSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIGVudGVyKCkge1xuICAgIHRoaXMuc3RhY2sucHVzaChuZXcgQ2xhc3NTY29wZSgpKTtcbiAgfVxuXG4gIGV4aXQoKSB7XG4gICAgY29uc3Qgb2xkQ2xhc3NTY29wZSA9IHRoaXMuc3RhY2sucG9wKCk7XG5cbiAgICAvLyBNaWdyYXRlIHRoZSB1c2FnZSBvZiBub3QgeWV0IGRlZmluZWQgcHJpdmF0ZSBuYW1lcyB0byB0aGUgb3V0ZXJcbiAgICAvLyBjbGFzcyBzY29wZSwgb3IgcmFpc2UgYW4gZXJyb3IgaWYgd2UgcmVhY2hlZCB0aGUgdG9wLWxldmVsIHNjb3BlLlxuXG4gICAgY29uc3QgY3VycmVudCA9IHRoaXMuY3VycmVudCgpO1xuXG4gICAgLy8gQXJyYXkuZnJvbSBpcyBuZWVkZWQgYmVjYXVzZSB0aGlzIGlzIGNvbXBpbGVkIHRvIGFuIGFycmF5LWxpa2UgZm9yIGxvb3BcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBwb3NdIG9mIEFycmF5LmZyb20ob2xkQ2xhc3NTY29wZS51bmRlZmluZWRQcml2YXRlTmFtZXMpKSB7XG4gICAgICBpZiAoY3VycmVudCkge1xuICAgICAgICBpZiAoIWN1cnJlbnQudW5kZWZpbmVkUHJpdmF0ZU5hbWVzLmhhcyhuYW1lKSkge1xuICAgICAgICAgIGN1cnJlbnQudW5kZWZpbmVkUHJpdmF0ZU5hbWVzLnNldChuYW1lLCBwb3MpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJhaXNlKHBvcywgRXJyb3JzLkludmFsaWRQcml2YXRlRmllbGRSZXNvbHV0aW9uLCBuYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZWNsYXJlUHJpdmF0ZU5hbWUoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGVsZW1lbnRUeXBlOiBDbGFzc0VsZW1lbnRUeXBlcyxcbiAgICBwb3M6IG51bWJlcixcbiAgKSB7XG4gICAgY29uc3QgY2xhc3NTY29wZSA9IHRoaXMuY3VycmVudCgpO1xuICAgIGxldCByZWRlZmluZWQgPSBjbGFzc1Njb3BlLnByaXZhdGVOYW1lcy5oYXMobmFtZSk7XG5cbiAgICBpZiAoZWxlbWVudFR5cGUgJiBDTEFTU19FTEVNRU5UX0tJTkRfQUNDRVNTT1IpIHtcbiAgICAgIGNvbnN0IGFjY2Vzc29yID0gcmVkZWZpbmVkICYmIGNsYXNzU2NvcGUubG9uZUFjY2Vzc29ycy5nZXQobmFtZSk7XG4gICAgICBpZiAoYWNjZXNzb3IpIHtcbiAgICAgICAgY29uc3Qgb2xkU3RhdGljID0gYWNjZXNzb3IgJiBDTEFTU19FTEVNRU5UX0ZMQUdfU1RBVElDO1xuICAgICAgICBjb25zdCBuZXdTdGF0aWMgPSBlbGVtZW50VHlwZSAmIENMQVNTX0VMRU1FTlRfRkxBR19TVEFUSUM7XG5cbiAgICAgICAgY29uc3Qgb2xkS2luZCA9IGFjY2Vzc29yICYgQ0xBU1NfRUxFTUVOVF9LSU5EX0FDQ0VTU09SO1xuICAgICAgICBjb25zdCBuZXdLaW5kID0gZWxlbWVudFR5cGUgJiBDTEFTU19FTEVNRU5UX0tJTkRfQUNDRVNTT1I7XG5cbiAgICAgICAgLy8gVGhlIHByaXZhdGUgbmFtZSBjYW4gYmUgZHVwbGljYXRlZCBvbmx5IGlmIGl0IGlzIHVzZWQgYnlcbiAgICAgICAgLy8gdHdvIGFjY2Vzc29ycyB3aXRoIGRpZmZlcmVudCBraW5kIChnZXQgYW5kIHNldCksIGFuZCBpZlxuICAgICAgICAvLyB0aGV5IGhhdmUgdGhlIHNhbWUgcGxhY2VtZW50IChzdGF0aWMgb3Igbm90KS5cbiAgICAgICAgcmVkZWZpbmVkID0gb2xkS2luZCA9PT0gbmV3S2luZCB8fCBvbGRTdGF0aWMgIT09IG5ld1N0YXRpYztcblxuICAgICAgICBpZiAoIXJlZGVmaW5lZCkgY2xhc3NTY29wZS5sb25lQWNjZXNzb3JzLmRlbGV0ZShuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoIXJlZGVmaW5lZCkge1xuICAgICAgICBjbGFzc1Njb3BlLmxvbmVBY2Nlc3NvcnMuc2V0KG5hbWUsIGVsZW1lbnRUeXBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVkZWZpbmVkKSB7XG4gICAgICB0aGlzLnJhaXNlKHBvcywgRXJyb3JzLlByaXZhdGVOYW1lUmVkZWNsYXJhdGlvbiwgbmFtZSk7XG4gICAgfVxuXG4gICAgY2xhc3NTY29wZS5wcml2YXRlTmFtZXMuYWRkKG5hbWUpO1xuICAgIGNsYXNzU2NvcGUudW5kZWZpbmVkUHJpdmF0ZU5hbWVzLmRlbGV0ZShuYW1lKTtcbiAgfVxuXG4gIHVzZVByaXZhdGVOYW1lKG5hbWU6IHN0cmluZywgcG9zOiBudW1iZXIpIHtcbiAgICBsZXQgY2xhc3NTY29wZTtcbiAgICBmb3IgKGNsYXNzU2NvcGUgb2YgdGhpcy5zdGFjaykge1xuICAgICAgaWYgKGNsYXNzU2NvcGUucHJpdmF0ZU5hbWVzLmhhcyhuYW1lKSkgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjbGFzc1Njb3BlKSB7XG4gICAgICBjbGFzc1Njb3BlLnVuZGVmaW5lZFByaXZhdGVOYW1lcy5zZXQobmFtZSwgcG9zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gdG9wLWxldmVsXG4gICAgICB0aGlzLnJhaXNlKHBvcywgRXJyb3JzLkludmFsaWRQcml2YXRlRmllbGRSZXNvbHV0aW9uLCBuYW1lKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==