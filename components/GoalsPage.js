import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
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
      if (!acc[date] || goal.isCompleted) {
        acc[date] = goal;
      }
      return acc;
    }, {});
  };

  // Função para salvar a meta no AsyncStorage
  const saveGoal = async (newGoal) => {
    try {
      // Obtém as metas salvas no AsyncStorage
      const savedGoals = await AsyncStorage.getItem("metas");
      let goals = savedGoals ? JSON.parse(savedGoals) : [];

      // Verifica se já existe uma meta para o dia atual
      const existingGoalIndex = goals.findIndex(goal => goal.date === newGoal.date);

      if (existingGoalIndex !== -1) {
        // Se já existe uma meta para o dia atual, substitui se a nova meta estiver concluída
        if (newGoal.isCompleted) {
          goals[existingGoalIndex] = newGoal;
        } else {
          Alert.alert("Meta já existente", "Você já tem uma meta para este dia e ela não está concluída.");
          return;
        }
      } else {
        // Se não existe, adiciona a nova meta
        goals.push(newGoal);
      }

      // Salva as metas atualizadas no AsyncStorage
      await AsyncStorage.setItem("metas", JSON.stringify(goals));

      // Atualiza o estado local com as metas agrupadas
      const groupedGoals = groupGoalsByDate(goals);
      setGoalsByDate(groupedGoals);

      Alert.alert("Meta salva", "Sua meta foi salva com sucesso.");
    } catch (error) {
      console.error("Error saving goal:", error);
      Alert.alert("Erro", "Não foi possível salvar a meta.");
    }
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
                <Text style={styles.goalText}>Concluída: {goalsByDate[date].isCompleted ? "Sim" : "Não"}</Text>
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
