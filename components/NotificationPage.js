import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import * as Notifications from "expo-notifications";

const NotificationPage = ({ route }) => {
  const [userData, setUserData] = useState({
    waterGoal: "",
    weight: "",
    bedTime: "",
    wakeUpTime: "",
  });

  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  useEffect(() => {
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);
    }
  }, [route.params]);

  useEffect(() => {
    const scheduleNotifications = async () => {
      try {
        const { wakeUpTime, bedTime } = userData;
        const wakeUpHour = parseInt(wakeUpTime.split(":")[0]);
        const bedTimeHour = parseInt(bedTime.split(":")[0]);

        let startHour = wakeUpHour;
        let endHour = bedTimeHour;

        const notifications = [];

        for (let hour = startHour; hour <= endHour; hour++) {
          const notificationDate = new Date();
          notificationDate.setHours(hour, 0, 0, 0);

          const identifier = await Notifications.scheduleNotificationAsync({
            content: {
              title: "💧 Water Reminder",
              body: "Your body needs water!",
            },
            trigger: {
              hour: hour,
              repeats: true,
            },
          });

          const notificationItem = {
            id: identifier,
            time: `${hour}:00`,
          };

          notifications.push(notificationItem);
        }

        setScheduledNotifications(notifications);
      } catch (error) {
        console.error("Error scheduling notifications:", error);
      }
    };

    if (userData.wakeUpTime && userData.bedTime) {
      scheduleNotifications();
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações Agendadas:</Text>
      <FlatList
        data={scheduledNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationItemText}>{item.time}</Text>
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
    borderRadius: 5,
    width: "80%",
  },
  notificationItemText: {
    color: "white",
    fontSize: 16,
  },
});

export default NotificationPage;
