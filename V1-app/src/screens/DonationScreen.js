import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import temples from "../data/temples.json";


export default function DonationScreen() {
  const [selectedTemple] = useState(temples[0]);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [donationPurpose, setDonationPurpose] = useState("general");

  const donationAmounts = [51, 101, 501, 1001, 2500];
  const donationPurposes = [
    { label: "General Donation", value: "general", icon: "volunteer-activism" },
    { label: "Prasad & Food", value: "prasad", icon: "restaurant" },
    { label: "Temple Maintenance", value: "maintenance", icon: "build" },
    { label: "Festival Celebration", value: "festival", icon: "celebration" },
  ];

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount.toString());
    setCustomAmount("");
  };

  const handleCustomAmountChange = (amount) => {
    setCustomAmount(amount);
    setSelectedAmount("");
  };

  const getFinalAmount = () => {
    return customAmount || selectedAmount;
  };

  const handleDonation = () => {
    const amount = getFinalAmount();

    if (!amount || parseInt(amount) < 1) {
      Alert.alert("Error", "Please enter a valid donation amount");
      return;
    }

    // Mock Razorpay integration
    Alert.alert(
      "Donation Confirmation",
      `Donate ₹${amount} to ${selectedTemple.name}?\n\nPurpose: ${donationPurposes.find((p) => p.value === donationPurpose)?.label}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed to Payment",
          onPress: () => processPayment(amount),
        },
      ],
    );
  };

  const processPayment = (amount) => {
    // Mock payment processing
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      Alert.alert(
        "Donation Successful!",
        `Thank you for your donation of ₹${amount} to ${selectedTemple.name}. Your receipt will be sent via email.`,
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedAmount("");
              setCustomAmount("");
            },
          },
        ],
      );
    }, 1500);
  };

  const renderAmountChip = (amount) => {
    const isSelected = selectedAmount === amount.toString();
    return (
      <TouchableOpacity
        key={amount}
        style={[styles.amountChip, isSelected && styles.selectedAmountChip]}
        onPress={() => handleAmountSelection(amount)}
      >
        <Text
          style={[styles.amountText, isSelected && styles.selectedAmountText]}
        >
          ₹{amount}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPurposeOption = (purpose) => {
    const isSelected = donationPurpose === purpose.value;
    return (
      <TouchableOpacity
        key={purpose.value}
        style={[
          styles.purposeOption,
          isSelected && styles.selectedPurposeOption,
        ]}
        onPress={() => setDonationPurpose(purpose.value)}
      >
        <Icon
          name={purpose.icon}
          size={24}
          color={isSelected ? "#fff" : "#FF6B35"}
        />
        <Text
          style={[styles.purposeText, isSelected && styles.selectedPurposeText]}
        >
          {purpose.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Temple Info */}
      <View style={styles.templeContainer}>
        <View style={styles.templeHeader}>
          <Icon name="temple-hindu" size={40} color="#FF6B35" />
          <View style={styles.templeInfo}>
            <Text style={styles.templeName}>{selectedTemple.trustName}</Text>
            <Text style={styles.templeLocation}>
              {selectedTemple.name}, {selectedTemple.location}
            </Text>
          </View>
        </View>

        {selectedTemple.verified && (
          <View style={styles.verifiedBadge}>
            <Icon name="verified" size={16} color="#4CAF50" />
            <Text style={styles.verifiedText}>Verified Temple Trust</Text>
          </View>
        )}
      </View>

      {/* Donation Amount Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select Donation Amount</Text>

        <View style={styles.amountGrid}>
          {donationAmounts.map(renderAmountChip)}

          <TouchableOpacity
            style={[
              styles.amountChip,
              styles.otherAmountChip,
              customAmount && styles.selectedAmountChip,
            ]}
            onPress={() => {
              setSelectedAmount("");
              // Focus on custom amount input
            }}
          >
            <Text
              style={[
                styles.amountText,
                customAmount && styles.selectedAmountText,
              ]}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>

        {/* Custom Amount Input */}
        <View style={styles.customAmountContainer}>
          <Text style={styles.customAmountLabel}>Custom Amount (₹)</Text>
          <TextInput
            style={styles.customAmountInput}
            placeholder="Enter amount"
            value={customAmount}
            onChangeText={handleCustomAmountChange}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Donation Purpose */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Donation Purpose (Optional)</Text>

        <View style={styles.purposeGrid}>
          {donationPurposes.map(renderPurposeOption)}
        </View>
      </View>

      {/* Donation Summary */}
      {getFinalAmount() && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Donation Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Temple:</Text>
            <Text style={styles.summaryValue}>{selectedTemple.name}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <Text style={styles.summaryAmount}>₹{getFinalAmount()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Purpose:</Text>
            <Text style={styles.summaryValue}>
              {donationPurposes.find((p) => p.value === donationPurpose)?.label}
            </Text>
          </View>
        </View>
      )}

      {/* Donate Button */}
      <TouchableOpacity
        style={[
          styles.donateButton,
          !getFinalAmount() && styles.disabledButton,
        ]}
        onPress={handleDonation}
        disabled={!getFinalAmount()}
      >
        <Icon name="favorite" size={20} color="#fff" />
        <Text style={styles.donateButtonText}>
          Donate {getFinalAmount() ? `₹${getFinalAmount()}` : ""}
        </Text>
      </TouchableOpacity>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Icon name="security" size={16} color="#4CAF50" />
        <Text style={styles.securityText}>
          Your donation is secure and will be processed through Razorpay
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  templeContainer: {
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
  templeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  templeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  templeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  templeLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  verifiedText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  sectionContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amountChip: {
    backgroundColor: "#F8F8F8",
    borderWidth: 2,
    borderColor: "#FF6B35",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 12,
    minWidth: "30%",
    alignItems: "center",
  },
  selectedAmountChip: {
    backgroundColor: "#FF6B35",
  },
  otherAmountChip: {
    minWidth: "30%",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
  selectedAmountText: {
    color: "#fff",
  },
  customAmountContainer: {
    marginTop: 16,
  },
  customAmountLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  customAmountInput: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  purposeGrid: {
    gap: 12,
  },
  purposeOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderWidth: 2,
    borderColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectedPurposeOption: {
    backgroundColor: "#FF6B35",
  },
  purposeText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#FF6B35",
    fontWeight: "500",
  },
  selectedPurposeText: {
    color: "#fff",
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
    marginBottom: 16,
  },
  summaryRow: {
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
    flex: 1,
    textAlign: "right",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  donateButton: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    margin: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  securityText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#4CAF50",
    textAlign: "center",
  },
});
