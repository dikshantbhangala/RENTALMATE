import { MaterialIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState({
    gender: 'All',
    maxRent: 15000,
    foodIncluded: false,
    distance: 5,
    ...currentFilters
  });

  useEffect(() => {
    if (currentFilters) {
      setFilters(prev => ({
        ...prev,
        ...currentFilters
      }));
    }
  }, [currentFilters]);

  const resetFilters = () => {
    setFilters({
      gender: 'All',
      maxRent: 15000,
      foodIncluded: false,
      distance: 5,
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const GenderOption = ({ title, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.genderOption, selected && styles.selectedGenderOption]}
      onPress={onPress}
    >
      <Text style={[
        styles.genderOptionText,
        { color: selected ? '#000' : '#FFD700' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const FilterSection = ({ title, children }) => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#000000', '#1A1A1A', '#2A2A2A']}
            style={styles.modalGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#FFD700" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Filter PGs</Text>
              <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.filtersContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Gender Filter */}
              <FilterSection title="Gender Preference">
                <View style={styles.genderContainer}>
                  {['All', 'Male', 'Female'].map((gender) => (
                    <GenderOption
                      key={gender}
                      title={gender}
                      selected={filters.gender === gender}
                      onPress={() => setFilters(prev => ({ ...prev, gender }))}
                    />
                  ))}
                </View>
              </FilterSection>

              {/* Max Rent Filter */}
              <FilterSection title="Maximum Rent">
                <View style={styles.rentContainer}>
                  <Text style={styles.rentValue}>₹{filters.maxRent.toLocaleString()}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={3000}
                    maximumValue={25000}
                    value={filters.maxRent}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      maxRent: Math.round(value / 500) * 500 
                    }))}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="#444"
                    thumbStyle={styles.sliderThumb}
                    step={500}
                  />
                  <View style={styles.rentRange}>
                    <Text style={styles.rentRangeText}>₹3,000</Text>
                    <Text style={styles.rentRangeText}>₹25,000</Text>
                  </View>
                </View>
              </FilterSection>

              {/* Food Included Filter */}
              <FilterSection title="Food Included">
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Include food in rent</Text>
                  <Switch
                    value={filters.foodIncluded}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      foodIncluded: value 
                    }))}
                    trackColor={{ false: '#444', true: '#FFD700' }}
                    thumbColor={filters.foodIncluded ? '#FFA500' : '#CCC'}
                    ios_backgroundColor="#444"
                  />
                </View>
              </FilterSection>

              {/* Distance Filter */}
              <FilterSection title="Distance from Location">
                <View style={styles.distanceContainer}>
                  <Text style={styles.distanceValue}>Within {filters.distance} km</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={15}
                    value={filters.distance}
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      distance: Math.round(value) 
                    }))}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="#444"
                    thumbStyle={styles.sliderThumb}
                    step={1}
                  />
                  <View style={styles.distanceRange}>
                    <Text style={styles.distanceRangeText}>1 km</Text>
                    <Text style={styles.distanceRangeText}>15 km</Text>
                  </View>
                </View>
              </FilterSection>
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                  <MaterialIcons name="check" size={24} color="#000" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.8,
    width: width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  resetButton: {
    padding: 8,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  filtersContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
  selectedGenderOption: {
    backgroundColor: '#FFD700',
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rentContainer: {
    alignItems: 'center',
  },
  rentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#FFD700',
    width: 20,
    height: 20,
  },
  rentRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  rentRangeText: {
    fontSize: 14,
    color: '#CCC',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  distanceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  distanceRangeText: {
    fontSize: 14,
    color: '#CCC',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default FilterModal;