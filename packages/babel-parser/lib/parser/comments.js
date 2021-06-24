"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _base = _interopRequireDefault(require("./base"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function last(stack) {
  return stack[stack.length - 1];
}

var CommentsParser = /*#__PURE__*/function (_BaseParser) {
  _inherits(CommentsParser, _BaseParser);

  var _super = _createSuper(CommentsParser);

  function CommentsParser() {
    _classCallCheck(this, CommentsParser);

    return _super.apply(this, arguments);
  }

  _createClass(CommentsParser, [{
    key: "addComment",
    value: function addComment(comment) {
      if (this.filename) comment.loc.filename = this.filename;
      this.state.trailingComments.push(comment);
      this.state.leadingComments.push(comment);
    }
  }, {
    key: "adjustCommentsAfterTrailingComma",
    value: function adjustCommentsAfterTrailingComma(node, elements, // When the current node is followed by a token which hasn't a respective AST node, we
    // need to take all the trailing comments to prevent them from being attached to an
    // unrelated node. e.g. in
    //     var { x } /* cmt */ = { y }
    // we don't want /* cmt */ to be attached to { y }.
    // On the other hand, in
    //     fn(x) [new line] /* cmt */ [new line] y
    // /* cmt */ is both a trailing comment of fn(x) and a leading comment of y
    takeAllComments) {
      if (this.state.leadingComments.length === 0) {
        return;
      }

      var lastElement = null;
      var i = elements.length;

      while (lastElement === null && i > 0) {
        lastElement = elements[--i];
      }

      if (lastElement === null) {
        return;
      }

      for (var j = 0; j < this.state.leadingComments.length; j++) {
        if (this.state.leadingComments[j].end < this.state.commentPreviousNode.end) {
          this.state.leadingComments.splice(j, 1);
          j--;
        }
      }

      var newTrailingComments = [];

      for (var _i = 0; _i < this.state.leadingComments.length; _i++) {
        var leadingComment = this.state.leadingComments[_i];

        if (leadingComment.end < node.end) {
          newTrailingComments.push(leadingComment); // Perf: we don't need to splice if we are going to reset the array anyway

          if (!takeAllComments) {
            this.state.leadingComments.splice(_i, 1);
            _i--;
          }
        } else {
          if (node.trailingComments === undefined) {
            node.trailingComments = [];
          }

          node.trailingComments.push(leadingComment);
        }
      }

      if (takeAllComments) this.state.leadingComments = [];

      if (newTrailingComments.length > 0) {
        lastElement.trailingComments = newTrailingComments;
      } else if (lastElement.trailingComments !== undefined) {
        lastElement.trailingComments = [];
      }
    }
  }, {
    key: "processComment",
    value: function processComment(node) {
      if (node.type === "Program" && node.body.length > 0) return;
      var stack = this.state.commentStack;
      var firstChild, lastChild, trailingComments, i, j;

      if (this.state.trailingComments.length > 0) {
        // If the first comment in trailingComments comes after the
        // current node, then we're good - all comments in the array will
        // come after the node and so it's safe to add them as official
        // trailingComments.
        if (this.state.trailingComments[0].start >= node.end) {
          trailingComments = this.state.trailingComments;
          this.state.trailingComments = [];
        } else {
          // Otherwise, if the first comment doesn't come after the
          // current node, that means we have a mix of leading and trailing
          // comments in the array and that leadingComments contains the
          // same items as trailingComments. Reset trailingComments to
          // zero items and we'll handle this by evaluating leadingComments
          // later.
          this.state.trailingComments.length = 0;
        }
      } else if (stack.length > 0) {
        var lastInStack = last(stack);

        if (lastInStack.trailingComments && lastInStack.trailingComments[0].start >= node.end) {
          trailingComments = lastInStack.trailingComments;
          delete lastInStack.trailingComments;
        }
      } // Eating the stack.


      if (stack.length > 0 && last(stack).start >= node.start) {
        firstChild = stack.pop();
      }

      while (stack.length > 0 && last(stack).start >= node.start) {
        lastChild = stack.pop();
      }

      if (!lastChild && firstChild) lastChild = firstChild; // Adjust comments that follow a trailing comma on the last element in a
      // comma separated list of nodes to be the trailing comments on the last
      // element

      if (firstChild) {
        switch (node.type) {
          case "ObjectExpression":
            this.adjustCommentsAfterTrailingComma(node, node.properties);
            break;

          case "ObjectPattern":
            this.adjustCommentsAfterTrailingComma(node, node.properties, true);
            break;

          case "CallExpression":
            this.adjustCommentsAfterTrailingComma(node, node.arguments);
            break;

          case "ArrayExpression":
            this.adjustCommentsAfterTrailingComma(node, node.elements);
            break;

          case "ArrayPattern":
            this.adjustCommentsAfterTrailingComma(node, node.elements, true);
            break;
        }
      } else if (this.state.commentPreviousNode && (this.state.commentPreviousNode.type === "ImportSpecifier" && node.type !== "ImportSpecifier" || this.state.commentPreviousNode.type === "ExportSpecifier" && node.type !== "ExportSpecifier")) {
        this.adjustCommentsAfterTrailingComma(node, [this.state.commentPreviousNode]);
      }

      if (lastChild) {
        if (lastChild.leadingComments) {
          if (lastChild !== node && lastChild.leadingComments.length > 0 && last(lastChild.leadingComments).end <= node.start) {
            node.leadingComments = lastChild.leadingComments;
            delete lastChild.leadingComments;
          } else {
            // A leading comment for an anonymous class had been stolen by its first ClassMethod,
            // so this takes back the leading comment.
            // See also: https://github.com/eslint/espree/issues/158
            for (i = lastChild.leadingComments.length - 2; i >= 0; --i) {
              if (lastChild.leadingComments[i].end <= node.start) {
                node.leadingComments = lastChild.leadingComments.splice(0, i + 1);
                break;
              }
            }
          }
        }
      } else if (this.state.leadingComments.length > 0) {
        if (last(this.state.leadingComments).end <= node.start) {
          if (this.state.commentPreviousNode) {
            for (j = 0; j < this.state.leadingComments.length; j++) {
              if (this.state.leadingComments[j].end < this.state.commentPreviousNode.end) {
                this.state.leadingComments.splice(j, 1);
                j--;
              }
            }
          }

          if (this.state.leadingComments.length > 0) {
            node.leadingComments = this.state.leadingComments;
            this.state.leadingComments = [];
          }
        } else {
          // https://github.com/eslint/espree/issues/2
          //
          // In special cases, such as return (without a value) and
          // debugger, all comments will end up as leadingComments and
          // will otherwise be eliminated. This step runs when the
          // commentStack is empty and there are comments left
          // in leadingComments.
          //
          // This loop figures out the stopping point between the actual
          // leading and trailing comments by finding the location of the
          // first comment that comes after the given node.
          for (i = 0; i < this.state.leadingComments.length; i++) {
            if (this.state.leadingComments[i].end > node.start) {
              break;
            }
          } // Split the array based on the location of the first comment
          // that comes after the node. Keep in mind that this could
          // result in an empty array, and if so, the array must be
          // deleted.


          var leadingComments = this.state.leadingComments.slice(0, i);

          if (leadingComments.length) {
            node.leadingComments = leadingComments;
          } // Similarly, trailing comments are attached later. The variable
          // must be reset to null if there are no trailing comments.


          trailingComments = this.state.leadingComments.slice(i);

          if (trailingComments.length === 0) {
            trailingComments = null;
          }
        }
      }

      this.state.commentPreviousNode = node;

      if (trailingComments) {
        if (trailingComments.length && trailingComments[0].start >= node.start && last(trailingComments).end <= node.end) {
          node.innerComments = trailingComments;
        } else {
          // TrailingComments maybe contain innerComments
          var firstTrailingCommentIndex = trailingComments.findIndex(function (comment) {
            return comment.end >= node.end;
          });

          if (firstTrailingCommentIndex > 0) {
            node.innerComments = trailingComments.slice(0, firstTrailingCommentIndex);
            node.trailingComments = trailingComments.slice(firstTrailingCommentIndex);
          } else {
            node.trailingComments = trailingComments;
          }
        }
      }

      stack.push(node);
    }
  }]);

  return CommentsParser;
}(_base["default"]);

