import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import { subscribe, getUnreadCount } from "../pages/configscreen/alertStore";

const BottomTab = ({ navigation }) => {
  const route = useRoute();
  const currentRouteName = route.name;
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());

  useEffect(() => {
    const unsubscribe = subscribe(() => setUnreadCount(getUnreadCount()));
    return unsubscribe;
  }, []);

  const menus = [
    { name: "Home", icon: "home", route: "Home" },
    { name: "Edit Zone", icon: "create", route: "EditZone" },
    { name: "Alert", icon: "notifications", route: "Alert", hasBadge: true },
    { name: "Report", icon: "document-text", route: "Report" },
    { name: "Option", icon: "settings", route: "Option" },
    { name: "Account", icon: "person", route: "Account" },
  ];

  return (
    <View style={styles.container}>
      {menus.map((menu, index) => {
        const isActive = currentRouteName === menu.route;
        const activeColor = isActive ? "#3AC9D8" : "#B0B0B0";

        return (
          <TouchableOpacity
            key={index}
            style={styles.tabItem}
            onPress={() => navigation.navigate(menu.route)}
          >
            <View>
              <Ionicons name={menu.icon} size={24} color={activeColor} />
              {menu.hasBadge && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabText, { color: activeColor }]}>
              {menu.name.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.homeIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 20,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  tabText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "black",
    marginTop: 4,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  homeIndicator: {
    position: "absolute",
    bottom: 8,
    width: 130,
    height: 5,
    backgroundColor: "black",
    borderRadius: 2.5,
    alignSelf: "center",
    opacity: 0.1,
  },
});

export default BottomTab;
