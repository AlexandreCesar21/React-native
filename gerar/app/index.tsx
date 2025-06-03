import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const router = useRouter();

  const usuarioCorreto = 'user';
  const senhaCorreta = '1234';
  const codigoCorreta = '123';

  const handleLogin = () => {
    
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (email === usuarioCorreto && senha === senhaCorreta && codigo === codigoCorreta) {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      router.replace('/inicial');
    } else {
      Alert.alert('Erro', 'E-mail ou senha inválidos!');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
    
    <Image source={require('../assets/images/logo.png')} style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#fff"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#fff"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Codigo"
        placeholderTextColor="#fff"
        secureTextEntry
        value={codigo}
        onChangeText={setCodigo}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
 
  image: {
    width: 300,
    height: 300,
    marginBottom: 70,
    marginTop: -120,
    left: 15
  },
  input: {
    backgroundColor: '#0B3B60',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    marginBottom: 20,
    bottom: 70
  },
  button: {
    backgroundColor: '#0B3B60',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    bottom: 65
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});