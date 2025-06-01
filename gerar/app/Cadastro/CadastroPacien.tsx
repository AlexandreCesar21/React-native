import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Paciente = () => {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [cns, setCns] = useState('');
  const [sangue, setSangue] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [data, setData] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

  const handleSubmit = async () => {
    if (!nome || !rg || !cpf || !data || !email || !telefone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const novoPaciente = {
      id: Date.now().toString(),
      nome,
      email,
      cpf,
      rg,
      cns,
      sangue,
      nacionalidade,
      data,
      telefone,
      logradouro,
      numero,
      complemento,
      cidade,
      uf,
      cep,
    };

    try {
      const dadosSalvos = await AsyncStorage.getItem('pacientes');
      const lista = dadosSalvos ? JSON.parse(dadosSalvos) : [];
      lista.push(novoPaciente);
      await AsyncStorage.setItem('pacientes', JSON.stringify(lista));

      Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
      router.push('/Paciente');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar os dados.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seção Paciente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paciente</Text>
          <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} />
          <TextInput style={styles.input} placeholder="RG" value={rg} onChangeText={setRg} />
          <TextInput style={styles.input} placeholder="CNS" value={cns} onChangeText={setCns} />
          <TextInput style={styles.input} placeholder="Tipo Sanguíneo" value={sangue} onChangeText={setSangue} />
          <TextInput style={styles.input} placeholder="Nacionalidade" value={nacionalidade} onChangeText={setNacionalidade} />
          <TextInput style={styles.input} placeholder="Data de Nascimento" value={data} onChangeText={setData} />
        </View>

        {/* Seção Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contatos</Text>
          <TextInput style={styles.input} placeholder="Telefone ou Celular" value={telefone} onChangeText={setTelefone} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        </View>

        {/* Seção Endereço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <TextInput style={styles.input} placeholder="Logradouro" value={logradouro} onChangeText={setLogradouro} />
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Número" value={numero} onChangeText={setNumero} />
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
          </View>
          <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.halfInput]} placeholder="UF" value={uf} onChangeText={setUf} />
            <TextInput style={[styles.input, styles.halfInput]} placeholder="CEP" value={cep} onChangeText={setCep} />
          </View>
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Concluir Cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B3B60',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    backgroundColor: '#0B3B60',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Paciente;
