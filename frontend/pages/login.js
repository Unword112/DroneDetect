import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
  Image
} from "react-native";
import { IP_HOST } from "@env";

const API_URL = `http://${IP_HOST}:3000/api/login`;

const LoginForm = ({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  handleLogin, 
  loading, 
  navigation, 
  width 
}) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>DD</Text>
        </View>
        <Text style={styles.title}>Drone Detector</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>LOG IN</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, styles.registerButton]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={[styles.loginButtonText, styles.registerButtonText]}>
          REGISTER
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both username and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL);
      const userData = await response.json();

      if (username === userData.username && password === String(userData.password)) {
        navigation.replace("Home");
      } else {
        Alert.alert("Login Failed", "Invalid username or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 2. รวม Props เพื่อส่งไปให้ LoginForm
  const formProps = {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    loading,
    navigation,
    width
  };

  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        <View style={styles.leftPanel}>
           <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 40, fontWeight: 'bold', color: 'white'}}>SECURE SKY</Text>
              <Text style={{fontSize: 18, color: 'white', marginTop: 10}}>Advanced Drone Monitoring System</Text>
           </View>
        </View>
        
        <View style={styles.rightPanel}>
          <View style={{ width: 400 }}> 
            {/* ✅ 3. เรียกใช้โดยส่ง Props เข้าไป */}
            <LoginForm {...formProps} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          {/* ✅ 3. เรียกใช้โดยส่ง Props เข้าไป */}
          <LoginForm {...formProps} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  innerContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  formContainer: { width: '100%' }, 
  
  desktopContainer: { flex: 1, flexDirection: 'row' },
  leftPanel: { 
    flex: 1, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  rightPanel: { 
    flex: 1, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#007AFF", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  logoText: { color: "white", fontSize: 30, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#888", marginTop: 5 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: "#333", marginBottom: 8, fontWeight: "600" },
  input: { height: 50, backgroundColor: "#F2F2F7", borderRadius: 10, paddingHorizontal: 15, fontSize: 16, color: "#333" },
  loginButton: { backgroundColor: "#007AFF", height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 20 },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  registerButton: { backgroundColor: "#fff", marginTop: 15, borderWidth: 2, borderColor: "#007AFF" },
  registerButtonText: { color: "#007AFF" },
  footerText: { textAlign: "center", color: "#ccc", marginTop: 30, fontSize: 12 },
});

export default LoginScreen;