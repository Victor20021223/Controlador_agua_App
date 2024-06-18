import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ route }) => {
  // Estado local para armazenar os dados do usuário
  const [userData, setUserData] = useState({
    waterGoal: "",
    weight: "",
    bedTime: "",
    wakeUpTime: "",
  });

  // Função para carregar os dados do usuário quando a tela é montada ou quando route.params.userData muda
  useEffect(() => {
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);
    }
  }, [route.params]);

  // Funções para atualizar os dados do usuário
  const handleChangeWaterGoal = (value) => {
    setUserData({ ...userData, waterGoal: value });
  };

  const handleChangeWeight = (value) => {
    setUserData({ ...userData, weight: value });
  };

  const handleChangeBedTime = (value) => {
    setUserData({ ...userData, bedTime: value });
  };

  const handleChangeWakeUpTime = (value) => {
    setUserData({ ...userData, wakeUpTime: value });
  };

  // Função para salvar os dados do usuário
  const handleSaveSettings = async () => {
    try {
      // Converte o objeto userData para uma string JSON
      const jsonUserData = JSON.stringify(userData);

      // Salva os dados no AsyncStorage
      await AsyncStorage.setItem("userData", jsonUserData);

      console.log("Dados do usuário salvos com sucesso:", userData);
      // Poderia retornar true ou uma mensagem de sucesso, se necessário
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
      // Poderia retornar false ou uma mensagem de erro, se necessário
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Meta diária de água (ml):</Text>
        <TextInput
          style={styles.input}
          value={userData.waterGoal}
          onChangeText={handleChangeWaterGoal}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Peso (kg):</Text>
        <TextInput
          style={styles.input}
          value={userData.weight}
          onChangeText={handleChangeWeight}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Horário de dormir:</Text>
        <TextInput
          style={styles.input}
          value={userData.bedTime}
          onChangeText={handleChangeBedTime}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Horário de acordar:</Text>
        <TextInput
          style={styles.input}
          value={userData.wakeUpTime}
          onChangeText={handleChangeWakeUpTime}
        />
      </View>
      
      <Button title="Salvar" onPress={handleSaveSettings} />

      <Text style={styles.sub}>Dados de Usuário</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Alinha o conteúdo no topo da tela
    alignItems: "center",
    paddingTop: 50, // Adiciona padding no topo para afastar o conteúdo do topo da tela
    backgroundColor: "black", // Azul claro como fundo
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "blue", // Azul médio para o título
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#1e90ff", // Azul médio para a borda do input
    padding: 8,
    width: 200,
    marginBottom: 5,
    color: "#4169e1", // Azul royal para o texto do input
  },
  text: {
    textDecorationColor: "blue", 
    fontSize: 13,
    color: "blue",
  },
  sub:{
    marginTop: 50,
    fontSize: 20,
    color: "blue",
  },
});

export default SettingsScreen;
