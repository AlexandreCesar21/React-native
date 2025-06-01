import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>

      <TouchableOpacity style={[styles.fixedButton, styles.concluirButton]}>
        <Text style={styles.buttonText}>Agendar nova consulta</Text>
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
    padding: 4,
  },
  fixedButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5, 
    marginBottom: 10, 
    width: '90%', 
    alignSelf: 'center', 
  },
  concluirButton: {
    backgroundColor: '#0B3B60', 
  },
  cancelarButton: {
    backgroundColor: '#fff', 
    borderWidth: 2, 
    borderColor: '#0B3B60', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Layout;
