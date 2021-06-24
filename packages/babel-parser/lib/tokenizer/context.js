"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = exports.TokContext = void 0;

var _types = require("./types");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TokContext = function TokContext(token, preserveSpace) {
  _classCallCheck(this, TokContext);

  _defineProperty(this, "token", void 0);

  _defineProperty(this, "preserveSpace", void 0);

  this.token = token;
  this.preserveSpace = !!preserveSpace;
};

exports.TokContext = TokContext;
var types = {
  brace: new TokContext("{"),
  template: new TokContext("`", true)
}; // Token-specific context update code
// Note that we should avoid accessing `this.prodParam` in context update,
// because it is executed immediately when last token is consumed, which may be
// before `this.prodParam` is updated. e.g.
// ```
// function *g() { () => yield / 2 }
// ```
// When `=>` is eaten, the context update of `yield` is executed, however,
// `this.prodParam` still has `[Yield]` production because it is not yet updated

exports.types = types;

_types.types.braceR.updateContext = function (context) {
  context.pop();
}; // we don't need to update context for tt.braceBarL because we do not pop context for tt.braceBarR
// ideally only dollarBraceL "${" needs a non-template context
// in order to indicate that the last "`" in `${`" starts a new string template
// inside a template element within outer string template.
// but when we popped such context in `}`, we lost track of whether this
// `}` matches a `${` or other tokens matching `}`, so we have to push
// such context in every token that `}` will match.


_types.types.braceL.updateContext = _types.types.braceHashL.updateContext = _types.types.dollarBraceL.updateContext = function (context) {
  context.push(types.brace);
};

