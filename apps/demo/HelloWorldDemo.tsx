import { useEffect } from 'react';
import { createStore } from 'tinybase';
import { Button, Text, View } from 'react-native';
import { useValue, Provider } from 'tinybase/lib/ui-react';
import { useDevToolsPluginClient } from 'expo/devtools';

// Initialize the Tinybase store
const store = createStore();
store.setValue('counter', 0);

function Main() {
  const count = useValue('counter');
  const client = useDevToolsPluginClient('expo-plugin-helloworld');

  useEffect(() => {
    const subscriptions = [];
    subscriptions.push(
      client?.addMessageListener('ping', (data) => {
        alert(`ping from devtools: ${JSON.stringify(data)}`);
        client?.sendMessage('pong', { from: 'app' });
      })
    );

    subscriptions.push(
      client?.addMessageListener('pong', (data) => {
        alert(`pong from devtools: ${JSON.stringify(data)}`);
      })
    );

    // Listen for changes to the counter value, send them to the devtools
    const listenerId = store.addValueListener('counter', (_valueId, newVal, oldValue) => {
      client?.sendMessage('update', {
        message: `Value changed from ${oldValue} to ${newVal}`,
      });
    });

    return () => {
      store.delListener(listenerId);
      for (const subscription of subscriptions) {
        subscription?.remove();
      }
    };
  }, [client, store]);

  if (!client) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Counter: {count}</Text>
      <Button
        title="Increment"
        onPress={() => store.setValue('counter', parseInt(count.toString(), 10) + 1)}
      />

      <Button title="Ping" onPress={() => client?.sendMessage('ping', { from: 'app/button' })} />
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
