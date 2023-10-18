import { useEffect } from 'react';
import { createStore } from 'tinybase';
import { Button, Text, View } from 'react-native';
import { useValue, Provider } from 'tinybase/lib/ui-react';
import { connectPluginFromAppAsync } from 'expo/devtools';

const store = createStore().setValue('counter', 0);
const client = connectPluginFromAppAsync();

async function getClientAsync() {
  return await client;
}

/** Silly: sync the full store every time something changes **/
async function storeTransactionListener() {
  const client = await getClientAsync();
  client.sendMessage('@tinybase-inspector/update', store.getJson());
}

function Main() {
  const count = useValue('counter');

  useEffect(() => {
    let editListener;

    /* Sync the full store on init */
    (async function () {
      const client = await getClientAsync();
      client.sendMessage('@tinybase-inspector/init', store.getJson());

      editListener = client.addMessageListener('@tinybase-inspector/edit', (data) => {
        store.setJson(data);
      });
    })();

    const listenerId = store.addDidFinishTransactionListener(storeTransactionListener);

    return () => {
      store.delListener(listenerId);
      editListener?.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Counter: {count}</Text>
      <Button
        title="Increment"
        onPress={() => store.setValue('counter', parseInt(count.toString(), 10) + 1)}
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
