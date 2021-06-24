"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeUtils = void 0;

var _util = _interopRequireDefault(require("./util"));

var _location = require("../util/location");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Start an AST node, attaching a start offset.
var Node = /*#__PURE__*/function () {
  function Node(parser, pos, loc) {
    _classCallCheck(this, Node);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "start", void 0);

    _defineProperty(this, "end", void 0);

    _defineProperty(this, "loc", void 0);

    _defineProperty(this, "range", void 0);

    _defineProperty(this, "leadingComments", void 0);

    _defineProperty(this, "trailingComments", void 0);

    _defineProperty(this, "innerComments", void 0);

    _defineProperty(this, "extra", void 0);

    this.type = "";
    this.start = pos;
    this.end = 0;
    this.loc = new _location.SourceLocation(loc);
    if (parser !== null && parser !== void 0 && parser.options.ranges) this.range = [pos, 0];
    if (parser !== null && parser !== void 0 && parser.filename) this.loc.filename = parser.filename;
  }

  _createClass(Node, [{
    key: "__clone",
    value: function __clone() {
      // $FlowIgnore
      var newNode = new Node();
      var keys = Object.keys(this);

      for (var i = 0, length = keys.length; i < length; i++) {
        var _key = keys[i]; // Do not clone comments that are already attached to the node

        if (_key !== "leadingComments" && _key !== "trailingComments" && _key !== "innerComments") {
          // $FlowIgnore
          newNode[_key] = this[_key];
        }
      }

      return newNode;
    }
  }]);

  return Node;
}();

var NodeUtils = /*#__PURE__*/function (_UtilParser) {
  _inherits(NodeUtils, _UtilParser);

  var _super = _createSuper(NodeUtils);

  function NodeUtils() {
    _classCallCheck(this, NodeUtils);

    return _super.apply(this, arguments);
  }

  _createClass(NodeUtils, [{
    key: "startNode",
    value: function startNode() {
      // $FlowIgnore
      return new Node(this, this.state.start, this.state.startLoc);
    }
  }, {
    key: "startNodeAt",
    value: function startNodeAt(pos, loc) {
      // $FlowIgnore
      return new Node(this, pos, loc);
    }
    /** Start a new node with a previous node's location. */

  }, {
    key: "startNodeAtNode",
    value: function startNodeAtNode(type) {
      return this.startNodeAt(type.start, type.loc.start);
    } // Finish an AST node, adding `type` and `end` properties.

  }, {
    key: "finishNode",
    value: function finishNode(node, type) {
      return this.finishNodeAt(node, type, this.state.lastTokEnd, this.state.lastTokEndLoc);
    } // Finish node at given position

  }, {
    key: "finishNodeAt",
    value: function finishNodeAt(node, type, pos, loc) {
      if (process.env.NODE_ENV !== "production" && node.end > 0) {
        throw new Error("Do not call finishNode*() twice on the same node." + " Instead use resetEndLocation() or change type directly.");
      }

      node.type = type;
      node.end = pos;
      node.loc.end = loc;
      if (this.options.ranges) node.range[1] = pos;
      this.processComment(node);
      return node;
    }
  }, {
    key: "resetStartLocation",
    value: function resetStartLocation(node, start, startLoc) {
      node.start = start;
      node.loc.start = startLoc;
      if (this.options.ranges) node.range[0] = start;
    }
  }, {
    key: "resetEndLocation",
    value: function resetEndLocation(node) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state.lastTokEnd;
      var endLoc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.state.lastTokEndLoc;
      node.end = end;
      node.loc.end = endLoc;
      if (this.options.ranges) node.range[1] = end;
    }
    /**
     * Reset the start location of node to the start location of locationNode
     */

  }, {
    key: "resetStartLocationFromNode",
    value: function resetStartLocationFromNode(node, locationNode) {
      this.resetStartLocation(node, locationNode.start, locationNode.loc.start);
    }
  }]);

  return NodeUtils;
}(_util["default"]);

