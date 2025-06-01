import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import Layout from '../components/layout_funcion' 
import Icon from 'react-native-vector-icons/Feather'; 

const Funcionarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMedico, setExpandedMedico] = useState<number | null>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  }

  const handleToggleExpand = (index: number) => {
    setExpandedMedico(expandedMedico === index ? null : index); 
  }

  const medicos = [
    { nome: 'Adriano Moreira Sales', especialidade: 'Ginecologista', crm: 'CRM 15.879-SP', cidade: 'São Paulo', telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Amanda Siqueira', especialidade: 'Oftalmologista', crm: 'CRM 65.789-SP', cidade: 'São Paulo', telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Antônio Santana', especialidade: 'Clínico Geral', crm: 'CRM 37.124-SP', cidade: 'São Paulo', telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Barbara Aparecida', especialidade: 'Pediatra', crm: 'CRM 15.879-SP', cidade: 'São Paulo', telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Bernardo Oliveira', especialidade: 'Pediatra', crm: 'CRM 15.879-SP', cidade: 'São Paulo', telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Brenda de Almeida', especialidade: 'Ortopedista', crm: 'CRM 47.889-PR', cidade: 'Curitiba/PR', telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
  ];

  
  const medicosFiltrados = medicos
    .filter((medico) => medico.nome.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <Layout>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar médico"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <Image source={require('../assets/images/lupa.png')} style={styles.searchIcon} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {medicosFiltrados.map((medico, index) => (
          <View key={index}>
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
                  <Icon name={expandedMedico === index ? "chevron-down" : "chevron-right"} size={24} color="#007BFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.medicoInfo}>{medico.especialidade} | {medico.crm}</Text>

              {expandedMedico === index && (
                <View style={styles.medicoDetails}>
                  {medico.telefone && <Text style={styles.medicoInfo}>Telefone: {medico.telefone}</Text>}
                  {medico.endereco && <Text style={styles.medicoInfo}>Endereço: {medico.endereco}</Text>}
                  {medico.cep && <Text style={styles.medicoInfo}>CEP: {medico.cep}</Text>}
                  
                  {/* As opções serão exibidas abaixo do CEP */}
                  <View style={styles.optionsContainer } >
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Desativar perfil</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <View style={styles.line} />
            </View>
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
  }
});

export default Funcionarios;
