# Kontent.ai Custom app SDK JS

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

[![Discord][discussion-shield]][discussion-url]

<!-- ABOUT THE PROJECT -->
## About The Project

The Kontent.ai Custom App SDK enhances the integration of your custom app with the Kontent.ai platform.
<!-- GETTING STARTED -->
## Getting Started
### Installation
   ```sh
      npm install @kontent-ai/custom-app-sdk-js
   ```

<!-- USAGE EXAMPLES -->
## Usage

```javascript
import { getCustomAppContext, CustomAppContext } from "@kontent-ai/custom-app-sdk-js";

const response: CustomAppContext = await getCustomAppContext();

if (response.isError) {
  console.error({ errorCode: response.code, description: response.description});
} else {
  console.log({ config: response.config, context: response.context });
}
```

### getCustomAppContext function

Use the `getCustomAppContext` function to retrieve context of the custom app. The function takes no arguments and returns a promise with a value of an object of type `CustomAppContext`.

### CustomAppContext

| Property      | Type                   | Description                                                                  |
|---------------|------------------------|------------------------------------------------------------------------------|
| `isError`     | boolean                | Determines if there was an error while getting the context of the custom app |
| `code`        | ErrorCode enum \| null | The code of the error message                                                |
| `description` | string \| null         | The description of the error message                                         |
| `context`     | object \| null         | Contains data provided by the Kontent.ai application                         |
| `config`      | object \| null         | Contains JSON object specified in the custom app configuration               |

### Config object
The `config` object is a JSON object that can be defined within the Custom App configuration under Environment settings in the Kontent.ai app.

### Context object
The `context` object contains data provided by the Kontent.ai application that you can leverage in your custom app. 

| Property        | Type              | Description                                                              |
|-----------------|-------------------|--------------------------------------------------------------------------|
| `environmentId` | UUID              | The environment's ID                                                     |
| `userId`        | string            | The current user's ID                                                    |
| `userEmail`     | string            | The current user's email                                                 |
| `userRoles`     | Array of UserRole | An array containing all the roles of the current user in the environment |

#### UserRole object

| Property   | Type   | Description                                                          |
|------------|--------|----------------------------------------------------------------------|
| `id`       | UUID   | The role's ID                                                        |
| `codename` | string | The role's codename - applicable only for the _Project manager_ role |

<!-- CONTRIBUTING -->
## Contributing

For Contributing please see  <a href="./CONTRIBUTING.md">`CONTRIBUTING.md`</a> for more information.



<!-- LICENSE -->
## License

Distributed under the MIT License. See [`LICENSE.md`](./LICENSE.md) for more information.


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://github.com/kontent-ai/Home/wiki/Checklist-for-publishing-a-new-OS-project#badges-->
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
