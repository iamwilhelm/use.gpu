"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLASS_ELEMENT_OTHER = exports.CLASS_ELEMENT_INSTANCE_SETTER = exports.CLASS_ELEMENT_INSTANCE_GETTER = exports.CLASS_ELEMENT_STATIC_SETTER = exports.CLASS_ELEMENT_STATIC_GETTER = exports.CLASS_ELEMENT_KIND_ACCESSOR = exports.CLASS_ELEMENT_KIND_SETTER = exports.CLASS_ELEMENT_KIND_GETTER = exports.CLASS_ELEMENT_FLAG_STATIC = exports.BIND_FLOW_DECLARE_FN = exports.BIND_TS_NAMESPACE = exports.BIND_TS_CONST_ENUM = exports.BIND_OUTSIDE = exports.BIND_NONE = exports.BIND_TS_AMBIENT = exports.BIND_TS_ENUM = exports.BIND_TS_TYPE = exports.BIND_TS_INTERFACE = exports.BIND_FUNCTION = exports.BIND_VAR = exports.BIND_LEXICAL = exports.BIND_CLASS = exports.BIND_FLAGS_FLOW_DECLARE_FN = exports.BIND_FLAGS_TS_EXPORT_ONLY = exports.BIND_FLAGS_TS_CONST_ENUM = exports.BIND_FLAGS_TS_ENUM = exports.BIND_FLAGS_CLASS = exports.BIND_FLAGS_NONE = exports.BIND_SCOPE_OUTSIDE = exports.BIND_SCOPE_FUNCTION = exports.BIND_SCOPE_LEXICAL = exports.BIND_SCOPE_VAR = exports.BIND_KIND_TYPE = exports.BIND_KIND_VALUE = exports.SCOPE_VAR = exports.SCOPE_TS_MODULE = exports.SCOPE_STATIC_BLOCK = exports.SCOPE_CLASS = exports.SCOPE_DIRECT_SUPER = exports.SCOPE_SUPER = exports.SCOPE_SIMPLE_CATCH = exports.SCOPE_ARROW = exports.SCOPE_FUNCTION = exports.SCOPE_PROGRAM = exports.SCOPE_OTHER = void 0;
// Each scope gets a bitset that may contain these flags
// prettier-ignore
var SCOPE_OTHER = 0,
    SCOPE_PROGRAM = 1,
    SCOPE_FUNCTION = 2,
    SCOPE_ARROW = 4,
    SCOPE_SIMPLE_CATCH = 8,
    SCOPE_SUPER = 16,
    SCOPE_DIRECT_SUPER = 32,
    SCOPE_CLASS = 64,
    SCOPE_STATIC_BLOCK = 128,
    SCOPE_TS_MODULE = 256,
    SCOPE_VAR = SCOPE_PROGRAM | SCOPE_FUNCTION | SCOPE_TS_MODULE;
exports.SCOPE_VAR = SCOPE_VAR;
exports.SCOPE_TS_MODULE = SCOPE_TS_MODULE;
exports.SCOPE_STATIC_BLOCK = SCOPE_STATIC_BLOCK;
exports.SCOPE_CLASS = SCOPE_CLASS;
exports.SCOPE_DIRECT_SUPER = SCOPE_DIRECT_SUPER;
exports.SCOPE_SUPER = SCOPE_SUPER;
exports.SCOPE_SIMPLE_CATCH = SCOPE_SIMPLE_CATCH;
exports.SCOPE_ARROW = SCOPE_ARROW;
exports.SCOPE_FUNCTION = SCOPE_FUNCTION;
exports.SCOPE_PROGRAM = SCOPE_PROGRAM;
exports.SCOPE_OTHER = SCOPE_OTHER;
// These flags are meant to be _only_ used inside the Scope class (or subclasses).
// prettier-ignore
var BIND_KIND_VALUE = 1,
    BIND_KIND_TYPE = 2,
    // Used in checkLVal and declareName to determine the type of a binding
BIND_SCOPE_VAR = 4,
    // Var-style binding
BIND_SCOPE_LEXICAL = 8,
    // Let- or const-style binding
BIND_SCOPE_FUNCTION = 16,
    // Function declaration
BIND_SCOPE_OUTSIDE = 32,
    // Special case for function names as
