import React from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

export default function BetBoard({ symbols, bets, onPlaceBet }) {
  return (
    <View style={styles.betBoard}>
      {[0, 1].map((row) => (
        <View key={row} style={styles.betRow}>
          {symbols.slice(row * 3, row * 3 + 3).map((s) => (
            <TouchableOpacity
              key={s.key}
              style={styles.betSlot}
              onPress={() => onPlaceBet(s.key)}
            >
              <Image
                source={s.img}
                style={styles.betImage}
                resizeMode="contain"
              />
              <Text style={styles.betText}>Bet: {bets[s.key]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  betBoard: {
    backgroundColor: "#d7ccc8",
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  betRow: { flexDirection: "row", justifyContent: "center" },
  betSlot: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    margin: 6,
    padding: 8,
    alignItems: "center",
    width: 80,
  },
  betImage: { width: 50, height: 50, marginBottom: 4, borderRadius: 8 },
  betText: { fontSize: 12, fontWeight: "600", color: "#333" },
});
