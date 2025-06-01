import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import Layout from '@/components/layout_consulta';
import Icon from 'react-native-vector-icons/Feather';

const Calendario = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMedico, setExpandedMedico] = useState<number | null>(null);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleToggleExpand = (index: number) => {
    setExpandedMedico(expandedMedico === index ? null : index);
  };

  const agendamentos = [
    {
      data: '26/03/2025',
      hora: '9h00',
      medico: {
        nome: 'Adriano Moreira Sales',
        especialidade: 'Ginecologista',
        crm: 'CRM 15.879-SP',
      },
      paciente: {
        nome: 'Marcela Trindade',
      },
    },
    {
      data: '26/03/2025',
      hora: '9h00',
      medico: {
        nome: 'Bernardo Oliveira',
        especialidade: 'Pediatra',
        crm: 'CRM 15.879-SP',
      },
      paciente: {
        nome: 'Carlos Eduardo de Oliveira',
      },
    },
    {
      data: '28/03/2025',
      hora: '10h00',
      medico: {
        nome: 'Amanda Siqueira',
        especialidade: 'Dermatologista',
        crm: 'CRM 22.879-SP',
      },
      paciente: {
        nome: 'Luciana Costa',
      },
    },
  ];

  const filterAgendamentos = () => {
    return agendamentos.filter((agendamento) =>
      agendamento.medico.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

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
        {filterAgendamentos().map((agendamento, index) => (
          <View key={index} style={styles.medicoContainer}>
            <View style={styles.medicoHeader}>
              <Text style={styles.medicoData}>{agendamento.data}</Text>
            </View>

            <View style={styles.medicoHeader}>
              <Text style={styles.medicoName}>{agendamento.hora}</Text>
              <TouchableOpacity
                style={styles.arrowContainer}
                onPress={() => handleToggleExpand(index)}
              >
                <Icon name={expandedMedico === index ? 'chevron-down' : 'chevron-right'} size={24} color="#007BFF" />
              </TouchableOpacity>
            </View>

            {expandedMedico === index && (
              <View style={styles.medicoContainer}>
                <Text style={styles.medicoInfo}>{agendamento.medico.nome}</Text>
                <Text style={styles.medicoInfo}>{agendamento.medico.especialidade} | {agendamento.medico.crm}</Text>
                <Text style={styles.medicoInfo}>{agendamento.paciente.nome}</Text>
                <Text style={styles.medicoInfo}>Paciente</Text>
                <View style={styles.line} />

                <View style={styles.optionsContainer } >
                        <TouchableOpacity style={styles.optionButton}>
                            <Text style={styles.optionText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionButton}>
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
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
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

export default Calendario;