// bound inside the function
// Misc flags
BIND_FLAGS_NONE = 64,
    BIND_FLAGS_CLASS = 128,
    BIND_FLAGS_TS_ENUM = 256,
    BIND_FLAGS_TS_CONST_ENUM = 512,
    BIND_FLAGS_TS_EXPORT_ONLY = 1024,
    BIND_FLAGS_FLOW_DECLARE_FN = 2048; // These flags are meant to be _only_ used by Scope consumers
// prettier-ignore

/*                              =    is value?    |    is type?    |      scope          |    misc flags    */

exports.BIND_FLAGS_FLOW_DECLARE_FN = BIND_FLAGS_FLOW_DECLARE_FN;
exports.BIND_FLAGS_TS_EXPORT_ONLY = BIND_FLAGS_TS_EXPORT_ONLY;
exports.BIND_FLAGS_TS_CONST_ENUM = BIND_FLAGS_TS_CONST_ENUM;
exports.BIND_FLAGS_TS_ENUM = BIND_FLAGS_TS_ENUM;
exports.BIND_FLAGS_CLASS = BIND_FLAGS_CLASS;
exports.BIND_FLAGS_NONE = BIND_FLAGS_NONE;
exports.BIND_SCOPE_OUTSIDE = BIND_SCOPE_OUTSIDE;
exports.BIND_SCOPE_FUNCTION = BIND_SCOPE_FUNCTION;
exports.BIND_SCOPE_LEXICAL = BIND_SCOPE_LEXICAL;
exports.BIND_SCOPE_VAR = BIND_SCOPE_VAR;
exports.BIND_KIND_TYPE = BIND_KIND_TYPE;
exports.BIND_KIND_VALUE = BIND_KIND_VALUE;
var BIND_CLASS = BIND_KIND_VALUE | BIND_KIND_TYPE | BIND_SCOPE_LEXICAL | BIND_FLAGS_CLASS,
    BIND_LEXICAL = BIND_KIND_VALUE | 0 | BIND_SCOPE_LEXICAL | 0,
    BIND_VAR = BIND_KIND_VALUE | 0 | BIND_SCOPE_VAR | 0,
    BIND_FUNCTION = BIND_KIND_VALUE | 0 | BIND_SCOPE_FUNCTION | 0,
    BIND_TS_INTERFACE = 0 | BIND_KIND_TYPE | 0 | BIND_FLAGS_CLASS,
    BIND_TS_TYPE = 0 | BIND_KIND_TYPE | 0 | 0,
    BIND_TS_ENUM = BIND_KIND_VALUE | BIND_KIND_TYPE | BIND_SCOPE_LEXICAL | BIND_FLAGS_TS_ENUM,
    BIND_TS_AMBIENT = 0 | 0 | 0 | BIND_FLAGS_TS_EXPORT_ONLY,
    // These bindings don't introduce anything in the scope. They are used for assignments and
// function expressions IDs.
BIND_NONE = 0 | 0 | 0 | BIND_FLAGS_NONE,
    BIND_OUTSIDE = BIND_KIND_VALUE | 0 | 0 | BIND_FLAGS_NONE,
    BIND_TS_CONST_ENUM = BIND_TS_ENUM | BIND_FLAGS_TS_CONST_ENUM,
    BIND_TS_NAMESPACE = 0 | 0 | 0 | BIND_FLAGS_TS_EXPORT_ONLY,
    BIND_FLOW_DECLARE_FN = BIND_FLAGS_FLOW_DECLARE_FN;
exports.BIND_FLOW_DECLARE_FN = BIND_FLOW_DECLARE_FN;
exports.BIND_TS_NAMESPACE = BIND_TS_NAMESPACE;
exports.BIND_TS_CONST_ENUM = BIND_TS_CONST_ENUM;
exports.BIND_OUTSIDE = BIND_OUTSIDE;
exports.BIND_NONE = BIND_NONE;
exports.BIND_TS_AMBIENT = BIND_TS_AMBIENT;
exports.BIND_TS_ENUM = BIND_TS_ENUM;
exports.BIND_TS_TYPE = BIND_TS_TYPE;
exports.BIND_TS_INTERFACE = BIND_TS_INTERFACE;
exports.BIND_FUNCTION = BIND_FUNCTION;
exports.BIND_VAR = BIND_VAR;
exports.BIND_LEXICAL = BIND_LEXICAL;
exports.BIND_CLASS = BIND_CLASS;
// prettier-ignore
var CLASS_ELEMENT_FLAG_STATIC = 4,
    CLASS_ELEMENT_KIND_GETTER = 2,
    CLASS_ELEMENT_KIND_SETTER = 1,
    CLASS_ELEMENT_KIND_ACCESSOR = CLASS_ELEMENT_KIND_GETTER | CLASS_ELEMENT_KIND_SETTER; // prettier-ignore

