import { pathsSg } from "@app/concat/index";
import { describe, expect, it } from "bun:test";

const emptyMethod = { responses: {} }

describe("Paths semigroup", () => {
  it("should concat 2 paths into 1 path", () => {
    expect(pathsSg.concat({
      "/quote": {
        "get": emptyMethod,
      }
    }, {})).toStrictEqual({
      "/quote": {
        "get": emptyMethod,
      }
    });
  })
  it("should concat 2 paths into 1 path", () => {
    expect(pathsSg.concat({}, {
      "/quote": {
        "get": emptyMethod,
      }
    })).toStrictEqual({
      "/quote": {
        "get": emptyMethod,
      }
    });
  })
  it("should concat 2 paths into 1 path", () => {
    expect(pathsSg.concat({
      "/quote": {
        "get": emptyMethod,
      }
    }, {
      "/quote": {
        "post": emptyMethod,
      }
    })).toStrictEqual({
      "/quote": {
        "get": emptyMethod,
        "post": emptyMethod,
      }
    });
  })
  it("should concat 2 paths into 1 path", () => {
    expect(pathsSg.concat({
      "/quote": {
        "get": emptyMethod,
      },
      "/pay": {
        "get": emptyMethod,
      }
    }, {
      "/quote": {
        "post": emptyMethod,
      }
    })).toStrictEqual({
      "/quote": {
        "get": emptyMethod,
        "post": emptyMethod,
      },
      "/pay": {
        "get": emptyMethod,
      }
    });
  })
});
