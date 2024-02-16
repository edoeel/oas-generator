import { infoSg } from "@app/concat/info";
import { describe, expect, it } from "bun:test";

describe("Info semigroup", () => {
  it("should concat 2 infos into 1 info", () => {
    expect(infoSg.concat({
      title: 'a',
      version: 'a'
    }, {
      title: 'b',
      version: 'b'
    })).toStrictEqual({
      title: 'a',
      version: 'a'
    })
  })
});
