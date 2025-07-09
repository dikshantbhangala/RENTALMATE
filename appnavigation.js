import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder Screens
const ChatScreen = () => (
  <View style={styles.placeholderScreen}>
    <MaterialIcons name="chat" size={80} color="#FFD700" />
    <Text style={styles.placeholderText}>Chat</Text>
    <Text style={styles.placeholderSubtext}>Coming Soon</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.placeholderScreen}>
    <MaterialIcons name="person" size={80} color="#FFD700" />
    <Text style={styles.placeholderText}>Profile</Text>
    <Text style={styles.placeholderSubtext}>Coming Soon</Text>
  </View>
);

// Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Chat') iconName = 'chat';
        else if (route.name === 'Profile') iconName = 'person';

        return (
          <View
            style={[
              styles.tabIconContainer,
              focused && styles.tabIconContainerFocused,
            ]}
          >
            <MaterialIcons name={iconName} size={size} color={color} />
          </View>
        );
      },
      tabBarActiveTintColor: '#FFD700',
      tabBarInactiveTintColor: '#888',
      tabBarStyle: {
        backgroundColor: '#1A1A1A',
        borderTopColor: '#333',
        borderTopWidth: 1,
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main Navigation
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* All route names use ScreenName format to avoid confusion */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 20,
  },
  placeholderSubtext: {
    fontSize: 18,
    color: '#CCC',
    marginTop: 10,
  },
  tabIconContainer: {
    padding: 8,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  tabIconContainerFocused: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
});

export default AppNavigation;
