"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIteratorStart = isIteratorStart;
exports.canBeReservedWord = canBeReservedWord;
Object.defineProperty(exports, "isIdentifierStart", {
  enumerable: true,
  get: function get() {
    return _helperValidatorIdentifier.isIdentifierStart;
  }
});
Object.defineProperty(exports, "isIdentifierChar", {
  enumerable: true,
  get: function get() {
    return _helperValidatorIdentifier.isIdentifierChar;
  }
});
Object.defineProperty(exports, "isReservedWord", {
  enumerable: true,
  get: function get() {
    return _helperValidatorIdentifier.isReservedWord;
  }
});
Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
  enumerable: true,
  get: function get() {
    return _helperValidatorIdentifier.isStrictBindOnlyReservedWord;
  }
});
Object.defineProperty(exports, "isStrictBindReservedWord", {
  enumerable: true,
  get: function get() {
    return _helperValidatorIdentifier.isStrictBindReservedWord;
  }
});
Object.defineProperty(exports, "isStrictReservedWord", {
  enumerable: true,
  get: function get() {
    return _helperValidatorIdentifier.isStrictReservedWord;
  }
});
Object.defineProperty(exports, "isKeyword", {
  enumerable: true,
  get: function get() {
    return _helperValidatorIdentifier.isKeyword;
  }
});
exports.keywordRelationalOperator = void 0;

var charCodes = _interopRequireWildcard(require("charcodes"));

var _helperValidatorIdentifier = require("@babel/helper-validator-identifier");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint max-len: 0 */
var keywordRelationalOperator = /^in(stanceof)?$/; // Test whether a current state character code and next character code is @

exports.keywordRelationalOperator = keywordRelationalOperator;

function isIteratorStart(current, next) {
  return current === charCodes.atSign && next === charCodes.atSign;
} // This is the comprehensive set of JavaScript reserved words
// If a word is in this set, it could be a reserved word,
// depending on sourceType/strictMode/binding info. In other words
// if a word is not in this set, it is not a reserved word under
// any circumstance.


var reservedWordLikeSet = new Set(["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete", // strict
"implements", "interface", "let", "package", "private", "protected", "public", "static", "yield", // strictBind
"eval", "arguments", // reservedWorkLike
"enum", "await"]);

