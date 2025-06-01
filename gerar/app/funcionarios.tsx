// IMPORTS
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from '../components/layout_funcion';
import Icon from 'react-native-vector-icons/Feather';

const Funcionarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFuncionario, setExpandedFuncionario] = useState<number | null>(null);
  const [funcionarios, setFuncionarios] = useState<Array<any>>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState<any>(null);

  // Carrega os funcionários
  useEffect(() => {
    const carregarFuncionarios = async () => {
      try {
        const dados = await AsyncStorage.getItem('funcionarios');
        const lista = dados ? JSON.parse(dados) : [];
        setFuncionarios(lista);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os funcionários.');
      }
    };

    carregarFuncionarios();
  }, []);

  // Atualiza campo da pesquisa
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Expande/oculta detalhes
  const handleToggleExpand = (index: number) => {
    setExpandedFuncionario(expandedFuncionario === index ? null : index);
  };

  // Desativa o funcionário
  const desativarFuncionario = (func: any) => {
  Alert.alert(
    'Excluir Perfil',
    `Tem certeza que deseja excluir o funcionário ${func.nome}?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const listaAtualizada = funcionarios.filter(
              (item) => (item.id || item.nome) !== (func.id || func.nome)
            );
            await AsyncStorage.setItem('funcionarios', JSON.stringify(listaAtualizada));
            setFuncionarios(listaAtualizada);
            Alert.alert('Sucesso', `${func.nome} foi excluído com sucesso.`);
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir o funcionário.');
          }
        },
      },
    ]
  );
};


  // Abre modal e preenche dados para edição
  const editarFuncionario = (func: any) => {
    setFuncionarioEditando({ ...func });
    setModalVisible(true);
  };

  // Atualiza campo de edição
  const atualizarCampo = (campo: string, valor: string) => {
    setFuncionarioEditando({ ...funcionarioEditando, [campo]: valor });
  };

  // Salva alterações
  const salvarEdicao = async () => {
    const listaAtualizada = funcionarios.map((item) =>
      (item.id || item.nome) === (funcionarioEditando.id || funcionarioEditando.nome)
        ? funcionarioEditando
        : item
    );

    try {
      await AsyncStorage.setItem('funcionarios', JSON.stringify(listaAtualizada));
      setFuncionarios(listaAtualizada);
      setModalVisible(false);
      Alert.alert('Sucesso', 'Funcionário atualizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  // Filtra e ordena
  const funcionariosFiltrados = funcionarios
    .filter((func) => func.nome.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Layout>
      {/* Campo de Pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar funcionário"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <Image source={require('../assets/images/lupa.png')} style={styles.searchIcon} />
      </View>

      {/* Lista de Funcionários */}
      <ScrollView style={styles.scrollContainer}>
        {funcionariosFiltrados.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhum funcionário encontrado.
          </Text>
        ) : (
          funcionariosFiltrados.map((funcionario, index) => (
            <View key={index}>
              {(index === 0 ||
                funcionario.nome.charAt(0) !== funcionariosFiltrados[index - 1].nome.charAt(0)) && (
                <Text style={styles.letterTitle}>{funcionario.nome.charAt(0)}</Text>
              )}
              <View style={styles.funcionarioContainer}>
                <View style={styles.funcionarioHeader}>
                  <Text style={styles.funcionarioName}>{funcionario.nome}</Text>
                  <TouchableOpacity
                    style={styles.arrowContainer}
                    onPress={() => handleToggleExpand(index)}
                  >
                    <Icon
                      name={expandedFuncionario === index ? 'chevron-down' : 'chevron-right'}
                      size={24}
                      color="#007BFF"
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.funcionarioInfo,
                    funcionario.desativado && { color: 'red', textDecorationLine: 'line-through' },
                  ]}
                >
                  {funcionario.funcao}
                </Text>

         
                {expandedFuncionario === index && (
                  <View style={styles.funcionarioDetails}>
                    {funcionario.telefone && (
                      <Text style={styles.funcionarioInfo}>Telefone: {funcionario.telefone}</Text>
                    )}
                    {funcionario.endereco && (
                      <Text style={styles.funcionarioInfo}>Endereço: {funcionario.endereco}</Text>
                    )}
                    {funcionario.cidade && (
                      <Text style={styles.funcionarioInfo}>Cidade: {funcionario.cidade}</Text>
                    )}
                    {funcionario.cep && (
                      <Text style={styles.funcionarioInfo}>CEP: {funcionario.cep}</Text>
                    )}
                    {funcionario.logradouro && (
                      <Text style={styles.funcionarioInfo}>Endereço: {funcionario.logradouro} N°{funcionario.numero}</Text>
                    )}

                    <View style={styles.optionsContainer}>
                      <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => editarFuncionario(funcionario)}
                      >
                        <Text style={styles.optionText}>Editar</Text>
                      </TouchableOpacity>
                      {!funcionario.desativado && (
                        <TouchableOpacity
                          style={styles.optionButton}
                          onPress={() => desativarFuncionario(funcionario)}
                        >
                          <Text style={styles.optionText}>Desativar perfil</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
                <View style={styles.line} />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal de Edição */}
     <Modal visible={modalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Editar Funcionário</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={funcionarioEditando?.nome}
        onChangeText={(text) => atualizarCampo('nome', text)}
        placeholder="Nome"
      />

      <Text style={styles.label}>Função</Text>
      <TextInput
        style={styles.input}
        value={funcionarioEditando?.funcao}
        onChangeText={(text) => atualizarCampo('funcao', text)}
        placeholder="funcao"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={funcionarioEditando?.telefone}
        onChangeText={(text) => atualizarCampo('telefone', text)}
        placeholder="Telefone"
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        style={styles.input}
        value={funcionarioEditando?.endereco}
        onChangeText={(text) => atualizarCampo('endereco', text)}
        placeholder="Endereço"
      />

      <Text style={styles.label}>Cidade</Text>
      <TextInput
        style={styles.input}
        value={funcionarioEditando?.cidade}
        onChangeText={(text) => atualizarCampo('cidade', text)}
        placeholder="Cidade"
      />

      <Text style={styles.label}>CEP</Text>
      <TextInput
        style={styles.input}
        value={funcionarioEditando?.cep}
        onChangeText={(text) => atualizarCampo('cep', text)}
        placeholder="CEP"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.optionButton]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.optionText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={salvarEdicao}>
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
  label: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 4,
  marginTop: 12,
  color: '#0B3B60',
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
  letterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  funcionarioContainer: {
    marginBottom: 15,
  },
  funcionarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  funcionarioName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  funcionarioInfo: {
    fontSize: 14,
    color: '#555',
  },
  funcionarioDetails: {
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
    modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0B3B60'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default Funcionarios;
