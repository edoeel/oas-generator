import { methodSg } from "@app/concat/index";
import { describe, expect, it } from "bun:test";

const emptyResponse = { description: '' };

describe("Method semigroup", () => {
  it("should concat 2 methods into 1 method", () => {
    expect(methodSg.concat({
      responses: {
        '200': emptyResponse
      }
    }, { responses: {} })).toStrictEqual({
      responses: {
        '200': emptyResponse
      }
    });
  })
  it("should concat 2 methods into 1 method", () => {
    expect(methodSg.concat({
      responses: {
      }
    }, {
      responses: {
        '200': emptyResponse
      }
    })).toStrictEqual({
      responses: {
        '200': emptyResponse
      }
    });
  })
  it("should concat 2 methods into 1 method", () => {
    expect(methodSg.concat({
      responses: {
        '200': emptyResponse
      }
    }, {
      responses: {
        '200': { description: "A longer description" }
      }
    })).toStrictEqual({
      responses: {
        '200': { description: "A longer description" }
      }
    });
  })
  it("should concat 2 methods into 1 method", () => {
    expect(methodSg.concat({
      responses: {
        '200': emptyResponse,
        '400': emptyResponse
      }
    }, {
      responses: {
        '200': { description: "A longer description" }
      }
    })).toStrictEqual({
      responses: {
        '200': { description: "A longer description" },
        '400': emptyResponse
      }
    });
  })
});
