import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleCadastrarMedico = () => {
    router.push('/Cadastro/CadastroFuncion'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>

      <TouchableOpacity style={styles.fixedButton} onPress={handleCadastrarMedico}>
        <Text style={styles.buttonText}>Cadastrar funcionários</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  fixedButton: {
    backgroundColor: '#0B3B60',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Layout;