function canBeReservedWord(word) {
  return reservedWordLikeSet.has(word);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2lkZW50aWZpZXIuanMiXSwibmFtZXMiOlsia2V5d29yZFJlbGF0aW9uYWxPcGVyYXRvciIsImlzSXRlcmF0b3JTdGFydCIsImN1cnJlbnQiLCJuZXh0IiwiY2hhckNvZGVzIiwiYXRTaWduIiwicmVzZXJ2ZWRXb3JkTGlrZVNldCIsIlNldCIsImNhbkJlUmVzZXJ2ZWRXb3JkIiwid29yZCIsImhhcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTs7QUFFQTs7Ozs7O0FBTkE7QUFnQk8sSUFBTUEseUJBQXlCLEdBQUcsaUJBQWxDLEMsQ0FFUDs7OztBQUVPLFNBQVNDLGVBQVQsQ0FBeUJDLE9BQXpCLEVBQTBDQyxJQUExQyxFQUFpRTtBQUN0RSxTQUFPRCxPQUFPLEtBQUtFLFNBQVMsQ0FBQ0MsTUFBdEIsSUFBZ0NGLElBQUksS0FBS0MsU0FBUyxDQUFDQyxNQUExRDtBQUNELEMsQ0FFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxJQUFNQyxtQkFBbUIsR0FBRyxJQUFJQyxHQUFKLENBQVEsQ0FDbEMsT0FEa0MsRUFFbEMsTUFGa0MsRUFHbEMsT0FIa0MsRUFJbEMsVUFKa0MsRUFLbEMsVUFMa0MsRUFNbEMsU0FOa0MsRUFPbEMsSUFQa0MsRUFRbEMsTUFSa0MsRUFTbEMsU0FUa0MsRUFVbEMsS0FWa0MsRUFXbEMsVUFYa0MsRUFZbEMsSUFaa0MsRUFhbEMsUUFia0MsRUFjbEMsUUFka0MsRUFlbEMsT0Fma0MsRUFnQmxDLEtBaEJrQyxFQWlCbEMsS0FqQmtDLEVBa0JsQyxPQWxCa0MsRUFtQmxDLE9BbkJrQyxFQW9CbEMsTUFwQmtDLEVBcUJsQyxLQXJCa0MsRUFzQmxDLE1BdEJrQyxFQXVCbEMsT0F2QmtDLEVBd0JsQyxPQXhCa0MsRUF5QmxDLFNBekJrQyxFQTBCbEMsUUExQmtDLEVBMkJsQyxRQTNCa0MsRUE0QmxDLE1BNUJrQyxFQTZCbEMsTUE3QmtDLEVBOEJsQyxPQTlCa0MsRUErQmxDLElBL0JrQyxFQWdDbEMsWUFoQ2tDLEVBaUNsQyxRQWpDa0MsRUFrQ2xDLE1BbENrQyxFQW1DbEMsUUFuQ2tDLEVBb0NsQztBQUNBLFlBckNrQyxFQXNDbEMsV0F0Q2tDLEVBdUNsQyxLQXZDa0MsRUF3Q2xDLFNBeENrQyxFQXlDbEMsU0F6Q2tDLEVBMENsQyxXQTFDa0MsRUEyQ2xDLFFBM0NrQyxFQTRDbEMsUUE1Q2tDLEVBNkNsQyxPQTdDa0MsRUE4Q2xDO0FBQ0EsTUEvQ2tDLEVBZ0RsQyxXQWhEa0MsRUFpRGxDO0FBQ0EsTUFsRGtDLEVBbURsQyxPQW5Ea0MsQ0FBUixDQUE1Qjs7QUFzRE8sU0FBU0MsaUJBQVQsQ0FBMkJDLElBQTNCLEVBQWtEO0FBQ3ZELFNBQU9ILG1CQUFtQixDQUFDSSxHQUFwQixDQUF3QkQsSUFBeEIsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50IG1heC1sZW46IDAgKi9cblxuLy8gQGZsb3dcblxuaW1wb3J0ICogYXMgY2hhckNvZGVzIGZyb20gXCJjaGFyY29kZXNcIjtcblxuZXhwb3J0IHtcbiAgaXNJZGVudGlmaWVyU3RhcnQsXG4gIGlzSWRlbnRpZmllckNoYXIsXG4gIGlzUmVzZXJ2ZWRXb3JkLFxuICBpc1N0cmljdEJpbmRPbmx5UmVzZXJ2ZWRXb3JkLFxuICBpc1N0cmljdEJpbmRSZXNlcnZlZFdvcmQsXG4gIGlzU3RyaWN0UmVzZXJ2ZWRXb3JkLFxuICBpc0tleXdvcmQsXG59IGZyb20gXCJAYmFiZWwvaGVscGVyLXZhbGlkYXRvci1pZGVudGlmaWVyXCI7XG5cbmV4cG9ydCBjb25zdCBrZXl3b3JkUmVsYXRpb25hbE9wZXJhdG9yID0gL15pbihzdGFuY2VvZik/JC87XG5cbi8vIFRlc3Qgd2hldGhlciBhIGN1cnJlbnQgc3RhdGUgY2hhcmFjdGVyIGNvZGUgYW5kIG5leHQgY2hhcmFjdGVyIGNvZGUgaXMgQFxuXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVyYXRvclN0YXJ0KGN1cnJlbnQ6IG51bWJlciwgbmV4dDogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjdXJyZW50ID09PSBjaGFyQ29kZXMuYXRTaWduICYmIG5leHQgPT09IGNoYXJDb2Rlcy5hdFNpZ247XG59XG5cbi8vIFRoaXMgaXMgdGhlIGNvbXByZWhlbnNpdmUgc2V0IG9mIEphdmFTY3JpcHQgcmVzZXJ2ZWQgd29yZHNcbi8vIElmIGEgd29yZCBpcyBpbiB0aGlzIHNldCwgaXQgY291bGQgYmUgYSByZXNlcnZlZCB3b3JkLFxuLy8gZGVwZW5kaW5nIG9uIHNvdXJjZVR5cGUvc3RyaWN0TW9kZS9iaW5kaW5nIGluZm8uIEluIG90aGVyIHdvcmRzXG4vLyBpZiBhIHdvcmQgaXMgbm90IGluIHRoaXMgc2V0LCBpdCBpcyBub3QgYSByZXNlcnZlZCB3b3JkIHVuZGVyXG4vLyBhbnkgY2lyY3Vtc3RhbmNlLlxuY29uc3QgcmVzZXJ2ZWRXb3JkTGlrZVNldCA9IG5ldyBTZXQoW1xuICBcImJyZWFrXCIsXG4gIFwiY2FzZVwiLFxuICBcImNhdGNoXCIsXG4gIFwiY29udGludWVcIixcbiAgXCJkZWJ1Z2dlclwiLFxuICBcImRlZmF1bHRcIixcbiAgXCJkb1wiLFxuICBcImVsc2VcIixcbiAgXCJmaW5hbGx5XCIsXG4gIFwiZm9yXCIsXG4gIFwiZnVuY3Rpb25cIixcbiAgXCJpZlwiLFxuICBcInJldHVyblwiLFxuICBcInN3aXRjaFwiLFxuICBcInRocm93XCIsXG4gIFwidHJ5XCIsXG4gIFwidmFyXCIsXG4gIFwiY29uc3RcIixcbiAgXCJ3aGlsZVwiLFxuICBcIndpdGhcIixcbiAgXCJuZXdcIixcbiAgXCJ0aGlzXCIsXG4gIFwic3VwZXJcIixcbiAgXCJjbGFzc1wiLFxuICBcImV4dGVuZHNcIixcbiAgXCJleHBvcnRcIixcbiAgXCJpbXBvcnRcIixcbiAgXCJudWxsXCIsXG4gIFwidHJ1ZVwiLFxuICBcImZhbHNlXCIsXG4gIFwiaW5cIixcbiAgXCJpbnN0YW5jZW9mXCIsXG4gIFwidHlwZW9mXCIsXG4gIFwidm9pZFwiLFxuICBcImRlbGV0ZVwiLFxuICAvLyBzdHJpY3RcbiAgXCJpbXBsZW1lbnRzXCIsXG4gIFwiaW50ZXJmYWNlXCIsXG4gIFwibGV0XCIsXG4gIFwicGFja2FnZVwiLFxuICBcInByaXZhdGVcIixcbiAgXCJwcm90ZWN0ZWRcIixcbiAgXCJwdWJsaWNcIixcbiAgXCJzdGF0aWNcIixcbiAgXCJ5aWVsZFwiLFxuICAvLyBzdHJpY3RCaW5kXG4gIFwiZXZhbFwiLFxuICBcImFyZ3VtZW50c1wiLFxuICAvLyByZXNlcnZlZFdvcmtMaWtlXG4gIFwiZW51bVwiLFxuICBcImF3YWl0XCIsXG5dKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbkJlUmVzZXJ2ZWRXb3JkKHdvcmQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gcmVzZXJ2ZWRXb3JkTGlrZVNldC5oYXMod29yZCk7XG59XG4iXX0=