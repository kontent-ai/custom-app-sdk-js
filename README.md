# Kontent.ai Custom app SDK JS

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![Discord][discussion-shield]][discussion-url]

## About The Project

A JavaScript SDK for communicating with the Kontent.ai Custom App API.
It facilitates the communication between the Kontent.ai app and the custom app providing access to the configuration and context data.

## Getting Started

### Installation

```sh
pnpm add @kontent-ai/custom-app-sdk
# or
npm install @kontent-ai/custom-app-sdk
```

> [!IMPORTANT]  
> The SDK attaches event listeners to communicate with the Kontent.ai app. Make sure to include the SDK only in the browser environment.

## Usage example

```typescript
import { getCustomAppContext, CustomAppContext } from "@kontent-ai/custom-app-sdk";

const response = await getCustomAppContext();

if (response.isError) {
  console.error({ errorCode: response.code, description: response.description });
} else {
  // TypeScript will narrow the type based on currentPage
  switch (response.context.currentPage) {
    case "itemEditor":
      console.log({
        contentItemId: response.context.contentItemId,
        languageId: response.context.languageId,
        validationErrors: response.context.validationErrors
      });
      break;
    case "contentInventory":
      console.log({
        languageId: response.context.languageId,
        itemListingFilter: response.context.itemListingFilter,
        itemListingSelection: response.context.itemListingSelection
      });
      break;
  }
}
```

## API Reference

### getCustomAppContext

Retrieves the context of the custom app. The function takes no arguments and automatically detects the current page type, returning the appropriate context with all relevant properties for that page.

#### Return Type

Returns a promise that resolves to a discriminated union type with two possible states:

##### Success Response (`isError: false`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `false`                | Indicates the request was successful                                         |
| `context`     | `CustomAppContext`     | A discriminated union of page-specific context objects                      |

##### Error Response (`isError: true`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `true`                 | Indicates an error occurred                                                  |
| `code`        | ErrorCode enum         | The code of the error message                                                |
| `description` | string                 | The description of the error message                                         |

#### CustomAppContext

`CustomAppContext` is a discriminated union type based on the `currentPage` property. Each page type includes only the relevant properties for that specific page:

##### Shared Properties

All context types include the following shared properties:

| Property                | Type                                  | Description                                                          |
|-------------------------|---------------------------------------|----------------------------------------------------------------------|
| `environmentId`         | UUID                                  | The environment's ID                                                 |
| `userId`                | string                                | The current user's ID                                                |
| `userEmail`             | string                                | The current user's email                                             |
| `userRoles`             | Array\<UserRole\>                     | An array containing all the roles of the current user in the environment |
| `path`                  | string                                | The current path within the Kontent.ai application                  |
| `pageTitle`             | string                                | The title of the current page                                       |
| `appConfig`             | unknown \| undefined                  | JSON object specified in the custom app configuration               |

##### Item Editor Page Context

When `currentPage` is `"itemEditor"`, the context includes the shared properties above plus:

| Property                | Type                                  | Description                                                          |
|-------------------------|---------------------------------------|----------------------------------------------------------------------|
| `currentPage`           | `"itemEditor"`                       | Identifies this as an item editor page                              |
| `contentItemId`         | UUID                                  | The ID of the content item being edited                             |
| `languageId`            | UUID                                  | The ID of the current language                                      |
| `validationErrors`      | Record<string, Array<string>>              | A record of validation errors for content item fields               |

##### Content Inventory Page Context

When `currentPage` is `"contentInventory"`, the context includes the shared properties above plus:

| Property                | Type                                  | Description                                                          |
|-------------------------|---------------------------------------|----------------------------------------------------------------------|
| `currentPage`           | `"contentInventory"`                 | Identifies this as a content inventory (item listing) page          |
| `languageId`            | UUID                                  | The ID of the current language                                      |
| `itemListingFilter`     | SerializedListingFilter               | The current filter settings applied to the content item listing     |
| `itemListingSelection`  | ItemListingSelection                  | The current selection state of items in the listing                 |

##### Other Page Context

When `currentPage` is `"other"`, the context includes the shared properties above plus:

| Property                | Type                                  | Description                                                          |
|-------------------------|---------------------------------------|----------------------------------------------------------------------|
| `currentPage`           | `"other"`                            | Identifies this as any other page type                              |

#### UserRole

| Property   | Type   | Description                                                          |
|------------|--------|----------------------------------------------------------------------|
| `id`       | UUID   | The role's ID                                                        |
| `codename` | string | The role's codename - applicable only for the _Project manager_ role |

#### SerializedListingFilter

The filter settings applied to the content item listing.

| Property                    | Type                                                | Description                                                  |
|-----------------------------|-----------------------------------------------------|--------------------------------------------------------------|
| `selectedCollections`       | Array\<string\>                                     | IDs of collections selected in the filter                    |
| `selectedContentItemStatus` | Array\<VariantCompletionStatus\>                    | Selected content item workflow status states                 |
| `selectedContentTypes`      | Array\<string\>                                     | IDs of content types selected in the filter                  |
| `selectedContributors`      | Array\<string\>                                     | IDs of contributors selected in the filter                   |
| `selectedPublishingStates`  | Array\<PublishingState\>                            | Selected publishing states                                   |
| `selectedSpaces`            | Array\<string\>                                     | IDs of spaces selected in the filter                         |
| `selectedTaxonomies`        | Record\<string, Array\<string\>\>                   | Selected taxonomy terms grouped by taxonomy ID               |
| `selectedWorkflows`         | Record\<string, Array\<string\>\>                   | Selected workflow steps grouped by workflow ID               |
| `searchPhrase`              | string                                              | The search phrase entered by the user                        |
| `searchScope`               | Array\<string\>                                     | The scope of the search (e.g., content item names, elements) |

