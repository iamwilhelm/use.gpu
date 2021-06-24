"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLineInfo = getLineInfo;
exports.SourceLocation = exports.Position = void 0;

var _whitespace = require("./whitespace");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// These are used when `options.locations` is on, for the
// `startLoc` and `endLoc` properties.
var Position = function Position(line, col) {
  _classCallCheck(this, Position);

  _defineProperty(this, "line", void 0);

  _defineProperty(this, "column", void 0);

  this.line = line;
  this.column = col;
};

exports.Position = Position;

var SourceLocation = function SourceLocation(start, end) {
  _classCallCheck(this, SourceLocation);

  _defineProperty(this, "start", void 0);

  _defineProperty(this, "end", void 0);

  _defineProperty(this, "filename", void 0);

  _defineProperty(this, "identifierName", void 0);

  this.start = start; // $FlowIgnore (may start as null, but initialized later)

  this.end = end;
}; // The `getLineInfo` function is mostly useful when the
// `locations` option is off (for performance reasons) and you
// want to find the line/column position for a given character
// offset. `input` should be the code string that the offset refers
// into.


exports.SourceLocation = SourceLocation;

function getLineInfo(input, offset) {
  var line = 1;
  var lineStart = 0;
  var match;
  _whitespace.lineBreakG.lastIndex = 0;

  while ((match = _whitespace.lineBreakG.exec(input)) && match.index < offset) {
    line++;
    lineStart = _whitespace.lineBreakG.lastIndex;
  }

  return new Position(line, offset - lineStart);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2xvY2F0aW9uLmpzIl0sIm5hbWVzIjpbIlBvc2l0aW9uIiwibGluZSIsImNvbCIsImNvbHVtbiIsIlNvdXJjZUxvY2F0aW9uIiwic3RhcnQiLCJlbmQiLCJnZXRMaW5lSW5mbyIsImlucHV0Iiwib2Zmc2V0IiwibGluZVN0YXJ0IiwibWF0Y2giLCJsaW5lQnJlYWtHIiwibGFzdEluZGV4IiwiZXhlYyIsImluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBOzs7Ozs7QUFNQTtBQUNBO0lBRWFBLFEsR0FJWCxrQkFBWUMsSUFBWixFQUEwQkMsR0FBMUIsRUFBdUM7QUFBQTs7QUFBQTs7QUFBQTs7QUFDckMsT0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsT0FBS0UsTUFBTCxHQUFjRCxHQUFkO0FBQ0QsQzs7OztJQUdVRSxjLEdBTVgsd0JBQVlDLEtBQVosRUFBNkJDLEdBQTdCLEVBQTZDO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQzNDLE9BQUtELEtBQUwsR0FBYUEsS0FBYixDQUQyQyxDQUUzQzs7QUFDQSxPQUFLQyxHQUFMLEdBQVdBLEdBQVg7QUFDRCxDLEVBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFFTyxTQUFTQyxXQUFULENBQXFCQyxLQUFyQixFQUFvQ0MsTUFBcEMsRUFBOEQ7QUFDbkUsTUFBSVIsSUFBSSxHQUFHLENBQVg7QUFDQSxNQUFJUyxTQUFTLEdBQUcsQ0FBaEI7QUFDQSxNQUFJQyxLQUFKO0FBQ0FDLHlCQUFXQyxTQUFYLEdBQXVCLENBQXZCOztBQUNBLFNBQU8sQ0FBQ0YsS0FBSyxHQUFHQyx1QkFBV0UsSUFBWCxDQUFnQk4sS0FBaEIsQ0FBVCxLQUFvQ0csS0FBSyxDQUFDSSxLQUFOLEdBQWNOLE1BQXpELEVBQWlFO0FBQy9EUixJQUFBQSxJQUFJO0FBQ0pTLElBQUFBLFNBQVMsR0FBR0UsdUJBQVdDLFNBQXZCO0FBQ0Q7O0FBRUQsU0FBTyxJQUFJYixRQUFKLENBQWFDLElBQWIsRUFBbUJRLE1BQU0sR0FBR0MsU0FBNUIsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgbGluZUJyZWFrRyB9IGZyb20gXCIuL3doaXRlc3BhY2VcIjtcblxuZXhwb3J0IHR5cGUgUG9zID0ge1xuICBzdGFydDogbnVtYmVyLFxufTtcblxuLy8gVGhlc2UgYXJlIHVzZWQgd2hlbiBgb3B0aW9ucy5sb2NhdGlvbnNgIGlzIG9uLCBmb3IgdGhlXG4vLyBgc3RhcnRMb2NgIGFuZCBgZW5kTG9jYCBwcm9wZXJ0aWVzLlxuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24ge1xuICBsaW5lOiBudW1iZXI7XG4gIGNvbHVtbjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGxpbmU6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gY29sO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTb3VyY2VMb2NhdGlvbiB7XG4gIHN0YXJ0OiBQb3NpdGlvbjtcbiAgZW5kOiBQb3NpdGlvbjtcbiAgZmlsZW5hbWU6IHN0cmluZztcbiAgaWRlbnRpZmllck5hbWU6ID9zdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc3RhcnQ6IFBvc2l0aW9uLCBlbmQ/OiBQb3NpdGlvbikge1xuICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICAvLyAkRmxvd0lnbm9yZSAobWF5IHN0YXJ0IGFzIG51bGwsIGJ1dCBpbml0aWFsaXplZCBsYXRlcilcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgfVxufVxuXG4vLyBUaGUgYGdldExpbmVJbmZvYCBmdW5jdGlvbiBpcyBtb3N0bHkgdXNlZnVsIHdoZW4gdGhlXG4vLyBgbG9jYXRpb25zYCBvcHRpb24gaXMgb2ZmIChmb3IgcGVyZm9ybWFuY2UgcmVhc29ucykgYW5kIHlvdVxuLy8gd2FudCB0byBmaW5kIHRoZSBsaW5lL2NvbHVtbiBwb3NpdGlvbiBmb3IgYSBnaXZlbiBjaGFyYWN0ZXJcbi8vIG9mZnNldC4gYGlucHV0YCBzaG91bGQgYmUgdGhlIGNvZGUgc3RyaW5nIHRoYXQgdGhlIG9mZnNldCByZWZlcnNcbi8vIGludG8uXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW5lSW5mbyhpbnB1dDogc3RyaW5nLCBvZmZzZXQ6IG51bWJlcik6IFBvc2l0aW9uIHtcbiAgbGV0IGxpbmUgPSAxO1xuICBsZXQgbGluZVN0YXJ0ID0gMDtcbiAgbGV0IG1hdGNoO1xuICBsaW5lQnJlYWtHLmxhc3RJbmRleCA9IDA7XG4gIHdoaWxlICgobWF0Y2ggPSBsaW5lQnJlYWtHLmV4ZWMoaW5wdXQpKSAmJiBtYXRjaC5pbmRleCA8IG9mZnNldCkge1xuICAgIGxpbmUrKztcbiAgICBsaW5lU3RhcnQgPSBsaW5lQnJlYWtHLmxhc3RJbmRleDtcbiAgfVxuXG4gIHJldHVybiBuZXcgUG9zaXRpb24obGluZSwgb2Zmc2V0IC0gbGluZVN0YXJ0KTtcbn1cbiJdfQ==