import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";
import TabNavigator from "./src/components/TabNavigator";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#FF6B35" />
          <TabNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
