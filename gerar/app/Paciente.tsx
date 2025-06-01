import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import Layout from '../components/layour_pacien';
import Icon from 'react-native-vector-icons/Feather';

const ListaPacientes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMedico, setExpandedMedico] = useState<number | null>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleToggleExpand = (index: number) => {
    setExpandedMedico(expandedMedico === index ? null : index);
  };

  const medicos = [
    { nome: 'Adriano Moreira Sales', cidade: 'São Paulo', email: 'adriano@gmail.com' , telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Amanda Siqueira', cidade: 'São Paulo', email: 'amanda@gmail.com' , telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Antônio Santana', cidade: 'São Paulo', email: 'antonio@gmail.com' , telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Barbara Aparecida',  cidade: 'São Paulo', email: 'barbara@gmail.com' , telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Bernardo Oliveira',  cidade: 'São Paulo', email: 'bernardo@gmail.com' , telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
    { nome: 'Brenda de Almeida', cidade: 'Curitiba/PR', email: 'brenda@gmail.com' , telefone: '(51) 99999-8888', endereco: 'Av. das Graças Altas, 633 - Curitiba/PR', cep: '66.777-100' },
  ];

  const medicosFiltrados = medicos
    .filter((medico) => medico.nome.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const letras = ['A', 'B'];

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
        {searchQuery.length > 0 ? (
       
          medicosFiltrados.map((medico, index) => (
            <View key={index} style={styles.medicoContainer}>
              <View style={styles.medicoHeader}>
                <Text style={styles.medicoName}>{medico.nome}</Text>
                <TouchableOpacity
                  style={styles.arrowContainer}
                  onPress={() => handleToggleExpand(index)}
                >
                  <Icon name={expandedMedico === index ? 'chevron-down' : 'chevron-right'} size={24} color="#007BFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.medicoInfo}>{medico.telefone}</Text>

              {expandedMedico === index && (
                <View style={styles.medicoDetails}>
                  {medico.email && <Text style={styles.medicoInfo}>{medico.email}</Text>}
                  {medico.endereco && <Text style={styles.medicoInfo}>{medico.endereco}</Text>}
                  {medico.cidade && <Text style={styles.medicoInfo}>{medico.cidade}</Text>}
                  {medico.cep && <Text style={styles.medicoInfo}>CEP: {medico.cep}</Text>}
                  <View style={styles.optionsContainer}>
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
          ))
        ) : (
         
          letras.map((letra) => (
            <View key={letra} style={styles.letterSection}>
              <Text style={styles.letterTitle}>{letra}</Text>
              {medicosFiltrados
                .filter(medico => medico.nome.toUpperCase().charAt(0) === letra)
                .map((medico, index) => (
                  <View key={index} style={styles.medicoContainer}>
                    <View style={styles.medicoHeader}>
                      <Text style={styles.medicoName}>{medico.nome}</Text>
                      <TouchableOpacity
                        style={styles.arrowContainer}
                        onPress={() => handleToggleExpand(index)}
                      >
                        <Icon name={expandedMedico === index ? 'chevron-down' : 'chevron-right'} size={24} color="#007BFF" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.medicoInfo}>{medico.telefone}</Text>

                    {expandedMedico === index && (
                      <View style={styles.medicoDetails}>
                        {medico.email && <Text style={styles.medicoInfo}>{medico.email}</Text>}
                        {medico.endereco && <Text style={styles.medicoInfo}>{medico.endereco}</Text>}
                        {medico.cidade && <Text style={styles.medicoInfo}>{medico.cidade}</Text>}
                        {medico.cep && <Text style={styles.medicoInfo}>CEP: {medico.cep}</Text>}
                        <View style={styles.optionsContainer}>
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
                ))}
            </View>
          ))
        )}
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
  letterSection: {
    marginTop: 20,
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
  }
});

export default ListaPacientes;
