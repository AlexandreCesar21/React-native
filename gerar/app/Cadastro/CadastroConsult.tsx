import React, { useState, useCallback, useEffect } from 'react';
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
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

const CadastroConsult = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [paciente, setPaciente] = useState('');
  const [medico, setMedico] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [horaConsulta, setHoraConsulta] = useState('');
  const [medicos, setMedicos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        try {
          const dadosMedicos = await AsyncStorage.getItem('medicos');
          if (dadosMedicos) {
            setMedicos(JSON.parse(dadosMedicos));
          }

          const dadosPacientes = await AsyncStorage.getItem('pacientes');
          if (dadosPacientes) {
            setPacientes(JSON.parse(dadosPacientes));
          }
        } catch (erro) {
          console.log('Erro ao carregar médicos ou pacientes:', erro);
        }
      };

      carregarDados();
    }, [])
  );

  useEffect(() => {
    const carregarConsulta = async () => {
      if (id) {
        try {
          const consultasExistentes = await AsyncStorage.getItem('consultas');
          const consultas = consultasExistentes ? JSON.parse(consultasExistentes) : [];

          const consulta = consultas.find((c: any) => c.id === id);
          if (consulta) {
            setPaciente(consulta.paciente);
            setMedico(consulta.medico);
            setDataConsulta(consulta.dataConsulta);
            setHoraConsulta(consulta.horaConsulta);
          }
        } catch (error) {
          console.log('Erro ao carregar consulta para edição:', error);
        }
      }
    };

    carregarConsulta();
  }, [id]);

  const validarData = (data: string) => {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(data);
  };

  const validarHora = (hora: string) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);
  };

  const handleSubmit = async () => {
  if (!paciente || !medico || !dataConsulta || !horaConsulta) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    return;
  }

  // Buscar dados completos dos médicos e pacientes salvos
  const dadosMedicos = await AsyncStorage.getItem('medicos');
  const dadosPacientes = await AsyncStorage.getItem('pacientes');
  const listaMedicos = dadosMedicos ? JSON.parse(dadosMedicos) : [];
  const listaPacientes = dadosPacientes ? JSON.parse(dadosPacientes) : [];

  const medicoObj = listaMedicos.find((m: any) => m.nome === medico);
  const pacienteObj = listaPacientes.find((p: any) => p.nome === paciente);

  if (!medicoObj || !pacienteObj) {
    Alert.alert('Erro', 'Médico ou paciente não encontrados.');
    return;
  }

  const novaConsulta = {
    id: id || Date.now().toString(),
    medico: medicoObj,
    paciente: pacienteObj,
    data: dataConsulta,
    hora: horaConsulta,
  };

  try {
    const consultasExistentes = await AsyncStorage.getItem('agendamentos');
    const consultas = consultasExistentes ? JSON.parse(consultasExistentes) : [];

    if (id) {
      const index = consultas.findIndex((c: any) => c.id === id);
      if (index !== -1) {
        consultas[index] = novaConsulta;
      }
    } else {
      consultas.push(novaConsulta);
    }

    await AsyncStorage.setItem('agendamentos', JSON.stringify(consultas));

    Alert.alert(
      id ? 'Consulta Atualizada' : 'Consulta Agendada',
      `Consulta com ${medico} marcada para ${dataConsulta} às ${horaConsulta}.`
    );

    router.back();
  } catch (error) {
    console.log('Erro ao salvar consulta:', error);
    Alert.alert('Erro', 'Não foi possível salvar a consulta.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Envolvidos</Text>

        <Text style={styles.label}>Nome do paciente</Text>
        <View style={styles.medicoInputWrapper}>
          <Picker
            selectedValue={paciente}
            onValueChange={setPaciente}
            style={styles.medicoInput}
          >
            <Picker.Item label="Selecione o paciente" value="" />
            {pacientes.map((p) => (
              <Picker.Item key={p.nome} label={p.nome} value={p.nome} />
            ))}
          </Picker>
        </View>

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
        <Text style={styles.label}>Data da consulta</Text>
<TextInput
  style={styles.input}
  value={dataConsulta}
  onChangeText={(text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 8);
    const masked =
      cleaned.length <= 2
        ? cleaned
        : cleaned.length <= 4
        ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
        : `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    setDataConsulta(masked);
  }}
  keyboardType="numeric"
  placeholder="Ex: 25/12/2025"
/>

<Text style={styles.label}>Horário de consulta</Text>
<TextInput
  style={styles.input}
  value={horaConsulta}
  onChangeText={(text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    const masked =
      cleaned.length <= 2
        ? cleaned
        : `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    setHoraConsulta(masked);
  }}
  keyboardType="numeric"
  placeholder="Ex: 14:30"
/>

      </View>

      <TouchableOpacity
        style={[styles.fixedButton, styles.concluirButton]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {id ? 'Atualizar Consulta' : 'Agendar nova consulta'}
        </Text>
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
