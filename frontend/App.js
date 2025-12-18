import * as React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { subscribe, getUnreadCount } from "./pages/configscreen/alertStore";

import AccountScreen from "./pages/account";
import AlertScreen from "./pages/alert";
import OptionScreen from "./pages/option";
import ReportScreen from "./pages/report";
import HomeScreen from "./pages/home";
import CameraScreen from "./pages/camera";
import EditZoneScreen from "./pages/configscreen/editZone";

import MenuPopover from "./components/MenuPopover";

function MenuButton() {
  const [isMenuVisible, setMenuVisible] = React.useState(false);
  const navigation = useNavigation();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [unreadCount, setUnreadCount] = React.useState(getUnreadCount());

  React.useEffect(() => {
    const unsubscribe = subscribe(() => {
      setUnreadCount(getUnreadCount());
    });
    return unsubscribe;
  }, []);

  if (isTablet) return null;

  const toggleMenu = () => setMenuVisible(!isMenuVisible);
  const handleNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={{ marginRight: 15 }}>
      <TouchableOpacity onPress={toggleMenu}>
        <Ionicons
          name={
            Platform.OS === "ios"
              ? "ellipsis-horizontal"
              : "ellipsis-horizontal-sharp"
          }
          size={24}
          color="#000000ff"
        />

        {unreadCount > 0 && (
          <View style={styles.exclamationBadge}>
            <Text style={styles.exclamationText}>!</Text>
          </View>
        )}
      </TouchableOpacity>

      <MenuPopover
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleNavigate}
        alertCount={unreadCount}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTransparent: true,
          headerTintColor: "#000000ff",
          headerTitleStyle: { fontWeight: "bold" },
          headerRight: () => <MenuButton />,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "" }}
        />

        <Stack.Screen
          name="Alert"
          component={AlertScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="Report"
          component={ReportScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="Option"
          component={OptionScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ title: "" }}
        />

        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="EditZone"
          component={EditZoneScreen}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
  },
  exclamationBadge: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "red",
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "white",
  },
  exclamationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
