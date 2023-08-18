# expo-devtools-plugin-demo

This is a proof-of-concept project that demonstrates how to use Expo CLI devtools plugins with [react-native-apollo-devtools](https://github.com/razorpay/react-native-apollo-devtools).

## Motivation

With the [upcoming deprecation of Flipper](https://github.com/react-native-community/discussions-and-proposals/pull/641), there is currently no alternative solution for Flipper plugins. However, if we break down Flipper plugins, we can see that a Flipper plugin is essentially a UI with a message bus to send messages between the UI and the app. This project aims to show that it is possible to implement a similar solution on top of the Expo infrastructure, as a replacement for the [Flipper Apollo Plugin](https://github.com/razorpay/react-native-apollo-devtools).

## Demo video

https://github.com/Kudo/expo-devtools-plugin-demo/assets/46429/aba4c84a-798c-4031-8679-a81f64119437

## Components

1. **App**: This is an Expo app that includes some Apollo Client requests.

2. [**Expo Patches**](https://github.com/Kudo/expo-devtools-plugin-demo/tree/main/patches): Before adding official devtools plugin support, we would like to get feedback from the community. To achieve this, we are using patch-package to add the devtools plugin into Expo.

3. [**Modified `react-native-apollo-devtools`**](https://github.com/Kudo/react-native-apollo-devtools/tree/%40kudo/devtools-plugin): This is a fork of react-native-apollo-devtools that removes Flipper dependencies and adds the [`expo-plugin-react-native-apollo-devtools`](https://github.com/Kudo/react-native-apollo-devtools/tree/%40kudo/devtools-plugin/packages/expo-plugin-react-native-apollo-devtools) - a web-based UI interface that is modified from the original Flipper-based UI.

## Try it out

To try out the devtools plugin on your own app, follow these steps:

1. Apply the Expo patches: https://github.com/Kudo/expo-devtools-plugin-demo/commit/3304e4bfae178eb8ae27efbd263f76ee5f25737a

2. Add `expo-plugin-react-native-apollo-devtools`: https://github.com/Kudo/expo-devtools-plugin-demo/commit/3cc450415193fa01d2c808daae21a22ab1848f35

That's it! With these changes, you should be able to use the devtools plugin with your own Expo app.

## A journey to write a custom devtools plugin

### ➡️ Scratch a new devtools plugin package (`expo-plugin-helloworld` in this example)

1. Create a web based UI by Expo

    ```sh
    $ yarn create expo expo-plugin-helloworld
    $ cd expo-plugin-helloworld
    $ npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config
    ```

2. Update **package.json**

    - Move all `dependencies` into `devDependencies`, given that we will `expo export:web` later. Most dependencies are not necessary for the app.
    - Add `homepage` field to define the exported web base URL: `"homepage": "/_expo/plugins/expo-plugin-helloworld"`. Note that URL should be `/_expo/plugins/{pluginName}`.

3. Use the [`connectPluginFromDevToolsAsync` API](#devtoolspluginclient-api) to send/receive messages

    ```ts
    import { connectPluginFromDevToolsAsync } from 'expo/devtools';
    
    const client = await connectPluginFromDevToolsAsync();
    
    client.sendMessage('ping', { from: 'expo-plugin-helloworld' });
    client.addMessageListener('pong', (data) => {
      console.log('receiving pong', data);
    });
    ```

4. Export web assets

    ```sh
    $ npx expo export:web
    $ mv web-build dist
    ```

5. Create **expo-module.config.json** for autolinking

    ```json
    {
      "name": "expo-plugin-helloworld",
      "platforms": ["devtools"],
      "devtools": {
        "webpageRoot": "dist"
      }
    }
    ```

    or you could also combine the plugin with a debug build only native module. [Learn more for writing native modules](https://docs.expo.dev/modules/overview/)

    ```json
    {
      "name": "expo-plugin-helloworld",
      "platforms": ["devtools", "ios"],
      "devtools": {
        "webpageRoot": "dist"
      },
      "ios": {
        "modules": [
          // ...
        ],
        "debugOnly": true
      }
    }
    ```

6. Now you could either add the `expo-plugin-helloworld` in your app or publish the package on npm for your to install.

### ➡️ Update your app to communicate with the `expo-plugin-helloworld` plugin

1. Use the [`connectPluginFromAppAsync` API](#devtoolspluginclient-api) to send/receive messages

    ```ts
    import { connectPluginFromAppAsync } from 'expo/devtools';
    
    if (__DEV__) {
      const client = await connectPluginFromAppAsync();
    
      client.addMessageListener('ping', () => {
        client.sendMessage('pong', { from: 'app' });
      });
    }
    ```

## `DevToolsPluginClient` API

The `expo/devtools` exports APIs for the message communication between the plugin and the app. You can check the API declarations here. Please note that the APIs are temporary and may change from official releases.

```ts
declare module 'expo/devtools' {
  import { EventSubscription } from 'fbemitter';

  /**
   * This class is used to communicate with the Expo CLI DevTools plugin.
   */
  export class DevToolsPluginClient {
    close(): void;
    sendMessage(method: string, params: any): void;
    addMessageListener(method: string, listener: (params: any) => void): EventSubscription;
    addMessageListenerOnce(method: string, listener: (params: any) => void): void;
    isConnected(): boolean;
  }

  /** For DevTools Plugin to get a `DevToolsPluginClient` */
  export function connectPluginFromDevToolsAsync(): Promise<DevToolsPluginClient>;

  /** For App to get a `DevToolsPluginClient` */
  export function connectPluginFromAppAsync(): Promise<DevToolsPluginClient>;
}
```
