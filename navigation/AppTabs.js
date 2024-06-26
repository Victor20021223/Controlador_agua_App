// AppTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MetaScreen from "../screens/MetaScreen";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationPage from "../components/NotificationPage";
import GoalsPage from "../components/GoalsPage";

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

export default AppTabs;
