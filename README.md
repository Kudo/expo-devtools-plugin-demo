# expo-devtools-plugin-demo

This is a proof-of-concept project that demonstrates how to use Expo CLI devtools plugins with [react-native-apollo-devtools](https://github.com/razorpay/react-native-apollo-devtools).

## Motivation

With the [upcoming deprecation of Flipper](https://github.com/react-native-community/discussions-and-proposals/pull/641), there is currently no alternative solution for Flipper plugins. However, if we break down Flipper plugins, we can see that a Flipper plugin is essentially a UI interface with a message bus to send messages between the UI interface and the app. This project aims to show that it is possible to implement a similar solution on top of the Expo infrastructure, as a replacement for the [Flipper Apollo Plugin](https://github.com/razorpay/react-native-apollo-devtools).

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
