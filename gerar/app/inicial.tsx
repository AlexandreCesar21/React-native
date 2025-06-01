import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.image} />
      <Text style={styles.text}>Escolha qual seção deseja iniciar:</Text>

      <View style={styles.buttonsContainer}>
        <Link href="/Medicos" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={require('../assets/images/doutor.png')} />
            <Text style={styles.buttonText}>Médico</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/funcionarios" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={require('../assets/images/paciente.png')} />
            <Text style={styles.buttonText}>Funcionários</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/Paciente" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={require('../assets/images/paciente.png')} />
            <Text style={styles.buttonText}>Pacientes</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/Calendario" asChild>
          <TouchableOpacity style={styles.button}>
            <Image source={require('../assets/images/calendario.png')} />
            <Text style={styles.buttonText}>Consultas</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 25,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 70,
    marginTop: -120,
  },
  text: {
    fontSize: 20,
    color: '#333',
    marginBottom: 40,
    marginTop: -160,
  },
  buttonsContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#0B3B60',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 12,
    width: '100%',
    marginBottom: 20, // espaçamento entre os botões
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
