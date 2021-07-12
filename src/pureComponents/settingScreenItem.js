import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

export const settingsScreenItem = ({ name }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text
          style={{
            color: Colors.BLACK,
            fontSize: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {name}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
