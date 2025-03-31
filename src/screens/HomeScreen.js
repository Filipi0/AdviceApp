import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import axios from "axios";
import { saveAdvice } from "../storage/adviceStorage";

export default function HomeScreen({ navigation }) {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.adviceslip.com/advice?timestamp=${new Date().getTime()}`
      );

      if (!response.data.slip || !response.data.slip.advice) {
        console.error("❌ Erro: API não retornou um conselho válido.");
        setLoading(false);
        return;
      }

      const adviceEnglish = response.data.slip.advice;
      let slipId = response.data.slip.slip_id || String(Date.now());
      const advicePortuguese = await translateToPortuguese(adviceEnglish);

      setAdvice({ slip_id: slipId, advice: advicePortuguese });
    } catch (error) {
      console.error("❌ Erro ao buscar conselho:", error);
    }
    setLoading(false);
  };

  const translateToPortuguese = async (text) => {
    try {
      const response = await axios.get(
        "https://api.mymemory.translated.net/get",
        {
          params: { q: text, langpair: "en|pt-BR" },
        }
      );
      return response.data.responseData.translatedText;
    } catch (error) {
      console.error("❌ Erro na tradução:", error);
      return text;
    }
  };

  const handleSaveAdvice = async () => {
    if (advice) {
      await saveAdvice(advice);
      showModal();
    }
  };

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => hideModal(), 2000);
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💡 Receba um Conselho Aleatório</Text>
      <View style={styles.adviceContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#176585" />
        ) : (
          <Text style={styles.adviceText}>
            {advice?.advice || "Clique abaixo para receber um conselho"}
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={fetchAdvice}>
        <Text style={styles.buttonText}>🎲 Gerar Conselho</Text>
      </TouchableOpacity>
      {advice && (
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSaveAdvice}
        >
          <Text style={styles.buttonText}>⭐ Salvar nos Favoritos</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, styles.favoritesButton]}
        onPress={() => navigation.navigate("Favorites")}
      >
        <Text style={styles.buttonText}>📂 Ver Favoritos</Text>
      </TouchableOpacity>
      {modalVisible && (
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              ✅ Conselho salvo nos favoritos!
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f3cf",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#176585",
    marginBottom: 20,
    textAlign: "center",
  },
  adviceContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    width: "90%",
    borderWidth: 2,
    borderColor: "#36cecc",
  },
  adviceText: { fontSize: 18, textAlign: "center", color: "#176585" },
  button: {
    backgroundColor: "#c2e4cb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginVertical: 8,
    width: "90%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#36cecc",
    shadowColor: "#176585",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: { fontSize: 18, color: "#FFFFFF", fontWeight: "bold" },
  saveButton: { backgroundColor: "#36cecc" },
  favoritesButton: { backgroundColor: "#176585" },
  modalContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#176585",
    textAlign: "center",
  },
});
