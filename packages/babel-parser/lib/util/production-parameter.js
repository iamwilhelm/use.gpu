"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionFlags = functionFlags;
exports["default"] = exports.PARAM_MOUNT = exports.PARAM_IN = exports.PARAM_RETURN = exports.PARAM_AWAIT = exports.PARAM_YIELD = exports.PARAM = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PARAM = 0,
    // Initial Parameter flags
PARAM_YIELD = 1,
    // track [Yield] production parameter
PARAM_AWAIT = 2,
    // track [Await] production parameter
PARAM_RETURN = 4,
    // track [Return] production parameter
PARAM_IN = 8,
    // track [In] production parameter
PARAM_MOUNT = 16; // track [Mount] production parameter
// ProductionParameterHandler is a stack fashioned production parameter tracker
// https://tc39.es/ecma262/#sec-grammar-notation
// The tracked parameters are defined above.
//
// Whenever [+Await]/[+Yield] appears in the right-hand sides of a production,
// we must enter a new tracking stack. For example when parsing
//
// AsyncFunctionDeclaration [Yield, Await]:
//   async [no LineTerminator here] function BindingIdentifier[?Yield, ?Await]
//     ( FormalParameters[~Yield, +Await] ) { AsyncFunctionBody }
//
// we must follow such process:
//
// 1. parse async keyword
// 2. parse function keyword
// 3. parse bindingIdentifier <= inherit current parameters: [?Await]
// 4. enter new stack with (PARAM_AWAIT)
// 5. parse formal parameters <= must have [Await] parameter [+Await]
// 6. parse function body
// 7. exit current stack

exports.PARAM_MOUNT = PARAM_MOUNT;
exports.PARAM_IN = PARAM_IN;
exports.PARAM_RETURN = PARAM_RETURN;
exports.PARAM_AWAIT = PARAM_AWAIT;
exports.PARAM_YIELD = PARAM_YIELD;
exports.PARAM = PARAM;

var ProductionParameterHandler = /*#__PURE__*/function () {
  function ProductionParameterHandler() {
    _classCallCheck(this, ProductionParameterHandler);

    _defineProperty(this, "stacks", []);
  }

  _createClass(ProductionParameterHandler, [{
    key: "enter",
    value: function enter(flags) {
      this.stacks.push(flags);
    }
  }, {
    key: "exit",
    value: function exit() {
      this.stacks.pop();
    }
  }, {
    key: "currentFlags",
    value: function currentFlags() {
      return this.stacks[this.stacks.length - 1];
    }
  }, {
    key: "hasAwait",
    get: function get() {
      return (this.currentFlags() & PARAM_AWAIT) > 0;
    }
  }, {
    key: "hasYield",
    get: function get() {
      return (this.currentFlags() & PARAM_YIELD) > 0;
    }
  }, {
    key: "hasReturn",
    get: function get() {
      return (this.currentFlags() & PARAM_RETURN) > 0;
    }
  }, {
    key: "hasIn",
    get: function get() {
      return (this.currentFlags() & PARAM_IN) > 0;
    }
  }, {
    key: "hasMount",
    get: function get() {
      return (this.currentFlags() & PARAM_MOUNT) > 0;
    }
  }]);

  return ProductionParameterHandler;
}();

exports["default"] = ProductionParameterHandler;

