import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
const imageMap = {
  "golden_temple.jpg": require("../../assets/golden_temple.jpg"),
  "vaishno.png": require("../../assets/vaishno.png"),
  "tirupati.jpg": require("../../assets/tirupati.jpg"),
  "sidhivinayak.jpg": require("../../assets/sidhivinayak.jpg"),
  "meenakshi.jpg": require("../../assets/meenakshi.jpg"),
  "jaganath.jpg": require("../../assets/jaganath.jpg"),
};
// -----------------

// The screen component receives { route } which contains the parameters
export default function TempleDetailScreen({ route, navigation }) {
  // Get the templeData object we passed from HomeScreen
  const { templeData } = route.params;

  // Re-use the rating logic from HomeScreen
  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Icon
        key={star}
        name="star"
        size={20}
        color={star <= rating ? "#FFD700" : "#E0E0E0"}
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1. Image */}
      <Image source={templeData.image} style={styles.headerImage} />

      <View style={styles.infoContainer}>
        {/* 2. Name */}
        <Text style={styles.templeName}>{templeData.name}</Text>

        {/* 3. Location */}
        <View style={styles.locationRow}>
          <Icon name="location-on" size={18} color="#666" />
          <Text style={styles.locationText}>{templeData.location}</Text>
        </View>

        {/* 4. Rating */}
        <View style={styles.ratingRow}>
          {renderStars(templeData.rating)}
          <Text style={styles.ratingText}>
            {templeData.rating} ({templeData.reviews} reviews)
          </Text>
        </View>

        <Text style={styles.descriptionTitle}>About</Text>
        <Text style={styles.descriptionText}>{templeData.description}</Text>

        <LinearGradient
          colors={["#FF6B35", "#FF8A50"]}
          style={styles.tripButtonGradient}
        >
          <TouchableOpacity
            style={styles.tripButton}
            onPress={() => navigation.navigate('Plan', { templeName: templeData.name })}
          >
            <Icon name="event" size={20} color="#fff" />
            <Text style={styles.tripButtonText}>Plan Your Trip</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

// --- Styles for this screen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
    marginTop: -20, // Pulls info up over the image slightly
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  templeName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  ratingText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 30,
  },
  tripButtonGradient: {
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tripButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 25,
  },
  tripButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
