import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Switch, Alert } from "react-native";

const NotificationPage = () => {
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [notificationSwitches, setNotificationSwitches] = useState({});

  useEffect(() => {
    const scheduleNotifications = () => {
      const notifications = [];
      const switches = {};

      // Horários fixos para as notificações
      const fixedHours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      
      fixedHours.forEach((hour) => {
        const identifier = `notification_${hour}`;

        const notificationItem = {
          id: identifier,
          time: `${hour}:00`,
          active: true,
        };

        notifications.push(notificationItem);
        switches[hour] = true;
      });

      setScheduledNotifications(notifications);
      setNotificationSwitches(switches);
    };

    scheduleNotifications();
  }, []); // Dependência vazia para garantir que este efeito só seja executado uma vez

  const toggleSwitch = (hour) => {
    const updatedSwitches = {
      ...notificationSwitches,
      [hour]: !notificationSwitches[hour],
    };
    setNotificationSwitches(updatedSwitches);
  };

  const confirmCancelNotification = async (hour) => {
    return new Promise((resolve) => {
      Alert.alert(
        "Confirmar Cancelamento",
        `Deseja realmente cancelar a notificação para ${hour}:00?`,
        [
          { text: "Cancelar", onPress: () => resolve(false), style: "cancel" },
          { text: "Confirmar", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações Agendadas:</Text>
      <FlatList
        data={scheduledNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationItemText}>{item.time}</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificationSwitches[item.id] ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(item.id)}
              value={notificationSwitches[item.id]}
            />
          </View>
        )}
      />
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
    color: "#1e90ff",
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#333",
    marginBottom: 10,
    borderRadius: 50,
    width: "80%",
    marginLeft: 30,
  },
  notificationItemText: {
    color: "white",
    fontSize: 16,
    alignItems: "center",
  },
});

export default NotificationPage;
