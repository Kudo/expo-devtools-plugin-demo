import { createStore } from "tinybase";
import { Button, Text, View } from "react-native";
import { useValue, Provider } from "tinybase/lib/ui-react";
import { connectPluginFromAppAsync } from "expo/devtools";

// Async wrapper
let _client = connectPluginFromAppAsync();
async function getClientAsync() {
  return await _client;
}

// Initial ping
(async function () {
  const client = await getClientAsync();
  client.sendMessage("pong", { from: "app" });
  client.addMessageListener("ping", () => {
    client.sendMessage("pong", { from: "app" });
  });
})();

// Wrapper around the client to make it async
async function sendMessageAsync(message: string) {
  const client = await getClientAsync();
  client.sendMessage("update", { message });
}

// Initialize the Tinybase store
const store = createStore();
store.setValue("counter", 0);

// Listen for changes to the counter value, send them to the devtools
store.addValueListener("counter", (store, valueId, newVal, oldValue) => {
  sendMessageAsync(`Value ${valueId} changed from ${oldValue} to ${newVal}`);
});

function Main() {
  const count = useValue("counter");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Counter: {count}</Text>
      <Button
        title="Increment"
        onPress={() =>
          store.setValue("counter", parseInt(count.toString(), 10) + 1)
        }
      />
    </View>
  );
}

export default function TinybaseDemo() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
