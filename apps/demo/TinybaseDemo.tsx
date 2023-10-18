import { useEffect } from 'react';
import { createStore } from 'tinybase';
import { Button, Text, View } from 'react-native';
import { useValue, Provider } from 'tinybase/lib/ui-react';
import { useDevToolsPluginClient } from 'expo';

const store = createStore().setValue('counter', 0);

/** Silly: sync the full store every time something changes **/

function Main() {
  const count = useValue('counter');
  const client = useDevToolsPluginClient('expo-plugin-tinybase-inspector');

  useEffect(() => {
    const subscriptions = [];

    /* Sync the full store on init */
    client?.sendMessage('@tinybase-inspector/init', store.getJson());

    subscriptions.push(
      client?.addMessageListener('@tinybase-inspector/edit', (data) => {
        store.setJson(data);
      })
    );

    const listenerId = store.addDidFinishTransactionListener(() => {
      client?.sendMessage('@tinybase-inspector/update', store.getJson());
    });

    return () => {
      store.delListener(listenerId);
      for (const subscription of subscriptions) {
        subscription?.remove();
      }
    };
  }, [client, store]);

  if (client == null) {
    return null;
  }

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
