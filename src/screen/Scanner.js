import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Fetch } from "../Model/bridge";
import config from "../Model/config";
import base64 from "react-native-base64";
import Myloader from "../Model/Myloader";
const Scanner = ({ route }) => {
  const { target } = route.params;
  const [Permission, SetPermission] = useState(null);
  const [Scanned, SetScan] = useState(false);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      SetPermission(status === "granted");
    })();
  }, []);
  const handleData = async ({ type, data }) => {
    SetScan(true);
    let arr = base64.decode(data).split(":");
    const deviceResult = await validateDevice(arr[0], arr[1]);
    if (deviceResult.Error) {
      alert(deviceResult.msg);
      return;
    }
    if (target == "TIMEIN") {
      timeIN(arr[0]);
    }
    if (target == "TIMEOUT") {
      timeOut(arr[0]);
    }
  };

  const validateDevice = async (id, device) => {
    try {
      let result = await fetch(config.validateDevice, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceid: device, id: id }),
      });
      return await result.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  async function getTimeIn(uid) {
    let timeIN;
    const data = {
      uid: uid,
      date: getDate(),
    };
    try {
      const result = await fetch(config.getTimeIn, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await result.json();
      if (res.Error) {
        return { status: true, msg: res.msg };
      }
      if (!res.Error) {
        timeIN = res.msg;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return timeIN;
  }

  function getDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getTime() {
    const currentDate = new Date();
    let hour = currentDate.getHours();
    const amOrPm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    const minute = String(currentDate.getMinutes()).padStart(2, "0");
    return `${hour}:${minute} ${amOrPm}`;
  }

  const timeIN = (uid) => {
    const data = {
      uid: uid,
      date: getDate(),
      time: getTime(),
    };
    Fetch(
      config.timein,
      "POST",
      (result) => {
        if (result.loading) {
          setloading(true);
        }
        if (!result.loading) {
          setloading(false);
          const data = JSON.parse(result.data);
          console.log(data);
          if (data.Error) {
            alert(data.msg);
            setTimeout(() => {
              SetScan(false);
            }, 3000);
          } else {
            alert(data.msg);
            setTimeout(() => {
              SetScan(false);
            }, 3000);
          }
        }
      },
      data
    );
  };

  function workhrs(time1, time2) {
    const [hour1, minute1, period1] = time1.split(/:| /);
    const [hour2, minute2, period2] = time2.split(/:| /);

    let hours1 = parseInt(hour1);
    let hours2 = parseInt(hour2);

    if (period1 === "PM" && hours1 < 12) {
      hours1 += 12;
    }
    if (period2 === "PM" && hours2 < 12) {
      hours2 += 12;
    }

    const minutes1 = parseInt(minute1);
    const minutes2 = parseInt(minute2);

    const time1InMinutes = hours1 * 60 + minutes1;
    const time2InMinutes = hours2 * 60 + minutes2;

    const differenceInMinutes = Math.abs(time1InMinutes - time2InMinutes);

    return differenceInMinutes;
  }
  async function findStatus(uid) {
    const timeIN = await getTimeIn(uid);
    const workhours = workhrs(getTime(), timeIN);
    if (workhours >= 600) {
      return "Overtime";
    }
    if (workhours < 525) {
      return "Undertime";
    }
  }
  const timeOut = async (uid) => {
    const timeIN = await getTimeIn(uid);
    if (timeIN.status == true) {
      alert(timeIN.msg);
      return;
    }
    const mystatus = await findStatus(uid);
    const data = {
      uid: uid,
      date: getDate(),
      time: getTime(),
      wrkhrs: workhrs(getTime(), timeIN),
      status: mystatus,
    };
    Fetch(
      config.timeout,
      "POST",
      (result) => {
        if (result.loading) {
          setloading(true);
        }
        if (!result.loading) {
          setloading(false);
          const res = JSON.parse(result.data);
          if (res.Error) {
            alert(res.msg);
            setTimeout(() => {
              SetScan(false);
            }, 3000);
          } else {
            alert(res.msg);
            setTimeout(() => {
              SetScan(false);
            }, 3000);
          }
        }
      },
      data
    );
  };
  if (Permission === null) {
    return <Text>Requesting Camera Permission</Text>;
  }

  if (Permission === false) {
    return <Text>No Access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Text style={styles.txt}>{target}</Text>
      <BarCodeScanner
        onBarCodeScanned={Scanned ? undefined : handleData}
        style={StyleSheet.absoluteFillObject}
      />
      <Myloader visible={loading} />
    </SafeAreaView>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  txt: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  qrbox: {
    width: "100%",
    height: 400,
  },
});
