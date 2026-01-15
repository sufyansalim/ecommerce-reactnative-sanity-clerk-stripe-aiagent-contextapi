import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity, Image, ScrollView, BackHandler, Text,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import CustomHeader from "../../components/header/CustomHeader";
import Separator from "../../components/Separator";
import { useNavigation, useRoute } from '@react-navigation/native'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context';


const SideNavigationScreen = props => {
    const navigation = useNavigation();
    const route = useRoute();
    const routeName = route?.name || '';
    const [profileImage, setProfileImage] = useState(null);
    
    // Get auth state from context
    const { isSignedIn, userName, userImage, userEmail, signOut, isLoaded } = useAuth();

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to change your profile picture.');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigation.navigate('Main', { screen: 'HomeStack' });
        } catch (err) {
            console.error('Sign out error:', err);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
        }
    };

    const handleSignIn = () => {
        navigation.navigate('AuthSignin');
    };

    // Determine the profile image to display
    const displayImage = profileImage 
        ? { uri: profileImage } 
        : userImage 
            ? { uri: userImage }
            : require('../../assets/images/home/m6.png');

    return (
        <CustomHeader navigation={navigation} >
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}>
            <View style={{backgroundColor: Colors.backgroundDark, flex: 0.3, width: "100%"}} >
                <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                    <Image 
                        style={styles.imageContainer} 
                        source={displayImage}
                    />
                    {isSignedIn && (
                        <View style={styles.editIconOverlay}>
                            <Ionicons name="camera" size={16} color={Colors.textWhite} />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignSelf:'center'}}>
                    <Text style={{ fontWeight: 'bold', color:"white", marginTop: 10, marginBottom: 10  }}>
                        {isSignedIn ? userName : 'Guest User'}
                    </Text>
                </View>
                {isSignedIn && userEmail && (
                    <View style={{flexDirection: 'row', alignSelf:'center', marginBottom: 10}}>
                        <Text style={{ color:"rgba(255,255,255,0.7)", fontSize: 12 }}>
                            {userEmail}
                        </Text>
                    </View>
                )}
            </View>

                <View style={{flex: 0.7, backgroundColor: Colors.background}}>
                    <TouchableOpacity style={{flexDirection: 'row', marginLeft: 5,marginTop: 5, marginBottom: 5}} onPress ={() => {navigation.navigate('WishlistScreen') }}>
                        <Image style={styles.imageContainer2} source={require('../../assets/menu/My-Wishlist.png')}/>
                        <Text style={styles.text}>My Wishlist</Text>
                    </TouchableOpacity>
                    <Separator/>
                        <TouchableOpacity style={{flexDirection: 'row' ,marginLeft: 5,marginTop: 5, marginBottom: 5}} onPress={() => navigation.navigate('MyOrderScreen')}>
                            <Image style={styles.imageContainer2} source={require('../../assets/menu/My-Order.png')}/>
                            <Text style={styles.text}>My Order</Text>
                        </TouchableOpacity>
                    <Separator/>
                    <TouchableOpacity style={{flexDirection: 'row', marginLeft: 5,marginTop: 5, marginBottom: 5 }} onPress={() => {navigation.navigate('TV')}}>
                        <Image style={styles.imageContainer2} source={require('../../assets/menu/tv.png')}/>
                        <Text style={styles.text}>TV</Text>
                    </TouchableOpacity>
                    <Separator/>
                    <TouchableOpacity style={{flexDirection: 'row', marginLeft: 5,marginTop: 5, marginBottom: 5 }}   onPress={() => navigation.navigate('AboutUsScreen')}>
                        <Image style={styles.imageContainer2} source={require('../../assets/menu/About-Us.png')}/>
                        <Text style={styles.text}>About Us / Contact Us</Text>
                    </TouchableOpacity>
                    <Separator/>
                    <TouchableOpacity
                    onPress ={() => {navigation.navigate('Chat')}}  
                    style={{flexDirection: 'row', marginLeft: 5,marginTop: 5, marginBottom: 5 }} >
                        <Image style={styles.imageContainer2} source={require('../../assets/menu/Chat-With-Us.png')}/>
                        <Text style={styles.text}>Chat With Us </Text>
                    </TouchableOpacity>
                    <Separator/>
                    <TouchableOpacity style={{flexDirection: 'row', marginLeft: 5,marginTop: 5, marginBottom: 5 }}   onPress={() => navigation.navigate('ShopTheLookScreen')}>
                        <Image style={styles.imageContainer2} source={require('../../assets/menu/tv.png')}/>
                        <Text style={styles.text}>Shop The Look</Text>
                    </TouchableOpacity>
                    <Separator/>
                    <Separator/>
                    {isSignedIn ? (
                        <TouchableOpacity style={{flexDirection: 'row', marginLeft: 5,marginTop: 5, marginBottom: 5 }} onPress={handleSignOut}>
                            <Image style={styles.imageContainer2} source={require('../../assets/menu/Log-Out.png')}/>
                            <Text style={styles.text}>Logout</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{flexDirection: 'row', marginLeft: 5,marginTop: 5, marginBottom: 5 }} onPress={handleSignIn}>
                            <Ionicons name="log-in-outline" size={24} color={Colors.primary} />
                            <Text style={styles.text}>Sign In</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </CustomHeader>

    );
};

export default SideNavigationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    text:{
        color: Colors.primary,
        marginTop:5,
        marginBottom: 5,
        marginLeft: 10,
        fontWeight: "bold"
    },
    profileImageContainer: {
        alignSelf: 'center',
        marginTop: 10,
        position: 'relative',
    },
    imageContainer:{
        height: 90,
        width: 90,
        borderRadius: 45,
        resizeMode: 'cover',
        borderWidth: 2,
        borderColor: Colors.textWhite,
        overflow: 'hidden',
    },
    editIconOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.success,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.textWhite,
    },
    checkoutText:{
        flex: 0.08,
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop: 7,
        marginLeft: 9,
        marginRight: 9
    },
    imageContainer2:{
        height: 24,
        width: 24,
        resizeMode: 'contain',
    }

});


