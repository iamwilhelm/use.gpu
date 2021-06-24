"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseParser = /*#__PURE__*/function () {
  function BaseParser() {
    _classCallCheck(this, BaseParser);

    _defineProperty(this, "sawUnambiguousESM", false);

    _defineProperty(this, "ambiguousScriptDifferentAst", false);
  }

  _createClass(BaseParser, [{
    key: "hasPlugin",
    value: function hasPlugin(name) {
      return this.plugins.has(name);
    }
  }, {
    key: "getPluginOption",
    value: function getPluginOption(plugin, name) {
      // $FlowIssue
      if (this.hasPlugin(plugin)) return this.plugins.get(plugin)[name];
    }
  }]);

  return BaseParser;
}();

exports["default"] = BaseParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvYmFzZS5qcyJdLCJuYW1lcyI6WyJCYXNlUGFyc2VyIiwibmFtZSIsInBsdWdpbnMiLCJoYXMiLCJwbHVnaW4iLCJoYXNQbHVnaW4iLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQVVxQkEsVTs7OzsrQ0FhVSxLOzt5REFDVSxLOzs7OztXQVN2QyxtQkFBVUMsSUFBVixFQUFpQztBQUMvQixhQUFPLEtBQUtDLE9BQUwsQ0FBYUMsR0FBYixDQUFpQkYsSUFBakIsQ0FBUDtBQUNEOzs7V0FFRCx5QkFBZ0JHLE1BQWhCLEVBQWdDSCxJQUFoQyxFQUE4QztBQUM1QztBQUNBLFVBQUksS0FBS0ksU0FBTCxDQUFlRCxNQUFmLENBQUosRUFBNEIsT0FBTyxLQUFLRixPQUFMLENBQWFJLEdBQWIsQ0FBaUJGLE1BQWpCLEVBQXlCSCxJQUF6QixDQUFQO0FBQzdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBPcHRpb25zIH0gZnJvbSBcIi4uL29wdGlvbnNcIjtcbmltcG9ydCB0eXBlIFN0YXRlIGZyb20gXCIuLi90b2tlbml6ZXIvc3RhdGVcIjtcbmltcG9ydCB0eXBlIHsgUGx1Z2luc01hcCB9IGZyb20gXCIuL2luZGV4XCI7XG5pbXBvcnQgdHlwZSBTY29wZUhhbmRsZXIgZnJvbSBcIi4uL3V0aWwvc2NvcGVcIjtcbmltcG9ydCB0eXBlIEV4cHJlc3Npb25TY29wZUhhbmRsZXIgZnJvbSBcIi4uL3V0aWwvZXhwcmVzc2lvbi1zY29wZVwiO1xuaW1wb3J0IHR5cGUgQ2xhc3NTY29wZUhhbmRsZXIgZnJvbSBcIi4uL3V0aWwvY2xhc3Mtc2NvcGVcIjtcbmltcG9ydCB0eXBlIFByb2R1Y3Rpb25QYXJhbWV0ZXJIYW5kbGVyIGZyb20gXCIuLi91dGlsL3Byb2R1Y3Rpb24tcGFyYW1ldGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VQYXJzZXIge1xuICAvLyBQcm9wZXJ0aWVzIHNldCBieSBjb25zdHJ1Y3RvciBpbiBpbmRleC5qc1xuICBkZWNsYXJlIG9wdGlvbnM6IE9wdGlvbnM7XG4gIGRlY2xhcmUgaW5Nb2R1bGU6IGJvb2xlYW47XG4gIGRlY2xhcmUgc2NvcGU6IFNjb3BlSGFuZGxlcjwqPjtcbiAgZGVjbGFyZSBjbGFzc1Njb3BlOiBDbGFzc1Njb3BlSGFuZGxlcjtcbiAgZGVjbGFyZSBwcm9kUGFyYW06IFByb2R1Y3Rpb25QYXJhbWV0ZXJIYW5kbGVyO1xuICBkZWNsYXJlIGV4cHJlc3Npb25TY29wZTogRXhwcmVzc2lvblNjb3BlSGFuZGxlcjtcbiAgZGVjbGFyZSBwbHVnaW5zOiBQbHVnaW5zTWFwO1xuICBkZWNsYXJlIGZpbGVuYW1lOiA/c3RyaW5nO1xuICAvLyBOYW1lcyBvZiBleHBvcnRzIHN0b3JlLiBgZGVmYXVsdGAgaXMgc3RvcmVkIGFzIGEgbmFtZSBmb3IgYm90aFxuICAvLyBgZXhwb3J0IGRlZmF1bHQgZm9vO2AgYW5kIGBleHBvcnQgeyBmb28gYXMgZGVmYXVsdCB9O2AuXG4gIGRlY2xhcmUgZXhwb3J0ZWRJZGVudGlmaWVyczogU2V0PHN0cmluZz47XG4gIHNhd1VuYW1iaWd1b3VzRVNNOiBib29sZWFuID0gZmFsc2U7XG4gIGFtYmlndW91c1NjcmlwdERpZmZlcmVudEFzdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIEluaXRpYWxpemVkIGJ5IFRva2VuaXplclxuICBkZWNsYXJlIHN0YXRlOiBTdGF0ZTtcbiAgLy8gaW5wdXQgYW5kIGxlbmd0aCBhcmUgbm90IGluIHN0YXRlIGFzIHRoZXkgYXJlIGNvbnN0YW50IGFuZCB3ZSBkb1xuICAvLyBub3Qgd2FudCB0byBldmVyIGNvcHkgdGhlbSwgd2hpY2ggaGFwcGVucyBpZiBzdGF0ZSBnZXRzIGNsb25lZFxuICBkZWNsYXJlIGlucHV0OiBzdHJpbmc7XG4gIGRlY2xhcmUgbGVuZ3RoOiBudW1iZXI7XG5cbiAgaGFzUGx1Z2luKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbnMuaGFzKG5hbWUpO1xuICB9XG5cbiAgZ2V0UGx1Z2luT3B0aW9uKHBsdWdpbjogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcbiAgICAvLyAkRmxvd0lzc3VlXG4gICAgaWYgKHRoaXMuaGFzUGx1Z2luKHBsdWdpbikpIHJldHVybiB0aGlzLnBsdWdpbnMuZ2V0KHBsdWdpbilbbmFtZV07XG4gIH1cbn1cbiJdfQ==