
const MOCK_PG_DATA = [
  {
    id: "1",
    name: "Krishna Boys PG",
    location: "Jalandhar, Punjab",
    price: "4500",
    gender: "Male",
    foodIncluded: true,
    wifi: true,
    ac: false,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
    ],
    distanceFromCollege: "1.2 km",
    contact: "+91 9876543210",
    verified: true,
    rating: 4.2,
    amenities: ["WiFi", "Laundry", "Security", "Common Room"]
  },
  {
    id: "2",
    name: "Shakti Girls Hostel",
    location: "Indore, Madhya Pradesh",
    price: "5000",
    gender: "Female",
    foodIncluded: true,
    wifi: true,
    ac: true,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
    ],
    distanceFromCollege: "0.8 km",
    contact: "+91 9123456780",
    verified: true,
    rating: 4.5,
    amenities: ["WiFi", "AC", "Food", "Security", "Gym"]
  },
  {
    id: "3",
    name: "Modern Co-living Space",
    location: "Bhopal, Madhya Pradesh",
    price: "6000",
    gender: "Mixed",
    foodIncluded: false,
    wifi: true,
    ac: true,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=400"
    ],
    distanceFromCollege: "2.1 km",
    contact: "+91 9876543211",
    verified: true,
    rating: 4.7,
    amenities: ["WiFi", "AC", "Parking", "Security", "Rooftop"]
  }
];

class ApiService {
  static async fetchPGListings(filters = {}) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredData = [...MOCK_PG_DATA];
      
      // Apply filters
      if (filters.gender && filters.gender !== 'All') {
        filteredData = filteredData.filter(pg => 
          pg.gender === filters.gender || pg.gender === 'Mixed'
        );
      }
      
      if (filters.maxPrice) {
        filteredData = filteredData.filter(pg => 
          parseInt(pg.price) <= filters.maxPrice
        );
      }
      
      if (filters.foodIncluded) {
        filteredData = filteredData.filter(pg => pg.foodIncluded);
      }
      
      if (filters.wifi) {
        filteredData = filteredData.filter(pg => pg.wifi);
      }
      
      if (filters.ac) {
        filteredData = filteredData.filter(pg => pg.ac);
      }
      
      return {
        success: true,
        data: filteredData,
        message: 'PG listings fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message
      };
    }
  }
  
  static async fetchPGDetails(pgId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const pg = MOCK_PG_DATA.find(item => item.id === pgId);
      
      if (!pg) {
        throw new Error('PG not found');
      }
      
      return {
        success: true,
        data: pg,
        message: 'PG details fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }
}

export default ApiService;