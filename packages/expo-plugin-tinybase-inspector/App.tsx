import { useEffect } from "react";
import { createStore, ValueOrUndefined } from "tinybase/debug";
import {
  useCreateStore,
  useTables,
  useValues,
  Provider,
  useAddRowCallback,
  useSetValueCallback,
} from "tinybase/debug/ui-react";
import { StoreInspector } from "tinybase/debug/ui-react-dom";

// @ts-ignore
import { connectPluginFromDevToolsAsync } from "expo/devtools";

(async function () {
  const client = await connectPluginFromDevToolsAsync();
  client.sendMessage("ping", { from: "expo-plugin-tinybase-inspector" });
})();

export default function App() {
  useEffect(() => {
    async function init() {
      const client = await connectPluginFromDevToolsAsync();
      // Ping pong
      client.addMessageListener("pong", (data) => {
        console.log("receiving pong", data);
      });

      // Set some message data
      client.addMessageListener("update", (data) => {
        console.log("receiving update", data);
      });
    }
    init();
  }, []);
  const store = useCreateStore(() => {
    // Create the TinyBase Store and initialize the Store's data
    return createStore()
      .setValue("counter", 0)
      .setRow("pets", "0", { name: "fido", species: "dog" })
      .setTable("species", {
        dog: { price: 5 },
        cat: { price: 4 },
        fish: { price: 2 },
        worm: { price: 1 },
        parrot: { price: 3 },
      });
  });

  return (
    <Provider store={store}>
      <Pane />
      <Buttons />
      <Details label="Values" hook={useValues} />
      <Details label="Tables" hook={useTables} />
    </Provider>
  );
}

const Pane = () => <StoreInspector />;

// Convenience function for generating a random integer
const getRandom = (max = 100) => Math.floor(Math.random() * max);

const Buttons = () => {
  // Attach events to the buttons to mutate the data in the TinyBase Store
  const handleCount = useSetValueCallback(
    "counter",
    () => (value: ValueOrUndefined) => ((value ?? 0) as number) + 1
  );
  const handleRandom = useSetValueCallback("random", () => getRandom());
  const handleAddPet = useAddRowCallback("pets", (_, store) => ({
    name: ["fido", "felix", "bubbles", "lowly", "polly"][getRandom(5)],
    species: store.getRowIds("species")[getRandom(5)],
  }));

  return (
    <div id="buttons">
      <button onClick={handleCount}>Increment number</button>
      <button onClick={handleRandom}>Random number</button>
      <button onClick={handleAddPet}>Add a pet</button>
    </div>
  );
};

const Details = ({ label, hook }: { label: string; hook: () => any }) => {
  return (
    <details open>
      <summary>{label}</summary>
      <pre>{JSON.stringify(hook(), null, 2)}</pre>
    </details>
  );
};
