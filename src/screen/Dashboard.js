import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
const Dashboard = () => {
  const screen = useNavigation();
  return (
    <View style={styles.container}>
      <Image source={require("../img/logo.png")} style={styles.img} />
      <Text style={styles.txt}>Employee QR Code Scanner</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          screen.navigate("Scanner", { target: "TIMEIN" });
        }}
      >
        <View style={styles.btnCon}>
          <Text style={styles.btnTxt}>TIME IN</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          screen.navigate("Scanner", { target: "TIMEOUT" });
        }}
      >
        <View style={styles.btnCon}>
          <Text style={styles.btnTxt}>TIME OUT</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  img: {
    width: "70%",
    height: 300,
    resizeMode: "contain",
    marginTop: "10%",
    marginBottom: "10%",
  },
  txt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: "10%",
  },
  btn: {
    width: "70%",
    backgroundColor: "#eaaa00",
    borderRadius: 8,
    marginBottom: 30,
    padding: 10,
  },
  btnCon: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
