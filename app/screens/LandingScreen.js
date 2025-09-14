// app/screens/LandingScreen.js
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SYMBOLS } from "../lib/gameData";
import useLoadResources from "../lib/useLoadResources";

export default function LandingScreen() {
  const router = useRouter();
  const [enableHistory, setEnableHistory] = useState(false);

  const ready = useLoadResources();
  if (!ready) {
    return (
      <LinearGradient
        colors={["#0E1B2E", "#122845"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaView style={styles.loadingScreen}>
          <ActivityIndicator color="#fff" size="large" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const icons = SYMBOLS.map((s) => s.img);

  const handleStart = () => {
    router.push({
      pathname: "/play",
      params: { enableHistory: enableHistory.toString() },
    });
  };

  return (
    <LinearGradient
      colors={["#0E1B2E", "#122845"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrap}>
          <View style={styles.content}>
            <View style={styles.titleBox}>
              <Text
                style={[
                  styles.titleWelcome,
                  {
                    fontFamily: Platform.OS === "android" ? "serif" : undefined,
                  },
                ]}
              >
                Welcome!
              </Text>
            </View>

            <View style={styles.grid}>
              {icons.map((src, i) => (
                <View key={i} style={styles.tile}>
                  <Image
                    source={src}
                    contentFit="contain"
                    recycleMemory
                    transition={0}
                    style={styles.tileImg}
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleStart}
              style={styles.startWrap}
            >
              <LinearGradient
                colors={["#22D3EE", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtn}
              >
                <Text style={styles.startText}>Start</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Enable History</Text>
              <Switch
                value={enableHistory}
                onValueChange={setEnableHistory}
                trackColor={{
                  false: "rgba(255,255,255,0.25)",
                  true: "#22D3EE",
                }}
                thumbColor={enableHistory ? "#f5f2f2" : "#ccc"}
                ios_backgroundColor="rgba(255,255,255,0.25)"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Image
              source={require("../../assets/images/copyright.png")}
              style={styles.copyrightIcon}
              contentFit="contain"
              transition={0}
            />
            <Text style={styles.copyrightText}>
              2025 Jhandi Burja. All rights reserved.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center" },
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
  },
  titleBox: { alignItems: "center", marginBottom: 40 },
  titleWelcome: {
    color: "#fff",
    fontSize: 46,
    letterSpacing: 1,
    fontWeight: "bold",
  },
  grid: {
    width: 220,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 44,
  },
  tile: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  tileImg: { width: "100%", height: "100%", borderRadius: 14 },
  startWrap: { marginTop: 20, marginBottom: 12 },
  startBtn: {
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 28,
  },
  startText: { color: "#fff", fontSize: 18, fontWeight: "800" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  toggleLabel: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 6,
    gap: 6,
  },
  copyrightIcon: { width: 18, height: 18, tintColor: "#ccc" },
  copyrightText: { color: "#ccc", fontSize: 12 },
});
