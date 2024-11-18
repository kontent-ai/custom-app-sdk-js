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
import { initCustomApp } from "@kontent-ai/custom-app-sdk-js";

const { context, config } = await initCustomApp();
```

### initCustomApp function

Use the `initCustomApp` function to initialize the custom app. The function takes no arguments and returns a promise with a value of an object containing two properties: `context` and `config`.

### Config object
The `config` object is a JSON structure that can be defined within the Custom App configuration under Environment settings in the Kontent.ai app.

### Context object
The `context` object contains data provided by the Kontent.ai application that you can leverage in your custom app. 

| Property        | Type                       | Description                                                              |
|-----------------|----------------------------|--------------------------------------------------------------------------|
| `environmentId` | UUID                       | The environment's ID                                                     |
| `userId`        | string                     | The current user's ID                                                    |
| `userEmail`     | string                     | The current user's email                                                 |
| `userRoles`     | Array of CustomAppUserRole | An array containing all the roles of the current user in the environment |

#### CustomAppUserRole object

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
