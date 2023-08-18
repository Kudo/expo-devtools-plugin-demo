import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, View } from "react-native";
import ApolloDemo from "./ApolloDemo";
import TinybaseDemo from "./TinybaseDemo";

export default function App() {
  const [currentDemo, setCurrentDemo] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      {currentDemo === null && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button
            title="Apollo demo"
            onPress={() => setCurrentDemo("apollo")}
          />
          <Button
            title="Tinybase demo"
            onPress={() => setCurrentDemo("tinybase")}
          />
        </View>
      )}
      {currentDemo === "apollo" && <ApolloDemo />}
      {currentDemo === "tinybase" && <TinybaseDemo />}
      <StatusBar style="auto" />
    </View>
  );
}
