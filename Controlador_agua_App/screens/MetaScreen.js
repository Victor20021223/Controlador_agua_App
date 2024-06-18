import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import WaterDropProgress from '../components/WaterDropProgress'; // Importar o componente

const MetaScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState({
    waterGoal: "",
    weight: "",
    bedTime: "",
    wakeUpTime: "",
  });

  const [metaCalculada, setMetaCalculada] = useState(0);
  const [totalConsumido, setTotalConsumido] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [metaConcluida, setMetaConcluida] = useState(false);

  useEffect(() => {
    // Carregar os dados do usuário ao montar o componente ou ao mudar route.params.userData
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);
    }
  }, [route.params]);

  useEffect(() => {
    // Calcular a meta inicial ao carregar os dados do usuário
    if (userData.weight) {
      const pesoNumber = Number(userData.weight);
      const metaCalculadaTemp = pesoNumber * 35;
      setMetaCalculada(metaCalculadaTemp);
    }
  }, [userData]);

  useEffect(() => {
    // Verificar se a meta foi atingida
    if (totalConsumido > metaCalculada) {
      setMetaConcluida(true);
      salvarMeta(); // Chama a função para salvar a meta quando é atingida
      Alert.alert("Parabéns!", "Você atingiu a meta de consumo de água!");
    } else {
      setMetaConcluida(false);
    }
  }, [totalConsumido, metaCalculada]);
  

  const salvarMeta = async () => {
    // Função para salvar a meta atingida no AsyncStorage
    const goal = {
      date: getCurrentDate(), // Obtém a data atual
      waterGoal: metaCalculada, // Salva a meta calculada
      weight: userData.weight // Salva o peso do usuário
    };

    try {
      let metasSalvas = await AsyncStorage.getItem('metas');
      metasSalvas = metasSalvas ? JSON.parse(metasSalvas) : [];
      metasSalvas.push(goal);
      await AsyncStorage.setItem('metas', JSON.stringify(metasSalvas));
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  const getCurrentDate = () => {
    // Função para obter a data atual no formato "YYYY-MM-DD"
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  };

  const atualizarProgresso = (total) => {
    // Atualizar o estado de progresso com base no total consumido
    const porcentagem = (total / metaCalculada) * 100;
    setProgresso(porcentagem > 100 ? 100 : porcentagem);
  };

  const adicionarAgua = () => {
    // Função para adicionar água ao total consumido
    const aguaAdicionada = 200;
    const novoTotal = totalConsumido + aguaAdicionada;
    setTotalConsumido(novoTotal);
    atualizarProgresso(novoTotal);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.metaText}>Meta Atual para bater: {metaCalculada} ml</Text>
      <Text style={styles.metaText}>Água consumida hoje: {totalConsumido} ml</Text>

      {metaConcluida ? (
        <>
          <FontAwesome name="check-circle" size={100} color="green" style={styles.checkIcon} />
          <LottieView
            source={require('../animation/party.json')}
            autoPlay={true}
            loop={false}
            style={styles.lottie}
          />
        </>
      ) : (
        <Button title="Adicionar Água" onPress={adicionarAgua} />
      )}
      {/* Adicionar a barra de progresso em forma de gota de água */}
      <WaterDropProgress progress={progresso} style={styles.barraProgress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "black",
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    color: "#1e90ff",
  },
  metaText: {
    fontSize: 20,
    marginBottom: 20,
    color: "#4682b4",
  },
  checkIcon: {
    marginVertical: 20,
    marginBottom: 10,
  },
  lottie: {
    width: 300,
    height: 30,
  },
});

export default MetaScreen;
