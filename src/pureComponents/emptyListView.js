
import React from 'react';
import { View, Text } from "react-native";
import AnimLoaderComp from '../components/AnimLoaderComp';
import { Colors } from '../styles';

export const EmptyListView = ({ title, isLoading = false }) => {

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {isLoading ? (
          <AnimLoaderComp visible={true} />
        ) : (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: Colors.GRAY,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        )}
      </View>
    );
}