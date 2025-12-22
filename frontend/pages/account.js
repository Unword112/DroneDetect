import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { IP_HOST } from "@env";

const API_URL = `http://${IP_HOST}:3000/api/login`;

const AccountScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, []),
  );

  const fetchUserData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching account data:", error);
      Alert.alert("Error", "Could not load user data");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>My Account</Text>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userData?.imagePath ? (
              <Image
                source={{ uri: userData.imagePath }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={60} color="#ccc" />
              </View>
            )}

            <TouchableOpacity style={styles.editIconBtn}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>
            {userData?.name || "Unknown User"}
          </Text>
          <Text style={styles.roleText}>@{userData?.username}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PERSONAL INFORMATION</Text>

          <View style={styles.infoCard}>
            <InfoItem
              icon="id-card"
              label="User ID"
              value={`#${userData?.userid}`}
            />
            <View style={styles.divider} />
            <InfoItem
              icon="person"
              label="Username"
              value={userData?.username}
            />
            <View style={styles.divider} />
            <InfoItem icon="key" label="Password" value="••••••" isSecure />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SETTINGS</Text>

          <View style={styles.infoCard}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate("EditZone")}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#E0F2F1" }]}>
                  <Ionicons name="map" size={20} color="#009688" />
                </View>
                <Text style={styles.actionText}>Manage Zones</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate("Option")}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.iconBox, { backgroundColor: "#E3F2FD" }]}>
                  <Ionicons name="settings" size={20} color="#2196F3" />
                </View>
                <Text style={styles.actionText}>App Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Drone Detector v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, label, value, isSecure }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Ionicons
        name={icon}
        size={20}
        color="#888"
        style={{ marginRight: 15 }}
      />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingTop: 60 },

  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },

  profileHeader: { alignItems: "center", marginBottom: 30 },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "white",
  },
  avatarPlaceholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  editIconBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  nameText: { fontSize: 22, fontWeight: "bold", color: "#333" },
  roleText: { fontSize: 16, color: "#888", marginTop: 4 },

  section: { marginBottom: 25 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
    marginLeft: 10,
    textTransform: "uppercase",
  },

  infoCard: { backgroundColor: "white", borderRadius: 12, overflow: "hidden" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoLabel: { fontSize: 16, color: "#333" },
  infoValue: { fontSize: 16, color: "#666", fontWeight: "500" },

  divider: { height: 1, backgroundColor: "#f0f0f0", marginLeft: 50 },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  actionLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionText: { fontSize: 16, color: "#333" },

  logoutButton: {
    backgroundColor: "#ffe5e5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  logoutText: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },

  versionText: {
    textAlign: "center",
    color: "#ccc",
    marginTop: 30,
    marginBottom: 20,
    fontSize: 12,
  },
});

export default AccountScreen;
