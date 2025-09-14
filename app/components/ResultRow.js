import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ResultRow({ symbols, tally }) {
  return (
    <View>
      <Text style={styles.resultTitle}>Result:</Text>
      <View style={styles.resultRow}>
        {symbols.map((s) => (
          <Text key={s.key} style={styles.resultText}>
            {s.emoji} × {tally[s.key] || 0}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultTitle: { fontSize: 18, fontWeight: "700", marginTop: 6 },
  resultRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  resultText: { fontSize: 16, marginHorizontal: 6 },
});
