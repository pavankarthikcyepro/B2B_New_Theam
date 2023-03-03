import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const AnimLoaderComp = (props) => {
  const { visible = false } = props;
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    handleAnimation();
  }, [visible]);

  const handleAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ).start();
  };

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  const animatedStyle = {
    transform: [{ rotate: interpolateRotating }],
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[{ width: 30, height: 30 }, animatedStyle]}
        resizeMode={"contain"}
        source={require("../assets/images/cy.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: "center", marginVertical: 7 },
});

export default AnimLoaderComp;
