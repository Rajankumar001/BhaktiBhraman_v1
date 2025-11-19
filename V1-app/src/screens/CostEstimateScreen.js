import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTripEstimate } from "../services/aiProvider";

export default function CostEstimateScreen({ route }) {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tripData } = route.params || {};

  const generateEstimate = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await getTripEstimate(tripData);
      setEstimate(result);
    } catch (error) {
      console.error("Error generating estimate:", error);
      // Fallback estimate
      setEstimate({
        breakdown: {
          transportation: 8500,
          accommodation: 4200,
          food: 2100,
          templeEntry: 500,
          localTransport: 1200,
          miscellaneous: 1000,
        },
        total: 17500,
        aiTips: [
          "Travel on weekdays to save 15-20% on hotel costs. Book 3 weeks in advance for better flight prices.",
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [tripData]);

  useEffect(() => {
    if (tripData) {
      generateEstimate();
    }
  }, [tripData, generateEstimate]);

  const costItems = [
    { key: "transportation", label: "Transportation", icon: "flight" },
    { key: "accommodation", label: "Accommodation (3 days)", icon: "hotel" },
    { key: "food", label: "Food & Meals", icon: "restaurant" },
    {
      key: "templeEntry",
      label: "Temple Entry & Darshan",
      icon: "temple-hindu",
    },
    {
      key: "localTransport",
      label: "Local Transportation",
      icon: "directions-car",
    },
    { key: "miscellaneous", label: "Miscellaneous", icon: "shopping-bag" },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>
          Generating AI-Powered Cost Estimate...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>AI-Powered Cost Breakdown</Text>
      </View>

      {/* Cost Breakdown */}
      <View style={styles.breakdownContainer}>
        {costItems.map((item) => (
          <View key={item.key} style={styles.costItem}>
            <View style={styles.costItemLeft}>
              <Icon name={item.icon} size={24} color="#FF6B35" />
              <Text style={styles.costItemLabel}>{item.label}</Text>
            </View>
            <Text style={styles.costItemAmount}>
              ₹{estimate?.breakdown[item.key]?.toLocaleString("en-IN") || "0"}
            </Text>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Estimated Cost</Text>
          <Text style={styles.totalAmount}>
            ₹{estimate?.total?.toLocaleString("en-IN") || "0"}
          </Text>
        </View>
      </View>

      {/* AI Tips */}
      {estimate?.aiTips && estimate.aiTips.length > 0 && (
        <View style={styles.tipsContainer}>
          <View style={styles.tipHeader}>
            <Icon name="lightbulb" size={24} color="#FFB800" />
            <Text style={styles.tipTitle}>AI Tip:</Text>
          </View>
          {estimate.aiTips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>
              {tip}
            </Text>
          ))}
        </View>
      )}

      {/* Trip Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Trip Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>From:</Text>
          <Text style={styles.summaryValue}>{tripData?.from || "N/A"}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>To:</Text>
          <Text style={styles.summaryValue}>{tripData?.toTemple || "N/A"}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Duration:</Text>
          <Text style={styles.summaryValue}>
            {tripData?.duration || "0"} days
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Travelers:</Text>
          <Text style={styles.summaryValue}>
            {tripData?.travelers || "0"} people
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Travel Mode:</Text>
          <Text style={styles.summaryValue}>
            {tripData?.travelMode || "N/A"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  breakdownContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  costItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  costItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  costItemLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  costItemAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#FF6B35",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  tipsContainer: {
    backgroundColor: "#FFF8E1",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FFB800",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#E65100",
  },
  tipText: {
    fontSize: 14,
    color: "#E65100",
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
