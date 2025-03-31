import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Imagem */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/2933/2933100.png",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>Bem-vindo ao Conselheiro! 💡</Text>
      <Text style={styles.description}>
        Aqui você receberá os melhores conselhos da vida, traduzidos para você!
      </Text>

      {/*Botão para ir à Home*/}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>🚀 Começar Agora!</Text>
      </TouchableOpacity>
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
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#176585", 
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: "#176585",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: "#c2e4cb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#36cecc",
    shadowColor: "#176585",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    color: "#27b1bf", 
    fontWeight: "bold",
  },
});