exports["default"] = CommentsParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvY29tbWVudHMuanMiXSwibmFtZXMiOlsibGFzdCIsInN0YWNrIiwibGVuZ3RoIiwiQ29tbWVudHNQYXJzZXIiLCJjb21tZW50IiwiZmlsZW5hbWUiLCJsb2MiLCJzdGF0ZSIsInRyYWlsaW5nQ29tbWVudHMiLCJwdXNoIiwibGVhZGluZ0NvbW1lbnRzIiwibm9kZSIsImVsZW1lbnRzIiwidGFrZUFsbENvbW1lbnRzIiwibGFzdEVsZW1lbnQiLCJpIiwiaiIsImVuZCIsImNvbW1lbnRQcmV2aW91c05vZGUiLCJzcGxpY2UiLCJuZXdUcmFpbGluZ0NvbW1lbnRzIiwibGVhZGluZ0NvbW1lbnQiLCJ1bmRlZmluZWQiLCJ0eXBlIiwiYm9keSIsImNvbW1lbnRTdGFjayIsImZpcnN0Q2hpbGQiLCJsYXN0Q2hpbGQiLCJzdGFydCIsImxhc3RJblN0YWNrIiwicG9wIiwiYWRqdXN0Q29tbWVudHNBZnRlclRyYWlsaW5nQ29tbWEiLCJwcm9wZXJ0aWVzIiwiYXJndW1lbnRzIiwic2xpY2UiLCJpbm5lckNvbW1lbnRzIiwiZmlyc3RUcmFpbGluZ0NvbW1lbnRJbmRleCIsImZpbmRJbmRleCIsIkJhc2VQYXJzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQTBCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsU0FBU0EsSUFBVCxDQUFpQkMsS0FBakIsRUFBOEM7QUFDNUMsU0FBT0EsS0FBSyxDQUFDQSxLQUFLLENBQUNDLE1BQU4sR0FBZSxDQUFoQixDQUFaO0FBQ0Q7O0lBRW9CQyxjOzs7Ozs7Ozs7Ozs7O1dBQ25CLG9CQUFXQyxPQUFYLEVBQW1DO0FBQ2pDLFVBQUksS0FBS0MsUUFBVCxFQUFtQkQsT0FBTyxDQUFDRSxHQUFSLENBQVlELFFBQVosR0FBdUIsS0FBS0EsUUFBNUI7QUFDbkIsV0FBS0UsS0FBTCxDQUFXQyxnQkFBWCxDQUE0QkMsSUFBNUIsQ0FBaUNMLE9BQWpDO0FBQ0EsV0FBS0csS0FBTCxDQUFXRyxlQUFYLENB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QUFJLENBQUNILGdCQUFMLEdBQXdCQSxnQkFBZ0IsQ0FBQzBCLEtBQWpCLENBQ3RCRSx5QkFEc0IsQ0FBeEI7QUFHRCxXQVJELE1BUU87QUFDTHpCLFlBQUFBLElBQUksQ0FBQ0gsZ0JBQUwsR0FBd0JBLGdCQUF4QjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRFAsTUFBQUEsS0FBSyxDQUFDUSxJQUFOLENBQVdFLElBQVg7QUFDRDs7OztFQTdQeUMyQixnQiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbi8qKlxuICogQmFzZWQgb24gdGhlIGNvbW1lbnQgYXR0YWNobWVudCBhbGdvcml0aG0gdXNlZCBpbiBlc3ByZWUgYW5kIGVzdHJhdmVyc2UuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAqICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuICogICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiXG4gKiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIDxDT1BZUklHSFQgSE9MREVSPiBCRSBMSUFCTEUgRk9SIEFOWVxuICogRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbiAqIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbiAqIExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORFxuICogT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbiAqIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRlxuICogVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG5pbXBvcnQgQmFzZVBhcnNlciBmcm9tIFwiLi9iYXNlXCI7XG5pbXBvcnQgdHlwZSB7IENvbW1lbnQsIE5vZGUgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZnVuY3Rpb24gbGFzdDxUPihzdGFjazogJFJlYWRPbmx5QXJyYXk8VD4pOiBUIHtcbiAgcmV0dXJuIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tZW50c1BhcnNlciBleHRlbmRzIEJhc2VQYXJzZXIge1xuICBhZGRDb21tZW50KGNvbW1lbnQ6IENvbW1lbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5maWxlbmFtZSkgY29tbWVudC5sb2MuZmlsZW5hbWUgPSB0aGlzLmZpbGVuYW1lO1xuICAgIHRoaXMuc3RhdGUudHJhaWxpbmdDb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgIHRoaXMuc3RhdGUubGVhZGluZ0NvbW1lbnRzLnB1c2goY29tbWVudCk7XG4gIH1cblxuICBhZGp1c3RDb21tZW50c0FmdGVyVHJhaWxpbmdDb21tYShcbiAgICBub2RlOiBOb2RlLFxuICAgIGVsZW1lbnRzOiAoTm9kZSB8IG51bGwpW10sXG4gICAgLy8gV2hlbiB0aGUgY3VycmVudCBub2RlIGlzIGZvbGxvd2VkIGJ5IGEgdG9rZW4gd2hpY2ggaGFzbid0IGEgcmVzcGVjdGl2ZSBBU1Qgbm9kZSwgd2VcbiAgICAvLyBuZWVkIHRvIHRha2UgYWxsIHRoZSB0cmFpbGluZyBjb21tZW50cyB0byBwcmV2ZW50IHRoZW0gZnJvbSBiZWluZyBhdHRhY2hlZCB0byBhblxuICAgIC8vIHVucmVsYXRlZCBub2RlLiBlLmcuIGluXG4gICAgLy8gICAgIHZhciB7IHggfSAvKiBjbXQgKi8gPSB7IHkgfVxuICAgIC8vIHdlIGRvbid0IHdhbnQgLyogY210ICovIHRvIGJlIGF0dGFjaGVkIHRvIHsgeSB9LlxuICAgIC8vIE9uIHRoZSBvdGhlciBoYW5kLCBpblxuICAgIC8vICAgICBmbih4KSBbbmV3IGxpbmVdIC8qIGNtdCAqLyBbbmV3IGxpbmVdIHlcbiAgICAvLyAvKiBjbXQgKi8gaXMgYm90aCBhIHRyYWlsaW5nIGNvbW1lbnQgb2YgZm4oeCkgYW5kIGEgbGVhZGluZyBjb21tZW50IG9mIHlcbiAgICB0YWtlQWxsQ29tbWVudHM/OiBib29sZWFuLFxuICApIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGxhc3RFbGVtZW50ID0gbnVsbDtcbiAgICBsZXQgaSA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAobGFzdEVsZW1lbnQgPT09IG51bGwgJiYgaSA+IDApIHtcbiAgICAgIGxhc3RFbGVtZW50ID0gZWxlbWVudHNbLS1pXTtcbiAgICB9XG4gICAgaWYgKGxhc3RFbGVtZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50c1tqXS5lbmQgPCB0aGlzLnN0YXRlLmNvbW1lbnRQcmV2aW91c05vZGUuZW5kXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMuc3BsaWNlKGosIDEpO1xuICAgICAgICBqLS07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbmV3VHJhaWxpbmdDb21tZW50cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxlYWRpbmdDb21tZW50ID0gdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHNbaV07XG4gICAgICBpZiAobGVhZGluZ0NvbW1lbnQuZW5kIDwgbm9kZS5lbmQpIHtcbiAgICAgICAgbmV3VHJhaWxpbmdDb21tZW50cy5wdXNoKGxlYWRpbmdDb21tZW50KTtcblxuICAgICAgICAvLyBQZXJmOiB3ZSBkb24ndCBuZWVkIHRvIHNwbGljZSBpZiB3ZSBhcmUgZ29pbmcgdG8gcmVzZXQgdGhlIGFycmF5IGFueXdheVxuICAgICAgICBpZiAoIXRha2VBbGxDb21tZW50cykge1xuICAgICAgICAgIHRoaXMuc3RhdGUubGVhZGluZ0NvbW1lbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChub2RlLnRyYWlsaW5nQ29tbWVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUudHJhaWxpbmdDb21tZW50cyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUudHJhaWxpbmdDb21tZW50cy5wdXNoKGxlYWRpbmdDb21tZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRha2VBbGxDb21tZW50cykgdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMgPSBbXTtcblxuICAgIGlmIChuZXdUcmFpbGluZ0NvbW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxhc3RFbGVtZW50LnRyYWlsaW5nQ29tbWVudHMgPSBuZXdUcmFpbGluZ0NvbW1lbnRzO1xuICAgIH0gZWxzZSBpZiAobGFzdEVsZW1lbnQudHJhaWxpbmdDb21tZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBsYXN0RWxlbWVudC50cmFpbGluZ0NvbW1lbnRzID0gW107XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc0NvbW1lbnQobm9kZTogTm9kZSk6IHZvaWQge1xuICAgIGlmIChub2RlLnR5cGUgPT09IFwiUHJvZ3JhbVwiICYmIG5vZGUuYm9keS5sZW5ndGggPiAwKSByZXR1cm47XG5cbiAgICBjb25zdCBzdGFjayA9IHRoaXMuc3RhdGUuY29tbWVudFN0YWNrO1xuXG4gICAgbGV0IGZpcnN0Q2hpbGQsIGxhc3RDaGlsZCwgdHJhaWxpbmdDb21tZW50cywgaSwgajtcblxuICAgIGlmICh0aGlzLnN0YXRlLnRyYWlsaW5nQ29tbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gSWYgdGhlIGZpcnN0IGNvbW1lbnQgaW4gdHJhaWxpbmdDb21tZW50cyBjb21lcyBhZnRlciB0aGVcbiAgICAgIC8vIGN1cnJlbnQgbm9kZSwgdGhlbiB3ZSdyZSBnb29kIC0gYWxsIGNvbW1lbnRzIGluIHRoZSBhcnJheSB3aWxsXG4gICAgICAvLyBjb21lIGFmdGVyIHRoZSBub2RlIGFuZCBzbyBpdCdzIHNhZmUgdG8gYWRkIHRoZW0gYXMgb2ZmaWNpYWxcbiAgICAgIC8vIHRyYWlsaW5nQ29tbWVudHMuXG4gICAgICBpZiAodGhpcy5zdGF0ZS50cmFpbGluZ0NvbW1lbnRzWzBdLnN0YXJ0ID49IG5vZGUuZW5kKSB7XG4gICAgICAgIHRyYWlsaW5nQ29tbWVudHMgPSB0aGlzLnN0YXRlLnRyYWlsaW5nQ29tbWVudHM7XG4gICAgICAgIHRoaXMuc3RhdGUudHJhaWxpbmdDb21tZW50cyA9IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgZmlyc3QgY29tbWVudCBkb2Vzbid0IGNvbWUgYWZ0ZXIgdGhlXG4gICAgICAgIC8vIGN1cnJlbnQgbm9kZSwgdGhhdCBtZWFucyB3ZSBoYXZlIGEgbWl4IG9mIGxlYWRpbmcgYW5kIHRyYWlsaW5nXG4gICAgICAgIC8vIGNvbW1lbnRzIGluIHRoZSBhcnJheSBhbmQgdGhhdCBsZWFkaW5nQ29tbWVudHMgY29udGFpbnMgdGhlXG4gICAgICAgIC8vIHNhbWUgaXRlbXMgYXMgdHJhaWxpbmdDb21tZW50cy4gUmVzZXQgdHJhaWxpbmdDb21tZW50cyB0b1xuICAgICAgICAvLyB6ZXJvIGl0ZW1zIGFuZCB3ZSdsbCBoYW5kbGUgdGhpcyBieSBldmFsdWF0aW5nIGxlYWRpbmdDb21tZW50c1xuICAgICAgICAvLyBsYXRlci5cbiAgICAgICAgdGhpcy5zdGF0ZS50cmFpbGluZ0NvbW1lbnRzLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBsYXN0SW5TdGFjayA9IGxhc3Qoc3RhY2spO1xuICAgICAgaWYgKFxuICAgICAgICBsYXN0SW5TdGFjay50cmFpbGluZ0NvbW1lbnRzICYmXG4gICAgICAgIGxhc3RJblN0YWNrLnRyYWlsaW5nQ29tbWVudHNbMF0uc3RhcnQgPj0gbm9kZS5lbmRcbiAgICAgICkge1xuICAgICAgICB0cmFpbGluZ0NvbW1lbnRzID0gbGFzdEluU3RhY2sudHJhaWxpbmdDb21tZW50cztcbiAgICAgICAgZGVsZXRlIGxhc3RJblN0YWNrLnRyYWlsaW5nQ29tbWVudHM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRWF0aW5nIHRoZSBzdGFjay5cbiAgICBpZiAoc3RhY2subGVuZ3RoID4gMCAmJiBsYXN0KHN0YWNrKS5zdGFydCA+PSBub2RlLnN0YXJ0KSB7XG4gICAgICBmaXJzdENoaWxkID0gc3RhY2sucG9wKCk7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDAgJiYgbGFzdChzdGFjaykuc3RhcnQgPj0gbm9kZS5zdGFydCkge1xuICAgICAgbGFzdENoaWxkID0gc3RhY2sucG9wKCk7XG4gICAgfVxuXG4gICAgaWYgKCFsYXN0Q2hpbGQgJiYgZmlyc3RDaGlsZCkgbGFzdENoaWxkID0gZmlyc3RDaGlsZDtcblxuICAgIC8vIEFkanVzdCBjb21tZW50cyB0aGF0IGZvbGxvdyBhIHRyYWlsaW5nIGNvbW1hIG9uIHRoZSBsYXN0IGVsZW1lbnQgaW4gYVxuICAgIC8vIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIG5vZGVzIHRvIGJlIHRoZSB0cmFpbGluZyBjb21tZW50cyBvbiB0aGUgbGFzdFxuICAgIC8vIGVsZW1lbnRcbiAgICBpZiAoZmlyc3RDaGlsZCkge1xuICAgICAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcIk9iamVjdEV4cHJlc3Npb25cIjpcbiAgICAgICAgICB0aGlzLmFkanVzdENvbW1lbnRzQWZ0ZXJUcmFpbGluZ0NvbW1hKG5vZGUsIG5vZGUucHJvcGVydGllcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJPYmplY3RQYXR0ZXJuXCI6XG4gICAgICAgICAgdGhpcy5hZGp1c3RDb21tZW50c0FmdGVyVHJhaWxpbmdDb21tYShub2RlLCBub2RlLnByb3BlcnRpZXMsIHRydWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiQ2FsbEV4cHJlc3Npb25cIjpcbiAgICAgICAgICB0aGlzLmFkanVzdENvbW1lbnRzQWZ0ZXJUcmFpbGluZ0NvbW1hKG5vZGUsIG5vZGUuYXJndW1lbnRzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFycmF5RXhwcmVzc2lvblwiOlxuICAgICAgICAgIHRoaXMuYWRqdXN0Q29tbWVudHNBZnRlclRyYWlsaW5nQ29tbWEobm9kZSwgbm9kZS5lbGVtZW50cyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJBcnJheVBhdHRlcm5cIjpcbiAgICAgICAgICB0aGlzLmFkanVzdENvbW1lbnRzQWZ0ZXJUcmFpbGluZ0NvbW1hKG5vZGUsIG5vZGUuZWxlbWVudHMsIHRydWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLnN0YXRlLmNvbW1lbnRQcmV2aW91c05vZGUgJiZcbiAgICAgICgodGhpcy5zdGF0ZS5jb21tZW50UHJldmlvdXNOb2RlLnR5cGUgPT09IFwiSW1wb3J0U3BlY2lmaWVyXCIgJiZcbiAgICAgICAgbm9kZS50eXBlICE9PSBcIkltcG9ydFNwZWNpZmllclwiKSB8fFxuICAgICAgICAodGhpcy5zdGF0ZS5jb21tZW50UHJldmlvdXNOb2RlLnR5cGUgPT09IFwiRXhwb3J0U3BlY2lmaWVyXCIgJiZcbiAgICAgICAgICBub2RlLnR5cGUgIT09IFwiRXhwb3J0U3BlY2lmaWVyXCIpKVxuICAgICkge1xuICAgICAgdGhpcy5hZGp1c3RDb21tZW50c0FmdGVyVHJhaWxpbmdDb21tYShub2RlLCBbXG4gICAgICAgIHRoaXMuc3RhdGUuY29tbWVudFByZXZpb3VzTm9kZSxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIGlmIChsYXN0Q2hpbGQpIHtcbiAgICAgIGlmIChsYXN0Q2hpbGQubGVhZGluZ0NvbW1lbnRzKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYXN0Q2hpbGQgIT09IG5vZGUgJiZcbiAgICAgICAgICBsYXN0Q2hpbGQubGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBsYXN0KGxhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHMpLmVuZCA8PSBub2RlLnN0YXJ0XG4gICAgICAgICkge1xuICAgICAgICAgIG5vZGUubGVhZGluZ0NvbW1lbnRzID0gbGFzdENoaWxkLmxlYWRpbmdDb21tZW50cztcbiAgICAgICAgICBkZWxldGUgbGFzdENoaWxkLmxlYWRpbmdDb21tZW50cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBBIGxlYWRpbmcgY29tbWVudCBmb3IgYW4gYW5vbnltb3VzIGNsYXNzIGhhZCBiZWVuIHN0b2xlbiBieSBpdHMgZmlyc3QgQ2xhc3NNZXRob2QsXG4gICAgICAgICAgLy8gc28gdGhpcyB0YWtlcyBiYWNrIHRoZSBsZWFkaW5nIGNvbW1lbnQuXG4gICAgICAgICAgLy8gU2VlIGFsc286IGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNwcmVlL2lzc3Vlcy8xNThcbiAgICAgICAgICBmb3IgKGkgPSBsYXN0Q2hpbGQubGVhZGluZ0NvbW1lbnRzLmxlbmd0aCAtIDI7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBpZiAobGFzdENoaWxkLmxlYWRpbmdDb21tZW50c1tpXS5lbmQgPD0gbm9kZS5zdGFydCkge1xuICAgICAgICAgICAgICBub2RlLmxlYWRpbmdDb21tZW50cyA9IGxhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHMuc3BsaWNlKDAsIGkgKyAxKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAobGFzdCh0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cykuZW5kIDw9IG5vZGUuc3RhcnQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuY29tbWVudFByZXZpb3VzTm9kZSkge1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50c1tqXS5lbmQgPFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmNvbW1lbnRQcmV2aW91c05vZGUuZW5kXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMuc3BsaWNlKGosIDEpO1xuICAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbm9kZS5sZWFkaW5nQ29tbWVudHMgPSB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cztcbiAgICAgICAgICB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cyA9IFtdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzcHJlZS9pc3N1ZXMvMlxuICAgICAgICAvL1xuICAgICAgICAvLyBJbiBzcGVjaWFsIGNhc2VzLCBzdWNoIGFzIHJldHVybiAod2l0aG91dCBhIHZhbHVlKSBhbmRcbiAgICAgICAgLy8gZGVidWdnZXIsIGFsbCBjb21tZW50cyB3aWxsIGVuZCB1cCBhcyBsZWFkaW5nQ29tbWVudHMgYW5kXG4gICAgICAgIC8vIHdpbGwgb3RoZXJ3aXNlIGJlIGVsaW1pbmF0ZWQuIFRoaXMgc3RlcCBydW5zIHdoZW4gdGhlXG4gICAgICAgIC8vIGNvbW1lbnRTdGFjayBpcyBlbXB0eSBhbmQgdGhlcmUgYXJlIGNvbW1lbnRzIGxlZnRcbiAgICAgICAgLy8gaW4gbGVhZGluZ0NvbW1lbnRzLlxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIGxvb3AgZmlndXJlcyBvdXQgdGhlIHN0b3BwaW5nIHBvaW50IGJldHdlZW4gdGhlIGFjdHVhbFxuICAgICAgICAvLyBsZWFkaW5nIGFuZCB0cmFpbGluZyBjb21tZW50cyBieSBmaW5kaW5nIHRoZSBsb2NhdGlvbiBvZiB0aGVcbiAgICAgICAgLy8gZmlyc3QgY29tbWVudCB0aGF0IGNvbWVzIGFmdGVyIHRoZSBnaXZlbiBub2RlLlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHNbaV0uZW5kID4gbm9kZS5zdGFydCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3BsaXQgdGhlIGFycmF5IGJhc2VkIG9uIHRoZSBsb2NhdGlvbiBvZiB0aGUgZmlyc3QgY29tbWVudFxuICAgICAgICAvLyB0aGF0IGNvbWVzIGFmdGVyIHRoZSBub2RlLiBLZWVwIGluIG1pbmQgdGhhdCB0aGlzIGNvdWxkXG4gICAgICAgIC8vIHJlc3VsdCBpbiBhbiBlbXB0eSBhcnJheSwgYW5kIGlmIHNvLCB0aGUgYXJyYXkgbXVzdCBiZVxuICAgICAgICAvLyBkZWxldGVkLlxuICAgICAgICBjb25zdCBsZWFkaW5nQ29tbWVudHMgPSB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cy5zbGljZSgwLCBpKTtcblxuICAgICAgICBpZiAobGVhZGluZ0NvbW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgIG5vZGUubGVhZGluZ0NvbW1lbnRzID0gbGVhZGluZ0NvbW1lbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2ltaWxhcmx5LCB0cmFpbGluZyBjb21tZW50cyBhcmUgYXR0YWNoZWQgbGF0ZXIuIFRoZSB2YXJpYWJsZVxuICAgICAgICAvLyBtdXN0IGJlIHJlc2V0IHRvIG51bGwgaWYgdGhlcmUgYXJlIG5vIHRyYWlsaW5nIGNvbW1lbnRzLlxuICAgICAgICB0cmFpbGluZ0NvbW1lbnRzID0gdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMuc2xpY2UoaSk7XG4gICAgICAgIGlmICh0cmFpbGluZ0NvbW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRyYWlsaW5nQ29tbWVudHMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZS5jb21tZW50UHJldmlvdXNOb2RlID0gbm9kZTtcblxuICAgIGlmICh0cmFpbGluZ0NvbW1lbnRzKSB7XG4gICAgICBpZiAoXG4gICAgICAgIHRyYWlsaW5nQ29tbWVudHMubGVuZ3RoICYmXG4gICAgICAgIHRyYWlsaW5nQ29tbWVudHNbMF0uc3RhcnQgPj0gbm9kZS5zdGFydCAmJlxuICAgICAgICBsYXN0KHRyYWlsaW5nQ29tbWVudHMpLmVuZCA8PSBub2RlLmVuZFxuICAgICAgKSB7XG4gICAgICAgIG5vZGUuaW5uZXJDb21tZW50cyA9IHRyYWlsaW5nQ29tbWVudHM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUcmFpbGluZ0NvbW1lbnRzIG1heWJlIGNvbnRhaW4gaW5uZXJDb21tZW50c1xuICAgICAgICBjb25zdCBmaXJzdFRyYWlsaW5nQ29tbWVudEluZGV4ID0gdHJhaWxpbmdDb21tZW50cy5maW5kSW5kZXgoXG4gICAgICAgICAgY29tbWVudCA9PiBjb21tZW50LmVuZCA+PSBub2RlLmVuZCxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZmlyc3RUcmFpbGluZ0NvbW1lbnRJbmRleCA+IDApIHtcbiAgICAgICAgICBub2RlLmlubmVyQ29tbWVudHMgPSB0cmFpbGluZ0NvbW1lbnRzLnNsaWNlKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGZpcnN0VHJhaWxpbmdDb21tZW50SW5kZXgsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBub2RlLnRyYWlsaW5nQ29tbWVudHMgPSB0cmFpbGluZ0NvbW1lbnRzLnNsaWNlKFxuICAgICAgICAgICAgZmlyc3RUcmFpbGluZ0NvbW1lbnRJbmRleCxcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUudHJhaWxpbmdDb21tZW50cyA9IHRyYWlsaW5nQ29tbWVudHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFjay5wdXNoKG5vZGUpO1xuICB9XG59XG4iXX0=