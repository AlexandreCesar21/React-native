import React, { useState, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect, useRouter } from 'expo-router';
import Layout from '@/components/layout_consulta';

const Calendario = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const carregarAgendamentos = async () => {
        try {
          const data = await AsyncStorage.getItem('agendamentos');
          if (data) {
            setAgendamentos(JSON.parse(data));
          } else {
            setAgendamentos([]);
          }
        } catch (error) {
          console.error('Erro ao carregar agendamentos:', error);
        }
      };

      carregarAgendamentos();
    }, [])
  );

  const handleCancelarConsulta = (index: number) => {
    Alert.alert(
      'Cancelar consulta',
      'Tem certeza que deseja cancelar esta consulta?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const novaLista = [...agendamentos];
              novaLista.splice(index, 1);
              await AsyncStorage.setItem('agendamentos', JSON.stringify(novaLista));
              setAgendamentos(novaLista);
              setExpandedIndex(null);
            } catch (error) {
              console.error('Erro ao cancelar consulta:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const filteredAgendamentos = agendamentos.filter((agendamento) =>
    agendamento.medico.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Layout>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar médico"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Image source={require('../assets/images/lupa.png')} style={styles.searchIcon} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {filteredAgendamentos.map((agendamento, index) => (
          <View key={index} style={styles.medicoContainer}>
            <View style={styles.medicoHeader}>
              <Text style={styles.medicoData}>{agendamento.data}</Text>
            </View>

            <View style={styles.medicoHeader}>
              <Text style={styles.medicoName}>{agendamento.hora}</Text>
              <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.arrowContainer}>
                <Icon
                  name={expandedIndex === index ? 'chevron-down' : 'chevron-right'}
                  size={24}
                  color="#007BFF"
                />
              </TouchableOpacity>
            </View>

            {expandedIndex === index && (
              <View>
                <Text style={styles.medicoInfo}>{agendamento.medico.nome}</Text>
                <Text style={styles.medicoInfo}>
                  {agendamento.medico.especialidade} | {agendamento.medico.crm}
                </Text>
                <Text style={styles.medicoInfo}>{agendamento.paciente.nome}</Text>
                <Text style={styles.medicoInfo}>Paciente</Text>
                <View style={styles.line} />

                <View style={styles.optionsContainer}>
                  <TouchableOpacity style={styles.optionButton}>
                    <Text style={styles.optionText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handleCancelarConsulta(index)}
                  >
                    <Text style={styles.optionText}>Cancelar consulta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    width: '100%',
    height: 60,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    right: 30,
    top: 30,
    width: 20,
    height: 20,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  medicoContainer: {
    marginBottom: 15,
  },
  medicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  medicoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00213D',
  },
  medicoInfo: {
    fontSize: 14,
    color: '#555',
  },
  medicoData: {
    fontSize: 20,
    color: '#339CFF',
    fontWeight: 'bold',
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#0B3B60',
  },
  optionText: {
    color: '#0B3B60',
    fontSize: 14,
  },
});

export default Calendario;
