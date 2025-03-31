import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  getSavedAdvices,
  deleteAdvice,
  updateAdvice,
} from "../storage/adviceStorage";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState(null);
  const [newText, setNewText] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const savedAdvices = await getSavedAdvices();
    setFavorites(savedAdvices);
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Remover Conselho",
      "Tem certeza de que deseja remover este conselho dos favoritos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: async () => {
            await deleteAdvice(id);
            loadFavorites();
          },
          style: "destructive",
        },
      ]
    );
  };

  const openEditModal = (advice) => {
    setCurrentAdvice(advice);
    setNewText(advice.advice);
    setModalVisible(true);
  };

  const handleUpdateAdvice = async () => {
    if (currentAdvice) {
      await updateAdvice({ slip_id: currentAdvice.slip_id, advice: newText });
      loadFavorites();
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Conselhos Favoritos</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyMessage}>Nenhum conselho salvo.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.slip_id)}
          renderItem={({ item }) => (
            <View style={styles.adviceItem}>
              <Text style={styles.adviceText}>{item.advice}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => openEditModal(item)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => confirmDelete(item.slip_id)}
                >
                  <Text style={styles.buttonText}>❌ Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/*Modal de edição */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Conselho</Text>
            <TextInput
              style={styles.input}
              value={newText}
              onChangeText={setNewText}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdateAdvice}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f3cf",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#176585",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#176585",
  },
  adviceItem: {
    backgroundColor: "#c2e4cb",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#36cecc",
  },
  adviceText: {
    fontSize: 16,
    color: "#176585",
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  editButton: {
    backgroundColor: "#27b1bf",
  },
  deleteButton: {
    backgroundColor: "#176585",
  },

  //Estilos do Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#176585",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#36cecc",
    padding: 10,
    borderRadius: 5,
    textAlignVertical: "top",
    minHeight: 80,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#36cecc",
  },
  cancelButton: {
    backgroundColor: "#176585",
  },
});
