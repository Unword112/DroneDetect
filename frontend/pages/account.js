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
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { IP_HOST } from "@env";

import { useTheme } from "../context/ThemeContext";
import TopNavBar from "../components/desktop/TopNavBar"; 

const API_URL = `http://${IP_HOST}:3000/api/login`;

const AccountScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isDarkMode, theme } = useTheme();
  const colors = theme.colors;

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

  const InfoItem = ({ icon, label, value, isSecure }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.subText}
          style={{ marginRight: 15 }}
        />
        <Text style={[styles.infoLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color: colors.subText }]}>{value}</Text>
    </View>
  );

  const ProfileCard = () => (
    <View style={[styles.profileHeader, isDesktop && styles.profileCardDesktop, { backgroundColor: isDesktop ? colors.surface : 'transparent' }]}>
      <View style={styles.avatarContainer}>
        {userData?.imagePath ? (
          <Image
            source={{ uri: userData.imagePath }}
            style={[styles.avatar, { borderColor: colors.surface }]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
            <Ionicons name="person" size={60} color={colors.subText} />
          </View>
        )}
        <TouchableOpacity style={[styles.editIconBtn, { borderColor: colors.surface }]}>
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.nameText, { color: colors.text }]}>
        {userData?.name || "Unknown User"}
      </Text>
      <Text style={[styles.roleText, { color: colors.subText }]}>@{userData?.username}</Text>
      
      {isDesktop && (
         <TouchableOpacity style={[styles.logoutButton, { width: '100%', marginTop: 30 }]} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
         </TouchableOpacity>
      )}
    </View>
  );

  const InfoSection = () => (
    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
      <InfoItem icon="id-card" label="User ID" value={`#${userData?.userid}`} />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <InfoItem icon="person" label="Username" value={userData?.username} />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <InfoItem icon="key" label="Password" value="••••••" isSecure />
    </View>
  );

  const SettingsSection = () => (
    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={styles.actionRow}
        onPress={() => navigation.navigate("EditZone")}
      >
        <View style={styles.actionLeft}>
          <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#333' : '#E0F2F1' }]}>
            <Ionicons name="map" size={20} color="#009688" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>Manage Zones</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.subText} />
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <TouchableOpacity
        style={styles.actionRow}
        onPress={() => navigation.navigate("Option")}
      >
        <View style={styles.actionLeft}>
          <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#333' : '#E3F2FD' }]}>
            <Ionicons name="settings" size={20} color="#2196F3" />
          </View>
          <Text style={[styles.actionText, { color: colors.text }]}>App Settings</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.subText} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isDesktop && <TopNavBar />}

      <ScrollView contentContainerStyle={isDesktop ? styles.scrollContentDesktop : styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: colors.text, marginBottom: isDesktop ? 40 : 20 }]}>
            My Account
        </Text>

        {isDesktop ? (
          <View style={styles.desktopRow}>
            <View style={styles.leftColumn}>
                <ProfileCard />
            </View>

            <View style={styles.rightColumn}>
                <Text style={[styles.sectionHeader, { color: colors.subText }]}>PERSONAL INFORMATION</Text>
                <InfoSection />
                
                <View style={{height: 30}} />

                <Text style={[styles.sectionHeader, { color: colors.subText }]}>SETTINGS</Text>
                <SettingsSection />
            </View>
          </View>
        ) : (
          <View>
            <ProfileCard />

            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: colors.subText }]}>PERSONAL INFORMATION</Text>
              <InfoSection />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionHeader, { color: colors.subText }]}>SETTINGS</Text>
              <SettingsSection />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.versionText, { color: colors.subText }]}>Drone Detector v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  scrollContent: { padding: 20, paddingTop: 60 },
  scrollContentDesktop: { padding: 40, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  
  desktopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  leftColumn: { flex: 1, marginRight: 30 },
  rightColumn: { flex: 2 },

  headerTitle: { fontSize: 34, fontWeight: "bold" },

  profileHeader: { alignItems: "center", marginBottom: 30 },
  profileCardDesktop: { 
      padding: 30, 
      borderRadius: 16, 
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3 },
  avatarPlaceholder: { justifyContent: "center", alignItems: "center" },
  editIconBtn: {
    position: "absolute", bottom: 0, right: 0,
    backgroundColor: "#007AFF", width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center", borderWidth: 3,
  },
  nameText: { fontSize: 22, fontWeight: "bold", textAlign: 'center' },
  roleText: { fontSize: 16, marginTop: 4 },

  section: { marginBottom: 25 },
  sectionHeader: {
    fontSize: 13, fontWeight: "600", marginBottom: 10, marginLeft: 10, textTransform: "uppercase",
  },

  infoCard: { borderRadius: 12, overflow: "hidden" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoLabel: { fontSize: 16 },
  infoValue: { fontSize: 16, fontWeight: "500" },
  divider: { height: 1, marginLeft: 50 },

  actionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  actionLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: "center", alignItems: "center", marginRight: 12 },
  actionText: { fontSize: 16 },

  logoutButton: { backgroundColor: "#ffe5e5", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 10 },
  logoutText: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },

  versionText: { textAlign: "center", marginTop: 30, marginBottom: 20, fontSize: 12 },
});

export default AccountScreen;