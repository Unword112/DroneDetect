import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

import { subscribe, getUnreadCount } from "../../pages/configscreen/alertStore"; 

const TopNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { theme } = useTheme();
  const colors = theme.colors;
  
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());

  useEffect(() => {
    const unsubscribe = subscribe(() => setUnreadCount(getUnreadCount()));
    return unsubscribe;
  }, []);

  const menuItems = [
    { name: "Home", icon: "home", route: "Home", label: "HOME" },
    { name: "Edit Zone", icon: "create", route: "EditZone", label: "ZONES" }, // เพิ่มเมนูนี้เข้ามา
    { name: "Alert", icon: "notifications", route: "Alert", label: "ALERT", hasBadge: true },
    { name: "Report", icon: "document-text", route: "Report", label: "REPORT" },
    { name: "Option", icon: "settings", route: "Option", label: "OPTION" },
    { name: "Account", icon: "person", route: "Account", label: "ACCOUNT" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View>
        <Text style={{ fontSize: 16, color: "blue", paddingRight: 700}}>LOGO</Text>  
      </View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          const isActive = route.name === item.route;
          const activeColor = isActive ? colors.primary : colors.subText;

          return (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <View>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={activeColor}
                />
                
                {item.hasBadge && unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )}
              </View>

              <Text style={[styles.menuLabel, { color: activeColor }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingTop: 50,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 100,
  },
  menuContainer: {
    flexDirection: "row",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    paddingBottom: 10,
  },
  menuLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 10,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
});

export default TopNavBar;