exports.NodeUtils = NodeUtils;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvbm9kZS5qcyJdLCJuYW1lcyI6WyJOb2RlIiwicGFyc2VyIiwicG9zIiwibG9jIiwidHlwZSIsInN0YXJ0IiwiZW5kIiwiU291cmNlTG9jYXRpb24iLCJvcHRpb25zIiwicmFuZ2VzIiwicmFuZ2UiLCJmaWxlbmFtZSIsIm5ld05vZGUiLCJrZXlzIiwiT2JqZWN0IiwiaSIsImxlbmd0aCIsImtleSIsIk5vZGVVdGlscyIsInN0YXRlIiwic3RhcnRMb2MiLCJzdGFydE5vZGVBdCIsIm5vZGUiLCJmaW5pc2hOb2RlQXQiLCJsYXN0VG9rRW5kIiwibGFzdFRva0VuZExvYyIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIkVycm9yIiwicHJvY2Vzc0NvbW1lbnQiLCJlbmRMb2MiLCJsb2NhdGlvbk5vZGUiLCJyZXNldFN0YXJ0TG9jYXRpb24iLCJVdGlsUGFyc2VyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFHQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTtJQUVNQSxJO0FBQ0osZ0JBQVlDLE1BQVosRUFBNEJDLEdBQTVCLEVBQXlDQyxHQUF6QyxFQUF3RDtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUN0RCxTQUFLQyxJQUFMLEdBQVksRUFBWjtBQUNBLFNBQUtDLEtBQUwsR0FBYUgsR0FBYjtBQUNBLFNBQUtJLEdBQUwsR0FBVyxDQUFYO0FBQ0EsU0FBS0gsR0FBTCxHQUFXLElBQUlJLHdCQUFKLENBQW1CSixHQUFuQixDQUFYO0FBQ0EsUUFBSUYsTUFBSixhQUFJQSxNQUFKLGVBQUlBLE1BQU0sQ0FBRU8sT0FBUixDQUFnQkMsTUFBcEIsRUFBNEIsS0FBS0MsS0FBTCxHQUFhLENBQUNSLEdBQUQsRUFBTSxDQUFOLENBQWI7QUFDNUIsUUFBSUQsTUFBSixhQUFJQSxNQUFKLGVBQUlBLE1BQU0sQ0FBRVUsUUFBWixFQUFzQixLQUFLUixH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LENBQVdLLFVBRXBCO0FBQUEsVUFETk8sTUFDTSx1RUFEYyxLQUFLWixLQUFMLENBQVdNLGFBQ3pCO0FBQ05ILE1BQUFBLElBQUksQ0FBQ2hCLEdBQUwsR0FBV0EsR0FBWDtBQUNBZ0IsTUFBQUEsSUFBSSxDQUFDbkIsR0FBTCxDQUFTRyxHQUFULEdBQWV5QixNQUFmO0FBQ0EsVUFBSSxLQUFLdkIsT0FBTCxDQUFhQyxNQUFqQixFQUF5QmEsSUFBSSxDQUFDWixLQUFMLENBQVcsQ0FBWCxJQUFnQkosR0FBaEI7QUFDMUI7QUFFRDtBQUNGO0FBQ0E7Ozs7V0FDRSxvQ0FBMkJnQixJQUEzQixFQUEyQ1UsWUFBM0MsRUFBeUU7QUFDdkUsV0FBS0Msa0JBQUwsQ0FBd0JYLElBQXhCLEVBQThCVSxZQUFZLENBQUMzQixLQUEzQyxFQUFrRDJCLFlBQVksQ0FBQzdCLEdBQWIsQ0FBaUJFLEtBQW5FO0FBQ0Q7Ozs7RUF0RTRCNkIsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSBQYXJzZXIgZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCBVdGlsUGFyc2VyIGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IFNvdXJjZUxvY2F0aW9uLCB0eXBlIFBvc2l0aW9uIH0gZnJvbSBcIi4uL3V0aWwvbG9jYXRpb25cIjtcbmltcG9ydCB0eXBlIHsgQ29tbWVudCwgTm9kZSBhcyBOb2RlVHlwZSwgTm9kZUJhc2UgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuLy8gU3RhcnQgYW4gQVNUIG5vZGUsIGF0dGFjaGluZyBhIHN0YXJ0IG9mZnNldC5cblxuY2xhc3MgTm9kZSBpbXBsZW1lbnRzIE5vZGVCYXNlIHtcbiAgY29uc3RydWN0b3IocGFyc2VyOiBQYXJzZXIsIHBvczogbnVtYmVyLCBsb2M6IFBvc2l0aW9uKSB7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgICB0aGlzLnN0YXJ0ID0gcG9zO1xuICAgIHRoaXMuZW5kID0gMDtcbiAgICB0aGlzLmxvYyA9IG5ldyBTb3VyY2VMb2NhdGlvbihsb2MpO1xuICAgIGlmIChwYXJzZXI/Lm9wdGlvbnMucmFuZ2VzKSB0aGlzLnJhbmdlID0gW3BvcywgMF07XG4gICAgaWYgKHBhcnNlcj8uZmlsZW5hbWUpIHRoaXMubG9jLmZpbGVuYW1lID0gcGFyc2VyLmZpbGVuYW1lO1xuICB9XG5cbiAgdHlwZTogc3RyaW5nO1xuICBzdGFydDogbnVtYmVyO1xuICBlbmQ6IG51bWJlcjtcbiAgbG9jOiBTb3VyY2VMb2NhdGlvbjtcbiAgcmFuZ2U6IFtudW1iZXIsIG51bWJlcl07XG4gIGxlYWRpbmdDb21tZW50czogQXJyYXk8Q29tbWVudD47XG4gIHRyYWlsaW5nQ29tbWVudHM6IEFycmF5PENvbW1lbnQ+O1xuICBpbm5lckNvbW1lbnRzOiBBcnJheTxDb21tZW50PjtcbiAgZXh0cmE6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgX19jbG9uZSgpOiB0aGlzIHtcbiAgICAvLyAkRmxvd0lnbm9yZVxuICAgIGNvbnN0IG5ld05vZGU6IGFueSA9IG5ldyBOb2RlKCk7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlzW2ldO1xuICAgICAgLy8gRG8gbm90IGNsb25lIGNvbW1lbnRzIHRoYXQgYXJlIGFscmVhZHkgYXR0YWNoZWQgdG8gdGhlIG5vZGVcbiAgICAgIGlmIChcbiAgICAgICAga2V5ICE9PSBcImxlYWRpbmdDb21tZW50c1wiICYmXG4gICAgICAgIGtleSAhPT0gXCJ0cmFpbGluZ0NvbW1lbnRzXCIgJiZcbiAgICAgICAga2V5ICE9PSBcImlubmVyQ29tbWVudHNcIlxuICAgICAgKSB7XG4gICAgICAgIC8vICRGbG93SWdub3JlXG4gICAgICAgIG5ld05vZGVba2V5XSA9IHRoaXNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTm9kZVV0aWxzIGV4dGVuZHMgVXRpbFBhcnNlciB7XG4gIHN0YXJ0Tm9kZTxUOiBOb2RlVHlwZT4oKTogVCB7XG4gICAgLy8gJEZsb3dJZ25vcmVcbiAgICByZXR1cm4gbmV3IE5vZGUodGhpcywgdGhpcy5zdGF0ZS5zdGFydCwgdGhpcy5zdGF0ZS5zdGFydExvYyk7XG4gIH1cblxuICBzdGFydE5vZGVBdDxUOiBOb2RlVHlwZT4ocG9zOiBudW1iZXIsIGxvYzogUG9zaXRpb24pOiBUIHtcbiAgICAvLyAkRmxvd0lnbm9yZVxuICAgIHJldHVybiBuZXcgTm9kZSh0aGlzLCBwb3MsIGxvYyk7XG4gIH1cblxuICAvKiogU3RhcnQgYSBuZXcgbm9kZSB3aXRoIGEgcHJldmlvdXMgbm9kZSdzIGxvY2F0aW9uLiAqL1xuICBzdGFydE5vZGVBdE5vZGU8VDogTm9kZVR5cGU+KHR5cGU6IE5vZGVUeXBlKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnROb2RlQXQodHlwZS5zdGFydCwgdHlwZS5sb2Muc3RhcnQpO1xuICB9XG5cbiAgLy8gRmluaXNoIGFuIEFTVCBub2RlLCBhZGRpbmcgYHR5cGVgIGFuZCBgZW5kYCBwcm9wZXJ0aWVzLlxuXG4gIGZpbmlzaE5vZGU8VDogTm9kZVR5cGU+KG5vZGU6IFQsIHR5cGU6IHN0cmluZyk6IFQge1xuICAgIHJldHVybiB0aGlzLmZpbmlzaE5vZGVBdChcbiAgICAgIG5vZGUsXG4gICAgICB0eXBlLFxuICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rRW5kLFxuICAgICAgdGhpcy5zdGF0ZS5sYXN0VG9rRW5kTG9jLFxuICAgICk7XG4gIH1cblxuICAvLyBGaW5pc2ggbm9kZSBhdCBnaXZlbiBwb3NpdGlvblxuXG4gIGZpbmlzaE5vZGVBdDxUOiBOb2RlVHlwZT4oXG4gICAgbm9kZTogVCxcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgcG9zOiBudW1iZXIsXG4gICAgbG9jOiBQb3NpdGlvbixcbiAgKTogVCB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiAmJiBub2RlLmVuZCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJEbyBub3QgY2FsbCBmaW5pc2hOb2RlKigpIHR3aWNlIG9uIHRoZSBzYW1lIG5vZGUuXCIgK1xuICAgICAgICAgIFwiIEluc3RlYWQgdXNlIHJlc2V0RW5kTG9jYXRpb24oKSBvciBjaGFuZ2UgdHlwZSBkaXJlY3RseS5cIixcbiAgICAgICk7XG4gICAgfVxuICAgIG5vZGUudHlwZSA9IHR5cGU7XG4gICAgbm9kZS5lbmQgPSBwb3M7XG4gICAgbm9kZS5sb2MuZW5kID0gbG9jO1xuICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSBub2RlLnJhbmdlWzFdID0gcG9zO1xuICAgIHRoaXMucHJvY2Vzc0NvbW1lbnQobm9kZSk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICByZXNldFN0YXJ0TG9jYXRpb24obm9kZTogTm9kZUJhc2UsIHN0YXJ0OiBudW1iZXIsIHN0YXJ0TG9jOiBQb3NpdGlvbik6IHZvaWQge1xuICAgIG5vZGUuc3RhcnQgPSBzdGFydDtcbiAgICBub2RlLmxvYy5zdGFydCA9IHN0YXJ0TG9jO1xuICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSBub2RlLnJhbmdlWzBdID0gc3RhcnQ7XG4gIH1cblxuICByZXNldEVuZExvY2F0aW9uKFxuICAgIG5vZGU6IE5vZGVCYXNlLFxuICAgIGVuZD86IG51bWJlciA9IHRoaXMuc3RhdGUubGFzdFRva0VuZCxcbiAgICBlbmRMb2M/OiBQb3NpdGlvbiA9IHRoaXMuc3RhdGUubGFzdFRva0VuZExvYyxcbiAgKTogdm9pZCB7XG4gICAgbm9kZS5lbmQgPSBlbmQ7XG4gICAgbm9kZS5sb2MuZW5kID0gZW5kTG9jO1xuICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSBub2RlLnJhbmdlWzFdID0gZW5kO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBzdGFydCBsb2NhdGlvbiBvZiBub2RlIHRvIHRoZSBzdGFydCBsb2NhdGlvbiBvZiBsb2NhdGlvbk5vZGVcbiAgICovXG4gIHJlc2V0U3RhcnRMb2NhdGlvbkZyb21Ob2RlKG5vZGU6IE5vZGVCYXNlLCBsb2NhdGlvbk5vZGU6IE5vZGVCYXNlKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldFN0YXJ0TG9jYXRpb24obm9kZSwgbG9jYXRpb25Ob2RlLnN0YXJ0LCBsb2NhdGlvbk5vZGUubG9jLnN0YXJ0KTtcbiAgfVxufVxuIl19