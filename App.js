// App.js
import React from "react";
import IntroStack from "../Controlador_agua_App/navigation/IntroStack";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SetupScreen from "./screens/SetupScreen";
import MetaScreen from "./screens/MetaScreen";
import NotificationPage from "./components/NotificationPage";
import GoalsPage from "./components/GoalsPage";
import SettingsScreen from "./screens/SettingsScreen";


const App = () => {
  return (
    <NavigationContainer>
      <IntroStack />
    </NavigationContainer>
  );
};

export default App;
