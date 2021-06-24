"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Scope = void 0;

var _scopeflags = require("./scopeflags");

var N = _interopRequireWildcard(require("../types"));

var _error = require("../parser/error");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Start an AST node, attaching a start offset.
var Scope = // A set of var-declared names in the current lexical scope
// A set of lexically-declared names in the current lexical scope
// A set of lexically-declared FunctionDeclaration names in the current lexical scope
function Scope(flags) {
  _classCallCheck(this, Scope);

  _defineProperty(this, "var", new Set());

  _defineProperty(this, "lexical", new Set());

  _defineProperty(this, "functions", new Set());

  this.flags = flags;
}; // The functions in this module keep track of declared variables in the
// current scope in order to detect duplicate variable names.


exports.Scope = Scope;

var ScopeHandler = /*#__PURE__*/function () {
  function ScopeHandler(raise, inModule) {
    _classCallCheck(this, ScopeHandler);

    _defineProperty(this, "scopeStack", []);

    _defineProperty(this, "undefinedExports", new Map());

    _defineProperty(this, "undefinedPrivateNames", new Map());

    this.raise = raise;
    this.inModule = inModule;
  }

  _createClass(ScopeHandler, [{
    key: "inFunction",
    get: function get() {
      return (this.currentVarScopeFlags() & _scopeflags.SCOPE_FUNCTION) > 0;
    }
  }, {
    key: "allowSuper",
    get: function get() {
      return (this.currentThisScopeFlags() & _scopeflags.SCOPE_SUPER) > 0;
    }
  }, {
    key: "allowDirectSuper",
    get: function get() {
      return (this.currentThisScopeFlags() & _scopeflags.SCOPE_DIRECT_SUPER) > 0;
    }
  }, {
    key: "inClass",
    get: function get() {
      return (this.currentThisScopeFlags() & _scopeflags.SCOPE_CLASS) > 0;
    }
  }, {
    key: "inClassAndNotInNonArrowFunction",
    get: function get() {
      var flags = this.currentThisScopeFlags();
      return (flags & _scopeflags.SCOPE_CLASS) > 0 && (flags & _scopeflags.SCOPE_FUNCTION) === 0;
    }
  }, {
    key: "inStaticBlock",
    get: function get() {
      return (this.currentThisScopeFlags() & _scopeflags.SCOPE_STATIC_BLOCK) > 0;
    }
  }, {
    key: "inNonArrowFunction",
    get: function get() {
      return (this.currentThisScopeFlags() & _scopeflags.SCOPE_FUNCTION) > 0;
    }
  }, {
    key: "treatFunctionsAsVar",
    get: function get() {
      return this.treatFunctionsAsVarInScope(this.currentScope());
    }
  }, {
    key: "createScope",
    value: function createScope(flags) {
      return new Scope(flags);
    } // This method will be overwritten by subclasses

    /*:: +createScope: (flags: ScopeFlags) => IScope; */

  }, {
    key: "enter",
    value: function enter(flags) {
      this.scopeStack.push(this.createScope(flags));
    }
  }, {
    key: "exit",
    value: function exit() {
      this.scopeStack.pop();
    } // The spec says:
    // > At the top level of a function, or script, function declarations are
    // > treated like var declarations rather than like lexical declarations.

  }, {
    key: "treatFunctionsAsVarInScope",
    value: function treatFunctionsAsVarInScope(scope) {
      return !!(scope.flags & _scopeflags.SCOPE_FUNCTION || !this.inModule && scope.flags & _scopeflags.SCOPE_PROGRAM);
    }
  }, {
    key: "declareName",
    value: function declareName(name, bindingType, pos) {
      var scope = this.currentScope();

      if (bindingType & _scopeflags.BIND_SCOPE_LEXICAL || bindingType & _scopeflags.BIND_SCOPE_FUNCTION) {
        this.checkRedeclarationInScope(scope, name, bindingType, pos);

        if (bindingType & _scopeflags.BIND_SCOPE_FUNCTION) {
          scope.functions.add(name);
        } else {
          scope.lexical.add(name);
        }

        if (bindingType & _scopeflags.BIND_SCOPE_LEXICAL) {
          this.maybeExportDefined(scope, name);
        }
      } else if (bindingType & _scopeflags.BIND_SCOPE_VAR) {
        for (var i = this.scopeStack.length - 1; i >= 0; --i) {
          scope = this.scopeStack[i];
          this.checkRedeclarationInScope(scope, name, bindingType, pos);
          scope["var"].add(name);
          this.maybeExportDefined(scope, name);
          if (scope.flags & _scopeflags.SCOPE_VAR) break;
        }
      }

      if (this.inModule && scope.flags & _scopeflags.SCOPE_PROGRAM) {
        this.undefinedExports["delete"](name);
      }
    }
  }, {
    key: "maybeExportDefined",
    value: function maybeExportDefined(scope, name) {
      if (this.inModule && scope.flags & _scopeflags.SCOPE_PROGRAM) {
        this.undefinedExports["delete"](name);
      }
    }
  }, {
    key: "checkRedeclarationInScope",
    value: function checkRedeclarationInScope(scope, name, bindingType, pos) {
      if (this.isRedeclaredInScope(scope, name, bindingType)) {
        this.raise(pos, _error.Errors.VarRedeclaration, name);
      }
    }
  }, {
    key: "isRedeclaredInScope",
    value: function isRedeclaredInScope(scope, name, bindingType) {
      if (!(bindingType & _scopeflags.BIND_KIND_VALUE)) return false;

      if (bindingType & _scopeflags.BIND_SCOPE_LEXICAL) {
        return scope.lexical.has(name) || scope.functions.has(name) || scope["var"].has(name);
      }

      if (bindingType & _scopeflags.BIND_SCOPE_FUNCTION) {
        return scope.lexical.has(name) || !this.treatFunctionsAsVarInScope(scope) && scope["var"].has(name);
      }

      return scope.lexical.has(name) && !(scope.flags & _scopeflags.SCOPE_SIMPLE_CATCH && scope.lexical.values().next().value === name) || !this.treatFunctionsAsVarInScope(scope) && scope.functions.has(name);
    }
  }, {
    key: "checkLocalExport",
    value: function checkLocalExport(id) {
      var name = id.name;
      var topLevelScope = this.scopeStack[0];

      if (!topLevelScope.lexical.has(name) && !topLevelScope["var"].has(name) && // In strict mode, scope.functions will always be empty.
      // Modules are strict by default, but the `scriptMode` option
      // can overwrite this behavior.
      !topLevelScope.functions.has(name)) {
        this.undefinedExports.set(name, id.start);
      }
    }
  }, {
    key: "currentScope",
    value: function currentScope() {
      return this.scopeStack[this.scopeStack.length - 1];
    } // $FlowIgnore

  }, {
    key: "currentVarScopeFlags",
    value: function currentVarScopeFlags() {
      for (var i = this.scopeStack.length - 1;; i--) {
        var flags = this.scopeStack[i].flags;

        if (flags & _scopeflags.SCOPE_VAR) {
          return flags;
        }
      }
    } // Could be useful for `arguments`, `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
    // $FlowIgnore

  }, {
    key: "currentThisScopeFlags",
    value: function currentThisScopeFlags() {
      for (var i = this.scopeStack.length - 1;; i--) {
        var flags = this.scopeStack[i].flags;

        if (flags & (_scopeflags.SCOPE_VAR | _scopeflags.SCOPE_CLASS) && !(flags & _scopeflags.SCOPE_ARROW)) {
          return flags;
        }
      }
    }
  }]);

  return ScopeHandler;
}();

