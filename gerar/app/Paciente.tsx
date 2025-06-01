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
} from 'react-native';
import Layout from '../components/layour_pacien';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const ListaPacientes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPacienteNome, setExpandedPacienteNome] = useState<string | null>(null);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<any>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleToggleExpand = (nome: string) => {
    setExpandedPacienteNome(expandedPacienteNome === nome ? null : nome);
  };

  useFocusEffect(
    useCallback(() => {
      const carregarPacientes = async () => {
        try {
          const dados = await AsyncStorage.getItem('pacientes');
          if (dados) {
            setPacientes(JSON.parse(dados));
          }
        } catch (erro) {
          console.log('Erro ao carregar pacientes:', erro);
        }
      };

      carregarPacientes();
    }, [])
  );

  const handleDeletePaciente = (nome: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja desativar este perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const novaLista = pacientes.filter((p) => p.nome !== nome);
              await AsyncStorage.setItem('pacientes', JSON.stringify(novaLista));
              setPacientes(novaLista);
              setExpandedPacienteNome(null);
            } catch (error) {
              console.log('Erro ao excluir paciente:', error);
            }
          },
        },
      ]
    );
  };

  const handleOpenEditar = (paciente: any) => {
    setPacienteEditando(paciente);
    setModalVisible(true);
  };

  const handleSalvarEdicao = async () => {
    const novaLista = pacientes.map((p) =>
      p.nome === pacienteEditando.nomeAntigo ? pacienteEditando : p
    );

    try {
      await AsyncStorage.setItem('pacientes', JSON.stringify(novaLista));
      setPacientes(novaLista);
      setModalVisible(false);
      setPacienteEditando(null);
    } catch (error) {
      console.log('Erro ao salvar edição:', error);
    }
  };

  const pacientesFiltrados = pacientes
    .filter((p) => p.nome.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const letras = [...new Set(pacientes.map((p) => p.nome.charAt(0).toUpperCase()))].sort();

  const renderPaciente = (paciente: any) => (
    <View key={paciente.nome} style={styles.pacienteContainer}>
      <View style={styles.pacienteHeader}>
        <Text style={styles.pacienteName}>{paciente.nome}</Text>
        <TouchableOpacity style={styles.arrowContainer} onPress={() => handleToggleExpand(paciente.nome)}>
          <Icon
            name={expandedPacienteNome === paciente.nome ? 'chevron-down' : 'chevron-right'}
            size={24}
            color="#007BFF"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.pacienteInfo}>Sangue: {paciente.sangue}</Text>

      {expandedPacienteNome === paciente.nome && (
        <View style={styles.pacienteDetails}>
          {paciente.email && <Text style={styles.pacienteInfo}>Email: {paciente.email}</Text>}
          {paciente.numero && <Text style={styles.pacienteInfo}>Telefone: {paciente.numero}</Text>}
          {paciente.logradouro && <Text style={styles.pacienteInfo}>Endereço: {paciente.logradouro} N°{paciente.numero}</Text>}
          {paciente.cidade && <Text style={styles.pacienteInfo}>Cidade: {paciente.cidade}</Text>}
          {paciente.cep && <Text style={styles.pacienteInfo}>CEP: {paciente.cep}</Text>}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOpenEditar({ ...paciente, nomeAntigo: paciente.nome })}
            >
              <Text style={styles.optionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleDeletePaciente(paciente.nome)}
            >
              <Text style={styles.optionText}>Desativar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.line} />
    </View>
  );

  return (
    <Layout>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar paciente"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <Image source={require('../assets/images/lupa.png')} style={styles.searchIcon} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {searchQuery.length > 0
          ? pacientesFiltrados.map(renderPaciente)
          : letras.map((letra) => (
              <View key={letra} style={styles.letterSection}>
                <Text style={styles.letterTitle}>{letra}</Text>
                {pacientesFiltrados
                  .filter((p) => p.nome.toUpperCase().startsWith(letra))
                  .map(renderPaciente)}
              </View>
            ))}
      </ScrollView>

      {/* Modal de Edição */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
  <Text style={styles.modalTitle}>Editar Paciente</Text>

  <TextInput
    style={styles.input}
    placeholder="Nome"
    value={pacienteEditando?.nome || ''}
    onChangeText={(text) =>
      setPacienteEditando((prev: any) => ({ ...prev, nome: text }))
    }
  />

  {pacienteEditando?.email !== undefined && (
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={pacienteEditando.email}
      onChangeText={(text) =>
        setPacienteEditando((prev: any) => ({ ...prev, email: text }))
      }
    />
  )}

  {pacienteEditando?.telefone !== undefined && (
    <TextInput
      style={styles.input}
      placeholder="Telefone"
      value={pacienteEditando.telefone}
      onChangeText={(text) =>
        setPacienteEditando((prev: any) => ({ ...prev, telefone: text }))
      }
    />
  )}

  {pacienteEditando?.logradouro !== undefined && (
    <TextInput
      style={styles.input}
      placeholder="Endereço (logradouro)"
      value={pacienteEditando.logradouro}
      onChangeText={(text) =>
        setPacienteEditando((prev: any) => ({ ...prev, logradouro: text }))
      }
    />
  )}

  {pacienteEditando?.numero !== undefined && (
    <TextInput
      style={styles.input}
      placeholder="Número da casa"
      value={pacienteEditando.numero}
      onChangeText={(text) =>
        setPacienteEditando((prev: any) => ({ ...prev, numero: text }))
      }
    />
  )}

  {pacienteEditando?.cidade !== undefined && (
    <TextInput
      style={styles.input}
      placeholder="Cidade"
      value={pacienteEditando.cidade}
      onChangeText={(text) =>
        setPacienteEditando((prev: any) => ({ ...prev, cidade: text }))
      }
    />
  )}

  {pacienteEditando?.cep !== undefined && (
    <TextInput
      style={styles.input}
      placeholder="CEP"
      value={pacienteEditando.cep}
      onChangeText={(text) =>
        setPacienteEditando((prev: any) => ({ ...prev, cep: text }))
      }
    />
  )}

  <View style={styles.modalButtons}>
    <TouchableOpacity
      onPress={() => setModalVisible(false)}
      style={[styles.optionButton, { backgroundColor: '#ccc' }]}
    >
      <Text style={styles.optionText}>Cancelar</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleSalvarEdicao} style={styles.optionButton}>
      <Text style={styles.optionText}>Salvar</Text>
    </TouchableOpacity>
  </View>
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
  letterSection: {
    marginTop: 20,
  },
  letterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  pacienteContainer: {
    marginBottom: 15,
  },
  pacienteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pacienteName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pacienteInfo: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  pacienteDetails: {
    marginTop: 8,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
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
  },modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '85%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginVertical: 5,
    height: 40,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});

