import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";
import { pickRandom } from "../lib/gameData";

const Dice = forwardRef((props, ref) => {
  const [face, setFace] = useState(pickRandom());
  const anim = useRef(new Animated.Value(0)).current;

  useImperativeHandle(ref, () => ({
    roll: () =>
      new Promise((resolve) => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();

        let count = 0;
        const interval = setInterval(() => {
          setFace(pickRandom());
          count++;
          if (count > 10) {
            clearInterval(interval);
            const finalFace = pickRandom();
            setFace(finalFace);
            anim.setValue(0);
            resolve(finalFace);
          }
        }, 80);
      }),
  }));

  const translateX = anim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -6, 6, -3, 0],
  });

  return (
    <Animated.View style={[styles.diceHolder, { transform: [{ translateX }] }]}>
      <Image source={face.img} style={styles.diceImage} resizeMode="contain" />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  diceHolder: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
  },
  diceImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});

export default Dice;
