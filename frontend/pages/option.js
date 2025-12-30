import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { IP_HOST } from "@env";

const OptionScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [isSoundOn, setSoundOn] = useState(true);
  const [isVibrationOn, setVibrationOn] = useState(true);
  const [showDefenseZone, setShowDefenseZone] = useState(true);
  const [showAlertZone, setShowAlertZone] = useState(true);

  const { isDarkMode, toggleTheme, theme } = useTheme(); 
  const colors = theme.colors;

  const SettingItem = ({ icon, label, value, onValueChange, type = "switch" }) => (
    <View style={[styles.itemContainer, { borderBottomColor: colors.border }]}> 
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#333' : '#E5F1FF' }]}>
          <Ionicons name={icon} size={20} color="#007AFF" />
        </View>
        <Text style={[styles.itemText, { color: colors.text }]}>{label}</Text> 
      </View>

      {type === "switch" ? (
        <Switch
          trackColor={{ false: "#767577", true: "#34C759" }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <Text style={[styles.valueText, { color: colors.subText }]}>{value}</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          isDesktop && styles.scrollContentDesktop
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>

        <Text style={[styles.sectionHeader, { color: colors.subText }]}>APPEARANCE</Text>
        <View style={[styles.sectionBlock, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="moon"
            label="Dark Mode"
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.subText }]}>NOTIFICATIONS</Text>
        <View style={[styles.sectionBlock, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="notifications"
            label="Sound Alert"
            value={isSoundOn}
            onValueChange={setSoundOn}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem
            icon="phone-portrait"
            label="Vibration"
            value={isVibrationOn}
            onValueChange={setVibrationOn}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.subText }]}>MAP DISPLAY</Text>
        <View style={[styles.sectionBlock, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="shield"
            label="Show Defense Zone"
            value={showDefenseZone}
            onValueChange={setShowDefenseZone}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem
            icon="alert-circle"
            label="Show Alert Zone"
            value={showAlertZone}
            onValueChange={setShowAlertZone}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.subText }]}>CONNECTION</Text>
        <View style={[styles.sectionBlock, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="server"
            label="Server IP"
            value={IP_HOST || "Not Set"}
            type="info"
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SettingItem
            icon="pulse"
            label="Status"
            value="Connected"
            type="info"
          />
        </View>

        <Text style={[styles.versionText, { color: colors.subText }]}>Drone Detector App v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 100, 
    paddingBottom: 50,
  },
  scrollContentDesktop: {
    paddingTop: 40, 
    alignSelf: "center",
    width: "100%",
    maxWidth: 900, 
    paddingHorizontal: 40,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
    marginLeft: 10,
    textTransform: "uppercase",
  },
  sectionBlock: {
    borderRadius: 12,
    overflow: "hidden",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  valueText: {
    fontSize: 16,
    marginRight: 5,
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
  versionText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 12,
  },
});

export default OptionScreen;