exports.CLASS_ELEMENT_KIND_ACCESSOR = CLASS_ELEMENT_KIND_ACCESSOR;
exports.CLASS_ELEMENT_KIND_SETTER = CLASS_ELEMENT_KIND_SETTER;
exports.CLASS_ELEMENT_KIND_GETTER = CLASS_ELEMENT_KIND_GETTER;
exports.CLASS_ELEMENT_FLAG_STATIC = CLASS_ELEMENT_FLAG_STATIC;
var CLASS_ELEMENT_STATIC_GETTER = CLASS_ELEMENT_KIND_GETTER | CLASS_ELEMENT_FLAG_STATIC,
    CLASS_ELEMENT_STATIC_SETTER = CLASS_ELEMENT_KIND_SETTER | CLASS_ELEMENT_FLAG_STATIC,
    CLASS_ELEMENT_INSTANCE_GETTER = CLASS_ELEMENT_KIND_GETTER,
    CLASS_ELEMENT_INSTANCE_SETTER = CLASS_ELEMENT_KIND_SETTER,
    CLASS_ELEMENT_OTHER = 0;
exports.CLASS_ELEMENT_OTHER = CLASS_ELEMENT_OTHER;
exports.CLASS_ELEMENT_INSTANCE_SETTER = CLASS_ELEMENT_INSTANCE_SETTER;
exports.CLASS_ELEMENT_INSTANCE_GETTER = CLASS_ELEMENT_INSTANCE_GETTER;
exports.CLASS_ELEMENT_STATIC_SETTER = CLASS_ELEMENT_STATIC_SETTER;
exports.CLASS_ELEMENT_STATIC_GETTER = CLASS_ELEMENT_STATIC_GETTER;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3Njb3BlZmxhZ3MuanMiXSwibmFtZXMiOlsiU0NPUEVfT1RIRVIiLCJTQ09QRV9QUk9HUkFNIiwiU0NPUEVfRlVOQ1RJT04iLCJTQ09QRV9BUlJPVyIsIlNDT1BFX1NJTVBMRV9DQVRDSCIsIlNDT1BFX1NVUEVSIiwiU0NPUEVfRElSRUNUX1NVUEVSIiwiU0NPUEVfQ0xBU1MiLCJTQ09QRV9TVEFUSUNfQkxPQ0siLCJTQ09QRV9UU19NT0RVTEUiLCJTQ09QRV9WQVIiLCJCSU5EX0tJTkRfVkFMVUUiLCJCSU5EX0tJTkRfVFlQRSIsIkJJTkRfU0NPUEVfVkFSIiwiQklORF9TQ09QRV9MRVhJQ0FMIiwiQklORF9TQ09QRV9GVU5DVElPTiIsIkJJTkRfU0NPUEVfT1VUU0lERSIsIkJJTkRfRkxBR1NfTk9ORSIsIkJJTkRfRkxBR1NfQ0xBU1MiLCJCSU5EX0ZMQUdTX1RTX0VOVU0iLCJCSU5EX0ZMQUdTX1RTX0NPTlNUX0VOVU0iLCJCSU5EX0ZMQUdTX1RTX0VYUE9SVF9PTkxZIiwiQklORF9GTEFHU19GTE9XX0RFQ0xBUkVfRk4iLCJCSU5EX0NMQVNTIiwiQklORF9MRVhJQ0FMIiwiQklORF9WQVIiLCJCSU5EX0ZVTkNUSU9OIiwiQklORF9UU19JTlRFUkZBQ0UiLCJCSU5EX1RTX1RZUEUiLCJCSU5EX1RTX0VOVU0iLCJCSU5EX1RTX0FNQklFTlQiLCJCSU5EX05PTkUiLCJCSU5EX09VVFNJREUiLCJCSU5EX1RTX0NPTlNUX0VOVU0iLCJCSU5EX1RTX05BTUVTUEFDRSIsIkJJTkRfRkxPV19ERUNMQVJFX0ZOIiwiQ0xBU1NfRUxFTUVOVF9GTEFHX1NUQVRJQyIsIkNMQVNTX0VMRU1FTlRfS0lORF9HRVRURVIiLCJDTEFTU19FTEVNRU5UX0tJTkRfU0VUVEVSIiwiQ0xBU1NfRUxFTUVOVF9LSU5EX0FDQ0VTU09SIiwiQ0xBU1NfRUxFTUVOVF9TVEFUSUNfR0VUVEVSIiwiQ0xBU1NfRUxFTUVOVF9TVEFUSUNfU0VUVEVSIiwiQ0xBU1NfRUxFTUVOVF9JTlNUQU5DRV9HRVRURVIiLCJDTEFTU19FTEVNRU5UX0lOU1RBTkNFX1NFVFRFUiIsIkNMQVNTX0VMRU1FTlRfT1RIRVIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBO0FBQ0E7QUFDTyxJQUFNQSxXQUFXLEdBQVUsQ0FBM0I7QUFBQSxJQUNNQyxhQUFhLEdBQVEsQ0FEM0I7QUFBQSxJQUVNQyxjQUFjLEdBQU8sQ0FGM0I7QUFBQSxJQUdNQyxXQUFXLEdBQVUsQ0FIM0I7QUFBQSxJQUlNQyxrQkFBa0IsR0FBRyxDQUozQjtBQUFBLElBS01DLFdBQVcsR0FBVSxFQUwzQjtBQUFBLElBTU1DLGtCQUFrQixHQUFHLEVBTjNCO0FBQUEsSUFPTUMsV0FBVyxHQUFVLEVBUDNCO0FBQUEsSUFRTUMsa0JBQWtCLEdBQUcsR0FSM0I7QUFBQSxJQVNNQyxlQUFlLEdBQU0sR0FUM0I7QUFBQSxJQVVNQyxTQUFTLEdBQUdULGFBQWEsR0FBR0MsY0FBaEIsR0FBaUNPLGVBVm5EOzs7Ozs7Ozs7Ozs7QUF3QlA7QUFDQTtBQUNPLElBQU1FLGVBQWUsR0FBYyxDQUFuQztBQUFBLElBQ01DLGNBQWMsR0FBZSxDQURuQztBQUFBLElBRU07QUFDQUMsY0FBYyxHQUFlLENBSG5DO0FBQUEsSUFHcUQ7QUFDL0NDLGtCQUFrQixHQUFXLENBSm5DO0FBQUEsSUFJcUQ7QUFDL0NDLG1CQUFtQixHQUFVLEVBTG5DO0FBQUEsSUFLcUQ7QUFDL0NDLGtCQUFrQixHQUFXLEVBTm5DO0FBQUEsSUFNcUQ7QUFDVDtBQUN0QztBQUNBQyxlQUFlLEdBQWMsRUFUbkM7QUFBQSxJQVVNQyxnQkFBZ0IsR0FBYSxHQVZuQztBQUFBLElBV01DLGtCQUFrQixHQUFXLEdBWG5DO0FBQUEsSUFZTUMsd0JBQXdCLEdBQUssR0FabkM7QUFBQSxJQWFNQyx5QkFBeUIsR0FBSSxJQWJuQztBQUFBLElBY01DLDBCQUEwQixHQUFHLElBZG5DLEMsQ0FnQlA7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFDTyxJQUFNQyxVQUFVLEdBQVdaLGVBQWUsR0FBR0MsY0FBbEIsR0FBbUNFLGtCQUFuQyxHQUF5REksZ0JBQXBGO0FBQUEsSUFDTU0sWUFBWSxHQUFTYixlQUFlLEdBQUcsQ0FBbEIsR0FBbUNHLGtCQUFuQyxHQUF5RCxDQURwRjtBQUFBLElBRU1XLFFBQVEsR0FBYWQsZUFBZSxHQUFHLENBQWxCLEdBQW1DRSxjQUFuQyxHQUF5RCxDQUZwRjtBQUFBLElBR01hLGFBQWEsR0FBUWYsZUFBZSxHQUFHLENBQWxCLEdBQW1DSSxtQkFBbkMsR0FBeUQsQ0FIcEY7QUFBQSxJQUlNWSxpQkFBaUIsR0FBSSxJQUFrQmYsY0FBbEIsR0FBbUMsQ0FBbkMsR0FBeURNLGdCQUpwRjtBQUFBLElBS01VLFlBQVksR0FBUyxJQUFrQmhCLGNBQWxCLEdBQW1DLENBQW5DLEdBQXlELENBTHBGO0FBQUEsSUFNTWlCLFlBQVksR0FBU2xCLGVBQWUsR0FBR0MsY0FBbEIsR0FBbUNFLGtCQUFuQyxHQUF5REssa0JBTnBGO0FBQUEsSUFPTVcsZUFBZSxHQUFNLElBQWtCLENBQWxCLEdBQW1DLENBQW5DLEdBQWtEVCx5QkFQN0U7QUFBQSxJQVFNO0FBQ0E7QUFDQVUsU0FBUyxHQUFZLElBQWtCLENBQWxCLEdBQW1DLENBQW5DLEdBQXlEZCxlQVZwRjtBQUFBLElBV01lLFlBQVksR0FBU3JCLGVBQWUsR0FBRyxDQUFsQixHQUFtQyxDQUFuQyxHQUF5RE0sZUFYcEY7QUFBQSxJQWFNZ0Isa0JBQWtCLEdBQUdKLFlBQVksR0FBR1Qsd0JBYjFDO0FBQUEsSUFjTWMsaUJBQWlCLEdBQUksSUFBa0IsQ0FBbEIsR0FBbUMsQ0FBbkMsR0FBa0RiLHlCQWQ3RTtBQUFBLElBZ0JNYyxvQkFBb0IsR0FBR2IsMEJBaEI3Qjs7Ozs7Ozs7Ozs7Ozs7QUErQlA7QUFDTyxJQUFNYyx5QkFBeUIsR0FBRyxDQUFsQztBQUFBLElBQ01DLHlCQUF5QixHQUFHLENBRGxDO0FBQUEsSUFFTUMseUJBQXlCLEdBQUcsQ0FGbEM7QUFBQSxJQUdNQywyQkFBMkIsR0FBR0YseUJBQXlCLEdBQUdDLHlCQUhoRSxDLENBS1A7Ozs7OztBQUNPLElBQU1FLDJCQUEyQixHQUFLSCx5QkFBeUIsR0FBR0QseUJBQWxFO0FBQUEsSUFDTUssMkJBQTJCLEdBQUtILHlCQUF5QixHQUFHRix5QkFEbEU7QUFBQSxJQUVNTSw2QkFBNkIsR0FBR0wseUJBRnRDO0FBQUEsSUFHTU0sNkJBQTZCLEdBQUdMLHlCQUh0QztBQUFBLElBSU1NLG1CQUFtQixHQUFhLENBSnRDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuLy8gRWFjaCBzY29wZSBnZXRzIGEgYml0c2V0IHRoYXQgbWF5IGNvbnRhaW4gdGhlc2UgZmxhZ3Ncbi8vIHByZXR0aWVyLWlnbm9yZVxuZXhwb3J0IGNvbnN0IFNDT1BFX09USEVSICAgICAgICA9IDBiMDAwMDAwMDAwLFxuICAgICAgICAgICAgIFNDT1BFX1BST0dSQU0gICAgICA9IDBiMDAwMDAwMDAxLFxuICAgICAgICAgICAgIFNDT1BFX0ZVTkNUSU9OICAgICA9IDBiMDAwMDAwMDEwLFxuICAgICAgICAgICAgIFNDT1BFX0FSUk9XICAgICAgICA9IDBiMDAwMDAwMTAwLFxuICAgICAgICAgICAgIFNDT1BFX1NJTVBMRV9DQVRDSCA9IDBiMDAwMDAxMDAwLFxuICAgICAgICAgICAgIFNDT1BFX1NVUEVSICAgICAgICA9IDBiMDAwMDEwMDAwLFxuICAgICAgICAgICAgIFNDT1BFX0RJUkVDVF9TVVBFUiA9IDBiMDAwMTAwMDAwLFxuICAgICAgICAgICAgIFNDT1BFX0NMQVNTICAgICAgICA9IDBiMDAxMDAwMDAwLFxuICAgICAgICAgICAgIFNDT1BFX1NUQVRJQ19CTE9DSyA9IDBiMDEwMDAwMDAwLFxuICAgICAgICAgICAgIFNDT1BFX1RTX01PRFVMRSAgICA9IDBiMTAwMDAwMDAwLFxuICAgICAgICAgICAgIFNDT1BFX1ZBUiA9IFNDT1BFX1BST0dSQU0gfCBTQ09QRV9GVU5DVElPTiB8IFNDT1BFX1RTX01PRFVMRTtcblxuZXhwb3J0IHR5cGUgU2NvcGVGbGFncyA9XG4gIHwgdHlwZW9mIFNDT1BFX09USEVSXG4gIHwgdHlwZW9mIFNDT1BFX1BST0dSQU1cbiAgfCB0eXBlb2YgU0NPUEVfRlVOQ1RJT05cbiAgfCB0eXBlb2YgU0NPUEVfVkFSXG4gIHwgdHlwZW9mIFNDT1BFX0FSUk9XXG4gIHwgdHlwZW9mIFNDT1BFX1NJTVBMRV9DQVRDSFxuICB8IHR5cGVvZiBTQ09QRV9TVVBFUlxuICB8IHR5cGVvZiBTQ09QRV9ESVJFQ1RfU1VQRVJcbiAgfCB0eXBlb2YgU0NPUEVfQ0xBU1NcbiAgfCB0eXBlb2YgU0NPUEVfU1RBVElDX0JMT0NLO1xuXG4vLyBUaGVzZSBmbGFncyBhcmUgbWVhbnQgdG8gYmUgX29ubHlfIHVzZWQgaW5zaWRlIHRoZSBTY29wZSBjbGFzcyAob3Igc3ViY2xhc3NlcykuXG4vLyBwcmV0dGllci1pZ25vcmVcbmV4cG9ydCBjb25zdCBCSU5EX0tJTkRfVkFMVUUgICAgICAgICAgICA9IDBiMDAwMDAwXzAwMDBfMDEsXG4gICAgICAgICAgICAgQklORF9LSU5EX1RZUEUgICAgICAgICAgICAgPSAwYjAwMDAwMF8wMDAwXzEwLFxuICAgICAgICAgICAgIC8vIFVzZWQgaW4gY2hlY2tMVmFsIGFuZCBkZWNsYXJlTmFtZSB0byBkZXRlcm1pbmUgdGhlIHR5cGUgb2YgYSBiaW5kaW5nXG4gICAgICAgICAgICAgQklORF9TQ09QRV9WQVIgICAgICAgICAgICAgPSAwYjAwMDAwMF8wMDAxXzAwLCAvLyBWYXItc3R5bGUgYmluZGluZ1xuICAgICAgICAgICAgIEJJTkRfU0NPUEVfTEVYSUNBTCAgICAgICAgID0gMGIwMDAwMDBfMDAxMF8wMCwgLy8gTGV0LSBvciBjb25zdC1zdHlsZSBiaW5kaW5nXG4gICAgICAgICAgICAgQklORF9TQ09QRV9GVU5DVElPTiAgICAgICAgPSAwYjAwMDAwMF8wMTAwXzAwLCAvLyBGdW5jdGlvbiBkZWNsYXJhdGlvblxuICAgICAgICAgICAgIEJJTkRfU0NPUEVfT1VUU0lERSAgICAgICAgID0gMGIwMDAwMDBfMTAwMF8wMCwgLy8gU3BlY2lhbCBjYXNlIGZvciBmdW5jdGlvbiBuYW1lcyBhc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYm91bmQgaW5zaWRlIHRoZSBmdW5jdGlvblxuICAgICAgICAgICAgIC8vIE1pc2MgZmxhZ3NcbiAgICAgICAgICAgICBCSU5EX0ZMQUdTX05PTkUgICAgICAgICAgICA9IDBiMDAwMDAxXzAwMDBfMDAsXG4gICAgICAgICAgICAgQklORF9GTEFHU19DTEFTUyAgICAgICAgICAgPSAwYjAwMDAxMF8wMDAwXzAwLFxuICAgICAgICAgICAgIEJJTkRfRkxBR1NfVFNfRU5VTSAgICAgICAgID0gMGIwMDAxMDBfMDAwMF8wMCxcbiAgICAgICAgICAgICBCSU5EX0ZMQUdTX1RTX0NPTlNUX0VOVU0gICA9IDBiMDAxMDAwXzAwMDBfMDAsXG4gICAgICAgICAgICAgQklORF9GTEFHU19UU19FWFBPUlRfT05MWSAgPSAwYjAxMDAwMF8wMDAwXzAwLFxuICAgICAgICAgICAgIEJJTkRfRkxBR1NfRkxPV19ERUNMQVJFX0ZOID0gMGIxMDAwMDBfMDAwMF8wMDtcblxuLy8gVGhlc2UgZmxhZ3MgYXJlIG1lYW50IHRvIGJlIF9vbmx5XyB1c2VkIGJ5IFNjb3BlIGNvbnN1bWVyc1xuLy8gcHJldHRpZXItaWdub3JlXG4vKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gICAgaXMgdmFsdWU/ICAgIHwgICAgaXMgdHlwZT8gICAgfCAgICAgIHNjb3BlICAgICAgICAgIHwgICAgbWlzYyBmbGFncyAgICAqL1xuZXhwb3J0IGNvbnN0IEJJTkRfQ0xBU1MgICAgICAgICA9IEJJTkRfS0lORF9WQUxVRSB8IEJJTkRfS0lORF9UWVBFIHwgQklORF9TQ09QRV9MRVhJQ0FMICB8IEJJTkRfRkxBR1NfQ0xBU1MgICxcbiAgICAgICAgICAgICBCSU5EX0xFWElDQUwgICAgICAgPSBCSU5EX0tJTkRfVkFMVUUgfCAwICAgICAgICAgICAgICB8IEJJTkRfU0NPUEVfTEVYSUNBTCAgfCAwICAgICAgICAgICAgICAgICAsXG4gICAgICAgICAgICAgQklORF9WQVIgICAgICAgICAgID0gQklORF9LSU5EX1ZBTFVFIHwgMCAgICAgICAgICAgICAgfCBCSU5EX1NDT1BFX1ZBUiAgICAgIHwgMCAgICAgICAgICAgICAgICAgLFxuICAgICAgICAgICAgIEJJTkRfRlVOQ1RJT04gICAgICA9IEJJTkRfS0lORF9WQUxVRSB8IDAgICAgICAgICAgICAgIHwgQklORF9TQ09QRV9GVU5DVElPTiB8IDAgICAgICAgICAgICAgICAgICxcbiAgICAgICAgICAgICBCSU5EX1RTX0lOVEVSRkFDRSAgPSAwICAgICAgICAgICAgICAgfCBCSU5EX0tJTkRfVFlQRSB8IDAgICAgICAgICAgICAgICAgICAgfCBCSU5EX0ZMQUdTX0NMQVNTICAsXG4gICAgICAgICAgICAgQklORF9UU19UWVBFICAgICAgID0gMCAgICAgICAgICAgICAgIHwgQklORF9LSU5EX1RZUEUgfCAwICAgICAgICAgICAgICAgICAgIHwgMCAgICAgICAgICAgICAgICAgLFxuICAgICAgICAgICAgIEJJTkRfVFNfRU5VTSAgICAgICA9IEJJTkRfS0lORF9WQUxVRSB8IEJJTkRfS0lORF9UWVBFIHwgQklORF9TQ09QRV9MRVhJQ0FMICB8IEJJTkRfRkxBR1NfVFNfRU5VTSxcbiAgICAgICAgICAgICBCSU5EX1RTX0FNQklFTlQgICAgPSAwICAgICAgICAgICAgICAgfCAwICAgICAgICAgICAgICB8IDAgICAgICAgICAgICB8IEJJTkRfRkxBR1NfVFNfRVhQT1JUX09OTFksXG4gICAgICAgICAgICAgLy8gVGhlc2UgYmluZGluZ3MgZG9uJ3QgaW50cm9kdWNlIGFueXRoaW5nIGluIHRoZSBzY29wZS4gVGhleSBhcmUgdXNlZCBmb3IgYXNzaWdubWVudHMgYW5kXG4gICAgICAgICAgICAgLy8gZnVuY3Rpb24gZXhwcmVzc2lvbnMgSURzLlxuICAgICAgICAgICAgIEJJTkRfTk9ORSAgICAgICAgICA9IDAgICAgICAgICAgICAgICB8IDAgICAgICAgICAgICAgIHwgMCAgICAgICAgICAgICAgICAgICB8IEJJTkRfRkxBR1NfTk9ORSAgICxcbiAgICAgICAgICAgICBCSU5EX09VVFNJREUgICAgICAgPSBCSU5EX0tJTkRfVkFMVUUgfCAwICAgICAgICAgICAgICB8IDAgICAgICAgICAgICAgICAgICAgfCBCSU5EX0ZMQUdTX05PTkUgICAsXG5cbiAgICAgICAgICAgICBCSU5EX1RTX0NPTlNUX0VOVU0gPSBCSU5EX1RTX0VOVU0gfCBCSU5EX0ZMQUdTX1RTX0NPTlNUX0VOVU0sXG4gICAgICAgICAgICAgQklORF9UU19OQU1FU1BBQ0UgID0gMCAgICAgICAgICAgICAgIHwgMCAgICAgICAgICAgICAgfCAwICAgICAgICAgICAgfCBCSU5EX0ZMQUdTX1RTX0VYUE9SVF9PTkxZLFxuXG4gICAgICAgICAgICAgQklORF9GTE9XX0RFQ0xBUkVfRk4gPSBCSU5EX0ZMQUdTX0ZMT1dfREVDTEFSRV9GTjtcblxuZXhwb3J0IHR5cGUgQmluZGluZ1R5cGVzID1cbiAgfCB0eXBlb2YgQklORF9OT05FXG4gIHwgdHlwZW9mIEJJTkRfT1VUU0lERVxuICB8IHR5cGVvZiBCSU5EX1ZBUlxuICB8IHR5cGVvZiBCSU5EX0xFWElDQUxcbiAgfCB0eXBlb2YgQklORF9DTEFTU1xuICB8IHR5cGVvZiBCSU5EX0ZVTkNUSU9OXG4gIHwgdHlwZW9mIEJJTkRfVFNfSU5URVJGQUNFXG4gIHwgdHlwZW9mIEJJTkRfVFNfVFlQRVxuICB8IHR5cGVvZiBCSU5EX1RTX0VOVU1cbiAgfCB0eXBlb2YgQklORF9UU19BTUJJRU5UXG4gIHwgdHlwZW9mIEJJTkRfVFNfTkFNRVNQQUNFO1xuXG4vLyBwcmV0dGllci1pZ25vcmVcbmV4cG9ydCBjb25zdCBDTEFTU19FTEVNRU5UX0ZMQUdfU1RBVElDID0gMGIxXzAwLFxuICAgICAgICAgICAgIENMQVNTX0VMRU1FTlRfS0lORF9HRVRURVIgPSAwYjBfMTAsXG4gICAgICAgICAgICAgQ0xBU1NfRUxFTUVOVF9LSU5EX1NFVFRFUiA9IDBiMF8wMSxcbiAgICAgICAgICAgICBDTEFTU19FTEVNRU5UX0tJTkRfQUNDRVNTT1IgPSBDTEFTU19FTEVNRU5UX0tJTkRfR0VUVEVSIHwgQ0xBU1NfRUxFTUVOVF9LSU5EX1NFVFRFUjtcblxuLy8gcHJldHRpZXItaWdub3JlXG5leHBvcnQgY29uc3QgQ0xBU1NfRUxFTUVOVF9TVEFUSUNfR0VUVEVSICAgPSBDTEFTU19FTEVNRU5UX0tJTkRfR0VUVEVSIHwgQ0xBU1NfRUxFTUVOVF9GTEFHX1NUQVRJQyxcbiAgICAgICAgICAgICBDTEFTU19FTEVNRU5UX1NUQVRJQ19TRVRURVIgICA9IENMQVNTX0VMRU1FTlRfS0lORF9TRVRURVIgfCBDTEFTU19FTEVNRU5UX0ZMQUdfU1RBVElDLFxuICAgICAgICAgICAgIENMQVNTX0VMRU1FTlRfSU5TVEFOQ0VfR0VUVEVSID0gQ0xBU1NfRUxFTUVOVF9LSU5EX0dFVFRFUixcbiAgICAgICAgICAgICBDTEFTU19FTEVNRU5UX0lOU1RBTkNFX1NFVFRFUiA9IENMQVNTX0VMRU1FTlRfS0lORF9TRVRURVIsXG4gICAgICAgICAgICAgQ0xBU1NfRUxFTUVOVF9PVEhFUiAgICAgICAgICAgPSAwO1xuXG5leHBvcnQgdHlwZSBDbGFzc0VsZW1lbnRUeXBlcyA9XG4gIHwgdHlwZW9mIENMQVNTX0VMRU1FTlRfU1RBVElDX0dFVFRFUlxuICB8IHR5cGVvZiBDTEFTU19FTEVNRU5UX1NUQVRJQ19TRVRURVJcbiAgfCB0eXBlb2YgQ0xBU1NfRUxFTUVOVF9JTlNUQU5DRV9HRVRURVJcbiAgfCB0eXBlb2YgQ0xBU1NfRUxFTUVOVF9JTlNUQU5DRV9TRVRURVJcbiAgfCB0eXBlb2YgQ0xBU1NfRUxFTUVOVF9PVEhFUjtcbiJdfQ==