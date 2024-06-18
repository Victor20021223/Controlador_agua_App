import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button, Modal, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = ({ route }) => {
  const [userData, setUserData] = useState({
    waterGoal: "",
    weight: "",
    bedTime: "",
    wakeUpTime: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentSetting, setCurrentSetting] = useState("");
  const [tempValue, setTempValue] = useState("");

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

  useEffect(() => {
    if (route.params && route.params.userData) {
      setUserData(route.params.userData);
    }
  }, [route.params]);

  const handleSaveSettings = async () => {
    try {
      const jsonUserData = JSON.stringify(userData);
      await AsyncStorage.setItem("userData", jsonUserData);
      Alert.alert("Sucesso", "Dados salvos com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  const handleOpenModal = (setting) => {
    setCurrentSetting(setting);
    setTempValue(userData[setting]);
    setModalVisible(true);
  };

  const handleSaveModal = () => {
    setUserData({ ...userData, [currentSetting]: tempValue });
    setModalVisible(false);
    handleSaveSettings();
  };

  const renderButton = (setting, label) => (
    <View style={styles.buttonContainer} key={setting}>
      <Button title={label} onPress={() => handleOpenModal(setting)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      {renderButton("waterGoal", "Meta diária de água (ml)")}
      {renderButton("weight", "Peso (kg)")}
      {renderButton("bedTime", "Horário de dormir")}
      {renderButton("wakeUpTime", "Horário de acordar")}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Editar {currentSetting}</Text>
            <TextInput
              style={styles.input}
              value={tempValue}
              onChangeText={setTempValue}
              keyboardType={currentSetting === "waterGoal" || currentSetting === "weight" ? "numeric" : "default"}
            />
            <Button title="Salvar" onPress={handleSaveModal} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "blue",
  },
  buttonContainer: {
    marginBottom: 10,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#1e90ff",
    padding: 8,
    width: 200,
    marginBottom: 5,
    color: "#4169e1",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SettingsScreen;