##### VariantCompletionStatus

An enum representing the possible workflow completion status states for content item variants.

| Value            | Description                                    |
|------------------|------------------------------------------------|
| `"unfinished"`   | Content item variant is unfinished             |
| `"ready"`        | Content item variant is ready                  |
| `"notTranslated"`| Content item variant is not translated         |
| `"allDone"`      | Content item variant is all done               |

##### PublishingState

An enum representing the possible publishing states for content items.

| Value          | Description                                       |
|----------------|---------------------------------------------------|
| `"published"`  | Content item is published                         |
| `"unpublished"`| Content item is unpublished                       |
| `"none"`       | Content item has no publishing state              |

#### ItemListingSelection

The current selection state of items in the content inventory listing.

| Property              | Type           | Description                                                                      |
|-----------------------|----------------|----------------------------------------------------------------------------------|
| `selectAll`           | boolean        | Whether the "select all" option is active                                        |
| `selectedItemIds`     | Array\<UUID\>  | IDs of content items that are selected (when `selectAll` is false, these are the selected items; when `selectAll` is true, these are exceptions to the selection) |
| `unselectedItemIds`   | Array\<UUID\>  | IDs of content items that are explicitly unselected (used when `selectAll` is true to exclude specific items) |

### observeCustomAppContext

Subscribes to context changes and receives notifications when the context is updated. The function takes a callback that will be invoked whenever the context changes.

#### Parameters

| Parameter  | Type                        | Description                                           |
|------------|-----------------------------|-------------------------------------------------------|
| `callback` | `(context: CustomAppContext) => void` | Function to be called when the context changes |

#### Return Type

Returns a promise that resolves to a discriminated union type with two possible states:

##### Success Response (`isError: false`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `false`                | Indicates the request was successful                                         |
| `context`     | `CustomAppContext`     | The initial context value                                                    |
| `unsubscribe` | `() => Promise<void>`  | Function to call to stop receiving context updates                          |

##### Error Response (`isError: true`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `true`                 | Indicates an error occurred                                                  |
| `code`        | ErrorCode enum         | The code of the error message                                                |
| `description` | string                 | The description of the error message                                         |

#### Usage Example

```typescript
import { observeCustomAppContext } from "@kontent-ai/custom-app-sdk";

const response = await observeCustomAppContext((context) => {
  console.log("Context updated:", context);
});

if (response.isError) {
  console.error({ errorCode: response.code, description: response.description });
} else {
  console.log("Initial context:", response.context);

  // Later, when you want to stop observing
  await response.unsubscribe();
}
```

### setPopupSize

Sets the size of the popup window when the custom app is displayed in a popup.

#### Parameters

| Parameter | Type                 | Description                                      |
|-----------|----------------------|--------------------------------------------------|
| `width`   | `PopupSizeDimension` | The desired width of the popup                   |
| `height`  | `PopupSizeDimension` | The desired height of the popup                  |

#### PopupSizeDimension

A discriminated union type for specifying dimensions in either pixels or percentages:

```typescript
type PopupSizeDimension =
  | { unit: "px"; value: number }
  | { unit: "%"; value: number };
```

#### Return Type

Returns a promise that resolves to a discriminated union type with two possible states:

##### Success Response (`isError: false`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `false`                | Indicates the request was successful                                         |

##### Error Response (`isError: true`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `true`                 | Indicates an error occurred                                                  |
| `code`        | ErrorCode enum         | The code of the error message                                                |
| `description` | string                 | The description of the error message                                         |

#### Usage Example

```typescript
import { setPopupSize } from "@kontent-ai/custom-app-sdk";

const response = await setPopupSize(
  { unit: "px", value: 800 },
  { unit: "%", value: 90 }
);

if (response.isError) {
  console.error({ errorCode: response.code, description: response.description });
}
```

## Contributing

For Contributing please see  <a href="./CONTRIBUTING.md">`CONTRIBUTING.md`</a> for more information.



## License

Distributed under the MIT License. See [`LICENSE.md`](./LICENSE.md) for more information.


[contributors-shield]: https://img.shields.io/github/contributors/kontent-ai/custom-app-sdk-js.svg?style=for-the-badge
[contributors-url]: https://github.com/kontent-ai/custom-app-sdk-js/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kontent-ai/custom-app-sdk-js.svg?style=for-the-badge
[forks-url]: https://github.com/kontent-ai/custom-app-sdk-js/network/members
[stars-shield]: https://img.shields.io/github/stars/kontent-ai/custom-app-sdk-js.svg?style=for-the-badge
[stars-url]: https://github.com/kontent-ai/custom-app-sdk-js/stargazers
[issues-shield]: https://img.shields.io/github/issues/kontent-ai/custom-app-sdk-js.svg?style=for-the-badge
[issues-url]:https://github.com/kontent-ai/custom-app-sdk-js/issues
[license-shield]: https://img.shields.io/github/license/kontent-ai/custom-app-sdk-js.svg?style=for-the-badge
[license-url]:https://github.com/kontent-ai/custom-app-sdk-js/blob/master/LICENSE.md
[discussion-shield]: https://img.shields.io/discord/821885171984891914?color=%237289DA&label=Kontent%2Eai%20Discord&logo=discord&style=for-the-badge
[discussion-url]: https://discord.com/invite/SKCxwPtevJ
