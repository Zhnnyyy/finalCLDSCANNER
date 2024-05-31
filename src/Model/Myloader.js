import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";

const Myloader = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};
export default Myloader;
const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent background
  },
});