_types.types.backQuote.updateContext = function (context) {
  if (context[context.length - 1] === types.template) {
    context.pop();
  } else {
    context.push(types.template);
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90b2tlbml6ZXIvY29udGV4dC5qcyJdLCJuYW1lcyI6WyJUb2tDb250ZXh0IiwidG9rZW4iLCJwcmVzZXJ2ZVNwYWNlIiwidHlwZXMiLCJicmFjZSIsInRlbXBsYXRlIiwidHQiLCJicmFjZVIiLCJ1cGRhdGVDb250ZXh0IiwiY29udGV4dCIsInBvcCIsImJyYWNlTCIsImJyYWNlSGFzaEwiLCJkb2xsYXJCcmFjZUwiLCJwdXNoIiwiYmFja1F1b3RlIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7Ozs7OztJQUVhQSxVLEdBQ1gsb0JBQVlDLEtBQVosRUFBMkJDLGFBQTNCLEVBQW9EO0FBQUE7O0FBQUE7O0FBQUE7O0FBQ2xELE9BQUtELEtBQUwsR0FBYUEsS0FBYjtBQUNBLE9BQUtDLGFBQUwsR0FBcUIsQ0FBQyxDQUFDQSxhQUF2QjtBQUNELEM7OztBQU1JLElBQU1DLEtBRVosR0FBRztBQUNGQyxFQUFBQSxLQUFLLEVBQUUsSUFBSUosVUFBSixDQUFlLEdBQWYsQ0FETDtBQUVGSyxFQUFBQSxRQUFRLEVBQUUsSUFBSUwsVUFBSixDQUFlLEdBQWYsRUFBb0IsSUFBcEI7QUFGUixDQUZHLEMsQ0FPUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFFQU0sYUFBR0MsTUFBSCxDQUFVQyxhQUFWLEdBQTBCLFVBQUFDLE9BQU8sRUFBSTtBQUNuQ0EsRUFBQUEsT0FBTyxDQUFDQyxHQUFSO0FBQ0QsQ0FGRCxDLENBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBSixhQUFHSyxNQUFILENBQVVILGFBQVYsR0FDRUYsYUFBR00sVUFBSCxDQUFjSixhQUFkLEdBQ0FGLGFBQUdPLFlBQUgsQ0FBZ0JMLGFBQWhCLEdBQ0UsVUFBQUMsT0FBTyxFQUFJO0FBQ1RBLEVBQUFBLE9BQU8sQ0FBQ0ssSUFBUixDQUFhWCxLQUFLLENBQUNDLEtBQW5CO0FBQ0QsQ0FMTDs7QUFPQUUsYUFBR1MsU0FBSCxDQUFhUCxhQUFiLEdBQTZCLFVBQUFDLE9BQU8sRUFBSTtBQUN0QyxNQUFJQSxPQUFPLENBQUNBLE9BQU8sQ0FBQ08sTUFBUixHQUFpQixDQUFsQixDQUFQLEtBQWdDYixLQUFLLENBQUNFLFFBQTFDLEVBQW9EO0FBQ2xESSxJQUFBQSxPQUFPLENBQUNDLEdBQVI7QUFDRCxHQUZELE1BRU87QUFDTEQsSUFBQUEsT0FBTyxDQUFDSyxJQUFSLENBQWFYLEtBQUssQ0FBQ0UsUUFBbkI7QUFDRDtBQUNGLENBTkQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG4vLyBUaGUgdG9rZW4gY29udGV4dCBpcyB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgdGhlIGFwb3N0cm9waGUgXCJgXCJcbi8vIHN0YXJ0cyBvciBlbmRzIGEgc3RyaW5nIHRlbXBsYXRlXG5cbmltcG9ydCB7IHR5cGVzIGFzIHR0IH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIFRva0NvbnRleHQge1xuICBjb25zdHJ1Y3Rvcih0b2tlbjogc3RyaW5nLCBwcmVzZXJ2ZVNwYWNlPzogYm9vbGVhbikge1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB0aGlzLnByZXNlcnZlU3BhY2UgPSAhIXByZXNlcnZlU3BhY2U7XG4gIH1cblxuICB0b2tlbjogc3RyaW5nO1xuICBwcmVzZXJ2ZVNwYWNlOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgdHlwZXM6IHtcbiAgW2tleTogc3RyaW5nXTogVG9rQ29udGV4dCxcbn0gPSB7XG4gIGJyYWNlOiBuZXcgVG9rQ29udGV4dChcIntcIiksXG4gIHRlbXBsYXRlOiBuZXcgVG9rQ29udGV4dChcImBcIiwgdHJ1ZSksXG59O1xuXG4vLyBUb2tlbi1zcGVjaWZpYyBjb250ZXh0IHVwZGF0ZSBjb2RlXG4vLyBOb3RlIHRoYXQgd2Ugc2hvdWxkIGF2b2lkIGFjY2Vzc2luZyBgdGhpcy5wcm9kUGFyYW1gIGluIGNvbnRleHQgdXBkYXRlLFxuLy8gYmVjYXVzZSBpdCBpcyBleGVjdXRlZCBpbW1lZGlhdGVseSB3aGVuIGxhc3QgdG9rZW4gaXMgY29uc3VtZWQsIHdoaWNoIG1heSBiZVxuLy8gYmVmb3JlIGB0aGlzLnByb2RQYXJhbWAgaXMgdXBkYXRlZC4gZS5nLlxuLy8gYGBgXG4vLyBmdW5jdGlvbiAqZygpIHsgKCkgPT4geWllbGQgLyAyIH1cbi8vIGBgYFxuLy8gV2hlbiBgPT5gIGlzIGVhdGVuLCB0aGUgY29udGV4dCB1cGRhdGUgb2YgYHlpZWxkYCBpcyBleGVjdXRlZCwgaG93ZXZlcixcbi8vIGB0aGlzLnByb2RQYXJhbWAgc3RpbGwgaGFzIGBbWWllbGRdYCBwcm9kdWN0aW9uIGJlY2F1c2UgaXQgaXMgbm90IHlldCB1cGRhdGVkXG5cbnR0LmJyYWNlUi51cGRhdGVDb250ZXh0ID0gY29udGV4dCA9PiB7XG4gIGNvbnRleHQucG9wKCk7XG59O1xuXG4vLyB3ZSBkb24ndCBuZWVkIHRvIHVwZGF0ZSBjb250ZXh0IGZvciB0dC5icmFjZUJhckwgYmVjYXVzZSB3ZSBkbyBub3QgcG9wIGNvbnRleHQgZm9yIHR0LmJyYWNlQmFyUlxuLy8gaWRlYWxseSBvbmx5IGRvbGxhckJyYWNlTCBcIiR7XCIgbmVlZHMgYSBub24tdGVtcGxhdGUgY29udGV4dFxuLy8gaW4gb3JkZXIgdG8gaW5kaWNhdGUgdGhhdCB0aGUgbGFzdCBcImBcIiBpbiBgJHtgXCIgc3RhcnRzIGEgbmV3IHN0cmluZyB0ZW1wbGF0ZVxuLy8gaW5zaWRlIGEgdGVtcGxhdGUgZWxlbWVudCB3aXRoaW4gb3V0ZXIgc3RyaW5nIHRlbXBsYXRlLlxuLy8gYnV0IHdoZW4gd2UgcG9wcGVkIHN1Y2ggY29udGV4dCBpbiBgfWAsIHdlIGxvc3QgdHJhY2sgb2Ygd2hldGhlciB0aGlzXG4vLyBgfWAgbWF0Y2hlcyBhIGAke2Agb3Igb3RoZXIgdG9rZW5zIG1hdGNoaW5nIGB9YCwgc28gd2UgaGF2ZSB0byBwdXNoXG4vLyBzdWNoIGNvbnRleHQgaW4gZXZlcnkgdG9rZW4gdGhhdCBgfWAgd2lsbCBtYXRjaC5cbnR0LmJyYWNlTC51cGRhdGVDb250ZXh0ID1cbiAgdHQuYnJhY2VIYXNoTC51cGRhdGVDb250ZXh0ID1cbiAgdHQuZG9sbGFyQnJhY2VMLnVwZGF0ZUNvbnRleHQgPVxuICAgIGNvbnRleHQgPT4ge1xuICAgICAgY29udGV4dC5wdXNoKHR5cGVzLmJyYWNlKTtcbiAgICB9O1xuXG50dC5iYWNrUXVvdGUudXBkYXRlQ29udGV4dCA9IGNvbnRleHQgPT4ge1xuICBpZiAoY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdID09PSB0eXBlcy50ZW1wbGF0ZSkge1xuICAgIGNvbnRleHQucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgY29udGV4dC5wdXNoKHR5cGVzLnRlbXBsYXRlKTtcbiAgfVxufTtcbiJdfQ==