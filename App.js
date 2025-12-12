import * as React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 

import AccountScreen from './pages/account';
import AlertScreen from './pages/alert';
import OptionScreen from './pages/option';
import ReportScreen from './pages/report';
import HomeScreen from './pages/home';
import CameraScreen from './pages/camera';
import EditZoneScreen from './pages/configscreen/editZone';

import MenuPopover from './components/MenuPopover'; 

function MenuButton() {
    const [isMenuVisible, setMenuVisible] = React.useState(false);
    const navigation = useNavigation();

    const toggleMenu = () => setMenuVisible(!isMenuVisible);
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
                    name={Platform.OS === 'ios' ? 'ellipsis-horizontal' : 'ellipsis-horizontal-sharp'} 
                    size={24} 
                    color="#000000ff" 
                />
            </TouchableOpacity>

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
        initialRouteName="Home" 
        screenOptions={{
          headerTransparent: true,
          headerTintColor: '#000000ff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => <MenuButton />,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />

        <Stack.Screen name="Alert" component={AlertScreen} options={{ title: '' }} />
        <Stack.Screen name="Report" component={ReportScreen} options={{ title: '' }} />
        <Stack.Screen name="Option" component={OptionScreen} options={{ title: '' }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: '' }} />

        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: '' }} />
        <Stack.Screen name="EditZone" component={EditZoneScreen} options={{ title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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