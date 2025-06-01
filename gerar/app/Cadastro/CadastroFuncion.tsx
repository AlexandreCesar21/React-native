import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CadastroFuncion = () => {
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

  const funcoes = [
    'Limpeza',
    'Recepeção',
    'Atendente',
    'Porteiro'
  ];

  const generos = [
    'Mulher cisgênero',
    'Mulher transgênero',
    'Homem cisgênero',
    'Homem transgênero',
  ]

  const handleSubmit = () => {
    Alert.alert('Sucesso', 'Cadastro concluído com sucesso!');
    console.log('Cadastro concluído');
  };

  const handleCancel = () => {
    Alert.alert('Cancelado', 'Cadastro cancelado');
    console.log('Cadastro cancelado');
  };

  return (
      <View style={styles.container}>
        <ScrollView >
          {/* Seção Profissional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funcionário</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={nome}
              onChangeText={setNome}
            />
            
            <Text style={styles.label}>Função</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={funcao}
                onValueChange={(itemValue) => setFuncao(itemValue)}
              >
                <Picker.Item label="Selecione a função" value="" />
                {funcoes.map((funcoes, index) => (
                  <Picker.Item key={index} label={funcoes} value={funcoes} />
                ))}
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="RG"
              value={rg}
              onChangeText={setRg}
            />
            <TextInput
              style={styles.input}
              placeholder="CPF"
              value={cpf}
              onChangeText={setCpf}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de nascimento"
              value={data}
              onChangeText={setData}
            />
          </View>


          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={genero}
                onValueChange={(itemValue) => setFuncao(itemValue)}
              >
                <Picker.Item label="Selecione o gênero" value="" />
                {generos.map((generos, index) => (
                  <Picker.Item key={index} label={generos} value={generos} />
                ))}
              </Picker>
            </View>

          {/* Seção Contatos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contatos</Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone ou Celular"
              value={telefone}
              onChangeText={setTelefone}
            />
          </View>

          {/* Seção Endereço Profissional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço Profissional</Text>
            <TextInput
              style={styles.input}
              placeholder="Logradouro"
              value={logradouro}
              onChangeText={setLogradouro}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfWidth]}
                placeholder="Número"
                value={numero}
                onChangeText={setNumero}
              />
              <TextInput
                style={[styles.input, styles.halfWidth]}
                placeholder="Complemento"
                value={complemento}
                onChangeText={setComplemento}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Cidade"
              value={cidade}
              onChangeText={setCidade}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfWidth]}
                placeholder="UF"
                value={uf}
                onChangeText={setUf}
              />
              <TextInput
                style={[styles.input, styles.halfWidth]}
                placeholder="CEP"
                value={cep}
                onChangeText={setCep}
              />
            </View>
          </View>
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
    marginBottom: 20,  // Aumentando a margem entre as seções
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,  // Aumentando o espaço entre o título e os campos
    color: "#0B3B60",
  },
  input: {
    height: 40,  // Aumentando um pouco a altura dos campos de input
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,  // Aumentando o espaço entre os campos
    paddingLeft: 10,
    fontSize: 16,  // Aumentando o tamanho da fonte para maior legibilidade
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
    marginBottom: 12,  // Aumentando o espaço entre o picker e o próximo campo
  },
  label: {
    fontSize: 16,  // Aumentando o tamanho da fonte da label
    marginBottom: 5,
    color: '#0B3B60',
    fontWeight: 'bold',
  }
});

export default CadastroFuncion;
