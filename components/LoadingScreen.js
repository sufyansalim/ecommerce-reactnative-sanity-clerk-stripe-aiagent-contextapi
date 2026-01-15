import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import Colors from "../constants/Colors";

const LoadingScreen = ({ message = "Loading, please wait..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.textMuted,
  },
});

export default LoadingScreen;
