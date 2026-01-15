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
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSignUp, useOAuth, useAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Warm up browser for OAuth
const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

const Register = ({ route }) => {
    useWarmUpBrowser();
    
    const navigation = useNavigation();
    const { signUp, setActive, isLoaded } = useSignUp();
    const { isSignedIn } = useAuth();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    
    // Check if user came from checkout flow (passed from Login screen)
    const returnToCheckout = route?.params?.returnToCheckout || false;
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

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

    // Email/Password Sign Up
    const handleSignUp = useCallback(async () => {
        if (!isLoaded) return;
        
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            // Send email verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err) {
            console.error('Sign up error:', err);
            const errorMessage = err.errors?.[0]?.message || 'Failed to create account. Please try again.';
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [isLoaded, firstName, lastName, email, password, signUp]);

    // Verify Email Code
    const handleVerification = useCallback(async () => {
        if (!isLoaded) return;

        setLoading(true);
        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                // Navigation is handled by useEffect when isSignedIn changes
            } else {
                console.log('Verification needs more steps:', result);
                Alert.alert('Verification', 'Please complete additional steps');
            }
        } catch (err) {
            console.error('Verification error:', err);
            const errorMessage = err.errors?.[0]?.message || 'Invalid verification code';
            Alert.alert('Verification Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    }, [isLoaded, verificationCode, signUp, setActive, navigation]);

    // Google OAuth Sign Up
    const handleGoogleSignUp = useCallback(async () => {
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
                Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [startOAuthFlow]);

    // Verification Code Screen
    if (pendingVerification) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setPendingVerification(false)}>
                        <Ionicons name='arrow-back' size={24} color='#fff' />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>VERIFY EMAIL</Text>
                    <View style={{ width: 24 }} />
                </View>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.verificationText}>
                        We've sent a verification code to {email}
                    </Text>
                    <View style={[styles.inputStyle, { marginTop: 20 }]}>
                        <Ionicons name="keypad-outline" size={20} color="#666" style={{ marginLeft: 10 }} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter Verification Code"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType="number-pad"
                            editable={!loading}
                        />
                    </View>
                    <TouchableOpacity 
                        style={[styles.registerButton, loading && styles.buttonDisabled]}
                        onPress={handleVerification}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>VERIFY</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back' size={24} color='#fff' />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>CREATE ACCOUNT</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <View style={styles.nameRow}>
                        <View style={[styles.inputStyleHalf, { marginRight: 5 }]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                editable={!loading}
                            />
                        </View>
                        <View style={[styles.inputStyleHalf, { marginLeft: 5 }]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                editable={!loading}
                            />
                        </View>
                    </View>
                    <View style={[styles.inputStyle, { marginTop: 10 }]}>
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
                        style={[styles.registerButton, loading && styles.buttonDisabled]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('AuthSignin')}>
                        <Text style={styles.linkText}>Already have an account? Sign In</Text>
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
                        onPress={handleGoogleSignUp}
                        disabled={loading}
                    >
                        <FontAwesome name="google" size={20} color='#fff' style={{ marginRight: 10 }} />
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Register;

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
        marginTop: 10,
    },
    nameRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    inputStyle: {
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyleHalf: {
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        height: 50,
        flex: 1,
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
    registerButton: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#000',
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#666',
    },
    registerButtonText: {
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
    verificationText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginTop: 20,
    },
});
