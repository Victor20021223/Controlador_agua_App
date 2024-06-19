// App.js
import React from "react";
import IntroStack from "../Controlador_agua_App/navigation/IntroStack";
import { NavigationContainer } from "@react-navigation/native";


const App = () => {
  return (
    <NavigationContainer>
      <IntroStack />
    </NavigationContainer>
  );
};

export default App;
