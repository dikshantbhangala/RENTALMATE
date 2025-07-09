// screens/LoginScreen.js
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, FONTS } from '../styles/colors';

const LoginScreen = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [showHomeScreen, setShowHomeScreen] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  React.useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    return number;
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const sendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    if (!validatePhoneNumber(formattedPhone)) {
      Alert.alert('Error', 'Please enter a valid Indian phone number');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVerificationId('mock-verification-id');
      setIsOtpSent(true);
      setCountdown(60);
      
      Alert.alert(
        'OTP Sent',
        `Verification code sent to ${formattedPhone}. Use 123456 for testing.`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('OTP sending error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      if (otp === '123456') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsVerified(true);
        
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK' }
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
      
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => {
    setShowHomeScreen(true);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const goBackToLogin = () => {
    setShowHomeScreen(false);
    setIsVerified(false);
    setPhoneNumber('');
    setOtp('');
    setIsOtpSent(false);
    setVerificationId('');
    setCountdown(0);
  };

  const resendOTP = () => {
    if (countdown > 0) return;
    
    setOtp('');
    setIsOtpSent(false);
    setVerificationId('');
    sendOTP();
  };

  // HOME SCREEN COMPONENT
  if (showHomeScreen) {
    return (
      <View style={styles.homeContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
        <View style={styles.homeHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>R</Text>
            </View>
            <Text style={styles.appName}>RentalMate</Text>
          </View>
          
          <Text style={styles.homeWelcome}>Welcome to RentalMate!</Text>
          <Text style={styles.homeSubtext}>
            Logged in as: {formatPhoneNumber(phoneNumber)}
          </Text>
        </View>

        <View style={styles.homeContent}>
          <TouchableOpacity style={styles.homeButton} activeOpacity={0.8}>
            <Text style={styles.homeButtonText}>🏠 Browse Properties</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} activeOpacity={0.8}>
            <Text style={styles.homeButtonText}>📋 List Your Property</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} activeOpacity={0.8}>
            <Text style={styles.homeButtonText}>📅 My Bookings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} activeOpacity={0.8}>
            <Text style={styles.homeButtonText}>👤 Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} activeOpacity={0.8}>
            <Text style={styles.homeButtonText}>💬 Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.homeFooter}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={goBackToLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // SUCCESS SCREEN AFTER VERIFICATION
  if (isVerified) {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>✓</Text>
              </View>
              <Text style={styles.appName}>RentalMate</Text>
            </View>
            
            <Text style={styles.welcomeText}>Verification Successful!</Text>
            <Text style={styles.subText}>
              Your phone number has been verified successfully. You can now access your account.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={goToHome}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Welcome to RentalMate!
            </Text>
            <Text style={styles.debugText}>
              Phone: {formatPhoneNumber(phoneNumber)}
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }

  // LOGIN SCREEN
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>R</Text>
            </View>
            <Text style={styles.appName}>RentalMate</Text>
          </View>
          
          <Text style={styles.welcomeText}>
            {isOtpSent ? 'Verify Your Phone' : 'Welcome Back!'}
          </Text>
          <Text style={styles.subText}>
            {isOtpSent 
              ? `We've sent a verification code to ${formatPhoneNumber(phoneNumber)}`
              : 'Enter your phone number to continue'
            }
          </Text>
        </View>

        <View style={styles.formContainer}>
          {!isOtpSent ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={COLORS.gray}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={sendOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Enter OTP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={COLORS.gray}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={verifyOTP}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.primary} />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendButton}
                onPress={resendOTP}
                disabled={countdown > 0}
              >
                <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setIsOtpSent(false);
                  setOtp('');
                  setVerificationId('');
                }}
              >
                <Text style={styles.backText}>← Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  subText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: FONTS.regular,
  },
  formContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 8,
    fontFamily: FONTS.medium,
  },
  input: {
    backgroundColor: COLORS.darkGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    fontFamily: FONTS.regular,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: COLORS.accent,
    fontFamily: FONTS.medium,
  },
  resendDisabled: {
    color: COLORS.gray,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    fontSize: 16,
    color: COLORS.gray,
    fontFamily: FONTS.regular,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: FONTS.regular,
  },
  debugText: {
    fontSize: 10,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: FONTS.regular,
  },
  
  // Home Screen Styles
  homeContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  homeHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  homeWelcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  homeSubtext: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  homeContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  homeButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
  homeFooter: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: FONTS.semiBold,
  },
});

export default LoginScreen;