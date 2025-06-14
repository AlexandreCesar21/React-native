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

const formatCpf = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatRg = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})$/, '$1-$2');
};

const formatTelefone = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

const formatCep = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

const formatData = (value) => {
  return value
    .replace(/\D/g, '')                    
    .replace(/(\d{2})(\d)/, '$1/$2')      
    .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')  
    .slice(0, 10);                       
};


const formatUf = (value) => {
  return value
    .replace(/[^a-zA-Z]/g, '')            
    .toUpperCase()
    .slice(0, 2);
};


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
   
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paciente</Text>
          <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={(text) => setCpf(formatCpf(text))} />
          <TextInput style={styles.input} placeholder="RG" value={rg} onChangeText={(text) => setRg(formatRg(text))} />
          <TextInput style={styles.input} placeholder="Tipo Sanguíneo" value={sangue} onChangeText={setSangue} />
          <TextInput style={styles.input} placeholder="Nacionalidade" value={nacionalidade} onChangeText={setNacionalidade} />
          <TextInput style={styles.input} placeholder="Data de Nascimento" value={data} onChangeText={(text) => setData(formatData(text))} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contatos</Text>
          <TextInput style={styles.input} placeholder="Telefone ou Celular" value={telefone} onChangeText={(text) => setTelefone(formatTelefone(text))} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        </View>

        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <TextInput style={styles.input} placeholder="Logradouro" value={logradouro} onChangeText={setLogradouro} />
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.halfWidth]} placeholder="Número" value={numero} onChangeText={setNumero} />
            <TextInput style={[styles.input, styles.halfWidth]} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
          </View>
          <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
          <View style={styles.row}>
            <TextInput style={[styles.input, styles.halfWidth]} placeholder="UF" value={uf} onChangeText={(text) => setUf(formatUf(text))} />
            <TextInput style={[styles.input, styles.halfWidth]} placeholder="CEP" value={cep} onChangeText={(text) => setCep(formatCep(text))} />
          </View>
        </View>

        
        <TouchableOpacity style={[styles.fixedButton, styles.concluirButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Concluir cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.fixedButton, styles.cancelarButton]} onPress={handleCancel}>
          <Text style={styles.buttonText2}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,  
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,  
    color: "#0B3B60",
  },
  input: {
    height: 40,  
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12, 
    paddingLeft: 10,
    fontSize: 16, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 12,  
  },


 fixedButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5, 
    marginBottom: 10,
    width: '90%', 
    alignSelf: 'center', 
  },
  concluirButton: {
    backgroundColor: '#0B3B60', 
  },
  cancelarButton: {
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#0B3B60', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText2: {
    color: '#0B3B60',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default Paciente;