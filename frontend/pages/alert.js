import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { getAlerts, clearUnread } from "./configscreen/alertStore";
import { useTheme } from "../context/ThemeContext"; 

const AlertScreen = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { theme } = useTheme();
  const colors = theme.colors;

  const [alertList, setAlertList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setAlertList(getAlerts());
      clearUnread();
      return () => {};
    }, [])
  );

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.alertItem,
        isDesktop && styles.alertItemDesktop,
        { backgroundColor: colors.surface, shadowColor: theme.isDarkMode ? "#000" : "#ccc" }
      ]}
    >
      
      {isDesktop && <View style={styles.accentBorder} />}

      <View style={styles.contentWrapper}>
        <View style={[styles.iconContainer, { backgroundColor: theme.isDarkMode ? "rgba(255, 69, 0, 0.2)" : "#FFE5E5" }]}>
          <Ionicons name="warning" size={24} color="#FF4500" />
        </View>
        
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, isDesktop && styles.titleDesktop, { color: colors.text }]}>
              {item.title}
            </Text>
            {isDesktop && (
               <Text style={[styles.time, { color: colors.subText }]}>
                 {item.date} • {item.time}
               </Text>
            )}
          </View>
          
          <Text style={[styles.message, isDesktop && styles.messageDesktop, { color: colors.subText }]}>
            {item.message}
          </Text>

          {!isDesktop && (
            <Text style={[styles.time, { color: colors.subText }]}>
              {item.date} - {item.time}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>
        
        {isDesktop && (
          <Text style={[styles.pageTitle, { color: colors.text }]}>
            Notifications ({alertList.length})
          </Text>
        )}

        {alertList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color={colors.subText} style={{marginBottom: 10, opacity: 0.5}} />
            <Text style={[styles.emptyText, { color: colors.subText }]}>No notifications</Text>
          </View>
        ) : (
          <FlatList
            data={alertList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  contentContainer: {
    flex: 1,
    paddingTop: 100,
  },
  contentContainerDesktop: {
    paddingTop: 40,
    alignSelf: "center",
    width: "100%",
    maxWidth: 900,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  
  alertItem: {
    flexDirection: "row",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  alertItemDesktop: {
    marginBottom: 16,
    borderRadius: 12,
  },
  accentBorder: {
    width: 6,
    backgroundColor: "#FF4500",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: { 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  titleDesktop: {
    fontSize: 18,
  },
  message: { 
    fontSize: 14, 
    marginTop: 2,
    lineHeight: 20,
  },
  messageDesktop: {
    fontSize: 15,
  },
  time: { 
    fontSize: 12, 
    marginTop: 6 
  },
  
  emptyContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { 
    fontSize: 18,
    fontWeight: "500" 
  },
});

export default AlertScreen;