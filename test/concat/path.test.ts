import { pathSg } from "@app/concat/index";
import { describe, expect, it } from "bun:test";

const emptyMethod = { responses: {} }

describe("Path semigroup", () => {
  it("should concat 2 paths into 1 path", () => {
    expect(pathSg.concat({
      "get": emptyMethod,
      "post": emptyMethod
    }, {})).toStrictEqual({
      "get": emptyMethod,
      "post": emptyMethod
    });
  })
  it("should concat 2 paths into 1 path", () => {
    expect(pathSg.concat({}, {
      "get": emptyMethod,
      "post": emptyMethod
    })).toStrictEqual({
      "get": emptyMethod,
      "post": emptyMethod
    });
  })
  it("should concat 2 paths into 1 path", () => {
    expect(pathSg.concat({
      "get": emptyMethod,
      "post": emptyMethod
    }, {
      "get": emptyMethod,
      "put": emptyMethod
    })).toStrictEqual({
      "get": emptyMethod,
      "post": emptyMethod,
      "put": emptyMethod
    });
  })
  it("should concat 2 paths into 1 path", () => {
    expect(pathSg.concat({
      "get": emptyMethod,
      "post": emptyMethod
    }, {
      "put": emptyMethod,
      "delete": emptyMethod
    })).toStrictEqual({
      "get": emptyMethod,
      "post": emptyMethod,
      "put": emptyMethod,
      "delete": emptyMethod
    });
  })
});
