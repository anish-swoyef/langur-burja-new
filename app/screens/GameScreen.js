// app/screens/GameScreen.js
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentRollsSheet from "../components/RecentRollsSheet";
import { DICE_SOUNDS, pickRandom, randInt, SYMBOLS } from "../lib/gameData";

const SCREEN_BG = "#0E1B2E";
const BOARD_BG = "#0F223A";
const FRAME_LT = "#E0E6F2";
const BTN_RED = "#D32F2F";

const soundPool = { ready: false, list: [] };

async function ensureSoundPool() {
  if (soundPool.ready) return;
  soundPool.list = [];
  for (const src of DICE_SOUNDS) {
    const { sound } = await Audio.Sound.createAsync(src, { shouldPlay: false });
    soundPool.list.push(sound);
  }
  soundPool.ready = true;
}

export default function GameScreen() {
  const router = useRouter();
  const { enableHistory: paramEnable } = useLocalSearchParams();
  const [historyEnabled, setHistoryEnabled] = useState(paramEnable === "true");

  const [diceFaces, setDiceFaces] = useState(Array(6).fill(0).map(pickRandom));
  const [history, setHistory] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [rolling, setRolling] = useState(false);

  const intervalRef = useRef(null);
  const currentSoundRef = useRef(null);

  const { diceSize, dicePad, cellMargin } = useMemo(() => {
    const SW = Dimensions.get("window").width;
    const DICE_W = Math.min(SW * 0.86, 380);
    const dicePad = 12;
    const cellMargin = 8;
    const diceCols = 3;
    const diceSize = Math.floor(
      (DICE_W - dicePad * 2 - cellMargin * (diceCols * 2)) / diceCols
    );
    return { diceSize, dicePad, cellMargin };
  }, []);

  const playDiceRollSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: 1,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        playThroughEarpieceAndroid: false,
      });
    } catch {}

    await ensureSoundPool();
    const i = randInt(0, soundPool.list.length - 1);
    const s = soundPool.list[i];
    currentSoundRef.current = s;
    try {
      await s.setPositionAsync(0);
      await s.playAsync();
    } catch {}
  };

  const stopDiceRollSound = async () => {
    if (currentSoundRef.current) {
      try {
        await currentSoundRef.current.stopAsync();
      } catch {}
      currentSoundRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopDiceRollSound();
      (async () => {
        for (const s of soundPool.list) {
          try {
            await s.unloadAsync();
          } catch {}
        }
        soundPool.list = [];
        soundPool.ready = false;
      })();
    };
  }, []);

  const fmtTime = () => {
    const d = new Date();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    const ss = d.getSeconds().toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const rollDice = async () => {
    if (rolling) return;
    setRolling(true);

    const rollMs = randInt(800, 1100);
    playDiceRollSound();

    let ticks = 0;
    const tickEvery = 45;
    const maxTicks = Math.ceil(rollMs / tickEvery);

    intervalRef.current = setInterval(() => {
      setDiceFaces(Array(6).fill(0).map(pickRandom));
      ticks++;

      if (ticks > maxTicks) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        const finalFaces = Array.from({ length: 6 }, pickRandom);
        setDiceFaces(finalFaces);

        if (historyEnabled) {
          const counts = SYMBOLS.reduce(
            (acc, s) => ((acc[s.key] = 0), acc),
            {}
          );
          for (const f of finalFaces) counts[f.key] += 1;

          setHistory((prev) => {
            const entry = { when: fmtTime(), faces: finalFaces, counts };
            const next = [...prev, entry];
            return next.length > 20 ? next.slice(-20) : next;
          });
        }

        stopDiceRollSound();
        setRolling(false);
      }
    }, tickEvery);
  };

  const handleBack = () => {
    router.back();
  };

  const last3 = history.slice(-3).reverse();

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Text style={styles.backTxt}>‹ Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>History</Text>
            <Switch
              value={historyEnabled}
              onValueChange={setHistoryEnabled}
              trackColor={{ false: "rgba(255,255,255,0.25)", true: "#22D3EE" }}
              thumbColor={historyEnabled ? "#f5f2f2" : "#ccc"}
              ios_backgroundColor="rgba(255,255,255,0.25)"
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollWrap}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Jhandi Burja</Text>

          {/* Dice board */}
          <View
            style={[
              styles.diceBoard,
              { paddingHorizontal: dicePad, paddingVertical: 8 },
            ]}
          >
            <View style={styles.row}>
              <Cell
                size={diceSize}
                img={diceFaces[0].img}
                margin={cellMargin}
              />
              <Cell
                size={diceSize}
                img={diceFaces[1].img}
                margin={cellMargin}
              />
              <Cell
                size={diceSize}
                img={diceFaces[2].img}
                margin={cellMargin}
              />
            </View>
            <View style={styles.row}>
              <Cell
                size={diceSize}
                img={diceFaces[3].img}
                margin={cellMargin}
              />
              <Cell
                size={diceSize}
                img={diceFaces[4].img}
                margin={cellMargin}
              />
              <Cell
                size={diceSize}
                img={diceFaces[5].img}
                margin={cellMargin}
              />
            </View>
          </View>

          {/* Roll + History */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={rollDice}
              style={[styles.rollBtn, rolling && { opacity: 0.6 }]}
              activeOpacity={0.9}
              disabled={rolling}
            >
              <Text style={styles.rollBtnText}>
                {rolling ? "ROLLING..." : "ROLL DICE"}
              </Text>
            </TouchableOpacity>

            {historyEnabled && (
              <TouchableOpacity
                onPress={() => setSheetOpen(true)}
                style={styles.historyBtn}
                activeOpacity={0.85}
              >
                <Image
                  source={require("../../assets/images/clock.png")}
                  style={styles.historyIcon}
                  contentFit="contain"
                  transition={0}
                />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* History Sheet */}
        {historyEnabled && (
          <RecentRollsSheet
            visible={sheetOpen}
            onClose={() => setSheetOpen(false)}
            items={last3}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

/** Dice Cell Component */
const Cell = memo(function Cell({
  size,
  img,
  margin,
  enlarge = false,
  aspect = 1,
}) {
  return (
    <View
      style={{
        width: size,
        height: size * aspect,
        margin,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={img}
        contentFit="contain"
        transition={0}
        recycleMemory
        style={{
          width: enlarge ? "96%" : "90%",
          height: "96%",
          borderRadius: 10,
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
  },
  backTxt: {
    color: FRAME_LT,
    fontWeight: "800",
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollWrap: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 18,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  diceBoard: {
    alignSelf: "center",
    backgroundColor: BOARD_BG,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: FRAME_LT,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  rollBtn: {
    backgroundColor: BTN_RED,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
  rollBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },
  historyBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#1B314F",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: FRAME_LT,
  },
  historyIcon: {
    width: 22,
    height: 22,
  },
});
