import React, { useState } from "react";
import { View, Text, TextInput, Button, SafeAreaView, ScrollView } from "react-native";

const EventFormScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            Login Screen
          </Text>
          <TextInput
            style={{
              height: 40,
              width: "80%",
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
              marginBottom: 10,
            }}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={{
              height: 40,
              width: "80%",
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
              marginBottom: 20,
            }}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventFormScreen;
