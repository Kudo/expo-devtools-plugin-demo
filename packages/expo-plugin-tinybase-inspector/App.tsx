import { useEffect } from "react";
import { createStore } from "tinybase/debug";
import { Provider } from "tinybase/debug/ui-react";
import { StoreInspector } from "tinybase/debug/ui-react-dom";

// @ts-ignore
import { connectPluginFromDevToolsAsync } from "expo/devtools";

const store = createStore();
const client = connectPluginFromDevToolsAsync();

async function getClientAsync() {
  return await client;
}

async function sendEditsAsync() {
  const client = await getClientAsync();
  client.sendMessage("@tinybase-inspector/edit", store.getJson());
}

let __ignoreStoreUpdates = false;

export default function App() {
  useEffect(() => {
    async function initAsync() {
      const client = await getClientAsync();

      client.addMessageListener("@tinybase-inspector/init", (data) => {
        __ignoreStoreUpdates = true;
        store.setJson(data);
        __ignoreStoreUpdates = false;
      });

      client.addMessageListener("@tinybase-inspector/update", (data) => {
        __ignoreStoreUpdates = true;
        store.setJson(data);
        __ignoreStoreUpdates = false;
      });
    }

    store.addDidFinishTransactionListener(() => {
      if (__ignoreStoreUpdates) {
        return;
      }

      sendEditsAsync();
    });

    initAsync();
  }, []);

  return (
    <Provider store={store}>
      <StoreInspector open position="full" />
    </Provider>
  );
}
