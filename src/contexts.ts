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

export const itemEditorContextProperties = [
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

export const otherContextProperties = [
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

export type Context = ItemEditorContext | OtherContext;

type WithSpecificPage<
  T extends CustomAppContextProperties,
  Page extends Context["currentPage"],
> = T & { readonly currentPage: Page };
