import React from 'react'
import { Text, BackHandler, StyleSheet, View } from 'react-native'
// TODO: GiftedChat is temporarily disabled because react-native-keyboard-controller
// requires a native build (not compatible with Expo Go)
// import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
// import QuickReplies from "react-native-gifted-chat/lib/QuickReplies";
import CustomHeader from '../../components/header/CustomHeader';
import Colors from '../../constants/Colors';

export default function Chat({ navigation }) {
  return (
    <CustomHeader navigation={navigation}>
      <View style={styles.container}>
        <View style={styles.messageBox}>
          <Text style={styles.title}>Chat Support</Text>
          <Text style={styles.message}>
            Chat feature is temporarily unavailable in Expo Go.
          </Text>
          <Text style={styles.submessage}>
            To enable chat, build a development client with: npx expo prebuild
          </Text>
        </View>
      </View>
    </CustomHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.backgroundLight,
  },
  messageBox: {
    backgroundColor: Colors.background,
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.textSecondary,
  },
  message: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 10,
  },
  submessage: {
    fontSize: 12,
    color: Colors.iconMuted,
    textAlign: 'center',
  },
});