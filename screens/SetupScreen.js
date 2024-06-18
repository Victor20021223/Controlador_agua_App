import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetupScreen = ({ navigation }) => {
  const [waterGoal, setWaterGoal] = useState("");
  const [weight, setWeight] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [wakeUpTime, setWakeUpTime] = useState("");

  const handleSave = async () => {
    // Salva os dados no AsyncStorage
    const userData = {
      waterGoal: waterGoal,
      weight: weight,
      bedTime: bedTime,
      wakeUpTime: wakeUpTime,
    };

    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      // Navega para a tela principal do aplicativo (AppTabs)
      navigation.replace("AppTabs", { userData: userData });
      navigation.navigate('Settings', { userData: userData });
      navigation.navigate('Meta', { userData: userData });
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo</Text>
      <Text style={styles.sub}>Preencha os dados abaixo, para o aplicativo ser inicializado</Text>
      <TextInput
        style={styles.input}
        placeholder="Meta de Água (ml)"
        placeholderTextColor={"blue"}
        value={waterGoal}
        onChangeText={setWaterGoal}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        placeholderTextColor={"blue"}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Horário de Dormir (hh:mm)"
        placeholderTextColor={"blue"}
        value={bedTime}
        onChangeText={setBedTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Horário de Acordar (hh:mm)"
        placeholderTextColor={"blue"}
        value={wakeUpTime}
        onChangeText={setWakeUpTime}
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "black", // Fundo preto
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      color: "#4169e1", // Azul-royal para o título
    },
    input: {
      width: "100%",
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 30,
      paddingLeft: 10,
      color: "blue", // Azul para o texto de entrada
    },
    sub:{
        marginBottom: 20,
        fontSize: 15,
        color: "blue",
        textAlign: "center",
    }
  });
  
  

export default SetupScreen;
