import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../components/layout_medic';

const ListaMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMedico, setExpandedMedico] = useState<number | null>(null);

  // Modal control states
  const [modalVisible, setModalVisible] = useState(false);
  const [medicoSelecionado, setMedicoSelecionado] = useState<any>(null);

  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [dadosEditados, setDadosEditados] = useState<any>({});
  
  const abrirModalEditar = (medico: any) => {
  setMedicoSelecionado(medico);
  setDadosEditados({ ...medico }); // copia os dados atuais
  setModalEditarVisible(true);
};

const fecharModalEditar = () => {
  setModalEditarVisible(false);
  setMedicoSelecionado(null);
};

const salvarEdicao = async () => {
  try {
    const novaLista = medicos.map((m: any) =>
      m.id === dadosEditados.id ? dadosEditados : m
    );
    await AsyncStorage.setItem('medicos', JSON.stringify(novaLista));
    setMedicos(novaLista);
    fecharModalEditar();
    Alert.alert('Sucesso', 'Perfil editado com sucesso.');
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível salvar as alterações.');
  }
};


  useEffect(() => {
    carregarMedicos();
  }, []);

  const carregarMedicos = async () => {
    try {
      const lista = await AsyncStorage.getItem('medicos');
      if (lista) setMedicos(JSON.parse(lista));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os médicos.');
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleToggleExpand = (index: number) => {
    setExpandedMedico(expandedMedico === index ? null : index);
  };

  // Abrir modal para desativar perfil
  const abrirModalDesativar = (medico: any) => {
    setMedicoSelecionado(medico);
    setModalVisible(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setModalVisible(false);
    setMedicoSelecionado(null);
  };

  // Desativar perfil - função que "desativa" o médico (exemplo, remove da lista)
  const desativarPerfil = async () => {
    if (!medicoSelecionado) return;

    try {
      // Exemplo simples: removendo o médico da lista
      const novaLista = medicos.filter(m => m.id !== medicoSelecionado.id);
      await AsyncStorage.setItem('medicos', JSON.stringify(novaLista));
      setMedicos(novaLista);
      fecharModal();
      Alert.alert('Sucesso', 'Perfil desativado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível desativar o perfil.');
    }
  };

  // Filtrar médicos pelo nome ou especialidade
  const medicosFiltrados = medicos
    .filter((medico: any) =>
      medico.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medico.especialidade1.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome));

  return (
    <Layout>
  <View style={styles.searchContainer}>
  <View style={styles.searchBox}>
    <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder="Pesquisar médico"
      value={searchQuery}
      onChangeText={handleSearchChange}
      placeholderTextColor="#888"
    />
  </View>
</View>

      <ScrollView style={styles.scrollContainer}>
        {medicosFiltrados.map((medico: any, index: number) => (
          <View key={medico.id || index}>
            {(index === 0 || medico.nome.charAt(0) !== medicosFiltrados[index - 1].nome.charAt(0)) && (
              <Text style={styles.letterTitle}>{medico.nome.charAt(0)}</Text>
            )}
            <View style={styles.medicoContainer}>
              <View style={styles.medicoHeader}>
                <Text style={styles.medicoName}>{medico.nome}</Text>
                <TouchableOpacity
                  style={styles.arrowContainer}
                  onPress={() => handleToggleExpand(index)}
                >
                  <Icon
                    name={expandedMedico === index ? 'expand-more' : 'chevron-right'}
                    size={28}
                    color="#007BFF"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.medicoInfo}>
                {medico.especialidade1} | CRM: {medico.crm}-{medico.uf}
              </Text>

              {expandedMedico === index && (
                <View style={styles.medicoDetails}>
                  {medico.email && (
                    <Text style={styles.medicoInfo}>Email: {medico.email}</Text>
                  )}
                  {medico.telefone && (
                    <Text style={styles.medicoInfo}>Telefone: {medico.telefone}</Text>
                  )}
                  {medico.logradouro && medico.numero && (
                    <Text style={styles.medicoInfo}>
                      Endereço: {medico.logradouro}, {medico.numero} - {medico.cidade}/{medico.uf}
                    </Text>
                  )}
                  {medico.cep && <Text style={styles.medicoInfo}>CEP: {medico.cep}</Text>}

                  <View style={styles.optionsContainer}>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => abrirModalEditar(medico)}
                    >
                      <Text style={styles.optionText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.optionButton, { backgroundColor: '#fff', borderColor: '#0B3B60' }]}
                      onPress={() => abrirModalDesativar(medico)}
                    >
                      <Text style={[styles.optionText, { color: '#0B3B60' }]}>Desativar perfil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View style={styles.line} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal de confirmação */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Deseja desativar este perfil?</Text>

            {medicoSelecionado && (
              <>
                <Text style={styles.modalMedicoNome}>{medicoSelecionado.nome}</Text>
                <Text style={styles.modalMedicoInfo}>
                  {medicoSelecionado.especialidade1} | CRM {medicoSelecionado.crm}
                </Text>
              </>
            )}

            <Text style={styles.modalText}>
              Ao desativar este perfil, suas informações ficarão desabilitadas para novas consultas.
            </Text>
            <Text style={styles.modalText}>
              Certifique-se que não há consultas agendadas, caso tenha, a desativação não poderá ser concluída.
            </Text>

            <TouchableOpacity style={styles.desativarButton} onPress={desativarPerfil}>
              <Text style={styles.desativarButtonText}>Desativar este perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelarButton} onPress={fecharModal}>
              <Text style={styles.cancelarButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
  visible={modalEditarVisible}
  animationType="slide"
  transparent
  onRequestClose={fecharModalEditar}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Editar Perfil do Médico</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Nome"
        value={dadosEditados.nome}
        onChangeText={(text) => setDadosEditados({ ...dadosEditados, nome: text })}
      />

      <Text style={styles.label}>Especialidade</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Especialidade"
        value={dadosEditados.especialidade1}
        onChangeText={(text) => setDadosEditados({ ...dadosEditados, especialidade1: text })}
      />

      <Text style={styles.label}>CRM</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="CRM"
        value={dadosEditados.crm}
        onChangeText={(text) => setDadosEditados({ ...dadosEditados, crm: text })}
      />

      <Text style={styles.label}>UF</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="UF"
        value={dadosEditados.uf}
        onChangeText={(text) => setDadosEditados({ ...dadosEditados, uf: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Email"
        value={dadosEditados.email}
        onChangeText={(text) => setDadosEditados({ ...dadosEditados, email: text })}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Telefone"
        value={dadosEditados.telefone}
        onChangeText={(text) => setDadosEditados({ ...dadosEditados, telefone: text })}
      />

      <TouchableOpacity style={styles.desativarButton} onPress={salvarEdicao}>
        <Text style={styles.desativarButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelarButton} onPress={fecharModalEditar}>
        <Text style={styles.cancelarButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
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
  label: {
  fontSize: 14,
  fontWeight: 'bold',
  marginTop: 10,
  marginBottom: 4,
  color: '#0B3B60',
},
  searchInput: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
  },
  searchContainer: {
  paddingHorizontal: 16,
  marginBottom: 12,
},

searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',
  paddingHorizontal: 12,
  height: 48,
},

searchIcon: {
  marginRight: 8,
},

searchInput: {
  flex: 1,
  fontSize: 16,
  color: '#000',
  paddingVertical: 0,
},

  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  letterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  medicoContainer: {
    marginBottom: 15,
  },
  medicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicoName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medicoInfo: {
    fontSize: 14,
    color: '#555',
  },
  medicoDetails: {
    marginTop: 10,
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
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#0B3B60',
  },
  optionText: {
    color: '#0B3B60',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#0B3B60',
  },
  modalMedicoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalMedicoInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
    lineHeight: 20,
    textAlign: 'justify',
  },
  desativarButton: {
    backgroundColor: '#0B3B60',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  desativarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelarButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0B3B60',
    alignItems: 'center',
  },
  cancelarButtonText: {
    fontSize: 16,
    color: '#0B3B60',
    fontWeight: 'bold',
  },
});

export default ListaMedicos;
