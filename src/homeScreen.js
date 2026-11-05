import { useEffect, useState } from "react";

import { View, Text, Button } from "react-native";

import { useNavigation } from "@react-navigation/native";

import adafruitApi from "./axios.js";

const HomeScreen = () => {
  // Estado atual do alarme
  const [alarmeAtivo, setAlarmeAtivo] = useState(false);

  // Última distância conhecida
  const [distancia, setDistancia] = useState(0);

  const [limite, setLimite] = useState(15);

  const [intrusao, setIntrusao] = useState(false);

  const navigation = useNavigation();

  // ------------------------------------------------
  // CAMERA
  // ------------------------------------------------

  const handleCam = () => {
    navigation.navigate("Cam");
  };

  // ------------------------------------------------
  // CONSULTAR ADAFRUIT IO
  // ------------------------------------------------

  async function atualizarDados() {
    try {
      // Consulta estado do alarme
      const respostaAlarme = await adafruitApi.getAlarme();

      const valorAlarme = String(respostaAlarme.data.value)
        .trim()
        .toLowerCase();

      setAlarmeAtivo(valorAlarme === "true");

      // Consulta distância
      const respostaDistancia = await adafruitApi.getDistancia();

      const valorDistancia = Number(respostaDistancia.data.value);

      if (Number.isFinite(valorDistancia)) {
        setDistancia(valorDistancia);
      }

      const respostaLimite = await adafruitApi.getLimite();

      const valorLimite = Number(respostaLimite.data.value);

      if (Number.isFinite(valorLimite)) {
        setLimite(valorLimite);
      }

      const respostaIntrusao = await adafruitApi.getIntrusao();

      const valorIntrusao = String(respostaIntrusao.data.value)
        .trim()
        .toLowerCase();

      setIntrusao(valorIntrusao === "true");
    } catch (error) {
      console.log("Erro ao atualizar dados:", error.message);
    }
  }

  // ------------------------------------------------
  // POLLING
  // ------------------------------------------------

  useEffect(() => {
    // Atualiza assim que
    // a tela for aberta
    atualizarDados();

    // Depois consulta novamente
    // a cada 3 segundos
    const intervalo = setInterval(atualizarDados, 3000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  // ------------------------------------------------
  // ARMAR / DESARMAR
  // ------------------------------------------------

  async function alternarAlarme() {
    try {
      const novoEstado = !alarmeAtivo;

      await adafruitApi.setAlarme(novoEstado);

      // Atualiza imediatamente
      // a interface
      setAlarmeAtivo(novoEstado);
    } catch (error) {
      console.log("Erro ao alterar alarme:", error.message);
    }
  }

  // ------------------------------------------------
  // ESTADO VISUAL
  // ------------------------------------------------

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Sistema de Alarme
      </Text>

      <Text
        style={{
          fontSize: 22,
          marginBottom: 10,
        }}
      >
        {alarmeAtivo ? "ALARME ARMADO" : "ALARME DESARMADO"}
      </Text>

      <Text
        style={{
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Distância: {distancia} cm
      </Text>

      {intrusao ? (
        <Text
          style={{
            color: "red",
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          INTRUSÃO DETECTADA!
        </Text>
      ) : (
        <Text
          style={{
            color: "green",
            fontSize: 20,
          }}
        >
          AMBIENTE SEGURO
        </Text>
      )}

      <View
        style={{
          marginBottom: 20,
        }}
      >
        <Button
          title={alarmeAtivo ? "Desarmar Alarme" : "Armar Alarme"}
          onPress={alternarAlarme}
          color={alarmeAtivo ? "red" : "green"}
        />
      </View>

      <Text>
        Limite atual:
        {limite} cm
      </Text>

      <Button title="Limite 10 cm" onPress={() => adafruitApi.setLimite(10)} />

      <Button title="Limite 20 cm" onPress={() => adafruitApi.setLimite(20)} />

      <Button title="Limite 30 cm" onPress={() => adafruitApi.setLimite(30)} />

      <Button title="Abrir Câmera" onPress={handleCam} color="blue" />
    </View>
  );
};

export default HomeScreen;
