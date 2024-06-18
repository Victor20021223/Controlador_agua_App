// App.js

import React from "react";
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Meta") {
            iconName = "list";
          } else if (route.name === "Notifications") {
            iconName = "notifications";
          } else if (route.name === "Goals") {
            iconName = "calendar";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      screenOptionsSelections={{
        activeTintColor: "#1ca3ec",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Meta" component={MetaScreen} />
      <Tab.Screen name="Notifications" component={NotificationPage} />
      <Tab.Screen name="Goals" component={GoalsPage} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SetupScreen">
        <Stack.Screen name="SetupScreen" component={SetupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
