import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="Medicos" options={{ 
                    headerTitle: "", 
                    headerBackTitleVisible: false, 
                }} />
            <Stack.Screen name="Paciente"  options={{ 
                    headerTitle: "", 
                    headerBackTitleVisible: false, 
                }} />
            <Stack.Screen name="Calendario" options={{ 
                    headerTitle: "", 
                    headerBackTitleVisible: false,
                }} />

            <Stack.Screen name="Cadastro/CadastroConsult" options={{ 
                    headerTitle: "", 
                    headerBackTitleVisible: false, 
                }} />
            <Stack.Screen name="Cadastro/CadastroMedic" options={{ 
                    headerTitle: "", 
                    headerBackTitleVisible: false,
                }} />
                <Stack.Screen name="Cadastro/CadastroPacien" options={{ 
                        headerTitle: "", 
                        headerBackTitleVisible: false, 
                    }} />
                <Stack.Screen name="funcionarios" options={{ 
                        headerTitle: "", 
                        headerBackTitleVisible: false, 
                    }} />
                <Stack.Screen name="Cadastro/CadastroFuncion" options={{ 
                    headerTitle: "", 
                    headerBackTitleVisible: false, 
                }} />
                <Stack.Screen name="inicial" options={{ 
                    headerTitle: "", 
                    headerBackTitleVisible: false, 
                    headerShown: false
                }} />
            </Stack>
    );
}