function functionFlags(isAsync, isGenerator, isLive) {
  return (isAsync ? PARAM_AWAIT : 0) | (isGenerator ? PARAM_YIELD : 0) | (isLive ? PARAM_MOUNT : 0);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3Byb2R1Y3Rpb24tcGFyYW1ldGVyLmpzIl0sIm5hbWVzIjpbIlBBUkFNIiwiUEFSQU1fWUlFTEQiLCJQQVJBTV9BV0FJVCIsIlBBUkFNX1JFVFVSTiIsIlBBUkFNX0lOIiwiUEFSQU1fTU9VTlQiLCJQcm9kdWN0aW9uUGFyYW1ldGVySGFuZGxlciIsImZsYWdzIiwic3RhY2tzIiwicHVzaCIsInBvcCIsImxlbmd0aCIsImN1cnJlbnRGbGFncyIsImZ1bmN0aW9uRmxhZ3MiLCJpc0FzeW5jIiwiaXNHZW5lcmF0b3IiLCJpc0xpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDTyxJQUFNQSxLQUFLLEdBQUcsQ0FBZDtBQUFBLElBQXNCO0FBQzNCQyxXQUFXLEdBQUcsQ0FEVDtBQUFBLElBQ2lCO0FBQ3RCQyxXQUFXLEdBQUcsQ0FGVDtBQUFBLElBRWlCO0FBQ3RCQyxZQUFZLEdBQUcsQ0FIVjtBQUFBLElBR2tCO0FBQ3ZCQyxRQUFRLEdBQUcsQ0FKTjtBQUFBLElBSWM7QUFDbkJDLFdBQVcsR0FBRyxFQUxULEMsQ0FLa0I7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0lBVXFCQywwQjs7OztvQ0FDUSxFOzs7OztXQUMzQixlQUFNQyxLQUFOLEVBQXdCO0FBQ3RCLFdBQUtDLE1BQUwsQ0FBWUMsSUFBWixDQUFpQkYsS0FBakI7QUFDRDs7O1dBRUQsZ0JBQU87QUFDTCxXQUFLQyxNQUFMLENBQVlFLEdBQVo7QUFDRDs7O1dBRUQsd0JBQTBCO0FBQ3hCLGFBQU8sS0FBS0YsTUFBTCxDQUFZLEtBQUtBLE1BQUwsQ0FBWUcsTUFBWixHQUFxQixDQUFqQyxDQUFQO0FBQ0Q7OztTQUVELGVBQXdCO0FBQ3RCLGFBQU8sQ0FBQyxLQUFLQyxZQUFMLEtBQXNCVixXQUF2QixJQUFzQyxDQUE3QztBQUNEOzs7U0FFRCxlQUF3QjtBQUN0QixhQUFPLENBQUMsS0FBS1UsWUFBTCxLQUFzQlgsV0FBdkIsSUFBc0MsQ0FBN0M7QUFDRDs7O1NBRUQsZUFBeUI7QUFDdkIsYUFBTyxDQUFDLEtBQUtXLFlBQUwsS0FBc0JULFlBQXZCLElBQXVDLENBQTlDO0FBQ0Q7OztTQUVELGVBQXFCO0FBQ25CLGFBQU8sQ0FBQyxLQUFLUyxZQUFMLEtBQXNCUixRQUF2QixJQUFtQyxDQUExQztBQUNEOzs7U0FFRCxlQUF3QjtBQUN0QixhQUFPLENBQUMsS0FBS1EsWUFBTCxLQUFzQlAsV0FBdkIsSUFBc0MsQ0FBN0M7QUFDRDs7Ozs7Ozs7QUFHSSxTQUFTUSxhQUFULENBQ0xDLE9BREssRUFFTEMsV0FGSyxFQUdMQyxNQUhLLEVBSU07QUFDWCxTQUFPLENBQUNGLE9BQU8sR0FBR1osV0FBSCxHQUFpQixDQUF6QixLQUErQmEsV0FBVyxHQUFHZCxXQUFILEdBQWlCLENBQTNELEtBQWlFZSxNQUFNLEdBQUdYLFdBQUgsR0FBaUIsQ0FBeEYsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBQQVJBTSA9IDBiMDAwMCwgLy8gSW5pdGlhbCBQYXJhbWV0ZXIgZmxhZ3NcbiAgUEFSQU1fWUlFTEQgPSAwYjAwMDEsIC8vIHRyYWNrIFtZaWVsZF0gcHJvZHVjdGlvbiBwYXJhbWV0ZXJcbiAgUEFSQU1fQVdBSVQgPSAwYjAwMTAsIC8vIHRyYWNrIFtBd2FpdF0gcHJvZHVjdGlvbiBwYXJhbWV0ZXJcbiAgUEFSQU1fUkVUVVJOID0gMGIwMTAwLCAvLyB0cmFjayBbUmV0dXJuXSBwcm9kdWN0aW9uIHBhcmFtZXRlclxuICBQQVJBTV9JTiA9IDBiMTAwMCwgLy8gdHJhY2sgW0luXSBwcm9kdWN0aW9uIHBhcmFtZXRlclxuICBQQVJBTV9NT1VOVCA9IDBiMTAwMDA7IC8vIHRyYWNrIFtNb3VudF0gcHJvZHVjdGlvbiBwYXJhbWV0ZXJcblxuLy8gUHJvZHVjdGlvblBhcmFtZXRlckhhbmRsZXIgaXMgYSBzdGFjayBmYXNoaW9uZWQgcHJvZHVjdGlvbiBwYXJhbWV0ZXIgdHJhY2tlclxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1ncmFtbWFyLW5vdGF0aW9uXG4vLyBUaGUgdHJhY2tlZCBwYXJhbWV0ZXJzIGFyZSBkZWZpbmVkIGFib3ZlLlxuLy9cbi8vIFdoZW5ldmVyIFsrQXdhaXRdL1srWWllbGRdIGFwcGVhcnMgaW4gdGhlIHJpZ2h0LWhhbmQgc2lkZXMgb2YgYSBwcm9kdWN0aW9uLFxuLy8gd2UgbXVzdCBlbnRlciBhIG5ldyB0cmFja2luZyBzdGFjay4gRm9yIGV4YW1wbGUgd2hlbiBwYXJzaW5nXG4vL1xuLy8gQXN5bmNGdW5jdGlvbkRlY2xhcmF0aW9uIFtZaWVsZCwgQXdhaXRdOlxuLy8gICBhc3luYyBbbm8gTGluZVRlcm1pbmF0b3IgaGVyZV0gZnVuY3Rpb24gQmluZGluZ0lkZW50aWZpZXJbP1lpZWxkLCA/QXdhaXRdXG4vLyAgICAgKCBGb3JtYWxQYXJhbWV0ZXJzW35ZaWVsZCwgK0F3YWl0XSApIHsgQXN5bmNGdW5jdGlvbkJvZHkgfVxuLy9cbi8vIHdlIG11c3QgZm9sbG93IHN1Y2ggcHJvY2Vzczpcbi8vXG4vLyAxLiBwYXJzZSBhc3luYyBrZXl3b3JkXG4vLyAyLiBwYXJzZSBmdW5jdGlvbiBrZXl3b3JkXG4vLyAzLiBwYXJzZSBiaW5kaW5nSWRlbnRpZmllciA8PSBpbmhlcml0IGN1cnJlbnQgcGFyYW1ldGVyczogWz9Bd2FpdF1cbi8vIDQuIGVudGVyIG5ldyBzdGFjayB3aXRoIChQQVJBTV9BV0FJVClcbi8vIDUuIHBhcnNlIGZvcm1hbCBwYXJhbWV0ZXJzIDw9IG11c3QgaGF2ZSBbQXdhaXRdIHBhcmFtZXRlciBbK0F3YWl0XVxuLy8gNi4gcGFyc2UgZnVuY3Rpb24gYm9keVxuLy8gNy4gZXhpdCBjdXJyZW50IHN0YWNrXG5cbmV4cG9ydCB0eXBlIFBhcmFtS2luZCA9XG4gIHwgdHlwZW9mIFBBUkFNXG4gIHwgdHlwZW9mIFBBUkFNX0FXQUlUXG4gIHwgdHlwZW9mIFBBUkFNX0lOXG4gIHwgdHlwZW9mIFBBUkFNX1JFVFVSTlxuICB8IHR5cGVvZiBQQVJBTV9ZSUVMRFxuICB8IHR5cGVvZiBQQVJBTV9NT1VOVDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZHVjdGlvblBhcmFtZXRlckhhbmRsZXIge1xuICBzdGFja3M6IEFycmF5PFBhcmFtS2luZD4gPSBbXTtcbiAgZW50ZXIoZmxhZ3M6IFBhcmFtS2luZCkge1xuICAgIHRoaXMuc3RhY2tzLnB1c2goZmxhZ3MpO1xuICB9XG5cbiAgZXhpdCgpIHtcbiAgICB0aGlzLnN0YWNrcy5wb3AoKTtcbiAgfVxuXG4gIGN1cnJlbnRGbGFncygpOiBQYXJhbUtpbmQge1xuICAgIHJldHVybiB0aGlzLnN0YWNrc1t0aGlzLnN0YWNrcy5sZW5ndGggLSAxXTtcbiAgfVxuXG4gIGdldCBoYXNBd2FpdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuY3VycmVudEZsYWdzKCkgJiBQQVJBTV9BV0FJVCkgPiAwO1xuICB9XG5cbiAgZ2V0IGhhc1lpZWxkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5jdXJyZW50RmxhZ3MoKSAmIFBBUkFNX1lJRUxEKSA+IDA7XG4gIH1cblxuICBnZXQgaGFzUmV0dXJuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5jdXJyZW50RmxhZ3MoKSAmIFBBUkFNX1JFVFVSTikgPiAwO1xuICB9XG5cbiAgZ2V0IGhhc0luKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5jdXJyZW50RmxhZ3MoKSAmIFBBUkFNX0lOKSA+IDA7XG4gIH1cblxuICBnZXQgaGFzTW91bnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLmN1cnJlbnRGbGFncygpICYgUEFSQU1fTU9VTlQpID4gMDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25GbGFncyhcbiAgaXNBc3luYzogYm9vbGVhbixcbiAgaXNHZW5lcmF0b3I6IGJvb2xlYW4sXG4gIGlzTGl2ZTogYm9vbGVhbixcbik6IFBhcmFtS2luZCB7XG4gIHJldHVybiAoaXNBc3luYyA/IFBBUkFNX0FXQUlUIDogMCkgfCAoaXNHZW5lcmF0b3IgPyBQQVJBTV9ZSUVMRCA6IDApIHwgKGlzTGl2ZSA/IFBBUkFNX01PVU5UIDogMCk7XG59XG4iXX0=