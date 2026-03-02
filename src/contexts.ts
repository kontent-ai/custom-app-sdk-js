import type { CustomAppContextProperties } from "./iframeSchema";

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

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

const itemListingContextProperties = [
  ...sharedContextProperties,
  "languageId",
  "itemListingFilter",
  "itemListingSelection",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const otherContextProperties = [
  ...sharedContextProperties,
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const contentTypeListingContextProperties = [
  ...sharedContextProperties,
  "contentModelListingSelection",
  "contentModelListingFilter",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const contentTypeEditorContextProperties = [
  ...sharedContextProperties,
  "contentTypeId",
  "hasUnsavedChanges",
  "validationErrors",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const snippetListingContextProperties = [
  ...sharedContextProperties,
  "contentModelListingSelection",
  "contentModelListingFilter",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const snippetEditorContextProperties = [
  ...sharedContextProperties,
  "snippetId",
  "hasUnsavedChanges",
  "validationErrors",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const taxonomyListingContextProperties = [
  ...sharedContextProperties,
  "contentModelListingSelection",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const taxonomyEditorContextProperties = [
  ...sharedContextProperties,
  "taxonomyGroupId",
  "hasUnsavedChanges",
  "currentPage",
] as const satisfies ReadonlyArray<keyof CustomAppContextProperties>;

const optionalProperties = ["appConfig"] as const satisfies ReadonlyArray<
  keyof CustomAppContextProperties
>;

const isRequiredProperty = (property: keyof CustomAppContextProperties): boolean =>
  !(optionalProperties as readonly string[]).includes(property);

type ContextForPage<
  Props extends ReadonlyArray<keyof CustomAppContextProperties>,
  Page extends NonNullable<CustomAppContextProperties["currentPage"]>,
> = MakeOptional<
  Required<Pick<CustomAppContextProperties, Props[number]>>,
  (typeof optionalProperties)[number]
> & { readonly currentPage: Page };

export type ItemEditorContext = ContextForPage<typeof itemEditorContextProperties, "itemEditor">;
export type ItemListingContext = ContextForPage<
  typeof itemListingContextProperties,
  "contentInventory"
>;
export type OtherContext = ContextForPage<typeof otherContextProperties, "other">;
export type ContentTypeListingContext = ContextForPage<
  typeof contentTypeListingContextProperties,
  "contentTypeListing"
>;
export type ContentTypeEditorContext = ContextForPage<
  typeof contentTypeEditorContextProperties,
  "contentTypeEditor"
>;
export type SnippetListingContext = ContextForPage<
  typeof snippetListingContextProperties,
  "snippetListing"
>;
export type SnippetEditorContext = ContextForPage<
  typeof snippetEditorContextProperties,
  "snippetEditor"
>;
export type TaxonomyListingContext = ContextForPage<
  typeof taxonomyListingContextProperties,
  "taxonomyListing"
>;
export type TaxonomyEditorContext = ContextForPage<
  typeof taxonomyEditorContextProperties,
  "taxonomyEditor"
>;

export type Context =
  | ItemEditorContext
  | ItemListingContext
  | OtherContext
  | ContentTypeListingContext
  | ContentTypeEditorContext
  | SnippetListingContext
  | SnippetEditorContext
  | TaxonomyListingContext
  | TaxonomyEditorContext;

const createContextGuard =
  <
    const Props extends ReadonlyArray<keyof CustomAppContextProperties>,
    Page extends NonNullable<CustomAppContextProperties["currentPage"]>,
  >(
    properties: Props,
    page: Page,
  ) =>
  (context: CustomAppContextProperties): context is ContextForPage<Props, Page> =>
    context.currentPage === page &&
    properties
      .filter(isRequiredProperty)
      .every((property) => property in context && context[property] !== undefined);

export const isItemEditorContext = createContextGuard(itemEditorContextProperties, "itemEditor");
export const isItemListingContext = createContextGuard(
  itemListingContextProperties,
  "contentInventory",
);
export const isOtherContext = createContextGuard(otherContextProperties, "other");
export const isContentTypeListingContext = createContextGuard(
  contentTypeListingContextProperties,
  "contentTypeListing",
);
export const isContentTypeEditorContext = createContextGuard(
  contentTypeEditorContextProperties,
  "contentTypeEditor",
);
export const isSnippetListingContext = createContextGuard(
  snippetListingContextProperties,
  "snippetListing",
);
export const isSnippetEditorContext = createContextGuard(
  snippetEditorContextProperties,
  "snippetEditor",
);
export const isTaxonomyListingContext = createContextGuard(
  taxonomyListingContextProperties,
  "taxonomyListing",
);
export const isTaxonomyEditorContext = createContextGuard(
  taxonomyEditorContextProperties,
  "taxonomyEditor",
);

const contextGuards = [
  isItemEditorContext,
  isItemListingContext,
  isOtherContext,
  isContentTypeListingContext,
  isContentTypeEditorContext,
  isSnippetListingContext,
  isSnippetEditorContext,
  isTaxonomyListingContext,
  isTaxonomyEditorContext,
] as const;

export const isContext = (context: CustomAppContextProperties): context is Context =>
  contextGuards.some((guard) => guard(context));

const contextPropertiesByPage: Readonly<
  Record<
    NonNullable<CustomAppContextProperties["currentPage"]>,
    ReadonlyArray<keyof CustomAppContextProperties>
  >
> = {
  itemEditor: itemEditorContextProperties,
  contentInventory: itemListingContextProperties,
  other: otherContextProperties,
  contentTypeListing: contentTypeListingContextProperties,
  contentTypeEditor: contentTypeEditorContextProperties,
  snippetListing: snippetListingContextProperties,
  snippetEditor: snippetEditorContextProperties,
  taxonomyListing: taxonomyListingContextProperties,
  taxonomyEditor: taxonomyEditorContextProperties,
};

export const getContextPropertiesForPage = (
  currentPage: Context["currentPage"] | undefined,
): ReadonlyArray<keyof CustomAppContextProperties> =>
  currentPage !== undefined ? contextPropertiesByPage[currentPage] : [];
