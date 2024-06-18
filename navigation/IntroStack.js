import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Importe useNavigation
import IntroductionPage1 from "../screens/IntroductionPage1";
import IntroductionPage2 from "../screens/IntroductionPage2";
import IntroductionPage3 from "../screens/IntroductionPage3";
import IntroductionPage4 from "../screens/IntroductionPage4";
import SetupScreen from "../screens/SetupScreen";
import AppTabs from "./AppTabs";

const Stack = createStackNavigator();

const IntroStack = () => {
  const navigation = useNavigation(); // Utilize useNavigation para obter o objeto de navegação

  useEffect(() => {
    checkIntroSeen();
  }, []);

  const checkIntroSeen = async () => {
    try {
      const introSeen = await AsyncStorage.getItem("introSeen");
      if (introSeen) {
        // Navegar diretamente para AppTabs se a introdução já foi vista
        navigation.replace("AppTabs");
      }
    } catch (error) {
      console.error("Erro ao verificar introdução vista:", error);
    }
  };

  const markIntroSeen = async () => {
    try {
      await AsyncStorage.setItem("introSeen", "true");
    } catch (error) {
      console.error("Erro ao marcar introdução vista:", error);
    }
  };

  return (
    <Stack.Navigator initialRouteName="IntroductionPage1">
      <Stack.Screen name="IntroductionPage1" component={IntroductionPage1} options={{ headerShown: false }} />
      <Stack.Screen name="IntroductionPage2" component={IntroductionPage2} options={{ headerShown: false }} />
      <Stack.Screen name="IntroductionPage3" component={IntroductionPage3} options={{ headerShown: false }} />
      <Stack.Screen name="IntroductionPage4" component={IntroductionPage4} options={{ headerShown: false }} />
      <Stack.Screen name="SetupScreen" component={SetupScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AppTabs"
        component={AppTabs}
        options={{ headerShown: false }}
        listeners={({ navigation }) => ({
          beforeRemove: () => markIntroSeen(),
        })}
      />
    </Stack.Navigator>
  );
};

export default IntroStack;
