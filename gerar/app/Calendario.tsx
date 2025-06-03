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
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import { useFocusEffect, useRouter } from 'expo-router';
import Layout from '@/components/layout_consulta';

const Calendario = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  // Modal states
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [consultaSelecionadaIndex, setConsultaSelecionadaIndex] = useState<number | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');

  const abrirModalEditar = (index: number) => {
  const consulta = agendamentos[index];
  setConsultaSelecionadaIndex(index);
  setNovaData(consulta.data);
  setNovaHora(consulta.hora);
  setModalEditarVisible(true);
};

const salvarEdicao = async () => {
  if (!novaData.trim() || !novaHora.trim()) {
    Alert.alert('Aviso', 'Preencha todos os campos.');
    return;
  }

  if (consultaSelecionadaIndex === null) return;

  try {
    const novaLista = [...agendamentos];
    novaLista[consultaSelecionadaIndex] = {
      ...novaLista[consultaSelecionadaIndex],
      data: novaData,
      hora: novaHora,
    };
    await AsyncStorage.setItem('agendamentos', JSON.stringify(novaLista));
    setAgendamentos(novaLista);
    setModalEditarVisible(false);
    setConsultaSelecionadaIndex(null);
    setNovaData('');
    setNovaHora('');
    setExpandedIndex(null);
  } catch (error) {
    console.error('Erro ao editar consulta:', error);
  }
};

const aplicarMascaraData = (text: string) => {

  const cleaned = text.replace(/\D/g, '');

  
  let masked = '';
  if (cleaned.length <= 2) {
    masked = cleaned;
  } else if (cleaned.length <= 4) {
    masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  }

  return masked;
};

const aplicarMascaraHora = (text: string) => {
  
  const cleaned = text.replace(/\D/g, '');

  
  let masked = '';
  if (cleaned.length <= 2) {
    masked = cleaned;
  } else {
    masked = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  }

  return masked;
};




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

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const abrirModalCancelar = (index: number) => {
    setConsultaSelecionadaIndex(index);
    setModalCancelVisible(true);
    setMotivoCancelamento('');
  };

  const confirmarCancelamento = async () => {
    if (!motivoCancelamento.trim()) {
      Alert.alert('Aviso', 'Por favor, digite o motivo do cancelamento.');
      return;
    }

    if (consultaSelecionadaIndex === null) return;

    try {
      const novaLista = [...agendamentos];
      novaLista.splice(consultaSelecionadaIndex, 1);
      await AsyncStorage.setItem('agendamentos', JSON.stringify(novaLista));
      setAgendamentos(novaLista);
      setModalCancelVisible(false);
      setConsultaSelecionadaIndex(null);
      setExpandedIndex(null);
      setMotivoCancelamento('');
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
    }
  };

  const fecharModalCancelar = () => {
    setModalCancelVisible(false);
    setConsultaSelecionadaIndex(null);
    setMotivoCancelamento('');
  };

  const filteredAgendamentos = agendamentos.filter((agendamento) =>
    agendamento.medico.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const consultaSelecionada = consultaSelecionadaIndex !== null ? agendamentos[consultaSelecionadaIndex] : null;

  return (
    <Layout>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar médico"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
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
              <View style={styles.detailsContainer}>
                <Text style={styles.medicoInfo}>{agendamento.medico.nome}</Text>
                <Text style={styles.medicoInfo}>
                  {agendamento.medico.especialidade1} | {agendamento.medico.crm}
                </Text>
                <Text style={styles.medicoInfo}>{agendamento.paciente.nome}</Text>
                <Text style={styles.medicoInfo}>Paciente</Text>
                <View style={styles.line} />

                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => abrirModalEditar(index)}
                  >
                    <Text style={styles.optionText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => abrirModalCancelar(index)}
                  >
                    <Text style={styles.optionText}>Cancelar consulta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalCancelVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModalCancelar}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Cancelar Consulta</Text>

              {consultaSelecionada && (
                <View style={styles.consultaInfo}>
                  <Text style={styles.infoText}>
                    <Text style={{ fontWeight: '600' }}>Data: </Text>
                    {consultaSelecionada.data} às {consultaSelecionada.hora}
                  </Text>
                  <Text style={styles.infoText}>
                    <Text style={{ fontWeight: '600' }}>Médico: </Text>DR {consultaSelecionada.medico.nome}
                  </Text>
                  <Text style={styles.infoText}>
                    <Text style={{ fontWeight: '600' }}>Especialidade: </Text>{consultaSelecionada.medico.especialidade1}
                  </Text>
                  <Text style={styles.infoText}>
                    <Text style={{ fontWeight: '600' }}>Paciente: </Text>{consultaSelecionada.paciente.nome}
                  </Text>
                </View>
              )}

              <Text style={styles.label}>Motivo do cancelamento</Text>

              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholder="Digite o motivo aqui..."
                placeholderTextColor="#999"
                value={motivoCancelamento}
                onChangeText={setMotivoCancelamento}
                textAlignVertical="top"
              />

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={fecharModalCancelar}
                >
                  <Text style={styles.cancelText}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={confirmarCancelamento}
                >
                  <Text style={styles.confirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
  visible={modalEditarVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalEditarVisible(false)}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Editar Consulta</Text>

       <Text style={styles.label}>Data</Text>
<TextInput
  style={styles.textInput}
  placeholder="DD/MM/AAAA"
  value={novaData}
  keyboardType="numeric"
  onChangeText={(text) => setNovaData(aplicarMascaraData(text))}
/>

<Text style={styles.label}>Hora</Text>
<TextInput
  style={styles.textInput}
  placeholder="HH:MM"
  value={novaHora}
  keyboardType="numeric"
  onChangeText={(text) => setNovaHora(aplicarMascaraHora(text))}
/>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setModalEditarVisible(false)}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={salvarEdicao}
          >
            <Text style={styles.confirmText}>Concluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>

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
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    position: 'absolute',
    right: 25,
    top: 27,
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  medicoContainer: {
    marginBottom: 18,
    backgroundColor: '#fefefe',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  medicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00213D',
  },
  medicoInfo: {
    fontSize: 15,
    color: '#555',
    marginVertical: 2,
  },
  medicoData: {
    fontSize: 20,
    color: '#339CFF',
    fontWeight: '700',
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginVertical: 12,
  },
  arrowContainer: {
    marginLeft: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#0B3B60',
  },
  optionText: {
    color: '#0B3B60',
    fontSize: 15,
    fontWeight: '600',
  },

  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 25,
    paddingHorizontal: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00213D',
    textAlign: 'center',
  },
  consultaInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  label: {
    fontSize: 17,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    minHeight: 90,
    maxHeight: 120,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 7,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#0B3B60',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Calendario;
