import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { auth, db } from '../config/firebase';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    gender: '',
    city: '',
    preferredLocation: '',
  });
  const [loading, setLoading] = useState(false);

  const cities = [
    'Dehradun', 'Chandigarh', 'Kota', 'Indore', 'Bhopal', 
    'Nagpur', 'Nashik', 'Aurangabad', 'Coimbatore', 'Madurai',
    'Thiruvananthapuram', 'Mysore', 'Mangalore', 'Guwahati', 'Bhubaneswar'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { fullName, role, gender, city, preferredLocation } = formData;
    
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!role) {
      Alert.alert('Error', 'Please select your role');
      return false;
    }
    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }
    if (!city) {
      Alert.alert('Error', 'Please select your city');
      return false;
    }
    if (!preferredLocation.trim()) {
      Alert.alert('Error', 'Please enter your preferred location');
      return false;
    }
    
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No authenticated user found');
        return;
      }

      const userData = {
        ...formData,
        uid: user.uid,
        phone: user.phoneNumber,
        createdAt: new Date().toISOString(),
        profileComplete: true,
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      
      Alert.alert(
        'Success', 
        'Profile created successfully!',
        [{ text: 'OK', onPress: () => navigation.replace('MainTabs') }]
      );
    } catch (error) {
      console.error('Error creating user profile:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const RoleCard = ({ title, icon, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.roleCard, selected && styles.selectedCard]}
      onPress={onPress}
    >
      <LinearGradient
        colors={selected ? ['#FFD700', '#FFA500'] : ['#2A2A2A', '#1A1A1A']}
        style={styles.roleCardGradient}
      >
        <MaterialIcons 
          name={icon} 
          size={30} 
          color={selected ? '#000' : '#FFD700'} 
        />
        <Text style={[
          styles.roleCardText,
          { color: selected ? '#000' : '#FFD700' }
        ]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const GenderButton = ({ title, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.genderButton, selected && styles.selectedGenderButton]}
      onPress={onPress}
    >
      <Text style={[
        styles.genderButtonText,
        { color: selected ? '#000' : '#FFD700' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const CityButton = ({ title, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.cityButton, selected && styles.selectedCityButton]}
      onPress={onPress}
    >
      <Text style={[
        styles.cityButtonText,
        { color: selected ? '#000' : '#FFD700' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#000000', '#1A1A1A', '#2A2A2A']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Help us personalize your experience</Text>
          </View>

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                mode="outlined"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                style={styles.textInput}
                theme={{
                  colors: {
                    primary: '#FFD700',
                    outline: '#FFD700',
                    background: '#1A1A1A',
                    onSurfaceVariant: '#FFD700',
                    placeholder: '#888',
                  }
                }}
                textColor="#FFF"
                placeholderTextColor="#888"
              />
            </View>

            {/* Role Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>I am a</Text>
              <View style={styles.roleContainer}>
                <RoleCard
                  title="Student"
                  icon="school"
                  selected={formData.role === 'Student'}
                  onPress={() => handleInputChange('role', 'Student')}
                />
                <RoleCard
                  title="Landlord"
                  icon="home"
                  selected={formData.role === 'Landlord'}
                  onPress={() => handleInputChange('role', 'Landlord')}
                />
              </View>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <GenderButton
                    key={gender}
                    title={gender}
                    selected={formData.gender === gender}
                    onPress={() => handleInputChange('gender', gender)}
                  />
                ))}
              </View>
            </View>

            {/* City Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.cityScrollView}
              >
                {cities.map((city) => (
                  <CityButton
                    key={city}
                    title={city}
                    selected={formData.city === city}
                    onPress={() => handleInputChange('city', city)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Preferred Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Preferred Location</Text>
              <TextInput
                mode="outlined"
                placeholder="e.g., Near college, Market area"
                value={formData.preferredLocation}
                onChangeText={(text) => handleInputChange('preferredLocation', text)}
                style={styles.textInput}
                theme={{
                  colors: {
                    primary: '#FFD700',
                    outline: '#FFD700',
                    background: '#1A1A1A',
                    onSurfaceVariant: '#FFD700',
                    placeholder: '#888',
                  }
                }}
                textColor="#FFF"
                placeholderTextColor="#888"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Creating Profile...' : 'Complete Profile'}
                </Text>
                <MaterialIcons name="arrow-forward" size={24} color="#000" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  roleCard: {
    flex: 1,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#FFD700',
  },
  roleCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  roleCardText: {
    fontSize: 16,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  selectedGenderButton: {
    backgroundColor: '#FFD700',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cityScrollView: {
    flexDirection: 'row',
  },
  cityButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#1A1A1A',
    marginRight: 10,
  },
  selectedCityButton: {
    backgroundColor: '#FFD700',
  },
  cityButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SignUpScreen;