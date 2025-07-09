// components/PGCard.js
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, FONTS } from '../styles/colors';

const { width } = Dimensions.get('window');

const PGCard = ({ pg, onPress }) => {
  const renderAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': '📶',
      'AC': '❄️',
      'Food': '🍽️',
      'Laundry': '👕',
      'Security': '🔒',
      'Parking': '🚗',
      'Gym': '💪',
      'Common Room': '🛋️',
      'Rooftop': '🏢'
    };
    return icons[amenity] || '✨';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pg.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Verified Badge */}
        {pg.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
        
        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{pg.price}/month</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {pg.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {pg.rating}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>📍 {pg.location}</Text>
          <Text style={styles.distanceText}>{pg.distanceFromCollege}</Text>
        </View>

        {/* Gender & Food */}
        <View style={styles.infoRow}>
          <View style={styles.genderBadge}>
            <Text style={styles.genderText}>
              {pg.gender === 'Male' ? '👨' : pg.gender === 'Female' ? '👩' : '👥'} {pg.gender}
            </Text>
          </View>
          
          {pg.foodIncluded && (
            <View style={styles.foodBadge}>
              <Text style={styles.foodText}>🍽️ Food</Text>
            </View>
          )}
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesContainer}>
          {pg.amenities.slice(0, 4).map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>{renderAmenityIcon(amenity)}</Text>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {pg.amenities.length > 4 && (
            <Text style={styles.moreAmenities}>+{pg.amenities.length - 4} more</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactText}>📞 Contact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.darkGray,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
    fontFamily: FONTS.semiBold,
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    marginRight: 12,
    fontFamily: FONTS.bold,
  },
  ratingContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: 'bold',
    fontFamily: FONTS.semiBold,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.gray,
    flex: 1,
    fontFamily: FONTS.regular,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: 'bold',
    fontFamily: FONTS.semiBold,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  genderBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  genderText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
    fontFamily: FONTS.semiBold,
  },
  foodBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  foodText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
    fontFamily: FONTS.semiBold,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  amenityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  amenityText: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: FONTS.regular,
  },
  moreAmenities: {
    fontSize: 12,
    color: COLORS.accent,
    fontStyle: 'italic',
    fontFamily: FONTS.regular,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: 'bold',
    fontFamily: FONTS.semiBold,
  },
  chatButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  chatText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontFamily: FONTS.semiBold,
  },
});

export default PGCard;