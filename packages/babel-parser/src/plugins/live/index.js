// @flow

import type Parser from "../../parser";
import { keywords as tk, types as tt, TokenType } from "../../tokenizer/types";
import * as N from "../../types";
import { makeErrorTemplates, ErrorCodes } from "../../parser/error";
import { newAsyncArrowScope } from "../../util/expression-scope";
import { ExpressionErrors } from "../../parser/util";

import {
  SCOPE_FUNCTION,
  SCOPE_ARROW,
} from "../../util/scopeflags";

//const liveToken = tt._live = new TokenType("live", { keyword: 'live', beforeExpr: true, startsExpr: true });
//tk.set("live", liveToken);

//const mountToken = tt._mount = new TokenType("mount", { keyword: 'mount', beforeExpr: true, startsExpr: true });
//tk.set("mount", mountToken);

export const PARAM = 0b0000, // Initial Parameter flags
  PARAM_YIELD = 0b0001, // track [Yield] production parameter
  PARAM_AWAIT = 0b0010, // track [Await] production parameter
  PARAM_RETURN = 0b0100, // track [Return] production parameter
  PARAM_IN = 0b1000, // track [In] production parameter
  PARAM_MOUNT = 0b10000; // track [Mount] production parameter

export function functionFlags(
  isAsync: boolean,
  isGenerator: boolean,
  isLive: boolean,
): ParamKind {
  return (isAsync ? PARAM_AWAIT : 0) | (isGenerator ? PARAM_YIELD : 0) | (isLive ? PARAM_MOUNT : 0);
}

