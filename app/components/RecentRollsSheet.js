import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";

export default function RecentRollsSheet({ visible, onClose, items = [] }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openDetail = (it) => {
    onClose?.();
    setSelected(it);
    setDetailOpen(true);
  };
  const closeDetail = () => setDetailOpen(false);

  const { boardW, cellSize, cellMargin, padH, padV } = useMemo(() => {
    const SW = Dimensions.get("window").width;
    const boardW = Math.min(Math.round(SW * 0.92), 520);
    const padH = 18;
    const padV = 18;
    const cellMargin = 10;
    const cols = 3;
    const innerW = boardW - padH * 2 - cellMargin * (cols * 2);
    const cellSize = Math.floor(innerW / cols);
    return { boardW, cellSize, cellMargin, padH, padV };
  }, []);

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <Text style={styles.title}>Recent 3 Rolls</Text>
            <ScrollView contentContainerStyle={styles.listWrap}>
              {items.length === 0 ? (
                <Text style={styles.empty}>No rolls yet.</Text>
              ) : (
                items.map((it, idx) => (
                  <Pressable
                    key={idx}
                    style={styles.item}
                    onPress={() => openDetail(it)}
                  >
                    <Text style={styles.itemWhen}>Time: {it.when}</Text>
                    <View style={styles.facesRow}>
                      {it.faces.map((f, i) => (
                        <Image
                          key={`${f.key}-${i}`}
                          source={f.img}
                          style={styles.faceImg}
                          contentFit="contain"
                        />
                      ))}
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={detailOpen}
        onRequestClose={closeDetail}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDetail} />
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={closeDetail} style={styles.backBtn}>
                <Text style={styles.backTxt}>‹ Back</Text>
              </TouchableOpacity>
              <Text style={styles.detailTitle}>Roll Details</Text>
              <View style={{ width: 64 }} />
            </View>
            {selected ? (
              <View style={styles.detailBody}>
                <Text style={styles.itemWhen}>Time: {selected.when}</Text>
                <View
                  style={[
                    styles.boardLarge,
                    {
                      width: boardW,
                      paddingHorizontal: padH,
                      paddingVertical: padV,
                    },
                  ]}
                >
                  {[0, 1].map((row) => (
                    <View key={row} style={styles.boardRow}>
                      {selected.faces
                        .slice(row * 3, row * 3 + 3)
                        .map((f, i) => (
                          <View
                            key={i}
                            style={[
                              styles.cellLarge,
                              {
                                width: cellSize,
                                height: cellSize,
                                margin: cellMargin,
                              },
                            ]}
                          >
                            <Image
                              source={f.img}
                              style={styles.cellImgLarge}
                              contentFit="contain"
                            />
                          </View>
                        ))}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={styles.empty}>No roll selected.</Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "50%",
    backgroundColor: "#0F223A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 2,
    borderColor: "#0F223A",
  },
  grabber: {
    alignSelf: "center",
    width: 56,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginBottom: 8,
  },
  title: {
    color: "#E0E6F2",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },
  listWrap: { paddingBottom: 12 },
  empty: {
    color: "#E0E6F2",
    opacity: 0.85,
    textAlign: "center",
    marginTop: 16,
  },
  item: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  itemWhen: { color: "#AFC6FF", fontSize: 12, marginBottom: 6 },
  facesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  faceImg: { width: 48, height: 48, borderRadius: 8 },
  closeBtn: {
    alignSelf: "center",
    marginTop: 6,
    backgroundColor: "#D32F2F",
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeTxt: { color: "#fff", fontWeight: "800" },
  detailHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    marginRight: 8,
  },
  backTxt: { color: "#E0E6F2", fontWeight: "800" },
  detailTitle: {
    color: "#E0E6F2",
    fontSize: 18,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
  },
  detailBody: { paddingHorizontal: 2, paddingTop: 4 },
  boardLarge: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginTop: 12,
  },
  boardRow: { flexDirection: "row", justifyContent: "center" },
  cellLarge: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F223A",
  },
  cellImgLarge: { width: "96%", height: "96%", borderRadius: 12 },
});
