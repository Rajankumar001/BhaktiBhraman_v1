import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CostEstimateScreen({ route, navigation }) {
  const { tripData, budgetData } = route.params;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CostCard = ({ icon, title, cost, details, breakdown }) => (
    <View style={styles.costCard}>
      <View style={styles.costCardHeader}>
        <View style={styles.costCardTitleContainer}>
          <Icon name={icon} size={24} color="#FF6B35" />
          <Text style={styles.costCardTitle}>{title}</Text>
        </View>
        <Text style={styles.costCardAmount}>{formatCurrency(cost)}</Text>
      </View>
      {breakdown && (
        <View style={styles.breakdownContainer}>
          {breakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <Text style={styles.breakdownValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.costCardDetails}>{details}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Trip Summary Header */}
        <View style={styles.tripSummary}>
          <Icon name="travel-explore" size={32} color="#FF6B35" />
          <Text style={styles.tripTitle}>Your Trip Estimate</Text>
          <View style={styles.tripDetails}>
            <Text style={styles.tripDetailText}>
              {tripData.from} → {tripData.toTemple}
            </Text>
            <Text style={styles.tripDetailText}>
              {tripData.duration} days • {tripData.travelers} travelers
            </Text>
            <Text style={styles.tripDetailText}>
              {tripData.budgetLevel.charAt(0).toUpperCase() + 
               tripData.budgetLevel.slice(1)} Budget
            </Text>
          </View>
        </View>

        {/* Total Cost Card */}
        <View style={styles.totalCostCard}>
          <View style={styles.totalCostContent}>
            <Text style={styles.totalCostLabel}>Total Estimated Cost</Text>
            <Text style={styles.totalCostAmount}>
              {formatCurrency(budgetData.totalCost)}
            </Text>
            <Text style={styles.perPersonCost}>
              {formatCurrency(budgetData.perPersonCost)} per person
            </Text>
          </View>
        </View>

        {/* Cost Breakdown */}
        <Text style={styles.sectionTitle}>Cost Breakdown</Text>

        {/* Transportation */}
        <CostCard
          icon="flight"
          title="Transportation"
          cost={budgetData.transportation.cost}
          details={budgetData.transportation.details}
          breakdown={[
            {
              label: "Mode",
              value: budgetData.transportation.mode.charAt(0).toUpperCase() + 
                     budgetData.transportation.mode.slice(1),
            },
            {
              label: "For",
              value: `${tripData.travelers} travelers`,
            },
          ]}
        />

        {/* Accommodation */}
        <CostCard
          icon="hotel"
          title="Accommodation"
          cost={budgetData.accommodation.totalCost}
          details={budgetData.accommodation.details}
          breakdown={[
            {
              label: "Per Night",
              value: formatCurrency(budgetData.accommodation.perNight),
            },
            {
              label: "Total Nights",
              value: `${budgetData.accommodation.totalNights} nights`,
            },
            {
              label: "Type",
              value: budgetData.accommodation.type,
            },
          ]}
        />

        {/* Food & Dining */}
        <CostCard
          icon="restaurant"
          title="Food & Dining"
          cost={budgetData.food.totalCost}
          details={budgetData.food.details}
          breakdown={[
            {
              label: "Per Day",
              value: formatCurrency(budgetData.food.perDay),
            },
            {
              label: "Total Days",
              value: `${budgetData.food.totalDays} days`,
            },
          ]}
        />

        {/* Local Transport */}
        <CostCard
          icon="directions-car"
          title="Local Transport"
          cost={budgetData.localTransport.totalCost}
          details={budgetData.localTransport.details}
          breakdown={[
            {
              label: "Per Day",
              value: formatCurrency(budgetData.localTransport.perDay),
            },
            {
              label: "Total Days",
              value: `${budgetData.localTransport.totalDays} days`,
            },
          ]}
        />

        {/* Temple & Activities */}
        <CostCard
          icon="temple-hindu"
          title="Temple & Activities"
          cost={budgetData.templeAndActivities.totalCost}
          details={budgetData.templeAndActivities.details}
          breakdown={[
            {
              label: "Entrance Fees",
              value: formatCurrency(budgetData.templeAndActivities.entranceFees),
            },
            {
              label: "Activities",
              value: formatCurrency(budgetData.templeAndActivities.activities),
            },
          ]}
        />

        {/* Miscellaneous */}
        <CostCard
          icon="shopping-bag"
          title="Miscellaneous"
          cost={budgetData.miscellaneous.amount}
          details={budgetData.miscellaneous.details}
        />

        {/* Recommendations */}
        {budgetData.recommendations && budgetData.recommendations.length > 0 && (
          <View style={styles.recommendationsCard}>
            <View style={styles.recommendationsHeader}>
              <Icon name="tips-and-updates" size={24} color="#FF6B35" />
              <Text style={styles.recommendationsTitle}>Travel Tips</Text>
            </View>
            {budgetData.recommendations.map((tip, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.recommendationText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="edit" size={20} color="#FF6B35" />
            <Text style={styles.secondaryButtonText}>Edit Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              // Navigate to booking or save functionality
              alert("Booking functionality coming soon!");
            }}
          >
            <Icon name="bookmark" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Save Estimate</Text>
          </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  tripSummary: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
    marginBottom: 12,
  },
  tripDetails: {
    alignItems: "center",
  },
  tripDetailText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 2,
  },
  totalCostCard: {
    backgroundColor: "#FF6B35",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  totalCostContent: {
    alignItems: "center",
  },
  totalCostLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    opacity: 0.9,
  },
  totalCostAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  perPersonCost: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginTop: 8,
  },
  costCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  costCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  costCardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  costCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  costCardAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  breakdownContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#666",
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  costCardDetails: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: "#FFF9F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE5D9",
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#FF6B35",
    elevation: 2,
  },
  secondaryButtonText: {
    color: "#FF6B35",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});