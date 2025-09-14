import React from "react";
import { View, StyleSheet } from "react-native";
import Dice from "./Dice";

export default function DiceBoard({ diceRefs }) {
  return (
    <View style={styles.board}>
      {[0, 1].map((row) => (
        <View key={row} style={styles.diceRow}>
          {diceRefs.slice(row * 3, row * 3 + 3).map((ref, idx) => (
            <Dice key={idx + row * 3} ref={ref} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: "#0b6623",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  diceRow: { flexDirection: "row", justifyContent: "center" },
});
