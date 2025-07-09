import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import colors from '../style/colors';
import fonts from '../style/fonts';

const { width, height } = Dimensions.get('window');

const PGDetailScreen = ({ route, navigation }) => {
  const { pgData } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock images if not provided
  const images = pgData.images || [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
  ];

  const amenities = pgData.amenities || [
    { name: 'WiFi', icon: 'wifi' },
    { name: 'AC', icon: 'snow' },
    { name: 'Food', icon: 'restaurant' },
    { name: 'Laundry', icon: 'shirt' },
    { name: 'Parking', icon: 'car' },
    { name: 'Security', icon: 'shield-checkmark' },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this PG: ${pgData.name}\nLocation: ${pgData.location}\nPrice: ₹${pgData.price}/month\nRating: ${pgData.rating}⭐`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share PG details');
    }
  };

  const handleContact = () => {
    Alert.alert(
      'Contact Owner',
      `Call ${pgData.ownerName || 'Owner'} at ${pgData.phone || '+91 98765 43210'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling...') },
      ]
    );
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically update Firebase
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
        <Text style={styles.headerTitle}>PG Details</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.gold} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorited ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorited ? colors.gold : colors.lightGray} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
          <View style={styles.imageIndicator}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentImageIndex ? colors.gold : colors.lightGray }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.pgName}>{pgData.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.gold} />
              <Text style={styles.rating}>{pgData.rating}</Text>
            </View>
          </View>
          <Text style={styles.location}>{pgData.location}</Text>
          <Text style={styles.price}>₹{pgData.price}/month</Text>
        </View>

        {/* Gender & Type */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="people" size={20} color={colors.gold} />
            <Text style={styles.detailText}>{pgData.gender || 'Co-ed'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="bed" size={20} color={colors.gold} />
            <Text style={styles.detailText}>{pgData.type || 'Single/Double'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={20} color={colors.gold} />
            <Text style={styles.detailText}>{pgData.distance || '1.2 km'} away</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            {amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name={amenity.icon} size={24} color={colors.gold} />
                <Text style={styles.amenityText}>{amenity.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {pgData.description || 
            'Well-maintained PG with all modern amenities. Located in a prime location with easy access to metro and bus stops. Safe and secure environment for students and working professionals.'}
          </Text>
        </View>

        {/* Owner Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Details</Text>
          <View style={styles.ownerContainer}>
            <View style={styles.ownerAvatar}>
              <Ionicons name="person" size={24} color={colors.gold} />
            </View>
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{pgData.ownerName || 'Mr. Sharma'}</Text>
              <Text style={styles.ownerPhone}>{pgData.phone || '+91 98765 43210'}</Text>
            </View>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsPlaceholder}>No reviews yet. Be the first to review!</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Ionicons name="call" size={20} color={colors.black} />
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
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
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pgName: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.white,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  location: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.lightGray,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.gold,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    backgroundColor: colors.darkGray,
    borderRadius: 15,
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: 15,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  amenityItem: {
    alignItems: 'center',
    width: (width - 80) / 3,
    gap: 8,
  },
  amenityText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.white,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.lightGray,
    lineHeight: 24,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: 4,
  },
  ownerPhone: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.lightGray,
  },
  reviewsContainer: {
    padding: 20,
    backgroundColor: colors.darkGray,
    borderRadius: 15,
    alignItems: 'center',
  },
  reviewsPlaceholder: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.lightGray,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.black,
    gap: 15,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: colors.gold,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  bookButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: colors.darkGray,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default PGDetailScreen;