exports["default"] = ScopeHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3Njb3BlLmpzIl0sIm5hbWVzIjpbIlNjb3BlIiwiZmxhZ3MiLCJTZXQiLCJTY29wZUhhbmRsZXIiLCJyYWlzZSIsImluTW9kdWxlIiwiTWFwIiwiY3VycmVudFZhclNjb3BlRmxhZ3MiLCJTQ09QRV9GVU5DVElPTiIsImN1cnJlbnRUaGlzU2NvcGVGbGFncyIsIlNDT1BFX1NVUEVSIiwiU0NPUEVfRElSRUNUX1NVUEVSIiwiU0NPUEVfQ0xBU1MiLCJTQ09QRV9TVEFUSUNfQkxPQ0siLCJ0cmVhdEZ1bmN0aW9uc0FzVmFySW5TY29wZSIsImN1cnJlbnRTY29wZSIsInNjb3BlU3RhY2siLCJwdXNoIiwiY3JlYXRlU2NvcGUiLCJwb3AiLCJzY29wZSIsIlNDT1BFX1BST0dSQU0iLCJuYW1lIiwiYmluZGluZ1R5cGUiLCJwb3MiLCJCSU5EX1NDT1BFX0xFWElDQUwiLCJCSU5EX1NDT1BFX0ZVTkNUSU9OIiwiY2hlY2tSZWRlY2xhcmF0aW9uSW5TY29wZSIsImZ1bmN0aW9ucyIsImFkZCIsImxleGljYWwiLCJtYXliZUV4cG9ydERlZmluZWQiLCJCSU5EX1NDT1BFX1ZBUiIsImkiLCJsZW5ndGgiLCJTQ09QRV9WQVIiLCJ1bmRlZmluZWRFeHBvcnRzIiwiaXNSZWRlY2xhcmVkSW5TY29wZSIsIkVycm9ycyIsIlZhclJlZGVjbGFyYXRpb24iLCJCSU5EX0tJTkRfVkFMVUUiLCJoYXMiLCJTQ09QRV9TSU1QTEVfQ0FUQ0giLCJ2YWx1ZXMiLCJuZXh0IiwidmFsdWUiLCJpZCIsInRvcExldmVsU2NvcGUiLCJzZXQiLCJzdGFydCIsIlNDT1BFX0FSUk9XIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7QUFpQkE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsSyxHQUVYO0FBRUE7QUFFQTtBQUdBLGVBQVlDLEtBQVosRUFBK0I7QUFBQTs7QUFBQSwrQkFOWixJQUFJQyxHQUFKLEVBTVk7O0FBQUEsbUNBSlIsSUFBSUEsR0FBSixF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X0FSUk9XLFxuICBTQ09QRV9ESVJFQ1RfU1VQRVIsXG4gIFNDT1BFX0ZVTkNUSU9OLFxuICBTQ09QRV9TSU1QTEVfQ0FUQ0gsXG4gIFNDT1BFX1NVUEVSLFxuICBTQ09QRV9QUk9HUkFNLFxuICBTQ09QRV9WQVIsXG4gIFNDT1BFX0NMQVNTLFxuICBTQ09QRV9TVEFUSUNfQkxPQ0ssXG4gIEJJTkRfU0NPUEVfRlVOQ1RJT04sXG4gIEJJTkRfU0NPUEVfVkFSLFxuICBCSU5EX1NDT1BFX0xFWElDQUwsXG4gIEJJTkRfS0lORF9WQUxVRSxcbiAgdHlwZSBTY29wZUZsYWdzLFxuICB0eXBlIEJpbmRpbmdUeXBlcyxcbn0gZnJvbSBcIi4vc2NvcGVmbGFnc1wiO1xuaW1wb3J0ICogYXMgTiBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IEVycm9ycywgdHlwZSByYWlzZUZ1bmN0aW9uIH0gZnJvbSBcIi4uL3BhcnNlci9lcnJvclwiO1xuXG4vLyBTdGFydCBhbiBBU1Qgbm9kZSwgYXR0YWNoaW5nIGEgc3RhcnQgb2Zmc2V0LlxuZXhwb3J0IGNsYXNzIFNjb3BlIHtcbiAgZGVjbGFyZSBmbGFnczogU2NvcGVGbGFncztcbiAgLy8gQSBzZXQgb2YgdmFyLWRlY2xhcmVkIG5hbWVzIGluIHRoZSBjdXJyZW50IGxleGljYWwgc2NvcGVcbiAgdmFyOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbiAgLy8gQSBzZXQgb2YgbGV4aWNhbGx5LWRlY2xhcmVkIG5hbWVzIGluIHRoZSBjdXJyZW50IGxleGljYWwgc2NvcGVcbiAgbGV4aWNhbDogU2V0PHN0cmluZz4gPSBuZXcgU2V0KCk7XG4gIC8vIEEgc2V0IG9mIGxleGljYWxseS1kZWNsYXJlZCBGdW5jdGlvbkRlY2xhcmF0aW9uIG5hbWVzIGluIHRoZSBjdXJyZW50IGxleGljYWwgc2NvcGVcbiAgZnVuY3Rpb25zOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcblxuICBjb25zdHJ1Y3RvcihmbGFnczogU2NvcGVGbGFncykge1xuICAgIHRoaXMuZmxhZ3MgPSBmbGFncztcbiAgfVxufVxuXG4vLyBUaGUgZnVuY3Rpb25zIGluIHRoaXMgbW9kdWxlIGtlZXAgdHJhY2sgb2YgZGVjbGFyZWQgdmFyaWFibGVzIGluIHRoZVxuLy8gY3VycmVudCBzY29wZSBpbiBvcmRlciB0byBkZXRlY3QgZHVwbGljYXRlIHZhcmlhYmxlIG5hbWVzLlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NvcGVIYW5kbGVyPElTY29wZTogU2NvcGUgPSBTY29wZT4ge1xuICBzY29wZVN0YWNrOiBBcnJheTxJU2NvcGU+ID0gW107XG4gIGRlY2xhcmUgcmFpc2U6IHJhaXNlRnVuY3Rpb247XG4gIGRlY2xhcmUgaW5Nb2R1bGU6IGJvb2xlYW47XG4gIHVuZGVmaW5lZEV4cG9ydHM6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gIHVuZGVmaW5lZFByaXZhdGVOYW1lczogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKTtcblxuICBjb25zdHJ1Y3RvcihyYWlzZTogcmFpc2VGdW5jdGlvbiwgaW5Nb2R1bGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnJhaXNlID0gcmFpc2U7XG4gICAgdGhpcy5pbk1vZHVsZSA9IGluTW9kdWxlO1xuICB9XG5cbiAgZ2V0IGluRnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLmN1cnJlbnRWYXJTY29wZUZsYWdzKCkgJiBTQ09QRV9GVU5DVElPTikgPiAwO1xuICB9XG4gIGdldCBhbGxvd1N1cGVyKCkge1xuICAgIHJldHVybiAodGhpcy5jdXJyZW50VGhpc1Njb3BlRmxhZ3MoKSAmIFNDT1BFX1NVUEVSKSA+IDA7XG4gIH1cbiAgZ2V0IGFsbG93RGlyZWN0U3VwZXIoKSB7XG4gICAgcmV0dXJuICh0aGlzLmN1cnJlbnRUaGlzU2NvcGVGbGFncygpICYgU0NPUEVfRElSRUNUX1NVUEVSKSA+IDA7XG4gIH1cbiAgZ2V0IGluQ2xhc3MoKSB7XG4gICAgcmV0dXJuICh0aGlzLmN1cnJlbnRUaGlzU2NvcGVGbGFncygpICYgU0NPUEVfQ0xBU1MpID4gMDtcbiAgfVxuICBnZXQgaW5DbGFzc0FuZE5vdEluTm9uQXJyb3dGdW5jdGlvbigpIHtcbiAgICBjb25zdCBmbGFncyA9IHRoaXMuY3VycmVudFRoaXNTY29wZUZsYWdzKCk7XG4gICAgcmV0dXJuIChmbGFncyAmIFNDT1BFX0NMQVNTKSA+IDAgJiYgKGZsYWdzICYgU0NPUEVfRlVOQ1RJT04pID09PSAwO1xuICB9XG4gIGdldCBpblN0YXRpY0Jsb2NrKCkge1xuICAgIHJldHVybiAodGhpcy5jdXJyZW50VGhpc1Njb3BlRmxhZ3MoKSAmIFNDT1BFX1NUQVRJQ19CTE9DSykgPiAwO1xuICB9XG4gIGdldCBpbk5vbkFycm93RnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLmN1cnJlbnRUaGlzU2NvcGVGbGFncygpICYgU0NPUEVfRlVOQ1RJT04pID4gMDtcbiAgfVxuICBnZXQgdHJlYXRGdW5jdGlvbnNBc1ZhcigpIHtcbiAgICByZXR1cm4gdGhpcy50cmVhdEZ1bmN0aW9uc0FzVmFySW5TY29wZSh0aGlzLmN1cnJlbnRTY29wZSgpKTtcbiAgfVxuXG4gIGNyZWF0ZVNjb3BlKGZsYWdzOiBTY29wZUZsYWdzKTogU2NvcGUge1xuICAgIHJldHVybiBuZXcgU2NvcGUoZmxhZ3MpO1xuICB9XG4gIC8vIFRoaXMgbWV0aG9kIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgc3ViY2xhc3Nlc1xuICAvKjo6ICtjcmVhdGVTY29wZTogKGZsYWdzOiBTY29wZUZsYWdzKSA9PiBJU2NvcGU7ICovXG5cbiAgZW50ZXIoZmxhZ3M6IFNjb3BlRmxhZ3MpIHtcbiAgICB0aGlzLnNjb3BlU3RhY2sucHVzaCh0aGlzLmNyZWF0ZVNjb3BlKGZsYWdzKSk7XG4gIH1cblxuICBleGl0KCkge1xuICAgIHRoaXMuc2NvcGVTdGFjay5wb3AoKTtcbiAgfVxuXG4gIC8vIFRoZSBzcGVjIHNheXM6XG4gIC8vID4gQXQgdGhlIHRvcCBsZXZlbCBvZiBhIGZ1bmN0aW9uLCBvciBzY3JpcHQsIGZ1bmN0aW9uIGRlY2xhcmF0aW9ucyBhcmVcbiAgLy8gPiB0cmVhdGVkIGxpa2UgdmFyIGRlY2xhcmF0aW9ucyByYXRoZXIgdGhhbiBsaWtlIGxleGljYWwgZGVjbGFyYXRpb25zLlxuICB0cmVhdEZ1bmN0aW9uc0FzVmFySW5TY29wZShzY29wZTogSVNjb3BlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKFxuICAgICAgc2NvcGUuZmxhZ3MgJiBTQ09QRV9GVU5DVElPTiB8fFxuICAgICAgKCF0aGlzLmluTW9kdWxlICYmIHNjb3BlLmZsYWdzICYgU0NPUEVfUFJPR1JBTSlcbiAgICApO1xuICB9XG5cbiAgZGVjbGFyZU5hbWUobmFtZTogc3RyaW5nLCBiaW5kaW5nVHlwZTogQmluZGluZ1R5cGVzLCBwb3M6IG51bWJlcikge1xuICAgIGxldCBzY29wZSA9IHRoaXMuY3VycmVudFNjb3BlKCk7XG4gICAgaWYgKGJpbmRpbmdUeXBlICYgQklORF9TQ09QRV9MRVhJQ0FMIHx8IGJpbmRpbmdUeXBlICYgQklORF9TQ09QRV9GVU5DVElPTikge1xuICAgICAgdGhpcy5jaGVja1JlZGVjbGFyYXRpb25JblNjb3BlKHNjb3BlLCBuYW1lLCBiaW5kaW5nVHlwZSwgcG9zKTtcblxuICAgICAgaWYgKGJpbmRpbmdUeXBlICYgQklORF9TQ09QRV9GVU5DVElPTikge1xuICAgICAgICBzY29wZS5mdW5jdGlvbnMuYWRkKG5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NvcGUubGV4aWNhbC5hZGQobmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfU0NPUEVfTEVYSUNBTCkge1xuICAgICAgICB0aGlzLm1heWJlRXhwb3J0RGVmaW5lZChzY29wZSwgbmFtZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfU0NPUEVfVkFSKSB7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5zY29wZVN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHNjb3BlID0gdGhpcy5zY29wZVN0YWNrW2ldO1xuICAgICAgICB0aGlzLmNoZWNrUmVkZWNsYXJhdGlvbkluU2NvcGUoc2NvcGUsIG5hbWUsIGJpbmRpbmdUeXBlLCBwb3MpO1xuICAgICAgICBzY29wZS52YXIuYWRkKG5hbWUpO1xuICAgICAgICB0aGlzLm1heWJlRXhwb3J0RGVmaW5lZChzY29wZSwgbmFtZSk7XG5cbiAgICAgICAgaWYgKHNjb3BlLmZsYWdzICYgU0NPUEVfVkFSKSBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaW5Nb2R1bGUgJiYgc2NvcGUuZmxhZ3MgJiBTQ09QRV9QUk9HUkFNKSB7XG4gICAgICB0aGlzLnVuZGVmaW5lZEV4cG9ydHMuZGVsZXRlKG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIG1heWJlRXhwb3J0RGVmaW5lZChzY29wZTogSVNjb3BlLCBuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pbk1vZHVsZSAmJiBzY29wZS5mbGFncyAmIFNDT1BFX1BST0dSQU0pIHtcbiAgICAgIHRoaXMudW5kZWZpbmVkRXhwb3J0cy5kZWxldGUobmFtZSk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tSZWRlY2xhcmF0aW9uSW5TY29wZShcbiAgICBzY29wZTogSVNjb3BlLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBiaW5kaW5nVHlwZTogQmluZGluZ1R5cGVzLFxuICAgIHBvczogbnVtYmVyLFxuICApIHtcbiAgICBpZiAodGhpcy5pc1JlZGVjbGFyZWRJblNjb3BlKHNjb3BlLCBuYW1lLCBiaW5kaW5nVHlwZSkpIHtcbiAgICAgIHRoaXMucmFpc2UocG9zLCBFcnJvcnMuVmFyUmVkZWNsYXJhdGlvbiwgbmFtZSk7XG4gICAgfVxuICB9XG5cbiAgaXNSZWRlY2xhcmVkSW5TY29wZShcbiAgICBzY29wZTogSVNjb3BlLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBiaW5kaW5nVHlwZTogQmluZGluZ1R5cGVzLFxuICApOiBib29sZWFuIHtcbiAgICBpZiAoIShiaW5kaW5nVHlwZSAmIEJJTkRfS0lORF9WQUxVRSkpIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfU0NPUEVfTEVYSUNBTCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgc2NvcGUubGV4aWNhbC5oYXMobmFtZSkgfHxcbiAgICAgICAgc2NvcGUuZnVuY3Rpb25zLmhhcyhuYW1lKSB8fFxuICAgICAgICBzY29wZS52YXIuaGFzKG5hbWUpXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChiaW5kaW5nVHlwZSAmIEJJTkRfU0NPUEVfRlVOQ1RJT04pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHNjb3BlLmxleGljYWwuaGFzKG5hbWUpIHx8XG4gICAgICAgICghdGhpcy50cmVhdEZ1bmN0aW9uc0FzVmFySW5TY29wZShzY29wZSkgJiYgc2NvcGUudmFyLmhhcyhuYW1lKSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChzY29wZS5sZXhpY2FsLmhhcyhuYW1lKSAmJlxuICAgICAgICAhKFxuICAgICAgICAgIHNjb3BlLmZsYWdzICYgU0NPUEVfU0lNUExFX0NBVENIICYmXG4gICAgICAgICAgc2NvcGUubGV4aWNhbC52YWx1ZXMoKS5uZXh0KCkudmFsdWUgPT09IG5hbWVcbiAgICAgICAgKSkgfHxcbiAgICAgICghdGhpcy50cmVhdEZ1bmN0aW9uc0FzVmFySW5TY29wZShzY29wZSkgJiYgc2NvcGUuZnVuY3Rpb25zLmhhcyhuYW1lKSlcbiAgICApO1xuICB9XG5cbiAgY2hlY2tMb2NhbEV4cG9ydChpZDogTi5JZGVudGlmaWVyKSB7XG4gICAgY29uc3QgeyBuYW1lIH0gPSBpZDtcbiAgICBjb25zdCB0b3BMZXZlbFNjb3BlID0gdGhpcy5zY29wZVN0YWNrWzBdO1xuICAgIGlmIChcbiAgICAgICF0b3BMZXZlbFNjb3BlLmxleGljYWwuaGFzKG5hbWUpICYmXG4gICAgICAhdG9wTGV2ZWxTY29wZS52YXIuaGFzKG5hbWUpICYmXG4gICAgICAvLyBJbiBzdHJpY3QgbW9kZSwgc2NvcGUuZnVuY3Rpb25zIHdpbGwgYWx3YXlzIGJlIGVtcHR5LlxuICAgICAgLy8gTW9kdWxlcyBhcmUgc3RyaWN0IGJ5IGRlZmF1bHQsIGJ1dCB0aGUgYHNjcmlwdE1vZGVgIG9wdGlvblxuICAgICAgLy8gY2FuIG92ZXJ3cml0ZSB0aGlzIGJlaGF2aW9yLlxuICAgICAgIXRvcExldmVsU2NvcGUuZnVuY3Rpb25zLmhhcyhuYW1lKVxuICAgICkge1xuICAgICAgdGhpcy51bmRlZmluZWRFeHBvcnRzLnNldChuYW1lLCBpZC5zdGFydCk7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudFNjb3BlKCk6IElTY29wZSB7XG4gICAgcmV0dXJuIHRoaXMuc2NvcGVTdGFja1t0aGlzLnNjb3BlU3RhY2subGVuZ3RoIC0gMV07XG4gIH1cblxuICAvLyAkRmxvd0lnbm9yZVxuICBjdXJyZW50VmFyU2NvcGVGbGFncygpOiBTY29wZUZsYWdzIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5zY29wZVN0YWNrLmxlbmd0aCAtIDE7IDsgaS0tKSB7XG4gICAgICBjb25zdCB7IGZsYWdzIH0gPSB0aGlzLnNjb3BlU3RhY2tbaV07XG4gICAgICBpZiAoZmxhZ3MgJiBTQ09QRV9WQVIpIHtcbiAgICAgICAgcmV0dXJuIGZsYWdzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvdWxkIGJlIHVzZWZ1bCBmb3IgYGFyZ3VtZW50c2AsIGB0aGlzYCwgYG5ldy50YXJnZXRgLCBgc3VwZXIoKWAsIGBzdXBlci5wcm9wZXJ0eWAsIGFuZCBgc3VwZXJbcHJvcGVydHldYC5cbiAgLy8gJEZsb3dJZ25vcmVcbiAgY3VycmVudFRoaXNTY29wZUZsYWdzKCk6IFNjb3BlRmxhZ3Mge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLnNjb3BlU3RhY2subGVuZ3RoIC0gMTsgOyBpLS0pIHtcbiAgICAgIGNvbnN0IHsgZmxhZ3MgfSA9IHRoaXMuc2NvcGVTdGFja1tpXTtcbiAgICAgIGlmIChmbGFncyAmIChTQ09QRV9WQVIgfCBTQ09QRV9DTEFTUykgJiYgIShmbGFncyAmIFNDT1BFX0FSUk9XKSkge1xuICAgICAgICByZXR1cm4gZmxhZ3M7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=