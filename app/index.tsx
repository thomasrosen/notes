import React from "react";
import { StyleSheet, View } from "react-native";

import { Map } from "@/components/Map";

export default function MapScreenWeb() {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