export default ListaPacientes;

/*


 letras.map((letra) => (
            <View key={letra} style={styles.letterSection}>
              <Text style={styles.letterTitle}>{letra}</Text>
              {pacientesFiltrados
                .filter((paciente) => paciente.nome.toUpperCase().startsWith(letra))
                .map((paciente) => (
                  <View key={paciente.nome} style={styles.pacienteContainer}>
                    <View style={styles.pacienteHeader}>
                      <Text style={styles.pacienteName}>{paciente.nome}</Text>
                      <TouchableOpacity
                        style={styles.arrowContainer}
                        onPress={() => handleToggleExpand(paciente.nome)}
                      >
                        <Icon
                          name={expandedPacienteNome === paciente.nome ? 'chevron-down' : 'chevron-right'}
                          size={24}
                          color="#007BFF"
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.pacienteInfo}>Sangue: {paciente.sangue}</Text>

                    {expandedPacienteNome === paciente.nome && (
                      <View style={styles.pacienteDetails}>
                        {paciente.email && <Text style={styles.pacienteInfo}>Email: {paciente.email}</Text>}
                        {paciente.numero && <Text style={styles.pacienteInfo}>Telefone: {paciente.numero}</Text>}
                        {paciente.logradouro && <Text style={styles.pacienteInfo}>Endereço: {paciente.logradouro} N°{paciente.numero}</Text>}
                        {paciente.cidade && <Text style={styles.pacienteInfo}>Cidade: {paciente.cidade}</Text>}
                        {paciente.cep && <Text style={styles.pacienteInfo}>CEP: {paciente.cep}</Text>}
                        <View style={styles.optionsContainer}>
                          <TouchableOpacity style={styles.optionButton}>
                            <Text style={styles.optionText}>Editar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleDeletePaciente(paciente.nome)}
                          >
                            <Text style={styles.optionText}>Desativar perfil</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    <View style={styles.line} />
                  </View>
                ))}
            </View>*/