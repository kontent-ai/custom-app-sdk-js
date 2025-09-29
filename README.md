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
npm install @kontent-ai/custom-app-sdk
```

> [!IMPORTANT]  
> The SDK attaches event listeners to communicate with the Kontent.ai app. Make sure to include the SDK only in the browser environment.

## Usage example

```typescript
import { getCustomAppContext, CustomAppContext } from "@kontent-ai/custom-app-sdk";

const response: CustomAppContext = await getCustomAppContext();

if (response.isError) {
  console.error({ errorCode: response.code, description: response.description});
} else {
  console.log({ config: response.config, context: response.context });
}
```

## API Reference

### getCustomAppContext

Use the `getCustomAppContext` function to retrieve the context of the custom app. The function takes no arguments and returns a promise with a value of an object of type `CustomAppContext`.

#### CustomAppContext

`CustomAppContext` is a discriminated union type that can be in one of two states:

##### Success Response (`isError: false`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `false`                | Indicates the request was successful                                         |
| `context`     | object                 | Contains data provided by the Kontent.ai application                        |
| `config`      | unknown \| undefined   | Contains JSON object specified in the custom app configuration              |

##### Error Response (`isError: true`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `true`                 | Indicates an error occurred                                                  |
| `code`        | ErrorCode enum         | The code of the error message                                                |
| `description` | string                 | The description of the error message                                         |

#### Config 
The `config` object is a JSON object that can be defined within the Custom App configuration under Environment settings in the Kontent.ai app.

#### Context 
The `context` object contains data provided by the Kontent.ai application that you can leverage in your custom app. 

| Property        | Type              | Description                                                              |
|-----------------|-------------------|--------------------------------------------------------------------------|
| `environmentId` | UUID              | The environment's ID                                                     |
| `userId`        | string            | The current user's ID                                                    |
| `userEmail`     | string            | The current user's email                                                 |
| `userRoles`     | Array of UserRole | An array containing all the roles of the current user in the environment |

#### UserRole 

| Property   | Type   | Description                                                          |
|------------|--------|----------------------------------------------------------------------|
| `id`       | UUID   | The role's ID                                                        |
| `codename` | string | The role's codename - applicable only for the _Project manager_ role |

### getPageContext

Use the `getPageContext` function to retrieve contextual information about the current page within the Kontent.ai application. The function automatically detects the current page type and returns the appropriate context with all relevant properties for that page type.

#### Parameters

None - the function takes no parameters and automatically determines what properties to fetch based on the current page.

#### Return Type

The function returns a promise that resolves to a discriminated union type with two possible states:

##### Success Response (`isError: false`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `false`                | Indicates the request was successful                                         |
| `context`     | `PageContext`          | A discriminated union of page-specific context objects                      |

##### Error Response (`isError: true`)

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | `true`                 | Indicates an error occurred                                                  |
| `code`        | ErrorCode enum         | The code of the error message                                                |
| `description` | string                 | The description of the error message                                         |

#### PageContext

`PageContext` is a discriminated union type based on the `currentPage` property. Each page type includes only the relevant properties for that specific page:

##### Item Editor Page Context

When `currentPage` is `"itemEditor"`, the context includes:

| Property                | Type                                  | Description                                                          |
|-------------------------|---------------------------------------|----------------------------------------------------------------------|
| `currentPage`           | `"itemEditor"`                       | Identifies this as an item editor page                              |
| `contentItemId`         | UUID                                | The ID of the content item being edited                             |
| `languageId`            | UUID                                | The ID of the current language                                      |
| `path`                  | string                                | The current path within the Kontent.ai application                  |
| `pageTitle`             | string                                | The title of the current page                                       |
| `validationErrors`      | Record<string, string[]>              | A record of validation errors for content item fields               |

##### Other Page Context

When `currentPage` is `"other"`, the context includes:

| Property                | Type                                  | Description                                                          |
|-------------------------|---------------------------------------|----------------------------------------------------------------------|
| `currentPage`           | `"other"`                            | Identifies this as any other page type                              |
| `path`                  | string                                | The current path within the Kontent.ai application                  |
| `pageTitle`             | string                                | The title of the current page                                       |

#### Usage Example

```typescript
import { getPageContext, PageContext } from "@kontent-ai/custom-app-sdk";

// Get page context - automatically fetches appropriate properties based on current page
const response = await getPageContext();

if (response.isError) {
  console.error({ errorCode: response.code, description: response.description });
} else {
  // TypeScript will narrow the type based on currentPage
  if (response.context.currentPage === "itemEditor") {
    console.log({
      contentItemId: response.context.contentItemId,
      languageId: response.context.languageId,
      validationErrors: response.context.validationErrors
    });
  } else {
    console.log({
      path: response.context.path,
      pageTitle: response.context.pageTitle
    });
  }
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
