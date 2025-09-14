import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { DICE_SOUNDS, SYMBOLS } from "./gameData";

export default function useLoadResources() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const images = [
          ...SYMBOLS.map((s) => s.img),
          require("../../assets/images/clock.png"),
          require("../../assets/images/copyright.png"),
        ];
        await Asset.loadAsync(images);

        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        for (const src of DICE_SOUNDS) {
          const { sound } = await Audio.Sound.createAsync(src, {
            shouldPlay: false,
          });
          await sound.unloadAsync();
        }
      } catch (e) {
        console.warn("Resource load error:", e);
      } finally {
        if (mounted) setReady(true);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return ready;
}
