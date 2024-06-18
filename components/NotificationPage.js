import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, FlatList } from "react-native";
import * as Notifications from "expo-notifications";

const NotificationPage = () => {
  const [notificationInterval, setNotificationInterval] = useState("30"); // Intervalo inicial de notificação em minutos
  const [notificationHour, setNotificationHour] = useState("09"); // Hora inicial da notificação
  const [notificationMinute, setNotificationMinute] = useState("00"); // Minuto inicial da notificação
  const [notificationSeconds, setNotificationSeconds] = useState("00"); // Segundo inicial da notificação
  const [scheduledNotifications, setScheduledNotifications] = useState([]); // Array para armazenar as notificações agendadas

  useEffect(() => {
    // Solicitar permissões para enviar notificações ao montar o componente
    const requestNotificationPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          if (status === "denied") {
            throw new Error("Permissão de notificações negada. Você pode habilitá-la nas configurações do dispositivo.");
          } else {
            throw new Error("Permissão não concedida para notificações.");
          }
        }
      } catch (error) {
        Alert.alert("Erro", error.message);
      }
    };
  
    requestNotificationPermissions();
  }, []);

  const scheduleNotification = async () => {
    try {
      const now = new Date();
      const notificationDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        Number(notificationHour),
        Number(notificationMinute),
        Number(notificationSeconds)
      );

      const intervalInSeconds = parseInt(notificationInterval) * 60;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Water Reminder",
          body: "Your body needs water!",
        },
        trigger: {
          seconds: intervalInSeconds,
          repeats: true,
          hour: notificationDate.getHours(),
          minute: notificationDate.getMinutes(),
        },
      });

      const notificationItem = {
        id: identifier,
        time: `${notificationHour}:${notificationMinute}`,
        interval: parseInt(notificationInterval),
      };

      setScheduledNotifications([...scheduledNotifications, notificationItem]);

      Alert.alert("Notificação agendada", `A notificação será enviada a cada ${notificationInterval} minutos.`);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível agendar a notificação.");
    }
  };

  const cancelNotification = async (id) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      const updatedNotifications = scheduledNotifications.filter((item) => item.id !== id);
      setScheduledNotifications(updatedNotifications);
      Alert.alert("Notificação cancelada", "A notificação agendada foi cancelada com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cancelar a notificação agendada.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Intervalo de Notificação (minutos):</Text>
        <TextInput
          style={styles.input}
          value={notificationInterval}
          onChangeText={(value) => setNotificationInterval(value)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Horário da Notificação:</Text>
        <TextInput
          style={[styles.input, { width: 50 }]}
          value={notificationHour}
          onChangeText={(value) => setNotificationHour(value)}
          keyboardType="numeric"
        />
        <Text style={styles.label}>:</Text>
        <TextInput
          style={[styles.input, { width: 50 }]}
          value={notificationMinute}
          onChangeText={(value) => setNotificationMinute(value)}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.notificationButton, { backgroundColor: "#74ccf4" }]}
        onPress={scheduleNotification}
      >
        <Text style={styles.notificationText}>Cadastrar Notificação</Text>
      </TouchableOpacity>

      {/* Lista de notificações agendadas */}
      <View style={styles.notificationListContainer}>
        <Text style={styles.notificationListTitle}>Notificações Agendadas:</Text>
        <FlatList
          data={scheduledNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificationItem}>
              <Text style={styles.notificationItemText}>{`${item.time} - a cada ${item.interval} minutos`}</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelNotification(item.id)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
    backgroundColor: "black", // Fundo preto
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#1e90ff", // Azul médio
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#1e90ff", // Azul médio
    marginRight: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#1e90ff", // Azul médio
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#1e90ff", // Azul médio
  },
  notificationButton: {
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    width: "80%",
  },
  notificationText: {
    color: "white", // Texto branco
    fontWeight: "bold",
    fontSize: 16,
  },
  notificationListContainer: {
    marginTop: 20,
    width: "100%",
  },
  notificationListTitle: {
    fontSize: 18,
    color: "#1e90ff", // Azul médio
    marginBottom: 10,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#333",
    marginBottom: 10,
    borderRadius: 5,
  },
  notificationItemText: {
    color: "white", // Texto branco
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white", // Texto branco
    fontSize: 16,
  },
});

export default NotificationPage;
