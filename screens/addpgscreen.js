import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { db } from '../firebaseConfig';
import colors from '../style/colors';
import fonts from '../style/fonts';

const AddPGScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    phone: '',
    ownerName: '',
    gender: 'Co-ed',
    type: 'Single',
    images: [],
  });

  const [amenities, setAmenities] = useState({
    wifi: false,
    ac: false,
    food: false,
    laundry: false,
    parking: false,
    security: false,
  });

  const [loading, setLoading] = useState(false);

  const genderOptions = ['Boys', 'Girls', 'Co-ed'];
  const typeOptions = ['Single', 'Double', 'Triple', 'Shared'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setAmenities(prev => ({
      ...prev,
      [amenity]: !prev[amenity],
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri],
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter PG name');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return false;
    }
    if (!formData.price.trim()) {
      Alert.alert('Error', 'Please enter price');
      return false;
    }
    if (!formData.ownerName.trim()) {
      Alert.alert('Error', 'Please enter owner name');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter valid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const pgData = {
        ...formData,
        price: parseInt(formData.price),
        amenities: Object.keys(amenities).filter(key => amenities[key]),
        rating: 4.0, // Default rating
        createdAt: new Date(),
        isActive: true,
      };

      await addDoc(collection(db, 'pg_listings'), pgData);
      
      Alert.alert(
        'Success',
        'PG listing added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding PG:', error);
      Alert.alert('Error', 'Failed to add PG listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.gold} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add PG Listing</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PG Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter PG name"
              placeholderTextColor={colors.lightGray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => handleInputChange('location', text)}
              placeholder="Enter location"
              placeholderTextColor={colors.lightGray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Monthly Rent (₹) *</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(text) => handleInputChange('price', text)}
              placeholder="Enter monthly rent"
              placeholderTextColor={colors.lightGray}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Describe your PG (facilities, rules, etc.)"
              placeholderTextColor={colors.lightGray}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* PG Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PG Type</Text>
          
          <View style={styles.optionContainer}>
            <Text style={styles.label}>Gender Preference</Text>
            <View style={styles.optionRow}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    formData.gender === option && styles.selectedOption,
                  ]}
                  onPress={() => handleInputChange('gender', option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.gender === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.label}>Room Type</Text>
            <View style={styles.optionRow}>
              {typeOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    formData.type === option && styles.selectedOption,
                  ]}
                  onPress={() => handleInputChange('type', option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.type === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {Object.keys(amenities).map((amenity) => (
              <View key={amenity} style={styles.amenityItem}>
                <Text style={styles.amenityLabel}>
                  {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                </Text>
                <Switch
                  value={amenities[amenity]}
                  onValueChange={() => handleAmenityToggle(amenity)}
                  trackColor={{ false: colors.darkGray, true: colors.gold }}
                  thumbColor={amenities[amenity] ? colors.black : colors.lightGray}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Ionicons name="camera" size={24} color={colors.gold} />
            <Text style={styles.imagePickerText}>Add Photos</Text>
          </TouchableOpacity>
          
          {formData.images.length > 0 && (
            <View style={styles.imageGrid}>
              {formData.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Owner Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.ownerName}
              onChangeText={(text) => handleInputChange('ownerName', text)}
              placeholder="Enter owner name"
              placeholderTextColor={colors.lightGray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Enter phone number"
              placeholderTextColor={colors.lightGray}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Bottom Space */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.submitButtonText}>Adding PG...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Add PG Listing</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.black,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.darkGray,
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.regular,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  selectedOption: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  selectedOptionText: {
    color: colors.black,
  },
  amenitiesContainer: {
    gap: 15,
  },
  amenityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.darkGray,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
  },
  amenityLabel: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkGray,
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
    marginBottom: 15,
  },
  imagePickerText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.gold,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.black,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpace: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.black,
  },
  submitButton: {
    backgroundColor: colors.gold,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.darkGray,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
