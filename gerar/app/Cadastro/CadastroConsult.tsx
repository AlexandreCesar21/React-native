import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const CadastroConsult = () => {
  const [paciente, setPaciente] = useState('');
  const [medico, setMedico] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [horaConsulta, setHoraConsulta] = useState('');
  const [medicos, setMedicos] = useState<any[]>([]); // Armazena lista de médicos salvos

  // Carregar médicos salvos no AsyncStorage ao focar na tela
  useFocusEffect(
    useCallback(() => {
      const carregarMedicos = async () => {
        try {
          const dados = await AsyncStorage.getItem('medicos');
          if (dados) {
            setMedicos(JSON.parse(dados));
          } else {
            setMedicos([]);
          }
        } catch (erro) {
          console.log('Erro ao carregar médicos:', erro);
        }
      };

      carregarMedicos();
    }, [])
  );

  const handleSubmit = () => {
    if (!paciente || !medico || !dataConsulta || !horaConsulta) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    Alert.alert(
      'Consulta Agendada',
      `Consulta marcada com ${medico} para ${dataConsulta} às ${horaConsulta}.`
    );

    // Aqui você pode salvar a consulta no AsyncStorage, se quiser
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Envolvidos</Text>

        <Text style={styles.label}>Nome do paciente</Text>
        <TextInput
          style={styles.input}
          value={paciente}
          onChangeText={setPaciente}
          placeholder="Digite o nome do paciente"
        />

        <Text style={styles.label}>Nome do médico</Text>
        <View style={styles.medicoInputWrapper}>
          <Picker
            selectedValue={medico}
            onValueChange={setMedico}
            style={styles.medicoInput}
          >
            <Picker.Item label="Selecione o médico" value="" />
            {medicos.map((m) => (
              <Picker.Item key={m.nome} label={m.nome} value={m.nome} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data e Horário</Text>

        <Text style={styles.label}>Data da consulta</Text>
        <TextInput
          style={styles.input}
          value={dataConsulta}
          onChangeText={setDataConsulta}
          placeholder="Digite a data"
        />

        <Text style={styles.label}>Horário de consulta</Text>
        <TextInput
          style={styles.input}
          value={horaConsulta}
          onChangeText={setHoraConsulta}
          placeholder="Digite o horário"
        />
      </View>

      <TouchableOpacity
        style={[styles.fixedButton, styles.concluirButton]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Agendar nova consulta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#0B3B60',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
    fontSize: 16,
  },
  medicoInputWrapper: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 12,
  },
  medicoInput: {
    height: 50,
    fontSize: 16,
    paddingLeft: 10,
    color: '#0B3B60',
  },
  fixedButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  concluirButton: {
    backgroundColor: '#0B3B60',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CadastroConsult;
