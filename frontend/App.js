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

import { ThemeProvider, useTheme } from './context/ThemeContext';

import { Ionicons } from "@expo/vector-icons";

import { subscribe, getUnreadCount } from "./pages/configscreen/alertStore";
import TopNavBar from "./components/desktop/TopNavBar";

import AccountScreen from "./pages/account";
import AlertScreen from "./pages/alert";
import OptionScreen from "./pages/option";
import ReportScreen from "./pages/report";
import HomeScreen from "./pages/home";
import CameraScreen from "./pages/camera";
import EditZoneScreen from "./pages/configscreen/editZone";

import LoginScreen from "./pages/login";
import RegisterScreen from "./pages/register";

import MenuPopover from "./components/mobile/MenuPopover";

function MenuButton() {
  const [isMenuVisible, setMenuVisible] = React.useState(false);
  const navigation = useNavigation();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const { theme } = useTheme();
  const colors = theme.colors;

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
          name={Platform.OS === "ios" ? "ellipsis-horizontal" : "ellipsis-horizontal-sharp"}
          size={24}
          color={colors.text}
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

function MainNavigator() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { width } = useWindowDimensions();
  
  // ✅ 2. เช็คว่าเป็น Desktop หรือไม่
  const isDesktop = width >= 1024;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: isDesktop ? () => <TopNavBar /> : undefined,
          headerShown: true, 
          headerTransparent: isDesktop ? false : true,
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "bold", color: colors.text },
          headerRight: isDesktop ? null : () => <MenuButton />,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "" }} />
        <Stack.Screen name="Alert" component={AlertScreen} options={{ title: "" }} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: "" }} />
        <Stack.Screen name="Option" component={OptionScreen} options={{ title: "" }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: "" }} />
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: "" }} />
        <Stack.Screen name="EditZone" component={EditZoneScreen} options={{ title: "" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainNavigator />
    </ThemeProvider>
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