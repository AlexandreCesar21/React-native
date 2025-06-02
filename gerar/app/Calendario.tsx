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

  // Estados para o modal de cancelamento
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [consultaSelecionadaIndex, setConsultaSelecionadaIndex] = useState<number | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

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

  // Abrir modal e setar consulta selecionada
  const abrirModalCancelar = (index: number) => {
    setConsultaSelecionadaIndex(index);
    setModalCancelVisible(true);
    setMotivoCancelamento('');
  };

  // Confirmar cancelamento
  const confirmarCancelamento = async () => {
    if (!motivoCancelamento.trim()) {
      Alert.alert('Aviso', 'Por favor, digite o motivo do cancelamento.');
      return;
    }

    if (consultaSelecionadaIndex === null) return;

    try {
      const novaLista = [...agendamentos];
      // Aqui você pode usar o motivoCancelamento para algo (ex: salvar log), se quiser
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

  // Cancelar e fechar modal
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
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                      // Aqui você pode chamar a função para editar (depois)
                      // Por enquanto só deixei o placeholder
                      // router.push(`/editar-consulta/${index}`) por exemplo
                    }}
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

      {/* Modal Cancelar Consulta */}
      <Modal visible={modalCancelVisible} transparent animationType="fade" onRequestClose={fecharModalCancelar}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Deseja cancelar esta consulta?</Text>

              {consultaSelecionada && (
                <>
                  <Text style={styles.infoText}>
                    {consultaSelecionada.data} às {consultaSelecionada.hora}
                  </Text>
                  <Text style={styles.infoText}>DR {consultaSelecionada.medico.nome}</Text>
                  <Text style={styles.infoText}>{consultaSelecionada.medico.especialidade}</Text>

                  <View style={{ marginTop: 10 }} />

                  <Text style={styles.infoText}>{consultaSelecionada.paciente.nome}</Text>
                  <Text style={styles.infoText}>Paciente</Text>
                </>
              )}

              <Text style={[styles.label, { marginTop: 20 }]}>
                Digite abaixo o motivo do cancelamento
              </Text>

              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="Motivo do cancelamento"
                value={motivoCancelamento}
                onChangeText={setMotivoCancelamento}
              />

              <View style={styles.buttonsRow}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={fecharModalCancelar}>
                  <Text style={styles.cancelText}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={confirmarCancelamento}>
                  <Text style={styles.confirmText}>Confirmar cancelamento</Text>
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
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#00213D',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#0B3B60',
  },
  cancelText: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Calendario;
