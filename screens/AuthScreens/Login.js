import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useSignIn, useOAuth, useAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Warm up browser for OAuth
export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

const Login = ({ route }) => {
    useWarmUpBrowser();
    
    const navigation = useNavigation();
    const { signIn, setActive, isLoaded } = useSignIn();
    const { isSignedIn } = useAuth();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    
    // Check if user came from checkout flow
    const returnToCheckout = route?.params?.returnToCheckout || false;
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Navigate when signed in
    useEffect(() => {
        if (isSignedIn) {
            if (returnToCheckout) {
                navigation.replace('Checkout');
            } else {
                navigation.replace('Main', { screen: 'HomeStack' });
            }
        }
    }, [isSignedIn, returnToCheckout, navigation]);

    // Email/Password Sign In
    const handleEmailSignIn = useCallback(async () => {
        if (!isLoaded) return;
        
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const result = await signIn.create({
                identifier: email,
                password: password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                // Navigation is handled by useEffect when isSignedIn changes
            } else {
                console.log('Sign in requires additional steps:', result);
                Alert.alert('Sign In', 'Please complete the additional verification steps');
            }
        } catch (err) {
            console.error('Sign in error:', err);
            const errorMessage = err.errors?.[0]?.message || 'Failed to sign in. Please try again.';
            Alert.alert('Sign In Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [isLoaded, email, password, signIn, setActive, navigation]);

    // Google OAuth Sign In
    const handleGoogleSignIn = useCallback(async () => {
        try {
            setLoading(true);
            const redirectUrl = Linking.createURL('/oauth-callback');
            const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow({ redirectUrl });
            
            if (createdSessionId) {
                await setOAuthActive({ session: createdSessionId });
                // Navigation is handled by useEffect when isSignedIn changes
            }
        } catch (err) {
            console.error('Google OAuth error:', err);
            if (err.message !== 'OAuth flow was cancelled') {
                Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [startOAuthFlow]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' size={24} color='#fff' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SIGN IN</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <View style={[styles.inputStyle, { marginTop: 20 }]}>
                        <Ionicons name="mail-outline" size={20} color="#666" style={{ marginLeft: 10 }} />
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Email Address" 
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={!loading}
                        />
                    </View>
                    <View style={[styles.inputStyle, { marginTop: 10 }]}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" style={{ marginLeft: 10 }} />
                        <TextInput 
                            style={styles.textInput} 
                            placeholder="Password" 
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!loading}
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.loginButton, loading && styles.buttonDisabled]}
                        onPress={handleEmailSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>SIGN IN</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('AuthSignup', { returnToCheckout })}>
                        <Text style={styles.linkText}>Don't have an account? Register</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialContainer}>
                    <TouchableOpacity 
                        style={styles.googleButton}
                        onPress={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <FontAwesome name="google" size={20} color='#fff' style={{ marginRight: 10 }} />
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.skipContainer}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Main', { screen: 'HomeStack' })}
                    >
                        <Text style={styles.skipText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        flexGrow: 1,
    },
    formContainer: {
        alignItems: 'center',
    },
    inputStyle: {
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 25,
    },
    loginButton: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#000',
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#666',
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linksContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    linkText: {
        color: '#000',
        fontSize: 14,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#666',
        fontSize: 14,
    },
    socialContainer: {
        alignItems: 'center',
    },
    googleButton: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#db4437',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    socialButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    skipContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    skipText: {
        color: '#666',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
