// IntroductionPage1.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const IntroductionPage1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Continue explorando</Text>
      <Text style={styles.description}>Esta é a terceira página de introdução.</Text>
      <Button title="Próximo" onPress={() => navigation.navigate("IntroductionPage4")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white", // Fundo branco para a página de introdução
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
});

export default IntroductionPage1;
