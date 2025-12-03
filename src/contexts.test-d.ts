import { describe, expectTypeOf, test } from "vitest";
import type { Context, ItemEditorContext, ItemListingContext, OtherContext } from "./contexts";

describe("Context types have correct properties", () => {
  test("ItemEditorContext has only item editor properties", () => {
    expectTypeOf<ItemEditorContext["appConfig"]>().toBeNullable();
    expectTypeOf<keyof ItemEditorContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "contentItemId"
      | "languageId"
      | "validationErrors"
      | "currentPage"
    >();
  });

  test("ItemListingContext has only item listing properties", () => {
    expectTypeOf<keyof ItemListingContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "languageId"
      | "itemListingFilter"
      | "itemListingSelection"
      | "currentPage"
    >();
  });

  test("OtherContext has only shared properties", () => {
    expectTypeOf<keyof OtherContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "currentPage"
    >();
  });

  test("Context is a discriminated union by currentPage", () => {
    expectTypeOf<Context["currentPage"]>().toEqualTypeOf<
      "itemEditor" | "contentInventory" | "other"
    >();
  });

  test("ItemEditorContext has literal currentPage", () => {
    expectTypeOf<ItemEditorContext["currentPage"]>().toEqualTypeOf<"itemEditor">();
  });

  test("ItemListingContext has literal currentPage", () => {
    expectTypeOf<ItemListingContext["currentPage"]>().toEqualTypeOf<"contentInventory">();
  });

  test("OtherContext has literal currentPage", () => {
    expectTypeOf<OtherContext["currentPage"]>().toEqualTypeOf<"other">();
  });
});