export default (superClass: Class<Parser>): Class<Parser> =>

  class extends superClass {

    isMountAllowed(): boolean {
      return this.prodParam.hasMount;
    }

    /* ============================================================ *
     * parser/statement.js                                          *
     * ============================================================ */

    isAsyncFunction(): boolean {
      if (!this.isContextual("async") || !this.isContextual("live")) return false;
      const next = this.nextTokenStart();
      return (
        !lineBreak.test(this.input.slice(this.state.pos, next)) &&
        this.isUnparsedContextual(next, "function")
      );
    }
    
    /* ============================================================ *
     * parser/expression.js                                         *
     * ============================================================ */

    initFunction(node: N.BodilessFunctionOrMethodBase, isAsync: ?boolean, isLive: ?boolean): void {
      node.id = null;
      node.generator = false;
      node.async = !!isAsync;
      node.live = !!isLive;
    }
    
    atPossibleLiveArrow(base: N.Expression): boolean {
      return (
        base.type === "Identifier" &&
        (base.name === "live") &&
        this.state.lastTokEnd === base.end &&
        !this.canInsertSemicolon() &&
        // check there are no escape sequences, such as \u{61}sync
        (base.end - base.start === 4) &&
        base.start === this.state.potentialArrowAt
      );
    }

    parseSubscripts(
      base: N.Expression,
      startPos: number,
      startLoc: Position,
      noCalls?: ?boolean,
    ): N.Expression {
      const state = {
        optionalChainMember: false,
        maybeAsyncArrow: this.atPossibleAsyncArrow(base),
        maybeLiveArrow: this.atPossibleLiveArrow(base),
        stop: false,
      };
      do {
        base = this.parseSubscript(base, startPos, startLoc, noCalls, state);

        state.maybeAsyncArrow = false;
        state.maybeLiveArrow = false;
      } while (!state.stop);
      return base;
    }

    parseArrowExpression(
      node: N.ArrowFunctionExpression,
      params: ?(N.Expression[]),
      isAsync: boolean,
      isLive: boolean,
      trailingCommaPos: ?number,
    ): N.ArrowFunctionExpression {
      this.scope.enter(SCOPE_FUNCTION | SCOPE_ARROW);
      let flags = functionFlags(isAsync, false, isLive);
      // ConciseBody and AsyncConciseBody inherit [In]
      if (!this.match(tt.bracketL) && this.prodParam.hasIn) {
        flags |= PARAM_IN;
      }
      this.prodParam.enter(flags);
      this.initFunction(node, isAsync, isLive);
      const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;

      if (params) {
        this.state.maybeInArrowParameters = true;
        this.setArrowFunctionParameters(node, params, trailingCommaPos);
      }
      this.state.maybeInArrowParameters = false;
      this.parseFunctionBody(node, true);

      this.prodParam.exit();
      this.scope.exit();
      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;

      return this.finishNode(node, "ArrowFunctionExpression");
    }

    parseLiveArrowFromCallExpression(
      node: N.ArrowFunctionExpression,
      call: N.CallExpression,
    ): N.ArrowFunctionExpression {
      this.expect(tt.arrow);
      this.parseArrowExpression(
        node,
        call.arguments,
        false,
        true,
        call.extra?.trailingComma,
      );
      return node;
    }

    parseLiveArrowUnaryFunction(id: N.Expression): N.ArrowFunctionExpression {
      const node = this.startNodeAtNode(id);
      // We don't need to push a new ParameterDeclarationScope here since we are sure
      // 1) it is an async arrow, 2) no biding pattern is allowed in params
      this.prodParam.enter(functionFlags(false, false, true));
      const params = [this.parseIdentifier()];
      this.prodParam.exit();
      if (this.hasPrecedingLineBreak()) {
        this.raise(this.state.pos, Errors.LineTerminatorBeforeArrow);
      }
      this.expect(tt.arrow);
      // let foo = live bar => {};
      this.parseArrowExpression(node, params, true);
      return node;
    }

    // https://tc39.es/ecma262/#prod-CoverCallExpressionAndAsyncArrowHead
    // CoverCallExpressionAndAsyncArrowHead
    // CallExpression[?Yield, ?Await] Arguments[?Yield, ?Await]
    // OptionalChain[?Yield, ?Await] Arguments[?Yield, ?Await]
    parseCoverCallAndAsyncArrowHead(
      base: N.Expression,
      startPos: number,
      startLoc: Position,
      state: N.ParseSubscriptState,
      optional: boolean,
    ): N.Expression {
      const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
      let refExpressionErrors = null;

      this.state.maybeInArrowParameters = true;
      this.next(); // eat `(`

      let node = this.startNodeAt(startPos, startLoc);
      node.callee = base;

      if (state.maybeAsyncArrow || state.maybeLiveArrow) {
        this.expressionScope.enter(newAsyncArrowScope());
        refExpressionErrors = new ExpressionErrors();
      }

      if (state.optionalChainMember) {
        node.optional = optional;
      }

      if (optional) {
        node.arguments = this.parseCallExpressionArguments(tt.parenR);
      } else {
        node.arguments = this.parseCallExpressionArguments(
          tt.parenR,
          base.type === "Import",
          base.type !== "Super",
          node,
          refExpressionErrors,
        );
      }
      this.finishCallExpression(node, state.optionalChainMember);

      if (state.maybeLiveArrow && this.shouldParseAsyncArrow() && !optional) {
        state.stop = true;
        this.expressionScope.validateAsPattern();
        this.expressionScope.exit();
        node = this.parseLiveArrowFromCallExpression(
          this.startNodeAt(startPos, startLoc),
          node,
        );
      } else if (state.maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
        state.stop = true;
        this.expressionScope.validateAsPattern();
        this.expressionScope.exit();
        node = this.parseAsyncArrowFromCallExpression(
          this.startNodeAt(startPos, startLoc),
          node,
        );
      } else {
        if (state.maybeAsyncArrow || state.maybeLiveArrow) {
          this.checkExpressionErrors(refExpressionErrors, true);
          this.expressionScope.exit();
        }
        this.toReferencedArguments(node);
      }

      this.state.maybeInArrowParameters = oldMaybeInArrowParameters;

      return node;
    }
    
    parseMaybeUnary(
      refExpressionErrors: ?ExpressionErrors,
      sawUnary?: boolean,
    ): N.Expression {
      const startPos = this.state.start;
      const startLoc = this.state.startLoc;
      const isMount = this.isContextual("mount");

      if (isMount && this.isMountAllowed()) {
        this.next();
        const expr = this.parseMount(startPos, startLoc);
        if (!sawUnary) this.checkExponentialAfterUnary(expr);
        return expr;
      }
      return super.parseMaybeUnary(refExpressionErrors, sawUnary);
    }

    parseMount(startPos: number, startLoc: Position): N.AwaitExpression {
      const node = this.parseAwait(startPos, startLoc);
      node.type = 'MountExpression';
      return node;
    }

    parseExprAtom(refExpressionErrors?: ?ExpressionErrors): N.Expression {
      let node;

      switch (this.state.type) {
        case tt.name: {
          const canBeArrow = this.state.potentialArrowAt === this.state.start;
          const containsEsc = this.state.containsEsc;
          const id = this.parseIdentifier();

          if (!containsEsc && (id.name === "live") && !this.canInsertSemicolon()) {
            if (this.match(tt._function)) {
              this.next();
              return this.parseFunction(
                this.startNodeAtNode(id),
                undefined,
                false,
                true,
              );
            } else if (this.match(tt.name)) {
              // If the next token begins with "=", commit to parsing an async
              // arrow function. (Peeking ahead for "=" lets us avoid a more
              // expensive full-token lookahead on this common path.)
              if (this.lookaheadCharCode() === charCodes.equalsTo) {
                return this.parseLiveArrowUnaryFunction(id);
              } else {
                // Otherwise, treat "async" as an identifier and let calling code
                // deal with the current tt.name token.
                return id;
              }
            }
          }

          if (canBeArrow && this.match(tt.arrow) && !this.canInsertSemicolon()) {
            this.next();
            return this.parseArrowExpression(
              this.startNodeAtNode(id),
              [id],
              false,
            );
          }

          return id;
        }

        // fall through
        default:
          return super.parseExprAtom(refExpressionErrors);
      }
    }

  }