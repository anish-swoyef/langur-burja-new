import { Platform, Switch } from "react-native";
//

export default function Toggle({
  value,
  onValueChange,
  disabled,
  testID,
  accessibilityLabel,
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel || "toggle"}
      trackColor={{ false: "rgba(255,255,255,0.25)", true: "#22D3EE" }}
      thumbColor={value ? "#f5f2f2" : "#ccc"}
      ios_backgroundColor="rgba(255,255,255,0.25)"
      style={
        Platform.OS === "ios"
          ? { transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }
          : undefined
      }
    />
  );
}
