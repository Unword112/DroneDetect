import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IP_HOST } from "@env";

const OptionScreen = ({ navigation }) => {
  const [isSoundOn, setSoundOn] = useState(true);
  const [isVibrationOn, setVibrationOn] = useState(true);
  const [showDefenseZone, setShowDefenseZone] = useState(true);
  const [showAlertZone, setShowAlertZone] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.navigate("Home"),
      },
    ]);
  };

  const SettingItem = ({
    icon,
    label,
    value,
    onValueChange,
    type = "switch",
  }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color="#007AFF" />
        </View>
        <Text style={styles.itemText}>{label}</Text>
      </View>

      {type === "switch" ? (
        <Switch
          trackColor={{ false: "#767577", true: "#34C759" }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.valueText}>{value}</Text>
          {type === "link" && (
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Settings</Text>

        <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
        <View style={styles.sectionBlock}>
          <SettingItem
            icon="notifications"
            label="Sound Alert"
            value={isSoundOn}
            onValueChange={setSoundOn}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="phone-portrait"
            label="Vibration"
            value={isVibrationOn}
            onValueChange={setVibrationOn}
          />
        </View>

        <Text style={styles.sectionHeader}>MAP DISPLAY</Text>
        <View style={styles.sectionBlock}>
          <SettingItem
            icon="shield"
            label="Show Defense Zone"
            value={showDefenseZone}
            onValueChange={setShowDefenseZone}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="alert-circle"
            label="Show Alert Zone"
            value={showAlertZone}
            onValueChange={setShowAlertZone}
          />
        </View>

        <Text style={styles.sectionHeader}>CONNECTION</Text>
        <View style={styles.sectionBlock}>
          <SettingItem
            icon="server"
            label="Server IP"
            value={IP_HOST || "Not Set"}
            type="info"
          />
          <View style={styles.divider} />
          <SettingItem
            icon="pulse"
            label="Status"
            value="Connected"
            type="info"
          />
        </View>

        <Text style={styles.sectionHeader}>ACCOUNT</Text>
        <View style={styles.sectionBlock}></View>

        <Text style={styles.versionText}>Drone Detector App v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollContent: {
    top: 25,
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6e6e6e",
    marginBottom: 8,
    marginTop: 15,
    marginLeft: 10,
  },
  sectionBlock: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#E5F1FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
  valueText: {
    fontSize: 16,
    color: "#8e8e93",
    marginRight: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 50, // เว้นตรงไอคอนไว้
  },
  logoutBtn: {
    paddingVertical: 15,
    alignItems: "center",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "#999",
    marginTop: 30,
    fontSize: 12,
  },
});

export default OptionScreen;
