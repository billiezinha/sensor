import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { LightSensor } from "expo-sensors";

export default function App() {
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [musicType, setMusicType] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#1c1c1c");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const musicLinks = {
    calm: "https://www.youtube.com/watch?v=5qap5aO4i9A", // Lo-fi beats
    normal: "https://www.youtube.com/watch?v=JGwWNGJdvx8", // Ed Sheeran
    upbeat: "https://www.youtube.com/watch?v=fRh_vgS2dFE", // Justin Bieber
  };

  const getBackgroundColor = (illuminance: number): string => {
    if (illuminance <= 10) return "#4CAF50"; // Escuro
    if (illuminance > 10 && illuminance <= 50) return "#FFC107"; // Verde
    return "#FF0000"; // Amarelo
  };

  useEffect(() => {
    let subscription;

    if (LightSensor) {
      // Ativando o sensor de luz
      subscription = LightSensor.addListener((data) => {
        setLightLevel(data.illuminance);
        setBackgroundColor(getBackgroundColor(data.illuminance));
      });
    } else {
      // Sensor não disponível
      setErrorMessage("Sensor de luz não é suportado nesta plataforma.");
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Atualiza o tipo de música com base na luz
    if (lightLevel !== null) {
      if (lightLevel <= 10) {
        setMusicType("Calma");
      } else if (lightLevel > 10 && lightLevel <= 50) {
        setMusicType("Normal");
      } else {
        setMusicType("Agitada");
      }
    }
  }, [lightLevel]);

  if (errorMessage) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={styles.error}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Sensor de Luz e Música</Text>
      <Text style={styles.text}>
        Nível de Luz: {lightLevel !== null ? lightLevel.toFixed(1) : "Carregando..."}
      </Text>
      <Text style={styles.text}>Tipo de Música: {musicType || "Carregando..."}</Text>
      {musicType && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const url = musicLinks[musicType.toLowerCase() as keyof typeof musicLinks];
            if (url) {
              window.open(url, "_blank");
            }
          }}
        >
          <Text style={styles.buttonText}>Ouvir no YouTube</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 8,
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
