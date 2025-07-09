// screens/SplashScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONTS } from '../styles/colors';
import MainScreen from './homescreen'; // ✅ Import directly
import LoginScreen from './loginscreen'; // ✅ Import directly

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglinePosition = useRef(new Animated.Value(50)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const [showButton, setShowButton] = useState(false);
  const [screenToShow, setScreenToShow] = useState(null); // <== Handle redirection

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(taglinePosition, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      setShowButton(true);
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        setScreenToShow('Login');
        return;
      }

      const response = await axios.get('https://your-api.com/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.valid) {
        setScreenToShow('Main');
      } else {
        await AsyncStorage.removeItem('authToken');
        setScreenToShow('Login');
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
      await AsyncStorage.removeItem('authToken');
      setScreenToShow('Login');
    }
  };

  // 🔁 Once decision is made, show the proper screen
  if (screenToShow === 'Login') {
    return <LoginScreen />;
  } else if (screenToShow === 'Main') {
    return <MainScreen />;
  }

  // Show splash UI otherwise
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <Animated.View style={styles.backgroundGradient} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>R</Text>
        </View>
        <Text style={styles.appName}>RentalMate</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.taglineContainer,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglinePosition }],
          },
        ]}
      >
        <Text style={styles.tagline}>Find Home, Feel Home</Text>
        <View style={styles.taglineUnderline} />
      </Animated.View>

      {showButton && (
        <Animated.View style={{ opacity: buttonOpacity, marginTop: 40 }}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.bottomDecorative}>
        <View style={styles.decorativeDot} />
        <View style={styles.decorativeDot} />
        <View style={styles.decorativeDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    opacity: 0.9,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.accent || 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: FONTS.bold,
    letterSpacing: 2,
  },
  taglineContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.accent,
    fontFamily: FONTS.medium,
    letterSpacing: 1,
  },
  taglineUnderline: {
    width: 80,
    height: 2,
    backgroundColor: COLORS.accent,
    marginTop: 8,
    borderRadius: 1,
  },
  getStartedButton: {
    backgroundColor: COLORS.accent || 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    marginBottom: 60,
  },
  getStartedText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  bottomDecorative: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginHorizontal: 4,
    opacity: 0.6,
  },
});

export default SplashScreen;
