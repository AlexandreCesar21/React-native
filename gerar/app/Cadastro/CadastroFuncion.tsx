import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Button, ScrollView, Alert, TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroFuncion = () => {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [data, setData] = useState('');
  const [genero, setGenero] = useState('');
  const [status, setStatus] = useState('');
  const [cod, setCod] = useState('');
  const [coduser, setCoduser] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

  const funcoes = ['Limpeza', 'Recepção', 'Atendente', 'Porteiro'];
  const generos = ['Mulher cisgênero', 'Mulher transgênero', 'Homem cisgênero', 'Homem transgênero'];

  const handleSubmit = async () => {
    if (!nome || !funcao || !rg || !cpf || !data || !genero || !email || !telefone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const novoFuncionario = {
      nome, funcao, rg, cpf, data, genero, status, cod, coduser,
      email, telefone, logradouro, numero, complemento, cidade, uf, cep
    };

    try {
      const dadosSalvos = await AsyncStorage.getItem('funcionarios');
      const lista = dadosSalvos ? JSON.parse(dadosSalvos) : [];
      lista.push(novoFuncionario);
      await AsyncStorage.setItem('funcionarios', JSON.stringify(lista));
      Alert.alert('Sucesso', 'Cadastro concluído com sucesso!');
      router.push('/funcionarios');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar os dados.');
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancelado', 'Cadastro cancelado');
    router.back();
  };

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

  return (
    
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funcionário</Text>
            <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />

            <Text style={styles.label}>Função</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={funcao} onValueChange={setFuncao}>
                <Picker.Item label="Selecione a função" value="" />
                {funcoes.map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))}
              </Picker>
            </View>

          <TextInput
            style={styles.input}
            placeholder="RG"
            value={rg}
            onChangeText={(text) => setRg(formatRg(text))}
            maxLength={12}
          />
          <TextInput
            style={styles.input}
            placeholder="CPF"
            value={cpf}
            onChangeText={(text) => setCpf(formatCpf(text))}
            maxLength={14}
          />

          <TextInput
            style={styles.input}
            placeholder="Data de nascimento"
            value={data}
            onChangeText={(text) => setData(formatData(text))}
            keyboardType="numeric"
            maxLength={10}
          />
          </View>

          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={genero} onValueChange={setGenero}>
              <Picker.Item label="Selecione o gênero" value="" />
              {generos.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contatos</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
             <TextInput
                style={styles.input}
                placeholder="Telefone ou Celular"
                value={telefone}
                onChangeText={(text) => setTelefone(formatTelefone(text))}
                keyboardType="phone-pad"
              />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço Profissional</Text>
            <TextInput style={styles.input} placeholder="Logradouro" value={logradouro} onChangeText={setLogradouro} />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfWidth]} placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
              <TextInput style={[styles.input, styles.halfWidth]} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
            </View>
            <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            <View style={styles.row}>
              <TextInput
              style={[styles.input, styles.halfWidth]}
              placeholder="UF"
              value={uf}
              onChangeText={(text) => setUf(formatUf(text))}
              maxLength={2}
            />
          <TextInput
            style={[styles.input, styles.halfWidth]}
            placeholder="CEP"
            value={cep}
            onChangeText={(text) => setCep(formatCep(text))}
            keyboardType="numeric"
            maxLength={9}
          />
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0B3B60',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: 'white',
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
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#0B3B60',
    fontWeight: 'bold',
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

export default CadastroFuncion;
