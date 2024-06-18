import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";

const IntroductionPage3 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <Image
          source={require("../assets/aquabloomsplash.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Continue explorando</Text>
        <Text style={styles.description}>Esta é a terceira página de introdução.</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Próximo" onPress={() => navigation.navigate("IntroductionPage4")} />
        <Button title="Pular" onPress={() => navigation.navigate("SetupScreen")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Distribui os itens na vertical
    alignItems: "center",
    padding: 20,
    backgroundColor: "white", // Fundo branco para a página de introdução
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#4169e1", // Azul-royal para o título
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    marginBottom: 20,
  },
});

export default IntroductionPage3;
