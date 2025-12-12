import * as React from 'react';
import { StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from './pages/account';
import AlertScreen from './pages/alert';
import OptionScreen from './pages/option';
import ReportScreen from './pages/report';

import MenuPopover from './components/MenuPopover'; 
import { Ionicons } from '@expo/vector-icons'; 

function MenuButton() {
    const [isMenuVisible, setMenuVisible] = React.useState(false);
    const navigation = useNavigation();

    const toggleMenu = () => setMenuVisible(!isMenuVisible);

    // ฟังก์ชันนำทางเมื่อเลือกเมนู
    const handleNavigate = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <>
            <TouchableOpacity 
                onPress={toggleMenu} 
                style={{ marginRight: 15 }}
            >
                <Ionicons 
                    name={Platform.OS === 'ios' ? 'ellipsis-vertical' : 'ellipsis-vertical-sharp'} 
                    size={24} 
                    color="white" 
                />
            </TouchableOpacity>

            {/* Popover Menu Component */}
            <MenuPopover
                isVisible={isMenuVisible}
                onClose={() => setMenuVisible(false)}
                onNavigate={handleNavigate}
            />
        </>
    );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Alert" 
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          
          // กำหนดปุ่มเมนูสำหรับทุกหน้าจอ
          headerRight: () => <MenuButton />,
        })}
      >
        <Stack.Screen name="Alert" component={AlertScreen} options={{ title: 'การแจ้งเตือน' }} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: 'รายงาน' }} />
        <Stack.Screen name="Option" component={OptionScreen} options={{ title: 'ตัวเลือก' }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'บัญชีผู้ใช้' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles ที่เหลือ (ไม่ต้องเปลี่ยน)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '600',
  },
});