import { describe, expect, test } from "vitest";
import { get } from "./users";

describe("get", () => {
  test("should combine string with parameter value", async () => {
    const resp = await get({ id: "991777093312585808" });
  });
});
