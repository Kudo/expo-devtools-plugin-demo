import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { connectPluginFromDevToolsAsync } from 'expo/devtools';

let client = connectPluginFromDevToolsAsync();
async function getClientAsync() {
  return await client;
}

async function addMessageListenerAsync(messageType, callback) {
  const client = await getClientAsync();
  client.addMessageListener(messageType, callback);
}

async function sendMessageAsync(messageType, data) {
  const client = await getClientAsync();
  client.sendMessage(messageType, data);
}

export default function App() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    addMessageListenerAsync('ping', (data) => {
      sendMessageAsync('pong', { from: 'expo-plugin-helloworld' });
      alert(`ping from client: ${JSON.stringify(data)}`);
    });

    addMessageListenerAsync('pong', (data) => {
      alert(`pong from client: ${JSON.stringify(data)}`);
    });

    // Set some message data
    addMessageListenerAsync('update', (data) => {
      setMessage(data);
    });

    // Should probably clean these listeners up..
  }, []);

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
        onPress={() => sendMessageAsync('ping', { from: 'expo-plugin-helloworld/button' })}
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
