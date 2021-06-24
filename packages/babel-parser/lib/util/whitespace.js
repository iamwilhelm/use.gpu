"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNewLine = isNewLine;
exports.isWhitespace = isWhitespace;
exports.skipWhiteSpace = exports.lineBreakG = exports.lineBreak = void 0;

var charCodes = _interopRequireWildcard(require("charcodes"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Matches a whole line break (where CRLF is considered a single
// line break). Used to count lines.
var lineBreak = /\r\n?|[\n\u2028\u2029]/;
exports.lineBreak = lineBreak;
var lineBreakG = new RegExp(lineBreak.source, "g"); // https://tc39.github.io/ecma262/#sec-line-terminators

exports.lineBreakG = lineBreakG;

function isNewLine(code) {
  switch (code) {
    case charCodes.lineFeed:
    case charCodes.carriageReturn:
    case charCodes.lineSeparator:
    case charCodes.paragraphSeparator:
      return true;

    default:
      return false;
  }
}

var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g; // https://tc39.github.io/ecma262/#sec-white-space

exports.skipWhiteSpace = skipWhiteSpace;

function isWhitespace(code) {
  switch (code) {
    case 0x0009: // CHARACTER TABULATION

    case 0x000b: // LINE TABULATION

    case 0x000c: // FORM FEED

    case charCodes.space:
    case charCodes.nonBreakingSpace:
    case charCodes.oghamSpaceMark:
    case 0x2000: // EN QUAD

    case 0x2001: // EM QUAD

    case 0x2002: // EN SPACE

    case 0x2003: // EM SPACE

    case 0x2004: // THREE-PER-EM SPACE

    case 0x2005: // FOUR-PER-EM SPACE

    case 0x2006: // SIX-PER-EM SPACE

    case 0x2007: // FIGURE SPACE

    case 0x2008: // PUNCTUATION SPACE

    case 0x2009: // THIN SPACE

    case 0x200a: // HAIR SPACE

    case 0x202f: // NARROW NO-BREAK SPACE

    case 0x205f: // MEDIUM MATHEMATICAL SPACE

    case 0x3000: // IDEOGRAPHIC SPACE

    case 0xfeff:
      // ZERO WIDTH NO-BREAK SPACE
      return true;

    default:
      return false;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3doaXRlc3BhY2UuanMiXSwibmFtZXMiOlsibGluZUJyZWFrIiwibGluZUJyZWFrRyIsIlJlZ0V4cCIsInNvdXJjZSIsImlzTmV3TGluZSIsImNvZGUiLCJjaGFyQ29kZXMiLCJsaW5lRmVlZCIsImNhcnJpYWdlUmV0dXJuIiwibGluZVNlcGFyYXRvciIsInBhcmFncmFwaFNlcGFyYXRvciIsInNraXBXaGl0ZVNwYWNlIiwiaXNXaGl0ZXNwYWNlIiwic3BhY2UiLCJub25CcmVha2luZ1NwYWNlIiwib2doYW1TcGFjZU1hcmsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRUE7Ozs7OztBQUVBO0FBQ0E7QUFDTyxJQUFNQSxTQUFTLEdBQUcsd0JBQWxCOztBQUNBLElBQU1DLFVBQVUsR0FBRyxJQUFJQyxNQUFKLENBQVdGLFNBQVMsQ0FBQ0csTUFBckIsRUFBNkIsR0FBN0IsQ0FBbkIsQyxDQUVQOzs7O0FBQ08sU0FBU0MsU0FBVCxDQUFtQkMsSUFBbkIsRUFBMEM7QUFDL0MsVUFBUUEsSUFBUjtBQUNFLFNBQUtDLFNBQVMsQ0FBQ0MsUUFBZjtBQUNBLFNBQUtELFNBQVMsQ0FBQ0UsY0FBZjtBQUNBLFNBQUtGLFNBQVMsQ0FBQ0csYUFBZjtBQUNBLFNBQUtILFNBQVMsQ0FBQ0ksa0JBQWY7QUFDRSxhQUFPLElBQVA7O0FBRUY7QUFDRSxhQUFPLEtBQVA7QUFSSjtBQVVEOztBQUVNLElBQU1DLGNBQWMsR0FBRywrQkFBdkIsQyxDQUVQOzs7O0FBQ08sU0FBU0MsWUFBVCxDQUFzQlAsSUFBdEIsRUFBNkM7QUFDbEQsVUFBUUEsSUFBUjtBQUNFLFNBQUssTUFBTCxDQURGLENBQ2U7O0FBQ2IsU0FBSyxNQUFMLENBRkYsQ0FFZTs7QUFDYixTQUFLLE1BQUwsQ0FIRixDQUdlOztBQUNiLFNBQUtDLFNBQVMsQ0FBQ08sS0FBZjtBQUNBLFNBQUtQLFNBQVMsQ0FBQ1EsZ0JBQWY7QUFDQSxTQUFLUixTQUFTLENBQUNTLGNBQWY7QUFDQSxTQUFLLE1BQUwsQ0FQRixDQU9lOztBQUNiLFNBQUssTUFBTCxDQVJGLENBUWU7O0FBQ2IsU0FBSyxNQUFMLENBVEYsQ0FTZTs7QUFDYixTQUFLLE1BQUwsQ0FWRixDQVVlOztBQUNiLFNBQUssTUFBTCxDQVhGLENBV2U7O0FBQ2IsU0FBSyxNQUFMLENBWkYsQ0FZZTs7QUFDYixTQUFLLE1BQUwsQ0FiRixDQWFlOztBQUNiLFNBQUssTUFBTCxDQWRGLENBY2U7O0FBQ2IsU0FBSyxNQUFMLENBZkYsQ0FlZTs7QUFDYixTQUFLLE1BQUwsQ0FoQkYsQ0FnQmU7O0FBQ2IsU0FBSyxNQUFMLENBakJGLENBaUJlOztBQUNiLFNBQUssTUFBTCxDQWxCRixDQWtCZTs7QUFDYixTQUFLLE1BQUwsQ0FuQkYsQ0FtQmU7O0FBQ2IsU0FBSyxNQUFMLENBcEJGLENBb0JlOztBQUNiLFNBQUssTUFBTDtBQUFhO0FBQ1gsYUFBTyxJQUFQOztBQUVGO0FBQ0UsYUFBTyxLQUFQO0FBekJKO0FBMkJEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0ICogYXMgY2hhckNvZGVzIGZyb20gXCJjaGFyY29kZXNcIjtcblxuLy8gTWF0Y2hlcyBhIHdob2xlIGxpbmUgYnJlYWsgKHdoZXJlIENSTEYgaXMgY29uc2lkZXJlZCBhIHNpbmdsZVxuLy8gbGluZSBicmVhaykuIFVzZWQgdG8gY291bnQgbGluZXMuXG5leHBvcnQgY29uc3QgbGluZUJyZWFrID0gL1xcclxcbj98W1xcblxcdTIwMjhcXHUyMDI5XS87XG5leHBvcnQgY29uc3QgbGluZUJyZWFrRyA9IG5ldyBSZWdFeHAobGluZUJyZWFrLnNvdXJjZSwgXCJnXCIpO1xuXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1saW5lLXRlcm1pbmF0b3JzXG5leHBvcnQgZnVuY3Rpb24gaXNOZXdMaW5lKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICBzd2l0Y2ggKGNvZGUpIHtcbiAgICBjYXNlIGNoYXJDb2Rlcy5saW5lRmVlZDpcbiAgICBjYXNlIGNoYXJDb2Rlcy5jYXJyaWFnZVJldHVybjpcbiAgICBjYXNlIGNoYXJDb2Rlcy5saW5lU2VwYXJhdG9yOlxuICAgIGNhc2UgY2hhckNvZGVzLnBhcmFncmFwaFNlcGFyYXRvcjpcbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2tpcFdoaXRlU3BhY2UgPSAvKD86XFxzfFxcL1xcLy4qfFxcL1xcKlteXSo/XFwqXFwvKSovZztcblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtd2hpdGUtc3BhY2VcbmV4cG9ydCBmdW5jdGlvbiBpc1doaXRlc3BhY2UoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHN3aXRjaCAoY29kZSkge1xuICAgIGNhc2UgMHgwMDA5OiAvLyBDSEFSQUNURVIgVEFCVUxBVElPTlxuICAgIGNhc2UgMHgwMDBiOiAvLyBMSU5FIFRBQlVMQVRJT05cbiAgICBjYXNlIDB4MDAwYzogLy8gRk9STSBGRUVEXG4gICAgY2FzZSBjaGFyQ29kZXMuc3BhY2U6XG4gICAgY2FzZSBjaGFyQ29kZXMubm9uQnJlYWtpbmdTcGFjZTpcbiAgICBjYXNlIGNoYXJDb2Rlcy5vZ2hhbVNwYWNlTWFyazpcbiAgICBjYXNlIDB4MjAwMDogLy8gRU4gUVVBRFxuICAgIGNhc2UgMHgyMDAxOiAvLyBFTSBRVUFEXG4gICAgY2FzZSAweDIwMDI6IC8vIEVOIFNQQUNFXG4gICAgY2FzZSAweDIwMDM6IC8vIEVNIFNQQUNFXG4gICAgY2FzZSAweDIwMDQ6IC8vIFRIUkVFLVBFUi1FTSBTUEFDRVxuICAgIGNhc2UgMHgyMDA1OiAvLyBGT1VSLVBFUi1FTSBTUEFDRVxuICAgIGNhc2UgMHgyMDA2OiAvLyBTSVgtUEVSLUVNIFNQQUNFXG4gICAgY2FzZSAweDIwMDc6IC8vIEZJR1VSRSBTUEFDRVxuICAgIGNhc2UgMHgyMDA4OiAvLyBQVU5DVFVBVElPTiBTUEFDRVxuICAgIGNhc2UgMHgyMDA5OiAvLyBUSElOIFNQQUNFXG4gICAgY2FzZSAweDIwMGE6IC8vIEhBSVIgU1BBQ0VcbiAgICBjYXNlIDB4MjAyZjogLy8gTkFSUk9XIE5PLUJSRUFLIFNQQUNFXG4gICAgY2FzZSAweDIwNWY6IC8vIE1FRElVTSBNQVRIRU1BVElDQUwgU1BBQ0VcbiAgICBjYXNlIDB4MzAwMDogLy8gSURFT0dSQVBISUMgU1BBQ0VcbiAgICBjYXNlIDB4ZmVmZjogLy8gWkVSTyBXSURUSCBOTy1CUkVBSyBTUEFDRVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=