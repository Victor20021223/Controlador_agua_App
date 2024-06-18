import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";

const GoalsPage = () => {
  const [goalsByDate, setGoalsByDate] = useState({});

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const savedGoals = await AsyncStorage.getItem("metas");
        if (savedGoals) {
          const parsedGoals = JSON.parse(savedGoals);
          const groupedGoals = groupGoalsByDate(parsedGoals);
          setGoalsByDate(groupedGoals);
        } else {
          setGoalsByDate({});
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const groupGoalsByDate = (goals) => {
    return goals.reduce((acc, goal) => {
      acc[goal.date] = goal;
      return acc;
    }, {});
  };

  const getChartData = () => {
    const labels = Object.keys(goalsByDate).map(date => date);
    const data = Object.keys(goalsByDate).map(date => goalsByDate[date].totalConsumido);

    return {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Metas Diárias</Text>
      {Object.keys(goalsByDate).length > 0 && (
        <LineChart
          data={getChartData()}
          width={Dimensions.get("window").width - 40} // width from device screen minus padding
          height={220}
          chartConfig={{
            backgroundColor: "#000",
            backgroundGradientFrom: "#1e90ff",
            backgroundGradientTo: "#4682b4",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      )}
      {Object.keys(goalsByDate).length > 0 ? (
        Object.keys(goalsByDate).map((date, index) => (
          <View key={index}>
            <Text style={styles.dateText}>Data: {date}</Text>
            <View style={styles.goalContainer}>
              <Text style={styles.goalText}>Meta de Água: {goalsByDate[date].waterGoal} mL</Text>
              <Text style={styles.goalText}>Peso: {goalsByDate[date].weight} kg</Text>
              <Text style={styles.goalText}>Total Consumido: {goalsByDate[date].totalConsumido} mL</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noGoalsText}>Nenhuma meta registrada.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e90ff",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e90ff",
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  goalContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 40,
    marginVertical: 30,
    width: "100%",
  },
  goalText: {
    fontSize: 16,
    color: "#4682b4",
  },
  noGoalsText: {
    fontSize: 18,
    color: "#4682b4",
  },
});

export default GoalsPage;
