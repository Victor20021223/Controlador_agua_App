import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Importa FontAwesome
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WaterDropProgress from '../components/WaterDropProgress';

const MetaScreen = ({ route }) => {
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
    const fetchUserData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem("userData");
        if (savedUserData) {
          setUserData(JSON.parse(savedUserData));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Atualiza userData quando route.params.userData muda
  useEffect(() => {
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);
    }
  }, [route.params]);

  // Calcula a meta baseado no peso do usuário
  useEffect(() => {
    console.log("Calculando meta com peso:", userData.weight);
    if (userData.weight) {
      const pesoNumber = Number(userData.weight);
      const metaCalculadaTemp = pesoNumber * 35;
      setMetaCalculada(metaCalculadaTemp);
    }
  }, [userData]);

  // Verifica se a meta foi atingida
  useEffect(() => {
    console.log("Verificando se a meta foi atingida:", totalConsumido, metaCalculada);
    if (totalConsumido > metaCalculada) {
      setMetaConcluida(true);
      salvarMeta(); // Chama a função para salvar a meta quando é atingida
      Alert.alert("Parabéns!", "Você atingiu a meta de consumo de água!");
    } else {
      setMetaConcluida(false);
    }
  }, [totalConsumido, metaCalculada]);

  // Salva a meta atingida no AsyncStorage
  const salvarMeta = async () => {
    // Função para salvar a meta atingida no AsyncStorage
    const goal = {
      date: getCurrentDate(), // Obtém a data atual
      waterGoal: metaCalculada, // Salva a meta calculada
      weight: userData.weight, // Salva o peso do usuário
      totalConsumido: totalConsumido, // Salva o total consumido
    };

    try {
      let metasSalvas = await AsyncStorage.getItem('metas');
      metasSalvas = metasSalvas ? JSON.parse(metasSalvas) : [];

      // Remover metas antigas para a mesma data
      metasSalvas = metasSalvas.filter(meta => meta.date !== goal.date);
      metasSalvas.push(goal);

      await AsyncStorage.setItem('metas', JSON.stringify(metasSalvas));
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  // Obtém a data atual no formato "YYYY-MM-DD"
  const getCurrentDate = () => {
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

  // Atualiza o progresso com base no total consumido
  const atualizarProgresso = (total) => {
    const porcentagem = (total / metaCalculada) * 100;
    setProgresso(porcentagem > 100 ? 100 : porcentagem);
  };

  // Adiciona água ao total consumido e atualiza o progresso
  const adicionarAgua = () => {
    // Opções de tamanhos de copos (pode ser estendido para permitir que o usuário cadastre seus próprios copos)
    const copos = [
      { ml: 200, label: "Copo(200 ml)", icon: "glass" },
      { ml: 300, label: "Copo(300 ml)", icon: "glass" },
      { ml: 500, label: "Copo(500 ml)", icon: "glass-water" },
      // Exemplo de copo cadastrado pelo usuário
      { ml: 250, label: "Meu Copo Personalizado (250 ml)", icon: "user" },
    ];

    Alert.alert(
      "Selecione o Tamanho do Copo",
      "Escolha a quantidade de água que deseja adicionar:",
      copos.map((copo) => ({
        text: copo.label,
        onPress: () => {
          const novoTotal = totalConsumido + copo.ml;
          setTotalConsumido(novoTotal);
          atualizarProgresso(novoTotal);
        },
      })),
    );
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
  barraProgress: {
    marginTop: 20,
  },
});

export default MetaScreen;
