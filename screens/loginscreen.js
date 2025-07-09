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

const LoginScreen = ({ onLoginSuccess, onNavigateToHome }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [shouldNavigateToHome, setShouldNavigateToHome] = useState(false);

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

  // Effect to handle navigation to home after successful verification
  React.useEffect(() => {
    if (shouldNavigateToHome) {
      // Reset the navigation flag
      setShouldNavigateToHome(false);
      
      // Try multiple callback methods to ensure navigation works
      if (onNavigateToHome) {
        onNavigateToHome();
      } else if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Fallback: Store login state and trigger a re-render of parent component
        console.log('User successfully logged in - trigger app state update');
        // You can also emit an event or use a state management solution here
      }
    }
  }, [shouldNavigateToHome, onNavigateToHome, onLoginSuccess]);

  const formatPhoneNumber = (number) => {
    // Remove all non-digits
    const cleaned = number.replace(/\D/g, '');
    
    // Add +91 prefix if not present
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
      // For development/testing, we'll simulate OTP sending
      // In production, use: const confirmation = await signInWithPhoneNumber(auth, formattedPhone);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification ID for testing
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
      // For testing purposes, accept 123456 as valid OTP
      if (otp === '123456') {
        // Simulate successful login
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Set verification success state
        setIsVerified(true);
        
        // Store user login state (you can use AsyncStorage or your preferred method)
        // await AsyncStorage.setItem('userLoggedIn', 'true');
        // await AsyncStorage.setItem('userPhone', formatPhoneNumber(phoneNumber));
        
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              // Trigger navigation after alert dismissal
              setShouldNavigateToHome(true);
            }
          }
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
      
      // In production, use:
      // const credential = PhoneAuthProvider.credential(verificationId, otp);
      // await signInWithCredential(auth, credential);
      
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToHome = () => {
    // Multiple ways to handle navigation
    try {
      // Method 1: Use the callback props
      if (onNavigateToHome) {
        onNavigateToHome();
        return;
      }
      
      if (onLoginSuccess) {
        onLoginSuccess();
        return;
      }
      
      // Method 2: Set state to trigger navigation
      setShouldNavigateToHome(true);
      
      // Method 3: Fallback - show alert if navigation fails
      setTimeout(() => {
        Alert.alert(
          'Navigation Issue',
          'Unable to navigate automatically. Please restart the app.',
          [{ text: 'OK' }]
        );
      }, 2000);
      
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to navigate to home screen.');
    }
  };

  const resendOTP = () => {
    if (countdown > 0) return;
    
    setOtp('');
    setIsOtpSent(false);
    setVerificationId('');
    sendOTP();
  };

  // If verification is successful, show success screen with navigation button
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
          {/* Success Header */}
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

          {/* Navigation Button */}
          <View style={styles.formContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={navigateToHome}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
            
            {/* Alternative button for testing */}
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                Alert.alert('Debug', 'Navigation button pressed!');
                navigateToHome();
              }}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Continue to App
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
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
        {/* Header */}
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

        {/* Input Form */}
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

        {/* Footer */}
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.accent,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: COLORS.accent,
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
});

export default LoginScreen;