import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { LightSensor } from "expo-sensors";

export default function About() {
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#1c1c1c");

  const getBackgroundColor = (illuminance: number): string => {
    if (illuminance <= 10) return "#4CAF50"; // Escuro
    if (illuminance > 10 && illuminance <= 50) return "#FFC107"; // Verde
    return "#FF0000"; // Amarelo
  };

  useEffect(() => {
    let subscription;

    if (LightSensor) {
      subscription = LightSensor.addListener((data) => {
        setLightLevel(data.illuminance);
        setBackgroundColor(getBackgroundColor(data.illuminance));
      });
    } else {
      console.error("Sensor de luz não disponível nesta plataforma.");
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Não foi possível abrir o link.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Sobre o Aplicativo</Text>
      <Text style={styles.text}>
        Este aplicativo utiliza o sensor de luz do dispositivo para sugerir músicas baseadas na
        iluminação do ambiente. Um projeto criativo e inovador!
      </Text>
      <Text style={styles.sectionTitle}>Desenvolvedores</Text>
      <Text style={styles.text}>Êmylle Beatriz & João Fernandes</Text>
      <Text style={styles.sectionTitle}>Versão</Text>
      <Text style={styles.text}>1.0.0</Text>
      <Text style={styles.sectionTitle}>Links Úteis</Text>
      <TouchableOpacity onPress={() => openLink("https://github.com/Emyllebsousa")}>
        <Text style={styles.link}>Repositório no GitHub - Êmylle</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink("https://github.com/billiezinha")}>
        <Text style={styles.link}>Repositório no GitHub - João</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink("https://expo.dev/")}>
        <Text style={styles.link}>Saiba mais sobre o Expo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  link: {
    fontSize: 16,
    color: "#fff",
    textDecorationLine: "underline",
    marginBottom: 8,
  },
});
