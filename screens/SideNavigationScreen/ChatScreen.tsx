import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

import CustomHeader from '../../components/header/CustomHeader';
import Colors from '../../constants/Colors';
import { HomeStackParamList } from '../../types/navigation';

interface ChatProps {
  navigation: NavigationProp<any>;
}

const Chat: React.FC<ChatProps> = ({ navigation }) => {
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
};

export default Chat;

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
