import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { connectPluginFromDevToolsAsync } from 'expo/devtools';

const client = await connectPluginFromDevToolsAsync();
client.sendMessage('ping', { from: 'expo-plugin-helloworld' });

export default function App() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Ping pong
    client.addMessageListener('pong', (data) => {
      console.log('receiving pong', data);
    });

    // Set some message data
    client.addMessageListener('update', (data) => {
      setMessage(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello world plugin!</Text>
      {message ? <Text>{JSON.stringify(message)}</Text> : <Text>Waiting...</Text>}
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
