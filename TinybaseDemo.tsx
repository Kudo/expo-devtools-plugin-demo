import { createStore } from "tinybase";
import { Button, Text, View } from "react-native";
import { useValue, Provider } from "tinybase/lib/ui-react";

const store = createStore();
store.setValue("counter", 0);

store.addValueListener("counter", (store, valueId, newVal , oldValue) => {
  console.log(`Value ${valueId} changed from ${oldValue} to ${newVal}`)
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