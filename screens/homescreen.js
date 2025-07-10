import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

// Import components
import FilterModal from '../components/filtermodal';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [pgListings, setPgListings] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    gender: 'All',
    maxRent: 15000,
    foodIncluded: false,
    distance: 5,
  });

  const scrollY = new Animated.Value(0);

  useEffect(() => {
    fetchUserData();
    fetchPGListings();
    fetchFeaturedProperties();
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

  const fetchFeaturedProperties = async () => {
    // Simulating API call to external property service
    const featuredMockData = [
      {
        id: 'f1',
        title: 'Luxury Studio Apartment',
        price: 25000,
        location: 'Golf Course Road, Gurgaon',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        rating: 4.8,
        type: 'Apartment',
        verified: true,
      },
      {
        id: 'f2',
        title: 'Modern Co-living Space',
        price: 18000,
        location: 'Indiranagar, Bangalore',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        rating: 4.6,
        type: 'Co-living',
        verified: true,
      },
      {
        id: 'f3',
        title: 'Premium PG with Amenities',
        price: 22000,
        location: 'Koregaon Park, Pune',
        image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400',
        rating: 4.7,
        type: 'PG',
        verified: true,
      },
    ];
    setFeaturedProperties(featuredMockData);
  };

  const fetchPGListings = async () => {
    try {
      setLoading(true);
      
      // Enhanced mock data with more properties
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
          description: 'Well-maintained PG with all modern amenities',
          availability: 'Available',
          owner: 'Raj Kumar',
          contact: '+91 98765 43210'
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
          description: 'Premium PG for working professionals',
          availability: 'Available',
          owner: 'Priya Sharma',
          contact: '+91 87654 32109'
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
          description: 'Budget-friendly PG near coaching institutes',
          availability: 'Available',
          owner: 'Amit Singh',
          contact: '+91 76543 21098'
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
          description: 'Comfortable living with home-like atmosphere',
          availability: 'Available',
          owner: 'Sunita Devi',
          contact: '+91 65432 10987'
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
          description: 'Luxury PG with premium facilities',
          availability: 'Available',
          owner: 'Vikram Patel',
          contact: '+91 54321 09876'
        },
        {
          id: '6',
          name: 'Urban Nest PG',
          price: 9500,
          location: 'Laxmi Nagar, Delhi',
          gender: 'Female',
          food: true,
          verified: true,
          rating: 4.1,
          distance: 2.8,
          images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
          amenities: ['WiFi', 'AC', 'Laundry', 'Kitchen'],
          description: 'Modern PG with excellent connectivity',
          availability: 'Available',
          owner: 'Neha Gupta',
          contact: '+91 43210 98765'
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

    if (searchQuery.trim()) {
      filtered = filtered.filter(pg =>
        pg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilters.gender !== 'All') {
      filtered = filtered.filter(pg => pg.gender === activeFilters.gender);
    }

    filtered = filtered.filter(pg => pg.price <= activeFilters.maxRent);

    if (activeFilters.foodIncluded) {
      filtered = filtered.filter(pg => pg.food === true);
    }

    filtered = filtered.filter(pg => pg.distance <= activeFilters.distance);

    setFilteredListings(filtered);
  };

  const handleFilterApply = (newFilters) => {
    setActiveFilters(newFilters);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPGListings();
    await fetchFeaturedProperties();
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            auth.signOut();
            // Navigate to login screen
            console.log('User logged out');
          }
        }
      ]
    );
  };

  const navigateToScreen = (screen) => {
    setCurrentScreen(screen);
  };

  const navigateToDetails = (property) => {
    setSelectedProperty(property);
    setCurrentScreen('details');
  };

  const navigateToFeaturedDetails = (property) => {
    setSelectedProperty(property);
    setCurrentScreen('details');
  };

  const navigateToChat = (property = null) => {
    setSelectedProperty(property);
    setCurrentScreen('chat');
  };

  const renderFeaturedItem = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigateToFeaturedDetails(item)}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.featuredImage}
        imageStyle={styles.featuredImageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredBadge}>
            <MaterialIcons name="verified" size={14} color="#4CAF50" />
            <Text style={styles.featuredBadgeText}>{item.type}</Text>
          </View>
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <Text style={styles.featuredLocation}>{item.location}</Text>
            <View style={styles.featuredBottom}>
              <Text style={styles.featuredPrice}>₹{item.price}/mo</Text>
              <View style={styles.featuredRating}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.featuredRatingText}>{item.rating}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderPGCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pgCard}
      onPress={() => navigateToDetails(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.images[0] }} style={styles.pgImage} />
      <View style={styles.pgContent}>
        <View style={styles.pgHeader}>
          <Text style={styles.pgName}>{item.name}</Text>
          {item.verified && (
            <MaterialIcons name="verified" size={18} color="#4CAF50" />
          )}
        </View>
        <Text style={styles.pgLocation}>{item.location}</Text>
        <Text style={styles.pgDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {item.amenities.length > 3 && (
            <Text style={styles.moreAmenities}>+{item.amenities.length - 3} more</Text>
          )}
        </View>

        <View style={styles.pgFooter}>
          <View style={styles.pgPriceContainer}>
            <Text style={styles.pgPrice}>₹{item.price}</Text>
            <Text style={styles.pgPriceUnit}>/month</Text>
          </View>
          <View style={styles.pgActions}>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigateToChat(item)}
            >
              <MaterialIcons name="chat" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChatScreen = () => (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => navigateToScreen('home')}>
          <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatTitle}>
            {selectedProperty?.name || selectedProperty?.title || 'Property Chat'}
          </Text>
          <Text style={styles.chatSubtitle}>
            {selectedProperty?.owner || 'Property Owner'}
          </Text>
        </View>
        <TouchableOpacity style={styles.chatCallButton}>
          <MaterialIcons name="call" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.chatMessages}>
        <View style={styles.chatBubble}>
          <Text style={styles.chatText}>Hello! I'm interested in your property.</Text>
          <Text style={styles.chatTime}>10:30 AM</Text>
        </View>
        <View style={[styles.chatBubble, styles.chatBubbleOwner]}>
          <Text style={[styles.chatText, styles.chatTextOwner]}>Hi! Thank you for your interest. What would you like to know?</Text>
          <Text style={[styles.chatTime, styles.chatTimeOwner]}>10:32 AM</Text>
        </View>
        <View style={styles.chatBubble}>
          <Text style={styles.chatText}>Is the property available for immediate booking?</Text>
          <Text style={styles.chatTime}>10:35 AM</Text>
        </View>
        <View style={[styles.chatBubble, styles.chatBubbleOwner]}>
          <Text style={[styles.chatText, styles.chatTextOwner]}>Yes, it's available. Would you like to schedule a visit?</Text>
          <Text style={[styles.chatTime, styles.chatTimeOwner]}>10:36 AM</Text>
        </View>
        <View style={styles.chatBubble}>
          <Text style={styles.chatText}>That sounds great! What time works best for you?</Text>
          <Text style={styles.chatTime}>10:38 AM</Text>
        </View>
      </ScrollView>
      
      <View style={styles.chatInput}>
        <TextInput
          style={styles.chatTextInput}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity style={styles.chatAttachButton}>
          <MaterialIcons name="attach-file" size={20} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatSendButton}>
          <MaterialIcons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHomeContent = () => (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#FFD700']}
          tintColor="#FFD700"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userGreeting}>
            <Text style={styles.greetingText}>Hello!</Text>
            <Text style={styles.userName}>
              {user?.name || 'User'} 👋
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateToScreen('settings')}
            >
              <MaterialIcons name="settings" size={22} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateToScreen('ai-help')}
            >
              <MaterialIcons name="smart-toy" size={22} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigateToScreen('profile')}
            >
              <Image
                source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#888" />
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
            <MaterialIcons name="tune" size={20} color="#000" />
            {getActiveFilterCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Properties */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Properties</Text>
        <FlatList
          data={featuredProperties}
          renderItem={renderFeaturedItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>

      {/* PG Listings */}
      <View style={styles.pgSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PG Listings</Text>
          <Text style={styles.sectionCount}>
            {filteredListings.length} found
          </Text>
        </View>
        
        {filteredListings.length > 0 ? (
          <FlatList
            data={filteredListings}
            renderItem={renderPGCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.pgList}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={60} color="#444" />
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
        )}
      </View>

      {/* Premium Plans Section */}
      <View style={styles.premiumSection}>
        <Text style={styles.sectionTitle}>Premium Plans</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.premiumList}>
          <TouchableOpacity style={styles.premiumCard} activeOpacity={0.9}>
            <View style={styles.premiumHeader}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.premiumTitle}>Basic</Text>
            </View>
            <Text style={styles.premiumPrice}>₹99<Text style={styles.premiumPriceUnit}>/month</Text></Text>
            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>View 10 properties/day</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Basic filters</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Email support</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Choose Plan</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.premiumCard, styles.premiumCardPopular]} activeOpacity={0.9}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>POPULAR</Text>
            </View>
            <View style={styles.premiumHeader}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.premiumTitle}>Pro</Text>
            </View>
            <Text style={styles.premiumPrice}>₹199<Text style={styles.premiumPriceUnit}>/month</Text></Text>
            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Unlimited properties</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Advanced filters</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Priority support</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>AI recommendations</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.premiumButton, styles.premiumButtonPopular]}>
              <Text style={styles.premiumButtonTextPopular}>Choose Plan</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.premiumCard} activeOpacity={0.9}>
            <View style={styles.premiumHeader}>
              <MaterialIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.premiumTitle}>Elite</Text>
            </View>
            <Text style={styles.premiumPrice}>₹399<Text style={styles.premiumPriceUnit}>/month</Text></Text>
            <View style={styles.premiumFeatures}>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Everything in Pro</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Virtual tours</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>24/7 support</Text>
              </View>
              <View style={styles.premiumFeature}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.premiumFeatureText}>Concierge service</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Choose Plan</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="#FF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderDetailsScreen = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailsHeader}>
        <TouchableOpacity onPress={() => navigateToScreen('home')}>
          <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.detailsTitle}>Property Details</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite-border" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.detailsContent}>
        <Image 
          source={{ uri: selectedProperty?.images?.[0] || selectedProperty?.image }} 
          style={styles.detailsImage} 
        />
        
        <View style={styles.detailsInfo}>
          <View style={styles.detailsMainInfo}>
            <Text style={styles.detailsName}>
              {selectedProperty?.name || selectedProperty?.title}
            </Text>
            <View style={styles.detailsVerified}>
              <MaterialIcons name="verified" size={20} color="#4CAF50" />
              <Text style={styles.detailsVerifiedText}>Verified</Text>
            </View>
          </View>
          
          <Text style={styles.detailsLocation}>
            <MaterialIcons name="location-on" size={16} color="#FFD700" />
            {selectedProperty?.location}
          </Text>
          
          <View style={styles.detailsRating}>
            <MaterialIcons name="star" size={18} color="#FFD700" />
            <Text style={styles.detailsRatingText}>
              {selectedProperty?.rating} • Excellent
            </Text>
          </View>
          
          <Text style={styles.detailsPrice}>
            ₹{selectedProperty?.price}
            <Text style={styles.detailsPriceUnit}>/month</Text>
          </Text>
          
          <Text style={styles.detailsDescription}>
            {selectedProperty?.description || 'This is a premium property with excellent amenities and great location connectivity.'}
          </Text>
          
          {selectedProperty?.amenities && (
            <View style={styles.detailsAmenities}>
              <Text style={styles.detailsAmenitiesTitle}>Amenities</Text>
              <View style={styles.detailsAmenitiesGrid}>
                {selectedProperty.amenities.map((amenity, index) => (
                  <View key={index} style={styles.detailsAmenityItem}>
                    <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                    <Text style={styles.detailsAmenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.detailsOwner}>
            <Text style={styles.detailsOwnerTitle}>Contact Owner</Text>
            <View style={styles.detailsOwnerInfo}>
              <View style={styles.detailsOwnerAvatar}>
                <MaterialIcons name="person" size={24} color="#FFD700" />
              </View>
              <View style={styles.detailsOwnerDetails}>
                <Text style={styles.detailsOwnerName}>
                  {selectedProperty?.owner || 'Property Owner'}
                </Text>
                <Text style={styles.detailsOwnerPhone}>
                  {selectedProperty?.contact || '+91 XXXXX XXXXX'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.detailsActions}>
        <TouchableOpacity style={styles.detailsCallButton}>
          <MaterialIcons name="call" size={20} color="#FFF" />
          <Text style={styles.detailsCallButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.detailsChatButton}
          onPress={() => navigateToChat(selectedProperty)}
        >
          <MaterialIcons name="chat" size={20} color="#000" />
          <Text style={styles.detailsChatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettingsScreen = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <TouchableOpacity onPress={() => navigateToScreen('home')}>
          <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.settingsTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.settingsContent}>
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="person" size={24} color="#FFD700" />
            <Text style={styles.settingsItemText}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="lock" size={24} color="#FFD700" />
            <Text style={styles.settingsItemText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="notifications" size={24} color="#FFD700" />
            <Text style={styles.settingsItemText}>Notifications</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="language" size={24} color="#FFD700" />
            <Text style={styles.settingsItemText}>Language</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="help" size={24} color="#FFD700" />
            <Text style={styles.settingsItemText}>Help Center</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <MaterialIcons name="feedback" size={24} color="#FFD700" />
            <Text style={styles.settingsItemText}>Send Feedback</Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderAIHelpScreen = () => (
    <View style={styles.aiHelpContainer}>
      <View style={styles.aiHelpHeader}>
        <TouchableOpacity onPress={() => navigateToScreen('home')}>
          <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.aiHelpTitle}>AI Assistant</Text>
      </View>
      
      <ScrollView style={styles.aiHelpContent}>
        <View style={styles.aiWelcome}>
          <MaterialIcons name="smart-toy" size={60} color="#FFD700" />
          <Text style={styles.aiWelcomeText}>Hi! I'm your AI assistant</Text>
          <Text style={styles.aiWelcomeSubtext}>Ask me anything about properties!</Text>
        </View>
        
        <View style={styles.aiSuggestions}>
          <Text style={styles.aiSuggestionsTitle}>Quick Questions</Text>
          <TouchableOpacity style={styles.aiSuggestionItem}>
            <Text style={styles.aiSuggestionText}>Find PG under ₹10,000</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiSuggestionItem}>
            <Text style={styles.aiSuggestionText}>Best areas for students</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiSuggestionItem}>
            <Text style={styles.aiSuggestionText}>Properties with parking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.aiSuggestionItem}>
            <Text style={styles.aiSuggestionText}>Tips for PG hunting</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.aiInput}>
        <TextInput
          style={styles.aiTextInput}
          placeholder="Ask me anything..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity style={styles.aiSendButton}>
          <MaterialIcons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfileScreen = () => (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => navigateToScreen('home')}>
          <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.profileTitle}>Profile</Text>
      </View>
      
      <View style={styles.profileContent}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user?.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150' }}
            style={styles.profileImageLarge}
          />
        </View>
        
        <Text style={styles.profileName}>{user?.name || 'User Name'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        
        <View style={styles.profileInfo}>
          <View style={styles.profileInfoItem}>
            <MaterialIcons name="location-on" size={20} color="#FFD700" />
            <Text style={styles.profileInfoText}>{user?.city || 'Your City'}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <MaterialIcons name="phone" size={20} color="#FFD700" />
            <Text style={styles.profileInfoText}>{user?.phone || '+91 XXXXX XXXXX'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#000000', '#1A1A1A', '#2A2A2A']}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      {currentScreen === 'home' && renderHomeContent()}
      {currentScreen === 'chat' && renderChatScreen()}
      {currentScreen === 'details' && renderDetailsScreen()}
      {currentScreen === 'profile' && renderProfileScreen()}
      {currentScreen === 'settings' && renderSettingsScreen()}
      {currentScreen === 'ai-help' && renderAIHelpScreen()}

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
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  userGreeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  profileButton: {
    padding: 2,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  filterButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    padding: 12,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuredSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionCount: {
    fontSize: 16,
    color: '#CCC',
  },
  featuredList: {
    paddingLeft: 20,
  },
  featuredCard: {
    width: width * 0.75,
    height: 200,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredImageStyle: {
    borderRadius: 20,
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 15,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    gap: 5,
  },
  featuredBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredInfo: {
    gap: 5,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  featuredLocation: {
    fontSize: 14,
    color: '#CCC',
  },
  featuredBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  featuredRatingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pgSection: {
    paddingBottom: 100,
  },
  pgList: {
    paddingHorizontal: 20,
  },
  pgCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  pgImage: {
    width: '100%',
    height: 180,
  },
  pgContent: {
    padding: 15,
  },
  pgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  pgName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  pgLocation: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 8,
  },
  pgDescription: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 12,
    lineHeight: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  amenityTag: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amenityText: {
    color: '#FFF',
    fontSize: 12,
  },
  moreAmenities: {
    color: '#FFD700',
    fontSize: 12,
    alignSelf: 'center',
  },
  pgFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pgPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pgPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  pgPriceUnit: {
    fontSize: 14,
    color: '#CCC',
    marginLeft: 5,
  },
  pgActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButton: {
    backgroundColor: '#FFD700',
    padding: 8,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#CCC',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 15,
  },
  clearFiltersButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF4444',
    gap: 10,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  // Premium Plans Styles
  premiumSection: {
    paddingVertical: 20,
  },
  premiumList: {
    paddingLeft: 20,
  },
  premiumCard: {
    width: width * 0.75,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  premiumCardPopular: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  popularBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  premiumPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  premiumPriceUnit: {
    fontSize: 16,
    color: '#CCC',
  },
  premiumFeatures: {
    gap: 12,
    marginBottom: 25,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  premiumFeatureText: {
    color: '#FFF',
    fontSize: 14,
  },
  premiumButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumButtonPopular: {
    backgroundColor: '#FFD700',
  },
  premiumButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumButtonTextPopular: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: 15,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chatBubble: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#333',
  },
  chatBubbleOwner: {
    backgroundColor: '#FFD700',
    alignSelf: 'flex-end',
  },
  chatText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 20,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 10,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  chatSendButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 20,
  },
  // Profile Screen Styles
  profileContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: 15,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImageLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 30,
  },
  profileInfo: {
    width: '100%',
    gap: 20,
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    gap: 15,
  },
  profileInfoText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
});
export default HomeScreen;