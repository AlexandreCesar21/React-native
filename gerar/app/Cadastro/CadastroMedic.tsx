import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Layout from '@/components/layout_Cadastmedico';

const CadastroMedico = () => {
  const [nome, setNome] = useState('');
  const [especialidade1, setEspecialidade1] = useState('');
  const [crm, setCrm] = useState('');
  const [cns, setCns] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');

  const router = useRouter();

  const especialidades = [
    'Ginecologista',
    'Oftalmologista',
    'Clínico Geral',
    'Pediatra',
    'Ortopedista',
    'Cardiologista',
    'Dermatologista',
    'Neurologista',
    'Psiquiatra',
    'Endocrinologista',
    'Urologista',
    'Otorrinolaringologista',
    'Reumatologista',
    'Radiologista',
    'Oncologista',
    'Pneumologista',
    'Infectologista'
  ];

const salvarMedico = async () => {
  if (!nome || !especialidade1 || !crm) {
    Alert.alert('Erro', 'Preencha os campos obrigatórios: Nome, Especialidade e CRM.');
    return;
  }

  const novoMedico = {
    id: Date.now().toString(),
    nome,
    especialidade1,
    crm,
    cns,
    email,
    telefone,
    logradouro,
    numero,
    complemento,
    cidade,
    uf,
    cep
  };

  try {
    const listaAtual = await AsyncStorage.getItem('medicos');
    const medicos = listaAtual ? JSON.parse(listaAtual) : [];

    medicos.push(novoMedico);
    await AsyncStorage.setItem('medicos', JSON.stringify(medicos));

    Alert.alert('Sucesso', 'Médico cadastrado com sucesso!', [
      {
        text: 'OK',
        onPress: () => router.push('/Medicos')
      },
    ]);
  } catch (error) {
    console.error(error);
    Alert.alert('Erro', 'Não foi possível salvar o médico.');
  }
};

const aplicarMascaraTelefone = (valor: string) => {
  valor = valor.replace(/\D/g, '').slice(0, 11);

  if (valor.length <= 2) {
    return `(${valor}`;
  } 
  if (valor.length <= 6) {
    return `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } 
  if (valor.length <= 10) {
    return `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
  } 
  return `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
};

const aplicarMascaraCEP = (valor: string) => {
  valor = valor.replace(/\D/g, '').slice(0, 8);

  if (valor.length <= 5) {
    return valor;
  }

  return `${valor.slice(0,5)}-${valor.slice(5)}`;
};

const aplicarMascaraCRM = (valor: string) => {
  
  return valor.replace(/\D/g, '').slice(0, 6);
};

const aplicarMascaraCNS = (valor: string) => {
 
  valor = valor.replace(/\D/g, '').slice(0, 12); 

  if (valor.length <= 3) return valor;
  if (valor.length <= 7) return `${valor.slice(0,3)} ${valor.slice(3)}`;
  if (valor.length <= 11) return `${valor.slice(0,3)} ${valor.slice(3,7)} ${valor.slice(7)}`;
  return `${valor.slice(0,3)} ${valor.slice(3,7)} ${valor.slice(7,11)} ${valor.slice(11)}`;
};

const aplicarMascaraUF = (valor: string) => {
  return valor
    .toUpperCase()          
    .replace(/[^A-Z]/g, '')  
    .slice(0, 2);          
};
  return (
      <View style={styles.container}>
        <ScrollView>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profissional</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Especialidade</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={especialidade1}
                onValueChange={(itemValue) => setEspecialidade1(itemValue)}
              >
                <Picker.Item label="Selecione uma especialidade" value="" />
                {especialidades.map((especialidade, index) => (
                  <Picker.Item key={index} label={especialidade} value={especialidade} />
                ))}
              </Picker>
            </View>

            <TextInput
  style={styles.input}
  placeholder="CRM"
  keyboardType="numeric"
  value={crm}
  onChangeText={(text) => setCrm(aplicarMascaraCRM(text))}
/>

<TextInput
  style={styles.input}
  placeholder="CNS"
  keyboardType="numeric"
  value={cns}
  onChangeText={(text) => setCns(aplicarMascaraCNS(text))}
/>

          </View>

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
              keyboardType="phone-pad"
              onChangeText={(text) => setTelefone(aplicarMascaraTelefone(text))}
            />

          </View>

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
              onChangeText={(text) => setUf(aplicarMascaraUF(text))}
            />
              <TextInput
                style={[styles.input, styles.halfWidth]}
                placeholder="CEP"
                value={cep}
                keyboardType="numeric"
                onChangeText={(text) => setCep(aplicarMascaraCEP(text))}
              />

            </View>
          </View>

        


          

          <TouchableOpacity style={[styles.fixedButton, styles.concluirButton]} onPress={salvarMedico}>
                  <Text style={styles.buttonText}>Concluir cadastro</Text>
                </TouchableOpacity>
          
                <TouchableOpacity style={[styles.fixedButton, styles.cancelarButton]} onPress={() => router.back()}
>
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
  },
});

export default CadastroMedico;

