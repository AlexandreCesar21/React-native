import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="Medicos" options={{ 
                    headerTitle: "", // Remove o nome da tela
                    headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                }} />
            <Stack.Screen name="Paciente"  options={{ 
                    headerTitle: "", // Remove o nome da tela
                    headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                }} />
            <Stack.Screen name="Calendario" options={{ 
                    headerTitle: "", // Remove o nome da tela
                    headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                }} />

            <Stack.Screen name="Cadastro/CadastroConsult" options={{ 
                    headerTitle: "", // Remove o nome da tela
                    headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                }} />
            <Stack.Screen name="Cadastro/CadastroMedic" options={{ 
                    headerTitle: "", // Remove o nome da tela
                    headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                }} />
                <Stack.Screen name="Cadastro/CadastroPacien" options={{ 
                        headerTitle: "", // Remove o nome da tela
                        headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                    }} />
                <Stack.Screen name="funcionarios" options={{ 
                        headerTitle: "", // Remove o nome da tela
                        headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                    }} />
                <Stack.Screen name="Cadastro/CadastroFuncion" options={{ 
                    headerTitle: "", // Remove o nome da tela
                    headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                }} />
                <Stack.Screen name="inicial" options={{ 
                    headerTitle: "", // Remove o nome da tela
                    headerBackTitleVisible: false, // Remove o texto do botão de voltar (opcional)
                }} />
            </Stack>
    );
}