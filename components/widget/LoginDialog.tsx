import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
    Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface LoginDialogProps {
    visible: boolean;
    onRequestClose: () => void;
}
export default function LoginDialog({ visible, onRequestClose }: LoginDialogProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);

            // For demo purposes, any login succeeds
            // In a real app, you would validate credentials with your backend
            router.replace('/(tabs)');
        }, 1500);
    };

    const handleSocialLogin = (provider: string) => {
        Alert.alert('Social Login', `Login with ${provider} coming soon!`);
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    const handleForgotPassword = () => {
        router.push('/forgot-password');
    };


    return <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => onRequestClose()}
    >
        <View style={styles.modalContainer}>

            <View style={{ ...styles.modalContent }}>
                <TouchableOpacity
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        height: 20,
                        justifyContent: 'flex-end',
                        
                    }}
                    onPress={() => onRequestClose()}
                >
                    <View style={{
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        backgroundColor: '#00000088',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <FontAwesome name='close' color='#fff'/>
                    </View>
                </TouchableOpacity>
                <View style={{ width: '100%' }}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.appName}>ChatApp</Text>
                    </View>

                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="envelope" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={handleForgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading || !email || !password}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    openModalText: {
        color: '#0088ff',
        fontSize: 18,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0088ff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '30%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#f1f1f1',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#0088ff',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#0088ff',
        borderRadius: 8,
        height: 50,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    loginButtonDisabled: {
        backgroundColor: '#99ccff',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeModalText: {
        color: '#ff0000',
    },
}); 