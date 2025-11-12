import type { CustomAppContextProperties } from "./iframeSchema";

const sharedContextProperties = [
  "path",
  "pageTitle",
  "environmentId",
  "userId",
  "userEmail",
  "userRoles",
  "appConfig",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const itemEditorContextProperties = [
  ...sharedContextProperties,
  "contentItemId",
  "languageId",
  "validationErrors",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const optionalProperties: ReadonlyArray<keyof CustomAppContextProperties> = [
  "appConfig",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

type RawItemEditorContext = Pick<
  CustomAppContextProperties,
  (typeof itemEditorContextProperties)[number]
>;

export type ItemEditorContext = Required<
  WithSpecificPage<CustomAppContextProperties, "itemEditor">
>;

export const isItemEditorContext = (
  context: RawItemEditorContext,
): context is ItemEditorContext => {
  return (
    context.currentPage === "itemEditor" &&
    itemEditorContextProperties
      .filter((property) => !optionalProperties.includes(property))
      .every((property) => property in context && context[property] !== undefined)
  );
};

const itemListingContextProperties = [
  ...sharedContextProperties,
  "languageId",
  "itemListingFilter",
  "itemListingSelection",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

type RawItemListingContext = Pick<
  CustomAppContextProperties,
  (typeof itemListingContextProperties)[number]
>;

export type ItemListingContext = Required<
  WithSpecificPage<CustomAppContextProperties, "contentInventory">
>;

export const isItemListingContext = (
  context: RawItemListingContext,
): context is ItemListingContext => {
  return (
    context.currentPage === "contentInventory" &&
    itemListingContextProperties
      .filter((property) => !optionalProperties.includes(property))
      .every((property) => property in context && context[property] !== undefined)
  );
};

const otherContextProperties = [
  ...sharedContextProperties,
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

type RawOtherContext = Pick<CustomAppContextProperties, (typeof otherContextProperties)[number]>;

export type OtherContext = Required<WithSpecificPage<CustomAppContextProperties, "other">>;

export const isOtherContext = (context: RawOtherContext): context is OtherContext => {
  return (
    context.currentPage === "other" &&
    otherContextProperties
      .filter((property) => !optionalProperties.includes(property))
      .every((property) => property in context && context[property] !== undefined)
  );
};

export type Context = ItemEditorContext | ItemListingContext | OtherContext;

type WithSpecificPage<
  T extends CustomAppContextProperties,
  Page extends Context["currentPage"],
> = T & { readonly currentPage: Page };

export const getContextPropertiesForPage = (
  currentPage: Context["currentPage"] | undefined,
): ReadonlyArray<keyof CustomAppContextProperties> => {
  switch (currentPage) {
    case "itemEditor":
      return itemEditorContextProperties;
    case "contentInventory":
      return itemListingContextProperties;
    case "other":
      return otherContextProperties;
    case undefined:
      return [];
  }
};
