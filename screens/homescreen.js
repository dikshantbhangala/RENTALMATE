import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

// Import components
import FilterModal from '../components/filtermodal';
import PGCard from '../components/pgcard';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [pgListings, setPgListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    gender: 'All',
    maxRent: 15000,
    foodIncluded: false,
    distance: 5,
  });

  useEffect(() => {
    fetchUserData();
    fetchPGListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pgListings, activeFilters, searchQuery]);

  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPGListings = async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with your actual API
      const mockListings = [
        {
          id: '1',
          name: 'Sunrise PG',
          price: 8000,
          location: 'Sector 15, Chandigarh',
          gender: 'Male',
          food: true,
          verified: true,
          rating: 4.5,
          distance: 2.5,
          images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'],
          amenities: ['WiFi', 'AC', 'Laundry', 'Parking'],
          description: 'Well-maintained PG with all modern amenities'
        },
        {
          id: '2',
          name: 'Golden Heights PG',
          price: 12000,
          location: 'Civil Lines, Dehradun',
          gender: 'Female',
          food: true,
          verified: true,
          rating: 4.2,
          distance: 1.8,
          images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
          amenities: ['WiFi', 'AC', 'Mess', 'Security'],
          description: 'Premium PG for working professionals'
        },
        {
          id: '3',
          name: 'Student Haven',
          price: 6500,
          location: 'University Area, Kota',
          gender: 'Male',
          food: false,
          verified: true,
          rating: 4.0,
          distance: 3.2,
          images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
          amenities: ['WiFi', 'Study Room', 'Laundry'],
          description: 'Budget-friendly PG near coaching institutes'
        },
        {
          id: '4',
          name: 'Comfort Zone PG',
          price: 10000,
          location: 'Malviya Nagar, Bhopal',
          gender: 'Female',
          food: true,
          verified: true,
          rating: 4.3,
          distance: 1.5,
          images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
          amenities: ['WiFi', 'AC', 'Gym', 'Mess'],
          description: 'Comfortable living with home-like atmosphere'
        },
        {
          id: '5',
          name: 'Elite Residency',
          price: 15000,
          location: 'Koregaon Park, Pune',
          gender: 'Male',
          food: true,
          verified: true,
          rating: 4.7,
          distance: 4.0,
          images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400'],
          amenities: ['WiFi', 'AC', 'Swimming Pool', 'Gym'],
          description: 'Luxury PG with premium facilities'
        },
      ];

      setPgListings(mockListings);
    } catch (error) {
      console.error('Error fetching PG listings:', error);
      Alert.alert('Error', 'Failed to load PG listings');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...pgListings];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(pg =>
        pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply gender filter
    if (activeFilters.gender !== 'All') {
      filtered = filtered.filter(pg => pg.gender === activeFilters.gender);
    }

    // Apply max rent filter
    filtered = filtered.filter(pg => pg.price <= activeFilters.maxRent);

    // Apply food filter
    if (activeFilters.foodIncluded) {
      filtered = filtered.filter(pg => pg.food === true);
    }

    // Apply distance filter
    filtered = filtered.filter(pg => pg.distance <= activeFilters.distance);

    setFilteredListings(filtered);
  };

  const handleFilterApply = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPGListings();
    setRefreshing(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.gender !== 'All') count++;
    if (activeFilters.maxRent < 15000) count++;
    if (activeFilters.foodIncluded) count++;
    if (activeFilters.distance < 5) count++;
    return count;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <StatusBar style="light" />
      <View style={styles.headerTop}>
        <View style={styles.userGreeting}>
          <Text style={styles.greetingText}>Hello!</Text>
          <Text style={styles.userName}>
            {user?.name || 'User'} 👋
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search PG or location..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialIcons name="tune" size={24} color="#000" />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredListings.length} PGs found
        </Text>
        <Text style={styles.statsSubtext}>
          {user?.city || 'Your city'}
        </Text>
      </View>
    </View>
  );

  const renderPGCard = ({ item }) => (
    <PGCard
      pg={item}
      onPress={() => {
        // Navigate to PG details screen
        console.log('Navigate to PG details:', item.id);
      }}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="search-off" size={80} color="#444" />
      <Text style={styles.emptyStateText}>No PGs found</Text>
      <Text style={styles.emptyStateSubtext}>
        Try adjusting your filters or search query
      </Text>
      <TouchableOpacity
        style={styles.clearFiltersButton}
        onPress={() => {
          setActiveFilters({
            gender: 'All',
            maxRent: 15000,
            foodIncluded: false,
            distance: 5,
          });
          setSearchQuery('');
        }}
      >
        <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#000000', '#1A1A1A', '#2A2A2A']}
      style={styles.container}
    >
      <FlatList
        data={filteredListings}
        renderItem={renderPGCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFD700']}
            tintColor="#FFD700"
          />
        }
        contentContainerStyle={styles.listContainer}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleFilterApply}
        currentFilters={activeFilters}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userGreeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  filterButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 10,
  },
  statsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  statsSubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  clearFiltersButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  clearFiltersButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;