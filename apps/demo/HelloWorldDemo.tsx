import { useEffect } from "react";
import { createStore } from "tinybase";
import { Button, Text, View } from "react-native";
import { useValue, Provider } from "tinybase/lib/ui-react";
import { connectPluginFromAppAsync } from "expo/devtools";

// Async wrapper
let _client = connectPluginFromAppAsync();
async function getClientAsync() {
  return await _client;
}

// Wrapper around the client to make it async
async function sendMessageAsync(message: string, data: any) {
  const client = await getClientAsync();
  client.sendMessage(message, data);
}

// Initialize the Tinybase store
const store = createStore();
store.setValue("counter", 0);

// Listen for changes to the counter value, send them to the devtools
store.addValueListener("counter", (_valueId, newVal, oldValue) => {
  sendMessageAsync("update", {
    message: `Value changed from ${oldValue} to ${newVal}`,
  });
});

function Main() {
  const count = useValue("counter");

  useEffect(() => {
    (async function () {
      const client = await getClientAsync();

      client.addMessageListener("ping", (data) => {
        alert(`ping from devtools: ${JSON.stringify(data)}`);
        client.sendMessage("pong", { from: "app" });
      });

      client.addMessageListener("pong", (data) => {
        alert(`pong from devtools: ${JSON.stringify(data)}`);
      });
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Counter: {count}</Text>
      <Button
        title="Increment"
        onPress={() =>
          store.setValue("counter", parseInt(count.toString(), 10) + 1)
        }
      />

      <Button
        title="Ping"
        onPress={() => sendMessageAsync("ping", { from: "app/button" })}
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
