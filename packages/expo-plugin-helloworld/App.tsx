import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useDevToolsPluginClient } from 'expo/devtools';

export default function App() {
  const [message, setMessage] = useState(null);
  const client = useDevToolsPluginClient('expo-plugin-helloworld');

  useEffect(() => {
    const subscriptions = [];
    subscriptions.push(
      client?.addMessageListener('ping', (data) => {
        client?.sendMessage('pong', { from: 'expo-plugin-helloworld' });
        alert(`ping from client: ${JSON.stringify(data)}`);
      })
    );

    subscriptions.push(
      client?.addMessageListener('pong', (data) => {
        alert(`pong from client: ${JSON.stringify(data)}`);
      })
    );

    // Set some message data
    subscriptions.push(
      client?.addMessageListener('update', (data) => {
        setMessage(data);
      })
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription?.remove();
      }
    };
  }, [client]);

  if (!client) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30, marginBottom: 50 }}>Hello world plugin!</Text>
      {message ? (
        <Text>{JSON.stringify(message)}</Text>
      ) : (
        <Text>Waiting for counter state change...</Text>
      )}
      <View style={{ marginTop: 20 }} />
      <Button
        title="Ping client"
        onPress={() => client?.sendMessage('ping', { from: 'expo-plugin-helloworld/button' })}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
