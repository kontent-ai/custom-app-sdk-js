import { type CustomAppPageContextProperties } from "./iframeSchema";

const sharedPageProperties = [
  "path",
  "pageTitle",
] as const satisfies ReadonlyArray<keyof CustomAppPageContextProperties>;

export const itemEditorPageProperties = [
  ...sharedPageProperties,
  "contentItemId",
  "languageId", 
  "validationErrors",
  "currentPage"
] as const satisfies ReadonlyArray<keyof CustomAppPageContextProperties>;

type RawItemEditorPageContext = Pick<CustomAppPageContextProperties, typeof itemEditorPageProperties[number]>;

type ItemEditorPageContext = Required<Pick<WithSpecificPage<CustomAppPageContextProperties, "itemEditor">, typeof itemEditorPageProperties[number]>>;

export const isItemEditorPageContext = (context: RawItemEditorPageContext): context is ItemEditorPageContext => {
  return context.currentPage === "itemEditor" && itemEditorPageProperties.every((property) => property in context && context[property] !== undefined);
};

export const otherPageProperties = [
  ...sharedPageProperties,
  "currentPage"
] as const satisfies ReadonlyArray<keyof CustomAppPageContextProperties>;

type RawOtherPageContext = Pick<CustomAppPageContextProperties, typeof otherPageProperties[number]>;

type OtherPageContext = Required<Pick<WithSpecificPage<CustomAppPageContextProperties, "other">, typeof otherPageProperties[number]>>;

export const isOtherPageContext = (context: RawOtherPageContext): context is OtherPageContext => {
  return context.currentPage === "other" && otherPageProperties.every((property) => property in context && context[property] !== undefined);
};

export type PageContext = ItemEditorPageContext | OtherPageContext;

type WithSpecificPage<T extends CustomAppPageContextProperties, Page extends PageContext["currentPage"]> = T & { readonly currentPage: Page };
