import { describe, expectTypeOf, test } from "vitest";
import type {
  ContentTypeEditorContext,
  ContentTypeListingContext,
  Context,
  ItemEditorContext,
  ItemListingContext,
  OtherContext,
  SnippetEditorContext,
  SnippetListingContext,
  TaxonomyEditorContext,
  TaxonomyListingContext,
} from "./contexts";

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
      | "itemEditor"
      | "contentInventory"
      | "contentTypeListing"
      | "contentTypeEditor"
      | "snippetListing"
      | "snippetEditor"
      | "taxonomyListing"
      | "taxonomyEditor"
      | "other"
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

  test("ContentTypeListingContext has only content type listing properties", () => {
    expectTypeOf<keyof ContentTypeListingContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "contentModelListingSelection"
      | "contentModelListingFilter"
      | "currentPage"
    >();
  });

  test("ContentTypeListingContext has literal currentPage", () => {
    expectTypeOf<ContentTypeListingContext["currentPage"]>().toEqualTypeOf<"contentTypeListing">();
  });

  test("ContentTypeEditorContext has only content type editor properties", () => {
    expectTypeOf<keyof ContentTypeEditorContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "contentTypeId"
      | "hasUnsavedChanges"
      | "validationErrors"
      | "currentPage"
    >();
  });

  test("ContentTypeEditorContext has literal currentPage", () => {
    expectTypeOf<ContentTypeEditorContext["currentPage"]>().toEqualTypeOf<"contentTypeEditor">();
  });

  test("SnippetListingContext has only snippet listing properties", () => {
    expectTypeOf<keyof SnippetListingContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "contentModelListingSelection"
      | "contentModelListingFilter"
      | "currentPage"
    >();
  });

  test("SnippetListingContext has literal currentPage", () => {
    expectTypeOf<SnippetListingContext["currentPage"]>().toEqualTypeOf<"snippetListing">();
  });

  test("SnippetEditorContext has only snippet editor properties", () => {
    expectTypeOf<keyof SnippetEditorContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "snippetId"
      | "hasUnsavedChanges"
      | "validationErrors"
      | "currentPage"
    >();
  });

  test("SnippetEditorContext has literal currentPage", () => {
    expectTypeOf<SnippetEditorContext["currentPage"]>().toEqualTypeOf<"snippetEditor">();
  });

  test("TaxonomyListingContext has only taxonomy listing properties", () => {
    expectTypeOf<keyof TaxonomyListingContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "contentModelListingSelection"
      | "currentPage"
    >();
  });

  test("TaxonomyListingContext has literal currentPage", () => {
    expectTypeOf<TaxonomyListingContext["currentPage"]>().toEqualTypeOf<"taxonomyListing">();
  });

  test("TaxonomyEditorContext has only taxonomy editor properties", () => {
    expectTypeOf<keyof TaxonomyEditorContext>().toEqualTypeOf<
      | "path"
      | "pageTitle"
      | "environmentId"
      | "userId"
      | "userEmail"
      | "userRoles"
      | "appConfig"
      | "taxonomyGroupId"
      | "hasUnsavedChanges"
      | "currentPage"
    >();
  });

  test("TaxonomyEditorContext has literal currentPage", () => {
    expectTypeOf<TaxonomyEditorContext["currentPage"]>().toEqualTypeOf<"taxonomyEditor">();
  });
});
