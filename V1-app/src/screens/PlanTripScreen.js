import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker"
const GROQ_API_KEY;
console.log("api key......",GROQ_API_KEY);
export default function PlanTripScreen({ navigation }) {
  const [formData, setFormData] = useState({
    from: "",
    toTemple: "",
    travelMode: "flight",
    duration: "3",
    travelDate: "",
    travelers: "2",
    budgetLevel: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [budgetData, setBudgetData] = useState(null);
  const scrollViewRef = useRef(null);

  const travelModes = [
    { label: "Flight", value: "flight", icon: "flight" },
    { label: "Train", value: "train", icon: "train" },
    { label: "Car", value: "car", icon: "directions-car" },
  ];

  const budgetLevels = [
    { label: "Budget", value: "budget" },
    { label: "Medium", value: "medium" },
    { label: "Luxury", value: "luxury" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getBudgetEstimate = async () => {
    const prompt = `You are a travel budget estimation assistant for Indian temple tourism. Based on the following trip details, provide a detailed cost breakdown in JSON format.

Trip Details:
- From: ${formData.from}
- To Temple: ${formData.toTemple}
- Travel Mode: ${formData.travelMode}
- Duration: ${formData.duration} days
- Travel Date: ${formData.travelDate}
- Number of Travelers: ${formData.travelers}
- Budget Level: ${formData.budgetLevel}

Provide realistic Indian Rupee (INR) costs for ${formData.travelers} travelers at ${formData.budgetLevel} budget level.

Return ONLY valid JSON in this exact structure (no markdown, no additional text):
{
  "transportation": {
    "mode": "${formData.travelMode}",
    "cost": 15000,
    "details": "Round trip ${formData.travelMode} fare for ${formData.travelers} persons"
  },
  "accommodation": {
    "perNight": 2000,
    "totalNights": ${parseInt(formData.duration) - 1},
    "totalCost": ${(parseInt(formData.duration) - 1) * 2000},
    "type": "3-star hotel",
    "details": "Double occupancy room with breakfast"
  },
  "food": {
    "perDay": 800,
    "totalDays": ${formData.duration},
    "totalCost": ${parseInt(formData.duration) * 800},
    "details": "3 meals per person per day"
  },
  "localTransport": {
    "perDay": 500,
    "totalDays": ${formData.duration},
    "totalCost": ${parseInt(formData.duration) * 500},
    "details": "Auto/taxi for local sightseeing"
  },
  "templeAndActivities": {
    "entranceFees": 200,
    "activities": 1500,
    "totalCost": 1700,
    "details": "Temple darshan, prasad, and local activities"
  },
  "miscellaneous": {
    "amount": 2000,
    "details": "Shopping, tips, emergency fund"
  },
  "totalCost": 0,
  "perPersonCost": 0,
  "recommendations": [
    "Book transportation tickets in advance for better prices",
    "Carry cash as many temples don't accept cards",
    "Check temple timings and dress code before visiting"
  ]
}`;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are a travel budget expert specializing in Indian temple tourism. Always respond with valid JSON only, no markdown formatting."
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 2048,
            response_format: { type: "json_object" }
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Response:", errorData);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2));

      if (data.choices && data.choices[0]?.message?.content) {
        let responseText = data.choices[0].message.content;
        
        responseText = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        
        console.log("Cleaned Response:", responseText);
        
        const budgetData = JSON.parse(responseText);
        
        if (!budgetData.totalCost || budgetData.totalCost === 0) {
          budgetData.totalCost = 
            budgetData.transportation.cost +
            budgetData.accommodation.totalCost +
            budgetData.food.totalCost +
            budgetData.localTransport.totalCost +
            budgetData.templeAndActivities.totalCost +
            budgetData.miscellaneous.amount;
        }
        
        if (!budgetData.perPersonCost || budgetData.perPersonCost === 0) {
          budgetData.perPersonCost = Math.round(
            budgetData.totalCost / parseInt(formData.travelers)
          );
        }
        
        return budgetData;
      } else {
        console.error("Invalid API response structure:", data);
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Error fetching budget estimate:", error);
      throw error;
    }
  };

  const handlePlanTrip = async () => {
    if (!formData.from || !formData.toTemple) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!GROQ_API_KEY) {
      Alert.alert(
        "API Key Missing",
        "Please add your Groq API key. Get it free from https://console.groq.com"
      );
      return;
    }

    setLoading(true);
    setBudgetData(null);

    try {
      const budget = await getBudgetEstimate();
      setBudgetData(budget);
      
      // Scroll to results after a short delay
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to generate budget estimate. Please check your API key and try again."
      );
      console.error("Trip planning error:", error);
    } finally {
      setLoading(false);
    }
  };

  const CostCard = ({ icon, title, cost, details, iconColor }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
          <Icon name={icon} size={28} color={iconColor} />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardCost}>{formatCurrency(cost)}</Text>
        </View>
      </View>
      <Text style={styles.cardDetails}>{details}</Text>
    </View>
  );

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.formContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="festival" size={32} color="#FF6B35" />
          <Text style={styles.headerText}>Plan Your Spiritual Journey</Text>
        </View>

        {/* From Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>From</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="my-location"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Your current location"
              value={formData.from}
              onChangeText={(value) => handleInputChange("from", value)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* To Temple */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>To Temple</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="temple-hindu"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Select temple destination"
              value={formData.toTemple}
              onChangeText={(value) => handleInputChange("toTemple", value)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Travel Mode */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Travel Mode</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="flight"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.travelMode}
                onValueChange={(value) =>
                  handleInputChange("travelMode", value)
                }
                style={styles.picker}
              >
                {travelModes.map((mode) => (
                  <Picker.Item
                    key={mode.value}
                    label={mode.label}
                    value={mode.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Duration (Days)</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="calendar-today"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="3"
              value={formData.duration}
              onChangeText={(value) => handleInputChange("duration", value)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Travel Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Travel Date</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="date-range"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="mm/dd/yyyy"
              value={formData.travelDate}
              onChangeText={(value) => handleInputChange("travelDate", value)}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Number of Travelers */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Travelers</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="people"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="2"
              value={formData.travelers}
              onChangeText={(value) => handleInputChange("travelers", value)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Budget Level */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget Level</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="account-balance-wallet"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.budgetLevel}
                onValueChange={(value) =>
                  handleInputChange("budgetLevel", value)
                }
                style={styles.picker}
              >
                {budgetLevels.map((level) => (
                  <Picker.Item
                    key={level.value}
                    label={level.label}
                    value={level.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Plan Trip Button */}
        <TouchableOpacity 
          style={[styles.planButton, loading && styles.planButtonDisabled]} 
          onPress={handlePlanTrip}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.planButtonText}>Calculating...</Text>
            </>
          ) : (
            <>
              <Text style={styles.planButtonText}>Get Cost Estimate</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        {/* Cost Estimate Results */}
        {budgetData && (
          <View style={styles.resultsContainer}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Icon name="account-balance-wallet" size={32} color="#FF6B35" />
                <Text style={styles.summaryTitle}>Trip Summary</Text>
              </View>
              
              <View style={styles.tripInfo}>
                <View style={styles.tripInfoRow}>
                  <Icon name="location-on" size={20} color="#666" />
                  <Text style={styles.tripInfoText}>
                    {formData.from} → {formData.toTemple}
                  </Text>
                </View>
                <View style={styles.tripInfoRow}>
                  <Icon name="calendar-today" size={20} color="#666" />
                  <Text style={styles.tripInfoText}>
                    {formData.duration} days • {formData.travelDate}
                  </Text>
                </View>
                <View style={styles.tripInfoRow}>
                  <Icon name="people" size={20} color="#666" />
                  <Text style={styles.tripInfoText}>
                    {formData.travelers} travelers • {formData.budgetLevel} budget
                  </Text>
                </View>
              </View>

              <View style={styles.totalCostContainer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Trip Cost</Text>
                  <Text style={styles.totalAmount}>{formatCurrency(budgetData.totalCost)}</Text>
                </View>
                <View style={styles.perPersonRow}>
                  <Text style={styles.perPersonLabel}>Per Person</Text>
                  <Text style={styles.perPersonAmount}>{formatCurrency(budgetData.perPersonCost)}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Detailed Breakdown</Text>

            <CostCard
              icon="flight"
              title="Transportation"
              cost={budgetData.transportation.cost}
              details={budgetData.transportation.details}
              iconColor="#2196F3"
            />

            <CostCard
              icon="hotel"
              title="Accommodation"
              cost={budgetData.accommodation.totalCost}
              details={`${budgetData.accommodation.type} - ${budgetData.accommodation.totalNights} nights at ${formatCurrency(budgetData.accommodation.perNight)}/night. ${budgetData.accommodation.details}`}
              iconColor="#9C27B0"
            />

            <CostCard
              icon="restaurant"
              title="Food & Dining"
              cost={budgetData.food.totalCost}
              details={`${formatCurrency(budgetData.food.perDay)} per day for ${budgetData.food.totalDays} days. ${budgetData.food.details}`}
              iconColor="#FF9800"
            />

            <CostCard
              icon="directions-car"
              title="Local Transport"
              cost={budgetData.localTransport.totalCost}
              details={`${formatCurrency(budgetData.localTransport.perDay)} per day for ${budgetData.localTransport.totalDays} days. ${budgetData.localTransport.details}`}
              iconColor="#00BCD4"
            />

            <CostCard
              icon="temple-hindu"
              title="Temple & Activities"
              cost={budgetData.templeAndActivities.totalCost}
              details={budgetData.templeAndActivities.details}
              iconColor="#FF6B35"
            />

            <CostCard
              icon="shopping-bag"
              title="Miscellaneous"
              cost={budgetData.miscellaneous.amount}
              details={budgetData.miscellaneous.details}
              iconColor="#795548"
            />

            {/* Recommendations */}
            <View style={styles.recommendationsCard}>
              <View style={styles.recommendationsHeader}>
                <Icon name="lightbulb" size={24} color="#FFB800" />
                <Text style={styles.recommendationsTitle}>Travel Tips</Text>
              </View>
              {budgetData.recommendations.map((tip, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon name="check-circle" size={18} color="#4CAF50" />
                  <Text style={styles.recommendationText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => {
                Alert.alert("Success", "Booking feature coming soon!");
              }}
            >
              <Icon name="check-circle" size={24} color="#fff" />
              <Text style={styles.bookButtonText}>Confirm & Proceed</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modifyButton}
              onPress={() => {
                setBudgetData(null);
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              }}
            >
              <Icon name="edit" size={20} color="#FF6B35" />
              <Text style={styles.modifyButtonText}>Modify Trip Details</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  formContainer: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  planButton: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  planButtonDisabled: {
    backgroundColor: "#FFB199",
  },
  planButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    marginLeft: 8,
  },
  resultsContainer: {
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 12,
  },
  tripInfo: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tripInfoText: {
    fontSize: 15,
    color: "#555",
    marginLeft: 12,
    flex: 1,
  },
  totalCostContainer: {
    borderTopWidth: 2,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  perPersonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  perPersonLabel: {
    fontSize: 14,
    color: "#666",
  },
  perPersonAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cardCost: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  cardDetails: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: "#FFFBF0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modifyButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF6B35",
    marginBottom: 16,
  },
  modifyButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomPadding: {
    height: 24,
  },
});