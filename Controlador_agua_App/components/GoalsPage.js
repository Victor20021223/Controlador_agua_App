import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // Função para agrupar metas pelo campo 'date', mantendo apenas a última meta de cada dia
  const groupGoalsByDate = (goals) => {
    return goals.reduce((acc, goal) => {
      const date = goal.date;
      // Se já existe uma meta para esse dia, substitui pela última encontrada
      acc[date] = goal;
      return acc;
    }, {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas Diárias</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {Object.keys(goalsByDate).length > 0 ? (
          Object.keys(goalsByDate).map((date, index) => (
            <View key={index} style={styles.dateContainer}>
              <Text style={styles.dateText}>Data: {date}</Text>
              <View style={styles.goalContainer}>
                <Text style={styles.goalText}>Meta de Água: {goalsByDate[date].waterGoal} mL</Text>
                <Text style={styles.goalText}>Peso: {goalsByDate[date].weight} kg</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noGoalsText}>Nenhuma meta registrada.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black", // Fundo preto para o container
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e90ff", // Texto azul para o título
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e90ff", // Texto azul para a data
    marginTop: 10,
    marginBottom: 5,
  },
  goalContainer: {
    backgroundColor: "#333", // Fundo escuro para o goalContainer
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
  },
  goalText: {
    fontSize: 18,
    color: "white", // Texto branco para o conteúdo dentro do goalContainer
  },
  noGoalsText: {
    fontSize: 18,
    color: "gray", // Texto cinza para a mensagem sem metas
  },
});

export default GoalsPage;
