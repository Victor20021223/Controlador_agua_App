import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetupScreen = ({ navigation }) => {
  const [waterGoal, setWaterGoal] = useState("");
  const [weight, setWeight] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [wakeUpTime, setWakeUpTime] = useState("");

  const handleSave = async () => {
    // Verifica se algum dos campos está vazio
    if (!waterGoal || !weight || !bedTime || !wakeUpTime) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
  
    // Verifica se o horário de dormir e acordar está no formato hh:mm
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(bedTime) || !timeRegex.test(wakeUpTime)) {
      Alert.alert("Erro", "Por favor, insira horários válidos no formato hh:mm.");
      return;
    }
    // Salva os dados no AsyncStorage
    const userData = {
      waterGoal: waterGoal,
      weight: weight,
      bedTime: bedTime,
      wakeUpTime: wakeUpTime,
    };
  
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      // Navega para a tela principal do aplicativo (AppTabs) e passa os dados do usuário
      navigation.replace("AppTabs", { userData: userData });
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar salvar os dados.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem vindo</Text>
      <Text style={styles.sub}>Preencha os dados abaixo para inicializar o aplicativo</Text>
      <TextInput
        style={styles.input}
        placeholder="Meta de Água (ml)"
        placeholderTextColor="blue"
        value={waterGoal}
        onChangeText={setWaterGoal}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        placeholderTextColor="blue"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Horário de Dormir (hh:mm)"
        placeholderTextColor="blue"
        value={bedTime}
        onChangeText={setBedTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Horário de Acordar (hh:mm)"
        placeholderTextColor="blue"
        value={wakeUpTime}
        onChangeText={setWakeUpTime}
      />
      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#4169e1",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 20,
    paddingLeft: 10,
    color: "blue",
    textAlign: "center",
  },
  sub: {
    marginBottom: 20,
    fontSize: 15,
    color: "blue",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
  },
});

export default SetupScreen;
