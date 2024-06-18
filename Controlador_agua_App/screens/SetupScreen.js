import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { addMinutes, isWithinInterval, set } from "date-fns";
import * as Notifications from "expo-notifications";

const SetupScreen = () => {
  const navigation = useNavigation();

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
      navigation.replace("AppTabs");

      // Agendar notificações
      scheduleNotifications(userData);
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
    }
  };

  const scheduleNotifications = async (userData) => {
    try {
      const { bedTime, wakeUpTime } = userData;

      // Converter horários de dormir e acordar para horas e minutos
      const bedTimeHours = parseInt(bedTime.split(":")[0]);
      const bedTimeMinutes = parseInt(bedTime.split(":")[1]);
      const wakeUpTimeHours = parseInt(wakeUpTime.split(":")[0]);
      const wakeUpTimeMinutes = parseInt(wakeUpTime.split(":")[1]);

      // Configurar o horário inicial da notificação como o horário de dormir
      let notificationTime = set(new Date(), {
        hours: bedTimeHours,
        minutes: bedTimeMinutes,
        seconds: 0,
        milliseconds: 0,
      });

      // Intervalo de notificação em minutos (aqui configurado para a cada 1 hora)
      const notificationInterval = 60; // em minutos

      // Agenda as notificações entre o horário de dormir e acordar
      while (notificationTime <= set(new Date(), {
        hours: wakeUpTimeHours,
        minutes: wakeUpTimeMinutes,
        seconds: 0,
        milliseconds: 0,
      })) {
        // Verifica se o horário está dentro do intervalo de dormir e acordar
        if (isWithinInterval(notificationTime, { start: bedTime, end: wakeUpTime })) {
          await scheduleNotification(notificationTime);
        }

        // Incrementa o horário da próxima notificação
        notificationTime = addMinutes(notificationTime, notificationInterval);
      }

      Alert.alert("Notificações agendadas", "As notificações foram agendadas com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível agendar as notificações.");
      console.error("Erro ao agendar notificações:", error);
    }
  };

  const scheduleNotification = async (notificationTime) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Water Reminder",
          body: "Hora de beber água!",
        },
        trigger: {
          hour: notificationTime.getHours(),
          minute: notificationTime.getMinutes(),
          repeats: true,
        },
      });
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
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
