import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

const DrawerItems=({navigation})=>{
 
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={{backgroundColor: Colors.background, width:'100%',}}>
            <View style={{marginTop:50,paddingTop:50}}>
                <TouchableOpacity  onPress={() => navigation.navigate('AuthSignin')}>
                      <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('AuthSignup')}>
                       <Text style={styles.text}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('FeedbackScreen')}>
                    <Text style={styles.text}>Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('WishlistScreen')}>
                    <Text style={styles.text}>My Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('ShippingAddressScreen')}>
                    <Text style={styles.text}>Shipping Address</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('AboutUsScreen')}>
                    <Text style={styles.text}>About Us</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => navigation.navigate('ContactUsScreen')}>
                    <Text style={styles.text}>Contact Us</Text>
                </TouchableOpacity>
                <Text style={styles.text}>Logout</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default DrawerItems;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    text:{
      color: Colors.primary,
      marginTop:5,
      paddingTop:5,
        fontWeight: "bold"
    },
  });
  

